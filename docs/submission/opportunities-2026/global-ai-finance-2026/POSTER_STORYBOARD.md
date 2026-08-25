# Global AI Finance 2026 — Poster Storyboard (RC4)

The poster should read as one research experiment, not a product surface.

## Title

**Evidence, Policy, and Settlement in Energy-Linked Financial Claims**

## Research question

> Once external evidence is available, what does it support, will a policy admit it, how much underlying physical quantity can it justify before valuation, and what happens at settlement?

## Layout

### Top-left — prior work and the missing handoff

Keep this small. Five short rows, no literature wall.

| Existing mechanism | Already handles |
|---|---|
| Oracles | external data delivery / trust boundary |
| Verifiable credentials | cryptographic verifiability / provenance relationships |
| Policy engines | explicit rule evaluation |
| ACTUS | financial-contract terms / event logic |
| Proof of Reserve | reserve evidence linked to financial controls |

One line underneath:

> **This experiment isolates the handoff: evidence assurance → policy admission → supported physical quantity → settlement.**

### Center — the experiment

This is the dominant visual.

```text
                 EVIDENCE HELD FIXED
        Ausgrid public research case, 1–7 July 2012
                 336 half-hour intervals
                         L0
                          │
      per interval: max(PV - general load - controlled load, 0)
                          │
               DERIVED SURPLUS = 33.066 kWh
              not price; not metered export
                          │
           ┌──────────────┴──────────────┐
           │                             │
   RESEARCH POLICY A              RESEARCH POLICY B
      basic evidence gates          + signature + L2
           │                             │
   admit up to 33.066                  BLOCK
           │
    quantity stage only
    1 unit = 1 kWh here
    no monetary valuation
```

Small caption:

> Policies are researcher-declared sensitivity configurations, not calibrated or institutionally endorsed rules.

### Right — settlement sensitivity

```text
ADMITTED PHYSICAL CLAIM: 33.066
DECLARED SETTLEMENT CAPACITY: 40%

covered      13.2264 kWh
shortfall    19.8396 kWh
```

One sentence:

> A later settlement shortfall does not rewrite the earlier evidence object or admission result.

### Bottom-left — what the case actually demonstrates

Use four bullets:

- public + hashed evidence can remain low assurance;
- the same evidence can pass one declared policy and fail another;
- admission and supported quantity are different decisions;
- an admitted bounded claim can still fail at settlement.

### Bottom-right — limitations / next test

**Not established**
- authenticated Ausgrid custody for this research copy;
- directly metered export;
- legal issuance or redemption;
- optimal policy thresholds;
- monetary price/value;
- market adoption/general validity.

**Next useful evidence**
- independent reproduction;
- higher-assurance source evidence;
- institutional policy review;
- observed settlement.

## 60-second walkthrough

> This poster asks what happens after external evidence reaches a financial system. Existing work covers oracles, credentials, policy engines and contract semantics; I focus on the handoff between evidence, admission, supported quantity and settlement. The worked case uses 336 public Ausgrid half-hour intervals. Surplus is derived as PV generation minus general and controlled load, floored at zero, giving 33.066 kWh. That is a physical quantity, not a price or directly metered export. With the evidence held fixed, a basic research policy admits up to 33.066, while a stricter policy requiring signatures and L2 provenance blocks it. Then a separate 40% settlement stress leaves 19.8396 kWh short. The point is that those are different decisions, and the system can show exactly which one changes the outcome.

## Three-minute discussion path

1. **Research gap (30 sec):** prior mechanisms already solve individual pieces; identify the handoff under study.
2. **Data and derivation (40 sec):** 336 intervals; explain `max(PV - GC - CL, 0)`; state that 33.066 is derived physical surplus, not export or price.
3. **Policy sensitivity (50 sec):** evidence held fixed; research A admits; research B blocks; policies are comparison configurations.
4. **Settlement (30 sec):** 40% declared stress; show covered/shortfall.
5. **Limits and next evidence (30 sec):** L0, no operator collaboration, no optimal policy/valuation/redemption claim.

## Presentation rules

- no product screenshots as the main visual;
- no generic blockchain/AI imagery;
- no internal enum names in large type;
- do not headline “Policy Lab” above the research question;
- make `33.066 kWh`, `BLOCK`, and `19.8396 kWh short` visually dominant;
- place “derived surplus; not price; not directly metered export” immediately beside 33.066;
- label policies as **research policy A/B** in the poster, with technical IDs available only in small reproduction notes;
- references should be visible in a compact footer;
- public site / QR code is supplementary, not required to understand or reproduce the argument.
