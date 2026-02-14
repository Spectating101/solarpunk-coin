# Operator Workbench

- generated_at: `2026-02-14T10:25:24.698556+00:00`
- client: `Taoyuan Pilot Solar Co.`
- region: `Taoyuan, Taiwan`
- immediate_go_no_go: `GO`
- operating_score: `100/100`
- risk_band: `normal`
- confidence: `high`

## Business Snapshot

- annual_generation_kwh: `125000.0`
- gross_revenue_estimate_usd: `6875.0`
- floor_revenue_estimate_usd: `4593.75`
- initial_margin_estimate_usdc: `34.82`
- hedge_burden_pct_of_revenue: `0.51`
- contracts (recommended/evaluated): `88/88`
- risk_budget_fit: `within_budget`

## Assignments

- [P2] `T01` owner=`Data Ops` due=`2026-02-21T10:25:24.698520+00:00` task=`Refresh generation forecast and spot index assumptions for weekly re-pricing.` reason=`Taoyuan, Taiwan profile requires rolling repricing to stay decision-ready.`
- [P2] `T02` owner=`Portfolio Manager` due=`2026-02-21T10:25:24.698520+00:00` task=`Issue board-style weekly hedge summary (exposure, margin, scenario deltas).` reason=`Institutional workflow requires decision trace and audit trail.`

## Rule

- If `immediate_go_no_go` is `NO_GO`, close all P0 tasks before approving any new hedge move.
