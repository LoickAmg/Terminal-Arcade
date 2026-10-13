// Prépare frontend/public/v86/, servi au navigateur pour les défis réels :
//   - l'émulateur (paquet npm v86 : libv86.mjs, v86.wasm) et ses BIOS ;
//   - le Linux : v86/out/ s'il a été construit ici (bash v86/build.sh),
//     sinon l'archive publiée par le flux GitHub « Linux v86 ».
// Lancé avant « dev » et « build » du frontend. Sans réseau ni image, le site
// se construit quand même : seuls les défis réels bash seront indisponibles.

import { execFileSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "frontend", "public", "v86");
const built = join(root, "v86", "out");
const tools = join(root, "v86", ".tools");
const RELEASE = "https://github.com/LoickAmg/Terminal-Arcade/releases/download/v86-image";
const V86_COMMIT = "94faf3d6b19ecabc53a4010aaa24252fa6a162e2";
const force = process.argv.includes("--force");

async function download(url, file) {
  const res = await fetch(url, { signal: AbortSignal.timeout(10 * 60_000) });
  if (!res.ok) throw new Error(`${url} : ${res.status}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

async function main() {
  mkdirSync(dest, { recursive: true });

  // Émulateur, à la version du paquet installé.
  const v86 = dirname(createRequire(import.meta.url).resolve("v86/package.json", { paths: [join(root, "frontend")] }));
  copyFileSync(join(v86, "build", "libv86.mjs"), join(dest, "libv86.mjs"));
  copyFileSync(join(v86, "build", "v86.wasm"), join(dest, "v86.wasm"));
  for (const name of ["seabios.bin", "vgabios.bin"]) {
    const local = join(tools, name);
    if (existsSync(local)) copyFileSync(local, join(dest, name));
    else if (!existsSync(join(dest, name))) {
      await download(`https://raw.githubusercontent.com/copy/v86/${V86_COMMIT}/bios/${name}`, join(dest, name));
    }
  }

  // Linux : construit ici, ou déjà en place, ou téléchargé.
  if (existsSync(join(built, "state.bin.zst"))) {
    for (const name of ["config.json", "fs.json", "state.bin.zst"]) copyFileSync(join(built, name), join(dest, name));
    rmSync(join(dest, "flat"), { recursive: true, force: true });
    cpSync(join(built, "flat"), join(dest, "flat"), { recursive: true });
    console.log("[v86] Linux copié depuis v86/out.");
    return;
  }
  if (!force && existsSync(join(dest, "state.bin.zst"))) {
    console.log("[v86] Linux déjà en place (--force pour le retélécharger).");
    return;
  }
  const archive = join(dest, "..", "v86-image.tar.gz");
  console.log("[v86] Téléchargement du Linux publié…");
  await download(`${RELEASE}/v86-image.tar.gz`, archive);
  rmSync(join(dest, "flat"), { recursive: true, force: true });
  execFileSync("tar", ["-xzf", archive, "-C", dest], { stdio: "inherit" });
  rmSync(archive);
  console.log("[v86] Linux installé.");
}

main().catch((error) => {
  console.warn(`[v86] Linux du navigateur indisponible (${error.message}) : les défis réels bash ne pourront pas démarrer.`);
});
