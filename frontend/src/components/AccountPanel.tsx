"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient, authMessage } from "@/lib/account";
import type { SyncState } from "@/lib/useCloudSync";

// Panneau « Compte » du menu : connexion, inscription, mot de passe oublié,
// puis, une fois connecté, pseudo, synchronisation, export et suppression.
// Chaque bouton d'envoi est désactivé pendant la requête (pas de double
// envoi), et les messages ne révèlent jamais si une adresse a un compte.

export type AccountUser = { id: string; email: string; emailVerified: boolean; pseudo?: string | null };

type Tab = "signin" | "signup" | "forgot";

const field =
  "w-full border border-line bg-surface-2 px-3 py-2 font-mono text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none";
const primary =
  "cut-tag bg-accent px-5 py-2.5 font-mono text-sm font-bold tracking-[0.15em] text-on-accent transition-opacity disabled:cursor-wait disabled:opacity-60";
const secondary =
  "cut-tag border border-line px-4 py-2 font-mono text-xs font-bold tracking-[0.15em] text-fg hover:border-accent disabled:opacity-60";

function Notice({ tone, children }: { tone: "good" | "bad" | "info"; children: React.ReactNode }) {
  const color = tone === "good" ? "border-good text-good" : tone === "bad" ? "border-danger text-danger" : "border-line text-muted";
  return (
    <p role={tone === "bad" ? "alert" : "status"} className={`border-l-2 pl-3 text-sm ${color}`}>
      {children}
    </p>
  );
}

/** Petit état d'envoi commun aux formulaires. */
function useSubmit() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "good" | "bad" | "info"; text: string } | null>(null);
  const run = async (task: () => Promise<{ tone: "good" | "bad" | "info"; text: string } | null>) => {
    if (pending) return;
    setPending(true);
    setMessage(null);
    try {
      setMessage(await task());
    } catch {
      setMessage({ tone: "bad", text: "Les comptes sont momentanément indisponibles." });
    } finally {
      setPending(false);
    }
  };
  return { pending, message, run, setMessage };
}

export function AccountPanel({
  user,
  loading,
  googleEnabled,
  sync,
}: {
  user: AccountUser | null;
  loading: boolean;
  googleEnabled: boolean;
  sync: { state: SyncState; error: string; syncNow: () => void };
}) {
  if (loading) return <p className="font-mono text-sm text-muted">Chargement du compte…</p>;
  return user ? <SignedIn user={user} sync={sync} /> : <SignedOut googleEnabled={googleEnabled} />;
}

function SignedOut({ googleEnabled }: { googleEnabled: boolean }) {
  const [tab, setTab] = useState<Tab>("signin");
  const tabs: [Tab, string][] = [
    ["signin", "Connexion"],
    ["signup", "Créer un compte"],
    ["forgot", "Mot de passe oublié"],
  ];
  return (
    <div className="flex flex-col gap-6">
      <p className="text-muted">
        Le jeu se joue sans compte : ta progression reste sur cet appareil. Un compte la sauvegarde en ligne, la
        retrouve sur tes autres appareils et te place au classement.
      </p>
      <div role="tablist" className="flex flex-wrap gap-2">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`type-label border px-3 py-2 ${tab === id ? "border-accent text-accent" : "border-line text-muted hover:text-fg"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "signin" && <SignInForm googleEnabled={googleEnabled} />}
      {tab === "signup" && <SignUpForm googleEnabled={googleEnabled} />}
      {tab === "forgot" && <ForgotForm />}
    </div>
  );
}

function GoogleButton() {
  const { pending, message, run } = useSubmit();
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          run(async () => {
            const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/?compte=1" });
            return error ? { tone: "bad", text: authMessage(error) } : null;
          })
        }
        className="flex items-center justify-center gap-3 border border-line bg-fg px-4 py-2.5 font-sans text-sm font-bold text-[#1f1f1f] disabled:opacity-60"
      >
        <span aria-hidden className="text-base font-black text-[#4285f4]">
          G
        </span>
        {pending ? "Redirection…" : "Continuer avec Google"}
      </button>
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
    </div>
  );
}

function SignInForm({ googleEnabled }: { googleEnabled: boolean }) {
  const { pending, message, run } = useSubmit();
  return (
    <div className="flex max-w-md flex-col gap-4">
      {googleEnabled && (
        <>
          <GoogleButton />
          <p className="type-label text-center text-muted">ou</p>
        </>
      )}
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          run(async () => {
            const { error } = await authClient.signIn.email({
              email: String(form.get("email")),
              password: String(form.get("password")),
              callbackURL: "/?compte=1",
            });
            return error ? { tone: error.code === "EMAIL_NOT_VERIFIED" ? "info" : "bad", text: authMessage(error) } : null;
          });
        }}
      >
        <label className="flex flex-col gap-1">
          <span className="type-label text-muted">Adresse e-mail</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="type-label text-muted">Mot de passe</span>
          <input name="password" type="password" required autoComplete="current-password" className={field} />
        </label>
        <div>
          <button type="submit" disabled={pending} className={primary}>
            {pending ? "CONNEXION…" : "SE CONNECTER"}
          </button>
        </div>
        {message && <Notice tone={message.tone}>{message.text}</Notice>}
      </form>
    </div>
  );
}

function SignUpForm({ googleEnabled }: { googleEnabled: boolean }) {
  const { pending, message, run } = useSubmit();
  return (
    <div className="flex max-w-md flex-col gap-4">
      {googleEnabled && (
        <>
          <GoogleButton />
          <p className="type-label text-center text-muted">ou</p>
        </>
      )}
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const pseudo = String(form.get("pseudo")).trim();
          run(async () => {
            const { error } = await authClient.signUp.email({
              name: pseudo,
              pseudo,
              email: String(form.get("email")),
              password: String(form.get("password")),
              callbackURL: "/?compte=1",
            });
            if (error) return { tone: "bad", text: authMessage(error) };
            // Même message que l'adresse soit libre ou non.
            return {
              tone: "good",
              text: "Si cette adresse n'a pas encore de compte, un lien de confirmation vient d'y être envoyé. Pense à regarder les indésirables.",
            };
          });
        }}
      >
        <label className="flex flex-col gap-1">
          <span className="type-label text-muted">Pseudo public (3 à 20 : lettres, chiffres, _ -)</span>
          <input name="pseudo" required minLength={3} maxLength={20} pattern="[A-Za-z0-9_\-]{3,20}" autoComplete="username" className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="type-label text-muted">Adresse e-mail</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="type-label text-muted">Mot de passe (10 caractères au moins)</span>
          <input name="password" type="password" required minLength={10} maxLength={128} autoComplete="new-password" className={field} />
        </label>
        <label className="flex items-start gap-3 text-sm text-muted">
          <input name="age" type="checkbox" required className="mt-1 accent-[var(--accent)]" />
          <span>
            J&apos;ai 15 ans ou plus (avec l&apos;accord d&apos;un parent si j&apos;ai moins de 18 ans) et j&apos;accepte les{" "}
            <Link href="/cgu" className="text-accent underline">
              conditions d&apos;utilisation
            </Link>{" "}
            et la{" "}
            <Link href="/confidentialite" className="text-accent underline">
              politique de confidentialité
            </Link>
            .
          </span>
        </label>
        <div>
          <button type="submit" disabled={pending} className={primary}>
            {pending ? "ENVOI…" : "CRÉER MON COMPTE"}
          </button>
        </div>
        {message && <Notice tone={message.tone}>{message.text}</Notice>}
      </form>
    </div>
  );
}

function ForgotForm() {
  const { pending, message, run } = useSubmit();
  return (
    <form
      className="flex max-w-md flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        run(async () => {
          const { error } = await authClient.requestPasswordReset({ email: String(form.get("email")), redirectTo: "/reinitialiser" });
          if (error && error.status === 429) return { tone: "bad", text: authMessage(error) };
          return { tone: "good", text: "Si un compte utilise cette adresse, un lien pour changer le mot de passe vient d'y être envoyé." };
        });
      }}
    >
      <label className="flex flex-col gap-1">
        <span className="type-label text-muted">Adresse e-mail du compte</span>
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <div>
        <button type="submit" disabled={pending} className={primary}>
          {pending ? "ENVOI…" : "M'ENVOYER UN LIEN"}
        </button>
      </div>
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
    </form>
  );
}

const SYNC_LABEL: Record<SyncState, string> = {
  off: "Synchronisation arrêtée",
  syncing: "Synchronisation…",
  synced: "Progression sauvegardée en ligne",
  error: "Synchronisation impossible pour le moment",
};

function SignedIn({ user, sync }: { user: AccountUser; sync: { state: SyncState; error: string; syncNow: () => void } }) {
  const pseudo = useSubmit();
  const password = useSubmit();
  const remove = useSubmit();
  const out = useSubmit();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="type-label text-muted">Connecté en tant que</p>
        <p className="mt-1 text-2xl font-bold text-fg">{user.pseudo}</p>
        <p className="font-mono text-sm text-muted">
          {user.email} · {user.emailVerified ? <span className="text-good">adresse confirmée</span> : <span className="text-warn">adresse à confirmer</span>}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border border-line p-4">
        <span
          className={`size-2 rounded-full ${sync.state === "synced" ? "bg-good" : sync.state === "error" ? "bg-danger" : "bg-warn"}`}
          aria-hidden
        />
        <span className="flex-1 text-sm text-fg">
          {SYNC_LABEL[sync.state]}
          {sync.state === "error" && sync.error ? ` : ${sync.error}` : ""}
        </span>
        <button type="button" onClick={sync.syncNow} disabled={sync.state === "syncing"} className={secondary}>
          SYNCHRONISER
        </button>
      </div>

      <form
        className="flex max-w-md flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const value = String(new FormData(e.currentTarget).get("pseudo")).trim();
          pseudo.run(async () => {
            const { error } = await authClient.updateUser({ pseudo: value, name: value });
            return error ? { tone: "bad", text: authMessage(error) } : { tone: "good", text: "Pseudo changé." };
          });
        }}
      >
        <span className="type-label text-muted">Changer de pseudo</span>
        <div className="flex gap-2">
          <input name="pseudo" defaultValue={user.pseudo ?? ""} required minLength={3} maxLength={20} pattern="[A-Za-z0-9_\-]{3,20}" className={field} />
          <button type="submit" disabled={pseudo.pending} className={secondary}>
            OK
          </button>
        </div>
        {pseudo.message && <Notice tone={pseudo.message.tone}>{pseudo.message.text}</Notice>}
      </form>

      <div className="flex max-w-md flex-col gap-2">
        <span className="type-label text-muted">Mot de passe</span>
        <p className="text-sm text-muted">
          Ajoute un mot de passe (si tu te connectes avec Google, pour ne pas dépendre de lui) ou change-le : un lien
          t&apos;est envoyé par e-mail.
        </p>
        <div>
          <button
            type="button"
            disabled={password.pending}
            className={secondary}
            onClick={() =>
              password.run(async () => {
                const { error } = await authClient.requestPasswordReset({ email: user.email, redirectTo: "/reinitialiser" });
                return error ? { tone: "bad", text: authMessage(error) } : { tone: "good", text: `Lien envoyé à ${user.email}.` };
              })
            }
          >
            M&apos;ENVOYER LE LIEN
          </button>
        </div>
        {password.message && <Notice tone={password.message.tone}>{password.message.text}</Notice>}
      </div>

      <div className="flex flex-wrap gap-3">
        <a href="/api/account/export" download className={secondary}>
          EXPORTER MES DONNÉES
        </a>
        <button
          type="button"
          disabled={out.pending}
          className={secondary}
          onClick={() =>
            out.run(async () => {
              await authClient.signOut();
              return null;
            })
          }
        >
          SE DÉCONNECTER
        </button>
      </div>

      <div className="border border-danger/50 p-4">
        <p className="font-bold text-fg">Supprimer mon compte</p>
        <p className="mt-1 text-sm text-muted">
          Efface définitivement le compte, la sauvegarde en ligne et ta place au classement. La progression de cet
          appareil reste dans ton navigateur.
        </p>
        {confirmDelete ? (
          <form
            className="mt-3 flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const pass = String(new FormData(e.currentTarget).get("password") ?? "");
              remove.run(async () => {
                const { error } = await authClient.deleteUser(pass ? { password: pass } : {});
                if (error) {
                  return {
                    tone: "bad",
                    text:
                      error.code === "SESSION_EXPIRED"
                        ? "Par sécurité, reconnecte-toi puis recommence."
                        : authMessage(error),
                  };
                }
                return { tone: "good", text: "Compte supprimé." };
              });
            }}
          >
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Ton mot de passe (si ton compte en a un)"
              className={field}
            />
            <div className="flex flex-wrap gap-2">
              <button type="submit" disabled={remove.pending} className="cut-tag bg-danger px-4 py-2 font-mono text-xs font-bold tracking-[0.15em] text-white">
                {remove.pending ? "SUPPRESSION…" : "OUI, TOUT EFFACER"}
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} className={secondary}>
                ANNULER
              </button>
            </div>
          </form>
        ) : (
          <button type="button" onClick={() => setConfirmDelete(true)} className="cut-tag mt-3 border border-danger px-4 py-2 font-mono text-xs font-bold tracking-[0.15em] text-danger">
            SUPPRIMER MON COMPTE
          </button>
        )}
        {remove.message && <Notice tone={remove.message.tone}>{remove.message.text}</Notice>}
      </div>
    </div>
  );
}
