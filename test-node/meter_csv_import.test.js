const assert = require("node:assert/strict");
const test = require("node:test");
const { ethers } = require("ethers");
const { DEVICE_KEYS } = require("../scripts/build_signed_meter_fixture");
const { deriveBundle } = require("../scripts/derive_meter_attestations");
const { importCsvRows, parseCsv } = require("../scripts/import_meter_csv");

const NOW = Math.floor(Date.parse("2026-05-14T00:00:00Z") / 1000);
const DEVICE_WALLET = new ethers.Wallet(DEVICE_KEYS["TW-TY-0001"]);

function registry() {
  return {
    schema: "SPK_METER_REGISTRY_V1",
    meters: [
      {
        meter_id: "TW-TY-0001",
        site_id: "taoyuan-rooftop-a",
        device_address: DEVICE_WALLET.address,
        capacity_kw: 120,
        active_after: "2026-01-01T00:00:00Z",
        active_until: "2027-01-01T00:00:00Z",
      },
    ],
  };
}

function sampleRows() {
  return parseCsv(`window_start,window_end,generation_kwh,site_load_kwh,export_kwh,curtailed_kwh,quality_score,nonce
2026-02-12T00:00:00Z,2026-02-12T23:59:59Z,1420.4,390.1,845.3,185,0.97,TW-TY-0001:csv:2026-02-12
2026-02-13T00:00:00Z,2026-02-13T23:59:59Z,1315.8,360.6,781.2,174,0.96,TW-TY-0001:csv:2026-02-13
`);
}

test("imports signed CSV rows into the meter attestation pipeline", async () => {
  const payload = await importCsvRows(sampleRows(), registry(), {
    privateKey: DEVICE_KEYS["TW-TY-0001"],
    meterId: "TW-TY-0001",
    siteId: "taoyuan-rooftop-a",
    source: "solar_inverter_csv_v1",
    batchId: "csv_test_batch",
  });
  const bundle = deriveBundle(payload, registry(), { now: NOW });

  assert.equal(payload.schema, "SPK_RAW_METER_READINGS_V1");
  assert.equal(payload.readings.length, 2);
  assert.equal(bundle.summary.accepted_records, 2);
  assert.equal(bundle.summary.rejected_records, 0);
  assert.equal(bundle.summary.total_surplus_kwh, 1985.5);
});

test("rejects CSV import when signer does not match the registered meter", async () => {
  await assert.rejects(
    () =>
      importCsvRows(sampleRows(), registry(), {
        privateKey: DEVICE_KEYS["TW-TY-0002"],
        meterId: "TW-TY-0001",
        siteId: "taoyuan-rooftop-a",
      }),
    /does not match registered device_address/
  );
});

test("supports unsigned CSV review mode while keeping pipeline rejection explicit", async () => {
  const payload = await importCsvRows(sampleRows(), registry(), {
    unsigned: true,
    meterId: "TW-TY-0001",
    siteId: "taoyuan-rooftop-a",
  });
  const bundle = deriveBundle(payload, registry(), { now: NOW });

  assert.equal(payload.import_adapter.unsigned, true);
  assert.equal(bundle.summary.accepted_records, 0);
  assert.deepEqual(
    bundle.rejected_attestations.map((row) => row.reason),
    ["invalid meter signature", "invalid meter signature"]
  );
});

test("parses quoted CSV cells", () => {
  const rows = parseCsv(`window_start,source
2026-02-12T00:00:00Z,"gateway, site A"
`);

  assert.deepEqual(rows, [{ window_start: "2026-02-12T00:00:00Z", source: "gateway, site A" }]);
});
