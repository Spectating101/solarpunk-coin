# Institutional Materialization Path

**Created:** 2026-06-07  
**Status:** Active — post-thesis operating plan  
**Audience:** You, advisor, grant reviewers, operator partners  
**Not this doc:** currency-launch pitch, thesis editing guide, or mainnet roadmap

---

## 1. What this path is

The **institutional materialization path** is how SolarPunk becomes a **credible energy-linked settlement research platform** — funded, partnered, and evidenced — **without** claiming to become legal tender or a public cryptocurrency product.

| Dimension | Institutional path | Currency fantasy path |
|-----------|-------------------|----------------------|
| **Goal** | Publishable lab + closed pilot evidence | Mass adoption, liquidity, “new money” |
| **Chain** | Sepolia testnet, capped exposure | Mainnet, real funds |
| **Funding** | Grants, RA, NSTC, in-kind operator data | VC, token sale, solvency raise |
| **Success** | Advisor support, pilot report, paper/grant | Market cap, users, legal classification |
| **Failure mode** | Archive as portfolio — still valuable | Regulatory / reputational damage |

Institutions fund **questions, infrastructure, and inspectable outputs**. They do not fund “replace the dollar” from an MSc side project. This path aligns with what the repo already enforces via launch gates and thesis boundaries.

---

## 2. North-star outcome (18–24 months)

**Target identity (realistic):**

> Built and operated an open-source **energy-attested settlement laboratory** on Ethereum testnet: thesis-grounded empirics, signed surplus minting, circulation metrics, one closed pilot with real or semi-real operator data, and a public technical report suitable for RA continuation, NSTC scoping, or ecosystem grant closeout.

**Optional branches** (only if external signals appear):

- Short paper / workshop (finance + energy systems)
- EF ESP / Chainlink BUILD infrastructure grant ($25k–$48k)
- Yuan Ze RA or co-PI NSTC project (advisor-led)
- Escalation toward regulated pilot entity (year 2+, legal counsel required)

**Explicit non-goals on this path:**

- Public token marketing
- Retail fundraising
- Unaudited mainnet with real money
- Peg-on Sepolia before `foundation:peg-check` discipline
- Rewriting the thesis to “feel bigger”

---

## 3. Current baseline (repo truth)

Verify live numbers in [`CURRENT_STATUS.md`](../../CURRENT_STATUS.md) and [`docs/foundation/FOUNDATION_STATUS.md`](../foundation/FOUNDATION_STATUS.md).

| Asset | Status |
|-------|--------|
| SPK v1 Sepolia | `0x8e189…` + payments `0x52016…` |
| Supply / circulation | ~5,499 SPK; ~97% circulation share; peg **off** |
| Network payments | 21 indexed; payment #15 = wallet pilot; #3 = operator choreography |
| Contract tests | 109 Hardhat tests |
| Meter mint path | `CYCLE_MINT_MODE=meter`; Tier C P1 pass; Taoyuan fixtures |
| Hardware provenance | **L0** (fixture/sample) — closed pilot needs **L2+** |
| Exploration stitch | Tier C **6/6** (`npm run exploration:tier-c`) |
| Thesis | Bounded five-constraint manuscript — **submit, do not expand** |
| Counterparty | **None confirmed** — largest non-code gap |
| Formal audit | Not done — primary grant use case |
| Legal scoping | Not done — before any real-value pilot |

**Repo maps the path already:**

- Stages: [`docs/product/CLOSED_PILOT_EXECUTION_PACKAGE.md`](../product/CLOSED_PILOT_EXECUTION_PACKAGE.md)
- Action queue: `state/product/closed_pilot_action_queue.csv`
- Economics: `state/product/economic_launch_readiness.json`
- Hardware tiers: [`docs/product/HARDWARE_PROVENANCE_MODEL.md`](../product/HARDWARE_PROVENANCE_MODEL.md)
- Operator intake: CLOSED_PILOT § Operator Intake
- Grants (refresh before use): [`docs/grants/`](../grants/)

---

## 4. Staged ladder

```
Public lab ──► Operator shadow ──► Closed testnet pilot ──► Revenue-grade ──► Paid/mainnet
   (now)         (90-day core)         (6–12 mo)            (optional)         (not on path)
```

### Stage A — Public lab ✅ (mostly complete)

**What exists:** Inspectable Sepolia proof, demo UI, sync/evidence pipeline, thesis empirics.

**Institutional value:** Portfolio, grant reviewer packet, advisor conversation starter.

**Commands:**

```bash
npm run foundation:health
npm run foundation:sync
npm run spk:v1:evidence:export
npx hardhat test
```

### Stage B — Operator shadow pilot (90-day focus)

**Materialize:** One named site’s cumulative export data → signed adapter output → meter mint on Sepolia → one non-deployer payment → written **Pilot Report v1**.

**Hardware target:** L2 minimum ([`HARDWARE_PROVENANCE_MODEL.md`](../product/HARDWARE_PROVENANCE_MODEL.md)).

**Capital:** Operator cooperation (data), not cash. Your time + Sepolia gas.

### Stage C — Closed testnet pilot (6–12 months)

**Unlock when:** L2+ source + governed redeploy + economics/support terms documented (not necessarily funded).

**Blockers from launch gate** (see CLOSED_PILOT execution package):

1. Governed attested-SPK deployment (Safe admin)
2. Real operator meter/inverter export (`--real-operator-source`)
3. Hardware L2+
4. Anchor economics or support terms
5. Pilot terms with named counterparty

**Capital:** Grant ($25k–$48k audit/oracle) + advisor institution + optional legal memo (NT$30k–80k).

### Stage D — Revenue-grade / paid product

**Not on default path.** Requires L4 hardware, audit, legal entity, solvency capital. See §8.

---

## 5. Three capital types (do not mix)

| Type | What it pays for | Sources | SolarPunk rule |
|------|------------------|---------|----------------|
| **Infrastructure capital** | Audit, oracle hardening, L2 test deploy, demo, reports | EF ESP, Chainlink BUILD, academic grants | Ask **$25k–$48k** — see [`GRANT_BUDGET_AND_MILESTONES.md`](../grants/GRANT_BUDGET_AND_MILESTONES.md) |
| **Institutional capital** | Your time, lab affiliation, credibility | Advisor, RA slot, NSTC (PI-led), university research office | Highest ROI — lead with advisor email |
| **Solvency / support capital** | Reserves, redemption backstop, economics gap | Operator PPA/tariff, impact investor, **not** EF grants | 10 kW archetype: ~**$2,875/yr** or ~**$23k** one-time support gap; 1 MW far larger |

Grant wording (required):

> Grant funds open-source infrastructure, audit, and reporting — **not** solvency reserves or redemption capital.

---

## 6. Institutional channels (ranked)

### Tier 1 — Advisor / Yuan Ze (60% of effort)

**Ask:** Frame as **lab research**, not student crypto.

**Deliverable to advisor:** One-page memo + thesis DOCX + link to demo.

**Sample ask** (adapt from [`OUTREACH_TEMPLATES.md`](../grants/OUTREACH_TEMPLATES.md)):

> Post-submission I propose a 90-day closed Sepolia pilot: meter-attested mint, one external payee, written report. No public token marketing. Can we frame this as department lab research and would you support RA or grant scoping if we obtain one operator or counterparty?

**Outcomes:**

| Outcome | Unlocks |
|---------|---------|
| Written lab framing | Grant apps, operator outreach |
| RA continuation | Time to run pilot + paper |
| NSTC scoping (PI-led) | NT$1–3M class projects over 1–3 years |
| Co-author paper | Citations, post-MSc identity |

**Taiwan context:** Blockchain + green-power settlement research exists at Taiwan universities (e.g. NCKU carbon/power trading platforms, NSTC-funded energy work). Position as **settlement + attestation lab**, aligned with net-zero policy language — not token speculation.

**Relevant external programs** (advisor must usually be PI):

- **NSTC** (國科會) — standard university research grants
- **MOE / consortium** — e.g. green energy themed calls (varies by year; check Yuan Ze research office)
- **Academia Sinica Net-Zero R&D** — mission-oriented; competitive; multi-year

### Tier 2 — Ecosystem grants (30% of effort)

**Refresh** [`docs/grants/REVIEWER_PACKET.md`](../grants/REVIEWER_PACKET.md) with SPK v1 addresses and 109 tests before sending.

| Program | Fit | Ask | Notes |
|---------|-----|-----|-------|
| **EF ESP Office Hours** | OSS Ethereum settlement infra | Guidance → Wishlist/RFP match | ESP uses targeted Wishlist/RFP ([EF blog 2025](https://blog.ethereum.org/2025/11/03/new-esp-grants)); no generic open flood |
| **Chainlink BUILD** | Oracle / Automation migration | Ecosystem support | Not guaranteed cash |
| **EF Academic** | Thesis + reproducible empirics | $30k–$50k | Timing-dependent |
| **Gitcoin / “apply to 15 grants”** | Low unless community traction | — | Legacy [`GRANT_OPPORTUNITIES_2026.md`](../archive/legacy-grant-submissions/SHARED/GRANT_OPPORTUNITIES_2026.md) is aspirational — do not blitz |

**Continue grant outreach only if ≥2 signals** ([`GRANT_EXECUTION_PLAN.md`](../grants/GRANT_EXECUTION_PLAN.md)):

- ESP / Chainlink serious reply
- Advisor acknowledgement
- Operator conversation or LOI
- Audit program interest
- Non-deployer testnet use

### Tier 3 — Operator in-kind (10% of effort)

**Ask:** Data + permission, not investment.

**Intake checklist:** CLOSED_PILOT § Operator Intake (site identity, device identity, cumulative counters, signing custody, economics fields).

**Email template:** [`OUTREACH_TEMPLATES.md`](../grants/OUTREACH_TEMPLATES.md) § Solar Operator Discovery.

**Taiwan-realistic sources:** Taoyuan/campus rooftop, small commercial prosumer, installer with Fronius/SMA CSV export.

---

## 7. Ninety-day sprint (materialization core)

### Decision rule

**90 days. One pilot. One measurable external validation. Stop or pivot if no real data/counterparty.**

External validation = **any one** of:

1. Advisor agrees to lab framing (written)
2. Site provides usable meter/inverter export
3. One non-operator closed settlement test
4. Grant/office-hours path becomes plausible from Pilot Report v1

### Week-by-week

| Week | Materialization | Capitalization |
|------|-----------------|----------------|
| **1** | Submit thesis; `foundation:health` + sync; record 2-min demo | Advisor email; pick **one** grant channel (ESP office hours *or* Chainlink) |
| **2–3** | Send operator intake to 5–10 prospects; run shadow with fixtures if no reply | Follow up advisor; refresh reviewer packet |
| **4–6** | Ingest L2 source: `meter:inverter-adapter --real-operator-source` | Attach Tier C + tx hashes to outreach |
| **5–7** | `npm run foundation:cycle:meter`; non-deployer payment on demo | Operator LOI or data letter if possible |
| **8–10** | Governed redeploy if ready: `deploy:pilot-stack:sepolia` | Submit grant with Pilot Report draft |
| **11–12** | **Pilot Report v1** (5–10 pages); `spk:v1:evidence:export` | RA / NSTC scoping meeting if advisor yes |
| **13** | Go / no-go per §12 | — |

### Technical acceptance criteria

| # | Criterion | Command / artifact |
|---|-----------|-------------------|
| 1 | L2+ hardware provenance | `npm run product:hardware-provenance` |
| 2 | Accepted adapter records > 0 | `npm run meter:inverter-adapter -- … --real-operator-source` |
| 3 | Meter mint on Sepolia | `npm run foundation:cycle:meter` |
| 4 | Non-deployer payment | Demo UI; sync → `state/runtime/spk_v1.json` |
| 5 | Evidence export | `npm run spk:v1:evidence:export` |
| 6 | Launch gate rerun | `npm run product:launch-gate` (closed pilot may still block — document why) |

### Operator adapter (minimal)

```bash
METER_PRIVATE_KEY=0x... npm run meter:inverter-adapter -- \
  --provider=cumulative-json \
  --start=data/inverter/operator_start.json \
  --end=data/inverter/operator_end.json \
  --meter-id=OPERATOR-METER-001 \
  --site-id=operator-site-a \
  --real-operator-source

npm run product:hardware-provenance
npm run attestations:build
CYCLE_MINT_MODE=meter npm run foundation:cycle:meter
npm run foundation:sync
```

### Pilot Report v1 — required sections

1. **Bounded claim** (one paragraph)
2. **Site + provenance** (L0–L4 tier, scaling factors e.g. Taoyuan 0.02)
3. **Pipeline** — readings → bundle → mint → payment → redemption/shortfall
4. **On-chain evidence** — contract addresses, tx hashes, payment table
5. **Economics** — cite `economic_launch_readiness.json` (10 kW support gap)
6. **Launch gate status** — before/after
7. **Limits** — testnet, peg off, not legal tender, not audit-complete
8. **Next stage requirements** — audit, legal, support capital if continuing

Store as: `docs/project/PILOT_REPORT_v1.md` (create when sprint completes).

---

## 8. Economics reality (why institutions still care)

Institutional funders are **not** funding DSCR ≥ 1.2 on day one. They are funding **measurable honesty** about settlement economics.

From `state/product/economic_launch_readiness.json` (lowest-support archetype):

| Metric | 10 kW solar home |
|--------|------------------|
| Current p50 DSCR | 0.325 |
| Required realized value | ~$0.33/kWh |
| Current realized | ~$0.09/kWh |
| Annual support gap | ~$2,875 |
| Capital support gap | ~$23,046 |

**Research question this enables:** *Under stated Taiwan tariff/LCOE assumptions, what support or anchor terms would be required for energy-linked settlement to be financeable?*

That is a **finance thesis contribution**, not a failure — especially with explicit launch gates.

Protocol OPEX gap (same artifact): fee revenue ~$22/yr vs $120k OPEX assumption → **paid product blocked** until fee base or subsidy model exists. Document this; do not hide it.

---

## 9. Six-month plan

| Month | Materialization | Capitalization | Deliverable |
|-------|-----------------|----------------|-------------|
| **0** | Thesis submitted | Advisor conversation | — |
| **1–3** | 90-day sprint (§7) | ESP office hours / Chainlink BUILD | Pilot Report v1 |
| **3–4** | Paper outline from thesis + pilot appendix | Grant submission with report | Workshop target |
| **4–6** | Governed multisig if ops stable: `foundation:multisig` | Grant decision or RA offer | Audit scope tag if funded |
| **6** | Tier C hardening: real inverter export in P1 | NSTC scoping if advisor PI | Technical report draft |

**Exploration track** (parallel, off-thesis): `npm run exploration:tier-c` — CEIR → meter stitch; keep thesis frozen.

---

## 10. Twelve-month plan

| Quarter | Focus |
|---------|-------|
| **Q1** | Pilot Report v1 + advisor institution |
| **Q2** | Grant execution (audit RFP) OR RA lab operations |
| **Q3** | Audit remediation; closed pilot gate retry |
| **Q4** | Grant closeout report; paper submission; **continue vs archive** decision |

**Continue aggressively if ≥2:**

- Funded infrastructure grant or RA salary
- Operator LOI + L2 data in production adapter
- Advisor commits to NSTC proposal or co-authored publication

**Archive gracefully if zero external signals after 6–8 weeks of serious outreach** ([`STRATEGIC_ASSESSMENT_2026-05-14.md`](./STRATEGIC_ASSESSMENT_2026-05-14.md)): keep GitHub + thesis citation; stop treating as core life project.

---

## 11. Legal and entity (boring on purpose)

| Phase | Structure |
|-------|-----------|
| Now – Pilot Report v1 | Individual + open-source repo + university affiliation |
| Grant receipt | Personal wallet or university fiscal host — ask Yuan Ze research office |
| Closed pilot with counterparty | MOU / pilot terms — [`docs/specs/PILOT_PLAN.md`](../specs/PILOT_PLAN.md) |
| Company / foundation | Only after legal memo — likely year 2+ |

**Narrow legal frame** (pick one with counsel before real-value):

- Research settlement unit (testnet, closed participants)
- Prepaid energy credit experiment (bounded redemption)
- **Avoid:** public token offering language

Budget **NT$30,000–80,000** for bounded Taiwan legal memo before any real-value pilot.

---

## 12. Kill criteria and pivots

### Hard stop (treat as portfolio only)

After **90 days** + **6–8 weeks outreach**, none of:

- Advisor written lab framing
- Operator data or signed export
- Non-deployer settlement
- Grant/office-hours traction

### Pivot options (not failure)

| Pivot | Action |
|-------|--------|
| **Academic** | Paper only; no more chain ops |
| **Employment** | GitHub as work sample |
| **PhD** | NSTC proposal with advisor as PI |
| **Defer** | Freeze repo; resume when institution appears |

### Never pivot into (without new evidence)

- Mainnet token
- Public “energy money” marketing
- Thesis rewrite loop
- Solo infinite feature building

---

## 13. Pitch variants (same repo, different buyer)

### Advisor (30 seconds)

> I built an open-source testnet lab that mints tokens from signed surplus kWh and records circulation on-chain. The thesis bounds the claims. I want 90 days to run one closed pilot with real export data and one external payee, then write a report. No currency launch — lab research only.

### Grant reviewer (30 seconds)

> SolarPunk is OSS Ethereum infrastructure for signed renewable surplus attestation and settlement primitives. Live Sepolia proof, 109 tests, reproducible empirics. Funding request: audit + oracle hardening + public technical report — not solvency reserves.

### Operator (30 seconds)

> I'm researching how surplus export data could flow through a signed, replay-protected pipeline to a testnet settlement demo. No cost to you — I need one interval of cumulative meter/inverter counters and permission to cite anonymized results in a university report.

---

## 14. Artifact index (use these, don’t recreate)

| Purpose | Path |
|---------|------|
| Live status | [`CURRENT_STATUS.md`](../../CURRENT_STATUS.md) |
| Foundation metrics | [`docs/foundation/FOUNDATION_STATUS.md`](../foundation/FOUNDATION_STATUS.md) |
| Closed pilot playbook | [`docs/product/CLOSED_PILOT_EXECUTION_PACKAGE.md`](../product/CLOSED_PILOT_EXECUTION_PACKAGE.md) |
| Minimal wallet demo | [`docs/foundation/PILOT_PLAYBOOK.md`](../foundation/PILOT_PLAYBOOK.md) |
| Foundation ops | [`docs/foundation/ROADMAP.md`](../foundation/ROADMAP.md) |
| Grant packet | [`docs/grants/REVIEWER_PACKET.md`](../grants/REVIEWER_PACKET.md) |
| Budget / milestones | [`docs/grants/GRANT_BUDGET_AND_MILESTONES.md`](../grants/GRANT_BUDGET_AND_MILESTONES.md) |
| Outreach emails | [`docs/grants/OUTREACH_TEMPLATES.md`](../grants/OUTREACH_TEMPLATES.md) |
| Strategic assessment | [`STRATEGIC_ASSESSMENT_2026-05-14.md`](./STRATEGIC_ASSESSMENT_2026-05-14.md) |
| Tier C exploration | [`docs/exploration/TIER_C_STATUS.md`](../exploration/TIER_C_STATUS.md) |
| Thesis alignment | [`thesis_package/THESIS_PRODUCT_ALIGNMENT.md`](../../thesis_package/THESIS_PRODUCT_ALIGNMENT.md) |
| Action queue CSV | `state/product/closed_pilot_action_queue.csv` |
| Economics JSON | `state/product/economic_launch_readiness.json` |

---

## 15. Command cheat sheet

```bash
# Health + sync
npm run foundation:health
npm run foundation:sync
npm run foundation:build

# Meter mint cycle
npm run foundation:cycle:meter

# Exploration / thesis evidence
npm run exploration:tier-c
npm run spk:v1:evidence:export
npm run thesis:docx          # thesis only — not pilot

# Product gates
npm run product:hardware-provenance
npm run product:economic-launch
npm run product:launch-gate
npm run product:closed-pilot-package

# Governed deploy (closed pilot stage)
npm run deploy:pilot-stack:sepolia
npm run pilot-stack:readback

# Tests
npx hardhat test
```

---

## 16. Relationship to “becomes money”

The institutional path **does not close** the currency branch forever. It **sequences** it:

```
Institutional path (default)
  thesis → pilot report → RA/grant → audit → closed pilot gate
                                              │
                                              ▼
                              IF institution + legal + economics align
                                              │
                                              ▼
                              Optional: regulated pilot / commercial entity
```

Currency-scale outcomes require items **not** on the 90-day sprint: audit, legal classification, named redemption entity, support capital, utility-grade provenance (L4). The repo’s launch gates and `economic_launch_readiness.json` already encode this.

---

## 17. Immediate next actions (checklist)

- [ ] Submit thesis DOCX
- [ ] Send advisor email (§6 Tier 1)
- [ ] Record demo from [`DEMO_WALKTHROUGH_SCRIPT.md`](../grants/DEMO_WALKTHROUGH_SCRIPT.md)
- [ ] Refresh grant packet numbers (109 tests, SPK v1 addresses)
- [ ] Send operator intake to ≥5 prospects
- [ ] Calendar 90-day review date
- [ ] On review: write `PILOT_REPORT_v1.md` or execute kill criteria (§12)

---

*This document supersedes ad-hoc strategic chat for post-thesis operations. Update when Pilot Report v1 exists or when launch gate status materially changes.*
