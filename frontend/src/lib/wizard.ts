import { ansi } from "./ansi";
import { PET_ACCESSORIES, PET_COLORS, PET_FORMS, PET_STYLES, sanitizePetName, type PetConfig } from "./pet";
import { LEVEL_KEYWORDS, matches, type GameState, type LineResult, type Wizard, type WizardStep } from "./state";

// Compagnon : commandes pet et création pas à pas (pet init).

// --- Compagnon -----------------------------------------------------------

export function petCommand(state: GameState, args: string[]): LineResult {
  const [sub = "", ...rest] = args;
  switch (sub.toLowerCase()) {
    case "":
      return {
        state: { ...state, screen: { kind: "pet" } },
        out: [
          `${ansi.bold(state.pet.name)} · ${labelOf(PET_FORMS, state.pet.form)}, ${labelOf(PET_COLORS, state.pet.color).toLowerCase()}, accessoire : ${labelOf(PET_ACCESSORIES, state.pet.accessory).toLowerCase()}, style : ${labelOf(PET_STYLES, state.pet.style).toLowerCase()}`,
          ansi.dim("pet init : le recréer · pet name <nom> : le renommer"),
        ],
      };
    case "init": {
      const wizard: Wizard = { step: "style", draft: state.pet, firstTime: false };
      return {
        state: { ...state, wizard, screen: { kind: "pet" } },
        out: wizardQuestion(wizard),
      };
    }
    case "name": {
      const name = sanitizePetName(rest.join(" "));
      if (!name) return { state, out: [`Usage : ${ansi.cyan("pet name <nom>")} (lettres et chiffres, 16 max)`] };
      return {
        state: { ...state, pet: { ...state.pet, name } },
        out: [`Ton compagnon s'appelle maintenant ${ansi.bold(name)}.`],
        reaction: "happy",
      };
    }
    case "style": {
      const wanted = (rest[0] ?? "").toLowerCase();
      const style = PET_STYLES.find((s) => s.id === wanted);
      if (!style) return { state, out: [`Usage : ${ansi.cyan("pet style pixel")} ou ${ansi.cyan("pet style persona")}`] };
      return {
        state: { ...state, pet: { ...state.pet, style: style.id }, screen: { kind: "pet" } },
        out: [`${state.pet.name} passe en style ${style.label.toLowerCase()}.`],
        reaction: "cheer",
      };
    }
    case "hide":
      return { state: { ...state, petHidden: true }, out: [`${state.pet.name} se cache.`] };
    case "show":
      return { state: { ...state, petHidden: false }, out: [`${state.pet.name} revient.`], reaction: "happy" };
    default:
      return { state, out: [`pet ${sub} : sous-commande inconnue. Essaie pet, pet init, pet name, pet hide.`] };
  }
}

function labelOf<T extends { id: string; label: string }>(list: readonly T[], id: string) {
  return list.find((x) => x.id === id)?.label ?? id;
}

const WIZARD_LISTS = {
  style: PET_STYLES,
  form: PET_FORMS,
  color: PET_COLORS,
  accessory: PET_ACCESSORIES,
} as const;

const WIZARD_TITLES: Record<WizardStep, string> = {
  style: "Choisis son style",
  form: "Choisis sa forme",
  color: "Choisis sa couleur",
  accessory: "Choisis un accessoire",
  name: "Donne-lui un nom",
};

export function wizardQuestion(wizard: Wizard): string[] {
  const lines = ["", ansi.yellow(`── ${WIZARD_TITLES[wizard.step]} ──`)];
  if (wizard.step === "name") {
    lines.push(`Entrée pour garder ${ansi.bold(wizard.draft.name)}, ou tape un nouveau nom.`);
  } else {
    WIZARD_LISTS[wizard.step].forEach((item, i) => lines.push(`  ${ansi.bold(String(i + 1))}. ${item.label}`));
  }
  return lines;
}

/** Les choix proposés à l'étape en cours (bulles cliquables sur l'écran). */
export function wizardChoices(wizard: Wizard): string[] {
  return wizard.step === "name" ? [] : WIZARD_LISTS[wizard.step].map((x) => x.label);
}

export function wizardInput(state: GameState, wizard: Wizard, line: string): LineResult {
  if (matches(line, LEVEL_KEYWORDS.quit)) {
    return {
      state: { ...state, wizard: null, screen: { kind: "welcome" } },
      out: [ansi.dim(`Création annulée. ${state.pet.name} reste tel quel.`)],
    };
  }

  if (wizard.step === "name") {
    const name = line === "" ? wizard.draft.name : sanitizePetName(line);
    if (!name) return { state, out: [ansi.yellow("Lettres, chiffres, espaces et tirets seulement (16 max).")] };
    const pet = { ...wizard.draft, name };
    return {
      state: { ...state, pet, wizard: null, screen: { kind: "welcome" } },
      out: [
        "",
        `${ansi.bold(name)} est prêt.`,
        wizard.firstTime
          ? `Tape ${ansi.cyan("ls missions/")} pour choisir ton premier niveau.`
          : ansi.dim("Il reprend sa ronde au-dessus du terminal."),
      ],
      reaction: "cheer",
    };
  }

  const list = WIZARD_LISTS[wizard.step];
  const index = /^\d+$/.test(line)
    ? Number(line) - 1
    : list.findIndex((x) => x.label.toLowerCase() === line.toLowerCase());
  const item = list[index];
  if (!item) return { state, out: [ansi.yellow(`Tape un numéro entre 1 et ${list.length}.`)] };

  const draft = { ...wizard.draft, [wizard.step]: item.id } as PetConfig;
  const order: WizardStep[] = ["style", "form", "color", "accessory", "name"];
  const nextStep = order[order.indexOf(wizard.step) + 1];
  const next: Wizard = { ...wizard, draft, step: nextStep };
  return {
    state: { ...state, wizard: next },
    out: [ansi.dim(`→ ${item.label}`), ...wizardQuestion(next)],
    reaction: "happy",
  };
}
