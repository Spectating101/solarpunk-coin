// Helper script to get wallet address from private key
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(deployer.address);
}

main().catch(() => process.exit(1));
