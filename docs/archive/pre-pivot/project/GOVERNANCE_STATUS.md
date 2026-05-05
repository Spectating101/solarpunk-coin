# Governance Status

> [!WARNING]
> **Point-in-time snapshot (2026-04-20 pre-final hardening record).** Fields below may conflict with current deployment state.
>
> Use `CURRENT_STATUS.md`, `EVIDENCE.md`, and `CONTRACT_ADDRESSES.md` for current governance/admin state.

- generated_at: 2026-04-20
- governance_status: READY_INTERNAL
- recommendation: HARDEN_BEFORE_MAINNET

## Control Checks

- coin_timelock_controls_present: true
- option_timelock_controls_present: true
- treasury_timelock_controls_present: true
- coin_operator_action_id_present: true
- option_operator_action_id_present: true
- treasury_operator_action_id_present: true
- ops_handbook_present: true
- role_matrix_present: true
- audit_handoff_checklist_present: true
- handoff_admin_function_present: true

## Current Deployment Governance Context

- network: sepolia
- deployer: 0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54
- governance_admin: deployer (single EOA)
- strict_admin_handoff: false
- governance_delays_seconds: 0 (all contracts)
- bond_requirements: 0 (all roles)

## What this means

Governance infrastructure is implemented and verified. All timelock, role-gating, and
handoff mechanisms are in place and tested (77/77). However, the current deployment
uses zero delays and a single EOA admin — appropriate for testnet, not for mainnet.

## Required hardening before mainnet

1. Set governanceDelay >= 86400 (24h) on all three contracts
2. Set non-zero bond requirements for minter, oracle, liquidator
3. Transfer admin to multisig via handoffAdmin() (SolarPunkCoin) and role grants (others)
4. Point stabilityPool to a dedicated address
5. Configure real budget vault addresses

## Governance Cadence (when active)

- recommended review period: 14 days
- change trace fields: action_id, queued_tx_hash, executed_tx_hash, function_name
- all privileged parameter changes must go through timelock queue/consume cycle
