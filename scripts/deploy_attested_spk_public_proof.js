const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const { ethers } = hre;

function explorerBase(networkName) {
  const map = {
    sepolia: "https://sepolia.etherscan.io",
    holesky: "https://holesky.etherscan.io",
    amoy: "https://amoy.polygonscan.com",
  };
  return map[networkName] || null;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
}

function writeMarkdown(filePath, payload) {
  const base = explorerBase(payload.network);
  const lines = [];
  lines.push("# Attested SPK Public Proof Deployment");
  lines.push("");
  lines.push(`- generated_at: \`${payload.generated_at}\``);
  lines.push(`- network: \`${payload.network}\``);
  lines.push(`- chain_id: \`${payload.chain_id}\``);
  lines.push(`- deployer: \`${payload.deployer}\``);
  lines.push(`- scope: \`${payload.scope}\``);
  lines.push("");
  lines.push("## Contracts");
  lines.push("");
  for (const [name, info] of Object.entries(payload.contracts)) {
    const link = base ? `${base}/address/${info.address}` : info.address;
    lines.push(`- ${name}: \`${info.address}\` (${link})`);
  }
  lines.push("");
  lines.push("## Setup Transactions");
  lines.push("");
  for (const [name, hash] of Object.entries(payload.transactions)) {
    const link = base ? `${base}/tx/${hash}` : hash;
    lines.push(`- ${name}: \`${hash}\` (${link})`);
  }
  lines.push("");
  lines.push("## Initial Parameters");
  lines.push("");
  lines.push(`- reserve_seed_usdc: \`${payload.initial_parameters.reserve_seed_usdc}\``);
  lines.push(`- energy_price_usd_per_kwh: \`${payload.initial_parameters.energy_price_usd_per_kwh}\``);
  lines.push(`- oracle_price_usd: \`${payload.initial_parameters.oracle_price_usd}\``);
  lines.push(`- minter: \`${payload.roles.minter}\``);
  lines.push(`- oracle: \`${payload.roles.oracle}\``);
  lines.push("");
  lines.push("## Scope Note");
  lines.push("");
  lines.push("- This is a public proof deployment for the attested SPK mint path.");
  lines.push("- It is not the production/governance deployment and does not replace the older Safe-admin Sepolia stack.");
  lines.push("- Run the public proof with `SPK_ADDRESS=<SolarPunkCoin> npx hardhat run scripts/mint_spk_from_meter_bundle.js --network sepolia`.");
  lines.push("");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
}

async function main() {
  const networkName = hre.network.name;
  if (networkName === "hardhat") {
    throw new Error("Use a public or persistent network, not ephemeral hardhat.");
  }

  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const transactions = {};

  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  transactions.deploy_mock_usdc = usdc.deploymentTransaction().hash;

  const ProtocolTreasury = await ethers.getContractFactory("ProtocolTreasury");
  const treasury = await ProtocolTreasury.deploy(await usdc.getAddress());
  await treasury.waitForDeployment();
  transactions.deploy_treasury = treasury.deploymentTransaction().hash;

  const SolarPunkCoin = await ethers.getContractFactory("SolarPunkCoin");
  const spk = await SolarPunkCoin.deploy(await usdc.getAddress());
  await spk.waitForDeployment();
  transactions.deploy_spk = spk.deploymentTransaction().hash;

  const setTreasuryTx = await spk.setTreasury(await treasury.getAddress());
  await setTreasuryTx.wait();
  transactions.set_treasury = setTreasuryTx.hash;

  const reserveSeed = ethers.parseUnits("100000", 6);
  const mintUsdcTx = await usdc.mint(deployer.address, reserveSeed);
  await mintUsdcTx.wait();
  transactions.mint_mock_usdc = mintUsdcTx.hash;

  const approveReserveTx = await usdc.approve(await spk.getAddress(), reserveSeed);
  await approveReserveTx.wait();
  transactions.approve_reserve = approveReserveTx.hash;

  const depositReserveTx = await spk.depositReserve(reserveSeed);
  await depositReserveTx.wait();
  transactions.deposit_reserve = depositReserveTx.hash;

  const updateEnergyPriceTx = await spk.updateEnergyPrice(ethers.parseEther("0.05"));
  await updateEnergyPriceTx.wait();
  transactions.update_energy_price = updateEnergyPriceTx.hash;

  const updateOracleTx = await spk.updateOraclePriceAndAdjust(ethers.parseEther("1"));
  await updateOracleTx.wait();
  transactions.update_oracle_price = updateOracleTx.hash;

  const spkAddress = await spk.getAddress();
  const usdcAddress = await usdc.getAddress();
  const treasuryAddress = await treasury.getAddress();
  const receipt = {
    generated_at: new Date().toISOString(),
    network: networkName,
    chain_id: Number(network.chainId),
    scope: "public-attested-spk-proof",
    deployer: deployer.address,
    contracts: {
      MockUSDC: { address: usdcAddress },
      ProtocolTreasury: { address: treasuryAddress },
      SolarPunkCoin: { address: spkAddress },
    },
    roles: {
      owner: deployer.address,
      minter: deployer.address,
      oracle: deployer.address,
      reserve_manager: deployer.address,
    },
    initial_parameters: {
      reserve_seed_usdc: ethers.formatUnits(reserveSeed, 6),
      energy_price_usd_per_kwh: "0.05",
      oracle_price_usd: "1",
    },
    transactions,
  };

  const root = path.join(__dirname, "..");
  const outJson = path.join(root, "state", "deployments", `${networkName}_attested_spk_deploy.json`);
  const outMd = path.join(root, "docs", "project", "ATTESTED_SPK_DEPLOYMENT.md");
  writeJson(outJson, receipt);
  writeMarkdown(outMd, receipt);

  console.log(`SolarPunkCoin=${spkAddress}`);
  console.log(`MockUSDC=${usdcAddress}`);
  console.log(`ProtocolTreasury=${treasuryAddress}`);
  console.log(`wrote: ${outJson}`);
  console.log(`wrote: ${outMd}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
