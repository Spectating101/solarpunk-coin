from __future__ import annotations

from web3 import Web3

ZERO_HASH = "0x" + "0" * 64

KIND_LABELS: dict[str, str] = {
    Web3.keccak(text=label).to_0x_hex(): label
    for label in ("SERVICE", "LABOR", "GOODS", "NETWORK")
}


def kind_label(payment_kind: str | bytes | None) -> str:
    if payment_kind is None:
        return "INVOICE"
    hex_val = payment_kind.lower() if isinstance(payment_kind, str) else Web3.to_hex(payment_kind).lower()
    if hex_val == ZERO_HASH:
        return "INVOICE"
    return KIND_LABELS.get(hex_val, hex_val)
