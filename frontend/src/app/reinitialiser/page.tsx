import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetForm } from "./ResetForm";

export const metadata: Metadata = {
  title: "Nouveau mot de passe · Terminal Arcade",
  robots: { index: false },
};

// Page d'arrivée du lien « mot de passe oublié » (ou « ajouter un mot de
// passe ») : /reinitialiser?token=…
export default function ResetPage() {
  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <div className="frame w-full max-w-md p-6 sm:p-8">
        <p className="type-label text-accent">Compte</p>
        <h1 className="type-display tilt mt-3 text-4xl text-fg outlined">Nouveau mot de passe</h1>
        <Suspense fallback={<p className="mt-6 font-mono text-sm text-muted">Chargement…</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </main>
  );
}
