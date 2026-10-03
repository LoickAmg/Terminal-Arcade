import { sql } from "drizzle-orm";
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
  const base = new URL(process.env.BETTER_AUTH_URL ?? "http://localhost:3107").origin;
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
