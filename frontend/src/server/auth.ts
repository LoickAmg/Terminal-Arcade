import { hash as argonHash, verify as argonVerify } from "@node-rs/argon2";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { sql } from "drizzle-orm";
import { getDb, rows, type Db } from "./db";
import { layout, sendEmail } from "./email";
import { log } from "./log";
import { schema } from "./schema";

// Comptes des joueurs, avec Better Auth : e-mail et mot de passe (Argon2id),
// connexion Google, vérification de l'adresse, mot de passe oublié,
// sessions en base (révocables), limitation de débit en base.
//
// Règles de sécurité appliquées ici :
// - l'inscription ne révèle jamais qu'une adresse a déjà un compte (réponse
//   identique, le vrai titulaire est prévenu par e-mail) ;
// - un compte Google n'est relié à un compte existant que si celui-ci a
//   prouvé son adresse (requireLocalEmailVerified) ;
// - réinitialiser le mot de passe déconnecte tous les appareils.

/** Pseudo public : 3 à 20 caractères, lettres, chiffres, _ et -. */
export const PSEUDO_RE = /^[A-Za-z0-9_-]{3,20}$/;

// Paramètres Argon2id recommandés par l'OWASP (19 Mio, 2 passes).
const ARGON = { memoryCost: 19456, timeCost: 2, parallelism: 1 };

const DAY = 24 * 60 * 60;

async function pseudoTaken(db: Db, pseudo: string): Promise<boolean> {
  const r = await db.execute(sql`SELECT 1 FROM "user" WHERE lower(pseudo) = lower(${pseudo}) LIMIT 1`);
  return rows(r).length > 0;
}

/** Pseudo libre tiré d'un nom (connexion Google) : « Ada Lovelace » → ada_lovelace, ou ada_lovelace_4821. */
async function freePseudo(db: Db, name: string): Promise<string> {
  const base =
    name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 14)
      .toLowerCase() || "joueur";
  const padded = base.length < 3 ? `${base}_joueur` : base;
  if (!(await pseudoTaken(db, padded))) return padded;
  for (let i = 0; i < 20; i++) {
    const candidate = `${padded}_${Math.floor(1000 + Math.random() * 9000)}`;
    if (!(await pseudoTaken(db, candidate))) return candidate;
  }
  return `joueur_${crypto.randomUUID().slice(0, 8)}`;
}

export function createAuth(db: Db) {
  const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3107";
  const secure = baseURL.startsWith("https://");
  const google =
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            prompt: "select_account" as const,
          },
        }
      : {};

  return betterAuth({
    appName: "Terminal Arcade",
    baseURL,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: [baseURL],
    database: drizzleAdapter(db, { provider: "pg", schema }),
    telemetry: { enabled: false },

    emailAndPassword: {
      enabled: true,
      // Le jeu se joue sans compte (sauvegarde locale) ; un compte sert à la
      // synchronisation et au classement, et doit d'abord prouver son adresse.
      requireEmailVerification: true,
      // Pas de connexion automatique : la réponse à l'inscription est la même
      // que l'adresse soit libre ou déjà prise.
      autoSignIn: false,
      minPasswordLength: 10,
      maxPasswordLength: 128,
      revokeSessionsOnPasswordReset: true,
      resetPasswordTokenExpiresIn: 60 * 60,
      password: {
        hash: (password) => argonHash(password, ARGON),
        verify: ({ hash, password }) => argonVerify(hash, password),
      },
      sendResetPassword: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Terminal Arcade : nouveau mot de passe",
          ...layout(
            "Changer ton mot de passe",
            [
              "Quelqu'un (toi, normalement) a demandé à changer le mot de passe de ton compte Terminal Arcade.",
              "Le lien ci-dessous est valable une heure. Si ce n'est pas toi, ignore ce message : rien ne change.",
            ],
            { label: "Choisir un nouveau mot de passe", url },
          ),
        });
      },
      onExistingUserSignUp: async ({ user }) => {
        await sendEmail({
          to: user.email,
          subject: "Terminal Arcade : tentative d'inscription",
          ...layout("Ton adresse a servi à une inscription", [
            "Quelqu'un a essayé de créer un compte Terminal Arcade avec ton adresse, qui en a déjà un.",
            "Si c'était toi : connecte-toi, ou utilise « Mot de passe oublié ». Sinon, ignore ce message.",
          ]),
        });
      },
    },

    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      expiresIn: DAY,
      sendVerificationEmail: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Terminal Arcade : confirme ton adresse",
          ...layout(
            "Bienvenue dans Terminal Arcade",
            [
              "Confirme ton adresse pour activer ton compte : sauvegarde en ligne et classement.",
              "Le lien est valable 24 heures. Un compte jamais confirmé est supprimé au bout de 30 jours.",
            ],
            { label: "Confirmer mon adresse", url },
          ),
        });
      },
    },

    socialProviders: google,

    account: {
      encryptOAuthTokens: true,
      accountLinking: { enabled: true, requireLocalEmailVerified: true },
    },

    user: {
      additionalFields: {
        pseudo: { type: "string", required: false, input: true },
        hidden: { type: "boolean", required: false, input: false, defaultValue: false },
      },
      // Effacement réel : les sauvegardes et le classement partent en cascade.
      deleteUser: { enabled: true },
    },

    session: {
      expiresIn: 30 * DAY,
      updateAge: DAY,
    },

    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 100,
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
        "/sign-up/email": { window: 60 * 60, max: 5 },
        "/request-password-reset": { window: 60 * 60, max: 3 },
        "/send-verification-email": { window: 60 * 60, max: 3 },
      },
    },

    advanced: {
      useSecureCookies: secure,
      // Sur Vercel, x-forwarded-for porte l'adresse du client.
      ipAddress: { ipAddressHeaders: ["x-forwarded-for"] },
    },

    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            const wanted = typeof user.pseudo === "string" ? user.pseudo.trim() : "";
            if (wanted) {
              if (!PSEUDO_RE.test(wanted)) {
                throw new APIError("BAD_REQUEST", { message: "Pseudo invalide : 3 à 20 caractères, lettres, chiffres, _ ou -." });
              }
              // Les pseudos sont publics : dire qu'il est pris ne révèle rien.
              if (await pseudoTaken(db, wanted)) {
                throw new APIError("BAD_REQUEST", { message: "Ce pseudo est déjà pris." });
              }
              return { data: { ...user, pseudo: wanted, name: wanted } };
            }
            // Connexion Google : un pseudo libre tiré du nom, modifiable ensuite.
            return { data: { ...user, pseudo: await freePseudo(db, user.name ?? "") } };
          },
          after: async (user) => {
            log("info", "account.created", { userId: user.id });
          },
        },
      },
    },

    plugins: [nextCookies()],
  });
}

export type Auth = ReturnType<typeof createAuth>;

let instance: Promise<Auth> | null = null;

/** Instance unique, créée à la première requête (la base doit être prête). */
export function getAuth(): Promise<Auth> {
  instance ??= getDb()
    .then((db) => {
      if (process.env.NODE_ENV === "production" && !process.env.BETTER_AUTH_SECRET) {
        throw new Error("BETTER_AUTH_SECRET manquant : les comptes sont désactivés.");
      }
      return createAuth(db);
    })
    .catch((error) => {
      instance = null;
      throw error;
    });
  return instance;
}
