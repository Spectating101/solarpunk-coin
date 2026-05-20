const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  buildIntelligenceLayer,
  riskLabel,
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
  assert.equal(report.model.type, "capacity_scaled_nasa_pvwatts_baseline");
  assert.equal(report.scored_rows.length, 7);
  assert.equal(riskLabel(0.1), "normal");
  assert.equal(riskLabel(0.3), "review");
  assert.equal(riskLabel(0.8), "suspicious");
});

