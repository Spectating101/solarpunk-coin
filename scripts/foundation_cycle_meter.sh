#!/usr/bin/env bash
set -euo pipefail
export CYCLE_MINT_MODE=meter
exec "$(dirname "$0")/foundation_cycle.sh"
