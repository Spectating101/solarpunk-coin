# SolarPunk Constraint Protocol — Public Alpha

## Position

SolarPunk started as an energy-linked currency experiment. The corrected thesis and Public Lab exposed a more general problem: physical expenditure or production does not automatically create a credible financial claim.

The public-alpha protocol therefore treats **the constrained claim** as the primitive and SPK as one reference application.

> Evidence is not value. Evidence enters a policy. The policy decides what claim, if any, may be admitted. Issuance creates a bounded state. Settlement must still be accounted for explicitly.

The thesis remains unchanged. Constraint Protocol Alpha is a post-thesis protocol generalization built on the same five-constraint insight.

## Protocol flow

```text
SOURCE EVIDENCE
      ↓
ADAPTER / NORMALIZATION
      ↓
DETERMINISTIC DIAGNOSTICS
      ↓
PROVENANCE CLASSIFICATION
      ↓
POLICY EVALUATION
      ↓
BOUNDED CLAIM MANIFEST
      ↓
ISSUANCE STATE
      ↓
SETTLEMENT CAPACITY
      ↓
SETTLED / PARTIAL / SHORTFALL
```

The five thesis constraints are protocol surfaces:

1. **Data** — what evidence is admissible and why?
2. **Issuance** — what quantity may be created under a declared rule?
3. **Pricing / risk** — what haircut, cap, and uncertainty assumptions apply?
4. **Settlement** — what obligation exists and what capacity can cover it?
5. **Governance** — who publishes policies, issues claims, records settlement, or revokes state?

## Public-alpha components

### `packages/constraint-core`

Shared pure-JavaScript protocol kernel for browser and Node runtimes:

- generic interval CSV adapter;
- Green Button / utility interval adapter;
- cumulative meter/inverter snapshot adapter;
- Fronius PowerFlow pair adapter;
- signed meter-reading attestation inspector;
- deterministic evidence envelopes and SHA-256 hashes;
- accepted-subset/rejected-record semantics for signed evidence;
- L0-L4 provenance classification;
- explicit distinction between cryptographic signature validity and trusted operator provenance;
- versioned first-class policy manifests;
- canonical policy hashing;
- policy comparison;
- decimal-safe claim quantities;
- claim-manifest creation and state transitions;
- explicit settlement accounting.

### Canonical policy manifests

Executable policy JSON is committed under:

```text
protocol/policies/
```

CI proves that the committed JSON objects match the evaluator's canonical policy bodies. Policy hashes are SHA-256 of stable recursively sorted-key serialization.

### Reference contracts

- `PolicyRegistry.sol` — versioned policy-manifest hash registry;
- `ClaimRegistry.sol` — bounded admitted/issued claim state machine bound to an active policy hash/version;
- `SettlementLedger.sol` — declared settlement capacity and explicit covered/shortfall records.

These contracts are public-alpha primitives. They do not custody reserves, create legal redemption rights, or replace production governance.

The contract trust model is explicit: an authorized claim issuer asserts that deterministic off-chain evaluation occurred. `ClaimRegistry` verifies the active policy binding but does not execute arbitrary JavaScript adapters or policy code inside the EVM.

### SPK

SPK remains a reference application and thesis artifact. `SPK-ENERGY-001` is represented as one example policy alongside broader energy-claim policies.

The protocol can continue even if SPK is later retired, renamed, or replaced.

## First-class policies

The same evidence can be evaluated against multiple policies.

Example:

```text
Cumulative meter sample: 996.2 kWh eligible surplus
Provenance: L0

LAB-OPEN-001       ADMIT_WITH_LIMIT  996.2 CLAIM_UNIT
ENERGY-PILOT-002   BLOCKED           requires L2 + signed evidence
ENERGY-STRICT-003  BLOCKED           requires L4 + external corroboration
SPK-ENERGY-001     BLOCKED           requires L1 + signed evidence
```

The protocol value is not the first policy. It is the ability to expose the rule, version it, hash it, compare decisions, and retain the exact evidence-policy relationship in the resulting claim.

## Signed evidence subset semantics

The signed-reading inspector evaluates each input record.

```text
4 input records
   ↓ verifier
2 accepted attestations
2 rejected records
   ↓
accepted evidence subset = 2 records / 2,606.7 kWh
```

Rejected rows remain visible with row-level `BLOCK` diagnostics. When valid accepted attestations remain, those row rejections do not automatically invalidate the accepted evidence subset. The envelope records them as rejected-input warnings. A policy may still block the envelope for provenance or other requirements.

This matches the underlying attestation-bundle semantics: reject bad rows; do not silently contaminate valid accepted rows.

## Cryptographic validity is not provenance

A browser user can upload:

```text
signed-readings.json
meter-registry.json
```

The inspector can prove that signatures recover the device addresses named in the supplied registry. That is **cryptographic self-consistency**.

It does not prove that the uploaded registry belongs to a named real operator. Browser-supplied signed evidence therefore remains L0 unless a trusted operator context is established outside the self-supplied files.

This distinction is deliberate:

```text
signature valid against supplied registry  ≠  trusted operator provenance
```

## Claim states

```text
RAW
 ↓
NORMALIZED
 ↓
VERIFIED
 ↓
ADMITTED
 ↓
ISSUABLE
 ↓
ISSUED
 ↓
ACTIVE
 ↓
SETTLEMENT_DUE
 ↙      ↓       ↘
SETTLED PARTIAL SHORTFALL
```

Control states include `BLOCKED`, `DISPUTED`, `REVOKED`, and `EXPIRED`.

Claims bind the exact evidence hash, policy ID, semantic policy version, policy manifest hash, subject, scaled quantity, decimal scale, and unit.

## Why this is not an oracle product

Oracle and provenance systems answer important upstream questions about reported data and source identity.

Constraint Protocol focuses on the downstream financial decision:

- may this evidence support a claim under policy P?
- what quantity is admitted?
- what risk haircut or cap applies?
- what obligation was created?
- what settlement capacity exists?
- what state results when capacity is insufficient?

The alpha can consume signed meter evidence, but its abstraction is the **evidence → policy → claim → settlement** relationship.

## Deployable alpha smoke path

A local deterministic deployment script exists:

```bash
npx hardhat run scripts/deploy_constraint_protocol_alpha.js
```

It:

1. deploys `PolicyRegistry`;
2. deploys policy-bound `ClaimRegistry`;
3. deploys `SettlementLedger`;
4. grants settlement authority to the ledger;
5. hashes and publishes all canonical policy manifests;
6. normalizes the bundled cumulative sample;
7. creates a `LAB-OPEN-001` claim bound to that manifest hash/version;
8. issues 20 scaled claim units;
9. records 8 units of declared capacity;
10. produces an explicit 12-unit shortfall;
11. writes `state/protocol/constraint_protocol_alpha_runtime.json`.

Non-local deployment fails closed unless both are provided:

```text
PROTOCOL_ALPHA_DEPLOY_CONFIRM=1
PROTOCOL_ALPHA_SOURCE_REF=<immutable commit SHA or release tag>
```

The immutable source ref is used in policy-manifest registry URIs.

Public Alpha has **not** been deployed to Sepolia by this branch yet.

## Security and scope boundary

Public Alpha is experimental testnet/research infrastructure.

It does not establish:

- legal ownership of the underlying resource;
- environmental-attribute ownership or retirement;
- legal redemption rights;
- reserve custody;
- formal audit completion;
- production oracle finality;
- production governance;
- mainnet readiness.

The goal is to make each missing constraint visible and machine-readable rather than hiding it behind an “asset-backed” label.

## Reproduce the alpha

```bash
node --test packages/constraint-core/test/*.test.mjs
node scripts/protocol_alpha_demo.mjs
npx hardhat test test/ConstraintProtocol.test.js
npx hardhat run scripts/deploy_constraint_protocol_alpha.js
```

Artifacts:

```text
state/protocol/constraint_protocol_alpha_demo.json
state/protocol/constraint_protocol_alpha_runtime.json
```

The browser Protocol Alpha surface exposes the same conceptual flow and uses the same shared core package as the Node alpha tooling.
