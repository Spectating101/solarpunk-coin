# Global AI Finance 2026 — Claim / Evidence Ledger

**Purpose:** bind every material outward claim to inspectable evidence and explicitly prohibit stronger inferences.

Canonical machine checkpoint: `frontend/src/data/publicEvidenceCheckpoint.js`.

## Frozen evidence identity

- case: `PUB-AUSGRID-001P`
- publisher label: Ausgrid
- dataset label: Solar Home Electricity Data
- frozen mirror commit: `ddb96f511059a410bfb3ea61c32e7def0d9c88f0`
- archive SHA-256: `6949ffee7ef8e2260f229f8a7e3b992390187facaaf023bb933b811a11cd1a11`
- archive bytes: `14973763`
- selected intervals: `336`
- selected window: `2012-07-01` through `2012-07-07`
- evidence hash: `ac0bc483f3da8d90c4b9281b46abdbc81177a9338525039bd0e346be12a1d93b`
- actual assurance: `L0`
- eligible surplus: `33.066 kWh`

## Claim ledger

### GAF-01 — external facts do not automatically determine financial authority

**Outward wording**

> Establishing that a data object exists—or even that it is cryptographically intact—does not by itself determine whether it is sufficient for a financial use, how much quantity it can justify, or whether the resulting obligation can settle.

**Evidence / basis**

- Policy Lab architecture implements separate evidence, admission, quantity, and settlement stages.
- Controlled and public cases demonstrate different outcomes across those stages.

**Allowed inference**

- the research problem is separation of logically distinct decisions.

**Prohibited inference**

- all real financial systems currently collapse these stages;
- Policy Lab is the first system ever to separate them.

---

### GAF-02 — Policy Lab is executable and deterministic

**Outward wording**

> Policy Lab is an executable research workbench whose case, evidence, policy, calculations, decisions, assessments, and reproduction artifacts have stable identities.

**Evidence / basis**

- deterministic constraint core and tests;
- public checkpoint decision IDs;
- capsule verification;
- assessment ID;
- byte-identical package/report rebuild in the public-case workflow.

**Allowed inference**

- a declared case can be replayed and compared under pinned inputs.

**Prohibited inference**

- determinism proves the policy is economically correct;
- stable identity proves the source data is physically true.

---

### GAF-03 — public case remains L0

**Outward wording**

> The pinned public Ausgrid case is retained at L0 assurance.

**Evidence / basis**

- checkpoint `evidence.assurance = L0`.

**Allowed inference**

- public availability and hashing do not promote source assurance.

**Prohibited inference**

- Ausgrid authenticated this Policy Lab case;
- the source holder confirmed custody;
- meter measurements were independently certified.

---

### GAF-04 — open policy admits 33.066 kWh

**Outward wording**

> Under the open research policy, the case is `ADMIT_WITH_LIMIT` at 33.066 kWh, with evidence-backed capacity binding.

**Evidence / basis**

- policy: `LAB-CASE-OPEN-004`
- decision ID: `913bde9848571e905873510ae2e11bd7b8ed4489d828e2605dca038dc3002a1a`
- admitted maximum: `33.066`
- binding constraint: `EVIDENCE_BACKED_CAPACITY`

**Allowed inference**

- under that exact policy and evidence object, the deterministic maximum is 33.066 kWh.

**Prohibited inference**

- 33.066 kWh is a market valuation;
- 33.066 kWh is legally issuable;
- the open policy is normatively or economically optimal.

---

### GAF-05 — same evidence is blocked by the pilot policy

**Outward wording**

> The identical evidence is blocked under the stricter pilot policy because signed evidence and stronger provenance are required.

**Evidence / basis**

- policy: `ENERGY-CASE-PILOT-005`
- decision ID: `96bc8edae69b3f27e6261ffcfb6f5a347b3b0a1a750abc81ec414e66b5a6e7d2`
- result: `BLOCKED`
- blocking rules: `SIGNED_EVIDENCE`, `MIN_PROVENANCE`
- evidence hash unchanged.

**Allowed inference**

- changing explicit policy can change financial consequence without rewriting evidence identity.

**Prohibited inference**

- pilot policy has been adopted by an institution;
- the pilot policy is validated by Ausgrid;
- the stricter policy is necessarily better.

---

### GAF-06 — settlement stress is partial

**Outward wording**

> At 40% declared settlement capacity, settlement is partial: 13.2264 kWh is covered and 19.8396 kWh remains short.

**Evidence / basis**

- declared capacity fraction: `0.4`
- result: `PARTIAL`
- covered: `13.2264`
- shortfall: `19.8396`

**Allowed inference**

- settlement can fail independently of an upstream admitted decision.

**Prohibited inference**

- this is an observed legal redemption event;
- 40% is an empirically estimated default probability;
- the system has demonstrated enforceable physical delivery.

---

### GAF-07 — verification and reproduction pass

**Outward wording**

> The public case has passing integrity, schema-validation, and closed-world decision-reproduction checks.

**Evidence / basis**

- capsule ID: `79b0b87b7c1af8cb3ea243f19740bb6ef47694f97618e2fc5451d0e30c5c4256`
- assessment ID: `088067800c192a0d6854cc4a70f068f3590d4fc658df3622370bfcc7974e56dc`
- integrity: `PASS`
- schema validation: `PASS`
- decision reproduction: `PASS`

**Allowed inference**

- the packaged research case is internally reproducible under its declared artifacts.

**Prohibited inference**

- reproduction proves external source truth;
- reproduction constitutes independent institutional validation.

---

### GAF-08 — research boundaries remain open

**Outward wording**

> The case does not establish authenticated operator custody, certified meter truth, legal issuance authority, enforceable redemption, production readiness, or monetary adoption.

**Evidence / basis**

- checkpoint non-claims;
- R1 `NOT_ASSESSED`;
- R2 `PARTIAL`;
- R3 `PARTIAL`;
- R4 `UNTESTED`.

**Allowed inference**

- the work is a bounded mechanism/research demonstration.

**Prohibited inference**

- currency, stablecoin, adoption, reserves, legal tender, production system, or validated monetary system.

## Mandatory language substitutions

| Never say | Use instead |
|---|---|
| "Ausgrid validated Policy Lab" | "Policy Lab evaluates a pinned public Ausgrid-derived dataset" |
| "verified energy production" | "bounded evidence object retained at L0 assurance" |
| "the system determines the correct value" | "the system computes the maximum permitted by the declared evidence and policy" |
| "settlement proves redemption" | "settlement is a declared stress stage in the current research case" |
| "energy-backed currency" | "evidence-backed financial claim" |
| "real-world pilot" | "outside-data research checkpoint" |
| "independent validation" | "reproducible public case" unless a genuinely independent evaluator exists |
