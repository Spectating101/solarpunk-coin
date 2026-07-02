# Thesis visual catalog

**Purpose:** Index every figure and key table so the manuscript is not prose-only. Regenerate figures with `npm run thesis:figures`; full export with `npm run thesis:all`.

**Output directory:** `thesis_package/empirical_results/figures/`

---

## Chapter 1 — Introduction

| ID | Type | File | Section |
|---|---|---|---|
| Table (at a glance) | Table | inline | Opening |
| Figure 1.1 | Flow | `thesis_evidence_path.png` | §1.4 Research design |
| Figure 1.2 | Flow | `five_constraints_flow.png` | §1.4 / preview of Ch 5 |

---

## Chapter 2 — Literature

| ID | Type | File | Section |
|---|---|---|---|
| Table 2.1 | Table | inline | §2.2 Monetary credibility |
| Figure 2.1 | Table graphic | `table_2_1_monetary_systems.png` | §2.2 after Table 2.1 |
| Figure 2.2 | Panel diagram | `production_vs_consumption.png` | §2.5 Bitcoin vs designed claims |

---

## Chapter 3 — Bitcoin CEIR

| ID | Type | File | Section |
|---|---|---|---|
| Table 3.1 | Table | inline | §3.3 CEIR definition |
| Table 3.2 | Table | `tables/ceir_data_sources.csv` | §3.3.1 Data sources (injected) |
| Table 3.3 | Table | `tables/ceir_sample_summary.csv` | §3.3.1 Sample counts |
| Table 3.4 | Table | `tables/ceir_variable_definitions.csv` | §3.3.1 Variables |
| Table 3.5 | Table | `tables/ceir_descriptive_statistics.csv` | §3.3.1 Descriptives |
| Table 3.6 | Table | `tables/ceir_correlation_matrix.csv` | §3.3.1 Correlations |
| Table 3.7 | Table | inline + `ceir_analysis_summary.csv` | §3.5 Regression |
| Figure 3.1 | Bar chart | `ceir_coef_pre_post.png` | §3.5 Pre/post ban |
| Figure 3.1b | Histogram | `ceir_distribution_by_regime.png` | §3.5 Distribution |
| Figure 3.2 | Time series | `ceir_timeline.png` | §3.5 Timeline |
| Figure 3.3 | Scatter/bins | `ceir_forward_returns.png` | §3.5 Illustrative |
| Figure 3.4 | Line | `trading_rule_comparison.png` | §3.6 Robustness |

**Regenerate tables:** `python thesis_package/generate_thesis_tables.py`

---

## Chapter 4 — Pricing

| ID | Type | File | Section |
|---|---|---|---|
| Table 4.1 | Table | inline | Taiwan base case |
| Table 4.2 | Table | inline | Cross-location ATM |
| Table 4.3 | Table | inline | Oracle tolerance |
| Table 4.4 | Table | `tables/pricing_location_inputs.csv` | §4.3.1 Location inputs (injected) |
| Table 4.5 | Table | `tables/pricing_binomial_convergence.csv` | §4.3.1 Convergence (injected) |
| Table 4.6 | Table | `tables/pricing_margin_stress_display.csv` | §4.3.1 Margin grid (injected) |

---

## Chapter 5 — Constraints + SPK v1

| ID | Type | File | Section |
|---|---|---|---|
| Table 5.1 | Table | inline | Five constraints |
| Figure 5.1 | Flow | `mint_attestation_flow.png` | §5.3 Data path |
| Table 5.2 | Table | inline | §5.7 Launch gate status |
| Figure 5.6 | Status bar | `launch_gate_stages.png` | §5.7 Staging |
| Figure 5.7 | Pie | `spk_circulation_share.png` | §5.9 SPK v1 metrics |
| Tables 5.3–5.4 | Table | injected | `embed_evidence.py` → `SPK_V1_EVIDENCE.md` |

**Also useful (cross-chapter):** `production_vs_consumption.png` — Bitcoin consumption vs SPK production (optional insert in Ch 2 §2.6 or Ch 5 intro).

---

## Chapter 6 — Conclusion

| ID | Type | File | Section |
|---|---|---|---|
| Table (at a glance) | Table | inline | Opening |
| Table 6.2 | Table | inline | Chapter roadmap |
| Figure 6.1 | Flow | `thesis_evidence_path.png` | §6.2 Roadmap |

---

## Build commands

```bash
npm run thesis:figures   # PNGs + manifest.json
npm run thesis:docx      # THESIS_GROUNDED.docx (embeds figures)
npm run thesis:all       # figures + evidence inject + docx
```

**Manifest:** `empirical_results/figures/manifest.json` — lists all PNG paths and SHA256 after each run.
