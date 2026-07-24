# Thesis Source of Truth

**Canonical document:** `energy_constraint_thesis_final_submission.pdf` (repo root). This is the file to send to your advisor. It is maintained directly (Word/Docs export) — there is **no** markdown or DOCX build pipeline behind it anymore. `build_grounded_thesis.py`, `verify_thesis_numbers.py`, and `audit_thesis_output.py` are retired; see the deprecation note at the top of each.

Everything under `thesis_package/_archive/superseded_2026-07/` predates the 2026-07-10 CEIR correction below and should not be cited, quoted, or rebuilt from. See that folder's `README.md` for why each file was retired.

This file records the current canonical framing and numbers so that new edits to the PDF (or any future document) don't drift from what the empirical work actually supports.

## Canonical Title

**Energy as a Constraint: Credibility, Pricing, and Settlement in Energy-Linked Digital Finance**

## Central Research Question

Under what conditions can verified energy evidence impose a credible and enforceable constraint on digital financial claims?

## Canonical Framework

Use the **five-constraint framework**:

1. Reliable energy data.
2. Rule-bound issuance.
3. Explicit pricing and risk controls.
4. Protected settlement and redemption accounting.
5. Limited governance.

Retire the older four-constraint wording (`thesis_package/_archive/superseded_2026-07/thesis-draft.md`) except when explicitly describing it as an earlier draft.

## Canonical Chapter Structure

| Chapter | Role | Core Claim |
|---|---|---|
| Chapter 1 | Introduction | Verified energy evidence can only constrain a digital financial claim if evidence, issuance, pricing, settlement, and governance are designed together. |
| Chapter 2 | Literature review | No existing literature jointly covers credibility, Bitcoin energy cost, renewable-energy finance, pricing, and smart-contract enforcement — that intersection is the gap. |
| Chapter 3 | Bitcoin empirics | The CEIR association is reproducible but does **not** survive negative-control identification — it is a negative/boundary result, not evidence of energy-specific valuation. |
| Chapter 4 | Pricing | Renewable-energy-linked claims can be translated into inspectable option, margin, and oracle-tolerance quantities under declared (not observed-market) assumptions. |
| Chapter 5 | Constraints framework + implementation | The five constraints can be represented as an auditable decision/settlement process: SPK v1 (Sepolia) for issuance/payment/redemption, the V2 case workbench for admission/quantity/settlement decisioning. |
| Chapter 6 | Conclusion | Energy can discipline digital claims only conditionally; the empirical anchor claim is retired, the architecture is the contribution. |

## Canonical Empirical Results — Chapter 3 (CORRECTED 2026-07-10)

**Do not cite the old "significant regime-dependent CEIR effect" framing.** It was retired by a negative-control audit. Canonical statement:

> The pre-split CEIR association is reproducible, but does not identify an energy-specific valuation effect. It is statistically indistinguishable from a naive cumulative-TWh or cumulative-days ratio, is highly sensitive to an unexplained pre-sample cost seed, and is not supported by the preferred robust joint-Wald break test.

| Item | Canonical Statement |
|---|---|
| CEIR definition | `CEIR_t = MarketCap_t / CumulativeEnergyCost_t`. |
| Data defect | The panel's `electricity_price` column is a failed monthly→daily merge: constant ≈ `$0.076234375/kWh` on 2,674/2,703 days, with 29 one-day spikes. It is **not** a genuine geography-weighted series. See `CEIR_DATA_LINEAGE_AUDIT.md`. |
| Pre-split coefficient (level spec) | β ≈ `−0.2623`, HAC p ≈ `0.00052`, N = 872 |
| Post-split coefficient (level spec) | β ≈ `−0.0708`, HAC p ≈ `0.133`, N = 1,408 |
| Classical Chow test | Rejects equal coefficients — cite only alongside the robust test below, not alone. |
| **Preferred: robust joint-Wald test** | HAC p ≈ `0.133` — **does not** reject coefficient stability. This is the preferred break test; it contradicts the classical Chow reading. |
| Negative control: TWh ratio | `corr(log CEIR, log[MarketCap/cumulative TWh]) = 0.999989` — CEIR carries no information beyond a plain cumulative-quantity ratio. |
| Negative control: days ratio | MarketCap/cumulative-days produces a similar, slightly stronger coefficient — consistent with persistence, not an energy-price channel. |
| Seed sensitivity | Zeroing the ~$3.3B unexplained 2018 cumulative-cost stock shrinks pre-split β to `≈ −0.1037`, p rises to `≈ 0.099` (not significant). |
| Stationarity / cointegration | ADF does not reject unit roots in log(CEIR), log(MarketCap), log(Price); Engle–Granger does not support a stable long-run MarketCap–cost equilibrium. |
| Differenced specification | Effect disappears (pre-split β = `−0.2357`, p = `0.424`; post-split β = `0.1424`, p = `0.378`) — consistent with a persistence artifact, not evidence "weakened but present." |
| Trading rule | Still a negative result; CEIR rule `≈ +176.4%` total return vs buy-and-hold `≈ +2771%`; Sharpe `0.723` vs `1.132`. |
| Scope | Bitcoin-focused, single proof-of-work asset; result is a boundary/negative finding motivating Chapters 4–5, not a "conditional positive" finding. |

Full audit trail: `thesis_package/CEIR_FINAL_DIAGNOSIS.md`, `thesis_package/CEIR_DATA_LINEAGE_AUDIT.md`.

## Canonical Pricing Results — Chapter 4

Numbers below are unchanged by the CEIR correction (pricing is a separate, declared-scenario analysis, not an observed-market claim). Treat `S0`, `r`, and non-Taiwan σ as **declared scenario inputs**, not preserved market observations — only Taiwan's σ = 189% has a preserved calibration lineage (NASA POWER daily irradiance, 2019–2024, 4-day rolling mean, 1% tail trim, Jarque–Bera p = 0.349).

### Taiwan Base Case

| Parameter | Canonical Value |
|---|---:|
| Underlying proxy `S0` | `$0.0525/kWh` |
| Strike/reference cost `K` | `$0.0525/kWh` |
| Horizon `T` | `0.25` years |
| Risk-free rate `r` | `2.5%` |
| Volatility `sigma` | `189%` (preserved calibration) |
| Binomial call value | `$0.01917/kWh` |
| Monte Carlo call value | `$0.01957/kWh` |
| Method gap | About `+2.1%` Monte Carlo vs binomial |

| Location | S0 ($/kWh) | Sigma | Binomial Call | Monte Carlo Call | Input status |
|---|---:|---:|---:|---:|---|
| Germany | 0.0250 | 45% | 0.00234 | 0.00236 | Declared scenario |
| Taiwan | 0.0525 | 189% | 0.01917 | 0.01957 | σ calibrated (preserved); main base case |
| Saudi Arabia | 0.0550 | 172% | 0.01841 | 0.01876 | Declared scenario |
| Arizona, USA | 0.0580 | 165% | 0.01877 | 0.01911 | Declared scenario |
| Brazil | 0.0950 | 198% | 0.03702 | 0.03781 | Declared scenario |

**Strike convention:** `K = S₀` per location (ATM). Do not cite older fixed-`K` prototype tables for cross-location comparison. Do not describe non-Taiwan `S0`/`r` as observed market data — the source ledger for them is missing (`CEIR_DATA_LINEAGE_AUDIT.md`-style boundary, see PDF Appendix B.6).

## Canonical Oracle-Tolerance Results

| Location | Max Oracle Error for VR >= 95% |
|---|---:|
| Taiwan | 21.7% |
| Saudi Arabia | 19.7% |
| Arizona | 18.9% |
| Brazil | 22.7% |
| Germany | 5.2% |

## Canonical Implementation Status — Chapter 5

| Stage | Status |
|---|---|
| Local reproduction | **Available** — `npx hardhat test` (109 tests); `npm run spk:v1:launch` |
| SPK v1 network-money loop (local) | **Available** — energy-native mint → circulation → optional redemption |
| Sepolia historical proof | **Available** — attested mint tx `0x56fc…` (May 2026) |
| Sepolia SPK v1 circulation | **Available** — CurrencySystem + network payment txs (see `state/runtime/spk_v1.json`) |
| Sepolia unified energy-native SPK | **Available** — lean stack `0x8e189…` + CurrencySystem `0x520162…` (see `state/runtime/spk_v1.json`) |
| V2 case workbench | **Available** — deterministic admission/quantity/settlement decisioning; reviewed at revision `eb8714a6544b3480226283a69d41b3946df63451` (core 60/60, frontend 64/64 tests) |
| Production / mainnet | **Out of scope** — not audited |
| Real operator hardware | **Not available** — fixtures and modelled PVWatts/TMY context only |

Product/thesis alignment: `thesis_package/THESIS_PRODUCT_ALIGNMENT.md`
Monetary foundation: `thesis_package/MONETARY_FOUNDATION.md`
Instrument comparison: `thesis_package/INSTRUMENT_COMPARISON.md`

## Canonical Public Proof

| Item | Current Value |
|---|---|
| Attestation-enabled contract (May 2026) | `0x8ceDa149EDE44078bf151b3334513916a84df820` |
| Sepolia attested mint transaction | `0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d` |
| SPK v1 energy-native SPK (Jun 2026, canonical) | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| SPK v1 CurrencySystem (Jun 2026, canonical) | `0x520162252F9B94824417678525FFd69145014970` |
| SPK v1 attached stack (superseded) | SPK `0x8ceDa…` + Currency `0x3Fa51…` |
| Runtime config | `state/runtime/spk_v1.json` (PDF Appendix B synced 2026-06-10T16:45:22Z snapshot) |
| Accepted surplus energy (attested mint) | `2606.7 kWh` submitted; `2606 kWh` on-chain; `130.1697 SPK` minted (dollar-translated bytecode). |
| Local energy-native genesis | `~2603 SPK` from `2606 kWh` — `npm run spk:v1:launch` |
| Operator cycle evidence | `state/runtime/spk_v1_operations.jsonl`; thesis pack `thesis_package/SPK_V1_EVIDENCE.md` |
| Multi-party circulation | Preset counterparties (gateway, labor, merchant, network) receive SPK via `settleNetworkPayment` |
| Proof boundary | Testnet prototype: signed issuance + circulation accounting demonstrated; not production hardware or commercial settlement. |

## Known outstanding fixes in the canonical PDF

- **Citation error:** References list "National Laboratory of the Rockies" with URL `developer.nlr.gov` — this should be **National Renewable Energy Laboratory (NREL)**, `developer.nrel.gov`. Fix before final submission (appears in Ch.2 §2.7, Ch.4 §4.3/§4.3.1, and the References list).
- **Citation URL:** `Ethereum.org. (n.d.). The Merge. https://ethereum.org/roadmap/merge/` — verify against the live URL (`https://ethereum.org/en/upgrades/merge/` was used in the earlier archived draft).

## Phrases to Use

- proof-of-concept
- testnet implementation / research feasibility
- controlled evidence, model-based context
- negative identification result (Ch.3)
- not production-ready
- site-level settlement requires meter, inverter, grid, or audited operator data

## Phrases to Avoid

- production-ready protocol
- stablecoin launch
- real settlement infrastructure
- energy is the new gold
- energy automatically backs money
- SolarPunk proves a new monetary system
- "CEIR shows energy cost matters conditionally" / "regime-dependent energy anchor" (retired Ch.3 framing)
