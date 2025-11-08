import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("🌱 Deploying SolarPunkCoin...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy SolarPunkCoin
  const SolarPunkCoin = await ethers.getContractFactory("SolarPunkCoin");
  const spk = await SolarPunkCoin.deploy(deployer.address);
  await spk.waitForDeployment();

  const spkAddress = await spk.getAddress();
  console.log("✅ SolarPunkCoin deployed to:", spkAddress);
  console.log("   Name:", await spk.name());
  console.log("   Symbol:", await spk.symbol());
  console.log("   Max Supply:", ethers.formatEther(await spk.MAX_SUPPLY()), "SPK");
  console.log("   Admin:", deployer.address);

  console.log("\n📋 Deployment Summary:");
  console.log("━".repeat(60));
  console.log("Contract:", "SolarPunkCoin (SPK)");
  console.log("Address:", spkAddress);
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId.toString());
  console.log("━".repeat(60));

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    spkToken: spkAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  console.log("\n💾 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🚀 Deployment complete!");
  console.log("\nNext steps:");
  console.log("1. Deploy EnergyOracle with SPK address");
  console.log("2. Grant MINTER_ROLE to Oracle contract");
  console.log("3. Set up energy data providers");
  console.log("4. Configure grid stress monitoring");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
