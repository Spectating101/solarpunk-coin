# AUDIT READINESS

## Scope

This document summarizes audit-facing protocol context for current contracts.

## Contract inventory

| Contract | Purpose |
|---|---|
| `contracts/SolarPunkCoin.sol` | energy-backed mint/redeem and reserve controls |
| `contracts/SolarPunkOption.sol` | margin, liquidation, and trading-fee clearing logic |
| `contracts/ProtocolTreasury.sol` | fee routing, budget disbursement, and bond escrow |
| `contracts/MockUSDC.sol` | local/test collateral token |

## Canonical audit packet

- [`docs/project/ROLE_PERMISSION_MATRIX.md`](./docs/project/ROLE_PERMISSION_MATRIX.md)
- [`docs/project/INVARIANT_CHECKLIST.md`](./docs/project/INVARIANT_CHECKLIST.md)
- [`docs/project/AUDITOR_HANDOFF_CHECKLIST.md`](./docs/project/AUDITOR_HANDOFF_CHECKLIST.md)
- [`THREAT_MODEL.md`](./THREAT_MODEL.md)
- [`TRUST_ASSUMPTIONS.md`](./TRUST_ASSUMPTIONS.md)

## Key trust assumptions

Detailed list: [`TRUST_ASSUMPTIONS.md`](./TRUST_ASSUMPTIONS.md)

## Key invariants
See [`docs/project/INVARIANT_CHECKLIST.md`](./docs/project/INVARIANT_CHECKLIST.md).

## Roles and permissions (high-level)
See [`docs/project/ROLE_PERMISSION_MATRIX.md`](./docs/project/ROLE_PERMISSION_MATRIX.md).

## Liquidation rules

- position health checked against maintenance margin
- when unhealthy, penalty is applied and routed to insurance/treasury fund
- remaining margin is returned as defined by contract logic

## Treasury flow

- inflows: mint fees, redeem fees, trading fees, liquidation penalties, bond slashes
- outflows: reserve, insurance, ops, audit budget buckets

## Known attack-surface categories

Detailed list: [`THREAT_MODEL.md`](./THREAT_MODEL.md)

## Deployment assumptions

- non-mainnet deployment target currently: Polygon Amoy
- no mainnet expansion before audit completion and deployment evidence pass
- receipt publication and on-chain confirmation are required for external claims

## Current gap to external audit start

1. Public Amoy proof publish (addresses + interaction report)
2. Auditor shortlist and scoping call
3. Final scope freeze commit hash
