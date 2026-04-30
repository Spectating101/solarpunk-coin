# Daily Experiment Status

Continuous Sepolia proof surface for the NASA POWER -> SolarPunk oracle experiment.

- generated_at: `2026-04-30T04:26:37.082568+00:00`
- network: `sepolia`
- total_successful_runs: `4`
- first_successful_run: `2026-04-20`
- last_successful_run: `2026-04-30`
- current_success_streak_days: `2`
- max_missing_gap_days: `7`

## What this proves

- The protocol can ingest real public irradiance data on a recurring schedule.
- The data can be transformed into a market-linked index and written on-chain.
- Each run leaves a public transaction trail and a committed repo artifact.

## Latest run

- date: `2026-04-30`
- NASA observation date: `2026-04-25`
- location: `Taoyuan, Taiwan`
- normalised index: `0.2500`
- on-chain option index: `0.2500`
- reserve ratio: `10.1%`
- peg stable: `True`
- cumulative surplus kWh: `30000`
- updateIndex tx: https://sepolia.etherscan.io/tx/0x24ed9bae4fd669531434744180f29e30ba572bc844a29cc2af2e27a407411659
- updateEnergyPrice tx: https://sepolia.etherscan.io/tx/0xeb42fc298a30aa2eae0ba2faf536d84710800c525bfbecc6a7ae9049ec4e138f
- updateOraclePriceAndAdjust tx: https://sepolia.etherscan.io/tx/0x0a2f2622e1bc0deaefdf0fc17961b749715b919f3d944f199a3dff8fadd2e14e

## Aggregate summary

- peg stable rate: `100.0%`
- normalised index min/max/avg: `0.2467` / `1.4538` / `0.8511`
- reserve ratio min/max/avg: `10.1%` / `10.1%` / `10.1%`

## Recent runs

| Date | NASA Date | Normalised Index | Option Index | Reserve Ratio | Peg Stable | updateIndex tx |
|---|---|---:|---:|---:|---|---|
| 2026-04-20 | 2026-04-15 | 1.4538 | 1.4538 | 10.1% | True | [0xb5e9a2fd...](https://sepolia.etherscan.io/tx/0xb5e9a2fde6e5a96e8b503eb25085a2f34d9ae6f91a4fe5de6c026a82fdc4c018) |
| 2026-04-21 | 2026-04-15 | 1.4538 | 1.4538 | 10.1% | True | [0xe542244f...](https://sepolia.etherscan.io/tx/0xe542244f0c89ecc683f7efdef577e545a6e830680392820af194f9ed4f419bda) |
| 2026-04-29 | 2026-04-24 | 0.2467 | 0.2467 | 10.1% | True | [0x615e0636...](https://sepolia.etherscan.io/tx/0x615e06362fbf46d5e02ac5b54277276f565ad13991432cbe6966d199638484ab) |
| 2026-04-30 | 2026-04-25 | 0.2500 | 0.2500 | 10.1% | True | [0x24ed9bae...](https://sepolia.etherscan.io/tx/0x24ed9bae4fd669531434744180f29e30ba572bc844a29cc2af2e27a407411659) |

## Scope note

- This is a continuous prototype-stage oracle experiment on Sepolia.
- It demonstrates recurring real-data ingestion and on-chain publication, not production oracle finality.
