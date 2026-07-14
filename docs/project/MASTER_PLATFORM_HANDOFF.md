# Master Platform Handoff

**READ THIS FIRST IF CHAT CONTEXT IS LOST.**

**Repository:** `Spectating101/solarpunk-coin`  
**Current development branch at time of this handoff:** `agent/decision-brief`  
**Open draft PR:** `#4` — `Add answer-first policy decision brief`  
**Validated code head:** `a7403e0ad13249fe010ad53eabaccebe58beac1e`  
**Documentation direction commit before this master handoff:** `e5505d331f3eadb53fd0feb09c045f5aa81a9fd1`  
**Deployment posture:** V1 static interface may be published after local review; do not deploy new contracts as part of this work.

---

## 1. What this project is

The user's original project is **SolarPunk Public Lab / the Energy Standard project**.

The thesis domain is energy-linked digital finance. The thesis asks a bounded question:

> Can energy act as a credible constraint for digital money through energy-linked financial contracts, and what conditions are needed for that constraint to work?

The thesis answer is conditional. Credibility requires five linked constraints:

1. reliable energy data;
2. rule-bound issuance;
3. explicit pricing and risk controls;
4. protected settlement and redemption accounting;
5. limited governance.

The repository later gained a generalized empirical and evidence-to-claim research layer. The previous development pass used **Constraint Protocol** branding internally and in some public surfaces.

### Naming boundary

Do **not** tell the user that they officially named the whole project `Constraint`.

Do **not** say the user personally chose `Constraint` as the product name.

Safe wording:

- the inherited repo / previous development pass uses Constraint Protocol branding;
- internal `constraint-*` packages, schemas, study IDs, and namespaces are implementation identifiers;
- the original project is SolarPunk Public Lab / the Energy Standard project;
- `Policy Lab` on PR #4 is a neutral descriptive shell, not a permanent approved brand;
- `case-based constraint research workbench` is a product-direction description, not a final public name.

Do not perform a repository-wide rename unless the user explicitly makes a final naming decision.

---

## 2. Current project chronology

The repository has multiple legitimate historical layers. Future agents must not flatten them into one invented origin story.

### Layer A — Energy Standard thesis

Core intellectual claim:

```text
ENERGY DATA
    ↓
RULE-BOUND ISSUANCE
    ↓
PRICING / RISK
    ↓
SETTLEMENT / REDEMPTION ACCOUNTING
    ↓
LIMITED GOVERNANCE
```

This remains the thesis architecture.

### Layer B — SolarPunk Public Lab / SPK reference application

Public/testnet laboratory:

```text
surplus evidence
      ↓
attested mint
      ↓
SPK
      ↓
network settlement
      ↓
measurable circulation
```

SPK is a lab/testnet unit.

It is not:

- legal money;
- a stablecoin;
- a token sale;
- a legal claim on delivered energy;
- a mainnet-ready financial product.

Existing Sepolia reference addresses:

```text
SPK
0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128

Payments
0x520162252F9B94824417678525FFd69145014970
```

The current work does not redeploy or mutate these contracts.

### Layer C — evidence/provenance/claim protocol

The repository generalized the evidence-to-claim flow:

```text
evidence
    ↓
normalization
    ↓
diagnostics
    ↓
provenance
    ↓
versioned policy
    ↓
bounded claim
    ↓
settlement result
```

This produced the `@solarpunk/constraint-core` package, portable schemas, policy manifests, claim lifecycle, and browser-local Claim Lab.

### Layer D — market-capacity empirical study

A historical market panel was used to test declared capacity policies:

```text
historical evidence
      ↓
policy A / B / C
      ↓
permitted capacity
      ↓
historical realized capacity
      ↓
coverage / shortfall / severity
      ↓
binding-constraint attribution
```

The key empirical method is the explicit comparison of multiple quantity ceilings and attribution of the lower, binding ceiling.

This study is a separate empirical domain. It does **not** prove the Energy Standard thesis.

### Layer E — current V1 interface pass

Draft PR #4 adds an answer-first Decision Brief and preserves:

```text
Decision Brief
Market Capacity Study
Reproduction
Claim Lab
SolarPunk reference
Sepolia proof
Research
```

The validated code head is `a7403e0`.

All major CI workflows were green at that code head, and the browser workflow produced 19 desktop/mobile screenshots.

### Layer F — proposed V2 direction

The next product direction is a **case-based constraint research workbench**.

The governing product flow is:

```text
CASE
  ↓
EVIDENCE + CONTEXT
  ↓
DECLARED POLICY
  ↓
ADMISSION GATES
  ↓
QUANTITY CEILINGS
  ↓
DECISION RESULT
  ↓
BOUNDED CLAIM
  ↓
SETTLEMENT RESULT
  ↓
RECEIPT / LINEAGE / REPRODUCTION
```

This is a continuation of the repo's existing systems. It is not permission to rewrite the thesis as a generic policy-engine thesis.

---

## 3. Source-of-truth hierarchy

When documents disagree, use this hierarchy.

### For the current V1 release

1. pull request `#4` current diff and metadata;
2. `docs/project/LOCAL_AGENT_INTERFACE_HANDOFF.md`;
3. `docs/project/INTERFACE_VALUE_DELIVERY.md`;
4. actual code and committed empirical artifacts.

### For V2 product direction

1. `docs/project/MASTER_PLATFORM_HANDOFF.md`;
2. `docs/project/PLATFORM_BLUEPRINT.md`;
3. `docs/project/V2_IMPLEMENTATION_HANDOFF.md`;
4. `docs/project/CASE_WORKBENCH_PRODUCT_AND_THESIS_DIRECTION.md`;
5. actual current package/schema/frontend implementation.

### For thesis impact

1. user-approved canonical thesis DOCX;
2. direct thesis-file inspection;
3. `docs/project/CASE_WORKBENCH_PRODUCT_AND_THESIS_DIRECTION.md` thesis-impact section.

Do not assume a newer thesis file is canonical merely because its timestamp is newer.

Prior thesis workflow treated:

```text
energy_constraint_thesis_v10_standard_format_checked.docx
```

as the direct edit source.

A later candidate exists:

```text
energy_constraint_thesis_final_submission_revised.docx
```

The later file contains stronger CEIR-boundary wording, but a future thesis agent must confirm which DOCX the user approves as canonical before editing.

### Historical status documents

`CURRENT_STATUS.md` describes the July 10 SolarPunk Public Lab freeze and maintenance posture.

That historical status is real. It does not erase the later PR #4 interface work or V2 workbench direction.

Interpret chronology rather than forcing one document to invalidate another.

---

## 4. What is validated now

### Empirical study

Public study ID:

```text
constraint-market-capacity-v1-public-aggregate
```

Source period:

```text
2018-01-02 → 2024-12-31
```

Delivered panel:

```text
777,764 rows
457 PERMNOs
450 RICs
```

Conservative identity-cleaned view:

```text
760,931 rows
7 ambiguous RICs excluded
443 PERMNOs
443 RICs
```

Source SHA-256:

```text
792c3ad99311cff2b18e9dcdb58fbfedcf74a1bf95c1a0691673d06492b5e0e5
```

Public data boundary:

> Aggregated, normalized research outputs only. No licensed CRSP/Refinitiv row-level observations are redistributed.

Interpretation boundary:

> Historical coverage is an empirical diagnostic, not proof of legal enforceability, future performance, or production risk adequacy.

### 20-session study result

Fixed 20% baseline:

```text
coverage                     97.2518%
mean permitted               80.0000%
shortfall event rate          2.7487%
conditional shortfall         9.4955%
```

Volatility + liquidity guarded rule:

```text
coverage                     98.8626%
mean permitted               71.6849%
shortfall event rate          1.1374%
conditional shortfall        11.2262%
```

Guarded versus fixed:

```text
coverage gain                +1.6108 pp
capacity surrendered          8.3151 pp
shortfall incidence reduction 1.6113 pp
conditional severity change  +1.7307 pp
```

### 60-session study result

Fixed 20% baseline:

```text
coverage                     89.3990%
mean permitted               80.0000%
shortfall event rate         10.6027%
conditional shortfall        10.7373%
```

Guarded rule:

```text
coverage                     94.9118%
mean permitted               71.6617%
shortfall event rate          5.0882%
conditional shortfall        11.6411%
```

Guarded versus fixed:

```text
coverage gain                +5.5128 pp
capacity surrendered          8.3383 pp
shortfall incidence reduction 5.5145 pp
conditional severity change  +0.9038 pp
```

### Worst published stress replay

```text
run       CP-MKT-STRESS-0002
date      2020-02-21
horizon   20 sessions
rows      426
```

Fixed:

```text
coverage          8.6854%
shortfall events 91.3146%
mean permitted   80.0000%
```

Guarded:

```text
coverage         19.4836%
shortfall events 80.5164%
mean permitted   74.7605%
```

The guarded rule improved relative to baseline and still failed badly.

That failure must remain visible.

### Current V1 frontend validation

Validated code head:

```text
a7403e0ad13249fe010ad53eabaccebe58beac1e
```

Green workflows at that code head:

```text
Constraint Protocol Alpha CI
Tests & Coverage
Solidity tests
Solidity security
Secrets Scan
```

End-to-end alpha CI covered:

```text
core and policy conformance
SDK package checks
deterministic protocol demo
protocol contract suite
complete Hardhat suite
local EVM smoke deployment
frontend tests
Vite production build
19-shot Chromium walkthrough
runtime / site / diagnostics / visual artifacts
```

The documentation commits after `a7403e0` do not change code, empirical artifacts, policy formulas, contracts, runtime, Sepolia state, or thesis artifacts.

---

## 5. Current V1 product

Current PR #4 routes:

```text
#runs       Decision Brief
#study      Full empirical study
#reproduce  Public aggregate integrity receipt
#protocol   Evidence-to-claim browser lab
#overview   SolarPunk reference
#sepolia    Existing Sepolia proof
#research   Research material
```

### Decision Brief

Purpose:

> answer first; machinery second.

It shows:

- coverage purchased;
- capacity surrendered;
- conditional shortfall severity change;
- residual guarded shortfall;
- 20/60-session horizon sensitivity;
- severe stress replay;
- source receipt and SHA;
- downloadable Markdown decision memo.

### Empirical study

Views:

```text
Study
Policy frontier
Stress replays
Methods
```

It already shows:

- common-sample policy comparison;
- binding-constraint attribution;
- annual robustness;
- fixed-haircut counterfactual frontier;
- stress-date replay;
- methods and source identity.

### Claim Lab

Supported evidence paths:

```text
meter / inverter cumulative counters
Green Button / utility interval CSV
Fronius PowerFlow
signed meter evidence
generic interval CSV
```

Current flow:

```text
source
→ normalize
→ diagnose
→ provenance
→ policy
→ claim
→ settlement
```

The current policy engine is still simpler than the empirical binding-constraint concept.

Current policy decision logic is approximately:

```text
admission checks
      ↓
gross = surplus × rate
      ↓
risk_adjusted = gross × (1 - fixed haircut)
      ↓
maximum = min(risk_adjusted, absolute cap)
```

The V2 workbench must not pretend the current engine already evaluates a general stack of named quantity ceilings.

---

## 6. Why V2 exists

The repo already contains:

```text
resource geography
PVWatts / NREL context
NASA resource benchmarking
meter and inverter evidence adapters
hardware provenance thinking
L0-L4 evidence assurance
SPK issuance controls
risk diagnostics
energy derivative pricing
irradiance-derived volatility
margin and hedge models
market-capacity policy comparison
binding-constraint attribution
claim manifests
settlement shortfall
```

These systems repeatedly ask one common question:

> **What must bind before a financial quantity is allowed to exist, and what happens when the resulting obligation cannot be honored?**

The V2 product makes that question operable on explicit cases.

### V2 product statement

> A case-based research workbench for evaluating how explicit evidence and policy rules block, bound, and settle financial claims, with binding-rule attribution, counterfactual comparison, stress replay, and reproducible decision receipts.

This is a working product description, not a final brand.

---

## 7. The core V2 model

### `CaseManifest`

The atomic investigation object.

Conceptual fields:

```text
schema
case_id
subject
case_type
spatial_identity
measurement_window
evidence_refs
context_refs
policy_ref
run_history
```

### `EvidenceEnvelope`

Keep the current object.

It already contains:

```text
site_id
measurement windows
generation
load
export
eligible surplus
quality score
source
diagnostics
capabilities
evidence hash
```

### `ProvenanceDecision`

Keep the assurance classifier.

Refactor the economic-policy duplication.

Provenance should answer:

> What assurance does this evidence possess?

Policy should answer:

> What does this policy permit for evidence with that assurance?

The current `PROVENANCE_LEVELS` encode default haircuts and caps, while the built-in policies separately encode similar haircuts and caps.

That duplication should be normalized before presenting V2 as a general policy-comparison system.

### `ConstraintEvaluation`

Three rule classes only.

#### Admission gate

Output:

```text
PASS | BLOCK
```

Examples:

```text
POSITIVE_SURPLUS
ZERO_BLOCKERS
SIGNED_EVIDENCE
MIN_PROVENANCE
EXTERNAL_CORROBORATION
IDENTITY_UNAMBIGUOUS
```

#### Quantity ceiling

Output:

```text
capacity in the common claim unit
```

Examples:

```text
EVIDENCE_BACKED_CAPACITY
PROVENANCE_POLICY_CAPACITY
RESOURCE_CONTEXT_CAPACITY
VOLATILITY_CAPACITY
LIQUIDITY_CAPACITY
MARGIN_CAPACITY
ABSOLUTE_POLICY_CAP
```

Only applicable quantity ceilings enter:

```text
admitted_maximum = min(quantity_ceilings)
```

The lower ceiling or tie set is binding.

#### Settlement constraint

Evaluated against an issued/active obligation.

Output:

```text
SETTLED | PARTIAL | SHORTFALL
```

Do not collapse admission, quantity, and settlement into one scalar capacity model.

### `DecisionResult`

Principal missing object.

Conceptual shape:

```text
decision_id
case_id
policy identity
policy manifest hash
evidence hashes
context refs

admission
  result
  evaluations
  blocking rules

capacity
  evaluated
  unit
  ceilings
  admitted maximum
  binding constraints

warnings
boundary
```

### `ClaimManifest`

Keep the existing claim lifecycle and deterministic identity.

A future claim should consume a `DecisionResult` rather than a loose `PolicyDecision`.

### `SettlementResult`

Keep the existing separate settlement stage.

### `DecisionReceipt`

Every run should create a shareable receipt containing:

```text
decision ID
case ID
evaluation timestamp
policy ID/version/hash
evidence identities
context identities
rules evaluated
blocking rules
binding ceilings
result
runtime/source revision
data boundary
```

---

## 8. V2 information architecture

Primary navigation:

```text
CASES
COMPARE
STUDIES
RECEIPTS
REFERENCE
```

### Cases

Perform an investigation.

### Compare

Compare:

```text
case × policy × context × stress
```

### Studies

Published empirical studies.

The existing market-capacity Decision Brief and Empirical Runs Lab move here.

### Receipts

Decision receipts, lineage, reproduction, and research capsule export.

### Reference

SolarPunk, SPK, Sepolia, contracts, and derivative reference work.

Do not delete the current surfaces. Re-home them.

---

## 9. The V2 default user journey

A successful five-minute investigation:

```text
Open Taoyuan
      ↓
BLOCKED
policy requires L2
observed provenance L0
      ↓
preview L2 counterfactual
      ↓
ADMIT WITH LIMIT
431.12 units
      ↓
VOLATILITY CAPACITY binds
      ↓
pin Taoyuan
      ↓
open Phoenix
      ↓
ADMIT WITH LIMIT
510.20 units
      ↓
EVIDENCE CAPACITY binds
      ↓
compare same policy
      ↓
run settlement shock
      ↓
export decision receipts
```

The lab earns its interface when a user can identify **why** two cases differ without rebuilding joins, formulas, and lineage in a notebook.

---

## 10. Geospatial role

The map is not a solar-potential product.

The map is a linked case and heterogeneity surface.

Useful map layers:

```text
DECISION
BLOCKING RULE
BINDING QUANTITY CEILING
ADMITTED MAXIMUM
POLICY DIFFERENCE
STRESS FAILURE
EVIDENCE ASSURANCE
```

Initial energy cases:

```text
Taoyuan
Austin
Phoenix
```

These locations have the deeper existing daily modeled baseline.

The 12-location PVWatts map pack is useful for breadth and demonstration. It is not a scientific geospatial sample and must not be presented as proof of location-conditioned policy superiority.

### Non-negotiable data labels

Every relevant surface must distinguish:

```text
OBSERVED EVIDENCE
MODELED CONTEXT
DECLARED POLICY
DERIVED RESULT
```

Examples:

```text
meter interval rows      → OBSERVED EVIDENCE
PVWatts TMY baseline     → MODELED CONTEXT
ENERGY-PILOT-002@1.0.0   → DECLARED POLICY
431.12 admitted maximum  → DERIVED RESULT
```

Never render modeled resource context as verified generation evidence.

---

## 11. Initial V2 energy study

Initial bounded case pack:

```text
3 locations
×
4 provenance scenarios
×
3 policies
×
base + declared stress contexts
```

Initial research questions:

1. How does evidence assurance change admission and policy quantity ceilings under unchanged resource context?
2. Holding policy fixed, which quantity ceiling binds across modeled resource contexts?
3. How much admissible capacity changes between open, pilot, and strict evidence policies?
4. Under a declared settlement-capacity shock, which admitted claims become partial or shortfall cases?

The initial case pack is a mechanism and decision-structure demonstration.

Do not claim:

> location-conditioned policies improve empirical historical coverage.

That requires a real realized geospatial outcome panel, sampling design, temporal semantics, and prospective or out-of-sample policy evaluation.

---

## 12. Derivative work

The derivatives stack is still relevant.

It should become an optional Risk Lens or calculator.

Potential path:

```text
irradiance volatility
basis-risk warning
option / hedge structure
VaR margin
hedge effectiveness
      ↓
VOLATILITY_CAPACITY
or
MARGIN_CAPACITY
```

Do not attach Black-Scholes to every case.

Rule:

> Derivative analysis may inform a constraint. It is not the ontology of every claim.

---

## 13. AI boundary

AI is a later research-assistant layer.

Preserve:

> **AI advises; deterministic evaluation decides.**

Allowed assistant actions:

```text
retrieve cases
retrieve decisions
compare constraint evaluations
explain policy differences
summarize stress transitions
propose a temporary policy fork
draft a memo
cite decision IDs and lineage nodes
```

Disallowed:

```text
silently change policy
invent capacity values
promote modeled context to evidence
promote signatures to physical truth
authorize claims
imply legal settlement rights
```

A policy change must appear as a visible fork/diff.

---

## 14. Execution modes

### Public Study Mode

```text
raw/licensed analysis
      ↓
offline runner
      ↓
aggregate study bundle
      ↓
static public lab
```

Current market-capacity study uses this pattern.

### Local Case Mode

```text
local CSV / JSON
      ↓
browser-local normalization
      ↓
hash / diagnostics / provenance
      ↓
policy evaluation
      ↓
decision receipt
```

Raw private evidence should not be uploaded by default.

### Repro Compute Mode

```text
CLI / Python / Node
      ↓
large dataset / case batch
      ↓
run results
      ↓
hashed research capsule
      ↓
browser inspection
```

Do not force high-volume spatiotemporal analysis into the browser.

---

## 15. Research capsule

Target export:

```text
research-capsule.zip
│
├── capsule.json
├── case.json
├── decision-result.json
├── decision-receipt.json
├── policy-manifest.json
├── evidence-metadata.json
├── context-manifest.json
├── lineage.json
├── reproduction.json
├── decision-memo.md
└── CITATION.cff
```

For private/licensed evidence:

```text
source ID
source hash
license
row count
column manifest
temporal extent
spatial extent
raw_data_included: false
```

The receipt/capsule should allow another reviewer to inspect identity, policy, rule evaluation, assumptions, and result without redistributing restricted rows.

---

## 16. Thesis relationship

Do not change the thesis title or core research question merely because the workbench exists.

The workbench strengthens the thesis only when framed as:

> an executable research artifact for applying the five-constraint architecture to explicit energy-linked cases under controlled assumptions.

Recommended thesis effect after V2 deterministic architecture is real:

```text
Chapter 1
optional one-sentence implementation clarification

Chapter 2
no structural change

Chapter 3
no change from CEIR boundary diagnosis
market-capacity study is not thesis evidence

Chapter 4
small bridge from risk models to explicit decision inputs

Chapter 5
short Case-Based Constraint Evaluation subsection

Appendix B
DecisionResult
DecisionReceipt
lineage diagram
reproduction command

Chapter 6
small technical-contribution and future-research refinement
```

Do not rewrite the MSc as a generic policy-as-code thesis.

Do not claim the 12-site map proves geography-conditioned policy superiority.

Do not claim the market-capacity study validates the energy anchor.

---

## 17. Build order

### Phase 0 — V1 release

Review, merge, and statically publish PR #4.

No generalized protocol contract deployment.

### Phase 1 — decision objects

Implement and test:

```text
CaseManifest
ConstraintEvaluation
DecisionResult
DecisionReceipt
```

Refactor provenance description versus policy-owned economic rules.

### Phase 2 — typed calculator registry

Admission gates:

```text
POSITIVE_SURPLUS
ZERO_BLOCKERS
SIGNED_EVIDENCE
MIN_PROVENANCE
EXTERNAL_CORROBORATION
```

Quantity ceilings:

```text
EVIDENCE_BACKED_CAPACITY
PROVENANCE_POLICY_CAPACITY
RESOURCE_CONTEXT_CAPACITY
ABSOLUTE_POLICY_CAP
```

Settlement:

```text
SETTLEMENT_CAPACITY
```

Do not implement volatility, derivatives, or AI before the basic typed model is proven.

### Phase 3 — canonical energy cases

Build:

```text
TYN-001
AUS-001
PHX-001
```

Attach existing modeled resource context, controlled sample evidence, and declared provenance counterfactuals.

### Phase 4 — Case Workspace

Three panes:

```text
Cases / map
Decision workspace
Decision dossier
```

Lenses:

```text
Evidence
Constraints
Compare
Stress
Lineage
```

### Phase 5 — Compare

Build:

```text
case × policy decision matrix
blocking/binding-rule matrix
admitted-capacity comparison
policy-difference summary
declared stress transitions
```

### Phase 6 — receipts and capsules

Build:

```text
decision receipt JSON
decision memo Markdown
lineage JSON
capsule manifest
private-data boundary metadata
```

### Phase 7 — thesis review gate

Only after Phases 1–6 pass validation:

1. identify the canonical thesis DOCX;
2. compare Chapter 5 against the real implementation;
3. make targeted thesis edits;
4. perform terminology, cross-reference, figure/table, and source-of-truth audit.

### Phase 8 — optional Risk Lens

Integrate derivative/risk calculators only as explicit analysis lenses or quantity-ceiling calculators.

### Phase 9 — optional Research Assistant

Only after deterministic case → decision → receipt is stable.

---

## 18. Stop rule

After these are real:

```text
3 canonical energy cases
3 policy comparisons
typed admission / quantity / settlement evaluation
binding-ceiling attribution
case comparison
stress replay
decision receipt
research capsule
```

stop adding interface surface.

Resume only for:

1. real operator meter/inverter evidence;
2. concrete external reviewer/user feedback;
3. publication, competition, or pilot requirements;
4. policy-integrity, evidence-lineage, security, or reproducibility defects;
5. a prospectively designed new empirical study;
6. an explicitly approved deployment milestone.

Do not add more maps, domains, AI agents, dashboards, or blockchain contracts merely to make the project appear larger.

---

## 19. Immediate resume instruction for a future agent

When resuming after lost chat context:

1. read this document completely;
2. read `PLATFORM_BLUEPRINT.md`;
3. read `V2_IMPLEMENTATION_HANDOFF.md`;
4. read `CASE_WORKBENCH_PRODUCT_AND_THESIS_DIRECTION.md`;
5. inspect PR #4 and compare its current head with `a7403e0`;
6. verify whether PR #4 has been merged and whether `/demo/` has been republished;
7. do not deploy contracts;
8. do not edit the thesis yet;
9. do not rename the project;
10. continue from the next incomplete phase in `V2_IMPLEMENTATION_HANDOFF.md`.

Before changing code, state the current phase and the exact acceptance gate being targeted.

---

## 20. One-paragraph recovery summary

SolarPunk / the Energy Standard project began as an energy-linked digital-finance architecture and public Sepolia laboratory. The repository later developed portable evidence, provenance, policy, claim, and settlement objects plus a historical market-capacity study that demonstrated explicit capacity trade-offs and binding-constraint attribution. Draft PR #4 adds a validated answer-first V1 interface under the neutral descriptive shell `Policy Lab`. The next direction is not another dashboard: it is a case-based research workbench where explicit cases combine observed evidence, modeled context, and declared policy; typed admission gates decide whether quantity evaluation may proceed; comparable quantity ceilings determine the binding maximum; claims retain evidence and policy identity; settlement remains a separate stage; and each run emits a reproducible receipt and lineage. Energy remains the first serious domain and the thesis remains the five-constraint Energy Standard thesis. V1 may be published first. V2 must stop after the bounded three-location case workbench, policy comparison, stress replay, receipts, and research capsule are real, unless an external hook justifies more work.
