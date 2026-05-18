const assert = require("node:assert/strict");
const test = require("node:test");

const {
  buildHardwareProvenanceModel,
  evaluateLevel,
  inferCurrentLevel,
  toCsv,
} = require("../scripts/hardware_provenance_model");

test("current sample adapter remains public-lab only", () => {
  const report = buildHardwareProvenanceModel({
    adapterPath: "state/product/inverter_meter_adapter_receipt.json",
    generatedAt: new Date("2026-05-18T00:00:00Z"),
  });

  assert.equal(report.current_hardware_level, "L0");
  assert.equal(report.launch_decision.public_lab, "acceptable_for_testnet_and_demo");
  assert.equal(report.launch_decision.closed_pilot, "blocked_until_real_operator_L2_or_better_evidence");
  assert.equal(report.thresholds.current_real_value_kwh_cap, 0);
});

test("real operator inverter source infers L2 closed-pilot candidate", () => {
  const level = inferCurrentLevel({
    source: {
      provider: "fronius-powerflow",
      interval_method: "E_Total_delta_plus_average_powerflow_for_load_export",
    },
    hardware_provenance: {
      real_operator_source: true,
    },
  });

  assert.equal(level, "L2");
});

test("risk haircut and cap are applied deterministically", () => {
  const level = evaluateLevel(
    {
      id: "TX",
      real_value_haircut_pct: 30,
      max_real_value_kwh_per_day: 100,
      measurement_uncertainty_pct: 2,
    },
    200
  );

  assert.equal(level.simulation.risk_reserve_kwh, 60);
  assert.equal(level.simulation.risk_adjusted_real_value_kwh, 100);
  assert.equal(level.simulation.capped_out_kwh, 40);
  assert.equal(level.simulation.measurement_uncertainty_band_kwh, 4);
});

test("CSV export includes every hardware tier", () => {
  const report = buildHardwareProvenanceModel({
    adapterPath: "state/product/inverter_meter_adapter_receipt.json",
    generatedAt: new Date("2026-05-18T00:00:00Z"),
  });
  const csv = toCsv(report);

  assert.match(csv, /"level","label","stage"/);
  assert.match(csv, /"L0","Adapter sample or fixture"/);
  assert.match(csv, /"L4","Utility or settlement-corroborated meter"/);
});
