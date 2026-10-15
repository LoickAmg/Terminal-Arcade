"use client";

import { useEffect, useRef, useState } from "react";
import { completeHome, runHomeCommand, type HomeAction, type HomeLine } from "@/lib/homeShell";

// Invite de l'accueil : les segments fléchés (joueur, ~, l'heure), suivis
// d'une vraie ligne de saisie. Entrée sur une ligne vide ouvre le menu,
// comme avant ; les autres commandes sont décrites dans lib/homeShell.ts.

const TONE: Record<NonNullable<HomeLine["tone"]> | "plain", string> = {
  plain: "text-fg",
  muted: "text-muted",
  accent: "text-accent",
  bad: "text-danger",
};

export function HomePrompt({
  time,
  themes,
  theme,
  onAction,
}: {
  time: string;
  themes: { id: string; label: string }[];
  theme: string;
  onAction: (action: HomeAction) => void;
}) {
  const [value, setValue] = useState("");
  const [lines, setLines] = useState<HomeLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const input = useRef<HTMLInputElement>(null);

  // Sur ordinateur, on peut taper tout de suite ; sur téléphone, on évite
  // d'ouvrir le clavier sans qu'on le demande.
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) input.current?.focus({ preventScroll: true });
  }, []);

  const submit = () => {
    const line = value;
    const result = runHomeCommand(line, themes, theme);
    setValue("");
    setCursor(null);
    if (line.trim()) setHistory((h) => [...h.filter((x) => x !== line.trim()), line.trim()].slice(-30));
    if (result.action.type === "clear") setLines([]);
    else if (result.out.length) setLines([{ text: `joueur:~$ ${line}`, tone: "muted" }, ...result.out]);
    onAction(result.action);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Tab") {
      e.preventDefault();
      const options = completeHome(value, themes);
      if (options.length === 1) setValue(options[0]);
      else if (options.length > 1) setLines([{ text: options.join("   "), tone: "muted" }]);
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown" && cursor !== null) {
      e.preventDefault();
      const next = cursor + 1;
      setCursor(next < history.length ? next : null);
      setValue(next < history.length ? history[next] : "");
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    // Un clic ici ne doit pas ouvrir le menu (le reste de la fenêtre le fait).
    <div className="px-5 pb-5 font-mono text-sm sm:px-8" onClick={(e) => e.stopPropagation()}>
      {lines.length > 0 && (
        <div aria-live="polite" className="mb-3 max-h-48 overflow-y-auto whitespace-pre-wrap">
          {lines.map((l, i) => (
            <p key={i} className={TONE[l.tone ?? "plain"]}>
              {l.text}
            </p>
          ))}
        </div>
      )}
      <form
        className="flex items-center"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <span aria-hidden className="seg-first shrink-0 bg-accent py-0.5 pr-4 pl-3 font-bold text-on-accent">
          joueur
        </span>
        <span aria-hidden className="seg shrink-0 bg-surface-2 py-0.5 pr-4 pl-5 text-fg">
          ~
        </span>
        <span aria-hidden className="seg shrink-0 bg-accent-2 py-0.5 pr-4 pl-5 text-on-accent-2">
          ♡ {time}
        </span>
        <label className="sr-only" htmlFor="home-command">
          Commande (Entrée pour ouvrir le menu, help pour la liste)
        </label>
        <input
          ref={input}
          id="home-command"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setCursor(null);
          }}
          onKeyDown={onKeyDown}
          placeholder="./entrer"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="ml-3 min-w-0 flex-1 bg-transparent text-fg caret-accent outline-none placeholder:text-fg/70"
        />
      </form>
      <p className="mt-2 text-xs text-muted">Tape une commande (help pour la liste), ou Entrée pour ouvrir le menu.</p>
    </div>
  );
}
