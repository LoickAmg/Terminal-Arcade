import { sql } from "drizzle-orm";
import { z } from "zod";
import { isPetConfig } from "@/lib/pet";
import { isSettings } from "@/lib/themes";
import { getDb, rows } from "@/server/db";
import { allow, currentUser, failure, json, sameOrigin } from "@/server/http";
import { errorFields, log } from "@/server/log";
import { EMPTY, merge, progressSchema, sanitize, score, type Progress } from "@/server/progress";

// Sauvegarde en ligne du joueur connecté.
//   GET : la sauvegarde du serveur (ou null).
//   PUT : fusionne la sauvegarde envoyée avec celle du serveur, met à jour le
//         classement, et renvoie le résultat. Rejouer la même requête ne
//         change rien (idempotent) : la fusion garde le meilleur.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 64 * 1024;

const bodySchema = z.object({
  progress: progressSchema,
  pet: z.unknown().optional(),
  settings: z.unknown().optional(),
});

type Save = { progress: Progress; pet: unknown; settings: unknown };

export async function GET(request: Request) {
  try {
    const user = await currentUser(request);
    if (!user) return failure(401, "Connecte-toi pour retrouver ta sauvegarde.");
    const db = await getDb();
    const found = rows<{ data: Save }>(await db.execute(sql`SELECT data FROM saves WHERE user_id = ${user.id}`))[0];
    return json({ data: found?.data ?? null });
  } catch (error) {
    log("error", "save.get_failed", errorFields(error));
    return failure(503, "Sauvegarde momentanément indisponible.");
  }
}

export async function PUT(request: Request) {
  if (!sameOrigin(request)) return failure(403, "Origine refusée.");
  try {
    const user = await currentUser(request);
    if (!user) return failure(401, "Connecte-toi pour sauvegarder en ligne.");
    const text = await request.text();
    if (text.length > MAX_BODY) return failure(413, "Sauvegarde trop volumineuse.");
    let parsed;
    try {
      parsed = bodySchema.safeParse(JSON.parse(text));
    } catch {
      return failure(400, "Sauvegarde illisible.");
    }
    if (!parsed.success) return failure(400, "Sauvegarde invalide.");

    const db = await getDb();
    if (!(await allow(db, `save:${user.id}`, 30, 60))) return failure(429, "Trop de sauvegardes d'un coup, réessaie dans une minute.");

    const saved = await db.transaction(async (tx) => {
      // Verrou sur la ligne : deux appareils qui sauvegardent en même temps
      // ne s'écrasent pas, leurs progressions se fusionnent.
      const existing = rows<{ data: Save }>(
        await tx.execute(sql`SELECT data FROM saves WHERE user_id = ${user.id} FOR UPDATE`),
      )[0]?.data;
      const progress = merge(existing ? sanitize(existing.progress) : EMPTY, parsed.data.progress);
      const data: Save = {
        progress,
        pet: isPetConfig(parsed.data.pet) ? parsed.data.pet : (existing?.pet ?? null),
        settings: isSettings(parsed.data.settings) ? parsed.data.settings : (existing?.settings ?? null),
      };
      await tx.execute(sql`
        INSERT INTO saves (user_id, data) VALUES (${user.id}, ${JSON.stringify(data)}::jsonb)
        ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, revision = saves.revision + 1, updated_at = now()`);
      // Seuls les comptes vérifiés entrent au classement.
      if (user.emailVerified) {
        const s = score(progress);
        await tx.execute(sql`
          INSERT INTO scores (user_id, xp, levels_passed, tier_rank) VALUES (${user.id}, ${s.xp}, ${s.levelsPassed}, ${s.tierRank})
          ON CONFLICT (user_id) DO UPDATE SET
            xp = EXCLUDED.xp, levels_passed = EXCLUDED.levels_passed, tier_rank = EXCLUDED.tier_rank,
            -- La date ne bouge que si le score progresse : elle départage les ex æquo.
            updated_at = CASE WHEN scores.xp <> EXCLUDED.xp OR scores.levels_passed <> EXCLUDED.levels_passed THEN now() ELSE scores.updated_at END`);
      }
      return data;
    });
    return json({ data: saved });
  } catch (error) {
    log("error", "save.put_failed", errorFields(error));
    return failure(503, "Sauvegarde momentanément indisponible.");
  }
}
