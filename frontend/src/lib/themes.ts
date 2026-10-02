// Thèmes de l'interface. Chaque thème fixe des variables CSS (couleurs,
// police des titres, formes) appliquées sur <html>, et la palette du
// terminal xterm. Le thème « Seuil » est celui par défaut.

export type ThemeGroup = "signature" | "persona" | "neon" | "os" | "console";

export const GROUP_LABELS: Record<ThemeGroup, string> = {
  signature: "Signature",
  persona: "Persona",
  neon: "Néon & hacker",
  os: "Terminaux",
  console: "Jeu vidéo & console",
};

export type Pattern = "stripes" | "dots" | "grid" | "scan" | "none";

export const PATTERN_LABELS: Record<Pattern, string> = {
  stripes: "Rayures",
  dots: "Trame",
  grid: "Grille",
  scan: "Lignes",
  none: "Aucun",
};

type Palette = {
  page: string; // fond de page (couleur ou dégradé)
  surface: string; // panneaux, cadre principal
  surface2: string; // éléments surélevés, survol
  line: string; // filets et bordures
  fg: string;
  muted: string;
  accent: string;
  onAccent: string;
  accent2: string;
  onAccent2: string;
  danger: string;
  good: string;
  warn: string;
  termBg: string;
  termFg: string;
  pattern: string; // couleur du motif de fond
};

type Look = {
  display: "grotesk" | "poster" | "mono" | "sans" | "thin";
  italic?: boolean;
  /** Découpes façon Persona (bulles, bannières de travers). */
  cut?: "persona" | "chamfer" | "slant" | "none";
  /** Liseré décalé sous les formes (Persona). */
  edge?: string;
  /** Contour des grands titres. */
  outline?: "ink" | "glow" | "none";
  radius?: number;
  pattern: Pattern;
  /** Inclinaison des grands titres (Persona). */
  tilt?: number;
  /** Cyan du terminal (sinon l'accent). */
  termCyan?: string;
};

export type Theme = {
  id: string;
  label: string;
  group: ThemeGroup;
  blurb: string;
  palette: Palette;
  look: Look;
};

export const THEMES: Theme[] = [
  {
    id: "seuil",
    label: "Seuil",
    group: "signature",
    blurb: "Noir profond, citron électrique, typographie d'affiche.",
    palette: {
      page: "#0a0a0a",
      surface: "#0d0d0d",
      surface2: "#161616",
      line: "#262626",
      fg: "#e7e5dd",
      muted: "#8c8b84",
      accent: "#d4f54a",
      onAccent: "#0a0a0a",
      accent2: "#e7e5dd",
      onAccent2: "#0a0a0a",
      danger: "#ff5a4f",
      good: "#7ee081",
      warn: "#ffc94a",
      termBg: "#080808",
      termFg: "#dddbd3",
      pattern: "rgb(255 255 255 / 0.028)",
    },
    look: { display: "grotesk", italic: true, cut: "slant", outline: "none", pattern: "stripes" },
  },
  {
    id: "phantom",
    label: "Phantom",
    group: "persona",
    blurb: "Rouge, noir et blanc. Messagerie de voleurs fantômes (P5).",
    palette: {
      page: "#d9121c",
      surface: "#0a0a0a",
      surface2: "#1c1c1c",
      line: "#3a3a3a",
      fg: "#ffffff",
      muted: "#bdbdbd",
      accent: "#ff2a33",
      onAccent: "#ffffff",
      accent2: "#ffffff",
      onAccent2: "#0a0a0a",
      danger: "#ff4d57",
      good: "#4ade80",
      warn: "#ffd23f",
      termBg: "#0a0a0a",
      termFg: "#ededed",
      pattern: "rgb(0 0 0 / 0.16)",
    },
    look: {
      display: "poster",
      cut: "persona",
      edge: "drop-shadow(3px 3px 0 #ffffff)",
      outline: "ink",
      pattern: "dots",
      tilt: -3,
      termCyan: "#6fd6f2",
    },
  },
  {
    id: "dark-hour",
    label: "Heure sombre",
    group: "persona",
    blurb: "Bleu nuit et cyan glacé, la lune pleine en fond (P3).",
    palette: {
      page: "radial-gradient(120% 90% at 80% 0%, #10306e 0%, #061230 55%, #030918 100%)",
      surface: "#071538",
      surface2: "#0e2453",
      line: "#1f3f80",
      fg: "#eaf5ff",
      muted: "#8fa9cf",
      accent: "#3fd0ff",
      onAccent: "#04112b",
      accent2: "#ffffff",
      onAccent2: "#04112b",
      danger: "#ff5d73",
      good: "#5ef0b0",
      warn: "#ffd75e",
      termBg: "#040d24",
      termFg: "#dcecff",
      pattern: "rgb(63 208 255 / 0.05)",
    },
    look: { display: "grotesk", italic: true, cut: "slant", outline: "glow", pattern: "grid" },
  },
  {
    id: "midnight-channel",
    label: "Chaîne de minuit",
    group: "persona",
    blurb: "Jaune télé, noir mat, un brouillard qui grésille (P4).",
    palette: {
      page: "#121212",
      surface: "#161616",
      surface2: "#222222",
      line: "#333333",
      fg: "#fff8dc",
      muted: "#b5ac8a",
      accent: "#ffd400",
      onAccent: "#121212",
      accent2: "#ff8a00",
      onAccent2: "#121212",
      danger: "#ff4f3d",
      good: "#9be564",
      warn: "#ff8a00",
      termBg: "#0e0e0e",
      termFg: "#f3ecd2",
      pattern: "rgb(255 212 0 / 0.05)",
    },
    look: {
      display: "poster",
      cut: "persona",
      edge: "drop-shadow(3px 3px 0 #ffd400)",
      outline: "ink",
      pattern: "stripes",
      tilt: -2,
    },
  },
  {
    id: "night-city",
    label: "Night City",
    group: "neon",
    blurb: "Jaune néon, cyan et magenta sur violet profond. Coins coupés.",
    palette: {
      page: "#0a0612",
      surface: "#120a1f",
      surface2: "#1d1131",
      line: "#3b1f5e",
      fg: "#f4f1ff",
      muted: "#a497bf",
      accent: "#fcee0a",
      onAccent: "#0a0612",
      accent2: "#00f0ff",
      onAccent2: "#0a0612",
      danger: "#ff2a6d",
      good: "#05ffa1",
      warn: "#ff9e00",
      termBg: "#0b0615",
      termFg: "#e9e4ff",
      pattern: "rgb(255 42 109 / 0.06)",
    },
    look: { display: "grotesk", cut: "chamfer", outline: "glow", pattern: "grid", termCyan: "#00f0ff" },
  },
  {
    id: "phosphor",
    label: "Phosphore",
    group: "neon",
    blurb: "Vert phosphore sur noir. Le terminal de film de hacker.",
    palette: {
      page: "#000000",
      surface: "#020a04",
      surface2: "#06160b",
      line: "#0f3d1c",
      fg: "#b8ffcb",
      muted: "#4f9a65",
      accent: "#00ff66",
      onAccent: "#001a08",
      accent2: "#b8ffcb",
      onAccent2: "#001a08",
      danger: "#ff3b3b",
      good: "#00ff66",
      warn: "#e6ff3b",
      termBg: "#010703",
      termFg: "#a8f5bc",
      pattern: "rgb(0 255 102 / 0.045)",
    },
    look: { display: "mono", cut: "none", outline: "glow", pattern: "scan" },
  },
  {
    id: "aqua",
    label: "Aqua",
    group: "os",
    blurb: "Terminal façon macOS : gris graphite, bleu système, coins arrondis.",
    palette: {
      page: "linear-gradient(160deg, #2b2b30 0%, #151517 100%)",
      surface: "#1e1e20",
      surface2: "#2c2c2f",
      line: "#3a3a3d",
      fg: "#f5f5f7",
      muted: "#a1a1a6",
      accent: "#0a84ff",
      onAccent: "#ffffff",
      accent2: "#f5f5f7",
      onAccent2: "#1e1e20",
      danger: "#ff453a",
      good: "#32d74b",
      warn: "#ffd60a",
      termBg: "#1a1a1c",
      termFg: "#e8e8ed",
      pattern: "transparent",
    },
    look: { display: "sans", cut: "none", outline: "none", radius: 12, pattern: "none", termCyan: "#64d2ff" },
  },
  {
    id: "aubergine",
    label: "Aubergine",
    group: "os",
    blurb: "Terminal façon Ubuntu : aubergine et orange.",
    palette: {
      page: "#2c001e",
      surface: "#300a24",
      surface2: "#41143a",
      line: "#5e2750",
      fg: "#ffffff",
      muted: "#c9a7c0",
      accent: "#e95420",
      onAccent: "#ffffff",
      accent2: "#ffffff",
      onAccent2: "#300a24",
      danger: "#ff6b6b",
      good: "#8ae234",
      warn: "#fce94f",
      termBg: "#300a24",
      termFg: "#eeeeec",
      pattern: "rgb(255 255 255 / 0.03)",
    },
    look: { display: "sans", cut: "none", outline: "none", radius: 6, pattern: "dots", termCyan: "#34e2e2" },
  },
  {
    id: "blue-shell",
    label: "Bleu PowerShell",
    group: "os",
    blurb: "Le bleu historique de PowerShell, texte clair et jaune vif.",
    palette: {
      page: "#011a3d",
      surface: "#012456",
      surface2: "#0b3470",
      line: "#22508f",
      fg: "#eeedf0",
      muted: "#9fb3d1",
      accent: "#f9f1a5",
      onAccent: "#012456",
      accent2: "#3a96dd",
      onAccent2: "#ffffff",
      danger: "#ff6b6b",
      good: "#16c60c",
      warn: "#f9f1a5",
      termBg: "#012456",
      termFg: "#eeedf0",
      pattern: "rgb(255 255 255 / 0.03)",
    },
    look: { display: "sans", cut: "none", outline: "none", radius: 4, pattern: "none", termCyan: "#61d6d6" },
  },
  {
    id: "arch",
    label: "Arch",
    group: "os",
    blurb: "Minimal, bleu Arch sur ardoise. Pour qui aime tout configurer.",
    palette: {
      page: "#0f1419",
      surface: "#121a21",
      surface2: "#1a2530",
      line: "#24323f",
      fg: "#d8dee9",
      muted: "#7f8c9b",
      accent: "#1793d1",
      onAccent: "#ffffff",
      accent2: "#d8dee9",
      onAccent2: "#0f1419",
      danger: "#bf616a",
      good: "#a3be8c",
      warn: "#ebcb8b",
      termBg: "#0d1217",
      termFg: "#d8dee9",
      pattern: "rgb(23 147 209 / 0.05)",
    },
    look: { display: "mono", cut: "none", outline: "none", radius: 2, pattern: "grid", termCyan: "#88c0d0" },
  },
  {
    id: "vapor",
    label: "Vapeur",
    group: "console",
    blurb: "Bibliothèque de jeux : bleu acier, bouton vert, cartes nettes.",
    palette: {
      page: "linear-gradient(180deg, #2a475e 0%, #1b2838 38%, #171d25 100%)",
      surface: "#16202d",
      surface2: "#1f2c3c",
      line: "#2a3f5a",
      fg: "#c7d5e0",
      muted: "#8f98a0",
      accent: "#66c0f4",
      onAccent: "#0e141b",
      accent2: "#a4d007",
      onAccent2: "#10180a",
      danger: "#e2563f",
      good: "#a4d007",
      warn: "#e5b143",
      termBg: "#10161f",
      termFg: "#c7d5e0",
      pattern: "transparent",
    },
    look: { display: "sans", cut: "none", outline: "none", radius: 3, pattern: "none" },
  },
  {
    id: "console",
    label: "Console",
    group: "console",
    blurb: "Menu de console de salon : bleu profond, typographie fine et espacée.",
    palette: {
      page: "radial-gradient(140% 100% at 50% 110%, #1d4fb8 0%, #08245e 40%, #020b22 100%)",
      surface: "#06173b",
      surface2: "#0d2559",
      line: "#24498f",
      fg: "#ffffff",
      muted: "#9db2d9",
      accent: "#ffffff",
      onAccent: "#06173b",
      accent2: "#4c9bff",
      onAccent2: "#ffffff",
      danger: "#ff5d6c",
      good: "#43e0a0",
      warn: "#ffd166",
      termBg: "#041030",
      termFg: "#e6eeff",
      pattern: "rgb(255 255 255 / 0.04)",
    },
    look: { display: "thin", cut: "none", outline: "none", radius: 16, pattern: "none", termCyan: "#7fb8ff" },
  },
];

export const DEFAULT_THEME = "seuil";

export function themeById(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export type Settings = {
  theme: string;
  /** Accent choisi par le joueur (null = celui du thème). */
  accent: string | null;
  /** Motif de fond (null = celui du thème). */
  pattern: Pattern | null;
  scanlines: boolean;
  fontSize: number;
};

export const DEFAULT_SETTINGS: Settings = {
  theme: DEFAULT_THEME,
  accent: null,
  pattern: null,
  scanlines: false,
  fontSize: 15,
};

export const ACCENT_SWATCHES = ["#d4f54a", "#ff2a33", "#3fd0ff", "#ffd400", "#ff2a6d", "#00ff66", "#0a84ff", "#e95420", "#b388ff", "#ffffff"];

export function isSettings(v: unknown): v is Settings {
  if (typeof v !== "object" || v === null) return false;
  const s = v as Record<string, unknown>;
  return (
    typeof s.theme === "string" &&
    (s.accent === null || typeof s.accent === "string") &&
    (s.pattern === null || typeof s.pattern === "string") &&
    typeof s.scanlines === "boolean" &&
    typeof s.fontSize === "number"
  );
}

/** Texte lisible (noir ou blanc) sur une couleur donnée. */
export function readableOn(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return "#0a0a0a";
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? "#0a0a0a" : "#ffffff";
}

const DISPLAY: Record<Look["display"], { family: string; weight: string; stretch: string; tracking: string }> = {
  grotesk: { family: "var(--ff-sans)", weight: "900", stretch: "118%", tracking: "-0.02em" },
  poster: { family: "var(--ff-display)", weight: "400", stretch: "100%", tracking: "0.03em" },
  mono: { family: "var(--ff-mono)", weight: "800", stretch: "100%", tracking: "-0.01em" },
  sans: { family: "var(--ff-sans)", weight: "800", stretch: "100%", tracking: "-0.01em" },
  thin: { family: "var(--ff-sans)", weight: "300", stretch: "112%", tracking: "0.12em" },
};

const CUTS: Record<NonNullable<Look["cut"]>, Record<string, string>> = {
  persona: {
    "--clip-tag": "polygon(6% 0, 100% 8%, 94% 100%, 0 90%)",
    "--clip-banner": "polygon(1.5% 4%, 100% 0, 97.5% 100%, 0 92%)",
    "--clip-panel": "polygon(0 1.5%, 100% 0, 99% 100%, 1% 98.5%)",
    "--clip-bubble-left": "polygon(6% 6%, 100% 0, 97% 100%, 4% 90%, 4% 60%, 0 48%, 5% 40%)",
    "--clip-bubble-right": "polygon(0 4%, 94% 0, 95% 38%, 100% 52%, 95% 62%, 96% 100%, 2% 94%)",
    "--bubble-pad": "2.25rem",
  },
  slant: {
    "--clip-tag": "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)",
    "--clip-banner": "none",
    "--clip-panel": "none",
    "--clip-bubble-left": "none",
    "--clip-bubble-right": "polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
    "--bubble-pad": "1.25rem",
  },
  chamfer: {
    "--clip-tag": "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
    "--clip-banner": "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
    "--clip-panel": "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px))",
    "--clip-bubble-left": "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
    "--clip-bubble-right": "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
    "--bubble-pad": "1.25rem",
  },
  none: {
    "--clip-tag": "none",
    "--clip-banner": "none",
    "--clip-panel": "none",
    "--clip-bubble-left": "none",
    "--clip-bubble-right": "none",
    "--bubble-pad": "1.25rem",
  },
};

const PATTERNS: Record<Pattern, (c: string) => { image: string; size: string }> = {
  stripes: (c) => ({
    image: `repeating-linear-gradient(-58deg, ${c} 0 38px, transparent 38px 76px)`,
    size: "auto",
  }),
  dots: (c) => ({ image: `radial-gradient(${c} 1.2px, transparent 1.4px)`, size: "9px 9px" }),
  grid: (c) => ({
    image: `linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`,
    size: "32px 32px",
  }),
  scan: (c) => ({ image: `repeating-linear-gradient(0deg, ${c} 0 1px, transparent 1px 3px)`, size: "auto" }),
  none: () => ({ image: "none", size: "auto" }),
};

/** Variables CSS d'un thème, avec les réglages du joueur. */
export function themeVars(theme: Theme, settings: Pick<Settings, "accent" | "pattern">): Record<string, string> {
  const p = theme.palette;
  const l = theme.look;
  const accent = settings.accent ?? p.accent;
  const onAccent = settings.accent ? readableOn(settings.accent) : p.onAccent;
  const d = DISPLAY[l.display];
  const pattern = PATTERNS[settings.pattern ?? l.pattern](p.pattern === "transparent" ? "rgb(255 255 255 / 0.03)" : p.pattern);
  const glow = `0 0 18px color-mix(in srgb, ${accent} 55%, transparent)`;
  return {
    "--page": p.page,
    "--surface": p.surface,
    "--surface-2": p.surface2,
    "--line": p.line,
    "--fg": p.fg,
    "--muted": p.muted,
    "--accent": accent,
    "--on-accent": onAccent,
    "--accent-2": p.accent2,
    "--on-accent-2": p.onAccent2,
    "--danger": p.danger,
    "--good": p.good,
    "--warn": p.warn,
    "--term-bg": p.termBg,
    "--display-family": d.family,
    "--display-weight": d.weight,
    "--display-stretch": d.stretch,
    "--display-tracking": d.tracking,
    "--display-style": l.italic ? "italic" : "normal",
    "--edge": l.edge ?? "none",
    "--outline":
      l.outline === "ink"
        ? "-2px -2px 0 #0a0a0a, 2px -2px 0 #0a0a0a, -2px 2px 0 #0a0a0a, 2px 2px 0 #0a0a0a, 4px 4px 0 #0a0a0a"
        : l.outline === "glow"
          ? glow
          : "none",
    "--radius": `${l.radius ?? 0}px`,
    "--tilt": `${l.tilt ?? 0}deg`,
    "--pattern-image": pattern.image,
    "--pattern-size": pattern.size,
    ...CUTS[l.cut ?? "none"],
  };
}

/** Palette xterm du thème. */
export function terminalTheme(theme: Theme, accent: string | null) {
  const p = theme.palette;
  const a = accent ?? p.accent;
  return {
    background: p.termBg,
    foreground: p.termFg,
    cursor: a,
    cursorAccent: p.termBg,
    selectionBackground: `${a}55`,
    black: p.termBg,
    red: p.danger,
    green: p.good,
    yellow: p.warn,
    blue: "#6fa8ff",
    magenta: "#e879f9",
    cyan: theme.look.termCyan ?? a,
    white: p.termFg,
    brightWhite: "#ffffff",
  };
}

/**
 * Script exécuté avant l'affichage : applique le thème enregistré pour
 * éviter un flash du thème par défaut.
 */
export function themeBootScript(): string {
  const all = Object.fromEntries(THEMES.map((t) => [t.id, themeVars(t, { accent: null, pattern: null })]));
  return `(function(){try{var T=${JSON.stringify(all)};var s=JSON.parse(localStorage.getItem("terminal-arcade.settings")||"null");if(!s||!T[s.theme])return;var v=T[s.theme],r=document.documentElement;for(var k in v)r.style.setProperty(k,v[k]);r.dataset.theme=s.theme;}catch(e){}})();`;
}
