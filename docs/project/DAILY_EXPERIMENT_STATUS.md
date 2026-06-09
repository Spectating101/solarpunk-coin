# Daily Experiment Status

Continuous Sepolia proof surface for the NASA POWER -> SolarPunk oracle experiment.

- generated_at: `2026-06-09T04:57:36.641937+00:00`
- network: `sepolia`
- total_successful_runs: `44`
- first_successful_run: `2026-04-20`
- last_successful_run: `2026-06-09`
- current_success_streak_days: `42`
- max_missing_gap_days: `7`

## What this proves

- The protocol can ingest real public irradiance data on a recurring schedule.
- The data can be transformed into a market-linked index and written on-chain.
- Each run leaves a public transaction trail and a committed repo artifact.

## Latest run

- date: `2026-06-09`
- NASA observation date: `2026-06-04`
- location: `Taoyuan, Taiwan`
- normalised index: `1.2495`
- on-chain option index: `1.2495`
- reserve ratio: `10.1%`
- peg stable: `True`
- cumulative surplus kWh: `30000`
- updateIndex tx: https://sepolia.etherscan.io/tx/0xaf87224d93111904863bc0290469c47b5d40c3071c4111bc7b311c6185a5ca81
- updateEnergyPrice tx: https://sepolia.etherscan.io/tx/0xecf8250dcc223c44f96eec8d0f0be7c2ffa36ebb5843db7b88ecbb31bd71be8b
- updateOraclePriceAndAdjust tx: https://sepolia.etherscan.io/tx/0xc73d8a88691c82d83f857d29f229d7d9882189a40c0ca589f0454061d99e45c1

## Aggregate summary

- peg stable rate: `100.0%`
- normalised index min/max/avg: `0.2393` / `2.0586` / `1.1538`
- reserve ratio min/max/avg: `10.1%` / `10.1%` / `10.1%`

## Recent runs

| Date | NASA Date | Normalised Index | Option Index | Reserve Ratio | Peg Stable | updateIndex tx |
|---|---|---:|---:|---:|---|---|
| 2026-05-27 | 2026-05-22 | 1.0273 | 1.0273 | 10.1% | True | [0x5bf152df...](https://sepolia.etherscan.io/tx/0x5bf152df0cdc84ade81b990faf7f14adf5976aea1ee1e53e3eccde446c3f5c96) |
| 2026-05-28 | 2026-05-23 | 1.1704 | 1.1704 | 10.1% | True | [0x9e619a7d...](https://sepolia.etherscan.io/tx/0x9e619a7dd77dce0daeaafebe8ab9b47da5eebf9fc260b3d60f6742f78b04d555) |
| 2026-05-29 | 2026-05-24 | 1.3518 | 1.3518 | 10.1% | True | [0x0269d519...](https://sepolia.etherscan.io/tx/0x0269d51998653eeb988ecc7570d8ffe2477b616c0e4493965ac60424e41721d9) |
| 2026-05-30 | 2026-05-25 | 2.0586 | 2.0586 | 10.1% | True | [0x31264bd3...](https://sepolia.etherscan.io/tx/0x31264bd38421a2854cdaf041143221c4eb11d082e8f9a05bd6b7f3aaccbc2ab3) |
| 2026-05-31 | 2026-05-26 | 1.6171 | 1.6171 | 10.1% | True | [0x63a8713f...](https://sepolia.etherscan.io/tx/0x63a8713f10e04c3955c3f96e1bf351c392f9dfc4ed60e40c06449c3ab9773950) |
| 2026-06-01 | 2026-05-27 | 2.0501 | 2.0501 | 10.1% | True | [0x1d049603...](https://sepolia.etherscan.io/tx/0x1d0496030549708042d8d97a40514ab5c419ce7c5aa170ca79edea73b9c03951) |
| 2026-06-02 | 2026-05-28 | 1.8174 | 1.8174 | 10.1% | True | [0x49535518...](https://sepolia.etherscan.io/tx/0x49535518f90a932e1d79fbdeb3491cf77b20b531e48769490daec06cfe4a706f) |
| 2026-06-03 | 2026-05-29 | 0.9688 | 0.9688 | 10.1% | True | [0x9ebd3c13...](https://sepolia.etherscan.io/tx/0x9ebd3c13a6260b0b597128d465f514d61c0ebd88822f1a6b1217985697c38af4) |
| 2026-06-04 | 2026-05-30 | 1.5329 | 1.5329 | 10.1% | True | [0xabe7a368...](https://sepolia.etherscan.io/tx/0xabe7a3681d603226a261716396d8c19e6db734bcd1b4e9f7ec5f3000683eb1a6) |
| 2026-06-05 | 2026-05-31 | 1.8456 | 1.8456 | 10.1% | True | [0x228ac3da...](https://sepolia.etherscan.io/tx/0x228ac3daadd40a691d5a565f6023e3f8d4c74d9a45698ce7b39081423c1a4706) |
| 2026-06-06 | 2026-06-01 | 1.5687 | 1.5687 | 10.1% | True | [0x7f973f21...](https://sepolia.etherscan.io/tx/0x7f973f216e3e38778d6e39eede9bd891d98b205b89d61d242192f2643ab8f1aa) |
| 2026-06-07 | 2026-06-02 | 1.4625 | 1.4625 | 10.1% | True | [0x15839d2b...](https://sepolia.etherscan.io/tx/0x15839d2b21ffaa646c25565f4ad6c8eacb4f94efbb20569319719e54ff0ed2b0) |
| 2026-06-08 | 2026-06-03 | 1.6097 | 1.6097 | 10.1% | True | [0x34e184e2...](https://sepolia.etherscan.io/tx/0x34e184e2d8192494a890bbe13c6fdf2f1872417d69d9979a642d3cda94a6426c) |
| 2026-06-09 | 2026-06-04 | 1.2495 | 1.2495 | 10.1% | True | [0xaf87224d...](https://sepolia.etherscan.io/tx/0xaf87224d93111904863bc0290469c47b5d40c3071c4111bc7b311c6185a5ca81) |

## Scope note

- This is a continuous prototype-stage oracle experiment on Sepolia.
- It demonstrates recurring real-data ingestion and on-chain publication, not production oracle finality.
