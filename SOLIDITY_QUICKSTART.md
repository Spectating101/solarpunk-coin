# SolarPunkCoin Development Guide

Quick reference for building, testing, and deploying the SPK contract.

## 🎯 What You Have

- **SolarPunkCoin.sol** - 500+ line smart contract with PI peg control
- **SolarPunkOption.sol** - Margin-based options clearinghouse (Pillar 3)
- **46 Hardhat Tests** - All passing across SPK + Options
- **Python Simulation** - Validates peg control over 1000 days
- **Deployment Scripts** - Ready for testnet/mainnet

## 📦 Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

Use Node 16.x (or 20.x) to avoid Hardhat compatibility warnings.

### 2. Create .env File

```bash
cp .env.example .env
# Edit .env with your PRIVATE_KEY (from MetaMask export)
# Set RESERVE_TOKEN_ADDRESS / USDC_ADDRESS for non-local deployments (e.g., USDC on Polygon)
# Set PRICE_DECIMALS if your oracle feed differs (default 6)
```

### 3. Compile Contract

```bash
npx hardhat compile
```

Output: `artifacts/contracts/SolarPunkCoin.sol/SolarPunkCoin.json`

## 🧪 Testing (10 minutes)

### Run All Tests

```bash
npx hardhat test
```

Expected output:
```
  SolarPunkCoin
    Deployment (2)
      ✓ Should deploy with correct name and symbol
      ✓ Should initialize with correct peg target
    Minting: Rule A (5)
      ✓ Should mint SPK from surplus with fee
      ✓ Should reject minting with zero surplus
      ...
    [28 more tests]

46 passing (3s)
```

### Run Specific Test Suite

```bash
# Only test minting
npx hardhat test --grep "Minting"

# Only test peg control
npx hardhat test --grep "Peg Stabilization"

# Verbose output
npx hardhat test --verbose
```

### Check Gas Usage

```bash
npm run gas-report
```

Creates `gas-report.txt` with per-function costs.

## 🚀 Simulation (2 minutes)

Test peg control logic before deploying:

```bash
python3 scripts/simulate_peg.py
```

Outputs:
- `spk_simulation.png` - 6-panel chart
- `spk_simulation_results.csv` - Raw data
- Console: Summary statistics

**Key Metric:** % days peg stays within ±5% band
- ✅ **>70%** = PI control is effective
- ⚠️ **50-70%** = PI control adequate, consider tuning
- ❌ **<50%** = Needs parameter adjustment

### Adjust Simulation Parameters

Edit `scripts/simulate_peg.py`:

```python
params = SimulationParams(
    days=1000,
    initial_price=1.0,
    price_volatility=0.05,      # ← Try 0.10 for higher volatility
    shock_probability=0.01,     # ← Try 0.05 for more shocks
    shock_magnitude=0.15,
    peg_band=0.05,              # ← Try 0.03 for tighter band
    proportional_gain=0.01,     # ← Try 0.015 for faster response
    integral_gain=0.005,        # ← Try 0.01 for stronger damping
)
```

Rerun and compare charts.

## 🔎 Monitoring (MVP)

```bash
export SPK_ADDRESS=0x...
export OPTION_ADDRESS=0x...
export RPC_URL=https://rpc-mumbai.maticvigil.com
npm run health:check
```

Outputs reserve ratio, oracle staleness, pause status, and index freshness for both contracts.

## 🚢 Local Deployment (5 minutes)

### Start Local Hardhat Node

```bash
# Terminal 1
npx hardhat node
```

Outputs 20 test accounts with 10,000 ETH each.

### Deploy to Local Node

```bash
# Terminal 2
npx hardhat run scripts/deploy.js --network localhost
```

Local deployments auto-deploy a MockUSDC reserve token and wire it into SolarPunkCoin.

Output:
```
🚀 Deploying SolarPunkCoin...
✅ SolarPunkCoin deployed to: 0x5FbDB...
📍 Deployed by: 0xf39F...

⚙️  Initializing contract...
Initial Parameters:
  - Peg Target: $1.00
  - Peg Band: ±5%
  - Minting Fee: 0.1%
  - Supply Cap: 1,000,000,000 SPK

✨ Deployment complete!
```

Copy contract address for testing.

### Test Locally

```bash
# Terminal 2 (continue)
npx hardhat test --network localhost
# Or interact directly
npx hardhat console --network localhost
```

## 🌐 Mumbai Testnet Deployment (10 minutes)

### 1. Get Test MATIC

- Go to [Polygon Faucet](https://faucet.polygon.technology/)
- Connect MetaMask (Mumbai testnet)
- Claim 0.5 MATIC (free)

### 2. Set Private Key

```bash
# Export from MetaMask: Account Details → Export Private Key
export PRIVATE_KEY=0x...
# Reserve token (USDC) address on the target network
export RESERVE_TOKEN_ADDRESS=0x...
```

### 3. Deploy

```bash
npx hardhat run scripts/deploy.js --network mumbai
```

Output:
```
🚀 Deploying SolarPunkCoin...
✅ SolarPunkCoin deployed to: 0xAbCD1234...
📍 Deployed by: 0xYourAddress...

✨ Deployment complete!
```

**Contract is LIVE!** View on [PolygonScan](https://mumbai.polygonscan.com/) using address.

### 4. Deploy Options Clearinghouse (SolarPunkOption)

```bash
npx hardhat run scripts/deploy_pillar3.js --network mumbai
```

Set `USDC_ADDRESS` and (optionally) `PRICE_DECIMALS` in `.env` before running. The deploy script will log the deployed SolarPunkOption address (and MockUSDC if you target localhost).

## 🧬 Interact with Contract

### Via Hardhat Console

```bash
npx hardhat console --network mumbai
```

Then:

```javascript
// Load contract
const spk = await ethers.getContractAt(
  "SolarPunkCoin",
  "0xAbCD1234..." // Your deployed address
);

// Check balance
const balance = await spk.balanceOf("0xYourAddress");
console.log(ethers.formatEther(balance)); // Convert from wei

// Ensure reserves are funded before minting
await spk.depositReserve(ethers.parseUnits("1000", 6)); // 1,000 USDC

// Mint from surplus (must have MINTER_ROLE)
const tx = await spk.mintFromSurplus(1000, "0xRecipient");
await tx.wait();

// Update oracle price
const price = ethers.parseEther("1.02");
await spk.updateOraclePriceAndAdjust(price);

// Check peg status
const stable = await spk.isPegStable();
console.log("Peg stable?", stable);

// Exit
.exit
```

### Via Web Interface (PolygonScan)

1. Go to [PolygonScan Mumbai](https://mumbai.polygonscan.com/)
2. Search your contract address
3. Click **"Contract"** tab
4. Scroll to **"Read Contract"** → View balances
5. Click **"Write Contract"** → Connect MetaMask
6. Call functions (if you have role)

### Via Python (web3.py)

```python
from web3 import Web3

w3 = Web3(Web3.HTTPProvider("https://rpc-mumbai.maticvigil.com"))
contract_address = "0xAbCD1234..."

# Load ABI from artifacts
with open("artifacts/contracts/SolarPunkCoin.sol/SolarPunkCoin.json") as f:
    abi = json.load(f)["abi"]

spk = w3.eth.contract(address=contract_address, abi=abi)

# Read functions (no gas)
balance = spk.functions.balanceOf("0xYourAddress").call()
peg_target = spk.functions.pegTarget().call()
print(f"Balance: {balance}")
print(f"Peg Target: {w3.from_wei(peg_target, 'ether')}")

# Write functions (need private key)
from eth_account import Account
account = Account.from_key("0xYourPrivateKey")

# Build transaction
tx = spk.functions.mintFromSurplus(1000, "0xRecipient").build_transaction({
    "from": account.address,
    "nonce": w3.eth.get_transaction_count(account.address),
    "gas": 150000,
    "gasPrice": w3.eth.gas_price,
})

# Sign & send
signed_tx = w3.eth.account.sign_transaction(tx, "0xYourPrivateKey")
tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
print(f"Tx Hash: {tx_hash.hex()}")
```

## 📋 Common Tasks

### Grant Minter Role

```javascript
const MINTER_ROLE = await spk.MINTER_ROLE();
await spk.grantRole(MINTER_ROLE, "0xMinterAddress");
```

### Grant Oracle Role

```javascript
const ORACLE_ROLE = await spk.ORACLE_ROLE();
await spk.grantRole(ORACLE_ROLE, "0xOracleAddress");
```

### Wire Frontend to Deployed Option

```bash
cp frontend/.env.example frontend/.env
echo "VITE_OPTION_ADDRESS=0xYourOptionAddress" >> frontend/.env
npm --prefix frontend run build
```

### Update Peg Parameters

```javascript
await spk.updateControlParameters(
  ethers.parseEther("0.03"),   // New band: ±3%
  ethers.parseEther("0.015"),  // New prop gain: 1.5%
  ethers.parseEther("0.01")    // New int gain: 1%
);
```

### Update Fees

```javascript
await spk.updateFees(500, 500); // Mint + redeem fees to 0.05%
```

### Pause Contract (Emergency)

```javascript
const PAUSER_ROLE = await spk.PAUSER_ROLE();
// First, grant yourself pauser role
await spk.grantRole(PAUSER_ROLE, "0xYourAddress");
// Then pause
await spk.pause();
```

## 🐛 Troubleshooting

### "PRIVATE_KEY not found"

```bash
# Create .env from template
cp .env.example .env

# Edit and add your key
PRIVATE_KEY=0x...
```

### "Error: Provider not found"

```bash
# Update POLYGON_MUMBAI_RPC in .env
POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
```

### "Reverted: Must have MINTER_ROLE"

You're trying to call `mintFromSurplus()` without the role:

```javascript
// First, grant yourself minter role (as owner)
const MINTER_ROLE = await spk.MINTER_ROLE();
await spk.grantRole(MINTER_ROLE, yourAddress);

// Now mint works
await spk.mintFromSurplus(1000, recipient);
```

### "Insufficient gas"

Increase gas in hardhat.config.js:

```javascript
networks: {
  mumbai: {
    url: process.env.POLYGON_MUMBAI_RPC,
    accounts: [process.env.PRIVATE_KEY],
    gasPrice: "auto", // Auto-detect
    // OR manually set:
    // gasPrice: ethers.parseUnits("50", "gwei"),
  }
}
```

### Tests Failing Locally

Make sure Hardhat node is running:

```bash
# Terminal 1
npx hardhat node

# Terminal 2
npx hardhat test --network localhost
```

## 📚 Further Reading

- **Solidity Code:** `contracts/SolarPunkCoin.sol` (500+ lines, well-commented)
- **Tests:** `test/SolarPunkCoin.test.js` (36 tests) + `test/SolarPunkOption.test.js` (10 tests)
- **Research:** `../Final-Iteration.md` (economic design + 10 rules)
- **Peg Theory:** `../CEIR-Trifecta.md` (empirical validation)

## ✅ Checklist Before Mainnet

- [ ] All 46 tests passing
- [ ] Gas report generated & optimized
- [ ] Simulation shows >70% peg stability
- [ ] Contract compiled without warnings
- [ ] `.env` safely stored (never commit)
- [ ] Minter/Oracle roles assigned
- [ ] Initial price feed tested
- [ ] Redemption flow validated
- [ ] Emergency pause tested
- [ ] Mainnet RPC confirmed
- [ ] Mainnet ETH for deployment (0.05 ETH = ~$150)

## 🎉 Next Steps

1. **Run tests:** `npm test`
2. **Simulate:** `python3 scripts/simulate_peg.py`
3. **Deploy local:** `npx hardhat run scripts/deploy.js --network localhost`
4. **Deploy Mumbai:** `npx hardhat run scripts/deploy.js --network mumbai`
5. **Interact:** Use PolygonScan or web3.py
6. **Iterate:** Adjust parameters based on real data
7. **Grant funding:** Apply with testnet contract address

---

**Questions?** Check `contracts/README.md` for full API docs.

**Ready to mainnet?** See `MAINNET_CHECKLIST.md`.
