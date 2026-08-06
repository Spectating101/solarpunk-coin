# External Review Protocol

**Status:** active operating protocol  
**Version:** 0.1  
**Date:** 2026-08-07  
**Issues:** #29, #32  
**Authority:** subordinate to `docs/project/MAXIMUM_VALUE_EXECUTION_PROGRAM.md`, the research foundation, source/result/claim authorities, and exact artifacts frozen for review.

This protocol converts independent scrutiny from an informal endorsement request into a reproducible review process with defined scope, evidence, findings, corrections, and closure.

External review does not establish certification, institutional adoption, legal validity, production readiness, or source truth beyond the reviewer’s documented scope.

---

## 1. Review objectives

The review programme must answer separate questions:

1. **Domain accuracy:** Are energy, sustainability, certificate, metering, and institutional concepts represented truthfully and within scope?
2. **Technical integrity:** Do identities, policies, decisions, receipts, capsules, privacy boundaries, and benchmark behavior survive independent inspection?
3. **Research defensibility:** Are the central distinctions novel, useful, bounded, and supported by the exact evidence claimed?
4. **Operational legibility:** Can an external operator understand the workflow, required artifacts, result, limitations, and next action?

No reviewer is expected to answer every question.

---

## 2. Reviewer roles

### Domain reviewer

Preferred experience in at least one of:

- renewable-energy generation or monitoring;
- energy management, EMS, ESCO, or M&V work;
- renewable certificates or electricity-market operations;
- sustainability, carbon, or green-finance assurance;
- metering, energy data, or facility operations;
- public energy policy or institutional design.

Minimum review scope:

- source relationship and custody terminology;
- timestamp, timezone, interval, field, and unit semantics;
- directly measured, calculated, inferred, and declared distinctions;
- evidence-readiness versus official certification boundary;
- policy and institutional interpretation;
- missing operational risks and prohibited claims.

### Technical reviewer

Preferred experience in at least one of:

- reproducible research;
- software security or privacy;
- data provenance, digital governance, or audit systems;
- distributed systems or cryptographic protocols;
- research software engineering;
- formal policy, rules, or decision systems.

Minimum review scope:

- deterministic identities and transitions;
- evidence/policy/quantity/settlement separation;
- actual versus counterfactual state;
- receipt and capsule closure;
- tamper and cross-object checks;
- private/public boundary;
- benchmark design and adversarial coverage;
- unsupported production, standard, or security claims.

### Research reviewer

Optional but desirable after M1:

- evaluates contribution clarity, related work, methods, threats, evaluation, and publication fit;
- does not substitute for domain or technical review unless qualified for those roles.

---

## 3. Reviewer relationship and conflict record

Every review must record:

- reviewer name or permitted pseudonymous identity;
- role and relevant experience;
- organization where disclosure is permitted;
- prior relationship to the founder or project;
- compensation, gift, authorship, advisory, or future-commercial interest;
- whether the review is public, private, attributable, or anonymous;
- permissions for quoting or publishing findings.

A collaborator may review, but the relationship must be stated. A friendly review is not described as independent when material conflicts exist.

---

## 4. Review-package freeze

Before review begins, freeze:

- repository commit SHA;
- release or benchmark version;
- exact external case and permitted artifacts;
- relevant policy IDs and versions;
- decision, settlement, receipt, and capsule identities;
- manuscript or brief version;
- claim and non-claim register extracts;
- reproduction instructions;
- source/publication permission boundary;
- review questions and exclusions.

Review findings must reference the frozen package. Later commits may resolve findings but do not rewrite what was originally reviewed.

---

## 5. Minimum review package

### For External Case review

- source-holder relationship summary;
- permission and publication boundary;
- measurement window and semantic mapping;
- diagnostics;
- actual assurance state;
- open and pilot policy results;
- settlement result where applicable;
- DecisionReceipt and Research Capsule;
- verification report;
- non-claims and remaining gaps.

Raw data is included only when permission and reviewer handling arrangements allow it.

### For technical review

- architecture and invariant summary;
- benchmark manifest and report;
- relevant schemas and policy manifests;
- selected positive and negative fixtures;
- threat model or current security assumptions;
- clean-run instructions;
- exact known limitations.

### For manuscript review

- manuscript;
- claim register;
- source register;
- figure/table source paths;
- code/data reproduction path;
- overlap statement;
- target contribution and exclusions.

---

## 6. Finding structure

Each finding must include:

| Field | Meaning |
|---|---|
| Finding ID | stable identifier such as `DR-001` or `TR-001` |
| Scope | domain, technical, research, operational, privacy, or claim |
| Severity | critical, major, moderate, minor, or observation |
| Artifact | exact file, object, page, route, or behavior |
| Statement | what is wrong, unclear, unsupported, or missing |
| Evidence | why the reviewer reached the finding |
| Consequence | research, operational, privacy, security, or claim impact |
| Recommendation | suggested correction or test |
| Reviewer confidence | high, medium, low, or not assessed |

Severity definitions:

- **Critical:** invalidates a central result, creates material privacy/security risk, or permits a prohibited claim.
- **Major:** materially weakens repeatability, interpretation, or institutional usefulness.
- **Moderate:** bounded defect or ambiguity that should be corrected before publication or pilot use.
- **Minor:** local clarity, documentation, or usability issue.
- **Observation:** non-blocking idea or future consideration.

---

## 7. Disposition rules

Every finding receives one disposition:

- `ACCEPTED — FIXED`
- `ACCEPTED — PLANNED`
- `ACCEPTED — OUT OF CURRENT SCOPE`
- `PARTIALLY ACCEPTED`
- `REJECTED WITH RATIONALE`
- `DUPLICATE`
- `CANNOT REPRODUCE`
- `REQUIRES EXTERNAL AUTHORITY`

Required evidence:

- correction commit or artifact;
- updated claim/non-claim language;
- added or changed test;
- explicit reason for rejection;
- reviewer follow-up where needed.

No finding may disappear from the register because it is inconvenient.

---

## 8. Review closure

A review closes only when:

- all findings have dispositions;
- critical and major findings are fixed, explicitly accepted as blockers, or remove the affected claim;
- corrections are tied to commit or artifact identities;
- the reviewer has an opportunity to inspect material corrections;
- unresolved disagreement is recorded;
- public summary and quotation permissions are confirmed;
- the programme scoreboard is updated truthfully.

Permitted closure statements:

- `REVIEWED WITH CORRECTIONS`
- `REVIEWED — MATERIAL BLOCKERS REMAIN`
- `REVIEWED — CLAIM REMOVED OR REDUCED`
- `REVIEW INCOMPLETE`

Do not write “validated,” “approved,” “certified,” or “endorsed” unless an authorized body explicitly provides that status.

---

## 9. Publication boundary

A public review summary may include:

- reviewer role and permitted identity;
- reviewed artifact version;
- review scope;
- finding counts by severity;
- corrections made;
- unresolved limitations;
- exact non-endorsement statement.

Do not publish:

- private raw source data;
- confidential organizational details;
- private reviewer contact information;
- unpublished findings without permission;
- selective praise while omitting material blockers.

---

## 10. Recruitment sequence

1. Identify at least five candidates per role.
2. Record qualification, relationship, availability, and expected conflict.
3. Invite with a bounded scope and time request.
4. Offer attribution, acknowledgement, honorarium, authorship consideration, or reciprocal review only where ethically appropriate and explicitly documented.
5. Freeze the review package after External Case 001 and Benchmark C0–C2 are inspectable.
6. Run domain and technical reviews separately.
7. Correct and close before using review in a major publication, pilot, or funding package.

---

## 11. Review success criteria

M3 independent scrutiny requires:

- at least one completed attributable or properly documented domain review;
- at least one completed attributable or properly documented technical review;
- written findings and disposition register;
- correction evidence;
- standards-alignment matrix;
- threat-model and privacy-boundary review;
- no unresolved critical finding hidden from later packages.

The programme gains value from rigorous criticism and correction, not from collecting flattering quotations.