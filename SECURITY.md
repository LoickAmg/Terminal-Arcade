# Sécurité de Terminal Arcade

Revue du 2026-10-02. Le jeu dans le navigateur (palier Script Kiddie) n'exécute
aucune commande : il compare des réponses. Le risque est concentré sur le
**serveur de sandbox** (`backend/`), qui donne un vrai shell Linux à
quiconque s'y connecte.

**Verdict : prêt pour un usage personnel ou privé (localhost, Tailscale).
Pas encore prêt pour Internet** : voir la liste « Avant une ouverture
publique » plus bas.

## Modèle de menace

| Menace | Exemple |
| --- | --- |
| Évasion du conteneur | exploit noyau, montage, accès au socket Docker |
| Atteinte à l'hôte ou au réseau | rebond vers le réseau local, scan, téléchargement |
| Épuisement des ressources | fork bomb, mémoire, disque, déluge de sortie |
| Abus du service | lancer des centaines de parties, les garder ouvertes |
| Injection côté serveur | faire exécuter un script choisi par le client |
| Triche | lire la réponse attendue dans le conteneur |

## Ce qui protège déjà

**Conteneur** (`backend/src/sandbox.ts`), un par partie, détruit à la fin :

- aucun réseau (`NetworkMode: none`) ;
- aucune capacité Linux (`CapDrop: ALL`), `no-new-privileges`, utilisateur
  non root (uid 1000) ;
- système de fichiers en lecture seule ; seuls `/home/agent` (64 Mo),
  `/tmp` (32 Mo) et `/srv` (64 Mo) sont inscriptibles, en mémoire ;
- 256 Mo de mémoire (512 Mo pour PowerShell), un demi-processeur,
  128 processus, 256 fichiers ouverts, processus init pour les zombies ;
- le socket Docker n'est jamais monté dans le conteneur ;
- runtime optionnel `SANDBOX_RUNTIME=runsc` (gVisor) : un noyau en espace
  utilisateur entre le joueur et l'hôte.

**Serveur** (`backend/src/server.ts`, `backend/src/limits.ts`) :

- écoute sur `127.0.0.1` par défaut, origines autorisées en liste blanche ;
- jeton d'accès optionnel (`SANDBOX_TOKEN`), comparé en temps constant ;
- au plus `MAX_SESSIONS` parties (4), `MAX_SESSIONS_PER_IP` par adresse (1),
  `STARTS_PER_HOUR` démarrages par adresse et par heure (30) ;
- partie fermée après 30 minutes, ou 10 minutes sans frappe ;
- partie fermée si le conteneur envoie plus de 4 Mo en 10 secondes ;
- frappes limitées à 4 Ko par message, messages Socket.io à 64 Ko ;
- scripts de préparation et d'arbitre limités à 10 secondes ;
- le client n'envoie que des identifiants (niveau, question, nom de
  sabotage) : tous les scripts exécutés viennent des fichiers de niveaux ou
  de la liste blanche `backend/src/hostile.ts`, jamais du réseau ;
- conteneurs orphelins supprimés au démarrage du serveur.

## Ce qui est testé

```bash
npm run test:isolation -w backend  # écrire hors des dossiers permis, devenir root, réseau,
                                   # chown, fork bomb, socket Docker : tout est bloqué
npm run test:sandbox -w backend    # chaque défi soluble, son arbitre non trivial
npm run test:hostile -w backend    # sabotages appliqués et réparables (bash et PowerShell)
npm test                           # dont les limiteurs (fréquence, sortie, jeton, adresse)
```

Les protections du serveur (jeton refusé, deuxième partie depuis la même
adresse refusée, `yes` coupé au-delà de 4 Mo) ont aussi été vérifiées sur
un serveur réel le 2026-10-02.

## Limites connues

- **Triche** : les scripts d'arbitre et les réponses calculées vivent dans
  le conteneur du joueur, qui peut les lire en cherchant bien. Acceptable
  pour un jeu d'apprentissage ; pas pour un classement à enjeu.
- **Le jeton est public** : `NEXT_PUBLIC_SANDBOX_TOKEN` est lisible dans le
  code du site. Il réserve une instance à un cercle restreint, il ne
  remplace pas des comptes.
- **Le temps est mesuré dans le navigateur** : un joueur peut fausser le
  timer. Il faudrait le faire compter par le serveur.
- **Docker Desktop** (Windows, macOS) passe par une machine virtuelle :
  bonne isolation de fait, mais ce n'est pas une cible de production.

## Avant une ouverture publique

1. **Machine dédiée** : un VPS Linux qui ne sert qu'à ça, sans données ni
   accès au réseau interne. Le serveur pilote Docker : il ne doit jamais
   tourner sur une machine qui compte.
2. **gVisor** : installer runsc et lancer avec `SANDBOX_RUNTIME=runsc`, puis
   relancer `npm run test:isolation -w backend` et `test:sandbox`.
3. **TLS et proxy** : nginx ou Caddy devant le serveur (WebSocket en wss),
   `HOST=127.0.0.1`, `TRUST_PROXY=1`, `ALLOWED_ORIGINS` = l'adresse du site.
4. **Comptes** : une vraie authentification (OAuth GitHub, liens magiques…)
   à la place du jeton partagé, avec un quota par compte.
5. **Plafonds globaux** : quotas Docker sur la machine (cgroup parent),
   alertes sur la charge, le disque et le nombre de conteneurs.
6. **Journal et retrait** : journaliser les débuts et fins de partie
   (adresse, niveau, durée, motif) et prévoir de bloquer une adresse.
7. **Mises à jour** : reconstruire l'image chaque mois (correctifs Debian et
   PowerShell), mettre à jour Docker et le noyau de l'hôte.
8. **Revue externe** : faire relire le tout par quelqu'un d'autre, et tenter
   une évasion depuis une partie avant d'annoncer le service.

## Déploiement suggéré

- **Site** (Next.js) : Vercel ou tout hébergeur statique ; variables
  `NEXT_PUBLIC_SANDBOX_URL` (adresse wss du serveur) et, si besoin,
  `NEXT_PUBLIC_SANDBOX_TOKEN`.
- **Sandbox** : le VPS dédié ci-dessus, `npm run sandbox:build -w backend`
  puis `npm run start -w backend` sous un gestionnaire de services
  (systemd), derrière le proxy TLS.

Le palier Script Kiddie et le mode hors ligne fonctionnent sans le serveur
de sandbox : publier le site seul ne présente pas ces risques.

## Signaler un problème

Écrire à mahounaamg@gmail.com en décrivant le problème et la façon de le
reproduire, sans le publier avant correction.
