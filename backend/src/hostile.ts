// Sabotages « environnement hostile » du mode Chaos. Le navigateur n'envoie
// qu'un nom de sabotage : les scripts sont fixés ici (liste blanche), jamais
// reçus du client. Ils trafiquent le shell du joueur dans sa sandbox, et
// restent toujours réparables par lui (il possède ses fichiers, unalias ou
// Remove-Item function:, chmod, chemin complet /bin/…).
//
// Le shell interactif lit le sabotage déposé à l'invite suivante, une seule
// fois : ~/.cache/arcade/hostile.sh pour bash (PROMPT_COMMAND de
// /etc/bash.bashrc), hostile.ps1 pour PowerShell (fonction prompt du profil).

export type Shell = "bash" | "pwsh";

const pending = (shell: Shell) =>
  `mkdir -p ~/.cache/arcade && cat >> ~/.cache/arcade/hostile.${shell === "bash" ? "sh" : "ps1"}`;

const pick = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)];

const BASH_ALIASES = [
  `alias ls='echo "ls: impossible d’ouvrir le répertoire : Permission non accordée"'`,
  "alias cat=tac",
  "alias grep='grep -v'",
];

const PWSH_TRAPS = [
  `function global:Get-ChildItem { Write-Host "Get-ChildItem : accès au chemin refusé." -ForegroundColor Red }`,
  `function global:Get-Content { Write-Host "Get-Content : fichier introuvable." -ForegroundColor Red }`,
  `function global:Select-String { $input | Where-Object { $false } }`,
];

const FAKE_CAT = [
  "mkdir -p ~/.cache/arcade/bin",
  `printf '#!/bin/bash\\necho "cat: $1: Aucun fichier ou dossier de ce type" >&2\\nexit 1\\n' > ~/.cache/arcade/bin/cat`,
  "chmod +x ~/.cache/arcade/bin/cat",
].join("\n");

export const HOSTILE_SCRIPTS: Record<string, (shell: Shell) => string> = {
  // Une commande courante remplacée par un piège (alias bash, fonction PowerShell).
  hostile_alias: (shell) =>
    `${pending(shell)} <<'EOF'\n${shell === "bash" ? pick(BASH_ALIASES) : pick(PWSH_TRAPS)}\nEOF`,
  // Une fausse commande cat placée en tête du PATH.
  hostile_path: (shell) =>
    `${FAKE_CAT}\n${pending(shell)} <<'EOF'\n${
      shell === "bash" ? 'export PATH="$HOME/.cache/arcade/bin:$PATH"' : '$env:PATH = "$HOME/.cache/arcade/bin:" + $env:PATH'
    }\nEOF`,
  // Un fichier du joueur (hors fichiers cachés) perd tous ses droits.
  hostile_chmod: () =>
    `f=$(find ~ -maxdepth 2 -type f ! -path '*/.*' 2>/dev/null | shuf -n 1); [ -n "$f" ] && chmod 000 "$f"; true`,
  // Un faux flag à côté des vrais indices.
  hostile_decoy: () => `echo "FLAG{$(head -c 6 /dev/urandom | od -An -tx1 | tr -d ' \\n')}" > ~/flag.txt`,
};

/** Commandes qui démasquent chaque sabotage quand le joueur les tape (bash ou PowerShell). */
const DETECTORS: [string, RegExp][] = [
  [
    "hostile_alias",
    /(^|[;&|]\s*)(unalias|alias|type)\b|^\s*\\\w|\bcommand\s|Get-Command|Get-Alias|Remove-Item\s+(function|alias):|function:/i,
  ],
  ["hostile_path", /\b(which|type|hash)\b|\$PATH|\$env:PATH|Get-Command|(^|\s)\/(usr\/)?bin\/\w/i],
  ["hostile_chmod", /\bchmod\b/],
  ["hostile_decoy", /\b(rm|Remove-Item)\b.*flag\.txt/i],
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
