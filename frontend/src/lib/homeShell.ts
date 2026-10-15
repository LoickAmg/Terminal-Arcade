// Invite de l'accueil : une vraie ligne de commande, avant même d'entrer.
// Fonction pure (une ligne entre, une action et des lignes à afficher
// sortent) ; l'accueil (Home.tsx) exécute l'action.

export type HomeAction =
  | { type: "menu"; index?: number }
  | { type: "game"; command?: string }
  | { type: "theme"; id: string }
  | { type: "scanlines"; on: boolean }
  | { type: "clear" }
  | { type: "none" };

export type HomeLine = { text: string; tone?: "muted" | "accent" | "bad" };
export type HomeResult = { action: HomeAction; out: HomeLine[] };

type ThemeRef = { id: string; label: string };

// Entrées du menu (même ordre que Menu.tsx).
const MENU: Record<string, number> = {
  missions: 1,
  "git-gud": 2,
  gitgud: 2,
  git: 2,
  compagnon: 3,
  profil: 4,
  classement: 5,
  compte: 6,
  login: 6,
  apparence: 7,
  réglages: 8,
  reglages: 8,
  options: 8,
  aide: 9,
  pourquoi: 9,
  retour: 10,
  retours: 10,
  feedback: 10,
  suggestion: 10,
};

// Commandes du jeu, transmises telles quelles au terminal de jeu.
const GAME = ["ls", "open", "cd", "whoami", "pet"];

export const HOME_COMMANDS = [
  "./entrer",
  "jouer",
  "help",
  "theme",
  "scanlines on",
  "scanlines off",
  "clear",
  "ls missions/",
  "open ",
  "whoami",
  "pet",
  ...Object.keys(MENU).filter((k) => !["gitgud", "git", "login", "reglages", "options", "retours", "feedback", "suggestion"].includes(k)),
];

const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function help(): HomeLine[] {
  const row = (cmd: string, text: string): HomeLine => ({ text: `  ${cmd.padEnd(16)}${text}` });
  return [
    { text: "Commandes de l'accueil", tone: "accent" },
    row("Entrée, ./entrer", "ouvrir le menu"),
    row("jouer", "aller droit au terminal de jeu"),
    row("ls missions/", "les niveaux (open <niveau> en lance un)"),
    row("missions, compte…", "ouvrir une entrée du menu"),
    row("pourquoi", "à quoi sert Terminal Arcade"),
    row("retour", "un bug, une idée ? écris-nous"),
    row("theme [nom]", "lister les thèmes, ou en changer"),
    row("scanlines on|off", "l'effet d'écran cathodique"),
    row("clear", "effacer ces lignes"),
    { text: "Tab complète, ↑ ↓ rappellent les commandes déjà tapées.", tone: "muted" },
  ];
}

export function runHomeCommand(line: string, themes: ThemeRef[], current: string): HomeResult {
  const trimmed = line.trim();
  const [rawCmd = "", ...args] = trimmed.split(/\s+/);
  const cmd = strip(rawCmd);
  const arg = args.join(" ");

  if (cmd === "" || cmd === "./entrer" || cmd === "entrer" || cmd === "menu" || cmd === "exit") {
    return { action: { type: "menu" }, out: [] };
  }
  if (cmd === "jouer" || cmd === "./jouer" || cmd === "play" || cmd === "start") return { action: { type: "game" }, out: [] };
  if (cmd === "help" || cmd === "?") return { action: { type: "none" }, out: help() };
  if (cmd === "clear") return { action: { type: "clear" }, out: [] };
  if (cmd in MENU && arg === "") return { action: { type: "menu", index: MENU[cmd] }, out: [] };
  if (GAME.includes(cmd)) return { action: { type: "game", command: trimmed }, out: [] };

  if (cmd === "theme" || cmd === "themes") {
    if (arg === "") {
      return {
        action: { type: "none" },
        out: [
          { text: "Thèmes (theme <nom> pour changer) :", tone: "accent" },
          ...themes.map((t) => ({ text: `  ${t.id === current ? "●" : " "} ${t.id.padEnd(17)}${t.label}` })),
        ],
      };
    }
    const wanted = strip(arg).replace(/\s+/g, "-");
    const theme = themes.find((t) => t.id === wanted || strip(t.label).replace(/\s+/g, "-") === wanted);
    if (!theme) return { action: { type: "none" }, out: [{ text: `theme : « ${arg} » inconnu. Tape theme pour la liste.`, tone: "bad" }] };
    return { action: { type: "theme", id: theme.id }, out: [{ text: `Thème « ${theme.label} » appliqué.`, tone: "muted" }] };
  }

  if (cmd === "scanlines") {
    if (arg === "on" || arg === "off") {
      return { action: { type: "scanlines", on: arg === "on" }, out: [{ text: `Lignes de balayage ${arg === "on" ? "activées" : "désactivées"}.`, tone: "muted" }] };
    }
    return { action: { type: "none" }, out: [{ text: "Usage : scanlines on|off", tone: "bad" }] };
  }

  if (cmd === "sudo") return { action: { type: "none" }, out: [{ text: "Bien essayé. Ici, même root commence par ./entrer.", tone: "muted" }] };

  return {
    action: { type: "none" },
    out: [{ text: `${rawCmd} : commande inconnue. Tape help, ou Entrée pour ouvrir le menu.`, tone: "bad" }],
  };
}

/** Complétion par Tab : les commandes qui commencent par ce qui est tapé. */
export function completeHome(buffer: string, themes: ThemeRef[]): string[] {
  const lower = buffer.toLowerCase();
  if (lower.startsWith("theme ")) {
    return themes.map((t) => `theme ${t.id}`).filter((c) => c.startsWith(lower));
  }
  return HOME_COMMANDS.filter((c) => c.startsWith(lower) && c !== lower);
}
