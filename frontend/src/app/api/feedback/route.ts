import { sql } from "drizzle-orm";
import { after } from "next/server";
import { z } from "zod";
import { FEEDBACK_KINDS as KINDS, FEEDBACK_MAX, FEEDBACK_MIN } from "@/lib/feedback";
import { getDb } from "@/server/db";
import { emailConfigured, layout, sendEmail } from "@/server/email";
import { allow, clientIp, currentUser, failure, json, sameOrigin } from "@/server/http";
import { errorFields, log } from "@/server/log";

// Retours des joueurs : bug, idée, niveau à revoir. Ouvert à tous, connecté
// ou non. Chaque retour est enregistré (page /admin/retours) et, si
// FEEDBACK_EMAIL est défini, envoyé par e-mail à l'éditeur.
// Protections : même origine, taille bornée, champ piège pour les robots,
// 5 retours par heure et par joueur (ou par adresse IP).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 8 * 1024;

const bodySchema = z.object({
  kind: z.enum(["bug", "idee", "niveau", "autre"]),
  message: z.string().trim().min(FEEDBACK_MIN).max(FEEDBACK_MAX),
  levelId: z
    .string()
    .regex(/^[a-z0-9_]{1,40}$/)
    .optional(),
  contact: z.email().max(200).optional(),
  // Champ invisible : seul un robot le remplit.
  website: z.string().max(200).optional(),
  context: z
    .object({
      view: z.string().max(40).optional(),
      screen: z.string().max(20).optional(),
      theme: z.string().max(40).optional(),
    })
    .optional(),
});

/** Lance une tâche après la réponse (hors requête, dans les tests : tout de suite). */
function later(task: () => Promise<void>) {
  try {
    after(task);
  } catch {
    void task();
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return failure(403, "Origine refusée.");
  try {
    const text = await request.text();
    if (text.length > MAX_BODY) return failure(413, "Message trop long.");
    let parsed;
    try {
      parsed = bodySchema.safeParse(JSON.parse(text));
    } catch {
      return failure(400, "Retour illisible.");
    }
    if (!parsed.success) return failure(400, "Retour invalide : 10 à 2000 caractères, et une adresse e-mail valide si tu en donnes une.");
    const data = parsed.data;
    // Robot : on fait comme si tout s'était bien passé.
    if (data.website) return json({ ok: true });

    const user = await currentUser(request);
    const db = await getDb();
    if (!(await allow(db, `feedback:${user?.id ?? clientIp(request)}`, 5, 60 * 60))) {
      return failure(429, "Merci ! Tu as déjà envoyé plusieurs retours : réessaie dans une heure.");
    }

    const id = crypto.randomUUID();
    const contact = user ? null : (data.contact ?? null);
    const context = {
      ...data.context,
      userAgent: (request.headers.get("user-agent") ?? "").slice(0, 200),
    };
    await db.execute(sql`
      INSERT INTO feedback (id, user_id, kind, message, level_id, contact, context)
      VALUES (${id}, ${user?.id ?? null}, ${data.kind}, ${data.message}, ${data.levelId ?? null}, ${contact}, ${JSON.stringify(context)}::jsonb)`);
    log("info", "feedback.received", { kind: data.kind, signedIn: Boolean(user) });

    const to = process.env.FEEDBACK_EMAIL?.trim();
    // En développement, sans service d'e-mail, la notification s'écrit dans la console.
    if (to && (emailConfigured() || process.env.NODE_ENV !== "production")) {
      const who = user ? `${user.pseudo} (${user.email})` : contact ? `anonyme, répondre à ${contact}` : "anonyme";
      later(async () => {
        try {
          await sendEmail({
            to,
            subject: `Terminal Arcade : retour « ${KINDS[data.kind]} »`,
            ...layout(`Nouveau retour : ${KINDS[data.kind]}`, [
              `De : ${who}`,
              ...(data.levelId ? [`Niveau : ${data.levelId}`] : []),
              data.message,
              `Écran ${context.screen ?? "?"} · thème ${context.theme ?? "?"} · vue ${context.view ?? "?"}`,
            ]),
          });
        } catch (error) {
          log("error", "feedback.email_failed", errorFields(error));
        }
      });
    }
    return json({ ok: true });
  } catch (error) {
    log("error", "feedback.failed", errorFields(error));
    return failure(503, "Impossible d'enregistrer ton retour pour le moment.");
  }
}
