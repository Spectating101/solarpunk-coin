# Testnet Deployment Guide - SolarPunk Protocol

**Target:** Polygon Mumbai Testnet  
**Status:** Ready for deployment  
**Last Updated:** January 16, 2026

---

## ⚡ QUICK START (5 minutes)

### 1. Get Testnet MATIC
```bash
# Visit Mumbai Faucet
open https://faucet.polygon.technology/

# Or use this direct link
curl -X POST https://faucet.polygon.technology/api/requestTokens \
  -H "Content-Type: application/json" \
  -d '{"address": "0xYOUR_WALLET", "token": "matic"}'

# Wait 1-2 minutes for 1 MATIC to appear
```

### 2. Configure Environment
```bash
# Copy template
cp .env.example .env

# Edit with your private key
nano .env
# Add: PRIVATE_KEY=0x...
# Add: POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
```

### 3. Deploy Contracts
```bash
# Deploy to Mumbai
npm run deploy:mumbai

# Output will show:
# ✅ SolarPunkCoin deployed to: 0x1234...
# ✅ SolarPunkOption deployed to: 0x5678...
```

### 4. Verify on Block Explorer
```bash
# Check transaction
open https://mumbai.polygonscan.com/tx/0x...

# View contract
open https://mumbai.polygonscan.com/address/0x1234...
```

---

## 📋 DETAILED SETUP

### Prerequisites
```bash
# Node.js 16+
node --version  # Should be v16.0.0+

# npm 7+
npm --version  # Should be v7.0.0+

# Git
git --version

# Private key with Mumbai MATIC (testnet)
# Get from: https://faucet.polygon.technology/
```

### Step 1: Install Dependencies
```bash
# Install Hardhat and dependencies
npm install

# Verify installation
npx hardhat --version  # Should show version
```

### Step 2: Get Testnet Funds

**Option A: Polygon Faucet (Recommended)**
```bash
# 1. Go to https://faucet.polygon.technology/
# 2. Enter your wallet address
# 3. Select "Mumbai" network
# 4. Select "MATIC" token
# 5. Click "Send Me MATIC"
# Wait 1-2 minutes
```

**Option B: Alternative Faucets**
- https://www.matic.supply/ (might have queue)
- Aave testnet faucet (requires Aave account)

### Step 3: Create `.env` File
```bash
# Copy example
cp .env.example .env

# Edit with your info
cat > .env << 'EOF'
# Your private key (without 0x prefix)
PRIVATE_KEY=abc123def456...

# RPC endpoints (pick one)
POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
# OR
POLYGON_MUMBAI_RPC=https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# Optional: For contract verification
POLYGONSCAN_API_KEY=YOUR_POLYGONSCAN_KEY
EOF
```

**⚠️ SECURITY WARNING:**
- Never commit `.env` to git
- Never share your PRIVATE_KEY
- Use a testnet-only wallet (not your mainnet wallet)

### Step 4: Compile Contracts
```bash
# Compile all contracts
npx hardhat compile

# Output should show:
# ✓ contracts/SolarPunkCoin.sol
# ✓ contracts/SolarPunkOption.sol
# ✓ contracts/MockUSDC.sol
```

### Step 5: Run Tests Locally (Optional but Recommended)
```bash
# Test on local Hardhat network first
npm test

# Expected output:
# 46 passing (2s)
```

### Step 6: Deploy to Mumbai
```bash
# Method 1: Using npm script
npm run deploy:mumbai

# Method 2: Using hardhat directly
npx hardhat run scripts/deploy.js --network mumbai

# Method 3: Using ts-node (if using TypeScript)
npx ts-node scripts/deploy.ts --network mumbai
```

**Expected Output:**
```
🚀 Deploying SolarPunkCoin to Mumbai...

Deployer: 0x1234567890123456789012345678901234567890
Deployer balance: 5.0 MATIC

✅ MockUSDC deployed to:
   0xabcdefabcdefabcdefabcdefabcdefabcdef123

✅ SolarPunkCoin deployed to:
   0xabcdefabcdefabcdefabcdefabcdefabcdef456

✅ SolarPunkOption deployed to:
   0xabcdefabcdefabcdefabcdefabcdefabcdef789

Deployment Summary:
  - Gas used: 2,450,123
  - Gas cost: 0.15 MATIC (~$0.15)
  - Total tx: 3
  - Time: 45 seconds

📄 Save these addresses:
  export SOLARPUNK_COIN=0xabcdefabcdefabcdefabcdefabcdefabcdef456
  export SOLARPUNK_OPTION=0xabcdefabcdefabcdefabcdefabcdefabcdef789
```

### Step 7: Verify Contracts on BlockScan
```bash
# If you have Polygonscan API key
npx hardhat verify --network mumbai \
  0xabcdefabcdefabcdefabcdefabcdefabcdef456 \
  "0xabcdefabcdefabcdefabcdefabcdefabcdef123"

# Output:
# ✅ Contract verified at https://mumbai.polygonscan.com/address/...
```

---

## 🧪 TESTING DEPLOYED CONTRACTS

### 1. Interact via Hardhat Console
```bash
npx hardhat console --network mumbai
```

```javascript
// Load contract
const SPK = await ethers.getContractAt(
  "SolarPunkCoin",
  "0x..." // Your deployed address
);

// Check balance
const balance = await SPK.balanceOf("0x..."); // Your address
console.log("Your balance:", balance.toString());

// Check peg
const peg = await SPK.pegTarget();
console.log("Peg target:", ethers.formatEther(peg));

// Exit with Ctrl+D
```

### 2. Use Block Explorer UI
1. Visit https://mumbai.polygonscan.com/
2. Search for contract address
3. Go to "Contract" tab
4. Click "Read Contract"
5. Call functions like `pegTarget()`, `totalSupply()`, `lastOraclePrice()`

### 3. Automated Health Check
```bash
# Check contract health
npx hardhat run scripts/health_check.js --network mumbai

# Output:
# ✅ SolarPunkCoin is live
# ✅ Oracle role is set
# ✅ Peg: $1.00
# ✅ Supply: 0 SPK
# ✅ Reserves: 0 USDC
```

---

## 🔄 OPERATIONAL WORKFLOWS

### Scenario 1: Mint SPK from Surplus
```bash
npx hardhat run scripts/test_mint.js --network mumbai
```

```javascript
// scripts/test_mint.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const SPK = await ethers.getContractAt(
    "SolarPunkCoin",
    "0x..." // Your deployed address
  );

  // Mint 1000 SPK
  const surplusKwh = 1000;
  const tx = await SPK.mintFromSurplus(surplusKwh, deployer.address);
  await tx.wait();

  console.log("✅ Minted 1000 SPK");
  const balance = await SPK.balanceOf(deployer.address);
  console.log("New balance:", ethers.formatEther(balance));
}

main().catch(console.error);
```

### Scenario 2: Execute Option Trade
```bash
npx hardhat run scripts/test_option_trade.js --network mumbai
```

```javascript
// scripts/test_option_trade.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const Option = await ethers.getContractAt(
    "SolarPunkOption",
    "0x..." // Your deployed option contract
  );

  // Open a long call position
  const strikePrice = ethers.parseEther("1.05");
  const tx = await Option.openPosition(strikePrice, 0); // 0 = long call

  console.log("✅ Opened long call position");
  console.log("TX:", tx.hash);
}

main().catch(console.error);
```

### Scenario 3: Feed Oracle Price
```bash
npx hardhat run scripts/update_oracle.js --network mumbai
```

```javascript
// scripts/update_oracle.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const SPK = await ethers.getContractAt(
    "SolarPunkCoin",
    "0x..."
  );

  // Grant oracle role (if not already)
  const ORACLE_ROLE = await SPK.ORACLE_ROLE();
  const tx1 = await SPK.grantRole(ORACLE_ROLE, deployer.address);
  await tx1.wait();

  // Update price to $1.02 (2% above peg)
  const newPrice = ethers.parseEther("1.02");
  const tx2 = await SPK.updateOraclePriceAndAdjust(newPrice);
  await tx2.wait();

  console.log("✅ Oracle price updated to $1.02");
  const price = await SPK.lastOraclePrice();
  console.log("Current price:", ethers.formatEther(price));
}

main().catch(console.error);
```

---

## 📊 MONITORING & DEBUGGING

### View Recent Transactions
```bash
# On Mumbai block explorer
open https://mumbai.polygonscan.com/address/0x...?tab=txs

# Or via API
curl https://api-mumbai.polygonscan.com/api \
  ?module=account \
  &action=txlist \
  &address=0x... \
  &startblock=0 \
  &endblock=99999999 \
  &sort=desc
```

### Common Issues

**Issue: "Insufficient balance" error**
```bash
# Solution: Get more MATIC from faucet
open https://faucet.polygon.technology/
```

**Issue: "Contract not found" error**
```bash
# Solution: Check network in hardhat.config.js
# Ensure POLYGON_MUMBAI_RPC is correct
cat .env | grep POLYGON_MUMBAI_RPC
```

**Issue: "Nonce too high" error**
```bash
# Solution: Reset nonce (or wait for pending txs)
npx hardhat run scripts/deploy.js --network mumbai --reset
```

**Issue: Pending transaction for 10+ minutes**
```bash
# Cancel and retry with higher gas price
# Edit hardhat.config.js:
gasPrice: ethers.parseUnits("35", "gwei")  // Increase from 20
```

---

## 🚀 NEXT STEPS (After Successful Deployment)

### Week 1: Validation
- [ ] Deploy to Mumbai
- [ ] Run health checks
- [ ] Execute 5+ test transactions
- [ ] Verify all functions work
- [ ] Save contract addresses to GitHub issues

### Week 2-3: Integration
- [ ] Connect frontend to testnet contracts
- [ ] Set up oracle pricing updates (hourly)
- [ ] Create monitoring dashboards (Prometheus)
- [ ] Document any issues found

### Week 4: Pilot Onboarding
- [ ] Share contract addresses with pilot partners
- [ ] Create pilot user guide
- [ ] Execute first live pilot trade
- [ ] Collect feedback

### Month 2: Mainnet Readiness
- [ ] Pass security audit
- [ ] Final parameter tuning
- [ ] Create mainnet deployment scripts
- [ ] Plan mainnet launch event

---

## 📞 TROUBLESHOOTING & SUPPORT

### Discord/Community
Join Polygon community Discord for testnet help

### GitHub Issues
```bash
# Create issue with:
- Environment (OS, node version)
- Error message (full stack trace)
- Steps to reproduce
- Expected vs actual behavior
```

### Direct Support
```
Email: s1133958@mail.yzu.edu.tw
Time zone: UTC+8 (Asia)
Response time: <24 hours
```

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Node.js v16+ installed
- [ ] `.env` file created with PRIVATE_KEY
- [ ] MATIC faucet funds received (>1 MATIC)
- [ ] `npm install` completed
- [ ] `npm test` passes (local)
- [ ] `npm run deploy:mumbai` succeeds
- [ ] Contracts visible on Mumbai Polygonscan
- [ ] Health check passes
- [ ] At least 1 test transaction executed
- [ ] Addresses saved to GitHub
- [ ] Pilot partners notified

---

**Once complete, you're ready for Milestone 1 acceptance! 🎉**
