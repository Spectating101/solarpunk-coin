const hre = require("hardhat");
const { ethers } = hre;
const { ROOT, writeRuntime } = require("./lib/spk_v1_runtime");

const ATTESTED_SPK = "0x8ceDa149EDE44078bf151b3334513916a84df820";

// Counterparties only need to hold SPK — no Sepolia ETH required.
const GATEWAY = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
const MERCHANT = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const spk = await ethers.getContractAt("SolarPunkCoin", ATTESTED_SPK);

  const balanceBefore = await ethers.provider.getBalance(deployer.address);

  const oracleTx = await spk.updateOraclePriceAndAdjust(ethers.parseEther("1"));
  await oracleTx.wait();

  const SolarPunkCurrencySystem = await ethers.getContractFactory("SolarPunkCurrencySystem");
  const currency = await SolarPunkCurrencySystem.deploy(ATTESTED_SPK, deployer.address);
  await currency.waitForDeployment();
  const currencyAddress = await currency.getAddress();

  let mintReceipt = null;
  let surplusKwh = 0;
  const balanceSpk = await spk.balanceOf(deployer.address);
  if (balanceSpk < ethers.parseEther("20")) {
    surplusKwh = 500;
    const mintTx = await spk.mintFromSurplus(surplusKwh, deployer.address);
    mintReceipt = await mintTx.wait();
  }

  const KIND_SERVICE = ethers.id("SERVICE");
  const KIND_GOODS = ethers.id("GOODS");
  const steps = [];

  const pay = async (amountEther, payee, invoiceId, kind, label) => {
    const amount = ethers.parseEther(String(amountEther));
    await (await spk.approve(currencyAddress, amount)).wait();
    const tx = await currency.settleNetworkPayment(payee, amount, ethers.id(invoiceId), kind);
    const receipt = await tx.wait();
    steps.push({ action: "network_payment", label, spk: amountEther, payee, tx_hash: receipt.hash });
  };

  await pay(5, GATEWAY, "spk-v1:sepolia:gateway", KIND_SERVICE, "SERVICE");
  await pay(10, MERCHANT, "spk-v1:sepolia:merchant", KIND_GOODS, "GOODS");

  const metrics = await currency.networkMetrics();
  const balanceAfter = await ethers.provider.getBalance(deployer.address);

  const runtime = {
    schema: "SPK_V1_RUNTIME",
    version: "1.0.0",
    product: "SPK Network Money",
    launch_mode: "attached_existing_sepolia_spk",
    launched_at: new Date().toISOString(),
    network: hre.network.name,
    chain_id: Number(network.chainId),
    deployer: deployer.address,
    governance_admin: deployer.address,
    monetary_policy: {
      issuance_mode: "legacy_dollar_translated_on_chain",
      note: "Attached to May 2026 attested SPK bytecode. Circulation layer is v1. Energy-native SPK redeploy when budget allows.",
      peg_enabled: "unknown_legacy_bytecode",
      primary_use: "network_circulation",
      secondary_sink: "redemption_requires_spk_redeploy",
    },
    contracts: {
      solar_punk_coin: ATTESTED_SPK,
      currency_system: currencyAddress,
      attested_mint_tx: "0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d",
    },
    genesis: {
      completed_at: new Date().toISOString(),
      surplus_kwh: surplusKwh,
      mint_tx_hash: mintReceipt?.hash || null,
      minted_spk: Number(ethers.formatEther(await spk.balanceOf(deployer.address))),
      used_existing_spk_balance: !mintReceipt,
      steps,
      metrics: {
        total_settled_spk: Number(ethers.formatEther(metrics.settledSpk)),
        total_redeemed_spk: Number(ethers.formatEther(metrics.redeemedSpk)),
        circulation_share_percent: Number(metrics.circulationShareBps) / 100,
        network_payment_count: Number(metrics.networkPaymentCount),
      },
      gas_spent_eth: Number(ethers.formatEther(balanceBefore - balanceAfter)),
    },
    status: "genesis_complete",
    explorer_base: "https://sepolia.etherscan.io",
  };

  writeRuntime(runtime, ROOT);
  console.log(JSON.stringify(runtime, null, 2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { main };
