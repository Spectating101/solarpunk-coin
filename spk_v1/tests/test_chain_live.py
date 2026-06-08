from __future__ import annotations

import os
from pathlib import Path

import pytest

from spk_v1.runtime import read_runtime
from spk_v1.chain import read_live_snapshot

REPO_ROOT = Path(__file__).resolve().parents[2]


@pytest.mark.integration
def test_read_live_snapshot_matches_runtime_file():
    if os.environ.get("SPK_V1_SKIP_LIVE") == "1":
        pytest.skip("live RPC disabled")
    runtime = read_runtime(REPO_ROOT)
    if not runtime:
        pytest.skip("no runtime file in repo")
    rpc = os.environ.get("SEPOLIA_RPC_URL", "https://ethereum-sepolia-rpc.publicnode.com")
    snapshot = read_live_snapshot(runtime, rpc)
    assert snapshot["on_chain"]["total_supply_spk"] == runtime["on_chain"]["total_supply_spk"]
    assert snapshot["metrics"]["network_payment_count"] == runtime["genesis"]["metrics"]["network_payment_count"]
