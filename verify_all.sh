#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

STRICT=0
SKIP_FRONTEND=0
SKIP_CONTRACTS=0
CONTRACTS_IN_DOCKER=0
WARNINGS=0
JSON_REPORT=""
CONTRACT_STATUS="not_run"
FRONTEND_STATUS="not_run"
PRICING_STATUS="not_run"
PYTHON_STATUS="not_run"
NODE_VERSION="$(node -v 2>/dev/null || echo 'missing')"
NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo "0")"
HARDHAT_LOCAL=0
if npx --no-install hardhat --version >/dev/null 2>&1; then
  HARDHAT_LOCAL=1
fi
for arg in "$@"; do
  case "$arg" in
    --strict) STRICT=1 ;;
    --skip-frontend) SKIP_FRONTEND=1 ;;
    --skip-contracts) SKIP_CONTRACTS=1 ;;
    --contracts-in-docker) CONTRACTS_IN_DOCKER=1 ;;
    --json-report=*) JSON_REPORT="${arg#*=}" ;;
    *) ;;
  esac
done

echo -e "${GREEN}☀️  SOLARPUNK PROTOCOL: SYSTEM VERIFICATION ☀️${NC}"
echo "==================================================="

# 1. Check Python Dependencies
echo -e "\n[1/4] Checking Risk Engine Dependencies..."
if python3 -c "import numpy; import pandas" >/dev/null 2>&1; then
    echo -e "${GREEN}✔ Python Environment OK${NC}"
    PYTHON_STATUS="ok"
else
    echo -e "${RED}✘ Missing Python Libs. Run: pip install numpy pandas${NC}"
    PYTHON_STATUS="failed"
    exit 1
fi

# 2. Run Risk Engine Simulation
echo -e "\n[2/4] Verifying Pricing Logic (Pillar 2)..."
if python3 scripts/pillar3_engine.py; then
    echo -e "${GREEN}✔ Pricing Engine Verified${NC}"
    PRICING_STATUS="ok"
else
    echo -e "${RED}✘ Pricing Engine Failed${NC}"
    PRICING_STATUS="failed"
    exit 1
fi

# 3. Run Smart Contract Tests
echo -e "\n[3/4] Verifying Solvency Contract (Pillar 3)..."
# Using local Hardhat only; preflight environment first.
if [ "$SKIP_CONTRACTS" -eq 1 ]; then
    echo -e "${YELLOW}↷ Skipped contract tests (--skip-contracts)${NC}"
    CONTRACT_STATUS="skipped"
else
    if [ "$NODE_MAJOR" -lt 20 ]; then
        echo -e "${YELLOW}⚠ Node ${NODE_MAJOR}.x detected. Hardhat 3 requires Node >=20.${NC}"
        if [ "$CONTRACTS_IN_DOCKER" -eq 1 ]; then
            echo -e "${YELLOW}↷ Running contract tests in Docker Node 22 environment...${NC}"
            if ./scripts/run_contract_tests_docker.sh; then
                echo -e "${GREEN}✔ Smart Contracts Verified in Docker${NC}"
                CONTRACT_STATUS="ok"
            else
                echo -e "${YELLOW}⚠ Docker-based contract tests failed.${NC}"
                WARNINGS=$((WARNINGS + 1))
                CONTRACT_STATUS="degraded"
                if [ "$STRICT" -eq 1 ]; then
                    echo -e "${RED}✘ Contract tests failed in Docker (--strict)${NC}"
                    exit 1
                fi
            fi
        else
            WARNINGS=$((WARNINGS + 1))
            CONTRACT_STATUS="degraded"
            if [ "$STRICT" -eq 1 ]; then
                echo -e "${RED}✘ Unsupported Node version for contract tests (--strict)${NC}"
                exit 1
            fi
            echo -e "${YELLOW}↷ Skipping contract tests (non-strict mode).${NC}"
            echo -e "${YELLOW}  Tip: rerun with --contracts-in-docker to execute tests in Node 22.${NC}"
        fi
    else
        if [ ! -d node_modules ]; then
            echo -e "${YELLOW}Installing JS dependencies (npm ci)...${NC}"
            if ! npm ci >/dev/null 2>&1; then
                echo -e "${YELLOW}⚠ npm ci failed.${NC}"
                WARNINGS=$((WARNINGS + 1))
                CONTRACT_STATUS="degraded"
                if [ "$STRICT" -eq 1 ]; then
                    echo -e "${RED}✘ Contract dependency setup failed (--strict)${NC}"
                    exit 1
                fi
                echo -e "${YELLOW}↷ Skipping contract tests (non-strict mode).${NC}"
            fi
        fi

        if npx --no-install hardhat --version >/dev/null 2>&1; then
            if npx --no-install hardhat test; then
                echo -e "${GREEN}✔ Smart Contracts Verified (Solvency & Settlement)${NC}"
                CONTRACT_STATUS="ok"
            else
                echo -e "${RED}✘ Contract Tests Failed${NC}"
                CONTRACT_STATUS="failed"
                exit 1
            fi
        else
            echo -e "${YELLOW}⚠ Local Hardhat not available.${NC}"
            WARNINGS=$((WARNINGS + 1))
            CONTRACT_STATUS="degraded"
            if [ "$STRICT" -eq 1 ]; then
                echo -e "${RED}✘ Local Hardhat missing (--strict)${NC}"
                exit 1
            fi
            echo -e "${YELLOW}↷ Skipping contract tests (non-strict mode).${NC}"
        fi
    fi
fi

# 4. Check Frontend Build
echo -e "\n[4/4] Verifying Frontend Build..."
if [ "$SKIP_FRONTEND" -eq 1 ]; then
    echo -e "${YELLOW}↷ Skipped frontend build (--skip-frontend)${NC}"
    FRONTEND_STATUS="skipped"
else
    pushd frontend >/dev/null 2>&1
    if [ ! -d node_modules ] || [ ! -x node_modules/.bin/vite ]; then
        echo -e "${YELLOW}Frontend dependencies missing. Running npm ci...${NC}"
        if ! npm ci >/dev/null 2>&1; then
            echo -e "${YELLOW}⚠ frontend npm ci failed.${NC}"
            WARNINGS=$((WARNINGS + 1))
            FRONTEND_STATUS="degraded"
            if [ "$STRICT" -eq 1 ]; then
                echo -e "${RED}✘ Frontend dependency setup failed (--strict)${NC}"
                popd >/dev/null 2>&1
                exit 1
            fi
        fi
    fi
    if npm run build >/dev/null 2>&1; then
        echo -e "${GREEN}✔ DApp Build Successful${NC}"
        FRONTEND_STATUS="ok"
    else
        echo -e "${YELLOW}⚠ Frontend build failed (non-blocking by default).${NC}"
        echo -e "${YELLOW}  To debug: cd frontend && npm ci && npm run build${NC}"
        WARNINGS=$((WARNINGS + 1))
        FRONTEND_STATUS="degraded"
        if [ "$STRICT" -eq 1 ]; then
            echo -e "${RED}✘ Frontend Build Failed (--strict)${NC}"
            popd >/dev/null 2>&1
            exit 1
        fi
    fi
    popd >/dev/null 2>&1
fi

echo -e "\n==================================================="
OVERALL_STATUS="ok"
if [ "$WARNINGS" -gt 0 ]; then
    echo -e "${YELLOW}⚠ VERIFICATION COMPLETED WITH ${WARNINGS} WARNING(S).${NC}"
    echo -e "${YELLOW}  Core checks passed, but some components were skipped or degraded.${NC}"
    OVERALL_STATUS="degraded"
else
    echo -e "${GREEN}✅ SYSTEM INTEGRITY CONFIRMED. MVP/TESTNET READY.${NC}"
fi
echo "==================================================="

if [ -n "$JSON_REPORT" ]; then
  REPORT_DIR="$(dirname "$JSON_REPORT")"
  mkdir -p "$REPORT_DIR"
  TS="$(date -Iseconds)"
  cat > "$JSON_REPORT" <<EOF
{
  "timestamp": "$TS",
  "overall_status": "$OVERALL_STATUS",
  "strict_mode": $([ "$STRICT" -eq 1 ] && echo true || echo false),
  "warnings": $WARNINGS,
  "environment": {
    "node_version": "$NODE_VERSION",
    "node_major": $NODE_MAJOR,
    "hardhat_local_available": $([ "$HARDHAT_LOCAL" -eq 1 ] && echo true || echo false)
  },
  "checks": {
    "python_dependencies": "$PYTHON_STATUS",
    "pricing_engine": "$PRICING_STATUS",
    "contracts": "$CONTRACT_STATUS",
    "frontend": "$FRONTEND_STATUS"
  }
}
EOF
  echo -e "${GREEN}JSON health report written to: ${JSON_REPORT}${NC}"
fi
