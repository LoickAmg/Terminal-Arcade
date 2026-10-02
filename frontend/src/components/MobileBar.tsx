"use client";

import { useRef, useState } from "react";
import { commonPrefix } from "@/lib/lineEditor";
import type { TerminalApi } from "./TerminalView";

// Saisie sur écran tactile. Les claviers virtuels gèrent mal la saisie
// directe dans xterm et n'ont ni Tab, ni flèches, ni Ctrl+C : on saisit ici
// et on envoie la ligne au terminal, qui l'affiche comme si elle était tapée.

export function MobileBar({
  api,
  completer,
  blockedKey,
  disabled,
}: {
  api: TerminalApi | null;
  completer: (buffer: string) => string[];
  // Chaos : touche « mangée » par le compagnon, terminal fermé.
  blockedKey: string | null;
  disabled: boolean;
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  // Position dans l'historique pendant la navigation avec ↑/↓.
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const count = (text: string) => (blockedKey ? text.toLowerCase().split(blockedKey).length - 1 : 0);

  const send = () => {
    if (disabled) return;
    api?.run(value);
    setValue("");
    setHistoryIndex(null);
  };

  const browse = (direction: -1 | 1) => {
    const history = api?.history() ?? [];
    if (history.length === 0) return;
    const current = historyIndex ?? history.length;
    const next = Math.min(history.length, Math.max(0, current + direction));
    setHistoryIndex(next === history.length ? null : next);
    setValue(next === history.length ? "" : history[next]);
  };

  const complete = () => {
    const candidates = completer(value);
    const prefix = commonPrefix(candidates);
    if (prefix.length > value.length) setValue(prefix);
  };

  const keys: { label: string; aria: string; action: () => void }[] = [
    { label: "TAB", aria: "Compléter", action: complete },
    { label: "↑", aria: "Commande précédente", action: () => browse(-1) },
    { label: "↓", aria: "Commande suivante", action: () => browse(1) },
    {
      label: "^C",
      aria: "Interrompre",
      action: () => {
        setValue("");
        api?.interrupt();
      },
    },
    { label: "ESC", aria: "Effacer la ligne", action: () => setValue("") },
    { label: "|", aria: "Insérer un pipe", action: () => setValue((v) => `${v}|`) },
    { label: "-", aria: "Insérer un tiret", action: () => setValue((v) => `${v}-`) },
    { label: "/", aria: "Insérer une barre oblique", action: () => setValue((v) => `${v}/`) },
  ];

  return (
    <div className="border-t border-line bg-surface px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="mb-2 flex gap-1.5 overflow-x-auto">
        {keys.map((k) => (
          <button
            key={k.label}
            type="button"
            aria-label={k.aria}
            // Empêche le bouton de voler le focus (le clavier resterait fermé).
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => {
              k.action();
              inputRef.current?.focus();
            }}
            className="min-w-11 shrink-0 border border-line bg-surface-2 px-2 py-1.5 font-mono text-sm font-bold text-fg active:bg-accent active:text-on-accent"
          >
            {k.label}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex gap-2"
      >
        <label htmlFor="mobile-input" className="sr-only">
          Commande
        </label>
        <input
          id="mobile-input"
          ref={inputRef}
          value={value}
          onChange={(e) => {
            // La touche bloquée ne s'ajoute pas ; le reste de la saisie est gardé.
            if (count(e.target.value) > count(value)) return;
            setValue(e.target.value);
          }}
          disabled={disabled}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="send"
          placeholder={disabled ? "terminal fermé…" : blockedKey ? `touche « ${blockedKey} » bloquée…` : "tape une commande…"}
          className="min-w-0 flex-1 border border-accent bg-term px-3 py-2 font-mono text-base text-fg placeholder:text-muted focus:outline-none"
        />
        <button type="submit" className="cut-tag bg-accent px-4 font-mono text-sm font-bold tracking-[0.15em] text-on-accent">
          ENTRÉE
        </button>
      </form>
    </div>
  );
}
