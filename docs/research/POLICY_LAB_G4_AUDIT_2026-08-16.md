# Policy Lab G4 hostile audit — 2026-08-16

## Audit target

This audit asks whether the current Policy Lab evidence package is ready to leave internal validation and be judged externally without enlarging the claims.

Runtime/code target tested before this audit note:

- PR #42 code head: `09f4c9ed3affd80b4c7811bc818d7cfd8eb68aae`
- PR merge checkout: `adf268e43876a583692b6b69bc6efe6f1fe0e006`
- canonical public case: `PUB-AUSGRID-001P`
- dedicated case run: `31899863661`

This document is a docs-only audit record created after the tested code target.

## Claim under test

The permitted evaluator-facing claim is:

> Policy Lab can take one bounded outside public energy-data object, preserve its source/assurance limitations, apply versioned deterministic constraints, produce different consequences under different declared policies, package the decision for verification/replay, and derive an inspectable R1–R4 constrained-claim assessment without promoting unresolved boundaries.

The audit does **not** test or permit a claim that Policy Lab has validated money, legal issuance, physical meter truth, production readiness, or the original owner/operator Gate 1B.

## Evidence inspected

The final code-target execution re-downloaded and verified the exact public mirror object before processing:

- archive SHA-256: `6949ffee7ef8e2260f229f8a7e3b992390187facaaf023bb933b811a11cd1a11`
- archive byte length: `14,973,763`
- bounded evidence hash: `ac0bc483f3da8d90c4b9281b46abdbc81177a9338525039bd0e346be12a1d93b`
- 336 half-hour intervals, 2012-07-01 through 2012-07-07
- bounded eligible surplus: `33.066 kWh`

Runtime outcomes remained:

- open policy → `ADMIT_WITH_LIMIT`, 33.066 kWh, `EVIDENCE_BACKED_CAPACITY` binding;
- pilot policy → `BLOCKED`, `SIGNED_EVIDENCE` + `MIN_PROVENANCE`;
- actual assurance → `L0`;
- settlement stress → `PARTIAL`, 13.2264 kWh covered / 19.8396 kWh shortfall;
- capsule integrity → `PASS`;
- capsule schema validation → `PASS`;
- decision reproduction → `PASS`.

The final run artifact ZIP was independently rehashed after download and matched GitHub's recorded digest:

`sha256:2d1b97313de42ea3fbe3ece12c7846f532ed88865472776a077ffd1ca5d03ef1`

The included `source-mirror.zip` independently rehashed to the frozen source digest and byte length above.

## Derived assessment result

Assessment schema:

`solarpunk.constraint.constrained_claim_assessment.v1`

Stable assessment identity:

`088067800c192a0d6854cc4a70f068f3590d4fc658df3622370bfcc7974e56dc`

Boundary result:

| Boundary | Status | Interpretation |
|---|---|---|
| R1 — economic information | `NOT_ASSESSED` | This case does not test whether energy is an economically informative signal for a defined economy/sector purpose. |
| R2 — claim-level evidence | `PARTIAL` | The bounded evidence object is usable with no blocking diagnostics, but trusted source-holder/operator attribution is not established. |
| R3 — binding constraint | `PARTIAL` | Rule-bound admission/issuance behavior is evidenced; pricing is open, settlement is scenario-mechanical only, governance is not assessed. |
| R4 — monetary performance | `UNTESTED` | No circulation, liquidity, acceptability, medium-of-exchange, or unit-of-account evidence exists in this case. |

R3 components:

- issuance/admission mechanism → `SUPPORTED`;
- uncertainty pricing → `OPEN`;
- settlement/delivery → `PARTIAL`;
- bounded governance → `NOT_ASSESSED`.

Assessment v1 deliberately rejects generic R4 promotion. A future R4 result requires a dedicated monetary-performance evidence validator rather than a self-declared override.

## Hostile findings and dispositions

### H1 — assessment identity was initially packaging-time dependent

**Finding:** the first assessment identity included run-specific receipt/capsule basis references. Equivalent evidence and decisions could therefore produce different assessment IDs solely because packaging timestamps changed.

**Disposition:** fixed. Assessment identity now excludes run-specific receipt/capsule/verification identity while retaining those objects as traceability references.

**Verification:** two different merge-checkout runs produced different capsule IDs but the same assessment ID:

- run `31899774152`, capsule `7a6aaf917a2cacd7a9db12e89e35fa78b59b8a790b3a113a93b7a3d5d48f044c`;
- run `31899863661`, capsule `79b0b87b7c1af8cb3ea243f19740bb6ef47694f97618e2fc5451d0e30c5c4256`;
- both → assessment `088067800c192a0d6854cc4a70f068f3590d4fc658df3622370bfcc7974e56dc`.

### H2 — generic R4 override was too permissive

**Finding:** the first builder allowed an externally supplied basis reference to advance R4. That was not enough to guarantee real monetary-performance evidence had actually been validated.

**Disposition:** fixed. Assessment v1 hard-stops R4 at `UNTESTED`. A future change requires a dedicated monetary evidence-validation path.

### H3 — assessment derivation did not initially lock cross-object agreement

**Finding:** the first CLI trusted that case, evidence, decisions, receipt, and capsule belonged together before deriving the assessment.

**Disposition:** fixed. The builder CLI now fails on case/evidence identity mismatch, decision/evidence mismatch, receipt/decision mismatch, or a present capsule whose closed-world verification is not `PASS`.

### H4 — assessment had no independent closed-world verification command

**Finding:** generation alone was not enough for evaluator-facing replay.

**Disposition:** fixed. `scripts/verify_constrained_claim_assessment.mjs` independently reloads the case artifact set, checks cross-object agreement, rebuilds the assessment, and requires exact equality with the stored assessment. The final dedicated workflow executed this verifier successfully.

### H5 — README/evaluator narrative was stale

**Finding:** the README still described the next evidence step as a real L2 source and retained an older thesis-integration sequence, which understated the landed 001P evidence and conflicted with the final R1–R4 reconciliation.

**Disposition:** fixed. README now separates the R1–R4 research model from runtime stages, describes 001P as public-source L0 evidence, adds `ConstrainedClaimAssessment`, and keeps human Gate 1B/L1/L2 as stronger future validation rather than present truth.

### H6 — no public schema for the assessment object

**Finding:** the derived object would have been evaluator-facing without a protocol schema.

**Disposition:** fixed. `protocol/schema/constrained-claim-assessment.v1.schema.json` now freezes the public object structure and status vocabulary.

## Final integration checks

At the final code target, all repository suites triggered by PR #42 completed successfully:

- Secrets Scan → PASS
- Conformance Benchmark v1 → PASS
- External Case 001P → PASS
- Tests & Coverage → PASS
- solidity-tests → PASS
- solidity-security → PASS
- Case Workbench V2 CI → PASS
- Constraint Protocol Alpha CI → PASS

The dedicated External Case workflow additionally passed both assessment generation and assessment closed-world verification.

## Remaining limitations — not blockers for the public-evidence profile

These remain explicit and must survive every evaluator package:

- historical Ausgrid-hosted bytes have not been independently matched to the frozen mirror bytes;
- no source-holder/operator confirmation was performed;
- derived surplus is not directly metered grid export;
- assurance remains L0;
- original human owner/operator Gate 1B remains open;
- L1/L2 authentication is not established;
- pricing adequacy is not established by this case;
- settlement is a declared stress scenario, not enforceable delivery/redemption;
- bounded governance is not assessed;
- R1 is not assessed by this case;
- R4 is untested;
- repository dependency installation currently reports legacy npm audit findings, so production-security claims remain prohibited even though the project security/test workflows pass.

None of these limitations contradict the bounded public-evidence claim above.

## G4 verdict

> **POLICY LAB — G4 READY FOR EXTERNAL EVALUATION, PUBLIC-EVIDENCE PROFILE**

This means the current package is sufficiently frozen, reproducible, bounded, and evaluator-readable to seek an external verdict without another feature tranche.

It does **not** mean the original human source-holder Gate 1B is complete, that stronger source assurance has been achieved, or that the financial claim has crossed R4 into money.

The next value-producing action is external evaluation using this evidence core. Product expansion, another public-dataset hunt, C3/C4 work, token work, AI decision authority, or broad UI work is not justified by this audit.
