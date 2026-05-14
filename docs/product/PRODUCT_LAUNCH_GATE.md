# Product Launch Gate

- generated_at: `2026-05-14T15:44:15.575Z`
- decision: Launch the public testnet product surface; keep closed-pilot and paid/mainnet gates blocked until their missing controls are resolved.
- recommended_current_launch: `public_testnet_product`
- next_build_target: `closed_testnet_pilot`

## Mode Status

| Mode | Status | Passed | Blocking |
|---|---:|---:|---:|
| Public testnet product | `launchable` | 5 | 0 |
| Closed testnet pilot | `blocked` | 6 | 2 |
| Paid/mainnet product | `blocked` | 6 | 6 |

## Next Actions

- Launch the public testnet product surface now: demo, docs, Sepolia proof, and meter CSV onboarding.
- Next build target: governed attested-SPK redeploy plus one real meter or inverter adapter.
- Keep paid/mainnet launch blocked until audit, legal scope, and redemption policy are resolved.

## Public testnet product

- PASS `SPK product proof exists`: Signed meter bundle to SPK mint proof is present.
  Evidence: `docs/product/SPK_ATTESTED_MINT_PROOF.md`
- PASS `Sepolia readback passes`: Public readback confirms tx success, consumed attestation hash, consumed source hash, recipient balance, and cumulative surplus.
  Evidence: `docs/product/SPK_PUBLIC_READBACK.md`
- PASS `Source verified proof stack`: Attested SPK proof contracts are source-verified on Sepolia.
  Evidence: `docs/project/ATTESTED_SPK_DEPLOYMENT.md`
- PASS `Daily keeper evidence is fresh`: Latest keeper run is 2026-05-14 (0 days old).
  Evidence: `docs/project/DAILY_EXPERIMENT_STATUS.md`
- PASS `Frontend proof surface exists`: Frontend has proof dashboard and SPK mint product surface.
  Evidence: `frontend/src`

## Closed testnet pilot

- PASS `SPK product proof exists`: Signed meter bundle to SPK mint proof is present.
  Evidence: `docs/product/SPK_ATTESTED_MINT_PROOF.md`
- PASS `Sepolia readback passes`: Public readback confirms tx success, consumed attestation hash, consumed source hash, recipient balance, and cumulative surplus.
  Evidence: `docs/product/SPK_PUBLIC_READBACK.md`
- PASS `Source verified proof stack`: Attested SPK proof contracts are source-verified on Sepolia.
  Evidence: `docs/project/ATTESTED_SPK_DEPLOYMENT.md`
- PASS `Daily keeper evidence is fresh`: Latest keeper run is 2026-05-14 (0 days old).
  Evidence: `docs/project/DAILY_EXPERIMENT_STATUS.md`
- PASS `Frontend proof surface exists`: Frontend has proof dashboard and SPK mint product surface.
  Evidence: `frontend/src`
- BLOCK `Governed attested-SPK deployment`: Current attested deployment scope is public-attested-spk-proof; closed pilot needs governed Safe/admin role separation.
  Evidence: `state/deployments/sepolia_attested_spk_deploy.json`
- BLOCK `Real meter or inverter adapter`: Current batch batch_2026_02_12_a is fixture/proof data; closed pilot needs one real meter or inverter export.
  Evidence: `docs/project/METER_CSV_IMPORT.md`
- PASS `Pilot terms are drafted`: Pilot plan exists; it still needs named counterparty details before execution.
  Evidence: `docs/specs/PILOT_PLAN.md`
- PASS `Governance runbook exists`: Governance status includes operations handbook and role matrix.
  Evidence: `docs/project/GOVERNANCE_STATUS.md`

## Paid/mainnet product

- PASS `SPK product proof exists`: Signed meter bundle to SPK mint proof is present.
  Evidence: `docs/product/SPK_ATTESTED_MINT_PROOF.md`
- PASS `Sepolia readback passes`: Public readback confirms tx success, consumed attestation hash, consumed source hash, recipient balance, and cumulative surplus.
  Evidence: `docs/product/SPK_PUBLIC_READBACK.md`
- PASS `Source verified proof stack`: Attested SPK proof contracts are source-verified on Sepolia.
  Evidence: `docs/project/ATTESTED_SPK_DEPLOYMENT.md`
- PASS `Daily keeper evidence is fresh`: Latest keeper run is 2026-05-14 (0 days old).
  Evidence: `docs/project/DAILY_EXPERIMENT_STATUS.md`
- PASS `Frontend proof surface exists`: Frontend has proof dashboard and SPK mint product surface.
  Evidence: `frontend/src`
- BLOCK `Governed attested-SPK deployment`: Current attested deployment scope is public-attested-spk-proof; closed pilot needs governed Safe/admin role separation.
  Evidence: `state/deployments/sepolia_attested_spk_deploy.json`
- BLOCK `Real meter or inverter adapter`: Current batch batch_2026_02_12_a is fixture/proof data; closed pilot needs one real meter or inverter export.
  Evidence: `docs/project/METER_CSV_IMPORT.md`
- PASS `Pilot terms are drafted`: Pilot plan exists; it still needs named counterparty details before execution.
  Evidence: `docs/specs/PILOT_PLAN.md`
- PASS `Governance runbook exists`: Governance status includes operations handbook and role matrix.
  Evidence: `docs/project/GOVERNANCE_STATUS.md`
- BLOCK `External audit complete`: External audit status is NOT_STARTED; paid/mainnet launch remains blocked.
  Evidence: `docs/project/SECURITY_AUDIT_STATUS.json`
- BLOCK `Legal and commercial scope complete`: No launch terms file exists for token classification, redemption obligations, user eligibility, and jurisdictional limits.
  Evidence: `docs/product/LEGAL_AND_COMMERCIAL_SCOPE.md`
- BLOCK `Production redemption policy complete`: No production redemption policy exists for what SPK holders can redeem, from whom, and under which caps.
  Evidence: `docs/product/REDEMPTION_POLICY.md`
- BLOCK `Mainnet or L2 production deployment recorded`: No production deployment receipt exists.
  Evidence: `state/deployments/production_spk_deploy.json`
