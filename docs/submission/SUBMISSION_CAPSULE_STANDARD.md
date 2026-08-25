# Policy Lab Submission Capsule Standard

A **submission capsule** is the minimum complete packaging unit for any conference, journal, competition, grant, fellowship, registry, or external evaluation route.

Repository cleanup, a polished abstract, or a deadline checklist alone do **not** count as submission packaging.

## Required layers

Every capsule must contain these layers before a route is considered submission-ready.

### 1. External submission artifact

The exact title, abstract/paper/application answers, keywords, figures, poster, demo, or other content intended for the external venue.

Requirements:
- written for the venue rather than copied from repository documentation;
- no generic marketing filler;
- every material claim must be supported by the claim ledger;
- limitations must be explicit where omission would create a misleading inference;
- no invented adoption, pilot, advisor, customer, operator validation, AI contribution, legal authority, or monetary performance.

### 2. Claim / evidence ledger

For every material claim:
- claim ID;
- outward wording;
- underlying machine or primary evidence;
- allowed inference;
- prohibited inference;
- confidence / boundary;
- exact object identity where applicable.

The purpose is to make polished language a rendering of bounded evidence rather than free-form persuasion.

### 3. Author surprise-proofing brief

A private briefing that lets the project owner understand the submission without rereading the repository:
- what was submitted;
- the one-sentence thesis;
- what the system actually does;
- what it cannot currently do;
- exact headline results;
- why those results matter;
- important implementation details;
- dangerous overclaims;
- 10-second, 30-second, and 2-minute explanations.

### 4. Reviewer / judge Q&A

Anticipate hostile and ordinary questions. Answers must distinguish:
- technical mechanism;
- empirical evidence;
- external validation;
- economic or legal interpretation;
- future work.

A submission is not ready if a plausible reviewer question reveals that the outward text depends on an unstated stronger claim.

### 5. Acceptance / obligation brief

Before submission, record what acceptance could obligate the owner to do:
- physical or virtual attendance;
- registration fees or currently unknown fees;
- travel;
- poster/demo/presentation format;
- publication or copyright terms known at submission time;
- camera-ready deadlines;
- public disclosure;
- author commitments;
- any uncertainty that must be checked after acceptance.

Never allow an acceptance to create a surprise commitment that could reasonably have been identified before submission.

### 6. Presentation / demo package

If acceptance implies presentation, prepare the structure before submission:
- poster storyboard or talk outline;
- primary visual;
- demo path;
- fallback static evidence if live demo fails;
- QR / reproduction destination when appropriate.

This does not require final graphic design before acceptance, but the information architecture must exist.

### 7. Portal and consent checklist

Separate content that can be prepared independently from actions requiring the owner:
- legal name;
- affiliation;
- contact details;
- copyright or privacy consent;
- payment;
- attendance commitment;
- declarations of originality or conflicts.

Never invent or silently consent to personal/legal/financial commitments.

### 8. Overlap / ethics check

Record:
- whether the route is peer reviewed;
- whether proceedings/publication occur;
- simultaneous-submission restrictions;
- relationship to other active manuscripts;
- AI-use disclosure requirements if any;
- conflicts, anonymity, or artifact rules.

### 9. Submission manifest

One machine-readable file should freeze:
- venue;
- deadline;
- submission type;
- candidate title;
- source revision;
- evidence object identities;
- external artifact paths;
- internal capsule paths;
- unresolved owner-only fields;
- known obligations;
- non-claims.

## Readiness states

- `DRAFT` — outward material incomplete.
- `EVIDENCE_BOUND` — material claims mapped to evidence.
- `SURPRISE_PROOFED` — author brief, Q&A, obligations, and ethics complete.
- `PORTAL_READY` — only owner-specific identity/consent/payment actions remain.
- `SUBMITTED` — submission receipt / ID recorded.
- `ACCEPTED` / `REJECTED` / `WITHDRAWN` — external outcome recorded.

## Anti-slop test

Before a capsule reaches `PORTAL_READY`, remove or rewrite any sentence that:
- opens with generic field-level hype;
- calls the work novel without identifying the exact novelty;
- uses adjectives where a result or mechanism should appear;
- hides limitations required to interpret a result;
- describes planned capability in the present tense;
- turns public availability into adoption;
- turns reproducibility into source truth;
- turns a receipt into delivery;
- turns admission into economic correctness;
- turns a constrained claim into money.

The desired style is specific, falsifiable, bounded, and legible to a skeptical domain reviewer.
