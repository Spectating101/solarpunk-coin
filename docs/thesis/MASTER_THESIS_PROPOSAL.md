# Master's Thesis Proposal

**Working title:** Energy-Indexed Crypto-Financial Instruments: Theory, Smart Contract Implementation, and Empirical Validation of the SolarPunk Prototype

**Degree:** Master of Science in Finance

**Proposed timeline:** 6 months

**Recommended scope:** 40,000-60,000 words, 6-8 chapters, with 1-2 extractable papers

**Status:** Proof-of-concept research with tested smart contracts, empirical analysis, simulation tooling, a public Sepolia proof surface, and a reviewer-facing demo. The work is not positioned as a production stablecoin, audited protocol, or completed market deployment.

---

## Executive Summary

This thesis studies whether renewable energy production can serve as a credible reference anchor for crypto-financial instruments. Rather than claiming that energy backing solves stablecoin design outright, the thesis asks a narrower and more defensible question:

> Can an energy-indexed monetary or derivative mechanism be specified, implemented, and empirically evaluated well enough to justify further pilot-stage research?

SolarPunk is used as the research prototype. The project combines CEIR-style empirical analysis, energy derivative pricing, smart contract implementation, and testnet evidence. The contribution is not that the system is ready for mainnet deployment. The contribution is that the energy-anchor hypothesis is made technically inspectable: there is code, simulation, empirical framing, role analysis, and a public proof surface that can be reviewed and challenged.

## Core Contribution

The thesis contributes an evidence-to-instrument pipeline:

1. **Empirical foundation:** analyze whether energy-cost and energy-production variables can provide useful explanatory structure for crypto valuation or energy-linked settlement.
2. **Mechanism design:** specify how an energy-indexed instrument could use oracle inputs, margin buffers, settlement rules, and governance constraints.
3. **Implementation:** demonstrate feasibility through tested Solidity contracts and a public Sepolia deployment path.
4. **Validation:** evaluate the prototype using unit tests, simulations, margin stress analysis, and explicit failure-mode analysis.
5. **Limitations:** identify the unresolved institutional requirements: oracle reliability, utility partnerships, regulatory classification, liquidity, and audit readiness.

This is strongest as an applied finance thesis with technical artifacts, not as a claim that SolarPunk has already created a finished form of stable money.

---

## Package Map

This file is the canonical thesis proposal and handoff.

- `README.md` - public project overview and demo link.
- `docs/grants/REVIEWER_PACKET.md` - grant-reviewer evidence packet.
- `docs/project/PUBLIC_PROOF_STATUS.md` - current public proof and deployment status.
- `docs/project/ROLE_PERMISSION_MATRIX.md` - contract role and trust assumptions.
- `docs/project/INVARIANT_CHECKLIST.md` - protocol invariants and audit-readiness notes.
- `docs/specs/BASIS_AND_TOLERANCE.md` - basis-risk and tolerance framing.
- `docs/specs/IM_CALIBRATION.md` - margin calibration rationale.
- `docs/papers/CEIR_SPK_PAPER_OUTLINE.md` - journal-paper extraction plan.
- `empirical/` - CEIR, regression, pricing, and simulation materials.
- `contracts/` and `test/` - Solidity implementation and tests.
- `frontend/` - public proof/demo interface source. GitHub Pages builds the live demo from this app.

---

## Research Questions

### RQ1: Energy Anchoring

Can renewable energy production or energy-cost variables provide a useful anchor, reference index, or constraint for crypto-financial instruments?

Subquestions:

- Under what regimes does energy anchoring appear empirically meaningful?
- How does the approach differ from fiat-backed stablecoins, crypto-collateralized stablecoins, and purely algorithmic stablecoins?
- What basis risks arise when physical energy data is represented through oracle feeds?

### RQ2: Mechanism Design

Can an energy-indexed instrument be designed with clear settlement rules, margin requirements, and failure controls?

Subquestions:

- What must be true about oracle data, collateral, margin buffers, and governance for the system to be economically coherent?
- Which risks can be handled in code, and which require institutional arrangements?
- How should the design respond to grid stress, oracle failure, and insufficient liquidity?

### RQ3: Implementation Feasibility

Can the proposed mechanism be implemented in smart contracts and made externally inspectable?

Subquestions:

- Which contract functions represent the core financial logic?
- Which invariants should be preserved under normal and stress conditions?
- What does public testnet deployment prove, and what does it not prove?

### RQ4: Empirical and Simulation Validation

Do the empirical results, stress tests, and simulations support further pilot-stage research?

Subquestions:

- Are the margin and tolerance assumptions conservative enough for a pilot?
- Which scenarios cause the mechanism to fail or become economically unattractive?
- What evidence would be required before moving from testnet research to a real institutional pilot?

---

## Thesis Claim

The defensible central claim is:

> Energy-indexed crypto-financial instruments are technically implementable and empirically worth investigating, but their viability depends on oracle quality, basis-risk management, conservative collateralization, and institutional partnerships.

The thesis should avoid stronger claims such as:

- Energy backing alone creates stable money.
- SolarPunk eliminates custodial risk, over-collateralization, or algorithmic fragility.
- The prototype is production-ready.
- The system has proven long-run market viability.
- The work is definitively the first of its kind without a careful literature review.

---

## Evidence Map

| Pillar | Thesis claim | Evidence in repo |
|---|---|---|
| Empirical anchor | Energy variables may provide useful explanatory structure under specific regimes | `empirical/CEIR.py`, `empirical/Regression.py`, `empirical/ceir_analysis_summary.csv` |
| Pricing and margin | Physics-aware pricing and stress calibration can inform pilot parameters | `scripts/sensitivity_check.py`, `scripts/pillar3_engine.py`, `docs/specs/IM_CALIBRATION.md` |
| On-chain feasibility | Core settlement and permission logic can be implemented and tested | `contracts/`, `test/`, `docs/project/INVARIANT_CHECKLIST.md` |
| Public inspectability | The prototype can be reviewed outside the local environment | Sepolia deployment docs, reviewer packet, public demo |
| Limitations | Viability depends on unresolved off-chain and institutional conditions | role matrix, audit status, public proof status, grant packet |

---

## Defense Posture

The thesis should anticipate the following objections and answer them directly:

- **Energy data is an imperfect proxy:** The thesis treats irradiance, production, and cost data as noisy indexes, not perfect backing. Basis risk is a core design problem, not an ignored flaw.
- **Simulation is not market proof:** Simulation results support pilot-stage research only. They do not establish long-run stability, liquidity, or adoption.
- **Smart contracts do not solve institutions:** The contracts can enforce permissions, settlement rules, and safety controls, but utility relationships, legal classification, and oracle governance remain off-chain requirements.
- **Capital efficiency is not the first objective:** Conservative margining is intentional at the prototype stage. The design prioritizes solvency and inspectability before liquidity optimization.
- **Novelty must be carefully defended:** The thesis should claim a specific combination of empirical energy anchoring, derivative pricing, and inspectable smart contract implementation, not an unqualified global "first."

---

## Methodology

The thesis uses a mixed-method applied research design:

1. **Literature and theory synthesis**
   - Stablecoin design
   - Commodity and energy-backed money
   - Renewable energy finance
   - Oracle-dependent DeFi systems
   - Control and feedback mechanisms in financial systems

2. **Empirical analysis**
   - CEIR-style analysis of energy-cost and crypto-market relationships
   - Regime-dependent interpretation rather than universal claims
   - Robustness checks where available

3. **Mechanism design**
   - Define minting, redemption, margin, settlement, oracle, pause, and governance assumptions
   - Map financial rules to contract functions and protocol roles
   - Identify which assumptions are enforced on-chain and which remain institutional

4. **Implementation and testing**
   - Solidity contracts and test suite
   - Sepolia deployment and public proof surface
   - Invariant and permission review

5. **Simulation and stress analysis**
   - Margin and basis-risk stress tests
   - Sensitivity analysis
   - Scenario analysis for oracle failure, price shocks, liquidity stress, and grid stress

6. **Limitations and pilot roadmap**
   - Explicitly separate prototype evidence from production readiness
   - Define what a real pilot would need: audit, oracle partner, utility partner, legal review, and liquidity plan

---

## Recommended Chapter Structure

### Chapter 1: Introduction

- Research problem and motivation
- Stablecoin and energy-finance context
- Research questions
- Contribution and limitations
- Roadmap

### Chapter 2: Literature Review

- Stablecoin mechanisms and failure modes
- Commodity-backed and energy-linked monetary ideas
- Renewable energy finance and curtailment
- Oracle-dependent DeFi
- Control and feedback mechanisms in financial systems

### Chapter 3: Empirical Energy-Anchor Framework

- CEIR framework
- Data sources and limitations
- Regime dependence
- Natural experiment framing where defensible
- Interpretation of empirical results

### Chapter 4: SolarPunk Mechanism Design

- Energy-indexed instrument design
- Oracle, basis-risk, and tolerance assumptions
- Minting/redemption or option-settlement logic
- Margin and collateral logic
- Governance and role permissions

### Chapter 5: Smart Contract Implementation

- Contract architecture
- Core functions and invariants
- Access control and operational roles
- Sepolia deployment evidence
- What the implementation demonstrates and what it does not

### Chapter 6: Simulation, Stress Testing, and Validation

- Test suite summary
- Pricing and margin stress results
- Simulation assumptions
- Failure modes
- Sensitivity analysis

### Chapter 7: Discussion and Institutional Requirements

- Oracle reliability
- Utility partnership requirements
- Regulatory classification
- Audit/security readiness
- Liquidity and market adoption constraints

### Chapter 8: Conclusion and Future Work

- Summary of findings
- Contribution to applied finance and DeFi design
- Pilot roadmap
- Research limitations
- Future empirical and institutional work

---

## What the Thesis Can Claim

The thesis can safely claim:

- SolarPunk is a working proof-of-concept for energy-indexed crypto-financial design.
- The contracts and public demo make the mechanism externally inspectable.
- The empirical and simulation work supports continued pilot-stage research.
- Conservative margining and explicit basis-risk controls are necessary.
- Production viability depends on off-chain institutions, not only smart contract correctness.

The thesis should not claim:

- SolarPunk is already a production stablecoin.
- Energy backing removes the need for collateral, governance, or trusted data.
- The control mechanism guarantees peg stability under all market conditions.
- Testnet deployment proves market adoption or economic sustainability.
- A real deployment can proceed without audit, legal review, oracle commitments, and utility integration.

---

## Existing Assets

| Asset | Current use in thesis | Caveat |
|---|---|---|
| Solidity contracts | Implementation feasibility and mechanism design | Not audited; testnet/prototype only |
| Test suite | Functional validation | Tests do not prove economic safety |
| Sepolia deployment | Public proof and external inspectability | Testnet is not production evidence |
| Frontend demo | Reviewer-facing explanation and public proof surface | Demo interface, not production trading app |
| CEIR empirical work | Energy-anchor evidence | Must be framed as regime-dependent |
| spk-derivatives library | Pricing and margin methods | Model assumptions must be disclosed |
| Grant/reviewer packet | Public-facing evidence bundle | Useful for impact section, not a substitute for thesis proof |

---

## Academic Positioning

The strongest academic positioning is:

> This thesis bridges energy finance and DeFi by showing how an energy-indexed financial mechanism can be specified, implemented, tested, and evaluated as a pilot-stage research prototype.

This avoids sounding like a startup pitch. It also gives examiners a clear standard of evaluation:

- Is the empirical evidence honestly interpreted?
- Is the mechanism coherent?
- Is the implementation real and inspectable?
- Are the limitations explicit?
- Is the pilot roadmap credible?

---

## Expected Outputs

Minimum defensible outputs:

- A completed master's thesis.
- A public replication/proof packet.
- One paper draft on CEIR plus SolarPunk as an evidence-to-instrument pipeline.
- A cleaned appendix describing contracts, tests, and simulation assumptions.

Stretch outputs:

- A second paper focused on energy derivative pricing and margin calibration.
- A public pilot proposal for grant or institutional review.
- Expanded formal verification or third-party audit preparation.

---

## Timeline

| Phase | Duration | Output |
|---|---:|---|
| Thesis alignment | 1-2 weeks | Advisor-approved scope and chapter outline |
| Literature and empirical chapter drafts | 3-4 weeks | Chapters 1-3 draft |
| Mechanism and implementation chapters | 3-4 weeks | Chapters 4-5 draft |
| Simulation and validation chapter | 2-3 weeks | Chapter 6 draft |
| Discussion and conclusion | 2 weeks | Chapters 7-8 draft |
| Editing and defense prep | 3-4 weeks | Defense-ready thesis |

This timeline assumes the thesis builds from existing project assets. It does not assume that production deployment, audit completion, utility partnership, or regulatory clearance happens inside the thesis window.

---

## Key Risks and Mitigations

| Risk | Why it matters | Mitigation |
|---|---|---|
| Overclaiming stablecoin viability | Examiners can attack liquidity, law, oracle dependence, and adoption | Frame as energy-indexed prototype and pilot-stage research |
| Weak novelty defense | "First" claims are hard to prove | Use "contributes," "combines," and "to our knowledge after review" only where substantiated |
| Simulation mistaken for proof | Simulations depend on assumptions | Present sensitivity analysis and failure modes |
| Oracle and utility dependence | Physical settlement cannot be solved entirely on-chain | Treat as institutional requirement and future pilot condition |
| Scope creep | 15 chapters and 3-4 papers is too large for a clean master's thesis | Target 6-8 chapters and 1-2 papers |
| Production-readiness confusion | Grants may like ambition, but academia punishes unsupported claims | Separate prototype evidence from deployment roadmap |

---

## Suggested Abstract

Stablecoins and crypto-financial instruments depend on credible mechanisms for value reference, settlement, and risk control. This thesis examines whether renewable energy production can provide a useful anchor for such instruments. Using SolarPunk as a proof-of-concept prototype, the thesis combines empirical energy-anchor analysis, mechanism design, smart contract implementation, and simulation-based validation. The research does not claim that energy backing alone solves stablecoin stability. Instead, it evaluates whether an energy-indexed instrument can be specified and implemented with sufficient clarity to justify further pilot-stage research. The results show that the approach is technically inspectable and institutionally plausible under conservative assumptions, while also depending on unresolved requirements including oracle reliability, basis-risk management, audit readiness, utility partnerships, regulatory review, and liquidity formation.

---

## Advisor-Facing Summary

This thesis is not a proposal to launch a production stablecoin. It is an applied finance thesis using a working prototype to investigate a research question: whether renewable energy can serve as a credible reference anchor for crypto-financial instruments. The project is suitable for a finance master's thesis because it combines monetary design, energy economics, derivatives pricing, risk management, empirical analysis, and implementation evidence. Its academic value comes from making the hypothesis testable and inspectable, not from claiming immediate market success.
