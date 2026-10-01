import { TIERS, type Level, type Tier, type Tree } from "./schema";

export type LevelStatus = "new" | "attempted" | "passed";

export type PlayMode = "classic" | "timer" | "chaos" | "chaos_timer";

export const isTimed = (mode: PlayMode) => mode === "timer" || mode === "chaos_timer";
export const isChaos = (mode: PlayMode) => mode === "chaos" || mode === "chaos_timer";

export type Progress = {
  // modes : façons de jouer déjà réussies (absent dans les sauvegardes de
  // la phase 1, équivalent à une liste vide).
  levels: Record<string, { status: LevelStatus; bestXp: number; modes?: PlayMode[] }>;
  xpByTree: Partial<Record<Tree, number>>;
};

export const EMPTY_PROGRESS: Progress = { levels: {}, xpByTree: {} };

export const TIER_LABELS: Record<Tier, string> = {
  script_kiddie: "Script Kiddie",
  sysadmin: "SysAdmin",
  root_wizard: "Root Wizard",
};

// Parcours : un fil thématique à travers les paliers (chaque niveau garde
// son palier). Pour l'instant un seul, Git-Gud, qui suit l'arbre git_gud.
export const TRACKS = {
  "git-gud": { tree: "git_gud" as Tree, label: "Git-Gud", hook: "Tout Git, de git init à git bisect." },
} as const;
export type TrackId = keyof typeof TRACKS;

export function trackLevels(levels: Level[], track: TrackId): Level[] {
  return levels.filter((l) => l.tree === TRACKS[track].tree);
}

/** Niveaux hors parcours, rangés par palier (l'écran principal des missions). */
export function mainLevels(levels: Level[]): Level[] {
  const tracked = new Set(Object.values(TRACKS).map((t) => t.tree));
  return levels.filter((l) => !tracked.has(l.tree));
}

export const TREE_LABELS: Record<Tree, string> = {
  file_system_ninja: "File System Ninja",
  data_surgeon: "Data Surgeon",
  system_overlord: "System Overlord",
  network_phantom: "Network Phantom",
  git_gud: "Git-Gud",
  powershell: "PowerShell",
};

/** Ordre d'affichage : par palier, puis dans l'ordre des fichiers. */
export function sortLevels(levels: Level[]): Level[] {
  return levels
    .map((level, i) => ({ level, i }))
    .sort((a, b) => TIERS.indexOf(a.level.tier) - TIERS.indexOf(b.level.tier) || a.i - b.i)
    .map(({ level }) => level);
}

/** Un niveau est ouvert si aucun autre ne le débloque, ou si celui-ci est réussi. */
export function isUnlocked(level: Level, levels: Level[], progress: Progress): boolean {
  const parents = levels.filter((l) => l.rewards.unlocks.includes(level.id));
  return parents.length === 0 || parents.some((p) => progress.levels[p.id]?.status === "passed");
}

export function statusOf(levelId: string, progress: Progress): LevelStatus {
  return progress.levels[levelId]?.status ?? "new";
}

/** Mode imposé par le niveau (son type natif). */
export function nativeMode(level: Level): PlayMode {
  return level.type;
}

/**
 * Mode d'une partie lancée avec des options. Un niveau réussi se rejoue en
 * Chaos s'il le prévoit ; en Timer si c'est un niveau sans timer natif qui
 * le prévoit. Les couches s'ajoutent à son type natif. Renvoie null si la
 * combinaison n'est pas permise.
 */
export function playMode(
  level: Level,
  progress: Progress,
  options: { chaos: boolean; timer: boolean },
): PlayMode | null {
  const native = nativeMode(level);
  const passed = statusOf(level.id, progress) === "passed";
  let timed = isTimed(native);
  let chaos = isChaos(native);
  if (options.timer && !timed) {
    if (!passed || !level.replay.timer || !level.timer) return null;
    timed = true;
  }
  if (options.chaos && !chaos) {
    if (!passed || !level.replay.chaos) return null;
    chaos = true;
  }
  return chaos ? (timed ? "chaos_timer" : "chaos") : timed ? "timer" : "classic";
}

export function canReplayChaos(level: Level, progress: Progress): boolean {
  return !isChaos(nativeMode(level)) && level.replay.chaos && statusOf(level.id, progress) === "passed";
}

/** Un niveau classique réussi peut être rejoué en Timer s'il le prévoit. */
export function canReplayTimer(level: Level, progress: Progress): boolean {
  return (
    !isTimed(nativeMode(level)) &&
    level.replay.timer &&
    !!level.timer &&
    statusOf(level.id, progress) === "passed"
  );
}

export function passedModes(levelId: string, progress: Progress): PlayMode[] {
  return progress.levels[levelId]?.modes ?? [];
}

export function recordRun(
  progress: Progress,
  level: Level,
  result: { xp: number; passed: boolean; mode?: PlayMode },
): Progress {
  const previous = progress.levels[level.id];
  const bestXp = Math.max(previous?.bestXp ?? 0, result.xp);
  // Seul le gain par rapport au meilleur score compte : rejouer un niveau
  // ne permet pas d'accumuler de l'XP à l'infini.
  const gained = bestXp - (previous?.bestXp ?? 0);
  const status: LevelStatus =
    previous?.status === "passed" || result.passed ? "passed" : "attempted";
  const mode = result.mode ?? "classic";
  const modes = previous?.modes ?? [];
  return {
    levels: {
      ...progress.levels,
      [level.id]: {
        status,
        bestXp,
        modes: result.passed && !modes.includes(mode) ? [...modes, mode] : modes,
      },
    },
    xpByTree: {
      ...progress.xpByTree,
      [level.tree]: (progress.xpByTree[level.tree] ?? 0) + gained,
    },
  };
}
