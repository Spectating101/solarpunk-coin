# Global AI Finance Research Conference 2026 — Poster Extended Abstract

**Submission type:** Poster / work in progress  
**Deadline:** 2026-08-31  
**Conference:** 2026-12-14 to 2026-12-15, Taiwan  
**Submission system:** https://www.conftool.net/aifinconf2026/

## Title

**From Evidence to Financial Authority: A Reproducible Constraint Workbench for Evidence-Backed Financial Claims**

## Extended abstract

Financial systems increasingly depend on facts measured outside the financial system itself: reserve balances, collateral states, energy production, environmental certificates, asset valuations, insurance events, and other externally observed conditions. The existence of such data, however, does not by itself determine whether the data is sufficiently trustworthy for a particular financial use, whether a claim should be admitted, how large that claim may be, or whether it can ultimately settle. These decisions are often embedded in models, contracts, oracle arrangements, governance processes, or institutional rules, making the conversion from evidence to financial authority difficult to inspect and reproduce.

This work presents **Policy Lab**, an executable research workbench for making that conversion explicit. Policy Lab represents a proposed evidence-backed financial claim as a sequence of independently inspectable stages: evidence and source assurance, versioned policy admission, comparable quantity ceilings, settlement stress, and a deterministic decision receipt. The design deliberately prevents downstream technical operations—such as hashing, packaging, receipts, or policy execution—from silently upgrading the assurance of the underlying evidence.

The system’s central research object is therefore not a token or a single approval score, but a bounded decision explaining: (1) whether the available evidence is admissible under a declared policy; (2) which rule blocks the claim when admission fails; (3) the maximum quantity that can be justified when admission succeeds; (4) which comparable ceiling binds that maximum; (5) what happens when settlement capacity is insufficient; and (6) which stronger claims remain untested.

A public outside-data checkpoint demonstrates the method using a pinned Ausgrid dataset containing 336 half-hour intervals. The source is intentionally retained at its actual low assurance level (L0) rather than being promoted because it is public or reproducibly hashed. Under an open research policy, the evidence produces `ADMIT_WITH_LIMIT`, with a maximum supported quantity of **33.066 kWh** and evidence-backed capacity as the binding ceiling. The same evidence evaluated under a stricter pilot policy produces `BLOCKED` because signed evidence and stronger provenance are required. When the admitted quantity is stressed at 40% declared settlement capacity, the result becomes `PARTIAL`: **13.2264 kWh** is covered and **19.8396 kWh** remains short.

The demonstration therefore makes a simple but consequential point visible: **the same evidence can lead to different financial consequences under different explicit policies, while neither policy is allowed to rewrite what the evidence itself proves.** Admission is also kept separate from quantity, and quantity from settlement. Each result retains stable case, evidence, policy, calculator, decision, and assessment identities so that the reasoning chain can be reconstructed and challenged.

Policy Lab is positioned as a research and verification environment rather than a claim that the current energy evidence establishes a currency, stablecoin, legal issuance right, verified physical delivery, or market adoption. The outside-data case remains deliberately bounded: source/operator attribution, stronger authenticated evidence, legal enforceability, governance, and monetary performance remain open research questions.

The contribution is relevant to FinTech settings in which external evidence is expected to authorize financial consequences, including tokenized real-world assets, reserve or collateral claims, energy and environmental certificates, insurance triggers, and institutional policy engines. The current work focuses on the methodological and software question: **how can evidence, policy authority, quantity, and settlement be made independently inspectable without allowing one layer to silently promote another?**

The poster will present the outside-data checkpoint, the open-versus-strict policy divergence, the settlement shortfall, and the deterministic decision lineage. The goal is to obtain external criticism on the framework’s boundaries and identify which additional evidence or institutional cases are required before stronger claims can be justified.

## Keywords

FinTech; evidence-backed finance; tokenized assets; policy-as-code; auditability; reproducibility; settlement; financial infrastructure; Green FinTech

## Claim boundary for submission

Do not describe the Ausgrid checkpoint as an operator pilot, authenticated physical meter truth, legal issuance authority, or monetary validation.
