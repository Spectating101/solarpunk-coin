# Governance Status

- generated_at: `2026-04-14T12:41:25.412719+00:00`
- governance_status: `READY_INTERNAL`
- recommendation: `MAINTAIN`

## Control Checks

- coin_timelock_controls_present: `True`
- option_timelock_controls_present: `True`
- treasury_timelock_controls_present: `True`
- coin_operator_action_id_present: `True`
- option_operator_action_id_present: `True`
- treasury_operator_action_id_present: `True`
- ops_handbook_present: `True`
- role_matrix_present: `True`
- audit_handoff_checklist_present: `True`
- governance_deploy_wiring_present: `True`

## Latest Deployment Governance Context

- network: `localhost`
- governance_admin: `None`
- strict_admin_handoff: `None`
- governance_delays_seconds: `{}`

## Governance Cadence

- recommended_review_period_days: `14`
- required_artifact: `docs/project/GOVERNANCE_STATUS.json`
- required_artifact: `docs/project/GOVERNANCE_STATUS.md`
- required_artifact: `docs/project/ROLE_PERMISSION_MATRIX.md`
- required_artifact: `docs/project/PROJECT_OPERATIONS.md`
- change_trace_field: `action_id`
- change_trace_field: `queued_tx_hash`
- change_trace_field: `executed_tx_hash`
- change_trace_field: `function_name`
- change_trace_field: `params_digest`

## Next Actions

- Refresh governance status artifact every cadence cycle.
- Use timelock queue/consume for critical parameter changes when governance delay is enabled.
- Record queue and execution tx hashes for each governance action.
