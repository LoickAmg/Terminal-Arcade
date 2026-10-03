"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { HERO_ART } from "@/lib/heroArt";

// Écran d'accueil, façon bureau : une barre d'état en haut, un dock en bas,
// et au centre une fenêtre de terminal qui vient d'afficher un « neofetch »
// du jeu : le dessin braille à gauche, la fiche du jeu à droite, puis
// l'invite. On n'entre qu'en le demandant (Entrée, clic ou dock).

export type HomeStats = {
  levels: number;
  questions: number;
  variants: number;
  passed: number;
  xp: number;
  petName: string;
  petStyle: "pixel" | "persona";
  themeLabel: string;
  themeCount: number;
};

/** Raccourcis du dock : l'entrée du menu à ouvrir. */
const DOCK: { label: string; glyph: string; menu: number }[] = [
  { label: "Jouer", glyph: "▶", menu: 0 },
  { label: "Missions", glyph: "☰", menu: 1 },
  { label: "Git-Gud", glyph: "⎇", menu: 2 },
  { label: "Compagnon", glyph: "◕", menu: 3 },
  { label: "Apparence", glyph: "◐", menu: 5 },
  { label: "Aide", glyph: "?", menu: 7 },
];

// Position des 8 points d'un caractère braille : (colonne, ligne, bit).
const DOTS: [number, number, number][] = [
  [0, 0, 0], [0, 1, 1], [0, 2, 2], [1, 0, 3], [1, 1, 4], [1, 2, 5], [0, 3, 6], [1, 3, 7],
];
const CELL_W = 11;
const CELL_H = 22;
const DOT_Y = [3, 7, 12, 16];

/** Une ligne de braille devient un chemin SVG : un petit carré par point. */
function rowPath(line: string, row: number): string {
  let d = "";
  Array.from(line).forEach((ch, col) => {
    const bits = ch.codePointAt(0)! - 0x2800;
    for (const [cx, cy, bit] of DOTS) {
      if ((bits >> bit) & 1) d += `M${col * CELL_W + 3 + cx * 5} ${row * CELL_H + DOT_Y[cy]}h3v3h-3z`;
    }
  });
  return d;
}

function HeroArt() {
  const rows = useMemo(() => HERO_ART.map(rowPath), []);
  const cols = Math.max(...HERO_ART.map((l) => Array.from(l).length));
  return (
    <svg
      viewBox={`0 0 ${cols * CELL_W} ${HERO_ART.length * CELL_H}`}
      className="mx-auto h-auto max-h-[34dvh] w-full lg:max-h-[56dvh]"
      role="img"
      aria-label="Dessin en points braille : une joueuse derrière son ordinateur"
    >
      {rows.map((d, i) => (
        // Les lignes apparaissent l'une après l'autre, comme une sortie de terminal.
        <path key={i} d={d} className="print-line fill-accent" style={{ animationDelay: `${120 + i * 28}ms` }} />
      ))}
    </svg>
  );
}

function formatUptime(seconds: number): string {
  if (seconds < 60) return `${seconds} s`;
  const m = Math.floor(seconds / 60);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
}

/** Heure courante, lue côté client seulement (le rendu serveur n'en a pas). */
function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return now;
}

export function Home({ stats, onEnter }: { stats: HomeStats; onEnter: (menu?: number) => void }) {
  const now = useNow();
  const [openedAt] = useState(() => Date.now());

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onEnter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onEnter]);

  const time = now?.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) ?? "--:--";
  const date = now?.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short" }) ?? "";
  const uptime = now ? formatUptime(Math.max(0, Math.round((now.getTime() - openedAt) / 1000))) : "0 s";
  const percent = stats.levels ? Math.round((stats.passed / stats.levels) * 100) : 0;

  const info: [string, string][] = [
    ["Jeu", "Terminal Arcade 1.0 (web)"],
    ["Missions", `${stats.levels} · 3 paliers · 6 arbres`],
    ["Défis", `${stats.questions} questions · ${stats.variants} variantes`],
    ["Sandbox", "Debian 12 · isolée, sans réseau"],
    ["Shells", "bash 5.2 · PowerShell 7"],
    ["Compagnon", `${stats.petName} (${stats.petStyle === "pixel" ? "pixel art" : "façon Persona"})`],
    ["Thème", `${stats.themeLabel} [${stats.themeCount} thèmes]`],
    ["Polices", "Archivo · JetBrains Mono"],
    ["Progression", `${stats.passed}/${stats.levels} hackées (${percent} %)`],
    ["XP", String(stats.xp)],
    ["Session", uptime],
    ["Langue", "fr_FR.UTF-8"],
  ];

  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* Arrière-plan du « bureau » : une lueur derrière la fenêtre et un grand mot fantôme. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="desk-glow absolute top-1/2 left-1/2 size-[110vmax] -translate-x-1/2 -translate-y-1/2" />
        <p className="type-display absolute -bottom-[3vw] left-1/2 -translate-x-1/2 text-[22vw] whitespace-nowrap text-fg opacity-[0.03]">
          Arcade
        </p>
      </div>

      {/* Barre d'état du bureau. */}
      <header className="flex h-9 shrink-0 items-center justify-between border-b border-line/60 bg-surface/70 px-4 font-mono text-xs text-muted backdrop-blur-sm">
        <span className="flex items-center gap-3">
          <span className="text-accent" aria-hidden>
            ⠿
          </span>
          <span className="text-fg">1</span>
          <span className="hidden sm:inline">Terminal Arcade</span>
        </span>
        <span className="font-bold text-fg capitalize">
          {date} {time}
        </span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-good" aria-hidden />
          <span className="hidden sm:inline">hors ligne prêt</span>
        </span>
      </header>

      <main className="grid flex-1 place-items-center px-3 py-5 sm:px-8" onClick={() => onEnter()}>
        <motion.div
          initial={{ opacity: 0, rotate: -1.2, scale: 0.97 }}
          animate={{ opacity: 1, rotate: -0.4, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="frame flex w-full max-w-6xl cursor-pointer flex-col overflow-hidden shadow-[0_40px_120px_-30px_rgb(0_0_0/0.85)]"
        >
          {/* Barre de titre de la fenêtre. */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-line px-5 py-2.5 sm:px-8">
            <span className="type-label text-accent">Accueil</span>
            <span className="truncate font-sans text-sm font-black text-fg italic sm:text-base">
              joueur@terminal-arcade:~
            </span>
            <span className="flex justify-end gap-2" aria-hidden>
              <span className="size-3 rounded-full bg-warn" />
              <span className="size-3 rounded-full bg-good" />
              <span className="size-3 rounded-full bg-danger" />
            </span>
          </div>

          <div className="grid items-center gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10 lg:py-8">
            <HeroArt />

            <div className="min-w-0 font-mono text-[13px] leading-[1.7] sm:text-sm">
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
              >
                <h1 className="type-display tilt text-[clamp(2.2rem,5vw,4rem)] text-fg outlined">Terminal</h1>
                <p aria-hidden className="type-display hollow tilt text-[clamp(2.2rem,5vw,4rem)]">
                  Arcade
                </p>
              </motion.div>

              <p className="mt-5">
                <span className="font-bold text-accent">joueur</span>
                <span className="text-fg">@</span>
                <span className="font-bold text-accent">terminal-arcade</span>
              </p>
              <p className="text-muted" aria-hidden>
                ----------------------
              </p>
              <dl>
                {info.map(([k, v], i) => (
                  <motion.div
                    key={k}
                    className="flex gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                  >
                    <dt className="shrink-0 font-bold text-accent">{k}:</dt>
                    <dd className="truncate text-fg">{v}</dd>
                  </motion.div>
                ))}
              </dl>
              <div className="mt-4 flex" aria-hidden>
                {["bg-surface-2", "bg-danger", "bg-accent", "bg-warn", "bg-accent-2", "bg-good", "bg-muted", "bg-fg"].map(
                  (c) => (
                    <span key={c} className={`h-7 w-7 sm:h-8 sm:w-8 ${c}`} />
                  ),
                )}
              </div>
            </div>
          </div>

          {/* L'invite, avec ses segments fléchés. */}
          <div className="flex items-center px-5 pb-5 font-mono text-sm sm:px-8" aria-hidden>
            <span className="seg-first bg-accent py-0.5 pr-4 pl-3 font-bold text-on-accent">joueur</span>
            <span className="seg bg-surface-2 py-0.5 pr-4 pl-5 text-fg">~</span>
            <span className="seg bg-accent-2 py-0.5 pr-4 pl-5 text-on-accent-2">♡ {time}</span>
            <span className="ml-3 text-fg">
              ./entrer
              <span className="caret" />
            </span>
          </div>

          <footer className="flex items-center justify-between gap-4 border-t border-line px-5 py-4 sm:px-8">
            <button
              type="button"
              autoFocus
              onClick={(e) => {
                e.stopPropagation();
                onEnter();
              }}
              className="cut-tag bg-accent px-5 py-2 font-mono text-sm font-bold tracking-[0.2em] text-on-accent transition-transform hover:-translate-y-0.5"
            >
              ENTRER
            </button>
            <span className="type-label hidden text-right text-muted sm:block">Entrée, ou cliquez n&apos;importe où</span>
          </footer>
        </motion.div>
      </main>

      {/* Dock : raccourcis vers les entrées du menu. */}
      <nav aria-label="Raccourcis" className="flex shrink-0 justify-center pb-4">
        <ul className="flex gap-2 rounded-2xl border border-line/70 bg-surface/80 p-2 backdrop-blur-md">
          {DOCK.map((d) => (
            <li key={d.label}>
              <button
                type="button"
                onClick={() => onEnter(d.menu)}
                title={d.label}
                aria-label={d.label}
                className="group relative grid size-11 place-items-center rounded-xl bg-surface-2 text-lg text-fg transition-transform hover:-translate-y-1.5 hover:bg-accent hover:text-on-accent"
              >
                {d.glyph}
                <span className="type-label pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-surface px-2 py-1 whitespace-nowrap text-fg opacity-0 transition-opacity group-hover:opacity-100">
                  {d.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
