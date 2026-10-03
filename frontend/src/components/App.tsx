"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { EMPTY_PROGRESS, statusOf, type Level, type Progress } from "@terminal-arcade/shared";
import { DEFAULT_PET, isPetConfig, type PetConfig } from "@/lib/pet";
import { isObject, load, save } from "@/lib/storage";
import { DEFAULT_SETTINGS, THEMES, isSettings, terminalTheme, themeById, themeVars, type Settings } from "@/lib/themes";
import { Game } from "./Game";
import { Home } from "./Home";
import { Menu, type MenuAction } from "./Menu";

// Coquille du site : accueil → menu → jeu. Le jeu reste monté une fois
// ouvert (on peut revenir au menu sans perdre la partie en cours) ; il est
// seulement masqué.

type View = "home" | "menu" | "game";

const isProgress = (v: unknown): v is Progress => isObject(v) && isObject(v.levels) && isObject(v.xpByTree);

export function App({ levels }: { levels: Level[] }) {
  const [view, setView] = useState<View>("home");
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [pet, setPet] = useState<PetConfig>(DEFAULT_PET);
  const [gameOpened, setGameOpened] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [command, setCommand] = useState<{ text: string; id: number } | null>(null);
  const [menuIndex, setMenuIndex] = useState(0);

  // Lecture du stockage local au montage (absent du rendu serveur).
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- lecture unique du stockage local au montage */
    setSettings(load("settings", DEFAULT_SETTINGS, isSettings));
    setProgress(load("progress", EMPTY_PROGRESS, isProgress));
    setPet(load("pet", DEFAULT_PET, isPetConfig));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Application du thème : variables CSS sur <html>.
  useEffect(() => {
    const theme = themeById(settings.theme);
    const root = document.documentElement;
    for (const [k, v] of Object.entries(themeVars(theme, settings))) root.style.setProperty(k, v);
    root.dataset.theme = theme.id;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.palette.surface);
  }, [settings]);

  const changeSettings = useCallback((next: Settings) => {
    setSettings(next);
    save("settings", next);
  }, []);

  const openMenu = useCallback((index?: number) => {
    if (index !== undefined) setMenuIndex(index);
    // Le jeu a pu faire avancer la progression ou changer le compagnon.
    setProgress(load("progress", EMPTY_PROGRESS, isProgress));
    setPet(load("pet", DEFAULT_PET, isPetConfig));
    setView("menu");
  }, []);

  const onAction = useCallback((action: MenuAction) => {
    setGameOpened(true);
    setView("game");
    if (action.command) setCommand({ text: action.command, id: Date.now() });
  }, []);

  const reset = useCallback(() => {
    save("progress", EMPTY_PROGRESS);
    setProgress(EMPTY_PROGRESS);
    // Le jeu repart de zéro lui aussi.
    setGameKey((k) => k + 1);
    setGameOpened(false);
  }, []);

  const passed = levels.filter((l) => statusOf(l.id, progress) === "passed").length;
  const stats = {
    levels: levels.length,
    questions: levels.reduce((n, l) => n + l.questions.length, 0),
    variants: levels.reduce((n, l) => n + l.questions.filter((q) => q.variant).length, 0),
    passed,
    xp: Object.values(progress.xpByTree).reduce((a, b) => a + (b ?? 0), 0),
    petName: pet.name,
    petStyle: pet.style,
    themeLabel: themeById(settings.theme).label,
    themeCount: THEMES.length,
  };
  const term = useMemo(() => terminalTheme(themeById(settings.theme), settings.accent), [settings.theme, settings.accent]);

  return (
    <MotionConfig reducedMotion="user">
      {settings.scanlines && <div className="scanlines" aria-hidden />}
      <AnimatePresence mode="wait">
        {view === "home" && (
          <motion.div key="home" className="fixed inset-0 z-10 overflow-y-auto" exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Home stats={stats} onEnter={openMenu} />
          </motion.div>
        )}
        {view === "menu" && (
          <motion.div
            key="menu"
            className="fixed inset-0 z-10 overflow-y-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Menu
              key={menuIndex}
              initialIndex={menuIndex}
              levels={levels}
              progress={progress}
              pet={pet}
              settings={settings}
              onSettings={changeSettings}
              onAction={onAction}
              onBack={() => setView("home")}
              onReset={reset}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {gameOpened && (
        <div className={view === "game" ? "" : "hidden"}>
          <Game
            key={gameKey}
            levels={levels}
            visible={view === "game"}
            command={command}
            terminalTheme={term}
            fontSize={settings.fontSize}
            onMenu={() => openMenu()}
          />
        </div>
      )}
    </MotionConfig>
  );
}
