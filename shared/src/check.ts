import { normalizeCommand, normalizeText } from "./normalize";
import type { Question } from "./schema";

export function isChoiceQuestion(
  q: Question,
): q is Extract<Question, { kind: "mcq" | "trap" }> {
  return q.kind === "mcq" || q.kind === "trap";
}

/** Le joueur répond à un QCM par le numéro du choix ou par son texte exact. */
export function parseChoice(q: Extract<Question, { kind: "mcq" | "trap" }>, input: string): number | null {
  const trimmed = input.trim();
  if (/^\d+$/.test(trimmed)) {
    const n = Number(trimmed);
    return n >= 1 && n <= q.choices.length ? n : null;
  }
  const index = q.choices.findIndex((c) => normalizeText(c) === normalizeText(trimmed));
  return index === -1 ? null : index + 1;
}

export type Check =
  | { kind: "correct" }
  | { kind: "wrong" }
  // Réponse impossible à évaluer (numéro hors des choix…) : pas de pénalité.
  | { kind: "invalid"; reason: string };

export function checkAnswer(q: Question, input: string): Check {
  if (input.trim() === "") return { kind: "invalid", reason: "Réponse vide." };

  switch (q.kind) {
    case "command": {
      const given = normalizeCommand(input);
      return q.accept.some((a) => normalizeCommand(a) === given)
        ? { kind: "correct" }
        : { kind: "wrong" };
    }
    case "fill": {
      const given = normalizeCommand(input);
      return q.accept.some((a) => normalizeCommand(a) === given)
        ? { kind: "correct" }
        : { kind: "wrong" };
    }
    case "predict": {
      const given = normalizeText(input);
      return q.accept.some((a) => normalizeText(a) === given)
        ? { kind: "correct" }
        : { kind: "wrong" };
    }
    case "mcq":
    case "trap": {
      const choice = parseChoice(q, input);
      if (choice === null) {
        return { kind: "invalid", reason: `Tape un numéro entre 1 et ${q.choices.length}.` };
      }
      return choice === q.answer ? { kind: "correct" } : { kind: "wrong" };
    }
  }
}

/** La bonne réponse telle qu'on la montre au joueur (après un abandon). */
export function expectedAnswer(q: Question): string {
  if (isChoiceQuestion(q)) return `${q.answer}. ${q.choices[q.answer - 1]}`;
  return q.accept[0];
}
