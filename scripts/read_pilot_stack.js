const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const { ethers } = hre;
const ROOT = path.join(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
}

function writeJson(relativePath, payload) {
  const target = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(payload, null, 2) + "\n", "utf-8");
}

function writeText(relativePath, value) {
  const target = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, value, "utf-8");
}

function check(name, pass, detail) {
  return {
    name,
    pass: Boolean(pass),
    detail,
  };
}

function allPassed(checks) {
  return checks.every((item) => item.pass);
}

function toMarkdown(readback) {
  const lines = [];
  lines.push("# SolarPunk Pilot Stack Readback");
  lines.push("");
  lines.push(`- generated_at: \`${readback.generated_at}\``);
  lines.push(`- network: \`${readback.network}\``);
  lines.push(`- chain_id: \`${readback.chain_id}\``);
  lines.push(`- receipt_path: \`${readback.receipt_path}\``);
  lines.push(`- all_checks_passed: \`${readback.all_checks_passed}\``);
  lines.push("");
  lines.push("## Contracts");
  lines.push("");
  lines.push("| Contract | Address | Code present |");
  lines.push("|---|---|---:|");
  for (const [name, item] of Object.entries(readback.contracts)) {
    lines.push(`| ${name} | \`${item.address}\` | \`${item.code_present}\` |`);
  }
  lines.push("");
  lines.push("## State");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  for (const [name, value] of Object.entries(readback.state)) {
    lines.push(`| ${name} | \`${value}\` |`);
  }
  lines.push("");
  lines.push("## Checks");
  lines.push("");
  lines.push("| Check | Pass | Detail |");
  lines.push("|---|---:|---|");
  for (const item of readback.checks) {
    lines.push(`| ${item.name} | \`${item.pass}\` | ${item.detail} |`);
  }
  lines.push("");
  lines.push("## Boundary");
  lines.push("");
  lines.push("This verifies a pilot-stack deployment receipt against the connected network. It does not imply audit completion, mainnet readiness, or legal redemption finality.");
  lines.push("");
  return lines.join("\n");
}

async function codePresent(address) {
  return (await ethers.provider.getCode(address)) !== "0x";
}

async function buildPilotStackReadback(options = {}) {
  const networkName = hre.network.name;
  const network = await ethers.provider.getNetwork();
  const receiptPath = options.receiptPath || process.env.PILOT_STACK_RECEIPT || `state/deployments/${networkName}_pilot_stack.json`;
  const receipt = readJson(receiptPath);

  if (Number(receipt.chain_id) !== Number(network.chainId)) {
    throw new Error(`Receipt chain ${receipt.chain_id} does not match connected chain ${network.chainId}`);
  }

  const spk = await ethers.getContractAt("SolarPunkCoin", receipt.contracts.SolarPunkCoin.address);
  const treasury = await ethers.getContractAt("ProtocolTreasury", receipt.contracts.ProtocolTreasury.address);
  const currency = await ethers.getContractAt("SolarPunkCurrencySystem", receipt.contracts.SolarPunkCurrencySystem.address);
  const usdc = await ethers.getContractAt("MockUSDC", receipt.contracts.MockUSDC.address);
  const minterRole = await spk.MINTER_ROLE();
  const oracleRole = await spk.ORACLE_ROLE();
  const reserveRole = await spk.RESERVE_MANAGER_ROLE();
  const stabilizerRole = await spk.STABILIZER_ROLE();
  const spkAdminRole = await spk.DEFAULT_ADMIN_ROLE();
  const treasuryAdminRole = await treasury.DEFAULT_ADMIN_ROLE();
  const currencyAdminRole = await currency.DEFAULT_ADMIN_ROLE();
  const currencyOperatorRole = await currency.OPERATOR_ROLE();

  const [
    spkOwner,
    spkTreasury,
    energyPrice,
    reserve,
    lastOraclePrice,
    currencySpk,
    currencyNextPayment,
    currencyNextRedemption,
    minterOk,
    oracleOk,
    reserveManagerOk,
    stabilizerOk,
    spkAdminOk,
    treasuryAdminOk,
    currencyAdminOk,
    currencyOperatorOk,
  ] = await Promise.all([
    spk.owner(),
    spk.treasury(),
    spk.energyPricePerKwh(),
    spk.usdcReserve(),
    spk.lastOraclePrice(),
    currency.spk(),
    currency.nextPaymentId(),
    currency.nextRedemptionId(),
    spk.hasRole(minterRole, receipt.roles.minter),
    spk.hasRole(oracleRole, receipt.roles.oracle),
    spk.hasRole(reserveRole, receipt.roles.reserve_manager),
    spk.hasRole(stabilizerRole, receipt.roles.stabilizer),
    spk.hasRole(spkAdminRole, receipt.governance_admin),
    treasury.hasRole(treasuryAdminRole, receipt.governance_admin),
    currency.hasRole(currencyAdminRole, receipt.governance_admin),
    currency.hasRole(currencyOperatorRole, receipt.roles.currency_operator),
  ]);

  const contracts = {};
  for (const [name, item] of Object.entries(receipt.contracts)) {
    contracts[name] = {
      address: item.address,
      code_present: await codePresent(item.address),
    };
  }

  const state = {
    spk_owner: spkOwner,
    spk_treasury: spkTreasury,
    currency_spk: currencySpk,
    energy_price_usd_per_kwh: ethers.formatEther(energyPrice),
    reserve_seed_usdc: ethers.formatUnits(reserve, 6),
    last_oracle_price_usd: ethers.formatEther(lastOraclePrice),
    currency_next_payment_id: currencyNextPayment.toString(),
    currency_next_redemption_id: currencyNextRedemption.toString(),
    mock_usdc_symbol: await usdc.symbol(),
  };

  const checks = [
    ...Object.entries(contracts).map(([name, item]) => check(`${name} code present`, item.code_present, item.address)),
    check("SPK owner is governance admin", spkOwner.toLowerCase() === receipt.governance_admin.toLowerCase(), spkOwner),
    check("SPK treasury bound", spkTreasury.toLowerCase() === receipt.contracts.ProtocolTreasury.address.toLowerCase(), spkTreasury),
    check("Currency system bound to SPK", currencySpk.toLowerCase() === receipt.contracts.SolarPunkCoin.address.toLowerCase(), currencySpk),
    check("Minter role assigned", minterOk, receipt.roles.minter),
    check("Oracle role assigned", oracleOk, receipt.roles.oracle),
    check("Reserve manager role assigned", reserveManagerOk, receipt.roles.reserve_manager),
    check("Stabilizer role assigned", stabilizerOk, receipt.roles.stabilizer),
    check("SPK admin assigned", spkAdminOk, receipt.governance_admin),
    check("Treasury admin assigned", treasuryAdminOk, receipt.governance_admin),
    check("Currency admin assigned", currencyAdminOk, receipt.governance_admin),
    check("Currency operator assigned", currencyOperatorOk, receipt.roles.currency_operator),
    check("Energy price set", ethers.formatEther(energyPrice) === receipt.initial_parameters.energy_price_usd_per_kwh, ethers.formatEther(energyPrice)),
    check("Reserve seeded", ethers.formatUnits(reserve, 6) === receipt.initial_parameters.reserve_seed_usdc, ethers.formatUnits(reserve, 6)),
  ];

  return {
    generated_at: (options.now || new Date()).toISOString(),
    network: networkName,
    chain_id: Number(network.chainId),
    receipt_path: receiptPath,
    contracts,
    state,
    checks,
    all_checks_passed: allPassed(checks),
    boundary: "Pilot stack readback verifies deployed testnet state only; it does not assert audit, mainnet, legal, or commercial readiness.",
  };
}

async function main() {
  const readback = await buildPilotStackReadback();
  const networkName = hre.network.name;
  const outJson = `state/deployments/${networkName}_pilot_stack_readback.json`;
  const outMd = "docs/project/PILOT_STACK_READBACK.md";
  writeJson(outJson, readback);
  writeText(outMd, toMarkdown(readback));
  console.log(`all_checks_passed=${readback.all_checks_passed}`);
  console.log(`wrote: ${outJson}`);
  console.log(`wrote: ${outMd}`);
  if (!readback.all_checks_passed) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  allPassed,
  buildPilotStackReadback,
  check,
  toMarkdown,
};
