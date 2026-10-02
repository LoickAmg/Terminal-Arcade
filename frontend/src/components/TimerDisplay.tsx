"use client";

import { AnimatePresence, motion } from "motion/react";
import { TIMER_LABELS, formatTime, remainingRatio, zoneOf, type TimerState } from "@terminal-arcade/shared";

const ZONE_STYLE = {
  normal: { box: "border-line text-fg", bar: "bg-accent" },
  alerte: { box: "border-warn text-warn", bar: "bg-warn" },
  critique: { box: "border-danger bg-danger/15 text-danger", bar: "bg-danger" },
  limite: { box: "border-danger bg-danger/25 text-danger", bar: "bg-danger" },
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
  const style = ZONE_STYLE[zone];

  return (
    <div className="relative shrink-0" role="timer" aria-label={`${TIMER_LABELS[timer.mode]} : ${main}`}>
      <div className={`flex items-center gap-3 border px-3 py-1 ${style.box}`}>
        <span className="type-label hidden opacity-80 sm:inline">
          {TIMER_LABELS[timer.mode]}
          {zone === "alerte" ? " · alerte" : zone === "critique" ? " · critique" : ""}
        </span>
        <span className="font-mono text-lg font-bold tabular-nums">{main}</span>
      </div>
      <div className="h-0.5 w-full bg-surface-2">
        <div className={`h-full ${style.bar}`} style={{ width: `${ratio * 100}%` }} />
      </div>
      <AnimatePresence>
        {lastDelta && (
          <motion.span
            key={lastDelta.id}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 26, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className={`pointer-events-none absolute top-full right-2 font-mono text-sm font-bold ${
              deltaGood ? "text-good" : "text-danger"
            }`}
          >
            {deltaText}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
