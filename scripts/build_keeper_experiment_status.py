#!/usr/bin/env python3
from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from statistics import mean
from typing import Any, Dict, List, Optional


ROOT = Path(__file__).resolve().parents[1]
KEEPER_DIR = ROOT / "state" / "keeper_logs"
SUMMARY_JSON = ROOT / "state" / "keeper_logs" / "summary.json"
SUMMARY_MD = ROOT / "docs" / "project" / "DAILY_EXPERIMENT_STATUS.md"
EXPLORER_BASE = "https://sepolia.etherscan.io/tx/"


@dataclass
class KeeperRun:
    path: Path
    run_date: date
    payload: Dict[str, Any]


def _load_log(path: Path) -> Optional[KeeperRun]:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None

    raw_date = payload.get("date")
    if not isinstance(raw_date, str):
        return None

    try:
        run_date = date.fromisoformat(raw_date)
    except ValueError:
        return None

    return KeeperRun(path=path, run_date=run_date, payload=payload)


def _safe_num(value: Any) -> Optional[float]:
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    return None


def _success_streak(dates: List[date]) -> int:
    if not dates:
        return 0
    ordered = sorted(set(dates), reverse=True)
    streak = 1
    cursor = ordered[0]
    for next_day in ordered[1:]:
        if next_day == cursor - timedelta(days=1):
            streak += 1
            cursor = next_day
            continue
        break
    return streak


def _max_gap_days(dates: List[date]) -> int:
    if len(dates) < 2:
        return 0
    ordered = sorted(set(dates))
    gaps = [(ordered[i] - ordered[i - 1]).days - 1 for i in range(1, len(ordered))]
    return max(0, max(gaps))


def _tx_url(tx_hash: Optional[str]) -> Optional[str]:
    if isinstance(tx_hash, str) and tx_hash.startswith("0x"):
        return EXPLORER_BASE + tx_hash
    return None


def build_summary() -> Dict[str, Any]:
    runs = [
        run
        for run in (_load_log(path) for path in sorted(KEEPER_DIR.glob("*.json")))
        if run is not None
    ]
    runs.sort(key=lambda r: r.run_date)

    if not runs:
        return {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "network": "sepolia",
            "total_successful_runs": 0,
            "message": "No keeper logs found",
        }

    dates = [run.run_date for run in runs]
    latest = runs[-1].payload

    index_values = [
        _safe_num(run.payload.get("index", {}).get("normalised"))
        for run in runs
    ]
    index_values = [v for v in index_values if v is not None]

    reserve_ratios = [
        _safe_num(run.payload.get("protocol_state", {}).get("reserve_ratio_pct"))
        for run in runs
    ]
    reserve_ratios = [v for v in reserve_ratios if v is not None]

    peg_stable_count = sum(
        1 for run in runs if run.payload.get("protocol_state", {}).get("peg_stable") is True
    )

    summary = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "network": "sepolia",
        "total_successful_runs": len(runs),
        "first_successful_run": dates[0].isoformat(),
        "last_successful_run": dates[-1].isoformat(),
        "current_success_streak_days": _success_streak(dates),
        "max_missing_gap_days": _max_gap_days(dates),
        "peg_stable_rate": peg_stable_count / len(runs),
        "index_summary": {
            "min": min(index_values) if index_values else None,
            "max": max(index_values) if index_values else None,
            "avg": mean(index_values) if index_values else None,
        },
        "reserve_ratio_summary_pct": {
            "min": min(reserve_ratios) if reserve_ratios else None,
            "max": max(reserve_ratios) if reserve_ratios else None,
            "avg": mean(reserve_ratios) if reserve_ratios else None,
        },
        "latest_run": {
            "date": latest.get("date"),
            "run_at": latest.get("run_at"),
            "keeper": latest.get("keeper"),
            "nasa_date": latest.get("nasa", {}).get("date"),
            "location": latest.get("nasa", {}).get("location"),
            "normalised_index": latest.get("index", {}).get("normalised"),
            "scaled_6dec": latest.get("index", {}).get("scaled_6dec"),
            "protocol_state": latest.get("protocol_state", {}),
            "transactions": latest.get("transactions", {}),
            "transaction_urls": {
                "updateIndex": _tx_url(latest.get("transactions", {}).get("updateIndex")),
                "updateEnergyPrice": _tx_url(latest.get("transactions", {}).get("updateEnergyPrice")),
                "updateOraclePriceAndAdjust": _tx_url(latest.get("transactions", {}).get("updateOraclePriceAndAdjust")),
            },
        },
        "recent_runs": [
            {
                "date": run.payload.get("date"),
                "nasa_date": run.payload.get("nasa", {}).get("date"),
                "normalised_index": run.payload.get("index", {}).get("normalised"),
                "option_index": run.payload.get("protocol_state", {}).get("option_index"),
                "reserve_ratio_pct": run.payload.get("protocol_state", {}).get("reserve_ratio_pct"),
                "peg_stable": run.payload.get("protocol_state", {}).get("peg_stable"),
                "updateIndex_tx": run.payload.get("transactions", {}).get("updateIndex"),
            }
            for run in runs[-14:]
        ],
    }
    return summary


def write_markdown(summary: Dict[str, Any]) -> None:
    latest = summary.get("latest_run", {})
    protocol_state = latest.get("protocol_state", {})
    recent_runs = summary.get("recent_runs", [])

    def fmt_num(value: Any, digits: int = 4) -> str:
        if isinstance(value, (int, float)):
            return f"{value:.{digits}f}"
        return "n/a"

    lines = [
        "# Daily Experiment Status",
        "",
        "Continuous Sepolia proof surface for the NASA POWER -> SolarPunk oracle experiment.",
        "",
        f"- generated_at: `{summary.get('generated_at', 'n/a')}`",
        f"- network: `{summary.get('network', 'sepolia')}`",
        f"- total_successful_runs: `{summary.get('total_successful_runs', 0)}`",
        f"- first_successful_run: `{summary.get('first_successful_run', 'n/a')}`",
        f"- last_successful_run: `{summary.get('last_successful_run', 'n/a')}`",
        f"- current_success_streak_days: `{summary.get('current_success_streak_days', 0)}`",
        f"- max_missing_gap_days: `{summary.get('max_missing_gap_days', 0)}`",
        "",
        "## What this proves",
        "",
        "- The protocol can ingest real public irradiance data on a recurring schedule.",
        "- The data can be transformed into a market-linked index and written on-chain.",
        "- Each run leaves a public transaction trail and a committed repo artifact.",
        "",
        "## Latest run",
        "",
        f"- date: `{latest.get('date', 'n/a')}`",
        f"- NASA observation date: `{latest.get('nasa_date', 'n/a')}`",
        f"- location: `{latest.get('location', 'n/a')}`",
        f"- normalised index: `{fmt_num(latest.get('normalised_index'))}`",
        f"- on-chain option index: `{fmt_num(protocol_state.get('option_index'))}`",
        f"- reserve ratio: `{fmt_num(protocol_state.get('reserve_ratio_pct'), 1)}%`",
        f"- peg stable: `{protocol_state.get('peg_stable', 'n/a')}`",
        f"- cumulative surplus kWh: `{protocol_state.get('cumulative_surplus_kwh', 'n/a')}`",
        f"- updateIndex tx: {latest.get('transaction_urls', {}).get('updateIndex', 'n/a')}",
        f"- updateEnergyPrice tx: {latest.get('transaction_urls', {}).get('updateEnergyPrice', 'n/a')}",
        f"- updateOraclePriceAndAdjust tx: {latest.get('transaction_urls', {}).get('updateOraclePriceAndAdjust', 'n/a')}",
        "",
        "## Aggregate summary",
        "",
        f"- peg stable rate: `{fmt_num(summary.get('peg_stable_rate', 0.0) * 100, 1)}%`",
        f"- normalised index min/max/avg: `{fmt_num(summary.get('index_summary', {}).get('min'))}` / `{fmt_num(summary.get('index_summary', {}).get('max'))}` / `{fmt_num(summary.get('index_summary', {}).get('avg'))}`",
        f"- reserve ratio min/max/avg: `{fmt_num(summary.get('reserve_ratio_summary_pct', {}).get('min'), 1)}%` / `{fmt_num(summary.get('reserve_ratio_summary_pct', {}).get('max'), 1)}%` / `{fmt_num(summary.get('reserve_ratio_summary_pct', {}).get('avg'), 1)}%`",
        "",
        "## Recent runs",
        "",
        "| Date | NASA Date | Normalised Index | Option Index | Reserve Ratio | Peg Stable | updateIndex tx |",
        "|---|---|---:|---:|---:|---|---|",
    ]

    for run in recent_runs:
        tx_hash = run.get("updateIndex_tx")
        tx_cell = f"[{tx_hash[:10]}...]({EXPLORER_BASE}{tx_hash})" if isinstance(tx_hash, str) else "n/a"
        lines.append(
            f"| {run.get('date', 'n/a')} | {run.get('nasa_date', 'n/a')} | "
            f"{fmt_num(run.get('normalised_index'))} | {fmt_num(run.get('option_index'))} | "
            f"{fmt_num(run.get('reserve_ratio_pct'), 1)}% | {run.get('peg_stable', 'n/a')} | {tx_cell} |"
        )

    lines.extend(
        [
            "",
            "## Scope note",
            "",
            "- This is a continuous prototype-stage oracle experiment on Sepolia.",
            "- It demonstrates recurring real-data ingestion and on-chain publication, not production oracle finality.",
        ]
    )

    SUMMARY_MD.parent.mkdir(parents=True, exist_ok=True)
    SUMMARY_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    summary = build_summary()
    SUMMARY_JSON.parent.mkdir(parents=True, exist_ok=True)
    SUMMARY_JSON.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    write_markdown(summary)
    print(f"wrote: {SUMMARY_JSON}")
    print(f"wrote: {SUMMARY_MD}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
