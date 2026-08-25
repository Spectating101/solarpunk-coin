# Global AI Finance 2026 — Reviewer / Poster Q&A

Answers here are intentionally short enough to use in a poster session. Longer discussion should point back to the claim ledger and public artifacts rather than improvising stronger claims.

## 1. What problem are you solving?

Financial systems often depend on external evidence, but evidence verification, policy authorization, quantity, and settlement are different questions. Policy Lab makes those transitions explicit and reproducible so a downstream financial decision cannot quietly claim more than the upstream evidence supports.

## 2. Is this just a rules engine?

Not exactly. General policy engines already exist and are relevant prior art. Policy Lab’s research object is the **composition** of evidence assurance, policy admission, quantity ceilings, settlement, and cross-object lineage. A rule engine can decide allow/deny; Policy Lab additionally preserves what evidence was used, how much quantity was supported, which ceiling bound, and what later settlement did.

## 3. What is actually novel?

The bounded claim is a non-promotion architecture rather than any one primitive. Downstream operations cannot silently strengthen source assurance; admission does not imply arbitrary quantity; settlement does not rewrite admission; material evidence/policy changes change decision identity; receipts and assessments must agree with the objects they summarize.

Do not claim that policy-as-code, credentials, hashing, reserve attestations, or machine-readable contracts are individually novel.

## 4. Why is this a finance problem rather than just data governance?

Because the downstream decision is financial: whether evidence can authorize a claim, how much quantity that claim may carry, and whether its obligation can settle. The same discipline is relevant to collateral, reserves, tokenized real-world assets, energy/environmental certificates, and insurance triggers.

## 5. Why use an energy case?

Energy-linked claims give the workbench a concrete setting in which source assurance, measured quantity, modeled context, policy limits, and settlement can be kept distinct. Energy is the worked domain, not a claim that Policy Lab is only an energy product.

## 6. Why should I trust 33.066 kWh?

Trust it only as the deterministic output of the pinned evidence object and declared open policy. The archive and evidence identities are pinned, and the case can be reproduced. We do not ask the reviewer to treat 33.066 as authenticated operator truth, legal entitlement, or market value.

## 7. Why call the evidence L0 if the dataset is public?

Because public availability and hashing establish availability/integrity properties, not authenticated custody or source-holder confirmation for this specific research case. The workbench deliberately refuses that promotion.

## 8. Why does the same evidence produce two different outcomes?

Because policy is explicit rather than hidden. The open research policy accepts L0 evidence and becomes evidence-capacity-bound. The stricter pilot policy requires signed evidence and stronger provenance, so the same evidence is blocked. The evidence hash itself does not change.

## 9. Does that mean policy is arbitrary?

Policy choices are normative/institutional inputs. Policy Lab does not prove a chosen policy is optimal. It makes the policy version, rules, binding consequence, and decision identity explicit so those choices can be compared and challenged.

## 10. Why is admission separate from quantity?

Passing a gate answers “may this case proceed?” It does not answer “how much?” Policy Lab evaluates quantity ceilings separately so an admitted case cannot inherit an arbitrary requested amount.

## 11. Why is settlement separate?

A claim can be valid under its evidence and policy yet still encounter insufficient settlement capacity. Keeping settlement separate prevents a later operational failure from rewriting what evidence or policy originally justified.

## 12. Is the 40% settlement result empirical?

No. It is a declared stress scenario used to demonstrate the separation. It is not an estimated probability of default, observed redemption event, or legally enforceable delivery test.

## 13. Is this a stablecoin or cryptocurrency?

No current submission claim is that Policy Lab is a stablecoin, currency, or monetary system. Historical blockchain components exist in the repository, but the current research workbench studies evidence-backed financial claims and their constraints. Monetary performance remains untested.

## 14. Is this using AI?

The present mechanism is deterministic and does not delegate financial authority to an LLM. The conference accepts FinTech topics beyond AI. We intentionally do not add an AI wrapper merely to fit the event title.

## 15. Could AI be used later?

Potentially for evidence discovery, explanation, or assistance, but any AI-generated interpretation would need to remain downstream of explicit evidence and authorization controls. That is future work, not part of the current result.

## 16. How is this different from an oracle?

An oracle can supply data to a financial system. Policy Lab focuses on what happens **after data is available**: what assurance is assigned, which policy admits it, how much it supports, how settlement behaves, and whether the resulting objects remain reproducible and non-promoting.

## 17. How is this different from verifiable credentials?

Credentials can make provenance/signature relationships verifiable. They do not by themselves determine whether a verifier’s financial policy should accept the claim or how much quantity to authorize. Policy Lab treats credential/evidence assurance as an upstream input rather than the full decision.

## 18. How is this different from Proof of Reserve?

Proof-of-reserve systems can expose reserve data and sometimes gate minting. Policy Lab’s narrower research claim is a general compositional discipline across evidence assurance, policy admission, quantity ceilings, settlement, and reproducible identities. It is not a replacement for reserve attestation.

## 19. Is one Ausgrid case enough validation?

No. It is one outside-data checkpoint used to move beyond purely controlled fixtures. It demonstrates the mechanism on pinned external public data but does not establish field-wide validity, operator adoption, or universal policy suitability.

## 20. What would count as the next meaningful validation?

Examples include:
- attributable source/operator evidence with stronger assurance;
- independent reproduction by another researcher;
- application to a second domain with genuinely different constraint semantics;
- institutional review of policy choices;
- empirical evidence on uncertainty pricing or settlement behavior.

## 21. What can fail closed?

The current verifier rejects stale/tampered identities and cross-object disagreement. Evidence capability changes alter/violate evidence identity; decision-bound claim quantity comes from the admitted maximum rather than a caller-supplied override; assessment/package checks preserve agreement across evidence, policy, decision, and settlement objects.

## 22. What are your biggest limitations?

- public case remains L0;
- no owner/operator confirmation;
- derived eligible surplus is not direct proof of certified export;
- policy thresholds are not economically optimized;
- settlement is modeled stress, not legal redemption;
- governance and legal authority are not established by the current case;
- R4 monetary performance is untested;
- one outside-data case is not general validation.

## 23. What would falsify your own framing?

If existing systems already provide the same explicit non-promotion composition with equivalent evidence/authorization/quantity/settlement separation and reproducible cross-object semantics, the novelty claim should be narrowed. If reviewers cannot distinguish the contribution from ordinary policy-as-code after seeing the architecture, that is evidence the research framing needs work.

## 24. What do you want from this poster session?

Criticism on whether the separation is useful, which existing systems already solve parts of it, and which outside evidence/institutional cases would most strongly test the architecture. The poster is explicitly work in progress rather than a claim of completed market validation.
