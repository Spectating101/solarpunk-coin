from __future__ import annotations

from spk_v1.health import build_operator_health


def test_build_operator_health_ok():
    runtime = {
        "deployer": "0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54",
        "synced_at": "2026-06-08T17:00:00Z",
        "on_chain": {"total_supply_spk": 100},
        "genesis": {"metrics": {"network_payment_count": 3}},
        "monetary_policy": {"peg_enabled": False},
    }
    report = build_operator_health(runtime, operator_eth=0.5, operator_spk=1000, foundation_status_exists=True)
    assert report["ok"] is True
    assert report["network_payment_count"] == 3
    assert "Ready for npm run foundation:cycle" in report["actions"][0]


def test_build_operator_health_low_gas():
    runtime = {"deployer": "0xabc", "synced_at": "2026-06-08T17:00:00Z"}
    report = build_operator_health(runtime, operator_eth=0.001, min_eth=0.01)
    assert report["ok"] is False
    assert any("Top up Sepolia ETH" in action for action in report["actions"])
