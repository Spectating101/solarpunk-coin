const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying SolarPunkCoin...");

  const networkName = hre.network.name;
  const [deployer] = await hre.ethers.getSigners();
  const governanceAdminRaw = process.env.GOVERNANCE_ADMIN || "";
  const governanceAdmin = governanceAdminRaw && hre.ethers.isAddress(governanceAdminRaw)
    ? governanceAdminRaw
    : deployer.address;
  const strictAdminHandoff = ["1", "true", "yes"].includes(
    String(process.env.STRICT_ADMIN_HANDOFF || "").toLowerCase()
  );
  const reserveVault = process.env.RESERVE_VAULT && hre.ethers.isAddress(process.env.RESERVE_VAULT)
    ? process.env.RESERVE_VAULT
    : null;
  const insuranceVault = process.env.INSURANCE_VAULT && hre.ethers.isAddress(process.env.INSURANCE_VAULT)
    ? process.env.INSURANCE_VAULT
    : null;
  const opsVault = process.env.OPS_VAULT && hre.ethers.isAddress(process.env.OPS_VAULT)
    ? process.env.OPS_VAULT
    : governanceAdmin;
  const auditVault = process.env.AUDIT_VAULT && hre.ethers.isAddress(process.env.AUDIT_VAULT)
    ? process.env.AUDIT_VAULT
    : governanceAdmin;
  const treasuryGovernanceDelay = Number(process.env.TREASURY_GOVERNANCE_DELAY_SECONDS || 0);
  const spkGovernanceDelay = Number(process.env.SPK_GOVERNANCE_DELAY_SECONDS || 0);
  let reserveTokenAddress;

  if (networkName === "localhost" || networkName === "hardhat") {
    console.log("Local network detected. Deploying MockUSDC...");
    const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();
    reserveTokenAddress = usdc.target;
    console.log("MockUSDC deployed to:", reserveTokenAddress);
  } else {
    reserveTokenAddress = process.env.RESERVE_TOKEN_ADDRESS;
    if (!reserveTokenAddress) {
      throw new Error("RESERVE_TOKEN_ADDRESS is required for non-local deployments.");
    }
    console.log("Using reserve token at:", reserveTokenAddress);
  }

  console.log("Deploying ProtocolTreasury...");
  const ProtocolTreasury = await hre.ethers.getContractFactory("ProtocolTreasury");
  const treasury = await ProtocolTreasury.deploy(reserveTokenAddress);
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("✅ ProtocolTreasury deployed to:", treasuryAddress);
  await (await treasury.setBudgetVaults(
    reserveVault || treasuryAddress,
    insuranceVault || treasuryAddress,
    opsVault,
    auditVault
  )).wait();
  if (treasuryGovernanceDelay > 0) {
    await (await treasury.setGovernanceDelay(treasuryGovernanceDelay)).wait();
  }
  console.log("✅ Budget vaults configured");

  // Deploy contract
  const SolarPunkCoin = await hre.ethers.getContractFactory("SolarPunkCoin");
  const spk = await SolarPunkCoin.deploy(reserveTokenAddress);
  await spk.waitForDeployment();
  await (await spk.setTreasury(treasuryAddress)).wait();
  const spkMinterBondUnits = process.env.SPK_MINTER_BOND_UNITS || "0";
  const spkOracleBondUnits = process.env.SPK_ORACLE_BOND_UNITS || "0";
  if (spkMinterBondUnits !== "0" || spkOracleBondUnits !== "0") {
    await (await spk.setBondRequirements(spkMinterBondUnits, spkOracleBondUnits)).wait();
    console.log(`✅ SPK bond minimums set (minter=${spkMinterBondUnits}, oracle=${spkOracleBondUnits})`);
  }
  if (spkGovernanceDelay > 0) {
    await (await spk.setGovernanceDelay(spkGovernanceDelay)).wait();
  }

  const contractAddress = await spk.getAddress();
  const deployTx = spk.deploymentTransaction();
  const deployTxHash = deployTx ? deployTx.hash : null;
  console.log("✅ SolarPunkCoin deployed to:", contractAddress);
  if (deployTxHash) {
    console.log("🧾 Deploy tx hash:", deployTxHash);
  }

  console.log("📍 Deployed by:", deployer.address);
  console.log("🛡️  Governance admin:", governanceAdmin);

  if (governanceAdmin !== deployer.address) {
    const TREASURY_ADMIN = await treasury.DEFAULT_ADMIN_ROLE();
    const BUDGET_MANAGER_ROLE = await treasury.BUDGET_MANAGER_ROLE();
    const SLASHER_ROLE = await treasury.SLASHER_ROLE();
    const SPK_ADMIN = await spk.DEFAULT_ADMIN_ROLE();
    const SPK_PAUSER = await spk.PAUSER_ROLE();

    await (await treasury.grantRole(TREASURY_ADMIN, governanceAdmin)).wait();
    await (await treasury.grantRole(BUDGET_MANAGER_ROLE, governanceAdmin)).wait();
    await (await treasury.grantRole(SLASHER_ROLE, governanceAdmin)).wait();
    await (await spk.grantRole(SPK_ADMIN, governanceAdmin)).wait();
    await (await spk.grantRole(SPK_PAUSER, governanceAdmin)).wait();
    await (await spk.transferOwnership(governanceAdmin)).wait();

    if (strictAdminHandoff) {
      await (await treasury.renounceRole(TREASURY_ADMIN, deployer.address)).wait();
      await (await treasury.renounceRole(BUDGET_MANAGER_ROLE, deployer.address)).wait();
      await (await treasury.renounceRole(SLASHER_ROLE, deployer.address)).wait();
      await (await spk.renounceRole(SPK_ADMIN, deployer.address)).wait();
      await (await spk.renounceRole(SPK_PAUSER, deployer.address)).wait();
    }
  }

  // Initial configuration
  console.log("\n⚙️  Initializing contract...");

  // Log initial parameters
  const pegTarget = await spk.pegTarget();
  const pegBand = await spk.pegBand();
  const mintingFee = await spk.mintingFee();

  console.log("Initial Parameters:");
  console.log("  - Peg Target: $1.00 (1e18)");
  console.log("  - Peg Band: ±5% (5e16)");
  console.log("  - Minting Fee: 0.1% (10 bps)");
  console.log("  - Supply Cap: 1,000,000,000 SPK");
  console.log("  - Reserve Token:", reserveTokenAddress);
  console.log("  - Treasury:", treasuryAddress);

  // Create verification info
  console.log("\n📋 Contract Information:");
  console.log("Name: SolarPunkCoin");
  console.log("Symbol: SPK");
  console.log("Decimals: 18");
  console.log("Network:", hre.network.name);

  console.log("\n✨ Deployment complete!");
  console.log(
    `Next steps: 
    1. Grant MINTER_ROLE to your minting service: 
       spk.grantRole(await spk.MINTER_ROLE(), minerAddress)
    2. Grant ORACLE_ROLE to your oracle service:
       spk.grantRole(await spk.ORACLE_ROLE(), oracleAddress)
    3. Test minting: spk.mintFromSurplus(1000, recipientAddress)
    4. Test peg control: spk.updateOraclePriceAndAdjust(price)
  `
  );

  // Return contract address for scripts
  const rootDir = path.join(__dirname, "..");
  // Keep deployment state outside Hardhat-managed artifacts/ to avoid accidental wipes.
  const deployDir = process.env.SPK_DEPLOYMENT_STATE_DIR
    ? path.resolve(rootDir, process.env.SPK_DEPLOYMENT_STATE_DIR)
    : path.join(rootDir, "state", "deployments");
  fs.mkdirSync(deployDir, { recursive: true });

  const deployArtifact = {
    generated_at: new Date().toISOString(),
    network: hre.network.name,
    chain_id: hre.network.config.chainId || null,
    contract: "SolarPunkCoin",
    contract_address: contractAddress,
    deployer: deployer.address,
    governance_admin: governanceAdmin,
    strict_admin_handoff: strictAdminHandoff,
    governance_delays_seconds: {
      treasury: treasuryGovernanceDelay,
      spk: spkGovernanceDelay,
    },
    reserve_token_address: reserveTokenAddress,
    treasury_address: treasuryAddress,
    spk_bond_requirements: {
      minter: spkMinterBondUnits,
      oracle: spkOracleBondUnits,
    },
    budget_vaults: {
      reserve: reserveVault || treasuryAddress,
      insurance: insuranceVault || treasuryAddress,
      ops: opsVault,
      audit: auditVault,
    },
    deploy_tx_hash: deployTxHash,
  };

  fs.writeFileSync(
    path.join(deployDir, `${networkName}_solarpunk_coin_deploy.json`),
    JSON.stringify(deployArtifact, null, 2) + "\n",
    "utf-8"
  );

  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
