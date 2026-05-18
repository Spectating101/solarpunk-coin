const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const ROOT = path.join(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
}

test("local SPK loop is fully local and dependency-free", () => {
  const receipt = readJson("state/product/field_receipt_loop.json");

  assert.equal(receipt.execution_scope, "local_deterministic_no_external_dependencies");
  assert.equal(receipt.dependencies.external_network_required, false);
  assert.equal(receipt.dependencies.external_api_required, false);
  assert.equal(receipt.dependencies.grant_or_external_approval_required, false);
  assert.equal(receipt.dependencies.real_counterparty_required, false);
});

test("local SPK loop preserves SPK and kWh accounting", () => {
  const receipt = readJson("state/product/field_receipt_loop.json");

  assert.equal(receipt.source.accepted_records, 2);
  assert.equal(receipt.source.rejected_records, 2);
  assert.equal(receipt.source.verified_signatures, 2);
  assert.equal(receipt.accounting.minted_spk, 130.1697);
  assert.equal(receipt.accounting.settlement_volume_spk, 75);
  assert.equal(receipt.accounting.redeemed_spk, 20);
  assert.equal(receipt.accounting.owed_kwh, 400);
  assert.equal(receipt.accounting.delivered_kwh, 400);
  assert.equal(receipt.accounting.shortfall_kwh, 0);
  assert.equal(receipt.accounting.conservation_pass, true);
  assert.equal(receipt.accounting.delivery_fulfilled, true);
});

test("local SPK loop includes the complete currency mechanism path", () => {
  const receipt = readJson("state/product/field_receipt_loop.json");
  const stepNames = receipt.flow.map((step) => step.name);

  assert.deepEqual(stepNames, [
    "signed_surplus_mint",
    "field_service_invoice_settlement",
    "energy_credit_settlement",
    "redemption_opened",
    "delivery_resolved",
  ]);
  assert.ok(receipt.contracts.SolarPunkCoin);
  assert.ok(receipt.contracts.SolarPunkCurrencySystem);
});
