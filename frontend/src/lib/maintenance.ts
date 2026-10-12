// Mode maintenance et page de panne.
//
// MAINTENANCE_MODE=1 (variable Vercel, puis redéploiement) : toutes les pages
// répondent 503 avec la page ci-dessous, et l'API répond 503 en JSON.
// /api/health reste joignable pour que la surveillance voie la vraie santé.
// MAINTENANCE_MESSAGE remplace le texte par défaut ; NEXT_PUBLIC_STATUS_URL
// (page publique UptimeRobot) ajoute un lien « état du service ».

export const STATUS_URL = process.env.NEXT_PUBLIC_STATUS_URL ?? "";

export const maintenanceOn = () => process.env.MAINTENANCE_MODE === "1";

const DEFAULT_MESSAGE = "Le jeu est en maintenance. Ta progression est en sécurité : reviens dans quelques minutes.";

const escape = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Page autonome (styles en ligne, aucun script) : elle ne dépend ni du build ni de la base. */
export function maintenanceHtml(message = process.env.MAINTENANCE_MESSAGE || DEFAULT_MESSAGE, statusUrl = STATUS_URL): string {
  const status = /^https:\/\//.test(statusUrl)
    ? `<a href="${escape(statusUrl)}" rel="noopener">État du service</a>`
    : "";
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Maintenance · Terminal Arcade</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100dvh; display: grid; place-items: center; padding: 16px;
    background: #0a0a0a; color: #e7e5dd; font: 16px/1.6 ui-sans-serif, system-ui, sans-serif; }
  main { width: 100%; max-width: 36rem; border: 1px solid #262626; background: #0d0d0d; padding: 2rem; }
  .label { font: 700 12px/1 ui-monospace, monospace; letter-spacing: .2em; text-transform: uppercase; color: #d4f54a; }
  h1 { margin: 1rem 0; font-size: clamp(2.2rem, 8vw, 3.2rem); line-height: 1; font-weight: 900; text-transform: uppercase; }
  pre { margin: 1.5rem 0 0; padding: 1rem; background: #080808; overflow-x: auto; font: 14px/1.6 ui-monospace, monospace; white-space: pre-wrap; }
  .prompt { color: #d4f54a; }
  a { display: inline-block; margin-top: 1.5rem; padding: .6rem 1.2rem; background: #d4f54a; color: #0a0a0a;
    font: 700 13px/1 ui-monospace, monospace; letter-spacing: .15em; text-decoration: none; text-transform: uppercase; }
</style>
</head>
<body>
<main>
  <p class="label">Erreur 503</p>
  <h1>Maintenance</h1>
  <p>${escape(message)}</p>
  <pre><span class="prompt">joueur@terminal-arcade</span>:~$ systemctl status terminal-arcade
● terminal-arcade : en maintenance, retour imminent</pre>
  ${status}
</main>
</body>
</html>`;
}
