const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Constraint Protocol Alpha', function () {
  const POLICY_VERSION = 1_000_000n; // semantic 1.0.0
  const DECIMALS = 6;
  const units = (value) => BigInt(value) * 1_000_000n;

  async function deployFixture() {
    const [admin, subject, stranger] = await ethers.getSigners();

    const PolicyRegistry = await ethers.getContractFactory('PolicyRegistry');
    const policyRegistry = await PolicyRegistry.deploy(admin.address);

    const ClaimRegistry = await ethers.getContractFactory('ClaimRegistry');
    const claimRegistry = await ClaimRegistry.deploy(admin.address, await policyRegistry.getAddress());

    const SettlementLedger = await ethers.getContractFactory('SettlementLedger');
    const settlementLedger = await SettlementLedger.deploy(admin.address, await claimRegistry.getAddress());

    await claimRegistry.grantRole(await claimRegistry.SETTLEMENT_ROLE(), await settlementLedger.getAddress());

    return { admin, subject, stranger, policyRegistry, claimRegistry, settlementLedger };
  }

  async function publishPolicy(policyRegistry, policyName = 'LAB-OPEN-001', manifestText = 'policy-v1') {
    const policyId = ethers.id(policyName);
    const manifestHash = ethers.sha256(ethers.toUtf8Bytes(manifestText));
    await policyRegistry.publishPolicy(
      policyId,
      manifestHash,
      POLICY_VERSION,
      `ipfs://${policyName.toLowerCase()}`,
    );
    return { policyId, manifestHash };
  }

  async function createBoundClaim({ claimRegistry, policyRegistry, subject, claimName = 'claim-alpha', admitted = 100n }) {
    const { policyId, manifestHash } = await publishPolicy(policyRegistry);
    const claimId = ethers.id(claimName);
    const evidenceHash = ethers.sha256(ethers.toUtf8Bytes(`${claimName}-evidence`));
    await claimRegistry.createClaim(
      claimId,
      evidenceHash,
      policyId,
      manifestHash,
      POLICY_VERSION,
      units(admitted),
      DECIMALS,
      subject.address,
    );
    return { claimId, evidenceHash, policyId, manifestHash };
  }

  it('publishes versioned policy manifests and rejects rollback', async function () {
    const { policyRegistry } = await deployFixture();
    const policyId = ethers.id('ENERGY-PILOT-002');
    const hashV1 = ethers.sha256(ethers.toUtf8Bytes('policy-v1'));
    const hashV2 = ethers.sha256(ethers.toUtf8Bytes('policy-v2'));

    await expect(policyRegistry.publishPolicy(policyId, hashV1, POLICY_VERSION, 'ipfs://policy-v1'))
      .to.emit(policyRegistry, 'PolicyPublished');
    await expect(policyRegistry.publishPolicy(policyId, hashV1, POLICY_VERSION, 'ipfs://rollback'))
      .to.be.revertedWithCustomError(policyRegistry, 'VersionMustIncrease');
    await policyRegistry.publishPolicy(policyId, hashV2, POLICY_VERSION + 1n, 'ipfs://policy-v2');

    const stored = await policyRegistry.getPolicy(policyId);
    expect(stored.version).to.equal(POLICY_VERSION + 1n);
    expect(stored.manifestHash).to.equal(hashV2);
    expect(stored.active).to.equal(true);
  });

  it('binds a claim to the active policy version and manifest hash', async function () {
    const { subject, policyRegistry, claimRegistry } = await deployFixture();
    const { policyId, manifestHash } = await publishPolicy(policyRegistry, 'LAB-OPEN-001');
    const claimId = ethers.id('claim-policy-binding');
    const evidenceHash = ethers.sha256(ethers.toUtf8Bytes('binding-evidence'));

    await expect(
      claimRegistry.createClaim(
        claimId,
        evidenceHash,
        policyId,
        ethers.sha256(ethers.toUtf8Bytes('wrong-policy')),
        POLICY_VERSION,
        units(100),
        DECIMALS,
        subject.address,
      ),
    ).to.be.revertedWithCustomError(claimRegistry, 'PolicyBindingMismatch');

    await claimRegistry.createClaim(
      claimId,
      evidenceHash,
      policyId,
      manifestHash,
      POLICY_VERSION,
      units(100),
      DECIMALS,
      subject.address,
    );

    const claim = await claimRegistry.getClaim(claimId);
    expect(claim.policyManifestHash).to.equal(manifestHash);
    expect(claim.policyVersion).to.equal(POLICY_VERSION);
    expect(claim.quantityDecimals).to.equal(DECIMALS);
  });

  it('enforces admitted quantity before activating a claim', async function () {
    const { subject, policyRegistry, claimRegistry } = await deployFixture();
    const { claimId } = await createBoundClaim({ claimRegistry, policyRegistry, subject, claimName: 'claim-alpha-1' });

    await expect(claimRegistry.issueClaim(claimId, units(101)))
      .to.be.revertedWithCustomError(claimRegistry, 'QuantityExceedsAdmission');

    await claimRegistry.issueClaim(claimId, units(20));
    await claimRegistry.activateClaim(claimId);

    const claim = await claimRegistry.getClaim(claimId);
    expect(claim.admittedQuantity).to.equal(units(100));
    expect(claim.issuedQuantity).to.equal(units(20));
    expect(claim.state).to.equal(3n); // Active
  });

  it('records explicit partial settlement and shortfall from declared capacity', async function () {
    const { subject, policyRegistry, claimRegistry, settlementLedger } = await deployFixture();
    const { claimId } = await createBoundClaim({ claimRegistry, policyRegistry, subject, claimName: 'claim-alpha-shortfall', admitted: 50n });

    await claimRegistry.issueClaim(claimId, units(20));
    await claimRegistry.activateClaim(claimId);

    await expect(settlementLedger.evaluateSettlement(claimId, units(8)))
      .to.emit(settlementLedger, 'SettlementEvaluated')
      .withArgs(claimId, units(20), units(8), units(8), units(12));

    const settlement = await settlementLedger.latestSettlement(claimId);
    const claim = await claimRegistry.getClaim(claimId);
    expect(settlement.coveredQuantity).to.equal(units(8));
    expect(settlement.shortfallQuantity).to.equal(units(12));
    expect(claim.state).to.equal(6n); // Partial
  });

  it('records full settlement when capacity covers the issued claim', async function () {
    const { subject, policyRegistry, claimRegistry, settlementLedger } = await deployFixture();
    const { claimId } = await createBoundClaim({ claimRegistry, policyRegistry, subject, claimName: 'claim-alpha-settled', admitted: 25n });

    await claimRegistry.issueClaim(claimId, units(20));
    await claimRegistry.activateClaim(claimId);
    await settlementLedger.evaluateSettlement(claimId, units(25));

    const settlement = await settlementLedger.latestSettlement(claimId);
    const claim = await claimRegistry.getClaim(claimId);
    expect(settlement.coveredQuantity).to.equal(units(20));
    expect(settlement.shortfallQuantity).to.equal(0n);
    expect(claim.state).to.equal(5n); // Settled
  });

  it('prevents unprivileged policy publication, claim creation, and settlement', async function () {
    const { subject, stranger, policyRegistry, claimRegistry, settlementLedger } = await deployFixture();
    await expect(
      policyRegistry.connect(stranger).publishPolicy(ethers.id('X'), ethers.id('Y'), 1, 'x'),
    ).to.be.reverted;

    const { policyId, manifestHash } = await publishPolicy(policyRegistry);
    const claimId = ethers.id('unauthorized-claim');
    const evidenceHash = ethers.sha256(ethers.toUtf8Bytes('unauthorized-evidence'));
    await expect(
      claimRegistry.connect(stranger).createClaim(
        claimId,
        evidenceHash,
        policyId,
        manifestHash,
        POLICY_VERSION,
        units(10),
        DECIMALS,
        subject.address,
      ),
    ).to.be.reverted;

    await claimRegistry.createClaim(
      claimId,
      evidenceHash,
      policyId,
      manifestHash,
      POLICY_VERSION,
      units(10),
      DECIMALS,
      subject.address,
    );
    await claimRegistry.issueClaim(claimId, units(10));
    await claimRegistry.activateClaim(claimId);
    await expect(settlementLedger.connect(stranger).evaluateSettlement(claimId, units(5))).to.be.reverted;
  });
});
