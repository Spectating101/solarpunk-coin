# Public Conversion Playbook

**Purpose:** convert the implemented case workbench from a strong repository into a public, citable, externally reviewable research-software artifact.

This document is about **conversion**, not new product features.

---

## 1. Conversion objective

The public artifact should make three things obvious within five minutes:

1. the project has a coherent research question;
2. the decision engine is deterministic and inspectable;
3. the current field boundary is one real external evidence case.

The public description is:

> A case-based research workbench for investigating what blocks admission, what bounds financial quantity, and what fails at settlement.

The system should be demonstrated through a case, not through a list of repository modules.

---

## 2. Primary public demonstration

Use one fixed five-minute walkthrough.

### Step 1 — blocked admission

Open:

```text
TYN-001
L0 assurance scenario
ENERGY-CASE-PILOT-005
```

Show:

```text
BLOCKED
MIN_PROVENANCE
required L2
current L0
quantity evaluation NOT EXECUTED
```

Narrative:

> The first question is not how many tokens or claims can be issued. The first question is whether quantity evaluation is allowed to run at all.

### Step 2 — explicit counterfactual

Change only the declared assurance scenario:

```text
L0 → L2
```

Show that:

```text
evidence hash unchanged
decision ID changed
```

Then show:

```text
ADMIT WITH LIMIT
126 ENERGY_CLAIM_UNIT
PROVENANCE_POLICY_CAPACITY binds
```

Narrative:

> The workbench does not silently rewrite evidence. It creates a new declared decision context and a new deterministic decision identity.

### Step 3 — heterogeneous binding rules

Compare:

```text
TYN-001 / L2 / pilot
126
PROVENANCE_POLICY_CAPACITY

AUS-001 / L2 / pilot
283.09811
RESOURCE_CONTEXT_CAPACITY

PHX-001 / open
320
EVIDENCE_BACKED_CAPACITY
```

Narrative:

> A policy result is more useful when the system can explain which rule actually determined the quantity.

### Step 4 — settlement failure

Run the Taoyuan 40% settlement replay.

Show:

```text
outstanding 126
covered 50.4
shortfall 75.6
PARTIAL
```

Narrative:

> Admission and bounded quantity do not prove the obligation can settle. Settlement remains a separate stage.

### Step 5 — receipt

Open the decision receipt and lineage.

Show:

```text
case ID
evidence hash
context identity
policy ID/version/hash
calculator identities
decision ID
blocking / binding attribution
runtime/source revision
```

Narrative:

> The shareable artifact is the decision receipt, not a screenshot of a dashboard.

---

## 3. Public README rule

The README should lead with:

```text
research question
five-minute investigation
actual decision semantics
trust boundary
```

Do not lead with:

```text
smart contracts
package list
architecture inventory
token language
historical development chronology
```

Those remain available after the research method is understood.

---

## 4. Static publication sequence

The workbench is static-host compatible.

Publication sequence:

```text
merge V1 baseline
      ↓
retarget / rebase V2 onto main
      ↓
run exact-head CI
      ↓
run 15-state Chromium walkthrough
      ↓
merge V2
      ↓
publish static site
      ↓
verify live routes and deterministic signature outcomes
```

Live routes to smoke-test:

```text
#cases
#case/TYN-001
#compare
#receipts
#runs
#overview
#sepolia
```

Do not deploy new contracts as part of static publication.

---

## 5. Release artifact

After the public static site is verified, create a GitHub release.

Recommended release label:

```text
v0.2.0-alpha
```

Recommended release title:

```text
Case Workbench V2 — Initial Public Research Release
```

Release notes should contain:

```text
WHAT THE RELEASE TESTS
WHAT THE THREE CANONICAL CASES ARE
DETERMINISTIC SIGNATURE OUTCOMES
PUBLIC / PRIVATE DATA BOUNDARY
NOT CLAIMED
VALIDATION SUMMARY
NEXT FIELD GATE
```

Attach or link:

```text
static site build artifact
15-screen visual review artifact
research capsule example
```

Do not call the release `production` or `stable`.

---

## 6. Citation and archival path

The repository contains a root `CITATION.cff`.

Once that file is on the default branch, GitHub can expose a repository citation action.

After the V2 release:

1. connect the GitHub repository to Zenodo;
2. enable the repository in Zenodo's GitHub integration;
3. create the GitHub release;
4. verify the release is ingested and archived;
5. record the resulting DOI in `CITATION.cff`;
6. update the release notes and README citation section;
7. tag the archived software version consistently.

A DOI should identify the released software artifact. It does not convert the workbench into a peer-reviewed paper.

---

## 7. Research positioning

The workbench should not be marketed as a generic rules engine.

Current defensible research position:

> A research instrument for testing how explicit evidence and versioned policy rules produce blocked, capacity-limited, and settlement-constrained financial decisions, with blocking/binding attribution and deterministic decision receipts.

Energy-linked digital finance is the first serious reference domain because it exposes four different semantics:

```text
modeled resource context
observed / controlled evidence
evidence assurance
settlement capacity
```

The market-capacity study is a separate empirical demonstration of capacity-versus-failure trade-offs and binding attribution.

### Adjacent research themes

The system is relevant to work on:

```text
auditability
research provenance
policy-as-code
stress replay
high-stakes decision traceability
trustworthy financial AI infrastructure
```

Do not claim the current system is itself an AI decision engine.

A future AI assistant may use the deterministic case / decision / receipt layer as a governed substrate, but that is outside the initial release.

---

## 8. External validation target

The next field-value target is exactly one real evidence case.

Preferred target:

```text
real inverter / gateway export
trusted named operator context
signed or attributable source path
explicit measurement window
```

Success means:

```text
real external source
      ↓
existing adapter / bounded new adapter
      ↓
EvidenceEnvelope
      ↓
real provenance classification
      ↓
CaseManifest
      ↓
V2 policy decision
      ↓
DecisionReceipt
```

The external case does not need to be a commercial launch.

One cooperative operator, university facility, rooftop owner, inverter administrator, or research partner is enough to test whether the evidence architecture survives contact with a real source.

### Outreach ask

Do not ask:

> Will you pilot my energy-backed cryptocurrency?

Ask:

> I built a public research workbench that tests how evidence quality and explicit policy rules bound an energy-linked financial claim. The current public cases use controlled evidence fixtures. I am looking for one historical inverter or gateway export to run as an external research case. Raw data can remain local/private; the public artifact can retain only source metadata, hashes, aggregate decision inputs, and the resulting receipt.

---

## 9. Portfolio conversion

The project should not appear on a CV as:

> Built an energy-backed cryptocurrency.

Preferred project title:

```text
Policy Lab / Energy Standard Case Workbench
```

This is a descriptive CV label, not a permanent product rename.

Preferred one-line description:

> Built a deterministic research workbench that normalizes evidence, versions policy rules, separates admission from quantity and settlement constraints, attributes binding limits, replays stress scenarios, and emits reproducible decision receipts.

Preferred technical bullet:

> Designed portable JSON-schema objects and a shared Node/browser decision engine for case, context, typed constraint evaluation, deterministic decision identity, bounded claim creation, and explicit settlement shortfall.

Preferred empirical bullet:

> Published an aggregate market-capacity policy study over a 777,764-security-day licensed CRSP/Refinitiv source package; compared common-sample capacity policies, attributed binding volatility/liquidity constraints, and kept severe stress failure visible without redistributing licensed rows.

Preferred product bullet:

> Built a React case workbench with linked case exploration, case × policy comparison, counterfactual assurance forks, stress replay, lineage, and decision/capsule export; validated with deterministic core tests, frontend tests, production build, and scripted desktop/mobile Chromium review.

---

## 10. Interview demonstration

Use the five-minute case walkthrough.

Do not begin with the thesis history.

Opening:

> I was working on an energy-linked finance thesis and found that the hard problem was not token issuance. It was deciding what evidence and constraints had to bind before a financial quantity was allowed to exist. I turned that into an executable case workbench.

Then demonstrate:

```text
blocked TYN
      ↓
L2 counterfactual
      ↓
126 provenance-bound
      ↓
compare AUS / PHX binding differences
      ↓
40% settlement shock
      ↓
receipt
```

Close with:

> The current limitation is deliberate: the energy case pack uses controlled fixtures and modeled resource context. The next field gate is one real operator evidence source. I preferred to expose that missing evidence rather than hide it behind a token or an AI explanation layer.

---

## 11. Conversion stop rule

Do not delay public release for:

```text
AI assistant
more locations
H3 / GIS infrastructure
new blockchain contracts
team accounts
billing
cloud evidence storage
new policy families
```

After publication, the only pre-external-validation product feature with clear value is:

```text
IMPORT EVIDENCE
      ↓
NORMALIZE
      ↓
CREATE LOCAL CASE
      ↓
RUN V2 DECISION
```

Even that should follow the public release rather than block it.

---

## 12. Conversion sequence

```text
PUBLIC V2
      ↓
CITABLE RELEASE
      ↓
THESIS INTEGRATION
      ↓
JOB / RESEARCH DEMO
      ↓
ONE EXTERNAL EVIDENCE CASE
      ↓
REASSESS
```

The project should now encounter external review before another major architecture phase begins.
