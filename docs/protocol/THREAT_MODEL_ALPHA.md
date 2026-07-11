# Constraint Protocol Public Alpha Threat Model

**Scope:** `@solarpunk/constraint-core`, Public Alpha browser lab, `PolicyRegistry`, `ClaimRegistry`, `SettlementLedger`, and the guarded Sepolia deployment path.

**Status:** pre-audit experimental protocol infrastructure. This document identifies trust boundaries and failure modes; it is not an audit report.

## Assets and security objectives

The alpha is trying to preserve five things:

1. **Evidence identity** — semantically identical canonical evidence should retain one deterministic identity; presentation labels must not create a new evidence hash.
2. **Policy identity** — a claim must identify the exact policy content and version that admitted it.
3. **Quantity bounds** — issued quantity must not exceed the admitted claim and decimal conversion must not create hidden precision.
4. **State integrity** — claim and settlement state transitions must be explicit, role-gated, and reconciled.
5. **Boundary honesty** — cryptographic validity, provenance, legal rights, reserve custody, and economic settlement must not be silently collapsed into one “verified/backed” claim.

## Trust boundaries

```text
RAW SOURCE
   │  untrusted input
   ▼
ADAPTER / VERIFIER
   │  deterministic software trust
   ▼
EVIDENCE ENVELOPE
   │  portable evidence identity
   ▼
PROVENANCE CLASSIFIER
   │  external operator/custody facts may be required
   ▼
POLICY ENGINE
   │  deterministic off-chain evaluation
   ▼
CLAIM ISSUER ROLE
   │  governance trust: asserts evaluation occurred
   ▼
CLAIM REGISTRY
   │  binds claim to active policy hash/version
   ▼
SETTLEMENT OPERATOR
   │  declares capacity; ledger does not custody reserves
   ▼
SETTLEMENT RESULT
```

The highest-risk boundary in Public Alpha is the transition from deterministic off-chain policy evaluation to the role-gated on-chain `CLAIM_ISSUER_ROLE`. The EVM binds the claim to a policy manifest but does not prove that arbitrary JavaScript policy code was executed correctly.

## Threats

### T1 — Self-supplied registry provenance inflation

**Attack:** a browser user uploads signed readings and a registry they created themselves, then claims the signatures prove a real operator source.

**Impact:** L1/L2 provenance inflation and inappropriate policy admission.

**Current controls:**

- signature verification is separated from provenance classification;
- browser-supplied signed evidence may be `cryptographically_verified = true` while remaining L0;
- L1+ requires `trusted_operator_context` or an externally established real-operator context;
- UI explains that a self-supplied registry does not establish a named operator.

**Residual risk:** trusted operator context is still an off-chain assertion in Public Alpha.

**Next control:** signed operator registry statements anchored to a governed identity registry or externally corroborated operator record.

### T2 — Rejected-record contamination or denial of valid subset

**Attack/failure:** one duplicate or low-quality reading either contaminates an otherwise valid bundle or causes all valid evidence to be discarded.

**Impact:** false admission or excessive denial.

**Current controls:**

- records are verified independently;
- invalid rows retain row-level `BLOCK` diagnostics;
- accepted attestations form the accepted evidence subset;
- rejected input rows are surfaced as warnings when valid accepted evidence remains;
- no accepted evidence means rejected records become an envelope blocker.

**Residual risk:** a policy may want stricter all-or-nothing bundle semantics.

**Next control:** add policy-selectable bundle acceptance modes such as `accepted_subset`, `all_records_required`, and threshold-based acceptance.

### T3 — Presentation metadata changes evidence identity

**Attack/failure:** a caller changes `source_label`, browser display metadata, or local presentation context and receives a different evidence hash for the same canonical evidence.

**Impact:** duplicate claims, broken interoperability, replay controls tied to caller labels.

**Current controls:**

- portable evidence identity hashes adapter id/version, source semantics, canonical intervals, summary, and capabilities;
- presentation metadata and derived diagnostic prose remain attached to the envelope but are excluded from `evidence_hash`;
- conformance tests require metadata-invariant evidence identity.

**Residual risk:** source semantics are still adapter-defined and may drift across adapter versions.

### T4 — Adapter semantic drift

**Attack/failure:** an adapter changes surplus derivation, sign conventions, timestamp treatment, or alias interpretation without changing its version.

**Impact:** same adapter identity produces different evidence decisions.

**Current controls:**

- evidence hash binds adapter id/version;
- adapter assumptions are surfaced as diagnostics;
- current adapters are in one shared browser/Node package;
- core tests exercise cumulative, Green Button, Fronius, and signed-reading paths.

**Residual risk:** no formal semantic-version enforcement exists for adapter implementation changes.

**Next control:** adapter conformance vectors and a release rule requiring a version bump when canonical output changes.

### T5 — Policy documentation differs from executable policy

**Attack/failure:** a published policy description says one thing while the evaluator executes different parameters.

**Impact:** hidden rule changes and misleading claim admission.

**Current controls:**

- canonical JSON policy manifests are committed under `protocol/policies/`;
- `policyManifestBody()` defines the canonical executable object;
- CI compares committed JSON manifests to the executable canonical bodies;
- deterministic SHA-256 manifest hashes change when policy content changes.

**Residual risk:** authorized off-chain evaluator code could still intentionally ignore the manifest.

### T6 — Policy version/hash mismatch

**Attack:** a claim names a trusted policy ID but uses stale or altered policy content.

**Impact:** claim laundering under a recognizable policy name.

**Current controls:**

- claims include `policy_version` and `policy_manifest_hash`;
- claim IDs bind both;
- `ClaimRegistry.createClaim` reads the active `PolicyRegistry` entry and rejects a version/hash mismatch;
- policy registry versions must increase monotonically.

**Residual risk:** a broad `POLICY_PUBLISHER_ROLE` can publish or deactivate policies according to its governance authority.

### T7 — Claim issuer lies about off-chain policy evaluation

**Attack:** an authorized claim issuer submits a policy-bound claim quantity that was never produced by the canonical evaluator.

**Impact:** on-chain admission of a quantity inconsistent with policy rules.

**Current controls:**

- issuer is role-gated;
- claim is bound to evidence hash and active policy manifest hash/version;
- admitted quantity is permanently bounded for subsequent issuance;
- deployment/docs explicitly disclose this governance trust boundary.

**Residual risk:** this is the largest protocol-integrity gap before stronger execution proofs.

**Next controls under investigation:**

- constrained deterministic WASM policy execution;
- optimistic policy execution with challenge windows;
- signed policy-evaluation receipts from multiple independent evaluators;
- zero-knowledge proof of selected policy classes.

Public Alpha does not claim any of these are implemented.

### T8 — Decimal and quantity mismatch

**Attack/failure:** human decimal quantities are rounded differently between browser, Node, and Solidity, allowing over-issuance or inconsistent settlement.

**Impact:** financial quantity mismatch.

**Current controls:**

- policy declares `issuance.decimals`;
- shared core converts quantities to decimal-safe integer base units;
- hidden non-zero precision beyond the declared scale is rejected;
- claim manifest binds quantity base units and decimals;
- reference contracts use `uint128` base-unit quantities;
- contract tests use scaled 6-decimal quantities.

**Residual risk:** adapters still use JavaScript numbers for kWh normalization before policy quantity scaling.

**Next control:** decimal/fixed-point normalization for high-value or high-precision evidence domains.

### T9 — Settlement capacity is self-declared

**Attack:** a settlement operator declares capacity that is not backed by controlled reserves, delivery ability, or legal obligation.

**Impact:** a technically “settled” record can mislead users about economic finality.

**Current controls:**

- settlement capacity is explicitly named as a declared input;
- `SettlementLedger` does not claim reserve custody;
- settlement results state that no legal redemption right is created;
- shortfall remains explicit when declared capacity is insufficient.

**Residual risk:** there is no reserve proof or custody integration.

**Next control:** settlement-capacity adapters with asset-specific custody/proof requirements and independent reconciliation.

### T10 — Repeated settlement evaluation rewrites the latest view

**Attack/failure:** an authorized settlement operator records multiple evaluations as capacity changes, while a consumer only reads the latest settlement record.

**Impact:** historical context can be missed by naive clients.

**Current controls:**

- every evaluation emits `SettlementEvaluated` and claim state-transition events;
- the on-chain event log preserves the sequence;
- claim state constrains allowed settlement transitions.

**Residual risk:** `latestSettlement` is not a complete historical index.

**Next control:** protocol explorer/indexer must treat events as the canonical history and latest storage as a convenience view.

### T11 — Duplicate claim or replay under different IDs

**Attack:** an issuer submits multiple claims over the same evidence/policy relationship using arbitrary claim IDs.

**Impact:** duplicate admitted claims.

**Current controls:**

- portable claim manifests use a deterministic claim ID over evidence, policy binding, subject, quantity, decimals, and unit;
- existing SPK attestation machinery separately has source/attestation replay controls.

**Residual risk:** `ClaimRegistry` currently accepts a role-gated supplied claim ID and does not recompute the portable SHA-256 JSON claim ID in Solidity.

**Next control:** either store a unique evidence-policy-subject admission key on-chain or define an EVM-native claim key alongside the portable claim manifest ID.

### T12 — Role compromise

**Attack:** policy publisher, claim issuer, settlement operator, or admin keys are compromised.

**Impact:** malicious policy publication, claim admission, false capacity records, disputes, or revocations.

**Current controls:** OpenZeppelin `AccessControl`, distinct roles, and separate reference contracts.

**Residual risk:** alpha deployment script uses one deployer/admin for the smoke stack.

**Next control:** multisig/Safe administration, least-privilege role assignment, role rotation/runbook, and explicit emergency pause/revocation policy before a pilot-grade deployment.

### T13 — Mutable or unavailable policy URI

**Attack/failure:** a policy hash remains on-chain while the URI resolves to mutable branch content or disappears.

**Impact:** reviewers cannot retrieve the exact rule object.

**Current controls:**

- non-local deployment requires `PROTOCOL_ALPHA_SOURCE_REF`;
- guarded Sepolia workflow requires the source ref to be the exact 40-character checked-out commit SHA;
- policy URIs are generated from that immutable commit ref.

**Residual risk:** GitHub availability is not a permanent archival guarantee.

**Next control:** publish release manifests to a content-addressed archive and optionally mirror to IPFS/Arweave or an institutional repository.

### T14 — Browser file privacy

**Attack/failure:** operator files or customer-identifying evidence are uploaded to a server without clear consent.

**Impact:** confidentiality breach.

**Current controls:** Public Alpha processes selected evidence locally in the browser; the protocol interface does not upload files to a backend; browser session persistence stores only bounded receipt summaries in the older SPK workbench path.

**Residual risk:** users may still publish downloaded protocol-run JSON containing identifiers.

**Next control:** add explicit export redaction profiles before operator/pilot use.

## Threats explicitly outside Public Alpha

- formal smart-contract audit findings;
- legal characterization of claims or SPK;
- securities, payment, commodity, energy, or environmental-attribute regulation;
- physical meter tamper resistance;
- utility settlement finality;
- reserve insolvency;
- oracle decentralization;
- privacy-preserving evidence disclosure;
- mainnet MEV/economic attacks.

These are blockers for different launch stages, not silently assumed solved.

## Current security judgment

Public Alpha is appropriate for:

- deterministic research experiments;
- public browser demonstrations;
- local/CI contract smoke deployments;
- a manually gated Sepolia reference deployment after branch review;
- adversarial review of evidence-policy-claim semantics.

It is not appropriate for:

- real customer money;
- mainnet financial exposure;
- legal redemption promises;
- production provenance claims;
- unreviewed third-party policy execution;
- self-declared reserve proof.

The principal protocol research problem after alpha is **verifiable policy execution and issuer minimization**. The principal field-validation problem is **one real L2 operator/gateway evidence source**.
