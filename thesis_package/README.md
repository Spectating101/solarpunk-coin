# SolarPunk Protocol — Research Repository
## Master's Thesis: Energy as a Monetary Standard
### Yuan Ze University | Department of Finance | Christopher Ongko | 2025

---

## ⚠️ READ THIS FIRST — WHAT THIS PROJECT IS AND IS NOT

This repository documents a master's thesis that proposes **energy-backed derivatives as a new monetary standard**, and provides the empirical, pricing, and simulation methodology to support that claim.

### What this project IS:
- A monetary economics thesis asking: *can energy replace fiat/gold as a credible monetary standard?*
- An instrument design study: *what does the energy-backed derivative look like, how is it priced, and does it satisfy monetary standard conditions?*
- An empirical study using Bitcoin mining data as a **supporting foundation**, not the main thesis
- A simulation framework demonstrating feasibility using publicly available data

### What this project IS NOT:
- A paper about whether energy predicts Bitcoin prices (that is a sub-finding, not the thesis)
- A CEIR (Cumulative Energy Investment Ratio) methodology paper
- A cryptocurrency trading strategy
- A blockchain engineering project

### The one-sentence thesis:
> Energy-backed derivatives can satisfy the necessary and sufficient conditions for a credible monetary standard — outperforming both gold (on verifiability and settlement) and fiat (on production constraint and scarcity) — and can be priced and deployed using publicly available satellite irradiance data without requiring a liquid options market.

### Why CEIR exists in this project:
CEIR is the empirical foundation that proves energy cost floors are priced by markets when enforcement is credible. It is evidence for the monetary design argument, not the thesis itself. Think of it as the proof-of-concept that licenses the instrument design.

---

## Project Structure

```
solarpunk-research/
├── README.md                    ← This file. Read entirely before running anything.
├── RESEARCH_DESIGN.md           ← Full methodology specification
├── DATA_SOURCES.md              ← All data sources, APIs, access instructions
├── FINDINGS.md                  ← Running document of key results
│
├── 01_foundation/
│   ├── ceir_analysis.py         ← CEIR empirical analysis (Bitcoin mining ban)
│   ├── ceir_theory.md           ← Theoretical justification for CEIR
│   └── data/                    ← Bitcoin price, hash rate, mining geography
│
├── 02_pricing/
│   ├── irradiance_calibration.py  ← NASA POWER API fetch and sigma calibration
│   ├── options_pricing.py         ← Black-Scholes, binomial tree, Monte Carlo
│   ├── cross_location.py          ← Global validation (5 markets)
│   └── data/                      ← Irradiance data, LCOE by location
│
├── 03_simulation/
│   ├── quarterly_simulation.py    ← Historical simulation across 20 quarters
│   ├── monetary_scorecard.py      ← Energy vs Gold vs Fiat property comparison
│   ├── stability_analysis.py      ← Value stability across regimes
│   └── results/                   ← CSV outputs, charts
│
├── 04_monetary_design/
│   ├── standard_properties.py     ← Formalises monetary standard conditions
│   ├── credibility_proof.md       ← Credibility equivalence argument
│   └── instrument_spec.md         ← Full term sheet and contract design
│
└── thesis/
    ├── proposal_improved.docx     ← Current proposal (filed with De-Rong Kong)
    ├── full_draft.docx            ← Full thesis draft
    └── chapters/                  ← Chapter markdown files
```

---

## Research Architecture

### The Three-Layer Argument

```
LAYER 1 — EMPIRICAL FOUNDATION (Chapter 2)
─────────────────────────────────────────
Question: Does energy expenditure create credible value floors?
Method:   CEIR predictive regression + China ban natural experiment
Finding:  Yes — but only under geographic coordination (HHI-dependent)
Role:     Proof that markets price energy floors when enforcement is credible
Status:   COMPLETE. Published on SSRN.

        ↓ Implication: designed instruments can replicate coordination

LAYER 2 — INSTRUMENT PRICING (Chapter 3)
────────────────────────────────────────
Question: Can you price an energy-backed derivative without a liquid market?
Method:   Physics-based volatility (NASA POWER) → GBM → Black-Scholes
Finding:  Yes — and the ±10% collar is structurally net-credit, with credit magnitude increasing in high-σ markets
Role:     Proves the instrument is priceable and identifies where the structure is most economically attractive
Status:   COMPLETE. Code in 02_pricing/

        ↓ Implication: instrument design is technically feasible

LAYER 3 — MONETARY STANDARD ARGUMENT (Chapter 4)
─────────────────────────────────────────────────
Question: Does this instrument satisfy monetary standard conditions?
Method:   Structured property comparison + historical simulation
Finding:  Energy 7/7 properties, Gold 3/7, Fiat 1/7
Role:     The actual thesis claim — energy as a monetary architecture
Status:   SIMULATION COMPLETE. Theoretical argument in development.
```

### Why This Structure Works

Each layer is a necessary condition for the next:
- You cannot claim a monetary standard without proving the instrument is credible
- You cannot prove credibility without proving pricing is sound
- You cannot prove pricing is sound without empirical evidence that energy floors exist

The thesis builds this chain from the bottom up. An LLM working on any component should understand which layer it is in and what claim it supports.

---

## Key Parameters (Do Not Change Without Justification)

```python
# Taiwan Primary Case
S0    = 0.0525   # $/kWh — Bureau of Energy Taiwan LCOE
K     = S0       # ATM strike = LCOE (at-the-money at inception)
r     = 0.025    # Risk-free rate — Taiwan 1yr government bond
T     = 0.25     # Quarterly maturity (0.25 years)
sigma = 1.89     # Filtered NASA POWER calibration: 4-day rolling mean + 1% |log return| trim on 2019–2024 data
N     = 400      # Binomial tree steps (convergence-verified)
paths = 20000    # Monte Carlo paths (Taiwan base-case divergence = 2.08%)

# Margin Framework (thesis §4.4)
z99       = 2.33   # 99th percentile z-score
mult      = 1.5    # Initial margin multiplier (1.5 × VaR99%)
maint_pct = 1.20   # Liquidation threshold (120% of max loss)
ins_fund  = 0.005  # Insurance fund (0.5% of open interest)

# Collar Structure
put_strike_pct  = 0.90  # 10% OTM put (floor)
call_strike_pct = 1.10  # 10% OTM call (cap)
# Note: collar net credit is structural for this strike pair; higher σ increases the credit magnitude

# Oracle Architecture
oracle_weights = {"nasa": 0.40, "utility": 0.40, "chainlink": 0.20}
oracle_error_target = 0.07  # 7% maximum measurement error
```

Important calibration note: the thesis-grade Taiwan volatility is a filtered operational estimate, not the raw daily irradiance volatility. The reproducible real-data path is `thesis_reconstructed` in [monetary_scorecard.py](/home/phyrexian/Downloads/llm_automation/project_portfolio/Solarpunk-bitcoin/thesis_package/monetary_scorecard.py), which applies a 4-day rolling mean and trims the top 1% of absolute log returns before annualising. On the fetched 2019–2024 NASA POWER series, that produces `σ = 189.5%` and `JB p = 0.349`.

---

## The Monetary Standard Conditions

The thesis evaluates energy against these seven properties. Any LLM working on this must understand what each means:

| # | Property | Why It Matters |
|---|---|---|
| 1 | **Verifiable production cost floor** | Creates a price floor independent of market sentiment |
| 2 | **Independent observability** | Third parties can verify value without trusting the issuer |
| 3 | **Scarcity / irreversibility** | Supply cannot be inflated arbitrarily |
| 4 | **Contractual enforcement** | Floor holds automatically without coordination |
| 5 | **Cash settlement without physical delivery** | Practical for digital economy |
| 6 | **Credibility under geographic dispersion** | Survives decentralisation of producers |
| 7 | **Physics-based price floor** | Anchored to physical reality, not institutional promise |

**Why gold fails properties 4 and 5:**
- Gold requires counterparty coordination to enforce floors (failed under Nixon shock)
- Gold requires physical custody for settlement (impractical at digital scale)

**Why fiat fails properties 1, 2, 3, 4, 6, 7:**
- No production cost constraint — can be created at will
- Value depends entirely on institutional trust and policy

**Why energy passes all seven:**
- Irradiance is satellite-verifiable (NASA POWER)
- Energy expenditure is physically irreversible
- Contractual settlement via smart contract + oracle requires no coordination
- LCOE provides physics-based price floor derivable from first principles

---

## What CEIR Is (Read Before Touching 01_foundation/)

CEIR = Cumulative Energy Investment Ratio

```
CEIR_t = Market_Cap_t / Σ(s=0 to t)[Energy_consumed_s × Electricity_price_s]
```

**What it measures:** Whether Bitcoin's market value is above or below its cumulative energy attack cost. When CEIR is low, the asset is priced below its security cost — rational actors correct this.

**Why it matters for the monetary thesis:** CEIR empirically demonstrates that markets price credible energy floors. The China ban natural experiment shows this only works under geographic coordination. This motivates the designed instrument — which provides contractual coordination instead of geographic coordination.

**What CEIR is NOT:**
- It is not the thesis
- It is not a trading signal
- It is not a claim that Bitcoin price equals mining cost
- It is not a proof that energy is a good monetary standard

CEIR is one piece of evidence for Layer 1. Do not expand its role.

---

## Running Order

For the current submission-ready package, these are the commands that matter:

```bash
python thesis_package/options_pricing.py
python thesis_package/monetary_scorecard.py --data-source real --diagnostics
```

This writes the current empirical outputs into `thesis_package/empirical_results/`, including:
- `cross_location_pricing.csv`
- `oracle_tolerance.csv`
- `calibration_diagnostics_real.csv`
- `quarterly_simulation_real_thesis_reconstructed.csv`

If starting fresh:

```bash
# 1. Install dependencies
pip install requests pandas numpy scipy matplotlib seaborn

# 2. Fetch irradiance data
python 02_pricing/irradiance_calibration.py

# 3. Run pricing validation
python 02_pricing/options_pricing.py

# 4. Run cross-location validation
python 02_pricing/cross_location.py

# 5. Run historical simulation (main result)
python 03_simulation/quarterly_simulation.py

# 6. Generate monetary scorecard
python 03_simulation/monetary_scorecard.py

# 7. Run stability analysis
python 03_simulation/stability_analysis.py
```

Each script outputs to `03_simulation/results/` and logs key findings.

---

## What an LLM Should Do With This Repository

### If asked to extend the empirical analysis (Layer 1):
- Work within `01_foundation/ceir_analysis.py`
- Do not change the CEIR formula or regression specification
- Any new robustness check goes in a separate function, not replacing existing ones
- The Amihud-Hurvich augmented regression is the primary spec — do not substitute

### If asked to improve the pricing framework (Layer 2):
- All pricing uses Black-Scholes with physics-based σ
- σ comes from NASA POWER irradiance log-returns × √252
- Do not substitute market-implied volatility — that defeats the cold-start solution
- GBM is justified at T ≤ 1 year; for T > 1 year use Schwartz (1997) OU process

### If asked to extend the monetary standard argument (Layer 3):
- Work within `04_monetary_design/standard_properties.py`
- The seven properties are fixed — do not add or remove without documented justification
- The comparison is Energy vs Gold vs Fiat — do not add other standards without reason
- The scorecard result (7/7, 3/7, 1/7) should be reproducible from the properties logic

### If asked to write thesis content:
- The tone is academic finance, not crypto advocacy
- CEIR is introduced in Chapter 2 as a supporting empirical finding
- The monetary standard claim is in Chapter 4
- The thesis does not claim to have launched a market or deployed an instrument
- Every claim requires a citation or a derivation — no assertions without support

### What NOT to do:
- Do not reframe the thesis as a CEIR methodology paper
- Do not expand the oracle engineering into a full engineering deliverable
- Do not make the RDD (regression discontinuity) a primary identification strategy — it is removed from the proposal per advisor feedback
- Do not add cryptocurrency price prediction as a goal
- Do not claim the SolarPunk Protocol is deployed — it is illustrative only

---

## Advisor Feedback Summary (April 2026)

De-Rong Kong reviewed the proposal and gave the following key directions:

1. **Explain PoW assets from scratch** — do not assume the reader knows what Bitcoin mining is
2. **Cite every argument in Section 1** — especially the passive-to-active framing
3. **Section 2.3 (causal identification) moves to Research Design** — not Literature Review
4. **One research question or two with justification** — she prefers one at a time
5. **Number all equations and define all variables** — CEIR formula needs Equation (1), regression needs Equation (2)
6. **Explain why Bitcoin only** — justify the single-asset focus in the data section
7. **Explain the 30-day return window** — why 30 days, not 14 or 60
8. **Remove RDD from methodology** — scrap it, the Chow test is sufficient
9. **Separate methodology and results** — two distinct sections
10. **Font consistency** — Times New Roman 12pt throughout (inconsistency signals AI generation)
11. **Table captions in first row** — column headers must be self-explanatory
12. **Add correlation matrix** — check multicollinearity among regressors
13. **Start literature from basic to advanced** — foundational papers first

**The meta-feedback:** The proposal was too wide and too niche simultaneously. The solution is to lead with the monetary economics question (accessible, important) and use CEIR/pricing as the technical answer (deep, rigorous). Do not lead with the technical machinery.

---

## Key References

### Monetary Economics (Layer 3 foundation)
- Friedman, M. (1960). *A Program for Monetary Stability.* Fordham University Press.
- Hayek, F.A. (1976). *Denationalisation of Money.* Institute of Economic Affairs.
- Bordo, M.D., & Eichengreen, B. (1993). *A Retrospective on the Bretton Woods System.* NBER.
- Selgin, G. (2015). Synthetic commodity money. *Journal of Financial Stability*, 17, 92–99.

### Crypto Valuation (Layer 1)
- Hayes, A.S. (2017). Cryptocurrency value formation. *Telematics and Informatics*, 34(7).
- Liu, Y., & Tsyvinski, A. (2021). Risks and returns of cryptocurrency. *Review of Financial Studies*, 34(6).
- Pagnotta, E., & Buraschi, A. (2018). An equilibrium valuation of Bitcoin. *SSRN*.

### Derivatives Pricing (Layer 2)
- Cao, M., & Wei, J. (2004). Weather derivatives valuation. *Journal of Futures Markets*, 24(11).
- Deng, S.J., & Oren, S.S. (2006). Electricity derivatives and risk management. *Energy*, 31.
- Moreno-Leiva, S. et al. (2021). Irradiance-based weather derivative. *Renewable Energy*, 164.
- Schwartz, E.S. (1997). Stochastic behavior of commodity prices. *Journal of Finance*, 52(3).

### Econometrics
- Amihud, Y., & Hurvich, C.M. (2004). Predictive regressions. *JFQA*, 39(4).
- Angrist, J.D., & Pischke, J.S. (2009). *Mostly Harmless Econometrics.* Princeton.
- Stambaugh, R.F. (1999). Predictive regressions. *Journal of Financial Economics*, 54(3).

---

## Status Tracker

| Component | Status | Output |
|---|---|---|
| CEIR empirical analysis | ✅ Complete | SSRN working paper |
| China ban natural experiment | ✅ Complete | SSRN working paper |
| Irradiance calibration (Taiwan) | ✅ Complete | Real-data methods now explicit; filtered Taiwan spec lands near σ ≈ 189% |
| Options pricing (B-S + binomial + MC) | ✅ Complete | 2.08% Taiwan base-case B vs MC divergence |
| Cross-location validation | ✅ Complete | 5 markets |
| Quarterly historical simulation | ✅ Complete | 20 quarters |
| Monetary standard scorecard | ✅ Complete | 7/7 vs 3/7 vs 1/7 |
| Stability analysis | ✅ Complete | CV = 0.027 |
| Monetary theory argument | 🔄 In progress | Chapter 4 draft |
| Proposal (revised per advisor) | 🔄 In progress | Due April 20 |
| Full thesis manuscript | 🔄 In progress | Defense Sem 2 2026 |
