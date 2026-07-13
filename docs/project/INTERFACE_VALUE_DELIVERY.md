# Interface and Value Delivery

**Status:** active public-interface track  
**Updated:** 2026-07-13  
**Scope:** empirical policy evaluation, reproducibility, evidence-to-claim inspection, and the SolarPunk reference application

## Working public description

This repository exposes a public research lab for evaluating how explicit rules trade permitted financial capacity against historical failure, then tracing evidence through policy admission into a bounded claim and settlement result.

This wording is deliberately descriptive rather than a permanent product name.

The internal `constraint-*` package, schema, protocol, and study identifiers remain implementation namespaces. They must not be treated as proof that the user approved **Constraint** as the public project name.

## Public user journey

```text
DECISION BRIEF
What did the rule buy, what capacity did it surrender, and where did it still fail?
        ↓
FULL EMPIRICAL STUDY
Policy comparison, frontier, annual results, stress replays, and methods
        ↓
REPRODUCE
Verify byte identity of the committed public aggregate bundle
        ↓
CLAIM LAB
Evidence → normalization → provenance → policy → bounded claim → settlement
        ↓
SOLARPUNK REFERENCE
Inspect the original energy-standard thesis and testnet application
```

The decision brief is the public entry point. The deeper surfaces provide progressively stronger inspection rather than competing home pages.

## Value delivered now

### 1. Decision support

The empirical interface can state the cost and benefit of a declared policy on a common historical sample:

- historical coverage;
- shortfall-event frequency;
- mean permitted capacity;
- conditional shortfall severity;
- binding-constraint attribution;
- severe historical stress failure.

The interface must show both the improvement and the exposure cost. It must not label a stricter policy as automatically better.

### 2. Reproducible public evidence

The public release exposes aggregate research artifacts, exact source-package identity, methods, and integrity hashes without redistributing licensed CRSP or Refinitiv row-level observations.

Browser reproduction proves byte identity of the published aggregate bundle. It does not prove source truth, policy optimality, or future adequacy.

### 3. Claim explainability

The protocol lab can explain why a bounded quantity was admitted:

```text
source evidence
→ normalized evidence identity
→ diagnostics
→ provenance classification
→ versioned policy decision
→ admitted maximum
→ issued quantity
→ settlement coverage or shortfall
```

The strongest current protocol value is inspectability. It is not production trustlessness, legal enforceability, reserve custody, or mainnet readiness.

### 4. SolarPunk continuity

SolarPunk remains the original energy-finance thesis and Sepolia reference application. It is not erased by the generalized lab, and the generalized lab must not be presented as though the thesis always had a separately approved product identity.

## Interface principles

1. **Answer first.** Lead with the decision and the trade-off before exposing machinery.
2. **Failure visible.** Severe stress inadequacy must remain prominent.
3. **Progressive inspection.** Brief → study → reproduction → protocol.
4. **No invented product certainty.** Descriptive labels are preferred until naming is explicitly decided.
5. **No raw-data leakage.** Public empirical surfaces remain aggregate only.
6. **No protocol mythology.** On-chain references support inspectability; they do not create legal or economic truth.
7. **Keep SolarPunk legible.** The original thesis/reference application remains a distinct route.

## Current implementation

The public shell uses the neutral label **Policy Lab**.

Routes:

| Hash route | Purpose |
|---|---|
| `#runs` | answer-first decision brief |
| `#study` | complete empirical study |
| `#reproduce` | aggregate bundle integrity verification |
| `#protocol` | evidence-to-claim browser laboratory |
| `#overview` | SolarPunk reference application |
| `#sepolia` | existing SolarPunk Sepolia proof |
| `#research` | research and methods material |

The `#study` route is intentionally reached through the decision brief while the top navigation continues to identify the broader section as **Decision Brief**.

## Validation gates for the current interface pass

Before merge:

```text
[ ] frontend tests green
[ ] Vite production build green
[ ] desktop Chromium walkthrough complete
[ ] mobile Chromium walkthrough complete
[ ] 20-session values match committed summary
[ ] 60-session values match committed summary
[ ] peak stress values match committed stress run
[ ] all three continuation buttons route correctly
[ ] no empirical artifacts or policy formulas changed
[ ] no protocol core, contracts, runtime, or thesis artifacts changed
```

## Highest-value next interface work

Do not add more generic dashboards by default.

The next useful steps are:

1. visual QA and screenshot review of the decision brief on desktop and mobile;
2. one downloadable decision memo generated from the published aggregate run;
3. one concrete field case after a real L2 operator or gateway evidence source exists;
4. explorer/readback proof only after an explicitly approved Sepolia protocol deployment;
5. a final naming decision only when the project is being submitted, published, or presented to external users.

## Stop rule

After the decision brief is validated and deployed, stop adding interface surface until one of these appears:

- a real external evidence source;
- reviewer or user feedback showing a concrete comprehension gap;
- a publication or competition format requiring a specific output;
- a protocol-integrity defect;
- an explicitly approved deployment milestone.

The project does not need more features merely to appear larger. Its value depends on a short, inspectable chain from evidence to decision.
