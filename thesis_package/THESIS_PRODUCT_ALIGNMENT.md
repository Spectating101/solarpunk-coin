# Thesis ↔ Product Alignment (SPK v1)

**Updated:** 2026-06-08

**Monetary foundation (canonical):** `thesis_package/MONETARY_FOUNDATION.md`  
**Instrument comparison:** `thesis_package/INSTRUMENT_COMPARISON.md`  
**Live constraint map:** `thesis_package/FOUNDATION_EVIDENCE.md` (`npm run thesis:foundation`)

The repo treats **SPK v1** as the structural artifact for an **energy-anchored monetary unit with USD translation** — argued in the **stablecoin / monetary-design** space, not as an Ethereum or XRP L1 competitor. The thesis remains valuable; Chapter 5 framing gets targeted updates, not a full rewrite.

## What stays the same (thesis core)

These are unchanged and still defensible:

| Pillar | Claim | Status |
|--------|-------|--------|
| **Ch 3 — CEIR** | Bitcoin valuation vs cumulative energy cost is conditional | Empirics unchanged |
| **Ch 4 — Pricing** | Renewable-linked claims need explicit pricing & margin | `energy_derivatives/` unchanged |
| **Five constraints** | Data, issuance, pricing, settlement, governance | Still the analytical frame |
| **Academic posture** | Bounded claims, not "production currency" | Keep for examiner — but distinguish **thesis bounds** vs **product ambition** |

The central research question still works:

> Can energy act as a credible constraint for digital money through energy-linked contracts?

SPK v1 **strengthens** Pillar 3 by moving from "feasibility snippet" to "operating testnet money loop."

## What changes (packaging only)

### 1. Chapter 5 — Implementation narrative

**Old emphasis:** attested mint tx, contract rules, pilot stack as feasibility appendix.

**New emphasis (add, don't replace):**

- **Issuance anchor:** verified surplus kWh (energy-native in current bytecode)
- **Primary use:** network circulation (`SolarPunkCurrencySystem` payments)
- **Secondary sink:** optional energy redemption
- **Public evidence:** Sepolia runtime in `state/runtime/spk_v1.json`

Keep the May 2026 attested mint (`0x56fc…`) as **historical proof**. Add SPK v1 Sepolia circulation txs as **current system evidence**.

### 2. `THESIS_SOURCE_OF_TRUTH.md` — Implementation status table

Add rows:

| Stage | Status |
|-------|--------|
| SPK v1 local genesis | Available — `npm run spk:v1:launch` |
| SPK v1 Sepolia (attached) | Available — CurrencySystem on attested SPK + payment txs |
| SPK v1 Sepolia (unified lean) | **Done** — `0x8e189…` + `0x52016…`; operator cycles running |
| Energy-native on public chain | **Yes** — Sepolia lean stack + `npm run spk:v1:cycle:sepolia` |
| Attested mint on v1 stack | **Yes** — `npm run spk:v1:mint:attested:sepolia` (cycle-specific bundles) |

### 3. Phrases to use (updated)

Add alongside existing cautious phrases:

- network money prototype on testnet
- circulation-first settlement with energy-attested issuance
- energy-native issuance (local / post-lean-deploy Sepolia)
- public testnet operating loop (mint → network payment)

### 4. Phrases to avoid (unchanged for thesis submission)

Still avoid in the **thesis manuscript**:

- production-ready protocol
- stablecoin launch / legal tender
- "proves a new monetary system" (say **demonstrates a bounded network-money prototype**)

The **product** can be bolder in README and `docs/product/SPK_V1.md`; the **thesis** stays academically bounded.

## What does NOT require revamp

- Chapters 1–4 grounded drafts (logic still holds)
- CEIR tables and pricing results
- Chapter 6 conclusion structure — add one paragraph on SPK v1 as stronger feasibility evidence
- Six chapter map

## Recommended thesis edits (minimal checklist)

1. **Ch 5 §implementation:** one subsection "SPK v1 network money" — constitution, circulation-first, link to `SPK_V1.md`
2. **Ch 5 §evidence:** table with attested mint (2026-05) + Sepolia circulation txs (2026-06)
3. **THESIS_SOURCE_OF_TRUTH:** implementation status + canonical public proof table
4. **Abstract / Ch 1:** one sentence — implementation evolved from attested mint proof to circulation-first testnet system
5. **Do not** claim mainnet, audit, or real hardware unless true

## Repo doc hierarchy (product vs thesis)

| Audience | Lead with |
|----------|-----------|
| Foundation / strategy | `MONETARY_FOUNDATION.md`, `INSTRUMENT_COMPARISON.md` |
| Product / testnet ops | `docs/product/SPK_V1.md`, `state/runtime/spk_v1.json` |
| Thesis examiner | `THESIS_SOURCE_OF_TRUTH.md`, grounded chapters, bounded claims |
| Live metrics for Ch 5 | `FOUNDATION_EVIDENCE.md`, `SPK_V1_EVIDENCE.md` |
| Both | `THESIS_PRODUCT_ALIGNMENT.md` (this file) |

The thesis is the **argument**. SPK v1 is the **artifact that makes the argument credible.**

## Three horizons (do not mix in one paragraph)

| Horizon | Doc tone | Example claim |
|---------|----------|---------------|
| A — Foundational | Thesis | Energy-anchored unit with explicit USD valuation; five constraints |
| B — Structural | Thesis + ops | Sepolia circulation, indexed ledger, reference USD/kWh |
| C — Aspirational | Internal only | Peg credibility could subsume settlement rails over decades |
