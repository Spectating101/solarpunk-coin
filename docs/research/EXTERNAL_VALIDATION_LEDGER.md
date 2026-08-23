# Policy Lab External Validation Ledger

**Status:** active evidence register for external use, evaluation, reproduction, and pilot signals  
**Scope:** Policy Lab public deployment and externally observed evidence only  
**Does not change:** research-boundary status, source assurance, conformance level, policy values, deterministic decision semantics, or Gauntlet scores by itself

## Purpose

This ledger records evidence created only after Policy Lab leaves internal evaluation and is used, challenged, reproduced, or proposed for use by people outside the core development loop.

The purpose is not to accumulate testimonials or page-view counts. The purpose is to preserve auditable evidence of whether outsiders can understand the lab, reproduce its claims, identify failures, contribute a bounded external case, or demonstrate real reuse.

A deployment event is not validation. A visitor is not adoption. A positive comment is not a pilot.

## Evidence classes

| Class | Meaning | Examples |
|---|---|---|
| `E0_TRAFFIC` | exposure only | page visit, referral, link click |
| `E1_COMPREHENSION` | independent user completes the intended investigation and correctly states the result | guided evaluation task, correct stopping-point explanation |
| `E2_CRITIQUE` | substantive external challenge identifies a real ambiguity, defect, or research issue | filed issue, written evaluator criticism |
| `E3_REPRODUCTION` | outsider independently reproduces a bounded result or verifies a release artifact | deterministic replay, assessment verification |
| `E4_REUSE` | outsider uses Policy Lab, its schemas, objects, or method for a new bounded task | fork, cited method, adapted case |
| `E5_EXTERNAL_CASE` | attributable outside evidence enters the registered case path with source limitations preserved | owner/operator export, institutional dataset with factual review |
| `E6_PILOT` | outside party agrees to a defined evaluation or operational pilot | written pilot scope, scheduled institutional test |
| `E7_REPEAT_USE` | outside party returns to reuse the system after the first evaluation | second case, repeated analysis, recurring institutional use |

These classes are ordinal only as an evidence vocabulary. They are not a maturity score and must not be mapped automatically onto R1–R4, L0–L4, C0–C4, or Gauntlet dimensions.

## Entry format

Add one entry per meaningful external interaction.

```text
ID:
Date:
Release / commit evaluated:
Evaluator class: research | policy | finance | energy/data | engineering | general | institution | other
Relationship: independent | affiliated | unknown
Public attribution permitted: yes | no | partial
Evidence class: E0_TRAFFIC | E1_COMPREHENSION | E2_CRITIQUE | E3_REPRODUCTION | E4_REUSE | E5_EXTERNAL_CASE | E6_PILOT | E7_REPEAT_USE

Task attempted:
Outcome:
Result reproduced or verified:
Primary criticism or failure:
Action taken:
Linked issue / PR / artifact / correspondence reference:
Research-boundary effect: none unless separately established
Source-assurance effect: none unless separately established
Gauntlet relevance: descriptive only; score changes require a separate audited profile update
```

## Current baseline

As of the G4 public-evidence release posture, the project has strong internal technical and reproducibility evidence but limited external-use evidence. The canonical public-source case `PUB-AUSGRID-001P`, the G4 hostile audit, the Constrained Claim Assessment, and C0–C2 conformance remain internal/project-generated evidence unless an independent evaluator subsequently reproduces or challenges them.

The first external-validation tranche should therefore prioritize:

1. independent comprehension;
2. independent reproduction;
3. substantive critique;
4. one attributable outside case or bounded institutional evaluation;
5. repeat use if it emerges naturally.

## Promotion rule

An entry may support a future claim only when the underlying evidence is inspectable and the wording does not exceed what happened.

Examples:

- `three visitors opened the site` → exposure only;
- `one independent researcher completed the canonical investigation and correctly explained why the stricter policy blocks` → comprehension evidence;
- `one external developer reproduced the assessment identity from the archived release` → reproduction evidence;
- `an energy-data holder supplied an attributable export that passed the registered intake path` → external-case evidence, with assurance determined separately;
- `an institution asked for a demonstration` → interest, not a pilot;
- `an institution agreed in writing to evaluate a defined workflow` → pilot evidence.

## Privacy rule

Do not record personal data that is unnecessary to substantiate the evidence. Public entries may use role/class labels instead of names unless attribution is explicitly permitted. Never record private keys, access tokens, customer-identifying energy data, confidential commercial terms, or private correspondence verbatim.

## Gauntlet use boundary

This ledger can become source evidence for a future Gauntlet profile revision, but the revision must remain separate and auditable.

A valid sequence is:

```text
external event
→ ledger entry + inspectable evidence
→ independent interpretation of what dimension changed
→ explicit Gauntlet manifest/profile revision
→ rerun simulator
```

The invalid sequence is:

```text
deployment
→ desired higher score
→ retroactive interpretation of traffic as validation
```

Policy Lab must not be enlarged or its evidence relabeled merely to improve a simulated route score.
