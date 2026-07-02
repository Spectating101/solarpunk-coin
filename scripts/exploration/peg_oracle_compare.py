#!/usr/bin/env python3
"""Compare peg simulation deviation to Ch 4 oracle tolerance bands — Tier C P5."""

from __future__ import annotations

import csv
import io
import json
import sys
from contextlib import redirect_stdout
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))


@dataclass
class PegOracleRow:
    location: str
    sigma: str
    max_err_vr95_pct: float
    peg_sim_max_dev_pct: float | None
    within_oracle_band: bool
    note: str


def load_oracle_tolerance() -> list[dict[str, str]]:
    path = ROOT / "thesis_package" / "empirical_results" / "oracle_tolerance.csv"
    with path.open(encoding="utf-8") as f:
        return list(csv.DictReader(f))


def run_peg_sim(days: int = 365, seed: int = 42) -> dict[str, float]:
    from simulate_peg import SPKSimulation, SimulationParams  # type: ignore

    params = SimulationParams(days=days)
    sim = SPKSimulation(params)
    np.random.seed(seed)
    with redirect_stdout(io.StringIO()):
        df, cum_mint, cum_burn = sim.run()
    stats = sim.analyze_results(df, cum_mint, cum_burn)
    max_bps = float(stats["max_peg_deviation_bps"])
    return {
        "max_peg_deviation_bps": max_bps,
        "max_peg_deviation_pct": round(max_bps / 100.0, 2),
        "pct_in_5pct_band": round(float(stats["pct_in_band"]), 1),
        "avg_peg_deviation_bps": round(float(stats["avg_peg_deviation_bps"]), 1),
    }


def compare_peg_to_oracle() -> dict[str, Any]:
    peg = run_peg_sim()
    max_dev = peg["max_peg_deviation_pct"]
    rows: list[PegOracleRow] = []

    for item in load_oracle_tolerance():
        loc = item["Location"]
        raw = item.get("Max err @ VR≥95%", "0").replace("%", "")
        oracle_pct = float(raw)
        within = max_dev <= oracle_pct
        rows.append(
            PegOracleRow(
                location=loc,
                sigma=item.get("sigma", ""),
                max_err_vr95_pct=oracle_pct,
                peg_sim_max_dev_pct=max_dev,
                within_oracle_band=within,
                note="Sim PI peg vs thesis oracle tolerance (exploration only)",
            )
        )

    taiwan = next((r for r in rows if r.location == "Taiwan"), None)
    return {
        "peg_simulation": peg,
        "spk_v1_posture": "peg_off_by_default",
        "comparison_rows": [asdict(r) for r in rows],
        "taiwan_within_band": taiwan.within_oracle_band if taiwan else False,
        "locations_within_band": sum(1 for r in rows if r.within_oracle_band),
        "interpretation": (
            "If peg-on max deviation exceeds oracle tolerance, peg machinery needs tighter "
            "control or higher reserves before stablecoin claims — independent of CEIR."
        ),
    }


def main() -> int:
    report = compare_peg_to_oracle()
    out = ROOT / "state" / "exploration" / "peg_oracle_compare.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))
    print(f"\nwrote {out.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
