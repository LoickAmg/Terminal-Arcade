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
      className="cut-tag shrink-0 border border-line bg-surface-2 px-3 py-1 font-mono text-sm font-bold text-fg transition-colors hover:border-accent hover:text-accent"
    >
      <span className="block">
        {label ?? command}
      </span>
    </button>
  );
}

function BlackBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="edge">
      <div className="cut-bubble-left border border-line bg-surface-2/70 py-4 pr-5 text-fg">{children}</div>
    </div>
  );
}

export function WelcomePanel({ state, onRun }: { state: GameState; onRun: Run }) {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="type-display tilt text-5xl text-fg outlined sm:text-7xl">
        Terminal
        <br />
        <span className="hollow">Arcade</span>
      </h1>
      <BlackBubble>
        <p className="font-bold sm:text-lg">Maîtrise le terminal en jouant.</p>
        <p className="mt-1 text-sm text-muted sm:text-base">
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
      <p className="text-sm text-muted">
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
              i < run.index ? "bg-fg" : i === run.index ? "bg-accent" : "bg-surface-2"
            }`}
          />
        ))}
      </div>

      {(chaos || blocked || active.sandbox) && (
        <div className="flex flex-wrap gap-2">
          {active.sandbox && (
            <span
              className={`type-label border px-2 py-1 ${
                active.sandbox === "ready" ? "border-good text-good" : "border-warn text-warn"
              }`}
            >
              {active.sandbox === "ready" ? "⚙ SANDBOX CONNECTÉE" : "⚙ CONNEXION À LA SANDBOX…"}
            </span>
          )}
          {chaos && (
            <span className="type-label border border-danger px-2 py-1 text-danger">☠ Chaos</span>
          )}
          {blocked && (
            <span className="type-label bg-warn px-2 py-1 text-[#0a0a0a]">
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
              className="cut-tag mt-1 grid size-12 shrink-0 place-items-center font-mono text-sm font-bold text-[#0a0a0a]"
              style={{ background: tree.color }}
              aria-hidden
            >
              {tree.glyph}
            </span>
            <div className="min-w-0 flex-1">
              <BlackBubble>
                <span className="type-label mb-2 inline-block text-accent">
                  {KIND_LABELS[q.kind].toUpperCase()}
                </span>
                <p className="text-lg leading-snug font-bold">{q.prompt}</p>
                {q.kind === "fill" && (
                  <pre className="mt-3 overflow-x-auto font-mono text-accent">
                    {q.template.split("___").map((part, i, all) => (
                      <span key={i}>
                        {part}
                        {i < all.length - 1 && <span className="bg-accent px-1 text-on-accent">___</span>}
                      </span>
                    ))}
                  </pre>
                )}
                {shownCode && <pre className="mt-3 overflow-x-auto border-l-2 border-accent pl-3 font-mono text-accent">{shownCode.trimEnd()}</pre>}
              </BlackBubble>
            </div>
          </div>

          {(q.kind === "mcq" || q.kind === "trap") && (
            <ol className="flex flex-col items-end gap-2">
              {q.choices.map((choice, i) => (
                <li key={i} className="w-[88%]">
                  <button type="button" onClick={() => onRun(String(i + 1))} className="edge group w-full text-left">
                    <span className="cut-bubble-right flex items-baseline gap-3 border border-line bg-surface-2 py-3 pr-10 pl-4 text-fg transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                      <span className="type-display text-xl text-accent group-hover:text-on-accent">{i + 1}</span>
                      <span className="font-bold">{choice}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          )}

          {(q.kind === "command" || q.kind === "fill" || q.kind === "predict" || q.kind === "task") && (
            <p className="text-sm text-muted">
              {q.kind === "command"
                ? "Tape la commande dans le terminal."
                : q.kind === "fill"
                  ? "Tape ce qui remplace ___."
                  : q.kind === "predict"
                    ? "Tape exactement ce que la commande affiche."
                    : "Vrai Linux : tape tes commandes dans le terminal, l'arbitre vérifie après chacune. Pour répondre : submit <réponse>."}
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
  const color = f.tone === "good" ? "text-good" : f.tone === "bad" ? "text-danger" : "text-warn";
  return (
    <motion.div
      key={`${f.title}-${state.active?.run.index}-${state.active?.run.wrongAttempts}-${state.active?.run.hintsUsed}-${state.active?.chaos?.state.used}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={spring}
      role="status"
      className="edge"
    >
      <div className="cut-panel border border-line bg-surface-2 px-4 py-2 text-fg">
        {f.claimedBy && (
          <p className="type-label text-muted">
            selon {f.claimedBy} (vérifiable avec verify)
          </p>
        )}
        <p className={`type-display text-2xl ${color}`}>{f.title}</p>
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
      <p className="type-display tilt text-6xl text-fg outlined">
        {recap.passed ? "HACKÉ !" : timedOut ? "TEMPS ÉCOULÉ" : "ÉCHEC"}
      </p>
      <BlackBubble>
        <p className="text-lg font-bold">{level.title}</p>
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          <dt className="text-muted">Bonnes réponses</dt>
          <dd className="font-bold">
            {recap.correct}/{recap.total}
          </dd>
          <dt className="text-muted">Du premier coup</dt>
          <dd className="font-bold">{recap.firstTry}</dd>
          {timer && (
            <>
              <dt className="text-muted">{TIMER_LABELS[timer.mode]}</dt>
              <dd className={`font-bold ${timedOut || (timer.mode === "buyback" && !timer.restored) ? "text-danger" : ""}`}>
                {timeLine(timer, timedOut)}
              </dd>
            </>
          )}
          <dt className="text-muted">XP gagnée</dt>
          <dd className="type-display text-2xl text-accent">+{recap.xp}</dd>
        </dl>
        {!recap.passed && (
          <p className="mt-3 text-sm text-muted">
            {timedOut
              ? "Le temps est écoulé avant la dernière question."
              : recap.correct >= Math.ceil(recap.total * 0.6)
                ? "Objectif de temps manqué."
                : "Il faut 60 % de bonnes réponses."}
          </p>
        )}
      </BlackBubble>

      {chaosLog && (
        <div className="edge">
          <div className="cut-panel border border-danger/50 bg-surface-2 px-5 py-4">
            <p className="type-display text-2xl text-danger">CE QUE {petName.toUpperCase()} A FAIT</p>
            {chaosLog.length === 0 ? (
              <p className="mt-1 text-sm text-muted">Rien, finalement. Il était sage.</p>
            ) : (
              <ul className="mt-2 flex flex-col gap-1.5 text-sm">
                {chaosLog.map((e, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-10 shrink-0 font-mono text-muted">{formatTime(e.atMs)}</span>
                    <span className="min-w-0 flex-1 text-fg">{e.note}</span>
                    <span className={`shrink-0 font-bold ${e.detected ? "text-good" : "text-danger"}`}>
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
      <h2 className="type-display tilt text-5xl text-fg outlined">Whoami</h2>
      <BlackBubble>
        <p className="type-display text-4xl text-accent">{total} XP</p>
        <p className="text-muted">
          {passed}/{levels.length} niveaux hackés · palier {TIER_LABELS.script_kiddie}
        </p>
      </BlackBubble>
      {entries.length === 0 ? (
        <p className="text-muted">Aucune XP pour l&apos;instant. Lance un niveau avec ls missions/.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {entries.map(([tree, xp]) => (
            <li key={tree} className="flex items-center gap-3">
              <span className="w-40 shrink-0 text-sm font-bold">{TREE_LABELS[tree]}</span>
              <span className="h-2 flex-1 bg-surface-2">
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
      {!wizard && <h2 className="type-display text-5xl text-fg outlined">Compagnon</h2>}
      <div className="flex items-end gap-5">
        <div className="edge">
          <div className="cut-panel grid place-items-center border border-line bg-surface-2 p-3">
            <PetSprite config={config} size={96} title={`Aperçu de ${config.name}`} />
          </div>
        </div>
        <p className="type-display text-4xl text-fg outlined">{config.name}</p>
      </div>

      {wizard && choices.length > 0 && (
        <ol className="flex flex-col items-end gap-2">
          {choices.map((label, i) => (
            <li key={label} className="w-[80%]">
              <button type="button" onClick={() => onRun(String(i + 1))} className="edge group w-full text-left">
                <span className="cut-bubble-right flex items-baseline gap-3 border border-line bg-surface-2 py-2 pr-10 pl-4 text-fg transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                  <span className="type-display text-xl text-accent group-hover:text-on-accent">{i + 1}</span>
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
          <span className="text-sm text-muted">ou tape un nouveau nom dans le terminal.</span>
        </div>
      )}
      {!wizard && (
        <div className="flex flex-wrap gap-3">
          <CommandChip command="pet init" onRun={onRun} />
          <CommandChip
            command={config.style === "pixel" ? "pet style persona" : "pet style pixel"}
            onRun={onRun}
          />
          <CommandChip command={state.petHidden ? "pet show" : "pet hide"} onRun={onRun} />
        </div>
      )}
      <p className="text-sm text-muted">
        Style {config.style === "pixel" ? "pixel art" : "façon Persona"} · change-le avec pet style.
      </p>
    </div>
  );
}
