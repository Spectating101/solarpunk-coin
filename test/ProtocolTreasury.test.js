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
    const fee = ethers.parseEther("1");
    expect(await spk.balanceOf(await spkTreasury.getAddress())).to.equal(fee);

    await spkTreasury.setBudgetVaults(
      reserveVault.address,
      insuranceVault.address,
      opsVault.address,
      auditVault.address
    );
    await spkTreasury.disburseToken(await spk.getAddress(), fee);

    expect(await spk.balanceOf(reserveVault.address)).to.equal(400n * 10n ** 15n);
    expect(await spk.balanceOf(insuranceVault.address)).to.equal(250n * 10n ** 15n);
    expect(await spk.balanceOf(opsVault.address)).to.equal(250n * 10n ** 15n);
    expect(await spk.balanceOf(auditVault.address)).to.equal(100n * 10n ** 15n);
    expect(await spk.balanceOf(await spkTreasury.getAddress())).to.equal(0n);
  });
});
