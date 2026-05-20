const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const ROOT = path.join(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
}

test("pilot stack drill proves the full SPK cryptocurrency loop", () => {
  const receipt = readJson("state/product/pilot_stack_currency_drill.json");
  const stepNames = receipt.flow.map((step) => step.name);

  assert.equal(receipt.execution_scope, "local_governed_pilot_stack_currency_drill");
  assert.equal(receipt.all_checks_passed, true);
  assert.deepEqual(stepNames, [
    "attested_surplus_mint",
    "service_invoice_payment",
    "energy_credit_payment",
    "redemption_claim",
    "delivery_resolution",
  ]);
  assert.ok(receipt.contracts.SolarPunkCoin);
  assert.ok(receipt.contracts.SolarPunkCurrencySystem);
});

test("pilot stack drill keeps governance separation and accounting explicit", () => {
  const receipt = readJson("state/product/pilot_stack_currency_drill.json");

  assert.equal(receipt.governance_checks.spk_owner_is_governance_admin, true);
  assert.equal(receipt.governance_checks.spk_deployer_default_admin_revoked, true);
  assert.equal(receipt.governance_checks.treasury_deployer_default_admin_revoked, true);
  assert.equal(receipt.governance_checks.spk_minter_role_separated, true);
  assert.equal(receipt.governance_checks.spk_oracle_role_separated, true);
  assert.equal(receipt.accounting.conservation_pass, true);
  assert.equal(receipt.accounting.delivery_fulfilled, true);
  assert.equal(receipt.accounting.shortfall_kwh, 0);
  assert.equal(receipt.accounting.owed_kwh, receipt.accounting.delivered_kwh);
});

test("pilot stack drill does not claim external launch readiness", () => {
  const receipt = readJson("state/product/pilot_stack_currency_drill.json");
  const boundaries = receipt.boundaries.join(" ");

  assert.equal(receipt.dependencies.external_network_required, false);
  assert.equal(receipt.dependencies.real_counterparty_required, false);
  assert.match(boundaries, /not a public network deployment/);
  assert.match(boundaries, /does not prove real hardware provenance/);
});

