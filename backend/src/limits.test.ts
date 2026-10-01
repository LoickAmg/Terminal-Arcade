import { describe, expect, it } from "vitest";
import { OutputMeter, RateLimiter, clientAddress, tokenMatches } from "./limits";

describe("limiteur de fréquence", () => {
  it("refuse au-delà du maximum, puis réautorise quand la fenêtre a glissé", () => {
    const limiter = new RateLimiter(2, 1_000);
    expect(limiter.take("a", 0)).toBe(true);
    expect(limiter.take("a", 100)).toBe(true);
    expect(limiter.take("a", 200)).toBe(false);
    expect(limiter.take("b", 200)).toBe(true);
    expect(limiter.take("a", 1_050)).toBe(true);
  });
});

describe("compteur de sortie", () => {
  it("coupe un déluge de sortie, mais pas un débit normal", () => {
    const meter = new OutputMeter(1_000, 1_000);
    for (let t = 0; t < 5_000; t += 100) expect(meter.add(50, t)).toBe(true);
    const flood = new OutputMeter(1_000, 1_000);
    expect(flood.add(600, 0)).toBe(true);
    expect(flood.add(600, 10)).toBe(false);
  });
});

describe("adresse et jeton", () => {
  it("ne croit l'en-tête du proxy que si on le demande", () => {
    const headers = { "x-forwarded-for": "203.0.113.7, 10.0.0.1" };
    expect(clientAddress(headers, "127.0.0.1", false)).toBe("127.0.0.1");
    expect(clientAddress(headers, "127.0.0.1", true)).toBe("203.0.113.7");
  });

  it("compare le jeton exactement", () => {
    expect(tokenMatches("secret", "secret")).toBe(true);
    expect(tokenMatches("secreT", "secret")).toBe(false);
    expect(tokenMatches(undefined, "secret")).toBe(false);
  });
});
