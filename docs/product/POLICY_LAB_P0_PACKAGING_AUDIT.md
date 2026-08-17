# Policy Lab — P0 / P0.1 Portable Assessment Packaging Audit

**Status:** P0 findings corrected and mechanically validated in P0.1  
**Scope:** external package semantics and recipient usability only  
**Runtime boundary:** no Policy Lab core, policy value, evidence value, settlement rule, or research result was reopened

---

## Final audit verdict

> **P0 ENGINE / DERIVATION: PASS**  
> **P0 EXTERNAL CONTRACT: REJECTED FOR CORRECTION**  
> **P0.1 PACKAGE SEMANTICS: PASS**  
> **EXTERNAL RECIPIENT / TRANSFERABILITY: NOT YET TESTED**

The first P0 package proved that a portable assessment object could be deterministically derived from the existing closed `PUB-AUSGRID-001P` artifact set.

The hostile audit then found eight packaging problems. P0.1 corrected the package boundary without changing the core.

The remaining evidence gap is no longer internal package design. It is whether an outside recipient can understand and independently verify the package with a minimal transferable bundle.

---

## P0 findings and P0.1 disposition

### H1 — research-policy result was overtranslated as `SUPPORTED_WITH_LIMIT`

**P0 severity:** HIGH  
**P0.1 disposition:** **FIXED**

P0.1 preserves the canonical runtime value:

```text
ADMIT_WITH_LIMIT
```

and uses only the scoped external reading:

```text
ADMITTED_WITH_LIMIT_UNDER_POLICY
```

The package also carries the policy's own name, description, version, governance authority/mutability metadata, manifest hash, and decision ID.

For `LAB-CASE-OPEN-004`, the policy description explicitly remains research-only.

No generic statement that the real-world claim is “supported” is made.

---

### H2 — generic schema name hid energy/Ausgrid domain assumptions

**P0 severity:** HIGH  
**P0.1 disposition:** **FIXED FOR CURRENT SCOPE**

P0.1 explicitly declares:

```text
schema: policylab.claim_assessment_package.v0.1
profile: policylab.energy_linked_claim.v0
```

The profile carries the energy-domain unit semantics.

The project does **not** claim that one energy case has established a universal claim schema.

No second domain profile should be invented until a genuinely different external case requires it.

---

### H3 — R1–R4 research projection was mandatory

**P0 severity:** HIGH  
**P0.1 disposition:** **FIXED**

The `ConstrainedClaimAssessment` is now an optional extension.

The current research distribution includes it and still anchors to:

`088067800c192a0d6854cc4a70f068f3590d4fc658df3622370bfcc7974e56dc`

But the package model no longer requires every future operational consumer to treat R1–R4 as the primary external contract.

---

### H4 — remediation prose was a second source of policy meaning

**P0 severity:** HIGH  
**P0.1 disposition:** **FIXED**

P0.1 carries the existing structured rule evaluations directly:

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

The human report explains blocking/binding results from these objects.

For the pilot block, the package preserves:

```text
SIGNED_EVIDENCE
observed signed = false

MIN_PROVENANCE
observed L0
required L2
```

No hand-maintained remediation map is canonical anymore.

---

### H5 — one package identity mixed decisions with prose/run packaging

**P0 severity:** MEDIUM-HIGH  
**P0.1 disposition:** **FIXED AND TESTED**

P0.1 separates:

```text
assessment_id
= semantic assessment identity

package_content_id
= complete package-content identity
```

The verifier deliberately perturbs prose/delivery-only fields and requires:

```text
assessment_id unchanged
package_content_id changed
```

PASS.

Two separate P0.1 executions additionally produced different delivery capsule/package-content identities while retaining the same semantic assessment ID:

`04a4f79431f2bf774ec2a3df69836461752998829ae76a89e946971c42d756a9`

This is the intended identity behavior.

---

### H6 — human report assumed repository literacy

**P0 severity:** MEDIUM-HIGH  
**P0.1 disposition:** **SUBSTANTIALLY FIXED INTERNALLY; RECIPIENT TEST STILL REQUIRED**

The primary report now presents:

```text
question
local assessment period
named policy + policy scope
result under each policy
quantity admitted if any
what bound / blocked the result
evidence actually available
unit definition
settlement result
verification identities
```

Internal policy IDs, manifest hashes, UTC instants, R1–R4 projection, delivery capsule identity, and the full non-claim list are moved to the technical appendix.

The remaining test is empirical: give the report to someone who does not know the repository and see whether they understand it.

Do not polish further before that evidence.

---

### H7 — `ENERGY_CLAIM_UNIT` lacked an external definition

**P0 severity:** MEDIUM  
**P0.1 disposition:** **FIXED**

P0.1 explicitly carries:

```text
source unit: kWh
claim unit: ENERGY_CLAIM_UNIT
evidence-backed rate: 1
calculator: EVIDENCE_BACKED_CAPACITY
```

The package states that the declared mapping does **not** make the policy-defined claim unit physical kWh, directly metered grid export, legal title, a renewable-energy certificate, or money.

---

### H8 — verifier required repository-local closed artifacts

**P0 severity:** MEDIUM  
**P0.1 disposition:** **NOT FIXED BY DESIGN; PROMOTED TO NEXT EXTERNAL EVIDENCE GATE**

The current verifier is now strong for internal closed-artifact verification.

It checks package/schema/profile identity, case/evidence/policy agreement, structured rule evaluations, quantities, settlement, optional research projection, optional delivery verification, report reproduction, and identity scope.

But it still expects the closed repository artifact set.

This is no longer a reason to enlarge P0.1.

The next question is:

> What is the smallest transferable bundle a second party actually needs to verify the package independently?

Answer that through a real second-party reproduction exercise, not speculative architecture.

---

## Lower-severity P0 observations

### M1 — duplicated evidence warnings

**P0.1:** fixed.

The package now carries structured warning code/detail pairs directly from evidence diagnostics instead of merging overlapping free-text warnings from multiple report surfaces.

### M2 — comparative policies should not be mandatory

**P0.1:** preserved.

The schema requires a non-empty evaluation array, not exactly two policies.

The Ausgrid case still uses two because policy divergence is the central demonstration.

### M3 — settlement should remain optional

**P0.1:** preserved.

Settlement remains nullable and separate from admission.

---

## P0.1 validated package

For the current public-source case, P0.1 preserves:

```text
Evidence
33.066 kWh derived surplus
L0
source-holder confirmation NOT_CONFIRMED

Open Case Demonstration
ADMIT_WITH_LIMIT
33.066 ENERGY_CLAIM_UNIT
binding calculator: EVIDENCE_BACKED_CAPACITY

Energy Case Pilot Policy
BLOCKED
blocking calculators:
SIGNED_EVIDENCE
MIN_PROVENANCE

Settlement scenario
PARTIAL
13.2264 covered
19.8396 shortfall
```

The research extension remains:

```text
R1 NOT_ASSESSED
R2 PARTIAL
R3 PARTIAL
R4 UNTESTED
```

No result was promoted by packaging.

---

## Validation record

P0.1 functional head:

`6301ef1ba77afec91a239afd14abee8d8b05880b`

External Case workflow run:

`32058965834`

The run passed:

- source archive hash/byte check;
- existing bounded case execution;
- existing four-boundary assessment build;
- existing assessment verification;
- P0.1 package build;
- P0.1 package-to-artifact verification;
- identity-scope probe;
- exact human-report reproduction;
- byte-identical package/report rebuild;
- artifact upload.

A prior independent P0.1 execution also passed, permitting the cross-run identity comparison recorded above.

---

## Revised architecture after audit

```text
DETERMINISTIC POLICY LAB CORE
        ↓
CLAIM ASSESSMENT PACKAGE
        ↓
DOMAIN PROFILE
policylab.energy_linked_claim.v0
        ↓
POLICY EVALUATION(S)
structured rule traces
        ↓
OPTIONAL EXTENSIONS
research projection
delivery verification
settlement when applicable
        ↓
RENDERINGS
human assessment / research kit / later integration surface
```

The next meaningful layer is not another architecture abstraction.

It is a recipient.

---

## Next gate

### P1 — comprehension

Give the generated human report to a person unfamiliar with the repository.

Success criterion:

They can correctly explain:

1. what question was assessed;
2. why the open research policy admitted a bounded quantity;
3. why the stricter pilot policy blocked;
4. the difference between 33.066 kWh evidence and 33.066 `ENERGY_CLAIM_UNIT`;
5. the source/assurance limitations;
6. what the package does not establish.

### P2 — transferability

Give a second party the smallest plausible verification bundle.

Success criterion:

They can independently verify the package without relying on hidden authoring state.

The outcome of that exercise determines whether another bundle field, verifier mode, CLI, or integration surface is actually necessary.

---

## Stop rule

P0.1 has answered the internal packaging problem far enough.

Do **not** add:

- new policies;
- new evidence sources merely to exercise packaging;
- cross-domain generalization;
- API/SaaS infrastructure;
- marketplace/plugin machinery;
- certification language;
- AI features;
- new Policy Lab core behavior.

The next useful evidence must come from an external recipient or genuinely new outside case.
