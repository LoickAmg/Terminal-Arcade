// Moteur du temps (phase 2). Pur et indépendant de l'horloge : on lui
// donne des durées écoulées et des événements de jeu, il renvoie le nouvel
// état. Les états du temps du mode Chaos (accéléré, figé…) s'ajouteront
// par-dessus en phase 3.
//
// Quatre modes :
//   countdown  compte à rebours ; défaite à 0
//   chrono     le temps monte ; défaite à la limite ; erreurs et indices
//              ajoutent des secondes
//   reverse    compte à rebours où erreurs, indices et abandons retirent du
//              temps, et où les bonnes réponses du premier coup en rendent
//   buyback    rachat : on part en déficit et il faut revenir au temps
//              initial avant la fin du niveau

export const TIMER_MODES = ["countdown", "chrono", "reverse", "buyback"] as const;
export type TimerMode = (typeof TIMER_MODES)[number];

export type TimerConfig = {
  mode: TimerMode | "random";
  duration_s: number;
  par_s: number;
  deficit_s: number;
  mobile_multiplier: number;
};

export type TimerState = {
  mode: TimerMode;
  // Durée de référence (après multiplicateur mobile) : départ du compte à
  // rebours, limite du chrono, objectif du rachat.
  initialMs: number;
  // Temps restant (countdown, reverse, buyback) ou écoulé (chrono).
  valueMs: number;
  parMs: number;
  // Total des secondes rendues au joueur, plafonné pour éviter les abus.
  gainedMs: number;
  // Rachat : vrai dès que le temps initial a été atteint une fois.
  restored: boolean;
};

export type TimerEvent = "first_try" | "correct" | "wrong" | "hint" | "skip";

export type Zone = "normal" | "alerte" | "critique" | "limite";

const S = 1000;

// Secondes gagnées (+) ou perdues (−) par événement. Pour le chrono, le
// signe est inversé à l'application : une pénalité y ajoute du temps.
const EFFECTS: Record<TimerMode, Record<Exclude<TimerEvent, "hint">, number>> = {
  countdown: { first_try: 0, correct: 0, wrong: 0, skip: 0 },
  chrono: { first_try: 0, correct: 0, wrong: -5, skip: -15 },
  reverse: { first_try: 5, correct: 0, wrong: -10, skip: -15 },
  buyback: { first_try: 12, correct: 6, wrong: -5, skip: -15 },
};

// Les gains cumulés ne dépassent pas la moitié du temps de référence.
const GAIN_CAP_RATIO = 0.5;

export function createTimer(
  config: TimerConfig,
  options: { mobile: boolean; rng?: () => number },
): TimerState {
  const factor = options.mobile ? config.mobile_multiplier : 1;
  const mode = config.mode === "random" ? pickMode(config, options.rng ?? Math.random) : config.mode;
  const initialMs = Math.round(config.duration_s * factor * S);
  const deficitMs = Math.round(config.deficit_s * factor * S);
  return {
    mode,
    initialMs,
    valueMs: mode === "chrono" ? 0 : mode === "buyback" ? initialMs - deficitMs : initialMs,
    parMs: Math.round(config.par_s * factor * S),
    gainedMs: 0,
    restored: false,
  };
}

function pickMode(config: TimerConfig, rng: () => number): TimerMode {
  const modes: TimerMode[] = ["countdown", "chrono", "reverse"];
  if (config.deficit_s > 0) modes.push("buyback");
  return modes[Math.min(modes.length - 1, Math.floor(rng() * modes.length))];
}

export function tick(timer: TimerState, elapsedMs: number): TimerState {
  if (elapsedMs <= 0 || isExpired(timer)) return timer;
  if (timer.mode === "chrono") {
    return { ...timer, valueMs: Math.min(timer.initialMs, timer.valueMs + elapsedMs) };
  }
  return { ...timer, valueMs: Math.max(0, timer.valueMs - elapsedMs) };
}

export function isExpired(timer: TimerState): boolean {
  return timer.mode === "chrono" ? timer.valueMs >= timer.initialMs : timer.valueMs <= 0;
}

/** Part du temps encore disponible, de 1 (tout) à 0 (rien). */
export function remainingRatio(timer: TimerState): number {
  const left = timer.mode === "chrono" ? timer.initialMs - timer.valueMs : timer.valueMs;
  return Math.max(0, Math.min(1, left / timer.initialMs));
}

export function zoneOf(timer: TimerState): Zone {
  if (isExpired(timer)) return "limite";
  const ratio = remainingRatio(timer);
  if (ratio <= 0.25) return "critique";
  if (ratio <= 0.5) return "alerte";
  return "normal";
}

/** Les zones ne pénalisent que les modes reverse et rachat. */
function penalized(timer: TimerState): boolean {
  return timer.mode === "reverse" || timer.mode === "buyback";
}

export function hintsAllowed(timer: TimerState | null): boolean {
  return !timer || !penalized(timer) || zoneOf(timer) !== "critique";
}

/** Coût d'un indice en secondes ; doublé en zone d'alerte. */
export function hintCostMs(timer: TimerState, costS: number): number {
  const factor = penalized(timer) && zoneOf(timer) === "alerte" ? 2 : 1;
  return costS * factor * S;
}

export function applyEvent(
  timer: TimerState,
  event: TimerEvent,
  hintCostS = 0,
): { timer: TimerState; deltaMs: number } {
  if (isExpired(timer)) return { timer, deltaMs: 0 };

  // Delta vu du joueur : positif = du temps en plus pour lui.
  let delta =
    event === "hint"
      ? timer.mode === "countdown"
        ? 0
        : -hintCostMs(timer, hintCostS)
      : EFFECTS[timer.mode][event] * S;

  if (delta > 0) {
    const capMs = timer.initialMs * GAIN_CAP_RATIO;
    delta = Math.min(delta, Math.max(0, capMs - timer.gainedMs));
    // Le rachat ne dépasse jamais le temps initial.
    if (timer.mode === "buyback") delta = Math.min(delta, Math.max(0, timer.initialMs - timer.valueMs));
  }
  if (delta === 0) return { timer, deltaMs: 0 };

  const valueMs =
    timer.mode === "chrono"
      ? Math.min(timer.initialMs, timer.valueMs - delta)
      : Math.max(0, timer.valueMs + delta);
  return {
    timer: {
      ...timer,
      valueMs,
      gainedMs: timer.gainedMs + Math.max(0, delta),
      restored: timer.restored || (timer.mode === "buyback" && valueMs >= timer.initialMs),
    },
    deltaMs: delta,
  };
}

/** Objectif de temps atteint (seul le rachat a un objectif en plus du reste). */
export function timeGoalMet(timer: TimerState): boolean {
  if (isExpired(timer)) return false;
  return timer.mode === "buyback" ? timer.restored : true;
}

/**
 * Bonus de temps, entre 0 et 1 : temps restant pour les comptes à rebours,
 * rapidité par rapport au temps de référence pour le chrono.
 */
export function timeBonusRatio(timer: TimerState): number {
  if (!timeGoalMet(timer)) return 0;
  if (timer.mode === "chrono") {
    if (timer.valueMs <= timer.parMs) return 1;
    return Math.max(0, (timer.initialMs - timer.valueMs) / (timer.initialMs - timer.parMs));
  }
  return remainingRatio(timer);
}

// Une partie chronométrée rapporte 25 % de plus, et jusqu'à 20 % de l'XP
// du niveau en bonus selon le temps restant (ou la vitesse au chrono).
export const TIMER_XP_FACTOR = 1.25;
export const TIMER_BONUS_SHARE = 0.2;

export function timedXp(baseXp: number, levelXp: number, timer: TimerState): number {
  return Math.round(baseXp * TIMER_XP_FACTOR + levelXp * TIMER_BONUS_SHARE * timeBonusRatio(timer));
}

export function formatTime(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / S));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export const TIMER_LABELS: Record<TimerMode, string> = {
  countdown: "Compte à rebours",
  chrono: "Chrono",
  reverse: "Reverse",
  buyback: "Rachat",
};
