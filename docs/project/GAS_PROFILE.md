# Gas Profile

Generated: 2026-04-20  
Compiler: Solidity 0.8.20, optimizer enabled, 200 runs  
Network: Hardhat local (30M gas block limit)

## Method costs

| Contract | Method | Min | Max | Avg | Notes |
|---|---|---|---|---|---|
| SolarPunkCoin | `mintFromSurplus` | 96,171 | 188,699 | 178,251 | Hot path — higher end includes PI control mint |
| SolarPunkCoin | `updateOraclePriceAndAdjust` | 56,353 | 97,776 | 65,277 | Higher when PI controller fires |
| SolarPunkCoin | `redeemForEnergy` | — | — | 83,849 | |
| SolarPunkCoin | `updateEnergyPrice` | — | — | 54,647 | |
| SolarPunkCoin | `depositReserve` | 46,941 | 81,141 | 80,470 | |
| SolarPunkCoin | `handoffAdmin` | — | — | 56,169 | Role + ownership transfer |
| SolarPunkCoin | `setStabilityFeeShare` | — | — | 29,810 | |
| SolarPunkOption | `modifyPosition` | 147,881 | 179,651 | 151,657 | Includes mark-to-market |
| SolarPunkOption | `liquidate` | 84,084 | 93,285 | 87,151 | |
| SolarPunkOption | `settle` | — | — | 51,981 | |
| SolarPunkOption | `updateIndex` | 37,426 | 74,426 | 62,007 | Higher when index crosses threshold |
| SolarPunkOption | `createSeries` | 73,615 | 73,627 | 73,616 | |
| ProtocolTreasury | `disburseToken` | — | — | 157,077 | 4 transfers |
| ProtocolTreasury | `depositBond` | 101,365 | 101,377 | 101,367 | |

## Deployment costs

| Contract | Gas | % of 30M block |
|---|---|---|
| SolarPunkCoin | 4,736,675 | 15.8% |
| SolarPunkOption | 3,447,156 | 11.5% |
| ProtocolTreasury | 2,315,258 | 7.7% |

## Assessment

All hot-path operations are comfortably under 200k gas. No immediate optimizations required.

**High-cost notes:**
- `mintFromSurplus` at 188k max includes the PI controller minting to the stability pool — two ERC20 mint events. Acceptable.
- `modifyPosition` at ~150k includes mark-to-market PnL update on every call. Expected for a clearinghouse.
- `disburseToken` at 157k triggers 4 ERC20 transfers (budget split). Fixed overhead.
- SolarPunkCoin deploy at 4.7M is large but within a single Ethereum block at current gas limits.

**Potential optimizations (pre-mainnet, not urgent):**
1. Pack `mintingFee`, `redemptionFee`, `stabilityFeeShare` into a single storage slot (uint64 each)
2. Cache `totalSupply()` in memory during `mintFromSurplus` to avoid double SLOAD
3. Use `unchecked` arithmetic in the fee split math (already safe by construction)
