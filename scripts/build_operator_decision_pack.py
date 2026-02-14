#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, List

from build_pilot_termsheet import _build_payload, _load_json, _load_margin_table, _slug


@dataclass(frozen=True)
class ActionItem:
    priority: str
    owner: str
    action: str
    reason: str
    due_in_days: int


def _risk_band(oracle_status: str, budget_fit: str, mtm_per_contract: float) -> str:
    if oracle_status != "OK":
        return "critical"
    if budget_fit == "over_budget":
        return "high"
    if mtm_per_contract < 0:
        return "elevated"
    return "normal"


def _operating_score(*, oracle_status: str, budget_fit: str, mtm_per_contract: float, coverage_gap: float) -> int:
    score = 100
    if oracle_status != "OK":
        score -= 30
    if budget_fit == "over_budget":
        score -= 20
    if mtm_per_contract < 0:
        score -= 12
    if coverage_gap > 0.15:
        score -= 10
    elif coverage_gap > 0.05:
        score -= 4
    return max(0, min(100, score))


def _build_actions(payload: Dict[str, Any]) -> List[ActionItem]:
    out = payload["outputs"]
    inp = payload["inputs"]
    actions: List[ActionItem] = []
    oracle_status = str(out["oracle_status"])
    budget_fit = str(out["risk_budget_fit"])
    mtm = float(out["current_mtm_per_contract_usdc"])
    recommended = int(out["recommended_contracts"])
    contracts = int(out["contracts_evaluated"])

    if oracle_status != "OK":
        actions.append(
            ActionItem(
                priority="P0",
                owner="Risk Ops",
                action="Reconcile oracle feeds and rerun risk pack before any new hedge execution.",
                reason=f"Oracle status is {oracle_status}.",
                due_in_days=0,
            )
        )

    if budget_fit == "over_budget":
        actions.append(
            ActionItem(
                priority="P0",
                owner="Treasury",
                action="Reduce target contracts or increase margin budget before trade approval.",
                reason="Current recommendation breaches declared risk budget.",
                due_in_days=1,
            )
        )

    if mtm < 0:
        actions.append(
            ActionItem(
                priority="P1",
                owner="Risk Committee",
                action="Run downside stress and check additional margin buffer for next settlement window.",
                reason=f"Current mark-to-market per contract is negative ({mtm:.2f} USDC).",
                due_in_days=2,
            )
        )

    if contracts < recommended:
        actions.append(
            ActionItem(
                priority="P1",
                owner="Commercial",
                action="Decide whether to accept lower hedge coverage or add contracts to meet floor target.",
                reason=f"Contracts evaluated ({contracts}) below recommendation ({recommended}).",
                due_in_days=2,
            )
        )

    if contracts > int(recommended * 1.3):
        actions.append(
            ActionItem(
                priority="P1",
                owner="Commercial",
                action="Review over-hedge risk; align coverage with expected generation profile.",
                reason=f"Contracts evaluated ({contracts}) materially above recommendation ({recommended}).",
                due_in_days=2,
            )
        )

    # Baseline recurring tasks: these make the pack operationally sticky.
    actions.append(
        ActionItem(
            priority="P2",
            owner="Data Ops",
            action="Refresh generation forecast and spot index assumptions for weekly re-pricing.",
            reason=f"{inp['region']} profile requires rolling repricing to stay decision-ready.",
            due_in_days=7,
        )
    )
    actions.append(
        ActionItem(
            priority="P2",
            owner="Portfolio Manager",
            action="Issue board-style weekly hedge summary (exposure, margin, scenario deltas).",
            reason="Institutional workflow requires decision trace and audit trail.",
            due_in_days=7,
        )
    )
    return actions


def _to_markdown(pack: Dict[str, Any]) -> str:
    decision = pack["decision"]
    payload = pack["termsheet_snapshot"]
    inputs = payload["inputs"]
    outputs = payload["outputs"]
    scenarios = payload["scenarios"]
    lines: List[str] = []
    lines.append("# Operator Decision Pack")
    lines.append("")
    lines.append(f"- generated_at: `{pack['generated_at']}`")
    lines.append(f"- client: `{inputs['client_name']}`")
    lines.append(f"- region: `{inputs['region']}`")
    lines.append(f"- operating_score: `{decision['operating_score']}/100`")
    lines.append(f"- risk_band: `{decision['risk_band']}`")
    lines.append(f"- immediate_go_no_go: `{decision['immediate_go_no_go']}`")
    lines.append("")
    lines.append("## This Week Decision Snapshot")
    lines.append("")
    lines.append(f"- contracts_recommended: `{outputs['recommended_contracts']}`")
    lines.append(f"- contracts_evaluated: `{outputs['contracts_evaluated']}`")
    lines.append(f"- margin_total_usdc: `{outputs['indicative_total_initial_margin_usdc']}`")
    lines.append(f"- risk_budget_fit: `{outputs['risk_budget_fit']}`")
    lines.append(f"- oracle_status: `{outputs['oracle_status']}`")
    lines.append(f"- mtm_per_contract_usdc: `{outputs['current_mtm_per_contract_usdc']}`")
    lines.append("")
    lines.append("## Scenario Delta")
    lines.append("")
    lines.append(f"- downside_payoff_usdc: `{scenarios['downside_payoff_usdc']}`")
    lines.append(f"- base_payoff_usdc: `{scenarios['base_payoff_usdc']}`")
    lines.append(f"- upside_payoff_usdc: `{scenarios['upside_payoff_usdc']}`")
    lines.append("")
    lines.append("## Prioritized Actions")
    lines.append("")
    for action in pack["actions"]:
        lines.append(
            f"- [{action['priority']}] owner=`{action['owner']}` due_in_days=`{action['due_in_days']}` "
            f"action=`{action['action']}` reason=`{action['reason']}`"
        )
    lines.append("")
    lines.append("## Operating Rule")
    lines.append("")
    lines.append("- Treat this pack as required before any hedge-size change or quote confirmation.")
    lines.append("- If immediate_go_no_go is `NO_GO`, freeze new execution until P0 actions are closed.")
    lines.append("")
    return "\n".join(lines)


def build_pack(client_profile_path: Path, margin_table_path: Path) -> Dict[str, Any]:
    profile = _load_json(client_profile_path)
    margin_rows = _load_margin_table(margin_table_path)
    payload = _build_payload(profile, margin_rows)
    outputs = payload["outputs"]
    inputs = payload["inputs"]
    target = float(outputs["target_hedged_volume_kwh"])
    covered = float(outputs["contracts_evaluated"]) * float(inputs["contract_notional_kwh"])
    coverage_gap = 0.0 if target <= 0 else max(0.0, (target - covered) / target)
    mtm = float(outputs["current_mtm_per_contract_usdc"])
    oracle_status = str(outputs["oracle_status"])
    budget_fit = str(outputs["risk_budget_fit"])
    risk_band = _risk_band(oracle_status, budget_fit, mtm)
    score = _operating_score(
        oracle_status=oracle_status,
        budget_fit=budget_fit,
        mtm_per_contract=mtm,
        coverage_gap=coverage_gap,
    )

    actions = _build_actions(payload)
    immediate_go_no_go = "GO"
    if any(a.priority == "P0" for a in actions):
        immediate_go_no_go = "NO_GO"

    now = datetime.now(timezone.utc)
    pack: Dict[str, Any] = {
        "generated_at": now.isoformat(),
        "next_review_due_at": (now + timedelta(days=7)).isoformat(),
        "decision": {
            "operating_score": score,
            "risk_band": risk_band,
            "immediate_go_no_go": immediate_go_no_go,
            "coverage_gap_ratio": round(coverage_gap, 6),
        },
        "actions": [
            {
                "priority": a.priority,
                "owner": a.owner,
                "action": a.action,
                "reason": a.reason,
                "due_in_days": a.due_in_days,
            }
            for a in actions
        ],
        "termsheet_snapshot": payload,
    }
    return pack


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Build weekly operator decision pack (alerts + actions) from client profile."
    )
    parser.add_argument("--client-profile", default="clients/sample_solar_operator.json")
    parser.add_argument("--out-dir", default="docs/commercial")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    profile_path = root / args.client_profile
    out_dir = root / args.out_dir
    margin_path = root / "empirical/margin_stress_table.csv"

    pack = build_pack(profile_path, margin_path)
    slug = _slug(str(pack["termsheet_snapshot"]["inputs"]["client_name"]))

    out_dir.mkdir(parents=True, exist_ok=True)
    out_json = out_dir / f"DECISION_PACK_{slug}.json"
    out_md = out_dir / f"DECISION_PACK_{slug}.md"

    out_json.write_text(json.dumps(pack, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    out_md.write_text(_to_markdown(pack), encoding="utf-8")

    print(f"wrote: {out_json}")
    print(f"wrote: {out_md}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
