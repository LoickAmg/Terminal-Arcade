import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadLevels } from "@terminal-arcade/shared/loader";
import { completions, handleLine, initialState, promptFor, reopenTerminal, tickGame, type GameState } from "./game";
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
    const { state } = play(initialState(null, null), "2", "2", "Cyan", "3", "");
    expect(state.wizard).toBeNull();
    expect(state.pet).toEqual({ ...DEFAULT_PET, style: "persona", form: "robot", color: "cyan", accessory: "lunettes" });
    expect(play(state, "pet style pixel").state.pet.style).toBe("pixel");
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
    expect(completions(state, levels, "open fs_nav_01 --t")).toEqual(["open fs_nav_01 --timer"]);
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

describe("mode Chaos", () => {
  const start = initialState(null, DEFAULT_PET);
  const fsNavAnswers = ["pwd", "ls", "ls -a", "1", "/var", "cd outils"];
  const rng = () => 0.5;

  // Passe la pause de départ du Chaos sans déclencher de sabotage.
  function afterQuiet(state: GameState): GameState {
    const chaos = state.active!.chaos!;
    return {
      ...state,
      active: { ...state.active!, chaos: { ...chaos, state: { ...chaos.state, elapsedMs: 60_000 } } },
    };
  }

  it("se rejoue seulement après réussite, et se combine avec le Timer", () => {
    expect(play(start, "open fs_nav_01 --chaos").state.active).toBeNull();
    let state = play(start, "open fs_nav_01", ...fsNavAnswers).state;
    state = handleLine(state, "open fs_nav_01 --chaos --timer", levels, rng).state;
    expect(state.active?.mode).toBe("chaos_timer");
    expect(state.active?.chaos).not.toBeNull();
    expect(state.active?.timer).not.toBeNull();
  });

  it("un faux « faux » se démasque avec verify et la réponse est validée", () => {
    const unlocked: GameState = {
      ...start,
      progress: { levels: { sk_rush_01: { status: "passed", bestXp: 1, modes: ["timer"] } }, xpByTree: {} },
    };
    let state = afterQuiet(handleLine(unlocked, "open sk_chaos_01", levels, rng).state);
    let r = handleLine(state, "ls -l", levels);
    expect(stripAnsi(r.out[0])).toBe("Arcade : ✘ Pas tout à fait.");
    expect(r.state.active?.run.index).toBe(0);

    r = handleLine(r.state, "verify", levels);
    state = r.state;
    expect(stripAnsi(r.out.join(" "))).toContain("Démasqué");
    expect(state.active?.run.index).toBe(1);
    expect(state.active?.chaos?.state.log[0]).toMatchObject({ kind: "false_red", detected: true });
  });

  it("un faux « correct » fait avancer, verify ramène à la question", () => {
    let state = handleLine(
      play(start, "open fs_nav_01", ...fsNavAnswers).state,
      "open fs_nav_01 --chaos",
      levels,
      rng,
    ).state;
    state = afterQuiet(state);
    const chaos = state.active!.chaos!;
    state = {
      ...state,
      active: { ...state.active!, chaos: { ...chaos, state: { ...chaos.state, pending: ["false_green"] } } },
    };

    let r = handleLine(state, "ls", levels);
    expect(stripAnsi(r.out[0])).toBe("Arcade : ✔ Correct.");
    expect(r.state.active?.run.index).toBe(1);

    r = handleLine(r.state, "verify", levels);
    expect(r.state.active?.run.index).toBe(0);
    expect(r.state.active?.run.wrongAttempts).toBe(1);
  });

  it("un verify inutile est compté, et le terminal fermé se rouvre sans rien perdre", () => {
    let state = handleLine(
      play(start, "open fs_nav_01", ...fsNavAnswers).state,
      "open fs_nav_01 --chaos",
      levels,
      rng,
    ).state;
    state = handleLine(state, "verify", levels).state;
    expect(state.active?.chaos?.uselessVerifies).toBe(1);

    state = { ...state, active: { ...state.active!, chaos: { ...state.active!.chaos!, terminalClosed: true } } };
    const r = reopenTerminal(state);
    expect(r.state.active?.chaos?.terminalClosed).toBe(false);
    expect(r.state.active?.run).toEqual(state.active?.run);
  });

  it("le récap révèle les sabotages et le niveau suivant", () => {
    let state = handleLine(
      play(start, "open fs_nav_01", ...fsNavAnswers).state,
      "open fs_nav_01 --chaos",
      levels,
      rng,
    ).state;
    for (const answer of fsNavAnswers) state = handleLine(state, answer, levels).state;
    expect(state.screen).toMatchObject({ kind: "recap", mode: "chaos", chaosLog: [] });
    expect(state.progress.levels.fs_nav_01.modes).toEqual(["classic", "chaos"]);
  });
});

describe("parcours Git-Gud", () => {
  it("a sa propre entrée : la liste principale l'annonce, ls missions/git-gud/ le détaille", () => {
    const start = initialState(null, DEFAULT_PET);
    const main = play(start, "ls missions/");
    expect(main.out.join("\n")).toContain("git-gud/");
    expect(main.out.join("\n")).not.toContain("gg_bisect_01");

    const track = play(start, "ls missions/git-gud");
    expect(track.state.screen).toEqual({ kind: "missions", track: "git-gud" });
    expect(track.out.filter((l) => l.includes("gg_")).length).toBe(4);
    expect(play(start, "cd missions/git-gud/").state.screen).toEqual({ kind: "missions", track: "git-gud" });
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
