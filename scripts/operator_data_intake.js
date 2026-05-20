const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const { DEVICE_KEYS } = require("./build_signed_meter_fixture");
const { deriveBundle } = require("./derive_meter_attestations");
const { importCsvRows, parseCsv } = require("./import_meter_csv");
const { mintPreviewFromBundle } = require("./pilot_csv_receipt");

const ROOT = path.join(__dirname, "..");

const PROVENANCE_LEVELS = {
  L0: {
    label: "Sample or public-lab fixture",
    stage: "public_lab_only",
    real_value_kwh_cap_per_day: 0,
    closed_pilot_ready: false,
    paid_launch_ready: false,
  },
  L1: {
    label: "Operator-signed CSV export",
    stage: "shadow_pilot",
    real_value_kwh_cap_per_day: 250,
    closed_pilot_ready: false,
    paid_launch_ready: false,
  },
  L2: {
    label: "Live inverter or gateway signed source",
    stage: "closed_pilot_candidate",
    real_value_kwh_cap_per_day: 2500,
    closed_pilot_ready: true,
    paid_launch_ready: false,
  },
  L3: {
    label: "Revenue-grade meter with gateway custody",
    stage: "risk_boxed_pilot_candidate",
    real_value_kwh_cap_per_day: 10000,
    closed_pilot_ready: true,
    paid_launch_ready: false,
  },
  L4: {
    label: "Utility or settlement-corroborated source",
    stage: "production_candidate_after_audit",
    real_value_kwh_cap_per_day: 50000,
    closed_pilot_ready: true,
    paid_launch_ready: true,
  },
};

const COLUMN_ALIASES = {
  window_start: ["window_start", "start", "start_time", "timestamp_start"],
  window_end: ["window_end", "end", "end_time", "timestamp_end"],
  generation_kwh: ["generation_kwh", "solar_generation_kwh", "pv_generation_kwh", "production_kwh"],
  site_load_kwh: ["site_load_kwh", "load_kwh", "solar_self_consumed_kwh"],
  gross_consumption_kwh: ["gross_consumption_kwh", "consumption_kwh", "site_consumption_kwh", "building_consumption_kwh"],
  export_kwh: ["export_kwh", "grid_export_kwh", "export_surplus_kwh"],
  curtailed_kwh: ["curtailed_kwh", "curtailment_kwh"],
  quality_score: ["quality_score", "data_quality"],
  nonce: ["nonce", "reading_nonce"],
  source: ["source", "source_system"],
};

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

function readText(filePath) {
  return fs.readFileSync(filePath, "utf-8");
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

function sum(values) {
  return fixed(values.reduce((total, value) => total + Number(value || 0), 0), 6);
}

function average(values) {
  const valid = values.map(Number).filter(Number.isFinite);
  if (!valid.length) return null;
  return fixed(valid.reduce((total, value) => total + value, 0) / valid.length, 6);
}

function pick(row, canonical) {
  for (const key of COLUMN_ALIASES[canonical] || [canonical]) {
    if (row[key] !== undefined && row[key] !== "") return row[key];
  }
  return undefined;
}

function numberOr(row, canonical, fallback = null) {
  const value = pick(row, canonical);
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${canonical} must be numeric`);
  }
  return parsed;
}

function timestampOrThrow(row, canonical, index) {
  const value = pick(row, canonical);
  const millis = Date.parse(value);
  if (!Number.isFinite(millis)) {
    throw new Error(`row ${index + 1}: ${canonical} must be an ISO-like timestamp`);
  }
  return new Date(millis).toISOString().replace(".000Z", "Z");
}

function sourceDay(windowStart) {
  return windowStart.slice(0, 10);
}

function normalizeOperatorRow(row, index, profile, options = {}) {
  const windowStart = timestampOrThrow(row, "window_start", index);
  const windowEnd = timestampOrThrow(row, "window_end", index);
  const generation = numberOr(row, "generation_kwh");
  if (generation === null) throw new Error(`row ${index + 1}: generation_kwh is required`);

  const curtailed = numberOr(row, "curtailed_kwh", 0);
  const explicitExport = numberOr(row, "export_kwh", null);
  const explicitSiteLoad = numberOr(row, "site_load_kwh", null);
  const grossConsumption = numberOr(row, "gross_consumption_kwh", null);
  let exportKwh = explicitExport;
  let siteLoad = explicitSiteLoad;

  if (exportKwh === null && siteLoad !== null) {
    exportKwh = Math.max(generation - siteLoad - curtailed, 0);
  }
  if (siteLoad === null && exportKwh !== null) {
    siteLoad = Math.max(generation - exportKwh - curtailed, 0);
  }
  if (siteLoad === null && grossConsumption !== null) {
    siteLoad = Math.min(grossConsumption, Math.max(generation - (exportKwh || 0) - curtailed, 0));
  }
  if (exportKwh === null && grossConsumption !== null) {
    exportKwh = Math.max(generation - grossConsumption - curtailed, 0);
    siteLoad = Math.min(grossConsumption, generation - exportKwh - curtailed);
  }
  if (siteLoad === null || exportKwh === null) {
    throw new Error(`row ${index + 1}: provide site_load_kwh, export_kwh, or gross_consumption_kwh`);
  }

  const qualityScore = numberOr(row, "quality_score", Number(options.defaultQuality ?? 0.95));
  const nonce = String(pick(row, "nonce") || `${profile.meter_id}:${sourceDay(windowStart)}:${index}`);
  const source = String(pick(row, "source") || profile.data_source?.kind || "operator_data_intake_v1");

  const normalized = {
    meter_id: profile.meter_id,
    site_id: profile.site_id,
    window_start: windowStart,
    window_end: windowEnd,
    generation_kwh: fixed(generation),
    site_load_kwh: fixed(siteLoad),
    export_kwh: fixed(exportKwh),
    curtailed_kwh: fixed(curtailed),
    quality_score: fixed(qualityScore),
    source,
    nonce,
  };

  const drift = Math.abs(generation - siteLoad - exportKwh - curtailed);
  const allowed = Math.max(0.001, generation * 0.02);
  if (drift > allowed) {
    throw new Error(`row ${index + 1}: energy balance drift exceeds 2%`);
  }
  if (generation < 0 || siteLoad < 0 || exportKwh < 0 || curtailed < 0) {
    throw new Error(`row ${index + 1}: energy values must be non-negative`);
  }
  if (qualityScore < 0 || qualityScore > 1) {
    throw new Error(`row ${index + 1}: quality_score must be between 0 and 1`);
  }

  return {
    ...normalized,
    gross_consumption_kwh: grossConsumption === null ? null : fixed(grossConsumption),
    eligible_surplus_kwh: fixed(exportKwh + curtailed),
  };
}

function inferProvenance(profile, signed) {
  const requested = String(profile.provenance?.level || "").toUpperCase();
  if (!profile.real_operator_source) return "L0";
  if (PROVENANCE_LEVELS[requested]) return requested;
  if (profile.provenance?.utility_corroborated) return "L4";
  if (profile.device?.accuracy_basis && String(profile.device.accuracy_basis).toLowerCase().includes("revenue")) return "L3";
  if (profile.provenance?.live_api) return "L2";
  if (signed) return "L1";
  return "L0";
}

function buildRegistry(profile, signerAddress, rows) {
  const start = rows.length ? rows[0].window_start : "2026-01-01T00:00:00Z";
  const end = rows.length ? rows[rows.length - 1].window_end : "2027-01-01T00:00:00Z";
  return {
    schema: "SPK_OPERATOR_INTAKE_REGISTRY_V1",
    generated_at: new Date().toISOString(),
    meters: [
      {
        meter_id: profile.meter_id,
        site_id: profile.site_id,
        device_address: signerAddress,
        capacity_kw: Number(profile.capacity_kw || 10),
        active_after: profile.active_after || start,
        active_until: profile.active_until || end,
      },
    ],
  };
}

function defaultProfile() {
  return {
    schema: "SPK_OPERATOR_PROFILE_V1",
    operator_name: "SolarPunk sample 10 kW rooftop",
    operator_type: "sample_fixture",
    real_operator_source: false,
    site_id: "sample-rooftop-10kw",
    meter_id: "TW-TY-0001",
    capacity_kw: 10,
    generation_resource: "solar_pv_rooftop",
    location_label: "Taiwan sample profile",
    timezone: "Asia/Taipei",
    data_source: {
      kind: "operator_csv",
      source_system: "sample inverter export",
      archive_policy: "checked into repo for reproducible demo only",
    },
    device: {
      model: "Sample inverter/gateway",
      serial_or_hash: "sample-only",
      commissioning_date: "2026-01-01",
      accuracy_basis: "not revenue grade",
    },
    provenance: {
      level: "L0",
      label: "Sample operator fixture",
      external_operator_confirmed: false,
      live_api: false,
      utility_corroborated: false,
    },
  };
}

function resolvePrivateKey(profile, options = {}) {
  if (options.privateKey) return options.privateKey;
  if (options.useDevFixtureKey) return DEVICE_KEYS[profile.meter_id] || DEVICE_KEYS["TW-TY-0001"];
  return null;
}

function toDailyCsv(rows) {
  const headers = [
    "date",
    "generation_kwh",
    "site_load_kwh",
    "export_kwh",
    "curtailed_kwh",
    "eligible_surplus_kwh",
    "quality_score",
  ];
  const lines = rows.map((row) => [
    sourceDay(row.window_start),
    row.generation_kwh,
    row.site_load_kwh,
    row.export_kwh,
    row.curtailed_kwh,
    row.eligible_surplus_kwh,
    row.quality_score,
  ].join(","));
  return `${headers.join(",")}\n${lines.join("\n")}\n`;
}

function buildCommercialUseCases(report) {
  return [
    {
      id: "data_only_case_study",
      buyer: "lab, university, solar owner, or climate/Web3 reviewer",
      offer: "Turn one anonymized solar export into an SPK mint preview, dashboard metric, and public/private case-study report.",
      price_band_usd: "500-1500",
      why_it_matters: "Creates external proof without selling tradable SPK.",
    },
    {
      id: "weekly_shadow_pilot",
      buyer: "solar operator, campus, or sponsor",
      offer: "Process weekly exports, track accepted/rejected data, and show cumulative SPK preview under capped rules.",
      price_band_usd: "1500-5000/month",
      why_it_matters: "Builds repeated operational evidence before audit/mainnet risk.",
    },
    {
      id: "closed_beta_setup",
      buyer: "one named operator or funded pilot sponsor",
      offer: "Wire a signed inverter/gateway source, governed testnet deployment, monitoring, and audit-ready evidence.",
      price_band_usd: "7500-25000",
      why_it_matters: "Turns public lab proof into the first real launch candidate.",
    },
  ].map((item) => ({
    ...item,
    current_sample_net_spk_preview: report.mint_preview.net_spk,
  }));
}

async function buildOperatorDataIntake(options = {}) {
  const csvPath = path.resolve(ROOT, options.csvPath || "data/operator/sample_operator_export.csv");
  const profilePath = path.resolve(ROOT, options.profilePath || "data/operator/sample_operator_profile.json");
  const profile = {
    ...defaultProfile(),
    ...readJson(profilePath, {}),
  };
  const csvText = options.csvText || readText(csvPath);
  const sourceRows = parseCsv(csvText);
  const normalizedRows = sourceRows.map((row, index) => normalizeOperatorRow(row, index, profile, options));
  const privateKey = resolvePrivateKey(profile, options);
  const unsigned = Boolean(options.unsigned || !privateKey);
  const wallet = privateKey ? new ethers.Wallet(privateKey) : ethers.Wallet.createRandom();
  const registry = buildRegistry(profile, wallet.address, normalizedRows);
  const sourceFile = path.relative(ROOT, csvPath);
  const rawReadings = await importCsvRows(normalizedRows, registry, {
    privateKey,
    unsigned,
    meterId: profile.meter_id,
    siteId: profile.site_id,
    source: "operator_data_intake_v1",
    batchId: options.batchId || path.basename(csvPath, path.extname(csvPath)),
    minQuality: Number(options.minQuality ?? 0.9),
    sourceFile,
  });

  rawReadings.import_adapter = {
    ...rawReadings.import_adapter,
    schema: "SPK_OPERATOR_DATA_INTAKE_V1",
    real_operator_source: Boolean(profile.real_operator_source),
    profile_path: path.relative(ROOT, profilePath),
  };

  const now = Math.floor(Date.parse(options.now || "2026-05-19T00:00:00Z") / 1000);
  const attestationBundle = deriveBundle(rawReadings, registry, {
    now,
    minQuality: Number(options.minQuality ?? 0.9),
  });
  const mintPreview = mintPreviewFromBundle(attestationBundle, {
    energyPriceUsdPerKwh: options.energyPriceUsdPerKwh ?? 0.05,
    mintFeeBps: options.mintFeeBps ?? 10,
  });
  const provenanceLevelId = inferProvenance(profile, !unsigned);
  const provenanceLevel = PROVENANCE_LEVELS[provenanceLevelId];
  const totalGeneration = sum(normalizedRows.map((row) => row.generation_kwh));
  const totalExport = sum(normalizedRows.map((row) => row.export_kwh));
  const totalCurtailed = sum(normalizedRows.map((row) => row.curtailed_kwh));
  const totalSurplus = sum(normalizedRows.map((row) => row.eligible_surplus_kwh));
  const acceptedRecords = Number(attestationBundle.summary.accepted_records || 0);
  const rejectedRecords = Number(attestationBundle.summary.rejected_records || 0);

  const report = {
    generated_at: (options.generatedAt || new Date()).toISOString(),
    title: "SolarPunk Operator Data Intake",
    plain_english:
      "This is the bridge for a real solar owner, lab, or university: send a CSV export, SolarPunk validates the rows, signs or verifies them, computes eligible surplus, and previews how much SPK cryptocurrency the data would mint under current testnet rules.",
    input: {
      csv_path: sourceFile,
      profile_path: path.relative(ROOT, profilePath),
      row_count: sourceRows.length,
      normalized_row_count: normalizedRows.length,
      meter_id: profile.meter_id,
      site_id: profile.site_id,
      capacity_kw: Number(profile.capacity_kw || 10),
      min_quality_threshold: Number(options.minQuality ?? 0.9),
      unsigned,
      private_key_written_to_repo: false,
    },
    operator_profile: profile,
    provenance_assessment: {
      level: provenanceLevelId,
      label: provenanceLevel.label,
      stage: provenanceLevel.stage,
      real_operator_source: Boolean(profile.real_operator_source),
      real_value_kwh_cap_per_day: provenanceLevel.real_value_kwh_cap_per_day,
      closed_pilot_ready: provenanceLevel.closed_pilot_ready && Boolean(profile.real_operator_source),
      paid_launch_ready: provenanceLevel.paid_launch_ready && Boolean(profile.real_operator_source),
      why: profile.real_operator_source
        ? "Operator source is marked real; launch level still depends on live API, revenue-grade, or utility corroboration evidence."
        : "Checked-in sample is useful for demo and reviewer reproduction only; it cannot support real-value SPK issuance.",
    },
    validation_summary: {
      total_generation_kwh: totalGeneration,
      total_export_kwh: totalExport,
      total_curtailed_kwh: totalCurtailed,
      total_eligible_surplus_kwh: totalSurplus,
      average_quality_score: average(normalizedRows.map((row) => row.quality_score)),
      accepted_records: acceptedRecords,
      rejected_records: rejectedRecords,
      verified_signatures: attestationBundle.summary.verified_signatures,
    },
    launch_controls: {
      lab_mint_preview_enabled: mintPreview.can_mint_spk_from_bundle,
      real_value_mint_cap_kwh_per_day: provenanceLevel.real_value_kwh_cap_per_day,
      current_sample_allowed_real_value_kwh: profile.real_operator_source ? provenanceLevel.real_value_kwh_cap_per_day : 0,
      requires_named_operator_for_closed_pilot: true,
      requires_audit_legal_and_l4_for_paid_public_launch: true,
    },
    daily_rows: normalizedRows,
    registry,
    raw_readings: rawReadings,
    attestation_bundle: attestationBundle,
    mint_preview: mintPreview,
    commercial_use_cases: [],
    hard_boundaries: [
      "The sample file proves the intake mechanics, not a real external solar source.",
      "Unsigned data is schema-review evidence only and cannot mint SPK.",
      "L0/L1 data can support demos and shadow pilots, but not paid public SPK issuance.",
      "Paid public SPK still needs audit, legal/commercial scope, production deployment, reserve policy, and stronger hardware provenance.",
      "No private key is written to repo outputs.",
    ],
  };
  report.commercial_use_cases = buildCommercialUseCases(report);
  return report;
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# SolarPunk Operator Data Intake");
  lines.push("");
  lines.push(report.plain_english);
  lines.push("");
  lines.push("## Input");
  lines.push("");
  lines.push(`- csv_path: \`${report.input.csv_path}\``);
  lines.push(`- profile_path: \`${report.input.profile_path}\``);
  lines.push(`- operator_name: \`${report.operator_profile.operator_name}\``);
  lines.push(`- meter_id: \`${report.input.meter_id}\``);
  lines.push(`- site_id: \`${report.input.site_id}\``);
  lines.push(`- capacity_kw: \`${report.input.capacity_kw}\``);
  lines.push(`- unsigned: \`${report.input.unsigned}\``);
  lines.push(`- private_key_written_to_repo: \`${report.input.private_key_written_to_repo}\``);
  lines.push("");
  lines.push("## Validation Result");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  lines.push(`| Rows | \`${report.input.row_count}\` |`);
  lines.push(`| Accepted records | \`${report.validation_summary.accepted_records}\` |`);
  lines.push(`| Rejected records | \`${report.validation_summary.rejected_records}\` |`);
  lines.push(`| Verified signatures | \`${report.validation_summary.verified_signatures}\` |`);
  lines.push(`| Solar generation | \`${report.validation_summary.total_generation_kwh} kWh\` |`);
  lines.push(`| Export surplus | \`${report.validation_summary.total_export_kwh} kWh\` |`);
  lines.push(`| Eligible surplus | \`${report.validation_summary.total_eligible_surplus_kwh} kWh\` |`);
  lines.push(`| Average quality | \`${report.validation_summary.average_quality_score}\` |`);
  lines.push("");
  lines.push("## SPK Cryptocurrency Preview");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  lines.push(`| Source hash | \`${report.mint_preview.source_hash}\` |`);
  lines.push(`| On-chain surplus | \`${report.mint_preview.onchain_surplus_kwh} kWh\` |`);
  lines.push(`| Energy price basis | \`$${report.mint_preview.energy_price_usd_per_kwh}/kWh\` |`);
  lines.push(`| Mint fee | \`${report.mint_preview.mint_fee_bps} bps\` |`);
  lines.push(`| Net SPK preview | \`${report.mint_preview.net_spk} SPK\` |`);
  lines.push(`| Can mint in lab/testnet | \`${report.mint_preview.can_mint_spk_from_bundle}\` |`);
  lines.push("");
  lines.push("## Provenance");
  lines.push("");
  lines.push(`- level: \`${report.provenance_assessment.level}\``);
  lines.push(`- label: \`${report.provenance_assessment.label}\``);
  lines.push(`- stage: \`${report.provenance_assessment.stage}\``);
  lines.push(`- real_operator_source: \`${report.provenance_assessment.real_operator_source}\``);
  lines.push(`- closed_pilot_ready: \`${report.provenance_assessment.closed_pilot_ready}\``);
  lines.push(`- paid_launch_ready: \`${report.provenance_assessment.paid_launch_ready}\``);
  lines.push("");
  lines.push(report.provenance_assessment.why);
  lines.push("");
  lines.push("## Daily Case Study Rows");
  lines.push("");
  lines.push("| Date | Generation kWh | Site load kWh | Export kWh | Eligible surplus kWh | Quality |");
  lines.push("|---|---:|---:|---:|---:|---:|");
  for (const row of report.daily_rows) {
    lines.push(`| ${sourceDay(row.window_start)} | ${row.generation_kwh} | ${row.site_load_kwh} | ${row.export_kwh} | ${row.eligible_surplus_kwh} | ${row.quality_score} |`);
  }
  lines.push("");
  lines.push("## Commercial Pilot Offers");
  lines.push("");
  for (const useCase of report.commercial_use_cases) {
    lines.push(`- \`${useCase.id}\` (${useCase.price_band_usd}): ${useCase.offer}`);
  }
  lines.push("");
  lines.push("## Run With A Real Operator File");
  lines.push("");
  lines.push("```bash");
  lines.push("METER_PRIVATE_KEY=0x... node scripts/operator_data_intake.js \\");
  lines.push("  --csv=data/operator/operator_export.csv \\");
  lines.push("  --profile=data/operator/operator_profile.json \\");
  lines.push("  --now=2026-05-19T00:00:00Z");
  lines.push("```");
  lines.push("");
  lines.push("## Boundaries");
  lines.push("");
  for (const boundary of report.hard_boundaries) {
    lines.push(`- ${boundary}`);
  }
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const report = await buildOperatorDataIntake({
    csvPath: getArg("csv", "data/operator/sample_operator_export.csv"),
    profilePath: getArg("profile", "data/operator/sample_operator_profile.json"),
    minQuality: Number(getArg("min-quality", "0.9")),
    energyPriceUsdPerKwh: Number(getArg("energy-price", "0.05")),
    mintFeeBps: Number(getArg("mint-fee-bps", "10")),
    now: getArg("now", "2026-05-19T00:00:00Z"),
    generatedAt: getArg("generated-at") ? new Date(getArg("generated-at")) : undefined,
    privateKey: getArg("private-key", process.env.METER_PRIVATE_KEY || null),
    useDevFixtureKey: hasFlag("use-dev-fixture-key"),
    unsigned: hasFlag("unsigned"),
  });

  const outJson = path.resolve(ROOT, getArg("out-json", "state/product/operator_data_intake.json"));
  const outRaw = path.resolve(ROOT, getArg("out-raw", "state/product/operator_data_raw_readings.json"));
  const outBundle = path.resolve(ROOT, getArg("out-bundle", "state/product/operator_data_attestation_bundle.json"));
  const outCsv = path.resolve(ROOT, getArg("out-csv", "state/product/operator_data_daily.csv"));
  const outMd = path.resolve(ROOT, getArg("out-md", "docs/product/OPERATOR_DATA_INTAKE.md"));
  writeJson(outJson, report);
  writeJson(outRaw, report.raw_readings);
  writeJson(outBundle, report.attestation_bundle);
  writeText(outCsv, toDailyCsv(report.daily_rows));
  writeText(outMd, toMarkdown(report));

  console.log(`accepted_records=${report.validation_summary.accepted_records}`);
  console.log(`eligible_surplus_kwh=${report.validation_summary.total_eligible_surplus_kwh}`);
  console.log(`net_spk_preview=${report.mint_preview.net_spk}`);
  console.log(`provenance_level=${report.provenance_assessment.level}`);
  console.log(`wrote: ${outJson}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  buildOperatorDataIntake,
  inferProvenance,
  normalizeOperatorRow,
  PROVENANCE_LEVELS,
};
