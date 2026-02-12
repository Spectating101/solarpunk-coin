#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from html import escape
from pathlib import Path
from typing import Any, Dict


def load_json(path: Path) -> Dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def badge(value: bool) -> str:
    return "PASS" if value else "FAIL"


def render_dashboard(
    verify: Dict[str, Any],
    project: Dict[str, Any],
    grant: Dict[str, Any],
    monetary: Dict[str, Any],
    phase_gates: Dict[str, Any],
) -> str:
    checks = project.get("core_checks", {})
    inventories = project.get("inventories", {})
    lanes = project.get("independent_lanes", {})
    profiles = project.get("execution_profiles", {})

    grade = str(project.get("readiness_grade", "N/A"))
    status = str(verify.get("overall_status", project.get("verification_status", "unknown")))
    warnings = int(verify.get("warnings", project.get("verification_warnings", 0) or 0))
    monetary_grade = str(monetary.get("readiness_grade", "N/A"))
    gate_decision = str(phase_gates.get("decision", "UNKNOWN"))
    gate_target = str(phase_gates.get("target_phase", "N/A"))

    generated_at = datetime.now(timezone.utc).isoformat()

    def li_pairs(block: Dict[str, Any]) -> str:
        return "\n".join(
            f"<li><span>{escape(str(k))}</span><strong>{escape(str(v))}</strong></li>" for k, v in block.items()
        )

    return f"""<!doctype html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <title>SolarPunk Project Dashboard</title>
  <style>
    :root {{
      --bg: #f6f8f2;
      --panel: #ffffff;
      --ink: #16211c;
      --muted: #4f6257;
      --ok: #1f8a3b;
      --warn: #b66a00;
      --bad: #c32626;
      --accent: #1f6f5f;
      --line: #d8e1da;
    }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif; color: var(--ink); background: radial-gradient(circle at 0% 0%, #edf5ed 0, var(--bg) 45%); }}
    .wrap {{ max-width: 1100px; margin: 0 auto; padding: 24px; }}
    .hero {{ background: linear-gradient(135deg, #184e41, #2c6e5e); color: #fff; border-radius: 14px; padding: 24px; box-shadow: 0 10px 30px rgba(19, 48, 40, 0.16); }}
    .hero h1 {{ margin: 0 0 8px; font-size: 30px; line-height: 1.1; }}
    .hero p {{ margin: 0; opacity: .92; }}
    .stats {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 16px; }}
    .stat {{ background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); border-radius: 10px; padding: 12px; }}
    .stat .k {{ font-size: 12px; opacity: .85; text-transform: uppercase; letter-spacing: .04em; }}
    .stat .v {{ font-size: 24px; font-weight: 700; margin-top: 3px; }}
    .grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 14px; }}
    .card {{ background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 16px; }}
    .card h2 {{ margin: 0 0 10px; font-size: 18px; }}
    ul {{ list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }}
    li {{ display: flex; justify-content: space-between; border-bottom: 1px dashed var(--line); padding-bottom: 6px; gap: 8px; }}
    li span {{ color: var(--muted); }}
    li strong {{ text-align: right; }}
    .cmds code {{ display: block; background: #0f1f1a; color: #d5efe3; border-radius: 8px; padding: 9px 10px; margin-bottom: 8px; overflow-x: auto; }}
    .pill {{ display: inline-block; border-radius: 999px; padding: 4px 9px; font-size: 12px; font-weight: 700; color: #fff; }}
    .ok {{ background: var(--ok); }}
    .warn {{ background: var(--warn); }}
    .bad {{ background: var(--bad); }}
    .foot {{ margin-top: 14px; color: var(--muted); font-size: 13px; }}
    @media (max-width: 880px) {{ .grid {{ grid-template-columns: 1fr; }} }}
  </style>
</head>
<body>
  <div class=\"wrap\">
    <section class=\"hero\">
      <h1>SolarPunk Independent Project Dashboard</h1>
      <p>Single-page status for research, protocol, funding, and monetary-system execution.</p>
      <div class=\"stats\">
        <div class=\"stat\"><div class=\"k\">Readiness Grade</div><div class=\"v\">{escape(grade)}</div></div>
        <div class=\"stat\"><div class=\"k\">Verification</div><div class=\"v\">{escape(status).upper()}</div></div>
        <div class=\"stat\"><div class=\"k\">Warnings</div><div class=\"v\">{warnings}</div></div>
        <div class=\"stat\"><div class=\"k\">Grant Pack Status</div><div class=\"v\">{escape(str(grant.get('readiness_grade', 'N/A')))}</div></div>
        <div class=\"stat\"><div class=\"k\">Monetary Grade</div><div class=\"v\">{escape(monetary_grade)}</div></div>
        <div class=\"stat\"><div class=\"k\">Gate Decision (P{escape(gate_target)})</div><div class=\"v\">{escape(gate_decision)}</div></div>
      </div>
    </section>

    <section class=\"grid\">
      <article class=\"card\">
        <h2>Core Checks</h2>
        <ul>
          {li_pairs({k: badge(bool(v)) for k, v in checks.items()})}
        </ul>
      </article>
      <article class=\"card\">
        <h2>Independent Lanes</h2>
        <ul>
          {li_pairs({k: badge(bool(v)) for k, v in lanes.items()})}
        </ul>
      </article>
      <article class=\"card\">
        <h2>Inventory Snapshot</h2>
        <ul>
          {li_pairs(inventories)}
        </ul>
      </article>
      <article class=\"card\">
        <h2>Execution Profiles</h2>
        <ul>
          {li_pairs(profiles)}
        </ul>
      </article>
      <article class=\"card\">
        <h2>Protocol Gates</h2>
        <ul>
          {li_pairs({k: v.get("status", "N/A") for k, v in phase_gates.get("phases", {}).items()})}
        </ul>
      </article>
      <article class=\"card\">
        <h2>Monetary Checks</h2>
        <ul>
          {li_pairs({k: badge(bool(v)) for k, v in monetary.get("core_protocol_checks", {}).items()})}
        </ul>
      </article>
    </section>

    <section class=\"card cmds\">
      <h2>Operator Commands</h2>
      <code>bash verify_all.sh --contracts-in-docker --json-report=artifacts/verify_health.json</code>
      <code>python3 scripts/build_grant_readiness_pack.py</code>
      <code>python3 scripts/build_project_readiness_pack.py</code>
      <code>python3 scripts/build_monetary_system_readiness.py</code>
      <code>python3 scripts/build_deployment_receipt.py</code>
      <code>python3 scripts/confirm_deployment_onchain.py</code>
      <code>python3 scripts/validate_deployment_receipt.py</code>
      <code>python3 scripts/record_audit_update.py --status IN_PROGRESS</code>
      <code>python3 scripts/render_security_audit_status.py</code>
      <code>python3 scripts/validate_audit_status.py</code>
      <code>python3 scripts/build_protocol_phase_gates.py --target-phase 1</code>
      <code>python3 scripts/build_project_dashboard.py</code>
      <code>bash scripts/run_project_operating_cycle.sh</code>
      <code>bash scripts/run_protocol_gate.sh 1</code>
      <p class=\"foot\">Generated at {escape(generated_at)}</p>
    </section>
  </div>
</body>
</html>
"""


def main() -> int:
    parser = argparse.ArgumentParser(description="Build Solarpunk project dashboard HTML.")
    parser.add_argument("--out", default="docs/project/PROJECT_DASHBOARD.html")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    verify = load_json(root / "artifacts/verify_health.json")
    project = load_json(root / "docs/project/PROJECT_READINESS_PACK.json")
    grant = load_json(root / "docs/grants/GRANT_READINESS_PACK.json")
    monetary = load_json(root / "docs/project/MONETARY_SYSTEM_READINESS.json")
    phase_gates = load_json(root / "docs/project/PROTOCOL_PHASE_GATES.json")

    html = render_dashboard(
        verify=verify,
        project=project,
        grant=grant,
        monetary=monetary,
        phase_gates=phase_gates,
    )
    out = root / args.out
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(f"wrote: {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
