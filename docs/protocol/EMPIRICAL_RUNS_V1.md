# Constraint Empirical Runs v1

## Purpose

Constraint Protocol began with a deterministic `evidence -> provenance -> policy -> bounded claim -> settlement` alpha. Empirical Runs adds a second question:

> When a declared claim-capacity rule is replayed against historical outcomes, how often did the permitted capacity remain covered, which constraint bound the decision, and what exposure was sacrificed to reduce shortfalls?

The public interface is an aggregate research surface. It does **not** redistribute licensed CRSP or Refinitiv row-level observations.

## Source study

Internal source asset:

`constraint_market_capacity_v1`

SHA-256:

`792c3ad99311cff2b18e9dcdb58fbfedcf74a1bf95c1a0691673d06492b5e0e5`

Delivered panel:

- 777,764 security-days;
- 457 PERMNOs;
- 450 RICs;
- 2018-01-02 through 2024-12-31;
- license boundary: `internal_yzu_licensed_no_redistribution`.

Constraint applies a conservative evaluation view before policy replay:

1. exclude every RIC mapped to more than one PERMNO in the delivered panel;
2. use only time-t `market_value`, `volatility_60d`, and `adv_20d` as policy inputs;
3. define realized capacity using a downside-only floor: `1 + min(0, min-forward cumulative return)`;
4. compare policies on a common complete-case sample for each horizon.

Resulting evaluation view:

- 760,931 rows;
- 443 PERMNOs;
- 443 RICs;
- seven ambiguous RIC relationships excluded.

## Reference research policies

These are declared research rules. They are **not** market standards and were not fitted to maximize historical coverage.

### `COLLATERAL-FIXED-20`

Baseline:

`permitted_ratio = 0.80`

### `COLLATERAL-VOL-002`

Volatility-adaptive haircut:

`haircut = clip(0.10 + 0.50 * volatility_60d, 0.15, 0.60)`

`permitted_ratio = 1 - haircut`

### `COLLATERAL-VOL-LIQ-003`

Volatility capacity plus turnover-derived liquidity guard:

`liquidity_capacity = clip(0.50 + 50 * (adv_20d / market_value), 0.60, 0.95)`

`permitted_ratio = min(volatility_capacity, liquidity_capacity)`

## Main aggregate results

### 20-session common sample

`N = 734,379`

| Policy | Coverage | Shortfall event rate | Mean permitted ratio |
|---|---:|---:|---:|
| `COLLATERAL-FIXED-20` | 97.2518% | 2.7487% | 80.0000% |
| `COLLATERAL-VOL-002` | 98.6941% | 1.3059% | 74.3669% |
| `COLLATERAL-VOL-LIQ-003` | 98.8626% | 1.1374% | 71.6849% |

The guarded rule increases historical coverage by 1.61 percentage points relative to the fixed baseline while reducing mean permitted capacity by 8.32 percentage points. The interface shows both sides of that trade-off rather than labeling the conservative rule automatically superior.

For `COLLATERAL-VOL-LIQ-003`, the volatility-derived capacity is binding in 65.24% of the common sample and liquidity capacity is binding in 34.76%.

### 60-session common sample

`N = 716,659`

| Policy | Coverage | Shortfall event rate | Mean permitted ratio |
|---|---:|---:|---:|
| `COLLATERAL-FIXED-20` | 89.3990% | 10.6027% | 80.0000% |
| `COLLATERAL-VOL-002` | 93.9424% | 6.0576% | 74.3314% |
| `COLLATERAL-VOL-LIQ-003` | 94.9118% | 5.0882% | 71.6617% |

## Capacity-versus-coverage frontier

The public bundle evaluates fixed haircuts from 0% through 60% in five-percentage-point increments on a common sample.

At 20 sessions:

- 0% haircut: 15.44% coverage;
- 10%: 85.51%;
- 20%: 97.25%;
- 30%: 99.04%;
- 40%: 99.64%;
- 60%: 99.95%.

At 60 sessions:

- 0% haircut: 9.71% coverage;
- 10%: 66.89%;
- 20%: 89.40%;
- 30%: 95.98%;
- 40%: 98.22%;
- 60%: 99.72%.

The frontier is descriptive. It does not establish an optimal haircut or a future risk guarantee.

## Stress reference runs

The public study selects five cross-sectional 20-session stress dates using the highest fixed-baseline shortfall rates, at least 300 observations, and a 30-day separation rule.

The largest selected replay is `CP-MKT-STRESS-0002` on 2020-02-21:

| Policy | Coverage | Shortfall event rate | Mean permitted ratio |
|---|---:|---:|---:|
| Fixed 20% | 8.69% | 91.31% | 80.00% |
| Volatility | 11.50% | 88.50% | 78.61% |
| Volatility + liquidity | 19.48% | 80.52% | 74.76% |

The guarded rule reduced shortfall incidence by 10.8 percentage points relative to the fixed rule and still failed badly. This is intentional evidence for the protocol thesis: an explicit rule can be more conservative without being adequate under severe realized stress.

## Public artifacts

Committed under:

`frontend/public/empirical/market-capacity-v1/`

- `market-capacity-summary.json`
- `methods-manifest.json`
- `policy-frontier.json`
- `stress-reference-runs.json`
- `yearly-policy-results.json`

The public bundle contains aggregate study outputs and methodological identity only. A test fails if prohibited row-level field names such as `permno`, `ric`, `security_id`, `close_price`, or `company_name` appear in the serialized public study bundle.

## Interface

`Empirical Runs` is now the default Constraint landing surface.

Views:

1. **Study** — common-sample policy comparison, capacity cost, binding-constraint attribution, annual coverage;
2. **Policy frontier** — fixed-haircut capacity/coverage curve;
3. **Stress replays** — selected historical failure dates with policy-only comparison;
4. **Methods** — source-package hash, cleaning rules, exact declared formulas, and reproduction boundary.

The persistent Run Dossier distinguishes licensed observed evidence from public derived aggregates and declared policy formulas.

## Boundary

Historical coverage is an empirical diagnostic. It is not proof of future performance, legal enforceability, reserve custody, collateral rights, liquidation finality, or production risk adequacy.
