"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Barre d'information sur les cookies. Il n'y a rien à accepter ni à
// refuser : le seul cookie est celui de la session (strictement nécessaire)
// et la mesure d'audience se fait sans cookie. La barre informe, une fois.
//
// Elle occupe le bas de l'écran sans rien recouvrir : sa hauteur est publiée
// dans --notice-h, que les écrans plein cadre retranchent de leur hauteur.

const KEY = "terminal-arcade.cookies-info";

export function CookieNotice() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique du stockage local
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      // Stockage indisponible : on n'insiste pas.
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!open || !el) return;
    const root = document.documentElement;
    const publish = () => root.style.setProperty("--notice-h", `${el.offsetHeight}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    // Rotation d'écran, fenêtre redimensionnée : le texte passe sur plus de lignes.
    window.addEventListener("resize", publish);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", publish);
      root.style.removeProperty("--notice-h");
    };
  }, [open]);

  if (!open) return null;
  return (
    <aside
      ref={ref}
      aria-label="Cookies"
      className="fixed inset-x-0 bottom-0 z-[70] flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-line bg-surface px-4 py-2 text-xs text-fg sm:py-2.5 sm:text-sm"
    >
      <p className="text-center">
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
        className="cut-tag shrink-0 bg-accent px-4 py-1.5 font-mono text-xs font-bold tracking-[0.15em] text-on-accent"
      >
        COMPRIS
      </button>
    </aside>
  );
}
