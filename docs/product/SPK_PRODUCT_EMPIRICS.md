# SPK Product Empirics

- generated_at: `2026-05-15T16:22:05.934389+00:00`
- product: `SolarPunkCoin (SPK)`
- primary_contract: `contracts/SolarPunkCoin.sol`
- primary_function: `mintFromSurplusAttestation`

## Product Claim

SolarPunkCoin is now framed as a single product: accepted surplus renewable-energy kWh mints SPK through an oracle-signed, replay-protected attestation.

The narrow product path is:

1. Meter devices sign raw readings against registered device addresses.
2. `scripts/derive_meter_attestations.js` verifies signatures, duplicate nonces, closed windows, quality thresholds, capacity bounds, and energy balance.
3. `scripts/mint_spk_from_meter_bundle.js` derives the source hash, signs the oracle attestation, and calls `mintFromSurplusAttestation`.
4. `SolarPunkCoin` verifies role, signature, closed measurement window, validity window, source-hash single use, attestation replay status, grid stress, reserve ratio, oracle freshness, supply cap, fee split, and recipient before minting.

## Executable Product Proof

| Item | Value |
|---|---:|
| Bundle available | `True` |
| Mint proof available | `True` |
| SolarPunkCoin contract | `0x8ceDa149EDE44078bf151b3334513916a84df820` |
| Source schema | `SPK_RAW_METER_READINGS_V1` |
| Batch ID | `batch_2026_02_12_a` |
| Input records | `4` |
| Accepted records | `2` |
| Rejected records | `2` |
| Verified signatures | `2` |
| Registered meters | `2` |
| Total surplus kWh | `2606.7` |
| Minted SPK | `130.1697` |
| Source hash | `0xe3f1d7e10fbe38a0951943415121a25ca8b9e031634422576bb29ef9a576a5c8` |
| Attestation hash | `0xd3c77958aa6f53cd1a5a8ed52c8898cf1376b8a5751e1598add5ab0c5cea558d` |
| Attestation hash consumed | `True` |
| Source hash consumed | `True` |
| Execution scope | `attached-network` |
| Transaction hash | `0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d` |

## Empirical Basis

| Evidence pillar | Current result | Why it matters for SPK |
|---|---|---|
| CEIR energy anchor | `pre=-0.257131`, `post=-0.634255`, `Chow p=1.110e-16` | Supports the thesis that energy cost carries measurable information in proof-of-work monetary systems. |
| Physical calibration | `sigma=189.5%`, `JB p=0.348939`, `returns=2166` | Shows the energy-data process can be parameterized from real irradiance observations rather than pure assumptions. |
| Oracle tolerance | `Taiwan VR>=95% max error=21.7%` | Defines how much source-data error the economics can tolerate before risk controls fail. |
| Pricing validation | `5 markets`, `Taiwan binomial/MC diff=2.07912%`, `hedge eff=0.995985` | Shows the pricing layer is not a one-location toy and converges across methods. |
| Monetary scorecard | `Energy=7`, `Gold=2`, `Fiat=1` | Explains why the product is energy-minted money, not just another collateral wrapper. |
| Daily live-data keeper | `runs=19`, `latest=2026-05-15` | Demonstrates recurring real-data ingestion and public transaction artifacts on Sepolia. |

## Product Interpretation

The repo now supports one coherent story: SPK is a programmable receipt for verified surplus renewable energy, with monetary logic, oracle controls, reserve controls, and empirical energy-pricing research around that one minting claim.

The revenue-floor and option code remain useful, but they are supporting modules: they stress-test, hedge, and commercialize the same energy-price basis. They are no longer the primary product claim.

## Reproduce

```bash
npm run attestations:fixture
npm run attestations:build
npm run proof:spk-attested-mint
npm run product:empirics
npx hardhat test
```

## Scope Limits

- The older Safe-admin Sepolia deployment predates the signed surplus-attestation mint function; the fresh attested SPK proof deployment is public but not production-governed.
- The current sample meter bundle is a deterministic pilot fixture, not a certified hardware meter feed.
- The code is locally tested, but no formal external smart-contract audit has been completed.
- Legal, utility-interconnection, and commodity/payment classification work remains outside this repository.
