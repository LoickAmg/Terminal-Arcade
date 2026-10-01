import {
  EMPTY_PROGRESS,
  type ChaosEntry,
  type ChaosState,
  type Level,
  type PlayMode,
  type Progress,
  type Question,
  type Recap,
  type Run,
  type TimerState,
} from "@terminal-arcade/shared";
import { DEFAULT_PET, type PetConfig } from "./pet";

// Types et état du jeu, partagés par le lobby (game.ts), les niveaux
// (play.ts) et le compagnon (wizard.ts).

export type Feedback = {
  tone: "good" | "bad" | "info";
  title: string;
  output?: string;
  explain?: string;
  // Verdict annoncé par le compagnon en mode Chaos (il peut mentir).
  claimedBy?: string;
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
      mode: PlayMode;
      // Temps final d'une partie chronométrée, et cause de l'échec éventuel.
      timer: TimerState | null;
      timedOut: boolean;
      // Rejouables ensuite avec une couche de plus.
      replays: { timer: boolean; chaos: boolean };
      // Sabotages subis, révélés à la fin (le verdict final ne ment jamais).
      chaosLog: ChaosEntry[] | null;
    }
  | { kind: "profile" }
  | { kind: "pet" };

export type WizardStep = "form" | "color" | "accessory" | "name";
export type Wizard = { step: WizardStep; draft: PetConfig; firstTime: boolean };

export type TimeEffect = {
  kind: "accel" | "freeze" | "fluctuate";
  startMs: number;
  untilMs: number;
  // Valeur affichée figée (freeze).
  frozenMs: number;
};

/** Ce que le Chaos a modifié dans la partie en cours. */
export type ChaosRun = {
  state: ChaosState;
  // Les échéances sont exprimées sur l'horloge du Chaos (state.elapsedMs).
  blockedKey: { key: string; untilMs: number } | null;
  terminalClosed: boolean;
  timeEffect: TimeEffect | null;
  // Mutations : question remplacée par sa variante, par numéro.
  overrides: Record<number, Question>;
  // Code affiché faussement à l'écran (le terminal, lui, dit vrai).
  falsified: Record<number, string>;
  // Dernier faux verdict, vérifiable avec verify jusqu'à la réponse suivante.
  lie: { kind: "false_red"; answer: string } | { kind: "false_green"; before: Run } | null;
  lastReculMs: number | null;
  uselessVerifies: number;
};

export type ActiveLevel = {
  levelId: string;
  run: Run;
  mode: PlayMode;
  timer: TimerState | null;
  // Dernier gain ou perte de temps, pour l'animation du bandeau.
  lastDelta: { ms: number; id: number } | null;
  chaos: ChaosRun | null;
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

export type PetReaction = "happy" | "sad" | "cheer" | "think" | "alarm" | "mischief";

export type LineResult = {
  state: GameState;
  out: string[];
  clear?: boolean;
  reaction?: PetReaction;
  // Phrase précise du compagnon (sinon, une phrase au hasard selon la réaction).
  say?: string;
};

export const KIND_LABELS: Record<Question["kind"], string> = {
  command: "Commande",
  mcq: "QCM",
  trap: "Piège",
  predict: "Prédis la sortie",
  fill: "Complète",
};

export const LEVEL_KEYWORDS = {
  hint: ["hint", "indice"],
  skip: ["skip", "passer"],
  quit: ["quit", "exit", "quitter"],
  help: ["help", "aide"],
  verify: ["verify", "verifier", "vérifier"],
  clock: ["clock", "date"],
};

export function matches(word: string, list: string[]) {
  return list.includes(word.toLowerCase());
}

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

export function activeLevel(state: GameState, levels: Level[]): Level | null {
  return state.active ? (levels.find((l) => l.id === state.active!.levelId) ?? null) : null;
}

/** Le niveau tel qu'il se joue : avec les mutations du Chaos appliquées. */
export function playedLevel(state: GameState, levels: Level[]): Level | null {
  const level = activeLevel(state, levels);
  const overrides = state.active?.chaos?.overrides;
  if (!level || !overrides || Object.keys(overrides).length === 0) return level;
  return { ...level, questions: level.questions.map((q, i) => overrides[i] ?? q) };
}
