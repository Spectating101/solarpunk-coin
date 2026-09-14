#!/usr/bin/env python3
"""Structural validation for the Digital Tax 2026 research package.

This validator checks package consistency. It does not validate the truth of legal
or empirical claims; source verification remains a research task.
"""

from __future__ import annotations

import argparse
import csv
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

SOURCE_CATALOG = ROOT / "SOURCE_CATALOG.csv"
CLAIM_REGISTER = ROOT / "CLAIM_REGISTER.csv"
COUNTRY_ARCHITECTURE = ROOT / "COUNTRY_ARCHITECTURE.csv"
MANUSCRIPT = ROOT / "FISCAL_CHOKEPOINTS_ASEAN_DIGITAL_TAX_PAPER_2026.md"

REQUIRED_COUNTRIES = {
    "Malaysia",
    "Indonesia",
    "Vietnam",
    "Thailand",
    "Philippines",
}

REQUIRED_SOURCE_COLUMNS = {
    "source_id",
    "country",
    "source_type",
    "authority",
    "title",
    "role",
    "status",
}

REQUIRED_CLAIM_COLUMNS = {
    "claim_id",
    "claim_class",
    "jurisdiction",
    "claim",
    "source_ids",
    "status",
    "allowed_use",
    "notes",
}

REQUIRED_ARCH_COLUMNS = {
    "country",
    "taxable_object",
    "liable_node",
    "node_locus",
    "destination_evidence",
    "transaction_rail",
    "event_coupling",
    "reconciliation_power",
    "primary_source_ids",
    "status",
    "open_issue",
}

REQUIRED_MANUSCRIPT_HEADINGS = [
    "## 1. Introduction",
    "## 2. From third-party information to platform fiscal intermediation",
    "## 3. Research design and source discipline",
    "## 4. Fiscal choke points: framework and typology",
    "## 5. Five Southeast Asian architectures",
    "## 6. Cross-case findings",
    "## 7. Implications for fiscal capacity and platform governance",
    "## 8. Limits and research agenda",
    "## 9. Conclusion",
    "## Data, sources, and reproducibility",
    "## References",
]

# Only references that look like frozen source IDs are checked against the source catalog.
SOURCE_ID_RE = re.compile(r"(?:[A-Z]{2}-PRI-\d{3}|LIT-\d{3})")


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    if not path.exists():
        raise FileNotFoundError(path)
    with path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        return list(reader.fieldnames or []), list(reader)


def require_columns(name: str, actual: list[str], required: set[str], errors: list[str]) -> None:
    missing = required - set(actual)
    if missing:
        errors.append(f"{name}: missing columns: {sorted(missing)}")


def check_unique(rows: list[dict[str, str]], key: str, name: str, errors: list[str]) -> None:
    seen: set[str] = set()
    for row in rows:
        value = (row.get(key) or "").strip()
        if not value:
            errors.append(f"{name}: blank {key}")
            continue
        if value in seen:
            errors.append(f"{name}: duplicate {key}={value}")
        seen.add(value)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--strict",
        action="store_true",
        help="also fail on country rows that remain PARTIAL_COMPLETE",
    )
    args = parser.parse_args()

    errors: list[str] = []
    warnings: list[str] = []

    try:
        source_columns, sources = read_csv(SOURCE_CATALOG)
        claim_columns, claims = read_csv(CLAIM_REGISTER)
        arch_columns, architecture = read_csv(COUNTRY_ARCHITECTURE)
    except FileNotFoundError as exc:
        print(f"ERROR: missing required file: {exc}", file=sys.stderr)
        return 1

    require_columns("SOURCE_CATALOG", source_columns, REQUIRED_SOURCE_COLUMNS, errors)
    require_columns("CLAIM_REGISTER", claim_columns, REQUIRED_CLAIM_COLUMNS, errors)
    require_columns("COUNTRY_ARCHITECTURE", arch_columns, REQUIRED_ARCH_COLUMNS, errors)

    check_unique(sources, "source_id", "SOURCE_CATALOG", errors)
    check_unique(claims, "claim_id", "CLAIM_REGISTER", errors)
    check_unique(architecture, "country", "COUNTRY_ARCHITECTURE", errors)

    source_ids = {(row.get("source_id") or "").strip() for row in sources}

    for claim in claims:
        claim_id = (claim.get("claim_id") or "<blank>").strip()
        for source_id in SOURCE_ID_RE.findall(claim.get("source_ids") or ""):
            if source_id not in source_ids:
                errors.append(f"{claim_id}: source reference {source_id} not found in SOURCE_CATALOG")

    countries = {(row.get("country") or "").strip() for row in architecture}
    if countries != REQUIRED_COUNTRIES:
        errors.append(
            "COUNTRY_ARCHITECTURE: country set mismatch: "
            f"expected={sorted(REQUIRED_COUNTRIES)} actual={sorted(countries)}"
        )

    for row in architecture:
        country = (row.get("country") or "<blank>").strip()
        for source_id in SOURCE_ID_RE.findall(row.get("primary_source_ids") or ""):
            if source_id not in source_ids:
                errors.append(f"{country}: architecture source {source_id} not found in SOURCE_CATALOG")
        status = (row.get("status") or "").strip()
        if status != "COMPLETE":
            message = f"{country}: architecture status is {status or '<blank>'}"
            if args.strict:
                errors.append(message)
            else:
                warnings.append(message)

    if not MANUSCRIPT.exists():
        errors.append("manuscript file is missing")
        manuscript = ""
    else:
        manuscript = MANUSCRIPT.read_text(encoding="utf-8")

    for heading in REQUIRED_MANUSCRIPT_HEADINGS:
        if heading not in manuscript:
            errors.append(f"manuscript: missing required heading: {heading}")

    required_phrases = [
        "node locus",
        "event coupling",
        "1 July 2025",
        "comparative and institutional rather than causal",
        "platform revenue",
        "transaction value",
        "first comparative study of ASEAN digital taxation",
    ]
    for phrase in required_phrases:
        if phrase.lower() not in manuscript.lower():
            errors.append(f"manuscript: required boundary/concept phrase missing: {phrase}")

    stale_phrases = [
        "platform withholding began in April 2025",
        "base-broadening yields 30",
        "107% full mediation",
        "+$114M causal effect",
        "publication probability",
    ]
    for phrase in stale_phrases:
        if phrase.lower() in manuscript.lower():
            errors.append(f"manuscript: stale inherited phrase re-entered: {phrase}")

    historical_claims = [row for row in claims if (row.get("claim_id") or "").startswith("DT-HIST-")]
    for row in historical_claims:
        if (row.get("status") or "").strip() != "SUPERSEDED":
            errors.append(f"{row.get('claim_id')}: historical claim must remain SUPERSEDED")

    literature_boundary_claims = {
        (row.get("claim_id") or "").strip(): (row.get("status") or "").strip()
        for row in claims
        if (row.get("claim_id") or "").startswith("DT-LIT-")
    }
    for required_claim in ("DT-LIT-001", "DT-LIT-002"):
        if literature_boundary_claims.get(required_claim) != "VERIFIED_POSITIONING":
            errors.append(f"{required_claim}: literature boundary must remain VERIFIED_POSITIONING")

    print(f"sources={len(sources)} claims={len(claims)} countries={len(architecture)}")
    for warning in warnings:
        print(f"WARNING: {warning}")

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        print(f"FAIL: {len(errors)} structural error(s)", file=sys.stderr)
        return 1

    print("PASS: Digital Tax package is structurally consistent")
    if warnings:
        print("NOTE: non-strict validation passed with open research-status warnings")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
