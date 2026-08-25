# Policy Lab Public-Interest and Do-No-Harm Statement

Policy Lab is open research software for making evidence-bounded financial decisions easier to inspect, reproduce, and challenge. Its public-interest case is **accountability of decision processes**, not the claim that Policy Lab itself has already improved financial inclusion, energy systems, climate outcomes, or institutional performance.

## Sustainable Development Goal relevance

### Primary: SDG 16 - Peace, Justice and Strong Institutions

Policy Lab is most directly relevant to **Target 16.6: develop effective, accountable and transparent institutions**.

The workbench makes several normally hidden transitions explicit:

```text
evidence assurance
-> policy admission
-> bounded quantity
-> settlement consequence
-> receipt / lineage / reproduction
```

The intended contribution is methodological and infrastructural: a reviewer can inspect which evidence was used, which policy version applied, which rule blocked or bound the decision, what quantity was supported, and which uncertainties remain open.

This is relevance to an SDG target, not evidence that Policy Lab has already changed institutional outcomes at scale.

### Secondary: SDG 9 - Industry, Innovation and Infrastructure

Policy Lab is also relevant to research and open digital infrastructure through a reusable open-source constraint core, published schemas, deterministic tests, and reproducible case artifacts. This secondary relevance should not be represented as deployment-scale infrastructure impact.

## Intended beneficial uses

Policy Lab is intended for:

- research into evidence-backed financial claims and decision boundaries;
- reproducible policy comparison;
- education about the difference between evidence, authorization, quantity, settlement, and monetary status;
- external evaluation of decision logic and evidence provenance;
- development of inspectable, bounded decision workflows in related research domains.

## Do-no-harm controls

The project deliberately includes controls against overclaim:

- weak evidence is not upgraded by hashing, dashboards, signatures on downstream objects, receipts, or packaging;
- admission is separated from quantity so an accepted case does not automatically authorize the amount requested by a caller;
- settlement is a separate stage, so an admitted bounded claim can still show a partial or failed settlement outcome;
- public Ausgrid evidence remains L0 and is not represented as owner/operator validation;
- controlled cases are labeled non-empirical mechanism demonstrations;
- modeled context is not represented as observed production;
- R4 monetary/circulation performance remains untested;
- the public workbench does not custody funds or represent legal issuance authority;
- uploaded evidence in the current Evidence Lab is processed browser-locally rather than sent to an application upload server.

## Financial and legal safety

Policy Lab is not:

- investment advice;
- a token sale;
- a bank, exchange, broker, custodian, or payment institution;
- a production credit-scoring or eligibility service;
- a legal opinion on collateral, securities, redemption, or monetary status;
- proof that a public dataset is authenticated operator evidence;
- proof of physical delivery or enforceable settlement.

A user or deployer must not treat a Policy Lab research decision as a substitute for legal authority, contractual rights, independent source verification, or professional risk review.

## Data and privacy safety

Public examples should avoid unnecessary PII and confidential source material. Users should not publish personal/customer-identifying energy or financial data in repository issues or public case artifacts.

The current browser-local upload workflow is designed to minimize data transfer, but users remain responsible for lawful possession and processing of files they choose to inspect.

## Research integrity

Negative results are valid outputs. A case that is blocked, quantity-limited, partially settled, or left untested should not be converted into a positive claim for presentation purposes.

External criticism, failed reproduction, and contradictory evidence should be preserved and addressed rather than hidden merely because they weaken a competition, paper, or funding narrative.

## Changes in scope

If Policy Lab later becomes a production service, processes PII on a server, controls financial value, makes decisions about real people, or obtains institutional/legal authority, the current public-interest and risk controls will be insufficient. Such a change requires a new governance, privacy, security, legal, and impact review before the broader claim is made.
