# SolarPunk Pilot Reviewer Packet

## One-Line Claim

SolarPunk is an energy-standard cryptocurrency lab: signed renewable-energy surplus can mint SPK, move through settlement, and be stress-tested against energy-delivery shortfalls.

## What To Verify First

| Claim | Artifact |
|---|---|
| Public attested SPK mint exists | `docs/product/SPK_ATTESTED_MINT_PROOF.md` |
| Sepolia readback confirms consumed hashes | `docs/product/SPK_PUBLIC_READBACK.md` |
| CSV bridge converts meter export into mint preview | `docs/product/PILOT_CSV_RECEIPT.md` |
| Local field loop mints, settles, redeems, and resolves delivery | `docs/product/FIELD_RECEIPT_LOOP.md` |
| Energy-money simulation models the currency system | `docs/product/ENERGY_MONEY_SIMULATION.md` |
| Monetary stress harness exposes shortfall reserve needs | `docs/product/MONETARY_STRESS_HARNESS.md` |
| Energy-standard economics defines the kWh/SPK basis | `docs/product/ENERGY_STANDARD_ECONOMICS.md` |
| Governed pilot stack deploy script executes locally | `docs/project/PILOT_STACK_DEPLOYMENT.md` |

## Current Strongest Evidence

- Public Sepolia mint tx: `0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d`.
- Public proof mint: `2,606` on-chain kWh -> `130.1697 SPK`.
- Pilot CSV sample: `1,985.5 kWh` accepted surplus -> `99.15075 SPK` mint preview.
- Energy-money simulation: `15,216.476344 SPK` annualized issuance projection across transparent rooftop/neighborhood/commercial archetypes.
- Field receipt loop: `130.1697 SPK` minted, `75 SPK` settled, `20 SPK` redeemed, `400 kWh` delivered.
- Monetary stress harness: all conservation checks pass; shortfall cases show explicit extra reserve requirements instead of assuming money can be printed through physical delivery gaps.

## What Is Still Blocked

- No certified hardware-meter custody yet.
- No formal smart-contract audit yet.
- No production-governed Sepolia redeploy of the full pilot stack yet.
- No real counterparty pilot yet.
- No mainnet or paid-use claim.

## Review Command Set

```bash
npm run product:pilot-csv
npm run product:energy-money-sim
npm run product:monetary-stress
npm run pilot-stack:test
npm run product:field-receipt
npm test
```

For the frontend proof dashboard:

```bash
cd frontend
npm test -- --run
npm run build
```

## Reviewer Interpretation

The system is no longer just a thesis narrative or isolated Solidity demo. It has a reproducible proof spine: meter data -> attestation -> mint -> settlement/redemption -> stress controls. The missing step is external pilot evidence, not internal mechanism coherence.
