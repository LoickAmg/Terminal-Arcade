import { generateKeyPairSync } from "node:crypto";

// Génère une paire de clés Ed25519 pour les tickets de la sandbox, et affiche
// les variables d'environnement à poser :
//   - côté site (Vercel)    : la clé PRIVÉE et son identifiant ;
//   - côté sandbox (serveur) : la clé PUBLIQUE, préfixée de l'identifiant.
// Rotation : générer une paire avec un nouvel identifiant (k2), l'ajouter à la
// sandbox à côté de l'ancienne, passer le site sur k2, puis retirer k1.
//
//   npm run sandbox:keys -- k2

const kid = process.argv[2] ?? "k1";
const { privateKey, publicKey } = generateKeyPairSync("ed25519");
const b64 = (pem: string | Buffer) => Buffer.from(pem).toString("base64");

console.log("# Site (Vercel) — à garder secret");
console.log(`SANDBOX_TICKET_KID=${kid}`);
console.log(`SANDBOX_TICKET_PRIVATE_KEY=${b64(privateKey.export({ type: "pkcs8", format: "pem" }))}`);
console.log("\n# Sandbox (serveur) — publique, plusieurs clés séparées par des virgules");
console.log(`SANDBOX_TICKET_PUBLIC_KEYS=${kid}:${b64(publicKey.export({ type: "spki", format: "pem" }))}`);
