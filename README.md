# Terminal Arcade

Jeu web pour maîtriser le terminal en jouant, sur PC et sur téléphone. Tout
se fait en tapant des commandes ; Arcade, un compagnon en pixel art, se
promène au-dessus du terminal.

Trois paliers : Script Kiddie (5 niveaux, dans le navigateur), SysAdmin et
Root Wizard (11 niveaux de défis réels, dans une sandbox Docker, dont 2 en
PowerShell), plus le parcours Git-Gud (4 niveaux, de git init à git bisect, avec sa propre entrée
dans ls missions/). Arcade se dessine en pixel art ou façon Persona
(pet style). Compagnon, mobile, parties chronométrées et mode
Chaos sur tous les niveaux.

## Parties chronométrées

Un niveau réussi se rejoue chronométré avec `open <niveau> --timer` (ou le
bouton ⏱ de sa bannière) ; certains niveaux sont Timer d'office. Le mode est
fixé par le niveau ou tiré au hasard :

| Mode | Principe |
| --- | --- |
| Compte à rebours | Tout finir avant 0 |
| Chrono | Le temps monte ; erreurs (+5 s) et abandons (+15 s) l'alourdissent |
| Reverse | Erreurs −10 s, abandons −15 s, premier coup +5 s ; indices doublés sous 50 %, bloqués sous 25 % |
| Rachat | Départ en retard : revenir au temps initial avant la fin |

Une partie chronométrée rapporte 25 % d'XP en plus, et jusqu'à 20 % de bonus
selon le temps restant. Sur téléphone, les durées sont allongées (×1,5 par
défaut).

## Mode Chaos

Un niveau réussi se rejoue saboté par le compagnon avec `open <niveau> --chaos`
(ou le bouton ☠) ; `--timer` et `--chaos` se combinent, et certains niveaux sont
Chaos d'office. Le joueur ne choisit rien : chaque niveau a ses sabotages
« signature », un tirage dans la réserve complète ajoute de l'imprévu (tous
les paliers subissent tous les sabotages), et un budget par palier (nombre,
pause minimale) dose le tout. Un sabotage ne se joue que s'il a un sens pour
la question en cours, jamais deux fois sur la même question.

| Famille | Sabotages |
| --- | --- |
| Doute | faux verdict « faux » sur une bonne réponse, faux « correct » sur une mauvaise |
| Entrave | touche bloquée 12 s, terminal fermé (Ctrl+Alt+T ou bouton pour le rouvrir) |
| Mutation | l'énoncé change en cours de route (variante définie dans le niveau) |
| Falsification | le code affiché à l'écran diffère de celui du terminal |
| Temps | temps accéléré ou retiré (réel), timer figé ou instable (illusion) |
| Environnement hostile (sandbox) | alias piège, fausse commande dans le PATH, fichier privé de ses droits, faux flag |

Règle : les lignes « Arcade : … » sont ses verdicts et peuvent mentir ; le reste
du terminal dit vrai. `verify` vérifie la dernière réponse (−5 s), `clock`
donne le vrai temps (−3 s). Le récap révèle tous les sabotages, démasqués ou
non. Une partie Chaos rapporte 50 % d'XP en plus, et chaque sabotage démasqué
ajoute un bonus.

## Démarrer

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`. Le palier Script Kiddie fonctionne seul,
et hors ligne une fois le jeu chargé (service worker `public/sw.js`, actif
en production seulement : `npm run build`, puis `npm run start -w frontend`).

### Défis réels

Les paliers SysAdmin et Root Wizard se jouent dans un vrai Linux.

**Niveaux bash : dans le navigateur.** Un Alpine Linux 32 bits tourne chez
le joueur, émulé en WebAssembly par [v86](https://github.com/copy/v86) :
aucun serveur, aucun compte exigé. Le terminal est le premier port série ;
le jeu pilote le système par le second (`v86/arcade-ctl`) pour préparer les
questions, arbitrer et poser les sabotages du mode Chaos
(`frontend/src/lib/browser-sandbox.ts`).

```bash
npm run v86:build                  # construit le Linux dans v86/out (Docker requis)
npx tsx v86/check-levels.mts       # chaque défi bash est soluble dans ce Linux
```

Sans construction locale, `npm run dev` et `npm run build` téléchargent le
Linux publié par le flux GitHub « Linux v86 » (`scripts/v86-assets.mjs`).

**Niveaux PowerShell : serveur Docker.** PowerShell n'existe qu'en 64 bits :
ses niveaux (`shell: pwsh`) ouvrent un vrai `pwsh` 7 dans un conteneur.

```bash
npm run sandbox:build -w backend   # une fois : construit l'image terminal-arcade-sandbox
npm run sandbox                    # serveur de sandbox sur http://127.0.0.1:3108
```

Chaque partie a son conteneur, détruit à la fin : aucun réseau, aucune
capacité Linux, utilisateur non root, système de fichiers en lecture seule
(seuls le dossier personnel, /tmp et /srv sont inscriptibles, en mémoire),
512 Mo de mémoire, un demi-processeur, 128 processus, 30 minutes au plus.
Le serveur n'écoute que sur 127.0.0.1 et n'accepte que des tickets signés
par le site. Avant toute ouverture sur Internet, lire [SECURITY.md](SECURITY.md).

Dans les deux cas, `submit <réponse>` envoie une réponse ; `hint`, `skip`,
`quit`, `verify` et `clock` parlent au jeu. L'arbitre exécute le script
`check` du défi (toujours en bash) après chaque commande.

```bash
npm run test:sandbox -w backend    # chaque défi PowerShell est soluble
npm run test:isolation -w backend  # la sandbox bloque root, réseau, écriture, fork bomb…
npm run test:hostile -w backend    # les sabotages hostiles prennent effet et se réparent
```

```bash
npm test            # moteur de questions, logique du jeu, éditeur de ligne
npm run lint
npm run typecheck
npm run build
```

## Structure

- `shared/` : format des niveaux (`schema.ts`), normalisation et
  vérification des réponses, déroulé d'une partie, progression, moteur
  du temps (`timer.ts`), ordonnancement des sabotages (`chaos.ts`).
  `shared/levels/` contient les niveaux en YAML, validés au build.
- `v86/` : le Linux des niveaux bash, pour le navigateur (image Alpine,
  canal de contrôle `arcade-ctl`, état mémoire, test des niveaux).
- `backend/` : serveur de sandbox PowerShell (Socket.io + Dockerode), image
  Docker dans `backend/sandbox/` (ses scripts `submit`, `arcade`… servent
  aussi au Linux du navigateur), tests d'intégration contre Docker. Les
  sabotages hostiles en liste blanche sont dans `shared/src/hostile.ts`.
- `frontend/` : application Next.js (App Router).
  - `src/lib/game.ts` : machine de jeu pure (une ligne tapée entre, un
    nouvel état et les lignes à afficher sortent) ; le déroulé d'un niveau
    est dans `play.ts`, le compagnon dans `wizard.ts`.
  - `src/lib/lineEditor.ts` : édition de la ligne (historique, flèches,
    Tab, Ctrl+C), indépendante de xterm.js.
  - `src/components/` : terminal xterm.js, bannières des niveaux, questions
    en bulles, compagnon, barre de saisie mobile.

## Catalogue et contenu

- `docs/exercices.md` : tous les niveaux, questions, réponses, indices et
  défis, générés depuis les YAML (`npm run export:exercices`).
- `docs/prompt-contenu.md` : le prompt pour faire proposer de nouveaux
  niveaux à d'autres IA, avec le format attendu et la grille d'évaluation.

## Ajouter un niveau

Créer un fichier YAML dans `shared/levels/<palier>/`. Le format est décrit
dans `shared/src/schema.ts` ; un niveau invalide fait échouer le build avec
le fichier et le champ en cause. Les tests vérifient que la première réponse
attendue de chaque question est bien acceptée.

## Feuille de route

1. MVP navigateur (palier Script Kiddie, compagnon, mobile) — fait
2. Timer (compte à rebours ou chrono, reverse, rachat) — fait
3. Chaos (sabotages d'Arcade) — fait
4. Docker (défis réels, paliers SysAdmin et Root Wizard, environnement hostile) — fait
5. Extensions — parcours Git-Gud, style Persona, PowerShell, mode hors ligne
   et durcissement du serveur faits ; l'ouverture au public attend les
   étapes listées dans SECURITY.md (machine dédiée, gVisor, TLS, comptes)
