# Global AI Finance 2026 — Reviewer Q&A (RC4)

These are short research answers for discussion, not marketing scripts.

## What is the research question?

Once external evidence is available, how should a financial decision distinguish four things: what the source evidence supports, whether a policy accepts it, how much underlying quantity it can justify before valuation, and whether the resulting obligation settles?

## Why is this a finance question rather than ordinary data governance?

Because the downstream consequences are financial: admission of a claim, the quantity the claim is allowed to carry, and settlement of the obligation. The evidence layer constrains those consequences but does not by itself determine them.

## What exactly is 33.066?

It is a **derived physical surplus quantity** in kWh for the selected seven-day case. It is not a price or market valuation.

For each half-hour:

`surplus = max(PV generation - general load - controlled load, 0)`

The accepted interval surplus is summed across 336 intervals to 33.066 kWh.

## Is 33.066 directly metered export?

No. The Ausgrid dataset provides gross PV generation and consumption channels. The workbench derives surplus conservatively as generation minus general and controlled load, floored at zero. We explicitly do not call it a metered export channel.

## Why turn kWh into “claim units” at all?

Only to exercise the decision architecture. In the open research policy, one experimental energy-claim unit maps one-for-one to one kWh of supported physical quantity. This happens **before monetary valuation**. The experiment does not set a price, exchange rate, legal entitlement, or fair value.

## Why is the evidence L0 if Ausgrid published the underlying dataset?

Because the research copy is public and reproducibly pinned, but this specific Policy Lab case does not have source-holder-confirmed custody, an operator cryptographic signature, or external corroboration. Public availability and hashing are useful integrity properties; they are not the same thing as authenticated custody.

## Are the two policies arbitrary?

They are deliberately researcher-declared comparison policies. That is part of the experiment, not something hidden. The open configuration asks whether low-assurance evidence can pass basic gates; the stricter configuration adds signed evidence and L2 provenance. Neither is claimed to be economically optimal, legally correct, or institutionally adopted.

## Then what does the policy comparison prove?

Only a bounded sensitivity result: with the evidence object held fixed, changing the admissibility requirements changes the financial consequence. Under the open policy the evidence-supported quantity binds at 33.066. Under the stricter policy the same unsigned L0 evidence is blocked before quantity is authorised.

## Why not just call this a policy engine?

Policy engines already exist. Policy Lab uses explicit policies but studies the surrounding composition: source assurance before the policy decision, physical quantity after admission, and settlement after quantity. The research question is at those handoffs, not the existence of if/then rules.

## How is this different from an oracle?

Oracle research studies how external information gets into a smart-contract system and the trust/manipulation problem at that boundary. This experiment starts from an available evidence object and asks what happens **afterward**: assurance, admissibility, supported quantity, and settlement.

## How is this different from verifiable credentials?

W3C VC already makes an important distinction: technical verifiability does not itself establish that the underlying claims are true or should be relied upon. Policy Lab treats a resulting assurance state as an input to a separate financial-policy and quantity decision.

## How is this different from Open Policy Agent?

OPA is general policy-as-code infrastructure and already decouples policy decisions from application logic. Policy Lab is not claiming to invent that. The work studies how evidence assurance, a policy decision, a separately calculated supported quantity, and later settlement fit together in a financial-claim workflow.

## How is this different from ACTUS?

ACTUS provides algorithmic financial-contract semantics and separates known contract terms/current risk factors from uncertain future conditions. Policy Lab sits further upstream in this case: it asks how an external evidence object becomes admissible and how much underlying physical quantity is allowed to enter a claim before valuation/contract settlement.

## How is this different from Proof of Reserve?

Proof-of-reserve infrastructure already shows that external reserve evidence can gate minting or trigger circuit breakers. That is relevant prior art, not something we claim to invent. RC4 asks whether a more general evidence → admission → physical quantity → settlement composition can be made explicit and reproducible.

## What is actually novel?

The narrow claim is the executable **composition and experiment**, not any primitive. The fixed-evidence case represents source assurance, policy admission, supported physical quantity and settlement as different states, then varies policy and settlement while keeping the evidence object fixed.

If equivalent prior work already provides the same composition and semantics, the novelty claim should be narrowed.

## Why use the Ausgrid dataset?

It gives a public outside-data case with half-hour PV generation and consumption channels, so the quantity calculation can be inspected rather than fabricated as a synthetic fixture. The associated Ratnam et al. dataset paper provides the empirical source context.

## Why should I trust the 33.066 calculation?

Trust it as a reproducible calculation on the pinned research case, not as certified operator truth. The source archive and evidence object are cryptographically pinned, the derivation is explicit, and the case is rebuilt by CI. Source assurance nevertheless remains L0.

## Why is admission separate from quantity?

Passing an admissibility rule answers “can this evidence support this kind of claim under this policy?” It does not logically answer “how much?” Quantity is therefore evaluated separately against the applicable ceilings.

## Why is settlement separate?

A claim can be admissible and bounded but still fail operationally at settlement. The 40% stress demonstrates that later failure without rewriting the earlier evidence or policy decision.

## Is the 40% settlement result empirical?

No. It is a declared sensitivity/stress scenario. It is not an estimated default probability, observed redemption event, or proof of enforceable delivery.

## Why 40%?

It is a deliberately simple stress point chosen to make the separation visible. RC4 makes no inference from the specific 40% value about real settlement probabilities.

## Does the work value an energy asset?

No. Pricing is downstream of the current experiment. The work only bounds the physical quantity that the evidence/policy configuration supports. Valuation would require additional assumptions about price, uncertainty, legal rights and market structure.

## Is this a stablecoin or cryptocurrency paper?

No. Historical blockchain components exist in the broader repository, but this submission does not claim a currency, stablecoin, legal tender, monetary adoption, or validated token system.

## Is it an AI paper?

No AI authority is needed for the mechanism. The conference accepts broader FinTech work. We do not add an LLM merely to match the conference title.

## Is one public case enough validation?

No. It is enough for a work-in-progress methodological demonstration, not enough for general field validity, institutional validation, or economic calibration.

## What would be the strongest next test?

Any of the following would materially strengthen the work:
- independent reproduction;
- authenticated source/operator evidence at a higher assurance tier;
- institutional review/calibration of admission and quantity policy;
- a second domain whose evidence and settlement logic differ from energy;
- observed settlement obligations;
- empirical valuation/uncertainty work downstream of the physical-quantity stage.

## What would falsify or weaken the paper's framing?

- finding prior systems with the same explicit evidence/admission/quantity/settlement composition and equivalent reproducibility;
- discovering that the 33.066 derivation is not reproducible from the pinned case;
- inability to distinguish the result from ordinary allow/deny policy evaluation;
- evidence that the proposed separation has no useful consequence in real institutional decisions.

## What is the current strongest limitation?

External validity. The mechanism is highly inspectable, but the outside-data case remains L0, the policies are researcher-declared, and settlement is a stress scenario. That is why the submission is a work-in-progress poster rather than a claim of deployed financial validation.
