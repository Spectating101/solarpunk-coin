# Policy Lab Opportunity Decision — 2026-08-25

This document records **verified current opportunities** for Policy Lab. It is intentionally stricter than the earlier synthetic Gauntlet route table: current official rules override stale route assumptions.

## Decision summary

| Route | Status | Deadline | Why |
|---|---|---:|---|
| Global AI Finance Research Conference 2026 — Poster | **FIRE NOW** | 2026-08-31 | Work-in-progress poster route; all FinTech topics; Taiwan; accepted posters enter conference program; no advisor requirement stated. |
| Financial Cryptography and Data Security 2027 — Short Paper | **FIRE** | 2026-09-17 23:59 AoE | 8-page short-paper track explicitly welcomes work in progress and novel applications; Policy Lab fits authorization/trust, certification/audits, financial instruments, stablecoins/tokenized assets, empirical studies, and sustainability. |
| Software Sustainability Institute Fellowship 2027 | **FIRE** | 2026-10-05 | Up to three international Fellows; £4,000 activity budget; six-minute screencast; strong fit with reproducible research-software advocacy. |
| Journal of Open Source Software | **PREPARE — DO NOT SUBMIT YET** | Rolling | Public-development/open-source gates are plausible; research-impact/community-significance gate is not yet strong enough for low-risk submission. |
| NLnet Restack | **HOLD TO 2026-09-03 CALL** | First new deadline 2026-11-03 | Program is real and individuals outside Europe can be eligible, but Taiwan proposals need exceptional quality + a clear European dimension and call-specific hard criteria are not yet published. |

## 1. Global AI Finance Research Conference 2026 — FIRE NOW

Official sources:
- https://www.efmaefm.org/announcements/events.php
- https://www.conftool.net/aifinconf2026/

Verified facts:
- Conference: 2026-12-14 to 2026-12-15, Taiwan, in person.
- Submission deadline: 2026-08-31.
- Poster route explicitly welcomes work-in-progress on all conference topics.
- Poster submission is an extended abstract through ConfTool.
- Accepted posters are included in the conference program.
- Topics explicitly include blockchain/cryptocurrencies, DeFi, FinTech regulation, and Green FinTech; the event does **not** require every submission to be AI research.

Submission title:

> **From Evidence to Financial Authority: A Reproducible Constraint Workbench for Evidence-Backed Financial Claims**

Submission claim:

> Policy Lab is an executable research workbench that makes the conversion from external evidence to financial authority explicit. It separates evidence assurance, policy admission, quantity ceilings, settlement, and reproducible decision lineage, and demonstrates those boundaries on a pinned outside Ausgrid dataset.

Do not pitch this as a stablecoin or as validated operator evidence.

Package: `global-ai-finance-2026/`.

## 2. Financial Cryptography 2027 short paper — FIRE

Official source:
- https://www.ifca.ai/fc27/cfp.html

Verified facts:
- Deadline: 2026-09-17, firm, 23:59 AoE UTC-12.
- Short paper: 8 pages + references, no appendices.
- Title must begin `Short Paper:`.
- Anonymous submission required.
- Short papers explicitly target work in progress, novel applications, and future research avenues.
- Accepted short papers appear in Springer LNCS proceedings.

### Prior-art result

The paper **must not** claim novelty for the following ideas alone:

1. `evidence != authority`: W3C Verifiable Credentials explicitly states that credential verifiability does not imply truth and that verifiers apply their own business rules.
2. `policy as code`: Open Policy Agent and Cedar already separate policy evaluation from application logic and provide determining-policy diagnostics/auditability.
3. `reserve evidence gates issuance`: Chainlink Proof of Reserve already connects reserve data to minting restrictions, circuit breakers and reserve thresholds.
4. `financial obligations as machine-readable objects`: ACTUS already standardizes financial-contract logic and separates contract terms from external risk scenarios.

### Narrow contribution worth submitting

The defensible FC contribution is the **composition and safety semantics**, not any one primitive:

> A deterministic evidence-to-claim pipeline in which evidence assurance cannot be silently promoted by downstream processing; admission and quantity are separate decisions; comparable quantity ceilings identify the binding constraint; settlement is evaluated as a distinct failure layer; and the complete cross-object decision state is reproducible from stable identities.

Required paper contribution package before submission:
- formalize at least three non-promotion/safety invariants;
- compare Policy Lab directly against OPA/Cedar, W3C VC, Chainlink PoR, and ACTUS;
- add adversarial tests for evidence promotion, policy substitution, quantity overreach, and settlement failure;
- report controlled cases + the outside Ausgrid checkpoint as evaluation, not as proof of universal validity.

Package: `fc27-short-paper/`.

## 3. SSI Fellowship 2027 — FIRE

Official sources:
- https://www.software.ac.uk/programmes/fellowship-programme/apply-fellowship-programme
- https://www.software.ac.uk/guide/fellowship-programme-application-video-guide

Verified facts:
- Applications close 2026-10-05.
- Around 20 Fellows are selected; up to three can be international Fellows.
- Each Fellow gets a £4,000 activity budget over the Fellowship period.
- Main application: six-minute voice-over slide screencast + application form.
- Suggested screencast: 1 min who you are, 1 min what you do, 4 min Fellowship plan.
- Shortlisting weighting: Ambassadorship 30%, Fellowship Plan 70%.
- International applicants must show concrete benefit to UK research culture/capability or international collaboration, and address logistics/time-zone/travel issues.

Application theme:

> **Evidence-Bounded Research Software: Making Computational Decisions Reproducible and Challengeable**

Policy Lab is the worked reference implementation, not the entire Fellowship plan.

Package: `ssi-fellowship-2027/`.

## 4. JOSS — PREPARE, DO NOT SUBMIT YET

Official sources:
- https://joss.readthedocs.io/en/latest/submitting.html
- https://joss.readthedocs.io/en/latest/review_criteria.html
- https://joss.readthedocs.io/en/latest/paper.html

The software is close on engineering quality but JOSS 2026 has hard pre-review gates for sustained public development **and demonstrated research impact**. A public repo alone is insufficient.

Current strong signals:
- >6 months public history;
- iterative PR/issue history;
- OSI license;
- CI/tests/reproducibility;
- contribution/support paths;
- reusable deterministic research artifacts;
- outside-data checkpoint.

Current weak signal:
- external research use/adoption/community influence.

Submission gate:

> Do not submit JOSS until at least one concrete community-readiness signal exists: accepted relevant presentation, documented independent reproduction/use, external research request/integration, or another equally inspectable impact signal.

The Global AI Finance poster is therefore strategically useful beyond its own CV line.

Package: `joss/`.

## 5. NLnet Restack — HOLD TO CALL OPEN

Official sources:
- https://nlnet.nl/restack/
- https://nlnet.nl/restack/eligibility/
- https://nlnet.nl/restack/guideforapplicants/
- https://nlnet.nl/propose/

Verified facts:
- Calls reopen 2026-09-03; first new deadline 2026-11-03 12:00 CEST.
- First proposal size: €5,000–€50,000.
- Individuals can receive grants; no categorical exclusion of applicants.
- Applicants outside the EU/Horizon-associated geography can be eligible only for exceptional quality + unique expertise + a clear European dimension.
- Eligible activities include scientific research, FOSS development, validation, software quality, testing/CI, documentation, usability, deployability and packaging.
- Proposals are scored on technical excellence/feasibility (30%), relevance/impact/strategic potential (40%), and cost effectiveness (30%).

Decision:

> **Do not submit or invest heavily before 2026-09-03.** The call-specific hard criteria are not yet published. On September 3, evaluate the exact call against a prewritten European-dimension thesis; FIRE only if that thesis is native to the call rather than bolted on.

Package: `nlnet-restack/`.

## Explicit kills / deprioritized routes

- **ACTUS Use Case Competition:** stale website messaging; 2025 competition already concluded and winners were announced in June 2026.
- **InnoServe / advisor-dependent Taiwan student competitions:** package preserved, but not primary while no genuinely aligned faculty advisor exists.
- **WPI FinTech 2026 / Morgan State FinTech 2026 / ICFT 2026:** submission deadlines already passed.
- **USENIX Security 2027 Cycle 1:** mandatory registration deadline already passed on 2026-08-18; not a live option for this cycle.
- **OTF Information Controls Research Program:** strong funding but wrong native problem; it targets censorship/surveillance and internet freedom rather than Policy Lab’s evidence-to-financial-authority problem.

## Execution order

1. Submit Global AI Finance poster by Aug 31.
2. Run FC short-paper writing/evaluation sprint to Sep 17.
3. Prepare SSI Fellowship application to Oct 5.
4. Re-evaluate Restack on Sep 3 against published call-specific criteria.
5. Use poster/FC/independent reproductions as impact evidence, then submit JOSS when the hard impact gate is defensible.
