# AI Tokenomics, Stablecoins, and Agent Settlement — Research Record

**Status:** Frozen research snapshot (off-thesis).  
**Frozen:** 2026-06-28  
**Scope:** Objective industry + protocol analysis only. No SolarPunk product claims.  
**Companion:** [`AI_TOKENOMICS_SOLARPUNK_INTEGRATION.md`](./AI_TOKENOMICS_SOLARPUNK_INTEGRATION.md) — how conclusions map to SPK.

---

## 1. Purpose

This document freezes an external research pass on:

- **Tokenomics** — incentive, supply, sinks, and value-accrual design for crypto tokens  
- **Stablecoins** — economics, regulation, and settlement dominance  
- **“AI token dollars”** — LLM tokens, AI credits, credit wallets, and agent payments  

It is written for later reference. Update only when deliberately refreshing the research baseline.

---

## 2. Executive summary

Three layers are routinely conflated in headlines:

| Layer | What it is | Typical 2026 example |
|-------|------------|----------------------|
| **Meter** | Raw usage atom | LLM input/output tokens; GPU-hours |
| **Metric / internal unit** | Dollar-normalized accounting | AI Credits (1 AIC = $0.01 USD); SaaS credit wallets |
| **Settlement** | What actually moves as money | **USDC** (~98% of on-chain agent payments); cards via Stripe/Visa |

**Consensus pattern (2025–2026):**

> Meter in tokens → price in credits → **pay in existing dollar stablecoins** → issuer earns reserve yield (stablecoin side) or margin on credits (SaaS side).

A **new AI-native currency** is not winning machine commerce. **Programmable dollars + usage meters** are.

The frontier for crypto-native *finance* (distinct from micropayments) is **resource-backed synthetic dollars** — e.g. GPU-collateralized credit books (“InfraFi”) — not retail “ChatGPT coins.”

---

## 3. Taxonomy — four monetary layers

```text
┌─────────────────────────────────────────────────────────────┐
│ L4  SETTLEMENT     USDC, USDT, cards, Lightning, Tempo      │
├─────────────────────────────────────────────────────────────┤
│ L3  PRICING UNIT   AI Credits, SaaS credits, outcome units   │
├─────────────────────────────────────────────────────────────┤
│ L2  COMPUTE METER  LLM tokens, Effective Tokens (legacy)    │
├─────────────────────────────────────────────────────────────┤
│ L1  PHYSICAL       FLOPs, API calls, GPU-hours, kWh, bytes  │
└─────────────────────────────────────────────────────────────┘
```

**Design rule emerging in 2026:** keep layers separate. Collapsing L2–L4 into one speculative token is the dominant failure mode in both crypto tokenomics and AI billing.

---

## 4. Tokenomics — objective framework

### 4.1 Definition

**Tokenomics** = coded monetary policy: mint/burn rules, distribution, vesting, governance, faucets/sinks, and (if any) path from protocol activity back to token holders.

Practitioner frameworks ([Tokenomics.com](https://tokenomics.com/articles/how-to-design-tokenomics), [23studio 2026 guide](https://23stud.io/blog/how-to-design-token-economics-that-work)) emphasize:

1. **Utility first** — access, fees, collateral, staking; not governance-only  
2. **Supply & vesting** — insider allocation often ~40–55%; cliffs + 24–48 month linear unlock  
3. **Faucets ↔ sinks** — every emission needs demand (fees, burns, lockups, in-product consumption)  
4. **Simulation** — stress 36–60 months; large unlock events often correlate with sharp sell pressure  
5. **Regulatory bucket** — payment, utility, security-like, commodity-linked; design follows classification  

### 4.2 Archetypes

| Archetype | Mechanism | Value accrual | AI-era relevance |
|-----------|-----------|---------------|------------------|
| Store of value | Scarce supply (BTC) | Narrative + hold | Poor fit for metered compute |
| Gas / utility | Pay/burn for network use (ETH) | Fee burn + staking | L2 abstracts gas from users |
| Governance | Vote on parameters | Indirect; weak alone | Common failure mode |
| Revenue share | Fee switch, buyback, veToken | Direct if cash flows exist | Rarely implemented cleanly |
| Work / resource | Mint for proved delivery (DePIN, BME) | Tied to usage | Closest to metered issuance |
| Stable unit | 1:1 redeemable $ claim | Yield to **issuer**, not holder | What agents actually spend |

### 4.3 DePIN pattern — Burn-and-Mint Equilibrium (BME)

Infrastructure networks often use:

- Users face **fiat-denominated credits** (stable UX)  
- Protocol mints/burns a utility token against **proved service**  
- Customer unit of account is insulated from token volatility  

**Compute markets (illustrative):**

| Network | What is sold | Pricing | Native token role |
|---------|--------------|---------|-------------------|
| Akash | GPU/CPU lease hours | Reverse auction; USDC settlement added | AKT — infra incentive |
| Bittensor | Subnet inference quality | Emission / ranking rewards | TAO — speculation + incentives |
| Render | Render jobs | Marketplace | RNDR — supply-side |

Customer-facing checkout and protocol token often **diverge by design** in mature systems.

### 4.4 Recurring failures

- Governance-only tokens without sinks  
- Emissions without usage-linked demand  
- Promised value accrual without fee switch or revenue  
- Confusing the **meter** with the **money** or **investment**  
- “Ponzinomics” — returns from new entrants, not operations  

**2025–2026 shift:** revenue-first mechanism design — attach token to business cash flow, not the reverse.

---

## 5. Stablecoins — economics and regulation

### 5.1 Issuer business model (fiat-backed)

| Revenue | Mechanism | Scale driver |
|---------|-----------|--------------|
| Reserve yield | T-bills / cash equivalents; holders get 0% | Supply × interest rates |
| Distribution cost | Rebates to exchanges, partners | Can be majority of revenue (Circle/Tether analyses) |
| Payment fees | Mint/redeem, cross-chain, merchant | Agent + B2B volume |
| DeFi integration | Liquidity, lending | Crypto-native segment |

**Rate sensitivity:** industry estimates ~$125B+ stablecoin Treasury exposure; each **50 bps** Fed cut ≈ **$625M** less annual interest industry-wide (CCData, cited in financial press 2025).

**Implication:** late entrants compete on **distribution + compliance + rails**, not reserve alchemy.

### 5.2 Stablecoin types (expanded)

| Type | Backing | Yield to holder | Agent / AI fit |
|------|---------|-----------------|----------------|
| Fiat payment stable | Cash, T-bills | No (GENIUS: no interest on payment stables) | **Default agent settlement** |
| Yield-bearing / synthetic | T-bills + credit book | Yes (sUSDS, sUSDe, sUSDai) | Treasury / DeFi, not micropay |
| Crypto-collateral | On-chain overcollateral | Variable | DeFi composability |
| Algorithmic | Incentive curves | N/A | Historical caution |
| RWA / InfraFi | GPUs, loans, treasuries | Tranched (senior/junior) | AI **infrastructure finance** |

### 5.3 GENIUS Act (US, signed July 2025)

First federal **payment stablecoin** framework (summaries: [Goodwin](https://www.goodwinlaw.com/en/insights/publications/2025/06/alerts-finance-federal-stablecoin-legislation-poised), [Eversheds](https://www.eversheds-sutherland.com/nl/united-states/insights/the-genius-act-us-law-for-payment-stablecoins)):

- Only **Permitted Payment Stablecoin Issuers (PPSIs)** may issue  
- **100%** liquid backing; monthly disclosure  
- **No interest** to payment-stablecoin holders  
- AML/BSA; freeze/seize capability  
- Effective ~January 2027 or 120 days after final rules  

**Effect:** reinforces USDC/USDT oligopoly for payments; raises bar for new $1 coins.

### 5.4 Why agents chose stablecoins

[Keyrock report](https://cointelegraph.com/news/ai-agents-using-stablecoins-as-default-settlement-layer-keyrock) (May 2025 – Apr 2026, widely cited):

| Metric | Value |
|--------|-------|
| Settled volume | ~$73M |
| Transactions | ~176M |
| Average tx size | ~$0.31 |
| USDC share | >98% |

**Economic logic:** card rails carry ~**$0.30 fixed fee** — often larger than the payment itself. L2 stablecoin settlement can be sub-cent ([micropayment analysis](https://www.agentpmt.com/articles/pricing-for-micropayments-why-the-unit-you-choose-matters-more-than-the-number)).

Stablecoins won **by default** — sub-dollar economics — not by ideology.

**Systemic note:** concentration on Circle/USDC is treated as validation and vulnerability in analyst writeups.

---

## 6. “AI tokens” as meter — LLM tokens → AI Credits

### 6.1 Raw LLM tokens

- Billing atom from providers (input, output, cache read/write, reasoning)  
- **Not comparable across models** at face value  
- Inference cost deflation: order-of-magnitude annual declines depending on workload (Stanford AI Index, cited in industry pricing literature)  

### 6.2 Effective Tokens (ET) — deprecated normalized meter

[GitHub gh-aw Effective Tokens spec](https://github.github.com/gh-aw/specs/effective-tokens-specification/):

- Unitless normalized **computational intensity** across token classes and models  
- **Independent of billing** — useful for engineering comparison  
- **Deprecated June 2026** in favor of dollar-aligned metrics  

### 6.3 AI Credits (AIC) — normative metric (2026)

[AI Credits Specification v1.4](https://github.github.com/gh-aw/specs/ai-credits-specification/) (GitHub Agentic Workflows):

- **1 AIC = $0.01 USD**  
- Per invocation: `cost_usd = Σ(token_class × price_per_token)` then `AIC = cost_usd / 0.01`  
- Governance: `max-ai-credits` per run; `max-daily-ai-credits` rolling 24h cap  
- Enforcement: infrastructure firewall (HTTP 429 on budget exceed) — not dashboard-only  

**Critical:** AIC is a **metric**, not an on-chain token.

### 6.4 SaaS credit wallets

[Ibbaka 2026 predictions](https://www.ibbaka.com/ibbaka-market-blog/b2b-saas-and-agentic-ai-pricing-predictions-for-2026):

- Credit wallets → standard billing infrastructure  
- Credits = prepaid pools across products/agents  
- Bridge strategy: credits now → **outcome-based pricing** when value data matures  

**Granularity choice** ([Ibbaka credit design](https://www.ibbaka.com/ibbaka-market-blog/a-guide-to-the-design-of-credit-based-pricing-for-ai-agents)):

| Approach | Charges for | Tradeoff |
|----------|-------------|----------|
| Cost-based | Every LLM call / token | Tracks COGS; punishes exploration |
| Value-based | Outcomes on “value path” | Aligns to ROI; harder to meter |

**Maturity:** [Tanso dataset analysis](https://pricinginnovation.substack.com/p/credit-based-pricing-execution-patterns) — minority of vendors are fully “credit-native”; **cross-vendor fungible credits** largely unsolved (2026).

---

## 7. “AI tokens” as currency — agentic commerce

### 7.1 HTTP 402 payment protocols

| Protocol | Backers | Settlement | Strength |
|----------|---------|------------|----------|
| [x402](https://www.x402.org/) | Coinbase, Cloudflare | USDC-first; EVM/Solana | Crypto-native micropayments |
| [MPP](https://github.com/mbeato/awesome-mpp) (Machine Payments Protocol) | Stripe, Tempo (Mar 2026) | Cards, stables, Lightning, 15+ chains | Enterprise; session budgets |

**Flow:** request → `402 Payment Required` → sign → retry with payment credential → settle (~200ms–1s).

**Schemes:** `exact`, `upto` (usage cap), `batch-settlement` (high-frequency batching).

**No native protocol token** by design — value to facilitators, chains, wallets, identity layers.

**Caveat:** early x402 volume included non-enterprise activity; scale vs Visa remains tiny.

### 7.2 Wallet + identity stack (2026)

| Component | Role | Examples |
|-----------|------|----------|
| Agent wallets | Spend limits, programmatic policy | Coinbase [AgentKit](https://github.com/coinbase/agentkit), Agentic Wallets |
| Agent identity | Reputation, KYA | ERC-8004 (mainnet Jan 2026) |
| Commercial terms | Escrow, delivery attestation | ERC-8183 (emerging) |
| Risk scoring | Pre-tx trust | ERC-8126 (emerging) |

**Two visions** ([gigs.sh field guide](https://gigs.sh/blog/agent-to-agent-payments)):

1. **Crypto-native:** pseudonymous agents + USDC + x402  
2. **Identity-native:** Visa TAP, Mastercard Agent Pay, Stripe ACP — agent traces to licensed entity  

**Practical default (2026):** MCP-aware agent + x402 wallet + **USDC on Base**.

### 7.3 Stripe / OpenAI / enterprise lane

- Stripe Agent Toolkit, OpenAI checkout (ACP), Mastercard Agent Pay — card and identity-mediated flows  
- [Tempo](https://www.emergingfintech.co/p/the-agentic-web-inside-the-protocol) — L1 incubated for high-volume payments; MPP rail-agnostic  

---

## 8. Frontier — InfraFi and GPU-backed synthetic dollars

**USD.AI / USDai / sUSDai** ([Stablewatch deep dive](https://www.stablewatch.io/research/usd-ai-deep-dive), [Aave governance discussion](https://governance.aave.com/t/arfc-onboard-usdai-susdai-to-aave-v3-arbitrum-instance/23260)):

| Token | Role | Backing |
|-------|------|---------|
| USDai | Liquid synthetic dollar | T-bills (e.g. via M0); mint from USDC/USDT |
| sUSDai | Yield-bearing claim | GPU-collateralized loans + treasuries |

Frameworks: **CALIBER** (legal hardware tokenization), **FiLo** (curator underwriting), **QEV** (redemption queue for illiquid RWA).

**This is wholesale AI infrastructure finance**, not agent micropayment currency.

**Risks:** hardware depreciation, borrower default, redemption liquidity, regulatory classification of yield-bearing synthetics.

---

## 9. Cross-cutting tensions

| Tension | Summary |
|---------|---------|
| Meter vs money vs investment | Collapsing layers → user confusion + regulatory risk |
| Deflationary compute vs inflationary protocol tokens | Issuance tokens face opposite pressure to falling inference cost |
| Dollar supremacy vs resource anchoring | Agents standardized on USD (USDC) before compute-native units won |
| Credit wallet fragmentation | Orchestrator agents need many vendor-specific pools; fungibility unsolved |
| Regulation compresses stablecoin design | GENIUS + AML → payment stables = licensed banking-lite |

---

## 10. Keyword map

| Term | Precise 2026 meaning | On-chain? |
|------|----------------------|-----------|
| Tokenomics | Incentive + supply design for a crypto token | Yes |
| Payment stablecoin | Redeemable $1 claim; issuer earns spread | Yes |
| LLM token | API billing atom | No |
| Effective Token (ET) | Normalized compute intensity (legacy) | No |
| AI Credit (AIC) | $0.01-denominated inference cost metric | No |
| SaaS credit | Vendor prepaid usage unit | Sometimes ledger |
| x402 / MPP payment | HTTP-native settlement instruction | Settlement yes |
| USDC | Agent settlement currency | Yes |
| USDai / sUSDai | Synthetic dollar + GPU yield tranche | Yes |
| TAO / AKT | Infra incentive / speculation tokens | Yes |

---

## 11. Research conclusions (frozen)

1. **“AI token dollar”** in practice = **credits as metric + USDC as currency**, not a new winning coin.  
2. **Agent economy** = high-volume **micropayments** on existing stables; not new tokenomics at settlement.  
3. **Stablecoin economics** = mature, consolidating; winners have distribution + compliance + scale.  
4. **InfraFi** = serious crypto+AI **credit** lane; separate from retail agent checkout.  
5. **Resource-backed issuance** (energy, GPU) remains viable as **domain unit** if circulation exists; settlement at the edge still tends toward **USD**.  
6. **No native protocol token** (x402) is a feature — adoption over rent-seeking.

---

## 12. Open questions (unsettled as of freeze date)

1. Cross-vendor **fungible AI credits** vs USDC as only fungible layer?  
2. **Outcome-based agent pricing** vs granular token metering — which dominates enterprise?  
3. **MPP vs x402** — partition (enterprise vs crypto-native) or converge?  
4. Can **resource-backed issuance** circulate without dollar settlement at the boundary?  
5. How does GENIUS treat **yield-bearing synthetics** vs **payment stables**?

---

## 13. Primary sources

| Topic | URL |
|-------|-----|
| AI Credits spec | https://github.github.com/gh-aw/specs/ai-credits-specification/ |
| ET → AIC migration | https://github.github.com/gh-aw/blog/2026-06-08-migrating-from-effective-tokens-to-ai-credits/ |
| Cost management (gh-aw) | https://github.github.com/gh-aw/reference/cost-management/ |
| Agent stablecoin volume | https://cointelegraph.com/news/ai-agents-using-stablecoins-as-default-settlement-layer-keyrock |
| x402 whitepaper | https://www.x402.org/x402-whitepaper.pdf |
| x402 docs | https://docs.x402.org/faq |
| MPP registry | https://github.com/mbeato/awesome-mpp |
| Agent payment stack | https://gigs.sh/blog/agent-to-agent-payments |
| Agentic web protocols | https://www.emergingfintech.co/p/the-agentic-web-inside-the-protocol |
| Credit pricing (Ibbaka) | https://www.ibbaka.com/ibbaka-market-blog/a-guide-to-the-design-of-credit-based-pricing-for-ai-agents |
| Credit execution patterns | https://pricinginnovation.substack.com/p/credit-based-pricing-execution-patterns |
| USD.AI research | https://www.stablewatch.io/research/usd-ai-deep-dive |
| Stablecoin economics | https://stablecoininsider.org/stablecoin-economics/ |
| GENIUS Act (Goodwin) | https://www.goodwinlaw.com/en/insights/publications/2025/06/alerts-finance-federal-stablecoin-legislation-poised |
| Tokenomics design | https://tokenomics.com/articles/how-to-design-tokenomics |
| Coinbase AgentKit | https://github.com/coinbase/agentkit |

---

## 14. Maintenance

- **Do not** edit for SolarPunk product claims — use the integration doc.  
- **Refresh** only when deliberately re-running external research (new primary sources, new regulation, material volume shifts).  
- On refresh: bump **Frozen** date, add **Change log** section at bottom.

**Change log**

| Date | Note |
|------|------|
| 2026-06-28 | Initial frozen research record |
