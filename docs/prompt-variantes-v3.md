# Prompt v3 : les variantes manquantes

Troisième vague, consacrée à une seule chose : **une variante pour chaque
question**. C'est ce que tire le sabotage « mutation » du mode Chaos : sans
variante, une question ne peut pas changer en cours de partie. Il en manque
72 sur 177.

Deux lots, confiés aux IA les plus fiables des vagues 1 et 2 :

| Lot | IA | Contenu | Variantes |
| --- | --- | --- | --- |
| G | Mistral | Git-Gud (6 niveaux) et Script Kiddie navigateur (6 niveaux) | 39 |
| H | Kimi | défis docker : texte, fichiers, réseau, PowerShell, scripts | 33 |

Mode d'emploi : joins `docs/exercices.md` (le catalogue complet, à jour)
**et** le fichier YAML de chaque niveau du lot (dans `shared/levels/`),
copie la partie commune puis le lot. Je passerai chaque réponse au banc
d'essai, en enchaînement et en mutation, avant d'intégrer.

---

## Partie commune

Tu complètes **Terminal Arcade**, un jeu web en français pour apprendre le
terminal. Le catalogue complet est joint (`exercices.md`), ainsi que les
fichiers YAML des niveaux de ton lot : lis-les entièrement, setup compris.

Ta seule tâche : écrire une **variante** pour chaque question de la liste de
ton lot. Une variante est une autre question, du même type et sur la même
notion, que le mode Chaos peut substituer à l'originale en pleine partie.

### Le format

Pour chaque variante : l'identifiant du niveau, le numéro de la question,
puis le bloc YAML `variant:` seul, indenté comme sous une question :

````
**gg_git_01** - Q3
```yaml
variant:
  kind: task
  prompt: "…"
  setup: |            # si la variante a besoin de données ou d'un état
    …
  check: |
    …
  solution: "…"
  solve: |
    …
  hints:
    - text: "…"
```
````

Les champs sont ceux du catalogue : `command` (`accept`, `output`),
`mcq` et `trap` (`code`, `choices`, `answer` à partir de 1), `predict`
(`code`, `accept`), `fill` (`template` avec `___`, `accept`), `task`
(`setup`, `check`, `solution`, `solve`, `flag`). Toujours `explain` ou au
moins un indice.

### La règle d'or : la mutation

Le banc d'essai joue chaque variante **à la place de sa question, avant que
l'originale n'ait tourné**, puis rejoue **toute la suite du niveau**. La
variante doit donc :

1. **Se suffire à elle-même.** Si elle a besoin de fichiers, de processus ou
   d'un dépôt, son `setup` les prépare. Il ne compte ni sur le `setup` de la
   question qu'elle remplace, ni sur ce qu'une question précédente aurait
   fait. Il est idempotent : il peut être relancé sans casser.
2. **Laisser l'état dont la suite a besoin.** Les questions suivantes
   attendent souvent ce que l'originale a produit : un dépôt initialisé, une
   branche nommée `feature`, un fichier, un processus arrêté. La variante
   doit aboutir au **même état** utile à la suite, ou ne pas y toucher. Jamais
   de nouveau dépôt, d'autre branche ou de fichier renommé que la suite
   attend sous un autre nom. Exemple : si Q3 crée la branche `feature` et que
   Q4 commite dessus, la variante de Q3 peut faire créer `feature` d'une autre
   façon (`git branch` puis `git switch`), pas une branche `develop`.
3. **Changer l'énoncé et la réponse** sans changer de notion : une autre
   option de la même commande, un autre fichier, une autre valeur.

### Les autres règles (issues des bugs des vagues 1 et 2)

- **Anti-triche** : le `check` compare à la vraie sortie recalculée
  (`diff -q <(commande) fichier`), tire ses données au hasard, et ne contient
  aucune réponse écrite en dur quand elle dépend des données.
- **Réponse vide interdite** : si la valeur attendue peut être vide, le
  `check` réussirait sans rien faire. Garantis un résultat, et fais échouer
  le `check` si le fichier du joueur n'existe pas.
- **Énoncé complet** : tout ce que le `check` exige (nom, message, format)
  est écrit dans l'énoncé.
- **Sorties simulées exactes** (`command`) : l'`output` est exactement la
  sortie de chacune des formes acceptées, avec de vrais retours à la ligne.
- **`predict`** : `accept` contient la sortie exacte, jamais vide, sans
  message d'erreur mêlé à la sortie.
- **YAML strict** : pas de `\.` ni de `\$` entre guillemets doubles ;
  utilise des guillemets simples, `[.]`, ou un bloc `|`.
- **Processus** : jamais `pgrep -f`/`pkill -f` sur un motif présent dans le
  texte du `check` ou du `solve` ; un processus qui doit réagir à SIGHUP se
  lance sans `nohup`.
- **Réponses soumises** : `answer-is "<valeur>"` ou
  `answer-prefix-of "<valeur complète>" <longueur>` ; ne lis jamais
  `~/.arcade/submitted`.
- **Sandbox** : Debian 12, utilisateur `agent`, sans root ni réseau externe
  (127.0.0.1 seulement), `/tmp` non exécutable, scripts coupés à 10 s. Outils :
  coreutils, findutils, grep, sed, gawk, git, tar, gzip, bzip2, xz, procps,
  psmisc, iproute2 (`ss`), netcat-openbsd (`nc`), bc, `pwsh` 7. Pas de jq,
  curl, python ni cron.
- **Français**, tutoiement, phrases courtes.

### Ta réponse

1. **Variantes**, dans l'ordre de la liste de ton lot.
2. **Auto-vérification** : pour chaque variante, une ligne. Pourquoi le
   `check` échoue au départ, pourquoi il réussit après `solve`, et quel état
   la variante laisse pour la question suivante. Dis honnêtement si tu as
   exécuté les scripts ou non.

Pas d'introduction ni de conclusion, pas d'autre section.

---

## Lot G : Git-Gud et Script Kiddie (Mistral)

Joins les fichiers `sysadmin/04_git.yaml`, `sysadmin/05_git_branches.yaml`,
`sysadmin/10_git_tags.yaml`, `root_wizard/03_git_history.yaml`,
`root_wizard/04_git_bisect.yaml`, `root_wizard/08_git_workflow.yaml`,
`script_kiddie/02_fs_read.yaml`, `script_kiddie/03_grep.yaml`,
`script_kiddie/04_rush.yaml`, `script_kiddie/05_chaos.yaml`,
`script_kiddie/06_aide.yaml`, `script_kiddie/07_glob.yaml`.

Les niveaux Git s'enchaînent sur un même dépôt : la règle 2 de la mutation
est ici la plus importante.

| Niveau | Questions sans variante |
| --- | --- |
| gg_git_01 | Q1, Q3, Q4, Q5, Q6 |
| gg_branch_01 | Q1, Q2, Q3, Q4, Q5 |
| gg_tags_01 | Q2, Q3, Q4, Q5 |
| gg_history_01 | Q1, Q2, Q3, Q4 |
| gg_bisect_01 | Q1, Q2, Q3 |
| gg_workflow_01 | Q1, Q2, Q3, Q4 |
| fs_read_01 | Q2 (fill), Q6 (trap) |
| grep_01 | Q3 (predict), Q5 (fill), Q6 (trap) |
| sk_rush_01 | Q1 (command), Q3 (mcq), Q6 (command), Q7 (trap) |
| sk_chaos_01 | Q5 (trap) |
| sk_aide_01 | Q5 (trap), Q6 (trap) |
| sk_glob_01 | Q5 (mcq), Q6 (trap) |

Total : 39 variantes.

## Lot H : défis docker (Kimi)

Joins les fichiers `sysadmin/02_text.yaml`, `sysadmin/03_pipes.yaml`,
`sysadmin/06_powershell.yaml`, `sysadmin/07_network.yaml`,
`sysadmin/08_grep.yaml`, `sysadmin/09_find.yaml`,
`root_wizard/02_script.yaml`, `root_wizard/05_powershell.yaml`,
`root_wizard/06_shellcraft.yaml`, `root_wizard/07_awk.yaml`,
`root_wizard/13_network_fragments.yaml`.

Comme à la vague 2, exécute tes scripts si tu le peux (bash, et `pwsh` pour
les niveaux PowerShell, dont le `setup`/`check`/`solve` restent en bash).

| Niveau | Questions sans variante |
| --- | --- |
| sa_text_01 | Q1, Q2, Q5 |
| sa_pipes_01 | Q5 |
| ps_basics_01 | Q1, Q3, Q4, Q5 |
| np_local_01 | Q2, Q3, Q4, Q5 |
| sa_grep_02 | Q2, Q3, Q5 |
| sa_find_01 | Q1, Q3, Q4, Q5 |
| rw_script_01 | Q3 |
| ps_pipeline_01 | Q1, Q2, Q4 |
| rw_shellcraft_01 | Q1, Q2, Q3, Q4, Q5 |
| rw_awk_01 | Q2, Q3, Q4, Q5 |
| np_fragments_01 | Q5 |

Total : 33 variantes.
