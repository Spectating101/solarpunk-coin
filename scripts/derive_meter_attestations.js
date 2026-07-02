const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

function getArg(name, fallback = null) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
}

function toUtcIso(value) {
  const millis = Date.parse(value);
  if (!Number.isFinite(millis)) {
    throw new Error(`invalid timestamp: ${value}`);
  }
  return new Date(millis).toISOString().replace(".000Z", "+00:00");
}

function toUnix(value) {
  const millis = Date.parse(value);
  if (!Number.isFinite(millis)) {
    throw new Error(`invalid timestamp: ${value}`);
  }
  return Math.floor(millis / 1000);
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

function recordHash(record) {
  return crypto.createHash("sha256").update(stableStringify(record)).digest("hex");
}

function num(value, name) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${name} must be numeric`);
  }
  return parsed;
}

function registryByMeter(registry) {
  const map = new Map();
  for (const meter of registry.meters || []) {
    map.set(String(meter.meter_id), meter);
  }
  return map;
}

function validateReading(reading, index, meter, ctx) {
  if (!meter) {
    throw new Error("meter not registered");
  }
  if (String(reading.site_id) !== String(meter.site_id)) {
    throw new Error("site_id does not match meter registry");
  }

  const windowStart = toUnix(reading.window_start);
  const windowEnd = toUnix(reading.window_end);
  if (windowStart >= windowEnd) {
    throw new Error("invalid measurement window");
  }
  if (windowEnd > ctx.now) {
    throw new Error("measurement window has not closed");
  }
  if (meter.active_after && windowStart < toUnix(meter.active_after)) {
    throw new Error("reading before meter activation");
  }
  if (meter.active_until && windowEnd > toUnix(meter.active_until)) {
    throw new Error("reading after meter deactivation");
  }

  const nonceKey = `${reading.meter_id}:${reading.nonce}`;
  if (ctx.seenNonces.has(nonceKey)) {
    throw new Error("duplicate meter nonce");
  }
  const windowKey = `${reading.meter_id}:${toUtcIso(reading.window_start)}:${toUtcIso(reading.window_end)}`;
  if (ctx.seenWindows.has(windowKey)) {
    throw new Error("duplicate meter window");
  }

  const expectedHash = payloadHash(reading);
  if (String(reading.payload_hash).toLowerCase() !== expectedHash.toLowerCase()) {
    throw new Error("payload_hash mismatch");
  }
  let recovered;
  try {
    recovered = ethers.verifyMessage(ethers.getBytes(expectedHash), reading.signature);
  } catch {
    throw new Error("invalid meter signature");
  }
  if (recovered.toLowerCase() !== String(meter.device_address).toLowerCase()) {
    throw new Error("signature does not match registered meter");
  }

  const generation = num(reading.generation_kwh, "generation_kwh");
  const siteLoad = num(reading.site_load_kwh, "site_load_kwh");
  const exported = num(reading.export_kwh, "export_kwh");
  const curtailed = num(reading.curtailed_kwh, "curtailed_kwh");
  const quality = num(reading.quality_score, "quality_score");
  if (generation < 0 || siteLoad < 0 || exported < 0 || curtailed < 0) {
    throw new Error("energy fields must be non-negative");
  }
  if (quality < ctx.minQuality) {
    throw new Error(`quality_score below threshold (${ctx.minQuality})`);
  }
  if (quality > 1) {
    throw new Error("quality_score must be <= 1");
  }

  const measuredHours = (windowEnd - windowStart) / 3600;
  const maxGeneration = num(meter.capacity_kw, "capacity_kw") * measuredHours * 1.05;
  if (generation > maxGeneration) {
    throw new Error("generation exceeds capacity sanity bound");
  }

  const surplus = exported + curtailed;
  if (surplus <= 0) {
    throw new Error("derived surplus must be > 0");
  }
  if (surplus - generation > 1e-9) {
    throw new Error("surplus cannot exceed generation");
  }
  if (Math.abs(generation - siteLoad - exported - curtailed) > Math.max(0.001, generation * 0.02)) {
    throw new Error("energy balance drift exceeds 2%");
  }

  ctx.seenNonces.add(nonceKey);
  ctx.seenWindows.add(windowKey);

  const normalized = {
    meter_id: String(reading.meter_id),
    site_id: String(reading.site_id),
    window_start: toUtcIso(reading.window_start),
    window_end: toUtcIso(reading.window_end),
    surplus_kwh: Number(surplus.toFixed(6)),
    quality_score: Number(quality.toFixed(6)),
    source: String(reading.source),
    attestor: String(meter.device_address),
    device_address: String(meter.device_address),
    payload_hash: expectedHash,
    signature: String(reading.signature),
    location_country: String(meter.location_country || "TW"),
    grid_zone: String(meter.grid_zone || "unknown"),
    energy_vintage: String(meter.energy_vintage || toUtcIso(reading.window_end).slice(0, 7)),
  };
  normalized.record_hash = recordHash(normalized);
  return normalized;
}

function toMarkdown(bundle) {
  const lines = [];
  lines.push("# Meter Attestation Bundle");
  lines.push("");
  lines.push("Derived from signed raw meter readings and a meter registry.");
  lines.push("");
  lines.push(`- generated_at: \`${bundle.generated_at}\``);
  lines.push(`- batch_id: \`${bundle.batch_id}\``);
  lines.push(`- source_schema: \`${bundle.source_schema}\``);
  lines.push(`- min_quality_threshold: \`${bundle.min_quality_threshold}\``);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- input_records: \`${bundle.summary.input_records}\``);
  lines.push(`- accepted_records: \`${bundle.summary.accepted_records}\``);
  lines.push(`- rejected_records: \`${bundle.summary.rejected_records}\``);
  lines.push(`- verified_signatures: \`${bundle.summary.verified_signatures}\``);
  lines.push(`- total_surplus_kwh: \`${bundle.summary.total_surplus_kwh}\``);
  lines.push("");
  lines.push("## Accepted (meter_id, surplus_kwh, record_hash)");
  lines.push("");
  if (!bundle.accepted_attestations.length) {
    lines.push("- none");
  } else {
    for (const row of bundle.accepted_attestations) {
      lines.push(`- \`${row.meter_id}\` | \`${row.surplus_kwh}\` | \`${row.record_hash}\``);
    }
  }
  lines.push("");
  lines.push("## Rejected");
  lines.push("");
  if (!bundle.rejected_attestations.length) {
    lines.push("- none");
  } else {
    for (const row of bundle.rejected_attestations) {
      lines.push(`- index \`${row.index}\`, meter \`${row.meter_id || "unknown"}\`: ${row.reason}`);
    }
  }
  lines.push("");
  return lines.join("\n");
}

function deriveBundle(payload, registry, options = {}) {
  const meters = registryByMeter(registry);
  const minQuality = Number(options.minQuality ?? payload.min_quality_threshold ?? 0.9);
  const ctx = {
    minQuality,
    now: Number(options.now ?? Math.floor(Date.now() / 1000)),
    seenNonces: new Set(),
    seenWindows: new Set(),
  };

  const accepted = [];
  const rejected = [];
  for (const [index, reading] of (payload.readings || []).entries()) {
    try {
      accepted.push(validateReading(reading, index, meters.get(String(reading.meter_id)), ctx));
    } catch (error) {
      rejected.push({
        index,
        meter_id: reading && reading.meter_id ? String(reading.meter_id) : null,
        reason: error.message,
      });
    }
  }

  const totalSurplus = accepted.reduce((sum, row) => sum + Number(row.surplus_kwh), 0);
  return {
    generated_at: new Date().toISOString(),
    bundle_schema: "SPK_ATTESTATION_BUNDLE_V2",
    source_schema: payload.schema || "unknown",
    registry_schema: registry.schema || "unknown",
    batch_id: String(payload.batch_id || "unknown_batch"),
    min_quality_threshold: minQuality,
    summary: {
      input_records: Array.isArray(payload.readings) ? payload.readings.length : 0,
      accepted_records: accepted.length,
      rejected_records: rejected.length,
      verified_signatures: accepted.length,
      registered_meters: meters.size,
      total_surplus_kwh: Number(totalSurplus.toFixed(6)),
    },
    accepted_attestations: accepted,
    rejected_attestations: rejected,
  };
}

function main() {
  const root = path.join(__dirname, "..");
  const inputPath = path.resolve(root, getArg("input", "data/attestations/raw_meter_readings.json"));
  const registryPath = path.resolve(root, getArg("registry", "data/attestations/meter_registry.json"));
  const outJson = path.resolve(root, getArg("out-json", "state/attestations/latest_attestation_bundle.json"));
  const outMd = path.resolve(root, getArg("out-md", "docs/project/METER_ATTESTATION_BUNDLE.md"));

  if (!fs.existsSync(inputPath) || !fs.existsSync(registryPath)) {
    throw new Error("Missing signed meter fixtures. Run: npm run attestations:fixture");
  }

  const payload = readJson(inputPath);
  const registry = readJson(registryPath);
  const bundle = deriveBundle(payload, registry);

  writeJson(outJson, bundle);
  fs.mkdirSync(path.dirname(outMd), { recursive: true });
  fs.writeFileSync(outMd, toMarkdown(bundle), "utf-8");
  console.log(`wrote: ${outJson}`);
  console.log(`wrote: ${outMd}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

module.exports = {
  deriveBundle,
  payloadHash,
  readingPayload,
  registryByMeter,
  stableStringify,
  toMarkdown,
  validateReading,
};
