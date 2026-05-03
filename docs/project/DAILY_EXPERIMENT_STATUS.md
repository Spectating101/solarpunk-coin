# Daily Experiment Status

Continuous Sepolia proof surface for the NASA POWER -> SolarPunk oracle experiment.

- generated_at: `2026-05-03T04:35:36.813261+00:00`
- network: `sepolia`
- total_successful_runs: `7`
- first_successful_run: `2026-04-20`
- last_successful_run: `2026-05-03`
- current_success_streak_days: `5`
- max_missing_gap_days: `7`

## What this proves

- The protocol can ingest real public irradiance data on a recurring schedule.
- The data can be transformed into a market-linked index and written on-chain.
- Each run leaves a public transaction trail and a committed repo artifact.

## Latest run

- date: `2026-05-03`
- NASA observation date: `2026-04-28`
- location: `Taoyuan, Taiwan`
- normalised index: `1.4692`
- on-chain option index: `1.4692`
- reserve ratio: `10.1%`
- peg stable: `True`
- cumulative surplus kWh: `30000`
- updateIndex tx: https://sepolia.etherscan.io/tx/0x76e63d6ceb55c44b466cd5b48916196b0a8b7c5b5ff545e54cb762c09d9a4515
- updateEnergyPrice tx: https://sepolia.etherscan.io/tx/0x4e09e2936a8bc1a9ab1afa1f135d19284a37f4221b9b705f77b22063e4fa5000
- updateOraclePriceAndAdjust tx: https://sepolia.etherscan.io/tx/0xc91d5e5273d1b3bb9432b27192115218fbe2ce27e1c001a86b93078d79b4ca0e

## Aggregate summary

- peg stable rate: `100.0%`
- normalised index min/max/avg: `0.2467` / `1.7159` / `1.1865`
- reserve ratio min/max/avg: `10.1%` / `10.1%` / `10.1%`

## Recent runs

| Date | NASA Date | Normalised Index | Option Index | Reserve Ratio | Peg Stable | updateIndex tx |
|---|---|---:|---:|---:|---|---|
| 2026-04-20 | 2026-04-15 | 1.4538 | 1.4538 | 10.1% | True | [0xb5e9a2fd...](https://sepolia.etherscan.io/tx/0xb5e9a2fde6e5a96e8b503eb25085a2f34d9ae6f91a4fe5de6c026a82fdc4c018) |
| 2026-04-21 | 2026-04-15 | 1.4538 | 1.4538 | 10.1% | True | [0xe542244f...](https://sepolia.etherscan.io/tx/0xe542244f0c89ecc683f7efdef577e545a6e830680392820af194f9ed4f419bda) |
| 2026-04-29 | 2026-04-24 | 0.2467 | 0.2467 | 10.1% | True | [0x615e0636...](https://sepolia.etherscan.io/tx/0x615e06362fbf46d5e02ac5b54277276f565ad13991432cbe6966d199638484ab) |
| 2026-04-30 | 2026-04-25 | 0.2500 | 0.2500 | 10.1% | True | [0x24ed9bae...](https://sepolia.etherscan.io/tx/0x24ed9bae4fd669531434744180f29e30ba572bc844a29cc2af2e27a407411659) |
| 2026-05-01 | 2026-04-26 | 1.7159 | 1.7159 | 10.1% | True | [0xb5138225...](https://sepolia.etherscan.io/tx/0xb5138225189731a1278992d3113d665a42490a05e22fec5e149341d4095248a6) |
| 2026-05-02 | 2026-04-26 | 1.7159 | 1.7159 | 10.1% | True | [0x0d0f445c...](https://sepolia.etherscan.io/tx/0x0d0f445c1515ad6ac1d137b13994917678c0b5a672ba511665f27b2eabe4a7f3) |
| 2026-05-03 | 2026-04-28 | 1.4692 | 1.4692 | 10.1% | True | [0x76e63d6c...](https://sepolia.etherscan.io/tx/0x76e63d6ceb55c44b466cd5b48916196b0a8b7c5b5ff545e54cb762c09d9a4515) |

## Scope note

- This is a continuous prototype-stage oracle experiment on Sepolia.
- It demonstrates recurring real-data ingestion and on-chain publication, not production oracle finality.
