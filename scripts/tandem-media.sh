#!/bin/zsh
# Builds the Tandem case study's web media in public/tandem/ from the originals:
# the reels at 540px wide (H.264, no audio, about 1 MB each) with a poster frame from 2s in (they fade in from blank),
# and the Sea Point photo cropped to 9:16 with its runners cut out by Apple's Vision.
#
#   scripts/tandem-media.sh [path to the Sea Point photo]
#
# Needs ffmpeg and cwebp (brew install ffmpeg webp) and macOS 14 or later.

set -euo pipefail
ROOT=${0:A:h:h}
OUT=$ROOT/public/tandem
POSTS="$HOME/Library/Mobile Documents/com~apple~CloudDocs/Tandem Posts"
PHOTO=${1:-$HOME/Downloads/IMG_7764.HEIC}
TMP=$(mktemp -d)
trap 'rm -rf $TMP' EXIT
mkdir -p $OUT

reel() {
  ffmpeg -v error -y -i "$POSTS/$1" -an -vf scale=540:-2 -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -crf $3 -preset slow -movflags +faststart "$OUT/$2.mp4"
  ffmpeg -v error -y -ss 2 -i "$POSTS/$1" -vf scale=540:-2 -frames:v 1 -q:v 4 "$OUT/$2.jpg"
  echo "$2.mp4 $(( $(stat -f%z "$OUT/$2.mp4") / 1024 )) KB"
}
reel "Instagram week 02/1 Discover (Reel).mp4" discover 28
reel "Instagram week 02/3 Together (Reel).mp4" together 28
reel "Instagram week 05/1 Poster (Reel).mp4" poster 30

swift $ROOT/scripts/cutout.swift "$PHOTO" $TMP 720 1280
cwebp -quiet -q 80 $TMP/photo.png -o $OUT/sea-point.webp
cwebp -quiet -q 85 -alpha_q 90 $TMP/people.png -o $OUT/sea-point-people.webp
ls -la $OUT
