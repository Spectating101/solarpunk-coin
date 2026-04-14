const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying Pillar 3 contracts with account:", deployer.address);
  const governanceAdminRaw = process.env.GOVERNANCE_ADMIN || "";
  const governanceAdmin = governanceAdminRaw && hre.ethers.isAddress(governanceAdminRaw)
    ? governanceAdminRaw
    : deployer.address;
  const strictAdminHandoff = ["1", "true", "yes"].includes(
    String(process.env.STRICT_ADMIN_HANDOFF || "").toLowerCase()
  );
  const treasuryGovernanceDelay = Number(process.env.TREASURY_GOVERNANCE_DELAY_SECONDS || 0);
  const optionGovernanceDelay = Number(process.env.OPTION_GOVERNANCE_DELAY_SECONDS || 0);

  // 1. Deploy Mock USDC (if on localhost/testnet and needed)
  // In production, you would use the real USDC address.
  let usdcAddress;
  const networkName = hre.network.name;
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

  if (networkName === "localhost" || networkName === "hardhat") {
    console.log("Local network detected. Deploying MockUSDC...");
    const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();
    usdcAddress = usdc.target;
    console.log("MockUSDC deployed to:", usdcAddress);
  } else {
    // Replace with real USDC on target network (e.g. Polygon Mumbai)
    usdcAddress = process.env.USDC_ADDRESS || "0x0000000000000000000000000000000000000000"; 
    console.log("Using existing USDC at:", usdcAddress);
  }

  // 2. Deploy treasury and use it as the insurance fund
  console.log("Deploying ProtocolTreasury...");
  const ProtocolTreasury = await hre.ethers.getContractFactory("ProtocolTreasury");
  const treasury = await ProtocolTreasury.deploy(usdcAddress);
  await treasury.waitForDeployment();
  const treasuryAddress = treasury.target;
  console.log("ProtocolTreasury deployed to:", treasuryAddress);
  await (await treasury.setBudgetVaults(
    reserveVault || treasuryAddress,
    insuranceVault || treasuryAddress,
    opsVault,
    auditVault
  )).wait();
  if (treasuryGovernanceDelay > 0) {
    await (await treasury.setGovernanceDelay(treasuryGovernanceDelay)).wait();
  }
  console.log("Budget vaults configured");

  // 3. Define Insurance Fund (treasury)
  const insuranceFund = treasuryAddress;
  // Use 6 decimals by default to align with USDC/most price feeds; override via PRICE_DECIMALS if needed.
  const priceDecimals = Number(process.env.PRICE_DECIMALS || 6);

  // 4. Deploy SolarPunkOption
  const SolarPunkOption = await hre.ethers.getContractFactory("SolarPunkOption");
  const optionContract = await SolarPunkOption.deploy(
    usdcAddress,
    insuranceFund,
    priceDecimals
  );
  await optionContract.waitForDeployment();
  const tradingFeeBps = Number(process.env.TRADING_FEE_BPS || 50);
  const oracleBondUnits = process.env.ORACLE_BOND_UNITS || "0";
  const liquidatorBondUnits = process.env.LIQUIDATOR_BOND_UNITS || "0";
  await (await optionContract.setTradingFeeBps(tradingFeeBps)).wait();
  if (oracleBondUnits !== "0" || liquidatorBondUnits !== "0") {
    await (await optionContract.setBondRequirements(oracleBondUnits, liquidatorBondUnits)).wait();
  }
  if (optionGovernanceDelay > 0) {
    await (await optionContract.setGovernanceDelay(optionGovernanceDelay)).wait();
  }

  if (governanceAdmin !== deployer.address) {
    const TREASURY_ADMIN = await treasury.DEFAULT_ADMIN_ROLE();
    const BUDGET_MANAGER_ROLE = await treasury.BUDGET_MANAGER_ROLE();
    const SLASHER_ROLE = await treasury.SLASHER_ROLE();
    const OPTION_ADMIN = await optionContract.DEFAULT_ADMIN_ROLE();
    const OPTION_PAUSER = await optionContract.PAUSER_ROLE();

    await (await treasury.grantRole(TREASURY_ADMIN, governanceAdmin)).wait();
    await (await treasury.grantRole(BUDGET_MANAGER_ROLE, governanceAdmin)).wait();
    await (await treasury.grantRole(SLASHER_ROLE, governanceAdmin)).wait();
    await (await optionContract.grantRole(OPTION_ADMIN, governanceAdmin)).wait();
    await (await optionContract.grantRole(OPTION_PAUSER, governanceAdmin)).wait();

    if (strictAdminHandoff) {
      await (await treasury.renounceRole(TREASURY_ADMIN, deployer.address)).wait();
      await (await treasury.renounceRole(BUDGET_MANAGER_ROLE, deployer.address)).wait();
      await (await treasury.renounceRole(SLASHER_ROLE, deployer.address)).wait();
      await (await optionContract.renounceRole(OPTION_ADMIN, deployer.address)).wait();
      await (await optionContract.renounceRole(OPTION_PAUSER, deployer.address)).wait();
    }
  }

  const optionAddress = optionContract.target;
  const deployTx = optionContract.deploymentTransaction();
  const deployTxHash = deployTx ? deployTx.hash : null;
  console.log("SolarPunkOption (Pillar 3) deployed to:", optionAddress);
  if (deployTxHash) {
    console.log("Pillar3 deploy tx hash:", deployTxHash);
  }

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
    contract: "SolarPunkOption",
    contract_address: optionAddress,
    deployer: deployer.address,
    governance_admin: governanceAdmin,
    strict_admin_handoff: strictAdminHandoff,
    governance_delays_seconds: {
      treasury: treasuryGovernanceDelay,
      option: optionGovernanceDelay,
    },
    collateral_address: usdcAddress,
    treasury_address: treasuryAddress,
    budget_vaults: {
      reserve: reserveVault || treasuryAddress,
      insurance: insuranceVault || treasuryAddress,
      ops: opsVault,
      audit: auditVault,
    },
    insurance_fund: insuranceFund,
    price_decimals: priceDecimals,
    trading_fee_bps: tradingFeeBps,
    bond_requirements: {
      oracle: oracleBondUnits,
      liquidator: liquidatorBondUnits,
    },
    deploy_tx_hash: deployTxHash,
  };

  fs.writeFileSync(
    path.join(deployDir, `${networkName}_solarpunk_option_deploy.json`),
    JSON.stringify(deployArtifact, null, 2) + "\n",
    "utf-8"
  );

  // 4. Verify (if on Etherscan/PolygonScan)
  // await hre.run("verify:verify", { address: optionContract.target, constructorArguments: [usdcAddress, insuranceFund] });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
