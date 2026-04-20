# TRUST ASSUMPTIONS

## Purpose

Make explicit what must be trusted today for the protocol to behave as intended. An auditor or external reviewer should be able to read this and know exactly where the trust boundaries sit.

## Current assumptions

### 1. Role operators act honestly
Admin, oracle, minter, liquidator, and slasher roles are trusted not to abuse their privileged paths. At testnet stage, the deployer EOA holds all roles. Production requires multisig + timelock.

### 2. Oracle data quality is sufficient
`updateOraclePriceAndAdjust` and `updateEnergyPrice` accept values posted by the ORACLE_ROLE holder. The contract does not verify these values against an on-chain price feed. Incorrect or manipulated oracle inputs directly affect:
- PI controller supply adjustments
- SPK mint amounts per kWh (`energyPricePerKwh`)
- Grid stress triggering

Mitigation path: off-chain monitoring + bond-gated oracle roles with slashable stake.

### 3. Settlement index is trusted
`SolarPunkOption.updateIndex` sets the mark-to-market and final settlement value for all open positions. The oracle is trusted to post an accurate expiry settlement price before holders call `settle()`. There is no on-chain dispute mechanism.

### 4. Off-chain ops follow policy
Deployment evidence, receipt publication, and budget vault configuration are performed correctly. On-chain state reflects the intended configuration.

### 5. Pilot phase is controlled
Early usage is expected to be low-volume and constrained. The protocol is not designed for adversarial high-volume usage without a completed audit.

### 6. No claim of full decentralization
Governance and control surfaces are centralized (single EOA) at testnet stage. Decentralization is a future milestone, not a current property.

## Assumptions to reduce before mainnet

| Assumption | Reduction path |
|---|---|
| Single EOA admin | Transfer to multisig via `handoffAdmin()` and role grants |
| Zero governance delay | Set `governanceDelay ≥ 86400` (24h) on all contracts |
| Unverified oracle inputs | Add on-chain oracle aggregation (Chainlink or median-weighted feed) |
| Zero bond requirements | Set `minMinterBond`, `minOracleBond`, `minLiquidatorBond` to non-zero values |
| No audit | Complete external security audit and resolve findings |
| Stability pool = address(this) | Point to a dedicated contract with access controls |
