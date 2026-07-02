#!/usr/bin/env python3
"""Copy built thesis artifacts to repo-root submission filenames."""

from __future__ import annotations

import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PKG = Path(__file__).resolve().parent
SRC_DOCX = PKG / "output" / "THESIS_GROUNDED.docx"
DST_DOCX = ROOT / "energy_constraint_thesis_final_submission_v3.docx"
DST_MD = ROOT / "energy_constraint_thesis_final_submission_v3.md"
SRC_MD = PKG / "THESIS_GROUNDED_MANUSCRIPT.md"


def try_pdf(docx: Path, pdf: Path) -> bool:
    sys.path.insert(0, str(PKG))
    from export_pdf import docx_to_pdf

    return docx_to_pdf(docx, pdf)


def main() -> int:
    if not SRC_DOCX.exists():
        print(f"missing {SRC_DOCX}; run npm run thesis:docx first", file=sys.stderr)
        return 1

    shutil.copy2(SRC_DOCX, DST_DOCX)
    print(f"copied -> {DST_DOCX.relative_to(ROOT)}")

    if SRC_MD.exists():
        shutil.copy2(SRC_MD, DST_MD)
        print(f"copied -> {DST_MD.relative_to(ROOT)}")

    pdf = ROOT / "energy_constraint_thesis_final_submission_v3.pdf"
    if try_pdf(DST_DOCX, pdf):
        print(f"exported -> {pdf.relative_to(ROOT)}")
    else:
        print("pdf export skipped (install pandoc or libreoffice for auto PDF)")

    stamp = ROOT / "SUBMISSION_BUILD.txt"
    stamp.write_text(
        f"built_at={datetime.now(timezone.utc).isoformat()}\n"
        f"docx={DST_DOCX.name}\n"
        f"source={SRC_DOCX.relative_to(ROOT)}\n",
        encoding="utf-8",
    )
    print("submission_export_ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
