// Mode provisoire des comptes, tant qu'aucun service d'e-mail n'est prêt
// (ni Resend ni SMTP, voir server/email.ts) : NEXT_PUBLIC_EMAIL_VERIFICATION=off.
//
// - inscription par e-mail et mot de passe, compte utilisable tout de suite ;
// - les comptes non confirmés comptent au classement et ne sont pas purgés ;
// - pas de « mot de passe oublié » (il faudrait un e-mail) : on change son
//   mot de passe une fois connecté, en donnant l'ancien.
//
// Retour au mode normal : retirer la variable et redéployer. Les comptes
// existants confirment alors leur adresse à leur connexion suivante.
// Lue côté serveur comme côté navigateur (NEXT_PUBLIC_ : fixée au build).

export function emailVerificationOn(): boolean {
  return process.env.NEXT_PUBLIC_EMAIL_VERIFICATION !== "off";
}

/** Le compte compte-t-il comme confirmé (classement, sandbox) ? */
export function accountTrusted(user: { emailVerified: boolean }): boolean {
  return user.emailVerified || !emailVerificationOn();
}
