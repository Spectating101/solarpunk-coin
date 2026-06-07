const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const { ethers } = hre;
const { ROOT, readRuntime, mergeRuntime, getSignerFor } = require("./lib/spk_v1_runtime");

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
}

function fmt(value, digits = 4) {
  return Number(Number(ethers.formatEther(value)).toFixed(digits));
}

async function main() {
  const runtime = readRuntime();
  if (!runtime?.contracts?.solar_punk_coin) {
    throw new Error("Missing state/runtime/spk_v1.json — run npm run spk:v1:deploy first");
  }

  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const producer = signers[1] || deployer;
  const gateway = { address: signers[2]?.address || "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" };
  const maintenance = { address: signers[3]?.address || "0x90F79bf6EB2c4f870365E785982E1f101E93b906" };
  const buyer = signers[4] || deployer;
  const merchant = { address: signers[5]?.address || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" };
  const spkAddress = runtime.contracts.solar_punk_coin;
  const currencyAddress = runtime.contracts.currency_system;

  const spk = await ethers.getContractAt("SolarPunkCoin", spkAddress);
  const currency = await ethers.getContractAt("SolarPunkCurrencySystem", currencyAddress);

  const bundlePath = process.env.METER_BUNDLE_PATH || "state/attestations/latest_attestation_bundle.json";
  const bundle = readJson(bundlePath);
  const surplusKwh = BigInt(Math.floor(Number(bundle.summary?.total_surplus_kwh || 2606)));

  const minter = runtime.roles?.minter || deployer.address;
  const oracle = runtime.roles?.oracle || deployer.address;
  const operator = runtime.roles?.currency_operator || deployer.address;

  const mintTx = await spk.connect(await getSignerFor(ethers, minter)).mintFromSurplus(surplusKwh, producer.address);
  const mintReceipt = await mintTx.wait();
  const mintedBalance = await spk.balanceOf(producer.address);

  const KIND_SERVICE = ethers.id("SERVICE");
  const KIND_LABOR = ethers.id("LABOR");
  const KIND_GOODS = ethers.id("GOODS");
  const KIND_NETWORK = ethers.id("NETWORK");

  const steps = [];
  const pay = async (payer, payee, amountEther, invoiceId, kind, label) => {
    const amount = ethers.parseEther(String(amountEther));
    const payeeAddress = payee.address || payee;
    await (await spk.connect(payer).approve(currencyAddress, amount)).wait();
    const tx = await currency.connect(payer).settleNetworkPayment(payeeAddress, amount, ethers.id(invoiceId), kind);
    const receipt = await tx.wait();
    steps.push({
      action: "network_payment",
      label,
      spk: amountEther,
      tx_hash: receipt.hash,
      payment_kind: label,
    });
    return receipt;
  };

  const payer = signers.length === 1 ? deployer : null;
  if (payer) {
    await pay(payer, gateway, 12, "spk-v1:genesis:gateway", KIND_SERVICE, "SERVICE");
    await pay(payer, maintenance, 40, "spk-v1:genesis:maintenance", KIND_LABOR, "LABOR");
    await pay(payer, buyer.address || buyer, 180, "spk-v1:genesis:network-seed", KIND_NETWORK, "NETWORK");
    await pay(payer, merchant, 55, "spk-v1:genesis:goods", KIND_GOODS, "GOODS");
    await pay(payer, producer.address || producer, 20, "spk-v1:genesis:supply", KIND_GOODS, "GOODS");
  } else {
    await pay(producer, gateway, 12, "spk-v1:genesis:gateway", KIND_SERVICE, "SERVICE");
    await pay(producer, maintenance, 40, "spk-v1:genesis:maintenance", KIND_LABOR, "LABOR");
    await pay(producer, buyer, 180, "spk-v1:genesis:network-seed", KIND_NETWORK, "NETWORK");
    await pay(buyer, merchant, 55, "spk-v1:genesis:goods", KIND_GOODS, "GOODS");
    await pay(deployer, producer, 20, "spk-v1:genesis:supply", KIND_GOODS, "GOODS");
  }

  const redeemer = signers.length === 1 ? deployer : buyer;
  const redeemAmount = ethers.parseEther("15");
  const owedKwh = await spk.quoteRedemptionKwh(redeemAmount);
  await (await spk.connect(redeemer).approve(currencyAddress, redeemAmount)).wait();
  const redeemTx = await currency.connect(redeemer).openRedemption(
    redeemer.address,
    redeemAmount,
    owedKwh,
    ethers.id(`spk-v1:genesis:redemption:${stableStringify({ network: runtime.network })}`)
  );
  const redeemReceipt = await redeemTx.wait();
  const resolveTx = await currency.connect(await getSignerFor(ethers, operator)).resolveRedemption(
    1,
    owedKwh,
    ethers.id("spk-v1:genesis:delivery")
  );
  const resolveReceipt = await resolveTx.wait();

  steps.push({
    action: "optional_redemption",
    label: "ENERGY_EXIT",
    spk: 15,
    tx_hash: redeemReceipt.hash,
    resolve_tx_hash: resolveReceipt.hash,
  });

  const metrics = await currency.networkMetrics();
  const genesis = {
    completed_at: new Date().toISOString(),
    meter_bundle: bundlePath,
    surplus_kwh: Number(surplusKwh),
    mint_tx_hash: mintReceipt.hash,
    minted_spk: fmt(mintedBalance),
    steps,
    metrics: {
      total_settled_spk: fmt(metrics.settledSpk),
      total_redeemed_spk: fmt(metrics.redeemedSpk),
      circulation_share_percent: Number(metrics.circulationShareBps) / 100,
      redemption_share_percent: Number(metrics.redemptionShareBps) / 100,
      network_payment_count: Number(metrics.networkPaymentCount),
    },
    actors: {
      producer: producer.address,
      gateway: gateway.address,
      maintenance: maintenance.address,
      buyer: buyer.address,
      merchant: merchant.address,
    },
  };

  mergeRuntime({ genesis, status: "genesis_complete" }, ROOT);
  console.log(JSON.stringify({ genesis }, null, 2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { main };
