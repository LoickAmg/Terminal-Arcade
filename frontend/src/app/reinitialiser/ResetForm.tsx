"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient, authMessage } from "@/lib/account";

export function ResetForm() {
  const params = useSearchParams();
  const token = params.get("token");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!token || params.get("error")) {
    return (
      <p role="alert" className="mt-6 border-l-2 border-danger pl-3 text-sm text-danger">
        Ce lien n&apos;est plus valable. Demande-en un nouveau depuis le menu Compte.{" "}
        <Link href="/" className="text-accent underline">
          Retour au jeu
        </Link>
      </p>
    );
  }

  if (done) {
    return (
      <div className="mt-6 flex flex-col gap-4">
        <p role="status" className="border-l-2 border-good pl-3 text-sm text-good">
          Mot de passe enregistré. Tes autres appareils ont été déconnectés.
        </p>
        <Link href="/?compte=1" className="cut-tag self-start bg-accent px-5 py-2.5 font-mono text-sm font-bold tracking-[0.15em] text-on-accent">
          SE CONNECTER
        </Link>
      </div>
    );
  }

  return (
    <form
      className="mt-6 flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (pending) return;
        const form = new FormData(e.currentTarget);
        const password = String(form.get("password"));
        if (password !== String(form.get("confirm"))) {
          setError("Les deux mots de passe ne correspondent pas.");
          return;
        }
        setPending(true);
        setError("");
        try {
          const { error: failure } = await authClient.resetPassword({ newPassword: password, token });
          if (failure) setError(authMessage(failure));
          else setDone(true);
        } catch {
          setError("Les comptes sont momentanément indisponibles.");
        } finally {
          setPending(false);
        }
      }}
    >
      <label className="flex flex-col gap-1">
        <span className="type-label text-muted">Nouveau mot de passe (10 caractères au moins)</span>
        <input
          name="password"
          type="password"
          required
          minLength={10}
          maxLength={128}
          autoComplete="new-password"
          className="border border-line bg-surface-2 px-3 py-2 font-mono text-sm text-fg focus:border-accent focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="type-label text-muted">Encore une fois</span>
        <input
          name="confirm"
          type="password"
          required
          minLength={10}
          maxLength={128}
          autoComplete="new-password"
          className="border border-line bg-surface-2 px-3 py-2 font-mono text-sm text-fg focus:border-accent focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="cut-tag self-start bg-accent px-5 py-2.5 font-mono text-sm font-bold tracking-[0.15em] text-on-accent disabled:opacity-60"
      >
        {pending ? "ENREGISTREMENT…" : "ENREGISTRER"}
      </button>
      {error && (
        <p role="alert" className="border-l-2 border-danger pl-3 text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
