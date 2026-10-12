"use client";

import { useEffect } from "react";
import { STATUS_URL } from "@/lib/maintenance";

// Page de panne : une erreur inattendue pendant l'affichage. La progression
// locale n'est pas touchée ; « Réessayer » relance l'affichage.
export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <div className="frame w-full max-w-xl p-6 sm:p-10">
        <p className="type-label text-accent">Erreur 500</p>
        <h1 className="type-display tilt mt-4 text-5xl text-fg outlined sm:text-6xl">Panne</h1>
        <p className="mt-4 text-fg">
          Quelque chose a planté de notre côté. Ta progression est enregistrée sur cet appareil : rien n&apos;est perdu.
        </p>
        <pre className="mt-6 overflow-x-auto bg-term p-4 font-mono text-sm whitespace-pre-wrap text-fg">
          <span className="text-accent">joueur@terminal-arcade</span>:~$ ./jeu{"\n"}
          Segmentation fault (core dumped){error.digest ? `\nréférence : ${error.digest}` : ""}
        </pre>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="cut-tag bg-accent px-5 py-2.5 font-mono text-sm font-bold tracking-[0.15em] text-on-accent"
          >
            RÉESSAYER
          </button>
          {STATUS_URL && (
            <a
              href={STATUS_URL}
              rel="noopener"
              className="cut-tag border border-line px-5 py-2.5 font-mono text-sm font-bold tracking-[0.15em] text-fg"
            >
              ÉTAT DU SERVICE
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
