# AUDIT READINESS

## Current state

Contracts are deployed and source-verified on Ethereum Sepolia. This document is the audit-facing protocol context package.

## Contract inventory

| Contract | Lines | Purpose |
|---|---|---|
| `contracts/SolarPunkCoin.sol` | ~820 | Energy-backed stablecoin: mint/redeem, PI peg control, reserve, oracle, bond-gated roles |
| `contracts/SolarPunkOption.sol` | ~545 | Margin clearinghouse: options series, mark-to-market PnL, liquidation, settlement |
| `contracts/ProtocolTreasury.sol` | ~319 | Fee vault: budget routing (4 buckets), bond escrow with cooldown and slash |
| `contracts/MockUSDC.sol` | — | Test collateral token — not in audit scope |

## Live deployment (Sepolia)

| Contract | Verified address |
|---|---|
| ProtocolTreasury | [`0x138e793f095a33D2790349eC1066FED3A756dd2c`](https://sepolia.etherscan.io/address/0x138e793f095a33D2790349eC1066FED3A756dd2c#code) |
| SolarPunkCoin | [`0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F`](https://sepolia.etherscan.io/address/0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F#code) |
| SolarPunkOption | [`0xe40A88398b5f90D038f7A6F1f122112DCD9e4104`](https://sepolia.etherscan.io/address/0xe40A88398b5f90D038f7A6F1f122112DCD9e4104#code) |

## Canonical audit packet

- [`docs/project/ROLE_PERMISSION_MATRIX.md`](./docs/project/ROLE_PERMISSION_MATRIX.md)
- [`docs/project/INVARIANT_CHECKLIST.md`](./docs/project/INVARIANT_CHECKLIST.md)
- [`docs/project/AUDITOR_HANDOFF_CHECKLIST.md`](./docs/project/AUDITOR_HANDOFF_CHECKLIST.md)
- [`THREAT_MODEL.md`](./THREAT_MODEL.md)
- [`TRUST_ASSUMPTIONS.md`](./TRUST_ASSUMPTIONS.md)

## Key mechanism notes for auditors

### SolarPunkCoin — PI controller
- Control signal scaled by `totalSupply()` — proportional to market size
- Fee split: `stabilityFeeShare` (default 50%) of mint fee routes to stability pool, remainder to treasury
- Stability pool balance is the fuel for the burn path — if pool is empty, controller cannot reduce supply
- `energyPricePerKwh` oracle determines SPK-per-kWh conversion rate (default $1.00, updatable by ORACLE_ROLE)

### SolarPunkCoin — admin authority
- `handoffAdmin()` atomically transfers `Ownable` ownership AND `DEFAULT_ADMIN_ROLE` together
- Prevents owner/admin split that would leave governance incoherent after a handoff

### SolarPunkOption — settlement
- `settle(bytes32 seriesId)` is the only exit path after expiry
- `modifyPosition` reverts with `SeriesExpired` once `block.timestamp >= series.expiry`
- Settlement marks PnL to final posted index then returns all remaining margin to caller

### Governance timelock
- All three contracts share the same `onlyGovernanceApproved` modifier pattern
- When `governanceDelay > 0`, privileged parameter changes must be queued then executed after delay
- Default at testnet deploy: delay = 0 (no timelock). Production deploy should set non-zero delay.

## Key trust assumptions

See [`TRUST_ASSUMPTIONS.md`](./TRUST_ASSUMPTIONS.md) for full list. Summary:
1. Role operators (admin/oracle/minter/liquidator) act honestly
2. Oracle data is timely and accurate enough for current stage
3. No claim of full decentralization at this stage

## Key invariants

See [`docs/project/INVARIANT_CHECKLIST.md`](./docs/project/INVARIANT_CHECKLIST.md).

## Roles and permissions

See [`docs/project/ROLE_PERMISSION_MATRIX.md`](./docs/project/ROLE_PERMISSION_MATRIX.md).

## Known gaps before audit start

1. Governance delay currently 0 — set non-zero before audit scope freeze
2. Bond requirements currently 0 — configure realistic minimums before audit scope freeze
3. Stability pool is `address(this)` at deploy — should point to a dedicated address in production
4. No multisig on admin roles — single EOA deployer; must be hardened before mainnet

## Suggested audit firms

- **Code4rena** — public contest, broad community coverage, good for finding edge cases
- **Sherlock** — structured audit with coverage guarantees
- **Spearbit / private** — higher cost, deeper review for complex mechanism logic

## Scope freeze checklist

- [ ] Set `governanceDelay` to at least 24h on all three contracts
- [ ] Set non-zero `minMinterBond` and `minOracleBond` in SolarPunkCoin
- [ ] Set non-zero `minOracleBond` and `minLiquidatorBond` in SolarPunkOption
- [ ] Point `stabilityPool` to a dedicated address, not `address(this)`
- [ ] Transfer admin to a multisig (use `handoffAdmin()` in SolarPunkCoin)
- [ ] Commit and tag the audit scope hash
