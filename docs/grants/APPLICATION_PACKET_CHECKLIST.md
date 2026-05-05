# Grant Application Packet Checklist

Use this checklist before submitting ESP, Chainlink BUILD, academic grants, or ecosystem support applications.

## Must include

- GitHub repo: `https://github.com/Spectating101/solarpunk-coin`
- Reviewer packet: `docs/grants/REVIEWER_PACKET.md`
- Execution plan: `docs/grants/GRANT_EXECUTION_PLAN.md`
- Budget and milestones: `docs/grants/GRANT_BUDGET_AND_MILESTONES.md`
- Copy-paste answers: `docs/grants/GRANT_COPY_PASTE_ANSWERS.md`
- Outreach templates: `docs/grants/OUTREACH_TEMPLATES.md`
- Evidence register: `EVIDENCE.md`
- Current status: `CURRENT_STATUS.md`
- Audit readiness: `AUDIT_READINESS.md`
- Threat model: `THREAT_MODEL.md`
- Trust assumptions: `TRUST_ASSUMPTIONS.md`
- Daily experiment status: `docs/project/DAILY_EXPERIMENT_STATUS.md`
- Contract addresses: `CONTRACT_ADDRESSES.md`
- Demo walkthrough script: `docs/grants/DEMO_WALKTHROUGH_SCRIPT.md`

## Claims allowed

- 79/79 smart contract tests passing.
- Live source-verified Sepolia deployment.
- Daily NASA POWER -> Sepolia keeper running with committed artifacts.
- ChainlinkOracleAdapter deployed on Sepolia with AggregatorV3Interface compatibility and manual fallback.
- Safe admin handoff complete for the three core contracts.
- 24h governance timelock active on the three core contracts.
- Independent Codex review found and fixed 5 issues.
- Formal audit is not yet completed and is a primary funding use.

## Claims to avoid

- Do not claim mainnet readiness.
- Do not claim production oracle finality.
- Do not claim a formal security audit.
- Do not claim solar operator pilots or LOIs until signed.
- Do not claim the current Sepolia deployment enforces 250% / 125% margin.
- Do not claim the Safe is fully decentralized; it is currently 1-of-1.

## Margin wording

Use this wording:

> The live Sepolia deployment currently enforces 150% initial / 75% maintenance margin. A 90-day jump-diffusion stress memo identifies 250% / 125% as the next risk-boxed pilot target before larger exposure.

## Recommended submission order

1. Ethereum ESP general inquiry/application.
2. Chainlink BUILD.
3. EF Academic inquiry or office hours if a suitable round is open.
4. Audit support program only after choosing a specific L2 deployment lane.

## Recommended ask

- Primary ask: `$48,000`
- Minimum useful ask: `$25,000`
- Expanded ask: `$75,000-$100,000` only if the program explicitly funds broader pilots

See `docs/grants/GRANT_BUDGET_AND_MILESTONES.md` for full budget and milestone mapping.

## Highest-leverage next external proof

- A short hosted demo URL.
- A two-minute walkthrough video using `DEMO_WALKTHROUGH_SCRIPT.md`.
- One advisor or thesis-supervisor acknowledgement.
- One solar operator LOI or discovery-call note.
