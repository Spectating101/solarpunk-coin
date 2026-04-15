const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProtocolTreasury", function () {
  let treasury;
  let usdc;
  let owner;
  let keeper;
  let reserveVault;
  let insuranceVault;
  let opsVault;
  let auditVault;

  const ONE_USDC = 1_000_000n;

  beforeEach(async function () {
    [owner, keeper, reserveVault, insuranceVault, opsVault, auditVault] = await ethers.getSigners();

    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();

    const ProtocolTreasury = await ethers.getContractFactory("ProtocolTreasury");
    treasury = await ProtocolTreasury.deploy(usdc.target);
    await treasury.waitForDeployment();

    await treasury.setBudgetVaults(
      reserveVault.address,
      insuranceVault.address,
      opsVault.address,
      auditVault.address
    );
  });

  it("splits fees across configured budget vaults", async function () {
    const amount = 1_000n * ONE_USDC;

    await usdc.mint(treasury.target, amount);
    await treasury.disburseReserveToken(amount);

    expect(await usdc.balanceOf(reserveVault.address)).to.equal(400n * ONE_USDC);
    expect(await usdc.balanceOf(insuranceVault.address)).to.equal(250n * ONE_USDC);
    expect(await usdc.balanceOf(opsVault.address)).to.equal(250n * ONE_USDC);
    expect(await usdc.balanceOf(auditVault.address)).to.equal(100n * ONE_USDC);
  });

  it("locks and later releases keeper bonds", async function () {
    const bondAmount = 500n * ONE_USDC;

    await usdc.mint(keeper.address, bondAmount);
    await usdc.connect(keeper).approve(treasury.target, bondAmount);
    await treasury.connect(keeper).depositBond(bondAmount);

    expect(await treasury.keeperBonds(keeper.address)).to.equal(bondAmount);

    await expect(treasury.connect(keeper).withdrawBond(1n)).to.be.revertedWith("bond locked");

    await ethers.provider.send("evm_increaseTime", [24 * 60 * 60 + 1]);
    await ethers.provider.send("evm_mine");

    await treasury.connect(keeper).withdrawBond(bondAmount);
    expect(await treasury.keeperBonds(keeper.address)).to.equal(0n);
    expect(await usdc.balanceOf(keeper.address)).to.equal(bondAmount);
  });

  it("slashes keeper bonds to a penalty recipient", async function () {
    const bondAmount = 200n * ONE_USDC;
    const slashAmount = 50n * ONE_USDC;

    await usdc.mint(keeper.address, bondAmount);
    await usdc.connect(keeper).approve(treasury.target, bondAmount);
    await treasury.connect(keeper).depositBond(bondAmount);

    const insuranceBefore = await usdc.balanceOf(insuranceVault.address);
    await treasury.slashBond(keeper.address, insuranceVault.address, slashAmount);

    expect(await treasury.keeperBonds(keeper.address)).to.equal(bondAmount - slashAmount);
    expect(await usdc.balanceOf(insuranceVault.address)).to.equal(insuranceBefore + slashAmount);
  });

  it("routes SPK fee balances into the budget vaults", async function () {
    const ProtocolTreasury = await ethers.getContractFactory("ProtocolTreasury");
    const SolarPunkCoin = await ethers.getContractFactory("SolarPunkCoin");

    const spkTreasury = await ProtocolTreasury.deploy(usdc.target);
    await spkTreasury.waitForDeployment();

    const spk = await SolarPunkCoin.deploy(usdc.target);
    await spk.waitForDeployment();
    await spk.setTreasury(await spkTreasury.getAddress());

    const reserveSeed = 10_000n * ONE_USDC;
    await usdc.mint(owner.address, reserveSeed);
    await usdc.connect(owner).approve(spk.target, reserveSeed);
    await spk.depositReserve(reserveSeed);
    await spk.updateOraclePriceAndAdjust(ethers.parseEther("1"));

    await spk.mintFromSurplus(1000, keeper.address);
    // stabilityFeeShare = 50% → treasury receives half of the total 0.1% mint fee
    // totalFee = 1e18, treasuryFee = 0.5e18
    const treasuryFee = ethers.parseEther("0.5");
    expect(await spk.balanceOf(await spkTreasury.getAddress())).to.equal(treasuryFee);

    await spkTreasury.setBudgetVaults(
      reserveVault.address,
      insuranceVault.address,
      opsVault.address,
      auditVault.address
    );
    await spkTreasury.disburseToken(await spk.getAddress(), treasuryFee);

    // Budget split: 40% reserve, 25% insurance, 25% ops, 10% audit applied to 0.5e18
    expect(await spk.balanceOf(reserveVault.address)).to.equal(200n * 10n ** 15n);
    expect(await spk.balanceOf(insuranceVault.address)).to.equal(125n * 10n ** 15n);
    expect(await spk.balanceOf(opsVault.address)).to.equal(125n * 10n ** 15n);
    expect(await spk.balanceOf(auditVault.address)).to.equal(50n * 10n ** 15n);
    expect(await spk.balanceOf(await spkTreasury.getAddress())).to.equal(0n);
  });

  it("enforces timelock queue for treasury admin setters when governance delay is enabled", async function () {
    const delay = 1200;
    await treasury.setGovernanceDelay(delay);

    await expect(
      treasury.setBudgetPolicy(3000, 3000, 3000, 1000)
    ).to.be.revertedWith("governance action not queued");

    const actionId = await treasury.actionIdSetBudgetPolicy(3000, 3000, 3000, 1000);
    await treasury.queueGovernanceAction(actionId);

    await expect(
      treasury.setBudgetPolicy(3000, 3000, 3000, 1000)
    ).to.be.revertedWith("governance action timelocked");

    await ethers.provider.send("evm_increaseTime", [delay + 1]);
    await ethers.provider.send("evm_mine");

    await treasury.setBudgetPolicy(3000, 3000, 3000, 1000);
    const policy = await treasury.budgetPolicy();
    expect(policy.reserveBps).to.equal(3000);
    expect(policy.insuranceBps).to.equal(3000);
    expect(policy.opsBps).to.equal(3000);
    expect(policy.auditBps).to.equal(1000);
  });

  it("allows cancelling queued treasury governance actions", async function () {
    const delay = 1200;
    await treasury.setGovernanceDelay(delay);
    const actionId = await treasury.actionIdSetBondCooldown(3600);

    await treasury.queueGovernanceAction(actionId);
    await treasury.cancelGovernanceAction(actionId);

    await ethers.provider.send("evm_increaseTime", [delay + 1]);
    await ethers.provider.send("evm_mine");

    await expect(treasury.setBondCooldown(3600)).to.be.revertedWith("governance action not queued");
  });

  it("supports rotating budget/slasher operators", async function () {
    const BUDGET_MANAGER_ROLE = await treasury.BUDGET_MANAGER_ROLE();
    const SLASHER_ROLE = await treasury.SLASHER_ROLE();

    await treasury.setOperatorRole(BUDGET_MANAGER_ROLE, keeper.address, true);
    await treasury.setOperatorRole(SLASHER_ROLE, keeper.address, true);

    const amount = 100n * ONE_USDC;
    await usdc.mint(treasury.target, amount);
    await expect(
      treasury.connect(keeper).disburseReserveToken(amount)
    ).not.to.be.reverted;

    await treasury.setOperatorRole(BUDGET_MANAGER_ROLE, keeper.address, false);
    await expect(
      treasury.connect(keeper).disburseReserveToken(1n)
    ).to.be.revertedWithCustomError(treasury, "AccessControlUnauthorizedAccount");
  });

  it("rejects unsupported treasury operator role updates", async function () {
    await expect(
      treasury.setOperatorRole(ethers.id("FAKE_ROLE"), keeper.address, true)
    ).to.be.revertedWith("unsupported role");
  });
});
