import { sql } from "drizzle-orm";
import { z } from "zod";
import { getDb, rows } from "@/server/db";
import { currentUser, failure, isAdmin, json, sameOrigin } from "@/server/http";
import { errorFields, log } from "@/server/log";

// Administration des retours (page /admin/retours) : changer le statut d'un
// retour (nouveau, lu, traité) ou le supprimer. Réservé à ADMIN_EMAIL ;
// pour tout autre visiteur, la route n'existe pas (404).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  id: z.uuid(),
  status: z.enum(["nouveau", "lu", "traite"]).optional(),
  remove: z.literal(true).optional(),
});

export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return failure(403, "Origine refusée.");
  try {
    const user = await currentUser(request);
    if (!isAdmin(user)) return failure(404, "Introuvable.");
    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success || (!parsed.data.status && !parsed.data.remove)) return failure(400, "Demande invalide.");
    const { id, status, remove } = parsed.data;
    const db = await getDb();
    const changed = remove
      ? rows(await db.execute(sql`DELETE FROM feedback WHERE id = ${id} RETURNING id`))
      : rows(await db.execute(sql`UPDATE feedback SET status = ${status!} WHERE id = ${id} RETURNING id`));
    if (changed.length === 0) return failure(404, "Retour introuvable.");
    log("info", remove ? "feedback.removed" : "feedback.status", { status: status ?? null });
    return json({ ok: true });
  } catch (error) {
    log("error", "feedback.admin_failed", errorFields(error));
    return failure(503, "Action impossible pour le moment.");
  }
}
