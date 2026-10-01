import { TIER_LABELS, type Level } from "@terminal-arcade/shared";
import { activeLevel, type GameState } from "@/lib/game";

// Bandeau en haut à gauche, dans l'esprit du tampon date de la messagerie :
// palier, niveau et question en cours. Le timer s'y ajoutera en phase 2.
export function StampHeader({ state, levels }: { state: GameState; levels: Level[] }) {
  const level = activeLevel(state, levels);
  const run = state.active?.run;
  const totalXp = Object.values(state.progress.xpByTree).reduce((a, b) => a + (b ?? 0), 0);

  const big = level ? TIER_LABELS[level.tier].toUpperCase() : state.wizard ? "PET INIT" : "LOBBY";
  const small = level && run
    ? `${level.id.toUpperCase()} // Q${Math.min(run.index + 1, level.questions.length)}/${level.questions.length}`
    : "TERMINAL ARCADE";

  return (
    <header className="flex items-start justify-between gap-4 px-4 pt-3 pb-2 lg:px-6">
      <div className="-rotate-3 select-none">
        <p className="font-display text-4xl leading-none tracking-wide outlined sm:text-5xl">{big}</p>
        <p className="shape-tag mt-1 inline-block bg-paper px-3 font-display text-base tracking-wider text-red sm:text-lg">
          {small}
        </p>
      </div>
      <p className="edge-ink mt-1 shrink-0">
        <span className="shape-tag block bg-ink px-3 py-1 font-display text-lg tracking-wide text-cyan">
          {totalXp} XP
        </span>
      </p>
    </header>
  );
}
