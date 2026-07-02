# AI Tokenomics × SolarPunk — Integration Decision

**Status:** Authoritative integration plan (off-thesis).  
**Frozen:** 2026-06-28  
**Reads with:** [`AI_TOKENOMICS_RESEARCH.md`](./AI_TOKENOMICS_RESEARCH.md) (objective) · [`AI_TOKENOMICS_SOLARPUNK_INTEGRATION.md`](./AI_TOKENOMICS_SOLARPUNK_INTEGRATION.md) (reference)

This document **decides** what to integrate, what SolarPunk still lacks, and how the research plugs in. It overrides informal chat summaries when they conflict.

---

## 1. Decision in one block

**Integrate AI tokenomics as three parallel rails — never merge into SPK issuance.**

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ RAIL A — SPK (on-chain, authoritative)                                   │
│   Surplus kWh → attestation → mint → network payments → optional redeem  │
│   Identity: energy-network money. Peg off. No AI in mint formula.        │
├──────────────────────────────────────────────────────────────────────────┤
│ RAIL B — USD / USDC (commercial + external)                                │
│   Case studies, pilots, APIs, compute, data vendors                      │
│   Identity: how humans/agents PAY YOU and you PAY THE WORLD                │
├──────────────────────────────────────────────────────────────────────────┤
│ RAIL C — AI Credits / ops metering (off-chain, advisory)                   │
│   Intelligence layer, LLM reports, intake QA, pilot narrative            │
│   Identity: internal cost + risk accounting. AIC-style $0.01 units.       │
│   Rule unchanged: AI advises; contracts decide.                            │
└──────────────────────────────────────────────────────────────────────────┘
```

**Rejected:** unified AI+energy coin · SPK for OpenAI/Akash checkout · mint tied to inference · new protocol token for agents.

**Why this is best:** 2026 agent research shows **USDC won settlement** and **credits won metering**. SolarPunk already mirrors that shape with **SPK as domain unit** instead of credits. Fighting both oligopolies at once (USDC + energy issuance) loses. Composing rails wins.

---

## 2. What SolarPunk still lacks (honest gap inventory)

Gaps are **not** “more AI code.” They are **velocity, packaging, and external proof**.

### 2.1 Blocking gaps (closed pilot — from `launch_gate.json`)

| Gap | Evidence | AI research relevance |
|-----|----------|------------------------|
| **Real operator L2+** | `real_operator_source: false`, provenance L0 | Research irrelevant until meter is real |
| **Governed deploy** | Public proof deploy, not multisig pilot stack | Agent rails don’t fix governance |
| **Hardware L2+** | Fixture/sample only | AI can’t substitute attestation |
| **Economics anchor** | Support gap ~$2.9k/yr on 10 kW model | USDC revenue from pilots closes part of this |
| **Fresh ops evidence** | Keeper stale (blocking check) | Autosync discipline, not AI |

### 2.2 Circulation gaps (why mint feels weird)

| Gap | State today | What research says |
|-----|-------------|-------------------|
| **No external network** | Operator-choreographed 4-party cycle | Agents need counterparties; so does SPK |
| **No labeled pilot economy** | Preset addresses, not named businesses | Credit wallets need **spend paths** — same for SPK |
| **Redemption > narrative need** | Redemption exists but circulation-first story under-deployed | AI sinks don’t replace **in-network** velocity |

### 2.3 Commercial / packaging gaps

| Gap | State today | Research integration |
|-----|-------------|-------------------|
| **No single front door** | No `PORTFOLIO.md` | N/A — pure packaging |
| **No paid motion** | SKUs documented, $0 collected | **Rail B:** invoice / USDC first |
| **API is free** | `spk-v1-api` — no payment gate | **Rail B:** x402 later on `/intake/report` only |
| **No outreach execution** | `DATA_REQUEST_OUTREACH.md` exists, unrun | Rail B leads; AI is not the pitch |

### 2.4 AI-adjacent gaps (where research actually lands)

| Gap | State today | Should become |
|-----|-------------|---------------|
| **Intelligence = deterministic only** | `implementation_stage: deterministic_risk_stack_v1_no_llm_required` | Rail C: optional LLM narrative **with AIC budget** |
| **No ops cost model for AI** | No `max-ai-credits` equivalent in repo | Rail C: document caps in operator runbook |
| **No treasury lane** | Deployer wallet for gas only | Rail B: named **ops USDC wallet** (spreadsheet OK) for APIs/LLM |
| **No x402 / MPP** | Not in codebase | **Defer** until first paying API customer |
| **No agent-facing SKU** | Pilots sold to humans | Optional later: “attestation API for agents” in USD |

### 2.5 What we do **not** lack (don’t rebuild)

- Attested mint path, replay protection, stress harnesses  
- Intelligence risk stack (advisory), finance dossier honesty  
- `PAYMENT_KIND_SERVICE`, circulation metrics, exploration Tier C  
- Commercial packet, closed-pilot playbook, outreach templates  

**Conclusion:** SolarPunk is **over-built on mechanism**, **under-built on market + velocity**. AI tokenomics **does not** fix the blocking gaps; it **equips Rail B and Rail C** once external flow starts.

---

## 3. How research integrates (gap → action map)

| # | SolarPunk gap | Research conclusion | Integration action | Rail | Priority |
|---|---------------|---------------------|-------------------|------|----------|
| 1 | No external operator | Settlement needs counterparties | Run outreach; **ignore AI in pitch** | — | **P0** |
| 2 | Mint feels dead | Credits need spend paths; agents need velocity | Closed pilot: **5+ SPK payments/week** among named roles | A | **P0** |
| 3 | No revenue | Agents pay USDC; humans pay invoices | Sell **$500 case study** in USD; SPK = preview artifact | B | **P0** |
| 4 | No portfolio surface | N/A | `PORTFOLIO.md` + demo video | — | **P0** |
| 5 | Intelligence static | AIC = ops metering, not money | Add runbook: LLM report steps + **$ cap per pilot** (e.g. $10/run) | C | **P1** |
| 6 | Ops spend invisible | Treasury pays AI in dollars | Document **ops wallet**: USDC for NASA keys, LLM, hosting | B | **P1** |
| 7 | Stale keeper | N/A | `foundation:weekly` on calendar / CI green | — | **P1** |
| 8 | Governed deploy | Compliance matters for real pilots | `foundation:multisig:dry-run` → execute when ops boring | A | **P2** |
| 9 | Free API | x402 + USDC for micropay APIs | Gate **one** endpoint after 3rd paying customer | B | **P3** |
| 10 | Local compute story | SERVICE payments = in-network sink | One campus merchant accepts SPK for forecast job | A | **P3** |
| 11 | Horizon C finance | InfraFi = GPU credit, not agent coin | Literature only; grant language for audit capital | — | **P4** |
| 12 | Agent economy | USDC default | Never position SPK as agent currency | — | **Never** |

---

## 4. Recommended sequence (decided — do in this order)

### Phase 0 — Hold the core (now)

- **No** AI mint, **no** new tokens, **no** x402 code.  
- Freeze docs (done).  
- Thesis + SPK contracts unchanged.

### Phase 1 — Packaging + first dollar (weeks 1–4)

| Step | Deliverable | Rail |
|------|-------------|------|
| 1 | `PORTFOLIO.md` — problem, demo, Etherscan, 3 SKUs | — |
| 2 | 10 outreach emails (`DATA_REQUEST_OUTREACH.md`) | — |
| 3 | First external CSV → case study MD | B (invoice USD) |
| 4 | `foundation:weekly` green | — |

**AI integration in Phase 1:** zero on-chain. Optional: use Rail C to **draft** case-study prose with a **$5 cap** per report.

### Phase 2 — Closed pilot velocity (months 2–4)

| Step | Deliverable | Rail |
|------|-------------|------|
| 1 | Named operator L2+ intake | A |
| 2 | Governed Sepolia redeploy when ready | A |
| 3 | Weekly SPK payments among **labeled** counterparties | A |
| 4 | Shadow pilot $1.5–5k/mo if lead converts | B |

**AI integration in Phase 2:**

- Rail C: weekly intelligence summary for operator (AIC-budgeted).  
- Rail B: operator pays **you** in USD; **you** pay LLM/data in USDC from ops wallet.  
- Rail A: SPK never pays OpenAI directly.

### Phase 3 — Optional product hooks (only if Phase 2 has payer)

| Step | Deliverable | Rail |
|------|-------------|------|
| 1 | `POST /v1/intake/preview` stays free; `…/report` = x402 USDC | B |
| 2 | One SERVICE payment: SPK → campus compute / report merchant | A |
| 3 | Intelligence v2: LLM-assisted anomaly explanations (advisory) | C |

### Phase 4 — Never without partner

- SPK peg-on, InfraFi-style financing, agent-directory listing, TAO/AKT bridges.

---

## 5. Architecture diagram (integrated system)

```text
                    EXTERNAL WORLD
                          │
          ┌───────────────┼───────────────┐
          │               │               │
     [Operator CSV]   [Paying customer]  [LLM / NASA / GPU APIs]
          │               │               │
          ▼               ▼               ▼
    ┌──────────┐   ┌──────────┐   ┌──────────────┐
    │ Rail A   │   │ Rail B   │   │ Rail B       │
    │ attest → │   │ USD/USDC │   │ USDC out     │
    │ mint SPK │   │ invoice  │   │ (ops wallet) │
    └────┬─────┘   └────┬─────┘   └──────┬───────┘
         │              │                 │
         │         case study $           │
         │              │                 │
         ▼              ▼                 ▼
    ┌─────────────────────────────────────────────┐
    │           OFF-CHAIN PRODUCT LAYER            │
    │  operator_data_intake · intelligence layer   │
    │  Rail C: AIC-style caps on LLM spend         │
    └─────────────────────┬───────────────────────┘
                          │
                          ▼
    ┌─────────────────────────────────────────────┐
    │         SEPOLIA — Rail A on-chain            │
    │  SolarPunkCoin mint · CurrencySystem pay     │
    │  Circulation metrics · optional redeem       │
    └─────────────────────────────────────────────┘
```

**Mint authority never crosses from Rail C or B into Rail A.**

---

## 6. Concrete repo touchpoints (where work would land)

| Integration item | File / command | Phase |
|------------------|----------------|-------|
| Case study revenue | `scripts/operator_data_intake.js` → deliverable MD | 1 |
| Ops USDC policy | New: `docs/foundation/OPS_TREASURY.md` (optional) | 1–2 |
| AIC-style runbook | New: `docs/foundation/AI_OPS_BUDGET.md` (optional) | 1 |
| Intelligence LLM assist | `scripts/spk_intelligence_layer.js` (advisory only) | 2–3 |
| Payment-gated API | `spk-v1-api` + x402 middleware | 3 |
| SPK SERVICE sink | `run_spk_v1_operator_cycle.js` labeled merchant | 3 |
| Launch gate green | `npm run product:launch-gate` | 2 |

**No Phase 0–2 contract changes required for AI integration decision.**

---

## 7. Success criteria (how we know integration worked)

| Rail | Metric | Target |
|------|--------|--------|
| **A** | External operator L2+ | 1 signed intake |
| **A** | On-chain SPK payments (non-self) | ≥5 in 30 days during pilot |
| **B** | Cash collected | ≥$500 case study or signed SOW |
| **B** | Ops wallet | Documented USDC spend for 1 API/LLM line item |
| **C** | LLM assist | ≥1 pilot report with logged $ cap |
| **Never** | SPK spent on public AI API | 0 txs |

---

## 8. Crosswalk — research conclusions → our gaps

| Frozen research conclusion | Our gap it addresses | Action |
|----------------------------|----------------------|--------|
| USDC = agent settlement | We shouldn’t build SPK-for-agents | **Reject** agent-SP K |
| Credits = metering | No ops cost discipline | **Rail C** runbook |
| x402 = API monetization | Free API | **Phase 3** only |
| InfraFi ≠ micropay | Confusion on GPU dollars | **Comparator** for grants |
| GENIUS = licensed stables | Peg dreams solo | **Partner** for Horizon C |
| Velocity > market cap | Weird mint | **Pilot payments** |
| Distribution beats issuance | No customers | **Outreach + USD SKU** |

---

## 9. What to build vs what to document only

| Build (code) | Document only (now) |
|--------------|---------------------|
| Nothing for AI integration in Phase 0–1 | This decision + frozen research |
| x402 gate (Phase 3, conditional) | Ops treasury policy |
| Optional LLM in intelligence (Phase 2+) | AIC budget template |
| — | InfraFi / agent-token comparators |

**Bias:** document the rails clearly; **code only when Phase 1–2 produces a payer or operator.**

---

## 10. Final word

**Best integration for SolarPunk:** treat AI tokenomics research as **validation + ops/commercial playbook**, not a new product axis.

- **Research says:** meter with credits, settle with USDC.  
- **SolarPunk says:** meter with kWh, issue SPK, settle externally in USD.  
- **They integrate** at the **treasury and advisory boundary**, not at the mint.

**What’s still lacking in ours:** operator, circulation, packaging, first revenue — same gaps as before the AI research. **AI research does not shrink that list; it tells us where not to waste time (agent stablecoin, unified token).**

---

**Change log**

| Date | Note |
|------|------|
| 2026-06-28 | Initial authoritative integration decision |
