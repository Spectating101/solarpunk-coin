# Product Launch Gate

- generated_at: `2026-05-16T16:51:03.423Z`
- decision: Launch the SolarPunk Public Lab; keep closed-pilot and paid/mainnet gates blocked until their missing controls are resolved.
- recommended_current_launch: `public_testnet_product`
- next_build_target: `closed_testnet_pilot`

## Mode Status

| Mode | Status | Passed | Blocking |
|---|---:|---:|---:|
| SolarPunk Public Lab | `launchable` | 8 | 0 |
| Closed testnet pilot | `blocked` | 9 | 2 |
| Paid/mainnet product | `blocked` | 9 | 6 |

## Next Actions

- Launch the SolarPunk Public Lab now: demo, docs, Sepolia proof, and meter CSV onboarding.
- Next build target: governed attested-SPK redeploy plus one real meter or inverter adapter.
- Use the monetary stress harness to size any named reserve before promising redemption.
- Keep paid/mainnet launch blocked until audit, legal scope, redemption policy, and shortfall policy are resolved.

## SolarPunk Public Lab

- PASS `SPK product proof exists`: Signed meter bundle to SPK mint proof is present.
  Evidence: `docs/product/SPK_ATTESTED_MINT_PROOF.md`
- PASS `Sepolia readback passes`: Public readback confirms tx success, consumed attestation hash, consumed source hash, recipient balance, and cumulative surplus.
  Evidence: `docs/product/SPK_PUBLIC_READBACK.md`
- PASS `Source verified proof stack`: Attested SPK proof contracts are source-verified on Sepolia.
  Evidence: `docs/project/ATTESTED_SPK_DEPLOYMENT.md`
- PASS `Daily keeper evidence is fresh`: Latest keeper run is 2026-05-16 (0 days old).
  Evidence: `docs/project/DAILY_EXPERIMENT_STATUS.md`
- PASS `Frontend proof surface exists`: Frontend has proof dashboard and SPK mint product surface.
  Evidence: `frontend/src`
- PASS `Pilot CSV receipt exists`: Pilot CSV receipt produces accepted readings, source hash, and SPK mint preview.
  Evidence: `docs/product/PILOT_CSV_RECEIPT.md`
- PASS `Monetary stress harness passes`: Redemption-wave and shortfall scenarios preserve accounting conservation and expose reserve gaps.
  Evidence: `docs/product/MONETARY_STRESS_HARNESS.md`
- PASS `Energy-money simulation exists`: Measured keeper resource signals drive a transparent SPK issuance, settlement, redemption, and reserve simulation.
  Evidence: `docs/product/ENERGY_MONEY_SIMULATION.md`

## Closed testnet pilot

- PASS `SPK product proof exists`: Signed meter bundle to SPK mint proof is present.
  Evidence: `docs/product/SPK_ATTESTED_MINT_PROOF.md`
- PASS `Sepolia readback passes`: Public readback confirms tx success, consumed attestation hash, consumed source hash, recipient balance, and cumulative surplus.
  Evidence: `docs/product/SPK_PUBLIC_READBACK.md`
- PASS `Source verified proof stack`: Attested SPK proof contracts are source-verified on Sepolia.
  Evidence: `docs/project/ATTESTED_SPK_DEPLOYMENT.md`
- PASS `Daily keeper evidence is fresh`: Latest keeper run is 2026-05-16 (0 days old).
  Evidence: `docs/project/DAILY_EXPERIMENT_STATUS.md`
- PASS `Frontend proof surface exists`: Frontend has proof dashboard and SPK mint product surface.
  Evidence: `frontend/src`
- PASS `Pilot CSV receipt exists`: Pilot CSV receipt produces accepted readings, source hash, and SPK mint preview.
  Evidence: `docs/product/PILOT_CSV_RECEIPT.md`
- PASS `Monetary stress harness passes`: Redemption-wave and shortfall scenarios preserve accounting conservation and expose reserve gaps.
  Evidence: `docs/product/MONETARY_STRESS_HARNESS.md`
- PASS `Energy-money simulation exists`: Measured keeper resource signals drive a transparent SPK issuance, settlement, redemption, and reserve simulation.
  Evidence: `docs/product/ENERGY_MONEY_SIMULATION.md`
- BLOCK `Governed attested-SPK deployment`: Current attested deployment scope is public-attested-spk-proof; closed pilot needs governed Safe/admin role separation.
  Evidence: `state/deployments/sepolia_attested_spk_deploy.json`
- BLOCK `Real meter or inverter adapter`: Current batch batch_2026_02_12_a is fixture/proof data; closed pilot needs one real meter or inverter export.
  Evidence: `docs/project/METER_CSV_IMPORT.md`
- PASS `Pilot terms are drafted`: Pilot plan exists; it still needs named counterparty details before execution.
  Evidence: `docs/specs/PILOT_PLAN.md`
- PASS `Governance runbook exists`: Governance status includes operations handbook and role matrix.
  Evidence: `docs/project/GOVERNANCE_STATUS.md`
- PASS `Pilot-stack deploy/readback scaffold exists`: Governed SPK + treasury + currency-system pilot stack has deployment and readback scripts.
  Evidence: `docs/project/PILOT_STACK_DEPLOYMENT.md`

## Paid/mainnet product

- PASS `SPK product proof exists`: Signed meter bundle to SPK mint proof is present.
  Evidence: `docs/product/SPK_ATTESTED_MINT_PROOF.md`
- PASS `Sepolia readback passes`: Public readback confirms tx success, consumed attestation hash, consumed source hash, recipient balance, and cumulative surplus.
  Evidence: `docs/product/SPK_PUBLIC_READBACK.md`
- PASS `Source verified proof stack`: Attested SPK proof contracts are source-verified on Sepolia.
  Evidence: `docs/project/ATTESTED_SPK_DEPLOYMENT.md`
- PASS `Daily keeper evidence is fresh`: Latest keeper run is 2026-05-16 (0 days old).
  Evidence: `docs/project/DAILY_EXPERIMENT_STATUS.md`
- PASS `Frontend proof surface exists`: Frontend has proof dashboard and SPK mint product surface.
  Evidence: `frontend/src`
- PASS `Pilot CSV receipt exists`: Pilot CSV receipt produces accepted readings, source hash, and SPK mint preview.
  Evidence: `docs/product/PILOT_CSV_RECEIPT.md`
- PASS `Monetary stress harness passes`: Redemption-wave and shortfall scenarios preserve accounting conservation and expose reserve gaps.
  Evidence: `docs/product/MONETARY_STRESS_HARNESS.md`
- PASS `Energy-money simulation exists`: Measured keeper resource signals drive a transparent SPK issuance, settlement, redemption, and reserve simulation.
  Evidence: `docs/product/ENERGY_MONEY_SIMULATION.md`
- BLOCK `Governed attested-SPK deployment`: Current attested deployment scope is public-attested-spk-proof; closed pilot needs governed Safe/admin role separation.
  Evidence: `state/deployments/sepolia_attested_spk_deploy.json`
- BLOCK `Real meter or inverter adapter`: Current batch batch_2026_02_12_a is fixture/proof data; closed pilot needs one real meter or inverter export.
  Evidence: `docs/project/METER_CSV_IMPORT.md`
- PASS `Pilot terms are drafted`: Pilot plan exists; it still needs named counterparty details before execution.
  Evidence: `docs/specs/PILOT_PLAN.md`
- PASS `Governance runbook exists`: Governance status includes operations handbook and role matrix.
  Evidence: `docs/project/GOVERNANCE_STATUS.md`
- PASS `Pilot-stack deploy/readback scaffold exists`: Governed SPK + treasury + currency-system pilot stack has deployment and readback scripts.
  Evidence: `docs/project/PILOT_STACK_DEPLOYMENT.md`
- BLOCK `External audit complete`: External audit status is NOT_STARTED; paid/mainnet launch remains blocked.
  Evidence: `docs/project/SECURITY_AUDIT_STATUS.json`
- BLOCK `Legal and commercial scope complete`: No launch terms file exists for token classification, redemption obligations, user eligibility, and jurisdictional limits.
  Evidence: `docs/product/LEGAL_AND_COMMERCIAL_SCOPE.md`
- BLOCK `Production redemption policy complete`: No production redemption policy exists for what SPK holders can redeem, from whom, and under which caps.
  Evidence: `docs/product/REDEMPTION_POLICY.md`
- BLOCK `Mainnet or L2 production deployment recorded`: No production deployment receipt exists.
  Evidence: `state/deployments/production_spk_deploy.json`
