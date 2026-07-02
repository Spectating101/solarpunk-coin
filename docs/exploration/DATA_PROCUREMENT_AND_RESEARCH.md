# Data Procurement & Research — Tier C

**Generated:** 2026-06-28T17:44:41.196972+00:00  
**Command:** `npm run exploration:procure-data`

This document records **actual data runs and external sources** — not simulation-only checks.

## 1. CEIR panel (consumption side)

- Panel: `thesis_package/empirical_results/bitcoin_ceir_analysis_ready.csv`
- Range: 2019-01-01 → 2025-05-28 (2340 days)
- Pre-ban mean CEIR: 30.035 | Post-ban: 29.383
- Regression refresh: ok
- Lineage: Historical panel: Bitcoin price + Cambridge-style cumulative energy cost (electricity_price × daily TWh path). Modelled consumption side — not site meters.

## 2. Production-side procurement

- **NASA POWER** (Taoyuan, Taiwan): GHI **6.7735** kWh/m²/day on `20260623` (31 valid days in window)
- **Operator intake:** accepted surplus **103.8** kWh (None) — ok
- **Meter CSV import:** 2 rows, **1985.5** kWh surplus total
- **Inverter adapter:** accepted surplus **996.2** kWh (generation 1388.6 kWh, grade adapter_sample_or_review)
- **Ausgrid public sample:** 8.726 kWh/day proxy (1/07/2012)

## 3. Consumption vs production contrast

- **Object** — CEIR: Bitcoin market cap vs cumulative mining electricity cost | SPK: Verified rooftop/export surplus kWh
- **Side** — CEIR: Consumption (PoW burn) | SPK: Production (export/curtailment)
- **Primary source** — CEIR: Cambridge CBECI-style model in panel | SPK: Signed meter / inverter / operator CSV
- **Sample period** — CEIR: 2019-01-01 → 2025-05-28 (n=2340) | SPK: Taoyuan fixtures + operator intake 2026-05
- **Latest CEIR / resource** — CEIR: mean CEIR post-ban ≈ 29.383 | SPK: NASA GHI 6.7735 kWh/m²/day (20260623)
- **Empirical finding** — CEIR: pre-ban β ≈ -0.262347427051995 | SPK: CSV import surplus 1985.5 kWh (2 days)

## 4. External research (comparables)

### SolarCoin / kSLR
- Claim: 1 kSLR per verified kWh solar production; 30k+ installations
- vs SPK: Reward token on Base/EW Chain — production-linked issuance like SPK anchor, but no circulation-first network-money or redemption state machine in our sense.
- Source: https://solarcoin.org/how-it-works/
- Source: https://solarcoin.org/frequently-asked-questions/

### EnergyTag Granular Certificates (GC)
- Claim: Hourly-or-less energy attributes; temporal + geographic matching; anti-double-count
- vs SPK: SPK v2 attestation fields (country, grid_zone, energy_vintage) align with GC matching features — SPK adds monetary circulation + optional redeem.
- Source: https://energytag.org/wp-content/uploads/2024/12/EnergyTag_Granular-Certificate-Scheme-Standard-V2.pdf
- Source: https://energytag.org/wp-content/uploads/2024/03/Granular-Certificate-Matching-Standard_V1.pdf

### FSB global stablecoin recommendations
- Claim: Redemption, governance, stress planning for stable-value systems
- vs SPK: Horizon C bar; SPK v1 peg-off deliberately below this bar
- Source: https://www.fsb.org/2023/07/high-level-recommendations-for-the-regulation-supervision-and-oversight-of-global-stablecoin-arrangements-final-report/

## 5. Stitch implication

CEIR procurement validates passive consumption-side signal; SPK procurement validates production-side attestation path. Comparable literature shows production tokens exist (SolarCoin) and regime metadata standards exist (EnergyTag) — SPK combines mint + settlement + optional redeem in one testnet stack.

---

Re-run: `npm run exploration:procure-data && npm run exploration:tier-c`
