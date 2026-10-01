import { io, type Socket } from "socket.io-client";

// Client du serveur de sandbox (backend/). Une connexion par partie Docker :
// le terminal y envoie les frappes, le serveur renvoie la sortie du shell
// et les verdicts de l'arbitre.

export const SANDBOX_URL = process.env.NEXT_PUBLIC_SANDBOX_URL ?? "http://localhost:3108";
// Jeton d'accès au serveur de sandbox, s'il en exige un (SANDBOX_TOKEN).
// Visible dans le code du site : il limite l'accès à une instance privée,
// il ne remplace pas de vrais comptes (voir SECURITY.md).
const SANDBOX_TOKEN = process.env.NEXT_PUBLIC_SANDBOX_TOKEN;

export type SandboxHandlers = {
  onOutput: (data: string) => void;
  onResult: (result: { index: number; status: "passed" | "wrong" }) => void;
  // Commandes du jeu tapées dans la sandbox (hint, skip, quit, verify, clock).
  onCommand: (command: string) => void;
  onEnded: (reason: string) => void;
  // Le joueur a démasqué un sabotage hostile (vu par le serveur).
  onDetected: (kinds: string[]) => void;
};

// Séquence OSC émise par la commande « arcade » de l'image.
const GAME_COMMAND = /\x1b\]7777;([a-z]+)\x07/g;

export class SandboxClient {
  private socket: Socket | null = null;

  async start(levelId: string, handlers: SandboxHandlers): Promise<void> {
    this.stop();
    const socket = io(SANDBOX_URL, {
      transports: ["websocket"],
      reconnection: false,
      timeout: 4000,
      auth: SANDBOX_TOKEN ? { token: SANDBOX_TOKEN } : undefined,
    });
    this.socket = socket;

    await new Promise<void>((resolve, reject) => {
      socket.once("connect", () => resolve());
      socket.once("connect_error", (error) =>
        reject(new Error(error.message === "accès refusé" ? "accès refusé (jeton)" : `serveur injoignable (${SANDBOX_URL})`)),
      );
    });

    socket.on("term:output", (data: string) => {
      const commands = [...data.matchAll(GAME_COMMAND)].map((m) => m[1]);
      const visible = data.replace(GAME_COMMAND, "");
      if (visible) handlers.onOutput(visible);
      for (const command of commands) handlers.onCommand(command);
    });
    socket.on("task:result", handlers.onResult);
    socket.on("chaos:detected", (p: { kinds?: string[] }) => handlers.onDetected(p?.kinds ?? []));
    socket.on("session:ended", (p: { reason?: string }) => handlers.onEnded(p?.reason ?? "session terminée"));
    socket.on("disconnect", () => {
      if (this.socket === socket) handlers.onEnded("connexion au serveur perdue");
    });

    const reply = await socket.timeout(20_000).emitWithAck("session:start", { levelId }).catch(() => null);
    if (!reply?.ok) {
      this.stop();
      throw new Error(reply?.error ?? "le serveur n'a pas répondu");
    }
  }

  input(data: string) {
    this.socket?.emit("term:input", data);
  }

  resize(cols: number, rows: number) {
    this.socket?.emit("term:resize", { cols, rows });
  }

  task(index: number, variant: boolean) {
    this.socket?.emit("task:begin", { index, variant });
  }

  hostile(kind: string) {
    this.socket?.emit("chaos:hostile", { kind });
  }

  stop() {
    const socket = this.socket;
    this.socket = null;
    if (!socket) return;
    socket.emit("session:stop");
    socket.disconnect();
  }
}
