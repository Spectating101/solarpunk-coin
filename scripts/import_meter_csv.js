const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const { payloadHash } = require("./derive_meter_attestations");

const ROOT = path.join(__dirname, "..");
const REQUIRED_COLUMNS = [
  "window_start",
  "window_end",
  "generation_kwh",
  "site_load_kwh",
  "export_kwh",
  "curtailed_kwh",
  "quality_score",
];

function getArg(name, fallback = null) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
}

function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(cell);
      cell = "";
    } else {
      cell += char;
    }
  }

  if (quoted) {
    throw new Error("CSV quote was not closed");
  }
  cells.push(cell);
  return cells.map((value) => value.trim());
}

function parseCsv(csvText) {
  const lines = csvText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("#"));

  if (lines.length < 2) {
    throw new Error("CSV requires a header row and at least one data row");
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.trim());
  const rows = [];

  for (let index = 1; index < lines.length; index += 1) {
    const cells = parseCsvLine(lines[index]);
    if (cells.length !== headers.length) {
      throw new Error(`CSV row ${index + 1} has ${cells.length} cells, expected ${headers.length}`);
    }
    const row = {};
    headers.forEach((header, headerIndex) => {
      row[header] = cells[headerIndex];
    });
    rows.push(row);
  }

  return rows;
}

function numeric(row, field, index) {
  const parsed = Number(row[field]);
  if (!Number.isFinite(parsed)) {
    throw new Error(`row ${index + 1}: ${field} must be numeric`);
  }
  return parsed;
}

function timestamp(value, field, index) {
  const millis = Date.parse(value);
  if (!Number.isFinite(millis)) {
    throw new Error(`row ${index + 1}: ${field} must be an ISO-like timestamp`);
  }
  return new Date(millis).toISOString().replace(".000Z", "Z");
}

function defaultNonce(meterId, windowStart, index) {
  return `${meterId}:${timestamp(windowStart, "window_start", index)}:${index}`;
}

function registryByMeter(registry) {
  const map = new Map();
  for (const meter of registry.meters || []) {
    map.set(String(meter.meter_id), meter);
  }
  return map;
}

function normalizeReading(row, index, options = {}) {
  for (const field of REQUIRED_COLUMNS) {
    if (row[field] === undefined || row[field] === "") {
      throw new Error(`row ${index + 1}: missing required column ${field}`);
    }
  }

  const meterId = String(row.meter_id || options.meterId || "").trim();
  const siteId = String(row.site_id || options.siteId || "").trim();
  if (!meterId) throw new Error(`row ${index + 1}: meter_id required`);
  if (!siteId) throw new Error(`row ${index + 1}: site_id required`);

  const windowStart = timestamp(row.window_start, "window_start", index);
  const windowEnd = timestamp(row.window_end, "window_end", index);

  return {
    meter_id: meterId,
    site_id: siteId,
    window_start: windowStart,
    window_end: windowEnd,
    generation_kwh: numeric(row, "generation_kwh", index),
    site_load_kwh: numeric(row, "site_load_kwh", index),
    export_kwh: numeric(row, "export_kwh", index),
    curtailed_kwh: numeric(row, "curtailed_kwh", index),
    quality_score: numeric(row, "quality_score", index),
    source: String(row.source || options.source || "meter_csv_import_v1"),
    nonce: String(row.nonce || defaultNonce(meterId, windowStart, index)),
  };
}

function assertRegistryMatch(reading, registryMap, wallet, unsigned) {
  const meter = registryMap.get(reading.meter_id);
  if (!meter) {
    throw new Error(`meter ${reading.meter_id} is not registered`);
  }
  if (String(meter.site_id) !== reading.site_id) {
    throw new Error(`meter ${reading.meter_id} belongs to site ${meter.site_id}, not ${reading.site_id}`);
  }

  if (!unsigned && wallet.address.toLowerCase() !== String(meter.device_address).toLowerCase()) {
    throw new Error(
      `signer ${wallet.address} does not match registered device_address ${meter.device_address} for ${reading.meter_id}`
    );
  }
}

async function signReading(reading, wallet, unsigned = false) {
  const hash = payloadHash(reading);
  if (unsigned) {
    return {
      ...reading,
      payload_hash: hash,
      signature: "0x",
    };
  }
  return {
    ...reading,
    payload_hash: hash,
    signature: await wallet.signMessage(ethers.getBytes(hash)),
  };
}

async function importCsvRows(rows, registry, options = {}) {
  const registryMap = registryByMeter(registry);
  const unsigned = Boolean(options.unsigned);
  const privateKey = options.privateKey;
  const wallet = privateKey ? new ethers.Wallet(privateKey) : null;

  if (!unsigned && !wallet) {
    throw new Error("METER_PRIVATE_KEY or --private-key is required unless --unsigned is set");
  }

  const readings = [];
  for (const [index, row] of rows.entries()) {
    const reading = normalizeReading(row, index, options);
    assertRegistryMatch(reading, registryMap, wallet, unsigned);
    readings.push(await signReading(reading, wallet, unsigned));
  }

  return {
    schema: "SPK_RAW_METER_READINGS_V1",
    generated_at: new Date().toISOString(),
    batch_id: String(options.batchId || `csv_import_${Date.now()}`),
    min_quality_threshold: Number(options.minQuality ?? 0.9),
    import_adapter: {
      schema: "SPK_METER_CSV_IMPORT_V1",
      source_file: options.sourceFile || null,
      unsigned,
      signer_address: wallet ? wallet.address : null,
    },
    readings,
  };
}

async function main() {
  const csvPath = path.resolve(ROOT, getArg("csv", "data/attestations/sample_meter_export.csv"));
  const registryPath = path.resolve(ROOT, getArg("registry", "data/attestations/meter_registry.json"));
  const outPath = path.resolve(ROOT, getArg("out", "data/attestations/raw_meter_readings_from_csv.json"));
  const privateKey = getArg("private-key", process.env.METER_PRIVATE_KEY || null);

  const csvText = fs.readFileSync(csvPath, "utf-8");
  const registry = readJson(registryPath);
  const rows = parseCsv(csvText);
  const payload = await importCsvRows(rows, registry, {
    privateKey,
    unsigned: hasFlag("unsigned"),
    meterId: getArg("meter-id"),
    siteId: getArg("site-id"),
    source: getArg("source", "meter_csv_import_v1"),
    batchId: getArg("batch-id", path.basename(csvPath, path.extname(csvPath))),
    minQuality: Number(getArg("min-quality", "0.9")),
    sourceFile: path.relative(ROOT, csvPath),
  });

  writeJson(outPath, payload);
  console.log(`wrote: ${outPath}`);
  console.log(`readings: ${payload.readings.length}`);
  console.log(`signed: ${payload.import_adapter.unsigned ? "false" : "true"}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = {
  importCsvRows,
  normalizeReading,
  parseCsv,
};
