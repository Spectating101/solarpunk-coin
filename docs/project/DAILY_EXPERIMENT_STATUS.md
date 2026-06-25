# Daily Experiment Status

Continuous Sepolia proof surface for the NASA POWER -> SolarPunk oracle experiment.

- generated_at: `2026-06-25T04:56:01.385594+00:00`
- network: `sepolia`
- total_successful_runs: `60`
- first_successful_run: `2026-04-20`
- last_successful_run: `2026-06-25`
- current_success_streak_days: `58`
- max_missing_gap_days: `7`

## What this proves

- The protocol can ingest real public irradiance data on a recurring schedule.
- The data can be transformed into a market-linked index and written on-chain.
- Each run leaves a public transaction trail and a committed repo artifact.

## Latest run

- date: `2026-06-25`
- NASA observation date: `2026-06-19`
- location: `Taoyuan, Taiwan`
- normalised index: `1.8590`
- on-chain option index: `1.8590`
- reserve ratio: `10.1%`
- peg stable: `True`
- cumulative surplus kWh: `30000`
- updateIndex tx: https://sepolia.etherscan.io/tx/0x1df3ac28a9a3bdb73bc36a59bc03b4955e47f7453dc9dfbb536e24745cb084bb
- updateEnergyPrice tx: https://sepolia.etherscan.io/tx/0x896bd551310afa24005e9a2afd70f26d6299a73005262aea6fb69b05528ae751
- updateOraclePriceAndAdjust tx: https://sepolia.etherscan.io/tx/0x5b1591559088c2d5cb75393a0e809c3f40570f51c13ead02ce59eb09efc8d495

## Aggregate summary

- peg stable rate: `100.0%`
- normalised index min/max/avg: `0.2393` / `2.0586` / `1.0427`
- reserve ratio min/max/avg: `10.1%` / `10.1%` / `10.1%`

## Recent runs

| Date | NASA Date | Normalised Index | Option Index | Reserve Ratio | Peg Stable | updateIndex tx |
|---|---|---:|---:|---:|---|---|
| 2026-06-12 | 2026-06-07 | 1.1145 | 1.1145 | 10.1% | True | [0xf6b7954a...](https://sepolia.etherscan.io/tx/0xf6b7954a0fd33eeeafec0ae7bd71d664b5416e01e3df8aa04595f2c395e5552a) |
| 2026-06-13 | 2026-06-08 | 0.8869 | 0.8869 | 10.1% | True | [0xae89a235...](https://sepolia.etherscan.io/tx/0xae89a2353e3ddfa89c7df314bf3f4684f44ad083fd727691cb1cf74ce52d221e) |
| 2026-06-14 | 2026-06-09 | 0.4630 | 0.4630 | 10.1% | True | [0xd0c6b31e...](https://sepolia.etherscan.io/tx/0xd0c6b31e044fc20e4358ed2250c008f78144c01e1278c5ab5535fc71a1b80c49) |
| 2026-06-15 | 2026-06-10 | 0.5240 | 0.5240 | 10.1% | True | [0xc6cce58d...](https://sepolia.etherscan.io/tx/0xc6cce58de82c0c2899c2d22d60d8b1dbc71a6bcb6b3976f4a97961f2a573ac69) |
| 2026-06-16 | 2026-06-11 | 0.4792 | 0.4792 | 10.1% | True | [0x501c5b5f...](https://sepolia.etherscan.io/tx/0x501c5b5fffa589a17eed65eeea640e3c48674309448c4160f233403ee662ef49) |
| 2026-06-17 | 2026-06-12 | 0.5441 | 0.5441 | 10.1% | True | [0x0832f7da...](https://sepolia.etherscan.io/tx/0x0832f7dad4b875ad21e9081fcc7bf3f5bb8b3e760dc3cecf2febe1b00e36e8c2) |
| 2026-06-18 | 2026-06-13 | 0.7386 | 0.7386 | 10.1% | True | [0xc1a991d2...](https://sepolia.etherscan.io/tx/0xc1a991d2cb4f0d6878951c344830085f86c0e290dbf775d74a5a5d7a007c4a5c) |
| 2026-06-19 | 2026-06-14 | 0.3503 | 0.3503 | 10.1% | True | [0xe93c1127...](https://sepolia.etherscan.io/tx/0xe93c1127113b5526b379d0ced2f464bc5ca1d0fca85978700ec155b5cbabbe78) |
| 2026-06-20 | 2026-06-15 | 0.3193 | 0.3193 | 10.1% | True | [0xe9997594...](https://sepolia.etherscan.io/tx/0xe99975946a84973cf11e7bd41ae9da64abe7b827ba3df1266b244a818c1d75f7) |
| 2026-06-21 | 2026-06-15 | 0.3193 | 0.3193 | 10.1% | True | [0xf4074f9b...](https://sepolia.etherscan.io/tx/0xf4074f9b7eebb76e3f5ed3700271a35895148b632eaa54484b5f60dcb26662e8) |
| 2026-06-22 | 2026-06-15 | 0.3193 | 0.3193 | 10.1% | True | [0x48305e5f...](https://sepolia.etherscan.io/tx/0x48305e5f008f17f67657620ba7e352589821ba86a04db3b202991a9e139e5bbb) |
| 2026-06-23 | 2026-06-15 | 0.3193 | 0.3193 | 10.1% | True | [0xcbaf58dc...](https://sepolia.etherscan.io/tx/0xcbaf58dcaefcf01c92d822e08ce9b27342a6eae8e162c1858624e30873a1ab59) |
| 2026-06-24 | 2026-06-19 | 1.8590 | 1.8590 | 10.1% | True | [0xc4655cfe...](https://sepolia.etherscan.io/tx/0xc4655cfe797be188db79bfc3820aa4a206c6f96ac8baf8426436cab759ae48ec) |
| 2026-06-25 | 2026-06-19 | 1.8590 | 1.8590 | 10.1% | True | [0x1df3ac28...](https://sepolia.etherscan.io/tx/0x1df3ac28a9a3bdb73bc36a59bc03b4955e47f7453dc9dfbb536e24745cb084bb) |

## Scope note

- This is a continuous prototype-stage oracle experiment on Sepolia.
- It demonstrates recurring real-data ingestion and on-chain publication, not production oracle finality.
