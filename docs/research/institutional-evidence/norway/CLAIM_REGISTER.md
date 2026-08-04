# Norway Institutional Claim Register

**Status:** provisional claim register pending expert and source audit  
**Date:** 2026-08-04  
**Rule:** no claim may be upgraded beyond its listed evidence class without a new source and review

## Status vocabulary

- `SUPPORTED` — directly supported by authoritative official sources.
- `SUPPORTED_WITH_SCOPE` — supported, but only within a stated institutional process.
- `INFERENCE` — bounded interpretation derived from multiple supported observations.
- `PROPOSAL` — proposed research or simulation use; not an observed result.
- `UNRESOLVED` — requires additional legal, technical, or domain review.

## Registered claims

| Claim ID | Claim | Class | Status | Main sources | Permitted use | Prohibited upgrade |
|---|---|---|---|---|---|---|
| `NOR-INST-001` | Elhub is Norway’s national electricity-data platform and supports data exchange for more than four million metering points. | `OBSERVED_PROCESS` | `SUPPORTED` | `NOR-SRC-ELHUB-001` | Establish institutional scale and national data role. | Does not prove all values are measured, final, or error-free. |
| `NOR-INST-002` | Grid companies submit prior-day interval values and Elhub calculates and distributes settlement-related data. | `OBSERVED_PROCESS` | `SUPPORTED` | `NOR-SRC-ELHUB-001`, `NOR-SRC-ELHUB-004` | Support actor separation and the evidence-to-settlement chain. | Does not make Elhub the final financial settlement counterparty. |
| `NOR-INST-003` | Elhub distinguishes measured and finally estimated interval values, and both may be valid for settlement when properly quality-labelled. | `OBSERVED_RULE` | `SUPPORTED` | `NOR-SRC-ELHUB-002` | Show that evidence quality is typed rather than binary. | Does not imply estimates equal measurements for every analytical purpose. |
| `NOR-INST-004` | Elhub uses D+1 and D+5 quality and settlement stages; changes after D+5 can generate discrepancy settlement. | `OBSERVED_PROCESS` | `SUPPORTED` | `NOR-SRC-ELHUB-002`, `NOR-SRC-ELHUB-004` | Support provisional/final/corrected evidence states and correction consequences. | Does not imply every market process uses identical timing. |
| `NOR-INST-005` | Elhub holds measured or estimated hourly or 15-minute values for mainland Norwegian metering points and applies access controls to non-public data. | `OBSERVED_PROCESS` | `SUPPORTED_WITH_SCOPE` | `NOR-SRC-ELHUB-003` | Support data granularity and permission boundaries. | Does not authorize project access to individual metering data. |
| `NOR-INST-006` | Elhub publishes open aggregate datasets and an Energy Data API for contextual and research use. | `OBSERVED_PROCESS` | `SUPPORTED` | `NOR-SRC-ELHUB-005`, `NOR-SRC-ELHUB-006` | Support a future public aggregate-data adapter. | Aggregate data must not be treated as site-level issuance evidence. |
| `NOR-INST-007` | A Norwegian Guarantee of Origin confirms 1 MWh of electrical energy from a specified source, time, and place. | `OBSERVED_RULE` | `SUPPORTED` | `NOR-SRC-LOVDATA-001`, `NOR-SRC-STATNETT-001` | Support explicit physical-to-claim quantity mapping. | Does not prove physical delivery to a particular consumer. |
| `NOR-INST-008` | Statnett is the designated Norwegian issuer/registry authority and NECS is the Norwegian GO registry. | `OBSERVED_RULE` | `SUPPORTED` | `NOR-SRC-LOVDATA-001`, `NOR-SRC-STATNETT-001` | Support separation between production and issuance authority. | Does not imply Policy Lab has equivalent authority. |
| `NOR-INST-009` | NECS tracks issued certificates, account inventories, transactions, and settlement processes. | `OBSERVED_PROCESS` | `SUPPORTED` | `NOR-SRC-STATNETT-001` | Support lifecycle, custody, transfer, and registry requirements. | Does not prove every registry state creates a legal or monetary settlement right. |
| `NOR-INST-010` | Elhub reports production data to NECS. | `OBSERVED_PROCESS` | `SUPPORTED` | `NOR-SRC-ELHUB-001` | Support an upstream evidence layer before certificate issuance. | Does not establish that every reported value automatically creates a GO. |
| `NOR-INST-011` | GOs used for individual electricity disclosure must be cancelled to prevent resale. | `OBSERVED_RULE` | `SUPPORTED` | `NOR-SRC-NVE-001`, `NOR-SRC-NVE-002` | Support anti-reuse and terminal-state concepts. | Cancellation is not physical electricity delivery or monetary redemption. |
| `NOR-INST-012` | Norwegian electricity disclosure based on GOs does not identify the actual electricity physically delivered to end users. | `OBSERVED_RULE` | `SUPPORTED` | `NOR-SRC-NVE-002`, `NOR-SRC-NVE-003` | Support attribution-versus-delivery boundary. | Must not be used to claim GO systems are fraudulent or valueless. |
| `NOR-INST-013` | Small aggregated flexibility resources must be registered and grouped before applying for mFRR prequalification. | `OBSERVED_PROCESS` | `SUPPORTED` | `NOR-SRC-STATNETT-002`, `NOR-SRC-STATNETT-003` | Support identity, grouping, and market-admission stages. | Does not establish actual delivery or settlement. |
| `NOR-INST-014` | Statnett and the relevant local grid company evaluate whether a flexibility group is suitable for market participation. | `OBSERVED_PROCESS` | `SUPPORTED` | `NOR-SRC-STATNETT-002` | Support separated authority and local-system constraints. | Does not imply the exact decision rules are fully captured in this package. |
| `NOR-INST-015` | Registration opened in June 2026 and applications for prequalification were scheduled to open from 17 August 2026. | `OBSERVED_PROCESS` | `SUPPORTED_WITH_SCOPE` | `NOR-SRC-STATNETT-003`, `NOR-SRC-STATNETT-004` | Date and maturity context for the flexibility register. | Must be rechecked after 17 August 2026 before claiming operational application outcomes. |
| `NOR-INST-016` | Across Elhub, GO/NECS, and flexibility admission, physical energy becomes economically actionable only through multiple institutional transformations. | `INSTITUTIONAL_INFERENCE` | `INFERENCE` | `NOR-INST-002`–`NOR-INST-015` | Support the relevance of intermediary CL–ECI layers. | Does not prove the specific CL architecture is correct or complete. |
| `NOR-INST-017` | Norwegian institutions provide strong comparative evidence for evidence classification, authority, quantity, identity, anti-reuse, settlement, and correction as real institutional problems. | `CL_ECI_ANALOGY` | `INFERENCE` | full package | Thesis and paper positioning. | Must not be written as “Norway validates CL–ECI.” |
| `NOR-INST-018` | A Norway-inspired GO reference case can test institutional state transitions without live integration. | `SIMULATION_PROPOSAL` | `PROPOSAL` | `NOR-GO_REFERENCE_CASE_SPEC` | Policy Lab case planning. | Must not be described as a NECS emulator, official decision, or external validation. |
| `NOR-INST-019` | A Norway-inspired flexibility reference case can test registration and prequalification boundaries. | `SIMULATION_PROPOSAL` | `PROPOSAL` | `NOR-FLEX_REFERENCE_CASE_SPEC` | Later case planning. | Must not imply actual mFRR access, pricing, activation, or payment. |
| `NOR-INST-020` | Evidence revision and discrepancy settlement may require a revision-aware Policy Lab object model. | `CL_ECI_ANALOGY` | `PROPOSAL` | `NOR-INST-003`, `NOR-INST-004` | Schema research and future design review. | Does not authorize runtime migration before a separate design decision. |

## Claims explicitly rejected

| Rejected claim | Reason |
|---|---|
| Norway operates an energy-backed currency. | No reviewed source supports this. |
| Norwegian electricity or petroleum directly backs the krone. | Institutional energy wealth and monetary backing are different claims. |
| Norway proves that Solarpunk or SPK works. | Norway does not test the current implementation or monetary design. |
| Policy Lab reproduces official Norwegian decisions. | No official rule-complete comparison has been performed. |
| Elhub aggregate data can authorize site-level issuance. | Aggregation and lack of attributable site authority prohibit the inference. |
| A GO proves physical electricity delivery to the certificate user. | NVE explicitly distinguishes disclosure from actual delivery. |
| Cancellation is equivalent to financial settlement or redemption. | Cancellation prevents reuse of an attribute; the settlement object differs. |
| Prequalification proves delivery. | Market admission precedes activation and performance. |
| A Norwegian reference simulation is external validation. | Validation requires expert review, real decision comparison, or attributable field evidence. |

## Promotion checklist

Before a claim moves into thesis prose, a paper, competition copy, or frontend text:

- [ ] source URL and access date remain valid;
- [ ] exact source wording has been rechecked;
- [ ] source role and institutional scope are explicit;
- [ ] observed rule is separated from project inference;
- [ ] Norway is not described as a CL implementation;
- [ ] no monetary conclusion is inferred from certificate or electricity-market processes;
- [ ] non-claim is carried into the output;
- [ ] empirical, simulation, implementation, and external-validation status remain separate.
