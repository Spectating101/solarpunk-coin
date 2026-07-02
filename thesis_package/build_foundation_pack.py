#!/usr/bin/env python3
"""
Build FOUNDATION_EVIDENCE.md — links five constraints to live SPK v1 runtime metrics.
Run from repo root: npm run thesis:foundation
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "state" / "runtime" / "spk_v1.json"
OUT = Path(__file__).resolve().parent / "FOUNDATION_EVIDENCE.md"


def load_runtime() -> dict:
    if not RUNTIME.exists():
        raise SystemExit(f"Missing runtime: {RUNTIME}")
    return json.loads(RUNTIME.read_text())


def implied_usd(spk: float, usd_per_kwh: float) -> float:
    return spk * usd_per_kwh


def main() -> None:
    rt = load_runtime()
    policy = rt.get("monetary_policy") or {}
    on_chain = rt.get("on_chain") or {}
    genesis = rt.get("genesis", {}).get("metrics") or {}
    contracts = rt.get("contracts") or {}

    kwh_per_spk = float(policy.get("kwh_per_spk") or 1)
    ref_usd = float(policy.get("reference_usd_per_kwh") or 0)
    peg = policy.get("peg_enabled", False)
    supply = float(on_chain.get("total_supply_spk") or 0)
    surplus_kwh = float(on_chain.get("cumulative_surplus_kwh") or 0)
    payments = int(genesis.get("network_payment_count") or 0)
    settled = float(genesis.get("total_settled_spk") or 0)
    circ = float(genesis.get("circulation_share_percent") or 0)
    redeemed = float(genesis.get("total_redeemed_spk") or 0)

    implied_supply_usd = implied_usd(supply, ref_usd)
    implied_settled_usd = implied_usd(settled, ref_usd)

    ledger = (rt.get("chain_index") or {}).get("payment_ledger") or []
    latest = ledger[0] if ledger else None

    lines = [
        "# Foundation Evidence (generated)",
        "",
        f"**Generated:** {datetime.now(timezone.utc).isoformat()}",
        f"**Runtime:** `state/runtime/spk_v1.json`",
        f"**Foundation doc:** `MONETARY_FOUNDATION.md`",
        "",
        "## Monetary policy (Horizon A → B)",
        "",
        "| Field | Value |",
        "|-------|-------|",
        f"| Energy anchor | {kwh_per_spk} kWh per SPK |",
        f"| USD translation (reference) | ${ref_usd:.4f} / kWh |",
        f"| Peg enabled (ops) | **{peg}** |",
        f"| Primary use | {policy.get('primary_use', '—')} |",
        f"| Secondary sink | {policy.get('secondary_sink', '—')} |",
        "",
        "## Implied USD expression (reference only; not market peg)",
        "",
        f"- Total supply: **{supply:,.2f} SPK** → ~**${implied_supply_usd:,.2f}** at reference rate",
        f"- Settled in network: **{settled:,.2f} SPK** → ~**${implied_settled_usd:,.2f}**",
        f"- Cumulative surplus minted: **{surplus_kwh:,.0f} kWh**",
        "",
        "> Reference USD/kWh is a **valuation layer** for thesis pricing (Ch 4). It is not a claim that SPK trades at par on markets.",
        "",
        "## Five constraints → live indicators",
        "",
        "| Constraint | Indicator | Observed |",
        "|------------|-----------|----------|",
        f"| Data | cumulative_surplus_kwh | {surplus_kwh:,.0f} kWh |",
        f"| Issuance | total_supply_spk | {supply:,.2f} SPK |",
        f"| Pricing | reference_usd_per_kwh | ${ref_usd:.4f}/kWh |",
        f"| Settlement | network_payment_count | {payments} |",
        f"| Settlement | total_settled_spk | {settled:,.2f} SPK |",
        f"| Governance | peg_enabled | {peg} |",
        f"| Governance | deployer / roles in runtime | see `spk_v1.json` |",
        "",
        "## Circulation vs redemption (use layer)",
        "",
        f"| Metric | Value |",
        f"|--------|-------|",
        f"| Circulation share | {circ:.2f}% |",
        f"| Redeemed SPK | {redeemed:,.2f} |",
        "",
        "## Contracts (Sepolia)",
        "",
        f"| Contract | Address |",
        f"|----------|---------|",
        f"| SolarPunkCoin | `{contracts.get('solar_punk_coin', '—')}` |",
        f"| CurrencySystem | `{contracts.get('currency_system', '—')}` |",
        "",
        f"**Synced at:** {rt.get('synced_at') or rt.get('updated_at') or '—'}",
        "",
    ]

    if latest:
        lines.extend([
            "## Latest indexed payment",
            "",
            f"- Kind: **{latest.get('payment_kind', '—')}**",
            f"- SPK: **{latest.get('spk', '—')}**",
            f"- Payee: `{latest.get('payee', '—')}`",
            f"- Tx: `{latest.get('tx_hash', '—')}`",
            "",
        ])

    lines.extend([
        "## Horizon reminder",
        "",
        "- **Thesis claims:** bounded feasibility + constraint mapping (Horizon A–B).",
        "- **Not claimed:** live USD peg, mainnet, rail displacement (Horizon C).",
        "",
        "Regenerate after sync: `npm run thesis:foundation`",
        "",
    ])

    OUT.write_text("\n".join(lines))
    print(f"foundation_evidence_written={OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
