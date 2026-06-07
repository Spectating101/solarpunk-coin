# Energy-Native SPK Currency

Research prototype for issuing SPK directly in **energy units** instead of translating surplus kWh through a dollar tariff first. A **peg overlay** remains available when you want USD-style stability on top of the energy unit.

## Two issuance modes

| Mode | Constant | Mint formula | Redemption quote |
|------|----------|--------------|------------------|
| **Energy-native** (default) | `ISSUANCE_ENERGY_NATIVE = 1` | `surplusKwh → SPK` via `kwhPerSpkWad` | `SPK × kwhPerSpkWad` |
| **Dollar-translated** (legacy) | `ISSUANCE_DOLLAR_TRANSLATED = 0` | `surplusKwh × energyPricePerKwh` | `SPK / energyPricePerKwh` |

Default: **1 SPK = 1 kWh** (`kwhPerSpkWad = 1e18`).

### Example (energy-native)

- Verified surplus: **2,606 kWh**
- Mint fee: 10 bps
- Minted to producer: **~2,603.39 SPK**
- Redeem 20 SPK → **20 kWh** owed (off-chain delivery tracked by `SolarPunkCurrencySystem`)

Under dollar-translated mode at $0.05/kWh the same surplus would mint only ~130 SPK and redeem 20 SPK for 400 kWh.

## Peg is optional

| Setting | Default | Effect |
|---------|---------|--------|
| `pegEnabled` | `false` | PI controller skipped; oracle price updates do not mint/burn for peg |
| `pegEnabled = true` | — | Existing PI loop adjusts supply via stability pool when `lastOraclePrice` deviates from `pegTarget` |

Energy-native issuance does **not** require a USD peg. Enable peg only when you want a secondary stability layer (e.g. market price of SPK vs $1).

## Reference tariff (reporting only)

`referenceUsdPerKwh` + `impliedUsdPerSpk()` give an **implied USD view** for dashboards and thesis accounting. They do **not** affect mint or redemption math in energy-native mode.

## Redemption flow (unchanged pattern)

1. Holder calls `SolarPunkCurrencySystem.openRedemption` → SPK burned on-chain
2. Registry records `owedKwhWad` from `spk.quoteRedemptionKwh()`
3. Operator calls `resolveRedemption` after off-chain kWh delivery (or records shortfall/dispute)

Physical delivery remains off-chain; the chain records the energy obligation.

## Key contract functions

**SolarPunkCoin.sol**

- `setIssuanceMode(uint8)` — switch energy-native ↔ dollar-translated
- `setKwhPerSpk(uint256)` — e.g. 1 SPK = 2 kWh
- `setPegEnabled(bool)` — turn PI peg overlay on/off
- `setReferenceUsdPerKwh(uint256)` — optional reporting tariff
- `quoteRedemptionKwh(uint256 spkAmount)`
- `impliedUsdPerSpk()`

**SolarPunkCurrencySystem.sol**

- `quoteRedemption()` uses `spk.quoteRedemptionKwh()` and `spk.redemptionBasisWad()`

## Run the demo

```bash
npx hardhat run scripts/energy_native_currency_demo.js
```

Writes `state/product/energy_native_currency_demo.json` with mint → invoice → redeem → optional peg enable.

## Tests

Hardhat tests in `test/SolarPunkCoin.test.js` (energy-native describe block) and updated `test/SolarPunkCurrencySystem.test.js` prove:

- 1:1 surplus-to-SPK minting by default
- Redemption quotes in kWh without dollar conversion
- PI control inactive until `setPegEnabled(true)`
- Currency registry redemption at energy-native scale

## Research framing

This is a **thesis prototype**, not a production monetary standard. Open questions (redemption legalities, grid interconnection, oracle trust) stay off-chain; the contracts encode the accounting skeleton so you can evaluate whether a pure energy unit with optional peg fits your model.
