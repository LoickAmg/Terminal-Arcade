import {
  EMPTY_PROGRESS,
  TIER_LABELS,
  TREE_LABELS,
  canReplayChaos,
  canReplayTimer,
  currentQuestion,
  isChaos,
  isTimed,
  isUnlocked,
  nativeMode,
  statusOf,
  type Level,
} from "@terminal-arcade/shared";
import { ansi } from "./ansi";
import { levelInput, openFlags, openLevel } from "./play";
import { LEVEL_KEYWORDS, playedLevel, type GameState, type LineResult } from "./state";
import { petCommand, wizardInput, wizardQuestion } from "./wizard";

// Machine de jeu, sans React ni xterm : une ligne tapée entre, un nouvel
// état et les lignes à afficher sortent. Tout ce que le joueur fait passe
// par ici, qu'il tape au clavier, clique une bannière ou touche une bulle.
// Le déroulé d'un niveau est dans play.ts, le compagnon dans wizard.ts.

export * from "./state";
export { blockedKey, chaosLogLines, displayedTimer, questionLines, reopenTerminal, tickGame } from "./play";
export { wizardChoices, wizardQuestion } from "./wizard";

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

// --- Invite et complétion ------------------------------------------------

export function promptFor(state: GameState, levels: Level[]): string {
  if (state.wizard) return `${ansi.yellow("arcade-init")}> `;
  const level = playedLevel(state, levels);
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
  const active = state.active;
  const candidates = active
    ? [
        ...[LEVEL_KEYWORDS.hint, LEVEL_KEYWORDS.skip, LEVEL_KEYWORDS.quit, LEVEL_KEYWORDS.help].map((w) => w[0]),
        ...(active.chaos ? ["verify"] : []),
        ...(active.timer ? ["clock"] : []),
      ]
    : [
        ...LOBBY_COMMANDS,
        ...levels.filter((l) => isUnlocked(l, levels, state.progress)).map((l) => `open ${l.id}`),
        ...levels.filter((l) => canReplayTimer(l, state.progress)).map((l) => `open ${l.id} --timer`),
        ...levels.filter((l) => canReplayChaos(l, state.progress)).map((l) => `open ${l.id} --chaos`),
      ];
  return candidates.filter((c) => c.startsWith(buffer) && c !== buffer);
}

// --- Entrée principale ---------------------------------------------------

export function handleLine(
  state: GameState,
  raw: string,
  levels: Level[],
  rng: () => number = Math.random,
): LineResult {
  const line = raw.trim();
  if (state.wizard) return wizardInput(state, state.wizard, line);
  if (state.active && playedLevel(state, levels)) return levelInput(state, levels, line);
  return lobbyCommand(state, line, levels, rng);
}

// --- Lobby ---------------------------------------------------------------

function helpLines(): string[] {
  const row = (cmd: string, text: string) => `  ${ansi.cyan(cmd.padEnd(18))}${text}`;
  return [
    ansi.bold("Commandes"),
    row("ls missions/", "liste des niveaux"),
    row("open <niveau>", "lance un niveau (Tab complète le nom)"),
    row("open <n> --timer", "rejoue un niveau réussi, chronométré"),
    row("open <n> --chaos", "rejoue un niveau réussi, saboté par ton compagnon"),
    row("whoami", "ton profil et ton XP"),
    row("pet", "ton compagnon ; pet init pour le recréer"),
    row("pet name <nom>", "renomme ton compagnon"),
    row("pet hide | show", "masque ou affiche le compagnon"),
    row("clear", "efface l'écran (Ctrl+L)"),
    row("reset --progress", "efface toute la progression"),
    "",
    ansi.dim("Pendant un niveau : hint (indice), skip (passer), quit (quitter)."),
    ansi.dim("En Chaos : verify (vérifier un verdict), clock (vrai temps). --timer et --chaos se combinent."),
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
    const native = nativeMode(l);
    const marks = [
      isTimed(native) ? ansi.yellow("⏱") : "",
      isChaos(native) ? ansi.red("☠") : "",
      canReplayTimer(l, state.progress) ? ansi.dim("--timer") : "",
      canReplayChaos(l, state.progress) ? ansi.dim("--chaos") : "",
    ].filter(Boolean);
    lines.push(
      `  ${tag}  ${name}${marks.length ? ` ${marks.join(" ")}` : ""}  ${ansi.dim(`${TIER_LABELS[l.tier]} · ${l.title}`)}`,
    );
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

function lobbyCommand(state: GameState, line: string, levels: Level[], rng: () => number): LineResult {
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
      const { rest, options } = openFlags(args);
      const id = rest.join(" ").replace(/^missions\//, "").replace(/\/+$/, "");
      if (cmd === "cd" && (id === "" || id === "~" || id === "missions")) {
        return { state: { ...state, screen: { kind: "missions" } }, out: [] };
      }
      return openLevel(state, id, levels, options, rng);
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
