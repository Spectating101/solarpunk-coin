# Global AI Finance 2026 — Private Research Brief

Read this if the poster is accepted after you have stopped thinking about it.

## What the submission asks

**Title:** *Evidence, Policy, and Settlement in Energy-Linked Financial Claims*

The paper asks one question:

> Once external evidence is available, how do we keep four decisions distinct: what the evidence supports, whether a policy accepts it, how much underlying quantity it can justify before valuation, and whether the resulting obligation settles?

Policy Lab is the method used to test that question. It is not the question itself.

## What the literature already covers

Do not pitch the paper as if the surrounding primitives are new.

- **Oracles:** external data delivery and trust/manipulation problems — Eskandari et al. (2021).
- **Verifiable credentials:** cryptographic verifiability does not itself establish truth or reliance — W3C VC 2.0.
- **Policy-as-code:** general explicit rule evaluation already exists — Open Policy Agent.
- **Financial-contract semantics:** machine-readable contractual events/cash flows already exist — ACTUS.
- **Proof of Reserve:** reserve evidence can already gate minting or trigger circuit breakers — Chainlink PoR.

Our bounded claim is the **composition**: preserve source assurance, evaluate admission, compute supported physical quantity separately from admission and valuation, then evaluate settlement separately.

## The worked experiment

### Evidence

- one de-identified Ausgrid customer;
- 1–7 July 2012;
- 336 half-hour intervals;
- public research copy retained at **L0**, the workbench's lowest assurance tier.

### Where 33.066 comes from

For every half-hour:

`surplus = max(PV generation - general load - controlled load, 0)`

Then sum the accepted interval surplus across the week.

Result: **33.066 kWh**.

This is:
- a derived physical surplus quantity;
- not directly metered export;
- not a price;
- not market value;
- not legal entitlement.

The open research policy maps one experimental energy-claim unit to one kWh of this underlying quantity. That one-for-one mapping is a research convention, not an economic exchange-rate claim.

### Policy sensitivity

**Research policy A — open**
- positive surplus required;
- no evidence blockers;
- compares evidence, resource-context and absolute quantity ceilings;
- evidence quantity binds;
- admits up to **33.066**.

**Research policy B — stricter**
- adds signed-evidence requirement;
- adds minimum provenance L2;
- same evidence stays unsigned L0;
- therefore **blocked before quantity is authorised**.

The policies are deliberately different researcher-declared configurations. They are **not** institutionally adopted, empirically calibrated, or claimed optimal. The experiment holds evidence fixed and varies admissibility requirements.

### Settlement sensitivity

Hold the admitted 33.066-unit claim fixed. Declare settlement capacity at 40%.

- covered: **13.2264 kWh**
- shortfall: **19.8396 kWh**
- result: partial

This is a stress scenario, not observed redemption or a default estimate.

## Why the result is worth discussing

The experiment produces three different kinds of failure/success without changing the underlying evidence object:

1. evidence remains low-assurance even though it is public and reproducibly hashed;
2. one policy admits the evidence while another blocks it;
3. an admitted bounded claim can still fail later at settlement.

That is the research result. The number 33.066 is only the worked quantity that lets those distinctions be tested concretely.

## What not to claim

Never say:
- Ausgrid validated the project;
- 33.066 is metered export or financial value;
- either policy is the correct policy;
- the project proves legal issuance or redemption;
- the 40% stress is empirical default evidence;
- there is an institutional pilot/customer;
- Policy Lab is a stablecoin/currency;
- one public case establishes general validity.

## If asked what is novel

Use this answer:

> The primitives are not new. The work tests an executable composition in which source assurance, policy admission, supported physical quantity and settlement are kept as separate states. The fixed-evidence experiment makes it possible to see exactly which layer changes the outcome and which layer does not.

If a reviewer shows an existing system that already provides the same composition with equivalent semantics and reproducibility, narrow the novelty claim rather than arguing around it.

## 10-second explanation

> We hold one external evidence object fixed and show that evidence quality, policy permission, supported quantity and settlement can produce different outcomes without being treated as the same thing.

## 30-second explanation

> The case uses 336 half-hour Ausgrid intervals. It derives 33.066 kWh of surplus. An open research policy admits that physical quantity; a stricter policy blocks the same evidence because it lacks signatures and stronger provenance. Then a separate 40% settlement stress leaves 19.8396 kWh short. The paper is about separating those decisions, not about claiming an energy currency or a correct price.

## What would make the research materially stronger

- independent reproduction by another researcher;
- authenticated higher-assurance source evidence;
- institutional review or calibration of the policies;
- a second domain with different evidence/settlement semantics;
- observed settlement rather than hypothetical stress;
- empirical work on pricing/uncertainty after the physical quantity stage.
