# CEIR Empirical Workspace Guide

This folder is the full working directory for the CEIR analysis (data, scripts, manuscripts, submission packages).

## Layout
- Root files: cleaned datasets (`bitcoin_ceir_final.csv`, `bitcoin_ceir_complete.csv`, `electricity_prices_detailed_by_year.csv`), analysis scripts (`Regression.py`, `fix_did.py`, `fix_CEIR.py`, `CEIR.py`, helper checks), plots (`bitcoin_ceir_analysis*.png`, `triple_experiment_analysis.png`), and summary docs (`documentation.txt`, `integration_report.txt`, `proposal.txt`, regression logs).
- `dataset/`: external project attachments (proj_1133958_* PDFs, appendices, apps, and xlsx) referenced in drafts.
- `papers/`: submission drafts/packages (Strengthened draft, Term Project, png2pdf) and the two distinct `proj_1133958_text*.pdf` versions (duplicates removed).
- `Digital-Finance/`, `Financial-Innovation/`, `Ledger/`, `ETH-grant/`: journal/conference submission bundles with manuscripts and cover letters.
- `death/`: prior/diagnostic analyses and plots (regression results, CEIR analyses) kept for reference.

## Notable scripts
- `Regression.py`: main regression run. Now prefers price-corrected datasets (`BA_*`, `BQ_*` in `empirical-backup/...`) if present, supports winsorized log_CEIR, optional differencing, linear trend, and HAC lag config (defaults: 1% winsor, trend on, HAC=30). See `ceir_analysis_summary.csv` and `comprehensive_ceir_analysis.png`.
- `fix_did.py`: corrected DiD analysis used for final results and trading performance chart; now prints both OLS and HAC(30) SEs.
- `fix_CEIR.py`, `CEIR.py`, `simple_CEIR.py`: CEIR construction and sanity checks.
- Helpers: `datagath.py`, `cambridge.py`, `fixnmerge.py`, `check-cost.py`, `testrobust.py`, `diag.py`.

## Recent clean-up
- Extracted from `empirical (1).zip`.
- Removed redundant copies of `proj_1133958_text*.pdf` (kept the two unique hashes).
- Restored `bitcoin_analysis_cleaned.csv` from backup (`AW_bitcoin_analysis_cleaned.csv`) to enable DiD/backtest; price-corrected and concentration variants remain in `empirical-backup/empirical backup/`.

## Latest robustness notes (Dec 21, 2025)
- Regression (price-corrected BA dataset, winsor 1%, trend, HAC(30), month clustering; level CEIR): pre-ban β≈-0.26 (p≈0.005; cluster p≈0.008); post-ban β≈-0.63 (p<0.001); Chow p≈0. Interaction CEIR×Google base term robust (cluster p≈0.002); CEIR×EPU interaction significant (cluster p≈0.007).
- Regression differenced CEIR (see `ceir_analysis_summary_diff.csv`): pre/post CEIR effects lose significance; break remains. Use to show trend-robust boundary.
- DiD: OLS shows both post_ban and china_high significant on volatility; HAC/cluster widen SEs (post_ban stays significant ~p=0.003/0.012; china_high not). CEIR DiD terms remain highly significant across OLS/HAC/cluster.
- Trading rule remains economically weak (strategy -1.4% vs buy&hold +1770%; Sharpe 0.145 vs 0.844).
- Sensitivity: price-corrected datasets make post-ban CEIR effect significant and larger in magnitude; raw data (bitcoin_ceir_final) yields non-significant post-ban in level spec. Consider CEIR differencing toggle (`USE_DIFF_CEIR`) for further trend robustness if needed.

## Open follow-ups
- Re-run `Regression.py`/`fix_did.py` after any data changes; logs currently show NaN overflow issues in older runs (`Regression.txt`) and cleaned runs in `Raw_ceir_result.txt`.
- Consolidate duplicated data sources only after verifying hashes (e.g., hash-rate JSON variants differ).
- Populate figures/tables in `thesis-draft.md` with outputs from this folder when finalizing the thesis.
