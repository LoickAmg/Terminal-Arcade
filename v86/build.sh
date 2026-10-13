#!/usr/bin/env bash
# Construit le Linux des défis réels pour v86 (Docker requis) :
#   v86/out/fs.json        description du système de fichiers 9p
#   v86/out/flat/          fichiers, nommés par empreinte, compressés (zstd)
#   v86/out/state.bin.zst  état mémoire déjà démarré (build-state.mjs)
#
#   bash v86/build.sh       (depuis la racine du dépôt)
set -euo pipefail

cd "$(dirname "$0")/.."
OUT=v86/out
TOOLS=v86/.tools
# Outils de conversion du dépôt v86, à une version fixe.
V86_COMMIT=94faf3d6b19ecabc53a4010aaa24252fa6a162e2
IMAGE=terminal-arcade-v86
CONTAINER=terminal-arcade-v86-export
PY=${PYTHON:-python3}

mkdir -p "$TOOLS"
for tool in fs2json.py copy-to-sha256.py; do
  [ -f "$TOOLS/$tool" ] || curl -fsSL -o "$TOOLS/$tool" "https://raw.githubusercontent.com/copy/v86/$V86_COMMIT/tools/$tool"
done

docker build --platform linux/386 -f v86/Dockerfile -t "$IMAGE" .
docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
docker create --platform linux/386 --name "$CONTAINER" "$IMAGE" >/dev/null
rm -rf "$OUT"
mkdir -p "$OUT/flat"
docker export "$CONTAINER" -o "$OUT/rootfs.tar"
docker rm "$CONTAINER" >/dev/null
tar -f "$OUT/rootfs.tar" --delete ".dockerenv" 2>/dev/null || true

"$PY" "$TOOLS/fs2json.py" --zstd --out "$OUT/fs.json" "$OUT/rootfs.tar"
"$PY" "$TOOLS/copy-to-sha256.py" --zstd "$OUT/rootfs.tar" "$OUT/flat"
rm "$OUT/rootfs.tar"

node v86/build-state.mjs
du -sh "$OUT"
