const { ethers } = require("hardhat");

const KIND_LABELS = {
  [ethers.id("SERVICE")]: "SERVICE",
  [ethers.id("LABOR")]: "LABOR",
  [ethers.id("GOODS")]: "GOODS",
  [ethers.id("NETWORK")]: "NETWORK",
};

function kindLabel(paymentKind) {
  if (!paymentKind || paymentKind === ethers.ZeroHash) return "INVOICE";
  return KIND_LABELS[paymentKind] || paymentKind;
}

async function indexCurrencyEvents(currency, spk, fromBlock = 0) {
  const currencyAddress = await currency.getAddress();
  const spkAddress = await spk.getAddress();
  const filterFrom = Math.max(0, Number(fromBlock));

  const [networkPayments, invoicePayments, redemptionsOpened, redemptionsResolved] = await Promise.all([
    currency.queryFilter(currency.filters.NetworkPaymentSettled(), filterFrom),
    currency.queryFilter(currency.filters.InvoiceSettled(), filterFrom),
    currency.queryFilter(currency.filters.RedemptionOpened(), filterFrom),
    currency.queryFilter(currency.filters.RedemptionResolved(), filterFrom),
  ]);

  const paymentLedger = networkPayments.map((event) => ({
    type: "network_payment",
    payment_id: Number(event.args.paymentId),
    payer: event.args.payer,
    payee: event.args.payee,
    spk: Number(ethers.formatEther(event.args.spkAmount)),
    payment_kind: kindLabel(event.args.paymentKind),
    invoice_hash: event.args.invoiceHash,
    block_number: event.blockNumber,
    tx_hash: event.transactionHash,
  }));

  for (const event of invoicePayments) {
    const id = Number(event.args.paymentId);
    if (paymentLedger.some((row) => row.payment_id === id && row.tx_hash === event.transactionHash)) {
      continue;
    }
    paymentLedger.push({
      type: "invoice",
      payment_id: id,
      payer: event.args.payer,
      payee: event.args.payee,
      spk: Number(ethers.formatEther(event.args.spkAmount)),
      payment_kind: "INVOICE",
      invoice_hash: event.args.invoiceHash,
      block_number: event.blockNumber,
      tx_hash: event.transactionHash,
    });
  }

  paymentLedger.sort((a, b) => a.payment_id - b.payment_id);

  const redemptionLedger = redemptionsOpened.map((event) => {
    const resolved = redemptionsResolved.find((r) => Number(r.args.redemptionId) === Number(event.args.redemptionId));
    return {
      redemption_id: Number(event.args.redemptionId),
      redeemer: event.args.redeemer,
      beneficiary: event.args.beneficiary,
      spk: Number(ethers.formatEther(event.args.spkAmount)),
      owed_kwh: Number(ethers.formatEther(event.args.owedKwhWad)),
      source_hash: event.args.sourceHash,
      block_number: event.blockNumber,
      tx_hash: event.transactionHash,
      resolved_tx_hash: resolved?.transactionHash || null,
    };
  });

  const byKind = {};
  for (const row of paymentLedger) {
    byKind[row.payment_kind] = (byKind[row.payment_kind] || 0) + row.spk;
  }

  return {
    currency_address: currencyAddress,
    spk_address: spkAddress,
    indexed_from_block: filterFrom,
    payment_ledger: paymentLedger,
    redemption_ledger: redemptionLedger,
    settled_by_kind_spk: byKind,
    payment_count: paymentLedger.length,
    redemption_count: redemptionLedger.length,
  };
}

async function readCounterpartyBalances(spk, counterparties) {
  const balances = {};
  for (const [name, info] of Object.entries(counterparties || {})) {
    balances[name] = Number(ethers.formatEther(await spk.balanceOf(info.address)));
  }
  return balances;
}

async function readLiveSnapshot(runtime) {
  const spk = await ethers.getContractAt("SolarPunkCoin", runtime.contracts.solar_punk_coin);
  const currency = await ethers.getContractAt("SolarPunkCurrencySystem", runtime.contracts.currency_system);
  const deployer = runtime.deployer;
  const metrics = await currency.networkMetrics();
  const fromBlock = runtime.deploy_block || 0;

  const index = await indexCurrencyEvents(currency, spk, fromBlock);
  const counterparties = runtime.counterparties || {};

  return {
    on_chain: {
      deployer_spk_balance: Number(ethers.formatEther(await spk.balanceOf(deployer))),
      total_supply_spk: Number(ethers.formatEther(await spk.totalSupply())),
      cumulative_surplus_kwh: Number(await spk.cumulativeSurplusKwh()),
      issuance_mode: Number(await spk.issuanceMode()),
      peg_enabled: await spk.pegEnabled(),
      kwh_per_spk: ethers.formatEther(await spk.kwhPerSpkWad()),
    },
    metrics: {
      total_settled_spk: Number(ethers.formatEther(metrics.settledSpk)),
      total_redeemed_spk: Number(ethers.formatEther(metrics.redeemedSpk)),
      circulation_share_percent: Number(metrics.circulationShareBps) / 100,
      redemption_share_percent: Number(metrics.redemptionShareBps) / 100,
      network_payment_count: Number(metrics.networkPaymentCount),
    },
    counterparty_balances_spk: await readCounterpartyBalances(spk, counterparties),
    chain_index: index,
  };
}

module.exports = {
  KIND_LABELS,
  kindLabel,
  indexCurrencyEvents,
  readCounterpartyBalances,
  readLiveSnapshot,
};
