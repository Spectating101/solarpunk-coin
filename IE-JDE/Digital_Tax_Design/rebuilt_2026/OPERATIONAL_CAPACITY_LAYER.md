# Fiscal Choke Points — Operational Capacity Layer

**Status:** evidence-expansion layer; not a cross-country performance ranking  
**Scope:** September 2026 currentness pass  

## Purpose

The core Fiscal Choke Points paper identifies where fiscal responsibility is legally attached to a digital-commercial transaction architecture. That is only the first stage of fiscal capacity.

This document extends the research design one layer further by asking what public evidence exists for the operational chain after legal assignment:

`LEGAL DUTY -> RETURN/FILING -> CORRECTION -> REFUND/ADJUSTMENT -> AUDIT/REVIEW -> APPEAL/ENFORCEMENT -> OBSERVED OUTCOME`

The stages are intentionally separated. Evidence that a return can be filed does not establish that records are matched. Evidence that an audit authority exists does not establish audit effectiveness. Evidence that an adjustment or refund mechanism exists does not establish low compliance cost. None of the rows below is a country score.

## Coding rule

For each jurisdiction and selected instrument, code a stage only when an official source directly supports it.

- `EVIDENCED` — official public source directly establishes the stage.
- `PARTIAL` — official source establishes a related mechanism but not the complete stage for the exact instrument.
- `UNRESOLVED` — no sufficiently specific public evidence frozen yet.

Do not infer operational effectiveness from legal existence.

## Malaysia

### Filing / periodic return — EVIDENCED

The MySToDS framework provides registration, return, and payment machinery for foreign registered persons, and the current portal identifies the taxable-period structure already used in the core package.

### Correction / adjustment — PARTIAL

Royal Malaysian Customs states that invoice errors require cancellation of the original invoice and duplicates; credit and debit notes can be used for transaction-value reductions or increases, with corresponding service-tax adjustments made in the return. The same guidance states that cancelled invoices must be produced for audit when required.

Official source: Royal Malaysian Customs Department, MySST, **Issuing Invoices**: https://mysst.customs.gov.my/issuing-invoices/

**Boundary:** this establishes service-tax correction and audit-document mechanics. It is not yet frozen as a digital-FSP-specific audit protocol, and it does not establish matching quality, audit yield, or compliance cost for foreign digital providers.

### Refund / appeal — PARTIAL

The current MySST specific-guides index includes refund/drawback/tax-appeal guidance and continues to list the dedicated Digital Services by Foreign Service Provider registration/return/payment guide.

Official source: Royal Malaysian Customs Department, MySST, **Specific Guides**: https://mysst.customs.gov.my/specific-guides/

**Boundary:** current public availability of refund/appeal machinery does not establish its frequency or effectiveness for the selected digital-services population.

## Indonesia

### Filing / transaction proof — EVIDENCED

The core package already freezes PMSE collector appointment, collection, monthly remittance, periodic return, and transaction-linked commercial invoice/receipt evidence through current Directorate General of Taxes material.

### Correction / refund / audit / appeal — UNRESOLVED FOR COMPARABLE CODING

No additional stage is promoted here merely from generic Indonesian VAT procedure. A later pass should freeze an official source explicitly applicable to the selected PMSE collector mechanism before coding these stages.

This is deliberate: generic tax-procedure existence is not automatically instrument-specific operational evidence.

## Vietnam

### Transaction-level withholding / declaration — EVIDENCED

Decree 117/2025/NĐ-CP and the 2026 household/individual tax-administration layer support per-transaction platform withholding, declaration, and payment for covered transactions.

### Filing forms / withholding certificate — EVIDENCED

The official Gazette text of Decree 117 includes dedicated forms for platform tax withholding declarations, detailed schedules of tax withheld, platform payment schedules, taxpayer declarations, and tax-withholding certificates.

Official source: Government Gazette, **Decree 117/2025/NĐ-CP official text and appendices**: https://congbao.chinhphu.vn/tai-ve-van-ban-so-117-2025-nd-cp-45045-56698?format=pdf

### Refund / reversal — EVIDENCED AT LEGAL-MECHANISM LEVEL

The Decree 117 appendix includes a dedicated request form for refund by households/individuals conducting business on e-commerce platforms. Later 2026 government material also preserves platform responsibilities around retained transaction data and treatment of cancelled/returned transactions.

Official source: Government Gazette, Decree 117 official text above; Government policy explainer on 2026 e-commerce tax administration: https://xaydungchinhsach.chinhphu.vn/huong-dan-khai-thue-khau-tru-thue-voi-hoat-dong-kinh-doanh-tren-nen-tang-thuong-mai-dien-tu-119260309150311529.htm

**Boundary:** availability of forms and legal duties does not establish refund-processing speed, matching quality, audit yield, or seller compliance burden.

## Thailand

### Filing / payment — EVIDENCED

The VAT for Electronic Service system provides the registration, filing, and payment rail for covered nonresident electronic-service providers and platforms.

Official portal: Thai Revenue Department, **VAT for Electronic Service (VES)**: https://eservice.rd.go.th/rd-ves-web/landing

### Refund / correction — EVIDENCED

Revenue Department guidance states that VAT operators can request refunds for specified overpayments, including overpayment caused by miscalculation or duplicate collection.

### Audit / supervision — EVIDENCED

The same official e-Service guidance states that the Large Business Tax Administration Division supervises and audits nonresident electronic-service providers and electronic platforms registered for VAT, with correspondence through VES or email.

### Appeal / sanctions — EVIDENCED

The guidance provides for electronic tax appeals and identifies civil penalties for failures including operating without VAT registration, late filing, and incorrect returns affecting tax due.

Official source: Thai Revenue Department, **VAT on Electronic Service guide**, especially sections on VAT Refund and Compliance Services: https://www.rd.go.th/fileadmin/download/eService.pdf

**Boundary:** Thailand therefore has unusually visible public procedural evidence in the current source pack. That does not establish that its regime performs better than the other four jurisdictions; source transparency is itself an observation condition.

## Philippines

### Registration / filing / payment — EVIDENCED

The core package already freezes the VDS registration and return/payment rail for nonresident digital service providers.

### Correction / overpayment — EVIDENCED

BIR Revenue Memorandum Circular No. 47-2025 states that when a nonresident DSP has already paid VAT and later discovers that a business buyer also withheld and remitted the VAT, the NRDSP cannot request a cash refund of that erroneously paid VAT, but may amend the previously filed BIR Form 2550-DS and carry the overpayment to succeeding quarters.

Official source: Bureau of Internal Revenue, **RMC No. 47-2025**: https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2047-2025.pdf

### Return instrument — EVIDENCED

BIR publishes dedicated instructions for BIR Form 2550-DS, the VAT return for a nonresident digital service provider.

Official source: Bureau of Internal Revenue, **BIR Form 2550-DS instructions / RMC 52-2025 attachment**: https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2052-2025%20Attachment%202v2.pdf

### Audit / appeal / enforcement — UNRESOLVED FOR COMPARABLE CODING

The general BIR enforcement environment should not be promoted into this instrument-specific matrix without a source tied sufficiently closely to NRDSP digital-service VAT administration.

## Cross-case result

The operational layer changes the interpretation of proposition P6.

The evidence no longer supports only the statement that **formal law and operational capacity are different stages**. It now also shows that several jurisdictions publicly expose at least some downstream machinery beyond legal liability:

- Malaysia: return adjustment, invoice correction, audit-document production, and refund/appeal infrastructure are publicly visible, but digital-FSP-specific operational performance remains unresolved.
- Vietnam: dedicated withholding/declaration schedules, certificates, and refund-request machinery are embedded in the legal/administrative architecture.
- Thailand: the public VES material explicitly joins registration/filing with refund, audit supervision, appeal, and sanctions.
- Philippines: dedicated digital-service returns and an explicit amendment/carry-forward rule handle a documented overpayment scenario.
- Indonesia: the selected PMSE package remains strongest at appointment, collection, remittance, reporting, and transaction-proof stages; comparable downstream evidence is not promoted yet.

This is evidence of **procedural depth**, not evidence of **procedural effectiveness**.

## Revised second-stage framework

The project can now distinguish two nested architectures:

### Stage A — Fiscal choke-point architecture

1. taxable object;
2. liable node;
3. destination / nexus evidence;
4. transaction rail;
5. reconciliation power.

### Stage B — Operational-capacity architecture

1. filing / declaration;
2. correction / amendment;
3. refund / reversal;
4. audit / review;
5. appeal / dispute;
6. enforcement / sanction;
7. observed administrative outcomes.

The current paper may describe Stage B where directly evidenced, but should not collapse the two stages into a maturity score.

## What would permit a future performance paper

A later identified study would need comparable outcome data such as:

- active liable entities and filing populations;
- on-time filing/payment rates;
- corrected-return frequency;
- refund counts, values, and processing times;
- transaction-to-return matching rates;
- audit selection and audit yield;
- assessments, penalties, and appeals;
- platform/seller compliance cost;
- off-platform substitution or avoidance;
- before/after institutional changes at the same tax type and jurisdiction.

Until then, Fiscal Choke Points remains a comparative architecture paper with an increasingly well-specified operational extension—not a ranking of ASEAN tax administrations.
