const hre = require("hardhat");
const { ethers } = hre;
const { ROOT, writeRuntime, getSignerFor } = require("./lib/spk_v1_runtime");

/**
 * Lean Sepolia weld: MockUSDC + energy-native SPK + CurrencySystem only.
 * Skips ProtocolTreasury deploy to minimize gas.
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const balanceBefore = await ethers.provider.getBalance(deployer.address);
  const transactions = {};

  const reserveSeed = ethers.parseUnits(process.env.RESERVE_SEED_USDC || "50000", 6);
  const referenceUsdPerKwh = ethers.parseEther(process.env.REFERENCE_USD_PER_KWH || "0.05");

  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  transactions.deploy_mock_usdc = usdc.deploymentTransaction().hash;
  const usdcAddress = await usdc.getAddress();

  const SolarPunkCoin = await ethers.getContractFactory("SolarPunkCoin");
  const spk = await SolarPunkCoin.deploy(usdcAddress);
  await spk.waitForDeployment();
  transactions.deploy_spk = spk.deploymentTransaction().hash;
  const spkAddress = await spk.getAddress();

  const SolarPunkCurrencySystem = await ethers.getContractFactory("SolarPunkCurrencySystem");
  const currency = await SolarPunkCurrencySystem.deploy(spkAddress, deployer.address);
  await currency.waitForDeployment();
  transactions.deploy_currency_system = currency.deploymentTransaction().hash;
  const currencyAddress = await currency.getAddress();

  if (reserveSeed > 0n) {
    const mintUsdcTx = await usdc.mint(deployer.address, reserveSeed);
    await mintUsdcTx.wait();
    transactions.mint_mock_usdc = mintUsdcTx.hash;
    const approveTx = await usdc.approve(spkAddress, reserveSeed);
    await approveTx.wait();
    transactions.approve_reserve = approveTx.hash;
    const depositTx = await spk.depositReserve(reserveSeed);
    await depositTx.wait();
    transactions.deposit_reserve = depositTx.hash;
  }

  const oracleSigner = await getSignerFor(ethers, deployer.address);
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

  const balanceAfter = await ethers.provider.getBalance(deployer.address);
  const runtime = {
    schema: "SPK_V1_RUNTIME",
    version: "1.0.0",
    product: "SPK Network Money",
    launch_mode: "unified_sepolia_lean",
    launched_at: new Date().toISOString(),
    network: hre.network.name,
    chain_id: Number(network.chainId),
    deployer: deployer.address,
    governance_admin: deployer.address,
    monetary_policy: {
      issuance_mode: "energy_native",
      kwh_per_spk: "1",
      peg_enabled: false,
      reference_usd_per_kwh: ethers.formatEther(referenceUsdPerKwh),
      primary_use: "network_circulation",
      secondary_sink: "optional_energy_redemption",
    },
    contracts: {
      mock_usdc: usdcAddress,
      solar_punk_coin: spkAddress,
      currency_system: currencyAddress,
    },
    roles: {
      minter: deployer.address,
      oracle: deployer.address,
      currency_operator: deployer.address,
    },
    deploy_transactions: transactions,
    deploy_gas_spent_eth: Number(ethers.formatEther(balanceBefore - balanceAfter)),
    genesis: null,
    status: "deployed",
    explorer_base: "https://sepolia.etherscan.io",
    superseded: {
      attested_spk: "0x8ceDa149EDE44078bf151b3334513916a84df820",
      attached_currency_system: "0x3Fa51B6631282e7a9f4CBFB7D764748831D9Ca47",
      note: "Previous attach stack kept for history; v1 lean stack is canonical after this deploy.",
    },
  };

  writeRuntime(runtime, ROOT);
  console.log(`SPK_V1=${spkAddress}`);
  console.log(`CURRENCY_SYSTEM=${currencyAddress}`);
  console.log(`gas_spent_eth=${runtime.deploy_gas_spent_eth}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { main };
