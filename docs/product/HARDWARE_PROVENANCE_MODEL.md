# SolarPunk Hardware Provenance Model

- generated_at: `2026-07-08T16:56:37.645Z`
- source_artifact: `state/product/inverter_meter_adapter_receipt.json`
- current_hardware_level: `L0`
- current_hardware_label: `Adapter sample or fixture`
- current_real_operator_source: `false`
- accepted_surplus_basis: `1985.5 kWh`

## Purpose

Make physical hardware risk explicit before treating meter or inverter data as real-value SPK mint input.

This document exists because a real paid product cannot simply say that inverter data is true. The protocol can verify signatures and replay resistance, but physical measurement truth is an off-chain assurance problem. The right engineering answer is not to ignore that gap; it is to tier it, cap it, haircut it, and define the evidence needed to upgrade it.

## Current Decision

- public_lab: `acceptable_for_testnet_and_demo`
- closed_pilot: `blocked_until_real_operator_L2_or_better_evidence`
- paid_launch: `blocked_until_L4_or_equivalent_plus_non_hardware_gates`

## Hardware Evidence Tiers

| Level | Label | Score | Haircut | Cap kWh/day | Risk-adjusted kWh | Closed pilot | Paid launch |
|---|---|---:|---:|---:|---:|---|---|
| L0 | Adapter sample or fixture | 32 | 100% | 0 | 0 | false | false |
| L1 | Operator-signed export | 52 | 60% | 250 | 250 | false | false |
| L2 | Live inverter or gateway signed counter | 70 | 30% | 2500 | 1389.85 | true | false |
| L3 | Revenue-grade meter with gateway custody | 84 | 12% | 10000 | 1747.24 | true | false |
| L4 | Utility or settlement-corroborated meter | 93 | 5% | 50000 | 1886.225 | true | true |

## Tier Meaning

### L0: Adapter sample or fixture

- stage: `public_lab_only`
- what_it_proves: Software normalization, signing, replay protection, and verifier compatibility.
- measurement_uncertainty_pct: `5`
- custody_risk_pct: `100`
- real_value_haircut_pct: `100`
- simulated_risk_reserve_kwh: `1985.5`

Missing:
- No real operator source
- No hardware serial or model identity
- No tamper-evident physical chain
- No utility or revenue-grade corroboration

### L1: Operator-signed export

- stage: `shadow_pilot_or_review`
- what_it_proves: A named operator can export and sign production/load/export data.
- measurement_uncertainty_pct: `3`
- custody_risk_pct: `35`
- real_value_haircut_pct: `60`
- simulated_risk_reserve_kwh: `1191.3`

Missing:
- Manual export can be curated before signing
- Device key may be operator custody rather than hardware custody
- Meter accuracy class may be unknown
- Audit trail may not prove uninterrupted measurement

### L2: Live inverter or gateway signed counter

- stage: `closed_pilot_candidate`
- what_it_proves: Automated inverter/gateway polling with signed interval records and duplicate-window controls.
- measurement_uncertainty_pct: `1.5`
- custody_risk_pct: `15`
- real_value_haircut_pct: `30`
- simulated_risk_reserve_kwh: `595.65`

Missing:
- Inverter telemetry is not always revenue-grade billing data
- LAN/API sign convention must be validated
- Gateway key custody and firmware update process need controls
- Utility settlement data is still external corroboration

### L3: Revenue-grade meter with gateway custody

- stage: `risk_boxed_pilot`
- what_it_proves: A meter with known accuracy class signs or feeds a controlled gateway with auditable logs.
- measurement_uncertainty_pct: `0.5`
- custody_risk_pct: `6`
- real_value_haircut_pct: `12`
- simulated_risk_reserve_kwh: `238.26`

Missing:
- Still needs third-party audit of the adapter and custody process
- Still needs legal terms for energy/redemption claims
- Still needs dispute and rollback procedure

### L4: Utility or settlement-corroborated meter

- stage: `production_candidate_after_audit`
- what_it_proves: On-site measurement is corroborated by utility/settlement-grade records or equivalent external attestations.
- measurement_uncertainty_pct: `0.2`
- custody_risk_pct: `2`
- real_value_haircut_pct: `5`
- simulated_risk_reserve_kwh: `99.275`

Missing:
- Paid launch still requires audit, legal scope, reserve policy, and production governance
- Environmental claims still need REC/T-REC/EAC ownership and retirement handling

## Upgrade Checklist

| Item | Required for | Evidence |
|---|---|---|
| Device identity | L2+ | meter/inverter model, serial, site ID, rated capacity, commissioning date, operator identity |
| Counter integrity | L2+ | cumulative generation/load/export counters, monotonicity checks, duplicate-window rejection, reset detection |
| Key custody | L2+ | device or gateway private key not stored in repo, signer address registered, rotation/revocation process |
| Accuracy basis | L3+ | revenue-grade meter certificate or stated ANSI/IEC accuracy class; calibration date where available |
| External corroboration | L4 | utility bill, Green Button/ESPI export, REC/T-REC/EAC certificate, or settlement statement for the same site/window |
| Dispute process | closed pilot | operator contact, source archive retention, correction workflow, and mint reversal or reserve-offset policy |

## Hardware Risk Register

- Telemetry overstatement: Prefer cumulative counters; reject non-monotonic counters; cap minting per device per day; hold risk reserve.
- Wrong import/export sign convention: Require a one-day shadow comparison against inverter dashboard, meter screen, or utility net-meter record.
- Gateway key compromise: Register signer address, rotate keys, revoke stale devices, and require operator archive logs for disputed windows.
- Physical bypass or meter tampering: Move from L2 inverter telemetry to L3 revenue-grade meter or L4 utility corroboration before real value scale.
- Environmental claim double counting: Treat SPK minting as metered settlement proof; handle REC/T-REC/EAC ownership and retirement separately.

## Practical Product Rule

For public lab and grant review, L0 is acceptable because it proves the adapter path without claiming physical finality. For a closed pilot, target L2 minimum: a named operator, live inverter or gateway polling, signed cumulative counter intervals, duplicate-window rejection, and archived raw source files. For real-value scale, target L3/L4: revenue-grade or utility-corroborated metering, custody controls, audit, legal scope, and reserve policy.

## Standards And Anchors

- [Fronius Solar API JSON](https://www.fronius.com/en/help-center/solar-energy/products/monitoring-control/solutions/open-interfaces/fronius-solar-api-json-) - Local inverter/Datamanager JSON API for inverter, meter, and component data.
- [SunSpec specifications](https://sunspec.org/specifications/) - Open DER interoperability specifications and information models for inverters, meters, batteries, and smart-grid applications.
- [IEC 62053-22:2020](https://webstore.iec.ch/en/publication/29987) - Static AC active-energy meter requirements for classes 0.1S, 0.2S, and 0.5S.
- [ANSI C12.1/C12.20 metering accuracy classes](https://blog.ansi.org/ansi/ansi-c12-20-2015-electric-meters-accuracy-classes/) - US electric-meter code and 0.1, 0.2, and 0.5 accuracy class framing.
- [NIST Green Button Initiative](https://www.nist.gov/el/smart-grid-menu/hot-topics/green-button-initiative) - Utility customer energy-usage data access through the ESPI/Green Button standard.
