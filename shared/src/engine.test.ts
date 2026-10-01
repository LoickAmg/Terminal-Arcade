import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadLevels } from "./loader";
import { normalizeCommand, tokenize } from "./normalize";
import { checkAnswer } from "./check";
import { nextHint, recap, skip, startRun, submit } from "./run";
import { EMPTY_PROGRESS, isUnlocked, recordRun } from "./catalog";
import { levelSchema, type Level } from "./schema";

describe("normalizeCommand", () => {
  it("rend équivalentes les options groupées, séparées ou dans le désordre", () => {
    expect(normalizeCommand("ls -la")).toBe(normalizeCommand("ls -al"));
    expect(normalizeCommand("ls  -a   -l")).toBe(normalizeCommand("ls -la"));
  });

  it("ignore les guillemets et la barre finale d'un dossier", () => {
    expect(normalizeCommand("grep 'CRITICAL' access.log")).toBe("grep CRITICAL access.log");
    expect(normalizeCommand("cd ../")).toBe("cd ..");
    expect(normalizeCommand("cd /")).toBe("cd /");
  });

  it("ne découpe pas les options longues à un tiret de find", () => {
    expect(normalizeCommand("find . -name a.txt")).toBe("find . -name a.txt");
  });

  it("sépare les opérateurs collés et normalise chaque commande d'un pipeline", () => {
    expect(tokenize("ls|grep -i x>out")).toEqual(["ls", "|", "grep", "-i", "x", ">", "out"]);
    expect(normalizeCommand("ps aux|grep -ri virus")).toBe("ps aux | grep -i -r virus");
  });
});

const level: Level = levelSchema.parse({
  id: "test_01",
  title: "Test",
  hook: "Test",
  tier: "script_kiddie",
  tree: "file_system_ninja",
  questions: [
    { kind: "command", prompt: "ls caché", accept: ["ls -a"], hints: [{ text: "all" }] },
    { kind: "mcq", prompt: "?", choices: ["a", "b", "c"], answer: 2 },
    { kind: "predict", prompt: "?", code: "echo hi", accept: ["hi"] },
  ],
  rewards: { xp: 300, unlocks: "test_02" },
});

describe("checkAnswer", () => {
  it("accepte un QCM par numéro ou par texte, refuse un numéro hors limites sans pénalité", () => {
    const q = level.questions[1];
    expect(checkAnswer(q, "2").kind).toBe("correct");
    expect(checkAnswer(q, " B ").kind).toBe("correct");
    expect(checkAnswer(q, "1").kind).toBe("wrong");
    expect(checkAnswer(q, "9").kind).toBe("invalid");
  });

  it("compare une sortie prédite sans tenir compte des espaces ni de la casse", () => {
    expect(checkAnswer(level.questions[2], "  HI ").kind).toBe("correct");
  });
});

describe("déroulé d'une partie", () => {
  it("avance sur une bonne réponse et compte erreurs et indices", () => {
    let run = startRun(level);
    run = submit(level, run, "ls").run;
    run = nextHint(level, run)!.run;
    run = submit(level, run, "ls -a").run;
    expect(run.index).toBe(1);
    expect(run.outcomes[0]).toEqual({ status: "correct", wrongAttempts: 1, hintsUsed: 1 });

    run = submit(level, run, "2").run;
    run = skip(level, run)!.run;
    const r = recap(level, run);
    // Q1 : 100 × (1 − 0,2 − 0,25) = 55 ; Q2 : 100 ; Q3 passée : 0.
    expect(r).toEqual({ xp: 155, correct: 2, firstTry: 1, total: 3, passed: true });
  });
});

describe("progression", () => {
  it("débloque le niveau suivant et ne recompte que le gain de meilleur score", () => {
    const next = { ...level, id: "test_02", rewards: { xp: 100 } };
    const levels = [level, next];
    expect(isUnlocked(next, levels, EMPTY_PROGRESS)).toBe(false);

    let progress = recordRun(EMPTY_PROGRESS, level, { xp: 200, passed: true });
    progress = recordRun(progress, level, { xp: 150, passed: false });
    expect(isUnlocked(next, levels, progress)).toBe(true);
    expect(progress.levels.test_01).toEqual({ status: "passed", bestXp: 200, modes: ["classic"] });
    expect(progress.xpByTree.file_system_ninja).toBe(200);
  });
});

describe("niveaux fournis", () => {
  const levels = loadLevels(join(import.meta.dirname, "..", "levels"));

  it("sont tous valides", () => {
    expect(levels.length).toBeGreaterThanOrEqual(4);
  });

  it("acceptent chacun leur première réponse attendue", () => {
    for (const l of levels) {
      // Les défis de la sandbox sont testés à part, contre Docker.
      for (const q of l.questions) {
        if (q.kind === "task") continue;
        const answer = "accept" in q ? q.accept[0] : String(q.answer);
        expect(checkAnswer(q, answer).kind, `${l.id} : ${q.prompt}`).toBe("correct");
      }
    }
  });
});
