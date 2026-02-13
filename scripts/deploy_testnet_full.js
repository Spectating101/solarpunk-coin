const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Full testnet deployment: MockUSDC + SolarPunkCoin + SolarPunkOption
 *
 * Usage:
 *   npx hardhat run scripts/deploy_testnet_full.js --network sepolia
 *   npx hardhat run scripts/deploy_testnet_full.js --network amoy
 */
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const networkName = hre.network.name;
  const chainId = hre.network.config.chainId;

  console.log("=".repeat(60));
  console.log("SolarPunk Protocol - Full Testnet Deployment");
  console.log("=".repeat(60));
  console.log(`Network:  ${networkName} (chain ${chainId})`);
  console.log(`Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceEth = hre.ethers.formatEther(balance);
  console.log(`Balance:  ${balanceEth} ETH`);

  if (balance === 0n) {
    console.error("\nNo balance! Fund this address with testnet ETH first:");
    console.error(`  ${deployer.address}`);
    console.error("\nFaucets (browser required):");
    console.error("  Sepolia: https://cloud.google.com/application/web3/faucet/ethereum/sepolia (Google login)");
    console.error("  Sepolia: https://faucet.chainstack.com/sepolia-testnet-faucet (0.08 mainnet ETH)");
    console.error("  Sepolia: https://www.alchemy.com/faucets/ethereum-sepolia (0.001 mainnet ETH)");
    console.error("  Sepolia: https://sepolia-faucet.pk910.de/ (PoW mining, no login)");
    console.error("  Holesky: https://cloud.google.com/application/web3/faucet/ethereum/holesky (Google login)");
    console.error("  Holesky: https://holesky-faucet.pk910.de/ (PoW mining, no login)");
    console.error("  Amoy:    https://www.alchemy.com/faucets/polygon-amoy");
    console.error("\nRecommended: pk910 PoW faucets (no login, mine for ~2 min in browser)");
    process.exit(1);
  }

  console.log();

  // --- Step 1: Deploy MockUSDC ---
  console.log("[1/3] Deploying MockUSDC (testnet collateral)...");
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  const usdcTx = usdc.deploymentTransaction();
  console.log(`  MockUSDC:  ${usdcAddress}`);
  console.log(`  Tx:        ${usdcTx?.hash || "n/a"}`);

  // --- Step 2: Deploy SolarPunkCoin ---
  console.log("\n[2/3] Deploying SolarPunkCoin (Pillar 1+2: peg-controlled stablecoin)...");
  const SolarPunkCoin = await hre.ethers.getContractFactory("SolarPunkCoin");
  const spk = await SolarPunkCoin.deploy(usdcAddress);
  await spk.waitForDeployment();
  const spkAddress = await spk.getAddress();
  const spkTx = spk.deploymentTransaction();
  console.log(`  SolarPunkCoin: ${spkAddress}`);
  console.log(`  Tx:            ${spkTx?.hash || "n/a"}`);

  // --- Step 3: Deploy SolarPunkOption ---
  const priceDecimals = Number(process.env.PRICE_DECIMALS || 6);
  console.log(`\n[3/3] Deploying SolarPunkOption (Pillar 3: clearinghouse, ${priceDecimals} decimals)...`);
  const SolarPunkOption = await hre.ethers.getContractFactory("SolarPunkOption");
  const option = await SolarPunkOption.deploy(usdcAddress, deployer.address, priceDecimals);
  await option.waitForDeployment();
  const optionAddress = await option.getAddress();
  const optionTx = option.deploymentTransaction();
  console.log(`  SolarPunkOption: ${optionAddress}`);
  console.log(`  Tx:              ${optionTx?.hash || "n/a"}`);

  // --- Save deployment receipt ---
  const rootDir = path.join(__dirname, "..");
  const deployDir = path.join(rootDir, "state", "deployments");
  fs.mkdirSync(deployDir, { recursive: true });

  const receipt = {
    generated_at: new Date().toISOString(),
    network: networkName,
    chain_id: chainId,
    deployer: deployer.address,
    contracts: {
      MockUSDC: { address: usdcAddress, tx: usdcTx?.hash || null },
      SolarPunkCoin: { address: spkAddress, tx: spkTx?.hash || null },
      SolarPunkOption: { address: optionAddress, tx: optionTx?.hash || null },
    },
    price_decimals: priceDecimals,
    insurance_fund: deployer.address,
  };

  const receiptFile = path.join(deployDir, `${networkName}_full_deploy.json`);
  fs.writeFileSync(receiptFile, JSON.stringify(receipt, null, 2) + "\n");

  // Also write quick-reference files
  fs.writeFileSync(path.join(rootDir, ".testnet_address"), spkAddress + "\n");
  fs.writeFileSync(path.join(rootDir, ".testnet_tx_hash"), (spkTx?.hash || "") + "\n");
  fs.writeFileSync(path.join(rootDir, ".pillar3_address"), optionAddress + "\n");
  fs.writeFileSync(path.join(rootDir, ".pillar3_tx_hash"), (optionTx?.hash || "") + "\n");

  // --- Summary ---
  const explorerBase = {
    sepolia: "https://sepolia.etherscan.io",
    holesky: "https://holesky.etherscan.io",
    amoy: "https://amoy.polygonscan.com",
  }[networkName] || `https://${networkName}.etherscan.io`;

  console.log("\n" + "=".repeat(60));
  console.log("DEPLOYMENT COMPLETE");
  console.log("=".repeat(60));
  console.log(`\nContracts on ${networkName}:`);
  console.log(`  MockUSDC:        ${explorerBase}/address/${usdcAddress}`);
  console.log(`  SolarPunkCoin:   ${explorerBase}/address/${spkAddress}`);
  console.log(`  SolarPunkOption: ${explorerBase}/address/${optionAddress}`);
  console.log(`\nReceipt saved to: ${receiptFile}`);
  console.log(`\nNext steps:`);
  console.log(`  1. Verify contracts on explorer:`);
  console.log(`     npx hardhat verify --network ${networkName} ${spkAddress} ${usdcAddress}`);
  console.log(`     npx hardhat verify --network ${networkName} ${optionAddress} ${usdcAddress} ${deployer.address} ${priceDecimals}`);
  console.log(`  2. Update README.md with contract addresses`);
  console.log(`  3. Test interactions via Hardhat console:`);
  console.log(`     npx hardhat console --network ${networkName}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
