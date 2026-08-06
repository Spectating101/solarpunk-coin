# Conformance Benchmark v1

**Status:** specification freeze candidate  
**Version:** 0.1  
**Date:** 2026-08-07  
**Purpose:** define the minimum evidence, policy, decision, settlement, identity, and reproduction behaviors that a conforming Policy Lab / Constraint implementation must demonstrate.

This benchmark evaluates behavior. It does not certify physical source truth, legal validity, regulatory compliance, commercial readiness, or universal fraud prevention.

---

## 1. Benchmark principles

1. Evidence identity, policy identity, decision identity, and settlement identity remain separate.
2. Observed, controlled, modeled, declared, and derived inputs remain distinguishable.
3. Unsupported evidence cannot be promoted through naming, successful parsing, permission, or local signatures.
4. Admission and authorized quantity are separate outcomes.
5. Settlement cannot occur for a blocked or zero-authorized claim.
6. Duplicate use, cancellation, and correction must be represented explicitly when in scope.
7. Every result must be reproducible from the declared artifact closure.
8. A conforming implementation must fail clearly, not silently repair or invent missing authority.

---

## 2. Benchmark families

### B1 — Source and artifact integrity

Required cases:

- original file matches declared SHA-256 and byte length;
- changed source bytes fail verification;
- changed manifest fails canonical hash verification;
- undeclared file is rejected from a closed capsule;
- raw private rows are absent from a public-safe package;
- unsafe overwrite of a private workspace is refused.

Required outputs:

- deterministic source identity;
- explicit verification verdict;
- machine-readable failure reason.

### B2 — Semantic and temporal mapping

Required cases:

- valid timestamp, timezone, interval, field, and unit mapping;
- missing timezone;
- ambiguous cumulative versus interval quantity;
- duplicate timestamps;
- missing intervals;
- mixed units;
- inconsistent sign convention;
- conversion rule with declared factor and provenance;
- measurement window outside source coverage.

Required outputs:

- row and interval diagnostics;
- unresolved semantic fields;
- no silent unit or timezone assumption;
- deterministic normalized artifact when admissible.

### B3 — Provenance and assurance boundaries

Required cases:

- baseline L0 source;
- permissioned source without authentication;
- locally signed artifact without independent key-custody evidence;
- filename or manifest claiming high assurance;
- independently verified API or gateway evidence;
- declared L2/L4 counterfactual replay separated from actual source state.

Required outputs:

- actual assurance state;
- accepted and rejected promotion evidence;
- counterfactual state clearly labeled;
- no automatic promotion.

### B4 — Policy admission

Required cases:

- evidence satisfies every admission rule;
- one blocking rule fails;
- multiple blocking rules fail;
- missing required rule input;
- policy version changes while evidence remains fixed;
- evidence changes while policy remains fixed.

Required outputs:

- admitted or blocked verdict;
- evaluated rules and reasons;
- primary blocker selection rule;
- immutable policy identity;
- evidence and policy transition report.

### B5 — Quantity authorization

Required cases:

- admitted claim with no binding ceiling;
- admitted claim with one binding ceiling;
- multiple ceilings with deterministic minimum;
- negative or invalid quantity;
- quantity requested above observed or authorized amount;
- blocked claim where quantity is not calculated or authorized.

Required outputs:

- authorized quantity;
- binding rule;
- requested, eligible, and authorized quantities kept distinct;
- no quantity for blocked claims unless explicitly represented as zero by the schema.

### B6 — Identity, anti-reuse, cancellation, and correction

Required cases where the lifecycle is enabled:

- unique claim identity creation;
- exact duplicate claim attempt;
- overlapping measurement-window claim attempt;
- transfer preserving identity and history;
- cancellation preventing further use;
- evidence correction creating a new version rather than overwriting history;
- revised decision linked to prior decision;
- correction that changes admission or quantity.

Required outputs:

- deterministic identity and lineage;
- explicit duplicate or overlap failure;
- cancellation state;
- correction chain;
- no claim that modeled anti-reuse covers external systems outside the test boundary.

### B7 — Settlement boundaries

Required cases:

- admitted quantity enters a declared settlement scenario;
- blocked claim attempts settlement;
- settlement quantity exceeds authorization;
- changed policy requires new decision before settlement;
- settlement receipt references exact decision and evidence identities;
- stress scenario changes modeled settlement assumptions without changing source evidence.

Required outputs:

- settlement admitted, refused, or bounded;
- exact decision dependency;
- no implication of circulation, liquidity, redemption, reserve custody, or money.

### B8 — Receipt and capsule closure

Required cases:

- valid DecisionReceipt;
- tampered evaluated rule;
- tampered quantity;
- missing declared artifact;
- extra undeclared artifact;
- mismatched decision and settlement objects;
- clean-environment reproduction;
- browser or interface reproduction against the same release identity.

Required outputs:

- cross-object agreement verdict;
- exact failure location;
- deterministic package inventory;
- reproduction duration and environment record.

### B9 — Adversarial and failure behavior

Required cases:

- malformed source file;
- oversized or unexpected field;
- path traversal or unsafe output path;
- secret-like material in a public package;
- unsupported schema version;
- non-deterministic ordering attempt;
- clock or locale difference;
- stale policy reference;
- partial workflow failure and retry.

Required outputs:

- safe refusal or bounded error;
- no private data leakage;
- no silent evidence or policy substitution;
- stable failure identity where appropriate.

---

## 3. Benchmark corpus structure

```text
benchmark/
├── README.md
├── benchmark-manifest.json
├── cases/
│   ├── source-integrity/
│   ├── semantics-time/
│   ├── provenance-assurance/
│   ├── policy-admission/
│   ├── quantity/
│   ├── identity-lifecycle/
│   ├── settlement/
│   ├── receipt-capsule/
│   └── adversarial/
├── expected/
│   ├── decisions/
│   ├── settlements/
│   ├── receipts/
│   ├── diagnostics/
│   └── failures/
├── schemas/
├── runners/
└── reports/
```

External raw source data must not enter the public benchmark unless publication permission explicitly authorizes it. External cases may contribute privacy-safe derived fixtures or sealed verification manifests.

---

## 4. Machine-readable benchmark manifest

Each benchmark case should declare:

- benchmark ID and version;
- family;
- purpose;
- input artifact inventory and hashes;
- evidence classification;
- policy identity;
- expected admission state;
- expected quantity state;
- expected primary blocker or binding rule;
- expected settlement state;
- expected verification result;
- permitted variability;
- forbidden claims;
- implementation requirements;
- source licence and publication boundary.

Expected outputs must not be generated dynamically by the implementation under test.

---

## 5. Conformance levels

### C0 — Parse and integrity

Passes B1 and B2 minimum cases.

### C1 — Deterministic decision

Passes C0 plus B3, B4, and B5.

### C2 — Reproducible receipt

Passes C1 plus B8.

### C3 — Lifecycle and settlement

Passes C2 plus applicable B6 and B7 cases.

### C4 — Hardened reference implementation

Passes C3 plus B9, release-provenance requirements, privacy checks, and clean-environment reproduction.

Conformance levels describe tested behavior only. They do not represent source assurance levels and must never reuse L0–L4 provenance terminology.

---

## 6. Metrics

Report at minimum:

- cases passed, failed, skipped, and not applicable;
- deterministic output agreement;
- execution time;
- clean-environment reproduction time;
- adapter setup time where applicable;
- number of manual interventions;
- unresolved semantic fields;
- cross-object agreement failures;
- private/public package violations;
- platform and runtime versions.

Do not collapse all metrics into one quality or confidence score.

---

## 7. Independent use

A third party may claim benchmark participation only when it publishes:

- implementation and version identity;
- benchmark version;
- complete machine-readable report;
- environment record;
- skipped and modified cases;
- any implementation-specific extensions;
- limitations and non-claims.

The founding implementation may not declare itself a neutral standard merely by passing its own benchmark.

---

## 8. v1 implementation sequence

1. Inventory existing tests and controlled cases against B1–B9.
2. Mark every requirement as existing, partial, absent, or out of scope.
3. Freeze the benchmark manifest schema.
4. Select a minimal corpus for C0–C2.
5. Implement an independent runner that consumes packaged artifacts rather than internal test helpers.
6. Generate machine-readable and human-readable reports.
7. Run in a clean checkout and at least one second environment.
8. Add external-case-derived privacy-safe fixtures only after permission and case closure.
9. Request independent reproduction.
10. Version and archive the benchmark separately from product releases.

---

## 9. Benchmark completion rule

Conformance Benchmark v1 is complete when:

- C0–C2 requirements have an executable public corpus;
- expected outputs are independently frozen;
- the reference implementation passes or records explicit failures;
- one clean-environment report is archived;
- privacy and non-claim checks pass;
- the benchmark can be run without access to private source data;
- limitations identify all untested lifecycle, security, institutional, and legal properties.