import {
  EMPTY_PROGRESS,
  TIER_LABELS,
  TIMER_LABELS,
  TREE_LABELS,
  applyEvent,
  canReplayTimer,
  createTimer,
  currentQuestion,
  formatTime,
  hintsAllowed,
  isExpired,
  isFinished,
  isUnlocked,
  nativeMode,
  nextHint,
  recap as computeRecap,
  recordRun,
  skip,
  startRun,
  statusOf,
  submit,
  tick,
  timeGoalMet,
  timedXp,
  zoneOf,
  type Level,
  type PlayMode,
  type Progress,
  type Question,
  type Recap,
  type Run,
  type TimerEvent,
  type TimerState,
} from "@terminal-arcade/shared";
import { ansi } from "./ansi";
import {
  DEFAULT_PET,
  PET_ACCESSORIES,
  PET_COLORS,
  PET_FORMS,
  sanitizePetName,
  type PetConfig,
} from "./pet";

// Machine de jeu, sans React ni xterm : une ligne tapée entre, un nouvel
// état et les lignes à afficher sortent. Tout ce que le joueur fait passe
// par ici, qu'il tape au clavier, clique une bannière ou touche une bulle.

export type Feedback = {
  tone: "good" | "bad" | "info";
  title: string;
  output?: string;
  explain?: string;
};

export type Screen =
  | { kind: "welcome" }
  | { kind: "missions" }
  | { kind: "question" }
  | {
      kind: "recap";
      levelId: string;
      recap: Recap;
      nextId: string | null;
      // Temps final d'une partie chronométrée, et cause de l'échec éventuel.
      timer: TimerState | null;
      timedOut: boolean;
      timerReplay: boolean;
    }
  | { kind: "profile" }
  | { kind: "pet" };

type WizardStep = "form" | "color" | "accessory" | "name";
export type Wizard = { step: WizardStep; draft: PetConfig; firstTime: boolean };

export type ActiveLevel = {
  levelId: string;
  run: Run;
  mode: PlayMode;
  timer: TimerState | null;
  // Dernier gain ou perte de temps, pour l'animation du bandeau.
  lastDelta: { ms: number; id: number } | null;
};

export type GameState = {
  screen: Screen;
  active: ActiveLevel | null;
  // Écran tactile : les durées des niveaux chronométrés sont allongées.
  mobile: boolean;
  feedback: Feedback | null;
  wizard: Wizard | null;
  progress: Progress;
  pet: PetConfig;
  petHidden: boolean;
};

export type PetReaction = "happy" | "sad" | "cheer" | "think" | "alarm";

export type LineResult = {
  state: GameState;
  out: string[];
  clear?: boolean;
  reaction?: PetReaction;
};

export const KIND_LABELS: Record<Question["kind"], string> = {
  command: "Commande",
  mcq: "QCM",
  trap: "Piège",
  predict: "Prédis la sortie",
  fill: "Complète",
};

const LEVEL_KEYWORDS = {
  hint: ["hint", "indice"],
  skip: ["skip", "passer"],
  quit: ["quit", "exit", "quitter"],
  help: ["help", "aide"],
};

export function initialState(
  progress: Progress | null,
  pet: PetConfig | null,
  options: { mobile?: boolean } = {},
): GameState {
  return {
    screen: pet ? { kind: "welcome" } : { kind: "pet" },
    active: null,
    mobile: options.mobile ?? false,
    feedback: null,
    wizard: pet ? null : { step: "form", draft: DEFAULT_PET, firstTime: true },
    progress: progress ?? EMPTY_PROGRESS,
    pet: pet ?? DEFAULT_PET,
    petHidden: false,
  };
}

export function bootLines(state: GameState): string[] {
  const lines = [
    ansi.bold(ansi.white("TERMINAL ARCADE")) + ansi.dim("  ·  maîtrise le terminal en jouant"),
    "",
  ];
  if (state.wizard) {
    lines.push(
      `Avant de jouer, crée ton compagnon. Il s'appelle ${ansi.bold("Arcade")} par défaut.`,
      ...wizardQuestion(state.wizard),
    );
  } else {
    lines.push(
      `${ansi.bold(state.pet.name)} est là. Tape ${ansi.cyan("ls missions/")} pour choisir un niveau,`,
      `ou ${ansi.cyan("help")} pour voir toutes les commandes.`,
    );
  }
  return lines;
}

export function activeLevel(state: GameState, levels: Level[]): Level | null {
  return state.active ? (levels.find((l) => l.id === state.active!.levelId) ?? null) : null;
}

// --- Invite et complétion ------------------------------------------------

export function promptFor(state: GameState, levels: Level[]): string {
  if (state.wizard) return `${ansi.yellow("arcade-init")}> `;
  const level = activeLevel(state, levels);
  const q = level && state.active ? currentQuestion(level, state.active.run) : null;
  if (level && q) {
    switch (q.kind) {
      case "command":
        return `${ansi.green("agent")}@${ansi.cyan(level.id)}:~$ `;
      case "fill":
        return `${ansi.yellow("trou")}> `;
      case "predict":
        return `${ansi.yellow("sortie")}> `;
      default:
        return `${ansi.yellow(`choix 1-${q.choices.length}`)}> `;
    }
  }
  return `${ansi.green("agent")}@${ansi.cyan("arcade")}:~$ `;
}

const LOBBY_COMMANDS = [
  "help",
  "ls missions/",
  "open ",
  "whoami",
  "pet",
  "pet init",
  "pet name ",
  "pet hide",
  "pet show",
  "clear",
  "reset --progress",
];

export function completions(state: GameState, levels: Level[], buffer: string): string[] {
  if (state.wizard) return [];
  const candidates = state.active
    ? Object.values(LEVEL_KEYWORDS).map((words) => words[0])
    : [
        ...LOBBY_COMMANDS,
        ...levels
          .filter((l) => isUnlocked(l, levels, state.progress))
          .map((l) => `open ${l.id}`),
        ...levels
          .filter((l) => canReplayTimer(l, state.progress))
          .map((l) => `open ${l.id} --timer`),
      ];
  return candidates.filter((c) => c.startsWith(buffer) && c !== buffer);
}

// --- Entrée principale ---------------------------------------------------

export function handleLine(state: GameState, raw: string, levels: Level[]): LineResult {
  const line = raw.trim();
  if (state.wizard) return wizardInput(state, state.wizard, line);
  if (state.active) {
    const level = activeLevel(state, levels);
    if (level) return levelInput(state, level, state.active.run, line, levels);
  }
  return lobbyCommand(state, line, levels);
}

// --- Lobby ---------------------------------------------------------------

function helpLines(): string[] {
  const row = (cmd: string, text: string) => `  ${ansi.cyan(cmd.padEnd(18))}${text}`;
  return [
    ansi.bold("Commandes"),
    row("ls missions/", "liste des niveaux"),
    row("open <niveau>", "lance un niveau (Tab complète le nom)"),
    row("open <n> --timer", "rejoue un niveau réussi, chronométré"),
    row("whoami", "ton profil et ton XP"),
    row("pet", "ton compagnon ; pet init pour le recréer"),
    row("pet name <nom>", "renomme ton compagnon"),
    row("pet hide | show", "masque ou affiche le compagnon"),
    row("clear", "efface l'écran (Ctrl+L)"),
    row("reset --progress", "efface toute la progression"),
    "",
    ansi.dim("Pendant un niveau : hint (indice), skip (passer), quit (quitter)."),
  ];
}

function missionLines(state: GameState, levels: Level[]): string[] {
  const lines = [ansi.bold("missions/")];
  for (const l of levels) {
    const unlocked = isUnlocked(l, levels, state.progress);
    const status = statusOf(l.id, state.progress);
    const tag = !unlocked
      ? ansi.dim("VERROUILLÉ")
      : status === "passed"
        ? ansi.green("HACKÉ     ")
        : status === "attempted"
          ? ansi.yellow("EN COURS  ")
          : ansi.cyan("NEW       ");
    const name = unlocked ? ansi.white(l.id) : ansi.dim(l.id);
    const timer =
      nativeMode(l) === "timer"
        ? ansi.yellow(" ⏱")
        : canReplayTimer(l, state.progress)
          ? ansi.dim(" (--timer)")
          : "";
    lines.push(`  ${tag}  ${name}${timer}  ${ansi.dim(`${TIER_LABELS[l.tier]} · ${l.title}`)}`);
  }
  lines.push("", ansi.dim("Lance un niveau avec : open <niveau>"));
  return lines;
}

function profileLines(state: GameState, levels: Level[]): string[] {
  const passed = levels.filter((l) => statusOf(l.id, state.progress) === "passed").length;
  const total = Object.values(state.progress.xpByTree).reduce((a, b) => a + (b ?? 0), 0);
  const lines = [
    `${ansi.bold("agent")}  ·  ${total} XP  ·  ${passed}/${levels.length} niveaux hackés`,
    `Compagnon : ${state.pet.name}`,
  ];
  const trees = Object.entries(state.progress.xpByTree);
  if (trees.length > 0) {
    lines.push("", ansi.bold("XP par arbre"));
    for (const [tree, xp] of trees) {
      lines.push(`  ${TREE_LABELS[tree as keyof typeof TREE_LABELS].padEnd(20)}${xp} XP`);
    }
  }
  return lines;
}

function lobbyCommand(state: GameState, line: string, levels: Level[]): LineResult {
  const [cmd = "", ...args] = line.split(/\s+/);
  const arg = args.join(" ");

  switch (cmd.toLowerCase()) {
    case "":
      return { state, out: [] };
    case "help":
    case "aide":
      return { state, out: helpLines() };
    case "clear":
      return { state, out: [], clear: true };
    case "ls": {
      const target = arg.replace(/\/+$/, "");
      if (target === "") return { state, out: [`${ansi.cyan("missions/")}`] };
      if (target === "missions") {
        return { state: { ...state, screen: { kind: "missions" } }, out: missionLines(state, levels) };
      }
      return { state, out: [`ls: ${arg} : aucun fichier ou dossier de ce nom`] };
    }
    case "open":
    case "cd": {
      const timerFlag = args.includes("--timer");
      const id = args
        .filter((a) => a !== "--timer")
        .join(" ")
        .replace(/^missions\//, "")
        .replace(/\/+$/, "");
      if (cmd === "cd" && (id === "" || id === "~" || id === "missions")) {
        return { state: { ...state, screen: { kind: "missions" } }, out: [] };
      }
      return openLevel(state, id, levels, timerFlag);
    }
    case "whoami":
      return { state: { ...state, screen: { kind: "profile" } }, out: profileLines(state, levels) };
    case "pet":
      return petCommand(state, args);
    case "reset":
      if (arg === "--progress") {
        return {
          state: { ...state, progress: EMPTY_PROGRESS, screen: { kind: "missions" } },
          out: ["Progression effacée."],
        };
      }
      return { state, out: [`Pour tout effacer : ${ansi.cyan("reset --progress")}`] };
    default:
      return {
        state,
        out: [
          `${cmd} : commande inconnue ici. Pas de mission en cours.`,
          `Tape ${ansi.cyan("ls missions/")} pour en choisir une, ou ${ansi.cyan("help")}.`,
        ],
        reaction: "think",
      };
  }
}

function openLevel(state: GameState, id: string, levels: Level[], timerFlag = false): LineResult {
  if (id === "") return { state, out: [`Usage : ${ansi.cyan("open <niveau>")}`] };
  const level = levels.find((l) => l.id === id);
  if (!level) return { state, out: [`open: ${id} : niveau introuvable. Tape ls missions/.`] };
  if (!isUnlocked(level, levels, state.progress)) {
    const parent = levels.find((l) => l.rewards.unlocks === level.id);
    return {
      state,
      out: [`${id} est verrouillé.${parent ? ` Réussis d'abord ${ansi.cyan(parent.id)}.` : ""}`],
    };
  }
  let mode = nativeMode(level);
  if (timerFlag && mode === "classic") {
    if (!canReplayTimer(level, state.progress)) {
      return {
        state,
        out: [
          level.replay.timer && level.timer
            ? `Réussis d'abord ${ansi.cyan(level.id)} en classique pour le rejouer chronométré.`
            : `${level.id} ne se joue pas en Timer.`,
        ],
      };
    }
    mode = "timer";
  }
  const timer = mode === "timer" && level.timer ? createTimer(level.timer, { mobile: state.mobile }) : null;

  const run = startRun(level);
  const next: GameState = {
    ...state,
    active: { levelId: level.id, run, mode, timer, lastDelta: null },
    feedback: null,
    screen: { kind: "question" },
  };
  return {
    state: next,
    out: [
      "",
      ansi.inverse(` ${TIER_LABELS[level.tier].toUpperCase()} // ${level.id.toUpperCase()} `) +
        `  ${ansi.bold(level.title)}`,
      ...(level.intro ? [ansi.dim(level.intro)] : []),
      ...(timer ? timerIntro(timer) : []),
      ansi.dim("hint : indice  ·  skip : passer  ·  quit : quitter"),
      ...questionLines(level, run),
    ],
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

// --- Niveau en cours -----------------------------------------------------

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

function matches(word: string, list: string[]) {
  return list.includes(word.toLowerCase());
}

function levelInput(
  state: GameState,
  level: Level,
  run: Run,
  line: string,
  levels: Level[],
): LineResult {
  const active = state.active!;
  const q = currentQuestion(level, run)!;
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
        `  ${ansi.cyan("hint")}  un indice (réduit l'XP de la question${active.timer ? ", coûte du temps" : ""})`,
        `  ${ansi.cyan("skip")}  passer la question (0 XP) et voir la réponse`,
        `  ${ansi.cyan("quit")}  quitter le niveau`,
      ],
    };
  }

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
    if (timed.expired) return finishLevel(next, level, hint.run, out, levels, true);
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

  if (matches(line, LEVEL_KEYWORDS.skip)) {
    const skipped = skip(level, run)!;
    const timed = timeEvent(active, "skip");
    const feedback: Feedback = {
      tone: "info",
      title: `Réponse : ${skipped.expected}`,
      explain: q.explain,
    };
    const out = [`${ansi.dim("Question passée. Réponse :")} ${ansi.cyan(skipped.expected)}${timed.text}`];
    if (q.explain) out.push(ansi.dim(q.explain));
    out.push(...timed.alarm);
    const next = withActive({ run: skipped.run, ...timed.patch }, { feedback });
    if (timed.expired) return finishLevel(next, level, skipped.run, out, levels, true);
    return proceed(next, level, skipped.run, out, "sad", levels);
  }

  const { run: after, check } = submit(level, run, line);
  if (check.kind === "invalid") {
    return { state, out: [ansi.yellow(check.reason)] };
  }
  if (check.kind === "wrong") {
    const timed = timeEvent(active, "wrong");
    const hintLeft = q.hints.length > run.hintsUsed && hintsAllowed(timed.patch.timer ?? null);
    const next = withActive(
      { run: after, ...timed.patch },
      { feedback: { tone: "bad", title: `Pas tout à fait. Réessaie.${timed.plain}` } },
    );
    const out = [
      `${ansi.red("✘")} Pas tout à fait.${timed.text}${hintLeft ? ` Tape ${ansi.cyan("hint")} pour un indice.` : ""}`,
      ...timed.alarm,
    ];
    if (timed.expired) return finishLevel(next, level, after, out, levels, true);
    return { state: next, out, reaction: timed.alarm.length ? "alarm" : "sad" };
  }

  const firstTry = run.wrongAttempts === 0 && run.hintsUsed === 0;
  const timed = timeEvent(active, firstTry ? "first_try" : "correct");
  const output = q.kind === "command" ? q.output?.trimEnd() : undefined;
  const out = [`${ansi.green("✔")} Correct.${timed.text}`];
  if (output) out.push(...output.split("\n").map((l) => ansi.dim(l)));
  if (q.explain) out.push(ansi.dim(`→ ${q.explain}`));
  const feedback: Feedback = { tone: "good", title: `Correct.${timed.plain}`, output, explain: q.explain };
  return proceed(withActive({ run: after, ...timed.patch }, { feedback }), level, after, out, "happy", levels);
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
): {
  patch: Partial<ActiveLevel>;
  text: string;
  plain: string;
  alarm: string[];
  expired: boolean;
} {
  if (!active.timer) return { patch: {}, text: "", plain: "", alarm: [], expired: false };
  const { timer, deltaMs } = applyEvent(active.timer, event, hintCostS);
  if (deltaMs === 0) return { patch: { timer }, text: "", plain: "", alarm: [], expired: false };

  // Pour le joueur, un delta positif est toujours une bonne nouvelle. Au
  // chrono, une pénalité s'affiche en secondes ajoutées.
  const seconds = Math.round(Math.abs(deltaMs) / 1000);
  const plain =
    timer.mode === "chrono" ? ` (+${seconds} s au chrono)` : ` (${deltaMs > 0 ? "+" : "−"}${seconds} s)`;
  const text = deltaMs > 0 ? ansi.green(plain) : ansi.red(plain);
  const worse = ZONE_RANK[zoneOf(timer)] > ZONE_RANK[zoneOf(active.timer)];
  return {
    patch: { timer, lastDelta: { ms: deltaMs, id: (active.lastDelta?.id ?? 0) + 1 } },
    text,
    plain,
    alarm: worse ? zoneMessage(timer) : [],
    expired: isExpired(timer),
  };
}

/**
 * Fait avancer le temps de la partie en cours. Renvoie null s'il n'y a pas
 * de timer, sinon le nouvel état et, au besoin, les lignes à afficher
 * (changement de zone, temps écoulé).
 */
export function tickGame(state: GameState, levels: Level[], elapsedMs: number): LineResult | null {
  const active = state.active;
  const level = activeLevel(state, levels);
  if (!active?.timer || !level) return null;

  const timer = tick(active.timer, elapsedMs);
  const next: GameState = { ...state, active: { ...active, timer } };
  if (isExpired(timer)) {
    return finishLevel(next, level, active.run, ["", ansi.red(ansi.bold("⏱ Temps écoulé !"))], levels, true);
  }
  if (ZONE_RANK[zoneOf(timer)] > ZONE_RANK[zoneOf(active.timer)]) {
    return { state: next, out: zoneMessage(timer), reaction: "alarm" };
  }
  return { state: next, out: [] };
}

// --- Fin de niveau -------------------------------------------------------

/** Après une réponse validée ou passée : question suivante, ou fin du niveau. */
function proceed(
  state: GameState,
  level: Level,
  run: Run,
  out: string[],
  reaction: PetReaction,
  levels: Level[],
): LineResult {
  if (!isFinished(level, run)) {
    return { state, out: [...out, ...questionLines(level, run)], reaction };
  }
  return finishLevel(state, level, run, out, levels, false);
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

function finishLevel(
  state: GameState,
  level: Level,
  run: Run,
  out: string[],
  levels: Level[],
  timedOut: boolean,
): LineResult {
  const active = state.active!;
  const timer = active.timer;
  const base = computeRecap(level, run);
  const passed = base.passed && !timedOut && (!timer || timeGoalMet(timer));
  const xp = timer && !timedOut ? timedXp(base.xp, level.rewards.xp, timer) : base.xp;
  const result: Recap = { ...base, xp, passed };

  const progress = recordRun(state.progress, level, { xp, passed, mode: active.mode });
  const nextLevel = levels.find((l) => l.id === level.rewards.unlocks);
  const nextId = nextLevel && isUnlocked(nextLevel, levels, progress) ? nextLevel.id : null;
  const timerReplay = active.mode === "classic" && canReplayTimer(level, progress);

  const retry = ansi.cyan(
    `open ${level.id}${active.mode === "timer" && nativeMode(level) === "classic" ? " --timer" : ""}`,
  );
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
    `  +${result.xp} XP${timer && !timedOut ? ansi.dim(" (bonus Timer compris)") : ""}`,
    ...(passed
      ? [
          nextId ? `Suivant : ${ansi.cyan(`open ${nextId}`)}` : `Retour à la liste : ${ansi.cyan("ls missions/")}`,
          ...(timerReplay ? [`Rejoue-le chronométré : ${ansi.cyan(`open ${level.id} --timer`)}`] : []),
        ]
      : [failure]),
  ];

  return {
    state: {
      ...state,
      active: null,
      progress,
      screen: { kind: "recap", levelId: level.id, recap: result, nextId, timer, timedOut, timerReplay },
    },
    out: summary,
    reaction: passed ? "cheer" : "sad",
  };
}


// --- Compagnon -----------------------------------------------------------

function petCommand(state: GameState, args: string[]): LineResult {
  const [sub = "", ...rest] = args;
  switch (sub.toLowerCase()) {
    case "":
      return {
        state: { ...state, screen: { kind: "pet" } },
        out: [
          `${ansi.bold(state.pet.name)} · ${labelOf(PET_FORMS, state.pet.form)}, ${labelOf(PET_COLORS, state.pet.color).toLowerCase()}, accessoire : ${labelOf(PET_ACCESSORIES, state.pet.accessory).toLowerCase()}`,
          ansi.dim("pet init : le recréer · pet name <nom> : le renommer"),
        ],
      };
    case "init": {
      const wizard: Wizard = { step: "form", draft: state.pet, firstTime: false };
      return {
        state: { ...state, wizard, screen: { kind: "pet" } },
        out: wizardQuestion(wizard),
      };
    }
    case "name": {
      const name = sanitizePetName(rest.join(" "));
      if (!name) return { state, out: [`Usage : ${ansi.cyan("pet name <nom>")} (lettres et chiffres, 16 max)`] };
      return {
        state: { ...state, pet: { ...state.pet, name } },
        out: [`Ton compagnon s'appelle maintenant ${ansi.bold(name)}.`],
        reaction: "happy",
      };
    }
    case "hide":
      return { state: { ...state, petHidden: true }, out: [`${state.pet.name} se cache.`] };
    case "show":
      return { state: { ...state, petHidden: false }, out: [`${state.pet.name} revient.`], reaction: "happy" };
    default:
      return { state, out: [`pet ${sub} : sous-commande inconnue. Essaie pet, pet init, pet name, pet hide.`] };
  }
}

function labelOf<T extends { id: string; label: string }>(list: readonly T[], id: string) {
  return list.find((x) => x.id === id)?.label ?? id;
}

const WIZARD_LISTS = {
  form: PET_FORMS,
  color: PET_COLORS,
  accessory: PET_ACCESSORIES,
} as const;

const WIZARD_TITLES: Record<WizardStep, string> = {
  form: "Choisis sa forme",
  color: "Choisis sa couleur",
  accessory: "Choisis un accessoire",
  name: "Donne-lui un nom",
};

export function wizardQuestion(wizard: Wizard): string[] {
  const lines = ["", ansi.yellow(`── ${WIZARD_TITLES[wizard.step]} ──`)];
  if (wizard.step === "name") {
    lines.push(`Entrée pour garder ${ansi.bold(wizard.draft.name)}, ou tape un nouveau nom.`);
  } else {
    WIZARD_LISTS[wizard.step].forEach((item, i) => lines.push(`  ${ansi.bold(String(i + 1))}. ${item.label}`));
  }
  return lines;
}

/** Les choix proposés à l'étape en cours (bulles cliquables sur l'écran). */
export function wizardChoices(wizard: Wizard): string[] {
  return wizard.step === "name" ? [] : WIZARD_LISTS[wizard.step].map((x) => x.label);
}

function wizardInput(state: GameState, wizard: Wizard, line: string): LineResult {
  if (matches(line, LEVEL_KEYWORDS.quit)) {
    return {
      state: { ...state, wizard: null, screen: { kind: "welcome" } },
      out: [ansi.dim(`Création annulée. ${state.pet.name} reste tel quel.`)],
    };
  }

  if (wizard.step === "name") {
    const name = line === "" ? wizard.draft.name : sanitizePetName(line);
    if (!name) return { state, out: [ansi.yellow("Lettres, chiffres, espaces et tirets seulement (16 max).")] };
    const pet = { ...wizard.draft, name };
    return {
      state: { ...state, pet, wizard: null, screen: { kind: "welcome" } },
      out: [
        "",
        `${ansi.bold(name)} est prêt.`,
        wizard.firstTime
          ? `Tape ${ansi.cyan("ls missions/")} pour choisir ton premier niveau.`
          : ansi.dim("Il reprend sa ronde au-dessus du terminal."),
      ],
      reaction: "cheer",
    };
  }

  const list = WIZARD_LISTS[wizard.step];
  const index = /^\d+$/.test(line)
    ? Number(line) - 1
    : list.findIndex((x) => x.label.toLowerCase() === line.toLowerCase());
  const item = list[index];
  if (!item) return { state, out: [ansi.yellow(`Tape un numéro entre 1 et ${list.length}.`)] };

  const draft = { ...wizard.draft, [wizard.step]: item.id } as PetConfig;
  const nextStep: WizardStep =
    wizard.step === "form" ? "color" : wizard.step === "color" ? "accessory" : "name";
  const next: Wizard = { ...wizard, draft, step: nextStep };
  return {
    state: { ...state, wizard: next },
    out: [ansi.dim(`→ ${item.label}`), ...wizardQuestion(next)],
    reaction: "happy",
  };
}
