# Initial/Maintenance Margin Calibration (Pilot Draft)

Purpose: size IM/MM per zone/tenor so solvency is protected without over-collateralizing.

## Inputs
- VaR grid from Pillar 2 (σ, S0, K) per region/tenor.
- Price decimals: default 6 (USDC-aligned).
- Notional: 1,000 kWh per contract (configurable).
- Current contract defaults: IM=150% of strike*notional, MM=75% of IM (adjustable per series).

## Method
1) For each zone + tenor, compute payoff distribution using historical σ and shocks; take 99% payoff VaR.
2) Set IM = max(1.25×VaR, floor buffer) to reflect tail risk; start with 1.5× for high-vol zones.
3) Set MM = 0.7–0.8× IM depending on liquidity and oracle cadence.
4) Stress table: keep a small CSV of IM/MM per zone/tenor for transparency and to feed governance updates.

## Example (illustrative)
- Zone A (σ=1.5x base, 1M tenor): VaR99 ≈ $0.45/kWh → IM ≈ $0.68/kWh; MM ≈ $0.51/kWh.
- Zone B (σ=0.9x base, 1M tenor): VaR99 ≈ $0.22/kWh → IM ≈ $0.28/kWh; MM ≈ $0.21/kWh.

## Operational Notes
- Update IM/MM via admin/governance per series (functions already present).
- Higher oracle cadence (daily) + tighter σ reduces IM; if oracle is less frequent, keep IM higher.
- For longs vs shorts: symmetric IM/MM for simplicity in MVP; can differentiate later if needed.

## Next Steps
- Generate per-zone CSV from Pillar 2 simulations and commit as `empirical/margin_calibration.csv`.
- Add a runbook entry for updating IM/MM on-chain when σ regime shifts.
