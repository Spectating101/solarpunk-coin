# Policy Lab — Packaging Decision

**Status:** design decision candidate  
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

## Recommended sequence

### Phase P0 — package semantics

**Build/design only:**

```text
Claim Definition
Evidence reference
Policy reference
Evaluation result
Settlement/fulfilment result where applicable
Verification
Next evidence required
Explicit non-claims
Optional research projection
```

Exit test:

> One package can represent `PUB-AUSGRID-001P` under the existing open and pilot policies without changing any underlying decision.

### Phase P1 — human report

Generate a concise assessment report entirely from the canonical package.

Exit test:

> A reader unfamiliar with the repo can answer what was assessed, what is supportable, why, and what is missing.

### Phase P2 — independent verification

Provide one verification/reproduction command or workflow.

Exit test:

> A second person can receive the package and validate identities / replay supported decisions without the authoring session.

### Phase P3 — research kit

Extract the package, policies, evidence references, expected results, schemas, and reproduction instructions into a benchmark/research bundle.

Exit test:

> An external researcher can reproduce a published case without navigating the historical repository.

### Phase P4 — assisted external assessment

Do not automate further. Try one real outside case when available.

Exit test:

> An outside party supplies evidence/rules or actively uses the returned assessment package.

### Phase P5 — choose product surface from observed demand

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

Therefore the report should be a **rendering** of the package.

---

## Why SDK/API-first is premature

The current core already has substantial deterministic machinery, but an API contract freezes external semantics early.

Before outside users exist, we do not know:

- which claim fields they naturally possess;
- whether they provide raw evidence, normalized evidence, or references;
- how they describe policy requirements;
- whether one assessment normally contains one policy or comparative policies;
- whether settlement belongs in the same transaction;
- what errors/remediation information they actually need.

The package experiment can answer these questions more cheaply than committing to service endpoints.

---

## Why protocol/schema-first alone is insufficient

A schema can create long-term interoperability, but a schema without a compelling completed artifact is difficult to evaluate.

Therefore:

> first make one real assessment package useful; then stabilize the schema around demonstrated use.

Do not attempt to declare a neutral standard now.

---

## Why assisted service is commercially useful but should not be canonical

Assisted assessment is the fastest route to learning whether an external actor values the outcome.

However, the service should produce the same portable package as every other surface. Otherwise value remains trapped in consulting labor.

Correct relationship:

```text
Assisted Service
      ↓ produces
Claim Assessment Package
      ↓ reusable by
customer / researcher / verifier / future API
```

---

## Research conversion

The research package should treat the assessment package as a reproducible experimental artifact.

The strongest research form is:

```text
paper / research question
        +
bounded external case
        +
evidence package
        +
versioned policy pack
        +
expected claim assessment package
        +
independent verifier
```

This makes the research contribution executable without turning the main product interface into a paper browser.

---

## Commercial conversion

The current asset should not be sold as “software for creating an energy-backed currency.”

The first commercially testable transaction is narrower:

> An outside actor gives us a bounded evidence-backed claim and the relevant declared requirements. We return a reproducible package showing what is supportable, what is blocked, and what would be needed next.

If that transaction repeats, automation has a factual basis.

Potential later value capture:

```text
assisted assessment fees
managed private evidence ingestion
policy implementation / maintenance
hosted execution
private connectors
organization workflows
support / deployment
institutional research contracts
```

Do not treat any of these as validated revenue today.

---

## Packaging doctrine

1. **Package the outcome, not the architecture.**
2. **One canonical machine object; many audience-specific renderings.**
3. **Research projection remains available but does not dominate ordinary use.**
4. **Evidence and policy identities must remain explicit.**
5. **Blocking is a successful assessment result, not an error state.**
6. **Next-evidence requirements are a first-class output.**
7. **Verification must travel with the package.**
8. **Domain vocabulary lives in Domain Packs, not in the generic core.**
9. **Do not claim multi-domain generality before a second real domain exists.**
10. **Choose hosted/API/enterprise product form from observed external behavior, not internal imagination.**

---

## Current verdict

**Recommended package architecture:**

```text
CANONICAL: Claim Assessment Package

FIRST HUMAN RENDERING: Assessment Report
FIRST RESEARCH RENDERING: Benchmark / reproduction kit
FIRST COMMERCIAL TEST: Assisted assessment
FIRST MACHINE INTERFACE: CLI / verifier
LATER ONLY IF DEMANDED: SDK / API / hosted workbench / institutional deployment
```

This architecture preserves the current Policy Lab stop rule: packaging should make the existing truth usable, not create pressure to enlarge the core.
