import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadLevels } from "../shared/src/loader";

// Fiche minimale des niveaux pour le serveur (sauvegarde, classement) :
// les routes API déployées n'ont pas accès aux fichiers YAML.
//   npm run levels:meta   (un test vérifie qu'elle est à jour)

const root = join(import.meta.dirname, "..");
const meta = loadLevels(join(root, "shared", "levels")).map((l) => ({
  id: l.id,
  tier: l.tier,
  tree: l.tree,
  xp: l.rewards.xp,
  unlocks: l.rewards.unlocks,
}));
writeFileSync(join(root, "frontend", "src", "server", "levels-meta.json"), JSON.stringify(meta, null, 1) + "\n");
console.log(`levels-meta.json : ${meta.length} niveaux`);
