# Final Submission Command Center - 2026-05-14

Purpose: one operational page for submitting SolarPunk without reopening design, contract deployment, or grant-strategy debates.

## Current Position

SolarPunk is ready to submit as an open-source testnet proof and external-review candidate. It is not ready to claim mainnet production, audited security, certified meter finality, or signed operator traction.

Lead with the strongest current claim:

> SolarPunk is an Ethereum Sepolia prototype for energy-minted SPK: signed renewable-energy meter data is verified into a source hash, oracle-signed, replay-protected on-chain, and publicly readable through source-verified contracts and committed proof artifacts.

## Official Submission Links

Use these exact links:

| Target | Link | Use |
|---|---|---|
| Chainlink BUILD portal | `https://chainlinkcommunity.typeform.com/BUILD` | First submission |
| Chainlink Build on Ethereum | `https://chain.link/economics/build-program/build-ethereum` | Fit rationale |
| Chainlink BUILD terms | `https://chainlinklabs.com/build-terms` | Check before final submit |
| Ethereum ESP applicants | `https://esp.ethereum.foundation/applicants/` | ESP office-hours / feedback / application path |
| Public demo | `https://spectating101.github.io/solarpunk-coin/` | Reviewer-facing visual proof |
| GitHub repo | `https://github.com/Spectating101/solarpunk-coin` | Canonical source |

## Submit In This Order

1. Open the public demo and confirm it loads.
2. Open `docs/product/SPK_PUBLIC_READBACK.md` and confirm the public readback still reports 7/7 checks.
3. Open `docs/project/DAILY_EXPERIMENT_STATUS.md` and copy the latest keeper date/tx if a form asks for recent traction.
4. Submit Chainlink BUILD using `GRANT_SUBMISSIONS/CHAINLINK/BUILD_APPLICATION.md`.
5. Send the ESP fit-check / feedback draft from `GRANT_SUBMISSIONS/ETHEREUM_ESP_APPLICATION.txt`.
6. Send advisor acknowledgement request from `docs/grants/OUTREACH_TEMPLATES.md`.
7. Send one solar-operator discovery email from `docs/grants/OUTREACH_TEMPLATES.md`.

## Evidence To Lead With

| Proof | Current value | File |
|---|---:|---|
| Smart contract tests | 96 passing | `npm test` |
| Attestation tests | 14 passing | `npm run attestations:test` |
| Frontend tests | 5 passing | `cd frontend && npm test -- --run` |
| Public SPK mint | 130.1697 SPK from 2,606 kWh on-chain surplus | `docs/product/SPK_ATTESTED_MINT_PROOF.md` |
| Public Sepolia readback | 7/7 checks passing | `docs/product/SPK_PUBLIC_READBACK.md` |
| Latest daily keeper run | 2026-05-14 | `docs/project/DAILY_EXPERIMENT_STATUS.md` |
| Successful keeper runs | 18 total, 16-day current streak | `state/keeper_logs/summary.json` |
| Latest keeper tx | `0x20162f08923cddf07e3455ce3eeecfd69ca4bcd7baeead84e6e2b1e4fe6cf856` | Sepolia Etherscan |
| Product empirics | Generated current dossier | `docs/product/SPK_PRODUCT_EMPIRICS.md` |
| Audit package | Prepared, unaudited | `AUDIT_READINESS.md` |

## Chainlink BUILD Framing

Use this framing:

> SolarPunk is fundamentally oracle-dependent. Today it has a Chainlink-compatible adapter, a daily NASA POWER to Sepolia keeper, and a signed-meter to attested-SPK mint proof. BUILD support would help migrate the keeper toward Chainlink Automation / Functions, harden stale-data and source-hash handling, and turn renewable-energy data into a reusable on-chain oracle pattern.

Reason this fits the official Build on Ethereum page: the page describes structured technical, ecosystem, and co-marketing support for Ethereum-aligned Web3 projects, including teams that use or plan to use Chainlink services such as Data Feeds, Proof of Reserve, Automation, and Functions.

## Ethereum ESP Framing

Use this framing:

> SolarPunk is open-source Ethereum research infrastructure for signed real-world energy data and testnet settlement. ESP support would fund public-good outputs: external review, oracle-hardening patterns, L2 deployment analysis, public technical reporting, and reproducible proof artifacts. The request is not for private liquidity, solvency reserves, or a closed commercial product.

Reason this fits the official ESP page: ESP says it supports free, open-source, non-commercial work that improves Ethereum, strengthens foundations, and enables future builders. The page evaluates technical approach, ecosystem impact, open-source output, budget, experience, and Ethereum alignment.

## Claim Boundaries

Allowed:

- Public Ethereum Sepolia prototype.
- Source-verified contracts.
- Public SPK attested-mint proof.
- Daily NASA POWER keeper with committed logs.
- Signed meter fixture and CSV pilot adapter.
- Audit-readiness package prepared.

Avoid:

- Mainnet-ready.
- Audited.
- Production oracle finality.
- Certified hardware-meter integration.
- Signed solar-operator pilot.
- Fully decentralized governance.
- Guaranteed yield or "prints money."

## Money Ask

Use `$48,000` as the primary ask.

Breakdown:

| Use | Amount |
|---|---:|
| Smart contract audit and remediation | $24,000 |
| Oracle productionization and Chainlink Automation / Functions prototype | $10,000 |
| L2 deployment and monitoring | $6,000 |
| Hosted demo and reviewer proof surface | $4,000 |
| Public technical report and research outputs | $4,000 |

Minimum useful grant: `$25,000`, focused on audit / external review and remediation.

## Final Practical Checklist

- Do not modify contracts before sending.
- Do not re-run deployment unless a form specifically requires a new tx.
- Do not promise token allocations in a grant form unless Chainlink explicitly asks about BUILD incentives and you are prepared to negotiate.
- If asked "is it live?", answer: "Live on Ethereum Sepolia with source-verified contracts and public transaction proofs; not mainnet."
- If asked "what is missing?", answer: "audit, production oracle hardening, certified meter integration, and pilot counterparty validation."
- If asked "why fund this?", answer: "to convert a public proof into externally reviewed infrastructure and publish the results openly."
