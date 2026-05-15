# Public Lab Social Kit

Purpose: make SolarPunk socially legible without overstating readiness.

Use this kit for X/Twitter, LinkedIn, Farcaster, Reddit, Discord, Telegram groups, GitHub, and personal emails. Keep every post tied to public proof artifacts.

## Core Positioning

One-line:

> SolarPunk Public Lab is an open Sepolia proof environment where signed renewable-energy meter data becomes a replay-protected SPK mint with public transactions and reproducible evidence.

Short version:

> I opened SolarPunk Public Lab: a testnet proof that signed renewable-energy meter readings can be verified into an oracle-signed source hash and used to mint SPK on Sepolia with replay protection. It is not a token sale or mainnet product. It is a public lab for inspection, criticism, and pilot data conversations.

Do not say:

- "prints money"
- "guaranteed yield"
- "mainnet-ready"
- "audited"
- "production meter-certified"
- "investment opportunity"

## Primary Links

- Demo: `https://spectating101.github.io/solarpunk-coin/`
- GitHub: `https://github.com/Spectating101/solarpunk-coin`
- Public lab model: `https://github.com/Spectating101/solarpunk-coin/blob/main/docs/product/PUBLIC_LAB.md`
- Product launch gate: `https://github.com/Spectating101/solarpunk-coin/blob/main/docs/product/PRODUCT_LAUNCH_GATE.md`
- Currency system lab: `https://github.com/Spectating101/solarpunk-coin/blob/main/docs/product/CURRENCY_SYSTEM_LAB.md`
- SPK product proof: `https://github.com/Spectating101/solarpunk-coin/blob/main/docs/product/SPK_ATTESTED_MINT_PROOF.md`
- Public readback: `https://github.com/Spectating101/solarpunk-coin/blob/main/docs/product/SPK_PUBLIC_READBACK.md`
- Pilot inquiry: `https://github.com/Spectating101/solarpunk-coin/issues/new?template=public-lab-pilot.md`

## X / Farcaster Post

```text
I opened SolarPunk Public Lab.

It is a public Sepolia proof that signed renewable-energy meter data can mint SPK through an oracle-signed, replay-protected attestation.

What is public:
- signed meter -> source hash -> SPK mint proof
- four-layer currency-system lab with labelled simulation boundaries
- 7/7 Sepolia readback checks
- daily NASA POWER -> Sepolia keeper logs
- CSV path for meter/inverter exports

What it is not:
- not a token sale
- not mainnet
- not audited
- not a yield claim

I am looking for critique, real meter/inverter export formats, and pilot conversations.

Demo:
https://spectating101.github.io/solarpunk-coin/

Repo:
https://github.com/Spectating101/solarpunk-coin
```

## LinkedIn Post

```text
I have opened SolarPunk Public Lab, an open testnet environment for inspecting a renewable-energy attestation protocol.

The current proof path is narrow and verifiable:

1. Registered meter readings are signed.
2. The readings are checked for signatures, duplicate nonces, measurement windows, quality, capacity sanity, and energy balance.
3. The accepted bundle is hashed into a source hash.
4. An oracle role signs the surplus attestation.
5. SolarPunkCoin verifies the attestation and mints SPK on Ethereum Sepolia with replay protection.

The project includes public Sepolia transactions, source-verified contracts, a daily NASA POWER to Sepolia keeper, a React demo, and reproducible docs.

This is not a mainnet product, token sale, audit claim, or investment offer. It is a public lab for technical review and pilot discovery.

I am especially looking for:

- solar operators willing to discuss meter/inverter export formats,
- researchers interested in energy-backed settlement,
- Web3/oracle builders willing to critique the data path,
- reviewers who can help pressure-test the trust assumptions.

Demo: https://spectating101.github.io/solarpunk-coin/
Repo: https://github.com/Spectating101/solarpunk-coin
```

## Reddit / Forum Post

```text
Title: I built an open Sepolia lab for signed renewable-energy data -> replay-protected token minting

I am looking for technical criticism, not hype.

SolarPunk Public Lab is a public testnet proof that signed renewable-energy meter readings can be verified into a deterministic source hash, signed by an oracle role, and consumed by a Solidity contract to mint SPK with replay/source-hash protection.

Current proof surface:
- public Sepolia mint tx
- four-layer currency-system lab
- source-verified contracts
- read-only on-chain readback checks
- daily NASA POWER -> Sepolia keeper logs
- CSV import path for meter/inverter exports
- 96 Solidity tests
- 14 meter/attestation tests

Hard limits:
- not mainnet
- not audited
- not a token sale
- no production meter certification yet
- closed pilot still needs governed redeploy + one real meter/inverter export

I would value feedback on:
- meter data trust assumptions
- oracle/replay protections
- whether the public lab framing is understandable
- what a solar operator would need before sharing an anonymized export

Demo: https://spectating101.github.io/solarpunk-coin/
Repo: https://github.com/Spectating101/solarpunk-coin
```

## Direct Message To Solar / Energy Contact

```text
Hi [Name],

I am running SolarPunk Public Lab, an open Sepolia/testnet proof for signed renewable-energy meter data.

The narrow question is whether a meter or inverter export can be transformed into a signed, auditable source hash and then into a replay-protected on-chain SPK mint. This is not a token sale or production deployment.

Would you be open to a 20-minute call about what export formats your systems can produce? I am not asking for private customer data. Even an anonymized CSV schema would help test whether the lab can handle real-world meter data.

Demo: https://spectating101.github.io/solarpunk-coin/
Public lab model: https://github.com/Spectating101/solarpunk-coin/blob/main/docs/product/PUBLIC_LAB.md
```

## OpenClaw / Agent Usage Policy

OpenClaw or any agentic social tool can be useful for drafting and scheduling, but it should not be the public authority for this project.

Allowed:

- Draft post variants.
- Turn repo docs into short summaries.
- Monitor replies and collect links.
- Prepare a daily "who responded / what evidence changed" report.
- Suggest communities to post in.

Not allowed:

- Autonomous posting without human approval.
- Replying to legal, investment, audit, medical, or safety questions.
- Claiming production readiness.
- Claiming yield, price, redemption, or investment value.
- Inventing partnerships, pilots, grants, or endorsements.

Operating rule:

> Human approves every public claim. Agent helps with distribution logistics only.

## Validation Metrics

Track these weekly:

- GitHub stars and forks.
- Public issues opened.
- Meaningful comments or reviews.
- Meter/inverter export schemas received.
- Calls booked.
- External repo links or citations.
- Grant or advisor replies.
- Demo visits if analytics are enabled later.

The strongest validation is not likes. It is one real meter/inverter export and one external person willing to have their feedback recorded publicly or semi-publicly.
