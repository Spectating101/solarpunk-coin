# Claims boundary — Policy Lab public default

**Bound revision:** `origin/main` `55fd6f2cf2eed25b589e91b5e3161e6ced68f5de`  
**Date:** 2026-08-26 — `Publish Policy Lab research surface [skip ci]`  
**Repository:** https://github.com/Spectating101/solarpunk-coin (public)  
**Live demo:** https://spectating101.github.io/solarpunk-coin/demo/ (HTTP 200)

Machine copy: [`docs/product/claims-and-nonclaims.v1.json`](product/claims-and-nonclaims.v1.json)

This file is the outbound claim boundary for the **public GitHub default**. It is not bound to the local `thesis/cleanup-canonical-pdf` checkout.

## SHA comparison (verified 2026-09-18)

Do **not** assume `main == public-lab-v1.0`. It does not.

| Ref | Peeled commit | Date | Equals `origin/main`? |
|---|---|---|---|
| `origin/main` | `55fd6f2cf2eed25b589e91b5e3161e6ced68f5de` | 2026-08-26 | yes (this is the bound revision) |
| `public-lab-v1.0` | `e2b9d9d31c35e32ac684e3e36fe6d3f0ea998d30` | 2026-07-02 | **no** (ancestor only) |
| `public-lab-v1.0-maintenance` | `9de148737bf9d6138c0a03d1d22bdd88b655c2a5` | 2026-07-10 | **no** (ancestor only) |
| `v0.2.0-field-ready-alpha` | `c32a4840eac19b9b5775cc7c08b9cab8dc4827bb` | 2026-07-20 | **no** (ancestor only) |
| live demo `/docs/demo/index.html` | SHA-256 `02f40d3c330b0c5f008b58d786584386a934efcb69da0b52a9f9be91fe9da349` | Last-Modified 2026-08-26 09:55:45 UTC | **matches** `docs/demo/index.html` on `origin/main` |

No public-lab tag currently points at `55fd6f2`. Claims stay on the public default commit. Historical Public Lab tags remain lineage, not current identity.

## Allowed claims (evidence-backed)

| Claim | Evidence |
|---|---|
| Public default is Policy Lab at `55fd6f2` | GitHub default branch; `CURRENT_SURFACE.json` |
| Live research surface is up | HTTP 200 at `/solarpunk-coin/demo/`; index bytes match `docs/demo/index.html` |
| Five controlled cases, not empirical validation | `TYN-001`, `AUS-001`, `PHX-001`, `OPS-001`, `CPT-001`; pack `empirical_claim: false`; `PUB-AUSGRID-001P` remains outside the interactive pack |
| `CPT-001` negative controls fail closed | Tampered retained-hash evidence is rejected (`evidence hash mismatch`); zero-surplus evidence is `BLOCKED` at `POSITIVE_SURPLUS` and does not admit |
| One outside-data checkpoint at actual L0 | `PUB-AUSGRID-001P`: 336 intervals, 33.066 kWh eligible surplus |
| Same evidence, different policy, different consequence | open `LAB-CASE-OPEN-004` → `ADMIT_WITH_LIMIT` 33.066 kWh; pilot `ENERGY-CASE-PILOT-005` → `BLOCKED` (`SIGNED_EVIDENCE`, `MIN_PROVENANCE`) |
| Settlement stress is separate scenario accounting | 40% capacity → `PARTIAL` 13.2264 covered / 19.8396 shortfall |
| Reproduction recorded for that checkpoint | integrity / schema / decision reproduction `PASS` |
| Research boundaries stay unresolved as recorded | R1 `NOT_ASSESSED`; R2 `PARTIAL`; R3 `PARTIAL`; R4 `UNTESTED` |
| Portable assessment package is a rendering | `policylab.claim_assessment_package.v0.1`; packaging does not add evidence authority |
| Historical SolarPunk / SPK is not the current product | `CURRENT_SURFACE.json` historical_reference |

**Preferred one-liner:**

> Policy Lab takes a bounded evidence object, keeps its assurance limits, applies versioned rules, and shows how much of a financial claim that evidence can justify — and where justification stops.

## Forbidden or misleading claims

| Do not say | Why |
|---|---|
| Digital Public Good / DPG recognized | Application draft exists; external DPGA review has not recognized it |
| Legal authority / legal issuance / legal money | No legal instrument |
| Settlement authority / enforceable delivery or redemption | 40% stress is scenario accounting only |
| Operator adoption / named field operator | No attributable owner/operator case |
| Calibrated or endorsed policy | Policies are researcher-declared sensitivity configs |
| `public-lab-v1.0` is the current public default | Tag peels to `e2b9d9d`, not `55fd6f2` |
| Public data is verified source truth | Checkpoint is actual L0 |
| Receipt / capsule / package proves physical meters or money | Those objects prove lineage and replay |
| Production-ready financial infrastructure | Research workbench |
| Scheduled live-smoke is currently green on `main` | It fails at Setup Node because root `package-lock.json` is gitignored; the demo itself is 200 |

## Smoke workflow note

Scheduled job `Policy Lab Live Smoke` (example: run `35312626720`, 2026-09-18) failed at **Setup Node**, before any page fetch. Root `package-lock.json` is intentionally gitignored; `frontend/package-lock.json` is kept. The workflow on `origin/main` used `cache: npm` plus `npm ci`, which requires a root lockfile.

That is an install/packaging failure, not a demo 404. This packaging branch isolates Playwright install so smoke can run without adding a root lockfile. Until that workflow change is on `main`, do not cite scheduled smoke as green.

## Reviewer ask

> Can you replay `PUB-AUSGRID-001P` and say whether the engine keeps L0 limits, attributes the blocking/binding rule, and refuses to promote the result into operator, legal, settlement, or monetary claims?

Not: “Is this a DPG / adopted / calibrated policy engine?”
