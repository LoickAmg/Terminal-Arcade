import { describe, expect, it } from "vitest";
import {
  applyEvent,
  createTimer,
  formatTime,
  hintsAllowed,
  isExpired,
  tick,
  timeBonusRatio,
  timeGoalMet,
  zoneOf,
  type TimerConfig,
} from "./timer";

const config = (mode: TimerConfig["mode"], extra: Partial<TimerConfig> = {}): TimerConfig => ({
  mode,
  duration_s: 100,
  par_s: 40,
  deficit_s: 30,
  mobile_multiplier: 1.5,
  ...extra,
});

describe("création", () => {
  it("allonge les durées sur téléphone et part en retard en rachat", () => {
    const t = createTimer(config("buyback"), { mobile: true });
    expect(t).toMatchObject({ mode: "buyback", initialMs: 150_000, valueMs: 105_000, parMs: 60_000 });
  });

  it("tire le mode au hasard, rachat compris seulement avec un déficit", () => {
    expect(createTimer(config("random"), { mobile: false, rng: () => 0.99 }).mode).toBe("buyback");
    expect(createTimer(config("random", { deficit_s: 0 }), { mobile: false, rng: () => 0.99 }).mode).toBe(
      "reverse",
    );
    expect(createTimer(config("random"), { mobile: false, rng: () => 0.3 }).mode).toBe("chrono");
  });
});

describe("écoulement", () => {
  it("le compte à rebours descend et expire à 0", () => {
    let t = createTimer(config("countdown"), { mobile: false });
    t = tick(t, 60_000);
    expect(zoneOf(t)).toBe("alerte");
    t = tick(t, 50_000);
    expect(t.valueMs).toBe(0);
    expect(isExpired(t)).toBe(true);
  });

  it("le chrono monte jusqu'à sa limite", () => {
    let t = createTimer(config("chrono"), { mobile: false });
    t = tick(t, 30_000);
    expect(formatTime(t.valueMs)).toBe("0:30");
    expect(timeBonusRatio(t)).toBe(1);
    t = tick(t, 200_000);
    expect(isExpired(t)).toBe(true);
  });
});

describe("événements", () => {
  it("reverse : erreurs et abandons retirent du temps, le premier coup en rend", () => {
    let t = createTimer(config("reverse"), { mobile: false });
    t = tick(t, 20_000);
    expect(applyEvent(t, "first_try").deltaMs).toBe(5_000);
    expect(applyEvent(t, "wrong").deltaMs).toBe(-10_000);
    expect(applyEvent(t, "skip").timer.valueMs).toBe(65_000);
  });

  it("reverse : indices doublés en alerte, bloqués en zone critique", () => {
    let t = createTimer(config("reverse"), { mobile: false });
    t = tick(t, 60_000);
    expect(applyEvent(t, "hint", 10).deltaMs).toBe(-20_000);
    expect(hintsAllowed(t)).toBe(true);
    t = tick(t, 20_000);
    expect(zoneOf(t)).toBe("critique");
    expect(hintsAllowed(t)).toBe(false);
  });

  it("le chrono ajoute les pénalités au temps écoulé", () => {
    const t = createTimer(config("chrono"), { mobile: false });
    const { timer, deltaMs } = applyEvent(t, "wrong");
    expect(deltaMs).toBe(-5_000);
    expect(timer.valueMs).toBe(5_000);
  });

  it("rachat : on ne dépasse jamais le temps initial, et l'objectif est retenu", () => {
    let t = createTimer(config("buyback", { deficit_s: 10 }), { mobile: false });
    expect(timeGoalMet(t)).toBe(false);
    const r = applyEvent(t, "first_try");
    expect(r.deltaMs).toBe(10_000);
    t = r.timer;
    expect(t.valueMs).toBe(100_000);
    expect(t.restored).toBe(true);
    t = tick(t, 30_000);
    expect(timeGoalMet(t)).toBe(true);
  });

  it("les gains cumulés sont plafonnés à la moitié du temps de référence", () => {
    let t = createTimer(config("reverse", { duration_s: 20, par_s: 10 }), { mobile: false });
    t = tick(t, 19_000);
    for (let i = 0; i < 5; i++) t = applyEvent(t, "first_try").timer;
    expect(t.gainedMs).toBe(10_000);
  });
});
