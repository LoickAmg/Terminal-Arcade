// Sauvegarde locale (progression, compagnon, historique). localStorage peut
// être absent ou refusé (navigation privée, réglages du navigateur) : le
// jeu doit alors fonctionner normalement, simplement sans mémoire.

const PREFIX = "terminal-arcade.";

export function load<T>(key: string, fallback: T, isValid: (v: unknown) => v is T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    const value: unknown = JSON.parse(raw);
    return isValid(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

/** Évènement émis à chaque sauvegarde locale (sauf silencieuse) : la synchronisation en ligne l'écoute. */
export const SAVE_EVENT = "terminal-arcade:save";

export function save(key: string, value: unknown, options: { silent?: boolean } = {}): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Quota plein ou stockage bloqué : la partie continue sans sauvegarde.
  }
  if (!options.silent) window.dispatchEvent(new CustomEvent(SAVE_EVENT, { detail: key }));
}

export const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === "string");
