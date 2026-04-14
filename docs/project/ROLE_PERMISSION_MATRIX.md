# Role and Permission Matrix

## Scope

This matrix is the audit-facing summary of privileged operations in current contracts.

## SolarPunkCoin (`contracts/SolarPunkCoin.sol`)

| Role / authority | Critical operations | Risk note |
|---|---|---|
| `owner` | `setTreasury`, `setBondSource`, `setBondRequirements`, `updateControlParameters`, `updateFees`, `updateReserveParameters`, `unpause` | Policy and economic controls |
| `MINTER_ROLE` | `mintFromSurplus` | Supply expansion path (bond-gated if configured) |
| `ORACLE_ROLE` | `updateOraclePriceAndAdjust`, `setGridStressed` | Price/safety control path (bond-gated if configured) |
| `RESERVE_MANAGER_ROLE` | `withdrawReserve` | Reserve outflow authority |
| `STABILIZER_ROLE` | `disburseStabilityPool` | Peg inventory release path |
| `PAUSER_ROLE` | `pause` | Emergency halt authority |

## SolarPunkOption (`contracts/SolarPunkOption.sol`)

| Role / authority | Critical operations | Risk note |
|---|---|---|
| `DEFAULT_ADMIN_ROLE` | `createSeries`, `setInsuranceFund`, `setBondSource`, `setMarginParams`, `setTradingFeeBps`, `setBondRequirements` | Core market-policy controls |
| `ORACLE_ROLE` | `updateIndex` | Index update authority (bond-gated if configured) |
| `LIQUIDATOR_ROLE` | `liquidate` | Forced close authority (bond-gated if configured) |
| `PAUSER_ROLE` | `pause`, `unpause` | Trading-path halt authority |

## ProtocolTreasury (`contracts/ProtocolTreasury.sol`)

| Role / authority | Critical operations | Risk note |
|---|---|---|
| `DEFAULT_ADMIN_ROLE` | `setBudgetPolicy`, `setBudgetVaults`, `setBondCooldown` | Treasury policy controls |
| `BUDGET_MANAGER_ROLE` | `disburseToken`, `disburseReserveToken` | Treasury outflow routing |
| `SLASHER_ROLE` | `slashBond` | Bond penalty authority |
| Any user | `depositBond`, `withdrawBond` | Participation and cooldown constraints apply |

## Audit focus

1. validate least-privilege assumptions for each role
2. validate role escalation surfaces
3. validate privileged path event emission and observability
