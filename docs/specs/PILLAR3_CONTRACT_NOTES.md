# Pillar 3 — Contract Feasibility Notes (Draft, Dec 2025)

## Purpose
Make the energy-backed payoff credible under real frictions: oracle/basis risk, solvency/margin, and market viability. This removes the fragility seen in passive CEIR anchoring by specifying verification, tolerances, and controls.

## Term-Sheet Skeleton (for thesis tables)
- Underlying: Energy index (e.g., $/kWh wholesale + satellite/utility blend) — *not* CEIR. CEIR is motivation, not settlement.
- Strike: Cost floor (e.g., LCOE) or benchmark tariff.
- Tenor: ≤3–12 months (aligns with GBM horizon validity).
- Payoff: European call/put (per thesis design) with cash settlement (USDC).
- Notional: kWh equivalent (e.g., 1,000 kWh per contract).
- Exercise/Settlement: European, oracle-based, weighted median of sources.

## Oracle / Basis Risk
- Sources: utility wholesale feed, satellite proxy (NASA), decentralized price oracle (Chainlink). Weighted median for robustness.
- Tolerances: sensitivity table (e.g., hedge effectiveness vs ±5%, ±10% oracle error). Use CEIR fragility as motivation to set tight tolerances.
- Monitoring: staleness checks; quorum rules; fallback to last-good value with circuit breaker if deviation > Xσ.
- On-chain MVP: `postIndex()` validates source staleness/quorum and computes weighted median before updating the index.

## Margin / Solvency
- Initial margin: stress percentile (e.g., 99%) of modeled P&L using σ grid from Pillar 2; add buffer (e.g., 1.5× VaR).
- Variation margin: daily marks to settlement index; auto-liquidate below maintenance.
- Stress/circuit: cap/pause if settlement deviates >3σ from rolling mean; optional insurance fund (e.g., 0.5% of open interest).
- Example (MC, 99% payoff VaR, 10k paths, T=0.25): `empirical/margin_stress_table.csv` shows margin ≈0.25–0.67 $/kWh notional (1.5× VaR) across S0 multipliers 0.8–1.2 and σ multipliers 0.75–1.25. Use as a template for term-sheet margin sizing.

## Market Viability
- Roles: natural hedgers (producers/consumers), MM/specs, arbitrageurs.
- Minimum conditions: spreads <0.5%, depth >$500k at touch, ≥3 independent MMs, daily volume >$2M (example targets; tune per market).
- Bootstrapping: incentives or subsidies for early MMs; pilot with bilateral/OTC before exchange listing.

## Polygon Integration (engineering sketch)
- On-chain: minimal settlement and margin engine; oracle aggregation (weighted median); role/pausing controls.
- Off-chain: pricing/calibration (σ, S0, K) from Pillar 2; risk monitoring; trigger feeds for margin calls/liquidations.
- Data flow: off-chain service computes marks from oracle feeds → posts to contract; contract enforces margin and settlement.
- Keep heavy math (MC/binomial) off-chain; only pass calibrated parameters and observed index on-chain.

## Limits to acknowledge
- Oracle quality/basis risk not eliminated—only bounded.
- Liquidity/microstructure not solved; viability targets are assumptions.
- Regulatory constraints not addressed; sandbox/pilot required.

## Next steps (if needed)
- Build a one-page term-sheet table for the thesis.
- Add a small stress/margin table using Pillar 2 σ/S0 grid to illustrate margin sizing.
- Draft a short “oracle and basis” figure showing tolerance bands and triggers.
