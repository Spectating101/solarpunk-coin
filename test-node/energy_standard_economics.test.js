const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  buildEnergyStandardEconomics,
  calculateIssuance,
} = require("../scripts/energy_standard_economics");

const ROOT = path.join(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
}

test("issuance equation matches the attested SPK proof math", () => {
  const issuance = calculateIssuance({
    surplusKwh: 2606,
    energyPriceUsdPerKwh: 0.05,
    mintFeeBps: 10,
  });

  assert.equal(issuance.gross_issuance_spk, 130.3);
  assert.equal(issuance.mint_fee_spk, 0.1303);
  assert.equal(issuance.net_issuance_spk, 130.1697);
});

test("energy standard economics keeps the gold-standard claim bounded", () => {
  const report = buildEnergyStandardEconomics({
    now: new Date("2026-05-16T00:00:00Z"),
  });

  assert.match(report.one_line, /energy-standard cryptocurrency/);
  assert.equal(report.proof_issuance_math.observed_matches_formula, true);
  assert.equal(report.current_monetary_state.kwh_per_1_spk_at_current_basis, 20);
  assert.equal(report.price_basis_sensitivity.find((row) => row.energy_price_usd_per_kwh === 0.2).kwh_per_spk, 5);
  assert.equal(report.price_basis_sensitivity.find((row) => row.energy_price_usd_per_kwh === 0.2).simple_payback_years_10kw_before_incentives, 15.69);
  assert.equal(report.gold_standard_mapping.length, 4);
  assert.ok(report.hard_boundaries.includes("This is an economic framework and sensitivity model, not a claim of legal money status."));
});

test("capacity scenarios scale issuance from the same measured solar basis", () => {
  const report = buildEnergyStandardEconomics({
    now: new Date("2026-05-16T00:00:00Z"),
  });
  const rooftop = report.capacity_scenarios.find((scenario) => scenario.id === "single_rooftop_10kw");
  const utility = report.capacity_scenarios.find((scenario) => scenario.id === "utility_100mw");

  assert.equal(rooftop.capacity_kw, 10);
  assert.equal(utility.capacity_kw, 100000);
  assert.equal(Number(utility.net_issuance_spk.toFixed(2)), Number((rooftop.net_issuance_spk * 10000).toFixed(2)));
  assert.match(utility.boundary, /signed meter or inverter/);
});

test("generated energy standard artifact remains finance-not-hype", () => {
  const report = readJson("state/product/energy_standard_economics.json");
  const statuses = report.monetary_function_readiness.map((item) => item.status);

  assert.ok(statuses.includes("not_proven"));
  assert.ok(report.finance_risk_register.some((item) => item.risk === "Regulatory classification"));
  assert.ok(report.hard_boundaries.some((boundary) => boundary.includes("does not create energy")));
});
