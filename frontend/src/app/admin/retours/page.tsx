import type { Metadata } from "next";
import { sql } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FeedbackActions } from "@/components/FeedbackActions";
import { FEEDBACK_KINDS, FEEDBACK_STATUSES, type FeedbackKind, type FeedbackStatus } from "@/lib/feedback";
import { getAuth } from "@/server/auth";
import { getDb, rows } from "@/server/db";
import { isAdmin, type SessionUser } from "@/server/http";

// Retours des joueurs, pour l'éditeur seul (ADMIN_EMAIL, adresse confirmée).
// Pour tout autre visiteur, la page n'existe pas (404) : rien n'indique
// qu'il y a une administration.

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Retours", robots: { index: false, follow: false } };

type Row = {
  id: string;
  created_at: string;
  kind: FeedbackKind;
  message: string;
  level_id: string | null;
  contact: string | null;
  context: { screen?: string; theme?: string; view?: string; userAgent?: string };
  status: FeedbackStatus;
  pseudo: string | null;
  email: string | null;
};

const FILTERS: (FeedbackStatus | "tous")[] = ["nouveau", "lu", "traite", "tous"];

export default async function AdminFeedbackPage({ searchParams }: { searchParams: Promise<{ statut?: string }> }) {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdmin((session?.user as SessionUser | undefined) ?? null)) notFound();

  const { statut } = await searchParams;
  const filter = FILTERS.includes(statut as FeedbackStatus) ? (statut as FeedbackStatus | "tous") : "nouveau";
  const db = await getDb();
  const list = rows<Row>(
    await db.execute(sql`
      SELECT f.id, f.created_at, f.kind, f.message, f.level_id, f.contact, f.context, f.status, u.pseudo, u.email
      FROM feedback f LEFT JOIN "user" u ON u.id = f.user_id
      ${filter === "tous" ? sql`` : sql`WHERE f.status = ${filter}`}
      ORDER BY f.created_at DESC
      LIMIT 200`),
  );
  const counts = Object.fromEntries(
    rows<{ status: FeedbackStatus; n: number }>(await db.execute(sql`SELECT status, count(*)::int AS n FROM feedback GROUP BY status`)).map(
      (r) => [r.status, r.n],
    ),
  ) as Partial<Record<FeedbackStatus, number>>;
  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Porto-Novo" });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav aria-label="Fil d'Ariane" className="type-label mb-6 flex flex-wrap gap-2 text-muted">
        <Link href="/" className="hover:text-fg">
          Terminal Arcade
        </Link>
        <span>/</span>
        <span className="text-accent">Retours</span>
      </nav>
      <h1 className="type-display tilt text-4xl text-fg outlined sm:text-5xl">Retours</h1>

      <div role="tablist" className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={`/admin/retours?statut=${f}`}
            className={`type-label border px-3 py-2 ${filter === f ? "border-accent text-accent" : "border-line text-muted hover:text-fg"}`}
          >
            {f === "tous" ? "Tous" : FEEDBACK_STATUSES[f]}
            {f !== "tous" && ` (${counts[f] ?? 0})`}
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-8 text-muted">Aucun retour ici pour le moment.</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-4">
          {list.map((r) => (
            <li key={r.id} className="frame flex flex-col gap-3 p-5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="type-label text-accent">{FEEDBACK_KINDS[r.kind]}</span>
                {r.level_id && <span className="font-mono text-sm text-fg">{r.level_id}</span>}
                <span className="type-label text-muted">{date.format(new Date(r.created_at))}</span>
                <span className="type-label ml-auto text-muted">{FEEDBACK_STATUSES[r.status]}</span>
              </div>
              <p className="whitespace-pre-wrap text-fg">{r.message}</p>
              <p className="text-sm text-muted">
                {r.pseudo ? (
                  <>
                    {r.pseudo} · <a href={`mailto:${r.email}`} className="text-accent underline">{r.email}</a>
                  </>
                ) : r.contact ? (
                  <>
                    Anonyme · répondre à <a href={`mailto:${r.contact}`} className="text-accent underline">{r.contact}</a>
                  </>
                ) : (
                  "Anonyme, sans adresse"
                )}
              </p>
              <p className="font-mono text-xs text-muted">
                écran {r.context.screen ?? "?"} · thème {r.context.theme ?? "?"} · {r.context.userAgent ?? ""}
              </p>
              <FeedbackActions id={r.id} status={r.status} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
