#!/usr/bin/env python3
"""
Generate empirical thesis figures from repo CSV artifacts.

Outputs PNGs under thesis_package/empirical_results/figures/
Run: python thesis_package/generate_thesis_figures.py
"""

from __future__ import annotations

import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

PKG = Path(__file__).resolve().parent
ROOT = PKG.parent
RESULTS = PKG / "empirical_results"
FIGURES = RESULTS / "figures"
RUNTIME = ROOT / "state" / "runtime" / "spk_v1.json"

plt.rcParams.update(
    {
        "figure.dpi": 150,
        "font.family": "serif",
        "font.size": 10,
        "axes.titlesize": 11,
        "axes.labelsize": 10,
    }
)


def _save(fig: plt.Figure, name: str) -> Path:
    FIGURES.mkdir(parents=True, exist_ok=True)
    out = FIGURES / name
    fig.tight_layout()
    fig.savefig(out, bbox_inches="tight")
    plt.close(fig)
    return out


def figure_ceir_timeline() -> Path:
    df = pd.read_csv(RESULTS / "bitcoin_ceir_analysis_ready.csv", parse_dates=["Date"])
    df = df[df["in_analysis_period"] == 1].sort_values("Date")
    ban = pd.Timestamp("2021-06-20")

    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(7, 5), sharex=True, height_ratios=[1.2, 1])
    ax1.plot(df["Date"], df["log_CEIR"], linewidth=0.8, color="tab:blue")
    ax1.axvline(ban, color="tab:red", linestyle="--", linewidth=1, label="China mining-ban window")
    ax1.set_ylabel("log(CEIR)")
    ax1.set_title("CEIR level and forward returns around mining-ban regime shift")
    ax1.legend(loc="upper left", fontsize=8)
    ax1.grid(True, alpha=0.25)

    ax2.plot(df["Date"], df["Returns_forward"] * 100, linewidth=0.5, color="0.35", alpha=0.8)
    ax2.axvline(ban, color="tab:red", linestyle="--", linewidth=1)
    ax2.set_ylabel("Forward 30d return (%)")
    ax2.set_xlabel("Date")
    ax2.grid(True, alpha=0.25)
    return _save(fig, "ceir_timeline.png")


def figure_ceir_forward_returns() -> Path:
    df = pd.read_csv(RESULTS / "bitcoin_ceir_analysis_ready.csv")
    df = df[df["in_analysis_period"] == 1].copy()
    pre = df[df["post_china_ban"] == 0].dropna(subset=["log_CEIR", "Returns_forward"])

    pre = pre.copy()
    pre["ceir_bin"] = pd.qcut(pre["log_CEIR"], 10, duplicates="drop")
    grouped = pre.groupby("ceir_bin", observed=True).agg(
        log_ceir=("log_CEIR", "mean"),
        fwd_ret=("Returns_forward", "mean"),
        n=("Returns_forward", "count"),
    )

    fig, ax = plt.subplots(figsize=(6.5, 4))
    ax.scatter(grouped["log_ceir"], grouped["fwd_ret"] * 100, s=grouped["n"] * 2, alpha=0.75)
    z = np.polyfit(grouped["log_ceir"], grouped["fwd_ret"] * 100, 1)
    xs = np.linspace(grouped["log_ceir"].min(), grouped["log_ceir"].max(), 50)
    ax.plot(xs, np.poly1d(z)(xs), linestyle="--", linewidth=1.2, color="tab:red")
    ax.axhline(0, color="0.7", linewidth=0.8)
    ax.set_xlabel("log(CEIR) — binned pre-ban mean")
    ax.set_ylabel("Forward 30-day return (%) — bin mean")
    ax.set_title("CEIR and forward returns (pre-ban deciles)")
    ax.text(
        0.02,
        0.02,
        "Illustrative bins; preferred inference uses level regression\n"
        "with winsor, trend, HAC(30) (see Table 3.3).",
        transform=ax.transAxes,
        fontsize=8,
        va="bottom",
        bbox=dict(boxstyle="round", facecolor="white", alpha=0.8),
    )
    return _save(fig, "ceir_forward_returns.png")


def figure_binomial_convergence() -> Path:
    conv = pd.read_csv(RESULTS / "binomial_convergence.csv")
    fig, ax = plt.subplots(figsize=(6, 4))
    ax.plot(conv["steps"], conv["binomial_price"], marker="o", linewidth=1.5)
    ax.set_xlabel("Binomial steps (N)")
    ax.set_ylabel("ATM call price ($/kWh)")
    ax.set_title("Binomial convergence — Taiwan base case")
    ax.grid(True, alpha=0.3)
    return _save(fig, "binomial_convergence.png")


def figure_cross_location_pricing() -> Path:
    xl = pd.read_csv(RESULTS / "cross_location_pricing.csv")
    locs = xl["Location"].tolist()
    x = np.arange(len(locs))
    width = 0.35
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.bar(x - width / 2, xl["Call (Binomial)"], width, label="Binomial")
    ax.bar(x + width / 2, xl["Call (MC)"], width, label="Monte Carlo")
    ax.set_xticks(x)
    ax.set_xticklabels(locs, rotation=20, ha="right")
    ax.set_ylabel("ATM call value ($/kWh)")
    ax.set_title("Cross-location pricing comparison (K = S₀ per site)")
    ax.legend()
    ax.grid(axis="y", alpha=0.3)
    return _save(fig, "cross_location_pricing.png")


def figure_trading_rule_comparison() -> Path:
    trading_path = RESULTS / "ceir_trading_rule_summary.json"
    trading = json.loads(trading_path.read_text())
    labels = ["CEIR rule", "Buy & hold"]
    returns = [
        trading["total_return_strategy_pct"],
        trading["total_return_buyhold_pct"],
    ]
    colors = ["tab:orange", "tab:blue"]
    fig, ax = plt.subplots(figsize=(5.5, 4))
    bars = ax.bar(labels, returns, color=colors)
    ax.set_ylabel("Total return (%) — sample period")
    ax.set_title("Trading-rule underperformance vs buy-and-hold")
    ax.axhline(0, color="0.4", linewidth=0.8)
    for bar, val in zip(bars, returns):
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            bar.get_height() + (30 if val > 0 else -80),
            f"{val:+.1f}%",
            ha="center",
            fontsize=9,
        )
    ax.text(
        0.5,
        0.02,
        f"Sharpe: CEIR {trading['sharpe_strategy']:.2f} vs buy-and-hold {trading['sharpe_buyhold']:.2f}",
        transform=ax.transAxes,
        ha="center",
        fontsize=8,
    )
    return _save(fig, "trading_rule_comparison.png")


def figure_margin_stress() -> Path:
    margin = pd.read_csv(RESULTS / "margin_stress_table.csv")
    taiwan = margin[margin["S0"] == 0.0525]
    fig, ax = plt.subplots(figsize=(5.5, 4))
    ax.plot(taiwan["sigma"], taiwan["Initial_margin_1.5x"], marker="o")
    ax.set_xlabel("Volatility σ")
    ax.set_ylabel("Initial margin ($/kWh, 1.5× VaR₉₉)")
    ax.set_title("Margin stress — Taiwan S₀ = $0.0525/kWh")
    ax.grid(True, alpha=0.3)
    return _save(fig, "margin_stress_taiwan.png")


def _flow_boxes(
    ax: plt.Axes,
    boxes: list[tuple[float, float, str]],
    *,
    y: float = 0.55,
    width: float = 0.16,
    height: float = 0.28,
    fontsize: int = 8,
) -> None:
    from matplotlib.patches import FancyBboxPatch

    xs = [b[0] for b in boxes]
    for i, (x, _, text) in enumerate(boxes):
        patch = FancyBboxPatch(
            (x, y),
            width,
            height,
            boxstyle="round,pad=0.02,rounding_size=0.02",
            linewidth=1.0,
            edgecolor="0.35",
            facecolor="#f5f8fc",
        )
        ax.add_patch(patch)
        ax.text(
            x + width / 2,
            y + height / 2,
            text,
            ha="center",
            va="center",
            fontsize=fontsize,
            wrap=True,
        )
        if i < len(boxes) - 1:
            x0 = x + width
            x1 = boxes[i + 1][0]
            ax.annotate(
                "",
                xy=(x1, y + height / 2),
                xytext=(x0, y + height / 2),
                arrowprops=dict(arrowstyle="->", color="0.45", lw=1.2),
            )


def figure_thesis_evidence_path() -> Path:
    fig, ax = plt.subplots(figsize=(8.5, 2.6))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")
    _flow_boxes(
        ax,
        [
            (0.04, 0, "Ch 3\nBitcoin CEIR\n(conditional empirics)"),
            (0.36, 0, "Ch 4\nRenewable pricing\n& oracle tolerance"),
            (0.68, 0, "Ch 5\nFive constraints\n+ SPK v1 POC"),
        ],
        y=0.42,
        width=0.22,
    )
    ax.text(
        0.5,
        0.88,
        "Thesis evidence path (Ch 1 §1.4)",
        ha="center",
        fontsize=11,
        fontweight="bold",
    )
    ax.text(
        0.5,
        0.12,
        "Sequence: market behaviour → financial risk → enforceable rules (not three separate projects)",
        ha="center",
        fontsize=8,
        color="0.35",
    )
    return _save(fig, "thesis_evidence_path.png")


def figure_five_constraints_flow() -> Path:
    fig, ax = plt.subplots(figsize=(8.5, 2.4))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")
    labels = [
        "1. Reliable\nenergy data",
        "2. Rule-bound\nissuance",
        "3. Explicit\npricing",
        "4. Protected\nsettlement",
        "5. Limited\ngovernance",
    ]
    n = len(labels)
    width = 0.16
    gap = (0.92 - n * width) / (n - 1)
    x = 0.04
    boxes = []
    for label in labels:
        boxes.append((x, 0, label))
        x += width + gap
    _flow_boxes(ax, boxes, y=0.38, width=width, height=0.32, fontsize=7.5)
    ax.text(
        0.5,
        0.88,
        "Five-constraint architecture (integrated — not optional add-ons)",
        ha="center",
        fontsize=11,
        fontweight="bold",
    )
    return _save(fig, "five_constraints_flow.png")


def figure_ceir_coef_pre_post() -> Path:
    summary = pd.read_csv(RESULTS / "ceir_analysis_summary.csv")
    row = summary.iloc[0]
    labels = ["Pre-ban", "Post-ban"]
    coefs = [row["Pre_ban_CEIR_coef"], row["Post_ban_CEIR_coef"]]
    colors = ["tab:blue", "tab:gray"]
    fig, ax = plt.subplots(figsize=(6.0, 4.2))
    bars = ax.bar(labels, coefs, color=colors, width=0.52)
    ax.axhline(0, color="0.5", linewidth=0.8)
    ax.set_ylabel("Coefficient on log(CEIR)")
    ax.set_title("Preferred level specification — regime split (Table 3.7)", pad=12)
    ymin = min(coefs) - 0.12
    ymax = max(0.06, max(coefs) + 0.08)
    ax.set_ylim(ymin, ymax)
    ax.tick_params(axis="x", pad=6)
    for bar, val, p in zip(
        bars,
        coefs,
        [row["Pre_ban_p_hac"], row["Post_ban_p_hac"]],
    ):
        sig = "p < 0.001" if p < 0.001 else (f"p = {p:.2f}" if p >= 0.01 else f"p = {p:.3f}")
        if val < 0:
            coef_y = val - 0.02
            sig_y = val - 0.06
            va_coef, va_sig = "top", "top"
        else:
            coef_y = val + 0.015
            sig_y = val + 0.05
            va_coef, va_sig = "bottom", "bottom"
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            coef_y,
            f"{val:.3f}",
            ha="center",
            va=va_coef,
            fontsize=10,
            fontweight="bold",
        )
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            sig_y,
            sig,
            ha="center",
            va=va_sig,
            fontsize=8,
        )
    fig.subplots_adjust(bottom=0.14, top=0.86)
    return _save(fig, "ceir_coef_pre_post.png")


def figure_oracle_tolerance_bars() -> Path:
    oracle = pd.read_csv(RESULTS / "oracle_tolerance.csv")
    oracle["max_err"] = (
        oracle["Max err @ VR≥95%"].astype(str).str.replace("%", "", regex=False).astype(float)
    )
    fig, ax = plt.subplots(figsize=(6.5, 4))
    colors = ["tab:red" if v > 15 else "tab:green" for v in oracle["max_err"]]
    ax.barh(oracle["Location"], oracle["max_err"], color=colors)
    ax.set_xlabel("Max oracle error (%) for variance reduction ≥ 95%")
    ax.set_title("Oracle tolerance by location (Table 4.3)")
    ax.axvline(15, color="0.5", linestyle="--", linewidth=1, label="15% reference")
    ax.legend(loc="lower right", fontsize=8)
    ax.invert_yaxis()
    ax.grid(axis="x", alpha=0.25)
    return _save(fig, "oracle_tolerance_bars.png")


def figure_mint_attestation_flow() -> Path:
    fig, ax = plt.subplots(figsize=(9, 2.8))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")
    steps = [
        "Meter /\ninverter export",
        "Verifier\n(signatures,\nquality)",
        "Source\nhash",
        "Oracle\nattestation",
        "Contract\nmint",
        "SPK\nbalance",
    ]
    n = len(steps)
    width = 0.13
    gap = (0.94 - n * width) / (n - 1)
    x = 0.03
    boxes = []
    for s in steps:
        boxes.append((x, 0, s))
        x += width + gap
    _flow_boxes(ax, boxes, y=0.35, width=width, height=0.38, fontsize=7)
    ax.text(0.5, 0.88, "Attested mint path (Ch 5 §5.3–5.4)", ha="center", fontsize=11, fontweight="bold")
    ax.text(
        0.5,
        0.08,
        "Source hash + attestation hash consumed on-chain (replay protection)",
        ha="center",
        fontsize=8,
        color="0.35",
    )
    return _save(fig, "mint_attestation_flow.png")


def figure_spk_circulation_share() -> Path:
    metrics = {"Settled": 442.0, "Redeemed": 15.0, "Other supply": 5042.0}
    if RUNTIME.exists():
        data = json.loads(RUNTIME.read_text(encoding="utf-8"))
        g = data.get("genesis", {}).get("metrics", {})
        settled = float(g.get("total_settled_spk", 442))
        redeemed = float(g.get("total_redeemed_spk", 15))
        supply = float(data.get("on_chain", {}).get("total_supply_spk", 5499))
        other = max(supply - settled - redeemed, 0)
        metrics = {"Settled (network pay)": settled, "Redeemed": redeemed, "Held / unallocated": other}
    fig, ax = plt.subplots(figsize=(5.5, 4))
    ax.pie(
        metrics.values(),
        labels=[f"{k}\n{v:,.0f} SPK" for k, v in metrics.items()],
        autopct="%1.1f%%",
        startangle=90,
        colors=["#4c78a8", "#f58518", "#e0e0e0"],
        textprops={"fontsize": 8},
    )
    ax.set_title("SPK v1 on-chain activity mix (Sepolia, synced runtime)")
    return _save(fig, "spk_circulation_share.png")


def figure_launch_gate_stages() -> Path:
    stages = ["Public lab", "Closed pilot", "Paid / mainnet"]
    status = [1, 0, 0]  # 1 = launchable / pass, 0 = blocked
    colors = ["#2ca02c" if s else "#d62728" for s in status]
    fig, ax = plt.subplots(figsize=(6, 3.5))
    ax.barh(stages, [1, 1, 1], color=colors, height=0.55)
    ax.set_xlim(0, 1.2)
    ax.set_xticks([])
    ax.set_title("Launch-gate staging (Ch 5 §5.7)")
    for i, (stage, ok) in enumerate(zip(stages, status)):
        ax.text(0.5, i, "Launchable" if ok else "Blocked", ha="center", va="center", color="white", fontsize=10)
    ax.text(0.5, -0.55, "Blocked stages need operator data, governance, audit, legal scope", ha="center", fontsize=8)
    return _save(fig, "launch_gate_stages.png")


def figure_production_vs_consumption() -> Path:
    fig, ax = plt.subplots(figsize=(7, 3.2))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis("off")

    def panel(x, title, lines, facecolor):
        from matplotlib.patches import FancyBboxPatch

        patch = FancyBboxPatch(
            (x, 2),
            4.2,
            6,
            boxstyle="round,pad=0.03",
            linewidth=1.2,
            edgecolor="0.35",
            facecolor=facecolor,
        )
        ax.add_patch(patch)
        ax.text(x + 2.1, 7.2, title, ha="center", fontsize=10, fontweight="bold")
        for i, line in enumerate(lines):
            ax.text(x + 0.25, 6.2 - i * 0.9, f"• {line}", fontsize=8, va="top")

    panel(
        0.5,
        "Bitcoin / CEIR (Ch 3)",
        [
            "Energy via mining consumption",
            "Passive market coordination",
            "Regime breaks post-ban",
            "Motivates designed rules",
        ],
        "#fff4e6",
    )
    panel(
        5.3,
        "SPK v1 (Ch 5)",
        [
            "Energy via surplus production",
            "Rule-bound issuance + attestation",
            "Circulation-first testnet",
            "Feasibility, not production",
        ],
        "#e8f4ea",
    )
    ax.text(5, 0.6, "Architectural contrast — not the same energy sign", ha="center", fontsize=9, color="0.35")
    return _save(fig, "production_vs_consumption.png")


def figure_ceir_distribution_by_regime() -> Path:
    df = pd.read_csv(RESULTS / "bitcoin_ceir_analysis_ready.csv", parse_dates=["Date"])
    df = df[df.get("in_analysis_period", 1) == 1].copy()
    pre = df[df["post_china_ban"] == 0]["log_CEIR"].astype(float)
    post = df[df["post_china_ban"] == 1]["log_CEIR"].astype(float)
    fig, ax = plt.subplots(figsize=(6.5, 4))
    ax.hist(pre, bins=40, alpha=0.6, label=f"Pre-ban (n={len(pre)})", color="tab:blue", density=True)
    ax.hist(post, bins=40, alpha=0.6, label=f"Post-ban (n={len(post)})", color="tab:gray", density=True)
    ax.set_xlabel("log(CEIR)")
    ax.set_ylabel("Density")
    ax.set_title("log(CEIR) distribution by regime (Table 3.5)")
    ax.legend(fontsize=8)
    ax.grid(axis="y", alpha=0.25)
    return _save(fig, "ceir_distribution_by_regime.png")


def figure_table_2_1_visual() -> Path:
    col_labels = ["System", "Main constraint", "Main strength", "Main failure mode"]
    cell_text = [
        [
            "Gold-backed",
            "Physical scarcity;\nredemption",
            "Hard to create gold\nfrom nothing",
            "Custody, verification,\nredemption pressure",
        ],
        [
            "Fiat",
            "Institutional\ncredibility",
            "Flexible;\noperationally scalable",
            "Discretion;\npolicy trust",
        ],
        [
            "Bitcoin",
            "Code supply +\nproof-of-work",
            "Transparent scarcity;\nreal mining cost",
            "Indirect energy link;\nmarket demand",
        ],
        [
            "Energy-linked\ndigital finance",
            "Data + issuance +\npricing + settlement +\ngovernance",
            "Link to real\nproduction",
            "Verify data, price risk,\nlimit discretion",
        ],
    ]
    fig, ax = plt.subplots(figsize=(9, 3.6))
    ax.axis("off")
    table = ax.table(
        cellText=cell_text,
        colLabels=col_labels,
        loc="center",
        cellLoc="left",
    )
    table.auto_set_font_size(False)
    table.set_fontsize(7.5)
    table.scale(1, 2.2)
    for (row, col), cell in table.get_celld().items():
        if row == 0:
            cell.set_facecolor("#e8eef5")
            cell.set_text_props(fontweight="bold")
        elif col == 0:
            cell.set_facecolor("#f7f7f7")
    ax.set_title("Monetary constraint comparison (Table 2.1 — visual)", fontsize=11, pad=12)
    return _save(fig, "table_2_1_monetary_systems.png")


def write_figure_manifest(paths: list[Path]) -> None:
    manifest = {
        "generated_by": "thesis_package/generate_thesis_figures.py",
        "figures": [str(p.relative_to(PKG)) for p in paths],
    }
    (FIGURES / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def main() -> int:
    paths = [
        figure_thesis_evidence_path(),
        figure_five_constraints_flow(),
        figure_production_vs_consumption(),
        figure_table_2_1_visual(),
        figure_ceir_coef_pre_post(),
        figure_ceir_distribution_by_regime(),
        figure_ceir_timeline(),
        figure_ceir_forward_returns(),
        figure_trading_rule_comparison(),
        figure_binomial_convergence(),
        figure_cross_location_pricing(),
        figure_oracle_tolerance_bars(),
        figure_margin_stress(),
        figure_mint_attestation_flow(),
        figure_spk_circulation_share(),
        figure_launch_gate_stages(),
    ]
    write_figure_manifest(paths)
    for p in paths:
        print(f"wrote {p.relative_to(PKG.parent)}")
    print("thesis_figures_ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
