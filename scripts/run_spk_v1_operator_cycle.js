const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const { ethers } = hre;
const { ROOT, readRuntime, mergeRuntime, getSignerFor } = require("./lib/spk_v1_runtime");
const { buildCycleBundle, mintAttestedOnSpk } = require("./lib/spk_v1_attested_mint");
const { loadMeterBundleForCycle } = require("./lib/spk_v1_meter_bundle");

const COUNTERPARTIES = {
  gateway: { address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", role: "SERVICE" },
  maintenance: { address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", role: "LABOR" },
  merchant: { address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", role: "GOODS" },
  network_peer: { address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", role: "NETWORK" },
};

function cycleId() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function ensureOracleFresh(spk, oracleAddress) {
  const oracle = await getSignerFor(ethers, oracleAddress);
  const lastUpdate = await spk.lastOracleUpdate();
  const threshold = await spk.oracleStalenessThreshold();
  const now = BigInt(Math.floor(Date.now() / 1000));
  if (now - lastUpdate >= threshold) {
    const tx = await spk.connect(oracle).updateOraclePriceAndAdjust(ethers.parseEther("1"));
    const receipt = await tx.wait();
    return { refreshed: true, tx_hash: receipt.hash };
  }
  return { refreshed: false };
}

async function readCounterpartyBalances(spk, counterparties) {
  const balances = {};
  for (const [name, info] of Object.entries(counterparties)) {
    balances[name] = Number(ethers.formatEther(await spk.balanceOf(info.address)));
  }
  return balances;
}

async function main() {
  const runtime = readRuntime();
  if (!runtime?.contracts?.solar_punk_coin) {
    throw new Error("Missing state/runtime/spk_v1.json — deploy SPK v1 first");
  }

  const [deployer] = await ethers.getSigners();
  const spk = await ethers.getContractAt("SolarPunkCoin", runtime.contracts.solar_punk_coin);
  const currency = await ethers.getContractAt("SolarPunkCurrencySystem", runtime.contracts.currency_system);
  const operator = runtime.roles?.currency_operator || deployer.address;
  const minter = runtime.roles?.minter || deployer.address;
  const oracle = runtime.roles?.oracle || deployer.address;
  const mintMode = process.env.CYCLE_MINT_MODE || "attested";

  const id = cycleId();
  const steps = [];

  const oracleStep = await ensureOracleFresh(spk, oracle);
  steps.push({ action: "oracle_refresh", ...oracleStep });

  const mintKwh = Number(process.env.CYCLE_MINT_KWH || "50");
  if (mintKwh > 0) {
    if (mintMode === "surplus") {
      const mintedEstimate = await spk.estimateMintAmount(mintKwh);
      const mintTx = await spk.connect(await getSignerFor(ethers, minter)).mintFromSurplus(BigInt(mintKwh), deployer.address);
      const mintReceipt = await mintTx.wait();
      steps.push({
        action: "mint_from_surplus",
        surplus_kwh: mintKwh,
        tx_hash: mintReceipt.hash,
        minted_estimate: Number(ethers.formatEther(mintedEstimate)),
      });
    } else if (mintMode === "meter") {
      const meter = loadMeterBundleForCycle(id, ROOT);
      if (!meter) {
        throw new Error("CYCLE_MINT_MODE=meter requires state/attestations/latest_attestation_bundle.json");
      }
      const mintStep = await mintAttestedOnSpk(spk, meter.bundle, {
        minter: await getSignerFor(ethers, minter),
        oracle: await getSignerFor(ethers, oracle),
        recipient: deployer.address,
      });
      steps.push({ ...mintStep, meter_source: meter.source_path, meter_scale: meter.scale });
    } else {
      const latestBlock = await ethers.provider.getBlock("latest");
      const bundle = buildCycleBundle(id, mintKwh, Number(latestBlock.timestamp));
      const mintStep = await mintAttestedOnSpk(spk, bundle, {
        minter: await getSignerFor(ethers, minter),
        oracle: await getSignerFor(ethers, oracle),
        recipient: deployer.address,
      });
      steps.push(mintStep);
    }
  }

  const pay = async (amountEther, payee, label, kindName) => {
    const kind = ethers.id(kindName);
    const amount = ethers.parseEther(String(amountEther));
    const invoiceHash = ethers.id(`spk-v1:cycle:${id}:${label}`);
    await (await spk.connect(deployer).approve(runtime.contracts.currency_system, amount)).wait();
    const tx = await currency.connect(deployer).settleNetworkPayment(payee, amount, invoiceHash, kind);
    const receipt = await tx.wait();
    steps.push({
      action: "network_payment",
      label,
      payment_kind: kindName,
      spk: amountEther,
      payee,
      tx_hash: receipt.hash,
    });
  };

  await pay(6, COUNTERPARTIES.gateway.address, "gateway-service", "SERVICE");
  await pay(10, COUNTERPARTIES.maintenance.address, "maintenance-labor", "LABOR");
  await pay(14, COUNTERPARTIES.merchant.address, "merchant-goods", "GOODS");
  await pay(8, COUNTERPARTIES.network_peer.address, "network-seed", "NETWORK");

  let redemptionStep = { action: "optional_redemption", skipped: true };
  if (process.env.CYCLE_REDEEM_SPK !== "0") {
    const redeemAmount = ethers.parseEther(process.env.CYCLE_REDEEM_SPK || "5");
    const balance = await spk.balanceOf(deployer.address);
    if (balance >= redeemAmount) {
      const owedKwh = await spk.quoteRedemptionKwh(redeemAmount);
      await (await spk.connect(deployer).approve(runtime.contracts.currency_system, redeemAmount)).wait();
      const redemptionId = await currency.nextRedemptionId();
      const redeemTx = await currency.connect(deployer).openRedemption(
        deployer.address,
        redeemAmount,
        owedKwh,
        ethers.id(`spk-v1:cycle:${id}:redeem`)
      );
      const redeemReceipt = await redeemTx.wait();
      const resolveTx = await currency.connect(await getSignerFor(ethers, operator)).resolveRedemption(
        redemptionId,
        owedKwh,
        ethers.id(`spk-v1:cycle:${id}:delivery`)
      );
      const resolveReceipt = await resolveTx.wait();
      redemptionStep = {
        action: "optional_redemption",
        spk: Number(ethers.formatEther(redeemAmount)),
        kwh: Number(ethers.formatEther(owedKwh)),
        tx_hash: redeemReceipt.hash,
        resolve_tx_hash: resolveReceipt.hash,
        skipped: false,
      };
    }
  }
  steps.push(redemptionStep);

  const metrics = await currency.networkMetrics();
  const counterpartyBalances = await readCounterpartyBalances(spk, COUNTERPARTIES);

  const operation = {
    cycle_id: id,
    completed_at: new Date().toISOString(),
    network: runtime.network,
    mint_mode: mintMode,
    steps,
    counterparties: COUNTERPARTIES,
    counterparty_balances_spk: counterpartyBalances,
    metrics: {
      total_settled_spk: Number(ethers.formatEther(metrics.settledSpk)),
      total_redeemed_spk: Number(ethers.formatEther(metrics.redeemedSpk)),
      circulation_share_percent: Number(metrics.circulationShareBps) / 100,
      redemption_share_percent: Number(metrics.redemptionShareBps) / 100,
      network_payment_count: Number(metrics.networkPaymentCount),
    },
  };

  const operations = [...(runtime.operations || []), operation];
  mergeRuntime(
    {
      status: "operating",
      operations,
      counterparties: COUNTERPARTIES,
      counterparty_balances_spk: counterpartyBalances,
      on_chain: {
        deployer_spk_balance: Number(ethers.formatEther(await spk.balanceOf(deployer.address))),
        total_supply_spk: Number(ethers.formatEther(await spk.totalSupply())),
        issuance_mode: Number(await spk.issuanceMode()),
        peg_enabled: await spk.pegEnabled(),
        kwh_per_spk: ethers.formatEther(await spk.kwhPerSpkWad()),
      },
      genesis: {
        ...(runtime.genesis || {}),
        metrics: operation.metrics,
      },
    },
    ROOT
  );

  const logPath = path.join(ROOT, "state", "runtime", "spk_v1_operations.jsonl");
  fs.appendFileSync(logPath, JSON.stringify(operation) + "\n", "utf-8");
  console.log(JSON.stringify(operation, null, 2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { main, COUNTERPARTIES };
