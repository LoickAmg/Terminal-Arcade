# Catalogue des exercices de Terminal Arcade

Généré automatiquement depuis `shared/levels/` par `npm run export:exercices`.
Ne pas modifier à la main : modifier les fichiers YAML, puis régénérer.

**25 niveaux, 127 questions, 44 variantes.**

| Type de question | Nombre |
| --- | --- |
| Commande | 20 |
| QCM | 7 |
| Piège | 7 |
| Prédire la sortie | 6 |
| Compléter | 3 |
| Défi réel (sandbox) | 84 |

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
| [rw_proc_01](#rw_proc_01--processus-fantôme) | Processus fantôme | Root Wizard | System Overlord | Sandbox Docker (bash) | Classique | 4 | 380 |
| [rw_script_01](#rw_script_01--automatise-tout) | Automatise tout | Root Wizard | System Overlord | Sandbox Docker (bash) | Classique | 4 | 400 |
| [gg_history_01](#gg_history_01--machine-à-remonter-le-temps) | Machine à remonter le temps | Root Wizard | Git-Gud | Sandbox Docker (bash) | Classique | 4 | 420 |
| [gg_bisect_01](#gg_bisect_01--le-commit-coupable) | Le commit coupable | Root Wizard | Git-Gud | Sandbox Docker (bash) | Classique | 3 | 500 |
| [ps_pipeline_01](#ps_pipeline_01--le-pipeline-des-objets) | Le pipeline des objets | Root Wizard | PowerShell | Sandbox Docker (PowerShell) | Classique | 4 | 420 |
| [rw_shellcraft_01](#rw_shellcraft_01--scripts-résistants) | Scripts résistants | Root Wizard | System Overlord | Sandbox Docker (bash) | Classique | 5 | 460 |
| [rw_awk_01](#rw_awk_01--awk-sans-filet) | awk sans filet | Root Wizard | Data Surgeon | Sandbox Docker (bash) | Classique | 5 | 420 |
| [gg_workflow_01](#gg_workflow_01--historique-propre) | Historique propre | Root Wizard | Git-Gud | Sandbox Docker (bash) | Classique | 4 | 480 |

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

- Solution : `git merge rouge, corrige app.txt (ou git checkout --theirs app.txt), git add app.txt, git commit`
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
cd ~/appli && echo "brouillon à finir" >> notes.txt
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

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~/appli && [ -z "$(git stash list)" ] && grep -q "brouillon à finir" notes.txt
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
| Débloque | ps_pipeline_01 |

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
head -n 1 ~/fichiers.csv 2>/dev/null | grep -q "\"Name\",\"Length\"" && grep -q "\.bin\"" ~/fichiers.csv
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
[ "$(git -C ~/site cat-file -t v1.0.0 2>/dev/null)" = tag ] && [ "$(git -C ~/site tag -l --format="%(contents:subject)" v1.0.0)" = "Première version" ]
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
[ "$(git -C ~/site cat-file -t v0.9.0-beta 2>/dev/null)" = tag ] && [ "$(git -C ~/site tag -l --format="%(contents:subject)" v0.9.0-beta)" = "Bêta" ]
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
! pgrep -x gardien >/dev/null && ! pgrep -x virus >/dev/null
```

Résolution automatique (tests) :

```bash
pkill -x gardien; sleep 0.3; pkill -x virus
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

#### Q3 · Défi réel (sandbox)

Écris un script compte.sh qui affiche le nombre de lignes du fichier passé en argument, et rends-le exécutable.

- Solution : `printf '#!/bin/bash\nwc -l < "$1"\n' > compte.sh && chmod +x compte.sh`
- Indice 1 (10 s) : $1 contient le premier argument du script ; wc -l < fichier affiche juste le nombre.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
cd ~ && [ -x compte.sh ] && printf 'a\nb\nc\n' > /tmp/trois && out=$(./compte.sh /tmp/trois) && [ "${out%% *}" = 3 ]
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
[ "$(git -C ~/journal log -1 --format=%s)" = "jour 8" ] && [ "$(git -C ~/journal branch --show-current)" = main ]
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

Select-String, Group-Object, ForEach-Object, Measure-Object.

<details><summary>Préparation du niveau</summary>

```bash
mkdir -p ~/rapports
for i in $(seq 1 30); do
  if [ $((i % 4)) = 0 ]; then lvl=ERROR; else lvl=INFO; fi
  echo "2026-10-02 10:$(printf %02d "$i") $lvl service$((i % 3))" >> ~/app.log
done
for m in janvier fevrier mars; do echo "$m" > ~/rapports/$m.txt; done
seq 1 20 > ~/valeurs.txt
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

#### Q4 · Défi réel (sandbox)

Écris dans somme.txt la somme des nombres de valeurs.txt (Measure-Object).

- Solution : `(Get-Content valeurs.txt | Measure-Object -Sum).Sum | Set-Content somme.txt`
- Indice 1 (10 s) : Measure-Object -Sum additionne ; .Sum lit le résultat.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(tr -d " \r\n" < ~/somme.txt 2>/dev/null)" = 210 ]
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
  && ! git cat-file -e main:brouillon.txt 2>/dev/null && ! git cat-file -e main:essai.txt 2>/dev/null
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
