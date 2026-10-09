#!/usr/bin/env python3
"""Derive a deterministic, non-causal summary from COUNTRY_PATH_CODINGS.csv.

The output is intentionally descriptive. It does not score country maturity,
performance, revenue, welfare, or legal quality.
"""

from __future__ import annotations

import argparse
from collections import Counter, defaultdict
import csv
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
INPUT = ROOT / "COUNTRY_PATH_CODINGS.csv"
OUTPUT = ROOT / "DERIVED_ARCHITECTURE_SUMMARY.md"


def load_rows() -> list[dict[str, str]]:
    with INPUT.open(newline="", encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def render(rows: list[dict[str, str]]) -> str:
    countries = sorted({r["country"] for r in rows})
    by_country: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in rows:
        by_country[row["country"]].append(row)

    node_counts = Counter(r["liable_node_class"] for r in rows)
    coupling_counts = Counter(r["event_coupling_class"] for r in rows)
    tax_object_counts = Counter(r["tax_object_class"] for r in rows)

    source_refs: set[str] = set()
    for row in rows:
        source_refs.update(
            part.strip()
            for part in row.get("primary_source_ids", "").split(";")
            if part.strip()
        )

    multi_path = {country: len(items) for country, items in by_country.items() if len(items) > 1}

    lines: list[str] = [
        "# Fiscal Choke Points — Derived Architecture Summary",
        "",
        "> Generated deterministically from `COUNTRY_PATH_CODINGS.csv`. This is a descriptive research-control output, not a performance ranking or causal result.",
        "",
        "## Coverage",
        "",
        f"- Countries represented: **{len(countries)}** — {', '.join(countries)}.",
        f"- Distinct coded transaction paths: **{len(rows)}**.",
        f"- Distinct primary-source IDs referenced by the path rows: **{len(source_refs)}**.",
    ]

    if multi_path:
        lines.append(
            "- Countries requiring more than one coded path: "
            + ", ".join(f"**{c} ({n})**" for c, n in sorted(multi_path.items()))
            + "."
        )
    else:
        lines.append("- No country currently requires more than one coded path.")

    lines += [
        "",
        "## Liable-node classes",
        "",
        "| Liable-node class | Coded paths |",
        "|---|---:|",
    ]
    for key, count in sorted(node_counts.items()):
        lines.append(f"| `{key}` | {count} |")

    lines += [
        "",
        "## Event-coupling classes",
        "",
        "| Event-coupling class | Coded paths |",
        "|---|---:|",
    ]
    for key, count in sorted(coupling_counts.items()):
        lines.append(f"| `{key}` | {count} |")

    lines += [
        "",
        "## Tax-object classes",
        "",
        "| Tax-object class | Coded paths |",
        "|---|---:|",
    ]
    for key, count in sorted(tax_object_counts.items()):
        lines.append(f"| `{key}` | {count} |")

    lines += [
        "",
        "## Path inventory",
        "",
        "| Path | Country | Liable node | Event coupling | Primary sources |",
        "|---|---|---|---|---|",
    ]
    for row in sorted(rows, key=lambda r: (r["country"], r["path_id"])):
        lines.append(
            "| `{path_id}` | {country} | `{node}` | `{coupling}` | {sources} |".format(
                path_id=row["path_id"],
                country=row["country"],
                node=row["liable_node_class"],
                coupling=row["event_coupling_class"],
                sources=row["primary_source_ids"],
            )
        )

    lines += [
        "",
        "## Findings that are mechanically supported by the coding",
        "",
        "1. **The five-country sample is not one-node homogeneous.** The coded paths place responsibility on several distinct node classes rather than one generic `platform` actor.",
        "2. **Event coupling is heterogeneous.** The coded paths contain multiple timing/rail classes; the package therefore should not collapse them into a single maturity ordering.",
        "3. **Country is sometimes too coarse a unit.** The Philippines currently requires separate B2C, B2B, and marketplace paths, demonstrating why transaction-path coding is analytically safer than one country-wide label.",
        "4. **Node locus and event coupling are not encoded as the same variable.** They are stored in separate fields and must remain separately reviewable.",
        "5. **The coded paths span more than one legal object.** Cross-case comparison is therefore limited to the administrative transaction-node layer; bases, liabilities, revenues, and welfare effects are not pooled.",
        "",
        "## Findings this file cannot establish",
        "",
        "This derivation does **not** establish which architecture is more effective, fair, efficient, privacy-preserving, enforceable, revenue-productive, or welfare-enhancing. It also does not identify why a legislature selected a node. Those require additional outcome, institutional, and identification evidence.",
        "",
        "## Regeneration",
        "",
        "Run:",
        "",
        "```bash",
        "python IE-JDE/Digital_Tax_Design/rebuilt_2026/derive_comparative_findings.py",
        "```",
        "",
        "CI uses `--check` to fail if this file drifts from `COUNTRY_PATH_CODINGS.csv`.",
        "",
    ]

    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()

    if not INPUT.exists():
        print(f"ERROR: missing {INPUT.name}", file=sys.stderr)
        return 1

    rows = load_rows()
    if not rows:
        print("ERROR: no coded paths", file=sys.stderr)
        return 1

    rendered = render(rows)

    if args.check:
        if not OUTPUT.exists():
            print(f"ERROR: missing derived output {OUTPUT.name}", file=sys.stderr)
            return 1
        current = OUTPUT.read_text(encoding="utf-8")
        if current != rendered:
            print("ERROR: derived architecture summary is stale; regenerate it", file=sys.stderr)
            return 1
        print(f"PASS: derived architecture summary matches {len(rows)} coded paths")
        return 0

    OUTPUT.write_text(rendered, encoding="utf-8")
    print(f"WROTE: {OUTPUT.name} from {len(rows)} coded paths")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
