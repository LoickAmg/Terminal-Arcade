"use client";

import type { Progress } from "@terminal-arcade/shared";
import type { PetConfig } from "./pet";
import type { Settings } from "./themes";

// Sauvegarde en ligne et classement, côté navigateur. Chaque appel est coupé
// au bout de 10 s ; une sauvegarde qui échoue (réseau, serveur) est retentée
// avec un délai croissant. Le serveur fusionne : envoyer deux fois la même
// sauvegarde ne change rien.

export type CloudSave = { progress: Progress; pet: PetConfig | null; settings: Settings | null };

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...init.headers },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new HttpError(res.status, body.message ?? "Le serveur ne répond pas.");
  }
  return (await res.json()) as T;
}

const RETRIES = [1000, 3000, 9000];

/** Envoie la sauvegarde locale, renvoie la fusion faite par le serveur. */
export async function pushSave(save: CloudSave): Promise<CloudSave> {
  for (let attempt = 0; ; attempt++) {
    try {
      const { data } = await call<{ data: CloudSave }>("/api/save", { method: "PUT", body: JSON.stringify(save) });
      return data;
    } catch (error) {
      // 4xx : inutile d'insister (non connecté, sauvegarde refusée, trop d'envois).
      const retryable = !(error instanceof HttpError) || error.status >= 500;
      if (!retryable || attempt >= RETRIES.length) throw error;
      await new Promise((r) => setTimeout(r, RETRIES[attempt]));
    }
  }
}

export type LeaderboardRow = { rank: number; pseudo: string; xp: number; levelsPassed: number; tier: number };
export type Leaderboard = {
  sort: "xp" | "levels";
  page: number;
  pageSize: number;
  total: number;
  rows: LeaderboardRow[];
  me: { rank: number; pseudo: string; xp: number; levelsPassed: number } | null;
};

export function fetchLeaderboard(params: { sort: "xp" | "levels"; tier: string; page: number; me: boolean }) {
  const q = new URLSearchParams({ sort: params.sort, page: String(params.page) });
  if (params.tier) q.set("tier", params.tier);
  if (params.me) q.set("me", "1");
  return call<Leaderboard>(`/api/leaderboard?${q}`);
}
