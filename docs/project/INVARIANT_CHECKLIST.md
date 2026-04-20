# Invariant Checklist

## Scope

Audit-facing invariant candidates across the current contract system.

## Supply and issuance invariants

1. `mintFromSurplus` must require valid `MINTER_ROLE` and pass grid/oracle safety checks.
2. `mintFromSurplus` must respect `supplyCap` — total post-mint supply must not exceed cap.
3. Mint fee must split correctly: `stabilityFeeShare` basis points to stability pool, remainder to treasury. Sum must equal total fee.
4. `energyPricePerKwh` determines SPK per kWh. `estimateMintAmount` must use the same value as `mintFromSurplus`.
5. `redeemForEnergy` redemption fee must go entirely to treasury (not split to stability pool).

## Oracle and control invariants

6. Oracle update paths (`updateOraclePriceAndAdjust`, `updateEnergyPrice`, `setGridStressed`) must be restricted to `ORACLE_ROLE`.
7. If bond requirements are non-zero, bond source must be a contract and operator bond must meet minimums before oracle or minter actions proceed.
8. Stale oracle state (age ≥ `oracleStalenessThreshold`) must block `mintFromSurplus`.
9. `energyPricePerKwh` must be strictly positive at all times (enforced in `updateEnergyPrice`).

## PI controller invariants

10. PI controller mint path may only mint to `stabilityPool`.
11. PI controller burn path may only burn from `stabilityPool`.
12. Control signal is capped at `supply / 100` per update (max 1% supply change per oracle call).
13. `integralError` is clamped to `[-10e18, +10e18]` — unbounded accumulation is not possible.
14. `_applyPIControl` must return `false` (no adjustment) when `totalSupply() == 0`.

## Admin handoff invariant

15. `handoffAdmin(newAdmin)` must atomically: grant `DEFAULT_ADMIN_ROLE` to `newAdmin`, revoke it from the current owner, and transfer `Ownable` ownership. No intermediate state where both or neither hold the role.

## Margin and liquidation invariants

16. Position modifications must satisfy initial margin (`initialMarginBps`) after updates.
17. Margin withdrawals must satisfy maintenance margin (`maintenanceMarginBps`) after the withdrawal.
18. Liquidation must only occur when position margin falls below maintenance threshold.
19. `penalty + returned margin` must equal `p.margin` at the time of liquidation — no leakage.
20. `settle()` must only succeed after `block.timestamp >= series.expiry` — cannot settle active series.
21. `settle()` must clear position (`qty = 0, margin = 0`) and transfer all remaining margin to caller.
22. After `settle()` completes, calling `settle()` again on the same series must revert with "No position to settle".

## Treasury and budget invariants

23. Budget policy basis points must sum to 10,000 — enforced on `setBudgetPolicy`.
24. Disbursement must split token balance according to active policy.
25. Bond slashing must never exceed the bonded amount for that operator.
26. Bond withdrawal must respect cooldown period and available bonded balance.

## Reserve and solvency invariants

27. Reserve withdrawals require `RESERVE_MANAGER_ROLE`.
28. Reserve accounting must remain synchronized with actual token balance when `syncReserve` is called.
29. Grid stress flag blocks minting when reserve ratio falls below `minReserveMarginPercent`.

## Governance timelock invariants

30. When `governanceDelay > 0`, any governed function must revert if the action ID is not queued.
31. When `governanceDelay > 0`, any governed function must revert if queued but the delay has not elapsed.
32. A consumed governance action must be deleted from the queue — replay must not be possible without re-queuing.

## Suggested audit checks

- Boundary testing on fee, margin, and bond parameters
- Role misuse and escalation attempts
- Arithmetic edge cases around rounding and partial liquidations
- Event completeness for all privileged actions
- PI controller behaviour at supply boundaries (zero, cap)
- Stability pool balance edge cases (empty pool when burn is needed)
- `handoffAdmin` called by non-owner must revert
- Settlement with zero margin (fully liquidated position) must not transfer tokens
