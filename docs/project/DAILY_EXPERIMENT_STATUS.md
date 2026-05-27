# Daily Experiment Status

Continuous Sepolia proof surface for the NASA POWER -> SolarPunk oracle experiment.

- generated_at: `2026-05-27T05:07:01.470620+00:00`
- network: `sepolia`
- total_successful_runs: `31`
- first_successful_run: `2026-04-20`
- last_successful_run: `2026-05-27`
- current_success_streak_days: `29`
- max_missing_gap_days: `7`

## What this proves

- The protocol can ingest real public irradiance data on a recurring schedule.
- The data can be transformed into a market-linked index and written on-chain.
- Each run leaves a public transaction trail and a committed repo artifact.

## Latest run

- date: `2026-05-27`
- NASA observation date: `2026-05-22`
- location: `Taoyuan, Taiwan`
- normalised index: `1.0273`
- on-chain option index: `1.0273`
- reserve ratio: `10.1%`
- peg stable: `True`
- cumulative surplus kWh: `30000`
- updateIndex tx: https://sepolia.etherscan.io/tx/0x5bf152df0cdc84ade81b990faf7f14adf5976aea1ee1e53e3eccde446c3f5c96
- updateEnergyPrice tx: https://sepolia.etherscan.io/tx/0x8ba08b557bf8d257ff7314fb8402b7d77c90250917959dac44b4fce489486f0d
- updateOraclePriceAndAdjust tx: https://sepolia.etherscan.io/tx/0x1e89b1a6ef36e2bbe7e3ad53b7c76c36a8a6592ae12299feac4a99d441d3d19b

## Aggregate summary

- peg stable rate: `100.0%`
- normalised index min/max/avg: `0.2393` / `1.7159` / `0.9827`
- reserve ratio min/max/avg: `10.1%` / `10.1%` / `10.1%`

## Recent runs

| Date | NASA Date | Normalised Index | Option Index | Reserve Ratio | Peg Stable | updateIndex tx |
|---|---|---:|---:|---:|---|---|
| 2026-05-14 | 2026-05-09 | 0.5979 | 0.5979 | 10.1% | True | [0x20162f08...](https://sepolia.etherscan.io/tx/0x20162f08923cddf07e3455ce3eeecfd69ca4bcd7baeead84e6e2b1e4fe6cf856) |
| 2026-05-15 | 2026-05-10 | 0.6519 | 0.6519 | 10.1% | True | [0x8b39e789...](https://sepolia.etherscan.io/tx/0x8b39e789e5d3444e48ebcd24008cdd31cc4453c482bc66e155503a4df309083b) |
| 2026-05-16 | 2026-05-11 | 0.9358 | 0.9358 | 10.1% | True | [0xcb92e9b6...](https://sepolia.etherscan.io/tx/0xcb92e9b6583c5831b6d5148442d8b821d062475bed74f16ff5daf0bcb6689be8) |
| 2026-05-17 | 2026-05-12 | 1.1383 | 1.1383 | 10.1% | True | [0x1a8a0d8c...](https://sepolia.etherscan.io/tx/0x1a8a0d8cfc39c18402c3624522b13210aa86058e62926ae32beb078f15af01a0) |
| 2026-05-18 | 2026-05-13 | 0.3766 | 0.3766 | 10.1% | True | [0x6e4bae6a...](https://sepolia.etherscan.io/tx/0x6e4bae6aee946d06c77e70d48e4a45a597a50c63bd03ef9424146dc80d9303c4) |
| 2026-05-19 | 2026-05-14 | 0.3843 | 0.3843 | 10.1% | True | [0x34e4e8df...](https://sepolia.etherscan.io/tx/0x34e4e8dff888c290624a318178c8d4312fbcf85f13cd51d8266ad8e53dd4882e) |
| 2026-05-20 | 2026-05-15 | 0.7912 | 0.7912 | 10.1% | True | [0x9ab6d039...](https://sepolia.etherscan.io/tx/0x9ab6d03975905ef366f2c99f21380523474c721d443e58708f49835151814f9f) |
| 2026-05-21 | 2026-05-16 | 1.1197 | 1.1197 | 10.1% | True | [0x9e8c2e72...](https://sepolia.etherscan.io/tx/0x9e8c2e72f6dd699babd9f1768c9f6e6ef2377e2fee4b6275fd7b4cb945e60ec5) |
| 2026-05-22 | 2026-05-16 | 1.1197 | 1.1197 | 10.1% | True | [0x8a608990...](https://sepolia.etherscan.io/tx/0x8a608990ba5497904f852b83d13875d50d8d3f220a4e1c883fcbb20e17d8d1ac) |
| 2026-05-23 | 2026-05-17 | 1.4343 | 1.4343 | 10.1% | True | [0xec61f85c...](https://sepolia.etherscan.io/tx/0xec61f85c32fa6789be8529891e4c7bc79d8e7df089217bfbd102a300a72e4c04) |
| 2026-05-24 | 2026-05-17 | 1.4343 | 1.4343 | 10.1% | True | [0x924a013e...](https://sepolia.etherscan.io/tx/0x924a013e914ca6b376c47e9fb3f5e0c4ca4fb5f05af1272d83020dd03cd23b5e) |
| 2026-05-25 | 2026-05-17 | 1.4343 | 1.4343 | 10.1% | True | [0x8e6ce0f8...](https://sepolia.etherscan.io/tx/0x8e6ce0f8d167a503759e9f0aac31b54559155b17bd874f1888c981a4dad642fe) |
| 2026-05-26 | 2026-05-21 | 0.9453 | 0.9453 | 10.1% | True | [0xa6ae4e6b...](https://sepolia.etherscan.io/tx/0xa6ae4e6b28f34fbedad3072aad36d30d10b299835042eb92798cfb6b2dc691b5) |
| 2026-05-27 | 2026-05-22 | 1.0273 | 1.0273 | 10.1% | True | [0x5bf152df...](https://sepolia.etherscan.io/tx/0x5bf152df0cdc84ade81b990faf7f14adf5976aea1ee1e53e3eccde446c3f5c96) |

## Scope note

- This is a continuous prototype-stage oracle experiment on Sepolia.
- It demonstrates recurring real-data ingestion and on-chain publication, not production oracle finality.
