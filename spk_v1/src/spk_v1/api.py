from __future__ import annotations

import os
import secrets
from pathlib import Path
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from spk_v1 import __version__
from spk_v1.service import (
    default_repo_root,
    get_counterparties,
    get_foundation_snapshot,
    get_metrics_summary,
    get_operator_health,
    get_runtime,
    list_payments,
    run_export_evidence,
    run_export_lake,
    run_foundation_export,
    run_sync,
    run_sync_and_foundation,
    run_validate_runtime,
)


def require_operator_token(request: Request) -> None:
    expected = os.environ.get("SPK_V1_API_TOKEN", "")
    if not expected:
        raise HTTPException(
            status_code=503, detail="Operator mutations are disabled; configure SPK_V1_API_TOKEN."
        )
    supplied = request.headers.get("authorization", "")
    if not supplied.startswith("Bearer ") or not secrets.compare_digest(
        supplied[7:].encode("utf-8"), expected.encode("utf-8")
    ):
        raise HTTPException(status_code=401, detail="Valid operator bearer token required")


def checked_rpc_url(rpc_url: str | None) -> str | None:
    if rpc_url is None:
        return None
    configured = (
        os.environ.get("SEPOLIA_RPC")
        or os.environ.get("SEPOLIA_RPC_URL")
        or "https://ethereum-sepolia-rpc.publicnode.com"
    )
    allowed = {
        configured,
        *filter(
            None, (x.strip() for x in os.environ.get("SPK_V1_API_RPC_ALLOWLIST", "").split(","))
        ),
    }
    if rpc_url not in allowed:
        raise HTTPException(
            status_code=422, detail="RPC URL is not in the operator-configured allowlist"
        )
    return rpc_url


def checked_export_root(out_root: str) -> Path:
    base = Path(
        os.environ.get("SPK_V1_API_EXPORT_ROOT", str(default_repo_root() / "state" / "exports"))
    ).resolve()
    candidate = Path(out_root)
    try:
        destination = (candidate if candidate.is_absolute() else base / candidate).resolve()
    except (ValueError, OSError, RuntimeError) as exc:
        raise HTTPException(status_code=422, detail="Invalid export directory") from exc
    if not destination.is_relative_to(base):
        raise HTTPException(
            status_code=422, detail="Export directory must be inside SPK_V1_API_EXPORT_ROOT"
        )
    return destination


app = FastAPI(
    title="SPK v1 Backend API",
    description="Local HTTP surface over the spk-v1 library (runtime, metrics, payments, sync).",
    version=__version__,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://127.0.0.1:4173",
        "http://localhost:4173",
    ],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class LakeExportRequest(BaseModel):
    out_root: str = Field(
        ..., min_length=1, description="Directory within the operator-configured export root"
    )


class SyncResponse(BaseModel):
    ok: bool
    payments_indexed: int | None = None
    synced_at: str | None = None
    total_supply_spk: float | None = None


@app.get("/health")
def health(
    request: Request,
    live: bool = Query(False, description="Fetch live operator gas via Sepolia RPC"),
) -> dict[str, Any]:
    if live:
        require_operator_token(request)
    root = default_repo_root()
    payload: dict[str, Any] = {
        "ok": True,
        "service": "spk-v1",
        "version": __version__,
        "repo_root": str(root),
        "repo_root_exists": root.exists(),
    }
    try:
        operator = get_operator_health(root, live=live)
        payload["operator"] = operator
        payload["ok"] = bool(operator.get("ok", False))
    except FileNotFoundError:
        payload["ok"] = False
        payload["operator"] = None
    except ConnectionError as exc:
        payload["ok"] = False
        payload["operator_error"] = str(exc)
    return payload


@app.get("/v1/runtime")
def runtime_endpoint() -> dict[str, Any]:
    try:
        return get_runtime()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get("/v1/metrics")
def metrics_endpoint() -> dict[str, Any]:
    try:
        return get_metrics_summary()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get("/v1/payments")
def payments_endpoint(
    limit: int = Query(50, ge=1, le=500),
    payment_kind: str | None = Query(None),
) -> dict[str, Any]:
    try:
        return list_payments(limit=limit, payment_kind=payment_kind)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.post("/v1/sync", response_model=SyncResponse, dependencies=[Depends(require_operator_token)])
def sync_endpoint(rpc_url: str | None = Query(None)) -> dict[str, Any]:
    try:
        return run_sync(rpc_url=checked_rpc_url(rpc_url))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ConnectionError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/v1/counterparties")
def counterparties_endpoint() -> dict[str, Any]:
    try:
        return get_counterparties()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get("/v1/operator/health")
def operator_health_endpoint(
    request: Request,
    live: bool = Query(False),
    rpc_url: str | None = Query(None),
) -> dict[str, Any]:
    if live:
        require_operator_token(request)
    try:
        return get_operator_health(rpc_url=checked_rpc_url(rpc_url), live=live)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ConnectionError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@app.get("/v1/validate")
def validate_endpoint(check_foundation: bool = Query(True)) -> dict[str, Any]:
    try:
        result = run_validate_runtime(check_foundation=check_foundation)
        if not result.get("ok"):
            raise HTTPException(status_code=422, detail=result)
        return result
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get("/v1/foundation")
def foundation_endpoint() -> dict[str, Any]:
    try:
        return get_foundation_snapshot()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.post("/v1/foundation/export", dependencies=[Depends(require_operator_token)])
def foundation_export_endpoint() -> dict[str, Any]:
    try:
        return run_foundation_export()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.post("/v1/foundation/sync", dependencies=[Depends(require_operator_token)])
def foundation_sync_endpoint(rpc_url: str | None = Query(None)) -> dict[str, Any]:
    try:
        return run_sync_and_foundation(rpc_url=checked_rpc_url(rpc_url))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ConnectionError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/v1/export/evidence", dependencies=[Depends(require_operator_token)])
def export_evidence_endpoint() -> dict[str, Any]:
    try:
        return run_export_evidence()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.post("/v1/export/lake", dependencies=[Depends(require_operator_token)])
def export_lake_endpoint(body: LakeExportRequest) -> dict[str, Any]:
    try:
        return run_export_lake(out_root=checked_export_root(body.out_root))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


def main() -> None:
    import uvicorn

    host = os.environ.get("SPK_V1_API_HOST", "127.0.0.1")
    if host not in {"127.0.0.1", "localhost", "::1"} and not os.environ.get("SPK_V1_API_TOKEN"):
        raise RuntimeError("Non-loopback binding requires SPK_V1_API_TOKEN")
    port = int(os.environ.get("SPK_V1_API_PORT", "8787"))
    uvicorn.run("spk_v1.api:app", host=host, port=port, reload=False)


if __name__ == "__main__":
    main()
