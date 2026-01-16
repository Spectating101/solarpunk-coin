# Research: Solidity Stablecoin Architecture Patterns

**Author**: Lead Engineer (Research Phase)  
**Date**: December 9, 2025  
**Status**: ACTIVE RESEARCH  
**Objective**: Identify which stablecoin mechanisms work best for SPK

---

## Executive Summary

After analyzing 6 major stablecoin projects, we find:

- **DAI (MakerDAO)**: Overcollateralization works, but requires external collateral
- **USDC/USDT**: Simplest, but centralized and regulatory-heavy
- **UST (Terra)**: Algorithmic approach FAILED spectacularly ($40B collapse)
- **FRAX**: Hybrid model (50% collateral + 50% algorithmic) most resilient
- **Celo**: Energy-aware blockchain with cUSD stablecoin (most relevant!)
- **sUSD (Synthetix)**: Debt pool model (complex but interesting)

**Recommendation for SPK**: Hybrid model (30-50% energy-backed + 50-70% algorithmic) with utility company redemption guarantee as backstop.

---

## 1. DAI (MakerDAO) - Overcollateralized Model

### 1.1 How It Works

**Core mechanism**: You lock collateral (ETH, USDC, etc.), mint stablecoin (DAI)

```solidity
// Simplified DAI logic
collateral_amount → 150% ratio → DAI_minted = collateral / 1.5

Example:
Lock 1.5 ETH (worth $4,500) → Mint 3,000 DAI
```

**Peg maintenance**:
- If DAI price > $1: Minting is profitable → supply increases → price falls
- If DAI price < $1: Minting is unprofitable → supply decreases → price rises
- **Stability fee**: Borrowers pay interest to borrow, discourages over-minting

**Key parameters**:
- Collateral ratio: 150% (liquidation at 150%, urgent at 170%)
- Stability fee: ~3-8% annually
- Target price: $1 USD
- Governance: MKR token holders vote on parameters

### 1.2 Strengths & Weaknesses

**Strengths**:
✅ Proven track record (since 2015, $5B+ DAI minted)
✅ Fully decentralized (no custodian needed)
✅ Works across market cycles
✅ Can scale to large market caps
✅ Transparent governance (on-chain voting)

**Weaknesses**:
❌ Requires external collateral (ETH, USDC, others)
❌ High collateral ratio (150%) means capital inefficient
❌ Complex system (many parameters to tune)
❌ Requires on-chain liquidation system (risk of flash loan attacks)
❌ Governance risk (MKR voters control system)

### 1.3 Why DAI Doesn't Work for SPK

**Problem**: We want collateral to be **energy itself**, not ETH or USDC.

But energy is:
- Intangible (can't lock it on-chain)
- Time-sensitive (curtailment must happen NOW, not in future)
- Decentralized (spread across many solar panels)

**Therefore**: DAI's overcollateralization model doesn't translate directly. We need something tied to energy flows in real-time, not locked assets.

### 1.4 Relevant Code Pattern

The one useful pattern from DAI is the **feedback mechanism**:

```solidity
// DAI's approach: Peg via arbitrage
if (DAI_price > $1.00) {
    // Minting is profitable
    // Borrowers mint more DAI
    // Supply increases
    // Price falls back toward $1
}
```

**For SPK**, we could adapt this:

```solidity
// SPK's approach: Peg via curtailment feedback
if (SPK_price > target_price) {
    // Mint from curtailment is profitable
    // Oracle mints more SPK from surplus
    // Supply increases
    // Price falls back toward target
}
```

---

## 2. USDC (Circle) - Fiat-Backed Model

### 2.1 How It Works

**Simple model**: Every USDC is backed 1:1 by USD in a bank account

```
Circle Reserve (USD Bank Account) ← 1:1 backed by → USDC on blockchain
$1 reserve ↔ 1 USDC issued
```

**Redemption**: Users can burn USDC and withdraw USD (requires KYC)

**Peg maintenance**: If USDC < $0.99, arbitrageurs buy and redeem for $1 profit

### 2.2 Strengths & Weaknesses

**Strengths**:
✅ Ultra-stable (always backed 1:1)
✅ Simple to understand and audit
✅ Regulatory compliant (in most jurisdictions)
✅ Listed on major exchanges
✅ Enterprise adoption (Coinbase, Kraken use USDC)

**Weaknesses**:
❌ Centralized (Circle controls reserve)
❌ Regulatory risk (if Circle loses USD, token collapses)
❌ Requires KYC/AML (privacy concerns)
❌ Dependent on fiat banking system
❌ Doesn't align with SPK's decentralization goals

### 2.3 Why USDC Doesn't Work for SPK

**Problem**: SPK should be **backed by energy**, not USD.

USDC outsources stability to the US dollar (which itself is becoming volatile). We want intrinsic backing.

### 2.4 Relevant Code Pattern

The redemption mechanism is useful:

```solidity
// USDC: Redemption for backing asset
function redeem(uint256 amount) {
    burn(msg.sender, amount);
    // Off-chain: Circle sends USD to bank account
}
```

**For SPK**, we adapt:

```solidity
// SPK: Redemption for energy
function redeem(uint256 amount) {
    burn(msg.sender, amount);
    // Off-chain: Utility delivers kWh to customer
    // Or: Customer gets $ credit on utility bill
}
```

---

## 3. UST (Terra) - Algorithmic Model (FAILED)

### 3.1 How It Worked (Before Collapse)

**Mechanism**: No collateral. Peg maintained purely through arbitrage.

```
If UST > $1:
    - Mint 1 LUNA (worth $1)
    - Get 1 UST (worth $1+)
    - Profit: Sell UST for > $1, keep LUNA = arbitrage gain

If UST < $1:
    - Burn 1 UST (worth $1-)
    - Get 1 LUNA (worth $1)
    - Profit: LUNA > UST price, arbitrage gain
```

**The idea**: Arbitrage forces UST to $1

### 3.2 Why It Collapsed ($40B Loss)

**May 2022**: UST peg broke. Why?

1. **Bank run psychology**: Someone dumps UST for $0.98
2. **Contagion**: Everyone fears peg breaking → mass selling
3. **Arbitrage failure**: If panic is fast enough, arbitrage can't keep up
4. **Death spiral**: More UST → more LUNA printed → LUNA price crashes → arbitrage profit disappears → death
5. **Final result**: UST → $0.10, LUNA → $0 (hyperinflation of supply)

**Timeline**:
- May 6: UST at $0.98 (beginning of peg loss)
- May 7: UST at $0.50 (panic spreading)
- May 8: UST at $0.10 (death spiral)
- May 12: UST at $0.01 (complete collapse)

**Lesson**: Purely algorithmic stablecoins are fragile. Confidence is everything. When confidence breaks, there's nothing to catch the fall.

### 3.3 Why UST's Model Doesn't Work for SPK

**Terra's critical flaw**: It assumed arbitrage traders would always step in during a panic. But:
- Arbitrage requires capital
- When system collapses, arbitrageurs also lose money
- No trader wants to be the last person buying UST at $0.50

**For SPK**: We can't rely on arbitrage alone. We need **tangible backing** (energy).

### 3.4 The Irrelevant Code Pattern

UST's code was straightforward (and that was the problem):

```solidity
// UST's naive arbitrage mechanism
function stabilize() {
    if (UST_price < 1e18) {
        // Mint LUNA, hope traders buy UST
        LUNA.mint(amount);
    }
}
```

**Don't do this for SPK.** It doesn't work.

---

## 4. FRAX (Frax Finance) - Hybrid Collateral Model

### 4.1 How It Works

**Hybrid approach**: FRAX is backed 50% by USDC + 50% by algorithmic incentives

```
1 FRAX = 0.50 USDC (on-chain collateral) + 0.50 Algorithmic Credit

Example:
Mint 1 FRAX = Deposit 0.50 USDC + Provide 0.50 FXS as collateral
```

**How the 50% algorithmic part works**:

```
If FRAX < $1:
    - Minting profit increases (better rate)
    - Validators want to mint more FRAX
    - Supply increases
    - Price rises

If FRAX > $1:
    - Minting profit decreases (worse rate)
    - Validators don't want to mint
    - Supply stays flat
    - Price falls
```

**Dynamic collateral ratio**: As trust builds, FRAX can move from 100% collateral to 50% to 10%

```
Phase 1: 100% USDC backing (bootstrap, max stability)
Phase 2: 75% USDC + 25% algorithmic (as protocol gains trust)
Phase 3: 50% USDC + 50% algorithmic (mature, capital efficient)
```

### 4.2 Strengths & Weaknesses

**Strengths**:
✅ Hybrid: Gets stability (50% cash) + efficiency (50% algorithmic)
✅ Can scale beyond collateral (starts with collateral, grows into algorithmic)
✅ Still working (unlike UST, FRAX has survived 2022-2025 downturns)
✅ Lower collateral requirements than DAI
✅ Decentralization can increase over time

**Weaknesses**:
❌ Requires USDC reserve (need to manage stablecoin liquidity)
❌ Complex (two-token system: FRAX + FXS)
❌ Still depends on FXS token value (if FXS crashes, system breaks)
❌ Governance complexity (parameters constantly adjusted)
❌ Flash loan risks (still has liquidation/arbitrage mechanics)

### 4.3 Why FRAX Is Close to SPK (But Not Perfect)

**Similarities**:
- Both use hybrid backing (collateral + algorithmic)
- Both can dynamically adjust collateral ratios
- Both designed for long-term stability + scalability

**Differences**:
- FRAX's collateral is USDC (fiat-backed)
- SPK's collateral should be energy (commodity-backed)
- FRAX targets $1 USD
- SPK targets wholesale energy price (changes hourly)

### 4.4 Relevant Code Pattern - FRAX's Hybrid Model

```solidity
// Simplified FRAX hybrid minting
function mint(uint256 usdc_amount, uint256 fxs_amount) {
    // Requires mix of USDC + FXS
    // Current ratio: 50/50
    require(fxs_amount == usdc_amount); // For 50% backing
    
    // Mint FRAX
    frax.mint(msg.sender, usdc_amount + fxs_amount);
}

function redemption_ratio() returns (uint256) {
    // Can change over time as protocol matures
    // Start: 100% USDC (100% collateral)
    // Later: 50% USDC (50% collateral)
    // Eventually: 10% USDC (90% algorithmic)
    return collateral_percentage;
}
```

**For SPK, we adapt**:

```solidity
// SPK's hybrid minting
function mint_from_surplus(
    uint256 curtailment_kwh,
    uint256 usdc_backstop
) {
    // Requires mix of verified energy + USDC reserve
    // Current ratio: 70% energy / 30% USDC
    require(usdc_backstop == (curtailment_kwh * alpha) / 3);
    
    // Mint SPK
    spk.mint(msg.sender, curtailment_kwh * alpha);
}
```

---

## 5. Celo (cUSD) - Energy-Aware Blockchain Model

### 5.1 How It Works

**Key difference**: Celo is a blockchain designed for mobile + sustainability

**cUSD stablecoin**:
- Backed by basket of assets (USDC, Celo Gold, algorithmic)
- Designed for low-fee transactions on mobile
- Emphasis on sustainability (proof-of-stake, carbon-neutral)

**Peg mechanism**:
- Reserve of USDC + CELO (native token)
- If cUSD < $1: System buys cUSD using reserves
- If cUSD > $1: System mints more cUSD
- Stability fees paid to validators

**Why Celo is relevant**: It's designed for on-chain stability in resource-constrained (mobile) environments, similar to our energy constraint

### 5.2 Why Celo Is Most Relevant to SPK

**Similarities**:
✅ Both are **resource-backed** (Celo: Celo Gold native token; SPK: energy surplus)
✅ Both have **sustainability focus** (Celo: carbon-neutral; SPK: renewable-energy-backed)
✅ Both designed for specific user base (Celo: mobile/unbanked; SPK: renewable producers)
✅ Both use **mixed backing** (collateral + algorithmic)
✅ Both are smaller/niche (not trying to replace USD globally)

**Key insight**: Celo doesn't try to be **the** global stablecoin. It's specialized. SPK should be too.

### 5.3 Celo's Peg Mechanism (Most Useful Pattern)

```solidity
// Celo's approach: Reserve-based peg
contract StabilityProtocol {
    // Reserve holds USDC, Celo Gold, other assets
    mapping(address => uint256) reserve;
    
    function stabilize_price(uint256 current_price) {
        if (current_price < target_price) {
            // Buy cUSD using reserve
            reserve.withdraw(amount);
            buy_cUSD_on_market(amount);
            // Reduces supply, increases price
        } else if (current_price > target_price) {
            // Mint and sell cUSD
            // Increases supply, decreases price
        }
    }
}
```

**For SPK**:

```solidity
// SPK's reserve-based peg
contract SPKStabilityProtocol {
    // Reserve holds USDC + Tokenized Energy Credits
    uint256 usdc_reserve;
    uint256 energy_credit_reserve;
    
    function stabilize_price(uint256 current_price, uint256 target) {
        int256 deviation = int256(current_price) - int256(target);
        
        if (deviation < 0) {
            // Price too low: buy SPK using USDC reserve
            usdc_reserve.withdraw(amount);
            buy_SPK_on_market(amount);
        } else if (deviation > 0) {
            // Price too high: mint SPK from energy surplus
            new_surplus = oracle.get_curtailment();
            mint_spk_from_surplus(new_surplus);
        }
    }
}
```

---

## 6. Synthetix (sUSD) - Debt Pool Model

### 6.1 How It Works

**Unique approach**: Stablecoin backed by synthetic assets (derivatives)

```
Users stake SNX (native token)
→ They can mint sUSD up to 750% collateral ratio
→ sUSD is debt obligation to the pool
→ Multiple users' debt is pooled together
→ Staking yields come from trading fees on synthetics
```

**Why it works**: Pooled debt means individual volatility is hedged (one person's loss on one synthetic is another's gain on opposite)

### 6.2 Why Synthetix Doesn't Work for SPK

**Problem**: Synthetix requires pools of SNX stakers. We don't have that.

Synthetix works for derivatives platform. SPK is a stablecoin pegged to energy price, not a betting pool.

### 6.3 Irrelevant for SPK (Skip)

This model is too specialized for derivatives trading. Not applicable.

---

## 7. Comparative Analysis Table

| Feature | DAI | USDC | UST | FRAX | Celo | SPK (Target) |
|---------|-----|------|-----|------|------|--------------|
| **Stability** | Good (98-102%) | Excellent (99.99%) | FAILED | Good (98-101%) | Good (98-101%) | ? (Target: 99-101%) |
| **Decentralization** | High | Low | Low | Medium | Medium | High |
| **Capital Efficiency** | Low (150% collateral) | N/A (cash) | High (0%) | Medium (50%) | Medium | Medium (50%) |
| **Collateral Type** | Multi-asset (ETH, USDC, etc.) | USD cash | None | USDC + FXS | Celo Gold + USDC | Energy surplus + USDC |
| **Peg Target** | $1 USD | $1 USD | $1 USD | $1 USD | $1 USD | Wholesale energy price ($) |
| **Maturity** | Mature (10y) | Mature (5y) | Dead | Young (3y) | Young (4y) | Not built yet |
| **On-chain Redemption** | Complex (liquidation) | Requires KYC | N/A | Complex (FXS swap) | Simple (reserve) | Simple (energy delivery) |
| **Governance** | Decentralized (MKR) | Centralized (Circle) | Decentralized (LUNA) | Decentralized (FXS) | Hybrid (Celo) | Should be Decentralized (DAO) |
| **Risk Factors** | Complex params | Regulatory | Contagion | FXS volatility | Celo Gold price | Oracle accuracy, utility adoption |

---

## 8. Synthesis: Best Architecture for SPK

### 8.1 Recommended Model: "Hybrid Energy-Backed Stablecoin"

Combining best elements:

**From DAI**: Feedback mechanism (arbitrage keeps peg)
**From FRAX**: Hybrid collateral (energy + USDC reserve)
**From Celo**: Resource-backed philosophy (native asset as backing)
**From USDC**: Simple redemption (utility companies accept SPK)
**Avoiding UST**: No pure algorithmic approach (always have real backing)

### 8.2 SPK Architecture Specification

```solidity
// SPK Tokenomics
TARGET_PRICE = wholesale_energy_price(t)  // Changes hourly
COLLATERAL_RATIO = 60%  // 60% energy surplus, 40% USDC reserve
PEG_BAND = ±5%  // Maintain within ±5% of target
STABILITY_FEE = 0.5% annually  // For redemption arbitrage incentive

// Minting Rules
if (curtailment > threshold) {
    // Oracle verified surplus exists
    SPK_mint = curtailment_kwh * ALPHA  // ALPHA ≈ 0.5 SPK per kWh
    // Backed by: 60% energy (supply-side), 40% USDC (reserve)
}

// Peg Maintenance
if (SPK_price > TARGET + PEG_BAND) {
    // Price too high: mint more (supply increase)
    // From oracle-verified curtailment
}

if (SPK_price < TARGET - PEG_BAND) {
    // Price too low: burn or use USDC reserve to buy
    // Reserve buying (Celo mechanism)
}

// Redemption
1 SPK = 1 kWh of electricity redeemable at utilities
      = Fallback: USDC value of 1 kWh at current wholesale price
```

### 8.3 Why This Works for SPK

✅ **Decentralized**: Utility companies run nodes (like Celo validators)
✅ **Resource-backed**: Energy is real, tangible, valuable
✅ **Scalable**: Can grow from 100% USDC backing (bootstrap) to 60% (mature)
✅ **Stable**: Hybrid collateral provides stability cushion
✅ **Simple**: Redemption is clear (1 SPK = 1 kWh)
✅ **Proven patterns**: Uses mechanics from working systems (DAI, FRAX, Celo)
✅ **Avoids UST mistakes**: Never pure algorithmic
✅ **Aligned with vision**: Energy-backed, utility-partnered, renewable-focused

---

## 9. Risk Analysis: What Could Break SPK?

### 9.1 Oracle Risk (CRITICAL)

**Risk**: If curtailment oracle is wrong or attacked, SPK could mint without real backing

**Mitigation**:
- Multi-signature validation (3-of-5 utilities verify curtailment)
- Redundant data sources (CAISO + Taipower + direct smart meters)
- Time-delay (don't mint instantly, wait for confirmation)
- Emergency pause (grid operator can halt minting if anomaly detected)

### 9.2 Utility Adoption Risk (CRITICAL)

**Risk**: If utilities won't redeem SPK for energy, token loses value

**Mitigation**:
- Pre-commitment (sign MOU with utilities before launch)
- Regulatory clarity (get legal approval before minting)
- Fallback redemption (USDC reserve always available)
- Staggered rollout (start with one utility, scale slowly)

### 9.3 Flash Loan / Arbitrage Risk (MODERATE)

**Risk**: Attacker uses flash loan to manipulate price and profit

**Mitigation**:
- Minimum time between peg adjustments (no instant minting)
- Liquidity requirements (need $10M+ to move price meaningfully)
- Trusted oracle (attacker can't fake curtailment data)
- Governance safeguard (DAO can pause minting if attack suspected)

### 9.4 Regulatory Risk (HIGH UNCERTAINTY)

**Risk**: Regulator declares SPK is a security, requires registration

**Mitigation**:
- Early regulatory dialogue (get SEC/FinCEN guidance)
- Jurisdiction selection (Taiwan may be more permissive than US)
- Legal structure (DAO vs. LLC vs. international foundation)
- Compliant features (KYC for large redemptions, AML monitoring)

### 9.5 Market Adoption Risk (MODERATE)

**Risk**: No one wants to buy SPK; liquidity dries up

**Mitigation**:
- Launch on established DEX (Curve, Uniswap v3)
- Incentive program (LM rewards, yield farming)
- Institutional partnerships (energy companies' treasuries)
- Use case (utilities reward customers with SPK for load shifting)

---

## 10. Recommendation Summary

### 10.1 Contract Architecture

**Recommended implementation**:

```
Smart Contracts (Solidity):
├── SolarPunkCoin.sol (ERC-20 token)
├── Minting.sol (Oracle-gated, curtailment-linked minting)
├── Peg.sol (Feedback mechanism + price oracle)
├── Reserve.sol (USDC reserve management)
├── Redemption.sol (Energy + USDC redemption)
└── Governance.sol (Multi-sig + DAO voting)

Data Layer:
├── Chainlink oracle (CAISO, Taipower curtailment feeds)
├── Price oracle (wholesale energy price)
├── Grid operator feeds (reserve margin, stress alerts)
└── Multi-signature validation (utility co-signers)

Off-chain:
├── Utility billing integration (for redemption processing)
├── Smart meter APIs (energy data collection)
├── Monitoring dashboard (peg health, reserve ratio, etc.)
└── DAO governance interface (voting on parameter changes)
```

### 10.2 Parameters to Set (Research-Driven)

Once research is complete, we'll specify:
- **α (issuance coefficient)**: SPK per kWh (recommend: 0.5 based on pricing)
- **γ (feedback parameter)**: % of supply to adjust per peg deviation
- **δ (peg band)**: Acceptable deviation (±5%?)
- **Collateral ratio**: 60% energy / 40% USDC?
- **Stability fee**: Annual redemption cost (0.5%?)
- **Reserve minimum**: Always maintain 5-10% USDC?
- **Emergency circuit breaker**: When to halt minting?

### 10.3 Next Steps

1. ✅ **Document this research** (done)
2. **Validate with:** Blockchain engineers, DeFi researchers, utility companies
3. **Simulate:** Use scenarios (Section 9 of main research doc) to test mechanics
4. **Refine:** Iterate on parameters until robust to attacks
5. **Specify:** Write exact Solidity spec based on validated model

---

## 11. References & Further Reading

**Core Papers**:
- Nakamoto, S. "Bitcoin: A Peer-to-Peer Electronic Cash System" (2008)
- Buterin, V. "Ethereum: A Next-Generation Smart Contract Platform" (2013)
- Maker Team. "Multi-Collateral DAI System Specification" (2019)
- Frax Finance. "FRAX Whitepaper: A Fractional-Algorithmic Stablecoin Protocol" (2021)

**Research**:
- Neuder et al. "Optimal Fees for Geometric Mean Market Makers" (2020)
- Voshmgir, S. "Tokenomics: How Incentives & Technology Can Build Better Systems" (2019)
- Catalini, C., Gans, J. "Some Simple Economics of the Blockchain" (2019)

**Stablecoin Docs**:
- https://docs.makerdao.com/
- https://frax.finance/
- https://docs.celo.org/celo-owner-guide/getting-started/
- https://docs.uniswap.org/

**Energy Markets**:
- CAISO OASIS API: http://oasis.caiso.com/
- Taipower Data: https://www.taipower.com.tw/
- Energy Economics Journal: https://www.elsevier.com/journals/energy-economics/

---

**Document Status**: ACTIVE RESEARCH  
**Last Updated**: December 9, 2025  
**Next Update**: After completing validation simulations
