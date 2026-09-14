#!/usr/bin/env python3
"""Structural validation for the Invisible Ledger V2 research-control pack.

This validator intentionally checks the rebuilt_2026 control layer only. It does not
certify the live thesis proposal, the legacy Invisible Economy folder, or empirical
source accuracy. Those require separate advisor/source review.
"""

from __future__ import annotations

import csv
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent

REQUIRED_FILES = [
    "README.md",
    "CLAIM_BOUNDARIES.md",
    "EVIDENCE_ARCHITECTURE.csv",
    "RESULT_REGISTER.csv",
    "ISSUER_ADMISSION_RULES.md",
    "INSTITUTIONAL_VISIBILITY_CHAIN.csv",
    "REPRODUCTION_PLAN.md",
    "LEGACY_MIGRATION.md",
    "CONSOLIDATION_BOUNDARY.md",
]

EVIDENCE_REQUIRED = {
    "module_id",
    "module_name",
    "observation_layer",
    "core_question",
    "evidence_role",
    "current_status",
    "admission_gate",
    "forbidden_inference",
}

RESULT_REQUIRED = {
    "result_id",
    "module_id",
    "result_or_claim",
    "status",
    "source_authority",
    "permitted_interpretation",
    "forbidden_inference",
    "next_freeze_action",
}

VIS_REQUIRED = {
    "stage_id",
    "stage_name",
    "question",
    "evidence_required",
    "current_status",
    "permitted_claim",
    "forbidden_forward_inference",
}

CANONICAL_TEXT_FILES = [
    "README.md",
    "CLAIM_BOUNDARIES.md",
    "ISSUER_ADMISSION_RULES.md",
    "REPRODUCTION_PLAN.md",
    "CONSOLIDATION_BOUNDARY.md",
]

# Legacy phrases may appear in LEGACY_MIGRATION.md and RESULT_REGISTER.csv only when
# they are explicitly marked rejected/demoted. They must not leak into canonical prose.
QUARANTINED_PHRASES = [
    "$185 billion unmeasured economy",
    "$82.8 billion invisible economy",
    "12.3x fiscal multiplier",
    "12.5x fiscal multiplier",
    "census-level estimate",
    "natural experiment validates the invisible economy",
]

EXPECTED_STAGES = [
    "RECORD_EXISTS",
    "ACTOR_HOLDS_RECORD",
    "LEGAL_DUTY",
    "IDENTIFIER_AVAILABLE",
    "TRANSMISSION_OCCURS",
    "RECORD_MATCHED",
    "VERIFIED_ADMIN_USE",
    "OUTCOME_OBSERVED",
]


def fail(msg: str, errors: list[str]) -> None:
    errors.append(msg)


def read_csv(name: str) -> tuple[list[dict[str, str]], set[str]]:
    path = ROOT / name
    with path.open(newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        rows = list(reader)
        return rows, set(reader.fieldnames or [])


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []

    for name in REQUIRED_FILES:
        if not (ROOT / name).is_file():
            fail(f"missing required file: {name}", errors)

    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    evidence, evidence_fields = read_csv("EVIDENCE_ARCHITECTURE.csv")
    results, result_fields = read_csv("RESULT_REGISTER.csv")
    visibility, vis_fields = read_csv("INSTITUTIONAL_VISIBILITY_CHAIN.csv")

    missing = EVIDENCE_REQUIRED - evidence_fields
    if missing:
        fail(f"EVIDENCE_ARCHITECTURE.csv missing columns: {sorted(missing)}", errors)
    missing = RESULT_REQUIRED - result_fields
    if missing:
        fail(f"RESULT_REGISTER.csv missing columns: {sorted(missing)}", errors)
    missing = VIS_REQUIRED - vis_fields
    if missing:
        fail(f"INSTITUTIONAL_VISIBILITY_CHAIN.csv missing columns: {sorted(missing)}", errors)

    module_ids = [row.get("module_id", "") for row in evidence]
    if len(module_ids) != len(set(module_ids)):
        fail("duplicate module_id in evidence architecture", errors)
    result_ids = [row.get("result_id", "") for row in results]
    if len(result_ids) != len(set(result_ids)):
        fail("duplicate result_id in result register", errors)

    module_set = set(module_ids)
    for row in results:
        rid = row.get("result_id", "<unknown>")
        mid = row.get("module_id", "")
        if mid not in module_set:
            fail(f"{rid}: module_id {mid!r} not present in evidence architecture", errors)
        for field in ("source_authority", "permitted_interpretation", "forbidden_inference", "next_freeze_action"):
            if not row.get(field, "").strip():
                fail(f"{rid}: blank required field {field}", errors)

    stage_names = [row.get("stage_name", "") for row in visibility]
    if stage_names != EXPECTED_STAGES:
        fail(
            "institutional visibility stages changed or reordered; expected "
            + " -> ".join(EXPECTED_STAGES),
            errors,
        )

    for row in visibility:
        sid = row.get("stage_id", "<unknown>")
        for field in ("current_status", "permitted_claim", "forbidden_forward_inference"):
            if not row.get(field, "").strip():
                fail(f"{sid}: blank required field {field}", errors)

    for name in CANONICAL_TEXT_FILES:
        text = (ROOT / name).read_text(encoding="utf-8").lower()
        for phrase in QUARANTINED_PHRASES:
            if phrase.lower() in text:
                fail(f"quarantined legacy phrase leaked into canonical prose: {name}: {phrase}", errors)

    pending = [r for r in results if "PENDING" in r.get("status", "")]
    unknown_visibility = [r for r in visibility if r.get("current_status", "") in {"UNKNOWN", "UNKNOWN_PENDING_FREEZE", "NOT_ESTABLISHED"}]
    if pending:
        warnings.append(f"{len(pending)} result rows remain pending by design")
    if unknown_visibility:
        warnings.append(f"{len(unknown_visibility)} visibility stages remain unresolved by design")

    print(f"modules={len(evidence)} results={len(results)} visibility_stages={len(visibility)}")
    for warning in warnings:
        print(f"WARNING: {warning}")

    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    print("PASS: Invisible Ledger V2 research-control pack is structurally consistent")
    print("NOTE: this does not certify the live proposal or empirical source accuracy")
    return 0


if __name__ == "__main__":
    sys.exit(main())
