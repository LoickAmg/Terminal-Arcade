import { checkAnswer, expectedAnswer, type Check } from "./check";
import type { Level, Question } from "./schema";

// Déroulé d'une partie : une question à la fois, dans l'ordre du niveau.
// Tout est immuable pour pouvoir le ranger tel quel dans l'état React.

export type QuestionOutcome = {
  // fooled : mauvaise réponse qu'Arcade a fait passer pour juste (Chaos).
  status: "correct" | "skipped" | "fooled";
  wrongAttempts: number;
  hintsUsed: number;
};

export type Run = {
  levelId: string;
  index: number;
  wrongAttempts: number;
  hintsUsed: number;
  outcomes: QuestionOutcome[];
};

export function startRun(level: Level): Run {
  return { levelId: level.id, index: 0, wrongAttempts: 0, hintsUsed: 0, outcomes: [] };
}

export function currentQuestion(level: Level, run: Run): Question | null {
  return level.questions[run.index] ?? null;
}

export function isFinished(level: Level, run: Run): boolean {
  return run.index >= level.questions.length;
}

function advance(run: Run, status: QuestionOutcome["status"]): Run {
  return {
    ...run,
    index: run.index + 1,
    wrongAttempts: 0,
    hintsUsed: 0,
    outcomes: [
      ...run.outcomes,
      { status, wrongAttempts: run.wrongAttempts, hintsUsed: run.hintsUsed },
    ],
  };
}

export function submit(level: Level, run: Run, input: string): { run: Run; check: Check } {
  const q = currentQuestion(level, run);
  if (!q) return { run, check: { kind: "invalid", reason: "Le niveau est terminé." } };
  const check = checkAnswer(q, input);
  if (check.kind === "correct") return { run: advance(run, "correct"), check };
  if (check.kind === "wrong") return { run: { ...run, wrongAttempts: run.wrongAttempts + 1 }, check };
  return { run, check };
}

/** Défi de la sandbox réussi (validé par l'arbitre du serveur). */
export function passTask(level: Level, run: Run): Run {
  return currentQuestion(level, run) ? advance(run, "correct") : run;
}

/** Mauvaise réponse soumise dans la sandbox. */
export function failTask(run: Run): Run {
  return { ...run, wrongAttempts: run.wrongAttempts + 1 };
}

export function skip(level: Level, run: Run): { run: Run; expected: string } | null {
  const q = currentQuestion(level, run);
  if (!q) return null;
  return { run: advance(run, "skipped"), expected: expectedAnswer(q) };
}

/** Chaos : la partie avance comme si la réponse était juste, mais elle ne l'est pas. */
export function fool(level: Level, run: Run): Run {
  return currentQuestion(level, run) ? advance({ ...run, wrongAttempts: run.wrongAttempts + 1 }, "fooled") : run;
}

export function nextHint(level: Level, run: Run): { run: Run; text: string } | null {
  const q = currentQuestion(level, run);
  const h = q?.hints[run.hintsUsed];
  if (!h) return null;
  return { run: { ...run, hintsUsed: run.hintsUsed + 1 }, text: h.text };
}

// Barème : chaque question vaut sa part de l'XP du niveau. Une erreur retire
// 20 %, un indice 25 %, sans descendre sous 30 % ; une question passée ne
// rapporte rien. Le niveau est réussi avec 60 % de bonnes réponses.
const PASS_RATIO = 0.6;

export function questionXp(levelXp: number, total: number, outcome: QuestionOutcome): number {
  if (outcome.status !== "correct") return 0;
  const share = levelXp / total;
  const factor = Math.max(0.3, 1 - 0.2 * outcome.wrongAttempts - 0.25 * outcome.hintsUsed);
  return share * factor;
}

export type Recap = {
  xp: number;
  correct: number;
  firstTry: number;
  total: number;
  passed: boolean;
};

export function recap(level: Level, run: Run): Recap {
  const total = level.questions.length;
  const correct = run.outcomes.filter((o) => o.status === "correct").length;
  const firstTry = run.outcomes.filter(
    (o) => o.status === "correct" && o.wrongAttempts === 0 && o.hintsUsed === 0,
  ).length;
  const xp = Math.round(
    run.outcomes.reduce((sum, o) => sum + questionXp(level.rewards.xp, total, o), 0),
  );
  return { xp, correct, firstTry, total, passed: correct >= Math.ceil(total * PASS_RATIO) };
}
