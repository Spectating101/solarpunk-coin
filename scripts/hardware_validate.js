#!/usr/bin/env node
/**
 * One-command hardware / meter evidence validation for Public Lab operators.
 * Proves: onboard → adapter/CSV → attestation bundle → hardware provenance tier.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const { buildAdapterReceipt } = require("./inverter_meter_adapter");
const { importCsvRows, parseCsv } = require("./import_meter_csv");
const { deriveBundle } = require("./derive_meter_attestations");
const { ethers } = require("ethers");

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

function run(cmd) {
  execSync(cmd, { cwd: ROOT, stdio: "inherit" });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

async function ensureSampleMeterOnboarded(meterId, siteId) {
  const registryPath = path.join(ROOT, "data/attestations/meter_registry.json");
  const registry = fs.existsSync(registryPath) ? readJson(registryPath) : { meters: [] };
  const existing = (registry.meters || []).find((m) => m.meter_id === meterId);
  const devKey = require("./build_signed_meter_fixture").DEVICE_KEYS[meterId];
  if (!devKey) return;
  const wallet = new ethers.Wallet(devKey);
  if (existing && String(existing.device_address).toLowerCase() === wallet.address.toLowerCase()) {
    return;
  }
  run(
    `node scripts/onboard_meter.js --meter-id=${meterId} --site-id=${siteId} --device-address=${wallet.address} --capacity-kw=120 --replace`
  );
}

async function buildCsvReceipt(options) {
  const csvPath = path.resolve(ROOT, options.csvPath);
  const registryPath = path.resolve(ROOT, options.registryPath || "data/attestations/meter_registry.json");
  const registry = readJson(registryPath);
  const rows = parseCsv(fs.readFileSync(csvPath, "utf-8"));
  let privateKey = options.privateKey || null;
  if (!privateKey && options.useDevFixtureKey) {
    privateKey = require("./build_signed_meter_fixture").DEVICE_KEYS[options.meterId] || null;
  }

  const payload = await importCsvRows(rows, registry, {
    privateKey,
    unsigned: options.unsigned,
    meterId: options.meterId,
    siteId: options.siteId,
    source: options.source || "meter_csv_import_v1",
    batchId: options.batchId,
    sourceFile: path.relative(ROOT, csvPath),
  });
  const bundle = deriveBundle(payload, registry, { minQuality: payload.min_quality_threshold });
  const acceptedSurplus = Number(bundle.summary?.total_surplus_kwh || 0);

  return {
    source: { provider: "meter-csv", mode: "spk_meter_csv_import_v1" },
    attestation_bundle: bundle,
    mint_readiness: {
      can_mint_from_adapter: bundle.summary.accepted_records > 0 && acceptedSurplus > 0,
      accepted_surplus_kwh: acceptedSurplus,
      accepted_records: bundle.summary.accepted_records,
      rejected_records: bundle.summary.rejected_records,
    },
    hardware_provenance: {
      real_operator_source: Boolean(options.realOperatorSource),
    },
  };
}

async function main() {
  const operatorMode = hasFlag("operator");
  const csvPath = getArg("csv");
  const meterId = getArg("meter-id", operatorMode ? "OPERATOR-METER-001" : "TW-TY-0001");
  const siteId = getArg("site-id", operatorMode ? "operator-site-a" : "taoyuan-rooftop-a");
  const privateKey = getArg("private-key", process.env.METER_PRIVATE_KEY || null);
  const useDevKey =
    hasFlag("use-dev-fixture-key") ||
    (!operatorMode && !privateKey && (!csvPath || meterId === "TW-TY-0001"));

  if (!csvPath || meterId === "TW-TY-0001") {
    await ensureSampleMeterOnboarded(meterId, siteId);
  }

  const provider = csvPath ? "meter-csv" : getArg("provider", operatorMode ? "cumulative-json" : "sample-cumulative");
  const startPath = getArg("start", "data/inverter/operator_start.json");
  const endPath = getArg("end", "data/inverter/operator_end.json");

  const receipt = csvPath
    ? await buildCsvReceipt({
        csvPath,
        meterId,
        siteId,
        privateKey,
        useDevFixtureKey: useDevKey,
        unsigned: hasFlag("unsigned"),
        realOperatorSource: operatorMode || hasFlag("real-operator-source"),
        batchId: getArg("batch-id", `hardware_validate_${Date.now()}`),
      })
    : await buildAdapterReceipt({
        provider,
        meterId,
        siteId,
        ...(operatorMode || getArg("start") || getArg("end")
          ? { startPath, endPath }
          : {}),
        host: getArg("host"),
        privateKey,
        useDevFixtureKey: useDevKey,
        unsigned: hasFlag("unsigned"),
        realOperatorSource: operatorMode || hasFlag("real-operator-source"),
        batchId: getArg("batch-id", `hardware_validate_${Date.now()}`),
      });

  const bundlePath = path.join(ROOT, "state/attestations/latest_attestation_bundle.json");
  const receiptPath = path.join(ROOT, "state/product/hardware_validate_receipt.json");
  writeJson(bundlePath, receipt.attestation_bundle);
  writeJson(receiptPath, {
    generated_at: new Date().toISOString(),
    mode: operatorMode ? "operator" : "sample",
    provider,
    meter_id: meterId,
    site_id: siteId,
    csv: csvPath ? path.relative(ROOT, path.resolve(ROOT, csvPath)) : null,
    accepted_records: receipt.attestation_bundle.summary.accepted_records,
    rejected_records: receipt.attestation_bundle.summary.rejected_records,
    accepted_surplus_kwh: receipt.mint_readiness.accepted_surplus_kwh,
    can_mint_from_adapter: receipt.mint_readiness.can_mint_from_adapter,
    real_operator_source: receipt.hardware_provenance.real_operator_source,
    bundle_path: path.relative(ROOT, bundlePath),
  });

  // Refresh adapter receipt for hardware provenance model when using CSV
  if (csvPath) {
    writeJson(path.join(ROOT, "state/product/inverter_meter_adapter_receipt.json"), {
      generated_at: new Date().toISOString(),
      source: receipt.source,
      mint_readiness: receipt.mint_readiness,
      hardware_provenance: receipt.hardware_provenance,
      attestation_bundle: receipt.attestation_bundle,
    });
  }

  run("node scripts/hardware_provenance_model.js");

  const provenance = readJson(path.join(ROOT, "state/product/hardware_provenance_model.json"));

  console.log("");
  console.log("=== Hardware validation summary ===");
  console.log(`mode: ${operatorMode ? "operator" : "sample"}`);
  console.log(`provider: ${provider}`);
  console.log(`accepted_records: ${receipt.attestation_bundle.summary.accepted_records}`);
  console.log(`accepted_surplus_kwh: ${receipt.mint_readiness.accepted_surplus_kwh}`);
  console.log(`can_mint_from_adapter: ${receipt.mint_readiness.can_mint_from_adapter}`);
  console.log(`hardware_level: ${provenance.current_hardware_level} (${provenance.current_hardware_label})`);
  console.log(`real_operator_source: ${receipt.hardware_provenance.real_operator_source}`);
  console.log(`bundle: ${path.relative(ROOT, bundlePath)}`);
  console.log("");

  if (!receipt.mint_readiness.can_mint_from_adapter) {
    console.error("Validation failed: no accepted attestations.");
    if (receipt.attestation_bundle.rejected_attestations?.length) {
      for (const row of receipt.attestation_bundle.rejected_attestations) {
        console.error(`  - ${row.reason || row.error || JSON.stringify(row)}`);
      }
    }
    process.exit(1);
  }

  console.log("Next steps:");
  console.log("  Local mint test:  npm run spk:v1:launch  # then CYCLE_MINT_MODE=meter npm run spk:v1:cycle");
  console.log("  Your Sepolia fork: npm run spk:v1:deploy:sepolia:lean  # your wallet = minter");
  console.log("  Canonical Sepolia: payments only unless you are the registered minter");
  console.log("  Closed pilot:      open a GitHub energy-data issue (no raw exports in public)");
  console.log("  Guide:             docs/product/HARDWARE_OPERATOR_QUICKSTART.md");
  console.log("  Deploy lab:        docs/product/PUBLIC_LAB_DEPLOYMENT.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

module.exports = { buildCsvReceipt };
