# CEIR Regression Appendix (auto-generated)

## Table A.1 — Preferred level specification

| Item | Value |
|------|------:|
| Pre-ban N | 872 |
| Post-ban N | 1408 |
| Pre-ban β (log CEIR) | -0.2623 |
| Post-ban β (log CEIR) | -0.0708 |
| Pre-ban p (HAC) | 0.0005 |
| Post-ban p (HAC) | 0.1331 |
| Pre-ban p (month cluster) | 0.0007 |
| Post-ban p (month cluster) | 0.1258 |
| Chow p-value | 1.11e-16 |
| Econ. impact (1 SD log CEIR → 30d return) | -12.6% |

**Specification:** `ret_30d = Price_{t+30}/Price_t - 1`; 1% winsorized `log(CEIR)`; controls: linear trend, standardized fear/greed, 30-day return volatility; HAC(30); month clustering; split at China ban (2021-06-20).

## Table A.2 — Differenced CEIR (boundary condition)

| Item | Value |
|------|------:|
| Pre-ban β (Δlog CEIR) | -0.2357 (p=0.424) |
| Post-ban β (Δlog CEIR) | 0.1424 (p=0.378) |

CEIR effects are not robust to differencing — cite as a boundary condition.

## Table A.3 — Trading-rule negative result

| Metric | Value |
|--------|------:|
| Strategy total return (%) | 176.4 |
| Buy-and-hold total return (%) | 2771 |
| Sharpe (strategy) | 0.723 |
| Sharpe (buy-and-hold) | 1.132 |

**Interpretation:** CEIR is explanatory evidence, not a viable trading strategy.

## Reproduce

```bash
python thesis_package/ceir_regression.py --refresh-panel
python thesis_package/generate_thesis_figures.py
npm run thesis:docx
```
