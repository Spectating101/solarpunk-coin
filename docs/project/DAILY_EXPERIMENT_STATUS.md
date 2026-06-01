# Daily Experiment Status

Continuous Sepolia proof surface for the NASA POWER -> SolarPunk oracle experiment.

- generated_at: `2026-06-01T05:52:37.098820+00:00`
- network: `sepolia`
- total_successful_runs: `36`
- first_successful_run: `2026-04-20`
- last_successful_run: `2026-06-01`
- current_success_streak_days: `34`
- max_missing_gap_days: `7`

## What this proves

- The protocol can ingest real public irradiance data on a recurring schedule.
- The data can be transformed into a market-linked index and written on-chain.
- Each run leaves a public transaction trail and a committed repo artifact.

## Latest run

- date: `2026-06-01`
- NASA observation date: `2026-05-27`
- location: `Taoyuan, Taiwan`
- normalised index: `2.0501`
- on-chain option index: `2.0501`
- reserve ratio: `10.1%`
- peg stable: `True`
- cumulative surplus kWh: `30000`
- updateIndex tx: https://sepolia.etherscan.io/tx/0x1d0496030549708042d8d97a40514ab5c419ce7c5aa170ca79edea73b9c03951
- updateEnergyPrice tx: https://sepolia.etherscan.io/tx/0x48d2f270c649a2a718e9450eb97a6b18b253395c2d1b41792325d40f44663346
- updateOraclePriceAndAdjust tx: https://sepolia.etherscan.io/tx/0xae52a89ff62d6586f72738867f0c1177a939189939f0d41ef23dd1eec1b646cf

## Aggregate summary

- peg stable rate: `100.0%`
- normalised index min/max/avg: `0.2393` / `2.0586` / `1.0753`
- reserve ratio min/max/avg: `10.1%` / `10.1%` / `10.1%`

## Recent runs

| Date | NASA Date | Normalised Index | Option Index | Reserve Ratio | Peg Stable | updateIndex tx |
|---|---|---:|---:|---:|---|---|
| 2026-05-19 | 2026-05-14 | 0.3843 | 0.3843 | 10.1% | True | [0x34e4e8df...](https://sepolia.etherscan.io/tx/0x34e4e8dff888c290624a318178c8d4312fbcf85f13cd51d8266ad8e53dd4882e) |
| 2026-05-20 | 2026-05-15 | 0.7912 | 0.7912 | 10.1% | True | [0x9ab6d039...](https://sepolia.etherscan.io/tx/0x9ab6d03975905ef366f2c99f21380523474c721d443e58708f49835151814f9f) |
| 2026-05-21 | 2026-05-16 | 1.1197 | 1.1197 | 10.1% | True | [0x9e8c2e72...](https://sepolia.etherscan.io/tx/0x9e8c2e72f6dd699babd9f1768c9f6e6ef2377e2fee4b6275fd7b4cb945e60ec5) |
| 2026-05-22 | 2026-05-16 | 1.1197 | 1.1197 | 10.1% | True | [0x8a608990...](https://sepolia.etherscan.io/tx/0x8a608990ba5497904f852b83d13875d50d8d3f220a4e1c883fcbb20e17d8d1ac) |
| 2026-05-23 | 2026-05-17 | 1.4343 | 1.4343 | 10.1% | True | [0xec61f85c...](https://sepolia.etherscan.io/tx/0xec61f85c32fa6789be8529891e4c7bc79d8e7df089217bfbd102a300a72e4c04) |
| 2026-05-24 | 2026-05-17 | 1.4343 | 1.4343 | 10.1% | True | [0x924a013e...](https://sepolia.etherscan.io/tx/0x924a013e914ca6b376c47e9fb3f5e0c4ca4fb5f05af1272d83020dd03cd23b5e) |
| 2026-05-25 | 2026-05-17 | 1.4343 | 1.4343 | 10.1% | True | [0x8e6ce0f8...](https://sepolia.etherscan.io/tx/0x8e6ce0f8d167a503759e9f0aac31b54559155b17bd874f1888c981a4dad642fe) |
| 2026-05-26 | 2026-05-21 | 0.9453 | 0.9453 | 10.1% | True | [0xa6ae4e6b...](https://sepolia.etherscan.io/tx/0xa6ae4e6b28f34fbedad3072aad36d30d10b299835042eb92798cfb6b2dc691b5) |
| 2026-05-27 | 2026-05-22 | 1.0273 | 1.0273 | 10.1% | True | [0x5bf152df...](https://sepolia.etherscan.io/tx/0x5bf152df0cdc84ade81b990faf7f14adf5976aea1ee1e53e3eccde446c3f5c96) |
| 2026-05-28 | 2026-05-23 | 1.1704 | 1.1704 | 10.1% | True | [0x9e619a7d...](https://sepolia.etherscan.io/tx/0x9e619a7dd77dce0daeaafebe8ab9b47da5eebf9fc260b3d60f6742f78b04d555) |
| 2026-05-29 | 2026-05-24 | 1.3518 | 1.3518 | 10.1% | True | [0x0269d519...](https://sepolia.etherscan.io/tx/0x0269d51998653eeb988ecc7570d8ffe2477b616c0e4493965ac60424e41721d9) |
| 2026-05-30 | 2026-05-25 | 2.0586 | 2.0586 | 10.1% | True | [0x31264bd3...](https://sepolia.etherscan.io/tx/0x31264bd38421a2854cdaf041143221c4eb11d082e8f9a05bd6b7f3aaccbc2ab3) |
| 2026-05-31 | 2026-05-26 | 1.6171 | 1.6171 | 10.1% | True | [0x63a8713f...](https://sepolia.etherscan.io/tx/0x63a8713f10e04c3955c3f96e1bf351c392f9dfc4ed60e40c06449c3ab9773950) |
| 2026-06-01 | 2026-05-27 | 2.0501 | 2.0501 | 10.1% | True | [0x1d049603...](https://sepolia.etherscan.io/tx/0x1d0496030549708042d8d97a40514ab5c419ce7c5aa170ca79edea73b9c03951) |

## Scope note

- This is a continuous prototype-stage oracle experiment on Sepolia.
- It demonstrates recurring real-data ingestion and on-chain publication, not production oracle finality.
