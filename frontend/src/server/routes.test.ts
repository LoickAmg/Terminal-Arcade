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
const feedback = await import("../app/api/feedback/route");
const adminFeedback = await import("../app/api/admin/feedback/route");

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

describe("mode provisoire et retour au mode normal", () => {
  it("un compte non vérifié qui a joué entre au classement, et survit au ménage", async () => {
    const db = await getDb();
    await db.execute(sql`INSERT INTO "user" (id, name, email, pseudo, created_at) VALUES ('provi', 'p', 'p@example.com', 'Provi', now() - interval '40 days')`);
    await db.execute(sql`INSERT INTO saves (user_id, data) VALUES ('provi', '{}'::jsonb)`);
    await db.execute(sql`INSERT INTO scores (user_id, xp, levels_passed, tier_rank) VALUES ('provi', 999, 3, 1)`);

    const pseudos = async () =>
      ((await (await board.GET(new Request(`${BASE}/api/leaderboard`))).json()).rows as { pseudo: string }[]).map((r) => r.pseudo);
    const cron = () => purge.GET(new Request(`${BASE}/api/cron/purge`, { headers: { authorization: "Bearer cron-test" } }));

    process.env.NEXT_PUBLIC_EMAIL_VERIFICATION = "off";
    try {
      expect(await pseudos()).toContain("Provi");
      expect((await (await cron()).json()).unverifiedUsers).toBe(0);
    } finally {
      delete process.env.NEXT_PUBLIC_EMAIL_VERIFICATION;
    }

    // Vérification réactivée : hors du classement jusqu'à confirmation, mais
    // pas supprimé (il a une sauvegarde).
    expect(await pseudos()).not.toContain("Provi");
    await cron();
    expect(rows(await db.execute(sql`SELECT id FROM "user" WHERE id = 'provi'`))).toHaveLength(1);
  });
});

describe("retours des joueurs", () => {
  const send = (body: unknown, opts: { cookie?: string; ip?: string; origin?: boolean } = {}) => {
    const h: Record<string, string> = { ...headers(opts.cookie), "x-forwarded-for": opts.ip ?? "192.0.2.10" };
    if (opts.origin === false) delete h.origin;
    return feedback.POST(new Request(`${BASE}/api/feedback`, { method: "POST", headers: h, body: JSON.stringify(body) }));
  };
  const all = async () =>
    rows<{ id: string; user_id: string | null; contact: string | null; kind: string; status: string }>(
      await (await getDb()).execute(sql`SELECT id, user_id, contact, kind, status FROM feedback ORDER BY created_at`),
    );

  it("enregistre un retour anonyme, avec l'adresse pour répondre, et prévient l'éditeur", async () => {
    process.env.FEEDBACK_EMAIL = "editeur@example.com";
    const before = mails.length;
    const res = await send({ kind: "niveau", message: "La question 3 de fs_nav_01 n'est pas claire.", levelId: "fs_nav_01", contact: "joueur@example.com", context: { screen: "1900x870" } });
    expect(res.status).toBe(200);
    const [row] = await all();
    expect(row).toMatchObject({ user_id: null, contact: "joueur@example.com", kind: "niveau", status: "nouveau" });
    await new Promise((r) => setTimeout(r, 50));
    expect(mails.slice(before).join(" ")).toContain("Nouveau retour : Niveau à revoir");
    delete process.env.FEEDBACK_EMAIL;
  });

  it("refuse une autre origine et un message trop court, et ignore les robots", async () => {
    expect((await send({ kind: "bug", message: "Un vrai message de test." }, { origin: false })).status).toBe(403);
    expect((await send({ kind: "bug", message: "court" })).status).toBe(400);
    const n = (await all()).length;
    expect((await send({ kind: "bug", message: "Achetez nos produits miracles !", website: "spam.example" })).status).toBe(200);
    expect(await all()).toHaveLength(n);
  });

  it("rattache le retour au compte connecté, sans adresse de contact", async () => {
    const res = await send({ kind: "idee", message: "Un mode deux joueurs serait génial.", contact: "autre@example.com" }, { cookie: ada });
    expect(res.status).toBe(200);
    const row = (await all()).find((r) => r.kind === "idee")!;
    expect(row.user_id).not.toBeNull();
    expect(row.contact).toBeNull();
  });

  it("limite à 5 retours par heure et par adresse", async () => {
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await send({ kind: "autre", message: `Retour numéro ${i} pour tester.` }, { ip: "198.51.100.77" })).status);
    expect(statuses.slice(0, 5).every((s) => s === 200)).toBe(true);
    expect(statuses[5]).toBe(429);
  });

  it("seul l'administrateur change le statut ou supprime", async () => {
    const [first] = await all();
    const patch = (body: unknown, cookie: string) =>
      adminFeedback.PATCH(new Request(`${BASE}/api/admin/feedback`, { method: "PATCH", headers: headers(cookie), body: JSON.stringify(body) }));
    expect((await patch({ id: first.id, status: "traite" }, ada)).status).toBe(404);
    process.env.ADMIN_EMAIL = "ada@example.com";
    try {
      expect((await patch({ id: first.id, status: "traite" }, ada)).status).toBe(200);
      expect((await all())[0].status).toBe("traite");
      expect((await patch({ id: first.id, remove: true }, ada)).status).toBe(200);
      expect((await all()).some((r) => r.id === first.id)).toBe(false);
    } finally {
      delete process.env.ADMIN_EMAIL;
    }
  });
});
