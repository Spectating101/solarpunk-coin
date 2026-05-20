# SolarPunk Intelligence Layer v0

Off-chain AI/statistical intelligence for renewable-energy mint claims. AI advises; contracts decide.

## Current Result

- generated_at: `2026-05-20T19:43:32.628Z`
- implementation_stage: `deterministic_statistical_mvp_no_llm_required`
- advisory_only: `true`
- overall_risk: `normal_public_lab_fixture`
- rows_scored: `7`
- max_anomaly_score: `0`
- provenance_level: `L0`

## Audit Dossier

- operator_submitted: 235.7 kWh generation, 103.8 kWh eligible surplus
- expected_range: 17.8761-42.6276 kWh/day
- deviation: 22.434% average daily deviation from NASA/PV benchmark
- risk: `normal_public_lab_fixture`
- review_note: Energy values are statistically plausible for a public-lab sample, but L0 provenance means the data cannot support real-value SPK issuance.
- contract_boundary: AI advises; contracts decide. SPK minting still depends on signed attestations, replay protection, oracle roles, source-hash uniqueness, reserve checks, and contract rules.

## Scored Rows

| Date | Generation kWh | Expected kWh | Range kWh | Deviation | Score | Risk | Flags |
|---|---:|---:|---:|---:|---:|---|---|
| 2026-05-01 | 31.2 | 27.5017 | 17.8761-42.6276 | 13.4475% | 0 | `normal` | within_expected_range |
| 2026-05-02 | 28.6 | 27.5017 | 17.8761-42.6276 | 3.9936% | 0 | `normal` | within_expected_range |
| 2026-05-03 | 34.9 | 27.5017 | 17.8761-42.6276 | 26.9012% | 0 | `normal` | within_expected_range |
| 2026-05-04 | 41.3 | 27.5017 | 17.8761-42.6276 | 50.1725% | 0 | `normal` | within_expected_range |
| 2026-05-05 | 22.4 | 27.5017 | 17.8761-42.6276 | -18.5505% | 0 | `normal` | within_expected_range |
| 2026-05-06 | 37.8 | 27.5017 | 17.8761-42.6276 | 37.446% | 0 | `normal` | within_expected_range |
| 2026-05-07 | 39.5 | 27.5017 | 17.8761-42.6276 | 43.6275% | 0 | `normal` | within_expected_range |

## AI Boundary

> AI advises; contracts decide.

- This layer does not mint SPK and does not approve SPK minting.
- It does not prove physical truth; it flags whether reported values look plausible against a resource baseline.
- Current sample is L0 public-lab data, so real-value issuance remains blocked even when risk is normal.
- Production use would need real operator data, stronger hardware provenance, audit scope, and legal redemption terms.

## Contract Authority Remains Deterministic

- registered signatures
- oracle role
- source-hash replay protection
- attestation validity windows
- reserve and grid-stress controls
- supply cap and fee logic
