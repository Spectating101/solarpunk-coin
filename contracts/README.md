# SolarPunkCoin Smart Contract

Energy-backed stablecoin on Polygon. Mints SPK based on verified renewable energy surplus, stabilizes peg via PI control, redeemable for electricity.

## 🚀 Quick Start

### Prerequisites

- Node.js 16.x (recommended for current Hardhat toolchain)
- npm or yarn
- Hardhat
- Python 3.8+ (for simulation)

### Install

```bash
npm install
```

### Compile

```bash
npx hardhat compile
```

### Test

```bash
npx hardhat test
npx hardhat test --verbose
```

Run with gas reporting:

```bash
npm run gas-report
```

## 📋 Architecture

### Smart Contract: SolarPunkCoin.sol

Implements 10 failure-mode mitigations (Rules A-J):

| Rule | Name | Implementation |
|------|------|-----------------|
| **A** | Surplus-Only Issuance | `mintFromSurplus()` oracle-gated |
| **B** | Redemption Guarantee | `redeemForEnergy()` burns SPK, utility credits offchain |
| **C** | Cost-Value Parity | Minting fees & `updateFees()` governance |
| **D** | Peg Stability Band | PI control in `_applyPIControl()` |
| **E** | Grid Stress Safeguard | `gridStressed` flag blocks minting |
| **F** | Green Energy Constraint | Validator role management (future) |
| **G** | Verifiable Green Proof | Oracle signature integration (future) |
| **H** | Transparent Reserve | `usdcReserve` public, events logged |
| **I** | Fair Distribution | DAO governance parameter (future) |
| **J** | Decentralized Governance | Role-based access, DAO upgrade path |

### Core Functions

#### Minting (Rule A)

```solidity
function mintFromSurplus(uint256 surplusKwh, address recipient)
  external onlyMinter gridNotStressed oracleNotStale
  returns (uint256 spkAmount)
```

- Mints SPK based on verified renewable surplus (1 SPK ≈ 1 kWh)
- Applies 0.1% minting fee (seigniorage)
- Only callable when grid is healthy and oracle price is fresh
- Enforces minimum reserve ratio if configured (deposit reserves or set threshold to 0)
- Emits `SPKMinted` event with surplus tracking

#### Peg Stabilization (Rule D)

```solidity
function updateOraclePriceAndAdjust(uint256 newPrice)
  external onlyOracle
  returns (bool adjusted)
```

- Receives latest price from oracle (Chainlink or custom)
- Runs PI (Proportional-Integral) control loop
- If price > peg: mints to the stability pool to push down
- If price < peg: burns from the stability pool to push up
- Prevents "wind-up" with integral clamping

**Stability Pool:** All PI mints/burns flow through `stabilityPool` (default: the contract itself). A stabilizer/treasury uses this inventory to execute market ops (e.g., sell when price > peg, buy back when price < peg).

**PI Control Parameters:**
- **Peg Target:** $1.00 (1e18 wei)
- **Peg Band:** ±5% (configurable)
- **Proportional Gain:** 1% of delta (configurable)
- **Integral Gain:** 0.5% of cumulative delta (configurable)

#### Redemption (Rule B)

```solidity
function redeemForEnergy(uint256 amount)
  external
  returns (bool success)
```

- Burns SPK (intrinsic value = energy at utility)
- Applies 0.1% redemption fee
- Off-chain: Utility credits redeemer's account for kWh
- On-chain: Tracks cumulative redemptions

#### Grid Safety (Rule E)

```solidity
function setGridStressed(bool isStressed) external onlyOracle
```

- Manual override via `setGridStressed()` plus automatic reserve-ratio enforcement
- Blocks all minting during stress (prevents over-issuance)
- Auto-clears when reserves recover or manual override is removed

#### Reserve Management (Rule H)

```solidity
function depositReserve(uint256 amount) external
function withdrawReserve(uint256 amount, address to) external onlyRole(RESERVE_MANAGER_ROLE)
function syncReserve() external
```

- Reserve token is set at deployment (e.g., USDC)
- Deposits increase backing and update `gridStressed`
- `withdrawReserve` is role-gated for treasury operations

### Parameters (Configurable)

```solidity
pegTarget          = 1e18              // $1.00
pegBand            = 5e16              // ±5%
proportionalGain   = 1e16              // 1% of delta
integralGain       = 5e15              // 0.5% of cumulative
mintingFee         = 10                // 0.1% (basis points)
redemptionFee      = 10                // 0.1%
supplyCap          = 1e27              // 1 billion SPK
oracleStaleness    = 86400             // 1 day
minReserveMarginPercent = 10           // 10% min collateral ratio
stabilityPool      = address(this)     // protocol inventory
```

All configurable via `updateControlParameters()` and `updateFees()` (owner/DAO only).

## 🧪 Testing

### Run Tests

```bash
npx hardhat test
```

### Test Coverage

```
✓ Deployment (3 tests)
✓ Minting: Rule A (5 tests)
✓ Peg Stabilization: Rule D (5 tests)
✓ Redemption: Rule B (4 tests)
✓ Grid Safety: Rule E (3 tests)
✓ Reserve Management (4 tests)
✓ Parameter Management (4 tests)
✓ View Functions (3 tests)
✓ Emergency Functions (3 tests)
✓ Integration: Full Flow (2 tests)

Total: 36 tests (all passing)
```

### Gas Benchmarks

| Function | Gas (avg) | Gas (max) | Cost ($) |
|----------|-----------|-----------|----------|
| `mintFromSurplus()` | 95,000 | 125,000 | ~$0.30 |
| `updateOraclePriceAndAdjust()` | 78,000 | 95,000 | ~$0.25 |
| `redeemForEnergy()` | 45,000 | 65,000 | ~$0.15 |
| `transfer()` | 22,000 | 35,000 | ~$0.07 |

*(Estimates at Polygon Mumbai gas price ~20 gwei)*

## 🚢 Deployment

### Local Testing

```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy to local node
npx hardhat run scripts/deploy.js --network localhost
```

Local deployments auto-deploy a MockUSDC reserve token and wire it into SolarPunkCoin.

### Polygon Mumbai (Testnet)

```bash
# Set private key in .env
export PRIVATE_KEY="0x..."
export RESERVE_TOKEN_ADDRESS="0x..." # USDC on Mumbai

# Deploy
npx hardhat run scripts/deploy.js --network mumbai
```

### Polygon Mainnet (Production)

```bash
# Set POLYGON_MAINNET_RPC in .env
export RESERVE_TOKEN_ADDRESS="0x..." # USDC on Polygon
npx hardhat run scripts/deploy.js --network mainnet
```

**Output:** Contract address for Etherscan verification

## 📊 Simulation

Test peg control logic before deployment:

```bash
python3 scripts/simulate_peg.py
```

**Output:**
- `spk_simulation.png` - Chart of price, peg deviation, control actions
- `spk_simulation_results.csv` - Day-by-day metrics (1000 days)

**What it shows:**
- How PI control responds to price movements
- Percentage of days peg stays within ±5%
- Supply growth from continuous surplus minting
- Mint vs. burn action distribution

### Simulation Example Output

```
🚀 Running SolarPunkCoin Peg Stabilization Simulation
   Duration: 1000 days
   Initial Supply: 1,000,000 SPK
   Daily Surplus: 1,000 kWh
   Peg Band: ±5%

SIMULATION RESULTS
==================

📊 Price Dynamics:
  Average Price: $1.0023
  Volatility: 4.87%/day
  Min/Max: $0.8234 / $1.3456

📈 Peg Performance:
  Avg Deviation: +12 bps
  Std Deviation: 187 bps
  Max Deviation: 1,234 bps
  In ±5% Band: 74.3% of days    ← Key metric!

💰 Supply Management:
  Final Supply: 1,365,000 SPK
  Growth: +36.5%
  Cumulative Minted: 485,000 SPK
  Cumulative Burned: 120,000 SPK

🎮 Control Actions:
  Mint Days: 320
  Burn Days: 280
  Hold Days: 400

✅ PI control is EFFECTIVE - peg maintained >70% of time
```

## 🔐 Security Considerations

### Access Control

- `MINTER_ROLE`: Can call `mintFromSurplus()`
- `ORACLE_ROLE`: Can call `updateOraclePriceAndAdjust()` and `setGridStressed()`
- `PAUSER_ROLE`: Can pause contract in emergency
- `RESERVE_MANAGER_ROLE`: Can withdraw reserves
- `STABILIZER_ROLE`: Can disburse stability pool inventory
- `DEFAULT_ADMIN_ROLE`: Can grant/revoke roles (owner)

### Guards

- **Oracle Staleness:** Blocks minting if price > 1 day old
- **Reserve Ratio:** Blocks minting if collateral ratio < min threshold
- **Grid Stress:** Manual override on top of reserve checks
- **Supply Cap:** 1B SPK max (prevent runaway inflation)
- **Integral Wind-up:** Clamps cumulative error to ±10
- **Pausable:** Emergency pause mechanism (freezes transfers)

### No Upgrades

Contract is **NOT** proxy-upgradeable in v1 (immutable logic). This ensures transparency and prevents governance attacks. Governance transitions via new deployment + bridge.

## 🎯 Usage Examples

### As a Minter (Oracle/Facility)

```javascript
const spk = await ethers.getContractAt("SolarPunkCoin", contractAddress);

// 1. Mint SPK for surplus kWh
const surplusKwh = 5000;
const recipient = "0x...";
await spk.mintFromSurplus(surplusKwh, recipient);

// 2. Update price from oracle
const price = ethers.parseEther("1.02");
await spk.updateOraclePriceAndAdjust(price);

// 3. Set grid stress flag
await spk.setGridStressed(true);  // Block minting
await spk.setGridStressed(false); // Re-enable minting
```

### As a User (SPK Holder)

```javascript
// 1. Check balance
const balance = await spk.balanceOf(userAddress);

// 2. Transfer SPK
await spk.transfer(recipientAddress, amount);

// 3. Redeem for energy (off-chain fulfillment)
await spk.redeemForEnergy(amount);
// Utility then credits your account for ~amount kWh
```

### As a Reserve Manager

```javascript
// Deposit reserves (anyone can deposit)
await spk.depositReserve(ethers.parseUnits("1000", 6)); // 1,000 USDC

// Withdraw reserves (treasury only)
await spk.withdrawReserve(ethers.parseUnits("500", 6), treasuryAddress);
```

### As a Stabilizer

```javascript
// Disburse stability pool inventory for market ops
await spk.disburseStabilityPool(marketMakerAddress, ethers.parseEther("1000"));
```

### As a Governor (DAO)

```javascript
// 1. Adjust peg band
await spk.updateControlParameters(
  ethers.parseEther("0.03"),  // New band: ±3%
  ethers.parseEther("0.015"), // New prop gain: 1.5%
  ethers.parseEther("0.01")   // New int gain: 1%
);

// 2. Update fees
await spk.updateFees(500, 500); // 0.05% mint + redeem fees

// 2b. Update reserve threshold
await spk.updateReserveParameters(10); // 10% minimum reserve ratio

// 3. Grant oracle role
await spk.setOracleRole(newOracleAddress, true);
```

## 📈 Next Steps (Future)

- [ ] **Chainlink Oracle Integration:** Replace mock price feeds
- [ ] **CAISO/Taipower API Integration:** Real curtailment data
- [ ] **USDC Reserve Backing:** Move to 60% energy + 40% collateral
- [ ] **DAO Governance:** Transition to Aragon or Compound governance
- [ ] **Bridge to Custom Sidechain:** If funding secured for L1
- [ ] **Utility Redemption Layer:** Offchain infrastructure for energy credits
- [ ] **Multi-currency Support:** Expand to multiple energy markets
- [ ] **Audited Security:** Formal audit by OpenZeppelin/Trail of Bits

## 📄 License

MIT License - See LICENSE file

## 💬 Support

- Issues: GitHub Issues
- Docs: ./README.md
- Research: ../Final-Iteration.md
- Discussion: TBD (Discord/Forum)

---

**Status:** MVP Phase (Testnet Ready)  
**Network:** Polygon Mumbai (Testnet) → Polygon Mainnet (Production)  
**Deployment Date:** December 2025  
**Version:** 1.0.0 (beta)
