#!/usr/bin/env python3
"""Guard the Fiscal Choke Points publication candidate against claim regression."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
PAPER = ROOT / "FISCAL_CHOKEPOINTS_PUBLICATION_CANDIDATE_2026.md"

REQUIRED_PACKAGE_FILES = [
    "MANUSCRIPT_SOURCE_MAP.csv",
    "NOVELTY_AND_PRIOR_ART_AUDIT.md",
    "OVERLAP_CONTROL_WITH_INVISIBLE_LEDGER.md",
    "HOSTILE_PUBLICATION_AUDIT.md",
    "PUBLICATION_READINESS.md",
    "SUBMISSION_MATERIALS.md",
    "FIGURES_TABLES_SPEC.md",
    "VENUE_ROUTE_EJTR.md",
    "AI_ASSISTANCE_DISCLOSURE.md",
]

REQUIRED = [
    "## Abstract",
    "## 1. Introduction",
    "## 2. Prior art and the remaining research gap",
    "## 3. Research design and source discipline",
    "## 4. Seven fiscal paths across five jurisdictions",
    "## 5. Boundary cases: when an intermediary is *not* the fiscal node",
    "## 6. Node locus and event coupling",
    "## 7. From legal architecture to operational fiscal capacity",
    "## 8. Fiscal capacity and platform governance",
    "## 9. Limitations and identification frontier",
    "## 10. Conclusion",
    "## Data and reproducibility",
    "## References",
]

MUST_CONTAIN = [
    "platform presence alone",
    "payment is outside marketplace control",
    "continuous offer-payment-delivery",
    "formal DGT designation",
    "procedural depth",
    "not evidence that Thailand's system performs better",
    "legal assignment is not operational performance",
    "242 active PMSE VAT collectors",
    "223",
    "Rp36.69 trillion",
]

LEGACY_OR_PROHIBITED = [
    "rates do not matter",
    "30:1",
    "+$114M causal effect",
    "107% full mediation",
    "destination taxation eliminates tax competition",
    "hidden GDP",
    "recoverable tax base",
    "Thailand has the best",
    "maturity score",
]

NEGATION_MARKERS = (
    "not ", "no ", "does not", "do not", "without", "rather than",
    "forbid", "forbidden", "reject", "rejected", "superseded", "old ", "legacy",
)


def promoted(text: str, phrase: str) -> bool:
    p = phrase.lower()
    for line in text.splitlines():
        ll = line.lower()
        if p in ll and not any(marker in ll for marker in NEGATION_MARKERS):
            return True
    return False


def main() -> int:
    errors = []
    for filename in REQUIRED_PACKAGE_FILES:
        if not (ROOT / filename).is_file():
            errors.append(f"missing reviewer-facing publication control: {filename}")
    if not PAPER.exists():
        errors.append(f"missing {PAPER.name}")
        for e in errors:
            print(f"ERROR: {e}", file=sys.stderr)
        return 1
    text = PAPER.read_text(encoding="utf-8")
    lower = text.lower()
    for heading in REQUIRED:
        if heading not in text:
            errors.append(f"missing required section: {heading}")
    for phrase in MUST_CONTAIN:
        if phrase.lower() not in lower:
            errors.append(f"missing required bounded finding/nonclaim: {phrase}")
    for phrase in LEGACY_OR_PROHIBITED:
        if promoted(text, phrase):
            errors.append(f"legacy/prohibited claim appears affirmatively: {phrase}")
    if "comparative and institutional rather than causal" not in lower:
        errors.append("paper must preserve comparative/noncausal contribution boundary")
    if "source transparency and operational performance are different variables" not in lower:
        errors.append("paper must preserve documentation-depth/performance distinction")
    if errors:
        for e in errors:
            print(f"ERROR: {e}", file=sys.stderr)
        print(f"FAIL: {len(errors)} publication-candidate error(s)", file=sys.stderr)
        return 1
    print("PASS: Fiscal Choke Points publication candidate, venue route, AI disclosure, and reviewer-facing controls are structurally complete")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
