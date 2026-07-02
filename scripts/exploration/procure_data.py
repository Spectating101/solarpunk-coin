#!/usr/bin/env python3
"""Procure and document real/sourced data for Tier C exploration (off-thesis).

Runs local pipelines, fetches public APIs where possible, and writes:
  - state/exploration/data_procurement.json
  - docs/exploration/DATA_PROCUREMENT_AND_RESEARCH.md
"""

from __future__ import annotations

import csv
import json
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
OUT_JSON = ROOT / "state" / "exploration" / "data_procurement.json"
OUT_MD = ROOT / "docs" / "exploration" / "DATA_PROCUREMENT_AND_RESEARCH.md"

LAT, LON = 24.99, 121.30
LOCATION = "Taoyuan, Taiwan"


def _run(cmd: list[str], *, cwd: Path | None = None) -> dict[str, Any]:
    proc = subprocess.run(
        cmd,
        cwd=cwd or ROOT,
        capture_output=True,
        text=True,
    )
    return {
        "command": " ".join(cmd),
        "ok": proc.returncode == 0,
        "stdout_tail": (proc.stdout or "")[-2000:],
        "stderr_tail": (proc.stderr or "")[-1000:],
        "exit_code": proc.returncode,
    }


def procure_ceir() -> dict[str, Any]:
    py = sys.executable
    reg = _run([py, str(ROOT / "thesis_package" / "ceir_regression.py"), "--refresh-panel"])
    panel = ROOT / "thesis_package" / "empirical_results" / "bitcoin_ceir_analysis_ready.csv"
    summary = ROOT / "thesis_package" / "empirical_results" / "ceir_analysis_summary.csv"

    stats: dict[str, Any] = {}
    if panel.exists():
        df = pd.read_csv(panel, parse_dates=["Date"])
        df = df[df.get("in_analysis_period", 1) == 1]
        ban = pd.Timestamp("2021-06-20")
        pre = df[df["Date"] < ban]
        post = df[df["Date"] >= ban]
        stats = {
            "panel_path": str(panel.relative_to(ROOT)),
            "date_min": str(df["Date"].min().date()),
            "date_max": str(df["Date"].max().date()),
            "n_observations": int(len(df)),
            "n_pre_ban": int(len(pre)),
            "n_post_ban": int(len(post)),
            "ceir_mean_pre": round(float(pre["CEIR"].mean()), 3),
            "ceir_mean_post": round(float(post["CEIR"].mean()), 3),
            "cumulative_cost_usd_latest": round(float(df["cumulative_cost"].iloc[-1]), 0),
            "data_lineage": (
                "Historical panel: Bitcoin price + Cambridge-style cumulative energy cost "
                "(electricity_price × daily TWh path). Modelled consumption side — not site meters."
            ),
        }

    coef = {}
    if summary.exists():
        row = pd.read_csv(summary).iloc[0].to_dict()
        coef = {k: (float(v) if isinstance(v, (int, float)) else v) for k, v in row.items()}

    return {
        "step": "ceir_regression",
        "regression_run": reg,
        "panel_stats": stats,
        "coefficients": coef,
        "sources": [
            "thesis_package/empirical_results/bitcoin_ceir_analysis_ready.csv",
            "Cambridge CBECI methodology (modelled mining electricity)",
        ],
    }


def fetch_nasa_power_ghi(days_back: int = 35) -> dict[str, Any]:
    """Fetch recent NASA POWER GHI for Taoyuan (production-side irradiance proxy)."""
    end = datetime.now(timezone.utc).date()
    start = end - timedelta(days=days_back)
    start_s = start.strftime("%Y%m%d")
    end_s = end.strftime("%Y%m%d")
    url = (
        "https://power.larc.nasa.gov/api/temporal/daily/point"
        f"?parameters=ALLSKY_SFC_SW_DWN&community=RE"
        f"&longitude={LON}&latitude={LAT}"
        f"&start={start_s}&end={end_s}&format=JSON"
    )
    try:
        with urllib.request.urlopen(url, timeout=60) as resp:
            payload = json.loads(resp.read().decode())
        series = payload.get("properties", {}).get("parameter", {}).get("ALLSKY_SFC_SW_DWN", {})
        valid = {k: v for k, v in series.items() if isinstance(v, (int, float)) and v > -900}
        if not valid:
            return {"ok": False, "error": "no valid GHI days in window", "url": url}
        latest_key = max(valid.keys())
        return {
            "ok": True,
            "location": LOCATION,
            "lat": LAT,
            "lon": LON,
            "api": "NASA POWER daily ALLSKY_SFC_SW_DWN",
            "window": {"start": start_s, "end": end_s},
            "latest_valid_date": latest_key,
            "ghi_kwh_m2_day": round(float(valid[latest_key]), 4),
            "n_valid_days": len(valid),
            "url": url,
            "use": "Production-side resource benchmark (irradiance), contrasts with CBECI consumption estimates",
        }
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        return {"ok": False, "error": str(exc), "url": url}


def procure_operator_intake() -> dict[str, Any]:
    run = _run(["npm", "run", "product:operator-intake"], cwd=ROOT)
    out = ROOT / "state" / "product" / "operator_data_intake.json"
    bundle = ROOT / "state" / "product" / "operator_data_attestation_bundle.json"
    detail: dict[str, Any] = {"run": run}
    if out.exists():
        data = json.loads(out.read_text(encoding="utf-8"))
        detail["summary"] = data.get("summary")
        detail["operator_profile"] = (data.get("operator_profile") or {}).get("operator_name")
        detail["accepted_kwh"] = (data.get("summary") or {}).get("total_eligible_surplus_kwh")
    detail["artifacts"] = [
        str(p.relative_to(ROOT)) for p in [out, bundle] if p.exists()
    ]
    return detail


def procure_meter_csv_import() -> dict[str, Any]:
    csv_path = ROOT / "data" / "attestations" / "sample_meter_export.csv"
    out_raw = ROOT / "state" / "exploration" / "csv_import_raw_readings.json"
    env = {**dict(**__import__("os").environ), "METER_PRIVATE_KEY": "0x59c6995e998f97a5a0044966f0945384dca7c37fbd5aebd30dcdcc78e9d6b5b5"}
    proc = subprocess.run(
        [
            "node",
            "scripts/import_meter_csv.js",
            f"--csv={csv_path}",
            f"--out={out_raw}",
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
        env=env,
    )
    run = {
        "command": "import_meter_csv (signed with dev fixture key TW-TY-0001)",
        "ok": proc.returncode == 0,
        "stdout_tail": (proc.stdout or "")[-1500:],
        "stderr_tail": (proc.stderr or "")[-800:],
        "exit_code": proc.returncode,
    }
    rows = []
    if csv_path.exists():
        with csv_path.open(encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
    surplus = sum(float(r.get("export_kwh", 0) or 0) + float(r.get("curtailed_kwh", 0) or 0) for r in rows)
    return {
        "run": run,
        "source_csv": str(csv_path.relative_to(ROOT)),
        "n_csv_rows": len(rows),
        "csv_surplus_kwh_total": round(surplus, 2),
        "output_raw": str(out_raw.relative_to(ROOT)) if out_raw.exists() else None,
    }


def procure_inverter_adapter() -> dict[str, Any]:
    run = _run(
        [
            "node",
            "scripts/inverter_meter_adapter.js",
            "--provider=sample-cumulative",
            "--start=data/inverter/sample_cumulative_start.json",
            "--end=data/inverter/sample_cumulative_end.json",
            "--meter-id=TW-TY-0001",
            "--site-id=taoyuan-rooftop-a",
            "--use-dev-fixture-key",
            "--out-json=state/exploration/inverter_adapter_receipt.json",
            "--out-raw=state/exploration/inverter_raw_readings.json",
            "--out-bundle=state/exploration/inverter_attestation_bundle.json",
        ],
        cwd=ROOT,
    )
    receipt_path = ROOT / "state" / "exploration" / "inverter_adapter_receipt.json"
    receipt = json.loads(receipt_path.read_text(encoding="utf-8")) if receipt_path.exists() else {}
    norm = receipt.get("normalized_reading", {})
    mint = receipt.get("mint_readiness", {})
    return {
        "run": run,
        "receipt": str(receipt_path.relative_to(ROOT)) if receipt_path.exists() else None,
        "surplus_kwh": norm.get("export_kwh"),
        "generation_kwh": norm.get("generation_kwh"),
        "accepted_surplus_kwh": mint.get("accepted_surplus_kwh"),
        "can_mint_from_adapter": mint.get("can_mint_from_adapter"),
        "evidence_grade": receipt.get("source", {}).get("evidence_grade"),
        "references": receipt.get("official_references", [])[:2],
    }


def procure_ausgrid_sample() -> dict[str, Any]:
    """Parse public Ausgrid solar home sample — GG (gross generation) rows as export proxy."""
    path = ROOT / "data" / "public" / "ausgrid_sample.csv"
    if not path.exists():
        return {"ok": False, "error": "missing ausgrid sample"}

    gg_rows: list[dict[str, str]] = []
    with path.open(encoding="utf-8") as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) < 4:
                continue
            if row[3] == "GG":
                gg_rows.append({"date": row[4], "intervals": row[5:53]})

    if not gg_rows:
        return {"ok": False, "error": "no GG rows"}

    first = gg_rows[0]
    intervals = [float(x) if x else 0.0 for x in first["intervals"]]
    # 30-min kWh intervals → daily generation sum
    daily_kwh = round(sum(intervals), 3)
    peak_interval_kwh = round(max(intervals), 3)

    return {
        "ok": True,
        "source": "Ausgrid Solar Home Electricity Data (public sample row)",
        "source_file": str(path.relative_to(ROOT)),
        "license_note": "Public research dataset; not SPK operator data",
        "sample_date": first["date"],
        "n_gg_days_in_sample": len(gg_rows),
        "daily_generation_kwh_proxy": daily_kwh,
        "peak_30min_kwh": peak_interval_kwh,
        "use": "External validation that real utility-export formats exist; P4 geography AU not TW",
    }


def build_contrast(ceir: dict[str, Any], nasa: dict[str, Any], meter: dict[str, Any]) -> dict[str, Any]:
    panel = ceir.get("panel_stats") or {}
    return {
        "title": "Consumption-side (CEIR) vs production-side (SPK) data contrast",
        "rows": [
            {
                "dimension": "Object",
                "ceir_bitcoin": "Bitcoin market cap vs cumulative mining electricity cost",
                "spk_production": "Verified rooftop/export surplus kWh",
            },
            {
                "dimension": "Side",
                "ceir_bitcoin": "Consumption (PoW burn)",
                "spk_production": "Production (export/curtailment)",
            },
            {
                "dimension": "Primary source",
                "ceir_bitcoin": "Cambridge CBECI-style model in panel",
                "spk_production": "Signed meter / inverter / operator CSV",
            },
            {
                "dimension": "Sample period",
                "ceir_bitcoin": f"{panel.get('date_min')} → {panel.get('date_max')} (n={panel.get('n_observations')})",
                "spk_production": "Taoyuan fixtures + operator intake 2026-05",
            },
            {
                "dimension": "Latest CEIR / resource",
                "ceir_bitcoin": f"mean CEIR post-ban ≈ {panel.get('ceir_mean_post')}",
                "spk_production": (
                    f"NASA GHI {nasa.get('ghi_kwh_m2_day')} kWh/m²/day ({nasa.get('latest_valid_date')})"
                    if nasa.get("ok")
                    else "NASA fetch pending"
                ),
            },
            {
                "dimension": "Empirical finding",
                "ceir_bitcoin": f"pre-ban β ≈ {ceir.get('coefficients', {}).get('Pre_ban_CEIR_coef', '—')}",
                "spk_production": f"CSV import surplus {meter.get('csv_surplus_kwh_total')} kWh (2 days)",
            },
        ],
    }


def research_notes() -> dict[str, Any]:
    return {
        "comparables": [
            {
                "name": "SolarCoin / kSLR",
                "claim": "1 kSLR per verified kWh solar production; 30k+ installations",
                "contrast_to_spk": (
                    "Reward token on Base/EW Chain — production-linked issuance like SPK anchor, "
                    "but no circulation-first network-money or redemption state machine in our sense."
                ),
                "sources": [
                    "https://solarcoin.org/how-it-works/",
                    "https://solarcoin.org/frequently-asked-questions/",
                ],
            },
            {
                "name": "EnergyTag Granular Certificates (GC)",
                "claim": "Hourly-or-less energy attributes; temporal + geographic matching; anti-double-count",
                "contrast_to_spk": (
                    "SPK v2 attestation fields (country, grid_zone, energy_vintage) align with GC "
                    "matching features — SPK adds monetary circulation + optional redeem."
                ),
                "sources": [
                    "https://energytag.org/wp-content/uploads/2024/12/EnergyTag_Granular-Certificate-Scheme-Standard-V2.pdf",
                    "https://energytag.org/wp-content/uploads/2024/03/Granular-Certificate-Matching-Standard_V1.pdf",
                ],
            },
            {
                "name": "FSB global stablecoin recommendations",
                "claim": "Redemption, governance, stress planning for stable-value systems",
                "contrast_to_spk": "Horizon C bar; SPK v1 peg-off deliberately below this bar",
                "sources": [
                    "https://www.fsb.org/2023/07/high-level-recommendations-for-the-regulation-supervision-and-oversight-of-global-stablecoin-arrangements-final-report/",
                ],
            },
        ],
        "stitch_implication": (
            "CEIR procurement validates passive consumption-side signal; SPK procurement validates "
            "production-side attestation path. Comparable literature shows production tokens exist "
            "(SolarCoin) and regime metadata standards exist (EnergyTag) — SPK combines mint + "
            "settlement + optional redeem in one testnet stack."
        ),
    }


def render_md(report: dict[str, Any]) -> str:
    ts = report["generated_at"]
    lines = [
        "# Data Procurement & Research — Tier C",
        "",
        f"**Generated:** {ts}  ",
        "**Command:** `npm run exploration:procure-data`",
        "",
        "This document records **actual data runs and external sources** — not simulation-only checks.",
        "",
        "## 1. CEIR panel (consumption side)",
        "",
    ]
    ceir = report["procurement"]["ceir"]
    ps = ceir.get("panel_stats") or {}
    lines.extend(
        [
            f"- Panel: `{ps.get('panel_path', '—')}`",
            f"- Range: {ps.get('date_min')} → {ps.get('date_max')} ({ps.get('n_observations')} days)",
            f"- Pre-ban mean CEIR: {ps.get('ceir_mean_pre')} | Post-ban: {ps.get('ceir_mean_post')}",
            f"- Regression refresh: {'ok' if ceir['regression_run']['ok'] else 'FAILED'}",
            f"- Lineage: {ps.get('data_lineage', '')}",
            "",
            "## 2. Production-side procurement",
            "",
        ]
    )
    nasa = report["procurement"]["nasa_power"]
    if nasa.get("ok"):
        lines.append(
            f"- **NASA POWER** ({nasa['location']}): GHI **{nasa['ghi_kwh_m2_day']}** kWh/m²/day on `{nasa['latest_valid_date']}` "
            f"({nasa['n_valid_days']} valid days in window)"
        )
    else:
        lines.append(f"- NASA POWER: failed — {nasa.get('error')}")

    op = report["procurement"]["operator_intake"]
    lines.append(
        f"- **Operator intake:** accepted surplus **{op.get('accepted_kwh', '—')}** kWh "
        f"({op.get('operator_profile', 'sample operator')}) — "
        f"{'ok' if op['run']['ok'] else 'FAILED'}"
    )

    meter = report["procurement"]["meter_csv"]
    lines.append(
        f"- **Meter CSV import:** {meter.get('n_csv_rows')} rows, **{meter.get('csv_surplus_kwh_total')}** kWh surplus total"
    )

    inv = report["procurement"]["inverter_adapter"]
    lines.append(
        f"- **Inverter adapter:** accepted surplus **{inv.get('accepted_surplus_kwh', inv.get('surplus_kwh'))}** kWh "
        f"(generation {inv.get('generation_kwh')} kWh, grade {inv.get('evidence_grade', '—')})"
    )

    aus = report["procurement"]["ausgrid"]
    if aus.get("ok"):
        lines.append(
            f"- **Ausgrid public sample:** {aus['daily_generation_kwh_proxy']} kWh/day proxy ({aus['sample_date']})"
        )

    lines.extend(["", "## 3. Consumption vs production contrast", ""])
    for row in report["contrast"]["rows"]:
        lines.append(f"- **{row['dimension']}** — CEIR: {row['ceir_bitcoin']} | SPK: {row['spk_production']}")

    lines.extend(["", "## 4. External research (comparables)", ""])
    for comp in report["research"]["comparables"]:
        lines.append(f"### {comp['name']}")
        lines.append(f"- Claim: {comp['claim']}")
        lines.append(f"- vs SPK: {comp['contrast_to_spk']}")
        for src in comp["sources"]:
            lines.append(f"- Source: {src}")
        lines.append("")

    lines.append(f"## 5. Stitch implication\n\n{report['research']['stitch_implication']}\n")
    lines.append("---\n")
    lines.append("Re-run: `npm run exploration:procure-data && npm run exploration:tier-c`\n")
    return "\n".join(lines)


def main() -> int:
    ceir = procure_ceir()
    nasa = fetch_nasa_power_ghi()
    operator = procure_operator_intake()
    meter_csv = procure_meter_csv_import()
    inverter = procure_inverter_adapter()
    ausgrid = procure_ausgrid_sample()

    report = {
        "schema": "TIER_C_DATA_PROCUREMENT",
        "version": "1.0.0",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "procurement": {
            "ceir": ceir,
            "nasa_power": nasa,
            "operator_intake": operator,
            "meter_csv": meter_csv,
            "inverter_adapter": inverter,
            "ausgrid": ausgrid,
        },
        "contrast": build_contrast(ceir, nasa, meter_csv),
        "research": research_notes(),
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    OUT_MD.write_text(render_md(report), encoding="utf-8")

    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")
    ok = ceir["regression_run"]["ok"] and nasa.get("ok") and operator["run"]["ok"]
    print(f"core_procurement_ok={ok}")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
