# NOR-GO Reference Case Specification

**Case family:** Norway-inspired Guarantee of Origin institutional digital twin  
**Status:** specification only; not implemented  
**Proposed case ID:** `NOR-GO-001`  
**Authority:** public official rules translated into a non-live research simulation

## 1. Research purpose

Test whether Policy Lab can represent the institutional transitions between electricity-production evidence, authorized certificate issuance, bounded quantity, registry identity, transfer, cancellation, correction, and explicit non-delivery boundaries.

This case is not:

- an NECS emulator;
- a live Statnett or NVE integration;
- a certificate issuer;
- a legal opinion;
- a real GO decision;
- external validation of Policy Lab.

## 2. Core institutional chain

```text
production facility
→ facility eligibility
→ metering interval
→ evidence quality and settlement status
→ eligible MWh
→ authorized issuer
→ certificate issuance
→ registry inventory
→ transfer
→ cancellation / expiry
→ disclosure boundary
```

## 3. Proposed objects

### Facility

```text
facility_id
country
energy_source
approval_status
approval_authority
approval_effective_from
approval_effective_to
metering_points[]
```

### Production evidence

```text
evidence_id
evidence_hash
metering_point_id
window_start
window_end
production_mwh
quality_status: measured | finally_estimated | invalid
settlement_status: provisional_d1 | final_d5 | corrected | superseded
reported_at
supersedes_evidence_id?
source_authority
```

### Issuance context

```text
issuer_role
registry_role
policy_id
policy_version
certificate_quantum_mwh = 1
issuance_window
```

### Certificate state

```text
certificate_id
facility_id
production_window
quantity_mwh = 1
issued_at
owner_account
state: issued | transferred | cancelled | expired | corrected
terminal_reason?
source_evidence_id
```

## 4. Admission gates

| Gate | Pass condition | Failure result |
|---|---|---|
| `FACILITY_APPROVED` | facility approved for the relevant production window | `BLOCKED_UNAPPROVED_FACILITY` |
| `EVIDENCE_PRESENT` | attributable production evidence exists | `BLOCKED_MISSING_EVIDENCE` |
| `EVIDENCE_QUALITY_ALLOWED` | measured or otherwise institutionally valid quality state | `BLOCKED_INVALID_QUALITY` |
| `SETTLEMENT_STATE_ALLOWED` | declared policy permits provisional or requires final status | `BLOCKED_PROVISIONAL_EVIDENCE` or proceed conditionally |
| `AUTHORIZED_ISSUER` | issuer role matches declared institutional authority | `BLOCKED_UNAUTHORIZED_ISSUER` |
| `WINDOW_NOT_ALREADY_ISSUED` | eligible production quantity is not already fully represented | `BLOCKED_DUPLICATE_PRODUCTION_WINDOW` |
| `POSITIVE_ELIGIBLE_QUANTITY` | eligible production is at least one certificate quantum | `BLOCKED_SUB_QUANTUM` |

## 5. Quantity rule

```text
eligible_certificate_count
= floor(eligible_production_mwh / 1 MWh)
- certificates_already_issued_for_window
- corrected_ineligible_quantity
```

The reference case must preserve any residual sub-1-MWh quantity as unissued remainder rather than silently rounding upward.

## 6. Binding and blocking attribution

The decision should distinguish:

- a blocking eligibility rule;
- the 1-MWh certificate quantum;
- previously issued quantity;
- corrections or supersession;
- policy choice over provisional versus final evidence.

Example result:

```text
ELIGIBLE FOR REFERENCE ISSUANCE
production: 12.70 MWh
previously issued: 2 certificates
new reference certificates: 10
unissued remainder: 0.70 MWh
binding rule: CERTIFICATE_QUANTUM_AND_PRIOR_ISSUANCE
physical delivery to buyer: NOT ESTABLISHED
```

## 7. Lifecycle tests

### Happy path

1. Approved facility.
2. Final measured production evidence of 12.70 MWh.
3. No prior issuance.
4. Authorized issuer context.
5. Issue 12 reference certificates.
6. Transfer selected certificates.
7. Cancel certificates for disclosure.
8. Verify cancelled certificates cannot transfer again.

### Required failure states

- unapproved facility;
- missing meter attribution;
- invalid or incomplete evidence;
- provisional evidence under final-only policy;
- unauthorized issuer;
- duplicate production window;
- partial prior issuance;
- sub-quantum production;
- transfer from non-owner;
- transfer after cancellation;
- duplicate cancellation;
- expired certificate;
- late evidence correction reducing eligible quantity;
- evidence correction after transfer or cancellation.

## 8. Correction research problem

A late correction is deliberately difficult. The reference simulation should not assume a simple answer.

Questions to expose:

- Does the corrected evidence supersede the original evidence object?
- Which existing certificates are affected?
- Can a transferred or cancelled certificate be revoked?
- Is a compensating obligation created?
- Who bears the discrepancy?
- Which prior receipt remains historically valid but institutionally superseded?

Initial status: `UNRESOLVED_REQUIRES_RULE_AUDIT`.

## 9. Assessment output

```text
facility eligibility
production evidence status
settlement/finality status
issuer authority
eligible MWh
certificate quantum
prior issuance
new reference certificate count
unissued remainder
registry state
anti-reuse state
correction exposure
physical-delivery status
explicit non-claims
source IDs
reference decision receipt
```

## 10. Acceptance gates before implementation

- [ ] official rule sources rechecked;
- [ ] exact legal terminology reviewed in Norwegian and English;
- [ ] certificate lifecycle states confirmed;
- [ ] expiry and correction rules separately audited;
- [ ] no invented NECS API or schema represented as official;
- [ ] policy alternatives labelled as project counterfactuals;
- [ ] reference-case UI clearly states non-live simulation;
- [ ] tests cover duplicate issuance and cancellation;
- [ ] receipts preserve source and rule versions;
- [ ] no claim of physical delivery or monetary status.

## 11. Research value

`NOR-GO-001` would be valuable because it tests a real institutional logic that is close to the project’s core problem while retaining a strict distinction between:

```text
production evidence
certificate authority
certificate quantity
registry ownership
attribute cancellation
physical delivery
financial settlement
money
```
