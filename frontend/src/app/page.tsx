import { join } from "node:path";
import { loadLevels } from "@terminal-arcade/shared/loader";
import { App } from "@/components/App";

// Les niveaux sont lus et validés au build : la page est statique.
export default function Home() {
  const levels = loadLevels(join(process.cwd(), "..", "shared", "levels"));
  // Le bouton Google n'apparaît que si la connexion Google est configurée.
  return <App levels={levels} googleEnabled={!!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET} />;
}
