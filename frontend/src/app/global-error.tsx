"use client";

import { STATUS_URL } from "@/lib/maintenance";

// Dernier recours : la mise en page elle-même a planté. Styles en ligne, car
// la feuille de style globale peut manquer.
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const button = {
    padding: "0.6rem 1.2rem",
    font: "700 13px/1 ui-monospace, monospace",
    letterSpacing: "0.15em",
    textDecoration: "none",
    cursor: "pointer",
  } as const;
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          padding: 16,
          background: "#0a0a0a",
          color: "#e7e5dd",
          font: "16px/1.6 ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <main style={{ width: "100%", maxWidth: "36rem", border: "1px solid #262626", background: "#0d0d0d", padding: "2rem" }}>
          <p style={{ font: "700 12px/1 ui-monospace, monospace", letterSpacing: "0.2em", color: "#d4f54a" }}>ERREUR 500</p>
          <h1 style={{ margin: "1rem 0", fontSize: "3rem", lineHeight: 1, fontWeight: 900 }}>PANNE</h1>
          <p>Le site a rencontré un problème. Ta progression est enregistrée sur cet appareil : rien n&apos;est perdu.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: "1.5rem" }}>
            <button type="button" onClick={() => retry()} style={{ ...button, border: 0, background: "#d4f54a", color: "#0a0a0a" }}>
              RÉESSAYER
            </button>
            {/* Vrai rechargement voulu : la mise en page elle-même a planté. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/?retour=1" style={{ ...button, border: "1px solid #262626", color: "#e7e5dd" }}>
              SIGNALER CE PROBLÈME
            </a>
            {STATUS_URL && (
              <a href={STATUS_URL} rel="noopener" style={{ ...button, border: "1px solid #262626", color: "#e7e5dd" }}>
                ÉTAT DU SERVICE
              </a>
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
