# Fiscal Choke Points — Derived Architecture Summary

> Generated deterministically from `COUNTRY_PATH_CODINGS.csv`. This is a descriptive research-control output, not a performance ranking or causal result.

## Coverage

- Countries represented: **5** — Indonesia, Malaysia, Philippines, Thailand, Vietnam.
- Distinct coded transaction paths: **7**.
- Distinct primary-source IDs referenced by the path rows: **19**.
- Countries requiring more than one coded path: **Philippines (3)**.

## Liable-node classes

| Liable-node class | Coded paths |
|---|---:|
| `APPOINTED_PMSE_COLLECTOR` | 1 |
| `FOREIGN_PROVIDER` | 2 |
| `NONRESIDENT_DIGITAL_SERVICE_PROVIDER` | 1 |
| `PAYMENT_CAPABLE_PLATFORM` | 1 |
| `PHILIPPINE_BUYER_WITHHOLDING_AGENT` | 1 |
| `QUALIFYING_E_MARKETPLACE` | 1 |

## Event-coupling classes

| Event-coupling class | Coded paths |
|---|---:|
| `BUYER_WITHHOLDING` | 1 |
| `CONDITIONAL_PLATFORM_PROCESS_PLUS_PERIODIC_FILING` | 1 |
| `MARKETPLACE_REMITTANCE` | 1 |
| `PERIODIC_PROVIDER_WITH_TRANSACTION_TAX_POINT` | 1 |
| `PER_TRANSACTION_WITHHOLDING` | 1 |
| `PROVIDER_REMITTANCE` | 1 |
| `TRANSACTION_COLLECTION_PLUS_PERIODIC_REPORTING` | 1 |

## Tax-object classes

| Tax-object class | Coded paths |
|---|---:|
| `CROSS_BORDER_DIGITAL_SERVICES` | 3 |
| `CROSS_BORDER_E_SERVICE_VAT` | 1 |
| `CROSS_BORDER_PMSE_VAT` | 1 |
| `MARKETPLACE_NONRESIDENT_SELLER_VAT` | 1 |
| `PLATFORM_SELLER_TAX_ADMIN` | 1 |

## Path inventory

| Path | Country | Liable node | Event coupling | Primary sources |
|---|---|---|---|---|
| `ID-PMSE-01` | Indonesia | `APPOINTED_PMSE_COLLECTOR` | `TRANSACTION_COLLECTION_PLUS_PERIODIC_REPORTING` | ID-PRI-001; ID-PRI-003 |
| `MY-STODS-01` | Malaysia | `FOREIGN_PROVIDER` | `PERIODIC_PROVIDER_WITH_TRANSACTION_TAX_POINT` | MY-PRI-001; MY-PRI-002; MY-PRI-004 |
| `PH-B2B-01` | Philippines | `PHILIPPINE_BUYER_WITHHOLDING_AGENT` | `BUYER_WITHHOLDING` | PH-PRI-001; PH-PRI-003; PH-PRI-004 |
| `PH-B2C-01` | Philippines | `NONRESIDENT_DIGITAL_SERVICE_PROVIDER` | `PROVIDER_REMITTANCE` | PH-PRI-001; PH-PRI-004; PH-PRI-005; PH-PRI-006 |
| `PH-MKT-01` | Philippines | `QUALIFYING_E_MARKETPLACE` | `MARKETPLACE_REMITTANCE` | PH-PRI-002; PH-PRI-004 |
| `TH-VES-01` | Thailand | `FOREIGN_PROVIDER` | `CONDITIONAL_PLATFORM_PROCESS_PLUS_PERIODIC_FILING` | TH-PRI-001; TH-PRI-002; TH-PRI-003; TH-PRI-004 |
| `VN-SELLER-01` | Vietnam | `PAYMENT_CAPABLE_PLATFORM` | `PER_TRANSACTION_WITHHOLDING` | VN-PRI-001; VN-PRI-002; VN-PRI-004; VN-PRI-005 |

## Findings that are mechanically supported by the coding

1. **The five-country sample is not one-node homogeneous.** The coded paths place responsibility on several distinct node classes rather than one generic `platform` actor.
2. **Event coupling is heterogeneous.** The coded paths contain multiple timing/rail classes; the package therefore should not collapse them into a single maturity ordering.
3. **Country is sometimes too coarse a unit.** The Philippines currently requires separate B2C, B2B, and marketplace paths, demonstrating why transaction-path coding is analytically safer than one country-wide label.
4. **Node locus and event coupling are not encoded as the same variable.** They are stored in separate fields and must remain separately reviewable.
5. **The coded paths span more than one legal object.** Cross-case comparison is therefore limited to the administrative transaction-node layer; bases, liabilities, revenues, and welfare effects are not pooled.

## Findings this file cannot establish

This derivation does **not** establish which architecture is more effective, fair, efficient, privacy-preserving, enforceable, revenue-productive, or welfare-enhancing. It also does not identify why a legislature selected a node. Those require additional outcome, institutional, and identification evidence.

## Regeneration

Run:

```bash
python IE-JDE/Digital_Tax_Design/rebuilt_2026/derive_comparative_findings.py
```

CI uses `--check` to fail if this file drifts from `COUNTRY_PATH_CODINGS.csv`.
