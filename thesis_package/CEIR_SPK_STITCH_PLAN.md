# CEIR → SPK Stitch Plan

**Purpose:** Close the narrative gap between Chapter 3 (passive Bitcoin anchoring) and Chapter 5 / SPK v1 (designed network money) — without overclaiming, without revamping the thesis, and without implying CEIR proves mint economics or stablecoin success.

**Status:** Action plan (Jun 2026). Grounded manuscript stays canonical unless you apply the optional inserts below.

**Related:** `docs/product/CEIR_TO_SPK_LITERATURE_BRIDGE.md` (full literature + translation matrix), `THESIS_INTEGRATED_REINVENTION_EXPLORATION.md` (packaging sketch).

---

## 1. Diagnosis — what is actually missing?

The stitch is **asymmetric**:

| Direction | Status | Where |
|-----------|--------|-------|
| **Ch 3 → Ch 4 → Ch 5 (forward)** | **Mostly done** | Ch 3 §§3.7–3.8, §3.9; Ch 4 opening; Ch 5 §5.1 one-liner |
| **Ch 5 / SPK → Ch 3 (backward closure)** | **Thin** | Ch 5 mentions Ch 3 once; §5.10 lists five constraints but not *why each answers a CEIR failure mode* |
| **Ch 1 preview of logic chain** | **Implicit** | Three evidence paths, not “passive test → active build” |
| **Ch 6 integration summary** | **Missing table** | Summarises chapters; no CEIR → constraint → SPK closure row |
| **Translation matrix** | **Off-manuscript** | Lives in `CEIR_TO_SPK_LITERATURE_BRIDGE.md` §3 only |

**Conclusion:** You do not need a thesis recreation. You need **~2 pages of targeted closure** (mostly Ch 5 + Ch 6) and **one reader-facing map** (guide or advisor handoff).

---

## 2. The valid stitch (use only this chain)

```text
(1) Literature + Hayes: energy expenditure can relate to digital asset valuation.
(2) CEIR (Bitcoin): relation is detectable pre-ban (β ≈ −0.26), weakens post-ban (β ≈ −0.07, ns),
    Chow break — conditional and regime-dependent, not automatic.
(3) Boundary: differenced CEIR insignificant; trading rule underperforms buy-and-hold.
(4) Structural gap in Bitcoin: no holder energy claim, no priced oracle path, no redemption/settlement architecture.
(5) Design response: five constraints + Ch 4 pricing — implemented as SPK v1 (surplus attestation → circulation → optional redeem).
(6) Not shown: dollar peg, legal money, adoption, production meters at scale.
```

### Invalid chains (never use)

| Invalid | Why |
|---------|-----|
| CEIR β → SPK holds $1 | Different objects; no peg tested |
| CEIR significant → no reserves needed | Ch 4 margin/oracle says opposite |
| China ban → SPK replaces mining | Different mechanism (production surplus vs PoW burn) |
| Trading rule fails → SPK useless | CEIR is explanatory; SPK is settlement infrastructure |

---

## 3. CEIR finding → design response (canonical table)

*Insert as **Table 5.2** or subsection after §5.2 in Ch 5 (recommended).*

| CEIR / Ch 3 finding | What passive anchoring cannot do | Constraint + SPK response |
|---------------------|----------------------------------|---------------------------|
| Pre-ban: log(CEIR) predicts returns | Markets sometimes use energy-cost information | **Motivation only** — energy is not economically irrelevant |
| Post-ban: link weakens | Anchor is **regime-dependent** | **Governance + basis** — rules must survive structural shocks; source/basis tagging (roadmap) |
| Chow break at mining ban | Relationship tied to **network structure** | **Explicit data path** — attested surplus, not inferred burn geography |
| Differenced spec fails | Level discipline matters; trend-sensitive | **Declared issuance rule** — mint from accepted kWh, not discovered beta |
| Trading rule fails | Not a commercial signal | SPK is **settlement/circulation**, not a CEIR fund |
| Bitcoin: no redemption | PoW burn ≠ user energy claim | **`openRedemption`** + owed-kWh accounting |
| Cambridge data is modelled | Estimated energy ≠ site truth | **Meter signatures, replay protection, quality filters** |
| Multi-factor crypto returns (Liu & Tsyvinski) | Energy alone insufficient | **Ch 4 pricing + margin** alongside energy anchor |

---

## 4. Optional manuscript inserts (minimal surgery)

### 4.1 Chapter 1 — §1.4 Research Design (add one paragraph after evidence-path list)

**Draft:**

> The three evidence paths are sequential, not parallel. Chapter 3 tests whether **passive** energy linkage already disciplines value in the largest proof-of-work market. The bounded answer — conditional relevance, regime instability, no trading rule — motivates **designed** linkage in Chapters 4 and 5. Chapter 4 prices renewable-energy uncertainty explicitly because issuance cannot rely on market inference alone. Chapter 5 implements the constraint architecture that Bitcoin lacks: verified surplus input, rule-bound mint, ledgered settlement, and optional redemption. The Sepolia prototype (SPK v1) is feasibility evidence for that architecture; it is not a test of whether CEIR coefficients apply to SPK returns.

**Effort:** ~120 words. **Risk:** Low.

---

### 4.2 Chapter 5 — new §5.2.1 “From CEIR limits to constraint design” (after Table 5.1)

**Draft:**

> Chapter 3 showed that Bitcoin’s market value relative to cumulative mining electricity cost contains information about later returns in some regimes, but that the relationship weakens after the China mining-ban shock, is specification-sensitive, and does not support a profitable trading rule. That evidence does **not** validate SolarPunk or disprove it. It defines what a passive anchor **cannot** guarantee: stable discipline across regimes, direct holder claims, priced shortfall risk, or protected settlement.
>
> The five constraints in Table 5.1 are the architectural answer to those limits. Each constraint maps a failure mode of passive proof-of-work anchoring to an explicit rule. Table 5.2 summarises the mapping. The proof-of-concept and SPK v1 implementation in §§5.6–5.10 test whether those rules can be expressed in software — not whether CEIR’s pre-ban coefficient replicates for SPK.

Then insert **Table 5.2** from §3 above (renumber existing tables if needed in Word).

**Effort:** ~200 words + table. **Risk:** Low if table stays bounded.

---

### 4.3 Chapter 5 — §5.10 opening (add before SPK v1 parameter table)

**Draft:**

> Chapter 3 §3.8 listed what a designed system must specify: energy data source, issuance rule, pricing method, collateral or margin, settlement on failure, and governance for parameter changes. SPK v1 is the testnet instantiation of that list for **production-side surplus** rather than **consumption-side mining burn**. CEIR motivates the question; SPK v1 tests the mechanism.

**Effort:** ~70 words. **Risk:** Very low.

---

### 4.4 Chapter 6 — new §6.3.1 “Evidence chain closure” (after §6.3 Summary)

**Draft table:**

| Layer | Question | Verdict in this thesis |
|-------|----------|----------------------|
| Passive anchor (Bitcoin / CEIR) | Does energy-cost information appear in markets? | **Conditionally yes** — pre-ban level spec; weak post-ban |
| Designed constraints (Ch 5 framework) | What rules replace passive hope? | **Specified** — five constraints integrated |
| Mechanism (SPK v1) | Can rules run on a public testnet? | **Demonstrated** — mint, circulation, optional redeem; peg off |
| Stablecoin (Horizon C) | Dollar parity at scale? | **Not shown** — deferred |

**Closing sentence:**

> The thesis therefore closes the loop from empirical limit (CEIR) to architectural requirement (five constraints) to technical feasibility (SPK v1). It does not close the loop to market success or stablecoin launch.

**Effort:** Half page. **Risk:** Low.

---

### 4.5 Reader’s guide — add row to “How to read”

| If you want… | Start here | Then read |
|---|---|---|
| **Why CEIR leads to SPK** | Ch 3 §3.7–3.8 | Ch 5 §5.2.1 + Table 5.2, §5.10 |
| Full stitch in one doc | `CEIR_SPK_STITCH_PLAN.md` | `CEIR_TO_SPK_LITERATURE_BRIDGE.md` |

---

### 4.6 Appendix (optional, examiner-friendly)

**Title:** Appendix — CEIR-to-implementation translation (abbreviated)

- One page: valid chain (§2) + Table from §3
- Pointer: full literature in `CEIR_TO_SPK_LITERATURE_BRIDGE.md` (supplementary; not required for degree)

---

## 5. Repo / research actions that **strengthen** the stitch (post-thesis)

Narrative alone is not enough for **external** skeptics (“Bitcoin ≠ SPK”). These make the stitch **empirically credible** over time:

| Priority | Action | Strengthens stitch by… | Repo hook |
|----------|--------|------------------------|-----------|
| **P1** | Real meter export loop (Green Button / inverter) | Replacing modelled Cambridge energy with **settlement-grade production data** — mirrors CEIR’s data-limit critique | `CYCLE_MINT_MODE=meter`, `data/operator/` |
| **P2** | Document production-side vs consumption-side contrast in one diagram | Makes “why not just CEIR Bitcoin?” obvious | `docs/product/ENERGY_STANDARD_ECONOMICS.md` |
| **P3** | Redemption stress harness (sim shortfall / dispute) | Tests Bretton Woods analogy Ch 2 raises | contracts + `simulate_peg.py` / stress scripts |
| **P4** | Time/location tagged kWh (EnergyTag-style metadata) | Addresses **regime dependence** CEIR revealed | attestation metadata fields (roadmap) |
| **P5** | Peg-off vs peg-on testnet experiment + oracle band | Separates mechanism layer from stablecoin layer | `pegEnabled`, Ch 4 oracle tolerance table |
| **P6** | Panel: PoW assets + production-linked tokens (research) | Shows whether production-side tokens have cleaner energy beta | Sharpe / external research |

**Thesis submission does not require P1–P6.** They are how the **project** earns stronger stablecoin language later.

---

## 6. Verification checklist (stitch is “answered” when…)

### Narrative (manuscript)

- [ ] Reader can state valid chain (§2) without invalid jumps
- [ ] Ch 5 names at least one CEIR failure mode per constraint (Table 5.2)
- [ ] §5.10 explicitly callbacks to Ch 3 §3.8 bullet list
- [ ] Ch 6 table separates passive / designed / mechanism / stablecoin
- [ ] Advisor handoff mentions stitch path (`THESIS_READERS_GUIDE` or `SUBMIT_TO_ADVISOR.md`)

### Empirical (unchanged)

- [ ] `npm run thesis:verify` passes
- [ ] CEIR numbers match `THESIS_SOURCE_OF_TRUTH.md`
- [ ] SPK metrics match `state/runtime/spk_v1.json` after sync

### Product (honesty)

- [ ] `CEIR_TO_SPK_LITERATURE_BRIDGE.md` §4.2 invalid chains not used in pitches
- [ ] README / grants use **tight wording** from bridge doc §8

---

## 7. Recommended execution order

| When | Do what |
|------|---------|
| **Before advisor send (optional, ~1 hour)** | Apply §4.2 + §4.3 + §4.4 only; rebuild docx |
| **If advisor asks “how does Bitcoin empirics connect to your prototype?”** | Point to Table 5.2 + §5.10 callback |
| **After submission** | P1 meter loop + `npm run exploration:tier-c` | `docs/exploration/` |
| **Do not** | Rewrite Ch 3–4; claim CEIR proves SPK; add stablecoin claims to Ch 5 |

---

## 8. Suggested wording (copy-paste for grants / README)

**Tight:**

> CEIR shows energy-cost information in Bitcoin is conditional and regime-dependent — passive anchoring is not enough. SPK v1 implements the alternative: mint only from verified surplus under explicit issuance, pricing, settlement, and governance rules on testnet. CEIR motivates the problem; SPK tests the architecture. Neither proves a launched stablecoin.

---

*Plan version: 2026-06-08. Apply inserts to `CHAPTER_*_GROUNDED_DRAFT.md` then `npm run thesis:docx`.*
