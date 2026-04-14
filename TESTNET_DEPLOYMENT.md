# TESTNET DEPLOYMENT

## Goal

Publish external proof that the current protocol stack is deployed and inspectable on testnet.

## Target

Polygon Amoy (or equivalent supported testnet if Amoy is unavailable).

## Prerequisites

- funded testnet wallet/private key
- RPC access in `.env`
- deployment script access

## Canonical command

```bash
./scripts/deploy_amoy.sh
```

## Expected outputs

1. network-scoped deployment receipt
2. contract addresses
3. explorer links
4. minimal interaction proof

## Interaction proof command

After deployment receipt exists, run:

```bash
PROOF_NETWORK=amoy npm run proof:interaction
PROOF_NETWORK=amoy npm run proof:publish
```

This writes:

- `state/deployments/amoy_interaction_proof.json`
- `docs/project/INTERACTION_PROOF_REPORT.md`
- `CONTRACT_ADDRESSES.md`
- `docs/project/PUBLIC_PROOF_STATUS.md`

Note: run this on a persistent network (`amoy` or `localhost`), not ephemeral `hardhat`.

## Publish checklist

1. update `CONTRACT_ADDRESSES.md` with real addresses and links
2. add walkthrough notes to `DEMO_WALKTHROUGH.md`
3. update status in `CURRENT_STATUS.md`
4. ensure README status line stays honest

## Current state

Deployment path is ready. Public Amoy proof is pending funded wallet/private key.
