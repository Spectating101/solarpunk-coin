# SolarPunk Protocol

SolarPunk is **renewable-energy financial infrastructure** that turns verified energy value into programmable settlement, hedging, and treasury flows — and the implementation layer of a Finance Master's thesis at Yuan Ze University.

**Status (May 2026):** Live testnet pilot on Ethereum Sepolia. 79/79 tests. Daily NASA → on-chain oracle keeper running since April 20. Independent code review complete.

---

## Quick links

| Document | Purpose |
|---|---|
| [`EVIDENCE.md`](./EVIDENCE.md) | **Start here for external reviewers** — clickable receipts for every claim |
| [`MASTER_HANDOFF.md`](./MASTER_HANDOFF.md) | Full context: architecture, design decisions, operations, prospects |
| [`CURRENT_STATUS.md`](./CURRENT_STATUS.md) | One-page stage snapshot |
| [`PROTOCOL_MATURITY_REPORT_2026.md`](./PROTOCOL_MATURITY_REPORT_2026.md) | 90-day stress test memo and solvency envelope |
| [`THREAT_MODEL.md`](./THREAT_MODEL.md) | Attack surface and trust assumptions |

---

## What it is

Three core contracts plus supporting infrastructure:

- **`SolarPunkCoin`** — energy-backed stablecoin with PI controller for peg stability, oracle-gated minting, reserve ratio checks, bond-gated operators
- **`SolarPunkOption`** — margin-based clearinghouse for European energy index options (250% IM / 125% MM, cash-settled, auto-liquidation)
- **`ProtocolTreasury`** — fee vault with 4-bucket budget split, keeper bond escrow with slashing
- **`StabilityPool`** — dedicated peg-stability vault (separated from coin contract for blast-radius isolation)
- **`ChainlinkOracleAdapter`** — bridges AggregatorV3Interface feeds to internal contract surfaces, normalises decimals to 1e18

---

## Live deployment (Sepolia, April 2026 — all source-verified)

| Contract | Address | Etherscan |
|---|---|---|
| SolarPunkCoin | `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F` | [Verified ✓](https://sepolia.etherscan.io/address/0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F#code) |
| SolarPunkOption | `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104` | [Verified ✓](https://sepolia.etherscan.io/address/0xe40A88398b5f90D038f7A6F1f122112DCD9e4104#code) |
| ProtocolTreasury | `0x138e793f095a33D2790349eC1066FED3A756dd2c` | [Verified ✓](https://sepolia.etherscan.io/address/0x138e793f095a33D2790349eC1066FED3A756dd2c#code) |
| StabilityPool | `0xb9c2Ac8166edFc899b591bc51746d75bFCEca086` | Verified |
| ChainlinkOracleAdapter | `0x87B64cd4cE7C95a3A2465aE1e4E71582A64820C9` | Verified |
| Safe (admin) | `0xB95586775C73feB0154828c77832E106425C818A` | [Safe app](https://app.safe.global/sep:0xB95586775C73feB0154828c77832E106425C818A) |

---

## What is verified and running

- **79/79 smart contract tests** — `npx hardhat test`
- **Independent code review** (Codex, April 2026) — 5 findings fixed, regression tests added (commit `5176317`)
- **Safe multisig admin** — deployer EOA has zero authority on any contract
- **24h governance timelock** — active on all parameter changes
- **100 USDC bond escrow** — for oracle, minter, liquidator roles
- **Daily NASA keeper** — fetches real Taoyuan irradiance, pushes to Sepolia, commits log back to repo
  - Keeper logs: `state/keeper_logs/` (YYYY-MM-DD.json with on-chain TX hashes)
  - Workflow: `.github/workflows/nasa_keeper.yml`
- **Python SDK** — `pip install spk-derivatives` (v0.5.0, PyPI)
- **Frontend** — Vite/React, reads live Sepolia state every 30 seconds

---

## What does not yet exist

- No formal security audit (required for mainnet; ~$25k; primary grant deliverable)
- 1-of-1 Safe (signer threshold expansion is post-grant)
- No counterparty pilots (highest-leverage gap — see `EVIDENCE.md` §4)
- Mainnet: NO_GO until audit

---

## How to run it

```bash
# Install
npm install

# Run all tests (79 passing)
npx hardhat test

# Frontend dev server (reads live Sepolia)
cd frontend && npm install && npm run dev

# Python SDK chain client (reads live Sepolia)
pip install spk-derivatives web3
python -m spk_derivatives.chain_client

# Manual NASA keeper run
npx hardhat run scripts/nasa_keeper.js --network sepolia

# Check DISBURSER_ROLE state
npx hardhat run scripts/fix_disburser_role.js --network sepolia
```

---

## Academic foundation

This repo is the implementation layer of a Finance Master's thesis (Yuan Ze University) with three pillars:

1. **Pillar 1 — CEIR analysis:** Amihud-Hurvich bias-corrected predictive regression, Chow structural break test, block bootstrap (2000 reps), China 2021 mining ban as natural experiment. β = −0.206 pre-ban (p < 0.001), β = −0.080 post-ban, Chow F = 4.786 (p = 0.0009).

2. **Pillar 2 — Physics-based pricing:** NASA satellite irradiance → volatility calibration (σ = 189.5%, Jarque-Bera p = 0.349), binomial trees, Monte Carlo. 2.08% divergence at 20,000 paths. Validated across 5 global markets.

3. **Pillar 3 — Contract feasibility:** Oracle tolerance thresholds (Taiwan: 21.7% error for VR ≥ 95%), VaR-based margin (motivates 10-15× spot collateral, driving clearinghouse structure). Supplemented by live Sepolia deployment (Appendix D of thesis).

Empirical data: `thesis_package/empirical_results/`
Pricing library: `energy_derivatives/spk_derivatives/`
Thesis draft: `thesis-draft.md`

---

## Grant applications

Refreshed drafts (post-M3, post-Codex, May 2026):
- `GRANT_SUBMISSIONS/ETHEREUM_ESP_APPLICATION.txt`
- `GRANT_SUBMISSIONS/CHAINLINK/BUILD_APPLICATION.md`
- `GRANT_SUBMISSIONS/EF_ACADEMIC/EF_ACADEMIC_GRANTS_APPLICATION.md`

See `GRANT_SUBMISSIONS/SHARED/GRANT_OPPORTUNITIES_2026.md` for full opportunity landscape.
