# Foundation operator

Run the testnet monetary loop. No thesis steps required.

## Weekly rhythm

```bash
npm run foundation:health      # gas + sync check
npm run foundation:cycle       # mint + pay + sync + status export
npm run foundation:publish-docs   # refresh live demo at /demo/
```

## Operator wallet

| Item | Value |
|------|--------|
| Deployer | `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54` |
| Needs | **Sepolia ETH** for gas (≥0.01 ETH recommended) |
| Holds | Test SPK for operator payments |

**Low gas?** Use a [Sepolia faucet](https://sepoliafaucet.com/) on the deployer address. Cycles fail silently mid-run if ETH is too low.

## Fund a demo wallet (SPK only)

```bash
RECIPIENT=0xYourAddress AMOUNT=50 npm run spk:v1:fund
```

## Meter-attested mint cycle

```bash
CYCLE_MINT_MODE=meter npm run foundation:cycle
```

Requires `state/attestations/latest_attestation_bundle.json`.

## Local wallet demo + auto-sync

```bash
npm run spk:v1:api
cd frontend && npm run dev
```

## Live URLs

- Demo: https://spectating101.github.io/solarpunk-coin/demo/
- Status: `docs/foundation/FOUNDATION_STATUS.md`
