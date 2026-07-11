# @solarpunk/constraint-core

Public-alpha protocol kernel for turning physical-resource evidence into explicit, bounded claim decisions.

This package generalizes the strongest machinery already present in SolarPunk beyond SPK. SPK remains a reference application and thesis artifact; it is not the protocol abstraction.

## Core model

```text
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

Every stage should produce `PASS`, `WARNING`, or `BLOCK` reasons that can be shown to a reviewer or consumed by software.

## Adapters in alpha

- generic interval CSV
- Green Button / utility interval CSV
- cumulative meter/inverter snapshot pair
- Fronius PowerFlow JSON pair
- signed meter-reading attestation inspection

Live LAN polling, private-key signing, meter onboarding, and authoritative mint operations remain operator-side. The browser alpha intentionally does not receive private keys or claim physical truth.

## Policy model

The core exposes first-class policy manifests and deterministic policy evaluation. The same evidence can be tested against several policies.

Bundled examples:

- `LAB-OPEN-001`: public-lab illustration; L0 accepted; never live mint authority
- `ENERGY-PILOT-002`: L2 minimum, 30% evidence haircut, bounded pilot claim
- `ENERGY-STRICT-003`: L4 external corroboration required
- `SPK-ENERGY-001`: SPK retained as one reference application policy

## Claim states

```text
RAW → NORMALIZED → VERIFIED → ADMITTED → ISSUABLE → ISSUED → ACTIVE
                                                           ↓
                                                   SETTLEMENT_DUE
                                                    ↙    ↓     ↘
                                             SETTLED  PARTIAL  SHORTFALL
```

Additional terminal or control states: `BLOCKED`, `DISPUTED`, `REVOKED`, `EXPIRED`.

## Boundaries

This package does not by itself establish:

- legal ownership of energy or environmental attributes;
- legal redemption rights;
- reserve custody;
- revenue-grade meter finality;
- production audit completion;
- permission to mint on the canonical SPK deployment.

The protocol is designed to make those missing constraints explicit instead of silently assuming them.
