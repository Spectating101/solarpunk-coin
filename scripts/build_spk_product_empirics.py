#!/usr/bin/env python3
from __future__ import annotations

import csv
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional


ROOT = Path(__file__).resolve().parents[1]
EMPIRICS = ROOT / "thesis_package" / "empirical_results"
OUT_JSON = ROOT / "state" / "proofs" / "spk_product_empirics.json"
OUT_MD = ROOT / "docs" / "product" / "SPK_PRODUCT_EMPIRICS.md"
KEEPER_SUMMARY = ROOT / "state" / "keeper_logs" / "summary.json"
METER_BUNDLE = ROOT / "state" / "attestations" / "latest_attestation_bundle.json"
VR95_KEY = "Max err @ VR\u226595%"
VR90_KEY = "Max err @ VR\u226590%"
VR80_KEY = "Max err @ VR\u226580%"
SIGMA_KEY = "\u03c3 (%)"


def read_json(path: Path) -> Optional[Dict[str, Any]]:
  if not path.exists():
    return None
  return json.loads(path.read_text(encoding="utf-8"))


def read_csv_rows(path: Path) -> List[Dict[str, str]]:
  with path.open("r", encoding="utf-8", newline="") as handle:
    return list(csv.DictReader(handle))


def first_row(path: Path) -> Dict[str, str]:
  rows = read_csv_rows(path)
  if not rows:
    raise ValueError(f"No rows in {path}")
  return rows[0]


def find_row(path: Path, key: str, value: str) -> Dict[str, str]:
  for row in read_csv_rows(path):
    if row.get(key) == value:
      return row
  raise ValueError(f"No row where {key}={value} in {path}")


def maybe_float(value: Any) -> Optional[float]:
  if value is None:
    return None
  text = str(value).strip().replace("%", "")
  if not text:
    return None
  try:
    return float(text)
  except ValueError:
    return None


def latest_mint_proof() -> Optional[Path]:
  proofs = sorted(
    (ROOT / "state" / "proofs").glob("*_spk_attested_mint_proof.json"),
    key=lambda p: p.stat().st_mtime,
    reverse=True,
  )
  return proofs[0] if proofs else None


def monetary_scores() -> Dict[str, float]:
  rows = read_csv_rows(EMPIRICS / "monetary_scorecard.csv")
  totals = {"Energy": 0.0, "Gold": 0.0, "Fiat": 0.0}
  for row in rows:
    totals["Energy"] += maybe_float(row.get("E_score")) or 0.0
    totals["Gold"] += maybe_float(row.get("G_score")) or 0.0
    totals["Fiat"] += maybe_float(row.get("F_score")) or 0.0
  return totals


def build_payload() -> Dict[str, Any]:
  ceir = first_row(EMPIRICS / "ceir_analysis_summary.csv")
  calibration = find_row(EMPIRICS / "calibration_diagnostics_real.csv", "Method", "thesis_reconstructed")
  taiwan_oracle = find_row(EMPIRICS / "oracle_tolerance.csv", "Location", "Taiwan")
  cross_rows = read_csv_rows(EMPIRICS / "cross_location_pricing.csv")
  taiwan_cross = next(row for row in cross_rows if row.get("Location") == "Taiwan")
  convergence_rows = read_csv_rows(EMPIRICS / "binomial_convergence.csv")
  convergence_last = convergence_rows[-1]
  keeper = read_json(KEEPER_SUMMARY)
  bundle = read_json(METER_BUNDLE)
  proof_path = latest_mint_proof()
  proof = read_json(proof_path) if proof_path else None

  return {
    "generated_at": datetime.now(timezone.utc).isoformat(),
    "product": {
      "name": "SolarPunkCoin (SPK)",
      "claim": "Accepted surplus renewable-energy kWh can mint SPK only through a replay-protected oracle attestation.",
      "primary_contract": "contracts/SolarPunkCoin.sol",
      "primary_function": "mintFromSurplusAttestation",
    },
    "meter_to_mint": {
      "bundle_available": bundle is not None,
      "proof_available": proof is not None,
      "bundle_path": str(METER_BUNDLE.relative_to(ROOT)) if bundle else None,
      "proof_path": str(proof_path.relative_to(ROOT)) if proof_path else None,
      "contract_address": proof.get("contracts", {}).get("SolarPunkCoin") if proof else None,
      "source_schema": bundle.get("source_schema") if bundle else None,
      "batch_id": bundle.get("batch_id") if bundle else None,
      "input_records": bundle.get("summary", {}).get("input_records") if bundle else None,
      "accepted_records": bundle.get("summary", {}).get("accepted_records") if bundle else None,
      "rejected_records": bundle.get("summary", {}).get("rejected_records") if bundle else None,
      "verified_signatures": bundle.get("summary", {}).get("verified_signatures") if bundle else None,
      "registered_meters": bundle.get("summary", {}).get("registered_meters") if bundle else None,
      "total_surplus_kwh": bundle.get("summary", {}).get("total_surplus_kwh") if bundle else None,
      "source_hash": proof.get("source", {}).get("source_hash") if proof else None,
      "attestation_hash": proof.get("attestation", {}).get("attestation_hash") if proof else None,
      "attestation_hash_consumed": proof.get("attestation", {}).get("attestation_hash_consumed") if proof else None,
      "source_hash_consumed": proof.get("attestation", {}).get("source_hash_consumed") if proof else None,
      "minted_spk": proof.get("mint", {}).get("minted_spk") if proof else None,
      "execution_scope": proof.get("execution_scope") if proof else None,
      "tx_hash": proof.get("transaction", {}).get("hash") if proof else None,
    },
    "empirical_basis": {
      "ceir": {
        "pre_ban_n": int(float(ceir["Pre_ban_N"])),
        "post_ban_n": int(float(ceir["Post_ban_N"])),
        "pre_ban_coef": maybe_float(ceir["Pre_ban_CEIR_coef"]),
        "post_ban_coef": maybe_float(ceir["Post_ban_CEIR_coef"]),
        "chow_pvalue": maybe_float(ceir["Chow_pvalue"]),
        "source": "thesis_package/empirical_results/ceir_analysis_summary.csv",
      },
      "physical_calibration": {
        "sigma": maybe_float(calibration["Sigma"]),
        "sigma_percent": calibration["Sigma %"],
        "returns": int(float(calibration["Returns"])),
        "jarque_bera_pvalue": maybe_float(calibration["JB p-value"]),
        "source": "thesis_package/empirical_results/calibration_diagnostics_real.csv",
      },
      "oracle_tolerance": {
        "location": "Taiwan",
        "max_error_vr95": taiwan_oracle[VR95_KEY],
        "max_error_vr90": taiwan_oracle[VR90_KEY],
        "max_error_vr80": taiwan_oracle[VR80_KEY],
        "source": "thesis_package/empirical_results/oracle_tolerance.csv",
      },
      "pricing_validation": {
        "markets": len(cross_rows),
        "taiwan_spot_usd_per_kwh": maybe_float(taiwan_cross["S0 ($/kWh)"]),
        "taiwan_sigma": taiwan_cross[SIGMA_KEY],
        "taiwan_binomial_call": maybe_float(taiwan_cross["Call (Binomial)"]),
        "taiwan_monte_carlo_call": maybe_float(taiwan_cross["Call (MC)"]),
        "taiwan_binomial_vs_mc_diff_percent": maybe_float(taiwan_cross["% Diff (B vs MC)"]),
        "taiwan_initial_margin": maybe_float(taiwan_cross["Initial Margin"]),
        "taiwan_hedge_efficiency_6pct_error": maybe_float(taiwan_cross["Hedge Eff (6% err)"]),
        "binomial_convergence_last_steps": int(float(convergence_last["steps"])),
        "binomial_convergence_last_price": maybe_float(convergence_last["binomial_price"]),
        "source": "thesis_package/empirical_results/cross_location_pricing.csv",
      },
      "monetary_scorecard": {
        "scores": monetary_scores(),
        "source": "thesis_package/empirical_results/monetary_scorecard.csv",
      },
    },
    "operational_basis": {
      "daily_keeper_available": keeper is not None,
      "total_successful_runs": keeper.get("total_successful_runs") if keeper else None,
      "first_successful_run": keeper.get("first_successful_run") if keeper else None,
      "last_successful_run": keeper.get("last_successful_run") if keeper else None,
      "current_success_streak_days": keeper.get("current_success_streak_days") if keeper else None,
      "latest_update_index_tx": keeper.get("latest_run", {}).get("transactions", {}).get("updateIndex") if keeper else None,
      "source": "state/keeper_logs/summary.json",
    },
    "scope_limits": [
      "The older Safe-admin Sepolia deployment predates the signed surplus-attestation mint function; the fresh attested SPK proof deployment is public but not production-governed.",
      "The current sample meter bundle is a deterministic pilot fixture, not a certified hardware meter feed.",
      "The code is locally tested, but no formal external smart-contract audit has been completed.",
      "Legal, utility-interconnection, and commodity/payment classification work remains outside this repository.",
    ],
  }


def fmt(value: Any) -> str:
  if value is None:
    return "n/a"
  if isinstance(value, float):
    if abs(value) < 0.000001 and value != 0:
      return f"{value:.3e}"
    return f"{value:.6g}"
  return str(value)


def write_markdown(payload: Dict[str, Any]) -> None:
  e = payload["empirical_basis"]
  m = payload["meter_to_mint"]
  o = payload["operational_basis"]
  scores = e["monetary_scorecard"]["scores"]

  lines = [
    "# SPK Product Empirics",
    "",
    f"- generated_at: `{payload['generated_at']}`",
    f"- product: `{payload['product']['name']}`",
    f"- primary_contract: `{payload['product']['primary_contract']}`",
    f"- primary_function: `{payload['product']['primary_function']}`",
    "",
    "## Product Claim",
    "",
    "SolarPunkCoin is now framed as a single product: accepted surplus renewable-energy kWh mints SPK through an oracle-signed, replay-protected attestation.",
    "",
    "The narrow product path is:",
    "",
    "1. Meter devices sign raw readings against registered device addresses.",
    "2. `scripts/derive_meter_attestations.js` verifies signatures, duplicate nonces, closed windows, quality thresholds, capacity bounds, and energy balance.",
    "3. `scripts/mint_spk_from_meter_bundle.js` derives the source hash, signs the oracle attestation, and calls `mintFromSurplusAttestation`.",
    "4. `SolarPunkCoin` verifies role, signature, closed measurement window, validity window, source-hash single use, attestation replay status, grid stress, reserve ratio, oracle freshness, supply cap, fee split, and recipient before minting.",
    "",
    "## Executable Product Proof",
    "",
    "| Item | Value |",
    "|---|---:|",
    f"| Bundle available | `{m['bundle_available']}` |",
    f"| Mint proof available | `{m['proof_available']}` |",
    f"| SolarPunkCoin contract | `{m['contract_address']}` |",
    f"| Source schema | `{m['source_schema']}` |",
    f"| Batch ID | `{m['batch_id']}` |",
    f"| Input records | `{m['input_records']}` |",
    f"| Accepted records | `{m['accepted_records']}` |",
    f"| Rejected records | `{m['rejected_records']}` |",
    f"| Verified signatures | `{m['verified_signatures']}` |",
    f"| Registered meters | `{m['registered_meters']}` |",
    f"| Total surplus kWh | `{m['total_surplus_kwh']}` |",
    f"| Minted SPK | `{m['minted_spk']}` |",
    f"| Source hash | `{m['source_hash']}` |",
    f"| Attestation hash | `{m['attestation_hash']}` |",
    f"| Attestation hash consumed | `{m['attestation_hash_consumed']}` |",
    f"| Source hash consumed | `{m['source_hash_consumed']}` |",
    f"| Execution scope | `{m['execution_scope']}` |",
    f"| Transaction hash | `{m['tx_hash']}` |",
    "",
    "## Empirical Basis",
    "",
    "| Evidence pillar | Current result | Why it matters for SPK |",
    "|---|---|---|",
    (
      "| CEIR energy anchor | "
      f"`pre={fmt(e['ceir']['pre_ban_coef'])}`, `post={fmt(e['ceir']['post_ban_coef'])}`, "
      f"`Chow p={fmt(e['ceir']['chow_pvalue'])}` | "
      "Supports the thesis that energy cost carries measurable information in proof-of-work monetary systems. |"
    ),
    (
      "| Physical calibration | "
      f"`sigma={e['physical_calibration']['sigma_percent']}`, "
      f"`JB p={fmt(e['physical_calibration']['jarque_bera_pvalue'])}`, "
      f"`returns={e['physical_calibration']['returns']}` | "
      "Shows the energy-data process can be parameterized from real irradiance observations rather than pure assumptions. |"
    ),
    (
      "| Oracle tolerance | "
      f"`Taiwan VR>=95% max error={e['oracle_tolerance']['max_error_vr95']}` | "
      "Defines how much source-data error the economics can tolerate before risk controls fail. |"
    ),
    (
      "| Pricing validation | "
      f"`{e['pricing_validation']['markets']} markets`, "
      f"`Taiwan binomial/MC diff={fmt(e['pricing_validation']['taiwan_binomial_vs_mc_diff_percent'])}%`, "
      f"`hedge eff={fmt(e['pricing_validation']['taiwan_hedge_efficiency_6pct_error'])}` | "
      "Shows the pricing layer is not a one-location toy and converges across methods. |"
    ),
    (
      "| Monetary scorecard | "
      f"`Energy={fmt(scores['Energy'])}`, `Gold={fmt(scores['Gold'])}`, `Fiat={fmt(scores['Fiat'])}` | "
      "Explains why the product is energy-minted money, not just another collateral wrapper. |"
    ),
    (
      "| Daily live-data keeper | "
      f"`runs={o['total_successful_runs']}`, `latest={o['last_successful_run']}` | "
      "Demonstrates recurring real-data ingestion and public transaction artifacts on Sepolia. |"
    ),
    "",
    "## Product Interpretation",
    "",
    "The repo now supports one coherent story: SPK is a crypto coin minted from verified surplus renewable energy, with monetary logic, oracle controls, reserve controls, and empirical energy-pricing research around that one minting claim.",
    "",
    "The revenue-floor and option code remain useful, but they are supporting modules: they stress-test, hedge, and commercialize the same energy-price basis. They are no longer the primary product claim.",
    "",
    "## Reproduce",
    "",
    "```bash",
    "npm run attestations:fixture",
    "npm run attestations:build",
    "npm run proof:spk-attested-mint",
    "npm run product:empirics",
    "npx hardhat test",
    "```",
    "",
    "## Scope Limits",
    "",
  ]

  for item in payload["scope_limits"]:
    lines.append(f"- {item}")
  lines.append("")

  OUT_MD.parent.mkdir(parents=True, exist_ok=True)
  OUT_MD.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
  payload = build_payload()
  OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
  OUT_JSON.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
  write_markdown(payload)
  print(f"wrote: {OUT_JSON}")
  print(f"wrote: {OUT_MD}")
  return 0


if __name__ == "__main__":
  raise SystemExit(main())
