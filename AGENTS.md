# AI assistant instructions

Read [`DOCS.md`](./DOCS.md) before anything else in this repo.

## Current product

- **SPK v1** on Ethereum Sepolia — canonical addresses in `state/runtime/spk_v1.json`
- Operator command: `npm run spk:v1:cycle:sepolia`
- Do **not** treat launch-gate, public-lab, or grant docs as current truth

## Do not

- Redeploy Sepolia unless bytecode changed
- Frame this as "launch ready" or grant-seeking
- Use `docs/product/SOLARPUNK_FULL_CONTEXT_FOR_CLAUDE.md` (retired)
- Touch `IE-JDE/` (separate project)

## Verify facts

- `CURRENT_STATUS.md` + `npx hardhat test` (109 tests)
