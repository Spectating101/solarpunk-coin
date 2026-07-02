#!/usr/bin/env python3
"""Convert thesis DOCX files to PDF (LibreOffice headless, with pandoc fallback)."""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path


def docx_to_pdf(docx: Path, pdf: Path, *, timeout: int = 180) -> bool:
    """Convert a single DOCX file to PDF. Returns True on success."""
    docx = docx.resolve()
    pdf = pdf.resolve()
    if not docx.exists():
        return False

    pdf.parent.mkdir(parents=True, exist_ok=True)
    if pdf.exists():
        pdf.unlink()

    if _libreoffice_convert(docx, pdf.parent, timeout=timeout):
        produced = pdf.parent / f"{docx.stem}.pdf"
        if produced.exists() and produced != pdf:
            produced.replace(pdf)
        return pdf.exists()

    if _pandoc_convert(docx, pdf, timeout=timeout):
        return pdf.exists()

    return False


def _libreoffice_convert(docx: Path, outdir: Path, *, timeout: int) -> bool:
    soffice = shutil.which("soffice") or shutil.which("libreoffice")
    if not soffice:
        return False
    try:
        subprocess.run(
            [
                soffice,
                "--headless",
                "--convert-to",
                "pdf",
                "--outdir",
                str(outdir),
                str(docx),
            ],
            check=True,
            capture_output=True,
            timeout=timeout,
        )
        return (outdir / f"{docx.stem}.pdf").exists()
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, OSError):
        return False


def _pandoc_convert(docx: Path, pdf: Path, *, timeout: int) -> bool:
    pandoc = shutil.which("pandoc")
    if not pandoc:
        return False
    try:
        subprocess.run(
            [pandoc, str(docx), "-o", str(pdf)],
            check=True,
            capture_output=True,
            timeout=timeout,
        )
        return pdf.exists()
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, OSError):
        return False


def convert_many(pairs: list[tuple[Path, Path]], *, verbose: bool = True) -> list[Path]:
    """Convert multiple DOCX→PDF pairs. Returns list of successful PDF paths."""
    ok: list[Path] = []
    for docx, pdf in pairs:
        if docx_to_pdf(docx, pdf):
            ok.append(pdf)
            if verbose:
                print(f"pdf_ok {pdf}")
        elif verbose:
            print(f"pdf_fail {docx}", file=sys.stderr)
    return ok


def main() -> int:
    import argparse

    parser = argparse.ArgumentParser(description="Convert thesis DOCX file(s) to PDF.")
    parser.add_argument("docx", nargs="+", type=Path, help="DOCX input path(s)")
    parser.add_argument(
        "-o",
        "--output-dir",
        type=Path,
        help="Output directory (default: same directory as each DOCX)",
    )
    args = parser.parse_args()

    pairs: list[tuple[Path, Path]] = []
    for docx in args.docx:
        outdir = args.output_dir or docx.parent
        pairs.append((docx, outdir / f"{docx.stem}.pdf"))

    converted = convert_many(pairs)
    if not converted:
        print(
            "No PDFs produced. Install LibreOffice (libreoffice) or pandoc.",
            file=sys.stderr,
        )
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
