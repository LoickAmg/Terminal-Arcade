import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadLevels } from "@terminal-arcade/shared/loader";
import { LEVELS, MAX_XP_FACTOR, merge, sanitize, score } from "./progress";

describe("fiche des niveaux du serveur", () => {
  it("est à jour avec les fichiers YAML (sinon : npm run levels:meta)", () => {
    const levels = loadLevels(join(import.meta.dirname, "..", "..", "..", "shared", "levels"));
    expect(LEVELS.map((l) => [l.id, l.tier, l.tree, l.xp, l.unlocks])).toEqual(
      levels.map((l) => [l.id, l.tier, l.tree, l.rewards.xp, l.rewards.unlocks]),
    );
  });
});

describe("sauvegarde envoyée par le navigateur", () => {
  it("ignore les niveaux inconnus et plafonne l'XP", () => {
    const p = sanitize({ levels: { inexistant: { status: "passed", bestXp: 5 }, fs_nav_01: { status: "passed", bestXp: 999_999 } } });
    expect(Object.keys(p.levels)).toEqual(["fs_nav_01"]);
    expect(p.levels.fs_nav_01.bestXp).toBe(Math.round(120 * MAX_XP_FACTOR));
  });

  it("retire un niveau qu'on ne pouvait pas encore ouvrir, et ses suivants", () => {
    const p = sanitize({
      levels: {
        fs_nav_01: { status: "attempted", bestXp: 50 },
        fs_read_01: { status: "passed", bestXp: 140 },
        grep_01: { status: "passed", bestXp: 160 },
      },
    });
    expect(Object.keys(p.levels)).toEqual(["fs_nav_01"]);
  });

  it("recalcule l'XP par arbre sans lire celle du navigateur", () => {
    const p = sanitize({ levels: { fs_nav_01: { status: "passed", bestXp: 120 }, fs_read_01: { status: "passed", bestXp: 140 } } });
    expect(p.xpByTree).toEqual({ file_system_ninja: 260 });
    expect(score(p)).toEqual({ xp: 260, levelsPassed: 2, tierRank: 1 });
  });

  it("la fusion garde le meilleur de chaque appareil et ne fait rien reculer", () => {
    const server = sanitize({ levels: { fs_nav_01: { status: "passed", bestXp: 120, modes: ["classic"] } } });
    const merged = merge(server, { levels: { fs_nav_01: { status: "attempted", bestXp: 80, modes: ["timer"] }, fs_read_01: { status: "attempted", bestXp: 30 } } });
    expect(merged.levels.fs_nav_01).toEqual({ status: "passed", bestXp: 120, modes: ["classic", "timer"] });
    expect(merged.levels.fs_read_01.bestXp).toBe(30);
    // Rejouer la même requête ne change rien (idempotence).
    expect(merge(merged, merged)).toEqual(merged);
  });
});
