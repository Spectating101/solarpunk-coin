const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const { ethers } = hre;
const ROOT = path.join(__dirname, "..");

function explorerBase(networkName) {
  const map = {
    sepolia: "https://sepolia.etherscan.io",
    holesky: "https://holesky.etherscan.io",
    amoy: "https://amoy.polygonscan.com",
  };
  return map[networkName] || null;
}

function envAddress(name, fallback) {
  const value = process.env[name];
  if (!value) return fallback;
  if (!ethers.isAddress(value)) throw new Error(`${name} must be an address`);
  return ethers.getAddress(value);
}

function envBool(name, fallback = false) {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return ["1", "true", "yes"].includes(String(value).toLowerCase());
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
}

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf-8");
}

function link(base, kind, value) {
  return base ? `${base}/${kind}/${value}` : value;
}

function txLink(base, hash) {
  return base ? `[\`${hash}\`](${link(base, "tx", hash)})` : `\`${hash}\``;
}

function toMarkdown(receipt) {
  const base = explorerBase(receipt.network);
  const lines = [];
  lines.push("# SolarPunk Governed Pilot Stack Deployment");
  lines.push("");
  lines.push(`- generated_at: \`${receipt.generated_at}\``);
  lines.push(`- network: \`${receipt.network}\``);
  lines.push(`- chain_id: \`${receipt.chain_id}\``);
  lines.push(`- scope: \`${receipt.scope}\``);
  lines.push(`- deployer: \`${receipt.deployer}\``);
  lines.push(`- governance_admin: \`${receipt.governance_admin}\``);
  lines.push(`- strict_admin_handoff: \`${receipt.strict_admin_handoff}\``);
  lines.push("");
  lines.push("## Contracts");
  lines.push("");
  lines.push("| Contract | Address | Deploy tx |");
  lines.push("|---|---|---|");
  for (const [name, item] of Object.entries(receipt.contracts)) {
    lines.push(`| ${name} | \`${item.address}\` | ${txLink(base, item.tx)} |`);
  }
  lines.push("");
  lines.push("## Roles");
  lines.push("");
  lines.push("| Role | Address |");
  lines.push("|---|---|");
  for (const [name, value] of Object.entries(receipt.roles)) {
    lines.push(`| ${name} | \`${value}\` |`);
  }
  lines.push("");
  lines.push("## Initial Parameters");
  lines.push("");
  lines.push(`- reserve_seed_usdc: \`${receipt.initial_parameters.reserve_seed_usdc}\``);
  lines.push(`- energy_price_usd_per_kwh: \`${receipt.initial_parameters.energy_price_usd_per_kwh}\``);
  lines.push(`- oracle_price_usd: \`${receipt.initial_parameters.oracle_price_usd}\``);
  lines.push(`- spk_governance_delay_seconds: \`${receipt.initial_parameters.spk_governance_delay_seconds}\``);
  lines.push(`- treasury_governance_delay_seconds: \`${receipt.initial_parameters.treasury_governance_delay_seconds}\``);
  lines.push("");
  lines.push("## Setup Transactions");
  lines.push("");
  for (const [name, hash] of Object.entries(receipt.transactions)) {
    lines.push(`- ${name}: ${txLink(base, hash)}`);
  }
  lines.push("");
  lines.push("## Scope Boundary");
  lines.push("");
  for (const boundary of receipt.boundaries) {
    lines.push(`- ${boundary}`);
  }
  lines.push("");
  lines.push("## Next Commands");
  lines.push("");
  lines.push("```bash");
  if (receipt.network === "hardhat") {
    lines.push("# hardhat outputs prove the deploy script executes, but a separate hardhat run starts a fresh in-memory chain.");
    lines.push("# Use readback against Sepolia or a persistent localhost node after deploying there.");
    lines.push("PILOT_STACK_RECEIPT=state/deployments/sepolia_pilot_stack.json PILOT_NETWORK=sepolia npm run pilot-stack:readback");
  } else {
    lines.push(`PILOT_STACK_RECEIPT=${receipt.receipt_path} npx hardhat run scripts/read_pilot_stack.js --network ${receipt.network}`);
  }
  lines.push("npm run product:pilot-csv");
  lines.push("```");
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const networkName = hre.network.name;
  const governanceAdmin = envAddress("GOVERNANCE_ADMIN", deployer.address);
  const minter = envAddress("MINTER_ADDRESS", deployer.address);
  const oracle = envAddress("ORACLE_ADDRESS", deployer.address);
  const reserveManager = envAddress("RESERVE_MANAGER_ADDRESS", governanceAdmin);
  const stabilizer = envAddress("STABILIZER_ADDRESS", governanceAdmin);
  const currencyOperator = envAddress("CURRENCY_OPERATOR_ADDRESS", governanceAdmin);
  const strictAdminHandoff = envBool("STRICT_ADMIN_HANDOFF", governanceAdmin !== deployer.address);
  const reserveSeed = ethers.parseUnits(process.env.RESERVE_SEED_USDC || "100000", 6);
  const energyPrice = ethers.parseEther(process.env.ENERGY_PRICE_USD_PER_KWH || "0.05");
  const oraclePrice = ethers.parseEther(process.env.SPK_ORACLE_PRICE_USD || "1");
  const spkGovernanceDelay = Number(process.env.SPK_GOVERNANCE_DELAY_SECONDS || "0");
  const treasuryGovernanceDelay = Number(process.env.TREASURY_GOVERNANCE_DELAY_SECONDS || "0");
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

  const SolarPunkCurrencySystem = await ethers.getContractFactory("SolarPunkCurrencySystem");
  const currency = await SolarPunkCurrencySystem.deploy(await spk.getAddress(), deployer.address);
  await currency.waitForDeployment();
  transactions.deploy_currency_system = currency.deploymentTransaction().hash;

  const setTreasuryTx = await spk.setTreasury(await treasury.getAddress());
  await setTreasuryTx.wait();
  transactions.set_treasury = setTreasuryTx.hash;

  const minterRole = await spk.MINTER_ROLE();
  const oracleRole = await spk.ORACLE_ROLE();
  const reserveRole = await spk.RESERVE_MANAGER_ROLE();
  const pauserRole = await spk.PAUSER_ROLE();
  const stabilizerRole = await spk.STABILIZER_ROLE();
  for (const [role, account, label] of [
    [minterRole, minter, "grant_minter"],
    [oracleRole, oracle, "grant_oracle"],
    [reserveRole, reserveManager, "grant_reserve_manager"],
    [pauserRole, governanceAdmin, "grant_spk_pauser"],
    [stabilizerRole, stabilizer, "grant_stabilizer"],
  ]) {
    if (!(await spk.hasRole(role, account))) {
      const tx = await spk.grantRole(role, account);
      await tx.wait();
      transactions[label] = tx.hash;
    }
  }

  if (reserveSeed > 0n) {
    const mintUsdcTx = await usdc.mint(deployer.address, reserveSeed);
    await mintUsdcTx.wait();
    transactions.mint_mock_usdc = mintUsdcTx.hash;
    const approveTx = await usdc.approve(await spk.getAddress(), reserveSeed);
    await approveTx.wait();
    transactions.approve_reserve = approveTx.hash;
    const depositTx = await spk.depositReserve(reserveSeed);
    await depositTx.wait();
    transactions.deposit_reserve = depositTx.hash;
  }

  const energyTx = await spk.updateEnergyPrice(energyPrice);
  await energyTx.wait();
  transactions.update_energy_price = energyTx.hash;
  const oracleTx = await spk.updateOraclePriceAndAdjust(oraclePrice);
  await oracleTx.wait();
  transactions.update_oracle_price = oracleTx.hash;

  if (spkGovernanceDelay > 0) {
    const tx = await spk.setGovernanceDelay(spkGovernanceDelay);
    await tx.wait();
    transactions.set_spk_governance_delay = tx.hash;
  }
  if (treasuryGovernanceDelay > 0) {
    const tx = await treasury.setGovernanceDelay(treasuryGovernanceDelay);
    await tx.wait();
    transactions.set_treasury_governance_delay = tx.hash;
  }

  const currencyAdminRole = await currency.DEFAULT_ADMIN_ROLE();
  const currencyOperatorRole = await currency.OPERATOR_ROLE();
  const currencyPauserRole = await currency.PAUSER_ROLE();
  if (governanceAdmin !== deployer.address) {
    for (const [role, account, label] of [
      [currencyAdminRole, governanceAdmin, "grant_currency_admin"],
      [currencyOperatorRole, governanceAdmin, "grant_currency_operator_admin"],
      [currencyPauserRole, governanceAdmin, "grant_currency_pauser"],
    ]) {
      const tx = await currency.grantRole(role, account);
      await tx.wait();
      transactions[label] = tx.hash;
    }
  }
  if (currencyOperator !== deployer.address && currencyOperator !== governanceAdmin) {
    const tx = await currency.grantRole(currencyOperatorRole, currencyOperator);
    await tx.wait();
    transactions.grant_currency_operator = tx.hash;
  }

  if (governanceAdmin !== deployer.address) {
    const treasuryAdmin = await treasury.DEFAULT_ADMIN_ROLE();
    const budgetRole = await treasury.BUDGET_MANAGER_ROLE();
    const slasherRole = await treasury.SLASHER_ROLE();
    for (const [role, label] of [
      [treasuryAdmin, "grant_treasury_admin"],
      [budgetRole, "grant_budget_manager"],
      [slasherRole, "grant_slasher"],
    ]) {
      const tx = await treasury.grantRole(role, governanceAdmin);
      await tx.wait();
      transactions[label] = tx.hash;
    }

    const handoffTx = await spk.handoffAdmin(governanceAdmin);
    await handoffTx.wait();
    transactions.handoff_spk_admin = handoffTx.hash;

    if (strictAdminHandoff) {
      for (const [role, assignedAccount, label] of [
        [minterRole, minter, "renounce_spk_minter"],
        [oracleRole, oracle, "renounce_spk_oracle"],
        [reserveRole, reserveManager, "renounce_spk_reserve_manager"],
        [pauserRole, governanceAdmin, "renounce_spk_pauser"],
        [stabilizerRole, stabilizer, "renounce_spk_stabilizer"],
      ]) {
        if (assignedAccount.toLowerCase() !== deployer.address.toLowerCase() && (await spk.hasRole(role, deployer.address))) {
          const tx = await spk.renounceRole(role, deployer.address);
          await tx.wait();
          transactions[label] = tx.hash;
        }
      }

      for (const [target, role, assignedAccount, label] of [
        [treasury, treasuryAdmin, governanceAdmin, "renounce_treasury_admin"],
        [treasury, budgetRole, governanceAdmin, "renounce_budget_manager"],
        [treasury, slasherRole, governanceAdmin, "renounce_slasher"],
        [currency, currencyAdminRole, governanceAdmin, "renounce_currency_admin"],
        [currency, currencyOperatorRole, currencyOperator, "renounce_currency_operator"],
        [currency, currencyPauserRole, governanceAdmin, "renounce_currency_pauser"],
      ]) {
        if (assignedAccount.toLowerCase() !== deployer.address.toLowerCase() && (await target.hasRole(role, deployer.address))) {
          const tx = await target.renounceRole(role, deployer.address);
          await tx.wait();
          transactions[label] = tx.hash;
        }
      }
    }
  }

  const receipt = {
    generated_at: new Date().toISOString(),
    network: networkName,
    chain_id: Number(network.chainId),
    scope: "governed-pilot-testnet-stack",
    deployer: deployer.address,
    governance_admin: governanceAdmin,
    strict_admin_handoff: strictAdminHandoff,
    contracts: {
      MockUSDC: { address: await usdc.getAddress(), tx: transactions.deploy_mock_usdc },
      ProtocolTreasury: { address: await treasury.getAddress(), tx: transactions.deploy_treasury },
      SolarPunkCoin: { address: await spk.getAddress(), tx: transactions.deploy_spk },
      SolarPunkCurrencySystem: { address: await currency.getAddress(), tx: transactions.deploy_currency_system },
    },
    roles: {
      minter,
      oracle,
      reserve_manager: reserveManager,
      stabilizer,
      currency_operator: currencyOperator,
    },
    initial_parameters: {
      reserve_seed_usdc: ethers.formatUnits(reserveSeed, 6),
      energy_price_usd_per_kwh: ethers.formatEther(energyPrice),
      oracle_price_usd: ethers.formatEther(oraclePrice),
      spk_governance_delay_seconds: spkGovernanceDelay,
      treasury_governance_delay_seconds: treasuryGovernanceDelay,
    },
    transactions,
    boundaries: [
      "This is a governed public-testnet or local pilot stack output, not a mainnet deployment.",
      "Real-value use remains blocked until audit, legal/commercial scope, production oracle policy, and redemption terms exist.",
      "A pilot CSV proof can feed this stack only after a matching signed meter bundle is accepted.",
    ],
  };

  const receiptPath = path.join("state", "deployments", `${networkName}_pilot_stack.json`);
  const mdPath = path.join("docs", "project", "PILOT_STACK_DEPLOYMENT.md");
  receipt.receipt_path = receiptPath;
  writeJson(path.join(ROOT, receiptPath), receipt);
  writeText(path.join(ROOT, mdPath), toMarkdown(receipt));

  console.log(`SolarPunkCoin=${receipt.contracts.SolarPunkCoin.address}`);
  console.log(`SolarPunkCurrencySystem=${receipt.contracts.SolarPunkCurrencySystem.address}`);
  console.log(`wrote: ${receiptPath}`);
  console.log(`wrote: ${mdPath}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  toMarkdown,
};
