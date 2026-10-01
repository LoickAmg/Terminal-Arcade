import { HOSTILE, SABOTAGES, type Sabotage } from "./sabotages";
import type { Level, Tier } from "./schema";

// Ordonnancement des sabotages du mode Chaos. Le joueur ne choisit rien :
// le niveau impose ses sabotages « signature », un tirage dans la réserve
// du palier ajoute de l'imprévu, et un budget par palier dose le tout.
// Tout est déterministe à partir d'une graine, pour pouvoir le tester.

export { HOSTILE, SABOTAGES, SABOTAGE_INFO, type Sabotage, type SabotageFamily } from "./sabotages";

type TierChaos = {
  // Nombre maximal de sabotages dans une partie.
  max: number;
  // Pause minimale entre deux sabotages, pour laisser le temps de réfléchir.
  gapMs: number;
  // Probabilité par seconde qu'un sabotage se déclenche une fois la pause passée.
  perSecond: number;
  // Probabilité qu'Arcade mente sur un verdict (si la pause est passée).
  lieChance: number;
  pool: Sabotage[];
};

// Tous les paliers tirent dans la réserve complète (sabotages durs compris) ;
// le palier ne règle que le dosage : nombre, pause minimale, fréquence. Un
// sabotage ne se joue que s'il a un sens pour la question en cours (voir
// eligible) : temps seulement en partie chronométrée, environnement hostile
// seulement dans la sandbox, mutation seulement s'il existe une variante.
export const TIER_CHAOS: Record<Tier, TierChaos> = {
  script_kiddie: { max: 4, gapMs: 18_000, perSecond: 0.08, lieChance: 0.35, pool: [...SABOTAGES] },
  sysadmin: { max: 5, gapMs: 14_000, perSecond: 0.1, lieChance: 0.4, pool: [...SABOTAGES] },
  root_wizard: { max: 7, gapMs: 10_000, perSecond: 0.12, lieChance: 0.45, pool: [...SABOTAGES] },
};

export type ChaosEntry = {
  kind: Sabotage;
  // Moment du sabotage, en temps de partie.
  atMs: number;
  // Question en cours à ce moment-là (0 = première).
  question: number;
  // Le joueur l'a démasqué (verify, clock) ou contourné.
  detected: boolean;
  note: string;
};

export type ChaosState = {
  seed: number;
  elapsedMs: number;
  // Fin de la pause en cours : aucun sabotage avant ce moment.
  quietUntilMs: number;
  used: number;
  max: number;
  // Signatures pas encore jouées, dans l'ordre du niveau.
  pending: Sabotage[];
  pool: Sabotage[];
  log: ChaosEntry[];
};

// Générateur pseudo-aléatoire mulberry32 : une graine 32 bits suffit.
export function random(seed: number): [value: number, next: number] {
  const next = (seed + 0x6d2b79f5) >>> 0;
  let t = next;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, next];
}

export function createChaos(level: Level, seed: number): ChaosState {
  const tier = TIER_CHAOS[level.tier];
  const signature = level.chaos?.signature ?? [];
  return {
    seed: seed >>> 0,
    elapsedMs: 0,
    // Une première pause : on laisse le joueur lire la première question.
    quietUntilMs: Math.min(tier.gapMs, 10_000),
    used: 0,
    max: Math.max(tier.max, signature.length),
    pending: [...signature],
    pool: tier.pool,
    log: [],
  };
}

export type ChaosContext = {
  timed: boolean;
  // La question en cours a une variante (mutation possible).
  hasVariant: boolean;
  // La question en cours affiche du code (falsification possible).
  hasCode: boolean;
  // Une touche peut être bloquée sans rendre la réponse impossible à taper
  // (commande de plusieurs lettres, ou choix qu'on peut aussi toucher).
  canBlockKey: boolean;
  // Sabotages déjà joués sur la question en cours : jamais deux fois le même.
  usedHere: Sabotage[];
  // Partie dans la sandbox Docker (environnement hostile possible).
  sandbox?: boolean;
};

const LIES: Sabotage[] = ["false_red", "false_green"];

function eligible(kind: Sabotage, ctx: ChaosContext): boolean {
  if (LIES.includes(kind)) return false; // les mensonges se jouent sur une réponse
  if (ctx.usedHere.includes(kind)) return false;
  if (kind.startsWith("time_")) return ctx.timed;
  if (HOSTILE.includes(kind)) return !!ctx.sandbox;
  if (kind === "block_key") return ctx.canBlockKey;
  if (kind === "mutation") return ctx.hasVariant;
  if (kind === "falsify_code") return ctx.hasCode;
  return true;
}

function ready(chaos: ChaosState): boolean {
  return chaos.used < chaos.max && chaos.elapsedMs >= chaos.quietUntilMs;
}

function fire(chaos: ChaosState, kind: Sabotage, tier: Tier, seed: number): ChaosState {
  const pending = [...chaos.pending];
  const i = pending.indexOf(kind);
  if (i !== -1) pending.splice(i, 1);
  return {
    ...chaos,
    seed,
    used: chaos.used + 1,
    quietUntilMs: chaos.elapsedMs + TIER_CHAOS[tier].gapMs,
    pending,
  };
}

/**
 * Fait avancer l'horloge du Chaos ; renvoie éventuellement un sabotage à
 * déclencher maintenant (hors faux verdicts, joués par onAnswer).
 */
export function chaosTick(
  chaos: ChaosState,
  tier: Tier,
  elapsedMs: number,
  ctx: ChaosContext,
): { chaos: ChaosState; fire: Sabotage | null } {
  let next: ChaosState = { ...chaos, elapsedMs: chaos.elapsedMs + elapsedMs };
  if (!ready(next)) return { chaos: next, fire: null };

  const [roll, seed1] = random(next.seed);
  next = { ...next, seed: seed1 };
  const chance = 1 - Math.pow(1 - TIER_CHAOS[tier].perSecond, elapsedMs / 1000);
  if (roll >= chance) return { chaos: next, fire: null };

  const signature = next.pending.find((k) => eligible(k, ctx));
  const candidates = signature ? [signature] : next.pool.filter((k) => eligible(k, ctx));
  if (candidates.length === 0) return { chaos: next, fire: null };
  const [pick, seed2] = random(next.seed);
  const kind = candidates[Math.floor(pick * candidates.length)];
  return { chaos: fire(next, kind, tier, seed2), fire: kind };
}

/**
 * Au moment où le joueur répond : Arcade ment-il sur le verdict ?
 * « false_red » sur une bonne réponse, « false_green » sur une mauvaise.
 */
export function chaosOnAnswer(
  chaos: ChaosState,
  tier: Tier,
  correct: boolean,
): { chaos: ChaosState; lie: "false_red" | "false_green" | null } {
  const kind = correct ? "false_red" : "false_green";
  const allowed = chaos.pending.includes(kind) || chaos.pool.includes(kind);
  if (!allowed || !ready(chaos)) return { chaos, lie: null };
  const [roll, seed] = random(chaos.seed);
  const forced = chaos.pending.includes(kind);
  if (!forced && roll >= TIER_CHAOS[tier].lieChance) return { chaos: { ...chaos, seed }, lie: null };
  return { chaos: fire(chaos, kind, tier, seed), lie: kind };
}

export function logSabotage(chaos: ChaosState, entry: Omit<ChaosEntry, "atMs" | "detected">): ChaosState {
  return { ...chaos, log: [...chaos.log, { ...entry, atMs: chaos.elapsedMs, detected: false }] };
}

/** Marque comme démasqué le dernier sabotage de ce type encore caché. */
export function markDetected(chaos: ChaosState, kinds: Sabotage[]): ChaosState {
  const log = [...chaos.log];
  for (let i = log.length - 1; i >= 0; i--) {
    if (kinds.includes(log[i].kind) && !log[i].detected) {
      log[i] = { ...log[i], detected: true };
      return { ...chaos, log };
    }
  }
  return chaos;
}

// Barème : une partie Chaos rapporte 50 % d'XP en plus, et chaque sabotage
// démasqué ajoute 5 % de l'XP du niveau ; une vérification inutile en
// retire 2 %.
export const CHAOS_XP_FACTOR = 1.5;
export const CHAOS_DETECT_BONUS = 0.05;
export const CHAOS_VERIFY_MALUS = 0.02;

export function chaosXp(baseXp: number, levelXp: number, chaos: ChaosState, uselessVerifies: number): number {
  const detected = chaos.log.filter((e) => e.detected).length;
  const bonus = levelXp * (CHAOS_DETECT_BONUS * detected - CHAOS_VERIFY_MALUS * uselessVerifies);
  return Math.max(0, Math.round(baseXp * CHAOS_XP_FACTOR + bonus));
}

/** Change un chiffre (ou à défaut deux lettres) pour falsifier un extrait de code. */
export function falsifyCode(code: string, seed: number): string {
  const digit = /\d/.exec(code);
  if (digit) {
    const d = Number(digit[0]);
    const replacement = String((d + 1 + Math.floor(random(seed)[0] * 8)) % 10);
    return code.slice(0, digit.index) + replacement + code.slice(digit.index + 1);
  }
  const word = /[a-zA-Z]{3,}/.exec(code);
  if (!word) return `${code} `;
  const w = word[0];
  const swapped = w[0] + w[2] + w[1] + w.slice(3);
  return code.slice(0, word.index) + swapped + code.slice(word.index + w.length);
}
