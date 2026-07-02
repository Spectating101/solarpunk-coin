# Monetary Foundation

**Purpose:** Canonical statement of what this project is building at the **foundation** level — not short-term product claims, not L1 chain competition.

**Audience:** Thesis, internal strategy, implementation alignment.  
**Companion docs:** `INSTRUMENT_COMPARISON.md`, `FOUNDATION_EVIDENCE.md` (generated), `THESIS_SOURCE_OF_TRUTH.md`

---

## One sentence

We are establishing an **energy-anchored monetary unit** with an **explicit USD valuation layer** and **rule-bound issuance, circulation, and redemption** — tested empirically and demonstrated on testnet — whose long-run horizon is **credible peg quality**, not a faster blockchain.

---

## What we are not building

| Not this | Why |
|----------|-----|
| A new Ethereum / XRP competitor | Settlement **rails** are commoditized; **money** is the design problem |
| A near-term USDC replacement | Peg machinery exists; **live peg dominance** is long-horizon and evidence-gated |
| “Energy is money automatically” | Energy is a **testable constraint**; credibility requires **rules** (Ch 2–5) |

---

## What we are building (three horizons)

### Horizon A — Foundational (now; thesis core)

**Claim class:** Monetary economics + empirics + bounded implementation.

1. **Anchor:** verified energy surplus (kWh) defines the unit (1 SPK ≈ 1 kWh in v1 lean policy).
2. **Translation:** USD enters through **reference price per kWh** and **Chapter 4 pricing** — not through opaque bank collateral.
3. **Discipline:** five constraints — data, issuance, pricing, settlement, governance.
4. **Evidence path:**
   - Ch 3 — passive energy anchoring in Bitcoin is **conditional** (CEIR, China ban).
   - Ch 4 — energy-linked claims require **explicit pricing and margin**.
   - Ch 5 — **designed** rule-bound system (SPK v1) vs passive PoW anchoring.

**Win criterion:** empirical and theoretical **robustness** vs literature — not market cap.

### Horizon B — Structural (built; compounding)

| Layer | Role | Repo anchor |
|-------|------|-------------|
| Unit | Energy-native token | `SolarPunkCoin` |
| Circulation | Typed network payments | `SolarPunkCurrencySystem` |
| USD bridge | Reference + pricing | `reference_usd_per_kwh`, Ch 4 tables |
| Peg / stability | PI band, simulation | contracts (peg **off** in lean ops); `simulate_peg.py` |
| Operations | Mint → pay → sync → evidence | `spk-v1` package, operator cycles |
| Public surface | Wallet + ledger | Sepolia demo, `spk_v1.json` |

**Current posture:** circulation-first testnet; peg and full USD stability are **foundation in code**, **experiment in thesis**, not **claimed in production**.

### Horizon C — Aspirational (long-run; not thesis proof)

If peg credibility compounds under stress and adoption grows:

- The **unit of account** may consolidate on the energy-anchored design.
- **ETH, XRP, Ripple-class rails** become infrastructure that **moves** value denominated in that unit.
- “Absorption” means **monetary layer dominance**, not replacing validators.

**This horizon informs strategy; it does not appear as a proved result in the manuscript.**

---

## Comparative frame (who we argue against)

| Comparator | Comparison dimension |
|------------|---------------------|
| **USDC / fiat-backed stables** | Collateral visibility vs **energy rule** transparency |
| **DAI / algorithmic designs** | Oracle + stability mechanics; stress history |
| **Bitcoin (PoW)** | **Passive** energy anchor vs **active** rule-bound design |
| **Ethereum / XRP** | **Rail** only — gas, bridge, corridor tech |

See `INSTRUMENT_COMPARISON.md` for the thesis table.

---

## Energy anchor + USD translation (how they fit)

```text
Physical layer:     verified surplus kWh
        ↓
Monetary layer:     SPK issuance (rule-bound)
        ↓
Expression layer:   USD/kWh reference + Ch 4 pricing → implied USD value
        ↓
Stability layer:    peg band / PI (optional; tested before claimed)
        ↓
Use layer:          network circulation (primary in v1 lean)
        ↓
Exit layer:         optional energy redemption (secondary)
```

**Dollar-translated** ≠ **dollar-pegged** until stability evidence exists. The thesis must keep that distinction.

---

## Five constraints → what “done” means at foundation level

| Constraint | Foundation requirement | SPK v1 indicator |
|------------|------------------------|------------------|
| **Data** | Issuance tied to verifiable energy input | Attested / surplus mint paths |
| **Issuance** | Supply changes only under published rules | `mintFromSurplus`, attested mint, roles |
| **Pricing** | USD value of energy claims is explicit | Ch 4 + `reference_usd_per_kwh` |
| **Settlement** | Payments and redemption are ledgered, replay-safe | `settleNetworkPayment`, redemption flow |
| **Governance** | Parameter changes are bounded and auditable | roles, admin, future multisig |

Generated live values: `FOUNDATION_EVIDENCE.md` (run `npm run thesis:foundation`).

---

## Language discipline

### Use in thesis

- energy-anchored monetary unit with explicit USD valuation
- circulation-first testnet prototype
- designed rule-bound issuance (vs passive PoW anchoring)
- feasibility evidence; bounded claims; falsification paths

### Use in internal strategy only

- best peg long-run horizon
- absorb settlement rails through unit-of-account credibility
- stablecoin design space (energy collateral vs bank collateral)

### Avoid in thesis

- production stablecoin / legal tender
- beats Ethereum / replaces XRP
- energy automatically backs money
- peg dominance proved

---

## Build order (foundation work, not product launch)

1. **Freeze** Ch 3–4 canonical empirics (`THESIS_SOURCE_OF_TRUTH.md`).
2. **Generate** `FOUNDATION_EVIDENCE.md` after each operator sync.
3. **Maintain** instrument comparison table for Ch 5.
4. **Run** weekly: cycle → sync → evidence → foundation pack.
5. **Later (peg experiments):** testnet peg on + stress vs `oracle_tolerance.csv` — only then strengthen “stablecoin” wording.

---

## Falsification (foundation must allow failure)

The foundation is weak if:

- CEIR / ban evidence is spurious or fully explained by confounds.
- Ch 4 pricing is unstable under oracle tolerance at operational bands.
- SPK issuance rules can be bypassed without detection on testnet.
- Circulation metrics diverge from indexed ledger under audit.
- Peg simulation / future peg-on testnet shows systematic depeg under realistic shocks.

Chapter 6 should list these explicitly.

---

*This document is the strategic and academic north star. Implementation details: `docs/product/SPK_V1.md`. Examiner bounds: `THESIS_SOURCE_OF_TRUTH.md`.*
