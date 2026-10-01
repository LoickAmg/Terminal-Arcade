import {
  EMPTY_PROGRESS,
  TIER_LABELS,
  TREE_LABELS,
  currentQuestion,
  isFinished,
  isUnlocked,
  nextHint,
  recap as computeRecap,
  recordRun,
  skip,
  startRun,
  statusOf,
  submit,
  type Level,
  type Progress,
  type Question,
  type Recap,
  type Run,
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
  | { kind: "recap"; levelId: string; recap: Recap; nextId: string | null }
  | { kind: "profile" }
  | { kind: "pet" };

type WizardStep = "form" | "color" | "accessory" | "name";
export type Wizard = { step: WizardStep; draft: PetConfig; firstTime: boolean };

export type GameState = {
  screen: Screen;
  active: { levelId: string; run: Run } | null;
  feedback: Feedback | null;
  wizard: Wizard | null;
  progress: Progress;
  pet: PetConfig;
  petHidden: boolean;
};

export type PetReaction = "happy" | "sad" | "cheer" | "think";

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

export function initialState(progress: Progress | null, pet: PetConfig | null): GameState {
  return {
    screen: pet ? { kind: "welcome" } : { kind: "pet" },
    active: null,
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
    lines.push(`  ${tag}  ${name}  ${ansi.dim(`${TIER_LABELS[l.tier]} · ${l.title}`)}`);
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
      const id = arg.replace(/^missions\//, "").replace(/\/+$/, "");
      if (cmd === "cd" && (id === "" || id === "~" || id === "missions")) {
        return { state: { ...state, screen: { kind: "missions" } }, out: [] };
      }
      return openLevel(state, id, levels);
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

function openLevel(state: GameState, id: string, levels: Level[]): LineResult {
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
  const run = startRun(level);
  const next: GameState = {
    ...state,
    active: { levelId: level.id, run },
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
      ansi.dim("hint : indice  ·  skip : passer  ·  quit : quitter"),
      ...questionLines(level, run),
    ],
  };
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
  const q = currentQuestion(level, run)!;
  const withRun = (r: Run, extra: Partial<GameState> = {}): GameState => ({
    ...state,
    active: { levelId: level.id, run: r },
    ...extra,
  });

  if (line === "") return { state, out: [] };

  if (matches(line, LEVEL_KEYWORDS.help)) {
    return {
      state,
      out: [
        ansi.dim("Réponds à la question, ou :"),
        `  ${ansi.cyan("hint")}  un indice (réduit l'XP de la question)`,
        `  ${ansi.cyan("skip")}  passer la question (0 XP) et voir la réponse`,
        `  ${ansi.cyan("quit")}  quitter le niveau`,
      ],
    };
  }

  if (matches(line, LEVEL_KEYWORDS.hint)) {
    const hint = nextHint(level, run);
    if (!hint) return { state, out: [ansi.dim("Plus d'indice pour cette question.")] };
    return {
      state: withRun(hint.run, { feedback: { tone: "info", title: `Indice : ${hint.text}` } }),
      out: [`${ansi.yellow("Indice")} : ${hint.text}`],
      reaction: "think",
    };
  }

  if (matches(line, LEVEL_KEYWORDS.quit)) {
    const partial = computeRecap(level, run);
    return {
      state: {
        ...state,
        active: null,
        feedback: null,
        screen: { kind: "missions" },
        progress: recordRun(state.progress, level, { xp: partial.xp, passed: false }),
      },
      out: [ansi.dim(`Niveau ${level.id} quitté.`)],
    };
  }

  if (matches(line, LEVEL_KEYWORDS.skip)) {
    const skipped = skip(level, run)!;
    const feedback: Feedback = {
      tone: "info",
      title: `Réponse : ${skipped.expected}`,
      explain: q.explain,
    };
    const out = [`${ansi.dim("Question passée. Réponse :")} ${ansi.cyan(skipped.expected)}`];
    if (q.explain) out.push(ansi.dim(q.explain));
    return proceed(withRun(skipped.run, { feedback }), level, skipped.run, out, "sad", levels);
  }

  const { run: after, check } = submit(level, run, line);
  if (check.kind === "invalid") {
    return { state, out: [ansi.yellow(check.reason)] };
  }
  if (check.kind === "wrong") {
    const hintLeft = q.hints.length > run.hintsUsed;
    return {
      state: withRun(after, {
        feedback: { tone: "bad", title: "Pas tout à fait. Réessaie." },
      }),
      out: [
        `${ansi.red("✘")} Pas tout à fait.${hintLeft ? ` Tape ${ansi.cyan("hint")} pour un indice.` : ""}`,
      ],
      reaction: "sad",
    };
  }

  const output = q.kind === "command" ? q.output?.trimEnd() : undefined;
  const out = [`${ansi.green("✔")} Correct.`];
  if (output) out.push(...output.split("\n").map((l) => ansi.dim(l)));
  if (q.explain) out.push(ansi.dim(`→ ${q.explain}`));
  const feedback: Feedback = { tone: "good", title: "Correct.", output, explain: q.explain };
  return proceed(withRun(after, { feedback }), level, after, out, "happy", levels);
}

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

  const result = computeRecap(level, run);
  const progress = recordRun(state.progress, level, result);
  const nextLevel = levels.find((l) => l.id === level.rewards.unlocks);
  const nextId = nextLevel && isUnlocked(nextLevel, levels, progress) ? nextLevel.id : null;

  const summary = [
    ...out,
    "",
    result.passed
      ? ansi.green(ansi.bold(`NIVEAU HACKÉ — ${level.title}`))
      : ansi.red(ansi.bold(`NIVEAU ÉCHOUÉ — ${level.title}`)),
    `  ${result.correct}/${result.total} bonnes réponses, dont ${result.firstTry} du premier coup`,
    `  +${result.xp} XP`,
    result.passed
      ? nextId
        ? `Suivant : ${ansi.cyan(`open ${nextId}`)}`
        : `Retour à la liste : ${ansi.cyan("ls missions/")}`
      : `Il faut 60 % de bonnes réponses. Réessaie : ${ansi.cyan(`open ${level.id}`)}`,
  ];

  return {
    state: {
      ...state,
      active: null,
      progress,
      screen: { kind: "recap", levelId: level.id, recap: result, nextId },
    },
    out: summary,
    reaction: result.passed ? "cheer" : "sad",
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
