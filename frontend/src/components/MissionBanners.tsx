"use client";

import { motion } from "motion/react";
import {
  TIER_LABELS,
  TREE_LABELS,
  isUnlocked,
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

export function MissionBanners({
  levels,
  progress,
  onRun,
}: {
  levels: Level[];
  progress: Progress;
  onRun: (command: string) => void;
}) {
  return (
    <div>
      <h2 className="mb-3 font-display text-3xl tracking-wide outlined">MISSIONS</h2>
      <ul className="flex flex-col gap-3 pr-2">
        {levels.map((level, i) => {
          const unlocked = isUnlocked(level, levels, progress);
          const status = STATUS[unlocked ? statusOf(level.id, progress) : "locked"];
          const tree = TREE_STYLE[level.tree];
          return (
            <motion.li
              key={level.id}
              className={OFFSETS[i % OFFSETS.length]}
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 26, delay: i * 0.05 }}
            >
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => onRun(`open ${level.id}`)}
                className="group edge-white block w-full text-left disabled:cursor-not-allowed"
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
                    </span>
                    <span className="block truncate font-sans text-lg font-bold text-cyan">{level.title}</span>
                    <span className="block truncate text-sm text-neutral-300">{level.hook}</span>
                  </span>
                </div>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
