const { ethers } = require("hardhat");

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

function toUnixSeconds(isoString) {
  const millis = Date.parse(isoString);
  if (!Number.isFinite(millis)) {
    throw new Error(`Invalid timestamp: ${isoString}`);
  }
  return Math.floor(millis / 1000);
}

function buildSourcePayload(bundle) {
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

function unixToIso(seconds) {
  return new Date(seconds * 1000).toISOString().replace(".000Z", "+00:00");
}

function buildCycleBundle(cycleId, surplusKwh, blockTimestamp) {
  const now = new Date();
  const ts = Number(blockTimestamp ?? Math.floor(now.getTime() / 1000));
  const windowEnd = ts - 3600;
  const windowStart = windowEnd - 86_400;
  if (windowStart >= windowEnd) {
    throw new Error("Invalid closed measurement window for cycle bundle.");
  }
  const recordHash = ethers.keccak256(ethers.toUtf8Bytes(`spk-v1-cycle:${cycleId}:${surplusKwh}`)).slice(2);

  return {
    generated_at: now.toISOString(),
    source_schema: "SPK_RAW_METER_READINGS_V1",
    registry_schema: "SPK_METER_REGISTRY_V1",
    batch_id: `spk_v1_cycle_${cycleId}`,
    min_quality_threshold: 0.9,
    summary: {
      input_records: 1,
      accepted_records: 1,
      rejected_records: 0,
      verified_signatures: 1,
      registered_meters: 1,
      total_surplus_kwh: surplusKwh,
    },
    accepted_attestations: [
      {
        meter_id: "TW-CYCLE-0001",
        site_id: "spk-v1-operator-cycle",
        window_start: unixToIso(windowStart),
        window_end: unixToIso(windowEnd),
        surplus_kwh: surplusKwh,
        quality_score: 0.99,
        source: "operator_cycle_v1",
        record_hash: recordHash,
      },
    ],
    rejected_attestations: [],
  };
}

function buildAttestationInputs(bundle, recipient, blockTimestamp) {
  const accepted = bundle.accepted_attestations || [];
  if (!accepted.length) {
    throw new Error("Meter bundle has no accepted attestations.");
  }

  const totalSurplusKwh = Number(bundle.summary?.total_surplus_kwh || 0);
  const onchainSurplusKwh = BigInt(Math.floor(totalSurplusKwh));
  if (onchainSurplusKwh <= 0n) {
    throw new Error("Meter bundle total surplus rounds down to zero kWh.");
  }

  const windowStart = Math.min(...accepted.map((row) => toUnixSeconds(row.window_start)));
  const windowEnd = Math.max(...accepted.map((row) => toUnixSeconds(row.window_end)));
  if (windowStart >= windowEnd) {
    throw new Error("Invalid meter bundle window.");
  }

  const sourcePayload = buildSourcePayload(bundle);
  const sourcePayloadJson = stableStringify(sourcePayload);
  const sourceHash = ethers.keccak256(ethers.toUtf8Bytes(sourcePayloadJson));

  return {
    surplusKwh: onchainSurplusKwh,
    recipient,
    windowStart,
    windowEnd,
    validAfter: blockTimestamp - 60,
    validBefore: blockTimestamp + 86_400,
    sourceHash,
    sourcePayload,
    totalSurplusKwh,
  };
}

async function mintAttestedOnSpk(spk, bundle, { minter, oracle, recipient }) {
  const latestBlock = await ethers.provider.getBlock("latest");
  const inputs = buildAttestationInputs(bundle, recipient, Number(latestBlock.timestamp));

  const attestationHash = await spk.surplusAttestationHash(
    inputs.surplusKwh,
    inputs.recipient,
    inputs.windowStart,
    inputs.windowEnd,
    inputs.validAfter,
    inputs.validBefore,
    inputs.sourceHash
  );
  const signature = await oracle.signMessage(ethers.getBytes(attestationHash));

  const expectedMinted = await spk.connect(minter).mintFromSurplusAttestation.staticCall(
    inputs.surplusKwh,
    inputs.recipient,
    inputs.windowStart,
    inputs.windowEnd,
    inputs.validAfter,
    inputs.validBefore,
    inputs.sourceHash,
    signature
  );

  const tx = await spk.connect(minter).mintFromSurplusAttestation(
    inputs.surplusKwh,
    inputs.recipient,
    inputs.windowStart,
    inputs.windowEnd,
    inputs.validAfter,
    inputs.validBefore,
    inputs.sourceHash,
    signature
  );
  const receipt = await tx.wait();

  return {
    action: "mint_from_attestation",
    surplus_kwh: Number(inputs.surplusKwh),
    minted_spk: Number(ethers.formatEther(expectedMinted)),
    source_hash: inputs.sourceHash,
    attestation_hash: attestationHash,
    batch_id: bundle.batch_id,
    tx_hash: receipt.hash,
  };
}

module.exports = {
  stableStringify,
  buildCycleBundle,
  buildAttestationInputs,
  buildSourcePayload,
  mintAttestedOnSpk,
};
