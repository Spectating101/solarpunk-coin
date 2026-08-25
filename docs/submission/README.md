# Policy Lab Submission Package

This directory contains the **judge-facing packaging layer** for suitable competitions, research-software calls, and application routes.

It is deliberately downstream of executable truth.

Do not use these documents to override `CURRENT_SURFACE.json`, the machine-observed public evidence checkpoint, executable policies, schemas, or the frozen Gauntlet route-selection gates.

## Start here

1. [`POLICY_LAB_GAUNTLET_MASTER.md`](./POLICY_LAB_GAUNTLET_MASTER.md) — master problem/pitch/novelty/evidence narrative.
2. [`POLICY_LAB_JUDGE_DEMO_AND_QA.md`](./POLICY_LAB_JUDGE_DEMO_AND_QA.md) — 10-second hook, 30/90-second demos, technical Q&A and prohibited claims.
3. [`POLICY_LAB_ROUTE_ADAPTERS.md`](./POLICY_LAB_ROUTE_ADAPTERS.md) — route-specific framing and FIRE/HOLD/CONDITIONAL doctrine.
4. [`POLICY_LAB_SUBMISSION_READINESS.md`](./POLICY_LAB_SUBMISSION_READINESS.md) — required assets and remaining submission gaps.
5. [`benchmark/gauntlet/submission-package.v1.json`](../../benchmark/gauntlet/submission-package.v1.json) — machine-bound judge facts.
6. [`scripts/validate_gauntlet_submission_package.mjs`](../../scripts/validate_gauntlet_submission_package.mjs) — anti-inflation validation against current machine evidence.

## Current central pitch

> **If a financial claim says real-world evidence backs it, Policy Lab makes it prove exactly how much that evidence can justify.**

The supporting problem frame is:

> **Real-world data is increasingly used to authorize financial value, but the rule that turns evidence into authority is often hidden. Policy Lab makes that conversion explicit, bounded and reproducible.**

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

The Gauntlet CI workflow also runs this validator before the frozen route simulator.

## Current packaging boundary

The next useful submission work is **visual assets and a frozen release candidate**, not another core subsystem.

External validation remains open and is especially important for fintech/commercialization-heavy routes, but lack of a pilot does not prevent preparation of a truthful submission package for routes where packaging and technical/research evidence carry more weight.
