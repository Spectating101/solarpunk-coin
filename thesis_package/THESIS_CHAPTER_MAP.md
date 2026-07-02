# Thesis Chapter Map

## Proposed Thesis Title

Energy as a Constraint: Credibility, Pricing, and Settlement in Energy-Linked Digital Finance

## Core Thesis

Energy can provide a credible constraint for digital money only when it is embedded in a rule-based financial architecture with **five integrated constraints**: reliable energy data, rule-bound issuance, explicit pricing and risk controls, protected settlement and redemption accounting, and limited governance.

**Reader's guide:** `thesis_package/THESIS_READERS_GUIDE.md` — chapter digests, canonical numbers, oral-defense cheat sheet.

Each chapter draft opens with an **At a glance** table and ends with a **Key takeaway** blockquote (where applicable).

## Chapter Structure

### Chapter 1 - Introduction

Purpose: introduce the problem of monetary credibility, explain why energy is worth studying, state the research question, and define the evidence path.

Main output: the reader understands that energy-linked financial contracts are the practical mechanism for testing energy as a constraint on digital monetary issuance and settlement.

Current file: `thesis_package/CHAPTER_1_GROUNDED_DRAFT.md`

Build: `npm run thesis:docx` → `thesis_package/output/THESIS_GROUNDED.docx`

### Chapter 2 - Literature Review and Theoretical Background

Purpose: review monetary credibility, gold and Bretton Woods, fiat money, Bitcoin proof-of-work, Bitcoin energy-cost valuation, renewable-energy finance, pricing theory, and programmable settlement; identify the integrated research gap.

Main output: a grounded framework for evaluating energy as a constraint without claiming energy automatically becomes money.

Planned file: `thesis_package/CHAPTER_2_GROUNDED_DRAFT.md`

### Chapter 3 - Empirical Evidence from Bitcoin Energy Costs

Purpose: test whether energy cost appears to matter in an existing digital market, using Bitcoin mining energy cost and the China mining-ban shock as the primary evidence.

Main output: energy anchoring appears conditional, not automatic. This motivates designed rules instead of relying on passive market coordination.

Planned file: `thesis_package/CHAPTER_3_GROUNDED_DRAFT.md`

### Chapter 4 - Pricing Renewable-Energy Risk

Purpose: show how renewable-energy-linked financial contracts can be priced when the underlying energy source is variable, local, and not directly traded as a liquid derivative.

Main output: a reproducible pricing and risk method using public energy data, volatility estimation, numerical validation, and stress/margin analysis.

Planned file: `thesis_package/CHAPTER_4_GROUNDED_DRAFT.md`

### Chapter 5 - Constraints Framework and Proof-of-Concept Implementation

Purpose: specify the minimum rules required for energy-linked digital finance to be credible: verified data, rule-bound issuance, explicit pricing, collateral/reserve-backed settlement, and governance delay.

Main output: a constraints framework plus proof-of-concept smart contract implementation. The implementation is feasibility evidence, not production readiness.

Planned file: `thesis_package/CHAPTER_5_GROUNDED_DRAFT.md`

### Chapter 6 - Conclusion

Purpose: answer the research question, summarise findings, state limitations, identify falsification paths, and define future work.

Main output: the thesis ends as a bounded research contribution, not a product launch claim.

Planned file: `thesis_package/CHAPTER_6_GROUNDED_DRAFT.md`

## Continuity Rules

- Use plain wording first; introduce technical labels only after the reader understands the concept.
- Avoid presenting SolarPunk/SPK as the thesis identity. Treat it as proof-of-concept evidence in Chapter 5.
- Do not claim energy automatically backs money.
- Keep Bitcoin as empirical evidence, not the whole thesis.
- Keep Ethereum as supporting comparison, not the primary identification event.
- Clearly separate resource potential from actual site-level production.
- Clearly separate proof-of-concept implementation from production readiness.
- Keep the repeated through-line: credibility requires verifiable limits.
