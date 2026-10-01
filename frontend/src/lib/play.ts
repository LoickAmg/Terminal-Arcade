import {
  SABOTAGE_INFO,
  TIER_LABELS,
  TIMER_LABELS,
  adjust,
  applyEvent,
  canReplayChaos,
  canReplayTimer,
  chaosOnAnswer,
  chaosTick,
  chaosXp,
  createChaos,
  createTimer,
  currentQuestion,
  falsifyCode,
  fool,
  formatTime,
  hintsAllowed,
  isChaos,
  isExpired,
  isFinished,
  isTimed,
  isUnlocked,
  logSabotage,
  markDetected,
  nativeMode,
  nextHint,
  playMode,
  random,
  recap as computeRecap,
  recordRun,
  skip,
  startRun,
  submit,
  tick,
  timeGoalMet,
  timedXp,
  zoneOf,
  type ChaosEntry,
  type Level,
  type PlayMode,
  type Question,
  type Recap,
  type Run,
  type Sabotage,
  type TimerEvent,
  type TimerState,
} from "@terminal-arcade/shared";
import { ansi } from "./ansi";
import {
  KIND_LABELS,
  LEVEL_KEYWORDS,
  activeLevel,
  matches,
  playedLevel,
  type ActiveLevel,
  type ChaosRun,
  type Feedback,
  type GameState,
  type LineResult,
  type PetReaction,
} from "./state";

// Déroulé d'un niveau : questions, temps (phase 2) et sabotages du mode
// Chaos (phase 3). Règle du Chaos : les lignes « <compagnon> : … » sont
// ses verdicts et peuvent mentir ; tout le reste du terminal dit vrai.

export type OpenOptions = { timer: boolean; chaos: boolean };

const MODE_LABELS: Record<PlayMode, string> = {
  classic: "Classique",
  timer: "Timer",
  chaos: "Chaos",
  chaos_timer: "Chaos + Timer",
};

export function openFlags(args: string[]): { rest: string[]; options: OpenOptions } {
  return {
    rest: args.filter((a) => a !== "--timer" && a !== "--chaos"),
    options: { timer: args.includes("--timer"), chaos: args.includes("--chaos") },
  };
}

export function openLevel(
  state: GameState,
  id: string,
  levels: Level[],
  options: OpenOptions,
  rng: () => number = Math.random,
): LineResult {
  if (id === "") return { state, out: [`Usage : ${ansi.cyan("open <niveau> [--timer] [--chaos]")}`] };
  const level = levels.find((l) => l.id === id);
  if (!level) return { state, out: [`open: ${id} : niveau introuvable. Tape ls missions/.`] };
  if (!isUnlocked(level, levels, state.progress)) {
    const parent = levels.find((l) => l.rewards.unlocks === level.id);
    return {
      state,
      out: [`${id} est verrouillé.${parent ? ` Réussis d'abord ${ansi.cyan(parent.id)}.` : ""}`],
    };
  }

  const mode = playMode(level, state.progress, options);
  if (!mode) {
    const passed = state.progress.levels[level.id]?.status === "passed";
    return {
      state,
      out: [
        passed
          ? `${level.id} ne se rejoue pas ${options.timer && !(level.replay.timer && level.timer) ? "en Timer" : "en Chaos"}.`
          : `Réussis d'abord ${ansi.cyan(level.id)} pour le rejouer avec des couches en plus.`,
      ],
    };
  }

  const timer = isTimed(mode) && level.timer ? createTimer(level.timer, { mobile: state.mobile, rng }) : null;
  const chaos: ChaosRun | null = isChaos(mode)
    ? {
        state: createChaos(level, Math.floor(rng() * 2 ** 32)),
        blockedKey: null,
        terminalClosed: false,
        timeEffect: null,
        overrides: {},
        falsified: {},
        lie: null,
        lastReculMs: null,
        uselessVerifies: 0,
      }
    : null;

  const run = startRun(level);
  const next: GameState = {
    ...state,
    active: { levelId: level.id, run, mode, timer, lastDelta: null, chaos },
    feedback: null,
    screen: { kind: "question" },
  };
  return {
    state: next,
    out: [
      "",
      ansi.inverse(` ${TIER_LABELS[level.tier].toUpperCase()} // ${level.id.toUpperCase()} `) +
        `  ${ansi.bold(level.title)}${mode === "classic" ? "" : ansi.yellow(`  [${MODE_LABELS[mode]}]`)}`,
      ...(level.intro ? [ansi.dim(level.intro)] : []),
      ...(timer ? timerIntro(timer) : []),
      ...(chaos ? chaosIntro(state.pet.name) : []),
      ansi.dim(`hint : indice  ·  skip : passer  ·  quit : quitter${chaos ? "  ·  verify  ·  clock" : ""}`),
      ...questionLines(level, run),
    ],
    reaction: chaos ? "mischief" : undefined,
    say: chaos ? "On va bien s'amuser." : undefined,
  };
}

function timerIntro(timer: TimerState): string[] {
  const label = ansi.yellow(`⏱ ${TIMER_LABELS[timer.mode].toUpperCase()}`);
  switch (timer.mode) {
    case "countdown":
      return [`${label}  ${formatTime(timer.initialMs)} pour tout finir.`];
    case "chrono":
      return [
        `${label}  limite ${formatTime(timer.initialMs)}, référence ${formatTime(timer.parMs)}.`,
        ansi.dim("Erreur +5 s, abandon +15 s, indice +son coût."),
      ];
    case "reverse":
      return [
        `${label}  ${formatTime(timer.initialMs)} au départ.`,
        ansi.dim("Erreur −10 s, abandon −15 s, indice −son coût ; bonne réponse du premier coup +5 s."),
        ansi.dim("Sous 50 % les indices coûtent double, sous 25 % ils sont bloqués."),
      ];
    case "buyback":
      return [
        `${label}  départ à ${formatTime(timer.valueMs)}, objectif ${formatTime(timer.initialMs)}.`,
        ansi.dim("Premier coup +12 s, bonne réponse +6 s, erreur −5 s, abandon −15 s."),
        ansi.dim("Reviens au temps initial avant la fin du niveau."),
      ];
  }
}

function chaosIntro(petName: string): string[] {
  return [
    ansi.red(ansi.bold(`☠ CHAOS — ${petName} va saboter la partie.`)),
    ansi.dim(`Les lignes « ${petName} : … » sont ses verdicts : il peut mentir. Le reste du terminal dit vrai.`),
    ansi.dim(`${ansi.cyan("verify")} vérifie ta dernière réponse · ${ansi.cyan("clock")} donne le vrai temps.`),
  ];
}

// --- Affichage des questions ---------------------------------------------

export function questionLines(level: Level, run: Run): string[] {
  const q = currentQuestion(level, run);
  if (!q) return [];
  const lines = [
    "",
    ansi.yellow(`── Q${run.index + 1}/${level.questions.length} · ${KIND_LABELS[q.kind].toUpperCase()} ──`),
    q.prompt,
  ];
  if (q.kind === "fill") {
    lines.push(`  ${ansi.cyan(q.template.replace("___", ansi.inverse(" ___ ") + "\x1b[36m"))}`);
  }
  if ((q.kind === "mcq" || q.kind === "trap" || q.kind === "predict") && q.code) {
    for (const codeLine of q.code.trimEnd().split("\n")) lines.push(`  ${ansi.cyan(codeLine)}`);
  }
  if (q.kind === "mcq" || q.kind === "trap") {
    q.choices.forEach((c, i) => lines.push(`  ${ansi.bold(String(i + 1))}. ${c}`));
  }
  return lines;
}

// --- Saisie pendant un niveau --------------------------------------------

export function levelInput(state: GameState, levels: Level[], line: string): LineResult {
  const level = playedLevel(state, levels)!;
  const active = state.active!;
  const run = active.run;
  const q = currentQuestion(level, run)!;
  const petName = state.pet.name;
  const withActive = (patch: Partial<ActiveLevel>, extra: Partial<GameState> = {}): GameState => ({
    ...state,
    active: { ...active, ...patch },
    ...extra,
  });

  if (line === "") return { state, out: [] };

  if (matches(line, LEVEL_KEYWORDS.help)) {
    return {
      state,
      out: [
        ansi.dim("Réponds à la question, ou :"),
        `  ${ansi.cyan("hint")}    un indice (réduit l'XP de la question${active.timer ? ", coûte du temps" : ""})`,
        `  ${ansi.cyan("skip")}    passer la question (0 XP) et voir la réponse`,
        `  ${ansi.cyan("quit")}    quitter le niveau`,
        ...(active.chaos
          ? [
              `  ${ansi.cyan("verify")}  vérifier le verdict de ta dernière réponse`,
              `  ${ansi.cyan("clock")}   afficher le vrai temps (coûte 3 s)`,
            ]
          : active.timer
            ? [`  ${ansi.cyan("clock")}   afficher le temps exact (coûte 3 s)`]
            : []),
      ],
    };
  }

  if (matches(line, LEVEL_KEYWORDS.verify)) return verify(state, level, levels);
  if (matches(line, LEVEL_KEYWORDS.clock) && active.timer) return clock(state);

  if (matches(line, LEVEL_KEYWORDS.hint)) {
    if (!hintsAllowed(active.timer)) {
      return { state, out: [ansi.red("Zone critique : les indices sont bloqués.")], reaction: "alarm" };
    }
    const hint = nextHint(level, run);
    if (!hint) return { state, out: [ansi.dim("Plus d'indice pour cette question.")] };
    const timed = timeEvent(active, "hint", q.hints[run.hintsUsed].cost_s);
    const next = withActive(
      { run: hint.run, ...timed.patch },
      { feedback: { tone: "info", title: `Indice : ${hint.text}` } },
    );
    const out = [`${ansi.yellow("Indice")} : ${hint.text}${timed.text}`, ...timed.alarm];
    if (timed.expired) return finishLevel(next, levels, out, true);
    return { state: next, out, reaction: timed.alarm.length ? "alarm" : "think" };
  }

  if (matches(line, LEVEL_KEYWORDS.quit)) {
    const partial = computeRecap(level, run);
    return {
      state: {
        ...state,
        active: null,
        feedback: null,
        screen: { kind: "missions" },
        progress: recordRun(state.progress, level, { xp: partial.xp, passed: false, mode: active.mode }),
      },
      out: [ansi.dim(`Niveau ${level.id} quitté.`)],
    };
  }

  // Une nouvelle réponse referme la fenêtre de vérification du verdict précédent.
  const chaosBase: ChaosRun | null = active.chaos ? { ...active.chaos, lie: null } : null;

  if (matches(line, LEVEL_KEYWORDS.skip)) {
    const skipped = skip(level, run)!;
    const timed = timeEvent(active, "skip");
    const feedback: Feedback = { tone: "info", title: `Réponse : ${skipped.expected}`, explain: q.explain };
    const out = [`${ansi.dim("Question passée. Réponse :")} ${ansi.cyan(skipped.expected)}${timed.text}`];
    if (q.explain) out.push(ansi.dim(q.explain));
    out.push(...timed.alarm);
    const next = withActive({ run: skipped.run, chaos: chaosBase, ...timed.patch }, { feedback });
    if (timed.expired) return finishLevel(next, levels, out, true);
    return proceed(next, levels, out, "sad");
  }

  const { run: after, check } = submit(level, run, line);
  if (check.kind === "invalid") return { state, out: [ansi.yellow(check.reason)] };
  const correct = check.kind === "correct";

  // Chaos : Arcade annonce le verdict, et ment peut-être.
  let chaos = chaosBase;
  let lie: "false_red" | "false_green" | null = null;
  if (chaos) {
    const decision = chaosOnAnswer(chaos.state, level.tier, correct);
    lie = decision.lie;
    chaos = { ...chaos, state: decision.chaos };
    if (correct && chaos.falsified[run.index] !== undefined) {
      // Il a répondu juste malgré le code falsifié : il a fait confiance au terminal.
      chaos = { ...chaos, state: markDetected(chaos.state, ["falsify_code"]) };
    }
  }
  const claim = (text: string) => (chaos ? `${ansi.yellow(`${petName} :`)} ${text}` : text);

  if (lie === "false_red") {
    chaos = {
      ...chaos!,
      lie: { kind: "false_red", answer: line },
      state: logSabotage(chaos!.state, {
        kind: "false_red",
        question: run.index,
        note: `Q${run.index + 1} : ta bonne réponse « ${line} » annoncée fausse`,
      }),
    };
    return {
      state: withActive(
        { chaos },
        { feedback: { tone: "bad", title: "Pas tout à fait. Réessaie.", claimedBy: petName } },
      ),
      out: [claim(`${ansi.red("✘")} Pas tout à fait.`)],
      reaction: "sad",
    };
  }

  if (lie === "false_green") {
    const fooled = fool(level, run);
    chaos = {
      ...chaos!,
      lie: { kind: "false_green", before: run },
      state: logSabotage(chaos!.state, {
        kind: "false_green",
        question: run.index,
        note: `Q${run.index + 1} : ta mauvaise réponse « ${line} » annoncée juste`,
      }),
    };
    const next = withActive(
      { run: fooled, chaos },
      { feedback: { tone: "good", title: "Correct.", claimedBy: petName } },
    );
    return proceed(next, levels, [claim(`${ansi.green("✔")} Correct.`)], "happy");
  }

  if (!correct) {
    const timed = timeEvent(active, "wrong");
    const hintLeft = q.hints.length > run.hintsUsed && hintsAllowed(timed.patch.timer ?? null);
    const next = withActive(
      { run: after, chaos, ...timed.patch },
      {
        feedback: {
          tone: "bad",
          title: `Pas tout à fait. Réessaie.${timed.plain}`,
          claimedBy: chaos ? petName : undefined,
        },
      },
    );
    const out = [
      claim(`${ansi.red("✘")} Pas tout à fait.${timed.text}${hintLeft ? ` Tape ${ansi.cyan("hint")} pour un indice.` : ""}`),
      ...timed.alarm,
    ];
    if (timed.expired) return finishLevel(next, levels, out, true);
    return { state: next, out, reaction: timed.alarm.length ? "alarm" : "sad" };
  }

  const firstTry = run.wrongAttempts === 0 && run.hintsUsed === 0;
  const timed = timeEvent(active, firstTry ? "first_try" : "correct");
  const output = q.kind === "command" ? q.output?.trimEnd() : undefined;
  const out = [claim(`${ansi.green("✔")} Correct.${timed.text}`)];
  if (output) out.push(...output.split("\n").map((l) => ansi.dim(l)));
  if (q.explain) out.push(ansi.dim(`→ ${q.explain}`));
  const feedback: Feedback = {
    tone: "good",
    title: `Correct.${timed.plain}`,
    output,
    explain: q.explain,
    claimedBy: chaos ? petName : undefined,
  };
  return proceed(withActive({ run: after, chaos, ...timed.patch }, { feedback }), levels, out, "happy");
}

// --- Vérifications (sources de vérité) -----------------------------------

const VERIFY_COST_MS = 5_000;
const CLOCK_COST_MS = 3_000;
const UNMASK_REWARD_MS = 5_000;

function withCost(active: ActiveLevel, costMs: number): Partial<ActiveLevel> {
  if (!active.timer) return {};
  return {
    timer: adjust(active.timer, -costMs),
    lastDelta: { ms: -costMs, id: (active.lastDelta?.id ?? 0) + 1 },
  };
}

function verify(state: GameState, level: Level, levels: Level[]): LineResult {
  const active = state.active!;
  const chaos = active.chaos;
  if (!chaos) {
    return { state, out: [ansi.dim("Rien à vérifier : hors Chaos, les verdicts sont toujours vrais.")] };
  }
  const cost = withCost(active, VERIFY_COST_MS);
  const costText = active.timer ? ansi.red(" (−5 s)") : "";
  const lie = chaos.lie;

  if (!lie) {
    return {
      state: {
        ...state,
        active: { ...active, ...cost, chaos: { ...chaos, uselessVerifies: chaos.uselessVerifies + 1 } },
      },
      out: [`${ansi.cyan("Vérification")} : le dernier verdict était vrai.${costText}`],
      reaction: "think",
      say: "Je t'avais dit la vérité, cette fois.",
    };
  }

  const reward = active.timer ? adjust(cost.timer ?? active.timer, UNMASK_REWARD_MS) : null;
  const timerPatch: Partial<ActiveLevel> = reward
    ? { timer: reward, lastDelta: { ms: UNMASK_REWARD_MS - VERIFY_COST_MS, id: (active.lastDelta?.id ?? 0) + 1 } }
    : {};
  const detected = { ...chaos, lie: null, state: markDetected(chaos.state, [lie.kind]) };

  if (lie.kind === "false_red") {
    // Sa réponse était juste : on la valide pour de bon.
    const { run } = submit(level, active.run, lie.answer);
    const next: GameState = {
      ...state,
      active: { ...active, ...timerPatch, run, chaos: detected },
      feedback: { tone: "good", title: "Démasqué ! Ta réponse était juste." },
    };
    return proceed(
      next,
      levels,
      [`${ansi.green("✔ Démasqué !")} Ta réponse était juste : ${state.pet.name} a menti.`],
      "mischief",
      "Bien vu…",
    );
  }

  // false_green : sa réponse était fausse ; retour à la question.
  const run = { ...lie.before, wrongAttempts: lie.before.wrongAttempts + 1 };
  const next: GameState = {
    ...state,
    active: { ...active, ...timerPatch, run, chaos: detected },
    feedback: { tone: "bad", title: "Démasqué ! Ta réponse était fausse." },
    screen: { kind: "question" },
  };
  return {
    state: next,
    out: [
      `${ansi.green("✔ Démasqué !")} Ta réponse était fausse : ${state.pet.name} t'a laissé passer. Retour à la question.`,
      ...questionLines(level, run),
    ],
    reaction: "mischief",
    say: "Repéré…",
  };
}

function clock(state: GameState): LineResult {
  const active = state.active!;
  const timer = active.timer!;
  const cost = withCost(active, CLOCK_COST_MS);
  let chaos = active.chaos;
  let note = "";
  if (chaos) {
    const effect = chaos.timeEffect;
    const now = chaos.state.elapsedMs;
    const recentRecul = chaos.lastReculMs !== null && now - chaos.lastReculMs < 15_000;
    if (effect || recentRecul) {
      const kinds: Sabotage[] = effect
        ? [effect.kind === "accel" ? "time_accel" : effect.kind === "freeze" ? "time_freeze" : "time_fluctuate"]
        : ["time_recul"];
      chaos = {
        ...chaos,
        // Une illusion s'arrête dès qu'on regarde la vraie horloge.
        timeEffect: effect && effect.kind !== "accel" ? null : effect,
        state: markDetected(chaos.state, kinds),
      };
      note = ansi.green(` Démasqué : ${SABOTAGE_INFO[kinds[0]].label}.`);
    }
  }
  const real = cost.timer ?? timer;
  const value =
    real.mode === "chrono"
      ? `${formatTime(real.valueMs)} écoulé sur ${formatTime(real.initialMs)}`
      : `${formatTime(real.valueMs)} restant${real.mode === "buyback" ? `, objectif ${formatTime(real.initialMs)}` : ""}`;
  return {
    state: { ...state, active: { ...active, ...cost, chaos } },
    out: [`${ansi.cyan("⏱ Vrai temps")} : ${value}${ansi.red(" (−3 s)")}${note}`],
    reaction: note ? "mischief" : undefined,
  };
}

// --- Temps ---------------------------------------------------------------

const ZONE_RANK = { normal: 0, alerte: 1, critique: 2, limite: 3 } as const;

function zoneMessage(timer: TimerState): string[] {
  const penalized = timer.mode === "reverse" || timer.mode === "buyback";
  switch (zoneOf(timer)) {
    case "alerte":
      return [ansi.yellow(`⏱ Moins de la moitié du temps.${penalized ? " Les indices coûtent double." : ""}`)];
    case "critique":
      return [ansi.red(`⏱ Zone critique !${penalized ? " Les indices sont bloqués." : ""}`)];
    default:
      return [];
  }
}

/** Effet d'un événement de jeu sur le timer de la partie en cours. */
function timeEvent(
  active: ActiveLevel,
  event: TimerEvent,
  hintCostS = 0,
): { patch: Partial<ActiveLevel>; text: string; plain: string; alarm: string[]; expired: boolean } {
  if (!active.timer) return { patch: {}, text: "", plain: "", alarm: [], expired: false };
  const { timer, deltaMs } = applyEvent(active.timer, event, hintCostS);
  if (deltaMs === 0) return { patch: { timer }, text: "", plain: "", alarm: [], expired: false };

  // Pour le joueur, un delta positif est toujours une bonne nouvelle. Au
  // chrono, une pénalité s'affiche en secondes ajoutées.
  const seconds = Math.round(Math.abs(deltaMs) / 1000);
  const plain =
    timer.mode === "chrono" ? ` (+${seconds} s au chrono)` : ` (${deltaMs > 0 ? "+" : "−"}${seconds} s)`;
  const worse = ZONE_RANK[zoneOf(timer)] > ZONE_RANK[zoneOf(active.timer)];
  return {
    patch: { timer, lastDelta: { ms: deltaMs, id: (active.lastDelta?.id ?? 0) + 1 } },
    text: deltaMs > 0 ? ansi.green(plain) : ansi.red(plain),
    plain,
    alarm: worse ? zoneMessage(timer) : [],
    expired: isExpired(timer),
  };
}

/** Le timer tel que le joueur le voit : les illusions du Chaos s'y appliquent. */
export function displayedTimer(active: ActiveLevel): TimerState | null {
  const timer = active.timer;
  const effect = active.chaos?.timeEffect;
  if (!timer || !effect || effect.kind === "accel") return timer;
  if (effect.kind === "freeze") return { ...timer, valueMs: effect.frozenMs };
  const t = active.chaos!.state.elapsedMs - effect.startMs;
  const offset = 7_000 * Math.sin(t / 650) * Math.sin(t / 2300);
  return { ...timer, valueMs: Math.max(0, Math.min(timer.initialMs, timer.valueMs + offset)) };
}

// --- Horloge : temps et sabotages ----------------------------------------

/**
 * Fait avancer la partie en cours (timer et Chaos). Renvoie null s'il n'y a
 * rien à faire avancer, sinon le nouvel état et les lignes éventuelles.
 */
export function tickGame(state: GameState, levels: Level[], elapsedMs: number): LineResult | null {
  const active = state.active;
  const level = playedLevel(state, levels);
  if (!active || !level || (!active.timer && !active.chaos)) return null;

  let chaos = active.chaos;
  let timer = active.timer;
  let lastDelta = active.lastDelta;
  const out: string[] = [];
  let reaction: PetReaction | undefined;
  let say: string | undefined;

  // Effets en cours qui expirent.
  if (chaos) {
    const now = chaos.state.elapsedMs + elapsedMs;
    chaos = {
      ...chaos,
      blockedKey: chaos.blockedKey && chaos.blockedKey.untilMs > now ? chaos.blockedKey : null,
      timeEffect: chaos.timeEffect && chaos.timeEffect.untilMs > now ? chaos.timeEffect : null,
    };
  }

  // Le temps réel, accéléré si Arcade s'en mêle.
  if (timer) {
    const factor = chaos?.timeEffect?.kind === "accel" ? 2 : 1;
    const before = timer;
    timer = tick(timer, elapsedMs * factor);
    if (ZONE_RANK[zoneOf(timer)] > ZONE_RANK[zoneOf(before)] && !isExpired(timer)) {
      out.push(...zoneMessage(timer));
      reaction = "alarm";
    }
  }

  // Un sabotage, peut-être (jamais pendant que le terminal est fermé).
  if (chaos) {
    const q = currentQuestion(level, active.run);
    const index = active.run.index;
    const hasCode = !!q && "code" in q && !!q.code && chaos.falsified[index] === undefined;
    const answer = !q ? "" : "accept" in q ? q.accept[0] : String(q.answer);
    const ctx = {
      timed: !!timer,
      hasVariant: !!q?.variant && chaos.overrides[index] === undefined,
      hasCode,
      canBlockKey: !!q && (q.kind === "mcq" || q.kind === "trap" || (q.kind === "command" && answer.length > 2)),
      usedHere: chaos.state.log.filter((e) => e.question === index).map((e) => e.kind),
    };
    const decision = chaos.terminalClosed
      ? { chaos: { ...chaos.state, elapsedMs: chaos.state.elapsedMs + elapsedMs }, fire: null }
      : chaosTick(chaos.state, level.tier, elapsedMs, ctx);
    chaos = { ...chaos, state: decision.chaos };
    if (decision.fire && q) {
      const applied = applySabotage(chaos, decision.fire, level, active.run, q, timer, state.pet.name);
      chaos = applied.chaos;
      if (applied.timer) {
        lastDelta = { ms: applied.timer.valueMs - (timer?.valueMs ?? 0), id: (lastDelta?.id ?? 0) + 1 };
        timer = applied.timer;
      }
      out.push(...applied.out);
      reaction = "mischief";
      say = applied.say;
    }
  }

  const next: GameState = { ...state, active: { ...active, timer, chaos, lastDelta } };
  if (timer && isExpired(timer)) {
    return finishLevel(next, levels, [...out, "", ansi.red(ansi.bold("⏱ Temps écoulé !"))], true);
  }
  return { state: next, out, reaction, say };
}

function applySabotage(
  chaos: ChaosRun,
  kind: Sabotage,
  level: Level,
  run: Run,
  q: Question,
  timer: TimerState | null,
  petName: string,
): { chaos: ChaosRun; timer?: TimerState; out: string[]; say?: string } {
  const now = chaos.state.elapsedMs;
  const index = run.index;
  const log = (note: string) => logSabotage(chaos.state, { kind, question: index, note });
  const [roll] = random(chaos.state.seed ^ 0x9e3779b9);

  switch (kind) {
    case "block_key": {
      // Une touche utile pour la réponse : un chiffre pour un QCM, sinon une
      // lettre de la commande attendue. Toujours contournable : le choix se
      // tape aussi en toutes lettres (ou se touche), et ça ne dure que 12 s.
      const source = "choices" in q ? String(q.answer) : "accept" in q ? q.accept[0] : "";
      const letters = Array.from(new Set(source.toLowerCase().replace(/[^a-z0-9]/g, "")));
      const key = letters.length ? letters[Math.floor(roll * letters.length)] : "e";
      return {
        chaos: { ...chaos, blockedKey: { key, untilMs: now + 12_000 }, state: log(`touche « ${key} » bloquée 12 s`) },
        out: [`${ansi.yellow(`${petName} :`)} miam, j'ai mangé la touche « ${key} ». Elle revient dans 12 s.`],
        say: `Miam, la touche ${key} !`,
      };
    }
    case "close_terminal":
      return {
        chaos: { ...chaos, terminalClosed: true, state: log("terminal fermé") },
        out: [`${ansi.yellow(`${petName} :`)} oups, j'ai fermé ton terminal.`],
        say: "Oups, terminal fermé !",
      };
    case "mutation": {
      const variant = q.variant!;
      return {
        chaos: {
          ...chaos,
          overrides: { ...chaos.overrides, [index]: variant },
          state: log(`Q${index + 1} : énoncé remplacé`),
        },
        out: [
          ansi.red("▒▒▓▒ ▒▒▒▓▒▒ ▓▒▒▒▒ ▒▒▓▒▒▒"),
          ...questionLines({ ...level, questions: level.questions.map((x, i) => (i === index ? variant : x)) }, run),
        ],
        say: "Relis bien…",
      };
    }
    case "falsify_code": {
      const code = "code" in q ? (q.code ?? "") : "";
      return {
        // Silencieux : seul l'écran change, le terminal garde le vrai code.
        chaos: {
          ...chaos,
          falsified: { ...chaos.falsified, [index]: falsifyCode(code, chaos.state.seed) },
          state: log(`Q${index + 1} : code modifié à l'écran`),
        },
        out: [],
        say: "Hé hé.",
      };
    }
    case "time_accel":
      return {
        chaos: {
          ...chaos,
          timeEffect: { kind: "accel", startMs: now, untilMs: now + 8_000, frozenMs: 0 },
          state: log("temps accéléré ×2 pendant 8 s"),
        },
        out: [],
        say: "Ça file, non ?",
      };
    case "time_recul":
      return {
        chaos: { ...chaos, lastReculMs: now, state: log("8 s retirées au timer") },
        timer: timer ? adjust(timer, -8_000) : undefined,
        out: [],
        say: "Oups, 8 secondes.",
      };
    case "time_freeze":
      return {
        chaos: {
          ...chaos,
          timeEffect: { kind: "freeze", startMs: now, untilMs: now + 10_000, frozenMs: timer?.valueMs ?? 0 },
          state: log("timer figé à l'écran pendant 10 s"),
        },
        out: [],
        say: "Prends ton temps…",
      };
    case "time_fluctuate":
      return {
        chaos: {
          ...chaos,
          timeEffect: { kind: "fluctuate", startMs: now, untilMs: now + 12_000, frozenMs: 0 },
          state: log("timer instable à l'écran pendant 12 s"),
        },
        out: [],
        say: "Le temps est relatif.",
      };
    default:
      return { chaos, out: [] };
  }
}

/** Le joueur rouvre le terminal fermé par Arcade. */
export function reopenTerminal(state: GameState): LineResult {
  const chaos = state.active?.chaos;
  if (!chaos?.terminalClosed) return { state, out: [] };
  return {
    state: {
      ...state,
      active: {
        ...state.active!,
        chaos: { ...chaos, terminalClosed: false, state: markDetected(chaos.state, ["close_terminal"]) },
      },
    },
    out: [ansi.dim("Terminal rouvert. Rien n'est perdu.")],
    reaction: "mischief",
    say: "Pff, déjà ?",
  };
}

export function blockedKey(state: GameState): string | null {
  return state.active?.chaos?.blockedKey?.key ?? null;
}

// --- Fin de niveau -------------------------------------------------------

/** Après une réponse validée ou passée : question suivante, ou fin du niveau. */
function proceed(
  state: GameState,
  levels: Level[],
  out: string[],
  reaction: PetReaction,
  say?: string,
): LineResult {
  const level = playedLevel(state, levels) ?? levels.find((l) => l.id === state.active!.levelId)!;
  const run = state.active!.run;
  if (!isFinished(level, run)) {
    return { state, out: [...out, ...questionLines(level, run)], reaction, say };
  }
  return finishLevel(state, levels, out, false);
}

function timeSummary(timer: TimerState, timedOut: boolean): string {
  if (timedOut) return ansi.red("  Temps écoulé avant la fin.");
  switch (timer.mode) {
    case "chrono":
      return `  Temps : ${formatTime(timer.valueMs)} (référence ${formatTime(timer.parMs)})`;
    case "buyback":
      return timer.restored
        ? ansi.green(`  Temps racheté : retour à ${formatTime(timer.initialMs)} atteint.`)
        : ansi.red(`  Rachat raté : il fallait revenir à ${formatTime(timer.initialMs)}.`);
    default:
      return `  Temps restant : ${formatTime(timer.valueMs)}`;
  }
}

export function chaosLogLines(log: ChaosEntry[], petName: string): string[] {
  if (log.length === 0) return [ansi.dim(`  ${petName} n'a finalement rien saboté.`)];
  return [
    ansi.bold(`  Ce que ${petName} a fait :`),
    ...log.map(
      (e) =>
        `  ${ansi.dim(formatTime(e.atMs).padStart(5))}  ${e.note}  ${
          e.detected ? ansi.green("✔ démasqué") : ansi.red("✘ passé inaperçu")
        }`,
    ),
  ];
}

function finishLevel(state: GameState, levels: Level[], out: string[], timedOut: boolean): LineResult {
  const active = state.active!;
  const level = playedLevel(state, levels)!;
  const baseLevel = activeLevel(state, levels)!;
  const { run, timer, chaos, mode } = active;
  const base = computeRecap(level, run);
  const passed = base.passed && !timedOut && (!timer || timeGoalMet(timer));
  let xp = timer && !timedOut ? timedXp(base.xp, level.rewards.xp, timer) : base.xp;
  if (chaos) xp = chaosXp(xp, level.rewards.xp, chaos.state, chaos.uselessVerifies);
  const result: Recap = { ...base, xp, passed };

  const progress = recordRun(state.progress, baseLevel, { xp, passed, mode });
  const nextLevel = levels.find((l) => l.id === level.rewards.unlocks);
  const nextId = nextLevel && isUnlocked(nextLevel, levels, progress) ? nextLevel.id : null;
  const replays = {
    timer: !isTimed(mode) && canReplayTimer(baseLevel, progress),
    chaos: !isChaos(mode) && canReplayChaos(baseLevel, progress),
  };

  const flags = [
    isTimed(mode) && !isTimed(nativeMode(level)) ? " --timer" : "",
    isChaos(mode) && !isChaos(nativeMode(level)) ? " --chaos" : "",
  ].join("");
  const retry = ansi.cyan(`open ${level.id}${flags}`);
  const failure = timedOut
    ? `Le temps a manqué. Réessaie : ${retry}`
    : !base.passed
      ? `Il faut 60 % de bonnes réponses. Réessaie : ${retry}`
      : `Objectif de temps manqué. Réessaie : ${retry}`;

  const summary = [
    ...out,
    "",
    passed
      ? ansi.green(ansi.bold(`NIVEAU HACKÉ — ${level.title}`))
      : ansi.red(ansi.bold(`NIVEAU ÉCHOUÉ — ${level.title}`)),
    `  ${result.correct}/${result.total} bonnes réponses, dont ${result.firstTry} du premier coup`,
    ...(timer ? [timeSummary(timer, timedOut)] : []),
    ...(chaos ? chaosLogLines(chaos.state.log, state.pet.name) : []),
    `  +${result.xp} XP${mode !== "classic" ? ansi.dim(` (mode ${MODE_LABELS[mode]})`) : ""}`,
    ...(passed
      ? [
          nextId ? `Suivant : ${ansi.cyan(`open ${nextId}`)}` : `Retour à la liste : ${ansi.cyan("ls missions/")}`,
          ...(replays.timer ? [`Rejoue-le chronométré : ${ansi.cyan(`open ${level.id} --timer`)}`] : []),
          ...(replays.chaos ? [`Rejoue-le en Chaos : ${ansi.cyan(`open ${level.id} --chaos`)}`] : []),
        ]
      : [failure]),
  ];

  return {
    state: {
      ...state,
      active: null,
      progress,
      screen: {
        kind: "recap",
        levelId: level.id,
        recap: result,
        nextId,
        mode,
        timer,
        timedOut,
        replays,
        chaosLog: chaos ? chaos.state.log : null,
      },
    },
    out: summary,
    reaction: passed ? "cheer" : "sad",
  };
}

