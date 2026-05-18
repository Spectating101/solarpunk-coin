# SolarPunk Closed Pilot Execution Package

- generated_at: `2026-05-18T16:12:56.598Z`
- public_lab: `launchable`
- closed_testnet_pilot: `blocked`
- paid_mainnet_product: `blocked`
- internal_execution_package_ready: `true`
- external_inputs_remaining: `2`

## Purpose

Remove vague blockers by converting the path from public lab to closed pilot into concrete inputs, commands, caps, and acceptance criteria.

There are no undefined blockers left in this package. Anything not launchable is mapped to a named input, command, acceptance criterion, and owner. The package still refuses to mislabel sample data as real hardware proof.

## Current Evidence

- latest_keeper_run: `2026-05-18`
- inverter_adapter_accepted_surplus_kwh: `996.2`
- current_hardware_level: `L0`
- current_hardware_label: `Adapter sample or fixture`
- current_real_value_kwh_cap: `0`
- L2_target_risk_adjusted_kwh_for_same_sample_basis: `697.34`

## Economics Target

- archetype: `10 kW solar home`
- required_realized_value_usd_per_kwh: `0.329767`
- current_p50_realized_value_usd_per_kwh: `0.0885`
- required_value_multiplier: `3.7262`
- annual_support_required_usd: `2875.48`
- capital_support_required_usd: `23046.29`
- max_launch_capex_usd_per_wdc: `0.8454`

## Execution Modes

| Mode | Status | Real value? | Success definition |
|---|---|---:|---|
| public_lab | `ready_now` | false | Reviewer can inspect Sepolia proof, adapter sample, hardware model, economics model, and frontend without trusting private claims. |
| operator_shadow_pilot | `ready_when_operator_file_arrives` | false | Hardware model upgrades from L0 to at least L2 and the verifier accepts signed, monotonic, closed-window readings. |
| closed_testnet_pilot | `execution_package_ready_external_inputs_needed` | false | Governed attested-SPK deployment, L2+ hardware source, and signed economics/support terms clear launch gate. |
| risk_boxed_revenue_grade_pilot | `designed_not_ready` | false | Revenue-grade/utility corroboration plus non-hardware launch gates; until then, no paid/mainnet claims. |

## Operator Intake

| Category | Required | Fields | Why |
|---|---:|---|---|
| site_identity | true | operator_name, site_id, location_country_region, generation_resource, capacity_kw | Binds the pilot proof to a named physical generator without publishing private customer data. |
| device_identity | true | meter_or_inverter_model, serial_or_anonymized_serial_hash, commissioning_date, rated_capacity_kw | Moves hardware provenance from sample L0 toward live-source L2. |
| interval_counters | true | window_start, window_end, generation_kwh_total_start/end, site_load_kwh_total_start/end, export_kwh_total_start/end, curtailed_kwh_total_start/end_or_zero | Cumulative counters let the adapter reject non-monotonic data and derive deterministic surplus. |
| signing_and_custody | true | registered_device_address, who_controls_gateway_key, key_rotation_contact, revocation_contact | The protocol can verify signatures only if signer custody and revocation are defined. |
| economics | true | current_export_credit_or_tariff_usd_per_kwh, retail_offset_usd_per_kwh, ppa_or_fit_terms_if_any, capex_usd_or_usd_per_wdc, support_subsidy_or_grant_terms_if_any | The current lowest-support archetype still needs about $0.3298/kWh or equivalent capex/support terms. |
| corroboration | false | utility_bill_or_green_button_export, REC_TREC_EAC_record_if_any, inverter_dashboard_screenshot_hash, meter_screen_photo_hash | Optional at L2, but needed to move toward L3/L4 real-value credibility. |

## Action Queue

| Action | Owner | Status | Command / Artifact | Acceptance Criteria |
|---|---|---|---|---|
| publish_public_lab | SolarPunk | `ready_now` | `docs/product/PRODUCT_LAUNCH_GATE.md` | Public Lab gate remains launchable with 0 blocking checks. |
| collect_l2_operator_source | Operator or site owner | `external_input_needed` | `docs/product/CLOSED_PILOT_EXECUTION_PACKAGE.md#operator-intake` | Cumulative counters, device identity, signer custody, and operator identity are provided for one closed interval. |
| run_operator_adapter | SolarPunk | `ready_after_operator_source` | `npm run meter:inverter-adapter -- --provider=cumulative-json --real-operator-source` | Accepted records > 0, rejected records = 0 or explained, hardware provenance upgrades to L2+. |
| governed_attested_spk_redeploy | SolarPunk | `internal_execution_needed` | `npm run deploy:pilot-stack:sepolia && npm run pilot-stack:readback` | Deployment scope is governed-attested-spk-pilot with source verification and role readback. |
| anchor_economics_terms | Operator/SolarPunk | `external_terms_needed` | `state/product/economic_launch_readiness.json` | At minimum, the 10 kW path needs about $0.3298/kWh realized value or $2,875.48/year support equivalent under current assumptions. |
| rerun_gate | SolarPunk | `ready_after_inputs` | `npm run product:hardware-provenance && npm run product:economic-launch && npm run product:launch-gate` | Closed pilot gate moves from blocked to launchable, while paid/mainnet remains separately gated. |

## Minimal Operator Command

```bash
METER_PRIVATE_KEY=0x... npm run meter:inverter-adapter -- \
  --provider=cumulative-json \
  --start=data/inverter/operator_start.json \
  --end=data/inverter/operator_end.json \
  --meter-id=OPERATOR-METER-001 \
  --site-id=operator-site-a \
  --real-operator-source

npm run product:hardware-provenance
npm run product:launch-gate
```
