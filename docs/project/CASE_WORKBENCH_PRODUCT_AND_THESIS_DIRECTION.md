# Case Workbench Product and Thesis Direction

**Status:** post-interface due-diligence decision record  
**Branch:** `agent/decision-brief`  
**Purpose:** preserve the product direction, architectural boundary, thesis implications, and build sequence discovered after the Decision Brief refinement and deeper SolarPunk repository review.

## Executive decision

The next development direction should be a **case-based constraint research workbench**.

The workbench is not a generic policy engine, a solar mapping product, a token dashboard, or a notebook replacement. Its central research action is:

> Take a concrete case, attach evidence and contextual models, evaluate an explicit policy, identify the rule that blocks admission or the quantity ceiling that binds, replay counterfactual and stress conditions, and export a reproducible decision receipt.

The product should organize existing SolarPunk and Policy Lab capabilities around:

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

This direction is a continuation of the existing Energy Standard thesis and SolarPunk architecture. It is **not permission to rewrite the master's thesis as a generic decision-engine thesis**.

---

## Why this direction exists

The repository already contains several mature but separately surfaced systems:

1. **Empirical policy comparison**
   - common-sample evaluation;
   - capacity versus historical coverage;
   - policy frontier;
   - annual robustness;
   - stress replay;
   - binding-constraint attribution.

2. **Evidence normalization and provenance**
   - cumulative meter/inverter counters;
   - Green Button / utility interval CSV;
   - Fronius PowerFlow;
   - signed meter evidence;
   - generic interval CSV;
   - deterministic evidence hashes;
   - L0-L4 provenance classification.

3. **Energy resource and geography context**
   - NASA POWER resource benchmarks;
   - NREL/PVWatts modeled solar baselines;
   - 12 map-ready global scenarios;
   - deeper daily modeled baselines for Taoyuan, Austin, and Phoenix;
   - site-level latitude/longitude and source identity.

4. **Risk and financial analysis**
   - physical plausibility diagnostics;
   - data-quality checks;
   - hardware-provenance risk;
   - support and reserve gaps;
   - energy-index option pricing;
   - irradiance-derived volatility;
   - Greeks, VaR margin, collar analysis, and hedge logic.

5. **Claim and settlement lifecycle**
   - policy manifests;
   - bounded claim quantity;
   - deterministic claim identity;
   - claim state transitions;
   - explicit settlement capacity;
   - settled, partial, and shortfall outcomes.

The common intellectual question across these systems is:

> **What must bind before a financial quantity is allowed to exist, and what happens when the resulting obligation cannot be honored?**

The workbench should make that question operable.

---

## Product value proposition

The workbench should help a researcher or reviewer answer five questions quickly:

1. **What evidence exists?**
2. **What is observed, modeled, declared, and derived?**
3. **Why did the selected policy block or admit the case?**
4. **If admitted, which quantity ceiling determined the maximum?**
5. **What changes under another policy, another case context, or a stress scenario?**

A successful five-minute investigation should look like:

```text
Open Taoyuan case
        ↓
BLOCKED: policy requires L2, observed provenance is L0
        ↓
Preview L2 counterfactual
        ↓
ADMIT WITH LIMIT: 431.12 units
        ↓
Binding ceiling: volatility capacity
        ↓
Compare Phoenix under the same policy
        ↓
ADMIT WITH LIMIT: 510.20 units
        ↓
Binding ceiling: evidence capacity
        ↓
Run settlement shock
        ↓
Taoyuan PARTIAL / Phoenix SHORTFALL
        ↓
Export decision receipts and comparison memo
```

The value is not that the user reads the maintainer's research. The value is that the user performs an inspectable investigation.

---

## Core product model

### 1. `CaseManifest`

The atomic workbench object.

Minimum conceptual fields:

```text
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

For an energy case:

```text
case_id: TYN-ROOFTOP-001
subject: Taoyuan rooftop solar site
lat: 24.99
lon: 121.30
window: 2026-05-01 → 2026-05-07
evidence: EV-...
resource_context: RC-TYN-001
policy: ENERGY-PILOT-002@1.0.0
```

Do not hardwire every future case to geography. Spatial identity is first-class where relevant, not a universal claim requirement.

### 2. `EvidenceEnvelope`

Keep the existing evidence architecture.

It already contains the useful foundation:

- `site_id`;
- measurement windows;
- generation/load/export/surplus fields;
- quality score;
- source;
- diagnostics;
- capabilities;
- SHA-256 evidence identity.

Do not rewrite it merely to fit the new UI.

### 3. `ProvenanceDecision`

Keep the assurance classification but separate **descriptive assurance** from **financial capacity policy**.

Provenance should answer:

> What assurance does this evidence possess?

For example:

```text
L2
Live inverter or gateway signed counter
trusted operator context
signed live source
no utility corroboration
```

It should not permanently dictate one universal quantity cap or haircut for every policy.

Policy should be able to map the same L2 evidence differently:

```text
Policy A: L2 → 2,500-unit ceiling
Policy B: L2 → 750-unit ceiling
Policy C: L2 → block
```

The current duplication between provenance default haircuts/caps and policy haircuts/caps should be normalized before the workbench is presented as a general policy-comparison system.

### 4. `ConstraintEvaluation`

Add a typed rule-evaluation object.

There are three semantically different constraint classes.

#### Admission gate

Boolean or categorical rule.

Examples:

- positive surplus;
- zero blocking diagnostics;
- signed evidence;
- minimum provenance;
- external corroboration;
- identity ambiguity.

Output:

```text
PASS | BLOCK
```

#### Quantity ceiling

A rule that returns a maximum in the same claim unit as the other applicable ceilings.

Examples:

- evidence-backed quantity;
- provenance-policy capacity;
- resource-context capacity;
- volatility capacity;
- liquidity capacity;
- margin capacity;
- absolute policy cap.

Output:

```text
capacity = 431.12 ENERGY_CLAIM_UNIT
```

Only quantity ceilings should enter the binding-capacity operation:

```text
admitted_maximum = min(applicable_quantity_ceilings)
```

The lower ceiling, or tie set, is the binding constraint.

#### Settlement constraint

Evaluated after a claim becomes an issued/active obligation.

Examples:

- outstanding claim quantity;
- declared settlement capacity;
- covered quantity;
- shortfall quantity.

Output:

```text
SETTLED | PARTIAL | SHORTFALL
```

Do not flatten admission, quantity, and settlement into one elegant-looking `min()` function. They operate at different semantic and lifecycle stages.

### 5. `DecisionResult`

This is the principal missing protocol/workbench object.

Conceptual structure:

```text
schema
decision_id
case_id
policy_id
policy_version
policy_manifest_hash
evidence_hashes
context_refs

admission
  result
  evaluations
  blocking_rules

capacity
  evaluated
  unit
  ceilings
  admitted_maximum
  binding_constraints

warnings
boundary
```

Example blocked result:

```text
ADMISSION
positive surplus     PASS
zero blockers        PASS
normalized evidence  PASS
minimum provenance   BLOCK

BLOCKING RULE
MIN-PROVENANCE

REQUIRED
L2

OBSERVED
L0

CAPACITY EVALUATION
not executed
```

Example admitted result:

```text
QUANTITY CEILINGS

evidence backing        996.20
provenance policy        697.34
resource context         586.56
volatility capacity      431.12  ← BINDING
absolute policy cap    2,500.00

ADMITTED MAXIMUM
431.12 ENERGY_CLAIM_UNIT
```

`DecisionResult` should sit between policy evaluation and `ClaimManifest`:

```text
EvidenceEnvelope
      ↓
ProvenanceDecision
      ↓
PolicyManifest
      ↓
DecisionResult
      ↓
ClaimManifest
      ↓
SettlementResult
```

### 6. `DecisionReceipt`

Every case run should produce a shareable audit/reproduction artifact.

Minimum fields:

```text
decision_id
case_id
evaluated_at
policy_id
policy_version
policy_manifest_hash
evidence_hashes
context identities
rules evaluated
blocking rules
binding quantity ceilings
result
runtime/source revision
data boundary
```

The receipt is the object a researcher shares.

---

## Interface architecture

### Primary navigation

Replace project-component navigation with research tasks:

```text
CASES
COMPARE
STUDIES
RECEIPTS
REFERENCE
```

- **Cases** — perform an investigation.
- **Compare** — compare case × policy × context outcomes.
- **Studies** — published empirical studies, including the current Market Capacity Policy Study.
- **Receipts** — lineage, reproduction, decision artifacts, and downloadable research capsules.
- **Reference** — SolarPunk/SPK, Sepolia proof, protocol contracts, and derivative reference work.

Do not remove the existing validated surfaces. Re-home them.

### Case Explorer

Default work surface:

```text
┌────────────────────┬──────────────────────────────┬─────────────────────┐
│ CASE FILTERS       │ MAP / CASE SURFACE           │ ACTIVE CASE         │
│                    │                              │                     │
│ All                │ linked selectable cases      │ case ID             │
│ Blocked            │                              │ subject             │
│ Admitted           │ layer: binding rule          │ provenance          │
│ Shortfall          │ layer: admitted capacity     │ decision            │
│                    │ layer: shortfall             │ blocking/binding    │
│ domain             │                              │ [ OPEN CASE ]       │
└────────────────────┴──────────────────────────────┴─────────────────────┘
```

The map is a linked query surface, not a solar-potential marketing map.

Initial map layers:

```text
DECISION
BLOCKING RULE
BINDING QUANTITY CEILING
ADMITTED MAXIMUM
POLICY DIFFERENCE
STRESS FAILURE
```

### Case Workspace

Three persistent panes:

```text
┌────────────────────┬──────────────────────────────┬─────────────────────┐
│ CASE               │ DECISION WORKSPACE           │ DECISION DOSSIER    │
│                    │                              │                     │
│ identity           │ admission gates              │ decision ID         │
│ location/window    │ quantity ceilings            │ policy version/hash │
│ evidence summary   │ binding attribution          │ evidence hashes     │
│ provenance         │ counterfactual preview       │ source lineage      │
│ policy             │ stress result                │ temporal semantics  │
│                    │                              │ data boundary       │
└────────────────────┴──────────────────────────────┴─────────────────────┘
```

Case workspace lenses:

```text
EVIDENCE
CONSTRAINTS
COMPARE
STRESS
LINEAGE
```

### Compare Workspace

Comparison must be a first-class research task.

Initial surfaces:

1. Case × policy decision matrix.
2. Binding-rule matrix.
3. Admitted-capacity table.
4. Decision-difference summary.
5. Capacity-versus-failure surface where realized outcomes exist.
6. Stress transition summary:
   - ADMIT → BLOCK;
   - SETTLED → PARTIAL;
   - PARTIAL → SHORTFALL.

Do not present a coverage metric for a case pack unless a real realized-outcome definition and evaluation sample exist.

### Lineage

Expose lineage as a reviewer lens rather than the main workflow.

Conceptual graph:

```text
RESOURCE FILE
      ↓ used by
RESOURCE NORMALIZER
      ↓ generated
RESOURCE CONTEXT
      ├─────────────┐
      ↓             ↓
METER EVIDENCE   RISK CALCULATOR
      └──────┬──────┘
             ↓
      POLICY EVALUATION
             ↓
       DECISION RESULT
             ↓
       CLAIM MANIFEST
```

Every node should expose identity, source revision, inputs, outputs, and data semantics.

---

## Data semantics must remain explicit

The workbench must visibly distinguish four categories:

```text
OBSERVED EVIDENCE
MODELED CONTEXT
DECLARED POLICY
DERIVED RESULT
```

Examples:

- meter/inverter interval rows → observed evidence;
- PVWatts TMY baseline → modeled context;
- `ENERGY-PILOT-002@1.0.0` → declared policy;
- 431.12 admitted maximum → derived result.

This distinction is non-negotiable.

A modeled PVWatts resource ceiling must never be rendered as verified production evidence.

A signed payload must not be rendered as proof that the physical measurement is true.

A provenance class must not imply environmental-attribute ownership, legal redemption rights, or reserve custody.

A settlement-capacity input must remain a declared/modeled input unless independently evidenced.

---

## Initial energy case study

Do not begin with all 12 global map scenarios as a scientific sample.

Start with the three locations that already have the deeper modeled daily baseline:

```text
Taoyuan
Austin
Phoenix
```

Initial case pack:

```text
3 locations
×
4 provenance scenarios
×
3 policies
×
base + declared stress contexts
```

### Initial research questions

1. **Evidence-assurance counterfactual**

   How does assurance state change admission and policy quantity ceilings under otherwise unchanged resource context?

2. **Binding-ceiling heterogeneity**

   Holding policy fixed, which quantity ceiling binds across modeled resource contexts?

3. **Policy capacity cost**

   How much admissible capacity changes when moving from open, pilot, and strict evidence policies?

4. **Settlement stress**

   Under a declared settlement-capacity shock, which admitted claims become partial or shortfall cases?

### Do not claim yet

Do not claim:

> location-conditioned policies improve empirical historical coverage.

That requires an appropriate realized geospatial outcome panel, declared sampling design, temporal semantics, and out-of-sample evaluation.

The initial energy case pack is a **mechanism and decision-structure demonstration**, not a causal or performance study.

---

## Role of the derivative work

The energy-derivatives implementation remains valuable but should not become the universal center of the workbench.

Use it as an optional **Risk Lens** and future quantity-ceiling calculator.

Potential inputs/outputs:

```text
irradiance-derived volatility
basis-risk warning
option/hedge structure
VaR margin
hedge effectiveness
          ↓
VOLATILITY_CAPACITY
or
MARGIN_CAPACITY
```

The workbench must still operate for cases where Black-Scholes, CRR, Monte Carlo, or energy derivatives are not economically meaningful.

Rule:

> Derivative analysis may inform a constraint. It is not the ontology of every claim.

---

## Research assistant boundary

AI is a later interface layer, not decision authority.

Preserve the existing principle:

> **AI advises; deterministic evaluation decides.**

The assistant may:

- retrieve cases;
- retrieve decision results;
- compare constraint evaluations;
- summarize policy differences;
- propose a temporary policy fork;
- draft a research memo;
- point to receipt IDs and lineage nodes.

The assistant must not:

- silently change a policy;
- invent capacity values;
- promote modeled context to observed evidence;
- promote signatures to physical truth;
- authorize claims;
- imply legal settlement rights.

Policy-change interaction:

```text
PROPOSED POLICY DIFF

volatility_multiplier
0.50 → 0.35

CHANGES
VOLATILITY_CAPACITY

DOES NOT CHANGE
evidence
provenance
settlement evidence

[ APPLY AS TEMPORARY FORK ]
```

---

## Execution modes

### Public Study Mode

For licensed or heavy empirical work:

```text
raw/licensed analysis
        ↓
offline runner
        ↓
aggregate study bundle
        ↓
static public lab
```

Keep the current market-capacity public aggregate architecture.

### Local Case Mode

For user evidence:

```text
CSV / JSON / local evidence
        ↓
browser-local normalization
        ↓
hash / diagnose / evaluate
        ↓
decision receipt
```

Keep local processing and fail-closed behavior.

### Repro Compute Mode

For large case packs and research studies:

```text
CLI / Python / Node
        ↓
large dataset
        ↓
case batch / study runner
        ↓
hashed capsule
        ↓
browser inspection
```

Do not force high-volume spatiotemporal panels into the browser merely to claim an all-browser architecture.

---

## Research capsule export

A case or study export should converge toward:

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

Private/licensed evidence should be represented by metadata and hashes rather than redistributed rows:

```text
source_id
source_hash
license
row_count
column_manifest
temporal_extent
spatial_extent
raw_data_included: false
```

---

# Thesis impact assessment

## Source-of-truth warning

The user's prior thesis workflow established `energy_constraint_thesis_v10_standard_format_checked.docx` as the active thesis source and required direct edits to that DOCX rather than reviving older Markdown rewrite pipelines.

The File Library also contains a later `energy_constraint_thesis_final_submission_revised.docx` that incorporates the CEIR negative-identification diagnosis and makes the five-constraint architecture more explicitly primary.

**Do not silently assume the later generated file is canonical merely because its timestamp is newer.**

Before editing the thesis itself, a thesis agent must identify the user-approved canonical DOCX. This document therefore evaluates the workbench against the locked v10 thesis architecture and notes where the later revised wording is directionally stronger.

## Does the workbench invalidate the thesis?

**No.**

The locked thesis asks:

> Can energy act as a credible constraint for digital money through energy-linked financial contracts, and what conditions are needed for that constraint to work?

Its central architecture is:

1. reliable energy data;
2. rule-bound issuance;
3. explicit pricing and risk controls;
4. protected settlement and redemption accounting;
5. limited governance.

The workbench does not replace these five constraints.

It gives the thesis a clearer executable research method for asking:

```text
Does the evidence satisfy the data constraint?
        ↓
Does the declared policy permit admission?
        ↓
Which explicit quantity rule bounds issuance?
        ↓
How is pricing/risk represented?
        ↓
What happens when settlement capacity is insufficient?
        ↓
Can policy identity and governance authority be inspected?
```

The workbench therefore **operationalizes the existing thesis architecture**.

## What changes conceptually

The thesis currently presents the five constraints primarily as an integrated architectural checklist and maps them to a proof-of-concept implementation.

The workbench reveals a stronger formulation:

> The five constraints can be represented as explicit, inspectable decision stages whose failure, blocking rule, quantity limit, and settlement result can be evaluated on a declared case.

That is an improvement in **operational clarity**.

It is not a new master's research question.

## What would disrupt the thesis

The thesis would be disrupted if rewritten around any of the following claims:

- the contribution is a universal bounded-decision engine;
- SolarPunk is merely one arbitrary use case of a generic protocol;
- geography itself validates the thesis;
- the market-capacity study empirically proves the energy architecture;
- all five thesis constraints are mathematically interchangeable capacities;
- provenance, legal ownership, resource output, risk, and settlement can all be collapsed into one scalar `min()` function;
- the workbench is a production decision platform;
- the thesis contribution has shifted from energy-linked digital finance to general policy-as-code.

Those changes would broaden the thesis beyond its literature review, research question, pricing chapter, implementation evidence, and Finance MSc framing.

## What improves the thesis

The workbench strengthens the thesis when framed as:

> **an executable research artifact for applying the five-constraint architecture to explicit energy-linked cases under controlled assumptions.**

Specific improvements:

### 1. Chapter 5 gains a clearer implementation thesis

Current Chapter 5 question:

> What rules must hold in code for energy-linked finance to be credible?

Workbenched interpretation:

> Can those rules be represented as explicit admission, quantity, and settlement decisions with inspectable policy identity and evidence lineage?

This is a direct continuation of Chapter 5.

### 2. The five constraints become testable rather than merely enumerated

Current framework:

```text
data
→ issuance
→ pricing
→ settlement
→ governance
```

Workbenched research form:

```text
CASE
  ↓
DATA ASSURANCE
  block/pass
  ↓
ISSUANCE POLICY
  admission + quantity ceilings
  ↓
PRICING/RISK CONTEXT
  explicit calculator assumptions/results
  ↓
SETTLEMENT
  covered / partial / shortfall
  ↓
GOVERNANCE / POLICY IDENTITY
  version / hash / authority / change boundary
```

This makes the architecture more falsifiable and inspectable.

### 3. The distinction between modeled resource data and settlement evidence becomes visible

The thesis already requires the distinction:

> Satellite and weather data help estimate resource conditions and potential output; actual site-level settlement requires meter, inverter, grid, or audited operator data.

The workbench can encode that distinction directly:

```text
PVWatts / NASA
MODELED CONTEXT

meter / inverter export
OBSERVED EVIDENCE
```

This is a strong implementation of an existing thesis boundary.

### 4. Chapter 4 connects to Chapter 5 more naturally

The current thesis says pricing and risk outputs can inform collateral, oracle tolerance, and settlement protection, but the full pricing engine is not embedded in SPK v1.

The workbench provides an honest bridge:

```text
Chapter 4 risk model
      ↓
versioned risk calculator
      ↓
quantity ceiling or warning
      ↓
DecisionResult
```

This is better than pretending the option engine must run on-chain.

### 5. Chapter 6's future-research path becomes concrete

The thesis already says a future pilot should ask whether verified energy output can connect to rule-bound issuance, explicit pricing, and settlement accounting under controlled contractual terms.

The workbench is the natural experimental apparatus for that future question.

A real operator case would become:

```text
real site evidence
      ↓
CaseManifest
      ↓
provenance classification
      ↓
selected pilot policy
      ↓
DecisionResult
      ↓
bounded claim
      ↓
settlement record
      ↓
research capsule
```

That directly supports the existing future-research boundary.

---

## Recommended thesis treatment

### Recommendation: minimal targeted improvement, not thesis pivot

Do **not** rewrite Chapters 1-4 around the workbench.

Do **not** change the locked title.

Do **not** change the locked research question.

Do **not** replace the five-constraint terminology.

Do **not** add the market-capacity study as new thesis evidence unless the thesis research design is formally reopened.

Do **not** insert a large geospatial empirical claim without a declared sampling/evaluation design.

Instead, after the deterministic workbench objects are real and validated, make a **targeted Chapter 5 / Appendix B / Chapter 6 update**.

### Chapter 1

Likely no substantive change.

Optional one-sentence implementation clarification in §1.4 or §1.5:

> The executable research artifact additionally records how declared evidence and policy rules produce a blocked, capacity-limited, or settlement-constrained result, allowing the five-condition architecture to be inspected as a sequence of explicit decisions.

Only add this after `DecisionResult` and receipts exist in code.

### Chapter 2

No structural rewrite.

The literature gap remains energy-linked credibility and integrated constraints.

Do not introduce generic policy-engine or research-workbench literature into Chapter 2 unless the thesis contribution is intentionally broadened with advisor approval.

### Chapter 3

No change from the CEIR boundary diagnosis.

The market-capacity empirical study is **not Chapter 3 evidence**.

Its role in the repository is methodological inspiration for binding-constraint attribution, not validation of an energy anchor.

### Chapter 4

Minor bridge improvement only.

Potential closing bridge:

> The pricing outputs are therefore best interpreted as explicit risk inputs to a later decision rule rather than as autonomous proof of claim credibility. Chapter 5 evaluates how such declared risk inputs can be combined with evidence, issuance, and settlement rules without treating the pricing model itself as settlement evidence.

This would improve the Chapter 4 → Chapter 5 transition.

### Chapter 5

This is where the workbench matters most.

After implementation exists, Chapter 5 could add a short subsection such as:

> **5.X Case-Based Constraint Evaluation**

Purpose:

- distinguish admission gates, quantity ceilings, and settlement constraints;
- explain `CaseManifest` and `DecisionResult` at a high level;
- show one bounded energy case;
- demonstrate why modeled resource context is not meter evidence;
- identify a blocking rule or binding quantity ceiling;
- show a policy counterfactual;
- retain Sepolia as reference enforcement/implementation evidence.

The subsection should remain concise. A Finance MSc does not need a full software architecture manual.

Suggested case table:

| Stage | Declared input | Evaluation | Result |
|---|---|---|---|
| Data | sample/fixture meter bundle | provenance classification | L0 |
| Admission | ENERGY-PILOT-002 requires L2 | minimum provenance | BLOCK |
| Counterfactual | declared L2 scenario | admission re-evaluation | PASS |
| Quantity | evidence/resource/risk/policy ceilings | minimum applicable ceiling | binding rule identified |
| Settlement | issued amount vs declared capacity | settlement evaluation | PARTIAL/SHORTFALL |

The research claim is:

> The five-constraint architecture can be represented as explicit and inspectable decision stages under controlled assumptions.

Do not claim:

> the case proves real energy-backed finance is economically adequate.

### Appendix B

Best location for technical detail.

Potential additions:

- object identities and hashes;
- policy manifest hash;
- sample `DecisionResult`;
- sample decision receipt;
- one lineage diagram;
- reproduction command;
- browser/local-processing boundary.

### Chapter 6

Update only after the Chapter 5 implementation exists.

Potential contribution refinement:

Current:

> Technically, the thesis provides proof-of-concept evidence that the five constraints can be represented in smart-contract software under controlled assumptions.

Stronger but still bounded:

> Technically, the thesis provides proof-of-concept evidence that the five constraints can be represented as explicit evidence, policy, bounded-decision, claim, and settlement stages under controlled assumptions, with policy and evidence identity retained for inspection and reproduction.

Potential future-research refinement:

> A future operator case should be evaluated as a declared research case with source identity, measurement window, provenance state, policy version, explicit quantity ceilings, and settlement outcome. This would test whether the five-constraint architecture survives real operator evidence without allowing the implementation to hide weak data or discretionary exceptions behind a token label.

---

## Thesis effect by scenario

### Scenario A — deploy current PR only

Effect on thesis:

```text
NEUTRAL TO SLIGHTLY POSITIVE
```

Reason:

- stronger public explanation;
- Decision Brief is outside the thesis evidence chain;
- Claim Lab demonstrates architecture;
- no new thesis result.

Thesis edits required:

```text
none
```

### Scenario B — build Case + DecisionResult + DecisionReceipt

Effect on thesis:

```text
POSITIVE
```

Reason:

- Chapter 5 architecture becomes more explicit;
- five constraints become inspectable stages;
- evidence/policy identity improves technical feasibility evidence;
- no change to the core research question.

Thesis edits recommended:

```text
small Chapter 4 bridge
short Chapter 5 subsection
Appendix B update
small Chapter 6 contribution/future-research refinement
```

### Scenario C — add Taoyuan/Austin/Phoenix modeled cases

Effect on thesis:

```text
POSITIVE AS IMPLEMENTATION DEMONSTRATION
NEUTRAL AS EMPIRICAL EVIDENCE
```

Reason:

- demonstrates heterogeneous modeled context;
- shows why location-sensitive risk/resource inputs can change a decision structure;
- does not provide realized outcomes or causal evidence.

Thesis rule:

> call these controlled modeled cases or scenario demonstrations, not an empirical geography study.

### Scenario D — claim geospatial policy superiority from the 12-city map

Effect on thesis:

```text
NEGATIVE / DISRUPTIVE
```

Reason:

- hand-selected locations;
- TMY/model context;
- no declared realized-outcome panel;
- no spatial sampling design;
- no out-of-sample policy evaluation.

Do not do this.

### Scenario E — build a real geospatial outcome panel and prospectively evaluate policies

Effect on thesis:

```text
POTENTIALLY MAJOR POSITIVE
BUT THESIS-SCOPE REOPENING REQUIRED
```

This could become a new paper, PhD project, or thesis extension.

It should not be casually inserted into the current MSc after the fact.

---

## Thesis risk register

### Risk 1 — genericization

**Failure:** the workbench becomes the thesis and energy becomes a demo.

**Control:** thesis remains energy-linked digital finance; workbench is the executable research artifact used to inspect the five constraints.

### Risk 2 — post-hoc empirical expansion

**Failure:** new map scenarios are presented as evidence because they look analytical.

**Control:** label modeled cases as scenario demonstrations. No historical performance claim without a declared evaluation design.

### Risk 3 — semantic flattening

**Failure:** provenance, resource potential, financial risk, and settlement are all called capacities.

**Control:** typed evaluation stages: admission gate, quantity ceiling, settlement constraint.

### Risk 4 — implementation overclaim

**Failure:** a DecisionResult or receipt is treated as proof of physical truth or legal rights.

**Control:** preserve observed/modeled/declared/derived labels and existing thesis production-readiness boundary.

### Risk 5 — thesis source drift

**Failure:** an agent edits a newer generated thesis file without confirming it is canonical.

**Control:** user-approved DOCX is the source of truth. Prior locked workflow points to `energy_constraint_thesis_v10_standard_format_checked.docx`; later revised files are candidate revisions, not automatic authority.

---

## Build sequence

### Phase 0 — public V1

Deploy the validated current public lab without contract deployment.

Current public V1 remains:

```text
Decision Brief
Market Capacity Policy Study
Reproduction
Claim Lab
SolarPunk reference
Sepolia proof
```

### Phase 1 — decision architecture

Implement and test:

```text
CaseManifest
ConstraintEvaluation
DecisionResult
DecisionReceipt
```

Refactor provenance policy duplication.

No new large UI surface before the deterministic objects are stable.

### Phase 2 — typed constraint registry

Implement:

```text
ADMISSION GATES
POSITIVE_SURPLUS
ZERO_BLOCKERS
SIGNED_EVIDENCE
MIN_PROVENANCE
EXTERNAL_CORROBORATION

QUANTITY CEILINGS
EVIDENCE_BACKED_CAPACITY
PROVENANCE_POLICY_CAPACITY
RESOURCE_CONTEXT_CAPACITY
ABSOLUTE_POLICY_CAP

SETTLEMENT
SETTLEMENT_CAPACITY
```

Do not implement volatility, derivative, or AI calculators until the basic typed model is proven.

### Phase 3 — canonical energy cases

Build:

```text
TYN-001
AUS-001
PHX-001
```

Use existing deeper PVWatts daily baselines.

Attach controlled sample evidence and provenance counterfactuals.

### Phase 4 — Case Workspace

Default workbench:

```text
Cases / map
Decision workspace
Decision dossier
```

Views:

```text
Evidence
Constraints
Compare
Stress
Lineage
```

### Phase 5 — Compare

Implement:

- case × policy decision matrix;
- blocking/binding-rule matrix;
- admitted-capacity comparison;
- policy-difference summary;
- declared stress transition table.

### Phase 6 — receipts and research capsules

Implement:

- decision receipt JSON;
- decision memo Markdown;
- lineage JSON;
- capsule manifest;
- aggregate/private-data boundary metadata.

### Phase 7 — thesis review gate

Only after Phases 1-6 are stable:

1. compare implementation against the canonical thesis DOCX;
2. decide whether Chapter 5 gains a short case-evaluation subsection;
3. update Appendix B with technical evidence;
4. update Chapter 6 contribution/future-research wording;
5. perform a full cross-reference, figure/table, terminology, and source-of-truth audit.

Do not perform scattered thesis edits during frontend development.

### Phase 8 — optional risk lens

Integrate derivative/risk work only as an explicit calculator or analysis lens.

### Phase 9 — optional research assistant

Only after deterministic case → decision → receipt is stable.

---

## Product stop rule

After the following are real:

```text
3 canonical energy cases
3 policy comparisons
typed admission/quantity/settlement evaluation
binding-ceiling attribution
case comparison
stress replay
decision receipt
research capsule
```

stop adding interface surface.

The next development trigger must be one of:

1. real operator meter/inverter evidence;
2. an external researcher or reviewer identifies a concrete comprehension/analysis gap;
3. a formal publication/competition/pilot output requires a new surface;
4. a policy-integrity, evidence-lineage, or security defect is found;
5. a prospectively designed new empirical study is approved.

Do not add more maps, domains, AI agents, dashboards, or blockchain contracts merely to make the project appear larger.

---

## Final product/thesis position

### Product

> A case-based research workbench for evaluating how explicit evidence and policy rules block, bound, and settle financial claims, with binding-rule attribution, counterfactual comparison, stress replay, and reproducible decision receipts.

### Energy reference application

> The first serious case domain tests energy-linked digital finance using modeled resource context, meter/inverter evidence paths, provenance classification, pricing/risk inputs, bounded issuance policy, and explicit settlement shortfall.

### Thesis

> Energy can serve as a credible constraint for digital finance only when reliable energy data, rule-bound issuance, explicit pricing and risk controls, protected settlement and redemption accounting, and limited governance operate together.

### Relationship

> The workbench does not replace the thesis. It makes the thesis's five-constraint architecture executable and inspectable as a sequence of explicit research decisions.

The implementation should strengthen Chapter 5 and the future-research path **only after the deterministic decision architecture exists in code and is validated**. Until then, the current thesis remains academically safer than a speculative rewrite based on an interface plan.
