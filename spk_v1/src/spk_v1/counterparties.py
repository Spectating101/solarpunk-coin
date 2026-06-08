"""Canonical counterparty registry and payment-ledger labeling."""

from __future__ import annotations

from typing import Any

from web3 import Web3

# Keep in sync with scripts/lib/spk_v1_counterparties.js
CANONICAL_COUNTERPARTIES: dict[str, dict[str, str]] = {
    "gateway": {
        "address": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        "role": "SERVICE",
        "label": "Gateway",
    },
    "maintenance": {
        "address": "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        "role": "LABOR",
        "label": "Maintenance",
    },
    "merchant": {
        "address": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "role": "GOODS",
        "label": "Merchant",
    },
    "network_peer": {
        "address": "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
        "role": "NETWORK",
        "label": "Network peer",
    },
    "pilot_payer": {
        "address": "0xaC39F4a71A69fF24a6aeEA12A24C45396027Aec0",
        "role": "PAYER",
        "label": "Pilot payer",
    },
    "operator": {
        "address": "0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54",
        "role": "OPERATOR",
        "label": "Operator",
    },
}


def _norm(addr: str) -> str:
    return Web3.to_checksum_address(addr).lower()


def address_index(counterparties: dict[str, Any] | None = None) -> dict[str, dict[str, str]]:
    """Map lowercase address → {id, label, role}."""
    merged = merge_counterparties(counterparties)
    out: dict[str, dict[str, str]] = {}
    for cid, info in merged.items():
        addr = info.get("address")
        if not addr:
            continue
        out[_norm(addr)] = {
            "id": cid,
            "label": str(info.get("label") or cid.replace("_", " ").title()),
            "role": str(info.get("role") or ""),
        }
    return out


def merge_counterparties(runtime_counterparties: dict[str, Any] | None = None) -> dict[str, dict[str, str]]:
    """Runtime entries override canonical; canonical fills gaps."""
    merged: dict[str, dict[str, str]] = {}
    for cid, info in CANONICAL_COUNTERPARTIES.items():
        merged[cid] = {**info}
    for cid, info in (runtime_counterparties or {}).items():
        merged[cid] = {**merged.get(cid, {}), **info}
    return merged


def resolve_party(address: str | None, index: dict[str, dict[str, str]]) -> dict[str, str] | None:
    if not address:
        return None
    return index.get(_norm(address))


def enrich_payment_ledger(
    ledger: list[dict[str, Any]],
    counterparties: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    index = address_index(counterparties)
    enriched: list[dict[str, Any]] = []
    for row in ledger:
        patch = dict(row)
        payer = resolve_party(str(row.get("payer") or ""), index)
        payee = resolve_party(str(row.get("payee") or ""), index)
        if payer:
            patch["payer_id"] = payer["id"]
            patch["payer_label"] = payer["label"]
        if payee:
            patch["payee_id"] = payee["id"]
            patch["payee_label"] = payee["label"]
        enriched.append(patch)
    return enriched
