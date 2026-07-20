# Research capsule verifier (Gate 4 slice)

**Branch:** `feat/capsule-verifier`  
**Status:** integrity + schema + optional pack replay

## What it does

```bash
npm run case:verify-capsule -- path/to/research-capsule-bundle.json
npm run case:verify-capsule -- path/to/research-capsule-bundle.json --replay-from-pack
```

Example report:

```text
Capsule integrity: PASS
Schema validation: PASS
Decision reproduction: PASS
Expected decision ID: …
Produced decision ID: …
Source-truth certification: NOT CLAIMED
```

## Checks

1. **Integrity** — every `manifest.files[].sha256` matches file bytes  
2. **Schemas** — case / policy / context hash-check; evidence-metadata must not include raw rows  
3. **Decision identity** — `decision_id` equals canonical DecisionResult body hash  
4. **Optional pack replay** — resolve evidence by hash from `protocol/cases/energy-v1`, re-run `evaluateCaseDecision`, compare decision IDs  

## What it deliberately does not claim

Reproduction proves **deterministic evaluation of declared portable objects**.  
It does **not** prove physical meter truth, custody, or legal redemption.

Capsules exclude raw evidence rows. Full replay therefore needs `--replay-from-pack` (or a future external evidence sidecar).

## Library API

```js
import {
  verifyResearchCapsuleBundle,
  formatCapsuleVerificationReport,
} from '@solarpunk/constraint-core/workbench';
```

## Tests

```bash
node --test packages/constraint-core/test/capsule-verify.test.mjs
```
