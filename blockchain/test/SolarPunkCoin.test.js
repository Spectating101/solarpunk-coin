import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("SolarPunkCoin", function () {
  async function deploySPKFixture() {
    const [admin, producer, user1, user2] = await ethers.getSigners();

    const SolarPunkCoin = await ethers.getContractFactory("SolarPunkCoin");
    const spk = await SolarPunkCoin.deploy(admin.address);

    return { spk, admin, producer, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      const { spk } = await loadFixture(deploySPKFixture);

      expect(await spk.name()).to.equal("SolarPunkCoin");
      expect(await spk.symbol()).to.equal("SPK");
    });

    it("Should grant admin roles to deployer", async function () {
      const { spk, admin } = await loadFixture(deploySPKFixture);

      const MINTER_ROLE = await spk.MINTER_ROLE();
      const PAUSER_ROLE = await spk.PAUSER_ROLE();
      const DEFAULT_ADMIN_ROLE = await spk.DEFAULT_ADMIN_ROLE();

      expect(await spk.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true;
      expect(await spk.hasRole(MINTER_ROLE, admin.address)).to.be.true;
      expect(await spk.hasRole(PAUSER_ROLE, admin.address)).to.be.true;
    });

    it("Should start with zero supply", async function () {
      const { spk } = await loadFixture(deploySPKFixture);
      expect(await spk.totalSupply()).to.equal(0);
    });
  });

  describe("Minting from Surplus Energy", function () {
    it("Should mint tokens equal to energy kWh", async function () {
      const { spk, admin, producer } = await loadFixture(deploySPKFixture);

      const energyKwh = ethers.parseEther("100"); // 100 kWh
      const proofHash = ethers.id("meter-signature-1");

      await expect(spk.connect(admin).mintFromSurplus(producer.address, energyKwh, proofHash))
        .to.emit(spk, "TokensMinted")
        .withArgs(producer.address, energyKwh, energyKwh);

      expect(await spk.balanceOf(producer.address)).to.equal(energyKwh);
      expect(await spk.totalSupply()).to.equal(energyKwh);
      expect(await spk.totalEnergyBacking()).to.equal(energyKwh);
    });

    it("Should fail if not called by minter", async function () {
      const { spk, producer, user1 } = await loadFixture(deploySPKFixture);

      const energyKwh = ethers.parseEther("100");
      const proofHash = ethers.id("meter-signature-1");

      await expect(
        spk.connect(user1).mintFromSurplus(producer.address, energyKwh, proofHash)
      ).to.be.reverted;
    });

    it("Should fail when grid is stressed", async function () {
      const { spk, admin, producer } = await loadFixture(deploySPKFixture);

      await spk.connect(admin).setGridStress(true);

      const energyKwh = ethers.parseEther("100");
      const proofHash = ethers.id("meter-signature-1");

      await expect(
        spk.connect(admin).mintFromSurplus(producer.address, energyKwh, proofHash)
      ).to.be.revertedWith("Grid stressed");
    });

    it("Should enforce max supply cap", async function () {
      const { spk, admin, producer } = await loadFixture(deploySPKFixture);

      const maxSupply = await spk.MAX_SUPPLY();
      const energyKwh = maxSupply + ethers.parseEther("1");
      const proofHash = ethers.id("meter-signature-1");

      await expect(
        spk.connect(admin).mintFromSurplus(producer.address, energyKwh, proofHash)
      ).to.be.revertedWith("Max supply");
    });
  });

  describe("Grid Stress Management", function () {
    it("Should allow setting grid stress", async function () {
      const { spk, admin } = await loadFixture(deploySPKFixture);

      await spk.connect(admin).setGridStress(true);
      expect(await spk.isGridStressed()).to.be.true;

      await spk.connect(admin).setGridStress(false);
      expect(await spk.isGridStressed()).to.be.false;
    });

    it("Should only allow minter to set grid stress", async function () {
      const { spk, user1 } = await loadFixture(deploySPKFixture);

      await expect(
        spk.connect(user1).setGridStress(true)
      ).to.be.reverted;
    });
  });

  describe("Burning Tokens", function () {
    it("Should allow burning owned tokens", async function () {
      const { spk, admin, producer } = await loadFixture(deploySPKFixture);

      const energyKwh = ethers.parseEther("100");
      const proofHash = ethers.id("meter-signature-1");

      await spk.connect(admin).mintFromSurplus(producer.address, energyKwh, proofHash);

      const burnAmount = ethers.parseEther("30");
      await spk.connect(producer).burn(burnAmount);

      expect(await spk.balanceOf(producer.address)).to.equal(energyKwh - burnAmount);
      expect(await spk.totalSupply()).to.equal(energyKwh - burnAmount);
    });
  });

  describe("Pause Functionality", function () {
    it("Should pause and unpause", async function () {
      const { spk, admin } = await loadFixture(deploySPKFixture);

      await spk.connect(admin).pause();
      expect(await spk.paused()).to.be.true;

      await spk.connect(admin).unpause();
      expect(await spk.paused()).to.be.false;
    });

    it("Should prevent minting when paused", async function () {
      const { spk, admin, producer } = await loadFixture(deploySPKFixture);

      await spk.connect(admin).pause();

      const energyKwh = ethers.parseEther("100");
      const proofHash = ethers.id("meter-signature-1");

      await expect(
        spk.connect(admin).mintFromSurplus(producer.address, energyKwh, proofHash)
      ).to.be.reverted;
    });
  });

  describe("ERC20Votes Compatibility", function () {
    it("Should delegate votes", async function () {
      const { spk, admin, producer, user1 } = await loadFixture(deploySPKFixture);

      const energyKwh = ethers.parseEther("100");
      const proofHash = ethers.id("meter-signature-1");

      await spk.connect(admin).mintFromSurplus(producer.address, energyKwh, proofHash);

      await spk.connect(producer).delegate(user1.address);

      expect(await spk.getVotes(user1.address)).to.equal(energyKwh);
    });
  });
});
