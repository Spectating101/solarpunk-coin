const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  buildEconomicLaunchReadiness,
} = require("../scripts/economic_launch_readiness");

const ROOT = path.join(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
}

test("economic launch readiness converts empirical DSCR gaps into launch thresholds", () => {
  const report = buildEconomicLaunchReadiness({
    now: new Date("2026-05-17T00:00:00Z"),
  });

  assert.equal(report.threshold_rows.length, 3);
  assert.equal(report.launch_decision.public_lab, "economic_evidence_ready");
  assert.match(report.launch_decision.closed_pilot, /requires_anchor/);
  assert.ok(report.best_current_archetype.current_p50_dscr < report.input_basis.targets.p50_dscr);
  assert.ok(report.lowest_absolute_support_archetype.required_realized_value_usd_per_kwh > 0);
  assert.ok(report.best_scaled_archetype.required_realized_value_usd_per_kwh > 0);
  assert.ok(report.lowest_absolute_support_archetype.max_launch_capex_usd_per_wdc < report.lowest_absolute_support_archetype.current_capex_usd_per_wdc);
});

test("economic launch sensitivity includes viable mechanical paths but keeps current launch blocked", () => {
  const report = buildEconomicLaunchReadiness();

  assert.ok(report.sensitivity_summary.tested_rows > 100);
  assert.ok(report.sensitivity_summary.launch_ready_rows > 0);
  assert.equal(report.readiness.stage, "economic_evidence_ready_but_launch_terms_blocked");
  assert.ok(report.readiness.blockers.includes("project_finance_targets"));
  assert.ok(report.readiness.blockers.includes("protocol_fee_self_funding"));
});

test("generated economic launch artifact remains bounded", () => {
  const report = readJson("state/product/economic_launch_readiness.json");

  assert.ok(report.input_basis.empirical_days >= 365);
  assert.equal(report.launch_decision.paid_mainnet, "blocked_by_unit_economics_and_protocol_revenue");
  assert.ok(report.hard_boundaries.some((boundary) => boundary.includes("not a revenue promise")));
  assert.ok(report.launch_terms_required.some((term) => term.includes("tariff")));
});
