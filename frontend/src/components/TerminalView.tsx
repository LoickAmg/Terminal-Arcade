"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { mono } from "@/lib/fonts";
import { commonPrefix, createEditor, feed, setBuffer, type EditorState } from "@/lib/lineEditor";
import { isStringArray, load, save } from "@/lib/storage";

export type LineOutcome = { out: string[]; prompt: string; clear?: boolean };

export type TerminalApi = {
  print: (lines: string[]) => void;
  showPrompt: (prompt: string) => void;
  /** Tape une ligne à la place du joueur puis la valide (clic, barre mobile). */
  run: (line: string) => void;
  interrupt: () => void;
  focus: () => void;
  history: () => string[];
  /**
   * Mode sandbox : les frappes partent vers le shell distant au lieu de
   * l'éditeur de ligne local (null = retour au terminal du jeu).
   */
  setRemote: (remote: { send: (data: string) => void; resize: (cols: number, rows: number) => void } | null) => void;
  /** Sortie brute du shell distant. */
  writeRemote: (data: string) => void;
};

type Props = {
  onReady: (api: TerminalApi) => void;
  onLine: (line: string) => LineOutcome;
  completer: (buffer: string) => string[];
  // Saisie retirée avant traitement (touche bloquée, terminal fermé par le
  // compagnon en mode Chaos).
  filterInput: (data: string) => string;
  // Sur écran tactile, la saisie passe par la barre du bas : le terminal
  // n'ouvre pas le clavier virtuel quand on le touche.
  touchMode: boolean;
};

const THEME = {
  background: "#0A0A0A",
  foreground: "#EDEDED",
  cursor: "#6FD6F2",
  cursorAccent: "#0A0A0A",
  selectionBackground: "rgba(111, 214, 242, 0.35)",
  black: "#0A0A0A",
  red: "#FF4D57",
  green: "#4ADE80",
  yellow: "#FFD23F",
  blue: "#6FA8FF",
  magenta: "#E879F9",
  cyan: "#6FD6F2",
  white: "#D4D4D4",
  brightWhite: "#FFFFFF",
};

export default function TerminalView({ onReady, onLine, completer, filterInput, touchMode }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  // Les callbacks changent à chaque rendu du jeu ; le terminal, lui, n'est
  // créé qu'une fois. On lit donc toujours la dernière version via des refs.
  const onLineRef = useRef(onLine);
  const completerRef = useRef(completer);
  const onReadyRef = useRef(onReady);
  const filterRef = useRef(filterInput);
  useEffect(() => {
    onLineRef.current = onLine;
    completerRef.current = completer;
    onReadyRef.current = onReady;
    filterRef.current = filterInput;
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const term = new Terminal({
      fontFamily: mono.style.fontFamily,
      // Sur téléphone, une police plus petite laisse ~40 colonnes.
      fontSize: window.innerWidth < 640 ? 12 : 15,
      lineHeight: 1.25,
      cursorBlink: true,
      convertEol: true,
      scrollback: 2000,
      disableStdin: touchMode,
      theme: THEME,
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(host);

    let editor: EditorState = createEditor(load("history", [], isStringArray));
    let prompt = "";
    let remote: Parameters<TerminalApi["setRemote"]>[0] = null;

    const render = () => {
      if (remote) return;
      const chars = Array.from(editor.buffer);
      const back = chars.length - editor.cursor;
      term.write(`\r\x1b[2K${prompt}${editor.buffer}${back > 0 ? `\x1b[${back}D` : ""}`);
    };

    const showPrompt = (next: string) => {
      prompt = next;
      render();
    };

    const print = (lines: string[]) => {
      for (const line of lines) term.write(`${line}\r\n`);
    };

    const submit = (line: string) => {
      term.write("\r\n");
      save("history", editor.history);
      const result = onLineRef.current(line);
      if (result.clear) {
        term.clear();
        term.write("\x1b[2K\r");
      }
      print(result.out);
      showPrompt(result.prompt);
    };

    const complete = () => {
      const candidates = completerRef.current(editor.buffer);
      if (candidates.length === 0) return;
      const prefix = commonPrefix(candidates);
      if (prefix.length > editor.buffer.length) {
        editor = setBuffer(editor, prefix);
        render();
        return;
      }
      term.write("\r\n");
      print([candidates.map((c) => c.trimEnd()).join("   ")]);
      render();
    };

    const handleData = (data: string) => {
      const { state, actions } = feed(editor, data);
      editor = state;
      if (actions.length === 0) {
        render();
        return;
      }
      for (const action of actions) {
        if (action.type === "submit") submit(action.line);
        else if (action.type === "interrupt") {
          term.write("^C\r\n");
          render();
        } else if (action.type === "clearScreen") {
          term.clear();
          render();
        } else if (action.type === "complete") complete();
      }
    };

    const dataSub = term.onData((data) => {
      const allowed = filterRef.current(data);
      if (!allowed) return;
      if (remote) remote.send(allowed);
      else handleData(allowed);
    });

    const api: TerminalApi = {
      print: (lines) => {
        if (remote) {
          // Messages du jeu au milieu du shell distant : sur leurs propres lignes.
          term.write(`\r\n${lines.join("\r\n")}\r\n`);
          return;
        }
        // Écrit au-dessus de l'invite en cours, puis la réaffiche.
        term.write("\r\x1b[2K");
        print(lines);
        render();
      },
      showPrompt,
      run: (line) => {
        if (remote) {
          remote.send(`${line}\r`);
          return;
        }
        editor = setBuffer(editor, line);
        render();
        handleData("\r");
      },
      interrupt: () => handleData("\x03"),
      focus: () => term.focus(),
      history: () => editor.history,
      setRemote: (next) => {
        remote = next;
        term.write("\r\n");
        if (remote) remote.resize(term.cols, term.rows);
        else render();
      },
      writeRemote: (data) => term.write(data),
    };

    const resize = () => {
      try {
        fit.fit();
        remote?.resize(term.cols, term.rows);
      } catch {
        // Conteneur masqué (largeur nulle) : on réessaiera au prochain resize.
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    document.fonts?.ready.then(resize);
    resize();

    onReadyRef.current(api);
    if (!touchMode) term.focus();

    return () => {
      dataSub.dispose();
      observer.disconnect();
      term.dispose();
    };
  }, [touchMode]);

  return <div ref={hostRef} className="h-full w-full" />;
}
