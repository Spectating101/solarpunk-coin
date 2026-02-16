#!/bin/bash

# 🚀 TESTNET DEPLOYMENT SCRIPT (AMOY)
# Deploys full stack (MockUSDC + SolarPunkCoin + SolarPunkOption) to Polygon Amoy.
# Canonical receipt output: state/deployments/amoy_full_deploy.json

set -e  # Exit on any error

echo "=================================="
echo "SolarPunk Protocol - Amoy Full Deploy"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo ""
    echo "Create .env with at least:"
    echo "  PRIVATE_KEY=your_wallet_private_key"
    echo "  POLYGON_AMOY_RPC=your_rpc_url  # recommended, avoids public RPC blocks"
    echo ""
    exit 1
fi

# Source .env
source .env

# Check if PRIVATE_KEY is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY not set in .env"
    exit 1
fi

# Check if wallet has funds
echo "🔍 Checking wallet balance..."
WALLET_ADDRESS=$(npx hardhat run --network amoy scripts/get_wallet.js 2>/dev/null || echo "unknown")

if [ "$WALLET_ADDRESS" != "unknown" ]; then
    echo "   Wallet: $WALLET_ADDRESS"
else
    echo "   ⚠️  Could not determine wallet address"
fi

echo ""
echo "💡 Need Amoy testnet POL?"
echo "   https://www.alchemy.com/faucets/polygon-amoy"
echo ""
read -p "Press Enter when ready to deploy..."

# Compile contracts
echo ""
echo "📝 Compiling contracts..."
npx hardhat compile --quiet

# Deploy to Amoy
echo ""
echo "🚀 Deploying full stack to Polygon Amoy testnet..."
echo ""

DEPLOY_OUTPUT=$(npx hardhat run scripts/deploy_testnet_full.js --network amoy)
echo "$DEPLOY_OUTPUT"

# Receipt path (written by deploy_testnet_full.js)
RECEIPT_FILE="state/deployments/amoy_full_deploy.json"

echo ""
echo "=================================="
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "=================================="
echo ""
echo "📦 Receipt:"
echo "   $RECEIPT_FILE"
echo ""
echo "📋 Next Steps:"
echo "   1. (Optional) Verify contracts on Amoy PolygonScan (see deploy output)"
echo "   2. Build evidence receipt + attempt on-chain confirmation:"
echo "      python3 scripts/build_deployment_receipt.py --network amoy"
echo "      python3 scripts/confirm_deployment_onchain.py --receipt state/deployments/amoy_receipt.json"
echo "      python3 scripts/validate_deployment_receipt.py --strict"
echo ""
echo "=================================="
