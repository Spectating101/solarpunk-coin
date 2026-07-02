# Meter Attestation Bundle

Derived from signed raw meter readings and a meter registry.

- generated_at: `2026-06-28T17:36:13.890Z`
- batch_id: `batch_2026_02_12_a`
- source_schema: `SPK_RAW_METER_READINGS_V1`
- min_quality_threshold: `0.9`

## Summary

- input_records: `4`
- accepted_records: `2`
- rejected_records: `2`
- verified_signatures: `2`
- total_surplus_kwh: `2606.7`

## Accepted (meter_id, surplus_kwh, record_hash)

- `TW-TY-0001` | `1420.5` | `267138999bc5b3118e584507a6c9d64965d0d3787e659baf64a758276f97b720`
- `TW-TY-0002` | `1186.2` | `70787add83de9f866e5de3a98dc6fcbd9d670ed7329cd0b2587f50215e236145`

## Rejected

- index `2`, meter `TW-TY-0001`: duplicate meter nonce
- index `3`, meter `TW-TY-0002`: quality_score below threshold (0.9)
