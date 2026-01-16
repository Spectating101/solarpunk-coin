# POLYGON COMMUNITY GRANTS APPLICATION DRAFT (QUESTBOOK)

## PROJECT
- Name: SolarPunk Protocol (Energy-Backed Derivatives + Stablecoin)
- Category: DeFi Solutions / Research Funding / Infrastructure & Tools
- Chain: Polygon
- Repo: [REPO_LINK]
- Demo: [DEMO_LINK]

## ONE-LINE SUMMARY
Decentralized revenue-floor hedging for renewable energy producers using energy-backed options and a stability-controlled token on Polygon.

## PROBLEM
Renewable energy is non-storable and volatile. Small and mid-size producers cannot access institutional hedge products, leaving them exposed to price shocks and curtailment losses.

## SOLUTION
SolarPunk Protocol provides on-chain energy-backed put options and a stability-controlled token anchored to energy data. The system uses oracle-driven pricing and on-chain settlement to deliver a programmable revenue floor for renewable producers.

## WHAT EXISTS TODAY
- Smart contracts implemented and tested (46 total tests passing)
- Pricing and risk tooling in Python (validated with simulation)
- 1000-day simulation baseline (6.5% in-band; PI tuning needed)
- Deployment scripts ready; testnet deployment pending RPC/keys

## WHY POLYGON
Polygon enables low-fee micro-hedges and supports RWA-aligned DeFi. The project is EVM-native and built for Polygon from day one.

## DELIVERABLES (6 MONTHS)
1) Security audit + remediation + verified testnet deployment
2) Oracle data service + stability tuning report
3) Pilot hedge + UI/SDK for non-dev users

## MILESTONES
- Month 1-2: Audit, fixes, testnet deployment, health checks green
- Month 3-4: Oracle service live, tuning report published
- Month 5-6: Pilot executed, UI/SDK live, public demo

## BUDGET (BASELINE $50,000)
- Security audit: $15,000
- Oracle service + monitoring: $8,000
- Pilot setup + liquidity incentives: $12,000
- UI/SDK development: $10,000
- Ops/infra buffer: $5,000

## STRETCH ($75,000 TOTAL)
- Extended liquidity incentives: $10,000
- Community + documentation: $8,000
- Academic publication + conferences: $7,000

## METRICS
- Testnet deployment + health check output
- Pilot hedge executed on-chain
- Stability tuning: improvement over baseline simulation
- Developer adoption: 100+ GitHub stars and early user community

## TEAM
- Lead: Christopher Ongko (energy economics + blockchain engineering)
- Advisors (in-kind): finance professor, control systems engineer, energy economics researcher

## RISKS + MITIGATION
- Oracle manipulation: multi-source aggregation + staleness gating
- Security risk: external audit + remediation
- Adoption risk: pilot partner + UI/SDK focus

## LINKS
- Repo: [REPO_LINK]
- Demo: [DEMO_LINK]
- Test report: docs/grants/TEST_VERIFICATION_REPORT.md
