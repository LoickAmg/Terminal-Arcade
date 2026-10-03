// Journal structuré : une ligne JSON par événement, lisible dans les journaux
// de Vercel et facile à filtrer. Jamais de mot de passe, de jeton ni d'adresse
// e-mail en clair dans les champs.

type Level = "info" | "warn" | "error";

export function log(level: Level, event: string, fields: Record<string, unknown> = {}) {
  const line = JSON.stringify({ time: new Date().toISOString(), level, event, ...fields });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

/** Message et type d'une erreur, sans la pile complète dans le champ principal. */
export function errorFields(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    // La cause d'origine (erreur du pilote de base, du réseau…) est souvent la seule utile.
    const cause = error.cause instanceof Error ? error.cause.message : error.cause ? String(error.cause) : undefined;
    return { error: error.message, name: error.name, cause, stack: error.stack?.split("\n").slice(0, 5).join(" | ") };
  }
  return { error: String(error) };
}

/** Domaine d'une adresse (exemple.com) : assez pour diagnostiquer, sans l'identité. */
export function emailDomain(email: string): string {
  return email.split("@")[1] ?? "?";
}
