from __future__ import annotations

import json
from pathlib import Path

from spk_v1.runtime import merge_runtime, read_runtime, runtime_paths, write_runtime


def test_runtime_roundtrip(tmp_path: Path):
    repo = tmp_path / "repo"
    payload = {"schema": "SPK_V1_RUNTIME", "status": "operating", "contracts": {"solar_punk_coin": "0xabc"}}
    write_runtime(payload, repo)
    paths = runtime_paths(repo)
    assert paths["runtime"].exists()
    assert paths["public"].exists()
    assert read_runtime(repo)["status"] == "operating"
    merge_runtime({"synced_at": "2026-01-01T00:00:00Z"}, repo)
    merged = read_runtime(repo)
    assert merged["synced_at"] == "2026-01-01T00:00:00Z"
    assert json.loads(paths["public"].read_text())["synced_at"] == "2026-01-01T00:00:00Z"
