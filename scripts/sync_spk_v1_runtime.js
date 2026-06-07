const hre = require("hardhat");
const { ethers } = hre;
const { ROOT, readRuntime, mergeRuntime } = require("./lib/spk_v1_runtime");
const { readLiveSnapshot } = require("./lib/spk_v1_chain_index");

async function resolveDeployBlock(runtime) {
  if (runtime.deploy_block) return runtime.deploy_block;
  const txHash = runtime.deploy_transactions?.deploy_currency_system;
  if (!txHash) return 0;
  const receipt = await ethers.provider.getTransactionReceipt(txHash);
  return receipt?.blockNumber || 0;
}

async function main() {
  const runtime = readRuntime();
  if (!runtime?.contracts?.solar_punk_coin) {
    throw new Error("Missing state/runtime/spk_v1.json");
  }

  const deployBlock = await resolveDeployBlock(runtime);
  const snapshot = await readLiveSnapshot({ ...runtime, deploy_block: deployBlock });
  const status = runtime.status === "operating" ? "operating" : runtime.status || "genesis_complete";

  mergeRuntime(
    {
      status,
      deploy_block: deployBlock,
      synced_at: new Date().toISOString(),
      on_chain: snapshot.on_chain,
      counterparty_balances_spk: snapshot.counterparty_balances_spk,
      chain_index: snapshot.chain_index,
      genesis: {
        ...(runtime.genesis || {}),
        metrics: snapshot.metrics,
        note: "Synced from on-chain state.",
      },
    },
    ROOT
  );

  console.log("spk_v1_runtime_synced");
  console.log(`payments_indexed=${snapshot.chain_index.payment_count}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { main };
