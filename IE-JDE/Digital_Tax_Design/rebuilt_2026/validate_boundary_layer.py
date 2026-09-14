#!/usr/bin/env python3
"""Validate the Fiscal Choke Points node-selection and boundary-case layer.

This is structural validation only. It checks that boundary/countercase rows are tied
to canonical transaction paths and frozen source IDs; it does not certify the legal
interpretation itself.
"""

from __future__ import annotations

import csv
import re
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
SOURCE_CATALOG = ROOT / "SOURCE_CATALOG.csv"
PATHS = ROOT / "COUNTRY_PATH_CODINGS.csv"
NODE_SELECTION = ROOT / "NODE_SELECTION_CONDITIONS.csv"
BOUNDARIES = ROOT / "BOUNDARY_CASES.csv"

SOURCE_ID_RE = re.compile(r"(?:[A-Z]{2}-PRI-\d{3}|LIT-\d{3})")
REQUIRED_COUNTRIES = {"Malaysia", "Indonesia", "Vietnam", "Thailand", "Philippines"}


def rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def check_refs(label: str, raw: str, valid: set[str], errors: list[str]) -> None:
    refs = SOURCE_ID_RE.findall(raw or "")
    if not refs:
        errors.append(f"{label}: no source IDs")
        return
    for ref in refs:
        if ref not in valid:
            errors.append(f"{label}: unknown source ID {ref}")


def main() -> int:
    errors: list[str] = []
    for path in (SOURCE_CATALOG, PATHS, NODE_SELECTION, BOUNDARIES):
        if not path.exists():
            errors.append(f"missing required file: {path.name}")
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    source_rows = rows(SOURCE_CATALOG)
    path_rows = rows(PATHS)
    node_rows = rows(NODE_SELECTION)
    boundary_rows = rows(BOUNDARIES)

    source_ids = {(r.get("source_id") or "").strip() for r in source_rows}
    path_ids = {(r.get("path_id") or "").strip() for r in path_rows}

    node_path_ids = [(r.get("path_id") or "").strip() for r in node_rows]
    if len(node_path_ids) != len(set(node_path_ids)):
        errors.append("NODE_SELECTION_CONDITIONS: duplicate path_id")
    if set(node_path_ids) != path_ids:
        errors.append(
            "NODE_SELECTION_CONDITIONS: path coverage differs from COUNTRY_PATH_CODINGS: "
            f"missing={sorted(path_ids - set(node_path_ids))} extra={sorted(set(node_path_ids) - path_ids)}"
        )

    node_countries = {(r.get("country") or "").strip() for r in node_rows}
    if node_countries != REQUIRED_COUNTRIES:
        errors.append(
            "NODE_SELECTION_CONDITIONS: country coverage mismatch: "
            f"expected={sorted(REQUIRED_COUNTRIES)} actual={sorted(node_countries)}"
        )

    for row in node_rows:
        pid = (row.get("path_id") or "<blank>").strip()
        for field in (
            "default_or_selected_node",
            "legal_activation_condition",
            "operational_control_condition",
            "designation_or_registration_gate",
            "evidence_layer",
            "what_this_can_explain",
            "what_this_cannot_explain",
        ):
            if not (row.get(field) or "").strip():
                errors.append(f"{pid}: blank node-selection field {field}")
        check_refs(f"{pid}: node-selection", row.get("source_ids") or "", source_ids, errors)

    boundary_ids = [(r.get("boundary_id") or "").strip() for r in boundary_rows]
    if len(boundary_ids) != len(set(boundary_ids)):
        errors.append("BOUNDARY_CASES: duplicate boundary_id")

    for row in boundary_rows:
        bid = (row.get("boundary_id") or "<blank>").strip()
        ref_path = (row.get("reference_path") or "").strip()
        if ref_path not in path_ids:
            errors.append(f"{bid}: reference_path {ref_path!r} not found in COUNTRY_PATH_CODINGS")
        for field in (
            "boundary_or_countercase",
            "expected_if_framework_too_broad",
            "observed_boundary",
            "research_use",
            "status",
            "next_test",
        ):
            if not (row.get(field) or "").strip():
                errors.append(f"{bid}: blank boundary field {field}")
        check_refs(f"{bid}: boundary", row.get("source_ids") or "", source_ids, errors)

    supported = [r for r in boundary_rows if (r.get("status") or "").startswith("SUPPORTED")]
    print(
        f"node_selection_rows={len(node_rows)} boundary_rows={len(boundary_rows)} "
        f"supported_boundaries={len(supported)}"
    )

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        print(f"FAIL: {len(errors)} boundary-layer error(s)", file=sys.stderr)
        return 1

    print("PASS: node-selection and boundary-case layer is structurally consistent")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
