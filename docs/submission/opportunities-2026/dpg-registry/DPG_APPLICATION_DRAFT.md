# Policy Lab — Digital Public Goods Registry Application Draft

**Status:** pre-submission evidence ledger  
**DPG Standard basis:** current public questionnaire / DPG Standard 1.1.6  
**Solution category:** Open Software

This file is an application working document, not a claim that Policy Lab has already been recognized as a Digital Public Good.

The official review is binary: every applicable DPG Standard requirement must pass. Submit only after the evidence links below exist on the exact public revision and the official questionnaire has been rechecked for changes.

## General information

**Solution name**  
Policy Lab

**Short description**  
Open research software that makes evidence-backed financial decisions inspectable by separating evidence assurance, policy admission, quantity limits, settlement consequences, and reproducible decision lineage.

**Website**  
https://spectating101.github.io/solarpunk-coin/demo/

**Source**  
https://github.com/Spectating101/solarpunk-coin

**Current machine surface**  
https://github.com/Spectating101/solarpunk-coin/blob/main/CURRENT_SURFACE.json

---

## Indicator 1 — SDG relevance

**Proposed SDG:** SDG 16 — Peace, Justice and Strong Institutions  
**Primary target:** 16.6 — effective, accountable and transparent institutions

**Draft answer**

Policy Lab provides open, reproducible infrastructure for inspecting how evidence becomes decision authority. A reviewer can inspect the evidence assurance, policy identity, blocking or binding rule, supported quantity, settlement consequence, and reproducible lineage of a case. This is relevant to accountable and transparent decision processes. Policy Lab does not claim that it has already improved institutional outcomes at scale.

**Evidence**

- `PUBLIC_INTEREST.md`
- public workbench and outside-data checkpoint
- deterministic decision receipts / assessment package

**Status:** READY AFTER MERGE

---

## Indicator 2 — Open licensing

**License:** MIT

**Evidence**

- `LICENSE`
- `CITATION.cff`

The open-source license applies to Policy Lab code in this repository. Third-party dependencies and datasets retain their own terms.

**Status:** PASS

---

## Indicator 3 — Clear ownership

**Owner:** Christopher Ongko (`Spectating101`)

Policy Lab is currently an independently maintained project. Yuan Ze University is an academic affiliation and is not represented as owner, operator, sponsor, validator, or endorser absent a separate public agreement.

The historical phrase `Solarpunk Bitcoin Project` in the repository's MIT copyright notice is an originating project label, not a separate legal entity that owns the current Policy Lab workbench.

**Evidence**

- `GOVERNANCE.md`
- `CITATION.cff`
- repository ownership/history

**Third-party code/data**

Dependencies and public datasets retain their own licenses. Policy Lab does not claim ownership of Ausgrid source data or third-party libraries.

**Status:** READY AFTER MERGE; reviewer may request additional ownership evidence

---

## Indicator 4 — Platform independence

**Core technologies**

- Node.js / ECMAScript
- React
- Vite
- HTML / CSS
- JSON / CSV
- SHA-256 identities
- Git / GitHub Actions for the current hosted development workflow

**Closed/proprietary dependency assessment**

The current Policy Lab core does not require a proprietary application server, proprietary database, or proprietary model API. The public build is a static web application and can be hosted by any conventional static file server.

GitHub Pages is the current hosting provider, but it is not architecturally mandatory. GitHub Actions is used for the hosted CI/reproduction workflow, but the underlying scripts and tests can be run with Node.js outside GitHub.

The pinned public Ausgrid checkpoint currently obtains a frozen mirror from Hugging Face during CI. The source bytes are cryptographically pinned by hash and can be preserved or served from another location without changing the evidence identity. Hugging Face is therefore a current distribution host, not a required closed runtime authority.

Historical blockchain/testnet integrations are secondary reference surfaces and are not mandatory for the current Policy Lab workbench.

**Evidence**

- `CURRENT_SURFACE.json`
- `frontend/package.json`
- `package.json`
- `scripts/policy_lab_preflight.mjs`
- `.github/workflows/external-case-001p-ausgrid.yml`

**Status:** PASS WITH EXPLICIT WRITEUP

---

## Indicator 5 — Documentation

Policy Lab includes:

- public README and current-surface manifest;
- contribution instructions;
- executable schemas and policies;
- deterministic core tests;
- public-case evaluator material;
- reproduction workflows;
- claim-assessment schema/builder/verifier;
- privacy, security, governance, conduct, and public-interest documentation.

**Evidence**

- `README.md`
- `CURRENT_SURFACE.json`
- `CONTRIBUTING.md`
- `DOCS.md`
- `protocol/schema/`
- `protocol/policies-v2/`
- `packages/constraint-core/`
- `.github/workflows/`

**Status:** PASS

---

## Indicator 6 — Mechanism for extracting/importing non-PII data

**Answer:** Yes, Policy Lab uses and generates non-PII research data/content.

**Mechanisms**

- evidence can be imported from CSV;
- receipts and bounded decision artifacts are exported as JSON;
- portable claim-assessment packages are JSON;
- human assessment reports are generated as Markdown;
- schemas and policies are JSON-compatible machine-readable artifacts;
- the public case workflow preserves exact source/artifact hashes for reproduction.

No proprietary database format is required for the current research workbench.

**Evidence**

- `frontend/src/components/EvidenceLab.jsx`
- `protocol/schema/`
- `scripts/build_claim_assessment_package.mjs`
- `scripts/verify_claim_assessment_package.mjs`

**Status:** PASS

---

## Indicator 7 — Privacy and applicable laws

**Current privacy posture**

The current public workbench does not require accounts and does not implement a Policy Lab server-side PII database, advertising, or first-party analytics. A user-selected CSV is processed in the browser. The Evidence Lab explicitly states that files stay in the browser and that there is no upload server.

The project is independently maintained from Taiwan. The current design minimizes personal-data processing. Before any future feature collects, stores, or distributes PII on a server, the project must assess and implement the legal/privacy controls applicable to that deployment and its users.

This application should not claim blanket compliance with every jurisdiction.

**Evidence**

- `PRIVACY.md`
- `frontend/src/components/EvidenceLab.jsx`

**Status:** READY AFTER MERGE; recheck official legal-evidence wording before submission

---

## Indicator 8 — Standards and best practices

**Open standards / formats used**

- HTML
- CSS
- ECMAScript
- UTF-8
- JSON
- CSV
- SHA-256
- Git

Policy Lab does not claim formal certification against ISO standards or full WCAG conformance. The current interface uses semantic HTML/ARIA patterns where implemented, but no unsupported accessibility certification should be entered in the application.

**Best practices / controls**

- OSI-compatible MIT license;
- public version-controlled source;
- pull-request and issue workflow;
- deterministic automated tests;
- secrets scanning;
- dependency/security checks on relevant surfaces;
- machine-readable schemas;
- reproducible case artifacts and byte-identical rebuild checks;
- explicit privacy/security/conduct/governance documentation;
- fail-closed identity verification for bounded research artifacts.

**Evidence**

- `LICENSE`
- `SECURITY.md`
- `CODE_OF_CONDUCT.md`
- `CURRENT_SURFACE.json`
- CI workflows and test suites

**Status:** PASS WITH WRITEUP

---

## Indicator 9A — Data privacy and security

**Questionnaire selection for current public workbench:**

> PII can be collected locally by a user-selected file but is NOT stored and NOT distributed by the Policy Lab application service.

Policy Lab does not require PII. Users are instructed not to load or publish personal/customer-identifying evidence without a lawful reason. The current Evidence Lab processes selected files in browser memory and has no Policy Lab upload server.

Security reports have a documented process, and private/sensitive details must not be posted in public issues.

**Evidence**

- `PRIVACY.md`
- `SECURITY.md`
- `frontend/src/components/EvidenceLab.jsx`

**Status:** PASS FOR CURRENT STATIC SURFACE; confirm questionnaire option at submission time

---

## Indicator 9B — Inappropriate, misleading, and illegal content

The Policy Lab application is not a social/content-hosting service. A local CSV can be selected for browser-local analysis but is not uploaded, stored, or distributed by a Policy Lab application backend.

Public project contributions occur through GitHub. Project-controlled spaces are governed by `CODE_OF_CONDUCT.md`, and misleading/fabricated validation is explicitly prohibited. GitHub also provides platform moderation/reporting controls.

**Status:** PASS / NOT A CONTENT-DISTRIBUTION SERVICE; confirm reviewer interpretation

---

## Indicator 9C — Protection from harassment

The current Policy Lab product does not provide user-to-user messaging, social networking, or child-directed interaction features.

Open-source contributors may interact through GitHub issues and pull requests. `CODE_OF_CONDUCT.md` defines expected conduct, prohibited harassment, reporting, and maintainer enforcement. The project is not designed as a service for children and does not provide child-directed community functionality.

**Status:** PASS AFTER CODE OF CONDUCT MERGE

---

## Scale / deployment questions — answer without inflation

**Where actively deployed?**  
Public static research deployment on the web. Do not translate web accessibility into organizational adoption.

**Who else is using the solution?**  
No organization, government, multilateral body, or independent production user should be named unless there is inspectable evidence at submission time.

**Different languages/regions?**  
Current primary public interface is English. Do not claim multilingual infrastructure unless it is implemented.

**Programs / highlights**  
List only accepted presentations, reviewed registries, publications, fellowships, competitions, or independently documented reproductions that have actually occurred by submission time.

---

## Pre-submit hard gate

Do not submit until all of the following are true on the same public commit:

- [ ] `PRIVACY.md` exists and matches current code behavior
- [ ] `SECURITY.md` exists and contains a sensitive-reporting path
- [ ] `GOVERNANCE.md` clearly identifies current ownership
- [ ] `CODE_OF_CONDUCT.md` covers contributor interaction and moderation
- [ ] `PUBLIC_INTEREST.md` states SDG relevance without impact inflation
- [ ] `CURRENT_SURFACE.json` declares these governance artifacts
- [ ] current-surface CI passes
- [ ] public site still states browser-local/no-upload behavior accurately
- [ ] official DPGA questionnaire is rechecked for changes
- [ ] no external adoption, legal compliance, or institutional validation is invented

After this gate passes, create the application at `https://app.digitalpublicgoods.net/` and answer from this ledger, updating only facts that have acquired new evidence.
