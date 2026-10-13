import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { V86 } from "v86";
import { loadLevels } from "../shared/src/loader";
import { newFlag, wrapCheck } from "../shared/src/hostile";
import type { Question } from "../shared/src";
import { v86Options, type V86Config } from "../frontend/src/lib/browser-sandbox";
import { V86Control } from "../frontend/src/lib/v86-control";

// Test d'intégration des niveaux bash dans le Linux du navigateur, sous Node :
// pour chaque défi (et sa variante), l'arbitre doit refuser l'état de départ
// puis accepter l'état obtenu par le script « solve ». Même contrôle que
// backend/src/check-levels.ts pour Docker.
//
//   npx tsx v86/check-levels.mts [identifiant du niveau…]

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "out");
const only = process.argv.slice(2);
const levels = loadLevels(join(here, "..", "shared", "levels")).filter(
  (l) => l.runtime === "docker" && l.shell === "bash" && (only.length === 0 || only.includes(l.id)),
);
const config = JSON.parse(readFileSync(join(out, "config.json"), "utf8")) as V86Config;

async function boot() {
  const options = v86Options(out.replace(/\\/g, "/"), config);
  const emulator = new V86({
    ...options,
    wasm_path: join(here, "..", "node_modules", "v86", "build", "v86.wasm"),
    bios: { url: join(here, ".tools", "seabios.bin") },
    vga_bios: { url: join(here, ".tools", "vgabios.bin") },
    initial_state: { url: join(out, "state.bin.zst") },
    filesystem: { baseurl: join(out, "flat") + "/", basefs: join(out, "fs.json") },
  });
  const control = new V86Control((bytes) => emulator.serial_send_bytes(1, bytes));
  emulator.add_listener("serial1-output-byte", (byte) => control.feed(byte));
  await new Promise<void>((resolve) => emulator.add_listener("emulator-ready", () => resolve()));
  const clock = await control.setClock(Date.now() / 1000, 30_000);
  if (clock.code !== 0) throw new Error(`le Linux ne répond pas (${clock.output})`);
  return { emulator, control };
}

async function checkTask(control: V86Control, q: Question, label: string): Promise<string[]> {
  if (q.kind !== "task") return [`${label} : pas un défi task`];
  const errors: string[] = [];
  const env = { FLAG: q.flag ? newFlag() : "", SUBMITTED: "/home/agent/.arcade/submitted" };
  await control.run("rm -rf ~/.arcade");
  if (q.setup) {
    const setup = await control.run(q.setup, env);
    if (setup.code !== 0) errors.push(`${label} : setup en échec (${setup.code}) ${setup.output.trim()}`);
  }
  const before = await control.run(wrapCheck(q.check), env);
  if (before.code === 0) errors.push(`${label} : l'arbitre valide avant toute action`);
  if (!q.solve) return [...errors, `${label} : pas de script solve`];
  const solve = await control.run(q.solve, env);
  if (solve.code !== 0) errors.push(`${label} : solve en échec (${solve.code}) ${solve.output.trim()}`);
  await new Promise((r) => setTimeout(r, 400));
  const after = await control.run(wrapCheck(q.check), env);
  if (after.code !== 0) errors.push(`${label} : l'arbitre refuse la solution (code ${after.code}) ${after.output.trim()}`);
  return errors;
}

let failures = 0;
for (const level of levels) {
  const started = Date.now();
  const { emulator, control } = await boot();
  const errors: string[] = [];
  try {
    if (level.setup) {
      const setup = await control.run(level.setup);
      if (setup.code !== 0) errors.push(`setup du niveau en échec : ${setup.output.trim()}`);
    }
    for (const [i, q] of level.questions.entries()) {
      errors.push(...(await checkTask(control, q, `Q${i + 1}`)));
      if (q.variant) errors.push(...(await checkTask(control, q.variant, `Q${i + 1} (variante)`)));
    }
  } finally {
    control.close();
    await emulator.destroy();
  }
  failures += errors.length;
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`${errors.length === 0 ? "✔" : "✘"} ${level.id} (${level.questions.length} défis, ${seconds} s)`);
  for (const e of errors) console.log(`    ${e}`);
}
console.log(failures === 0 ? `\n${levels.length} niveaux bash solubles dans v86.` : `\n${failures} problème(s).`);
process.exit(failures === 0 ? 0 : 1);
