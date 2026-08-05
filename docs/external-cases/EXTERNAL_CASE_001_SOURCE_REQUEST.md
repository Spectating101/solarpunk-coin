# External Case 001 — source-holder request

## What we are requesting

One small historical energy-data export from a system you own, operate, administer, or are authorized to research, such as:

- solar inverter or gateway export;
- electricity meter interval export;
- energy-management-system export;
- utility portal download;
- authenticated API snapshot;
- registry or operator CSV.

A short, manually inspectable measurement window is preferred. The purpose is to validate an evidence-intake and policy-assessment workflow, not to collect the largest possible dataset.

## What must accompany the file

Please provide:

1. Your relationship to the system or data source.
2. How and when the export was produced and transferred.
3. Measurement start/end, timezone, interval duration, and units.
4. The meaning and sign convention of generation, site load, export, and curtailed values where present.
5. Whether export is directly measured or derived.
6. Any available device model, capacity, accuracy, registry, signature, API, or utility corroboration information.
7. The publication scope you authorize.

## Publication choices

Choose one:

- `private_validation` — nothing is published.
- `public_metadata_only` — privacy-safe source and receipt metadata may be published; no aggregates or raw rows.
- `public_anonymized_aggregate` — privacy-safe metadata and anonymized aggregates may be published; no raw rows.
- `public_raw` — raw rows may also be published.

The default is `private_validation`. Raw rows and personal identity remain private unless you explicitly authorize otherwise.

## What the workflow does

The source is processed through:

```text
original file identity
→ custody and permission record
→ field and unit mapping
→ normalization and diagnostics
→ evidence classification
→ declared policy evaluation
→ settlement scenario where applicable
→ deterministic receipt and research capsule
```

The original file is hashed and retained privately. The public repository does not need to contain the raw source.

## What the workflow does not claim

Participation does not certify:

- meter or device accuracy;
- physical source truth beyond verified evidence;
- ownership of renewable-energy certificates or environmental attributes;
- legal issuance authority;
- reserves, redemption, or financial obligations;
- production deployment;
- commercial endorsement.

The source begins at `PROVENANCE-L0-BASE`. Higher-assurance scenarios are not granted from self-declared metadata.

## Acceptable outcomes

The policy may:

- block the case;
- admit it with a quantity limit;
- admit it under one policy and block it under another;
- expose missing custody, semantics, signature, identity, or corroboration requirements.

A blocked result is a valid outcome. The research objective is an honest, reproducible assessment—not a favorable result.

## Review rights

Before any authorized publication, the source holder will be offered a factual review of:

- relationship and acquisition description;
- measurement and field semantics;
- permission boundary;
- privacy-safe metadata and aggregates.

The factual review cannot change deterministic policy results or suppress diagnostics.

## Minimal response

A source holder can begin by providing:

```text
Relationship to source:
Source type:
Approximate measurement window:
Timezone:
Available export format:
Known fields and units:
Preferred permission scope:
Public attribution allowed:
Available device/registry/signature/corroboration artifacts:
```

After that initial response, use `scripts/scaffold_external_case_001.mjs` to create the private intake workspace and complete the formal source manifest, column mapping, and confirmation record.
