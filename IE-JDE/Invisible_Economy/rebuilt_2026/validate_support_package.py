#!/usr/bin/env python3
"""Structural and boundary validation for the Invisible Ledger V2 support package.

This validator does not certify empirical truth. It checks that provisional/frozen
status, source references, current-state controls, and forbidden equivalences remain
explicit while the active proposal is still evolving.
"""
from __future__ import annotations

import csv
import math
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent

FILES = {
    "sources": ROOT / "SOURCE_REGISTER.csv",
    "bps_growth": ROOT / "BPS_GROWTH_ANATOMY.csv",
    "bps_chars": ROOT / "BPS_BUSINESS_CHARACTERISTICS.csv",
    "bi": ROOT / "BI_DEFINITION_LEDGER.csv",
    "visibility": ROOT / "INSTITUTIONAL_VISIBILITY_MATRIX.csv",
    "exclusions": ROOT / "EXCLUSION_LEDGER.csv",
}

FORBIDDEN_CANONICAL_PHRASES = (
    "$185B invisible economy",
    "12.3x fiscal multiplier",
    "transaction value minus revenue = unmeasured GDP",
)


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []

    for label, path in FILES.items():
        if not path.exists():
            errors.append(f"missing required file {path.name}")
    if errors:
        for e in errors:
            print(f"ERROR: {e}", file=sys.stderr)
        return 1

    sources = read_csv(FILES["sources"])
    source_ids = {(r.get("source_id") or "").strip() for r in sources}
    if "DJP-DELAY-2026-08" not in source_ids:
        errors.append("current-state control source DJP-DELAY-2026-08 is missing")

    growth = read_csv(FILES["bps_growth"])
    growth_by_id = {(r.get("bps_row_id") or "").strip(): r for r in growth}
    required_growth_ids = {
        "BPS23-TOTAL", "BPS23-MKT", "BPS23-NONMKT",
        "BPS24-TOTAL", "BPS24-MKT", "BPS24-NONMKT",
        "BPS-D-TOTAL", "BPS-D-MKT", "BPS-D-NONMKT", "BPS-D-SHARE",
        "BPS23-BUSINESSES", "BPS24-BUSINESSES",
    }
    missing = required_growth_ids - set(growth_by_id)
    if missing:
        errors.append(f"BPS growth ledger missing rows: {sorted(missing)}")

    for rid, row in growth_by_id.items():
        raw_ids = row.get("source_id") or ""
        for sid in [x.strip() for x in raw_ids.split(";") if x.strip()]:
            if sid not in source_ids:
                errors.append(f"{rid}: unknown source_id {sid}")
        status = row.get("status") or ""
        if rid in {"BPS23-BUSINESSES", "BPS24-BUSINESSES"} and "RESOLUTION" not in status:
            errors.append(f"{rid}: business-count row must remain unresolved until primary table conflict closes")

    # Check the descriptive channel arithmetic while retaining provisional status.
    try:
        v23 = float(growth_by_id["BPS23-TOTAL"]["value"])
        v24 = float(growth_by_id["BPS24-TOTAL"]["value"])
        m23 = float(growth_by_id["BPS23-MKT"]["value"])
        m24 = float(growth_by_id["BPS24-MKT"]["value"])
        n23 = float(growth_by_id["BPS23-NONMKT"]["value"])
        n24 = float(growth_by_id["BPS24-NONMKT"]["value"])
        expected = {
            "BPS-D-TOTAL": (v24 / v23 - 1) * 100,
            "BPS-D-MKT": (m24 / m23 - 1) * 100,
            "BPS-D-NONMKT": (n24 / n23 - 1) * 100,
            "BPS-D-SHARE": (n24 - n23) / (v24 - v23) * 100,
        }
        for rid, exp in expected.items():
            actual = float(growth_by_id[rid]["value"])
            if not math.isclose(actual, exp, rel_tol=0, abs_tol=1e-6):
                errors.append(f"{rid}: stored derived value {actual} != recomputed {exp}")
    except (KeyError, ValueError, ZeroDivisionError) as exc:
        errors.append(f"BPS arithmetic check failed: {exc}")

    chars = read_csv(FILES["bps_chars"])
    for row in chars:
        cid = row.get("characteristic_id") or "<blank>"
        sid = (row.get("source_id") or "").strip()
        if sid not in source_ids:
            errors.append(f"{cid}: unknown source_id {sid}")
        if not (row.get("forbidden_inference") or "").strip():
            errors.append(f"{cid}: missing forbidden_inference")

    bi_rows = read_csv(FILES["bi"])
    for row in bi_rows:
        mid = row.get("bi_measure_id") or "<blank>"
        for sid in [x.strip() for x in (row.get("source_id") or "").split(";") if x.strip()]:
            if sid not in source_ids:
                errors.append(f"{mid}: unknown source_id {sid}")
        if not (row.get("forbidden_equivalence") or "").strip():
            errors.append(f"{mid}: missing forbidden_equivalence")

    visibility = read_csv(FILES["visibility"])
    current_rows = [r for r in visibility if (r.get("visibility_id") or "") == "IL-PMK37-01"]
    if len(current_rows) != 1:
        errors.append("exactly one IL-PMK37-01 current-state row is required")
    else:
        row = current_rows[0]
        if row.get("currentness_date") != "2026-09-14":
            errors.append("IL-PMK37-01 must retain explicit 2026-09-14 currentness date until refreshed")
        if row.get("operational_activation_status") != "DELAYED_UNTIL_2026-11-01":
            errors.append("IL-PMK37-01 must encode the current official postponement")
        if row.get("matching_evidence_status") != "UNKNOWN" or row.get("outcome_evidence_status") != "UNKNOWN":
            errors.append("PMK37 matching/outcome must remain UNKNOWN without later-stage evidence")
    for row in visibility:
        vid = row.get("visibility_id") or "<blank>"
        for sid in [x.strip() for x in (row.get("source_ids") or "").split(";") if x.strip()]:
            if sid not in source_ids:
                errors.append(f"{vid}: unknown source_id {sid}")

    exclusions = read_csv(FILES["exclusions"])
    excluded_objects = "\n".join((r.get("candidate_object") or "") for r in exclusions).lower()
    for concept in ("$185b", "12.3x", "july 2026 four-marketplace appointments"):
        if concept.lower() not in excluded_objects:
            errors.append(f"exclusion ledger missing control concept: {concept}")

    for filename in ("SUPPORT_PACKAGE_MANIFEST.md", "EVIDENCE_FREEZE_PREVIEW.md", "DATA_PRODUCT_SCHEMAS.md"):
        path = ROOT / filename
        if not path.exists():
            errors.append(f"missing support control file {filename}")

    unresolved_growth = [r["bps_row_id"] for r in growth if "PENDING" in (r.get("status") or "") or "CONFLICT" in (r.get("status") or "")]
    if unresolved_growth:
        warnings.append("unresolved BPS rows: " + ", ".join(unresolved_growth))
    unresolved_bi = [r["bi_measure_id"] for r in bi_rows if "NEEDS_WORKBOOK" in (r.get("status") or "")]
    if unresolved_bi:
        warnings.append("BI definitions still require workbook freeze: " + ", ".join(unresolved_bi))

    print(f"sources={len(sources)} bps_growth_rows={len(growth)} bps_characteristics={len(chars)} bi_rows={len(bi_rows)} visibility_rows={len(visibility)} exclusions={len(exclusions)}")
    for w in warnings:
        print(f"WARNING: {w}")
    if errors:
        for e in errors:
            print(f"ERROR: {e}", file=sys.stderr)
        print(f"FAIL: {len(errors)} support-package error(s)", file=sys.stderr)
        return 1
    print("PASS: Invisible Ledger V2 support package is structurally consistent")
    print("NOTE: PASS does not promote provisional rows or resolve advisor gates")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
