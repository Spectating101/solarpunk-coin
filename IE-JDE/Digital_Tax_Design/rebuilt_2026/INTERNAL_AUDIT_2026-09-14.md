# Digital Tax 2026 — Internal Audit

**Date:** 2026-09-14  
**Package:** `DT-FCP-2026-001`  
**Branch:** `digital-tax/rebuild-2026`  
**Audit type:** internal package audit; not independent peer review

## 1. Disposition

The Digital Tax project has been materially rebuilt rather than cosmetically revised.

**Current disposition:** `PASS FOR HOSTILE REVIEW`  
**Not authorized by this audit:** `SUBMISSION READY`, `EXTERNALLY VALIDATED`, or any venue-specific acceptance claim.

The remaining gates are independent novelty review, independent re-coding/reconstruction, and a final just-before-submission legal currentness check. Structural package validation is now an executed and recorded pass.

## 2. Research object

The inherited programme centered on a small heterogeneous cross-country panel and strong claims about rate insignificance, base breadth, mediation, tax competition, and a Malaysia low-value-goods causal effect. Those claims are no longer canonical.

The rebuilt programme asks:

> How do governments convert commercial observability and transaction control into administrable fiscal responsibility?

The canonical analytical chain is:

```text
commercial event
→ taxable object
→ liable node
→ destination / nexus evidence
→ transaction / filing rail
→ reconciliation relationship
→ bounded fiscal action
```

The author-defined term **fiscal choke point** names the legally activated connection between a commercial transaction node and a bounded fiscal duty.

## 3. Novelty audit

### Prior art explicitly conceded

The package treats all of the following as prior art:

- firms as fiscal intermediaries;
- third-party reporting;
- VAT information trails;
- platform VAT/GST liability;
- vendor collection for imported digital services;
- platform data as an administrative opportunity in fragmented markets;
- comparative ASEAN digital-tax mapping by rates, tax structures, collection methods, nexus, and legal treatment.

The prior-art set is represented in `SOURCE_CATALOG.csv` through `LIT-001`–`LIT-009`, including a Philippines NTRC ASEAN VAT/VAT-like comparison and a 2025 comparative legal study of Indonesia/ASEAN OTT digital taxation.

### Defensible contribution after those concessions

The paper’s contribution is narrower:

1. a transaction-node unit of comparison across legally different instruments;
2. a five-component architecture: object, node, nexus, rail, reconciliation;
3. two cross-cutting dimensions: node locus and event coupling;
4. consistent primary-source application to five Southeast Asian regimes;
5. bounded cross-case findings about operational control and the location/timing of fiscal responsibility.

The package may **not** claim that platform intermediation is new or that this is the first ASEAN digital-tax comparison.

**Internal novelty result:** defensible after narrowing.  
**Remaining gate:** an independent reviewer must be able to describe the novelty as transaction-node architecture/event coupling rather than merely “platforms collect VAT” or “ASEAN taxes compared.”

## 4. Country-source audit

### Malaysia

Frozen evidence supports two-of-three consumer-location indicators, the RM500,000 registration threshold, the quarterly taxable period, and the FSP guide currently linked by MySToDS, including relevant platform-control wording.

**Central mechanism:** supported.  
**Remaining common gap:** comparable reconciliation/audit and compliance-cost evidence.

### Indonesia

Frozen evidence supports designation of PMSE VAT collectors, collection and commercial proof of VAT, current monthly remittance and periodic-return procedure through DGT systems, and the official 2026 administrative scale figures. The current DGT page controls present procedural wording.

**Central mechanism:** supported.  
**Remaining common gap:** comparable reconciliation/audit and compliance-cost evidence.

### Vietnam

Frozen evidence supports Decree 117/2025/NĐ-CP from 2025-07-01, transaction-level withholding by covered payment-capable platform managers, Decree 68/2026 carrying the mechanism into the broader 2026 framework, and Decree 141/2026 as the material later amendment layer checked for currentness.

The earlier “April 2025 start” shorthand is superseded.

**Central mechanism:** supported and currentness-checked through 2026-09-14.  
**Remaining common gap:** comparable reconciliation/audit and compliance-cost evidence.

### Thailand

Frozen evidence supports the VES registration architecture and THB1.8 million threshold, plus platform liability where the platform provides the continuous process from offering through payment and delivery. That platform rule is supported by both Revenue Department guidance and Revenue Code section 82/13.

**Central mechanism:** supported in law and guidance.  
**Remaining common gap:** comparable reconciliation/audit and compliance-cost evidence.

### Philippines

Frozen evidence supports VAT on covered digital services consumed in the Philippines, destination/location evidence, NRDSP B2C registration/direct remittance, and B2B final-withholding and marketplace paths. The package preserves these as distinct transaction paths.

**Central mechanism:** supported.  
**Remaining common gap:** comparable reconciliation/audit and compliance-cost evidence.

## 5. Comparative-coding audit

`CODING_RULES.md` freezes the two principal qualitative dimensions.

| Country | Node locus | Event coupling |
|---|---|---|
| Malaysia | provider-centered with conditional platform responsibility | periodic/provider-centered |
| Indonesia | appointed collector | collection-coupled |
| Vietnam | payment-capable platform | transaction-coupled |
| Thailand | provider-centered with conditional platform shift | conditional platform/provider rail |
| Philippines | split provider/buyer/marketplace nodes | split by transaction type |

These categories are non-ranking and may not be turned into a numeric maturity score without a separate measurement design.

**Internal consistency:** aligned with the frozen country rows.  
**Remaining gate:** independent re-code/reconstruction.

## 6. Manuscript audit

The rewritten manuscript contains:

1. research question and bounded cross-case findings in the introduction;
2. mechanism prior art and prior ASEAN comparison before the novelty claim;
3. purposive comparative method and source hierarchy;
4. five-component framework and typology;
5. five consistently structured country cases;
6. dedicated cross-case findings;
7. fiscal-capacity/platform-governance implications;
8. substantive limitations and research agenda;
9. bounded conclusion;
10. data/source/reproducibility statement.

The rewrite no longer depends on:

- “fiscal counterattack” as the academic contribution;
- sovereignty reclamation as an established empirical result;
- platform transaction value as a latent tax base;
- collection totals as causal effects;
- pooled ASEAN digital-tax revenue;
- the inherited rate/DiD results;
- first-in-region comparative status.

**Manuscript result:** internally strong and aligned with the research-control package.

## 7. Relationship to Invisible Ledger

The division of labor is explicit:

```text
Invisible Ledger
measurement / accounting boundary

platform revenue ≠ transaction value ≠ participant income ≠ GDP ≠ taxable base

                ↓ after legal classification

Fiscal Choke Points
administrative / institutional architecture
```

Digital Tax does not use an Invisible Ledger wedge as evidence of hidden tax liability.

**Overlap result:** materially reduced; the papers perform distinct research jobs.

## 8. Package and validation audit

Present artifacts include:

- `CLAIM_BOUNDARIES.md`;
- `SOURCE_CATALOG.csv`;
- `CLAIM_REGISTER.csv`;
- `COUNTRY_ARCHITECTURE.csv`;
- `CODING_RULES.md`;
- `LITERATURE_POSITIONING.md`;
- rewritten manuscript;
- `PACKAGE_MANIFEST.md`;
- `FIGURES_TABLES_SPEC.md`;
- `REVIEWER_RISK_REGISTER.md`;
- `SUBMISSION_MATERIALS.md`;
- `QUALITY_GATE.md`;
- `validate_package.py`;
- `VALIDATION_REPORT_2026-09-14.md`.

### Executed validation

GitHub Actions run `34819639467` completed successfully on validated head `39d6e087ed68df2cc8edd883ab423a9a55580d1f`.

Recorded validator output:

```text
sources=26 claims=34 countries=5
WARNING: Malaysia: architecture status is PARTIAL_COMPLETE
WARNING: Indonesia: architecture status is PARTIAL_COMPLETE
WARNING: Vietnam: architecture status is PARTIAL_COMPLETE
WARNING: Thailand: architecture status is PARTIAL_COMPLETE
WARNING: Philippines: architecture status is PARTIAL_COMPLETE
PASS: Digital Tax package is structurally consistent
NOTE: non-strict validation passed with open research-status warnings
```

The `PARTIAL_COMPLETE` warnings are intentional. They preserve the shared evidence gap in comparable reconciliation/audit, error-correction, and compliance-cost data rather than pretending that performance evidence is complete.

**Validation result:** executed structural gate closed.

## 9. Current quality assessment

This audit does not assign a journal acceptance probability.

Relative to the prior Digital Tax package, the quality increase is structural:

- stronger and evidence-aligned research question;
- novelty narrowed against both mechanism and regional-comparison prior art;
- primary-source-controlled country evidence;
- explicit currentness through material 2026 Vietnam developments;
- reconstructable comparative coding;
- historical overclaims explicitly superseded;
- package and hostile-review discipline approaching the stronger parts of the CL-ECI programme;
- CI validation now actually executed.

The principal remaining quality gap versus CL-ECI is no longer missing internal argument, source structure, or package validation. It is **independent reconstruction and external challenge**.

## 10. Next gates

1. independent re-code of the five country rows;
2. independent novelty/hostile review;
3. final just-before-submission source-currentness check;
4. freeze venue-specific figures/formatting only after route selection;
5. tag the final submission candidate only after the above close.