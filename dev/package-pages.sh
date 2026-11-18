#!/bin/sh
set -eu
cd "$(dirname "$0")/.."

mkdir -p .wrangler
stage=$(mktemp -d .wrangler/em-pocket-stage.XXXXXXXX)
trap 'rm -rf "$stage"' EXIT
git -c core.quotePath=false ls-files -- assets/ > "$stage/assets-list"
mkdir -p "$stage/site"
cp index.html sw.js manifest.json robots.txt 404.html _headers .htaccess "$stage/site/"
while IFS= read -r file; do
    if [ ! -f "$file" ] || [ -L "$file" ]; then
        printf 'Unexpected runtime asset: %s\n' "$file" >&2
        exit 1
    fi
    mkdir -p "$stage/site/$(dirname "$file")"
    cp "$file" "$stage/site/$file"
done < "$stage/assets-list"

rm -rf .wrangler/em-pocket-pages
mv "$stage/site" .wrangler/em-pocket-pages
