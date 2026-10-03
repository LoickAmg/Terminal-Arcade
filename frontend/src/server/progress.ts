import { z } from "zod";
import META from "./levels-meta.json";

// Sauvegarde envoyée par le navigateur : on n'y fait jamais confiance telle
// quelle. Le serveur garde seulement les niveaux qui existent, plafonne
// l'XP de chacun à ce que le jeu peut réellement donner, retire les
// niveaux qu'on ne pouvait pas encore ouvrir, recalcule lui-même l'XP par
// arbre, et fusionne avec la sauvegarde existante sans rien faire reculer.
//
// Limite assumée : les questions du navigateur sont jugées dans le
// navigateur. Un tricheur déterminé peut donc prétendre avoir réussi un
// niveau ouvert ; il ne peut pas dépasser le maximum légitime. Les comptes
// manifestement truqués se masquent du classement (colonne hidden).

export type LevelMeta = { id: string; tier: string; tree: string; xp: number; unlocks: string[] };

export const LEVELS: LevelMeta[] = META;

/** XP maximale d'une partie : Timer (×1,25 + 20 %) puis Chaos (×1,5 + 5 % par sabotage démasqué), avec marge. */
export const MAX_XP_FACTOR = 2.6;

const STATUSES = ["new", "attempted", "passed"] as const;
const MODES = ["classic", "timer", "chaos", "chaos_timer"] as const;
const TIER_RANK: Record<string, number> = { script_kiddie: 1, sysadmin: 2, root_wizard: 3 };

type Status = (typeof STATUSES)[number];
type Mode = (typeof MODES)[number];
export type LevelProgress = { status: Status; bestXp: number; modes?: Mode[] };
export type Progress = { levels: Record<string, LevelProgress>; xpByTree: Record<string, number> };

export const levelProgressSchema = z.object({
  status: z.enum(STATUSES),
  bestXp: z.number().int().min(0).max(1_000_000),
  modes: z.array(z.enum(MODES)).max(MODES.length).optional(),
});

export const progressSchema = z.object({
  levels: z.record(z.string().max(64), levelProgressSchema).refine((r) => Object.keys(r).length <= 500, "trop de niveaux"),
  xpByTree: z.record(z.string().max(64), z.number()).optional(),
});

export const EMPTY: Progress = { levels: {}, xpByTree: {} };

const byId = new Map(LEVELS.map((l) => [l.id, l]));
/** Niveaux qui en débloquent chacun un autre. Sans parent : ouvert d'emblée. */
const parents = new Map<string, string[]>();
for (const l of LEVELS) for (const child of l.unlocks) parents.set(child, [...(parents.get(child) ?? []), l.id]);

/** Nettoie une progression : niveaux connus, XP plafonnée, déblocages cohérents, XP par arbre recalculée. */
export function sanitize(input: { levels: Record<string, LevelProgress> }, levels = byId): Progress {
  const kept: Record<string, LevelProgress> = {};
  for (const [id, p] of Object.entries(input.levels)) {
    const meta = levels.get(id);
    if (!meta) continue;
    kept[id] = {
      status: p.status,
      bestXp: Math.min(p.bestXp, Math.round(meta.xp * MAX_XP_FACTOR)),
      modes: [...new Set(p.modes ?? [])].sort(),
    };
  }
  // Un niveau n'a pu être joué que si l'un de ses parents est réussi.
  // On retire jusqu'à stabilité (retirer un niveau peut en fermer d'autres).
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of Object.keys(kept)) {
      const from = parents.get(id) ?? [];
      if (from.length > 0 && !from.some((p) => kept[p]?.status === "passed")) {
        delete kept[id];
        changed = true;
      }
    }
  }
  const xpByTree: Record<string, number> = {};
  for (const [id, p] of Object.entries(kept)) {
    const tree = levels.get(id)!.tree;
    xpByTree[tree] = (xpByTree[tree] ?? 0) + p.bestXp;
  }
  return { levels: kept, xpByTree };
}

/** Fusion de deux progressions : le meilleur de chaque niveau, rien ne recule. */
export function merge(a: Progress, b: { levels: Record<string, LevelProgress> }): Progress {
  const levels: Record<string, LevelProgress> = { ...a.levels };
  for (const [id, p] of Object.entries(b.levels)) {
    const q = levels[id];
    levels[id] = q
      ? {
          status: STATUSES.indexOf(p.status) > STATUSES.indexOf(q.status) ? p.status : q.status,
          bestXp: Math.max(p.bestXp, q.bestXp),
          modes: [...new Set([...(q.modes ?? []), ...(p.modes ?? [])])],
        }
      : p;
  }
  return sanitize({ levels });
}

/** Ligne du classement tirée d'une progression déjà nettoyée. */
export function score(progress: Progress): { xp: number; levelsPassed: number; tierRank: number } {
  let xp = 0;
  let levelsPassed = 0;
  let tierRank = 0;
  for (const [id, p] of Object.entries(progress.levels)) {
    xp += p.bestXp;
    if (p.status === "passed") {
      levelsPassed++;
      tierRank = Math.max(tierRank, TIER_RANK[byId.get(id)!.tier] ?? 0);
    }
  }
  return { xp, levelsPassed, tierRank };
}
