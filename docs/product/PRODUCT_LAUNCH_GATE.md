# Product Launch Gate

> **ARCHIVED:** Launch-gate script output from a ended phase. Ignore decisions here. See [`../../DOCS.md`](../../DOCS.md) for current product.

- generated_at: `2026-06-06T18:17:35.082Z`
- decision: Do not launch yet; public testnet proof surface is blocked.
- recommended_current_launch: `none`
- next_build_target: `closed_testnet_pilot`

## Mode Status

| Mode | Status | Passed | Blocking |
|---|---:|---:|---:|
| SolarPunk Public Lab | `blocked` | 19 | 1 |
| Closed testnet pilot | `blocked` | 20 | 5 |
| Paid/mainnet product | `blocked` | 20 | 10 |

## Next Actions

- Do not launch externally yet.
- Repair the public testnet proof path first: SPK mint proof, public readback, daily keeper evidence, and frontend build.

## SolarPunk Public Lab

- PASS `SPK product proof exists`: Signed meter bundle to SPK mint proof is present.
  Evidence: `docs/product/SPK_ATTESTED_MINT_PROOF.md`
- PASS `Sepolia readback passes`: Public readback confirms tx success, consumed attestation hash, consumed source hash, recipient balance, and cumulative surplus.
  Evidence: `docs/product/SPK_PUBLIC_READBACK.md`
- PASS `Source verified proof stack`: Attested SPK proof contracts are source-verified on Sepolia.
  Evidence: `docs/project/ATTESTED_SPK_DEPLOYMENT.md`
- BLOCK `Daily keeper evidence is fresh`: Latest keeper run is 2026-05-21 (16 days old).
  Evidence: `docs/project/DAILY_EXPERIMENT_STATUS.md`
- PASS `Frontend proof surface exists`: Frontend has proof dashboard and SPK mint product surface.
  Evidence: `frontend/src`
- PASS `Pilot CSV proof exists`: Pilot CSV proof produces accepted readings, source hash, and SPK mint preview.
  Evidence: `docs/product/PILOT_CSV_RECEIPT.md`
- PASS `Inverter/meter adapter output exists`: Cumulative inverter/meter adapter output feeds the signed-reading verifier and produces an accepted surplus bundle.
  Evidence: `docs/product/INVERTER_METER_ADAPTER.md`
- PASS `Hardware provenance model exists`: Hardware assurance tiers, risk haircuts, issuance caps, and pilot upgrade evidence are explicit.
  Evidence: `docs/product/HARDWARE_PROVENANCE_MODEL.md`
- PASS `Closed pilot execution package exists`: Closed-pilot path is mapped to concrete operator inputs, commands, acceptance criteria, and owners.
  Evidence: `docs/product/CLOSED_PILOT_EXECUTION_PACKAGE.md`
- PASS `Public solar data replay exists`: Public historical rooftop-solar data is replayed through the SPK verifier and mint math without claiming live hardware provenance.
  Evidence: `docs/product/PUBLIC_SOLAR_DATA_REPLAY.md`
- PASS `NREL solar training baseline exists`: NREL/PVWatts baseline creates public modeled daily rows for SPK forecasting, anomaly scoring, and future model training without storing the API key.
  Evidence: `docs/product/NREL_SOLAR_TRAINING_LAB.md`
- PASS `NREL solar map scenarios exist`: NREL/PVWatts compact map scenarios provide frontend-ready modeled solar points without storing hourly or daily traces.
  Evidence: `docs/product/NREL_SOLAR_MAP_SCENARIOS.md`
- PASS `Generic operator intake exists`: A reusable operator CSV intake path validates solar exports, computes eligible surplus, and generates an SPK mint preview/case study.
  Evidence: `docs/product/OPERATOR_DATA_INTAKE.md`
- PASS `SPK intelligence layer exists`: Off-chain intelligence layer scores energy claims, provenance, forecast, finance readiness, and adversarial checks without controlling minting.
  Evidence: `docs/product/SPK_INTELLIGENCE_LAYER.md`
- PASS `Pilot-stack currency drill passes`: Governed-style local SPK stack executes mint, payment, redemption, and delivery accounting as one cryptocurrency system.
  Evidence: `docs/product/PILOT_STACK_CURRENCY_DRILL.md`
- PASS `Monetary stress harness passes`: Redemption-wave and shortfall scenarios preserve accounting conservation and expose reserve gaps.
  Evidence: `docs/product/MONETARY_STRESS_HARNESS.md`
- PASS `Energy-money simulation exists`: Measured keeper resource signals drive a transparent SPK issuance, settlement, redemption, and reserve simulation.
  Evidence: `docs/product/ENERGY_MONEY_SIMULATION.md`
- PASS `SPK finance dossier exists`: Finance dossier exposes income statement, break-even fee-base gap, balance-sheet liability, and closed-pilot finance stack.
  Evidence: `docs/product/SPK_FINANCE_DOSSIER.md`
- PASS `Empirical finance backtest exists`: Historical NASA POWER resource data is converted into project-finance distributions, DSCR, payback, and reserve-at-risk values.
  Evidence: `docs/product/EMPIRICAL_FINANCE_BACKTEST.md`
- PASS `Economic launch readiness exists`: Empirical resource economics are converted into DSCR targets, required realized $/kWh, capex ceilings, support gaps, and launch decisions.
  Evidence: `docs/product/ECONOMIC_LAUNCH_READINESS.md`

## Closed testnet pilot

- PASS `SPK product proof exists`: Signed meter bundle to SPK mint proof is present.
  Evidence: `docs/product/SPK_ATTESTED_MINT_PROOF.md`
- PASS `Sepolia readback passes`: Public readback confirms tx success, consumed attestation hash, consumed source hash, recipient balance, and cumulative surplus.
  Evidence: `docs/product/SPK_PUBLIC_READBACK.md`
- PASS `Source verified proof stack`: Attested SPK proof contracts are source-verified on Sepolia.
  Evidence: `docs/project/ATTESTED_SPK_DEPLOYMENT.md`
- BLOCK `Daily keeper evidence is fresh`: Latest keeper run is 2026-05-21 (16 days old).
  Evidence: `docs/project/DAILY_EXPERIMENT_STATUS.md`
- PASS `Frontend proof surface exists`: Frontend has proof dashboard and SPK mint product surface.
  Evidence: `frontend/src`
- PASS `Pilot CSV proof exists`: Pilot CSV proof produces accepted readings, source hash, and SPK mint preview.
  Evidence: `docs/product/PILOT_CSV_RECEIPT.md`
- PASS `Inverter/meter adapter output exists`: Cumulative inverter/meter adapter output feeds the signed-reading verifier and produces an accepted surplus bundle.
  Evidence: `docs/product/INVERTER_METER_ADAPTER.md`
- PASS `Hardware provenance model exists`: Hardware assurance tiers, risk haircuts, issuance caps, and pilot upgrade evidence are explicit.
  Evidence: `docs/product/HARDWARE_PROVENANCE_MODEL.md`
- PASS `Closed pilot execution package exists`: Closed-pilot path is mapped to concrete operator inputs, commands, acceptance criteria, and owners.
  Evidence: `docs/product/CLOSED_PILOT_EXECUTION_PACKAGE.md`
- PASS `Public solar data replay exists`: Public historical rooftop-solar data is replayed through the SPK verifier and mint math without claiming live hardware provenance.
  Evidence: `docs/product/PUBLIC_SOLAR_DATA_REPLAY.md`
- PASS `NREL solar training baseline exists`: NREL/PVWatts baseline creates public modeled daily rows for SPK forecasting, anomaly scoring, and future model training without storing the API key.
  Evidence: `docs/product/NREL_SOLAR_TRAINING_LAB.md`
- PASS `NREL solar map scenarios exist`: NREL/PVWatts compact map scenarios provide frontend-ready modeled solar points without storing hourly or daily traces.
  Evidence: `docs/product/NREL_SOLAR_MAP_SCENARIOS.md`
- PASS `Generic operator intake exists`: A reusable operator CSV intake path validates solar exports, computes eligible surplus, and generates an SPK mint preview/case study.
  Evidence: `docs/product/OPERATOR_DATA_INTAKE.md`
- PASS `SPK intelligence layer exists`: Off-chain intelligence layer scores energy claims, provenance, forecast, finance readiness, and adversarial checks without controlling minting.
  Evidence: `docs/product/SPK_INTELLIGENCE_LAYER.md`
- PASS `Pilot-stack currency drill passes`: Governed-style local SPK stack executes mint, payment, redemption, and delivery accounting as one cryptocurrency system.
  Evidence: `docs/product/PILOT_STACK_CURRENCY_DRILL.md`
- PASS `Monetary stress harness passes`: Redemption-wave and shortfall scenarios preserve accounting conservation and expose reserve gaps.
  Evidence: `docs/product/MONETARY_STRESS_HARNESS.md`
- PASS `Energy-money simulation exists`: Measured keeper resource signals drive a transparent SPK issuance, settlement, redemption, and reserve simulation.
  Evidence: `docs/product/ENERGY_MONEY_SIMULATION.md`
- PASS `SPK finance dossier exists`: Finance dossier exposes income statement, break-even fee-base gap, balance-sheet liability, and closed-pilot finance stack.
  Evidence: `docs/product/SPK_FINANCE_DOSSIER.md`
- PASS `Empirical finance backtest exists`: Historical NASA POWER resource data is converted into project-finance distributions, DSCR, payback, and reserve-at-risk values.
  Evidence: `docs/product/EMPIRICAL_FINANCE_BACKTEST.md`
- PASS `Economic launch readiness exists`: Empirical resource economics are converted into DSCR targets, required realized $/kWh, capex ceilings, support gaps, and launch decisions.
  Evidence: `docs/product/ECONOMIC_LAUNCH_READINESS.md`
- BLOCK `Governed attested-SPK deployment`: Current attested deployment scope is public-attested-spk-proof; closed pilot needs governed Safe/admin role separation.
  Evidence: `state/deployments/sepolia_attested_spk_deploy.json`
- BLOCK `Real meter or inverter adapter`: Current public mint batch batch_2026_02_12_a is fixture/proof data and inverter adapter real_operator_source is false; closed pilot needs one real operator meter or inverter export.
  Evidence: `docs/product/INVERTER_METER_ADAPTER.md`
- BLOCK `Hardware provenance clears pilot tier`: Current hardware level is L0 (Adapter sample or fixture); closed pilot needs L2 or better real-operator evidence.
  Evidence: `docs/product/HARDWARE_PROVENANCE_MODEL.md`
- BLOCK `Anchor economics or support terms`: Current economics need anchor tariff/PPA, capex reduction, or support capital; best current p50 DSCR is 0.3764x and the lowest absolute pilot support gap is $2875.48.
  Evidence: `docs/product/ECONOMIC_LAUNCH_READINESS.md`
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
- BLOCK `Daily keeper evidence is fresh`: Latest keeper run is 2026-05-21 (16 days old).
  Evidence: `docs/project/DAILY_EXPERIMENT_STATUS.md`
- PASS `Frontend proof surface exists`: Frontend has proof dashboard and SPK mint product surface.
  Evidence: `frontend/src`
- PASS `Pilot CSV proof exists`: Pilot CSV proof produces accepted readings, source hash, and SPK mint preview.
  Evidence: `docs/product/PILOT_CSV_RECEIPT.md`
- PASS `Inverter/meter adapter output exists`: Cumulative inverter/meter adapter output feeds the signed-reading verifier and produces an accepted surplus bundle.
  Evidence: `docs/product/INVERTER_METER_ADAPTER.md`
- PASS `Hardware provenance model exists`: Hardware assurance tiers, risk haircuts, issuance caps, and pilot upgrade evidence are explicit.
  Evidence: `docs/product/HARDWARE_PROVENANCE_MODEL.md`
- PASS `Closed pilot execution package exists`: Closed-pilot path is mapped to concrete operator inputs, commands, acceptance criteria, and owners.
  Evidence: `docs/product/CLOSED_PILOT_EXECUTION_PACKAGE.md`
- PASS `Public solar data replay exists`: Public historical rooftop-solar data is replayed through the SPK verifier and mint math without claiming live hardware provenance.
  Evidence: `docs/product/PUBLIC_SOLAR_DATA_REPLAY.md`
- PASS `NREL solar training baseline exists`: NREL/PVWatts baseline creates public modeled daily rows for SPK forecasting, anomaly scoring, and future model training without storing the API key.
  Evidence: `docs/product/NREL_SOLAR_TRAINING_LAB.md`
- PASS `NREL solar map scenarios exist`: NREL/PVWatts compact map scenarios provide frontend-ready modeled solar points without storing hourly or daily traces.
  Evidence: `docs/product/NREL_SOLAR_MAP_SCENARIOS.md`
- PASS `Generic operator intake exists`: A reusable operator CSV intake path validates solar exports, computes eligible surplus, and generates an SPK mint preview/case study.
  Evidence: `docs/product/OPERATOR_DATA_INTAKE.md`
- PASS `SPK intelligence layer exists`: Off-chain intelligence layer scores energy claims, provenance, forecast, finance readiness, and adversarial checks without controlling minting.
  Evidence: `docs/product/SPK_INTELLIGENCE_LAYER.md`
- PASS `Pilot-stack currency drill passes`: Governed-style local SPK stack executes mint, payment, redemption, and delivery accounting as one cryptocurrency system.
  Evidence: `docs/product/PILOT_STACK_CURRENCY_DRILL.md`
- PASS `Monetary stress harness passes`: Redemption-wave and shortfall scenarios preserve accounting conservation and expose reserve gaps.
  Evidence: `docs/product/MONETARY_STRESS_HARNESS.md`
- PASS `Energy-money simulation exists`: Measured keeper resource signals drive a transparent SPK issuance, settlement, redemption, and reserve simulation.
  Evidence: `docs/product/ENERGY_MONEY_SIMULATION.md`
- PASS `SPK finance dossier exists`: Finance dossier exposes income statement, break-even fee-base gap, balance-sheet liability, and closed-pilot finance stack.
  Evidence: `docs/product/SPK_FINANCE_DOSSIER.md`
- PASS `Empirical finance backtest exists`: Historical NASA POWER resource data is converted into project-finance distributions, DSCR, payback, and reserve-at-risk values.
  Evidence: `docs/product/EMPIRICAL_FINANCE_BACKTEST.md`
- PASS `Economic launch readiness exists`: Empirical resource economics are converted into DSCR targets, required realized $/kWh, capex ceilings, support gaps, and launch decisions.
  Evidence: `docs/product/ECONOMIC_LAUNCH_READINESS.md`
- BLOCK `Governed attested-SPK deployment`: Current attested deployment scope is public-attested-spk-proof; closed pilot needs governed Safe/admin role separation.
  Evidence: `state/deployments/sepolia_attested_spk_deploy.json`
- BLOCK `Real meter or inverter adapter`: Current public mint batch batch_2026_02_12_a is fixture/proof data and inverter adapter real_operator_source is false; closed pilot needs one real operator meter or inverter export.
  Evidence: `docs/product/INVERTER_METER_ADAPTER.md`
- BLOCK `Hardware provenance clears pilot tier`: Current hardware level is L0 (Adapter sample or fixture); closed pilot needs L2 or better real-operator evidence.
  Evidence: `docs/product/HARDWARE_PROVENANCE_MODEL.md`
- BLOCK `Anchor economics or support terms`: Current economics need anchor tariff/PPA, capex reduction, or support capital; best current p50 DSCR is 0.3764x and the lowest absolute pilot support gap is $2875.48.
  Evidence: `docs/product/ECONOMIC_LAUNCH_READINESS.md`
- PASS `Pilot terms are drafted`: Pilot plan exists; it still needs named counterparty details before execution.
  Evidence: `docs/specs/PILOT_PLAN.md`
- PASS `Governance runbook exists`: Governance status includes operations handbook and role matrix.
  Evidence: `docs/project/GOVERNANCE_STATUS.md`
- PASS `Pilot-stack deploy/readback scaffold exists`: Governed SPK + treasury + currency-system pilot stack has deployment and readback scripts.
  Evidence: `docs/project/PILOT_STACK_DEPLOYMENT.md`
- BLOCK `External audit complete`: External audit status is NOT_STARTED; paid/mainnet launch remains blocked.
  Evidence: `docs/project/SECURITY_AUDIT_STATUS.json`
- BLOCK `Paid launch economics ready`: Paid launch economics status is blocked_by_unit_economics_and_protocol_revenue.
  Evidence: `docs/product/ECONOMIC_LAUNCH_READINESS.md`
- BLOCK `Legal and commercial scope complete`: No launch terms file exists for token classification, redemption obligations, user eligibility, and jurisdictional limits.
  Evidence: `docs/product/LEGAL_AND_COMMERCIAL_SCOPE.md`
- BLOCK `Production redemption policy complete`: No production redemption policy exists for what SPK holders can redeem, from whom, and under which caps.
  Evidence: `docs/product/REDEMPTION_POLICY.md`
- BLOCK `Mainnet or L2 production deployment recorded`: No production deployment proof exists.
  Evidence: `state/deployments/production_spk_deploy.json`
