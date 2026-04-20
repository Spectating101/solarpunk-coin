# ARCHITECTURE OVERVIEW

## One-line description

SolarPunk turns verified renewable energy surplus into programmable settlement, hedging, and treasury flows.

## Layer map

| Layer | Components | Purpose |
|---|---|---|
| Data / attestation | meter oracle inputs, `updateEnergyPrice`, `updateOraclePriceAndAdjust` | Verify inputs before financial actions |
| Pricing | `thesis_package/options_pricing.py`, `energy_derivatives/` | Off-chain premium estimation and risk surfaces |
| Settlement | `SolarPunkCoin.sol`, `SolarPunkOption.sol` | Enforce mint/redeem, margin, liquidation, settlement |
| Treasury | `ProtocolTreasury.sol` | Route fees, hold bonds, split budgets |
| Ops / evidence | deploy scripts, interaction proof, receipts | Prove current state to reviewers |

## Value flow

```
Verified energy surplus (kWh) + oracle price
              |
              v
   SolarPunkCoin.mintFromSurplus()
              |
              +--> SPK minted to operator (net of fee)
              +--> Fee split:
                    50% → stability pool (PI controller inventory)
                    50% → ProtocolTreasury
                              |
                              v
                   Budget split (10,000 bps total):
                   40% reserve / 25% insurance / 25% ops / 10% audit

   SolarPunkOption.modifyPosition()
              |
              +--> Trading fee → insurance fund (ProtocolTreasury)
              +--> Margin held in contract
              +--> Mark-to-market PnL on every index update
              +--> Liquidation penalty → insurance fund
              +--> settle() returns remaining margin at expiry
```

## Contract stack

### SolarPunkCoin (`contracts/SolarPunkCoin.sol`)

ERC20 stablecoin pegged to energy value. Key mechanisms:

- **Surplus-only issuance**: `mintFromSurplus(kWh, recipient)` — oracle-gated, grid-stress gated, minter-bond gated
- **Energy price oracle**: `energyPricePerKwh` set by ORACLE_ROLE — determines SPK per kWh (e.g. $0.05/kWh → 100 kWh = 5 SPK)
- **PI peg controller**: `_applyPIControl` — scales control signal by `totalSupply`, capped at 1% per update, mints/burns from stability pool
- **Stability pool fee routing**: `stabilityFeeShare` (default 50%) of every mint fee goes to stability pool to fund the burn path
- **Reserve ratio gate**: minting halts if USDC reserve ratio falls below `minReserveMarginPercent`
- **Governance timelock**: all owner parameter changes require queue + delay when `governanceDelay > 0`
- **Admin handoff**: `handoffAdmin(newAdmin)` atomically syncs Ownable + DEFAULT_ADMIN_ROLE

### SolarPunkOption (`contracts/SolarPunkOption.sol`)

European cash-settled options clearinghouse. Key mechanisms:

- **Series management**: admin creates series with expiry, strike, isCall, notional
- **Margin model**: initial margin (150% of exposure) and maintenance margin (75%) enforced on every position change
- **Mark-to-market**: `_markToIndex` computes payoff delta and credits/debits margin before any modification
- **Liquidation**: position below MM threshold → penalty to insurance fund, remainder to trader
- **Settlement**: `settle(seriesId)` — only callable after expiry, marks to final index, returns all remaining margin
- **Bond-gated oracle and liquidator**: slashable stake enforced when configured
- **Governance timelock**: same pattern as SolarPunkCoin

### ProtocolTreasury (`contracts/ProtocolTreasury.sol`)

Fee vault and bond escrow. Key mechanisms:

- **Budget routing**: `disburseToken` splits any token balance to 4 configured vault addresses per `budgetPolicy`
- **Bond escrow**: `depositBond` / `withdrawBond` (cooldown-gated) / `slashBond` (SLASHER_ROLE, bounded)
- **Bond view interface**: `keeperBonds(operator)` queried by both SolarPunkCoin and SolarPunkOption for bond checks

## Cross-contract trust relationships

```
SolarPunkCoin ──reads keeperBonds──> ProtocolTreasury
SolarPunkCoin ──sends treasury fee─> ProtocolTreasury

SolarPunkOption ──reads keeperBonds──> ProtocolTreasury
SolarPunkOption ──sends insurance penalty─> ProtocolTreasury (insuranceFund)
```

## Solvency and safety controls

| Control | Contract | Trigger |
|---|---|---|
| Grid stress gate | SolarPunkCoin | Reserve ratio < `minReserveMarginPercent` or `manualGridStress` |
| Oracle staleness gate | SolarPunkCoin | Last update > `oracleStalenessThreshold` (1 day) |
| Supply cap | SolarPunkCoin | `totalSupply + mint > supplyCap` |
| Initial margin check | SolarPunkOption | Post-modification margin < 150% of exposure |
| Maintenance margin check | SolarPunkOption | On withdrawal and liquidation |
| Pause | All three | PAUSER_ROLE — halts all token transfers and trading |
| Bond requirements | SolarPunkCoin + Option | ORACLE_ROLE, MINTER_ROLE, LIQUIDATOR_ROLE |

## Governance architecture

All three contracts share the same `onlyGovernanceApproved` modifier pattern:

```
owner/admin calls queueGovernanceAction(actionId)
  → stored with executeAfter = now + governanceDelay
  → after delay, call the governed function
  → modifier checks queue, deletes entry, executes
```

At testnet: `governanceDelay = 0` (no timelock).
For production: set to ≥ 86400 (24h) and transfer admin to multisig.
