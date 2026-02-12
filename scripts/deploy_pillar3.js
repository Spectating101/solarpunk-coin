const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying Pillar 3 contracts with account:", deployer.address);

  // 1. Deploy Mock USDC (if on localhost/testnet and needed)
  // In production, you would use the real USDC address.
  let usdcAddress;
  const networkName = hre.network.name;

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

  // 2. Define Insurance Fund (deployer for now)
  const insuranceFund = deployer.address;
  // Use 6 decimals by default to align with USDC/most price feeds; override via PRICE_DECIMALS if needed.
  const priceDecimals = Number(process.env.PRICE_DECIMALS || 6);

  // 3. Deploy SolarPunkOption
  const SolarPunkOption = await hre.ethers.getContractFactory("SolarPunkOption");
  const optionContract = await SolarPunkOption.deploy(
    usdcAddress,
    insuranceFund,
    priceDecimals
  );
  await optionContract.waitForDeployment();

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
    collateral_address: usdcAddress,
    insurance_fund: insuranceFund,
    price_decimals: priceDecimals,
    deploy_tx_hash: deployTxHash,
  };

  fs.writeFileSync(
    path.join(deployDir, "solarpunk_option_deploy.json"),
    JSON.stringify(deployArtifact, null, 2) + "\n",
    "utf-8"
  );
  fs.writeFileSync(path.join(rootDir, ".pillar3_address"), `${optionAddress}\n`, "utf-8");
  if (deployTxHash) {
    fs.writeFileSync(path.join(rootDir, ".pillar3_tx_hash"), `${deployTxHash}\n`, "utf-8");
  }

  // 4. Verify (if on Etherscan/PolygonScan)
  // await hre.run("verify:verify", { address: optionContract.target, constructorArguments: [usdcAddress, insuranceFund] });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
