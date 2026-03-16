#!/usr/bin/env bash
set -euo pipefail

git config core.hooksPath .githooks
chmod +x .githooks/pre-commit scripts/check_secrets.sh
echo "Git hooks configured. Pre-commit secret scan is now active."
