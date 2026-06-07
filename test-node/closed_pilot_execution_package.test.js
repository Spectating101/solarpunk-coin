const assert = require("node:assert/strict");
const test = require("node:test");

const {
  buildPilotPackage,
  toCsv,
} = require("../scripts/closed_pilot_execution_package");

test("closed pilot package maps evidence tiers and external inputs without hiding L0 limits", () => {
  const report = buildPilotPackage({
    launchGate: "state/product/launch_gate.json",
    hardware: "state/product/hardware_provenance_model.json",
    economic: "state/product/economic_launch_readiness.json",
    inverter: "state/product/inverter_meter_adapter_receipt.json",
    keeper: "state/keeper_logs/summary.json",
    generatedAt: new Date("2026-05-18T00:00:00Z"),
  });

  assert.equal(report.current_decision.internal_execution_package_ready, true);
  assert.ok(report.current_decision.external_inputs_remaining >= 2);
  assert.equal(report.current_evidence.hardware_level, "L0");
  assert.equal(report.current_evidence.current_real_value_kwh_cap, 0);
  assert.match(report.no_excuse_boundary, /no undefined blockers/i);
  assert.ok(report.action_queue.some((item) => item.id === "maintain_research_demo"));
});

test("operator intake includes hardware, custody, and economics", () => {
  const report = buildPilotPackage({
    launchGate: "state/product/launch_gate.json",
    hardware: "state/product/hardware_provenance_model.json",
    economic: "state/product/economic_launch_readiness.json",
    inverter: "state/product/inverter_meter_adapter_receipt.json",
    keeper: "state/keeper_logs/summary.json",
  });
  const categories = report.operator_intake.map((item) => item.category);

  assert.ok(categories.includes("device_identity"));
  assert.ok(categories.includes("interval_counters"));
  assert.ok(categories.includes("signing_and_custody"));
  assert.ok(categories.includes("economics"));
});

test("action queue is commandable and exports to CSV", () => {
  const report = buildPilotPackage({
    launchGate: "state/product/launch_gate.json",
    hardware: "state/product/hardware_provenance_model.json",
    economic: "state/product/economic_launch_readiness.json",
    inverter: "state/product/inverter_meter_adapter_receipt.json",
    keeper: "state/keeper_logs/summary.json",
  });
  const actionIds = report.action_queue.map((item) => item.id);
  const csv = toCsv(report);

  assert.ok(actionIds.includes("collect_l2_operator_source"));
  assert.ok(actionIds.includes("run_operator_adapter"));
  assert.match(csv, /"id","owner","status"/);
  assert.match(csv, /collect_l2_operator_source/);
});
