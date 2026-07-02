"""Monetary foundation snapshot and status export (product layer, not thesis)."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def foundation_paths(repo_root: Path) -> dict[str, Path]:
    root = Path(repo_root)
    return {
        "status_md": root / "docs" / "foundation" / "FOUNDATION_STATUS.md",
        "status_json": root / "state" / "foundation" / "status.json",
    }


def _load_peg_simulation(repo_root: Path) -> dict[str, Any] | None:
    path = Path(repo_root) / "state" / "foundation" / "peg_simulation_summary.json"
    if not path.exists():
        return None
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None
    if not isinstance(data, dict):
        return None
    return {
        "ok": bool(data.get("ok")),
        "pct_in_band": data.get("pct_in_band"),
        "max_deviation_bps": data.get("max_deviation_bps"),
        "note": "Off-chain PI simulation only — peg disabled on Sepolia.",
    }


def build_foundation_snapshot(runtime: dict[str, Any], *, repo_root: Path | None = None) -> dict[str, Any]:
    policy = runtime.get("monetary_policy") or {}
    on_chain = runtime.get("on_chain") or {}
    metrics = (runtime.get("genesis") or {}).get("metrics") or {}
    contracts = runtime.get("contracts") or {}

    kwh_per_spk = float(policy.get("kwh_per_spk") or 1)
    ref_usd = float(policy.get("reference_usd_per_kwh") or 0)
    supply = float(on_chain.get("total_supply_spk") or 0)
    settled = float(metrics.get("total_settled_spk") or 0)

    ledger = (runtime.get("chain_index") or {}).get("payment_ledger") or []
    latest = max(ledger, key=lambda row: int(row.get("payment_id") or 0), default=None)
    counterparties = runtime.get("counterparties") or {}
    counterparty_balances = runtime.get("counterparty_balances_spk") or {}
    peg_sim = _load_peg_simulation(repo_root) if repo_root else None

    snapshot = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "horizon": "structural",
        "network": runtime.get("network"),
        "chain_id": runtime.get("chain_id"),
        "status": runtime.get("status"),
        "synced_at": runtime.get("synced_at") or runtime.get("updated_at"),
        "anchor": {
            "kwh_per_spk": kwh_per_spk,
            "cumulative_surplus_kwh": float(on_chain.get("cumulative_surplus_kwh") or 0),
        },
        "usd_translation": {
            "reference_usd_per_kwh": ref_usd,
            "implied_supply_usd": supply * ref_usd,
            "implied_settled_usd": settled * ref_usd,
            "note": "Reference valuation layer — not a live market peg.",
        },
        "peg": {
            "enabled": bool(policy.get("peg_enabled")),
            "primary_use": policy.get("primary_use"),
            "secondary_sink": policy.get("secondary_sink"),
        },
        "circulation": {
            "total_supply_spk": supply,
            "total_settled_spk": settled,
            "total_redeemed_spk": float(metrics.get("total_redeemed_spk") or 0),
            "circulation_share_percent": float(metrics.get("circulation_share_percent") or 0),
            "network_payment_count": int(metrics.get("network_payment_count") or 0),
        },
        "constraints": {
            "data": {"cumulative_surplus_kwh": float(on_chain.get("cumulative_surplus_kwh") or 0)},
            "issuance": {"total_supply_spk": supply},
            "pricing": {"reference_usd_per_kwh": ref_usd},
            "settlement": {
                "network_payment_count": int(metrics.get("network_payment_count") or 0),
                "total_settled_spk": settled,
            },
            "governance": {"peg_enabled": bool(policy.get("peg_enabled"))},
        },
        "contracts": contracts,
        "counterparties": counterparties,
        "counterparty_balances_spk": counterparty_balances,
        "operator": {
            "deployer": runtime.get("deployer"),
            "governance_admin": runtime.get("governance_admin"),
        },
        "latest_payment": latest,
    }
    if peg_sim:
        snapshot["peg_simulation"] = peg_sim
    return snapshot


def render_foundation_markdown(snapshot: dict[str, Any]) -> str:
    peg = snapshot["peg"]
    usd = snapshot["usd_translation"]
    circ = snapshot["circulation"]
    anchor = snapshot["anchor"]
    contracts = snapshot.get("contracts") or {}
    latest = snapshot.get("latest_payment")

    lines = [
        "# Foundation Status",
        "",
        f"**Generated:** {snapshot['generated_at']}",
        f"**Synced:** {snapshot.get('synced_at') or '—'}",
        "",
        "## Monetary stack",
        "",
        "| Layer | Value |",
        "|-------|-------|",
        f"| Energy anchor | {anchor['kwh_per_spk']} kWh / SPK |",
        f"| Surplus minted | {anchor['cumulative_surplus_kwh']:,.0f} kWh |",
        f"| USD reference | ${usd['reference_usd_per_kwh']:.4f} / kWh |",
        f"| Implied supply (ref) | ~${usd['implied_supply_usd']:,.2f} |",
        f"| Peg enabled | **{peg['enabled']}** |",
        f"| Primary use | {peg.get('primary_use') or '—'} |",
        "",
        "## Circulation",
        "",
        f"| Metric | Value |",
        f"|--------|-------|",
        f"| Supply | {circ['total_supply_spk']:,.2f} SPK |",
        f"| Settled | {circ['total_settled_spk']:,.2f} SPK (~${usd['implied_settled_usd']:,.2f} ref) |",
        f"| Payments | {circ['network_payment_count']} |",
        f"| Circulation share | {circ['circulation_share_percent']:.2f}% |",
        f"| Redeemed | {circ['total_redeemed_spk']:,.2f} SPK |",
        "",
        "## Contracts",
        "",
        f"- SPK: `{contracts.get('solar_punk_coin', '—')}`",
        f"- Currency: `{contracts.get('currency_system', '—')}`",
        "",
    ]

    if latest:
        lines.extend([
            "## Latest payment",
            "",
            f"- Kind: **{latest.get('payment_kind', '—')}**",
            f"- SPK: **{latest.get('spk', '—')}**",
            f"- Tx: `{latest.get('tx_hash', '—')}`",
            "",
        ])

    peg_sim = snapshot.get("peg_simulation")
    if peg_sim:
        lines.extend([
            "## Peg simulation (off-chain)",
            "",
            f"| Signal | Value |",
            f"|--------|-------|",
            f"| Simulation OK | **{peg_sim.get('ok')}** |",
            f"| Days in ±5% band | {peg_sim.get('pct_in_band') or '—'} |",
            f"| Max deviation | {peg_sim.get('max_deviation_bps') or '—'} |",
            "",
            f"> {peg_sim.get('note', '')}",
            "",
        ])

    lines.extend([
        "> USD figures use `reference_usd_per_kwh` only. See `docs/foundation/MONETARY_FOUNDATION.md`.",
        "",
        "Regenerate: `npm run foundation:build`",
        "",
    ])
    return "\n".join(lines)


def export_foundation_status(runtime: dict[str, Any], repo_root: Path) -> dict[str, Any]:
    root = Path(repo_root)
    paths = foundation_paths(root)
    snapshot = build_foundation_snapshot(runtime, repo_root=root)
    paths["status_json"].parent.mkdir(parents=True, exist_ok=True)
    paths["status_md"].parent.mkdir(parents=True, exist_ok=True)
    paths["status_json"].write_text(json.dumps(snapshot, indent=2) + "\n", encoding="utf-8")
    paths["status_md"].write_text(render_foundation_markdown(snapshot), encoding="utf-8")
    return {
        "ok": True,
        "snapshot": snapshot,
        "status_md": str(paths["status_md"]),
        "status_json": str(paths["status_json"]),
    }
