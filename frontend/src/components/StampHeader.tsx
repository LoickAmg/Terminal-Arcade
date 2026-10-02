import { TIER_LABELS, type Level } from "@terminal-arcade/shared";
import { activeLevel, displayedTimer, type GameState } from "@/lib/game";
import { TimerDisplay } from "./TimerDisplay";

// Bandeau du jeu : fil d'Ariane (palier, niveau, question) et, à droite,
// le timer des parties chronométrées, sinon l'XP totale.
export function StampHeader({ state, levels, onMenu }: { state: GameState; levels: Level[]; onMenu: () => void }) {
  const level = activeLevel(state, levels);
  const active = state.active;
  const run = active?.run;
  const totalXp = Object.values(state.progress.xpByTree).reduce((a, b) => a + (b ?? 0), 0);
  // En Chaos, le timer affiché peut être une illusion (figé, instable).
  const shownTimer = active ? displayedTimer(active) : null;

  const crumbs = level && run
    ? [TIER_LABELS[level.tier], level.id, `Q${Math.min(run.index + 1, level.questions.length)}/${level.questions.length}`]
    : [state.wizard ? "Compagnon" : "Terminal"];

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-4 py-2.5 lg:px-6">
      <nav aria-label="Fil d'Ariane" className="type-label flex min-w-0 items-center gap-2">
        <button type="button" onClick={onMenu} className="shrink-0 text-muted hover:text-fg">
          Menu
        </button>
        {crumbs.map((c, i) => (
          <span key={i} className="flex min-w-0 items-center gap-2">
            <span className="text-muted">/</span>
            <span className={`truncate ${i === crumbs.length - 1 ? "text-accent" : "text-muted"}`}>{c}</span>
          </span>
        ))}
      </nav>
      {active && shownTimer ? (
        <TimerDisplay timer={shownTimer} lastDelta={active.lastDelta} />
      ) : (
        <span className="type-label shrink-0 border border-accent/60 px-3 py-1.5 text-accent">{totalXp} XP</span>
      )}
    </header>
  );
}
