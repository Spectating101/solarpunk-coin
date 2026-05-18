const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const { ethers } = hre;

function getArg(name, fallback = null) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

function isLocalNetwork(networkName) {
  return networkName === "hardhat" || networkName === "localhost";
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

function writeMarkdown(filePath, proof) {
  const lines = [];
  lines.push("# SPK Attested Mint Proof");
  lines.push("");
  lines.push("This proof shows the product-critical path: signed raw meter readings -> verified surplus bundle -> deterministic source hash -> oracle signature -> replay-protected SPK mint.");
  lines.push("");
  lines.push("## Run");
  lines.push("");
  lines.push(`- generated_at: \`${proof.generated_at}\``);
  lines.push(`- network: \`${proof.network}\``);
  lines.push(`- chain_id: \`${proof.chain_id}\``);
  lines.push(`- execution_scope: \`${proof.execution_scope}\``);
  lines.push(`- tx_hash: \`${proof.transaction.hash}\``);
  lines.push(`- gas_used: \`${proof.transaction.gas_used}\``);
  lines.push("");
  lines.push("## Meter Bundle");
  lines.push("");
  lines.push(`- bundle: \`${proof.source.bundle_path}\``);
  lines.push(`- source_schema: \`${proof.source.source_schema}\``);
  lines.push(`- batch_id: \`${proof.source.batch_id}\``);
  lines.push(`- input_records: \`${proof.source.input_records}\``);
  lines.push(`- accepted_records: \`${proof.source.accepted_records}\``);
  lines.push(`- rejected_records: \`${proof.source.rejected_records}\``);
  lines.push(`- verified_signatures: \`${proof.source.verified_signatures}\``);
  lines.push(`- total_surplus_kwh: \`${proof.source.total_surplus_kwh}\``);
  lines.push(`- onchain_surplus_kwh: \`${proof.source.onchain_surplus_kwh}\``);
  lines.push(`- unminted_fractional_kwh: \`${proof.source.unminted_fractional_kwh}\``);
  lines.push(`- source_hash: \`${proof.source.source_hash}\``);
  lines.push("");
  lines.push("## Attestation");
  lines.push("");
  lines.push(`- attestor: \`${proof.attestation.attestor}\``);
  lines.push(`- minter: \`${proof.attestation.minter}\``);
  lines.push(`- recipient: \`${proof.attestation.recipient}\``);
  lines.push(`- window_start: \`${proof.attestation.window_start}\``);
  lines.push(`- window_end: \`${proof.attestation.window_end}\``);
  lines.push(`- valid_after: \`${proof.attestation.valid_after}\``);
  lines.push(`- valid_before: \`${proof.attestation.valid_before}\``);
  lines.push(`- attestation_hash: \`${proof.attestation.attestation_hash}\``);
  lines.push(`- attestation_hash_consumed: \`${proof.attestation.attestation_hash_consumed}\``);
  lines.push(`- source_hash_consumed: \`${proof.attestation.source_hash_consumed}\``);
  lines.push("");
  lines.push("## Mint Result");
  lines.push("");
  lines.push(`- energy_price_usd_per_kwh: \`${proof.mint.energy_price_usd_per_kwh}\``);
  lines.push(`- minting_fee_bps: \`${proof.mint.minting_fee_bps}\``);
  lines.push(`- minted_spk: \`${proof.mint.minted_spk}\``);
  lines.push(`- recipient_balance_after_spk: \`${proof.mint.recipient_balance_after_spk}\``);
  lines.push(`- cumulative_surplus_kwh_after: \`${proof.mint.cumulative_surplus_kwh_after}\``);
  lines.push("");
  lines.push("## Scope Note");
  lines.push("");
  if (proof.network === "hardhat") {
    lines.push("- This is a reproducible local proof artifact. Hardhat transaction hashes are local-only.");
    lines.push("- A public proof requires attaching this script to an attestation-enabled SolarPunkCoin on a public testnet.");
  } else {
    lines.push(`- This is a public ${proof.network} proof artifact against the attached SolarPunkCoin deployment.`);
    lines.push("- This proof deployment is not the production/governance deployment and does not replace the older Safe-admin testnet stack.");
  }
  lines.push("- The current proof does not certify physical hardware finality; it proves the protocol path once a meter bundle is accepted.");
  lines.push("");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
}

function toUnixSeconds(isoString) {
  const millis = Date.parse(isoString);
  if (!Number.isFinite(millis)) {
    throw new Error(`Invalid timestamp in meter bundle: ${isoString}`);
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
    sourcePayloadJson,
    totalSurplusKwh,
    unmintedFractionalKwh: totalSurplusKwh - Number(onchainSurplusKwh),
  };
}

async function deployLocalStack(deployer, minter, oracle) {
  const MockUSDC = await ethers.getContractFactory("MockUSDC", deployer);
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();

  const ProtocolTreasury = await ethers.getContractFactory("ProtocolTreasury", deployer);
  const treasury = await ProtocolTreasury.deploy(await usdc.getAddress());
  await treasury.waitForDeployment();

  const SolarPunkCoin = await ethers.getContractFactory("SolarPunkCoin", deployer);
  const spk = await SolarPunkCoin.deploy(await usdc.getAddress());
  await spk.waitForDeployment();

  await (await spk.setTreasury(await treasury.getAddress())).wait();

  const minterRole = await spk.MINTER_ROLE();
  const oracleRole = await spk.ORACLE_ROLE();
  await (await spk.grantRole(minterRole, minter.address)).wait();
  await (await spk.grantRole(oracleRole, oracle.address)).wait();

  const reserveAmount = ethers.parseUnits("100000", 6);
  await (await usdc.mint(deployer.address, reserveAmount)).wait();
  await (await usdc.approve(await spk.getAddress(), reserveAmount)).wait();
  await (await spk.depositReserve(reserveAmount)).wait();
  await (await spk.connect(oracle).updateEnergyPrice(ethers.parseEther("0.05"))).wait();
  await (await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"))).wait();

  return { spk, usdc, treasury };
}

async function getExternalStack(networkName, minter, oracle) {
  const spkAddress = process.env.SPK_ADDRESS;
  if (!spkAddress || !ethers.isAddress(spkAddress)) {
    throw new Error(`SPK_ADDRESS is required when running on ${networkName}.`);
  }

  const spk = await ethers.getContractAt("SolarPunkCoin", spkAddress);
  const minterRole = await spk.MINTER_ROLE();
  const oracleRole = await spk.ORACLE_ROLE();
  const [hasMinterRole, hasOracleRole] = await Promise.all([
    spk.hasRole(minterRole, minter.address),
    spk.hasRole(oracleRole, oracle.address),
  ]);

  if (!hasMinterRole) {
    throw new Error(`Minter signer ${minter.address} does not have MINTER_ROLE on ${spkAddress}.`);
  }
  if (!hasOracleRole) {
    throw new Error(`Oracle signer ${oracle.address} does not have ORACLE_ROLE on ${spkAddress}.`);
  }

  const latest = await ethers.provider.getBlock("latest");
  const lastOracleUpdate = Number(await spk.lastOracleUpdate());
  const stalenessThreshold = Number(await spk.oracleStalenessThreshold());
  if (latest.timestamp - lastOracleUpdate >= stalenessThreshold) {
    if (process.env.SPK_REFRESH_ORACLE === "1") {
      await (await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"))).wait();
    } else {
      throw new Error("SPK oracle is stale. Set SPK_REFRESH_ORACLE=1 only if this oracle update is intentional.");
    }
  }

  return { spk, usdc: null, treasury: null };
}

async function signerFromEnv(envKey, fallback) {
  const privateKey = process.env[envKey];
  if (!privateKey) return fallback;
  return new ethers.Wallet(privateKey, ethers.provider);
}

async function main() {
  const root = path.join(__dirname, "..");
  const networkName = hre.network.name;
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const localMinter = signers[1] || deployer;
  const localOracle = signers[2] || deployer;
  const localRecipient = signers[3] || deployer;
  const minter = await signerFromEnv("MINTER_PRIVATE_KEY", isLocalNetwork(networkName) ? localMinter : deployer);
  const oracle = await signerFromEnv("ORACLE_PRIVATE_KEY", isLocalNetwork(networkName) ? localOracle : deployer);
  const recipient = process.env.SPK_MINT_RECIPIENT && ethers.isAddress(process.env.SPK_MINT_RECIPIENT)
    ? process.env.SPK_MINT_RECIPIENT
    : (isLocalNetwork(networkName) ? localRecipient.address : deployer.address);

  const bundleArg = getArg("bundle", "state/attestations/latest_attestation_bundle.json");
  const bundlePath = path.resolve(root, bundleArg);
  if (!fs.existsSync(bundlePath)) {
    throw new Error(`Missing meter bundle: ${bundlePath}. Run: npm run attestations:build`);
  }
  const bundle = readJson(bundlePath);

  const chain = await ethers.provider.getNetwork();
  const executionScope = isLocalNetwork(networkName) && !process.env.SPK_ADDRESS ? "local-reproducible" : "attached-network";
  const { spk, usdc, treasury } = executionScope === "local-reproducible"
    ? await deployLocalStack(deployer, minter, oracle)
    : await getExternalStack(networkName, minter, oracle);

  const spkAddress = await spk.getAddress();
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

  const [energyPrice, mintingFee, recipientBalance, cumulativeSurplus, attestationConsumed, sourceConsumed] = await Promise.all([
    spk.energyPricePerKwh(),
    spk.mintingFee(),
    spk.balanceOf(inputs.recipient),
    spk.cumulativeSurplusKwh(),
    spk.usedSurplusAttestations(attestationHash),
    spk.usedSurplusSourceHashes(inputs.sourceHash),
  ]);

  const proof = {
    generated_at: new Date().toISOString(),
    network: networkName,
    chain_id: Number(chain.chainId),
    execution_scope: executionScope,
    contracts: {
      SolarPunkCoin: spkAddress,
      MockUSDC: usdc ? await usdc.getAddress() : null,
      ProtocolTreasury: treasury ? await treasury.getAddress() : null,
    },
    source: {
      bundle_path: path.relative(root, bundlePath),
      source_schema: bundle.source_schema || bundle.schema || "unknown",
      batch_id: bundle.batch_id,
      input_records: bundle.summary?.input_records || 0,
      accepted_records: bundle.summary?.accepted_records || 0,
      rejected_records: bundle.summary?.rejected_records || 0,
      verified_signatures: bundle.summary?.verified_signatures || 0,
      registered_meters: bundle.summary?.registered_meters || null,
      total_surplus_kwh: inputs.totalSurplusKwh,
      onchain_surplus_kwh: inputs.surplusKwh.toString(),
      unminted_fractional_kwh: Number(inputs.unmintedFractionalKwh.toFixed(6)),
      source_hash: inputs.sourceHash,
      source_payload: inputs.sourcePayload,
      source_payload_json: inputs.sourcePayloadJson,
    },
    attestation: {
      attestor: oracle.address,
      minter: minter.address,
      recipient: inputs.recipient,
      window_start: inputs.windowStart,
      window_end: inputs.windowEnd,
      valid_after: inputs.validAfter,
      valid_before: inputs.validBefore,
      attestation_hash: attestationHash,
      attestation_hash_consumed: attestationConsumed,
      source_hash_consumed: sourceConsumed,
      signature,
    },
    mint: {
      expected_minted_wei: expectedMinted.toString(),
      minted_spk: ethers.formatEther(expectedMinted),
      energy_price_wei_per_kwh: energyPrice.toString(),
      energy_price_usd_per_kwh: ethers.formatEther(energyPrice),
      minting_fee_bps: Number(mintingFee),
      recipient_balance_after_wei: recipientBalance.toString(),
      recipient_balance_after_spk: ethers.formatEther(recipientBalance),
      cumulative_surplus_kwh_after: cumulativeSurplus.toString(),
    },
    transaction: {
      hash: receipt.hash,
      block_number: receipt.blockNumber,
      gas_used: receipt.gasUsed.toString(),
      status: receipt.status,
    },
  };

  const defaultJson = path.join("state", "proofs", `${networkName}_spk_attested_mint_proof.json`);
  const defaultMd = path.join("docs", "product", "SPK_ATTESTED_MINT_PROOF.md");
  const outJson = path.resolve(root, getArg("out-json", defaultJson));
  const outMd = path.resolve(root, getArg("out-md", defaultMd));
  writeJson(outJson, proof);
  writeMarkdown(outMd, proof);

  console.log(`minted_spk=${proof.mint.minted_spk}`);
  console.log(`source_hash=${proof.source.source_hash}`);
  console.log(`attestation_hash=${proof.attestation.attestation_hash}`);
  console.log(`tx_hash=${proof.transaction.hash}`);
  console.log(`wrote: ${outJson}`);
  console.log(`wrote: ${outMd}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
