const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const { ethers } = hre;
const ROOT = path.join(__dirname, "..");

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

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
}

function toUnixSeconds(isoString) {
  const millis = Date.parse(isoString);
  if (!Number.isFinite(millis)) {
    throw new Error(`Invalid timestamp in meter bundle: ${isoString}`);
  }
  return Math.floor(millis / 1000);
}

function formatUnits(value, digits = 6) {
  return Number(Number(ethers.formatEther(value)).toFixed(digits));
}

function buildSourcePayload(bundle) {
  const accepted = bundle.accepted_attestations || [];
  return {
    schema: "SPK_METER_SURPLUS_SOURCE_V1",
    batch_id: String(bundle.batch_id),
    min_quality_threshold: Number(bundle.min_quality_threshold),
    accepted_record_hashes: accepted.map((row) => row.record_hash).sort(),
    rejected_record_count: Number(bundle.rejected_attestations?.length || 0),
    total_surplus_kwh: Number(bundle.summary?.total_surplus_kwh || 0),
  };
}

function buildAttestationInputs(bundle, recipient, blockTimestamp) {
  const accepted = bundle.accepted_attestations || [];
  if (!accepted.length) throw new Error("Meter bundle has no accepted attestations.");

  const totalSurplusKwh = Number(bundle.summary?.total_surplus_kwh || 0);
  const surplusKwh = BigInt(Math.floor(totalSurplusKwh));
  if (surplusKwh <= 0n) throw new Error("Meter bundle surplus rounds down to zero.");

  const windowStart = Math.min(...accepted.map((row) => toUnixSeconds(row.window_start)));
  const windowEnd = Math.max(...accepted.map((row) => toUnixSeconds(row.window_end)));
  if (windowStart >= windowEnd) throw new Error("Invalid accepted meter window.");

  const sourcePayload = buildSourcePayload(bundle);
  const sourcePayloadJson = stableStringify(sourcePayload);
  const sourceHash = ethers.keccak256(ethers.toUtf8Bytes(sourcePayloadJson));

  return {
    surplusKwh,
    recipient,
    windowStart,
    windowEnd,
    validAfter: blockTimestamp - 60,
    validBefore: blockTimestamp + 86_400,
    sourceHash,
    sourcePayload,
    sourcePayloadJson,
    totalSurplusKwh,
    unmintedFractionalKwh: Number((totalSurplusKwh - Number(surplusKwh)).toFixed(6)),
  };
}

async function deployStack(deployer, minter, oracle, admin) {
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

  await (await spk.grantRole(await spk.MINTER_ROLE(), minter.address)).wait();
  await (await spk.grantRole(await spk.ORACLE_ROLE(), oracle.address)).wait();

  const reserveAmount = ethers.parseUnits("100000", 6);
  await (await usdc.mint(deployer.address, reserveAmount)).wait();
  await (await usdc.approve(await spk.getAddress(), reserveAmount)).wait();
  await (await spk.depositReserve(reserveAmount)).wait();
  await (await spk.connect(oracle).updateEnergyPrice(ethers.parseEther("0.05"))).wait();
  await (await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"))).wait();

  const SolarPunkCurrencySystem = await ethers.getContractFactory("SolarPunkCurrencySystem", deployer);
  const currencySystem = await SolarPunkCurrencySystem.deploy(await spk.getAddress(), admin.address);
  await currencySystem.waitForDeployment();

  return { usdc, treasury, spk, currencySystem };
}

function writeMarkdown(filePath, receipt) {
  const lines = [];
  lines.push("# SolarPunk Field Receipt Loop");
  lines.push("");
  lines.push("This is the first internal end-to-end currency receipt loop. It intentionally uses only local repo assets and a local Hardhat chain: no external API, no public network, no grant approval, and no real counterparty dependency.");
  lines.push("");
  lines.push("## Run");
  lines.push("");
  lines.push(`- generated_at: \`${receipt.generated_at}\``);
  lines.push(`- execution_scope: \`${receipt.execution_scope}\``);
  lines.push(`- network: \`${receipt.network}\``);
  lines.push(`- chain_id: \`${receipt.chain_id}\``);
  lines.push(`- external_network_required: \`${receipt.dependencies.external_network_required}\``);
  lines.push(`- external_api_required: \`${receipt.dependencies.external_api_required}\``);
  lines.push("");
  lines.push("## Contract Stack");
  lines.push("");
  lines.push("| Contract | Address |");
  lines.push("|---|---|");
  for (const [name, address] of Object.entries(receipt.contracts)) {
    lines.push(`| ${name} | \`${address}\` |`);
  }
  lines.push("");
  lines.push("## Source Meter Evidence");
  lines.push("");
  lines.push("| Item | Value |");
  lines.push("|---|---:|");
  lines.push(`| Bundle | \`${receipt.source.bundle_path}\` |`);
  lines.push(`| Accepted records | \`${receipt.source.accepted_records}\` |`);
  lines.push(`| Rejected records | \`${receipt.source.rejected_records}\` |`);
  lines.push(`| Verified signatures | \`${receipt.source.verified_signatures}\` |`);
  lines.push(`| Total surplus | \`${receipt.source.total_surplus_kwh}\` kWh |`);
  lines.push(`| On-chain surplus | \`${receipt.source.onchain_surplus_kwh}\` kWh |`);
  lines.push(`| Source hash | \`${receipt.source.source_hash}\` |`);
  lines.push("");
  lines.push("## Flow");
  lines.push("");
  lines.push("| Step | Result | Tx |");
  lines.push("|---|---|---|");
  for (const step of receipt.flow) {
    lines.push(`| ${step.name} | ${step.result} | \`${step.tx_hash}\` |`);
  }
  lines.push("");
  lines.push("## Accounting");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  for (const [key, value] of Object.entries(receipt.accounting)) {
    lines.push(`| ${key} | \`${value}\` |`);
  }
  lines.push("");
  lines.push("## Balances");
  lines.push("");
  lines.push("| Actor | SPK |");
  lines.push("|---|---:|");
  for (const [actor, balance] of Object.entries(receipt.final_balances_spk)) {
    lines.push(`| ${actor} | \`${balance}\` |`);
  }
  lines.push("");
  lines.push("## Boundary");
  lines.push("");
  for (const boundary of receipt.claim_boundaries) {
    lines.push(`- ${boundary}`);
  }
  lines.push("");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
}

async function main() {
  const [deployer, minter, oracle, producer, serviceProvider, energyBuyer, admin] = await ethers.getSigners();
  const bundlePath = getArg("bundle", "state/attestations/latest_attestation_bundle.json");
  const bundle = readJson(bundlePath);
  const chain = await ethers.provider.getNetwork();

  const { usdc, treasury, spk, currencySystem } = await deployStack(deployer, minter, oracle, admin);
  const latestBlock = await ethers.provider.getBlock("latest");
  const inputs = buildAttestationInputs(bundle, producer.address, Number(latestBlock.timestamp));
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

  const mintTx = await spk.connect(minter).mintFromSurplusAttestation(
    inputs.surplusKwh,
    inputs.recipient,
    inputs.windowStart,
    inputs.windowEnd,
    inputs.validAfter,
    inputs.validBefore,
    inputs.sourceHash,
    signature
  );
  const mintReceipt = await mintTx.wait();

  const fieldServiceAmount = ethers.parseEther("25");
  const fieldServiceHash = ethers.id("field-receipt-loop:service-invoice:v1");
  await (await spk.connect(producer).approve(await currencySystem.getAddress(), fieldServiceAmount)).wait();
  const fieldServiceTx = await currencySystem
    .connect(producer)
    .settleInvoice(serviceProvider.address, fieldServiceAmount, fieldServiceHash);
  const fieldServiceReceipt = await fieldServiceTx.wait();

  const energyCreditAmount = ethers.parseEther("50");
  const energyCreditHash = ethers.id("field-receipt-loop:energy-credit-settlement:v1");
  await (await spk.connect(producer).approve(await currencySystem.getAddress(), energyCreditAmount)).wait();
  const energyCreditTx = await currencySystem
    .connect(producer)
    .settleInvoice(energyBuyer.address, energyCreditAmount, energyCreditHash);
  const energyCreditReceipt = await energyCreditTx.wait();

  const redemptionAmount = ethers.parseEther("20");
  const [energyPricePerKwh, owedKwhWad] = await currencySystem.quoteRedemption(redemptionAmount);
  const redemptionSourceHash = ethers.id("field-receipt-loop:redemption:v1");
  await (await spk.connect(energyBuyer).approve(await currencySystem.getAddress(), redemptionAmount)).wait();
  const redemptionTx = await currencySystem
    .connect(energyBuyer)
    .openRedemption(energyBuyer.address, redemptionAmount, owedKwhWad, redemptionSourceHash);
  const redemptionReceipt = await redemptionTx.wait();

  const deliveryHash = ethers.id("field-receipt-loop:delivered-kwh:v1");
  const deliveryTx = await currencySystem.connect(admin).resolveRedemption(1, owedKwhWad, deliveryHash);
  const deliveryReceipt = await deliveryTx.wait();

  const [producerBalance, serviceBalance, buyerBalance, totalSupply] = await Promise.all([
    spk.balanceOf(producer.address),
    spk.balanceOf(serviceProvider.address),
    spk.balanceOf(energyBuyer.address),
    spk.totalSupply(),
  ]);
  const activeCirculating = producerBalance + serviceBalance + buyerBalance;
  const conservationPass = activeCirculating === expectedMinted - redemptionAmount;
  const redemption = await currencySystem.redemptions(1);

  const receipt = {
    generated_at: new Date().toISOString(),
    title: "SolarPunk Field Receipt Loop",
    execution_scope: "local_deterministic_no_external_dependencies",
    network: hre.network.name,
    chain_id: Number(chain.chainId),
    dependencies: {
      external_network_required: false,
      external_api_required: false,
      grant_or_external_approval_required: false,
      real_counterparty_required: false,
      input_source: "repo_fixture_signed_meter_bundle",
    },
    contracts: {
      MockUSDC: await usdc.getAddress(),
      ProtocolTreasury: await treasury.getAddress(),
      SolarPunkCoin: await spk.getAddress(),
      SolarPunkCurrencySystem: await currencySystem.getAddress(),
    },
    actors: {
      deployer: deployer.address,
      minter: minter.address,
      oracle: oracle.address,
      producer: producer.address,
      service_provider: serviceProvider.address,
      energy_buyer: energyBuyer.address,
      admin_operator: admin.address,
    },
    source: {
      bundle_path: bundlePath,
      source_schema: bundle.source_schema || "unknown",
      batch_id: bundle.batch_id,
      accepted_records: bundle.summary?.accepted_records || 0,
      rejected_records: bundle.summary?.rejected_records || 0,
      verified_signatures: bundle.summary?.verified_signatures || 0,
      total_surplus_kwh: inputs.totalSurplusKwh,
      onchain_surplus_kwh: inputs.surplusKwh.toString(),
      unminted_fractional_kwh: inputs.unmintedFractionalKwh,
      source_hash: inputs.sourceHash,
      attestation_hash: attestationHash,
      source_payload: inputs.sourcePayload,
    },
    flow: [
      {
        name: "signed_surplus_mint",
        result: `${formatUnits(expectedMinted)} SPK minted to producer`,
        tx_hash: mintReceipt.hash,
      },
      {
        name: "field_service_invoice_settlement",
        result: "25 SPK paid to field service provider",
        tx_hash: fieldServiceReceipt.hash,
        invoice_hash: fieldServiceHash,
      },
      {
        name: "energy_credit_settlement",
        result: "50 SPK paid to energy buyer as redeemable credit balance",
        tx_hash: energyCreditReceipt.hash,
        invoice_hash: energyCreditHash,
      },
      {
        name: "redemption_opened",
        result: `${formatUnits(redemptionAmount)} SPK burned into ${formatUnits(owedKwhWad, 4)} owed kWh receipt`,
        tx_hash: redemptionReceipt.hash,
        source_hash: redemptionSourceHash,
      },
      {
        name: "delivery_resolved",
        result: `${formatUnits(owedKwhWad, 4)} kWh fulfilled`,
        tx_hash: deliveryReceipt.hash,
        resolution_hash: deliveryHash,
      },
    ],
    accounting: {
      minted_spk: formatUnits(expectedMinted),
      settlement_volume_spk: formatUnits(fieldServiceAmount + energyCreditAmount),
      redeemed_spk: formatUnits(redemptionAmount),
      active_circulating_spk: formatUnits(activeCirculating),
      owed_kwh: formatUnits(owedKwhWad, 4),
      delivered_kwh: formatUnits(redemption.deliveredKwhWad, 4),
      shortfall_kwh: formatUnits(redemption.shortfallKwhWad, 4),
      energy_price_usd_per_kwh: formatUnits(energyPricePerKwh, 4),
      conservation_pass: conservationPass,
      delivery_fulfilled: Number(redemption.state) === 1,
      contract_total_supply_after_spk: formatUnits(totalSupply),
    },
    final_balances_spk: {
      producer: formatUnits(producerBalance),
      service_provider: formatUnits(serviceBalance),
      energy_buyer: formatUnits(buyerBalance),
    },
    claim_boundaries: [
      "This is a deterministic local field-receipt experiment, not public network evidence.",
      "It relies only on repo fixtures, local Hardhat contracts, and local signers.",
      "It proves the internal clearing loop from signed meter surplus to SPK mint, invoice settlement, redemption burn, owed-kWh receipt, and delivery resolution.",
      "It does not prove hardware certification, legal redemption enforceability, real customer demand, audit completion, or mainnet readiness.",
    ],
  };

  const outJson = path.join(ROOT, getArg("out-json", "state/product/field_receipt_loop.json"));
  const outMd = path.join(ROOT, getArg("out-md", "docs/product/FIELD_RECEIPT_LOOP.md"));
  writeJson(outJson, receipt);
  writeMarkdown(outMd, receipt);

  console.log(`field_receipt_loop=${receipt.execution_scope}`);
  console.log(`minted_spk=${receipt.accounting.minted_spk}`);
  console.log(`redeemed_spk=${receipt.accounting.redeemed_spk}`);
  console.log(`owed_kwh=${receipt.accounting.owed_kwh}`);
  console.log(`conservation_pass=${receipt.accounting.conservation_pass}`);
  console.log(`wrote: ${outJson}`);
  console.log(`wrote: ${outMd}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
