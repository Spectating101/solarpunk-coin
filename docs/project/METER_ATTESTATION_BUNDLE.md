# Meter Attestation Bundle

Derived from signed raw meter readings and a meter registry.

- generated_at: `2026-05-14T10:43:06.622Z`
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

- `TW-TY-0001` | `1420.5` | `4584ac821c931b4af028aecd3cf79e7bae33df0562a5cb62a07475b80a7f9397`
- `TW-TY-0002` | `1186.2` | `5b91153b2b827dbf11a26c41c8b8b0cc293af49535054990516ddcbbafb31a21`

## Rejected

- index `2`, meter `TW-TY-0001`: duplicate meter nonce
- index `3`, meter `TW-TY-0002`: quality_score below threshold (0.9)
