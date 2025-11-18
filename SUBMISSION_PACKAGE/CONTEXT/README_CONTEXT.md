# Context Documents (Optional Reading)

These documents provide background context for the Energy Derivatives Pricing Framework but are **not required** for understanding or running the coursework project.

---

## Documents Included

### 1. CEIR-Trifecta.md (674 lines)
**Title:** "When Does Energy Cost Anchor Cryptocurrency Value? Evidence from a Triple Natural Experiment"

**Summary:** Academic research paper establishing the CEIR (Cumulative Energy Investment Ratio) framework. Uses three natural experiments (baseline period, China mining ban, Ethereum merge) to empirically test when and how energy consumption anchors cryptocurrency market value.

**Key Finding:** Energy anchors value only under concentrated mining with proof-of-work consensus.

**Relevance to Project:** Provides theoretical justification for using energy-based valuation metrics in derivative pricing.

---

### 2. Derivatives-context.md (573 lines)
**Title:** Technical specification for energy derivatives pricing methods

**Summary:** Detailed mathematical framework covering:
- Binomial tree methodology
- Monte-Carlo simulation approach
- Greeks calculation methods
- Payoff structures (European calls, redeemable claims)
- Connection to CEIR foundation

**Relevance to Project:** Technical documentation that informed the implementation design.

---

### 3. Final-Iteration.md (458 lines)
**Title:** SolarPunkCoin (SPK) - Complete Token Design

**Summary:** Design document for a renewable energy-backed stablecoin including:
- Economic failure mode analysis (10 modes addressed)
- Institutional design rules
- DSGE macroeconomic modeling
- Agent-based simulation framework
- Policy integration pathway

**Relevance to Project:** The derivatives pricing framework enables SPK tokens to be traded and hedged in financial markets. Shows practical application of the coursework.

---

## How These Connect to the Coursework

### The Research Stack

```
Layer 1: CEIR Research (Academic Foundation)
    ↓ Proves energy can anchor digital asset value

Layer 2: SolarPunkCoin Design (Applied Concept)
    ↓ Designs renewable energy-backed token

Layer 3: Derivatives Framework (Coursework) ← YOU ARE HERE
    ↓ Provides pricing and risk management tools

Layer 4: Smart Contract Implementation (Future)
    ↓ On-chain deployment

Layer 5: Market Infrastructure (Future)
    ↓ Exchange integration
```

### Why This Matters

**Without these documents:** The coursework is a standalone derivatives pricing project using Bitcoin data as a proxy for energy-backed assets.

**With these documents:** The coursework is part of a larger research program building financial infrastructure for renewable energy-backed digital currency.

---

## Reading Priority

### For Coursework Grading (Not Necessary)
These documents are **optional context only**. The coursework project (`energy_derivatives/`) stands alone and can be understood and graded without reading these.

### For Understanding the Bigger Picture (Recommended)
If you want to understand why this specific pricing problem matters:

1. **Start here:** `Final-Iteration.md` (Section 1-3) - Explains the SPK token concept (15 min read)
2. **Then:** `CEIR-Trifecta.md` (Abstract + Section 1) - Explains why energy matters for pricing (10 min read)
3. **Finally:** `Derivatives-context.md` (Section 2-4) - Technical methodology background (20 min read)

**Total optional reading time:** ~45 minutes

---

## Academic Context

These documents represent:
- **CEIR-Trifecta:** Peer-reviewed research methodology (desk-rejected for policy, not methodology)
- **Derivatives-context:** Technical specification document
- **Final-Iteration:** Applied design document with DSGE modeling

Combined, they provide ~1,700 lines of background research supporting the derivatives pricing framework.

---

## Note for Graders

These context documents are provided for completeness but are **not part of the coursework submission**. The `energy_derivatives/` project should be evaluated independently based on:

- Implementation quality
- Methodology rigor
- Empirical validation
- Documentation completeness
- Results accuracy

The broader research context (CEIR framework, SPK design) may provide interesting background but should not factor into coursework assessment.

---

## File Statistics

| Document | Lines | Topic | Status |
|----------|-------|-------|--------|
| CEIR-Trifecta.md | 674 | Research paper | Complete |
| Derivatives-context.md | 573 | Technical spec | Complete |
| Final-Iteration.md | 458 | Token design | Complete |
| **Total** | **1,705** | Background | Complete |

---

*These documents are included for academic context only. The coursework project in `energy_derivatives/` is self-contained and fully functional without them.*
