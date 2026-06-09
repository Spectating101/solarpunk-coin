"""Format SPK_V1_EVIDENCE.md for inclusion in Chapter 5 / thesis DOCX."""

from __future__ import annotations

import re
from pathlib import Path

PKG = Path(__file__).resolve().parent
EVIDENCE_PATH = PKG / "SPK_V1_EVIDENCE.md"

SECTION_MAP = {
    "Canonical contracts": "5.10.1 Canonical contracts and live metrics",
    "Live metrics": None,  # merged into 5.10.1
    "Payment ledger (indexed from chain)": "5.10.2 Indexed payment ledger (Table 5.4)",
    "Operator cycles": "5.10.3 Operator cycle log",
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

    for line in raw.splitlines():
        if line.startswith("# SPK v1"):
            continue
        if line.startswith("## Reproduce"):
            in_reproduce = True
            continue
        if in_reproduce:
            continue

        if line.startswith("**Generated:"):
            meta = line.strip("*").strip()
            lines_out.append(
                f"*The following blocks are exported from `state/runtime/spk_v1.json` "
                f"after Sepolia sync ({meta}).*"
            )
            lines_out.append("")
            continue
        if line.startswith("**Status:") or line.startswith("**Runtime:"):
            continue

        if line.startswith("## "):
            heading = line[3:].strip()
            mapped = SECTION_MAP.get(heading)
            if mapped is None:
                continue
            section_title = mapped
            lines_out.append(f"### {mapped}")
            lines_out.append("")
            if heading == "Payment ledger (indexed from chain)":
                lines_out.append(
                    "Table 5.4 lists all indexed `settleNetworkPayment` events. "
                    "Payment **#15** is the wallet-initiated pilot transfer (Pilot payer → Merchant)."
                )
                lines_out.append("")
            continue

        if line.startswith("### ") and section_title == "5.10.3 Operator cycle log":
            lines_out.append(f"#### {line[4:].strip()}")
            continue

        lines_out.append(wordify_markdown_links(line))

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
        "(Table 5.4 and §5.10.1–5.10.3 below; regenerated on each thesis build).",
    )

    marker = "### 5.11 Chapter Conclusion"
    if marker in chapter_body:
        return chapter_body.replace(marker, appendix + "\n" + marker, 1)
    return chapter_body.rstrip() + "\n\n" + appendix + "\n"
