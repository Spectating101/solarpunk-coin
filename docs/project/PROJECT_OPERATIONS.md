# SolarPunk Project Operations Handbook

**Last updated:** 2026-04-12
**Purpose:** Canonical handoff for anyone taking over launch, grant, pilot, or maintenance work on this repo.

---

## 1. One-sentence summary

SolarPunk is an energy-backed derivatives and revenue-floor protocol on Polygon, backed by a thesis, a working Solidity/Python/React stack, and grant-ready evidence packs.

---

## 2. Current state snapshot

| Area | Current state |
|---|---|
| Smart contracts | 51/51 tests passing |
| Grant readiness | A |
| Project readiness | B |
| Verification warnings | 0 |
| Empirical inventory | 29 CSVs, 9 PNGs |
| Launch target | Polygon Amoy |
| Launch status | Deployment path ready; address pending funded wallet/private key |
| Grant ask | $50k baseline / $75k stretch |
| Security audit | Not started |
| Mainnet gate | NO_GO until audit + deployment receipt validation pass |

---

## 3. What this project is

- A renewable-energy hedging protocol with a solvency-first contract layer.
- A physics-priced derivatives stack using NASA-based irradiance inputs.
- A thesis-backed project with empirical, pricing, and feasibility layers.
- A grant/pilot candidate that can be demoed, deployed, and measured.

## 4. What this project is not

- Not a broad fiat replacement claim.
- Not a pure academic archive.
- Not a mainnet-production protocol yet.
- Not a one-doc / one-feature repo; it is a multi-surface project that needs one canonical narrative.

---

## 5. Read this first

If you are taking over the project, read these in order:

1. `README.md`
2. `DEPLOYMENT_GUIDE.md`
3. `docs/project/PROJECT_OPERATIONS.md` (this file)
4. `GRANT_PROPOSAL.md`
5. `docs/grants/GRANT_READINESS_PACK.md`
6. `docs/project/PROJECT_READINESS_PACK.md`
7. `docs/thesis/MASTER_THESIS_PROPOSAL.md`
8. `thesis_package/THESIS_MASTER_HANDOFF.md`

The thesis docs provide the academic rationale. The README and grant docs provide the public narrative. This handoff doc ties the operating surfaces together.

---

## 6. Canonical repository map

### Active code

- `contracts/`
  - `SolarPunkCoin.sol`: ERC-20 style energy-backed monetary contract.
  - `SolarPunkOption.sol`: options clearinghouse / settlement layer.
- `energy_derivatives/`
  - Python pricing library and API.
  - Used for the valuation and risk layer.
- `frontend/`
  - React/Vite UI for the demo and pilot workflow.
- `scripts/`
  - Deploy, verify, simulate, and build scripts.

### Active documentation

- `README.md`
- `DEPLOYMENT_GUIDE.md`
- `GRANT_PROPOSAL.md`
- `docs/grants/GRANT_READINESS_PACK.md`
- `docs/project/PROJECT_READINESS_PACK.md`
- `docs/project/PROJECT_OPERATIONS.md`
- `docs/monetization/SERVICES.md`
- `docs/thesis/MASTER_THESIS_PROPOSAL.md`
- `thesis_package/THESIS_MASTER_HANDOFF.md`

### Thesis and research

- `docs/thesis/`
- `thesis_package/`

### Historical / reference only

- `ARCHIVE/`
- older Mumbai-era deployment notes
- deleted duplicate thesis/grant bundles that were consolidated away

---

## 7. Architecture at a glance

### Layer 1: Empirical foundation

- CEIR / energy-anchoring analysis
- thesis-backed evidence for the energy-floor argument
- supports the narrative that energy can anchor value under the right conditions

### Layer 2: Pricing layer

- Python risk engine and pricing library
- NASA POWER-based irradiance calibration
- binomial tree, Monte Carlo, and sensitivity tooling
- currently validated against the repo's empirical outputs

### Layer 3: Contract / settlement layer

- smart contracts for issuance, margin, liquidation, and settlement
- oracle staleness gating and fail-closed controls
- phase-gated pilot and expansion policy

### Interface layer

- React/Vite frontend for user-facing hedge flows
- demo surface for grants, pilots, and reviewers

### Evidence / operations layer

- `verify_all.sh`
- grant and project readiness packs
- deployment receipt artifacts
- on-chain confirmation and audit validation artifacts

---

## 8. How the project is supposed to work

### Public story

The project should be described as:

> An energy-backed revenue floor engine / hedging protocol on Polygon, supported by empirical thesis work and reproducible pricing and settlement infrastructure.

### What to emphasize

1. Working code.
2. Reproducible evidence.
3. A live testnet demo path.
4. A clear grant use-case.
5. A pilot path that can become recurring revenue.

### What not to emphasize first

1. Universal fiat replacement.
2. Abstract monetary theory without proof.
3. A "next Ethereum" narrative.
4. Unverified mainnet claims.

---

## 9. Operational modes

The project currently runs in these modes:

| Mode | What it means |
|---|---|
| Research | Empirical and economics outputs |
| Protocol | Contracts, oracle, frontend, deployment |
| Funding | Grant and submission package generation |
| Commercial | Pilot term sheets and client artifacts |
| Monetary-system | Standalone protocol readiness checks |
| Phase-gate | GO/NO_GO progression enforcement |
| Evidence-validation | Deployment and audit proof validation |
| On-chain confirmation | Confirm deployment receipts and sync evidence |

Use the right mode for the task. Do not let grant language drift into protocol docs, and do not let thesis framing override the public product pitch.

---

## 10. Launch path

### Canonical sequence

1. Refresh verification.
2. Rebuild grant and project readiness packs.
3. Deploy to Polygon Amoy.
4. Capture deployment address, tx hashes, and explorer links.
5. Build deployment receipt and validation artifacts.
6. Update public docs.
7. Submit the grant bundle.
8. Begin pilot outreach.

### Commands

```bash
bash verify_all.sh --contracts-in-docker --json-report=artifacts/verify_health.json
python3 scripts/build_grant_readiness_pack.py
python3 scripts/build_project_readiness_pack.py
./scripts/deploy_amoy.sh
python3 scripts/build_deployment_receipt.py
python3 scripts/validate_deployment_receipt.py
python3 scripts/confirm_deployment_onchain.py
```

### Deployment evidence

Deployment claims should be backed by:

- `state/deployments/amoy_receipt.json`
- `state/deployments/deployment_receipt_validation.json`
- `state/deployments/onchain_confirmation_report.json`

Expansion and mainnet claims must not be made without these artifacts passing.

---

## 11. Grant path

### Current grant story

- Baseline ask: $50,000
- Stretch ask: $75,000
- Duration: 6 months
- Narrative: evidence-first renewable hedging infrastructure on Polygon

### What the funding is for

- security audit and remediation
- oracle data service and monitoring
- stability tuning and market ops automation
- pilot setup and liquidity incentives
- UI/SDK work for non-dev users

### Canonical submission bundle

1. `GRANT_PROPOSAL.md`
2. `docs/grants/GRANT_READINESS_PACK.md`
3. `docs/project/PROJECT_READINESS_PACK.md`

### What reviewers should see

- working code
- fresh verification
- clear milestone plan
- a public testnet target
- a path from pilot to operational revenue

---

## 12. Pilot / commercial path

The commercial path is separate from the grant path, but it uses the same proof:

1. Testnet deployment.
2. Demo video or screenshots.
3. Pilot outreach.
4. One LOI or partner email.
5. One constrained pilot hedge.
6. Repeatable evidence and operations.

Useful docs:

- `docs/economics/PILOT_PLAN.md`
- `docs/pitch/PITCH_DECK_OUTLINE.md`
- `docs/monetization/SERVICES.md`

Pilot SLO:

- verification freshness within 24 hours
- attestation freshness within 24 hours
- `overall_status=ok`
- `warnings=0`
- no more than 1 failed daily cycle per 14-day window during pilot

---

## 13. Thesis relationship

The thesis is the legitimacy layer, not the product headline.

### Thesis claim

Energy-backed derivatives can satisfy a stricter monetary-standard framework better than fiat on verifiability, scarcity discipline, and contractual enforcement.

### Practical interpretation

- Good for the research narrative.
- Good for grant credibility.
- Good for pilot justification.
- Not a claim that the project is already a fiat replacement.

### Use the thesis to support

- why the design exists
- why the architecture is coherent
- why the pricing layer is non-trivial

### Do not use the thesis to claim

- immediate mass adoption
- universal currency replacement
- production-grade monetary sovereignty

---

## 14. Policies and gates

### Oracle safety

- stale data is rejected
- outliers are checked with multi-source aggregation
- fail closed if oracle quality is insufficient
- do not communicate mint/redeem decisions without fresh attestation and verification

### Deployment evidence

- do not claim expansion or mainnet readiness without receipt validation
- use network-scoped deployment receipts
- avoid ambiguous or deprecated evidence formats

### Phase gates

- phase 0: protocol integrity
- phase 1: controlled monetary pilot
- phase 2: live attestation hardening
- phase 3: market expansion readiness

Current status:

- phase 0 PASS
- phase 1 PASS
- phase 2 PASS
- phase 3 FAIL

Reason:

- deployment receipt validation not yet passed
- external audit not yet started

### Mainnet rule

No mainnet expansion until the external audit is complete and the receipt / confirmation artifacts pass.

### Canonical evidence bundle

This is the single reference point for operational evidence. The narrower docs below should point here instead of restating the same rules.

| Surface | What it covers | Canonical artifact(s) | Gate effect |
|---|---|---|---|
| Deployment receipt | Network-scoped deploy proof | `state/deployments/amoy_receipt.json` | Required for any expansion claim |
| Receipt validation | Completeness and formatting checks | `state/deployments/deployment_receipt_validation.json` | `NO_GO` if validation fails |
| On-chain confirmation | RPC-level confirmation of the recorded deployment | `state/deployments/onchain_confirmation_report.json` | Confirms the receipt against chain state |
| Attestation pipeline | Meter-surplus ingestion and normalization | `artifacts/attestations/latest_attestation_bundle.json` and `docs/project/METER_ATTESTATION_BUNDLE.md` | Only accepted surplus can feed minting workflows |
| Security audit | External audit status and findings policy | `docs/project/PROJECT_OPERATIONS.md`, `docs/project/SECURITY_AUDIT_STATUS.json`, and `docs/project/SECURITY_AUDIT_VALIDATION.md` | Mainnet gate stays closed until audit is complete |
| Phase gates | Protocol progression rules | `docs/project/PROJECT_OPERATIONS.md` and `docs/project/PROTOCOL_PHASE_GATES.md` | Phase 3 remains blocked until its prerequisites pass |
| Monetary-system readiness | Standalone monetary-protocol checks | `docs/project/PROJECT_OPERATIONS.md` and `docs/project/MONETARY_SYSTEM_READINESS.json` | Used for monetary-system mode, not the product pitch |
| Pilot SLO | Operating thresholds for pilots | `docs/project/PROJECT_OPERATIONS.md` | Pilot work must stay inside freshness/error budgets |

If a doc is just one of these surfaces, it should defer to this table and keep only the narrow artifact-specific details.

---

## 15. First things a new maintainer should do

### If the goal is launch

1. Re-run `verify_all.sh`.
2. Rebuild both readiness packs.
3. Deploy Amoy.
4. Capture and publish the address.
5. Update the README and grant docs.

### If the goal is grant submission

1. Verify the latest outputs.
2. Attach the grant readiness pack.
3. Keep the proposal and readiness packs synchronized.
4. Submit only after the launch docs match the current state.

### If the goal is commercialization

1. Use the pitch deck outline.
2. Use the pilot plan.
3. Keep the narrative narrow: renewable hedging and settlement infrastructure.

### If the goal is deeper maintenance

1. Keep canonical docs aligned.
2. Preserve the archive as history.
3. Avoid reintroducing duplicate narrative docs.
4. Refresh the readiness packs before any external claim.

---

## 16. Non-negotiables

- Do not reintroduce Mumbai-era language into the public launch docs.
- Do not treat the thesis as the product pitch.
- Do not claim fiat replacement as the current objective.
- Do not make mainnet claims without audit and receipt evidence.
- Do not let duplicate documentation expand again without a canonical source of truth.

---

## 17. Where to look next

- `README.md` for the public front door.
- `DEPLOYMENT_GUIDE.md` for Amoy launch steps.
- `GRANT_PROPOSAL.md` for the funding narrative.
- `docs/project/PROJECT_READINESS_PACK.md` for current operational status.
- `docs/monetization/SERVICES.md` for outreach/delivery templates.
- `thesis_package/THESIS_MASTER_HANDOFF.md` for the academic backbone.

If you need to change the public story, change the README, grant docs, and this file together.

---

## 18. Detailed policy surfaces

### Attestation pipeline

- Input files: `data/attestations/*.json`
- Required fields: `meter_id`, `site_id`, `window_start`, `window_end`, `surplus_kwh`, `quality_score`, `source`, `attestor`
- Validation: `surplus_kwh > 0`, `quality_score` in `[0,1]`, and the default threshold is `0.9`
- Normalization: UTC timestamps and deterministic `record_hash` per accepted record
- Outputs:
  - `artifacts/attestations/latest_attestation_bundle.json`
  - `docs/project/METER_ATTESTATION_BUNDLE.md`
- Integration rule: only accepted surplus is eligible upstream input for minting workflows

### Deployment evidence policy

- Required artifacts:
  - `state/deployments/amoy_receipt.json`
  - `state/deployments/deployment_receipt_validation.json`
  - `state/deployments/onchain_confirmation_report.json`
- Canonical source of truth:
  - `state/deployments/<network>_full_deploy.json`
- Pass criteria:
  - `receipt_status == CONFIRMED`
  - `onchain_confirmed == true`
  - valid contract addresses and deploy tx hashes
  - validation artifact passes
- Failure behavior: if any check fails, expansion and mainnet claims stay blocked

### Security audit state

- Current audit status: `NOT_STARTED`
- Required for mainnet claim: completed external audit with report URL and completion timestamp
- Validation must confirm:
  - completed status
  - no open critical/high findings
  - valid HTTP(S) report URL
  - valid ISO completion timestamp

### Oracle safety policy

- Objective: prevent stale or manipulated data from driving mint/redeem decisions
- Controls:
  - stale data is rejected
  - outliers are checked with multi-source aggregation
  - fail closed if oracle quality is insufficient
- Operating rule: do not communicate mint/redeem decisions without fresh attestation and verification

### Phase gates and checklist

- phase 0: protocol integrity — PASS
- phase 1: controlled monetary pilot — PASS
- phase 2: live attestation hardening — PASS
- phase 3: market expansion readiness — FAIL until audit and receipt evidence pass
- Mainnet rule: no expansion until the external audit and receipt/confirmation artifacts pass

Mainnet readiness checklist:
- independent security audit complete
- deployment receipt archived
- production-like attestation pathway tested
- incident response runbook validated
- governance/role rotation procedure tested

### Monetary-system mode

- Mission: energy-native monetary protocol with verifiable issuance, redemption, and solvency controls
- Standalone functionality:
  1. Convert verified energy output into programmable monetary units
  2. Keep value bounded through peg/stability controls
  3. Enforce reserve/risk constraints before issuance continues
- Readiness: `A` with verification `ok`

### Pilot operating SLO

- Verification freshness: `verify_health.json` updated within 24 hours
- Attestation freshness: `latest_attestation_bundle.json` updated within 24 hours
- Integrity: `overall_status=ok` and `warnings=0`
- Reliability: no more than 1 failed daily cycle per 14-day window during pilot
