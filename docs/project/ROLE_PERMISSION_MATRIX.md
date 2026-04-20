# Role and Permission Matrix

## Scope

Audit-facing summary of privileged operations across all three contracts.

---

## SolarPunkCoin (`contracts/SolarPunkCoin.sol`)

| Role / authority | Operations | Risk note |
|---|---|---|
| `owner` (Ownable) | `setTreasury`, `setBondSource`, `setBondRequirements`, `updateControlParameters`, `updateFees`, `updateReserveParameters`, `setStabilityPool`, `setOracleRole`, `setOperatorRole`, `setGovernanceDelay`, `queueGovernanceAction`, `cancelGovernanceAction`, `unpause`, `setStabilityFeeShare`, `handoffAdmin` | Policy and economic controls — all timelock-gated when `governanceDelay > 0` |
| `MINTER_ROLE` | `mintFromSurplus` | Supply expansion path — bond-gated if `minMinterBond > 0` |
| `ORACLE_ROLE` | `updateOraclePriceAndAdjust`, `updateEnergyPrice`, `setGridStressed` | Price, energy rate, and grid-safety control — bond-gated if `minOracleBond > 0` |
| `RESERVE_MANAGER_ROLE` | `withdrawReserve` | Reserve outflow authority |
| `STABILIZER_ROLE` | `disburseStabilityPool` | Peg inventory release path |
| `PAUSER_ROLE` | `pause` | Emergency halt — blocks all token transfers |
| Any address | `depositReserve`, `syncReserve`, `redeemForEnergy` | Permissionless participation paths |

**Key notes:**
- `owner` and `DEFAULT_ADMIN_ROLE` must be kept in sync — use `handoffAdmin()` for governance transfers, not `transferOwnership()` alone
- `updateEnergyPrice` sets the SPK/kWh conversion rate — stale or incorrect values directly affect mint economics
- `setStabilityFeeShare` controls what fraction of mint fees reach the stability pool; at 0% the PI controller burn path has no inventory

---

## SolarPunkOption (`contracts/SolarPunkOption.sol`)

| Role / authority | Operations | Risk note |
|---|---|---|
| `DEFAULT_ADMIN_ROLE` | `createSeries`, `setInsuranceFund`, `setBondSource`, `setMarginParams`, `setTradingFeeBps`, `setBondRequirements`, `setOperatorRole`, `setGovernanceDelay`, `queueGovernanceAction`, `cancelGovernanceAction` | Core market-policy controls — timelock-gated when `governanceDelay > 0` |
| `ORACLE_ROLE` | `updateIndex` | Index update authority — determines mark-to-market PnL — bond-gated if configured |
| `LIQUIDATOR_ROLE` | `liquidate` | Forced position close — bond-gated if configured |
| `PAUSER_ROLE` | `pause`, `unpause` | Trading-path halt |
| Any address | `modifyPosition`, `depositMargin`, `withdrawMargin`, `markPosition`, `settle` | Permissionless trading and settlement paths |

**Key notes:**
- `updateIndex` is the single most trusted external input — manipulation here directly affects all open positions
- `settle()` is the only exit path after series expiry; `modifyPosition` reverts with `SeriesExpired` post-expiry
- Liquidation penalty routes to `insuranceFund` — verify this address is correct at deploy

---

## ProtocolTreasury (`contracts/ProtocolTreasury.sol`)

| Role / authority | Operations | Risk note |
|---|---|---|
| `DEFAULT_ADMIN_ROLE` | `setBudgetPolicy`, `setBudgetVaults`, `setBondCooldown`, `setGovernanceDelay`, `queueGovernanceAction`, `cancelGovernanceAction` | Treasury policy controls |
| `BUDGET_MANAGER_ROLE` | `disburseToken`, `disburseReserveToken` | Treasury outflow routing — disbursement splits according to active policy |
| `SLASHER_ROLE` | `slashBond` | Bond penalty authority — bounded by bonded amount |
| Any address | `depositBond`, `withdrawBond` | Bond participation — cooldown and balance constraints apply |

**Key notes:**
- Budget policy must sum to 10,000 bps — enforced on set
- Bond withdrawal is subject to cooldown; slashing cannot exceed bonded amount

---

## Cross-contract trust relationships

| Relationship | Direction | Note |
|---|---|---|
| `SolarPunkCoin` → `ProtocolTreasury` | reads `keeperBonds(operator)` | Bond source for minter/oracle gating — `bondSource` must point to treasury |
| `SolarPunkOption` → `ProtocolTreasury` | reads `keeperBonds(operator)` | Bond source for oracle/liquidator gating |
| `SolarPunkOption` → `ProtocolTreasury` | sends `insuranceFund` penalty payments | Insurance fund address set at deploy |
| `SolarPunkCoin` → `ProtocolTreasury` | sends treasury fee share | `treasury` address set in SolarPunkCoin |

## Audit focus

1. Validate least-privilege assumptions for each role
2. Validate role escalation surfaces — particularly `DEFAULT_ADMIN_ROLE` granting itself additional roles
3. Validate `handoffAdmin` atomicity — no window where both/neither hold authority
4. Validate privileged path event emission for complete observability
5. Validate cross-contract bond check — what happens if `bondSource` is set to a non-treasury contract
