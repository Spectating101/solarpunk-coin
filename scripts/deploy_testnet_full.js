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

  // --- Step 2: Deploy ProtocolTreasury ---
  console.log("\n[2/4] Deploying ProtocolTreasury (fee vault + bond escrow)...");
  const ProtocolTreasury = await hre.ethers.getContractFactory("ProtocolTreasury");
  const treasury = await ProtocolTreasury.deploy(usdcAddress);
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  const treasuryTx = treasury.deploymentTransaction();
  console.log(`  ProtocolTreasury: ${treasuryAddress}`);
  console.log(`  Tx:               ${treasuryTx?.hash || "n/a"}`);
  await (await treasury.setBudgetVaults(treasuryAddress, treasuryAddress, deployer.address, deployer.address)).wait();
  console.log("  Budget vaults:    reserve/insurance -> treasury, ops/audit -> deployer");

  // --- Step 3: Deploy SolarPunkCoin ---
  console.log("\n[3/4] Deploying SolarPunkCoin (Pillar 1+2: peg-controlled stablecoin)...");
  const SolarPunkCoin = await hre.ethers.getContractFactory("SolarPunkCoin");
  const spk = await SolarPunkCoin.deploy(usdcAddress);
  await spk.waitForDeployment();
  const spkAddress = await spk.getAddress();
  const spkTx = spk.deploymentTransaction();
  console.log(`  SolarPunkCoin: ${spkAddress}`);
  console.log(`  Tx:            ${spkTx?.hash || "n/a"}`);
  await (await spk.setTreasury(treasuryAddress)).wait();
  console.log(`  Treasury set to: ${treasuryAddress}`);

  // --- Step 4: Deploy SolarPunkOption ---
  const priceDecimals = Number(process.env.PRICE_DECIMALS || 6);
  console.log(`\n[4/4] Deploying SolarPunkOption (Pillar 3: clearinghouse, ${priceDecimals} decimals)...`);
  const SolarPunkOption = await hre.ethers.getContractFactory("SolarPunkOption");
  const option = await SolarPunkOption.deploy(usdcAddress, treasuryAddress, priceDecimals);
  await option.waitForDeployment();
  const optionAddress = await option.getAddress();
  const optionTx = option.deploymentTransaction();
  console.log(`  SolarPunkOption: ${optionAddress}`);
  console.log(`  Tx:              ${optionTx?.hash || "n/a"}`);
  await (await option.setTradingFeeBps(50)).wait();
  console.log("  Trading fee:      50 bps");

  // --- Save deployment receipt ---
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
    contracts: {
      MockUSDC: { address: usdcAddress, tx: usdcTx?.hash || null },
      ProtocolTreasury: { address: treasuryAddress, tx: treasuryTx?.hash || null },
      SolarPunkCoin: { address: spkAddress, tx: spkTx?.hash || null },
      SolarPunkOption: { address: optionAddress, tx: optionTx?.hash || null },
    },
    price_decimals: priceDecimals,
    trading_fee_bps: 50,
    insurance_fund: treasuryAddress,
    budget_vaults: {
      reserve: treasuryAddress,
      insurance: treasuryAddress,
      ops: deployer.address,
      audit: deployer.address,
    },
  };

  const receiptFile = path.join(deployDir, `${networkName}_full_deploy.json`);
  fs.writeFileSync(receiptFile, JSON.stringify(receipt, null, 2) + "\n");

  // NOTE: Do not write ambiguous dotfiles like `.testnet_address` that can be
  // confused with public testnet deployments. The canonical source of truth is
  // the network-scoped receipt: `state/deployments/<network>_full_deploy.json`.

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
  console.log(`  ProtocolTreasury: ${explorerBase}/address/${treasuryAddress}`);
  console.log(`  SolarPunkCoin:   ${explorerBase}/address/${spkAddress}`);
  console.log(`  SolarPunkOption: ${explorerBase}/address/${optionAddress}`);
  console.log(`\nReceipt saved to: ${receiptFile}`);
  console.log(`\nNext steps:`);
  console.log(`  1. Verify contracts on explorer:`);
  console.log(`     npx hardhat verify --network ${networkName} ${treasuryAddress} ${usdcAddress}`);
  console.log(`     npx hardhat verify --network ${networkName} ${spkAddress} ${usdcAddress}`);
  console.log(`     npx hardhat verify --network ${networkName} ${optionAddress} ${usdcAddress} ${treasuryAddress} ${priceDecimals}`);
  console.log(`  2. Update README.md with contract addresses`);
  console.log(`  3. Test interactions via Hardhat console:`);
  console.log(`     npx hardhat console --network ${networkName}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
