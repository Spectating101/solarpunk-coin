# SolarPunkCoin Development: Simplified Action Plan

**Date**: December 9, 2025  
**Status**: Ready to execute  
**Approach**: Build on Polygon first, optional sidechain later (with funding)

---

## The Decision (MADE)

### ✅ We're Building on Polygon ERC-20

**Not on custom blockchain. Not overthinking it.**

**Why**:
- Launch in 2 weeks (not 6 months)
- $20K-$40K cost (not $500K)
- Prove concept with real users first
- Option to sidechain later (if/when funded)

---

## What You're Actually Building

### SolarPunkCoin on Polygon: MVP Specification

```
ERC-20 Token on Polygon Mainnet
├─ Name: SolarPunkCoin
├─ Symbol: SPK
├─ Decimals: 18
├─ Initial supply: 0 (minting based on curtailment)
├─ Blockchain: Polygon mainnet (NOT custom chain)
└─ Deployment: Hardhat/Truffle (standard Solidity tooling)

Core Features:
├─ Oracle-gated minting (curtailment → SPK)
├─ Peg stabilization (maintain price near target)
├─ Utility redemption (SPK → energy at utilities)
├─ USDC reserve (40% backing, stability)
├─ Governance DAO (SPK holders vote on parameters)
└─ Bridge-ready (can bridge to sidechain later)
```

---

## What You're NOT Building Right Now

❌ **Custom blockchain** (too expensive, too slow)  
❌ **Consensus mechanism** (use Polygon's)  
❌ **Custom validators** (use Polygon's)  
❌ **Legal structure** (decide later with traction)  
❌ **Full grid integration** (pilot after MVP)  

---

## The 8-Week Development Plan

### Week 1-2: Research & Design (You're here NOW)

**What to do**:
- ✅ CEIR mechanism validation (your research)
- ✅ Yuan Ze infrastructure specs (your research)
- ⏳ Skip legal (not needed yet)
- ✅ Understand stablecoin architecture (done - RESEARCH_STABLECOIN_ARCHITECTURES.md)

**Deliverable**: 
- CEIR analysis document
- Yuan Ze specs document
- Clear SPK design parameters (α, γ, δ values)

**Owner**: You (with my support)  
**Timeline**: End of week (Dec 15)

---

### Week 3: Write Smart Contract

**What to do**:
1. Write `SolarPunkCoin.sol` (Solidity ERC-20)
2. Implement oracle hooks
3. Peg stabilization logic
4. Redemption mechanism
5. Governance structure

**File structure**:
```
contracts/
├── SolarPunkCoin.sol (ERC-20 + oracle logic)
├── SPKOracle.sol (price feed integration)
├── SPKRedemption.sol (utility redemption)
├── SPKGovernance.sol (DAO voting)
└── SPKTestnet.sol (mock for testing)
```

**Owner**: Need Solidity dev  
**Timeline**: 1 week  
**Cost**: $10K-$20K (can find on Fiverr/Upwork or hire full-time)

---

### Week 4: Deploy to Polygon Mumbai (Testnet)

**What to do**:
1. Set up Hardhat/Truffle project
2. Deploy to Polygon Mumbai (free testnet)
3. Configure oracle (Chainlink testnet)
4. Create SPK/USDC pool on Uniswap V3 testnet
5. Test everything thoroughly

**Success metrics**:
- ✅ Contract deploys without errors
- ✅ Can mint SPK from oracle
- ✅ Can trade SPK/USDC on DEX
- ✅ Peg mechanism works under stress test
- ✅ Redemption function works

**Owner**: Solidity dev  
**Timeline**: 1 week  
**Cost**: $5K-$10K (testing + deployment)

---

### Week 5: Audit & Hardening

**What to do**:
1. Internal security review (gas optimization, exploit vectors)
2. Load testing (can handle 1000 TPS?)
3. Emergency pause mechanism
4. Oracle redundancy
5. Testnet bug fixes

**Success metrics**:
- ✅ No critical vulnerabilities
- ✅ Gas costs <$1 per transaction
- ✅ Can pause minting if attacked
- ✅ Testnet runs for 1 week stable

**Owner**: Solidity dev + security expert  
**Timeline**: 1 week  
**Cost**: $10K-$20K (can do lighter audit, full audit is $30K+)

---

### Week 6: Deploy to Polygon Mainnet

**What to do**:
1. Final contract review
2. Deploy to Polygon mainnet
3. Fund with $10K initial liquidity (SPK + USDC)
4. Add to Uniswap V3
5. Announce to community (Twitter, Discord)

**Success metrics**:
- ✅ Contract live on Polygon mainnet
- ✅ SPK/USDC trading active
- ✅ First trades execute
- ✅ Peg holds within ±5%

**Owner**: Solidity dev + DevOps  
**Timeline**: 1 day (deployment itself is fast)  
**Cost**: $500 (gas fees)

---

### Week 7: Community & Grant Prep

**What to do**:
1. Launch Discord community
2. Build website (basic: whitepaper + docs)
3. Prepare grant application
4. Email energy companies (ask to be reference)
5. Gather feedback from traders

**Success metrics**:
- ✅ 1K+ Twitter followers
- ✅ 500+ Discord members
- ✅ $500K+ trading volume
- ✅ 3 energy companies interested
- ✅ Grant applications submitted

**Owner**: You + community manager  
**Timeline**: 1 week  
**Cost**: $5K (website, marketing)

---

### Week 8: Iterate Based on Feedback

**What to do**:
1. Monitor peg stability (adjust parameters if needed)
2. Fix bugs from user feedback
3. Optimize gas costs
4. Prepare grant presentations
5. Plan Phase 2 (sidechain research IF funded)

**Success metrics**:
- ✅ Peg stable ±3% (not ±5%)
- ✅ Zero critical bugs
- ✅ Users happy (reviews/feedback)
- ✅ Grant interest (3+ applications in flight)

**Owner**: You + dev team  
**Timeline**: 1 week  
**Cost**: $5K (iteration)

---

## Budget Summary (8 Weeks)

```
Solidity development:    $25K-50K
Testing + security:      $10K-20K
Deployment + gas:        $1K
Community/marketing:     $5K
Contingency (10%):       $4K-6K
─────────────────────────────────
TOTAL:                   $45K-80K
```

**If you don't have it**: Apply for Gitcoin/Polygon grants (should cover this)

---

## What Happens After Week 8?

### If Traction is Good

```
Month 3:
├─ $1M+ trading volume
├─ 10K+ users
├─ Real utility company interest
└─ Multiple grants approved

Decision point:
├─ Option A: Stay on Polygon (it's working!)
├─ Option B: Use grant $ to build sidechain + bridge
└─ Option C: Both (Polygon + sidechain coexist)
```

### If Needs Custom Sidechain

```
Month 4-8: Build custom sidechain (if funded)
├─ Fork Polygon or use Cosmos SDK
├─ Customize for energy
├─ Deploy on separate infrastructure
├─ Create bridge (Polygon ↔ Sidechain)
└─ Users migrate gradually

Month 9+: Sidechain becomes primary
├─ Polygon SPK becomes fallback
├─ Bridge maintains liquidity
├─ Real grid integration (CAISO, Taipower)
└─ Full solarpunk ethos
```

---

## Why This Plan Works

### ✅ Advantages

1. **Speed**: 8 weeks to mainnet (vs. 6 months custom chain)
2. **Proof**: Real users, real traction, real feedback
3. **Funding**: Grants are easier with working MVP
4. **Optionality**: Can sidechain later if needed
5. **Risk**: If doesn't work, you only wasted $50K (not $500K)

### ❌ Tradeoffs

1. **Not fully decentralized** (dependent on Polygon validators)
2. **Less customizable** (bound by Polygon's consensus)
3. **Fee dependency** (Polygon sets minimum gas fees)
4. **Escape risk** (can always migrate later if needed)

**Verdict**: Worth it. Prove concept first, optimize later.

---

## Critical Path Items (Do These First)

### This Week (Dec 9-15)

- [ ] **You**: CEIR analysis (Priority 1)
- [ ] **You**: Yuan Ze specs (Priority 2)
- [ ] **You**: Create grant pitch document
- [ ] **You**: Email 3 energy companies (ask for reference)
- [ ] **Hire**: Solidity developer (post on Upwork/Angel List)

### Week 2 (Dec 16-22)

- [ ] **Solidity dev**: Write initial contract
- [ ] **You**: Review contract + provide feedback
- [ ] **Solidity dev**: Deploy to testnet
- [ ] **You**: Apply to Gitcoin Grants
- [ ] **You**: Apply to Polygon Grants

### Week 3 (Dec 23-29)

- [ ] **Solidity dev**: Testing + bug fixes
- [ ] **You**: Community setup (Discord, Twitter, website)
- [ ] **You**: Follow up on grant applications

### Week 4+ (Jan+)

- [ ] **Solidity dev**: Mainnet deployment
- [ ] **You**: Monitor + iterate
- [ ] **You**: Gather traction/feedback
- [ ] **You**: Decide on Phase 2 (sidechain or not)

---

## Hiring: Solidity Developer

### What you need
- ERC-20 implementation ✅
- Oracle integration ✅
- Testing + deployment ✅
- Budget: $25K-$50K for full 8 weeks

### Where to find
- **Upwork**: Search "Solidity ERC-20 developer" (hourly)
- **Angel List**: Talent search (job listing)
- **Fiverr**: Smaller tasks ($500-$2K each)
- **Ethereum Foundation Grants**: Funded developers
- **Local universities**: CS grad students

### What to ask in interview
1. "Show me a working ERC-20 token you deployed"
2. "Can you integrate Chainlink oracle?"
3. "Have you done smart contract audits?"
4. "Can you work in 2-3 week sprints?"
5. "What's your rate and availability?"

---

## Next Immediate Steps (Today/Tomorrow)

### For You

1. **Read**: POLYGON_ARCHITECTURE_EXPLAINED.md (just created)
2. **Start**: CEIR analysis (your Priority 1 research)
3. **Email**: Yuan Ze facilities team (your Priority 2 research)
4. **Draft**: Grant pitch (1-2 pages)
5. **Email**: Upwork/Angel List job posting for Solidity dev

### For Us (AI)

I'm ready to help with:
- ✅ Solidity contract review (give you early feedback)
- ✅ Testing strategy (how to validate contract works)
- ✅ Grant writing (help craft pitch)
- ✅ Oracle integration design (Chainlink hookups)
- ✅ Deployment checklist (what to test before mainnet)

---

## Success Criteria (By End of Week 8)

- ✅ SolarPunkCoin deployed on Polygon mainnet
- ✅ Trading live on Uniswap V3
- ✅ Peg stable within ±5% (ideally ±3%)
- ✅ 500+ users
- ✅ $100K-$1M trading volume
- ✅ 3+ energy companies interested in redemption
- ✅ 2+ grants approved (ideally $100K+)
- ✅ Clear data on whether sidechain is needed
- ✅ Community of 1K+ (Discord + Twitter)

If you hit even 70% of these, you've got a viable project that can raise future funding.

---

## The Bigger Picture

You now have:
- ✅ Production-grade pricing library (spk-derivatives)
- ✅ Solid research (CEIR + stablecoin architecture)
- ✅ Clear development path (Polygon MVP in 8 weeks)
- ✅ Funding strategy (grants + community)
- ✅ Future optionality (sidechain upgrade path)

**You're not overthinking. You're executing smart.**

---

**Document Status**: Action plan ready  
**Commit**: 26f98dd  
**Next**: Start Week 1 priorities (your turn)
