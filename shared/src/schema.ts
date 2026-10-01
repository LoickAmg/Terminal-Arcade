import { z } from "zod";
import { SABOTAGES } from "./sabotages";

// Format d'un niveau (fichiers YAML de shared/levels). Les champs timer et
// chaos sont acceptés dès maintenant pour que les niveaux puissent les
// déclarer, mais le moteur ne les exploite qu'à partir des phases 2 et 3.

export const TIERS = ["script_kiddie", "sysadmin", "root_wizard"] as const;
export const TREES = [
  "file_system_ninja",
  "data_surgeon",
  "system_overlord",
  "network_phantom",
  "git_gud",
  "powershell",
] as const;
export const GAME_TYPES = ["classic", "timer", "chaos", "chaos_timer"] as const;

const hint = z.object({
  text: z.string().min(1),
  // Secondes retirées au timer (phase 2). En mode classique, un indice
  // réduit l'XP de la question.
  cost_s: z.number().int().nonnegative().default(10),
});

const base = {
  prompt: z.string().min(1),
  explain: z.string().optional(),
  hints: z.array(hint).default([]),
};

const commandQuestion = z.object({
  kind: z.literal("command"),
  ...base,
  accept: z.array(z.string().min(1)).min(1),
  // Sortie simulée affichée quand la commande est juste.
  output: z.string().optional(),
});

const choiceQuestion = {
  ...base,
  code: z.string().optional(),
  choices: z.array(z.string().min(1)).min(2).max(6),
  // Numéro du bon choix, à partir de 1 (ce que le joueur tape).
  answer: z.number().int().positive(),
};

const mcqQuestion = z.object({ kind: z.literal("mcq"), ...choiceQuestion });
const trapQuestion = z.object({ kind: z.literal("trap"), ...choiceQuestion });

const predictQuestion = z.object({
  kind: z.literal("predict"),
  ...base,
  code: z.string().min(1),
  accept: z.array(z.string()).min(1),
});

const fillQuestion = z.object({
  kind: z.literal("fill"),
  ...base,
  // Le trou est marqué par ___ dans le modèle.
  template: z.string().includes("___"),
  accept: z.array(z.string().min(1)).min(1),
});

// Défi réel, joué dans la sandbox Docker (niveaux runtime: docker). Le
// joueur tape de vraies commandes ; l'arbitre du serveur exécute « check »
// après chaque commande : code 0 = réussi, 1 = pas encore, 2 = mauvaise
// réponse soumise avec submit.
const taskQuestion = z.object({
  kind: z.literal("task"),
  ...base,
  // Script bash lancé (en tant qu'agent) au début de la question.
  setup: z.string().default(""),
  check: z.string().min(1),
  // Commande d'exemple, montrée quand le joueur passe la question.
  solution: z.string().min(1),
  // Génère un flag aléatoire, fourni à setup et check dans $FLAG.
  flag: z.boolean().default(false),
  // Résolution automatique, utilisée par le test d'intégration de la sandbox
  // pour prouver que le défi est faisable ($FLAG disponible).
  solve: z.string().optional(),
});

const choicesInRange = (q: object) =>
  !("choices" in q && "answer" in q) ||
  (q.answer as number) <= (q.choices as string[]).length;

const baseQuestionSchema = z
  .discriminatedUnion("kind", [commandQuestion, mcqQuestion, trapQuestion, predictQuestion, fillQuestion, taskQuestion])
  .refine(choicesInRange, { message: "answer dépasse le nombre de choix" });

// Variante : version modifiée de la question qu'Arcade peut substituer en
// cours de partie (sabotage « mutation » du mode Chaos).
const variant = { variant: baseQuestionSchema.optional() };

export const questionSchema = z
  .discriminatedUnion("kind", [
    commandQuestion.extend(variant),
    mcqQuestion.extend(variant),
    trapQuestion.extend(variant),
    predictQuestion.extend(variant),
    fillQuestion.extend(variant),
    taskQuestion.extend(variant),
  ])
  .refine(choicesInRange, { message: "answer dépasse le nombre de choix" });

const timerSchema = z.object({
  // random : le sens est tiré au lancement (rachat inclus si deficit_s > 0).
  mode: z.enum(["countdown", "chrono", "reverse", "buyback", "random"]).default("random"),
  // Départ du compte à rebours, limite du chrono, objectif du rachat.
  duration_s: z.number().int().positive(),
  // Temps de référence mesuré en jouant ; sert au bonus du chrono.
  par_s: z.number().int().positive(),
  // Rachat : retard de départ par rapport à duration_s.
  deficit_s: z.number().int().nonnegative().default(0),
  // On tape plus lentement sur téléphone.
  mobile_multiplier: z.number().min(1).default(1.5),
});

export const levelSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9_]+$/),
    title: z.string().min(1),
    // Phrase d'accroche affichée sur la bannière du niveau.
    hook: z.string().min(1),
    tier: z.enum(TIERS),
    tree: z.enum(TREES),
    type: z.enum(GAME_TYPES).default("classic"),
    replay: z
      .object({ chaos: z.boolean().default(true), timer: z.boolean().default(false) })
      .default({ chaos: true, timer: false }),
    timer: timerSchema.optional(),
    chaos: z
      .object({
        // Sabotages « signature », joués en priorité dans ce niveau.
        signature: z.array(z.enum(SABOTAGES)).default([]),
      })
      .optional(),
    runtime: z.enum(["browser", "docker"]).default("browser"),
    // Sandbox : script bash lancé (en tant qu'agent) au début de la partie.
    setup: z.string().optional(),
    // Sandbox : shell interactif du joueur (les scripts check/setup restent en bash).
    shell: z.enum(["bash", "pwsh"]).default("bash"),
    intro: z.string().optional(),
    questions: z.array(questionSchema).min(1),
    rewards: z.object({
      xp: z.number().int().positive(),
      // Niveau(x) débloqué(s) : la suite du palier, et parfois la suite d'un parcours.
      unlocks: z
        .union([z.string(), z.array(z.string())])
        .optional()
        .transform((u) => (u === undefined ? [] : Array.isArray(u) ? u : [u])),
    }),
  })
  .refine((l) => l.timer || !(l.type === "timer" || l.type === "chaos_timer" || l.replay.timer), {
    message: "un niveau Timer, ou rejouable en Timer, doit définir timer",
    path: ["timer"],
  })
  .refine(
    (l) =>
      !l.timer ||
      l.timer.mode !== "buyback" ||
      (l.timer.deficit_s > 0 && l.timer.deficit_s < l.timer.duration_s),
    { message: "le rachat demande 0 < deficit_s < duration_s", path: ["timer", "deficit_s"] },
  )
  .refine(
    (l) =>
      l.questions.every((q) => (q.kind === "task") === (l.runtime === "docker")) &&
      l.questions.every((q) => !q.variant || (q.variant.kind === "task") === (l.runtime === "docker")),
    { message: "les questions task sont réservées aux niveaux runtime: docker, et réciproquement", path: ["questions"] },
  )
  .refine((l) => !l.timer || l.timer.par_s < l.timer.duration_s, {
    message: "par_s doit être inférieur à duration_s",
    path: ["timer", "par_s"],
  });

export type Tier = (typeof TIERS)[number];
export type Tree = (typeof TREES)[number];
export type GameType = (typeof GAME_TYPES)[number];
export type Question = z.infer<typeof questionSchema>;
export type Level = z.infer<typeof levelSchema>;
