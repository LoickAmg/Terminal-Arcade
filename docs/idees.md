# Idées en attente

Idées proposées par les IA lors des vagues 1 et 2 (et quelques-unes des
revues), triées. Statut : **fait**, **en cours**, **retenu** (à faire),
**à creuser** (intéressant mais coûteux ou risqué), **écarté** (avec la
raison).

## Sabotages du mode Chaos

| Idée | Source | Apprend | Statut |
| --- | --- | --- | --- |
| Invite menteuse : l'invite affiche un faux dossier, seul `pwd` dit vrai | Qwen | se méfier de l'affichage, vérifier | **en cours** (`hostile_prompt`) |
| Faux `git log` : un alias cache un commit, on démasque avec `type git`, `unalias` | Mistral | diagnostiquer un shell piégé | retenu (variante de `hostile_alias` pour les niveaux Git) |
| Faux affichage PowerShell : un `.Count` ou un CSV « réparé » mensonger à l'écran | Kimi | réexécuter plutôt que croire | retenu (déclinaison de `falsify_code`) |
| Historique piégé : la flèche ↑ ressort une commande légèrement modifiée | DeepSeek (vague 1) | relire avant Entrée | retenu |
| Faux `type` / `which` : ils mentent sur l'emplacement d'une commande | DeepSeek (vague 1) | `command -v`, `ls -l`, lire le vrai fichier | retenu |
| Clavier QWERTY : la disposition change quelques secondes | Gemini (vague 1) | garder son calme, lire l'écran | retenu (comme `block_key`) |
| `$HOME` piégé : la variable pointe ailleurs | Gemini | chemins absolus, `/etc/passwd` | retenu |
| Terminal gelé par Ctrl+S, à rouvrir avec Ctrl+Q | Qwen | le contrôle de flux du terminal | à creuser (xterm ne gère pas XOFF de la même façon) |
| Saboteur silencieux : un processus retire les droits d'un fichier en boucle | Qwen | trouver la cause avant de réparer | retenu (plutôt un défi de niveau) |
| Frappe fantôme : les lettres se transforment pendant la frappe | Gemini | lire l'écran | à creuser (frustrant si mal dosé) |
| Mode miroir : tout s'affiche de droite à gauche | Gemini | taper sans regarder | écarté (lisibilité, accessibilité) |
| « Alias russe » : un `rm -rf` au hasard | Qwen (vague 1) | — | écarté (détruit le travail du joueur, contraire à la règle « gérable et soluble ») |

## Défis et niveaux

| Idée | Source | Statut |
| --- | --- | --- |
| Blob Git orphelin à retrouver avec `git fsck --lost-found` | Mistral | **en cours** (`gg_fouille_01`) |
| Flag éparpillé dans les messages de commit (`git log --grep`, `--format`) | Mistral | **en cours** (`gg_fouille_01`) |
| `Get-Member` détective : une propriété au nom inconnu | Kimi | **en cours** (`ps_objets_01`) |
| `Format-Table` assassin : un export cassé par `Format-*` | Kimi | **en cours** (`ps_objets_01`) |
| Ports leurres, message fragmenté, service à plusieurs connexions | ChatGPT | fait (`np_fragments_01`) |
| Service qui attend une commande (requête et réponse) | prompt v2 | fait (`np_fragments_01`, le guichet) |
| Flag en trois morceaux sur trois ports | DeepSeek (vague 1) | fait (`np_fragments_01`) |
| Fausse piste dans l'historique : une commande dangereuse à retirer (`history -d`) | Qwen | retenu |
| Sortie double : distinguer stdout et stderr | ChatGPT (vague 1) | retenu |
| Dossier leurre : des noms presque identiques, un seul correspond au motif | ChatGPT (vague 1) | retenu |
| Journal bruité : des lignes leurres au même format que l'événement cherché | ChatGPT (vague 1) | retenu |
| Fichier qui se dérobe : un alias `cat` piégé, contourné par `stat` ou `find` | Qwen | retenu (avec les sabotages hostiles) |

## Types de questions et mécaniques

| Idée | Source | Statut |
| --- | --- | --- |
| « Assembler » : remettre les blocs d'un pipeline dans l'ordre (tactile) | cahier des charges, DeepSeek | retenu |
| Preuve d'action : quelle commande prouve que l'objectif est atteint ? | ChatGPT (vague 1) | retenu (QCM) |
| Commande compacte : afficher après réussite la solution la plus courte | ChatGPT (vague 1) | retenu |
| Le chrono menteur qui a raison : seul `clock` dit vrai | DeepSeek (vague 1) | fait (`time_freeze`, `time_fluctuate`, `clock`) |
| Pipeline qui se mélange après validation | DeepSeek (vague 1) | à creuser (avec « assembler ») |
| Bombe logique, historique Git corrompu | Gemini (vague 1) | à creuser |
