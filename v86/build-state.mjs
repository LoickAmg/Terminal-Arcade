// Démarre le Linux des défis réels dans v86 (sous Node), attend l'invite du
// joueur et le canal de contrôle, puis enregistre l'état mémoire compressé :
// dans le navigateur, une partie repart de cet état en une seconde au lieu
// de rejouer tout le démarrage.
//
//   node v86/build-state.mjs     (après v86/build.sh, qui l'appelle)

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { zstdCompressSync, constants } from "node:zlib";
import { V86 } from "v86";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "out");
const bios = join(here, ".tools");
// BIOS du dépôt v86, à la même version que le paquet npm.
const V86_COMMIT = "94faf3d6b19ecabc53a4010aaa24252fa6a162e2";

export const MEMORY_MB = 128;
// init_on_free : la mémoire libérée est remise à zéro, et l'état mémoire se
// compresse bien mieux (moins à télécharger pour le joueur).
export const CMDLINE =
  "rw root=host9p rootfstype=9p rootflags=trans=virtio,cache=loose modules=virtio_pci tsc=reliable init_on_free=on quiet";

async function fetchBios(name) {
  const file = join(bios, name);
  if (!existsSync(file)) {
    mkdirSync(bios, { recursive: true });
    const res = await fetch(`https://raw.githubusercontent.com/copy/v86/${V86_COMMIT}/bios/${name}`);
    if (!res.ok) throw new Error(`${name} : ${res.status}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return file;
}

const emulator = new V86({
  wasm_path: join(here, "..", "node_modules", "v86", "build", "v86.wasm"),
  bios: { url: await fetchBios("seabios.bin") },
  vga_bios: { url: await fetchBios("vgabios.bin") },
  memory_size: MEMORY_MB * 1024 * 1024,
  vga_memory_size: 2 * 1024 * 1024,
  autostart: true,
  uart1: true,
  bzimage_initrd_from_filesystem: true,
  cmdline: CMDLINE,
  filesystem: { baseurl: join(out, "flat"), basefs: join(out, "fs.json") },
});

console.log("Démarrage du Linux (une à deux minutes)…");
const started = Date.now();
let console0 = "";
let control = "";
let prompt = false;
let ready = false;
let saving = false;
let saved = false;

const timeout = setTimeout(() => {
  console.error("Échec : pas d'invite après 5 minutes.\n--- console ---\n" + console0.slice(-2000));
  process.exit(1);
}, 5 * 60_000);

emulator.add_listener("serial0-output-byte", (byte) => {
  console0 += String.fromCharCode(byte);
  if (!prompt && /agent@sandbox:~\$ $/.test(console0.replace(/\x1b\[[0-9;]*m/g, ""))) {
    prompt = true;
    maybeSave();
  }
});

emulator.add_listener("serial1-output-byte", (byte) => {
  control += String.fromCharCode(byte);
  if (!ready && control.includes("@@ready\n")) {
    ready = true;
    maybeSave();
  }
  if (saving && !saved && control.includes("@@drop 0")) {
    saved = true;
    void save();
  }
});

function maybeSave() {
  if (!prompt || !ready || saving) return;
  saving = true;
  console.log(`Invite atteinte en ${Math.round((Date.now() - started) / 1000)} s, préparation de l'état…`);
  emulator.serial_send_bytes(1, new TextEncoder().encode("drop drop\n"));
}

async function save() {
  clearTimeout(timeout);
  // Laisse le système se calmer après le vidage des caches.
  await new Promise((r) => setTimeout(r, 3000));
  const state = new Uint8Array(await emulator.save_state());
  const packed = zstdCompressSync(state, { params: { [constants.ZSTD_c_compressionLevel]: 19 } });
  writeFileSync(join(out, "state.bin.zst"), packed);
  console.log(`État enregistré : ${(packed.length / 1024 / 1024).toFixed(1)} Mo (brut ${(state.length / 1024 / 1024).toFixed(0)} Mo).`);
  await emulator.destroy();
  process.exit(0);
}

// Fichier lu par le navigateur : réglages identiques à ceux de l'état.
writeFileSync(join(out, "config.json"), JSON.stringify({ memoryMb: MEMORY_MB, cmdline: CMDLINE, built: new Date().toISOString() }));
