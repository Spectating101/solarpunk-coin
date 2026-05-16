const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  buildEmpiricalFinanceBacktest,
  seriesFromNasa,
} = require("../scripts/empirical_finance_backtest");

const ROOT = path.join(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
}

const sampleNasa = {
  properties: {
    parameter: {
      ALLSKY_SFC_SW_DWN: {
        20240101: 3,
        20240102: 4,
        20240103: -999,
        20240104: 5,
      },
    },
  },
};

test("seriesFromNasa converts NASA daily keys and drops missing values", () => {
  const series = seriesFromNasa(sampleNasa);

  assert.deepEqual(series.map((point) => point.date), ["2024-01-01", "2024-01-02", "2024-01-04"]);
  assert.equal(series[2].ghi_kwh_m2_day, 5);
});

test("empirical backtest converts resource history into finance ratios", () => {
  const report = buildEmpiricalFinanceBacktest({
    now: new Date("2026-05-17T00:00:00Z"),
    series: [
      { date: "2024-01-01", ghi_kwh_m2_day: 3 },
      { date: "2024-01-02", ghi_kwh_m2_day: 4 },
      { date: "2024-02-01", ghi_kwh_m2_day: 5 },
      { date: "2024-02-02", ghi_kwh_m2_day: 6 },
    ],
  });

  assert.equal(report.input_basis.observed_days, 4);
  assert.equal(report.archetypes.length, 3);
  assert.ok(report.archetypes[0].annual_distribution.p50_energy_value_usd > 0);
  assert.ok(report.archetypes[0].capital_model.p50_simple_payback_years > 0);
  assert.ok(report.monthly_rows.length >= 6);
  assert.match(report.finance_claims.empirical_status, /resource_/);
});

test("generated empirical finance backtest remains bounded as public-data evidence", () => {
  const report = readJson("state/product/empirical_finance_backtest.json");

  assert.ok(report.finance_claims.empirical_days >= 365);
  assert.ok(report.hard_boundaries.some((boundary) => boundary.includes("not signed meter production")));
  assert.ok(report.hard_boundaries.some((boundary) => boundary.includes("does not prove customer demand")));
});
