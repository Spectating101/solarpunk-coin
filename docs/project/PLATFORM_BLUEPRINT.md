# Platform Blueprint — Case-Based Constraint Research Workbench

**Status:** V2 product and systems blueprint  
**Authority:** product-design specification; implementation is not complete until acceptance gates in `V2_IMPLEMENTATION_HANDOFF.md` pass  
**Public naming:** unresolved; `Policy Lab` is descriptive, not a permanent approved brand  
**Original project:** SolarPunk Public Lab / the Energy Standard project

---

# 1. Executive product definition

The platform is a **case-based research workbench for bounded financial decisions**.

Its core research action is:

> Take a declared case, attach evidence and contextual models, evaluate an explicit versioned policy, show which rule blocks admission or which comparable quantity ceiling binds, replay counterfactual and stress conditions, and export a reproducible decision receipt.

The system is valuable when a researcher can answer:

```text
WHAT EVIDENCE EXISTS?
        ↓
WHAT IS OBSERVED VS MODELED?
        ↓
WHAT POLICY WAS DECLARED?
        ↓
WHY WAS THE CASE BLOCKED OR ADMITTED?
        ↓
IF ADMITTED, WHAT QUANTITY CEILING BOUND THE MAXIMUM?
        ↓
WHAT CHANGES UNDER ANOTHER POLICY / CASE / STRESS?
        ↓
CAN THE DECISION BE INSPECTED AND REPRODUCED?
```

The system is **not** primarily:

- a token dashboard;
- a solar resource map;
- a geospatial data product;
- a generic business-rules engine;
- a notebook clone;
- a certificate registry;
- a grid-data dashboard;
- a production credit-decision platform;
- a legal settlement or redemption system.

The first serious domain remains **energy-linked digital finance** because the repository already contains the necessary evidence adapters, resource models, risk work, issuance logic, and settlement architecture.

---

# 2. Product thesis

The repository's strongest recurring intellectual pattern is:

> **A financial quantity should not exist merely because someone can compute or mint it. Explicit evidence, policy, risk, and settlement constraints must determine whether it may exist and how much may exist.**

The workbench turns that idea into a research method.

### Research method

```text
DECLARE CASE
      ↓
IDENTIFY EVIDENCE
      ↓
ATTACH CONTEXT
      ↓
DECLARE POLICY
      ↓
EVALUATE ADMISSION GATES
      ↓
EVALUATE APPLICABLE QUANTITY CEILINGS
      ↓
ATTRIBUTE BINDING CEILING
      ↓
CREATE BOUNDED DECISION
      ↓
OPTIONALLY CREATE / ISSUE CLAIM
      ↓
EVALUATE SETTLEMENT
      ↓
REPLAY COUNTERFACTUAL / STRESS
      ↓
EXPORT RECEIPT / CAPSULE
```

This method unifies the existing repository without pretending every domain is economically identical.

---

# 3. Target users

V2 is not designed for a mass consumer audience.

## 3.1 Primary user — quantitative or systems researcher

Needs to:

- inspect an evidence-backed case;
- understand declared rules;
- compare policies;
- identify binding limits;
- test counterfactuals;
- preserve lineage;
- produce a shareable research artifact.

Typical questions:

```text
Why was this case blocked?
Which rule actually bounded the quantity?
Does another policy change the decision?
Why does the same policy behave differently in another location?
What fails under stress?
Can I reproduce the decision from the declared objects?
```

## 3.2 Secondary user — reviewer / professor / evaluator

Needs to verify:

- the result is not hidden behind a dashboard;
- source identities are visible;
- modeled context is not mislabeled as observed evidence;
- policy identity and version are explicit;
- the binding rule is inspectable;
- failure remains visible;
- private/licensed data boundaries are respected.

## 3.3 Secondary user — external operator / evidence provider

Needs to understand:

- what files or source fields are needed;
- what assurance level the evidence currently supports;
- what is missing for a higher assurance state;
- what policy would do with the evidence;
- what the lab does **not** authorize.

## 3.4 Portfolio evaluator / recruiter

Needs a one-click demonstration that the maintainer can build:

- data adapters;
- deterministic analytical engines;
- versioned schemas;
- risk and policy systems;
- geospatially linked research interfaces;
- reproducibility and lineage tooling;
- AI-ready but deterministic systems boundaries.

The interface should demonstrate capability through interaction rather than through a long architecture essay.

---

# 4. Jobs to be done

The platform must support these concrete jobs.

## Job A — explain a blocked case

> Given a case and policy, show exactly which admission rule blocked evaluation and what declared condition would need to change.

Output:

```text
BLOCKED

blocking rule
MIN_PROVENANCE

required
L2

observed
L0

quantity evaluation
NOT EXECUTED
```

## Job B — explain a bounded quantity

> Given an admitted case, show every applicable quantity ceiling in a common unit and identify the binding ceiling.

Output:

```text
EVIDENCE BACKING        996.20
PROVENANCE POLICY       697.34
RESOURCE CONTEXT        586.56
VOLATILITY CAPACITY     431.12 ← BINDING
ABSOLUTE POLICY CAP   2,500.00

ADMITTED MAXIMUM
431.12 ENERGY_CLAIM_UNIT
```

## Job C — compare policies on the same case

> Hold evidence and context fixed. Change only policy. Show which decisions differ and why.

## Job D — compare cases under the same policy

> Hold policy fixed. Change case context. Show which rule binds and why.

## Job E — replay stress

> Apply a declared stress context without silently changing evidence or policy identity. Show decision or settlement transitions.

## Job F — inspect lineage

> Show which entities, transforms, calculators, policies, and results produced the decision.

## Job G — export a research artifact

> Produce a decision receipt and capsule that preserve identities, assumptions, rule results, and data boundaries.

---

# 5. Product principles

## 5.1 Answer first

Every analytical surface should state the current decision before exposing implementation machinery.

Bad:

```text
Policy Manifest
Evidence Adapter
Provenance Classifier
...
```

Good:

```text
BLOCKED
because policy requires L2 and the case is L0
```

Then expose the trace.

## 5.2 Failure visible

Do not hide:

- stress inadequacy;
- residual shortfall;
- rejected input rows;
- blocked rules;
- unsupported assumptions;
- missing evidence;
- conditional severity increases.

## 5.3 Typed semantics

Admission, quantity, and settlement are different stages.

Do not flatten them.

## 5.4 Evidence/context separation

Use explicit labels:

```text
OBSERVED EVIDENCE
MODELED CONTEXT
DECLARED POLICY
DERIVED RESULT
```

## 5.5 Identity is a product feature

Expose:

```text
case ID
decision ID
evidence hash
policy ID
policy version
policy manifest hash
context IDs
source revision
```

## 5.6 Counterfactuals are explicit forks

A counterfactual must show what changed and what did not.

Example:

```text
COUNTERFACTUAL FORK

CHANGED
provenance L0 → L2

UNCHANGED
evidence hash
resource context
policy version
settlement scenario
```

Do not mutate the original run.

## 5.7 Progressive inspection

Decision → constraints → evidence → lineage → full artifact.

Do not force every user to inspect every hash before understanding the result.

## 5.8 No protocol mythology

A schema-valid object is not true evidence.

A signature is not physical truth.

A decision receipt is not legal authority.

A contract is not reserve custody.

A modeled resource surface is not observed production.

---

# 6. Canonical domain model

The model is intentionally object-based so research state can be hashed, compared, exported, and inspected.

## 6.1 Case Manifest

Schema identifier proposal:

```text
solarpunk.constraint.case_manifest.v1
```

The internal namespace follows existing implementation identifiers. It does not imply a final public product name.

Conceptual JSON:

```json
{
  "schema": "solarpunk.constraint.case_manifest.v1",
  "case_id": "TYN-001",
  "subject": "Taoyuan modeled rooftop energy case",
  "case_type": "energy_site",
  "spatial_identity": {
    "site_id": "taoyuan_10kw",
    "latitude": 24.99,
    "longitude": 121.30,
    "spatial_reference": "WGS84"
  },
  "measurement_window": {
    "start": "2026-05-01T00:00:00Z",
    "end": "2026-05-07T23:59:59Z"
  },
  "evidence_refs": [
    "evidence:..."
  ],
  "context_refs": [
    "resource-context:tyn-pvwatts-v1"
  ],
  "default_policy_ref": {
    "id": "ENERGY-PILOT-002",
    "version": "1.0.0"
  },
  "boundaries": [
    "Modeled resource context is not observed generation evidence."
  ]
}
```

### Case rules

- `case_id` must be stable within a case pack.
- case identity is not the same as decision identity.
- a case may be evaluated many times.
- a case may attach multiple evidence/context objects.
- spatial identity is optional for non-spatial cases.
- measurement window must be explicit when time matters.

## 6.2 Evidence Envelope

Existing schema:

```text
solarpunk.constraint.evidence_envelope.v1
```

Keep the existing shape.

Important existing fields:

```text
adapter
source
intervals
summary
capabilities
diagnostics
evidence_hash
```

V2 should refer to evidence by hash rather than copying evidence into every decision artifact.

## 6.3 Context Manifest

Proposal:

```text
solarpunk.constraint.context_manifest.v1
```

Purpose:

> Describe modeled or externally supplied analytical context that informs a decision but is not itself the primary observed evidence supporting the claim.

Conceptual shape:

```json
{
  "schema": "solarpunk.constraint.context_manifest.v1",
  "context_id": "resource-context:tyn-pvwatts-v1",
  "context_type": "resource_model",
  "label": "Taoyuan PVWatts resource baseline",
  "source": {
    "provider": "PVWatts",
    "dataset": "NSRDB Himawari",
    "source_kind": "typical_meteorological_year"
  },
  "spatial_identity": {
    "latitude": 24.99,
    "longitude": 121.30
  },
  "temporal_semantics": {
    "kind": "TMY",
    "observed_case_window": false
  },
  "values": {
    "annual_ac_kwh": 11743
  },
  "context_hash": "...",
  "hash_algorithm": "SHA-256",
  "boundary": "Modeled resource context; not meter evidence and not mint authority."
}
```

Context types may later include:

```text
resource_model
market_context
risk_model
settlement_context
tariff_context
jurisdiction_context
```

Do not create a universal free-form `context` blob without type identity.

## 6.4 Provenance Decision

Existing schema:

```text
solarpunk.constraint.provenance_decision.v1
```

Current implementation includes:

```text
level
rank
label
stage
default_haircut_pct
default_cap_kwh_day
closed_pilot_candidate
paid_launch_hardware_candidate
cryptographically_verified
trusted_operator_context
reasons
missing_for_next_level
explicit_boundary
```

### Required V2 refactor

The assurance classifier should stop owning universal financial policy.

Preferred future shape:

```text
level
rank
label
stage
assurance_attributes
cryptographically_verified
trusted_operator_context
reasons
missing_for_next_level
explicit_boundary
```

Legacy `default_haircut_pct` and `default_cap_kwh_day` may remain temporarily for backward compatibility but should be marked deprecated and should not drive V2 `DecisionResult` directly.

Policy calculators own capacity mapping.

## 6.5 Policy Manifest

Existing schema:

```text
solarpunk.constraint.policy_manifest.v1
```

V1 policy manifest is deliberately simple:

```text
minimum provenance
admission booleans
issuance rate
haircut
absolute cap
settlement flags
governance identity
```

### V2 compatibility decision

Do not mutate `policy_manifest.v1` into an incompatible rule graph.

Two acceptable options:

### Option A — add V2 policy schema

```text
solarpunk.constraint.policy_manifest.v2
```

Recommended if typed calculators become first-class policy content.

Conceptual shape:

```json
{
  "schema": "solarpunk.constraint.policy_manifest.v2",
  "id": "ENERGY-PILOT-004",
  "version": "1.0.0",
  "name": "Energy Pilot Constraint Policy",
  "admission_rules": [
    { "calculator_id": "POSITIVE_SURPLUS", "parameters": {} },
    { "calculator_id": "ZERO_BLOCKERS", "parameters": {} },
    { "calculator_id": "SIGNED_EVIDENCE", "parameters": {} },
    { "calculator_id": "MIN_PROVENANCE", "parameters": { "minimum": "L2" } }
  ],
  "quantity_rules": [
    { "calculator_id": "EVIDENCE_BACKED_CAPACITY", "parameters": { "rate": 1 } },
    { "calculator_id": "PROVENANCE_POLICY_CAPACITY", "parameters": {
      "capacity_multiplier_by_level": {
        "L0": 0,
        "L1": 0.4,
        "L2": 0.7,
        "L3": 0.88,
        "L4": 0.95
      }
    }},
    { "calculator_id": "ABSOLUTE_POLICY_CAP", "parameters": { "maximum": 2500 } }
  ],
  "settlement": {
    "explicit_capacity_required": true,
    "legal_redemption_not_implied": true
  },
  "governance": {
    "authority": "named pilot policy authority",
    "mutable_by": "governed policy registry"
  }
}
```

### Option B — retain V1 policy manifest and attach a separate policy rule set

This reduces schema disruption but creates another identity object.

Recommended V2 direction: **Option A**, with V1 policies retained for V1 compatibility and explicit adapters from V1 policy decisions into the old Claim Lab during migration.

Do not silently change the semantics of existing policy IDs.

## 6.6 Constraint Evaluation

Proposal:

```text
solarpunk.constraint.constraint_evaluation.v1
```

Conceptual shape:

```json
{
  "schema": "solarpunk.constraint.constraint_evaluation.v1",
  "evaluation_id": "...",
  "calculator_id": "VOLATILITY_CAPACITY",
  "calculator_version": "1.0.0",
  "constraint_class": "QUANTITY_CEILING",
  "policy_rule_id": "energy.volatility.capacity.v1",
  "status": "PASS",
  "unit": "ENERGY_CLAIM_UNIT",
  "capacity": 431.12,
  "input_refs": [
    "context:risk:tyn-v1"
  ],
  "observed_inputs": {
    "irradiance_sigma": 1.89
  },
  "parameters": {
    "base": 0.1,
    "multiplier": 0.5
  },
  "assumptions": [],
  "warnings": [],
  "explanation": "The declared volatility rule limits the case to 431.12 units."
}
```

### `constraint_class`

Allowed:

```text
ADMISSION_GATE
QUANTITY_CEILING
SETTLEMENT_CONSTRAINT
```

### Admission status

```text
PASS
BLOCK
```

### Quantity status

```text
PASS
WARNING
NOT_APPLICABLE
```

A quantity ceiling with missing required context should not become zero automatically unless the policy explicitly defines fail-closed zero capacity.

Instead return an explicit blocked admission or a named `MISSING_REQUIRED_CONTEXT` gate.

### Settlement status

```text
PASS
BLOCK
WARNING
```

## 6.7 Decision Result

Proposal:

```text
solarpunk.constraint.decision_result.v1
```

Conceptual shape:

```json
{
  "schema": "solarpunk.constraint.decision_result.v1",
  "decision_id": "...",
  "case_id": "TYN-001",
  "policy_id": "ENERGY-PILOT-004",
  "policy_version": "1.0.0",
  "policy_manifest_hash": "...",
  "evidence_hashes": ["..."],
  "context_refs": ["resource-context:tyn-pvwatts-v1"],
  "admission": {
    "result": "PASS",
    "evaluations": ["..."],
    "blocking_rules": []
  },
  "capacity": {
    "evaluated": true,
    "unit": "ENERGY_CLAIM_UNIT",
    "evaluations": ["..."],
    "admitted_maximum": 431.12,
    "binding_constraints": ["VOLATILITY_CAPACITY"]
  },
  "decision": "ADMIT_WITH_LIMIT",
  "warnings": [],
  "boundary": "Research decision under declared inputs; not legal issuance authority."
}
```

### Decision ID

Hash a stable canonical body containing at least:

```text
case ID
evidence hashes
context identities + hashes
policy ID
policy version
policy manifest hash
calculator IDs + versions
calculator parameters
admission results
quantity results
```

Do not include UI state such as selected tab or panel expansion.

### Decision states

```text
BLOCKED
ADMIT_WITH_LIMIT
```

Do not add `APPROVED` because it implies authority the lab does not possess.

## 6.8 Claim Manifest

Existing schema:

```text
solarpunk.constraint.claim_manifest.v1
```

The current claim already binds:

```text
evidence hash
policy ID
policy version
policy manifest hash
provenance level
quantity
base units
unit
decision
state
history
```

### V2 migration

Add `decision_id` in a future `claim_manifest.v2` or as a backward-compatible optional field only if schema compatibility permits.

Preferred clean design:

```text
claim_manifest.v2
```

The claim should reference:

```text
decision_id
case_id
```

Then preserve current quantity/base-unit and lifecycle logic.

## 6.9 Settlement Result

Existing schema:

```text
solarpunk.constraint.settlement_result.v1
```

Keep settlement separate.

Current semantics are appropriate:

```text
outstanding claim
settlement capacity
covered quantity
shortfall quantity
SETTLED / PARTIAL / SHORTFALL
```

Future V2 should allow settlement capacity to reference an evidence or context object rather than existing only as an unbound numeric input.

Example:

```text
settlement_capacity_ref
```

But a numeric local simulation input remains allowed in lab mode if labeled `DECLARED INPUT`.

## 6.10 Decision Receipt

Proposal:

```text
solarpunk.constraint.decision_receipt.v1
```

Conceptual shape:

```json
{
  "schema": "solarpunk.constraint.decision_receipt.v1",
  "decision_id": "...",
  "case_id": "TYN-001",
  "evaluated_at": "2026-07-14T15:42:18Z",
  "policy": {
    "id": "ENERGY-PILOT-004",
    "version": "1.0.0",
    "manifest_hash": "..."
  },
  "evidence": [
    { "hash": "...", "raw_included": false }
  ],
  "contexts": [
    { "id": "resource-context:tyn-pvwatts-v1", "hash": "..." }
  ],
  "runtime": {
    "package": "@solarpunk/constraint-core",
    "source_revision": "..."
  },
  "evaluated_rules": ["..."],
  "blocking_rules": [],
  "binding_constraints": ["VOLATILITY_CAPACITY"],
  "result": "ADMIT_WITH_LIMIT",
  "data_boundary": "Browser-local evidence; raw evidence not included."
}
```

Receipt is a shareable audit/reproduction summary.

It is not a legal certificate.

---

# 7. Calculator registry architecture

The calculator registry is the deterministic engine of V2.

## 7.1 Calculator contract

Conceptual JavaScript interface:

```js
{
  id: 'MIN_PROVENANCE',
  version: '1.0.0',
  constraintClass: 'ADMISSION_GATE',
  evaluate({ caseManifest, evidence, provenance, contexts, policyRule }) {
    return constraintEvaluation;
  }
}
```

Each calculator must declare:

```text
id
version
constraint class
required inputs
output unit where relevant
deterministic evaluate function
boundary
```

## 7.2 Registry API

Conceptual API:

```js
registerCalculator(calculator)
calculatorById(id)
listCalculators()
evaluateRule(args)
evaluatePolicyDecision(args)
```

## 7.3 Initial admission calculators

### `POSITIVE_SURPLUS`

Input:

```text
evidence.summary.total_eligible_surplus_kwh
```

Output:

```text
PASS if > 0
BLOCK otherwise
```

### `ZERO_BLOCKERS`

Input:

```text
evidence.summary.blocker_count
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
policy minimum
```

### `EXTERNAL_CORROBORATION`

Input:

```text
evidence capability and/or provenance assurance attributes
```

## 7.4 Initial quantity calculators

### `EVIDENCE_BACKED_CAPACITY`

```text
capacity = total eligible surplus × declared rate
```

### `PROVENANCE_POLICY_CAPACITY`

Policy owns the mapping.

Example:

```text
L0 → 0%
L1 → 40%
L2 → 70%
L3 → 88%
L4 → 95%
```

Then:

```text
capacity = evidence-backed capacity × policy multiplier
```

### `RESOURCE_CONTEXT_CAPACITY`

This calculator must be designed carefully.

Initial use is a controlled modeled scenario.

It may compare declared modeled resource context against a bounded time/scale assumption.

It must not treat annual TMY output as observed surplus.

The exact initial formula must be documented in the case pack and must remain obviously `MODELED CONTEXT`.

### `ABSOLUTE_POLICY_CAP`

```text
capacity = declared absolute maximum
```

## 7.5 Later calculators

Do not implement in initial V2 engine:

```text
VOLATILITY_CAPACITY
LIQUIDITY_CAPACITY
MARGIN_CAPACITY
BASIS_RISK_CAPACITY
```

Add only after the initial typed registry works.

Each later calculator must define common-unit conversion.

A volatility ratio cannot be directly compared with kWh unless the policy explicitly converts the risk result into the claim unit.

---

# 8. Decision engine algorithm

Conceptual pseudocode:

```js
async function evaluateCase({
  caseManifest,
  evidenceByHash,
  provenanceByEvidence,
  contextsById,
  policy,
  registry,
}) {
  const admissionEvaluations = [];

  for (const rule of policy.admission_rules) {
    const evaluation = registry.evaluateRule({
      rule,
      caseManifest,
      evidenceByHash,
      provenanceByEvidence,
      contextsById,
      policy,
    });
    admissionEvaluations.push(evaluation);
  }

  const blockingRules = admissionEvaluations
    .filter((item) => item.status === 'BLOCK')
    .map((item) => item.calculator_id);

  if (blockingRules.length > 0) {
    return buildDecisionResult({
      decision: 'BLOCKED',
      admissionEvaluations,
      blockingRules,
      capacityEvaluated: false,
    });
  }

  const capacityEvaluations = policy.quantity_rules.map((rule) =>
    registry.evaluateRule({
      rule,
      caseManifest,
      evidenceByHash,
      provenanceByEvidence,
      contextsById,
      policy,
    })
  );

  assertComparableUnits(capacityEvaluations);

  const applicable = capacityEvaluations.filter(
    (item) => item.status !== 'NOT_APPLICABLE'
  );

  const admittedMaximum = Math.min(...applicable.map((item) => item.capacity));
  const bindingConstraints = applicable
    .filter((item) => item.capacity === admittedMaximum)
    .map((item) => item.calculator_id);

  return buildDecisionResult({
    decision: 'ADMIT_WITH_LIMIT',
    admissionEvaluations,
    capacityEvaluations,
    admittedMaximum,
    bindingConstraints,
  });
}
```

### Fail-closed rules

Fail closed for:

- invalid schema;
- invalid policy identity;
- policy hash mismatch;
- missing required evidence identity;
- missing required admission context;
- incompatible quantity units;
- non-finite or negative capacity;
- duplicate calculator IDs with conflicting versions;
- decision identity construction failure.

Do not silently coerce an incompatible unit.

---

# 9. Case pack architecture

A case pack is a reproducible set of case and context objects.

Proposal:

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

### Case pack manifest

```json
{
  "schema": "solarpunk.constraint.case_pack.v1",
  "case_pack_id": "energy-reference-cases-v1",
  "case_ids": ["TYN-001", "AUS-001", "PHX-001"],
  "domain": "energy_linked_finance",
  "purpose": "Controlled mechanism and decision-structure demonstration",
  "empirical_claim": false,
  "boundary": "Modeled resource contexts are not realized operator outcomes."
}
```

### Scenario model

A provenance counterfactual must not falsify the evidence object.

Preferred design:

```text
same evidence hash
+
declared provenance context scenario
```

UI label:

```text
COUNTERFACTUAL ASSURANCE SCENARIO
```

Not:

```text
UPGRADED EVIDENCE
```

unless actual new evidence is provided.

This distinction is essential.

---

# 10. Platform information architecture

## 10.1 Primary navigation

```text
CASES
COMPARE
STUDIES
RECEIPTS
REFERENCE
```

Secondary GitHub/repository link may remain outside the primary task navigation.

## 10.2 Proposed hash routes

Current app uses custom hash routing.

Do not add React Router merely for V2 unless routing complexity proves the current mechanism inadequate.

Implement a small route parser.

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

### Compatibility aliases

During migration:

```text
#runs       → #study/market-capacity-v1 or Studies entry
#study      → #study/market-capacity-v1
#reproduce  → #receipts / study reproduction
#protocol   → #cases or a legacy Claim Lab route
#overview   → #reference/solarpunk
#sepolia    → #reference/sepolia
#research   → #studies or reference methods
```

Do not break old shared links without an alias or redirect behavior.

## 10.3 Route parser

Conceptual:

```js
function parseHashRoute(hash) {
  const parts = hash.replace(/^#/, '').split('/').filter(Boolean);
  const [section = 'cases', id = null] = parts;

  if (section === 'case' && id) return { section: 'case', id };
  if (section === 'study' && id) return { section: 'study', id };
  if (section === 'receipt' && id) return { section: 'receipt', id };
  if (section === 'reference') return { section: 'reference', id };

  return normalizeStaticRoute(section);
}
```

---

# 11. Case Explorer screen

The default V2 screen.

```text
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ CASE EXPLORER                                                      + IMPORT EVIDENCE │
├─────────────────────────────┬──────────────────────────────────────┬─────────────────┤
│ INVESTIGATION               │ MAP / CASE SURFACE                   │ ACTIVE CASE     │
│                             │                                      │                 │
│ All                  12     │          Austin ●                    │ TYN-001         │
│ Blocked               7     │                                      │ Taoyuan         │
│ Admitted              3     │                    Phoenix ●          │                 │
│ Shortfall             2     │                                      │ L0 scenario     │
│                             │            ● Taoyuan                 │ BLOCKED         │
│ DOMAIN                      │                                      │                 │
│ ● Energy                    │                                      │ blocking rule   │
│ ○ Market capacity           │                                      │ provenance      │
│                             │                                      │                 │
│ MAP LAYER                   │                                      │ OPEN CASE →     │
│ Binding rule          ▼     │                                      │                 │
└─────────────────────────────┴──────────────────────────────────────┴─────────────────┘
```

## 11.1 Left filter panel

Filters:

```text
status
case domain
policy
provenance level
blocking rule
binding ceiling
stress result
```

Do not expose filters that the current case pack cannot populate.

## 11.2 Map/case surface

The initial map may use the existing coordinates and simple plotting model.

A real map library is justified only when:

- zoom/pan materially improves case navigation;
- polygon/grid layers are added;
- spatial joins require H3 or equivalent indexing;
- case count exceeds the simple point surface.

Do not add H3 or deck.gl merely for architectural prestige.

## 11.3 Active case preview

Show:

```text
case ID
subject
location where relevant
assurance state
current policy
decision
blocking/binding rule
admitted maximum if applicable
latest stress state
```

One primary action:

```text
OPEN CASE
```

---

# 12. Case Workspace screen

The main product surface.

```text
┌──────────────────────┬─────────────────────────────────────────────┬───────────────────────┐
│ CASE                 │ DECISION WORKSPACE                          │ DECISION DOSSIER      │
│                      │                                             │                       │
│ TYN-001              │ WHY IS THIS CASE BLOCKED?                   │ DECISION ID           │
│ Taoyuan              │                                             │ 9f1b2…                 │
│ 24.99, 121.30        │ Evidence describes 103.8 kWh eligible       │                       │
│                      │ surplus. Policy requires L2. Current         │ POLICY                │
│ MAY 01 → MAY 07      │ assurance scenario is L0.                   │ ENERGY-PILOT-004      │
│                      │                                             │ v1.0.0                │
│ EVIDENCE             │ ADMISSION GATES                             │                       │
│ 7 intervals          │ ✓ positive surplus                         │ POLICY HASH           │
│ 103.8 kWh            │ ✓ zero blockers                            │ a182f…                 │
│                      │ ✓ normalized evidence                       │                       │
│ ASSURANCE            │ ✕ minimum provenance        ← BLOCKING     │ EVIDENCE HASH         │
│ L0 scenario          │                                             │ 792c3…                 │
│                      │ QUANTITY EVALUATION                         │                       │
│ POLICY               │ Not executed. Admission failed.             │ CONTEXT               │
│ ENERGY-PILOT-004     │                                             │ PVWatts TMY           │
│                      │ COUNTERFACTUAL                              │ MODELED               │
│ Evidence             │                                             │                       │
│ Constraints ●        │ L0 → L2 assurance scenario                 │ DATA BOUNDARY         │
│ Compare              │                                             │ browser-local         │
│ Stress               │ PREVIEW FORK →                              │ raw excluded          │
│ Lineage              │                                             │                       │
└──────────────────────┴─────────────────────────────────────────────┴───────────────────────┘
```

## 12.1 Persistent identity strip

Every workspace view should preserve:

```text
CASE TYN-001
POLICY ENERGY-PILOT-004@1.0.0
DECISION 9f1b…
LOCAL MODE / PUBLIC STUDY MODE / REPRO MODE
```

This prevents the user from forgetting which run they are looking at.

## 12.2 Case pane

Contains stable case identity and navigation lenses.

Lenses:

```text
Evidence
Constraints
Compare
Stress
Lineage
```

## 12.3 Decision workspace

The central pane changes by lens.

## 12.4 Decision dossier

Persistent right pane.

Show:

```text
decision ID
policy identity
policy hash
evidence hashes
context identities
temporal semantics
runtime/source revision
data boundary
```

The dossier should be compact and scannable.

---

# 13. Evidence lens

Purpose:

> Show what the case actually contains and what the normalization pipeline accepted or rejected.

Sections:

```text
SOURCE IDENTITY
NORMALIZATION SUMMARY
INTERVAL TABLE
DIAGNOSTICS
CAPABILITIES
ASSURANCE CLASSIFICATION
```

### Source identity

```text
adapter
adapter version
source label
source type
measurement window
site ID
```

### Summary

```text
interval count
accepted rows
rejected rows
total eligible surplus
blockers
warnings
```

### Interval table

Columns where present:

```text
window
generation
load
export
curtailment
eligible surplus
surplus basis
quality
source
```

### Diagnostics

Group by:

```text
BLOCK
WARNING
PASS
```

Do not show 1,000 PASS rows before a blocker.

### Assurance

Show L0-L4 as descriptive assurance.

Do not show a universal haircut as though provenance itself determines economics.

---

# 14. Constraints lens

This is the killer product surface.

## 14.1 Blocked case

```text
WHY IS THIS CASE BLOCKED?

ADMISSION GATES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASS   POSITIVE_SURPLUS
PASS   ZERO_BLOCKERS
PASS   NORMALIZED_EVIDENCE
BLOCK  MIN_PROVENANCE              ←

REQUIRED
L2

OBSERVED / DECLARED SCENARIO
L0

QUANTITY EVALUATION
NOT EXECUTED

COUNTERFACTUAL
L0 → L2

[ PREVIEW FORK ]
```

## 14.2 Admitted case

```text
WHY IS THIS CASE LIMITED TO 431.12?

ADMISSION
PASS

QUANTITY CEILINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENCE BACKING        996.20
PROVENANCE POLICY       697.34
RESOURCE CONTEXT        586.56
VOLATILITY CAPACITY     431.12   ← BINDING
ABSOLUTE POLICY CAP   2,500.00

ADMITTED MAXIMUM
431.12 ENERGY_CLAIM_UNIT

[ COMPARE POLICY ] [ STRESS ] [ EXPORT RECEIPT ]
```

### Ceiling card interaction

Click a ceiling to inspect:

```text
calculator ID
calculator version
policy rule ID
inputs
input refs
parameters
formula / explanation
assumptions
warnings
unit
capacity
```

Do not bury formulas behind a tooltip only.

---

# 15. Compare workspace

Comparison is first-class.

## 15.1 Case × policy matrix

```text
                  OPEN           PILOT          STRICT
TYN-001           ADMIT          BLOCK          BLOCK
AUS-001           ADMIT          ADMIT          BLOCK
PHX-001           ADMIT          ADMIT          BLOCK
```

Each cell shows:

```text
decision
blocking rule or binding ceiling
admitted maximum
```

Click a cell to open the decision.

## 15.2 Binding-rule matrix

```text
                  OPEN           PILOT          STRICT
TYN-001           EVIDENCE       VOLATILITY     PROVENANCE
AUS-001           EVIDENCE       RESOURCE       PROVENANCE
PHX-001           EVIDENCE       EVIDENCE       PROVENANCE
```

Only show a binding ceiling for admitted decisions.

Blocked decisions show blocking rule.

## 15.3 Capacity comparison

Table before chart.

```text
CASE       POLICY       ADMITTED MAX       BINDING
TYN-001    PILOT        431.12             VOLATILITY
AUS-001    PILOT        486.20             RESOURCE
PHX-001    PILOT        510.20             EVIDENCE
```

## 15.4 Policy difference summary

```text
27 decisions evaluated

8 unchanged
7 admitted at lower capacity
6 BLOCK → ADMIT
4 ADMIT → BLOCK
2 binding-rule changes without decision-state change
```

Only calculate categories that are logically supported.

## 15.5 Capacity/failure frontier

Use only where realized outcome data exists.

The market-capacity empirical study qualifies.

The initial three-location modeled energy case pack does not.

Do not show `coverage` for the energy case pack without a defined realized outcome sample.

---

# 16. Stress workspace

Stress is a declared transformation of context or settlement capacity.

## 16.1 Stress Scenario object

Proposal:

```text
solarpunk.constraint.stress_scenario.v1
```

Conceptual:

```json
{
  "schema": "solarpunk.constraint.stress_scenario.v1",
  "scenario_id": "ENERGY-SETTLEMENT-LOW-001",
  "name": "Low settlement capacity",
  "changes": [
    {
      "target": "settlement_capacity",
      "operation": "multiply",
      "value": 0.4
    }
  ],
  "unchanged": [
    "evidence_hashes",
    "policy_id",
    "policy_version"
  ],
  "boundary": "Declared scenario; not observed future condition."
}
```

## 16.2 Stress UI

```text
BASE DECISION
ADMIT 431.12

STRESS
SETTLEMENT CAPACITY × 0.40

UNCHANGED
evidence
policy
resource context

RESULT
PARTIAL

OUTSTANDING   431.12
CAPACITY      172.45
COVERED       172.45
SHORTFALL     258.67
```

### Transition table

```text
CASE       BASE       STRESS       TRANSITION
TYN-001    SETTLED    PARTIAL      SETTLED → PARTIAL
AUS-001    SETTLED    SETTLED      unchanged
PHX-001    PARTIAL    SHORTFALL    PARTIAL → SHORTFALL
```

---

# 17. Lineage workspace

Lineage should use simple research-provenance semantics.

The user should not need to know W3C PROV terminology, but the internal conceptual distinction should remain compatible with:

```text
Entity
Activity
Agent
```

## 17.1 Visual graph

```text
PVWATTS RESOURCE FILE
        ↓ used by
RESOURCE NORMALIZER
        ↓ generated
RESOURCE CONTEXT
        ├──────────────────┐
        ↓                  ↓
METER EVIDENCE       RISK CALCULATOR
        └────────┬─────────┘
                 ↓
          POLICY EVALUATION
                 ↓
           DECISION RESULT
                 ↓
            CLAIM MANIFEST
```

## 17.2 Node inspector

For every node:

```text
identity
type
schema
hash
source revision
created/generated time where relevant
inputs
outputs
boundary
```

For activities:

```text
calculator / adapter ID
version
parameters
```

Do not imply a blockchain is required for lineage.

---

# 18. Studies workspace

Existing empirical interface moves here.

## 18.1 Study list

Initial:

```text
Market Capacity Policy Study
status: published aggregate
period: 2018-01-02 → 2024-12-31
source boundary: licensed rows private
```

Later:

```text
Energy Evidence Assurance Case Study
status: controlled scenario demonstration
empirical claim: no
```

## 18.2 Study detail

Current Decision Brief remains the study entry surface.

Study views remain:

```text
Decision Brief
Policy comparison
Policy frontier
Stress replays
Methods
Reproduction
```

Do not force all studies into the case UI if a published aggregate study has a more appropriate study-level view.

The workbench and Studies surfaces share decision/receipt concepts but may use different visualizations.

---

# 19. Receipts workspace

Purpose:

> Make decisions shareable and reproducible without requiring screenshots.

## 19.1 Receipt list

Columns:

```text
decision ID
case ID
policy
result
blocking/binding rule
evaluated time
mode
```

Modes:

```text
PUBLIC_STUDY
LOCAL_CASE
REPRO_COMPUTE
```

## 19.2 Receipt detail

```text
DECISION RECEIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Decision ID
9f1b...

Case
TYN-001

Policy
ENERGY-PILOT-004@1.0.0
hash a182...

Evidence
EV-92A...
SHA-256 ...

Contexts
RC-TYN-001
MODELED TMY RESOURCE

Rules evaluated
POSITIVE_SURPLUS
ZERO_BLOCKERS
SIGNED_EVIDENCE
MIN_PROVENANCE
EVIDENCE_BACKED_CAPACITY
PROVENANCE_POLICY_CAPACITY
RESOURCE_CONTEXT_CAPACITY
ABSOLUTE_POLICY_CAP

Blocking rules
none

Binding ceilings
RESOURCE_CONTEXT_CAPACITY

Decision
ADMIT_WITH_LIMIT

[ DOWNLOAD JSON ]
[ DOWNLOAD MEMO ]
[ OPEN LINEAGE ]
[ EXPORT CAPSULE ]
```

---

# 20. Research capsule

The capsule packages identities and reproducibility metadata.

Target:

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

## 20.1 Capsule manifest

Proposal:

```json
{
  "schema": "solarpunk.constraint.research_capsule.v1",
  "capsule_id": "...",
  "case_id": "TYN-001",
  "decision_id": "...",
  "files": [
    {
      "path": "decision-result.json",
      "sha256": "..."
    }
  ],
  "raw_evidence_included": false,
  "data_boundary": "Evidence rows processed locally and excluded from capsule."
}
```

## 20.2 Reproduction metadata

```text
runtime
package version
source revision
policy identity
calculator versions
input object hashes
expected decision ID
expected result
```

Reproduction verifies deterministic evaluation of declared objects.

It does not prove source truth.

---

# 21. Local evidence and persistence

## 21.1 Initial V2 persistence model

Do not add a cloud backend.

Initial state architecture:

```text
bundled case packs     static JSON
active case state      React memory
local raw evidence     browser memory
case summary           optional sessionStorage
receipts               browser memory + explicit download
```

Do not persist raw local evidence into `localStorage` by default.

## 21.2 Why not IndexedDB initially

IndexedDB is appropriate later for durable local workspaces, but it introduces:

- migration state;
- persistence UX;
- deletion semantics;
- storage quota handling;
- private-evidence retention expectations.

Initial V2 should prove the case → decision → receipt workflow first.

## 21.3 Future local workspace

A future local-only workspace may use IndexedDB after explicit design of:

```text
workspace encryption boundary
raw evidence retention
clear/delete behavior
schema migration
capsule import/export
```

Not initial scope.

---

# 22. Frontend architecture

Current frontend:

```text
React 18
Vite
Recharts
Lucide
ethers lazy-loaded for Sepolia
Vitest
Testing Library
```

No state-management library is required for initial V2.

## 22.1 Proposed component tree

```text
App
├── AppShell
│   ├── BrandBlock
│   ├── PrimaryNav
│   └── GlobalActions
│
├── CaseWorkbenchProvider
│
├── CasesRoute
│   └── CaseExplorer
│       ├── CaseFilters
│       ├── CaseMapSurface
│       └── ActiveCasePreview
│
├── CaseRoute
│   └── CaseWorkspace
│       ├── CaseIdentityPane
│       ├── CaseLensNav
│       ├── DecisionWorkspace
│       │   ├── EvidenceLens
│       │   ├── ConstraintsLens
│       │   ├── CaseCompareLens
│       │   ├── StressLens
│       │   └── LineageLens
│       └── DecisionDossier
│
├── CompareRoute
│   └── CompareWorkspace
│       ├── CompareCasePicker
│       ├── ComparePolicyPicker
│       ├── DecisionMatrix
│       ├── BindingMatrix
│       ├── CapacityTable
│       └── StressTransitionTable
│
├── StudiesRoute
│   ├── StudyIndex
│   └── MarketCapacityStudyAdapter
│       ├── DecisionBrief
│       └── EmpiricalRunsLab
│
├── ReceiptsRoute
│   ├── ReceiptIndex
│   └── ReceiptDetail
│       ├── DecisionReceiptView
│       ├── LineageGraph
│       └── CapsuleExport
│
└── ReferenceRoute
    ├── SolarPunkReference
    ├── SepoliaReference
    └── DerivativesReference
```

## 22.2 Proposed frontend directories

```text
frontend/src/
│
├── app/
│   ├── routes.js
│   ├── AppShell.jsx
│   └── CaseWorkbenchProvider.jsx
│
├── cases/
│   ├── CaseExplorer.jsx
│   ├── CaseWorkspace.jsx
│   ├── CaseIdentityPane.jsx
│   ├── DecisionDossier.jsx
│   └── lenses/
│       ├── EvidenceLens.jsx
│       ├── ConstraintsLens.jsx
│       ├── CompareLens.jsx
│       ├── StressLens.jsx
│       └── LineageLens.jsx
│
├── compare/
│   ├── CompareWorkspace.jsx
│   ├── DecisionMatrix.jsx
│   ├── BindingMatrix.jsx
│   └── CapacityTable.jsx
│
├── receipts/
│   ├── ReceiptIndex.jsx
│   ├── ReceiptDetail.jsx
│   └── CapsuleExport.jsx
│
├── studies/
│   ├── StudyIndex.jsx
│   └── MarketCapacityStudy.jsx
│
├── reference/
│   ├── SolarPunkReference.jsx
│   ├── SepoliaReference.jsx
│   └── DerivativesReference.jsx
│
├── lib/
│   ├── casePack.js
│   ├── decisionRuntime.js
│   ├── receipt.js
│   ├── capsule.js
│   └── lineage.js
│
└── styles/
    ├── shell.css
    ├── caseWorkbench.css
    ├── compare.css
    ├── receipts.css
    └── semantics.css
```

Do not reorganize the entire frontend in the first commit.

Migrate incrementally.

## 22.3 State model

Use `useReducer` + Context for initial V2.

Conceptual state:

```js
{
  casePack,
  casesById,
  evidenceByHash,
  contextsById,
  policiesById,
  activeCaseId,
  activePolicyRef,
  provenanceScenario,
  stressScenarioId,
  decisionsById,
  activeDecisionId,
  pinnedCaseIds,
  receiptsById,
}
```

Actions:

```text
LOAD_CASE_PACK
SELECT_CASE
SELECT_POLICY
SET_PROVENANCE_SCENARIO
RUN_DECISION
PIN_CASE
UNPIN_CASE
APPLY_STRESS
STORE_RECEIPT
CLEAR_LOCAL_CASE
```

Derived comparison data should use selectors/memoized functions rather than duplicated state.

---

# 23. Core package architecture

Current package exports from:

```text
stable.js
csv.js
adapters.js
portableEvidence.js
attestation.js
provenance.js
policies.js
claim.js
```

Proposed additions:

```text
case.js
context.js
constraints.js
decision.js
receipt.js
capsule.js
```

Possible final structure:

```text
packages/constraint-core/src/
│
├── stable.js
├── csv.js
├── adapters.js
├── portableEvidence.js
├── attestation.js
├── provenance.js
├── policies.js
├── case.js
├── context.js
├── constraints.js
├── decision.js
├── claim.js
├── receipt.js
├── capsule.js
└── index.js
```

## 23.1 `case.js`

Exports:

```text
caseManifestBody
hashCaseManifest
validateCaseManifest
```

## 23.2 `context.js`

Exports:

```text
contextManifestBody
hashContextManifest
contextById helper where appropriate
```

## 23.3 `constraints.js`

Exports:

```text
CONSTRAINT_CLASSES
registerCalculator
calculatorById
listCalculators
evaluateConstraintRule
BUILTIN_CALCULATORS
```

Do not use process-global mutable registry state if deterministic test isolation becomes difficult.

Preferred pattern:

```js
createCalculatorRegistry(calculators = BUILTIN_CALCULATORS)
```

Then evaluation receives the registry explicitly.

## 23.4 `decision.js`

Exports:

```text
evaluateCaseDecision
buildDecisionResult
hashDecisionResultBody
assertComparableCapacityUnits
```

## 23.5 `receipt.js`

Exports:

```text
buildDecisionReceipt
receiptSummary
```

## 23.6 `capsule.js`

Core should generate capsule metadata and file manifests.

Browser ZIP assembly may stay in frontend code to avoid adding binary archive dependencies to the core package unless Node/browser parity is required.

---

# 24. JSON schemas

Current schemas live under:

```text
protocol/schema/
```

Current published objects:

```text
evidence-envelope.v1.schema.json
provenance-decision.v1.schema.json
policy-manifest.v1.schema.json
claim-manifest.v1.schema.json
settlement-result.v1.schema.json
```

Proposed new schemas:

```text
case-manifest.v1.schema.json
context-manifest.v1.schema.json
constraint-evaluation.v1.schema.json
decision-result.v1.schema.json
decision-receipt.v1.schema.json
case-pack.v1.schema.json
stress-scenario.v1.schema.json
research-capsule.v1.schema.json
```

Potential later incompatible schemas:

```text
policy-manifest.v2.schema.json
claim-manifest.v2.schema.json
```

Compatibility rule remains:

> incompatible object shape → new schema identifier and new schema file.

Policy content change → semantic policy version and manifest hash.

---

# 25. Existing V1 migration

## 25.1 Decision Brief

Move under Studies.

Do not rewrite metrics.

Keep current committed aggregate values.

## 25.2 Empirical Runs Lab

Move under Market Capacity Study.

Its binding attribution is a study-level result.

Do not force row-level market cases into the public case explorer unless a proper aggregate case representation is designed.

## 25.3 Reproduction Lab

Move under Receipts / study reproduction.

Keep byte-integrity semantics.

## 25.4 Claim Lab

Use as the migration source for:

```text
evidence intake
normalization
diagnostics
provenance
claim creation
settlement
```

The old `ConstraintProtocolLab` should not be deleted until V2 case workspace reaches feature parity for:

```text
all five evidence adapters
sample runs
local evidence processing
policy comparison
claim creation
settlement simulation
artifact download
```

## 25.5 SolarPunk reference

Move under Reference.

Keep original thesis continuity visible.

## 25.6 Sepolia proof

Keep lazy route loading.

Wallet and `ethers` must remain isolated from research routes.

---

# 26. Visual design system

The interface should look like a scientific/research instrument.

Not a crypto dashboard.

Not a generic SaaS admin panel.

## 26.1 Typography

Existing build already uses:

```text
DM Sans
Instrument Serif
JetBrains Mono
```

Use deliberately:

```text
DM Sans
navigation, labels, interpretation, controls

Instrument Serif
brief-level research question or decision statement only

JetBrains Mono
IDs, hashes, formulas, units, rule IDs, code-like mechanics
```

## 26.2 Semantic data categories

Use one consistent visual system.

Suggested semantic tokens:

```text
OBSERVED EVIDENCE   neutral
MODELED CONTEXT     informational
DECLARED POLICY     declared/rule accent
DERIVED RESULT      result accent
PASS                success
WARNING             warning
BLOCK               danger
```

Do not rely on color alone.

Every semantic state needs text/icon/label support.

## 26.3 Cards versus tables

Cards only for:

```text
current decision
blocking rule
binding ceiling
admitted maximum
shortfall result
```

Tables for comparisons and detailed values.

Avoid a sea of metric cards.

## 26.4 Status language

Preferred:

```text
BLOCKED
ADMIT WITH LIMIT
SETTLED
PARTIAL
SHORTFALL
PASS
WARNING
```

Avoid:

```text
APPROVED
SAFE
TRUSTED
BANKABLE
CERTIFIED
PRODUCTION READY
```

unless a real external authority supports the term.

---

# 27. Accessibility

Initial V2 acceptance requires:

- full keyboard navigation for primary workbench actions;
- visible focus state;
- semantic headings;
- `aria-current` for navigation;
- `aria-pressed` for toggles;
- accessible table headers;
- text labels for semantic color states;
- reduced-motion behavior;
- no information available only through hover;
- map points mirrored in an accessible case list;
- route changes announce page/workspace heading where practical.

The map cannot be the only way to select a case.

---

# 28. Performance

Keep the V1 lesson:

> Research visitors should not pay the wallet-stack cost.

Requirements:

- Sepolia reference remains lazy-loaded;
- `ethers` remains dynamic and isolated;
- heavy map library is not added until justified;
- case pack JSON is compact;
- large study outputs remain precomputed;
- local evidence is processed incrementally where practical;
- derived comparison matrices are memoized;
- no massive raw panel is bundled into the frontend.

Initial V2 should stay static-host compatible.

---

# 29. Security, privacy, and trust boundaries

## 29.1 Browser-local evidence

Default:

```text
raw local evidence stays in browser memory
```

Do not introduce analytics that capture raw file contents.

## 29.2 Hash semantics

A hash proves byte/content identity under the canonicalization rules.

It does not prove physical truth.

## 29.3 Signature semantics

A signature proves cryptographic consistency with a key/registry context.

It does not prove:

- meter calibration;
- device custody;
- legal ownership;
- environmental-attribute ownership;
- settlement enforceability.

## 29.4 Counterfactual semantics

A counterfactual is declared.

It must never overwrite observed evidence labels.

## 29.5 Public studies

Licensed rows remain private.

Public artifacts may expose:

```text
source identity
source hash
sample counts
methods
formulas
aggregates
```

## 29.6 Contracts

Existing Sepolia proof is reference evidence.

V2 workbench does not require a new contract deployment.

No private key or RPC secret is required for V2 static frontend development.

---

# 30. Testing strategy

## 30.1 Core unit tests

Add tests for:

```text
case hashing
context hashing
calculator registry identity
admission gate pass/block
quantity ceiling evaluation
unit mismatch failure
binding ceiling attribution
tie-set attribution
blocked decision skips capacity evaluation
decision ID determinism
receipt identity
counterfactual leaves original case unchanged
stress scenario leaves declared unchanged fields unchanged
```

## 30.2 Schema tests

Update schema-shape tests for every new public object.

Test:

```text
required fields
additionalProperties boundary
schema identifier
hash pattern
allowed enum values
non-negative capacity
unit requirements
```

## 30.3 Conformance vectors

Add deterministic vectors:

```text
blocked L0 / pilot policy
L2 admitted case
resource ceiling binding
absolute cap binding
tied ceilings
settlement partial
settlement shortfall
```

Each vector should have expected decision ID where stable canonical identity is intended.

## 30.4 Frontend tests

Case Explorer:

```text
loads case pack
selects case by list
selects case by map point
filters blocked/admitted
```

Case Workspace:

```text
shows blocking rule
skips quantity evaluation when blocked
previews counterfactual fork
shows all ceilings
attributes binding rule
opens rule details
```

Compare:

```text
same case / policy matrix values
policy difference counts
cell navigation
```

Stress:

```text
base object remains unchanged
stress result visible
transition classification
```

Receipts:

```text
receipt generated
JSON export
memo content
capsule manifest hashes
```

Legacy:

```text
Market Capacity Study values unchanged
Reproduction still exact
Sepolia lazy route still isolated
```

## 30.5 Browser walkthrough

Replace the 19-shot V1 workflow only after V2 screens are stable.

Initial V2 screenshots:

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

Screenshot count is not a success metric. Review coverage is.

---

# 31. Research validity rules

## 31.1 Controlled case demonstration

The initial Taoyuan/Austin/Phoenix case pack is:

```text
mechanism demonstration
policy-structure demonstration
interface validation
```

It is not:

```text
causal evidence
policy superiority evidence
geospatial performance evidence
production risk validation
```

## 31.2 Empirical performance claims

Require:

```text
declared population/sample
realized outcome definition
time-t information rule
common sample or justified sample differences
leakage control
stress selection rule
policy predeclaration or transparent fitting procedure
out-of-sample / rolling evaluation where appropriate
```

## 31.3 Spatial claims

Require:

```text
spatial sampling design
consistent time basis
TMY vs contemporaneous distinction
spatial dependence consideration
basis-risk sensitivity
location measurement unit
```

## 31.4 Coverage language

Use `coverage` only when a defined realized capacity/outcome comparison exists.

Do not call admission rate `coverage`.

---

# 32. Thesis integration boundary

The platform does not replace the Energy Standard thesis.

The thesis remains:

> Energy can serve as a credible constraint for digital finance only when reliable data, rule-bound issuance, explicit pricing and risk controls, protected settlement/redemption accounting, and limited governance operate together.

The platform relationship is:

> The workbench makes the five-constraint architecture executable and inspectable as a sequence of explicit research decisions.

### Allowed thesis improvement after V2 is real

```text
Chapter 4
risk output becomes explicit input to a later decision rule

Chapter 5
case-based constraint evaluation subsection

Appendix B
DecisionResult / receipt / lineage / reproduction

Chapter 6
technical contribution and future operator-case refinement
```

### Prohibited thesis pivot without formal reopening

```text
generic decision engine thesis
policy-as-code thesis
universal claim protocol thesis
geospatial policy superiority thesis
market-capacity study as proof of energy anchor
```

---

# 33. Success metrics

Initial V2 success is not traffic or revenue.

## Product comprehension

A reviewer can answer within five minutes:

```text
why a case was blocked
what would change admission
which ceiling bound an admitted case
why two cases differ
what changed under stress
where the receipt and lineage are
```

## Research integrity

```text
100% decisions expose policy identity
100% decisions expose evidence identity
100% modeled contexts are labeled modeled
blocked cases do not fabricate quantity ceilings
unit mismatch fails closed
stress scenarios disclose changed and unchanged fields
```

## Engineering

```text
core deterministic tests green
schema tests green
frontend tests green
production build green
browser walkthrough green
no wallet preload on research routes
```

## External validation gate

The most important future signal is one real L2 operator/gateway evidence case.

Without a real external case, do not overstate product-market validation.

---

# 34. Non-goals for V2

Do not build:

- authentication;
- billing;
- team workspaces;
- cloud raw-evidence storage;
- a general SQL notebook;
- a universal rules DSL;
- a full DMN engine;
- an OPA clone;
- a certificate registry;
- a global grid data product;
- a full SAM/REopt competitor;
- a GIS analysis suite;
- a new blockchain;
- mainnet deployment;
- automated live mint authority;
- an AI agent that modifies policy silently.

Do not add these merely because comparable mature products use them.

---

# 35. Product stop rule

V2 initial scope is complete when these are real and reviewed:

```text
3 canonical energy cases
3 policy comparisons
typed admission gates
typed quantity ceilings
separate settlement constraint
binding-ceiling attribution
case comparison
stress replay
decision receipt
research capsule
```

Then stop.

Next work requires an external hook:

```text
real operator evidence
external reviewer/user feedback
publication requirement
competition requirement
pilot requirement
integrity/security defect
prospectively designed new empirical study
explicitly approved deployment milestone
```

---

# 36. Final platform statement

> The platform is a research workbench for investigating bounded decisions. A case binds evidence and analytical context to an explicit versioned policy. Admission rules determine whether quantity evaluation may proceed. Applicable quantity ceilings are evaluated in a common claim unit and the lowest ceiling is attributed as binding. A bounded claim may then enter a separate settlement stage where capacity can settle, partially cover, or fail the obligation. Every decision retains evidence, context, policy, calculator, and runtime identity so the result can be compared, challenged, replayed, and exported as a reproducible research receipt. Energy-linked digital finance is the first serious domain because it exposes the full problem: modeled resource potential is not observed settlement evidence, evidence assurance can block admission, risk can bound quantity, and settlement can still fail after issuance.
