const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Deploy EnergyRevenueFloor pilot contract.
 *
 * Usage:
 *   npx hardhat run scripts/deploy_energy_floor.js --network sepolia
 */
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const networkName = hre.network.name;
  const chainId = hre.network.config.chainId;

  console.log("=".repeat(60));
  console.log("SolarPunk Energy Revenue Floor");
  console.log("=".repeat(60));
  console.log(`Network: ${networkName} (${chainId})`);
  console.log(`Deployer: ${deployer.address}`);

  let settlementTokenAddress = process.env.SETTLEMENT_TOKEN_ADDRESS;
  if (!settlementTokenAddress && (networkName === "localhost" || networkName === "hardhat")) {
    console.log("Local network detected. Deploying MockUSDC for floor settlement...");
    const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();
    settlementTokenAddress = await usdc.getAddress();
    console.log("MockUSDC:", settlementTokenAddress);
  }

  if (!settlementTokenAddress) {
    throw new Error("SETTLEMENT_TOKEN_ADDRESS is required for non-local deployments.");
  }

  const treasuryAddress = process.env.ENERGY_FLOOR_TREASURY && hre.ethers.isAddress(process.env.ENERGY_FLOOR_TREASURY)
    ? process.env.ENERGY_FLOOR_TREASURY
    : deployer.address;

  const EnergyRevenueFloor = await hre.ethers.getContractFactory("EnergyRevenueFloor");
  const floor = await EnergyRevenueFloor.deploy(settlementTokenAddress, treasuryAddress);
  await floor.waitForDeployment();

  const floorAddress = await floor.getAddress();
  const deployTx = floor.deploymentTransaction();
  console.log(`EnergyRevenueFloor: ${floorAddress}`);
  console.log(`Tx: ${deployTx?.hash || "n/a"}`);

  const rootDir = path.join(__dirname, "..");
  const deployDir = process.env.SPK_DEPLOYMENT_STATE_DIR
    ? path.resolve(rootDir, process.env.SPK_DEPLOYMENT_STATE_DIR)
    : path.join(rootDir, "state", "deployments");
  fs.mkdirSync(deployDir, { recursive: true });

  const receipt = {
    generated_at: new Date().toISOString(),
    network: networkName,
    chain_id: chainId,
    deployer: deployer.address,
    contract: "EnergyRevenueFloor",
    settlement_token: settlementTokenAddress,
    treasury: treasuryAddress,
    contract_address: floorAddress,
    deploy_tx_hash: deployTx?.hash || null,
  };

  const outputPath = path.join(deployDir, `${networkName}_energy_floor_deploy.json`);
  fs.writeFileSync(outputPath, JSON.stringify(receipt, null, 2) + "\n", "utf-8");
  console.log("Receipt:", outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
