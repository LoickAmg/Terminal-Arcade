import { createPrivateKey, createPublicKey, randomUUID, sign, verify, type KeyObject } from "node:crypto";

// Ticket d'accès à la sandbox. Le site (qui connaît le joueur) le signe avec
// une clé privée Ed25519 ; la sandbox le vérifie avec la clé publique seule :
// même compromise, elle ne peut pas fabriquer de tickets.
//
// Format compact, à la manière d'un JWT : base64url(entête).base64url(contenu).signature
//   entête  : { alg: "EdDSA", kid }       kid = identifiant de la clé (rotation)
//   contenu : { sub, jti, iat, exp }      sub = joueur, jti = identifiant unique
//
// Garde-fous côté vérification : clé connue (kid), signature, expiration avec
// 30 s de tolérance d'horloge, et un ticket ne sert qu'une fois (jti).
//
// Réservé au serveur (node:crypto) : n'est pas exporté par l'index du paquet.

export const TICKET_TTL_S = 120;
export const CLOCK_SKEW_S = 30;

export type TicketClaims = { sub: string; jti: string; iat: number; exp: number };

const b64 = (data: Buffer | string) => Buffer.from(data).toString("base64url");
const json = (part: string) => JSON.parse(Buffer.from(part, "base64url").toString("utf8")) as unknown;

/** Clé depuis une variable d'environnement : PEM, ou PEM encodé en base64 (une seule ligne). */
function pem(value: string): string {
  return value.includes("-----BEGIN") ? value : Buffer.from(value, "base64").toString("utf8");
}

export function privateKeyFrom(value: string): KeyObject {
  return createPrivateKey(pem(value));
}

/** « kid1:clé1,kid2:clé2 » → table des clés publiques acceptées (deux pendant une rotation). */
export function publicKeysFrom(value: string): Map<string, KeyObject> {
  const keys = new Map<string, KeyObject>();
  for (const entry of value.split(",").map((s) => s.trim()).filter(Boolean)) {
    const at = entry.indexOf(":");
    if (at <= 0) throw new Error("Clé publique de ticket mal formée : attendu kid:clé");
    keys.set(entry.slice(0, at), createPublicKey(pem(entry.slice(at + 1))));
  }
  return keys;
}

export function signTicket(userId: string, key: KeyObject, kid: string, now = Date.now()): string {
  const iat = Math.floor(now / 1000);
  const header = b64(JSON.stringify({ alg: "EdDSA", kid }));
  const body = b64(JSON.stringify({ sub: userId, jti: randomUUID(), iat, exp: iat + TICKET_TTL_S } satisfies TicketClaims));
  const signature = sign(null, Buffer.from(`${header}.${body}`), key);
  return `${header}.${body}.${b64(signature)}`;
}

export type TicketCheck = { ok: true; claims: TicketClaims } | { ok: false; reason: string };

/** Vérifie la forme, la clé, la signature et les dates. Ne gère pas le rejeu (voir ReplayGuard). */
export function verifyTicket(ticket: unknown, keys: Map<string, KeyObject>, now = Date.now()): TicketCheck {
  if (typeof ticket !== "string" || ticket.length > 2048) return { ok: false, reason: "ticket absent" };
  const parts = ticket.split(".");
  if (parts.length !== 3) return { ok: false, reason: "ticket mal formé" };
  let header: { alg?: unknown; kid?: unknown };
  let claims: Partial<TicketClaims>;
  try {
    header = json(parts[0]) as typeof header;
    claims = json(parts[1]) as typeof claims;
  } catch {
    return { ok: false, reason: "ticket illisible" };
  }
  if (header.alg !== "EdDSA" || typeof header.kid !== "string") return { ok: false, reason: "algorithme refusé" };
  const key = keys.get(header.kid);
  if (!key) return { ok: false, reason: "clé inconnue" };
  const valid = verify(null, Buffer.from(`${parts[0]}.${parts[1]}`), key, Buffer.from(parts[2], "base64url"));
  if (!valid) return { ok: false, reason: "signature invalide" };
  const t = Math.floor(now / 1000);
  if (typeof claims.sub !== "string" || typeof claims.jti !== "string" || typeof claims.exp !== "number" || typeof claims.iat !== "number") {
    return { ok: false, reason: "contenu incomplet" };
  }
  if (claims.exp + CLOCK_SKEW_S < t) return { ok: false, reason: "ticket expiré" };
  if (claims.iat - CLOCK_SKEW_S > t) return { ok: false, reason: "ticket daté du futur" };
  return { ok: true, claims: claims as TicketClaims };
}

/** Mémoire des tickets déjà utilisés, le temps de leur validité. */
export class ReplayGuard {
  private seen = new Map<string, number>();

  /** Renvoie false si ce ticket a déjà servi. */
  use(claims: TicketClaims, now = Date.now()): boolean {
    this.prune(now);
    if (this.seen.has(claims.jti)) return false;
    this.seen.set(claims.jti, (claims.exp + CLOCK_SKEW_S) * 1000);
    return true;
  }

  prune(now = Date.now()) {
    for (const [jti, until] of this.seen) if (until < now) this.seen.delete(jti);
  }
}
