# Daily Experiment Status

Continuous Sepolia proof surface for the NASA POWER -> SolarPunk oracle experiment.

- generated_at: `2026-04-29T14:42:01.509170+00:00`
- network: `sepolia`
- total_successful_runs: `3`
- first_successful_run: `2026-04-20`
- last_successful_run: `2026-04-29`
- current_success_streak_days: `1`
- max_missing_gap_days: `7`

## What this proves

- The protocol can ingest real public irradiance data on a recurring schedule.
- The data can be transformed into a market-linked index and written on-chain.
- Each run leaves a public transaction trail and a committed repo artifact.

## Latest run

- date: `2026-04-29`
- NASA observation date: `2026-04-24`
- location: `Taoyuan, Taiwan`
- normalised index: `0.2467`
- on-chain option index: `0.2467`
- reserve ratio: `10.1%`
- peg stable: `True`
- cumulative surplus kWh: `30000`
- updateIndex tx: https://sepolia.etherscan.io/tx/0x615e06362fbf46d5e02ac5b54277276f565ad13991432cbe6966d199638484ab
- updateEnergyPrice tx: https://sepolia.etherscan.io/tx/0x64dbd528e5a59d63e440d7b7b868b7ecf8ef036b93867029942f759d74938da9
- updateOraclePriceAndAdjust tx: https://sepolia.etherscan.io/tx/0x4bce17ac407229402943fc6e6a9e70bda12dd0cc2820d0c4a7e20402a8bcb3a2

## Aggregate summary

- peg stable rate: `100.0%`
- normalised index min/max/avg: `0.2467` / `1.4538` / `1.0514`
- reserve ratio min/max/avg: `10.1%` / `10.1%` / `10.1%`

## Recent runs

| Date | NASA Date | Normalised Index | Option Index | Reserve Ratio | Peg Stable | updateIndex tx |
|---|---|---:|---:|---:|---|---|
| 2026-04-20 | 2026-04-15 | 1.4538 | 1.4538 | 10.1% | True | [0xb5e9a2fd...](https://sepolia.etherscan.io/tx/0xb5e9a2fde6e5a96e8b503eb25085a2f34d9ae6f91a4fe5de6c026a82fdc4c018) |
| 2026-04-21 | 2026-04-15 | 1.4538 | 1.4538 | 10.1% | True | [0xe542244f...](https://sepolia.etherscan.io/tx/0xe542244f0c89ecc683f7efdef577e545a6e830680392820af194f9ed4f419bda) |
| 2026-04-29 | 2026-04-24 | 0.2467 | 0.2467 | 10.1% | True | [0x615e0636...](https://sepolia.etherscan.io/tx/0x615e06362fbf46d5e02ac5b54277276f565ad13991432cbe6966d199638484ab) |

## Scope note

- This is a continuous prototype-stage oracle experiment on Sepolia.
- It demonstrates recurring real-data ingestion and on-chain publication, not production oracle finality.
