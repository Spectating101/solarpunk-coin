/**
 * setup_m3_security.js
 *
 * Executes all M3 security-credibility actions against a live deployment in one script.
 *
 * Actions (in order):
 *   1. Deploy StabilityPool
 *   2. Deploy ChainlinkOracleAdapter (manual energy price, no Chainlink feed yet)
 *   3. Set manual energy price on adapter ($0.05 / kWh)
 *   4. Deposit 100 USDC keeper bond into ProtocolTreasury (deployer becomes bonded)
 *   5. SolarPunkCoin: setBondRequirements (100 USDC minter + oracle)
 *   6. SolarPunkOption: setBondRequirements (100 USDC oracle + liquidator)
 *   7. SolarPunkCoin: setStabilityPool → StabilityPool contract
 *   8. SolarPunkCoin: grantRole(ORACLE_ROLE, ChainlinkOracleAdapter)
 *   9. SolarPunkOption: grantRole(ORACLE_ROLE, ChainlinkOracleAdapter)
 *  10. StabilityPool: grantRole(DISBURSER_ROLE, deployer)
 *  11. SolarPunkCoin: setGovernanceDelay(86400)
 *  12. SolarPunkOption: setGovernanceDelay(86400)
 *  13. ProtocolTreasury: setGovernanceDelay(86400)
 *  14. Save state/deployments/sepolia_m3_setup.json
 *
 * NOTE: All governed functions (setBondRequirements, setStabilityPool) must be called
 * BEFORE setting the governance delay. Once delay > 0, they require a 24h queue.
 *
 * Run:
 *   npx hardhat run scripts/setup_m3_security.js --network sepolia
 */

const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// ── Deployment addresses (from sepolia_full_deploy.json) ──────────────────────
const ADDRESSES = {
  MockUSDC:         "0xa467ab7BD1143fB1bF435097b4c72910AbBC1fe2",
  ProtocolTreasury: "0x138e793f095a33D2790349eC1066FED3A756dd2c",
  SolarPunkCoin:    "0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F",
  SolarPunkOption:  "0xe40A88398b5f90D038f7A6F1f122112DCD9e4104",
};

// ── Parameters ────────────────────────────────────────────────────────────────
const BOND_AMOUNT_USDC   = ethers.parseUnits("100", 6);  // 100 USDC (6 dec)
const MANUAL_ENERGY_PRICE = ethers.parseEther("0.05");   // $0.05 / kWh in 1e18
const GOVERNANCE_DELAY   = 86400n;                        // 24 hours in seconds

// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`\nDeployer: ${deployer.address}`);
  console.log(`Network:  ${(await ethers.provider.getNetwork()).name}\n`);

  const receipt = {
    generated_at: new Date().toISOString(),
    deployer: deployer.address,
    actions: [],
  };

  function log(step, note, tx) {
    const entry = { step, note, tx: tx?.hash ?? null };
    receipt.actions.push(entry);
    console.log(`  ✓ ${step}`);
    if (note) console.log(`    ${note}`);
    if (tx)   console.log(`    tx: ${tx.hash}`);
  }

  // ── Attach existing contracts ─────────────────────────────────────────────
  const usdc     = await ethers.getContractAt("MockUSDC",         ADDRESSES.MockUSDC);
  const treasury = await ethers.getContractAt("ProtocolTreasury", ADDRESSES.ProtocolTreasury);
  const spk      = await ethers.getContractAt("SolarPunkCoin",    ADDRESSES.SolarPunkCoin);
  const option   = await ethers.getContractAt("SolarPunkOption",  ADDRESSES.SolarPunkOption);

  // ── 1. Deploy StabilityPool ───────────────────────────────────────────────
  console.log("1/13 — Deploying StabilityPool…");
  const StabilityPool = await ethers.getContractFactory("StabilityPool");
  const stabilityPool = await StabilityPool.deploy(deployer.address);
  await stabilityPool.waitForDeployment();
  const stabilityPoolAddr = await stabilityPool.getAddress();
  log("StabilityPool deployed", `admin = deployer`, { hash: stabilityPool.deploymentTransaction().hash });
  receipt.StabilityPool = stabilityPoolAddr;

  // ── 2. Deploy ChainlinkOracleAdapter ─────────────────────────────────────
  console.log("2/13 — Deploying ChainlinkOracleAdapter…");
  const Adapter = await ethers.getContractFactory("ChainlinkOracleAdapter");
  const adapter = await Adapter.deploy(ADDRESSES.SolarPunkCoin, ADDRESSES.SolarPunkOption);
  await adapter.waitForDeployment();
  const adapterAddr = await adapter.getAddress();
  log("ChainlinkOracleAdapter deployed", `spkCoin=${ADDRESSES.SolarPunkCoin}, spkOption=${ADDRESSES.SolarPunkOption}`, { hash: adapter.deploymentTransaction().hash });
  receipt.ChainlinkOracleAdapter = adapterAddr;

  // ── 3. Set manual energy price on adapter ────────────────────────────────
  console.log("3/13 — Setting manual energy price ($0.05/kWh)…");
  let tx = await adapter.setManualEnergyPrice(MANUAL_ENERGY_PRICE);
  await tx.wait();
  log("Manual energy price set", "$0.05/kWh (5e16) — no Chainlink energy feed on Sepolia yet", tx);

  // ── 4. Deposit keeper bond into Treasury ─────────────────────────────────
  console.log("4/13 — Depositing 100 USDC keeper bond…");
  // Check current balance
  const usdcBal = await usdc.balanceOf(deployer.address);
  if (usdcBal < BOND_AMOUNT_USDC) {
    // Mint more if needed (MockUSDC is permissionless)
    tx = await usdc.mint(deployer.address, ethers.parseUnits("10000", 6));
    await tx.wait();
    console.log("    (minted extra MockUSDC)");
  }
  tx = await usdc.approve(ADDRESSES.ProtocolTreasury, BOND_AMOUNT_USDC);
  await tx.wait();
  tx = await treasury.depositBond(BOND_AMOUNT_USDC);
  await tx.wait();
  log("100 USDC bond deposited", "deployer is now a bonded keeper", tx);

  // ── 5. SolarPunkCoin: setBondRequirements ────────────────────────────────
  console.log("5/13 — SolarPunkCoin: setBondRequirements…");
  tx = await spk.setBondRequirements(BOND_AMOUNT_USDC, BOND_AMOUNT_USDC);
  await tx.wait();
  log("SolarPunkCoin bond requirements set", "minMinterBond=100 USDC, minOracleBond=100 USDC", tx);

  // ── 6. SolarPunkOption: setBondRequirements ──────────────────────────────
  console.log("6/13 — SolarPunkOption: setBondRequirements…");
  tx = await option.setBondRequirements(BOND_AMOUNT_USDC, BOND_AMOUNT_USDC);
  await tx.wait();
  log("SolarPunkOption bond requirements set", "minOracleBond=100 USDC, minLiquidatorBond=100 USDC", tx);

  // ── 7. SolarPunkCoin: setStabilityPool ───────────────────────────────────
  console.log("7/13 — SolarPunkCoin: setStabilityPool…");
  tx = await spk.setStabilityPool(stabilityPoolAddr);
  await tx.wait();
  log("SolarPunkCoin stability pool updated", `address(this) → ${stabilityPoolAddr}`, tx);

  // ── 8. SolarPunkCoin: grant ORACLE_ROLE to adapter ───────────────────────
  console.log("8/13 — SolarPunkCoin: grantRole(ORACLE_ROLE, adapter)…");
  const ORACLE_ROLE_SPK = await spk.ORACLE_ROLE();
  tx = await spk.grantRole(ORACLE_ROLE_SPK, adapterAddr);
  await tx.wait();
  log("SolarPunkCoin ORACLE_ROLE granted to adapter", adapterAddr, tx);

  // ── 9. SolarPunkOption: grant ORACLE_ROLE to adapter ─────────────────────
  console.log("9/13 — SolarPunkOption: grantRole(ORACLE_ROLE, adapter)…");
  const ORACLE_ROLE_OPT = await option.ORACLE_ROLE();
  tx = await option.grantRole(ORACLE_ROLE_OPT, adapterAddr);
  await tx.wait();
  log("SolarPunkOption ORACLE_ROLE granted to adapter", adapterAddr, tx);

  // ── 10. StabilityPool: grant DISBURSER_ROLE to deployer ──────────────────
  console.log("10/13 — StabilityPool: grantRole(DISBURSER_ROLE, deployer)…");
  const DISBURSER_ROLE = await stabilityPool.DISBURSER_ROLE();
  tx = await stabilityPool.grantRole(DISBURSER_ROLE, deployer.address);
  await tx.wait();
  log("StabilityPool DISBURSER_ROLE granted to deployer", deployer.address, tx);

  // ── 11. SolarPunkCoin: setGovernanceDelay(86400) ─────────────────────────
  console.log("11/13 — SolarPunkCoin: setGovernanceDelay(86400)…");
  tx = await spk.setGovernanceDelay(GOVERNANCE_DELAY);
  await tx.wait();
  log("SolarPunkCoin governance delay set", "86400s (24h)", tx);

  // ── 12. SolarPunkOption: setGovernanceDelay(86400) ───────────────────────
  console.log("12/13 — SolarPunkOption: setGovernanceDelay(86400)…");
  tx = await option.setGovernanceDelay(GOVERNANCE_DELAY);
  await tx.wait();
  log("SolarPunkOption governance delay set", "86400s (24h)", tx);

  // ── 13. ProtocolTreasury: setGovernanceDelay(86400) ──────────────────────
  console.log("13/13 — ProtocolTreasury: setGovernanceDelay(86400)…");
  tx = await treasury.setGovernanceDelay(GOVERNANCE_DELAY);
  await tx.wait();
  log("ProtocolTreasury governance delay set", "86400s (24h)", tx);

  // ── Save receipt ──────────────────────────────────────────────────────────
  const outPath = path.join(__dirname, "../state/deployments/sepolia_m3_setup.json");
  fs.writeFileSync(outPath, JSON.stringify(receipt, null, 2));
  console.log(`\nReceipt saved: ${outPath}`);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n━━ M3 Security Setup Complete ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`StabilityPool:          ${stabilityPoolAddr}`);
  console.log(`ChainlinkOracleAdapter: ${adapterAddr}`);
  console.log(`Energy price (manual):  $0.05/kWh`);
  console.log(`Keeper bond:            100 USDC deposited`);
  console.log(`Bond requirements:      100 USDC (all roles)`);
  console.log(`Governance delay:       86400s (24h) on all 3 contracts`);
  console.log(`Stability pool:         external contract (not address(this))`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("IMPORTANT: Governance delay is now live.");
  console.log("Future parameter changes require queueGovernanceAction() + 24h wait.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
