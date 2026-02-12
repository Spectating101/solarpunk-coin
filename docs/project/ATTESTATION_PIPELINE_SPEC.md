# Attestation Pipeline Spec

## Goal
Convert physical surplus-energy telemetry into deterministic protocol input artifacts.

## Input
- Source file: `data/attestations/*.json`
- Required record fields:
  - `meter_id`, `site_id`, `window_start`, `window_end`, `surplus_kwh`
  - `quality_score`, `source`, `attestor`

## Processing
- Command:
  - `python3 scripts/ingest_meter_attestations.py --input data/attestations/sample_meter_attestations.json`
- Validation rules:
  - `surplus_kwh > 0`
  - `quality_score in [0,1]`
  - `quality_score >= threshold` (default 0.9)
- Normalization:
  - UTC timestamps
  - Deterministic `record_hash` per accepted record

## Outputs
- Machine artifact:
  - `artifacts/attestations/latest_attestation_bundle.json`
- Human artifact:
  - `docs/project/METER_ATTESTATION_BUNDLE.md`

## Integration Point
Accepted totals from attestation bundle are the only eligible upstream input for surplus minting workflows.
