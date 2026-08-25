# Global AI Finance 2026 — Submission Capsule

This directory is the complete submission package for the work-in-progress poster route.

A polished abstract alone is **not** considered submission-ready. The capsule includes the outward artifact plus the internal evidence, briefing, ethics, obligation, and presentation controls needed to prevent overclaiming or owner surprise.

## Read in this order

### External artifact

1. [`POSTER_EXTENDED_ABSTRACT.md`](./POSTER_EXTENDED_ABSTRACT.md) — exact candidate title/abstract/keywords intended for submission.

### Evidence and owner briefing

2. [`CLAIM_EVIDENCE_LEDGER.md`](./CLAIM_EVIDENCE_LEDGER.md) — every material claim, source identity, allowed inference, and prohibited inference.
3. [`AUTHOR_SURPRISE_PROOFING_BRIEF.md`](./AUTHOR_SURPRISE_PROOFING_BRIEF.md) — what was submitted, what the system does/cannot do, headline results, and 10-second/30-second/2-minute explanations.
4. [`REVIEWER_QA.md`](./REVIEWER_QA.md) — likely poster/reviewer questions and bounded answers.

### Acceptance / presentation / owner controls

5. [`ACCEPTANCE_AND_OBLIGATIONS.md`](./ACCEPTANCE_AND_OBLIGATIONS.md) — known and unknown obligations if accepted; payment/copyright/travel stop conditions.
6. [`POSTER_STORYBOARD.md`](./POSTER_STORYBOARD.md) — visual poster architecture and 60-second/3-minute walkthroughs.
7. [`PORTAL_AND_OWNER_ACTIONS.md`](./PORTAL_AND_OWNER_ACTIONS.md) — identity, consent, affiliation, payment, and final portal gates that must not be guessed.
8. [`OVERLAP_AND_ETHICS.md`](./OVERLAP_AND_ETHICS.md) — FC'27 overlap separation, authorship/AI-use integrity, correction/withdrawal triggers.

### Machine control

9. [`SUBMISSION_MANIFEST.json`](./SUBMISSION_MANIFEST.json) — frozen venue facts, evidence identities, obligations, non-claims, owner-only fields, and capsule artifact list.
10. `scripts/check_submission_capsule.mjs` — verifies that the manifest agrees with the machine public checkpoint and that dangerous submission claims do not re-enter the outward abstract.

## Current readiness

`SURPRISE_PROOFED`

Meaning:
- outward artifact exists;
- material claims are evidence-bound;
- author can recover the submission from the private brief;
- reviewer Q&A exists;
- acceptance obligations are enumerated;
- poster/demo information architecture exists;
- portal/legal/financial owner gates are explicit;
- overlap/ethics guard exists.

It is **not yet `PORTAL_READY`** because owner-specific identity/contact/consent fields have not been frozen and the actual ConfTool form has not been checked field-by-field immediately before submission.

## Promotion to PORTAL_READY

Require:

- exact author display name;
- submission email;
- final affiliation wording;
- coauthor/presenter resolution if applicable;
- current ConfTool field review;
- confirmation that the route remains a poster/extended-abstract route rather than a proceedings-paper publication;
- owner review of any personal consent, originality, copyright, payment, or attendance commitment;
- passing submission-capsule checker on the final candidate revision.

## Doctrine

The outward submission should read like a specific research result, not a repository README or generated product pitch.

The internal capsule can be much more explicit and defensive than the outward artifact. Its job is to make sure:

> **nothing persuasive is unsupported, and nothing accepted later becomes a surprise.**
