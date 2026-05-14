const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const root = path.join(__dirname, "..");

// Dev fixture keys only. These are not protocol operator keys.
const DEVICE_KEYS = {
  "TW-TY-0001": "0x59c6995e998f97a5a0044966f0945384dca7c37fbd5aebd30dcdcc78e9d6b5b5",
  "TW-TY-0002": "0x5de4111afa1a4b9344f37b0e48239d77de3aef79b33b7e7e58a3f5905ed3b116",
};

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function readingPayload(reading) {
  return {
    curtailed_kwh: reading.curtailed_kwh,
    export_kwh: reading.export_kwh,
    generation_kwh: reading.generation_kwh,
    meter_id: reading.meter_id,
    nonce: reading.nonce,
    quality_score: reading.quality_score,
    site_id: reading.site_id,
    site_load_kwh: reading.site_load_kwh,
    source: reading.source,
    window_end: reading.window_end,
    window_start: reading.window_start,
  };
}

function payloadHash(reading) {
  return ethers.keccak256(ethers.toUtf8Bytes(stableStringify(readingPayload(reading))));
}

async function signReading(reading) {
  const key = DEVICE_KEYS[reading.meter_id];
  if (!key) {
    return {
      ...reading,
      payload_hash: ethers.id(`unsigned:${reading.meter_id}:${reading.nonce}`),
      signature: "0x",
    };
  }
  const wallet = new ethers.Wallet(key);
  const hash = payloadHash(reading);
  return {
    ...reading,
    payload_hash: hash,
    signature: await wallet.signMessage(ethers.getBytes(hash)),
  };
}

async function main() {
  const registry = {
    schema: "SPK_METER_REGISTRY_V1",
    generated_at: new Date().toISOString(),
    meters: [
      {
        meter_id: "TW-TY-0001",
        site_id: "taoyuan-rooftop-a",
        device_address: new ethers.Wallet(DEVICE_KEYS["TW-TY-0001"]).address,
        capacity_kw: 120,
        active_after: "2026-01-01T00:00:00Z",
        active_until: "2027-01-01T00:00:00Z",
      },
      {
        meter_id: "TW-TY-0002",
        site_id: "taoyuan-rooftop-b",
        device_address: new ethers.Wallet(DEVICE_KEYS["TW-TY-0002"]).address,
        capacity_kw: 110,
        active_after: "2026-01-01T00:00:00Z",
        active_until: "2027-01-01T00:00:00Z",
      },
    ],
  };

  const baseReadings = [
    {
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
    },
    {
      meter_id: "TW-TY-0002",
      site_id: "taoyuan-rooftop-b",
      window_start: "2026-02-11T00:00:00Z",
      window_end: "2026-02-11T23:59:59Z",
      generation_kwh: 1705,
      site_load_kwh: 518.8,
      export_kwh: 946.2,
      curtailed_kwh: 240,
      quality_score: 0.95,
      source: "edge_meter_gateway_v1",
      nonce: "TW-TY-0002:2026-02-11",
    },
    {
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
    },
    {
      meter_id: "TW-TY-0002",
      site_id: "taoyuan-rooftop-b",
      window_start: "2026-02-12T00:00:00Z",
      window_end: "2026-02-12T23:59:59Z",
      generation_kwh: 1300,
      site_load_kwh: 500,
      export_kwh: 650,
      curtailed_kwh: 150,
      quality_score: 0.7,
      source: "edge_meter_gateway_v1",
      nonce: "TW-TY-0002:2026-02-12",
    },
  ];

  const readings = await Promise.all(baseReadings.map(signReading));
  const payload = {
    schema: "SPK_RAW_METER_READINGS_V1",
    generated_at: new Date().toISOString(),
    batch_id: "batch_2026_02_12_a",
    min_quality_threshold: 0.9,
    readings,
  };

  const registryPath = path.join(root, "data", "attestations", "meter_registry.json");
  const readingsPath = path.join(root, "data", "attestations", "raw_meter_readings.json");
  fs.mkdirSync(path.dirname(registryPath), { recursive: true });
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n", "utf-8");
  fs.writeFileSync(readingsPath, JSON.stringify(payload, null, 2) + "\n", "utf-8");

  console.log(`wrote: ${registryPath}`);
  console.log(`wrote: ${readingsPath}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = {
  DEVICE_KEYS,
  payloadHash,
  readingPayload,
  signReading,
  stableStringify,
};
