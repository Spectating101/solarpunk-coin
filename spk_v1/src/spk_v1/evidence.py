from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def export_evidence_markdown(runtime: dict[str, Any], out_path: str | Path) -> Path:
    out = Path(out_path)
    base = runtime.get("explorer_base") or "https://sepolia.etherscan.io"
    lines: list[str] = []

    lines.append("# SPK v1 — Thesis Evidence Pack (Chapter 5)")
    lines.append("")
    lines.append(f"**Generated:** {datetime.now(timezone.utc).isoformat()}")
    lines.append(f"**Status:** {runtime.get('status')}")
    lines.append("**Runtime:** `state/runtime/spk_v1.json`")
    lines.append("")
    lines.append("## Canonical contracts")
    lines.append("")
    lines.append("| Contract | Address |")
    lines.append("|----------|---------|")
    for name, address in (runtime.get("contracts") or {}).items():
        lines.append(f"| {name} | `{address}` |")
    lines.append("")
    lines.append("## Live metrics")
    lines.append("")
    metrics = (runtime.get("genesis") or {}).get("metrics") or {}
    on_chain = runtime.get("on_chain") or {}
    lines.append(f"- Total supply: **{on_chain.get('total_supply_spk', 'n/a')} SPK**")
    lines.append(f"- Settled: **{metrics.get('total_settled_spk', 'n/a')} SPK**")
    lines.append(f"- Network payments: **{metrics.get('network_payment_count', 'n/a')}**")
    lines.append(f"- Circulation share: **{metrics.get('circulation_share_percent', 'n/a')}%**")
    lines.append("")
    lines.append("## Payment ledger (indexed from chain)")
    lines.append("")
    ledger = (runtime.get("chain_index") or {}).get("payment_ledger") or []
    if not ledger:
        lines.append("_Run `spk-v1 sync` to index on-chain events._")
    else:
        lines.append("| # | Kind | SPK | Payee | Payer | Tx |")
        lines.append("|---|------|-----|-------|-------|-----|")
        for row in ledger:
            payee = row.get("payee_label") or f"`{row['payee'][:10]}…`"
            payer = row.get("payer_label") or "—"
            tx = row["tx_hash"]
            lines.append(
                f"| {row['payment_id']} | {row['payment_kind']} | {row['spk']} | "
                f"{payee} | {payer} | [link]({base}/tx/{tx}) |"
            )
    lines.append("")
    lines.append("## Operator cycles")
    lines.append("")
    for op in runtime.get("operations") or []:
        lines.append(f"### {op.get('cycle_id')}")
        lines.append("")
        for step in op.get("steps") or []:
            if not step.get("tx_hash"):
                continue
            extra = ""
            if step.get("spk"):
                extra += f" ({step['spk']} SPK)"
            if step.get("surplus_kwh"):
                extra += f" ({step['surplus_kwh']} kWh)"
            tx = step["tx_hash"]
            lines.append(f"- **{step.get('action')}**{extra}: [{tx[:14]}…]({base}/tx/{tx})")
        lines.append("")
    lines.append("## Reproduce")
    lines.append("")
    lines.append("```bash")
    lines.append("npm run spk:v1:cycle:sepolia")
    lines.append("spk-v1 sync --repo-root .")
    lines.append("spk-v1 export-evidence --repo-root .")
    lines.append("```")

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return out
