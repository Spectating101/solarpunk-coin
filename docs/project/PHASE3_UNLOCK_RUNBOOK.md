# Phase-3 Unlock Runbook

## Objective
Move `phase_3_market_expansion_readiness` from `NO_GO` to `GO` using machine-validated evidence.

## Preconditions
- Phase 0-2 already passing.
- Valid deployment tx hashes and addresses are available.
- External audit completed with report URL and no open critical/high findings.

## Step 1: Build/confirm deployment evidence
1. Deploy contracts (preferred):
- `npx hardhat run scripts/deploy_testnet_full.js --network amoy`
- This produces: `state/deployments/amoy_full_deploy.json`
2. Build receipt (auto-ingests from `amoy_full_deploy.json`):
- `python3 scripts/build_deployment_receipt.py --network amoy`
   Manual override (if needed):
   `python3 scripts/build_deployment_receipt.py --network amoy --coin-address <SPK_ADDR> --option-address <OPTION_ADDR> --coin-tx-hash <SPK_TX> --option-tx-hash <OPTION_TX>`
3. Confirm on-chain:
- `python3 scripts/confirm_deployment_onchain.py --strict`
4. Validate receipt:
- `python3 scripts/validate_deployment_receipt.py --strict`

## Step 2: Record audit completion evidence
1. Update canonical audit status:
- `python3 scripts/record_audit_update.py --status COMPLETED --auditor "<AUDITOR>" --report-url "https://..." --completed-at "2026-02-12T00:00:00Z" --critical-open 0 --high-open 0 --medium-open <N> --low-open <N> --resolved-total <N>`
2. Render markdown snapshot:
- `python3 scripts/render_security_audit_status.py`
3. Validate audit evidence:
- `python3 scripts/validate_audit_status.py --strict`

## Step 3: Enforce Phase-3 gate
- `python3 scripts/build_protocol_phase_gates.py --target-phase 3 --strict`

Expected:
- `docs/project/PROTOCOL_PHASE_GATES.md` shows `phase_3_market_expansion_readiness: PASS`.
- Exit code is `0`.

## Notes
- If any strict command fails, do not claim expansion readiness.
- Use `bash scripts/run_project_operating_cycle.sh` before final gate run for fresh artifacts.
