# Contributing to SolarPunk Public Lab

SolarPunk Public Lab v1.0 is an **open research testbed** for energy-evidence → bounded testnet issuance → network settlement workflows on Sepolia.

It is **not** a token sale, mainnet launch, stablecoin, legal tender, or investment product.

## Before you start

Read:

- [`docs/product/PUBLIC_LAB_V1.md`](./docs/product/PUBLIC_LAB_V1.md) — what the lab is and is not
- [`docs/project/OPEN_LAB_WORKFLOWS.md`](./docs/project/OPEN_LAB_WORKFLOWS.md) — how to run, replicate, and extend
- [`CURRENT_STATUS.md`](./CURRENT_STATUS.md) — live addresses, gates, ops commands

## Ways to contribute

| Goal | Start here |
|------|------------|
| Replicate the lab locally | [Workflow 1](./docs/project/OPEN_LAB_WORKFLOWS.md#1-run-the-local-lab) |
| Run against Sepolia | [Workflow 2](./docs/project/OPEN_LAB_WORKFLOWS.md#2-run-the-sepolia-lab) |
| Export / verify evidence | [Workflow 3](./docs/project/OPEN_LAB_WORKFLOWS.md#3-export-evidence) |
| Adapt meter/inverter data | [`ENERGY_DATA_ADAPTER_GUIDE.md`](./docs/project/ENERGY_DATA_ADAPTER_GUIDE.md) |
| Fork issuance or settlement rules | [`EXTENSION_POINTS.md`](./docs/project/EXTENSION_POINTS.md) |
| Share real energy data (closed pilot) | [Pilot data ask](./docs/product/PILOT_DATA_ASK.md) · [issue template](https://github.com/Spectating101/solarpunk-coin/issues/new?template=energy-data-experiment.md) |

## Pull requests

1. **Scope:** bug fixes, docs, tests, adapter samples (no private operator data), frontend copy/CSS for Public Lab only.
2. **Do not** open PRs that: enable mainnet, turn peg on, remove launch gates, add token-sale language, or commit secrets.
3. **Contracts:** any Solidity change needs `npx hardhat test` green and a short rationale in the PR.
4. **Frontend:** live surface is `PublicLabLanding.jsx` + `SpkV1Console.jsx` only. Archived components stay in `frontend/src/components/archive/`.

## Issues

Use a template when opening:

- **Research replication** — cannot reproduce commands or evidence
- **Energy data experiment** — meter/inverter export or closed pilot question
- **Bug report** — demo, sync, tests, or docs error
- **Public Lab pilot** — existing template for broader pilot inquiries

## Citation

If you use this lab in academic work, cite via [`CITATION.cff`](./CITATION.cff) and link to Public Lab v1.0, not “SPK is live money.”

## License

MIT — see [`LICENSE`](./LICENSE). Code may be forked; project names and marks are not automatic endorsement — see [`TRADEMARK.md`](./TRADEMARK.md).

## Security

Do not post private keys, production API tokens, or customer-identifying meter data in issues or PRs.
