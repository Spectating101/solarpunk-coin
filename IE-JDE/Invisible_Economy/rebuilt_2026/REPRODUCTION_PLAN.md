# Invisible Ledger V2 — Reproduction and Freeze Plan

This plan converts the proposal architecture into a reproducible manuscript without forcing unresolved sample decisions.

## 1. Freeze order

Do not draft the final results chapters from remembered numbers. Freeze in this order:

1. advisor/sample decision;
2. issuer candidate inventory;
3. admitted issuer-transition table;
4. Tokopedia mechanism bridge;
5. BPS national/channel table;
6. BPS business-level evidence panel;
7. Bank Indonesia definition ledger and values;
8. PMK/DGT institutional-visibility evidence;
9. external corroboration tables;
10. figures and summary tables;
11. Chapters 4-8;
12. abstract and conclusion last.

## 2. Canonical data contracts

### Table A — issuer transition inventory

Required columns:

- case_id
- issuer
- segment
- geography
- period_t0
- period_t1
- transaction_metric_label
- transaction_t0
- transaction_t1
- transaction_unit
- revenue_metric_label
- revenue_t0
- revenue_t1
- revenue_unit
- transaction_growth
- revenue_growth
- signed_divergence
- direction_relation
- revenue_basis
- perimeter_note
- source_id_t0
- source_id_t1
- admission_class
- exclusion_reason
- mechanism_flags

### Table B — Tokopedia reconciliation

Required columns:

- component
- FY2022
- FY2023
- change
- sign_contribution_to_net_revenue_change
- source_locator
- accounting_note

The reconciliation must show gross revenue, incentives/contra-revenue treatment, net revenue, and the arithmetic contribution statement used in the manuscript.

### Table C — BPS national/channel anatomy

Required columns:

- publication_vintage
- observation_year
- total_ecommerce_value
- estimated_business_count
- implied_value_per_business
- marketplace_value
- non_marketplace_value
- unit
- definition_note
- source_locator

Derived outputs must include:

- total value growth;
- business-count growth;
- implied value/business growth;
- marketplace growth;
- non-marketplace growth;
- nominal-increase decomposition by channel.

### Table D — BPS business-level comparison

Required columns:

- characteristic
- marketplace_group_value
- non_marketplace_group_value
- denominator/sample_definition
- weighting_note
- source_locator
- permitted_interpretation

No causal language is generated from this table.

### Table E — Bank Indonesia definition ledger

Required columns:

- measure_id
- official_label
- instrument
- value_or_volume
- unit
- user_or_merchant_scope
- includes_transfers_or_topups
- observation_period
- source_vintage
- source_locator
- comparability_note

Never merge different BI measures into one generic `digital payments` series without preserving these fields.

### Table F — institutional visibility matrix

Required columns:

- rule/source
- actor
- economic_object
- identifier_required
- legal_duty
- transmission_evidence
- matching_evidence
- verified_use_evidence
- observed_outcome_evidence
- effective_date
- implementation_status_date
- source_locator

Unknown means `UNKNOWN`, not blank and not inferred.

## 3. Figure contracts

### Figure 1 — Economic translation across records

Activity -> issuer accounting -> business/channel statistics -> payment traces -> administrative visibility.

Purpose: framework only. No arrows should imply that the levels are numerically convertible without a documented bridge.

### Figure 2 — Transaction growth vs revenue growth by admitted issuer transition

- one point/arrow per admitted transition;
- label admission class;
- no pooled causal line;
- show opposite-direction cases clearly;
- reconstructed sensitivity cases must be visually separated from direct core cases.

### Figure 3 — Tokopedia FY2022-FY2023 revenue reconciliation

Waterfall/bridge from gross revenue and incentives to net revenue. Every plotted value must be source-frozen.

### Figure 4 — BPS 2023-2024 growth anatomy

Show total nominal increase split into marketplace and non-marketplace components. Caption must state published definitions and avoid equating the total with GDP/value added.

### Figure 5 — Digital traces by source-native measure

Indexed growth may be used for visual comparison only if:

- the index start period is common;
- definitions remain separately labeled;
- caption states that level equivalence is not asserted.

### Figure 6 — Institutional visibility chain

Record exists -> actor holds -> legal duty -> identifier -> transmission -> matching -> verified use -> outcome.

Use evidence-state labels (`SUPPORTED`, `PARTIAL`, `UNKNOWN`, `NOT_ESTABLISHED`) rather than implying the chain is complete.

## 4. Reproduction map

Every manuscript quantitative sentence should map:

`sentence -> result_id -> table/figure cell -> calculation -> source locator`.

Every institutional sentence should map:

`sentence -> visibility stage -> rule/source -> exact permitted claim`.

## 5. Source hierarchy

Preferred order:

1. audited issuer filings / official annual reports;
2. BPS / Bank Indonesia / controlling legal text / DGT primary materials;
3. official implementation guidance;
4. high-quality institutional or academic sources for interpretation;
5. secondary market estimates only for explicitly labeled corroboration or sensitivity.

A secondary source cannot silently upgrade a reconstructed value to direct evidence.

## 6. Version and exclusion discipline

For every frozen source, record:

- retrieval date;
- publication/filing date;
- file hash or stable URL where available;
- table/page locator;
- whether a later revision exists;
- why the chosen vintage governs.

For every excluded issuer period or dataset, record an exclusion reason. The exclusion ledger is part of the research output, not housekeeping.

## 7. Completion tests

The V2 research package passes internal freeze only if:

- all headline results have result IDs;
- no headline result depends on a `PENDING` or `UNKNOWN` numerical input;
- all direct/reconstructed distinctions are machine-visible;
- all old residual/GDP/tax-gap phrases are absent from canonical V2 outputs except in explicitly labeled legacy discussions;
- all figures can be regenerated from frozen tables;
- changing one source value propagates to derived results rather than requiring hand-edited prose;
- the manuscript can be reconstructed by a reviewer without using the legacy README as authority.

## 8. What remains deliberately outside this plan

- venue formatting;
- publication probability;
- ASEAN-wide aggregate estimation;
- causal tax-policy evaluation;
- consolidation with Fiscal Choke Points.

Those come only after the IL empirical object is frozen.