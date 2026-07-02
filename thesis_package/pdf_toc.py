#!/usr/bin/env python3
"""Extract heading page numbers from a built thesis PDF for TOC generation."""

from __future__ import annotations

import re
from pathlib import Path

import fitz

TOC_SPECS: list[tuple[str, re.Pattern[str]]] = [
    ("Abstract", re.compile(r"^Abstract\s*$", re.MULTILINE)),
    ("Chapter 1 — Introduction", re.compile(r"Chapter 1\s*[-—]\s*Introduction")),
    (
        "Chapter 2 — Literature Review and Theoretical Background",
        re.compile(r"Chapter 2\s*[-—]\s*Literature"),
    ),
    (
        "Chapter 3 — Empirical Evidence from Bitcoin Energy Costs",
        re.compile(r"Chapter 3\s*[-—]\s*Empirical"),
    ),
    (
        "Chapter 4 — Pricing Renewable-Energy Risk",
        re.compile(r"Chapter 4\s*[-—]\s*Pricing"),
    ),
    (
        "Chapter 5 — Constraints Framework and Proof-of-Concept Implementation",
        re.compile(r"Chapter 5\s*[-—]\s*Constraints"),
    ),
    ("Chapter 6 — Conclusion", re.compile(r"Chapter 6\s*[-—]\s*Conclusion")),
    ("References", re.compile(r"^References\s*$", re.MULTILINE)),
]


def _is_toc_page(text: str) -> bool:
    return "Table of Contents" in text and text.count("Chapter ") >= 2


def _is_references_body(text: str) -> bool:
    return bool(re.search(r"^References\s*$", text, re.MULTILINE)) and (
        "Nakamoto" in text or "Eichengreen" in text or "Black" in text
    )


def extract_toc_page_map(pdf_path: Path) -> dict[str, int]:
    """Return TOC label -> 1-based page number from a rendered thesis PDF."""
    doc = fitz.open(str(pdf_path))
    found: dict[str, int] = {}
    try:
        for page_idx in range(len(doc)):
            text = doc[page_idx].get_text("text")
            if not text.strip():
                continue
            if _is_toc_page(text):
                continue
            for label, pattern in TOC_SPECS:
                if label in found:
                    continue
                if label == "References":
                    if _is_references_body(text):
                        found[label] = page_idx + 1
                    continue
                if pattern.search(text):
                    found[label] = page_idx + 1
    finally:
        doc.close()
    return found
