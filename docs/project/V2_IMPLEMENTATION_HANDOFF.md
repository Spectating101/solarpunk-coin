# V2 Implementation Handoff — Case Workbench

**Purpose:** file-level implementation plan for a local coding agent or future ChatGPT/Codex session.  
**Product blueprint:** `PLATFORM_BLUEPRINT.md`  
**Recovery entry:** `MASTER_PLATFORM_HANDOFF.md`  
**Thesis/product boundary:** `CASE_WORKBENCH_PRODUCT_AND_THESIS_DIRECTION.md`

---

# 1. Handoff posture

Do not start by redesigning the frontend.

The V2 order is:

```text
DETERMINISTIC OBJECTS
        ↓
TYPED CALCULATORS
        ↓
DECISION ENGINE
        ↓
CANONICAL CASE PACK
        ↓
CASE WORKSPACE
        ↓
COMPARE / STRESS
        ↓
RECEIPTS / CAPSULE
        ↓
THESIS REVIEW GATE
```

The principal current architecture gap is not CSS.

It is that the empirical study has a real binding-capacity concept:

```text
permitted = min(volatility_capacity, liquidity_capacity)
```

while the executable Claim Lab currently evaluates:

```text
admission checks
      ↓
gross = surplus × rate
      ↓
risk_adjusted = gross × (1 - fixed haircut)
      ↓
maximum = min(risk_adjusted, absolute cap)
```

V2 must add typed rule evaluation and a first-class `DecisionResult` before presenting the interface as a general case workbench.

---

# 2. Current repository state

Repository:

```text
Spectating101/solarpunk-coin
```

Current documentation branch at handoff creation:

```text
agent/decision-brief
```

Draft PR:

```text
#4
Add answer-first policy decision brief
```

Validated code head:

```text
a7403e0ad13249fe010ad53eabaccebe58beac1e
```

The V1 code at that head passed the complete current workflow and browser review.

Documentation commits after that code head record V2 direction only.

They do not validate a V2 implementation because V2 does not exist yet.

---

# 3. Branch strategy

## Preferred sequence

1. review PR #4;
2. merge PR #4 into `main`;
3. publish the static V1 interface using `LOCAL_AGENT_INTERFACE_HANDOFF.md`;
4. create a new branch from the merged `main`:

```text
agent/case-workbench-v2
```

5. implement V2 there.

## If V2 must begin before PR #4 merge

Create a new branch from the current PR head.

Do **not** add V2 code directly to PR #4.

PR #4 should remain understandable as the V1 Decision Brief/interface pass plus documentation.

Recommended:

```bash
git fetch origin
git checkout agent/decision-brief
git pull --ff-only origin agent/decision-brief
git checkout -b agent/case-workbench-v2
git push -u origin agent/case-workbench-v2
```

Do not force-push PR #4 to replace it with V2.

---

# 4. Read order before coding

Read completely:

```text
docs/project/MASTER_PLATFORM_HANDOFF.md
docs/project/PLATFORM_BLUEPRINT.md
docs/project/CASE_WORKBENCH_PRODUCT_AND_THESIS_DIRECTION.md
docs/project/LOCAL_AGENT_INTERFACE_HANDOFF.md
```

Then inspect:

```text
packages/constraint-core/src/index.js
packages/constraint-core/src/index.d.ts
packages/constraint-core/src/provenance.js
packages/constraint-core/src/policies.js
packages/constraint-core/src/claim.js
packages/constraint-core/src/portableEvidence.js
packages/constraint-core/src/adapters.js

protocol/schema/README.md
protocol/schema/evidence-envelope.v1.schema.json
protocol/schema/provenance-decision.v1.schema.json
protocol/schema/policy-manifest.v1.schema.json
protocol/schema/claim-manifest.v1.schema.json
protocol/schema/settlement-result.v1.schema.json

protocol/policies/LAB-OPEN-001.json
protocol/policies/ENERGY-PILOT-002.json
protocol/policies/ENERGY-STRICT-003.json
protocol/policies/SPK-ENERGY-001.json

frontend/src/App.jsx
frontend/src/components/ConstraintProtocolLab.jsx
frontend/src/components/DecisionBrief.jsx
frontend/src/components/EmpiricalRunsLab.jsx
frontend/src/components/EmpiricalReproductionLab.jsx
frontend/src/lib/sessionReceipt.js

frontend/src/components/SPKMintDemo.jsx
frontend/src/components/SitePilotSimulator.jsx
frontend/src/models/sitePilotModel.js

state/product/nrel_solar_map_scenarios.json
docs/product/NREL_SOLAR_TRAINING_LAB.md
scripts/nrel_solar_training_lab.js
state/product/spk_intelligence_layer.json
```

Do not code from this handoff without checking the actual branch because file names or implementation may have moved after this document was written.

---

# 5. Naming constraints

Do not rename the project to `Constraint`.

Do not tell the user they chose `Constraint`.

Internal existing identifiers are preserved:

```text
@solarpunk/constraint-core
solarpunk.constraint.*
constraint-market-capacity-*
```

These are implementation namespaces.

The current public shell label `Policy Lab` is descriptive.

The V2 product description is:

```text
case-based constraint research workbench
```

This is not a final brand.

No broad naming migration is in V2 scope.

---

# 6. Non-negotiable trust boundaries

Preserve:

```text
OBSERVED EVIDENCE
MODELED CONTEXT
DECLARED POLICY
DERIVED RESULT
```

Never:

- treat PVWatts/NASA data as observed meter evidence;
- treat a signature as physical truth;
- treat provenance as legal ownership;
- treat a DecisionResult as issuance authority;
- treat settlement simulation as reserve custody;
- imply legal redemption rights;
- present L0 counterfactual scenarios as real upgraded evidence;
- call the initial three-location case pack an empirical geospatial performance study.

---

# 7. Phase 0 — V1 release gate

This phase is owned by `LOCAL_AGENT_INTERFACE_HANDOFF.md`.

Do not change its release scope.

V1 release remains static Pages publication only.

No generalized protocol Sepolia deployment.

No contract mutation.

No private key required.

Required V1 validation from repository root:

```bash
npm install
node --test packages/constraint-core/test/*.test.mjs
npx hardhat test test/ConstraintProtocol.test.js
npx hardhat test

npm --prefix frontend install
npm --prefix frontend run test:run
npm --prefix frontend run build
```

Browser review:

```bash
cd frontend
npm run preview -- --host 127.0.0.1 --port 4173
```

Then from repository root:

```bash
rm -rf _review_protocol_alpha
node scripts/capture_constraint_protocol_alpha.mjs _review_protocol_alpha
```

Publish only after merge using the documented preflight/publish path.

---

# 8. Phase 1A — portable object foundation

## Goal

Add deterministic object shapes without changing V1 policy behavior.

## Files to add

```text
packages/constraint-core/src/case.js
packages/constraint-core/src/context.js
packages/constraint-core/src/constraints.js
packages/constraint-core/src/decision.js
packages/constraint-core/src/receipt.js

protocol/schema/case-manifest.v1.schema.json
protocol/schema/context-manifest.v1.schema.json
protocol/schema/constraint-evaluation.v1.schema.json
protocol/schema/decision-result.v1.schema.json
protocol/schema/decision-receipt.v1.schema.json
```

## Files to update

```text
packages/constraint-core/src/index.js
packages/constraint-core/src/index.d.ts
protocol/schema/README.md
```

## Do not edit yet

```text
frontend/src/App.jsx
frontend/src/components/ConstraintProtocolLab.jsx
packages/constraint-core/src/policies.js
packages/constraint-core/src/provenance.js
packages/constraint-core/src/claim.js
```

except where a minimal type/export change is strictly required.

## `case.js`

Implement:

```text
caseManifestBody(caseManifest)
hashCaseManifest(caseManifest)
```

Validation requirements:

```text
schema exact
case_id non-empty
subject non-empty
case_type non-empty
evidence_refs array
context_refs array
spatial coordinates finite when present
measurement start/end valid when present
end >= start
```

Do not require geography universally.

## `context.js`

Implement:

```text
contextManifestBody(context)
hashContextManifest(context)
```

Required conceptual fields:

```text
schema
context_id
context_type
label
source
values
context_hash
hash_algorithm
boundary
```

`context_hash` should be generated from the canonical body excluding the hash itself.

## `constraints.js`

Initial exports:

```text
CONSTRAINT_CLASSES
createCalculatorRegistry
constraintEvaluationBody
```

Allowed classes:

```text
ADMISSION_GATE
QUANTITY_CEILING
SETTLEMENT_CONSTRAINT
```

Do not implement all calculators in Phase 1A.

First prove registry identity and deterministic result shape.

## `decision.js`

Initial exports:

```text
decisionResultBody
hashDecisionResultBody
buildDecisionResult
assertComparableCapacityUnits
```

Do not connect to V1 policies yet.

## `receipt.js`

Initial exports:

```text
buildDecisionReceipt
receiptSummary
```

## Phase 1A tests

Add:

```text
packages/constraint-core/test/case-context.test.mjs
packages/constraint-core/test/constraint-registry.test.mjs
packages/constraint-core/test/decision-result.test.mjs
packages/constraint-core/test/decision-receipt.test.mjs
```

Update:

```text
packages/constraint-core/test/schema-shape.test.mjs
```

### Acceptance gate

```text
[ ] V1 core tests unchanged and green
[ ] new schemas parse and pass shape tests
[ ] case hash deterministic
[ ] context hash deterministic
[ ] registry rejects duplicate calculator ID/version conflict
[ ] decision result rejects mixed quantity units
[ ] blocked result can represent capacity_evaluated=false
[ ] decision receipt preserves decision identity
[ ] npm pack --dry-run --prefix packages/constraint-core contains new source modules
```

Run:

```bash
node --test packages/constraint-core/test/*.test.mjs
npm pack --dry-run --prefix packages/constraint-core
```

Commit suggestion:

```text
Add portable case and decision objects
```

Stop and review before Phase 1B.

---

# 9. Phase 1B — typed calculator registry

## Goal

Implement the first deterministic admission and quantity calculators.

## File focus

```text
packages/constraint-core/src/constraints.js
packages/constraint-core/src/decision.js
packages/constraint-core/src/index.d.ts
packages/constraint-core/test/constraint-registry.test.mjs
packages/constraint-core/test/decision-result.test.mjs
```

## Built-in admission calculators

Implement:

```text
POSITIVE_SURPLUS
ZERO_BLOCKERS
SIGNED_EVIDENCE
MIN_PROVENANCE
EXTERNAL_CORROBORATION
```

### `POSITIVE_SURPLUS`

Input:

```text
evidence.summary.total_eligible_surplus_kwh
```

Pass condition:

```text
> 0
```

### `ZERO_BLOCKERS`

Input:

```text
evidence.summary.blocker_count
```

Pass condition:

```text
=== 0
```

### `SIGNED_EVIDENCE`

Input:

```text
evidence.capabilities.signed
```

### `MIN_PROVENANCE`

Input:

```text
provenance.level
rule.parameters.minimum
```

Use existing `provenanceRank`.

### `EXTERNAL_CORROBORATION`

Use explicit evidence capability and/or classified provenance attributes.

Do not infer corroboration from a source name string.

## Built-in quantity calculators

Implement:

```text
EVIDENCE_BACKED_CAPACITY
PROVENANCE_POLICY_CAPACITY
RESOURCE_CONTEXT_CAPACITY
ABSOLUTE_POLICY_CAP
```

### `EVIDENCE_BACKED_CAPACITY`

Concept:

```text
total eligible surplus × declared rate
```

The output unit comes from policy rule configuration.

### `PROVENANCE_POLICY_CAPACITY`

Policy rule parameters own the mapping.

Do not use `provenance.default_haircut_pct` or `default_cap_kwh_day` as the V2 decision source.

Example policy parameters:

```json
{
  "capacity_multiplier_by_level": {
    "L0": 0,
    "L1": 0.4,
    "L2": 0.7,
    "L3": 0.88,
    "L4": 0.95
  }
}
```

### `RESOURCE_CONTEXT_CAPACITY`

Initial implementation must use an explicit context manifest.

Do not directly read `state/product/nrel_solar_map_scenarios.json` inside the core calculator.

The case pack builder should convert relevant data into a context manifest first.

The exact initial formula must be declared in the rule parameters and documented.

Do not invent a hidden resource multiplier.

### `ABSOLUTE_POLICY_CAP`

Return the declared maximum in the common claim unit.

## Comparable unit enforcement

Quantity evaluations entering the minimum operation must have the same `unit` and compatible decimal semantics.

Fail closed on:

```text
ENERGY_CLAIM_UNIT vs USD
SPK vs kWh
missing unit
NaN
Infinity
negative capacity
```

Do not silently normalize units without an explicit conversion calculator.

## Binding attribution

Algorithm:

```text
applicable quantity evaluations
      ↓
minimum capacity
      ↓
all evaluations equal to minimum within deterministic numeric tolerance
      ↓
binding constraint ID list
```

Prefer exact rounded canonical values before attribution.

Document the rounding/tolerance rule.

## Phase 1B conformance vectors

Add deterministic vectors for:

```text
L0 blocked under pilot policy
positive surplus blocked by signature requirement
L2 admission passes
absolute cap binds
resource context binds
evidence backing binds
two quantity ceilings tie
mixed unit fails closed
```

### Acceptance gate

```text
[ ] every calculator has ID + version + constraint class
[ ] admission evaluations return PASS/BLOCK
[ ] quantity evaluations return common-unit capacity
[ ] blocked admission skips quantity evaluation
[ ] binding attribution returns one or tie-set IDs
[ ] calculator parameters appear in evaluation object
[ ] evaluation explanations are deterministic text or deterministic code-backed fields
[ ] unit mismatch throws/fails closed
[ ] all V1 tests remain green
```

Commit suggestion:

```text
Add typed constraint calculator registry
```

---

# 10. Phase 1C — V2 policy and decision engine

## Goal

Create a real V2 policy object and connect policy → calculators → DecisionResult.

## Add schema

```text
protocol/schema/policy-manifest.v2.schema.json
```

Runtime identifier:

```text
solarpunk.constraint.policy_manifest.v2
```

## Add V2 policies

Do not reuse existing V1 policy IDs with changed semantics.

Suggested IDs:

```text
LAB-CASE-OPEN-004
ENERGY-CASE-PILOT-005
ENERGY-CASE-STRICT-006
```

Final IDs may differ, but they must be new if semantics differ.

Store under:

```text
protocol/policies-v2/
```

or another clearly separated path.

Do not overwrite:

```text
LAB-OPEN-001
ENERGY-PILOT-002
ENERGY-STRICT-003
SPK-ENERGY-001
```

## Policy v2 fields

At minimum:

```text
schema
id
version
name
description
admission_rules
quantity_rules
settlement
governance
```

Every rule entry:

```text
calculator_id
parameters
rule_id optional but recommended
```

## `evaluateCaseDecision`

Implement in:

```text
packages/constraint-core/src/decision.js
```

Inputs:

```text
caseManifest
evidenceByHash
provenanceByEvidence or resolved provenance
contextsById
policy
calculatorRegistry
```

Output:

```text
DecisionResult
```

### Decision sequence

```text
validate identities
      ↓
evaluate admission rules in declared order
      ↓
collect blocking rules
      ↓
IF BLOCKED
  capacity.evaluated = false
  decision = BLOCKED
  return
      ↓
evaluate quantity rules
      ↓
assert comparable units
      ↓
find minimum
      ↓
attribute binding tie set
      ↓
decision = ADMIT_WITH_LIMIT
      ↓
hash canonical decision body
```

## Decision identity

The decision ID must be deterministic for equivalent declared inputs.

Include:

```text
case ID
case hash if available
evidence hashes
context IDs + context hashes
policy ID/version/hash
calculator IDs + versions
rule parameters
admission results
quantity results
```

Exclude:

```text
UI route
selected panel
browser width
memo generation timestamp
```

`evaluated_at` belongs in the receipt, not necessarily in deterministic decision identity.

## Phase 1C tests

Add:

```text
packages/constraint-core/test/case-decision-conformance.test.mjs
```

Required:

```text
same inputs → same decision ID
policy parameter change → different decision ID
context hash change → different decision ID
evidence hash change → different decision ID
blocked decision has no admitted maximum above zero
admitted decision exposes binding constraint
```

### Acceptance gate

```text
[ ] V2 policy schema published
[ ] V1 policy schema untouched
[ ] V1 policy IDs untouched
[ ] three V2 policy manifests schema-valid
[ ] evaluateCaseDecision deterministic
[ ] DecisionResult schema-valid
[ ] decision IDs change on material declared-input change
[ ] V1 Claim Lab still passes existing tests
```

Commit suggestion:

```text
Add V2 case decision engine
```

---

# 11. Phase 1D — provenance policy separation

## Goal

Stop V2 from treating provenance classifier defaults as universal economic policy.

Current source:

```text
packages/constraint-core/src/provenance.js
```

Current `PROVENANCE_LEVELS` includes:

```text
haircut_pct
cap_kwh_day
closed_pilot
paid_launch
```

Current `classifyProvenance` emits:

```text
default_haircut_pct
default_cap_kwh_day
closed_pilot_candidate
paid_launch_hardware_candidate
```

## Migration rule

Do not delete these fields immediately because V1 or docs/tests may rely on them.

### Phase 1D approach

1. preserve current fields;
2. add an explicit deprecated/legacy comment in source and docs;
3. add `assurance_attributes` or equivalent descriptive object if useful;
4. make V2 calculators ignore provenance default haircut/cap fields;
5. update type definitions to mark them deprecated in comments;
6. add tests proving V2 capacity comes from policy rule parameters, not provenance defaults.

## Do not do

Do not change L0-L4 classification thresholds casually.

The classification logic itself is not the same problem as economic-policy duplication.

### Acceptance gate

```text
[ ] V1 provenance outputs remain backward compatible
[ ] V2 policy comparison can map the same L2 evidence to different capacity
[ ] V2 tests prove provenance default cap is not used
[ ] assurance reasons / missing-next-level remain intact
```

Commit suggestion:

```text
Separate evidence assurance from V2 capacity policy
```

---

# 12. Phase 2 — canonical energy case pack

## Goal

Create three controlled energy cases using existing modeled resource assets.

Cases:

```text
TYN-001
AUS-001
PHX-001
```

## Existing source material

Use:

```text
docs/product/NREL_SOLAR_TRAINING_LAB.md
scripts/nrel_solar_training_lab.js
state/product/nrel_solar_map_scenarios.json
```

Known deeper modeled baselines:

```text
Taoyuan 10 kW rooftop
annual AC 11743.0994 kWh
capacity factor 13.4054%
NSRDB PSM V3 Himawari tmy-2020 3.2.0

Austin 10 kW rooftop
annual AC 14761.5443 kWh
capacity factor 16.8511%
NSRDB PSM V3 GOES tmy-2020 3.2.0

Phoenix 10 kW rooftop
annual AC 17551.196 kWh
capacity factor 20.0356%
NSRDB PSM V3 GOES tmy-2020 3.2.0
```

The training lab documents 1,095 daily modeled rows total.

It also contains a seven-row Taoyuan operator-sample versus modeled-resource cross-check.

## Do not call external APIs by default

Prefer committed/generated source artifacts already in the repo.

Only refresh PVWatts if:

- existing generated artifact is missing or corrupt;
- the user explicitly approves refresh;
- API access is available;
- the new source identity and generated timestamp are recorded.

A refresh can change modeled values and therefore decision IDs.

## Proposed case-pack paths

```text
protocol/cases/energy-v1/
│
├── case-pack.json
├── cases/
│   ├── TYN-001.json
│   ├── AUS-001.json
│   └── PHX-001.json
├── contexts/
│   ├── tyn-resource-context.json
│   ├── aus-resource-context.json
│   └── phx-resource-context.json
├── evidence/
│   ├── tyn-sample-evidence.json
│   ├── aus-sample-evidence.json
│   └── phx-sample-evidence.json
├── scenarios/
│   ├── provenance-L0.json
│   ├── provenance-L1.json
│   ├── provenance-L2.json
│   └── provenance-L4.json
└── README.md
```

## Evidence strategy

Do not fabricate three real operator sites.

Use controlled sample/fixture evidence and label it.

Possible paths:

### TYN-001

Use the existing seven-row operator sample as a sample/fixture evidence case where licensing/privacy permits the committed artifact.

Classify initial case as L0 unless the trusted real-operator context is genuinely established.

### AUS-001 / PHX-001

Use deterministic synthetic/sample evidence derived for mechanism demonstration.

Label:

```text
SAMPLE FIXTURE
```

Do not label as operator data.

## Provenance counterfactual scenarios

Scenarios are declared assurance contexts.

They do not modify evidence hash.

Example:

```json
{
  "scenario_id": "PROVENANCE-L2-COUNTERFACTUAL",
  "kind": "provenance_context_counterfactual",
  "context": {
    "trusted_operator_context": true,
    "signed": true,
    "live_gateway": true
  },
  "boundary": "Declared assurance counterfactual; no new observed evidence supplied."
}
```

## Initial case-pack research claims

Allowed:

```text
same case can be blocked or admitted under declared assurance/policy differences
applicable quantity ceilings can bind differently across modeled contexts
same policy can produce different binding ceilings
settlement stress can create partial/shortfall states
```

Not allowed:

```text
Phoenix policy is empirically superior
Taoyuan is riskier in realized markets
location-conditioned policy improves historical coverage
three sites represent global solar heterogeneity
```

## Case pack acceptance gate

```text
[ ] all case manifests schema-valid
[ ] all context manifests schema-valid
[ ] all evidence objects have explicit sample/observed labels in metadata/boundary
[ ] modeled context is marked TMY/model
[ ] no API key in artifacts
[ ] no source is mislabeled as real operator evidence
[ ] all three cases evaluate deterministically
[ ] at least one blocked decision exists
[ ] at least one admitted decision exists
[ ] at least two different binding ceilings appear across declared case/policy runs OR the case/policy design is revised honestly
[ ] no illustrative blueprint numbers are hard-coded unless derived by the actual calculators
```

Commit suggestion:

```text
Add canonical energy case pack
```

---

# 13. Phase 3 — frontend case runtime

## Goal

Load case packs and run deterministic decisions in the browser without replacing the V1 routes yet.

## Add files

Recommended:

```text
frontend/src/app/routes.js
frontend/src/app/CaseWorkbenchProvider.jsx
frontend/src/lib/casePack.js
frontend/src/lib/decisionRuntime.js
frontend/src/lib/receipt.js
```

## `casePack.js`

Responsibilities:

```text
load bundled case pack
index cases by ID
index contexts by ID/hash
index evidence by hash
load V2 policy manifests
resolve declared provenance scenario
```

Fail closed on duplicate IDs.

## `decisionRuntime.js`

Thin browser adapter over `@solarpunk/constraint-core`.

Responsibilities:

```text
resolve active case objects
resolve policy
resolve provenance scenario
call evaluateCaseDecision
build receipt
```

Do not duplicate calculator formulas in React components.

## `CaseWorkbenchProvider`

Use `useReducer`.

Initial state:

```text
case pack
cases index
active case ID
active policy ref
active provenance scenario
active stress scenario
active decision ID
decisions by ID
pinned case IDs
receipts by ID
```

Do not add Redux/Zustand unless reducer complexity becomes materially unmanageable.

## Persistence

Initial:

```text
bundled case pack      static
raw local evidence     memory only
active selection       memory
optional summary       sessionStorage
receipts               memory + explicit download
```

Do not persist raw evidence into localStorage.

## Acceptance gate

```text
[ ] provider loads three canonical cases
[ ] selecting case changes resolved case
[ ] selecting policy reruns decision
[ ] selecting provenance scenario creates new decision without mutating original evidence
[ ] decisions are indexed by deterministic ID
[ ] React components do not contain policy formulas
[ ] V1 routes still render
```

Commit suggestion:

```text
Add browser case decision runtime
```

---

# 14. Phase 4 — route architecture

## Goal

Add V2 task navigation while keeping legacy aliases.

## Current problem

`frontend/src/App.jsx` uses:

```text
NAV_TABS
ROUTE_IDS Set
simple exact hash IDs
```

This cannot represent dynamic case/receipt IDs cleanly.

## Add

```text
frontend/src/app/routes.js
```

Implement:

```text
parseHashRoute
routeToHash
normalizeLegacyRoute
```

Proposed routes:

```text
#cases
#case/TYN-001
#compare
#studies
#study/market-capacity-v1
#receipts
#receipt/<decision-id>
#reference
#reference/solarpunk
#reference/sepolia
#reference/derivatives
```

Legacy aliases:

```text
#runs       → market-capacity study brief
#study      → market-capacity study detail
#reproduce  → study receipt/reproduction
#protocol   → legacy Claim Lab until V2 feature parity
#overview   → reference/solarpunk
#sepolia    → reference/sepolia
#research   → studies/reference methods
```

## Do not add React Router immediately

A small deterministic route parser is enough for this static application.

## Acceptance gate

```text
[ ] old hashes still resolve
[ ] direct #case/TYN-001 load works
[ ] invalid case ID falls back to case index with visible error
[ ] Sepolia route remains lazy
[ ] wallet provider initializes only on Sepolia route
```

Commit suggestion:

```text
Add workbench route model and legacy aliases
```

---

# 15. Phase 5 — Case Explorer

## Add components

```text
frontend/src/cases/CaseExplorer.jsx
frontend/src/cases/CaseFilters.jsx
frontend/src/cases/CaseMapSurface.jsx
frontend/src/cases/ActiveCasePreview.jsx
```

Styles:

```text
frontend/src/styles/caseWorkbench.css
frontend/src/styles/semantics.css
```

## Map implementation

Initial map may reuse the current simple point-position method.

Do not add a map framework yet.

Requirements:

```text
case points selectable
accessible case list mirrors map
layer switch changes point semantics
selected point linked to active preview
keyboard user can select every case without map
```

Initial layers:

```text
DECISION
BLOCKING RULE
BINDING QUANTITY CEILING
ADMITTED MAXIMUM
STRESS FAILURE
EVIDENCE ASSURANCE
```

`POLICY DIFFERENCE` may be added when Compare state exists.

## Acceptance gate

```text
[ ] case list and map use same case source
[ ] selecting case updates preview
[ ] filter counts derive from decisions
[ ] modeled/observed labels visible
[ ] no horizontal overflow desktop/mobile
[ ] map is not the sole navigation method
```

Commit suggestion:

```text
Add case explorer and linked map surface
```

---

# 16. Phase 6 — Case Workspace

## Add components

```text
frontend/src/cases/CaseWorkspace.jsx
frontend/src/cases/CaseIdentityPane.jsx
frontend/src/cases/CaseLensNav.jsx
frontend/src/cases/DecisionDossier.jsx
frontend/src/cases/lenses/EvidenceLens.jsx
frontend/src/cases/lenses/ConstraintsLens.jsx
frontend/src/cases/lenses/CompareLens.jsx
frontend/src/cases/lenses/StressLens.jsx
frontend/src/cases/lenses/LineageLens.jsx
```

## First implementation order

```text
CaseWorkspace shell
      ↓
ConstraintsLens
      ↓
EvidenceLens
      ↓
DecisionDossier
      ↓
CompareLens
      ↓
StressLens
      ↓
LineageLens
```

Build Constraints first because it is the central product value.

## Constraints Lens requirements

Blocked decision:

```text
current decision visible at top
admission gate table
blocking rule emphasized
required vs observed values
capacity evaluation explicitly NOT EXECUTED
counterfactual preview action
```

Admitted decision:

```text
current decision visible at top
admission pass summary
all applicable quantity ceilings
binding ceiling emphasized
admitted maximum
rule detail inspector
```

## Counterfactual preview

A preview must create a new derived decision object.

Display diff:

```text
CHANGED
provenance scenario L0 → L2

UNCHANGED
evidence hash
resource context hash
policy ID/version/hash
```

Never overwrite original decision.

## Evidence Lens requirements

Preserve existing Claim Lab value:

```text
source identity
normalization summary
accepted/rejected rows
interval table
diagnostics
capabilities
provenance reasons
missing for next level
```

## Decision Dossier requirements

Persistent:

```text
decision ID
case ID
policy ID/version/hash
evidence hashes
context IDs/hashes
temporal semantics
runtime/source revision
data boundary
```

## Acceptance gate

```text
[ ] blocked case explanation understandable without opening JSON
[ ] admitted case shows binding ceiling
[ ] rule inspector exposes inputs/parameters
[ ] counterfactual creates separate decision ID
[ ] evidence hash remains unchanged in assurance counterfactual
[ ] dossier identity updates with active decision
[ ] mobile collapses panes without losing identity
```

Commit suggestion:

```text
Add case decision workspace
```

---

# 17. Phase 7 — Compare workspace

## Add components

```text
frontend/src/compare/CompareWorkspace.jsx
frontend/src/compare/CompareCasePicker.jsx
frontend/src/compare/ComparePolicyPicker.jsx
frontend/src/compare/DecisionMatrix.jsx
frontend/src/compare/BindingMatrix.jsx
frontend/src/compare/CapacityTable.jsx
frontend/src/compare/PolicyDifferenceSummary.jsx
```

## Required initial comparisons

```text
3 canonical cases
×
3 V2 policies
```

## Decision matrix cell

Show:

```text
decision state
blocking rule if blocked
binding ceiling if admitted
admitted maximum if admitted
```

## Binding matrix

Blocked:

```text
blocking rule
```

Admitted:

```text
binding quantity ceiling
```

Do not label blocked admission rule as a quantity constraint.

## Difference summary

Classify:

```text
UNCHANGED
BLOCK → ADMIT
ADMIT → BLOCK
ADMITTED LOWER CAPACITY
ADMITTED HIGHER CAPACITY
BINDING RULE CHANGED
```

A single comparison can have capacity and binding-rule changes; define whether summary categories are exclusive or multi-label.

Prefer multi-label detail and a simple primary transition summary.

## Acceptance gate

```text
[ ] all matrix values derive from DecisionResults
[ ] no policy formula duplicated in comparison code
[ ] clicking cell opens decision
[ ] same case / same policy ID resolves same decision ID
[ ] blocked/admitted semantics remain distinct
[ ] table usable on mobile via scroll or stacked detail
```

Commit suggestion:

```text
Add case and policy comparison workspace
```

---

# 18. Phase 8 — Stress scenarios

## Add schema

```text
protocol/schema/stress-scenario.v1.schema.json
```

## Add core support

Possible file:

```text
packages/constraint-core/src/stress.js
```

Exports:

```text
applyStressScenario
stressScenarioBody
hashStressScenario
```

Update `index.js` and `index.d.ts`.

## Initial stress scope

Use settlement stress first.

Reason:

The current settlement engine already has explicit capacity and shortfall semantics.

Initial scenario:

```text
settlement capacity multiplier
```

Do not invent a weather-risk model in the first stress phase.

## Stress transformation requirements

Scenario records:

```text
changed target
operation
value
unchanged identities
boundary
```

Original case/decision objects remain immutable.

## Stress result

For settlement stress:

```text
base claim
stress scenario
stressed settlement input
SettlementResult
transition classification
```

## Acceptance gate

```text
[ ] original decision unchanged
[ ] scenario hash deterministic
[ ] changed/unchanged fields visible
[ ] settlement stress can produce SETTLED/PARTIAL/SHORTFALL
[ ] compare workspace can show transitions
```

Commit suggestion:

```text
Add declared settlement stress replay
```

---

# 19. Phase 9 — receipts and research capsule

## Core receipt

Use `buildDecisionReceipt`.

Receipt must include:

```text
decision ID
case ID
evaluated_at
policy identity/hash
evidence identities
context identities
calculator IDs/versions
rules evaluated
blocking rules
binding ceilings
result
runtime/source revision
data boundary
```

`evaluated_at` can vary; decision ID must not.

## Frontend components

```text
frontend/src/receipts/ReceiptIndex.jsx
frontend/src/receipts/ReceiptDetail.jsx
frontend/src/receipts/DecisionReceiptView.jsx
frontend/src/receipts/CapsuleExport.jsx
```

## Memo

Generate Markdown from the receipt and decision.

Include:

```text
decision statement
case identity
policy identity
admission gate results
quantity ceiling table
binding rule
stress result if selected
evidence/context receipt
data boundary
```

## Capsule assembly

Initial browser implementation may generate files in memory.

A ZIP dependency may be added only here if necessary.

Before adding a dependency:

1. inspect license;
2. inspect bundle size;
3. confirm browser support;
4. keep capsule generation off the entry path where possible.

Alternative initial output:

```text
single JSON capsule manifest + individual downloads
```

If ZIP scope threatens V2 completion, ship the manifest and file downloads first.

## Acceptance gate

```text
[ ] receipt JSON downloads
[ ] memo Markdown downloads
[ ] receipt has decision/policy/evidence identity
[ ] private raw evidence excluded by default
[ ] capsule manifest hashes listed files
[ ] reproduction metadata records runtime revision
```

Commit suggestion:

```text
Add decision receipts and research capsule export
```

---

# 20. Phase 10 — Studies and Reference re-home

Do this only after Case/Compare/Receipt surfaces work.

## Studies

Wrap existing:

```text
DecisionBrief
EmpiricalRunsLab
EmpiricalReproductionLab
```

under a Market Capacity Study route.

Do not recompute or change committed empirical metrics.

## Reference

Move or wrap:

```text
SolarPunk reference
Sepolia proof
derivative reference
```

The current `SpkV1Console` must stay lazy.

## Legacy Claim Lab

Keep a legacy route or internal comparison until V2 has parity for:

```text
all five evidence adapters
local file processing
provenance explanation
policy selection
claim creation
settlement simulation
artifact download
```

Then decide whether to archive `ConstraintProtocolLab` under a legacy/reference component path.

Do not delete functioning evidence adapters during interface migration.

## Acceptance gate

```text
[ ] current study values unchanged
[ ] reproduction reaches EXACT
[ ] SolarPunk reference visible
[ ] Sepolia proof loads lazily
[ ] legacy links resolve
[ ] V1 Claim Lab behavior either preserved or explicitly archived after parity
```

Commit suggestion:

```text
Re-home studies and SolarPunk reference in workbench shell
```

---

# 21. Phase 11 — visual and accessibility hardening

Only now perform the broad frontend polish pass.

## Desktop

Review:

```text
1280
1440
1920
```

## Mobile

Review at least:

```text
375
390
430
```

## Critical UI checks

```text
no horizontal overflow
persistent case/policy identity remains visible
blocking rule not buried
binding ceiling not buried
modeled vs observed labels visible
map has accessible list alternative
matrix readable or inspectable on mobile
receipt actions keyboard accessible
reduced motion respected
```

## V2 browser capture

Suggested screenshots:

```text
01-case-explorer-binding-layer.png
02-case-blocked-l0.png
03-case-counterfactual-l2.png
04-case-admitted-binding-ceiling.png
05-constraint-detail.png
06-compare-decision-matrix.png
07-compare-binding-matrix.png
08-stress-partial.png
09-lineage.png
10-decision-receipt.png
11-market-capacity-study.png
12-reference-solarpunk.png
13-mobile-case-explorer.png
14-mobile-blocked-case.png
15-mobile-admitted-case.png
16-mobile-compare.png
17-mobile-receipt.png
```

Do not preserve 19 screenshots merely because V1 had 19.

Capture required workflows.

---

# 22. Phase 12 — CI gate

Update the existing alpha workflow or add a clearly named V2 workflow.

Preferred checks:

```text
constraint core tests
schema shape tests
case decision conformance
package dry run
protocol contract tests
complete Hardhat suite
frontend tests
frontend build
browser case-workbench walkthrough
artifact upload
```

Do not require external PVWatts/NASA APIs in CI.

Use committed deterministic case contexts.

## Required CI failure conditions

```text
DecisionResult schema invalid
mixed quantity units
case pack identity collision
policy hash mismatch
expected decision ID changes unexpectedly
Market Capacity Study aggregate values change
wallet chunk eagerly preloaded on research entry
browser walkthrough cannot explain blocked/admitted case
```

---

# 23. Thesis review gate

Do not edit the thesis during Phases 1–12.

After V2 is green:

1. identify the user-approved canonical DOCX;
2. read the complete current thesis;
3. compare actual V2 implementation against Chapter 5 claims;
4. add only features that actually exist and are validated;
5. make targeted edits:

```text
Chapter 4 bridge
Chapter 5 short case-based evaluation subsection
Appendix B technical artifacts
Chapter 6 contribution/future-research wording
```

6. preserve title and research question unless user/advisor explicitly reopens them;
7. do not add market-capacity study as energy-thesis evidence;
8. do not turn controlled modeled cases into an empirical geography claim.

The thesis document itself remains outside this PR/V2 frontend handoff until that gate.

---

# 24. Optional Risk Lens — after V2 stop gate

Only after the initial V2 scope is complete and reviewed.

Potential reuse:

```text
energy-index pricing engine
irradiance volatility
Black-Scholes
CRR
Monte Carlo
Greeks
VaR margin
collar / hedge effectiveness
```

Possible calculators:

```text
VOLATILITY_CAPACITY
MARGIN_CAPACITY
```

Requirements:

- explicit versioned calculator;
- explicit model assumptions;
- common claim-unit output before entering binding minimum;
- basis-risk warning where location/index mismatch exists;
- no implication that option pricing proves energy evidence.

Do not make derivatives a required workbench stage.

---

# 25. Optional Research Assistant — after deterministic stability

The assistant can be built only after case → decision → receipt is stable.

## Tool-bound assistant actions

Conceptual:

```text
get_case(case_id)
get_decision(decision_id)
run_case(case_id, policy_ref, scenario_ref)
compare_decisions(decision_ids)
get_constraint_evaluation(evaluation_id)
get_lineage(decision_id)
propose_policy_fork(policy_ref, diff)
build_research_memo(decision_ids)
```

## Assistant response rule

Any numerical explanation must be backed by deterministic tool results.

Example:

> Taoyuan is bounded by `VOLATILITY_CAPACITY` at the value recorded in decision `91fa…`; Phoenix is bounded by `EVIDENCE_BACKED_CAPACITY` in decision `5bc2…`. Both used the same policy manifest hash.

## Policy changes

Assistant only proposes a fork.

UI must show:

```text
PROPOSED POLICY DIFF
```

The user explicitly runs the temporary fork.

The assistant cannot mutate a published policy silently.

---

# 26. Rollback strategy

## V2 code rollback

V2 should live on a separate branch/PR.

If V2 is defective:

- do not modify V1 contracts;
- do not change Sepolia state;
- revert V2 commits or close the V2 PR;
- V1 static interface remains the public baseline.

## Schema rollback

Published schema identifiers must not be reused for incompatible shapes.

If a schema design is wrong before release:

- change it before merge;
- update conformance vectors.

If already published:

- create a new schema version.

## Case pack rollback

Case pack values are research artifacts.

A material correction should:

- change context/evidence hash;
- change decision IDs;
- record the correction in the case-pack README/changelog.

Do not overwrite a material source correction while pretending decision identity is unchanged.

---

# 27. Completion gate

V2 initial scope is complete when:

```text
[ ] 3 canonical energy cases exist
[ ] 3 V2 policies exist
[ ] admission gates are typed
[ ] quantity ceilings are typed
[ ] settlement remains a separate stage
[ ] blocked decision explanation works
[ ] binding-ceiling attribution works
[ ] counterfactual fork works
[ ] case × policy comparison works
[ ] settlement stress replay works
[ ] decision receipt downloads
[ ] research capsule or capsule manifest exports
[ ] Studies preserves market-capacity results
[ ] Reference preserves SolarPunk and Sepolia proof
[ ] core tests green
[ ] schema tests green
[ ] frontend tests green
[ ] build green
[ ] browser walkthrough green
[ ] no wallet preload on research routes
```

Then stop adding product surface.

The next task must be justified by an external hook or integrity defect.

---

# 28. Local agent final handoff template

When the V2 agent finishes, leave a document with exactly this structure:

```text
CURRENT HEAD
<branch + SHA>

PR
<number + title + state>

WHAT CHANGED
<objects / engine / UI>

WHAT DID NOT CHANGE
<empirical artifacts / contracts / thesis / Sepolia>

CORE VALIDATION
<commands + results>

FRONTEND VALIDATION
<commands + results>

BROWSER REVIEW
<screenshots + defects found/fixed>

DECISION ID CONFORMANCE
<fixtures and expected IDs>

PUBLIC DATA BOUNDARY
<raw/private handling>

KNOWN LIMITATIONS
<real operator evidence / empirical geography / production>

NEXT ALLOWED WORK
<one bounded list>

STOP RULE
<explicit>
```

Do not end with vague `future improvements`.

---

# 29. Resume instruction

A future coding agent should say, before touching code:

```text
I have read MASTER_PLATFORM_HANDOFF.md, PLATFORM_BLUEPRINT.md,
V2_IMPLEMENTATION_HANDOFF.md, and CASE_WORKBENCH_PRODUCT_AND_THESIS_DIRECTION.md.

Current phase: <PHASE>
Current acceptance gate: <GATE>
Files I expect to modify: <FILES>
Files explicitly out of scope: <FILES / ARTIFACT TYPES>
```

Then execute the phase.

This is the intended protection against losing chat context and rebuilding the project from a hallucinated narrative.
