"use client";

import { motion } from "motion/react";
import {
  TIER_LABELS,
  TRACKS,
  TREE_LABELS,
  canReplayChaos,
  mainLevels,
  trackLevels,
  type TrackId,
  canReplayTimer,
  isChaos,
  isTimed,
  isUnlocked,
  nativeMode,
  passedModes,
  statusOf,
  type Level,
  type Progress,
  type Tree,
} from "@terminal-arcade/shared";

// Liste des niveaux, inspirée de la liste de messages non lus : des
// bannières noires de travers, une étiquette de statut, une étiquette de
// palier et un « avatar » qui indique l'arbre de compétences.

export const TREE_STYLE: Record<Tree, { color: string; glyph: string }> = {
  file_system_ninja: { color: "#4ADE80", glyph: "FS" },
  data_surgeon: { color: "#A78BFA", glyph: "DS" },
  system_overlord: { color: "#3B82F6", glyph: "SO" },
  network_phantom: { color: "#F472B6", glyph: "NP" },
  git_gud: { color: "#F07818", glyph: "GG" },
  powershell: { color: "#E9C46A", glyph: "PS" },
};

const STATUS = {
  new: { label: "NEW", className: "bg-cyan text-red" },
  attempted: { label: "EN COURS", className: "bg-warn text-ink" },
  passed: { label: "HACKÉ", className: "bg-good text-ink" },
  locked: { label: "VERROUILLÉ", className: "bg-neutral-500 text-ink" },
} as const;

// Décalages irréguliers, comme les messages empilés de la référence.
const OFFSETS = ["ml-2", "ml-6", "ml-0", "ml-4", "ml-8", "ml-1"];

/** Entrée d'un parcours dans la liste principale : une bannière à part. */
function TrackBanner({
  id,
  levels,
  progress,
  onRun,
}: {
  id: TrackId;
  levels: Level[];
  progress: Progress;
  onRun: (command: string) => void;
}) {
  const track = TRACKS[id];
  const list = trackLevels(levels, id);
  const done = list.filter((l) => statusOf(l.id, progress) === "passed").length;
  const open = list.some((l) => isUnlocked(l, levels, progress));
  const style = TREE_STYLE[track.tree];
  return (
    <button
      type="button"
      onClick={() => onRun(`ls missions/${id}/`)}
      className="group edge-ink block w-full text-left"
      aria-label={`Parcours ${track.label}, ${done} sur ${list.length} niveaux hackés`}
    >
      <div className="shape-banner flex items-center gap-3 bg-paper py-3 pr-6 pl-3 transition-transform group-hover:translate-x-1">
        <span
          className="grid size-12 shrink-0 rotate-3 place-items-center border-2 border-ink font-display text-xl text-ink"
          style={{ background: style.color }}
        >
          {style.glyph}
        </span>
        <span className="min-w-0 flex-1">
          <span className="mb-1 flex flex-wrap items-center gap-2">
            <span className="shape-tag bg-ink px-2 font-display text-sm tracking-wide text-warn">PARCOURS</span>
            <span className="shape-tag border border-ink px-2 font-display text-sm tracking-wide text-ink">
              {done}/{list.length} HACKÉS
            </span>
            {!open && (
              <span className="shape-tag bg-neutral-400 px-2 font-display text-sm tracking-wide text-ink">VERROUILLÉ</span>
            )}
          </span>
          <span className="block truncate font-display text-2xl tracking-wide text-ink">{track.label.toUpperCase()}</span>
          <span className="block truncate text-sm text-neutral-700">{track.hook}</span>
        </span>
      </div>
    </button>
  );
}

export function MissionBanners({
  levels,
  progress,
  track,
  onRun,
}: {
  levels: Level[];
  progress: Progress;
  track?: TrackId;
  onRun: (command: string) => void;
}) {
  const shown = track ? trackLevels(levels, track) : mainLevels(levels);
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <h2 className="font-display text-3xl tracking-wide outlined">
          {track ? `PARCOURS ${TRACKS[track].label.toUpperCase()}` : "MISSIONS"}
        </h2>
        {track && (
          <button type="button" onClick={() => onRun("ls missions/")} className="edge-ink">
            <span className="shape-tag block bg-paper px-3 py-1 font-mono text-sm font-bold text-ink">← ls missions/</span>
          </button>
        )}
      </div>
      <ul className="flex flex-col gap-3 pr-2">
        {!track &&
          (Object.keys(TRACKS) as TrackId[]).map((id) => (
            <li key={id} className="ml-3">
              <TrackBanner id={id} levels={levels} progress={progress} onRun={onRun} />
            </li>
          ))}
        {shown.map((level, i) => {
          const unlocked = isUnlocked(level, levels, progress);
          const status = STATUS[unlocked ? statusOf(level.id, progress) : "locked"];
          const tree = TREE_STYLE[level.tree];
          const native = nativeMode(level);
          const timed = isTimed(native);
          const chaotic = isChaos(native);
          const replayTimer = canReplayTimer(level, progress);
          const replayChaos = canReplayChaos(level, progress);
          const done = passedModes(level.id, progress);
          const timerDone = !timed && done.some(isTimed);
          const chaosDone = !chaotic && done.some(isChaos);
          return (
            <motion.li
              key={level.id}
              className={`flex items-center gap-2 ${OFFSETS[i % OFFSETS.length]}`}
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 26, delay: i * 0.05 }}
            >
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => onRun(`open ${level.id}`)}
                className="group edge-white block min-w-0 flex-1 text-left disabled:cursor-not-allowed"
                aria-label={`${level.title}, ${TIER_LABELS[level.tier]}, ${status.label}`}
              >
                <div
                  className={`shape-banner flex items-center gap-3 bg-ink py-3 pr-6 pl-3 transition-transform group-enabled:group-hover:translate-x-1 ${
                    unlocked ? "" : "*:opacity-45"
                  }`}
                >
                  <span
                    className="grid size-12 shrink-0 -rotate-3 place-items-center border-2 border-paper font-display text-xl text-ink"
                    style={{ background: tree.color }}
                    title={TREE_LABELS[level.tree]}
                  >
                    {tree.glyph}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="mb-1 flex flex-wrap items-center gap-2">
                      <span className={`shape-tag px-2 font-display text-sm tracking-wide ${status.className}`}>
                        {status.label}
                      </span>
                      <span className="shape-tag border border-cyan px-2 font-display text-sm tracking-wide text-cyan">
                        {TIER_LABELS[level.tier].toUpperCase()}
                      </span>
                      {(timed || timerDone) && (
                        <span className="shape-tag bg-warn px-2 font-display text-sm tracking-wide text-ink">
                          {timed ? "⏱ TIMER" : "⏱ ✓"}
                        </span>
                      )}
                      {(chaotic || chaosDone) && (
                        <span className="shape-tag bg-paper px-2 font-display text-sm tracking-wide text-red">
                          {chaotic ? "☠ CHAOS" : "☠ ✓"}
                        </span>
                      )}
                    </span>
                    <span className="block truncate font-sans text-lg font-bold text-cyan">{level.title}</span>
                    <span className="block truncate text-sm text-neutral-300">{level.hook}</span>
                  </span>
                </div>
              </button>
              {(replayTimer || replayChaos) && (
                <span className="flex shrink-0 flex-col gap-1.5">
                  {replayTimer && (
                    <button
                      type="button"
                      onClick={() => onRun(`open ${level.id} --timer`)}
                      className="edge-ink"
                      aria-label={`Rejouer ${level.title} en Timer`}
                      title="Rejouer en Timer"
                    >
                      <span className="shape-tag grid size-10 place-items-center bg-warn font-display text-lg text-ink">⏱</span>
                    </button>
                  )}
                  {replayChaos && (
                    <button
                      type="button"
                      onClick={() => onRun(`open ${level.id} --chaos`)}
                      className="edge-ink"
                      aria-label={`Rejouer ${level.title} en Chaos`}
                      title="Rejouer en Chaos"
                    >
                      <span className="shape-tag grid size-10 place-items-center bg-paper font-display text-lg text-red">☠</span>
                    </button>
                  )}
                </span>
              )}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
