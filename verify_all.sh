#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}☀️  SOLARPUNK PROTOCOL: SYSTEM VERIFICATION ☀️${NC}"
echo "==================================================="

# 1. Check Python Dependencies
echo -e "\n[1/4] Checking Risk Engine Dependencies..."
if python3 -c "import numpy; import pandas" >/dev/null 2>&1; then
    echo -e "${GREEN}✔ Python Environment OK${NC}"
else
    echo -e "${RED}✘ Missing Python Libs. Run: pip install numpy pandas${NC}"
    exit 1
fi

# 2. Run Risk Engine Simulation
echo -e "\n[2/4] Verifying Pricing Logic (Pillar 2)..."
if python3 scripts/pillar3_engine.py; then
    echo -e "${GREEN}✔ Pricing Engine Verified${NC}"
else
    echo -e "${RED}✘ Pricing Engine Failed${NC}"
    exit 1
fi

# 3. Run Smart Contract Tests
echo -e "\n[3/4] Verifying Solvency Contract (Pillar 3)..."
# Using npx hardhat test but suppressing verbose output for cleanliness
if npx hardhat test; then
    echo -e "${GREEN}✔ Smart Contracts Verified (Solvency & Settlement)${NC}"
else
    echo -e "${RED}✘ Contract Tests Failed${NC}"
    exit 1
fi

# 4. Check Frontend Build
echo -e "\n[4/4] Verifying Frontend Build..."
cd frontend
if npm run build >/dev/null 2>&1; then
    echo -e "${GREEN}✔ DApp Build Successful${NC}"
else
    echo -e "${RED}✘ Frontend Build Failed${NC}"
    exit 1
fi

echo -e "\n==================================================="
echo -e "${GREEN}✅ SYSTEM INTEGRITY CONFIRMED. MVP/TESTNET READY.${NC}"
echo "==================================================="
