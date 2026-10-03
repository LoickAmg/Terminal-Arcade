"use client";

import { useEffect, useState } from "react";
import { fetchLeaderboard, type Leaderboard } from "@/lib/cloud";

// Panneau « Classement » du menu : tous les joueurs vérifiés, par XP ou par
// niveaux hackés, filtrables par palier, 20 par page, avec ton rang.

const TIER_NAMES = ["—", "Script Kiddie", "SysAdmin", "Root Wizard"];
const TIER_FILTERS: [string, string][] = [
  ["", "Tous"],
  ["script_kiddie", "Script Kiddie"],
  ["sysadmin", "SysAdmin"],
  ["root_wizard", "Root Wizard"],
];

export function LeaderboardPanel({ signedIn }: { signedIn: boolean }) {
  const [sort, setSort] = useState<"xp" | "levels">("xp");
  const [tier, setTier] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Leaderboard | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Chargement : état local du panneau, mis à jour quand la requête répond.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetchLeaderboard({ sort, tier, page, me: signedIn })
      .then((d) => {
        if (cancelled) return;
        setData(d);
        setError("");
      })
      .catch((e: Error) => !cancelled && setError(e.message || "Classement indisponible."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [sort, tier, page, signedIn]);

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  const chip = (active: boolean) =>
    `type-label border px-3 py-2 ${active ? "border-accent text-accent" : "border-line text-muted hover:text-fg"}`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Trier par">
        <button type="button" aria-pressed={sort === "xp"} onClick={() => (setSort("xp"), setPage(1))} className={chip(sort === "xp")}>
          Par XP
        </button>
        <button type="button" aria-pressed={sort === "levels"} onClick={() => (setSort("levels"), setPage(1))} className={chip(sort === "levels")}>
          Par niveaux hackés
        </button>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Palier atteint">
        {TIER_FILTERS.map(([id, label]) => (
          <button key={id || "all"} type="button" aria-pressed={tier === id} onClick={() => (setTier(id), setPage(1))} className={chip(tier === id)}>
            {label}
          </button>
        ))}
      </div>

      {data?.me && (
        <p className="border border-accent/60 bg-accent/10 px-4 py-3 text-fg">
          Ta place : <strong className="text-accent">n° {data.me.rank}</strong> · {data.me.xp} XP · {data.me.levelsPassed}{" "}
          {data.me.levelsPassed > 1 ? "niveaux" : "niveau"}
        </p>
      )}
      {!signedIn && <p className="text-sm text-muted">Crée un compte (menu Compte) pour apparaître au classement.</p>}

      {error ? (
        <p role="alert" className="border-l-2 border-danger pl-3 text-sm text-danger">
          {error} Réessaie dans un instant.
        </p>
      ) : (
        <div className={`overflow-x-auto transition-opacity ${loading ? "opacity-50" : ""}`} aria-busy={loading}>
          <table className="w-full min-w-[460px] font-mono text-sm">
            <thead>
              <tr className="type-label border-b border-line text-left text-muted">
                <th className="py-2 pr-3">Rang</th>
                <th className="py-2 pr-3">Joueur</th>
                <th className="py-2 pr-3">Palier</th>
                <th className="py-2 pr-3 text-right">Niveaux</th>
                <th className="py-2 text-right">XP</th>
              </tr>
            </thead>
            <tbody>
              {data?.rows.map((r) => (
                <tr key={`${r.rank}-${r.pseudo}`} className={`border-b border-line/60 ${data.me?.pseudo === r.pseudo ? "text-accent" : "text-fg"}`}>
                  <td className="py-2 pr-3">{r.rank <= 3 ? ["🥇", "🥈", "🥉"][r.rank - 1] : r.rank}</td>
                  <td className="max-w-[12rem] truncate py-2 pr-3 font-bold">{r.pseudo}</td>
                  <td className="py-2 pr-3 text-muted">{TIER_NAMES[r.tier] ?? "—"}</td>
                  <td className="py-2 pr-3 text-right">{r.levelsPassed}</td>
                  <td className="py-2 text-right">{r.xp}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data && data.rows.length === 0 && !loading && (
            <p className="py-6 text-center text-muted">Personne encore ici. La première place t&apos;attend.</p>
          )}
          {!data && loading && <p className="py-6 text-center text-muted">Chargement du classement…</p>}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center gap-3">
          <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)} className={chip(false)}>
            ‹ Précédent
          </button>
          <span className="type-label text-muted">
            Page {page} / {pages}
          </span>
          <button type="button" disabled={page >= pages || loading} onClick={() => setPage((p) => p + 1)} className={chip(false)}>
            Suivant ›
          </button>
        </div>
      )}
    </div>
  );
}
