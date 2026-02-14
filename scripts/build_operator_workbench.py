#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import datetime, timedelta, timezone
from html import escape
from pathlib import Path
from typing import Any, Dict, List

from build_operator_decision_pack import build_pack
from build_pilot_termsheet import _build_payload, _load_json, _load_margin_table, _slug


def _safe_float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except Exception:
        return default


def _safe_int(value: Any, default: int = 0) -> int:
    try:
        return int(value)
    except Exception:
        return default


def _build_assignments(pack: Dict[str, Any], profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    generated = datetime.fromisoformat(pack["generated_at"])
    out: List[Dict[str, Any]] = []
    for idx, action in enumerate(pack.get("actions", []), start=1):
        due_days = _safe_int(action.get("due_in_days", 0))
        due_at = generated + timedelta(days=due_days)
        out.append(
            {
                "id": f"T{idx:02d}",
                "priority": str(action.get("priority", "P2")),
                "owner": str(action.get("owner", "Ops")),
                "task": str(action.get("action", "Review operator action.")),
                "reason": str(action.get("reason", "No reason provided.")),
                "due_at": due_at.isoformat(),
                "status": "open",
                "client": str(profile.get("client_name", "Unknown Client")),
            }
        )
    return out


def _build_workbench(profile_path: Path, margin_path: Path) -> Dict[str, Any]:
    profile = _load_json(profile_path)
    margin_rows = _load_margin_table(margin_path)
    termsheet = _build_payload(profile, margin_rows)
    decision_pack = build_pack(profile_path, margin_path)

    inputs = termsheet["inputs"]
    outputs = termsheet["outputs"]
    decision = decision_pack["decision"]
    scenarios = termsheet["scenarios"]

    annual_generation = _safe_float(inputs.get("expected_generation_kwh", 0.0))
    spot = _safe_float(outputs.get("aggregated_spot_index_usd_per_kwh", 0.0))
    strike = _safe_float(inputs.get("strike_usd_per_kwh", 0.0))
    coverage_target = _safe_float(inputs.get("coverage_target", 0.0))
    protected_volume = annual_generation * coverage_target
    gross_revenue_estimate = annual_generation * spot
    floor_revenue_estimate = protected_volume * strike
    hedge_cost = _safe_float(outputs.get("indicative_total_initial_margin_usdc", 0.0))
    hedge_burden_pct = 0.0 if gross_revenue_estimate <= 0 else (hedge_cost / gross_revenue_estimate) * 100.0

    assignments = _build_assignments(decision_pack, profile)
    immediate = str(decision.get("immediate_go_no_go", "NO_GO"))
    operating_score = _safe_int(decision.get("operating_score", 0))
    risk_band = str(decision.get("risk_band", "high"))

    confidence = "low"
    if immediate == "GO" and operating_score >= 85 and risk_band == "normal":
        confidence = "high"
    elif immediate == "GO" and operating_score >= 70:
        confidence = "medium"

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "tool": "solarpunk-operator-workbench",
        "profile_path": str(profile_path),
        "decision": decision,
        "business_snapshot": {
            "client_name": str(inputs.get("client_name", "Unknown Client")),
            "region": str(inputs.get("region", "unknown")),
            "annual_generation_kwh": round(annual_generation, 2),
            "gross_revenue_estimate_usd": round(gross_revenue_estimate, 2),
            "floor_revenue_estimate_usd": round(floor_revenue_estimate, 2),
            "initial_margin_estimate_usdc": round(hedge_cost, 2),
            "hedge_burden_pct_of_revenue": round(hedge_burden_pct, 2),
            "recommended_contracts": _safe_int(outputs.get("recommended_contracts", 0)),
            "contracts_evaluated": _safe_int(outputs.get("contracts_evaluated", 0)),
            "risk_budget_fit": str(outputs.get("risk_budget_fit", "over_budget")),
            "confidence": confidence,
        },
        "scenario_snapshot": scenarios,
        "assignments": assignments,
        "termsheet": termsheet,
        "decision_pack": decision_pack,
    }


def _to_markdown(payload: Dict[str, Any]) -> str:
    biz = payload["business_snapshot"]
    dec = payload["decision"]
    lines: List[str] = []
    lines.append("# Operator Workbench")
    lines.append("")
    lines.append(f"- generated_at: `{payload['generated_at']}`")
    lines.append(f"- client: `{biz['client_name']}`")
    lines.append(f"- region: `{biz['region']}`")
    lines.append(f"- immediate_go_no_go: `{dec['immediate_go_no_go']}`")
    lines.append(f"- operating_score: `{dec['operating_score']}/100`")
    lines.append(f"- risk_band: `{dec['risk_band']}`")
    lines.append(f"- confidence: `{biz['confidence']}`")
    lines.append("")
    lines.append("## Business Snapshot")
    lines.append("")
    lines.append(f"- annual_generation_kwh: `{biz['annual_generation_kwh']}`")
    lines.append(f"- gross_revenue_estimate_usd: `{biz['gross_revenue_estimate_usd']}`")
    lines.append(f"- floor_revenue_estimate_usd: `{biz['floor_revenue_estimate_usd']}`")
    lines.append(f"- initial_margin_estimate_usdc: `{biz['initial_margin_estimate_usdc']}`")
    lines.append(f"- hedge_burden_pct_of_revenue: `{biz['hedge_burden_pct_of_revenue']}`")
    lines.append(f"- contracts (recommended/evaluated): `{biz['recommended_contracts']}/{biz['contracts_evaluated']}`")
    lines.append(f"- risk_budget_fit: `{biz['risk_budget_fit']}`")
    lines.append("")
    lines.append("## Assignments")
    lines.append("")
    for task in payload.get("assignments", []):
        lines.append(
            f"- [{task['priority']}] `{task['id']}` owner=`{task['owner']}` due=`{task['due_at']}` "
            f"task=`{task['task']}` reason=`{task['reason']}`"
        )
    lines.append("")
    lines.append("## Rule")
    lines.append("")
    lines.append("- If `immediate_go_no_go` is `NO_GO`, close all P0 tasks before approving any new hedge move.")
    lines.append("")
    return "\n".join(lines)


def _to_html(payload: Dict[str, Any]) -> str:
    biz = payload["business_snapshot"]
    dec = payload["decision"]
    actions = payload.get("assignments", [])
    action_rows = "".join(
        (
            "<tr>"
            f"<td>{escape(task['id'])}</td>"
            f"<td>{escape(task['priority'])}</td>"
            f"<td>{escape(task['owner'])}</td>"
            f"<td>{escape(task['task'])}</td>"
            f"<td>{escape(task['due_at'])}</td>"
            "</tr>"
        )
        for task in actions
    )
    if not action_rows:
        action_rows = "<tr><td colspan='5'>No open assignments.</td></tr>"

    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SolarPunk Operator Workbench</title>
  <style>
    :root {{
      --bg: #f4f9f3;
      --panel: #ffffff;
      --ink: #122019;
      --muted: #4d6558;
      --line: #d6e4da;
      --good: #1d7a39;
      --warn: #a06000;
      --bad: #b32525;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      color: var(--ink);
      background: linear-gradient(135deg, #ecf5ef 0%, var(--bg) 45%);
      font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    }}
    .wrap {{ max-width: 1100px; margin: 0 auto; padding: 24px; }}
    .hero {{
      background: linear-gradient(135deg, #175040, #2b785f);
      color: #f5fff9;
      border-radius: 14px;
      padding: 22px;
    }}
    .hero h1 {{ margin: 0 0 6px; font-size: 30px; }}
    .hero p {{ margin: 0; opacity: 0.9; }}
    .grid {{
      margin-top: 14px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
    }}
    .tile {{
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 10px;
      padding: 10px;
    }}
    .tile .k {{ font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; opacity: 0.85; }}
    .tile .v {{ font-size: 22px; font-weight: 700; margin-top: 2px; }}
    .cards {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 14px;
    }}
    .card {{
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 14px;
    }}
    h2 {{ margin: 0 0 8px; font-size: 18px; }}
    ul {{ list-style: none; padding: 0; margin: 0; display: grid; gap: 7px; }}
    li {{ display: flex; justify-content: space-between; gap: 8px; border-bottom: 1px dashed var(--line); padding-bottom: 5px; }}
    li span {{ color: var(--muted); }}
    .pill {{
      display: inline-block;
      border-radius: 999px;
      padding: 4px 10px;
      font-weight: 700;
      font-size: 12px;
      color: white;
    }}
    .go {{ background: var(--good); }}
    .warn {{ background: var(--warn); }}
    .nogo {{ background: var(--bad); }}
    table {{
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 14px;
    }}
    th, td {{
      border-bottom: 1px solid var(--line);
      text-align: left;
      padding: 8px 6px;
      vertical-align: top;
    }}
    th {{ color: var(--muted); font-size: 12px; letter-spacing: 0.04em; text-transform: uppercase; }}
    .foot {{ margin-top: 10px; color: var(--muted); font-size: 12px; }}
    @media (max-width: 900px) {{
      .cards {{ grid-template-columns: 1fr; }}
      .hero h1 {{ font-size: 24px; }}
    }}
  </style>
</head>
<body>
  <div class="wrap">
    <section class="hero">
      <h1>Operator Workbench</h1>
      <p>{escape(str(biz['client_name']))} - {escape(str(biz['region']))}</p>
      <div class="grid">
        <div class="tile"><div class="k">Go/No-Go</div><div class="v">{escape(str(dec['immediate_go_no_go']))}</div></div>
        <div class="tile"><div class="k">Operating Score</div><div class="v">{escape(str(dec['operating_score']))}</div></div>
        <div class="tile"><div class="k">Risk Band</div><div class="v">{escape(str(dec['risk_band']))}</div></div>
        <div class="tile"><div class="k">Confidence</div><div class="v">{escape(str(biz['confidence']))}</div></div>
      </div>
    </section>

    <section class="cards">
      <article class="card">
        <h2>Business Snapshot</h2>
        <ul>
          <li><span>Annual Generation (kWh)</span><strong>{escape(str(biz['annual_generation_kwh']))}</strong></li>
          <li><span>Gross Revenue Estimate (USD)</span><strong>{escape(str(biz['gross_revenue_estimate_usd']))}</strong></li>
          <li><span>Floor Revenue Estimate (USD)</span><strong>{escape(str(biz['floor_revenue_estimate_usd']))}</strong></li>
          <li><span>Initial Margin Estimate (USDC)</span><strong>{escape(str(biz['initial_margin_estimate_usdc']))}</strong></li>
          <li><span>Hedge Burden (% Revenue)</span><strong>{escape(str(biz['hedge_burden_pct_of_revenue']))}</strong></li>
          <li><span>Budget Fit</span><strong>{escape(str(biz['risk_budget_fit']))}</strong></li>
          <li><span>Contracts (Rec/Eval)</span><strong>{escape(str(biz['recommended_contracts']))}/{escape(str(biz['contracts_evaluated']))}</strong></li>
        </ul>
      </article>

      <article class="card">
        <h2>Execution Rule</h2>
        <p>
          <span class="pill {'go' if dec['immediate_go_no_go'] == 'GO' else 'nogo'}">{escape(str(dec['immediate_go_no_go']))}</span>
          {'Proceed with hedge execution under current limits.' if dec['immediate_go_no_go'] == 'GO' else 'Freeze new hedge changes until all P0 tasks are closed.'}
        </p>
        <p>
          <span class="pill {'warn' if dec['risk_band'] != 'normal' else 'go'}">{escape(str(dec['risk_band']))}</span>
          Risk posture should be reviewed at least weekly.
        </p>
      </article>
    </section>

    <section class="card">
      <h2>Assignments</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Priority</th>
            <th>Owner</th>
            <th>Task</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody>
          {action_rows}
        </tbody>
      </table>
      <p class="foot">Generated at {escape(str(payload['generated_at']))}</p>
    </section>
  </div>
</body>
</html>"""


def main() -> int:
    parser = argparse.ArgumentParser(description="Build independent operator workbench artifacts.")
    parser.add_argument("--client-profile", default="clients/sample_solar_operator.json")
    parser.add_argument("--out-dir", default="docs/commercial")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    profile_path = root / args.client_profile
    out_dir = root / args.out_dir
    margin_path = root / "empirical/margin_stress_table.csv"

    payload = _build_workbench(profile_path, margin_path)
    client_name = str(payload["business_snapshot"]["client_name"])
    slug = _slug(client_name)

    out_dir.mkdir(parents=True, exist_ok=True)
    out_json = out_dir / f"OPERATOR_WORKBENCH_{slug}.json"
    out_md = out_dir / f"OPERATOR_WORKBENCH_{slug}.md"
    out_html = out_dir / f"OPERATOR_WORKBENCH_{slug}.html"

    out_json.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    out_md.write_text(_to_markdown(payload), encoding="utf-8")
    out_html.write_text(_to_html(payload), encoding="utf-8")

    print(f"wrote: {out_json}")
    print(f"wrote: {out_md}")
    print(f"wrote: {out_html}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
