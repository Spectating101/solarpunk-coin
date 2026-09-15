#!/usr/bin/env python3
"""Build a deterministic *candidate* Zenodo bundle for Fiscal Choke Points.

This script deliberately does not publish, reserve a DOI, or choose a license.
It verifies the frozen reader-facing manuscript hashes and refuses to build if
research-control files have drifted from the locked source snapshot outside the
explicit archive-metadata allowlist.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import tempfile
import zipfile
from datetime import datetime, timezone
from pathlib import Path

PACKAGE_ID = "DT-FCP-2026-001"
BUNDLE_ROOT_NAME = f"Fiscal_Choke_Points_{PACKAGE_ID}"
ZIP_NAME = f"{BUNDLE_ROOT_NAME}_Zenodo_Candidate.zip"
SOURCE_BASELINE = "6aa3e8e2a1ea256a383515f4ebdba13462bbc2bd"
RESEARCH_REL = Path("IE-JDE/Digital_Tax_Design/rebuilt_2026")

EXPECTED_MANUSCRIPTS = {
    "pdf": {
        "name": "Fiscal_Choke_Points_SSRN_Working_Paper_2026_FINAL.pdf",
        "sha256": "8ef8b215c7e1340f7c7c8f97c2e0449cad8c571077ea4ee2dd4332a41d133ba6",
        "bytes": 195111,
    },
    "docx": {
        "name": "Fiscal_Choke_Points_SSRN_Working_Paper_2026_FINAL.docx",
        "sha256": "d44b87e06a56977e98f8b5a23965c0cd3eca6796f9f2459acdff6e83a915f05b",
        "bytes": 55093,
    },
}

ALLOWED_ARCHIVE_METADATA_CHANGES = {
    str(RESEARCH_REL / "CITATION.cff"),
    str(RESEARCH_REL / "ZENODO_RELEASE_MANIFEST_2026-09-15.md"),
    str(RESEARCH_REL / "ZENODO_EXTERNAL_SHA256SUMS_2026-09-15.txt"),
    str(RESEARCH_REL / "build_zenodo_bundle.py"),
}

IGNORED_NAMES = {"__pycache__", ".DS_Store"}
IGNORED_SUFFIXES = {".pyc", ".pyo"}


def run_git(repo_root: Path, *args: str) -> str:
    proc = subprocess.run(
        ["git", "-C", str(repo_root), *args],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    return proc.stdout.strip()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def verify_external(path: Path, expected: dict[str, object]) -> dict[str, object]:
    if not path.is_file():
        raise SystemExit(f"missing manuscript file: {path}")
    actual_hash = sha256(path)
    actual_bytes = path.stat().st_size
    if actual_hash != expected["sha256"]:
        raise SystemExit(
            f"SHA-256 mismatch for {path.name}: expected {expected['sha256']}, got {actual_hash}"
        )
    if actual_bytes != expected["bytes"]:
        raise SystemExit(
            f"size mismatch for {path.name}: expected {expected['bytes']}, got {actual_bytes}"
        )
    return {
        "source_path": str(path.resolve()),
        "archive_name": expected["name"],
        "sha256": actual_hash,
        "bytes": actual_bytes,
    }


def verify_source_lock(repo_root: Path) -> tuple[str, str, list[str]]:
    head = run_git(repo_root, "rev-parse", "HEAD")
    run_git(repo_root, "cat-file", "-e", f"{SOURCE_BASELINE}^{{commit}}")

    dirty = run_git(repo_root, "status", "--porcelain", "--", str(RESEARCH_REL))
    if dirty:
        raise SystemExit(
            "research package has uncommitted changes; commit or clean them before building:\n"
            + dirty
        )

    diff_text = run_git(
        repo_root,
        "diff",
        "--name-only",
        f"{SOURCE_BASELINE}..{head}",
        "--",
        str(RESEARCH_REL),
    )
    changed = [line for line in diff_text.splitlines() if line.strip()]
    unexpected = sorted(set(changed) - ALLOWED_ARCHIVE_METADATA_CHANGES)
    if unexpected:
        raise SystemExit(
            "source package drifted beyond archive metadata allowlist; create a new source snapshot first:\n- "
            + "\n- ".join(unexpected)
        )

    commit_epoch = int(run_git(repo_root, "show", "-s", "--format=%ct", head))
    commit_time = datetime.fromtimestamp(commit_epoch, timezone.utc).isoformat().replace("+00:00", "Z")
    return head, commit_time, changed


def ignore_copy(_directory: str, names: list[str]) -> set[str]:
    ignored = set()
    for name in names:
        if name in IGNORED_NAMES or Path(name).suffix in IGNORED_SUFFIXES:
            ignored.add(name)
    return ignored


def write_provenance(
    bundle_root: Path,
    metadata_head: str,
    metadata_head_time: str,
    changed: list[str],
    manuscripts: dict[str, dict[str, object]],
) -> None:
    payload = {
        "schema": "fiscal_choke_points.archive_provenance.v1",
        "package_id": PACKAGE_ID,
        "release_state": "CANDIDATE_NOT_FOR_PUBLICATION",
        "source_repository": "https://github.com/Spectating101/solarpunk-coin",
        "source_research_branch": "digital-tax/rebuild-2026",
        "source_baseline_commit": SOURCE_BASELINE,
        "archive_metadata_head_commit": metadata_head,
        "archive_metadata_head_commit_time_utc": metadata_head_time,
        "allowed_changes_since_source_baseline": changed,
        "manuscripts": manuscripts,
        "doi_state": "NOT_RESERVED_NOT_PUBLISHED",
        "license_state": "UNRESOLVED_HUMAN_GATE",
        "resource_type_state": "UNRESOLVED_HUMAN_GATE",
        "nonclaims": [
            "not_peer_reviewed_by_archive_action",
            "not_externally_reproduced_by_archive_action",
            "not_causally_validated_by_archive_action",
            "not_venue_accepted_by_archive_action",
        ],
    }
    (bundle_root / "ARCHIVE_PROVENANCE.json").write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def write_checksums(bundle_root: Path) -> None:
    entries = []
    for path in sorted(p for p in bundle_root.rglob("*") if p.is_file()):
        if path.name == "SHA256SUMS.txt":
            continue
        rel = path.relative_to(bundle_root).as_posix()
        entries.append(f"{sha256(path)}  {rel}")
    (bundle_root / "SHA256SUMS.txt").write_text("\n".join(entries) + "\n", encoding="utf-8")


def add_file_deterministically(zf: zipfile.ZipFile, path: Path, arcname: str) -> None:
    info = zipfile.ZipInfo(arcname, date_time=(1980, 1, 1, 0, 0, 0))
    info.compress_type = zipfile.ZIP_DEFLATED
    info.create_system = 3
    mode = 0o755 if path.suffix == ".py" else 0o644
    info.external_attr = mode << 16
    zf.writestr(info, path.read_bytes())


def make_zip(bundle_root: Path, output_zip: Path) -> None:
    with zipfile.ZipFile(output_zip, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for path in sorted(p for p in bundle_root.rglob("*") if p.is_file()):
            rel = path.relative_to(bundle_root.parent).as_posix()
            add_file_deterministically(zf, path, rel)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pdf", required=True, type=Path, help="Path to the frozen reader-facing PDF")
    parser.add_argument("--docx", required=True, type=Path, help="Path to the frozen reader-facing DOCX")
    parser.add_argument("--output-dir", required=True, type=Path, help="Directory for the candidate ZIP and checksum")
    args = parser.parse_args()

    script_path = Path(__file__).resolve()
    repo_root = Path(run_git(script_path.parent, "rev-parse", "--show-toplevel")).resolve()
    research_dir = (repo_root / RESEARCH_REL).resolve()
    output_dir = args.output_dir.resolve()

    if research_dir == output_dir or research_dir in output_dir.parents:
        raise SystemExit("output directory must be outside the research package directory")

    metadata_head, metadata_head_time, changed = verify_source_lock(repo_root)
    pdf = verify_external(args.pdf.resolve(), EXPECTED_MANUSCRIPTS["pdf"])
    docx = verify_external(args.docx.resolve(), EXPECTED_MANUSCRIPTS["docx"])

    output_dir.mkdir(parents=True, exist_ok=True)
    output_zip = output_dir / ZIP_NAME
    output_sha = output_dir / f"{ZIP_NAME}.sha256"

    with tempfile.TemporaryDirectory(prefix="fcp-zenodo-") as tmp:
        stage_parent = Path(tmp)
        bundle_root = stage_parent / BUNDLE_ROOT_NAME
        bundle_root.mkdir()

        manuscript_dir = bundle_root / "manuscript"
        manuscript_dir.mkdir()
        shutil.copy2(args.pdf.resolve(), manuscript_dir / EXPECTED_MANUSCRIPTS["pdf"]["name"])
        shutil.copy2(args.docx.resolve(), manuscript_dir / EXPECTED_MANUSCRIPTS["docx"]["name"])

        shutil.copytree(
            research_dir,
            bundle_root / "research_package",
            ignore=ignore_copy,
            dirs_exist_ok=False,
        )

        write_provenance(
            bundle_root,
            metadata_head,
            metadata_head_time,
            changed,
            {"pdf": pdf, "docx": docx},
        )
        write_checksums(bundle_root)
        make_zip(bundle_root, output_zip)

    zip_hash = sha256(output_zip)
    output_sha.write_text(f"{zip_hash}  {output_zip.name}\n", encoding="utf-8")

    print(json.dumps({
        "state": "CANDIDATE_NOT_FOR_PUBLICATION",
        "package_id": PACKAGE_ID,
        "source_baseline_commit": SOURCE_BASELINE,
        "archive_metadata_head_commit": metadata_head,
        "zip": str(output_zip),
        "zip_sha256": zip_hash,
        "sidecar": str(output_sha),
        "doi_state": "NOT_RESERVED_NOT_PUBLISHED",
        "license_state": "UNRESOLVED_HUMAN_GATE",
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
