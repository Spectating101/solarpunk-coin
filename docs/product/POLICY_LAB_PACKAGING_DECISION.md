# Policy Lab — Packaging Decision

**Status:** P0.1 package semantics validated; external-recipient portability remains untested  
**Scope:** external packaging only; no runtime or research-claim change

---

## Decision question

Which external form gives the current frozen Policy Lab the highest chance of producing useful external value without forcing speculative product development?

The candidates considered are:

1. repository/workbench-first;
2. report-first;
3. benchmark-first;
4. SDK/API-first;
5. protocol/schema-first;
6. assisted-assessment-service-first;
7. portable assessment-package-first.

---

## Evaluation criteria

Each packaging route is judged against the current asset, not an imagined future company.

| Criterion | Question |
|---|---|
| **Comprehension** | Can an outsider understand the useful outcome quickly? |
| **Truth preservation** | Does packaging preserve assurance, policy, quantity, settlement, and non-claim boundaries? |
| **Portability** | Can the useful object travel outside the original UI/repo? |
| **Research reuse** | Can researchers reproduce/cite/extend it? |
| **Integration reuse** | Can software consume the same object? |
| **Commercial learning** | Can it reveal real willingness to use/pay? |
| **Implementation cost** | Can we test it without reopening core development? |
| **Lock-in risk** | Does choosing this form prematurely trap the project in one business model? |

---

## Candidate comparison

Scores are design heuristics from 1 (poor) to 5 (strong), not empirical market measurements.

| Package route | Comprehension | Truth preservation | Portability | Research reuse | Integration reuse | Commercial learning | Low implementation cost | Low lock-in risk | Overall role |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| **Repository/workbench-first** | 2 | 5 | 2 | 4 | 2 | 1 | 5 | 4 | keep as expert surface, not primary external package |
| **Report-first** | 5 | 3 | 4 | 2 | 1 | 3 | 4 | 3 | useful human output, weak canonical core |
| **Benchmark-first** | 3 | 5 | 4 | 5 | 3 | 1 | 4 | 5 | strongest academic package |
| **SDK/API-first** | 3 | 4 | 5 | 3 | 5 | 2 | 2 | 2 | premature before stable external object/workflow |
| **Protocol/schema-first** | 2 | 5 | 5 | 4 | 5 | 1 | 3 | 4 | useful foundation, poor first user experience |
| **Assisted service-first** | 5 | 4 | 3 | 2 | 1 | 5 | 4 | 5 | strongest first commercial-learning method |
| **Portable assessment-package-first** | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | best common foundation |

---

## Result

The best packaging architecture is **not** to choose one of research, product, API, or service and discard the others.

The strongest common base is:

> **Portable Claim Assessment Package first.**

Then expose that same package through different shells:

```text
Claim Assessment Package
        │
        ├──→ Human Assessment Report
        ├──→ Independent Viewer / Verifier
        ├──→ Research Benchmark
        ├──→ Assisted Assessment Service
        └──→ later CLI / SDK / API
```

This reduces duplication and prevents each audience from receiving a different semantic interpretation of the same case.

---

## P0 result — portable-object architecture

The first live package test against `PUB-AUSGRID-001P` established that the closed case artifacts can be converted into a deterministic machine-readable package and a human rendering without changing the Policy Lab core.

P0 established:

- package derivation from the existing case/evidence/policy/decision/settlement artifacts;
- human report rendered only from the package;
- package-to-closed-artifact verification;
- byte-identical package/report rebuild;
- closed-world decision reproduction preserved.

The P0 hostile audit then rejected the first external contract as too research-shaped and too easy to overread.

---

## P0.1 result — corrected external semantics

P0.1 implements only the audit corrections.

The current package is:

```text
policylab.claim_assessment_package.v0.1
        +
profile: policylab.energy_linked_claim.v0
```

The explicit domain profile prevents one Ausgrid/energy case from masquerading as a universal claim schema.

P0.1 now preserves:

```text
source evidence quantity
33.066 kWh derived surplus

policy-defined claim quantity
33.066 ENERGY_CLAIM_UNIT under LAB-CASE-OPEN-004

stricter policy consequence
ENERGY-CASE-PILOT-005 → BLOCKED
SIGNED_EVIDENCE + MIN_PROVENANCE
```

The human-facing consequence is no longer described as generic `SUPPORTED_WITH_LIMIT`. The package preserves the canonical `ADMIT_WITH_LIMIT` decision and translates it only as:

```text
ADMITTED_WITH_LIMIT_UNDER_POLICY
```

The policy name, description, and governance scope travel with the result, so the research-only status of `LAB-CASE-OPEN-004` remains visible.

### Structured rule meaning

Hand-written remediation is no longer the canonical source of policy meaning.

The package carries the existing structured constraint evaluations, including:

```text
evaluation_id
calculator_id
policy_rule_id
status
observed_inputs
parameters
explanation
boundary
```

The human report explains a block from those existing rule evaluations.

### Optional research extension

The R1–R4 `ConstrainedClaimAssessment` is now an optional package extension rather than a required part of the operational contract.

The current research distribution includes it and continues to reference the unchanged research assessment:

`088067800c192a0d6854cc4a70f068f3590d4fc658df3622370bfcc7974e56dc`

An operational package schema is not required to pretend that every consumer needs the academic boundary projection.

### Local time and unit semantics

P0.1 carries both:

- local case dates and timezone basis;
- canonical UTC instants.

It also explicitly separates:

```text
source unit: kWh
claim unit: ENERGY_CLAIM_UNIT
declared evidence-backed rate: 1
calculator: EVIDENCE_BACKED_CAPACITY
```

The package states that this mapping does not turn the claim unit into physical kWh, directly metered export, legal title, a certificate, or money.

---

## Identity model after P0.1

P0.1 separates two identities.

### Semantic assessment identity

`assessment_id` hashes only the operational assessment semantics:

```text
profile identity
claim/case identity
canonical period
evidence hash + assurance
policy IDs + versions
canonical decision IDs/results
supported quantity
binding/blocking calculators
rule evaluation IDs
settlement result if present
```

It deliberately excludes explanatory prose, policy descriptions, warning prose, non-claims, the research extension, and run-specific delivery verification.

### Package content identity

`package_content_id` identifies the complete package content except its own ID field.

This means a delivery capsule or explanation can change without pretending the underlying assessment changed.

That distinction was tested two ways:

1. the verifier perturbs delivery/prose-only fields and requires `assessment_id` to remain stable while `package_content_id` changes;
2. two separate P0.1 executions produced different delivery capsules/package-content IDs while retaining the same semantic assessment ID.

Observed semantic assessment ID across both executions:

`04a4f79431f2bf774ec2a3df69836461752998829ae76a89e946971c42d756a9`

This is the intended identity behavior.

---

## P0.1 validation gate

On exact functional head `6301ef1ba77afec91a239afd14abee8d8b05880b`, External Case workflow run `32058965834` completed successfully.

The workflow passed:

- existing bounded public-source case execution;
- existing four-boundary assessment build and verification;
- P0.1 package build;
- P0.1 package-to-artifact verification;
- semantic/content identity-scope probe;
- byte-identical package/report rebuild;
- source mirror preservation;
- artifact upload.

This validates the P0.1 package mechanics and semantics against the current case.

It does **not** validate product-market fit, legal authority, certification, customer demand, neutral-standard status, or cross-domain generality.

---

## Recommended sequence from here

### P1 — human recipient test

Do **not** redesign the report in the abstract.

Give the existing P0.1 human rendering to someone who does not know the repository and test whether they can answer:

```text
what was assessed?
what happened under each policy?
why was one route blocked?
what quantity is physical evidence versus policy-defined claim quantity?
what is still not proven?
```

Only presentation failures observed here justify further report work.

### P2 — transferable verification bundle

The current verifier still assumes the closed repository artifact set.

The next engineering question is therefore not “build an API.” It is:

> What is the smallest bundle a second party actually needs to verify the package independently?

Candidate contents may include:

```text
claim assessment package
policy manifests
bounded evidence envelope/reference
required context manifests
verifier version/code identity
source bytes only where redistribution is appropriate
```

Do not decide the minimum by imagination. Determine it through a real second-party reproduction exercise.

### P3 — research kit

If a research recipient is the first real user, add the optional research projection, evidence/policy bundle, and reproduction instructions around the same P0.1 object.

### P4 — assisted external assessment

If an operator/institution is the first real user, process one bounded outside case manually and return the same package.

### P5 — choose product surface from observed use

Only after repeated use:

```text
if users want human case handling repeatedly → hosted workbench
if products want machine decisions → SDK/API
if institutions want governance/controls → enterprise deployment
if researchers dominate → benchmark/tooling emphasis
```

No surface wins by assumption.

---

## Why report-first alone is insufficient

A polished report is immediately understandable, but if the report itself becomes canonical:

- machine integration must reverse-engineer prose;
- research reproduction and commercial reporting can drift;
- identity/versioning becomes document-centric;
- independent verification is harder;
- every new UI needs its own translation layer.

Therefore the report should remain a **rendering** of the package.

---

## Why SDK/API-first remains premature

P0.1 stabilizes one real external object profile. It does not tell us which transport or service boundary outside users need.

Before external use, we still do not know:

- whether users provide raw evidence, normalized evidence, or references;
- whether one or multiple policies are normal;
- which extensions they need;
- what verification bundle they can realistically consume;
- whether human-assisted assessment is preferable to automation.

An API before those answers would freeze transport before workflow.

---

## Commercial conversion

The current asset should not be sold as “software for creating an energy-backed currency.”

The first commercially testable transaction remains narrower:

> An outside actor gives us a bounded evidence-backed claim and the relevant declared requirements. We return a reproducible package showing what happens under those requirements, what quantity is admitted if any, what blocks the stricter route, and what is still unproven.

If that transaction repeats, automation has a factual basis.

Potential later value capture can include assisted assessment, private evidence ingestion, policy implementation/maintenance, hosted execution, private connectors, organization workflows, support/deployment, or institutional research contracts.

None are validated revenue today.

---

## Open-core boundary

The existing repository is public/MIT. Commercial strategy must not rely on pretending public code is proprietary scarcity.

A plausible later separation remains:

**Open / inspectable:** deterministic semantics, public schemas, verifier, public benchmark cases, public policy examples, research reproduction kit.

**Potential paid layers, only after demand:** hosted execution, private evidence connectors, organization-specific policy implementation and maintenance, access/approval workflows, private deployment, support, institutional research engagements.

The defensible asset would be accumulated integration, policy, workflow, evidence-handling, and external-use knowledge—not merely hiding existing code.

---

## Stop rule

P0.1 has answered the internal packaging question far enough.

Do not proceed directly to SaaS, API, marketplace, certification, or a general-purpose claim platform.

The next evidence should come from a **recipient**, not another speculative architecture layer.

Proceed only when:

1. a recipient cannot understand the current report;
2. a recipient cannot verify the current package with the supplied bundle;
3. a real external case needs another field/profile;
4. repeated human assessment creates obvious automation work;
5. an integration partner explicitly asks for a machine interface.

Otherwise preserve the finished core and the now-validated P0.1 package semantics.
