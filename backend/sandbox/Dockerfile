# Image des défis réels de Terminal Arcade. Le conteneur tourne sans réseau,
# sans privilèges, avec un système de fichiers en lecture seule : seuls le
# dossier personnel, /tmp et /srv sont inscriptibles (montés en mémoire par
# le serveur au lancement). ss (iproute2) et nc (netcat-openbsd) servent à
# l'arbre Network Phantom : sans réseau, ils n'atteignent que 127.0.0.1.
FROM debian:bookworm-slim

ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 TERM=xterm-256color

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      bash bash-completion coreutils findutils grep sed gawk less file tree \
      procps psmisc jq git tar gzip bzip2 xz-utils nano vim-tiny bc \
 && rm -rf /var/lib/apt/lists/* \
 && useradd --create-home --uid 1000 --shell /bin/bash agent

# PowerShell (arbre PowerShell). Paquet officiel pour amd64 ; l'outil de
# téléchargement est retiré une fois l'installation faite.
ARG PWSH_VERSION=7.6.6
ENV POWERSHELL_TELEMETRY_OPTOUT=1 POWERSHELL_UPDATECHECK=Off DOTNET_CLI_TELEMETRY_OPTOUT=1
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates \
 && curl -fsSL -o /tmp/pwsh.deb \
      "https://github.com/PowerShell/PowerShell/releases/download/v${PWSH_VERSION}/powershell_${PWSH_VERSION}-1.deb_amd64.deb" \
 && apt-get install -y --no-install-recommends /tmp/pwsh.deb \
 && apt-get purge -y curl && apt-get autoremove -y \
 && rm -rf /var/lib/apt/lists/* /tmp/pwsh.deb

# Outils de l'arbre Network Phantom. jq est retiré : il servait de raccourci
# à un exercice PowerShell. Couche à part, pour garder les précédentes en cache.
RUN apt-get update \
 && apt-get install -y --no-install-recommends iproute2 netcat-openbsd \
 && apt-get purge -y jq && apt-get autoremove -y \
 && rm -rf /var/lib/apt/lists/*

COPY --chmod=755 submit arcade answer-is answer-prefix-of /usr/local/bin/
COPY bash.bashrc /etc/bash.bashrc
COPY profile.ps1 /opt/microsoft/powershell/7/profile.ps1

USER agent
WORKDIR /home/agent
CMD ["sleep", "infinity"]
