#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is not installed"
  exit 1
fi

echo "[docker-contract-tests] Running Hardhat tests with Node 22 container..."
docker run --rm \
  -v "$ROOT_DIR:/work" \
  -v solarpunk_npm_cache:/root/.npm \
  -w /work \
  node:22-bullseye \
  bash -lc "npm ci && npx hardhat test"

echo "[docker-contract-tests] PASS"
