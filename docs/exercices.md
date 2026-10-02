# Catalogue des exercices de Terminal Arcade

Généré automatiquement depuis `shared/levels/` par `npm run export:exercices`.
Ne pas modifier à la main : modifier les fichiers YAML, puis régénérer.

**34 niveaux, 177 questions, 105 variantes.**

| Type de question | Nombre |
| --- | --- |
| Commande | 25 |
| QCM | 9 |
| Piège | 9 |
| Prédire la sortie | 10 |
| Compléter | 3 |
| Défi réel (sandbox) | 121 |

## Vue d'ensemble

| Niveau | Titre | Palier | Arbre | Exécution | Type | Questions | XP |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [fs_nav_01](#fs_nav_01--premiers-pas) | Premiers pas | Script Kiddie | File System Ninja | Navigateur | Classique | 6 | 120 |
| [fs_read_01](#fs_read_01--lire-sans-ouvrir) | Lire sans ouvrir | Script Kiddie | File System Ninja | Navigateur | Classique | 6 | 140 |
| [grep_01](#grep_01--laiguille-dans-la-botte-de-foin) | L'aiguille dans la botte de foin | Script Kiddie | Data Surgeon | Navigateur | Classique | 6 | 160 |
| [sk_rush_01](#sk_rush_01--contre-la-montre) | Contre la montre | Script Kiddie | File System Ninja | Navigateur | Timer | 7 | 180 |
| [sk_chaos_01](#sk_chaos_01--arcade-déraille) | Arcade déraille | Script Kiddie | Data Surgeon | Navigateur | Chaos | 6 | 220 |
| [sk_aide_01](#sk_aide_01--le-terminal-sait-aider) | Le terminal sait aider | Script Kiddie | File System Ninja | Navigateur | Classique | 6 | 180 |
| [sk_glob_01](#sk_glob_01--les-jokers-du-shell) | Les jokers du shell | Script Kiddie | File System Ninja | Navigateur | Classique | 6 | 190 |
| [sk_manage_01](#sk_manage_01--bâtisseur-de-dossiers) | Bâtisseur de dossiers | Script Kiddie | File System Ninja | Navigateur | Classique | 6 | 170 |
| [sk_logic_01](#sk_logic_01--logique-et-inspection) | Logique et inspection | Script Kiddie | Data Surgeon | Navigateur | Classique | 7 | 180 |
| [sa_perms_01](#sa_perms_01--accès-refusé) | Accès refusé | SysAdmin | File System Ninja | Sandbox Docker (bash) | Classique | 5 | 300 |
| [sa_text_01](#sa_text_01--chirurgie-de-logs) | Chirurgie de logs | SysAdmin | Data Surgeon | Sandbox Docker (bash) | Classique | 5 | 320 |
| [sa_pipes_01](#sa_pipes_01--tuyauterie) | Tuyauterie | SysAdmin | File System Ninja | Sandbox Docker (bash) | Classique | 5 | 320 |
| [gg_git_01](#gg_git_01--premier-commit) | Premier commit | SysAdmin | Git-Gud | Sandbox Docker (bash) | Classique | 6 | 340 |
| [gg_branch_01](#gg_branch_01--conflits-et-remises) | Conflits et remises | SysAdmin | Git-Gud | Sandbox Docker (bash) | Classique | 5 | 360 |
| [ps_basics_01](#ps_basics_01--objets-pas-du-texte) | Objets, pas du texte | SysAdmin | PowerShell | Sandbox Docker (PowerShell) | Classique | 5 | 360 |
| [np_local_01](#np_local_01--le-service-qui-écoute) | Le service qui écoute | SysAdmin | Network Phantom | Sandbox Docker (bash) | Classique | 5 | 340 |
| [sa_grep_02](#sa_grep_02--traquer-lintrus) | Traquer l'intrus | SysAdmin | Data Surgeon | Sandbox Docker (bash) | Classique | 5 | 330 |
| [sa_find_01](#sa_find_01--chasse-aux-fichiers) | Chasse aux fichiers | SysAdmin | File System Ninja | Sandbox Docker (bash) | Classique | 5 | 350 |
| [gg_tags_01](#gg_tags_01--étiquettes-et-versions) | Étiquettes et versions | SysAdmin | Git-Gud | Sandbox Docker (bash) | Classique | 5 | 360 |
| [ps_stock_01](#ps_stock_01--des-objets-en-rayon) | Des objets en rayon | SysAdmin | PowerShell | Sandbox Docker (PowerShell) | Classique | 5 | 350 |
| [gg_miroir_01](#gg_miroir_01--le-dépôt-miroir) | Le dépôt miroir | SysAdmin | Git-Gud | Sandbox Docker (bash) | Classique | 6 | 360 |
| [rw_proc_01](#rw_proc_01--processus-fantôme) | Processus fantôme | Root Wizard | System Overlord | Sandbox Docker (bash) | Classique | 4 | 380 |
| [rw_script_01](#rw_script_01--automatise-tout) | Automatise tout | Root Wizard | System Overlord | Sandbox Docker (bash) | Classique | 4 | 400 |
| [gg_history_01](#gg_history_01--machine-à-remonter-le-temps) | Machine à remonter le temps | Root Wizard | Git-Gud | Sandbox Docker (bash) | Classique | 4 | 420 |
| [gg_bisect_01](#gg_bisect_01--le-commit-coupable) | Le commit coupable | Root Wizard | Git-Gud | Sandbox Docker (bash) | Classique | 3 | 500 |
| [ps_pipeline_01](#ps_pipeline_01--le-pipeline-des-objets) | Le pipeline des objets | Root Wizard | PowerShell | Sandbox Docker (PowerShell) | Classique | 4 | 420 |
| [rw_shellcraft_01](#rw_shellcraft_01--scripts-résistants) | Scripts résistants | Root Wizard | System Overlord | Sandbox Docker (bash) | Classique | 5 | 460 |
| [rw_awk_01](#rw_awk_01--awk-sans-filet) | awk sans filet | Root Wizard | Data Surgeon | Sandbox Docker (bash) | Classique | 5 | 420 |
| [gg_workflow_01](#gg_workflow_01--historique-propre) | Historique propre | Root Wizard | Git-Gud | Sandbox Docker (bash) | Classique | 4 | 480 |
| [ps_scripts_01](#ps_scripts_01--scripts-sous-tension) | Scripts sous tension | Root Wizard | PowerShell | Sandbox Docker (PowerShell) | Classique | 5 | 460 |
| [gg_defaire_01](#gg_defaire_01--défaire-sans-casser) | Défaire sans casser | Root Wizard | Git-Gud | Sandbox Docker (bash) | Classique | 6 | 460 |
| [rw_script_02](#rw_script_02--scripts-solides) | Scripts solides | Root Wizard | System Overlord | Sandbox Docker (bash) | Classique | 5 | 460 |
| [rw_text_01](#rw_text_01--la-boîte-à-outils-texte) | La boîte à outils texte | Root Wizard | Data Surgeon | Sandbox Docker (bash) | Classique | 5 | 420 |
| [np_fragments_01](#np_fragments_01--les-fragments-du-réseau) | Les fragments du réseau | Root Wizard | Network Phantom | Sandbox Docker (bash) | Classique | 5 | 480 |

## Palier Script Kiddie

### fs_nav_01 — Premiers pas

> Tu viens d'atterrir sur un serveur inconnu. Repère-toi.

| | |
| --- | --- |
| Palier | Script Kiddie |
| Arbre | File System Ninja |
| Exécution | Navigateur |
| Type natif | Classique |
| Rejouable | Timer, Chaos |
| Questions | 6 |
| XP | 120 |
| Timer | random, 120 s (référence 50 s) |
| Débloque | fs_read_01 |

Navigation de base : savoir où l'on est, voir ce qu'il y a autour, se déplacer.

#### Q1 · Commande

Affiche le chemin du dossier dans lequel tu te trouves.

- Réponses acceptées : `pwd`
- Sortie simulée : `/home/agent`
- Indice 1 (10 s) : Trois lettres : « print working directory ».

#### Q1 — variante (sabotage « mutation ») · Commande

Tu viens d'entrer dans /etc. Affiche le chemin du dossier dans lequel tu te trouves.

- Réponses acceptées : `pwd`
- Sortie simulée : `/etc`
- Explication : pwd affiche toujours le dossier courant, où qu'il soit.
- Indice 1 (10 s) : Trois lettres : « print working directory ».

#### Q2 · Commande

Liste le contenu du dossier courant.

- Réponses acceptées : `ls`
- Sortie simulée : `notes.txt  outils  rapport.md`
- Indice 1 (10 s) : Deux lettres, abréviation de « list ».

#### Q2 — variante (sabotage « mutation ») · Commande

Liste le contenu du dossier outils, sans y entrer.

- Réponses acceptées : `ls outils`, `ls outils/`, `ls ./outils`
- Sortie simulée : `grep.sh  scan.txt`
- Explication : ls accepte un dossier en argument : pas besoin d'y aller pour regarder dedans.
- Indice 1 (10 s) : ls, puis le nom du dossier.

#### Q3 · Commande

Certains fichiers commencent par un point et restent invisibles. Liste TOUT le contenu, fichiers cachés compris.

- Réponses acceptées : `ls -a`, `ls --all`
- Sortie simulée : `.  ..  .secret  notes.txt  outils  rapport.md`
- Explication : Un nom qui commence par un point est caché. -a les montre tous, y compris . (ici) et .. (le parent). ls -A fait pareil sans . et ..
- Indice 1 (10 s) : Cherche l'option « all ».

#### Q3 — variante (sabotage « mutation ») · Commande

Liste le contenu du dossier courant en format long : droits, taille, date.

- Réponses acceptées : `ls -l`
- Sortie simulée : `total 12 ⏎ -rw-r--r-- 1 agent agent  812 oct.  1 09:12 notes.txt ⏎ drwxr-xr-x 2 agent agent 4096 oct.  1 09:10 outils ⏎ -rw-r--r-- 1 agent agent 1530 oct.  1 09:14 rapport.md`

#### Q4 · QCM

Que fait cd .. ?

1. **Remonte au dossier parent** ✔
2. Revient au dossier personnel
3. Liste les dossiers
4. Ne fait rien

- Explication : .. désigne toujours le dossier parent. Pour revenir au dossier personnel : cd tout court, ou cd ~.

#### Q4 — variante (sabotage « mutation ») · QCM

Que fait la commande cd tapée seule, sans argument ?

1. Elle remonte au dossier parent
2. **Elle ramène dans ton dossier personnel** ✔
3. Elle affiche le dossier courant
4. Elle renvoie une erreur

- Explication : cd tout seul équivaut à cd ~ : retour au dossier personnel.

#### Q5 · Prédire la sortie

Qu'affiche la dernière commande ?

```bash
cd /var/log
cd ..
pwd
```

- Réponses acceptées : `/var`
- Indice 1 (10 s) : Remonte d'un cran depuis /var/log.

#### Q5 — variante (sabotage « mutation ») · Prédire la sortie

Qu'affiche la dernière commande ?

```bash
cd /etc
cd ..
pwd
```

- Réponses acceptées : `/`
- Explication : /etc est juste sous la racine : son parent est donc /.
- Indice 1 (10 s) : Le parent de /etc est le tout premier dossier du système.

#### Q6 · Commande

Entre dans le dossier outils.

- Réponses acceptées : `cd outils`, `cd ./outils`
- Indice 1 (10 s) : cd suivi du nom du dossier.

#### Q6 — variante (sabotage « mutation ») · Commande

Entre dans le dossier /var/log.

- Réponses acceptées : `cd /var/log`, `cd /var/log/`
- Explication : Un chemin qui commence par / part de la racine : il marche d'où que tu sois.
- Indice 1 (10 s) : cd, puis le chemin complet.

### fs_read_01 — Lire sans ouvrir

> Des fichiers partout, et aucun éditeur. Lis-les quand même.

| | |
| --- | --- |
| Palier | Script Kiddie |
| Arbre | File System Ninja |
| Exécution | Navigateur |
| Type natif | Classique |
| Rejouable | Timer, Chaos |
| Questions | 6 |
| XP | 140 |
| Timer | random, 150 s (référence 70 s) |
| Débloque | grep_01, sk_aide_01 |

Lire un fichier entier, le début, la fin, ou le parcourir page par page.

#### Q1 · Commande

Affiche tout le contenu de notes.txt.

- Réponses acceptées : `cat notes.txt`
- Sortie simulée : `Mot de passe Wi-Fi : changé lundi ⏎ Penser à vider /tmp`
- Indice 1 (10 s) : La commande la plus courte pour afficher un fichier : trois lettres.

#### Q1 — variante (sabotage « mutation ») · Commande

Affiche tout le contenu de rapport.md.

- Réponses acceptées : `cat rapport.md`
- Sortie simulée : `# Rapport de la semaine ⏎ Rien à signaler.`
- Explication : cat recopie le fichier tel quel dans le terminal.
- Indice 1 (10 s) : La même commande que pour notes.txt.

#### Q2 · Compléter

Complète pour n'afficher que les 5 premières lignes de journal.log.

```bash
head ___ 5 journal.log
```

- Réponses acceptées : `-n`
- Indice 1 (10 s) : L'option qui fixe un nombre de lignes.

#### Q3 · Commande

Affiche les 10 dernières lignes de journal.log.

- Réponses acceptées : `tail journal.log`, `tail -n 10 journal.log`, `tail -n10 journal.log`, `tail -10 journal.log`
- Sortie simulée : `… 10 dernières lignes du journal …`
- Explication : Sans option, tail affiche déjà les 10 dernières lignes.
- Indice 1 (10 s) : Le contraire de head.

#### Q3 — variante (sabotage « mutation ») · Commande

Affiche les 10 premières lignes de journal.log.

- Réponses acceptées : `head journal.log`, `head -n 10 journal.log`, `head -n10 journal.log`, `head -10 journal.log`
- Sortie simulée : `… 10 premières lignes du journal …`

#### Q4 · QCM

Quelle commande permet de parcourir un long fichier page par page ?

1. **less** ✔
2. cat
3. echo
4. touch

- Explication : less ouvre le fichier sans tout afficher d'un coup. On en sort avec q.

#### Q4 — variante (sabotage « mutation ») · QCM

Tu es dans less et tu as fini de lire. Quelle touche te rend la main ?

1. **q** ✔
2. Échap
3. Entrée
4. x

- Explication : q quitte less (et man, qui l'utilise pour afficher les pages).

#### Q5 · Prédire la sortie

liste.txt contient exactement 3 lignes, chacune terminée par un retour à la ligne. Qu'affiche cette commande ?

```bash
wc -l < liste.txt
```

- Réponses acceptées : `3`
- Explication : Avec <, wc lit l'entrée standard et n'affiche que le nombre, sans le nom du fichier. wc -l compte les retours à la ligne : une dernière ligne sans retour ne serait pas comptée.
- Indice 1 (10 s) : wc -l compte les lignes.

#### Q5 — variante (sabotage « mutation ») · Prédire la sortie

liste.txt contient exactement 3 lignes, chacune terminée par un retour à la ligne. Qu'affiche cette commande ?

```bash
wc -l liste.txt
```

- Réponses acceptées : `3 liste.txt`
- Explication : Sans <, wc reçoit un nom de fichier et l'ajoute à sa réponse.
- Indice 1 (10 s) : Cette fois, wc connaît le nom du fichier.

#### Q6 · Piège

Tu veux lire notes.txt. Que fait réellement cette commande ?

```bash
cat > notes.txt
```

1. Elle affiche le fichier
2. **Elle vide le fichier et attend du texte à écrire dedans** ✔
3. Elle copie le fichier
4. Elle renvoie une erreur

- Explication : > redirige la sortie vers le fichier et l'écrase. Pour lire : cat notes.txt, sans chevron.

### grep_01 — L'aiguille dans la botte de foin

> Un token administrateur a fuité quelque part dans les logs.

| | |
| --- | --- |
| Palier | Script Kiddie |
| Arbre | Data Surgeon |
| Exécution | Navigateur |
| Type natif | Classique |
| Rejouable | Timer, Chaos |
| Questions | 6 |
| XP | 160 |
| Timer | random, 150 s (référence 75 s) |
| Débloque | sk_rush_01 |

Chercher un mot dans un fichier, compter, et retrouver un fichier perdu.

#### Q1 · Commande

Affiche les lignes de access.log qui contiennent CRITICAL.

- Réponses acceptées : `grep CRITICAL access.log`
- Sortie simulée : `CRITICAL_ERROR - API_KEY: xyz_789_admin`
- Indice 1 (10 s) : grep MOT fichier

#### Q1 — variante (sabotage « mutation ») · Commande

Affiche les lignes de access.log qui contiennent 404.

- Réponses acceptées : `grep 404 access.log`
- Sortie simulée : `404 /image.png introuvable`
- Explication : grep cherche du texte : un nombre est un motif comme un autre.
- Indice 1 (10 s) : grep MOTIF fichier.

#### Q2 · Commande

Même recherche, mais le mot peut aussi être écrit en minuscules. Ignore la casse.

- Réponses acceptées : `grep -i CRITICAL access.log`, `grep -i critical access.log`, `grep --ignore-case CRITICAL access.log`, `grep --ignore-case critical access.log`
- Sortie simulée : `CRITICAL_ERROR - API_KEY: xyz_789_admin ⏎ critical: disque presque plein`
- Indice 1 (10 s) : L'option i comme « ignore case ».

#### Q2 — variante (sabotage « mutation ») · Commande

Compte les lignes de access.log qui contiennent CRITICAL (le nombre seulement).

- Réponses acceptées : `grep -c CRITICAL access.log`, `grep --count CRITICAL access.log`
- Sortie simulée : `1`

#### Q3 · Prédire la sortie

access.log contient 10000 lignes « Connexion OK » et une seule ligne CRITICAL. Qu'affiche cette commande ?

```bash
grep -c OK access.log
```

- Réponses acceptées : `10000`
- Explication : -c compte les lignes qui correspondent au lieu de les afficher.

#### Q4 · Commande

Le fichier password.txt est caché quelque part sous le dossier courant. Trouve son chemin.

- Réponses acceptées : `find . -name password.txt`, `find -name password.txt`
- Sortie simulée : `./archives/2024/old/password.txt`
- Explication : find parcourt les sous-dossiers ; -name filtre sur le nom exact.
- Indice 1 (10 s) : find DOSSIER -name NOM

#### Q4 — variante (sabotage « mutation ») · Commande

Le fichier config.yaml est caché quelque part sous le dossier courant. Trouve son chemin.

- Réponses acceptées : `find . -name config.yaml`, `find -name config.yaml`
- Sortie simulée : `./srv/app/config.yaml`
- Explication : find descend dans tous les sous-dossiers ; -name filtre sur le nom exact.
- Indice 1 (10 s) : find DOSSIER -name NOM.

#### Q5 · Compléter

Complète pour chercher CRITICAL dans tous les fichiers de /var/log et de ses sous-dossiers.

```bash
grep ___ CRITICAL /var/log
```

- Réponses acceptées : `-r`, `-R`, `--recursive`
- Indice 1 (10 s) : r comme « récursif ».

#### Q6 · Piège

Un collègue veut vider le cache avec cette commande. Où est le piège ?

```bash
rm -rf / tmp/cache
```

1. Il manque sudo
2. **L'espace après / : la commande vise aussi la racine du système** ✔
3. -rf doit s'écrire -fr
4. Aucun, la commande est correcte

- Explication : rm reçoit deux chemins : / et tmp/cache. Toujours relire un chemin avant un rm -rf.

### sk_rush_01 — Contre la montre

> Tu pars en retard. Rattrape ton temps en enchaînant les bonnes réponses.

| | |
| --- | --- |
| Palier | Script Kiddie |
| Arbre | File System Ninja |
| Exécution | Navigateur |
| Type natif | Timer |
| Rejouable | Chaos |
| Questions | 7 |
| XP | 180 |
| Timer | buyback, 90 s (référence 60 s, retard 30 s) |
| Débloque | sk_chaos_01 |

Révision express du palier. Chaque bonne réponse du premier coup te rend du temps : reviens à 1:30 avant la fin.

#### Q1 · Commande

Retourne dans ton dossier personnel.

- Réponses acceptées : `cd`, `cd ~`, `cd $HOME`
- Indice 1 (10 s) : cd tout seul suffit.

#### Q2 · Commande

Compte les lignes de access.log.

- Réponses acceptées : `wc -l access.log`
- Sortie simulée : `10001 access.log`
- Indice 1 (10 s) : wc avec l'option qui compte les lignes.

#### Q2 — variante (sabotage « mutation ») · Commande

Compte les mots de access.log.

- Réponses acceptées : `wc -w access.log`
- Sortie simulée : `41230 access.log`
- Explication : -w compte les mots, -l les lignes, -c les octets.
- Indice 1 (10 s) : L'option w comme « words ».

#### Q3 · QCM

Quelle commande liste un dossier avec les détails (droits, taille, date) ?

1. **ls -l** ✔
2. ls -a
3. cat -l
4. pwd -l


#### Q4 · Commande

Affiche les 3 premières lignes de journal.log.

- Réponses acceptées : `head -n 3 journal.log`, `head -n3 journal.log`, `head -3 journal.log`
- Sortie simulée : `08:00 démarrage ⏎ 08:01 connexion base OK ⏎ 08:02 cache chargé`
- Indice 1 (10 s) : head avec -n et un nombre.

#### Q4 — variante (sabotage « mutation ») · Commande

Affiche les 3 dernières lignes de journal.log.

- Réponses acceptées : `tail -n 3 journal.log`, `tail -n3 journal.log`, `tail -3 journal.log`
- Sortie simulée : `08:58 sauvegarde ⏎ 08:59 rotation des logs ⏎ 09:00 arrêt`

#### Q5 · Prédire la sortie

Qu'affiche cette commande ?

```bash
echo bonjour | grep -c o
```

- Réponses acceptées : `1`
- Explication : grep -c compte les lignes qui contiennent o, pas les lettres : une seule ligne ici.

#### Q5 — variante (sabotage « mutation ») · Prédire la sortie

Qu'affiche cette commande ?

```bash
echo un deux trois | wc -w
```

- Réponses acceptées : `3`
- Explication : wc -w compte les mots qu'il reçoit par le pipe.
- Indice 1 (10 s) : Compte les mots séparés par des espaces.

#### Q6 · Commande

Cherche ERROR dans journal.log, quelle que soit la casse.

- Réponses acceptées : `grep -i ERROR journal.log`, `grep -i error journal.log`, `grep --ignore-case ERROR journal.log`, `grep --ignore-case error journal.log`
- Sortie simulée : `08:14 Error: disque presque plein`

#### Q7 · Piège

Tu veux ajouter une ligne à la fin de notes.txt sans rien perdre. Laquelle est sûre ?

1. echo ok > notes.txt
2. **echo ok >> notes.txt** ✔
3. cat notes.txt > notes.txt
4. rm notes.txt

- Explication : >> ajoute à la fin ; > remplace tout le contenu du fichier.

### sk_chaos_01 — Arcade déraille

> Ton compagnon a décidé de jouer contre toi. Ne crois que ce que tu vérifies.

| | |
| --- | --- |
| Palier | Script Kiddie |
| Arbre | Data Surgeon |
| Exécution | Navigateur |
| Type natif | Chaos |
| Rejouable | Timer, Chaos |
| Questions | 6 |
| XP | 220 |
| Timer | random, 180 s (référence 90 s) |
| Sabotages signature | false_red, block_key, mutation, falsify_code |
| Débloque | sa_perms_01 |

Premier niveau Chaos. Les verdicts d'Arcade peuvent mentir ; le terminal, lui, dit toujours vrai.

#### Q1 · Commande

Liste le contenu du dossier en format long (droits, taille, date).

- Réponses acceptées : `ls -l`
- Sortie simulée : `-rw-r--r-- 1 agent agent  812 oct.  1 09:12 notes.txt ⏎ drwxr-xr-x 2 agent agent 4096 oct.  1 09:10 outils`
- Indice 1 (10 s) : l comme « long ».

#### Q1 — variante (sabotage « mutation ») · Commande

Liste le contenu du dossier en format long, fichiers cachés compris.

- Réponses acceptées : `ls -la`
- Sortie simulée : `-rw-r--r-- 1 agent agent   42 oct.  1 09:01 .secret ⏎ -rw-r--r-- 1 agent agent  812 oct.  1 09:12 notes.txt`
- Indice 1 (10 s) : Combine -l et -a.

#### Q2 · Prédire la sortie

Qu'affiche cette commande ?

```bash
seq 4 | wc -l
```

- Réponses acceptées : `4`
- Explication : seq 4 affiche 1 à 4, une ligne chacun ; wc -l compte les lignes.
- Indice 1 (10 s) : seq N affiche les nombres de 1 à N, un par ligne.

#### Q2 — variante (sabotage « mutation ») · Prédire la sortie

Qu'affiche cette commande ?

```bash
printf 'ok
fail
ok
' | grep -c ok
```

- Réponses acceptées : `2`
- Explication : grep -c compte les lignes qui contiennent le motif, pas le nombre total de lignes.
- Indice 1 (10 s) : Trois lignes passent dans le pipe : combien contiennent ok ?

#### Q3 · QCM

Quel caractère envoie la sortie d'une commande vers une autre commande ?

1. **|** ✔
2. >
3. &
4. ;


#### Q3 — variante (sabotage « mutation ») · QCM

Quel opérateur ajoute la sortie à la fin d'un fichier sans l'écraser ?

1. >
2. **>>** ✔
3. |
4. <


#### Q4 · Commande

Cherche le mot root dans /etc/passwd.

- Réponses acceptées : `grep root /etc/passwd`
- Sortie simulée : `root:x:0:0:root:/root:/bin/bash`
- Indice 1 (10 s) : grep MOT fichier

#### Q4 — variante (sabotage « mutation ») · Commande

Compte les lignes qui contiennent root dans /etc/passwd.

- Réponses acceptées : `grep -c root /etc/passwd`
- Sortie simulée : `1`
- Indice 1 (10 s) : grep avec l'option qui compte.

#### Q5 · Piège

Tu es dans ton dossier personnel. Que supprime cette commande ?

```bash
cd /tmp && rm -rf *
```

1. Rien : cd échoue toujours
2. **Le contenu de /tmp, sauf les fichiers cachés** ✔
3. Tout ton dossier personnel
4. Seulement les fichiers cachés de /tmp

- Explication : && n'exécute rm que si cd réussit ; * ne couvre pas les fichiers qui commencent par un point.

#### Q6 · Compléter

Complète pour suivre app.log en direct : les nouvelles lignes s'affichent au fur et à mesure.

```bash
tail ___ app.log
```

- Réponses acceptées : `-f`, `-F`, `--follow`
- Indice 1 (10 s) : f comme « follow ».

#### Q6 — variante (sabotage « mutation ») · Compléter

Complète pour suivre app.log en direct, même si le fichier est remplacé par un nouveau (rotation des logs).

```bash
tail ___ app.log
```

- Réponses acceptées : `-F`, `--follow=name --retry`
- Explication : -F suit le NOM du fichier et se raccroche au nouveau après une rotation ; -f suivrait l'ancien fichier.
- Indice 1 (10 s) : La version majuscule de l'option de suivi.

### sk_aide_01 — Le terminal sait aider

> Personne ne connaît toutes les options par cœur. Le terminal, lui, a une mémoire.

| | |
| --- | --- |
| Palier | Script Kiddie |
| Arbre | File System Ninja |
| Exécution | Navigateur |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 6 |
| XP | 180 |
| Sabotages signature | block_key, mutation |
| Débloque | sk_glob_01 |

Le manuel, l'aide rapide, l'historique et les réflexes clavier qui sauvent.

#### Q1 · Commande

Affiche le manuel de la commande ls.

- Réponses acceptées : `man ls`
- Sortie simulée : `LS(1)                    User Commands                    LS(1) ⏎  ⏎ NAME ⏎        ls - list directory contents ⏎ (le manuel s'ouvre page par page : q pour quitter)`
- Explication : man ouvre le manuel : flèches pour défiler, / pour chercher, q pour quitter.
- Indice 1 (10 s) : Trois lettres, l'abréviation de « manual ».

#### Q1 — variante (sabotage « mutation ») · Commande

Affiche le manuel de la commande grep.

- Réponses acceptées : `man grep`
- Sortie simulée : `GREP(1)                  User Commands                  GREP(1) ⏎  ⏎ NAME ⏎        grep - print lines that match patterns`
- Explication : man marche pour toutes les commandes : seul le nom change.
- Indice 1 (10 s) : man, puis le nom de la commande.

#### Q2 · Commande

Tu ne connais pas les options de tar. Demande son aide rapide, sans ouvrir le manuel.

- Réponses acceptées : `tar --help`
- Sortie simulée : `Usage: tar [OPTION...] [FILE]... ⏎   -c, --create      create a new archive ⏎   -x, --extract     extract files from an archive ⏎   -z, --gzip        filter the archive through gzip`
- Explication : --help résume les options en une page, directement dans le terminal.
- Indice 1 (10 s) : Deux tirets, puis le mot anglais pour « aide ».

#### Q2 — variante (sabotage « mutation ») · Commande

Demande l'aide rapide de la commande grep, sans ouvrir le manuel.

- Réponses acceptées : `grep --help`
- Sortie simulée : `Usage: grep [OPTION]... PATTERNS [FILE]... ⏎   -i, --ignore-case         ignore case distinctions ⏎   -r, --recursive           read all files under each directory`
- Explication : --help est le réflexe à prendre avant de tâtonner.
- Indice 1 (10 s) : La même option marche sur presque toutes les commandes.

#### Q3 · Commande

Affiche l'historique des commandes que tu as tapées.

- Réponses acceptées : `history`
- Sortie simulée : `101  pwd ⏎ 102  ls -a ⏎ 103  cat notes.txt ⏎ 104  history`
- Explication : Le shell numérote et garde tes commandes. !103 relancerait cat notes.txt.
- Indice 1 (10 s) : Le mot anglais pour « historique ».

#### Q3 — variante (sabotage « mutation ») · Compléter

Complète pour n'afficher que les 5 dernières commandes de l'historique.

```bash
history | tail -n ___
```

- Réponses acceptées : `5`
- Explication : tail -n 5 ne garde que les 5 dernières lignes de ce que history affiche.

#### Q4 · QCM

Tu as tapé « cat rapp » et tu veux que le shell finisse le nom du fichier. Quelle touche ?

1. **Tab** ✔
2. Entrée
3. Échap
4. Ctrl+L

- Explication : Tab complète. Deux fois Tab affiche toutes les possibilités quand il y en a plusieurs.

#### Q4 — variante (sabotage « mutation ») · QCM

Quelle commande relance exactement la commande précédente ?

1. **!!** ✔
2. redo
3. !-0
4. history last

- Explication : !! est remplacé par la dernière commande de l'historique. sudo !! relance la précédente en administrateur.

#### Q5 · Piège

Un stagiaire voit cette ligne dans un historique et panique : il croit que des fichiers ont été supprimés. Que s'est-il passé ?

```bash
man rm
```

1. **Rien n'a été supprimé : man ne fait qu'afficher la documentation de rm** ✔
2. Le manuel de rm a été supprimé
3. Tous les fichiers du dossier ont été supprimés
4. L'historique du shell a été vidé

- Explication : man lit et affiche une page de documentation. Il n'exécute jamais la commande décrite.

#### Q6 · Piège

Une commande tourne depuis deux minutes sans rien afficher et le curseur ne revient pas. Que fait Ctrl+C ?

1. Elle ferme le terminal
2. **Elle interrompt la commande en cours et rend la main** ✔
3. Elle copie le texte sélectionné
4. Elle redémarre la machine

- Explication : Dans un terminal, Ctrl+C interrompt le programme au premier plan. Pour copier, c'est souvent Ctrl+Maj+C.

### sk_glob_01 — Les jokers du shell

> Deux caractères remplacent des dizaines de noms de fichiers. Et peuvent tout effacer.

| | |
| --- | --- |
| Palier | Script Kiddie |
| Arbre | File System Ninja |
| Exécution | Navigateur |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 6 |
| XP | 190 |
| Sabotages signature | false_red, mutation |
| Débloque | sk_manage_01 |

L'étoile et le point d'interrogation : viser plusieurs fichiers sans les nommer un par un.

#### Q1 · QCM

Dans le shell, que remplace l'étoile * dans un nom de fichier ?

1. Un seul caractère
2. **Zéro, un ou plusieurs caractères** ✔
3. Un chiffre uniquement
4. Un dossier uniquement

- Explication : * remplace n'importe quelle suite de caractères, y compris aucune : *.log correspond aussi à .log.

#### Q1 — variante (sabotage « mutation ») · QCM

Dans le shell, que remplace le point d'interrogation ? dans un nom de fichier ?

1. **Exactement un caractère** ✔
2. Zéro ou un caractère
3. N'importe quel nombre de caractères
4. Un point

- Explication : ? remplace exactement un caractère, ni plus ni moins.

#### Q2 · Commande

Liste, en une seule commande, tous les fichiers du dossier courant dont le nom se termine par .log.

- Réponses acceptées : `ls *.log`
- Sortie simulée : `app.log  erreur.log  systeme.log`
- Explication : Le shell remplace *.log par la liste des fichiers correspondants avant même de lancer ls.
- Indice 1 (10 s) : Une étoile, puis l'extension.

#### Q2 — variante (sabotage « mutation ») · Commande

Liste, en une seule commande, tous les fichiers du dossier courant dont le nom commence par rapport.

- Réponses acceptées : `ls rapport*`
- Sortie simulée : `rapport_fevrier.txt  rapport_janvier.txt  rapport_mars.txt`
- Explication : Le joker peut être au début, au milieu ou à la fin du motif.
- Indice 1 (10 s) : Le début du nom, puis l'étoile.

#### Q3 · Commande

Le dossier contient journal01.txt à journal09.txt, et aussi journal.txt et journal-final.txt. Liste seulement les neuf journaux numérotés, avec des ? pour les chiffres.

- Réponses acceptées : `ls journal??.txt`
- Sortie simulée : `journal01.txt  journal02.txt  journal03.txt  journal04.txt  journal05.txt  journal06.txt  journal07.txt  journal08.txt  journal09.txt`
- Explication : Un ? par caractère variable : ?? en vise exactement deux. journal*.txt aurait aussi pris journal.txt et journal-final.txt.
- Indice 1 (10 s) : Les numéros ont deux chiffres : il faut donc deux jokers d'un caractère.

#### Q3 — variante (sabotage « mutation ») · Commande

Le dossier contient photo1.jpg à photo9.jpg, et aussi photo10.jpg. Liste seulement photo1.jpg à photo9.jpg avec un ?.

- Réponses acceptées : `ls photo?.jpg`
- Sortie simulée : `photo1.jpg  photo2.jpg  photo3.jpg  photo4.jpg  photo5.jpg  photo6.jpg  photo7.jpg  photo8.jpg  photo9.jpg`
- Explication : photo?.jpg exige exactement un caractère : photo10.jpg, qui en a deux, est écarté.
- Indice 1 (10 s) : Un seul caractère change.

#### Q4 · Prédire la sortie

Le dossier contient exactement a.txt, notes.txt et image.png. Qu'affiche cette commande ?

```bash
echo *.txt
```

- Réponses acceptées : `a.txt notes.txt`
- Explication : Le shell remplace *.txt par les noms correspondants, triés, puis echo les affiche séparés par un espace.
- Indice 1 (10 s) : image.png ne finit pas par .txt.

#### Q4 — variante (sabotage « mutation ») · Prédire la sortie

Le dossier courant ne contient aucun fichier .txt. Qu'affiche cette commande ?

```bash
echo *.txt
```

- Réponses acceptées : `*.txt`
- Explication : Quand rien ne correspond, bash laisse le motif tel quel : echo affiche donc *.txt.

#### Q5 · QCM

Que devient l'étoile quand elle est entre guillemets, comme dans ls "*.log" ?

1. Elle est remplacée par les fichiers, comme d'habitude
2. **Elle reste une vraie étoile : ls cherche un fichier nommé *.log** ✔
3. Elle désigne les fichiers cachés
4. Elle devient une expression régulière

- Explication : Les guillemets empêchent le shell de développer le joker. Utile pour passer un motif à find -name.

#### Q6 · Piège

Tu es dans ton dossier personnel, qui contient projets, sauvegardes et notes.txt. Que fait cette commande ?

```bash
rm -r *
```

1. Rien : il manque un nom de fichier
2. **Elle supprime tout le contenu visible du dossier courant, dossiers compris** ✔
3. Elle supprime seulement les fichiers cachés
4. Elle supprime tout le disque

- Explication : * devient tous les noms visibles du dossier courant, et -r descend dans les dossiers. Lance d'abord ls * pour voir ce qui serait touché.

### sk_manage_01 — Bâtisseur de dossiers

> Construis, déplace et détruis tes fichiers sans trembler.

| | |
| --- | --- |
| Palier | Script Kiddie |
| Arbre | File System Ninja |
| Exécution | Navigateur |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 6 |
| XP | 170 |
| Sabotages signature | mutation, false_red |
| Débloque | sk_logic_01 |

Créer des fichiers et des dossiers, renommer, éviter les pièges de copie, et enchaîner des commandes avec && et ||.

#### Q1 · Commande

Crée un fichier vide nommé brouillon.txt dans le dossier courant.

- Réponses acceptées : `touch brouillon.txt`
- Explication : touch crée le fichier s'il n'existe pas, sinon il met juste à jour sa date.
- Indice 1 (10 s) : Le mot anglais pour « toucher ».

#### Q1 — variante (sabotage « mutation ») · Commande

Crée un fichier vide nommé secret.md.

- Réponses acceptées : `touch secret.md`
- Explication : touch crée rapidement des fichiers vides.
- Indice 1 (10 s) : La même commande que pour brouillon.txt.

#### Q2 · Commande

Crée le dossier projets et, à l'intérieur, le sous-dossier 2026, en une seule commande.

- Réponses acceptées : `mkdir -p projets/2026`, `mkdir --parents projets/2026`
- Explication : -p crée le dossier final et tous les dossiers intermédiaires qui manquent.
- Indice 1 (10 s) : mkdir, avec l'option qui crée aussi les parents.

#### Q2 — variante (sabotage « mutation ») · Commande

Crée le dossier archives et son sous-dossier zip, en une seule commande.

- Réponses acceptées : `mkdir -p archives/zip`, `mkdir --parents archives/zip`
- Explication : Sans -p, mkdir refuserait de créer zip tant qu'archives n'existe pas.
- Indice 1 (10 s) : mkdir -p.

#### Q3 · Piège

Tu veux copier le dossier images dans sauvegardes. Où est l'erreur ?

```bash
cp images sauvegardes/
```

1. Il manque la barre oblique finale après images
2. **cp ne copie pas un dossier sans l'option -r** ✔
3. La commande est correcte
4. Le dossier cible doit être vide

- Explication : cp refuse un dossier (« -r not specified ») : -r copie le dossier et tout son contenu.

#### Q3 — variante (sabotage « mutation ») · Piège

Tu veux supprimer le dossier tmp_cache et son contenu. Où est l'erreur ?

```bash
rm tmp_cache
```

1. Il manque sudo
2. **rm ne supprime pas un dossier sans l'option -r** ✔
3. Il faut écrire delete
4. La commande est correcte

- Explication : rm seul ne supprime que des fichiers. Pour un dossier et son contenu : rm -r.

#### Q4 · QCM

Quelle commande renomme ancien.txt en nouveau.txt ?

1. rename ancien.txt nouveau.txt
2. **mv ancien.txt nouveau.txt** ✔
3. cp ancien.txt nouveau.txt
4. rn ancien.txt nouveau.txt

- Explication : mv déplace : renommer, c'est déplacer au même endroit sous un autre nom. cp laisserait l'ancien fichier.

#### Q4 — variante (sabotage « mutation ») · QCM

Tu veux supprimer important.doc, mais que le terminal te demande confirmation avant. Quelle option ajoutes-tu à rm ?

1. -c
2. -ask
3. **-i** ✔
4. -y

- Explication : -i (interactif) fait demander y ou n avant chaque suppression.

#### Q5 · Prédire la sortie

Qu'affiche cette ligne ?

```bash
echo -n Tic && echo Tac
```

- Réponses acceptées : `TicTac`
- Explication : -n empêche echo de passer à la ligne : Tac s'écrit juste après Tic. && lance la seconde commande parce que la première a réussi.
- Indice 1 (10 s) : Sans retour à la ligne, les deux mots se touchent.

#### Q5 — variante (sabotage « mutation ») · Prédire la sortie

Qu'affiche cette ligne ?

```bash
echo -n Ping && echo Pong
```

- Réponses acceptées : `PingPong`
- Explication : Même mécanique : -n supprime le retour à la ligne de Ping.

#### Q6 · Prédire la sortie

false est une commande qui échoue toujours, sans rien afficher. Qu'affiche cette ligne ?

```bash
false || echo Echec
```

- Réponses acceptées : `Echec`
- Explication : || lance la seconde commande seulement si la première échoue.

#### Q6 — variante (sabotage « mutation ») · Prédire la sortie

false échoue toujours, sans rien afficher. Qu'affiche cette ligne ?

```bash
false ; echo Suite
```

- Réponses acceptées : `Suite`
- Explication : Avec ; la seconde commande tourne quoi qu'il arrive : réussite ou échec, peu importe.

### sk_logic_01 — Logique et inspection

> Le shell a ses propres règles. Apprends à les lire.

| | |
| --- | --- |
| Palier | Script Kiddie |
| Arbre | Data Surgeon |
| Exécution | Navigateur |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 7 |
| XP | 180 |
| Sabotages signature | false_green, block_key |

Trouver un programme, reconnaître le vrai type d'un fichier, comprendre les guillemets, trier sans doublon.

#### Q1 · Commande

Trouve où est installé le programme nano sur la machine.

- Réponses acceptées : `which nano`
- Sortie simulée : `/usr/bin/nano`
- Explication : which affiche le chemin du programme qui sera lancé si tu tapes son nom. type nano dit la même chose, en phrase.
- Indice 1 (10 s) : Le mot anglais pour « lequel ».

#### Q1 — variante (sabotage « mutation ») · Commande

Trouve où est installé le programme bash.

- Réponses acceptées : `which bash`
- Sortie simulée : `/usr/bin/bash`
- Explication : Utile quand plusieurs versions d'un programme sont installées.
- Indice 1 (10 s) : La même commande que pour nano.

#### Q2 · Commande

Une extension peut mentir. Détermine le vrai type du fichier mystere.dat sans l'ouvrir.

- Réponses acceptées : `file mystere.dat`
- Sortie simulée : `mystere.dat: PNG image data, 800 x 600, 8-bit/color RGB, non-interlaced`
- Explication : file lit les premiers octets du fichier (sa signature) pour reconnaître son format.
- Indice 1 (10 s) : Le mot anglais pour « fichier ».

#### Q2 — variante (sabotage « mutation ») · Commande

Vérifie ce que contient vraiment image.jpg, sans te fier à son nom.

- Réponses acceptées : `file image.jpg`
- Sortie simulée : `image.jpg: Bourne-Again shell script, ASCII text executable`
- Explication : Une « image » qui est en fait un script : ne te fie jamais à une extension.
- Indice 1 (10 s) : La même commande que pour mystere.dat.

#### Q3 · Piège

La variable $USER contient ton nom. Qu'affiche cette commande ?

```bash
echo '$USER'
```

1. Ton nom
2. **$USER** ✔
3. Une erreur
4. Rien

- Explication : Les guillemets simples bloquent l'interprétation des variables : le texte s'affiche tel quel.

#### Q3 — variante (sabotage « mutation ») · QCM

Tu veux afficher littéralement le texte $HOME, sans que le shell le remplace. Quelle commande ?

1. echo $HOME
2. echo "$HOME"
3. **echo '$HOME'** ✔
4. echo HOME

- Explication : Seuls les guillemets simples empêchent le remplacement ; les doubles le laissent faire.

#### Q4 · QCM

Tu veux retirer les lignes en double de liste.txt avec uniq. Quel est le piège ?

1. uniq supprime le fichier original
2. **uniq ne repère que les doublons qui se suivent : il faut trier avant** ✔
3. uniq ne marche que sur des nombres
4. uniq n'affiche que 10 lignes

- Explication : uniq compare chaque ligne à la précédente seulement. D'où le classique sort | uniq.

#### Q4 — variante (sabotage « mutation ») · QCM

Un fichier contient les nombres 10, 2 et 1, un par ligne. Que donne sort sans option ?

1. 1, 2, 10
2. 10, 2, 1
3. **1, 10, 2** ✔
4. 2, 1, 10

- Explication : Sans option, sort compare comme du texte : « 10 » vient avant « 2 ». sort -n trie les nombres.

#### Q5 · Prédire la sortie

$USER vaut agent. Qu'affiche cette commande ?

```bash
echo "Je suis $USER"
```

- Réponses acceptées : `Je suis agent`
- Explication : Entre guillemets doubles, le shell remplace les variables par leur valeur.

#### Q5 — variante (sabotage « mutation ») · Prédire la sortie

$HOME vaut /home/agent. Qu'affiche cette commande ?

```bash
echo "Dossier : $HOME"
```

- Réponses acceptées : `Dossier : /home/agent`
- Explication : Les guillemets doubles gardent les espaces et laissent passer les variables.

#### Q6 · Prédire la sortie

f.txt contient trois lignes, toutes identiques : A. Qu'affiche ce pipeline ?

```bash
cat f.txt | uniq | wc -l
```

- Réponses acceptées : `1`
- Explication : uniq réduit les trois A consécutifs à un seul ; wc -l compte cette ligne.

#### Q6 — variante (sabotage « mutation ») · Prédire la sortie

n.txt contient deux lignes : B puis C. Qu'affiche ce pipeline ?

```bash
cat n.txt | uniq | wc -l
```

- Réponses acceptées : `2`
- Explication : Aucun doublon : uniq ne change rien, il reste deux lignes.

#### Q7 · Commande

Affiche le contenu de mots.txt trié par ordre alphabétique, sans aucun doublon.

- Réponses acceptées : `sort mots.txt | uniq`, `cat mots.txt | sort | uniq`, `sort -u mots.txt`
- Sortie simulée : `abricot ⏎ banane ⏎ cerise`
- Explication : sort | uniq est le grand classique ; sort -u fait les deux d'un coup.
- Indice 1 (10 s) : sort pour trier, puis un pipe vers uniq.

#### Q7 — variante (sabotage « mutation ») · Commande

Affiche le contenu de id.txt trié numériquement, sans doublon.

- Réponses acceptées : `sort -n id.txt | uniq`, `cat id.txt | sort -n | uniq`, `sort -nu id.txt`
- Sortie simulée : `1 ⏎ 2 ⏎ 10`
- Explication : -n trie les nombres : 10 vient après 2.
- Indice 1 (10 s) : N'oublie pas l'option -n de sort.

## Palier SysAdmin

### sa_perms_01 — Accès refusé

> Un vrai serveur, de vraies permissions. Rien ne se lance, rien n'est protégé.

| | |
| --- | --- |
| Palier | SysAdmin |
| Arbre | File System Ninja |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Timer, Chaos |
| Questions | 5 |
| XP | 300 |
| Timer | random, 300 s (référence 150 s) |
| Débloque | sa_text_01 |

Premier défi réel : tes commandes s'exécutent dans une sandbox Linux isolée. L'arbitre vérifie l'état du système après chaque commande.

<details><summary>Préparation du niveau</summary>

```bash
cat > ~/deploy.sh <<'EOF'
#!/bin/bash
echo "Déploiement OK. Code : $(cat ~/.deploy_code 2>/dev/null || echo '(aucun)')"
EOF
chmod 644 ~/deploy.sh
```

</details>

#### Q1 · Défi réel (sandbox)

Le script deploy.sh refuse de se lancer (Permission denied). Rends-le exécutable.

- Solution : `chmod +x deploy.sh`
- Indice 1 (10 s) : chmod ajoute un droit avec +, et x veut dire exécution.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
chmod 644 ~/deploy.sh
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -x ~/deploy.sh ]
```

Résolution automatique (tests) :

```bash
chmod +x ~/deploy.sh
```

</details>

#### Q1 — variante (sabotage « mutation ») · Défi réel (sandbox)

Le script report.sh a trop de droits. Donne-lui rwx pour toi, r-- pour le groupe et aucun droit aux autres.

- Solution : `chmod 740 report.sh`
- Indice 1 (10 s) : Lecture 4, écriture 2, exécution 1 : additionne pour chaque groupe.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
printf '#!/bin/bash\necho rapport\n' > ~/report.sh
chmod 777 ~/report.sh
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(stat -c %a ~/report.sh)" = 740 ]
```

Résolution automatique (tests) :

```bash
chmod 740 ~/report.sh
```

</details>

#### Q2 · Défi réel (sandbox)

Lance deploy.sh et envoie le code qu'il affiche avec : submit <code>.

- Solution : `./deploy.sh, puis submit FLAG{…}`
- Flag aléatoire à chaque partie ($FLAG)
- Indice 1 (10 s) : Un script du dossier courant se lance avec ./ devant son nom.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
printf '%s' "$FLAG" > ~/.deploy_code
chmod 600 ~/.deploy_code
[ -x ~/deploy.sh ] || chmod +x ~/deploy.sh
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$FLAG"
```

Résolution automatique (tests) :

```bash
submit "$(~/deploy.sh | sed 's/.*Code : //')"
```

</details>

#### Q2 — variante (sabotage « mutation ») · Défi réel (sandbox)

Le script backup.sh contient un flag. Lance-le et envoie le code qu'il affiche avec : submit <code>.

- Solution : `./backup.sh, puis submit FLAG{…}`
- Flag aléatoire à chaque partie ($FLAG)

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
printf '%s' "$FLAG" > ~/.backup_code
chmod 600 ~/.backup_code
printf '#!/bin/bash\necho "Code: $(cat ~/.backup_code 2>/dev/null || echo none)"\n' > ~/backup.sh
chmod +x ~/backup.sh
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$FLAG"
```

Résolution automatique (tests) :

```bash
submit "$(~/backup.sh | sed 's/.*Code: //')"
```

</details>

#### Q3 · Défi réel (sandbox)

secret.txt est lisible par tout le monde. Ne laisse que lecture et écriture, pour toi seul (rw-------).

- Solution : `chmod 600 secret.txt`
- Indice 1 (10 s) : En octal : lecture 4, écriture 2, exécution 1 ; trois chiffres pour toi, le groupe, les autres.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
echo "mot de passe du serveur : hunter2" > ~/secret.txt
chmod 644 ~/secret.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(stat -c %a ~/secret.txt)" = 600 ]
```

Résolution automatique (tests) :

```bash
chmod 600 ~/secret.txt
```

</details>

#### Q3 — variante (sabotage « mutation ») · Défi réel (sandbox)

secret.txt est lisible par tout le monde. Ne laisse que la lecture, pour toi seul (r--------).

- Solution : `chmod 400 secret.txt`

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
[ -f ~/secret.txt ] || echo "mot de passe du serveur : hunter2" > ~/secret.txt
chmod 644 ~/secret.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(stat -c %a ~/secret.txt)" = 400 ]
```

Résolution automatique (tests) :

```bash
chmod 400 ~/secret.txt
```

</details>

#### Q4 · Défi réel (sandbox)

Crée, en une seule commande, l'arborescence projets/2026/notes.

- Solution : `mkdir -p projets/2026/notes`
- Indice 1 (10 s) : mkdir a une option qui crée aussi les dossiers parents.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -d ~/projets/2026/notes ]
```

Résolution automatique (tests) :

```bash
mkdir -p ~/projets/2026/notes
```

</details>

#### Q4 — variante (sabotage « mutation ») · Défi réel (sandbox)

Crée, en une seule commande, l'arborescence documents/2025/rapports.

- Solution : `mkdir -p documents/2025/rapports`

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -d ~/documents/2025/rapports ]
```

Résolution automatique (tests) :

```bash
mkdir -p ~/documents/2025/rapports
```

</details>

#### Q5 · Défi réel (sandbox)

Archive le dossier projets dans projets.tar.gz (archive tar compressée avec gzip).

- Solution : `tar -czf projets.tar.gz projets`
- Indice 1 (10 s) : tar -c crée, -z compresse en gzip, -f donne le nom de l'archive.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
mkdir -p ~/projets/2026/notes
echo "idée de génie" > ~/projets/2026/notes/idee.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
tar -tzf ~/projets.tar.gz 2>/dev/null | grep -q "projets/2026/notes/idee.txt"
```

Résolution automatique (tests) :

```bash
cd ~ && tar -czf projets.tar.gz projets
```

</details>

#### Q5 — variante (sabotage « mutation ») · Défi réel (sandbox)

Archive le dossier documents dans documents.tar.bz2 (archive tar compressée avec bzip2).

- Solution : `tar -cjf documents.tar.bz2 documents`

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
mkdir -p ~/documents/2025/rapports
echo "idée de génie" > ~/documents/2025/rapports/idee.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
tar -tjf ~/documents.tar.bz2 2>/dev/null | grep -q "documents/2025/rapports/idee.txt"
```

Résolution automatique (tests) :

```bash
cd ~ && tar -cjf documents.tar.bz2 documents
```

</details>

### sa_text_01 — Chirurgie de logs

> Des milliers de lignes, une seule vérité. Découpe, trie, compte.

| | |
| --- | --- |
| Palier | SysAdmin |
| Arbre | Data Surgeon |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Timer, Chaos |
| Questions | 5 |
| XP | 320 |
| Timer | random, 360 s (référence 180 s) |
| Débloque | sa_pipes_01, sa_grep_02 |

Les réponses chiffrées s'envoient avec submit <réponse>.

<details><summary>Préparation du niveau</summary>

```bash
for i in $(seq 1 200); do
  echo "2026-10-01 10:$(printf %02d $((i % 60))) 10.0.0.$((i % 7 + 1)) GET /page$((i % 5)) 200"
done > ~/access.log
for i in 1 2 3 4 5; do echo "2026-10-01 10:59 10.0.0.3 GET /favori 200"; done >> ~/access.log
echo "2026-10-01 11:00 10.0.0.$((RANDOM % 150 + 100)) POST /admin 403" >> ~/access.log
printf 'INFO démarrage\nERROR disque plein\nINFO reprise\nERROR timeout base\nERROR disque plein\n' > ~/app.log
```

</details>

#### Q1 · Défi réel (sandbox)

Combien d'adresses IP différentes apparaissent dans access.log (3e colonne) ? Envoie le nombre avec submit.

- Solution : `awk '{print $3}' access.log | sort -u | wc -l, puis submit 8`
- Indice 1 (10 s) : awk '{print $3}' extrait la 3e colonne ; sort -u trie sans doublon.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(awk "{print \$3}" ~/access.log | sort -u | wc -l)"
```

Résolution automatique (tests) :

```bash
submit "$(awk '{print $3}' ~/access.log | sort -u | wc -l)"
```

</details>

#### Q2 · Défi réel (sandbox)

Écris dans ips.txt la liste des IP, triées et sans doublon, une par ligne.

- Solution : `awk '{print $3}' access.log | sort -u > ips.txt`
- Indice 1 (10 s) : Même pipeline qu'avant, avec > pour écrire dans un fichier.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
diff -q <(awk "{print \$3}" ~/access.log | sort -u) ~/ips.txt >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
awk '{print $3}' ~/access.log | sort -u > ~/ips.txt
```

</details>

#### Q3 · Défi réel (sandbox)

Dans app.log, remplace toutes les occurrences de ERROR par ERREUR, directement dans le fichier.

- Solution : `sed -i 's/ERROR/ERREUR/g' app.log`
- Indice 1 (10 s) : sed -i modifie le fichier sur place ; s/ancien/nouveau/g remplace partout.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
! grep -q ERROR ~/app.log && [ "$(grep -c ERREUR ~/app.log)" = 3 ]
```

Résolution automatique (tests) :

```bash
sed -i 's/ERROR/ERREUR/g' ~/app.log
```

</details>

#### Q3 — variante (sabotage « mutation ») · Défi réel (sandbox)

Dans app.log, supprime toutes les lignes qui commencent par INFO, directement dans le fichier.

- Solution : `sed -i '/^INFO/d' app.log`

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
! grep -q "^INFO" ~/app.log && grep -q "disque plein" ~/app.log
```

Résolution automatique (tests) :

```bash
sed -i '/^INFO/d' ~/app.log
```

</details>

#### Q4 · Défi réel (sandbox)

Une requête a été refusée (code 403). Quelle IP l'a faite ? Envoie-la avec submit.

- Solution : `grep 403 access.log (ou awk '$6 == 403' access.log), puis submit <IP>`
- Indice 1 (10 s) : Le code HTTP est la 6e colonne ; grep 403 suffit pour le repérer.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(awk "\$6 == 403 {print \$3}" ~/access.log)"
```

Résolution automatique (tests) :

```bash
submit "$(awk '$6 == 403 {print $3}' ~/access.log)"
```

</details>

#### Q4 — variante (sabotage « mutation ») · Défi réel (sandbox)

Combien de requêtes de access.log ont réussi (code 200) ? Envoie le nombre avec submit.

- Solution : `grep -c ' 200$' access.log, puis submit <nombre>`
- Indice 1 (10 s) : Le code HTTP est la 6e colonne, en fin de ligne.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(awk "\$6 == 200 {n++} END {print n+0}" ~/access.log)"
```

Résolution automatique (tests) :

```bash
submit "$(awk '$6 == 200 {n++} END {print n+0}' ~/access.log)"
```

</details>

#### Q5 · Défi réel (sandbox)

Quelle IP apparaît le plus souvent dans access.log ? Envoie-la avec submit.

- Solution : `awk '{print $3}' access.log | sort | uniq -c | sort -rn | head -1`
- Indice 1 (10 s) : uniq -c compte les lignes identiques consécutives : trie d'abord.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(awk "{print \$3}" ~/access.log | sort | uniq -c | sort -rn | head -1 | awk "{print \$2}")"
```

Résolution automatique (tests) :

```bash
submit "$(awk '{print $3}' ~/access.log | sort | uniq -c | sort -rn | head -1 | awk '{print $2}')"
```

</details>

### sa_pipes_01 — Tuyauterie

> Rediriger, ajouter, séparer les erreurs : la plomberie du shell.

| | |
| --- | --- |
| Palier | SysAdmin |
| Arbre | File System Ninja |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Timer, Chaos |
| Questions | 5 |
| XP | 320 |
| Timer | random, 300 s (référence 140 s) |
| Débloque | gg_git_01, ps_basics_01, sa_find_01, np_local_01 |

Redirections et pipes : >, >>, 2> et |.

#### Q1 · Défi réel (sandbox)

Enregistre la liste des fichiers de /etc dans etc.txt.

- Solution : `ls /etc > etc.txt`
- Indice 1 (10 s) : > envoie la sortie d'une commande dans un fichier.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
diff -q <(ls /etc) ~/etc.txt >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
ls /etc > ~/etc.txt
```

</details>

#### Q1 — variante (sabotage « mutation ») · Défi réel (sandbox)

Enregistre la liste des fichiers de /usr/bin dans bin.txt.

- Solution : `ls /usr/bin > bin.txt`
- Indice 1 (10 s) : > envoie la sortie d'une commande dans un fichier.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
diff -q <(ls /usr/bin) ~/bin.txt >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
ls /usr/bin > ~/bin.txt
```

</details>

#### Q2 · Défi réel (sandbox)

Ajoute la ligne FIN à la fin de etc.txt, sans effacer ce qu'il contient.

- Solution : `echo FIN >> etc.txt`
- Indice 1 (10 s) : >> ajoute à la fin au lieu de remplacer.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
diff -q <(ls /etc) ~/etc.txt >/dev/null 2>&1 || ls /etc > ~/etc.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(tail -n 1 ~/etc.txt)" = FIN ] && diff -q <(ls /etc) <(head -n -1 ~/etc.txt) >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
echo FIN >> ~/etc.txt
```

</details>

#### Q2 — variante (sabotage « mutation ») · Défi réel (sandbox)

Ajoute la ligne 'Dernière ligne' à la fin de bin.txt, sans effacer ce qu'il contient.

- Solution : `echo 'Dernière ligne' >> bin.txt`

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
ls /usr/bin > ~/bin.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(tail -n 1 ~/bin.txt)" = "Dernière ligne" ] && diff -q <(ls /usr/bin) <(head -n -1 ~/bin.txt) >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
echo "Dernière ligne" >> ~/bin.txt
```

</details>

#### Q3 · Défi réel (sandbox)

Lance ls /nexistepas et envoie uniquement son message d'erreur dans erreurs.log.

- Solution : `ls /nexistepas 2> erreurs.log`
- Indice 1 (10 s) : Les erreurs sortent sur le canal 2.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
diff -q <(ls /nexistepas 2>&1) ~/erreurs.log >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
ls /nexistepas 2> ~/erreurs.log; true
```

</details>

#### Q3 — variante (sabotage « mutation ») · Défi réel (sandbox)

Lance cat /fichier_inconnu et envoie uniquement son message d'erreur dans echec.log.

- Solution : `cat /fichier_inconnu 2> echec.log`

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
diff -q <(cat /fichier_inconnu 2>&1) ~/echec.log >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
cat /fichier_inconnu 2> ~/echec.log; true
```

</details>

#### Q4 · Défi réel (sandbox)

Combien de lignes de /etc/passwd contiennent nologin ? Envoie le nombre avec submit.

- Solution : `grep -c nologin /etc/passwd, puis submit <nombre>`

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(grep -c nologin /etc/passwd)"
```

Résolution automatique (tests) :

```bash
submit "$(grep -c nologin /etc/passwd)"
```

</details>

#### Q4 — variante (sabotage « mutation ») · Défi réel (sandbox)

Combien de lignes de /etc/passwd ne contiennent PAS nologin ? Envoie le nombre avec submit.

- Solution : `grep -vc nologin /etc/passwd, puis submit <nombre>`

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(grep -vc nologin /etc/passwd)"
```

Résolution automatique (tests) :

```bash
submit "$(grep -vc nologin /etc/passwd)"
```

</details>

#### Q5 · Défi réel (sandbox)

Écris dans compte.txt le nombre de fichiers .conf présents directement dans /etc (seulement le nombre).

- Solution : `ls /etc/*.conf | wc -l > compte.txt`
- Indice 1 (10 s) : Un pipe vers wc -l, puis une redirection.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(tr -d " \n" < ~/compte.txt 2>/dev/null)" = "$(ls /etc/*.conf | wc -l)" ]
```

Résolution automatique (tests) :

```bash
ls /etc/*.conf | wc -l > ~/compte.txt
```

</details>

### gg_git_01 — Premier commit

> Git-Gud commence ici : un dépôt, des commits, des branches.

| | |
| --- | --- |
| Palier | SysAdmin |
| Arbre | Git-Gud |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Timer, Chaos |
| Questions | 6 |
| XP | 340 |
| Timer | random, 420 s (référence 200 s) |
| Débloque | rw_proc_01, gg_branch_01 |

Parcours Git-Gud. Git est déjà configuré à ton nom (agent).

<details><summary>Préparation du niveau</summary>

```bash
git config --global user.name agent
git config --global user.email agent@sandbox
git config --global init.defaultBranch main
mkdir -p ~/projet
echo "# Projet" > ~/projet/README.md
```

</details>

#### Q1 · Défi réel (sandbox)

Transforme le dossier projet en dépôt Git.

- Solution : `cd projet && git init`
- Indice 1 (10 s) : git init, dans le dossier.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -d ~/projet/.git ]
```

Résolution automatique (tests) :

```bash
cd ~/projet && git init -q
```

</details>

#### Q2 · Défi réel (sandbox)

Ajoute README.md et fais un premier commit.

- Solution : `git add README.md && git commit -m "Premier commit"`
- Indice 1 (10 s) : git add prépare le fichier, git commit -m "message" l'enregistre.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
git -C ~/projet ls-files | grep -qx README.md && git -C ~/projet log -1 >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
cd ~/projet && git add README.md && git commit -qm "Premier commit"
```

</details>

#### Q2 — variante (sabotage « mutation ») · Défi réel (sandbox)

Ajoute README.md et fais un premier commit avec le message « Documentation ».

- Solution : `git add README.md && git commit -m Documentation`
- Indice 1 (10 s) : git add prépare le fichier, git commit -m donne le message.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/projet && echo "Documentation du projet." >> README.md
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
git -C ~/projet ls-files | grep -qx README.md && [ "$(git -C ~/projet log -1 --format=%s 2>/dev/null)" = Documentation ]
```

Résolution automatique (tests) :

```bash
cd ~/projet && git add README.md && git commit -qm Documentation
```

</details>

#### Q3 · Défi réel (sandbox)

Crée une branche nommée feature et place-toi dessus.

- Solution : `git switch -c feature`
- Indice 1 (10 s) : git switch -c crée la branche et s'y place.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(git -C ~/projet branch --show-current 2>/dev/null)" = feature ]
```

Résolution automatique (tests) :

```bash
cd ~/projet && git switch -qc feature
```

</details>

#### Q4 · Défi réel (sandbox)

Sur feature, modifie README.md puis commite. Le commit doit être sur feature, pas sur main.

- Solution : `echo "Nouveauté" >> README.md && git commit -am "Nouveauté"`

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(git -C ~/projet rev-list --count main..feature 2>/dev/null)" -ge 1 ] && git -C ~/projet diff --name-only main feature | grep -qx README.md
```

Résolution automatique (tests) :

```bash
cd ~/projet && echo nouveau >> README.md && git commit -qam "Nouveauté"
```

</details>

#### Q5 · Défi réel (sandbox)

Reviens sur main et fusionne feature dedans.

- Solution : `git switch main && git merge feature`

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(git -C ~/projet branch --show-current)" = main ] && git -C ~/projet merge-base --is-ancestor feature main
```

Résolution automatique (tests) :

```bash
cd ~/projet && git switch -q main && git merge -q feature
```

</details>

#### Q6 · Défi réel (sandbox)

Dans le dépôt coffre, un ancien commit a pour message « secret: <flag> ». Retrouve le flag et envoie-le avec submit.

- Solution : `git -C coffre log --grep secret`
- Flag aléatoire à chaque partie ($FLAG)
- Indice 1 (10 s) : git log --grep cherche dans les messages de commit.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
rm -rf ~/coffre && mkdir ~/coffre && cd ~/coffre && git init -q
for i in $(seq 1 12); do
  echo "version $i" > app.txt && git add app.txt
  if [ "$i" = 5 ]; then git commit -qm "secret: $FLAG"; else git commit -qm "mise à jour $i"; fi
done
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$FLAG"
```

Résolution automatique (tests) :

```bash
submit "$(git -C ~/coffre log --grep secret --format=%s | sed 's/secret: //')"
```

</details>

### gg_branch_01 — Conflits et remises

> Deux branches touchent la même ligne. À toi de trancher, puis de ranger.

| | |
| --- | --- |
| Palier | SysAdmin |
| Arbre | Git-Gud |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Timer, Chaos |
| Questions | 5 |
| XP | 360 |
| Timer | random, 480 s (référence 240 s) |
| Débloque | gg_history_01, gg_tags_01 |

Parcours Git-Gud : conflits de fusion, git stash, nettoyage des branches.

<details><summary>Préparation du niveau</summary>

```bash
git config --global user.name agent
git config --global user.email agent@sandbox
git config --global init.defaultBranch main
mkdir -p ~/appli && cd ~/appli && git init -q
echo "couleur = bleu" > app.txt && echo "notes du projet" > notes.txt
git add . && git commit -qm "Départ"
git switch -qc rouge
echo "couleur = rouge" > app.txt && git commit -qam "Passe en rouge"
git switch -q main
echo "couleur = vert" > app.txt && git commit -qam "Passe en vert"
```

</details>

#### Q1 · Défi réel (sandbox)

Dans appli, fusionne la branche rouge dans main. Il y aura un conflit sur app.txt : garde la version rouge, puis termine la fusion.

- Solution : `git merge rouge, corrige app.txt (ou git checkout --theirs app.txt), git add app.txt, git commit -m "Fusion de rouge"`
- Indice 1 (10 s) : Après le conflit, édite le fichier (ou git checkout --theirs), puis git add et git commit.
- Indice 2 (10 s) : Les marqueurs <<<<<<<, ======= et >>>>>>> doivent disparaître du fichier.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/appli && [ "$(git branch --show-current)" = main ] && [ ! -f .git/MERGE_HEAD ] \
  && [ "$(cat app.txt)" = "couleur = rouge" ] && git merge-base --is-ancestor rouge main
```

Résolution automatique (tests) :

```bash
cd ~/appli && git merge rouge >/dev/null 2>&1; git checkout --theirs app.txt && git add app.txt && git commit -qm "Fusion de rouge"
```

</details>

#### Q2 · Défi réel (sandbox)

Tu as des modifications en cours dans notes.txt mais tu dois changer de sujet : mets-les de côté avec git stash.

- Solution : `git stash`
- Indice 1 (10 s) : git stash range les modifications non commitées et nettoie la copie de travail.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/appli
printf 'brouillon à finir %d\n' "$RANDOM" > /tmp/gg_branch_01_marque
cat /tmp/gg_branch_01_marque >> notes.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/appli && git stash list | grep -q . && [ -z "$(git status --porcelain --untracked-files=no)" ]
```

Résolution automatique (tests) :

```bash
cd ~/appli && git stash -q
```

</details>

#### Q3 · Défi réel (sandbox)

C'est réglé : récupère tes modifications mises de côté.

- Solution : `git stash pop`
- Indice 1 (10 s) : pop ressort la dernière remise et la supprime de la liste.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/appli
if [ -z "$(git stash list)" ] && [ ! -f /tmp/gg_branch_01_marque ]; then
  printf 'brouillon à finir %d\n' "$RANDOM" > /tmp/gg_branch_01_marque
  cat /tmp/gg_branch_01_marque >> notes.txt
  git stash -q
fi
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/appli && [ -z "$(git stash list)" ] \
  && [ "$(tail -n 1 notes.txt)" = "$(cat /tmp/gg_branch_01_marque 2>/dev/null)" ]
```

Résolution automatique (tests) :

```bash
cd ~/appli && git stash pop -q
```

</details>

#### Q4 · Défi réel (sandbox)

Combien de commits contient maintenant la branche main ? Envoie le nombre avec submit.

- Solution : `git rev-list --count main (ou git log --oneline | wc -l)`

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(git -C ~/appli rev-list --count main)"
```

Résolution automatique (tests) :

```bash
submit "$(git -C ~/appli rev-list --count main)"
```

</details>

#### Q5 · Défi réel (sandbox)

La branche rouge est fusionnée : supprime-la.

- Solution : `git branch -d rouge`
- Indice 1 (10 s) : git branch -d supprime une branche déjà fusionnée.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
! git -C ~/appli show-ref --verify --quiet refs/heads/rouge
```

Résolution automatique (tests) :

```bash
git -C ~/appli branch -qd rouge
```

</details>

### ps_basics_01 — Objets, pas du texte

> En PowerShell, le pipeline transporte des objets. Filtre-les, lis-les, transforme-les.

| | |
| --- | --- |
| Palier | SysAdmin |
| Arbre | PowerShell |
| Exécution | Sandbox Docker (PowerShell) |
| Type natif | Classique |
| Rejouable | Timer, Chaos |
| Questions | 5 |
| XP | 360 |
| Timer | random, 480 s (référence 240 s) |
| Débloque | ps_pipeline_01, ps_stock_01 |

Arbre PowerShell : un vrai pwsh. Les réponses s'envoient avec submit <réponse>.

<details><summary>Préparation du niveau</summary>

```bash
mkdir -p ~/data ~/logs
for n in app web db; do echo "journal $n" > ~/logs/$n.log; done
echo "notes" > ~/logs/lisezmoi.txt
head -c $(( (RANDOM % 3 + 2) * 1000000 )) /dev/zero > ~/data/archive-$((RANDOM % 900 + 100)).bin
echo "petit" > ~/data/a.txt
echo "moyen moyen" > ~/data/b.txt
printf '{"nom": "api", "port": %d, "debug": false}\n' $((RANDOM % 2000 + 8000)) > ~/config.json
```

</details>

#### Q1 · Défi réel (sandbox)

Combien de fichiers .log contient le dossier logs ? Utilise Get-ChildItem, puis envoie le nombre avec submit.

- Solution : `(Get-ChildItem logs -Filter *.log).Count, puis submit 3`
- Indice 1 (10 s) : Get-ChildItem -Filter *.log renvoie des objets ; .Count les compte.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(find ~/logs -maxdepth 1 -name "*.log" | wc -l)"
```

Résolution automatique (tests) :

```bash
submit "$(pwsh -NoProfile -NonInteractive -Command '(Get-ChildItem ~/logs -Filter *.log).Count')"
```

</details>

#### Q2 · Défi réel (sandbox)

Avec Where-Object, trouve le fichier de data qui dépasse 1 Mo et envoie son nom avec submit.

- Solution : `Get-ChildItem data | Where-Object Length -gt 1MB`
- Indice 1 (10 s) : Chaque fichier a une propriété Length ; PowerShell comprend 1MB.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(find ~/data -maxdepth 1 -type f -size +1M -printf "%f")"
```

Résolution automatique (tests) :

```bash
submit "$(pwsh -NoProfile -NonInteractive -Command '(Get-ChildItem ~/data | Where-Object Length -gt 1MB).Name')"
```

</details>

#### Q2 — variante (sabotage « mutation ») · Défi réel (sandbox)

Avec Sort-Object, trouve le plus petit fichier de data et envoie son nom avec submit.

- Solution : `Get-ChildItem data | Sort-Object Length | Select-Object -First 1`

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(find ~/data -maxdepth 1 -type f -printf "%s %f\n" | sort -n | head -n 1 | cut -d" " -f2)"
```

Résolution automatique (tests) :

```bash
submit "$(pwsh -NoProfile -NonInteractive -Command '(Get-ChildItem ~/data | Sort-Object Length | Select-Object -First 1).Name')"
```

</details>

#### Q3 · Défi réel (sandbox)

Lis config.json avec ConvertFrom-Json et envoie la valeur de port avec submit.

- Solution : `(Get-Content config.json | ConvertFrom-Json).port`
- Indice 1 (10 s) : ConvertFrom-Json transforme le texte en objet : ses propriétés se lisent avec un point.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(grep -o "\"port\": *[0-9]*" ~/config.json | grep -o "[0-9]*$")"
```

Résolution automatique (tests) :

```bash
submit "$(pwsh -NoProfile -NonInteractive -Command '(Get-Content ~/config.json | ConvertFrom-Json).port')"
```

</details>

#### Q4 · Défi réel (sandbox)

Exporte la liste des fichiers de data, avec les colonnes Name et Length, dans fichiers.csv (Export-Csv).

- Solution : `Get-ChildItem data | Select-Object Name, Length | Export-Csv fichiers.csv`
- Indice 1 (10 s) : Select-Object garde les colonnes voulues, Export-Csv écrit le fichier.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/fichiers.csv ] || exit 1
head -n 1 ~/fichiers.csv | grep -qx '"Name","Length"' || exit 1
n=0
while IFS= read -r f; do
  grep -qF "\"$(basename "$f")\",\"$(stat -c %s "$f")\"" ~/fichiers.csv || exit 1
  n=$((n + 1))
done < <(find ~/data -maxdepth 1 -type f)
[ "$(wc -l < ~/fichiers.csv)" = $((n + 1)) ]
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command 'Get-ChildItem ~/data | Select-Object Name, Length | Export-Csv ~/fichiers.csv'
```

</details>

#### Q5 · Défi réel (sandbox)

Passe debug à true dans config.json : lis l'objet, modifie la propriété, réécris le JSON.

- Solution : `$c = Get-Content config.json | ConvertFrom-Json; $c.debug = $true; $c | ConvertTo-Json | Set-Content config.json`
- Indice 1 (10 s) : En PowerShell, vrai s'écrit $true.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
grep -Eq "\"debug\": *true" ~/config.json && grep -Eq "\"nom\": *\"api\"" ~/config.json && grep -Eq "\"port\": *[0-9]+" ~/config.json
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command '$c = Get-Content ~/config.json | ConvertFrom-Json; $c.debug = $true; $c | ConvertTo-Json | Set-Content ~/config.json'
```

</details>

### np_local_01 — Le service qui écoute

> Deux services tournent sur cette machine. Trouve-les, parle-leur, fais taire le bon.

| | |
| --- | --- |
| Palier | SysAdmin |
| Arbre | Network Phantom |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 5 |
| XP | 340 |
| Sabotages signature | hostile_path, false_green |
| Débloque | np_fragments_01 |

Network Phantom : ss pour voir qui écoute, nc ou /dev/tcp pour parler. Tout reste sur 127.0.0.1, la machine n'a aucun accès à l'extérieur.

<details><summary>Préparation du niveau</summary>

```bash
mkdir -p ~/net
# Deux ports tirés au hasard, l'accueil toujours plus petit que le coffre.
accueil=$((RANDOM % 2000 + 20000))
coffre=$((RANDOM % 2000 + 30000))
printf '%s\n%s\n' "$accueil" "$coffre" > /tmp/.np-ports
cat > ~/net/service.sh <<'EOF'
#!/bin/bash
# service.sh PORT FICHIER : renvoie le contenu de FICHIER à chaque connexion.
while true; do
  nc -l 127.0.0.1 "$1" -q 0 < "$2" >/dev/null 2>&1
  sleep 0.05
done
EOF
chmod +x ~/net/service.sh
printf 'SERVICE-LOCAL:PRET\n' > ~/net/.accueil
printf 'coffre vide\n' > ~/net/.coffre
setsid nohup ~/net/service.sh "$accueil" ~/net/.accueil >/dev/null 2>&1 &
setsid nohup ~/net/service.sh "$coffre" ~/net/.coffre >/dev/null 2>&1 &
sleep 0.5
```

</details>

#### Q1 · Défi réel (sandbox)

Un service d'accueil écoute sur 127.0.0.1 : c'est le plus petit des ports TCP en écoute. Trouve-le et envoie-le avec submit.

- Solution : `ss -tln, puis submit <port>`
- Indice 1 (10 s) : ss -tln liste les ports TCP (t) en écoute (l), en chiffres (n).
- Indice 2 (10 s) : Le port est à droite des deux-points, dans la colonne Local Address:Port.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(head -n 1 /tmp/.np-ports)"
```

Résolution automatique (tests) :

```bash
submit "$(ss -tlnH | awk '{print $4}' | sed 's/.*://' | sort -n | head -n 1)"
```

</details>

#### Q1 — variante (sabotage « mutation ») · Défi réel (sandbox)

Deux services écoutent sur 127.0.0.1. Trouve le plus GRAND des ports TCP en écoute et envoie-le avec submit.

- Solution : `ss -tln, puis submit <port>`
- Indice 1 (10 s) : ss -tln liste les ports TCP en écoute.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(tail -n 1 /tmp/.np-ports)"
```

Résolution automatique (tests) :

```bash
submit "$(ss -tlnH | awk '{print $4}' | sed 's/.*://' | sort -n | tail -n 1)"
```

</details>

#### Q2 · Défi réel (sandbox)

Le service d'accueil annonce son état dès qu'on se connecte. Récupère ce message et envoie-le avec submit.

- Solution : `nc 127.0.0.1 <port> (ou cat < /dev/tcp/127.0.0.1/<port>), puis submit <message>`
- Indice 1 (10 s) : nc suivi de l'adresse et du port ouvre la connexion.
- Indice 2 (10 s) : Sans nc, bash sait aussi se connecter : cat < /dev/tcp/127.0.0.1/PORT.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "SERVICE-LOCAL:PRET"
```

Résolution automatique (tests) :

```bash
submit "$(cat < /dev/tcp/127.0.0.1/$(head -n 1 /tmp/.np-ports) | tr -d '\r\n')"
```

</details>

#### Q3 · Défi réel (sandbox)

Écris dans ~/net/ports.txt tous les ports TCP en écoute, un par ligne, du plus petit au plus grand.

- Solution : `ss -tlnH | awk '{print $4}' | sed 's/.*://' | sort -n > ~/net/ports.txt`
- Indice 1 (10 s) : ss -H retire la ligne d'en-tête ; la 4e colonne contient adresse:port.
- Indice 2 (20 s) : sed 's/.*://' garde ce qui suit les deux-points, sort -n trie les nombres.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
diff -q /tmp/.np-ports <(grep -v "^[[:space:]]*$" ~/net/ports.txt 2>/dev/null | tr -d " \r") >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
ss -tlnH | awk '{print $4}' | sed 's/.*://' | sort -un > ~/net/ports.txt
```

</details>

#### Q4 · Défi réel (sandbox)

Le second service, celui du plus grand port, garde maintenant un secret. Récupère-le et envoie-le avec submit.

- Solution : `nc 127.0.0.1 <port du coffre>, puis submit <flag>`
- Flag aléatoire à chaque partie ($FLAG)
- Indice 1 (10 s) : Même geste que pour l'accueil, sur l'autre port.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
printf '%s\n' "$FLAG" > ~/net/.coffre
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$FLAG"
```

Résolution automatique (tests) :

```bash
submit "$(cat < /dev/tcp/127.0.0.1/$(tail -n 1 /tmp/.np-ports) | tr -d '\r\n')"
```

</details>

#### Q5 · Défi réel (sandbox)

Le service du coffre n'a plus rien à faire ici. Arrête-le pour de bon : plus rien ne doit écouter sur son port, et l'accueil doit continuer de tourner.

- Solution : `ps -ef | grep service.sh pour trouver la boucle du coffre, puis kill -- -<PID> (tout le groupe) ou pkill -f "service.sh <port>"`
- Indice 1 (10 s) : Le nc qui écoute est relancé par une boucle : arrête d'abord la boucle, puis le nc.
- Indice 2 (20 s) : ps -ef montre les arguments : le port apparaît sur la ligne de service.sh.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
c=$(tail -n 1 /tmp/.np-ports); a=$(head -n 1 /tmp/.np-ports)
sleep 0.3
! ss -tlnH | grep -q ":$c " && ss -tlnH | grep -q ":$a "
```

Résolution automatique (tests) :

```bash
pkill -f "service.sh $(tail -n 1 /tmp/.np-ports)"
pkill -f "nc -l 127.0.0.1 $(tail -n 1 /tmp/.np-ports)"
sleep 0.2
```

</details>

### sa_grep_02 — Traquer l'intrus

> Deux cents lignes normales, quelques lignes qui ne le sont pas.

| | |
| --- | --- |
| Palier | SysAdmin |
| Arbre | Data Surgeon |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 5 |
| XP | 330 |
| Sabotages signature | hostile_decoy, mutation |
| Débloque | rw_awk_01 |

grep en profondeur : inverser, compter avec une expression régulière, chercher dans les sous-dossiers, afficher le contexte.

<details><summary>Préparation du niveau</summary>

```bash
mkdir -p ~/logs/archives/2026
ok() { printf '2026-10-02 10:%02d 10.0.0.%d GET /page%d 200 OK\n' $(($1 % 60)) $(($1 % 5 + 1)) $(($1 % 4)); }
{
  for i in $(seq 1 90); do ok "$i"; done
  printf '2026-10-02 11:01 10.0.0.9 GET /admin 500 FAIL\n'
  for i in $(seq 91 120); do ok "$i"; done
  printf '2026-10-02 11:02 10.0.0.9 GET /admin 503 FAIL\n'
  for i in $(seq 121 125); do ok "$i"; done
  printf '2026-10-02 11:03 10.0.0.9 POST /token 401 FAIL\n'
  for i in $(seq 126 170); do ok "$i"; done
  printf '2026-10-02 11:01 10.0.0.9 GET /admin 500 FAIL\n'
  for i in $(seq 171 200); do ok "$i"; done
} > ~/logs/sante.log
# Les codes 5xx en plus, tirés au hasard, pour que le compte change d'une partie à l'autre.
for i in $(seq 1 $((RANDOM % 4))); do printf '2026-10-02 12:%02d 10.0.0.8 GET /api 502 FAIL\n' "$i" >> ~/logs/sante.log; done
oublie="vieux-$((RANDOM % 900 + 100)).log"
printf '2026-10-01 09:00 10.0.0.2 GET / 200 OK\nTOKEN=%s\n' "$(head -c 6 /dev/urandom | od -An -tx1 | tr -d ' \n')" > ~/logs/archives/2026/"$oublie"
printf '2026-10-01 09:00 10.0.0.2 GET / 200 OK\n' > ~/logs/archives/propre.log
```

</details>

#### Q1 · Défi réel (sandbox)

Écris dans ~/logs/suspectes.txt toutes les lignes de sante.log qui ne contiennent PAS OK.

- Solution : `grep -v OK ~/logs/sante.log > ~/logs/suspectes.txt`
- Indice 1 (10 s) : -v inverse la sélection : grep affiche ce qui ne correspond pas.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
diff -q <(grep -v OK ~/logs/sante.log) ~/logs/suspectes.txt >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
grep -v OK ~/logs/sante.log > ~/logs/suspectes.txt
```

</details>

#### Q1 — variante (sabotage « mutation ») · Défi réel (sandbox)

Écris dans ~/logs/admin.txt toutes les lignes de sante.log qui visent /admin.

- Solution : `grep /admin ~/logs/sante.log > ~/logs/admin.txt`
- Indice 1 (10 s) : Le motif peut contenir une barre oblique.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
diff -q <(grep /admin ~/logs/sante.log) ~/logs/admin.txt >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
grep /admin ~/logs/sante.log > ~/logs/admin.txt
```

</details>

#### Q2 · Défi réel (sandbox)

Combien de lignes de sante.log portent un code HTTP de la famille 5xx (5 suivi de deux chiffres) ? Envoie le nombre avec submit.

- Solution : `grep -cE ' 5[0-9]{2} ' sante.log, puis submit <nombre>`
- Indice 1 (10 s) : Le code HTTP est la 6e colonne, entouré d'espaces.
- Indice 2 (20 s) : grep -E accepte [0-9]{2} : deux chiffres. -c compte les lignes.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(awk "\$6 ~ /^5[0-9][0-9]\$/ {n++} END {print n+0}" ~/logs/sante.log)"
```

Résolution automatique (tests) :

```bash
submit "$(grep -cE ' 5[0-9]{2} ' ~/logs/sante.log)"
```

</details>

#### Q3 · Défi réel (sandbox)

Un fichier quelque part sous ~/logs contient le mot TOKEN. Envoie son nom seul (sans le dossier) avec submit.

- Solution : `grep -rl TOKEN ~/logs, puis submit <nom>`
- Indice 1 (10 s) : -r cherche dans les sous-dossiers, -l n'affiche que le nom des fichiers.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(basename "$(grep -rl TOKEN ~/logs | head -n 1)")"
```

Résolution automatique (tests) :

```bash
submit "$(basename "$(grep -rl TOKEN ~/logs | head -n 1)")"
```

</details>

#### Q4 · Défi réel (sandbox)

Écris dans ~/logs/contexte.txt la ligne de sante.log qui contient 503, suivie des deux lignes d'après.

- Solution : `grep -A 2 503 ~/logs/sante.log > ~/logs/contexte.txt`
- Indice 1 (10 s) : grep sait afficher des lignes après la correspondance : option -A comme « after ».

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
diff -q <(grep -A 2 " 503 " ~/logs/sante.log) ~/logs/contexte.txt >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
grep -A 2 " 503 " ~/logs/sante.log > ~/logs/contexte.txt
```

</details>

#### Q4 — variante (sabotage « mutation ») · Défi réel (sandbox)

Écris dans ~/logs/avant.txt la ligne de sante.log qui contient 401, précédée des deux lignes d'avant.

- Solution : `grep -B 2 401 ~/logs/sante.log > ~/logs/avant.txt`
- Indice 1 (10 s) : -B comme « before ».

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
diff -q <(grep -B 2 " 401 " ~/logs/sante.log) ~/logs/avant.txt >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
grep -B 2 " 401 " ~/logs/sante.log > ~/logs/avant.txt
```

</details>

#### Q5 · Défi réel (sandbox)

Écris dans ~/logs/echecs.txt les lignes FAIL de sante.log, sans doublon, triées par ordre alphabétique.

- Solution : `grep FAIL ~/logs/sante.log | sort -u > ~/logs/echecs.txt`
- Indice 1 (10 s) : Une des lignes FAIL apparaît deux fois. sort -u trie et retire les doublons.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
diff -q <(grep FAIL ~/logs/sante.log | sort -u) ~/logs/echecs.txt >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
grep FAIL ~/logs/sante.log | sort -u > ~/logs/echecs.txt
```

</details>

### sa_find_01 — Chasse aux fichiers

> Le disque est plein. Ne fouille pas au hasard : filtre précisément.

| | |
| --- | --- |
| Palier | SysAdmin |
| Arbre | File System Ninja |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 5 |
| XP | 350 |
| Sabotages signature | hostile_alias, mutation |

find en profondeur : exclure un dossier, filtrer par taille, par contenu vide, par droits, et agir sur chaque résultat. Les chemins peuvent être relatifs (audit/...) ou absolus.

<details><summary>Préparation du niveau</summary>

```bash
mkdir -p ~/audit/vendor/lib ~/audit/conf ~/audit/vide ~/audit/public
printf 'application\n' > ~/audit/app.log
printf 'public\n' > ~/audit/public/acces.log
printf 'a ignorer\n' > ~/audit/vendor/skip.log
printf 'a ignorer\n' > ~/audit/vendor/lib/deep.log
printf 'mode=ok\n' > ~/audit/conf/app.conf
head -c $((RANDOM % 50000 + 120000)) /dev/zero > ~/audit/app.data
head -c 50000 /dev/zero > ~/audit/cache.data
head -c 300000 /dev/zero > ~/audit/vendor/lib/gros.so
for i in $(seq 1 $((RANDOM % 4 + 2))); do : > ~/audit/vide/rien$i.txt; done
printf 'prive\n' > ~/audit/conf/secret.txt
chmod 600 ~/audit/conf/secret.txt
chmod 640 ~/audit/conf/app.conf
```

</details>

#### Q1 · Défi réel (sandbox)

Écris dans logs.txt les fichiers .log de audit, en excluant complètement le dossier vendor, un chemin par ligne.

- Solution : `find audit -path audit/vendor -prune -o -type f -name '*.log' -print > logs.txt`
- Indice 1 (10 s) : -prune empêche find de descendre dans un dossier.
- Indice 2 (20 s) : Forme classique : find audit -path audit/vendor -prune -o <tes filtres> -print

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
norm() { sed -e "s#^$HOME/##" -e 's#^\./##' | sort; }
diff -q <(cd ~ && find audit -path audit/vendor -prune -o -type f -name '*.log' -print | norm) <(norm < ~/logs.txt) >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
cd ~ && find audit -path audit/vendor -prune -o -type f -name '*.log' -print > logs.txt
```

</details>

#### Q2 · Défi réel (sandbox)

Écris dans gros.txt les fichiers réguliers de audit qui dépassent 100 Ko, vendor compris, un chemin par ligne.

- Solution : `find audit -type f -size +100k > gros.txt`
- Indice 1 (10 s) : -size +100k : plus de 100 kibioctets.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
norm() { sed -e "s#^$HOME/##" -e 's#^\./##' | sort; }
diff -q <(cd ~ && find audit -type f -size +100k | norm) <(norm < ~/gros.txt) >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
cd ~ && find audit -type f -size +100k > gros.txt
```

</details>

#### Q2 — variante (sabotage « mutation ») · Défi réel (sandbox)

Écris dans petits.txt les fichiers réguliers de audit qui font moins de 100 Ko mais ne sont pas vides, un chemin par ligne.

- Solution : `find audit -type f -size -100k ! -empty > petits.txt`
- Indice 1 (10 s) : -size -100k, et ! -empty pour exclure les fichiers vides.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
norm() { sed -e "s#^$HOME/##" -e 's#^\./##' | sort; }
diff -q <(cd ~ && find audit -type f -size -100k ! -empty | norm) <(norm < ~/petits.txt) >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
cd ~ && find audit -type f -size -100k ! -empty > petits.txt
```

</details>

#### Q3 · Défi réel (sandbox)

Combien de fichiers vides y a-t-il sous audit ? Envoie le nombre avec submit.

- Solution : `find audit -type f -empty | wc -l, puis submit <nombre>`
- Indice 1 (10 s) : Le filtre -empty repère les fichiers vides ; wc -l compte les lignes.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(find ~/audit -type f -empty | wc -l)"
```

Résolution automatique (tests) :

```bash
submit "$(find ~/audit -type f -empty | wc -l)"
```

</details>

#### Q4 · Défi réel (sandbox)

Combien de fichiers réguliers de audit sont lisibles par les autres utilisateurs (droit r pour « others ») ? Envoie le nombre avec submit.

- Solution : `find audit -type f -perm -o=r | wc -l (ou -perm -004)`
- Indice 1 (10 s) : -perm -004 : au moins le droit de lecture pour les autres. -perm -o=r dit la même chose.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(find ~/audit -type f -perm -o=r | wc -l)"
```

Résolution automatique (tests) :

```bash
submit "$(find ~/audit -type f -perm -004 | wc -l)"
```

</details>

#### Q5 · Défi réel (sandbox)

Crée hashes.txt avec l'empreinte SHA-256 de chaque fichier .log sous audit (vendor compris), en une commande find.

- Solution : `find audit -type f -name '*.log' -exec sha256sum {} + > hashes.txt`
- Indice 1 (10 s) : find lance une commande sur ses résultats avec -exec ... {} +

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
norm() { sed -e "s#  $HOME/#  #" -e 's#  \./#  #' | sort; }
diff -q <(cd ~ && find audit -type f -name '*.log' -exec sha256sum {} + | norm) <(norm < ~/hashes.txt) >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
cd ~ && find audit -type f -name '*.log' -exec sha256sum {} + > hashes.txt
```

</details>

### gg_tags_01 — Étiquettes et versions

> Un dépôt propre : des versions étiquetées, des fichiers générés ignorés, deux copies de travail.

| | |
| --- | --- |
| Palier | SysAdmin |
| Arbre | Git-Gud |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 5 |
| XP | 360 |
| Sabotages signature | hostile_chmod, mutation |
| Débloque | gg_miroir_01 |

Tags annotés, .gitignore et git worktree.

<details><summary>Préparation du niveau</summary>

```bash
git config --global user.name agent
git config --global user.email agent@sandbox
git config --global init.defaultBranch main
rm -rf ~/site ~/site-hotfix
mkdir -p ~/site/src ~/site/build
cd ~/site && git init -q
printf '# Site\n' > README.md
printf "console.log('ok')\n" > src/app.js
git add . && git commit -qm "Version initiale"
printf 'trace\n' > debug.log
printf 'binaire\n' > build/sortie.o
```

</details>

#### Q1 · Défi réel (sandbox)

Dans le dépôt site, pose un tag annoté v1.0.0 sur le dernier commit, avec le message « Première version ».

- Solution : `git tag -a v1.0.0 -m "Première version"`
- Indice 1 (10 s) : Un tag annoté se crée avec -a et un message -m. Sans -a, le tag est « léger ».

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(git -C ~/site cat-file -t v1.0.0 2>/dev/null)" = tag ] && [ "$(git -C ~/site tag -l --format="%(contents:subject)" v1.0.0)" = "Première version" ] && [ "$(git -C ~/site rev-parse "v1.0.0^{commit}")" = "$(git -C ~/site rev-parse main)" ]
```

Résolution automatique (tests) :

```bash
git -C ~/site tag -a v1.0.0 -m "Première version"
```

</details>

#### Q1 — variante (sabotage « mutation ») · Défi réel (sandbox)

Dans le dépôt site, pose un tag annoté v0.9.0-beta sur le dernier commit, avec le message « Bêta ».

- Solution : `git tag -a v0.9.0-beta -m "Bêta"`
- Indice 1 (10 s) : git tag -a NOM -m MESSAGE.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(git -C ~/site cat-file -t v0.9.0-beta 2>/dev/null)" = tag ] && [ "$(git -C ~/site tag -l --format="%(contents:subject)" v0.9.0-beta)" = "Bêta" ] && [ "$(git -C ~/site rev-parse "v0.9.0-beta^{commit}")" = "$(git -C ~/site rev-parse main)" ]
```

Résolution automatique (tests) :

```bash
git -C ~/site tag -a v0.9.0-beta -m "Bêta"
```

</details>

#### Q2 · Défi réel (sandbox)

debug.log et le dossier build/ ne doivent jamais être suivis. Écris un .gitignore qui ignore tous les .log et le dossier build/, puis commite-le.

- Solution : `printf '*.log\nbuild/\n' > .gitignore && git add .gitignore && git commit -m "Ignore les fichiers générés"`
- Indice 1 (10 s) : Un motif par ligne : *.log, puis build/ (la barre finale désigne un dossier).
- Indice 2 (10 s) : git check-ignore FICHIER confirme qu'un chemin est bien ignoré.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/site || exit 1
git check-ignore -q debug.log && git check-ignore -q build/sortie.o && git check-ignore -q autre.log \
  && ! git check-ignore -q README.md && git ls-files --error-unmatch .gitignore >/dev/null 2>&1 \
  && [ -z "$(git status --porcelain)" ]
```

Résolution automatique (tests) :

```bash
cd ~/site && printf '*.log\nbuild/\n' > .gitignore && git add .gitignore && git commit -qm "Ignore les fichiers générés"
```

</details>

#### Q3 · Défi réel (sandbox)

Ouvre une seconde copie de travail du dépôt dans ~/site-hotfix, sur une nouvelle branche nommée hotfix.

- Solution : `git worktree add -b hotfix ~/site-hotfix`
- Indice 1 (10 s) : git worktree add DOSSIER -b BRANCHE crée la branche et la copie d'un coup.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
git -C ~/site worktree list --porcelain | grep -qx "worktree /home/agent/site-hotfix" \
  && [ "$(git -C ~/site-hotfix branch --show-current 2>/dev/null)" = hotfix ]
```

Résolution automatique (tests) :

```bash
cd ~/site && git worktree add -q -b hotfix ~/site-hotfix
```

</details>

#### Q4 · Défi réel (sandbox)

Dans ~/site-hotfix, crée hotfix.txt contenant le mot urgent et commite-le sur hotfix. main ne doit pas changer.

- Solution : `cd ~/site-hotfix && echo urgent > hotfix.txt && git add hotfix.txt && git commit -m "Correctif urgent"`
- Indice 1 (10 s) : Dans ~/site-hotfix, la branche courante est déjà hotfix.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(git -C ~/site show hotfix:hotfix.txt 2>/dev/null)" = urgent ] && ! git -C ~/site cat-file -e main:hotfix.txt 2>/dev/null
```

Résolution automatique (tests) :

```bash
cd ~/site-hotfix && printf 'urgent\n' > hotfix.txt && git add hotfix.txt && git commit -qm "Correctif urgent"
```

</details>

#### Q5 · Défi réel (sandbox)

Le correctif est commité. Supprime la copie de travail ~/site-hotfix proprement, sans supprimer la branche hotfix.

- Solution : `git worktree remove ~/site-hotfix`
- Indice 1 (10 s) : L'inverse de worktree add. Un simple rm -rf laisserait une trace dans git worktree list.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ ! -d ~/site-hotfix ] && git -C ~/site show-ref --verify --quiet refs/heads/hotfix && ! git -C ~/site worktree list | grep -q site-hotfix
```

Résolution automatique (tests) :

```bash
cd ~/site && git worktree remove ~/site-hotfix
```

</details>

### ps_stock_01 — Des objets en rayon

> Un inventaire plein de virgules. Le texte seul ne suffit plus.

| | |
| --- | --- |
| Palier | SysAdmin |
| Arbre | PowerShell |
| Exécution | Sandbox Docker (PowerShell) |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 5 |
| XP | 350 |
| Sabotages signature | mutation, false_red |

Créer dossiers et fichiers, copier un arbre entier, lire un CSV en objets et garder la fin d'un journal : les gestes PowerShell de base.

<details><summary>Préparation du niveau</summary>

```bash
mkdir -p ~/depot/archives ~/depot/photos
printf 'vieux rapport\n' > ~/depot/archives/rapport.txt
head -c 2048 /dev/zero > ~/depot/photos/logo.bin
printf 'inventaire du mois\n' > ~/depot/lisezmoi.txt
q1=$((RANDOM % 45 + 5)); q2=$((RANDOM % 45 + 5))
while [ "$q2" = "$q1" ]; do q2=$((RANDOM % 45 + 5)); done
q3=$((RANDOM % 50 + 50))
mapfile -t qs < <(printf '%s\n' "$q1" "$q2" "$q3" | shuf)
{
  echo 'nom,salle,quantite'
  echo "\"clavier, sans fil\",A$((RANDOM % 20 + 1)),${qs[0]}"
  echo "souris,B$((RANDOM % 20 + 1)),${qs[1]}"
  echo "ecran,C$((RANDOM % 20 + 1)),${qs[2]}"
} > ~/inventaire.csv
n=$((RANDOM % 30 + 20))
: > ~/journal.log
for i in $(seq 1 "$n"); do
  printf '2026-10-03 08:%02d INFO evenement %d\n' "$((i % 60))" "$i" >> ~/journal.log
done
printf 'CODE: %s\n' "$(head -c 4 /dev/urandom | od -An -tx1 | tr -d ' \n')" >> ~/journal.log
```

</details>

#### Q1 · Défi réel (sandbox)

Crée le dossier exports/2026 (y compris exports s'il n'existe pas) avec New-Item.

- Solution : `New-Item -ItemType Directory -Path exports/2026 -Force`
- Indice 1 (10 s) : New-Item -ItemType Directory -Path, suivi du chemin, crée un dossier.
- Indice 2 (20 s) : -Force crée aussi les dossiers parents manquants.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -d ~/exports/2026 ]
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command 'New-Item -ItemType Directory -Path "$HOME/exports/2026" -Force | Out-Null'
```

</details>

#### Q1 — variante (sabotage « mutation ») · Défi réel (sandbox)

Crée un fichier vide exports/brouillon.txt (y compris exports s'il n'existe pas) avec New-Item.

- Solution : `New-Item -ItemType File -Path exports/brouillon.txt -Force`
- Indice 1 (10 s) : Même cmdlet, mais -ItemType File.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/exports/brouillon.txt ]
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command 'New-Item -ItemType File -Path "$HOME/exports/brouillon.txt" -Force | Out-Null'
```

</details>

#### Q2 · Défi réel (sandbox)

Copie tout le dossier depot, sous-dossiers et fichiers compris, dans un nouveau dossier sauvegarde. Une seule commande.

- Solution : `Copy-Item -Recurse depot sauvegarde`
- Indice 1 (10 s) : Copy-Item copie ; sans option, un dossier arrive vide.
- Indice 2 (20 s) : -Recurse emporte tout le contenu du dossier.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -d ~/sauvegarde ] && diff -r ~/depot ~/sauvegarde >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command 'Copy-Item -Recurse "$HOME/depot" "$HOME/sauvegarde"'
```

</details>

#### Q2 — variante (sabotage « mutation ») · Défi réel (sandbox)

Copie tout le dossier depot, sous-dossiers et fichiers compris, dans un nouveau dossier archives_depot. Une seule commande.

- Solution : `Copy-Item -Recurse depot archives_depot`
- Indice 1 (10 s) : Copy-Item -Recurse SOURCE CIBLE.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -d ~/archives_depot ] && diff -r ~/depot ~/archives_depot >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command 'Copy-Item -Recurse "$HOME/depot" "$HOME/archives_depot"'
```

</details>

#### Q3 · Défi réel (sandbox)

inventaire.csv contient un article dont le nom porte une virgule, entre guillemets. Quel article a la plus grande quantité ? Envoie son nom exact avec submit.

- Solution : `Import-Csv inventaire.csv | Sort-Object { [int]$_.quantite } | Select-Object -Last 1 -ExpandProperty nom, puis submit <nom>`
- Explication : cut ou awk casseraient les colonnes à cause de la virgule entre guillemets ; Import-Csv lit de vrais objets.
- Indice 1 (10 s) : Import-Csv inventaire.csv donne un objet par ligne, avec la propriété quantite.
- Indice 2 (20 s) : Trie sur [int]$_.quantite et prends le dernier.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(pwsh -NoProfile -NonInteractive -Command '(Import-Csv "$HOME/inventaire.csv" | Sort-Object { [int]$_.quantite } | Select-Object -Last 1 -ExpandProperty nom)')"
```

Résolution automatique (tests) :

```bash
submit "$(pwsh -NoProfile -NonInteractive -Command '(Import-Csv "$HOME/inventaire.csv" | Sort-Object { [int]$_.quantite } | Select-Object -Last 1 -ExpandProperty nom)')"
```

</details>

#### Q3 — variante (sabotage « mutation ») · Défi réel (sandbox)

Toujours dans inventaire.csv : quel article a la plus petite quantité ? Envoie son nom exact avec submit.

- Solution : `Import-Csv inventaire.csv | Sort-Object { [int]$_.quantite } | Select-Object -First 1 -ExpandProperty nom, puis submit <nom>`
- Indice 1 (10 s) : Même tri, mais prends le premier.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(pwsh -NoProfile -NonInteractive -Command '(Import-Csv "$HOME/inventaire.csv" | Sort-Object { [int]$_.quantite } | Select-Object -First 1 -ExpandProperty nom)')"
```

Résolution automatique (tests) :

```bash
submit "$(pwsh -NoProfile -NonInteractive -Command '(Import-Csv "$HOME/inventaire.csv" | Sort-Object { [int]$_.quantite } | Select-Object -First 1 -ExpandProperty nom)')"
```

</details>

#### Q4 · Défi réel (sandbox)

Calcule la somme de toutes les quantités de inventaire.csv, avec une variable et $_ dans ForEach-Object. Envoie le total avec submit.

- Solution : `$t = 0; Import-Csv inventaire.csv | ForEach-Object { $t += [int]$_.quantite }; $t, puis submit <total>`
- Indice 1 (10 s) : $_ désigne l'objet qui passe dans le pipeline ; [int] convertit le texte en nombre.
- Indice 2 (20 s) : $t = 0, puis dans le bloc : $t += [int]$_.quantite

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(pwsh -NoProfile -NonInteractive -Command '$t = 0; Import-Csv "$HOME/inventaire.csv" | ForEach-Object { $t += [int]$_.quantite }; $t')"
```

Résolution automatique (tests) :

```bash
submit "$(pwsh -NoProfile -NonInteractive -Command '$t = 0; Import-Csv "$HOME/inventaire.csv" | ForEach-Object { $t += [int]$_.quantite }; $t')"
```

</details>

#### Q4 — variante (sabotage « mutation ») · Défi réel (sandbox)

Combien d'articles de inventaire.csv ont une quantité strictement supérieure à 20 ? Compte-les avec une variable et $_ dans ForEach-Object, puis envoie le nombre avec submit.

- Solution : `$n = 0; Import-Csv inventaire.csv | ForEach-Object { if ([int]$_.quantite -gt 20) { $n++ } }; $n, puis submit <nombre>`
- Indice 1 (10 s) : Un if dans le bloc ForEach-Object : $n++ quand la condition est vraie.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(pwsh -NoProfile -NonInteractive -Command '$n = 0; Import-Csv "$HOME/inventaire.csv" | ForEach-Object { if ([int]$_.quantite -gt 20) { $n++ } }; $n')"
```

Résolution automatique (tests) :

```bash
submit "$(pwsh -NoProfile -NonInteractive -Command '$n = 0; Import-Csv "$HOME/inventaire.csv" | ForEach-Object { if ([int]$_.quantite -gt 20) { $n++ } }; $n')"
```

</details>

#### Q5 · Défi réel (sandbox)

La dernière ligne de journal.log contient un code (CODE: xxxx). Affiche-la avec Get-Content -Tail et envoie la ligne entière avec submit.

- Solution : `Get-Content journal.log -Tail 1, puis submit CODE: <code>`
- Indice 1 (10 s) : Get-Content journal.log -Tail 1 n'affiche que la dernière ligne.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(tail -n 1 ~/journal.log)"
```

Résolution automatique (tests) :

```bash
submit "$(tail -n 1 ~/journal.log)"
```

</details>

#### Q5 — variante (sabotage « mutation ») · Défi réel (sandbox)

Écris les 3 dernières lignes de journal.log dans extrait.txt, avec Get-Content -Tail.

- Solution : `Get-Content journal.log -Tail 3 | Set-Content extrait.txt`
- Indice 1 (10 s) : Get-Content journal.log -Tail 3, puis un pipe vers Set-Content.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/extrait.txt ] && diff -q <(tail -n 3 ~/journal.log) ~/extrait.txt >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command 'Get-Content "$HOME/journal.log" -Tail 3 | Set-Content "$HOME/extrait.txt"'
```

</details>

### gg_miroir_01 — Le dépôt miroir

> Ton code n'existe vraiment qu'une fois qu'il a quitté ta machine.

| | |
| --- | --- |
| Palier | SysAdmin |
| Arbre | Git-Gud |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 6 |
| XP | 360 |
| Sabotages signature | mutation, false_red |

Un distant sans réseau : dépôt nu, remote, push avec suivi, clone, puis la vraie différence entre pull et fetch.

<details><summary>Préparation du niveau</summary>

```bash
git config --global user.name agent
git config --global user.email agent@sandbox
git config --global init.defaultBranch main
rm -rf ~/musee ~/miroir.git ~/copie ~/vitrine
mkdir -p ~/musee && cd ~/musee && git init -q
printf 'inventaire %d\n' "$RANDOM" > inventaire.txt
git add inventaire.txt && git commit -qm "Inventaire initial"
```

</details>

#### Q1 · Défi réel (sandbox)

Dans ton dossier personnel, crée un dépôt Git nu nommé miroir.git : un dépôt sans copie de travail, fait pour servir de distant.

- Solution : `git init --bare ~/miroir.git`
- Indice 1 (10 s) : git init, avec l'option qui fabrique un dépôt sans copie de travail : --bare.
- Indice 2 (10 s) : Le dossier personnel s'écrit ~/miroir.git : le tilde se développe tout seul.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(git -C ~/miroir.git rev-parse --is-bare-repository 2>/dev/null)" = true ]
```

Résolution automatique (tests) :

```bash
git init -q --bare ~/miroir.git
```

</details>

#### Q1 — variante (sabotage « mutation ») · Défi réel (sandbox)

Dans ton dossier personnel, crée un dépôt Git nu nommé sauvegarde.git, sans copie de travail.

- Solution : `git init --bare ~/sauvegarde.git`
- Indice 1 (10 s) : La même option --bare ; seul le nom du dossier change.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(git -C ~/sauvegarde.git rev-parse --is-bare-repository 2>/dev/null)" = true ]
```

Résolution automatique (tests) :

```bash
git init -q --bare ~/sauvegarde.git
```

</details>

#### Q2 · Défi réel (sandbox)

Dans le dépôt musee, déclare le dépôt nu ~/miroir.git comme distant, sous le nom origin.

- Solution : `git -C ~/musee remote add origin ~/miroir.git`
- Indice 1 (10 s) : git remote add NOM ADRESSE associe un nom à un chemin de dépôt.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
git init -q --bare ~/miroir.git 2>/dev/null || true
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
url=$(git -C ~/musee remote get-url origin 2>/dev/null) || exit 1
case "$url" in /*) ;; *) url="$HOME/musee/$url";; esac
[ "$(realpath -m "$url")" = "$HOME/miroir.git" ]
```

Résolution automatique (tests) :

```bash
git -C ~/musee remote remove origin 2>/dev/null || true
git -C ~/musee remote add origin "$HOME/miroir.git"
```

</details>

#### Q2 — variante (sabotage « mutation ») · Défi réel (sandbox)

Dans le dépôt musee, déclare le dépôt nu ~/miroir.git comme distant, sous le nom backup.

- Solution : `git -C ~/musee remote add backup ~/miroir.git`
- Indice 1 (10 s) : Seul le nom du distant change : backup au lieu d'origin.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
git init -q --bare ~/miroir.git 2>/dev/null || true
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
url=$(git -C ~/musee remote get-url backup 2>/dev/null) || exit 1
case "$url" in /*) ;; *) url="$HOME/musee/$url";; esac
[ "$(realpath -m "$url")" = "$HOME/miroir.git" ]
```

Résolution automatique (tests) :

```bash
git -C ~/musee remote remove backup 2>/dev/null || true
git -C ~/musee remote add backup "$HOME/miroir.git"
```

</details>

#### Q3 · Défi réel (sandbox)

Envoie la branche main de musee sur le distant origin, et mémorise le lien : main doit suivre origin/main.

- Solution : `git -C ~/musee push -u origin main`
- Indice 1 (10 s) : git push NOMDISTANT BRANCHE envoie la branche ; l'option -u mémorise le suivi.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
git init -q --bare ~/miroir.git 2>/dev/null || true
git -C ~/musee remote add origin "$HOME/miroir.git" 2>/dev/null || true
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -n "$(git -C ~/musee rev-parse -q --verify origin/main 2>/dev/null)" ] \
  && [ "$(git -C ~/musee rev-parse main)" = "$(git -C ~/musee rev-parse origin/main)" ] \
  && [ "$(git -C ~/musee rev-parse -q --verify main@{upstream} 2>/dev/null)" = "$(git -C ~/musee rev-parse main)" ]
```

Résolution automatique (tests) :

```bash
git -C ~/musee push -q -u origin main >/dev/null 2>&1
```

</details>

#### Q3 — variante (sabotage « mutation ») · Défi réel (sandbox)

Le dépôt nu est aussi déclaré sous le nom backup. Envoie main sur backup, avec suivi : main doit suivre backup/main.

- Solution : `git -C ~/musee push -u backup main`
- Indice 1 (10 s) : Le même geste, un autre nom de distant : git push -u backup main.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
git init -q --bare ~/miroir.git 2>/dev/null || true
git -C ~/musee remote add origin "$HOME/miroir.git" 2>/dev/null || true
git -C ~/musee remote add backup "$HOME/miroir.git" 2>/dev/null || true
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -n "$(git -C ~/musee rev-parse -q --verify backup/main 2>/dev/null)" ] \
  && [ "$(git -C ~/musee rev-parse main)" = "$(git -C ~/musee rev-parse backup/main)" ] \
  && [ "$(git -C ~/musee rev-parse -q --verify main@{upstream} 2>/dev/null)" = "$(git -C ~/musee rev-parse main)" ]
```

Résolution automatique (tests) :

```bash
git -C ~/musee push -q -u backup main >/dev/null 2>&1
```

</details>

#### Q4 · Défi réel (sandbox)

Fais un clone du distant ~/miroir.git dans un dossier nommé copie, dans ton dossier personnel. Le clone doit contenir inventaire.txt et pointer son origin vers le dépôt nu.

- Solution : `git clone ~/miroir.git ~/copie`
- Indice 1 (10 s) : git clone ADRESSE DOSSIER copie un distant et branche origin dessus tout seul.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
git init -q --bare ~/miroir.git 2>/dev/null || true
git -C ~/musee remote add origin "$HOME/miroir.git" 2>/dev/null || true
git -C ~/musee push -q origin main >/dev/null 2>&1 || true
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
u=$(git -C ~/copie remote get-url origin 2>/dev/null) || exit 1
case "$u" in /*) ;; *) u="$HOME/copie/$u";; esac
[ "$(realpath -m "$u")" = "$HOME/miroir.git" ] \
  && [ "$(cat ~/copie/inventaire.txt 2>/dev/null)" = "$(git -C ~/miroir.git show main:inventaire.txt 2>/dev/null)" ]
```

Résolution automatique (tests) :

```bash
rm -rf ~/copie
git clone -q "$HOME/miroir.git" "$HOME/copie"
```

</details>

#### Q4 — variante (sabotage « mutation ») · Défi réel (sandbox)

Fais un clone du distant ~/miroir.git dans un dossier nommé vitrine. Il doit contenir inventaire.txt et pointer son origin vers le dépôt nu.

- Solution : `git clone ~/miroir.git ~/vitrine`
- Indice 1 (10 s) : La même commande de clone, un autre dossier de destination.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
git init -q --bare ~/miroir.git 2>/dev/null || true
git -C ~/musee remote add origin "$HOME/miroir.git" 2>/dev/null || true
git -C ~/musee push -q origin main >/dev/null 2>&1 || true
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
u=$(git -C ~/vitrine remote get-url origin 2>/dev/null) || exit 1
case "$u" in /*) ;; *) u="$HOME/vitrine/$u";; esac
[ "$(realpath -m "$u")" = "$HOME/miroir.git" ] \
  && [ "$(cat ~/vitrine/inventaire.txt 2>/dev/null)" = "$(git -C ~/miroir.git show main:inventaire.txt 2>/dev/null)" ]
```

Résolution automatique (tests) :

```bash
rm -rf ~/vitrine
git clone -q "$HOME/miroir.git" "$HOME/vitrine"
```

</details>

#### Q5 · Défi réel (sandbox)

Un collègue a poussé un commit sur le distant : le fichier nouveaute.txt y est maintenant. Récupère-le et intègre-le dans musee : après ton git pull, ta branche main doit être à jour avec le distant.

- Solution : `cd ~/musee && git pull`
- Indice 1 (10 s) : git pull, c'est git fetch puis une intégration : il ramène le commit du collègue et avance main.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
git init -q --bare ~/miroir.git 2>/dev/null || true
git -C ~/musee remote add origin "$HOME/miroir.git" 2>/dev/null || true
git -C ~/musee push -q origin main >/dev/null 2>&1 || true
rm -rf /tmp/gg_miroir_collegue
git clone -q "$HOME/miroir.git" /tmp/gg_miroir_collegue
cd /tmp/gg_miroir_collegue
printf 'nouveaute %d\n' "$RANDOM" > nouveaute.txt
git add nouveaute.txt && git commit -qm "Ajout du collègue"
git push -q origin main >/dev/null 2>&1
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/musee/nouveaute.txt ] \
  && [ "$(git -C ~/musee rev-parse main 2>/dev/null)" = "$(git -C ~/miroir.git rev-parse refs/heads/main 2>/dev/null)" ]
```

Résolution automatique (tests) :

```bash
git -C ~/musee pull -q origin main >/dev/null 2>&1
```

</details>

#### Q5 — variante (sabotage « mutation ») · Défi réel (sandbox)

Le collègue a encore poussé : surprise.txt est arrivé sur le distant. Récupère-le et intègre-le dans musee, main à jour.

- Solution : `cd ~/musee && git pull`
- Indice 1 (10 s) : Le même réflexe : rapatrier puis intégrer.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
git init -q --bare ~/miroir.git 2>/dev/null || true
git -C ~/musee remote add origin "$HOME/miroir.git" 2>/dev/null || true
git -C ~/musee push -q origin main >/dev/null 2>&1 || true
rm -rf /tmp/gg_miroir_collegue
git clone -q "$HOME/miroir.git" /tmp/gg_miroir_collegue
cd /tmp/gg_miroir_collegue
printf 'surprise %d\n' "$RANDOM" > surprise.txt
git add surprise.txt && git commit -qm "Surprise du collègue"
git push -q origin main >/dev/null 2>&1
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/musee/surprise.txt ] \
  && [ "$(git -C ~/musee rev-parse main 2>/dev/null)" = "$(git -C ~/miroir.git rev-parse refs/heads/main 2>/dev/null)" ]
```

Résolution automatique (tests) :

```bash
git -C ~/musee pull -q origin main >/dev/null 2>&1
```

</details>

#### Q6 · Défi réel (sandbox)

Le collègue a poussé reliquat.txt. Récupère ce commit dans les références de musee, mais SANS l'intégrer : ta branche main ne doit pas bouger, reliquat.txt ne doit pas exister dans ta copie de travail, et le commit doit apparaître dans origin/main.

- Solution : `cd ~/musee && git fetch origin`
- Indice 1 (10 s) : git fetch met à jour origin/main sans toucher à ta branche : c'est la moitié silencieuse de git pull.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
git init -q --bare ~/miroir.git 2>/dev/null || true
git -C ~/musee remote add origin "$HOME/miroir.git" 2>/dev/null || true
git -C ~/musee push -q origin main >/dev/null 2>&1 || true
rm -rf /tmp/gg_miroir_collegue
git clone -q "$HOME/miroir.git" /tmp/gg_miroir_collegue
cd /tmp/gg_miroir_collegue
printf 'reliquat %d\n' "$RANDOM" > reliquat.txt
git add reliquat.txt && git commit -qm "Reliquat"
git push -q origin main >/dev/null 2>&1
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(git -C ~/musee rev-parse main 2>/dev/null)" != "$(git -C ~/musee rev-parse refs/remotes/origin/main 2>/dev/null)" ] \
  && git -C ~/musee cat-file -e "refs/remotes/origin/main:reliquat.txt" 2>/dev/null \
  && [ ! -f ~/musee/reliquat.txt ]
```

Résolution automatique (tests) :

```bash
git -C ~/musee fetch -q origin
```

</details>

#### Q6 — variante (sabotage « mutation ») · Défi réel (sandbox)

Le collègue a poussé vestige.txt. Rapatrie-le dans les références de musee sans l'intégrer : main ne bouge pas, vestige.txt est absent de ta copie de travail, mais présent dans origin/main.

- Solution : `cd ~/musee && git fetch origin`
- Indice 1 (10 s) : Le fetch ne touche ni main ni les fichiers : seul origin/main avance.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
git init -q --bare ~/miroir.git 2>/dev/null || true
git -C ~/musee remote add origin "$HOME/miroir.git" 2>/dev/null || true
git -C ~/musee push -q origin main >/dev/null 2>&1 || true
rm -rf /tmp/gg_miroir_collegue
git clone -q "$HOME/miroir.git" /tmp/gg_miroir_collegue
cd /tmp/gg_miroir_collegue
printf 'vestige %d\n' "$RANDOM" > vestige.txt
git add vestige.txt && git commit -qm "Vestige"
git push -q origin main >/dev/null 2>&1
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(git -C ~/musee rev-parse main 2>/dev/null)" != "$(git -C ~/musee rev-parse refs/remotes/origin/main 2>/dev/null)" ] \
  && git -C ~/musee cat-file -e "refs/remotes/origin/main:vestige.txt" 2>/dev/null \
  && [ ! -f ~/musee/vestige.txt ]
```

Résolution automatique (tests) :

```bash
git -C ~/musee fetch -q origin
```

</details>

## Palier Root Wizard

### rw_proc_01 — Processus fantôme

> Quelque chose tourne sur ce serveur. Trouve-le, arrête-le, et ce qui le protège.

| | |
| --- | --- |
| Palier | Root Wizard |
| Arbre | System Overlord |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Timer, Chaos |
| Questions | 4 |
| XP | 380 |
| Timer | random, 300 s (référence 140 s) |
| Débloque | rw_script_01, rw_shellcraft_01 |

Processus : ps, pgrep, kill, top.

<details><summary>Préparation du niveau</summary>

```bash
mkdir -p ~/.bin
cp /bin/sleep ~/.bin/virus
cp /bin/bash ~/.bin/gardien
cp /usr/bin/yes ~/.bin/miner
```

</details>

#### Q1 · Défi réel (sandbox)

Un processus nommé virus tourne. Trouve son PID et envoie-le avec submit.

- Solution : `pgrep virus (ou ps aux | grep virus), puis submit <PID>`
- Indice 1 (10 s) : pgrep NOM affiche le PID des processus qui portent ce nom.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
pgrep -x virus >/dev/null || { setsid nohup ~/.bin/virus 100000 >/dev/null 2>&1 & sleep 0.2; }
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(pgrep -x virus | head -n 1)"
```

Résolution automatique (tests) :

```bash
submit "$(pgrep -x virus | head -n 1)"
```

</details>

#### Q1 — variante (sabotage « mutation ») · Défi réel (sandbox)

Un processus nommé daemon tourne. Trouve son PID et envoie-le avec submit.

- Solution : `pgrep daemon (ou ps aux | grep daemon), puis submit <PID>`

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
mkdir -p ~/.bin
cp /bin/sleep ~/.bin/daemon
pgrep -x daemon >/dev/null || { setsid nohup ~/.bin/daemon 100000 >/dev/null 2>&1 & sleep 0.2; }
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(pgrep -x daemon | head -n 1)"
```

Résolution automatique (tests) :

```bash
submit "$(pgrep -x daemon | head -n 1)"
```

</details>

#### Q2 · Défi réel (sandbox)

Arrête ce processus.

- Solution : `kill <PID> (ou pkill virus)`
- Indice 1 (10 s) : kill PID envoie un signal d'arrêt au processus.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
pgrep -x virus >/dev/null || { setsid nohup ~/.bin/virus 100000 >/dev/null 2>&1 & sleep 0.2; }
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
! pgrep -x virus >/dev/null
```

Résolution automatique (tests) :

```bash
pkill -x virus
```

</details>

#### Q2 — variante (sabotage « mutation ») · Défi réel (sandbox)

Arrête ce processus.

- Solution : `kill <PID> (ou pkill daemon)`

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
mkdir -p ~/.bin
[ -x ~/.bin/daemon ] || cp /bin/sleep ~/.bin/daemon
pgrep -x daemon >/dev/null || { setsid nohup ~/.bin/daemon 100000 >/dev/null 2>&1 & sleep 0.2; }
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
! pgrep -x daemon >/dev/null
```

Résolution automatique (tests) :

```bash
pkill -x daemon
```

</details>

#### Q3 · Défi réel (sandbox)

Le virus revient : un processus gardien le relance chaque seconde. Arrête-les pour de bon.

- Solution : `pkill gardien, puis pkill virus`
- Indice 1 (10 s) : Arrête d'abord celui qui relance l'autre.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
setsid nohup ~/.bin/gardien -c 'while true; do pgrep -x virus >/dev/null || setsid ~/.bin/virus 100000 >/dev/null 2>&1 & sleep 1; done' >/dev/null 2>&1 &
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
! pgrep -x gardien >/dev/null && ! pgrep -x virus >/dev/null || exit 1
sleep 1.2
! pgrep -x virus >/dev/null
```

Résolution automatique (tests) :

```bash
pkill -x gardien; sleep 0.3; pkill -x virus
```

</details>

#### Q3 — variante (sabotage « mutation ») · Défi réel (sandbox)

Le daemon revient : un processus superviseur le relance chaque seconde. Arrête-les pour de bon.

- Solution : `pkill gardien, puis pkill daemon`

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
[ -x ~/.bin/daemon ] || cp /bin/sleep ~/.bin/daemon
setsid nohup ~/.bin/gardien -c 'while true; do pgrep -x daemon >/dev/null || setsid ~/.bin/daemon 100000 >/dev/null 2>&1 & sleep 1; done' >/dev/null 2>&1 &
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
! pgrep -x gardien >/dev/null && ! pgrep -x daemon >/dev/null
```

Résolution automatique (tests) :

```bash
pkill -x gardien; sleep 0.3; pkill -x daemon
```

</details>

#### Q4 · Défi réel (sandbox)

Un processus monopolise le processeur. Trouve-le (top ou ps) et arrête-le.

- Solution : `ps aux --sort=-%cpu | head, puis pkill miner`
- Indice 1 (10 s) : ps aux --sort=-%cpu classe les processus du plus gourmand au moins gourmand.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
setsid nohup ~/.bin/miner >/dev/null 2>&1 &
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
! pgrep -x miner >/dev/null
```

Résolution automatique (tests) :

```bash
pkill -x miner
```

</details>

#### Q4 — variante (sabotage « mutation ») · Défi réel (sandbox)

Un processus nommé worker monopolise le processeur. Trouve-le et arrête-le.

- Solution : `ps aux --sort=-%cpu | head, puis pkill worker`

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cp /usr/bin/yes ~/.bin/worker
setsid nohup ~/.bin/worker >/dev/null 2>&1 &
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
! pgrep -x worker >/dev/null
```

Résolution automatique (tests) :

```bash
pkill -x worker
```

</details>

### rw_script_01 — Automatise tout

> Ce qu'on fait deux fois, on l'écrit une fois. Boucles, find, scripts.

| | |
| --- | --- |
| Palier | Root Wizard |
| Arbre | System Overlord |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Timer, Chaos |
| Questions | 4 |
| XP | 400 |
| Timer | random, 420 s (référence 220 s) |
| Débloque | rw_script_02 |

Boucles bash, find, scripts exécutables et calculs.

#### Q1 · Défi réel (sandbox)

Renomme tous les fichiers .txt du dossier rapports en .bak, avec une boucle for.

- Solution : `for f in rapports/*.txt; do mv "$f" "${f%.txt}.bak"; done`
- Indice 1 (10 s) : for f in rapports/*.txt; do ...; done traite les fichiers un par un, chacun dans $f.
- Indice 2 (10 s) : ${f%.txt} retire l'extension .txt du nom contenu dans $f.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
mkdir -p ~/rapports
for n in janvier fevrier mars avril; do echo "$n" > ~/rapports/$n.txt; done
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -z "$(ls ~/rapports/*.txt 2>/dev/null)" ] && [ "$(ls ~/rapports/*.bak 2>/dev/null | wc -l)" = 4 ]
```

Résolution automatique (tests) :

```bash
cd ~ && for f in rapports/*.txt; do mv "$f" "${f%.txt}.bak"; done
```

</details>

#### Q1 — variante (sabotage « mutation ») · Défi réel (sandbox)

Renomme tous les fichiers .log du dossier archives en .old, avec une boucle for.

- Solution : `for f in archives/*.log; do mv "$f" "${f%.log}.old"; done`

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
mkdir -p ~/archives
for n in janvier fevrier mars avril; do echo "$n" > ~/archives/$n.log; done
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -z "$(ls ~/archives/*.log 2>/dev/null)" ] && [ "$(ls ~/archives/*.old 2>/dev/null | wc -l)" = 4 ]
```

Résolution automatique (tests) :

```bash
cd ~ && for f in archives/*.log; do mv "$f" "${f%.log}.old"; done
```

</details>

#### Q2 · Défi réel (sandbox)

Supprime tous les fichiers .tmp sous le dossier chantier, à toutes les profondeurs, sans toucher aux autres.

- Solution : `find chantier -name '*.tmp' -delete`
- Indice 1 (10 s) : find sait supprimer ce qu'il trouve.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
mkdir -p ~/chantier/x ~/chantier/y/z
touch ~/chantier/1.tmp ~/chantier/x/2.tmp ~/chantier/y/z/3.tmp ~/chantier/garde.txt ~/chantier/y/garde2.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -z "$(find ~/chantier -name "*.tmp")" ] && [ -f ~/chantier/garde.txt ] && [ -f ~/chantier/y/garde2.txt ]
```

Résolution automatique (tests) :

```bash
find ~/chantier -name '*.tmp' -delete
```

</details>

#### Q2 — variante (sabotage « mutation ») · Défi réel (sandbox)

Supprime tous les fichiers .bak sous le dossier backup, à toutes les profondeurs, sans toucher aux autres.

- Solution : `find backup -name '*.bak' -delete`

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
mkdir -p ~/backup/x ~/backup/y/z
touch ~/backup/1.bak ~/backup/x/2.bak ~/backup/y/z/3.bak ~/backup/garde.txt ~/backup/y/garde2.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -z "$(find ~/backup -name "*.bak")" ] && [ -f ~/backup/garde.txt ] && [ -f ~/backup/y/garde2.txt ]
```

Résolution automatique (tests) :

```bash
find ~/backup -name '*.bak' -delete
```

</details>

#### Q3 · Défi réel (sandbox)

Écris un script compte.sh qui affiche le nombre de lignes du fichier passé en argument, et rends-le exécutable.

- Solution : `printf '#!/bin/bash\nwc -l < "$1"\n' > compte.sh && chmod +x compte.sh`
- Indice 1 (10 s) : $1 contient le premier argument du script ; wc -l < fichier affiche juste le nombre.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~ && [ -x compte.sh ] || exit 1
n=$((RANDOM % 7 + 2)); seq 1 "$n" > /tmp/lignes
out=$(timeout 3 ./compte.sh /tmp/lignes) && [ "${out%% *}" = "$n" ]
```

Résolution automatique (tests) :

```bash
printf '#!/bin/bash\nwc -l < "$1"\n' > ~/compte.sh && chmod +x ~/compte.sh
```

</details>

#### Q4 · Défi réel (sandbox)

Écris dans total.txt la somme des nombres de nombres.txt (un par ligne).

- Solution : `awk '{s += $1} END {print s}' nombres.txt > total.txt`
- Indice 1 (10 s) : awk peut accumuler une somme et l'afficher dans un bloc END.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
seq 1 50 | shuf > ~/nombres.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(tr -d " \n" < ~/total.txt 2>/dev/null)" = "$(awk "{s += \$1} END {print s}" ~/nombres.txt)" ]
```

Résolution automatique (tests) :

```bash
awk '{s += $1} END {print s}' ~/nombres.txt > ~/total.txt
```

</details>

#### Q4 — variante (sabotage « mutation ») · Défi réel (sandbox)

Écris dans maximum.txt le plus grand nombre de nombres.txt (un par ligne, dans le désordre).

- Solution : `sort -n nombres.txt | tail -n 1 > maximum.txt (ou awk)`
- Indice 1 (10 s) : Trie numériquement, puis garde la dernière ligne.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
seq 1 $((RANDOM % 50 + 50)) | shuf > ~/nombres.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(tr -d " \n" < ~/maximum.txt 2>/dev/null)" = "$(sort -n ~/nombres.txt | tail -n 1)" ]
```

Résolution automatique (tests) :

```bash
sort -n ~/nombres.txt | tail -n 1 > ~/maximum.txt
```

</details>

### gg_history_01 — Machine à remonter le temps

> Un commit de trop, deux commits perdus, un correctif égaré. L'historique se répare.

| | |
| --- | --- |
| Palier | Root Wizard |
| Arbre | Git-Gud |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Timer, Chaos |
| Questions | 4 |
| XP | 420 |
| Timer | random, 480 s (référence 240 s) |
| Débloque | gg_bisect_01, gg_workflow_01 |

Parcours Git-Gud : revert, reflog, cherry-pick, et l'enquête dans l'historique.

<details><summary>Préparation du niveau</summary>

```bash
git config --global user.name agent
git config --global user.email agent@sandbox
git config --global init.defaultBranch main
mkdir -p ~/journal && cd ~/journal && git init -q
for i in 1 2 3 4 5 6; do
  echo "jour $i" >> journal.txt && git add journal.txt
  if [ "$i" = 3 ]; then git commit -qm "jour $i" --author="Léna <lena@sandbox>"; else git commit -qm "jour $i"; fi
done
```

</details>

#### Q1 · Défi réel (sandbox)

Dans journal, le dernier commit (« jour 6 ») est une erreur. Annule-le avec un nouveau commit, sans réécrire l'historique.

- Solution : `git revert HEAD`
- Indice 1 (10 s) : git revert crée un commit qui défait un autre commit.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/journal && ! grep -q "jour 6" journal.txt && git log -1 --format=%s | grep -q "^Revert" && git log --format=%s | grep -qx "jour 6"
```

Résolution automatique (tests) :

```bash
cd ~/journal && git revert --no-edit HEAD >/dev/null
```

</details>

#### Q2 · Défi réel (sandbox)

Quelqu'un a fait git reset --hard et deux commits ont disparu. Retrouve « jour 8 » avec le reflog et ramène main dessus.

- Solution : `git reflog, repère le commit « jour 8 », puis git reset --hard <id>`
- Indice 1 (10 s) : git reflog liste tout ce que HEAD a pointé, même les commits « perdus ».

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/journal
echo "jour 7" >> journal.txt && git commit -qam "jour 7"
echo "jour 8" >> journal.txt && git commit -qam "jour 8"
git reset -q --hard HEAD~2
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
orig=$(git -C ~/journal reflog --format='%H %s' | awk '/ jour 8$/ {h = $1} END {print h}')
[ -n "$orig" ] && [ "$(git -C ~/journal rev-parse main)" = "$orig" ] \
  && [ "$(git -C ~/journal branch --show-current)" = main ]
```

Résolution automatique (tests) :

```bash
cd ~/journal && git reset -q --hard "$(git reflog --format='%H %s' | grep ' jour 8$' | head -n 1 | cut -d' ' -f1)"
```

</details>

#### Q3 · Défi réel (sandbox)

La branche correctif contient un brouillon (« wip: essai ») et un vrai correctif (« fix: virgule »). Applique uniquement le correctif sur main.

- Solution : `git log correctif, puis git cherry-pick <id du fix>`
- Indice 1 (10 s) : git cherry-pick recopie un seul commit sur la branche courante.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/journal && git switch -qc correctif
echo "essai" > brouillon.txt && git add brouillon.txt && git commit -qm "wip: essai"
echo "virgule corrigée" > correctif.txt && git add correctif.txt && git commit -qm "fix: virgule"
git switch -q main
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/journal && [ "$(git branch --show-current)" = main ] && git log --format=%s | grep -qx "fix: virgule" && ! git log --format=%s | grep -qx "wip: essai"
```

Résolution automatique (tests) :

```bash
cd ~/journal && git cherry-pick "$(git log correctif --format=%H --grep='fix: virgule' -n 1)" >/dev/null
```

</details>

#### Q4 · Défi réel (sandbox)

Qui a écrit la ligne « jour 3 » de journal.txt ? Envoie son prénom avec submit.

- Solution : `git blame journal.txt (ou git log -S "jour 3")`
- Indice 1 (10 s) : git blame affiche l'auteur de chaque ligne.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is Léna
```

Résolution automatique (tests) :

```bash
submit "$(git -C ~/journal log -S 'jour 3' --format=%an | tail -n 1)"
```

</details>

### gg_bisect_01 — Le commit coupable

> Quarante commits, un seul a cassé le calcul. git bisect va le coincer.

| | |
| --- | --- |
| Palier | Root Wizard |
| Arbre | Git-Gud |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Timer, Chaos |
| Questions | 3 |
| XP | 500 |
| Timer | random, 540 s (référence 270 s) |

Boss du parcours Git-Gud. ./test.sh réussit si le calcul est juste, et échoue sinon.

<details><summary>Préparation du niveau</summary>

```bash
git config --global user.name agent
git config --global user.email agent@sandbox
git config --global init.defaultBranch main
mkdir -p ~/calcul && cd ~/calcul && git init -q
printf '#!/bin/bash\n[ "$(./calc.sh)" = 42 ]\n' > test.sh
echo 'echo 42' > calc.sh
chmod +x test.sh calc.sh
git add . && git commit -qm "Départ"
bad=$(( RANDOM % 25 + 10 ))
mkdir -p notes
for i in $(seq 1 40); do
  echo "étape $i" > "notes/etape-$i.txt"
  [ "$i" = "$bad" ] && echo 'echo 41' > calc.sh
  git add -A && git commit -qm "refactor: étape $i"
done
```

</details>

#### Q1 · Défi réel (sandbox)

Dans calcul, ./test.sh échoue sur la dernière version, mais passait au premier commit. Trouve le commit fautif avec git bisect et envoie son identifiant (au moins 7 caractères) avec submit.

- Solution : `git bisect start, git bisect bad, git bisect good <premier commit>, puis git bisect run ./test.sh`
- Indice 1 (10 s) : git bisect start, git bisect bad (version actuelle), git bisect good <id du premier commit>.
- Indice 2 (10 s) : git bisect run ./test.sh fait toute la recherche tout seul.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/calcul
bad=$(git log main --reverse --format=%H | while read -r h; do git show "$h:calc.sh" | grep -q 41 && { echo "$h"; break; }; done)
answer-prefix-of "$bad" 7
```

Résolution automatique (tests) :

```bash
cd ~/calcul && git bisect start HEAD "$(git rev-list --max-parents=0 HEAD)" >/dev/null 2>&1 && git bisect run ./test.sh >/dev/null 2>&1
submit "$(git rev-parse refs/bisect/bad | cut -c1-7)"
```

</details>

#### Q2 · Défi réel (sandbox)

Termine proprement la recherche pour revenir sur main.

- Solution : `git bisect reset`
- Indice 1 (10 s) : git bisect reset ramène là où tu étais avant la recherche.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/calcul && [ -f .git/BISECT_LOG ] || git bisect start HEAD "$(git rev-list --max-parents=0 HEAD)" >/dev/null 2>&1
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ ! -f ~/calcul/.git/BISECT_LOG ] && [ "$(git -C ~/calcul branch --show-current)" = main ]
```

Résolution automatique (tests) :

```bash
cd ~/calcul && git bisect reset >/dev/null 2>&1
```

</details>

#### Q3 · Défi réel (sandbox)

Corrige le calcul en annulant le commit fautif avec git revert, puis vérifie que ./test.sh passe.

- Solution : `git revert <id du commit fautif>`
- Indice 1 (10 s) : git revert annule un commit précis, même ancien.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/calcul && ./test.sh && git log -1 --format=%s | grep -q "^Revert"
```

Résolution automatique (tests) :

```bash
cd ~/calcul && bad=$(git log --reverse --format=%H | while read -r h; do git show "$h:calc.sh" | grep -q 41 && { echo "$h"; break; }; done) && git revert --no-edit "$bad" >/dev/null
```

</details>

### ps_pipeline_01 — Le pipeline des objets

> Chercher, regrouper, renommer, additionner : quatre cmdlets, un seul pipeline.

| | |
| --- | --- |
| Palier | Root Wizard |
| Arbre | PowerShell |
| Exécution | Sandbox Docker (PowerShell) |
| Type natif | Classique |
| Rejouable | Timer, Chaos |
| Questions | 4 |
| XP | 420 |
| Timer | random, 480 s (référence 240 s) |
| Débloque | ps_scripts_01 |

Select-String, Group-Object, ForEach-Object, Measure-Object.

<details><summary>Préparation du niveau</summary>

```bash
mkdir -p ~/rapports
for i in $(seq 1 30); do
  if [ $((i % 4)) = 0 ]; then lvl=ERROR; else lvl=INFO; fi
  echo "2026-10-02 10:$(printf %02d "$i") $lvl service$((i % 3))" >> ~/app.log
done
for m in janvier fevrier mars; do echo "$m" > ~/rapports/$m.txt; done
seq 1 $((RANDOM % 20 + 15)) | shuf > ~/valeurs.txt
```

</details>

#### Q1 · Défi réel (sandbox)

Combien de lignes de app.log contiennent ERROR ? Utilise Select-String, puis envoie le nombre avec submit.

- Solution : `(Select-String -Path app.log -Pattern ERROR).Count`
- Indice 1 (10 s) : Select-String est le grep de PowerShell : il renvoie un objet par ligne trouvée.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(grep -c ERROR ~/app.log)"
```

Résolution automatique (tests) :

```bash
submit "$(pwsh -NoProfile -NonInteractive -Command '(Select-String -Path ~/app.log -Pattern ERROR).Count')"
```

</details>

#### Q2 · Défi réel (sandbox)

Avec Group-Object, trouve le service (4e colonne) qui a le plus de lignes ERROR, et envoie son nom avec submit.

- Solution : `Select-String ERROR app.log | ForEach-Object { ($_.Line -split ' ')[3] } | Group-Object | Sort-Object Count -Descending`
- Indice 1 (10 s) : Étape 1 : Select-String ERROR app.log | ForEach-Object { ($_.Line -split ' ')[3] } sort la colonne des services.
- Indice 2 (20 s) : Étape 2 : ajoute | Group-Object | Sort-Object Count -Descending, le premier groupe est le bon.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(grep ERROR ~/app.log | awk "{print \$4}" | sort | uniq -c | sort -rn | head -n 1 | awk "{print \$2}")"
```

Résolution automatique (tests) :

```bash
submit "$(pwsh -NoProfile -NonInteractive -Command 'Select-String -Path ~/app.log -Pattern ERROR | ForEach-Object { ($_.Line -split " ")[3] } | Group-Object | Sort-Object Count -Descending | Select-Object -First 1 -ExpandProperty Name')"
```

</details>

#### Q3 · Défi réel (sandbox)

Renomme tous les fichiers .txt de rapports en .old, en un seul pipeline.

- Solution : `Get-ChildItem rapports -Filter *.txt | Rename-Item -NewName { $_.Name -replace '\.txt$', '.old' }`
- Indice 1 (10 s) : Rename-Item accepte un bloc { } qui calcule le nouveau nom de chaque fichier ($_).

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -z "$(ls ~/rapports/*.txt 2>/dev/null)" ] && [ "$(ls ~/rapports/*.old 2>/dev/null | wc -l)" = 3 ]
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command 'Get-ChildItem ~/rapports -Filter *.txt | Rename-Item -NewName { $_.Name -replace "\.txt$", ".old" }'
```

</details>

#### Q3 — variante (sabotage « mutation ») · Défi réel (sandbox)

Renomme tous les fichiers .csv de rapports en .bak, en un seul pipeline.

- Solution : `Get-ChildItem rapports -Filter *.csv | Rename-Item -NewName { $_.Name -replace '[.]csv$', '.bak' }`

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
mkdir -p ~/rapports
for m in janvier fevrier mars; do echo "$m" > ~/rapports/$m.csv; done
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -z "$(ls ~/rapports/*.csv 2>/dev/null)" ] && [ "$(ls ~/rapports/*.bak 2>/dev/null | wc -l)" = 3 ]
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command 'Get-ChildItem ~/rapports -Filter *.csv | Rename-Item -NewName { $_.Name -replace "\.csv$", ".bak" }'
```

</details>

#### Q4 · Défi réel (sandbox)

Écris dans somme.txt la somme des nombres de valeurs.txt (Measure-Object).

- Solution : `(Get-Content valeurs.txt | Measure-Object -Sum).Sum | Set-Content somme.txt`
- Indice 1 (10 s) : Measure-Object -Sum additionne ; .Sum lit le résultat.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/somme.txt ] || exit 1
[ "$(tr -d ' \r\n' < ~/somme.txt)" = "$(awk '{s += $1} END {print s}' ~/valeurs.txt)" ]
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command '(Get-Content ~/valeurs.txt | Measure-Object -Sum).Sum | Set-Content ~/somme.txt'
```

</details>

### rw_shellcraft_01 — Scripts résistants

> Un bon script ne fait pas que marcher : il sait quoi faire quand ça tourne mal.

| | |
| --- | --- |
| Palier | Root Wizard |
| Arbre | System Overlord |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 5 |
| XP | 460 |
| Sabotages signature | hostile_path, time_accel |

xargs, trap, signaux, sauvegarde incrémentale et sed ciblé.

#### Q1 · Défi réel (sandbox)

Pour chaque nom listé dans cibles.txt, crée un fichier vide portant ce nom suivi de .ok, avec xargs.

- Solution : `xargs -I{} touch {}.ok < cibles.txt`
- Indice 1 (10 s) : xargs transforme les lignes reçues en arguments d'une autre commande.
- Indice 2 (20 s) : xargs -I{} remplace {} par chaque ligne : touch {}.ok

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
rm -f ~/*.ok
for n in alpha beta gamma delta epsilon; do [ $((RANDOM % 3)) -gt 0 ] && echo "$n"; done > ~/cibles.txt
[ -s ~/cibles.txt ] || echo omega > ~/cibles.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~ && [ "$(ls *.ok 2>/dev/null | sort)" = "$(sed 's/$/.ok/' cibles.txt | sort)" ]
```

Résolution automatique (tests) :

```bash
cd ~ && xargs -I{} touch {}.ok < cibles.txt
```

</details>

#### Q2 · Défi réel (sandbox)

Écris fin.sh : il crée travail.tmp pendant qu'il tourne, et grâce à trap, il le supprime et écrit nettoyage-ok dans nettoyage.txt quand il se termine. Rends-le exécutable puis lance-le.

- Solution : `trap 'rm -f ~/travail.tmp; echo nettoyage-ok > ~/nettoyage.txt' EXIT, puis touch ~/travail.tmp`
- Indice 1 (10 s) : trap 'COMMANDES' EXIT exécute les commandes quand le script se termine, quelle qu'en soit la raison.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
rm -f ~/fin.sh ~/travail.tmp ~/nettoyage.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -x ~/fin.sh ] && grep -q trap ~/fin.sh && [ "$(cat ~/nettoyage.txt 2>/dev/null)" = nettoyage-ok ] && [ ! -e ~/travail.tmp ]
```

Résolution automatique (tests) :

```bash
cat > ~/fin.sh <<'EOF'
#!/bin/bash
trap 'rm -f "$HOME/travail.tmp"; echo nettoyage-ok > "$HOME/nettoyage.txt"' EXIT
touch "$HOME/travail.tmp"
EOF
chmod +x ~/fin.sh && ~/fin.sh
```

</details>

#### Q3 · Défi réel (sandbox)

Le programme watcher tourne en fond et recharge sa configuration quand il reçoit le signal HUP. Envoie-lui ce signal.

- Solution : `pkill -HUP watcher (ou kill -HUP <PID>, PID trouvé avec pgrep watcher)`
- Indice 1 (10 s) : kill ne sert pas qu'à arrêter : -HUP envoie un signal précis. Le programme doit continuer de tourner.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
rm -f ~/reload.txt
cat > ~/watcher <<'EOF'
#!/bin/bash
trap 'echo recharge > "$HOME/reload.txt"' HUP
while true; do sleep 0.2; done
EOF
chmod +x ~/watcher
# Sans nohup : il ferait ignorer SIGHUP, que bash ne pourrait plus piéger.
pgrep -x watcher >/dev/null || { setsid ~/watcher </dev/null >/dev/null 2>&1 & sleep 0.2; }
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
grep -qx recharge ~/reload.txt 2>/dev/null && pgrep -x watcher >/dev/null
```

Résolution automatique (tests) :

```bash
pkill -HUP -x watcher; sleep 0.4
```

</details>

#### Q4 · Défi réel (sandbox)

Une sauvegarde complète base.tar.gz existe, avec son instantané backup.snar. Crée update.tar.gz, la sauvegarde incrémentale du dossier backup : seulement ce qui a changé depuis.

- Solution : `tar -czf update.tar.gz --listed-incremental=backup.snar backup`
- Indice 1 (10 s) : --listed-incremental=FICHIER lit l'état précédent dans le .snar et ne garde que les changements.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~ && rm -rf backup base.tar.gz update.tar.gz backup.snar
mkdir -p backup && echo A > backup/a.txt && echo B > backup/b.txt
tar -czf base.tar.gz --listed-incremental=backup.snar backup
sleep 1
echo "A modifié" > backup/a.txt && echo C > backup/c.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~ && l=$(tar -tzf update.tar.gz 2>/dev/null) && echo "$l" | grep -qx backup/a.txt && echo "$l" | grep -qx backup/c.txt && ! echo "$l" | grep -qx backup/b.txt
```

Résolution automatique (tests) :

```bash
cd ~ && tar -czf update.tar.gz --listed-incremental=backup.snar backup
```

</details>

#### Q5 · Défi réel (sandbox)

Dans settings.conf, remplace uniquement la valeur de https_port par 8443, sans toucher aux autres lignes.

- Solution : `sed -i 's/^https_port=.*/https_port=8443/' settings.conf`
- Indice 1 (10 s) : Ancre le motif : ^https_port= ne vise que la ligne qui commence exactement ainsi.
- Indice 2 (20 s) : Attention à https_port_backup : il commence aussi par https_port.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
printf 'http_port=80\nhttps_port=443\nproxy_port=8443\nhttps_port_backup=443\n' > ~/settings.conf
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(cat ~/settings.conf)" = "$(printf "http_port=80\nhttps_port=8443\nproxy_port=8443\nhttps_port_backup=443")" ]
```

Résolution automatique (tests) :

```bash
sed -i 's/^https_port=.*/https_port=8443/' ~/settings.conf
```

</details>

### rw_awk_01 — awk sans filet

> Des fichiers de ventes, un rapport à produire. awk fait le reste.

| | |
| --- | --- |
| Palier | Root Wizard |
| Arbre | Data Surgeon |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 5 |
| XP | 420 |
| Sabotages signature | hostile_alias, time_accel |
| Débloque | rw_text_01 |

awk comme un tableur : séparateur, filtres, sommes, tableaux associatifs. Les quantités changent à chaque partie.

<details><summary>Préparation du niveau</summary>

```bash
mkdir -p ~/atelier/copies
for r in nord sud est; do
  for p in pommes poires prunes pommes poires; do
    echo "$r;$p;$((RANDOM % 20 + 1))"
  done > ~/atelier/ventes_$r.csv
done
# Une grosse commande donne une région gagnante sans égalité possible.
gagnante=$(printf 'nord\nsud\nest\n' | shuf -n 1)
echo "$gagnante;prunes;100" >> ~/atelier/ventes_$gagnante.csv
printf 'ventes_nord.csv\nventes_sud.csv\nventes_est.csv\n' > ~/atelier/noms.txt
```

</details>

#### Q1 · Défi réel (sandbox)

Écris dans ~/atelier/total_pommes.txt le total des quantités de pommes, tous fichiers de ventes confondus. Le fichier ne contient que le nombre.

- Solution : `awk -F';' '$2 == "pommes" {s += $3} END {print s}' ventes_*.csv > total_pommes.txt`
- Indice 1 (10 s) : Le séparateur est le point-virgule : -F';'.
- Indice 2 (20 s) : Filtre $2 == "pommes", accumule s += $3, affiche s dans un bloc END.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
attendu=$(awk -F';' '$2 == "pommes" {s += $3} END {print s + 0}' ~/atelier/ventes_*.csv)
[ "$(tr -d ' \n' < ~/atelier/total_pommes.txt 2>/dev/null)" = "$attendu" ]
```

Résolution automatique (tests) :

```bash
cd ~/atelier && awk -F';' '$2 == "pommes" {s += $3} END {print s}' ventes_*.csv > total_pommes.txt
```

</details>

#### Q1 — variante (sabotage « mutation ») · Défi réel (sandbox)

Écris dans ~/atelier/total_sud.txt le total des quantités vendues par la région sud, tous produits confondus. Le fichier ne contient que le nombre.

- Solution : `awk -F';' '$1 == "sud" {s += $3} END {print s}' ventes_*.csv > total_sud.txt`
- Indice 1 (10 s) : Même principe, en filtrant sur la 1re colonne.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
attendu=$(awk -F';' '$1 == "sud" {s += $3} END {print s + 0}' ~/atelier/ventes_*.csv)
[ "$(tr -d ' \n' < ~/atelier/total_sud.txt 2>/dev/null)" = "$attendu" ]
```

Résolution automatique (tests) :

```bash
cd ~/atelier && awk -F';' '$1 == "sud" {s += $3} END {print s}' ventes_*.csv > total_sud.txt
```

</details>

#### Q2 · Défi réel (sandbox)

Écris dans ~/atelier/par_produit.txt une ligne par produit au format produit:total, triée par nom de produit.

- Solution : `awk -F';' '{s[$2] += $3} END {for (p in s) print p ":" s[p]}' ventes_*.csv | sort > par_produit.txt`
- Indice 1 (10 s) : Un tableau associatif : s[$2] += $3 additionne par produit.
- Indice 2 (20 s) : for (p in s) parcourt le tableau dans le désordre : trie ensuite avec sort.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
attendu=$(awk -F';' '{s[$2] += $3} END {for (p in s) print p ":" s[p]}' ~/atelier/ventes_*.csv | sort)
[ "$(cat ~/atelier/par_produit.txt 2>/dev/null)" = "$attendu" ]
```

Résolution automatique (tests) :

```bash
cd ~/atelier && awk -F';' '{s[$2] += $3} END {for (p in s) print p ":" s[p]}' ventes_*.csv | sort > par_produit.txt
```

</details>

#### Q3 · Défi réel (sandbox)

Quelle région a vendu le plus, tous produits confondus ? Envoie son nom avec submit.

- Solution : `awk -F';' '{s[$1] += $3} END {for (r in s) print s[r], r}' ventes_*.csv | sort -rn | head -n 1`
- Indice 1 (10 s) : Additionne par région (1re colonne), puis classe avec sort -rn.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(awk -F";" "{s[\$1] += \$3} END {for (r in s) print s[r], r}" ~/atelier/ventes_*.csv | sort -rn | head -n 1 | cut -d" " -f2)"
```

Résolution automatique (tests) :

```bash
submit "$(awk -F';' '{s[$1] += $3} END {for (r in s) print s[r], r}' ~/atelier/ventes_*.csv | sort -rn | head -n 1 | cut -d' ' -f2)"
```

</details>

#### Q4 · Défi réel (sandbox)

Chaque ligne de ~/atelier/noms.txt est un fichier de ~/atelier. Avec xargs, copie chacun dans ~/atelier/copies/ sous le nom <nom>.bak.

- Solution : `cd ~/atelier && xargs -I{} cp {} copies/{}.bak < noms.txt`
- Indice 1 (10 s) : xargs -I{} remplace {} par chaque ligne lue sur l'entrée standard.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/atelier && while read -r f; do cmp -s "$f" "copies/$f.bak" || exit 1; done < noms.txt
```

Résolution automatique (tests) :

```bash
cd ~/atelier && xargs -I{} cp {} copies/{}.bak < noms.txt
```

</details>

#### Q5 · Défi réel (sandbox)

Écris dans ~/atelier/gros.txt les lignes de tous les fichiers de ventes dont la quantité dépasse 15, au format region produit quantite séparés par des espaces.

- Solution : `awk -F';' '$3 > 15 {print $1, $2, $3}' ventes_*.csv > gros.txt`
- Indice 1 (10 s) : Une condition devant le bloc filtre les lignes ; print avec des virgules sépare par un espace.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
attendu=$(awk -F';' '$3 > 15 {print $1, $2, $3}' ~/atelier/ventes_*.csv)
[ "$(cat ~/atelier/gros.txt 2>/dev/null)" = "$attendu" ]
```

Résolution automatique (tests) :

```bash
cd ~/atelier && awk -F';' '$3 > 15 {print $1, $2, $3}' ventes_*.csv > gros.txt
```

</details>

### gg_workflow_01 — Historique propre

> Un dépôt qui grandit vite. Range l'historique, déplace un correctif, automatise le reste.

| | |
| --- | --- |
| Palier | Root Wizard |
| Arbre | Git-Gud |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 4 |
| XP | 480 |
| Sabotages signature | false_red, mutation |
| Débloque | gg_defaire_01 |

git stash, cherry-pick, rebase --autosquash et les hooks.

<details><summary>Préparation du niveau</summary>

```bash
git config --global user.name agent
git config --global user.email agent@sandbox
git config --global init.defaultBranch main
rm -rf ~/atelier-git && mkdir -p ~/atelier-git && cd ~/atelier-git && git init -q
printf '# Projet\n' > README.md
git add . && git commit -qm "Initialisation"
git switch -qc experimental
printf 'brouillon\n' > brouillon.txt && git add . && git commit -qm "wip: brouillon"
printf 'echo corrige\n' > correctif.sh && git add . && git commit -qm "fix: le correctif important"
printf 'essai\n' > essai.txt && git add . && git commit -qm "wip: essai"
git switch -q main
```

</details>

#### Q1 · Défi réel (sandbox)

Dans atelier-git, tu as modifié README.md mais tu dois changer de tâche sans commiter. Mets cette modification de côté : le dossier doit redevenir propre.

- Solution : `git stash`
- Indice 1 (10 s) : git stash range les modifications non commitées dans une pile ; git stash pop les ressort.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/atelier-git && git switch -q main 2>/dev/null; printf 'travail en cours\n' >> README.md
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/atelier-git && [ -z "$(git status --porcelain)" ] && [ "$(git stash list | wc -l)" -ge 1 ] && git stash show -p stash@{0} 2>/dev/null | grep -q "travail en cours"
```

Résolution automatique (tests) :

```bash
cd ~/atelier-git && git stash -q
```

</details>

#### Q2 · Défi réel (sandbox)

Sur la branche experimental, un seul commit compte : « fix: le correctif important ». Applique-le sur main, sans les deux commits wip.

- Solution : `git log experimental --oneline pour trouver l'identifiant, puis git cherry-pick <id>`
- Indice 1 (10 s) : git cherry-pick ID recopie un seul commit sur la branche courante.
- Indice 2 (10 s) : git log experimental --oneline affiche les identifiants courts.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/atelier-git && [ "$(git branch --show-current)" = main ] && git cat-file -e main:correctif.sh 2>/dev/null \
  && ! git cat-file -e main:brouillon.txt 2>/dev/null && ! git cat-file -e main:essai.txt 2>/dev/null \
  && git log main --format=%s | grep -qx "fix: le correctif important"
```

Résolution automatique (tests) :

```bash
cd ~/atelier-git && git switch -q main && git cherry-pick "$(git log experimental --format='%h %s' | grep 'fix: le correctif' | cut -d' ' -f1)" >/dev/null
```

</details>

#### Q3 · Défi réel (sandbox)

Sur la branche cleanup, le dernier commit est un « fixup! » du précédent. Fusionne-les en un seul avec un rebase interactif et --autosquash.

- Solution : `git rebase -i --autosquash main (l'éditeur s'ouvre : enregistre et quitte tel quel)`
- Indice 1 (10 s) : --autosquash place et marque tout seul les commits dont le message commence par fixup!.
- Indice 2 (10 s) : L'éditeur ouvert par rebase -i est déjà prêt : il suffit d'enregistrer et quitter (:wq dans vi).

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/atelier-git && git switch -q main && git branch -D cleanup >/dev/null 2>&1
git switch -qc cleanup
printf 'journal v1\n' > journal.txt && git add journal.txt && git commit -qm "feat: ajoute le journal"
printf 'journal v2\n' >> journal.txt && git commit -qam "fixup! feat: ajoute le journal"
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/atelier-git && [ "$(git rev-list --count main..cleanup)" = 1 ] && ! git log cleanup --format=%s | grep -q '^fixup!' \
  && [ "$(git show cleanup:journal.txt | wc -l)" = 2 ]
```

Résolution automatique (tests) :

```bash
cd ~/atelier-git && GIT_SEQUENCE_EDITOR=true git rebase -q -i --autosquash main
```

</details>

#### Q4 · Défi réel (sandbox)

Installe un hook post-commit qui écrit le message du dernier commit dans ~/dernier-commit.txt. Puis, sur main, commite README.md avec le message « Hook actif ».

- Solution : `printf '#!/bin/sh\ngit log -1 --format=%%s > ~/dernier-commit.txt\n' > .git/hooks/post-commit && chmod +x .git/hooks/post-commit && git commit -am "Hook actif"`
- Indice 1 (10 s) : Un hook est un script exécutable dans .git/hooks/, nommé d'après l'événement : post-commit.
- Indice 2 (10 s) : git log -1 --format=%s affiche le message du dernier commit.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/atelier-git && git switch -q main 2>/dev/null; rm -f .git/hooks/post-commit ~/dernier-commit.txt
printf 'ligne suivante\n' >> README.md
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/atelier-git && [ -x .git/hooks/post-commit ] && [ "$(git log -1 --format=%s main)" = "Hook actif" ] \
  && [ "$(cat ~/dernier-commit.txt 2>/dev/null)" = "Hook actif" ]
```

Résolution automatique (tests) :

```bash
cd ~/atelier-git
printf '#!/bin/sh\ngit log -1 --format=%%s > "$HOME/dernier-commit.txt"\n' > .git/hooks/post-commit
chmod +x .git/hooks/post-commit
git commit -qam "Hook actif"
```

</details>

### ps_scripts_01 — Scripts sous tension

> Arguments, erreurs, processus : du vrai PowerShell, pas une ligne jetable.

| | |
| --- | --- |
| Palier | Root Wizard |
| Arbre | PowerShell |
| Exécution | Sandbox Docker (PowerShell) |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 5 |
| XP | 460 |
| Sabotages signature | mutation, hostile_alias |

Construire du JSON objet par objet, réécrire du texte avec des expressions régulières, écrire un script qui prend des arguments, encadrer ce qui peut échouer avec try/catch, et gérer les processus avec des cmdlets.

<details><summary>Préparation du niveau</summary>

```bash
mkdir -p ~/logs ~/donnees
for n in api web worker; do
  head -c $((RANDOM % 50000 + 1000)) /dev/zero > ~/logs/$n.log
done
printf 'notes diverses\n' > ~/logs/notes.txt
for i in 1 2 3; do
  printf 'jeu de donnees %d\n' "$i" > ~/donnees/jeu$i.dat
done
: > ~/acces.log
for i in $(seq 1 $((RANDOM % 5 + 8))); do
  printf '2026-10-03 09:%02d connexion utilisateur%d depuis 10.%d.%d.%d\n' \
    "$((i % 60))" "$i" "$((RANDOM % 256))" "$((RANDOM % 256))" "$((RANDOM % 256))" >> ~/acces.log
done
```

</details>

#### Q1 · Défi réel (sandbox)

Écris dans taille.json un tableau JSON avec, pour chaque fichier .log de logs, un objet { "nom": <nom du fichier>, "taille": <taille en octets> }. Construis les objets avec [PSCustomObject] et sérialise avec ConvertTo-Json.

- Solution : `Get-ChildItem logs -Filter *.log | ForEach-Object { [PSCustomObject]@{ nom = $_.Name; taille = $_.Length } } | ConvertTo-Json | Set-Content taille.json`
- Explication : Pas de sed ni de collage de chaînes : chaque fichier devient un objet, ConvertTo-Json sérialise le tableau.
- Indice 1 (10 s) : Une hashtable @{ nom = ...; taille = ... } ou [PSCustomObject]@{ ... } crée l'objet ; $_ est le fichier courant.
- Indice 2 (20 s) : Le pipeline entier part dans ConvertTo-Json, puis Set-Content taille.json.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/taille.json ] || exit 1
pwsh -NoProfile -NonInteractive -Command '
try { $got = @(Get-Content "$HOME/taille.json" -Raw | ConvertFrom-Json) } catch { exit 1 }
$exp = @(Get-ChildItem "$HOME/logs" -Filter *.log | Sort-Object Name | ForEach-Object { [PSCustomObject]@{ nom = $_.Name; taille = $_.Length } })
if ($got.Count -ne $exp.Count) { exit 1 }
foreach ($g in $got) {
  $e = $exp | Where-Object { $_.nom -eq $g.nom }
  if (-not $e -or [long]$g.taille -ne [long]$e.taille) { exit 1 }
}
exit 0
'
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command 'Get-ChildItem "$HOME/logs" -Filter *.log | ForEach-Object { [PSCustomObject]@{ nom = $_.Name; taille = $_.Length } } | ConvertTo-Json | Set-Content "$HOME/taille.json"'
```

</details>

#### Q1 — variante (sabotage « mutation ») · Défi réel (sandbox)

Même exercice, mais n'écris dans taille.json que les fichiers .log de logs qui dépassent 10000 octets (il y en a au moins un).

- Solution : `Get-ChildItem logs -Filter *.log | Where-Object Length -gt 10000 | ForEach-Object { [PSCustomObject]@{ nom = $_.Name; taille = $_.Length } } | ConvertTo-Json | Set-Content taille.json`
- Indice 1 (10 s) : Insère un Where-Object Length -gt 10000 avant de construire les objets.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
head -c $((RANDOM % 30000 + 20000)) /dev/zero > ~/logs/gros.log
rm -f ~/taille.json
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/taille.json ] || exit 1
pwsh -NoProfile -NonInteractive -Command '
try { $got = @(Get-Content "$HOME/taille.json" -Raw | ConvertFrom-Json) } catch { exit 1 }
$exp = @(Get-ChildItem "$HOME/logs" -Filter *.log | Where-Object Length -gt 10000 | Sort-Object Name | ForEach-Object { [PSCustomObject]@{ nom = $_.Name; taille = $_.Length } })
if ($got.Count -ne $exp.Count) { exit 1 }
foreach ($g in $got) {
  $e = $exp | Where-Object { $_.nom -eq $g.nom }
  if (-not $e -or [long]$g.taille -ne [long]$e.taille) { exit 1 }
}
exit 0
'
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command 'Get-ChildItem "$HOME/logs" -Filter *.log | Where-Object Length -gt 10000 | ForEach-Object { [PSCustomObject]@{ nom = $_.Name; taille = $_.Length } } | ConvertTo-Json | Set-Content "$HOME/taille.json"'
```

</details>

#### Q2 · Défi réel (sandbox)

acces.log finit chaque ligne par une adresse IPv4. Masque le dernier octet (remplace-le par X) avec -replace, et écris le résultat dans acces_masque.txt.

- Solution : `(Get-Content acces.log) -replace '\.[0-9]{1,3}$', '.X' | Set-Content acces_masque.txt`
- Explication : -replace applique une expression régulière à chaque ligne du tableau ; le $ ancre en fin de ligne.
- Indice 1 (10 s) : (Get-Content acces.log) donne un tableau de lignes ; -replace s'applique à chacune.
- Indice 2 (20 s) : Le motif : un point, un à trois chiffres, en fin de ligne.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/acces_masque.txt ] || exit 1
diff -q <(sed -E 's/\.[0-9]{1,3}$/.X/' ~/acces.log) ~/acces_masque.txt >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command '(Get-Content "$HOME/acces.log") -replace "\.[0-9]{1,3}$", ".X" | Set-Content "$HOME/acces_masque.txt"'
```

</details>

#### Q2 — variante (sabotage « mutation ») · Défi réel (sandbox)

Dans acces.log, remplace chaque nom d'utilisateur (utilisateur suivi d'un nombre) par le mot invite, avec -replace. Écris le résultat dans acces_anonyme.txt.

- Solution : `(Get-Content acces.log) -replace 'utilisateur[0-9]+', 'invite' | Set-Content acces_anonyme.txt`
- Indice 1 (10 s) : Le motif : utilisateur puis [0-9]+ (au moins un chiffre).

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/acces_anonyme.txt ] || exit 1
diff -q <(sed -E 's/utilisateur[0-9]+/invite/' ~/acces.log) ~/acces_anonyme.txt >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command '(Get-Content "$HOME/acces.log") -replace "utilisateur[0-9]+", "invite" | Set-Content "$HOME/acces_anonyme.txt"'
```

</details>

#### Q3 · Défi réel (sandbox)

Écris un script verifie.ps1 qui prend un chemin en argument (param) et affiche PRESENT:<chemin> si le chemin existe, ABSENT:<chemin> sinon. Il sera lancé depuis PowerShell ainsi : ./verifie.ps1 <chemin>

- Solution : `param([string]$chemin) puis : if (Test-Path $chemin) { "PRESENT:$chemin" } else { "ABSENT:$chemin" }`
- Explication : param() déclare les arguments du script ; Test-Path répond par un vrai booléen, pas par du texte à décortiquer.
- Indice 1 (10 s) : param([string]$chemin) en première ligne ; $chemin contient l'argument.
- Indice 2 (20 s) : Test-Path $chemin renvoie True ou False : un if suffit.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/verifie.ps1 ] || exit 1
ex=$(find ~/donnees -maxdepth 1 -name "*.dat" | shuf -n 1)
out=$(cd ~ && timeout 3 pwsh -NoProfile -NonInteractive -Command '& ./verifie.ps1 '"$ex"'; & ./verifie.ps1 /home/agent/fantome.txt' 2>/dev/null)
[ "$(echo "$out" | wc -l)" = 2 ] \
  && [ "$(echo "$out" | sed -n 1p)" = "PRESENT:$ex" ] \
  && [ "$(echo "$out" | sed -n 2p)" = "ABSENT:/home/agent/fantome.txt" ]
```

Résolution automatique (tests) :

```bash
cat > ~/verifie.ps1 <<'PWSH'
param([string]$chemin)
if (Test-Path $chemin) { "PRESENT:$chemin" } else { "ABSENT:$chemin" }
PWSH
```

</details>

#### Q3 — variante (sabotage « mutation ») · Défi réel (sandbox)

Écris un script verifie.ps1 qui prend un chemin en argument (param) et affiche DOSSIER:<chemin> si c'est un dossier, FICHIER:<chemin> si c'est un fichier, ABSENT:<chemin> sinon. Il sera lancé depuis PowerShell ainsi : ./verifie.ps1 <chemin>

- Solution : `param([string]$chemin) puis : if (Test-Path $chemin -PathType Container) { "DOSSIER:$chemin" } elseif (Test-Path $chemin) { "FICHIER:$chemin" } else { "ABSENT:$chemin" }`
- Indice 1 (10 s) : Test-Path -PathType Container distingue les dossiers des fichiers.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
rm -f ~/verifie.ps1
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/verifie.ps1 ] || exit 1
f=$(find ~/donnees -maxdepth 1 -name "*.dat" | shuf -n 1)
out=$(cd ~ && timeout 3 pwsh -NoProfile -NonInteractive -Command '& ./verifie.ps1 '"$HOME"'/donnees; & ./verifie.ps1 '"$f"'; & ./verifie.ps1 /home/agent/fantome.txt' 2>/dev/null)
[ "$(echo "$out" | wc -l)" = 3 ] \
  && [ "$(echo "$out" | sed -n 1p)" = "DOSSIER:$HOME/donnees" ] \
  && [ "$(echo "$out" | sed -n 2p)" = "FICHIER:$f" ] \
  && [ "$(echo "$out" | sed -n 3p)" = "ABSENT:/home/agent/fantome.txt" ]
```

Résolution automatique (tests) :

```bash
cat > ~/verifie.ps1 <<'PWSH'
param([string]$chemin)
if (Test-Path $chemin -PathType Container) { "DOSSIER:$chemin" }
elseif (Test-Path $chemin) { "FICHIER:$chemin" }
else { "ABSENT:$chemin" }
PWSH
```

</details>

#### Q4 · Défi réel (sandbox)

config.json contient du JSON, peut-être cassé. Écris dans etat.txt le mot VALIDE si le fichier se lit avec ConvertFrom-Json, CASSE sinon. Entoure la lecture d'un try/catch.

- Solution : `try { Get-Content config.json -Raw | ConvertFrom-Json | Out-Null; "VALIDE" } catch { "CASSE" }, écrit dans etat.txt avec Set-Content`
- Explication : ConvertFrom-Json échoue sur du JSON cassé ; le catch récupère l'erreur proprement au lieu de planter.
- Indice 1 (10 s) : try { ... } catch { ... } : le bloc catch s'exécute quand la lecture JSON échoue.
- Indice 2 (20 s) : Un seul mot dans le fichier : VALIDE ou CASSE, rien d'autre.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
if [ $((RANDOM % 2)) = 0 ]; then
  printf '{"service": "api", "port": %d}\n' $((RANDOM % 2000 + 8000)) > ~/config.json
else
  printf '{"service": "api", port: %d}\n' $((RANDOM % 2000 + 8000)) > ~/config.json
fi
rm -f ~/etat.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/etat.txt ] || exit 1
attendu=$(pwsh -NoProfile -NonInteractive -Command 'try { $null = Get-Content "$HOME/config.json" -Raw | ConvertFrom-Json -ErrorAction Stop; "VALIDE" } catch { "CASSE" }')
[ "$(tr -d ' \r\n' < ~/etat.txt)" = "$attendu" ]
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command 'try { $null = Get-Content "$HOME/config.json" -Raw | ConvertFrom-Json -ErrorAction Stop; "VALIDE" | Set-Content "$HOME/etat.txt" } catch { "CASSE" | Set-Content "$HOME/etat.txt" }'
```

</details>

#### Q4 — variante (sabotage « mutation ») · Défi réel (sandbox)

diviseur.txt contient un nombre... ou le mot rien. Écris dans resultat.txt le double du nombre, ou le mot ERREUR si la conversion échoue. Entoure la conversion d'un try/catch.

- Solution : `try { [int](Get-Content diviseur.txt) * 2 } catch { "ERREUR" }, écrit dans resultat.txt avec Set-Content`
- Indice 1 (10 s) : [int] devant une chaîne la convertit en nombre, ou lève une erreur si c'est impossible.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
if [ $((RANDOM % 3)) = 0 ]; then echo rien > ~/diviseur.txt; else echo $((RANDOM % 8 + 2)) > ~/diviseur.txt; fi
rm -f ~/resultat.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/resultat.txt ] || exit 1
attendu=$(pwsh -NoProfile -NonInteractive -Command 'try { [int](Get-Content "$HOME/diviseur.txt") * 2 } catch { "ERREUR" }')
[ "$(tr -d ' \r\n' < ~/resultat.txt)" = "$attendu" ]
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command 'try { ([int](Get-Content "$HOME/diviseur.txt") * 2) | Set-Content "$HOME/resultat.txt" } catch { "ERREUR" | Set-Content "$HOME/resultat.txt" }'
```

</details>

#### Q5 · Défi réel (sandbox)

Trois processus tournent : veille1 et veille2 sont légitimes, goulot ne devrait pas tourner. Avec Get-Process et Stop-Process, arrête goulot sans toucher aux deux autres.

- Solution : `Get-Process goulot pour le voir, puis Stop-Process -Name goulot`
- Explication : Get-Process et Stop-Process travaillent sur des objets processus : -Name vise un nom exact, sans risque pour les voisins.
- Indice 1 (10 s) : Get-Process goulot affiche le processus et son Id.
- Indice 2 (20 s) : Stop-Process -Name goulot l'arrête ; veille1 et veille2 doivent rester en vie.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
mkdir -p ~/.bin
for p in goulot veille1 veille2; do
  [ -x ~/.bin/$p ] || cp /bin/sleep ~/.bin/$p
  pgrep -x $p >/dev/null || { setsid nohup ~/.bin/$p 100000 >/dev/null 2>&1 & }
done
sleep 0.3
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
! pgrep -x goulot >/dev/null && pgrep -x veille1 >/dev/null && pgrep -x veille2 >/dev/null
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command 'Stop-Process -Name goulot -Force'
sleep 0.2
```

</details>

#### Q5 — variante (sabotage « mutation ») · Défi réel (sandbox)

goulot est de retour, avec un complice : espion. Arrête-les tous les deux, sans toucher à veille1 ni veille2.

- Solution : `Stop-Process -Name goulot, espion`
- Indice 1 (10 s) : Stop-Process accepte une liste de noms, séparés par des virgules.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
mkdir -p ~/.bin
for p in goulot espion veille1 veille2; do
  [ -x ~/.bin/$p ] || cp /bin/sleep ~/.bin/$p
  pgrep -x $p >/dev/null || { setsid nohup ~/.bin/$p 100000 >/dev/null 2>&1 & }
done
sleep 0.3
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
! pgrep -x goulot >/dev/null && ! pgrep -x espion >/dev/null && pgrep -x veille1 >/dev/null && pgrep -x veille2 >/dev/null
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command 'Stop-Process -Name goulot, espion -Force'
sleep 0.2
```

</details>

### gg_defaire_01 — Défaire sans casser

> Chaque bêtise a son antidote : encore faut-il choisir le bon flacon.

| | |
| --- | --- |
| Palier | Root Wizard |
| Arbre | Git-Gud |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 6 |
| XP | 460 |
| Sabotages signature | mutation, hostile_alias |

reset --soft, restore --staged, restore, commit --amend, rm --cached, clean : six façons de défaire, chacune à sa place exacte.

<details><summary>Préparation du niveau</summary>

```bash
git config --global user.name agent
git config --global user.email agent@sandbox
git config --global init.defaultBranch main
rm -rf ~/chantier-git
mkdir ~/chantier-git && cd ~/chantier-git && git init -q
printf '# Chantier\n' > LISEZMOI.md
git add LISEZMOI.md && git commit -qm "Départ"
```

</details>

#### Q1 · Défi réel (sandbox)

Dans chantier-git, le dernier commit (« Réglage raté ») est raté, mais ses modifications restent utiles. Ramène main sur le commit précédent sans rien perdre : la modification de config.txt doit se retrouver en zone de préparation, et ta copie de travail ne doit pas différer de l'index.

- Solution : `git reset --soft HEAD~1`
- Indice 1 (10 s) : git reset a trois dosages : --soft garde tout, --mixed déstage, --hard efface. Il te faut celui qui garde la zone de préparation.
- Indice 2 (10 s) : HEAD~1 désigne le commit juste avant le dernier.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/chantier-git
printf 'timeout = %d\n' "$RANDOM" > config.txt
git add config.txt && git commit -qm "Config"
printf 'mode = verbose\n' >> config.txt
git commit -qam "Réglage raté"
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/chantier-git || exit 1
[ "$(git log -1 --format=%s)" = "Config" ] || exit 1
git diff --cached --quiet && exit 1
git diff --quiet || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cd ~/chantier-git && git reset -q --soft HEAD~1
```

</details>

#### Q1 — variante (sabotage « mutation ») · Défi réel (sandbox)

Le dernier commit (« Grosse bavure ») est raté, mais ses modifications restent utiles. Ramène main sur le commit précédent : la modification de seuil.txt doit rester en zone de préparation, la copie de travail identique à l'index.

- Solution : `git reset --soft HEAD~1`
- Indice 1 (10 s) : Exactement le même geste : seul le nom du commit change.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/chantier-git
printf 'seuil = %d\n' "$RANDOM" > seuil.txt
git add seuil.txt && git commit -qm "Base"
printf 'seuil bis = %d\n' "$RANDOM" >> seuil.txt
git commit -qam "Grosse bavure"
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/chantier-git || exit 1
[ "$(git log -1 --format=%s)" = "Base" ] || exit 1
git diff --cached --quiet && exit 1
git diff --quiet || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cd ~/chantier-git && git reset -q --soft HEAD~1
```

</details>

#### Q2 · Défi réel (sandbox)

budget.txt a été modifié puis ajouté à la zone de préparation. Retire-le de la zone sans perdre la modification et sans commiter : le fichier doit rester modifié sur le disque, et le dernier commit ne doit pas bouger.

- Solution : `git restore --staged budget.txt`
- Indice 1 (10 s) : git restore, avec l'option qui ne touche qu'à la zone de préparation : --staged.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/chantier-git
git reset -q
printf 'budget = %d\n' "$RANDOM" > budget.txt
git add budget.txt && git commit -qm "Budget"
printf 'budget bis = %d\n' "$RANDOM" >> budget.txt
git add budget.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/chantier-git || exit 1
git diff --cached --quiet -- budget.txt || exit 1
[ "$(cat budget.txt)" != "$(git show HEAD:budget.txt)" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cd ~/chantier-git && git restore --staged budget.txt
```

</details>

#### Q2 — variante (sabotage « mutation ») · Défi réel (sandbox)

planning.txt a été modifié puis ajouté à la zone de préparation. Retire-le de la zone sans perdre la modification et sans commiter.

- Solution : `git restore --staged planning.txt`
- Indice 1 (10 s) : La même option --staged, sur l'autre fichier.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/chantier-git
git reset -q
printf 'planning = %d\n' "$RANDOM" > planning.txt
git add planning.txt && git commit -qm "Planning"
printf 'planning bis = %d\n' "$RANDOM" >> planning.txt
git add planning.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/chantier-git || exit 1
git diff --cached --quiet -- planning.txt || exit 1
[ "$(cat planning.txt)" != "$(git show HEAD:planning.txt)" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cd ~/chantier-git && git restore --staged planning.txt
```

</details>

#### Q3 · Défi réel (sandbox)

Une ligne parasite (elle contient le mot « parasite ») s'est glissée à la fin de LISEZMOI.md, sans être commitée. Défais-la : le fichier doit revenir exactement à l'état du dernier commit.

- Solution : `git restore LISEZMOI.md`
- Indice 1 (10 s) : git restore FICHIER ramène la copie de travail à l'état du dernier commit.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/chantier-git
git reset -q
printf 'ligne parasite %d\n' "$RANDOM" >> LISEZMOI.md
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/chantier-git || exit 1
git diff HEAD --quiet -- LISEZMOI.md || exit 1
git show HEAD:LISEZMOI.md | grep -q parasite && exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cd ~/chantier-git && git restore LISEZMOI.md
```

</details>

#### Q3 — variante (sabotage « mutation ») · Défi réel (sandbox)

Une ligne de sabotage (elle contient le mot « sabotage ») a été ajoutée à la fin de regles.txt, sans être commitée. Le fichier doit revenir à l'état du dernier commit.

- Solution : `git restore regles.txt`
- Indice 1 (10 s) : restore sans option s'occupe de la copie de travail, pas de l'index.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/chantier-git
git reset -q
printf 'regle %d\n' "$RANDOM" > regles.txt
git add regles.txt && git commit -qm "Règles"
printf 'sabotage %d\n' "$RANDOM" >> regles.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/chantier-git || exit 1
git diff HEAD --quiet -- regles.txt || exit 1
git show HEAD:regles.txt | grep -q sabotage && exit 1
[ -s regles.txt ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cd ~/chantier-git && git restore regles.txt
```

</details>

#### Q4 · Défi réel (sandbox)

Le dernier commit (« fix ») porte un message trop vague. Renomme-le en « Correctif du compteur » : modifie ce commit, sans en créer de nouveau et sans ouvrir d'éditeur.

- Solution : `git commit --amend -m "Correctif du compteur"`
- Indice 1 (10 s) : git commit --amend remplace le dernier commit au lieu d'en empiler un autre.
- Indice 2 (10 s) : Avec -m, aucun éditeur ne s'ouvre.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/chantier-git
git reset -q
printf 'avance = %d\n' "$RANDOM" > avance.txt
git add avance.txt && git commit -qm "fix"
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/chantier-git || exit 1
[ "$(git log -1 --format=%s)" = "Correctif du compteur" ] || exit 1
git diff --quiet main~1 main && exit 1
git cat-file -e HEAD:avance.txt 2>/dev/null || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cd ~/chantier-git && git commit -q --amend -m "Correctif du compteur"
```

</details>

#### Q4 — variante (sabotage « mutation ») · Défi réel (sandbox)

Le dernier commit (« corr ») porte un message trop vague. Renomme-le en « Rapport du soir » : modifie ce commit, sans en créer de nouveau, sans éditeur.

- Solution : `git commit --amend -m "Rapport du soir"`
- Indice 1 (10 s) : Le même --amend : seul le message change.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/chantier-git
git reset -q
printf 'compte = %d\n' "$RANDOM" > compte-rendu.txt
git add compte-rendu.txt && git commit -qm "corr"
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/chantier-git || exit 1
[ "$(git log -1 --format=%s)" = "Rapport du soir" ] || exit 1
git diff --quiet main~1 main && exit 1
git cat-file -e HEAD:compte-rendu.txt 2>/dev/null || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cd ~/chantier-git && git commit -q --amend -m "Rapport du soir"
```

</details>

#### Q5 · Défi réel (sandbox)

jeton.txt contient un token : le fichier ne doit plus être suivi par Git, mais il doit rester sur ton disque. Retire-le de l'index : le retrait doit être en zone de préparation, pas encore commité.

- Solution : `git rm --cached jeton.txt`
- Indice 1 (10 s) : git rm, avec l'option qui retire du dépôt mais garde le fichier sur le disque : --cached.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/chantier-git
git reset -q
printf 'token = tok-%d\n' "$RANDOM" > jeton.txt
git add jeton.txt && git commit -qm "Ajoute jeton.txt"
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/chantier-git || exit 1
[ -f jeton.txt ] || exit 1
git ls-files --error-unmatch jeton.txt >/dev/null 2>&1 && exit 1
git diff --cached --quiet && exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cd ~/chantier-git && git rm -q --cached jeton.txt
```

</details>

#### Q5 — variante (sabotage « mutation ») · Défi réel (sandbox)

cle.txt contient une clé : elle ne doit plus être suivie, mais rester sur ton disque. Retire-la de l'index, le retrait en zone de préparation, pas encore commité.

- Solution : `git rm --cached cle.txt`
- Indice 1 (10 s) : La même option --cached, pour garder le fichier.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/chantier-git
git reset -q
printf 'cle = cle-%d\n' "$RANDOM" > cle.txt
git add cle.txt && git commit -qm "Ajoute cle.txt"
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/chantier-git || exit 1
[ -f cle.txt ] || exit 1
git ls-files --error-unmatch cle.txt >/dev/null 2>&1 && exit 1
git diff --cached --quiet && exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cd ~/chantier-git && git rm -q --cached cle.txt
```

</details>

#### Q6 · Défi réel (sandbox)

Des fichiers temporaires nommés tmp-*.log (leur nombre est inconnu) traînent dans chantier-git, non suivis. Supprime-les tous, mais ne touche pas au fichier garde-moi.txt : il doit rester intact et non suivi.

- Solution : `git clean -f tmp-*.log`
- Indice 1 (10 s) : git clean supprime les fichiers non suivis ; donne-lui le motif tmp-*.log pour ne viser qu'eux.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/chantier-git
git commit -qm "Retrait de jeton.txt" 2>/dev/null || true
git reset -q
printf 'donnees precieuses %d\n' "$RANDOM" > garde-moi.txt
n=$((RANDOM % 3 + 3))
i=1
while [ "$i" -le "$n" ]; do touch "tmp-$i.log"; i=$((i+1)); done
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/chantier-git || exit 1
ls tmp-*.log >/dev/null 2>&1 && exit 1
[ -n "$(cat garde-moi.txt 2>/dev/null)" ] || exit 1
git ls-files --error-unmatch garde-moi.txt >/dev/null 2>&1 && exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cd ~/chantier-git && git clean -qf tmp-*.log
```

</details>

#### Q6 — variante (sabotage « mutation ») · Défi réel (sandbox)

Des fichiers temporaires nommés old-*.bak (nombre inconnu) traînent, non suivis. Supprime-les tous, sans toucher à precieux.txt, qui doit rester intact et non suivi.

- Solution : `git clean -f old-*.bak`
- Indice 1 (10 s) : La même commande de ménage, un autre motif : old-*.bak.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cd ~/chantier-git
git commit -qm "Menage" 2>/dev/null || true
git reset -q
printf 'tresor %d\n' "$RANDOM" > precieux.txt
n=$((RANDOM % 3 + 3))
i=1
while [ "$i" -le "$n" ]; do touch "old-$i.bak"; i=$((i+1)); done
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/chantier-git || exit 1
ls old-*.bak >/dev/null 2>&1 && exit 1
[ -n "$(cat precieux.txt 2>/dev/null)" ] || exit 1
git ls-files --error-unmatch precieux.txt >/dev/null 2>&1 && exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cd ~/chantier-git && git clean -qf old-*.bak
```

</details>

### rw_script_02 — Scripts solides

> Un script qui marche une fois, c'est bien. Un script qui tient, c'est mieux.

| | |
| --- | --- |
| Palier | Root Wizard |
| Arbre | System Overlord |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 5 |
| XP | 460 |
| Sabotages signature | hostile_path, mutation |

Des scripts qui s'arrêtent au bon moment, isolent leurs variables, choisissent leur branche et lisent leurs options.

#### Q1 · Défi réel (sandbox)

Écris ~/premier.sh qui commence par `set -e`, puis exécute `false`, puis `echo fini`. Lance-le : tu ne dois voir aucun affichage et le script doit sortir en erreur (code de retour non nul). C'est set -e qui arrête tout dès la première commande en échec.

- Solution : `printf '#!/bin/bash\nset -e\nfalse\necho fini\n' > ~/premier.sh && chmod +x ~/premier.sh`
- Indice 1 (10 s) : set -e en première ligne après le shebang : toute commande qui échoue arrête le script.
- Indice 2 (10 s) : Vérifie avec `./premier.sh; echo $?` : le code ne doit pas être 0.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~ || exit 1
[ -x premier.sh ] || exit 1
grep -q 'set -e' premier.sh || exit 1
out=$(timeout 3 ./premier.sh 2>/dev/null) || true
[ -z "$out" ] || exit 1
timeout 3 ./premier.sh >/dev/null 2>&1
rc=$?
[ "$rc" -ge 1 ] && [ "$rc" -lt 124 ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
printf '#!/bin/bash\nset -e\nfalse\necho fini\n' > ~/premier.sh
chmod +x ~/premier.sh
```

</details>

#### Q1 — variante (sabotage « mutation ») · Défi réel (sandbox)

Écris ~/strict.sh qui commence par `set -u`, puis affiche `Bonjour $nom` sans avoir défini la variable `nom`. Lance-le : le script doit sortir en erreur (code non nul) sans rien afficher.

- Solution : `printf '#!/bin/bash\nset -u\necho "Bonjour $nom"\n' > ~/strict.sh && chmod +x ~/strict.sh`
- Indice 1 (10 s) : set -u fait échouer le script dès qu'il lit une variable non définie.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~ || exit 1
[ -x strict.sh ] || exit 1
grep -q 'set -u' strict.sh || exit 1
out=$(timeout 3 ./strict.sh 2>/dev/null) || true
[ -z "$out" ] || exit 1
timeout 3 ./strict.sh >/dev/null 2>&1
rc=$?
[ "$rc" -ge 1 ] && [ "$rc" -lt 124 ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
printf '#!/bin/bash\nset -u\necho "Bonjour $nom"\n' > ~/strict.sh
chmod +x ~/strict.sh
```

</details>

#### Q2 · Défi réel (sandbox)

Écris ~/local.sh. Il définit une variable globale `compteur=global`, puis une fonction `affiche` qui déclare `local compteur=local` et affiche `$compteur`. Le script appelle ensuite `affiche`, puis affiche `$compteur`. La sortie doit être exactement deux lignes : `local` puis `global`.

- Solution : `cat > ~/local.sh <<'EOF'
#!/bin/bash
compteur=global
affiche() {
  local compteur=local
  echo "$compteur"
}
affiche
echo "$compteur"
EOF
chmod +x ~/local.sh
`
- Indice 1 (10 s) : `local VAR=valeur`, à l'intérieur de la fonction, crée une variable qui n'existe que pour cette fonction.
- Indice 2 (10 s) : Sans local, la variable globale serait écrasée et la sortie serait `local` puis `local`.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~ || exit 1
[ -x local.sh ] || exit 1
grep -q 'local ' local.sh || exit 1
out=$(timeout 3 ./local.sh 2>/dev/null)
expected=$'local\nglobal'
[ "$out" = "$expected" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cat > ~/local.sh <<'EOF'
#!/bin/bash
compteur=global
affiche() {
  local compteur=local
  echo "$compteur"
}
affiche
echo "$compteur"
EOF
chmod +x ~/local.sh
```

</details>

#### Q2 — variante (sabotage « mutation ») · Défi réel (sandbox)

Écris ~/double.sh. Il définit `n=0`, puis une fonction `calcule` qui fait `local n=5` et `n=$((n * 2))`, puis affiche `$n`. Le script appelle `calcule`, puis affiche `n=$n`. La sortie doit être exactement : `10` puis `n=0`.

- Solution : `cat > ~/double.sh <<'EOF'
#!/bin/bash
n=0
calcule() {
  local n=5
  n=$((n * 2))
  echo "$n"
}
calcule
echo "n=$n"
EOF
chmod +x ~/double.sh
`
- Indice 1 (10 s) : La variable globale doit rester à 0 après l'appel : c'est tout l'intérêt de local.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~ || exit 1
[ -x double.sh ] || exit 1
grep -q 'local ' double.sh || exit 1
out=$(timeout 3 ./double.sh 2>/dev/null)
expected=$'10\nn=0'
[ "$out" = "$expected" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cat > ~/double.sh <<'EOF'
#!/bin/bash
n=0
calcule() {
  local n=5
  n=$((n * 2))
  echo "$n"
}
calcule
echo "n=$n"
EOF
chmod +x ~/double.sh
```

</details>

#### Q3 · Défi réel (sandbox)

Écris ~/menu.sh qui prend un mot en argument (`start`, `stop`, `status`), utilise `case`, et affiche respectivement `Démarrage`, `Arrêt`, `Statut`. Tout autre mot affiche `Inconnu`. Sans argument, affiche aussi `Inconnu`.

- Solution : `cat > ~/menu.sh <<'EOF'
#!/bin/bash
case "${1:-}" in
  start)  echo "Démarrage" ;;
  stop)   echo "Arrêt" ;;
  status) echo "Statut" ;;
  *)      echo "Inconnu" ;;
esac
EOF
chmod +x ~/menu.sh
`
- Indice 1 (10 s) : case VAR in motif) … ;; esac. Le motif * sert de branche par défaut.
- Indice 2 (10 s) : Pour gérer l'absence d'argument sans erreur, écris `${1:-}`.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~ || exit 1
[ -x menu.sh ] || exit 1
grep -q 'case' menu.sh || exit 1
[ "$(timeout 3 ./menu.sh start)" = "Démarrage" ] || exit 1
[ "$(timeout 3 ./menu.sh stop)" = "Arrêt" ] || exit 1
[ "$(timeout 3 ./menu.sh status)" = "Statut" ] || exit 1
[ "$(timeout 3 ./menu.sh autre)" = "Inconnu" ] || exit 1
[ "$(timeout 3 ./menu.sh)" = "Inconnu" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cat > ~/menu.sh <<'EOF'
#!/bin/bash
case "${1:-}" in
  start)  echo "Démarrage" ;;
  stop)   echo "Arrêt" ;;
  status) echo "Statut" ;;
  *)      echo "Inconnu" ;;
esac
EOF
chmod +x ~/menu.sh
```

</details>

#### Q3 — variante (sabotage « mutation ») · Défi réel (sandbox)

Écris ~/verdict.sh qui prend un code de sortie en argument (`0`, `1`, `2`) et affiche `succes` pour 0, `erreur-legere` pour 1, `erreur-grave` pour 2, et `inconnu` pour tout autre code.

- Solution : `cat > ~/verdict.sh <<'EOF'
#!/bin/bash
case "${1:-}" in
  0) echo "succes" ;;
  1) echo "erreur-legere" ;;
  2) echo "erreur-grave" ;;
  *) echo "inconnu" ;;
esac
EOF
chmod +x ~/verdict.sh
`
- Indice 1 (10 s) : Les motifs de case peuvent être des nombres, pas seulement des mots.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~ || exit 1
[ -x verdict.sh ] || exit 1
grep -q 'case' verdict.sh || exit 1
[ "$(timeout 3 ./verdict.sh 0)" = "succes" ] || exit 1
[ "$(timeout 3 ./verdict.sh 1)" = "erreur-legere" ] || exit 1
[ "$(timeout 3 ./verdict.sh 2)" = "erreur-grave" ] || exit 1
[ "$(timeout 3 ./verdict.sh 42)" = "inconnu" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cat > ~/verdict.sh <<'EOF'
#!/bin/bash
case "${1:-}" in
  0) echo "succes" ;;
  1) echo "erreur-legere" ;;
  2) echo "erreur-grave" ;;
  *) echo "inconnu" ;;
esac
EOF
chmod +x ~/verdict.sh
```

</details>

#### Q4 · Défi réel (sandbox)

Écris ~/opts.sh qui utilise `getopts` avec `-n NOM` et `-v`. La variable `nom` vaut `inconnu` par défaut, ou la valeur passée à `-n`. Le script affiche d'abord `verbeux` si `-v` a été donné, puis `nom=<valeur>`. Sans -v, il n'affiche que la ligne `nom=…`.

- Solution : `cat > ~/opts.sh <<'EOF'
#!/bin/bash
nom=inconnu
verbeux=non
while getopts "n:v" opt; do
  case "$opt" in
    n) nom="$OPTARG" ;;
    v) verbeux=oui ;;
  esac
done
[ "$verbeux" = oui ] && echo "verbeux"
echo "nom=$nom"
EOF
chmod +x ~/opts.sh
`
- Indice 1 (10 s) : La chaîne d'options de getopts utilise deux-points après une lettre quand elle attend une valeur : `n:`.
- Indice 2 (10 s) : L'argument associé se lit dans `$OPTARG` à l'intérieur du case.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~ || exit 1
[ -x opts.sh ] || exit 1
grep -q getopts opts.sh || exit 1
# Des noms tirés au hasard : impossible de les prévoir dans le script.
a=agent$RANDOM; b=joueur$RANDOM
out1=$(timeout 3 ./opts.sh 2>/dev/null)
[ "$out1" = "nom=inconnu" ] || exit 1
out2=$(timeout 3 ./opts.sh -n "$a" 2>/dev/null)
[ "$out2" = "nom=$a" ] || exit 1
out3=$(timeout 3 ./opts.sh -v -n "$b" 2>/dev/null)
expected3=$'verbeux\n'"nom=$b"
[ "$out3" = "$expected3" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cat > ~/opts.sh <<'EOF'
#!/bin/bash
nom=inconnu
verbeux=non
while getopts "n:v" opt; do
  case "$opt" in
    n) nom="$OPTARG" ;;
    v) verbeux=oui ;;
  esac
done
[ "$verbeux" = oui ] && echo "verbeux"
echo "nom=$nom"
EOF
chmod +x ~/opts.sh
```

</details>

#### Q4 — variante (sabotage « mutation ») · Défi réel (sandbox)

Écris ~/args.sh qui utilise `getopts` avec `-f FICHIER` et `-d` (mode debug). Par défaut, `fichier` vaut `defaut.txt` et `debug` vaut `non`. Le script affiche `debug` si -d a été donné, puis `fichier=<valeur>`.

- Solution : `cat > ~/args.sh <<'EOF'
#!/bin/bash
fichier=defaut.txt
debug=non
while getopts "f:d" opt; do
  case "$opt" in
    f) fichier="$OPTARG" ;;
    d) debug=oui ;;
  esac
done
[ "$debug" = oui ] && echo "debug"
echo "fichier=$fichier"
EOF
chmod +x ~/args.sh
`
- Indice 1 (10 s) : Les options dans la chaîne suivent l'ordre habituel : lettres seules, deux-points pour celles qui attendent une valeur.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~ || exit 1
[ -x args.sh ] || exit 1
grep -q getopts args.sh || exit 1
f=notes$RANDOM.txt
[ "$(timeout 3 ./args.sh 2>/dev/null)" = "fichier=defaut.txt" ] || exit 1
[ "$(timeout 3 ./args.sh -f "$f" 2>/dev/null)" = "fichier=$f" ] || exit 1
[ "$(timeout 3 ./args.sh -d 2>/dev/null)" = $'debug\nfichier=defaut.txt' ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cat > ~/args.sh <<'EOF'
#!/bin/bash
fichier=defaut.txt
debug=non
while getopts "f:d" opt; do
  case "$opt" in
    f) fichier="$OPTARG" ;;
    d) debug=oui ;;
  esac
done
[ "$debug" = oui ] && echo "debug"
echo "fichier=$fichier"
EOF
chmod +x ~/args.sh
```

</details>

#### Q5 · Défi réel (sandbox)

Écris ~/confgen.sh qui utilise un here-doc pour créer ~/serveur.conf contenant exactement deux lignes : `port=8080` puis `nom=mon-serveur`. Le script affiche aussi `ok` à la fin.

- Solution : `cat > ~/confgen.sh <<'SCRIPT'
#!/bin/bash
cat > "$HOME/serveur.conf" <<CONF
port=8080
nom=mon-serveur
CONF
echo ok
SCRIPT
chmod +x ~/confgen.sh
`
- Indice 1 (10 s) : Un here-doc commence par `COMMANDE <<MARQUEUR` et se termine par une ligne qui contient seulement `MARQUEUR`.
- Indice 2 (10 s) : Mets des guillemets autour du marqueur (`<<'CONF'`) si le contenu ne doit pas subir d'expansion de variables.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~ || exit 1
[ -x confgen.sh ] || exit 1
grep -q '<<' confgen.sh || exit 1
rm -f serveur.conf
out=$(timeout 3 ./confgen.sh 2>/dev/null)
[ "$out" = "ok" ] || exit 1
expected=$'port=8080\nnom=mon-serveur'
actual=$(cat serveur.conf 2>/dev/null)
[ "$actual" = "$expected" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cat > ~/confgen.sh <<'SCRIPT'
#!/bin/bash
cat > "$HOME/serveur.conf" <<CONF
port=8080
nom=mon-serveur
CONF
echo ok
SCRIPT
chmod +x ~/confgen.sh
```

</details>

#### Q5 — variante (sabotage « mutation ») · Défi réel (sandbox)

Écris ~/gen_conf.sh qui utilise un here-doc pour créer ~/reseau.conf contenant exactement deux lignes : `host=localhost` puis `port=9000`. Le script affiche aussi `reseau pret` à la fin.

- Solution : `cat > ~/gen_conf.sh <<'SCRIPT'
#!/bin/bash
cat > "$HOME/reseau.conf" <<CONF
host=localhost
port=9000
CONF
echo "reseau pret"
SCRIPT
chmod +x ~/gen_conf.sh
`
- Indice 1 (10 s) : Même structure que pour serveur.conf, avec un autre contenu.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~ || exit 1
[ -x gen_conf.sh ] || exit 1
grep -q '<<' gen_conf.sh || exit 1
rm -f reseau.conf
out=$(timeout 3 ./gen_conf.sh 2>/dev/null)
[ "$out" = "reseau pret" ] || exit 1
expected=$'host=localhost\nport=9000'
actual=$(cat reseau.conf 2>/dev/null)
[ "$actual" = "$expected" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cat > ~/gen_conf.sh <<'SCRIPT'
#!/bin/bash
cat > "$HOME/reseau.conf" <<CONF
host=localhost
port=9000
CONF
echo "reseau pret"
SCRIPT
chmod +x ~/gen_conf.sh
```

</details>

### rw_text_01 — La boîte à outils texte

> Découper, transformer, recoller : les petits outils font les grands pipelines.

| | |
| --- | --- |
| Palier | Root Wizard |
| Arbre | Data Surgeon |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 5 |
| XP | 420 |
| Sabotages signature | hostile_decoy, mutation |

cut, tr, paste, join et comm : la quincaillerie du traitement de texte, à combiner dans un pipeline.

<details><summary>Préparation du niveau</summary>

```bash
mkdir -p ~/data
# Les salaires changent à chaque partie : les réponses se recalculent.
for e in Dupont:Alice:info Martin:Bob:rh Bernard:Claire:info Petit:David:rh \
         Durand:Eve:compta Roux:Frank:compta Moreau:Grace:info Simon:Hugo:rh; do
  echo "$e:$((RANDOM % 2500 + 2500))"
done > ~/data/employes.csv
cut -d: -f1,4 ~/data/employes.csv | LC_ALL=C sort > ~/data/salaires.csv
cut -d: -f1,3 ~/data/employes.csv | LC_ALL=C sort > ~/data/services.csv
printf 'alice\nbob\nclaire\ndavid\neve\nfrank\ngrace\nhugo\n' > ~/data/liste_a.txt
printf 'bob\nclaire\nfrank\ngrace\nhenri\niris\n' > ~/data/liste_b.txt
LC_ALL=C sort -o ~/data/liste_a.txt ~/data/liste_a.txt
LC_ALL=C sort -o ~/data/liste_b.txt ~/data/liste_b.txt
```

</details>

#### Q1 · Défi réel (sandbox)

Écris dans ~/data/tries.txt les lignes de ~/data/employes.csv triées par service (colonne 3), puis par salaire décroissant (colonne 4). Le séparateur est `:`. Garde les lignes telles quelles.

- Solution : `sort -t: -k3,3 -k4,4nr ~/data/employes.csv > ~/data/tries.txt`
- Indice 1 (10 s) : -t: choisit le séparateur. -k3,3 trie sur la 3e colonne seule.
- Indice 2 (10 s) : Pour un tri numérique descendant sur la 4e colonne : `-k4,4nr`.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/data/tries.txt ] || exit 1
expected=$(sort -t: -k3,3 -k4,4nr ~/data/employes.csv)
actual=$(cat ~/data/tries.txt)
[ "$actual" = "$expected" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
sort -t: -k3,3 -k4,4nr ~/data/employes.csv > ~/data/tries.txt
```

</details>

#### Q1 — variante (sabotage « mutation ») · Défi réel (sandbox)

Écris dans ~/data/tries_nom.txt les lignes de ~/data/employes.csv triées par salaire décroissant (colonne 4), puis par nom croissant (colonne 1) en cas d'égalité. Le séparateur est `:`.

- Solution : `sort -t: -k4,4nr -k1,1 ~/data/employes.csv > ~/data/tries_nom.txt`
- Indice 1 (10 s) : L'ordre des options -k compte : la première est la clé principale.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/data/tries_nom.txt ] || exit 1
expected=$(sort -t: -k4,4nr -k1,1 ~/data/employes.csv)
actual=$(cat ~/data/tries_nom.txt)
[ "$actual" = "$expected" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
sort -t: -k4,4nr -k1,1 ~/data/employes.csv > ~/data/tries_nom.txt
```

</details>

#### Q2 · Défi réel (sandbox)

Écris dans ~/data/noms.txt les noms (1re colonne) de ~/data/employes.csv, un par ligne, en majuscules.

- Solution : `cut -d: -f1 ~/data/employes.csv | tr a-z A-Z > ~/data/noms.txt`
- Indice 1 (10 s) : cut -d: -f1 extrait la première colonne. tr a-z A-Z la met en majuscules.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/data/noms.txt ] || exit 1
expected=$(cut -d: -f1 ~/data/employes.csv | tr a-z A-Z)
actual=$(cat ~/data/noms.txt)
[ "$actual" = "$expected" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cut -d: -f1 ~/data/employes.csv | tr a-z A-Z > ~/data/noms.txt
```

</details>

#### Q2 — variante (sabotage « mutation ») · Défi réel (sandbox)

Écris dans ~/data/services_uniques.txt la liste des services (3e colonne) de ~/data/employes.csv, sans doublon, triée, un par ligne.

- Solution : `cut -d: -f3 ~/data/employes.csv | sort -u > ~/data/services_uniques.txt`
- Indice 1 (10 s) : cut extrait la colonne ; sort -u trie et retire les doublons.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/data/services_uniques.txt ] || exit 1
expected=$(cut -d: -f3 ~/data/employes.csv | sort -u)
actual=$(cat ~/data/services_uniques.txt)
[ "$actual" = "$expected" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
cut -d: -f3 ~/data/employes.csv | sort -u > ~/data/services_uniques.txt
```

</details>

#### Q3 · Défi réel (sandbox)

Écris dans ~/data/paires.txt, une ligne par employé, le nom (1re colonne) puis le service (3e colonne) séparés par une tabulation, dans l'ordre du fichier.

- Solution : `paste <(cut -d: -f1 ~/data/employes.csv) <(cut -d: -f3 ~/data/employes.csv) > ~/data/paires.txt`
- Indice 1 (10 s) : paste colle côte à côte les lignes de deux flux, séparées par une tabulation.
- Indice 2 (10 s) : `<(commande)` fait passer la sortie d'une commande là où un nom de fichier est attendu.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/data/paires.txt ] || exit 1
expected=$(paste <(cut -d: -f1 ~/data/employes.csv) <(cut -d: -f3 ~/data/employes.csv))
actual=$(cat ~/data/paires.txt)
[ "$actual" = "$expected" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
paste <(cut -d: -f1 ~/data/employes.csv) <(cut -d: -f3 ~/data/employes.csv) > ~/data/paires.txt
```

</details>

#### Q3 — variante (sabotage « mutation ») · Défi réel (sandbox)

Écris dans ~/data/triple.txt, une ligne par employé, le nom (1re colonne), le service (3e colonne) et le salaire (4e colonne) séparés par une tabulation, dans l'ordre du fichier.

- Solution : `paste <(cut -d: -f1 ~/data/employes.csv) <(cut -d: -f3 ~/data/employes.csv) <(cut -d: -f4 ~/data/employes.csv) > ~/data/triple.txt`
- Indice 1 (10 s) : paste accepte autant de fichiers (ou de flux) qu'on veut.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/data/triple.txt ] || exit 1
expected=$(paste <(cut -d: -f1 ~/data/employes.csv) <(cut -d: -f3 ~/data/employes.csv) <(cut -d: -f4 ~/data/employes.csv))
actual=$(cat ~/data/triple.txt)
[ "$actual" = "$expected" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
paste <(cut -d: -f1 ~/data/employes.csv) <(cut -d: -f3 ~/data/employes.csv) <(cut -d: -f4 ~/data/employes.csv) > ~/data/triple.txt
```

</details>

#### Q4 · Défi réel (sandbox)

Les fichiers ~/data/services.csv (nom:service) et ~/data/salaires.csv (nom:salaire) sont triés par nom. Écris dans ~/data/fiche.csv, pour chaque nom présent dans les deux fichiers, une ligne `nom:service:salaire`.

- Solution : `join -t: ~/data/services.csv ~/data/salaires.csv > ~/data/fiche.csv`
- Indice 1 (10 s) : join fusionne deux fichiers triés sur leur clé commune : par défaut, la première colonne.
- Indice 2 (10 s) : -t: choisit le séparateur, comme pour cut et sort.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/data/fiche.csv ] || exit 1
expected=$(join -t: ~/data/services.csv ~/data/salaires.csv)
actual=$(cat ~/data/fiche.csv)
[ "$actual" = "$expected" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
join -t: ~/data/services.csv ~/data/salaires.csv > ~/data/fiche.csv
```

</details>

#### Q4 — variante (sabotage « mutation ») · Défi réel (sandbox)

Les fichiers ~/data/services.csv (nom:service) et ~/data/salaires.csv (nom:salaire) sont triés par nom. Écris dans ~/data/fiche2.csv, pour chaque nom, une ligne `nom service salaire`, séparée par des espaces.

- Solution : `join -t: ~/data/services.csv ~/data/salaires.csv | tr ':' ' ' > ~/data/fiche2.csv`
- Indice 1 (10 s) : join garde le séparateur d'entrée : un pipe vers tr le remplace.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/data/fiche2.csv ] || exit 1
expected=$(join -t: ~/data/services.csv ~/data/salaires.csv | tr ':' ' ')
actual=$(cat ~/data/fiche2.csv)
[ "$actual" = "$expected" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
join -t: ~/data/services.csv ~/data/salaires.csv | tr ':' ' ' > ~/data/fiche2.csv
```

</details>

#### Q5 · Défi réel (sandbox)

Les fichiers ~/data/liste_a.txt et ~/data/liste_b.txt sont triés. Écris dans ~/data/communs.txt les noms présents dans les deux listes, un par ligne, triés.

- Solution : `comm -12 ~/data/liste_a.txt ~/data/liste_b.txt > ~/data/communs.txt`
- Indice 1 (10 s) : comm compare deux fichiers triés : -1 masque la colonne propre au premier, -2 celle du second.
- Indice 2 (10 s) : En combinant -12, seules les lignes présentes dans les deux restent.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/data/communs.txt ] || exit 1
expected=$(comm -12 ~/data/liste_a.txt ~/data/liste_b.txt)
actual=$(cat ~/data/communs.txt)
[ "$actual" = "$expected" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
comm -12 ~/data/liste_a.txt ~/data/liste_b.txt > ~/data/communs.txt
```

</details>

#### Q5 — variante (sabotage « mutation ») · Défi réel (sandbox)

Les fichiers ~/data/liste_a.txt et ~/data/liste_b.txt sont triés. Écris dans ~/data/uniques_a.txt les noms présents uniquement dans liste_a, un par ligne, triés.

- Solution : `comm -23 ~/data/liste_a.txt ~/data/liste_b.txt > ~/data/uniques_a.txt`
- Indice 1 (10 s) : -2 masque la colonne propre au second fichier : il reste les lignes du premier + les communes.
- Indice 2 (10 s) : En combinant -23, seules les lignes du premier fichier qui ne sont pas dans le second restent.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/data/uniques_a.txt ] || exit 1
expected=$(comm -23 ~/data/liste_a.txt ~/data/liste_b.txt)
actual=$(cat ~/data/uniques_a.txt)
[ "$actual" = "$expected" ] || exit 1
exit 0
```

Résolution automatique (tests) :

```bash
comm -23 ~/data/liste_a.txt ~/data/liste_b.txt > ~/data/uniques_a.txt
```

</details>

### np_fragments_01 — Les fragments du réseau

> Des services partout. Certains parlent, d'autres mentent, un seul attend qu'on lui adresse la parole.

| | |
| --- | --- |
| Palier | Root Wizard |
| Arbre | Network Phantom |
| Exécution | Sandbox Docker (bash) |
| Type natif | Classique |
| Rejouable | Chaos |
| Questions | 5 |
| XP | 480 |
| Sabotages signature | hostile_decoy, false_red |

Cartographier des services locaux, assembler un code dispersé, dialoguer avec un service qui attend une commande, puis faire le ménage. Tout reste sur 127.0.0.1.

<details><summary>Préparation du niveau</summary>

```bash
mkdir -p ~/net ~/.bin
# Un service qui renvoie un fichier à chaque connexion. Copié sous deux
# noms : fragment et leurre, pour qu'on puisse les distinguer avec ps.
cat > ~/.bin/fragment <<'EOF'
#!/bin/bash
while true; do
  nc -l 127.0.0.1 "$1" -q 0 < "$2" >/dev/null 2>&1
  sleep 0.05
done
EOF
chmod +x ~/.bin/fragment
cp ~/.bin/fragment ~/.bin/leurre
# Le guichet lit une ligne et répond : PING, CODE <code>, sinon REFUSE.
cat > ~/.bin/guichet <<'EOF'
#!/bin/bash
F=$(mktemp -u /tmp/.guichet.XXXXXX)
repondre() {
  IFS= read -r -t 5 ligne || true
  ligne=${ligne%$'\r'}
  case "$ligne" in
    PING) echo PONG ;;
    "CODE $(cat /tmp/.np-code 2>/dev/null)") echo "ACCES: $(cat /tmp/.np-flag 2>/dev/null)" ;;
    *) echo REFUSE ;;
  esac
}
while true; do
  rm -f "$F"; mkfifo "$F"
  nc -l -N 127.0.0.1 "$1" < "$F" 2>/dev/null | repondre > "$F"
done
EOF
chmod +x ~/.bin/guichet
rm -f /tmp/.np-*
leurres=$((RANDOM % 2 + 1))
mapfile -t ports < <(shuf -i 20000-40000 -n $((4 + leurres)))
code=""
for k in 1 2 3; do
  morceau=$(head -c 3 /dev/urandom | od -An -tx1 | tr -d ' \n')
  code="$code$morceau"
  printf 'FRAGMENT %d/3 : %s\n' "$k" "$morceau" > "/tmp/.np-frag-${ports[$k]}"
  setsid nohup ~/.bin/fragment "${ports[$k]}" "/tmp/.np-frag-${ports[$k]}" >/dev/null 2>&1 &
done
printf '%s\n' "$code" > /tmp/.np-code
printf '%s\n' "${ports[0]}" > /tmp/.np-guichet
setsid nohup ~/.bin/guichet "${ports[0]}" >/dev/null 2>&1 &
printf 'RIEN ICI\n' > /tmp/.np-leurre
for i in $(seq 1 "$leurres"); do
  p=${ports[$((3 + i))]}
  echo "$p" >> /tmp/.np-leurres
  setsid nohup ~/.bin/leurre "$p" /tmp/.np-leurre >/dev/null 2>&1 &
done
sleep 0.6
```

</details>

#### Q1 · Défi réel (sandbox)

Combien de services TCP écoutent sur 127.0.0.1 ? Envoie le nombre avec submit.

- Solution : `ss -tln, compte les lignes en 127.0.0.1, puis submit <nombre>`
- Indice 1 (10 s) : ss -tln liste les ports TCP en écoute ; -H retire l'en-tête.
- Indice 2 (20 s) : grep -c compte les lignes qui correspondent.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(ss -Htln | grep -c "127\.0\.0\.1:")"
```

Résolution automatique (tests) :

```bash
submit "$(ss -Htln | grep -c '127\.0\.0\.1:')"
```

</details>

#### Q1 — variante (sabotage « mutation ») · Défi réel (sandbox)

Quel est le plus grand port TCP en écoute sur 127.0.0.1 ? Envoie-le avec submit.

- Solution : `ss -Htln | awk '{print $4}' | sed 's/.*://' | sort -n | tail -n 1`
- Indice 1 (10 s) : Garde ce qui suit les deux-points, puis sort -n.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(ss -Htln | awk "{print \$4}" | sed "s/.*://" | sort -n | tail -n 1)"
```

Résolution automatique (tests) :

```bash
submit "$(ss -Htln | awk '{print $4}' | sed 's/.*://' | sort -n | tail -n 1)"
```

</details>

#### Q2 · Défi réel (sandbox)

Trois services renvoient chacun une ligne « FRAGMENT k/3 : … » ; les autres ne disent rien d'utile. Assemble le code : les trois morceaux dans l'ordre 1, 2, 3, collés sans espace, dans ~/net/code.txt.

- Solution : `for p in <ports>; do nc 127.0.0.1 $p; done, puis colle les morceaux dans l'ordre des numéros`
- Indice 1 (10 s) : Interroge chaque port avec nc 127.0.0.1 PORT. L'ordre des ports n'est pas celui des fragments : lis leur numéro.
- Indice 2 (20 s) : Une boucle for sur les ports, puis grep FRAGMENT | sort, fait tout le tri.
- Indice 3 (10 s) : Un service ne répond pas tout de suite : il attend que tu lui écrives. Ctrl+C pour passer au suivant.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/net/code.txt ] || exit 1
[ "$(tr -d ' \r\n' < ~/net/code.txt)" = "$(cat /tmp/.np-code)" ]
```

Résolution automatique (tests) :

```bash
for p in $(ss -Htln | awk '{print $4}' | sed 's/.*://'); do
  timeout 1 nc 127.0.0.1 "$p" </dev/null 2>/dev/null
done | grep '^FRAGMENT' | sort | sed 's/.*: //' | tr -d '\n' > ~/net/code.txt
```

</details>

#### Q2 — variante (sabotage « mutation ») · Défi réel (sandbox)

Trois services renvoient chacun une ligne « FRAGMENT k/3 : … ». Écris ces trois lignes, telles quelles et dans l'ordre 1/3, 2/3, 3/3, dans ~/net/fragments.txt.

- Solution : `nc sur chaque port, puis grep FRAGMENT | sort > ~/net/fragments.txt`
- Indice 1 (10 s) : Récupère tout, puis grep FRAGMENT et sort.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -f ~/net/fragments.txt ] || exit 1
diff -q <(cat /tmp/.np-frag-* | sort) <(grep -v '^[[:space:]]*$' ~/net/fragments.txt | tr -d '\r') >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
for p in $(ss -Htln | awk '{print $4}' | sed 's/.*://'); do
  timeout 1 nc 127.0.0.1 "$p" </dev/null 2>/dev/null
done | grep '^FRAGMENT' | sort > ~/net/fragments.txt
```

</details>

#### Q3 · Défi réel (sandbox)

Un des services attend qu'on lui écrive une ligne : il répond PONG à PING. Trouve-le, puis envoie-lui la ligne « CODE <le code assemblé> ». Il te donnera un flag : envoie-le avec submit.

- Solution : `echo PING | nc 127.0.0.1 <port> pour trouver le guichet, puis echo "CODE <code>" | nc 127.0.0.1 <port>`
- Flag aléatoire à chaque partie ($FLAG)
- Indice 1 (10 s) : echo PING | nc 127.0.0.1 PORT envoie une ligne et affiche la réponse.
- Indice 2 (20 s) : Le code est celui de la question précédente, sans espace : echo "CODE abc123…" | nc …

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
printf '%s\n' "$FLAG" > /tmp/.np-flag
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$FLAG"
```

Résolution automatique (tests) :

```bash
submit "$(echo "CODE $(cat /tmp/.np-code)" | timeout 3 nc 127.0.0.1 "$(cat /tmp/.np-guichet)" | sed 's/^ACCES: //')"
```

</details>

#### Q3 — variante (sabotage « mutation ») · Défi réel (sandbox)

Un des services attend qu'on lui écrive une ligne : il répond PONG quand on lui envoie PING. Trouve son port et envoie-le avec submit.

- Solution : `for p in <ports>; do echo PING | nc 127.0.0.1 $p; done : celui qui répond PONG`
- Indice 1 (10 s) : Envoie PING à chaque port : seul le guichet répond PONG.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is "$(cat /tmp/.np-guichet)"
```

Résolution automatique (tests) :

```bash
for p in $(ss -Htln | awk '{print $4}' | sed 's/.*://'); do
  [ "$(echo PING | timeout 2 nc 127.0.0.1 "$p" 2>/dev/null | head -n 1)" = PONG ] && { submit "$p"; break; }
done
```

</details>

#### Q4 · Défi réel (sandbox)

Les services qui répondent « RIEN ICI » sont des leurres. Arrête-les tous, pour de bon, sans toucher aux fragments ni au guichet.

- Solution : `ps -ef montre les boucles leurre ; pkill leurre arrête les boucles, puis kill le nc qui écoute encore (ss -tlnp donne son PID), ou kill -- -<PGID> pour tout le groupe`
- Indice 1 (10 s) : ps -eo pid,pgid,comm,args montre les boucles : leur nom trahit les leurres.
- Indice 2 (20 s) : Tuer la boucle ne suffit pas : son nc écoute encore. ss -tlnp donne le PID de ce nc.
- Indice 3 (20 s) : Chaque service tourne dans son propre groupe : kill -- -PGID arrête la boucle et son nc d'un coup.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
! pgrep -x leurre >/dev/null || exit 1
while read -r p; do ss -Htln | grep -q "127\.0\.0\.1:$p " && exit 1; done < /tmp/.np-leurres
[ "$(pgrep -cx fragment)" = 3 ] && pgrep -x guichet >/dev/null
```

Résolution automatique (tests) :

```bash
while read -r p; do
  pid=$(ss -Htlnp | grep "127\.0\.0\.1:$p " | grep -o 'pid=[0-9]*' | head -n 1 | cut -d= -f2)
  [ -n "$pid" ] && kill -- "-$(ps -o pgid= -p "$pid" | tr -d ' ')"
done < /tmp/.np-leurres
sleep 0.3
```

</details>

#### Q4 — variante (sabotage « mutation ») · Défi réel (sandbox)

Arrête uniquement le service du fragment 1/3 : plus rien ne doit écouter sur son port, et les autres services doivent continuer de tourner.

- Solution : `trouve son port avec nc, son PID avec ss -tlnp, son groupe avec ps -o pgid=, puis kill -- -<PGID>`
- Indice 1 (10 s) : ss -tlnp montre le PID de chaque nc ; ps -o pgid= -p PID donne son groupe.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
p=$(grep -l 'FRAGMENT 1/3' /tmp/.np-frag-* | sed 's/.*-//')
ss -Htln | grep -q "127\.0\.0\.1:$p " && exit 1
[ "$(pgrep -cx fragment)" = 2 ] && pgrep -x guichet >/dev/null
```

Résolution automatique (tests) :

```bash
p=$(grep -l 'FRAGMENT 1/3' /tmp/.np-frag-* | sed 's/.*-//')
pid=$(ss -Htlnp | grep "127\.0\.0\.1:$p " | grep -o 'pid=[0-9]*' | head -n 1 | cut -d= -f2)
kill -- "-$(ps -o pgid= -p "$pid" | tr -d ' ')"
sleep 0.3
```

</details>

#### Q5 · Défi réel (sandbox)

Écris ~/net/sonde.sh : il prend un port en argument et affiche la première ligne que renvoie le service sur 127.0.0.1 (avec nc ou /dev/tcp), sans rester bloqué plus de 2 secondes ; si rien n'écoute, il n'affiche rien. Rends-le exécutable.

- Solution : `#!/bin/bash puis timeout 2 nc 127.0.0.1 "$1" </dev/null 2>/dev/null | head -n 1`
- Indice 1 (10 s) : $1 est le port reçu ; timeout 2 coupe une commande trop longue.
- Indice 2 (20 s) : nc 127.0.0.1 "$1" </dev/null : rien à envoyer, on écoute juste la réponse.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -x ~/net/sonde.sh ] || exit 1
grep -Eq 'nc|/dev/tcp' ~/net/sonde.sh || exit 1
p=$(for f in /tmp/.np-frag-*; do q=${f##*-}; ss -Htln | grep -q "127\.0\.0\.1:$q " && echo "$q"; done | shuf -n 1)
[ -n "$p" ] || exit 1
[ "$(timeout 3 ~/net/sonde.sh "$p" 2>/dev/null | head -n 1)" = "$(cat "/tmp/.np-frag-$p")" ] || exit 1
[ -z "$(timeout 3 ~/net/sonde.sh $((RANDOM % 900 + 1000)) 2>/dev/null)" ]
```

Résolution automatique (tests) :

```bash
printf '#!/bin/bash\ntimeout 2 nc 127.0.0.1 "$1" </dev/null 2>/dev/null | head -n 1\n' > ~/net/sonde.sh
chmod +x ~/net/sonde.sh
```

</details>
