# Tier C Exploration Status

**Generated:** 2026-06-28T17:44:51.578081+00:00  
**Scope:** Off-thesis CEIR → SPK empirical stitch. Re-run: `npm run exploration:tier-c`

## Overall: **PASS** (6/6 phases passing exploration gates)

Core stitch (CEIR + meter + production contrast + metadata) must pass. P3 redemption stress and P5 peg-vs-oracle are stress probes — failing them is expected at pilot scale until capacity, reserves, and peg-on tuning.

---

## Phase summary

| Phase | Name | Pass |
|-------|------|------|
| p0_ceir | P0_ceir_motivation | yes |
| p1_meter | P1_meter_data_stitch | yes |
| p2_contrast | P2_production_vs_consumption | yes |
| p3_redemption | P3_redemption_stress | yes |
| p4_metadata | P4_regime_metadata | yes |
| p5_peg | P5_peg_vs_oracle | yes |

---

## Details

### p0_ceir

```json
{
  "phase": "P0_ceir_motivation",
  "source": "thesis_package/empirical_results/ceir_analysis_summary.csv",
  "pre_ban_beta": -0.262347427051995,
  "post_ban_beta": -0.07081070948464456,
  "pre_ban_significant_5pct": true,
  "post_ban_significant_5pct": false,
  "stitch_reading": "Energy-cost information appears pre-ban; weakens post-ban \u2014 motivates designed surplus issuance, not passive PoW inference.",
  "reproduce": "python thesis_package/ceir_regression.py --refresh-panel",
  "phase_pass": true
}
```

### p1_meter

```json
{
  "phase": "P1_meter_data_stitch",
  "bundle_path": "state/attestations/latest_attestation_bundle.json",
  "bundle_present": true,
  "accepted_records": 2,
  "rejected_records": 2,
  "total_surplus_kwh": 2606.7,
  "sites": [
    "taoyuan-rooftop-a",
    "taoyuan-rooftop-b"
  ],
  "meter_on_chain_cycles": 1,
  "meter_mint_txs": [
    {
      "cycle_id": "2026-06-07T16-25-38-349Z",
      "tx_hash": "0x3527585fd110ae3e135e76b870232d1b30411d76953c15c94a237743a0d1754d",
      "surplus_kwh": 52,
      "meter_source": "state/attestations/latest_attestation_bundle.json",
      "meter_scale": 0.02
    }
  ],
  "commands": {
    "local_meter_cycle": "CYCLE_MINT_MODE=meter npm run spk:v1:cycle",
    "sepolia_meter_cycle": "CYCLE_MINT_MODE=meter npm run spk:v1:cycle:sepolia",
    "foundation_meter": "npm run foundation:cycle:meter",
    "meter_onboard": "npm run meter:onboard",
    "inverter_adapter": "npm run meter:inverter-adapter"
  },
  "gates": {
    "bundle_with_accepted_attestations": true,
    "quality_filter_rejects_some_rows": true,
    "sepolia_meter_mint_recorded": true
  },
  "phase_pass": true,
  "next": "Re-run sepolia meter cycle after new inverter export; document tx in METER_EVIDENCE.md"
}
```

### p2_contrast

```json
{
  "phase": "P2_production_vs_consumption",
  "doc": "docs/exploration/PRODUCTION_VS_CONSUMPTION.md",
  "ceir_side": "consumption (PoW mining burn, Cambridge estimates)",
  "spk_side": "production (meter-attested surplus export)",
  "phase_pass": true,
  "note": "Narrative stitch \u2014 see PRODUCTION_VS_CONSUMPTION.md"
}
```

### p3_redemption

```json
{
  "phase": "P3_redemption_stress",
  "scenarios": {
    "pilot_current": {
      "scenario": "pilot_current",
      "label": "Pilot ops \u2014 tight capacity, shock-prone (expected fail)",
      "params": {
        "num_paths": 5000,
        "horizon_days": 90,
        "mean_daily_redemptions": 8.0,
        "mean_kwh_per_redemption": 25.0,
        "delivery_capacity_kwh_per_day": 200.0,
        "reserve_kwh_buffer": 0.0,
        "capacity_shock_prob": 0.05,
        "capacity_shock_factor": 0.4,
        "dispute_prob_on_shortfall": 0.35,
        "seed": 42
      },
      "paths_with_shortfall": 5000,
      "paths_with_dispute": 5000,
      "shortfall_rate": 1.0,
      "dispute_rate": 1.0,
      "mean_unfilled_kwh_per_path": 842.2,
      "p95_unfilled_kwh": 1845.0,
      "pass_shortfall_under_15pct": false,
      "pass_dispute_under_10pct": false,
      "overall_pass": false,
      "note": "Gates: <15% paths with backlog shortfall, <10% with dispute. Pilot fail is informative; operator_target / stablecoin_gate show what policy must achieve."
    },
    "operator_target": {
      "scenario": "operator_target",
      "label": "Target operator \u2014 higher daily delivery + modest reserve buffer",
      "params": {
        "num_paths": 5000,
        "horizon_days": 90,
        "mean_daily_redemptions": 6.0,
        "mean_kwh_per_redemption": 25.0,
        "delivery_capacity_kwh_per_day": 320.0,
        "reserve_kwh_buffer": 500.0,
        "capacity_shock_prob": 0.03,
        "capacity_shock_factor": 0.55,
        "dispute_prob_on_shortfall": 0.35,
        "seed": 42
      },
      "paths_with_shortfall": 0,
      "paths_with_dispute": 0,
      "shortfall_rate": 0.0,
      "dispute_rate": 0.0,
      "mean_unfilled_kwh_per_path": 0.0,
      "p95_unfilled_kwh": 0.0,
      "pass_shortfall_under_15pct": true,
      "pass_dispute_under_10pct": true,
      "overall_pass": true,
      "note": "Gates: <15% paths with backlog shortfall, <10% with dispute. Pilot fail is informative; operator_target / stablecoin_gate show what policy must achieve."
    },
    "stablecoin_gate": {
      "scenario": "stablecoin_gate",
      "label": "Horizon C gate \u2014 high capacity, low shocks, reserve headroom",
      "params": {
        "num_paths": 5000,
        "horizon_days": 90,
        "mean_daily_redemptions": 5.0,
        "mean_kwh_per_redemption": 25.0,
        "delivery_capacity_kwh_per_day": 450.0,
        "reserve_kwh_buffer": 2000.0,
        "capacity_shock_prob": 0.01,
        "capacity_shock_factor": 0.7,
        "dispute_prob_on_shortfall": 0.15,
        "seed": 42
      },
      "paths_with_shortfall": 0,
      "paths_with_dispute": 0,
      "shortfall_rate": 0.0,
      "dispute_rate": 0.0,
      "mean_unfilled_kwh_per_path": 0.0,
      "p95_unfilled_kwh": 0.0,
      "pass_shortfall_under_15pct": true,
      "pass_dispute_under_10pct": true,
      "overall_pass": true,
      "note": "Gates: <15% paths with backlog shortfall, <10% with dispute. Pilot fail is informative; operator_target / stablecoin_gate show what policy must achieve."
    }
  },
  "pilot_current_pass": false,
  "stablecoin_gate_pass": true,
  "phase_pass": true,
  "probe_note": "pilot_current expected to fail; stablecoin_gate shows reserve/capacity target before Horizon C claims.",
  "doc": "docs/exploration/REDEMPTION_STRESS.md"
}
```

### p4_metadata

```json
{
  "phase": "P4_regime_metadata",
  "bundle_schema": "SPK_ATTESTATION_BUNDLE_V2",
  "gates": {
    "site_id_on_attestations": true,
    "time_window_on_attestations": true,
    "location_country": true,
    "grid_zone": true,
    "energy_vintage": true,
    "schema_v2": true,
    "spec_documented": true
  },
  "phase_pass": true,
  "next": "Bind grid_zone + vintage into on-chain attestation metadata hash (roadmap)"
}
```

### p5_peg

```json
{
  "phase": "P5_peg_vs_oracle",
  "spk_v1_peg_enabled_on_chain": false,
  "peg_simulation": {
    "max_peg_deviation_bps": 1228.3131790485113,
    "max_peg_deviation_pct": 12.28,
    "pct_in_5pct_band": 81.4,
    "avg_peg_deviation_bps": -14.8
  },
  "oracle_comparison": [
    {
      "location": "Taiwan",
      "sigma": "189%",
      "max_err_vr95_pct": 21.7,
      "peg_sim_max_dev_pct": 12.28,
      "within_oracle_band": true,
      "note": "Sim PI peg vs thesis oracle tolerance (exploration only)"
    },
    {
      "location": "Saudi Arabia",
      "sigma": "172%",
      "max_err_vr95_pct": 19.7,
      "peg_sim_max_dev_pct": 12.28,
      "within_oracle_band": true,
      "note": "Sim PI peg vs thesis oracle tolerance (exploration only)"
    },
    {
      "location": "Arizona, USA",
      "sigma": "165%",
      "max_err_vr95_pct": 18.9,
      "peg_sim_max_dev_pct": 12.28,
      "within_oracle_band": true,
      "note": "Sim PI peg vs thesis oracle tolerance (exploration only)"
    },
    {
      "location": "Brazil",
      "sigma": "198%",
      "max_err_vr95_pct": 22.7,
      "peg_sim_max_dev_pct": 12.28,
      "within_oracle_band": true,
      "note": "Sim PI peg vs thesis oracle tolerance (exploration only)"
    },
    {
      "location": "Germany",
      "sigma": "45%",
      "max_err_vr95_pct": 5.2,
      "peg_sim_max_dev_pct": 12.28,
      "within_oracle_band": false,
      "note": "Sim PI peg vs thesis oracle tolerance (exploration only)"
    }
  ],
  "taiwan_within_band": true,
  "locations_within_band": 4,
  "gates": {
    "peg_off_in_production_ops": true,
    "peg_sim_ran": true
  },
  "phase_pass": true,
  "note": "If peg-on max deviation exceeds oracle tolerance, peg machinery needs tighter control or higher reserves before stablecoin claims \u2014 independent of CEIR.",
  "artifact": "state/exploration/peg_oracle_compare.json"
}
```

---

## Commands

| Action | Command |
|--------|---------|
| Refresh this report | `npm run exploration:tier-c` |
| Meter cycle (local) | `CYCLE_MINT_MODE=meter npm run spk:v1:cycle` |
| Meter cycle (Sepolia) | `CYCLE_MINT_MODE=meter npm run spk:v1:cycle:sepolia` |
| Reproduce CEIR | `python thesis_package/ceir_regression.py --refresh-panel` |
| Peg sim only | `python scripts/simulate_peg.py` |
| Redemption stress only | `python scripts/exploration/redemption_stress.py` |
| Peg vs oracle compare | `python scripts/exploration/peg_oracle_compare.py` |

See `docs/exploration/TIER_C_PROGRAM.md` for pass/fail definitions.
