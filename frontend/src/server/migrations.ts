// Migrations SQL, appliquées dans l'ordre et une seule fois chacune (table
// schema_migrations). On n'en modifie jamais une déjà publiée : on en ajoute
// une nouvelle à la fin. Elles doivent suivre schema.ts.

export const MIGRATIONS: { id: number; sql: string }[] = [
  {
    id: 1,
    sql: `
      CREATE TABLE "user" (
        id text PRIMARY KEY,
        name text NOT NULL,
        email text NOT NULL UNIQUE,
        email_verified boolean NOT NULL DEFAULT false,
        image text,
        pseudo text NOT NULL,
        hidden boolean NOT NULL DEFAULT false,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      -- Deux joueurs ne peuvent pas avoir « Neo » et « neo ».
      CREATE UNIQUE INDEX user_pseudo_lower_idx ON "user" (lower(pseudo));
      -- Purge des comptes jamais vérifiés.
      CREATE INDEX user_unverified_idx ON "user" (created_at) WHERE NOT email_verified;

      CREATE TABLE session (
        id text PRIMARY KEY,
        expires_at timestamptz NOT NULL,
        token text NOT NULL UNIQUE,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        ip_address text,
        user_agent text,
        user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
      );
      CREATE INDEX session_user_idx ON session(user_id);

      CREATE TABLE account (
        id text PRIMARY KEY,
        account_id text NOT NULL,
        provider_id text NOT NULL,
        user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        access_token text,
        refresh_token text,
        id_token text,
        access_token_expires_at timestamptz,
        refresh_token_expires_at timestamptz,
        scope text,
        password text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX account_user_idx ON account(user_id);

      CREATE TABLE verification (
        id text PRIMARY KEY,
        identifier text NOT NULL,
        value text NOT NULL,
        expires_at timestamptz NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX verification_identifier_idx ON verification(identifier);

      CREATE TABLE rate_limit (
        id text PRIMARY KEY,
        key text NOT NULL UNIQUE,
        count integer NOT NULL,
        last_request bigint NOT NULL
      );

      CREATE TABLE saves (
        user_id text PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
        data jsonb NOT NULL,
        revision integer NOT NULL DEFAULT 1,
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE scores (
        user_id text PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
        xp integer NOT NULL DEFAULT 0,
        levels_passed integer NOT NULL DEFAULT 0,
        tier_rank integer NOT NULL DEFAULT 0,
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX scores_xp_idx ON scores(xp DESC, levels_passed DESC);
      CREATE INDEX scores_levels_idx ON scores(levels_passed DESC, xp DESC);
    `,
  },
];
