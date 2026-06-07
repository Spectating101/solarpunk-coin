const fs = require("fs");
const path = require("path");
const { ROOT, readRuntime } = require("./lib/spk_v1_runtime");

function explorerTx(base, hash) {
  return `${base}/tx/${hash}`;
}

function main() {
  const runtime = readRuntime();
  if (!runtime) throw new Error("Missing state/runtime/spk_v1.json");

  const base = runtime.explorer_base || "https://sepolia.etherscan.io";
  const lines = [];
  lines.push("# SPK v1 — Thesis Evidence Pack (Chapter 5)");
  lines.push("");
  lines.push(`**Generated:** ${new Date().toISOString()}`);
  lines.push(`**Status:** ${runtime.status}`);
  lines.push(`**Runtime:** \`state/runtime/spk_v1.json\``);
  lines.push("");
  lines.push("## Canonical contracts");
  lines.push("");
  lines.push("| Contract | Address |");
  lines.push("|----------|---------|");
  for (const [name, address] of Object.entries(runtime.contracts || {})) {
    lines.push(`| ${name} | \`${address}\` |`);
  }
  lines.push("");
  lines.push("## Live metrics");
  lines.push("");
  const m = runtime.genesis?.metrics || {};
  const o = runtime.on_chain || {};
  lines.push(`- Total supply: **${o.total_supply_spk ?? "n/a"} SPK**`);
  lines.push(`- Settled: **${m.total_settled_spk ?? "n/a"} SPK**`);
  lines.push(`- Network payments: **${m.network_payment_count ?? "n/a"}**`);
  lines.push(`- Circulation share: **${m.circulation_share_percent ?? "n/a"}%**`);
  lines.push("");
  lines.push("## Payment ledger (indexed from chain)");
  lines.push("");
  const ledger = runtime.chain_index?.payment_ledger || [];
  if (!ledger.length) {
    lines.push("_Run `npm run spk:v1:sync` to index on-chain events._");
  } else {
    lines.push("| # | Kind | SPK | Payee | Tx |");
    lines.push("|---|------|-----|-------|-----|");
    for (const row of ledger) {
      lines.push(
        `| ${row.payment_id} | ${row.payment_kind} | ${row.spk} | \`${row.payee.slice(0, 10)}…\` | [link](${explorerTx(base, row.tx_hash)}) |`
      );
    }
  }
  lines.push("");
  lines.push("## Operator cycles");
  lines.push("");
  for (const op of runtime.operations || []) {
    lines.push(`### ${op.cycle_id}`);
    lines.push("");
    for (const step of op.steps || []) {
      if (!step.tx_hash) continue;
      lines.push(`- **${step.action}**${step.spk ? ` (${step.spk} SPK)` : ""}${step.surplus_kwh ? ` (${step.surplus_kwh} kWh)` : ""}: [${step.tx_hash.slice(0, 14)}…](${explorerTx(base, step.tx_hash)})`);
    }
    lines.push("");
  }
  lines.push("## Reproduce");
  lines.push("");
  lines.push("```bash");
  lines.push("npm run spk:v1:cycle:sepolia");
  lines.push("npm run spk:v1:sync");
  lines.push("npm run spk:v1:evidence:export");
  lines.push("```");

  const outPath = path.join(ROOT, "thesis_package", "SPK_V1_EVIDENCE.md");
  fs.writeFileSync(outPath, lines.join("\n") + "\n", "utf-8");
  console.log(`wrote ${outPath}`);
}

if (require.main === module) {
  main();
}

module.exports = { main };
