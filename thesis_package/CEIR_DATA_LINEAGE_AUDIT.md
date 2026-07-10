# CEIR Data Lineage Audit

**Date:** 2026-07-10  
**Scope:** Construction of CEIR and the 2019–2025 regression panel.  
**Mode:** Read-only audit — no repairs.

---

## Executive verdict

The **canonical regression panel** is:

| Role | Path |
|------|------|
| Full daily CEIR series | `empirical/bitcoin_ceir_complete.csv` (= `thesis_package/empirical_results/bitcoin_ceir_complete.csv`) |
| Analysis / regression panel | `empirical/bitcoin_ceir_analysis_ready.csv` (= `thesis_package/empirical_results/bitcoin_ceir_analysis_ready.csv`) |
| Inference script | `thesis_package/ceir_regression.py` |

`analysis_ready` is `complete` filtered to `in_analysis_period == 1` (calendar **2019-01-01 → 2025-05-28**, N = 2,340). Regression further drops incomplete controls (N ≈ 2,280; pre/post split at **2021-06-20**).

**Critical finding:** In the canonical panel, `electricity_price` is **not** a properly forward-filled geography-weighted series. It equals a near-constant **0.076234375 $/kWh** on **2,674 / 2,703** days. The only non-default values are **29 one-day spikes** on month-starts **2019-09-01 … 2022-01-01**. That pattern is a failed monthly→daily merge (values written on join keys only, never `ffill`’d). Thesis tables that cite `weighted_electricity_prices_monthly.csv` as the USD/kWh source for the panel are **not** describing what is actually stored in `electricity_price`.

A **separate, better-behaved** CEIR build exists at `empirical/ETH-grant/bitcoin_ceir_full.csv` (proper ~monthly blocks through 2021, then annual constants). It is **not** what `ceir_regression.py` reads.

---

## Pipeline map (raw → panel → regression)

```text
Cambridge mining map (manual transcription)
  └─ empirical/cambridge.py
       ├─ empirical/cambridge_mining_distribution.csv   [Sep 2019–Jan 2022]
       ├─ electricity_prices_by_country.csv             [MISSING on disk; values hardcoded in cambridge.py]
       └─ empirical/weighted_electricity_prices_monthly.csv  [29 months; NOT used by analysis panel]

Missing: electricity_prices_detailed_by_year.csv
  └─ intended by empirical/CEIR.py / check-cost.py / dataset/proj_1133958_app3.py
       └─ per-day weighted $/kWh via closest mining month + year(/pre-post-ban) prices

Cambridge CBECI
  └─ empirical/Historical annualised electricity consumption.csv
       └─ column: annualised consumption GUESS, TWh  →  Energy_TWh_Annual
          (exact match to panel; 2010-07-18 → 2025-05-28)

Bitcoin prices / market cap
  └─ empirical/btc_ds_parsed.csv (+ supply approximation in CEIR.py)
       └─ Price, Market_Cap on panel

Fear & Greed
  └─ empirical/fear_greed_index.csv → fear_greed_index

Assembled (script that wrote the CSV is not in-repo as a single reproducible entrypoint)
  ├─ empirical/bitcoin_ceir_complete.csv          [2018-01-01 → 2025-05-28]
  └─ … filter in_analysis_period=1 …
       └─ bitcoin_ceir_analysis_ready.csv         [2019-01-01 → 2025-05-28]

thesis_package/ceir_regression.py
  └─ recomputes ret_30d from Price; winsorizes log_CEIR; HAC/cluster; China-ban split
       └─ ceir_analysis_summary*.csv, trading JSON, appendix
```

**No single checked-in script regenerates `bitcoin_ceir_complete.csv` from raw inputs.** Closest construction recipes: `empirical/CEIR.py`, `empirical/datagath.py`, `empirical/fusion_ceir.py`, `empirical/cambridge.py`. Canonical inference only **consumes** the panel (`ceir_regression.py --refresh-panel` only rewrites `Returns_forward`).

---

## Answers to the nine audit questions

### 1. What source file supplies mining geography for each period?

| Period | Geography source | Notes |
|--------|------------------|-------|
| **2019-09 → 2022-01** | `empirical/cambridge_mining_distribution.csv` | 29 monthly rows; built by `empirical/cambridge.py` from manually structured Cambridge Mining Map shares (comment in script: “handwritten data”). Duplicate: `empirical/ETH-grant/cambridge_mining_distribution.csv`. |
| **Before 2019-09** | No geography rows in that CSV | Intended scripts: use **first** Cambridge month (`CEIR.py` / `fusion_ceir.py` / `datagath.py`). Canonical panel has **no country-share columns at all**. |
| **After 2022-01** | No new Cambridge geography | Intended: **hold last month** (`CEIR.py` `iloc[-1]`) or ad-hoc fills (`datagath.py` US×1.15; `fusion_ceir.py` ffill; research notes warn against HHI proxies). Canonical panel again has **no geography columns**. |

Country columns (decimals summing to 1 with `others`):  
`canada, usa, russia, kazakhstan, iran, china, malaysia, others`.

`others` construction in `cambridge.py`:

```text
others = 1 − (china + usa + russia + kazakhstan + canada + malaysia + iran)
```

Sparse early months leave many named countries at 0; residual mass goes to `others`.

---

### 2. The visible manually structured Cambridge series ends around January 2022. What happens after that date?

**Geography:** Cambridge series ends **2022-01-01**. No later official map is in the repo. Docs (`DATA_EXTENSION_REALITY_CHECK.md`, `CAMBRIDGE_DATA_COMPLETE_ANALYSIS.md`) state CCAF public mining-map updates stopped ~Jan 2022.

**In the canonical CEIR panel after 2022-01-01:**

- `electricity_price` = **0.076234375** every day (including all of 2022–2025 except the single spike on **2022-01-01** = 0.079968).
- That is **not** forward-fill of the Jan 2022 weighted price; it is reversion to the panel default.
- Energy (TWh) and price/market-cap continue through **2025-05-28** from CBECI + price series.
- Cumulative USD cost keeps accruing under the constant default $/kWh.

**In the alternate ETH-grant build** (`bitcoin_ceir_full.csv`), post-Cambridge prices are **annual constants**: 2022 → 0.082327; 2023 → 0.080747; 2024 → 0.078868; 2025 → **0.060000** (flat). That file is orphaned relative to thesis regression.

---

### 3. Are geography weights frozen, forward-filled, extrapolated, or replaced?

| Artifact | Behavior |
|----------|----------|
| `cambridge_mining_distribution.csv` | Observed months only; no post-2022 rows. |
| `weighted_electricity_prices_monthly.csv` | 29 months only; no extension. |
| **Intended** (`CEIR.py`) | Closest-month match inside sample; **first month** before Sep 2019; **last month frozen** after Jan 2022. |
| **Intended** (`datagath.py` / `fusion_ceir.py`) | Daily calendar + **`ffill`**; pre-sample backfill from first valid; `datagath` also **replaces** post-2022 with `us_price × 1.15` (= 0.0782). |
| **Canonical panel `electricity_price`** | Effectively **replaced by a constant default** (0.076234375), with **29 unfilled month-start overrides**. Neither freeze-of-last-weight nor proper ffill. |
| HHI / country shares on regression panel | **Absent** — regression does not use geography as a regressor; only `post_china_ban` / date split. |

---

### 4. Where do country electricity-price assumptions come from?

Multiple **inconsistent** assumption sets exist; the file the main builder expects is **missing**.

| Source | Path / location | Content |
|--------|-----------------|--------|
| **Missing primary** | `electricity_prices_detailed_by_year.csv` | Referenced by `CEIR.py`, `check-cost.py`, `simple_CEIR.py`, `dataset/proj_1133958_app3.py`. Expected columns: `Country`, year columns, `2021_pre_ban`, `2021_post_ban` (and often `Average_2018_2024`). **Not in the repository.** |
| `cambridge.py` constants | Written to missing `electricity_prices_by_country.csv` | china 0.040, usa 0.065, russia 0.050, kazakhstan 0.045, canada 0.070, malaysia 0.055, iran 0.035, others 0.060 — used to build `weighted_electricity_prices_monthly.csv`. |
| `datagath.py` | Hardcoded “EIA / Eurostat / national stats” | china 0.080, us 0.068, kazakhstan 0.038, russia 0.044, canada 0.061, malaysia 0.077, iran 0.007, others 0.065 + annual factors 2019–2024. |
| `fusion_ceir.py` | Hardcoded “research document” | china 0.088, usa 0.147, russia 0.090, kazakhstan 0.074, canada 0.107, malaysia 0.134, iran 0.040, others 0.120. |
| Month-start spikes on canonical panel | Recoverable via least squares on Cambridge weights | Consistent with a **year-varying / pre–post-ban** country table (like the missing detailed file), **not** identical to `weighted_electricity_prices_monthly.csv` (panel spikes ≈ 1.11× those monthly weights on average). |
| Panel default 0.076234375 | Unknown exact provenance | Near `datagath` China-dominated fill `0.080×0.95=0.076` and cleaned-panel `weighted_elec_price=0.076`, but the extra `0.000234375` is unexplained; **not** present in ETH-grant full. |

Thesis table `empirical_results/tables/ceir_data_sources.csv` attributes weighted prices to `weighted_electricity_prices_monthly.csv`. That CSV’s levels (~0.044–0.056) do **not** match the panel default (~0.076) or the 29 spikes exactly.

---

### 5. Are electricity prices constant or time-varying?

**Intended design:** time-varying — geography weights × country-year (and 2021 pre/post-ban) prices; monthly then daily.

**Canonical panel reality:**

| Segment | Behavior |
|---------|----------|
| 2018-01-01 → 2025-05-28 (almost all days) | **Constant** 0.076234375 |
| 29 month-starts Sep 2019–Jan 2022 | One-day **time-varying** spikes (~0.043–0.080) |
| After 2022-01-02 | **Constant** default again |

So for cumulative cost and CEIR used in regression, the denominator is driven by an essentially **constant** $/kWh, with negligible one-day blips.

**ETH-grant full:** genuinely time-varying through 2021 (≈30-day blocks), then **constant within each calendar year** 2022–2025.

**`bitcoin_analysis_cleaned.csv`:** older multi-method workspace; `weighted_elec_price` has proper monthly blocks then long runs at 0.076 / 0.0782 — closer to `datagath.py`, **not** the thesis panel.

---

### 6. How are missing countries and “others” handled?

In `cambridge.py` / distribution CSV:

- Unlisted countries in a month → 0.
- Residual share → **`others`** so shares sum to 1.

In `CEIR.py` weighted-price function:

- Loop **skips** column `others`.
- Sums `weight × country_year_price` for named countries with weight > 0.
- If `total_weight < 0.99`, residual `(1 − total_weight)` priced at the **simple average of available country prices for that year column**, else fallback **0.06**.

In `datagath.py`:

- Missing country keys use `elec_prices['others']`.
- If total weight < 1, residual also gets `others` price.

Canonical regression panel stores **no** country or `others` columns — only the (broken) scalar `electricity_price`.

---

### 7. How is annualised TWh converted into daily and cumulative USD cost?

Verified identities on `bitcoin_ceir_complete.csv` / `analysis_ready`:

```text
daily_energy_kwh  = Energy_TWh_Annual × 1e9 / 365
daily_cost_usd    = daily_energy_kwh × electricity_price
cumulative_cost   = cumsum(daily_cost_usd)   # from 2018-01-01 in complete
CEIR              = Market_Cap / cumulative_cost
log_CEIR          = ln(CEIR)
CEIR_stable       = CEIR   # identical in panel
```

Same TWh→kWh→USD formulas in `CEIR.py` and ETH-grant full (`daily_energy_kwh` column present there).

**Cumulative seed:** `analysis_ready` starts 2019-01-01 with `cumulative_cost ≈ 3.30e9`, equal to the complete file’s value on that date — i.e. **2018 costs remain in the denominator** even though 2018 rows are dropped from the analysis sample (`in_analysis_period=0` for 2018).

### Cumulative-cost seed detail (audit pass 2)

Verified on `bitcoin_ceir_complete.csv`:

| Item | Value |
|------|------:|
| Complete start | 2018-01-01 |
| Day-1 `cumulative_cost` | equals that day’s `daily_cost_usd` (**no pre-2018 stock**) |
| Sum of 2018 daily costs | ≈ **$3.292bn** |
| Cumulative on 2019-01-01 | ≈ **$3.300bn** |
| 2018 electricity price used | **0.076234375** (panel constant) |

**Interpretation:** The ~$3.30bn figure is **not** an unexplained external seed. It is the **2018 CBECI×constant-tariff cumsum** carried into the 2019–2025 analysis window. Sensitivity: zeroing the 2018 stock (`seed_2018_zero`) shrinks the pre-ban CEIR coefficient toward insignificance (see `ceir_economic_constructions.csv`).

Machine-readable: `empirical_results/ceir_cumulative_seed_audit.json`.

**Market cap:** panel implied supply = `Market_Cap / Price` rises from ~17.0M to ~19.9M BTC (smooth approximation; `CEIR.py` uses an exponential supply curve from price history).

**Regression transform** (`ceir_regression.py`):

```text
ret_30d     = Price_{t+30} / Price_t − 1
log_ceir_w  = winsorize(log_CEIR, 1%)
Controls    = linear trend, z-scored fear_greed_index, 30-day return vol
Split       = Date < / ≥ 2021-06-20   # note: panel post_china_ban uses 2021-06-15
```

---

### 8. Does the China-ban break mechanically affect the denominator construction?

**On the canonical panel used for thesis regression: essentially no.**

- `electricity_price` does not step up in a sustained way after the ban; it stays at 0.076234375 except single-day month-start spikes (Jul–Dec 2021 spikes are higher, but only for one day each).
- Denominator path is dominated by **CBECI TWh** × **constant $/kWh**.
- The ban enters the **empirical design** as a **sample split / dummy** (`post_china_ban` from 2021-06-15; regression Chow split 2021-06-20), not as a mechanical rewiring of cumulative cost.

**In intended builders, yes (partially):**

- Cambridge geography itself jumps (China share collapses Jun–Jul 2021) → weighted $/kWh rises if prices differ by country.
- `CEIR.py` additionally switches `2021_pre_ban` vs `2021_post_ban` price columns at **2021-06-15**.
- ETH-grant full shows sustained higher $/kWh blocks after mid-2021 (e.g. ~0.065 then ~0.070), i.e. ban **does** move that alternate denominator.

**Date inconsistency (unresolved):** panel flag / `CEIR.py` use **2021-06-15**; `ceir_regression.py` / thesis text use **2021-06-20**.

---

### 9. Are any orphaned or legacy CSVs being used unintentionally?

| File | Status vs canonical regression |
|------|--------------------------------|
| `thesis_package/empirical_results/bitcoin_ceir_analysis_ready.csv` | **Canonical** input to `ceir_regression.py` |
| `empirical/bitcoin_ceir_analysis_ready.csv` | Byte-identical copy; also refreshed by `--refresh-panel` |
| `bitcoin_ceir_complete.csv` (empirical + thesis_package) | Parent series; 2018 held out via flag |
| `weighted_electricity_prices_monthly.csv` | **Cited** in thesis data-source tables / Ch.3; **not** equal to panel `electricity_price` |
| `empirical/ETH-grant/bitcoin_ceir_full.csv` | **Orphan alternate CEIR** (better price path); unused by `ceir_regression.py` |
| `empirical/bitcoin_analysis_cleaned.csv` | Legacy multi-CEIR workspace; documentation.txt once called it “FINAL”; **not** regression input |
| `electricity_prices_detailed_by_year.csv` | **Referenced but missing** — lineage break |
| `electricity_prices_by_country.csv` | **Missing**; only hardcoded in `cambridge.py` |
| `bitcoin_ceir_final.csv`, `Regression.py`, `fix_did.py`, `heatmap.csv`, `processed_bitcoin_data_FIXED.csv` | Referenced in README/docs; **missing** |
| `empirical/ceir_variant_summary.csv`, `death/*`, `ETH-grant/*` harness | Side analyses / archives |

**Unintentional citation risk:** treating `weighted_electricity_prices_monthly.csv` or ETH-grant full as “what the thesis panel used” would misstate the denominator. The regression **does** use the broken `electricity_price` column inside `bitcoin_ceir_analysis_ready.csv`.

---

## Date ranges (canonical)

| Series | Start | End |
|--------|-------|-----|
| CBECI energy file | 2010-07-18 | 2025-05-28 |
| Cambridge mining distribution | 2019-09-01 | 2022-01-01 |
| `bitcoin_ceir_complete.csv` | 2018-01-01 | 2025-05-28 (N=2,703) |
| `in_analysis_period=1` / analysis_ready | 2019-01-01 | 2025-05-28 (N=2,340) |
| Regression sample (controls complete) | ≈2019-01-30 | ≈2025-04-28 (N=2,280) |
| Pre-ban (regression) | … | 2021-06-19 |
| Post-ban (regression) | 2021-06-20 | … |

---

## Formulas (summary)

```text
# Energy → money (panel)
E_t^{kWh/day} = TWh_t^{annualised} × 10^9 / 365
C_t^{USD/day} = E_t^{kWh/day} × p_t^{USD/kWh}
K_t           = Σ_{s=s0}^{t} C_s          # s0 = 2018-01-01 in complete
CEIR_t        = MarketCap_t / K_t

# Intended p_t (CEIR.py; not what panel stores day-by-day)
p_t = Σ_{c ≠ others} w_{c,m(t)} × π_{c,y(t)}
    + (1 − Σ w) × mean_c(π_{c,y(t)})     # residual / others
# m(t) = closest Cambridge month; freeze first/last outside [2019-09, 2022-01]
# y(t) = year column; for 2021 use pre/post ban vs 2021-06-15

# Regression
R_{t,t+30} = P_{t+30}/P_t − 1
R ~ winsor_1%(log CEIR) + trend + z(FG) + vol30
```

---

## Unresolved assumptions / open risks

1. **No reproducible builder** for `bitcoin_ceir_complete.csv` / `analysis_ready` is checked in; provenance of default `p=0.076234375` is opaque.  
2. **`electricity_prices_detailed_by_year.csv` is missing** — country-year assumptions cannot be re-audited from primary data.  
3. **Panel electricity merge bug** makes geography-weighted cost claims in prose/tables overstate what the denominator actually does.  
4. **Ban date mismatch:** 2021-06-15 (panel/`CEIR.py`) vs 2021-06-20 (regression/thesis).  
5. **Multiple conflicting price dictionaries** (`cambridge.py` / `datagath.py` / `fusion_ceir.py` / missing detailed CSV).  
6. **Cumulative cost includes 2018** while analysis starts 2019 — level of CEIR depends on that seed.  
7. **Market-cap supply** is an approximation, not on-chain circulating supply.  
8. **HHI / concentration** cannot be extended past Jan 2022 with Cambridge; regression panel does not carry HHI anyway.  
9. **Orphan ETH-grant CEIR** could be mistaken for the thesis series; values differ materially.  
10. Older docs (`DATA_EXTENSION_REALITY_CHECK.md`) still describe a 2020–2022-only thesis window; current panel/regression use **2019–2025** with `in_analysis_period=1` for all post-2018 years.

---

## Essential files for this lineage

1. `empirical/cambridge_mining_distribution.csv`  
2. `empirical/cambridge.py`  
3. `empirical/Historical annualised electricity consumption.csv`  
4. `empirical/CEIR.py` (intended weighted-price + CEIR construction)  
5. `empirical/bitcoin_ceir_complete.csv`  
6. `thesis_package/empirical_results/bitcoin_ceir_analysis_ready.csv`  
7. `thesis_package/ceir_regression.py`  
8. `thesis_package/empirical_results/tables/ceir_data_sources.csv` / `ceir_variable_definitions.csv`  
9. `empirical/weighted_electricity_prices_monthly.csv` (cited; not panel `electricity_price`)  
10. `empirical/ETH-grant/bitcoin_ceir_full.csv` (alternate construction)  
11. `thesis_package/CEIR_REPRODUCTION.md`, `CEIR_ROBUSTNESS_NOTES.md`  
12. `thesis_package/DATA_EXTENSION_REALITY_CHECK.md`, `CAMBRIDGE_DATA_COMPLETE_ANALYSIS.md`

---

## Bottom line

CEIR in the thesis package is **MarketCap / cumulative (CBECI TWh × $/kWh)**, with cumulative running from 2018. Mining geography for weighting was meant to come from **manually structured Cambridge map months (Sep 2019–Jan 2022)** and then **freeze or ffill**. Country $/kWh were meant to come from a **now-missing yearly price table** (with competing hardcoded tables elsewhere). After Jan 2022, geography is unavailable; the **canonical panel replaces almost all days with a constant ~0.076 $/kWh** rather than freezing the last weighted month. The China ban **splits the regression sample** but does **not** meaningfully rewire the stored denominator. Several legacy CSVs and an ETH-grant CEIR build sit beside the canonical panel and should not be confused with it.
