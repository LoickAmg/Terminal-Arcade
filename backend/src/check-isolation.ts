import { createSandbox, runScript } from "./sandbox";

// Vérifie l'isolation d'une sandbox : chaque commande doit échouer.
//   npm run test:isolation -w backend

const MUST_FAIL: [string, string][] = [
  ["écrire hors des dossiers autorisés", "touch /usr/local/bin/pirate"],
  ["devenir root", "su -c id root </dev/null"],
  ["accéder au réseau", "getent hosts example.com || exec 3<>/dev/tcp/1.1.1.1/80"],
  // nc et ss sont présents pour Network Phantom : seul 127.0.0.1 doit répondre.
  ["joindre l'extérieur avec nc", "nc -z -w 2 1.1.1.1 443"],
  ["avoir une route hors de la machine", "ip route | grep -q default"],
  ["voir une autre interface que lo", "ip -o link | grep -qv ' lo:'"],
  ["changer le propriétaire d'un fichier", "touch ~/f && chown root ~/f"],
  ["dépasser la limite de processus", "for i in $(seq 1 300); do sleep 5 & done; wait"],
  ["voir le socket Docker", "test -e /var/run/docker.sock"],
];

async function main() {
  const sandbox = await createSandbox("test-isolation");
  let problems = 0;
  try {
    const who = await runScript(sandbox.container, "id -u; id -un");
    console.log(`Utilisateur : ${who.output.trim().replace("\n", " / ")}`);
    for (const [label, script] of MUST_FAIL) {
      const { code } = await runScript(sandbox.container, script);
      const ok = code !== 0;
      if (!ok) problems++;
      console.log(`${ok ? "✔ bloqué" : "✘ PERMIS"}  ${label}`);
    }
  } finally {
    await sandbox.stop();
  }
  process.exit(problems === 0 ? 0 : 1);
}

void main();
