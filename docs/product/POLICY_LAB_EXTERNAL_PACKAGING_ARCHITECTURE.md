# Policy Lab — External Packaging Architecture

**Status:** design exploration; no core-engine change  
**Branch:** `design/policy-lab-external-packaging`  
**Purpose:** determine how the frozen G4 Policy Lab can become externally consumable without distorting the research object.

---

## 1. Packaging thesis

Policy Lab should not be packaged externally as one large research application.

The frozen core already performs the difficult internal work:

```text
Evidence
  ↓
Assurance
  ↓
Admission
  ↓
Quantity
  ↓
Settlement
  ↓
Receipt / lineage
```

The external packaging problem is different:

> What stable object can another person receive, understand, verify, integrate, cite, or pay to produce without first learning the repository architecture?

The answer proposed here is:

> **The canonical external unit is a Claim Assessment Package.**

Policy Lab is the machinery that produces and verifies that package.

The current `ConstrainedClaimAssessment` remains a research projection over runtime artifacts. It should **not** be promoted unchanged into the universal external product object because it is intentionally organized around research boundaries R1–R4 rather than an external user's immediate claim, policy, evidence, decision, and remediation needs.

---

## 2. Product hierarchy

```text
LEVEL 0 — DETERMINISTIC CORE
Evidence → Assurance → Admission → Quantity → Settlement → Receipt
internal implementation authority

LEVEL 1 — PORTABLE EXTERNAL OBJECT
Claim Assessment Package
portable / inspectable / verifiable

LEVEL 2 — DOMAIN PACK
claim templates + evidence profile + policy profile + vocabulary
initial domain: energy-linked claims

LEVEL 3 — HUMAN PACKAGES
Assessment Report
Assessment Viewer
Assisted Assessment Service

LEVEL 4 — MACHINE PACKAGES
SDK / CLI / API
embedded evaluation

LEVEL 5 — RESEARCH PACKAGE
benchmark cases + policies + expected outputs + reproduction path

LEVEL 6 — INSTITUTIONAL PACKAGE
private connectors + policy registry + access/approval controls + deployment support
only after external demand proves this layer is needed
```

The layers share the same underlying artifacts. They are not separate engines.

---

## 3. The canonical external object

### 3.1 Claim Assessment Package

The package should answer, in order:

1. **What claim was assessed?**
2. **Against which evidence?**
3. **Under which declared policy?**
4. **What was the decision?**
5. **If bounded, what quantity/scope is supportable?**
6. **What blocked or bound the result?**
7. **What evidence would change the result?**
8. **What happened at settlement/fulfilment, if assessed?**
9. **Can another party verify or reproduce it?**
10. **What does the assessment explicitly not establish?**

The package is therefore different from a generic report. It is both:

- a machine-readable decision object; and
- the source from which human reports, viewers, research projections, and integrations are rendered.

### 3.2 Do not collapse distinct semantics

The external package must keep these distinct:

```text
claim requested
≠ evidence assurance
≠ policy admission
≠ supported quantity
≠ settlement result
≠ research-boundary status
≠ legal / regulatory authority
```

A convenient UI may summarize them, but the package must preserve the typed distinctions.

---

## 4. Proposed package family

The external architecture should use a small family of composable objects rather than one giant document.

### A. Evidence Package

Purpose: preserve the exact evidence object and what is known about it.

Minimum responsibilities:

```text
source identity
measurement / source semantics
scope / window
transformations
content or evidence hash
assurance level
warnings / blockers
source-holder or operator confirmation state
```

The existing `EvidenceEnvelope` remains the likely implementation basis.

### B. Policy Pack

Purpose: make the adjudication rule set portable and versioned.

Minimum responsibilities:

```text
policy ID
policy version / content identity
admission gates
quantity ceilings
settlement requirements where applicable
required assurance / provenance
human-readable rule explanations
```

A Policy Pack is not a statement that the policy is legally authoritative, economically optimal, or externally endorsed.

### C. Claim Definition

Purpose: state precisely what the requester is trying to assert.

Minimum responsibilities:

```text
claim ID
claim type
subject
requested scope / quantity
unit
period
jurisdiction / location only where relevant
claim-specific parameters
```

This object is currently underrepresented in the public assessment schema and is necessary for external use.

### D. Evaluation Result

Purpose: preserve the deterministic consequence of one Claim Definition + Evidence Package + Policy Pack.

Minimum responsibilities:

```text
decision
blocking rules
binding ceiling
supported quantity / scope
rule-by-rule trace
policy identity
evidence identity
decision identity
```

### E. Settlement / Fulfilment Result

Purpose: preserve what happened after admission when settlement or delivery is actually part of the assessed workflow.

It must remain optional because not every external claim requires settlement.

### F. Claim Assessment Package

Purpose: bind A–E together and add:

```text
assessment identity
verification status
next evidence required
explicit non-claims
references to underlying artifacts
optional research projection
```

This is the object external consumers exchange.

---

## 5. Draft package shape

The first experimental package should look conceptually like this:

```json
{
  "schema": "policylab.claim_assessment_package.v0",
  "assessment_id": "sha256:...",
  "claim": {
    "claim_id": "...",
    "type": "energy_surplus_backed_quantity",
    "subject": "...",
    "requested_quantity": null,
    "unit": "kWh",
    "period": { "start": "...", "end": "..." }
  },
  "evidence": {
    "evidence_id": "...",
    "hash": "...",
    "assurance": "L0",
    "source_confirmation": "NOT_CONFIRMED",
    "warnings": []
  },
  "evaluations": [
    {
      "policy": {
        "id": "LAB-CASE-OPEN-004",
        "version": "..."
      },
      "decision": "ADMIT_WITH_LIMIT",
      "supported_quantity": 33.066,
      "unit": "kWh",
      "binding_rule": "EVIDENCE_BACKED_CAPACITY",
      "blocking_rules": [],
      "decision_id": "..."
    },
    {
      "policy": {
        "id": "ENERGY-CASE-PILOT-005",
        "version": "..."
      },
      "decision": "BLOCKED",
      "supported_quantity": 0,
      "unit": "kWh",
      "binding_rule": null,
      "blocking_rules": ["SIGNED_EVIDENCE", "MIN_PROVENANCE"],
      "decision_id": "..."
    }
  ],
  "settlement": {
    "status": "PARTIAL",
    "covered_quantity": 13.2264,
    "shortfall_quantity": 19.8396,
    "unit": "kWh",
    "basis": "DECLARED_SCENARIO"
  },
  "next_evidence_required": [
    "authenticated source-holder/operator evidence",
    "provenance meeting the stricter policy requirement"
  ],
  "verification": {
    "replayable": true,
    "artifact_integrity": "PASS",
    "verifier_profile": "..."
  },
  "research_projection": {
    "schema": "solarpunk.constraint.constrained_claim_assessment.v1",
    "assessment_ref": "088067800c192a0d6854cc4a70f068f3590d4fc658df3622370bfcc7974e56dc"
  },
  "explicit_non_claims": []
}
```

This is only a package-design sketch. It does not replace the frozen runtime schemas.

---

## 6. Why the existing `ConstrainedClaimAssessment` should remain separate

The existing schema is strong for research because it explicitly records:

```text
R1 economic information
R2 claim-level evidence
R3 binding constraint
R4 monetary performance
```

and preserves basis references, non-claims, next evidence, and stable assessment identity.

That is valuable, but a professional or developer consumer should not have to interpret R1–R4 in order to answer:

> Was this claim admitted, what quantity is supportable, what blocked it, and what would change the decision?

Therefore:

```text
runtime artifacts
      ├──→ Claim Assessment Package      [external operational projection]
      └──→ ConstrainedClaimAssessment    [research projection]
```

Neither projection rewrites the underlying engine.

---

## 7. Human-facing packages

### 7.1 Assessment Report

The report should be generated from the package, not authored independently.

Page/order logic:

```text
1. RESULT
2. CLAIM ASSESSED
3. SUPPORTABLE SCOPE / QUANTITY
4. WHY
5. WHAT IS MISSING
6. EVIDENCE + ASSURANCE
7. POLICY + RULE TRACE
8. SETTLEMENT / FULFILMENT if applicable
9. VERIFICATION + IDENTITIES
10. LIMITATIONS / NON-CLAIMS
```

The report should not lead with architecture, R1–R4, or repository terminology.

### 7.2 Assessment Viewer

Purpose:

> Open a package received from someone else and inspect/verify it without requiring the original authoring interface.

Minimum functions:

```text
open package
validate schema
check package identity
show claim and decision
show blocking/binding rules
show evidence/policy identities
show next evidence required
show explicit limitations
run local/remote verifier if underlying artifacts are present
```

The Viewer is strategically useful because it lets the assessment artifact travel independently of the workbench.

### 7.3 Assisted Assessment Service

This should be the first commercial packaging experiment if external interest appears.

The service is not initially “SaaS.”

The transaction is:

```text
customer / collaborator provides case + evidence + relevant rules
        ↓
we normalize the case without changing source meaning
        ↓
Policy Lab executes declared policies
        ↓
we return Claim Assessment Package + human report + reproduction path
```

Why start here:

- learns which inputs external users actually have;
- learns which missing evidence matters in practice;
- reveals which report fields they care about;
- avoids automating a workflow before the workflow is known;
- can generate the first payment or repeat-use evidence without enlarging the core.

---

## 8. Machine-facing packages

### 8.1 CLI

First machine interface should likely be CLI because it matches the current reproducibility culture.

Conceptual use:

```text
policy-lab assess \
  --claim claim.json \
  --evidence evidence.json \
  --policy policy.json \
  --out assessment/

policy-lab verify assessment/claim-assessment-package.json
```

### 8.2 SDK

Only after the package schema stabilizes.

Conceptual use:

```js
const result = await policyLab.assess({ claim, evidence, policy });
```

The SDK should return the same canonical package structure used by CLI/API.

### 8.3 API

The API should expose package production, not invent a separate SaaS object model.

Conceptual endpoints:

```text
POST /v1/assessments
GET  /v1/assessments/{id}
POST /v1/assessments/{id}/verify
GET  /v1/policies/{id}
```

No API is justified until an external integration or repeated internal workflow requires it.

---

## 9. Domain Packs

A Domain Pack prevents the generic engine from becoming abstraction-heavy to users.

A Domain Pack should contain:

```text
domain vocabulary
claim templates
evidence profile / adapter expectations
policy profiles
human explanations
unit conventions
example cases
explicit domain non-claims
```

### First legitimate Domain Pack

**Energy Claim Pack**

Possible claim templates, limited to what current evidence/rules can honestly support:

```text
surplus-backed quantity
energy-evidence-backed quantity
policy-constrained admitted quantity
settlement/shortfall scenario
```

Do not claim support for unrelated carbon, RWA, subsidy, procurement, or compliance domains merely because the core is abstract enough to imagine them.

A second Domain Pack is justified only when real external evidence + real rules + a real use case demonstrate it.

---

## 10. Research packaging

The research package should be a **benchmark/reproduction kit**, not a repackaged SaaS UI.

Suggested structure:

```text
Policy Lab Benchmark / Research Kit
│
├── METHOD.md
├── CASES/
│   ├── controlled cases
│   └── PUB-AUSGRID-001P
├── EVIDENCE/
├── POLICIES/
├── EXPECTED-ASSESSMENTS/
├── SCHEMAS/
├── VERIFY/
└── CITATION.cff
```

External research job:

> Clone/download the kit, execute a case under a declared policy, reproduce the expected decision and assessment identity, then change one declared condition and report the resulting boundary/decision difference.

This gives researchers something they can cite and extend without understanding the entire historical SolarPunk repository.

---

## 11. Institutional package — later only

Do not build this now.

If repeated external use proves demand, an institutional package could add:

```text
private evidence connectors
policy registry
version/change approval
role-based access
case history
review / sign-off workflow
private deployment
retention controls
organization-specific report templates
support / SLA
```

These are commercial/institutional wrappers around the same assessment core.

They are not current evidence of product-market fit.

---

## 12. Commercial architecture

Because the repository core is public/MIT, commercialization should not depend on artificial exclusivity over the existing code.

Potential value capture should come from the costly things around the open core:

```text
assisted assessment work
hosted execution
private evidence connectors
organization-specific policy integration
policy maintenance / change management
deployment / support
team workflow / access controls
verification infrastructure
custom domain packs where rights permit
institutional research contracts
```

The portable package and verifier should remain sufficiently open that trust does not depend on an opaque service.

### Recommended conversion ladder

```text
OPEN RESEARCH CORE
        ↓
PORTABLE CLAIM ASSESSMENT PACKAGE
        ↓
ASSISTED EXTERNAL ASSESSMENT
        ↓
REPEAT USE OF SAME WORKFLOW?
        ├── no → keep service/research form
        └── yes
             ↓
HOSTED WORKBENCH / API
             ↓
REPEATED ORGANIZATIONAL INTEGRATION?
        ├── no → stop
        └── yes
             ↓
ENTERPRISE / SELF-HOST / POLICY MANAGEMENT
```

Do not skip directly to subscriptions, accounts, billing, marketplace, or enterprise controls.

---

## 13. What is open vs potentially monetizable

### Keep open / verifiable by default

```text
canonical package schema
core deterministic semantics
public verifier
public benchmark cases
public example policy packs
research projection
reproduction tooling necessary to verify public claims
```

### Potentially monetizable if external demand exists

```text
hosted execution
private evidence ingestion/connectors
customer policy implementation
organization-specific workflows
private case storage
review/approval workflows
premium support / deployment
managed policy/version operations
commercial domain packs built from lawfully usable inputs
```

This separation preserves credibility while leaving commercial room.

---

## 14. Packaging tests

A package should fail the packaging experiment if an external user must read CL, ECI, SPK history, or the repository architecture before using it.

### Test A — 30-second comprehension

Can a new user answer:

```text
What claim was tested?
What happened?
Why?
What would change it?
```

without reading research documentation?

### Test B — independent transfer

Can person A produce a package and person B inspect/verify it without person A's UI session?

### Test C — typed non-promotion

Can the package remain useful while clearly preserving:

```text
L0 evidence ≠ trusted source truth
admission ≠ legal authority
settlement scenario ≠ enforceable redemption
R3 mechanism ≠ R4 monetary performance
```

### Test D — machine reuse

Can CLI, SDK, API, viewer, and report all consume the same canonical package rather than translating among competing internal formats?

### Test E — commercial learning

Can an assisted external assessment teach us something about willingness to use/pay without requiring new core functionality?

---

## 15. What not to build now

Do not build:

- generic multi-domain claims;
- marketplace;
- accounts / billing;
- AI assistant;
- enterprise RBAC;
- legal/compliance certification claims;
- new token/settlement functionality;
- arbitrary policy-authoring GUI;
- API gateway;
- plugin marketplace;
- certification programme;
- standards-body branding.

None of these are required to test whether the packaging works.

---

## 16. First external packaging experiment

Use only the existing `PUB-AUSGRID-001P` evidence and frozen policies.

Produce three artifacts from the unchanged core:

```text
1. claim-assessment-package.json
2. claim-assessment-report.md (or later PDF)
3. verify command / reproduction instructions
```

The experiment should demonstrate both existing policy consequences:

```text
same outside evidence
→ open research policy
→ ADMIT_WITH_LIMIT
→ 33.066 kWh

same outside evidence
→ stricter pilot policy
→ BLOCKED
→ SIGNED_EVIDENCE + MIN_PROVENANCE
```

The point is not to create a better demo page.

The point is to determine whether an external person can receive the package and understand:

> what is supportable, what is not, why, and what evidence would be needed next.

---

## 17. Stop rule

The packaging work is successful when one current case can be converted into a portable, independently inspectable external assessment without changing the core truth.

After that, **stop internal packaging expansion and seek external use**.

A new package layer is justified only by:

- a real researcher trying to reproduce or extend a case;
- a real evaluator asking for a different artifact;
- a real operator providing evidence;
- a real integrator needing machine access;
- a real buyer/workflow revealing repeated use;
- a demonstrated packaging or verification defect.

Otherwise:

> **Do not build more packaging. Use the package.**
