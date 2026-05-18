const assert = require("node:assert/strict");
const test = require("node:test");

const {
  buildAdapterReceipt,
  buildReadingFromCumulativeSnapshots,
  buildReadingFromFroniusPowerflow,
} = require("../scripts/inverter_meter_adapter");

const NOW = "2026-05-16T00:00:00Z";

test("sample cumulative inverter adapter feeds the signed attestation verifier", async () => {
  const receipt = await buildAdapterReceipt({
    provider: "sample-cumulative",
    meterId: "TW-TY-0001",
    siteId: "taoyuan-rooftop-a",
    useDevFixtureKey: true,
    now: NOW,
    batchId: "inverter_adapter_test",
    generatedAt: new Date("2026-05-16T00:00:00Z"),
  });

  assert.equal(receipt.raw_readings.schema, "SPK_RAW_METER_READINGS_V1");
  assert.equal(receipt.raw_readings.import_adapter.schema, "SPK_INVERTER_METER_ADAPTER_V1");
  assert.equal(receipt.attestation_bundle.summary.accepted_records, 1);
  assert.equal(receipt.attestation_bundle.summary.rejected_records, 0);
  assert.equal(receipt.attestation_bundle.summary.total_surplus_kwh, 996.2);
  assert.equal(receipt.mint_readiness.can_mint_from_adapter, true);
  assert.equal(receipt.hardware_provenance.real_operator_source, false);
});

test("unsigned inverter adapter output remains review-only", async () => {
  const receipt = await buildAdapterReceipt({
    provider: "sample-cumulative",
    meterId: "TW-TY-0001",
    siteId: "taoyuan-rooftop-a",
    unsigned: true,
    now: NOW,
    generatedAt: new Date("2026-05-16T00:00:00Z"),
  });

  assert.equal(receipt.attestation_bundle.summary.accepted_records, 0);
  assert.equal(receipt.attestation_bundle.summary.rejected_records, 1);
  assert.equal(receipt.attestation_bundle.rejected_attestations[0].reason, "invalid meter signature");
  assert.equal(receipt.mint_readiness.can_mint_from_adapter, false);
});

test("cumulative adapter rejects counters that move backwards", () => {
  const start = {
    captured_at: "2026-02-14T00:00:00Z",
    meter_id: "TW-TY-0001",
    site_id: "taoyuan-rooftop-a",
    counters: {
      generation_kwh_total: 100,
      site_load_kwh_total: 50,
      export_kwh_total: 30,
      curtailed_kwh_total: 20,
    },
  };
  const end = {
    captured_at: "2026-02-14T01:00:00Z",
    meter_id: "TW-TY-0001",
    site_id: "taoyuan-rooftop-a",
    counters: {
      generation_kwh_total: 99,
      site_load_kwh_total: 51,
      export_kwh_total: 31,
      curtailed_kwh_total: 20,
    },
  };

  assert.throws(() => buildReadingFromCumulativeSnapshots(start, end), /counter moved backwards/);
});

test("Fronius PowerFlow pair becomes an interval reading with explicit estimation method", () => {
  const start = require("../data/inverter/fronius_powerflow_start.json");
  const end = require("../data/inverter/fronius_powerflow_end.json");
  const result = buildReadingFromFroniusPowerflow(start, end, {
    meterId: "TW-TY-0001",
    siteId: "taoyuan-rooftop-a",
  });

  assert.equal(result.reading.generation_kwh, 5.2);
  assert.equal(result.reading.site_load_kwh, 2.8);
  assert.equal(result.reading.export_kwh, 2.4);
  assert.match(result.source.interval_method, /E_Total_delta/);
  assert.match(result.source.sign_convention, /negative P_Grid/);
});
