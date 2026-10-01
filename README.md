# Terminal Arcade

Jeu web pour maîtriser le terminal en jouant, sur PC et sur téléphone. Tout
se fait en tapant des commandes ; Arcade, un compagnon en pixel art, se
promène au-dessus du terminal.

Tout tourne dans le navigateur, sans serveur ni Docker : palier Script
Kiddie (5 niveaux), compagnon, mobile, parties chronométrées et mode Chaos.

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
« signature », un tirage dans la réserve du palier ajoute de l'imprévu, et un
budget par palier (nombre, pause minimale) dose le tout.

| Famille | Sabotages |
| --- | --- |
| Doute | faux verdict « faux » sur une bonne réponse, faux « correct » sur une mauvaise |
| Entrave | touche bloquée 12 s, terminal fermé (Ctrl+Alt+T ou bouton pour le rouvrir) |
| Mutation | l'énoncé change en cours de route (variante définie dans le niveau) |
| Falsification | le code affiché à l'écran diffère de celui du terminal |
| Temps | temps accéléré ou retiré (réel), timer figé ou instable (illusion) |

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

Puis ouvrir `http://localhost:3000`.

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
- `frontend/` : application Next.js (App Router).
  - `src/lib/game.ts` : machine de jeu pure (une ligne tapée entre, un
    nouvel état et les lignes à afficher sortent) ; le déroulé d'un niveau
    est dans `play.ts`, le compagnon dans `wizard.ts`.
  - `src/lib/lineEditor.ts` : édition de la ligne (historique, flèches,
    Tab, Ctrl+C), indépendante de xterm.js.
  - `src/components/` : terminal xterm.js, bannières des niveaux, questions
    en bulles, compagnon, barre de saisie mobile.

## Ajouter un niveau

Créer un fichier YAML dans `shared/levels/<palier>/`. Le format est décrit
dans `shared/src/schema.ts` ; un niveau invalide fait échouer le build avec
le fichier et le champ en cause. Les tests vérifient que la première réponse
attendue de chaque question est bien acceptée.

## Feuille de route

1. MVP navigateur (palier Script Kiddie, compagnon, mobile) — fait
2. Timer (compte à rebours ou chrono, reverse, rachat) — fait
3. Chaos (sabotages d'Arcade) — fait, hors famille « environnement hostile » (Docker)
4. Docker (défis réels, paliers SysAdmin et Root Wizard)
5. Extensions (parcours Git-Gud, style Persona pour Arcade, PowerShell)
