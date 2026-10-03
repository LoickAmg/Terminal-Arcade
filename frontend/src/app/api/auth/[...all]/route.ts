import { getAuth } from "@/server/auth";
import { errorFields, log } from "@/server/log";

// Toutes les routes de Better Auth : /api/auth/sign-up/email,
// /api/auth/sign-in/email, /api/auth/sign-in/social, /api/auth/get-session…
// Panne = bloque tout : si la base ou la configuration manque, on répond 503
// au lieu de laisser passer quoi que ce soit.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handle(request: Request): Promise<Response> {
  let auth;
  try {
    auth = await getAuth();
  } catch (error) {
    log("error", "auth.unavailable", errorFields(error));
    return Response.json({ message: "Les comptes sont momentanément indisponibles." }, { status: 503 });
  }
  return auth.handler(request);
}

export { handle as GET, handle as POST };
