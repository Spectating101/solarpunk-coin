# Design: Public Lab Maintenance Mode (day-job durable)

**Date:** 2026-07-10  
**Status:** Proposed  
**Audience:** Maintainer (part-time) + future agents

---

## Problem

SolarPunk Public Lab v1.0 is already shipped on Sepolia as an inspectable energy-standard settlement laboratory. The maintainer is moving to a full-time day job and will not treat this as a career foundation. The project still needs an **objective best form**: valuable, citable, open source, publicly “launched” as a lab, able to wake up later if external demand appears — without requiring weekly engineering or a token/mainnet fantasy.

## Goals

1. **Freeze** Public Lab v1.0 as the permanent public endpoint (contracts, demo, docs, evidence).
2. **Protect authorship** under MIT via citation, NOTICE, trademark intent, and accurate framing.
3. **Minimize ops** to a quarterly checklist (~2–4 hours).
4. **Preserve optionality** for a later closed pilot if a real meter/inverter export or institutional hook appears.
5. **Stop false progress** (redeploys, peg experiments, launch theater, grant spam without signals).

## Non-goals

- Mainnet deploy, live peg, token sale, or paid product
- Becoming a full-time protocol company
- Competing with Energy Web Origin as an official EAC registry
- Daily/weekly operator cycles as a success metric
- Large repo cleanup / moving `IE-JDE/` (out of scope unless it blocks clarity)

## Research basis

| Pattern | Implication for SolarPunk |
|---------|---------------------------|
| Research software citation (CFF + Zenodo/Software Heritage) | Credit survives open source; tag a release and archive |
| Maintenance-mode READMEs | State “feature-complete / maintained as-needed” so silence ≠ abandonment |
| EAS / public attestation infra | Narrow reusable primitive > living monetary network for side projects |
| Energy Web Origin | Official certificates are a different product; keep niche = energy-constrained *settlement research* |
| Existing repo assets | MIT, `CITATION.cff`, `TRADEMARK.md`, `NOTICE`, Public Lab v1 docs already exist — tighten, don’t reinvent |

## Recommended product identity

> **SolarPunk Public Lab v1.0** is a permanent open-source Sepolia laboratory for energy-standard settlement experiments: verified renewable-surplus evidence → bounded SPK issuance → typed network payments → explicit shortfall accounting. Peg off. Not money, not a token sale, not mainnet.

**Public launch** = this lab is live and inspectable.  
**Come to life later** = optional closed pilot only when external data or funding appears.

## Architecture of the freeze

```
Canonical Sepolia stack (do not redeploy)
        │
        ▼
state/runtime/spk_v1.json  ←── quarterly sync when RPC works
        │
        ├── demo (GitHub Pages)
        ├── evidence pack
        └── Public Lab docs + MAINTENANCE.md
                │
                └── wake path: PILOT_DATA_ASK → L2+ → Pilot Report v1
```

## Success criteria

| Criterion | Measure |
|-----------|---------|
| Truth aligned | `AGENTS.md`, `CURRENT_STATUS.md`, runtime product label, social kit point at Public Lab v1 |
| Authorship clear | README status + citation + NOTICE + TRADEMARK unchanged in intent |
| Ops bounded | `MAINTENANCE.md` quarterly checklist; health may be “stale sync OK in maintenance mode” |
| No new deploy | Canonical addresses unchanged unless bytecode intentionally changes |
| Wake path documented | One page: when/how to leave maintenance mode |

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Fork steals narrative | Attribution + trademark intent + “official lab” = this repo |
| Stale chain index looks dead | Document last-good sync; quarterly refresh; don’t claim live metrics without sync |
| Overclaiming while dormant | Non-claims in README status banner |
| Maintainer guilt / thrash | Explicit “silence is OK” in maintenance mode |

## Decision

Adopt **Maintenance Mode** as the default operating state after a one-time freeze pack. Do not pursue mainnet or career-scale growth unless a documented external wake signal appears.
