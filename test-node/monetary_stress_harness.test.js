const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  buildMonetaryStressHarness,
  calculateScenario,
} = require("../scripts/monetary_stress_harness");

const ROOT = path.join(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
}

test("monetary stress harness produces conservation-checked scenarios", () => {
  const report = buildMonetaryStressHarness({
    now: new Date("2026-05-17T00:00:00Z"),
  });

  assert.ok(report.scenarios.length >= 5);
  assert.equal(report.summary.all_conservation_checks_pass, true);
  for (const scenario of report.scenarios) {
    assert.equal(
      Number(scenario.issued_spk).toFixed(6),
      (Number(scenario.active_after_redemption_spk) + Number(scenario.redeemed_spk)).toFixed(6)
    );
  }
});

test("full-delivery scenario has no shortfall liability", () => {
  const report = buildMonetaryStressHarness({
    now: new Date("2026-05-17T00:00:00Z"),
  });
  const scenario = report.scenarios.find((item) => item.id === "pilot_csv_full_redemption");

  assert.equal(scenario.status, "passes_full_delivery");
  assert.equal(scenario.shortfall_kwh, 0);
  assert.equal(scenario.shortfall_liability_usd, 0);
  assert.equal(scenario.additional_buffer_required_usd, 0);
});

test("shortfall scenario exposes required reserve instead of hiding the gap", () => {
  const report = buildMonetaryStressHarness({
    now: new Date("2026-05-17T00:00:00Z"),
  });
  const scenario = report.scenarios.find((item) => item.id === "pilot_csv_75pct_redeem_5pct_shortfall");

  assert.ok(scenario.shortfall_kwh > 0);
  assert.ok(scenario.shortfall_liability_usd > scenario.fee_buffer_usd);
  assert.equal(scenario.status, "pilot_requires_named_reserve");
  assert.ok(scenario.additional_buffer_required_usd > 0);
});

test("scenario calculator can mark a shortfall as buffered when reserve is explicit", () => {
  const sources = {
    energyStandard: readJson("state/product/energy_standard_economics.json"),
    currencyLab: readJson("state/product/currency_system_lab.json"),
    fieldReceipt: readJson("state/product/field_receipt_loop.json"),
    pilotCsv: readJson("state/product/pilot_csv_receipt.json"),
  };
  const scenario = calculateScenario(
    {
      id: "buffered",
      label: "Buffered test",
      source: "test",
      supplySource: "pilot_csv",
      velocity: 1,
      redemptionFraction: 1,
      deliveryShortfallFraction: 0.05,
      operatorReserveUsd: 10,
    },
    sources
  );

  assert.equal(scenario.status, "buffered_shortfall");
  assert.equal(scenario.additional_buffer_required_usd, 0);
  assert.ok(scenario.reserve_coverage_ratio >= 1);
});

test("generated monetary stress artifact keeps the no-solvency-guarantee boundary", () => {
  const report = readJson("state/product/monetary_stress_harness.json");

  assert.equal(report.summary.all_conservation_checks_pass, true);
  assert.ok(report.hard_boundaries.includes("This harness is an internal monetary stress model, not a solvency guarantee."));
  assert.ok(
    report.hard_boundaries.includes(
      "Shortfall scenarios intentionally show where the protocol needs reserve capital instead of pretending SPK can print through physical delivery gaps."
    )
  );
});
