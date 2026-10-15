import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page introuvable", robots: { index: false } };

// Page 404, à la manière d'un terminal qui ne connaît pas la commande.
export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <div className="frame w-full max-w-xl p-6 sm:p-10">
        <p className="type-label text-accent">Erreur 404</p>
        <h1 className="type-display tilt mt-4 text-5xl text-fg outlined sm:text-6xl">Introuvable</h1>
        <pre className="mt-6 overflow-x-auto bg-term p-4 font-mono text-sm text-fg">
          <span className="text-accent">joueur@terminal-arcade</span>:~$ cd cette-page{"\n"}
          bash: cd: cette-page: Aucun fichier ou dossier de ce type
        </pre>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="cut-tag inline-block bg-accent px-5 py-2.5 font-mono text-sm font-bold tracking-[0.15em] text-on-accent"
          >
            cd ~ · RETOUR AU JEU
          </Link>
          {/* Un lien cassé quelque part ? Le formulaire de retours du jeu. */}
          <Link
            href="/?retour=1"
            className="cut-tag inline-block border border-line px-5 py-2.5 font-mono text-sm font-bold tracking-[0.15em] text-fg hover:border-accent"
          >
            SIGNALER CE LIEN
          </Link>
        </div>
      </div>
    </main>
  );
}
