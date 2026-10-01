import {
  EMPTY_PROGRESS,
  TIER_LABELS,
  TRACKS,
  mainLevels,
  trackLevels,
  type TrackId,
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
export {
  blockedKey,
  chaosLogLines,
  displayedTimer,
  hostileDetected,
  questionLines,
  reopenTerminal,
  sandboxEffects,
  sandboxFailed,
  sandboxReady,
  taskResult,
  tickGame,
  type SandboxEffect,
} from "./play";
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
      case "task":
        return "";
      default:
        return `${ansi.yellow(`choix 1-${q.choices.length}`)}> `;
    }
  }
  return `${ansi.green("agent")}@${ansi.cyan("arcade")}:~$ `;
}

const LOBBY_COMMANDS = [
  "help",
  "ls missions/",
  "ls missions/git-gud/",
  "open ",
  "whoami",
  "pet",
  "pet init",
  "pet name ",
  "pet style pixel",
  "pet style persona",
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
    row("pet style <style>", "pixel ou persona"),
    row("pet hide | show", "masque ou affiche le compagnon"),
    row("clear", "efface l'écran (Ctrl+L)"),
    row("reset --progress", "efface toute la progression"),
    "",
    ansi.dim("Pendant un niveau : hint (indice), skip (passer), quit (quitter)."),
    ansi.dim("En Chaos : verify (vérifier un verdict), clock (vrai temps). --timer et --chaos se combinent."),
  ];
}

function trackProgress(state: GameState, levels: Level[], track: TrackId): string {
  const list = trackLevels(levels, track);
  const done = list.filter((l) => statusOf(l.id, state.progress) === "passed").length;
  return `${done}/${list.length}`;
}

function missionLines(state: GameState, levels: Level[], track?: TrackId): string[] {
  const shown = track ? trackLevels(levels, track) : mainLevels(levels);
  const lines = [ansi.bold(track ? `missions/${track}/` : "missions/")];
  if (track) lines.push(ansi.dim(`Parcours ${TRACKS[track].label} : ${TRACKS[track].hook}`));
  for (const l of shown) {
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
  if (!track) {
    for (const [id, t] of Object.entries(TRACKS) as [TrackId, (typeof TRACKS)[TrackId]][]) {
      lines.push(
        `  ${ansi.yellow("PARCOURS  ")}  ${ansi.white(`${id}/`)}  ${ansi.dim(`${t.label} · ${trackProgress(state, levels, id)} niveaux hackés`)}`,
      );
    }
  }
  lines.push(
    "",
    ansi.dim(track ? "Lance un niveau avec : open <niveau> · retour : ls missions/" : "Lance un niveau avec : open <niveau> · parcours : ls missions/git-gud/"),
  );
  return lines;
}

/** « missions », « missions/git-gud » (et variantes avec ou sans barre) → écran visé, ou null. */
function missionTarget(path: string): { track?: TrackId } | null {
  const clean = path.replace(/^\.?\/?/, "").replace(/\/+$/, "");
  if (clean === "missions") return {};
  const match = /^missions\/([a-z-]+)$/.exec(clean);
  if (match && match[1] in TRACKS) return { track: match[1] as TrackId };
  return null;
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
      if (arg === "") return { state, out: [`${ansi.cyan("missions/")}`] };
      const target = missionTarget(arg);
      if (target) {
        return {
          state: { ...state, screen: { kind: "missions", ...target } },
          out: missionLines(state, levels, target.track),
        };
      }
      return { state, out: [`ls: ${arg} : aucun fichier ou dossier de ce nom`] };
    }
    case "open":
    case "cd": {
      const { rest, options } = openFlags(args);
      const path = rest.join(" ");
      const target = missionTarget(path);
      if (cmd === "cd" && (path === "" || path === "~" || target)) {
        return { state: { ...state, screen: { kind: "missions", ...(target ?? {}) } }, out: [] };
      }
      const id = path.replace(/^missions\/([a-z-]+\/)?/, "").replace(/\/+$/, "");
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
