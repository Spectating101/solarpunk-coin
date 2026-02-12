#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
import math
import re
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

from pillar3_engine import OracleSource, Series, aggregate_index, calc_mtm, payoff


def _load_json(path: Path) -> Dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _slug(text: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "-", text.strip().lower()).strip("-")
    return s or "client"


def _load_margin_table(path: Path) -> List[Dict[str, float]]:
    rows: List[Dict[str, float]] = []
    with path.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(
                {
                    "S0": float(row["S0"]),
                    "sigma": float(row["sigma"]),
                    "VaR99_payoff": float(row["VaR99_payoff"]),
                    "Initial_margin_1.5x": float(row["Initial_margin_1.5x"]),
                }
            )
    return rows


def _nearest_margin_row(rows: List[Dict[str, float]], s0: float, sigma: float) -> Dict[str, float]:
    return min(rows, key=lambda r: abs(r["S0"] - s0) + abs(r["sigma"] - sigma))


def _to_md(payload: Dict[str, Any]) -> str:
    i = payload["inputs"]
    o = payload["outputs"]
    s = payload["scenarios"]
    lines: List[str] = []
    lines.append("# Pilot Term Sheet (Indicative)")
    lines.append("")
    lines.append(f"- generated_at: `{payload['generated_at']}`")
    lines.append(f"- client: `{i['client_name']}`")
    lines.append(f"- region: `{i['region']}`")
    lines.append(f"- hedge_goal: `{i['hedge_goal']}`")
    lines.append("")
    lines.append("## Commercial Summary")
    lines.append("")
    lines.append(f"- target_hedged_volume_kwh: `{o['target_hedged_volume_kwh']}`")
    lines.append(f"- recommended_contracts: `{o['recommended_contracts']}`")
    lines.append(f"- indicative_initial_margin_per_contract_usdc: `{o['indicative_initial_margin_per_contract_usdc']}`")
    lines.append(f"- indicative_total_initial_margin_usdc: `{o['indicative_total_initial_margin_usdc']}`")
    lines.append(f"- risk_budget_fit: `{o['risk_budget_fit']}`")
    lines.append("")
    lines.append("## Oracle and Pricing Snapshot")
    lines.append("")
    lines.append(f"- aggregated_spot_index_usd_per_kwh: `{o['aggregated_spot_index_usd_per_kwh']}`")
    lines.append(f"- oracle_status: `{o['oracle_status']}`")
    lines.append(f"- current_mtm_per_contract_usdc: `{o['current_mtm_per_contract_usdc']}`")
    lines.append("")
    lines.append("## Scenario Diagnostics (Per Contract)")
    lines.append("")
    lines.append(f"- downside_index_usd_per_kwh: `{s['downside_index_usd_per_kwh']}`")
    lines.append(f"- downside_payoff_usdc: `{s['downside_payoff_usdc']}`")
    lines.append(f"- base_index_usd_per_kwh: `{s['base_index_usd_per_kwh']}`")
    lines.append(f"- base_payoff_usdc: `{s['base_payoff_usdc']}`")
    lines.append(f"- upside_index_usd_per_kwh: `{s['upside_index_usd_per_kwh']}`")
    lines.append(f"- upside_payoff_usdc: `{s['upside_payoff_usdc']}`")
    lines.append("")
    lines.append("## Non-Binding Notes")
    lines.append("")
    lines.append("- This document is an indicative pilot structure, not an executed contract.")
    lines.append("- Margin figures are mapped from repository stress data and should be revalidated with live data before settlement.")
    for w in payload.get("warnings", []):
        lines.append(f"- warning: {w}")
    lines.append("")
    return "\n".join(lines)


def _build_payload(profile: Dict[str, Any], margin_rows: List[Dict[str, float]]) -> Dict[str, Any]:
    now = time.time()

    client_name = str(profile.get("client_name", "Unknown Client"))
    region = str(profile.get("region", "unknown"))
    hedge_goal = str(profile.get("hedge_goal", "revenue_floor"))
    horizon_days = int(profile.get("hedge_horizon_days", 90))
    expected_generation_kwh = float(profile.get("expected_generation_kwh", 0))
    coverage_target = float(profile.get("coverage_target", 0.7))
    entry_index = float(profile.get("entry_index_usd_per_kwh", 0.0525))
    spot_index = float(profile.get("spot_index_usd_per_kwh", entry_index))
    strike = float(profile.get("strike_usd_per_kwh", entry_index))
    sigma = float(profile.get("volatility_assumption", 1.89))
    contract_notional = float(profile.get("contract_notional_kwh", 1000))
    contracts_requested = int(profile.get("contracts_requested", 0))
    risk_budget = float(profile.get("risk_budget_usdc", 0))

    oracle_cfg = profile.get("oracle_sources", [])
    oracle_sources: List[OracleSource] = []
    hist_window: List[float] = [entry_index, spot_index, strike]
    for source in oracle_cfg:
        value = float(source.get("value", spot_index))
        staleness = int(source.get("staleness_seconds", 120))
        weight = float(source.get("weight", 1.0))
        oracle_sources.append(
            OracleSource(value=value, timestamp=now - staleness, weight=weight)
        )
        hist_window.append(value)

    if len(oracle_sources) < 2:
        oracle_sources = [
            OracleSource(value=spot_index, timestamp=now - 60, weight=0.5),
            OracleSource(value=spot_index * 0.998, timestamp=now - 120, weight=0.5),
        ]
        hist_window.extend([spot_index, spot_index * 0.998])

    aggregated_index, oracle_status = aggregate_index(
        oracle_sources,
        now=now,
        max_staleness_secs=24 * 3600,
        hist_window=hist_window,
    )
    if aggregated_index is None:
        aggregated_index = spot_index

    target_hedged_volume = max(0.0, expected_generation_kwh * coverage_target)
    recommended_contracts = int(math.ceil(target_hedged_volume / max(contract_notional, 1.0)))
    contracts = contracts_requested if contracts_requested > 0 else recommended_contracts

    series = Series(
        expiry=now + horizon_days * 86400,
        strike=strike,
        is_call=False,
        notional_kwh=contract_notional,
    )

    mtm_per_contract = calc_mtm(series, aggregated_index, entry_index)

    margin_row = _nearest_margin_row(margin_rows, s0=entry_index, sigma=sigma)
    im_per_contract = margin_row["Initial_margin_1.5x"]
    total_initial_margin = im_per_contract * contracts
    budget_fit = "within_budget" if total_initial_margin <= risk_budget else "over_budget"

    downside_index = max(0.0, strike * 0.80)
    base_index = aggregated_index
    upside_index = strike * 1.20

    scenarios = {
        "downside_index_usd_per_kwh": round(downside_index, 6),
        "downside_payoff_usdc": round(payoff(series, downside_index), 6),
        "base_index_usd_per_kwh": round(base_index, 6),
        "base_payoff_usdc": round(payoff(series, base_index), 6),
        "upside_index_usd_per_kwh": round(upside_index, 6),
        "upside_payoff_usdc": round(payoff(series, upside_index), 6),
    }

    warnings: List[str] = []
    if oracle_status != "OK":
        warnings.append(f"Oracle status is {oracle_status}; use live feed verification before execution.")
    if budget_fit == "over_budget":
        warnings.append("Requested coverage exceeds stated risk budget; reduce contracts or increase budget.")
    if abs(contracts - recommended_contracts) > max(5, int(0.2 * max(recommended_contracts, 1))):
        warnings.append("Requested contracts deviate materially from coverage target recommendation.")

    payload: Dict[str, Any] = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "inputs": {
            "client_name": client_name,
            "region": region,
            "hedge_goal": hedge_goal,
            "hedge_horizon_days": horizon_days,
            "expected_generation_kwh": expected_generation_kwh,
            "coverage_target": coverage_target,
            "entry_index_usd_per_kwh": entry_index,
            "spot_index_usd_per_kwh": spot_index,
            "strike_usd_per_kwh": strike,
            "volatility_assumption": sigma,
            "contract_notional_kwh": contract_notional,
            "contracts_requested": contracts_requested,
            "risk_budget_usdc": risk_budget,
        },
        "outputs": {
            "target_hedged_volume_kwh": round(target_hedged_volume, 3),
            "recommended_contracts": recommended_contracts,
            "contracts_evaluated": contracts,
            "aggregated_spot_index_usd_per_kwh": round(aggregated_index, 6),
            "oracle_status": oracle_status,
            "current_mtm_per_contract_usdc": round(mtm_per_contract, 6),
            "indicative_var99_payoff_usdc": round(margin_row["VaR99_payoff"], 6),
            "indicative_initial_margin_per_contract_usdc": round(im_per_contract, 6),
            "indicative_total_initial_margin_usdc": round(total_initial_margin, 6),
            "risk_budget_fit": budget_fit,
            "mapped_stress_row": {
                "S0": margin_row["S0"],
                "sigma": margin_row["sigma"],
            },
        },
        "scenarios": scenarios,
        "warnings": warnings,
    }
    return payload


def main() -> int:
    parser = argparse.ArgumentParser(description="Build indicative commercial pilot term sheet from client profile.")
    parser.add_argument("--client-profile", default="clients/sample_solar_operator.json")
    parser.add_argument("--out-dir", default="docs/commercial")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    profile_path = root / args.client_profile
    out_dir = root / args.out_dir
    margin_path = root / "empirical/margin_stress_table.csv"

    profile = _load_json(profile_path)
    margin_rows = _load_margin_table(margin_path)
    payload = _build_payload(profile, margin_rows)

    out_dir.mkdir(parents=True, exist_ok=True)
    slug = _slug(str(payload["inputs"]["client_name"]))

    out_json = out_dir / f"PILOT_TERMSHEET_{slug}.json"
    out_md = out_dir / f"PILOT_TERMSHEET_{slug}.md"

    out_json.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    out_md.write_text(_to_md(payload), encoding="utf-8")

    print(f"wrote: {out_json}")
    print(f"wrote: {out_md}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
