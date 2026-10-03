import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le paquet partagé est livré en TypeScript, Next le compile.
  transpilePackages: ["@terminal-arcade/shared"],
  // Argon2 (binaire natif) et PGlite (WebAssembly) restent hors du bundle
  // serveur : ils sont chargés tels quels depuis node_modules.
  serverExternalPackages: ["@node-rs/argon2", "@electric-sql/pglite"],
  // Le service worker doit toujours être relu, sinon une nouvelle version
  // du jeu resterait bloquée derrière l'ancienne.
  async headers() {
    return [
      {
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
