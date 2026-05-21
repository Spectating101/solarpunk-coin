const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  buildNrelTrainingBaseline,
  buildIntelligenceLayer,
  riskLabel,
  riskStatus,
  scoreReading,
} = require("../scripts/spk_intelligence_layer");

const ROOT = path.join(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
}

test("SPK intelligence layer scores operator data without becoming mint authority", () => {
  const report = readJson("state/product/spk_intelligence_layer.json");

  assert.equal(report.advisory_only, true);
  assert.equal(report.summary.rows_scored, 7);
  assert.equal(report.summary.overall_risk, "normal_public_lab_fixture");
  assert.equal(report.summary.provenance_level, "L0");
  assert.equal(report.summary.real_value_mint_allowed, false);
  assert.match(report.audit_dossier.contract_action_boundary, /contracts? decide/i);
  assert.equal(report.risk_profile.summary.readiness, "public_lab_only");
  assert.equal(report.adversarial_checks.all_caught, true);
  assert.equal(report.summary.nrel_training.available, true);
  assert.equal(report.summary.nrel_training.total_training_rows, 1095);
  assert.ok(report.scored_rows.every((row) => row.baseline_source === "nrel_pvwatts_month_day"));
});

test("SPK intelligence layer flags physically impossible claims", () => {
  const context = {
    capacity_kw: 10,
    expected_daily_kwh: 28,
    expected_low_multiplier: 0.65,
    expected_high_multiplier: 1.55,
    max_capacity_factor: 0.9,
  };
  const scored = scoreReading({
    window_start: "2026-05-01T00:00:00Z",
    generation_kwh: 300,
    export_kwh: 290,
    eligible_surplus_kwh: 290,
    quality_score: 0.99,
  }, context);

  assert.equal(scored.risk_label, "suspicious");
  assert.ok(scored.flags.includes("physical_or_energy_balance_violation"));
});

test("SPK intelligence layer can be regenerated from current product artifacts", () => {
  const report = buildIntelligenceLayer({ now: new Date("2026-05-21T00:00:00Z") });

  assert.equal(report.generated_at, "2026-05-21T00:00:00.000Z");
  assert.equal(report.model.type, "capacity_scaled_nasa_pvwatts_risk_stack");
  assert.match(report.model.training_baseline, /NREL\/PVWatts/);
  assert.equal(report.scored_rows.length, 7);
  assert.equal(report.forecast.horizon_days, 7);
  assert.equal(report.finance_readiness.closed_pilot_economic_status, "requires_anchor_tariff_ppa_capex_reduction_or_support_capital");
  assert.equal(riskLabel(0.1), "normal");
  assert.equal(riskLabel(0.3), "review");
  assert.equal(riskLabel(0.8), "suspicious");
  assert.equal(riskStatus(0.8), "blocked");
});

test("SPK intelligence layer summarizes NREL/PVWatts baseline for model training", () => {
  const baseline = buildNrelTrainingBaseline(readJson("state/product/nrel_solar_training_lab.json"));

  assert.equal(baseline.available, true);
  assert.equal(baseline.site_id, "taoyuan_10kw");
  assert.equal(baseline.rows, 365);
  assert.equal(baseline.total_training_rows, 1095);
  assert.ok(baseline.average_daily_ac_kwh > 30);
  assert.ok(baseline.by_month_day["05-01"].modeled_ac_kwh > 0);
});

test("SPK intelligence layer splits risk stack into distinct targets", () => {
  const report = readJson("state/product/spk_intelligence_layer.json");
  const categories = Object.fromEntries(report.risk_profile.categories.map((item) => [item.id, item]));

  assert.equal(categories.physical_plausibility.status, "normal");
  assert.equal(categories.data_quality.status, "normal");
  assert.equal(categories.hardware_provenance.status, "blocked");
  assert.equal(categories.economic_viability.status, "suspicious");
  assert.equal(categories.redemption_shortfall.status, "review");
  assert.equal(categories.pilot_readiness.status, "blocked");
});
