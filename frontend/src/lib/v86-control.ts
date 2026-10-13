// Canal de contrôle du Linux v86 (second port série, v86/arcade-ctl).
// Indépendant de l'environnement : sert au navigateur (browser-sandbox.ts)
// comme au test des niveaux sous Node (v86/check-levels.mts).
//
// Une ligne par ordre (« <id> run :<script> »…), une ligne par réponse
// (« @@<id> <code> <sortie> »). Scripts et sorties tiennent sur une ligne
// grâce à un échappement minimal (\\ \n \r \t), que l'invité décode et
// produit avec les seules commandes internes de bash.

export type ControlResult = { code: number; output: string };
type Pending = { resolve: (r: ControlResult) => void; timer: ReturnType<typeof setTimeout> };

// Une ligne doit tenir dans le tampon du terminal série de l'invité (4 Kio),
// en octets.
export const MAX_CONTROL_LINE = 3500;

const utf8 = new TextEncoder();
const UNESCAPE: Record<string, string> = { n: "\n", r: "\r", t: "\t", "\\": "\\" };

/** Texte sur une ligne : \ et les fins de ligne échappés (décodé par printf %b). */
export function escapeLine(text: string): string {
  return text.replace(/[\\\n\r\t]/g, (c) => ({ "\\": "\\\\", "\n": "\\n", "\r": "\\r", "\t": "\\t" })[c]!);
}

export function unescapeLine(text: string): string {
  return text.replace(/\\([\\nrt])/g, (_, c: string) => UNESCAPE[c]);
}

/** Corps d'un ordre « run » : variables exportées, puis le script. */
export function runPayload(script: string, env: Record<string, string> = {}): string {
  const exports = Object.entries(env)
    .map(([k, v]) => `export ${k}='${v.replace(/'/g, "'\\''")}'\n`)
    .join("");
  // Le « : » protège les espaces de tête, que read retirerait.
  return `:${escapeLine(exports + script)}`;
}

export class V86Control {
  private nextId = 1;
  private pending = new Map<number, Pending>();
  private bytes: number[] = [];

  constructor(private sendBytes: (bytes: Uint8Array) => void) {}

  /** Octet reçu du second port série. */
  feed(byte: number) {
    if (byte !== 0x0a) {
      this.bytes.push(byte);
      return;
    }
    const line = new TextDecoder().decode(Uint8Array.from(this.bytes)).replace(/\r$/, "");
    this.bytes = [];
    const m = /^@@(\d+) (-?\d+) ?(.*)$/.exec(line);
    if (!m) return;
    const id = Number(m[1]);
    const pending = this.pending.get(id);
    if (!pending) return;
    this.pending.delete(id);
    clearTimeout(pending.timer);
    pending.resolve({ code: Number(m[2]), output: unescapeLine(m[3]) });
  }

  /** Exécute un script bash en tant que joueur (30 s au plus dans l'invité). */
  run(script: string, env: Record<string, string> = {}): Promise<ControlResult> {
    return this.order(`run ${runPayload(script, env)}`);
  }

  /** Remet l'horloge à l'heure (l'état mémoire date de sa construction). */
  setClock(seconds: number, timeoutMs?: number): Promise<ControlResult> {
    return this.order(`date ${Math.floor(seconds)}`, timeoutMs);
  }

  resize(cols: number, rows: number): Promise<ControlResult> {
    return this.order(`size ${cols} ${rows}`);
  }

  /** Abandonne les ordres en attente (fin de partie). */
  close() {
    for (const p of this.pending.values()) {
      clearTimeout(p.timer);
      p.resolve({ code: -1, output: "" });
    }
    this.pending.clear();
  }

  private order(body: string, timeoutMs = 40_000): Promise<ControlResult> {
    const id = this.nextId++;
    const line = utf8.encode(`${id} ${body}\n`);
    if (line.length > MAX_CONTROL_LINE) return Promise.resolve({ code: -1, output: "script trop long" });
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        resolve({ code: -1, output: "délai dépassé" });
      }, timeoutMs);
      this.pending.set(id, { resolve, timer });
      this.sendBytes(line);
    });
  }
}
