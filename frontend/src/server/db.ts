import { sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { MIGRATIONS } from "./migrations";
import { schema } from "./schema";

// Base de données. En production : Postgres (Neon) via DATABASE_URL. En
// développement et dans les tests : PGlite, un Postgres complet qui tourne
// dans Node, sans serveur à installer.
//
// Panne = bloque tout : en production, sans DATABASE_URL, on refuse de
// démarrer plutôt que de basculer sur une base locale éphémère.

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

let instance: Promise<Db> | null = null;

export function getDb(): Promise<Db> {
  instance ??= open().catch((error) => {
    instance = null; // nouvel essai à la prochaine requête
    throw error;
  });
  return instance;
}

/** Pour les tests : une base neuve en mémoire. */
export async function openMemoryDb(): Promise<Db> {
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const db = drizzle(new PGlite(), { schema }) as unknown as Db;
  await migrate(db);
  return db;
}

async function open(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { default: postgres } = await import("postgres");
    const { drizzle } = await import("drizzle-orm/postgres-js");
    const client = postgres(url, {
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
      // Une requête qui traîne est coupée au bout de 5 s.
      connection: { statement_timeout: 5000 },
    });
    const db = drizzle(client, { schema }) as unknown as Db;
    await migrate(db);
    return db;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL manquant : les comptes sont désactivés.");
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const dir = process.env.PGLITE_DIR ?? ".data/pglite";
  // PGlite ne crée pas les dossiers parents d'une base sur disque.
  if (!dir.startsWith("memory://")) (await import("node:fs")).mkdirSync(dir, { recursive: true });
  const db = drizzle(new PGlite(dir), { schema }) as unknown as Db;
  await migrate(db);
  return db;
}

async function migrate(db: Db) {
  await db.execute(sql`CREATE TABLE IF NOT EXISTS schema_migrations (id integer PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`);
  const done = await db.execute(sql`SELECT id FROM schema_migrations`);
  const applied = new Set(rows<{ id: number }>(done).map((r) => Number(r.id)));
  for (const m of MIGRATIONS) {
    if (applied.has(m.id)) continue;
    await db.transaction(async (tx) => {
      // Deux instances qui démarrent ensemble : la seconde attend la première,
      // puis voit la migration déjà faite.
      await tx.execute(sql`SELECT pg_advisory_xact_lock(727274)`);
      const again = await tx.execute(sql`SELECT 1 FROM schema_migrations WHERE id = ${m.id}`);
      if (rows(again).length > 0) return;
      // Une requête à la fois : les pilotes refusent plusieurs commandes par envoi.
      for (const statement of splitStatements(m.sql)) await tx.execute(sql.raw(statement));
      await tx.execute(sql`INSERT INTO schema_migrations (id) VALUES (${m.id})`);
    });
  }
}

/** Découpe un script SQL en requêtes (pas de « ; » dans les commentaires des migrations). */
export function splitStatements(script: string): string[] {
  return script
    .split(/;\s*(?:\n|$)/)
    .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
    .filter(Boolean);
}

/** Lignes d'un résultat brut, quel que soit le pilote (postgres-js ou PGlite). */
export function rows<T>(result: unknown): T[] {
  if (Array.isArray(result)) return result as T[];
  return ((result as { rows?: T[] }).rows ?? []) as T[];
}
