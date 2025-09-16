#!/usr/bin/env bash
set -euo pipefail

# SpinRate deploy script
# Usage:
#   ./scripts/deploy.sh              # normal deploy
#   CLEAN=1 ./scripts/deploy.sh      # clean build (clears node_modules and build)
#   BRANCH=main ./scripts/deploy.sh  # deploy a specific branch

REPO_DIR="/var/www/SpinRate"
BRANCH="${BRANCH:-main}"

cd "$REPO_DIR"

if [[ "${CLEAN:-0}" == "1" ]]; then
  echo "[deploy] Clean build: removing node_modules and build/"
  rm -rf node_modules build
fi

# Ensure correct branch and latest code (force reset to remote)
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "[deploy] Fetching origin and checking out $BRANCH"
  git fetch origin --prune
  git checkout "$BRANCH"
  git reset --hard "origin/$BRANCH"
else
  echo "[deploy] Not a git repo in $REPO_DIR" >&2
  exit 1
fi

# Install dependencies using lockfile (npm ci prefers package-lock consistency)
if command -v npm >/dev/null 2>&1; then
  echo "[deploy] Installing dependencies (npm ci)"
  npm ci --no-audit --no-fund
else
  echo "[deploy] npm not found" >&2
  exit 1
fi

# Load environment from .env without printing any values
if [[ -f .env ]]; then
  echo "[deploy] Loading environment from .env"
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

# Build
echo "[deploy] Building"
npm run build

# Start or reload via PM2
if command -v pm2 >/dev/null 2>&1; then
  echo "[deploy] Starting/reloading PM2 app"
  pm2 start ecosystem.config.cjs --only spinrate || true
  pm2 reload spinrate --update-env
  pm2 save
else
  echo "[deploy] pm2 not found. Install with: npm i -g pm2" >&2
  exit 1
fi

echo "[deploy] Done"
