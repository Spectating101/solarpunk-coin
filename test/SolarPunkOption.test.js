const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SolarPunkOption", () => {
  let option;
  let usdc;
  let owner;
  let oracle;
  let liquidator;
  let trader;

  const SERIES_ID = ethers.id("SERIES_JAN_2026_PUT_50");
  const STRIKE = 1_000_000n; // $1.00 with 6 decimals
  const NOTIONAL = 1_000n; // kWh per contract
  const PRICE_DECIMALS = 6;

  beforeEach(async () => {
    [owner, oracle, liquidator, trader] = await ethers.getSigners();

    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();

    const SolarPunkOption = await ethers.getContractFactory("SolarPunkOption");
    option = await SolarPunkOption.deploy(usdc.target, owner.address, PRICE_DECIMALS);
    await option.waitForDeployment();

    // Loosen margins for tests (10% IM, 5% MM, 1% penalty)
    await option.setMarginParams(1_000, 500, 100);

    // Roles
    const ORACLE_ROLE = await option.ORACLE_ROLE();
    const LIQUIDATOR_ROLE = await option.LIQUIDATOR_ROLE();
    await option.grantRole(ORACLE_ROLE, oracle.address);
    await option.grantRole(LIQUIDATOR_ROLE, liquidator.address);

    // Seed trader with collateral
    await usdc.mint(trader.address, 3_000_000_000n); // 3000 USDC (6 decimals)
    await usdc.connect(trader).approve(option.target, 3_000_000_000n);

    // Create series and set initial index
    const expiry = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    await option.createSeries(SERIES_ID, expiry, STRIKE, true, NOTIONAL);
    await option.connect(oracle).updateIndex(STRIKE, ethers.ZeroHash);
  });

  it("deploys with correct settings", async () => {
    expect(await option.priceDecimals()).to.equal(PRICE_DECIMALS);
    expect(await option.collateral()).to.equal(usdc.target);
    const series = await option.series(SERIES_ID);
    expect(series.exists).to.equal(true);
    expect(series.notional).to.equal(NOTIONAL);
  });

  it("opens a long position and accrues positive PnL when index rises", async () => {
    // Post initial margin and open 1 long
    const margin = 200_000_000n; // 200 USDC
    await option.connect(trader).modifyPosition(SERIES_ID, 1, margin);

    const pos = await option.getPosition(trader.address, SERIES_ID);
    expect(pos.qty).to.equal(1);
    expect(pos.margin).to.equal(margin);

    // Index up to $1.20 → payoff increases by $0.20 * 1000 = $200
    await option.connect(oracle).updateIndex(1_200_000n, ethers.ZeroHash);
    await option.markPosition(trader.address, SERIES_ID);

    const updated = await option.getPosition(trader.address, SERIES_ID);
    expect(updated.margin).to.equal(margin + 200_000_000n); // +$200
  });

  it("allows liquidation when margin falls below maintenance", async () => {
    // Open a short with limited margin
    const margin = 120_000_000n; // 120 USDC
    await option.connect(trader).modifyPosition(SERIES_ID, -1, margin);

    // Mark index higher to force maintenance breach but leave margin > 0
    await option.connect(oracle).updateIndex(1_100_000n, ethers.ZeroHash); // +$0.10 → $100 loss
    await option.markPosition(trader.address, SERIES_ID);

    // Liquidate
    const insuranceBefore = await usdc.balanceOf(owner.address);
    await option.connect(liquidator).liquidate(trader.address, SERIES_ID);
    const insuranceAfter = await usdc.balanceOf(owner.address);

    const posAfter = await option.getPosition(trader.address, SERIES_ID);
    expect(posAfter.qty).to.equal(0);
    expect(posAfter.margin).to.equal(0);
    expect(insuranceAfter).to.be.gt(insuranceBefore); // penalty routed to insurance fund
  });

  it("requires sufficient initial margin", async () => {
    await expect(
      option.connect(trader).modifyPosition(SERIES_ID, 1, 10_000n) // too low
    ).to.be.revertedWithCustomError(option, "InsufficientMargin");
  });

  it("rejects duplicate series ids", async () => {
    const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 90;
    await expect(
      option.createSeries(SERIES_ID, expiry, STRIKE, true, NOTIONAL)
    ).to.be.revertedWithCustomError(option, "SeriesExists");
  });

  it("prevents unauthorized oracle updates", async () => {
    await expect(
      option.connect(trader).updateIndex(1_050_000n, ethers.ZeroHash)
    ).to.be.revertedWithCustomError(option, "AccessControlUnauthorizedAccount");
  });

  it("enforces maintenance margin on withdraw", async () => {
    // Short with enough margin, then price rises against the short
    await option.connect(trader).modifyPosition(SERIES_ID, -1, 150_000_000n); // 150 USDC
    await option.connect(oracle).updateIndex(1_050_000n, ethers.ZeroHash); // +$0.05 -> $50 loss
    await option.markPosition(trader.address, SERIES_ID);

    // Withdrawing too much should fail
    await expect(
      option.connect(trader).withdrawMargin(SERIES_ID, 120_000_000n)
    ).to.be.revertedWith("insufficient margin");
  });

  it("does not liquidate when still above maintenance", async () => {
    await option.connect(trader).modifyPosition(SERIES_ID, -1, 200_000_000n); // 200 USDC
    await option.connect(oracle).updateIndex(1_050_000n, ethers.ZeroHash); // -$50 to margin
    await option.markPosition(trader.address, SERIES_ID);

    await expect(
      option.connect(liquidator).liquidate(trader.address, SERIES_ID)
    ).to.be.revertedWithCustomError(option, "StillHealthy");
  });

  it("honors pause on trading paths", async () => {
    await option.pause();
    await expect(
      option.connect(trader).modifyPosition(SERIES_ID, 1, 200_000_000n)
    ).to.be.revertedWithCustomError(option, "EnforcedPause");
  });

  it("marks losses for a long put when index rises", async () => {
    const putId = ethers.id("SERIES_JAN_2026_PUT");
    const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 90;
    await option.createSeries(putId, expiry, STRIKE, false, NOTIONAL);

    // Start below strike so the put has value, then move above strike
    await option.connect(oracle).updateIndex(900_000n, ethers.ZeroHash);

    await option.connect(trader).modifyPosition(putId, 1, 300_000_000n);
    await option.connect(oracle).updateIndex(1_100_000n, ethers.ZeroHash); // price up to $1.10 -> put loses value
    await option.markPosition(trader.address, putId);

    const updated = await option.getPosition(trader.address, putId);
    expect(updated.margin).to.be.lt(300_000_000n);
  });
});
