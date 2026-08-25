# Policy Lab Privacy

Policy Lab is a public research-software workbench. This privacy statement applies to the **current Policy Lab public surface** identified by `CURRENT_SURFACE.json` and deployed at the public URL listed there. Historical SolarPunk / SPK reference code in this repository is not the current Policy Lab service.

## Current public deployment

The current Policy Lab website is a static browser application. It does not implement user accounts, a first-party application database, first-party advertising, or first-party analytics.

The Evidence Lab is intentionally browser-local:

- a CSV selected from the user's device is read with the browser File API;
- the current application does not upload that file to a Policy Lab server;
- validation, mapping, hashing, and receipt construction happen in the browser;
- raw uploaded rows are not included in decision receipts unless a user independently chooses to copy or publish them;
- downloaded receipts are saved by the user's own browser.

The bundled sample CSV is fetched from the same static deployment as an application asset.

## Personal data

Policy Lab does **not require personally identifiable information (PII)** to operate the current public research workbench. Users should not load names, email addresses, account identifiers, precise household identifiers, or other PII into evidence files unless they have a lawful reason to process that information and understand the risks.

Energy and financial records can become identifying when combined with other data. Public examples and the outside-data checkpoint are therefore deliberately bounded and de-identified where applicable. The public Ausgrid checkpoint does not establish customer identity or source-holder custody.

## Hosting and third parties

The public website is presently hosted with GitHub Pages. As with ordinary web hosting, the hosting provider may process standard network metadata such as IP addresses and request logs under its own policies. Policy Lab does not receive a first-party analytics feed from the current application.

Links from Policy Lab may navigate to GitHub, public datasets, academic sources, or other third-party services. Their privacy practices are governed by their own terms and policies.

Historical/reference routes may demonstrate older blockchain or external-service integrations. They are explicitly secondary references and should not be interpreted as required components of the current Policy Lab workbench.

## Data retention

The current Policy Lab static application does not provide a server-side user-data store. Browser memory is cleared according to normal browser/session behavior. Files or receipts that a user downloads are retained only where that user chooses to save them.

Repository issues, pull requests, and other contributions are hosted by GitHub and are public unless GitHub provides a private reporting mechanism. Do not place confidential evidence, private keys, customer-identifying data, or sensitive vulnerability details in public issues.

## Applicable law

The project is independently maintained from Taiwan. The current public design minimizes personal-data processing by not collecting or storing user PII in a Policy Lab application backend. The maintainer intends to comply with applicable Taiwan privacy law and to assess additional obligations, including laws applicable to a future deployment's users or operators, before introducing any feature that collects, stores, or distributes PII.

This statement is not a claim that every third-party deployment, historical component, or future integration automatically complies with every jurisdiction. Deployers are responsible for the legal obligations created by their own data sources, hosting, integrations, and users.

## Changes

A future change that introduces accounts, telemetry, server-side evidence storage, PII processing, or material third-party data transfer must update this document and the corresponding executable/privacy controls before it is represented as part of the current Policy Lab surface.
