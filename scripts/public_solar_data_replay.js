const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const { DEVICE_KEYS } = require("./build_signed_meter_fixture");
const { importCsvRows, parseCsv } = require("./import_meter_csv");
const { deriveBundle } = require("./derive_meter_attestations");
const { mintPreviewFromBundle } = require("./pilot_csv_receipt");

const ROOT = path.join(__dirname, "..");

const DEFAULT_SOURCE = {
  dataset_name: "Ausgrid Solar home electricity data",
  official_page: "https://www.ausgrid.com.au/Industry/Our-Research/Data-to-share/Solar-home-electricity-data",
  data_gov_au: "https://data.gov.au/data/dataset/nsw-solar-home-electricty-data",
  pvdaq_systems_csv: "https://oedi-data-lake.s3.amazonaws.com/pvdaq/csv/systems_20250729.csv",
  sample_note:
    "The checked-in sample mirrors the public Ausgrid wide-row format for customer 1 over three historical days.",
};

const CATEGORY_GENERATION = "GG";
const CATEGORY_GENERAL_CONSUMPTION = "GC";
const CATEGORY_CONTROLLED_LOAD = "CL";
const TIME_COLUMN_PATTERN = /^\d{1,2}:\d{2}$/;

function getArg(name, fallback = null) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
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
  if (!Number.isFinite(Number(value))) return null;
  return Number(Number(value).toFixed(digits));
}

function sum(values) {
  return fixed(values.reduce((total, value) => total + Number(value || 0), 0), 6);
}

function average(values) {
  const valid = values.map(Number).filter(Number.isFinite);
  if (!valid.length) return null;
  return fixed(valid.reduce((total, value) => total + value, 0) / valid.length, 6);
}

function parseNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while fetching ${url}`);
  }
  return response.text();
}

function trimToHeader(csvText) {
  const lines = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const headerIndex = lines.findIndex((line) => line.startsWith("Customer,Generator Capacity,Postcode"));
  if (headerIndex < 0) {
    throw new Error("Ausgrid CSV header not found");
  }
  return lines.slice(headerIndex).join("\n");
}

function parseAusgridDate(value) {
  const match = String(value).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) throw new Error(`unsupported Ausgrid date: ${value}`);
  const [, day, month, year] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function timeColumnsFromRows(rows) {
  const first = rows[0] || {};
  return Object.keys(first).filter((key) => TIME_COLUMN_PATTERN.test(key));
}

function groupAusgridRows(rows, options = {}) {
  const customer = String(options.customer || "1");
  const groups = new Map();
  for (const row of rows) {
    if (String(row.Customer) !== customer) continue;
    const date = parseAusgridDate(row.date);
    const key = `${row.Customer}:${date}`;
    if (!groups.has(key)) {
      groups.set(key, {
        customer_id: String(row.Customer),
        generator_capacity_kw: parseNumber(row["Generator Capacity"]),
        postcode: String(row.Postcode),
        date,
        categories: {},
      });
    }
    groups.get(key).categories[String(row["Consumption Category"])] = row;
  }
  return Array.from(groups.values()).sort((a, b) => a.date.localeCompare(b.date));
}

function intervalValues(row, timeColumns) {
  return timeColumns.map((column) => parseNumber(row?.[column]));
}

function dailyReplayFromGroup(group, timeColumns, options = {}) {
  const generation = intervalValues(group.categories[CATEGORY_GENERATION], timeColumns);
  const generalConsumption = intervalValues(group.categories[CATEGORY_GENERAL_CONSUMPTION], timeColumns);
  const controlledLoad = intervalValues(group.categories[CATEGORY_CONTROLLED_LOAD], timeColumns);
  const includeControlledLoad = options.includeControlledLoad !== false;
  const load = generalConsumption.map((value, index) => (
    value + (includeControlledLoad ? Number(controlledLoad[index] || 0) : 0)
  ));
  const selfConsumed = generation.map((value, index) => Math.min(value, load[index]));
  const exported = generation.map((value, index) => Math.max(value - load[index], 0));
  const imported = load.map((value, index) => Math.max(value - generation[index], 0));

  const generationKwh = sum(generation);
  const selfConsumedKwh = sum(selfConsumed);
  const exportKwh = sum(exported);
  const importedGridKwh = sum(imported);
  const grossLoadKwh = sum(load);

  return {
    original_date: group.date,
    customer_id: group.customer_id,
    postcode: group.postcode,
    generator_capacity_kw: group.generator_capacity_kw,
    generation_kwh: generationKwh,
    gross_consumption_kwh: grossLoadKwh,
    solar_self_consumed_kwh: selfConsumedKwh,
    export_kwh: exportKwh,
    imported_grid_kwh: importedGridKwh,
    surplus_kwh: exportKwh,
    self_consumption_ratio: generationKwh > 0 ? fixed(selfConsumedKwh / generationKwh, 6) : 0,
    export_ratio: generationKwh > 0 ? fixed(exportKwh / generationKwh, 6) : 0,
    interval_count: timeColumns.length,
    quality_score: 0.93,
  };
}

function readingFromReplayDay(day, index, options = {}) {
  return {
    meter_id: options.meterId || "PUBLIC-AUSGRID-0001",
    site_id: options.siteId || "ausgrid-public-home-1",
    window_start: `${day.original_date}T00:00:00Z`,
    window_end: `${day.original_date}T23:59:59Z`,
    generation_kwh: day.generation_kwh,
    site_load_kwh: day.solar_self_consumed_kwh,
    export_kwh: day.export_kwh,
    curtailed_kwh: 0,
    quality_score: day.quality_score,
    source: "public_ausgrid_solar_replay_v1",
    nonce: `${options.meterId || "PUBLIC-AUSGRID-0001"}:ausgrid:${day.original_date}:${index}`,
    public_dataset_metadata: day,
  };
}

function buildReplayRegistry(readings, wallet, options = {}) {
  const capacityKw = Math.max(
    Number(options.capacityKw || 0),
    ...readings.map((reading) => Number(reading.public_dataset_metadata?.generator_capacity_kw || 0))
  );
  return {
    schema: "SPK_PUBLIC_SOLAR_REPLAY_REGISTRY_V1",
    generated_at: (options.generatedAt || new Date()).toISOString(),
    boundary:
      "Lab registry for public historical data replay. This does not represent original meter-device signatures from the public dataset.",
    meters: [
      {
        meter_id: options.meterId || "PUBLIC-AUSGRID-0001",
        site_id: options.siteId || "ausgrid-public-home-1",
        device_address: wallet.address,
        capacity_kw: fixed(capacityKw || 5, 3),
        active_after: "2010-01-01T00:00:00Z",
        active_until: "2035-01-01T00:00:00Z",
      },
    ],
  };
}

function readingsToCsvRows(readings) {
  return readings.map((reading) => ({
    window_start: reading.window_start,
    window_end: reading.window_end,
    generation_kwh: reading.generation_kwh,
    site_load_kwh: reading.site_load_kwh,
    export_kwh: reading.export_kwh,
    curtailed_kwh: reading.curtailed_kwh,
    quality_score: reading.quality_score,
    nonce: reading.nonce,
    source: reading.source,
  }));
}

function toDailyCsv(days) {
  const headers = [
    "date",
    "generation_kwh",
    "gross_consumption_kwh",
    "solar_self_consumed_kwh",
    "export_kwh",
    "imported_grid_kwh",
    "self_consumption_ratio",
    "export_ratio",
  ];
  const rows = days.map((day) => headers.map((header) => day[header === "date" ? "original_date" : header]).join(","));
  return `${headers.join(",")}\n${rows.join("\n")}\n`;
}

async function buildPublicSolarDataReplay(options = {}) {
  const csvText = options.csvText ||
    (options.csvUrl
      ? await fetchText(options.csvUrl)
      : readText(path.resolve(ROOT, options.csvPath || "data/public/ausgrid_sample.csv")));
  const rows = parseCsv(trimToHeader(csvText));
  const timeColumns = timeColumnsFromRows(rows);
  const grouped = groupAusgridRows(rows, { customer: options.customer || "1" });
  const requestedDays = Number(options.days || 3);
  const days = grouped
    .slice(0, requestedDays)
    .map((group) => dailyReplayFromGroup(group, timeColumns, options))
    .filter((day) => Number(day.export_kwh) > 0);
  if (!days.length) {
    throw new Error("public solar replay produced no surplus-export days");
  }

  const privateKey = options.privateKey || DEVICE_KEYS["TW-TY-0001"];
  const wallet = new ethers.Wallet(privateKey);
  const replayReadings = days.map((day, index) => readingFromReplayDay(day, index, options));
  const registry = buildReplayRegistry(replayReadings, wallet, options);
  const rawReadings = await importCsvRows(readingsToCsvRows(replayReadings), registry, {
    privateKey,
    meterId: options.meterId || "PUBLIC-AUSGRID-0001",
    siteId: options.siteId || "ausgrid-public-home-1",
    source: "public_ausgrid_solar_replay_v1",
    batchId: options.batchId || "public_ausgrid_customer_1_replay",
    minQuality: Number(options.minQuality ?? 0.9),
    sourceFile: options.csvUrl || options.csvPath || "data/public/ausgrid_sample.csv",
  });
  rawReadings.import_adapter = {
    ...rawReadings.import_adapter,
    schema: "SPK_PUBLIC_SOLAR_DATA_REPLAY_V1",
    provenance_status: "public_historical_dataset_lab_signed_replay",
    original_dataset_signatures_present: false,
  };

  const now = Math.floor(Date.parse(options.now || "2026-05-18T00:00:00Z") / 1000);
  const attestationBundle = deriveBundle(rawReadings, registry, {
    now,
    minQuality: Number(options.minQuality ?? 0.9),
  });
  const mintPreview = mintPreviewFromBundle(attestationBundle, {
    energyPriceUsdPerKwh: options.energyPriceUsdPerKwh ?? 0.05,
    mintFeeBps: options.mintFeeBps ?? 10,
  });
  const totalGeneration = sum(days.map((day) => day.generation_kwh));
  const totalExport = sum(days.map((day) => day.export_kwh));
  const totalLoad = sum(days.map((day) => day.gross_consumption_kwh));
  const totalSelfConsumed = sum(days.map((day) => day.solar_self_consumed_kwh));

  return {
    generated_at: (options.generatedAt || new Date()).toISOString(),
    title: "SolarPunk Public Solar Data Replay",
    plain_english:
      "This replays public historical rooftop-solar data through the SPK mint math. It proves the coin logic can ingest real-world solar profiles, but it is not a live meter proof.",
    source: {
      ...DEFAULT_SOURCE,
      csv_path: options.csvPath || "data/public/ausgrid_sample.csv",
      csv_url: options.csvUrl || null,
      customer_id: String(options.customer || "1"),
      original_window_start: days[0].original_date,
      original_window_end: days[days.length - 1].original_date,
    },
    replay_summary: {
      accepted_days: days.length,
      generator_capacity_kw: days[0].generator_capacity_kw,
      total_generation_kwh: totalGeneration,
      total_gross_consumption_kwh: totalLoad,
      total_solar_self_consumed_kwh: totalSelfConsumed,
      total_export_surplus_kwh: totalExport,
      average_export_ratio: average(days.map((day) => day.export_ratio)),
      accepted_records: attestationBundle.summary.accepted_records,
      rejected_records: attestationBundle.summary.rejected_records,
      verified_signatures: attestationBundle.summary.verified_signatures,
    },
    lab_signing_boundary: {
      original_dataset_device_signatures_present: false,
      lab_signature_used_for_replay: true,
      signer_address: wallet.address,
      can_claim_live_hardware_provenance: false,
      useful_for_spk_economic_model: true,
    },
    daily_replay: days,
    registry,
    raw_readings: rawReadings,
    attestation_bundle: attestationBundle,
    mint_preview: mintPreview,
    hard_boundaries: [
      "This is public historical data, not a live operator meter feed.",
      "The lab signs normalized rows only so the existing SPK verifier can replay the math.",
      "This cannot upgrade hardware provenance beyond public-lab evidence.",
      "SPK real-value minting still needs a named operator, live meter or inverter source, custody, and legal/commercial terms.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# SolarPunk Public Solar Data Replay");
  lines.push("");
  lines.push(report.plain_english);
  lines.push("");
  lines.push("## Source");
  lines.push("");
  lines.push(`- dataset: \`${report.source.dataset_name}\``);
  lines.push(`- official_page: ${report.source.official_page}`);
  lines.push(`- data_gov_au: ${report.source.data_gov_au}`);
  lines.push(`- original_window: \`${report.source.original_window_start}\` -> \`${report.source.original_window_end}\``);
  lines.push(`- customer_id: \`${report.source.customer_id}\``);
  lines.push("");
  lines.push("## Replay Result");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  lines.push(`| Accepted days | \`${report.replay_summary.accepted_days}\` |`);
  lines.push(`| Generator capacity | \`${report.replay_summary.generator_capacity_kw} kW\` |`);
  lines.push(`| Solar generation | \`${report.replay_summary.total_generation_kwh} kWh\` |`);
  lines.push(`| Export surplus | \`${report.replay_summary.total_export_surplus_kwh} kWh\` |`);
  lines.push(`| Self-consumed solar | \`${report.replay_summary.total_solar_self_consumed_kwh} kWh\` |`);
  lines.push(`| Average export ratio | \`${report.replay_summary.average_export_ratio}\` |`);
  lines.push(`| Accepted verifier records | \`${report.replay_summary.accepted_records}\` |`);
  lines.push(`| Verified lab signatures | \`${report.replay_summary.verified_signatures}\` |`);
  lines.push(`| Net SPK preview | \`${report.mint_preview.net_spk} SPK\` |`);
  lines.push(`| Can mint SPK in lab replay | \`${report.mint_preview.can_mint_spk_from_bundle}\` |`);
  lines.push("");
  lines.push("## Daily Replay");
  lines.push("");
  lines.push("| Date | Generation kWh | Export surplus kWh | Self-consumed kWh | Export ratio |");
  lines.push("|---|---:|---:|---:|---:|");
  for (const day of report.daily_replay) {
    lines.push(
      `| ${day.original_date} | ${day.generation_kwh} | ${day.export_kwh} | ${day.solar_self_consumed_kwh} | ${day.export_ratio} |`
    );
  }
  lines.push("");
  lines.push("## Boundary");
  lines.push("");
  for (const boundary of report.hard_boundaries) {
    lines.push(`- ${boundary}`);
  }
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const report = await buildPublicSolarDataReplay({
    csvPath: getArg("csv", "data/public/ausgrid_sample.csv"),
    csvUrl: getArg("csv-url"),
    customer: getArg("customer", "1"),
    days: Number(getArg("days", "3")),
    meterId: getArg("meter-id", "PUBLIC-AUSGRID-0001"),
    siteId: getArg("site-id", "ausgrid-public-home-1"),
    minQuality: Number(getArg("min-quality", "0.9")),
    energyPriceUsdPerKwh: Number(getArg("energy-price", "0.05")),
    mintFeeBps: Number(getArg("mint-fee-bps", "10")),
    now: getArg("now", "2026-05-18T00:00:00Z"),
    generatedAt: getArg("generated-at") ? new Date(getArg("generated-at")) : undefined,
    privateKey: getArg("private-key") || (hasFlag("use-dev-fixture-key") ? DEVICE_KEYS["TW-TY-0001"] : DEVICE_KEYS["TW-TY-0001"]),
  });

  const outJson = path.resolve(ROOT, getArg("out-json", "state/product/public_solar_data_replay.json"));
  const outRaw = path.resolve(ROOT, getArg("out-raw", "state/product/public_solar_data_raw_readings.json"));
  const outBundle = path.resolve(ROOT, getArg("out-bundle", "state/product/public_solar_data_attestation_bundle.json"));
  const outCsv = path.resolve(ROOT, getArg("out-csv", "state/product/public_solar_data_replay_daily.csv"));
  const outMd = path.resolve(ROOT, getArg("out-md", "docs/product/PUBLIC_SOLAR_DATA_REPLAY.md"));
  writeJson(outJson, report);
  writeJson(outRaw, report.raw_readings);
  writeJson(outBundle, report.attestation_bundle);
  writeText(outCsv, toDailyCsv(report.daily_replay));
  writeText(outMd, toMarkdown(report));

  console.log(`accepted_days=${report.replay_summary.accepted_days}`);
  console.log(`export_surplus_kwh=${report.replay_summary.total_export_surplus_kwh}`);
  console.log(`net_spk_preview=${report.mint_preview.net_spk}`);
  console.log(`wrote: ${outJson}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  buildPublicSolarDataReplay,
  dailyReplayFromGroup,
  groupAusgridRows,
  parseAusgridDate,
  trimToHeader,
};
