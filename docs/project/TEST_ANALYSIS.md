# Test Analysis — What the Suite Actually Proves

**Last updated:** 2026-06-07

This document explains how to **read** the tests, what each layer establishes, what it does **not** establish, and how to reason about whether a change is safe. Test counts are omitted on purpose — a passing count does not tell you what you can claim.

---

## 1. Four layers (read bottom-up for claims)

```
┌─────────────────────────────────────────────────────────────┐
│  Sepolia TXs / state/proofs/*.json   ← historical evidence   │
│  (not automated in CI; manually inspectable)                   │
├─────────────────────────────────────────────────────────────┤
│  test-node/ + npm run product:*      ← pipeline & accounting │
│  (scripts + golden JSON; mostly local Hardhat)               │
├─────────────────────────────────────────────────────────────┤
│  npx hardhat test                    ← on-chain rules         │
│  (isolated EVM; MockUSDC; fresh deploy each test)            │
├─────────────────────────────────────────────────────────────┤
│  energy_derivatives/tests            ← pricing math           │
│  (numpy/scipy; not wired to contracts)                       │
└─────────────────────────────────────────────────────────────┘
```

**Rule:** A claim is only as strong as the **lowest** layer that must hold for the claim to be true.

| If you want to claim… | You need… |
|---|---|
| "ECDSA replay protection works on-chain" | Hardhat attestation tests + ideally one Sepolia readback |
| "Meter CSV math is correct" | `derive_meter_attestations` node tests + manual spot-check of CSV |
| "Taiwan solar options are priced at $X" | Python pricing tests + empirical CSV provenance |
| "A real rooftop minted SPK last week" | Named operator + hardware L2+ — **no test covers this today** |

---

## 2. Hardhat contracts (`test/*.test.js`)

**Environment:** Fresh `SolarPunkCoin` + `MockUSDC` + `ProtocolTreasury` per test. Owner grants roles directly. Reserves seeded with 1M mock USDC. **Not** the Sepolia deployment layout unless you run fork tests (there are none).

### SolarPunkCoin — what passing means

| Test group | What it proves | What it does NOT prove |
|---|---|---|
| **Deployment** | Token metadata and default peg params compile and initialize | Mainnet deployment config |
| **mintFromSurplus** | Role-gated mint; fees; zero/address guards | Surplus was real; oracle told the truth |
| **mintFromSurplusAttestation** | Oracle ECDSA over structured hash; replay of attestation + source hash blocked; window must be closed; expiry enforced | Meter signed the underlying readings; oracle key wasn't compromised |
| **PI peg (Rule D)** | `updateOraclePriceAndAdjust` updates price; supply moves directionally when far from peg | Peg is stable in production; PI won't wind up dangerously |
| **redeemForEnergy** | Burns SPK; fee to treasury | Anyone delivered kWh off-chain |
| **gridStressed** | Mint blocked when flag set or reserves withdrawn | Grid oracle reflects real grid state |
| **Reserve ratio** | Mint blocked when reserves emptied | USDC reserve equals real backing |
| **Governance timelock** | Queue → wait → execute pattern works on fee updates | Safe multisig on Sepolia enforces same paths |
| **Bonds** | Minter/oracle need treasury bond when configured | Bonds are economically meaningful size on mainnet |
| **Integration flow** | Mint → oracle updates → redeem in one chain | End-to-end with real attestation pipeline |

**Deduction:** The coin contract enforces **rule-bound issuance** *given* trusted roles and oracle signatures. It does **not** test the path from physical meter → accepted bundle (that's off-chain + node tests).

**Weak spots in SPK tests:**
- `mintFromSurplus` (legacy path) still tested but product story is attestation path — both must stay consistent on `energyPricePerKwh` math.
- PI tests use `expect(txAfter).to.be.gte(txBefore)` — weak assertion; control may no-op without failing.
- No test for oracle **staleness** blocking mint in attestation path combined with real timestamps.
- No fork test against deployed Sepolia bytecode.

### SolarPunkOption

**Setup quirk:** Tests set margin to **10% IM / 5% MM** (`setMarginParams(1000, 500, 100)`) — far looser than Sepolia's **150% / 75%**. Passing here does **not** mean Sepolia margin config is safe.

| Test | Proves | Does not prove |
|---|---|---|
| Long PnL accrual | Mark-to-index increases margin when index rises | Index matches NASA or market |
| Liquidation | Underwater short can be liquidated; treasury gains | Liquidation bots exist; gas economics |
| Bonds on oracle/liquidator | Same pattern as SPK | — |
| Settlement after expiry | Margin returned; position cleared | Cash settlement funding |

**Deduction:** Clearinghouse **mechanics** work in a toy margin regime. Risk numbers in `PROTOCOL_MATURITY_REPORT_2026.md` come from **Python stress scripts**, not these tests.

### SolarPunkCurrencySystem

Proves the **accounting registry** around SPK:

1. Invoice hash cannot be replayed.
2. Redemption pulls SPK, burns via coin, records owed kWh.
3. Slippage guard on min kWh.
4. Fulfillment / shortfall / dispute states update aggregates correctly without double-counting after dispute.

**Does not prove:** Legal enforceability of "owed kWh"; operator actually delivers energy; contract deployed on Sepolia (only Hardhat).

### ProtocolTreasury

Proves fee split buckets (40/25/25/10 bps default), bond lock/slash/release, SPK fee routing, timelock on admin setters.

**Does not prove:** Vault addresses on Sepolia match intended segregation.

### EnergyRevenueFloor

Separate product module (revenue floor policies). State machine: register → open policy → report → settle/dispute/expire.

**Does not prove:** Module is deployed (`0x000…` on Sepolia) or integrated with SPK mint path.

---

## 3. Attestation pipeline (`test-node/meter_*.test.js`, `scripts/derive_meter_attestations.js`)

This is the **trust boundary between physics and mint**.

| Test | Proves |
|---|---|
| Valid signed readings → accepted surplus | Energy balance math: export surplus = generation − load − curtailed (within rules) |
| Duplicate nonce rejected | Same interval cannot mint twice off one reading |
| Low quality rejected | Threshold gate works |
| Unregistered meter / bad signature rejected | Registry binding |
| Capacity / window violations rejected | Sanity bounds |

**Critical gap:** Signatures use **fixture keys** in `DEVICE_KEYS`. Passing tests mean "if a reading is signed by a registered key, verification works" — not "a Fronius inverter in Taoyuan produced this."

**How to reason:** Changing `derive_meter_attestations.js` can break thesis claims without failing Solidity tests. Always run `npm run attestations:test` when touching attestation logic.

---

## 4. Product script tests (`test-node/*.test.js`)

Most read **generated JSON** under `state/product/` or re-run a script and compare structure.

| Test file | What it's really checking |
|---|---|
| `field_receipt_loop.test.js` | Golden file: mint 130.1697 SPK → settle 75 → redeem 20 → deliver 400 kWh; conservation flag true |
| `pilot_stack_currency_drill.test.js` | Full stack script exits and writes expected receipt shape |
| `monetary_stress_harness.test.js` | Stress table conserves SPK/kWh accounting across scenarios |
| `economic_launch_readiness.test.js` | DSCR math outputs consistent with embedded NASA backtest inputs |
| `product_launch_gate.test.js` | Gate script logic (archival product phase) |
| `closed_pilot_execution_package.test.js` | Operator intake structure; L0 cap = 0; external inputs enumerated |

**Deduction:** These are **regression guards on research spreadsheets and demo scripts**, not independent verification of economics. If you change assumptions in `empirical_finance_backtest.js`, failures mean "docs and JSON drifted" — not necessarily "math is wrong."

**Known weakness:** `field_receipt_loop.test.js` does not re-run the Hardhat script in CI by default — it asserts last committed `state/product/field_receipt_loop.json`. Stale JSON can pass while code is broken unless someone regenerates.

---

## 5. Python SDK (`energy_derivatives/tests/`)

| Test | Proves |
|---|---|
| Binomial vs Black-Scholes | Tree converges for standard call (sanity on implementation) |
| Monte Carlo seed | Reproducibility |
| Greeks signs | Theta negative, rho positive for call |
| Data loader fallback | Synthetic path when NASA CSV missing |

**Does not prove:** Taiwan σ=189% is correct for thesis — that comes from `thesis_package/empirical_results/calibration_diagnostics_real.csv` and manual methodology review.

**Deduction:** Pricing layer is **mathematically self-consistent**; empirical calibration is a separate audit of data pipelines (`scripts/nasa_keeper.js`, `data_loader_nasa.py`).

---

## 6. Frontend tests (`frontend/src/**/*.test.jsx`)

Nine tests on components (navbar, trading UI, energy workbench model). Check React rendering and local model math — **not** live Sepolia integration (no chain in vitest).

---

## 7. What Sepolia proofs add (outside automated test suite)

| Artifact | Extra assurance |
|---|---|
| `state/proofs/sepolia_spk_attested_mint_proof.json` | Same attestation logic once hit real RPC + gas |
| `state/proofs/sepolia_spk_public_readback.json` | On-chain storage matches expected hashes/balances |
| `state/proofs/sepolia_interaction_proof.json` | Legacy stack: mint, redeem, options |
| `state/keeper_logs/*.json` | Oracle updates happened with NASA-derived hashes (historical) |

Sepolia attested stack uses **deployer EOA for all roles** — proof of bytecode behavior, not production governance.

---

## 8. How to analyze a change (checklist)

1. **Touching `SolarPunkCoin.sol`?** Run `npx hardhat test`. If attestation fields change, also `npm run attestations:test` and `npm run proof:spk-attested-mint`.
2. **Touching attestation JS?** Node tests + manually inspect one rejected/accepted row in bundle JSON.
3. **Touching pricing?** `pytest energy_derivatives/tests/` + spot-check one row in `cross_location_pricing.csv`.
4. **Touching product economics scripts?** Regenerate JSON (`npm run product:…`) then `node --test test-node/<relevant>.test.js`.
5. **Claiming "works on mainnet"?** None of the above is sufficient — need audit + deployment + legal.

---

## 9. Overall deduction (thesis-level)

| Thesis constraint | Supported by tests? | Strength |
|---|---|---|
| 1. Reliable energy data | Partial — verifier logic yes; real hardware no | Medium off-chain, none on-site |
| 2. Rule-bound issuance | Yes — roles, caps, attestation replay | Strong in Hardhat |
| 3. Pricing & risk | Yes — Python + options margin mechanics | Math strong; calibration separate |
| 4. Settlement / redemption accounting | Yes — CurrencySystem + field receipt golden | Strong local; no Sepolia deploy |
| 5. Limited governance | Partial — timelock tests; Sepolia split across two stacks | Medium |

**Bottom line:** The repo demonstrates that energy-linked rules **can be encoded and exercised** in a controlled environment. It does **not** demonstrate that the system is economically viable, legally redeemable, or connected to real meters — and no test count changes that.

---

## 10. Commands (for manual verification)

```bash
npx hardhat test
npm run attestations:test
node --test test-node/*.test.js
pytest energy_derivatives/tests/ -q
npm --prefix frontend run test
npm run proof:spk-attested-mint    # regenerates local mint proof
```

See also: [`DOC_MAINTENANCE.md`](./DOC_MAINTENANCE.md) · [`CURRENT_STATUS.md`](../../CURRENT_STATUS.md)
