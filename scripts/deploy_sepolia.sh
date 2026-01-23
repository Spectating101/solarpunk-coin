#!/bin/bash
# Deploy SolarPunk contracts to Sepolia testnet

set -e

echo "🌐 Deploying to Sepolia Testnet..."

# Check if .env exists with PRIVATE_KEY
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Run: cp .env.example .env"
    echo "Then add your PRIVATE_KEY to .env"
    exit 1
fi

if ! grep -q "PRIVATE_KEY=0x" .env; then
    echo "❌ Error: PRIVATE_KEY not set in .env"
    exit 1
fi

echo "✅ .env file found"

# Deploy contracts
echo "📦 Deploying contracts to Sepolia..."
npx hardhat run scripts/deploy.js --network sepolia

echo "
✅ DEPLOYMENT COMPLETE

Next steps:
1. Copy contract addresses from output above
2. Update README.md with Sepolia contract address
3. Verify on Etherscan Sepolia: https://sepolia.etherscan.io/

To verify contract:
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
"
