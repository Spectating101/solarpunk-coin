# Basis & Tolerance Note (Pilot Draft)

Purpose: set expectations on hedge effectiveness, oracle quality, and when we pause/adjust.

## Indices & Regions
- Base index: weighted-median of (1) local wholesale price feed, (2) NASA irradiance proxy, (3) Chainlink/energy oracle. Weighted median with staleness checks; require ≥2 sources.
- Regionalization: define index per zone (e.g., ISO/region). Start with 1–3 pilot zones to minimize basis drift.
- Tenor: 1–3 months to limit basis risk over time. Roll program later.

## Tolerances
- Staleness: reject feeds older than 24h; circuit-breaker if quorum <2.
- Deviation: pause new positions if new index >3σ from 7-day median; mark at last-good.
- Basis tolerance (pilot target): hedge remains ≥75% effective with ±10% oracle error vs realized producer price. If realized basis >10% for 3 consecutive marks, allow fee-free early closeout or pause new trades in that zone.

## Marking & Updates
- Mark cadence: daily (pilot) to keep variation margin responsive without high oracle cost. Intraday optional for stress events.
- Settlement: European, cash-settled in USDC at expiry index.

## Communication (UX/Docs)
- Show zone on the trade ticket and warn “hedge effectiveness depends on your zone match.”
- Publish live “index health”: last update age, sources used, deviation vs 7-day median.
- Document pause conditions: staleness, deviation >3σ, basis drift >10% over 3 marks.

## Next Steps
- Calibrate per-zone σ and basis bands from historical data to set IM/MM (see IM_CALIBRATION.md).
- Add per-zone identifiers to oracle posts and UI to reduce mismatch.
