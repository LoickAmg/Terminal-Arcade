import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security-headers";

const production = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Le paquet partagé est livré en TypeScript, Next le compile.
  transpilePackages: ["@terminal-arcade/shared"],
  // Argon2 (binaire natif) et PGlite (WebAssembly) restent hors du bundle
  // serveur : ils sont chargés tels quels depuis node_modules.
  serverExternalPackages: ["@node-rs/argon2", "@electric-sql/pglite"],
  // Pas d'en-tête « X-Powered-By: Next.js » : rien à révéler sur la pile.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders({
          production,
          sandboxUrl: process.env.NEXT_PUBLIC_SANDBOX_URL ?? "http://localhost:3108",
        }),
      },
      {
        // Le service worker doit toujours être relu, sinon une nouvelle version
        // du jeu resterait bloquée derrière l'ancienne.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
    ];
  },
};

export default nextConfig;
