# Invisible Ledger V2 — Proposal Sync Checklist

Use this checklist whenever the advisor-facing proposal changes. The proposal remains the authority while the V2 research pack is supporting infrastructure.

## 1. Changes that require a pack sync

Re-run this checklist if the proposal changes any of the following:

- thesis title or empirical geography;
- RQ1/RQ2/RQ3 wording;
- definition of the Invisible Ledger;
- issuer sample or issuer admission rationale;
- Blibli travel-inclusive boundary;
- Bukalapak geography treatment;
- common revenue basis;
- treatment of Grab/Shopee reconstructions;
- BPS publication vintages or channel definitions;
- Bank Indonesia measures admitted to the thesis;
- PMK 37/2025 / DGT implementation interpretation;
- language about tax, GDP, informality, measurement, or causality;
- external/ASEAN corroboration role.

## 2. Authority sync

After a proposal revision, check:

- [ ] `README.md` still states the same central question.
- [ ] `CLAIM_BOUNDARIES.md` is at least as restrictive as the proposal.
- [ ] `EVIDENCE_ARCHITECTURE.csv` contains every proposal evidence module and no unapproved core module.
- [ ] `RESULT_REGISTER.csv` does not contain a result that the proposal has excluded.
- [ ] `ISSUER_ADMISSION_RULES.md` matches the advisor-approved sample logic.
- [ ] `INSTITUTIONAL_VISIBILITY_CHAIN.csv` does not move beyond the proposal's evidence.
- [ ] `REPRODUCTION_PLAN.md` still generates the tables/figures promised in the proposal.
- [ ] `CONSOLIDATION_BOUNDARY.md` has not silently turned IL into a tax paper.

## 3. Result-state sync

For every result affected by a proposal change, assign exactly one state:

- `ADMITTED_CORE`
- `ADMITTED_OBSERVATIONAL`
- `DERIVED_PENDING_REPRODUCTION`
- `PENDING_ADVISOR_SAMPLE_GATE`
- `SUPPORTING_ONLY`
- `DEMOTED_LEGACY`
- `REJECTED_FOR_V2`

Do not preserve a result as `ADMITTED_CORE` merely because it was in an older manuscript.

## 4. Sample-gate sync

When the advisor resolves the open issuer questions:

### Blibli

Record:

- whether the travel-inclusive third-party segment is accepted;
- why that perimeter is acceptable for the RQ;
- which periods remain comparable;
- any periods excluded after the decision.

### Bukalapak

Record:

- whether group-level broader geography is accepted;
- whether the case remains core, conditional, or corroborative;
- why the geography does or does not compromise the Indonesia-centered claim.

### Revenue basis

Record:

- exact source label used as the common/comparable revenue metric;
- whether all admitted transitions share it;
- whether stratification is required where bases differ.

## 5. Phrase regression check

After proposal edits, search the canonical proposal and V2 research pack for affirmative uses of:

- `$185 billion unmeasured economy`
- `$82.8 billion invisible economy`
- `12.3x fiscal multiplier`
- `12.5x fiscal multiplier`
- `missing GDP`
- `hidden GDP`
- `tax gap`
- `causal validation`
- `natural experiment`
- `census-level estimate`

If one is intentionally discussed historically, make the rejection/demotion explicit in the same passage.

## 6. Numerical sync

Any changed number must propagate through:

`source -> frozen table -> result register -> figure/table -> manuscript sentence -> abstract/conclusion if relevant`

Never edit a headline number only in prose.

## 7. Proposal-to-manuscript handoff gate

Begin the full Chapters 4–8 manuscript write only when:

- [ ] advisor/sample gates are recorded;
- [ ] direct issuer transition table is frozen;
- [ ] Tokopedia reconciliation reproduces;
- [ ] BPS national/channel tables reproduce;
- [ ] BPS business-level wording is frozen as observational;
- [ ] BI definition ledger is frozen;
- [ ] institutional visibility claims are evidence-coded;
- [ ] every core result has a result ID and source locator.

The abstract and conclusion should be written last from the final admitted result set.

## 8. What this checklist does not do

It does not approve thesis scope on the advisor's behalf. It only ensures that once the proposal changes, the underlying research pack follows it rather than preserving stale assumptions.