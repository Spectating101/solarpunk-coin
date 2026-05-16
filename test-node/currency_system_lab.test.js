const assert = require("node:assert/strict");
const test = require("node:test");

const { buildCurrencyLab, buildLedger } = require("../scripts/currency_system_lab");

test("ledger conserves minted SPK across active balances and redemption", () => {
  const ledger = buildLedger(130.1697, 0.05);
  assert.equal(ledger.accounting.conservation_pass, true);
  assert.equal(ledger.accounting.minted_spk, 130.1697);
  assert.equal(ledger.accounting.redeemed_spk, 20);
  assert.equal(ledger.accounting.active_supply_spk, 110.1697);
  assert.equal(ledger.accounting.redeemed_energy_kwh_equivalent, 400);
});

test("currency lab keeps real proof separate from simulated layers", () => {
  const report = buildCurrencyLab({ now: new Date("2026-05-15T00:00:00Z") });
  assert.equal(report.layers.length, 4);
  assert.equal(report.layers[0].status, "real_public_testnet");
  assert.equal(report.layers[1].status, "simulated_from_public_fixture");
  assert.equal(report.layers[2].status, "local_contract_tested");
  assert.equal(report.layers[3].status, "local_contract_tested");
  assert.equal(report.ledger.accounting.conservation_pass, true);
});
