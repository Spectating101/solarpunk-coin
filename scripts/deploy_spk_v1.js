const hre = require("hardhat");
const path = require("path");

const { ethers } = hre;
const { ROOT, writeRuntime, getSignerFor } = require("./lib/spk_v1_runtime");

function envAddress(name, fallback) {
  const value = process.env[name];
  if (!value) return fallback;
  if (!ethers.isAddress(value)) throw new Error(`${name} must be an address`);
  return ethers.getAddress(value);
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const networkName = hre.network.name;
  const governanceAdmin = envAddress("GOVERNANCE_ADMIN", deployer.address);
  const minter = envAddress("MINTER_ADDRESS", deployer.address);
  const oracle = envAddress("ORACLE_ADDRESS", deployer.address);
  const currencyOperator = envAddress("CURRENCY_OPERATOR_ADDRESS", governanceAdmin);
  const reserveSeed = ethers.parseUnits(process.env.RESERVE_SEED_USDC || "1000000", 6);
  const referenceUsdPerKwh = ethers.parseEther(process.env.REFERENCE_USD_PER_KWH || "0.05");
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
  const currency = await SolarPunkCurrencySystem.deploy(await spk.getAddress(), governanceAdmin);
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
    [reserveRole, governanceAdmin, "grant_reserve_manager"],
    [pauserRole, governanceAdmin, "grant_spk_pauser"],
    [stabilizerRole, governanceAdmin, "grant_stabilizer"],
  ]) {
    if (!(await spk.hasRole(role, account))) {
      const tx = await spk.grantRole(role, account);
      await tx.wait();
      transactions[label] = tx.hash;
    }
  }

  const currencyOperatorRole = await currency.OPERATOR_ROLE();
  if (currencyOperator !== governanceAdmin && !(await currency.hasRole(currencyOperatorRole, currencyOperator))) {
    const tx = await currency.grantRole(currencyOperatorRole, currencyOperator);
    await tx.wait();
    transactions.grant_currency_operator = tx.hash;
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

  const oracleSigner = await getSignerFor(ethers, oracle);
  const oracleTx = await spk.connect(oracleSigner).updateOraclePriceAndAdjust(ethers.parseEther("1"));
  await oracleTx.wait();
  transactions.update_oracle_price = oracleTx.hash;

  const referenceTx = await spk.connect(oracleSigner).setReferenceUsdPerKwh(referenceUsdPerKwh);
  await referenceTx.wait();
  transactions.set_reference_usd_per_kwh = referenceTx.hash;

  if (await spk.pegEnabled()) {
    const pegTx = await spk.setPegEnabled(false);
    await pegTx.wait();
    transactions.disable_peg = pegTx.hash;
  }

  const runtime = {
    schema: "SPK_V1_RUNTIME",
    version: "1.0.0",
    product: "SPK Network Money",
    launched_at: new Date().toISOString(),
    network: networkName,
    chain_id: Number(network.chainId),
    deployer: deployer.address,
    governance_admin: governanceAdmin,
    monetary_policy: {
      issuance_mode: "energy_native",
      kwh_per_spk: "1",
      peg_enabled: false,
      reference_usd_per_kwh: ethers.formatEther(referenceUsdPerKwh),
      primary_use: "network_circulation",
      secondary_sink: "optional_energy_redemption",
    },
    contracts: {
      mock_usdc: await usdc.getAddress(),
      protocol_treasury: await treasury.getAddress(),
      solar_punk_coin: await spk.getAddress(),
      currency_system: await currency.getAddress(),
    },
    roles: {
      minter,
      oracle,
      currency_operator: currencyOperator,
    },
    deploy_transactions: transactions,
    genesis: null,
    explorer_base: networkName === "sepolia" ? "https://sepolia.etherscan.io" : null,
  };

  const runtimePath = writeRuntime(runtime, ROOT);
  console.log(`SPK_V1=${runtime.contracts.solar_punk_coin}`);
  console.log(`CURRENCY_SYSTEM=${runtime.contracts.currency_system}`);
  console.log(`runtime=${runtimePath}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { main };
