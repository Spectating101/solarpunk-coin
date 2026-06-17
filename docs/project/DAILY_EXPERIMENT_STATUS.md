# Daily Experiment Status

Continuous Sepolia proof surface for the NASA POWER -> SolarPunk oracle experiment.

- generated_at: `2026-06-17T05:56:01.695247+00:00`
- network: `sepolia`
- total_successful_runs: `52`
- first_successful_run: `2026-04-20`
- last_successful_run: `2026-06-17`
- current_success_streak_days: `50`
- max_missing_gap_days: `7`

## What this proves

- The protocol can ingest real public irradiance data on a recurring schedule.
- The data can be transformed into a market-linked index and written on-chain.
- Each run leaves a public transaction trail and a committed repo artifact.

## Latest run

- date: `2026-06-17`
- NASA observation date: `2026-06-12`
- location: `Taoyuan, Taiwan`
- normalised index: `0.5441`
- on-chain option index: `0.5441`
- reserve ratio: `10.1%`
- peg stable: `True`
- cumulative surplus kWh: `30000`
- updateIndex tx: https://sepolia.etherscan.io/tx/0x0832f7dad4b875ad21e9081fcc7bf3f5bb8b3e760dc3cecf2febe1b00e36e8c2
- updateEnergyPrice tx: https://sepolia.etherscan.io/tx/0xd029398c0f04745d0103722ead892e4588911980c3172287e8ba1b49cda623c7
- updateOraclePriceAndAdjust tx: https://sepolia.etherscan.io/tx/0x450167d05a90f659025779edcbaec06448de4b3925ef599a578d8f84abbd2f27

## Aggregate summary

- peg stable rate: `100.0%`
- normalised index min/max/avg: `0.2393` / `2.0586` / `1.0861`
- reserve ratio min/max/avg: `10.1%` / `10.1%` / `10.1%`

## Recent runs

| Date | NASA Date | Normalised Index | Option Index | Reserve Ratio | Peg Stable | updateIndex tx |
|---|---|---:|---:|---:|---|---|
| 2026-06-04 | 2026-05-30 | 1.5329 | 1.5329 | 10.1% | True | [0xabe7a368...](https://sepolia.etherscan.io/tx/0xabe7a3681d603226a261716396d8c19e6db734bcd1b4e9f7ec5f3000683eb1a6) |
| 2026-06-05 | 2026-05-31 | 1.8456 | 1.8456 | 10.1% | True | [0x228ac3da...](https://sepolia.etherscan.io/tx/0x228ac3daadd40a691d5a565f6023e3f8d4c74d9a45698ce7b39081423c1a4706) |
| 2026-06-06 | 2026-06-01 | 1.5687 | 1.5687 | 10.1% | True | [0x7f973f21...](https://sepolia.etherscan.io/tx/0x7f973f216e3e38778d6e39eede9bd891d98b205b89d61d242192f2643ab8f1aa) |
| 2026-06-07 | 2026-06-02 | 1.4625 | 1.4625 | 10.1% | True | [0x15839d2b...](https://sepolia.etherscan.io/tx/0x15839d2b21ffaa646c25565f4ad6c8eacb4f94efbb20569319719e54ff0ed2b0) |
| 2026-06-08 | 2026-06-03 | 1.6097 | 1.6097 | 10.1% | True | [0x34e184e2...](https://sepolia.etherscan.io/tx/0x34e184e2d8192494a890bbe13c6fdf2f1872417d69d9979a642d3cda94a6426c) |
| 2026-06-09 | 2026-06-04 | 1.2495 | 1.2495 | 10.1% | True | [0xaf87224d...](https://sepolia.etherscan.io/tx/0xaf87224d93111904863bc0290469c47b5d40c3071c4111bc7b311c6185a5ca81) |
| 2026-06-10 | 2026-06-05 | 0.6773 | 0.6773 | 10.1% | True | [0x0c6de342...](https://sepolia.etherscan.io/tx/0x0c6de3420f891ed396b3a2d4f024983be1126619d379316a5dcbeb004be61deb) |
| 2026-06-11 | 2026-06-06 | 1.0187 | 1.0187 | 10.1% | True | [0x2af59715...](https://sepolia.etherscan.io/tx/0x2af597154cdc63f0a8cea6f9de6da7e02b3224417ba3c8230ff5942224e3241f) |
| 2026-06-12 | 2026-06-07 | 1.1145 | 1.1145 | 10.1% | True | [0xf6b7954a...](https://sepolia.etherscan.io/tx/0xf6b7954a0fd33eeeafec0ae7bd71d664b5416e01e3df8aa04595f2c395e5552a) |
| 2026-06-13 | 2026-06-08 | 0.8869 | 0.8869 | 10.1% | True | [0xae89a235...](https://sepolia.etherscan.io/tx/0xae89a2353e3ddfa89c7df314bf3f4684f44ad083fd727691cb1cf74ce52d221e) |
| 2026-06-14 | 2026-06-09 | 0.4630 | 0.4630 | 10.1% | True | [0xd0c6b31e...](https://sepolia.etherscan.io/tx/0xd0c6b31e044fc20e4358ed2250c008f78144c01e1278c5ab5535fc71a1b80c49) |
| 2026-06-15 | 2026-06-10 | 0.5240 | 0.5240 | 10.1% | True | [0xc6cce58d...](https://sepolia.etherscan.io/tx/0xc6cce58de82c0c2899c2d22d60d8b1dbc71a6bcb6b3976f4a97961f2a573ac69) |
| 2026-06-16 | 2026-06-11 | 0.4792 | 0.4792 | 10.1% | True | [0x501c5b5f...](https://sepolia.etherscan.io/tx/0x501c5b5fffa589a17eed65eeea640e3c48674309448c4160f233403ee662ef49) |
| 2026-06-17 | 2026-06-12 | 0.5441 | 0.5441 | 10.1% | True | [0x0832f7da...](https://sepolia.etherscan.io/tx/0x0832f7dad4b875ad21e9081fcc7bf3f5bb8b3e760dc3cecf2febe1b00e36e8c2) |

## Scope note

- This is a continuous prototype-stage oracle experiment on Sepolia.
- It demonstrates recurring real-data ingestion and on-chain publication, not production oracle finality.
