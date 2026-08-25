# Global AI Finance 2026 — Poster Storyboard

This is the information architecture for the poster if accepted. It is deliberately visual and claim-bounded; it is not the extended abstract pasted onto a board.

## Core poster sentence

> **Same evidence. Different explicit policy. Bounded quantity. Settlement can still fail.**

## Recommended poster title

**When Does Evidence Justify a Financial Claim?**  
*An Auditable Constraint Workbench for Admission, Quantity, and Settlement*

## Layout

### Top strip — research question

Large text:

> **You have external evidence behind a financial claim. What, exactly, does that evidence justify?**

Small supporting line:

> Policy Lab separates evidence assurance, policy admission, quantity ceilings, and settlement so one stage cannot silently stand in for another.

### Left column — the missing seams

One diagram only:

```text
EXTERNAL EVIDENCE
       ↓
   ASSURANCE
       ↓
VERSIONED POLICY
       ↓
    ADMISSION
       ↓
QUANTITY CEILINGS
       ↓
   SETTLEMENT
       ↓
RECEIPT / LINEAGE
```

Beside the arrows, four invariants:

- public / hashed ≠ stronger assurance;
- admitted ≠ arbitrary quantity;
- bounded claim ≠ settled claim;
- receipt ≠ source truth.

### Center column — dominant experiment

Header:

> **One pinned evidence object, two policies**

Evidence card:

```text
PUB-AUSGRID-001P
336 half-hour intervals
1–7 July 2012
actual assurance: L0
eligible surplus: 33.066 kWh
```

Split into two branches:

```text
                 SAME EVIDENCE
                      │
          ┌───────────┴───────────┐
          │                       │
    OPEN POLICY              PILOT POLICY
 LAB-CASE-OPEN-004       ENERGY-CASE-PILOT-005
          │                       │
 ADMIT WITH LIMIT              BLOCKED
      33.066 kWh       SIGNED_EVIDENCE +
          │             MIN_PROVENANCE
 EVIDENCE_BACKED_
     CAPACITY binds
```

The evidence hash should appear once beneath the split, not repeated as decoration.

Primary interpretive sentence:

> **Policy changes the financial consequence without changing what the evidence itself proves.**

### Right column — settlement and reproduction

Settlement visual:

```text
ADMITTED: 33.066 kWh
SETTLEMENT CAPACITY: 40%

covered     13.2264
shortfall   19.8396
result      PARTIAL
```

One sentence:

> Settlement is a later failure layer; it does not rewrite the evidence or admission decision.

Then a compact reproduction block:

- integrity: PASS
- schema validation: PASS
- decision reproduction: PASS
- stable assessment identity
- QR code → public reproduction/evaluator brief

### Bottom strip — limits / discussion

Header:

> **What this poster does not establish**

Use six short items, not prose:

- authenticated operator custody;
- certified meter truth;
- legal issuance authority;
- enforceable redemption;
- optimal pricing/policy;
- monetary adoption/performance.

Then one discussion prompt:

> **Which evidence transition should be tested next: stronger source assurance, institutional policy review, uncertainty pricing, or real settlement obligations?**

## 60-second poster walkthrough

> The question is how external evidence becomes authority for a financial claim. Policy Lab keeps four stages separate: evidence assurance, policy admission, quantity, and settlement. Here is one pinned public Ausgrid-derived case with 336 intervals. We deliberately keep it at L0. Under an open policy it is admitted up to 33.066 kWh, with evidence-backed capacity binding. Under a stricter pilot policy, the exact same evidence is blocked because signed evidence and stronger provenance are required. Then, even for the admitted case, a 40% settlement stress produces a separate shortfall. So the contribution is not an energy currency; it is making those seams explicit and reproducible so one layer cannot silently promote another.

## Three-minute walkthrough

1. **20 sec — problem:** external facts do not automatically answer authorization, quantity, or settlement.
2. **30 sec — architecture:** point to the vertical evidence→settlement diagram.
3. **60 sec — central case:** explain L0, open 33.066, pilot blocked.
4. **30 sec — settlement:** show 13.2264 covered / 19.8396 short.
5. **20 sec — reproducibility:** identities and PASS checks.
6. **20 sec — limits:** explicitly state no operator/legal/money claim.

## Live-demo policy

A live website can be shown if convenient, but the poster must stand alone.

Never make acceptance/presentation depend on:
- network access;
- GitHub availability;
- a live API;
- an LLM;
- a fresh external data download.

Static poster evidence is primary. The public workbench is supplementary.

## Visual anti-slop rules

- no generic fintech stock imagery;
- no decorative blockchain network graphic;
- no glowing AI brain;
- no wall of feature cards;
- no more than one architecture diagram;
- make `33.066`, `BLOCKED`, and `19.8396 shortfall` the dominant visual facts;
- limitations must be visible without opening a QR code;
- use exact language from the claim ledger.
