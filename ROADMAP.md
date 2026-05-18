# ROADMAP

## Guiding rule

Optimize for external proof quality before narrative. Each milestone must produce something a third party can independently verify.

## Milestone ladder

### Milestone 1: Repo credibility — COMPLETE

- aligned README and status docs to current truth
- removed stale and contradictory claims
- clear architecture and scope docs in place
- 102/102 contract tests passing

### Milestone 2: External inspectability — COMPLETE (2026-04-20)

- deployed full stack to Ethereum Sepolia testnet
- all three contracts source-verified on Etherscan
- 7-transaction interaction proof published with verifiable tx hashes
- `CONTRACT_ADDRESSES.md` and `DEMO_WALKTHROUGH.md` updated with live links

### Milestone 3: Security credibility — IN PROGRESS

- **(COMPLETE) Quantitative Stress Testing (April 2026)** — Identified "Gap Risk" and increased default margins to 250% IM / 125% MM. Established a solvency envelope for pilot-scale operations.
- **(COMPLETE) 24h Governance Timelock & Multisig Handoff** — All core contracts managed by Safe `0xB95586...`.
- **Milestone 3.5: Risk-Boxed Scaling** — Implement on-chain `maxOpenInterest` caps to align with current $50k Treasury insurance capacity (approx. 25-30 MWh limit).
- external security audit (target: Code4rena contest, Sherlock, or private firm)
- resolve any audit findings before pilot engagement

### Milestone 4: Pilot Credibility

- **Pilot CSV proof path:** Convert operator-style meter/inverter CSV exports into signed readings, accepted bundle, deterministic source hash, and SPK mint preview.
- **Monetary stress harness:** Size redemption shortfall exposure, fee buffers, and additional named reserve requirements before promising any real-value redemption.
- **Governed pilot-stack scaffold:** Deploy/readback scripts now cover MockUSDC, ProtocolTreasury, SolarPunkCoin, and SolarPunkCurrencySystem together.
- **Pilot Onboarding:** Secure a $125k pilot grant to establish a $125k total insurance reserve, unlocking a 60 MWh risk-boxed pilot capacity.
- **Counterparty Engagement:** Approach 3-5 renewable energy operators for a single-cycle settlement proof under strict open-interest caps.
- **Operational Hardening:** Automate oracle updates to sub-hour frequency to reduce residual gap risk.

### Milestone 5: Mainnet launch

- gated on: completed audit, governance hardening, pilot LOI
- deploy with real governance admin (multisig), non-zero timelock delays, bond requirements enforced

## Current position

Milestone 1: **complete**
Milestone 2: **complete**
Milestone 3: in progress — audit firm shortlisting and production governance hardening
Milestone 4: in progress — pilot CSV receipt, stress harness, and pilot-stack scaffold complete; real operator export still pending
Milestone 5: pending
