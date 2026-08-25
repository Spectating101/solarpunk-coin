# Policy Lab Submission Package

This directory contains the **judge-facing packaging layer** for suitable competitions, research-software calls, and application routes.

It is deliberately downstream of executable truth.

Do not use these documents to override `CURRENT_SURFACE.json`, the machine-observed public evidence checkpoint, executable policies, schemas, or official current opportunity rules.

## Start here

1. [`POLICY_LAB_GAUNTLET_MASTER.md`](./POLICY_LAB_GAUNTLET_MASTER.md) — master problem/pitch/novelty/evidence narrative.
2. [`POLICY_LAB_JUDGE_DEMO_AND_QA.md`](./POLICY_LAB_JUDGE_DEMO_AND_QA.md) — 10-second hook, 30/90-second demos, technical Q&A and prohibited claims.
3. [`POLICY_LAB_ROUTE_ADAPTERS.md`](./POLICY_LAB_ROUTE_ADAPTERS.md) — route-specific framing and FIRE/HOLD/CONDITIONAL doctrine.
4. [`POLICY_LAB_SUBMISSION_READINESS.md`](./POLICY_LAB_SUBMISSION_READINESS.md) — required assets and remaining submission gaps.
5. [`innoserve-2026/README.md`](./innoserve-2026/README.md) — first live 2026 application package, official-rule verified.
6. [`benchmark/gauntlet/submission-package.v1.json`](../../benchmark/gauntlet/submission-package.v1.json) — machine-bound judge facts and verified-opportunity overrides.
7. [`scripts/validate_gauntlet_submission_package.mjs`](../../scripts/validate_gauntlet_submission_package.mjs) — anti-inflation validation against current machine evidence.

## Current central pitch

> **If a financial claim says real-world evidence backs it, Policy Lab makes it prove exactly how much that evidence can justify.**

The supporting problem frame is:

> **Real-world data is increasingly used to authorize financial value, but the rule that turns evidence into authority is often hidden. Policy Lab makes that conversion explicit, bounded and reproducible.**

## First verified live target: InnoServe 2026

Official rules were rechecked on 2026-08-25 rather than inherited from the frozen synthetic simulator.

Current route decision:

```text
Information Application (IP)           FIRE PRIMARY
International Exchange - English (IC)  FIRE SECONDARY
Industry AI Innovation (ADIAI)         DO NOT PURSUE CURRENT
```

ADIAI is no longer treated as the preferred InnoServe route because the official 2026 track expects an actual AI application contribution. Current Policy Lab is strongest as deterministic audit/constraint infrastructure; adding an LLM wrapper solely for eligibility would be semantic-fit inflation.

The InnoServe package already contains:

- verified deadline/eligibility/required-asset checklist;
- Chinese IP system-overview content master;
- English IC system-overview content master;
- three-minute English video script;
- rubric-specific positioning.

## Current submission proof

The canonical public proof is `PUB-AUSGRID-001P`:

```text
outside Ausgrid data · actual L0 · 336 intervals

open policy
→ ADMIT_WITH_LIMIT
→ 33.066 kWh

same evidence, pilot policy
→ BLOCKED
→ SIGNED_EVIDENCE + MIN_PROVENANCE

40% settlement
→ PARTIAL
→ 13.2264 covered / 19.8396 shortfall

integrity / schema / decision reproduction
→ PASS
```

Do not promote this into operator validation, physical meter certification, legal issuance, market adoption, or monetary performance.

## Validation

Run:

```bash
node scripts/validate_gauntlet_submission_package.mjs
```

The Gauntlet CI workflow also runs this validator before the frozen route simulator. Current verified official-rule overrides are allowed to supersede stale opportunity assumptions in the frozen simulator for actual submission selection; the historical simulation outputs remain unchanged for reproducibility.

## Visual assets

The submission-assets workflow generates four deterministic judge-facing screenshots:

1. outside-data checkpoint;
2. expanded proof and research boundaries;
3. settlement shortfall;
4. decision-lineage verification.

The workflow now runs on qualifying pushes to `main` as well as PRs, so a final submission can use screenshots generated from a real repository revision rather than a synthetic PR merge commit.

## Current packaging boundary

The project does **not** need another core subsystem to become more submit-able.

For InnoServe, remaining work is administrative/presentation conversion: faculty advisor/team identity, official Word-template formatting, consent/enrollment documents, team photo, and recording/uploading the three-minute video.

External validation remains open and is especially important for fintech/commercialization-heavy routes, but lack of a pilot does not prevent a truthful IP/IC InnoServe submission.
