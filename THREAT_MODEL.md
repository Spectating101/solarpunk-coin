# THREAT MODEL

## Objective

Identify high-impact failure or abuse categories before external audit. Each category maps to contract surface area and has a stated mitigation direction.

---

## 1. Oracle / input manipulation

**Attack:** Stale, incorrect, or manipulated inputs to `updateOraclePriceAndAdjust`, `updateEnergyPrice`, or `SolarPunkOption.updateIndex`.

**Impact:**
- Wrong SPK mint amounts per kWh (via `energyPricePerKwh`)
- PI controller mints or burns based on false price data, destabilizing peg
- All open option positions marked to wrong index at settlement

**Mitigations in place:**
- `oracleNotStale` modifier blocks minting if price is > `oracleStalenessThreshold` old
- `ORACLE_ROLE` is role-restricted
- `minOracleBond` slashable stake (when configured)

**Residual gap:** No on-chain price verification against external feed — trusted oracle at this stage.

---

## 2. Privileged-role abuse

**Attack:** Admin, oracle, minter, liquidator, or slasher misuse of their privileged paths — e.g., draining treasury, manipulating parameters for self-benefit, or unauthorized slashing.

**Impact:** Protocol funds or reserve extraction; parameter corruption.

**Mitigations in place:**
- Explicit role scoping via AccessControl
- `onlyGovernanceApproved` timelock modifier on all sensitive owner functions
- `handoffAdmin()` prevents owner/admin authority split

**Residual gap:** Single EOA holds all roles at testnet stage. Multisig required before mainnet.

---

## 3. Margin and liquidation edge cases

**Attack:** Rounding, ordering, or boundary conditions that mis-handle position health — e.g., liquidating a healthy position, or failing to liquidate an unhealthy one.

**Impact:** Unfair forced closes or uncollateralized positions building up.

**Mitigations in place:**
- `_markToIndex` runs before any position modification or liquidation check
- `StillHealthy` error reverts liquidation when margin ≥ maintenance threshold
- `penalty + returned = p.margin` enforced by construction
- 32-invariant checklist covers margin transitions

**Residual gap:** Arithmetic edge cases at very small or very large qty values — audit review needed.

---

## 4. PI controller instability

**Attack:** Adversarial oracle price submissions that drive the PI controller into extreme mint/burn cycles, destabilizing SPK supply.

**Impact:** Supply oscillation, stability pool depletion, peg collapse.

**Mitigations in place:**
- Control signal capped at `supply / 100` per update (max 1% per oracle call)
- `integralError` clamped to `[-10e18, +10e18]`
- Burn path limited by `balanceOf(stabilityPool)` — can't burn more than pool holds
- Fee split (50% to stability pool) ensures pool accumulates balance over time

**Residual gap:** With zero stability pool balance and price below peg, controller cannot act. Monitored operationally.

---

## 5. Settlement manipulation

**Attack:** Oracle posts a manipulated settlement index just before series expiry, then calls `settle()` or allows position holders to settle at a favourable false price.

**Impact:** PnL theft from counterparty positions.

**Mitigations in place:**
- `settle()` uses `currentIndex` — oracle controls this value
- ORACLE_ROLE is bond-gated (when configured), creating slashable stake

**Residual gap:** No dispute window or multi-oracle aggregation at this stage.

---

## 6. Treasury routing misuse

**Attack:** Misconfigured budget vaults or abuse of `disburseToken` to route treasury funds incorrectly.

**Impact:** Reserve, insurance, or operational budgets drained or misdirected.

**Mitigations in place:**
- Budget policy sums enforced (must equal 10,000 bps)
- `BUDGET_MANAGER_ROLE` required for disbursement
- Full event emission for all treasury flows

**Residual gap:** Budget vaults are configured addresses — if pointed at attacker-controlled addresses, funds are lost. Requires operational discipline and timelock.

---

## 7. Bonding / slashing abuse

**Attack:** Slash overreach by `SLASHER_ROLE`, or operators withdrawing bonds just before a slash.

**Impact:** Operators evade accountability; unfair slash of innocent operators.

**Mitigations in place:**
- Slash amount bounded by `keeperBonds[operator]`
- Bond withdrawal subject to `bondCooldown` — prevents immediate exit before slash
- `SLASHER_ROLE` is explicitly scoped

**Residual gap:** Cooldown period must be long enough to outrace operator reaction time — configurable parameter.

---

## 8. Economic extraction loops

**Attack:** Adversarial sequences of mint, trade, redeem, and liquidate to extract value from treasury or stability pool.

**Impact:** Slow drain of protocol reserves.

**Mitigations in place:**
- Mint and redeem fees create friction on every loop iteration
- Supply cap limits maximum SPK outstanding
- Grid stress check halts minting if reserve ratio falls below threshold
- Conservative parameter defaults (10% min reserve margin, 150% initial margin)

**Residual gap:** Full adversarial equilibrium proof not done — audit scope.

---

## 9. Gaps & price jumps in high-volatility markets

**Attack:** Not an "attack" per se, but an environmental vulnerability. High annual volatility (>200%) can lead to price "jumps" between oracle updates that bypass the maintenance margin.

**Impact:**
- Positions become insolvent (negative margin) before they can be liquidated.
- Protocol insurance fund must cover the deficit to maintain clearinghouse solvency.

**Mitigations in place:**
- Increased default margins (250% initial, 125% maintenance) based on April 2026 stress tests.
- Maintenance margin (125%) provides a wider buffer before insolvency (0%) is reached.

**Residual gap:** Extreme, near-instantaneous jumps could still exhaust a 125% buffer. Mitigation requires sub-hour oracle frequency and dynamic margining.

---

## Out of scope at this stage

- Market liquidity moat assumptions (how deep order books need to be)
- Mass-adoption behavior forecasts
- Complete adversarial game-theoretic proofs
- Solidity compiler bugs or EVM-level vulnerabilities
