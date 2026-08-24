# Policy Lab Live Validation Runbook

**Status:** bounded operating procedure for the first external-use tranche  
**Scope:** deployment health, evaluator recruitment, evidence capture, and release iteration  
**Does not authorize:** new product ontology, broad backend work, accounts, billing, token changes, AI decision authority, policy retuning, or automatic Gauntlet score changes

## Objective

Use the already-deployed Policy Lab as a research instrument and accumulate external evidence about whether independent users can understand, challenge, reproduce, reuse, or supply evidence to the system.

The objective is not traffic growth by itself.

The first tranche succeeds when the project gains at least one inspectable external result that did not exist before deployment: a correct independent comprehension result, substantive critique, independent reproduction, attributable outside case, or bounded pilot commitment.

## Release posture

Use the current G4 public-evidence profile as the baseline. Preserve:

- the deterministic constraint core;
- frozen case and policy identities;
- `PUB-AUSGRID-001P` as the canonical public outside-data case;
- `ConstrainedClaimAssessment` semantics;
- the R1–R4 / L0–L4 / C0–C4 namespace separation;
- explicit non-claims;
- the existing GitHub Pages deployment unless a concrete operational reason requires migration.

Do not delay evaluation for a custom domain, account system, database, visual rewrite, or analytics vendor.

## Phase 0 — deployment health

Before inviting evaluators:

1. merge a live-deployment smoke test;
2. confirm the public URL loads the current Policy Lab surface;
3. confirm case, assurance, and policy selectors populate;
4. confirm a deterministic decision renders;
5. confirm at least one user state can change;
6. confirm the external evaluation, reproduction, and pilot issue templates are available;
7. record the commit/release under evaluation.

A failed live smoke test is an operational failure, not a research-boundary result.

## Phase 1 — controlled external evaluation

Recruit a deliberately mixed first cohort rather than broadcasting blindly.

Target evaluator classes:

- research / methods;
- finance / policy;
- energy / data provenance;
- engineering / reproducibility;
- general technically literate user.

The first task should require no prior explanation beyond the evaluator brief.

### Canonical task

Ask the evaluator to:

1. open Policy Lab;
2. inspect the public-source outside-data case if exposed in the live interface, otherwise use the canonical guided case and separately inspect the `PUB-AUSGRID-001P` evaluator brief;
3. compare a permissive and stricter declared policy;
4. identify why admission or quantity changed;
5. inspect settlement stress where available;
6. inspect the receipt / lineage / Constrained Claim Assessment;
7. state, in their own words, what Policy Lab demonstrated and what remains untested.

Do not coach the answer.

## Phase 2 — evidence capture

Use `docs/research/EXTERNAL_VALIDATION_LEDGER.md` for meaningful results.

The preferred external record is a GitHub issue using:

- `Policy Lab external evaluation`;
- `Policy Lab reproduction report`;
- `Policy Lab external case / pilot inquiry`.

A private evaluation may be summarized in the ledger only when the summary preserves the evaluator's requested attribution boundary and does not expose confidential information.

### Minimum useful evidence

The following count as meaningful external evidence when independently attributable to the evaluation event:

- evaluator correctly explains the stopping point and non-claims;
- evaluator identifies a substantive defect or ambiguity;
- evaluator reproduces a deterministic result;
- evaluator independently verifies an assessment identity or artifact set;
- outside party proposes a concrete use case with a decision and evidence source;
- source holder offers attributable evidence under defined publication/privacy constraints;
- institution agrees to a bounded evaluation or pilot;
- previous evaluator returns with a second use or case.

Page views and GitHub stars may be recorded separately as reach indicators but must not be promoted into validation or adoption.

## Phase 3 — instrumentation

Instrumentation should answer research questions, not maximize behavioral capture.

Preferred event vocabulary:

```text
lab_opened
case_changed
assurance_changed
policy_changed
settlement_stressed
investigation_opened
receipt_opened
assessment_opened
verification_started
research_opened
replication_clicked
pilot_interest
```

### Privacy boundary

Default implementation requirements:

- manual allowlisted events only;
- no keylogging;
- no form-value capture;
- no raw energy evidence in analytics payloads;
- no wallet address capture;
- no evidence hash capture if it could become a user-linked identifier;
- no session replay in the first tranche;
- no advertising identifier or cross-site tracking requirement;
- document the provider and retention policy before enabling production telemetry.

Analytics integration is optional for the first evaluator cohort. GitHub issues and the external-validation ledger are sufficient to begin.

## Phase 4 — iteration rule

Every proposed change after launch must point to one of:

1. failed live-operability check;
2. repeated comprehension failure;
3. external critique exposing a real semantic or technical defect;
4. reproduction failure;
5. external-case intake requirement that the current registered adapter path cannot satisfy;
6. accessibility or browser failure preventing evaluation;
7. bounded evaluator request that materially improves inspection without enlarging claims.

Do not add features merely because the project is now public.

For each accepted change:

```text
external evidence / failed gate
→ issue
→ bounded fix
→ tests
→ new release / commit
→ re-evaluation where material
→ ledger update
```

## Phase 5 — external-case / pilot gate

The highest-value near-term result remains one attributable outside source or bounded institutional evaluation.

A proposed external case should preserve:

- source identity and permission boundary;
- custody / transformation record;
- actual assurance rather than desired assurance;
- declared policy identity;
- deterministic result;
- receipt / capsule / assessment basis;
- factual review by the source holder where feasible;
- publication redactions agreed before public release.

A correctly blocked external case is still a successful validation result if the block is reproducible and the factual source metadata are confirmed.

## Gauntlet relationship

The live deployment is not performed for the simulator, but genuine results may strengthen future route-selection evidence.

Current weak modeled dimensions are external validation, market adoption, and business viability. A future profile revision may use live evidence only as follows:

| Observed result | Possible dimension relevance |
|---|---|
| independent comprehension / critique | demo clarity, external validation |
| independent deterministic reproduction | external validation, evidence reproducibility |
| outside case supplied and processed | external validation, problem value |
| repeated external reuse | market adoption |
| agreed institutional pilot | external validation, business viability |
| recurring institutional use | market adoption, business viability |

No result changes a score automatically. Update the evidence profile only through a separate audited manifest revision, and preserve the synthetic-simulator non-forecast doctrine.

## First-tranche stop condition

Pause and assess after one of the following happens:

- five substantive independent evaluations;
- two independent reproduction attempts;
- one attributable external-case offer;
- one bounded institutional pilot offer;
- a repeated comprehension failure revealing the flagship experience is not self-explanatory;
- a material reproducibility defect;
- no meaningful external engagement after a deliberate targeted outreach tranche.

At that point, decide from evidence whether the next investment is:

- comprehension / interface correction;
- reproduction hardening;
- external-case adapter work;
- pilot packaging;
- research-software publication preparation;
- or no further development.

## Immediate operating sequence

```text
merge validation tranche
→ confirm public smoke test
→ freeze / identify evaluated release
→ recruit first 3–5 skeptical evaluators
→ collect structured evaluation / reproduction issues
→ enter substantive results in validation ledger
→ fix only evidenced failures
→ pursue one attributable outside case or bounded pilot
→ reassess Policy Lab value and Gauntlet profile from accumulated evidence
```
