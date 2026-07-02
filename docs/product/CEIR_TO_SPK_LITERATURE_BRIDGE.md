# CEIR → SolarPunk (SPK): Literature Bridge and Design Justification

- **Purpose:** Supplementary research note (not in the grounded thesis manuscript). Explains how corrected CEIR evidence relates to the energy-standard / stablecoin direction in this repo.
- **Last updated:** 2026-06-28
- **Reproduce CEIR:** `python thesis_package/ceir_regression.py --refresh-panel`
- **Related:** `docs/product/CURRENCY_THEORY_AND_COMPARABLES.md`, `docs/product/ENERGY_STANDARD_ECONOMICS.md`, `thesis_package/CEIR_REPRODUCTION.md`

---

## Executive summary

**CEIR does not prove that SolarPunk will hold a peg or succeed as a stablecoin.** It was never designed to test mint-from-surplus, redemption, or dollar parity.

**CEIR does support a narrower, defensible claim that motivates SPK:**

> In at least one large proof-of-work market, cumulative energy cost contains **conditional** information about future valuation — but only when mining structure is stable, only in level (not differenced) specifications, and not in a way that survives as a trading rule.

That finding is **evidence for studying designed energy-linked money**, not evidence that passive energy expenditure automatically backs value. SolarPunk’s architecture is the response: replace passive PoW anchoring with **verified production evidence, rule-bound issuance, priced risk, protected settlement, and limited governance**.

**Bottom line for builders:** CEIR is the *motivation layer* (energy can matter in digital finance). SPK is the *mechanism layer* (how to make energy matter on purpose). A future energy **stablecoin** is a *third layer* (peg, liquidity, law) that CEIR does not validate — but CEIR makes that third layer a research question worth asking rather than a slogan.

---

## 1. What CEIR actually measures

### 1.1 Definition

**Cumulative Energy Investment Ratio (CEIR):**

```text
CEIR_t = MarketCap_t / CumulativeEnergyCost_t
```

The preferred regression (rebuilt Jun 2026) tests whether **winsorized log(CEIR)** predicts **30-day forward Bitcoin return**, with trend, sentiment, and 30-day volatility controls, HAC(30) errors, and month clustering, split at the China mining ban (2021-06-20).

### 1.2 Corrected results (repo source of truth)

| Item | Value | Interpretation |
|------|------:|----------------|
| Pre-ban β | **−0.262** | 1 SD higher log(CEIR) → ~−12.6% expected 30d return (pre-ban sample) |
| Pre-ban p (HAC) | **≈ 0.0005** | Statistically significant |
| Post-ban β | **−0.071** | Same sign, much smaller |
| Post-ban p (HAC) | **≈ 0.13** | Not significant at 5% |
| Chow p | **≈ 1.1×10⁻¹⁶** | Pre/post coefficients differ |
| Differenced Δlog(CEIR) | insignificant | Boundary condition — level spec matters |
| Trading rule | +176% vs +2771% buy-hold | Underperforms; not a strategy |

**Plain language:** When Bitcoin was expensive relative to its cumulative mining-electricity cost base, later returns tended to be weaker — **before** the mining-geography shock. After the shock, that predictive link **weakened**. Energy cost information was **regime-dependent**, not a mechanical law.

### 1.3 What CEIR does *not* measure

| Not tested | Why it matters for SPK |
|------------|------------------------|
| Renewable surplus minting | SPK mints from **production surplus**, not PoW burn |
| Redemption / convertibility | SPK has `redeemForEnergy` accounting; CEIR has no holder claim on electricity |
| Dollar peg | CEIR is about Bitcoin returns, not $1 parity |
| Oracle/meter truth | CEIR uses modelled Cambridge energy data |
| Legal money status | N/A |

---

## 2. Literature review: five strands that connect to SPK

### 2.1 Production cost and “fundamental value” in Bitcoin (CEIR’s academic lineage)

**Hayes (2015, 2016, 2019)** formalises Bitcoin valuation through **marginal cost of production**: mining consumes electricity and hardware; cost of production may act as a soft floor or anchor for price ([Hayes, 2019](https://doi.org/10.1080/13504851.2018.1488040); [Hayes, 2016 working paper](https://adamhay.es/wp-content/uploads/2019/02/hayes2016-2.pdf)).

**Nakamoto (2008)** establishes proof-of-work as costly signal — scarcity enforced by expenditure, not redemption.

**Liu & Tsyvinski (2021)** show crypto returns are driven by crypto-specific factors; energy is plausibly one factor among many, not a sufficient statistic for price.

**Synthesis for SPK:** Hayes-style logic says **energy expenditure can enter valuation**. Liu & Tsyvinski say **markets are not reducible to energy alone**. CEIR sits between them: energy-cost **ratio** has predictive content **conditionally**. That justifies building an energy-linked instrument **without** claiming energy alone determines value.

**Design implication:** SPK should not market “intrinsic value from energy.” It should market **rule-bound linkage** to measured surplus, with explicit pricing for everything else (demand, liquidity, oracle error, basis).

---

### 2.2 Commodity money, gold standard, and convertibility (SPK’s institutional analogy)

**Bordo (1993)** and **Eichengreen (1992)** document how commodity and Bretton Woods systems used **convertibility promises** to discipline issuance — and how those systems failed when **paper claims outran settlement capacity** (Triffin tension, Nixon shock).

**Kydland & Prescott (1977)** and **Barro & Gordon (1983)** explain why **rules vs discretion** matter for credibility.

**Synthesis for SPK:** `ENERGY_STANDARD_ECONOMICS.md` maps SPK to gold-standard logic:

| Gold standard | SolarPunk energy standard |
|---------------|---------------------------|
| Gold in vault | Verified renewable surplus (meter evidence) |
| Assay / custody | Signatures, source hash, replay protection |
| Convertibility | `redeemForEnergy` → owed-kWh claim |
| Mining scarcity | Surplus-gated mint (`mintFromSurplusAttestation`) |

**CEIR’s role:** Bitcoin shows that **indirect** energy expenditure (PoW) can correlate with market value **without** convertibility. Gold/Bretton Woods show that **direct** convertibility requires **settlement architecture**, not just a scarce commodity. SPK attempts the second path using **digital rules** instead of bullion.

**Design implication:** CEIR fragility (post-ban weakening) parallels Bretton Woods fragility (claims vs settlement). SPK must invest in **redemption policy, reserve/stress harness, and governance limits** — the repo’s Ch 5 five-constraint framework — not assume energy data alone creates credibility.

---

### 2.3 Renewable production, certificates, and energy attributes (SPK’s production side)

**Lazard (2025)** and **IEA (2023)** establish that renewable output has economic value but faces financing, curtailment, and policy risk.

**EPA REC guidance** and **I-REC / EnergyTag** show that energy claims require **registry discipline**: vintage, location, no double-counting, retirement — attributes are not the same as physical delivery ([EPA RECs](https://www.epa.gov/green-power-markets/renewable-energy-certificates-recs); [I-REC](https://www.irecstandard.org/the-standard/)).

**SolarCoin** rewards verified solar generation with tokens — production-linked issuance without full monetary settlement ([SolarCoin](https://solarcoin.org/how-it-works/)).

**Energy Web Green Proofs** demonstrate blockchain registries for environmental attributes ([Energy Web docs](https://docs.energyweb.org/energy-solutions/green-proofs-by-energy-web/green-proofs-overview)).

**Synthesis for SPK:** CEIR uses **consumption-side** energy (mining). SPK uses **production-side** surplus (renewable export). The literatures above say production claims need **measurement grade, uniqueness, and settlement rules** — exactly what SPK’s meter → attestation → mint path tries to encode.

**Design implication:** CEIR motivates “energy can matter.” REC/I-REC/SolarCoin literature motivates “**how** to tie tokens to production without fraud.” SPK’s differentiator vs SolarCoin is **settlement + redemption + delivery accounting**, not just minting a reward.

---

### 2.4 Tokenised energy finance and stable settlement (SPK’s market-design neighbors)

**Wang & Su / Energy Economics (2024)** survey algorithmic energy tokens and the post-Merge shift away from PoW waste — energy tokens as transition finance, not passive mining anchors ([Financing sustainable energy transition with algorithmic energy tokens](https://doi.org/10.1016/j.eneco.2024.107420)).

**RevTok / tokenised revenue stream literature** (e.g. [IET Smart Grid 2024](https://doi.org/10.1049/stg2.12126)) proposes **fractionalised generator revenue** distributed via smart contracts, often with **stablecoin settlement** on the payment leg.

**BIS (2023)** unified ledger / tokenisation work: programmability helps when **money and claims share a platform with clear governance** ([BIS AR 2023](https://www.bis.org/publ/arpdf/ar2023e3.htm)).

**FSB (2023)** stablecoin recommendations: redemption rights, disclosure, governance, stress planning ([FSB GSC report](https://www.fsb.org/2023/07/high-level-recommendations-for-the-regulation-supervision-and-oversight-of-global-stablecoin-arrangements-final-report/)).

**Synthesis for SPK:** The industry is moving toward **tokenised energy cash flows and attributes**, usually **not** toward “one coin equals one kWh forever.” Stablecoins appear as **settlement rails** for energy revenue tokens, not as proofs that energy mechanically pegs price.

**Design implication:** SPK v1 (peg off, circulation-first) is consistent with this literature: build **energy-native issuance and settlement first**; treat **dollar stability** as a separate layer requiring FSB-style controls. CEIR does not shortcut that.

---

### 2.5 Pricing, oracles, and smart-contract enforcement (SPK’s Ch 4–5 stack)

**Black–Scholes (1973)** and **Cox, Ross & Rubinstein (1979)** provide language for uncertain payoffs — used in-repo for energy-volatility and margin ([thesis Ch 4](../thesis_package/CHAPTER_4_GROUNDED_DRAFT.md)).

**Bessembinder & Lemmon (2002)**; **Deng & Oren (2006)**: electricity is non-storable; power derivatives need market-specific risk models.

**Cong & He (2019)**; **Chainlink oracle docs**: on-chain rules are only as good as off-chain data ([Chainlink](https://chain.link/)).

**Synthesis for SPK:** CEIR shows an **explanatory** energy-valuation link in Bitcoin. Pricing literature shows **issuance without risk pricing is dangerous**. Oracle literature shows **minting without data discipline is dangerous**. SPK combines them: CEIR → “energy information exists”; pricing → “price the risk”; contracts → “enforce the rules.”

**Repo evidence:** Taiwan σ ≈ 189%, binomial/MC gap ≈ 2.1%, margin ≈ $0.63/kWh at 1.5× VaR₉₉ — cold-start **risk bounds** for energy-linked claims, independent of CEIR coefficients.

---

## 3. Translation matrix: CEIR finding → SPK design choice

| CEIR / literature finding | Risk if ignored | SPK / repo response |
|---------------------------|-----------------|---------------------|
| Pre-ban: log(CEIR) predicts returns (β ≈ −0.26) | Dismissing energy entirely | Study energy-linked instruments; energy is not economically irrelevant |
| Post-ban: link weakens (β ≈ −0.07, ns) | Assuming energy anchor is permanent | Regime-aware governance; don’t hard-code one global energy price forever |
| Chow break: structure matters | One-size-fits-all monetary rule | Mining-map / geography awareness in thesis; SPK tags source & basis (roadmap) |
| Differenced spec fails | Overfitting level trends | Document sensitivity; use level issuance rule with explicit basis, not implicit trend |
| Trading rule fails | Marketing CEIR as alpha | SPK is settlement/infrastructure, not a CEIR fund |
| Hayes: production cost informs price | No fundamental narrative | `energy_price_usd_per_kwh` basis for mint — **declared** rule, not discovered beta |
| No Bitcoin redemption | Passive PoW ≠ user claim | `mintFromSurplusAttestation` + `redeemForEnergy` |
| Cambridge data is estimated | False precision | Meter signatures, quality filters, replay protection |
| Liu & Tsyvinski: multi-factor crypto | “Energy = price” | Five-constraint framework; pricing + margin layer |
| Bretton Woods: settlement < claims | Run on redemption | Stress harness, reserve ratio, delivery shortfall states |
| FSB: stablecoin needs peg ops | Calling SPK a stablecoin today | SPK v1 peg off; stablecoin = horizon C |

---

## 4. Argument structure: how CEIR *supports* SolarPunk without overclaiming

### 4.1 Valid support chain (use this in pitches and papers)

```text
(1) Literature (Hayes, PoW): energy expenditure can relate to digital asset valuation.
(2) CEIR (Bitcoin panel): that relation is empirically detectable pre-ban, weakens post-ban,
    breaks across regimes — conditional, not automatic.
(3) Gap: Bitcoin has no direct energy claim, no priced oracle path, no redemption architecture.
(4) SolarPunk: implements direct surplus evidence → bounded mint → circulation → redemption
    accounting, with pricing/margin for risk.
(5) Horizon: if layer (4) works at pilot scale, layer (6) peg/reserves/legal may be testable.
```

### 4.2 Invalid support chain (do not use)

```text
CEIR β = −0.26 → SPK will hold $1
CEIR significant → mint 1 SPK per kWh needs no reserves
China ban → SPK replaces Bitcoin mining
Trading rule bad → SPK useless
```

### 4.3 Where “stablecoin” enters

From **Ch 2 §2.9.1** and **CURRENCY_THEORY_AND_COMPARABLES.md**:

| Layer | Question | CEIR contribution |
|-------|----------|-------------------|
| **A. Energy constraint** | Can energy discipline issuance? | **Yes, weakly motivates** — energy info exists; passive anchoring insufficient |
| **B. Energy-standard coin** | Can verified surplus mint a circulating unit? | **Prototype only** — Sepolia SPK v1; not proven at scale |
| **C. Energy stablecoin** | Can that unit hold external peg ($)? | **Not shown** — needs reserves, liquidity, law (FSB layer) |

CEIR primarily supports **Layer A** and the *question* behind **Layer B**. Layer C requires evidence CEIR does not provide.

---

## 5. Comparison: three architectures

| | **Bitcoin (CEIR test)** | **Typical fiat stablecoin** | **SolarPunk SPK (repo)** |
|---|-------------------------|----------------------------|---------------------------|
| Energy link | Indirect (PoW burn) | None (USD reserves) | Direct (surplus attestation) |
| Issuance rule | Protocol + mining competition | Issuer mint/burn | `mintFromSurplusAttestation` |
| User energy claim | No | No (USD claim) | Owed-kWh redemption accounting |
| Valuation anchor | Market + optional cost floor | Reserve attestation | kWh basis + optional USD reference price |
| Peg | None | $1 target | Off in SPK v1 |
| CEIR relevance | **Directly measured** | None | **Motivational + design contrast** |
| Main fragility | Regime change (mining geography) | Reserve/run risk | Oracle, basis, redemption delivery |

**Research insight:** SPK is **closer to commodity/energy-standard theory** than to Bitcoin CEIR, but **closer to stablecoin engineering** than to either if the end goal is dollar parity.

---

## 6. What would strengthen the CEIR → SPK bridge (research agenda)

| Priority | Study | Links CEIR to SPK by… |
|----------|-------|------------------------|
| 1 | Real meter loop (Green Button / inverter export) | Replacing modelled energy with settlement-grade data |
| 2 | Panel: PoW assets + renewable issuance tokens | Testing whether production-side tokens show cleaner energy beta |
| 3 | Out-of-sample SPK redemption stress | Testing Bretton Woods analogy in simulation |
| 4 | Time/location tagged kWh (EnergyTag-style) | Fixing regime-dependence CEIR revealed structurally |
| 5 | Peg pilot with explicit reserve policy | Separating Layer B from Layer C empirically |

---

## 7. Counterarguments (honest)

| Objection | Response |
|-----------|----------|
| “CEIR post-ban is insignificant — energy doesn’t matter.” | It mattered pre-ban; regime shift matters. SPK designs for **explicit** regimes (basis, location, governance), not implicit mining geography. |
| “Bitcoin isn’t a company; SPK isn’t Bitcoin.” | Correct. CEIR is **existence proof** for energy information in digital markets, not a template for SPK coefficients. |
| “RECs already tokenise energy.” | True for **attributes**. SPK adds **monetary circulation + redemption state machine** — different product category. |
| “Stablecoins need dollars, not joules.” | For **dollar parity**, yes. SPK’s near-term claim is **energy-standard issuance**, with USD as **numéraire** in pricing equations, not promised peg. |
| “Oracle fraud breaks everything.” | Yes. CEIR + oracle literature both say **data path is the constraint** — SPK’s core engineering bet. |

---

## 8. Suggested wording for external audiences

**Tight (investor / advisor):**

> We show that energy cost contains conditional valuation information in Bitcoin, especially before major mining-structure shocks. That motivates SolarPunk: instead of hoping markets infer energy value from mining burn, we mint only from verified renewable surplus under explicit issuance, settlement, and redemption rules. CEIR does not prove a stablecoin; it proves the problem is worth solving with better architecture.

**Academic:**

> Following Hayes (2019) and production-cost models of cryptocurrency value, we construct CEIR and find a significant negative relation between log market-cap-to-cumulative-energy-cost and forward returns in the pre-ban sample (β ≈ −0.26), which weakens post-ban (β ≈ −0.07, insignificant). A Chow test rejects coefficient stability. We interpret this as evidence that energy-linked information in digital asset markets is **regime-dependent**, motivating designed energy-linked issuance (SolarPunk SPK) rather than passive proof-of-work anchoring alone.

---

## 9. References (selected)

- Barro, R. J., & Gordon, D. B. (1983). A positive theory of monetary policy in a natural rate model. *Journal of Political Economy*, 91(4), 589–610.
- Bank for International Settlements. (2023). *Blueprint for the future monetary system*. https://www.bis.org/publ/arpdf/ar2023e3.htm
- Bessembinder, H., & Lemmon, M. L. (2002). Equilibrium pricing and optimal hedging in electricity forward markets. *Journal of Finance*, 57(3), 1347–1382.
- Black, F., & Scholes, M. (1973). The pricing of options and corporate liabilities. *Journal of Political Economy*, 81(3), 637–654.
- Bordo, M. D. (1993). The gold standard, Bretton Woods and other monetary regimes: A historical appraisal. *Federal Reserve Bank of St. Louis Review*, 75(2), 123–191.
- Cambridge Centre for Alternative Finance. (n.d.). *Cambridge Bitcoin Electricity Consumption Index*. https://ccaf.io/cbnsi/cbeci
- Chainlink. (2025). Documentation. https://docs.chain.link/
- Cong, L. W., & He, Z. (2019). Blockchain disruption and smart contracts. *Review of Financial Studies*, 32(5), 1754–1797.
- Cox, J. C., Ross, S. A., & Rubinstein, M. (1979). Option pricing: A simplified approach. *Journal of Financial Economics*, 7(3), 229–263.
- Deng, S., & Oren, S. S. (2006). Electricity derivatives and risk management. *Energy*, 31(6–7), 940–953.
- Eichengreen, B. (1992). *Golden fetters: The gold standard and the Great Depression, 1919–1939*. Oxford University Press.
- Financial Stability Board. (2023). *High-level recommendations for global stablecoin arrangements*. https://www.fsb.org/2023/07/high-level-recommendations-for-the-regulation-supervision-and-oversight-of-global-stablecoin-arrangements-final-report/
- Hayes, A. S. (2019). Bitcoin price and its marginal cost of production: Support for a fundamental value. *Applied Economics Letters*, 26(7), 554–560. https://doi.org/10.1080/13504851.2018.1488040
- International Energy Agency. (2023). *World energy investment*. https://www.iea.org/
- Kydland, F. E., & Prescott, E. C. (1977). Rules rather than discretion: The inconsistency of optimal plans. *Journal of Political Economy*, 85(3), 473–492.
- Lazard. (2025). *Lazard's levelized cost of energy analysis*.
- Liu, Y., & Tsyvinski, A. (2021). Risks and returns of cryptocurrency. *Review of Financial Studies*, 34(6), 2689–2727.
- Nakamoto, S. (2008). *Bitcoin: A peer-to-peer electronic cash system*. https://bitcoin.org/bitcoin.pdf
- Wang, Y., & Su, C. (2024). Financing sustainable energy transition with algorithmic energy tokens. *Energy Economics*, 107420. https://doi.org/10.1016/j.eneco.2024.107420

---

## 10. Repo cross-links

| Artifact | Role |
|----------|------|
| `thesis_package/ceir_regression.py` | Reproducible CEIR |
| `thesis_package/empirical_results/ceir_analysis_summary.csv` | Coefficients cited above |
| `contracts/SolarPunkCoin.sol` | `mintFromSurplusAttestation` |
| `docs/product/ENERGY_STANDARD_ECONOMICS.md` | Issuance equations |
| `docs/product/CURRENCY_THEORY_AND_COMPARABLES.md` | Comparables map |
| `thesis_package/CHAPTER_5_GROUNDED_DRAFT.md` | Five-constraint implementation |
| `state/runtime/spk_v1.json` | Sepolia feasibility evidence |
