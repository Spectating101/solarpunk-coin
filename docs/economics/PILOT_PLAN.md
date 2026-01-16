# Pilot Plan (Hedge Readiness)

Goal: execute a small-zone pilot with 1–3 month puts, daily marking, and clear pause/exit rules.

## Scope
- Zones: 1–3 regions (match oracle coverage).
- Instruments: European puts (revenue floor), 1–3 month tenor, 1,000 kWh notional.
- Collateral: USDC; price decimals 6.
- Roles: ORACLE_ROLE (data service), LIQUIDATOR_ROLE (ops), PAUSER_ROLE (ops), DEFAULT_ADMIN (you).

## Milestones
1) Deploy SolarPunkOption + SolarPunkCoin to Mumbai with zone identifiers and publish addresses.
2) Wire frontend (`VITE_OPTION_ADDRESS`) and add zone selector to match oracle posts.
3) Post daily index; run health dashboard for staleness/deviation; exercise pause if 3σ/age triggers hit.
4) Execute first pilot trade (long put) with partner; capture demo/screenshot and PnL/margin logs.

## Liquidity & Incentives
- Source: small maker/insurance pool (grant-funded) to take short side; set IM/MM per zone per IM_CALIBRATION.
- Incentives: rebate/bonus for first N trades; penalty flows to insurance fund.
- Size cap: set per-zone OI cap (configurable via governance) to avoid overexposure in pilot.

## Operations
- Cadence: daily oracle update; variation margin collected via markPosition; liquidation if below MM.
- Basis controls: see BASIS_AND_TOLERANCE.md; allow fee-free early close if basis drift >10% over 3 marks.
- Monitoring: track index age, deviation vs 7-day median, paused status, and margin calls.

## Evidence to show funders
- Testnet addresses + block explorer links.
- Short demo video (wallet connect → open position → mark/loss/gain).
- Basis/tolerance note + IM calibration table.
- Optional: LOI/quote from solar coop/advisor.
