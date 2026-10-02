import type { MetadataRoute } from "next";

// Rend le jeu installable (écran d'accueil du téléphone, plein écran). Le
// mode hors ligne est assuré par public/sw.js.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Terminal Arcade",
    short_name: "Terminal Arcade",
    description: "Maîtrise le terminal en jouant.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    lang: "fr",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
