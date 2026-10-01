# Configuration bash de la sandbox Terminal Arcade.
[ -z "$PS1" ] && return

PS1='\[\e[32m\]agent\[\e[0m\]@\[\e[36m\]sandbox\[\e[0m\]:\[\e[34m\]\w\[\e[0m\]\$ '
HISTFILE=/tmp/.bash_history

alias ls='ls --color=auto'
alias grep='grep --color=auto'

# Commandes du jeu, utilisables directement dans le terminal.
alias hint='arcade hint'
alias skip='arcade skip'
alias quit='arcade quit'
alias verify='arcade verify'
alias clock='arcade clock'

# Mode Chaos : le jeu peut déposer des sabotages (alias, PATH) que le shell
# lit une seule fois, à l'invite suivante.
__arcade_hostile() {
  local f="$HOME/.cache/arcade/hostile.sh"
  if [ -f "$f" ]; then . "$f"; rm -f "$f"; fi
}
PROMPT_COMMAND=__arcade_hostile

if [ -f /usr/share/bash-completion/bash_completion ]; then
  . /usr/share/bash-completion/bash_completion
fi
