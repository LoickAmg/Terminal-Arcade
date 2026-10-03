import { createServer } from "node:http";
import { join } from "node:path";
import { StringDecoder } from "node:string_decoder";
import { Server, type Socket } from "socket.io";
import { loadLevels } from "@terminal-arcade/shared/loader";
import { ReplayGuard, publicKeysFrom, verifyTicket } from "@terminal-arcade/shared/ticket";
import type { Level, Question } from "@terminal-arcade/shared";
import { HOSTILE_SCRIPTS, appendTyped, detectHostile } from "./hostile";
import { OutputMeter, RateLimiter, clientAddress, tokenMatches } from "./limits";
import { IMAGE, cleanupOrphans, createSandbox, imageReady, newFlag, runScript, wrapCheck, type Sandbox } from "./sandbox";

// Serveur des défis réels : un conteneur par partie, relié au terminal du
// navigateur par Socket.io. L'arbitre exécute le script « check » de la
// question après chaque commande et renvoie le verdict au jeu.
//
// N'écoute que sur 127.0.0.1 par défaut. Avant de l'ouvrir sur Internet,
// lire SECURITY.md : les réglages ci-dessous ne suffisent pas à eux seuls.

const env = process.env;
const PORT = Number(env.PORT ?? 3108);
const HOST = env.HOST ?? "127.0.0.1";
const ORIGINS = (env.ALLOWED_ORIGINS ?? "http://localhost:3000,http://localhost:3107,http://localhost:3109").split(",");
const MAX_SESSIONS = Number(env.MAX_SESSIONS ?? 4);
// Parties simultanées et démarrages par heure, par adresse IP.
const MAX_SESSIONS_PER_IP = Number(env.MAX_SESSIONS_PER_IP ?? 1);
const STARTS_PER_HOUR = Number(env.STARTS_PER_HOUR ?? 30);
// Parties simultanées par joueur (compte).
const MAX_SESSIONS_PER_USER = Number(env.MAX_SESSIONS_PER_USER ?? 1);
// Tickets signés par le site (clés publiques « kid:clé,… ») : seuls les
// joueurs connectés, à l'adresse confirmée, peuvent ouvrir une sandbox.
const TICKET_KEYS = env.SANDBOX_TICKET_PUBLIC_KEYS ? publicKeysFrom(env.SANDBOX_TICKET_PUBLIC_KEYS) : null;
const replays = new ReplayGuard();
setInterval(() => replays.prune(), 60_000).unref();
// Ancien jeton partagé : seulement en local, sans tickets.
const TOKEN = env.SANDBOX_TOKEN ?? "";
// Adresse du client : directe, derrière un proxy (X-Forwarded-For) ou
// derrière Cloudflare (CF-Connecting-IP).
const TRUST: "none" | "proxy" | "cloudflare" =
  env.TRUST_CLOUDFLARE === "1" ? "cloudflare" : env.TRUST_PROXY === "1" ? "proxy" : "none";
// Panne = bloque tout : un serveur de production sans clés refuse tout.
if (env.NODE_ENV === "production" && !TICKET_KEYS) {
  console.error("[sandbox] SANDBOX_TICKET_PUBLIC_KEYS manquant : toutes les connexions seront refusées.");
}
const SESSION_MAX_MS = 30 * 60_000;
const IDLE_MS = Number(env.IDLE_MINUTES ?? 10) * 60_000;
// Au-delà, la partie est coupée (déluge de sortie : yes, cat d'un gros fichier…).
const OUTPUT_BYTES = 4 * 1024 * 1024;
const OUTPUT_WINDOW_MS = 10_000;
const MAX_INPUT = 4096;

const startLimiter = new RateLimiter(STARTS_PER_HOUR, 60 * 60_000);
setInterval(() => startLimiter.prune(), 10 * 60_000).unref();

const levels = loadLevels(join(process.cwd(), "..", "shared", "levels"));
const dockerLevels = new Map(levels.filter((l) => l.runtime === "docker").map((l) => [l.id, l]));

type Session = {
  sandbox: Sandbox;
  ip: string;
  // Joueur authentifié par son ticket ("" en local, sans tickets).
  userId: string;
  idle: NodeJS.Timeout;
  level: Level;
  question: Question | null;
  index: number;
  flag: string;
  // Une vérification à la fois ; un verdict « réussi » par commande validée.
  checking: boolean;
  checkTimers: NodeJS.Timeout[];
  expiry: NodeJS.Timeout;
  // Ligne en cours de frappe et sabotages hostiles actifs (pour repérer
  // quand le joueur les démasque).
  typed: string;
  hostile: Set<string>;
};

const sessions = new Map<string, Session>();

async function stopSession(socket: Socket, reason: string) {
  const session = sessions.get(socket.id);
  if (!session) return;
  sessions.delete(socket.id);
  clearTimeout(session.expiry);
  clearTimeout(session.idle);
  session.checkTimers.forEach(clearTimeout);
  await session.sandbox.stop();
  console.log(`[sandbox] fin ${session.level.id} (${reason}) — ${sessions.size} en cours`);
}

async function runCheck(socket: Socket, session: Session) {
  const q = session.question;
  if (!q || q.kind !== "task" || session.checking || sessions.get(socket.id) !== session) return;
  session.checking = true;
  try {
    const { code } = await runScript(session.sandbox.container, wrapCheck(q.check), {
      FLAG: session.flag,
      SUBMITTED: "/home/agent/.arcade/submitted",
    });
    if (sessions.get(socket.id) !== session) return;
    if (code === 0) {
      session.checkTimers.forEach(clearTimeout);
      socket.emit("task:result", { index: session.index, status: "passed" });
    } else if (code === 2) {
      // Mauvaise réponse soumise : on l'efface pour ne la compter qu'une fois.
      await runScript(session.sandbox.container, "rm -f ~/.arcade/submitted");
      socket.emit("task:result", { index: session.index, status: "wrong" });
    }
  } catch (error) {
    console.error("[sandbox] arbitre :", error);
  } finally {
    session.checking = false;
  }
}

/** Après Entrée : on laisse la commande s'exécuter, puis on vérifie (deux fois si elle est lente). */
function scheduleCheck(socket: Socket, session: Session) {
  session.checkTimers.forEach(clearTimeout);
  session.checkTimers = [400, 1500].map((ms) => setTimeout(() => void runCheck(socket, session), ms));
}

const httpServer = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json", "access-control-allow-origin": "*" });
    res.end(JSON.stringify({ ok: true, sessions: sessions.size }));
    return;
  }
  res.writeHead(404).end();
});

const io = new Server(httpServer, { cors: { origin: ORIGINS }, maxHttpBufferSize: 64 * 1024 });

// Contrôle d'accès, avant toute partie : ticket signé par le site si les clés
// sont configurées, sinon (en local seulement) l'ancien jeton partagé.
io.use((socket, next) => {
  if (TICKET_KEYS) {
    const check = verifyTicket(socket.handshake.auth?.ticket, TICKET_KEYS);
    if (!check.ok) return next(new Error(`accès refusé (${check.reason})`));
    if (!replays.use(check.claims)) return next(new Error("accès refusé (ticket déjà utilisé)"));
    socket.data.userId = check.claims.sub;
    return next();
  }
  if (env.NODE_ENV === "production") return next(new Error("accès refusé (serveur non configuré)"));
  if (!TOKEN || tokenMatches(socket.handshake.auth?.token, TOKEN)) return next();
  next(new Error("accès refusé"));
});

const addressOf = (socket: Socket) => clientAddress(socket.handshake.headers, socket.handshake.address, TRUST);

function endSession(socket: Socket, message: string, reason: string) {
  socket.emit("session:ended", { reason: message });
  void stopSession(socket, reason);
}

io.on("connection", (socket) => {
  socket.on("session:start", async (payload: unknown, ack: (r: { ok: boolean; error?: string }) => void) => {
    const reply = typeof ack === "function" ? ack : () => {};
    const levelId = typeof payload === "object" && payload && "levelId" in payload ? String(payload.levelId) : "";
    const level = dockerLevels.get(levelId);
    if (!level) return reply({ ok: false, error: `Niveau inconnu : ${levelId}` });

    await stopSession(socket, "nouvelle partie");
    const ip = addressOf(socket);
    if (sessions.size >= MAX_SESSIONS) return reply({ ok: false, error: "Trop de parties en cours sur ce serveur." });
    if ([...sessions.values()].filter((s) => s.ip === ip).length >= MAX_SESSIONS_PER_IP) {
      return reply({ ok: false, error: "Une partie est déjà en cours depuis ton adresse." });
    }
    const userId = String(socket.data.userId ?? "");
    if (userId && [...sessions.values()].filter((s) => s.userId === userId).length >= MAX_SESSIONS_PER_USER) {
      return reply({ ok: false, error: "Tu as déjà une partie en cours dans un autre onglet." });
    }
    if (!startLimiter.take(userId || ip)) {
      return reply({ ok: false, error: "Trop de parties lancées récemment : réessaie dans un moment." });
    }

    try {
      const sandbox = await createSandbox(socket.id, level.shell);
      const session: Session = {
        sandbox,
        ip,
        userId,
        idle: setTimeout(() => endSession(socket, "Sandbox fermée après 10 minutes sans activité.", "inactivité"), IDLE_MS),
        level,
        question: null,
        index: -1,
        flag: "",
        checking: false,
        checkTimers: [],
        typed: "",
        hostile: new Set(),
        expiry: setTimeout(
          () => endSession(socket, "Partie trop longue : la sandbox a été fermée (30 min).", "expiration"),
          SESSION_MAX_MS,
        ),
      };
      sessions.set(socket.id, session);
      const decoder = new StringDecoder("utf8");
      const meter = new OutputMeter(OUTPUT_BYTES, OUTPUT_WINDOW_MS);
      sandbox.shell.on("data", (chunk: Buffer) => {
        if (sessions.get(socket.id) !== session) return;
        if (!meter.add(chunk.length)) {
          endSession(socket, "Trop de sortie d'un coup (plus de 4 Mo en 10 s) : la sandbox a été fermée.", "déluge de sortie");
          return;
        }
        socket.emit("term:output", decoder.write(chunk));
      });
      sandbox.shell.on("end", () => {
        if (sessions.get(socket.id) !== session) return;
        socket.emit("session:ended", { reason: "Le shell de la sandbox s'est fermé." });
        void stopSession(socket, "shell fermé");
      });
      if (level.setup) {
        const { code, output } = await runScript(sandbox.container, level.setup);
        if (code !== 0) console.error(`[sandbox] préparation ${level.id} : ${output}`);
      }
      console.log(`[sandbox] début ${level.id} — ${sessions.size} en cours`);
      reply({ ok: true });
    } catch (error) {
      console.error("[sandbox] création :", error);
      reply({ ok: false, error: "Impossible de créer la sandbox (Docker est-il lancé ?)." });
    }
  });

  socket.on("task:begin", async (payload: unknown) => {
    const session = sessions.get(socket.id);
    if (!session || typeof payload !== "object" || !payload) return;
    const { index, variant } = payload as { index?: unknown; variant?: unknown };
    const base = typeof index === "number" ? session.level.questions[index] : undefined;
    const question = variant === true && base?.variant ? base.variant : base;
    if (!question || question.kind !== "task") return;
    session.checkTimers.forEach(clearTimeout);
    session.index = index as number;
    session.question = question;
    session.flag = question.flag ? newFlag() : "";
    await runScript(session.sandbox.container, "rm -rf ~/.arcade");
    if (question.setup) {
      const { code, output } = await runScript(session.sandbox.container, question.setup, { FLAG: session.flag });
      if (code !== 0) console.error(`[sandbox] préparation ${session.level.id} Q${session.index + 1} : ${output}`);
    }
  });

  socket.on("term:input", (data: unknown) => {
    const session = sessions.get(socket.id);
    if (!session || typeof data !== "string" || data.length > MAX_INPUT) return;
    session.idle.refresh();
    session.sandbox.shell.write(data);
    const { buffer, lines } = appendTyped(session.typed, data);
    session.typed = buffer;
    for (const line of lines) {
      const kinds = detectHostile(line, session.hostile);
      if (kinds.length === 0) continue;
      kinds.forEach((k) => session.hostile.delete(k));
      socket.emit("chaos:detected", { kinds });
    }
    if (data.includes("\r")) scheduleCheck(socket, session);
  });

  socket.on("chaos:hostile", async (payload: unknown) => {
    const session = sessions.get(socket.id);
    const kind = typeof payload === "object" && payload && "kind" in payload ? String(payload.kind) : "";
    const script = HOSTILE_SCRIPTS[kind];
    if (!session || !script) return;
    session.hostile.add(kind);
    const { code, output } = await runScript(session.sandbox.container, script(session.level.shell));
    if (code !== 0) console.error(`[sandbox] sabotage ${kind} : ${output}`);
  });

  socket.on("term:resize", (payload: unknown) => {
    const session = sessions.get(socket.id);
    if (!session || typeof payload !== "object" || !payload) return;
    const { cols, rows } = payload as { cols?: unknown; rows?: unknown };
    if (typeof cols === "number" && typeof rows === "number") void session.sandbox.resize(cols, rows);
  });

  socket.on("session:stop", () => void stopSession(socket, "fin de partie"));
  socket.on("disconnect", () => void stopSession(socket, "déconnexion"));
});

async function main() {
  if (!(await imageReady())) {
    console.error(`Image ${IMAGE} absente. Construis-la d'abord : npm run sandbox:build -w backend`);
    process.exit(1);
  }
  const removed = await cleanupOrphans();
  if (removed) console.log(`[sandbox] ${removed} conteneur(s) orphelin(s) supprimé(s)`);
  httpServer.listen(PORT, HOST, () => {
    console.log(`Sandbox Terminal Arcade sur http://${HOST}:${PORT} — ${dockerLevels.size} niveau(x) Docker`);
  });
}

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, async () => {
    await Promise.all([...io.sockets.sockets.values()].map((s) => stopSession(s, "arrêt du serveur")));
    process.exit(0);
  });
}

void main();
