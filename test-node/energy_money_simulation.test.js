const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  buildEnergyMoneySimulation,
  observedResourceSeries,
  simulateDay,
} = require("../scripts/energy_money_simulation");

const ROOT = path.join(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
}

test("energy-money simulation uses observed keeper resource series when present", () => {
  const series = observedResourceSeries(
    {
      recent_runs: [
        { date: "2026-05-01", normalised_index: 0.8 },
        { date: "2026-05-02", normalised_index: 1.2 },
      ],
    },
    {}
  );

  assert.deepEqual(series.map((point) => point.date), ["2026-05-01", "2026-05-02"]);
  assert.equal(series[1].normalised_resource_index, 1.2);
  assert.match(series[0].source, /keeper_logs/);
});

test("daily simulation converts surplus into SPK and redemption claims", () => {
  const row = simulateDay({
    archetype: {
      id: "test",
      capacity_kw: 10,
      self_consumption_fraction: 0.5,
      redemption_fraction: 0.4,
      settlement_velocity: 2,
      delivery_shortfall_fraction: 0.1,
      operator_reserve_usd: 0,
    },
    point: { date: "2026-05-01", normalised_resource_index: 1 },
    baseDailyKwh10kw: 20,
    baseCapacityKw: 10,
    energyPrice: 0.05,
    mintFeeBps: 10,
    redemptionFeeBps: 10,
    settlementFeeBps: 0,
  });

  assert.equal(row.generation_kwh, 20);
  assert.equal(row.eligible_surplus_kwh, 10);
  assert.equal(row.net_minted_spk, 0.4995);
  assert.equal(row.settlement_volume_spk, 0.999);
  assert.equal(row.redeemed_spk, 0.1998);
  assert.equal(row.owed_kwh, 3.996);
  assert.equal(row.shortfall_kwh, 0.3996);
  assert.ok(row.additional_reserve_required_usd > 0);
});

test("energy-money simulation is conservation checked and explicitly bounded", () => {
  const report = buildEnergyMoneySimulation({
    now: new Date("2026-05-17T00:00:00Z"),
    resourceBenchmark: {
      solar: {
        production_estimate: { average_window_day_ac_kwh: 20 },
        standard_system: { system_kw_dc: 10 },
      },
    },
    energyStandard: {
      current_monetary_state: { energy_price_usd_per_kwh: 0.05 },
    },
    keeperSummary: {
      recent_runs: [
        { date: "2026-05-01", normalised_index: 1 },
        { date: "2026-05-02", normalised_index: 0.5 },
      ],
    },
  });

  assert.equal(report.input_basis.observed_days, 2);
  assert.equal(report.archetypes.length, 3);
  assert.equal(report.totals.conservation_pass, true);
  assert.ok(report.annualized_totals.issued_spk > report.totals.issued_spk);
  assert.ok(report.hard_boundaries.includes("This is a transparent simulation, not a claim of current real users or revenue."));
  assert.ok(report.hard_boundaries.some((boundary) => boundary.includes("accepted signed meter or inverter attestations")));
});

test("generated energy-money simulation artifact keeps simulation separate from proof", () => {
  const report = readJson("state/product/energy_money_simulation.json");

  assert.equal(report.totals.conservation_pass, true);
  assert.match(report.value_proposition, /energy-standard monetary framework/);
  assert.equal(report.input_basis.resource_signal_type.includes("real NASA POWER-derived"), true);
  assert.ok(report.hard_boundaries.some((boundary) => boundary.includes("self-consumption")));
});
