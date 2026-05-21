const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  DEFAULT_CONFIG,
  buildReport,
  dailyRowsFromPvWatts,
  monthDayFromHour,
  operatorCrosscheck,
  summarizeSite,
} = require("../scripts/nrel_solar_training_lab");

const ROOT = path.join(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
}

function fakePvWattsPayload({ acWatts = 1000, poaWatts = 600, annualAc = null } = {}) {
  return {
    station_info: {
      weather_data_source: "test-weather-source",
      solar_resource_file: "test-resource-file",
      lat: 24.99,
      lon: 121.3,
      distance: 0,
    },
    outputs: {
      ac: Array.from({ length: 8760 }, () => acWatts),
      poa: Array.from({ length: 8760 }, () => poaWatts),
      tamb: Array.from({ length: 8760 }, () => 25),
      wspd: Array.from({ length: 8760 }, () => 2),
      ac_annual: annualAc ?? (8760 * acWatts) / 1000,
      capacity_factor: 10,
    },
  };
}

test("month/day helper keeps a non-leap 365-day model calendar", () => {
  assert.deepEqual(monthDayFromHour(0), {
    date: "2021-01-01",
    month_day: "01-01",
    month: 1,
    day_of_year: 1,
  });
  assert.deepEqual(monthDayFromHour(8759), {
    date: "2021-12-31",
    month_day: "12-31",
    month: 12,
    day_of_year: 365,
  });
});

test("PVWatts hourly payload aggregates into daily SPK training rows", () => {
  const site = DEFAULT_CONFIG.sites[0];
  const payload = fakePvWattsPayload({ acWatts: 1000, poaWatts: 500 });
  const rows = dailyRowsFromPvWatts(site, payload, DEFAULT_CONFIG.spk);
  const summary = summarizeSite(site, payload, rows);

  assert.equal(rows.length, 365);
  assert.equal(rows[0].modeled_ac_kwh, 24);
  assert.equal(rows[0].modeled_poa_kwh_m2, 12);
  assert.equal(rows[0].modeled_capacity_factor, 0.1);
  assert.equal(rows[0].model_spk_generation_ceiling, 1.1988);
  assert.equal(summary.annual_ac_kwh, 8760);
  assert.equal(summary.monthly.length, 12);
});

test("report builds a sanitized three-site training dataset without credential material", () => {
  const responses = Object.fromEntries(
    DEFAULT_CONFIG.sites.map((site, index) => [site.id, fakePvWattsPayload({
      acWatts: 800 + (index * 100),
      annualAc: ((800 + (index * 100)) * 8760) / 1000,
    })])
  );
  const operatorData = {
    daily_rows: [
      { window_start: "2026-01-01T00:00:00Z", generation_kwh: 20 },
      { window_start: "2026-01-02T00:00:00Z", generation_kwh: 22 },
    ],
  };
  const report = buildReport({
    config: DEFAULT_CONFIG,
    responses,
    operatorData,
    now: new Date("2026-05-21T00:00:00Z"),
  });
  const serialized = JSON.stringify(report);

  assert.equal(report.generated_at, "2026-05-21T00:00:00.000Z");
  assert.equal(report.summary.sites, 3);
  assert.equal(report.summary.training_rows, 1095);
  assert.equal(report.source.api_key_written_to_artifact, false);
  assert.equal(report.operator_crosscheck.rows_compared, 2);
  assert.doesNotMatch(serialized, /api_key=/i);
  assert.doesNotMatch(serialized, /NREL_API_KEY=/);
});

test("operator crosscheck compares sample rows against Taoyuan baseline by month/day", () => {
  const taoyuanRows = dailyRowsFromPvWatts(DEFAULT_CONFIG.sites[0], fakePvWattsPayload(), DEFAULT_CONFIG.spk);
  const allRows = [
    ...taoyuanRows,
    ...dailyRowsFromPvWatts(DEFAULT_CONFIG.sites[1], fakePvWattsPayload({ acWatts: 500 }), DEFAULT_CONFIG.spk),
  ];
  const result = operatorCrosscheck({
    daily_rows: [
      { window_start: "2026-01-01T00:00:00Z", generation_kwh: 24 },
      { window_start: "2026-01-02T00:00:00Z", generation_kwh: 30 },
    ],
  }, allRows);

  assert.equal(result.rows_compared, 2);
  assert.equal(result.compared_rows[0].nrel_modeled_ac_kwh, 24);
  assert.ok(result.average_absolute_deviation_pct > 0);
});

test("generated NREL artifact is present after live training command", () => {
  const report = readJson("state/product/nrel_solar_training_lab.json");
  const serialized = JSON.stringify(report);

  assert.equal(report.title, "NREL Solar Training Lab");
  assert.equal(report.summary.training_stage, "public_model_baseline_ready");
  assert.equal(report.summary.sites, 3);
  assert.equal(report.summary.training_rows, 1095);
  assert.equal(report.source.api_key_written_to_artifact, false);
  assert.ok(report.sites.every((site) => site.daily_rows === 365));
  assert.doesNotMatch(serialized, /api_key=/i);
  if (process.env.NREL_API_KEY) {
    assert.doesNotMatch(serialized, new RegExp(process.env.NREL_API_KEY.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
