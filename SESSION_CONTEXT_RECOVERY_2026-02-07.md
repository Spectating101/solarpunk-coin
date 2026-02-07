# Session Context Recovery (2026-02-07)

This repository is a multi-track portfolio, not a single deployment repo.

## Track 1: Solarpunk Bitcoin / On-chain Deployment
- Core overview: `README.md`
- Contracts: `contracts/SolarPunkCoin.sol`, `contracts/SolarPunkOption.sol`
- Tests: `test/SolarPunkCoin.test.js`, `test/SolarPunkOption.test.js`
- Deployment scripts: `scripts/deploy_amoy.sh`, `scripts/deploy_sepolia.sh`, `scripts/deploy.js`
- Oracle/service code: `oracle_service.py`, `scripts/pillar3_engine.py`
- Frontend app: `frontend/`
- Operational docs: `DEPLOYMENT_GUIDE.md`, `ORACLE_DEPLOYMENT.md`, `TESTNET_DEPLOYMENT.md`

## Track 2: Grants, Packaging, and Outreach
- Main grant proposal: `GRANT_PROPOSAL.md`
- Funding index: `FUNDING_PACKAGE_INDEX.md`
- Submission materials: `GRANT_SUBMISSIONS/`
- Related summaries: `GRANT_EXECUTIVE_SUMMARY.md`, `QUICK_START_FUNDING.md`

## Track 3: Thesis / Research Infrastructure
- Docs index for thesis and portfolio docs: `docs/INDEX.md`
- Thesis package assembly: `thesis_package/README_ASSEMBLY_GUIDE.md`
- Draft thesis artifact: `thesis-draft.md`
- Empirical research tree: `empirical/`
- Supporting research PDFs/notes: `RESEARCH/`

## Track 4: IE-JDE Academic Submission Pipeline
- Main entrypoint: `IE-JDE/README.md`
- Submission navigation: `IE-JDE/START_HERE_TWO_PAPERS.md`
- Paper B (Invisible Economy): `IE-JDE/Invisible_Economy/`
- Paper A (Digital Tax Design): `IE-JDE/Digital_Tax_Design/`
- Supporting dataset: `IE-JDE/THESIS_DATA_READY.csv`
- Econometric summary: `IE-JDE/ECONOMETRIC_BRIEF.md`

## High-Signal Note
`IE-JDE` is organized as a two-paper publication workflow and includes submission-ready academic materials; this repo therefore spans:
1. production-oriented blockchain deployment,
2. grant/funding operations,
3. empirical academic research,
4. journal/policy submission assets.

## Suggested Working Rule for Future Sessions
Treat this repo as a portfolio monorepo with at least two primary priorities running in parallel:
1. `deployment/grants` lane (smart contracts + funding execution), and
2. `academic/publication` lane (IE-JDE + thesis/papers).

Use lane-specific entrypoints first (`README.md` for deployment, `IE-JDE/START_HERE_TWO_PAPERS.md` for publications) before editing.
