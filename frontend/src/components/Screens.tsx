"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  TIER_LABELS,
  TREE_LABELS,
  currentQuestion,
  statusOf,
  type Level,
  type Recap,
  type Tree,
} from "@terminal-arcade/shared";
import { KIND_LABELS, activeLevel, wizardChoices, type GameState } from "@/lib/game";
import { PetSprite } from "./pet/PetSprite";
import { TREE_STYLE } from "./MissionBanners";

type Run = (command: string) => void;

const spring = { type: "spring", stiffness: 420, damping: 28 } as const;

/** Bouton de commande : affiche la commande qu'il va taper. */
function CommandChip({ command, onRun, label }: { command: string; onRun: Run; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => onRun(command)}
      className="edge-ink shrink-0"
    >
      <span className="shape-tag block bg-paper px-3 py-1 font-mono text-sm font-bold text-ink">
        {label ?? command}
      </span>
    </button>
  );
}

function BlackBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="edge-white">
      <div className="shape-bubble-left bg-ink py-4 pr-5 pl-9 text-paper">{children}</div>
    </div>
  );
}

export function WelcomePanel({ state, onRun }: { state: GameState; onRun: Run }) {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="-rotate-2 font-display text-4xl leading-none tracking-wide outlined sm:text-6xl">
        TERMINAL
        <br />
        ARCADE
      </h1>
      <BlackBubble>
        <p className="font-bold sm:text-lg">Maîtrise le terminal en jouant.</p>
        <p className="mt-1 text-sm text-neutral-300 sm:text-base">
          Tout se fait en tapant des commandes. Un clic sur un bouton tape la commande pour toi, pour que tu voies
          laquelle c&apos;est.
        </p>
      </BlackBubble>
      <div className="flex flex-wrap gap-3">
        <CommandChip command="ls missions/" onRun={onRun} />
        <CommandChip command="help" onRun={onRun} />
        <CommandChip command="whoami" onRun={onRun} />
        <CommandChip command="pet" onRun={onRun} />
      </div>
      <p className="text-sm text-paper/80">
        {state.pet.name} t&apos;accompagne au-dessus du terminal.
      </p>
    </div>
  );
}

export function QuestionPanel({
  state,
  levels,
  onRun,
}: {
  state: GameState;
  levels: Level[];
  onRun: Run;
}) {
  const level = activeLevel(state, levels);
  const run = state.active?.run;
  const q = level && run ? currentQuestion(level, run) : null;
  if (!level || !run || !q) return null;
  const tree = TREE_STYLE[level.tree];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2" aria-label={`Question ${run.index + 1} sur ${level.questions.length}`}>
        {level.questions.map((_, i) => (
          <span
            key={i}
            className={`h-2 flex-1 -skew-x-12 ${
              i < run.index ? "bg-paper" : i === run.index ? "bg-cyan" : "bg-ink/50"
            }`}
          />
        ))}
      </div>

      <FeedbackBubble state={state} />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${level.id}-${run.index}`}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 50, opacity: 0 }}
          transition={spring}
          className="flex flex-col gap-4"
        >
          <div className="flex items-start gap-3">
            <span
              className="mt-2 grid size-12 shrink-0 -rotate-3 place-items-center border-2 border-paper font-display text-xl text-ink"
              style={{ background: tree.color }}
              aria-hidden
            >
              {tree.glyph}
            </span>
            <div className="min-w-0 flex-1">
              <BlackBubble>
                <span className="shape-tag mb-2 inline-block bg-cyan px-2 font-display text-sm tracking-wide text-red">
                  {KIND_LABELS[q.kind].toUpperCase()}
                </span>
                <p className="text-lg leading-snug font-bold">{q.prompt}</p>
                {q.kind === "fill" && (
                  <pre className="mt-3 overflow-x-auto font-mono text-cyan">
                    {q.template.split("___").map((part, i, all) => (
                      <span key={i}>
                        {part}
                        {i < all.length - 1 && <span className="bg-cyan px-1 text-ink">___</span>}
                      </span>
                    ))}
                  </pre>
                )}
                {"code" in q && q.code && (
                  <pre className="mt-3 overflow-x-auto font-mono text-cyan">{q.code.trimEnd()}</pre>
                )}
              </BlackBubble>
            </div>
          </div>

          {(q.kind === "mcq" || q.kind === "trap") && (
            <ol className="flex flex-col items-end gap-2">
              {q.choices.map((choice, i) => (
                <li key={i} className="w-[88%]">
                  <button type="button" onClick={() => onRun(String(i + 1))} className="edge-ink group w-full text-left">
                    <span className="shape-bubble-right flex items-baseline gap-3 bg-paper py-3 pr-10 pl-4 text-ink transition-colors group-hover:bg-cyan">
                      <span className="font-display text-xl">{i + 1}</span>
                      <span className="font-bold">{choice}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          )}

          {(q.kind === "command" || q.kind === "fill" || q.kind === "predict") && (
            <p className="text-sm text-paper/85">
              {q.kind === "command"
                ? "Tape la commande dans le terminal."
                : q.kind === "fill"
                  ? "Tape ce qui remplace ___."
                  : "Tape exactement ce que la commande affiche."}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-wrap gap-3">
        <CommandChip command="hint" onRun={onRun} label="hint · indice" />
        <CommandChip command="skip" onRun={onRun} label="skip · passer" />
        <CommandChip command="quit" onRun={onRun} label="quit · quitter" />
      </div>
    </div>
  );
}

function FeedbackBubble({ state }: { state: GameState }) {
  const f = state.feedback;
  if (!f) return null;
  const color = f.tone === "good" ? "text-good" : f.tone === "bad" ? "text-red" : "text-warn";
  return (
    <motion.div
      key={`${f.title}-${state.active?.run.index}-${state.active?.run.wrongAttempts}-${state.active?.run.hintsUsed}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={spring}
      role="status"
      className="edge-ink"
    >
      <div className="shape-panel bg-paper px-4 py-2 text-ink">
        <p className={`font-display text-lg tracking-wide ${color} [text-shadow:1px_1px_0_#0a0a0a]`}>{f.title}</p>
        {f.output && <pre className="mt-1 overflow-x-auto font-mono text-sm">{f.output}</pre>}
        {f.explain && <p className="mt-1 text-sm">{f.explain}</p>}
      </div>
    </motion.div>
  );
}

export function RecapPanel({
  recap,
  level,
  nextId,
  onRun,
}: {
  recap: Recap;
  level: Level;
  nextId: string | null;
  onRun: Run;
}) {
  return (
    <motion.div
      initial={{ scale: 0.85, rotate: -6, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={spring}
      className="flex flex-col gap-5"
    >
      <p className="-rotate-3 font-display text-6xl leading-none tracking-wide outlined">
        {recap.passed ? "HACKÉ !" : "ÉCHEC"}
      </p>
      <BlackBubble>
        <p className="text-lg font-bold">{level.title}</p>
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          <dt className="text-neutral-400">Bonnes réponses</dt>
          <dd className="font-bold">
            {recap.correct}/{recap.total}
          </dd>
          <dt className="text-neutral-400">Du premier coup</dt>
          <dd className="font-bold">{recap.firstTry}</dd>
          <dt className="text-neutral-400">XP gagnée</dt>
          <dd className="font-display text-xl text-cyan">+{recap.xp}</dd>
        </dl>
        {!recap.passed && <p className="mt-3 text-sm text-neutral-300">Il faut 60 % de bonnes réponses.</p>}
      </BlackBubble>
      <div className="flex flex-wrap gap-3">
        {recap.passed && nextId && <CommandChip command={`open ${nextId}`} onRun={onRun} />}
        <CommandChip command={`open ${level.id}`} onRun={onRun} label="rejouer" />
        <CommandChip command="ls missions/" onRun={onRun} />
      </div>
    </motion.div>
  );
}

export function ProfilePanel({ state, levels }: { state: GameState; levels: Level[] }) {
  const entries = Object.entries(state.progress.xpByTree) as [Tree, number][];
  const total = entries.reduce((sum, [, xp]) => sum + xp, 0);
  const passed = levels.filter((l) => statusOf(l.id, state.progress) === "passed").length;
  const max = Math.max(1, ...entries.map(([, xp]) => xp));

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-4xl tracking-wide outlined">WHOAMI</h2>
      <BlackBubble>
        <p className="font-display text-3xl text-cyan">{total} XP</p>
        <p className="text-neutral-300">
          {passed}/{levels.length} niveaux hackés · palier {TIER_LABELS.script_kiddie}
        </p>
      </BlackBubble>
      {entries.length === 0 ? (
        <p className="text-paper/85">Aucune XP pour l&apos;instant. Lance un niveau avec ls missions/.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {entries.map(([tree, xp]) => (
            <li key={tree} className="flex items-center gap-3">
              <span className="w-40 shrink-0 text-sm font-bold">{TREE_LABELS[tree]}</span>
              <span className="h-4 flex-1 -skew-x-12 bg-ink/50">
                <span
                  className="block h-full"
                  style={{ width: `${(xp / max) * 100}%`, background: TREE_STYLE[tree].color }}
                />
              </span>
              <span className="w-16 text-right font-mono text-sm">{xp} XP</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function PetPanel({ state, onRun }: { state: GameState; onRun: Run }) {
  const wizard = state.wizard;
  const config = wizard?.draft ?? state.pet;
  const choices = wizard ? wizardChoices(wizard) : [];

  return (
    <div className="flex flex-col gap-5">
      {!wizard && <h2 className="font-display text-4xl tracking-wide outlined">COMPAGNON</h2>}
      <div className="flex items-end gap-5">
        <div className="edge-white">
          <div className="shape-panel grid place-items-center bg-ink p-3">
            <PetSprite config={config} size={96} title={`Aperçu de ${config.name}`} />
          </div>
        </div>
        <p className="font-display text-3xl tracking-wide outlined">{config.name}</p>
      </div>

      {wizard && choices.length > 0 && (
        <ol className="flex flex-col items-end gap-2">
          {choices.map((label, i) => (
            <li key={label} className="w-[80%]">
              <button type="button" onClick={() => onRun(String(i + 1))} className="edge-ink group w-full text-left">
                <span className="shape-bubble-right flex items-baseline gap-3 bg-paper py-2 pr-10 pl-4 text-ink transition-colors group-hover:bg-cyan">
                  <span className="font-display text-xl">{i + 1}</span>
                  <span className="font-bold">{label}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}
      {wizard?.step === "name" && (
        <div className="flex flex-wrap items-center gap-3">
          <CommandChip command="" onRun={onRun} label={`garder « ${config.name} »`} />
          <span className="text-sm text-paper/85">ou tape un nouveau nom dans le terminal.</span>
        </div>
      )}
      {!wizard && (
        <div className="flex flex-wrap gap-3">
          <CommandChip command="pet init" onRun={onRun} />
          <CommandChip command={state.petHidden ? "pet show" : "pet hide"} onRun={onRun} />
        </div>
      )}
      <p className="text-sm text-paper/85">Style pixel art. Le style façon Persona arrivera plus tard.</p>
    </div>
  );
}
