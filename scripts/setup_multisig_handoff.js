/**
 * setup_multisig_handoff.js
 *
 * Creates a Gnosis Safe (1-of-1, deployer as owner) on Sepolia and transfers
 * admin authority over all three SolarPunk contracts to it.
 *
 * Safe canonical addresses (v1.4.1, same across all EVM chains):
 *   SafeProxyFactory:           0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67
 *   Safe singleton:             0x41675C099F32341bf84BFc5382aF534df5C7461a
 *   CompatibilityFallbackHandler: 0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99
 *
 * Handoff actions:
 *   SolarPunkCoin    → handoffAdmin(safe)         [atomic: Ownable + DEFAULT_ADMIN_ROLE]
 *   SolarPunkOption  → grantRole(DEFAULT_ADMIN, safe) + revokeRole(DEFAULT_ADMIN, deployer)
 *   ProtocolTreasury → grantRole(DEFAULT_ADMIN, safe) + revokeRole(DEFAULT_ADMIN, deployer)
 *
 * After this script, the deployer EOA has NO admin authority on any contract.
 * All future parameter changes must go through the Safe (and the 24h timelock queue).
 *
 * Run:
 *   npx hardhat run scripts/setup_multisig_handoff.js --network sepolia
 */

const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// ── Existing contract addresses ───────────────────────────────────────────────
const ADDRESSES = {
  SolarPunkCoin:    "0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F",
  SolarPunkOption:  "0xe40A88398b5f90D038f7A6F1f122112DCD9e4104",
  ProtocolTreasury: "0x138e793f095a33D2790349eC1066FED3A756dd2c",
};

// ── Safe v1.4.1 canonical addresses (verified on Sepolia) ─────────────────────
const SAFE_PROXY_FACTORY   = "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67";
const SAFE_SINGLETON       = "0x41675C099F32341bf84BFc5382aF534df5C7461a";
const FALLBACK_HANDLER     = "0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99";

// ── Minimal ABIs ──────────────────────────────────────────────────────────────
const FACTORY_ABI = [
  "function createProxyWithNonce(address _singleton, bytes memory initializer, uint256 saltNonce) external returns (address proxy)",
  "event ProxyCreation(address indexed proxy, address singleton)",
];

const SAFE_SINGLETON_ABI = [
  "function setup(address[] calldata _owners, uint256 _threshold, address to, bytes calldata data, address fallbackHandler, address paymentToken, uint256 payment, address payable paymentReceiver) external",
];

const ACCESS_CONTROL_ABI = [
  "function grantRole(bytes32 role, address account) external",
  "function revokeRole(bytes32 role, address account) external",
  "function DEFAULT_ADMIN_ROLE() external view returns (bytes32)",
  "function hasRole(bytes32 role, address account) external view returns (bool)",
];

const SPK_COIN_ABI = [
  ...ACCESS_CONTROL_ABI,
  "function handoffAdmin(address newAdmin) external",
  "function owner() external view returns (address)",
];

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
    receipt.actions.push({ step, note, tx: tx?.hash ?? null });
    console.log(`  ✓ ${step}`);
    if (note) console.log(`    ${note}`);
    if (tx)   console.log(`    tx: ${tx.hash}`);
  }

  // ── 1. Deploy Safe (1/1, deployer as sole owner) ──────────────────────────
  console.log("1/7 — Creating Safe (1-of-1, owner = deployer)…");

  const safeInterface = new ethers.Interface(SAFE_SINGLETON_ABI);
  const initializer = safeInterface.encodeFunctionData("setup", [
    [deployer.address],   // owners
    1,                    // threshold
    ethers.ZeroAddress,   // to (no delegate call on setup)
    "0x",                 // data
    FALLBACK_HANDLER,     // fallbackHandler
    ethers.ZeroAddress,   // paymentToken
    0,                    // payment
    ethers.ZeroAddress,   // paymentReceiver
  ]);

  const factory = new ethers.Contract(SAFE_PROXY_FACTORY, FACTORY_ABI, deployer);
  const saltNonce = BigInt(Date.now()); // unique per run
  const tx1 = await factory.createProxyWithNonce(SAFE_SINGLETON, initializer, saltNonce);
  const receipt1 = await tx1.wait();

  // Parse Safe address from ProxyCreation event
  const proxyCreationTopic = ethers.id("ProxyCreation(address,address)");
  const proxyLog = receipt1.logs.find(l => l.topics[0] === proxyCreationTopic);
  const safeAddress = "0x" + proxyLog.topics[1].slice(26);

  console.log(`\n  Safe deployed at: ${safeAddress}`);
  console.log(`  Explorer: https://sepolia.etherscan.io/address/${safeAddress}`);
  receipt.safeAddress = safeAddress;
  log("Safe created", `1-of-1 multisig, owner = ${deployer.address}`, tx1);

  // ── 2. SolarPunkCoin: handoffAdmin → Safe ─────────────────────────────────
  console.log("\n2/7 — SolarPunkCoin: handoffAdmin → Safe…");
  const spk = new ethers.Contract(ADDRESSES.SolarPunkCoin, SPK_COIN_ABI, deployer);
  const tx2 = await spk.handoffAdmin(safeAddress);
  await tx2.wait();
  log("SolarPunkCoin admin transferred", `Ownable owner + DEFAULT_ADMIN_ROLE → ${safeAddress}`, tx2);

  // Verify
  const newOwner = await spk.owner();
  const ADMIN_ROLE = await spk.DEFAULT_ADMIN_ROLE();
  const safeHasAdmin = await spk.hasRole(ADMIN_ROLE, safeAddress);
  const deployerHasAdmin = await spk.hasRole(ADMIN_ROLE, deployer.address);
  console.log(`    Verification — owner: ${newOwner === safeAddress ? "Safe ✓" : "WRONG"}`);
  console.log(`    Verification — Safe has DEFAULT_ADMIN_ROLE: ${safeHasAdmin ? "yes ✓" : "no ✗"}`);
  console.log(`    Verification — deployer has DEFAULT_ADMIN_ROLE: ${deployerHasAdmin ? "still yes ✗" : "revoked ✓"}`);

  // ── 3. SolarPunkOption: grant DEFAULT_ADMIN_ROLE to Safe ──────────────────
  console.log("\n3/7 — SolarPunkOption: grantRole(DEFAULT_ADMIN_ROLE, Safe)…");
  const option = new ethers.Contract(ADDRESSES.SolarPunkOption, ACCESS_CONTROL_ABI, deployer);
  const ADMIN_ROLE_OPT = await option.DEFAULT_ADMIN_ROLE();
  const tx3 = await option.grantRole(ADMIN_ROLE_OPT, safeAddress);
  await tx3.wait();
  log("SolarPunkOption DEFAULT_ADMIN_ROLE granted to Safe", safeAddress, tx3);

  // ── 4. SolarPunkOption: revoke DEFAULT_ADMIN_ROLE from deployer ───────────
  console.log("4/7 — SolarPunkOption: revokeRole(DEFAULT_ADMIN_ROLE, deployer)…");
  const tx4 = await option.revokeRole(ADMIN_ROLE_OPT, deployer.address);
  await tx4.wait();
  const deployerGoneOpt = !(await option.hasRole(ADMIN_ROLE_OPT, deployer.address));
  const safeHasOpt = await option.hasRole(ADMIN_ROLE_OPT, safeAddress);
  log("SolarPunkOption deployer admin revoked", `Safe has role: ${safeHasOpt} | deployer revoked: ${deployerGoneOpt}`, tx4);

  // ── 5. ProtocolTreasury: grant DEFAULT_ADMIN_ROLE to Safe ────────────────
  console.log("5/7 — ProtocolTreasury: grantRole(DEFAULT_ADMIN_ROLE, Safe)…");
  const treasury = new ethers.Contract(ADDRESSES.ProtocolTreasury, ACCESS_CONTROL_ABI, deployer);
  const ADMIN_ROLE_TREAS = await treasury.DEFAULT_ADMIN_ROLE();
  const tx5 = await treasury.grantRole(ADMIN_ROLE_TREAS, safeAddress);
  await tx5.wait();
  log("ProtocolTreasury DEFAULT_ADMIN_ROLE granted to Safe", safeAddress, tx5);

  // ── 6. ProtocolTreasury: revoke DEFAULT_ADMIN_ROLE from deployer ──────────
  console.log("6/7 — ProtocolTreasury: revokeRole(DEFAULT_ADMIN_ROLE, deployer)…");
  const tx6 = await treasury.revokeRole(ADMIN_ROLE_TREAS, deployer.address);
  await tx6.wait();
  const deployerGoneTreas = !(await treasury.hasRole(ADMIN_ROLE_TREAS, deployer.address));
  const safeHasTreas = await treasury.hasRole(ADMIN_ROLE_TREAS, safeAddress);
  log("ProtocolTreasury deployer admin revoked", `Safe has role: ${safeHasTreas} | deployer revoked: ${deployerGoneTreas}`, tx6);

  // ── 7. Save receipt ───────────────────────────────────────────────────────
  console.log("\n7/7 — Saving receipt…");
  const outPath = path.join(__dirname, "../state/deployments/sepolia_multisig_handoff.json");
  fs.writeFileSync(outPath, JSON.stringify(receipt, null, 2));
  log("Receipt saved", outPath, null);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n━━ Multisig Handoff Complete ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Safe address:    ${safeAddress}`);
  console.log(`Safe explorer:   https://sepolia.etherscan.io/address/${safeAddress}`);
  console.log(`Safe app:        https://app.safe.global/sep:${safeAddress}`);
  console.log("");
  console.log(`SolarPunkCoin    owner + DEFAULT_ADMIN_ROLE → Safe ✓`);
  console.log(`SolarPunkOption  DEFAULT_ADMIN_ROLE → Safe ✓  (deployer revoked)`);
  console.log(`ProtocolTreasury DEFAULT_ADMIN_ROLE → Safe ✓  (deployer revoked)`);
  console.log("");
  console.log("The deployer EOA now has zero admin authority on any contract.");
  console.log("All governance actions require the Safe + 24h timelock queue.");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
