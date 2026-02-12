# Oracle Safety Policy

## Objective
Prevent unsafe mint/redeem behavior under stale, divergent, or low-quality data conditions.

## Controls
1. Freshness gating:
- Reject stale oracle windows beyond configured threshold.

2. Multi-source aggregation:
- Use weighted aggregation with outlier-aware checks.

3. Fail-closed behavior:
- If oracle quality is insufficient, protocol actions move to `NO_GO`.

4. Grid-stress coordination:
- Mint path must obey stress flags and reserve safety constraints.

## Operating Rule
No minting decisions are externally communicated without:
- fresh attestation bundle,
- fresh verification report,
- passing phase-gate decision for target phase.
