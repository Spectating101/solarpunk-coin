# Outreach Templates

## Ethereum ESP / Office Hours Email

**Subject:** Office hours request: SolarPunk Protocol, open-source renewable-energy risk infrastructure on Sepolia

Hello ESP team,

I am Christopher Ongko, a finance master's student at Yuan Ze University and the developer of SolarPunk Protocol.

SolarPunk is an open-source Ethereum testnet prototype for renewable-energy hedging. It combines:

- 96/96 passing smart contract tests,
- source-verified Sepolia contracts, including the attested SPK proof stack,
- a public signed-meter -> attested SPK mint proof and read-only Sepolia readback,
- a daily NASA POWER -> Sepolia oracle keeper,
- a React proof dashboard with live contract reads,
- audit-readiness, threat model, trust assumptions, and public evidence register.

I am preparing an ESP/Wishlist-style application focused on audit readiness, oracle hardening, and a risk-boxed L2 pilot. I would appreciate office-hours guidance on whether this is a fit for ESP, an RFP/Wishlist category, or a more academic route.

Reviewer packet: `docs/grants/REVIEWER_PACKET.md`  
Evidence register: `EVIDENCE.md`  
GitHub: https://github.com/Spectating101/solarpunk-coin

The project does not claim mainnet readiness or formal audit completion. The grant ask is for open-source infrastructure work: external audit/review, Chainlink Automation/Functions migration, L2 pilot reporting, and public technical outputs.

Best,  
Christopher Ongko  
s1133958@mail.yzu.edu.tw

## Chainlink BUILD Intro

**Subject:** Chainlink BUILD application: renewable-energy data and derivatives infrastructure

Hello Chainlink BUILD team,

I am applying with SolarPunk Protocol, an open-source Sepolia prototype for renewable-energy hedging and energy-data settlement.

The project depends on reliable oracle infrastructure:

- NASA POWER irradiance is currently fetched daily and posted to Sepolia.
- A ChainlinkOracleAdapter is already deployed on Sepolia for AggregatorV3Interface-compatible feeds and manual fallback.
- The next milestone is migrating from GitHub Actions keeper infrastructure toward Chainlink Automation and Functions.
- Longer-term, SolarPunk could help define an energy-data oracle vertical: solar irradiance, wholesale electricity prices, REC prices, and capacity factors.

Current proof:

- 96/96 smart contract tests passing.
- Source-verified Sepolia contracts, including the attested SPK proof stack.
- Public signed-meter -> attested SPK mint proof and read-only Sepolia readback.
- Daily keeper artifacts and transaction hashes.
- Live frontend proof dashboard.
- Audit-readiness and threat model docs.

GitHub: https://github.com/Spectating101/solarpunk-coin  
Reviewer packet: `docs/grants/REVIEWER_PACKET.md`

Best,  
Christopher Ongko

## Advisor / Thesis Supervisor Acknowledgement Request

**Subject:** Request for brief acknowledgement letter for SolarPunk grant applications

Professor [Name],

I am preparing external grant applications for SolarPunk Protocol, the implementation layer connected to my thesis work on renewable-energy-backed settlement and derivatives.

The project now has:

- 96/96 smart contract tests passing,
- source-verified Sepolia deployment,
- public signed-meter -> attested SPK mint proof and read-only Sepolia readback,
- daily NASA POWER -> on-chain oracle experiment,
- public evidence register,
- frontend proof dashboard,
- audit-readiness and threat model documentation.

Would you be willing to provide a short acknowledgement that this work is connected to my master's research and that the general research direction is academically legitimate? It does not need to endorse investment value, production readiness, or security.

A two-sentence note would be enough:

> I confirm that Christopher Ongko's SolarPunk Protocol work is related to his master's research on renewable-energy finance and derivatives. The project represents a serious implementation effort connecting empirical energy data, pricing models, and programmable settlement infrastructure.

Thank you,  
Christopher

## Solar Operator Discovery Email

**Subject:** Quick question on solar revenue volatility and hedging needs

Hello [Name],

I am Christopher Ongko, a finance master's student researching renewable-energy revenue risk.

I am building SolarPunk Protocol, an open-source prototype that explores how public solar irradiance data and on-chain settlement could support simple revenue hedges for small-to-medium renewable operators.

I am not asking you to use a product. I am looking for 20 minutes of feedback on whether this problem framing is real from an operator perspective:

- Does weather/production volatility affect financing or planning?
- Are current hedging products accessible to smaller solar operators?
- What would a credible revenue-risk dashboard need to show?

If useful, I can share a short demo and evidence packet. Any feedback would help me avoid building in the wrong direction.

Best,  
Christopher Ongko
