# Pilot Operating SLO

## SLO Targets (Pilot)
1. Verification freshness:
- `verify_health.json` updated within previous 24 hours.

2. Attestation freshness:
- `latest_attestation_bundle.json` updated within previous 24 hours.

3. Integrity:
- `overall_status=ok` and `warnings=0`.

4. Reproducibility:
- Project cycle and gate scripts produce deterministic artifacts.

## Error Budget
- Maximum 1 failed daily cycle per 14-day window during pilot.
