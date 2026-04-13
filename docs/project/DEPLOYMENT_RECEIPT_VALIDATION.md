# Deployment Receipt Validation

- generated_at: `2026-04-13T06:16:45.784058+00:00`
- validation_passed: `False`
- receipt_status: `PENDING_CONFIRMATION`
- onchain_confirmed: `False`

## Checks

- has_coin_address: `False`
- has_option_address: `False`
- has_coin_tx_hash: `False`
- has_option_tx_hash: `False`
- has_confirmed_flag: `True`
- onchain_confirmed_true: `False`
- receipt_status_confirmed: `False`

## Errors

- Invalid or missing solarpunk_coin address.
- Invalid or missing solarpunk_option address.
- Missing or invalid coin_deploy_tx_hash.
- Missing or invalid option_deploy_tx_hash.
- onchain_confirmed must be true for expansion gate.
- receipt_status must be CONFIRMED.
