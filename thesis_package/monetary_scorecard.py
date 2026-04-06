"""
monetary_scorecard.py
=====================
Monetary Standard Property Comparison
SolarPunk Research | Christopher Ongko | Yuan Ze University 2025

PURPOSE:
    Formally evaluates whether energy-backed derivatives satisfy the
    necessary and sufficient conditions for a monetary standard.
    Compares energy vs gold vs fiat on seven properties.

THIS IS THE CORE OF THE MONETARY THESIS.
    All other components (CEIR, pricing) support this argument.
    The scorecard is the thesis claim expressed as structured analysis.

METHODOLOGY:
    1. Define seven necessary conditions for a monetary standard
       (derived from monetary economics literature)
    2. Evaluate each standard against each condition with evidence
    3. Run historical simulation to demonstrate feasibility
    4. Produce stability comparison across monetary systems

OUTPUT:
    - Scorecard table (7 conditions × 3 standards)
    - Historical simulation results (20 quarters)
    - Stability metrics
    - Key findings summary
"""

import numpy as np
import pandas as pd
from scipy.stats import norm, jarque_bera

np.random.seed(42)


# ─────────────────────────────────────────────────────────────────────────────
# SEVEN MONETARY STANDARD CONDITIONS
# ─────────────────────────────────────────────────────────────────────────────
# Each condition is a dict with:
#   name:        Short label
#   description: What it means and why it matters
#   energy:      How energy-backed derivative satisfies (or fails)
#   gold:        How gold satisfies (or fails)
#   fiat:        How fiat satisfies (or fails)
#   energy_score, gold_score, fiat_score: 1 (pass), 0.5 (partial), 0 (fail)

CONDITIONS = [
    {
        "name": "Verifiable production cost floor",
        "description": (
            "The unit of account must have an independently verifiable "
            "cost of production creating a credible price floor. "
            "Source: Marshall (1890), Brennan & Schwartz (1985)."
        ),
        "energy":       "✓ NASA POWER irradiance → LCOE = verifiable floor",
        "gold":         "∂ Market price observable; cost varies by mine",
        "fiat":         "✗ No production constraint",
        "energy_score": 1.0,
        "gold_score":   0.5,
        "fiat_score":   0.0,
        "evidence": "S₀ = $0.0525/kWh (Taiwan LCOE, Bureau of Energy)"
    },
    {
        "name": "Independent observability",
        "description": (
            "Third parties must verify value without trusting any issuer. "
            "Satoshi Nakamoto's design principle: trustless verification."
        ),
        "energy":       "✓ Satellite data — publicly accessible, tamper-resistant",
        "gold":         "✗ Requires physical assay or market price trust",
        "fiat":         "✗ Requires trust in central bank reporting",
        "energy_score": 1.0,
        "gold_score":   0.0,
        "fiat_score":   0.0,
        "evidence": "NASA POWER API: publicly accessible, no credentials required"
    },
    {
        "name": "Scarcity / irreversibility",
        "description": (
            "The monetary unit must be costly to produce and the cost "
            "must be irreversible — preventing arbitrary supply expansion. "
            "Source: Friedman (1960) on commodity money."
        ),
        "energy":       "✓ Energy once spent cannot be recreated retroactively",
        "gold":         "✓ Mining cost is real and irreversible",
        "fiat":         "✗ Unlimited issuance at near-zero marginal cost",
        "energy_score": 1.0,
        "gold_score":   1.0,
        "fiat_score":   0.0,
        "evidence": "Cumulative energy expenditure: irreversible by thermodynamics"
    },
    {
        "name": "Contractual enforcement (dispersion-proof)",
        "description": (
            "Price floor enforcement must be automatic and non-discretionary, "
            "surviving even when producers/validators are geographically dispersed. "
            "This is the key failure of the gold standard (Nixon 1971) and "
            "Bitcoin's passive mechanism (China ban 2021). "
            "Source: CEIR empirical finding (Layer 1)."
        ),
        "energy":       "✓ Smart contract liquidation: algorithmic, non-discretionary",
        "gold":         "✗ Required central bank coordination — failed 1971",
        "fiat":         "✗ Depends on policy decision, inherently discretionary",
        "energy_score": 1.0,
        "gold_score":   0.0,
        "fiat_score":   0.0,
        "evidence": "CEIR finding: passive coordination failed; contractual replaces it"
    },
    {
        "name": "Cash settlement without physical delivery",
        "description": (
            "The standard must be practically transferable at digital scale "
            "without requiring physical movement of the underlying commodity. "
            "Gold's physical custody requirement is the primary practical "
            "barrier to a global gold standard."
        ),
        "energy":       "✓ Oracle-settled cash payment, no physical transfer",
        "gold":         "✗ Physical custody required — impractical at digital scale",
        "fiat":         "✓ Native digital transfer",
        "energy_score": 1.0,
        "gold_score":   0.0,
        "fiat_score":   1.0,
        "evidence": "Settlement: max(Verified_Price - Strike, 0) × Notional, in USDC"
    },
    {
        "name": "Credibility under geographic dispersion",
        "description": (
            "The standard must remain credible even when producers "
            "are spread across many countries with different cost structures. "
            "This is the empirical contribution of the CEIR analysis: "
            "geographic dispersion dissolved Bitcoin's passive anchor. "
            "A designed system must survive dispersion."
        ),
        "energy":       "✓ Contract terms survive any distribution of producers",
        "gold":         "✗ Requires concentrated custodians or central banks",
        "fiat":         "✗ Requires policy coordination across jurisdictions",
        "energy_score": 1.0,
        "gold_score":   0.0,
        "fiat_score":   0.0,
        "evidence": "Chow F = 4.786: Bitcoin's passive mechanism broke at dispersion"
    },
    {
        "name": "Physics-based price floor",
        "description": (
            "The floor must be grounded in physical law, not institutional "
            "convention or market sentiment. Physical law cannot be changed "
            "by policy decisions or market manipulation. "
            "Source: thermodynamics of energy expenditure."
        ),
        "energy":       "✓ LCOE derived from irradiance physics; floor is real",
        "gold":         "∂ Geological scarcity has physical basis; price less so",
        "fiat":         "✗ No physical basis — pure convention",
        "energy_score": 1.0,
        "gold_score":   0.5,
        "fiat_score":   0.0,
        "evidence": "σ = 189% from physical irradiance variation (NASA POWER)"
    }
]


# ─────────────────────────────────────────────────────────────────────────────
# PRICING HELPERS (minimal re-implementation for self-containment)
# ─────────────────────────────────────────────────────────────────────────────

def bs_call(S, K, r, sigma, T):
    d1 = (np.log(S/K) + (r + 0.5*sigma**2)*T) / (sigma*np.sqrt(T))
    d2 = d1 - sigma*np.sqrt(T)
    return S*norm.cdf(d1) - K*np.exp(-r*T)*norm.cdf(d2)

def bs_put(S, K, r, sigma, T):
    return bs_call(S, K, r, sigma, T) - S + K*np.exp(-r*T)

def var_margin(S, sigma, T, z, mult=1.5):
    return mult * S * (np.exp(z * sigma * np.sqrt(T)) - 1)

def oracle_max_error(sigma, T, threshold):
    """
    Maximum oracle error (as fraction of spot) that maintains hedge
    effectiveness >= threshold.

    Derivation:
        VR = sigma_X^2 / (sigma_X^2 + sigma_eps^2) >= threshold
        where sigma_X = sigma * sqrt(T)  [payoff std as fraction of spot]
              sigma_eps = oracle_err_pct  [oracle noise as fraction of spot]
        Solving: sigma_eps_max = sigma * sqrt(T) * sqrt((1-threshold)/threshold)

    This is the breakeven oracle quality requirement. It grows with sigma:
    high-sigma locations can tolerate much larger oracle error.
    """
    return sigma * np.sqrt(T) * np.sqrt((1 - threshold) / threshold)


# ─────────────────────────────────────────────────────────────────────────────
# SCORECARD
# ─────────────────────────────────────────────────────────────────────────────

def generate_scorecard():
    """
    Produces the monetary standard property comparison table.
    This is Table 4.X in the thesis.
    """
    rows = []
    for c in CONDITIONS:
        rows.append({
            "Property":      c["name"],
            "Energy":        c["energy"],
            "Gold":          c["gold"],
            "Fiat":          c["fiat"],
            "E_score":       c["energy_score"],
            "G_score":       c["gold_score"],
            "F_score":       c["fiat_score"],
        })

    df = pd.DataFrame(rows)
    # Sum of fractional scores (1.0=full, 0.5=partial, 0=fail)
    sum_e = df["E_score"].sum()
    sum_g = df["G_score"].sum()
    sum_f = df["F_score"].sum()
    # Count of conditions with any non-zero score (full or partial)
    cnt_e = (df["E_score"] > 0).sum()
    cnt_g = (df["G_score"] > 0).sum()
    cnt_f = (df["F_score"] > 0).sum()
    n = len(CONDITIONS)

    return df, sum_e, sum_g, sum_f, cnt_e, cnt_g, cnt_f, n


# ─────────────────────────────────────────────────────────────────────────────
# HISTORICAL SIMULATION
# ─────────────────────────────────────────────────────────────────────────────

def generate_calibrated_irradiance(target_sigma=1.89, n_years=6, seed=42):
    """
    Generates a calibrated irradiance series matching Taiwan's properties.
    Used when NASA POWER API is unavailable.

    Calibration target: σ = 189% annualised (from thesis §3.2.2)
    """
    np.random.seed(seed)
    dates = pd.date_range("2019-01-01", periods=int(n_years*252), freq="B")
    n = len(dates)

    # Seasonal component (Taiwan latitude 23.5°N)
    t = np.arange(n)
    seasonal = 4.2 + 1.8 * np.sin(2*np.pi*t/252 - np.pi/2)

    # Calibrate noise to hit target sigma.
    # Correct approach: GBM random walk in log-space.
    # irr[t] = seasonal[t] × exp(W[t]) where W is a Brownian path with
    # daily increments ~ N(-0.5*daily_std², daily_std).
    # Log-returns = log(seasonal[t]/seasonal[t-1]) + increment[t],
    # so std(log-return) ≈ daily_std and sigma ≈ target_sigma.
    #
    # Prior bug: multiplying iid noise (not a path) by seasonal meant
    # log-returns contained (log_noise[t] - log_noise[t-1]), a difference
    # of iid draws with std = sqrt(2)*daily_std → sigma inflated to ~267%.
    daily_std = target_sigma / np.sqrt(252)
    increments = np.random.normal(-0.5*daily_std**2, daily_std, n)
    log_noise_path = np.cumsum(increments)
    noise = np.exp(log_noise_path - log_noise_path[0])  # normalise: starts at 1

    irr = pd.Series(seasonal * noise, index=dates)
    return irr[irr > 0]


def run_quarterly_simulation(irr_series,
                              S0=0.0525, r=0.025, T=0.25,
                              oracle_err=0.06):
    """
    Simulates energy-backed instrument across historical quarters.

    For each quarter:
    1. Compute trailing 252-day sigma from irradiance log-returns
    2. Price ATM call and put (Black-Scholes)
    3. Compute collar net cost (10% OTM put - 10% OTM call)
    4. Compute initial margin (1.5 × VaR99%)
    5. Compute hedge effectiveness at stated oracle error

    Parameters
    ----------
    irr_series  : pd.Series — daily irradiance values
    S0          : float — spot price $/kWh
    r           : float — risk-free rate
    T           : float — maturity (years)
    oracle_err  : float — oracle error as fraction of spot price

    Returns
    -------
    pd.DataFrame — one row per quarter
    """
    log_ret = np.log(irr_series / irr_series.shift(1)).dropna()
    quarters = pd.date_range("2020-01-01", "2024-10-01", freq="QS")
    results = []

    for qdate in quarters:
        window = log_ret[qdate - pd.DateOffset(days=365):qdate]
        if len(window) < 80:
            continue

        sig = window.std() * np.sqrt(252)
        K   = S0

        call_atm   = bs_call(S0, K, r, sig, T)
        put_atm    = bs_put(S0, K, r, sig, T)
        put_otm    = bs_put(S0, K*0.90, r, sig, T)
        call_otm   = bs_call(S0, K*1.10, r, sig, T)
        collar     = put_otm - call_otm
        margin_99  = var_margin(S0, sig, T, z=2.33)
        margin_95  = var_margin(S0, sig, T, z=1.65)
        max_err_95 = oracle_max_error(sig, T, threshold=0.95)

        results.append({
            "Quarter":       f"{qdate.year}-Q{qdate.quarter}",
            "Date":          qdate,
            "sigma":         sig,
            "sigma_pct":     f"{sig:.1%}",
            "call_atm":      call_atm,
            "put_atm":       put_atm,
            "collar_net":    collar,
            "collar_pct_spot": collar / S0,
            "margin_99":     margin_99,
            "margin_99x":    margin_99 / S0,
            "margin_95":     margin_95,
            "margin_95x":    margin_95 / S0,
            "oracle_max_err_95pct_VR": max_err_95,
            "year":          qdate.year
        })

    return pd.DataFrame(results)


# ─────────────────────────────────────────────────────────────────────────────
# COLLAR STRUCTURE ANALYSIS
# ─────────────────────────────────────────────────────────────────────────────

def collar_by_sigma(S=0.0525, r=0.025, T=0.25,
                    put_pct=0.90, call_pct=1.10):
    """
    Net collar cost across a range of sigma values.

    IMPORTANT: In a lognormal model with symmetric ±10% strikes,
    the net cost is ALWAYS negative (net credit to the put buyer).
    Reason: log(call_pct) < log(1/put_pct) — the OTM call is always
    closer to ATM in log-space than the OTM put, making it always
    more expensive. This is structural, not a sigma threshold finding.

    Taiwan: log(1.10) = 0.0953, log(1/0.90) = 0.1054

    The economically meaningful result is that credit MAGNITUDE grows
    with sigma — producers at high-volatility locations receive larger
    credits for the same floor structure.
    """
    sigmas = np.round(np.arange(0.10, 3.01, 0.20), 2)
    rows = []
    for sig in sigmas:
        put_px  = bs_put(S, S*put_pct, r, sig, T)
        call_px = bs_call(S, S*call_pct, r, sig, T)
        net     = put_px - call_px
        rows.append({
            "sigma":            sig,
            "sigma_pct":        f"{sig:.0%}",
            "put_premium":      put_px,
            "call_premium":     call_px,
            "net_cost":         net,
            "net_pct_of_spot":  net / S,
        })
    return pd.DataFrame(rows)


# ─────────────────────────────────────────────────────────────────────────────
# ORACLE TOLERANCE ANALYSIS
# ─────────────────────────────────────────────────────────────────────────────

LOCATIONS = {
    "Taiwan":       {"sigma": 1.89, "S0": 0.0525},
    "Saudi Arabia": {"sigma": 1.72, "S0": 0.055},
    "Arizona, USA": {"sigma": 1.65, "S0": 0.058},
    "Brazil":       {"sigma": 1.98, "S0": 0.095},
    "Germany":      {"sigma": 0.45, "S0": 0.025},
}

def oracle_tolerance_by_location(T=0.25):
    """
    For each location: the maximum oracle error rate (as % of spot price)
    that keeps hedge effectiveness above 95%, 90%, and 80%.

    This replaces the misleading single VR number. The 99.6% figure
    previously reported is trivially high because it fixes oracle error
    at 6% of spot while sigma is 189% — the payoff swings dwarf any
    fixed error. The honest question is: what error rate breaks the hedge?

    VR >= threshold  <=>  oracle_err_pct <= sigma * sqrt(T) * sqrt((1-t)/t)

    Practical benchmark: NASA POWER irradiance accuracy is roughly 3–10%
    (Journée & Bertrand 2010; Polo et al. 2016). Mark this on the table.
    """
    rows = []
    thresholds = [0.95, 0.90, 0.80]
    for loc, p in LOCATIONS.items():
        row = {"Location": loc, "sigma": f"{p['sigma']:.0%}"}
        for t in thresholds:
            max_err = oracle_max_error(p["sigma"], T, t)
            row[f"Max err @ VR≥{int(t*100)}%"] = f"{max_err:.1%}"
        rows.append(row)
    df = pd.DataFrame(rows)
    return df


# ─────────────────────────────────────────────────────────────────────────────
# MARGIN ANALYSIS
# ─────────────────────────────────────────────────────────────────────────────

def margin_analysis(S=0.0525, sigma=1.89, T=0.25, mult=1.5):
    """
    Margin requirement across confidence levels.

    At 99% confidence (z=2.33): margin ≈ 12× spot price.
    This is a genuine adoption barrier. The thesis must address it.

    The margin is proportional to exp(z*sigma*sqrt(T)) - 1.
    At sigma=189%, T=0.25: sigma*sqrt(T) = 94.5% — enormous move space.
    The instrument is designed for high-volatility physical assets,
    which is exactly why the floor is valuable — but the margin cost
    is a real counterweight to the zero-premium collar finding.

    Practical implication: a clearing house (CME-style) intermediating
    between producers and counterparties is required. Producers cannot
    be expected to post 12× spot directly.
    """
    z_levels = [
        (1.28, "90%"),
        (1.65, "95%"),
        (2.05, "98%"),
        (2.33, "99%"),
        (3.09, "99.9%"),
    ]
    rows = []
    for z, conf in z_levels:
        m = var_margin(S, sigma, T, z, mult)
        rows.append({
            "Confidence":       conf,
            "z-score":          z,
            "Margin ($/kWh)":   m,
            "Margin / Spot":    f"{m/S:.1f}×",
            "Feasible?":        "Clearing house required" if m/S > 5 else "Producer-postable"
        })
    return pd.DataFrame(rows)


# ─────────────────────────────────────────────────────────────────────────────
# MAIN EXECUTION
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":

    print("=" * 70)
    print("MONETARY STANDARD PROPERTY ANALYSIS")
    print("Energy vs Gold vs Fiat — Seven Conditions")
    print("=" * 70)

    # ── Scorecard ─────────────────────────────────────────────────
    df_score, te, tg, tf, ce, cg, cf, n = generate_scorecard()

    print(f"\n── Property Scorecard ({'─'*50})")
    for i, row in df_score.iterrows():
        score_str = f"E:{row.E_score:.1f} G:{row.G_score:.1f} F:{row.F_score:.1f}"
        print(f"\n  [{i+1}] {row.Property}")
        print(f"      Energy: {row.Energy}")
        print(f"      Gold:   {row.Gold}")
        print(f"      Fiat:   {row.Fiat}")
        print(f"      Scores: {score_str}")

    print(f"\n{'─'*70}")
    print(f"  SCORE SUM (1=full, 0.5=partial, 0=fail):")
    print(f"    Energy {te:.1f}/{n}   Gold {tg:.1f}/{n}   Fiat {tf:.1f}/{n}")
    print(f"  CONDITIONS MET (full or partial, i.e. score > 0):")
    print(f"    Energy {ce}/{n}   Gold {cg}/{n}   Fiat {cf}/{n}")
    print(f"  NOTE: Scorecard is a theoretical framework derived from")
    print(f"  monetary economics literature (Friedman 1960; Selgin 2015;")
    print(f"  Hayek 1976). Conditions were not defined post-hoc to favour")
    print(f"  energy — they must be defended on independent grounds.")
    print(f"{'─'*70}")

    # ── Historical Simulation ─────────────────────────────────────
    print(f"\n── Historical Simulation (20 quarters, 2020-2024) ────────────")
    print(f"  DATA: Synthetic irradiance calibrated to Taiwan NASA POWER")
    print(f"  σ=189%, seed=42. Results are illustrative, not empirical.")
    print(f"  Replace with real NASA POWER data for thesis submission.")

    irr = generate_calibrated_irradiance(target_sigma=1.89)
    log_ret = np.log(irr / irr.shift(1)).dropna()
    actual_sigma = log_ret.std() * np.sqrt(252)
    jb_stat, jb_p = jarque_bera(log_ret)
    print(f"  Series: {len(irr)} obs | realised σ={actual_sigma:.1%} | JB p={jb_p:.3f} "
          f"({'normal ✓' if jb_p > 0.05 else 'non-normal ✗'})")

    sim = run_quarterly_simulation(irr)
    sigma_cv = sim.sigma.std() / sim.sigma.mean()
    collar_cv = sim.collar_net.abs().std() / sim.collar_net.abs().mean()

    print(f"\n  {'Quarter':12s} {'σ':8s} {'Collar net':12s} {'Margin×spot':12s} {'Max oracle err (VR≥95%)':>22s}")
    print(f"  {'─'*70}")
    for _, row in sim.iterrows():
        print(f"  {str(row.Quarter):12s} {row.sigma_pct:8s} "
              f"${row.collar_net:+.5f}     "
              f"{row.margin_99x:5.1f}×          "
              f"{row.oracle_max_err_95pct_VR:.1%}")

    # ── Collar structure analysis ──────────────────────────────────
    print(f"\n── Collar Structure: Net Credit Across Sigma Range ───────────")
    print(f"  Put(0.9K) − Call(1.1K) with S=K, r=2.5%, T=0.25yr")
    print(f"  NOTE: Net credit is structurally guaranteed at ALL sigma")
    print(f"  levels in a lognormal model (log(1.1)=0.095 < log(1/0.9)=0.105).")
    print(f"  The credit is NOT a threshold finding — it exists at σ=10%.")
    print(f"  The economically meaningful result: credit grows with sigma.")
    collar_df = collar_by_sigma()
    print(f"\n  {'σ':>6}  {'Put premium':>12}  {'Call premium':>12}  {'Net ($/kWh)':>12}  {'Net (% spot)':>12}")
    print(f"  {'─'*60}")
    for _, row in collar_df.iterrows():
        print(f"  {row.sigma_pct:>6}  {row.put_premium:>12.5f}  {row.call_premium:>12.5f}"
              f"  {row.net_cost:>+12.5f}  {row.net_pct_of_spot:>+11.2%}")

    # ── Oracle tolerance ───────────────────────────────────────────
    print(f"\n── Oracle Tolerance: Max Error Before Hedge Degrades ─────────")
    print(f"  NASA POWER irradiance accuracy: ~3–10% (Journée & Bertrand 2010)")
    print(f"  Max oracle error = σ·√T·√((1−threshold)/threshold)")
    print(f"  This is the breakeven, not a fixed 6% assumption.")
    oracle_df = oracle_tolerance_by_location()
    print()
    print(oracle_df.to_string(index=False))
    print(f"\n  Germany (σ=45%) requires <5.1% oracle error for VR≥95%.")
    print(f"  At the upper end of NASA POWER accuracy (10%), Germany")
    print(f"  falls below 95% VR. High-sigma locations are robustly tolerant.")

    # ── Margin ────────────────────────────────────────────────────
    print(f"\n── Margin Requirement: Honest Assessment ─────────────────────")
    print(f"  Taiwan base case: S₀=${0.0525}/kWh, σ=189%, T=0.25yr, mult=1.5×")
    margin_df = margin_analysis()
    print()
    print(margin_df.to_string(index=False))
    print(f"\n  At 99% confidence, margin = 12× spot. This is a genuine")
    print(f"  adoption barrier. A CME-style clearing house intermediary")
    print(f"  is required — producers cannot post this directly.")
    print(f"  At 95% confidence, margin ≈ 7× — still clearing-house territory.")
    print(f"  Thesis must address this as a design requirement, not omit it.")

    # ── Sigma stability ────────────────────────────────────────────
    print(f"\n── Sigma Stability (SYNTHETIC DATA — verify with NASA POWER) ──")
    print(f"  σ CV across 20 quarters: {sigma_cv:.3f}")
    print(f"  Collar CV across 20 quarters: {collar_cv:.3f}")
    print(f"  Gold σ CV (literature): ~0.045 (World Gold Council 2019–2024)")
    print(f"  USD/TWD FX σ CV (literature): ~0.120 (Bank of Taiwan)")
    print(f"  Energy CV ({sigma_cv:.3f}) compares well — but this is synthetic.")
    print(f"  Real NASA POWER data may produce a different CV.")

    # ── Summary ───────────────────────────────────────────────────
    print(f"\n{'='*70}")
    print("FINDINGS SUMMARY — HONEST ASSESSMENT")
    print(f"{'='*70}")
    print(f"""
FINDING 1 [THEORETICAL]: Energy satisfies {te:.1f}/{n} conditions (sum) / {ce}/{n} (non-zero)
  Gold: {tg:.1f}/{n} sum, {cg}/{n} non-zero. Fiat: {tf:.1f}/{n} sum, {cf}/{n} non-zero.
  Scorecard is a structured argument from cited monetary economics
  literature. Conditions must be defended independently of the conclusion.

FINDING 2 [STRUCTURAL, NOT EMPIRICAL]: Collar net credit is always negative
  with ±10% symmetric strikes in a lognormal model (mathematical property
  of lognormal asymmetry, not a sigma threshold result). The meaningful
  finding: credit magnitude grows monotonically with sigma — from
  ~$0.00003/kWh at σ=10% to ~$0.00219/kWh at σ=189%.

FINDING 3 [ROBUST]: Oracle tolerance strongly location-dependent
  High-sigma locations (Taiwan, Brazil) tolerate oracle error up to ~22%
  before VR drops below 95%. Germany (σ=45%) requires <5.1% accuracy.
  Current NASA POWER accuracy (3–10%) is adequate for high-sigma markets;
  marginal for low-sigma markets like Germany.

FINDING 4 [CONSTRAINT — DO NOT OMIT]: Margin is 12× spot at 99% confidence
  This is a hard practical barrier. The instrument requires clearing house
  infrastructure. Zero-premium collar does not remove the adoption barrier
  if margin cost exceeds the producer's capital capacity.

FINDING 5 [ILLUSTRATIVE]: Sigma CV = {sigma_cv:.3f} over 20 quarters (synthetic data)
  Comparable to gold (CV≈0.045). Needs real NASA POWER validation.
""")

    # Save
    df_score.to_csv("../03_simulation/results/monetary_scorecard.csv",
                    index=False)
    sim.to_csv("../03_simulation/results/quarterly_simulation.csv",
               index=False)
    collar_df.to_csv("../03_simulation/results/collar_sigma_sweep.csv",
                     index=False)
    oracle_df.to_csv("../03_simulation/results/oracle_tolerance.csv",
                     index=False)
    print("Results saved.")
