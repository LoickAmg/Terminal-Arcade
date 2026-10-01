// Catalogue des sabotages d'Arcade (mode Chaos), par famille du cahier des
// charges. La famille « environnement hostile » arrivera avec Docker.

export const SABOTAGES = [
  // Doute : Arcade annonce un faux verdict.
  "false_red", // bonne réponse annoncée fausse : la question reste affichée
  "false_green", // mauvaise réponse annoncée juste : la partie avance
  // Entrave
  "block_key", // une touche ne répond plus pendant quelques secondes
  "close_terminal", // le terminal est fermé, il faut le rouvrir
  // Mutation
  "mutation", // l'énoncé change en cours de route (variante du niveau)
  // Falsification
  "falsify_code", // le code affiché à l'écran diffère de celui du terminal
  // Temps (seulement en partie chronométrée)
  "time_accel", // réel : le temps passe deux fois plus vite
  "time_recul", // réel : du temps est retiré
  "time_freeze", // perception : le timer semble figé
  "time_fluctuate", // perception : le timer semble avancer et reculer
] as const;

export type Sabotage = (typeof SABOTAGES)[number];

export type SabotageFamily = "doute" | "entrave" | "mutation" | "falsification" | "temps";

export const SABOTAGE_INFO: Record<Sabotage, { family: SabotageFamily; label: string }> = {
  false_red: { family: "doute", label: "faux verdict « faux »" },
  false_green: { family: "doute", label: "faux verdict « correct »" },
  block_key: { family: "entrave", label: "touche bloquée" },
  close_terminal: { family: "entrave", label: "terminal fermé" },
  mutation: { family: "mutation", label: "énoncé modifié" },
  falsify_code: { family: "falsification", label: "code falsifié à l'écran" },
  time_accel: { family: "temps", label: "temps accéléré" },
  time_recul: { family: "temps", label: "temps retiré" },
  time_freeze: { family: "temps", label: "timer figé (illusion)" },
  time_fluctuate: { family: "temps", label: "timer instable (illusion)" },
};
