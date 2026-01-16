# CEIR + SPK-Derivatives Paper Outline (Submission-Ready Plan)

**Goal:** Package the CEIR empirics, spk-derivatives pricing engine, and contract feasibility into a journal-length paper + replication bundle. Position as an evidence-to-instrument pipeline: energy anchoring → pricing → execution.

## Target Venues
- Finance/energy: *Energy Economics*, *Journal of Commodity Markets*, *Journal of Financial Markets*, *Journal of Empirical Finance*.
- Fintech/crypto: *Journal of Financial Data Science*, *Financial Innovation*, *Journal of Blockchain Research*.
- As thesis chapters: keep the longer proofs/appendices; trim for journals.

## Proposed Structure
1) **Introduction**: Energy anchoring motivation, triple natural experiment (CEIR), bridge to pricing and contract feasibility.
2) **Data & CEIR Construction**: Define CEIR; data sources (prices, hash-rate/energy, geography, electricity prices); regime splits (pre-ban, post-ban, ETH Merge).
3) **Empirical Results (CEIR)**: Baseline regressions, structural breaks (China ban), DiD ETH Merge volatility; robustness (winsorization, HAC/cluster SEs, differenced CEIR).
4) **Pricing & Risk (spk-derivatives)**: Binomial/MC convergence, sensitivity grids, stress/margin tables (link to margin_calibration.csv), validation vs empirical σ/S0 grids.
5) **Contract Feasibility**: Option/clearinghouse spec (SolarPunkOption) and stablecoin peg contract (SolarPunkCoin) as minimal execution layers; oracle/basis risk controls and margining (link to docs/specs).
6) **Simulation/Validation**: 1000-day peg simulation; pricing convergence plots; margin stress table; “basis & tolerance” note; pilot plan summary.
7) **Discussion**: When energy anchoring holds (regime dependence), how pricing feeds contract parameters, and pilot/policy implications.
8) **Conclusion**: Contributions, limitations, and deployment roadmap.

## Tables/Figures to Pull
- CEIR regressions/breaks (from `empirical/` summaries: `ceir_analysis_summary.csv`, `ceir_analysis_summary_diff.csv`).
- DiD ETH Merge volatility and China ban structural break.
- Pricing convergence (binomial vs MC), sensitivity grids (`pricing_sensitivity_grid.csv`).
- Margin stress table (`empirical/margin_stress_table.csv`).
- Simulation plots (`spk_simulation.png`, `comprehensive_ceir_analysis.png`, `triple_experiment_analysis.png`).
- Oracle/basis tolerance bands (from `docs/economics/BASIS_AND_TOLERANCE.md`).

## Replication Bundle
- Data: cleaned CEIR datasets (`empirical/bitcoin_ceir_*`, `weighted_electricity_prices_monthly.csv`, `cambridge_mining_distribution.csv`).
- Code: `empirical/` scripts (`Regression.py`, `fix_did.py`, `fix_CEIR.py`, etc.); `energy_derivatives/src/*.py`; contract artifacts/tests.
- Instructions: short README with environment, steps to reproduce regressions, pricing runs, and simulations.

## Submission Prep Checklist
- [ ] Export CEIR tables (pre/post ban; ETH Merge DiD) into LaTeX/Word tables.
- [ ] Export pricing/margin figures from `energy_derivatives` results.
- [ ] Add replication README + archive (zip) with data/scripts.
- [ ] Select target journal and tailor abstract/length accordingly.

**Positioning:** Emphasize novelty (energy-backed valuation pipeline), regime dependence (anchoring on/off), and practical execution (pricing informs margin/contract design). Use thesis chapters for depth; trim proofs for journals. 
