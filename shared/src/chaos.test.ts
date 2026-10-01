import { describe, expect, it } from "vitest";
import {
  TIER_CHAOS,
  chaosOnAnswer,
  chaosTick,
  chaosXp,
  createChaos,
  falsifyCode,
  logSabotage,
  markDetected,
  random,
  type ChaosState,
} from "./chaos";
import { levelSchema } from "./schema";

const level = levelSchema.parse({
  id: "chaos_test",
  title: "Test",
  hook: "Test",
  tier: "script_kiddie",
  tree: "data_surgeon",
  type: "chaos",
  chaos: { signature: ["false_red", "mutation"] },
  questions: [{ kind: "command", prompt: "?", accept: ["ls"] }],
  rewards: { xp: 100 },
});

const ctx = { timed: false, hasVariant: true, hasCode: false, canBlockKey: true, usedHere: [] };

describe("générateur", () => {
  it("est déterministe à partir de la graine", () => {
    expect(random(42)).toEqual(random(42));
    expect(random(42)[0]).not.toBe(random(43)[0]);
  });
});

describe("ordonnancement", () => {
  it("respecte la pause de départ, puis joue d'abord les signatures", () => {
    let chaos = createChaos(level, 1);
    expect(chaosTick(chaos, "script_kiddie", 5_000, ctx).fire).toBeNull();

    // Au-delà de la pause, on tire jusqu'à obtenir un sabotage.
    let fired = null;
    for (let i = 0; i < 200 && !fired; i++) {
      const r = chaosTick(chaos, "script_kiddie", 1_000, ctx);
      chaos = r.chaos;
      fired = r.fire;
    }
    expect(fired).toBe("mutation");
    expect(chaos.pending).toEqual(["false_red"]);
    // Une nouvelle pause commence.
    expect(chaos.quietUntilMs).toBe(chaos.elapsedMs + TIER_CHAOS.script_kiddie.gapMs);
  });

  it("un faux verdict signature est forcé dès que la pause est passée", () => {
    const chaos = { ...createChaos(level, 7), elapsedMs: 30_000, pool: ["block_key" as const] };
    expect(chaosOnAnswer(chaos, "script_kiddie", false).lie).toBeNull(); // false_green hors réserve ici
    const r = chaosOnAnswer(chaos, "script_kiddie", true);
    expect(r.lie).toBe("false_red");
    expect(r.chaos.used).toBe(1);
  });

  it("ne rejoue pas un sabotage sur la même question, ni une touche bloquée injouable", () => {
    let chaos: ChaosState = { ...createChaos(level, 5), pending: [], pool: ["block_key"], max: 10 };
    for (let i = 0; i < 500; i++) {
      const blocked = chaosTick(chaos, "script_kiddie", 1_000, { ...ctx, canBlockKey: false });
      const repeated = chaosTick(chaos, "script_kiddie", 1_000, { ...ctx, usedHere: ["block_key"] });
      expect(blocked.fire).toBeNull();
      expect(repeated.fire).toBeNull();
      chaos = blocked.chaos;
    }
  });

  it("ne dépasse jamais le budget du palier", () => {
    let chaos: ChaosState = { ...createChaos(level, 3), pending: [], max: 1 };
    let count = 0;
    for (let i = 0; i < 2_000; i++) {
      const r = chaosTick(chaos, "script_kiddie", 1_000, { ...ctx, timed: true });
      chaos = r.chaos;
      if (r.fire) count++;
    }
    expect(count).toBe(1);
  });
});

describe("journal et barème", () => {
  it("marque le dernier sabotage démasqué et récompense la vigilance", () => {
    let chaos = createChaos(level, 1);
    chaos = logSabotage(chaos, { kind: "block_key", question: 0, note: "touche" });
    chaos = logSabotage(chaos, { kind: "false_red", question: 0, note: "mensonge" });
    chaos = markDetected(chaos, ["false_red"]);
    expect(chaos.log.map((e) => e.detected)).toEqual([false, true]);
    // 100 × 1,5 + 100 × (5 % × 1 − 2 % × 1) = 153
    expect(chaosXp(100, 100, chaos, 1)).toBe(153);
  });

  it("falsifie un chiffre, ou à défaut l'ordre de deux lettres", () => {
    for (let seed = 0; seed < 20; seed++) {
      const fake = falsifyCode("seq 4 | wc -l", seed);
      expect(fake).not.toBe("seq 4 | wc -l");
      expect(fake.replace(/\d/, "4")).toBe("seq 4 | wc -l");
    }
    expect(falsifyCode("ls -la", 1)).not.toBe("ls -la");
  });
});
