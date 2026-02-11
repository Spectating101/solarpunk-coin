# SolarPunk Protocol Grant Sponsorship Package

Last updated: 2026-02-11 (UTC)

## 1) Project Summary
SolarPunk Protocol builds energy-backed derivative infrastructure on Polygon so renewable producers can hedge volatility using physics-priced contracts and on-chain solvency controls.

Core stack:
- Empirical layer: renewable signal and volatility evidence (`empirical/`).
- Pricing/risk layer: Python pricing engine (`scripts/pillar3_engine.py`).
- Settlement layer: Solidity clearinghouse (`contracts/SolarPunkOption.sol`).
- Delivery layer: frontend UX (`frontend/`).

## 2) Problem and Need
- Renewable producers face high volatility and curtailment risk.
- Existing hedging access is limited for small and medium operators.
- Climate-finance infrastructure needs transparent and testable risk controls.

## 3) Proposed Work (Grant Scope)
1. Security hardening and deployment readiness.
2. Oracle/data reliability and monitoring.
3. Pilot execution and validation reporting.
4. UX and SDK improvements for non-dev users.

## 4) Budget Tiers
- Baseline: $50,000 / 6 months.
- Stretch: $75,000 / 6 months.

Budget mapping:
- Security and remediation.
- Oracle and infrastructure operations.
- Pilot incentives and integration support.
- UX/SDK and documentation.

## 5) Deliverables
1. Auditable test/deployment artifacts.
2. On-chain pilot hedge execution evidence.
3. Stability and risk tuning report.
4. Operational runbooks for maintainers and reviewers.

## 6) Technical Evidence
Canonical evidence should be generated from:
- `bash verify_all.sh --contracts-in-docker --json-report=artifacts/verify_health.json`
- `python3 scripts/build_grant_readiness_pack.py`

Generated evidence bundle:
- `docs/grants/GRANT_READINESS_PACK.md`
- `docs/grants/GRANT_READINESS_PACK.json`

## 7) Submission Bundle (Canonical)
Use this order in grant forms/attachments:
1. `GRANT_SPONSORSHIP_PACKAGE.md` (this file)
2. `GRANT_PROPOSAL.md`
3. `docs/GRANT_BRIEF_POLYGON.md`
4. `docs/grants/GRANT_READINESS_PACK.md`

## 8) Reviewer Notes
- This package is intentionally evidence-first and regeneration-friendly.
- Rebuild the readiness pack immediately before submission to keep timestamps and verification status current.
