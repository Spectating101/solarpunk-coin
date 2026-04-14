const hre = require("hardhat");

function formatSpk(value) {
  return hre.ethers.formatEther(value);
}

function formatUsdc(value) {
  return hre.ethers.formatUnits(value, 6);
}

async function main() {
  const [deployer, user, keeper, reserveVault, insuranceVault, opsVault, auditVault, trader] =
    await hre.ethers.getSigners();

  const usdcDecimals = 6;
  const feeBasisPoints = 10n;

  console.log("=== SolarPunk Treasury Flow Demo ===");
  console.log(`Deployer: ${deployer.address}`);

  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();

  const ProtocolTreasury = await hre.ethers.getContractFactory("ProtocolTreasury");
  const treasury = await ProtocolTreasury.deploy(usdcAddress);
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();

  await treasury.setBudgetVaults(
    reserveVault.address,
    insuranceVault.address,
    opsVault.address,
    auditVault.address
  );

  const SolarPunkCoin = await hre.ethers.getContractFactory("SolarPunkCoin");
  const spk = await SolarPunkCoin.deploy(usdcAddress);
  await spk.waitForDeployment();
  const spkAddress = await spk.getAddress();
  await spk.setTreasury(treasuryAddress);

  const reserveSeed = hre.ethers.parseUnits("10000", usdcDecimals);
  await usdc.mint(deployer.address, reserveSeed);
  await usdc.connect(deployer).approve(spkAddress, reserveSeed);
  await spk.depositReserve(reserveSeed);

  await spk.updateOraclePriceAndAdjust(hre.ethers.parseEther("1"));

  const surplusKwh = 1000;
  const baseSpk = hre.ethers.parseEther(String(surplusKwh));
  const mintFee = (baseSpk * feeBasisPoints) / 10_000n;
  const expectedMintNet = baseSpk - mintFee;

  await spk.connect(deployer).mintFromSurplus(surplusKwh, user.address);

  console.log("\nMint flow");
  console.log(`  User SPK:     ${formatSpk(await spk.balanceOf(user.address))}`);
  console.log(`  Treasury SPK:  ${formatSpk(await spk.balanceOf(treasuryAddress))}`);
  console.log(`  Net minted:    ${formatSpk(expectedMintNet)}`);
  console.log(`  Treasury fee:  ${formatSpk(mintFee)}`);

  await treasury.disburseToken(spkAddress, mintFee);

  const reserveSpk = await spk.balanceOf(reserveVault.address);
  const insuranceSpk = await spk.balanceOf(insuranceVault.address);
  const opsSpk = await spk.balanceOf(opsVault.address);
  const auditSpk = await spk.balanceOf(auditVault.address);

  console.log("\nFee routing");
  console.log(`  Reserve vault:   ${formatSpk(reserveSpk)}`);
  console.log(`  Insurance vault: ${formatSpk(insuranceSpk)}`);
  console.log(`  Ops vault:       ${formatSpk(opsSpk)}`);
  console.log(`  Audit vault:     ${formatSpk(auditSpk)}`);

  const SolarPunkOption = await hre.ethers.getContractFactory("SolarPunkOption");
  const option = await SolarPunkOption.deploy(usdcAddress, treasuryAddress, usdcDecimals);
  await option.waitForDeployment();
  const optionAddress = await option.getAddress();
  await option.setMarginParams(1_000, 500, 100);
  await option.setTradingFeeBps(50);
  const operatorBond = hre.ethers.parseUnits("50", usdcDecimals);
  await usdc.mint(deployer.address, operatorBond);
  await usdc.approve(treasuryAddress, operatorBond);
  await treasury.depositBond(operatorBond);
  await option.setBondRequirements(operatorBond, operatorBond);

  const seriesId = hre.ethers.id("DEMO_SERIES");
  const expiry = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  const strike = 1_000_000n;
  const notional = 1_000n;
  await option.createSeries(seriesId, expiry, strike, true, notional);
  await option.updateIndex(1_000_000n, hre.ethers.ZeroHash);

  const margin = 120_000_000n;
  const tradingFee = await option.estimateTradingFee(seriesId, 1n);
  const traderCapital = margin + tradingFee + hre.ethers.parseUnits("10", usdcDecimals);
  await usdc.mint(trader.address, traderCapital);
  await usdc.connect(trader).approve(optionAddress, margin + tradingFee);
  await option.connect(trader).modifyPosition(seriesId, -1, margin);
  await option.updateIndex(1_100_000n, hre.ethers.ZeroHash);
  await option.markPosition(trader.address, seriesId);

  const insuranceBefore = await usdc.balanceOf(treasuryAddress);
  await option.liquidate(trader.address, seriesId);
  const insuranceAfter = await usdc.balanceOf(treasuryAddress);

  console.log("\nLiquidation flow");
  console.log(`  Treasury USDC before: ${formatUsdc(insuranceBefore)}`);
  console.log(`  Treasury USDC after:  ${formatUsdc(insuranceAfter)}`);
  console.log(`  Penalty gained:       ${formatUsdc(insuranceAfter - insuranceBefore)}`);

  console.log("\nTrading fee flow");
  console.log(`  Trading fee paid:     ${formatUsdc(tradingFee)}`);
  console.log(`  Operator bond set:    ${formatUsdc(operatorBond)}`);

  const bondAmount = hre.ethers.parseUnits("200", usdcDecimals);
  const slashAmount = hre.ethers.parseUnits("50", usdcDecimals);
  await usdc.mint(keeper.address, bondAmount);
  await usdc.connect(keeper).approve(treasuryAddress, bondAmount);
  await treasury.connect(keeper).depositBond(bondAmount);

  const insuranceVaultBeforeSlash = await usdc.balanceOf(insuranceVault.address);
  await treasury.slashBond(keeper.address, insuranceVault.address, slashAmount);
  const insuranceVaultAfterSlash = await usdc.balanceOf(insuranceVault.address);

  console.log("\nBond flow");
  console.log(`  Keeper bond:           ${formatUsdc(await treasury.keeperBonds(keeper.address))}`);
  console.log(`  Insurance vault delta: ${formatUsdc(insuranceVaultAfterSlash - insuranceVaultBeforeSlash)}`);

  const treasuryUsdcBalance = await usdc.balanceOf(treasuryAddress);
  await treasury.disburseToken(usdcAddress, treasuryUsdcBalance);

  console.log("\nRevenue routing");
  console.log(`  Reserve vault USDC:     ${formatUsdc(await usdc.balanceOf(reserveVault.address))}`);
  console.log(`  Insurance vault USDC:   ${formatUsdc(await usdc.balanceOf(insuranceVault.address))}`);
  console.log(`  Ops vault USDC:         ${formatUsdc(await usdc.balanceOf(opsVault.address))}`);
  console.log(`  Audit vault USDC:       ${formatUsdc(await usdc.balanceOf(auditVault.address))}`);

  console.log("\nDemo complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
