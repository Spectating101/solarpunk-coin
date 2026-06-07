const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const { ethers } = hre;
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "state", "product", "energy_native_currency_demo.json");

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
}

function fmt(value, digits = 4) {
  return Number(Number(ethers.formatEther(value)).toFixed(digits));
}

async function main() {
  const [deployer, producer, buyer] = await ethers.getSigners();

  const MockUSDC = await ethers.getContractFactory("MockUSDC", deployer);
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();

  const SolarPunkCoin = await ethers.getContractFactory("SolarPunkCoin", deployer);
  const spk = await SolarPunkCoin.deploy(await usdc.getAddress());
  await spk.waitForDeployment();

  const SolarPunkCurrencySystem = await ethers.getContractFactory("SolarPunkCurrencySystem", deployer);
  const currency = await SolarPunkCurrencySystem.deploy(await spk.getAddress(), deployer.address);
  await currency.waitForDeployment();

  const minterRole = await spk.MINTER_ROLE();
  const oracleRole = await spk.ORACLE_ROLE();
  await (await spk.grantRole(minterRole, deployer.address)).wait();
  await (await spk.grantRole(oracleRole, deployer.address)).wait();

  const reserveAmount = ethers.parseUnits("1000000", 6);
  await (await usdc.mint(deployer.address, reserveAmount)).wait();
  await (await usdc.approve(await spk.getAddress(), reserveAmount)).wait();
  await (await spk.depositReserve(reserveAmount)).wait();

  await (await spk.connect(deployer).updateOraclePriceAndAdjust(ethers.parseEther("1"))).wait();
  await (await spk.connect(deployer).setReferenceUsdPerKwh(ethers.parseEther("0.05"))).wait();

  const surplusKwh = 2606;
  const mintEstimate = await spk.estimateMintAmount(surplusKwh);
  await (await spk.connect(deployer).mintFromSurplus(surplusKwh, producer.address)).wait();

  const invoiceHash = ethers.id("energy-native:invoice:maintenance");
  await (await spk.connect(producer).transfer(buyer.address, ethers.parseEther("100"))).wait();
  await (await spk.connect(buyer).approve(currency.target, ethers.parseEther("25"))).wait();
  await (
    await currency.connect(buyer).settleInvoice(
      producer.address,
      ethers.parseEther("25"),
      invoiceHash
    )
  ).wait();

  const redeemAmount = ethers.parseEther("20");
  const owedKwh = await spk.quoteRedemptionKwh(redeemAmount);
  const sourceHash = ethers.id("energy-native:redemption:buyer");
  await (await spk.connect(buyer).approve(currency.target, redeemAmount)).wait();
  await (
    await currency.connect(buyer).openRedemption(buyer.address, redeemAmount, owedKwh, sourceHash)
  ).wait();
  await (
    await currency.connect(deployer).resolveRedemption(1, owedKwh, ethers.id("utility:delivered"))
  ).wait();

  const supplyBeforePeg = await spk.totalSupply();
  await (await spk.connect(deployer).setPegEnabled(true)).wait();
  await (await spk.connect(deployer).updateOraclePriceAndAdjust(ethers.parseEther("1.08"))).wait();
  const supplyAfterPeg = await spk.totalSupply();

  const report = {
    schema: "SPK_ENERGY_NATIVE_DEMO_V1",
    generated_at: new Date().toISOString(),
    issuance_mode: Number(await spk.issuanceMode()),
    peg_enabled: await spk.pegEnabled(),
    kwh_per_spk: fmt(await spk.kwhPerSpkWad()),
    reference_usd_per_kwh: fmt(await spk.referenceUsdPerKwh()),
    implied_usd_per_spk: fmt(await spk.impliedUsdPerSpk()),
    surplus_kwh: surplusKwh,
    minted_spk_estimate: fmt(mintEstimate),
    producer_balance_spk: fmt(await spk.balanceOf(producer.address)),
    buyer_balance_spk: fmt(await spk.balanceOf(buyer.address)),
    invoice_settled_spk: 25,
    redeemed_spk: fmt(redeemAmount),
    redeemed_kwh: fmt(owedKwh),
    total_redeemed_spk: fmt(await currency.totalRedeemedSpk()),
    total_delivered_kwh: fmt(await currency.totalDeliveredKwhWad()),
    supply_before_peg: fmt(supplyBeforePeg),
    supply_after_peg: fmt(supplyAfterPeg),
    peg_minted_spk: fmt(supplyAfterPeg - supplyBeforePeg),
    contracts: {
      spk: await spk.getAddress(),
      currency_system: await currency.target,
    },
    narrative: [
      "Energy-native issuance: verified surplus kWh maps 1:1 to SPK (minus mint fee).",
      "Optional referenceUsdPerKwh is reporting-only; it does not change mint math.",
      "Redemption burns SPK and records owed kWh for off-chain utility delivery.",
      "pegEnabled overlays PI supply control when a USD peg is desired.",
    ],
  };

  writeJson(OUT, report);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
