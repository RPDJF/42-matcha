#!/usr/bin/env bash

missing=0

if ! command -v node >/dev/null 2>&1; then
    echo "ERROR: Node.js is not installed."
    missing=1
fi

if ! command -v docker >/dev/null 2>&1; then
    echo "ERROR: Docker is not installed."
    missing=1
fi

if [ "$missing" -eq 1 ]; then
    exit 1
fi

mkdir -p .cache

find ./matcha-backend/ \
  \( -wholename '*errors/mod.rs' -o -name 'errors.rs' \) \
  -type f -print0 |
  xargs -0 grep -h -E '#\[|write!' |
  grep -o -E '(".*")' |
  sed 's/^"\(.*\)"$/\1/' |
  jq -Rsc 'split("\n") | map(select(length > 0)) |
    [{sourceLanguage: "english", keys: .}]' \
  > .cache/additional-i18n.json

npm --prefix matcha-frontend run build:translations -- \
  --additional-i18n-file=../.cache/additional-i18n.json