import { randomBytes } from "node:crypto";
import { PassThrough, type Duplex } from "node:stream";
import Docker from "dockerode";

// Conteneurs éphémères des défis réels. Chaque partie a le sien, détruit à
// la fin. Isolation : aucun réseau, aucune capacité Linux, utilisateur non
// root, système de fichiers en lecture seule sauf trois dossiers en mémoire,
// limites de mémoire, de processeur et de nombre de processus.

export const IMAGE = process.env.SANDBOX_IMAGE ?? "terminal-arcade-sandbox:1";
// Runtime de conteneur : runsc (gVisor) ajoute un noyau en espace
// utilisateur entre le joueur et l'hôte ; recommandé pour un serveur public.
const RUNTIME = process.env.SANDBOX_RUNTIME || undefined;
const LABEL = "terminal-arcade.sandbox";
const MB = 1024 * 1024;

export const docker = new Docker();

export type Sandbox = {
  container: Docker.Container;
  shell: Duplex;
  resize: (cols: number, rows: number) => Promise<void>;
  stop: () => Promise<void>;
};

export async function imageReady(): Promise<boolean> {
  // Docker Desktop répond parfois 404 sur une image présente (moteur qui se
  // réveille) : on recoupe avec la liste des images et on réessaie.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await docker.getImage(IMAGE).inspect();
      return true;
    } catch {
      const images = await docker.listImages().catch(() => []);
      if (images.some((i) => i.RepoTags?.includes(IMAGE))) return true;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  return false;
}

/** Supprime les conteneurs laissés par un arrêt brutal du serveur. */
export async function cleanupOrphans(): Promise<number> {
  const containers = await docker.listContainers({ all: true, filters: { label: [LABEL] } });
  await Promise.all(containers.map((c) => docker.getContainer(c.Id).remove({ force: true }).catch(() => {})));
  return containers.length;
}

export async function createSandbox(sessionId: string, shellName: "bash" | "pwsh" = "bash"): Promise<Sandbox> {
  const container = await docker.createContainer({
    Image: IMAGE,
    Cmd: ["sleep", "infinity"],
    User: "agent",
    WorkingDir: "/home/agent",
    Hostname: "sandbox",
    Labels: { [LABEL]: sessionId },
    NetworkDisabled: true,
    HostConfig: {
      Runtime: RUNTIME,
      AutoRemove: true,
      Init: true,
      NetworkMode: "none",
      CapDrop: ["ALL"],
      SecurityOpt: ["no-new-privileges"],
      ReadonlyRootfs: true,
      Tmpfs: {
        "/home/agent": "rw,exec,size=64m,uid=1000,gid=1000,mode=755",
        "/tmp": "rw,size=32m,mode=1777",
        "/srv": "rw,exec,size=64m,uid=1000,gid=1000,mode=755",
      },
      // PowerShell (.NET) demande plus de mémoire que bash.
      Memory: (shellName === "pwsh" ? 512 : 256) * MB,
      MemorySwap: (shellName === "pwsh" ? 512 : 256) * MB,
      NanoCpus: 500_000_000,
      PidsLimit: 128,
      Ulimits: [{ Name: "nofile", Soft: 256, Hard: 256 }],
    },
  });
  await container.start();

  const exec = await container.exec({
    Cmd: shellName === "pwsh" ? ["pwsh", "-NoLogo"] : ["bash", "-i"],
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    User: "agent",
    WorkingDir: "/home/agent",
    Env: ["HOME=/home/agent", "TERM=xterm-256color"],
  });
  const shell = (await exec.start({ hijack: true, stdin: true, Tty: true })) as unknown as Duplex;

  return {
    container,
    shell,
    resize: async (cols, rows) => {
      await exec.resize({ w: Math.max(20, Math.min(cols, 400)), h: Math.max(5, Math.min(rows, 200)) }).catch(() => {});
    },
    stop: async () => {
      shell.destroy();
      await container.remove({ force: true }).catch(() => {});
    },
  };
}

/**
 * Exécute un script bash invisible pour le joueur (préparation, arbitre).
 * Limité à 10 secondes par la commande timeout du conteneur.
 */
export async function runScript(
  container: Docker.Container,
  script: string,
  env: Record<string, string> = {},
): Promise<{ code: number; output: string }> {
  const exec = await container.exec({
    Cmd: ["timeout", "10", "bash", "-c", script],
    AttachStdout: true,
    AttachStderr: true,
    User: "agent",
    WorkingDir: "/home/agent",
    Env: ["HOME=/home/agent", ...Object.entries(env).map(([k, v]) => `${k}=${v}`)],
  });
  const stream = await exec.start({ hijack: true, stdin: false });
  const out = new PassThrough();
  const chunks: Buffer[] = [];
  out.on("data", (c: Buffer) => chunks.push(c));
  docker.modem.demuxStream(stream, out, out);
  await new Promise<void>((resolve) => {
    stream.on("end", resolve);
    stream.on("close", resolve);
    stream.on("error", () => resolve());
  });
  const { ExitCode } = await exec.inspect();
  return { code: ExitCode ?? 1, output: Buffer.concat(chunks).toString("utf8").slice(0, 2000) };
}

export function newFlag(): string {
  return `FLAG{${randomBytes(6).toString("hex")}}`;
}
