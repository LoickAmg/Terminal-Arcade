import { sql } from "drizzle-orm";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { createAuth, type Auth } from "./auth";
import { openMemoryDb, rows, type Db } from "./db";

// Parcours complet d'un compte, sur une vraie base Postgres (PGlite) en
// mémoire : inscription, vérification, connexion, doublons, effacement.

const BASE = "http://localhost:3107";
let db: Db;
let auth: Auth;
let mails: string[] = [];

function req(path: string, body?: unknown, init: { cookie?: string; ip?: string; method?: string } = {}) {
  return auth.handler(
    new Request(`${BASE}/api/auth${path}`, {
      method: init.method ?? (body === undefined ? "GET" : "POST"),
      headers: {
        "content-type": "application/json",
        origin: BASE,
        "x-forwarded-for": init.ip ?? "203.0.113.1",
        ...(init.cookie ? { cookie: init.cookie } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  );
}

/** Cookies de session posés par une réponse, prêts à renvoyer. */
function cookiesOf(res: Response): string {
  return res.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
}

/** Dernier lien reçu par e-mail (en développement, les e-mails vont dans la console). */
function lastLink(): string {
  const text = mails.at(-1) ?? "";
  const url = text.match(/https?:\/\/\S+/)?.[0];
  if (!url) throw new Error(`aucun lien dans : ${text}`);
  return url;
}

beforeAll(async () => {
  process.env.BETTER_AUTH_SECRET = "secret-de-test-assez-long-pour-better-auth-0123456789";
  db = await openMemoryDb();
  auth = createAuth(db);
  vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
    const line = args.join(" ");
    if (line.includes("e-mail (développement)")) mails.push(line);
  });
}, 30_000);

afterEach(() => {
  mails = [];
});

describe("comptes", () => {
  it("inscription, connexion refusée avant vérification, puis vérification et session", async () => {
    const signUp = await req("/sign-up/email", { email: "Ada@Example.com", password: "un mot de passe long", name: "Ada", pseudo: "Ada" });
    expect(signUp.status).toBe(200);
    expect(cookiesOf(signUp)).not.toContain("session_token");

    const early = await req("/sign-in/email", { email: "ada@example.com", password: "un mot de passe long" });
    expect(early.status).toBe(403);

    const verify = await auth.handler(new Request(lastLink(), { headers: { "x-forwarded-for": "203.0.113.1" } }));
    expect([200, 302]).toContain(verify.status);
    const cookie = cookiesOf(verify);
    expect(cookie).toContain("session_token");

    const session = await (await req("/get-session", undefined, { cookie })).json();
    expect(session.user.email).toBe("ada@example.com");
    expect(session.user.pseudo).toBe("Ada");

    const hash = rows<{ password: string }>(await db.execute(sql`SELECT password FROM account WHERE provider_id = 'credential'`))[0];
    expect(hash.password.startsWith("$argon2id$")).toBe(true);
  });

  it("ne révèle pas qu'une adresse a déjà un compte, et prévient son titulaire", async () => {
    const again = await req("/sign-up/email", { email: "ada@example.com", password: "autre mot de passe long", name: "Intrus", pseudo: "Intrus" });
    expect(again.status).toBe(200);
    expect((await again.json()).user.email).toBe("ada@example.com");
    expect(mails.at(-1)).toContain("tentative d'inscription");
    const count = rows<{ n: number }>(await db.execute(sql`SELECT count(*)::int AS n FROM "user"`))[0];
    expect(count.n).toBe(1);
  });

  it("même réponse pour un mauvais mot de passe et une adresse inconnue", async () => {
    const wrong = await req("/sign-in/email", { email: "ada@example.com", password: "pas le bon mot de passe" }, { ip: "203.0.113.7" });
    const unknown = await req("/sign-in/email", { email: "personne@example.com", password: "pas le bon mot de passe" }, { ip: "203.0.113.7" });
    expect(wrong.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect((await wrong.json()).code).toBe((await unknown.json()).code);
  });

  it("refuse un pseudo invalide ou déjà pris (sans tenir compte de la casse)", async () => {
    const bad = await req("/sign-up/email", { email: "b@example.com", password: "un mot de passe long", name: "x", pseudo: "a b" });
    expect(bad.status).toBe(400);
    const taken = await req("/sign-up/email", { email: "c@example.com", password: "un mot de passe long", name: "x", pseudo: "ADA" });
    expect(taken.status).toBe(400);
  });

  it("limite les tentatives de connexion", async () => {
    let last = 0;
    for (let i = 0; i < 7; i++) {
      last = (await req("/sign-in/email", { email: "ada@example.com", password: "essai " + i + " mot de passe" }, { ip: "198.51.100.9" })).status;
    }
    expect(last).toBe(429);
  });

  it("le mot de passe oublié répond pareil pour une adresse inconnue", async () => {
    const known = await req("/request-password-reset", { email: "ada@example.com", redirectTo: "/" }, { ip: "192.0.2.1" });
    const unknown = await req("/request-password-reset", { email: "inconnu@example.com", redirectTo: "/" }, { ip: "192.0.2.1" });
    expect(known.status).toBe(200);
    expect(unknown.status).toBe(200);
    expect(await known.text()).toBe(await unknown.text());
  });

  it("supprimer le compte efface aussi sauvegarde et classement", async () => {
    const signIn = await req("/sign-in/email", { email: "ada@example.com", password: "un mot de passe long" }, { ip: "192.0.2.50" });
    expect(signIn.status).toBe(200);
    const cookie = cookiesOf(signIn);
    const id = rows<{ id: string }>(await db.execute(sql`SELECT id FROM "user" WHERE email = 'ada@example.com'`))[0].id;
    await db.execute(sql`INSERT INTO saves (user_id, data) VALUES (${id}, '{}'::jsonb)`);
    await db.execute(sql`INSERT INTO scores (user_id, xp) VALUES (${id}, 120)`);

    const del = await req("/delete-user", { password: "un mot de passe long" }, { cookie, ip: "192.0.2.50" });
    expect(del.status).toBe(200);
    for (const table of ["user", "account", "session", "saves", "scores"]) {
      const n = rows<{ n: number }>(await db.execute(sql.raw(`SELECT count(*)::int AS n FROM "${table}"`)))[0].n;
      expect(n, table).toBe(0);
    }
  });
});
