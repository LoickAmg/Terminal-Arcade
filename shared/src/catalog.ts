import { TIERS, type Level, type Tier, type Tree } from "./schema";

export type LevelStatus = "new" | "attempted" | "passed";

export type Progress = {
  levels: Record<string, { status: LevelStatus; bestXp: number }>;
  xpByTree: Partial<Record<Tree, number>>;
};

export const EMPTY_PROGRESS: Progress = { levels: {}, xpByTree: {} };

export const TIER_LABELS: Record<Tier, string> = {
  script_kiddie: "Script Kiddie",
  sysadmin: "SysAdmin",
  root_wizard: "Root Wizard",
};

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
  const parents = levels.filter((l) => l.rewards.unlocks === level.id);
  return parents.length === 0 || parents.some((p) => progress.levels[p.id]?.status === "passed");
}

export function statusOf(levelId: string, progress: Progress): LevelStatus {
  return progress.levels[levelId]?.status ?? "new";
}

export function recordRun(
  progress: Progress,
  level: Level,
  result: { xp: number; passed: boolean },
): Progress {
  const previous = progress.levels[level.id];
  const bestXp = Math.max(previous?.bestXp ?? 0, result.xp);
  // Seul le gain par rapport au meilleur score compte : rejouer un niveau
  // ne permet pas d'accumuler de l'XP à l'infini.
  const gained = bestXp - (previous?.bestXp ?? 0);
  const status: LevelStatus =
    previous?.status === "passed" || result.passed ? "passed" : "attempted";
  return {
    levels: { ...progress.levels, [level.id]: { status, bestXp } },
    xpByTree: {
      ...progress.xpByTree,
      [level.tree]: (progress.xpByTree[level.tree] ?? 0) + gained,
    },
  };
}
