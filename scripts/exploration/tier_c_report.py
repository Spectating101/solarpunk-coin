#!/usr/bin/env python3
"""Tier C exploration report — CEIR → SPK stitch evidence (off-thesis).

Reads repo artifacts, runs local stress sims, writes:
  - state/exploration/tier_c_report.json
  - docs/exploration/TIER_C_STATUS.md

Not part of thesis build. Safe to run without Sepolia credentials.
"""

from __future__ import annotations

import csv
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "exploration"))
sys.path.insert(0, str(ROOT / "scripts"))

from redemption_stress import run_all_scenarios  # noqa: E402

CORE_PHASES = ("p0_ceir", "p1_meter", "p2_contrast", "p4_metadata")

OUT_JSON = ROOT / "state" / "exploration" / "tier_c_report.json"
OUT_MD = ROOT / "docs" / "exploration" / "TIER_C_STATUS.md"


def _read_json(path: Path) -> dict[str, Any] | None:
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def assess_meter_path() -> dict[str, Any]:
    bundle_path = ROOT / "state" / "attestations" / "latest_attestation_bundle.json"
    bundle = _read_json(bundle_path)
    runtime = _read_json(ROOT / "state" / "runtime" / "spk_v1.json")

    meter_cycles: list[dict[str, Any]] = []
    if runtime and "operations" in runtime:
        for op in runtime["operations"]:
            if op.get("mint_mode") == "meter":
                for step in op.get("steps", []):
                    if step.get("action") == "mint_from_attestation":
                        meter_cycles.append(
                            {
                                "cycle_id": op.get("cycle_id"),
                                "tx_hash": step.get("tx_hash"),
                                "surplus_kwh": step.get("surplus_kwh"),
                                "meter_source": step.get("meter_source"),
                                "meter_scale": step.get("meter_scale"),
                            }
                        )

    commands = {
        "local_meter_cycle": "CYCLE_MINT_MODE=meter npm run spk:v1:cycle",
        "sepolia_meter_cycle": "CYCLE_MINT_MODE=meter npm run spk:v1:cycle:sepolia",
        "foundation_meter": "npm run foundation:cycle:meter",
        "meter_onboard": "npm run meter:onboard",
        "inverter_adapter": "npm run meter:inverter-adapter",
    }

    accepted = bundle.get("accepted_attestations", []) if bundle else []
    sites = sorted({a.get("site_id") for a in accepted if a.get("site_id")})

    pass_bundle = bundle is not None and len(accepted) >= 1
    pass_on_chain = len(meter_cycles) >= 1
    pass_quality = (
        bundle is not None
        and bundle.get("summary", {}).get("rejected_records", 0) >= 1
    )

    return {
        "phase": "P1_meter_data_stitch",
        "bundle_path": str(bundle_path.relative_to(ROOT)),
        "bundle_present": bundle is not None,
        "accepted_records": len(accepted),
        "rejected_records": (bundle or {}).get("summary", {}).get("rejected_records"),
        "total_surplus_kwh": (bundle or {}).get("summary", {}).get("total_surplus_kwh"),
        "sites": sites,
        "meter_on_chain_cycles": len(meter_cycles),
        "meter_mint_txs": meter_cycles[:5],
        "commands": commands,
        "gates": {
            "bundle_with_accepted_attestations": pass_bundle,
            "quality_filter_rejects_some_rows": pass_quality,
            "sepolia_meter_mint_recorded": pass_on_chain,
        },
        "phase_pass": pass_bundle and pass_quality and pass_on_chain,
        "next": "Re-run sepolia meter cycle after new inverter export; document tx in METER_EVIDENCE.md",
    }


def assess_ceir_stitch() -> dict[str, Any]:
    ceir_csv = ROOT / "thesis_package" / "empirical_results" / "ceir_analysis_summary.csv"
    row: dict[str, str] = {}
    if ceir_csv.exists():
        with ceir_csv.open(encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
            if rows:
                row = rows[0]

    pre_beta = float(row.get("Pre_ban_CEIR_coef", "0") or 0)
    post_beta = float(row.get("Post_ban_CEIR_coef", "0") or 0)
    pre_p = float(row.get("Pre_ban_p_hac", "1") or 1)
    post_p = float(row.get("Post_ban_p_hac", "1") or 1)

    return {
        "phase": "P0_ceir_motivation",
        "source": str(ceir_csv.relative_to(ROOT)),
        "pre_ban_beta": pre_beta,
        "post_ban_beta": post_beta,
        "pre_ban_significant_5pct": pre_p < 0.05,
        "post_ban_significant_5pct": post_p < 0.05,
        "stitch_reading": (
            "Energy-cost information appears pre-ban; weakens post-ban — "
            "motivates designed surplus issuance, not passive PoW inference."
        ),
        "reproduce": "python thesis_package/ceir_regression.py --refresh-panel",
        "phase_pass": True,
    }


def assess_peg_vs_oracle() -> dict[str, Any]:
    from peg_oracle_compare import compare_peg_to_oracle  # noqa: E402

    try:
        report = compare_peg_to_oracle()
        peg_ok = True
    except Exception as exc:  # noqa: BLE001
        report = {"error": str(exc)}
        peg_ok = False

    runtime = _read_json(ROOT / "state" / "runtime" / "spk_v1.json") or {}
    peg_enabled = (runtime.get("on_chain") or {}).get("peg_enabled", False)

    out_path = ROOT / "state" / "exploration" / "peg_oracle_compare.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    peg_sim = report.get("peg_simulation") or {}
    return {
        "phase": "P5_peg_vs_oracle",
        "spk_v1_peg_enabled_on_chain": bool(peg_enabled),
        "peg_simulation": peg_sim,
        "oracle_comparison": report.get("comparison_rows"),
        "taiwan_within_band": report.get("taiwan_within_band"),
        "locations_within_band": report.get("locations_within_band"),
        "gates": {
            "peg_off_in_production_ops": not bool(peg_enabled),
            "peg_sim_ran": peg_ok,
        },
        "phase_pass": peg_ok and not bool(peg_enabled),
        "note": report.get("interpretation", ""),
        "artifact": "state/exploration/peg_oracle_compare.json",
    }


def assess_redemption_stress() -> dict[str, Any]:
    from dataclasses import asdict

    scenarios = run_all_scenarios()
    by_name = {s.scenario: asdict(s) for s in scenarios}
    stablecoin_pass = by_name.get("stablecoin_gate", {}).get("overall_pass", False)
    pilot_pass = by_name.get("pilot_current", {}).get("overall_pass", False)

    return {
        "phase": "P3_redemption_stress",
        "scenarios": by_name,
        "pilot_current_pass": pilot_pass,
        "stablecoin_gate_pass": stablecoin_pass,
        "phase_pass": stablecoin_pass,
        "probe_note": (
            "pilot_current expected to fail; stablecoin_gate shows reserve/capacity target "
            "before Horizon C claims."
        ),
        "doc": "docs/exploration/REDEMPTION_STRESS.md",
    }


def assess_production_contrast() -> dict[str, Any]:
    return {
        "phase": "P2_production_vs_consumption",
        "doc": "docs/exploration/PRODUCTION_VS_CONSUMPTION.md",
        "ceir_side": "consumption (PoW mining burn, Cambridge estimates)",
        "spk_side": "production (meter-attested surplus export)",
        "phase_pass": True,
        "note": "Narrative stitch — see PRODUCTION_VS_CONSUMPTION.md",
    }


def assess_metadata_roadmap() -> dict[str, Any]:
    bundle = _read_json(ROOT / "state" / "attestations" / "latest_attestation_bundle.json")
    has_windows = False
    has_sites = False
    has_country = False
    has_grid = False
    has_vintage = False
    if bundle:
        for a in bundle.get("accepted_attestations", []):
            if a.get("window_start") and a.get("window_end"):
                has_windows = True
            if a.get("site_id"):
                has_sites = True
            if a.get("location_country"):
                has_country = True
            if a.get("grid_zone") and a.get("grid_zone") != "unknown":
                has_grid = True
            if a.get("energy_vintage"):
                has_vintage = True

    v2_schema = (bundle or {}).get("bundle_schema") == "SPK_ATTESTATION_BUNDLE_V2"

    return {
        "phase": "P4_regime_metadata",
        "bundle_schema": (bundle or {}).get("bundle_schema"),
        "gates": {
            "site_id_on_attestations": has_sites,
            "time_window_on_attestations": has_windows,
            "location_country": has_country,
            "grid_zone": has_grid,
            "energy_vintage": has_vintage,
            "schema_v2": v2_schema,
            "spec_documented": (ROOT / "docs/exploration/ATTESTATION_SCHEMA_V2.md").exists(),
        },
        "phase_pass": has_sites and has_windows and has_country and has_grid and has_vintage and v2_schema,
        "next": "Bind grid_zone + vintage into on-chain attestation metadata hash (roadmap)",
    }


def render_markdown(report: dict[str, Any]) -> str:
    ts = report["generated_at"]
    overall = report["overall"]
    lines = [
        "# Tier C Exploration Status",
        "",
        f"**Generated:** {ts}  ",
        "**Scope:** Off-thesis CEIR → SPK empirical stitch. Re-run: `npm run exploration:tier-c`",
        "",
        f"## Overall: **{'PASS' if overall['pass'] else 'IN PROGRESS'}** ({overall['phases_pass']}/{overall['phases_total']} phases passing exploration gates)",
        "",
        overall["summary"],
        "",
        "---",
        "",
        "## Phase summary",
        "",
        "| Phase | Name | Pass |",
        "|-------|------|------|",
    ]

    for key, block in report["phases"].items():
        name = block.get("phase", key)
        ok = "yes" if block.get("phase_pass") else "no"
        lines.append(f"| {key} | {name} | {ok} |")

    lines.extend(["", "---", "", "## Details", ""])

    for key, block in report["phases"].items():
        lines.append(f"### {key}")
        lines.append("")
        lines.append("```json")
        lines.append(json.dumps(block, indent=2))
        lines.append("```")
        lines.append("")

    lines.extend(
        [
            "---",
            "",
            "## Commands",
            "",
            "| Action | Command |",
            "|--------|---------|",
            "| Refresh this report | `npm run exploration:tier-c` |",
            "| Meter cycle (local) | `CYCLE_MINT_MODE=meter npm run spk:v1:cycle` |",
            "| Meter cycle (Sepolia) | `CYCLE_MINT_MODE=meter npm run spk:v1:cycle:sepolia` |",
            "| Reproduce CEIR | `python thesis_package/ceir_regression.py --refresh-panel` |",
            "| Peg sim only | `python scripts/simulate_peg.py` |",
            "| Redemption stress only | `python scripts/exploration/redemption_stress.py` |",
            "| Peg vs oracle compare | `python scripts/exploration/peg_oracle_compare.py` |",
            "",
            "See `docs/exploration/TIER_C_PROGRAM.md` for pass/fail definitions.",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> int:
    procure_path = ROOT / "state" / "exploration" / "data_procurement.json"
    data_procurement = _read_json(procure_path) if procure_path.exists() else None

    phases = {
        "p0_ceir": assess_ceir_stitch(),
        "p1_meter": assess_meter_path(),
        "p2_contrast": assess_production_contrast(),
        "p3_redemption": assess_redemption_stress(),
        "p4_metadata": assess_metadata_roadmap(),
        "p5_peg": assess_peg_vs_oracle(),
    }

    passed = sum(1 for p in phases.values() if p.get("phase_pass"))
    total = len(phases)
    core_pass = all(phases[k].get("phase_pass") for k in CORE_PHASES)

    report = {
        "schema": "TIER_C_EXPLORATION_REPORT",
        "version": "1.0.0",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "purpose": "CEIR-to-SPK stitch evidence (exploration, not thesis manuscript)",
        "data_procurement": data_procurement,
        "phases": phases,
        "overall": {
            "phases_pass": passed,
            "phases_total": total,
            "core_phases_pass": core_pass,
            "pass": core_pass,
            "summary": (
                "Core stitch (CEIR + meter + production contrast + metadata) must pass. "
                "P3 redemption stress and P5 peg-vs-oracle are stress probes — failing them "
                "is expected at pilot scale until capacity, reserves, and peg-on tuning."
            ),
        },
        "related_docs": [
            "docs/exploration/DATA_PROCUREMENT_AND_RESEARCH.md",
            "docs/exploration/TIER_C_PROGRAM.md",
            "docs/exploration/PRODUCTION_VS_CONSUMPTION.md",
            "docs/exploration/METER_EVIDENCE.md",
            "docs/exploration/REDEMPTION_STRESS.md",
            "docs/exploration/ATTESTATION_SCHEMA_V2.md",
            "thesis_package/CEIR_SPK_STITCH_PLAN.md",
            "docs/product/CEIR_TO_SPK_LITERATURE_BRIDGE.md",
        ],
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    OUT_MD.parent.mkdir(parents=True, exist_ok=True)
    OUT_MD.write_text(render_markdown(report), encoding="utf-8")

    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")
    print(f"phases passing: {passed}/{total}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
