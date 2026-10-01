"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig } from "motion/react";
import type { Level, Progress } from "@terminal-arcade/shared";
import {
  bootLines,
  completions,
  handleLine,
  initialState,
  promptFor,
  type GameState,
  type PetReaction,
} from "@/lib/game";
import { isPetConfig, type PetConfig } from "@/lib/pet";
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

export function Game({ levels }: { levels: Level[] }) {
  // L'état dépend du stockage local : il n'existe qu'après le montage, pour
  // que le rendu serveur et le premier rendu client soient identiques.
  const [state, setState] = useState<GameState | null>(null);
  const [touchMode, setTouchMode] = useState(false);
  const [api, setApi] = useState<TerminalApi | null>(null);
  const [reaction, setReaction] = useState<{ kind: PetReaction; id: number } | null>(null);
  const [activity, setActivity] = useState(0);
  const stateRef = useRef<GameState | null>(null);

  useEffect(() => {
    const initial = initialState(
      load<Progress | null>("progress", null, isProgress),
      load<PetConfig | null>("pet", null, isPetConfig),
    );
    stateRef.current = initial;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique du stockage local au montage
    setState(initial);
    setTouchMode(window.matchMedia("(pointer: coarse)").matches);
    setActivity(Date.now());
  }, []);

  useEffect(() => {
    if (!state) return;
    save("progress", state.progress);
    // Le compagnon n'est enregistré qu'une fois créé, sinon la création
    // ne serait plus proposée au prochain lancement.
    if (!state.wizard) save("pet", state.pet);
  }, [state]);

  const onLine = useCallback(
    (line: string): LineOutcome => {
      const current = stateRef.current!;
      const result = handleLine(current, line, levels);
      stateRef.current = result.state;
      setState(result.state);
      setActivity(Date.now());
      if (result.reaction) setReaction({ kind: result.reaction, id: Date.now() });
      return { out: result.out, prompt: promptFor(result.state, levels), clear: result.clear };
    },
    [levels],
  );

  const completer = useCallback(
    (buffer: string) => (stateRef.current ? completions(stateRef.current, levels, buffer) : []),
    [levels],
  );

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
      api?.run(command);
      if (!touchMode) api?.focus();
    },
    [api, touchMode],
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
        const { levelId, recap, nextId } = state.screen;
        const level = levels.find((l) => l.id === levelId)!;
        return <RecapPanel recap={recap} level={level} nextId={nextId} onRun={run} />;
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
                <TerminalView onReady={onReady} onLine={onLine} completer={completer} touchMode={touchMode} />
              </div>
            </div>
          </section>
        </main>
        {touchMode && <MobileBar api={api} completer={completer} />}
      </div>
    </MotionConfig>
  );
}
