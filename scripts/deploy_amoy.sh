#!/bin/bash

# 🚀 TESTNET DEPLOYMENT SCRIPT
# Deploys SolarPunkCoin to Polygon Amoy testnet in one command

set -e  # Exit on any error

echo "=================================="
echo "SolarPunk Protocol - Amoy Deploy"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo ""
    echo "Create .env with:"
    echo "  PRIVATE_KEY=your_wallet_private_key"
    echo "  RESERVE_TOKEN_ADDRESS=0x0FA8781a83E46826621b3BC094Ea2A0212e71B23  # Mumbai USDC"
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
echo "   Get it here: https://faucet.polygon.technology/"
echo ""
read -p "Press Enter when ready to deploy..."

# Compile contracts
echo ""
echo "📝 Compiling contracts..."
npx hardhat compile --quiet

# Deploy to Amoy
echo ""
echo "🚀 Deploying to Polygon Amoy testnet..."
echo ""

DEPLOY_OUTPUT=$(npx hardhat run scripts/deploy.js --network amoy)
echo "$DEPLOY_OUTPUT"

# Extract contract address
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "SolarPunkCoin deployed to:" | awk '{print $NF}')

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo ""
    echo "❌ Deployment failed - no contract address found"
    exit 1
fi

# Save to file
echo "$CONTRACT_ADDRESS" > .testnet_address
echo ""
echo "✅ Contract address saved to .testnet_address"

# Generate Amoy PolygonScan link
POLYGONSCAN_URL="https://amoy.polygonscan.com/address/$CONTRACT_ADDRESS"

echo ""
echo "=================================="
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "=================================="
echo ""
echo "📍 Contract Address:"
echo "   $CONTRACT_ADDRESS"
echo ""
echo "🔍 Amoy PolygonScan:"
echo "   $POLYGONSCAN_URL"
echo ""
echo "📋 Next Steps:"
echo "   1. Verify on Amoy PolygonScan:"
echo "      npx hardhat verify --network amoy $CONTRACT_ADDRESS"
echo ""
echo "   2. Update README.md with this address"
echo ""
echo "   3. Test the contract:"
echo "      npx hardhat test --network amoy"
echo ""
echo "=================================="
