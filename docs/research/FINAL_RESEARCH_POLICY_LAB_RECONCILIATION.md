# Final Research / Policy Lab Reconciliation

**Status:** current semantic reconciliation for post-paper Policy Lab development  
**Date:** 2026-08-14  
**Scope:** research-to-software meaning, public claim boundaries, and next implementation sequence  
**Does not change:** empirical results, deterministic decision formulas, case values, policy values, contract state, or historical SolarPunk/SPK artifacts

---

## 1. Why this document exists

The repository was developed while the academic architecture was still moving. That phase is now over.

The retained academic portfolio is:

1. **The Invisible Ledger** — a separate platform-economy measurement paper. It belongs to the academic portfolio but is not part of the Policy Lab execution chain.
2. **When Does Energy Track the Real Economy?** — the ECI measurement/admissibility paper.
3. **The Constrained Ledger: When Does Energy Actually Discipline Digital Money?** — the institutional constraint paper.
4. **From Energy Signals to Constrained Claims: A Layered Framework for Measurement, Evidence, and Institutional Closure in Energy-Linked Digital Finance** — the synthesis paper and current authority for how ECI and CL fit together.

Digital Tax is not part of the retained portfolio or current programme direction.

The papers are now upstream authority. Policy Lab should no longer help discover the academic ontology. Its job is to make the frozen distinctions executable, inspectable, reproducible, and challengeable.

> **POST-PAPER DOCTRINE**  
> The papers establish the research argument. Policy Lab operationalizes only the parts that software can honestly represent. A runtime artifact may demonstrate a mechanism without upgrading an untested research boundary.

---

## 2. Final four-boundary research model

The synthesis paper separates four questions that must not be collapsed:

```text
ENERGY-ADJACENT OBSERVATION
        ↓
Boundary 1 — economic information / admissibility
        ↓
ECONOMIC INFORMATION
        ↓
Boundary 2 — claim-level evidence
        ↓
CLAIM-LEVEL EVIDENCE
        ↓
Boundary 3 — binding constraint
        ↓
CONSTRAINED FINANCIAL CLAIM
        ↓
Boundary 4 — monetary performance; legal/regulatory status separately assessed
        ↓
MONEY only if separately demonstrated
```

### Boundary 1 — energy adjacency does not imply economic information

Primary question:

> Does the variable deserve economic interpretation for a defined real-activity purpose?

The ECI admissibility profile covers physical grounding, economic specificity, temporal stability, timeliness, and operational relevance.

Boundary 1 is a property of a signal or series in relation to an economy or sector. It is not a property of a single receipt, signature, file, or transaction.

### Boundary 2 — economic information does not imply claim-level evidence

Primary question:

> Can this specific assertion be trusted enough to issue against?

Claim-level evidence requires source-quality disclosure, modeled-versus-metered disclosure, and attribution to the specific claim rather than to an aggregate indicator.

A series can be economically informative and still provide no claim-level evidence. Conversely, a registry certificate can provide strong claim-level evidence without being an economic indicator.

### Boundary 3 — claim-level evidence does not imply a binding constraint

Primary question:

> What prevents a well-evidenced claim from being arbitrary, mispriced, or unenforceable?

Boundary 3 contains four conditions:

1. rule-bound issuance;
2. uncertainty priced with a model appropriate to the resource;
3. defined settlement and shortfall consequence;
4. limited governance.

The current prototype demonstrates controlled architectural separability for only a subset of these conditions. It does **not** establish that the rules are economically optimal, that pricing is production-suitable, that settlement is legally enforceable, or that governance is demonstrably bounded.

### Boundary 4 — a constrained financial claim is not money

Primary question:

> Does the claim actually circulate and function as money?

Functional evidence includes circulation, liquidity, general acceptability as a medium of exchange, and unit-of-account use. Legal or regulatory status is a separate jurisdictional question and does not automatically follow functional success or failure.

Nothing in the current programme crosses Boundary 4. Policy Lab must therefore represent Boundary 4 as untested unless future external evidence genuinely addresses it.

---

## 3. Important positive and negative results that control software wording

### 3.1 CEIR is a shortcut falsification, not Boundary 2

Bitcoin cumulative mining expenditure is used to test a proposed shortcut: whether raw physical expenditure can bypass claim-level evidence and constraint architecture and still discipline value.

The result falsifies that shortcut on the tested data. It must not be presented as Bitcoin failing institutional closure, and it must not be used as a generic Boundary-2 claim-evidence test.

### 3.2 Certificates are the clearest cross-boundary positive result

RECs, Guarantees of Origin, and I-RECs are the strongest surveyed examples of instruments that clear Boundary 2 because they use metered, serialized, source-attributed registry evidence.

They then fail Boundary 3 because the certificate itself creates no enforceable delivery obligation.

This is the programme's clearest demonstration that passing one boundary does not imply the next.

### 3.3 The prototype is intentionally partial

The Policy Lab / SolarPunk prototype can demonstrate that evidence checks, policy decisions, quantity ceilings, settlement scenarios, identities, and receipts can be represented separately and replayed deterministically.

It does not demonstrate:

- physical source truth;
- economically correct issuance rules;
- production-suitable uncertainty pricing;
- legal enforceability;
- bounded governance;
- market demand or adoption;
- circulation, liquidity, general acceptability, or unit-of-account use;
- money.

---

## 4. Research boundaries are not implementation stages

The existing workbench has a useful execution pipeline:

```text
Evidence
→ Assurance
→ Policy / Admission
→ Quantity
→ Settlement
→ Receipt / Capsule
```

Preserve it.

It is an **implementation decomposition**, not the four-boundary academic theory.

The mapping is intentionally many-to-many:

| Workbench stage | Research relationship | Important boundary |
|---|---|---|
| Evidence object / source intake | can instantiate Boundary-2 evidence requirements | does not establish Boundary 1 by itself |
| Assurance / provenance | supports Boundary-2 source-quality reasoning | L0–L4 is not a research-boundary score |
| Policy / admission | Boundary-3 rule-bound issuance | a pass is not unlimited authority |
| Quantity ceilings | Boundary-3 issuance / risk implementation | current policy multipliers are controlled rules, not proven economically optimal quantities |
| Settlement replay | Boundary-3 settlement mechanism | modeled capacity is not legal delivery or reserve custody |
| Receipt / capsule | reproducibility and lineage | reproduction does not promote the underlying evidence |
| Research result imports | may support Boundary 1, Boundary 2, or model-risk interpretation depending on source | must retain the source paper's original scope |

A software flow should never label `Evidence → Assurance → Policy → Quantity → Settlement` as Boundary 1 → Boundary 2 → Boundary 3 → Boundary 4.

---

## 5. Canonical Policy Lab role after the papers

Policy Lab is now best described as:

> **An executable research environment for testing how far a proposed energy-linked financial claim can be justified under declared evidence, policy, quantity, risk, settlement, and governance assumptions, while preserving exactly which research boundaries remain open.**

A shorter public description is:

> **Policy Lab shows where an energy-linked financial claim stops being justified, why, and what evidence would be needed next.**

The preferred exit artifact is therefore a **Constrained Claim Assessment** or **Energy-Linked Claim Assessment**, not a `Monetary System Assessment` that could imply Boundary-4 success.

Historical uses of `Monetary System Assessment` should be treated as packaging language to migrate, not as a runtime ontology or a claim that money has been demonstrated.

---

## 6. Proposed four-boundary assessment layer

Do **not** rewrite the deterministic core to force it into the research framework. Add a derived assessment layer over existing artifacts.

Suggested conceptual shape:

```text
ConstrainedClaimAssessment
├── assessment_id
├── subject / case identity
├── research_boundaries
│   ├── R1 economic_information
│   ├── R2 claim_level_evidence
│   ├── R3 binding_constraint
│   │   ├── issuance
│   │   ├── pricing
│   │   ├── settlement
│   │   └── governance
│   └── R4 monetary_performance
├── basis_refs
│   ├── research result IDs
│   ├── evidence hashes
│   ├── decision IDs
│   ├── settlement IDs
│   └── receipt / capsule IDs
├── explicit_non_claims
└── next_evidence_required
```

Recommended statuses:

```text
NOT_ASSESSED
OPEN
SUPPORTED
BLOCKED
PARTIAL
UNTESTED
```

Statuses must be scoped to a named boundary and object. `SUPPORTED` at one boundary does not cascade to later boundaries.

### Default current controlled-case interpretation

For the present controlled energy cases, a defensible default is roughly:

```text
R1 — NOT_ASSESSED by the case runtime
R2 — controlled / scenario-dependent evidence result only
R3 — PARTIAL: issuance and settlement mechanics represented; pricing and governance not fully demonstrated
R4 — UNTESTED
```

Do not hard-code this prose as a universal verdict. The assessment builder should derive only what frozen artifacts actually support.

---

## 7. External Case 001 after reconciliation

External Case 001 remains the correct immediate field milestone.

Its purpose becomes more precise:

> Demonstrate that an attributable, permissioned owner/operator source can enter the existing custody, normalization, evidence, policy, decision, settlement, receipt, and reproduction path without source-specific semantic invention or automatic assurance promotion.

This is primarily an **external-operability test of the Boundary-2 / Boundary-3 implementation path**.

It does not by itself validate Boundary 1. A site export may be excellent claim-level evidence for a bounded production assertion while answering no macroeconomic or sector-indicator question at all.

It also does not validate Boundary 4.

A correctly blocked real source remains a successful External Case 001 outcome if the block is reproducible and the source-holder confirms the factual metadata and publication boundary.

---

## 8. Namespace freeze

The finished research creates a new collision with the existing Conformance Benchmark terminology.

### Reserve these namespaces

```text
Research boundaries
R1–R4 internally; display as Boundary 1–4

Conformance benchmark families
CF1–CF9

Conformance levels
C0–C4

Source assurance
L0–L4

Implementation stages
named stages only: Evidence, Assurance, Admission, Quantity, Settlement, Receipt
```

### Required benchmark correction

The current Conformance Benchmark specification and PR #34 use `B1`–`B9` for benchmark families. Do not merge that namespace unchanged. Rename those families to `CF1`–`CF9` (or another equally explicit conformance-family namespace) before the benchmark becomes public release terminology.

This is a semantic collision, not a change to benchmark behavior.

---

## 9. Current execution order

### Tranche A — semantic reconciliation

1. add this decision record;
2. point recovery and packaging authority to it;
3. update README and public research copy;
4. reconcile Research / Overview / Programme terminology;
5. preserve runtime behavior and case outputs.

### Tranche B — Conformance v1 cleanup

1. rebase PR #34 onto current `main`;
2. rename benchmark families away from `B1`–`B9`;
3. run the benchmark in a clean environment;
4. archive the report;
5. keep `C0`–`C4` separate from `L0`–`L4` and R1–R4.

### Tranche C — External Case 001

1. obtain one attributable source;
2. freeze custody and publication permissions;
3. normalize through a registered adapter;
4. run actual source state and declared counterfactuals separately;
5. produce receipt / capsule;
6. obtain source-holder factual review;
7. publish only permitted artifacts.

### Tranche D — four-boundary assessment artifact

1. add a derived assessment schema / builder;
2. map existing runtime artifacts to R2/R3 without invention;
3. permit separately sourced R1 research results;
4. keep R4 untested by default;
5. expose the result in the public interface and verification path.

---

## 10. Stop rules

Do not:

- rewrite the deterministic engine merely to mirror paper headings;
- change policy numbers to make the canonical demo look better;
- promote L0–L4 assurance into research-boundary status;
- describe C0–C4 conformance as evidence quality;
- use benchmark-family `B1`–`B4` alongside research Boundary 1–4;
- claim External Case 001 validates ECI or the entire four-boundary chain;
- present modeled resource context as observed generation;
- present deterministic settlement replay as legal redemption;
- present a constrained claim as money;
- reopen ECI, CL, or the synthesis because a UI label is inconvenient;
- build a new token, contract, AI layer, marketplace, or broad backend unless a current evidence gate requires it.

---

## 11. Working definition of success

The next Policy Lab phase succeeds when a skeptical reviewer can answer all of the following without trusting the interface copy:

1. Which research boundary is actually being evaluated?
2. Which object is being evaluated at that boundary?
3. What evidence supports the status?
4. Which runtime artifacts reproduce the decision?
5. What remains explicitly untested?
6. What new evidence would be required to move farther?

That is the post-paper role of Policy Lab: not to make the academic claim larger, but to make every permissible claim harder to fake.