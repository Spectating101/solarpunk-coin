#!/usr/bin/env python3
"""Structural validation for the Digital Tax 2026 research package.

This validator checks package consistency. It does not validate the truth of legal
or empirical claims; source verification and independent coding remain research tasks.
"""

from __future__ import annotations

import argparse
import csv
from datetime import date
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

SOURCE_CATALOG = ROOT / "SOURCE_CATALOG.csv"
CLAIM_REGISTER = ROOT / "CLAIM_REGISTER.csv"
COUNTRY_ARCHITECTURE = ROOT / "COUNTRY_ARCHITECTURE.csv"
COUNTRY_PATH_CODINGS = ROOT / "COUNTRY_PATH_CODINGS.csv"
CASE_CHRONOLOGY = ROOT / "CASE_CHRONOLOGY.csv"
MANUSCRIPT = ROOT / "FISCAL_CHOKEPOINTS_ASEAN_DIGITAL_TAX_PAPER_2026.md"

REQUIRED_FILES = [
    "CLAIM_BOUNDARIES.md",
    "CLAIM_REGISTER.csv",
    "CODING_RULES.md",
    "COUNTRY_ARCHITECTURE.csv",
    "COUNTRY_PATH_CODINGS.csv",
    "CASE_CHRONOLOGY.csv",
    "COMPARATIVE_PROPOSITIONS.md",
    "ROBUSTNESS_AND_RIVAL_EXPLANATIONS.md",
    "DERIVED_ARCHITECTURE_SUMMARY.md",
    "derive_comparative_findings.py",
    "FIGURES_TABLES_SPEC.md",
    "FISCAL_CHOKEPOINTS_ASEAN_DIGITAL_TAX_PAPER_2026.md",
    "LITERATURE_POSITIONING.md",
    "PACKAGE_MANIFEST.md",
    "QUALITY_GATE.md",
    "REVIEWER_RISK_REGISTER.md",
    "SOURCE_CATALOG.csv",
    "SUBMISSION_MATERIALS.md",
]

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

REQUIRED_PATH_COLUMNS = {
    "path_id",
    "country",
    "instrument_path",
    "tax_object_class",
    "liable_node_class",
    "platform_role",
    "control_functions",
    "event_coupling_class",
    "destination_or_nexus_class",
    "primary_source_ids",
    "coding_status",
    "notes",
}

REQUIRED_CHRONOLOGY_COLUMNS = {
    "country",
    "event_date",
    "date_type",
    "event",
    "architecture_change",
    "source_ids",
    "analytical_role",
    "status",
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


def check_source_refs(label: str, raw: str, source_ids: set[str], errors: list[str]) -> None:
    refs = SOURCE_ID_RE.findall(raw or "")
    if not refs:
        errors.append(f"{label}: no frozen source IDs found")
        return
    for source_id in refs:
        if source_id not in source_ids:
            errors.append(f"{label}: source reference {source_id} not found in SOURCE_CATALOG")


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

    for name in REQUIRED_FILES:
        if not (ROOT / name).is_file():
            errors.append(f"missing required package file: {name}")

    try:
        source_columns, sources = read_csv(SOURCE_CATALOG)
        claim_columns, claims = read_csv(CLAIM_REGISTER)
        arch_columns, architecture = read_csv(COUNTRY_ARCHITECTURE)
        path_columns, paths = read_csv(COUNTRY_PATH_CODINGS)
        chronology_columns, chronology = read_csv(CASE_CHRONOLOGY)
    except FileNotFoundError as exc:
        print(f"ERROR: missing required file: {exc}", file=sys.stderr)
        return 1

    require_columns("SOURCE_CATALOG", source_columns, REQUIRED_SOURCE_COLUMNS, errors)
    require_columns("CLAIM_REGISTER", claim_columns, REQUIRED_CLAIM_COLUMNS, errors)
    require_columns("COUNTRY_ARCHITECTURE", arch_columns, REQUIRED_ARCH_COLUMNS, errors)
    require_columns("COUNTRY_PATH_CODINGS", path_columns, REQUIRED_PATH_COLUMNS, errors)
    require_columns("CASE_CHRONOLOGY", chronology_columns, REQUIRED_CHRONOLOGY_COLUMNS, errors)

    check_unique(sources, "source_id", "SOURCE_CATALOG", errors)
    check_unique(claims, "claim_id", "CLAIM_REGISTER", errors)
    check_unique(architecture, "country", "COUNTRY_ARCHITECTURE", errors)
    check_unique(paths, "path_id", "COUNTRY_PATH_CODINGS", errors)

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
        check_source_refs(f"{country}: architecture", row.get("primary_source_ids") or "", source_ids, errors)
        status = (row.get("status") or "").strip()
        if status != "COMPLETE":
            message = f"{country}: architecture status is {status or '<blank>'}"
            if args.strict:
                errors.append(message)
            else:
                warnings.append(message)

    path_countries = {(row.get("country") or "").strip() for row in paths}
    if path_countries != REQUIRED_COUNTRIES:
        errors.append(
            "COUNTRY_PATH_CODINGS: country coverage mismatch: "
            f"expected={sorted(REQUIRED_COUNTRIES)} actual={sorted(path_countries)}"
        )
    for row in paths:
        path_id = (row.get("path_id") or "<blank>").strip()
        check_source_refs(f"{path_id}: path", row.get("primary_source_ids") or "", source_ids, errors)
        for field in ("liable_node_class", "event_coupling_class", "tax_object_class", "coding_status"):
            if not (row.get(field) or "").strip():
                errors.append(f"{path_id}: blank required coding field {field}")

    chronology_countries = {(row.get("country") or "").strip() for row in chronology}
    missing_chronology = REQUIRED_COUNTRIES - chronology_countries
    if missing_chronology:
        errors.append(f"CASE_CHRONOLOGY: missing country coverage: {sorted(missing_chronology)}")
    chronology_keys: set[tuple[str, str, str]] = set()
    for row in chronology:
        country = (row.get("country") or "<blank>").strip()
        raw_date = (row.get("event_date") or "").strip()
        date_type = (row.get("date_type") or "").strip()
        try:
            date.fromisoformat(raw_date)
        except ValueError:
            errors.append(f"CASE_CHRONOLOGY: invalid ISO event_date for {country}: {raw_date!r}")
        key = (country, raw_date, date_type)
        if key in chronology_keys:
            errors.append(f"CASE_CHRONOLOGY: duplicate country/date/type row: {key}")
        chronology_keys.add(key)
        check_source_refs(f"{country} {raw_date}: chronology", row.get("source_ids") or "", source_ids, errors)

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

    print(
        f"sources={len(sources)} claims={len(claims)} countries={len(architecture)} "
        f"coded_paths={len(paths)} chronology_rows={len(chronology)}"
    )
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
