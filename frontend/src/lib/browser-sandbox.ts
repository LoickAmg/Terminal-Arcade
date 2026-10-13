import type { Level, Question } from "@terminal-arcade/shared";
import { HOSTILE_SCRIPTS, appendTyped, detectHostile, newFlag, wrapCheck } from "@terminal-arcade/shared/hostile";
import type { V86 } from "v86";
import type { SandboxHandlers, SandboxSession } from "./sandbox";
import { V86Control } from "./v86-control";

// Sandbox dans le navigateur : un vrai Linux (Alpine 32 bits) émulé par v86,
// sans serveur. Le terminal du joueur est le premier port série ; le jeu
// pilote le système par le second (v86/arcade-ctl) : préparation des
// questions, arbitre, sabotages du mode Chaos. Même déroulé que le serveur
// Docker (backend/src/server.ts), mais chez le joueur.
//
// Fichiers servis depuis /v86/ (scripts/v86-assets.mjs).

export const V86_BASE = "/v86";
const CHECK_DELAYS_MS = [400, 1500];
const GAME_COMMAND = /\x1b\]7777;([a-z]+)\x07/g;

/** Réglages communs au navigateur et au test des niveaux (v86/config.json). */
export type V86Config = { memoryMb: number; cmdline: string };

/** Options de l'émulateur, à partir de l'état mémoire déjà démarré. */
export function v86Options(base: string, config: V86Config) {
  return {
    wasm_path: `${base}/v86.wasm`,
    bios: { url: `${base}/seabios.bin` },
    vga_bios: { url: `${base}/vgabios.bin` },
    memory_size: config.memoryMb * 1024 * 1024,
    vga_memory_size: 2 * 1024 * 1024,
    initial_state: { url: `${base}/state.bin.zst` },
    filesystem: { baseurl: `${base}/flat/`, basefs: `${base}/fs.json` },
    bzimage_initrd_from_filesystem: true,
    cmdline: config.cmdline,
    uart1: true,
    autostart: true,
    disable_keyboard: true,
    disable_mouse: true,
    disable_speaker: true,
  };
}

/** Le navigateur peut-il faire tourner v86 ? */
export function browserSandboxSupported(): boolean {
  return typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function";
}

const utf8 = new TextEncoder();

export class BrowserSandbox implements SandboxSession {
  private emulator: V86 | null = null;
  private control: V86Control | null = null;
  private handlers: SandboxHandlers | null = null;
  private level: Level | null = null;
  private question: Question | null = null;
  private index = -1;
  private flag = "";
  private output: number[] = [];
  private outputCarry = "";
  private decoder = new TextDecoder();
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private checkTimers: ReturnType<typeof setTimeout>[] = [];
  private checking = false;
  private typed = "";
  private hostileActive = new Set<string>();
  private generation = 0;

  constructor(private levels: Level[]) {}

  async start(levelId: string, handlers: SandboxHandlers): Promise<void> {
    this.stop();
    const level = this.levels.find((l) => l.id === levelId && l.runtime === "docker" && l.shell === "bash");
    if (!level) throw new Error(`niveau inconnu : ${levelId}`);
    if (!browserSandboxSupported()) throw new Error("ton navigateur ne gère pas WebAssembly");
    const generation = ++this.generation;
    this.level = level;
    this.handlers = handlers;

    const [config, { V86: Emulator }] = await Promise.all([
      fetch(`${V86_BASE}/config.json`).then((r) => {
        if (!r.ok) throw new Error("Linux du navigateur introuvable (fichiers /v86 absents)");
        return r.json() as Promise<V86Config>;
      }),
      import(/* webpackIgnore: true */ /* turbopackIgnore: true */ `${V86_BASE}/libv86.mjs`) as Promise<typeof import("v86")>,
    ]);
    if (generation !== this.generation) return;

    const emulator = new Emulator(v86Options(V86_BASE, config));
    const control = new V86Control((bytes) => emulator.serial_send_bytes(1, bytes));
    this.emulator = emulator;
    this.control = control;

    let lastPercent = -1;
    emulator.add_listener("download-progress", (e) => {
      if (generation !== this.generation || !e.lengthComputable || !e.total || !e.file_name.includes("state")) return;
      const percent = Math.floor((e.loaded / e.total) * 10) * 10;
      if (percent === lastPercent) return;
      lastPercent = percent;
      handlers.onOutput(`\r\x1b[2m⚙ Chargement du Linux : ${percent} %\x1b[0m`);
    });
    emulator.add_listener("serial0-output-byte", (byte) => {
      if (generation === this.generation) this.onConsoleByte(byte);
    });
    emulator.add_listener("serial1-output-byte", (byte) => {
      if (generation === this.generation) control.feed(byte);
    });

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("le Linux n'a pas démarré à temps")), 120_000);
      emulator.add_listener("emulator-ready", () => {
        clearTimeout(timer);
        resolve();
      });
    });
    if (generation !== this.generation) return;

    // L'état mémoire date de sa construction : on remet l'horloge à l'heure.
    const clock = await control.setClock(Date.now() / 1000, 20_000);
    if (generation !== this.generation) return;
    if (clock.code !== 0) throw new Error("le Linux ne répond pas");
    if (level.setup) {
      const { code, output } = await control.run(level.setup);
      if (code !== 0) console.error(`[sandbox] préparation ${level.id} : ${output}`);
    }
    // Efface la ligne de chargement ; Entrée sur une ligne vide fait
    // réafficher l'invite à bash, sous l'énoncé du jeu.
    handlers.onOutput("\r\x1b[2K");
    emulator.serial_send_bytes(0, new Uint8Array([0x0d]));
  }

  input(data: string) {
    if (!this.emulator) return;
    this.emulator.serial_send_bytes(0, utf8.encode(data));
    const { buffer, lines } = appendTyped(this.typed, data);
    this.typed = buffer;
    for (const line of lines) {
      const kinds = detectHostile(line, this.hostileActive);
      if (kinds.length === 0) continue;
      kinds.forEach((k) => this.hostileActive.delete(k));
      this.handlers?.onDetected(kinds);
    }
    if (data.includes("\r")) this.scheduleCheck();
  }

  resize(cols: number, rows: number) {
    const c = Math.max(20, Math.min(Math.floor(cols), 400));
    const r = Math.max(5, Math.min(Math.floor(rows), 200));
    void this.control?.resize(c, r);
  }

  task(index: number, variant: boolean) {
    const base = this.level?.questions[index];
    const question = variant && base?.variant ? base.variant : base;
    const control = this.control;
    if (!question || question.kind !== "task" || !control) return;
    this.checkTimers.forEach(clearTimeout);
    this.index = index;
    this.question = question;
    this.flag = question.flag ? newFlag() : "";
    const flag = this.flag;
    void (async () => {
      await control.run("rm -rf ~/.arcade");
      if (!question.setup) return;
      const { code, output } = await control.run(question.setup, { FLAG: flag });
      if (code !== 0) console.error(`[sandbox] préparation ${this.level?.id} Q${index + 1} : ${output}`);
    })();
  }

  hostile(kind: string) {
    const script = HOSTILE_SCRIPTS[kind];
    if (!script || !this.control) return;
    this.hostileActive.add(kind);
    void this.control.run(script("bash"));
  }

  stop() {
    this.generation++;
    this.checkTimers.forEach(clearTimeout);
    this.checkTimers = [];
    if (this.flushTimer) clearTimeout(this.flushTimer);
    this.flushTimer = null;
    this.control?.close();
    this.control = null;
    const emulator = this.emulator;
    this.emulator = null;
    this.handlers = null;
    this.level = null;
    this.question = null;
    this.output = [];
    this.outputCarry = "";
    this.decoder = new TextDecoder();
    this.typed = "";
    this.hostileActive.clear();
    if (emulator) void emulator.destroy().catch(() => {});
  }

  private onConsoleByte(byte: number) {
    this.output.push(byte);
    this.flushTimer ??= setTimeout(() => this.flushOutput(), 16);
  }

  private flushOutput() {
    this.flushTimer = null;
    const text = this.outputCarry + this.decoder.decode(Uint8Array.from(this.output), { stream: true });
    this.output = [];
    // Une séquence OSC du jeu coupée en deux attend la suite.
    const open = text.lastIndexOf("\x1b]7777;");
    const cut = open !== -1 && text.indexOf("\x07", open) === -1 ? open : text.length;
    this.outputCarry = text.slice(cut);
    const ready = text.slice(0, cut);
    const commands = [...ready.matchAll(GAME_COMMAND)].map((m) => m[1]);
    const visible = ready.replace(GAME_COMMAND, "");
    if (visible) this.handlers?.onOutput(visible);
    for (const command of commands) this.handlers?.onCommand(command);
  }

  private scheduleCheck() {
    this.checkTimers.forEach(clearTimeout);
    this.checkTimers = CHECK_DELAYS_MS.map((ms) => setTimeout(() => void this.runCheck(), ms));
  }

  private async runCheck() {
    const q = this.question;
    const control = this.control;
    if (!q || q.kind !== "task" || this.checking || !control) return;
    const generation = this.generation;
    this.checking = true;
    try {
      const { code } = await control.run(wrapCheck(q.check), { FLAG: this.flag, SUBMITTED: "/home/agent/.arcade/submitted" });
      if (generation !== this.generation || q !== this.question) return;
      if (code === 0) {
        this.checkTimers.forEach(clearTimeout);
        this.handlers?.onResult({ index: this.index, status: "passed" });
      } else if (code === 2) {
        // Mauvaise réponse soumise : on l'efface pour ne la compter qu'une fois.
        await control.run("rm -f ~/.arcade/submitted");
        this.handlers?.onResult({ index: this.index, status: "wrong" });
      }
    } finally {
      this.checking = false;
    }
  }
}
