# SolarPunk Protocol - Security Audit RFP & Scope Document

**Prepared for:** Professional Smart Contract Auditors  
**Protocol:** SolarPunkCoin + SolarPunkOption  
**Networks:** Polygon (EVM-compatible)  
**Total LOC:** 900 lines of Solidity  
**Date:** January 2026

---

## EXECUTIVE SUMMARY

SolarPunk Protocol is an energy-backed stablecoin and derivatives protocol designed to provide renewable energy producers with accessible hedging instruments. We are seeking a **professional security audit** to validate contract integrity before testnet pilots and mainnet deployment.

**Scope Summary:**
- 2 primary smart contracts (577 + 327 lines)
- 1 test utility contract (17 lines)
- ERC20 standard compliance
- Role-based access control
- PI control algorithm for stablecoin peg stabilization
- Options settlement with VaR-based margin enforcement

**Budget:** $20,000 - $50,000 (TBD based on audit depth)  
**Timeline:** 4-6 weeks  
**Goal:** Zero critical/high findings; ≤2 medium findings

---

## CONTRACT OVERVIEW

### 1. SolarPunkCoin.sol (577 lines)
**Purpose:** Energy-backed ERC20 stablecoin with peg stabilization

**Key Features:**
- **ERC20 Extensions:** Burnable, Pausable, Ownable, AccessControl
- **Peg Target:** $1.00 (1e18 wei)
- **Peg Stability Band:** ±5% (configurable)
- **PI Control Loop:** Proportional + Integral gains for minting/burning
- **Oracle Integration:** Chainable price feeds with staleness checks
- **Grid Safety:** Emergency minting pause when reserves fall below threshold
- **Reserve Accounting:** USDC backing with decimal normalization
- **Redemption:** Burn-to-redeem model for intrinsic value guarantee

**Critical Functions to Audit:**
- `mintFromSurplus(uint256 kwh, address recipient)` — Oracle-gated surplus minting
- `updateOraclePriceAndAdjust(uint256 price)` — Price feed + control signal
- `redeemSPK(uint256 amount)` — Burn mechanism with fee
- `_applyPIControl(uint256 currentPrice)` — Control algorithm logic
- `_isGridStressedForSupply(uint256 supply)` — Reserve margin checks
- `depositReserve(uint256 amount)` / `withdrawReserve(uint256 amount)` — Reserve management

**Known Assumptions (to verify):**
1. Oracle provides prices in 1e18 format (USD per token)
2. Reserve token decimals match USDC (6 decimals)
3. All amounts are denominated in wei (10^18)
4. Off-chain oracle enforces energy delivery on redemption

---

### 2. SolarPunkOption.sol (327 lines)
**Purpose:** Options clearinghouse with margining and liquidation

**Key Features:**
- **Option Types:** Calls and Puts (physically settled)
- **Margin Model:** Initial margin + Maintenance margin (VaR-based)
- **Liquidation:** Automatic when margin falls below threshold
- **Settlement:** Oracle-gated, using spot price at expiration
- **Position Tracking:** Per-user position registry with PnL calculation

**Critical Functions to Audit:**
- `openPosition(uint256 strike, uint8 positionType)` — Margin check + position creation
- `liquidatePosition(address user, uint256 seriesId)` — Margin enforcement
- `settlePosition(uint256 seriesId)` — Final settlement with oracle price
- `calculateMarginRequirement(...)` — VaR calculation
- `withdrawMargin(uint256 amount)` — Prevent over-withdrawal during open positions

**Known Assumptions (to verify):**
1. Oracle price is always available at settlement
2. Liquidators have sufficient capital for quick settlement
3. No flash loan attacks possible (depends on oracle integration)

---

### 3. MockUSDC.sol (17 lines)
**Purpose:** Test utility contract (not production)

**Notes:**
- Simple ERC20 mock for testing
- No security concerns (test-only)
- Can be excluded from audit scope

---

## AUDIT FOCUS AREAS

### Priority 1: Critical (Must Audit)
These are the highest-risk areas based on code analysis:

#### 1.1 PI Control Algorithm Stability
**Location:** SolarPunkCoin.sol, lines 260-290

**Risk:** Integral error could grow unbounded, causing extreme minting/burning actions

**Test Requirements:**
- [ ] Integral error accumulation is bounded
- [ ] Proportional + Integral actions saturate at max rate (20%)
- [ ] PI tuning parameters (1%, 0.5%) are safe
- [ ] Simulation validates >80% in-band stability

**Recommendation:** Request PI control stability proof or bounded integral bounds

#### 1.2 Oracle Price Feed Integration
**Location:** SolarPunkCoin.sol, lines 395-420

**Risk:** Malicious oracle could trigger large mint/burn cycles

**Test Requirements:**
- [ ] Oracle price can only be set by ORACLE_ROLE
- [ ] Staleness check is enforced (86400s default)
- [ ] Price deviation limits are applied
- [ ] No re-entrancy vectors through oracle callback

**Recommendation:** Verify oracle role assignment process; recommend multi-sig for production

#### 1.3 Reserve Decimal Normalization
**Location:** SolarPunkCoin.sol, lines 155-165

**Risk:** USDC has 6 decimals; contract assumes normalization to 1e18

**Test Requirements:**
- [ ] Decimal scaling works correctly for deposit/withdraw
- [ ] No rounding errors in reserve calculations
- [ ] Reserve balance accurately reflects USDC deposits
- [ ] Reserve ratio enforcement uses correct scaled values

**Recommendation:** Fuzz test all decimal conversions with edge values

#### 1.4 Option Margin Calculation
**Location:** SolarPunkOption.sol, lines 180-200

**Risk:** Incorrect margin could allow undercollateralized positions

**Test Requirements:**
- [ ] Initial margin blocks positions with insufficient collateral
- [ ] Maintenance margin enforces liquidation trigger
- [ ] Margin calculation is monotonic in spot price
- [ ] Liquidation executes with correct settlement price

**Recommendation:** Verify VaR formula against standard options theory (Black-Scholes)

### Priority 2: High (Should Audit)
These are important but less critical:

#### 2.1 Role-Based Access Control
**Location:** Multiple functions using hasRole()

**Test Requirements:**
- [ ] Default roles are correctly initialized
- [ ] Role grants/revokes work as expected
- [ ] No ability to grant/revoke without prior role

#### 2.2 Pause Mechanism
**Location:** SolarPunkCoin.sol, uses ERC20Pausable

**Test Requirements:**
- [ ] Pause blocks minting but allows redemption (if desired)
- [ ] Unpause requires ownership
- [ ] Paused state doesn't affect balance transfers

#### 2.3 Supply Cap Enforcement
**Location:** SolarPunkCoin.sol, line 250

**Test Requirements:**
- [ ] Minting beyond 1B cap is rejected
- [ ] Cap can be adjusted by owner
- [ ] No bypass via redemption/re-minting

### Priority 3: Medium (Nice to Verify)
These are lower-risk but should be checked:

#### 3.1 Event Emissions
- [ ] All critical state changes emit events
- [ ] Event parameters match function inputs
- [ ] Events can be replayed from logs for recovery

#### 3.2 Reentrancy (SafeERC20)
- [ ] All external calls use safe methods
- [ ] No callback hooks in untrusted contracts
- [ ] Checks-Effects-Interactions pattern followed

#### 3.3 Integer Overflow/Underflow
- [ ] Uses Solidity 0.8.20 (built-in overflow checks)
- [ ] Manual checks for edge cases
- [ ] Large value arithmetic tested

---

## TEST COVERAGE REQUIREMENTS

### Unit Tests (Included in Repo)
```
✅ SolarPunkCoin.test.js     - 36 tests, all passing
✅ SolarPunkOption.test.js   - 10 tests, all passing
✅ Coverage: ~70% of SPC, ~65% of SPO
```

### Additional Tests Expected from Auditor
- [ ] Fuzz tests for decimal conversion edge cases
- [ ] Stress tests with extreme volatility (>50% daily)
- [ ] Multi-user concurrency tests
- [ ] Oracle failure/staleness scenarios
- [ ] Liquidation cascade tests

---

## KNOWN LIMITATIONS & ASSUMPTIONS

### 1. Off-Chain Redemption Trust Model
**Current:** Burn tokens → oracle "promises" to deliver energy

**Limitation:** No on-chain verification of energy delivery  
**Acceptable Because:** Energy delivery is inherently off-chain; trust model matches commodity derivatives  
**Recommendation:** Document oracle operator SLAs; consider time-lock escrow for large redemptions

### 2. Centralized Oracle
**Current:** Single oracle price feed (no aggregation yet)

**Limitation:** Single point of failure  
**Acceptable Because:** This is testnet MVP; mainnet will use Chainlink/Pyth  
**Recommendation:** Plan oracle upgrade path (proxy or new contract + migration)

### 3. No Upgrade Mechanism
**Current:** Contracts deployed via new SolarPunkCoin()  

**Limitation:** Cannot fix bugs without data migration  
**Acceptable Because:** Small surface area; audit should catch bugs  
**Recommendation:** Plan v2 with UUPS proxy pattern (if major changes needed post-audit)

### 4. Simplified Margin Model
**Current:** Fixed initial/maintenance margin percentages

**Limitation:** Does not adapt to market volatility  
**Acceptable Because:** Sufficient for MVP; can be enhanced  
**Recommendation:** Track margin requirements over time; adjust in v1.1

---

## DEPLOYMENT & PRODUCTION READINESS

### Testnet Deployment
- [ ] Audit clearance (0 critical findings)
- [ ] Mumbai deployment verified
- [ ] Health check script passing
- [ ] 5+ test transactions executed

### Mainnet Deployment (Post-Pilot)
- [ ] All audit findings remediated
- [ ] Multi-sig governance for parameter changes
- [ ] Oracle upgrade pathway established
- [ ] Emergency pause mechanism exercised
- [ ] Insurance fund (1-2% of TVL) established

---

## AUDIT DELIVERABLES

We expect the following from your audit firm:

### 1. Detailed Report
- [ ] Issue breakdown by severity (Critical/High/Medium/Low/Informational)
- [ ] For each issue: description, impact, proof-of-concept, recommendation
- [ ] Code snippets for all issues (with line numbers)
- [ ] Severity justification

### 2. Remediation Plan
- [ ] For each issue: proposed fix with code
- [ ] Timeline for remediation (immediate vs. v1.1)
- [ ] Re-audit plan for verified fixes

### 3. Executive Summary (1-2 pages)
- [ ] Overall security posture
- [ ] Risk rating (Safe/Fair/Risky/Dangerous)
- [ ] Go-live recommendations

### 4. Optional: Formal Verification
- [ ] PI control algorithm bounds proof (if feasible)
- [ ] Option margin correctness proof

---

## TIMELINE & PROCESS

### Week 1: Kickoff & Setup
- [ ] Execute audit agreement
- [ ] Receive audit kick-off meeting
- [ ] Provide GitHub access + documentation

### Week 2-3: Active Audit
- [ ] Auditor reviews code systematically
- [ ] Auditor runs tests + fuzz testing
- [ ] Auditor identifies issues

### Week 4: Issue Remediation
- [ ] We fix identified issues
- [ ] Auditor verifies fixes
- [ ] Final report drafted

### Week 5: Report & Sign-Off
- [ ] Final audit report delivered
- [ ] Kick-off call to discuss findings
- [ ] Public bug bounty (optional)

---

## BUDGET & FIRM SELECTION

### Audit Cost Estimates
| Tier | Cost | Depth | Timeline |
|------|------|-------|----------|
| **Standard** | $20-30K | Line-by-line review | 4 weeks |
| **Enhanced** | $30-40K | + fuzz testing, formal verification | 5 weeks |
| **Premium** | $40-50K | + 2-week post-deployment monitoring | 6 weeks |

### Recommended Audit Firms (Sorted by Polygon Affinity)
1. **Trail of Bits** (USA) — Gold standard, Polygon experience
   - Website: https://www.trailofbits.com/
   - Cost: $40-50K
   - Timeline: 5-6 weeks

2. **OpenZeppelin** (USA) — ERC20 specialists
   - Website: https://www.openzeppelin.com/
   - Cost: $30-40K
   - Timeline: 4-5 weeks

3. **ConsenSys Diligence** (Global) — Enterprise-grade
   - Website: https://consensys.net/diligence/
   - Cost: $35-45K
   - Timeline: 5-6 weeks

4. **Certora** (Israel/USA) — Formal verification experts
   - Website: https://www.certora.com/
   - Cost: $30-40K (formal verification add-on available)
   - Timeline: 4-5 weeks

### Selection Criteria
- [ ] Has audited Polygon contracts
- [ ] Has experience with stablecoins or derivatives
- [ ] Can provide bug bounty coverage
- [ ] Offers post-deployment support
- [ ] Can deliver within our timeline

---

## BUDGET ALLOCATION

From a typical $50-75K grant:
```
Security Audit             $25,000  (50% of grant)
Oracle Containerization    $10,000  (20% of grant)
Testnet Pilot & Gas         $8,000  (16% of grant)
Operations & Contingency    $7,000  (14% of grant)
───────────────────────────────────
TOTAL                      $50,000
```

---

## SUCCESS CRITERIA

### Audit Success = All of:
- [ ] 0 Critical findings
- [ ] 0 High findings
- [ ] ≤2 Medium findings
- [ ] Low/Informational findings acceptable
- [ ] Auditor recommends "safe to deploy to testnet"

### Testnet Success = All of:
- [ ] Audit complete (clean report)
- [ ] Health checks pass on Mumbai
- [ ] 5+ pilot users active for 4+ weeks
- [ ] No major issues found in the wild
- [ ] Auditor gives "safe to deploy to mainnet" recommendation

---

## CONTACT & NEXT STEPS

**Lead Contact:**  
Email: s1133958@mail.yzu.edu.tw  
Timezone: UTC+8 (Asia)  
Response: <24 hours

**To Submit Audit Proposal:**
1. Email with firm introduction & team bios
2. Provide cost estimate + timeline (based on this RFP)
3. Reference 3+ similar audits completed
4. Proposed schedule for discussions/kickoff

**Questions?**
- Repository: https://github.com/Spectating101/spk-derivatives
- Technical docs: START_HERE.md → THOROUGH_ASSESSMENT.md
- Grant proposal: GRANT_PROPOSAL.md

---

## APPENDIX A: CONTRACT INTERFACES

### SolarPunkCoin (Relevant functions)
```solidity
// Minting (Role: MINTER_ROLE)
function mintFromSurplus(uint256 kwh, address recipient) external onlyMinter returns (uint256);

// Oracle (Role: ORACLE_ROLE)
function updateOraclePriceAndAdjust(uint256 price) external onlyOracle;
function recordSurplusKwh(uint256 kwh) external onlyOracle;

// Redemption (Public)
function redeemSPK(uint256 amount) external returns (bool);

// Reserve (Role: RESERVE_MANAGER_ROLE)
function depositReserve(uint256 amount) external;
function withdrawReserve(uint256 amount) external;

// Parameters (Owner only)
function setPegTarget(uint256 _pegTarget) external onlyOwner;
function setPegBand(uint256 _pegBand) external onlyOwner;
function setProportionalGain(uint256 _proportionalGain) external onlyOwner;
function setIntegralGain(uint256 _integralGain) external onlyOwner;
```

### SolarPunkOption (Relevant functions)
```solidity
// Trading
function openPosition(uint256 strike, uint8 positionType) external;
function closePosition(uint256 seriesId) external;
function liquidatePosition(address user, uint256 seriesId) external;

// Settlement
function settlePosition(uint256 seriesId) external;
function updateOraclePrice(uint256 spotPrice) external onlyOracle;

// View
function getPosition(address user, uint256 seriesId) external view returns (Position);
function calculateMarginRequirement(uint256 strike, uint8 positionType) external view returns (uint256);
```

---

**Thank you for considering SolarPunk Protocol for audit. We're committed to security-first development.** 🛡️

*SolarPunk © 2026 | Building the future of renewable energy finance*
