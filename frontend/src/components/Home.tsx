"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

// Écran d'accueil : on n'entre pas dans le jeu sans y avoir été invité.
// Un cadre, un grand titre, une ligne d'amorce qui se tape toute seule,
// puis « Entrer » (touche Entrée ou clic n'importe où).

const BOOT = "chargement des missions… ok · sandbox prête · compagnon réveillé";

export function Home({
  levelCount,
  questionCount,
  passed,
  onEnter,
}: {
  levelCount: number;
  questionCount: number;
  passed: number;
  onEnter: () => void;
}) {
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (typed >= BOOT.length) return;
    const id = setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 500 : 22);
    return () => clearTimeout(id);
  }, [typed]);

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

  const rise = (delay: number) => ({
    initial: { y: 24, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { type: "spring" as const, stiffness: 220, damping: 26, delay },
  });

  return (
    <div className="grid min-h-dvh place-items-center p-4 sm:p-8" onClick={onEnter}>
      <motion.div
        initial={{ opacity: 0, rotate: -1.2, scale: 0.97 }}
        animate={{ opacity: 1, rotate: -0.4, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className="frame flex w-full max-w-6xl cursor-pointer flex-col overflow-hidden"
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-3 sm:px-8">
          <span className="type-label text-accent">Accueil</span>
          <span className="type-label hidden text-muted sm:inline">v1 · hors ligne prêt</span>
        </header>

        <div className="relative flex min-h-[min(62dvh,640px)] flex-col items-center justify-center overflow-hidden px-5 py-10 text-center sm:px-10">
          <span className="ring size-[min(78vw,460px)]" aria-hidden />
          <span className="ring size-[min(110vw,760px)] [animation-delay:-3s]" aria-hidden />

          <motion.p {...rise(0.15)} className="type-label relative text-accent">
            Jeu / Terminal / 2026
          </motion.p>
          <motion.h1
            {...rise(0.25)}
            className="type-display tilt relative mt-6 text-[clamp(2.6rem,min(11vw,13dvh),8.5rem)] text-fg outlined"
          >
            Terminal
          </motion.h1>
          <motion.p
            {...rise(0.35)}
            aria-hidden
            className="type-display hollow tilt relative text-[clamp(2.6rem,min(11vw,13dvh),8.5rem)]"
          >
            Arcade
          </motion.p>
          <motion.p {...rise(0.5)} className="relative mt-8 max-w-xl text-base text-muted sm:text-lg">
            Apprends le terminal en jouant. {levelCount} missions, {questionCount} défis, un vrai Linux et un
            compagnon qui triche.
            <br />
            <span className="text-fg">
              {passed > 0 ? `${passed} déjà hackée${passed > 1 ? "s" : ""}. On reprend ?` : "Le terminal est ouvert."}
            </span>
          </motion.p>
          <motion.p {...rise(0.6)} className="relative mt-8 font-mono text-xs text-muted sm:text-sm" aria-hidden>
            <span className="text-accent">$</span> {BOOT.slice(0, typed)}
            <span className="caret" />
          </motion.p>
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
    </div>
  );
}
