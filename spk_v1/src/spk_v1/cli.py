from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from spk_v1.service import (
    default_repo_root,
    get_metrics_summary,
    run_export_evidence,
    run_export_lake,
    run_foundation_export,
    run_sync,
    run_sync_and_foundation,
)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="spk-v1", description="SPK v1 runtime library CLI")
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument(
        "--repo-root",
        type=Path,
        default=None,
        help="Solarpunk-bitcoin repo root (default: SPK_V1_REPO_ROOT or auto-detect)",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    sync = sub.add_parser("sync", parents=[common], help="Sync runtime from Sepolia")
    sync.add_argument("--rpc-url", default=None)
    sync.set_defaults(func="sync")

    sub.add_parser("export-evidence", parents=[common], help="Write thesis_package/SPK_V1_EVIDENCE.md").set_defaults(
        func="export-evidence"
    )

    sub.add_parser("foundation", parents=[common], help="Export docs/foundation/FOUNDATION_STATUS.md").set_defaults(
        func="foundation"
    )

    foundation_sync = sub.add_parser(
        "foundation-sync", parents=[common], help="Sync Sepolia runtime and export foundation status"
    )
    foundation_sync.add_argument("--rpc-url", default=None)
    foundation_sync.set_defaults(func="foundation-sync")

    lake = sub.add_parser("export-lake", parents=[common], help="Export data_lake/spk_v1 bundle for research repos")
    lake.add_argument("--out-root", type=Path, required=True)
    lake.set_defaults(func="export-lake")

    sub.add_parser("show-metrics", parents=[common], help="Print runtime metrics JSON").set_defaults(func="show-metrics")
    return parser


def _repo_root(args: argparse.Namespace) -> Path:
    return Path(args.repo_root) if args.repo_root else default_repo_root()


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    root = _repo_root(args)
    try:
        if args.func == "sync":
            result = run_sync(root, rpc_url=args.rpc_url)
            print("spk_v1_runtime_synced")
            print(f"payments_indexed={result.get('payments_indexed')}")
        elif args.func == "export-evidence":
            result = run_export_evidence(root)
            print(f"wrote {result['path']}")
        elif args.func == "foundation":
            result = run_foundation_export(root)
            print(f"wrote {result['status_md']}")
        elif args.func == "foundation-sync":
            result = run_sync_and_foundation(root, rpc_url=args.rpc_url)
            print("spk_v1_foundation_synced")
            print(f"payments_indexed={result.get('payments_indexed')}")
            print(f"wrote {result.get('status_md')}")
        elif args.func == "export-lake":
            print(json.dumps(run_export_lake(root, out_root=args.out_root), indent=2))
        elif args.func == "show-metrics":
            print(json.dumps(get_metrics_summary(root), indent=2))
        else:
            raise RuntimeError(f"unknown command: {args.func}")
        return 0
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
