# Invisible Ledger V2 — Data Product Schemas

These schemas are designed so the final manuscript can be regenerated from explicit source-controlled tables rather than narrative memory.

## `ISSUER_TRANSITION_LEDGER.csv`

One row per admitted consecutive transition.

```text
transition_id
issuer
segment
country_scope
period_start
period_end
transaction_metric_name
transaction_metric_definition_start
transaction_metric_definition_end
transaction_value_start
transaction_value_end
transaction_unit
transaction_growth_pct
revenue_metric_name
revenue_basis_gross_or_net
revenue_definition_start
revenue_definition_end
revenue_start
revenue_end
revenue_unit
revenue_growth_pct
divergence_pp
sign_relation
accounting_perimeter_stable
geography_stable
business_mix_stable
source_start_id
source_end_id
evidence_tier
admission_status
exclusion_reason
notes
```

### Admission rule

A transition cannot enter headline results unless period, geography, metric definition, revenue basis, and business perimeter are sufficiently documented for the intended comparison. Instability may be retained as a mechanism finding but must not be silently treated as like-for-like growth.

## `ISSUER_DEFINITION_LEDGER.csv`

```text
definition_id
issuer
segment
period
metric_name
metric_type
source_native_definition
unit
currency
reported_or_derived
principal_agent_basis
geographic_scope
business_scope
consolidation_scope
source_id
source_locator
comparability_group
allowed_use
forbidden_use
notes
```

## `TOKOPEDIA_RECONCILIATION.csv`

```text
component_id
period_start
period_end
component_name
value_start
value_end
unit
change_absolute
contribution_to_net_revenue_change
source_id
source_locator
reported_or_derived
formula
notes
```

Minimum components should include transaction value/GTV, gross third-party revenue, incentives/contra-revenue where source-supported, and net third-party revenue.

The reconciliation must distinguish **accounting arithmetic** from **economic causality**. Saying an incentive reduction explains a share of the arithmetic net-revenue increase does not prove why management changed incentives or what caused transaction demand.

## `BPS_GROWTH_ANATOMY.csv`

```text
bps_row_id
publication_year
reference_period
measure
channel
value
unit
estimated_business_count
source_publication
source_table
source_cell_or_row
reported_or_derived
formula
revision_status
allowed_comparison
notes
```

Derived outputs such as implied value/business and share of nominal increase must cite the exact input row IDs.

## `BPS_BUSINESS_CHARACTERISTICS.csv`

```text
characteristic_id
reference_period
population
marketplace_group
characteristic
estimate
unit
sample_n
weighted_or_unweighted
comparison_group
adjustment_or_model
statistical_note
source_publication
source_table
source_locator
allowed_inference
forbidden_inference
```

All marketplace/non-marketplace comparisons are observational unless the source provides a design that supports stronger inference.

## `BI_DEFINITION_LEDGER.csv`

```text
bi_measure_id
measure_name
reference_period
frequency
value_or_volume
unit
population_scope
instrument_scope
includes_topups
includes_transfers
commerce_specific
source_release
source_table
source_locator
revision_status
allowed_comparison
forbidden_equivalence
notes
```

`forbidden_equivalence` should explicitly state when a payment trace cannot be treated as e-commerce sales, issuer GTV, GDP, income, or taxable base.

## `INSTITUTIONAL_VISIBILITY_MATRIX.csv`

One row per legal/administrative path or evidence object.

```text
visibility_id
instrument
covered_actor
covered_transaction
record_exists_status
record_holder
legal_duty_status
identifier_fields
transmission_required_status
transmission_frequency
recipient_authority
matching_evidence_status
verified_use_evidence_status
outcome_evidence_status
correction_or_refund_rail
source_ids
currentness_date
notes
```

Allowed statuses:

```text
SUPPORTED
PARTIAL
UNKNOWN
NOT_APPLICABLE
```

No later stage may be inferred merely because an earlier stage is supported.

## `SOURCE_REGISTER.csv`

```text
source_id
source_class
authority_or_issuer
title
publication_or_filing_date
reference_period
url_or_repo_locator
archived_locator
language
primary_or_secondary
role
exact_claims_supported
currentness_status
notes
```

## `EXCLUSION_LEDGER.csv`

```text
exclusion_id
candidate_object
candidate_period
reason_category
reason_detail
source_ids
could_be_reinstated_if
status
```

Suggested reason categories:

```text
GEOGRAPHY_MISMATCH
PERIMETER_CHANGE
DEFINITION_BREAK
ASSUMPTION_DEPENDENT
MISSING_SOURCE
DUPLICATION_RISK
NON_COMPARABLE_UNIT
ADVISOR_GATE
LEGACY_RESIDUAL_ONLY
```

## `RESULT_REPRODUCTION_MAP.csv`

```text
result_id
manuscript_section
claim_text_short
input_artifact
input_row_ids
transformation
code_or_formula
output_table_or_figure
source_ids
validation_status
notes
```

The final manuscript should have no quantitative headline result lacking a `result_id` in this map.

## Validation rules to automate later

A future validator should fail if:

1. an admitted issuer transition lacks source IDs;
2. a transition marked comparable has a documented definition/geography/perimeter break without explanation;
3. a derived BPS result lacks explicit input rows/formula;
4. any BI measure has a blank `forbidden_equivalence` field;
5. institutional matching/use/outcome is marked `SUPPORTED` without a supporting source ID;
6. legacy terms such as `$185B invisible economy`, `12.3x fiscal multiplier`, or `transaction value minus revenue = unmeasured GDP` re-enter canonical V2 outputs;
7. a result appears in the manuscript without a reproduction-map entry.
