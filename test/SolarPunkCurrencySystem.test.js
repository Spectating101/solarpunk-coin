const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SolarPunkCurrencySystem", function () {
  let usdc;
  let treasury;
  let spk;
  let currency;
  let owner;
  let minter;
  let oracle;
  let producer;
  let merchant;
  let buyer;
  let outsider;

  const USDC_DECIMALS = 10n ** 6n;
  const RESERVE_AMOUNT = 1_000_000n * USDC_DECIMALS;
  const ENERGY_PRICE = ethers.parseEther("0.05");

  beforeEach(async function () {
    [owner, minter, oracle, producer, merchant, buyer, outsider] = await ethers.getSigners();

    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();

    const ProtocolTreasury = await ethers.getContractFactory("ProtocolTreasury");
    treasury = await ProtocolTreasury.deploy(usdc.target);
    await treasury.waitForDeployment();

    const SolarPunkCoin = await ethers.getContractFactory("SolarPunkCoin");
    spk = await SolarPunkCoin.deploy(usdc.target);
    await spk.waitForDeployment();
    await spk.setTreasury(treasury.target);

    await usdc.mint(owner.address, RESERVE_AMOUNT);
    await usdc.connect(owner).approve(spk.target, RESERVE_AMOUNT);
    await spk.connect(owner).depositReserve(RESERVE_AMOUNT);

    await spk.grantRole(await spk.MINTER_ROLE(), minter.address);
    await spk.grantRole(await spk.ORACLE_ROLE(), oracle.address);
    await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));
    await spk.connect(oracle).updateEnergyPrice(ENERGY_PRICE);

    await spk.connect(minter).mintFromSurplus(20_000, producer.address);
    await spk.connect(minter).mintFromSurplus(10_000, buyer.address);

    const SolarPunkCurrencySystem = await ethers.getContractFactory("SolarPunkCurrencySystem");
    currency = await SolarPunkCurrencySystem.deploy(spk.target, owner.address);
    await currency.waitForDeployment();
  });

  it("settles an SPK invoice and prevents replayed invoice hashes", async function () {
    const amount = ethers.parseEther("25");
    const invoiceHash = ethers.id("invoice:maintenance:2026-05-16");

    await spk.connect(producer).approve(currency.target, amount);

    await expect(currency.connect(producer).settleInvoice(merchant.address, amount, invoiceHash))
      .to.emit(currency, "InvoiceSettled")
      .withArgs(1, producer.address, merchant.address, amount, invoiceHash);

    const payment = await currency.payments(1);
    expect(payment.payer).to.equal(producer.address);
    expect(payment.payee).to.equal(merchant.address);
    expect(payment.spkAmount).to.equal(amount);
    expect(payment.invoiceHash).to.equal(invoiceHash);
    expect(await currency.totalSettledSpk()).to.equal(amount);
    expect(await spk.balanceOf(merchant.address)).to.equal(amount);

    await spk.connect(producer).approve(currency.target, amount);
    await expect(
      currency.connect(producer).settleInvoice(merchant.address, amount, invoiceHash)
    ).to.be.revertedWithCustomError(currency, "HashAlreadyUsed");
  });

  it("opens an energy redemption by transferring and burning SPK through the registry", async function () {
    const amount = ethers.parseEther("50");
    const sourceHash = ethers.id("redemption:buyer:2026-05-16:001");
    const expectedKwh = ethers.parseEther("1000");
    const redeemFee = (amount * 10n) / 10000n;

    const quote = await currency.quoteRedemption(amount);
    expect(quote.energyPricePerKwh).to.equal(ENERGY_PRICE);
    expect(quote.owedKwhWad).to.equal(expectedKwh);

    const supplyBefore = await spk.totalSupply();
    const balanceBefore = await spk.balanceOf(buyer.address);
    await spk.connect(buyer).approve(currency.target, amount);

    await expect(currency.connect(buyer).openRedemption(buyer.address, amount, expectedKwh, sourceHash))
      .to.emit(currency, "RedemptionOpened")
      .withArgs(1, buyer.address, buyer.address, amount, expectedKwh, ENERGY_PRICE, sourceHash);

    const redemption = await currency.redemptions(1);
    expect(redemption.redeemer).to.equal(buyer.address);
    expect(redemption.beneficiary).to.equal(buyer.address);
    expect(redemption.spkAmount).to.equal(amount);
    expect(redemption.owedKwhWad).to.equal(expectedKwh);
    expect(redemption.state).to.equal(0);

    expect(await spk.balanceOf(buyer.address)).to.equal(balanceBefore - amount);
    expect(await spk.balanceOf(currency.target)).to.equal(0);
    expect(await spk.totalSupply()).to.equal(supplyBefore - amount + redeemFee);
    expect(await currency.totalRedeemedSpk()).to.equal(amount);
    expect(await currency.totalOwedKwhWad()).to.equal(expectedKwh);
  });

  it("rejects redemptions if the quoted kWh falls below caller tolerance", async function () {
    const amount = ethers.parseEther("50");
    const sourceHash = ethers.id("redemption:buyer:slippage");
    await spk.connect(buyer).approve(currency.target, amount);

    await expect(
      currency.connect(buyer).openRedemption(
        buyer.address,
        amount,
        ethers.parseEther("1000.0001"),
        sourceHash
      )
    ).to.be.revertedWithCustomError(currency, "SlippageExceeded");
  });

  it("resolves redemption delivery as fulfilled or shortfall", async function () {
    const amount = ethers.parseEther("50");
    const sourceHash = ethers.id("redemption:buyer:resolve");
    const expectedKwh = ethers.parseEther("1000");
    await spk.connect(buyer).approve(currency.target, amount);
    await currency.connect(buyer).openRedemption(buyer.address, amount, expectedKwh, sourceHash);

    const resolutionHash = ethers.id("utility-delivery:fulfilled");
    await expect(currency.connect(owner).resolveRedemption(1, expectedKwh, resolutionHash))
      .to.emit(currency, "RedemptionResolved")
      .withArgs(1, 1, expectedKwh, 0, resolutionHash);

    let redemption = await currency.redemptions(1);
    expect(redemption.state).to.equal(1);
    expect(await currency.totalDeliveredKwhWad()).to.equal(expectedKwh);

    const shortfallSourceHash = ethers.id("redemption:buyer:shortfall");
    await spk.connect(buyer).approve(currency.target, amount);
    await currency.connect(buyer).openRedemption(buyer.address, amount, expectedKwh, shortfallSourceHash);

    const delivered = ethers.parseEther("600");
    const shortfallHash = ethers.id("utility-delivery:shortfall");
    await expect(currency.connect(owner).resolveRedemption(2, delivered, shortfallHash))
      .to.emit(currency, "RedemptionResolved")
      .withArgs(2, 2, delivered, ethers.parseEther("400"), shortfallHash);

    redemption = await currency.redemptions(2);
    expect(redemption.state).to.equal(2);
    expect(await currency.totalShortfallKwhWad()).to.equal(ethers.parseEther("400"));
  });

  it("allows a redeemer or beneficiary to dispute, then lets the operator resolve", async function () {
    const amount = ethers.parseEther("50");
    const sourceHash = ethers.id("redemption:buyer:dispute");
    const expectedKwh = ethers.parseEther("1000");
    await spk.connect(buyer).approve(currency.target, amount);
    await currency.connect(buyer).openRedemption(buyer.address, amount, expectedKwh, sourceHash);

    await expect(
      currency.connect(outsider).disputeRedemption(1, ethers.id("bad-resolution"))
    ).to.be.revertedWithCustomError(currency, "UnauthorizedActor");

    const disputeHash = ethers.id("beneficiary-dispute");
    await expect(currency.connect(buyer).disputeRedemption(1, disputeHash))
      .to.emit(currency, "RedemptionDisputed")
      .withArgs(1, buyer.address, disputeHash);

    expect((await currency.redemptions(1)).state).to.equal(3);

    await currency.connect(owner).resolveRedemption(1, expectedKwh, ethers.id("operator-resolution"));
    expect((await currency.redemptions(1)).state).to.equal(1);
  });

  it("does not double-count aggregate delivery metrics after dispute re-resolution", async function () {
    const amount = ethers.parseEther("50");
    const expectedKwh = ethers.parseEther("1000");
    await spk.connect(buyer).approve(currency.target, amount);
    await currency.connect(buyer).openRedemption(
      buyer.address,
      amount,
      expectedKwh,
      ethers.id("redemption:buyer:reroute")
    );

    await currency.connect(owner).resolveRedemption(
      1,
      ethers.parseEther("600"),
      ethers.id("initial-shortfall")
    );
    expect(await currency.totalDeliveredKwhWad()).to.equal(ethers.parseEther("600"));
    expect(await currency.totalShortfallKwhWad()).to.equal(ethers.parseEther("400"));

    await currency.connect(buyer).disputeRedemption(1, ethers.id("shortfall-disputed"));
    await currency.connect(owner).resolveRedemption(1, expectedKwh, ethers.id("corrected-delivery"));

    const redemption = await currency.redemptions(1);
    expect(redemption.state).to.equal(1);
    expect(redemption.deliveredKwhWad).to.equal(expectedKwh);
    expect(redemption.shortfallKwhWad).to.equal(0);
    expect(await currency.totalDeliveredKwhWad()).to.equal(expectedKwh);
    expect(await currency.totalShortfallKwhWad()).to.equal(0);
  });
});
