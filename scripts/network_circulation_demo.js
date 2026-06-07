const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const { ethers } = hre;
const ROOT = path.join(__dirname, "..");
const OUT_JSON = path.join(ROOT, "state", "product", "network_circulation_demo.json");
const OUT_MD = path.join(ROOT, "docs", "product", "NETWORK_CIRCULATION_DEMO.md");

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
}

function writeMarkdown(filePath, report) {
  const lines = [
    "# Network Circulation Demo",
    "",
    `- generated_at: \`${report.generated_at}\``,
    `- thesis: ${report.thesis}`,
    "",
    "## Identity",
    "",
    report.identity,
    "",
    "## Flow",
    "",
    "| Step | Action | SPK | Note |",
    "|---:|---|---:|---|",
  ];
  for (const step of report.steps) {
    lines.push(`| ${step.index} | ${step.action} | ${step.spk} | ${step.note} |`);
  }
  lines.push("");
  lines.push("## Network Metrics");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  for (const [key, value] of Object.entries(report.metrics)) {
    lines.push(`| ${key} | \`${value}\` |`);
  }
  lines.push("");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, lines.join("\n") + "\n", "utf-8");
}

function fmt(value, digits = 4) {
  return Number(Number(ethers.formatEther(value)).toFixed(digits));
}

async function settle(currency, payer, payee, amount, invoiceId, kind) {
  const amountWei = ethers.parseEther(String(amount));
  const invoiceHash = ethers.id(invoiceId);
  await (await currency.connect(payer).settleNetworkPayment(payee.address, amountWei, invoiceHash, kind)).wait();
    return { amount, invoiceId, kind };
}

async function main() {
  const [deployer, producer, gateway, maintenance, buyer, merchant] = await ethers.getSigners();

  const MockUSDC = await ethers.getContractFactory("MockUSDC", deployer);
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();

  const SolarPunkCoin = await ethers.getContractFactory("SolarPunkCoin", deployer);
  const spk = await SolarPunkCoin.deploy(await usdc.getAddress());
  await spk.waitForDeployment();

  const SolarPunkCurrencySystem = await ethers.getContractFactory("SolarPunkCurrencySystem", deployer);
  const currency = await SolarPunkCurrencySystem.deploy(await spk.getAddress(), deployer.address);
  await currency.waitForDeployment();

  await (await spk.grantRole(await spk.MINTER_ROLE(), deployer.address)).wait();
  await (await spk.grantRole(await spk.ORACLE_ROLE(), deployer.address)).wait();

  const reserveAmount = ethers.parseUnits("1000000", 6);
  await (await usdc.mint(deployer.address, reserveAmount)).wait();
  await (await usdc.approve(await spk.getAddress(), reserveAmount)).wait();
  await (await spk.depositReserve(reserveAmount)).wait();

  await (await spk.connect(deployer).updateOraclePriceAndAdjust(ethers.parseEther("1"))).wait();
  await (await spk.connect(deployer).setReferenceUsdPerKwh(ethers.parseEther("0.05"))).wait();

  const surplusKwh = 2606;
  await (await spk.connect(deployer).mintFromSurplus(surplusKwh, producer.address)).wait();
  const mintedToProducer = await spk.balanceOf(producer.address);

  const KIND_SERVICE = ethers.id("SERVICE");
  const KIND_LABOR = ethers.id("LABOR");
  const KIND_GOODS = ethers.id("GOODS");
  const KIND_NETWORK = ethers.id("NETWORK");

  const steps = [];
  let index = 1;

  const approveAndSettle = async (payer, payee, amount, invoiceId, kind, action, note) => {
    await (await spk.connect(payer).approve(currency.target, ethers.parseEther(String(amount)))).wait();
    await settle(currency, payer, payee, amount, invoiceId, kind);
    steps.push({ index: index++, action, spk: amount, note });
  };

  await approveAndSettle(
    producer,
    gateway,
    12,
    "network:invoice:gateway-may",
    KIND_SERVICE,
    "network_payment",
    "Producer pays meter gateway for attestation service."
  );
  await approveAndSettle(
    producer,
    maintenance,
    40,
    "network:invoice:maintenance-may",
    KIND_LABOR,
    "network_payment",
    "Producer pays maintenance crew in SPK — not a utility bill."
  );
  await approveAndSettle(
    producer,
    buyer,
    180,
    "network:invoice:buyer-allocation-may",
    KIND_NETWORK,
    "network_payment",
    "Producer allocates SPK into the local network economy."
  );
  await approveAndSettle(
    buyer,
    merchant,
    55,
    "network:invoice:merchant-goods-may",
    KIND_GOODS,
    "network_payment",
    "Buyer spends SPK on local goods — primary money use."
  );
  await approveAndSettle(
    merchant,
    producer,
    20,
    "network:invoice:merchant-supply-may",
    KIND_GOODS,
    "network_payment",
    "Merchant settles supply invoice back to producer."
  );

  let metrics = await currency.networkMetrics();
  const circulationBeforeExit = Number(metrics.circulationShareBps) / 100;

  const redeemAmount = ethers.parseEther("15");
  const owedKwh = await spk.quoteRedemptionKwh(redeemAmount);
  await (await spk.connect(buyer).approve(currency.target, redeemAmount)).wait();
  await (
    await currency.connect(buyer).openRedemption(
      buyer.address,
      redeemAmount,
      owedKwh,
      ethers.id("network:optional-energy-exit")
    )
  ).wait();
  await (
    await currency.connect(deployer).resolveRedemption(1, owedKwh, ethers.id("utility:optional-delivery"))
  ).wait();
  steps.push({
    index: index++,
    action: "optional_redemption",
    spk: 15,
    note: "Small optional energy exit — secondary sink, not the product identity.",
  });

  metrics = await currency.networkMetrics();

  const report = {
    schema: "SPK_NETWORK_CIRCULATION_DEMO_V1",
    generated_at: new Date().toISOString(),
    thesis:
      "SPK is network settlement money issued against verified energy surplus. Circulation is primary; energy redemption is an optional exit.",
    identity:
      "Issuance anchor = surplus kWh. Public face = replay-protected network payments between participants. Not a dollar peg. Not an electricity-company coupon.",
    issuance: {
      mode: "energy_native",
      surplus_kwh: surplusKwh,
      minted_to_producer_spk: fmt(mintedToProducer),
      kwh_per_spk: fmt(await spk.kwhPerSpkWad()),
      peg_enabled: await spk.pegEnabled(),
      reference_usd_per_kwh: fmt(await spk.referenceUsdPerKwh()),
      implied_usd_per_spk: fmt(await spk.impliedUsdPerSpk()),
    },
    steps,
    balances: {
      producer_spk: fmt(await spk.balanceOf(producer.address)),
      gateway_spk: fmt(await spk.balanceOf(gateway.address)),
      maintenance_spk: fmt(await spk.balanceOf(maintenance.address)),
      buyer_spk: fmt(await spk.balanceOf(buyer.address)),
      merchant_spk: fmt(await spk.balanceOf(merchant.address)),
    },
    settlement_by_kind: {
      SERVICE: fmt(await currency.settledSpkByPaymentKind(KIND_SERVICE)),
      LABOR: fmt(await currency.settledSpkByPaymentKind(KIND_LABOR)),
      GOODS: fmt(await currency.settledSpkByPaymentKind(KIND_GOODS)),
      NETWORK: fmt(await currency.settledSpkByPaymentKind(KIND_NETWORK)),
    },
    metrics: {
      total_settled_spk: fmt(metrics.settledSpk),
      total_redeemed_spk: fmt(metrics.redeemedSpk),
      circulation_share_percent: Number(metrics.circulationShareBps) / 100,
      redemption_share_percent: Number(metrics.redemptionShareBps) / 100,
      circulation_share_before_optional_exit_percent: circulationBeforeExit,
      network_payment_count: Number(metrics.networkPaymentCount),
      redemption_count: Number(metrics.redemptionCount),
    },
    contracts: {
      spk: await spk.getAddress(),
      currency_system: await currency.target,
    },
  };

  writeJson(OUT_JSON, report);
  writeMarkdown(OUT_MD, report);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
