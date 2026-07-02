# Thesis Reader's Guide

**Submitting to your professor?** Start with [`SUBMIT_TO_ADVISOR.md`](SUBMIT_TO_ADVISOR.md) — attach `output/THESIS_GROUNDED.docx`.

**Title:** Energy as a Constraint: Credibility, Pricing, and Settlement in Energy-Linked Digital Finance

**One-sentence answer:** Energy can discipline digital financial claims only when reliable data, rule-bound issuance, explicit pricing, protected settlement, and limited governance are designed together.

**This thesis is not:** an energy stablecoin pitch, a gold replacement manifesto, or a production launch document.

---

## How to read the thesis

| If you want… | Start here | Then read |
|---|---|---|
| The whole argument in 10 minutes | This guide + Ch 6 §6.2 roadmap | Ch 1 §1.9 summary |
| Why energy at all | Ch 2 | Ch 1 §1.2–1.3 |
| The empirical proof | Ch 3 **At a glance** + §3.7–3.9 | `THESIS_SOURCE_OF_TRUTH.md` (CEIR numbers) |
| The pricing math | Ch 4 **At a glance** + §4.4–4.6 | Taiwan base case tables |
| The implementation | Ch 5 **At a glance** + §5.2 + §5.10 | `SPK_V1_EVIDENCE.md` (auto-built) |
| Stablecoin comparison | Ch 2 §2.9 | Ch 5 §5.7 launch gates |
| What we refuse to claim | Ch 6 §6.5 | Ch 1 §1.7 |

Each chapter opens with an **At a glance** table. Each empirical/design chapter ends with a **Key takeaway** blockquote.

### Chapter-by-chapter PDF / Word / Markdown

Build a reading pack (one command):

```bash
npm run thesis:reading
```

Output: [`output/reading/`](output/reading/README.md) — full manuscript plus `chapters/Chapter_01_Introduction.pdf` through `Chapter_06_Conclusion.pdf` (and matching `.docx` / `.md`).

Markdown + Word only (faster, no PDF):

```bash
npm run thesis:docx
```

---

## Chapter-by-chapter digest

### Chapter 1 — Introduction

**Job:** Frame the problem and the research path.

- **Problem:** Digital money can be scarce in code but weak in economic credibility.
- **RQ:** Can energy constrain digital money through energy-linked contracts — and under what conditions?
- **Method:** Bitcoin empirics → renewable pricing → Sepolia prototype.
- **Scope:** Bounded research; proof of feasibility, not proof of readiness.

### Chapter 2 — Literature Review and Theoretical Background

**Job:** Review literatures and state the integrated research gap.

- Monetary credibility: Kydland/Prescott, Barro–Gordon (rules vs discretion).
- Gold / Bretton Woods: physical convertibility and its operational limits.
- Fiat: institutional credibility; contrast case for thin digital issuers.
- Bitcoin + CEIR literature: energy-connected, not energy-backed.
- Renewable finance + pricing lit (B-S, binomial, Bessembinder): risk must be explicit.
- Smart contracts / oracles / stablecoin comparator (§2.9.1).
- **Five conditions** synthesis (§2.10); stablecoins are a **comparator**, not thesis identity.

### Chapter 3 — Bitcoin Empirics

**Job:** Test whether energy cost shows up in market data.

- **CEIR** = market cap ÷ cumulative mining electricity cost.
- **Preferred spec:** level `log(CEIR)`; β ≈ −0.26 pre-ban (significant); β ≈ −0.07 post-ban (weaker, not significant).
- **Break:** China mining-ban period.
- **Limits:** differenced spec weaker; no trading rule; single asset.

### Chapter 4 — Pricing

**Job:** Show renewable-energy risk can be priced transparently.

- Option-style model on $/kWh; binomial + Monte Carlo; **K = S₀ per site (ATM)**.
- **Taiwan base case:** S₀ = $0.0525/kWh, σ ≈ 189%, call ≈ $0.0192/kWh (binomial); ~2.1% MC gap.
- Cross-location: Saudi/Arizona cluster ~$0.018–$0.020; Brazil ~$0.037; Germany ~$0.0023.
- Oracle tolerance, collars, margin (~$0.63/kWh Taiwan at σ=189%) — inputs to settlement design.
- Public data = cold-start; meters = settlement.

### Chapter 5 — Constraints + SPK v1

**Job:** Map theory to enforceable rules and test on Sepolia.

| # | Constraint | Failure mode if missing |
|---|---|---|
| 1 | Reliable energy data | Mint against false claims |
| 2 | Rule-bound issuance | Discretionary money creation |
| 3 | Explicit pricing / risk | Under-collateralised claims |
| 4 | Protected settlement | Unresolved redemptions |
| 5 | Limited governance | Admin overrides everything |

**SPK v1 (Jun 2026):** ~5,499 SPK, 21 payments, peg **off**, energy-native 1 kWh → 1 SPK, circulation-first. Feasibility evidence only.

### Chapter 6 — Conclusion

**Job:** Answer, contributions, limits, falsifiers, future work.

- **Roadmap table** (§6.2): one-page map of all chapters.
- **Falsifiers** (§6.7): what would weaken each layer.
- **Future work:** panel empirics, richer pricing, real meters, closed pilot, legal/market structure.

---

## Canonical numbers (do not drift)

See `THESIS_SOURCE_OF_TRUTH.md` for full list. Headline figures:

| Item | Value |
|---|---|
| CEIR β (level, pre-ban) | ≈ −0.26 |
| Taiwan S₀ | $0.0525/kWh |
| Taiwan σ (annualised) | ≈ 189% |
| SPK v1 supply | ~5,499 SPK |
| Network payments | 21 |
| Peg | Off (by design on testnet) |

---

## Build outputs

```bash
npm run thesis:build    # markdown only
npm run thesis:docx     # evidence refresh + full + per-chapter DOCX
```

| Output | Path |
|---|---|
| Combined manuscript | `thesis_package/THESIS_GROUNDED_MANUSCRIPT.md` |
| Full Word | `thesis_package/output/THESIS_GROUNDED.docx` |
| Per-chapter Word | `thesis_package/output/chapters/CHAPTER_1.docx` … `CHAPTER_6.docx` |

After opening DOCX in Word: **References → Update Table of Contents**.

---

## Oral defense cheat sheet

1. **Thesis in one breath:** Energy is a credible *constraint* only with five enforceable rules — we test that with Bitcoin data, pricing models, and a Sepolia prototype.
2. **Not a stablecoin:** USD is a valuation reference in pricing; we do not claim dollar peg or reserve attestation.
3. **Strongest empirical claim:** CEIR level spec + China ban break — conditional, not mechanical.
4. **Strongest design claim:** Five constraints integrated; SPK v1 proves the code path exists.
5. **Honest limit:** No real operator meter, no audit, no legal money, no production governance.
