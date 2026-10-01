import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { levelSchema, type Level } from "./schema";
import { sortLevels } from "./catalog";

// Lecture des niveaux au moment du build (côté serveur uniquement). Un
// fichier invalide fait échouer le build avec le nom du fichier et le champ
// en cause, plutôt que de casser le jeu en cours de partie.

// Le dossier est passé par l'appelant : une fois Next passé par là, le
// chemin de ce fichier n'est plus celui du dépôt.
export function loadLevels(dir: string): Level[] {
  const files = readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .sort();

  const levels = files.map((file) => {
    const raw = parse(readFileSync(join(dir, file), "utf8"));
    const result = levelSchema.safeParse(raw);
    if (!result.success) {
      const issues = result.error.issues
        .map((i) => `  - ${i.path.join(".") || "(racine)"} : ${i.message}`)
        .join("\n");
      throw new Error(`Niveau invalide ${file} :\n${issues}`);
    }
    return result.data;
  });

  const ids = new Set<string>();
  for (const level of levels) {
    if (ids.has(level.id)) throw new Error(`Identifiant de niveau en double : ${level.id}`);
    ids.add(level.id);
  }
  for (const level of levels) {
    for (const target of level.rewards.unlocks) {
      if (!ids.has(target)) throw new Error(`${level.id} débloque un niveau inexistant : ${target}`);
    }
  }
  return sortLevels(levels);
}
