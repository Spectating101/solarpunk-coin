# Norway Institutional Source Register

**Status:** authoritative-source inventory  
**Access date:** 2026-08-04  
**Rule:** official primary sources are preferred; secondary summaries may aid discovery but may not support registered claims where a primary source exists

## Source quality codes

- `LAW` — legislation or regulation.
- `REGULATOR` — regulator or official government authority.
- `SYSTEM_OPERATOR` — transmission/system operator or official registry authority.
- `MARKET_INFRASTRUCTURE` — official national market-data infrastructure.
- `TECHNICAL_DOCUMENTATION` — official system or API documentation.

## Registered sources

### `NOR-SRC-ELHUB-001`

- **Title:** Bli kjent med Elhub
- **Authority:** Elhub
- **Class:** `MARKET_INFRASTRUCTURE`
- **URL:** https://elhub.no/om-oss
- **Primary support:** national role; more than four million metering points; actor responsibilities; prior-day reporting; balance-settlement calculations; reporting of production to NECS; discrepancy settlement; authorization-based data sharing.
- **Use boundary:** institutional process and scale, not proof of individual data accuracy.

### `NOR-SRC-ELHUB-002`

- **Title:** Datakvalitet
- **Authority:** Elhub
- **Class:** `MARKET_INFRASTRUCTURE`
- **URL:** https://elhub.no/data-og-innsikt/datakvalitet
- **Primary support:** completeness; measured and finally estimated values; D+1 and D+5 quality requirements; changes after D+5 leading to discrepancy settlement.
- **Use boundary:** evidence-state and settlement-timing claims only.

### `NOR-SRC-ELHUB-003`

- **Title:** Tilgang til data fra Elhub
- **Authority:** Elhub
- **Class:** `MARKET_INFRASTRUCTURE`
- **URL:** https://elhub.no/data-og-innsikt/tilgang-til-data-fra-elhub
- **Primary support:** measured or estimated values; hourly or 15-minute resolution; D+1 availability; access and permission boundaries.
- **Use boundary:** does not grant access to private or attributable data.

### `NOR-SRC-ELHUB-004`

- **Title:** Avregningsgrunnlag for balanseavregningen
- **Authority:** Elhub technical documentation
- **Class:** `TECHNICAL_DOCUMENTATION`
- **URL:** https://dok.elhub.no/e27/avregningsgrunnlag-for-balanseavregningen
- **Primary support:** calculation of balancing-settlement basis; D+1 through D+5 recalculation; possible recalculation through D+13 when quality is insufficient.
- **Use boundary:** technical process; exact application requires version-specific review.

### `NOR-SRC-ELHUB-005`

- **Title:** Energy Data API
- **Authority:** Elhub API Portal
- **Class:** `TECHNICAL_DOCUMENTATION`
- **URL:** https://api.elhub.no/energy-data-api
- **Primary support:** public API structure and aggregate consumption/production datasets.
- **Use boundary:** v0 API may change; integration requires version pinning.

### `NOR-SRC-ELHUB-006`

- **Title:** Datakatalog
- **Authority:** Elhub
- **Class:** `MARKET_INFRASTRUCTURE`
- **URL:** https://elhub.no/data-og-innsikt/datakatalog
- **Primary support:** public datasets, CSV/XLSX availability, update frequencies, CC BY 4.0 licensing.
- **Use boundary:** each dataset requires separate field and aggregation review.

### `NOR-SRC-STATNETT-001`

- **Title:** Elcertificates and guarantees of origin
- **Authority:** Statnett
- **Class:** `SYSTEM_OPERATOR`
- **URL:** https://www.statnett.no/en/for-stakeholders-in-the-power-industry/system-operation/the-power-market/elcertificates-and-guarantees-of-origin/
- **Primary support:** NECS role; issued certificates; account inventories; transactions; annual settlement; approval and account processes.
- **Use boundary:** supplement quantity definition with regulation where exact legal wording is needed.

### `NOR-SRC-LOVDATA-001`

- **Title:** Forskrift om opprinnelsesgarantier for produksjon av elektrisk energi
- **Authority:** Lovdata / Norwegian regulation
- **Class:** `LAW`
- **URL:** https://lovdata.no/nav/forskrift/2007-12-14-1652
- **Primary support:** GO definition as confirmation of 1 MWh from a specified energy source, time, and place; Statnett as registry/issuing authority.
- **Use boundary:** current consolidated legal text must be rechecked before publication or rule implementation.

### `NOR-SRC-NVE-001`

- **Title:** Opprinnelsesgarantier og varedeklarasjon for strømleverandører
- **Authority:** NVE
- **Class:** `REGULATOR`
- **URL:** https://www.nve.no/energi/virkemidler/opprinnelsesgarantier-og-varedeklarasjon-for-stroemleverandoerer/
- **Primary support:** purpose of GOs; producer eligibility; disclosure role; attribute-market context.
- **Use boundary:** does not prove physical delivery or monetary backing.

### `NOR-SRC-NVE-002`

- **Title:** Electricity disclosure
- **Authority:** NVE
- **Class:** `REGULATOR`
- **URL:** https://www.nve.no/energy-supply/electricity-disclosure/
- **Primary support:** used GOs must be cancelled to prevent resale; disclosure does not refer to actual delivery of electricity to Norwegian end users.
- **Use boundary:** supports attribution/delivery distinction, not a general critique of certificate markets.

### `NOR-SRC-NVE-003`

- **Title:** Spørsmål og svar — Varedeklarasjonen
- **Authority:** NVE
- **Class:** `REGULATOR`
- **URL:** https://www.nve.no/energi/energisystem/energibruk/stroemdeklarasjoner/spoersmaal-og-svar-varedeklarasjonen/
- **Primary support:** GOs document renewable production; used GOs are deleted/cancelled; electrons cannot be separated by production source after entering the grid.
- **Use boundary:** explanatory source; formal claims should also reference regulation or the main disclosure page.

### `NOR-SRC-STATNETT-002`

- **Title:** Fleksibilitetsregisteret
- **Authority:** Statnett
- **Class:** `SYSTEM_OPERATOR`
- **URL:** https://www.statnett.no/for-aktorer-i-kraftbransjen/systemansvaret/kraftmarkedet/reservemarkeder/delta-i-reservemarkedene/fleksibilitetsregister/
- **Primary support:** register as contact point among balance service providers, grid companies, and Statnett; resource/group maintenance; prequalification applications; joint suitability evaluation by Statnett and local grid company; actor access requirements.
- **Use boundary:** does not document full mFRR activation, pricing, or settlement logic.

### `NOR-SRC-STATNETT-003`

- **Title:** Åpning av fleksibilitetsregisteret for registrering av små, aggregerte ressurser
- **Authority:** Statnett
- **Class:** `SYSTEM_OPERATOR`
- **URL:** https://www.statnett.no/for-aktorer-i-kraftbransjen/nyhetsarkiv/apning-av-fleksibilitetsregisteret-for-registrering-av-sma-aggregerte-ressurser/
- **Primary support:** registration opening in June 2026; requirement to register small aggregated resources; stated 17 August prequalification application date.
- **Use boundary:** time-sensitive; operational status must be rechecked after 17 August 2026.

### `NOR-SRC-STATNETT-004`

- **Title:** Tidslinje for åpning av mFRR-markedet for aggregerte ressurser
- **Authority:** Statnett
- **Class:** `SYSTEM_OPERATOR`
- **URL:** https://www.statnett.no/for-aktorer-i-kraftbransjen/nyhetsarkiv/tidslinje-for-apning-av-mfrr-markedet-for-aggregerte-ressurser/
- **Primary support:** staged opening plan and prequalification timeline.
- **Use boundary:** schedule, not evidence that resources have completed prequalification or settlement.

### `NOR-SRC-STATNETT-005`

- **Title:** Delta i reservemarkedene
- **Authority:** Statnett
- **Class:** `SYSTEM_OPERATOR`
- **URL:** https://www.statnett.no/for-aktorer-i-kraftbransjen/systemansvaret/kraftmarkedet/reservemarkeder/delta-i-reservemarkedene/
- **Primary support:** provider registration and resource prequalification as prerequisites for reserve-market participation.
- **Use boundary:** high-level entry page; detailed rules require linked market documents.

## Sources intentionally excluded from claim support

The following may provide background but are not authoritative for registered claims:

- YouTube explainers;
- promotional “electrified economy” narratives;
- crypto or tokenization marketing;
- unsourced claims that Norway’s electricity or petroleum backs its currency;
- secondary commentary on GO prices or politics;
- general national rankings without methodological review.

## Archival and reproducibility actions

Before thesis or publication freeze:

1. record exact access dates and page revision dates;
2. archive permissible snapshots or PDFs with source metadata;
3. hash archived source files;
4. preserve original Norwegian wording for legally material passages;
5. record translations as project translations, not official translations;
6. recheck time-sensitive flexibility-register status;
7. map each final thesis sentence to claim IDs and source IDs.
