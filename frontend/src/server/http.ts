import { sql } from "drizzle-orm";
import { authUrl } from "@/lib/site-url";
import { getAuth } from "./auth";
import { rows, type Db } from "./db";

// Outils communs aux routes API du jeu : joueur connecté, contrôle d'origine,
// limitation de débit, réponses d'erreur homogènes.

export type SessionUser = { id: string; email: string; emailVerified: boolean; pseudo: string; hidden: boolean };

export async function currentUser(request: Request): Promise<SessionUser | null> {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: request.headers });
  return (session?.user as SessionUser | undefined) ?? null;
}

/** Les écritures ne viennent que de notre propre site (défense contre le CSRF). */
export function sameOrigin(request: Request): boolean {
  const base = new URL(authUrl()).origin;
  return request.headers.get("origin") === base;
}

/**
 * Limitation de débit en base, par fenêtre fixe : `max` requêtes par `windowS`
 * secondes pour une clé. Renvoie false si la limite est dépassée.
 */
export async function allow(db: Db, key: string, max: number, windowS: number): Promise<boolean> {
  const now = Date.now();
  const windowStart = now - windowS * 1000;
  const result = await db.execute(sql`
    INSERT INTO rate_limit (id, key, count, last_request) VALUES (${`app:${key}`}, ${`app:${key}`}, 1, ${now})
    ON CONFLICT (key) DO UPDATE SET
      count = CASE WHEN rate_limit.last_request < ${windowStart} THEN 1 ELSE rate_limit.count + 1 END,
      last_request = CASE WHEN rate_limit.last_request < ${windowStart} THEN ${now} ELSE rate_limit.last_request END
    RETURNING count`);
  return Number(rows<{ count: number }>(result)[0]?.count ?? 0) <= max;
}

export const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store", ...headers } });

export const failure = (status: number, message: string) => json({ message }, status);

/** Adresse du client (Vercel place la vraie en tête de x-forwarded-for). */
export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
}

/**
 * Administrateur du site : le compte dont l'adresse, confirmée, est
 * ADMIN_EMAIL. Sans cette variable, personne ne l'est.
 */
export function isAdmin(user: SessionUser | null): boolean {
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(admin && user?.emailVerified && user.email.toLowerCase() === admin);
}
