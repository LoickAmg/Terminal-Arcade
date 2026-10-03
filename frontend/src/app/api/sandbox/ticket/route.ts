import { privateKeyFrom, signTicket } from "@terminal-arcade/shared/ticket";
import { getDb } from "@/server/db";
import { allow, currentUser, failure, json, sameOrigin } from "@/server/http";
import { errorFields, log } from "@/server/log";

// Ticket d'accès à la sandbox (2 minutes, usage unique), pour un joueur
// connecté dont l'adresse est confirmée. Le navigateur le remet au serveur de
// la sandbox, qui le vérifie avec la clé publique.
//
// En développement sans clé configurée : { ticket: null }, la sandbox locale
// n'en demande pas. En production sans clé : 503 (panne = bloque tout).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return failure(403, "Origine refusée.");
  const keyValue = process.env.SANDBOX_TICKET_PRIVATE_KEY;
  const kid = process.env.SANDBOX_TICKET_KID ?? "k1";
  try {
    const user = await currentUser(request);
    if (!user) return failure(401, "Connecte-toi pour jouer aux niveaux « vrai Linux ».");
    if (!user.emailVerified) return failure(403, "Confirme ton adresse pour jouer aux niveaux « vrai Linux ».");
    if (!keyValue) {
      if (process.env.NODE_ENV === "production") {
        log("error", "ticket.unconfigured");
        return failure(503, "La sandbox n'est pas encore ouverte.");
      }
      return json({ ticket: null });
    }
    const db = await getDb();
    if (!(await allow(db, `ticket:${user.id}`, 20, 60))) return failure(429, "Trop de parties lancées d'un coup, attends un instant.");
    return json({ ticket: signTicket(user.id, privateKeyFrom(keyValue), kid) });
  } catch (error) {
    log("error", "ticket.failed", errorFields(error));
    return failure(503, "Sandbox momentanément indisponible.");
  }
}
