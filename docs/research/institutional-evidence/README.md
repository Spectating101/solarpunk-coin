# Comparative Institutional Evidence

**Status:** research-method layer  
**Scope:** external institutional precedents that ground, challenge, or delimit CL–ECI and Policy Lab  
**Authority:** subordinate to the research foundation, primary sources, result ledger, and claim registry

## Purpose

This directory records real institutions whose rules make the project’s abstract boundaries observable in practice.

Comparative institutional evidence is not:

- validation of the current Policy Lab engine;
- proof that an energy-backed monetary system works;
- a substitute for empirical econometrics;
- a substitute for attributable operator evidence;
- a deployment plan for the referenced institution;
- permission to reproduce protected or personal data.

Its purpose is narrower and stronger:

> Show whether mature institutions already require distinctions analogous to signal, evidence, authority, quantity, identity, anti-reuse, settlement, correction, and governance.

## Evidence position

```text
THEORETICAL EVIDENCE
monetary theory, institutional economics, backing, settlement
        ↓
EMPIRICAL EVIDENCE
ECI estimates, robustness, observed statistical relationships
        ↓
COMPARATIVE INSTITUTIONAL EVIDENCE
real rules, roles, registries, settlement and correction procedures
        ↓
SIMULATION EVIDENCE
Policy Lab cases, counterfactuals, binding constraints, stress replay
        ↓
IMPLEMENTATION EVIDENCE
schemas, deterministic runtime, receipts, tests, public-network proof
        ↓
EXTERNAL VALIDATION
attributable evidence, expert review, partner comparison, field case
        ↓
MONETARY PERFORMANCE EVIDENCE
circulation, liquidity, acceptance, unit-of-account use, stress performance
```

No layer silently upgrades another.

## Required package

Each institutional reference must contain:

```text
README.md
INSTITUTIONAL_EVIDENCE_DOSSIER.md
CLAIM_REGISTER.md
CL_ECI_MAPPING.md
SOURCE_REGISTER.md
optional reference-case specifications
```

## Required analytical fields

For each institution or process, record:

- governed object;
- physical or economic event;
- source evidence;
- evidence states and revisions;
- authorized actors;
- admission conditions;
- quantity mapping;
- identity and anti-reuse mechanism;
- transfer or custody rules;
- settlement object;
- correction process;
- governance and override boundaries;
- what the process establishes;
- what it explicitly does not establish;
- exact CL–ECI relevance.

## Claim classes

| Class | Meaning | Permitted wording |
|---|---|---|
| `OBSERVED_RULE` | Directly stated in an authoritative source | “The institution requires…” |
| `OBSERVED_PROCESS` | Directly documented operational sequence | “The process records / calculates / evaluates…” |
| `INSTITUTIONAL_INFERENCE` | Bounded interpretation supported by multiple observed rules | “This supports the relevance of…” |
| `CL_ECI_ANALOGY` | Mapping to the project’s framework | “This is analogous to…” |
| `SIMULATION_PROPOSAL` | Proposed Policy Lab representation | “A reference case could test…” |
| `EXTERNAL_VALIDATION` | Independent comparison or field evidence | Reserved until actually obtained |

`CL_ECI_ANALOGY` must never be rewritten as `EXTERNAL_VALIDATION`.

## Promotion gates

An institutional rule may enter an executable case only when:

1. the source is authoritative and versioned or access-dated;
2. the governed object and actor roles are unambiguous;
3. the quantity and state transitions are specified;
4. non-claims are explicit;
5. uncertainty or unresolved interpretation is recorded;
6. the case is labelled as a reference simulation or institutional digital twin;
7. no live integration, authority, or legal effect is implied.

A reference simulation may be called externally validated only after at least one of:

- expert or institutional review;
- comparison with an actual institutional decision;
- attributable data supplied under valid authority;
- a documented partner or operator case.

## Current package

- [`norway/`](./norway/) — Elhub, Guarantees of Origin / NECS, and flexibility-market admission as a heavy institutional reference environment.
