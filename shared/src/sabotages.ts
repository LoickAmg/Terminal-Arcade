// Catalogue des sabotages d'Arcade (mode Chaos), par famille du cahier des
// charges. La famille « environnement hostile » n'existe que dans la
// sandbox Docker : Arcade y trafique le vrai shell du joueur.

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
  // Environnement hostile (sandbox seulement)
  "hostile_alias", // un alias piège remplace une commande courante
  "hostile_path", // une fausse commande passe devant la vraie dans le PATH
  "hostile_chmod", // un fichier du joueur perd tous ses droits
  "hostile_decoy", // un faux flag apparaît dans le dossier personnel
  "hostile_prompt", // l'invite affiche un faux dossier courant
] as const;

export type Sabotage = (typeof SABOTAGES)[number];

export type SabotageFamily = "doute" | "entrave" | "mutation" | "falsification" | "temps" | "hostile";

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
  hostile_alias: { family: "hostile", label: "alias piège dans le shell" },
  hostile_path: { family: "hostile", label: "fausse commande dans le PATH" },
  hostile_chmod: { family: "hostile", label: "fichier privé de ses droits" },
  hostile_decoy: { family: "hostile", label: "faux flag déposé" },
  hostile_prompt: { family: "hostile", label: "invite qui ment sur le dossier" },
};

export const HOSTILE: readonly Sabotage[] = ["hostile_alias", "hostile_path", "hostile_chmod", "hostile_decoy", "hostile_prompt"];
