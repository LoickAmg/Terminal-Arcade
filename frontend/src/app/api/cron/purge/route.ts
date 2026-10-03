import { sql } from "drizzle-orm";
import { getDb, rows } from "@/server/db";
import { failure, json } from "@/server/http";
import { errorFields, log } from "@/server/log";

// Ménage quotidien, lancé par Vercel Cron (vercel.json), qui envoie
// « Authorization: Bearer <CRON_SECRET> » :
// - comptes jamais vérifiés après 30 jours (et tout ce qui en dépend) ;
// - sessions et jetons de vérification expirés ;
// - compteurs de limitation de débit inactifs depuis un jour.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return failure(401, "Non autorisé.");
  try {
    const db = await getDb();
    const count = async (q: ReturnType<typeof sql>) => rows(await db.execute(q)).length;
    const result = {
      unverifiedUsers: await count(sql`DELETE FROM "user" WHERE NOT email_verified AND created_at < now() - interval '30 days' RETURNING id`),
      sessions: await count(sql`DELETE FROM session WHERE expires_at < now() RETURNING id`),
      verifications: await count(sql`DELETE FROM verification WHERE expires_at < now() RETURNING id`),
      rateLimits: await count(sql`DELETE FROM rate_limit WHERE last_request < ${Date.now() - 24 * 60 * 60 * 1000} RETURNING id`),
    };
    log("info", "purge.done", result);
    return json(result);
  } catch (error) {
    log("error", "purge.failed", errorFields(error));
    return failure(503, "Ménage impossible pour le moment.");
  }
}
