"""Inject auto-generated empirical tables into grounded chapter drafts."""

from __future__ import annotations

from pathlib import Path

PKG = Path(__file__).resolve().parent

MARKERS = {
    "<!-- INJECT_CH3_EMPIRICAL_TABLES -->": PKG / "THESIS_CH3_TABLES.md",
    "<!-- INJECT_CH4_EMPIRICAL_TABLES -->": PKG / "THESIS_CH4_TABLES.md",
}


def inject_empirical_tables(body: str) -> str:
    for marker, path in MARKERS.items():
        if marker not in body:
            continue
        if not path.exists():
            raise FileNotFoundError(
                f"Missing {path.name}; run python thesis_package/generate_thesis_tables.py"
            )
        block = path.read_text(encoding="utf-8").strip()
        body = body.replace(marker, block + "\n")
    return body


def inject_chapter3_tables(body: str) -> str:
    return inject_empirical_tables(body)


def inject_chapter4_tables(body: str) -> str:
    return inject_empirical_tables(body)
