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

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf-8");
}

function toUnixSeconds(isoString) {
  const millis = Date.parse(isoString);
  if (!Number.isFinite(millis)) {
    throw new Error(`Invalid timestamp in meter bundle: ${isoString}`);
  }
  return Math.floor(millis / 1000);
}

function formatEtherNumber(value, digits = 6) {
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

async function deployGovernedPilotStack(signers) {
  const { deployer, minter, oracle, governanceAdmin } = signers;

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

  const SolarPunkCurrencySystem = await ethers.getContractFactory("SolarPunkCurrencySystem", deployer);
  const currencySystem = await SolarPunkCurrencySystem.deploy(await spk.getAddress(), governanceAdmin.address);
  await currencySystem.waitForDeployment();

  const minterRole = await spk.MINTER_ROLE();
  const oracleRole = await spk.ORACLE_ROLE();
  const reserveRole = await spk.RESERVE_MANAGER_ROLE();
  const pauserRole = await spk.PAUSER_ROLE();
  const stabilizerRole = await spk.STABILIZER_ROLE();
  const spkAdminRole = await spk.DEFAULT_ADMIN_ROLE();
  const treasuryAdminRole = await treasury.DEFAULT_ADMIN_ROLE();
  const budgetRole = await treasury.BUDGET_MANAGER_ROLE();
  const slasherRole = await treasury.SLASHER_ROLE();

  for (const [role, account] of [
    [minterRole, minter.address],
    [oracleRole, oracle.address],
    [reserveRole, governanceAdmin.address],
    [pauserRole, governanceAdmin.address],
    [stabilizerRole, governanceAdmin.address],
  ]) {
    if (!(await spk.hasRole(role, account))) {
      await (await spk.grantRole(role, account)).wait();
    }
  }

  for (const [role, account] of [
    [treasuryAdminRole, governanceAdmin.address],
    [budgetRole, governanceAdmin.address],
    [slasherRole, governanceAdmin.address],
  ]) {
    if (!(await treasury.hasRole(role, account))) {
      await (await treasury.grantRole(role, account)).wait();
    }
  }

  const reserveAmount = ethers.parseUnits("100000", 6);
  await (await usdc.mint(deployer.address, reserveAmount)).wait();
  await (await usdc.approve(await spk.getAddress(), reserveAmount)).wait();
  await (await spk.depositReserve(reserveAmount)).wait();
  await (await spk.connect(oracle).updateEnergyPrice(ethers.parseEther("0.05"))).wait();
  await (await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"))).wait();

  for (const role of [minterRole, oracleRole, reserveRole, pauserRole, stabilizerRole]) {
    if (await spk.hasRole(role, deployer.address)) {
      await (await spk.revokeRole(role, deployer.address)).wait();
    }
  }

  if ((await spk.owner()).toLowerCase() !== governanceAdmin.address.toLowerCase()) {
    await (await spk.handoffAdmin(governanceAdmin.address)).wait();
  }

  if (await treasury.hasRole(treasuryAdminRole, deployer.address)) {
    await (await treasury.renounceRole(treasuryAdminRole, deployer.address)).wait();
  }
  if (await treasury.hasRole(budgetRole, deployer.address)) {
    await (await treasury.renounceRole(budgetRole, deployer.address)).wait();
  }
  if (await treasury.hasRole(slasherRole, deployer.address)) {
    await (await treasury.renounceRole(slasherRole, deployer.address)).wait();
  }

  const currencyAdminRole = await currencySystem.DEFAULT_ADMIN_ROLE();
  const currencyOperatorRole = await currencySystem.OPERATOR_ROLE();

  return {
    usdc,
    treasury,
    spk,
    currencySystem,
    roles: {
      spk_admin: spkAdminRole,
      minter: minterRole,
      oracle: oracleRole,
      reserve_manager: reserveRole,
      pauser: pauserRole,
      stabilizer: stabilizerRole,
      treasury_admin: treasuryAdminRole,
      budget_manager: budgetRole,
      slasher: slasherRole,
      currency_admin: currencyAdminRole,
      currency_operator: currencyOperatorRole,
    },
    reserveAmount,
  };
}

async function buildGovernanceChecks(stack, signers) {
  const { deployer, minter, oracle, governanceAdmin } = signers;
  const { spk, treasury, currencySystem, roles } = stack;

  return {
    spk_owner_is_governance_admin: (await spk.owner()).toLowerCase() === governanceAdmin.address.toLowerCase(),
    spk_default_admin_is_governance_admin: await spk.hasRole(roles.spk_admin, governanceAdmin.address),
    spk_deployer_default_admin_revoked: !(await spk.hasRole(roles.spk_admin, deployer.address)),
    spk_minter_role_separated: await spk.hasRole(roles.minter, minter.address),
    spk_oracle_role_separated: await spk.hasRole(roles.oracle, oracle.address),
    treasury_default_admin_is_governance_admin: await treasury.hasRole(roles.treasury_admin, governanceAdmin.address),
    treasury_deployer_default_admin_revoked: !(await treasury.hasRole(roles.treasury_admin, deployer.address)),
    currency_default_admin_is_governance_admin: await currencySystem.hasRole(roles.currency_admin, governanceAdmin.address),
    currency_operator_is_governance_admin: await currencySystem.hasRole(roles.currency_operator, governanceAdmin.address),
  };
}

function allValuesTrue(record) {
  return Object.values(record).every(Boolean);
}

function toMarkdown(receipt) {
  const lines = [];
  lines.push("# SolarPunk Pilot Stack Currency Drill");
  lines.push("");
  lines.push("This is the aggressive internal bridge from protocol pieces to one SPK cryptocurrency system: deploy the governed-style pilot stack, mint SPK from accepted surplus energy evidence, spend SPK, redeem SPK into an owed-kWh claim, and resolve delivery.");
  lines.push("");
  lines.push("## Run");
  lines.push("");
  lines.push(`- generated_at: \`${receipt.generated_at}\``);
  lines.push(`- network: \`${receipt.network}\``);
  lines.push(`- chain_id: \`${receipt.chain_id}\``);
  lines.push(`- execution_scope: \`${receipt.execution_scope}\``);
  lines.push(`- all_checks_passed: \`${receipt.all_checks_passed}\``);
  lines.push("");
  lines.push("## Stack");
  lines.push("");
  lines.push("| Contract | Address |");
  lines.push("|---|---|");
  for (const [name, address] of Object.entries(receipt.contracts)) {
    lines.push(`| ${name} | \`${address}\` |`);
  }
  lines.push("");
  lines.push("## Governance Checks");
  lines.push("");
  lines.push("| Check | Pass |");
  lines.push("|---|---:|");
  for (const [name, pass] of Object.entries(receipt.governance_checks)) {
    lines.push(`| ${name} | \`${pass}\` |`);
  }
  lines.push("");
  lines.push("## SPK Cryptocurrency Flow");
  lines.push("");
  lines.push("| Step | Result |");
  lines.push("|---|---|");
  for (const step of receipt.flow) {
    lines.push(`| ${step.name} | ${step.result} |`);
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
  lines.push("## What This Moves Forward");
  lines.push("");
  lines.push("- It proves the latest SPK coin, treasury, and currency-system contracts can run as one stack.");
  lines.push("- It proves SPK is not only minted; it can circulate through payment and redemption accounting.");
  lines.push("- It gives the next Sepolia deployment a concrete acceptance test: the same drill should pass against the public testnet stack.");
  lines.push("");
  lines.push("## Boundary");
  lines.push("");
  for (const boundary of receipt.boundaries) {
    lines.push(`- ${boundary}`);
  }
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const [deployer, minter, oracle, governanceAdmin, producer, serviceProvider, energyBuyer] = await ethers.getSigners();
  const bundlePath = getArg("bundle", "state/attestations/latest_attestation_bundle.json");
  const bundle = readJson(bundlePath);
  const chain = await ethers.provider.getNetwork();

  const signers = { deployer, minter, oracle, governanceAdmin };
  const stack = await deployGovernedPilotStack(signers);
  const { spk, currencySystem, usdc, treasury } = stack;

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
  await mintTx.wait();

  const serviceAmount = ethers.parseEther("25");
  const serviceInvoiceHash = ethers.id("pilot-stack-drill:service-invoice:v1");
  await (await spk.connect(producer).approve(await currencySystem.getAddress(), serviceAmount)).wait();
  await (await currencySystem.connect(producer).settleInvoice(serviceProvider.address, serviceAmount, serviceInvoiceHash)).wait();

  const energyCreditAmount = ethers.parseEther("50");
  const energyInvoiceHash = ethers.id("pilot-stack-drill:energy-credit:v1");
  await (await spk.connect(producer).approve(await currencySystem.getAddress(), energyCreditAmount)).wait();
  await (await currencySystem.connect(producer).settleInvoice(energyBuyer.address, energyCreditAmount, energyInvoiceHash)).wait();

  const redemptionAmount = ethers.parseEther("20");
  const [energyPricePerKwh, owedKwhWad] = await currencySystem.quoteRedemption(redemptionAmount);
  const redemptionSourceHash = ethers.id("pilot-stack-drill:redemption:v1");
  await (await spk.connect(energyBuyer).approve(await currencySystem.getAddress(), redemptionAmount)).wait();
  await (await currencySystem.connect(energyBuyer).openRedemption(energyBuyer.address, redemptionAmount, owedKwhWad, redemptionSourceHash)).wait();

  const resolutionHash = ethers.id("pilot-stack-drill:delivery-resolution:v1");
  await (await currencySystem.connect(governanceAdmin).resolveRedemption(1, owedKwhWad, resolutionHash)).wait();

  const [producerBalance, serviceBalance, buyerBalance, totalSupply, currencyNextPayment, currencyNextRedemption] =
    await Promise.all([
      spk.balanceOf(producer.address),
      spk.balanceOf(serviceProvider.address),
      spk.balanceOf(energyBuyer.address),
      spk.totalSupply(),
      currencySystem.nextPaymentId(),
      currencySystem.nextRedemptionId(),
    ]);
  const redemption = await currencySystem.redemptions(1);
  const activeCirculating = producerBalance + serviceBalance + buyerBalance;
  const protocolFeeInventory = totalSupply - activeCirculating;
  const accounting = {
    accepted_surplus_kwh: inputs.totalSurplusKwh,
    onchain_surplus_kwh: Number(inputs.surplusKwh),
    minted_to_producer_spk: formatEtherNumber(expectedMinted),
    settlement_volume_spk: formatEtherNumber(serviceAmount + energyCreditAmount),
    redeemed_spk: formatEtherNumber(redemptionAmount),
    active_circulating_spk: formatEtherNumber(activeCirculating),
    protocol_fee_inventory_spk: formatEtherNumber(protocolFeeInventory),
    owed_kwh: formatEtherNumber(owedKwhWad, 4),
    delivered_kwh: formatEtherNumber(redemption.deliveredKwhWad, 4),
    shortfall_kwh: formatEtherNumber(redemption.shortfallKwhWad, 4),
    energy_price_usd_per_kwh: formatEtherNumber(energyPricePerKwh, 4),
    total_supply_after_spk: formatEtherNumber(totalSupply),
    currency_next_payment_id: Number(currencyNextPayment),
    currency_next_redemption_id: Number(currencyNextRedemption),
    conservation_pass: activeCirculating === expectedMinted - redemptionAmount,
    delivery_fulfilled: Number(redemption.state) === 1,
  };
  const governanceChecks = await buildGovernanceChecks(stack, signers);
  const allChecksPassed =
    allValuesTrue(governanceChecks) &&
    accounting.conservation_pass &&
    accounting.delivery_fulfilled &&
    accounting.owed_kwh === accounting.delivered_kwh &&
    accounting.shortfall_kwh === 0;

  const receipt = {
    generated_at: new Date().toISOString(),
    title: "SolarPunk Pilot Stack Currency Drill",
    execution_scope: "local_governed_pilot_stack_currency_drill",
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
      governance_admin: governanceAdmin.address,
      producer: producer.address,
      service_provider: serviceProvider.address,
      energy_buyer: energyBuyer.address,
    },
    source: {
      bundle_path: bundlePath,
      source_schema: bundle.source_schema || "unknown",
      batch_id: bundle.batch_id,
      accepted_records: bundle.summary?.accepted_records || 0,
      rejected_records: bundle.summary?.rejected_records || 0,
      verified_signatures: bundle.summary?.verified_signatures || 0,
      source_hash: inputs.sourceHash,
      attestation_hash: attestationHash,
      source_payload: inputs.sourcePayload,
    },
    governance_checks: governanceChecks,
    flow: [
      {
        name: "attested_surplus_mint",
        result: `${accounting.minted_to_producer_spk} SPK minted to producer from ${accounting.onchain_surplus_kwh} kWh`,
      },
      {
        name: "service_invoice_payment",
        result: "25 SPK paid to a service provider through SolarPunkCurrencySystem",
      },
      {
        name: "energy_credit_payment",
        result: "50 SPK paid to an energy buyer through SolarPunkCurrencySystem",
      },
      {
        name: "redemption_claim",
        result: `20 SPK burned into ${accounting.owed_kwh} owed kWh`,
      },
      {
        name: "delivery_resolution",
        result: `${accounting.delivered_kwh} kWh delivered with ${accounting.shortfall_kwh} kWh shortfall`,
      },
    ],
    accounting,
    all_checks_passed: allChecksPassed,
    boundaries: [
      "This is a local pilot-stack drill, not a public network deployment.",
      "It proves the latest contracts work together as a cryptocurrency system: mint, payment, redemption, and delivery accounting.",
      "It does not prove real hardware provenance, legal redemption enforceability, customer demand, external audit, or mainnet readiness.",
      "The next public step is to run this drill against a governed Sepolia stack and then replace fixture meter evidence with a real operator export.",
    ],
  };

  const outJson = path.join(ROOT, getArg("out-json", "state/product/pilot_stack_currency_drill.json"));
  const outMd = path.join(ROOT, getArg("out-md", "docs/product/PILOT_STACK_CURRENCY_DRILL.md"));
  writeJson(outJson, receipt);
  writeText(outMd, toMarkdown(receipt));

  console.log(`pilot_stack_drill=${receipt.execution_scope}`);
  console.log(`all_checks_passed=${receipt.all_checks_passed}`);
  console.log(`minted_spk=${receipt.accounting.minted_to_producer_spk}`);
  console.log(`settlement_volume_spk=${receipt.accounting.settlement_volume_spk}`);
  console.log(`redeemed_spk=${receipt.accounting.redeemed_spk}`);
  console.log(`owed_kwh=${receipt.accounting.owed_kwh}`);
  console.log(`wrote: ${outJson}`);
  console.log(`wrote: ${outMd}`);

  if (!receipt.all_checks_passed) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
