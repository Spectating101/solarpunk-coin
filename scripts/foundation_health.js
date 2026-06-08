#!/usr/bin/env node
/**
 * Foundation operator health — gas, sync freshness, ledger, deployer SPK.
 *   node scripts/foundation_health.js
 * Exit 1 if operator gas is critically low.
 */
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const { readRuntime } = require("./lib/spk_v1_runtime");

const ROOT = path.join(__dirname, "..");
const MIN_ETH = Number(process.env.FOUNDATION_MIN_OPERATOR_ETH || "0.01");
const MAX_SYNC_AGE_HOURS = Number(process.env.FOUNDATION_MAX_SYNC_AGE_HOURS || "168");

const SPK_ABI = ["function balanceOf(address) view returns (uint256)"];

async function main() {
  const runtime = readRuntime(ROOT);
  if (!runtime) throw new Error("Missing state/runtime/spk_v1.json");

  const deployer = runtime.deployer || runtime.roles?.currency_operator;
  const spkAddress = runtime.contracts?.solar_punk_coin;
  const rpc = process.env.SEPOLIA_RPC || process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
  const provider = new ethers.JsonRpcProvider(rpc);

  const ethWei = await provider.getBalance(deployer);
  const eth = Number(ethers.formatEther(ethWei));

  let spk = null;
  if (spkAddress) {
    const token = new ethers.Contract(spkAddress, SPK_ABI, provider);
    spk = Number(ethers.formatEther(await token.balanceOf(deployer)));
  }

  const syncedAt = runtime.synced_at || runtime.updated_at;
  let syncAgeHours = null;
  if (syncedAt) {
    syncAgeHours = (Date.now() - new Date(syncedAt).getTime()) / 3_600_000;
  }

  const metrics = (runtime.genesis || {}).metrics || {};
  const payments = metrics.network_payment_count ?? (runtime.chain_index || {}).payment_count;
  const supply = runtime.on_chain?.total_supply_spk;

  const foundationPath = path.join(ROOT, "state/foundation/status.json");
  const foundationExists = fs.existsSync(foundationPath);

  const gasOk = eth >= MIN_ETH;
  const syncOk = syncAgeHours == null || syncAgeHours <= MAX_SYNC_AGE_HOURS;

  const report = {
    ok: gasOk && syncOk,
    at: new Date().toISOString(),
    deployer,
    operator_eth: eth,
    operator_eth_min: MIN_ETH,
    operator_spk: spk,
    synced_at: syncedAt,
    sync_age_hours: syncAgeHours != null ? Number(syncAgeHours.toFixed(2)) : null,
    network_payment_count: payments,
    total_supply_spk: supply,
    peg_enabled: runtime.monetary_policy?.peg_enabled ?? null,
    foundation_status_json: foundationExists,
    actions: [],
  };

  if (!gasOk) {
    report.actions.push(`Top up Sepolia ETH on deployer (need ≥${MIN_ETH}, have ${eth.toFixed(6)})`);
  }
  if (!syncOk) {
    report.actions.push(`Run npm run foundation:sync (stale ${syncAgeHours?.toFixed(0)}h)`);
  }
  if (gasOk && syncOk) {
    report.actions.push("Ready for npm run foundation:cycle");
  }

  console.log(JSON.stringify(report, null, 2));

  const outPath = path.join(ROOT, "state/foundation/health.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n");

  if (!gasOk) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
