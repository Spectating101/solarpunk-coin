# Tomorrow Submission Brief

**Target send date:** 2026-05-15

## Best Order

1. **Chainlink BUILD / Build on Ethereum** - submit first.
2. **Ethereum ESP Project Feedback / Office Hours** - send as fit-check, then submit full financial request if invited or clearly appropriate.
3. **Advisor acknowledgement email** - send the same day to create an external academic signal.

## Why This Order

Chainlink BUILD is the cleanest immediate fit because SolarPunk is fundamentally an oracle-dependent project. The strongest story is now the signed-meter -> attested SPK mint proof plus the live NASA POWER -> Sepolia keeper, with a clear need to migrate from GitHub Actions to Chainlink Automation / Functions. If the Chainlink Build on Ethereum application path is open, use that lane because SolarPunk is already deployed on Ethereum Sepolia and the program is explicitly Ethereum-aligned.

ESP is still worth approaching, but it should not be framed as a generic startup grant or as a consumer financial product. The safer framing is public-good Ethereum research infrastructure: source-verified contracts, public testnet proof, oracle-risk documentation, audit readiness, L2 analysis, and technical reporting. Do not route this through a closed or financial-product-excluding academic round unless ESP specifically tells you to.

## Submission Links

- Chainlink BUILD portal: `https://chainlinkcommunity.typeform.com/BUILD`
- Chainlink Build on Ethereum: `https://chain.link/economics/build-program/build-ethereum`
- Chainlink BUILD terms: `https://chainlinklabs.com/build-terms`
- Ethereum ESP applicant path: `https://esp.ethereum.foundation/applicants/`
- Public demo: `https://spectating101.github.io/solarpunk-coin/`
- GitHub repo: `https://github.com/Spectating101/solarpunk-coin`

## Primary Files To Use

- Final command center: `docs/grants/FINAL_SUBMISSION_COMMAND_CENTER_2026-05-14.md`
- Chainlink application: `GRANT_SUBMISSIONS/CHAINLINK/BUILD_APPLICATION.md`
- ESP feedback/funding draft: `GRANT_SUBMISSIONS/ETHEREUM_ESP_APPLICATION.txt`
- Copy-paste answers: `docs/grants/GRANT_COPY_PASTE_ANSWERS.md`
- Budget and milestones: `docs/grants/GRANT_BUDGET_AND_MILESTONES.md`
- Reviewer packet: `docs/grants/REVIEWER_PACKET.md`
- Product proof: `docs/product/SPK_ATTESTED_MINT_PROOF.md`
- Public readback: `docs/product/SPK_PUBLIC_READBACK.md`
- Daily experiment status: `docs/project/DAILY_EXPERIMENT_STATUS.md`

## Claims To Lead With

- 102/102 smart contract tests passing.
- Five source-verified legacy Sepolia contracts plus three source-verified attested SPK proof contracts.
- Public signed-meter -> attested SPK mint proof: 2,606.7 kWh accepted surplus, 130.1697 SPK minted.
- Read-only Sepolia readback confirms tx success, consumed attestation hash, consumed source hash, recipient balance, and cumulative surplus.
- Pilot meter onboarding + CSV import bridge exists; sample CSV bundle accepts 1,985.5 kWh.
- Daily NASA POWER -> Sepolia keeper running since 2026-04-20.
- Keeper artifacts committed under `state/keeper_logs/` with public Sepolia transaction hashes.
- Public demo reads live Sepolia state.
- ChainlinkOracleAdapter already deployed on Sepolia.
- Audit-readiness, threat model, trust assumptions, and invariant checklist are prepared.

## Claims To Avoid

- Do not claim mainnet readiness.
- Do not claim production oracle finality.
- Do not claim a completed formal audit.
- Do not claim signed solar-operator pilots or LOIs.
- Do not promise SPK token allocation; SPK is part of the peg-control prototype.
- Do not say the live Sepolia deployment uses 250% / 125% margin. It uses 150% / 75%; 250% / 125% is the next risk-boxed target.

## Chainlink BUILD Core Pitch

SolarPunk is an oracle-first renewable-energy settlement prototype. It already has a public signed-meter -> attested SPK mint proof, runs a daily NASA POWER -> Sepolia keeper, and has a Chainlink-compatible adapter. BUILD support would help migrate the current centralized keeper toward Chainlink Automation and Functions, define stale-data handling, harden oracle monitoring, and publish an energy-data feed specification useful beyond SolarPunk.

## ESP Core Pitch

SolarPunk is open-source Ethereum public-good research infrastructure for energy-linked settlement. It makes signed energy data, real-world oracle data, and on-chain settlement externally inspectable through source-verified contracts, public transactions, committed artifacts, and a live proof dashboard. ESP support would fund external review, oracle hardening, L2 deployment analysis, and public technical reporting, not private liquidity or solvency reserves.

## Recommended Ask

- Primary ask: `$48,000`
- Minimum useful ask: `$25,000`
- Do not ask ecosystem grants for solvency reserves or option-writer capital.
