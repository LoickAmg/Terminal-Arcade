import { sql } from "drizzle-orm";
import { getDb } from "@/server/db";
import { errorFields, log } from "@/server/log";

// Contrôle de santé, interrogé par la surveillance (UptimeRobot) : 200 si la
// base répond en moins de 3 s, 503 sinon. Ne révèle aucune configuration.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();
  try {
    const db = await getDb();
    await Promise.race([
      db.execute(sql`SELECT 1`),
      new Promise((_, reject) => setTimeout(() => reject(new Error("délai dépassé")), 3000)),
    ]);
    return Response.json(
      { status: "ok", db: "ok", ms: Date.now() - started },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    log("error", "health.failed", errorFields(error));
    return Response.json({ status: "down", db: "down" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
