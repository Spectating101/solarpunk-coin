# Checkpoint Manifest — 2026-05-14

This manifest classifies the current worktree so the repo can be checkpointed without mixing product proof work with unrelated research or generated dependency noise.

## Checkpoint Theme

Energy-attestation SPK product proof:

```text
registered meter readings -> verified surplus bundle -> source hash -> oracle signature -> replay-protected SPK mint
```

## Include In The Checkpoint

### Contract And Tests

- `contracts/SolarPunkCoin.sol`
- `test/SolarPunkCoin.test.js`
- `test-node/`
- `package.json`
- `hardhat.config.js`

Reason: these implement and verify the attested SPK mint path and make `npm test` reproducible.

### Meter / Attestation Scripts

- `scripts/build_signed_meter_fixture.js`
- `scripts/derive_meter_attestations.js`
- `scripts/import_meter_csv.js`
- `scripts/onboard_meter.js`
- `scripts/mint_spk_from_meter_bundle.js`
- `scripts/verify_spk_public_readback.js`
- `scripts/sepolia_attested_spk_preflight.js`
- `scripts/deploy_attested_spk_public_proof.js`
- `scripts/build_spk_product_empirics.py`

Reason: these are the executable proof path and pilot-ingestion bridge.

### Proof Data And State

- `data/attestations/`
- `state/attestations/`
- `state/deployments/sepolia_attested_spk_deploy.json`
- `state/deployments/sepolia_attested_spk_preflight.json`
- `state/proofs/sepolia_spk_attested_mint_proof.json`
- `state/proofs/sepolia_spk_public_readback.json`
- `state/proofs/spk_product_empirics.json`

Reason: these are reviewer receipts for the public Sepolia proof and meter-bundle pipeline.

Optional:

- `state/proofs/hardhat_spk_attested_mint_proof.json`

Reason: useful as a local reproducibility receipt, but not required for external reviewers because the Sepolia proof is stronger.

### Product / Reviewer Documentation

- `README.md`
- `CURRENT_STATUS.md`
- `EVIDENCE.md`
- `PRODUCT_LAUNCH_READINESS.md`
- `CONTRACT_ADDRESSES.md`
- `docs/product/`
- `docs/specs/METER_ATTESTATION_SPEC.md`
- `docs/project/ATTESTED_SPK_DEPLOYMENT.md`
- `docs/project/METER_ATTESTATION_BUNDLE.md`
- `docs/project/METER_CSV_ATTESTATION_BUNDLE.md`
- `docs/project/METER_CSV_IMPORT.md`
- `docs/project/METER_ONBOARDING_RECEIPT.md`
- `docs/project/SEPOLIA_ATTESTED_DEPLOY_PREFLIGHT.md`
- `docs/project/STRATEGIC_ASSESSMENT_2026-05-14.md`
- `docs/project/CHECKPOINT_MANIFEST_2026-05-14.md`
- `docs/project/PUBLIC_PROOF_STATUS.md`
- `docs/project/INVARIANT_CHECKLIST.md`

Reason: these make the proof externally inspectable and bound the claims.

### Frontend

- `frontend/src/App.jsx`
- `frontend/src/components/SPKMintDemo.jsx`
- `frontend/src/components/ProofDashboard.jsx`
- `frontend/src/constants/contracts.js`
- `frontend/src/abi/SolarPunkCoin.json`
- `frontend/src/index.css`

Reason: these surface the SPK mint proof and public readback in the demo.

### Grant Surfaces

- `GRANT_SUBMISSIONS/`
- `docs/grants/`

Reason: these are updated to match the attested SPK proof, 96 tests, and public readback.

## Include Only If Keeping The Revenue-Floor Module

- `contracts/EnergyRevenueFloor.sol`
- `test/EnergyRevenueFloor.test.js`
- `scripts/deploy_energy_floor.js`
- `frontend/src/components/CommercialPilot.jsx`
- `frontend/src/abi/EnergyRevenueFloor.json`
- `frontend/.env.example`
- `DEPLOYMENT_GUIDE.md`

Reason: this is secondary. It is test-covered and useful for pilots, but it is not the headline SPK product proof.

## Do Not Stage / Do Not Commit

- `node_modules/`
- `frontend/node_modules/`
- `frontend/dist/`
- `artifacts/`
- `cache/`
- `.env`
- `frontend/.env`
- generated local screenshots, PDFs, ZIPs, or binary exports unless explicitly needed

Reason: dependency/build/secret/local artifacts should stay out of reviewer commits.

## Do Not Touch

- `IE-JDE/`
- broader academic/research folders not directly tied to this checkpoint

Reason: user explicitly marked these as separate academic research assets.

## Verification Baseline

Last checked:

- `npm test`: 96 passing
- `npm run attestations:test`: 14 passing
- `npm run proof:spk-public-readback`: passing
- frontend build: passing
- frontend tests: 5 passing
- `git diff --check`: clean

## Remaining Decision Before Commit

Decide whether to commit the revenue-floor module together with the SPK attestation checkpoint or split it into a separate checkpoint.

Recommended split:

1. SPK attestation proof and reviewer packet.
2. EnergyRevenueFloor / commercial pilot module.
