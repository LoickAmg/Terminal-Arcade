import { join } from "node:path";
import { loadLevels } from "@terminal-arcade/shared/loader";
import { Game } from "@/components/Game";

// Les niveaux sont lus et validés au build : la page est statique.
export default function Home() {
  const levels = loadLevels(join(process.cwd(), "..", "shared", "levels"));
  return <Game levels={levels} />;
}
