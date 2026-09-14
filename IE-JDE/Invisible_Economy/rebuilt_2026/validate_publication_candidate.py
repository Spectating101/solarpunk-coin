#!/usr/bin/env python3
"""Guard the bounded Invisible Ledger publication candidate against claim regression."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
PAPER = ROOT / "INVISIBLE_LEDGER_PUBLICATION_CANDIDATE_2026.md"

REQUIRED = [
    "## Abstract",
    "## 1. Introduction",
    "## 2. Literature and conceptual framework",
    "## 3. Research design and evidence discipline",
    "## 4. Issuer growth translation: Tokopedia FY2022-FY2023",
    "## 5. Where broader e-commerce growth appears",
    "## 6. Payment-system traces are a different observation layer",
    "## 7. From private records to institutional visibility",
    "## 8. Synthesis: what the Invisible Ledger recovers",
    "## 9. Limitations and research agenda",
    "## 10. Conclusion",
    "## Data and reproducibility",
    "## References",
]

MUST_CONTAIN = [
    "8.90%",
    "53.20%",
    "60.56%",
    "17.08%",
    "15.30%",
    "98.46%",
    "34.4693 billion",
    "36.1%",
    "31 October 2026",
    "1 November 2026",
    "matching evidence is unknown",
]

FORBIDDEN = [
    "$185 billion",
    "$185B",
    "12.3×",
    "12.3x fiscal multiplier",
    "Malaysia causal validation",
    "1.54% implied",
    "implied value per business is",
    "PMK 37 is operational",
    "PMK 37 collection is active",
    "QRIS grew 175.2%",
    "QRIS grew 191.8%",
]


def main() -> int:
    errors = []
    if not PAPER.exists():
        print(f"ERROR: missing {PAPER.name}", file=sys.stderr)
        return 1
    text = PAPER.read_text(encoding="utf-8")
    for item in REQUIRED:
        if item not in text:
            errors.append(f"missing required section: {item}")
    for phrase in MUST_CONTAIN:
        if phrase.lower() not in text.lower():
            errors.append(f"missing bounded publication fact/boundary: {phrase}")
    for phrase in FORBIDDEN:
        if phrase.lower() in text.lower():
            errors.append(f"forbidden/stale publication phrase re-entered: {phrase}")
    if "not evidence of hidden GDP" not in text and "not hidden GDP" not in text:
        errors.append("paper must preserve explicit hidden-GDP nonclaim")
    if "arithmetic" not in text.lower() or "not a causal" not in text.lower():
        errors.append("Tokopedia mechanism must retain arithmetic/noncausal language")
    if errors:
        for e in errors:
            print(f"ERROR: {e}", file=sys.stderr)
        print(f"FAIL: {len(errors)} publication-candidate error(s)", file=sys.stderr)
        return 1
    print("PASS: Invisible Ledger publication candidate preserves bounded claims and required structure")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
