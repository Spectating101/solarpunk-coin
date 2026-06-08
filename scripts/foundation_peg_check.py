#!/usr/bin/env python3
"""Run peg simulation and write summary JSON for foundation layer."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "state" / "foundation" / "peg_simulation_summary.json"


def main() -> int:
    sim = ROOT / "scripts" / "simulate_peg.py"
    if not sim.exists():
        print(f"Missing {sim}", file=sys.stderr)
        return 1

    proc = subprocess.run(
        [sys.executable, str(sim)],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    stdout = proc.stdout or ""
    stderr = proc.stderr or ""

    summary = {
        "ok": proc.returncode == 0,
        "script": str(sim.relative_to(ROOT)),
        "stdout_tail": stdout[-4000:] if len(stdout) > 4000 else stdout,
    }

    for line in stdout.splitlines():
        if "In +/-5% Band:" in line:
            summary["pct_in_band"] = line.split(":")[-1].strip()
        if "Max Deviation:" in line:
            summary["max_deviation_bps"] = line.split(":")[-1].strip()

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT)}")
    if proc.returncode != 0:
        print(stderr, file=sys.stderr)
    return proc.returncode


if __name__ == "__main__":
    raise SystemExit(main())
