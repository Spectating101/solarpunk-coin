const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  buildResourceBenchmarkLab,
  oilBenchmark,
} = require("../scripts/resource_benchmark_lab");

const ROOT = path.join(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
}

const fixtureNasaData = {
  properties: {
    parameter: {
      ALLSKY_SFC_SW_DWN: {
        20260501: 2.4,
        20260502: 4.0,
        20260503: 3.2,
      },
      WS10M: {
        20260501: 2.0,
        20260502: 3.0,
        20260503: 4.0,
      },
      T2M: {
        20260501: 25.0,
        20260502: 26.0,
        20260503: 27.0,
      },
    },
  },
};

test("resource benchmark converts NASA solar into PV output without making it mint evidence", () => {
  const report = buildResourceBenchmarkLab({
    now: new Date("2026-05-16T00:00:00Z"),
    nasaData: fixtureNasaData,
    fetchStatus: "fixture",
  });

  assert.equal(report.location.name, "Taoyuan, Taiwan");
  assert.equal(report.solar.standard_system.system_kw_dc, 10);
  assert.equal(report.solar.standard_system.panel_area_m2, 50);
  assert.equal(report.solar.standard_system.performance_ratio, 0.86);
  assert.equal(report.solar.production_estimate.latest_day_ac_kwh, 27.52);
  assert.equal(report.solar.spk_value_model.can_mint_from_model_estimate, false);
  assert.match(report.solar.spk_value_model.mint_rule, /signed meter or inverter/);
});

test("resource benchmark includes wind density, renewable conditionals, and fossil exclusion", () => {
  const report = buildResourceBenchmarkLab({
    now: new Date("2026-05-16T00:00:00Z"),
    nasaData: fixtureNasaData,
    fetchStatus: "fixture",
  });

  const wind = report.resources.find((resource) => resource.id === "wind_turbine");
  const geothermal = report.resources.find((resource) => resource.id === "geothermal");
  const oil = report.resources.find((resource) => resource.id === "oil_barrel");

  assert.equal(wind.measured_input, true);
  assert.equal(wind.can_mint_from_model_estimate, false);
  assert.equal(geothermal.mint_eligibility, "eligible_after_signed_meter_attestation_and_resource_policy");
  assert.equal(oil.mint_eligibility, "not_eligible");
  assert.equal(oil.kwh_thermal_per_barrel, 1699.81);
});

test("oil benchmark is a unit conversion only", () => {
  const oil = oilBenchmark({
    oil: {
      crude_oil_btu_per_barrel: 5_800_000,
      btu_to_kwh: 0.00029307107,
      electric_conversion_efficiency: 0.33,
    },
  });

  assert.equal(oil.type, "fossil_benchmark_only");
  assert.equal(oil.kwh_thermal_per_barrel, 1699.81);
  assert.equal(oil.kwh_electric_equivalent_at_assumed_efficiency, 560.94);
  assert.equal(oil.can_mint_from_model_estimate, false);
});

test("generated resource benchmark artifact keeps policy boundaries explicit", () => {
  const report = readJson("state/product/resource_benchmark_lab.json");

  assert.equal(report.data_fetch.requested_parameters.includes("ALLSKY_SFC_SW_DWN"), true);
  assert.equal(report.data_fetch.requested_parameters.includes("WS10M"), true);
  assert.ok(report.solar.production_estimate.latest_day_ac_kwh > 0);
  assert.ok(report.nasa_grid_cell_estimate.approximate_cell_area_km2 > 2500);
  assert.ok(report.hard_boundaries.includes("A NASA resource estimate is not mint evidence."));
  assert.equal(report.resources.find((resource) => resource.id === "oil_barrel").mint_eligibility, "not_eligible");
});
