#!/usr/bin/env python3
"""
Generate standard empirical tables for Chapters 3–4 (data, descriptives, calibration).

Outputs:
  empirical_results/tables/*.csv
  THESIS_CH3_TABLES.md
  THESIS_CH4_TABLES.md

Run: python thesis_package/generate_thesis_tables.py
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
import pandas as pd

PKG = Path(__file__).resolve().parent
if str(PKG) not in sys.path:
    sys.path.insert(0, str(PKG))

from ceir_regression import CHINA_BAN, load_panel  # noqa: E402
from options_pricing import LOCATIONS, T  # noqa: E402

RESULTS = PKG / "empirical_results"
TABLES = RESULTS / "tables"
CH3_MD = PKG / "THESIS_CH3_TABLES.md"
CH4_MD = PKG / "THESIS_CH4_TABLES.md"


def _md_table(df: pd.DataFrame, *, float_fmt: str = ".4f") -> str:
    headers = list(df.columns)
    lines = [
        "| " + " | ".join(str(h) for h in headers) + " |",
        "| " + " | ".join("---" for _ in headers) + " |",
    ]
    for _, row in df.iterrows():
        cells = []
        for val in row:
            if isinstance(val, (float, np.floating)):
                if np.isnan(val):
                    cells.append("—")
                elif abs(val) >= 1000:
                    cells.append(f"{val:,.0f}")
                elif abs(val) < 0.01 and val != 0:
                    cells.append(f"{val:.2e}")
                else:
                    cells.append(format(val, float_fmt))
            else:
                cells.append(str(val))
        lines.append("| " + " | ".join(cells) + " |")
    return "\n".join(lines)


def _desc_block(sub: pd.DataFrame, variables: list[tuple[str, str]]) -> pd.DataFrame:
    rows = []
    for col, label in variables:
        s = sub[col].astype(float)
        rows.append(
            {
                "Variable": label,
                "N": int(s.notna().sum()),
                "Mean": s.mean(),
                "Std": s.std(),
                "Min": s.min(),
                "P25": s.quantile(0.25),
                "Median": s.median(),
                "P75": s.quantile(0.75),
                "Max": s.max(),
            }
        )
    return pd.DataFrame(rows)


def regression_sample(df: pd.DataFrame) -> pd.DataFrame:
    cols = ["ret_30d", "log_ceir_w", "trend", "fg", "vol30"]
    return df.dropna(subset=cols).copy()


def generate_ch3_tables() -> str:
    panel_path = RESULTS / "bitcoin_ceir_analysis_ready.csv"
    raw = pd.read_csv(panel_path, parse_dates=["Date"])
    raw = raw[raw.get("in_analysis_period", 1) == 1].copy()
    df = load_panel(refresh_forward=False)
    reg = regression_sample(df)

    pre_raw = raw[raw["Date"] < CHINA_BAN]
    post_raw = raw[raw["Date"] >= CHINA_BAN]
    pre_reg = reg[reg["Date"] < CHINA_BAN]
    post_reg = reg[reg["Date"] >= CHINA_BAN]

    data_sources = pd.DataFrame(
        [
            {
                "Series": "Bitcoin price & market cap",
                "Source": "CoinGecko / parsed daily panel (`btc_ds_parsed.csv`)",
                "Frequency": "Daily",
                "Role": "Outcome and CEIR numerator",
            },
            {
                "Series": "Mining electricity (TWh, annualised)",
                "Source": "Cambridge Bitcoin Electricity Consumption Index (CBECI)",
                "Frequency": "Daily (interpolated annual rate)",
                "Role": "Cumulative energy-cost base",
            },
            {
                "Series": "Weighted electricity price",
                "Source": "Cambridge mining-map weighted prices (`weighted_electricity_prices_monthly.csv`)",
                "Frequency": "Monthly → daily",
                "Role": "USD cost per kWh for cumulative cost",
            },
            {
                "Series": "Mining geography / ban split",
                "Source": "Cambridge mining map; China ban date 2021-06-20",
                "Frequency": "Event split",
                "Role": "Regime indicator (`post_china_ban`)",
            },
            {
                "Series": "Fear & Greed Index",
                "Source": "Alternative.me crypto sentiment index",
                "Frequency": "Daily",
                "Role": "Control (standardised in regression)",
            },
        ]
    )

    sample_summary = pd.DataFrame(
        [
            {
                "Sample": "Full analysis panel",
                "Start": raw["Date"].min().strftime("%Y-%m-%d"),
                "End": raw["Date"].max().strftime("%Y-%m-%d"),
                "N (days)": len(raw),
                "Pre-ban": int((raw["Date"] < CHINA_BAN).sum()),
                "Post-ban": int((raw["Date"] >= CHINA_BAN).sum()),
            },
            {
                "Sample": "Regression sample (controls complete)",
                "Start": reg["Date"].min().strftime("%Y-%m-%d"),
                "End": reg["Date"].max().strftime("%Y-%m-%d"),
                "N (days)": len(reg),
                "Pre-ban": len(pre_reg),
                "Post-ban": len(post_reg),
            },
        ]
    )

    variables = [
        ("Price", "Bitcoin price (USD)"),
        ("Market_Cap", "Market capitalisation (USD)"),
        ("CEIR", "CEIR = MarketCap / CumulativeEnergyCost"),
        ("log_CEIR", "log(CEIR)"),
        ("Returns", "Daily return"),
        ("ret_30d", "30-day forward return"),
        ("fear_greed_index", "Fear & Greed Index (0–100)"),
        ("vol30", "30-day return volatility"),
    ]

    reg["ret_30d"] = reg["ret_30d"].astype(float)
    desc_all = _desc_block(reg, variables)
    desc_pre = _desc_block(pre_reg, variables)
    desc_post = _desc_block(post_reg, variables)

    desc_compare = pd.DataFrame(
        {
            "Variable": desc_all["Variable"],
            "Mean (full)": desc_all["Mean"],
            "Mean (pre-ban)": desc_pre.set_index("Variable").reindex(desc_all["Variable"])["Mean"].values,
            "Mean (post-ban)": desc_post.set_index("Variable").reindex(desc_all["Variable"])["Mean"].values,
            "Std (full)": desc_all["Std"],
        }
    )

    corr_cols = {
        "log_CEIR": "log(CEIR)",
        "ret_30d": "30d forward return",
        "Returns": "Daily return",
        "vol30": "30d volatility",
        "fear_greed_index": "Fear & Greed",
    }
    corr = reg[list(corr_cols.keys())].astype(float).corr()
    corr.index = [corr_cols[c] for c in corr.index]
    corr.columns = [corr_cols[c] for c in corr.columns]

    var_defs = pd.DataFrame(
        [
            {
                "Symbol": "CEIR_t",
                "Definition": "MarketCap_t / CumulativeEnergyCost_t",
                "Units": "Ratio (×)",
            },
            {
                "Symbol": "log(CEIR_t)",
                "Definition": "Natural log of CEIR; 1% winsorized in preferred regression (`log_ceir_w`)",
                "Units": "log points",
            },
            {
                "Symbol": "R_{t,t+30}",
                "Definition": "Price_{t+30}/Price_t − 1",
                "Units": "Proportion",
            },
            {
                "Symbol": "vol30",
                "Definition": "Rolling 30-day std of daily returns",
                "Units": "Proportion",
            },
            {
                "Symbol": "fg",
                "Definition": "Standardised Fear & Greed Index",
                "Units": "z-score",
            },
            {
                "Symbol": "trend",
                "Definition": "Linear time index (0 … T)",
                "Units": "Days",
            },
            {
                "Symbol": "post_china_ban",
                "Definition": "1 if Date ≥ 2021-06-20",
                "Units": "Indicator",
            },
        ]
    )

    TABLES.mkdir(parents=True, exist_ok=True)
    data_sources.to_csv(TABLES / "ceir_data_sources.csv", index=False)
    sample_summary.to_csv(TABLES / "ceir_sample_summary.csv", index=False)
    var_defs.to_csv(TABLES / "ceir_variable_definitions.csv", index=False)
    desc_compare.to_csv(TABLES / "ceir_descriptive_statistics.csv", index=False)
    corr.to_csv(TABLES / "ceir_correlation_matrix.csv")

    corr_md = _md_table(corr.reset_index().rename(columns={"index": "Variable"}), float_fmt=".3f")

    md = f"""### 3.3.1 Data sources and sample

Table 3.2 lists the main data series used in Chapter 3. Table 3.3 summarises the sample period and observation counts. The regression sample is smaller than the full panel because 30-day forward returns, rolling volatility, and winsorized regressors require non-missing controls.

**Table 3.2. Data sources (Chapter 3 empirical panel)**

{_md_table(data_sources)}

*Sources: Cambridge Centre for Alternative Finance (CBECI, mining map); panel assembled in `bitcoin_ceir_analysis_ready.csv`. Reproduce: `python thesis_package/ceir_regression.py --refresh-panel`.*

**Table 3.3. Sample period and observation counts**

{_md_table(sample_summary, float_fmt=".0f")}

*Structural split: China mining-ban date = {CHINA_BAN.date()}.*

**Table 3.4. Variable definitions**

{_md_table(var_defs)}

**Table 3.5. Descriptive statistics (regression sample)**

{_md_table(desc_compare)}

*Means and standard deviations on the regression-ready sample (N = {len(reg)}: pre-ban {len(pre_reg)}, post-ban {len(post_reg)}). Full distributional detail in `empirical_results/tables/ceir_descriptive_statistics.csv`.*

**Table 3.6. Correlation matrix (regression sample)**

{corr_md}

*Pearson correlations on the same regression sample. Overlapping 30-day returns induce serial correlation; inference uses HAC(30) in Table 3.7.*
"""
    CH3_MD.write_text(md.strip() + "\n", encoding="utf-8")
    return md


def generate_ch4_tables() -> str:
    cal = pd.read_csv(RESULTS / "calibration_diagnostics_real.csv")
    taiwan_cal = cal[cal["Method"] == "thesis_reconstructed"].iloc[0]

    loc_rows = []
    for name, p in LOCATIONS.items():
        loc_rows.append(
            {
                "Location": name,
                "Latitude": p["lat"],
                "Longitude": p["lon"],
                "S₀ ($/kWh)": p["S0"],
                "σ (annual, %)": f"{p['sigma'] * 100:.0f}%",
                "Risk-free r": f"{p['r'] * 100:.1f}%",
                "σ source": "NASA POWER daily irradiance log returns, 2019–2024; 4-day rolling mean + 1% tail trim (Taiwan method)",
            }
        )
    locations = pd.DataFrame(loc_rows)

    convergence = pd.read_csv(RESULTS / "binomial_convergence_table.csv")
    margin = pd.read_csv(RESULTS / "margin_stress_table.csv")
    margin_display = margin[
        margin["S0"].isin([0.042, 0.0525, 0.063]) & margin["sigma"].isin([1.42, 1.89, 2.36])
    ].copy()
    margin_display["S0"] = margin_display["S0"].map(lambda x: f"${x:.4f}")
    margin_display["sigma"] = margin_display["sigma"].map(lambda x: f"{x * 100:.0f}%")
    margin_display["VaR99_spot"] = margin_display["VaR99_spot"].map(lambda x: f"${x:.4f}")
    margin_display["Initial_margin_1.5x"] = margin_display["Initial_margin_1.5x"].map(
        lambda x: f"${x:.4f}"
    )
    margin_display.columns = ["S₀", "σ", "VaR₉₉", "Initial margin (1.5×)"]

    TABLES.mkdir(parents=True, exist_ok=True)
    locations.to_csv(TABLES / "pricing_location_inputs.csv", index=False)
    convergence.to_csv(TABLES / "pricing_binomial_convergence.csv", index=False)
    margin_display.to_csv(TABLES / "pricing_margin_stress_display.csv", index=False)

    md = f"""### 4.3.1 Location inputs and volatility calibration

Table 4.4 records the cross-location inputs used in Chapter 4. Spot proxies `S₀` follow published LCOE or tariff proxies; volatilities are **cold-start** estimates from NASA POWER irradiance variability, not market-implied option vols. Taiwan σ = {taiwan_cal['Sigma %']} under the preferred `thesis_reconstructed` method (`calibration_diagnostics_real.csv`; Jarque–Bera p = {float(taiwan_cal['JB p-value']):.3f}).

**Table 4.4. Location parameters and volatility calibration inputs**

{_md_table(locations)}

*Horizon T = {T} years for all sites; ATM convention K = S₀ per location (Table 4.2). Script: `options_pricing.py`.*

**Table 4.5. Binomial tree convergence (Taiwan base case)**

{_md_table(convergence)}

*Preferred engine setting: N = 400 steps. Source: `binomial_convergence_table.csv`.*

**Table 4.6. Margin stress grid (selected S₀ and σ)**

{_md_table(margin_display)}

*Initial margin = 1.5 × VaR₉₉ of spot; Taiwan base case highlighted at S₀ = $0.0525/kWh, σ = 189%. Full grid: `margin_stress_table.csv`.*
"""
    CH4_MD.write_text(md.strip() + "\n", encoding="utf-8")
    return md


def main() -> int:
    generate_ch3_tables()
    generate_ch4_tables()
    print(f"wrote {CH3_MD.relative_to(PKG.parent)}")
    print(f"wrote {CH4_MD.relative_to(PKG.parent)}")
    print(f"wrote tables under {TABLES.relative_to(PKG.parent)}/")
    print("thesis_tables_ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
