# Catalogue des exercices de Terminal Arcade

Généré automatiquement depuis `shared/levels/` par `npm run export:exercices`.
Ne pas modifier à la main : modifier les fichiers YAML, puis régénérer.

**16 niveaux, 81 questions, 11 variantes.**

| Type de question | Nombre |
| --- | --- |
| Commande | 15 |
| QCM | 4 |
| Piège | 4 |
| Prédire la sortie | 5 |
| Compléter | 3 |
| Défi réel (sandbox) | 50 |

## Vue d'ensemble

| Niveau | Titre | Palier | Arbre | Exécution | Type | Questions | XP |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [fs_nav_01](#fs_nav_01--premiers-pas) | Premiers pas | Script Kiddie | File System Ninja | Navigateur | Classique | 6 | 120 |
| [fs_read_01](#fs_read_01--lire-sans-ouvrir) | Lire sans ouvrir | Script Kiddie | File System Ninja | Navigateur | Classique | 6 | 140 |
| [grep_01](#grep_01--laiguille-dans-la-botte-de-foin) | L'aiguille dans la botte de foin | Script Kiddie | Data Surgeon | Navigateur | Classique | 6 | 160 |
| [sk_rush_01](#sk_rush_01--contre-la-montre) | Contre la montre | Script Kiddie | File System Ninja | Navigateur | Timer | 7 | 180 |
| [sk_chaos_01](#sk_chaos_01--arcade-déraille) | Arcade déraille | Script Kiddie | Data Surgeon | Navigateur | Chaos | 6 | 220 |
| [sa_perms_01](#sa_perms_01--accès-refusé) | Accès refusé | SysAdmin | File System Ninja | Sandbox Docker (bash) | Classique | 5 | 300 |
| [sa_text_01](#sa_text_01--chirurgie-de-logs) | Chirurgie de logs | SysAdmin | Data Surgeon | Sandbox Docker (bash) | Classique | 5 | 320 |
| [sa_pipes_01](#sa_pipes_01--tuyauterie) | Tuyauterie | SysAdmin | File System Ninja | Sandbox Docker (bash) | Classique | 5 | 320 |
| [gg_git_01](#gg_git_01--premier-commit) | Premier commit | SysAdmin | Git-Gud | Sandbox Docker (bash) | Classique | 6 | 340 |
| [gg_branch_01](#gg_branch_01--conflits-et-remises) | Conflits et remises | SysAdmin | Git-Gud | Sandbox Docker (bash) | Classique | 5 | 360 |
| [ps_basics_01](#ps_basics_01--objets-pas-du-texte) | Objets, pas du texte | SysAdmin | PowerShell | Sandbox Docker (PowerShell) | Classique | 5 | 360 |
| [rw_proc_01](#rw_proc_01--processus-fantôme) | Processus fantôme | Root Wizard | System Overlord | Sandbox Docker (bash) | Classique | 4 | 380 |
| [rw_script_01](#rw_script_01--automatise-tout) | Automatise tout | Root Wizard | System Overlord | Sandbox Docker (bash) | Classique | 4 | 400 |
| [gg_history_01](#gg_history_01--machine-à-remonter-le-temps) | Machine à remonter le temps | Root Wizard | Git-Gud | Sandbox Docker (bash) | Classique | 4 | 420 |
| [gg_bisect_01](#gg_bisect_01--le-commit-coupable) | Le commit coupable | Root Wizard | Git-Gud | Sandbox Docker (bash) | Classique | 3 | 500 |
| [ps_pipeline_01](#ps_pipeline_01--le-pipeline-des-objets) | Le pipeline des objets | Root Wizard | PowerShell | Sandbox Docker (PowerShell) | Classique | 4 | 420 |

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

#### Q2 · Commande

Liste le contenu du dossier courant.

- Réponses acceptées : `ls`
- Sortie simulée : `notes.txt  outils  rapport.md`
- Indice 1 (10 s) : Deux lettres, abréviation de « list ».

#### Q3 · Commande

Certains fichiers commencent par un point et restent invisibles. Liste TOUT le contenu, fichiers cachés compris.

- Réponses acceptées : `ls -a`, `ls -A`, `ls --all`, `ls -la`
- Sortie simulée : `.  ..  .secret  notes.txt  outils  rapport.md`
- Explication : Un nom qui commence par un point est caché. -a les montre tous, -A aussi mais sans . et ..
- Indice 1 (10 s) : Cherche l'option « all ».

#### Q3 — variante (sabotage « mutation ») · Commande

Liste le contenu du dossier courant en format long : droits, taille, date.

- Réponses acceptées : `ls -l`
- Sortie simulée : `-rw-r--r-- 1 agent agent 812 oct.  1 09:12 notes.txt`

#### Q4 · QCM

Que fait cd .. ?

1. **Remonte au dossier parent** ✔
2. Revient au dossier personnel
3. Liste les dossiers
4. Ne fait rien

- Explication : .. désigne toujours le dossier parent. Pour revenir au dossier personnel : cd tout court, ou cd ~.

#### Q5 · Prédire la sortie

Qu'affiche la dernière commande ?

```bash
cd /var/log
cd ..
pwd
```

- Réponses acceptées : `/var`
- Indice 1 (10 s) : Remonte d'un cran depuis /var/log.

#### Q6 · Commande

Entre dans le dossier outils.

- Réponses acceptées : `cd outils`, `cd ./outils`
- Indice 1 (10 s) : cd suivi du nom du dossier.

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
| Débloque | grep_01 |

Lire un fichier entier, le début, la fin, ou le parcourir page par page.

#### Q1 · Commande

Affiche tout le contenu de notes.txt.

- Réponses acceptées : `cat notes.txt`
- Sortie simulée : `Mot de passe Wi-Fi : changé lundi ⏎ Penser à vider /tmp`
- Indice 1 (10 s) : La commande la plus courte pour afficher un fichier : trois lettres.

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

#### Q5 · Prédire la sortie

liste.txt contient exactement 3 lignes. Qu'affiche cette commande ?

```bash
wc -l < liste.txt
```

- Réponses acceptées : `3`
- Explication : Avec <, wc lit l'entrée standard et n'affiche que le nombre, sans le nom du fichier.
- Indice 1 (10 s) : wc -l compte les lignes.

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

#### Q1 · Défi réel (sandbox)

Le script deploy.sh refuse de se lancer (Permission denied). Rends-le exécutable.

- Solution : `chmod +x deploy.sh`
- Indice 1 (10 s) : chmod ajoute un droit avec +, et x veut dire exécution.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
cat > ~/deploy.sh <<'EOF'
#!/bin/bash
echo "Déploiement OK. Code : $(cat ~/.deploy_code 2>/dev/null || echo '(aucun)')"
EOF
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
| Débloque | sa_pipes_01 |

Les réponses chiffrées s'envoient avec submit <réponse>.

<details><summary>Préparation du niveau</summary>

```bash
for i in $(seq 1 200); do
  echo "2026-10-01 10:$(printf %02d $((i % 60))) 10.0.0.$((i % 7 + 1)) GET /page$((i % 5)) 200"
done > ~/access.log
for i in 1 2 3 4 5; do echo "2026-10-01 10:59 10.0.0.3 GET /favori 200"; done >> ~/access.log
echo "2026-10-01 11:00 10.0.0.66 POST /admin 403" >> ~/access.log
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

- Solution : `grep 403 access.log, puis submit 10.0.0.66`

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
answer-is 10.0.0.66
```

Résolution automatique (tests) :

```bash
submit 10.0.0.66
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
| Débloque | gg_git_01, ps_basics_01 |

Redirections et pipes : >, >>, 2> et |.

#### Q1 · Défi réel (sandbox)

Enregistre la liste des fichiers de /etc dans etc.txt.

- Solution : `ls /etc > etc.txt`
- Indice 1 (10 s) : > envoie la sortie d'une commande dans un fichier.

<details><summary>Préparation et arbitre</summary>

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ -s ~/etc.txt ] && grep -qx passwd ~/etc.txt
```

Résolution automatique (tests) :

```bash
ls /etc > ~/etc.txt
```

</details>

#### Q2 · Défi réel (sandbox)

Ajoute la ligne FIN à la fin de etc.txt, sans effacer ce qu'il contient.

- Solution : `echo FIN >> etc.txt`
- Indice 1 (10 s) : >> ajoute à la fin au lieu de remplacer.

<details><summary>Préparation et arbitre</summary>

Préparation :

```bash
[ -s ~/etc.txt ] || ls /etc > ~/etc.txt
```

Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :

```bash
[ "$(tail -n 1 ~/etc.txt)" = FIN ] && grep -qx passwd ~/etc.txt
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
grep -q nexistepas ~/erreurs.log 2>/dev/null
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
[ "$(git -C ~/projet rev-list --count main..feature 2>/dev/null)" -ge 1 ]
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
| Débloque | gg_history_01 |

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
head -c 2000000 /dev/zero > ~/data/gros.bin
echo "petit" > ~/data/a.txt
echo "moyen moyen" > ~/data/b.txt
printf '{"nom": "api", "port": 8443, "debug": false}\n' > ~/config.json
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
answer-is gros.bin
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
answer-is a.txt
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
answer-is 8443
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
head -n 1 ~/fichiers.csv 2>/dev/null | grep -q "\"Name\",\"Length\"" && grep -q gros.bin ~/fichiers.csv
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
jq -e ".debug == true and .port == 8443" ~/config.json >/dev/null 2>&1
```

Résolution automatique (tests) :

```bash
pwsh -NoProfile -NonInteractive -Command '$c = Get-Content ~/config.json | ConvertFrom-Json; $c.debug = $true; $c | ConvertTo-Json | Set-Content ~/config.json'
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
| Débloque | rw_script_01 |

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
pgrep -x virus >/dev/null || setsid nohup ~/.bin/virus 100000 >/dev/null 2>&1 &
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
pgrep -x virus >/dev/null || setsid nohup ~/.bin/virus 100000 >/dev/null 2>&1 &
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
- Indice 1 (10 s) : ${f%.txt} retire l'extension .txt du nom contenu dans $f.

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
[ "$(tr -d " \n" < ~/total.txt 2>/dev/null)" = 1275 ]
```

Résolution automatique (tests) :

```bash
awk '{s += $1} END {print s}' ~/nombres.txt > ~/total.txt
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
| Débloque | gg_bisect_01 |

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
[ -f ~/.arcade/submitted ] || exit 1
s=$(cat ~/.arcade/submitted)
[ ${#s} -ge 7 ] && [ "${bad#"$s"}" != "$bad" ] && exit 0
exit 2
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
- Indice 1 (10 s) : -split découpe une ligne en colonnes ; Group-Object compte les valeurs identiques.

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
