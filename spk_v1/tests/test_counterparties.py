from __future__ import annotations

from spk_v1.counterparties import enrich_payment_ledger, merge_counterparties, resolve_party


def test_merge_counterparties_fills_canonical():
    merged = merge_counterparties({})
    assert "pilot_payer" in merged
    assert merged["merchant"]["role"] == "GOODS"


def test_enrich_payment_ledger_labels():
    ledger = [
        {
            "payment_id": 15,
            "payer": "0xaC39F4a71A69fF24a6aeEA12A24C45396027Aec0",
            "payee": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            "spk": 5,
            "payment_kind": "GOODS",
        }
    ]
    enriched = enrich_payment_ledger(ledger, merge_counterparties({}))
    assert enriched[0]["payer_label"] == "Pilot payer"
    assert enriched[0]["payee_label"] == "Merchant"
    assert enriched[0]["payee_id"] == "merchant"


def test_resolve_party_case_insensitive():
    index = {
        "0x70997970c51812dc3a010c7d01b50e0d17dc79c8": {
            "id": "merchant",
            "label": "Merchant",
            "role": "GOODS",
        }
    }
    party = resolve_party("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", index)
    assert party["id"] == "merchant"
