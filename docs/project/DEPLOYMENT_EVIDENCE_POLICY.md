# Deployment Evidence Policy

## Purpose
Define the minimum machine-verifiable evidence required for expansion/mainnet gate decisions.

## Required Artifacts
1. Deployment receipt:
- `state/deployments/amoy_receipt.json`
- Built with:
  - Preferred (auto-ingests from `state/deployments/<network>_full_deploy.json`):
    - `python3 scripts/build_deployment_receipt.py --network amoy`
  - Manual override (if you already have addresses/tx hashes):
    - `python3 scripts/build_deployment_receipt.py --network amoy --coin-address <addr> --option-address <addr> --coin-tx-hash <tx> --option-tx-hash <tx>`

2. Deployment validation:
- `state/deployments/deployment_receipt_validation.json`
- Built with:
  - `python3 scripts/validate_deployment_receipt.py`

3. On-chain confirmation report:
- `state/deployments/onchain_confirmation_report.json`
- Built with:
  - `python3 scripts/confirm_deployment_onchain.py`

## Canonical Source Of Truth
- On-chain deploy output must be captured in a network-scoped receipt:
  - `state/deployments/<network>_full_deploy.json` (produced by `scripts/deploy_testnet_full.js`)
- Do not use ambiguous dotfiles like `.testnet_address` as evidence (they are intentionally not generated anymore).

## Pass Criteria
- `receipt_status == CONFIRMED`
- `onchain_confirmed == true`
- Valid SPK and Option contract addresses
- Valid deployment tx hashes for both SPK and Option
- Validation artifact has `validation_passed == true`

## Failure Behavior
If validation fails, Phase-3 gate must remain `NO_GO`.
No expansion/mainnet claim is allowed.
