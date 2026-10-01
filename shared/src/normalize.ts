// Normalisation des réponses, pour que `ls -la`, `ls -al` et `ls  -a -l`
// soient considérées comme la même commande.

// Commandes dont les options longues commencent par un seul tiret
// (`find -name`) : on ne les découpe pas en options d'une lettre.
const SINGLE_DASH_LONG = new Set(["find"]);

export function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;
  let hasToken = false;

  for (const ch of input.trim()) {
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      hasToken = true;
      continue;
    }
    if (/\s/.test(ch)) {
      if (hasToken) tokens.push(current);
      current = "";
      hasToken = false;
      continue;
    }
    // Opérateurs de shell collés aux mots : `ls|grep` == `ls | grep`.
    if (ch === "|" || ch === ">" || ch === "<") {
      if (hasToken) tokens.push(current);
      const last = tokens.at(-1);
      if (ch === ">" && last === ">") tokens[tokens.length - 1] = ">>";
      else tokens.push(ch);
      current = "";
      hasToken = false;
      continue;
    }
    current += ch;
    hasToken = true;
  }
  if (hasToken) tokens.push(current);
  return tokens;
}

const OPERATORS = new Set(["|", ">", ">>", "<", "&&", ";"]);

export function normalizeCommand(input: string): string {
  const out: string[] = [];
  let flags: string[] = [];
  let command: string | null = null;

  const flush = () => {
    out.push(...[...new Set(flags)].sort());
    flags = [];
  };

  for (const token of tokenize(input)) {
    if (OPERATORS.has(token)) {
      flush();
      out.push(token);
      command = null;
      continue;
    }
    if (command === null) {
      command = token;
      out.push(token);
      continue;
    }
    if (/^-[a-zA-Z]{2,}$/.test(token) && !SINGLE_DASH_LONG.has(command)) {
      for (const letter of token.slice(1)) flags.push(`-${letter}`);
      continue;
    }
    if (/^-[a-zA-Z]$/.test(token) || /^--[a-z][a-z-]*$/.test(token)) {
      flags.push(token);
      continue;
    }
    flush();
    // `cd ../` == `cd ..` ; on garde la racine `/` telle quelle.
    out.push(token.length > 1 ? token.replace(/\/+$/, "") : token);
  }
  flush();
  return out.join(" ");
}

export function normalizeText(input: string): string {
  return input.trim().replace(/\s+/g, " ").toLowerCase();
}
