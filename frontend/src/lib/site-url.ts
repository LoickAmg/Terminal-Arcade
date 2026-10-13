// Adresse publique du site, sans « / » final. Dans l'ordre :
//   1. NEXT_PUBLIC_SITE_URL (ou BETTER_AUTH_URL), si elle est donnée ;
//   2. sur Vercel, l'adresse que Vercel fournit lui-même : le domaine de
//      production, ou l'adresse du déploiement de prévisualisation ;
//   3. le serveur de développement.
// Ainsi un oubli de variable ne casse ni les comptes ni le plan du site.

type Env = Record<string, string | undefined>;

// Références directes : Next.js ne remplace les variables NEXT_PUBLIC_ dans
// le code du navigateur que lorsqu'elles sont écrites en toutes lettres.
const current = (): Env => ({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
});

const clean = (url: string) => url.trim().replace(/\/+$/, "");

function fromVercel(env: Env): string | null {
  const host =
    env.VERCEL_ENV === "preview"
      ? env.VERCEL_URL
      : (env.VERCEL_PROJECT_PRODUCTION_URL ?? env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL);
  return host?.trim() ? `https://${clean(host)}` : null;
}

/** Adresse publique du site (plan du site, liens de partage, pages légales). */
export function siteUrl(env: Env = current()): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim() || env.BETTER_AUTH_URL?.trim();
  return explicit ? clean(explicit) : (fromVercel(env) ?? "http://localhost:3107");
}

/** Adresse servie aux comptes (liens des e-mails, origine acceptée). */
export function authUrl(env: Env = current()): string {
  const explicit = env.BETTER_AUTH_URL?.trim() || env.NEXT_PUBLIC_SITE_URL?.trim();
  return explicit ? clean(explicit) : (fromVercel(env) ?? "http://localhost:3107");
}
