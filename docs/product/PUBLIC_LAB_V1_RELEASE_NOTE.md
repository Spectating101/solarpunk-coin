# SolarPunk Public Lab v1.0 Release Note

**Tag:** `public-lab-v1.0`  
**Date:** 2026-07-02

SolarPunk Public Lab v1.0 packages the project as a **public Sepolia testnet laboratory for energy-standard settlement**.

## What v1.0 demonstrates

- Verified renewable-surplus evidence path (attestation pipeline + lab fixtures)
- Bounded SPK issuance on Sepolia
- Network payment circulation and indexed ledger
- Public evidence export and reproducible commands
- Explicit launch gates (public lab shipped; closed pilot and mainnet blocked)

## What v1.0 does not claim

- Mainnet readiness
- Token sale or ICO
- Stablecoin or live dollar peg
- Legal tender
- Delivered-energy redemption rights
- Production governance or formal audit
- Revenue-grade meter finality

## Public evidence snapshot

*From `state/runtime/spk_v1.json` at packaging time. Sync was **not** refreshed during this release — public RPC returned 403/archive-token errors. Run `npm run foundation:sync` locally with a working `SEPOLIA_RPC` before citing live chain state.*

| Metric | Value |
|--------|--------|
| SPK | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| Currency system | `0x520162252F9B94824417678525FFd69145014970` |
| Supply | ~5,499 SPK |
| Settled | ~442 SPK |
| Network payments | 21 |
| Peg | Off |
| Tests | 109 passing |
| Last indexed sync | 2026-06-10 |

## Canonical docs

- [`PUBLIC_LAB_V1.md`](./PUBLIC_LAB_V1.md)
- [`CURRENT_STATUS.md`](../../CURRENT_STATUS.md)
- [`thesis_package/SPK_V1_EVIDENCE.md`](../../thesis_package/SPK_V1_EVIDENCE.md)

## Future work

Closed pilot with real operator meter/inverter data — see [`PILOT_DATA_ASK.md`](./PILOT_DATA_ASK.md).
