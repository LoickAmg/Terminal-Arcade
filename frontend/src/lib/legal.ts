// Identité de l'éditeur, affichée dans les pages légales. Elle vient des
// variables d'environnement (publiques, puisqu'affichées) pour ne pas
// figer d'informations personnelles dans le code.

import { siteUrl } from "./site-url";

export const LEGAL = {
  name: process.env.NEXT_PUBLIC_LEGAL_NAME ?? "Mahouna",
  city: process.env.NEXT_PUBLIC_LEGAL_CITY ?? "Cotonou, Bénin",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  site: siteUrl(),
  updated: "3 octobre 2026",
};

/** Adresse de contact, ou rappel qu'elle reste à renseigner avant la mise en ligne. */
export const contact = () => LEGAL.email || "(adresse de contact à renseigner : NEXT_PUBLIC_CONTACT_EMAIL)";
