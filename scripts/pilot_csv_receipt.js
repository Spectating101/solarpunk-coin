const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const { DEVICE_KEYS } = require("./build_signed_meter_fixture");
const { deriveBundle } = require("./derive_meter_attestations");
const { importCsvRows, parseCsv } = require("./import_meter_csv");

const ROOT = path.join(__dirname, "..");

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
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
}

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf-8");
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

function fixed(value, digits = 6) {
  if (!Number.isFinite(Number(value))) return null;
  return Number(Number(value).toFixed(digits));
}

function unixFromIso(value) {
  const millis = Date.parse(value);
  if (!Number.isFinite(millis)) throw new Error(`invalid timestamp: ${value}`);
  return Math.floor(millis / 1000);
}

function sourcePayloadFromBundle(bundle) {
  const accepted = bundle.accepted_attestations || [];
  const acceptedRecordHashes = accepted.map((row) => row.record_hash).sort();
  return {
    schema: "SPK_METER_SURPLUS_SOURCE_V1",
    batch_id: String(bundle.batch_id),
    min_quality_threshold: Number(bundle.min_quality_threshold),
    accepted_record_hashes: acceptedRecordHashes,
    rejected_record_count: Number(bundle.rejected_attestations?.length || 0),
    total_surplus_kwh: Number(bundle.summary?.total_surplus_kwh || 0),
  };
}

function mintPreviewFromBundle(bundle, options = {}) {
  const accepted = bundle.accepted_attestations || [];
  const totalSurplusKwh = Number(bundle.summary?.total_surplus_kwh || 0);
  const onchainSurplusKwh = Math.floor(totalSurplusKwh);
  const energyPrice = Number(options.energyPriceUsdPerKwh ?? 0.05);
  const mintFeeBps = Number(options.mintFeeBps ?? 10);
  const grossSpk = onchainSurplusKwh * energyPrice;
  const mintFeeSpk = grossSpk * (mintFeeBps / 10_000);
  const netSpk = grossSpk - mintFeeSpk;
  const sourcePayload = sourcePayloadFromBundle(bundle);
  const sourcePayloadJson = stableStringify(sourcePayload);

  return {
    source_payload: sourcePayload,
    source_hash: ethers.keccak256(ethers.toUtf8Bytes(sourcePayloadJson)),
    source_payload_json: sourcePayloadJson,
    onchain_surplus_kwh: onchainSurplusKwh,
    unminted_fractional_kwh: fixed(totalSurplusKwh - onchainSurplusKwh, 6),
    energy_price_usd_per_kwh: energyPrice,
    mint_fee_bps: mintFeeBps,
    gross_spk: fixed(grossSpk, 6),
    mint_fee_spk: fixed(mintFeeSpk, 6),
    net_spk: fixed(netSpk, 6),
    window_start: accepted.length ? Math.min(...accepted.map((row) => unixFromIso(row.window_start))) : null,
    window_end: accepted.length ? Math.max(...accepted.map((row) => unixFromIso(row.window_end))) : null,
    can_mint_from_receipt: accepted.length > 0 && onchainSurplusKwh > 0,
  };
}

function resolvePrivateKey(rows, options = {}) {
  if (options.privateKey) return options.privateKey;
  if (options.useDevFixtureKey) {
    const meterId = String(options.meterId || rows[0]?.meter_id || "TW-TY-0001");
    return DEVICE_KEYS[meterId] || null;
  }
  return null;
}

async function buildPilotCsvReceipt(options = {}) {
  const csvPath = path.resolve(ROOT, options.csvPath || "data/attestations/sample_meter_export.csv");
  const registryPath = path.resolve(ROOT, options.registryPath || "data/attestations/meter_registry.json");
  const csvText = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCsv(csvText);
  const registry = readJson(registryPath);
  const privateKey = resolvePrivateKey(rows, options);
  const unsigned = Boolean(options.unsigned || !privateKey);
  const sourceFile = path.relative(ROOT, csvPath);
  const payload = await importCsvRows(rows, registry, {
    privateKey,
    unsigned,
    meterId: options.meterId || "TW-TY-0001",
    siteId: options.siteId || "taoyuan-rooftop-a",
    source: options.source || "pilot_csv_receipt_v1",
    batchId: options.batchId || path.basename(csvPath, path.extname(csvPath)),
    minQuality: Number(options.minQuality ?? 0.9),
    sourceFile,
  });
  const now = options.now ? Math.floor(Date.parse(options.now) / 1000) : undefined;
  const bundle = deriveBundle(payload, registry, {
    now,
    minQuality: Number(options.minQuality ?? 0.9),
  });
  const mintPreview = mintPreviewFromBundle(bundle, {
    energyPriceUsdPerKwh: options.energyPriceUsdPerKwh ?? 0.05,
    mintFeeBps: options.mintFeeBps ?? 10,
  });
  const mode = unsigned
    ? "unsigned_review"
    : privateKey && options.useDevFixtureKey
      ? "dev_fixture_signed_sample"
      : "operator_signed";

  return {
    generated_at: (options.generatedAt || new Date()).toISOString(),
    title: "SolarPunk Pilot CSV Receipt",
    purpose:
      "Show that a meter or inverter CSV export can become signed raw readings, an accepted surplus bundle, a deterministic source hash, and an SPK mint preview.",
    execution_mode: mode,
    input: {
      csv_path: sourceFile,
      registry_path: path.relative(ROOT, registryPath),
      row_count: rows.length,
      meter_id: options.meterId || "TW-TY-0001",
      site_id: options.siteId || "taoyuan-rooftop-a",
      min_quality_threshold: Number(options.minQuality ?? 0.9),
      unsigned,
      private_key_written_to_repo: false,
    },
    raw_readings: payload,
    attestation_bundle: bundle,
    mint_preview: mintPreview,
    next_step_command: mintPreview.can_mint_from_receipt
      ? "Use the generated attestation bundle with scripts/mint_spk_from_meter_bundle.js against a local or governed Sepolia SPK stack."
      : "Fix rejected readings or provide a matching meter signature before attempting SPK minting.",
    hard_boundaries: [
      "This receipt does not certify hardware finality.",
      "A CSV export is pilot evidence only when the device key and operator custody are credible.",
      "Unsigned mode is useful for schema review but cannot mint SPK.",
      "A mint preview is not an on-chain mint; public proof still requires a transaction against an attestation-enabled SPK deployment.",
      "No private key is written to repo outputs.",
    ],
  };
}

function toMarkdown(receipt) {
  const lines = [];
  lines.push("# SolarPunk Pilot CSV Receipt");
  lines.push("");
  lines.push(`- generated_at: \`${receipt.generated_at}\``);
  lines.push(`- execution_mode: \`${receipt.execution_mode}\``);
  lines.push(`- csv_path: \`${receipt.input.csv_path}\``);
  lines.push(`- registry_path: \`${receipt.input.registry_path}\``);
  lines.push(`- meter_id: \`${receipt.input.meter_id}\``);
  lines.push(`- site_id: \`${receipt.input.site_id}\``);
  lines.push(`- unsigned: \`${receipt.input.unsigned}\``);
  lines.push(`- private_key_written_to_repo: \`${receipt.input.private_key_written_to_repo}\``);
  lines.push("");
  lines.push("## Purpose");
  lines.push("");
  lines.push(receipt.purpose);
  lines.push("");
  lines.push("## Attestation Result");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  lines.push(`| CSV rows | \`${receipt.input.row_count}\` |`);
  lines.push(`| Accepted readings | \`${receipt.attestation_bundle.summary.accepted_records}\` |`);
  lines.push(`| Rejected readings | \`${receipt.attestation_bundle.summary.rejected_records}\` |`);
  lines.push(`| Verified signatures | \`${receipt.attestation_bundle.summary.verified_signatures}\` |`);
  lines.push(`| Total surplus | \`${receipt.attestation_bundle.summary.total_surplus_kwh} kWh\` |`);
  lines.push("");
  lines.push("## Mint Preview");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  lines.push(`| Source hash | \`${receipt.mint_preview.source_hash}\` |`);
  lines.push(`| On-chain surplus | \`${receipt.mint_preview.onchain_surplus_kwh} kWh\` |`);
  lines.push(`| Energy price basis | \`$${receipt.mint_preview.energy_price_usd_per_kwh}/kWh\` |`);
  lines.push(`| Mint fee | \`${receipt.mint_preview.mint_fee_bps} bps\` |`);
  lines.push(`| Net SPK preview | \`${receipt.mint_preview.net_spk} SPK\` |`);
  lines.push(`| Can mint from receipt | \`${receipt.mint_preview.can_mint_from_receipt}\` |`);
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
  lines.push("## Next Step");
  lines.push("");
  lines.push(receipt.next_step_command);
  lines.push("");
  lines.push("## Hard Boundaries");
  lines.push("");
  for (const boundary of receipt.hard_boundaries) {
    lines.push(`- ${boundary}`);
  }
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const useDevFixtureKey = hasFlag("use-dev-fixture-key");
  const receipt = await buildPilotCsvReceipt({
    csvPath: getArg("csv", "data/attestations/sample_meter_export.csv"),
    registryPath: getArg("registry", "data/attestations/meter_registry.json"),
    meterId: getArg("meter-id", "TW-TY-0001"),
    siteId: getArg("site-id", "taoyuan-rooftop-a"),
    source: getArg("source", "pilot_csv_receipt_v1"),
    batchId: getArg("batch-id"),
    minQuality: Number(getArg("min-quality", "0.9")),
    energyPriceUsdPerKwh: Number(getArg("energy-price", "0.05")),
    mintFeeBps: Number(getArg("mint-fee-bps", "10")),
    now: getArg("now"),
    privateKey: getArg("private-key", process.env.METER_PRIVATE_KEY || null),
    unsigned: hasFlag("unsigned"),
    useDevFixtureKey,
  });

  const outJson = path.resolve(ROOT, getArg("out-json", "state/product/pilot_csv_receipt.json"));
  const outMd = path.resolve(ROOT, getArg("out-md", "docs/product/PILOT_CSV_RECEIPT.md"));
  const outRaw = path.resolve(ROOT, getArg("out-raw", "state/product/pilot_csv_raw_readings.json"));
  const outBundle = path.resolve(ROOT, getArg("out-bundle", "state/product/pilot_csv_attestation_bundle.json"));
  writeJson(outJson, receipt);
  writeJson(outRaw, receipt.raw_readings);
  writeJson(outBundle, receipt.attestation_bundle);
  writeText(outMd, toMarkdown(receipt));

  console.log(`execution_mode=${receipt.execution_mode}`);
  console.log(`accepted_records=${receipt.attestation_bundle.summary.accepted_records}`);
  console.log(`total_surplus_kwh=${receipt.attestation_bundle.summary.total_surplus_kwh}`);
  console.log(`net_spk_preview=${receipt.mint_preview.net_spk}`);
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
  buildPilotCsvReceipt,
  mintPreviewFromBundle,
  sourcePayloadFromBundle,
};
