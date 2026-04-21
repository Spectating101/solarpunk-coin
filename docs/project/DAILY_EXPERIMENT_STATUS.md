# Daily Experiment Status

Continuous Sepolia proof surface for the NASA POWER -> SolarPunk oracle experiment.

- generated_at: `2026-04-20T16:51:07.183569+00:00`
- network: `sepolia`
- total_successful_runs: `2`
- first_successful_run: `2026-04-20`
- last_successful_run: `2026-04-21`
- current_success_streak_days: `2`
- max_missing_gap_days: `0`

## What this proves

- The protocol can ingest real public irradiance data on a recurring schedule.
- The data can be transformed into a market-linked index and written on-chain.
- Each run leaves a public transaction trail and a committed repo artifact.

## Latest run

- date: `2026-04-21`
- NASA observation date: `2026-04-15`
- location: `Taoyuan, Taiwan`
- normalised index: `1.4538`
- on-chain option index: `1.4538`
- reserve ratio: `10.1%`
- peg stable: `True`
- cumulative surplus kWh: `30000`
- updateIndex tx: https://sepolia.etherscan.io/tx/0xe542244f0c89ecc683f7efdef577e545a6e830680392820af194f9ed4f419bda
- updateEnergyPrice tx: https://sepolia.etherscan.io/tx/0xeb63bffa5a9d48fbb5a1f655803dc9dc2b0c2210528b674248f82235bd38e157
- updateOraclePriceAndAdjust tx: https://sepolia.etherscan.io/tx/0x5d030a12413250b0624fd818d27c63889153926f9352ff46afab72897163642c

## Aggregate summary

- peg stable rate: `100.0%`
- normalised index min/max/avg: `1.4538` / `1.4538` / `1.4538`
- reserve ratio min/max/avg: `10.1%` / `10.1%` / `10.1%`

## Recent runs

| Date | NASA Date | Normalised Index | Option Index | Reserve Ratio | Peg Stable | updateIndex tx |
|---|---|---:|---:|---:|---|---|
| 2026-04-20 | 2026-04-15 | 1.4538 | 1.4538 | 10.1% | True | [0xb5e9a2fd...](https://sepolia.etherscan.io/tx/0xb5e9a2fde6e5a96e8b503eb25085a2f34d9ae6f91a4fe5de6c026a82fdc4c018) |
| 2026-04-21 | 2026-04-15 | 1.4538 | 1.4538 | 10.1% | True | [0xe542244f...](https://sepolia.etherscan.io/tx/0xe542244f0c89ecc683f7efdef577e545a6e830680392820af194f9ed4f419bda) |

## Scope note

- This is a continuous prototype-stage oracle experiment on Sepolia.
- It demonstrates recurring real-data ingestion and on-chain publication, not production oracle finality.
