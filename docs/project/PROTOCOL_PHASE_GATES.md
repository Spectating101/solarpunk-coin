# Protocol Phase Gates

- generated_at: `2026-02-11T18:02:06.655144+00:00`
- target_phase: `3`
- target_phase_key: `phase_3_market_expansion_readiness`
- target_phase_passed: `False`
- decision: `NO_GO`

## Phase Status

- phase_0_protocol_integrity: `PASS`
- phase_0_protocol_integrity_description: Protocol integrity and deterministic verification
- phase_0_protocol_integrity_blocker: none

- phase_1_controlled_monetary_pilot: `PASS`
- phase_1_controlled_monetary_pilot_description: Controlled pilot operations with monetary + risk stack
- phase_1_controlled_monetary_pilot_blocker: none

- phase_2_live_attestation_hardening: `PASS`
- phase_2_live_attestation_hardening_description: Live attestation and oracle hardening
- phase_2_live_attestation_hardening_blocker: none

- phase_3_market_expansion_readiness: `FAIL`
- phase_3_market_expansion_readiness_description: Expansion readiness under production controls
- phase_3_market_expansion_readiness_blocker: Deployment receipt validation has not passed.
- phase_3_market_expansion_readiness_blocker: Security audit validation has not passed.

## Next Actions

- Run `bash scripts/run_project_operating_cycle.sh` before gate evaluation.
- Use `python3 scripts/build_protocol_phase_gates.py --target-phase N --strict` for hard gate enforcement.
- Advance one phase at a time; do not skip blockers.
