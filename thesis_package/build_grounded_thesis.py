#!/usr/bin/env python3
"""
Assemble grounded chapter drafts into one submission markdown, then optional DOCX.

Usage:
  python thesis_package/build_grounded_thesis.py
  python thesis_package/build_grounded_thesis.py --docx
  python thesis_package/build_grounded_thesis.py --docx --chapters
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PKG = Path(__file__).resolve().parent
sys.path.insert(0, str(PKG))

from embed_evidence import inject_chapter5_evidence
OUTPUT_MD = PKG / "THESIS_GROUNDED_MANUSCRIPT.md"
OUTPUT_DOCX = PKG / "output" / "THESIS_GROUNDED.docx"
CHAPTER_OUTPUT_DIR = PKG / "output" / "chapters"

CHAPTER_FILES = [
    PKG / "CHAPTER_1_GROUNDED_DRAFT.md",
    PKG / "CHAPTER_2_GROUNDED_DRAFT.md",
    PKG / "CHAPTER_3_GROUNDED_DRAFT.md",
    PKG / "CHAPTER_4_GROUNDED_DRAFT.md",
    PKG / "CHAPTER_5_GROUNDED_DRAFT.md",
    PKG / "CHAPTER_6_GROUNDED_DRAFT.md",
]

CANONICAL_TITLE = (
    "Energy as a Constraint: Credibility, Pricing, and Settlement "
    "in Energy-Linked Digital Finance"
)

ABSTRACT = """\
This thesis asks whether energy can act as a credible constraint for digital money through \
energy-linked financial contracts, and what conditions are needed for that constraint to work.

The answer is conditional. Energy is not money by itself, but it combines production cost, \
economic usefulness, measurability, and compatibility with rule-based digital enforcement. \
The thesis argues that credibility requires five integrated constraints: reliable energy data, \
rule-bound issuance, explicit pricing and risk controls, protected settlement and redemption \
accounting, and limited governance.

The empirical chapters study Bitcoin as evidence that energy cost can matter for digital \
valuation, but only conditionally and specification-sensitively. The pricing chapter develops \
a reproducible option-style framework for renewable-energy-linked claims using public data, \
numerical validation, and oracle-tolerance analysis. The implementation chapter maps the \
constraints to a proof-of-concept smart contract system on Ethereum Sepolia, including an \
energy-native SPK v1 circulation loop with indexed on-chain payments.

The contribution is a bounded research framework—not a production-ready currency or \
stablecoin launch. The thesis shows how energy-linked digital finance can be studied, priced, \
and prototyped under explicit limits that users can inspect."""

KEYWORDS = (
    "Energy-linked finance, digital money, monetary credibility, renewable energy risk, "
    "Bitcoin energy cost, smart contracts, proof-of-concept"
)

JEL = "E42, G13, Q42, Q47"


def refresh_evidence() -> None:
    """Sync runtime metrics into thesis evidence pack."""
    venv_spk = ROOT / "spk_v1" / ".venv" / "bin" / "spk-v1"
    if venv_spk.exists():
        subprocess.run(
            [str(venv_spk), "foundation-sync", "--repo-root", str(ROOT)],
            check=False,
            cwd=ROOT,
        )
        subprocess.run(
            [str(venv_spk), "export-evidence", "--repo-root", str(ROOT)],
            check=False,
            cwd=ROOT,
        )
    else:
        subprocess.run(
            [sys.executable, str(PKG / "build_foundation_pack.py")],
            check=False,
            cwd=ROOT,
        )


def _normalize_ref(entry: str) -> str:
    return re.sub(r"\s+", " ", entry.strip().lower())


def extract_references(text: str) -> tuple[str, list[str]]:
    marker = "\n## References\n"
    if marker not in text:
        return text, []
    body, refs_block = text.split(marker, 1)
    entries = [line.strip() for line in refs_block.strip().splitlines() if line.strip()]
    return body.rstrip() + "\n", entries


def strip_proposed_title_block(lines: list[str]) -> list[str]:
    out: list[str] = []
    i = 0
    while i < len(lines):
        if lines[i].strip() == "## Proposed Thesis Title":
            i += 1
            while i < len(lines) and not re.match(r"^## \d+\.", lines[i]):
                i += 1
            continue
        out.append(lines[i])
        i += 1
    return out


def bump_headings(lines: list[str]) -> list[str]:
    out: list[str] = []
    for line in lines:
        if line.startswith("#### "):
            out.append("#" + line)
        elif line.startswith("### "):
            out.append("#" + line)
        elif line.startswith("## "):
            out.append("#" + line)
        elif line.startswith("# Chapter "):
            out.append("##" + line[1:])
        else:
            out.append(line)
    return out


def load_chapter(path: Path) -> tuple[str, list[str]]:
    raw = path.read_text(encoding="utf-8")
    body, refs = extract_references(raw)
    lines = strip_proposed_title_block(body.splitlines())
    transformed = "\n".join(bump_headings(lines)).strip() + "\n"
    return transformed, refs


def merge_references(all_refs: list[list[str]]) -> list[str]:
    seen: set[str] = set()
    merged: list[str] = []
    for chapter_refs in all_refs:
        for entry in chapter_refs:
            key = _normalize_ref(entry)
            if key in seen:
                continue
            seen.add(key)
            merged.append(entry)
    return merged


def build_front_matter() -> str:
    now = datetime.now(timezone.utc).strftime("%B %Y")
    return f"""# {CANONICAL_TITLE}

**Christopher Ongko**  
**Student ID: 1133958**

Department of Finance, Yuan Ze University  
Master's Thesis — {now}

---

## Abstract

{ABSTRACT}

**Keywords:** {KEYWORDS}

**JEL Codes:** {JEL}

## Table of Contents

1. Chapter 1 — Introduction  
2. Chapter 2 — Monetary Background and the Case for Energy  
3. Chapter 3 — Empirical Evidence from Bitcoin Energy Costs  
4. Chapter 4 — Pricing Renewable-Energy Risk  
5. Chapter 5 — Constraints Framework and Proof-of-Concept Implementation  
6. Chapter 6 — Conclusion  
7. References  

"""


def assemble_manuscript() -> str:
    parts = [build_front_matter()]
    all_refs: list[list[str]] = []

    for chapter_path in CHAPTER_FILES:
        if not chapter_path.exists():
            raise FileNotFoundError(f"Missing chapter draft: {chapter_path}")
        body, refs = load_chapter(chapter_path)
        if chapter_path.name == "CHAPTER_5_GROUNDED_DRAFT.md":
            body = inject_chapter5_evidence(body, PKG / "SPK_V1_EVIDENCE.md")
        parts.append(body)
        parts.append("\n")
        if refs:
            all_refs.append(refs)

    merged = merge_references(all_refs)
    if merged:
        parts.append("## References\n\n")
        parts.append("\n\n".join(merged))
        parts.append("\n")

    return "".join(parts)


def write_markdown(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)}")


def build_docx(input_md: Path, output_docx: Path, date_text: str) -> None:
    from create_thesis_word import build_docx

    output_docx.parent.mkdir(parents=True, exist_ok=True)
    build_docx(input_md, output_docx, date_text)
    print(f"wrote {output_docx.relative_to(ROOT)}")


def build_chapter_docx(manuscript: str, date_text: str) -> None:
    CHAPTER_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    from create_thesis_word import build_docx

    chunks = re.split(r"(?=^## Chapter \d+ )", manuscript, flags=re.MULTILINE)
    front = chunks[0] if chunks and not chunks[0].startswith("## Chapter") else ""
    refs_match = re.search(r"(## References\n.*)", manuscript, flags=re.DOTALL)
    refs_block = refs_match.group(1) if refs_match else ""

    for chunk in chunks:
        if not chunk.startswith("## Chapter"):
            continue
        m = re.match(r"^## Chapter (\d+)", chunk)
        if not m:
            continue
        num = m.group(1)
        mini = front + "\n\n" + chunk
        if refs_block and "## References" not in mini:
            mini += "\n\n" + refs_block
        tmp = PKG / "output" / f"_chapter_{num}.md"
        tmp.write_text(mini, encoding="utf-8")
        out = CHAPTER_OUTPUT_DIR / f"CHAPTER_{num}.docx"
        build_docx(tmp, out, date_text)
        print(f"wrote {out.relative_to(ROOT)}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Build grounded thesis markdown and DOCX.")
    parser.add_argument("--docx", action="store_true", help="Also build Word document(s).")
    parser.add_argument("--chapters", action="store_true", help="Build per-chapter DOCX files.")
    parser.add_argument("--skip-evidence", action="store_true", help="Skip evidence refresh.")
    parser.add_argument("--output-md", default=str(OUTPUT_MD))
    parser.add_argument("--output-docx", default=str(OUTPUT_DOCX))
    args = parser.parse_args()

    if not args.skip_evidence:
        print("==> refresh thesis evidence from runtime")
        refresh_evidence()

    print("==> assemble grounded manuscript")
    manuscript = assemble_manuscript()
    md_path = Path(args.output_md)
    write_markdown(md_path, manuscript)

    if args.docx or args.chapters:
        date_text = datetime.now().strftime("%B %Y")
        if args.docx:
            print("==> build full DOCX")
            build_docx(md_path, Path(args.output_docx), date_text)
        if args.chapters:
            print("==> build chapter DOCX files")
            build_chapter_docx(manuscript, date_text)

    print("thesis_build_ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
