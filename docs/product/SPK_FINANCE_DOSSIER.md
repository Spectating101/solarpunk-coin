# SolarPunk SPK Finance Dossier

- generated_at: `2026-05-17T05:00:31.940Z`
- thesis: The finance-heavy SolarPunk claim is not that code prints money. It is that verified energy surplus can be converted into an inspectable monetary balance sheet with explicit issuance, redemption liabilities, fee income, reserve capital, and stress gaps.

## Finance Summary

| Metric | Value |
|---|---:|
| Annualized protocol fee revenue | $22.24 |
| Annual operating expense assumption | $120,000 |
| Opex coverage ratio | 0.0185% |
| Required fee base at current policy | $354,201,976 |
| Fee base gap multiple | 5,396.04x |
| Active supply liability at basis | $8,194.43 |
| Base simulation reserve coverage | 17.79x |
| Worst stress buffer required | $3,940.99 |
| Minimum closed-pilot finance stack | $175,746 |
| Finance readiness | `3/5 finance_model_ready_but_capital_and_revenue_blocked` |

## Monetary Unit Economics

| Item | Value |
|---|---:|
| Energy price basis | $0.05 / kWh |
| kWh per SPK | 20 |
| Implied SPK unit | $1 |
| Net SPK per kWh after mint fee | 0.04995 |
| Fee revenue per minted kWh | $0.00005 |

## Annualized Income Statement

| Line item | Amount |
|---|---:|
| Mint fee revenue | $15.22 |
| Redemption fee revenue | $7.02 |
| Settlement fee revenue | $0 |
| Total protocol fee revenue | $22.24 |
| Operating expense assumption | $120,000 |
| Net operating result | $-119,977.76 |

## Archetype Finance

| Archetype | Issued SPK | Settlement SPK | Redeemed SPK | Fee revenue | Shortfall liability | Operator reserve | Reserve coverage | Status |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| 10 kW solar home | 200.22 | 300.33 | 70.08 | $0.27 | $0.7 | $5 | 7.52x | `solvent_mechanics_but_not_self_funding` |
| 250 kW neighborhood cluster | 3,893.1 | 9,732.76 | 1,946.55 | $5.84 | $58.4 | $500 | 8.66x | `solvent_mechanics_but_not_self_funding` |
| 1 MW commercial portfolio | 11,123.16 | 33,369.47 | 5,005.42 | $16.13 | $250.27 | $5,000 | 20.04x | `solvent_mechanics_but_not_self_funding` |

## Stress Capital Stack

| Component | Amount |
|---|---:|
| Runway reserve | $60,000 |
| Audit reserve | $25,000 |
| Legal scoping reserve | $15,000 |
| Oracle ops reserve | $20,000 |
| Pilot working capital | $50,000 |
| Stress capital reserve | $4,926 |
| Active-supply liquidity reserve | $819 |
| Minimum finance stack | $175,746 |

This is an internal finance stack for a closed pilot, not a token-sale target and not customer collateral unless legally segregated.

## Readiness Checks

- PASS asset_liability_mapping: Active SPK supply is mapped to an energy-denominated redemption liability.
- PASS conservation_checked: Minted SPK, redeemed SPK, active supply, owed kWh, delivered kWh, and shortfall kWh reconcile in the current artifacts.
- BLOCKED stress_capital_named: Worst stress still needs $3,940.99 of named buffer before it can be treated as finance-ready.
- BLOCKED fee_model_self_funding: Current annualized fee revenue is $22.24 against an explicit $120,000 annual operating-budget assumption.
- PASS launch_gate_blocks_real_money: The launch gate still blocks paid/mainnet use until audit, legal, redemption, and production deployment requirements are met.

## Finance Next Steps

- Replace generic operating-budget assumptions with a real pilot budget and signed operator cost sheet.
- Use the economic launch-readiness module to convert tariff/PPA, capex, and capital-structure terms into DSCR and support-gap thresholds.
- Separate protocol fees from actual business revenue: pilot setup fees, monitoring SaaS, oracle service fees, and structured energy receipts.
- Define legal reserve segregation: what is protocol-owned, operator-owned, customer collateral, insurance, or grant-funded infrastructure.
- Add scenario probability weights only after real production, tariff, and redemption data exist.

## Hard Boundaries

- This dossier is a finance model, not investment advice, not a securities offering, and not a solvency guarantee.
- Protocol fee revenue is modeled from current fee policy and simulated volume; it is not current realized revenue.
- Operating expense, legal, oracle, pilot working-capital, and runway assumptions are explicit internal planning inputs.
- Reserve capital for redemptions or shortfalls must be legally and operationally segregated before any paid product.
- SPK should not be marketed as yield-bearing, risk-free, or fully redeemable until legal terms, counterparties, reserves, and audit are complete.
