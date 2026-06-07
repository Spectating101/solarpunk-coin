# Thesis Source of Truth

This file records the current canonical thesis framing and numerical values for the grounded manuscript. Use it to prevent older drafts from leaking inconsistent claims into the final thesis.

## Canonical Title

**Energy as a Constraint: Credibility, Pricing, and Settlement in Energy-Linked Digital Finance**

## Central Research Question

Can energy act as a credible constraint for digital money through energy-linked financial contracts, and what conditions are needed for that constraint to work?

## Canonical Framework

Use the **five-constraint framework**:

1. Reliable energy data.
2. Rule-bound issuance.
3. Explicit pricing and risk controls.
4. Protected settlement and redemption accounting.
5. Limited governance.

Retire the older four-constraint wording except when describing prior drafts or explaining that it was an earlier compressed version.

## Canonical Chapter Structure

| Chapter | Role | Core Claim |
|---|---|---|
| Chapter 1 | Introduction | Energy can be tested as a verifiable constraint for digital finance through energy-linked contracts. |
| Chapter 2 | Monetary background | Energy is worth studying because it combines cost, usefulness, measurability, and digital enforceability, but it is not money by itself. |
| Chapter 3 | Bitcoin empirics | Energy cost can matter in digital markets, but the evidence is conditional and specification-sensitive. |
| Chapter 4 | Pricing | Renewable-energy-linked claims require explicit pricing, oracle tolerance, and margin analysis. |
| Chapter 5 | Constraints and implementation | Credibility requires reliable data, rule-bound issuance, pricing, settlement protection, and governance limits. |
| Chapter 6 | Conclusion | The thesis contributes a bounded framework, not a production-ready currency. |

## Canonical Empirical Results

Use Chapter 3 wording carefully. The thesis should not pretend all older specifications agree.

| Item | Canonical Statement |
|---|---|
| CEIR definition | `CEIR_t = MarketCap_t / CumulativeEnergyCost_t`. |
| CEIR interpretation | High CEIR means Bitcoin is expensive relative to cumulative mining electricity cost; low CEIR means Bitcoin is cheaper relative to that cost base. |
| Main outcome | Forward 30-day Bitcoin return. |
| Preferred regression form | `R_{t,t+30} = alpha + beta * log(CEIR_t) + gamma' * Controls_t + epsilon_t`. |
| Expected sign | Negative: if Bitcoin is expensive relative to cumulative energy cost, later returns should be weaker. |
| Preferred empirical posture | The preferred level specification supports a relationship between Bitcoin valuation and cumulative energy cost. |
| Preferred level coefficient | Use approximate wording: `around -0.26` for the corrected level specification from robustness notes. |
| Standard-error posture | Treat overlapping forward returns as a risk; cite HAC(30), clustering, and differenced specifications as robustness/discipline checks. |
| Structural break | The China mining-ban period shows a sharp structural break in the level specification. |
| Differenced specification | Weaker; CEIR effects lose significance and should be reported as a boundary condition. |
| Trading rule | Negative result; CEIR is not presented as a useful trading strategy. |
| Scope | Bitcoin-focused, not a universal proof-of-work asset panel. |

## Canonical Pricing Results

Use one preferred table in Chapter 4 and treat older parameter runs as robustness artifacts.

### Taiwan Base Case

| Parameter | Canonical Value |
|---|---:|
| Underlying proxy `S0` | `$0.0525/kWh` |
| Strike/reference cost `K` | `$0.0525/kWh` |
| Horizon `T` | `0.25` years |
| Risk-free rate `r` | `2.5%` |
| Volatility `sigma` | `189%` |
| Binomial call value | `$0.01917/kWh` |
| Monte Carlo call value | `$0.02025/kWh` |
| Method gap | About `+5.6%` Monte Carlo vs binomial |

| Location | S0 ($/kWh) | Sigma | Binomial Call | Monte Carlo Call | Interpretation |
|---|---:|---:|---:|---:|---|
| Germany | 0.0250 | 45% | 0.000001 | 0.0000009 | Near-zero option value in this convergence run; relative difference inflated by tiny base. |
| Taiwan | 0.0525 | 189% | 0.01917 | 0.02025 | Main base case; convergence within about 5.6%. |
| Saudi Arabia | 0.0550 | 172% | 0.01929 | 0.01945 | Strong convergence. |
| Arizona | 0.0580 | 165% | 0.02068 | 0.02100 | Strong convergence. |
| Brazil | 0.0950 | 198% | 0.05373 | 0.05449 | Strong convergence. |

## Canonical Oracle-Tolerance Results

| Location | Max Oracle Error for VR >= 95% |
|---|---:|
| Taiwan | 21.7% |
| Saudi Arabia | 19.7% |
| Arizona | 18.9% |
| Brazil | 22.7% |
| Germany | 5.2% |

## Canonical Implementation Status

| Stage | Status |
|---|---|
| Local reproduction | **Available** — `npx hardhat test` (109 tests); `npm run spk:v1:launch` |
| SPK v1 network-money loop (local) | **Available** — energy-native mint → circulation → optional redemption |
| Sepolia historical proof | **Available** — attested mint tx `0x56fc…` (May 2026) |
| Sepolia SPK v1 circulation | **Available** — CurrencySystem + network payment txs (see `state/runtime/spk_v1.json`) |
| Sepolia unified energy-native SPK | **Available** — lean stack `0x8e189…` + CurrencySystem `0x520162…` (see `state/runtime/spk_v1.json`) |
| Production / mainnet | **Out of scope** — not audited |
| Real operator hardware | **Not available** — fixtures and sample CSVs only |

Product/thesis alignment: `thesis_package/THESIS_PRODUCT_ALIGNMENT.md`

## Canonical Public Proof

| Item | Current Value |
|---|---|
| Attestation-enabled contract (May 2026) | `0x8ceDa149EDE44078bf151b3334513916a84df820` |
| Sepolia attested mint transaction | `0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d` |
| SPK v1 energy-native SPK (Jun 2026, canonical) | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| SPK v1 CurrencySystem (Jun 2026, canonical) | `0x520162252F9B94824417678525FFd69145014970` |
| SPK v1 attached stack (superseded) | SPK `0x8ceDa…` + Currency `0x3Fa51…` |
| Runtime config | `state/runtime/spk_v1.json` |
| Accepted surplus energy (attested mint) | `2606.7 kWh` submitted; `2606 kWh` on-chain; `130.1697 SPK` minted (dollar-translated bytecode). |
| Local energy-native genesis | `~2603 SPK` from `2606 kWh` — `npm run spk:v1:launch` |
| Operator cycle evidence | `state/runtime/spk_v1_operations.jsonl`; thesis pack `thesis_package/SPK_V1_EVIDENCE.md` |
| Multi-party circulation | Preset counterparties (gateway, labor, merchant, network) receive SPK via `settleNetworkPayment` |
| Proof boundary | Testnet prototype: signed issuance + circulation accounting demonstrated; not production hardware or commercial settlement. |

## Phrases to Use

- proof-of-concept
- testnet implementation
- feasibility evidence
- public-lab evidence
- not production-ready
- site-level settlement requires meter, inverter, grid, or audited operator data

## Phrases to Avoid

- production-ready protocol
- stablecoin launch
- real settlement infrastructure
- energy is the new gold
- energy automatically backs money
- SolarPunk proves a new monetary system
