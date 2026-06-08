/**
 * SPK v1 lean stack — Safe handoff for SolarPunkCoin + SolarPunkCurrencySystem.
 * Reads addresses from state/runtime/spk_v1.json.
 *
 *   npx hardhat run scripts/setup_spk_v1_multisig_handoff.js --network sepolia
 *   DRY_RUN=1 npx hardhat run scripts/setup_spk_v1_multisig_handoff.js --network sepolia
 */
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
const { readRuntime, mergeRuntime } = require("./lib/spk_v1_runtime");

const SAFE_PROXY_FACTORY = "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67";
const SAFE_SINGLETON = "0x41675C099F32341bf84BFc5382aF534df5C7461a";
const FALLBACK_HANDLER = "0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99";

const FACTORY_ABI = [
  "function createProxyWithNonce(address _singleton, bytes memory initializer, uint256 saltNonce) external returns (address proxy)",
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

async function main() {
  const runtime = readRuntime();
  const spkAddress = runtime?.contracts?.solar_punk_coin;
  const currencyAddress = runtime?.contracts?.currency_system;
  if (!spkAddress || !currencyAddress) {
    throw new Error("Missing SPK v1 addresses in state/runtime/spk_v1.json");
  }

  const [deployer] = await ethers.getSigners();
  const dryRun = process.env.DRY_RUN === "1";

  console.log("\nSPK v1 multisig handoff");
  console.log(`Deployer: ${deployer.address}`);
  console.log(`SPK:      ${spkAddress}`);
  console.log(`Currency: ${currencyAddress}`);
  console.log(`Dry run:  ${dryRun}\n`);

  if (dryRun) {
    console.log("Would: deploy 1-of-1 Safe, handoffAdmin(SPK), grant+revoke CurrencySystem admin.");
    return;
  }

  const receipt = {
    generated_at: new Date().toISOString(),
    stack: "spk_v1_lean",
    deployer: deployer.address,
    contracts: { solar_punk_coin: spkAddress, currency_system: currencyAddress },
    actions: [],
  };

  const safeInterface = new ethers.Interface(SAFE_SINGLETON_ABI);
  const initializer = safeInterface.encodeFunctionData("setup", [
    [deployer.address], 1, ethers.ZeroAddress, "0x", FALLBACK_HANDLER,
    ethers.ZeroAddress, 0, ethers.ZeroAddress,
  ]);

  const factory = new ethers.Contract(SAFE_PROXY_FACTORY, FACTORY_ABI, deployer);
  const tx1 = await factory.createProxyWithNonce(SAFE_SINGLETON, initializer, BigInt(Date.now()));
  const receipt1 = await tx1.wait();
  const proxyCreationTopic = ethers.id("ProxyCreation(address,address)");
  const proxyLog = receipt1.logs.find((l) => l.topics[0] === proxyCreationTopic);
  const safeAddress = ethers.getAddress("0x" + proxyLog.topics[1].slice(26));
  receipt.safe_address = safeAddress;
  receipt.actions.push({ step: "safe_created", tx: tx1.hash });

  const spk = new ethers.Contract(spkAddress, SPK_COIN_ABI, deployer);
  const tx2 = await spk.handoffAdmin(safeAddress);
  await tx2.wait();
  receipt.actions.push({ step: "spk_handoff_admin", tx: tx2.hash });

  const currency = new ethers.Contract(currencyAddress, ACCESS_CONTROL_ABI, deployer);
  const adminRole = await currency.DEFAULT_ADMIN_ROLE();
  const tx3 = await currency.grantRole(adminRole, safeAddress);
  await tx3.wait();
  const tx4 = await currency.revokeRole(adminRole, deployer.address);
  await tx4.wait();
  receipt.actions.push({ step: "currency_admin_to_safe", tx: tx3.hash });
  receipt.actions.push({ step: "currency_admin_revoked_deployer", tx: tx4.hash });

  const outPath = path.join(__dirname, "../state/deployments/spk_v1_sepolia_multisig_handoff.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(receipt, null, 2));

  mergeRuntime({
    governance_admin: safeAddress,
    multisig: { safe: safeAddress, handoff_at: receipt.generated_at },
  });

  console.log(`Safe: ${safeAddress}`);
  console.log(`Receipt: ${outPath}`);
  console.log("Runtime governance_admin updated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
