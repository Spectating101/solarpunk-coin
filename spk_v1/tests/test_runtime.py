from __future__ import annotations

import json
from pathlib import Path

import pytest

from spk_v1.runtime import merge_runtime, read_runtime, runtime_paths, write_runtime


def test_runtime_roundtrip(tmp_path: Path):
    repo = tmp_path / "repo"
    payload = {
        "schema": "SPK_V1_RUNTIME",
        "status": "operating",
        "contracts": {"solar_punk_coin": "0xabc"},
    }
    write_runtime(payload, repo)
    paths = runtime_paths(repo)
    assert paths["runtime"].exists()
    assert paths["public"].exists()
    assert read_runtime(repo)["status"] == "operating"
    merge_runtime({"synced_at": "2026-01-01T00:00:00Z"}, repo)
    merged = read_runtime(repo)
    assert merged["synced_at"] == "2026-01-01T00:00:00Z"
    assert json.loads(paths["public"].read_text())["synced_at"] == "2026-01-01T00:00:00Z"


def test_failed_atomic_write_preserves_previous_file_and_cleans_temporary(tmp_path):
    from spk_v1.storage import atomic_output

    target = tmp_path / "runtime.json"
    target.write_text('{"previous": true}')
    with pytest.raises(RuntimeError):
        with atomic_output(target) as output:
            output.write(b'{"incomplete":')
            raise RuntimeError("interrupted generation")
    assert json.loads(target.read_text()) == {"previous": True}
    assert list(tmp_path.iterdir()) == [target]


def test_nonfinite_runtime_never_replaces_existing_snapshots(tmp_path):
    write_runtime({"valid": True}, tmp_path)
    with pytest.raises(ValueError):
        write_runtime({"amount": float("nan")}, tmp_path)
    assert read_runtime(tmp_path) == {"valid": True}
    assert json.loads(runtime_paths(tmp_path)["public"].read_text()) == {"valid": True}


def test_runtime_readers_only_see_complete_snapshots(tmp_path):
    from concurrent.futures import ThreadPoolExecutor

    payload = {"rows": list(range(10000)), "revision": 0}
    write_runtime(payload, tmp_path)

    def publish():
        for revision in range(1, 11):
            write_runtime({**payload, "revision": revision}, tmp_path)

    with ThreadPoolExecutor(1) as writer:
        future = writer.submit(publish)
        for _ in range(100):
            assert read_runtime(tmp_path)["rows"] == payload["rows"]
        future.result(timeout=10)
    assert read_runtime(tmp_path)["revision"] == 10


def test_sync_uses_operator_configured_rpc(tmp_path, monkeypatch):
    import spk_v1.runtime as runtime_module

    write_runtime({"contracts": {"solar_punk_coin": "0xabc"}}, tmp_path)
    monkeypatch.setenv("SEPOLIA_RPC", "https://configured.example")
    monkeypatch.setenv("SEPOLIA_RPC_URL", "https://secondary.example")
    seen = []
    monkeypatch.setattr(
        runtime_module, "resolve_deploy_block", lambda runtime, rpc: seen.append(rpc) or 1
    )
    monkeypatch.setattr(
        runtime_module,
        "read_live_snapshot",
        lambda runtime, rpc: {
            "chain_index": {},
            "on_chain": {},
            "counterparty_balances_spk": {},
            "metrics": {},
        },
    )
    runtime_module.sync_runtime(tmp_path)
    runtime_module.sync_runtime(tmp_path, rpc_url="https://explicit.example")
    assert seen == ["https://configured.example", "https://explicit.example"]
