# FC 2027 Short Paper Blueprint

**Decision:** FIRE  
**Deadline:** 2026-09-17, 23:59 AoE (UTC-12)  
**Format:** anonymous short paper, 8 pages + references, no appendices  
**Required title prefix:** `Short Paper:`

Official CFP: https://www.ifca.ai/fc27/cfp.html

## Proposed title

> **Short Paper: Non-Promotion Semantics for Evidence-Backed Financial Claims**

Alternative subtitle for internal use only:

> Separating Evidence, Authorization, Quantity, and Settlement in a Reproducible Constraint Architecture

## One-paragraph thesis

Evidence-backed financial systems combine several logically distinct transitions: deciding what an external source proves, determining whether that evidence is admissible under a policy, bounding the quantity a claim may authorize, and determining whether the resulting obligation can settle. Existing credential, policy, reserve-attestation, and financial-contract systems address important subsets of these transitions, but they do not by themselves define a common safety discipline preventing downstream operations from silently upgrading upstream evidence or collapsing admission, quantity, and settlement into one success state. Policy Lab studies a deterministic **non-promotion architecture** in which each transition is explicit, versioned, independently inspectable, and linked by stable identities.

## What is NOT novel

Do not make any of these claims:

- general policy-as-code is novel;
- verifiable credentials imply truth unless Policy Lab fixes them;
- reserve proofs cannot gate issuance elsewhere;
- machine-readable financial-contract semantics are new;
- audit logs or deterministic policy evaluation are new.

Relevant prior systems already cover these primitives:

| System / standard | Existing capability relevant to this paper |
|---|---|
| W3C Verifiable Credentials Data Model 2.0 | cryptographic/verifiable representation; verifiability does not itself imply truth; verifier applies business rules |
| Open Policy Agent / Rego | general policy-as-code; structured input to policy decisions; policy diagnostics/audit tooling |
| Cedar | explicit authorization policy language; Allow/Deny plus determining policies and diagnostics |
| Chainlink Proof of Reserve | reserve attestations can feed circuit breakers and mint/issuance restrictions |
| ACTUS | machine-readable financial-contract terms, event logic, cash-flow semantics, and risk-scenario separation |

## Defensible contribution

The paper should claim a **compositional safety semantics** for evidence-backed financial claims:

1. **Assurance non-promotion** — hashing, receipts, policy execution, packaging, or settlement cannot increase the assurance of the source evidence. A stronger assurance state requires a separately justified transition.
2. **Admission/quantity separation** — a passed admission gate does not authorize the requested amount. Quantity is computed independently from comparable ceilings; the minimum applicable ceiling binds.
3. **Settlement separation** — settlement status cannot rewrite the evidence or admission decision. A valid bounded claim may still settle partially or fail.
4. **Policy identity integrity** — a decision commits to a specific policy identity/version. Changing policy changes decision identity while preserving the identity of unchanged evidence.
5. **Cross-object agreement** — receipts and portable assessments must reference the exact case/evidence/policy/decision/settlement objects from which they were built; tampering or substitution fails verification.

These should be expressed as explicit invariants, not only prose.

## Research questions

**RQ1.** Which classes of overclaim become observable when evidence assurance, admission, quantity, and settlement are represented as separate state transitions?

**RQ2.** Can non-promotion invariants prevent downstream technical artifacts from being misinterpreted as stronger evidence than the underlying source supports?

**RQ3.** Can deterministic cross-object identities make policy substitution, quantity overreach, and settlement failure reproducible and attributable?

## Evaluation plan

### E1 — controlled cases

Use the existing controlled case pack to demonstrate different binding ceilings under fixed executable semantics.

Report at minimum:
- blocked admission;
- evidence-backed ceiling;
- provenance/policy ceiling;
- resource-context ceiling;
- settlement outcomes.

### E2 — outside-data checkpoint

Use `PUB-AUSGRID-001P` exactly as currently bounded:

```text
actual assurance: L0
intervals: 336
open policy: ADMIT_WITH_LIMIT / 33.066 kWh
binding constraint: EVIDENCE_BACKED_CAPACITY
pilot policy: BLOCKED / SIGNED_EVIDENCE + MIN_PROVENANCE
40% settlement: PARTIAL / 13.2264 covered / 19.8396 short
R4: UNTESTED
```

Do not promote this into source/operator verification.

### E3 — adversarial/integrity evidence

A source audit on 2026-08-25 found that the core adversarial properties are already executable, and this opportunity tranche added two reviewer-facing named assertions so the paper can cite them directly.

#### Implemented / directly evidenced

1. **Policy divergence / policy identity:** the same Ausgrid evidence is evaluated under open and pilot policy identities with different rule-level consequences.
2. **Settlement separation:** the public case preserves the upstream decision while settlement is separately represented as `PARTIAL` at 40% capacity.
3. **Semantic-vs-delivery identity scope:** `verify_claim_assessment_package.mjs` perturbs delivery/prose-only content and requires the semantic assessment identity to stay fixed while package-content identity changes.
4. **Cross-object substitution/tamper checks:** the verifier hard-fails disagreement across case identity, evidence hash, policy metadata/hash, decision outputs, settlement, research projection, receipt and capsule identities.
5. **Closed-world reproduction:** capsule verification must report decision reproduction `PASS`.
6. **Exact human/machine agreement:** the human assessment report must be an exact deterministic rendering of the machine package.
7. **Byte-identical rebuild:** the external-case workflow rebuilds both machine package and human report and compares them byte-for-byte with the first build.
8. **Assurance capability non-promotion:** `fc-non-promotion-invariants.test.mjs` promotes the committed unsigned OPS evidence capabilities to signed/operator-signed/cryptographically-verified while retaining the stale evidence identity; `verifyEvidenceEnvelopeHash` must reject the object with an evidence-hash mismatch.
9. **Quantity authority non-promotion:** the same named test supplies an oversized caller `quantity` while creating a decision-bound claim; the accepted claim remains derived from the deterministic DecisionResult admitted maximum (126) rather than the caller-supplied value.
10. **Existing broader safeguards:** the core suite independently tests stale-hash evidence tampering, self-authored high-assurance assertions, browser-supplied signed evidence without trusted operator context, source/manifest receipt tampering, deterministic decision identities, blocked-before-quantity semantics, and settlement state separation.

The named FC tests passed the exact Constraint Protocol core/conformance gate after correction of the initial fixture-selection error. They complement rather than replace the broader pre-existing tests.

### E4 — related-system comparison

Do not create a superficial feature checklist. Compare each system by the transition it primarily governs:

```text
source authenticity / evidence semantics
→ policy authorization
→ quantity bound
→ obligation / settlement semantics
→ cross-object reproducibility
```

The intended conclusion is not that Policy Lab replaces those systems. It is that a financial-claim workflow needs explicit semantics at the seams between them.

## Eight-page structure

Target body allocation (references excluded):

1. **Introduction & motivating failure** — 0.8 page
2. **Related systems / missing seam** — 1.2 pages
3. **Model and invariants** — 1.7 pages
4. **Implementation** — 1.0 page
5. **Evaluation** — 2.0 pages
6. **Limitations / threat model** — 0.7 page
7. **Conclusion** — 0.6 page

## Draft abstract

External evidence increasingly determines whether financial systems mint assets, accept collateral, recognize reserves, or trigger obligations. Yet the transitions from evidence to authorization, from authorization to quantity, and from quantity to settlement are often implemented by different mechanisms with different trust assumptions. We present Policy Lab, a deterministic constraint architecture for studying these seams. The system enforces non-promotion invariants: downstream operations cannot silently strengthen source assurance; admission does not imply unlimited quantity; settlement cannot rewrite the admission decision; and every decision commits to explicit evidence and policy identities. We evaluate the architecture using controlled cases and a pinned public Ausgrid dataset. The same L0 evidence is admitted with a 33.066 kWh ceiling under an open policy but blocked under a stricter policy requiring signed evidence and provenance; a 40% settlement stress then produces a 19.8396 kWh shortfall without changing the upstream evidence or admission decision. Package verification independently recomputes semantic and content identities, checks cross-object agreement, reproduces the human report exactly, requires closed-world decision reproduction, and rebuilds the package byte-identically. Named adversarial tests additionally show that source-assurance capability changes invalidate a stale evidence identity and that caller-supplied quantity cannot override a decision-bound admitted maximum. We position the contribution as a compositional safety layer between credential/attestation systems, policy engines, and financial-contract infrastructure rather than a replacement for those systems.

## Threats / non-claims

The paper must state:

- the Ausgrid checkpoint is public L0 evidence, not authenticated operator evidence;
- the system does not establish legal issuance authority;
- settlement stress is not proof of enforceable delivery/redemption;
- no monetary/circulation result (R4) is claimed;
- one worked outside-data case does not establish general field validity;
- the current evaluation tests semantics/reproducibility, not economic optimality of the policy thresholds.

## Submission checklist

- [ ] anonymize manuscript and repository references as required by CFP
- [ ] use official Springer LNCS format
- [ ] title begins `Short Paper:`
- [ ] body <= 8 pages; references separate; no appendix
- [x] safety invariants are explicit and executable
- [x] named assurance non-promotion test passes core CI
- [x] named quantity authority non-promotion test passes core CI
- [x] semantic/content identity-scope probe exists
- [x] cross-object agreement verifier exists
- [x] exact human-report reproduction exists
- [x] closed-world decision reproduction exists
- [x] byte-identical package/report rebuild exists
- [ ] convert RC0 content master into anonymous LNCS manuscript
- [ ] related-work comparison cites primary sources in manuscript bibliography
- [ ] no substantial overlap with another simultaneously peer-reviewed proceedings/journal submission
- [ ] artifact/repository disclosure follows FC rules without breaking anonymity
