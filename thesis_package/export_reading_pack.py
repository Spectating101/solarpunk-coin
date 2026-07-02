#!/usr/bin/env python3
"""
Assemble a chapter-by-chapter reading pack: Markdown, DOCX, and PDF.

Output layout (under thesis_package/output/reading/):

  README.md
  full/
    THESIS_GROUNDED.md
    THESIS_GROUNDED.docx
    THESIS_GROUNDED.pdf
  chapters/
    Chapter_01_Introduction.{md,docx,pdf}
    ...

Usage:
  npm run thesis:reading
  python thesis_package/export_reading_pack.py
  python thesis_package/export_reading_pack.py --build   # rebuild docx first
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PKG = Path(__file__).resolve().parent
OUTPUT = PKG / "output"
READING = OUTPUT / "reading"
FULL_DIR = READING / "full"
CHAPTER_DIR = READING / "chapters"

SRC_MD = PKG / "THESIS_GROUNDED_MANUSCRIPT.md"
SRC_DOCX = OUTPUT / "THESIS_GROUNDED.docx"
SRC_CHAPTER_DOCX = OUTPUT / "chapters"
SRC_CHAPTER_MD = OUTPUT  # _chapter_N.md staging files

CHAPTERS = [
    ("1", "Introduction"),
    ("2", "Literature_Review"),
    ("3", "Bitcoin_Energy_Empirics"),
    ("4", "Renewable_Energy_Pricing"),
    ("5", "Constraints_and_Implementation"),
    ("6", "Conclusion"),
]


def run_build() -> int:
    cmd = [
        sys.executable,
        str(PKG / "build_grounded_thesis.py"),
        "--docx",
        "--chapters",
        "--skip-evidence",
    ]
    print("==> rebuild thesis markdown + docx")
    return subprocess.run(cmd, cwd=ROOT).returncode


def slug_for(num: str, short: str) -> str:
    return f"Chapter_{num.zfill(2)}_{short}"


def copy_text(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)


def write_readme(
    path: Path,
    *,
    built_at: str,
    chapter_files: list[tuple[str, str, bool, bool, bool]],
    full_md: bool,
    full_docx: bool,
    full_pdf: bool,
) -> None:
    lines = [
        "# Thesis reading pack",
        "",
        f"Built: {built_at}",
        "",
        "Use this folder to read the thesis chapter by chapter in PDF, Word, or Markdown.",
        "",
        "## Full manuscript",
        "",
        "| Format | File |",
        "|---|---|",
    ]
    if full_md:
        lines.append("| Markdown | [full/THESIS_GROUNDED.md](full/THESIS_GROUNDED.md) |")
    if full_docx:
        lines.append("| Word | [full/THESIS_GROUNDED.docx](full/THESIS_GROUNDED.docx) |")
    if full_pdf:
        lines.append("| PDF | [full/THESIS_GROUNDED.pdf](full/THESIS_GROUNDED.pdf) |")

    lines.extend(
        [
            "",
            "## Chapters",
            "",
            "| # | Title | PDF | Word | Markdown |",
            "|---:|---|---|---|---|",
        ]
    )
    for num, short, has_pdf, has_docx, has_md in chapter_files:
        title = short.replace("_", " ")
        pdf = f"[PDF](chapters/{slug_for(num, short)}.pdf)" if has_pdf else "—"
        docx = f"[DOCX](chapters/{slug_for(num, short)}.docx)" if has_docx else "—"
        md = f"[MD](chapters/{slug_for(num, short)}.md)" if has_md else "—"
        lines.append(f"| {num} | {title} | {pdf} | {docx} | {md} |")

    lines.extend(
        [
            "",
            "## Refresh",
            "",
            "From the repo root:",
            "",
            "```bash",
            "npm run thesis:reading",
            "```",
            "",
            "Markdown + Word only (no PDF):",
            "",
            "```bash",
            "npm run thesis:docx",
            "```",
            "",
            "PDF conversion uses LibreOffice (`libreoffice --headless`).",
            "",
        ]
    )
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Export chapter-by-chapter reading pack.")
    parser.add_argument(
        "--build",
        action="store_true",
        help="Rebuild grounded markdown and DOCX before exporting.",
    )
    parser.add_argument(
        "--skip-pdf",
        action="store_true",
        help="Copy MD/DOCX only; skip PDF conversion.",
    )
    args = parser.parse_args()

    if args.build:
        if run_build() != 0:
            return 1

    if not SRC_DOCX.exists() or not SRC_MD.exists():
        print(
            "Missing thesis outputs. Run: npm run thesis:docx",
            file=sys.stderr,
        )
        return 1

    sys.path.insert(0, str(PKG))
    from export_pdf import convert_many, docx_to_pdf

    FULL_DIR.mkdir(parents=True, exist_ok=True)
    CHAPTER_DIR.mkdir(parents=True, exist_ok=True)

    copy_text(SRC_MD, FULL_DIR / "THESIS_GROUNDED.md")
    copy_text(SRC_DOCX, FULL_DIR / "THESIS_GROUNDED.docx")
    print(f"copied {FULL_DIR.relative_to(ROOT)}/THESIS_GROUNDED.md")
    print(f"copied {FULL_DIR.relative_to(ROOT)}/THESIS_GROUNDED.docx")

    full_pdf_ok = False
    if not args.skip_pdf:
        full_pdf = FULL_DIR / "THESIS_GROUNDED.pdf"
        if docx_to_pdf(FULL_DIR / "THESIS_GROUNDED.docx", full_pdf):
            full_pdf_ok = True
            print(f"pdf_ok {full_pdf.relative_to(ROOT)}")

    chapter_meta: list[tuple[str, str, bool, bool, bool]] = []
    pdf_pairs: list[tuple[Path, Path]] = []

    for num, short in CHAPTERS:
        slug = slug_for(num, short)
        src_docx = SRC_CHAPTER_DOCX / f"CHAPTER_{num}.docx"
        src_md = SRC_CHAPTER_MD / f"_chapter_{num}.md"
        dst_docx = CHAPTER_DIR / f"{slug}.docx"
        dst_md = CHAPTER_DIR / f"{slug}.md"
        dst_pdf = CHAPTER_DIR / f"{slug}.pdf"

        has_docx = src_docx.exists()
        has_md = src_md.exists()
        has_pdf = False

        if has_docx:
            copy_text(src_docx, dst_docx)
            print(f"copied {dst_docx.relative_to(ROOT)}")
            if not args.skip_pdf:
                pdf_pairs.append((dst_docx, dst_pdf))
        if has_md:
            copy_text(src_md, dst_md)
            print(f"copied {dst_md.relative_to(ROOT)}")

        chapter_meta.append((num, short, has_pdf, has_docx, has_md))

    if pdf_pairs and not args.skip_pdf:
        converted = {p for p in convert_many(pdf_pairs)}
        chapter_meta = [
            (num, short, (CHAPTER_DIR / f"{slug_for(num, short)}.pdf") in converted, d, m)
            for num, short, _, d, m in chapter_meta
        ]

    built_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    write_readme(
        READING / "README.md",
        built_at=built_at,
        chapter_files=chapter_meta,
        full_md=True,
        full_docx=True,
        full_pdf=full_pdf_ok,
    )
    print(f"wrote {READING.relative_to(ROOT)}/README.md")

    stamp = READING / "BUILD.txt"
    stamp.write_text(
        f"built_at={built_at}\n"
        f"full_pdf={full_pdf_ok}\n"
        f"chapters={sum(1 for c in chapter_meta if c[2])}/{len(CHAPTERS)} pdf\n",
        encoding="utf-8",
    )

    if not args.skip_pdf and not full_pdf_ok:
        print("warning: full PDF not produced (install libreoffice)", file=sys.stderr)

    if full_pdf_ok and not args.skip_pdf:
        audit_rc = subprocess.run(
            [
                sys.executable,
                str(PKG / "audit_thesis_output.py"),
                str(FULL_DIR / "THESIS_GROUNDED.md"),
                str(FULL_DIR / "THESIS_GROUNDED.pdf"),
            ],
            cwd=ROOT,
        ).returncode
        if audit_rc != 0:
            return audit_rc

    print(f"reading_pack_ok -> {READING.relative_to(ROOT)}/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
