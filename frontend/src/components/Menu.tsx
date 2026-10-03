"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  TIERS,
  TIER_LABELS,
  TRACKS,
  TREE_LABELS,
  isUnlocked,
  mainLevels,
  statusOf,
  trackLevels,
  type Level,
  type Progress,
  type Tree,
} from "@terminal-arcade/shared";
import type { PetConfig } from "@/lib/pet";
import {
  ACCENT_SWATCHES,
  GROUP_LABELS,
  PATTERN_LABELS,
  THEMES,
  themeById,
  type Pattern,
  type Settings,
  type ThemeGroup,
} from "@/lib/themes";
import { PetSprite } from "./pet/PetSprite";
import { TREE_STYLE } from "./MissionBanners";

// Menu principal, à la manière d'un menu de console : une colonne de
// grandes entrées à gauche, le détail de l'entrée choisie à droite, les
// raccourcis en bas. Clavier (↑ ↓ Entrée Échap), souris et tactile.

export type MenuAction = { type: "play"; command?: string };

type ItemId = "play" | "missions" | "gitgud" | "pet" | "profile" | "look" | "options" | "help";

const ITEMS: { id: ItemId; label: string; hint: string }[] = [
  { id: "play", label: "Jouer", hint: "Reprendre là où tu t'es arrêté" },
  { id: "missions", label: "Missions", hint: "Tous les niveaux, par palier" },
  { id: "gitgud", label: "Git-Gud", hint: "Le parcours Git, de init à bisect" },
  { id: "pet", label: "Compagnon", hint: "Ton saboteur préféré" },
  { id: "profile", label: "Profil", hint: "XP et arbres de compétences" },
  { id: "look", label: "Apparence", hint: "Thèmes, couleurs, motifs" },
  { id: "options", label: "Réglages", hint: "Terminal, écran, sauvegarde" },
  { id: "help", label: "Aide", hint: "Comment on joue" },
];

export function Menu({
  initialIndex = 0,
  levels,
  progress,
  pet,
  settings,
  onSettings,
  onAction,
  onBack,
  onReset,
}: {
  initialIndex?: number;
  levels: Level[];
  progress: Progress;
  pet: PetConfig;
  settings: Settings;
  onSettings: (next: Settings) => void;
  onAction: (action: MenuAction) => void;
  onBack: () => void;
  onReset: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const item = ITEMS[index];
  const totalXp = Object.values(progress.xpByTree).reduce((a, b) => a + (b ?? 0), 0);
  const next = levels.find((l) => isUnlocked(l, levels, progress) && statusOf(l.id, progress) !== "passed");

  const activate = (id: ItemId) => {
    if (id === "play") onAction({ type: "play" });
    else if (id === "missions") onAction({ type: "play", command: "ls missions/" });
    else if (id === "gitgud") onAction({ type: "play", command: "ls missions/git-gud/" });
    else if (id === "pet") onAction({ type: "play", command: "pet" });
    else if (id === "profile") onAction({ type: "play", command: "whoami" });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Les champs du panneau (curseurs, couleurs) gardent leurs touches.
      const target = e.target as HTMLElement;
      if (target.closest("input, select, textarea")) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => (i + 1) % ITEMS.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => (i - 1 + ITEMS.length) % ITEMS.length);
      } else if (e.key === "Escape") {
        onBack();
      } else if (e.key === "Enter" && (target === document.body || target.hasAttribute("data-menu-list"))) {
        // Sur un bouton de la liste, Entrée déclenche déjà son clic.
        e.preventDefault();
        activate(ITEMS[index].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="grid min-h-dvh place-items-center p-3 sm:p-6 lg:p-8">
      <div className="frame flex h-[calc(100dvh-1.5rem)] w-full max-w-7xl flex-col overflow-hidden sm:h-[calc(100dvh-3rem)] lg:h-[min(820px,calc(100dvh-4rem))]">
        <header className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-8">
          <nav aria-label="Fil d'Ariane" className="type-label flex min-w-0 gap-2 truncate">
            <button type="button" onClick={onBack} className="text-muted hover:text-fg">
              Accueil
            </button>
            <span className="text-muted">/</span>
            <span className="text-muted">Menu</span>
            <span className="text-muted">/</span>
            <span className="truncate text-accent">{item.label}</span>
          </nav>
          <span className="type-label shrink-0 border border-accent/60 px-3 py-1.5 text-accent">{totalXp} XP</span>
        </header>

        <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-1">
          <ul
            data-menu-list
            role="listbox"
            aria-label="Menu principal"
            aria-activedescendant={`menu-${item.id}`}
            tabIndex={0}
            className="flex gap-1 overflow-x-auto border-b border-line px-3 py-3 focus:outline-none lg:flex-col lg:justify-center lg:gap-0 lg:overflow-visible lg:border-r lg:border-b-0 lg:px-8"
          >
            {ITEMS.map((it, i) => {
              const selected = i === index;
              return (
                <li key={it.id} id={`menu-${it.id}`} role="option" aria-selected={selected} className="shrink-0">
                  <button
                    type="button"
                    onMouseEnter={() => setIndex(i)}
                    onFocus={() => setIndex(i)}
                    onClick={() => (selected ? activate(it.id) : setIndex(i))}
                    onDoubleClick={() => activate(it.id)}
                    className="group relative flex w-full items-baseline gap-3 px-3 py-1.5 text-left lg:py-2"
                  >
                    {selected && (
                      <motion.span
                        layoutId="menu-cursor"
                        className="cut-tag absolute inset-0 bg-accent"
                        transition={{ type: "spring", stiffness: 500, damping: 38 }}
                      />
                    )}
                    <span
                      className={`type-label relative hidden w-6 lg:inline ${selected ? "text-on-accent" : "text-muted"}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`type-display tilt relative text-xl transition-colors sm:text-2xl lg:text-[2.6rem] ${
                        selected ? "text-on-accent" : "text-fg/80 group-hover:text-fg"
                      }`}
                    >
                      {it.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <section aria-live="polite" className="min-h-0 overflow-y-auto px-4 py-6 sm:px-8 lg:py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <div className="mb-6 flex items-center gap-4">
                  <span className="type-label text-accent">
                    {String(index + 1).padStart(2, "0")} / {item.hint}
                  </span>
                  <span className="h-px flex-1 bg-accent/40" />
                </div>
                <Detail
                  id={item.id}
                  levels={levels}
                  progress={progress}
                  pet={pet}
                  settings={settings}
                  next={next}
                  onSettings={onSettings}
                  onAction={onAction}
                  onActivate={() => activate(item.id)}
                  onReset={onReset}
                />
              </motion.div>
            </AnimatePresence>
          </section>
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-line px-4 py-3 sm:px-8">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onBack}
              className="cut-tag border border-line px-4 py-2 font-mono text-xs font-bold tracking-[0.2em] text-fg hover:border-accent"
            >
              ‹ RETOUR
            </button>
            <button
              type="button"
              onClick={() => onAction({ type: "play" })}
              className="cut-tag bg-accent px-4 py-2 font-mono text-xs font-bold tracking-[0.2em] text-on-accent"
            >
              TERMINAL ›
            </button>
          </div>
          <span className="type-label hidden text-right text-muted md:block">
            ↑ ↓ pour choisir · Entrée pour valider · Échap pour revenir
          </span>
        </footer>
      </div>
    </div>
  );
}

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cut-tag bg-accent px-5 py-2.5 font-mono text-sm font-bold tracking-[0.18em] text-on-accent transition-transform hover:-translate-y-0.5"
    >
      {children}
    </button>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return <h2 className="type-display tilt text-4xl text-fg outlined sm:text-6xl">{children}</h2>;
}

function Bar({ value, max, color }: { value: number; max: number; color?: string }) {
  return (
    <span className="block h-2 w-full overflow-hidden bg-surface-2">
      <motion.span
        className="block h-full"
        style={{ background: color ?? "var(--accent)" }}
        initial={{ width: 0 }}
        animate={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </span>
  );
}

function Detail({
  id,
  levels,
  progress,
  pet,
  settings,
  next,
  onSettings,
  onAction,
  onActivate,
  onReset,
}: {
  id: ItemId;
  levels: Level[];
  progress: Progress;
  pet: PetConfig;
  settings: Settings;
  next: Level | undefined;
  onSettings: (next: Settings) => void;
  onAction: (action: MenuAction) => void;
  onActivate: () => void;
  onReset: () => void;
}) {
  const passed = (list: Level[]) => list.filter((l) => statusOf(l.id, progress) === "passed").length;

  switch (id) {
    case "play":
      return (
        <div className="flex flex-col gap-6">
          <Title>{passed(levels) > 0 ? "On reprend" : "Premier pas"}</Title>
          <p className="max-w-xl text-lg text-muted">
            Tout se joue au clavier, dans un vrai terminal. Les boutons tapent la commande pour toi, pour que tu voies
            laquelle c&apos;est.
          </p>
          {next && (
            <div className="border border-line bg-surface-2/60 p-5">
              <p className="type-label text-accent">Prochaine mission</p>
              <p className="mt-2 text-2xl font-bold text-fg">{next.title}</p>
              <p className="mt-1 text-muted">{next.hook}</p>
              <p className="type-label mt-3 text-muted">
                {TIER_LABELS[next.tier]} · {TREE_LABELS[next.tree]} · {next.questions.length} questions
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {next && <PrimaryButton onClick={() => onAction({ type: "play", command: `open ${next.id}` })}>LANCER ›</PrimaryButton>}
            <button
              type="button"
              onClick={() => onAction({ type: "play" })}
              className="cut-tag border border-line px-5 py-2.5 font-mono text-sm font-bold tracking-[0.18em] text-fg hover:border-accent"
            >
              OUVRIR LE TERMINAL
            </button>
          </div>
        </div>
      );

    case "missions": {
      const main = mainLevels(levels);
      return (
        <div className="flex flex-col gap-6">
          <Title>Missions</Title>
          <p className="text-lg text-muted">
            {passed(main)}/{main.length} hackées. Chaque palier débloque le suivant ; un niveau réussi se rejoue en Timer
            ou en Chaos.
          </p>
          <ul className="flex flex-col gap-4">
            {TIERS.map((tier) => {
              const list = main.filter((l) => l.tier === tier);
              return (
                <li key={tier}>
                  <div className="mb-1.5 flex justify-between">
                    <span className="type-label text-fg">{TIER_LABELS[tier]}</span>
                    <span className="type-label text-muted">
                      {passed(list)}/{list.length}
                    </span>
                  </div>
                  <Bar value={passed(list)} max={list.length} />
                </li>
              );
            })}
          </ul>
          <div>
            <PrimaryButton onClick={onActivate}>VOIR LES MISSIONS ›</PrimaryButton>
          </div>
        </div>
      );
    }

    case "gitgud": {
      const list = trackLevels(levels, "git-gud");
      return (
        <div className="flex flex-col gap-6">
          <Title>{TRACKS["git-gud"].label}</Title>
          <p className="text-lg text-muted">{TRACKS["git-gud"].hook}</p>
          <ol className="flex flex-col gap-2">
            {list.map((l, i) => {
              const status = statusOf(l.id, progress);
              const open = isUnlocked(l, levels, progress);
              return (
                <li key={l.id} className={`flex items-center gap-3 border-b border-line pb-2 ${open ? "" : "opacity-45"}`}>
                  <span className="type-label w-6 text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 font-bold text-fg">{l.title}</span>
                  <span className={`type-label ${status === "passed" ? "text-good" : open ? "text-accent" : "text-muted"}`}>
                    {status === "passed" ? "hacké" : open ? "ouvert" : "verrouillé"}
                  </span>
                </li>
              );
            })}
          </ol>
          <div>
            <PrimaryButton onClick={onActivate}>OUVRIR LE PARCOURS ›</PrimaryButton>
          </div>
        </div>
      );
    }

    case "pet":
      return (
        <div className="flex flex-col gap-6">
          <div className="flex items-end gap-6">
            <div className="grid place-items-center border border-line bg-surface-2 p-4">
              <PetSprite config={pet} size={112} title={`Aperçu de ${pet.name}`} />
            </div>
            <Title>{pet.name}</Title>
          </div>
          <p className="max-w-xl text-lg text-muted">
            Il commente tes réponses, t&apos;encourage… et en mode Chaos, il sabote : faux verdicts, touche bloquée,
            terminal fermé. Tu peux le renommer, changer sa forme, sa couleur et son style (pixel ou Persona).
          </p>
          <div>
            <PrimaryButton onClick={onActivate}>PERSONNALISER ›</PrimaryButton>
          </div>
        </div>
      );

    case "profile": {
      const entries = Object.entries(progress.xpByTree) as [Tree, number][];
      const max = Math.max(1, ...entries.map(([, xp]) => xp));
      const total = entries.reduce((a, [, xp]) => a + xp, 0);
      return (
        <div className="flex flex-col gap-6">
          <Title>{total} XP</Title>
          <p className="text-lg text-muted">
            {passed(levels)}/{levels.length} niveaux hackés.
          </p>
          {entries.length === 0 ? (
            <p className="text-muted">Pas encore d&apos;XP. Ta première mission t&apos;attend.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {entries.map(([tree, xp]) => (
                <li key={tree}>
                  <div className="mb-1.5 flex justify-between">
                    <span className="type-label text-fg">{TREE_LABELS[tree]}</span>
                    <span className="type-label text-muted">{xp} XP</span>
                  </div>
                  <Bar value={xp} max={max} color={TREE_STYLE[tree].color} />
                </li>
              ))}
            </ul>
          )}
          <div>
            <PrimaryButton onClick={onActivate}>WHOAMI ›</PrimaryButton>
          </div>
        </div>
      );
    }

    case "look":
      return <LookPanel settings={settings} onSettings={onSettings} />;

    case "options":
      return <OptionsPanel settings={settings} onSettings={onSettings} onReset={onReset} />;

    default:
      return (
        <div className="flex flex-col gap-6">
          <Title>Comment on joue</Title>
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
            {[
              ["ls missions/", "la liste des niveaux"],
              ["open <id>", "lance un niveau (--timer, --chaos pour rejouer)"],
              ["hint · skip", "un indice (coûte du temps), passer la question"],
              ["submit <réponse>", "dans un vrai Linux, envoie une réponse ou un flag"],
              ["verify · clock", "en Chaos, vérifier un verdict ou le vrai temps"],
              ["pet", "le compagnon"],
              ["help", "toutes les commandes"],
            ].map(([cmd, text]) => (
              <div key={cmd} className="contents">
                <dt className="font-mono text-accent">{cmd}</dt>
                <dd className="text-muted">{text}</dd>
              </div>
            ))}
          </dl>
          <p className="text-muted">
            Trois paliers (Script Kiddie, SysAdmin, Root Wizard), six arbres. Les niveaux « vrai Linux » tournent dans un
            conteneur isolé, sans accès à Internet.
          </p>
          <p className="type-label text-muted">Conçu par Mahouna · 2026</p>
        </div>
      );
  }
}

function LookPanel({ settings, onSettings }: { settings: Settings; onSettings: (next: Settings) => void }) {
  const current = themeById(settings.theme);
  const groups = Object.keys(GROUP_LABELS) as ThemeGroup[];
  return (
    <div className="flex flex-col gap-7">
      <Title>{current.label}</Title>
      <p className="-mt-3 text-muted">{current.blurb}</p>

      {groups.map((group) => (
        <fieldset key={group}>
          <legend className="type-label mb-2 text-muted">{GROUP_LABELS[group]}</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {THEMES.filter((t) => t.group === group).map((t) => {
              const selected = t.id === settings.theme;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSettings({ ...settings, theme: t.id, accent: null, pattern: null })}
                  className={`flex items-center gap-3 border p-2.5 text-left transition-colors ${
                    selected ? "border-accent bg-surface-2" : "border-line hover:border-fg/40"
                  }`}
                >
                  <span
                    className="relative grid size-9 shrink-0 place-items-center overflow-hidden border border-black/30"
                    style={{ background: t.palette.page }}
                    aria-hidden
                  >
                    <span className="absolute inset-x-1.5 bottom-1.5 top-3" style={{ background: t.palette.surface }} />
                    <span className="absolute right-1 top-1 size-2.5" style={{ background: t.palette.accent }} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold text-fg">{t.label}</span>
                    {selected && <span className="type-label text-accent">actif</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <fieldset>
        <legend className="type-label mb-2 text-muted">Couleur d&apos;accent</legend>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onSettings({ ...settings, accent: null })}
            aria-pressed={settings.accent === null}
            className={`type-label border px-3 py-2 ${settings.accent === null ? "border-accent text-accent" : "border-line text-muted"}`}
          >
            Du thème
          </button>
          {ACCENT_SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Accent ${c}`}
              aria-pressed={settings.accent === c}
              onClick={() => onSettings({ ...settings, accent: c })}
              className={`size-8 border-2 ${settings.accent === c ? "border-fg" : "border-transparent"}`}
              style={{ background: c }}
            />
          ))}
          <label className="type-label flex items-center gap-2 border border-line px-2 py-1 text-muted">
            Libre
            <input
              type="color"
              value={settings.accent ?? current.palette.accent}
              onChange={(e) => onSettings({ ...settings, accent: e.target.value })}
              className="size-6 cursor-pointer bg-transparent"
            />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="type-label mb-2 text-muted">Motif de fond</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PATTERN_LABELS) as Pattern[]).map((p) => {
            const selected = (settings.pattern ?? current.look.pattern) === p;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={selected}
                onClick={() => onSettings({ ...settings, pattern: p })}
                className={`type-label border px-3 py-2 ${selected ? "border-accent text-accent" : "border-line text-muted hover:text-fg"}`}
              >
                {PATTERN_LABELS[p]}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-line py-3">
      <span className="font-bold text-fg">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden
        className="relative h-6 w-11 shrink-0 border border-line bg-surface-2 transition-colors peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-accent after:absolute after:top-0.5 after:left-0.5 after:size-4.5 after:bg-fg after:transition-transform peer-checked:after:translate-x-5 peer-checked:after:bg-on-accent"
      />
    </label>
  );
}

function OptionsPanel({
  settings,
  onSettings,
  onReset,
}: {
  settings: Settings;
  onSettings: (next: Settings) => void;
  onReset: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <Title>Réglages</Title>
      <div>
        <label htmlFor="font-size" className="flex justify-between">
          <span className="font-bold text-fg">Taille du texte du terminal</span>
          <span className="type-label text-accent">{settings.fontSize} px</span>
        </label>
        <input
          id="font-size"
          type="range"
          min={12}
          max={20}
          value={settings.fontSize}
          onChange={(e) => onSettings({ ...settings, fontSize: Number(e.target.value) })}
          className="mt-3 w-full accent-[var(--accent)]"
        />
        <p className="mt-2 font-mono text-sm text-muted" style={{ fontSize: settings.fontSize }}>
          agent@arcade:~$ ls missions/
        </p>
      </div>
      <div>
        <Toggle
          label="Lignes de balayage (écran cathodique)"
          checked={settings.scanlines}
          onChange={(v) => onSettings({ ...settings, scanlines: v })}
        />
      </div>
      <div className="border border-danger/50 p-4">
        <p className="font-bold text-fg">Recommencer de zéro</p>
        <p className="mt-1 text-sm text-muted">Efface la progression et l&apos;XP de ce navigateur. Le compagnon et le thème restent.</p>
        {confirm ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                onReset();
                setConfirm(false);
              }}
              className="cut-tag bg-danger px-4 py-2 font-mono text-xs font-bold tracking-[0.18em] text-white"
            >
              OUI, TOUT EFFACER
            </button>
            <button
              type="button"
              onClick={() => setConfirm(false)}
              className="cut-tag border border-line px-4 py-2 font-mono text-xs font-bold tracking-[0.18em] text-fg"
            >
              ANNULER
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirm(true)}
            className="cut-tag mt-3 border border-danger px-4 py-2 font-mono text-xs font-bold tracking-[0.18em] text-danger"
          >
            EFFACER LA PROGRESSION
          </button>
        )}
      </div>
    </div>
  );
}
