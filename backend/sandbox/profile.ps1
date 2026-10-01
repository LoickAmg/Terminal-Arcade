# Profil PowerShell de la sandbox Terminal Arcade (tous les utilisateurs).

# Commandes du jeu, comme dans bash.
function hint { arcade hint }
function skip { arcade skip }
function quit { arcade quit }
function verify { arcade verify }
function clock { arcade clock }

# Invite, et sabotages du mode Chaos déposés par le jeu : lus une seule
# fois, à l'invite suivante.
function prompt {
  $hostile = Join-Path $HOME '.cache/arcade/hostile.ps1'
  if (Test-Path $hostile) {
    . $hostile
    Remove-Item $hostile -Force
  }
  $where = $PWD.Path.Replace($HOME, '~')
  "`e[32magent`e[0m@`e[36msandbox`e[0m:`e[34m$where`e[0m PS> "
}
