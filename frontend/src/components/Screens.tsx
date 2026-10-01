"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  TIER_LABELS,
  TIMER_LABELS,
  TREE_LABELS,
  currentQuestion,
  formatTime,
  isChaos,
  isTimed,
  nativeMode,
  statusOf,
  type Level,
  type TimerState,
  type Tree,
} from "@terminal-arcade/shared";
import { KIND_LABELS, playedLevel, wizardChoices, type GameState } from "@/lib/game";
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
  const level = playedLevel(state, levels);
  const active = state.active;
  const run = active?.run;
  const q = level && run ? currentQuestion(level, run) : null;
  if (!level || !active || !run || !q) return null;
  const tree = TREE_STYLE[level.tree];
  const chaos = active.chaos;
  // Code affiché : falsifié à l'écran par le compagnon, le terminal garde le vrai.
  const shownCode = "code" in q && q.code ? (chaos?.falsified[run.index] ?? q.code) : null;
  const mutated = chaos?.overrides[run.index] !== undefined;
  const blocked = chaos?.blockedKey?.key ?? null;

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

      {(chaos || blocked) && (
        <div className="flex flex-wrap gap-2">
          {chaos && (
            <span className="shape-tag bg-ink px-2 font-display text-sm tracking-wide text-red">☠ CHAOS</span>
          )}
          {blocked && (
            <span className="shape-tag bg-warn px-2 font-display text-sm tracking-wide text-ink">
              TOUCHE « {blocked.toUpperCase()} » BLOQUÉE
            </span>
          )}
        </div>
      )}

      <FeedbackBubble state={state} />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${level.id}-${run.index}-${mutated ? "m" : ""}`}
          initial={mutated ? { x: 0, opacity: 0, skewX: 25 } : { x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1, skewX: 0 }}
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
                {shownCode && <pre className="mt-3 overflow-x-auto font-mono text-cyan">{shownCode.trimEnd()}</pre>}
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
        {chaos && <CommandChip command="verify" onRun={onRun} label="verify · vérifier" />}
        {active.timer && <CommandChip command="clock" onRun={onRun} label="clock · vrai temps" />}
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
      key={`${f.title}-${state.active?.run.index}-${state.active?.run.wrongAttempts}-${state.active?.run.hintsUsed}-${state.active?.chaos?.state.used}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={spring}
      role="status"
      className="edge-ink"
    >
      <div className="shape-panel bg-paper px-4 py-2 text-ink">
        {f.claimedBy && (
          <p className="text-xs font-bold tracking-wide text-neutral-500 uppercase">
            selon {f.claimedBy} (vérifiable avec verify)
          </p>
        )}
        <p className={`font-display text-lg tracking-wide ${color} [text-shadow:1px_1px_0_#0a0a0a]`}>{f.title}</p>
        {f.output && <pre className="mt-1 overflow-x-auto font-mono text-sm">{f.output}</pre>}
        {f.explain && <p className="mt-1 text-sm">{f.explain}</p>}
      </div>
    </motion.div>
  );
}

function timeLine(timer: TimerState, timedOut: boolean): string {
  if (timedOut) return "écoulé";
  if (timer.mode === "chrono") return `${formatTime(timer.valueMs)} (réf. ${formatTime(timer.parMs)})`;
  if (timer.mode === "buyback") return timer.restored ? "temps racheté" : "rachat raté";
  return `${formatTime(timer.valueMs)} restant`;
}

type RecapScreen = Extract<GameState["screen"], { kind: "recap" }>;

export function RecapPanel({
  screen,
  level,
  petName,
  onRun,
}: {
  screen: RecapScreen;
  level: Level;
  petName: string;
  onRun: Run;
}) {
  const { recap, nextId, timer, timedOut, mode, replays, chaosLog } = screen;
  // Les couches ajoutées à la partie se retrouvent dans la commande pour rejouer.
  const flags = [
    isTimed(mode) && !isTimed(nativeMode(level)) ? " --timer" : "",
    isChaos(mode) && !isChaos(nativeMode(level)) ? " --chaos" : "",
  ].join("");
  return (
    <motion.div
      initial={{ scale: 0.85, rotate: -6, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={spring}
      className="flex flex-col gap-5"
    >
      <p className="-rotate-3 font-display text-6xl leading-none tracking-wide outlined">
        {recap.passed ? "HACKÉ !" : timedOut ? "TEMPS ÉCOULÉ" : "ÉCHEC"}
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
          {timer && (
            <>
              <dt className="text-neutral-400">{TIMER_LABELS[timer.mode]}</dt>
              <dd className={`font-bold ${timedOut || (timer.mode === "buyback" && !timer.restored) ? "text-red" : ""}`}>
                {timeLine(timer, timedOut)}
              </dd>
            </>
          )}
          <dt className="text-neutral-400">XP gagnée</dt>
          <dd className="font-display text-xl text-cyan">+{recap.xp}</dd>
        </dl>
        {!recap.passed && (
          <p className="mt-3 text-sm text-neutral-300">
            {timedOut
              ? "Le temps est écoulé avant la dernière question."
              : recap.correct >= Math.ceil(recap.total * 0.6)
                ? "Objectif de temps manqué."
                : "Il faut 60 % de bonnes réponses."}
          </p>
        )}
      </BlackBubble>

      {chaosLog && (
        <div className="edge-white">
          <div className="shape-panel bg-ink px-5 py-4">
            <p className="font-display text-xl tracking-wide text-red">CE QUE {petName.toUpperCase()} A FAIT</p>
            {chaosLog.length === 0 ? (
              <p className="mt-1 text-sm text-neutral-300">Rien, finalement. Il était sage.</p>
            ) : (
              <ul className="mt-2 flex flex-col gap-1.5 text-sm">
                {chaosLog.map((e, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-10 shrink-0 font-mono text-neutral-500">{formatTime(e.atMs)}</span>
                    <span className="min-w-0 flex-1 text-neutral-200">{e.note}</span>
                    <span className={`shrink-0 font-bold ${e.detected ? "text-good" : "text-red"}`}>
                      {e.detected ? "démasqué" : "inaperçu"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {recap.passed && nextId && <CommandChip command={`open ${nextId}`} onRun={onRun} />}
        {replays.timer && <CommandChip command={`open ${level.id} --timer`} onRun={onRun} label="⏱ rejouer en Timer" />}
        {replays.chaos && <CommandChip command={`open ${level.id} --chaos`} onRun={onRun} label="☠ rejouer en Chaos" />}
        <CommandChip command={`open ${level.id}${flags}`} onRun={onRun} label="rejouer" />
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
