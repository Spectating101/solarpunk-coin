/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const hre = require('hardhat');

const ROOT = path.join(__dirname, '..');
const REPO_BLOB_ROOT = 'https://github.com/Spectating101/solarpunk-coin/blob';

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function writeJson(relativePath, value) {
  const target = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function bytes32FromHex(hex) {
  return hex.startsWith('0x') ? hex : `0x${hex}`;
}

async function main() {
  const { ethers, network } = hre;
  const nonLocal = !['hardhat', 'localhost'].includes(network.name);
  if (nonLocal && process.env.PROTOCOL_ALPHA_DEPLOY_CONFIRM !== '1') {
    throw new Error(
      `Refusing ${network.name} deployment without PROTOCOL_ALPHA_DEPLOY_CONFIRM=1. ` +
      'Public Alpha is not a paid/mainnet product.',
    );
  }
  if (nonLocal && !process.env.PROTOCOL_ALPHA_SOURCE_REF) {
    throw new Error(
      'Non-local deployment requires PROTOCOL_ALPHA_SOURCE_REF set to an immutable commit SHA or release tag for policy-manifest URIs.',
    );
  }

  const core = await import('../packages/constraint-core/src/index.js');
  const [deployer] = await ethers.getSigners();
  const chain = await ethers.provider.getNetwork();
  const sourceRef = process.env.PROTOCOL_ALPHA_SOURCE_REF || 'feat/constraint-protocol-alpha';

  const PolicyRegistry = await ethers.getContractFactory('PolicyRegistry');
  const policyRegistry = await PolicyRegistry.deploy(deployer.address);
  await policyRegistry.waitForDeployment();

  const ClaimRegistry = await ethers.getContractFactory('ClaimRegistry');
  const claimRegistry = await ClaimRegistry.deploy(deployer.address, await policyRegistry.getAddress());
  await claimRegistry.waitForDeployment();

  const SettlementLedger = await ethers.getContractFactory('SettlementLedger');
  const settlementLedger = await SettlementLedger.deploy(deployer.address, await claimRegistry.getAddress());
  await settlementLedger.waitForDeployment();

  await (await claimRegistry.grantRole(
    await claimRegistry.SETTLEMENT_ROLE(),
    await settlementLedger.getAddress(),
  )).wait();

  const publishedPolicies = [];
  for (const policy of core.BUILTIN_POLICIES) {
    const manifestHash = await core.hashPolicyManifest(policy);
    const policyId = ethers.id(policy.id);
    const registryVersion = core.policyVersionCode(policy.version);
    const uri = `${REPO_BLOB_ROOT}/${sourceRef}/protocol/policies/${policy.id}.json`;
    const tx = await policyRegistry.publishPolicy(
      policyId,
      bytes32FromHex(manifestHash),
      registryVersion,
      uri,
    );
    await tx.wait();
    publishedPolicies.push({
      id: policy.id,
      policy_id_bytes32: policyId,
      semantic_version: policy.version,
      registry_version: registryVersion,
      manifest_hash: manifestHash,
      uri,
    });
  }

  const start = readJson('data/inverter/sample_cumulative_start.json');
  const end = readJson('data/inverter/sample_cumulative_end.json');
  const normalized = core.normalizeCumulativePair(start, end);
  const evidence = await core.buildEvidenceEnvelope(normalized, { source_label: 'constraint-alpha-deploy-smoke' });
  const provenance = core.classifyProvenance(evidence, { sample_fixture: true });
  const policy = core.policyById('LAB-OPEN-001');
  const policyDecision = core.evaluatePolicy({ evidence, provenance, policy });
  const claim = await core.createClaimManifest({
    evidence,
    provenance,
    policyDecision,
    subject: deployer.address.toLowerCase(),
  });

  const claimId = bytes32FromHex(claim.claim_id);
  const evidenceHash = bytes32FromHex(claim.evidence_hash);
  const policyId = ethers.id(claim.policy_id);
  const policyManifestHash = bytes32FromHex(claim.policy_manifest_hash);
  const policyVersion = core.policyVersionCode(claim.policy_version);
  const admittedBaseUnits = BigInt(claim.quantity_base_units);

  await (await claimRegistry.createClaim(
    claimId,
    evidenceHash,
    policyId,
    policyManifestHash,
    policyVersion,
    admittedBaseUnits,
    claim.quantity_decimals,
    deployer.address,
  )).wait();

  const issuedQuantity = Math.min(20, Number(claim.quantity));
  const issuedBaseUnits = core.quantityToBaseUnits(issuedQuantity, claim.quantity_decimals);
  await (await claimRegistry.issueClaim(claimId, issuedBaseUnits)).wait();
  await (await claimRegistry.activateClaim(claimId)).wait();

  const capacityQuantity = Math.min(8, issuedQuantity);
  const capacityBaseUnits = core.quantityToBaseUnits(capacityQuantity, claim.quantity_decimals);
  await (await settlementLedger.evaluateSettlement(claimId, capacityBaseUnits)).wait();

  const storedClaim = await claimRegistry.getClaim(claimId);
  const storedSettlement = await settlementLedger.latestSettlement(claimId);
  const latestBlock = await ethers.provider.getBlockNumber();

  const runtime = {
    schema: 'solarpunk.constraint.protocol_alpha_runtime.v1',
    generated_at: new Date().toISOString(),
    network: network.name,
    chain_id: Number(chain.chainId),
    source_ref: sourceRef,
    deployment_block: latestBlock,
    deployer: deployer.address,
    contracts: {
      policy_registry: await policyRegistry.getAddress(),
      claim_registry: await claimRegistry.getAddress(),
      settlement_ledger: await settlementLedger.getAddress(),
    },
    policies: publishedPolicies,
    smoke_claim: {
      claim_id: claim.claim_id,
      evidence_hash: claim.evidence_hash,
      policy_id: claim.policy_id,
      policy_version: claim.policy_version,
      policy_manifest_hash: claim.policy_manifest_hash,
      quantity: claim.quantity,
      quantity_base_units: claim.quantity_base_units,
      quantity_decimals: claim.quantity_decimals,
      issued_quantity: issuedQuantity,
      issued_quantity_base_units: issuedBaseUnits.toString(),
      state: Number(storedClaim.state),
    },
    smoke_settlement: {
      outstanding_base_units: storedSettlement.outstandingQuantity.toString(),
      declared_capacity_base_units: storedSettlement.declaredCapacity.toString(),
      covered_base_units: storedSettlement.coveredQuantity.toString(),
      shortfall_base_units: storedSettlement.shortfallQuantity.toString(),
      covered_quantity: core.baseUnitsToQuantityString(storedSettlement.coveredQuantity, claim.quantity_decimals),
      shortfall_quantity: core.baseUnitsToQuantityString(storedSettlement.shortfallQuantity, claim.quantity_decimals),
    },
    boundaries: [
      'Local/default deployment is a deterministic protocol smoke test.',
      'Non-local deployment requires explicit PROTOCOL_ALPHA_DEPLOY_CONFIRM=1 and immutable PROTOCOL_ALPHA_SOURCE_REF.',
      'Policy evaluation remains off-chain; authorized claim issuers bind claims to the active policy manifest hash/version.',
      'SettlementLedger records declared capacity and shortfall but does not custody reserves.',
      'No legal redemption right is created by this runtime artifact.',
    ],
  };

  writeJson('state/protocol/constraint_protocol_alpha_runtime.json', runtime);

  console.log('=== Constraint Protocol Alpha Deployment ===');
  console.log(`network: ${network.name} (${chain.chainId})`);
  console.log(`PolicyRegistry: ${runtime.contracts.policy_registry}`);
  console.log(`ClaimRegistry: ${runtime.contracts.claim_registry}`);
  console.log(`SettlementLedger: ${runtime.contracts.settlement_ledger}`);
  console.log(`published policies: ${publishedPolicies.length}`);
  console.log(`smoke claim: ${claim.claim_id} state=${runtime.smoke_claim.state}`);
  console.log(`smoke settlement: covered=${runtime.smoke_settlement.covered_quantity} shortfall=${runtime.smoke_settlement.shortfall_quantity}`);
  console.log('wrote: state/protocol/constraint_protocol_alpha_runtime.json');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
