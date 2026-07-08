const fs = require("fs");
const path = require("path");
const { setTimeout: sleep } = require("timers/promises");
const { ethers } = require("ethers");

const { DEVICE_KEYS } = require("./build_signed_meter_fixture");
const { deriveBundle, payloadHash } = require("./derive_meter_attestations");

const ROOT = path.join(__dirname, "..");

const OFFICIAL_REFERENCES = [
  {
    name: "Fronius Solar API JSON",
    url: "https://www.fronius.com/en/help-center/solar-energy/products/monitoring-control/solutions/open-interfaces/fronius-solar-api-json-",
    relevance: "Fronius states that the inverter or Datamanager exposes a local REST API and returns inverter, meter, and component data as JSON.",
  },
  {
    name: "SunSpec Modbus specifications",
    url: "https://sunspec.org/specifications/",
    relevance: "SunSpec Modbus is the broader open DER interoperability standard for inverters, meters, batteries, and trackers.",
  },
  {
    name: "SunSpec Information Model Reference",
    url: "https://sunspec.org/sunspec-information-model-reference-sunspec-alliance/",
    relevance: "SunSpec describes Modbus data points and information models for DER devices including inverters and meters.",
  },
];

function getArg(name, fallback = null) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) {
    if (fallback !== null) return fallback;
    throw new Error(`Missing JSON file: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
}

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf-8");
}

function fixed(value, digits = 6) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Number(parsed.toFixed(digits));
}

function number(value, field) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${field} must be numeric`);
  }
  return parsed;
}

function optionalNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toUtcIso(value, field) {
  const millis = Date.parse(value);
  if (!Number.isFinite(millis)) {
    throw new Error(`${field} must be an ISO-like timestamp`);
  }
  return new Date(millis).toISOString().replace(".000Z", "Z");
}

function toUnix(value) {
  const millis = Date.parse(value);
  if (!Number.isFinite(millis)) throw new Error(`invalid timestamp: ${value}`);
  return Math.floor(millis / 1000);
}

function registryByMeter(registry) {
  const map = new Map();
  for (const meter of registry.meters || []) {
    map.set(String(meter.meter_id), meter);
  }
  return map;
}

function normalizeCumulativeSnapshot(snapshot, options = {}) {
  const counters = snapshot.counters || {};
  return {
    schema: snapshot.schema || "SPK_CUMULATIVE_METER_SNAPSHOT_V1",
    provider: snapshot.provider || options.provider || "cumulative_meter_gateway_v1",
    captured_at: toUtcIso(snapshot.captured_at || snapshot.timestamp || options.capturedAt, "captured_at"),
    meter_id: String(options.meterId || snapshot.meter_id || "").trim(),
    site_id: String(options.siteId || snapshot.site_id || "").trim(),
    counters: {
      generation_kwh_total: number(counters.generation_kwh_total, "generation_kwh_total"),
      site_load_kwh_total: number(counters.site_load_kwh_total, "site_load_kwh_total"),
      export_kwh_total: number(counters.export_kwh_total, "export_kwh_total"),
      curtailed_kwh_total: number(counters.curtailed_kwh_total ?? 0, "curtailed_kwh_total"),
    },
    raw: snapshot,
  };
}

function assertSameIdentity(start, end, options = {}) {
  const meterId = String(options.meterId || end.meter_id || start.meter_id || "").trim();
  const siteId = String(options.siteId || end.site_id || start.site_id || "").trim();
  if (!meterId) throw new Error("meter_id required");
  if (!siteId) throw new Error("site_id required");
  if (start.meter_id && end.meter_id && start.meter_id !== end.meter_id) {
    throw new Error("start and end snapshots use different meter_id values");
  }
  if (start.site_id && end.site_id && start.site_id !== end.site_id) {
    throw new Error("start and end snapshots use different site_id values");
  }
  return { meterId, siteId };
}

function delta(endValue, startValue, field) {
  const result = number(endValue, `${field}.end`) - number(startValue, `${field}.start`);
  if (result < -1e-9) {
    throw new Error(`${field} counter moved backwards`);
  }
  return fixed(Math.max(0, result), 6);
}

function buildReadingFromCumulativeSnapshots(startRaw, endRaw, options = {}) {
  const start = normalizeCumulativeSnapshot(startRaw, options);
  const end = normalizeCumulativeSnapshot(endRaw, options);
  const { meterId, siteId } = assertSameIdentity(start, end, options);
  const windowStart = toUtcIso(start.captured_at, "window_start");
  const windowEnd = toUtcIso(end.captured_at, "window_end");
  if (toUnix(windowStart) >= toUnix(windowEnd)) {
    throw new Error("end snapshot must be after start snapshot");
  }

  const reading = {
    meter_id: meterId,
    site_id: siteId,
    window_start: windowStart,
    window_end: windowEnd,
    generation_kwh: delta(end.counters.generation_kwh_total, start.counters.generation_kwh_total, "generation_kwh_total"),
    site_load_kwh: delta(end.counters.site_load_kwh_total, start.counters.site_load_kwh_total, "site_load_kwh_total"),
    export_kwh: delta(end.counters.export_kwh_total, start.counters.export_kwh_total, "export_kwh_total"),
    curtailed_kwh: delta(end.counters.curtailed_kwh_total, start.counters.curtailed_kwh_total, "curtailed_kwh_total"),
    quality_score: number(options.qualityScore ?? endRaw.quality_score ?? 0.97, "quality_score"),
    source: String(options.source || `${end.provider}_interval_v1`),
    nonce: String(options.nonce || `${meterId}:inverter:${windowStart}:${windowEnd}`),
  };

  return {
    reading,
    source: {
      provider: end.provider,
      mode: options.provider === "sample-cumulative" ? "sample_cumulative_snapshot_pair" : "operator_cumulative_snapshot_pair",
      evidence_grade: options.realOperatorSource ? "operator_meter_or_inverter_export" : "adapter_sample_or_review",
      interval_method: "cumulative_counter_delta",
      start_snapshot: start.raw,
      end_snapshot: end.raw,
    },
  };
}

function froniusData(raw) {
  return raw.Body?.Data || {};
}

function froniusTimestamp(raw, fallback) {
  return toUtcIso(raw.Head?.Timestamp || raw.timestamp || fallback, "fronius timestamp");
}

function froniusProductionWh(raw) {
  const data = froniusData(raw);
  const siteTotal = optionalNumber(data.Site?.E_Total);
  if (siteTotal !== null) return siteTotal;

  const inverters = data.Inverters || {};
  const totals = Object.values(inverters)
    .map((item) => optionalNumber(item.E_Total))
    .filter((value) => value !== null);
  if (totals.length) return totals.reduce((sum, value) => sum + value, 0);
  throw new Error("Fronius payload has no Site.E_Total or inverter E_Total value");
}

function froniusPower(raw) {
  const site = froniusData(raw).Site || {};
  const pPv = optionalNumber(site.P_PV);
  const pLoad = optionalNumber(site.P_Load);
  const pGrid = optionalNumber(site.P_Grid);
  return {
    pv_w: pPv === null ? 0 : Math.max(0, pPv),
    load_w: pLoad === null ? 0 : Math.abs(pLoad),
    export_w: pGrid === null ? 0 : Math.max(0, -pGrid),
    raw_grid_w: pGrid,
  };
}

function buildReadingFromFroniusPowerflow(startRaw, endRaw, options = {}) {
  const windowStart = froniusTimestamp(startRaw, options.windowStart);
  const windowEnd = froniusTimestamp(endRaw, options.windowEnd);
  const seconds = toUnix(windowEnd) - toUnix(windowStart);
  if (seconds <= 0) throw new Error("Fronius end payload must be after start payload");

  const generationKwh = fixed((froniusProductionWh(endRaw) - froniusProductionWh(startRaw)) / 1000, 6);
  if (generationKwh < 0) throw new Error("Fronius production counter moved backwards");

  const startPower = froniusPower(startRaw);
  const endPower = froniusPower(endRaw);
  const hours = seconds / 3600;
  const siteLoadKwh = fixed(((startPower.load_w + endPower.load_w) / 2) * hours / 1000, 6);
  const exportKwh = fixed(((startPower.export_w + endPower.export_w) / 2) * hours / 1000, 6);
  const curtailedKwh = number(options.curtailedKwh ?? 0, "curtailed_kwh");
  const meterId = String(options.meterId || "").trim();
  const siteId = String(options.siteId || "").trim();
  if (!meterId) throw new Error("meter_id required");
  if (!siteId) throw new Error("site_id required");

  return {
    reading: {
      meter_id: meterId,
      site_id: siteId,
      window_start: windowStart,
      window_end: windowEnd,
      generation_kwh: generationKwh,
      site_load_kwh: siteLoadKwh,
      export_kwh: exportKwh,
      curtailed_kwh: fixed(curtailedKwh, 6),
      quality_score: number(options.qualityScore ?? 0.82, "quality_score"),
      source: String(options.source || "fronius_powerflow_interval_v1"),
      nonce: String(options.nonce || `${meterId}:fronius:${windowStart}:${windowEnd}`),
    },
    source: {
      provider: "fronius_powerflow_v1",
      mode: options.host ? "live_fronius_host" : "fronius_powerflow_file_pair",
      evidence_grade: options.realOperatorSource ? "operator_inverter_api_interval" : "adapter_sample_or_review",
      interval_method: "E_Total_delta_plus_average_powerflow_for_load_export",
      sign_convention: "This adapter treats negative P_Grid as export, matching common Fronius PowerFlow examples; operators must confirm site sign convention before production use.",
      start_power_w: startPower,
      end_power_w: endPower,
      start_payload: startRaw,
      end_payload: endRaw,
    },
  };
}

async function fetchJson(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status} from ${url}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchFroniusPair(options = {}) {
  const host = String(options.host || "").replace(/^https?:\/\//, "").replace(/\/+$/, "");
  if (!host) throw new Error("--host is required for live Fronius mode");
  const sampleSeconds = Number(options.sampleSeconds ?? 60);
  if (!Number.isFinite(sampleSeconds) || sampleSeconds < 0) {
    throw new Error("--sample-seconds must be a non-negative number");
  }
  const url = `http://${host}/solar_api/v1/GetPowerFlowRealtimeData.fcgi`;
  const start = await fetchJson(url, Number(options.timeoutMs ?? 8000));
  if (sampleSeconds > 0) await sleep(sampleSeconds * 1000);
  const end = await fetchJson(url, Number(options.timeoutMs ?? 8000));
  return { start, end };
}

async function buildReadingForProvider(options = {}) {
  const provider = options.provider || "sample-cumulative";
  if (provider === "sample-cumulative" || provider === "cumulative-json") {
    const startPath = path.resolve(ROOT, options.startPath || "data/inverter/sample_cumulative_start.json");
    const endPath = path.resolve(ROOT, options.endPath || "data/inverter/sample_cumulative_end.json");
    return buildReadingFromCumulativeSnapshots(readJson(startPath), readJson(endPath), {
      ...options,
      provider,
    });
  }

  if (provider === "fronius-powerflow") {
    const pair = options.host
      ? await fetchFroniusPair(options)
      : {
          start: readJson(path.resolve(ROOT, options.startPath || "data/inverter/fronius_powerflow_start.json")),
          end: readJson(path.resolve(ROOT, options.endPath || "data/inverter/fronius_powerflow_end.json")),
        };
    return buildReadingFromFroniusPowerflow(pair.start, pair.end, options);
  }

  throw new Error(`Unsupported provider: ${provider}`);
}

function resolvePrivateKey(options = {}) {
  if (options.privateKey) return options.privateKey;
  if (options.useDevFixtureKey) return DEVICE_KEYS[options.meterId || "TW-TY-0001"] || null;
  const provider = options.provider || "sample-cumulative";
  if (
    !options.unsigned &&
    !options.privateKey &&
    provider === "sample-cumulative" &&
    DEVICE_KEYS[options.meterId || "TW-TY-0001"]
  ) {
    return DEVICE_KEYS[options.meterId || "TW-TY-0001"];
  }
  return null;
}

function assertRegistryMatch(reading, registry, wallet, unsigned) {
  const meter = registryByMeter(registry).get(reading.meter_id);
  if (!meter) throw new Error(`meter ${reading.meter_id} is not registered`);
  if (String(meter.site_id) !== reading.site_id) {
    throw new Error(`meter ${reading.meter_id} belongs to site ${meter.site_id}, not ${reading.site_id}`);
  }
  if (!unsigned && wallet.address.toLowerCase() !== String(meter.device_address).toLowerCase()) {
    throw new Error(
      `signer ${wallet.address} does not match registered device_address ${meter.device_address} for ${reading.meter_id}`
    );
  }
}

async function signReading(reading, registry, options = {}) {
  const privateKey = resolvePrivateKey(options);
  const unsigned = Boolean(options.unsigned || !privateKey);
  const wallet = privateKey ? new ethers.Wallet(privateKey) : null;
  assertRegistryMatch(reading, registry, wallet, unsigned);
  const hash = payloadHash(reading);

  if (unsigned) {
    return {
      signed: {
        ...reading,
        payload_hash: hash,
        signature: "0x",
      },
      unsigned,
      signer_address: null,
    };
  }

  return {
    signed: {
      ...reading,
      payload_hash: hash,
      signature: await wallet.signMessage(ethers.getBytes(hash)),
    },
    unsigned,
    signer_address: wallet.address,
  };
}

async function buildAdapterReceipt(options = {}) {
  const registryPath = path.resolve(ROOT, options.registryPath || "data/attestations/meter_registry.json");
  const registry = readJson(registryPath);
  const provider = options.provider || "sample-cumulative";
  const meterId = options.meterId || "TW-TY-0001";
  const siteId = options.siteId || "taoyuan-rooftop-a";
  const { reading, source } = await buildReadingForProvider({
    ...options,
    provider,
    meterId,
    siteId,
  });
  const signed = await signReading(reading, registry, {
    ...options,
    meterId,
  });
  const minQuality = Number(options.minQuality ?? (provider === "fronius-powerflow" ? 0.8 : 0.9));
  const generatedAt = (options.generatedAt || new Date()).toISOString();
  const payload = {
    schema: "SPK_RAW_METER_READINGS_V1",
    generated_at: generatedAt,
    batch_id: String(options.batchId || `${provider}_${Date.now()}`),
    min_quality_threshold: minQuality,
    import_adapter: {
      schema: "SPK_INVERTER_METER_ADAPTER_V1",
      provider,
      source_mode: source.mode,
      evidence_grade: source.evidence_grade,
      unsigned: signed.unsigned,
      signer_address: signed.signer_address,
    },
    readings: [signed.signed],
  };
  const now = options.now ? Math.floor(Date.parse(options.now) / 1000) : undefined;
  const bundle = deriveBundle(payload, registry, { now, minQuality });
  const acceptedSurplus = Number(bundle.summary?.total_surplus_kwh || 0);

  return {
    generated_at: generatedAt,
    title: "SolarPunk Inverter/Meter Adapter Output",
    purpose:
      "Normalize a meter or inverter interval into signed raw readings, then run the same attestation verifier used by SPK minting.",
    source: {
      provider,
      mode: source.mode,
      evidence_grade: source.evidence_grade,
      interval_method: source.interval_method,
      official_references: OFFICIAL_REFERENCES,
    },
    input: {
      registry_path: path.relative(ROOT, registryPath),
      meter_id: meterId,
      site_id: siteId,
      min_quality_threshold: minQuality,
      unsigned: signed.unsigned,
      private_key_written_to_repo: false,
    },
    normalized_reading: reading,
    raw_readings: payload,
    attestation_bundle: bundle,
    mint_readiness: {
      can_mint_from_adapter: bundle.summary.accepted_records > 0 && acceptedSurplus > 0,
      accepted_surplus_kwh: fixed(acceptedSurplus, 6),
      accepted_records: bundle.summary.accepted_records,
      rejected_records: bundle.summary.rejected_records,
    },
    hardware_provenance: {
      real_operator_source: Boolean(options.realOperatorSource),
      hardware_certified: false,
      custody_note: signed.unsigned
        ? "Unsigned adapter output is review-only and cannot mint SPK."
        : "The reading is signed by a registered meter key. Production still needs hardware or gateway key custody, tamper-evident logs, and operator identity controls.",
    },
    hard_boundaries: [
      "This adapter does not certify the physical meter or inverter by itself.",
      "Sample mode proves the integration path only; it is not a real operator source.",
      "Fronius PowerFlow mode uses local inverter API data but still needs operator custody and sign-convention validation before production minting.",
      "Production SPK minting should prefer cumulative meter/inverter counters over instantaneous power estimates.",
      "No private key is written to repo outputs.",
    ],
  };
}

function toMarkdown(receipt) {
  const lines = [];
  lines.push("# SolarPunk Inverter/Meter Adapter Output");
  lines.push("");
  lines.push(`- generated_at: \`${receipt.generated_at}\``);
  lines.push(`- provider: \`${receipt.source.provider}\``);
  lines.push(`- source_mode: \`${receipt.source.mode}\``);
  lines.push(`- evidence_grade: \`${receipt.source.evidence_grade}\``);
  lines.push(`- interval_method: \`${receipt.source.interval_method}\``);
  lines.push(`- meter_id: \`${receipt.input.meter_id}\``);
  lines.push(`- site_id: \`${receipt.input.site_id}\``);
  lines.push(`- unsigned: \`${receipt.input.unsigned}\``);
  lines.push(`- private_key_written_to_repo: \`${receipt.input.private_key_written_to_repo}\``);
  lines.push(`- real_operator_source: \`${receipt.hardware_provenance.real_operator_source}\``);
  lines.push("");
  lines.push("## Purpose");
  lines.push("");
  lines.push(receipt.purpose);
  lines.push("");
  lines.push("## Normalized Interval");
  lines.push("");
  lines.push("| Field | Value |");
  lines.push("|---|---:|");
  lines.push(`| Window start | \`${receipt.normalized_reading.window_start}\` |`);
  lines.push(`| Window end | \`${receipt.normalized_reading.window_end}\` |`);
  lines.push(`| Generation | \`${receipt.normalized_reading.generation_kwh} kWh\` |`);
  lines.push(`| Site load | \`${receipt.normalized_reading.site_load_kwh} kWh\` |`);
  lines.push(`| Export | \`${receipt.normalized_reading.export_kwh} kWh\` |`);
  lines.push(`| Curtailed | \`${receipt.normalized_reading.curtailed_kwh} kWh\` |`);
  lines.push(`| Quality score | \`${receipt.normalized_reading.quality_score}\` |`);
  lines.push("");
  lines.push("## Attestation Result");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  lines.push(`| Accepted readings | \`${receipt.attestation_bundle.summary.accepted_records}\` |`);
  lines.push(`| Rejected readings | \`${receipt.attestation_bundle.summary.rejected_records}\` |`);
  lines.push(`| Verified signatures | \`${receipt.attestation_bundle.summary.verified_signatures}\` |`);
  lines.push(`| Accepted surplus | \`${receipt.mint_readiness.accepted_surplus_kwh} kWh\` |`);
  lines.push(`| Can mint from adapter | \`${receipt.mint_readiness.can_mint_from_adapter}\` |`);
  lines.push("");
  lines.push("## Rejections");
  lines.push("");
  if (!receipt.attestation_bundle.rejected_attestations.length) {
    lines.push("- none");
  } else {
    for (const item of receipt.attestation_bundle.rejected_attestations) {
      lines.push(`- row \`${item.index}\`, meter \`${item.meter_id || "unknown"}\`: ${item.reason}`);
    }
  }
  lines.push("");
  lines.push("## Official Integration Anchors");
  lines.push("");
  for (const item of receipt.source.official_references) {
    lines.push(`- [${item.name}](${item.url}) - ${item.relevance}`);
  }
  lines.push("");
  lines.push("## Hard Boundaries");
  lines.push("");
  for (const boundary of receipt.hard_boundaries) {
    lines.push(`- ${boundary}`);
  }
  lines.push("");
  lines.push("## Real Inverter Command");
  lines.push("");
  lines.push("For a Fronius inverter on the same LAN:");
  lines.push("");
  lines.push("```bash");
  lines.push("METER_PRIVATE_KEY=0x... npm run meter:inverter-adapter -- \\");
  lines.push("  --provider=fronius-powerflow \\");
  lines.push("  --host=192.168.1.50 \\");
  lines.push("  --sample-seconds=300 \\");
  lines.push("  --meter-id=TW-TY-0001 \\");
  lines.push("  --site-id=taoyuan-rooftop-a \\");
  lines.push("  --real-operator-source");
  lines.push("```");
  lines.push("");
  lines.push("For cumulative counter exports from another inverter, gateway, or revenue meter:");
  lines.push("");
  lines.push("```bash");
  lines.push("METER_PRIVATE_KEY=0x... npm run meter:inverter-adapter -- \\");
  lines.push("  --provider=cumulative-json \\");
  lines.push("  --start=data/inverter/operator_start.json \\");
  lines.push("  --end=data/inverter/operator_end.json \\");
  lines.push("  --meter-id=OPERATOR-METER-001 \\");
  lines.push("  --site-id=operator-site-a \\");
  lines.push("  --real-operator-source");
  lines.push("```");
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const receipt = await buildAdapterReceipt({
    provider: getArg("provider", "sample-cumulative"),
    host: getArg("host"),
    startPath: getArg("start"),
    endPath: getArg("end"),
    registryPath: getArg("registry", "data/attestations/meter_registry.json"),
    meterId: getArg("meter-id", "TW-TY-0001"),
    siteId: getArg("site-id", "taoyuan-rooftop-a"),
    source: getArg("source"),
    nonce: getArg("nonce"),
    batchId: getArg("batch-id"),
    minQuality: getArg("min-quality") === null ? undefined : Number(getArg("min-quality")),
    qualityScore: getArg("quality-score") === null ? undefined : Number(getArg("quality-score")),
    sampleSeconds: getArg("sample-seconds") === null ? undefined : Number(getArg("sample-seconds")),
    timeoutMs: getArg("timeout-ms") === null ? undefined : Number(getArg("timeout-ms")),
    curtailedKwh: getArg("curtailed-kwh") === null ? undefined : Number(getArg("curtailed-kwh")),
    now: getArg("now"),
    privateKey: getArg("private-key", process.env.METER_PRIVATE_KEY || null),
    unsigned: hasFlag("unsigned"),
    useDevFixtureKey: hasFlag("use-dev-fixture-key"),
    realOperatorSource: hasFlag("real-operator-source"),
  });

  const outJson = path.resolve(ROOT, getArg("out-json", "state/product/inverter_meter_adapter_receipt.json"));
  const outRaw = path.resolve(ROOT, getArg("out-raw", "state/product/inverter_raw_readings.json"));
  const outBundle = path.resolve(ROOT, getArg("out-bundle", "state/product/inverter_attestation_bundle.json"));
  const outMd = path.resolve(ROOT, getArg("out-md", "docs/product/INVERTER_METER_ADAPTER.md"));
  writeJson(outJson, receipt);
  writeJson(outRaw, receipt.raw_readings);
  writeJson(outBundle, receipt.attestation_bundle);
  writeText(outMd, toMarkdown(receipt));

  console.log(`provider=${receipt.source.provider}`);
  console.log(`source_mode=${receipt.source.mode}`);
  console.log(`accepted_records=${receipt.attestation_bundle.summary.accepted_records}`);
  console.log(`accepted_surplus_kwh=${receipt.mint_readiness.accepted_surplus_kwh}`);
  console.log(`can_mint_from_adapter=${receipt.mint_readiness.can_mint_from_adapter}`);
  console.log(`wrote: ${outJson}`);
  console.log(`wrote: ${outMd}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  buildAdapterReceipt,
  buildReadingFromCumulativeSnapshots,
  buildReadingFromFroniusPowerflow,
  normalizeCumulativeSnapshot,
  toMarkdown,
};
