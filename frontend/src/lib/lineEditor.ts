// Édition de la ligne de commande, indépendante de xterm.js : on lui donne
// les octets reçus du terminal, elle renvoie le nouvel état et les actions
// à exécuter (valider la ligne, interrompre, compléter, effacer l'écran).

export type EditorState = {
  buffer: string;
  cursor: number;
  history: string[];
  // Position dans l'historique pendant la navigation avec ↑/↓, sinon null.
  historyIndex: number | null;
  // Ligne en cours de saisie, mise de côté pendant la navigation.
  draft: string;
};

export type EditorAction =
  | { type: "submit"; line: string }
  | { type: "interrupt" }
  | { type: "complete" }
  | { type: "clearScreen" };

export const HISTORY_LIMIT = 100;

export function createEditor(history: string[] = []): EditorState {
  return { buffer: "", cursor: 0, history, historyIndex: null, draft: "" };
}

// Les caractères accentués comptent pour un seul caractère affiché.
const chars = (s: string) => Array.from(s);

function insert(state: EditorState, text: string): EditorState {
  const c = chars(state.buffer);
  c.splice(state.cursor, 0, ...chars(text));
  return { ...state, buffer: c.join(""), cursor: state.cursor + chars(text).length, historyIndex: null };
}

export function setBuffer(state: EditorState, text: string): EditorState {
  return { ...state, buffer: text, cursor: chars(text).length };
}

export function pushHistory(history: string[], line: string): string[] {
  if (line.trim() === "" || history.at(-1) === line) return history;
  return [...history, line].slice(-HISTORY_LIMIT);
}

function browse(state: EditorState, direction: -1 | 1): EditorState {
  const { history } = state;
  if (history.length === 0) return state;
  if (state.historyIndex === null) {
    if (direction === 1) return state;
    const index = history.length - 1;
    return { ...setBuffer(state, history[index]), historyIndex: index, draft: state.buffer };
  }
  const index = state.historyIndex + direction;
  if (index < 0) return state;
  if (index >= history.length) {
    return { ...setBuffer(state, state.draft), historyIndex: null, draft: "" };
  }
  return { ...setBuffer(state, history[index]), historyIndex: index };
}

const ESCAPES: Record<string, (s: EditorState) => EditorState> = {
  "\x1b[A": (s) => browse(s, -1),
  "\x1b[B": (s) => browse(s, 1),
  "\x1b[C": (s) => ({ ...s, cursor: Math.min(chars(s.buffer).length, s.cursor + 1) }),
  "\x1b[D": (s) => ({ ...s, cursor: Math.max(0, s.cursor - 1) }),
  "\x1b[H": (s) => ({ ...s, cursor: 0 }),
  "\x1bOH": (s) => ({ ...s, cursor: 0 }),
  "\x1b[F": (s) => ({ ...s, cursor: chars(s.buffer).length }),
  "\x1bOF": (s) => ({ ...s, cursor: chars(s.buffer).length }),
  "\x1b[3~": (s) => {
    const c = chars(s.buffer);
    if (s.cursor >= c.length) return s;
    c.splice(s.cursor, 1);
    return { ...s, buffer: c.join("") };
  },
};

export function feed(
  initial: EditorState,
  data: string,
): { state: EditorState; actions: EditorAction[] } {
  let state = initial;
  const actions: EditorAction[] = [];
  let i = 0;

  while (i < data.length) {
    const rest = data.slice(i);
    if (rest.startsWith("\x1b")) {
      const key = Object.keys(ESCAPES).find((k) => rest.startsWith(k));
      if (key) {
        state = ESCAPES[key](state);
        i += key.length;
      } else {
        // Séquence inconnue (touches F1…) : on l'ignore entièrement.
        const match = /^\x1b(\[[0-9;]*[~A-Za-z]|O[A-Za-z]|.)?/.exec(rest);
        i += match?.[0].length ?? 1;
      }
      continue;
    }

    const ch = data[i];
    i += 1;
    if (ch === "\r" || ch === "\n") {
      // \r\n collé (ex. presse-papiers Windows) = une seule validation.
      if (ch === "\r" && data[i] === "\n") i += 1;
      actions.push({ type: "submit", line: state.buffer });
      state = {
        ...state,
        buffer: "",
        cursor: 0,
        history: pushHistory(state.history, state.buffer),
        historyIndex: null,
        draft: "",
      };
    } else if (ch === "\x7f" || ch === "\b") {
      if (state.cursor > 0) {
        const c = chars(state.buffer);
        c.splice(state.cursor - 1, 1);
        state = { ...state, buffer: c.join(""), cursor: state.cursor - 1 };
      }
    } else if (ch === "\x03") {
      actions.push({ type: "interrupt" });
      state = { ...state, buffer: "", cursor: 0, historyIndex: null, draft: "" };
    } else if (ch === "\x0c") {
      actions.push({ type: "clearScreen" });
    } else if (ch === "\t") {
      actions.push({ type: "complete" });
    } else if (ch === "\x15") {
      // Ctrl+U : efface le début de la ligne.
      state = { ...state, buffer: chars(state.buffer).slice(state.cursor).join(""), cursor: 0 };
    } else if (ch >= " ") {
      // Une surrogate pair (emoji) arrive en deux unités : on les garde ensemble.
      const code = ch.charCodeAt(0);
      if (code >= 0xd800 && code <= 0xdbff && i < data.length) {
        state = insert(state, ch + data[i]);
        i += 1;
      } else {
        state = insert(state, ch);
      }
    }
  }
  return { state, actions };
}

/** Partie commune à toutes les propositions (complétion façon bash). */
export function commonPrefix(values: string[]): string {
  if (values.length === 0) return "";
  let prefix = values[0];
  for (const v of values.slice(1)) {
    while (!v.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}
