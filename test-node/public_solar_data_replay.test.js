const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  buildPublicSolarDataReplay,
  parseAusgridDate,
  trimToHeader,
} = require("../scripts/public_solar_data_replay");

const ROOT = path.join(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
}

test("Ausgrid date parser treats public dataset dates as dd/mm/yyyy", () => {
  assert.equal(parseAusgridDate("1/07/2012"), "2012-07-01");
  assert.equal(parseAusgridDate("13/11/2012"), "2012-11-13");
});

test("trimToHeader removes the Ausgrid notes row", () => {
  const sample = fs.readFileSync(path.join(ROOT, "data/public/ausgrid_sample.csv"), "utf-8");
  const trimmed = trimToHeader(sample);
  assert.ok(trimmed.startsWith("Customer,Generator Capacity,Postcode"));
});

test("public solar replay converts historical rooftop data into SPK mint preview", async () => {
  const report = await buildPublicSolarDataReplay({
    csvPath: "data/public/ausgrid_sample.csv",
    generatedAt: new Date("2026-05-18T00:00:00Z"),
    now: "2026-05-18T00:00:00Z",
    days: 3,
  });

  assert.equal(report.replay_summary.accepted_days, 3);
  assert.equal(report.attestation_bundle.summary.accepted_records, 3);
  assert.equal(report.attestation_bundle.summary.rejected_records, 0);
  assert.equal(report.lab_signing_boundary.original_dataset_device_signatures_present, false);
  assert.equal(report.lab_signing_boundary.can_claim_live_hardware_provenance, false);
  assert.equal(report.mint_preview.can_mint_spk_from_bundle, true);
  assert.ok(report.replay_summary.total_export_surplus_kwh > 0);
  assert.ok(report.mint_preview.net_spk > 0);
});

test("generated public solar replay artifact keeps provenance boundary explicit", () => {
  const report = readJson("state/product/public_solar_data_replay.json");

  assert.equal(report.lab_signing_boundary.can_claim_live_hardware_provenance, false);
  assert.ok(report.hard_boundaries.includes("This is public historical data, not a live operator meter feed."));
});
