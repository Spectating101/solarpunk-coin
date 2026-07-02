# AI Tokenomics × SolarPunk — Integration Record

**Status:** Frozen integration analysis (off-thesis).  
**Frozen:** 2026-06-28  
**Prerequisite:** [`AI_TOKENOMICS_RESEARCH.md`](./AI_TOKENOMICS_RESEARCH.md) (objective research — read first).  
**Decision record:** [`AI_INTEGRATION_DECISION.md`](./AI_INTEGRATION_DECISION.md) — **authoritative** plan (gaps, rails, sequence). Read that for what to do.  
**Thesis:** Grounded manuscript stays frozen; this doc guides **optional** product/exploration boundaries only.

---

## 1. Purpose

This document answers:

> Given the frozen AI tokenomics / stablecoin / agent-settlement research, **how does it correlate with SolarPunk SPK** — and what should we **integrate vs not integrate**?

It does **not** authorize mainnet launch, stablecoin claims, or AI-token issuance without separate launch-gate evidence.

---

## 2. Integration thesis (one paragraph)

SolarPunk and the 2026 AI money stack share the **same layer cake** (physical meter → domain unit → dollar settlement), but **different anchors** (surplus kWh vs inference/compute). The AI market has already chosen **USDC for settlement** and **credits for metering**. SolarPunk should **issue on energy (SPK)**, **circulate inside energy networks**, and **pay for external AI/compute in dollars (USDC or SaaS credits)** — not merge AI consumption into the mint formula or rebrand SPK as an “AI dollar.”

---

## 3. Architectural alignment

### 3.1 Layer mapping

| Layer | AI market (2026) | SolarPunk SPK v1 | Alignment |
|-------|------------------|------------------|-----------|
| **L1 Physical** | FLOPs, API calls, GPU-hours | Verified surplus kWh | Different resource; same *pattern* |
| **L2 Meter** | LLM tokens → AIC | Signed readings → attestation → source hash | Both require **trusted metering** |
| **L3 Pricing unit** | AI Credits ($0.01) | SPK (~1 kWh); USD/kWh **reference** (peg off) | Both separate **unit** from **dollar** |
| **L4 Settlement** | USDC (x402, MPP) | SPK network payments; USDC = Horizon C / external rail | **Diverge here by design** |

### 3.2 Production vs consumption rhyme

Already documented in [`PRODUCTION_VS_CONSUMPTION.md`](./PRODUCTION_VS_CONSUMPTION.md):

| System | Energy direction | Role |
|--------|------------------|------|
| Bitcoin / CEIR | Consumption (mining burn) | Passive anchor limits |
| SolarPunk SPK | Production (surplus export) | Designed issuance |
| AI stack | Consumption (inference burn) | Credits / USDC pay |

**Integration insight:** AI is a **consumption sink** for treasury/ops, not a **second issuance anchor**.

```text
Surplus kWh ──mint──► SPK ──circulate──► energy-network participants
                              │
                              └── (optional) treasury ──USDC──► AI / compute / APIs
```

---

## 4. What integrates cleanly

### 4.1 Off-chain intelligence layer (★★★★★ fit)

**Repo:** `docs/product/SPK_INTELLIGENCE_LAYER.md`  
**Rule today:** *AI advises; contracts decide.*

| Research item | SolarPunk use |
|---------------|---------------|
| AI Credits (AIC) | Budget operator/pilot LLM spend ($0.01 units) |
| `max-ai-credits` / daily guardrails | Cap per intake run, per weekly pilot report |
| Cost-based vs value-based credits | Cost-based for dev ops; value-based if selling “case study” outcomes |

**Integration:** Upgrade intelligence v1 (deterministic) → **LLM-assisted advisory** with explicit AIC budgets. **No contract changes** for mint authority.

### 4.2 Paid services settlement — USDC / x402 (★★★★☆ fit)

**Repo:** `docs/product/PILOT_COMMERCIAL_PACKET.md`, `spk-v1-api` (`docs/foundation/BACKEND.md`)

| SKU | Settlement per research |
|-----|-------------------------|
| Data-only case study ($500–1.5k) | Invoice or **x402 + USDC** for API report |
| Shadow pilot | USDC / wire; credits for internal ops only |
| Closed beta | Contract + USDC; SPK remains testnet network money |

**Integration:** Buyers pay in **dollars**; SPK mint stays **energy-gated**. Aligns with agent economy (>98% USDC).

### 4.3 On-chain SERVICE payments — optional pilot sink (★★★☆☆ fit)

**Repo:** `contracts/SolarPunkCurrencySystem.sol` — `PAYMENT_KIND_SERVICE`  
**Doc:** `docs/product/NETWORK_MONEY.md` — circulation-first, redemption secondary

One **named merchant** in a closed pilot may accept SPK for:

- Forecast / report generation (campus lab)  
- Local inference on operator hardware  

**Integration:** Fixes “mint feels weird” via **velocity inside the network**, not via global AI rails.

### 4.4 Stablecoin / Horizon C comparators (★★★☆☆ reference)

**Repo:** `docs/foundation/INSTRUMENT_COMPARISON.md`, `simulate_peg.py`, exploration P5 peg-vs-oracle

| Research | SolarPunk use |
|----------|---------------|
| GENIUS payment-stable rules | Confirms new $1 SPK peg is **partner/licensed** path, not solo retail |
| Reserve yield compression | Supports `ECONOMIC_LAUNCH_READINESS.md` — fees don’t fund ops |
| InfraFi (USDai / GPU loans) | **Comparator** for financing pilots/audit, not SPK identity |

### 4.5 OSS landscape — selective (★★☆☆☆ research only)

**Repo:** `docs/foundation/OSS_LANDSCAPE.md`

| Do | Don’t |
|----|-------|
| Study AgentKit / x402 for **seller** APIs | Fork heavy AI demo apps as SPK core |
| Use credit-wallet billing patterns for **pilot ops** | Treat CV solar detection as mint proof |
| Reference Akash/Bittensor as **compute comparators** | Merge TAO/AKT into SPK tokenomics |

---

## 5. What does not integrate (explicit non-goals)

| Idea | Why not |
|------|---------|
| Mint SPK from AI usage | Breaks energy anchor; wrong meter |
| SPK as agent settlement currency | USDC won; no distribution |
| “AI credits = SPK” | Different units (inference $ vs kWh) |
| Single AI+energy protocol token | Narrative blur; dual sinks unsolved |
| Retail stablecoin as AI strategy | GENIUS + oligopoly; repo economics block |
| InfraFi GPU dollar **as** SPK | Wholesale credit ≠ network money v1 |

**User decision (preserved):** AI compute consumption was **never** integrated into issuance — research **validates** that choice.

---

## 6. “Weird mint” — research-backed diagnosis

| Symptom | Cause | Research-aligned fix |
|---------|-------|----------------------|
| SPK appears “from nowhere” | Issuance is rule-based on **past** surplus, not hand delivery at mint | Expected for circulation-first money |
| Tokens “gone” after mint | Attestation consumed; SPK is **fungible** network unit | Same as credit burn → dollar float separation |
| No economic feel | **No external circulation** | Closed pilot velocity > more mint rules |
| Temptation to spend on AI | Need **sinks** | USDC for external AI; SPK for **in-network** SERVICE |

---

## 7. Fit scorecard (frozen)

| Integration path | Fit | Effort | When |
|------------------|-----|--------|------|
| AIC budgeting on intelligence layer | ★★★★★ | Low | Any active pilot / intake volume |
| USDC/x402 for paid case-study API | ★★★★☆ | Medium | Commercial Phase 1–3 |
| LLM-assisted intake validation (advisory) | ★★★★☆ | Low | External CSV flow |
| Treasury USDC → compute providers | ★★★☆☆ | Medium | Closed beta with ops budget |
| SPK on-chain pay for local compute merchant | ★★☆☆☆ | High | Named partner only |
| Unified AI+energy token | ★☆☆☆☆ | — | **Reject** |

---

## 8. Recommended integration horizons

### Horizon I — Now (no mint changes)

- Document frozen research (this folder).  
- Intelligence layer: optional LLM reports with **AIC caps** in runbooks.  
- Commercial: price case studies in **USD**; SPK as **preview only**.

### Horizon II — Closed pilot

- Real operator L2+ data → mint unchanged.  
- **SPK circulation** among labeled counterparties (`PILOT_PLAYBOOK.md`).  
- Operator treasury: **USDC** for forecasting APIs, report LLM, monitoring.

### Horizon III — Optional product experiments

- x402-gated HTTP endpoint: pay USDC → `operator_data_intake` report JSON.  
- One SERVICE payment type demo: SPK → campus compute merchant.  
- Peg module / InfraFi study for **financing** audit stack — not agent checkout.

### Horizon IV — Explicitly deferred

- SPK as stablecoin for agents.  
- Cross-anchored mint (kWh + GPU).  
- New protocol token for AI.

---

## 9. Repo touchpoints (where integration lands in code/docs)

| Concern | Path |
|---------|------|
| Issuance rules | `contracts/SolarPunkCoin.sol`, `docs/product/SPK_V1.md` |
| Circulation | `docs/product/NETWORK_MONEY.md`, `SolarPunkCurrencySystem.sol` |
| Advisory AI | `docs/product/SPK_INTELLIGENCE_LAYER.md`, `scripts/` intelligence generators |
| Commercial | `docs/product/PILOT_COMMERCIAL_PACKET.md` |
| Launch gates | `state/product/launch_gate.json` |
| External APIs | `docs/foundation/BACKEND.md`, `spk-v1-api` |
| OSS comparators | `docs/foundation/OSS_LANDSCAPE.md` |
| CEIR contrast | `docs/exploration/PRODUCTION_VS_CONSUMPTION.md` |
| Peg / stablecoin | `docs/foundation/MONETARY_FOUNDATION.md`, exploration P5 |

**No new contracts required** for Horizon I–II integration.

---

## 10. Language guide (public claims)

**Safe**

- “Energy-attested issuance; dollar settlement for external services.”  
- “AI advises on risk; contracts decide mint.”  
- “Pilot ops may use standard AI credit metering and USDC APIs.”  

**Avoid**

- “SPK is the AI agent currency.”  
- “Mint scales with inference.”  
- “AI-token dollar integrated into SPK issuance.”  

See also `docs/product/PUBLIC_LAB_SOCIAL_KIT.md`.

---

## 11. Conclusions for SolarPunk (frozen)

1. **Research supports the existing architecture** — energy issuance, circulation-first SPK, dollar rails externally.  
2. **AI tokenomics integrates at the boundary** — metering, treasury, paid APIs — not inside `mintFromSurplusAttestation`.  
3. **Agent economy validates** not competing with USDC on micropayments; SPK competes on **energy attestation + network settlement**.  
4. **“Spend mint on AI”** is rephrased: **treasury spends USDC on AI**; **network spends SPK on participants**.  
5. **Next meaningful integration work** is commercial (x402 case study) or pilot (SERVICE sink), not a new AI token.

---

## 12. Related internal docs

| Doc | Relationship |
|-----|--------------|
| [`AI_TOKENOMICS_RESEARCH.md`](./AI_TOKENOMICS_RESEARCH.md) | Objective branch (prerequisite) |
| [`PRODUCTION_VS_CONSUMPTION.md`](./PRODUCTION_VS_CONSUMPTION.md) | Energy production vs burn contrast |
| [`CEIR_TO_SPK_LITERATURE_BRIDGE.md`](../product/CEIR_TO_SPK_LITERATURE_BRIDGE.md) | Literature matrix (product folder) |
| [`MONETARY_FOUNDATION.md`](../foundation/MONETARY_FOUNDATION.md) | Three horizons A–C |
| [`PILOT_COMMERCIAL_PACKET.md`](../product/PILOT_COMMERCIAL_PACKET.md) | USD-priced SKUs |

---

## 13. Maintenance

- Update when **deliberately** changing SPK integration policy or refreshing `AI_TOKENOMICS_RESEARCH.md`.  
- Do not fold into thesis manuscript without explicit author decision.

**Change log**

| Date | Note |
|------|------|
| 2026-06-28 | Initial frozen integration record |
