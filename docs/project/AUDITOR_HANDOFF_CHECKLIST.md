# Auditor Handoff Checklist

## Objective

Provide a complete package an external auditor can start from without ad-hoc discovery.

## Required artifacts

- [ ] Scope contracts finalized (`SolarPunkCoin`, `SolarPunkOption`, `ProtocolTreasury`, `MockUSDC` as test token)
- [ ] Target network + deployment assumptions documented
- [ ] Role and permission matrix shared
- [ ] Invariant checklist shared
- [ ] Threat model shared
- [ ] Trust assumptions shared
- [ ] Public proof status attached (`docs/project/PUBLIC_PROOF_STATUS.md`)

## Configuration handoff

- [ ] Current fee parameters
- [ ] Current bond requirement parameters
- [ ] Current treasury budget policy and vault targets
- [ ] Current role assignments and operator model

## Verification inputs

- [ ] Test command list (`npx hardhat test --no-compile`)
- [ ] Deploy command list (`scripts/deploy_testnet_full.js`, `scripts/deploy.js`, `scripts/deploy_pillar3.js`)
- [ ] Interaction proof command (`PROOF_NETWORK=amoy npm run proof:interaction`)

## Known limitations to disclose

- [ ] Public Amoy proof publish status
- [ ] Audit not yet completed
- [ ] Pilot counterparties not yet secured
- [ ] Governance still centralized relative to end-state

## Exit criteria for “audit-ready”

1. package complete with no missing artifacts above
2. no stale claims in status docs
3. deploy and interaction proof paths reproducible by reviewer
