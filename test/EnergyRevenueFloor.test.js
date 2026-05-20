const { expect } = require("chai");
const { ethers } = require("hardhat");

const POLICY_STATE = {
  Active: 0,
  Reported: 1,
  Disputed: 2,
  Settled: 3,
  Cancelled: 4,
  Expired: 5,
};

describe("EnergyRevenueFloor", function () {
  let usdc;
  let floor;
  let owner;
  let producer;
  let payer;
  let reporter;
  let liquidityProvider;
  let auditor;

  const ONE_USDC = 1_000_000n;

  let producerId;

  beforeEach(async function () {
    [owner, producer, payer, reporter, liquidityProvider, auditor] = await ethers.getSigners();

    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();

    const EnergyRevenueFloor = await ethers.getContractFactory("EnergyRevenueFloor");
    floor = await EnergyRevenueFloor.deploy(usdc.target, owner.address);
    await floor.waitForDeployment();

    const reporterRole = await floor.REPORTER_ROLE();
    const liquidityRole = await floor.LIQUIDITY_ROLE();
    const auditorRole = await floor.AUDITOR_ROLE();

    await floor.grantRole(reporterRole, reporter.address);
    await floor.grantRole(liquidityRole, liquidityProvider.address);
    await floor.grantRole(auditorRole, auditor.address);

    await usdc.mint(owner.address, 500_000n * ONE_USDC);
    await usdc.mint(producer.address, 500_000n * ONE_USDC);
    await usdc.mint(payer.address, 500_000n * ONE_USDC);
    await usdc.mint(liquidityProvider.address, 500_000n * ONE_USDC);

    await usdc.connect(liquidityProvider).approve(floor.target, 500_000n * ONE_USDC);
    await floor.connect(liquidityProvider).depositLiquidity(200_000n * ONE_USDC);

    producerId = await floor.connect(producer).registerProducer.staticCall(
      "Acme Solar",
      "Taipei",
      1000n,
      60
    );
    await floor.connect(producer).registerProducer("Acme Solar", "Taipei", 1000n, 60);
  });

  async function nextPolicyWindow() {
    const block = await ethers.provider.getBlock("latest");
    const now = block.timestamp;
    return {
      periodStart: Math.floor(now + 60 * 60),
      periodEnd: Math.floor(now + 2 * 60 * 60),
    };
  }

  async function openFloorPolicy(policyOverrides = {}) {
    const {
      targetKwh = 1000n,
      floorPricePerKwh = 1200000n,
      premiumBps = 120n,
    } = policyOverrides;
    const { periodStart, periodEnd } = await nextPolicyWindow();

    const [maxPayout, premium] = await floor.connect(producer).estimatePolicy(
      targetKwh,
      floorPricePerKwh,
      premiumBps
    );

    await usdc.connect(producer).approve(floor.target, premium);

    const policyId = await floor.connect(producer).openFloorPolicy.staticCall(
      producerId,
      periodStart,
      periodEnd,
      targetKwh,
      floorPricePerKwh,
      premiumBps,
      producer.address
    );

    await floor.connect(producer).openFloorPolicy(
      producerId,
      periodStart,
      periodEnd,
      targetKwh,
      floorPricePerKwh,
      premiumBps,
      producer.address
    );

    return {
      policyId,
      targetKwh,
      floorPricePerKwh,
      premium,
      maxPayout,
      periodEnd,
      periodStart,
      premiumBps,
    };
  }

  it("registers producers and stores heartbeat configuration", async function () {
    const p = await floor.producers(producerId);

    expect(p.owner).to.equal(producer.address);
    expect(p.siteName).to.equal("Acme Solar");
    expect(p.location).to.equal("Taipei");
    expect(p.capacityKw).to.equal(1000n);
    expect(p.heartbeatSeconds).to.equal(60);
    expect(p.active).to.equal(true);
    expect(await floor.heartbeatIsFresh(producerId)).to.equal(true);
  });

  it("opens a policy when liquidity and premium approvals are sufficient", async function () {
    const producerBalanceBefore = await usdc.balanceOf(producer.address);
    const treasuryBalanceBefore = await usdc.balanceOf(owner.address);
    const { maxPayout, premium } = await openFloorPolicy();

    const policy = await floor.policies(1n);
    expect(policy.state).to.equal(POLICY_STATE.Active);
    expect(policy.maxPayout).to.equal(maxPayout);
    expect(policy.lockedLiquidity).to.equal(maxPayout);
    expect(policy.premiumPaid).to.equal(premium);
    expect(await floor.totalLockedLiquidity()).to.equal(maxPayout);

    const producerBalanceAfter = await usdc.balanceOf(producer.address);
    const treasuryBalanceAfter = await usdc.balanceOf(owner.address);
    expect(producerBalanceBefore - producerBalanceAfter).to.equal(premium);
    expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(premium);
  });

  it("finalizes settlement after manual report and releases locked liquidity", async function () {
    const { targetKwh, floorPricePerKwh, maxPayout, periodEnd } = await openFloorPolicy();
    const producerBalanceBefore = await usdc.balanceOf(producer.address);

    const policy = await floor.policies(1n);
    const measuredAt = Number(policy.periodStart) + 60;
    const realizedKwh = targetKwh - 300n;
    const expectedPayout = (targetKwh - realizedKwh) * floorPricePerKwh;
    const payout = expectedPayout > maxPayout ? maxPayout : expectedPayout;

    const currentTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
    const waitTime = Number(measuredAt) - Number(currentTimestamp) + 1;
    if (waitTime > 0) {
      await ethers.provider.send("evm_increaseTime", [waitTime]);
      await ethers.provider.send("evm_mine");
    }

    await floor.connect(reporter).submitManualProductionReport(1n, realizedKwh, measuredAt, ethers.ZeroHash);

    const disputeWindow = await floor.disputeWindowSeconds();
    await ethers.provider.send("evm_increaseTime", [Number(disputeWindow) + 1]);
    await ethers.provider.send("evm_mine");

    await floor.connect(producer).finalizePolicy(1n);

    const settled = await floor.policies(1n);
    expect(settled.state).to.equal(POLICY_STATE.Settled);
    expect(settled.payout).to.equal(payout);
    expect(await floor.totalLockedLiquidity()).to.equal(0n);

    const producerBalanceAfter = await usdc.balanceOf(producer.address);
    expect(producerBalanceAfter).to.equal(producerBalanceBefore + payout);
    expect(settled.settledAt).to.be.greaterThan(periodEnd);
  });

  it("supports cancel then release liquidity", async function () {
    const { policyId, maxPayout } = await openFloorPolicy();

    await floor.connect(producer).cancelPolicy(policyId);
    const after = await floor.policies(policyId);
    expect(after.state).to.equal(POLICY_STATE.Cancelled);
    expect(after.lockedLiquidity).to.equal(0n);
    expect(await floor.totalLockedLiquidity()).to.equal(0n);
    expect(await floor.freeLiquidity()).to.equal(200_000n * ONE_USDC);
    expect(maxPayout).to.be.gt(0n);
  });

  it("can be disputed and resolved by auditor with new realized data", async function () {
    await openFloorPolicy();
    const policy = await floor.policies(1n);
    const measuredAt = Number(policy.periodStart) + 60;

    const currentTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
    const waitTime = Number(measuredAt) - Number(currentTimestamp) + 1;
    if (waitTime > 0) {
      await ethers.provider.send("evm_increaseTime", [waitTime]);
      await ethers.provider.send("evm_mine");
    }

    await floor.connect(reporter).submitManualProductionReport(1n, 700n, measuredAt, ethers.ZeroHash);
    await floor.connect(producer).requestDispute(1n, "source hash mismatch");

    const disputed = await floor.policies(1n);
    expect(disputed.state).to.equal(POLICY_STATE.Disputed);
    expect(disputed.disputed).to.equal(true);

    await floor.connect(auditor).resolveDispute(1n, 700n, ethers.ZeroHash);
    const resolved = await floor.policies(1n);
    expect(resolved.state).to.equal(POLICY_STATE.Settled);
    expect(resolved.realizedKwh).to.equal(700n);
  });

  it("expires stale policies after reporting window", async function () {
    const { periodEnd, policyId } = await openFloorPolicy();
    const reportWindow = await floor.reportSubmissionWindowSeconds();
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const toWait = Number(periodEnd) - now + Number(reportWindow) + 1;

    await ethers.provider.send("evm_increaseTime", [toWait]);
    await ethers.provider.send("evm_mine");

    await expect(floor.connect(producer).expirePolicy(policyId)).not.to.be.reverted;
    const expired = await floor.policies(policyId);
    expect(expired.state).to.equal(POLICY_STATE.Expired);
    expect(await floor.totalLockedLiquidity()).to.equal(0n);
  });

  it("only allows policy buyers to cancel or dispute", async function () {
    const { policyId } = await openFloorPolicy();

    await expect(floor.connect(owner).cancelPolicy(policyId)).to.be.revertedWithCustomError(floor, "UnauthorizedActor");
    await expect(floor.connect(payer).requestDispute(policyId, "unauthorized")).to.be.revertedWithCustomError(floor, "UnauthorizedActor");
  });

  it("rejects delegated premium payment without explicit authorization", async function () {
    const { periodStart, periodEnd } = await nextPolicyWindow();
    const [, premium] = await floor.connect(producer).estimatePolicy(1000n, 1200000n, 120n);
    await usdc.connect(payer).approve(floor.target, premium);

    await expect(
      floor.connect(producer).openFloorPolicy(
        producerId,
        periodStart,
        periodEnd,
        1000n,
        1200000n,
        120n,
        payer.address
      )
    ).to.be.revertedWithCustomError(floor, "UnauthorizedActor");
  });

  it("requires sufficient free liquidity for opening a new floor policy", async function () {
    const { targetKwh, floorPricePerKwh, premiumBps } = await openFloorPolicy();

    const nextPolicy = await floor.connect(producer).estimatePolicy(targetKwh, floorPricePerKwh, premiumBps);
    const maxPayout = nextPolicy[0];

    const freeLiquidity = await floor.freeLiquidity();
    const withdrawAmount = freeLiquidity > 0n ? freeLiquidity - (maxPayout - 1n) : 0n;
    if (withdrawAmount > 0n) {
      await floor.connect(liquidityProvider).withdrawLiquidity(withdrawAmount, owner.address);
    }

    await usdc.connect(producer).approve(floor.target, maxPayout);
    const { periodStart, periodEnd } = await nextPolicyWindow();
    await expect(
      floor.connect(producer).openFloorPolicy(
        producerId,
        periodStart,
        periodEnd,
        targetKwh,
        floorPricePerKwh,
        premiumBps,
        producer.address
      )
    ).to.be.revertedWithCustomError(floor, "NotEnoughLiquidity");
  });

  it("blocks operational paths while paused", async function () {
    await floor.pause();
    const { periodStart, periodEnd } = await nextPolicyWindow();
    await expect(
      floor.connect(producer).openFloorPolicy(
        producerId,
        periodStart,
        periodEnd,
        1000n,
        1000000n,
        100n,
        producer.address
      )
    ).to.be.reverted;
  });
});
