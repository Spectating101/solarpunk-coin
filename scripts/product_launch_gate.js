const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

function readJson(root, relativePath, fallback = null) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function exists(root, relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function daysSince(dateString, now = new Date()) {
  if (!dateString) return Infinity;
  const millis = Date.parse(`${dateString}T00:00:00Z`);
  if (!Number.isFinite(millis)) return Infinity;
  return Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - millis) / 86_400_000);
}

function statusFromChecks(checks) {
  return checks.every((check) => check.pass) ? "launchable" : "blocked";
}

function check(name, pass, message, evidence = null, blocking = true) {
  return { name, pass: Boolean(pass), blocking, message, evidence };
}

function mode(name, label, checks) {
  const blockingChecks = checks.filter((item) => item.blocking);
  return {
    name,
    label,
    status: statusFromChecks(blockingChecks),
    passed_checks: blockingChecks.filter((item) => item.pass).length,
    blocking_checks: blockingChecks.filter((item) => !item.pass).length,
    checks,
  };
}

function summarizeNextActions(modes) {
  if (modes.paid_mainnet_product.status === "launchable") {
    return ["Paid mainnet launch gate is open; run final legal/security signoff before accepting customer funds."];
  }
  if (modes.closed_testnet_pilot.status === "launchable") {
    return [
      "Run the closed testnet pilot with one named operator and capped minting.",
      "Do not accept real customer funds until audit, legal scope, and redemption terms are complete.",
    ];
  }
  if (modes.public_testnet_product.status === "launchable") {
    return [
      "Launch the SolarPunk Public Lab now: demo, docs, Sepolia proof, and meter CSV onboarding.",
      "Next build target: governed attested-SPK redeploy plus one real meter or inverter adapter.",
      "Keep paid/mainnet launch blocked until audit, legal scope, and redemption policy are resolved.",
    ];
  }
  return [
    "Do not launch externally yet.",
    "Repair the public testnet proof path first: SPK mint proof, public readback, daily keeper evidence, and frontend build.",
  ];
}

function evaluateLaunchGate(options = {}) {
  const root = options.root || ROOT;
  const now = options.now || new Date();

  const product = readJson(root, "state/proofs/spk_product_empirics.json", {});
  const readback = readJson(root, "state/proofs/sepolia_spk_public_readback.json", {});
  const keeper = readJson(root, "state/keeper_logs/summary.json", {});
  const deployment = readJson(root, "state/deployments/sepolia_attested_spk_deploy.json", {});
  const audit = readJson(root, "docs/project/SECURITY_AUDIT_STATUS.json", {});
  const governance = readJson(root, "docs/project/GOVERNANCE_STATUS.json", {});

  const meterToMint = product.meter_to_mint || {};
  const operational = product.operational_basis || {};
  const keeperLastDate = keeper.last_successful_run || operational.last_successful_run;
  const keeperAgeDays = daysSince(keeperLastDate, now);
  const deploymentScope = deployment.scope || "unknown";
  const deploymentContracts = deployment.contracts || {};
  const auditStatus = audit.external_audit?.status || "UNKNOWN";
  const isFixtureBatch = String(meterToMint.batch_id || "").startsWith("batch_2026_02_12");
  const allContractsVerified = Boolean(deployment.source_verification?.contracts_verified)
    || Object.values(deploymentContracts).every((item) => item && item.verified);

  const publicTestnetChecks = [
    check(
      "SPK product proof exists",
      Boolean(meterToMint.proof_available && meterToMint.tx_hash && Number(meterToMint.accepted_records || 0) > 0),
      "Signed meter bundle to SPK mint proof is present.",
      "docs/product/SPK_ATTESTED_MINT_PROOF.md"
    ),
    check(
      "Sepolia readback passes",
      Boolean(readback.all_checks_passed),
      "Public readback confirms tx success, consumed attestation hash, consumed source hash, recipient balance, and cumulative surplus.",
      "docs/product/SPK_PUBLIC_READBACK.md"
    ),
    check(
      "Source verified proof stack",
      allContractsVerified,
      "Attested SPK proof contracts are source-verified on Sepolia.",
      "docs/project/ATTESTED_SPK_DEPLOYMENT.md"
    ),
    check(
      "Daily keeper evidence is fresh",
      Number(operational.total_successful_runs || keeper.total_successful_runs || 0) >= 14 && keeperAgeDays <= 3,
      `Latest keeper run is ${keeperLastDate || "unknown"} (${Number.isFinite(keeperAgeDays) ? keeperAgeDays : "n/a"} days old).`,
      "docs/project/DAILY_EXPERIMENT_STATUS.md"
    ),
    check(
      "Frontend proof surface exists",
      exists(root, "frontend/src/components/SPKMintDemo.jsx") && exists(root, "frontend/src/components/ProofDashboard.jsx"),
      "Frontend has proof dashboard and SPK mint product surface.",
      "frontend/src"
    ),
  ];

  const closedPilotChecks = [
    ...publicTestnetChecks,
    check(
      "Governed attested-SPK deployment",
      deploymentScope === "governed-attested-spk-pilot",
      `Current attested deployment scope is ${deploymentScope}; closed pilot needs governed Safe/admin role separation.`,
      "state/deployments/sepolia_attested_spk_deploy.json"
    ),
    check(
      "Real meter or inverter adapter",
      !isFixtureBatch,
      `Current batch ${meterToMint.batch_id || "unknown"} is fixture/proof data; closed pilot needs one real meter or inverter export.`,
      "docs/project/METER_CSV_IMPORT.md"
    ),
    check(
      "Pilot terms are drafted",
      exists(root, "docs/specs/PILOT_PLAN.md"),
      "Pilot plan exists; it still needs named counterparty details before execution.",
      "docs/specs/PILOT_PLAN.md",
      false
    ),
    check(
      "Governance runbook exists",
      Boolean(governance.checks?.ops_handbook_present && governance.checks?.role_matrix_present),
      "Governance status includes operations handbook and role matrix.",
      "docs/project/GOVERNANCE_STATUS.md"
    ),
  ];

  const paidMainnetChecks = [
    ...closedPilotChecks,
    check(
      "External audit complete",
      auditStatus === "COMPLETE",
      `External audit status is ${auditStatus}; paid/mainnet launch remains blocked.`,
      "docs/project/SECURITY_AUDIT_STATUS.json"
    ),
    check(
      "Legal and commercial scope complete",
      exists(root, "docs/product/LEGAL_AND_COMMERCIAL_SCOPE.md"),
      "No launch terms file exists for token classification, redemption obligations, user eligibility, and jurisdictional limits.",
      "docs/product/LEGAL_AND_COMMERCIAL_SCOPE.md"
    ),
    check(
      "Production redemption policy complete",
      exists(root, "docs/product/REDEMPTION_POLICY.md"),
      "No production redemption policy exists for what SPK holders can redeem, from whom, and under which caps.",
      "docs/product/REDEMPTION_POLICY.md"
    ),
    check(
      "Mainnet or L2 production deployment recorded",
      exists(root, "state/deployments/production_spk_deploy.json"),
      "No production deployment receipt exists.",
      "state/deployments/production_spk_deploy.json"
    ),
  ];

  const modes = {
    public_testnet_product: mode("public_testnet_product", "SolarPunk Public Lab", publicTestnetChecks),
    closed_testnet_pilot: mode("closed_testnet_pilot", "Closed testnet pilot", closedPilotChecks),
    paid_mainnet_product: mode("paid_mainnet_product", "Paid/mainnet product", paidMainnetChecks),
  };

  return {
    generated_at: new Date().toISOString(),
    decision: modes.public_testnet_product.status === "launchable"
      ? "Launch the SolarPunk Public Lab; keep closed-pilot and paid/mainnet gates blocked until their missing controls are resolved."
      : "Do not launch yet; public testnet proof surface is blocked.",
    recommended_current_launch: modes.public_testnet_product.status === "launchable" ? "public_testnet_product" : "none",
    next_build_target: modes.closed_testnet_pilot.status === "launchable" ? "paid_mainnet_product" : "closed_testnet_pilot",
    modes,
    next_actions: summarizeNextActions(modes),
  };
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
}

function writeMarkdown(filePath, report) {
  const lines = [];
  lines.push("# Product Launch Gate");
  lines.push("");
  lines.push(`- generated_at: \`${report.generated_at}\``);
  lines.push(`- decision: ${report.decision}`);
  lines.push(`- recommended_current_launch: \`${report.recommended_current_launch}\``);
  lines.push(`- next_build_target: \`${report.next_build_target}\``);
  lines.push("");
  lines.push("## Mode Status");
  lines.push("");
  lines.push("| Mode | Status | Passed | Blocking |");
  lines.push("|---|---:|---:|---:|");
  for (const launchMode of Object.values(report.modes)) {
    lines.push(`| ${launchMode.label} | \`${launchMode.status}\` | ${launchMode.passed_checks} | ${launchMode.blocking_checks} |`);
  }
  lines.push("");
  lines.push("## Next Actions");
  lines.push("");
  for (const action of report.next_actions) {
    lines.push(`- ${action}`);
  }
  lines.push("");
  for (const launchMode of Object.values(report.modes)) {
    lines.push(`## ${launchMode.label}`);
    lines.push("");
    for (const item of launchMode.checks) {
      const marker = item.pass ? "PASS" : item.blocking ? "BLOCK" : "WARN";
      lines.push(`- ${marker} \`${item.name}\`: ${item.message}`);
      if (item.evidence) lines.push(`  Evidence: \`${item.evidence}\``);
    }
    lines.push("");
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
}

function main() {
  const report = evaluateLaunchGate();
  const jsonPath = path.join(ROOT, "state", "product", "launch_gate.json");
  const mdPath = path.join(ROOT, "docs", "product", "PRODUCT_LAUNCH_GATE.md");
  writeJson(jsonPath, report);
  writeMarkdown(mdPath, report);
  console.log(`decision=${report.decision}`);
  console.log(`recommended_current_launch=${report.recommended_current_launch}`);
  console.log(`next_build_target=${report.next_build_target}`);
  console.log(`wrote: ${jsonPath}`);
  console.log(`wrote: ${mdPath}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  daysSince,
  evaluateLaunchGate,
  statusFromChecks,
};
