/**
 * fix_disburser_role.js
 *
 * Fixes the DISBURSER_ROLE wiring on StabilityPool.
 *
 * Bug: The M3 setup script granted DISBURSER_ROLE to the deployer EOA.
 * Fix: DISBURSER_ROLE must be on SolarPunkCoin, because when
 *      SolarPunkCoin.disburseStabilityPool() calls pool.withdraw(),
 *      msg.sender is the SolarPunkCoin contract address.
 *
 * NOTE: StabilityPool's DEFAULT_ADMIN_ROLE is held by the Safe multisig.
 * This script cannot run with the deployer key — it must be executed as a
 * Safe transaction from app.safe.global/sep:0xB95586775C73feB0154828c77832E106425C818A
 *
 * Calls to make via Safe:
 *   StabilityPool.grantRole(DISBURSER_ROLE, SolarPunkCoin)
 *   StabilityPool.revokeRole(DISBURSER_ROLE, deployerEOA)
 *
 * This script prints the encoded calldata for both calls so you can
 * paste them into the Safe transaction builder.
 */

const { ethers } = require("hardhat");

const STABILITY_POOL    = "0xb9c2Ac8166edFc899b591bc51746d75bFCEca086";
const SPK_COIN          = "0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F";
const DEPLOYER_EOA      = "0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54";
const SAFE              = "0xB95586775C73feB0154828c77832E106425C818A";

const ABI = [
  "function DISBURSER_ROLE() external view returns (bytes32)",
  "function grantRole(bytes32 role, address account) external",
  "function revokeRole(bytes32 role, address account) external",
  "function hasRole(bytes32 role, address account) external view returns (bool)",
];

async function main() {
  const pool = new ethers.Contract(STABILITY_POOL, ABI, ethers.provider);
  const DISBURSER_ROLE = await pool.DISBURSER_ROLE();

  const hasDeployer = await pool.hasRole(DISBURSER_ROLE, DEPLOYER_EOA);
  const hasCoin     = await pool.hasRole(DISBURSER_ROLE, SPK_COIN);

  console.log("\n━━ StabilityPool DISBURSER_ROLE current state ━━");
  console.log(`  Deployer EOA has DISBURSER_ROLE: ${hasDeployer}  (should be false)`);
  console.log(`  SolarPunkCoin has DISBURSER_ROLE: ${hasCoin}     (should be true)`);

  if (!hasDeployer && hasCoin) {
    console.log("\n✓ Already correct — no action needed.");
    return;
  }

  // Encode calldata for Safe transaction builder
  const iface = new ethers.Interface(ABI);
  const grantData  = iface.encodeFunctionData("grantRole",  [DISBURSER_ROLE, SPK_COIN]);
  const revokeData = iface.encodeFunctionData("revokeRole", [DISBURSER_ROLE, DEPLOYER_EOA]);

  console.log("\n━━ Safe transactions required ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Safe app: https://app.safe.global/sep:${SAFE}`);
  console.log("\nTransaction 1 — grantRole(DISBURSER_ROLE, SolarPunkCoin):");
  console.log(`  To:   ${STABILITY_POOL}`);
  console.log(`  Data: ${grantData}`);
  console.log("\nTransaction 2 — revokeRole(DISBURSER_ROLE, deployerEOA):");
  console.log(`  To:   ${STABILITY_POOL}`);
  console.log(`  Data: ${revokeData}`);
  console.log("\nPaste both into Safe → New Transaction → Transaction Builder.");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main().catch(console.error);
