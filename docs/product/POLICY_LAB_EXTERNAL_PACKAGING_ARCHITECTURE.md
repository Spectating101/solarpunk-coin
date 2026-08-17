# Policy Lab External Packaging Architecture

**Status:** design authority after P0/P0.1 implementation experiments  
**Scope:** packaging and external-consumption architecture only

---

## Purpose

Policy Lab already has a deterministic research core. The packaging problem is different:

> How should a bounded claim assessment leave the repository so an external reader, researcher, operator, or later software integration can consume the same underlying result without reinterpretation?

The answer after P0/P0.1 is:

```text
DETERMINISTIC POLICY LAB CORE
        ↓
CLAIM ASSESSMENT PACKAGE
        ↓
EXPLICIT DOMAIN PROFILE
        ↓
POLICY EVALUATION(S)
        ↓
OPTIONAL EXTENSIONS
        ↓
RENDERINGS / SERVICES
```

For the first implemented profile:

```text
schema: policylab.claim_assessment_package.v0.1
profile: policylab.energy_linked_claim.v0
```

This is intentionally **not** declared as a universal claim standard.

---

## Core separation

The repository must preserve four layers that have different authority.

### Layer 1 — deterministic Policy Lab core

Existing evidence normalization, provenance classification, policy evaluation, quantity ceilings, settlement replay, receipts, capsules, and research-boundary projection.

This layer owns canonical decisions.

### Layer 2 — portable claim assessment package

A derived external object that carries the result without changing it.

The package must preserve:

- claim/case identity;
- evidence identity and assurance;
- domain-specific quantity semantics;
- policy identity/version/scope;
- canonical decision IDs/results;
- structured rule evaluations;
- admitted quantity if any;
- binding/blocking calculators;
- settlement result when included;
- explicit non-claims;
- verification identities.

### Layer 3 — optional extensions

Not every recipient needs every research/runtime artifact.

Extensions may include:

```text
research projection
closed-world delivery verification
future domain-specific attachments
```

The current R1–R4 `ConstrainedClaimAssessment` belongs here, not in the minimum operational contract.

### Layer 4 — renderings and services

Human report, research bundle, hosted workbench, assisted assessment, future CLI/SDK/API.

These are views or delivery mechanisms over the package. They must not become independent sources of policy meaning.

---

## Package-first rule

The human report is a rendering of the machine-readable package.

Correct direction:

```text
closed case artifacts
        ↓
canonical Policy Lab decisions
        ↓
claim assessment package
        ↓
report / verifier / research kit / future API
```

Incorrect direction:

```text
report prose
        ↓
reverse-engineered machine result
```

The package must remain the external semantic object.

---

## Domain-profile rule

P0 showed that a package built from one energy case naturally accumulates energy-shaped fields.

Therefore:

> A domain-specific package profile must identify which assumptions and quantity semantics are in force.

Current profile:

```text
policylab.energy_linked_claim.v0
```

It carries:

```text
source quantity unit: kWh
source quantity semantics: bounded derived surplus
claim unit: ENERGY_CLAIM_UNIT
evidence-backed rate: policy-declared
calculator: EVIDENCE_BACKED_CAPACITY
```

This prevents the implementation from silently pretending that `ENERGY_CLAIM_UNIT` is physical kWh or that an energy-shaped schema is neutral across domains.

Do not introduce a second domain profile until a genuinely different outside case requires it.

---

## Policy authority and human wording

A deterministic policy consequence is only a consequence **under that declared policy**.

The external package must therefore carry the policy's own:

- name;
- description;
- version;
- governance authority/mutability metadata;
- manifest hash;
- canonical decision ID.

Human-facing status must not erase this scope.

For example:

```text
canonical decision: ADMIT_WITH_LIMIT
external reading: ADMITTED_WITH_LIMIT_UNDER_POLICY
```

Do not translate a research-policy result into generic language such as `SUPPORTED_WITH_LIMIT`.

---

## Structured-rule rule

Policy meaning must come from the existing structured evaluations, not from a second prose ruleset invented by packaging.

The package should preserve rule objects containing fields such as:

```text
evaluation_id
calculator_id
calculator_version
constraint_class
policy_rule_id
status
observed_inputs
parameters
capacity
explanation
boundary
```

A human rendering may explain these fields, but cannot replace them.

For a block, the useful external question is:

```text
what did the policy require?
what was observed?
which rule blocked?
what boundary limits the meaning of that rule?
```

---

## Identity architecture

One identity is not enough because an assessment decision and its delivery package have different stability requirements.

### `assessment_id`

Semantic identity of the operational assessment.

It should remain stable when only:

- explanatory prose changes;
- policy descriptions are re-rendered without changing policy identity;
- warning wording changes;
- optional research projection changes presentation;
- delivery capsule/run identity changes.

It must change when the underlying claim/evidence/policy decision semantics change.

P0.1 computes it from the bounded claim/case, canonical time window, evidence hash/assurance, policy/decision identities, rule-evaluation identities, quantities, blockers/binders, and settlement result.

### `package_content_id`

Identity of the complete package content except the content-ID field itself.

It is allowed to change if delivery verification or explanatory package content changes.

P0.1 explicitly tests this split.

---

## Time semantics

External readers should not have to infer local dates from UTC instants.

The package should carry both:

```text
period.local
period.canonical_utc
```

The local representation is for interpretation.

The UTC representation remains the deterministic canonical time boundary used by the case artifacts.

---

## Evidence semantics

Do not collapse evidence quality into a binary “verified” label.

The package must preserve:

```text
evidence hash
assurance level
source-holder confirmation state
source identity
bounded quantity
quantity semantics
structured warning codes/details
```

For `PUB-AUSGRID-001P`, the package must continue to expose that:

- assurance is L0;
- source-holder confirmation is absent;
- exact mirror bytes are frozen but historical-source byte equivalence is not independently proven;
- derived surplus is not directly metered grid export.

Packaging cannot promote any of these facts.

---

## Settlement semantics

Settlement is optional.

When present, it must remain a separate result rather than being folded into admission.

A scenario replay does not establish:

- enforceable delivery;
- reserve custody;
- legal redemption;
- legal claim authority.

The human rendering must say so when settlement is scenario-only.

---

## Research extension

The research framework remains valuable but must not be forced onto every external consumer.

Correct relationship:

```text
operational assessment package
        ↓ optional extension
ConstrainedClaimAssessment
        ↓
R1 / R2 / R3 / R4 projection
```

This preserves research traceability while allowing a non-academic recipient to consume the package without first learning the whole framework.

The current research extension remains anchored to its own stable assessment identity.

---

## Verification architecture

There are two distinct verification stages.

### Internal closed-artifact verification — implemented in P0.1

The verifier checks:

- package schema/profile identity;
- semantic `assessment_id` reproduction;
- `package_content_id` reproduction;
- case/evidence agreement;
- local + UTC period agreement;
- source/archive identity;
- policy metadata/manifest-hash agreement;
- canonical decision agreement;
- structured rule-evaluation agreement;
- quantity/binding/blocking agreement;
- settlement agreement;
- optional research-extension agreement;
- optional delivery/capsule agreement;
- exact human-report reproduction.

It also perturbs prose/delivery-only fields to ensure semantic assessment identity remains stable while package-content identity changes.

### External transferable verification — not yet established

The current verifier still expects the closed repository case artifact set.

The next verification question is therefore:

> What minimum bundle can a second party receive and independently verify without the authoring repository state?

That is a P2 evidence problem, not justification for speculative API development.

---

## Human rendering architecture

The primary human layer should answer, in order:

```text
1. What question was assessed?
2. What happened under each named policy?
3. What quantity was admitted, if any?
4. What bound or blocked the result?
5. What evidence actually existed?
6. What are the source and unit limitations?
7. What settlement result exists, if any?
8. How can the assessment be verified?
```

Internal IDs, UTC instants, R1–R4 projection, delivery capsule IDs, and the full non-claim wall belong in a technical appendix.

The report must remain reproducible from the package.

---

## Research packaging route

A research distribution can wrap the same package with:

```text
research question / paper
claim assessment package
optional R1–R4 research projection
policy manifests
evidence references / distributable evidence
expected results
verifier
reproduction instructions
```

Do not create a separate research-only decision semantics.

---

## Commercial packaging route

The first commercially testable interaction remains narrow:

```text
external actor
   ↓
bounded claim + evidence + declared requirements
   ↓
Policy Lab / assisted operator
   ↓
Claim Assessment Package
   ↓
what happened under the declared policy?
what quantity is admitted?
what blocks the stricter route?
what remains unproven?
```

This can later be delivered through a service, hosted workbench, SDK, or API **only after the interaction repeats**.

Do not sell the current object as certification, legal approval, or “energy-backed money.”

---

## Future surface selection

Select the delivery surface from observed external use:

```text
repeated human assessment
→ assisted service / hosted workbench

machine-to-machine demand
→ CLI / SDK / API

institutional governance demand
→ organization/private deployment

researcher demand
→ benchmark/reproduction tooling
```

Do not pick the product surface before the workflow exists.

---

## Open-core strategy

The repository is public/MIT.

Open assets can include:

- deterministic core semantics;
- public package/profile schemas;
- verifier;
- public benchmark cases;
- example policies;
- research reproduction kit.

Potential later paid layers, only after external demand, can include:

- hosted execution;
- private evidence connectors;
- organization-specific policy implementation/maintenance;
- approval/access workflows;
- private deployment;
- support;
- institutional research engagements.

The defensible asset is accumulated policy, workflow, evidence-handling, integration, and external-use knowledge—not artificial secrecy around already-public code.

---

## Current stop rule

P0.1 has validated internal package semantics far enough.

Do not add:

- new policies;
- new evidence sources merely for packaging;
- generalized cross-domain abstractions;
- API endpoints;
- SaaS/account infrastructure;
- marketplace/plugin layers;
- certification language;
- AI features;
- new token/runtime behavior.

The next useful evidence must come from a recipient or a genuinely new outside case.

Continue only when a real recipient exposes a comprehension, verification, profile, or workflow requirement that the current package cannot satisfy.
