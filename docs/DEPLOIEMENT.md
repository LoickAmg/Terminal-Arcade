# Mise en ligne de Terminal Arcade

Ce guide suit les décisions prises en octobre 2026 : site et comptes sur
Vercel, base sur Neon (Francfort), e-mails par Resend, défis réels bash dans
le navigateur du joueur (v86), serveur PowerShell plus tard. Coût : 0 € dans les
limites gratuites, plus le nom de domaine (10 à 20 € par an).

Les étapes marquées **[toi]** demandent un compte ou un paiement à ton nom.

## 0. Avant tout

- [ ] **[toi]** Acheter le nom de domaine (exemple ici : `terminal-arcade.fr`).
- [ ] **[toi]** Le confier à Cloudflare (DNS gratuit) : pratique pour les
      enregistrements de Resend, et nécessaire au tunnel d'un futur serveur
      PowerShell.
- [ ] **[toi]** Déclaration à l'APDP (Bénin), avec la demande d'autorisation de
      transfert hors CEDEAO : traitements (comptes, sauvegardes, classement),
      destinataires (Vercel, Neon, Resend, Google), transferts et mesures de
      protection (chiffrement en transit et au repos, accès restreints).
- [ ] Vérifier à la source l'âge de la majorité et les règles sur les mineurs
      (les CGU disent : 15 ans minimum, accord parental avant 18 ans).

## 1. Base de données (Neon)

1. **[toi]** Créer un projet Neon, région **AWS Europe Central 1 (Francfort)**.
2. Récupérer la chaîne de connexion **pooled** (avec `-pooler` dans l'hôte) :
   c'est `DATABASE_URL` sur Vercel. Les tables se créent seules au premier
   appel (migrations versionnées, protégées par un verrou).
3. Créer un rôle **en lecture seule** pour les sauvegardes (SQL Editor de Neon) :

   ```sql
   CREATE ROLE sauvegarde WITH LOGIN PASSWORD '<long mot de passe aléatoire>';
   GRANT CONNECT ON DATABASE neondb TO sauvegarde;
   GRANT USAGE ON SCHEMA public TO sauvegarde;
   GRANT SELECT ON ALL TABLES IN SCHEMA public TO sauvegarde;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO sauvegarde;
   ```

4. Pas de « ping » pour garder la base éveillée : le réveil prend moins
   d'une seconde, et un ping permanent consommerait les heures gratuites.
5. Avant l'ouverture, lancer une fois les tests contre une **branche de
   développement** Neon (PGlite, en local, est un vrai Postgres, mais on
   vérifie verrous et transactions sur le vrai service) :

   ```bash
   DATABASE_URL="postgres://…branche-dev…" npx vitest run frontend/src/server
   ```

## 2. E-mails

Deux voies, au choix ; le site prend Resend s'il est configuré, sinon SMTP.

### Tout de suite, sans domaine : Gmail (SMTP)

1. **[toi]** Créer un compte Gmail **dédié au jeu** (par exemple
   `terminal.arcade.jeu@gmail.com`) : c'est l'adresse que verront les
   joueurs, autant ne pas exposer la tienne.
2. Sur ce compte, activer la **validation en deux étapes**, puis créer un
   **mot de passe d'application** : <https://myaccount.google.com/apppasswords>
   (16 lettres ; ce n'est pas le mot de passe du compte).
3. Variables Vercel :

   | Variable | Valeur |
   | --- | --- |
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_PORT` | `465` |
   | `SMTP_USER` | l'adresse Gmail du jeu |
   | `SMTP_PASS` | le mot de passe d'application (sans espaces) |
   | `EMAIL_FROM` | `Terminal Arcade <l'adresse Gmail du jeu>` |

4. Limite de Gmail : environ 500 e-mails par jour, largement assez pour
   commencer. Les pages légales nomment alors Gmail (Google) comme service
   d'envoi.

### Plus tard, avec un domaine : Resend

1. **[toi]** Créer un compte Resend, ajouter le domaine (sous-domaine conseillé :
   `mail.terminal-arcade.fr`) et poser chez Cloudflare les enregistrements
   SPF, DKIM et DMARC qu'il indique. Sans domaine vérifié, Resend n'écrit
   qu'à ta propre adresse.
2. Créer une clé d'API limitée à « Sending access » : `RESEND_API_KEY`.
3. `EMAIL_FROM` : `Terminal Arcade <noreply@mail.terminal-arcade.fr>`.
4. Une fois Resend en place, les variables `SMTP_…` peuvent être retirées.

## 3. Connexion Google

1. **[toi]** Google Cloud Console → nouveau projet → écran de consentement OAuth :
   type « Externe », autorisations de base seulement (`openid`, `email`,
   `profile`), pages de confidentialité et de CGU du site, puis **publier en
   production** (pas besoin de validation pour ces autorisations ; rester en
   « test » bloquerait tout joueur absent de la liste des testeurs).
2. Identifiants → ID client OAuth → « Application Web » :
   - origine autorisée : `https://terminal-arcade.fr`
   - URI de redirection : `https://terminal-arcade.fr/api/auth/callback/google`
3. `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET`. Sans elles, le bouton Google
   n'apparaît pas.

## 4. Site (Vercel)

1. **[toi]** Importer le dépôt GitHub, **Root Directory : `frontend`** (laisser
   cochée l'inclusion des fichiers hors du dossier racine : le jeu lit
   `shared/levels` au build).
2. `frontend/vercel.json` fixe déjà la région des fonctions à **`fra1`**
   (Francfort, à côté de Neon) et le ménage quotidien à 3 h.
3. Variables d'environnement (Production) :

   | Variable | Valeur |
   | --- | --- |
   | `DATABASE_URL` | chaîne Neon pooled |
   | `BETTER_AUTH_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |
   | `BETTER_AUTH_URL` | `https://terminal-arcade.fr` |
   | `NEXT_PUBLIC_SITE_URL` | `https://terminal-arcade.fr` |
   | `SMTP_…` et `EMAIL_FROM`, ou `RESEND_API_KEY` et `EMAIL_FROM` | voir étape 2 |
   | `NEXT_PUBLIC_EMAIL_VERIFICATION` | `off` **seulement** si aucun service d'e-mail n'est prêt (voir plus bas) |
   | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | voir étape 3 |
   | `CRON_SECRET` | une autre valeur aléatoire (Vercel l'envoie au ménage quotidien) |
   | `FEEDBACK_EMAIL` | ton adresse : chaque retour de joueur y est envoyé |
   | `ADMIN_EMAIL` | l'adresse de **ton compte** sur le site : elle ouvre `/admin/retours` |
   | `NEXT_PUBLIC_LEGAL_NAME`, `NEXT_PUBLIC_LEGAL_CITY` | identité affichée dans les pages légales |
   | `NEXT_PUBLIC_CONTACT_EMAIL` | adresse de contact publique |
   | `NEXT_PUBLIC_SANDBOX_URL` | `https://sandbox.terminal-arcade.fr` (seulement avec un serveur PowerShell) |
   | `SANDBOX_TICKET_KID`, `SANDBOX_TICKET_PRIVATE_KEY` | `npm run sandbox:keys` (idem, voir étape 5) |

4. **Mode provisoire des comptes** (aucun service d'e-mail, ni Gmail ni Resend) :
   `NEXT_PUBLIC_EMAIL_VERIFICATION=off`. L'inscription se fait sans
   confirmer l'adresse, le compte sert tout de suite (sauvegarde, classement),
   et il n'y a pas de « mot de passe oublié » : on change son mot de passe
   une fois connecté, en donnant l'ancien. Quand un service d'e-mail est prêt :
   supprimer la variable, ajouter ses variables (étape 2), **Redeploy**. Les
   comptes existants reçoivent un lien de confirmation à leur connexion
   suivante ; ceux qui ont joué ne sont jamais purgés.
5. Domaine : ajouter `terminal-arcade.fr` au projet. HTTPS est automatique ;
   l'en-tête HSTS est envoyé par le site en production.
6. Activer Web Analytics dans le projet (mesure sans cookie, déjà intégrée).
7. Panne = bloque tout : sans `DATABASE_URL` ou `BETTER_AUTH_SECRET`, les
   routes de compte répondent 503 au lieu de fonctionner à moitié ; le jeu
   reste jouable sans compte.

## 5. Défis réels

### Niveaux bash : Linux dans le navigateur (v86)

Rien à héberger : chaque joueur fait tourner un vrai Linux (Alpine 32 bits)
dans son navigateur, émulé en WebAssembly par v86. Aucun serveur, aucun
compte exigé, aucun risque pour une machine à toi.

- Le flux GitHub **Linux v86** (`.github/workflows/v86-image.yml`) construit
  l'image, vérifie que chaque niveau bash est soluble dedans, puis la publie
  comme archive de la version `v86-image`. Il se relance seul quand
  `v86/` ou les scripts de la sandbox changent ; sinon : onglet **Actions →
  Linux v86 → Run workflow**.
- À chaque construction du site (`npm run build`, donc sur Vercel aussi),
  `scripts/v86-assets.mjs` télécharge cette archive dans
  `frontend/public/v86/`. Après un nouveau Linux, **redéployer** le site.
- En local : `npm run v86:build` (Docker requis) construit l'image dans
  `v86/out/`, que le site utilise à la place de l'archive.
- Poids pour le joueur : l'émulateur et l'état mémoire se téléchargent à la
  première partie (quelques Mo), puis les fichiers à la demande ; le
  navigateur les garde en cache.

### Niveaux PowerShell : serveur Docker (plus tard)

PowerShell n'existe qu'en 64 bits : ses 5 niveaux restent sur le serveur de
sandbox (`backend/`), qui ne sert plus qu'eux. Sans serveur configuré, ils
affichent « sandbox indisponible » et le reste du jeu fonctionne. Le jour
où un serveur existe (VPS, ou machine personnelle derrière un tunnel) :

1. Docker lancé, image construite : `npm run sandbox:build -w backend`.
2. Clés des tickets : `npm run sandbox:keys`. La clé **privée** et son
   identifiant vont sur Vercel ; la ligne `SANDBOX_TICKET_PUBLIC_KEYS` va dans
   `backend/.env.local` (fichier ignoré par Git, lu au démarrage).
3. `backend/.env.local`, en plus de la clé publique :

   ```
   NODE_ENV=production
   HOST=127.0.0.1
   ALLOWED_ORIGINS=https://terminal-arcade.fr
   TRUST_CLOUDFLARE=1
   MAX_SESSIONS=4
   ```

   puis `npm run start -w backend`. Seuls les comptes à l'adresse confirmée
   obtiennent un ticket ; sans clé, le serveur refuse tout.
4. **[toi]** `cloudflared tunnel create terminal-arcade`, puis une route
   `sandbox.terminal-arcade.fr` vers `http://localhost:3108`. Aucun port à
   ouvrir sur ta box.
5. Cloudflare → règle de limitation de débit sur `sandbox.terminal-arcade.fr`
   (plan gratuit : une règle).
6. Rotation des clés : `npm run sandbox:keys -- k2`, ajouter la nouvelle clé
   publique à côté de l'ancienne (`k1:…,k2:…`), passer le site sur `k2`, puis
   retirer `k1` quelques minutes plus tard.
7. UptimeRobot : une sonde de plus sur `https://sandbox.terminal-arcade.fr/health`.

## 6. Surveillance, alertes et maintenance

### UptimeRobot (gratuit)

1. **[toi]** Créer un compte sur <https://uptimerobot.com>, puis
   **Add New Monitor** :
   - type **HTTP(s)**, nom « Terminal Arcade — site et base » ;
   - URL `https://terminal-arcade.fr/api/health` ;
   - intervalle **5 minutes**, alerte par e-mail (ton adresse).

   `/api/health` répond 200 seulement si le site **et** la base répondent
   (en moins de 3 s), 503 sinon : une seule sonde surveille les deux.
2. Deuxième sonde, type **Keyword**, URL `https://terminal-arcade.fr/`,
   mot-clé `Terminal Arcade`, alerte si le mot **manque** : elle détecte une
   page d'accueil cassée même quand le serveur répond 200.
3. **Status Pages → Create** : page publique avec les deux sondes. Copier son
   adresse dans la variable Vercel `NEXT_PUBLIC_STATUS_URL` : les pages de
   panne et de maintenance afficheront un bouton « État du service ».
4. Avant une maintenance prévue : **Maintenance Windows** dans UptimeRobot,
   pour ne pas recevoir d'alertes pendant ce temps.

### Pages de panne

- **Erreur pendant l'affichage** : une page « Panne » propose de réessayer ;
  la progression locale n'est pas touchée.
- **Maintenance volontaire** : variable Vercel `MAINTENANCE_MODE=1` (et, si
  besoin, `MAINTENANCE_MESSAGE`), puis **Redeploy**. Toutes les pages
  répondent 503 avec la page de maintenance, l'API répond 503, seul
  `/api/health` reste ouvert. Pour finir : supprimer la variable, redéployer.
- **Site entier hors ligne** (Vercel en panne) : aucune page du site ne
  peut s'afficher ; c'est la page d'état UptimeRobot qui informe les joueurs.

### Journaux

- Vercel → Logs. Chaque ligne est un JSON (`event`, `level`) : filtrer sur
  `"level":"error"`.
- Sauvegardes : GitHub prévient par e-mail quand le flux échoue.

## 7. Sauvegardes et restauration

- **Neon** garde un historique qui permet de revenir à un instant donné
  (fenêtre selon le plan : la vérifier dans les réglages du projet).
- **Chaque nuit**, `.github/workflows/db-backup.yml` exporte la base avec le
  rôle en lecture seule, **la restaure dans un Postgres jetable** et vérifie son
  contenu, puis garde 30 jours une archive chiffrée (AES-256).
  - **[toi]** Secrets du dépôt : `BACKUP_DATABASE_URL` (rôle `sauvegarde`),
    `BACKUP_PASSPHRASE` (aussi notée hors de GitHub, sinon les archives sont
    perdues).
- Restaurer pour de vrai :

  ```bash
  gpg --decrypt base-AAAA-MM-JJ.dump.gpg > base.dump
  pg_restore --no-owner --clean --if-exists -d "$DATABASE_URL_CIBLE" base.dump
  ```

  Restaurer d'abord dans une **branche** Neon, vérifier, puis basculer.

## 8. Vérifications finales

- [ ] `npm test`, `npm run typecheck`, `npm run lint`, `npm run build -w frontend`
- [ ] Inscription avec une vraie adresse → e-mail reçu (pas dans les indésirables)
- [ ] Connexion Google, puis « Ajouter un mot de passe »
- [ ] Mot de passe oublié → les autres appareils sont déconnectés
- [ ] Suppression du compte → disparu du classement
- [ ] En-têtes : <https://securityheaders.com> sur le domaine
- [ ] Google Search Console : ajouter le domaine, envoyer `sitemap.xml`
- [ ] `/api/health` répond 200, UptimeRobot vert
- [ ] `MAINTENANCE_MODE=1` → page de maintenance, puis retour à la normale
