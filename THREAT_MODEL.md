# THREAT MODEL

## Objective

Identify high-impact failure or abuse categories before external audit.

## Threat categories

### 1. Oracle/input manipulation

- stale or incorrect inputs affecting minting, pricing, or liquidation
- mitigation direction: staleness checks, fail-closed behavior, source-quality controls

### 2. Privileged-role abuse

- admin/oracle/slasher misuse
- mitigation direction: explicit role scoping, operational controls, future multisig/timelock hardening

### 3. Margin and liquidation edge cases

- rounding, ordering, or boundary conditions that mis-handle health checks
- mitigation direction: invariant tests and audit review of margin transitions

### 4. Treasury routing misuse

- misconfigured budget vaults or disbursement abuse
- mitigation direction: explicit config checks, role separation, event-driven observability

### 5. Bonding/slashing abuse

- slash overreach or unfair lock/unlock behavior
- mitigation direction: bounded slash amounts, clear cooldown rules, role governance controls

### 6. Economic abuse

- manipulation attempts to extract treasury value via fee/liquidation loops
- mitigation direction: conservative parameters, monitoring, and pilot-phase guardrails

## Out-of-scope at this stage

- market-liquidity moat assumptions
- mass-adoption behavior forecasts
- complete adversarial equilibrium proofs

