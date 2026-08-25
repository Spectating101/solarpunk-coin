# Global AI Finance 2026 — Author Surprise-Proofing Brief

This document is for the project owner, not reviewers. If the poster is accepted after weeks or months of not thinking about Policy Lab, reading this file should be enough to recover the submission accurately.

## What was submitted

**Type:** work-in-progress poster extended abstract  
**Candidate title:** **When Does Evidence Justify a Financial Claim? An Auditable Constraint Workbench for Admission, Quantity, and Settlement**

## One-sentence thesis

Policy Lab studies how external evidence becomes financial authority by keeping **evidence assurance, policy admission, quantity bounds, and settlement** separate and reproducible instead of treating them as one success state.

## What Policy Lab actually does

Given a declared case:

1. preserve the evidence object and its actual assurance state;
2. evaluate a named/versioned policy;
3. return `BLOCKED` or `ADMIT_WITH_LIMIT`;
4. if admitted, compute comparable quantity ceilings and identify the binding one;
5. evaluate settlement separately;
6. emit stable identities/receipts/assessment artifacts so the path can be reproduced.

Short form:

`evidence → assurance → policy → admission → quantity → settlement → lineage`

## The headline public case

Case: `PUB-AUSGRID-001P`

- 336 half-hour intervals;
- 1–7 July 2012;
- public evidence retained at **L0**;
- eligible surplus: **33.066 kWh**;
- open policy → `ADMIT_WITH_LIMIT` → **33.066 kWh**;
- binding constraint: `EVIDENCE_BACKED_CAPACITY`;
- pilot policy → `BLOCKED`;
- blockers: `SIGNED_EVIDENCE`, `MIN_PROVENANCE`;
- 40% settlement capacity → `PARTIAL`;
- covered: **13.2264 kWh**;
- shortfall: **19.8396 kWh**;
- R4 monetary performance: **UNTESTED**.

## Why the result matters

The interesting result is **not** that 33.066 is economically important.

It is that one can inspect three different questions independently:

- Is this evidence admissible under this policy?
- If yes, how much does the declared evidence/policy support?
- If admitted, can the obligation settle?

The same evidence can be admitted under one policy and blocked under another without either policy changing what the evidence itself proves.

## What Policy Lab cannot currently do

It does **not** currently establish:

- authenticated source-holder custody for the public case;
- certified physical meter truth;
- owner/operator confirmation;
- legal issuance authority;
- enforceable delivery or redemption;
- production readiness;
- correct/optimal financial pricing;
- correct/optimal policy thresholds;
- market demand or adoption;
- monetary circulation/liquidity/unit-of-account performance;
- that a constrained claim is money.

## 10-second explanation

> Policy Lab asks how much a financial claim can actually be justified by the evidence behind it. It separates evidence quality, policy permission, quantity limits, and settlement so one layer cannot quietly stand in for another.

## 30-second explanation

> We ran the same pinned public energy evidence through two explicit policies. One admits a maximum of 33.066 kWh; the stricter policy blocks the same evidence because it requires stronger provenance. Then a 40% settlement stress produces a separate shortfall. The point is not the energy number itself—the point is that evidence, authorization, quantity, and settlement stay independently inspectable and reproducible.

## Two-minute explanation

> A lot of financial systems depend on facts measured somewhere else—reserves, collateral, energy, certificates, insurance events. Verifying that a file or attestation exists is only the first question. Someone still has to decide whether that evidence is good enough for a financial use, how much it supports, and what happens if the resulting obligation cannot settle.
>
> Policy Lab makes those decisions explicit. Evidence enters with an assurance level. A versioned policy either blocks or admits it. If it admits, the system computes quantity ceilings and reports the binding one. Settlement is a separate stage. The whole path gets stable identities so you can reproduce which evidence and policy produced which decision.
>
> In the public case, we use a pinned Ausgrid-derived dataset with 336 half-hour intervals. We deliberately keep it at L0 assurance. Under an open research policy, it is admitted up to 33.066 kWh. Under a stricter pilot policy, the identical evidence is blocked because signed evidence and stronger provenance are required. Then, when we stress the admitted claim at 40% settlement capacity, settlement is partial: 13.2264 is covered and 19.8396 is short.
>
> So the contribution is not 'we built an energy currency.' It is an executable way to expose where evidence stops justifying a financial claim, which rule binds it, and which stronger claims remain unproven.

## If someone asks “is this blockchain?”

> The current research contribution is upstream of any particular blockchain. Historical blockchain/SPK components exist in the repository, but the present Policy Lab workbench is about evidence, policy authority, quantity constraints, settlement, and reproducible decision lineage. A blockchain can record or execute a decision, but it does not by itself improve the evidence behind that decision.

## If someone asks “is this AI?”

> No AI decision authority is required for the current Policy Lab mechanism. The conference accepts broader FinTech topics. The work is deterministic research software, not an LLM agent making financial decisions.

## If someone asks “is 33.066 the value of the asset?”

> No. It is the maximum quantity supported by that exact evidence/policy configuration in the research case. It is not a market price, legal entitlement, or economic valuation.

## If someone asks “did Ausgrid work with you?”

> No institutional collaboration is claimed. The research case uses a pinned public Ausgrid-derived dataset and retains it at L0 assurance.

## If someone asks “so what is actually novel?”

> Not policy-as-code, credentials, receipts, or settlement individually. The research contribution is the explicit **non-promotion composition**: evidence assurance, admission, quantity, and settlement remain distinct, with stable identities and fail-closed boundaries so downstream artifacts cannot silently upgrade upstream evidence.

## Things never to say

- “Ausgrid validated us.”
- “This verifies physical energy production.”
- “This proves issuance rights.”
- “This is a stablecoin/currency.”
- “The policy computes the correct economic value.”
- “The settlement test proves redemption.”
- “We have a pilot/customer/adoption.”
- “The public case is independent validation.”
- “R4 is supported.”

If any of those statements becomes true later, require new inspectable evidence before changing the wording.
