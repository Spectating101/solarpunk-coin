# CEIR Empirical Reproduction

This note documents how Chapter 3 numbers map to files in this repository.

## Canonical summary tables (cite these in the thesis)

| File | Contents |
|------|----------|
| `empirical_results/ceir_analysis_summary.csv` | Level spec: pre-ban β ≈ −0.262, post-ban β ≈ −0.071, N = 872 / 1408, Chow p ≈ 1.1×10⁻¹⁶ |
| `empirical_results/ceir_analysis_summary_diff.csv` | Differenced spec: CEIR effects lose significance (boundary condition) |
| `empirical_results/bitcoin_ceir_analysis_ready.csv` | Daily analysis panel (2019+, 30-day forward returns after rebuild) |
| `empirical_results/ceir_trading_rule_summary.json` | Trading-rule backtest on the same panel |

## Regenerate everything

```bash
python thesis_package/ceir_regression.py --refresh-panel
python thesis_package/generate_thesis_tables.py
python thesis_package/generate_thesis_figures.py
python thesis_package/verify_thesis_numbers.py
```

## Preferred specification

- **Outcome:** 30-day forward return `ret_30d = Price_{t+30}/Price_t − 1` (recomputed; legacy `Returns_forward` in old exports was 1-day forward)
- **Regressor:** `log(CEIR_t)` with 1% winsorization
- **Controls:** linear time trend, standardized fear/greed, 30-day return volatility
- **Standard errors:** HAC(30), month clustering
- **Break:** China mining-ban split (2021-06-20)
- **Script:** `thesis_package/ceir_regression.py`

## Interpretation (Jun 2026 rebuild)

- **Pre-ban:** negative, significant (β ≈ −0.26)
- **Post-ban:** negative but smaller and not significant at 5% (β ≈ −0.07)
- **Chow test:** rejects coefficient equality (structural break)
- **Differenced CEIR:** insignificant pre and post — boundary condition
- **Trading rule:** +176% vs +2771% buy-and-hold; Sharpe 0.72 vs 1.13 — not viable as a strategy

## Data fix (important)

Older exports stored `Returns_forward` as `Returns.shift(-1)` (1-day). The thesis text always described a **30-day** horizon. `ceir_regression.py --refresh-panel` corrects the panel column from price data.

## Full working directory

Extended analyses live under `empirical/` (`README.md`, `amihud_hurvich_analysis.py`, etc.). Chapter 3 inference should cite `ceir_regression.py` outputs, not orphaned CSVs from missing `Regression.py`.

## Illustrative vs inferential figures

- **Table 3.3 / `ceir_analysis_summary.csv`** — preferred inference
- **`ceir_forward_returns.png`** — decile illustration only
