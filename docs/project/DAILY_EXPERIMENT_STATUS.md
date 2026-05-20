# Daily Experiment Status

Continuous Sepolia proof surface for the NASA POWER -> SolarPunk oracle experiment.

- generated_at: `2026-05-20T04:57:30.770927+00:00`
- network: `sepolia`
- total_successful_runs: `24`
- first_successful_run: `2026-04-20`
- last_successful_run: `2026-05-20`
- current_success_streak_days: `22`
- max_missing_gap_days: `7`

## What this proves

- The protocol can ingest real public irradiance data on a recurring schedule.
- The data can be transformed into a market-linked index and written on-chain.
- Each run leaves a public transaction trail and a committed repo artifact.

## Latest run

- date: `2026-05-20`
- NASA observation date: `2026-05-15`
- location: `Taoyuan, Taiwan`
- normalised index: `0.7912`
- on-chain option index: `0.7912`
- reserve ratio: `10.1%`
- peg stable: `True`
- cumulative surplus kWh: `30000`
- updateIndex tx: https://sepolia.etherscan.io/tx/0x9ab6d03975905ef366f2c99f21380523474c721d443e58708f49835151814f9f
- updateEnergyPrice tx: https://sepolia.etherscan.io/tx/0x9196685f33475e8b09190f3aee752c2ef24cf3697636746671485c53f31ab32d
- updateOraclePriceAndAdjust tx: https://sepolia.etherscan.io/tx/0x518b1d616372ca5cac5f34b5a511607365b4eee0fd563d54e9b3953af20f0752

## Aggregate summary

- peg stable rate: `100.0%`
- normalised index min/max/avg: `0.2393` / `1.7159` / `0.9146`
- reserve ratio min/max/avg: `10.1%` / `10.1%` / `10.1%`

## Recent runs

| Date | NASA Date | Normalised Index | Option Index | Reserve Ratio | Peg Stable | updateIndex tx |
|---|---|---:|---:|---:|---|---|
| 2026-05-07 | 2026-05-02 | 1.2587 | 1.2587 | 10.1% | True | [0xf162e794...](https://sepolia.etherscan.io/tx/0xf162e7940b0ba611c42667bba120b72d0c565d4c9256f06f2cf78fce52ddf7b3) |
| 2026-05-08 | 2026-05-03 | 1.3180 | 1.3180 | 10.1% | True | [0xedc02df7...](https://sepolia.etherscan.io/tx/0xedc02df779d2286042853c38e57ccd08df0877d78a3fb245fb18d9ea3ab595ac) |
| 2026-05-09 | 2026-05-04 | 0.5326 | 0.5326 | 10.1% | True | [0x886c93e4...](https://sepolia.etherscan.io/tx/0x886c93e456336549205a8c6715021956d904591bebd3519ae091a1cc54cf12d9) |
| 2026-05-10 | 2026-05-05 | 0.2393 | 0.2393 | 10.1% | True | [0x9a4bd637...](https://sepolia.etherscan.io/tx/0x9a4bd637a166feef22a71d140bd43a73980ca044facbcce6549ba62d70641792) |
| 2026-05-11 | 2026-05-06 | 1.3710 | 1.3710 | 10.1% | True | [0x15ccf69f...](https://sepolia.etherscan.io/tx/0x15ccf69f7127d503e407bbc02dd9d640bd5fb17c1ac6630066b9e95d319b3f3c) |
| 2026-05-12 | 2026-05-07 | 1.5926 | 1.5926 | 10.1% | True | [0x80f65219...](https://sepolia.etherscan.io/tx/0x80f65219a50abdf98e1111354c2c7e6001623162edc26b9d9b39d7800bb80190) |
| 2026-05-13 | 2026-05-08 | 0.9067 | 0.9067 | 10.1% | True | [0xf65ef5ea...](https://sepolia.etherscan.io/tx/0xf65ef5eab1261e568715260dc112e96eaed3907f4b058af93e7c1c0b29e8c7e7) |
| 2026-05-14 | 2026-05-09 | 0.5979 | 0.5979 | 10.1% | True | [0x20162f08...](https://sepolia.etherscan.io/tx/0x20162f08923cddf07e3455ce3eeecfd69ca4bcd7baeead84e6e2b1e4fe6cf856) |
| 2026-05-15 | 2026-05-10 | 0.6519 | 0.6519 | 10.1% | True | [0x8b39e789...](https://sepolia.etherscan.io/tx/0x8b39e789e5d3444e48ebcd24008cdd31cc4453c482bc66e155503a4df309083b) |
| 2026-05-16 | 2026-05-11 | 0.9358 | 0.9358 | 10.1% | True | [0xcb92e9b6...](https://sepolia.etherscan.io/tx/0xcb92e9b6583c5831b6d5148442d8b821d062475bed74f16ff5daf0bcb6689be8) |
| 2026-05-17 | 2026-05-12 | 1.1383 | 1.1383 | 10.1% | True | [0x1a8a0d8c...](https://sepolia.etherscan.io/tx/0x1a8a0d8cfc39c18402c3624522b13210aa86058e62926ae32beb078f15af01a0) |
| 2026-05-18 | 2026-05-13 | 0.3766 | 0.3766 | 10.1% | True | [0x6e4bae6a...](https://sepolia.etherscan.io/tx/0x6e4bae6aee946d06c77e70d48e4a45a597a50c63bd03ef9424146dc80d9303c4) |
| 2026-05-19 | 2026-05-14 | 0.3843 | 0.3843 | 10.1% | True | [0x34e4e8df...](https://sepolia.etherscan.io/tx/0x34e4e8dff888c290624a318178c8d4312fbcf85f13cd51d8266ad8e53dd4882e) |
| 2026-05-20 | 2026-05-15 | 0.7912 | 0.7912 | 10.1% | True | [0x9ab6d039...](https://sepolia.etherscan.io/tx/0x9ab6d03975905ef366f2c99f21380523474c721d443e58708f49835151814f9f) |

## Scope note

- This is a continuous prototype-stage oracle experiment on Sepolia.
- It demonstrates recurring real-data ingestion and on-chain publication, not production oracle finality.
