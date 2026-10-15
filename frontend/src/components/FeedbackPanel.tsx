"use client";

import Link from "next/link";
import { useState } from "react";
import type { Level } from "@terminal-arcade/shared";
import { FEEDBACK_KINDS, FEEDBACK_MAX, FEEDBACK_MIN, type FeedbackKind } from "@/lib/feedback";

// Panneau « Retours » du menu : un bug, une idée, un niveau à revoir. Le
// message part vers /api/feedback, qui l'enregistre et prévient l'éditeur.

const field =
  "w-full border border-line bg-surface-2 px-3 py-2 font-mono text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none";

const PLACEHOLDERS: Record<FeedbackKind, string> = {
  bug: "Ce qui s'est passé, et ce que tu attendais. Sur quel écran ?",
  idee: "Ton idée : une commande, un mode de jeu, un thème…",
  niveau: "Quelle question bloque, et pourquoi : réponse refusée alors qu'elle te semble juste, indice pas clair…",
  autre: "Dis-nous tout.",
};

export function FeedbackPanel({ signedIn, levels, theme }: { signedIn: boolean; levels: Level[]; theme: string }) {
  const [kind, setKind] = useState<FeedbackKind>("bug");
  const [message, setMessage] = useState("");
  const [levelId, setLevelId] = useState("");
  const [contact, setContact] = useState("");
  const [state, setState] = useState<{ tone: "good" | "bad"; text: string } | null>(null);
  const [pending, setPending] = useState(false);
  const length = message.trim().length;

  const submit = async (form: HTMLFormElement) => {
    if (pending) return;
    setPending(true);
    setState(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10_000),
        body: JSON.stringify({
          kind,
          message,
          levelId: levelId || undefined,
          contact: !signedIn && contact.trim() ? contact.trim() : undefined,
          website: String(new FormData(form).get("website") ?? "") || undefined,
          context: { view: "menu", screen: `${window.innerWidth}x${window.innerHeight}`, theme },
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setState({ tone: "bad", text: body.message ?? "Envoi impossible pour le moment." });
        return;
      }
      setMessage("");
      setLevelId("");
      setState({ tone: "good", text: "Merci ! Ton retour est bien arrivé. Chaque message est lu." });
    } catch {
      setState({ tone: "bad", text: "Le site ne répond pas : vérifie ta connexion et réessaie." });
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      className="flex max-w-xl flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        void submit(e.currentTarget);
      }}
    >
      <p className="text-muted">
        Un bug, une idée, un niveau trop dur ou mal expliqué ? Écris-le ici : chaque retour est lu, et sert à améliorer le
        jeu.
      </p>

      <fieldset className="flex flex-col gap-2">
        <legend className="type-label mb-2 text-muted">Type de retour</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(FEEDBACK_KINDS) as FeedbackKind[]).map((k) => (
            <label
              key={k}
              className={`type-label cursor-pointer border px-3 py-2 has-focus-visible:outline-2 has-focus-visible:outline-accent ${
                kind === k ? "border-accent text-accent" : "border-line text-muted hover:text-fg"
              }`}
            >
              <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} className="sr-only" />
              {FEEDBACK_KINDS[k]}
            </label>
          ))}
        </div>
      </fieldset>

      {(kind === "niveau" || kind === "bug") && (
        <label className="flex flex-col gap-1">
          <span className="type-label text-muted">Niveau concerné (facultatif)</span>
          <select value={levelId} onChange={(e) => setLevelId(e.target.value)} className={field}>
            <option value="">Aucun en particulier</option>
            {levels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.id} · {l.title}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="flex flex-col gap-1">
        <span className="flex justify-between">
          <span className="type-label text-muted">Ton message</span>
          <span className={`type-label ${length > FEEDBACK_MAX ? "text-danger" : "text-muted"}`}>
            {length}/{FEEDBACK_MAX}
          </span>
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={FEEDBACK_MIN}
          maxLength={FEEDBACK_MAX}
          rows={6}
          placeholder={PLACEHOLDERS[kind]}
          className={`${field} resize-y`}
        />
      </label>

      {!signedIn && (
        <label className="flex flex-col gap-1">
          <span className="type-label text-muted">Ton e-mail, si tu veux une réponse (facultatif)</span>
          <input type="email" value={contact} onChange={(e) => setContact(e.target.value)} autoComplete="email" maxLength={200} className={field} />
        </label>
      )}

      {/* Champ piège : invisible pour les joueurs, rempli par les robots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-px w-px opacity-0" />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending || length < FEEDBACK_MIN}
          className="cut-tag bg-accent px-5 py-2.5 font-mono text-sm font-bold tracking-[0.15em] text-on-accent transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "ENVOI…" : "ENVOYER"}
        </button>
        {length > 0 && length < FEEDBACK_MIN && (
          <span className="text-sm text-muted">Encore {FEEDBACK_MIN - length} caractère(s) au moins.</span>
        )}
      </div>

      {state && (
        <p role={state.tone === "bad" ? "alert" : "status"} className={`border-l-2 pl-3 text-sm ${state.tone === "good" ? "border-good text-good" : "border-danger text-danger"}`}>
          {state.text}
        </p>
      )}

      <p className="text-xs text-muted">
        Ton message, le niveau choisi et quelques informations techniques (taille d&apos;écran, thème) sont enregistrés et
        envoyés à l&apos;éditeur.{" "}
        <Link href="/confidentialite" className="text-accent underline">
          Confidentialité
        </Link>
      </p>
    </form>
  );
}
