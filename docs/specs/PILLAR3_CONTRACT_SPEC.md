# Pillar 3 — Contract Specification (Engineering Draft, Dec 2025)

This is a concrete spec for an energy-backed European option (call/put) designed for Polygon deployment. It replaces the implicit CEIR anchor with an explicit, verifiable index, bounded oracle/basis risk, and enforced margin/solvency.

## 1) Instrument Definition
- **Underlying index**: Weighted-median energy price (see Oracle section), quoted in $/kWh.
- **Payoff**: European call/put on the index, cash-settled in USDC.
- **Strike (K)**: Cost floor (e.g., LCOE) or benchmark tariff.
- **Tenor (T)**: 3–12 months (matches GBM pricing horizon).
- **Notional**: 1,000 kWh per contract (configurable).
- **Settlement**: At expiry, `max(0, Index - K) * Notional` (call) or `max(0, K - Index) * Notional` (put), paid in USDC.

## 2) Oracle & Index
- **Sources**: Utility wholesale feed (40%), NASA satellite proxy (40%), Chainlink energy price feed (20%).
- **Aggregation**: Weighted median; if any source is stale (>24h) drop it; require ≥2 sources to settle.
- **Bounds**: Reject updates if deviating >3σ from 7-day rolling median; trigger circuit breaker to pause new trades and mark at last-good value.
- **On-chain storage**: Latest index value, timestamp, and source set hash; updates only by ORACLE_ROLE.
- **Decimals**: Index is normalized on-chain to collateral decimals; set `priceDecimals` at deployment to match the oracle feed.
- **Implementation**: `postIndex()` accepts per-source reports, validates staleness/quorum, computes weighted median, and triggers an on-chain circuit breaker on deviation.
- **Fallback**: If only one source live, allow manual governance update or pause settlement until quorum restored.

## 3) Margin & Solvency
- **Initial margin**: `IM = 1.5 × VaR99(payoff)` using σ/S0 grid from Pillar 2. Example table (T=0.25, 10k paths, 99% payoff VaR):
  - S0∈[0.042,0.0525,0.063], σ∈[1.42,1.89,2.36] → IM ≈ $0.18–0.67 per kWh notional (`empirical/margin_stress_table.csv`).
- **Maintenance margin**: 70–80% of IM (e.g., 0.75×IM); breach triggers margin call.
- **Variation margin**: Mark-to-market daily using latest index; require top-up to IM or liquidate.
- **Liquidation**: If equity < maintenance and not topped up within grace window, auto-close at next mark; penalty (e.g., 1–2%) to insurance fund.
- **Circuit breaker**: Pause marking if index deviates >3σ from 7-day median; resume when back in band or manual unpause.

## 4) Lifecycle & State Machine (simplified)
- **Open**: User posts IM in USDC, selects side (long/short), series (K,T).
- **Mark**: On oracle update, compute MTM; if margin < maintenance → margin call; if < liquidation → liquidate.
- **Settlement**: Oracle finalizes settlement price at expiry, then users settle against the fixed price; pay payoff to longs; burn shorts’ margin accordingly; return residuals.
- **Roles**: ORACLE_ROLE (post index), PAUSER_ROLE (pause/unpause), LIQUIDATOR (can trigger liquidation when under-margined).

## 5) On-Chain vs Off-Chain Split (Polygon)
- **On-chain (Polygon)**: Store positions, balances, IM/MM parameters, accept deposits/withdrawals, enforce margin/settlement, apply oracle updates (weighted median), emit events for marks/liquidations. Keep math simple (no MC/binomial).
- **Off-chain**: Pricing/calibration (σ/S0/K) and VaR grid computation; risk monitoring; oracle data collection; post aggregated index on-chain.
- **Data flow**: Off-chain service fetches sources → compute weighted median → post to contract. Off-chain risk engine computes IM tables and updates parameters via governance when needed.

## 6) Pseudocode Sketch
```solidity
struct Series { uint64 expiry; uint128 strike; bool isCall; uint128 notionalKWh; }
struct Position { int256 qty; uint128 margin; }

function updateIndex(uint256 idx, bytes32 sourcesHash) onlyOracle {
    require(!isStale(sources));
    require(withinBands(idx));
    currentIndex = idx;
    lastUpdate = block.timestamp;
    emit IndexUpdated(idx, sourcesHash);
}

function markPosition(address user, bytes32 seriesId) {
    int pnl = calcPnl(user, seriesId, currentIndex);
    positions[user][seriesId].margin += pnl;
    if (marginBelowMaintenance(user, seriesId)) emit MarginCall(user, seriesId);
    if (marginBelowLiquidation(user, seriesId)) liquidate(user, seriesId);
}

function liquidate(address user, bytes32 seriesId) {
    // close at currentIndex, apply penalty to insuranceFund
}
```

## 7) Basis/Oracle Risk Controls
- Publish tolerance: hedge remains >75% effective up to ±10% oracle error (align with Pillar 2 sensitivity).
- If basis spreads exceed threshold (e.g., realized vs oracle >10% for 3 days), auto-pause new positions and allow early closeout at last-good index.

## 8) Market Viability (targets)
- Spreads <0.5%, depth >$500k at touch, ≥3 MMs, daily volume >$2M (tune per pilot).
- Bootstrapping: MM incentives/rebates; start OTC/bilateral before venue listing.

## 9) Limits & Disclaimers
- Oracle quality and basis risk are bounded, not eliminated.
- σ and VaR are model-based (GBM); jump/mean-reversion risk outside scope.
- Regulatory and compliance not addressed; assume sandbox/pilot.
