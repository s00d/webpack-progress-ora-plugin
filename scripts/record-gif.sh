#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

npm run build -s

TAPE="$(mktemp /tmp/webpack-demo.XXXXXX.tape)"
sed "s|{{PWD}}|$ROOT|g" "$ROOT/scripts/demo.tape" > "$TAPE"

vhs "$TAPE" -o "$ROOT/image.gif"
rm -f "$TAPE"

# Optimize GIF size while keeping colors readable.
if command -v ffmpeg >/dev/null 2>&1; then
  PALETTE="$(mktemp /tmp/webpack-palette.XXXXXX.png)"
  ffmpeg -y -i "$ROOT/image.gif" -vf "fps=15,scale=900:-1:flags=lanczos,palettegen=stats_mode=diff" "$PALETTE" >/dev/null 2>&1
  ffmpeg -y -i "$ROOT/image.gif" -i "$PALETTE" -lavfi "fps=15,scale=900:-1:flags=lanczos,paletteuse=dither=bayer:bayer_scale=3" "$ROOT/image.opt.gif" >/dev/null 2>&1
  mv "$ROOT/image.opt.gif" "$ROOT/image.gif"
  rm -f "$PALETTE"
fi

ls -lh "$ROOT/image.gif"
