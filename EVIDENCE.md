# SolarPunk Protocol — Evidence Register

**Last updated:** 2026-05-17
**Purpose:** Flat, clickable receipts for every empirical, operational, and external claim made about this project. Structured so a skeptical reviewer can verify any claim in under 60 seconds without reading the full handoff.

This document answers: **"Is there actual evidence, or just descriptions of evidence?"**

---

## 1. Empirical Evidence (numbers from real data runs)

### 1.1 CEIR Predictive Regression (Pillar 1)

| Claim | Value | Artifact |
|---|---|---|
| Pre-ban CEIR coefficient | β = −0.257 | `thesis_package/empirical_results/ceir_analysis_summary.csv` |
| Post-ban CEIR coefficient | β = −0.634 | Same file |
| Structural break (Chow test) | p = 1.11e-16 | Same file |
| Block bootstrap pre-ban 95% CI | [−0.371, −0.002], 97.4% draws β < 0 | `thesis-draft.md` §2.7 |
| Pre-ban sample size | N = 898 weeks | `thesis_package/empirical_results/ceir_analysis_summary.csv` |
| Post-ban sample size | N = 1,044 weeks | Same file |
| Mechanism test: 2.8× stronger in fearful markets | β_fearful = −0.500 | `thesis-draft.md` §2.7 |

**Raw dataset:** `thesis_package/empirical_results/bitcoin_ceir_analysis_ready.csv` (~400k rows, 2019–present)

### 1.2 Physics-Based Volatility Calibration (Pillar 2)

| Claim | Value | Artifact |
|---|---|---|
| Taiwan irradiance volatility | σ = 189.5% (filtered) | `thesis_package/empirical_results/calibration_diagnostics_real.csv` |
| Jarque-Bera normality test | p = 0.349 (fail to reject) | Same file |
| Data: NASA POWER, central Taiwan | 23.5°N, 120.9°E, 2019–2024 | `scripts/nasa_keeper.js` fetches 24.99°N, 121.30°E (Taoyuan, updated) |
| Binomial vs. Monte Carlo divergence | 2.08% at 20,000 paths | `thesis_package/empirical_results/binomial_convergence.csv` |
| Collar net cost (Brazil) | 6.73% of spot | `thesis_package/empirical_results/collar_sigma_sweep.csv` |
| Collar net cost (Germany) | 1.38% of spot | Same file |
| Cross-location validation | 5 markets coherent | `thesis_package/empirical_results/cross_location_pricing.csv` |

### 1.3 Stress Test / Solvency Envelope (Pillar 3 + Protocol Maturity)

| Claim | Value | Artifact |
|---|---|---|
| Simulation type | 90-day, 200% volatility, stochastic jumps | `PROTOCOL_MATURITY_REPORT_2026.md` §3 |
| Legacy margin (150%) insolvency rate | 11% | Same memo §3 |
| Hardened margin (250% IM / 125% MM) survival | 80.24% unassisted | Same memo §3 |
| 99% VaR for 100 MWh pilot | $171,263 insurance fund drain | Same memo §4 |
| Scaling ratio | $1.71 capital per 1 kWh risk-boxed | Same memo §4 |
| Script | `scripts/stress_test_margin.py` | Run: `python scripts/stress_test_margin.py` |

---

## 2. Operational Evidence (system runs, produces consistent outputs)

### 2.1 On-chain Deployment — Source-Verified Sepolia Contracts

All 5 contracts deployed April 2026. Click any Etherscan link to verify source code matches this repo.

| Contract | Address | Etherscan |
|---|---|---|
| SolarPunkCoin | `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F` | [verify](https://sepolia.etherscan.io/address/0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F#code) |
| SolarPunkOption | `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104` | [verify](https://sepolia.etherscan.io/address/0xe40A88398b5f90D038f7A6F1f122112DCD9e4104#code) |
| ProtocolTreasury | `0x138e793f095a33D2790349eC1066FED3A756dd2c` | [verify](https://sepolia.etherscan.io/address/0x138e793f095a33D2790349eC1066FED3A756dd2c#code) |
| StabilityPool | `0xb9c2Ac8166edFc899b591bc51746d75bFCEca086` | [verify](https://sepolia.etherscan.io/address/0xb9c2Ac8166edFc899b591bc51746d75bFCEca086#code) |
| ChainlinkOracleAdapter | `0x87B64cd4cE7C95a3A2465aE1e4E71582A64820C9` | [verify](https://sepolia.etherscan.io/address/0x87B64cd4cE7C95a3A2465aE1e4E71582A64820C9#code) |

**Admin:** Safe multisig `0xB95586775C73feB0154828c77832E106425C818A` holds DEFAULT_ADMIN_ROLE on the three core contracts. `StabilityPool` remains deployer-administered, but `DISBURSER_ROLE` is correctly assigned to `SolarPunkCoin` and revoked from the deployer. [Safe app](https://app.safe.global/sep:0xB95586775C73feB0154828c77832E106425C818A)

### 2.2 Governance Parameters (on-chain, verifiable)

| Parameter | Value | How to verify |
|---|---|---|
| Governance timelock | 86,400s (24h) on all 3 core contracts | Call `governanceDelay()` on each contract |
| Initial margin | Live Sepolia: 150%; next pilot hardening target: 250% | Call `initialMarginBps()` on SolarPunkOption (currently returns 15000); see maturity memo for 250% stress-tested recommendation |
| Maintenance margin | Live Sepolia: 75%; next pilot hardening target: 125% | Call `maintenanceMarginBps()` (currently returns 7500); see maturity memo for 125% stress-tested recommendation |
| Bond requirement | 100 USDC for all roles | Call `bondRequirements(ORACLE_ROLE)` on SolarPunkCoin |

### 2.3 Interaction Proof — 7 Confirmed Sepolia Transactions

These prove the protocol executes correctly end-to-end, not just compiles.

| Operation | TX hash |
|---|---|
| Deposit 100k USDC reserve | [0xd37a51a9...](https://sepolia.etherscan.io/tx/0xd37a51a937ae32a699d77017bda6dd33a7ef1b78c50d75beb230595a3fde15a7) |
| Oracle price update $1.00 | [0xf8b92efa...](https://sepolia.etherscan.io/tx/0xf8b92efacc6da46df8fea94978f090516c665ee94419daa19200415ea86f8f4b) |
| Mint SPK from 10,000 kWh surplus | [0xb272ce02...](https://sepolia.etherscan.io/tx/0xb272ce02dad6911c8498006b9a198b32220cb35aa7bfb4df0df0d57a4368db33) |
| Redeem 100 SPK for energy | [0xfb2811c9...](https://sepolia.etherscan.io/tx/0xfb2811c9ad175987234f9ae177c5babd8a639ca6a04598bf7ce011510b4dc861) |
| Open long call option | [0x26390f64...](https://sepolia.etherscan.io/tx/0x26390f644af9ab5c6686a56761953fe044f57961897c7879fa400574671785f8) |
| Mark position to $1.05 | [0x17b3524c...](https://sepolia.etherscan.io/tx/0x17b3524c2d14c23df77c19dd6de91c84a3d901cdd0672d33efc2940d94cff961) |
| updateOraclePriceAndAdjust | [0x4bce17ac...](https://sepolia.etherscan.io/tx/0x4bce17ac407229402943fc6e6a9e70bda12dd0cc2820d0c4a7e20402a8bcb3a2) |

### 2.4 Daily NASA → Sepolia Oracle Keeper (Automated)

System that fetches real satellite data and pushes it to the live contracts every day. Not a demo — running continuously on GitHub Actions cron at 01:00 UTC.

**Current summary:** 20 successful runs, latest successful run `2026-05-16`, current success streak 18 days. See `docs/project/DAILY_EXPERIMENT_STATUS.md` and `state/keeper_logs/summary.json` for the complete rolling table.

| Date | NASA date used | GHI (kWh/m²) | Normalised index | On-chain tx |
|---|---|---|---|---|
| 2026-04-20 | 2026-04-15 | 4.667 | 1.4538 (above avg) | [0xb5e9a2...](https://sepolia.etherscan.io/tx/0xb5e9a2fde6e5a96e8b503eb25085a2f34d9ae6f91a4fe5de6c026a82fdc4c018) |
| 2026-04-21 | (see log) | — | — | see `state/keeper_logs/2026-04-21.json` |
| 2026-04-29 | 2026-04-24 | 0.792 | 0.2467 (below avg) | [0x615e06...](https://sepolia.etherscan.io/tx/0x615e06362fbf46d5e02ac5b54277276f565ad13991432cbe6966d199638484ab) |
| 2026-05-05 | 2026-04-30 | 1.193 | 0.3715 (below avg) | [0xb616c3...](https://sepolia.etherscan.io/tx/0xb616c3c4b4eec4f078d8665f6fe46ed7821d2cb136408f61d687371c043aeb4d) |
| 2026-05-14 | 2026-05-09 | 2.0808 | 0.5979 (below avg) | [0x20162f...](https://sepolia.etherscan.io/tx/0x20162f08923cddf07e3455ce3eeecfd69ca4bcd7baeead84e6e2b1e4fe6cf856) |
| 2026-05-16 | 2026-05-11 | 3.2566 | 0.9358 (near avg) | [0xcb92e9...](https://sepolia.etherscan.io/tx/0xcb92e9b6583c5831b6d5148442d8b821d062475bed74f16ff5daf0bcb6689be8) |

**Log files:** `state/keeper_logs/YYYY-MM-DD.json` — each entry contains: NASA date, GHI value, monthly mean, normalised index, source hash, 3 on-chain TX hashes, and full protocol state snapshot.

**Source hash integrity:** Each oracle push is signed with `keccak256(NASA_POWER_ALLSKY_SFC_SW_DWN, lat=24990000, lon=121300000, date_ms)` — independently reproducible from the NASA POWER API.

**Workflow:** `.github/workflows/nasa_keeper.yml` — public, auditable, runs on GitHub's infrastructure.

### 2.5 SPK Attested Mint Product Proof

This proves the new single-product path on Sepolia: signed raw meter readings -> registry/signature/quality validation -> accepted meter bundle -> deterministic source hash -> oracle signature -> `mintFromSurplusAttestation` -> minted SPK.

| Claim | Value | Artifact |
|---|---|---|
| Raw signed meter readings | 4 | `data/attestations/raw_meter_readings.json` |
| Registered meter identities | 2 | `data/attestations/meter_registry.json` |
| Verified meter signatures | 2 | `state/attestations/latest_attestation_bundle.json` |
| Accepted sample meter records | 2 | Same file |
| Rejected sample meter records | 2 (duplicate nonce, low quality) | Same file |
| Accepted surplus | 2,606.7 kWh | Same file |
| Attestation-enabled SPK contract | `0x8ceDa149EDE44078bf151b3334513916a84df820` | `docs/project/ATTESTED_SPK_DEPLOYMENT.md` |
| On-chain integer surplus consumed | 2,606 kWh | `state/proofs/sepolia_spk_attested_mint_proof.json` |
| Mint result | 130.1697 SPK | Same file |
| Sepolia mint tx | `0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d` | [Etherscan](https://sepolia.etherscan.io/tx/0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d) |
| Public readback checks | 7/7 passed | `docs/product/SPK_PUBLIC_READBACK.md` |
| Source hash | `0xe3f1d7e10fbe38a0951943415121a25ca8b9e031634422576bb29ef9a576a5c8` | Same file |
| Product dossier | Generated | `docs/product/SPK_PRODUCT_EMPIRICS.md` |

Scope note: this is a public Sepolia proof stack, not the production-governed deployment and not hardware-certified meter finality.

### 2.6 Pilot Meter CSV Adapter

This is the first practical bridge from a meter/inverter export into the same signed-reading verifier used by the public SPK proof.

| Claim | Value | Artifact |
|---|---|---|
| Meter onboarding command | Available | `scripts/onboard_meter.js` |
| CSV import command | Available | `scripts/import_meter_csv.js` |
| Sample CSV export | 2 rows | `data/attestations/sample_meter_export.csv` |
| Imported signed readings | 2 rows | `data/attestations/raw_meter_readings_from_csv.json` |
| CSV-derived accepted records | 2 accepted, 0 rejected | `docs/project/METER_CSV_ATTESTATION_BUNDLE.md` |
| CSV-derived surplus | 1,985.5 kWh | Same file |
| Onboarding demo receipt | Generated | `docs/project/METER_ONBOARDING_RECEIPT.md` |
| Adapter tests | 7 additional Node tests | `test-node/meter_csv_import.test.js`, `test-node/meter_onboarding.test.js` |

Scope note: this is not hardware certification. It is the pilot-ingestion bridge needed before connecting a real meter gateway or inverter API.

### 2.7 SPK Currency Framework Contract

This is the first internal currency-framework layer around SPK. It does not mint SPK; it uses SPK as the settlement asset.

| Claim | Value | Artifact |
|---|---|---|
| Invoice settlement | Implemented with hashed invoice replay protection | `contracts/SolarPunkCurrencySystem.sol` |
| Energy redemption receipt | Implemented: transfer SPK into registry, burn via `redeemForEnergy`, record owed kWh | Same file |
| Delivery resolution | Pending, fulfilled, shortfall, disputed states | Same file |
| Contract tests | 6 additional Hardhat tests | `test/SolarPunkCurrencySystem.test.js` |
| Local field receipt loop | 130.1697 SPK minted, 75 SPK settled, 20 SPK redeemed, 400 kWh delivered | `docs/product/FIELD_RECEIPT_LOOP.md` |
| Internal readiness report | 8/8 checks pass | `docs/product/CURRENCY_FRAMEWORK_READINESS.md` |
| Theory/comparables anchor | Positions SPK against RECs, granular certificates, Green Button/ESPI, Energy Web, SolarCoin, Powerledger, BIS tokenisation, and FSB stablecoin controls | `docs/product/CURRENCY_THEORY_AND_COMPARABLES.md` |

Scope note: this is a local contract/test/readiness layer, not a deployed Sepolia/mainnet currency stack yet.

### 2.8 Multi-Resource Benchmark Lab

This expands the product proof from "solar-only story" into a resource benchmark layer while preserving the SPK mint rule: estimates do not mint; accepted signed meter/inverter surplus attestations mint.

| Claim | Value | Artifact |
|---|---|---|
| NASA POWER live fetch | `ALLSKY_SFC_SW_DWN`, `WS10M`, `T2M` for Taoyuan, 2026-05-01 -> 2026-05-11 | `state/product/resource_benchmark_lab.json` |
| Standard PV model | 10 kWdc, 20% module efficiency, 50 m2 panel area, 14% PVWatts-style loss | `docs/product/RESOURCE_BENCHMARK_LAB.md` |
| Latest solar production estimate | 2026-05-11 GHI `3.2566 kWh/m2/day` -> `28.0068 kWh/day` AC | Same file |
| Residential installed-cost assumption | `$3.15/Wdc`, `$31,500` before incentives for 10 kWdc | Same file |
| Wind resource-density estimate | NASA WS10M -> recoverable kWh/day per 50 m2 swept-area model | Same file |
| Geothermal/tidal/hydro/biomass | Benchmark-only capacity-factor models; require site data and metered generation before SPK use | Same file |
| Oil comparison | `1699.81 kWh` thermal per barrel; explicitly `not_eligible` for SPK minting | Same file |

Scope note: NASA resource estimates, capacity-factor models, and oil unit conversions are benchmarking inputs only. SPK issuance still requires the signed meter-attestation path.

### 2.9 Energy-Standard Economics

This is the raw economic/finance spine of the system: the gold-standard analogy, the issuance equation, the kWh/SPK basis, capacity scenarios, velocity sensitivity, and the finance risk register.

| Claim | Value | Artifact |
|---|---|---|
| Core framing | Energy-standard cryptocurrency: verified renewable-energy surplus replaces gold as the backing base | `docs/product/ENERGY_STANDARD_ECONOMICS.md` |
| Issuance equation | `gross_spk = accepted_surplus_kwh * energy_price_usd_per_kwh` | Same file |
| Current convertibility basis | `$0.05/kWh`, so `1 SPK = 20 kWh` basis | `state/product/energy_standard_economics.json` |
| Proof formula check | `2606 kWh * $0.05/kWh * (1 - 10 bps) = 130.1697 SPK` | Same file |
| 10 kW annual sensitivity | `10,038.12 kWh/year` -> `501.404094 SPK/year` at current basis | `state/product/energy_standard_scenarios.csv` |
| Utility-scale reference sensitivity | `100,381,200 kWh/year` -> `5,014,040.94 SPK/year` at current basis | Same file |
| Monetary function readiness | Issuance discipline implemented; unit of account, medium of exchange, deferred payment, and backing transparency partial; store of value not proven | `docs/product/ENERGY_STANDARD_ECONOMICS.md` |

Scope note: this is not a claim of legal money status, investment return, or production redemption. It is a testable monetary model over the existing proof stack.

### 2.10 Pilot CSV Receipt

This turns a practical meter/inverter CSV export into the same evidence shape reviewers need: accepted rows, rejected rows, surplus kWh, source hash, and mint preview.

| Claim | Value | Artifact |
|---|---|---|
| Receipt generator | Available | `scripts/pilot_csv_receipt.js` |
| Sample CSV rows | 2 | `data/attestations/sample_meter_export.csv` |
| Accepted rows | 2 accepted, 0 rejected | `docs/product/PILOT_CSV_RECEIPT.md` |
| Accepted surplus | 1,985.5 kWh | Same file |
| On-chain integer surplus preview | 1,985 kWh | Same file |
| Net SPK preview | 99.15075 SPK | Same file |
| Private-key boundary | No private key written to repo outputs | `state/product/pilot_csv_receipt.json` |
| Tests | 4 Node tests | `test-node/pilot_csv_receipt.test.js` |

Scope note: this is an operator-style ingestion receipt, not certified hardware finality or an on-chain mint.

### 2.11 Monetary Stress Harness

This exposes the economic side of the currency claim: redeemed SPK becomes owed kWh, physical delivery shortfalls become dollar liabilities, and reserve gaps are visible.

| Claim | Value | Artifact |
|---|---|---|
| Stress generator | Available | `scripts/monetary_stress_harness.js` |
| Scenario count | 5 | `docs/product/MONETARY_STRESS_HARNESS.md` |
| Conservation checks | All pass | `state/product/monetary_stress_harness.json` |
| Worst modeled shortfall liability | $4,011.232752 | Same file |
| Worst additional buffer required | $3,940.985988 | Same file |
| Scenario CSV | Generated | `state/product/monetary_stress_scenarios.csv` |
| Tests | 5 Node tests | `test-node/monetary_stress_harness.test.js` |

Scope note: this is an internal stress model, not a solvency guarantee. It intentionally shows where named reserve capital is required.

### 2.12 Energy-Money Simulation

This is the more direct "new currency system" model: real keeper-index resource signals feed a transparent monetary simulation for issuance, circulation, redemption, active supply, and reserve needs.

| Claim | Value | Artifact |
|---|---|---|
| Simulation generator | Available | `scripts/energy_money_simulation.js` |
| Resource signal | Recent real NASA POWER-derived Sepolia keeper-index days | `state/keeper_logs/summary.json` |
| Archetypes | 10 kW home, 250 kW neighborhood cluster, 1 MW commercial portfolio | `docs/product/ENERGY_MONEY_SIMULATION.md` |
| Observed-window issued SPK | 583.645668 SPK | `state/product/energy_money_simulation.json` |
| Annualized issued SPK projection | 15,216.476344 SPK | Same file |
| Conservation check | Pass | Same file |
| Daily simulation CSV | Generated | `state/product/energy_money_simulation_daily.csv` |
| Tests | 4 Node tests | `test-node/energy_money_simulation.test.js` |

Scope note: NASA/keeper resource signals are real; self-consumption, redemption, velocity, and shortfall values are explicit assumptions. Model-estimated surplus cannot mint SPK until replaced by signed meter/inverter attestations.

### 2.13 Governed Pilot Stack Scaffold

This is the deploy/readback path for moving from proof-scoped SPK to a governed testnet pilot stack that includes settlement and redemption.

| Claim | Value | Artifact |
|---|---|---|
| Deployment script | Available | `scripts/deploy_pilot_stack.js` |
| Readback script | Available | `scripts/read_pilot_stack.js` |
| Local deploy receipt | Generated on Hardhat | `docs/project/PILOT_STACK_DEPLOYMENT.md` |
| Stack contracts | MockUSDC, ProtocolTreasury, SolarPunkCoin, SolarPunkCurrencySystem | Same file |
| Test coverage | Markdown/readback helper tests | `test-node/pilot_stack_scripts.test.js` |

Scope note: the local Hardhat receipt proves the deploy script executes. Persistent readback is for Sepolia or a long-running local node.

### 2.14 Test Suite (Reproducible, Run by Anyone)

```bash
git clone https://github.com/Spectating101/solarpunk-coin
npm install
npx hardhat test
```

Expected output: **102 passing**, including signed surplus-attestation replay, reused-source, non-oracle, expired, future-window, empty-source, invalid-window rejection tests, and SPK currency-framework settlement/redemption tests.

All tests are integration tests against deployed Hardhat local node — not mocks of the contracts under test.

### 2.15 Python Pricing Library (Reproducible)

```bash
pip install spk-derivatives
python -m spk_derivatives.chain_client   # reads live Sepolia state
```

Published at PyPI as `spk-derivatives` v0.5.0. Source in `energy_derivatives/spk_derivatives/`.

---

## 3. Comparative Evidence

| Claim | Status |
|---|---|
| Black-Scholes baseline vs. binomial/MC convergence (2.08% divergence) | ✓ documented in thesis §3.4 |
| Cross-location pricing coherence (5 markets) | ✓ `cross_location_pricing.csv` |
| Energy-backed vs. gold vs. fiat monetary standard (7/7 vs. 3/7 vs. 1/7) | ✓ thesis §5 |
| 150% vs. 250% margin solvency comparison | ✓ `PROTOCOL_MATURITY_REPORT_2026.md` |
| **Energy-specific pricing vs. generic Black-Scholes on real data** | ⚠ gap — planned for Pillar 2 extension |

---

## 4. Adopted / User Evidence

| Claim | Status |
|---|---|
| Solar operator LOI or pilot agreement | ✗ **Not yet** — highest-leverage gap |
| Development bank engagement | ✗ Not yet |
| External user of the Python SDK | ✗ Not yet |
| Any testnet interaction by a non-deployer wallet | ✗ Not confirmed |

*This is the most significant evidence gap. A single LOI from a real energy operator converts "asserted demand" into "demonstrated demand" and materially changes grant and academic reviewer response.*

---

## 5. External Endorsement / Review Evidence

| Claim | Status | Artifact |
|---|---|---|
| Codex independent code review | ✓ April 2026, 5 findings identified and fixed | Commit `5176317` — diff shows all fixes + regression tests |
| Thesis advisor sign-off | ⚠ Not yet public | In progress |
| Academic conference / journal submission | ⚠ Not yet | Planned post-defense |
| Formal smart contract audit | ✗ Not yet | Requires funding (~$25k); primary grant use |
| AEDC (African Economic Dev. Conference) submission | ✓ Prior submission | See `submissions_log/` |

---

## 6. How to Re-Run Everything

### Empirical pipeline (Pillar 1)
```bash
cd empirical/
# regression and Chow test
python ceir_regression.py
# bootstrap
python ceir_bootstrap.py
```

### Pricing engine (Pillar 2)
```bash
cd thesis_package/
python options_pricing.py           # Taiwan base case
python -c "from spk_derivatives.pricing import *; print(binomial_call(0.0525, 0.0525, 1.895, 0.25, 0.05, 50))"
```

### Stress test (Pillar 3)
```bash
python scripts/stress_test_margin.py   # 90-day jump-diffusion, reproduces maturity memo
python scripts/simulate_economy.py     # multi-agent economy simulation
python scripts/simulate_black_swan.py  # tail-risk scenarios
```

### On-chain state (live read)
```bash
python -m spk_derivatives.chain_client  # requires: pip install spk-derivatives web3
npx hardhat run scripts/fix_disburser_role.js --network sepolia  # read DISBURSER_ROLE state
```

### Tests
```bash
npx hardhat test
```

---

## 7. Evidence Gap Summary

| Gap | Priority | What it unlocks |
|---|---|---|
| Production-governed attestation-enabled SPK deployment | **Critical** | Converts proof-scoped public stack into pilot-grade governance, source verification, and role separation |
| Real signed meter adapter | **Critical** | Converts sample bundle into pilot-grade data provenance |
| Solar operator LOI | **Critical** | Converts pitch from "asserted market" to "demonstrated demand"; doubles grant odds |
| Formal smart contract audit | High | Required for mainnet; primary grant deliverable |
| Thesis advisor acknowledgement (public) | High | Academic credibility; EF Academic eligibility |
| Benchmarking energy-specific vs. generic pricing on real data | Medium | Strengthens Pillar 2 contribution claim |
| Journal/conference submission | Medium | External peer review; third-party academic endorsement |
| Non-deployer testnet interaction | Low | "First user" narrative |

---

*Every number in this document can be reproduced from the files cited. If a claim cannot be reproduced, treat it as a gap — not an assertion.*
