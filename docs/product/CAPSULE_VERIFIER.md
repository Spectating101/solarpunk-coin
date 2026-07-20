# Research capsule verifier (Gate 4 slice)

**Status:** closed-world v1 integrity, schema, identity, privacy, and optional committed-pack replay

## Commands

```bash
npm run case:verify-capsule -- path/to/research-capsule-bundle.json
npm run case:verify-capsule -- path/to/research-capsule-bundle.json --replay-from-pack
npm run case:verify-capsule:test
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

## Closed-world v1 verification

A v1 bundle must contain exactly:

- `capsule.json` as the manifest copy;
- the 12 portable files declared by `manifest.files`.

The verifier rejects missing files, duplicate or omitted declarations, undeclared extra files, digest mismatches, byte-length mismatches, a mismatched manifest copy, or an invalid `capsule_id`.

## Structural and identity checks

The verifier validates and reconciles:

1. bundle and capsule schemas;
2. case, policy, context, DecisionResult, and receipt structures;
3. evidence metadata, lineage, reproduction, RO-Crate, PROV-JSONLD, memo, and citation structures;
4. canonical `decision_id` hashing;
5. case and policy identities across manifest, decision, receipt, and reproduction;
6. evidence hashes and context references across all portable objects;
7. assurance scenario and runtime source revision;
8. the declared privacy boundary and absence of raw interval rows.

A self-consistent set of newly re-hashed files is still rejected when those objects disagree with each other.

## Optional committed-pack replay

`--replay-from-pack` resolves the capsule's evidence, contexts, assurance scenario, and committed case from `protocol/cases/energy-v1`, reruns `evaluateCaseDecision`, and compares the produced decision identity with the capsule.

Because capsules exclude raw evidence rows, replay requires the referenced evidence to be available from the supplied pack. A future verifier may accept an external evidence sidecar under a separate trust boundary.

## Verification boundary

A PASS establishes internal consistency and deterministic reproducibility of the declared objects. It does **not** establish:

- physical meter truth;
- operator identity or custody;
- external corroboration;
- legal claim authority;
- mint authority;
- redemption rights.

The report therefore always states `Source-truth certification: NOT CLAIMED`.

## Library API

```js
import {
  verifyResearchCapsuleBundle,
  formatCapsuleVerificationReport,
} from '@solarpunk/constraint-core/workbench';
```

## Adversarial tests

The test suite covers successful replay plus file tampering, omitted digest declarations, undeclared files, malformed manifest copies, cross-object identity drift, malformed schemas, missing files, and missing bundles.
