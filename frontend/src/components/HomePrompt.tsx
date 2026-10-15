"use client";

import { useEffect, useRef, useState } from "react";
import { completeHome, runHomeCommand, type HomeAction, type HomeLine } from "@/lib/homeShell";

// Invite de l'accueil : les segments fléchés (joueur, ~, l'heure), suivis
// d'une vraie ligne de saisie, sans cadre, comme dans un terminal. En
// tapant, la suite probable s'affiche en grisé (→ ou Tab l'accepte). Sous
// l'invite, des raccourcis cliquables pour qui ne veut pas taper.
// Les commandes sont décrites dans lib/homeShell.ts.

const TONE: Record<NonNullable<HomeLine["tone"]> | "plain", string> = {
  plain: "text-fg",
  muted: "text-muted",
  accent: "text-accent",
  bad: "text-danger",
};

const SHORTCUTS = ["help", "jouer", "theme", "pourquoi"];

/** Plus long début commun d'une liste de complétions. */
function commonPrefix(options: string[]): string {
  return options.reduce((prefix, o) => {
    let i = 0;
    while (i < prefix.length && prefix[i] === o[i]) i++;
    return prefix.slice(0, i);
  });
}

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

  // Suite probable de ce qui est tapé, affichée en grisé.
  const options = value ? completeHome(value, themes) : [];
  const ghost = options[0]?.startsWith(value) ? options[0].slice(value.length) : "";

  const execute = (line: string) => {
    const result = runHomeCommand(line, themes, theme);
    setValue("");
    setCursor(null);
    if (line.trim()) setHistory((h) => [...h.filter((x) => x !== line.trim()), line.trim()].slice(-30));
    if (result.action.type === "clear") setLines([]);
    else if (result.out.length) setLines([{ text: `joueur:~$ ${line}`, tone: "muted" }, ...result.out]);
    onAction(result.action);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const atEnd = e.currentTarget.selectionStart === value.length;
    if (e.key === "Enter") {
      e.preventDefault();
      execute(value);
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (options.length === 1) setValue(options[0]);
      else if (options.length > 1) {
        const prefix = commonPrefix(options);
        if (prefix.length > value.length) setValue(prefix);
        else setLines([{ text: options.join("   "), tone: "muted" }]);
      }
    } else if (e.key === "ArrowRight" && ghost && atEnd) {
      e.preventDefault();
      setValue(value + ghost);
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
        <div aria-live="polite" className="mb-3 max-h-48 overflow-y-auto border-l-2 border-line pl-3 whitespace-pre-wrap">
          {lines.map((l, i) => (
            <p key={i} className={TONE[l.tone ?? "plain"]}>
              {l.text}
            </p>
          ))}
        </div>
      )}

      <form
        className="group/prompt relative flex cursor-text items-center pb-1.5"
        onClick={() => input.current?.focus()}
        onSubmit={(e) => {
          e.preventDefault();
          execute(value);
        }}
      >
        <span aria-hidden className="seg-first shrink-0 bg-accent py-0.5 pr-4 pl-3 font-bold text-on-accent">
          joueur
        </span>
        <span aria-hidden className="seg shrink-0 bg-surface-2 py-0.5 pr-4 pl-5 text-fg">
          ~
        </span>
        <span aria-hidden className="seg shrink-0 bg-accent-2 py-0.5 pr-4 pl-5 text-on-accent-2 max-sm:hidden">
          ♡ {time}
        </span>
        <span aria-hidden className="ml-3 shrink-0 font-bold text-accent">
          ❯
        </span>
        <label className="sr-only" htmlFor="home-command">
          Commande (Entrée pour ouvrir le menu, help pour la liste)
        </label>
        <span className="relative ml-2 min-w-0 flex-1">
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
            className="w-full bg-transparent text-fg caret-accent outline-none placeholder:text-muted focus-visible:outline-none"
          />
          {ghost && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center whitespace-pre text-muted/70"
              style={{ paddingLeft: `${value.length}ch` }}
            >
              {ghost}
            </span>
          )}
        </span>
        {/* Trait sous l'invite : discret, il s'allume quand on tape. */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-[0.35] bg-line transition-[transform,background-color] duration-300 group-focus-within/prompt:scale-x-100 group-focus-within/prompt:bg-accent"
        />
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
        {SHORTCUTS.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => execute(cmd)}
            className="border border-line px-2 py-0.5 text-fg transition-colors hover:border-accent hover:text-accent"
          >
            {cmd}
          </button>
        ))}
        <span className="text-muted">
          <kbd className="text-fg">⏎</kbd> menu · <kbd className="text-fg">tab</kbd> compléter ·{" "}
          <kbd className="text-fg">↑</kbd> historique
        </span>
      </div>
    </div>
  );
}
