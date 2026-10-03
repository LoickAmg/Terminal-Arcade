"use client";

import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Client des comptes (Better Auth), sur la même origine que le site. La
// session vit dans un cookie httpOnly : le navigateur ne garde rien de
// sensible lisible par le code de la page.

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        pseudo: { type: "string", required: false },
        hidden: { type: "boolean", required: false, input: false },
      },
    }),
  ],
});

/** Message lisible pour une erreur de Better Auth, sans révéler l'existence d'un compte. */
export function authMessage(error: { status?: number; code?: string; message?: string } | null | undefined): string {
  if (!error) return "";
  switch (error.code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return "Adresse ou mot de passe incorrect.";
    case "EMAIL_NOT_VERIFIED":
      return "Confirme d'abord ton adresse : un nouveau lien vient de t'être envoyé.";
    case "PASSWORD_TOO_SHORT":
      return "Mot de passe trop court : 10 caractères au moins.";
    case "PASSWORD_TOO_LONG":
      return "Mot de passe trop long : 128 caractères au plus.";
    case "INVALID_EMAIL":
      return "Adresse e-mail invalide.";
    case "INVALID_TOKEN":
      return "Ce lien n'est plus valable. Demande-en un nouveau.";
  }
  if (error.status === 429) return "Trop de tentatives. Réessaie dans quelques minutes.";
  if (error.status === 503 || error.status === 0 || error.status === undefined) return "Les comptes sont momentanément indisponibles.";
  return error.message || "Une erreur est survenue.";
}
