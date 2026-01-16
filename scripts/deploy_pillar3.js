const hre = require("hardhat");

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

  console.log("SolarPunkOption (Pillar 3) deployed to:", optionContract.target);

  // 4. Verify (if on Etherscan/PolygonScan)
  // await hre.run("verify:verify", { address: optionContract.target, constructorArguments: [usdcAddress, insuranceFund] });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
