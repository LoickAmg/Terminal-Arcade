// Sabotages « environnement hostile » du mode Chaos. Le navigateur n'envoie
// qu'un nom de sabotage : les scripts sont fixés ici (liste blanche), jamais
// reçus du client. Ils trafiquent le shell du joueur dans sa sandbox, et
// restent toujours réparables par lui (il possède ses fichiers, unalias,
// chmod, commande complète /bin/…).
//
// Le shell interactif lit ~/.cache/arcade/hostile.sh à l'invite suivante
// (PROMPT_COMMAND de /etc/bash.bashrc dans l'image), une seule fois.

const PENDING = "mkdir -p ~/.cache/arcade && cat >> ~/.cache/arcade/hostile.sh";

const ALIASES = [
  `alias ls='echo "ls: impossible d’ouvrir le répertoire : Permission non accordée"'`,
  "alias cat=tac",
  "alias grep='grep -v'",
];

export const HOSTILE_SCRIPTS: Record<string, () => string> = {
  // Un alias piège sur une commande courante. Se démasque avec type, alias,
  // \\commande ; se répare avec unalias.
  hostile_alias: () => {
    const line = ALIASES[Math.floor(Math.random() * ALIASES.length)];
    return `${PENDING} <<'EOF'\n${line}\nEOF`;
  },
  // Une fausse commande cat placée en tête du PATH.
  hostile_path: () =>
    [
      "mkdir -p ~/.cache/arcade/bin",
      `printf '#!/bin/bash\\necho "cat: $1: Aucun fichier ou dossier de ce type" >&2\\nexit 1\\n' > ~/.cache/arcade/bin/cat`,
      "chmod +x ~/.cache/arcade/bin/cat",
      `${PENDING} <<'EOF'\nexport PATH="$HOME/.cache/arcade/bin:$PATH"\nEOF`,
    ].join("\n"),
  // Un fichier du joueur (hors fichiers cachés) perd tous ses droits.
  hostile_chmod: () =>
    `f=$(find ~ -maxdepth 2 -type f ! -path '*/.*' 2>/dev/null | shuf -n 1); [ -n "$f" ] && chmod 000 "$f"; true`,
  // Un faux flag à côté des vrais indices.
  hostile_decoy: () => `echo "FLAG{$(head -c 6 /dev/urandom | od -An -tx1 | tr -d ' \\n')}" > ~/flag.txt`,
};

/** Commandes qui démasquent chaque sabotage quand le joueur les tape. */
const DETECTORS: [string, RegExp][] = [
  ["hostile_alias", /(^|[;&|]\s*)(unalias|alias|type)\b|^\s*\\\w|\bcommand\s/],
  ["hostile_path", /\b(which|type|hash)\b|\$PATH|(^|\s)\/(usr\/)?bin\/\w/],
  ["hostile_chmod", /\bchmod\b/],
  ["hostile_decoy", /\brm\b.*flag\.txt/],
];

export function detectHostile(line: string, active: Set<string>): string[] {
  return DETECTORS.filter(([kind, re]) => active.has(kind) && re.test(line)).map(([kind]) => kind);
}

/** Reconstitue grossièrement la ligne tapée (lettres, effacement), sans séquences d'échappement. */
export function appendTyped(buffer: string, data: string): { buffer: string; lines: string[] } {
  const lines: string[] = [];
  const clean = data.replace(/\x1b\[[0-9;]*[A-Za-z~]|\x1bO./g, "");
  for (const ch of clean) {
    if (ch === "\r" || ch === "\n") {
      lines.push(buffer);
      buffer = "";
    } else if (ch === "\x7f" || ch === "\b") {
      buffer = buffer.slice(0, -1);
    } else if (ch === "\x03" || ch === "\x15") {
      buffer = "";
    } else if (ch >= " ") {
      buffer += ch;
    }
  }
  return { buffer: buffer.slice(-500), lines };
}
