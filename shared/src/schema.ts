import { z } from "zod";

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

export const questionSchema = z
  .discriminatedUnion("kind", [
    commandQuestion,
    mcqQuestion,
    trapQuestion,
    predictQuestion,
    fillQuestion,
  ])
  .refine(
    (q) => !("choices" in q) || q.answer <= q.choices.length,
    { message: "answer dépasse le nombre de choix" },
  );

export const levelSchema = z.object({
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
  timer: z.record(z.string(), z.unknown()).optional(),
  chaos: z.record(z.string(), z.unknown()).optional(),
  runtime: z.enum(["browser", "docker"]).default("browser"),
  intro: z.string().optional(),
  questions: z.array(questionSchema).min(1),
  rewards: z.object({
    xp: z.number().int().positive(),
    unlocks: z.string().optional(),
  }),
});

export type Tier = (typeof TIERS)[number];
export type Tree = (typeof TREES)[number];
export type GameType = (typeof GAME_TYPES)[number];
export type Question = z.infer<typeof questionSchema>;
export type Level = z.infer<typeof levelSchema>;
