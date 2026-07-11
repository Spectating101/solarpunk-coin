# SolarPunk Constraint Protocol — Public Alpha

## Position

SolarPunk started as an energy-linked currency experiment. The corrected thesis and Public Lab exposed a more general problem: physical expenditure or production does not automatically create a credible financial claim.

The public-alpha protocol therefore treats **the constrained claim** as the primitive and SPK as one reference application.

> Evidence is not value. Evidence enters a policy. The policy decides what claim, if any, may be admitted. Issuance creates a bounded state. Settlement must still be accounted for explicitly.

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
- L0-L4 provenance classification;
- versioned first-class policy manifests;
- policy comparison;
- claim-manifest creation and state transitions;
- explicit settlement accounting.

### Reference contracts

- `PolicyRegistry.sol` — versioned policy-manifest hash registry;
- `ClaimRegistry.sol` — bounded admitted/issued claim state machine;
- `SettlementLedger.sol` — declared settlement capacity and explicit covered/shortfall records.

These contracts are public-alpha primitives. They do not custody reserves, create legal redemption rights, or replace production governance.

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

The protocol value is not the first policy. It is the ability to expose the rule, version it, compare decisions, and retain the evidence-policy relationship in the resulting claim.

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

## Reproduce the alpha demo

```bash
node --test packages/constraint-core/test/constraint-core.test.mjs
node scripts/protocol_alpha_demo.mjs
npx hardhat test test/ConstraintProtocol.test.js
```

The deterministic demo writes:

```text
state/protocol/constraint_protocol_alpha_demo.json
```

The browser Protocol Alpha surface should expose the same conceptual flow and the same shared core package.
