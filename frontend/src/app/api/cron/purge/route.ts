import { sql } from "drizzle-orm";
import { getDb, rows } from "@/server/db";
import { failure, json } from "@/server/http";
import { emailVerificationOn } from "@/lib/accounts-mode";
import { errorFields, log } from "@/server/log";

// Ménage quotidien, lancé par Vercel Cron (vercel.json), qui envoie
// « Authorization: Bearer <CRON_SECRET> » :
// - comptes jamais vérifiés après 30 jours, sans aucune sauvegarde (et tout
//   ce qui en dépend). En mode normal, un compte non vérifié ne peut pas se
//   connecter, donc n'a jamais de sauvegarde ; la condition protège les
//   comptes créés en mode provisoire (accounts-mode.ts), qui ont joué.
//   En mode provisoire, aucun compte n'est purgé ;
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
      unverifiedUsers: emailVerificationOn()
        ? await count(sql`
            DELETE FROM "user" u
            WHERE NOT u.email_verified AND u.created_at < now() - interval '30 days'
              AND NOT EXISTS (SELECT 1 FROM saves s WHERE s.user_id = u.id)
            RETURNING u.id`)
        : 0,
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
