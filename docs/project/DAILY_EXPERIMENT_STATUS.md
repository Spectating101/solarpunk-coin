# Daily Experiment Status

Continuous Sepolia proof surface for the NASA POWER -> SolarPunk oracle experiment.

- generated_at: `2026-07-02T04:50:12.639603+00:00`
- network: `sepolia`
- total_successful_runs: `67`
- first_successful_run: `2026-04-20`
- last_successful_run: `2026-07-02`
- current_success_streak_days: `65`
- max_missing_gap_days: `7`

## What this proves

- The protocol can ingest real public irradiance data on a recurring schedule.
- The data can be transformed into a market-linked index and written on-chain.
- Each run leaves a public transaction trail and a committed repo artifact.

## Latest run

- date: `2026-07-02`
- NASA observation date: `2026-06-27`
- location: `Taoyuan, Taiwan`
- normalised index: `0.8033`
- on-chain option index: `0.8033`
- reserve ratio: `10.1%`
- peg stable: `True`
- cumulative surplus kWh: `30000`
- updateIndex tx: https://sepolia.etherscan.io/tx/0x5b03250bf77045781cda6892268f94aacffc703fa09e0bb7021ad57c200a3b38
- updateEnergyPrice tx: https://sepolia.etherscan.io/tx/0x797c34829a441a29846499b3c1ab0acd25dc10dcf20d887ee296aa23c7276304
- updateOraclePriceAndAdjust tx: https://sepolia.etherscan.io/tx/0x54e6cbc7eab3b2aeb0ead5561343a19e42652a56c4e6898dcf9068b9c04a5bc9

## Aggregate summary

- peg stable rate: `100.0%`
- normalised index min/max/avg: `0.2393` / `2.0586` / `1.0685`
- reserve ratio min/max/avg: `10.1%` / `10.1%` / `10.1%`

## Recent runs

| Date | NASA Date | Normalised Index | Option Index | Reserve Ratio | Peg Stable | updateIndex tx |
|---|---|---:|---:|---:|---|---|
| 2026-06-19 | 2026-06-14 | 0.3503 | 0.3503 | 10.1% | True | [0xe93c1127...](https://sepolia.etherscan.io/tx/0xe93c1127113b5526b379d0ced2f464bc5ca1d0fca85978700ec155b5cbabbe78) |
| 2026-06-20 | 2026-06-15 | 0.3193 | 0.3193 | 10.1% | True | [0xe9997594...](https://sepolia.etherscan.io/tx/0xe99975946a84973cf11e7bd41ae9da64abe7b827ba3df1266b244a818c1d75f7) |
| 2026-06-21 | 2026-06-15 | 0.3193 | 0.3193 | 10.1% | True | [0xf4074f9b...](https://sepolia.etherscan.io/tx/0xf4074f9b7eebb76e3f5ed3700271a35895148b632eaa54484b5f60dcb26662e8) |
| 2026-06-22 | 2026-06-15 | 0.3193 | 0.3193 | 10.1% | True | [0x48305e5f...](https://sepolia.etherscan.io/tx/0x48305e5f008f17f67657620ba7e352589821ba86a04db3b202991a9e139e5bbb) |
| 2026-06-23 | 2026-06-15 | 0.3193 | 0.3193 | 10.1% | True | [0xcbaf58dc...](https://sepolia.etherscan.io/tx/0xcbaf58dcaefcf01c92d822e08ce9b27342a6eae8e162c1858624e30873a1ab59) |
| 2026-06-24 | 2026-06-19 | 1.8590 | 1.8590 | 10.1% | True | [0xc4655cfe...](https://sepolia.etherscan.io/tx/0xc4655cfe797be188db79bfc3820aa4a206c6f96ac8baf8426436cab759ae48ec) |
| 2026-06-25 | 2026-06-19 | 1.8590 | 1.8590 | 10.1% | True | [0x1df3ac28...](https://sepolia.etherscan.io/tx/0x1df3ac28a9a3bdb73bc36a59bc03b4955e47f7453dc9dfbb536e24745cb084bb) |
| 2026-06-26 | 2026-06-20 | 1.9196 | 1.9196 | 10.1% | True | [0x959710cd...](https://sepolia.etherscan.io/tx/0x959710cdd893f8077ea80d276b4c78f4af23fba0efcce3720366a5e7880b1604) |
| 2026-06-27 | 2026-06-22 | 1.7997 | 1.7997 | 10.1% | True | [0x3fb80337...](https://sepolia.etherscan.io/tx/0x3fb803377bc6dc678da68926ce680085be176727c5314cab02bb619fcbbe6d41) |
| 2026-06-28 | 2026-06-23 | 1.7732 | 1.7732 | 10.1% | True | [0xeafdf8d2...](https://sepolia.etherscan.io/tx/0xeafdf8d2dd3b5c1491d78a04f830a20e934f2a78a9d00c764a45afd0556ab8a5) |
| 2026-06-29 | 2026-06-24 | 1.7981 | 1.7981 | 10.1% | True | [0x2ad3d105...](https://sepolia.etherscan.io/tx/0x2ad3d105bb54e5bcd45f45dd3993c57d4b3f594fb0d0ca3b292dd87befb7380e) |
| 2026-06-30 | 2026-06-25 | 0.4208 | 0.4208 | 10.1% | True | [0x838eed86...](https://sepolia.etherscan.io/tx/0x838eed86d47382977cc97f163122795e693a9c38967ad0bf69e0d6cfc99ac5ec) |
| 2026-07-01 | 2026-06-26 | 0.5147 | 0.5147 | 10.1% | True | [0x69bfe372...](https://sepolia.etherscan.io/tx/0x69bfe37231e0d50a4d4e12b5aeb038171afc4565e13be28d8fac1b5f748c58f9) |
| 2026-07-02 | 2026-06-27 | 0.8033 | 0.8033 | 10.1% | True | [0x5b03250b...](https://sepolia.etherscan.io/tx/0x5b03250bf77045781cda6892268f94aacffc703fa09e0bb7021ad57c200a3b38) |

## Scope note

- This is a continuous prototype-stage oracle experiment on Sepolia.
- It demonstrates recurring real-data ingestion and on-chain publication, not production oracle finality.
