# Daily Experiment Status

Continuous Sepolia proof surface for the NASA POWER -> SolarPunk oracle experiment.

- generated_at: `2026-05-11T04:54:01.942270+00:00`
- network: `sepolia`
- total_successful_runs: `15`
- first_successful_run: `2026-04-20`
- last_successful_run: `2026-05-11`
- current_success_streak_days: `13`
- max_missing_gap_days: `7`

## What this proves

- The protocol can ingest real public irradiance data on a recurring schedule.
- The data can be transformed into a market-linked index and written on-chain.
- Each run leaves a public transaction trail and a committed repo artifact.

## Latest run

- date: `2026-05-11`
- NASA observation date: `2026-05-06`
- location: `Taoyuan, Taiwan`
- normalised index: `1.3710`
- on-chain option index: `1.3710`
- reserve ratio: `10.1%`
- peg stable: `True`
- cumulative surplus kWh: `30000`
- updateIndex tx: https://sepolia.etherscan.io/tx/0x15ccf69f7127d503e407bbc02dd9d640bd5fb17c1ac6630066b9e95d319b3f3c
- updateEnergyPrice tx: https://sepolia.etherscan.io/tx/0x9401005aa5c75afa36ef92e66ed0f393dcd0a4c393052c0a47e993910f868634
- updateOraclePriceAndAdjust tx: https://sepolia.etherscan.io/tx/0x77e13e9c6843c651185420ec4db2344f899ea9b66fb601554ed10e91dbdd594f

## Aggregate summary

- peg stable rate: `100.0%`
- normalised index min/max/avg: `0.2393` / `1.7159` / `0.9716`
- reserve ratio min/max/avg: `10.1%` / `10.1%` / `10.1%`

## Recent runs

| Date | NASA Date | Normalised Index | Option Index | Reserve Ratio | Peg Stable | updateIndex tx |
|---|---|---:|---:|---:|---|---|
| 2026-04-21 | 2026-04-15 | 1.4538 | 1.4538 | 10.1% | True | [0xe542244f...](https://sepolia.etherscan.io/tx/0xe542244f0c89ecc683f7efdef577e545a6e830680392820af194f9ed4f419bda) |
| 2026-04-29 | 2026-04-24 | 0.2467 | 0.2467 | 10.1% | True | [0x615e0636...](https://sepolia.etherscan.io/tx/0x615e06362fbf46d5e02ac5b54277276f565ad13991432cbe6966d199638484ab) |
| 2026-04-30 | 2026-04-25 | 0.2500 | 0.2500 | 10.1% | True | [0x24ed9bae...](https://sepolia.etherscan.io/tx/0x24ed9bae4fd669531434744180f29e30ba572bc844a29cc2af2e27a407411659) |
| 2026-05-01 | 2026-04-26 | 1.7159 | 1.7159 | 10.1% | True | [0xb5138225...](https://sepolia.etherscan.io/tx/0xb5138225189731a1278992d3113d665a42490a05e22fec5e149341d4095248a6) |
| 2026-05-02 | 2026-04-26 | 1.7159 | 1.7159 | 10.1% | True | [0x0d0f445c...](https://sepolia.etherscan.io/tx/0x0d0f445c1515ad6ac1d137b13994917678c0b5a672ba511665f27b2eabe4a7f3) |
| 2026-05-03 | 2026-04-28 | 1.4692 | 1.4692 | 10.1% | True | [0x76e63d6c...](https://sepolia.etherscan.io/tx/0x76e63d6ceb55c44b466cd5b48916196b0a8b7c5b5ff545e54cb762c09d9a4515) |
| 2026-05-04 | 2026-04-29 | 0.4741 | 0.4741 | 10.1% | True | [0x09865f79...](https://sepolia.etherscan.io/tx/0x09865f791a8d52d557a7e4dee404e6e628551d56e28b4ea22d117ac4f8a1ec86) |
| 2026-05-05 | 2026-04-30 | 0.3715 | 0.3715 | 10.1% | True | [0xb616c3c4...](https://sepolia.etherscan.io/tx/0xb616c3c4b4eec4f078d8665f6fe46ed7821d2cb136408f61d687371c043aeb4d) |
| 2026-05-06 | 2026-05-01 | 0.7038 | 0.7038 | 10.1% | True | [0xe90e2784...](https://sepolia.etherscan.io/tx/0xe90e2784b7f9ef5f841538b7847e8cfc592e1a32be3dc6ded11191db71d41965) |
| 2026-05-07 | 2026-05-02 | 1.2587 | 1.2587 | 10.1% | True | [0xf162e794...](https://sepolia.etherscan.io/tx/0xf162e7940b0ba611c42667bba120b72d0c565d4c9256f06f2cf78fce52ddf7b3) |
| 2026-05-08 | 2026-05-03 | 1.3180 | 1.3180 | 10.1% | True | [0xedc02df7...](https://sepolia.etherscan.io/tx/0xedc02df779d2286042853c38e57ccd08df0877d78a3fb245fb18d9ea3ab595ac) |
| 2026-05-09 | 2026-05-04 | 0.5326 | 0.5326 | 10.1% | True | [0x886c93e4...](https://sepolia.etherscan.io/tx/0x886c93e456336549205a8c6715021956d904591bebd3519ae091a1cc54cf12d9) |
| 2026-05-10 | 2026-05-05 | 0.2393 | 0.2393 | 10.1% | True | [0x9a4bd637...](https://sepolia.etherscan.io/tx/0x9a4bd637a166feef22a71d140bd43a73980ca044facbcce6549ba62d70641792) |
| 2026-05-11 | 2026-05-06 | 1.3710 | 1.3710 | 10.1% | True | [0x15ccf69f...](https://sepolia.etherscan.io/tx/0x15ccf69f7127d503e407bbc02dd9d640bd5fb17c1ac6630066b9e95d319b3f3c) |

## Scope note

- This is a continuous prototype-stage oracle experiment on Sepolia.
- It demonstrates recurring real-data ingestion and on-chain publication, not production oracle finality.
