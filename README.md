# Terminal Arcade

Jeu web pour maîtriser le terminal en jouant, sur PC et sur téléphone. Tout
se fait en tapant des commandes ; Arcade, un compagnon en pixel art, se
promène au-dessus du terminal.

Phase 1 (MVP) : tout tourne dans le navigateur, sans serveur ni Docker.

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
  vérification des réponses, déroulé d'une partie, progression.
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

1. MVP navigateur (palier Script Kiddie, compagnon, mobile) — en cours
2. Timer (compte à rebours ou chrono, reverse, rachat)
3. Chaos (sabotages d'Arcade)
4. Docker (défis réels, paliers SysAdmin et Root Wizard)
5. Extensions (parcours Git-Gud, style Persona pour Arcade, PowerShell)
