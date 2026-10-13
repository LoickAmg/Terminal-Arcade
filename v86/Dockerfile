# Linux des défis réels, exécuté dans le navigateur du joueur par v86 (un PC
# x86 32 bits émulé en WebAssembly). Même outillage que l'image Docker
# (backend/sandbox), sans PowerShell : il n'existe pas en 32 bits.
#
# Construit par v86/build.sh (contexte : la racine du dépôt), qui en tire un
# système de fichiers 9p et un état mémoire déjà démarré.
FROM docker.io/i386/alpine:3.22

ENV KERNEL=virt

RUN apk add --no-cache \
      openrc alpine-base agetty alpine-conf linux-$KERNEL linux-firmware-none \
      bash bash-completion coreutils findutils grep sed gawk less file tree \
      procps-ng psmisc git tar gzip bzip2 xz nano vim bc \
      iproute2 netcat-openbsd util-linux-misc

# jq : le JSON des niveaux bash qui doublent l'arbre PowerShell (absent de
# l'image Docker, où il servirait de raccourci aux exercices PowerShell).
RUN apk add --no-cache jq

# Le joueur : « agent », comme dans le conteneur Docker.
RUN adduser -D -u 1000 -s /bin/bash agent \
 && passwd -l root \
 && echo sandbox > /etc/hostname

# Console du joueur sur le premier port série (connexion automatique),
# canal de contrôle du jeu sur le second. Pas d'écran : rien sur tty1.
RUN sed -i '/^tty[0-9]/d' /etc/inittab \
 && echo 'ttyS0::respawn:/sbin/agetty --autologin agent --noclear -s ttyS0 115200 xterm-256color' >> /etc/inittab \
 && echo 'ttyS1::respawn:/usr/local/sbin/arcade-ctl' >> /etc/inittab

# Boucle locale (arbre Network Phantom : nc et ss sur 127.0.0.1).
RUN printf 'auto lo\niface lo inet loopback\n' > /etc/network/interfaces

# https://wiki.alpinelinux.org/wiki/Alpine_Linux_in_a_chroot#Preparing_init_services
RUN for i in devfs dmesg mdev hwdrivers; do rc-update add $i sysinit; done \
 && for i in modules sysctl hostname bootmisc localmount networking; do rc-update add $i boot; done \
 && rc-update add killprocs shutdown

# Dossier personnel, /tmp et /srv en mémoire (localmount, au démarrage).
COPY v86/fstab /etc/fstab

COPY --chmod=755 backend/sandbox/submit backend/sandbox/arcade backend/sandbox/answer-is backend/sandbox/answer-prefix-of /usr/local/bin/
COPY backend/sandbox/bash.bashrc /etc/bash/bashrc
COPY --chmod=755 v86/arcade-ctl v86/arcade-worker /usr/local/sbin/
# Le dossier personnel est vide à chaque démarrage : la configuration du
# shell de connexion vit dans /etc/profile.d.
COPY v86/profile /etc/profile.d/arcade.sh

# Fins de ligne Unix, même si le dépôt a été cloné sous Windows.
RUN sed -i 's/\r$//' /etc/fstab /usr/local/sbin/arcade-ctl /usr/local/sbin/arcade-worker /etc/profile.d/arcade.sh /etc/bash/bashrc \
      /usr/local/bin/submit /usr/local/bin/arcade /usr/local/bin/answer-is /usr/local/bin/answer-prefix-of

# Démarrage : modules 9p dans l'initramfs.
RUN mkinitfs -F "base virtio 9p" $(cat /usr/share/kernel/$KERNEL/kernel.release)

# Les niveaux copient sleep et yes sous un autre nom (virus, miner…) pour
# créer des processus à traquer. Sous Alpine, ce sont des liens vers le
# programme unique coreutils, qui refuserait un nom inconnu : on les
# remplace par des scripts, qui gardent le nom sous lequel on les copie.
# (Copiés à part puis déplacés : un COPY sur le lien écraserait coreutils.)
COPY v86/sleep v86/yes /tmp/arcade/
RUN rm /bin/sleep /usr/bin/yes \
 && sed 's/\r$//' /tmp/arcade/sleep > /bin/sleep \
 && sed 's/\r$//' /tmp/arcade/yes > /usr/bin/yes \
 && chmod 755 /bin/sleep /usr/bin/yes \
 && rm -r /tmp/arcade
