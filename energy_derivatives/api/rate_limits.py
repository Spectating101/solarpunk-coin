"""Persistent rolling quotas shared by workers using the same local SQLite file."""

from __future__ import annotations

import hashlib
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator


class QuotaExceeded(Exception):
    pass


@contextmanager
def _transaction(path: str) -> Iterator[sqlite3.Connection]:
    database = Path(path)
    database.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(database, timeout=5, isolation_level=None)
    try:
        # Serialize count + insert across threads/processes, including first use.
        connection.execute("BEGIN IMMEDIATE")
        connection.execute(
            "CREATE TABLE IF NOT EXISTS requests (key_hash TEXT NOT NULL, at REAL NOT NULL)"
        )
        connection.execute("CREATE INDEX IF NOT EXISTS requests_key_at ON requests (key_hash, at)")
        connection.execute("CREATE INDEX IF NOT EXISTS requests_at ON requests (at)")
        yield connection
        connection.commit()
    except BaseException:
        connection.rollback()
        raise
    finally:
        connection.close()


def _key_hash(key: str) -> str:
    # No API-key credentials are stored in the database.
    return hashlib.sha256(key.encode("utf-8")).hexdigest()


def consume(path: str, key: str, limits: dict[str, int], now: float) -> None:
    with _transaction(path) as connection:
        connection.execute("DELETE FROM requests WHERE at <= ?", (now - 86400,))
        day, minute = connection.execute(
            "SELECT COUNT(*), COALESCE(SUM(at > ?), 0) FROM requests WHERE key_hash = ?",
            (now - 60, _key_hash(key)),
        ).fetchone()
        if day >= limits["requests_per_day"]:
            raise QuotaExceeded(f"Daily limit ({limits['requests_per_day']}) exceeded.")
        if minute >= limits["requests_per_minute"]:
            raise QuotaExceeded(f"Rate limit ({limits['requests_per_minute']}/min) exceeded.")
        connection.execute(
            "INSERT INTO requests (key_hash, at) VALUES (?, ?)", (_key_hash(key), now)
        )


def usage(path: str, key: str, now: float) -> int:
    with _transaction(path) as connection:
        row = connection.execute(
            "SELECT COUNT(*) FROM requests WHERE key_hash = ? AND at > ?",
            (_key_hash(key), now - 86400),
        ).fetchone()
        return int(row[0])
