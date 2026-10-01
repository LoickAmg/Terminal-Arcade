"use client";

import { useEffect } from "react";

// Enregistre le service worker (mode hors ligne). Seulement en production :
// en développement, un cache de pages gênerait le rechargement à chaud.
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Navigateur sans service worker ou contexte non sécurisé : le jeu
      // fonctionne simplement sans mode hors ligne.
    });
  }, []);
  return null;
}
