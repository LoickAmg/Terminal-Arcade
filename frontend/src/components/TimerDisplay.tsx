"use client";

import { AnimatePresence, motion } from "motion/react";
import { TIMER_LABELS, formatTime, remainingRatio, zoneOf, type TimerState } from "@terminal-arcade/shared";

const ZONE_STYLE = {
  normal: "bg-ink text-paper",
  alerte: "bg-ink text-warn",
  critique: "bg-paper text-red",
  limite: "bg-paper text-red",
} as const;

// Le timer dans le bandeau : temps, mode, jauge, et le dernier gain ou la
// dernière perte de temps qui s'envole au-dessus.
export function TimerDisplay({
  timer,
  lastDelta,
}: {
  timer: TimerState;
  lastDelta: { ms: number; id: number } | null;
}) {
  const zone = zoneOf(timer);
  const ratio = remainingRatio(timer);
  const main =
    timer.mode === "chrono"
      ? `${formatTime(timer.valueMs)} / ${formatTime(timer.initialMs)}`
      : timer.mode === "buyback"
        ? `${formatTime(timer.valueMs)} → ${formatTime(timer.initialMs)}`
        : formatTime(timer.valueMs);
  const seconds = lastDelta ? Math.round(Math.abs(lastDelta.ms) / 1000) : 0;
  // Au chrono, une pénalité ajoute du temps : on l'affiche « +5 s » en rouge.
  const deltaText = !lastDelta
    ? ""
    : timer.mode === "chrono"
      ? `+${seconds} s`
      : `${lastDelta.ms > 0 ? "+" : "−"}${seconds} s`;
  const deltaGood = !!lastDelta && lastDelta.ms > 0;

  return (
    <div className="edge-ink relative" role="timer" aria-label={`${TIMER_LABELS[timer.mode]} : ${main}`}>
      <div className={`shape-tag px-3 pt-1 pb-1.5 ${ZONE_STYLE[zone]}`}>
        <p className="font-display text-xs tracking-widest opacity-80">
          ⏱ {TIMER_LABELS[timer.mode].toUpperCase()}
          {zone === "alerte" ? " · ALERTE" : zone === "critique" ? " · CRITIQUE" : ""}
        </p>
        <p className="font-display text-2xl leading-none tabular-nums sm:text-3xl">{main}</p>
        <div className="mt-1 h-1.5 w-full -skew-x-12 bg-neutral-700">
          <div
            className={`h-full ${zone === "normal" ? "bg-cyan" : zone === "alerte" ? "bg-warn" : "bg-red"}`}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
      </div>
      <AnimatePresence>
        {lastDelta && (
          <motion.span
            key={lastDelta.id}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -26, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className={`pointer-events-none absolute -top-1 right-2 font-display text-lg outlined ${
              deltaGood ? "text-good" : "text-red"
            }`}
          >
            {deltaText}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
