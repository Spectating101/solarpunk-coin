from __future__ import annotations

from spk_v1.evidence import export_evidence_markdown


def test_export_evidence_writes_markdown(tmp_path):
    runtime = {
        "status": "operating",
        "explorer_base": "https://sepolia.etherscan.io",
        "contracts": {"solar_punk_coin": "0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128"},
        "on_chain": {"total_supply_spk": 5404.01},
        "genesis": {"metrics": {"total_settled_spk": 383, "network_payment_count": 14, "circulation_share_percent": 97.45}},
        "chain_index": {
            "payment_ledger": [
                {
                    "payment_id": 1,
                    "payment_kind": "SERVICE",
                    "spk": 12,
                    "payee": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
                    "tx_hash": "0xabc",
                }
            ]
        },
    }
    out = export_evidence_markdown(runtime, tmp_path / "SPK_V1_EVIDENCE.md")
    text = out.read_text(encoding="utf-8")
    assert "5404.01" in text
    assert "SERVICE" in text
    assert "spk-v1 sync" in text
