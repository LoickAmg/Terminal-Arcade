// En-têtes de sécurité envoyés avec chaque page (voir next.config.ts).
//
// La politique de contenu (CSP) n'autorise que notre propre origine, plus le
// serveur de la sandbox pour la connexion du terminal. 'unsafe-inline' reste
// nécessaire pour les scripts : la page est statique, Next.js y insère des
// scripts en ligne (hydratation, thème appliqué avant l'affichage) et un
// nonce n'est possible qu'avec un rendu dynamique de chaque page.

export function securityHeaders(options: { production: boolean; sandboxUrl: string }) {
  const sandbox = new URL(options.sandboxUrl);
  const sandboxWs = `${sandbox.protocol === "https:" ? "wss:" : "ws:"}//${sandbox.host}`;
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${options.production ? "" : " 'unsafe-eval'"}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self' ${sandbox.origin} ${sandboxWs}${options.production ? "" : " ws: http://localhost:*"}`,
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(options.production ? ["upgrade-insecure-requests"] : []),
  ].join("; ");

  return [
    { key: "Content-Security-Policy", value: csp },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    // HTTPS obligatoire pendant deux ans, sous-domaines compris (production seulement).
    ...(options.production ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }] : []),
  ];
}
