# FINDINGS.md
## Running Document of Key Results
## Last Updated: April 2026 (revised for accuracy)

---

## A NOTE ON THIS REVISION

Several findings in the original version of this document were overstated or
incorrect. This revision corrects them. Where a finding has been weakened,
the reason is documented. The thesis is stronger for accurate findings than
for inflated ones — an advisor will find the problems; better to find them first.

Specific corrections:
- B vs MC divergence was stated as <1.4%; actual is 2.08%
- Zero-premium collar was stated as a σ ≥ 165% threshold finding; it is structural
- Germany was listed as not achieving zero-premium; it does (all locations do)
- Hedge effectiveness (~99%) was a misleading fixed-error calculation; replaced
  with oracle tolerance breakeven analysis
- Fiat scorecard corrected from 2/7 to 1/7
- Calibration function in monetary_scorecard.py had a sqrt(2) inflation bug
  (iid noise vs Brownian path); fixed — quarterly σ now 179–195%, not 247–287%

---

## Layer 1 — CEIR Empirical Foundation (COMPLETE)

### Primary Finding
Pre-ban CEIR coefficient:  β = −0.206, SE = 0.042, p < 0.001
Post-ban CEIR coefficient: β = −0.080, SE = 0.031, p = 0.011
Structural break: Chow F = 4.786, p = 0.0009

### Mechanism Inversion
Pre-ban interaction:  β_interaction = +0.110 (p = 0.001)
→ CEIR signal 2.8× stronger in fearful markets (rational coordination active)

Post-ban interaction: β_interaction = −0.075 (p = 0.006)
→ Signal inverts — rational channel dissolved with geographic dispersion

### Robustness
Block bootstrap (2,000 reps): 97.4% of draws β < 0
Kazakhstan falsification: confirms HHI change, not generic market disruption, drives the effect
Horse-race vs Liu-Tsyvinski (2021): CEIR incremental (R² = 0.324)

### Role in Thesis
CEIR is evidence that markets price energy floors when geographic coordination
is credible. The China ban natural experiment shows this mechanism breaks down
under dispersion (HHI 0.42 → 0.18). This motivates the designed instrument,
which replaces passive geographic coordination with contractual enforcement.
CEIR is Layer 1 evidence. It is NOT the thesis.

---

## Layer 2 — Instrument Pricing (COMPLETE, with corrections)

### Taiwan Base Case
S₀ = $0.0525/kWh | σ = 189% | r = 2.5% | T = 0.25 yr

| Method         | Call price   | Note                              |
|----------------|--------------|-----------------------------------|
| Binomial N=400 | $0.01917/kWh | Convergence verified (Table 3.2)  |
| Monte Carlo    | $0.01957/kWh | 20,000 paths, seed=42             |
| B vs MC diff   | 2.08%        | Above the stated <1.4% — correct this in thesis |

The 2.08% divergence is within acceptable MC variance at 20,000 paths but
the thesis should state the actual number, not the aspirational one. Options:
increase paths to 100,000 (convergence improves) or cite 2.08% honestly.

ATM Put: $0.01886/kWh

Binomial convergence (Table 3.2):

| N steps | Price ($/kWh) | Change     |
|---------|---------------|------------|
| 50      | 0.01909       | —          |
| 100     | 0.01914       | +0.247%    |
| 200     | 0.01916       | +0.124%    |
| 400     | 0.01917       | +0.062%    |
| 800     | 0.01918       | +0.031%    |
| 1200    | 0.01918       | +0.010%    |

Convergence is real. N=400 is justified.

### Collar Result — CORRECTED

**Original claim:** Zero-premium collar achievable at σ ≥ 165%.
**Corrected:** Zero-premium collar is structurally guaranteed at ALL sigma
levels when using ±10% symmetric percentage strikes in a lognormal model.

**Reason:** In log-space, the OTM call (K×1.1) is always closer to ATM than
the OTM put (K×0.9), because log(1.1) = 0.0953 < log(1/0.9) = 0.1054.
The call is therefore always more expensive than the put, making the collar
(put − call) always negative. This holds at σ = 10%, not just σ = 165%.

**What the σ threshold claim should have been:** the thesis was likely
observing that the credit is economically non-trivial only above some sigma.
That is a different and more defensible claim — but it requires defining
"non-trivial" explicitly.

**The honest collar finding:** Net credit grows monotonically with sigma.

| σ    | Put(0.9K)   | Call(1.1K)  | Net credit  | Net (% spot) |
|------|-------------|-------------|-------------|--------------|
| 10%  | $0.00001    | $0.00004    | −$0.00003   | −0.06%       |
| 45%  | $0.00222    | $0.00286    | −$0.00064   | −1.22%       |
| 100% | $0.00728    | $0.00857    | −$0.00129   | −2.46%       |
| 165% | $0.01328    | $0.01524    | −$0.00196   | −3.73%       |
| 189% | $0.01542    | $0.01761    | −$0.00219   | −4.17%       |
| 250% | $0.02058    | $0.02333    | −$0.00274   | −5.22%       |

**Implication for thesis:** The collar structure provides a net credit to
producers in all markets. The credit is larger in high-sigma markets. This
supports the instrument's accessibility argument, but cannot be framed as a
threshold discovery. Frame it as: "the lognormal structure of irradiance
returns ensures the collar generates net credit; credit magnitude scales
with irradiance volatility, favouring high-insolation markets."

### Cross-Location Validation — CORRECTED

Germany was previously listed as not achieving zero-premium. This is wrong —
Germany also receives net credit (−$0.00035/kWh). The zero-premium property
is universal to the strike structure.

| Location     | σ    | Call ($/kWh) | Put ($/kWh) | Collar net  | Net % spot |
|--------------|------|--------------|-------------|-------------|------------|
| Taiwan       | 189% | 0.019173     | 0.018857    | −0.002189   | −4.17%     |
| Saudi Arabia | 172% | 0.018408     | 0.018076    | −0.002121   | −3.86%     |
| Arizona, USA | 165% | 0.018772     | 0.018135    | −0.002414   | −4.16%     |
| Brazil       | 198% | 0.037018     | 0.033888    | −0.006398   | −6.73%     |
| Germany      | 45%  | 0.002339     | 0.002122    | −0.000345   | −1.38%     |

The economic interpretation holds: high-sigma markets receive larger credits.
Brazil (σ=198%) receives the largest credit at 6.73% of spot; Germany the
smallest at 1.38%. This is a real, defensible cross-location finding.

### Volatility Calibration
σ = 189% (annualised) from NASA POWER irradiance log-returns, Taiwan
2019–2024. Jarque-Bera p = 0.743 — fail to reject normality. GBM justified
at T ≤ 0.25 years at this location.

The 189% figure is irradiance volatility, not electricity price volatility.
This distinction is the cold-start methodological contribution: using
physical source-of-risk volatility in the absence of a liquid options market.

### Role in Thesis
Proves the instrument can be priced from publicly available satellite data
without a liquid options market (cold-start problem solved). The cross-location
validation shows the method generalises across five markets with different cost
structures and risk-free rates.

---

## Layer 3 — Monetary Standard Argument (IN PROGRESS)

### Scorecard — CORRECTED

**Scoring methodology:** 1.0 = fully satisfies, 0.5 = partially satisfies,
0 = fails. Score sum and count of non-zero conditions both reported.

| Condition                              | Energy | Gold | Fiat |
|----------------------------------------|--------|------|------|
| 1. Verifiable production cost floor    | 1.0 ✓  | 0.5 ∂ | 0.0 ✗ |
| 2. Independent observability           | 1.0 ✓  | 0.0 ✗ | 0.0 ✗ |
| 3. Scarcity / irreversibility          | 1.0 ✓  | 1.0 ✓ | 0.0 ✗ |
| 4. Contractual enforcement             | 1.0 ✓  | 0.0 ✗ | 0.0 ✗ |
| 5. Cash settlement                     | 1.0 ✓  | 0.0 ✗ | 1.0 ✓ |
| 6. Credibility under dispersion        | 1.0 ✓  | 0.0 ✗ | 0.0 ✗ |
| 7. Physics-based price floor           | 1.0 ✓  | 0.5 ∂ | 0.0 ✗ |
| **Score sum**                          | **7.0/7** | **2.0/7** | **1.0/7** |
| **Conditions met (score > 0)**         | **7/7** | **3/7** | **1/7** |

**Corrected from original:** Fiat was 2/7 — now correctly 1/7. Fiat only
passes condition 5 (cash settlement). The original README said "fiat fails
properties 1,2,3,4,6,7" — its own text contradicted the 2/7 claim.

**Critical framing note:** This scorecard is a theoretical framework derived
from monetary economics literature (Friedman 1960; Selgin 2015; Hayek 1976).
The seven conditions were not constructed independently and then found to
favour energy — they were constructed to operationalise what a monetary
standard requires. An advisor will raise this. The response must be: these
conditions are derived from the literature, not reverse-engineered from the
conclusion, and each must be individually cited and defended.

### Historical Simulation — CORRECTED

**Data:** Synthetic irradiance series calibrated to Taiwan NASA POWER
(σ=189%, seed=42). All simulation results are illustrative, not empirical.
Must be replaced with real NASA POWER data before thesis submission.

**Calibration bug corrected:** The original code used iid log-noise multiplied
by a seasonal base. Log-returns of (seasonal × iid_noise) include differences
of iid draws, inflating σ by √2 (189% × 1.414 ≈ 267%). Fixed by using
cumulative Brownian increments. Realised σ is now 187.2%, matching target.

**20-quarter results (2020–2024):**

| Quarter | σ      | Collar net   | Margin (99%) | Margin × spot | Max oracle err (VR≥95%) |
|---------|--------|--------------|--------------|---------------|-------------------------|
| 2020-Q1 | 183.1% | −$0.00213    | $0.585/kWh   | 11.1×         | 21.0%                   |
| 2020-Q2 | 186.6% | −$0.00217    | $0.614/kWh   | 11.7×         | 21.4%                   |
| 2020-Q3 | 181.3% | −$0.00211    | $0.571/kWh   | 10.9×         | 20.8%                   |
| 2020-Q4 | 188.5% | −$0.00218    | $0.633/kWh   | 12.1×         | 21.6%                   |
| 2021-Q1 | 186.2% | −$0.00216    | $0.610/kWh   | 11.6×         | 21.4%                   |
| 2021-Q2 | 186.8% | −$0.00217    | $0.615/kWh   | 11.7×         | 21.4%                   |
| 2021-Q3 | 195.1% | −$0.00225    | $0.692/kWh   | 13.2×         | 22.4%                   |
| 2021-Q4 | 193.0% | −$0.00223    | $0.669/kWh   | 12.7×         | 22.1%                   |
| 2022-Q1 | 192.0% | −$0.00222    | $0.659/kWh   | 12.6×         | 22.0%                   |
| 2022-Q2 | 188.3% | −$0.00218    | $0.629/kWh   | 12.0×         | 21.6%                   |
| 2022-Q3 | 183.6% | −$0.00214    | $0.589/kWh   | 11.2×         | 21.1%                   |
| 2022-Q4 | 182.8% | −$0.00213    | $0.581/kWh   | 11.1×         | 21.0%                   |
| 2023-Q1 | 179.3% | −$0.00210    | $0.548/kWh   | 10.4×         | 20.6%                   |
| 2023-Q2 | 185.5% | −$0.00216    | $0.604/kWh   | 11.5×         | 21.3%                   |
| 2023-Q3 | 194.1% | −$0.00224    | $0.681/kWh   | 13.0×         | 22.3%                   |
| 2023-Q4 | 193.2% | −$0.00223    | $0.672/kWh   | 12.8×         | 22.2%                   |
| 2024-Q1 | 194.5% | −$0.00224    | $0.686/kWh   | 13.1×         | 22.3%                   |
| 2024-Q2 | 190.4% | −$0.00220    | $0.645/kWh   | 12.3×         | 21.8%                   |
| 2024-Q3 | 185.8% | −$0.00216    | $0.607/kWh   | 11.6×         | 21.3%                   |
| 2024-Q4 | 187.2% | −$0.00217    | $0.621/kWh   | 11.8×         | 21.5%                   |

σ CV across 20 quarters: 0.025 (synthetic — validate with real data)
Collar CV across 20 quarters: 0.020

### New Finding: Oracle Tolerance by Location (ROBUST)

This replaces the previous "hedge effectiveness = 99.6%" claim, which was
misleading. The previous formula fixed oracle error at 6% of spot and showed
VR was high — but VR approaches 1 trivially at high sigma regardless of
oracle quality. The meaningful question is: what oracle error rate causes
the hedge to degrade?

**Formula:** Max oracle error (as % of spot) for VR ≥ threshold =
σ · √T · √((1−threshold) / threshold)

**Results (T = 0.25 yr):**

| Location     | σ    | Max err (VR≥95%) | Max err (VR≥90%) | Max err (VR≥80%) |
|--------------|------|-----------------|-----------------|-----------------|
| Taiwan       | 189% | 21.7%           | 31.5%           | 47.2%           |
| Saudi Arabia | 172% | 19.7%           | 28.7%           | 43.0%           |
| Arizona, USA | 165% | 18.9%           | 27.5%           | 41.2%           |
| Brazil       | 198% | 22.7%           | 33.0%           | 49.5%           |
| Germany      | 45%  | 5.2%            | 7.5%            | 11.2%           |

**NASA POWER accuracy benchmark:** ~3–10% (Journée & Bertrand 2010; Polo et al. 2016)

**Interpretation:**
- Taiwan, Saudi Arabia, Arizona, Brazil: instrument is robustly tolerant.
  Even at 22% oracle error, VR remains above 95%. NASA POWER accuracy
  (3–10%) is well within this threshold.
- Germany (σ=45%): instrument is marginal. Requires oracle accuracy <5.2%
  for VR≥95%. At the upper end of NASA POWER error (10%), hedge effectiveness
  falls below 80% VR. Germany is not a suitable primary deployment market
  for this instrument design.

**This is the correct framing of the oracle robustness argument.** It is
location-specific, derives a concrete threshold, and is falsifiable. It also
produces a genuine limitation: low-sigma markets (temperate climates with
low irradiance volatility) are not suitable deployment contexts.

### New Finding: Margin as Adoption Constraint (HONEST LIMITATION)

The thesis previously claimed the zero-premium collar "removes the primary
adoption barrier." This is incorrect. The collar removes the option premium
barrier. The margin requirement is a larger and independent barrier.

**Taiwan, σ=189%, T=0.25yr, 1.5× multiplier:**

| Confidence | Margin ($/kWh) | Margin / spot | Implication                  |
|------------|----------------|---------------|------------------------------|
| 90%        | $0.185         | 3.5×          | Producer-postable            |
| 95%        | $0.296         | 5.6×          | Clearing house required      |
| 98%        | $0.468         | 8.9×          | Clearing house required      |
| 99%        | $0.633         | 12.1×         | Clearing house required      |
| 99.9%      | $1.381         | 26.3×         | Clearing house required      |

**At 99% confidence (the thesis's chosen level), margin = 12× spot price.**
A producer selling energy at $0.0525/kWh must post $0.63 per kWh in margin.
This is not a minor friction — it is a capital requirement that exceeds most
distributed producers' balance sheet capacity.

**How the thesis should handle this:**
- Do not omit it or claim the collar solves it
- Argue explicitly that a CME-style clearing house intermediary is required
- The clearing house posts margin against a pooled producer portfolio
- This reduces per-producer capital requirement through netting
- Cite: Hull (2018) §6, CME margin methodology
- Frame it as a design requirement that the monetary system must satisfy,
  not as a failure of the instrument

The clearing house argument is defensible — it is how all exchange-traded
derivatives work. But it must be made explicitly. Omitting it is the kind
of thing that gets a thesis sent back.

### Sigma Stability (ILLUSTRATIVE — needs real data)
σ CV = 0.025 across 20 quarters of synthetic data
Comparable to gold (CV ≈ 0.045, World Gold Council 2019–2024)
Lower CV = more consistent pricing, not lower price volatility

This must be validated with real NASA POWER data. The synthetic series is
calibrated to be stationary by construction — a real irradiance series will
have weather regime shifts, El Niño effects, and seasonal structure that
could affect the CV meaningfully.

---

## Findings Summary

### What is solid and defensible

1. **Layer 1 CEIR empirical analysis.** Coefficients, structural break, and
   mechanism inversion are all documented with proper standard errors. The
   China ban as a natural experiment is well-identified. Kazakhstan falsification
   is a genuine robustness check. This layer stands.

2. **Cold-start volatility calibration.** Using NASA POWER irradiance log-returns
   as the volatility input is methodologically justified and novel. The
   log-normality of Taiwan irradiance (JB p=0.743) justifies GBM at T≤0.25yr.
   This is the key pricing innovation.

3. **Binomial convergence at N=400.** Table 3.2 is correct. Price stabilises at
   N=400 (change < 0.1% from N=200). This is real.

4. **Cross-location pricing.** The model produces coherent prices across five
   markets. The variation in collar net credit by location (Brazil 6.73% vs
   Germany 1.38%) reflects real differences in irradiance volatility and is
   a genuine cross-market finding.

5. **Oracle tolerance analysis.** The location-specific breakeven error rates
   are derived directly from the hedge effectiveness formula with no circularity.
   The finding that high-sigma markets are robustly tolerant and Germany is
   marginal is a real, testable result.

6. **The theoretical argument that energy satisfies monetary standard conditions.**
   If properly grounded in the cited literature, this is a legitimate theoretical
   contribution. The conditions are not empirically tested, but academic monetary
   economics routinely proceeds by theoretical argument from cited premises.

### What is weak or needs correction

1. **Collar threshold claim (σ ≥ 165%) is wrong.** Replace with the correct
   monotonic relationship between σ and collar credit magnitude.

2. **B vs MC divergence.** Stated as <1.4%, actual 2.08%. Correct the thesis.

3. **Fiat scorecard.** Was 2/7, should be 1/7.

4. **Hedge effectiveness (99.6%) was misleading.** Replace entirely with oracle
   tolerance analysis.

5. **Margin not addressed.** Must be added to the thesis with the clearing house
   argument.

6. **All simulation results are synthetic.** The 20-quarter table is from a
   calibrated random process, not from actual irradiance data. This must be
   clearly stated and real NASA POWER data must be substituted before submission.

---

## Open Questions (unchanged from prior version)

1. **Hayek reference:** Cite Hayek (1976) *Denationalisation of Money* for
   competing currencies framing.

2. **Nixon shock comparison:** Add explicit paragraph comparing gold standard
   failure (enforcement collapse under dispersion) to CEIR post-ban finding.

3. **Simulation with real NASA POWER data:** Run `irradiance_calibration.py`
   locally to fetch actual data and replace synthetic series. The σ=189% result
   is from real data; the quarterly simulation needs to use it.

4. **Correlation matrix:** De-Rong requested for empirical section.

5. **Dummy variables:** Pre/post ban dummy as alternative to Chow split.

6. **Clearing house argument:** Develop this explicitly for margin section.
   One paragraph is sufficient but it must be there.

---

## What NOT to Change

The following are validated and correct:
- CEIR formula and regression specification
- Amihud-Hurvich bias correction as primary spec
- σ = 189% (Taiwan, NASA POWER 2019-2024)
- N = 400 binomial steps
- Collar strikes: 0.90×K put, 1.10×K call
- T = 0.25 (quarterly)
- Seven monetary standard conditions (as theoretical framework)
- GBM justified at T ≤ 0.25yr at high-sigma locations (JB confirmed)
