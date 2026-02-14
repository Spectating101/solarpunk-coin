# Operator Decision Pack

- generated_at: `2026-02-14T08:38:57.127266+00:00`
- client: `Taoyuan Pilot Solar Co.`
- region: `Taoyuan, Taiwan`
- operating_score: `100/100`
- risk_band: `normal`
- immediate_go_no_go: `GO`

## This Week Decision Snapshot

- contracts_recommended: `88`
- contracts_evaluated: `88`
- margin_total_usdc: `34.820703`
- risk_budget_fit: `within_budget`
- oracle_status: `OK`
- mtm_per_contract_usdc: `0.0`

## Scenario Delta

- downside_payoff_usdc: `10.5`
- base_payoff_usdc: `0.0`
- upside_payoff_usdc: `0.0`

## Prioritized Actions

- [P2] owner=`Data Ops` due_in_days=`7` action=`Refresh generation forecast and spot index assumptions for weekly re-pricing.` reason=`Taoyuan, Taiwan profile requires rolling repricing to stay decision-ready.`
- [P2] owner=`Portfolio Manager` due_in_days=`7` action=`Issue board-style weekly hedge summary (exposure, margin, scenario deltas).` reason=`Institutional workflow requires decision trace and audit trail.`

## Operating Rule

- Treat this pack as required before any hedge-size change or quote confirmation.
- If immediate_go_no_go is `NO_GO`, freeze new execution until P0 actions are closed.
