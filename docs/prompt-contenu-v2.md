# Prompt v2 : enrichir Terminal Arcade, par lots

Deuxième vague d'appel à contributions. Différences avec la v1 :

- **un lot différent par IA** (lots disjoints), pour que les réponses ne se
  recouvrent plus et que chaque lot soit comparable à ce qu'il remplace ;
- des **règles anti-triche, de timer, de sorties simulées et de réseau**
  tirées de la première revue (bugs réellement trouvés) ;
- `ss` et `nc` sont maintenant dans l'image ; `jq` n'y est plus.

Mode d'emploi :

1. Joins `docs/exercices.md` (catalogue à jour : 25 niveaux, 127 questions,
   44 variantes).
2. Copie la partie commune, puis **un seul** lot à la suite.
3. Répartition suggérée, d'après la première vague :

| Lot | Sujet | IA suggérée | Pourquoi |
| --- | --- | --- | --- |
| A | Network Phantom (2 niveaux) | ChatGPT | son niveau réseau était le plus rigoureux |
| B | Root Wizard, scripts et système (2 niveaux) | DeepSeek | meilleurs défis docker de la vague 1 |
| C | Git-Gud avancé (2 niveaux) | Mistral | meilleure analyse critique, à tester sur du contenu |
| D | Script Kiddie navigateur (2 niveaux) | Gemini | lot sans docker, moins de pièges techniques |
| E | Variantes manquantes (liste fermée) | Qwen | travail cadré, vérifiable ligne à ligne |
| F | PowerShell (2 niveaux) | au choix, ou une 6e IA | arbre le moins fourni |

4. Pour une revue à l'aveugle (proposée par Mistral), envoie-moi les
   réponses nommées par lot (« Lot A », « Lot B »…) et ne me dis quelle IA a
   fait quoi qu'après mon verdict.

---

## Partie commune (à copier pour tous les lots)

Tu es game designer et formateur Linux. Tu enrichis **Terminal Arcade**, un
jeu web en français pour apprendre le terminal en jouant. Le catalogue
actuel est joint (`exercices.md`) : lis-le entièrement, ne duplique rien, et
n'utilise aucun de ces identifiants déjà pris :

`fs_nav_01, fs_read_01, grep_01, sk_rush_01, sk_chaos_01, sk_aide_01,
sk_glob_01, sa_perms_01, sa_text_01, sa_pipes_01, gg_git_01, gg_branch_01,
ps_basics_01, np_local_01, sa_grep_02, sa_find_01, gg_tags_01, rw_proc_01,
rw_script_01, gg_history_01, gg_bisect_01, ps_pipeline_01,
rw_shellcraft_01, rw_awk_01, gg_workflow_01`

### Le jeu en bref

- Tout se joue dans un terminal. Pas de personnages ni d'histoire : des
  questions, des défis, et un compagnon nommé Arcade qui, en mode Chaos,
  sabote la partie (faux verdicts, touche bloquée, terminal fermé, énoncé
  qui change, faux timer, alias piège dans le shell…).
- Trois paliers : **Script Kiddie** (débutant), **SysAdmin**
  (intermédiaire), **Root Wizard** (avancé). Six arbres : `file_system_ninja`,
  `data_surgeon`, `system_overlord`, `network_phantom`, `git_gud`,
  `powershell`.
- Deux façons d'exécuter un niveau :
  - `runtime: browser` : questions jugées dans le navigateur, sans vrai
    shell (commande, QCM, piège, prédire la sortie, compléter) ;
  - `runtime: docker` : défis réels (`task`) dans un conteneur Linux, où un
    script « arbitre » (`check`) vérifie l'état du système après chaque
    commande du joueur.

### Format d'un niveau (YAML, à la lettre)

```yaml
id: snake_case_unique          # [a-z0-9_]+, préfixe : sk_, sa_, rw_, gg_, np_, ps_
title: "Titre court"
hook: "Phrase d'accroche, une ligne."
tier: sysadmin                 # script_kiddie | sysadmin | root_wizard
tree: network_phantom          # un des six arbres
runtime: docker                # browser | docker
shell: bash                    # docker seulement : bash | pwsh
type: classic
replay: { chaos: true, timer: false }   # timer: false, toujours (voir règle 3)
chaos: { signature: [mutation, false_red] }   # 2 sabotages, voir la liste en fin de prompt
intro: "Une ou deux phrases sur ce que le niveau enseigne."
setup: |                       # docker seulement, optionnel : bash lancé au début du niveau
  ...
questions:
  - ...                        # 5 à 7 questions, chacune avec sa variante
rewards:
  xp: 300                      # Script Kiddie 100–250, SysAdmin 280–380, Root Wizard 380–500
```

Le fichier va dans `shared/levels/<palier>/<nn>_<nom>.yaml`, où `<palier>`
est `script_kiddie`, `sysadmin` ou `root_wizard` (un niveau Git va dans le
dossier de son palier, pas dans un dossier `git_gud`). Ne mets pas de
`unlocks` : on câblera l'arbre de déblocage nous-mêmes.

**Questions `runtime: browser`** (jamais de `task` dans ces niveaux) :

```yaml
- kind: command                # le joueur tape une commande
  prompt: "Énoncé."
  accept: ["ls -a", "ls --all"]   # toutes les formes justes (options groupées et ordre déjà tolérés)
  output: "sortie simulée"     # optionnel, voir règle 4
  explain: "Pourquoi, en une phrase."
  hints: [{ text: "Indice progressif." }]
  variant: { kind: command, ... }   # obligatoire, voir règle 6

- kind: mcq                    # ou trap (question piège, même format)
  prompt: "Question ?"
  code: "commande à analyser"  # optionnel
  choices: ["A", "B", "C", "D"]   # 2 à 6
  answer: 2                    # numéro du bon choix, à partir de 1
  explain: "…"

- kind: predict                # prédire la sortie exacte
  prompt: "Qu'affiche cette commande ?"
  code: "echo $((7 % 3))"
  accept: ["1"]                # la sortie exacte, rien d'autre (pas une phrase d'explication)

- kind: fill                   # compléter le trou : le template contient exactement ___
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
  check: |                     # bash : 0 = réussi, 1 = pas encore, 2 = mauvaise réponse soumise
    ...
  solution: "commande d'exemple montrée si le joueur passe"
  solve: |                     # OBLIGATOIRE : bash qui résout le défi tout seul (sert aux tests)
    ...
  flag: false                  # true : un flag aléatoire est fourni à setup, check et solve dans $FLAG
  hints: [{ text: "…" }, { text: "…", cost_s: 20 }]
  variant: { kind: task, ... } # obligatoire, même structure, avec son propre setup si besoin
```

### La sandbox

- Debian 12 minimal, utilisateur `agent` (uid 1000), **pas de root, pas de
  sudo**, aucune capacité Linux, **aucun réseau externe** : seule
  l'interface locale `lo` (127.0.0.1) existe.
- Système de fichiers en **lecture seule**, sauf `~` (= `/home/agent`,
  64 Mo), `/tmp` (32 Mo, **non exécutable**) et `/srv` (64 Mo). 256 Mo de
  mémoire (512 en PowerShell), un demi-processeur, 128 processus.
- Outils présents : bash, coreutils, findutils, grep, sed, gawk, less, file,
  tree, procps (ps, pgrep, pkill, top), psmisc (killall, pstree), git, tar,
  gzip, bzip2, xz, nano, vim-tiny, bc, **iproute2 (`ss`, `ip`)**,
  **netcat-openbsd (`nc`)**, et `pwsh` 7.
- **Absents** : curl, wget, python, jq, cron (pas de démon), serveur web,
  `nc -e` (non pris en charge par netcat-openbsd). Si tu as besoin d'un
  autre paquet, justifie-le dans « Paquets requis » ; il ne sera ajouté que
  s'il ne donne aucun accès hors du conteneur.
- `setup`, `check` et `solve` tournent en bash, en tant qu'`agent`, dans
  `~`, et sont coupés au bout de **10 secondes**.
- Le joueur répond avec `submit <réponse>`. Dans `check`, utilise
  `answer-is "<valeur attendue>"` (renvoie 0, 1 ou 2 tout seul), ou
  `answer-prefix-of "<valeur complète>" <longueur min>` (identifiant de
  commit abrégé, par exemple). **Ne lis jamais `~/.arcade/submitted`
  toi-même.**
- Processus de fond lancé par `setup` : `setsid nohup <commande> >/dev/null 2>&1 &`.

### Règles (issues des bugs trouvés à la première vague)

1. **Anti-triche.** Un `check` ne doit pas pouvoir être satisfait en
   écrivant directement le résultat attendu sans avoir pratiqué la notion.
   - Compare le fichier du joueur à la **vraie sortie recalculée** :
     `diff -q <(ls /etc) ~/etc.txt`, pas `grep -q passwd ~/etc.txt`.
   - **Tire les données au hasard** dans `setup` (`$RANDOM`, `shuf`), pour
     que la réponse change d'une partie à l'autre.
   - **Aucune réponse écrite en dur** quand elle dépend des données (IP,
     port, nom de fichier, total) : calcule-la dans `check`.
2. **Le `check` tourne après chaque commande du joueur** (deux fois : à
   0,4 s puis à 1,5 s). Il doit être rapide, sans effet de bord, et donner
   le même résultat s'il est relancé. S'il doit exécuter le script du
   joueur, encadre-le avec `timeout 3`.
3. **Pas de timer.** `replay.timer: false` et pas de bloc `timer` : une IA
   ne peut pas mesurer un temps de référence (`par_s`). On mesurera sur de
   vraies parties avant d'activer le Timer.
4. **Sorties simulées exactes.** L'`output` d'une question `command` doit
   être exactement la sortie de **chacune** des formes acceptées. Si deux
   formes donnent des sorties différentes (`ls -a` et `ls -la`), n'en
   accepte qu'une, ou ne mets pas d'`output`.
5. **Compétences gestuelles.** La complétion Tab, Ctrl+R ou les flèches ne
   se testent pas dans le navigateur : pose-les en QCM, ou en défi docker
   (`history`, `!!`, `fc` y fonctionnent vraiment).
6. **Une variante par question**, nouvelle question comprise. La variante
   garde le même type et le même niveau, mais change l'énoncé et la
   réponse ; elle ne doit pas changer de notion. Une variante `task` qui
   dépend de données a **son propre `setup`** : elle peut remplacer la
   question avant que le `setup` d'origine n'ait tourné.
7. **Réponse vide interdite.** Si la valeur attendue peut être vide (aucune
   ligne trouvée), le `check` réussirait sans que le joueur fasse quoi que
   ce soit. Garantis au moins un résultat dans `setup`, et fais échouer le
   `check` si le fichier du joueur n'existe pas.
8. **Énoncé complet.** Tout ce que le `check` exige doit être écrit dans
   l'énoncé : un message de commit précis, un nom de fichier, un format de
   sortie, un dossier.
9. **Chemins.** Si le joueur peut écrire des chemins relatifs (`audit/a.log`)
   ou absolus (`/home/agent/audit/a.log`), le `check` accepte les deux
   (normalise avec `sed "s#^$HOME/##"`).
10. **Processus.** Ne vise jamais un processus avec `pgrep -f`/`pkill -f`
    sur un motif qui figure aussi dans le texte du `check` ou du `solve` :
    ils se trouveraient eux-mêmes. Donne au processus un nom à lui (script
    nommé `watcher`, sans extension, puis `pgrep -x watcher`).
11. **Une notion par question**, difficulté croissante, indices progressifs
    (le second peut coûter plus : `cost_s: 20`), une explication courte.
12. **Français**, tutoiement, phrases courtes. Pas de commande dangereuse
    présentée comme une bonne pratique ; un piège apprend à éviter une
    vraie erreur. Pas de contenu sous licence, pas de personnage.

### Sabotages pour `chaos.signature`

`false_red`, `false_green`, `block_key`, `close_terminal`, `mutation`,
`falsify_code` (exige du `code`), `time_accel`, `time_recul`,
`time_freeze`, `time_fluctuate`, `hostile_alias`, `hostile_path`,
`hostile_chmod`, `hostile_decoy` (ces quatre derniers : docker
seulement). Évite les sabotages de temps, puisque les niveaux n'ont pas de
timer.

### Format de ta réponse (obligatoire)

1. **Niveaux** (ou **Variantes** pour le lot E) : un bloc par fichier,
   précédé de son chemin :

   ````
   ### shared/levels/<palier>/<nn>_<nom>.yaml
   ```yaml
   ...
   ```
   ````

2. **Paquets requis** : liste justifiée, ou « aucun ».
3. **Améliorations** du contenu existant **de ton lot seulement** :
   tableau `Niveau | Question | Problème | Correction proposée`, avec le
   YAML corrigé quand c'est un bug.
4. **Idées de fun** : 3 au maximum, chacune en 3 lignes : principe, ce que
   le joueur apprend, difficulté d'implémentation.
5. **Auto-vérification**, question par question : sur l'état de départ,
   pourquoi le `check` échoue (cite la condition) ; après `solve`, pourquoi
   il réussit ; quelle forme de triche tu as écartée. Dis honnêtement si tu
   n'as pas pu exécuter les scripts.

Pas d'introduction ni de conclusion : uniquement ces sections.

---

## Lot A : Network Phantom

Produis **2 niveaux docker** de l'arbre `network_phantom` :

- un **SysAdmin** (`np_…`) et un **Root Wizard** (`np_…`) ;
- ce qui existe déjà (`np_local_01`) : trouver un port en écoute avec `ss`,
  lire un service avec `nc` ou `/dev/tcp`, lister les ports, arrêter un
  service. Ne le refais pas ;
- pistes : servir un fichier avec `nc -l` et le récupérer côté client,
  dialoguer avec un service qui attend une commande (requête puis
  réponse), un flag découpé en morceaux sur plusieurs ports, repérer
  quel processus tient quel port (`ss -tlnp`), écrire un petit client en
  bash avec `exec 3<>/dev/tcp/…`, distinguer `127.0.0.1` et `0.0.0.0`,
  `ss` sur UDP (`nc -u`) ;
- un service doit rester joignable plusieurs fois (boucle
  `while true; do nc -l 127.0.0.1 "$PORT" -q 0 < fichier; done`), sur
  un **port tiré au hasard** ;
- le Root Wizard enchaîne plusieurs services ou un protocole maison
  simple.

## Lot B : Root Wizard, scripts et système

Produis **2 niveaux docker Root Wizard** (`rw_…`), arbres
`system_overlord` ou `data_surgeon` :

- ce qui existe déjà : boucles, `find -delete`, script avec argument, somme
  awk, processus et signaux, `xargs`, `trap EXIT`/`HUP`, tar incrémental,
  `sed` ciblé, awk à tableaux associatifs. Ne le refais pas ;
- pistes : `set -euo pipefail` et ce qu'il change, fonctions bash et
  `local`, `getopts`, `case`, tableaux bash, here-doc, redirection de
  descripteurs (`exec 3>`), `wait` et jobs en parallèle, `flock`,
  `sort -k` sur plusieurs clés, `join`, `paste`, `comm`, `cut`, `tr`,
  `sed` multi-lignes, `printf` formaté, `date` et calculs de dates,
  rotation de logs à la main ;
- au moins une question doit faire écrire un vrai script au joueur, que
  le `check` exécute (avec `timeout 3`) sur des entrées qu'il choisit lui-même.

## Lot C : Git-Gud avancé

Produis **2 niveaux docker Git** (`gg_…`), arbre `git_gud`, un SysAdmin et
un Root Wizard :

- ce qui existe déjà : init, add, commit, branches, merge, log, show,
  blame, bisect, revert, tags annotés, `.gitignore`, worktree, stash,
  cherry-pick, rebase `--autosquash`, hook post-commit. Ne le refais pas ;
- pistes : résoudre un **conflit de fusion** (choisir et marquer
  résolu), récupérer un commit perdu avec `git reflog`, `git reset`
  (soft, mixed, hard) et leurs effets, `git restore` et
  `git restore --staged`, `git commit --amend`, `git rebase` d'une
  branche sur une autre, sous-modules (dépôt local en
  `file://`), `git log -S` pour retrouver qui a introduit une chaîne,
  `git diff` entre deux tags, `git clean`, `git rm --cached`,
  remote local (`git init --bare` dans `/srv`, push, fetch, pull) ;
- configure `user.name`, `user.email` et `init.defaultBranch main` dans
  le `setup` du niveau ; aucune commande ne doit ouvrir un éditeur sans le
  dire au joueur (`GIT_EDITOR=true` est permis dans `solve`).

## Lot D : Script Kiddie navigateur

Produis **2 niveaux Script Kiddie en `runtime: browser`** (`sk_…`) :

- ce qui existe déjà : pwd, ls, cd, cat, head, tail, less, wc, grep,
  find, man, `--help`, history, `!!`, Tab, Ctrl+C, jokers `*` et `?`,
  `rm -rf` piégé. Ne le refais pas ;
- pistes : `mkdir -p`, `cp -r`, `mv` (renommer ou déplacer), `touch`,
  `rm -i`, chemins relatifs et absolus, `~` et `..`, guillemets simples ou
  doubles et `$VAR`, `echo` et les redirections `>` et `>>`, `sort`,
  `uniq`, codes de sortie et `&&` / `||` / `;`, `clear`, `which`, `file` ;
- au moins **2 QCM, 2 pièges et 2 « prédire la sortie »** par niveau ;
  les pièges reproduisent de vraies erreurs de débutant.

## Lot E : variantes manquantes

Ne produis **pas** de niveau. Écris une variante pour **chaque** question
qui n'en a pas encore dans le catalogue joint (repère les questions sans
« Variante »). Commence par les niveaux `sa_perms_01`, `sa_pipes_01`,
`gg_git_01`, `gg_branch_01`, `gg_history_01`, `gg_bisect_01`,
`rw_proc_01`, `rw_script_01`, `ps_pipeline_01`, `ps_basics_01`, puis les
autres.

Format : pour chaque variante, l'identifiant du niveau, le numéro de la
question (à partir de 1), puis le bloc YAML `variant:` seul, indenté comme
sous une question. Les règles 1, 4, 6, 7 et 8 s'appliquent à la lettre. La
section « Améliorations » reste possible ; « Idées de fun » est facultative.

## Lot F : PowerShell

Produis **2 niveaux docker PowerShell** (`ps_…`, `shell: pwsh`), un
SysAdmin et un Root Wizard :

- le `setup`, le `check` et le `solve` restent en **bash** ; pour
  vérifier avec PowerShell, appelle
  `pwsh -NoProfile -NonInteractive -Command '…'` (démarrage d'environ une
  seconde : pas plus d'un appel par `check`) ;
- ce qui existe déjà : `Get-ChildItem`, `Where-Object`, `Sort-Object`,
  `ConvertFrom-Json`, `Export-Csv`, `ConvertTo-Json`, `Select-String`,
  `Group-Object`, `ForEach-Object`, `Rename-Item`, `Measure-Object`. Ne le
  refais pas ;
- pistes : variables et `$_`, `Get-Member` (découvrir les propriétés),
  `Select-Object -ExpandProperty`, `Format-Table` contre objets,
  `Import-Csv`, hashtables et `[PSCustomObject]`, `Get-Process` et
  `Stop-Process`, `Test-Path`, `New-Item`, `Copy-Item -Recurse`,
  `Get-Content -Tail`, `-replace` et expressions régulières, fonctions
  avec `param()`, `try`/`catch`, `$LASTEXITCODE`, script `.ps1`
  exécuté avec arguments ;
- une question au moins doit montrer ce qui distingue PowerShell de bash
  (des objets, pas du texte).
