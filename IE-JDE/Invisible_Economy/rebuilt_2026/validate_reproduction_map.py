#!/usr/bin/env python3
"""Validate IL V2 result provenance and source-native definition controls."""
from __future__ import annotations
import csv
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
SOURCES = ROOT / "SOURCE_REGISTER.csv"
DEFS = ROOT / "ISSUER_DEFINITION_LEDGER.csv"
RESULTS = ROOT / "RESULT_REPRODUCTION_MAP.csv"


def read(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def split(raw: str) -> list[str]:
    return [x.strip() for x in (raw or "").split(";") if x.strip()]


def main() -> int:
    errors: list[str] = []
    for path in (SOURCES, DEFS, RESULTS):
        if not path.exists(): errors.append(f"missing {path.name}")
    if errors:
        for e in errors: print(f"ERROR: {e}", file=sys.stderr)
        return 1
    source_ids = {(r.get("source_id") or "").strip() for r in read(SOURCES)}
    defs = read(DEFS)
    results = read(RESULTS)
    result_ids = [(r.get("result_id") or "").strip() for r in results]
    if len(result_ids) != len(set(result_ids)):
        errors.append("RESULT_REPRODUCTION_MAP has duplicate result_id")
    for row in defs:
        did = row.get("definition_id") or "<blank>"
        for sid in split(row.get("source_id") or ""):
            if sid not in source_ids: errors.append(f"{did}: unknown source {sid}")
        if not (row.get("forbidden_use") or "").strip():
            errors.append(f"{did}: forbidden_use is blank")
    by_id = {r.get("result_id"): r for r in results}
    required = {"IL-R01","IL-R02","IL-R03","IL-R04","IL-R05","IL-R06","IL-R07","IL-R08","IL-R09"}
    if required - set(by_id): errors.append(f"missing result rows {sorted(required-set(by_id))}")
    for row in results:
        rid = row.get("result_id") or "<blank>"
        for sid in split(row.get("source_ids") or ""):
            if sid not in source_ids: errors.append(f"{rid}: unknown source {sid}")
        if not (row.get("blocker_or_refresh_rule") or "").strip():
            errors.append(f"{rid}: blocker_or_refresh_rule is blank")
    if by_id.get("IL-R06", {}).get("output_status") != "BLOCKED":
        errors.append("IL-R06 business-count result must remain BLOCKED until source conflict resolves")
    if "2026-11-01" not in (by_id.get("IL-R08", {}).get("blocker_or_refresh_rule") or ""):
        errors.append("IL-R08 must retain post-2026-11-01 currentness refresh rule")
    if by_id.get("IL-R02", {}).get("validation_status") != "VALIDATED_IDENTITY":
        errors.append("IL-R02 Tokopedia mechanism must remain VALIDATED_IDENTITY")
    if by_id.get("IL-R01", {}).get("output_status") != "FROZEN_RESULT":
        errors.append("IL-R01 Tokopedia opposite-direction result must remain FROZEN_RESULT")
    print(f"issuer_definitions={len(defs)} result_rows={len(results)} sources={len(source_ids)}")
    if errors:
        for e in errors: print(f"ERROR: {e}", file=sys.stderr)
        print(f"FAIL: {len(errors)} provenance error(s)", file=sys.stderr)
        return 1
    print("PASS: IL V2 result provenance and definition layer is structurally consistent")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
