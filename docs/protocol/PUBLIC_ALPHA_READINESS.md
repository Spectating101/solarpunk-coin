# Constraint Protocol Public Alpha Readiness

**Decision:** build and review as a public protocol alpha. Do not represent it as a production financial network or paid claim platform.

## What exists now

| Layer | Alpha status | Evidence |
|---|---|---|
| Shared protocol kernel | Implemented | `packages/constraint-core/` |
| Browser + Node reuse | Implemented | frontend imports `@solarpunk/constraint-core`; Node demos/deploy scripts import the same package |
| Generic interval CSV | Implemented | `normalizeGenericCsv` |
| Utility / Green Button interval evidence | Implemented | `normalizeGreenButtonCsv` |
| Cumulative meter/inverter pair | Implemented | `normalizeCumulativePair` |
| Fronius PowerFlow pair | Implemented | `normalizeFroniusPair` |
| Signed meter evidence inspection | Implemented | `inspectSignedEvidence` |
| Portable evidence identity | Implemented | deterministic SHA-256 over semantic evidence body; presentation metadata excluded |
| Provenance classification | Implemented | L0-L4 with cryptographic-validity/trusted-operator distinction |
| First-class policies | Implemented | 4 canonical committed policy manifests |
| Policy conformance | Implemented | CI compares committed JSON to executable canonical policy bodies |
| Policy identity | Implemented | stable SHA-256 manifest hash + semantic version mapping |
| Policy comparison | Implemented | same evidence evaluated under multiple policies |
| Claim manifest | Implemented | exact evidence + policy hash/version + subject + decimal-safe quantity binding |
| Claim state model | Implemented | admitted/issuable/issued/active/settlement/control states |
| Decimal-safe claim quantities | Implemented | policy decimals + integer base units; hidden precision rejected |
| Settlement result | Implemented | explicit outstanding/capacity/covered/shortfall quantities |
| PolicyRegistry | Implemented/tested | monotonic versions, manifest hashes, active status |
| ClaimRegistry | Implemented/tested | active policy hash/version binding, issuance bound, role-gated state |
| SettlementLedger | Implemented/tested | declared capacity → covered/shortfall → claim state |
| Local contract deployment | Implemented/CI green | deterministic smoke deployment writes runtime proof |
| Protocol-first browser lab | Implemented/visual-reviewed | 5 evidence paths → provenance → policies → claim → settlement |
| Mobile browser flow | Implemented/visual-reviewed | fresh-context Chromium QA |
| JSON Schemas | Implemented | Draft 2020-12 schemas under `protocol/schema/` |
| TypeScript declarations | Implemented | package `types` entry + `index.d.ts` |
| CI gates | Implemented | core, conformance, demo, local deploy, full Hardhat, frontend tests/build, real Chromium walkthrough |
| Deployable site artifact | Implemented | CI uploads `frontend/dist/` |
| Guarded Sepolia workflow | Implemented, not run | exact SHA + explicit confirmation + environment secrets required |

## Current proof numbers

The bundled cumulative-counter alpha example derives:

```text
generation          1,388.6 kWh
site load              392.4 kWh
export                  821.2 kWh
curtailed               175.0 kWh
eligible surplus        996.2 kWh
```

Under L0 sample provenance:

```text
LAB-OPEN-001       ADMIT_WITH_LIMIT
ENERGY-PILOT-002   BLOCKED
ENERGY-STRICT-003  BLOCKED
SPK-ENERGY-001     BLOCKED
```

The local contract smoke path:

```text
admitted maximum     996.2 CLAIM_UNIT
issued                20.0 CLAIM_UNIT
capacity declared      8.0 CLAIM_UNIT
covered                8.0 CLAIM_UNIT
shortfall             12.0 CLAIM_UNIT
claim state            PARTIAL
```

This is intentionally a failure-visible demonstration. Valid evidence and bounded issuance do not automatically produce settlement credibility.

## Current claim that is defensible

> Constraint Protocol Public Alpha is a deterministic evidence-to-claim research protocol and browser laboratory. It normalizes several energy evidence formats, separates cryptographic validity from provenance, evaluates the same evidence under versioned policy manifests, produces policy-bound bounded claim manifests, and records explicit settlement coverage or shortfall. A reference EVM stack binds claims to active policy hashes and versions. SPK remains one reference application.

## Claims that are not defensible

Do not claim:

- a decentralized trustless protocol;
- production-grade RWA infrastructure;
- audited smart contracts;
- verified real-world ownership;
- certified revenue-grade meter provenance;
- enforceable redemption;
- reserve custody;
- a live claim marketplace;
- permissionless policy execution;
- a production oracle network;
- mainnet readiness;
- economic product-market fit;
- an investable company merely because the alpha exists.

## Deployment readiness

### Browser alpha

**Ready for a branch/deployment preview after current CI remains green.**

The frontend builds as a static Vite site and CI exercises the real preview with Chromium.

### Local EVM reference stack

**Ready and already exercised in CI.**

The local smoke deployment publishes canonical policies, admits a policy-bound claim, issues scaled quantity, and records a partial settlement.

### Sepolia reference alpha

**Mechanically ready but intentionally not yet deployed.**

The guarded workflow requires:

```text
source_ref = exact 40-character commit SHA being deployed
confirm    = DEPLOY_CONSTRAINT_ALPHA_TO_SEPOLIA
```

It also requires the selected GitHub environment to provide:

```text
SEPOLIA_RPC
PRIVATE_KEY
```

The workflow refuses a source ref that differs from the checked-out workflow commit. Policy registry URIs therefore use the exact immutable source SHA.

A Sepolia deployment should only occur after:

1. branch CI is green;
2. the draft PR diff is reviewed;
3. the current visual artifact is approved;
4. the exact source commit is frozen for deployment;
5. deployment wallet/gas use is explicitly approved.

### Mainnet / real-value deployment

**Blocked.**

## Highest-value missing proof

The next field proof is not another synthetic feature.

It is:

```text
ONE NAMED REAL OPERATOR OR LAB
             ↓
LIVE INVERTER / GATEWAY COUNTERS
             ↓
DOCUMENTED DEVICE OR GATEWAY IDENTITY
             ↓
SIGNED INTERVAL EVIDENCE
             ↓
SOURCE ARCHIVE + DUPLICATE CONTROLS
             ↓
L2 PROVENANCE CANDIDATE
             ↓
ENERGY-PILOT-002 EVALUATION
             ↓
POLICY-BOUND SEPOLIA CLAIM
             ↓
SETTLEMENT STRESS + PUBLIC CASE REPORT
```

That single run changes the project category from “internally sophisticated protocol alpha” to “external field experiment.”

## Highest-value protocol research gap

The reference contracts bind a claim to an active policy manifest hash and version. They do not prove that the off-chain evaluator actually executed that policy correctly.

The current trust boundary is:

```text
canonical evidence
      ↓
deterministic off-chain evaluator
      ↓
authorized CLAIM_ISSUER_ROLE asserts the result
      ↓
on-chain policy hash/version binding
```

The next protocol research question is how to reduce issuer trust without forcing arbitrary evidence adapters into Solidity.

Serious candidate directions:

- deterministic WASM policy modules;
- signed evaluation receipts from independent evaluators;
- optimistic admission with challenge windows;
- narrow zero-knowledge proofs for selected policy classes.

Do not implement all four in alpha. Select one after adversarial review and a real L2 field run exposes the actual operational requirements.

## Recommended public-alpha release gate

Before merging the alpha branch:

```text
[ ] corrected SDK declaration commit green
[ ] evidence identity metadata-invariance test green
[ ] threat model reviewed
[ ] all core/policy/schema package tests green
[ ] local deployment smoke green
[ ] complete Hardhat suite green
[ ] frontend tests and build green
[ ] desktop/mobile Chromium walkthrough green
[ ] draft PR reviewed
[ ] thesis remains untouched
[ ] existing SPK contracts/runtime remain untouched
```

Before Sepolia alpha deployment:

```text
[ ] exact commit SHA selected
[ ] policy manifests at that SHA reviewed
[ ] deployment wallet/gas approved
[ ] environment secrets available
[ ] manual workflow confirmation supplied
[ ] runtime artifact archived after deployment
[ ] explorer/readback proof added to Protocol Alpha UI
```

## Stop rule

After browser alpha + Sepolia reference deployment, stop adding protocol surface area until one of these appears:

1. a real L2 evidence source;
2. an external developer trying to implement an adapter or policy;
3. a grant/reviewer request exposing a concrete conformance gap;
4. a security review identifying a protocol-integrity defect.

Do not return to feature accumulation for its own sake.
