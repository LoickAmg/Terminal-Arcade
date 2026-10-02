# Prompt : enrichir le contenu de Terminal Arcade

À copier tel quel dans l'IA de ton choix, **avec le fichier `docs/exercices.md`
en pièce jointe** (le catalogue actuel). Le format de réponse est imposé pour
que chaque proposition puisse être validée et testée automatiquement, puis
comparée aux autres.

---

## Le prompt

Tu es game designer et formateur Linux. Tu vas enrichir **Terminal Arcade**,
un jeu web en français pour apprendre le terminal en jouant. Le catalogue
actuel des exercices est joint (`exercices.md`) : lis-le entièrement avant de
proposer quoi que ce soit, et ne propose rien qui le duplique.

### Le jeu en bref

- Tout se joue dans un terminal. Pas de personnages ni d'histoire : des
  questions, des défis, et un compagnon nommé Arcade qui, en mode Chaos,
  sabote la partie (faux verdicts, touche bloquée, terminal fermé, énoncé qui
  change, faux timer, alias piège dans le shell…).
- Trois paliers de difficulté : **Script Kiddie** (débutant), **SysAdmin**
  (intermédiaire), **Root Wizard** (avancé).
- Six arbres de compétences : `file_system_ninja`, `data_surgeon`,
  `system_overlord`, `network_phantom`, `git_gud`, `powershell`.
- Le parcours **Git-Gud** regroupe tous les niveaux de l'arbre `git_gud`.
- Chaque niveau se rejoue en **Timer** (compte à rebours, chrono, reverse,
  rachat) et en **Chaos**.
- Deux façons d'exécuter un niveau :
  - `runtime: browser` : questions jugées dans le navigateur, sans vrai
    shell (commande, QCM, piège, prédire la sortie, compléter) ;
  - `runtime: docker` : défis réels (`task`) dans un conteneur Linux, où un
    script « arbitre » vérifie l'état du système après chaque commande.

### Ce qui manque aujourd'hui (priorités)

1. **Network Phantom** : aucun niveau. Le conteneur n'a pas de réseau
   externe, mais l'interface locale (127.0.0.1) existe : un service peut
   être lancé dans le conteneur par le script de préparation.
2. **Script Kiddie** : seulement 5 niveaux ; il faut plus de matière pour les
   débutants, dont des niveaux sur les permissions, l'aide (`man`,
   `--help`), les jokers (`*`, `?`), la complétion, l'historique.
3. **QCM, pièges, prédire la sortie** : peu nombreux (13 au total).
4. **Variantes** : seules 11 questions en ont une ; chaque question devrait
   en avoir une (elle sert au sabotage « mutation » du mode Chaos).
5. **Root Wizard** : approfondir (scripts plus longs, `xargs`, `cron`,
   `trap`, `tar` incrémental, `sed` avancé, `awk` multi-fichiers, signaux).
6. **Git-Gud** : rebase interactif non bloquant, tags et versions,
   `.gitignore`, `git worktree`, sous-modules, hooks.

### Ce que tu dois produire

1. **6 nouveaux niveaux** :
   - 2 Script Kiddie en `runtime: browser` ;
   - 2 SysAdmin en `runtime: docker` (dont au moins 1 Network Phantom) ;
   - 1 Root Wizard en `runtime: docker` ;
   - 1 niveau Git-Gud en `runtime: docker`, palier au choix.
2. **Des variantes** pour au moins 10 questions existantes qui n'en ont pas.
3. **Une liste d'améliorations** du contenu existant (questions trop
   faciles, ambiguës, mal dosées, indices faibles…).
4. **Des idées de fun** : mécaniques, types de questions ou sabotages
   nouveaux, réalistes à implémenter.

### Format d'un niveau (YAML, respecté à la lettre)

```yaml
id: snake_case_unique          # [a-z0-9_]+, préfixe conseillé : sk_, sa_, rw_, gg_, np_, ps_
title: "Titre court"
hook: "Phrase d'accroche, une ligne."
tier: script_kiddie            # script_kiddie | sysadmin | root_wizard
tree: network_phantom          # un des six arbres
runtime: docker                # browser | docker
shell: bash                    # docker seulement : bash | pwsh
type: classic                  # classic | timer | chaos | chaos_timer
replay: { chaos: true, timer: true }
timer: { mode: random, duration_s: 300, par_s: 150 }   # obligatoire si replay.timer ; par_s < duration_s
chaos: { signature: [] }       # optionnel : sabotages imposés (voir liste plus bas)
intro: "Une ou deux phrases sur ce que le niveau enseigne."
setup: |                       # docker seulement, optionnel : script bash lancé au début
  ...
questions:
  - ...                        # 4 à 7 questions, voir ci-dessous
rewards:
  xp: 300                      # Script Kiddie 100–250, SysAdmin 280–380, Root Wizard 380–500
  unlocks: []                  # identifiants débloqués (laisser vide : on câblera)
```

**Questions `runtime: browser`** (jamais de `task` dans ces niveaux) :

```yaml
- kind: command                # le joueur tape une commande
  prompt: "Énoncé."
  accept: ["ls -a", "ls --all"]   # toutes les formes justes ; options groupées et ordre des options sont déjà tolérés
  output: "sortie simulée affichée si c'est juste"   # optionnel
  explain: "Pourquoi, en une phrase."                 # optionnel
  hints: [{ text: "Indice progressif." }]
  variant: { ... }             # optionnel : une question de même genre, mais différente

- kind: mcq                    # ou trap (question piège, même format)
  prompt: "Question ?"
  code: "commande à analyser"  # optionnel
  choices: ["A", "B", "C", "D"]   # 2 à 6
  answer: 2                    # numéro du bon choix, à partir de 1

- kind: predict                # prédire la sortie exacte
  prompt: "Qu'affiche cette commande ?"
  code: "echo $((7 % 3))"
  accept: ["1"]

- kind: fill                   # compléter le trou ___
  prompt: "Complète pour …"
  template: "tail ___ app.log"
  accept: ["-f", "--follow"]
```

**Questions `runtime: docker`** (uniquement des `task`) :

```yaml
- kind: task
  prompt: "Ce que le joueur doit obtenir."
  setup: |                     # optionnel, bash, lancé au début de la question
    ...
  check: |                     # bash ; code de sortie : 0 = réussi, 1 = pas encore, 2 = mauvaise réponse soumise
    ...
  solution: "commande d'exemple montrée si le joueur passe"
  solve: |                     # OBLIGATOIRE : bash qui résout le défi de façon automatique (sert aux tests)
    ...
  flag: false                  # true : un flag aléatoire est fourni à setup, check et solve dans $FLAG
  hints: [{ text: "…" }]
  variant: { kind: task, ... } # optionnel, même structure
```

### Contraintes de la sandbox (à respecter, sinon le défi est rejeté)

- Debian 12 minimal, utilisateur `agent` (uid 1000), **pas de root, pas de
  sudo**, aucune capacité Linux, **aucun réseau externe** (seulement
  127.0.0.1).
- Système de fichiers en **lecture seule**, sauf `~` (= `/home/agent`,
  64 Mo), `/tmp` (32 Mo, non exécutable) et `/srv` (64 Mo). 256 Mo de
  mémoire (512 en PowerShell), un demi-processeur, 128 processus.
- Outils présents : bash, coreutils, findutils, grep, sed, gawk, less, file,
  tree, procps (ps, pgrep, pkill, top), psmisc (killall, pstree), jq, git,
  tar, gzip, bzip2, xz, nano, vim-tiny, bc, et `pwsh` 7. **Absents** : curl,
  wget, python, nc, ss, ip, ping, serveur web. Si ton niveau en a besoin,
  liste les paquets Debian à ajouter dans une section « Paquets requis ».
- `setup`, `check` et `solve` tournent en bash, en tant qu'`agent`, dans
  `~`, et sont coupés au bout de **10 secondes**.
- Le joueur répond avec `submit <réponse>` ; dans `check`, utilise
  `answer-is "<valeur attendue>"` (renvoie 0, 1 ou 2 tout seul).
- Pour un processus de fond lancé par `setup` : `setsid nohup <commande> >/dev/null 2>&1 &`.
- Un `check` doit **échouer avant** toute action du joueur et **réussir
  après** `solve`. Calcule les valeurs attendues dans `check` plutôt que de
  les écrire en dur quand elles dépendent du contenu généré.

### Règles de design

- **Français**, tutoiement, phrases courtes, aucun anglicisme inutile.
- Chaque question enseigne **une** notion précise ; difficulté croissante
  dans le niveau ; indices progressifs qui guident sans donner la réponse.
- **Toujours soluble**, sans ambiguïté : un énoncé ne doit admettre qu'une
  réponse acceptée, ou toutes les formes justes doivent être listées.
- Pas de commande dangereuse présentée comme une bonne pratique ; les pièges
  doivent apprendre à éviter une vraie erreur.
- Pas de contenu sous licence ni de personnages existants ; pas de PNJ.
- Le fun vient du scénario implicite (logs à fouiller, processus à
  traquer, flag à trouver), de la variété des types de questions, et de la
  surprise, jamais de l'injustice.

### Sabotages disponibles pour `chaos.signature`

`false_red`, `false_green`, `block_key`, `close_terminal`, `mutation` (exige
une variante), `falsify_code` (exige du `code`), `time_accel`,
`time_recul`, `time_freeze`, `time_fluctuate`, `hostile_alias`,
`hostile_path`, `hostile_chmod`, `hostile_decoy` (ces quatre derniers :
docker seulement).

### Format de ta réponse (obligatoire)

1. **Niveaux** : un bloc par fichier, précédé de son chemin :

   ````
   ### shared/levels/<palier>/<nn>_<nom>.yaml
   ```yaml
   ...
   ```
   ````

2. **Variantes** : pour chaque question existante complétée, l'identifiant
   du niveau, le numéro de la question, puis le bloc YAML `variant:` seul.
3. **Paquets requis** : liste des paquets Debian à ajouter à l'image (ou
   « aucun »).
4. **Améliorations** : un tableau `Niveau | Question | Problème | Correction proposée`.
5. **Idées de fun** : 5 idées maximum, chacune en 3 lignes : le principe,
   ce que le joueur apprend, la difficulté d'implémentation (faible,
   moyenne, forte).
6. **Auto-vérification** : pour chaque niveau, une phrase qui confirme que
   chaque `check` échoue au départ et réussit après `solve`, et que toutes
   les réponses justes sont acceptées.

Pas d'introduction ni de conclusion : uniquement ces six sections.

---

## Comment les réponses seront évaluées

Chaque réponse sera passée dans le même banc d'essai, puis comparée :

| Critère | Comment c'est mesuré |
| --- | --- |
| Validité | les YAML passent le chargeur (`npm test`) sans retouche |
| Solubilité | `npm run test:sandbox -w backend` : chaque `check` refuse au départ, accepte après `solve` |
| Respect des contraintes | outils disponibles, pas de réseau, 10 s, pas de root |
| Pédagogie | une notion par question, progression, qualité des indices et explications |
| Fun et variété | types de questions, scénario implicite, surprise juste |
| Couverture des manques | Network Phantom, Script Kiddie, variantes, Root Wizard, Git |
| Qualité du français | clarté, concision, pas d'ambiguïté |
| Originalité | pas de doublon avec le catalogue existant |

Pour la revue : colle chaque réponse dans la conversation avec Claude, en
indiquant l'IA qui l'a produite.
