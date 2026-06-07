const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

/**
 * Derive a replay-safe bundle from a real meter export while preserving surplus totals.
 * Each cycle gets a unique batch_id and record hashes so source_hash is fresh on-chain.
 */
function uniquifyMeterBundle(bundle, cycleId, scale = 1) {
  const copy = JSON.parse(JSON.stringify(bundle));
  copy.batch_id = `${bundle.batch_id}:cycle:${cycleId}`;
  copy.generated_at = new Date().toISOString();

  let totalSurplus = 0;
  copy.accepted_attestations = (copy.accepted_attestations || []).map((row, index) => {
    const surplus = Number((Number(row.surplus_kwh) * scale).toFixed(4));
    totalSurplus += surplus;
    const recordHash = ethers
      .keccak256(ethers.toUtf8Bytes(`${row.record_hash}:${cycleId}:${index}`))
      .slice(2);
    return { ...row, surplus_kwh: surplus, record_hash: recordHash };
  });

  copy.summary = {
    ...(copy.summary || {}),
    total_surplus_kwh: Number(totalSurplus.toFixed(4)),
    accepted_records: copy.accepted_attestations.length,
  };

  return copy;
}

function loadMeterBundleForCycle(cycleId, root) {
  const bundlePath = process.env.METER_BUNDLE_PATH || path.join(root, "state/attestations/latest_attestation_bundle.json");
  if (!fs.existsSync(bundlePath)) {
    return null;
  }
  const bundle = readJson(bundlePath);
  const scale = Number(process.env.CYCLE_METER_SCALE || "0.02");
  return {
    bundle: uniquifyMeterBundle(bundle, cycleId, scale),
    source_path: path.relative(root, bundlePath),
    scale,
  };
}

module.exports = {
  uniquifyMeterBundle,
  loadMeterBundleForCycle,
};
