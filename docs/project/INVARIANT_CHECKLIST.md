# Invariant Checklist

## Scope

Audit-facing invariant candidates across current contract system.

## Supply and issuance invariants

1. `mintFromSurplus` must require valid minter role and pass grid/oracle safety checks.
2. `mintFromSurplus` must respect `supplyCap`.
3. Mint/redeem fee routing must not bypass configured treasury sink.

## Oracle and control invariants

4. Oracle update paths must be role-restricted.
5. If bond requirements are non-zero, bond source must be a contract and operator bond must meet minimums.
6. Stale oracle state must block mint path where specified.

## Margin and liquidation invariants

7. Position modifications must satisfy initial margin after updates.
8. Withdrawals must satisfy maintenance margin after updates.
9. Liquidation must only occur below maintenance threshold.
10. Liquidation penalty + returned margin must not exceed available margin.

## Treasury and budget invariants

11. Budget policy basis points must sum to 10,000.
12. Disbursement must split according to active policy.
13. Bond slashing must never exceed bonded amount.
14. Bond withdrawal must respect cooldown and bonded balance.

## Reserve and solvency invariants

15. Reserve withdrawals require reserve-manager role.
16. Reserve accounting must remain synchronized with actual token balance when `syncReserve` is called.

## Suggested audit checks

- boundary testing on fee, margin, and bond parameters
- role misuse and escalation attempts
- arithmetic edge-cases around rounding and partial liquidations
- event completeness for privileged actions
