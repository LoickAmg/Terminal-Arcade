"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Bandeau d'information sur les cookies. Il n'y a rien à accepter ni à
// refuser : le seul cookie est celui de la session (strictement nécessaire)
// et la mesure d'audience se fait sans cookie. Le bandeau informe, une fois.

const KEY = "terminal-arcade.cookies-info";

export function CookieNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique du stockage local
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      // Stockage indisponible : on n'insiste pas.
    }
  }, []);

  if (!open) return null;
  return (
    <aside
      aria-label="Cookies"
      className="fixed right-3 bottom-3 z-[70] max-w-sm border border-line bg-surface/95 p-4 text-sm text-fg shadow-[0_20px_60px_-20px_rgb(0_0_0/0.8)] backdrop-blur-md"
    >
      <p>
        Pas de pistage ici : un seul cookie, celui qui te garde connecté, et une mesure d&apos;audience sans cookie.{" "}
        <Link href="/confidentialite" className="text-accent underline">
          En savoir plus
        </Link>
      </p>
      <button
        type="button"
        onClick={() => {
          try {
            localStorage.setItem(KEY, "1");
          } catch {}
          setOpen(false);
        }}
        className="cut-tag mt-3 bg-accent px-4 py-1.5 font-mono text-xs font-bold tracking-[0.15em] text-on-accent"
      >
        COMPRIS
      </button>
    </aside>
  );
}
