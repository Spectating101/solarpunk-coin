# CEIR Empirical Pillar — Robustness & Status (rebuilt Jun 2026)

This supplements the thesis draft. Numbers are reproduced by `thesis_package/ceir_regression.py` on `bitcoin_ceir_analysis_ready.csv`.

## Pillar 1 (Empirical CEIR)

- **Panel:** `bitcoin_ceir_analysis_ready.csv` (2019–2025 daily). `Returns_forward` refreshed to true 30-day forward returns from price.
- **Level spec (preferred):** 1% winsor on `log(CEIR)`, linear trend, standardized fear/greed, 30-day return volatility; HAC(30); month clustering.
  - Pre-ban: β ≈ **−0.262** (HAC p ≈ 0.0005; cluster p ≈ 0.0007); N ≈ 872.
  - Post-ban: β ≈ **−0.071** (HAC p ≈ 0.13; cluster p ≈ 0.13); N ≈ 1408.
  - Chow test: p ≈ **1.1×10⁻¹⁶** (coefficients differ; post-ban link is **weaker**, not stronger).
  - Economic magnitude (pre-ban): 1 SD increase in log(CEIR) → ≈ **−12.6%** expected 30-day return.
- **Differenced spec (boundary):** Δlog(CEIR) insignificant pre and post — cite as sensitivity limit.
- **Trading rule:** Strategy ≈ **+176%** vs buy-and-hold ≈ **+2771%**; Sharpe **0.72** vs **1.13** — underperforms; not a strength.
- **Limits:** Bitcoin-only; overlapping 30-day returns; single-asset; mining geography data thin in late sample.

## Prior draft note (superseded)

Earlier notes cited post-ban β ≈ −0.63 and trading returns −1.4% / +1770%. Those came from a missing `Regression.py` / price-corrected backup dataset and a mis-labelled 1-day `Returns_forward` column. **Do not cite** −0.634 or −1.4% in new text.

## How to cite in the thesis

- Report pre-ban significance and post-ban weakening.
- Reference `ceir_analysis_summary.csv`, `ceir_analysis_summary_diff.csv`, `ceir_trading_rule_summary.json`.
- State claims are conditional on level (not differenced) specification and pre-ban regime.

## Reproduce

```bash
python thesis_package/ceir_regression.py --refresh-panel
```
