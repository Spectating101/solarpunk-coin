# Policy Lab document archive index

This is a navigation and preservation index, not runtime authority. Files stay at their existing paths; no historical record is moved or deleted.

Start with [README](../../README.md), [CURRENT_SURFACE.json](../../CURRENT_SURFACE.json), [AGENTS](../../AGENTS.md), and the executable checks. [DOCS](../../DOCS.md) remains the documentation index.

## Maintenance records

The [2026-10-05 audit handoff](AUDIT_REPAIR_HANDOFF_2026-10-05.md), [repair report](AUDIT_REPAIRS_2026-10-05.md), and [2026-10-06 visual refinement record](UI_VISUAL_REFINEMENT_2026-10-06.md) describe dated sessions. Their counts, addresses and CI results must not be reused as current claims. The consolidation handoff/inventory live in draft PR #75; they are decision records, not release authority.

## Retained handoff and status records

Last-change dates below come from Git history on the reviewed baseline. A recent timestamp or a title containing CURRENT, MASTER or FINAL does not confer authority.

| Retained document | Role | Last Git change | Use / disposition |
| --- | --- | --- | --- |
| [.claude/HANDOFF.md](../../.claude/HANDOFF.md) | entrypoint redirect | 2026-08-25 | Preserve; inspect executable objects before reuse. |
| [CURRENT_STATUS.md](../../CURRENT_STATUS.md) | research / historical session context | 2026-08-24 | Preserve; inspect executable objects before reuse. |
| [HANDOFF.md](../../HANDOFF.md) | entrypoint redirect | 2026-10-05 | Preserve; inspect executable objects before reuse. |
| [MASTER_HANDOFF.md](../../MASTER_HANDOFF.md) | research / historical session context | 2026-06-08 | Preserve; inspect executable objects before reuse. |
| [PROJECT_RECOVERY.md](../../PROJECT_RECOVERY.md) | research / historical session context | 2026-08-14 | Preserve; inspect executable objects before reuse. |
| [docs/archive/pre-pivot/project/AUDITOR_HANDOFF_CHECKLIST.md](../../docs/archive/pre-pivot/project/AUDITOR_HANDOFF_CHECKLIST.md) | archived reference record | 2026-05-05 | Preserve; inspect executable objects before reuse. |
| [docs/archive/pre-pivot/project/GOVERNANCE_STATUS.md](../../docs/archive/pre-pivot/project/GOVERNANCE_STATUS.md) | archived reference record | 2026-05-05 | Preserve; inspect executable objects before reuse. |
| [docs/archive/pre-pivot/project/SECURITY_AUDIT_STATUS.md](../../docs/archive/pre-pivot/project/SECURITY_AUDIT_STATUS.md) | archived reference record | 2026-05-05 | Preserve; inspect executable objects before reuse. |
| [docs/exploration/TIER_C_STATUS.md](../../docs/exploration/TIER_C_STATUS.md) | archived reference record | 2026-07-02 | Preserve; inspect executable objects before reuse. |
| [docs/foundation/FOUNDATION_STATUS.md](../../docs/foundation/FOUNDATION_STATUS.md) | archived reference record | 2026-07-02 | Preserve; inspect executable objects before reuse. |
| [docs/ops/AUDIT_REPAIR_HANDOFF_2026-10-05.md](../../docs/ops/AUDIT_REPAIR_HANDOFF_2026-10-05.md) | dated maintenance record | 2026-10-05 | Preserve; inspect executable objects before reuse. |
| [docs/project/AUDITOR_HANDOFF_CHECKLIST.md](../../docs/project/AUDITOR_HANDOFF_CHECKLIST.md) | research / historical session context | 2026-05-05 | Preserve; inspect executable objects before reuse. |
| [docs/project/DAILY_EXPERIMENT_STATUS.md](../../docs/project/DAILY_EXPERIMENT_STATUS.md) | research / historical session context | 2026-07-06 | Preserve; inspect executable objects before reuse. |
| [docs/project/FRONTEND_HANDOFF.md](../../docs/project/FRONTEND_HANDOFF.md) | research / historical session context | 2026-05-21 | Preserve; inspect executable objects before reuse. |
| [docs/project/GOVERNANCE_STATUS.md](../../docs/project/GOVERNANCE_STATUS.md) | research / historical session context | 2026-05-05 | Preserve; inspect executable objects before reuse. |
| [docs/project/LOCAL_AGENT_INTERFACE_HANDOFF.md](../../docs/project/LOCAL_AGENT_INTERFACE_HANDOFF.md) | research / historical session context | 2026-07-14 | Preserve; inspect executable objects before reuse. |
| [docs/project/MASTER_PLATFORM_HANDOFF.md](../../docs/project/MASTER_PLATFORM_HANDOFF.md) | research / historical session context | 2026-07-14 | Preserve; inspect executable objects before reuse. |
| [docs/project/PROGRAM_PACKAGING_AND_LAB_UX_HANDOFF.md](../../docs/project/PROGRAM_PACKAGING_AND_LAB_UX_HANDOFF.md) | research / historical session context | 2026-08-04 | Preserve; inspect executable objects before reuse. |
| [docs/project/PUBLIC_PROOF_STATUS.md](../../docs/project/PUBLIC_PROOF_STATUS.md) | research / historical session context | 2026-05-14 | Preserve; inspect executable objects before reuse. |
| [docs/project/SECURITY_AUDIT_STATUS.md](../../docs/project/SECURITY_AUDIT_STATUS.md) | research / historical session context | 2026-05-05 | Preserve; inspect executable objects before reuse. |
| [docs/project/V2_IMPLEMENTATION_HANDOFF.md](../../docs/project/V2_IMPLEMENTATION_HANDOFF.md) | research / historical session context | 2026-07-14 | Preserve; inspect executable objects before reuse. |

## Boundaries and deferred work

- Frontend redesign and old platform-shell experiments remain deferred. Use frontend/src/App.jsx, frontend/src/app/routes.js and current visual guards to assess the shipped interface.
- SolarPunk/SPK, operator, contract and derivatives documentation describes historical reference machinery. Archived writers, deployment workflows and package publishers stay archived.
- Norway institutional dossiers and thesis work remain adjacent research and are preserved without editing. Digital Tax, Invisible Ledger and other projects remain outside this consolidation.
- Controlled cases remain non-empirical; the public Ausgrid checkpoint remains actual L0; R4 remains UNTESTED. A receipt, package or a CI result cannot close an external-evidence gate.

## Updating this index

Add a dated record here and link it from DOCS only when it helps navigation. Reconcile claims with executable objects; do not create a competing current-state handoff. A canonical surface change requires CURRENT_SURFACE.json and scripts/check_current_surface.mjs to change together.
