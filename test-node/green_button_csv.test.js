const assert = require("node:assert/strict");
const test = require("node:test");
const { normalizeGreenButtonCsv, toSpkCsv } = require("../scripts/normalize_green_button_csv");

test("normalizes Green Button interval CSV into daily SPK windows", () => {
  const csv = `Interval Start,Interval End,Usage,Units,Flow Direction
2026-01-15T08:00:00Z,2026-01-15T09:00:00Z,1.2,kWh,Reverse (Export)
2026-01-15T09:00:00Z,2026-01-15T10:00:00Z,2.4,kWh,Reverse (Export)
2026-01-15T10:00:00Z,2026-01-15T11:00:00Z,0.8,kWh,Forward (Import)
2026-01-15T11:00:00Z,2026-01-15T12:00:00Z,3.1,kWh,Reverse (Export)`;

  const daily = normalizeGreenButtonCsv(csv);
  assert.equal(daily.length, 1);
  assert.ok(Math.abs(daily[0].export_kwh - 6.7) < 0.01);
  assert.ok(Math.abs(daily[0].site_load_kwh - 0.8) < 0.01);
  assert.ok(Math.abs(daily[0].generation_kwh - 7.5) < 0.01);

  const out = toSpkCsv(daily);
  assert.match(out, /window_start/);
  assert.match(out, /7.5000/);
});
