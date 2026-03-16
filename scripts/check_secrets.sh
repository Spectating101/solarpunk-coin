#!/usr/bin/env bash
set -euo pipefail

if command -v gitleaks >/dev/null 2>&1; then
  gitleaks protect --staged --redact --verbose
  exit 0
fi

# Fallback scanner for staged diffs when gitleaks is unavailable.
DIFF_CONTENT="$(git diff --cached -U0)"
if [ -z "$DIFF_CONTENT" ]; then
  exit 0
fi

PATTERN='(AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|ghp_[A-Za-z0-9]{36}|xox[baprs]-[A-Za-z0-9-]{10,}|-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----|PRIVATE_KEY\s*=\s*0x[0-9a-fA-F]{64})'

if printf '%s\n' "$DIFF_CONTENT" | rg -n "$PATTERN" >/tmp/secret_scan_hits.txt 2>/dev/null; then
  echo "Potential secret detected in staged changes:"
  cat /tmp/secret_scan_hits.txt
  echo "Commit aborted. Remove secrets or use secure secret management."
  exit 1
fi

exit 0
