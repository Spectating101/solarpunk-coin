# SolarPunkCoin: Research Phase Setup & Next Steps

**Status**: PURE EXPLORATION MODE (No Development Yet)  
**Date**: December 9, 2025  
**Goal**: Deep research before specifying exact development direction

---

## What We've Done (Research Infrastructure)

### ✅ Created Living Research Documents

1. **RESEARCH_EXPLORATION.md** (Main hub)
   - 10 major research areas mapped
   - 100+ specific questions identified
   - Research-to-development pipeline outlined
   - Success metrics defined

2. **RESEARCH_STABLECOIN_ARCHITECTURES.md** (Section 1 Complete)
   - Analyzed 6 major stablecoin projects (DAI, USDC, UST, FRAX, Celo, Synthetix)
   - Documented what works, what failed, why
   - **Recommended architecture**: Hybrid energy-backed model (60% energy / 40% USDC)
   - Risk analysis completed
   - Code patterns identified

### ✅ Established Research Methodology

**Approach**:
- Literature review (whitepapers, academic papers, code)
- Comparative analysis (matrix of features vs. requirements)
- Risk assessment (failure modes + mitigations)
- Specification design (based on validated findings)

**Not starting development until we answer all key questions**

---

## Research Tasks Remaining (9 of 10)

### 2. CEIR Mechanism Validation (IN PROGRESS)

**What we need to understand**:
- Does CEIR actually predict Bitcoin returns? (You found β = -0.286, p = 0.015)
- What's the reversion speed? (Half-life?)
- Can we use CEIR as a control law for SPK peg?
- Define SP-CEIR variant for energy-backed model

**Where data lives**:
- Your Empirical Milestone paper (already has CEIR analysis)
- Bitcoin historical price data (already have)
- Energy cost data (need to compile)

**Deliverable**: CEIR validation document + SP-CEIR specification

---

### 3. Oracle Data Infrastructure (NOT STARTED)

**Specific questions**:
- [ ] Get CAISO OASIS API access → pull real data (1 week of curtailment)
- [ ] Understand CAISO data structure + latency (real-time vs forecast)
- [ ] Contact Taipower → ask about data availability (May need Yuan Ze connection)
- [ ] Research Chainlink VRF costs (how much per oracle call?)
- [ ] Evaluate Tellor, Band Protocol as alternatives

**Success metric**: Document exact API specs + cost structure + latency for both grids

---

### 4. Regulatory Classification (NOT STARTED)

**Key questions**:
- Is SPK a security? Commodity? Currency? (Get legal opinion)
- Which jurisdictions allow it? (US? Taiwan? Singapore?)
- If utilities redeem SPK, what liability do they have?
- Pre-launch roadmap (regulatory approval before going live)

**Next step**: Find crypto securities lawyer, get 2-hour consultation

**Success metric**: Written legal opinion on regulatory classification + jurisdiction recommendations

---

### 5. Peg Stabilization Theory (NOT STARTED)

**Control system analysis**:
- Should we use PI control? PID? Kalman filter?
- Simulate each approach on synthetic price data
- Find optimal (δ, γ) parameters
- Test stability under 5 scenarios

**Success metric**: Specification of exact control law + validated parameters

---

### 6. Grid Curtailment Measurement (NOT STARTED)

**Practical questions**:
- How does CAISO define curtailment? (vs Taipower?)
- What's the data latency? (1-min? 5-min? 1-hour?)
- Can we prove curtailment happened? (Smart meter signing?)
- How correlated are CAISO + Taipower?

**Success metric**: Document exact curtailment definitions + data quality assessment

---

### 7. Yuan Ze Infrastructure Audit (NOT STARTED)

**Critical but missing**:
- What solar capacity does Yuan Ze have? (kW?)
- What battery storage? (kWh?)
- Existing smart meters? (What standard?)
- Internet connectivity on roof?
- Willingness to participate in pilot?

**Next step**: Contact Yuan Ze facilities team + engineering department

**Success metric**: Specs document + timeline proposal for pilot integration

---

### 8. Library-to-Blockchain Integration (NOT STARTED)

**Architectural questions**:
- How do Python simulations in spk-derivatives connect to Solidity contracts?
- Should we share mathematical specs or duplicate code?
- What functions live in Python vs Solidity?
- How do they communicate? (Off-chain compute + on-chain verification?)

**Success metric**: Architecture diagram + function allocation spec

---

### 9. Scenario Definitions & Risk Boundaries (NOT STARTED)

**Mathematical modeling**:
- Define "normal surplus" quantitatively (mean, std dev, distribution)
- Define "extreme surplus" (max historical, probability)
- Define "scarcity" (zero curtailment, how often?)
- Define "speculative attack" (trading volume that breaks peg?)
- Define "multi-region" (CAISO ↔ Taipower divergence)

**Success metric**: Quantitative scenario parameters + risk boundary chart

---

## Implementation Plan: Research Phase

### Phase 1: Fast Track (Weeks 1-2)

**Priority 1 (Do first)**:
1. ✅ Stablecoin architectures (DONE - Section 1)
2. CEIR mechanism (IN PROGRESS - research your data)
3. Yuan Ze infrastructure (Contact facilities team immediately)
4. Regulatory classification (Hire lawyer, get opinion)

**Why these first?**
- Yuan Ze specs determine what's possible
- Legal opinion determines if project is viable
- CEIR analysis validates theoretical foundation

**Effort**: 40-60 hours total

### Phase 2: Deep Dive (Weeks 3-6)

**Priority 2**:
1. Oracle infrastructure (CAISO + Taipower data analysis)
2. Peg stabilization (control theory + simulation)
3. Grid curtailment (data quality assessment)
4. Scenario modeling (5 scenarios quantified)

**Why these second?**
- Build on Phase 1 foundations
- More technical, less urgent
- Can parallelize

**Effort**: 80-120 hours total

### Phase 3: Integration (Weeks 7-8)

**Priority 3**:
1. Library-to-blockchain architecture
2. Final specification document
3. Decision matrix (all choices documented)

**Why last?**
- Depends on all previous research
- Creates the actual dev spec

**Effort**: 20-30 hours total

---

## How to Proceed Right Now

### Immediate Actions (This Week)

1. **Research Task 2 (CEIR)**: 
   - Review your Empirical Milestone paper
   - Extract CEIR timeseries
   - Calculate reversion speed (use Ornstein-Uhlenbeck model or AR(1))
   - Document findings in new research doc

2. **Research Task 7 (Yuan Ze)**:
   - Email Yuan Ze facilities/engineering
   - Request: Solar specs, battery specs, metering, available data
   - Goal: Schedule 1-hour call next week

3. **Research Task 4 (Regulatory)**:
   - Search: "crypto securities lawyer Taiwan" or "crypto commodities lawyer"
   - Get 2-3 referrals
   - Schedule 2-hour consultation (budget: $500-1000)

### Next 2 Weeks

4. Complete CEIR research document
5. Get response from Yuan Ze facilities
6. Get lawyer opinion on SPK classification
7. Start CAISO data analysis (Task 3)
8. Begin control theory simulation (Task 5)

### Success Metrics for Research Phase

When we finish, we'll have:
- ✅ 9 research documents (one per task)
- ✅ Clear technical specification
- ✅ Decision matrix (no ambiguity)
- ✅ Risk assessment (know what can break)
- ✅ Regulatory pathway (know if legal)
- ✅ Development roadmap (know what to build)

**Then development is straightforward**: Build to spec, no surprises.

---

## Key Documents Created

| Document | Purpose | Status |
|----------|---------|--------|
| RESEARCH_EXPLORATION.md | Main hub, 10 research areas | ✅ Complete |
| RESEARCH_STABLECOIN_ARCHITECTURES.md | Section 1: Solidity patterns | ✅ Complete |
| RESEARCH_CEIR_MECHANISM.md | Section 2: Energy valuation | ⏳ In progress |
| RESEARCH_ORACLE_INFRASTRUCTURE.md | Section 3: Data pipelines | ⏳ To do |
| RESEARCH_REGULATORY.md | Section 4: Legal classification | ⏳ To do |
| RESEARCH_PEG_MECHANISMS.md | Section 5: Control theory | ⏳ To do |
| RESEARCH_GRID_CURTAILMENT.md | Section 6: Measurement methods | ⏳ To do |
| RESEARCH_YUAN_ZE_AUDIT.md | Section 7: Infrastructure specs | ⏳ To do |
| RESEARCH_LIBRARY_INTEGRATION.md | Section 8: Python ↔ Solidity | ⏳ To do |
| RESEARCH_SCENARIOS_RISK.md | Section 9: Quantitative models | ⏳ To do |
| SPEC_SOLARPUNKCOIN.md | Final development specification | ⏳ To do (after research) |

---

## Philosophy: Research Before Building

**Why we're not building yet**:

1. **Specification before code**: We don't know exactly what to build
2. **Validation before deployment**: We don't know if it will work
3. **Legal before launch**: We don't know if it's allowed
4. **Risk assessment**: We need to understand failure modes
5. **Avoid pivot/waste**: Better to research now than rewrite later

**The research investment**:
- **Time**: ~150-200 hours (4-5 weeks)
- **Cost**: Minimal (mostly your thinking + lawyer ~$1000)
- **Payoff**: Clear specification → fast, correct development → shipping SolarPunkCoin

**vs. building blind**:
- Build ERC-20 contract (wrong architecture)
- Deploy oracle (wrong data source)
- Find out from lawyer: It's illegal
- Start over (6 months wasted)

---

## Questions for You

As we do this research, **keep these in mind**:

1. **Do you have access to your CEIR analysis data?** (For Task 2)
2. **Do you have a contact at Yuan Ze facilities?** (For Task 7)
3. **Is US regulatory approval necessary, or Taiwan OK?** (Affects Task 4)
4. **How important is "fully decentralized" vs "pragmatically centralized"?** (Design choice)
5. **Do you have preferred energy company partnerships already?** (Affects Task 3)

---

## Summary

**You're now in PURE RESEARCH MODE.**

We've created:
- ✅ Research hub document
- ✅ Stablecoin architecture analysis
- ✅ Research task list (9 remaining)
- ✅ Timeline & methodology

**No code yet. Just understanding the problem space before building.**

**Next deliverable**: CEIR mechanism research document (your turn!)

Ready to dive into Section 2?

---

**Document Created**: December 9, 2025  
**Status**: Research Phase Active  
**Next Review**: After completing first 3 priority research tasks
