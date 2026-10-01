// Couleurs ANSI du terminal. La palette réelle est fixée dans le thème
// xterm (TerminalView) : ces codes désignent des rôles, pas des teintes.

const wrap = (code: string) => (text: string) => `\x1b[${code}m${text}\x1b[0m`;

export const ansi = {
  bold: wrap("1"),
  dim: wrap("2"),
  red: wrap("31"),
  green: wrap("32"),
  yellow: wrap("33"),
  cyan: wrap("36"),
  white: wrap("97"),
  inverse: wrap("7"),
};

/** Longueur affichée, sans les séquences de couleur. */
export function visibleLength(text: string): number {
  return Array.from(text.replace(/\x1b\[[0-9;]*m/g, "")).length;
}

export function stripAnsi(text: string): string {
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}
