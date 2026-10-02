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

// Liste des niveaux, comme une bibliothèque de jeux : une carte par niveau,
// une étiquette de statut, une étiquette de palier et un « avatar » qui
// indique l'arbre de compétences. Les formes suivent le thème choisi.

export const TREE_STYLE: Record<Tree, { color: string; glyph: string }> = {
  file_system_ninja: { color: "#4ADE80", glyph: "FS" },
  data_surgeon: { color: "#A78BFA", glyph: "DS" },
  system_overlord: { color: "#3B82F6", glyph: "SO" },
  network_phantom: { color: "#F472B6", glyph: "NP" },
  git_gud: { color: "#F07818", glyph: "GG" },
  powershell: { color: "#E9C46A", glyph: "PS" },
};

const STATUS = {
  new: { label: "Nouveau", className: "border border-accent text-accent" },
  attempted: { label: "En cours", className: "border border-warn text-warn" },
  passed: { label: "Hacké", className: "bg-good text-[#0a0a0a]" },
  locked: { label: "Verrouillé", className: "border border-line text-muted" },
} as const;


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
      className="group edge block w-full text-left"
      aria-label={`Parcours ${track.label}, ${done} sur ${list.length} niveaux hackés`}
    >
      <div className="cut-banner flex items-center gap-3 border border-accent/60 bg-accent/10 py-3 pr-6 pl-3 transition-colors group-hover:bg-accent/20">
        <span
          className="cut-tag grid size-12 shrink-0 place-items-center font-mono text-sm font-bold text-[#0a0a0a]"
          style={{ background: style.color }}
        >
          {style.glyph}
        </span>
        <span className="min-w-0 flex-1">
          <span className="mb-1 flex flex-wrap items-center gap-2">
            <span className="type-label bg-accent px-2 py-0.5 text-on-accent">Parcours</span>
            <span className="type-label border border-line px-2 py-0.5 text-fg">
              {done}/{list.length} HACKÉS
            </span>
            {!open && (
              <span className="type-label border border-line px-2 py-0.5 text-muted">Verrouillé</span>
            )}
          </span>
          <span className="type-display block truncate text-2xl text-fg">{track.label}</span>
          <span className="block truncate text-sm text-muted">{track.hook}</span>
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
        <h2 className="type-display tilt text-4xl text-fg outlined">
          {track ? `Parcours ${TRACKS[track].label}` : "Missions"}
        </h2>
        {track && (
          <button type="button" onClick={() => onRun("ls missions/")} className="cut-tag border border-line bg-surface-2 px-3 py-1 font-mono text-sm font-bold text-fg hover:border-accent">
            <span className="block">← ls missions/</span>
          </button>
        )}
      </div>
      <ul className="flex flex-col gap-3 pr-2">
        {!track &&
          (Object.keys(TRACKS) as TrackId[]).map((id) => (
            <li key={id}>
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
              className="flex items-center gap-2"
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 26, delay: i * 0.05 }}
            >
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => onRun(`open ${level.id}`)}
                className="group edge block min-w-0 flex-1 text-left disabled:cursor-not-allowed"
                aria-label={`${level.title}, ${TIER_LABELS[level.tier]}, ${status.label}`}
              >
                <div
                  className={`cut-banner flex items-center gap-3 border border-line bg-surface-2/60 py-3 pr-6 pl-3 transition-colors group-enabled:group-hover:border-accent ${
                    unlocked ? "" : "*:opacity-45"
                  }`}
                >
                  <span
                    className="cut-tag grid size-12 shrink-0 place-items-center font-mono text-sm font-bold text-[#0a0a0a]"
                    style={{ background: tree.color }}
                    title={TREE_LABELS[level.tree]}
                  >
                    {tree.glyph}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="mb-1 flex flex-wrap items-center gap-2">
                      <span className={`type-label px-2 py-0.5 ${status.className}`}>
                        {status.label}
                      </span>
                      <span className="type-label border border-line px-2 py-0.5 text-muted">
                        {TIER_LABELS[level.tier]}
                      </span>
                      {(timed || timerDone) && (
                        <span className="type-label border border-warn px-2 py-0.5 text-warn">
                          {timed ? "⏱ Timer" : "⏱ ✓"}
                        </span>
                      )}
                      {(chaotic || chaosDone) && (
                        <span className="type-label border border-danger px-2 py-0.5 text-danger">
                          {chaotic ? "☠ Chaos" : "☠ ✓"}
                        </span>
                      )}
                    </span>
                    <span className="block truncate font-sans text-lg font-bold text-fg group-enabled:group-hover:text-accent">{level.title}</span>
                    <span className="block truncate text-sm text-muted">{level.hook}</span>
                  </span>
                </div>
              </button>
              {(replayTimer || replayChaos) && (
                <span className="flex shrink-0 flex-col gap-1.5">
                  {replayTimer && (
                    <button
                      type="button"
                      onClick={() => onRun(`open ${level.id} --timer`)}
                      className="edge"
                      aria-label={`Rejouer ${level.title} en Timer`}
                      title="Rejouer en Timer"
                    >
                      <span className="cut-tag grid size-10 place-items-center border border-warn text-lg text-warn hover:bg-warn hover:text-[#0a0a0a]">⏱</span>
                    </button>
                  )}
                  {replayChaos && (
                    <button
                      type="button"
                      onClick={() => onRun(`open ${level.id} --chaos`)}
                      className="edge"
                      aria-label={`Rejouer ${level.title} en Chaos`}
                      title="Rejouer en Chaos"
                    >
                      <span className="cut-tag grid size-10 place-items-center border border-danger text-lg text-danger hover:bg-danger hover:text-white">☠</span>
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
