const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  buildOperatorDataIntake,
  inferProvenance,
  normalizeOperatorRow,
} = require("../scripts/operator_data_intake");

const ROOT = path.join(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
}

test("operator data intake converts a sample solar CSV into SPK mint preview", async () => {
  const report = await buildOperatorDataIntake({
    now: "2026-05-19T00:00:00Z",
    generatedAt: new Date("2026-05-19T00:00:00Z"),
    useDevFixtureKey: true,
  });

  assert.equal(report.validation_summary.accepted_records, 7);
  assert.equal(report.validation_summary.rejected_records, 0);
  assert.equal(report.validation_summary.total_generation_kwh, 235.7);
  assert.equal(report.validation_summary.total_eligible_surplus_kwh, 103.8);
  assert.equal(report.mint_preview.onchain_surplus_kwh, 103);
  assert.equal(report.mint_preview.net_spk, 5.14485);
  assert.equal(report.mint_preview.can_mint_spk_from_bundle, true);
  assert.equal(report.provenance_assessment.level, "L0");
  assert.equal(report.provenance_assessment.closed_pilot_ready, false);
  assert.equal(report.input.private_key_written_to_repo, false);
});

test("operator data intake unsigned mode is review-only", async () => {
  const report = await buildOperatorDataIntake({
    now: "2026-05-19T00:00:00Z",
    generatedAt: new Date("2026-05-19T00:00:00Z"),
    unsigned: true,
  });

  assert.equal(report.input.unsigned, true);
  assert.equal(report.validation_summary.accepted_records, 0);
  assert.equal(report.mint_preview.can_mint_spk_from_bundle, false);
});

test("operator normalization derives solar self-consumed load from gross consumption and export", () => {
  const row = normalizeOperatorRow(
    {
      window_start: "2026-05-01T00:00:00Z",
      window_end: "2026-05-01T23:59:59Z",
      production_kwh: "30",
      gross_consumption_kwh: "42",
      grid_export_kwh: "8",
      curtailment_kwh: "0",
      data_quality: "0.97",
    },
    0,
    {
      meter_id: "TW-TY-0001",
      site_id: "sample-rooftop-10kw",
      data_source: { kind: "operator_csv" },
    }
  );

  assert.equal(row.generation_kwh, 30);
  assert.equal(row.site_load_kwh, 22);
  assert.equal(row.export_kwh, 8);
  assert.equal(row.eligible_surplus_kwh, 8);
});

test("provenance inference does not upgrade sample data into pilot-ready evidence", () => {
  assert.equal(inferProvenance({ real_operator_source: false }, true), "L0");
  assert.equal(inferProvenance({ real_operator_source: false, provenance: { level: "L4" } }, true), "L0");
  assert.equal(inferProvenance({ real_operator_source: true }, true), "L1");
  assert.equal(inferProvenance({ real_operator_source: true, provenance: { live_api: true } }, true), "L2");
  assert.equal(inferProvenance({ real_operator_source: true, provenance: { utility_corroborated: true } }, true), "L4");
});

test("generated operator intake artifact keeps launch boundaries explicit", () => {
  const report = readJson("state/product/operator_data_intake.json");

  assert.equal(report.input.private_key_written_to_repo, false);
  assert.ok(report.hard_boundaries.includes("The sample file proves the intake mechanics, not a real external solar source."));
  assert.equal(report.launch_controls.requires_audit_legal_and_l4_for_paid_public_launch, true);
});
