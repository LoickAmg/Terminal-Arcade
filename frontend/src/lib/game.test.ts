import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadLevels } from "@terminal-arcade/shared/loader";
import { completions, handleLine, initialState, promptFor, tickGame, type GameState } from "./game";
import { stripAnsi } from "./ansi";
import { DEFAULT_PET } from "./pet";
import { createEditor, feed } from "./lineEditor";

const levels = loadLevels(join(import.meta.dirname, "..", "..", "..", "shared", "levels"));

function play(state: GameState, ...lines: string[]) {
  let out: string[] = [];
  for (const line of lines) {
    const r = handleLine(state, line, levels);
    state = r.state;
    out = r.out.map(stripAnsi);
  }
  return { state, out };
}

describe("premier lancement", () => {
  it("crée le compagnon pas à pas, nom par défaut Arcade", () => {
    const { state } = play(initialState(null, null), "2", "Cyan", "3", "");
    expect(state.wizard).toBeNull();
    expect(state.pet).toEqual({ ...DEFAULT_PET, form: "robot", color: "cyan", accessory: "lunettes" });
  });
});

describe("parcours d'un niveau", () => {
  const start = initialState(null, DEFAULT_PET);

  it("refuse un niveau verrouillé", () => {
    const { state, out } = play(start, "open fs_read_01");
    expect(state.active).toBeNull();
    expect(out.join(" ")).toContain("verrouillé");
  });

  it("joue fs_nav_01 en entier, débloque le suivant", () => {
    const { state, out } = play(start, "open fs_nav_01", "pwd", "ls", "ls -al", "1", "/var", "cd outils/");
    expect(state.active).toBeNull();
    expect(state.screen.kind).toBe("recap");
    expect(state.progress.levels.fs_nav_01).toEqual({ status: "passed", bestXp: 120, modes: ["classic"] });
    expect(out.join("\n")).toContain("open fs_read_01");
    expect(completions(state, levels, "open fs_r")).toEqual(["open fs_read_01"]);
  });

  it("une mauvaise réponse garde la question, quit ramène au lobby", () => {
    let { state } = play(start, "open fs_nav_01", "ls");
    expect(state.active?.run.index).toBe(0);
    expect(stripAnsi(promptFor(state, levels))).toBe("agent@fs_nav_01:~$ ");
    state = play(state, "quit").state;
    expect(state.active).toBeNull();
    expect(state.progress.levels.fs_nav_01.status).toBe("attempted");
  });
});

describe("parties chronométrées", () => {
  const start = initialState(null, DEFAULT_PET);
  const fsNavAnswers = ["pwd", "ls", "ls -a", "1", "/var", "cd outils"];

  it("refuse --timer tant que le niveau n'est pas réussi, l'accepte ensuite", () => {
    const refused = play(start, "open fs_nav_01 --timer");
    expect(refused.state.active).toBeNull();
    expect(refused.out.join(" ")).toContain("Réussis d'abord");

    let state = play(refused.state, "open fs_nav_01", ...fsNavAnswers).state;
    expect(completions(state, levels, "open fs_nav_01 -")).toEqual(["open fs_nav_01 --timer"]);
    state = play(state, "open fs_nav_01 --timer").state;
    expect(state.active?.mode).toBe("timer");
    expect(state.active?.timer).not.toBeNull();
  });

  it("le temps écoulé termine le niveau en échec", () => {
    let state = play(start, "open fs_nav_01", ...fsNavAnswers, "open fs_nav_01 --timer", "pwd").state;
    const result = tickGame(state, levels, 10 * 60_000)!;
    state = result.state;
    expect(state.active).toBeNull();
    expect(state.screen).toMatchObject({ kind: "recap", timedOut: true, recap: { passed: false } });
    expect(result.out.map(stripAnsi).join("\n")).toContain("Temps écoulé");
    // Le niveau reste réussi en classique ; le mode Timer, lui, n'est pas validé.
    expect(state.progress.levels.fs_nav_01.modes).toEqual(["classic"]);
  });

  it("un niveau Timer natif se joue toujours chronométré, en rachat", () => {
    const unlocked: GameState = {
      ...start,
      progress: {
        levels: { grep_01: { status: "passed", bestXp: 160, modes: ["classic"] } },
        xpByTree: {},
      },
    };
    let { state } = play(unlocked, "open sk_rush_01");
    expect(state.active?.timer?.mode).toBe("buyback");
    // Sept bonnes réponses du premier coup rachètent les 30 s de retard.
    state = play(
      state,
      "cd",
      "wc -l access.log",
      "1",
      "head -n 3 journal.log",
      "1",
      "grep -i error journal.log",
      "2",
    ).state;
    expect(state.screen).toMatchObject({ kind: "recap", recap: { passed: true } });
    expect(state.progress.levels.sk_rush_01.modes).toEqual(["timer"]);
  });
});

describe("éditeur de ligne", () => {
  it("gère saisie, flèches, retour arrière et historique", () => {
    let { state, actions } = feed(createEditor(), "lz\x7fs -a\x1b[D\x1b[D\x1b[3~\r");
    expect(actions).toEqual([{ type: "submit", line: "ls a" }]);
    ({ state } = feed(state, "\x1b[A"));
    expect(state.buffer).toBe("ls a");
    ({ state, actions } = feed(state, "\x03"));
    expect(actions).toEqual([{ type: "interrupt" }]);
    expect(state.buffer).toBe("");
  });
});
