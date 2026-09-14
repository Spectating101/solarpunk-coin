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

HARD_FORBIDDEN = [
    "Malaysia causal validation",
    "1.54% implied",
    "implied value per business is",
    "PMK 37 is operational",
    "PMK 37 collection is active",
    "QRIS grew 175.2%",
    "QRIS grew 191.8%",
]

LEGACY_TERMS = ["$185 billion", "$185B", "12.3×", "12.3x fiscal multiplier"]
NEGATION_MARKERS = (
    "old ", "legacy", "earlier", "exclude", "excluded", "excludes", "excluding",
    "demote", "demoted", "admission and exclusion", "do not", "does not", "not ",
    "no ", "reject", "rejected", "superseded", "rather than",
)


def legacy_promoted(text: str, term: str) -> bool:
    """Flag a legacy term only when it appears outside an explicit rejection context.

    The manuscript is allowed to name rejected historical claims in the exclusion
    section. Look at the current line plus several preceding lines so bullet items
    inherit their section/list context instead of being treated as live claims.
    """
    term_l = term.lower()
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if term_l not in line.lower():
            continue
        context = " ".join(lines[max(0, i - 4): i + 1]).lower()
        if not any(marker in context for marker in NEGATION_MARKERS):
            return True
    return False


def main() -> int:
    errors = []
    if not PAPER.exists():
        print(f"ERROR: missing {PAPER.name}", file=sys.stderr)
        return 1
    text = PAPER.read_text(encoding="utf-8")
    lower = text.lower()
    for item in REQUIRED:
        if item not in text:
            errors.append(f"missing required section: {item}")
    for phrase in MUST_CONTAIN:
        if phrase.lower() not in lower:
            errors.append(f"missing bounded publication fact/boundary: {phrase}")
    for phrase in HARD_FORBIDDEN:
        if phrase.lower() in lower:
            errors.append(f"forbidden/stale publication phrase re-entered: {phrase}")
    for term in LEGACY_TERMS:
        if legacy_promoted(text, term):
            errors.append(f"legacy term appears outside an explicit rejection/demotion context: {term}")
    if "not evidence of hidden GDP" not in text and "not hidden GDP" not in text:
        errors.append("paper must preserve explicit hidden-GDP nonclaim")
    if "arithmetic" not in lower or "not a causal" not in lower:
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
