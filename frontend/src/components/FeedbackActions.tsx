"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FEEDBACK_STATUSES, type FeedbackStatus } from "@/lib/feedback";

// Boutons d'un retour sur la page /admin/retours : changer son statut ou le
// supprimer (après confirmation). La page se recharge ensuite.

const button = "type-label border px-3 py-1.5 disabled:opacity-50";

export function FeedbackActions({ id, status }: { id: string; status: FeedbackStatus }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);

  const send = async (body: { status?: FeedbackStatus; remove?: true }) => {
    setPending(true);
    setError("");
    try {
      const res = await fetch("/api/admin/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...body }),
      });
      if (!res.ok) setError("Action impossible.");
      else router.refresh();
    } catch {
      setError("Le site ne répond pas.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {(Object.keys(FEEDBACK_STATUSES) as FeedbackStatus[])
        .filter((s) => s !== status)
        .map((s) => (
          <button key={s} type="button" disabled={pending} onClick={() => send({ status: s })} className={`${button} border-line text-fg hover:border-accent`}>
            {s === "traite" ? "Marquer traité" : s === "lu" ? "Marquer lu" : "Remettre en nouveau"}
          </button>
        ))}
      {confirm ? (
        <>
          <button type="button" disabled={pending} onClick={() => send({ remove: true })} className={`${button} border-danger bg-danger text-white`}>
            Supprimer pour de bon
          </button>
          <button type="button" onClick={() => setConfirm(false)} className={`${button} border-line text-muted`}>
            Annuler
          </button>
        </>
      ) : (
        <button type="button" onClick={() => setConfirm(true)} className={`${button} border-danger/60 text-danger`}>
          Supprimer
        </button>
      )}
      {error && <span className="text-sm text-danger">{error}</span>}
    </div>
  );
}
