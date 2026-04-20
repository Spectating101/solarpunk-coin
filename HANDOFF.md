# SolarPunk Protocol — Project Handoff

**Date:** 2026-04-20  
**Author:** Christopher Ongko  
**Repo:** Solarpunk-bitcoin  
**Status:** Milestone 2 complete — live on Sepolia testnet

---

## 1. What this project is

SolarPunk is a renewable-energy financial protocol with two layers:

**Academic layer** (Finance Masters thesis, Yuan Ze University):
- Pillar 1: Empirical CEIR analysis — does Bitcoin embed energy cost information? (Amihud-Hurvich bias-corrected regression, Chow test, block bootstrap 2000 reps, China mining ban as natural experiment)
- Pillar 2: Options pricing for solar revenue floors — Black-Scholes adapted for irradiance volatility using NASA POWER data
- Pillar 3: Contract feasibility — the smart contract implementation

**Protocol layer** (this repo):
- `SolarPunkCoin` — energy-backed stablecoin, PI peg controller, oracle-gated minting
- `SolarPunkOption` — European cash-settled options clearinghouse with margin/liquidation/settlement
- `ProtocolTreasury` — fee routing, bond escrow, budget disbursement

The thesis is the academic justification. The contracts are the working implementation.

---

## 2. Current state — what is real and verified

### Contracts

| File | Lines | Status |
|---|---|---|
| `contracts/SolarPunkCoin.sol` | ~820 | Deployed, verified, 77 tests pass |
| `contracts/SolarPunkOption.sol` | ~545 | Deployed, verified, 77 tests pass |
| `contracts/ProtocolTreasury.sol` | ~319 | Deployed, verified, 77 tests pass |

### Live deployment (Sepolia, 2026-04-20)

| Contract | Address | Etherscan |
|---|---|---|
| ProtocolTreasury | `0x138e793f095a33D2790349eC1066FED3A756dd2c` | [Verified ✓](https://sepolia.etherscan.io/address/0x138e793f095a33D2790349eC1066FED3A756dd2c#code) |
| SolarPunkCoin | `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F` | [Verified ✓](https://sepolia.etherscan.io/address/0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F#code) |
| SolarPunkOption | `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104` | [Verified ✓](https://sepolia.etherscan.io/address/0xe40A88398b5f90D038f7A6F1f122112DCD9e4104#code) |

### Interaction proof — 7 confirmed transactions on Sepolia

| Step | TX |
|---|---|
| Deposit 100k USDC reserve | [0xd37a51a9...](https://sepolia.etherscan.io/tx/0xd37a51a937ae32a699d77017bda6dd33a7ef1b78c50d75beb230595a3fde15a7) |
| Oracle price update $1.00 | [0xf8b92efa...](https://sepolia.etherscan.io/tx/0xf8b92efacc6da46df8fea94978f090516c665ee94419daa19200415ea86f8f4b) |
| Mint SPK from 10,000 kWh | [0xb272ce02...](https://sepolia.etherscan.io/tx/0xb272ce02dad6911c8498006b9a198b32220cb35aa7bfb4df0df0d57a4368db33) |
| Redeem 100 SPK for energy | [0xfb2811c9...](https://sepolia.etherscan.io/tx/0xfb2811c9ad175987234f9ae177c5babd8a639ca6a04598bf7ce011510b4dc861) |
| Open long call option | [0x26390f64...](https://sepolia.etherscan.io/tx/0x26390f644af9ab5c6686a56761953fe044f57961897c7879fa400574671785f8) |
| Mark position to $1.05 | [0x17b3524c...](https://sepolia.etherscan.io/tx/0x17b3524c2d14c23df77c19dd6de91c84a3d901cdd0672d33efc2940d94cff961) |

---

## 3. What was built and fixed in the final engineering session

### Mechanism fixes applied

| Issue | Fix |
|---|---|
| PI controller produced 6.56% in-band over 10,000 days | Control signal now scaled by `totalSupply()` — proportional to market size |
| Burn path had no inventory | 50% of every mint fee routes to stability pool via `stabilityFeeShare` |
| Mint math used hardcoded `1e18` per kWh | Added `energyPricePerKwh` oracle variable, `updateEnergyPrice()` for ORACLE_ROLE |
| No settlement path for expired options | Added `settle(seriesId)` — marks final PnL, returns margin, clears position |
| `Ownable` + `DEFAULT_ADMIN_ROLE` could split after handoff | Added `handoffAdmin(newAdmin)` — atomically syncs both |

### New functions added

**SolarPunkCoin:**
- `updateEnergyPrice(uint256)` — ORACLE_ROLE sets kWh price (default $1.00)
- `setStabilityFeeShare(uint256)` — owner sets fee split to stability pool (0–10000 bps)
- `handoffAdmin(address)` — atomic Ownable + AccessControl admin transfer
- Fixed `estimateMintAmount` to use `energyPricePerKwh` instead of hardcoded `1e18`

**SolarPunkOption:**
- `settle(bytes32 seriesId)` — settlement function for expired series
- `PositionSettled` event

### Test count: 55 → 77

22 new tests covering all new functions and settlement paths.

---

## 4. Repository structure

```
contracts/           Core protocol (3 contracts + MockUSDC)
test/                Hardhat tests (77 tests, 3 files)
scripts/             Deploy, demo, simulation, interaction proof
  deploy_testnet_full.js     Full stack deploy (Sepolia/Amoy/Holesky)
  run_interaction_proof.js   7-step on-chain proof runner
  simulate_peg.py            PI controller simulation
  simulate_economy.py        Full economy simulation
  pi_tuning.py               Parameter sweep for PI gains
state/
  deployments/sepolia_full_deploy.json   Deployment receipt
  proofs/sepolia_interaction_proof.json  Interaction proof artifact
thesis_package/      Research code: options_pricing.py, monetary_scorecard.py
energy_derivatives/  Python SDK scaffold (spk_derivatives/)
frontend/            Vite/React UI (scaffold + live contract connection)
empirical/           Pillar 1 CEIR data
docs/
  project/           ROLE_PERMISSION_MATRIX, INVARIANT_CHECKLIST, AUDITOR_HANDOFF_CHECKLIST
  specs/             CONTRACT_SPEC, BASIS_AND_TOLERANCE, IM_CALIBRATION
  grants/            GRANT_PROPOSAL, MILESTONES_AND_BUDGET
```

---

## 5. How to run everything

```bash
# Install
npm install

# Run all tests
npx hardhat test --no-compile

# Local protocol demo
npm run demo:treasury

# Break-even model
npm run model:treasury

# Deploy to Sepolia
npx hardhat run scripts/deploy_testnet_full.js --network sepolia

# Run interaction proof against live deployment
npx hardhat run scripts/run_interaction_proof.js --network sepolia

# Run frontend (dev)
cd frontend && npm install && npm run dev
```

---

## 6. Key config and environment

`.env` file (not committed):
```
PRIVATE_KEY=0x...                    # Deploy wallet
SEPOLIA_RPC=https://...              # Sepolia RPC
etherscan=...                        # Etherscan API key (for verify)
PRICE_DECIMALS=6                     # Option price decimals
```

`frontend/.env` file:
```
VITE_SPK_ADDRESS=0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F
VITE_OPTION_ADDRESS=0xe40A88398b5f90D038f7A6F1f122112DCD9e4104
VITE_TREASURY_ADDRESS=0x138e793f095a33D2790349eC1066FED3A756dd2c
VITE_USDC_ADDRESS=0xa467ab7BD1143fB1bF435097b4c72910AbBC1fe2
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

---

## 7. What is still trusted / not decentralized

These are explicit known gaps — not bugs, but design decisions appropriate for prototype stage:

| Gap | Impact | Fix before mainnet |
|---|---|---|
| Single EOA admin | All roles controlled by one key | Transfer to multisig via `handoffAdmin()` |
| `governanceDelay = 0` | No timelock on parameter changes | Set ≥ 86400s (24h) |
| Bond requirements = 0 | No slashable stake for operators | Set non-zero minimums |
| Oracle inputs trusted | No on-chain price verification | Add Chainlink adapter |
| `stabilityPool = address(this)` | No dedicated contract | Deploy `StabilityPool.sol` |
| No dispute for settlement index | Oracle controls final PnL | Multi-oracle aggregation |

---

## 8. Milestone summary

| Milestone | Status | Date |
|---|---|---|
| M1: Repo credibility | Complete | Apr 2026 |
| M2: External inspectability | Complete | 2026-04-20 |
| M3: Security credibility | Not started | — |
| M4: Pilot counterparty | Not started | — |
| M5: Mainnet | Gated | — |

**M2 deliverables confirmed:**
- 4 contracts deployed on Sepolia
- 3 contracts source-verified on Etherscan
- 7 interaction transactions with public tx hashes
- Full documentation suite updated
- All status docs reflect live state

---

## 9. Engineering completed (M2 close-out)

### Contracts written and compiled

| File | Status | Purpose |
|---|---|---|
| `contracts/ChainlinkOracleAdapter.sol` | Written, compiled | Reads Chainlink AggregatorV3Interface, pushes to SPK coin + option, staleness check |
| `contracts/StabilityPool.sol` | Written, compiled | Dedicated stability pool replacing `address(this)`; DISBURSER_ROLE gated withdrawals |
| `contracts/SolarPunkCoin.sol` | Updated | `disburseStabilityPool` now supports external StabilityPool via `IStabilityPool.withdraw()` |

### Frontend: live data

`frontend/src/components/MarketStats.jsx` — updated to read live Sepolia state every 30 s:
- `totalSupply`, `energyPricePerKwh`, `lastOraclePrice`, `usdcReserve`, `getReserveRatio`, `cumulativeSurplusKwh`, `gridStressed`, `isPegStable`, `pegTarget`
- Shows "Live · Sepolia" badge when connected; falls back to demo data on RPC error
- Oracle price is plotted as a rolling 7-tick chart

`frontend/src/abi/SolarPunkCoin.json` — minimal ABI for view functions only.

### Python SDK: chain client

`energy_derivatives/spk_derivatives/chain_client.py` — `SolarPunkChainClient`:
- Requires `pip install web3>=6.0`
- `get_protocol_state()` returns a `ProtocolState` dataclass with all live values
- `energy_price_per_kwh()`, `oracle_price()`, `option_index()` — single-value accessors
- Can be run as a script: `python -m spk_derivatives.chain_client`

### Gas profile

`docs/project/GAS_PROFILE.md` — measured with hardhat-gas-reporter against all 77 tests:
- `mintFromSurplus`: avg 178k gas (hot path)
- `modifyPosition`: avg 151k gas
- `updateOraclePriceAndAdjust`: avg 65k gas
- All within safe limits; no urgent optimizations required

## 10. Next engineering work (M3 readiness)

1. Set `governanceDelay ≥ 86400` on all contracts and configure bond requirements
2. Deploy `ChainlinkOracleAdapter.sol` and `StabilityPool.sol` to Sepolia; grant roles
3. Transfer admin to Safe multisig using `handoffAdmin()`
4. Tag audit scope commit and approach audit firm (Code4rena recommended for cost)

---

## 10. Contact

- Author: Christopher Ongko
- Institution: Yuan Ze University, Finance Masters
- Email: s1133958@mail.yzu.edu.tw
- Deployer address: `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54`
