# CEIR Empirical Pillar — Robustness & Status (Dec 2025)

This supplements the thesis draft without touching `thesis-draft.md`. It captures what is robust, what is sensitive, and how the CEIR pillar maps to the three-pillar argument.

## Pillar 1 (Empirical CEIR)
- **Data variants:** Level spec on price-corrected data (`BA_bitcoin_analysis_cleaned_PRICE_CORRECTED.csv`) vs raw (`bitcoin_ceir_final.csv`); differenced log CEIR as trend-robust boundary.
- **Level spec (preferred, corrected data):** Winsor 1%, trend, HAC(30), month clustering. Pre-ban β≈-0.26 (p≈0.005; cluster p≈0.008). Post-ban β≈-0.63 (p<0.001). Chow p≈0. Interactions: CEIR×Google base term robust (cluster p≈0.002); CEIR×EPU interaction significant (cluster p≈0.007).
- **Differenced spec (trend-robust check):** CEIR effects lose significance (pre/post both ns), break still detected. Shows sensitivity to differencing—cite as boundary.
- **DiD (volatility, log CEIR):** OLS significant; HAC/cluster widen SEs. Volatility post_ban stays significant (HAC p≈0.003, cluster p≈0.012); china_high not. CEIR DiD terms stay highly significant across OLS/HAC/cluster.
- **Trading rule:** Fails economically (strategy -1.4% vs buy&hold +1770%; Sharpe 0.145 vs 0.844). Not a strength; present as a negative result.
- **Residual risks/limits:** Single-asset focus; overlapping forward returns; potential spurious correlation despite HAC/cluster; CEIR significance depends on level vs diff; early CEIR outliers handled via winsor but still leverage history; no panel of PoW assets.

## Pillar 2 (Pricing)
- Pricing layer stands independent; no changes. If citing robustness, note convergence (binomial/MC) and cross-location runs; biggest risks are process choice (GBM) and σ estimation (NASA).

## Pillar 3 (Contract)
- Contract-layer arguments unaffected by CEIR sensitivity. Emphasize oracle/basis risk quantification and solvency controls; treat CEIR as motivation, not as a settlement index.

## How to cite in the thesis
- Report both level and differenced outcomes: level spec (corrected data) supports CEIR anchoring pre/post with a strong break; differenced spec removes significance—state claims are conditional on the level interpretation.
- Reference artifacts: `empirical/ceir_analysis_summary.csv` (level), `empirical/ceir_analysis_summary_diff.csv` (diff), DiD outputs from `fix_did.py` (HAC + cluster), and `comprehensive_ceir_analysis.png`.
- Note explicitly that the trading strategy is not viable; do not over-claim practical trading impact.

## If more time
- Panel extension to other PoW assets; wild-bootstrap SEs for DiD; alternative CEIR constructions (different baselines/price weights); IV for CEIR using lagged energy shocks; out-of-sample directional accuracy tests.
