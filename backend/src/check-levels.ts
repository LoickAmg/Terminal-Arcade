import { join } from "node:path";
import { loadLevels } from "@terminal-arcade/shared/loader";
import type { Question } from "@terminal-arcade/shared";
import { createSandbox, imageReady, newFlag, runScript, IMAGE } from "./sandbox";

// Test d'intégration des niveaux Docker : pour chaque défi (et sa variante),
// dans une vraie sandbox, l'arbitre doit refuser l'état de départ puis
// accepter l'état obtenu par le script « solve ». Prouve que chaque défi est
// faisable et que son arbitre n'est pas trivial.
//
//   npm run test:sandbox -w backend   (Docker lancé, image construite)

const levels = loadLevels(join(process.cwd(), "..", "shared", "levels")).filter((l) => l.runtime === "docker");

async function checkTask(container: Parameters<typeof runScript>[0], q: Question, label: string): Promise<string[]> {
  if (q.kind !== "task") return [`${label} : pas un défi task`];
  const errors: string[] = [];
  const env = { FLAG: q.flag ? newFlag() : "", SUBMITTED: "/home/agent/.arcade/submitted" };
  await runScript(container, "rm -rf ~/.arcade");
  if (q.setup) {
    const setup = await runScript(container, q.setup, env);
    if (setup.code !== 0) errors.push(`${label} : setup en échec (${setup.code}) ${setup.output.trim()}`);
  }
  const before = await runScript(container, q.check, env);
  if (before.code === 0) errors.push(`${label} : l'arbitre valide avant toute action`);
  if (!q.solve) return [...errors, `${label} : pas de script solve`];
  const solve = await runScript(container, q.solve, env);
  if (solve.code !== 0) errors.push(`${label} : solve en échec (${solve.code}) ${solve.output.trim()}`);
  // Laisse aux processus tués le temps de disparaître.
  await new Promise((r) => setTimeout(r, 400));
  const after = await runScript(container, q.check, env);
  if (after.code !== 0) errors.push(`${label} : l'arbitre refuse la solution (code ${after.code})`);
  return errors;
}

async function main() {
  if (!(await imageReady())) {
    console.error(`Image ${IMAGE} absente : npm run sandbox:build -w backend`);
    process.exit(1);
  }
  let failures = 0;
  for (const level of levels) {
    const sandbox = await createSandbox(`test-${level.id}`);
    const errors: string[] = [];
    try {
      if (level.setup) {
        const setup = await runScript(sandbox.container, level.setup);
        if (setup.code !== 0) errors.push(`setup du niveau en échec : ${setup.output.trim()}`);
      }
      for (const [i, q] of level.questions.entries()) {
        errors.push(...(await checkTask(sandbox.container, q, `Q${i + 1}`)));
        if (q.variant) errors.push(...(await checkTask(sandbox.container, q.variant, `Q${i + 1} (variante)`)));
      }
    } finally {
      await sandbox.stop();
    }
    failures += errors.length;
    console.log(`${errors.length === 0 ? "✔" : "✘"} ${level.id} (${level.questions.length} défis)`);
    for (const e of errors) console.log(`    ${e}`);
  }
  console.log(failures === 0 ? "\nTous les défis sont solubles." : `\n${failures} problème(s).`);
  process.exit(failures === 0 ? 0 : 1);
}

void main();
