import { sql } from "drizzle-orm";
import { getDb, rows } from "@/server/db";
import { currentUser, failure } from "@/server/http";
import { errorFields, log } from "@/server/log";

// Export des données du joueur (droit d'accès et de portabilité) : un
// fichier JSON avec le compte, les moyens de connexion, la sauvegarde et la
// ligne de classement. Jamais d'empreinte de mot de passe ni de jeton.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await currentUser(request);
    if (!user) return failure(401, "Connecte-toi pour exporter tes données.");
    const db = await getDb();
    const account = rows(
      await db.execute(sql`SELECT id, email, email_verified, pseudo, created_at, updated_at FROM "user" WHERE id = ${user.id}`),
    )[0];
    const logins = rows(await db.execute(sql`SELECT provider_id, created_at FROM account WHERE user_id = ${user.id}`));
    const sessions = rows(
      await db.execute(sql`SELECT created_at, expires_at, ip_address, user_agent FROM session WHERE user_id = ${user.id}`),
    );
    const save = rows(await db.execute(sql`SELECT data, revision, updated_at FROM saves WHERE user_id = ${user.id}`))[0] ?? null;
    const score = rows(await db.execute(sql`SELECT xp, levels_passed, tier_rank, updated_at FROM scores WHERE user_id = ${user.id}`))[0] ?? null;
    const body = JSON.stringify({ exportedAt: new Date().toISOString(), account, logins, sessions, save, score }, null, 2);
    return new Response(body, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": 'attachment; filename="terminal-arcade-mes-donnees.json"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    log("error", "export.failed", errorFields(error));
    return failure(503, "Export momentanément indisponible.");
  }
}
