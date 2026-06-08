from __future__ import annotations

from typing import Any

from web3 import Web3

from spk_v1.abis import load_abi
from spk_v1.kinds import kind_label

WEI = 10**18


def make_web3(rpc_url: str) -> Web3:
    return Web3(Web3.HTTPProvider(rpc_url, request_kwargs={"timeout": 60}))


def connect_web3(rpc_url: str, *, attempts: int = 3) -> Web3:
    last_error: Exception | None = None
    for _ in range(max(1, attempts)):
        w3 = make_web3(rpc_url)
        if w3.is_connected():
            return w3
        last_error = ConnectionError(f"Could not connect to RPC: {rpc_url}")
    raise last_error or ConnectionError(f"Could not connect to RPC: {rpc_url}")


def resolve_deploy_block(runtime: dict[str, Any], rpc_url: str) -> int:
    if runtime.get("deploy_block"):
        return int(runtime["deploy_block"])
    tx_hash = (runtime.get("deploy_transactions") or {}).get("deploy_currency_system")
    if not tx_hash:
        return 0
    w3 = make_web3(rpc_url)
    receipt = w3.eth.get_transaction_receipt(tx_hash)
    return int(receipt["blockNumber"]) if receipt else 0


def _ether(value: int) -> float:
    return float(value) / WEI


def _tx_hex(value: Any) -> str:
    return value if isinstance(value, str) else Web3.to_hex(value)


def _metrics_tuple(metrics: Any) -> dict[str, float | int]:
    if isinstance(metrics, (list, tuple)) and len(metrics) == 1:
        metrics = metrics[0]
    if hasattr(metrics, "settledSpk"):
        settled = int(metrics.settledSpk)
        redeemed = int(metrics.redeemedSpk)
        circulation_bps = int(metrics.circulationShareBps)
        redemption_bps = int(metrics.redemptionShareBps)
        payment_count = int(metrics.networkPaymentCount)
    else:
        settled, redeemed, circulation_bps, redemption_bps, payment_count, _rc = metrics
        settled = int(settled)
        redeemed = int(redeemed)
        payment_count = int(payment_count)
        circulation_bps = int(circulation_bps)
        redemption_bps = int(redemption_bps)
    return {
        "total_settled_spk": _ether(settled),
        "total_redeemed_spk": _ether(redeemed),
        "circulation_share_percent": circulation_bps / 100,
        "redemption_share_percent": redemption_bps / 100,
        "network_payment_count": payment_count,
    }


def index_currency_events(w3: Web3, currency, spk, from_block: int = 0) -> dict[str, Any]:
    currency_address = currency.address
    spk_address = spk.address
    start = max(0, int(from_block))

    network_payments = currency.events.NetworkPaymentSettled.get_logs(from_block=start)
    invoice_payments = currency.events.InvoiceSettled.get_logs(from_block=start)
    redemptions_opened = currency.events.RedemptionOpened.get_logs(from_block=start)
    redemptions_resolved = currency.events.RedemptionResolved.get_logs(from_block=start)

    payment_ledger: list[dict[str, Any]] = []
    for event in network_payments:
        args = event["args"]
        payment_ledger.append({
            "type": "network_payment",
            "payment_id": int(args["paymentId"]),
            "payer": args["payer"],
            "payee": args["payee"],
            "spk": _ether(int(args["spkAmount"])),
            "payment_kind": kind_label(args.get("paymentKind")),
            "invoice_hash": Web3.to_hex(args["invoiceHash"]),
            "block_number": int(event["blockNumber"]),
            "tx_hash": _tx_hex(event["transactionHash"]),
        })

    for event in invoice_payments:
        args = event["args"]
        tx_hash = _tx_hex(event["transactionHash"])
        payment_id = int(args["paymentId"])
        if any(row["payment_id"] == payment_id and row["tx_hash"] == tx_hash for row in payment_ledger):
            continue
        payment_ledger.append({
            "type": "invoice",
            "payment_id": payment_id,
            "payer": args["payer"],
            "payee": args["payee"],
            "spk": _ether(int(args["spkAmount"])),
            "payment_kind": "INVOICE",
            "invoice_hash": Web3.to_hex(args["invoiceHash"]),
            "block_number": int(event["blockNumber"]),
            "tx_hash": tx_hash,
        })

    payment_ledger.sort(key=lambda row: row["payment_id"])

    resolved_by_id = {int(event["args"]["redemptionId"]): event for event in redemptions_resolved}
    redemption_ledger = []
    for event in redemptions_opened:
        args = event["args"]
        rid = int(args["redemptionId"])
        resolved = resolved_by_id.get(rid)
        resolved_hash = None
        if resolved is not None:
            resolved_hash = _tx_hex(resolved["transactionHash"])
        redemption_ledger.append({
            "redemption_id": rid,
            "redeemer": args["redeemer"],
            "beneficiary": args["beneficiary"],
            "spk": _ether(int(args["spkAmount"])),
            "owed_kwh": _ether(int(args["owedKwhWad"])),
            "source_hash": Web3.to_hex(args["sourceHash"]),
            "block_number": int(event["blockNumber"]),
            "tx_hash": _tx_hex(event["transactionHash"]),
            "resolved_tx_hash": resolved_hash,
        })

    by_kind: dict[str, float] = {}
    for row in payment_ledger:
        by_kind[row["payment_kind"]] = by_kind.get(row["payment_kind"], 0) + row["spk"]

    return {
        "currency_address": currency_address,
        "spk_address": spk_address,
        "indexed_from_block": start,
        "payment_ledger": payment_ledger,
        "redemption_ledger": redemption_ledger,
        "settled_by_kind_spk": by_kind,
        "payment_count": len(payment_ledger),
        "redemption_count": len(redemption_ledger),
    }


def read_counterparty_balances(spk, counterparties: dict[str, Any]) -> dict[str, float]:
    balances: dict[str, float] = {}
    for name, info in (counterparties or {}).items():
        balances[name] = _ether(int(spk.functions.balanceOf(info["address"]).call()))
    return balances


def read_live_snapshot(runtime: dict[str, Any], rpc_url: str) -> dict[str, Any]:
    w3 = connect_web3(rpc_url)

    spk = w3.eth.contract(
        address=Web3.to_checksum_address(runtime["contracts"]["solar_punk_coin"]),
        abi=load_abi("SolarPunkCoin"),
    )
    currency = w3.eth.contract(
        address=Web3.to_checksum_address(runtime["contracts"]["currency_system"]),
        abi=load_abi("SolarPunkCurrencySystem"),
    )
    deployer = runtime["deployer"]
    from_block = int(runtime.get("deploy_block") or 0)

    metrics_raw = currency.functions.networkMetrics().call()
    index = index_currency_events(w3, currency, spk, from_block)
    counterparties = runtime.get("counterparties") or {}

    return {
        "on_chain": {
            "deployer_spk_balance": _ether(int(spk.functions.balanceOf(deployer).call())),
            "total_supply_spk": _ether(int(spk.functions.totalSupply().call())),
            "cumulative_surplus_kwh": int(spk.functions.cumulativeSurplusKwh().call()),
            "issuance_mode": int(spk.functions.issuanceMode().call()),
            "peg_enabled": bool(spk.functions.pegEnabled().call()),
            "kwh_per_spk": str(_ether(int(spk.functions.kwhPerSpkWad().call()))),
        },
        "metrics": _metrics_tuple(metrics_raw),
        "counterparty_balances_spk": read_counterparty_balances(spk, counterparties),
        "chain_index": index,
    }
