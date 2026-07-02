"""Format SPK_V1_EVIDENCE.md for inclusion in Chapter 5 / thesis DOCX."""

from __future__ import annotations

import re
from pathlib import Path

PKG = Path(__file__).resolve().parent
EVIDENCE_PATH = PKG / "SPK_V1_EVIDENCE.md"

SECTION_MAP = {
    "Canonical contracts": "5.9.1 Canonical contracts and live metrics",
    "Live metrics": None,  # merged into 5.9.1
    "Payment ledger (indexed from chain)": "5.9.2 Indexed payment ledger (Table 5.4)",
    "Operator cycles": None,  # omit verbose cycle log from thesis body
}


def wordify_markdown_links(text: str) -> str:
    """Replace [label](url) with printable text for Word tables."""

    def repl(match: re.Match[str]) -> str:
        label, url = match.group(1), match.group(2)
        if "/tx/" in url:
            tx = url.rstrip("/").split("/tx/")[-1]
            if label.lower() == "link":
                return f"{tx[:10]}…"
            return label
        return label if label.lower() != "link" else url

    return re.sub(r"\[([^\]]+)\]\(([^)]+)\)", repl, text)


def format_evidence_block(raw: str) -> str:
    lines_out: list[str] = []
    section_title: str | None = None
    in_reproduce = False
    skip_section = False

    for line in raw.splitlines():
        if line.startswith("# SPK v1"):
            continue
        if line.startswith("## Reproduce"):
            in_reproduce = True
            continue
        if in_reproduce:
            continue

        if "Generated:" in line and line.strip().startswith("**"):
            meta = re.sub(r"\*+", "", line).strip()
            ts = meta.split("Generated:", 1)[-1].strip()
            lines_out.append("")
            lines_out.append(
                f"_Metrics and ledger entries below are synced from public Sepolia "
                f"testnet state (generated {ts})._"
            )
            lines_out.append("")
            continue
        if skip_section:
            continue
        if line.startswith("**Status:") or line.startswith("**Runtime:"):
            continue

        if line.startswith("## "):
            heading = line[3:].strip()
            if heading == "Operator cycles":
                skip_section = True
                section_title = None
                continue
            skip_section = False
            mapped = SECTION_MAP.get(heading)
            if mapped is None:
                continue
            section_title = mapped
            lines_out.append(f"#### {mapped}")
            lines_out.append("")
            continue

        if skip_section:
            continue

        if line.startswith("### ") and section_title == "5.9.3 Operator cycle log":
            lines_out.append(f"##### {line[4:].strip()}")
            continue

        lines_out.append(wordify_markdown_links(line))
        if section_title == "5.9.2 Indexed payment ledger (Table 5.4)" and line.startswith("| 21 |"):
            lines_out.append("")
            lines_out.append(
                "*Table 5.4. Indexed network payments on Sepolia (SPK v1). "
                "Payment #15 is the wallet-initiated pilot transfer (Pilot payer → Merchant).*"
            )

    body = "\n".join(lines_out).strip()
    if not body:
        return ""
    return body + "\n"


def load_evidence_appendix(path: Path | None = None) -> str:
    evidence = path or EVIDENCE_PATH
    if not evidence.exists():
        return ""
    return format_evidence_block(evidence.read_text(encoding="utf-8"))


def inject_chapter5_evidence(chapter_body: str, evidence_path: Path | None = None) -> str:
    appendix = load_evidence_appendix(evidence_path)
    if not appendix:
        return chapter_body

    chapter_body = chapter_body.replace(
        "(full ledger: `thesis_package/SPK_V1_EVIDENCE.md`).",
        "(Table 5.4 and §5.9.1–5.9.2 below; regenerated on each thesis build).",
    )

    # Drop one-line metrics summary; the embedded block repeats with tables.
    chapter_body = re.sub(
        r"Synced metrics \(Jun 2026\):[^\n]+\n\n",
        "",
        chapter_body,
        count=1,
    )

    marker = "## 5.10 Chapter Conclusion"
    if marker in chapter_body:
        return chapter_body.replace(marker, appendix + "\n" + marker, 1)
    return chapter_body.rstrip() + "\n\n" + appendix + "\n"
