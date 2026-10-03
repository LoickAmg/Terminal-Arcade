import Link from "next/link";
import { LEGAL } from "@/lib/legal";

// Gabarit des pages légales : un cadre lisible, un titre, une date de mise
// à jour, et les liens entre les trois pages.

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <nav aria-label="Fil d'Ariane" className="type-label mb-6 flex flex-wrap gap-2 text-muted">
        <Link href="/" className="hover:text-fg">
          Terminal Arcade
        </Link>
        <span>/</span>
        <span className="text-accent">{title}</span>
      </nav>
      <article className="frame px-5 py-8 sm:px-10">
        <h1 className="type-display tilt text-4xl text-fg outlined sm:text-5xl">{title}</h1>
        <p className="type-label mt-3 text-muted">Mise à jour : {LEGAL.updated}</p>
        <div className="legal mt-8 flex flex-col gap-4 leading-relaxed text-fg/90">{children}</div>
      </article>
      <footer className="type-label mt-6 flex flex-wrap gap-4 text-muted">
        <Link href="/mentions-legales" className="hover:text-fg">
          Mentions légales
        </Link>
        <Link href="/confidentialite" className="hover:text-fg">
          Confidentialité
        </Link>
        <Link href="/cgu" className="hover:text-fg">
          Conditions d&apos;utilisation
        </Link>
        <Link href="/" className="text-accent hover:text-fg">
          ‹ Retour au jeu
        </Link>
      </footer>
    </main>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-6 font-mono text-sm font-bold tracking-[0.18em] text-accent uppercase">{children}</h2>;
}
