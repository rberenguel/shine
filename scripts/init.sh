#!/bin/bash
set -e

PROJECT_NAME="${1:-untitled}"
DEST="${2:-${HOME}/.pi/shine}/${PROJECT_NAME}"

mkdir -p "${DEST}"
cp "$(dirname "$0")/../templates/scaffold.html" "${DEST}/index.html"

echo "Created ${DEST}/"
echo "Open ${DEST}/index.html to start building."
