# Image des défis réels de Terminal Arcade. Le conteneur tourne sans réseau,
# sans privilèges, avec un système de fichiers en lecture seule : seuls le
# dossier personnel, /tmp et /srv sont inscriptibles (montés en mémoire par
# le serveur au lancement).
FROM debian:bookworm-slim

ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 TERM=xterm-256color

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      bash bash-completion coreutils findutils grep sed gawk less file tree \
      procps psmisc jq git tar gzip bzip2 xz-utils nano vim-tiny bc \
 && rm -rf /var/lib/apt/lists/* \
 && useradd --create-home --uid 1000 --shell /bin/bash agent

COPY --chmod=755 submit arcade answer-is /usr/local/bin/
COPY bash.bashrc /etc/bash.bashrc

USER agent
WORKDIR /home/agent
CMD ["sleep", "infinity"]
