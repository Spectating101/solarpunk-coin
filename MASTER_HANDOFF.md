# SolarPunk Protocol — Master Handoff Document

**Date:** 2026-06-07 (numbers refreshed; narrative sections may lag)
**Author:** Christopher Ongko (s1133958@mail.yzu.edu.tw)
**Repo:** Solarpunk-bitcoin
**GitHub:** https://github.com/Spectating101/solarpunk-coin
**Supersedes:** `HANDOFF.md` (now a redirect)

Long-form context for architecture, design decisions, and history.

> **Do not start here.** Read [`DOCS.md`](./DOCS.md) then [`CURRENT_STATUS.md`](./CURRENT_STATUS.md). This file is narrative history; numbers go stale.

> **Canonical product:** SPK v1 on Sepolia (`0x8e189…` / `0x52016…`). Launch-grant-public-lab phase ended.

---

## 0. Executive Summary

SolarPunk is a renewable-energy-backed decentralized derivatives protocol. It exists as **both** a Master's thesis at Yuan Ze University (Finance) **and** a working prototype on Ethereum Sepolia. The two purposes co-evolve — academic justification informs the design; the working implementation backs the academic claims.

**As of 2026-06-07 (verify via `CURRENT_STATUS.md`):**
- **109** Hardhat tests
- **SPK v1 canonical:** energy-native SPK + CurrencySystem on Sepolia, verified on Etherscan, operator cycles running
- **Archive stacks:** legacy Safe/options (`0x1D55…`), May 2026 attested proof (`0x8ceDa…`)
- NASA keeper: stale since 2026-05-21
- Independent code review (Codex, April 2026) — 5 findings fixed
- Python SDK in `energy_derivatives/` — 10 pytest tests
- Frontend — 9 Vitest tests; reads legacy Sepolia contracts
- Maturity memo: 90-day stress test; 250% IM recommendation

**What this is not:**
- Not a product launch or mainnet deployment
- Not formally audited for production
- Not backed by live utility-grade meter provenance (fixtures/samples only)

---

## 1. Origin and Purpose

### 1.1 Academic layer (Master's thesis)

The thesis investigates renewable-energy-backed monetary instruments and on-chain derivatives across three pillars:

- **Pillar 1 — Empirical CEIR analysis.** Does Bitcoin embed energy cost information? Methodology: Amihud-Hurvich bias-corrected regression, Chow tests, block bootstrap (2000 reps), China mining ban 2021 as a natural experiment. Materials in `empirical/`.
- **Pillar 2 — Options pricing for solar revenue floors.** Black-Scholes adapted for irradiance volatility using NASA POWER data; jump-diffusion (Merton) variants for grid-stress events. Library at `energy_derivatives/spk_derivatives/`.
- **Pillar 3 — Contract feasibility.** A working Solidity implementation of an energy-backed clearinghouse, demonstrating that the academic mechanism is realizable.

### 1.2 Protocol layer (this repo)

Core plus supporting infrastructure:

- **`SolarPunkCoin`** — energy-linked token; PI peg; `mintFromSurplus` and `mintFromSurplusAttestation`; redemption burn.
- **`SolarPunkOption`** — European cash-settled options; 150% IM / 75% MM on Sepolia (250% / 125% recommended in stress memo).
- **`ProtocolTreasury`** — fee vault; 4-bucket budget split; keeper bond escrow.
- **`StabilityPool`** — peg-stability inventory isolated from the coin contract.
- **`ChainlinkOracleAdapter`** — external feed bridge to internal oracle surfaces.
- **`SolarPunkCurrencySystem`** — invoice settlement and owed-kWh redemption registry (local tests / pilot stack).
- **`EnergyRevenueFloor`** — revenue-floor pilot module; tested, not deployed on Sepolia.

### 1.3 Why this combination

The thesis explains *why* energy-backed derivatives matter (renewables face revenue volatility that blocks project finance). The protocol demonstrates *that they can be built decentralized*. Neither half stands alone: a thesis without working code is just speculation; working code without academic grounding is a degenerate DeFi project. Together they're a credible research artifact.

---

## 2. Current State — What Is Real and Verified

### 2.1 Sepolia deployments (all source-verified on Etherscan)

| Contract | Address | Etherscan |
|---|---|---|
| `SolarPunkCoin` | `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F` | [Verified ✓](https://sepolia.etherscan.io/address/0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F#code) |
| `SolarPunkOption` | `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104` | [Verified ✓](https://sepolia.etherscan.io/address/0xe40A88398b5f90D038f7A6F1f122112DCD9e4104#code) |
| `ProtocolTreasury` | `0x138e793f095a33D2790349eC1066FED3A756dd2c` | [Verified ✓](https://sepolia.etherscan.io/address/0x138e793f095a33D2790349eC1066FED3A756dd2c#code) |
| `StabilityPool` | `0xb9c2Ac8166edFc899b591bc51746d75bFCEca086` | Verified |
| `ChainlinkOracleAdapter` | `0x87B64cd4cE7C95a3A2465aE1e4E71582A64820C9` | Verified |
| Safe (admin multisig) | `0xB95586775C73feB0154828c77832E106425C818A` | [Safe app](https://app.safe.global/sep:0xB95586775C73feB0154828c77832E106425C818A) |
| MockUSDC (test collateral) | `0xa467ab7BD1143fB1bF435097b4c72910AbBC1fe2` | Verified |

**Deployer EOA:** `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54` — has **zero admin authority** on the three core contracts following the multisig handoff. It still holds `DEFAULT_ADMIN_ROLE` on `StabilityPool`, while `DISBURSER_ROLE` is correctly assigned to `SolarPunkCoin` and revoked from the deployer.

### 2.2 Test posture

| Suite | Tests | File |
|---|---|---|
| `SolarPunkCoin` | 58 | `test/SolarPunkCoin.test.js` |
| `SolarPunkOption` | 20 | `test/SolarPunkOption.test.js` |
| `ProtocolTreasury` | 8 | `test/ProtocolTreasury.test.js` |
| `SolarPunkCurrencySystem` | 6 | `test/SolarPunkCurrencySystem.test.js` |
| `EnergyRevenueFloor` | 11 | `test/EnergyRevenueFloor.test.js` |
| **Hardhat total** | **103** | |
| Node product scripts | 92/93 | `test-node/*.test.js` |
| Frontend | 9 | `frontend/src/**/*.test.jsx` |
| Python SDK | 10 | `energy_derivatives/tests/` |

Run with `npx hardhat test` (~5 seconds on a typical machine).

### 2.3 Operational state on-chain

- Bond requirements: **100 USDC** for minter, oracle, liquidator
- Governance delay: **86,400 seconds (24 hours)** on all 3 core contracts
- Initial margin: **150% of exposure**, maintenance margin **75%** on the current Sepolia deployment. The recommended next pilot hardening target is **250% / 125%** per `PROTOCOL_MATURITY_REPORT_2026.md`.
- Oracle: ORACLE_ROLE granted to ChainlinkOracleAdapter; manual energy price ($0.05/kWh) as fallback
- StabilityPool: DEFAULT_ADMIN_ROLE remains on deployer EOA; DISBURSER_ROLE is correctly assigned to SolarPunkCoin

### 2.4 Live data flow

The daily keeper (GitHub Actions, `01:00 UTC`):

1. Fetches NASA POWER GHI for Taoyuan, Taiwan (24.99°N, 121.30°E) — 35-day window to handle NASA's 2-4 week publication lag
2. Normalizes against historical monthly mean → index sits ~1.0 (average day), so it's economically meaningful against the existing `SOLAR_CALL_JUN2026_1USD` strike of $1.00
3. Pushes `option.updateIndex(indexScaled, sourceHash)` with 6-decimal precision (matches deployed `priceDecimals=6`)
4. Pushes `spk.updateEnergyPrice($0.05/kWh)` (stable tariff, not weather-driven)
5. Pushes `spk.updateOraclePriceAndAdjust($1.00)` to maintain SPK peg
6. Reads back full protocol state and writes `state/keeper_logs/YYYY-MM-DD.json`
7. Commits the log back to the repo with `[skip ci]`

Each log file is permanent on-chain proof anchored to source hash `keccak256(NASA_POWER_ALLSKY_SFC_SW_DWN, lat, lon, date)`.

---

## 3. Architecture

### 3.1 SolarPunkCoin (energy-backed stablecoin)

**Purpose:** an ERC20 whose supply is bounded by verified renewable energy surplus (`mintFromSurplus`) and whose peg to USD ($1.00 default) is maintained by a PI controller.

**Key mechanisms:**
- **Rule A (Surplus-Only Mint):** SPK can only be minted against attested kWh of renewable surplus; minter role must be bonded.
- **Rule B (Intrinsic Guarantee):** SPK can be redeemed for energy at the protocol-stored `energyPricePerKwh`.
- **Rule D (PI Control):** Oracle posts `lastOraclePrice`. PI controller emits a control signal proportional to `totalSupply()` to keep the price within the ±5% band.
- **Rule E (Grid Stress):** When `gridStressed = true`, minting is blocked (oracle-toggleable).

**Fee routing:** Mint fee is split between StabilityPool (`stabilityFeeShare` bps, default 50%) and ProtocolTreasury.

**Governance:** Every economic parameter setter (`setStabilityFeeShare`, `setEnergyPrice`, etc.) is gated by `onlyGovernanceApproved(actionId)`, which enforces the 24h timelock when `governanceDelay > 0`. Bypass when `governanceDelay = 0` is intentional for testnet/testing.

### 3.2 SolarPunkOption (clearinghouse)

**Purpose:** European cash-settled options on energy indices. One series per (expiry, strike, type, notional). Long and short positions netted by margin.

**Key mechanisms:**
- **Margin enforcement:** live Sepolia config is 150% initial / 75% maintenance, enforced on `modifyPosition`, `withdrawMargin`, and on every `markPosition`. The risk-boxed pilot recommendation is to raise this to 250% / 125% before larger exposure.
- **Mark-to-index:** PnL accrues continuously as the oracle posts new `currentIndex`. `priceDecimals = 6` (e.g., $1.45 = 1,450,000). **The keeper uses this scale, not 1e18.**
- **Settlement:** `settle(seriesId)` after expiry computes terminal PnL, returns remaining margin, clears position. Pre-expiry, only `modifyPosition` and `withdrawMargin` are valid (the latter rejects with `SeriesExpired` after expiry — fix from Codex review).
- **Auto-liquidation:** Bonded liquidators can call `liquidate` when margin drops below maintenance. Liquidation penalty routes a portion to liquidator + treasury.

### 3.3 ProtocolTreasury

**Purpose:** fee vault + bond escrow. All protocol fees (mint, redemption, trading, liquidation) flow here.

**Key mechanisms:**
- **4-bucket budget split:** Operations / R&D / Insurance / Community — bps configurable, sum must equal 10,000.
- **Keeper bonds:** `lockBond` deposits a slashable USDC stake against an operator. `releaseBond` returns it. `slashBond` redirects to a penalty recipient.
- **Governance timelock:** Same `onlyGovernanceApproved` pattern as SolarPunkCoin.

### 3.4 StabilityPool

**Purpose:** isolate peg-stability USDC from the main coin contract. Reduces blast radius if a bug in SolarPunkCoin allows unintended fund movement.

**Roles:**
- `DEFAULT_ADMIN_ROLE` → deployer EOA (auxiliary-contract admin not yet handed to Safe)
- `DISBURSER_ROLE` → SolarPunkCoin contract (so its `disburseStabilityPool` can call `pool.withdraw`)
- `PAUSER_ROLE` → deployer EOA unless explicitly rotated
- `emergencyWithdraw` → DEFAULT_ADMIN_ROLE only

### 3.5 ChainlinkOracleAdapter

**Purpose:** bridges Chainlink `AggregatorV3Interface` feeds to internal contract `update*` calls. Normalizes any decimal count to 1e18.

**Methods:**
- `pushSpkPrice()`, `pushEnergyPrice()`, `pushOptionIndex()`, `pushAll()`
- `setManualEnergyPrice()` — fallback when no Chainlink feed exists for the desired metric (true for energy price on Sepolia today)
- `maxStaleness = 3600s` default

---

## 4. Repository Structure

```
contracts/                    Core protocol Solidity (5 contracts + MockUSDC)
test/                         Hardhat tests (79 tests, 3 files)
scripts/                      Deploy, demo, simulation, interaction proof, keeper
  deploy_testnet_full.js          Full stack deploy (Sepolia/Amoy/Holesky)
  deploy_sepolia.sh               Sepolia deploy automation
  setup_m3_security.js            M3: governance delay, bonds, StabilityPool, adapter
  setup_multisig_handoff.js       Safe creation + admin handoff
  fix_disburser_role.js           Historical helper for DISBURSER_ROLE state verification
  nasa_keeper.js                  Daily NASA → Sepolia oracle pusher
  run_interaction_proof.js        7-step on-chain demonstration
  simulate_peg.py                 PI controller simulation
  simulate_economy.py             Multi-agent economy simulation
  simulate_black_swan.py          Tail-risk simulation
  stress_test_margin.py           90-day jump-diffusion stress test (basis for maturity memo)
  pi_tuning.py                    Parameter sweep for PI gains
state/
  deployments/                    Deployment outputs (Sepolia, Amoy, localhost)
  proofs/                         Interaction proof artifacts
  keeper_logs/                    Daily NASA→Sepolia keeper output (YYYY-MM-DD.json)
energy_derivatives/spk_derivatives/   Python SDK
  chain_client.py                 Read-only client for live Sepolia state
  pricing.py                      Black-Scholes, binomial tree, Monte Carlo, Merton
  api/main.py                     FastAPI service (auth + rate limiting)
thesis_package/                 Thesis research code (options_pricing.py, monetary_scorecard.py)
empirical/                      Pillar 1 CEIR data and analysis
frontend/                       Vite/React UI with live Sepolia reads
docs/archive/legacy-interface-design/frontend-claude-design/
                                 Archived Claude design-pass loose JSX components
docs/                           Project docs (specs, grants, ops, papers, thesis)
GRANT_SUBMISSIONS/              Active grant submission drafts
submissions_log/                Tracker for actual grant submissions (proof-of-upload)
.github/workflows/              CI + scheduled keeper
PROTOCOL_MATURITY_REPORT_2026.md  90-day stress test memo
THREAT_MODEL.md                 Documented attack surfaces
TRUST_ASSUMPTIONS.md            What is and is not trusted
SECURITY_AUDIT_RFP.md           Audit prep doc
HANDOFF.md                      Prior handoff (2026-04-20) — superseded by this doc
MASTER_HANDOFF.md               This document
```

---

## 5. Live Operations

### 5.1 Daily NASA keeper (automated)

- **Schedule:** GitHub Actions cron `0 1 * * *` (01:00 UTC daily)
- **Workflow:** `.github/workflows/nasa_keeper.yml`
- **Script:** `scripts/nasa_keeper.js`
- **Secrets required:** `KEEPER_PRIVATE_KEY`, `SEPOLIA_RPC`
- **Output:** `state/keeper_logs/YYYY-MM-DD.json`, committed back to repo
- **Most recent run:** 2026-05-05 (commit `0eac02c` on origin/main before branch merge)

### 5.2 Frontend dev server

```bash
cd frontend && npm install && npm run dev
```

Live data fetched from Sepolia every 30 s. Components in `frontend/src/components/MarketStats.jsx` read 9 view functions across SPK + Option contracts.

### 5.3 Python SDK (read-only chain client)

```python
from spk_derivatives.chain_client import SolarPunkChainClient
client = SolarPunkChainClient()
print(client.get_protocol_state())
```

Returns a `ProtocolState` dataclass with all live values (supply, oracle price, reserves, peg target, option index, etc.).

---

## 6. Recent Work (April 2026 Session)

### 6.1 M3 security setup (2026-04-20)

Output: `state/deployments/sepolia_m3_setup.json`

| Action | Result |
|---|---|
| StabilityPool deployed + verified | `0xb9c2Ac8166edFc899b591bc51746d75bFCEca086` |
| ChainlinkOracleAdapter deployed + verified | `0x87B64cd4cE7C95a3A2465aE1e4E71582A64820C9` |
| Manual energy price set | $0.05/kWh on adapter |
| ORACLE_ROLE granted to adapter | On both SPK and Option contracts |
| 100 USDC bond deposited | Deployer is now a bonded keeper |
| Bond requirements set | 100 USDC for all roles |
| `setStabilityPool` | SolarPunkCoin now points to external StabilityPool |
| Governance delay | 86,400s set on all 3 core contracts |

### 6.2 Safe multisig handoff (2026-04-20)

Output: `state/deployments/sepolia_multisig_handoff.json`

| Contract | Action | Result |
|---|---|---|
| SolarPunkCoin | `handoffAdmin(safe)` (atomic Ownable + DEFAULT_ADMIN_ROLE) | owner = Safe ✓, deployer admin = false ✓ |
| SolarPunkOption | grant + revoke DEFAULT_ADMIN_ROLE | Safe has role ✓, deployer revoked ✓ |
| ProtocolTreasury | grant + revoke DEFAULT_ADMIN_ROLE | Safe has role ✓, deployer revoked ✓ |

### 6.3 Codex independent code review (2026-04-30)

5 confirmed findings, all fixed and committed (`5176317`):

| Finding | Fix |
|---|---|
| `setStabilityFeeShare` lacked governance timelock | Added `onlyGovernanceApproved` modifier and `actionIdSetStabilityFeeShare()` helper |
| `withdrawMargin` had no expiry guard | Added `SeriesExpired` revert post-expiry; settlement must use `settle()` |
| `cumulativeSurplusKwh` displayed as 1e18-scaled (wrong; it's raw integer) | Fixed in frontend `MarketStats.jsx`, SDK `chain_client.py`, keeper `nasa_keeper.js` |
| NASA keeper pushed index at 1e18 scale instead of `priceDecimals = 6` | Changed `PRICE_SCALE = 1_000_000` and rescaled all `updateIndex` calls |
| `DISBURSER_ROLE` granted to deployer EOA instead of SolarPunkCoin contract | Fixed live on Sepolia. SolarPunkCoin now has `DISBURSER_ROLE`; deployer EOA no longer has it. |

Two regression tests added (test count went from 77 to 79).

### 6.4 Stress test memo (`PROTOCOL_MATURITY_REPORT_2026.md`)

90-day simulation under 200% volatility + stochastic jumps:

- 150% margin baseline → 11% insolvency rate (legacy)
- **250% IM / 125% MM → 80.24% unassisted survival rate** (recommended next pilot configuration; current Sepolia deployment remains at 150% / 75%)
- 99% VaR for 100 MWh / $10k notional pilot exposure: **$171,263** insurance fund drain
- Scaling ratio: $1.71 of insurance capital supports ~1 kWh of risk-boxed exposure

The memo defines the "risk-boxed pilot" envelope — open-interest caps + 250% IM + bonded oracle — under which the protocol is safer to operate before formal audit. The current Sepolia deployment is a proof surface and has not yet been reparameterized to that envelope.

### 6.5 Grant draft refresh (2026-04-30)

Primary drafts updated to reflect post-M3, post-Codex state:
- `GRANT_SUBMISSIONS/ETHEREUM_ESP_APPLICATION.txt` — restructured budget (removed Solvency Reserve ask), added all 5 contract addresses, multisig + timelock, NASA keeper, Codex review
- `GRANT_SUBMISSIONS/CHAINLINK/BUILD_APPLICATION.md` — fixed token model (SPK is a peg-controlled stablecoin; pledged $SPNK governance token instead, or 5% protocol fee share)
- Older EF Academic, Energy Web, Gitcoin, Polygon, and shared grant drafts are archived under `docs/archive/legacy-grant-submissions/` and are not current submission copy.

---

## 7. Design Decisions and Nuances (the "why X not Y" list)

### 7.1 Why a stablecoin AND a clearinghouse, not just one?

The clearinghouse needs collateral. SPK serves as native collateral for option positions, and its peg mechanism provides stable accounting. They could be separated, but the integration reduces friction for energy operators who'd otherwise need to bridge USDC. Trade-off: tighter coupling = larger blast radius if either contract has a bug.

### 7.2 Why 250% IM / 125% MM (very conservative)?

Stress testing at 150% showed 11% insolvency under realistic energy-market volatility (200% annualized + jumps). Energy prices have fatter tails than equities; 250% gives the protocol survival headroom under documented stress while still allowing 4× leverage. This is intentionally conservative — real DeFi options use 110-150% — but defensible given the tail risk profile.

### 7.3 Why a separate StabilityPool contract?

Original design used `address(this)` (the SPK contract itself) as the stability pool. That creates blast-radius coupling: a bug in SPK's burn path could drain peg-stability funds. Splitting into a dedicated contract with role-gated withdrawals isolates the failure mode. Adds complexity (now there's a `DISBURSER_ROLE` to wire correctly — and we got it wrong on first deployment).

### 7.4 Why a 1-of-1 Safe?

Real multisig requires multiple trusted signers, which a solo Master's student doesn't have today. The 1-of-1 Safe still gives the structural benefits — separation between "deployer EOA" and "admin authority," visibility of all admin actions in the Safe UI, ability to scale signer threshold later without a new contract. Threshold expansion to 2-of-3 or 3-of-5 is M4 scope.

### 7.5 Why 24h governance delay (not longer)?

Long enough for users to observe and react to parameter changes; short enough that a solo operator can run the protocol without 7-day lead time on every adjustment. Mainnet may want 72h+; testnet 24h is calibrated for active development.

### 7.6 Why NASA POWER (not a paid feed)?

Free, global, satellite-derived (no surface-station coverage gaps), publicly auditable, and academic-publication standard. The 2-4 week publication lag is mitigated by the 35-day lookback window in the keeper. For mainnet, real-time grid data (ERCOT/CAISO/Taiwan TPC) would supplement but not replace satellite truth.

### 7.7 Why option index at `priceDecimals = 6` (not 1e18)?

The deployed `SolarPunkOption.priceDecimals = 6` from the original deployment. The keeper initially pushed 1e18-scaled values, which would have made every call option appear ~1e12 ITM. Codex caught this; the fix uses `PRICE_SCALE = 1_000_000`. This is a deployed-contract constraint, not a redesign.

### 7.8 Why a "single-sided" clearinghouse design?

The protocol clears long positions against an insurance fund (rather than netting longs vs. shorts). This is a documented design choice for v1, prioritizing simplicity and operator UX. v2 scope considers two-sided netting once liquidity supports it. The maturity memo explicitly bounds the v1 envelope.

### 7.9 Why MIT-licensed everything?

Public-good positioning + grant-program alignment (EF, Gitcoin, Chainlink BUILD all favor MIT/Apache). Also: an academic thesis with copyrighted code is a contradiction.

### 7.10 What's *not* yet in the design

- No multi-oracle aggregation (single oracle = single point of failure for settlement); M4 scope
- No cross-chain settlement (CCIP integration pending Chainlink BUILD or equivalent funding)
- No two-sided clearing (long vs. short netting); v2 scope
- No formal verification of invariants (audit prep covers this); pre-mainnet scope

---

## 8. Outstanding Items

### 8.1 Pre-grant submission

- [ ] Keep the daily keeper running and monitor GitHub Actions for failed cron runs.
- [ ] Keep grant-facing docs aligned with `EVIDENCE.md`, `CURRENT_STATUS.md`, and the latest `state/keeper_logs/summary.json`.

### 8.2 Pre-mainnet

- [ ] Formal security audit (Code4rena, Sherlock, or equivalent) — primary use of grant funds
- [ ] Multi-oracle aggregation for settlement index (currently single ORACLE_ROLE)
- [ ] Expand Safe signer threshold from 1-of-1 to ≥2-of-N
- [ ] Connect ChainlinkOracleAdapter to a real energy price feed (no Sepolia feed currently exists)
- [ ] Document v2 design for two-sided clearing and CCIP integration
- [ ] Counterparty pilot LOIs (1+ solar operator or development bank)

### 8.3 Thesis defense (June 2026)

- [ ] Pillar 1 paper: bias-corrected CEIR regression + Chow test results
- [ ] Pillar 2 paper: empirical pricing accuracy vs. Black-Scholes baseline on NASA data
- [ ] Pillar 3 paper: mechanism design of decentralized energy clearinghouse
- [ ] Defense slides + recorded walkthrough

### 8.4 Grant submission queue

- [ ] Ethereum ESP — small-scope $12-25k audit-prep ask; submit this week
- [ ] EF Academic — inquiry email (round not yet open); send same day
- [ ] Chainlink BUILD — review token model section, decide Option A vs. B, submit
- [ ] Gitcoin Round 21 — apply if open; low ceiling but high hit rate
- [ ] One climate-track hackathon — submit existing protocol as entry

---

## 9. How to Run Everything

```bash
# Install dependencies
npm install

# Compile + run all tests
npx hardhat compile
npx hardhat test

# Run specific test suite
npx hardhat test test/SolarPunkCoin.test.js

# Local protocol demo
npm run demo:treasury

# Deploy full stack to Sepolia (requires .env)
npx hardhat run scripts/deploy_testnet_full.js --network sepolia

# M3 security setup (idempotent)
npx hardhat run scripts/setup_m3_security.js --network sepolia

# Multisig handoff (idempotent)
npx hardhat run scripts/setup_multisig_handoff.js --network sepolia

# Verify historical DISBURSER_ROLE fix state
npx hardhat run scripts/fix_disburser_role.js --network sepolia

# Run interaction proof against live deployment
npx hardhat run scripts/run_interaction_proof.js --network sepolia

# Manual NASA keeper run
npx hardhat run scripts/nasa_keeper.js --network sepolia

# Frontend dev server
cd frontend && npm install && npm run dev

# Python SDK chain client (read-only)
python -m spk_derivatives.chain_client
```

### 9.1 Required environment

`.env` (not committed):
```
PRIVATE_KEY=0x...                 # Deployer key (now powerless on contracts; still needed for keeper)
SEPOLIA_RPC=https://...           # Sepolia RPC endpoint
ETHERSCAN_API_KEY=...             # For source verification
```

`frontend/.env`:
```
VITE_SPK_ADDRESS=0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F
VITE_OPTION_ADDRESS=0xe40A88398b5f90D038f7A6F1f122112DCD9e4104
VITE_TREASURY_ADDRESS=0x138e793f095a33D2790349eC1066FED3A756dd2c
VITE_USDC_ADDRESS=0xa467ab7BD1143fB1bF435097b4c72910AbBC1fe2
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

GitHub Actions secrets (for keeper workflow):
- `KEEPER_PRIVATE_KEY`
- `SEPOLIA_RPC`

---

## 10. Grant Strategy and Prospects

### 10.1 Honest assessment

This is a *thesis-stage prototype with a live testnet pilot*, not a production-ready protocol. Frame all grant pitches accordingly. Reviewers can verify everything by clicking Etherscan; do not overclaim.

### 10.2 Tier-by-tier outlook

| Program | Realistic ask | Realistic award | Approval odds | Form |
|---|---|---|---|---|
| Ethereum ESP (small-scope) | $12-25k | $12-25k | **45-55%** | Cash |
| EF Academic (when round opens) | $30-50k | $30-50k | **25-35%** | Cash |
| Chainlink BUILD | N/A (services) | $20-100k equiv. in services | **15-20%** | Services + ecosystem access (NOT cash) |
| Polygon CGP (requires redeploy) | $5-50k | $5-30k | **20-40%** | Cash + token incentives |
| Gitcoin Round 21 | N/A | $500-5k typical | **70%+** if applied | Quadratic-matched donations |
| Climate-track hackathon | N/A | $1-15k per prize | **30-40%** if submitted polished | Cash prize |

### 10.3 Recommended sequence

1. **This week:** Submit Ethereum ESP at $12-25k narrow audit-prep scope; send EF Academic inquiry email; apply to Gitcoin if Round 21 is open.
2. **Next 2-4 weeks:** Submit one hackathon entry; revisit Chainlink BUILD with token-model decision made.
3. **2-3 months out:** Whether grants land or not, this work supports thesis defense (June 2026) and PhD applications (autumn 2026).

### 10.4 What grants ask in exchange (lock-in)

- **ESP / EF Academic:** open source, milestone reports, attribution. Cleanest terms; near-zero lock-in.
- **Chainlink BUILD:** 3-5% of governance token *or* 5% of protocol fees, plus oracle exclusivity. Real architectural commitment.
- **Polygon CGP:** chain lock-in (must deploy primarily on Polygon). Painful if you later want Arbitrum-first.
- **Gitcoin / hackathons:** essentially nothing.

### 10.5 The single highest-leverage move

A Letter of Intent (even informal email) from a real solar operator, energy cooperative, or development bank saying "we'd consider piloting SolarPunk under appropriate conditions" would 2× grant odds across all programs. It's the missing piece in the current pitch — without it, "$500M annual market" is asserted, not demonstrated.

---

## 11. Career and Value Prospects (Beyond Grants)

The grants are real but probabilistic. The portfolio value is near-certain.

### 11.1 What the artifacts are worth

For a Master's-level finance candidate in 2026, having:
- A live, source-verified DeFi protocol on Ethereum (5 contracts, multisig, governance, daily oracle)
- A Codex-reviewed Solidity codebase (79 tests, all findings fixed)
- A Python pricing library on PyPI (v0.5.0)
- A daily on-chain proof anchor running for months
- A defended Master's thesis tying it all together

…is, conservatively, a **$100-300k career-NPV asset**. It opens roles that an Excel-modelled thesis does not.

### 11.2 Realistic career paths

| Path | Realistic salary | What this portfolio unlocks |
|---|---|---|
| Quant / DeFi engineer (US/SG/HK) | $80-180k base | Proof-of-shipping ability is the screening criterion |
| Climate-tech / RWA finance role | $70-130k | Niche but growing; very few candidates have this combo |
| Asia-region finance role (Taiwan/SG) | $40-90k base | Skips 2-3 years of seniority gating |
| **Funded PhD admission** | $30-50k/yr × 4-5 yrs | Top programs (Imperial, ETH, Oxford, MIT Sloan) actively want this profile |
| Co-founder / employee #1 at seed-stage DeFi or climate-tech startup | $60-100k + 0.5-2% equity | Lottery upside; expected value is real |

### 11.3 Honest probabilities

- Probability of $0 grant cash from current applications: ~30%
- Probability of $5-10k+ in grant cash within 6 months: ~55%
- Probability of $25k+ in grant cash within 6 months: ~25%
- **Probability of the portfolio paying off in career value: ~95%**

The first three are uncertain. The fourth is what actually matters and is already largely locked in by the work that's been done.

### 11.4 What would waste effort

- Spending another 2 weeks polishing applications instead of submitting
- Building features purely for grant pitches rather than thesis merit
- Treating grants as the goal rather than the side outcome of the thesis

The protocol is dual-purpose. The thesis justifies the work; the grants are upside. Don't reverse the priority.

---

## 12. Roadmap

| Milestone | Definition | Status |
|---|---|---|
| **M1: Repo credibility** | Tests, docs, version control discipline | ✓ Complete (Apr 2026) |
| **M2: External inspectability** | Sepolia deployment, Etherscan verification, interaction proof | ✓ Complete (2026-04-20) |
| **M3: Security credibility** | Multisig, timelock, bonds, separated stability pool, oracle adapter, independent code review | ✓ Architecture complete; **formal audit remaining** (gated by funding) |
| **M3.5: Risk-boxed pilot** | Live operation under open-interest caps and 250% IM | ⚠ Next pilot target — stress memo ready; current Sepolia remains 150% / 75% |
| **M4: Pilot counterparty** | LOI from solar operator / development bank; first real-world hedge | ☐ Not started |
| **M5: Audited L2 mainnet** | Code4rena/Sherlock audit + Arbitrum/Optimism deployment + multi-signer Safe | ☐ Gated on funding |
| **M6: Production protocol** | Two-sided clearing, multi-oracle, CCIP, full operator marketplace | ☐ v2 scope |

### 12.1 Thesis timeline (parallel)

- **April-May 2026:** Pillar 1 + 2 paper drafts; defense prep
- **June 2026:** Defense
- **Autumn 2026:** PhD applications (if pursuing); journal submissions

---

## 13. Contacts and Handoff Information

- **Author:** Christopher Ongko
- **Institution:** Yuan Ze University, Taiwan — Finance Master's
- **Email:** s1133958@mail.yzu.edu.tw
- **GitHub:** https://github.com/Spectating101
- **ORCID:** 0009-0007-9339-9098
- **Deployer address:** `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54` (no admin authority remaining)
- **Safe (admin):** `0xB95586775C73feB0154828c77832E106425C818A`

### 13.1 If you are picking up this project

Read in this order:
1. This document (`MASTER_HANDOFF.md`) — full picture
2. `PROTOCOL_MATURITY_REPORT_2026.md` — risk envelope and stress test results
3. `THREAT_MODEL.md` — documented attack surfaces
4. `TRUST_ASSUMPTIONS.md` — what is and isn't trusted
5. `docs/specs/` — contract specifications
6. `contracts/` source — final ground truth

Then run `npx hardhat test` and `python -m spk_derivatives.chain_client` to verify the live state matches what this document claims.

### 13.2 Most important single fact

The protocol is **live, breathing, and producing daily on-chain artifacts** — not a sketch. Every claim in this document is verifiable on Sepolia or in this repo. If a future reviewer disputes anything, the resolution path is "click Etherscan" or "run the test suite," not "argue with the doc."

---

*End of master handoff. Last verified 2026-04-30.*
