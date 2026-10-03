import { sql } from "drizzle-orm";
import { getDb, rows } from "@/server/db";
import { currentUser, failure, json } from "@/server/http";
import { errorFields, log } from "@/server/log";

// Classement de tous les joueurs vérifiés, 20 par page.
//   ?sort=xp (défaut) ou levels : par XP, ou par nombre de niveaux hackés
//   ?tier=script_kiddie|sysadmin|root_wizard : seulement les joueurs dont
//         c'est le plus haut palier atteint
//   ?page=1…
//   ?me=1 : ajoute le rang du joueur connecté (réponse non mise en cache)
// Ex æquo : départagés par l'ancienneté du score (premier arrivé, premier classé).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;
const TIERS: Record<string, number> = { script_kiddie: 1, sysadmin: 2, root_wizard: 3 };

type Row = { pseudo: string; xp: number; levels_passed: number; tier_rank: number };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sort = url.searchParams.get("sort") === "levels" ? "levels" : "xp";
  const tier = TIERS[url.searchParams.get("tier") ?? ""] ?? 0;
  const page = Math.min(500, Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1));
  const withMe = url.searchParams.get("me") === "1";

  const order =
    sort === "levels"
      ? sql`s.levels_passed DESC, s.xp DESC, s.updated_at ASC`
      : sql`s.xp DESC, s.levels_passed DESC, s.updated_at ASC`;
  const where = sql`u.email_verified AND NOT u.hidden ${tier ? sql`AND s.tier_rank = ${tier}` : sql``}`;

  try {
    const db = await getDb();
    const list = rows<Row>(
      await db.execute(sql`
        SELECT u.pseudo, s.xp, s.levels_passed, s.tier_rank
        FROM scores s JOIN "user" u ON u.id = s.user_id
        WHERE ${where}
        ORDER BY ${order}
        LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`),
    );
    const total = Number(
      rows<{ n: number }>(
        await db.execute(sql`SELECT count(*)::int AS n FROM scores s JOIN "user" u ON u.id = s.user_id WHERE ${where}`),
      )[0]?.n ?? 0,
    );

    let me: { rank: number; pseudo: string; xp: number; levelsPassed: number } | null = null;
    if (withMe) {
      const user = await currentUser(request);
      if (user) {
        const mine = rows<Row & { updated_at: string }>(
          await db.execute(sql`
            SELECT u.pseudo, s.xp, s.levels_passed, s.tier_rank, s.updated_at
            FROM scores s JOIN "user" u ON u.id = s.user_id
            WHERE s.user_id = ${user.id} AND ${where}`),
        )[0];
        if (mine) {
          // Rang = 1 + nombre de joueurs strictement devant, avec le même ordre.
          const ahead =
            sort === "levels"
              ? sql`(s.levels_passed > ${mine.levels_passed} OR (s.levels_passed = ${mine.levels_passed} AND (s.xp > ${mine.xp} OR (s.xp = ${mine.xp} AND s.updated_at < ${mine.updated_at}))))`
              : sql`(s.xp > ${mine.xp} OR (s.xp = ${mine.xp} AND (s.levels_passed > ${mine.levels_passed} OR (s.levels_passed = ${mine.levels_passed} AND s.updated_at < ${mine.updated_at}))))`;
          const n = Number(
            rows<{ n: number }>(
              await db.execute(sql`SELECT count(*)::int AS n FROM scores s JOIN "user" u ON u.id = s.user_id WHERE ${where} AND ${ahead}`),
            )[0]?.n ?? 0,
          );
          me = { rank: n + 1, pseudo: mine.pseudo, xp: mine.xp, levelsPassed: mine.levels_passed };
        }
      }
    }

    const body = {
      sort,
      page,
      pageSize: PAGE_SIZE,
      total,
      rows: list.map((r, i) => ({
        rank: (page - 1) * PAGE_SIZE + i + 1,
        pseudo: r.pseudo,
        xp: r.xp,
        levelsPassed: r.levels_passed,
        tier: r.tier_rank,
      })),
      me,
    };
    // Sans données personnelles, la page est mise en cache une minute par le CDN.
    return withMe
      ? json(body)
      : json(body, 200, { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" });
  } catch (error) {
    log("error", "leaderboard.failed", errorFields(error));
    return failure(503, "Classement momentanément indisponible.");
  }
}
