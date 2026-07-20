# @solarpunk/constraint-core

Public-alpha protocol kernel for turning physical-resource evidence into explicit, bounded claim decisions.

This package generalizes the strongest machinery already present in SolarPunk beyond SPK. SPK remains a reference application and thesis artifact; it is not the protocol abstraction.

## Core model

```text
SOURCE CUSTODY RECEIPT
      ↓
SOURCE EVIDENCE
      ↓
NORMALIZE
      ↓
VERIFY / DIAGNOSE
      ↓
PROVENANCE CLASSIFICATION
      ↓
POLICY EVALUATION
      ↓
BOUNDED CLAIM
      ↓
SETTLEMENT RESULT
```

Every stage should produce reasons that can be shown to a reviewer or consumed by software.

## Custody-first operator intake

Real-source processing begins before normalization. `@solarpunk/constraint-core/operator-intake` binds an owner/operator-supplied file to:

- immutable SHA-256 identity;
- declared custodian relationship;
- acquisition method and custody statement;
- publication permission;
- measurement window and sign convention;
- device metadata;
- referenced but unverified artifacts.

```js
import {
  buildOperatorSourceReceipt,
  verifyOperatorSourceReceipt,
} from '@solarpunk/constraint-core/operator-intake';

const receipt = await buildOperatorSourceReceipt({
  sourceText: privateCsvText,
  filename: 'operator-export.csv',
  manifest: sourceManifest,
  generatedAt: '2026-07-20T01:00:00Z',
});

const verification = await verifyOperatorSourceReceipt({
  receipt,
  sourceText: privateCsvText,
  manifest: sourceManifest,
});
```

The receipt excludes raw rows and always defaults to `PROVENANCE-L0-BASE`. Self-authored profile fields, local signatures, and referenced filenames cannot automatically promote evidence to L1–L4.

CLI:

```bash
npm --prefix packages/constraint-core run operator-intake -- \
  --source=/private/operator-export.csv \
  --manifest=/private/operator-source-manifest.json \
  --out=state/private/operator-source-receipt.json
```

## Adapters in alpha

- generic interval CSV
- Green Button / utility interval CSV
- cumulative meter/inverter snapshot pair
- Fronius PowerFlow JSON pair
- signed meter-reading attestation inspection

Live LAN polling, private-key signing, meter onboarding, and authoritative mint operations remain operator-side. The browser alpha intentionally does not receive private keys or claim physical truth.

## Signed evidence semantics

Signed readings are inspected record by record. Invalid or duplicate rows are rejected. If valid accepted attestations remain, rejected input rows are recorded separately and do not automatically invalidate the accepted evidence subset.

Cryptographic validity against a browser-supplied registry does not establish trusted operator provenance. The provenance classifier requires a trusted operator context before L1+.

## Policy model

The core exposes first-class policy manifests and deterministic policy evaluation. The same evidence can be tested against several policies.

Bundled examples:

- `LAB-OPEN-001`: public-lab illustration; L0 accepted; never live mint authority
- `ENERGY-PILOT-002`: L2 minimum, 30% evidence haircut, bounded pilot claim
- `ENERGY-STRICT-003`: L4 external corroboration required
- `SPK-ENERGY-001`: SPK retained as one reference application policy

Canonical JSON manifests live in `protocol/policies/`.

Use:

```js
import {
  buildEvidenceEnvelope,
  classifyProvenance,
  comparePolicies,
  createClaimManifest,
  normalizeCumulativePair,
} from '@solarpunk/constraint-core';

const normalized = normalizeCumulativePair(startSnapshot, endSnapshot);
const evidence = await buildEvidenceEnvelope(normalized);
const provenance = classifyProvenance(evidence, { sample_fixture: true });
const decisions = comparePolicies({ evidence, provenance });
const decision = decisions.find((item) => item.policy_id === 'LAB-OPEN-001');
const claim = await createClaimManifest({ evidence, provenance, policyDecision: decision });
```

## Policy identity

`policyManifestBody()` creates the canonical manifest object. `hashPolicyManifest()` applies stable recursively sorted-key serialization and SHA-256.

Claim manifests bind:

```text
evidence hash
policy ID
semantic policy version
policy manifest hash
subject
scaled quantity
quantity decimals
unit
```

## Decimal-safe quantities

Policy manifests declare `issuance.decimals`.

```js
quantityToBaseUnits('996.2', 6);       // 996200000n
baseUnitsToQuantityString(996200000n, 6); // '996.2'
```

Hidden precision beyond the declared decimals is rejected.

## Claim states

```text
RAW → NORMALIZED → VERIFIED → ADMITTED → ISSUABLE → ISSUED → ACTIVE
                                                           ↓
                                                   SETTLEMENT_DUE
                                                    ↙    ↓     ↘
                                             SETTLED  PARTIAL  SHORTFALL
```

Additional terminal or control states: `BLOCKED`, `DISPUTED`, `REVOKED`, `EXPIRED`.

## Reproduce

```bash
node --test packages/constraint-core/test/*.test.mjs
npm --prefix packages/constraint-core run operator-intake:test
node scripts/protocol_alpha_demo.mjs
npx hardhat test test/ConstraintProtocol.test.js
npx hardhat run scripts/deploy_constraint_protocol_alpha.js
```

## Boundaries

This package does not by itself establish:

- physical source truth;
- operator identity or custody beyond the declared intake receipt;
- legal ownership of energy or environmental attributes;
- legal redemption rights;
- reserve custody;
- revenue-grade meter finality;
- production audit completion;
- permission to mint on the canonical SPK deployment.

The protocol is designed to make those missing constraints explicit instead of silently assuming them.
