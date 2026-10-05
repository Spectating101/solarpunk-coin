import hashlib
import multiprocessing
import sqlite3
from concurrent.futures import ProcessPoolExecutor

import pytest
from api.rate_limits import QuotaExceeded, consume, usage

LIMITS = {"requests_per_minute": 10, "requests_per_day": 20}


def _attempt(path):
    try:
        consume(path, "shared-key", LIMITS, 100000)
        return True
    except QuotaExceeded:
        return False


def test_concurrent_workers_enforce_one_quota(tmp_path):
    path = str(tmp_path / "quota.db")
    with ProcessPoolExecutor(
        max_workers=4, mp_context=multiprocessing.get_context("spawn")
    ) as workers:
        accepted = list(workers.map(_attempt, [path] * 24))
    assert sum(accepted) == 10
    assert usage(path, "shared-key", 100000) == 10
    with ProcessPoolExecutor(
        max_workers=2, mp_context=multiprocessing.get_context("spawn")
    ) as restarted:
        assert not any(restarted.map(_attempt, [path] * 4))


def test_rolling_windows_and_independent_keys(tmp_path):
    path = str(tmp_path / "quota.db")
    for _ in range(10):
        consume(path, "key-a", LIMITS, 100000)
    with pytest.raises(QuotaExceeded, match="Rate limit"):
        consume(path, "key-a", LIMITS, 100059)
    consume(path, "key-b", LIMITS, 100059)
    for _ in range(10):
        consume(path, "key-a", LIMITS, 100060)
    with pytest.raises(QuotaExceeded, match="Daily limit"):
        consume(path, "key-a", LIMITS, 100120)
    assert usage(path, "key-a", 100120) == 20
    consume(path, "key-a", LIMITS, 186400)
    assert usage(path, "key-a", 186400) == 11


def test_database_records_hashes_instead_of_api_keys(tmp_path):
    path = str(tmp_path / "quota.db")
    consume(path, "private-key", LIMITS, 100000)
    with sqlite3.connect(path) as connection:
        stored = connection.execute("SELECT key_hash FROM requests").fetchone()[0]
    assert stored == hashlib.sha256(b"private-key").hexdigest()
