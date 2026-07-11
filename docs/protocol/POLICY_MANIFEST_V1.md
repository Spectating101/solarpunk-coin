# Constraint Policy Manifest v1

Public Alpha treats policies as versioned, hashable rule objects rather than hard-coded product narratives.

## Minimum manifest shape

```json
{
  "id": "ENERGY-PILOT-002",
  "version": "1.0.0",
  "name": "Risk-boxed Energy Pilot",
  "min_provenance_level": "L2",
  "admission": {
    "require_positive_surplus": true,
    "require_zero_blockers": true,
    "require_signed_evidence": true,
    "require_external_corroboration": false
  },
  "issuance": {
    "unit": "ENERGY_CLAIM_UNIT",
    "rate_per_surplus_kwh": 1,
    "haircut_pct": 30,
    "absolute_cap": 2500
  },
  "settlement": {
    "explicit_capacity_required": true,
    "legal_redemption_not_implied": true
  },
  "governance": {
    "authority": "named pilot policy authority",
    "mutable_by": "governed policy registry"
  }
}
```

## Evaluation order

1. Check provenance rank against the policy minimum.
2. Check positive admitted surplus when required.
3. Check evidence blockers.
4. Check signature capability when required.
5. Check external corroboration when required.
6. Compute gross claim quantity from evidence surplus and policy rate.
7. Apply the policy haircut.
8. Apply the absolute policy cap.
9. Return `ADMIT_WITH_LIMIT` or `BLOCKED` with explicit reasons.

## Public-alpha policies

| Policy | Min provenance | Signed | External corroboration | Haircut | Cap |
|---|---|---|---|---:|---:|
| `LAB-OPEN-001` | L0 | no | no | 0% | 10,000 |
| `ENERGY-PILOT-002` | L2 | yes | no | 30% | 2,500 |
| `ENERGY-STRICT-003` | L4 | yes | yes | 5% | 50,000 |
| `SPK-ENERGY-001` | L1 | yes | no | 60% | 250 |

`LAB-OPEN-001` is deliberately non-live and illustrative. It exists to make the public workbench executable without misrepresenting sample evidence as pilot-grade provenance.

## Registry relationship

`PolicyRegistry.sol` stores:

- policy identifier;
- monotonically increasing numeric registry version;
- manifest hash;
- publisher/authority;
- active flag;
- external URI.

Policy execution remains deterministic off-chain in Public Alpha. The registry makes policy identity and version history publicly inspectable without pretending Solidity should parse arbitrary evidence formats.
