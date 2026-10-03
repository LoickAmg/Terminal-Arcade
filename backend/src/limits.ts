// Garde-fous pour un serveur partagé : combien de parties par adresse, à
// quelle fréquence, et combien de sortie un conteneur peut envoyer. Logique
// pure (horloge passée en paramètre) pour être testée sans réseau ni Docker.

/** Fenêtre glissante : au plus `max` événements par `windowMs`, par clé. */
export class RateLimiter {
  private hits = new Map<string, number[]>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
  ) {}

  /** Enregistre un événement s'il est permis ; renvoie false sinon. */
  take(key: string, now = Date.now()): boolean {
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (recent.length >= this.max) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }

  /** Oublie les clés sans événement récent (à appeler de temps en temps). */
  prune(now = Date.now()) {
    for (const [key, times] of this.hits) {
      if (times.every((t) => now - t >= this.windowMs)) this.hits.delete(key);
    }
  }
}

/** Débit de sortie d'un conteneur : octets envoyés sur une fenêtre glissante. */
export class OutputMeter {
  private chunks: [time: number, bytes: number][] = [];
  private total = 0;

  constructor(
    private readonly maxBytes: number,
    private readonly windowMs: number,
  ) {}

  /** Ajoute une sortie ; renvoie false si la limite de la fenêtre est dépassée. */
  add(bytes: number, now = Date.now()): boolean {
    this.chunks.push([now, bytes]);
    this.total += bytes;
    while (this.chunks.length && now - this.chunks[0][0] >= this.windowMs) {
      this.total -= this.chunks.shift()![1];
    }
    return this.total <= this.maxBytes;
  }
}

/**
 * Adresse du client : un en-tête de proxy n'est cru que si on l'a demandé.
 * « cloudflare » : derrière un Cloudflare Tunnel, toutes les connexions
 * arrivent de Cloudflare ; la vraie adresse est dans CF-Connecting-IP.
 */
export function clientAddress(
  headers: Record<string, string | string[] | undefined>,
  remote: string,
  trust: "none" | "proxy" | "cloudflare",
): string {
  if (trust === "cloudflare") {
    const cf = headers["cf-connecting-ip"];
    const ip = (Array.isArray(cf) ? cf[0] : cf)?.trim();
    if (ip) return ip;
  }
  if (trust === "proxy") {
    const forwarded = headers["x-forwarded-for"];
    const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim();
    if (first) return first;
  }
  return remote;
}

/** Comparaison en temps constant du jeton d'accès. */
export function tokenMatches(given: unknown, expected: string): boolean {
  if (typeof given !== "string" || given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
