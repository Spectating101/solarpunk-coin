# Policy Lab — handoff redirect

There is no authoritative Markdown handoff for current runtime state.

Start with:

1. [`CURRENT_SURFACE.json`](./CURRENT_SURFACE.json) — machine-declared current surface.
2. `npm run policy-lab:surface` — verify that declaration against the repository.
3. [`README.md`](./README.md) — human-facing orientation.
4. The executable code/schema/workflow relevant to the task.

Historical handoffs, status files, roadmaps, thesis notes, SolarPunk/SPK operator documents, and research narratives remain useful as provenance or context, but they must be checked against executable state before reuse.

If the current surface changes, change `CURRENT_SURFACE.json` and its integrity tests rather than creating another competing handoff document.

For the local repository audit/repair session, see [the 2026-10-05 handoff and continuation context](./docs/ops/AUDIT_REPAIR_HANDOFF_2026-10-05.md). It records the repair branch, evidence, migration requirements and outstanding maintenance; it does not replace the executable starting points above.
