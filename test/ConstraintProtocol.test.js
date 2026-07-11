const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Constraint Protocol Alpha', function () {
  async function deployFixture() {
    const [admin, subject, stranger] = await ethers.getSigners();

    const PolicyRegistry = await ethers.getContractFactory('PolicyRegistry');
    const policyRegistry = await PolicyRegistry.deploy(admin.address);

    const ClaimRegistry = await ethers.getContractFactory('ClaimRegistry');
    const claimRegistry = await ClaimRegistry.deploy(admin.address);

    const SettlementLedger = await ethers.getContractFactory('SettlementLedger');
    const settlementLedger = await SettlementLedger.deploy(admin.address, await claimRegistry.getAddress());

    await claimRegistry.grantRole(await claimRegistry.SETTLEMENT_ROLE(), await settlementLedger.getAddress());

    return { admin, subject, stranger, policyRegistry, claimRegistry, settlementLedger };
  }

  it('publishes versioned policy manifests and rejects rollback', async function () {
    const { policyRegistry } = await deployFixture();
    const policyId = ethers.id('ENERGY-PILOT-002');
    const hashV1 = ethers.sha256(ethers.toUtf8Bytes('policy-v1'));
    const hashV2 = ethers.sha256(ethers.toUtf8Bytes('policy-v2'));

    await expect(policyRegistry.publishPolicy(policyId, hashV1, 1, 'ipfs://policy-v1'))
      .to.emit(policyRegistry, 'PolicyPublished');
    await expect(policyRegistry.publishPolicy(policyId, hashV1, 1, 'ipfs://rollback'))
      .to.be.revertedWithCustomError(policyRegistry, 'VersionMustIncrease');
    await policyRegistry.publishPolicy(policyId, hashV2, 2, 'ipfs://policy-v2');

    const stored = await policyRegistry.getPolicy(policyId);
    expect(stored.version).to.equal(2n);
    expect(stored.manifestHash).to.equal(hashV2);
    expect(stored.active).to.equal(true);
  });

  it('enforces admitted quantity before activating a claim', async function () {
    const { subject, claimRegistry } = await deployFixture();
    const claimId = ethers.id('claim-alpha-1');
    const evidenceHash = ethers.sha256(ethers.toUtf8Bytes('evidence-alpha-1'));
    const policyId = ethers.id('LAB-OPEN-001');

    await claimRegistry.createClaim(claimId, evidenceHash, policyId, 100, subject.address);
    await expect(claimRegistry.issueClaim(claimId, 101))
      .to.be.revertedWithCustomError(claimRegistry, 'QuantityExceedsAdmission');

    await claimRegistry.issueClaim(claimId, 20);
    await claimRegistry.activateClaim(claimId);

    const claim = await claimRegistry.getClaim(claimId);
    expect(claim.admittedQuantity).to.equal(100n);
    expect(claim.issuedQuantity).to.equal(20n);
    expect(claim.state).to.equal(3n); // Active
  });

  it('records explicit partial settlement and shortfall from declared capacity', async function () {
    const { subject, claimRegistry, settlementLedger } = await deployFixture();
    const claimId = ethers.id('claim-alpha-shortfall');
    const evidenceHash = ethers.sha256(ethers.toUtf8Bytes('evidence-shortfall'));
    const policyId = ethers.id('ENERGY-PILOT-002');

    await claimRegistry.createClaim(claimId, evidenceHash, policyId, 50, subject.address);
    await claimRegistry.issueClaim(claimId, 20);
    await claimRegistry.activateClaim(claimId);

    await expect(settlementLedger.evaluateSettlement(claimId, 8))
      .to.emit(settlementLedger, 'SettlementEvaluated')
      .withArgs(claimId, 20, 8, 8, 12);

    const settlement = await settlementLedger.latestSettlement(claimId);
    const claim = await claimRegistry.getClaim(claimId);
    expect(settlement.coveredQuantity).to.equal(8n);
    expect(settlement.shortfallQuantity).to.equal(12n);
    expect(claim.state).to.equal(6n); // Partial
  });

  it('records full settlement when capacity covers the issued claim', async function () {
    const { subject, claimRegistry, settlementLedger } = await deployFixture();
    const claimId = ethers.id('claim-alpha-settled');

    await claimRegistry.createClaim(
      claimId,
      ethers.sha256(ethers.toUtf8Bytes('evidence-settled')),
      ethers.id('ENERGY-STRICT-003'),
      25,
      subject.address,
    );
    await claimRegistry.issueClaim(claimId, 20);
    await claimRegistry.activateClaim(claimId);
    await settlementLedger.evaluateSettlement(claimId, 25);

    const settlement = await settlementLedger.latestSettlement(claimId);
    const claim = await claimRegistry.getClaim(claimId);
    expect(settlement.coveredQuantity).to.equal(20n);
    expect(settlement.shortfallQuantity).to.equal(0n);
    expect(claim.state).to.equal(5n); // Settled
  });

  it('prevents unprivileged policy publication, claim creation, and settlement', async function () {
    const { subject, stranger, policyRegistry, claimRegistry, settlementLedger } = await deployFixture();
    await expect(
      policyRegistry.connect(stranger).publishPolicy(ethers.id('X'), ethers.id('Y'), 1, 'x'),
    ).to.be.reverted;

    const claimId = ethers.id('unauthorized-claim');
    await expect(
      claimRegistry.connect(stranger).createClaim(claimId, ethers.id('e'), ethers.id('p'), 10, subject.address),
    ).to.be.reverted;

    await claimRegistry.createClaim(claimId, ethers.id('e'), ethers.id('p'), 10, subject.address);
    await claimRegistry.issueClaim(claimId, 10);
    await claimRegistry.activateClaim(claimId);
    await expect(settlementLedger.connect(stranger).evaluateSettlement(claimId, 5)).to.be.reverted;
  });
});
