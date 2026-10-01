"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig } from "motion/react";
import type { Level, Progress, Sabotage } from "@terminal-arcade/shared";
import {
  blockedKey,
  bootLines,
  hostileDetected,
  completions,
  handleLine,
  initialState,
  promptFor,
  reopenTerminal,
  sandboxEffects,
  sandboxFailed,
  sandboxReady,
  taskResult,
  tickGame,
  type GameState,
  type LineResult,
  type PetReaction,
} from "@/lib/game";
import { isPetConfig, type PetConfig } from "@/lib/pet";
import { SandboxClient } from "@/lib/sandbox";
import { isObject, load, save } from "@/lib/storage";
import type { LineOutcome, TerminalApi } from "./TerminalView";
import { MissionBanners } from "./MissionBanners";
import { MobileBar } from "./MobileBar";
import { Pet } from "./pet/Pet";
import { PetPanel, ProfilePanel, QuestionPanel, RecapPanel, WelcomePanel } from "./Screens";
import { StampHeader } from "./StampHeader";

// xterm.js manipule le DOM : il ne peut être chargé que dans le navigateur.
const TerminalView = dynamic(() => import("./TerminalView"), {
  ssr: false,
  loading: () => <p className="p-4 font-mono text-sm text-neutral-400">Démarrage du terminal…</p>,
});

const isProgress = (v: unknown): v is Progress =>
  isObject(v) && isObject(v.levels) && isObject(v.xpByTree);

type Reaction = { kind: PetReaction; id: number; text?: string };

/** Retire d'une saisie la touche bloquée par le compagnon (séquences d'échappement exclues). */
function withoutKey(data: string, key: string | null): string {
  if (!key || data.startsWith("\x1b")) return data;
  return Array.from(data)
    .filter((ch) => ch.toLowerCase() !== key)
    .join("");
}

export function Game({ levels }: { levels: Level[] }) {
  // L'état dépend du stockage local : il n'existe qu'après le montage, pour
  // que le rendu serveur et le premier rendu client soient identiques.
  const [state, setState] = useState<GameState | null>(null);
  const [touchMode, setTouchMode] = useState(false);
  const [api, setApi] = useState<TerminalApi | null>(null);
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [activity, setActivity] = useState(0);
  const stateRef = useRef<GameState | null>(null);
  const sandboxRef = useRef<SandboxClient | null>(null);
  // Résultats produits hors saisie (horloge, sandbox) : appliqués par apply,
  // défini plus bas. Une ref évite les dépendances circulaires entre callbacks.
  const applyRef = useRef<(result: LineResult) => void>(() => {});

  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const initial = initialState(
      load<Progress | null>("progress", null, isProgress),
      load<PetConfig | null>("pet", null, isPetConfig),
      { mobile: touch },
    );
    stateRef.current = initial;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique du stockage local au montage
    setState(initial);
    setTouchMode(touch);
    setActivity(Date.now());
  }, []);

  useEffect(() => {
    if (!state) return;
    save("progress", state.progress);
    // Le compagnon n'est enregistré qu'une fois créé, sinon la création
    // ne serait plus proposée au prochain lancement.
    if (!state.wizard) save("pet", state.pet);
  }, [state]);

  /** Applique un résultat produit hors saisie (horloge, réouverture du terminal). */
  /** Démarre, prépare ou arrête la sandbox selon le changement d'état. */
  const runSandbox = useCallback(
    (prev: GameState | null, next: GameState) => {
      if (!prev) return;
      for (const effect of sandboxEffects(prev, next, levels)) {
        if (effect.type === "stop") {
          sandboxRef.current?.stop();
          api?.setRemote(null);
          api?.showPrompt(promptFor(next, levels));
        } else if (effect.type === "task") {
          sandboxRef.current?.task(effect.index, effect.variant);
        } else if (effect.type === "hostile") {
          sandboxRef.current?.hostile(effect.kind);
        } else {
          const client = (sandboxRef.current ??= new SandboxClient());
          const levelId = effect.levelId;
          const stillWanted = () => {
            const current = stateRef.current?.active;
            return current?.levelId === levelId && current.sandbox === "connecting";
          };
          client
            .start(levelId, {
              onOutput: (data) => api?.writeRemote(data),
              onResult: (r) => {
                const result = stateRef.current && taskResult(stateRef.current, levels, r);
                if (result) applyRef.current(result);
              },
              onCommand: (command) => {
                if (stateRef.current) applyRef.current(handleLine(stateRef.current, command, levels));
              },
              onDetected: (kinds) => {
                const result = stateRef.current && hostileDetected(stateRef.current, kinds as Sabotage[]);
                if (result) applyRef.current(result);
              },
              onEnded: (reason) => {
                const current = stateRef.current;
                if (current?.active && current.active.sandbox) applyRef.current(sandboxFailed(current, reason));
              },
            })
            .then(() => {
              if (!stillWanted()) return client.stop();
              api?.setRemote({ send: (d) => client.input(d), resize: (c, r) => client.resize(c, r) });
              applyRef.current(sandboxReady(stateRef.current!));
            })
            .catch((error: Error) => {
              if (stillWanted()) applyRef.current(sandboxFailed(stateRef.current!, error.message));
            });
        }
      }
    },
    [api, levels],
  );

  const apply = useCallback(
    (result: LineResult) => {
      const prev = stateRef.current;
      stateRef.current = result.state;
      setState(result.state);
      if (result.reaction) setReaction({ kind: result.reaction, id: Date.now(), text: result.say });
      if (result.out.length > 0 && api) {
        api.print(result.out);
        api.showPrompt(promptFor(result.state, levels));
      }
      runSandbox(prev, result.state);
    },
    [api, levels, runSandbox],
  );
  useEffect(() => {
    applyRef.current = apply;
  }, [apply]);

  // Fermeture de la page : la sandbox ne doit pas survivre à la partie.
  useEffect(() => () => sandboxRef.current?.stop(), []);

  // Horloge des parties chronométrées ou sabotées : on mesure le temps
  // réellement écoulé entre deux battements, pour rester juste même si le
  // navigateur ralentit l'intervalle (onglet en arrière-plan).
  const ticking = !!(state?.active?.timer || state?.active?.chaos);
  useEffect(() => {
    if (!ticking) return;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const current = stateRef.current;
      const result = current ? tickGame(current, levels, now - last) : null;
      last = now;
      if (result) apply(result);
    }, 200);
    return () => clearInterval(id);
  }, [ticking, levels, apply]);

  const terminalClosed = !!state?.active?.chaos?.terminalClosed;
  const reopen = useCallback(() => {
    if (!stateRef.current) return;
    apply(reopenTerminal(stateRef.current));
    if (!touchMode) api?.focus();
  }, [apply, api, touchMode]);

  // Raccourci pour rouvrir le terminal fermé par le compagnon.
  useEffect(() => {
    if (!terminalClosed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        reopen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [terminalClosed, reopen]);

  const onLine = useCallback(
    (line: string): LineOutcome => {
      const current = stateRef.current!;
      const result = handleLine(current, line, levels);
      stateRef.current = result.state;
      setState(result.state);
      setActivity(Date.now());
      if (result.reaction) setReaction({ kind: result.reaction, id: Date.now(), text: result.say });
      // Après l'affichage par le terminal (sortie de cette fonction).
      queueMicrotask(() => runSandbox(current, result.state));
      return { out: result.out, prompt: promptFor(result.state, levels), clear: result.clear };
    },
    [levels, runSandbox],
  );

  const completer = useCallback(
    (buffer: string) => (stateRef.current ? completions(stateRef.current, levels, buffer) : []),
    [levels],
  );

  const filterInput = useCallback((data: string) => {
    const current = stateRef.current;
    if (!current) return data;
    if (current.active?.chaos?.terminalClosed) return "";
    return withoutKey(data, blockedKey(current));
  }, []);

  const onReady = useCallback(
    (terminal: TerminalApi) => {
      const current = stateRef.current!;
      terminal.print(bootLines(current));
      terminal.showPrompt(promptFor(current, levels));
      setApi(terminal);
    },
    [levels],
  );

  // Clic sur un bouton : la commande est tapée dans le terminal, qui
  // reprend ensuite le focus (sur ordinateur) pour la saisie suivante.
  const run = useCallback(
    (command: string) => {
      const current = stateRef.current;
      if (current?.active?.chaos?.terminalClosed) return;
      if (current?.active?.sandbox) {
        // En sandbox, les boutons parlent au jeu, pas au shell distant.
        apply(handleLine(current, command, levels));
        return;
      }
      api?.run(command);
      if (!touchMode) api?.focus();
    },
    [api, touchMode, apply, levels],
  );

  if (!state) {
    return <div className="h-dvh" />;
  }

  const screen = (() => {
    switch (state.screen.kind) {
      case "missions":
        return <MissionBanners levels={levels} progress={state.progress} onRun={run} />;
      case "question":
        return <QuestionPanel state={state} levels={levels} onRun={run} />;
      case "recap": {
        const level = levels.find((l) => l.id === (state.screen as { levelId: string }).levelId)!;
        return <RecapPanel screen={state.screen} level={level} petName={state.pet.name} onRun={run} />;
      }
      case "profile":
        return <ProfilePanel state={state} levels={levels} />;
      case "pet":
        return <PetPanel state={state} onRun={run} />;
      default:
        return <WelcomePanel state={state} onRun={run} />;
    }
  })();

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex h-dvh flex-col overflow-hidden">
        <StampHeader state={state} levels={levels} />
        <main className="flex min-h-0 flex-1 flex-col gap-2 px-3 pb-3 lg:flex-row lg:gap-8 lg:px-6 lg:pb-6">
          <section
            aria-label="Écran"
            className="max-h-[48%] min-h-0 shrink-0 overflow-x-hidden overflow-y-auto px-1 pt-1 pb-3 lg:max-h-none lg:w-[42%] lg:shrink"
          >
            {screen}
          </section>
          <section aria-label="Terminal" className="flex min-h-[140px] flex-1 flex-col pt-16 lg:pt-20">
            <div className="edge-white relative min-h-0 flex-1">
              {!state.petHidden && <Pet config={state.pet} reaction={reaction} activity={activity} />}
              <div className="shape-panel h-full bg-ink" onClick={() => (touchMode ? null : api?.focus())}>
                <TerminalView
                  onReady={onReady}
                  onLine={onLine}
                  completer={completer}
                  filterInput={filterInput}
                  touchMode={touchMode}
                />
              </div>
              {terminalClosed && (
                <div
                  role="alertdialog"
                  aria-label="Terminal fermé"
                  className="shape-panel absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/95 p-6 text-center"
                >
                  <p className="font-display text-3xl tracking-wide text-red outlined">TERMINAL FERMÉ</p>
                  <p className="max-w-sm text-sm text-neutral-300">
                    {state.pet.name} a fermé ton terminal. Ta saisie et ta progression sont intactes.
                  </p>
                  <button type="button" onClick={reopen} className="edge-white" autoFocus>
                    <span className="shape-tag block bg-cyan px-4 py-2 font-display text-lg tracking-wide text-ink">
                      ROUVRIR{touchMode ? "" : " · CTRL+ALT+T"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>
        {touchMode && (
          <MobileBar
            api={api}
            completer={completer}
            blockedKey={blockedKey(state)}
            disabled={terminalClosed}
          />
        )}
      </div>
    </MotionConfig>
  );
}
