import { sql } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";

// Routes de sauvegarde et de classement, de bout en bout : vrais comptes
// (inscription + lien de vérification), base Postgres PGlite en mémoire.

process.env.PGLITE_DIR = "memory://";
process.env.BETTER_AUTH_SECRET = "secret-de-test-assez-long-pour-better-auth-0123456789";
process.env.CRON_SECRET = "cron-test";

const BASE = "http://localhost:3107";
const mails: string[] = [];

const { getAuth } = await import("./auth");
const { getDb, rows } = await import("./db");
const save = await import("../app/api/save/route");
const board = await import("../app/api/leaderboard/route");
const purge = await import("../app/api/cron/purge/route");

const headers = (cookie?: string) => ({
  "content-type": "application/json",
  origin: BASE,
  "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 200)}`,
  ...(cookie ? { cookie } : {}),
});

/** Crée un compte vérifié et renvoie ses cookies de session. */
async function player(pseudo: string): Promise<string> {
  const auth = await getAuth();
  const email = `${pseudo.toLowerCase()}@example.com`;
  await auth.handler(
    new Request(`${BASE}/api/auth/sign-up/email`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ email, password: "un mot de passe long", name: pseudo, pseudo }),
    }),
  );
  const link = mails.at(-1)!.match(/https?:\/\/\S+/)![0];
  const res = await auth.handler(new Request(link, { headers: headers() }));
  return res.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
}

const put = (cookie: string, body: unknown, withOrigin = true) => {
  const h: Record<string, string> = headers(cookie);
  if (!withOrigin) delete h.origin;
  return save.PUT(new Request(`${BASE}/api/save`, { method: "PUT", headers: h, body: JSON.stringify(body) }));
};

const levels = (entries: Record<string, number>) => ({
  progress: {
    levels: Object.fromEntries(Object.entries(entries).map(([id, xp]) => [id, { status: "passed", bestXp: xp, modes: ["classic"] }])),
    xpByTree: {},
  },
});

let ada = "";
let bob = "";

beforeAll(async () => {
  vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
    const line = args.join(" ");
    if (line.includes("e-mail (développement)")) mails.push(line);
  });
  ada = await player("Ada");
  bob = await player("Bob");
}, 60_000);

describe("sauvegarde en ligne", () => {
  it("refuse sans session, et sans origine du site", async () => {
    expect((await save.GET(new Request(`${BASE}/api/save`))).status).toBe(401);
    expect((await put(ada, levels({ fs_nav_01: 100 }), false)).status).toBe(403);
  });

  it("enregistre, plafonne la triche et met à jour le classement", async () => {
    const res = await put(ada, levels({ fs_nav_01: 999_999, fs_read_01: 140 }));
    expect(res.status).toBe(200);
    const { data } = await res.json();
    expect(data.progress.levels.fs_nav_01.bestXp).toBe(312);
    expect(data.progress.xpByTree).toEqual({ file_system_ninja: 452 });

    const got = await (await save.GET(new Request(`${BASE}/api/save`, { headers: headers(ada) }))).json();
    expect(got.data.progress.levels.fs_read_01.bestXp).toBe(140);
  });

  it("fusionne au lieu d'écraser (un appareil en retard ne fait rien perdre)", async () => {
    const res = await put(ada, levels({ fs_nav_01: 10 }));
    const { data } = await res.json();
    expect(data.progress.levels.fs_nav_01.bestXp).toBe(312);
    expect(data.progress.levels.fs_read_01.bestXp).toBe(140);
  });

  it("refuse une sauvegarde mal formée", async () => {
    expect((await put(ada, { progress: { levels: { fs_nav_01: { status: "hacké", bestXp: -5 } } } })).status).toBe(400);
  });
});

describe("classement", () => {
  it("classe par XP ou par niveaux, et donne le rang du joueur", async () => {
    await put(bob, levels({ fs_nav_01: 120, fs_read_01: 140, grep_01: 400 }));
    const byXp = await (await board.GET(new Request(`${BASE}/api/leaderboard`))).json();
    expect(byXp.rows.map((r: { pseudo: string }) => r.pseudo)).toEqual(["Bob", "Ada"]);
    expect(byXp.total).toBe(2);

    const me = await (await board.GET(new Request(`${BASE}/api/leaderboard?me=1`, { headers: headers(ada) }))).json();
    expect(me.me).toMatchObject({ rank: 2, pseudo: "Ada" });

    const sk = await (await board.GET(new Request(`${BASE}/api/leaderboard?sort=levels&tier=sysadmin`))).json();
    expect(sk.rows).toEqual([]);
  });

  it("un compte masqué disparaît du classement", async () => {
    const db = await getDb();
    await db.execute(sql`UPDATE "user" SET hidden = true WHERE pseudo = 'Bob'`);
    const res = await (await board.GET(new Request(`${BASE}/api/leaderboard`))).json();
    expect(res.rows.map((r: { pseudo: string }) => r.pseudo)).toEqual(["Ada"]);
  });
});

describe("ménage quotidien", () => {
  it("exige le secret, puis supprime les comptes jamais vérifiés depuis 30 jours", async () => {
    expect((await purge.GET(new Request(`${BASE}/api/cron/purge`))).status).toBe(401);
    const db = await getDb();
    await db.execute(sql`INSERT INTO "user" (id, name, email, pseudo, created_at) VALUES ('vieux', 'v', 'v@example.com', 'vieux', now() - interval '31 days')`);
    const res = await purge.GET(new Request(`${BASE}/api/cron/purge`, { headers: { authorization: "Bearer cron-test" } }));
    expect((await res.json()).unverifiedUsers).toBe(1);
    expect(rows(await db.execute(sql`SELECT id FROM "user" WHERE id = 'vieux'`))).toEqual([]);
  });
});
