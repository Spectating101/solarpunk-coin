# Policy Lab — P0 Portable Assessment Packaging Audit

**Status:** hostile packaging audit after first successful P0 execution  
**Scope:** external package semantics and recipient usability only  
**Runtime boundary:** no Policy Lab core, policy value, evidence value, settlement rule, or research result is reopened by this audit

---

## Verdict

> **P0 ENGINE / DERIVATION: PASS**  
> **P0 EXTERNAL PACKAGE: NOT YET FROZEN**

The first live package proves that a portable assessment object can be deterministically derived from the existing closed `PUB-AUSGRID-001P` artifact set without rewriting the Policy Lab core.

The package also survives closed-artifact verification and byte-identical rebuilding.

That validates the **portable-object architecture**.

It does **not** yet validate the current v0 object as the final external contract. The first generated package exposed several packaging defects that would matter to a recipient who does not already understand the repository.

---

## What survived contact with a real package

### P0-P1 — one canonical object can feed human and machine use

PASS.

The human Markdown is rendered from the same machine-readable package that is independently verified. This prevents a presentation layer from silently inventing a different result.

### P0-P2 — policy divergence is a compelling package-level object

PASS.

The same evidence object produces:

```text
LAB-CASE-OPEN-004
→ ADMIT_WITH_LIMIT
→ 33.066 ENERGY_CLAIM_UNIT
→ EVIDENCE_BACKED_CAPACITY binds

ENERGY-CASE-PILOT-005
→ BLOCKED
→ SIGNED_EVIDENCE
→ MIN_PROVENANCE
```

That comparison is more useful externally than exposing the repository's internal execution graph first.

### P0-P3 — evidence quantity and policy claim quantity can remain typed separately

PASS.

The package preserves:

```text
source evidence quantity: 33.066 kWh
policy-defined admitted quantity: 33.066 ENERGY_CLAIM_UNIT
```

The equality in this case comes from the declared evidence-backed rate of 1. It is not silently described as a physical-unit identity, legal title, certificate, or directly metered export.

### P0-P4 — delivery/run identities can be separated from semantic package identity

PASS as a design direction.

Receipt/capsule identities remain available for delivery verification but are excluded from the package's semantic identity body because those run-specific artifacts can change while the underlying assessment does not.

### P0-P5 — packaging did not require core enlargement

PASS.

The experiment is a derived layer over frozen case, evidence, policy, decision, settlement, receipt, capsule, and research-assessment artifacts.

---

# Findings requiring correction before freeze

## H1 — `SUPPORTED_WITH_LIMIT` overstates the authority of the open research policy

**Severity:** HIGH

The canonical runtime result is correctly preserved as:

```text
ADMIT_WITH_LIMIT
```

But the human-facing translation currently renders this as:

```text
SUPPORTED_WITH_LIMIT
```

That wording is too strong when the policy itself is explicitly a research-only demonstration policy.

A result can be admitted **under a declared research policy** without the real-world claim being substantively supported for external assertion.

### Correction

The package needs an explicit policy scope / authority class, for example:

```text
RESEARCH_DEMONSTRATION
PILOT_INTERNAL
EXTERNAL_STANDARD
REGULATORY
ORGANIZATION_POLICY
```

Only classes actually evidenced should be used.

For the current case, the human rendering should say something closer to:

```text
ADMITTED WITH LIMIT UNDER RESEARCH POLICY
```

while retaining the canonical `ADMIT_WITH_LIMIT` value.

Do not promote a research policy consequence into an externally supported claim.

---

## H2 — the v0 schema is energy/Ausgrid-shaped but is named as a generic claim-assessment package

**Severity:** HIGH

The package currently requires fields such as:

```text
interval_count
archive_sha256
archive_bytes
eligible_quantity
assurance L0-L4
settlement
```

Those are appropriate for the first energy-linked case profile, but they are not a neutral model of every evidence-backed claim.

### Correction

Do not generalize from one case.

The next version should explicitly distinguish:

```text
Claim Assessment Envelope
        +
Domain Profile: energy-linked claim v0
```

or equivalently add an explicit profile identifier.

The first public profile may remain energy-specific. A generic cross-domain schema should not be declared until another genuinely different domain forces the abstraction.

---

## H3 — research projection is currently mandatory in the external package

**Severity:** HIGH

`R1–R4` is valuable for the research package but is not a natural requirement for every operator, integrator, reviewer, or buyer.

Making `research_projection` mandatory couples the external object to the current academic framework.

### Correction

Keep the exact `ConstrainedClaimAssessment` as an optional, typed extension/reference.

A valid operational package should remain valid when no research projection is requested.

Research distributions can require the extension; operational integrations should not have to.

---

## H4 — remediation is partly hand-written from calculator IDs

**Severity:** HIGH

The current package maps blockers such as `SIGNED_EVIDENCE` and `MIN_PROVENANCE` to hand-written remediation strings.

This is understandable for P0, but it creates a second source of policy meaning outside the policy/evaluation artifacts.

The underlying `DecisionResult` already provides structured rule evaluation, including:

```text
calculator_id
policy_rule_id
status
observed_inputs
parameters
explanation
boundary
evaluation_id
```

### Correction

Canonical package meaning should come from the structured rule evaluation.

A future human remediation sentence may be generated from that structure, but it must be explicitly presentation/advisory text rather than a second policy authority.

At minimum expose the failed rule evaluation and required/observed values directly.

---

## H5 — one package ID currently mixes decision semantics with explanatory prose

**Severity:** MEDIUM-HIGH

The current package identity includes fields such as:

```text
claim.statement
artifact_contract
next_evidence_required
explicit_non_claims
```

Changing explanatory wording can therefore change the package ID even when claim inputs, evidence, policy, decision, and settlement are identical.

That is valid for a content hash, but weak as the only external assessment identity.

### Correction

Separate two identities if external use requires stable referents:

```text
assessment_id
= semantic decision identity

package_content_id
= exact serialized package/content identity
```

Do not solve this by removing explanatory boundaries. Split the identities instead.

The existing research assessment already demonstrates the value of identity that is independent of run-specific packaging.

---

## H6 — the human report still assumes repository literacy

**Severity:** MEDIUM-HIGH

The first report exposes:

- `ENERGY_CLAIM_UNIT` prominently;
- raw policy IDs before policy purpose;
- R1–R4 in the primary report;
- eleven explicit non-claims;
- UTC timestamps that make the local 1 July window begin on 30 June when read naively.

Technically correct is not the same as externally legible.

### Correction

The human rendering should use a layered structure:

```text
1. requested claim / question
2. decision under each named policy and policy scope
3. evidence actually available
4. why blocked / what bound quantity
5. what is required next
6. technical verification appendix
7. research projection appendix when requested
```

The full boundaries must remain available but do not all belong in the first visual layer.

Preserve both local period semantics and canonical UTC instants rather than showing UTC alone.

---

## H7 — the internal claim unit is truthful but not yet externally interpretable

**Severity:** MEDIUM

`ENERGY_CLAIM_UNIT` is correctly preserved from the frozen policy. It must not be silently renamed to kWh.

However, an outside recipient cannot know what the unit means merely from the label.

### Correction

The domain profile should carry the declared unit definition and conversion basis, for example:

```text
claim unit: ENERGY_CLAIM_UNIT
source quantity: kWh derived surplus
declared evidence-backed rate: 1 claim unit / eligible kWh
policy source: LAB-CASE-OPEN-004 v1.0.0
```

The package must continue distinguishing physical evidence quantity from policy-defined claim quantity.

---

## H8 — independent verification still assumes repository-local supporting artifacts

**Severity:** MEDIUM

The current verifier proves package agreement against the full closed case directory and policy files. That is a strong internal test, but it is not yet the minimum portable verification contract.

A recipient of only `claim-assessment-package.json` cannot independently replay the result.

### Correction

P2 must determine the smallest transferable verification bundle, likely some combination of:

```text
claim assessment package
policy manifest(s)
referenced evidence envelope or bounded evidence reference
required context manifests
verifier version / code identity
optional source bytes where distributable
```

Do not bundle everything by default. Determine the minimum from an actual second-party reproduction exercise.

---

# Lower-severity observations

## M1 — duplicated evidence warnings

The current human report repeats some limitations in both short and expanded forms.

This is harmless mechanically but weakens comprehension.

Deduplicate by semantic code rather than raw string equality if the human report is retained.

## M2 — comparative-policy packages are useful but should not become mandatory

P0 benefits from two policies because divergence is the central demonstration.

A future external case may require only one authoritative policy.

The schema should permit one or more evaluations; it should not assume that comparison itself is always the job.

The current array model is compatible with this direction.

## M3 — settlement is correctly nullable

Keep it optional.

Many claim-assessment workflows may end at admission/quantity and have no meaningful settlement stage.

---

# Revised packaging hierarchy after P0

The P0 result strengthens the package-first thesis but narrows what should be frozen:

```text
DETERMINISTIC POLICY LAB CORE
        ↓
CLAIM ASSESSMENT ENVELOPE
        ↓
DOMAIN PROFILE
energy-linked claim v0
        ↓
POLICY EVALUATION(S)
        ↓
OPTIONAL EXTENSIONS
research projection
settlement / fulfilment
delivery verification
        ↓
RENDERINGS
human report / research kit / later machine API
```

The word **optional** matters. The canonical external object should not require every downstream use case to carry the whole research programme.

---

# P0.1 change boundary

If P0.1 is implemented, it should fix packaging semantics only:

1. preserve policy authority/scope and remove the misleading `SUPPORTED_WITH_LIMIT` translation for research-only policy;
2. identify the current package as an energy-domain profile rather than a universal schema;
3. make research projection an optional extension in the package model;
4. expose structured rule-evaluation evidence instead of treating hand-written remediation as canonical;
5. separate semantic assessment identity from exact package-content identity if both are needed;
6. add local-time period semantics and a declared claim-unit definition;
7. simplify the primary human rendering while retaining technical detail in appendices.

Do **not** add:

- new policies;
- new evidence sources;
- API endpoints;
- accounts;
- SaaS infrastructure;
- marketplace/plugin machinery;
- AI;
- new Policy Lab core behavior.

---

## Stop rule

P0 already proves enough to reject one failure mode:

> The packaging idea is **not** blocked by inability to derive a portable, deterministic object from the frozen system.

The remaining question is whether the external contract is clean enough for another person to consume.

Therefore do not enlarge the system.

Fix only the package boundary, then test it with a real recipient / route when available.
