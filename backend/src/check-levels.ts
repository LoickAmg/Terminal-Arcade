import { join } from "node:path";
import { loadLevels } from "@terminal-arcade/shared/loader";
import type { Question } from "@terminal-arcade/shared";
import { createSandbox, imageReady, newFlag, runScript, wrapCheck, IMAGE } from "./sandbox";

// Test d'intégration des niveaux Docker : pour chaque défi (et sa variante),
// dans une vraie sandbox, l'arbitre doit refuser l'état de départ puis
// accepter l'état obtenu par le script « solve ». Prouve que chaque défi est
// faisable et que son arbitre n'est pas trivial.
//
//   npm run test:sandbox -w backend   (Docker lancé, image construite)
//
// Avec --mutation : pour chaque variante, une partie où elle remplace sa
// question avant que l'originale n'ait tourné (sabotage « mutation » du
// Chaos) ; la suite du niveau doit rester soluble.
//
//   npm run test:sandbox -w backend -- --mutation

const levels = loadLevels(join(process.cwd(), "..", "shared", "levels")).filter((l) => l.runtime === "docker");
const mutation = process.argv.includes("--mutation");

async function checkTask(container: Parameters<typeof runScript>[0], q: Question, label: string): Promise<string[]> {
  if (q.kind !== "task") return [`${label} : pas un défi task`];
  const errors: string[] = [];
  const env = { FLAG: q.flag ? newFlag() : "", SUBMITTED: "/home/agent/.arcade/submitted" };
  await runScript(container, "rm -rf ~/.arcade");
  if (q.setup) {
    const setup = await runScript(container, q.setup, env);
    if (setup.code !== 0) errors.push(`${label} : setup en échec (${setup.code}) ${setup.output.trim()}`);
  }
  const before = await runScript(container, wrapCheck(q.check), env);
  if (before.code === 0) errors.push(`${label} : l'arbitre valide avant toute action`);
  if (!q.solve) return [...errors, `${label} : pas de script solve`];
  const solve = await runScript(container, q.solve, env);
  if (solve.code !== 0) errors.push(`${label} : solve en échec (${solve.code}) ${solve.output.trim()}`);
  // Laisse aux processus tués le temps de disparaître.
  await new Promise((r) => setTimeout(r, 400));
  const after = await runScript(container, wrapCheck(q.check), env);
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
    // Une partie normale, ou une partie par variante en mode mutation.
    const runs = mutation
      ? level.questions.flatMap((q, i) => (q.variant ? [i] : []))
      : [-1];
    for (const swap of runs) {
      const sandbox = await createSandbox(`test-${level.id}`, level.shell);
      const errors: string[] = [];
      try {
        if (level.setup) {
          const setup = await runScript(sandbox.container, level.setup);
          if (setup.code !== 0) errors.push(`setup du niveau en échec : ${setup.output.trim()}`);
        }
        for (const [i, q] of level.questions.entries()) {
          if (mutation) {
            const played = i === swap ? q.variant! : q;
            errors.push(...(await checkTask(sandbox.container, played, `Q${i + 1}${i === swap ? " (variante)" : ""}`)));
            continue;
          }
          errors.push(...(await checkTask(sandbox.container, q, `Q${i + 1}`)));
          if (q.variant) errors.push(...(await checkTask(sandbox.container, q.variant, `Q${i + 1} (variante)`)));
        }
      } finally {
        await sandbox.stop();
      }
      failures += errors.length;
      const label = mutation ? `${level.id}, variante Q${swap + 1}` : `${level.id} (${level.questions.length} défis)`;
      console.log(`${errors.length === 0 ? "✔" : "✘"} ${label}`);
      for (const e of errors) console.log(`    ${e}`);
    }
  }
  console.log(failures === 0 ? "\nTous les défis sont solubles." : `\n${failures} problème(s).`);
  process.exit(failures === 0 ? 0 : 1);
}

void main();
