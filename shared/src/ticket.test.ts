import { generateKeyPairSync } from "node:crypto";
import { describe, expect, it } from "vitest";
import { CLOCK_SKEW_S, ReplayGuard, TICKET_TTL_S, signTicket, verifyTicket } from "./ticket";

const pair = () => generateKeyPairSync("ed25519");
const main = pair();
const other = pair();
const keys = new Map([["k1", main.publicKey]]);
const NOW = Date.UTC(2026, 9, 3, 12);

describe("tickets d'accès à la sandbox", () => {
  it("un ticket signé est accepté et porte le joueur", () => {
    const check = verifyTicket(signTicket("joueur-1", main.privateKey, "k1", NOW), keys, NOW + 1000);
    expect(check.ok && check.claims.sub).toBe("joueur-1");
  });

  it("refuse une autre clé, une clé inconnue ou un contenu modifié", () => {
    expect(verifyTicket(signTicket("j", other.privateKey, "k1", NOW), keys, NOW).ok).toBe(false);
    expect(verifyTicket(signTicket("j", main.privateKey, "k9", NOW), keys, NOW).ok).toBe(false);
    const [h, , s] = signTicket("j", main.privateKey, "k1", NOW).split(".");
    const forged = Buffer.from(JSON.stringify({ sub: "admin", jti: "x", iat: NOW / 1000, exp: NOW / 1000 + 999 })).toString("base64url");
    expect(verifyTicket(`${h}.${forged}.${s}`, keys, NOW)).toEqual({ ok: false, reason: "signature invalide" });
    const none = Buffer.from(JSON.stringify({ alg: "none", kid: "k1" })).toString("base64url");
    expect(verifyTicket(`${none}.${forged}.`, keys, NOW).ok).toBe(false);
  });

  it("tolère 30 s de décalage d'horloge, pas plus", () => {
    const ticket = signTicket("j", main.privateKey, "k1", NOW);
    const end = NOW + TICKET_TTL_S * 1000;
    expect(verifyTicket(ticket, keys, end + (CLOCK_SKEW_S - 1) * 1000).ok).toBe(true);
    expect(verifyTicket(ticket, keys, end + (CLOCK_SKEW_S + 1) * 1000)).toEqual({ ok: false, reason: "ticket expiré" });
    expect(verifyTicket(ticket, keys, NOW - (CLOCK_SKEW_S + 1) * 1000)).toEqual({ ok: false, reason: "ticket daté du futur" });
  });

  it("un ticket ne sert qu'une fois", () => {
    const guard = new ReplayGuard();
    const check = verifyTicket(signTicket("j", main.privateKey, "k1", NOW), keys, NOW);
    if (!check.ok) throw new Error(check.reason);
    expect(guard.use(check.claims, NOW)).toBe(true);
    expect(guard.use(check.claims, NOW + 5000)).toBe(false);
  });

  it("accepte deux clés pendant une rotation", () => {
    const both = new Map([
      ["k1", main.publicKey],
      ["k2", other.publicKey],
    ]);
    expect(verifyTicket(signTicket("j", other.privateKey, "k2", NOW), both, NOW).ok).toBe(true);
    expect(verifyTicket(signTicket("j", main.privateKey, "k1", NOW), both, NOW).ok).toBe(true);
  });
});
