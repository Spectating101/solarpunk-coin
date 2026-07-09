# AI assistant instructions

Read [`DOCS.md`](./DOCS.md) before anything else in this repo.

## Current product

- **SolarPunk Public Lab v1.0** on Ethereum Sepolia — canonical framing in [`docs/product/PUBLIC_LAB_V1.md`](./docs/product/PUBLIC_LAB_V1.md)
- Canonical addresses in `state/runtime/spk_v1.json`
- Default operating mode: **maintenance** — [`docs/project/MAINTENANCE.md`](./docs/project/MAINTENANCE.md)
- Optional operator cycle: `npm run spk:v1:cycle:sepolia` (not required weekly)

## Do not

- Redeploy Sepolia unless bytecode intentionally changed
- Frame this as “launch ready” currency, token sale, mainnet, or grant-seeking theater
- Treat pre-v1 launch-gate / grant / Polygon Amoy docs as current truth
- Use `docs/product/SOLARPUNK_FULL_CONTEXT_FOR_CLAUDE.md` (retired)
- Touch `IE-JDE/` (separate project)

## Verify facts

- `CURRENT_STATUS.md` + `npx hardhat test` (109 tests)
- Prefer Public Lab v1 + `spk_v1.json` when documents disagree
