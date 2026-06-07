const assert = require("node:assert/strict");
const test = require("node:test");

const { buildCurrencyLab, buildLedger } = require("../scripts/currency_system_lab");

test("ledger conserves minted SPK across active balances and optional redemption", () => {
  const mintedSpk = 2603.394;
  const ledger = buildLedger(mintedSpk, { kwhPerSpk: 1, redeemedSpk: 15 });
  assert.equal(ledger.accounting.conservation_pass, true);
  assert.equal(ledger.accounting.minted_spk, mintedSpk);
  assert.equal(ledger.accounting.redeemed_spk, 15);
  assert.equal(ledger.accounting.active_supply_spk, 2588.394);
  assert.equal(ledger.accounting.redeemed_energy_kwh_equivalent, 15);
  assert.ok(ledger.accounting.circulation_share > 0.9);
});

test("currency lab keeps real proof separate from simulated layers", () => {
  const report = buildCurrencyLab({ now: new Date("2026-05-15T00:00:00Z") });
  assert.equal(report.layers.length, 4);
  assert.equal(report.layers[0].status, "real_public_testnet");
  assert.equal(report.layers[1].status, "local_spk_settlement_loop");
  assert.equal(report.layers[2].status, "local_contract_tested");
  assert.equal(report.layers[3].status, "local_contract_tested");
  assert.equal(report.ledger.accounting.conservation_pass, true);
});
