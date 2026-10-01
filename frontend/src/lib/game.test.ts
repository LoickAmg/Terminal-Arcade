import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadLevels } from "@terminal-arcade/shared/loader";
import { completions, handleLine, initialState, promptFor, type GameState } from "./game";
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
    expect(state.progress.levels.fs_nav_01).toEqual({ status: "passed", bestXp: 120 });
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
