const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SolarPunkOption", () => {
  let option;
  let usdc;
  let treasury;
  let owner;
  let oracle;
  let liquidator;
  let trader;

  const SERIES_ID = ethers.id("SERIES_JAN_2026_PUT_50");
  const STRIKE = 1_000_000n; // $1.00 with 6 decimals
  const NOTIONAL = 1_000n; // kWh per contract
  const PRICE_DECIMALS = 6;

  async function openPosition(seriesId, quantity, margin, counterpartyMargin = 3_000_000_000n) {
    const deadline = (await ethers.provider.getBlock("latest")).timestamp + 3600;
    await option.connect(owner).approveMatchedPosition(seriesId, trader.address,
      -quantity, counterpartyMargin, margin, deadline, true);
    return option.connect(trader).openMatchedPosition(seriesId, owner.address,
      quantity, margin, counterpartyMargin, deadline);
  }

  beforeEach(async () => {
    [owner, oracle, liquidator, trader] = await ethers.getSigners();

    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();

    const ProtocolTreasury = await ethers.getContractFactory("ProtocolTreasury");
    treasury = await ProtocolTreasury.deploy(usdc.target);
    await treasury.waitForDeployment();

    const SolarPunkOption = await ethers.getContractFactory("SolarPunkOption");
    option = await SolarPunkOption.deploy(usdc.target, treasury.target, PRICE_DECIMALS);
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

    await usdc.mint(owner.address, 50_000_000_000n);
    await usdc.connect(owner).approve(option.target, ethers.MaxUint256);

    // Create series and set initial index
    const expiry = (await ethers.provider.getBlock("latest")).timestamp + 30 * 24 * 60 * 60;
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
    await openPosition(SERIES_ID, 1n, margin);

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
    await openPosition(SERIES_ID, -1n, margin);

    // Mark index higher to force maintenance breach but leave margin > 0
    await option.connect(oracle).updateIndex(1_100_000n, ethers.ZeroHash); // +$0.10 → $100 loss
    await option.markPosition(trader.address, SERIES_ID);

    // Liquidate
    const insuranceBefore = await usdc.balanceOf(treasury.target);
    await option.connect(liquidator).liquidate(trader.address, SERIES_ID);
    const insuranceAfter = await usdc.balanceOf(treasury.target);

    const posAfter = await option.getPosition(trader.address, SERIES_ID);
    expect(posAfter.qty).to.equal(0);
    expect(posAfter.margin).to.equal(0);
    expect(insuranceAfter).to.be.gt(insuranceBefore); // penalty routed to insurance fund
  });

  it("requires sufficient initial margin", async () => {
    await expect(
      openPosition(SERIES_ID, 1n, 10_000n) // too low
    ).to.be.revertedWithCustomError(option, "InsufficientMargin");
  });

  it("rejects duplicate series ids", async () => {
    const expiry = (await ethers.provider.getBlock("latest")).timestamp + 60 * 60 * 24 * 90;
    await expect(
      option.createSeries(SERIES_ID, expiry, STRIKE, true, NOTIONAL)
    ).to.be.revertedWithCustomError(option, "SeriesExists");
  });

  it("prevents unauthorized oracle updates", async () => {
    await expect(
      option.connect(trader).updateIndex(1_050_000n, ethers.ZeroHash)
    ).to.be.revertedWithCustomError(option, "AccessControlUnauthorizedAccount");
  });

  it("enforces oracle bond requirements when configured", async () => {
    const minOracleBond = 100_000_000n; // 100 USDC
    await option.setBondRequirements(minOracleBond, 0);

    await expect(
      option.connect(oracle).updateIndex(1_050_000n, ethers.ZeroHash)
    ).to.be.revertedWith("oracle bond too low");

    await usdc.mint(oracle.address, minOracleBond);
    await usdc.connect(oracle).approve(treasury.target, minOracleBond);
    await treasury.connect(oracle).depositBond(minOracleBond);

    await expect(
      option.connect(oracle).updateIndex(1_050_000n, ethers.ZeroHash)
    ).not.to.be.reverted;
  });

  it("enforces maintenance margin on withdraw", async () => {
    // Short with enough margin, then price rises against the short
    await openPosition(SERIES_ID, -1n, 150_000_000n); // 150 USDC
    await option.connect(oracle).updateIndex(1_050_000n, ethers.ZeroHash); // +$0.05 -> $50 loss
    await option.markPosition(trader.address, SERIES_ID);

    // Withdrawing too much should fail
    await expect(
      option.connect(trader).withdrawMargin(SERIES_ID, 120_000_000n)
    ).to.be.revertedWith("insufficient margin");
  });

  it("does not liquidate when still above maintenance", async () => {
    await openPosition(SERIES_ID, -1n, 200_000_000n); // 200 USDC
    await option.connect(oracle).updateIndex(1_050_000n, ethers.ZeroHash); // -$50 to margin
    await option.markPosition(trader.address, SERIES_ID);

    await expect(
      option.connect(liquidator).liquidate(trader.address, SERIES_ID)
    ).to.be.revertedWithCustomError(option, "StillHealthy");
  });

  it("enforces liquidator bond requirements when configured", async () => {
    const minLiquidatorBond = 50_000_000n; // 50 USDC
    await option.setBondRequirements(0, minLiquidatorBond);

    const margin = 120_000_000n;
    await openPosition(SERIES_ID, -1n, margin);
    await option.connect(oracle).updateIndex(1_100_000n, ethers.ZeroHash);
    await option.markPosition(trader.address, SERIES_ID);

    await expect(
      option.connect(liquidator).liquidate(trader.address, SERIES_ID)
    ).to.be.revertedWith("liquidator bond too low");

    await usdc.mint(liquidator.address, minLiquidatorBond);
    await usdc.connect(liquidator).approve(treasury.target, minLiquidatorBond);
    await treasury.connect(liquidator).depositBond(minLiquidatorBond);

    await expect(
      option.connect(liquidator).liquidate(trader.address, SERIES_ID)
    ).not.to.be.reverted;
  });

  it("honors pause on trading paths", async () => {
    await option.pause();
    await expect(
      openPosition(SERIES_ID, 1n, 200_000_000n)
    ).to.be.revertedWithCustomError(option, "EnforcedPause");
  });

  it("charges trading fees on position changes", async () => {
    await option.setTradingFeeBps(50);

    const tradeFee = await option.estimateTradingFee(SERIES_ID, 1n);
    const treasuryBefore = await usdc.balanceOf(treasury.target);

    await openPosition(SERIES_ID, 1n, 200_000_000n);

    expect(await usdc.balanceOf(treasury.target)).to.equal(treasuryBefore + tradeFee);
  });

  it("enforces timelock queue for admin setters when governance delay is enabled", async () => {
    const delay = 1800;
    await option.setGovernanceDelay(delay);

    await expect(option.setTradingFeeBps(30)).to.be.revertedWith("governance action not queued");

    const actionId = await option.actionIdSetTradingFeeBps(30);
    await option.queueGovernanceAction(actionId);

    await expect(option.setTradingFeeBps(30)).to.be.revertedWith("governance action timelocked");

    await ethers.provider.send("evm_increaseTime", [delay + 1]);
    await ethers.provider.send("evm_mine");

    await option.setTradingFeeBps(30);
    expect(await option.tradingFeeBps()).to.equal(30);
  });

  it("allows cancelling queued governance action on option admin path", async () => {
    const delay = 1800;
    await option.setGovernanceDelay(delay);
    const actionId = await option.actionIdSetTradingFeeBps(40);

    await option.queueGovernanceAction(actionId);
    await option.cancelGovernanceAction(actionId);

    await ethers.provider.send("evm_increaseTime", [delay + 1]);
    await ethers.provider.send("evm_mine");

    await expect(option.setTradingFeeBps(40)).to.be.revertedWith("governance action not queued");
  });

  it("supports rotating backup operators through explicit role setter", async () => {
    const ORACLE_ROLE = await option.ORACLE_ROLE();

    await option.setOperatorRole(ORACLE_ROLE, trader.address, true);
    await expect(
      option.connect(trader).updateIndex(1_150_000n, ethers.ZeroHash)
    ).not.to.be.reverted;

    await option.setOperatorRole(ORACLE_ROLE, trader.address, false);
    await expect(
      option.connect(trader).updateIndex(1_200_000n, ethers.ZeroHash)
    ).to.be.revertedWithCustomError(option, "AccessControlUnauthorizedAccount");
  });

  it("rejects unsupported operator role updates", async () => {
    const fakeRole = ethers.id("FAKE_ROLE");
    await expect(
      option.setOperatorRole(fakeRole, trader.address, true)
    ).to.be.revertedWith("unsupported role");
  });

  it("settles an expired position and returns remaining margin", async () => {
    // Use chain timestamp (not wall clock) to avoid drift from evm_increaseTime in prior tests
    const latestBlock = await ethers.provider.getBlock("latest");
    const chainNow = latestBlock.timestamp;
    const shortExpiry = chainNow + 300; // 5 minutes from current chain time

    const expiredId = ethers.id("SERIES_EXPIRED_CALL");
    await option.createSeries(expiredId, shortExpiry, STRIKE, true, NOTIONAL);
    await option.connect(oracle).updateIndex(STRIKE, ethers.ZeroHash);

    // Open a long position
    const margin = 200_000_000n; // 200 USDC
    await openPosition(expiredId, 1n, margin);

    // Fast-forward past expiry
    await ethers.provider.send("evm_increaseTime", [400]);
    await ethers.provider.send("evm_mine");

    // Attempting modifyPosition should now revert with SeriesExpired
    await expect(
      option.connect(trader).modifyPosition(expiredId, 0, 1_000_000n)
    ).to.be.revertedWithCustomError(option, "SeriesExpired");

    // settle() should succeed and return margin
    const balanceBefore = await usdc.balanceOf(trader.address);
    await option.connect(oracle).setSettlementIndex(expiredId, STRIKE, ethers.ZeroHash);
    const tx = await option.connect(trader).settle(expiredId);
    const balanceAfter = await usdc.balanceOf(trader.address);

    // Some margin returned (exact amount depends on PnL at current index)
    expect(balanceAfter).to.be.gt(balanceBefore);

    // Position is cleared
    const pos = await option.getPosition(trader.address, expiredId);
    expect(pos.qty).to.equal(0);
    expect(pos.margin).to.equal(0);

    await expect(tx).to.emit(option, "PositionSettled");
  });

  it("rejects settle on non-expired series", async () => {
    const margin = 200_000_000n;
    await openPosition(SERIES_ID, 1n, margin);

    await expect(
      option.connect(trader).settle(SERIES_ID)
    ).to.be.revertedWith("Series not yet expired");
  });

  it("rejects settle when caller has no position", async () => {
    const latestBlock = await ethers.provider.getBlock("latest");
    const chainNow = latestBlock.timestamp;
    const shortExpiry = chainNow + 300;

    const expiredId = ethers.id("SERIES_EXPIRED_EMPTY");
    await option.createSeries(expiredId, shortExpiry, STRIKE, true, NOTIONAL);

    await ethers.provider.send("evm_increaseTime", [400]);
    await ethers.provider.send("evm_mine");

    await expect(
      option.connect(trader).settle(expiredId)
    ).to.be.revertedWith("No position to settle");
  });

  it("rejects withdrawMargin after series expiry", async () => {
    const latestBlock = await ethers.provider.getBlock("latest");
    const chainNow = latestBlock.timestamp;
    const shortExpiry = chainNow + 300;

    const expiredId = ethers.id("SERIES_WITHDRAW_AFTER_EXPIRY");
    await option.createSeries(expiredId, shortExpiry, STRIKE, true, NOTIONAL);
    await option.connect(oracle).updateIndex(STRIKE, ethers.ZeroHash);

    // Open position and deposit margin
    await openPosition(expiredId, 1n, 200_000_000n);

    // Fast-forward past expiry
    await ethers.provider.send("evm_increaseTime", [400]);
    await ethers.provider.send("evm_mine");

    // withdrawMargin should revert with SeriesExpired — use settle() instead
    await expect(
      option.connect(trader).withdrawMargin(expiredId, 10_000_000n)
    ).to.be.revertedWithCustomError(option, "SeriesExpired");
  });

  it("marks losses for a long put when index rises", async () => {
    const putId = ethers.id("SERIES_JAN_2026_PUT");
    const expiry = (await ethers.provider.getBlock("latest")).timestamp + 60 * 60 * 24 * 90;
    await option.createSeries(putId, expiry, STRIKE, false, NOTIONAL);

    // Start below strike so the put has value, then move above strike
    await option.connect(oracle).updateIndex(900_000n, ethers.ZeroHash);

    await openPosition(putId, 1n, 300_000_000n);
    await option.connect(oracle).updateIndex(1_100_000n, ethers.ZeroHash); // price up to $1.10 -> put loses value
    await option.markPosition(trader.address, putId);

    const updated = await option.getPosition(trader.address, putId);
    expect(updated.margin).to.be.lt(300_000_000n);
  });
  it("rejects unfunded unilateral opening even when unrelated deposits are present", async () => {
    await option.connect(trader).depositMargin(SERIES_ID, 2_000_000_000n);
    await expect(option.connect(trader).modifyPosition(SERIES_ID, 1, 0))
      .to.be.revertedWithCustomError(option, "MatchedTradeRequired");
    expect(await option.totalMarginLiability()).to.equal(await usdc.balanceOf(option.target));
  });

  it("requires exact counterparty trade consent and consumes it once", async () => {
    const deadline = (await ethers.provider.getBlock("latest")).timestamp + 3600;
    await expect(option.connect(trader).openMatchedPosition(SERIES_ID, owner.address,
      1, 200_000_000n, 3_000_000_000n, deadline)).to.be.revertedWith("counterparty approval required");
    await option.connect(owner).approveMatchedPosition(SERIES_ID, trader.address,
      -1, 3_000_000_000n, 200_000_000n, deadline, true);
    await expect(option.connect(trader).openMatchedPosition(SERIES_ID, owner.address,
      1, 210_000_000n, 3_000_000_000n, deadline)).to.be.revertedWith("counterparty approval required");
    await option.connect(trader).openMatchedPosition(SERIES_ID, owner.address,
      1, 200_000_000n, 3_000_000_000n, deadline);
    await option.connect(trader).modifyPosition(SERIES_ID, -1, 0);
    await expect(option.connect(trader).openMatchedPosition(SERIES_ID, owner.address,
      1, 200_000_000n, 3_000_000_000n, deadline)).to.be.revertedWith("counterparty approval required");
  });

  it("funds profits from the matched counterparty and preserves unrelated withdrawals", async () => {
    await option.setMarginParams(25_000, 12_500, 100);
    const unrelated = liquidator;
    await usdc.mint(unrelated.address, 2_000_000_000n);
    await usdc.connect(unrelated).approve(option.target, ethers.MaxUint256);
    await option.connect(unrelated).depositMargin(SERIES_ID, 2_000_000_000n);
    await openPosition(SERIES_ID, 1n, 2_500_000_000n);
    await option.connect(oracle).updateIndex(1_200_000n, ethers.ZeroHash);
    await option.connect(trader).modifyPosition(SERIES_ID, -1, 0);
    expect((await option.getPosition(owner.address, SERIES_ID)).margin).to.equal(2_800_000_000n);
    await option.connect(trader).withdrawMargin(SERIES_ID, 2_700_000_000n);
    await option.connect(unrelated).withdrawMargin(SERIES_ID, 2_000_000_000n);
    expect(await usdc.balanceOf(option.target)).to.equal(2_800_000_000n);
    expect(await option.totalMarginLiability()).to.equal(2_800_000_000n);
  });

  it("conserves pair collateral across price gaps larger than the losing margin", async () => {
    await openPosition(SERIES_ID, 1n, 200_000_000n);
    const total = await option.totalMarginLiability();
    for (const index of [10_000_000n, 500_000n, 1_200_000n]) {
      await option.connect(oracle).updateIndex(index, ethers.ZeroHash);
      await option.markPosition(trader.address, SERIES_ID);
      const long = await option.getPosition(trader.address, SERIES_ID);
      const short = await option.getPosition(owner.address, SERIES_ID);
      expect(long.margin + short.margin).to.equal(total);
      expect(await option.totalMarginLiability()).to.equal(total);
      expect(await usdc.balanceOf(option.target)).to.equal(total);
    }
  });

  it("requires a frozen expiry price and uses it for both counterparties", async () => {
    const expiry = (await ethers.provider.getBlock("latest")).timestamp + 300;
    const id = ethers.id("FROZEN_EXPIRY");
    await option.createSeries(id, expiry, STRIKE, true, NOTIONAL);
    await openPosition(id, 1n, 200_000_000n);
    await ethers.provider.send("evm_increaseTime", [400]);
    await ethers.provider.send("evm_mine");
    await expect(option.connect(trader).settle(id)).to.be.revertedWithCustomError(option, "SettlementIndexRequired");
    await option.connect(oracle).setSettlementIndex(id, 1_200_000n, ethers.id("expiry-source"));
    await option.connect(oracle).updateIndex(1_900_000n, ethers.ZeroHash);
    await option.connect(trader).settle(id);
    expect((await option.getPosition(owner.address, id)).margin).to.equal(2_800_000_000n);
    await expect(option.connect(oracle).setSettlementIndex(id, 1_900_000n, ethers.ZeroHash))
      .to.be.revertedWith("invalid or frozen settlement index");
    await option.connect(owner).settle(id);
    expect(await option.totalMarginLiability()).to.equal(0);
    expect(await usdc.balanceOf(option.target)).to.equal(0);
  });

});
