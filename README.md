# Terminal Arcade

Jeu web pour maîtriser le terminal en jouant, sur PC et sur téléphone. Tout
se fait en tapant des commandes ; Arcade, un compagnon en pixel art, se
promène au-dessus du terminal.

Tout tourne dans le navigateur, sans serveur ni Docker : palier Script
Kiddie (4 niveaux), compagnon, mobile, et parties chronométrées.

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
  du temps (`timer.ts`).
  `shared/levels/` contient les niveaux en YAML, validés au build.
- `frontend/` : application Next.js (App Router).
  - `src/lib/game.ts` : machine de jeu pure (une ligne tapée entre, un
    nouvel état et les lignes à afficher sortent).
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
3. Chaos (sabotages d'Arcade)
4. Docker (défis réels, paliers SysAdmin et Root Wizard)
5. Extensions (parcours Git-Gud, style Persona pour Arcade, PowerShell)
