// Types de retours des joueurs, communs au formulaire, à l'API et à la page
// d'administration.

export const FEEDBACK_KINDS = { bug: "Bug", idee: "Idée", niveau: "Niveau à revoir", autre: "Autre" } as const;
export type FeedbackKind = keyof typeof FEEDBACK_KINDS;

export const FEEDBACK_STATUSES = { nouveau: "Nouveau", lu: "Lu", traite: "Traité" } as const;
export type FeedbackStatus = keyof typeof FEEDBACK_STATUSES;

export const FEEDBACK_MIN = 10;
export const FEEDBACK_MAX = 2000;
