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
  const optionGovernanceDelay = Number(process.env.OPTION_GOVERNANCE_DELAY_SECONDS || 0);

  console.log("=".repeat(60));
  console.log("SolarPunk Protocol - Full Testnet Deployment");
  console.log("=".repeat(60));
  console.log(`Network:  ${networkName} (chain ${chainId})`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Governance admin: ${governanceAdmin}`);

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
  await (await treasury.setBudgetVaults(
    reserveVault || treasuryAddress,
    insuranceVault || treasuryAddress,
    opsVault,
    auditVault
  )).wait();
  if (treasuryGovernanceDelay > 0) {
    await (await treasury.setGovernanceDelay(treasuryGovernanceDelay)).wait();
  }
  console.log("  Budget vaults configured");

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
  const spkMinterBondUnits = process.env.SPK_MINTER_BOND_UNITS || "0";
  const spkOracleBondUnits = process.env.SPK_ORACLE_BOND_UNITS || "0";
  if (spkMinterBondUnits !== "0" || spkOracleBondUnits !== "0") {
    await (await spk.setBondRequirements(spkMinterBondUnits, spkOracleBondUnits)).wait();
    console.log(`  SPK bond mins:  minter=${spkMinterBondUnits}, oracle=${spkOracleBondUnits}`);
  }
  if (spkGovernanceDelay > 0) {
    await (await spk.setGovernanceDelay(spkGovernanceDelay)).wait();
  }

  // --- Step 4: Deploy SolarPunkOption ---
  const priceDecimals = Number(process.env.PRICE_DECIMALS || 6);
  console.log(`\n[4/4] Deploying SolarPunkOption (Pillar 3: clearinghouse, ${priceDecimals} decimals)...`);
  const SolarPunkOption = await hre.ethers.getContractFactory("SolarPunkOption");
  const option = await SolarPunkOption.deploy(usdcAddress, treasuryAddress, priceDecimals);
  await option.waitForDeployment();
  const optionAddress = await option.getAddress();
  const optionTx = option.deploymentTransaction();
  const tradingFeeBps = Number(process.env.TRADING_FEE_BPS || 50);
  const oracleBondUnits = process.env.ORACLE_BOND_UNITS || "0";
  const liquidatorBondUnits = process.env.LIQUIDATOR_BOND_UNITS || "0";
  console.log(`  SolarPunkOption: ${optionAddress}`);
  console.log(`  Tx:              ${optionTx?.hash || "n/a"}`);
  await (await option.setTradingFeeBps(tradingFeeBps)).wait();
  console.log(`  Trading fee:      ${tradingFeeBps} bps`);
  if (oracleBondUnits !== "0" || liquidatorBondUnits !== "0") {
    await (await option.setBondRequirements(oracleBondUnits, liquidatorBondUnits)).wait();
    console.log(`  Bond minimums:    oracle=${oracleBondUnits}, liquidator=${liquidatorBondUnits}`);
  }
  if (optionGovernanceDelay > 0) {
    await (await option.setGovernanceDelay(optionGovernanceDelay)).wait();
  }

  if (governanceAdmin !== deployer.address) {
    console.log("\n[admin] Granting governance admin controls...");
    const TREASURY_ADMIN = await treasury.DEFAULT_ADMIN_ROLE();
    const BUDGET_MANAGER_ROLE = await treasury.BUDGET_MANAGER_ROLE();
    const SLASHER_ROLE = await treasury.SLASHER_ROLE();
    const OPTION_ADMIN = await option.DEFAULT_ADMIN_ROLE();
    const OPTION_PAUSER = await option.PAUSER_ROLE();
    const SPK_ADMIN = await spk.DEFAULT_ADMIN_ROLE();
    const SPK_PAUSER = await spk.PAUSER_ROLE();

    await (await treasury.grantRole(TREASURY_ADMIN, governanceAdmin)).wait();
    await (await treasury.grantRole(BUDGET_MANAGER_ROLE, governanceAdmin)).wait();
    await (await treasury.grantRole(SLASHER_ROLE, governanceAdmin)).wait();
    await (await option.grantRole(OPTION_ADMIN, governanceAdmin)).wait();
    await (await option.grantRole(OPTION_PAUSER, governanceAdmin)).wait();
    await (await spk.grantRole(SPK_ADMIN, governanceAdmin)).wait();
    await (await spk.grantRole(SPK_PAUSER, governanceAdmin)).wait();
    await (await spk.transferOwnership(governanceAdmin)).wait();

    if (strictAdminHandoff) {
      console.log("  Strict admin handoff enabled: renouncing deployer admin roles");
      await (await treasury.renounceRole(TREASURY_ADMIN, deployer.address)).wait();
      await (await treasury.renounceRole(BUDGET_MANAGER_ROLE, deployer.address)).wait();
      await (await treasury.renounceRole(SLASHER_ROLE, deployer.address)).wait();
      await (await option.renounceRole(OPTION_ADMIN, deployer.address)).wait();
      await (await option.renounceRole(OPTION_PAUSER, deployer.address)).wait();
      await (await spk.renounceRole(SPK_ADMIN, deployer.address)).wait();
      await (await spk.renounceRole(SPK_PAUSER, deployer.address)).wait();
    }
  }

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
    governance_admin: governanceAdmin,
    strict_admin_handoff: strictAdminHandoff,
    governance_delays_seconds: {
      treasury: treasuryGovernanceDelay,
      spk: spkGovernanceDelay,
      option: optionGovernanceDelay,
    },
    contracts: {
      MockUSDC: { address: usdcAddress, tx: usdcTx?.hash || null },
      ProtocolTreasury: { address: treasuryAddress, tx: treasuryTx?.hash || null },
      SolarPunkCoin: { address: spkAddress, tx: spkTx?.hash || null },
      SolarPunkOption: { address: optionAddress, tx: optionTx?.hash || null },
    },
    price_decimals: priceDecimals,
    trading_fee_bps: tradingFeeBps,
    spk_bond_requirements: {
      minter: spkMinterBondUnits,
      oracle: spkOracleBondUnits,
    },
    bond_requirements: {
      oracle: oracleBondUnits,
      liquidator: liquidatorBondUnits,
    },
    insurance_fund: treasuryAddress,
    budget_vaults: {
      reserve: reserveVault || treasuryAddress,
      insurance: insuranceVault || treasuryAddress,
      ops: opsVault,
      audit: auditVault,
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
