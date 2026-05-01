# Daily Experiment Status

Continuous Sepolia proof surface for the NASA POWER -> SolarPunk oracle experiment.

- generated_at: `2026-05-01T04:44:12.980194+00:00`
- network: `sepolia`
- total_successful_runs: `5`
- first_successful_run: `2026-04-20`
- last_successful_run: `2026-05-01`
- current_success_streak_days: `3`
- max_missing_gap_days: `7`

## What this proves

- The protocol can ingest real public irradiance data on a recurring schedule.
- The data can be transformed into a market-linked index and written on-chain.
- Each run leaves a public transaction trail and a committed repo artifact.

## Latest run

- date: `2026-05-01`
- NASA observation date: `2026-04-26`
- location: `Taoyuan, Taiwan`
- normalised index: `1.7159`
- on-chain option index: `1.7159`
- reserve ratio: `10.1%`
- peg stable: `True`
- cumulative surplus kWh: `30000`
- updateIndex tx: https://sepolia.etherscan.io/tx/0xb5138225189731a1278992d3113d665a42490a05e22fec5e149341d4095248a6
- updateEnergyPrice tx: https://sepolia.etherscan.io/tx/0x51c0bf667355c9943ad92453c48929a73ff8059557c8112e610c7b439200f344
- updateOraclePriceAndAdjust tx: https://sepolia.etherscan.io/tx/0x352dd7a893cff5a207f6f2ef9e585fcd6a3eafb89492b2bf7eb536229a432e12

## Aggregate summary

- peg stable rate: `100.0%`
- normalised index min/max/avg: `0.2467` / `1.7159` / `1.0240`
- reserve ratio min/max/avg: `10.1%` / `10.1%` / `10.1%`

## Recent runs

| Date | NASA Date | Normalised Index | Option Index | Reserve Ratio | Peg Stable | updateIndex tx |
|---|---|---:|---:|---:|---|---|
| 2026-04-20 | 2026-04-15 | 1.4538 | 1.4538 | 10.1% | True | [0xb5e9a2fd...](https://sepolia.etherscan.io/tx/0xb5e9a2fde6e5a96e8b503eb25085a2f34d9ae6f91a4fe5de6c026a82fdc4c018) |
| 2026-04-21 | 2026-04-15 | 1.4538 | 1.4538 | 10.1% | True | [0xe542244f...](https://sepolia.etherscan.io/tx/0xe542244f0c89ecc683f7efdef577e545a6e830680392820af194f9ed4f419bda) |
| 2026-04-29 | 2026-04-24 | 0.2467 | 0.2467 | 10.1% | True | [0x615e0636...](https://sepolia.etherscan.io/tx/0x615e06362fbf46d5e02ac5b54277276f565ad13991432cbe6966d199638484ab) |
| 2026-04-30 | 2026-04-25 | 0.2500 | 0.2500 | 10.1% | True | [0x24ed9bae...](https://sepolia.etherscan.io/tx/0x24ed9bae4fd669531434744180f29e30ba572bc844a29cc2af2e27a407411659) |
| 2026-05-01 | 2026-04-26 | 1.7159 | 1.7159 | 10.1% | True | [0xb5138225...](https://sepolia.etherscan.io/tx/0xb5138225189731a1278992d3113d665a42490a05e22fec5e149341d4095248a6) |

## Scope note

- This is a continuous prototype-stage oracle experiment on Sepolia.
- It demonstrates recurring real-data ingestion and on-chain publication, not production oracle finality.
