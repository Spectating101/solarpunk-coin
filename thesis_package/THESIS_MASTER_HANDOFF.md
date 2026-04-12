# THESIS HANDOFF — MASTER DOCUMENTATION
## Energy-Backed Derivatives: From Empirical Validation to a Credible Pricing-and-Contract Framework
## Christopher Ongko | Yuan Ze University | Advisor: Dr. De-Rong Kong
## Last Updated: April 7, 2026

---

## READ THIS FIRST

This document is the single source of truth for anyone (human or LLM) continuing
this thesis. Read it entirely before touching any file. The project has a clear
intellectual direction that must not drift.

---

## WHAT THIS THESIS IS

**One-sentence claim:**
Energy-backed derivatives satisfy the necessary and sufficient conditions for a
credible monetary standard — outperforming gold (on verifiability and enforcement)
and fiat (on production constraint and scarcity) — and can be priced and deployed
using publicly available satellite irradiance data without requiring a liquid options market.

**The thesis is NOT:**
- A paper about whether energy predicts Bitcoin prices (CEIR is supporting evidence)
- A CEIR methodology paper
- A blockchain engineering project
- A claim that energy should replace fiat everywhere immediately

**The correct framing:**
Bitcoin's passive energy anchoring worked under geographic mining concentration and
failed under dispersion. This failure motivates deliberately designed instruments
with explicit energy linkage and contractual enforcement. The thesis proves this
architecture is empirically motivated, technically priceable, and institutionally
feasible under stated conditions.

---

## THREE-LAYER ARCHITECTURE

```
LAYER 1 — EMPIRICAL FOUNDATION
Purpose:  Prove markets price energy floors when enforcement is credible
Method:   CEIR predictive regression + China ban natural experiment
Status:   COMPLETE — published on SSRN
Role:     Supporting evidence for the monetary claim. NOT the thesis itself.

    ↓ finding: coordination, not cost level, is the operative mechanism

LAYER 2 — INSTRUMENT PRICING
Purpose:  Prove the instrument can be priced without a liquid market
Method:   Physics-based σ from NASA POWER irradiance → GBM → Black-Scholes
Status:   COMPLETE — real NASA data, verified outputs
Role:     Proves feasibility of the instrument design

    ↓ finding: zero-premium collar achievable, cold-start problem solved

LAYER 3 — MONETARY STANDARD ARGUMENT
Purpose:  Prove the instrument satisfies monetary standard conditions
Method:   7-condition scorecard + historical simulation + comparative analysis
Status:   COMPLETE — simulation run, scorecard derived
Role:     The actual thesis claim
```

---

## VERIFIED REAL-DATA OUTPUTS
## (These are the authoritative numbers. Do not change without re-running the code.)

### Layer 1 — CEIR
```
Pre-ban:   β = −0.206, SE = 0.042, p < 0.001
Post-ban:  β = −0.080, SE = 0.031, p = 0.011
Chow F:    4.786, p = 0.0009
Mechanism: pre-ban β_interaction = +0.110 (p=0.001), 2.8× stronger fearful
           post-ban β_interaction = −0.075 (p=0.006), pattern inverts
Bootstrap: 97.4% of 2,000 draws β < 0 (pre-ban)
```

### Layer 2 — Pricing
```
Volatility calibration:
  σ = 189.5% annualised
  Method: 4-day rolling mean + 1% absolute log-return trim, then annualise
  Source: NASA POWER API, 23.5°N 120.9°E (Taiwan), 2019–2024
  JB p-value: 0.349 (fail to reject log-normality — GBM justified at T≤0.25yr)
  NOTE: Raw daily returns produce higher σ — the filtered operational estimate
        is the correct number for quarterly hedging purposes

Taiwan base case (S₀=0.0525, K=S₀, r=0.025, T=0.25, σ=1.895, N=400):
  ATM Call (binomial):  $0.01917/kWh
  ATM Call (MC):        $0.01957/kWh
  B vs MC divergence:   2.08% at 20,000 paths
  ATM Put:              $0.01886/kWh
  NOTE: The thesis previously stated <1.4% — this was wrong. 2.08% is correct.

Collar (buy put at 0.9K, sell call at 1.1K):
  Net cost is STRUCTURALLY NEGATIVE in lognormal model at all σ levels
  Because: log(1.1) = 0.0953 < log(1/0.9) = 0.1054 → call always more expensive
  Net credit scales monotonically with σ:
    Germany (σ=45%):      −0.65% of spot (1.38% annualised)
    Taiwan (σ=189%):      −4.17% of spot
    Brazil (σ=198%):      −6.73% of spot (largest credit)
  NOTE: The thesis previously said "zero-premium achievable at σ≥165%"
        This was wrong. It is structural, not a threshold finding.

Margin (1.5 × VaR₉₉%):
  Taiwan quarterly: 10–15× spot price collateral required
  This is NOT solved by the zero-premium collar
  Requires a CME-style clearing house — must be stated explicitly in thesis
```

### Layer 3 — Monetary Standard
```
Scorecard:
  Energy: 7/7 conditions satisfied
  Gold:   3/7 (fails contractual enforcement + physical settlement)
  Fiat:   1/7 (passes only cash settlement)
  NOTE: Fiat was previously stated as 2/7 — corrected to 1/7

Oracle tolerance (formula: σ·√T·√[(1−threshold)/threshold]):
  Taiwan (σ=189%):      21.7% max oracle error for VR ≥ 95%
  Saudi Arabia (σ=172%): 19.7%
  Arizona (σ=165%):     18.9%
  Brazil (σ=198%):      22.7%
  Germany (σ=45%):      5.2%  ← marginal; NASA POWER error may exceed this
  NASA POWER accuracy benchmark: ~3–10% (Journée & Bertrand 2010)
  High-σ markets are robustly tolerant. Germany is not a target market.

Quarterly simulation (20 quarters, 2020–2024, real data):
  σ range: 179–195% across quarters
  σ CV:    0.025 (highly stable pricing)
  Zero-premium collar: achieved every quarter
  Margin ratio range: 9.9× to 15.4× spot
```

---

## KEY FIXED PARAMETERS
## Do not change these without documented justification and re-running the code.

```python
# Taiwan Primary Case
S0    = 0.0525   # $/kWh — Bureau of Energy Taiwan LCOE
K     = S0       # ATM strike = LCOE
r     = 0.025    # Taiwan 1yr government bond
T     = 0.25     # Quarterly maturity (years)
sigma = 1.895    # Filtered operational σ from NASA POWER 2019-2024
N     = 400      # Binomial steps (convergence verified, Table 3.2)
paths = 20000    # MC paths (2.08% convergence vs binomial)

# Collar structure
put_strike  = 0.90 * S0   # 10% OTM put (floor)
call_strike = 1.10 * S0   # 10% OTM call (cap)

# Margin (thesis §4.4)
z99  = 2.33    # 99th percentile
mult = 1.50    # 1.5 × VaR₉₉%

# Oracle architecture weights
nasa_weight     = 0.40
utility_weight  = 0.40
chainlink_weight = 0.20
```

---

## MONETARY STANDARD — 7 CONDITIONS
## These are fixed. Do not add or remove conditions without documented justification.

| # | Condition | Energy | Gold | Fiat |
|---|---|---|---|---|
| 1 | Verifiable production cost floor | ✓ NASA→LCOE | ∂ market price | ✗ |
| 2 | Independent observability | ✓ satellite, public | ✗ audit required | ✗ trust |
| 3 | Scarcity / irreversibility | ✓ energy is sunk | ✓ mining cost | ✗ printable |
| 4 | Contractual enforcement | ✓ smart contract | ✗ coordination needed | ✗ policy |
| 5 | Cash settlement, no delivery | ✓ oracle-settled | ✗ physical custody | ✓ |
| 6 | Credibility under dispersion | ✓ contract survives | ✗ needs custodians | ✗ |
| 7 | Physics-based price floor | ✓ LCOE from physics | ∂ geology | ✗ |
| **Score** | | **7/7** | **3/7** | **1/7** |

**Why this scorecard matters for the thesis:**
Gold fails conditions 4 and 5 — contractual enforcement and physical settlement.
These are precisely the conditions that caused the Bretton Woods system to collapse.
Nixon closed the gold window in 1971 not because gold was wrong in theory but because
enforcing the gold floor required central bank coordination that geopolitical
dispersion made impossible.

The CEIR Layer 1 finding is a direct parallel: Bitcoin's passive energy floor
failed for the same structural reason — enforcement required geographic coordination,
and the China ban dissolved it.

The designed instrument closes this gap: smart contract liquidation is algorithmic
and survives any distribution of producers or counterparties.

This comparison is the thesis's most pointed result and should be front and center
in Chapter 5 and the abstract.

---

## ADVISOR FEEDBACK — DE-RONG KONG (April 3, 2026)
## These are the specific revision requests. Address all before resubmitting.

| Item | Request | Status |
|---|---|---|
| 1 | Explain PoW assets from scratch in §1 | Pending |
| 2 | Cite every argument in §1 — 3 uncited locations flagged | Pending |
| 3 | Section 2.3 (causal identification) → Research Design section | Pending |
| 4 | One research question preferred, or 2 with clear justification | Pending |
| 5 | CEIR not published — frame as novel construction, not established | Pending |
| 6 | Number all equations, define all variables | Pending |
| 7 | Explain why Bitcoin only | Pending |
| 8 | Explain 30-day return window choice | Pending |
| 9 | Remove RDD from methodology — Chow test is sufficient | Pending |
| 10 | Separate methodology and results sections | Pending |
| 11 | Times New Roman 12pt throughout (inconsistency signals AI) | Pending |
| 12 | Table captions must be self-explanatory in column headers | Pending |
| 13 | Add correlation matrix (multicollinearity check) | Pending |
| 14 | Consider dummy variables (N≈300) | Pending |
| 15 | Start literature from foundational to advanced | Pending |

**Critical note on RDD:**
RDD was removed from the methodology per advisor guidance. Do not reinstate it.
The identification stack is: Chow test + block bootstrap + Kazakhstan falsification.
This is sufficient and cleaner than adding RDD.

**Critical note on CEIR framing:**
De-Rong explicitly said CEIR is not published so cannot be cited as established.
Frame it as: "We construct a novel variable, the Cumulative Energy Investment Ratio
(CEIR), defined as... building on the theoretical foundations of Hayes (2017),
Marshall (1890), and the attack-cost pricing argument."

---

## THESIS CHAPTER STRUCTURE

```
Chapter 1: Introduction
  1.1 The Problem This Thesis Addresses
  1.2 The Passive-to-Active Transition ← epistemic-not-mechanical argument lives here
  1.3 Why This Matters for Renewable Finance
  1.4 Research Questions and Contributions
  1.5 Scope and Boundaries
  1.6 Thesis Structure

Chapter 2: Empirical Foundation
  2.1 Introduction
  2.2 Literature Review (foundational → advanced, per De-Rong)
  2.3 Theoretical Background (CEIR mechanics, concentration argument)
  2.4 Data and Construction
  2.5 Econometric Strategy ← equations numbered here
  2.6 Main Results ← separate from 2.5
  2.7 Robustness (9 checks, no RDD)
  2.8 Implications

Chapter 3: Pricing Framework
  3.1 The Cold-Start Problem
  3.2 Model Setup (GBM justification + parameter table)
  3.3 Binomial Tree
  3.4 Monte Carlo Validation
  3.5 Greeks
  3.6 Cross-Location Validation
  3.7 Extended Structures (collar, jump-diffusion, mean-reversion comparison)
  3.8 Limitations

Chapter 4: Contract Feasibility
  4.1 Why Pricing Is Necessary but Not Sufficient
  4.2 Term Sheet
  4.3 Oracle Architecture and Basis Risk
  4.4 Margin Framework ← clearing house argument must be explicit here
  4.5 Market Viability
  4.6 Credibility Equivalence Proof

Chapter 5: Synthesis and Conclusions
  5.1 Integrated Framework
  5.2 Monetary Standard Scorecard ← 7/7 vs 3/7 vs 1/7 TABLE here
  5.3 Answers to Research Questions
  5.4 Contributions
  5.5 Limitations
  5.6 Future Work
  5.7 Closing Statement
```

---

## WHAT THE THESIS CURRENTLY HAS (COMPLETE_THESIS_SUBMISSION_READY.docx)

Good:
- All five chapters present and substantively complete
- Correct numbers throughout (σ=189.5%, 2.08% B vs MC, 21.7% oracle tolerance,
  10–15× margin ratio, structural collar finding)
- Calibration preprocessing documented (4-day rolling mean, 1% trim)
- Clearing house argument present in §4.4
- Kazakhstan falsification present in §2.7
- Limitations section is honest and complete
- References complete

Needs work (before submission):
- Abstract is thin — needs real numbers up front and monetary standard claim
- Date says April 2025 — should be April 2026
- "First" claim stacking in contributions (appears 6+ times) — needs softening
- "Dual natural experiment" language in Contribution 1 — contradicts ETH
  descriptive-only framing elsewhere; remove "dual"
- Monetary standard scorecard (7/7 vs 3/7 vs 1/7) not in thesis body —
  needs to be added as Table 5.X in Chapter 5 synthesis
- All 15 De-Rong feedback items above still pending
- RDD still appears in robustness section — needs removal
- Font consistency (Times New Roman 12pt throughout)

---

## WHAT NOT TO DO

1. Do not make CEIR the thesis
2. Do not re-introduce RDD (removed per advisor)
3. Do not state "zero-premium collar achievable at σ≥165%" — it is structural
4. Do not state "99% hedge effectiveness at 6% oracle error" as the main oracle result
   Use the oracle tolerance breakeven analysis instead
5. Do not omit the clearing house argument — margin at 12× spot is the adoption
   constraint and the clearing house is the solution
6. Do not claim the SolarPunk Protocol is deployed — it is illustrative only
7. Do not use inconsistent fonts — De-Rong flagged this explicitly
8. Do not stack "First X / First Y / First Z" claims — soften to "X distinct from
   prior work / Y not previously demonstrated"
9. Do not cite CEIR as published — it is a novel construction

---

## RECOMMENDED NEXT TASKS (IN ORDER)

### Task 1 — Proposal revision (due April 20, 2026)
This is the immediate deadline. The proposal needs to address all 15 of De-Rong's
feedback items. Key structural changes:
- Move §2.3 to Research Design
- Consolidate to one RQ or justify two explicitly
- Add equation numbers and variable definitions
- Add correlation matrix
- Remove RDD
- Fix font consistency

### Task 2 — Thesis abstract + Chapter 5 (write pass)
- Rewrite abstract to lead with monetary standard claim + real numbers
- Add 7/7 vs 3/7 vs 1/7 scorecard table to §5.1 or §5.2
- Add Nixon/Bretton Woods comparison paragraph
- Soften "first" claim language in §1.4 and §5.4

### Task 3 — Final numerical audit (Codex)
- Re-audit create_thesis_word.py against current package
  (legacy handoff notes flag this as containing stale static tables)
- Verify all table numbers match empirical_results/ CSV outputs
- Confirm all equation numbers are consistent

### Task 4 — Hayek and monetary theory citations (write pass)
- Add Hayek (1976) Denationalisation of Money for competing currencies framing
- Add Selgin (2015) on synthetic commodity money
- Add Bordo and Eichengreen (1993) for Bretton Woods historical context
- These ground the monetary standard argument in established literature

---

## REFERENCE ADDITIONS NEEDED

These are not yet in the thesis references but support the monetary standard argument:

```
Friedman, M. (1960). A Program for Monetary Stability. Fordham University Press.
Hayek, F.A. (1976). Denationalisation of Money. Institute of Economic Affairs.
Selgin, G. (2015). Synthetic commodity money. Journal of Financial Stability, 17, 92–99.
Bordo, M.D., & Eichengreen, B. (1993). A Retrospective on the Bretton Woods System. NBER.
Journée, M., & Bertrand, C. (2010). Quality control of solar radiation data.
  Solar Energy, 84(2), 162–170. [for NASA POWER accuracy benchmark]
```

---

## FILES AND WHAT THEY ARE

| File | What it is | Trust level |
|---|---|---|
| COMPLETE_THESIS_SUBMISSION_READY.docx | Most current full thesis draft | High — real numbers |
| legacy handoff notes | Backend verification of real data outputs | High |
| FINDINGS.md (revised) | Corrected findings with bug notes | High |
| monetary_scorecard.py | Simulation code with √2 bug fixed | High |
| options_pricing.py | Pricing framework code | High |
| README.md | Research repository documentation | High |
| thesis-draft.md | Earlier markdown draft | Medium — may have stale numbers |

---

## THE SINGLE MOST IMPORTANT THING TO PRESERVE

The epistemic-not-mechanical argument in §1.2:

> "The connection between the two is epistemic, not mechanical — the derivative
> does not recreate the mining process, it recreates the credibility condition
> that made the passive floor functional."

This sentence is the bridge between the CEIR empirical layer and the instrument
design layer. Without it, the two halves of the thesis look disconnected.
It must appear in §1.2 and be referenced in §5.2 when answering RQ1.

---

## STATUS SUMMARY

| Component | Status | Verified |
|---|---|---|
| CEIR empirical analysis | ✅ Complete | SSRN |
| China ban natural experiment | ✅ Complete | SSRN |
| Irradiance calibration (σ=189.5%) | ✅ Complete | Real NASA data |
| Options pricing (binomial + MC) | ✅ Complete | 2.08% convergence |
| Cross-location validation | ✅ Complete | 5 markets |
| Quarterly historical simulation | ✅ Complete | 20 quarters |
| Monetary standard scorecard | ✅ Complete | 7/7 vs 3/7 vs 1/7 |
| Oracle tolerance analysis | ✅ Complete | Location-specific |
| Margin/clearing house argument | ✅ Complete | 10–15× spot |
| Thesis document (full draft) | ✅ Substantive | Needs write pass |
| Advisor feedback addressed | ❌ Pending | April 20 deadline |
| Abstract rewrite | ❌ Pending | |
| Scorecard table in Ch5 | ❌ Pending | |
| Hayek/Selgin/Bordo citations | ❌ Pending | |
| Font consistency (TNR 12pt) | ❌ Pending | |
| RDD removal | ❌ Pending | |
