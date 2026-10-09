#!/usr/bin/env python3
"""Validate the Fiscal Choke Points Stage-B operational-capacity layer.

Structural validation only. A PASS means procedural stages remain source-controlled
and outcome/performance fields remain bounded; it does not certify administrative
effectiveness.
"""
from __future__ import annotations

import csv
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "SOURCE_CATALOG.csv"
MATRIX = ROOT / "OPERATIONAL_CAPACITY_MATRIX.csv"
CLAIMS = ROOT / "CLAIM_REGISTER.csv"
SOURCE_ID_RE = re.compile(r"(?:[A-Z]{2}-PRI-\d{3}|LIT-\d{3})")
REQUIRED_COUNTRIES = {"Malaysia", "Indonesia", "Vietnam", "Thailand", "Philippines"}
REQUIRED_COLUMNS = {
    "country", "instrument", "filing_or_declaration", "correction_or_amendment",
    "refund_or_reversal", "audit_or_review", "appeal_or_dispute",
    "enforcement_or_penalty", "observed_outcome", "source_ids",
    "overall_evidence_status", "allowed_interpretation", "forbidden_inference",
}


def read(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        return list(reader.fieldnames or []), list(reader)


def refs(raw: str) -> list[str]:
    return SOURCE_ID_RE.findall(raw or "")


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []
    for p in (SOURCE, MATRIX, CLAIMS, ROOT / "OPERATIONAL_CAPACITY_LAYER.md"):
        if not p.exists():
            errors.append(f"missing required file: {p.name}")
    if errors:
        for e in errors: print(f"ERROR: {e}", file=sys.stderr)
        return 1

    _, source_rows = read(SOURCE)
    columns, rows = read(MATRIX)
    _, claim_rows = read(CLAIMS)
    missing_cols = REQUIRED_COLUMNS - set(columns)
    if missing_cols:
        errors.append(f"OPERATIONAL_CAPACITY_MATRIX missing columns: {sorted(missing_cols)}")

    source_ids = {(r.get("source_id") or "").strip() for r in source_rows}
    countries = {(r.get("country") or "").strip() for r in rows}
    if countries != REQUIRED_COUNTRIES:
        errors.append(f"country coverage mismatch: expected={sorted(REQUIRED_COUNTRIES)} actual={sorted(countries)}")
    if len(rows) != len(countries):
        errors.append("operational matrix must have one selected-instrument row per country")

    for row in rows:
        country = (row.get("country") or "<blank>").strip()
        found = refs(row.get("source_ids") or "")
        if not found:
            errors.append(f"{country}: no source IDs")
        for sid in found:
            if sid not in source_ids:
                errors.append(f"{country}: unknown source ID {sid}")
        if not (row.get("forbidden_inference") or "").strip():
            errors.append(f"{country}: missing forbidden_inference")
        outcome = (row.get("observed_outcome") or "").upper()
        if country == "Indonesia":
            if outcome != "ADMIN_FACT_COLLECTION_ONLY":
                errors.append("Indonesia observed_outcome must remain ADMIN_FACT_COLLECTION_ONLY")
        elif outcome != "UNRESOLVED":
            errors.append(f"{country}: observed_outcome must remain UNRESOLVED absent harmonized performance evidence")
        combined = " ".join((row.get(f) or "") for f in (
            "filing_or_declaration", "correction_or_amendment", "refund_or_reversal",
            "audit_or_review", "appeal_or_dispute", "enforcement_or_penalty"
        )).upper()
        if "EVIDENCED" not in combined and "PARTIAL" not in combined:
            warnings.append(f"{country}: no downstream procedural stage currently evidenced")

    operational_claim_ids = {
        (r.get("claim_id") or "").strip(): r for r in claim_rows
        if (r.get("claim_id") or "").startswith("DT-")
    }
    for cid in ("DT-MY-005", "DT-VN-005", "DT-TH-003", "DT-PH-005", "DT-CMP-006", "DT-GAP-002"):
        if cid not in operational_claim_ids:
            errors.append(f"missing operational claim {cid}")

    gap = operational_claim_ids.get("DT-GAP-002", {})
    if gap and (gap.get("status") or "") != "ACTIVE_EVIDENCE_GAP":
        errors.append("DT-GAP-002 must remain ACTIVE_EVIDENCE_GAP")
    cmp = operational_claim_ids.get("DT-CMP-006", {})
    if cmp and "not procedural effectiveness" not in (cmp.get("notes") or "").lower():
        errors.append("DT-CMP-006 must explicitly preserve procedural-depth/effectiveness boundary")

    for required_source in ("MY-PRI-006", "VN-PRI-008", "TH-PRI-005", "PH-PRI-008"):
        if required_source not in source_ids:
            errors.append(f"missing Stage-B primary source {required_source}")

    print(f"operational_rows={len(rows)} countries={len(countries)} sources={len(source_rows)}")
    for w in warnings: print(f"WARNING: {w}")
    if errors:
        for e in errors: print(f"ERROR: {e}", file=sys.stderr)
        print(f"FAIL: {len(errors)} operational-capacity error(s)", file=sys.stderr)
        return 1
    print("PASS: operational-capacity layer is structurally consistent")
    print("NOTE: PASS does not establish administrative performance or comparative superiority")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
