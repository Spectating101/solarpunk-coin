#!/usr/bin/env python3
"""Monte Carlo redemption queue stress — exploration Tier C (P3)."""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from typing import Any

import numpy as np


@dataclass
class RedemptionStressParams:
    num_paths: int = 5000
    horizon_days: int = 90
    mean_daily_redemptions: float = 8.0
    mean_kwh_per_redemption: float = 25.0
    delivery_capacity_kwh_per_day: float = 200.0
    reserve_kwh_buffer: float = 0.0
    capacity_shock_prob: float = 0.05
    capacity_shock_factor: float = 0.4
    dispute_prob_on_shortfall: float = 0.35
    seed: int = 42


@dataclass
class RedemptionStressResult:
    scenario: str
    label: str
    params: dict[str, Any]
    paths_with_shortfall: int
    paths_with_dispute: int
    shortfall_rate: float
    dispute_rate: float
    mean_unfilled_kwh_per_path: float
    p95_unfilled_kwh: float
    pass_shortfall_under_15pct: bool
    pass_dispute_under_10pct: bool
    overall_pass: bool
    note: str


SCENARIOS: dict[str, tuple[str, RedemptionStressParams]] = {
    "pilot_current": (
        "Pilot ops — tight capacity, shock-prone (expected fail)",
        RedemptionStressParams(),
    ),
    "operator_target": (
        "Target operator — higher daily delivery + modest reserve buffer",
        RedemptionStressParams(
            delivery_capacity_kwh_per_day=320.0,
            reserve_kwh_buffer=500.0,
            mean_daily_redemptions=6.0,
            capacity_shock_prob=0.03,
            capacity_shock_factor=0.55,
        ),
    ),
    "stablecoin_gate": (
        "Horizon C gate — high capacity, low shocks, reserve headroom",
        RedemptionStressParams(
            delivery_capacity_kwh_per_day=450.0,
            reserve_kwh_buffer=2000.0,
            mean_daily_redemptions=5.0,
            capacity_shock_prob=0.01,
            capacity_shock_factor=0.7,
            dispute_prob_on_shortfall=0.15,
        ),
    ),
}


def run_redemption_stress(
    params: RedemptionStressParams | None = None,
    *,
    scenario: str = "custom",
    label: str = "Custom parameters",
) -> RedemptionStressResult:
    p = params or RedemptionStressParams()
    rng = np.random.default_rng(p.seed)

    paths_shortfall = 0
    paths_dispute = 0
    unfilled_totals: list[float] = []

    for _ in range(p.num_paths):
        backlog = 0.0
        reserve = p.reserve_kwh_buffer
        had_shortfall = False
        had_dispute = False

        for _day in range(p.horizon_days):
            base_cap = p.delivery_capacity_kwh_per_day
            if rng.random() < p.capacity_shock_prob:
                base_cap *= p.capacity_shock_factor

            n_redemptions = max(0, int(rng.poisson(p.mean_daily_redemptions)))
            backlog += n_redemptions * p.mean_kwh_per_redemption

            deliverable = base_cap + reserve
            delivered = min(backlog, deliverable)
            backlog -= delivered
            reserve = max(0.0, reserve - max(0.0, delivered - base_cap))

            if backlog > 1e-6:
                had_shortfall = True
                if rng.random() < p.dispute_prob_on_shortfall:
                    had_dispute = True

        unfilled_totals.append(backlog)
        if had_shortfall:
            paths_shortfall += 1
        if had_dispute:
            paths_dispute += 1

    shortfall_rate = paths_shortfall / p.num_paths
    dispute_rate = paths_dispute / p.num_paths
    p95_unfilled = float(np.percentile(unfilled_totals, 95))

    pass_shortfall = shortfall_rate < 0.15
    pass_dispute = dispute_rate < 0.10
    overall = pass_shortfall and pass_dispute

    return RedemptionStressResult(
        scenario=scenario,
        label=label,
        params=asdict(p),
        paths_with_shortfall=paths_shortfall,
        paths_with_dispute=paths_dispute,
        shortfall_rate=round(shortfall_rate, 4),
        dispute_rate=round(dispute_rate, 4),
        mean_unfilled_kwh_per_path=round(float(np.mean(unfilled_totals)), 2),
        p95_unfilled_kwh=round(p95_unfilled, 2),
        pass_shortfall_under_15pct=pass_shortfall,
        pass_dispute_under_10pct=pass_dispute,
        overall_pass=overall,
        note=(
            "Gates: <15% paths with backlog shortfall, <10% with dispute. "
            "Pilot fail is informative; operator_target / stablecoin_gate show what policy must achieve."
        ),
    )


def run_all_scenarios(seed: int = 42) -> list[RedemptionStressResult]:
    results: list[RedemptionStressResult] = []
    for name, (label, params) in SCENARIOS.items():
        p = RedemptionStressParams(**{**asdict(params), "seed": seed})
        results.append(run_redemption_stress(p, scenario=name, label=label))
    return results


def main() -> int:
    results = run_all_scenarios()
    payload = {
        "scenarios": [asdict(r) for r in results],
        "any_pass": any(r.overall_pass for r in results),
        "stablecoin_gate_pass": next(
            (r.overall_pass for r in results if r.scenario == "stablecoin_gate"),
            False,
        ),
    }
    print(json.dumps(payload, indent=2))
    return 0 if payload["stablecoin_gate_pass"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
