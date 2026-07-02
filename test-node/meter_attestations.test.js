const assert = require("node:assert/strict");
const test = require("node:test");
const { ethers } = require("ethers");
const { DEVICE_KEYS, payloadHash, signReading } = require("../scripts/build_signed_meter_fixture");
const { deriveBundle } = require("../scripts/derive_meter_attestations");

const NOW = Math.floor(Date.parse("2026-05-14T00:00:00Z") / 1000);

function registry() {
  return {
    schema: "SPK_METER_REGISTRY_V1",
    meters: [
      {
        meter_id: "TW-TY-0001",
        site_id: "taoyuan-rooftop-a",
        device_address: new ethers.Wallet(DEVICE_KEYS["TW-TY-0001"]).address,
        capacity_kw: 120,
        location_country: "TW",
        grid_zone: "TW-TPC-NORTH",
        active_after: "2026-01-01T00:00:00Z",
        active_until: "2027-01-01T00:00:00Z",
      },
      {
        meter_id: "TW-TY-0002",
        site_id: "taoyuan-rooftop-b",
        device_address: new ethers.Wallet(DEVICE_KEYS["TW-TY-0002"]).address,
        capacity_kw: 110,
        location_country: "TW",
        grid_zone: "TW-TPC-NORTH",
        active_after: "2026-01-01T00:00:00Z",
        active_until: "2027-01-01T00:00:00Z",
      },
    ],
  };
}

function payload(readings) {
  return {
    schema: "SPK_RAW_METER_READINGS_V1",
    batch_id: "test_batch",
    min_quality_threshold: 0.9,
    readings,
  };
}

function baseReading(overrides = {}) {
  return {
    meter_id: "TW-TY-0001",
    site_id: "taoyuan-rooftop-a",
    window_start: "2026-02-11T00:00:00Z",
    window_end: "2026-02-11T23:59:59Z",
    generation_kwh: 1984.2,
    site_load_kwh: 563.7,
    export_kwh: 1100.5,
    curtailed_kwh: 320,
    quality_score: 0.98,
    source: "edge_meter_gateway_v1",
    nonce: "TW-TY-0001:2026-02-11",
    ...overrides,
  };
}

async function signed(overrides = {}) {
  return signReading(baseReading(overrides));
}

function reasons(bundle) {
  return bundle.rejected_attestations.map((row) => row.reason);
}

test("derives accepted surplus from valid signed meter readings", async () => {
  const readings = [
    await signed(),
    await signed({
      meter_id: "TW-TY-0002",
      site_id: "taoyuan-rooftop-b",
      generation_kwh: 1705,
      site_load_kwh: 518.8,
      export_kwh: 946.2,
      curtailed_kwh: 240,
      quality_score: 0.95,
      nonce: "TW-TY-0002:2026-02-11",
    }),
  ];

  const bundle = deriveBundle(payload(readings), registry(), { now: NOW });

  assert.equal(bundle.summary.input_records, 2);
  assert.equal(bundle.summary.accepted_records, 2);
  assert.equal(bundle.summary.rejected_records, 0);
  assert.equal(bundle.summary.verified_signatures, 2);
  assert.equal(bundle.summary.total_surplus_kwh, 2606.7);
});

test("v2 bundle carries regime metadata on accepted attestations", async () => {
  const bundle = deriveBundle(payload([await signed()]), registry(), { now: NOW });
  assert.equal(bundle.bundle_schema, "SPK_ATTESTATION_BUNDLE_V2");
  const row = bundle.accepted_attestations[0];
  assert.equal(row.location_country, "TW");
  assert.equal(row.grid_zone, "TW-TPC-NORTH");
  assert.equal(row.energy_vintage, "2026-02");
});

test("rejects duplicate meter nonces", async () => {
  const first = await signed();
  const duplicate = await signed();
  const bundle = deriveBundle(payload([first, duplicate]), registry(), { now: NOW });

  assert.equal(bundle.summary.accepted_records, 1);
  assert.deepEqual(reasons(bundle), ["duplicate meter nonce"]);
});

test("rejects readings below the quality threshold", async () => {
  const lowQuality = await signed({
    quality_score: 0.7,
    nonce: "TW-TY-0001:low-quality",
  });
  const bundle = deriveBundle(payload([lowQuality]), registry(), { now: NOW });

  assert.equal(bundle.summary.accepted_records, 0);
  assert.deepEqual(reasons(bundle), ["quality_score below threshold (0.9)"]);
});

test("rejects payload tampering after signing", async () => {
  const reading = await signed();
  reading.export_kwh = 1200.5;
  const bundle = deriveBundle(payload([reading]), registry(), { now: NOW });

  assert.equal(bundle.summary.accepted_records, 0);
  assert.deepEqual(reasons(bundle), ["payload_hash mismatch"]);
});

test("rejects signatures that do not match the registered meter key", async () => {
  const reading = await signed();
  reading.export_kwh = 1200.5;
  reading.payload_hash = payloadHash(reading);
  const bundle = deriveBundle(payload([reading]), registry(), { now: NOW });

  assert.equal(bundle.summary.accepted_records, 0);
  assert.deepEqual(reasons(bundle), ["signature does not match registered meter"]);
});

test("rejects measurement windows that have not closed", async () => {
  const future = await signed({
    window_start: "2026-06-01T00:00:00Z",
    window_end: "2026-06-01T23:59:59Z",
    nonce: "TW-TY-0001:future",
  });
  const bundle = deriveBundle(payload([future]), registry(), { now: NOW });

  assert.equal(bundle.summary.accepted_records, 0);
  assert.deepEqual(reasons(bundle), ["measurement window has not closed"]);
});

test("rejects energy-balance drift beyond tolerance", async () => {
  const drifted = await signed({
    generation_kwh: 2200,
    nonce: "TW-TY-0001:drift",
  });
  const bundle = deriveBundle(payload([drifted]), registry(), { now: NOW });

  assert.equal(bundle.summary.accepted_records, 0);
  assert.deepEqual(reasons(bundle), ["energy balance drift exceeds 2%"]);
});
