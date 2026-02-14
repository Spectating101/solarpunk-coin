# SolarPunk Protocol - Agent Handoff Document
**Date:** February 13, 2026
**Repo:** /home/phyrexian/Downloads/llm_automation/project_portfolio/Solarpunk-bitcoin

---

## What This Project Is

SolarPunk Protocol is a DeFi derivatives protocol for hedging renewable energy price volatility. Solar farms lose money from price swings (189% annual vol) and have no hedging tools. SolarPunk provides:

1. **Smart Contracts** (Solidity 0.8.20, OpenZeppelin v5): SolarPunkCoin (PI-controlled stablecoin) + SolarPunkOption (clearinghouse with VaR margining)
2. **Pricing Engine** (Python): Binomial trees, Monte Carlo, mean-reversion, jump-diffusion - calibrated on NASA POWER satellite data
3. **API** (FastAPI): SaaS-ready with auth, rate limiting, 3 pricing tiers
4. **Frontend** (React/Vite): Basic dashboard with wallet integration

**Developer:** Christopher Ongko, master's student at Yuan Ze University, Taiwan

---

## Current State (All Tests Passing)

- **46/46 Solidity tests** (`npx hardhat test`)
- **8/8 Python tests** (`PYTHONPATH=energy_derivatives pytest energy_derivatives/tests/`)
- **NOT deployed to testnet** - wallet `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54` needs free testnet ETH from browser faucet
- **Deploy script ready:** `npx hardhat run scripts/deploy_testnet_full.js --network sepolia`

---

## What Was Done In Previous Sessions

### Code Fixes (All Verified)
- Fixed Python API imports (NASADataLoader → load_solar_parameters, added /price and /greeks endpoints)
- Fixed pyproject.toml version mismatch (0.2.0 → 0.5.0)
- Fixed frontend fake transactions → real contract calls with ERC20 approval flow
- Fixed PI controller (inverted control direction, added closed-loop feedback, tuned gains: 6.5% → 78.6% in-band)
- Cleaned up .gitignore, added Prometheus/Grafana configs
- Updated stale claims in README and grant docs

### SaaS API Built
- `energy_derivatives/api/main.py` - Production API with:
  - `/v1/price`, `/v1/greeks`, `/v1/batch`, `/v1/risk-assessment`
  - API key auth (Free/Starter $99/Pro $499 tiers)
  - Rate limiting, CORS, landing page at root
  - Risk assessment: give lat/lon + capacity → get full hedge pricing
- `Dockerfile`, `railway.json`, `render.yaml` - deploy configs ready

### Grant Applications Drafted
- `GRANT_SUBMISSIONS/CHAINLINK/BUILD_APPLICATION.md` - Complete, form-ready
  - Portal: https://chainlinkcommunity.typeform.com/BUILD
  - Rolling deadline, ~3 month review
  - NOT a cash grant - services for 3% token supply ($100-500K value)
  - Strong fit: 5 Chainlink product integrations
- `GRANT_SUBMISSIONS/EF_ACADEMIC/EF_ACADEMIC_GRANTS_APPLICATION.md` - Complete
  - PhD Fellowship: NOT eligible (requires PhD enrollment)
  - Academic Grants: ELIGIBLE (master's OK)
  - Copy-paste email to academic-grants@ethereum.org included
  - $30-50K cash for published research
- `GRANT_SUBMISSIONS/SUBMISSION_CHECKLIST.md` - Updated with verified reality
  - DEAD: Polygon (closed), ClimateDAO (defunct), Energy Web (404), Gitcoin (no climate round)
  - ACTIVE: Chainlink BUILD, EF Academic, Celo Proof-of-Ship

### Marketing/Commercial
- `docs/marketing/TWITTER_LAUNCH_THREAD.md` - 10-tweet thread ready to post
- `docs/commercial/COLD_OUTREACH_EMAILS.md` - 3 email templates for solar operators

### Economic Simulation
- `scripts/simulate_economy.py` - Multi-agent sim (35 agents, 6 stress scenarios)
  - Baseline: 93.2% peg stability, 2.32% daily vol
  - All stress tests passed, SPK 0.7x less volatile than BTC
  - Output: `economy_simulation.png`, `economy_simulation_results.json`

---

## Key Files

| File | What |
|------|------|
| `contracts/SolarPunkCoin.sol` | Stablecoin with PI control (576 lines) |
| `contracts/SolarPunkOption.sol` | Clearinghouse with VaR margining (327 lines) |
| `energy_derivatives/api/main.py` | SaaS API (production-ready) |
| `energy_derivatives/spk_derivatives/` | Python pricing library (v0.5.0) |
| `scripts/deploy_testnet_full.js` | Unified testnet deploy script |
| `scripts/simulate_peg.py` | Basic peg simulation |
| `scripts/simulate_economy.py` | Multi-agent economic simulation |
| `hardhat.config.js` | Networks: hardhat, sepolia, holesky, amoy, localhost |
| `.env` | Private key + RPC endpoints (DO NOT COMMIT) |
| `frontend/` | React/Vite dashboard |
| `GRANT_SUBMISSIONS/` | All grant application docs |

---

## What Still Needs Doing

1. **Testnet deployment** - Fund wallet via browser faucet, run deploy script
2. **Submit Chainlink BUILD** - Copy-paste from application doc into Typeform
3. **Email EF** - Send inquiry email from application doc
4. **Deploy API to hosting** - Push to Railway/Render (free tier)
5. **Post Twitter thread** - Copy from marketing doc
6. **Send cold emails** - Find solar operators, use templates
7. **Security audit** - Not started, needed before mainnet

---

## User Context

- Christopher is a solo developer, master's student in Taiwan
- Realistic about project stage - knows it's pre-traction
- Asked for honest assessment of funding chances
- Interested in all paths: SaaS revenue, grants, and the longer-term monetary system vision
- Previous session explored grants landscape and found most original targets (Polygon, ClimateDAO, etc.) are dead
- Main question was whether the "new currency" angle is fundable (answer: not directly, but the derivatives tool angle is)
