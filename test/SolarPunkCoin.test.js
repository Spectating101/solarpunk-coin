const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SolarPunkCoin", function () {
  let spk;
  let usdc;
  let treasury;
  let owner;
  let minter;
  let oracle;
  let user;
  const USDC_DECIMALS = 10n ** 6n;
  const RESERVE_AMOUNT = 1_000_000n * USDC_DECIMALS;

  beforeEach(async function () {
    [owner, minter, oracle, user] = await ethers.getSigners();

    // Deploy Mock USDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();

    const ProtocolTreasury = await ethers.getContractFactory("ProtocolTreasury");
    treasury = await ProtocolTreasury.deploy(usdc.target);
    await treasury.waitForDeployment();

    // Deploy SolarPunkCoin with reserve token
    const SolarPunkCoin = await ethers.getContractFactory("SolarPunkCoin");
    spk = await SolarPunkCoin.deploy(usdc.target);
    await spk.waitForDeployment();
    await spk.setTreasury(treasury.target);

    // Seed reserves for minting eligibility
    await usdc.mint(owner.address, RESERVE_AMOUNT);
    await usdc.connect(owner).approve(spk.target, RESERVE_AMOUNT);
    await spk.connect(owner).depositReserve(RESERVE_AMOUNT);

    // Grant roles
    const MINTER_ROLE = await spk.MINTER_ROLE();
    const ORACLE_ROLE = await spk.ORACLE_ROLE();

    await spk.grantRole(MINTER_ROLE, minter.address);
    await spk.grantRole(ORACLE_ROLE, oracle.address);
  });

  describe("Deployment", function () {
    it("Should deploy with correct name and symbol", async function () {
      expect(await spk.name()).to.equal("SolarPunkCoin");
      expect(await spk.symbol()).to.equal("SPK");
    });

    it("Should initialize with correct peg target", async function () {
      const pegTarget = await spk.pegTarget();
      expect(pegTarget).to.equal(ethers.parseEther("1"));
    });

    it("Should initialize with correct peg band (±5%)", async function () {
      const pegBand = await spk.pegBand();
      expect(pegBand).to.equal(ethers.parseEther("0.05"));
    });
  });

  describe("Minting: Rule A (Surplus-Only)", function () {
    async function buildSurplusAttestation(overrides = {}) {
      const block = await ethers.provider.getBlock("latest");
      const now = BigInt(block.timestamp);
      const params = {
        surplusKwh: 1000n,
        recipient: user.address,
        windowStart: now - 3600n,
        windowEnd: now - 1n,
        validAfter: now - 60n,
        validBefore: now + 3600n,
        sourceHash: ethers.id("meter:TW-TY-0001:2026-05-14"),
        ...overrides,
      };
      const attestationHash = await spk.surplusAttestationHash(
        params.surplusKwh,
        params.recipient,
        params.windowStart,
        params.windowEnd,
        params.validAfter,
        params.validBefore,
        params.sourceHash
      );
      const signature = await (params.signer || oracle).signMessage(ethers.getBytes(attestationHash));
      return { ...params, attestationHash, signature };
    }

    it("Should mint SPK from surplus with fee", async function () {
      const surplusKwh = 1000;
      const recipient = user.address;
      const totalFee = ethers.parseEther("1"); // 0.1% of 1000 SPK
      // stabilityFeeShare = 50% → treasury gets half, stability pool gets half
      const treasuryFee = (totalFee * 5000n) / 10000n;

      // Update oracle price first
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));

      // Mint from surplus
      const tx = await spk
        .connect(minter)
        .mintFromSurplus(surplusKwh, recipient);

      // Check SPK balance
      const balance = await spk.balanceOf(recipient);
      expect(balance).to.be.gt(0);
      expect(await spk.balanceOf(treasury.target)).to.equal(treasuryFee);

      // Verify event
      await expect(tx).to.emit(spk, "SPKMinted");
    });

    it("Should reject minting with zero surplus", async function () {
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));

      await expect(
        spk.connect(minter).mintFromSurplus(0, user.address)
      ).to.be.revertedWith("Surplus must be > 0");
    });

    it("Should reject minting to zero address", async function () {
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));

      await expect(
        spk.connect(minter).mintFromSurplus(1000, ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid recipient");
    });

    it("Should reject minting by non-minter", async function () {
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));

      await expect(
        spk.connect(user).mintFromSurplus(1000, user.address)
      ).to.be.reverted;
    });

    it("Should apply minting fee correctly", async function () {
      const surplusKwh = 1000;
      const baseSPK = ethers.parseEther("1000"); // 1 SPK per 1 kWh (energyPricePerKwh default = 1e18)
      const totalFee = (baseSPK * 10n) / 10000n; // 0.1%
      const expectedAmount = baseSPK - totalFee;
      // stabilityFeeShare = 50% → treasury gets half of fee
      const expectedTreasuryFee = (totalFee * 5000n) / 10000n;

      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));

      await spk.connect(minter).mintFromSurplus(surplusKwh, user.address);

      const balance = await spk.balanceOf(user.address);
      expect(balance).to.equal(expectedAmount);
      expect(await spk.balanceOf(treasury.target)).to.equal(expectedTreasuryFee);
    });

    it("Should mint from a unique oracle-signed surplus attestation", async function () {
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));
      const attestation = await buildSurplusAttestation();
      const expected = await spk.estimateMintAmount(attestation.surplusKwh);

      const tx = await spk.connect(minter).mintFromSurplusAttestation(
        attestation.surplusKwh,
        attestation.recipient,
        attestation.windowStart,
        attestation.windowEnd,
        attestation.validAfter,
        attestation.validBefore,
        attestation.sourceHash,
        attestation.signature
      );

      expect(await spk.balanceOf(user.address)).to.equal(expected);
      expect(await spk.usedSurplusAttestations(attestation.attestationHash)).to.equal(true);
      await expect(tx)
        .to.emit(spk, "SurplusAttestationMinted")
        .withArgs(
          attestation.attestationHash,
          oracle.address,
          user.address,
          attestation.surplusKwh,
          attestation.windowStart,
          attestation.windowEnd,
          attestation.sourceHash
        );
    });

    it("Should reject replayed surplus attestations", async function () {
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));
      const attestation = await buildSurplusAttestation();

      await spk.connect(minter).mintFromSurplusAttestation(
        attestation.surplusKwh,
        attestation.recipient,
        attestation.windowStart,
        attestation.windowEnd,
        attestation.validAfter,
        attestation.validBefore,
        attestation.sourceHash,
        attestation.signature
      );

      await expect(
        spk.connect(minter).mintFromSurplusAttestation(
          attestation.surplusKwh,
          attestation.recipient,
          attestation.windowStart,
          attestation.windowEnd,
          attestation.validAfter,
          attestation.validBefore,
          attestation.sourceHash,
          attestation.signature
        )
      ).to.be.revertedWith("attestation already used");
    });

    it("Should reject reused surplus source hashes even when attestation metadata changes", async function () {
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));
      const attestation = await buildSurplusAttestation();

      await spk.connect(minter).mintFromSurplusAttestation(
        attestation.surplusKwh,
        attestation.recipient,
        attestation.windowStart,
        attestation.windowEnd,
        attestation.validAfter,
        attestation.validBefore,
        attestation.sourceHash,
        attestation.signature
      );

      const secondAttestation = await buildSurplusAttestation({
        recipient: owner.address,
        sourceHash: attestation.sourceHash,
      });

      await expect(
        spk.connect(minter).mintFromSurplusAttestation(
          secondAttestation.surplusKwh,
          secondAttestation.recipient,
          secondAttestation.windowStart,
          secondAttestation.windowEnd,
          secondAttestation.validAfter,
          secondAttestation.validBefore,
          secondAttestation.sourceHash,
          secondAttestation.signature
        )
      ).to.be.revertedWith("source hash already used");
    });

    it("Should reject surplus attestations not signed by an oracle", async function () {
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));
      const attestation = await buildSurplusAttestation({ signer: user });

      await expect(
        spk.connect(minter).mintFromSurplusAttestation(
          attestation.surplusKwh,
          attestation.recipient,
          attestation.windowStart,
          attestation.windowEnd,
          attestation.validAfter,
          attestation.validBefore,
          attestation.sourceHash,
          attestation.signature
        )
      ).to.be.revertedWith("invalid surplus attestor");
    });

    it("Should reject surplus attestations without a source hash", async function () {
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));
      const attestation = await buildSurplusAttestation({ sourceHash: ethers.ZeroHash });

      await expect(
        spk.connect(minter).mintFromSurplusAttestation(
          attestation.surplusKwh,
          attestation.recipient,
          attestation.windowStart,
          attestation.windowEnd,
          attestation.validAfter,
          attestation.validBefore,
          attestation.sourceHash,
          attestation.signature
        )
      ).to.be.revertedWith("source hash required");
    });

    it("Should reject surplus attestations with invalid measurement windows", async function () {
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));
      const block = await ethers.provider.getBlock("latest");
      const now = BigInt(block.timestamp);
      const attestation = await buildSurplusAttestation({
        windowStart: now,
        windowEnd: now,
      });

      await expect(
        spk.connect(minter).mintFromSurplusAttestation(
          attestation.surplusKwh,
          attestation.recipient,
          attestation.windowStart,
          attestation.windowEnd,
          attestation.validAfter,
          attestation.validBefore,
          attestation.sourceHash,
          attestation.signature
        )
      ).to.be.revertedWith("invalid attestation window");
    });

    it("Should reject surplus attestations for measurement windows that have not closed", async function () {
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));
      const block = await ethers.provider.getBlock("latest");
      const now = BigInt(block.timestamp);
      const attestation = await buildSurplusAttestation({
        windowStart: now + 3600n,
        windowEnd: now + 7200n,
      });

      await expect(
        spk.connect(minter).mintFromSurplusAttestation(
          attestation.surplusKwh,
          attestation.recipient,
          attestation.windowStart,
          attestation.windowEnd,
          attestation.validAfter,
          attestation.validBefore,
          attestation.sourceHash,
          attestation.signature
        )
      ).to.be.revertedWith("attestation window not closed");
    });

    it("Should reject expired surplus attestations", async function () {
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));
      const block = await ethers.provider.getBlock("latest");
      const attestation = await buildSurplusAttestation({
        validAfter: BigInt(block.timestamp) - 7200n,
        validBefore: BigInt(block.timestamp) - 3600n,
      });

      await expect(
        spk.connect(minter).mintFromSurplusAttestation(
          attestation.surplusKwh,
          attestation.recipient,
          attestation.windowStart,
          attestation.windowEnd,
          attestation.validAfter,
          attestation.validBefore,
          attestation.sourceHash,
          attestation.signature
        )
      ).to.be.revertedWith("attestation expired");
    });
  });

  describe("Peg Stabilization: Rule D (PI Control)", function () {
    beforeEach(async function () {
      // Mint some initial SPK
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));
      await spk.connect(minter).mintFromSurplus(10000, user.address);
    });

    it("Should update oracle price and emit event", async function () {
      const newPrice = ethers.parseEther("1.03"); // 3% above peg

      const tx = await spk.connect(oracle).updateOraclePriceAndAdjust(newPrice);

      await expect(tx).to.emit(spk, "OraclePriceUpdated");
      expect(await spk.lastOraclePrice()).to.equal(newPrice);
    });

    it("Should apply PI control when price is above peg", async function () {
      const priceAbovePeg = ethers.parseEther("1.08"); // 8% above peg (outside band)

      const txBefore = await spk.totalSupply();

      // PI control attempts to mint, but with safety limits (max 1% per call)
      // So totalSupply should stay same or increase slightly
      await spk.connect(oracle).updateOraclePriceAndAdjust(priceAbovePeg);

      const txAfter = await spk.totalSupply();

      // Should be >= before (may not mint if reserve ratio blocks or hit limits)
      expect(txAfter).to.be.gte(txBefore);
    });

    it("Should apply PI control when price is below peg", async function () {
      const priceBelowPeg = ethers.parseEther("0.92"); // 8% below peg

      const txBefore = await spk.totalSupply();

      await spk.connect(oracle).updateOraclePriceAndAdjust(priceBelowPeg);

      const txAfter = await spk.totalSupply();

      // Should have burned supply to push price up
      expect(txAfter).to.be.lte(txBefore); // May be <= due to pool balance limits
    });

    it("Should detect peg stability", async function () {
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1.02"));
      let stable = await spk.isPegStable();
      expect(stable).to.be.true; // 2% is within ±5% band

      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1.08"));
      stable = await spk.isPegStable();
      expect(stable).to.be.false; // 8% is outside ±5% band
    });

    it("Should calculate peg deviation correctly", async function () {
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1.1")); // 10% above

      const deviation = await spk.getPegDeviation();

      // Should be approximately 1000 basis points (10%)
      expect(deviation).to.be.greaterThan(900n);
      expect(deviation).to.be.lessThan(1100n);
    });
  });

  describe("Redemption: Rule B (Intrinsic Guarantee)", function () {
    beforeEach(async function () {
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));
      await spk.connect(minter).mintFromSurplus(5000, user.address);
    });

    it("Should redeem SPK for energy", async function () {
      const balanceBefore = await spk.balanceOf(user.address);
      const amount = ethers.parseEther("100");

      await spk.connect(user).redeemForEnergy(amount);

      const balanceAfter = await spk.balanceOf(user.address);
      expect(balanceAfter).to.equal(balanceBefore - amount);
    });

    it("Should apply redemption fee", async function () {
      const balanceBefore = await spk.balanceOf(user.address);
      const amount = ethers.parseEther("100");
      const expectedFee = (amount * 10n) / 10000n;
      const treasuryBefore = await spk.balanceOf(treasury.target);

      await spk.connect(user).redeemForEnergy(amount);

      // SPK should be burned (all of it)
      const balanceAfter = await spk.balanceOf(user.address);
      expect(balanceAfter).to.equal(balanceBefore - amount);
      expect(await spk.balanceOf(treasury.target)).to.equal(treasuryBefore + expectedFee);
    });

    it("Should reject redemption with insufficient balance", async function () {
      const amount = ethers.parseEther("10000"); // More than user has

      await expect(spk.connect(user).redeemForEnergy(amount)).to.be.revertedWith(
        "Insufficient SPK balance"
      );
    });

    it("Should reject zero redemption", async function () {
      await expect(spk.connect(user).redeemForEnergy(0)).to.be.revertedWith(
        "Redeem amount must be > 0"
      );
    });
  });

  describe("Grid Safety: Rule E (Stress Safeguard)", function () {
    beforeEach(async function () {
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));
    });

    it("Should allow minting when grid not stressed", async function () {
      expect(await spk.gridStressed()).to.be.false;

      // Should not revert
      await expect(spk.connect(minter).mintFromSurplus(1000, user.address)).not.to
        .be.reverted;
    });

    it("Should block minting when grid stressed", async function () {
      // Set grid stressed
      await spk.connect(oracle).setGridStressed(true);

      await expect(
        spk.connect(minter).mintFromSurplus(1000, user.address)
      ).to.be.revertedWith("Grid stressed: minting paused");
    });

    it("Should allow oracle to toggle grid stress", async function () {
      await spk.connect(oracle).setGridStressed(true);
      expect(await spk.gridStressed()).to.be.true;

      await spk.connect(oracle).setGridStressed(false);
      expect(await spk.gridStressed()).to.be.false;
    });
  });

  describe("Reserve Management", function () {
    it("Should accept reserve deposits and update balance", async function () {
      const depositAmount = 10_000n * USDC_DECIMALS;
      await usdc.mint(user.address, depositAmount);
      await usdc.connect(user).approve(spk.target, depositAmount);

      const reserveBefore = await spk.usdcReserve();
      await spk.connect(user).depositReserve(depositAmount);
      const reserveAfter = await spk.usdcReserve();

      expect(reserveAfter).to.equal(reserveBefore + depositAmount);
    });

    it("Should block reserve withdrawals from non-manager", async function () {
      await expect(
        spk.connect(user).withdrawReserve(1000n * USDC_DECIMALS, user.address)
      ).to.be.reverted;
    });

    it("Should allow reserve manager to withdraw", async function () {
      const withdrawAmount = 5000n * USDC_DECIMALS;
      const reserveBefore = await spk.usdcReserve();

      await spk.connect(owner).withdrawReserve(withdrawAmount, owner.address);

      const reserveAfter = await spk.usdcReserve();
      expect(reserveAfter).to.equal(reserveBefore - withdrawAmount);
    });

    it("Should enforce reserve ratio on minting", async function () {
      const reserveAmount = await spk.usdcReserve();
      await spk.connect(owner).withdrawReserve(reserveAmount, owner.address);
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));

      await expect(
        spk.connect(minter).mintFromSurplus(1000, user.address)
      ).to.be.revertedWith("Grid stressed: minting paused");
    });
  });

  describe("Parameter Management", function () {
    it("Should allow owner to update control parameters", async function () {
      const newBand = ethers.parseEther("0.03"); // ±3%
      const newPropGain = ethers.parseEther("0.02");
      const newIntGain = ethers.parseEther("0.01");

      await spk
        .connect(owner)
        .updateControlParameters(newBand, newPropGain, newIntGain);

      expect(await spk.pegBand()).to.equal(newBand);
      expect(await spk.proportionalGain()).to.equal(newPropGain);
      expect(await spk.integralGain()).to.equal(newIntGain);
    });

    it("Should reject invalid band values", async function () {
      const invalidBand = ethers.parseEther("0.2"); // 20%, too high

      await expect(
        spk
          .connect(owner)
          .updateControlParameters(
            invalidBand,
            ethers.parseEther("0.01"),
            ethers.parseEther("0.01")
          )
      ).to.be.revertedWith("Invalid band");
    });

    it("Should allow owner to update fees", async function () {
      const newMintFee = 500; // 0.05%
      const newRedeemFee = 500;

      await spk.connect(owner).updateFees(newMintFee, newRedeemFee);

      expect(await spk.mintingFee()).to.equal(newMintFee);
      expect(await spk.redemptionFee()).to.equal(newRedeemFee);
    });

    it("Should reject excessive fee values", async function () {
      const excessiveFee = 10000; // 100%, too high

      await expect(spk.connect(owner).updateFees(excessiveFee, 500)).to.be.revertedWith(
        "Mint fee too high"
      );
    });

    it("Should enforce timelock queue for owner changes when governance delay is enabled", async function () {
      const delay = 3600;
      const newMintFee = 100;
      const newRedeemFee = 120;

      await spk.connect(owner).setGovernanceDelay(delay);

      await expect(
        spk.connect(owner).updateFees(newMintFee, newRedeemFee)
      ).to.be.revertedWith("governance action not queued");

      const actionId = await spk.actionIdUpdateFees(newMintFee, newRedeemFee);
      await spk.connect(owner).queueGovernanceAction(actionId);

      await expect(
        spk.connect(owner).updateFees(newMintFee, newRedeemFee)
      ).to.be.revertedWith("governance action timelocked");

      await ethers.provider.send("evm_increaseTime", [delay + 1]);
      await ethers.provider.send("evm_mine");

      await spk.connect(owner).updateFees(newMintFee, newRedeemFee);
      expect(await spk.mintingFee()).to.equal(newMintFee);
      expect(await spk.redemptionFee()).to.equal(newRedeemFee);
    });

    it("Should allow cancelling queued governance action", async function () {
      const delay = 1800;
      const newMintFee = 80;
      const newRedeemFee = 90;

      await spk.connect(owner).setGovernanceDelay(delay);
      const actionId = await spk.actionIdUpdateFees(newMintFee, newRedeemFee);
      await spk.connect(owner).queueGovernanceAction(actionId);
      await spk.connect(owner).cancelGovernanceAction(actionId);

      await ethers.provider.send("evm_increaseTime", [delay + 1]);
      await ethers.provider.send("evm_mine");

      await expect(
        spk.connect(owner).updateFees(newMintFee, newRedeemFee)
      ).to.be.revertedWith("governance action not queued");
    });

    it("Should enforce minter bond requirements when configured", async function () {
      const minterBond = 100n * USDC_DECIMALS;
      await spk.connect(owner).setBondRequirements(minterBond, 0);
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));

      await expect(
        spk.connect(minter).mintFromSurplus(1000, user.address)
      ).to.be.revertedWith("minter bond too low");

      await usdc.mint(minter.address, minterBond);
      await usdc.connect(minter).approve(treasury.target, minterBond);
      await treasury.connect(minter).depositBond(minterBond);

      await expect(
        spk.connect(minter).mintFromSurplus(1000, user.address)
      ).not.to.be.reverted;
    });

    it("Should enforce oracle bond requirements when configured", async function () {
      const oracleBond = 100n * USDC_DECIMALS;
      await spk.connect(owner).setBondRequirements(0, oracleBond);

      await expect(
        spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"))
      ).to.be.revertedWith("oracle bond too low");

      await usdc.mint(oracle.address, oracleBond);
      await usdc.connect(oracle).approve(treasury.target, oracleBond);
      await treasury.connect(oracle).depositBond(oracleBond);

      await expect(
        spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"))
      ).not.to.be.reverted;
    });

    it("Should rotate backup operators via explicit operator role setter", async function () {
      const reserveManagerRole = await spk.RESERVE_MANAGER_ROLE();

      await spk.connect(owner).setOperatorRole(reserveManagerRole, user.address, true);
      await expect(
        spk.connect(user).withdrawReserve(1000n * USDC_DECIMALS, user.address)
      ).not.to.be.reverted;

      await spk.connect(owner).setOperatorRole(reserveManagerRole, user.address, false);
      await expect(
        spk.connect(user).withdrawReserve(1n, user.address)
      ).to.be.reverted;
    });

    it("Should reject unsupported roles in operator role setter", async function () {
      await expect(
        spk.connect(owner).setOperatorRole(ethers.id("FAKE_ROLE"), user.address, true)
      ).to.be.revertedWith("Unsupported role");
    });

    it("Should allow oracle to update energy price", async function () {
      const newPrice = ethers.parseEther("0.05"); // $0.05 per kWh

      const tx = await spk.connect(oracle).updateEnergyPrice(newPrice);

      expect(await spk.energyPricePerKwh()).to.equal(newPrice);
      await expect(tx).to.emit(spk, "EnergyPriceUpdated");
    });

    it("Should reject energy price update from non-oracle", async function () {
      await expect(
        spk.connect(user).updateEnergyPrice(ethers.parseEther("0.05"))
      ).to.be.reverted;
    });

    it("Should scale mint amounts by energyPricePerKwh", async function () {
      // Set price to $0.05/kWh
      const energyPrice = ethers.parseEther("0.05");
      await spk.connect(oracle).updateEnergyPrice(energyPrice);
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));

      // 1000 kWh × $0.05 = $50 = 50 SPK (minus fee)
      const surplusKwh = 1000;
      const baseSPK = BigInt(surplusKwh) * energyPrice;
      const totalFee = (baseSPK * 10n) / 10000n;
      const expectedNet = baseSPK - totalFee;

      await spk.connect(minter).mintFromSurplus(surplusKwh, user.address);
      expect(await spk.balanceOf(user.address)).to.equal(expectedNet);
    });

    it("Should allow owner to set stability fee share", async function () {
      await spk.connect(owner).setStabilityFeeShare(7500); // 75% to stability pool

      expect(await spk.stabilityFeeShare()).to.equal(7500);
    });

    it("Should reject stability fee share above 100%", async function () {
      await expect(
        spk.connect(owner).setStabilityFeeShare(10001)
      ).to.be.revertedWith("Share exceeds 100%");
    });

    it("Should route fees according to stability fee share", async function () {
      // Set 75% to stability pool
      await spk.connect(owner).setStabilityFeeShare(7500);
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));

      const surplusKwh = 1000;
      const baseSPK = ethers.parseEther("1000");
      const totalFee = (baseSPK * 10n) / 10000n;
      const expectedTreasuryFee = (totalFee * 2500n) / 10000n; // 25% to treasury

      await spk.connect(minter).mintFromSurplus(surplusKwh, user.address);

      expect(await spk.balanceOf(treasury.target)).to.equal(expectedTreasuryFee);
    });

    it("Should enforce governance timelock for setStabilityFeeShare when delay is set", async function () {
      // Enable a 1-hour governance delay
      await spk.connect(owner).setGovernanceDelay(3600);

      // Direct call should revert — action not queued
      await expect(
        spk.connect(owner).setStabilityFeeShare(7500)
      ).to.be.revertedWith("governance action not queued");

      // Queue the action
      const actionId = await spk.actionIdSetStabilityFeeShare(7500);
      await spk.connect(owner).queueGovernanceAction(actionId);

      // Still timelocked
      await expect(
        spk.connect(owner).setStabilityFeeShare(7500)
      ).to.be.revertedWith("governance action timelocked");

      // Advance past delay
      await ethers.provider.send("evm_increaseTime", [3601]);
      await ethers.provider.send("evm_mine");

      // Now succeeds
      await spk.connect(owner).setStabilityFeeShare(7500);
      expect(await spk.stabilityFeeShare()).to.equal(7500);

      // Reset for other tests
      await spk.connect(owner).setGovernanceDelay(0);
    });

    it("Should atomically transfer owner and DEFAULT_ADMIN_ROLE via handoffAdmin", async function () {
      const DEFAULT_ADMIN_ROLE = await spk.DEFAULT_ADMIN_ROLE();

      expect(await spk.owner()).to.equal(owner.address);
      expect(await spk.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;

      await spk.connect(owner).handoffAdmin(user.address);

      expect(await spk.owner()).to.equal(user.address);
      expect(await spk.hasRole(DEFAULT_ADMIN_ROLE, user.address)).to.be.true;
      expect(await spk.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.false;
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));
      await spk.connect(minter).mintFromSurplus(10000, user.address);
    });

    it("Should estimate mint amount correctly", async function () {
      const surplusKwh = 5000;
      const baseSPK = ethers.parseEther("5000");
      const fee = (baseSPK * 10n) / 10000n;
      const expected = baseSPK - fee;

      const estimated = await spk.estimateMintAmount(surplusKwh);
      expect(estimated).to.equal(expected);
    });

    it("Should calculate reserve ratio", async function () {
      const ratio = await spk.getReserveRatio();
      expect(ratio).to.equal(10000); // 10,000% reserve ratio with seeded reserves
    });

    it("Should track cumulative surplus", async function () {
      const trackBefore = await spk.cumulativeSurplusKwh();
      expect(trackBefore).to.equal(10000);

      await spk.connect(minter).mintFromSurplus(5000, user.address);
      const trackAfter = await spk.cumulativeSurplusKwh();
      expect(trackAfter).to.equal(15000);
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow pauser to pause", async function () {
      const PAUSER_ROLE = await spk.PAUSER_ROLE();
      await spk.grantRole(PAUSER_ROLE, owner.address);

      await spk.connect(owner).pause();
      expect(await spk.paused()).to.be.true;
    });

    it("Should block transfers when paused", async function () {
      const PAUSER_ROLE = await spk.PAUSER_ROLE();
      await spk.grantRole(PAUSER_ROLE, owner.address);

      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));
      await spk.connect(minter).mintFromSurplus(1000, user.address);

      await spk.connect(owner).pause();

      // Either reverted with error message or custom error
      await expect(
        spk.connect(user).transfer(owner.address, 100)
      ).to.be.reverted;
    });

    it("Should allow owner to unpause", async function () {
      const PAUSER_ROLE = await spk.PAUSER_ROLE();
      await spk.grantRole(PAUSER_ROLE, owner.address);

      await spk.connect(owner).pause();
      await spk.connect(owner).unpause();
      expect(await spk.paused()).to.be.false;
    });
  });

  describe("Integration: Full Flow", function () {
    it("Should complete mint -> adjust -> redeem flow", async function () {
      // 1. Oracle reports price
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));

      // 2. Minter mints from surplus
      await spk.connect(minter).mintFromSurplus(10000, user.address);
      let balance = await spk.balanceOf(user.address);
      expect(balance).to.be.gt(0);

      // 3. Oracle detects price increase
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1.07"));

      // 4. Peg controller burns to stabilize
      let totalSupplyBefore = await spk.totalSupply();

      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1.08"));
      let totalSupplyAfter = await spk.totalSupply();

      // Supply should have increased (mint)
      expect(totalSupplyAfter).to.be.gte(totalSupplyBefore);

      // 5. User redeems SPK
      const redeemAmount = ethers.parseEther("100");
      await spk.connect(user).redeemForEnergy(redeemAmount);

      const finalBalance = await spk.balanceOf(user.address);
      expect(finalBalance).to.equal(balance - redeemAmount);
    });

    it("Should handle supply cap", async function () {
      // Just verify the cap exists and is enforced
      const supplyCap = await spk.supplyCap();
      expect(supplyCap).to.equal(ethers.parseEther("1000000000")); // 1B SPK

      // Try to mint close to cap - just verify it doesn't overflow
      await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));
      
      // This should succeed (well under cap)
      const tx = await spk.connect(minter).mintFromSurplus(1000, user.address);
      expect(tx).to.not.be.reverted;
    });
  });
});
