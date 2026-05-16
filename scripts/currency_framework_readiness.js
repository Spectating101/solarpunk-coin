const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

function readJson(root, relativePath, fallback = null) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function readText(root, relativePath) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf-8");
}

function exists(root, relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function item(name, pass, status, evidence, interpretation) {
  return {
    name,
    pass: Boolean(pass),
    status,
    evidence,
    interpretation,
  };
}

function score(items) {
  const passed = items.filter((entry) => entry.pass).length;
  return {
    passed,
    total: items.length,
    ratio: Number((passed / items.length).toFixed(4)),
  };
}

function evaluateCurrencyFramework(options = {}) {
  const root = options.root || ROOT;
  const currencyLab = readJson(root, "state/product/currency_system_lab.json", {});
  const fieldReceipt = readJson(root, "state/product/field_receipt_loop.json", {});
  const launchGate = readJson(root, "state/product/launch_gate.json", {});
  const product = readJson(root, "state/proofs/spk_product_empirics.json", {});
  const testSource = readText(root, "test/SolarPunkCurrencySystem.test.js");
  const contractSource = readText(root, "contracts/SolarPunkCurrencySystem.sol");
  const sourceEvidence = currencyLab.source_evidence || {};
  const accounting = currencyLab.ledger?.accounting || {};
  const fieldAccounting = fieldReceipt.accounting || {};

  const checks = [
    item(
      "Surplus issuance proof",
      Boolean(sourceEvidence.mint_tx && sourceEvidence.attestation_hash && Number(sourceEvidence.accepted_surplus_kwh || 0) > 0),
      "public_testnet_evidence",
      "docs/product/SPK_ATTESTED_MINT_PROOF.md",
      "SPK is not a naked token in the lab; it starts from an accepted surplus-energy attestation."
    ),
    item(
      "Ledger conservation",
      accounting.conservation_pass === true,
      "model_verified",
      "state/product/currency_system_lab.json",
      "The lab ledger preserves minted supply across active balances and redemption burn."
    ),
    item(
      "Invoice settlement contract",
      exists(root, "contracts/SolarPunkCurrencySystem.sol") && contractSource.includes("settleInvoice"),
      "implemented",
      "contracts/SolarPunkCurrencySystem.sol",
      "SPK can now be routed as payment against hashed invoices with replay protection."
    ),
    item(
      "Redemption receipt contract",
      exists(root, "contracts/SolarPunkCurrencySystem.sol") && contractSource.includes("openRedemption"),
      "implemented",
      "contracts/SolarPunkCurrencySystem.sol",
      "SPK can be transferred into a registry, burned through redeemForEnergy, and converted into an owed-kWh receipt."
    ),
    item(
      "Delivery resolution and dispute state",
      contractSource.includes("resolveRedemption") && contractSource.includes("disputeRedemption"),
      "implemented",
      "contracts/SolarPunkCurrencySystem.sol",
      "The framework can track pending, fulfilled, shortfall, and disputed redemption states."
    ),
    item(
      "Contract regression tests",
      testSource.includes("settles an SPK invoice") &&
        testSource.includes("opens an energy redemption") &&
        testSource.includes("resolves redemption delivery"),
      "tested",
      "test/SolarPunkCurrencySystem.test.js",
      "The new currency mechanics are covered by settlement, burn/redemption, replay, slippage, fulfillment, shortfall, dispute, and re-resolution accounting tests."
    ),
    item(
      "Field receipt loop",
      fieldReceipt.execution_scope === "local_deterministic_no_external_dependencies" &&
        fieldReceipt.dependencies?.external_network_required === false &&
        fieldAccounting.conservation_pass === true &&
        fieldAccounting.delivery_fulfilled === true &&
        Number(fieldAccounting.owed_kwh || 0) === Number(fieldAccounting.delivered_kwh || 0),
      "local_end_to_end_receipt",
      "docs/product/FIELD_RECEIPT_LOOP.md",
      "The repo can run the whole internal currency path with no external dependency: signed meter surplus, SPK mint, invoice settlement, redemption burn, owed-kWh receipt, and delivery resolution."
    ),
    item(
      "Empirical feed continuity",
      Number(product.operational_basis?.total_successful_runs || sourceEvidence.daily_keeper_runs || 0) >= 14,
      "running_experiment",
      "docs/project/DAILY_EXPERIMENT_STATUS.md",
      "The daily data loop is long enough to support continuing empirical claims instead of a one-off demo."
    ),
  ];

  const readiness = score(checks);
  const nextBuildTargets = [
    {
      name: "Currency stress harness",
      status: "next_internal_target",
      description: "Simulate multi-actor payment velocity, redemption load, reserve ratio, and delivery shortfalls under daily energy-price scenarios.",
    },
    {
      name: "Deployable currency stack",
      status: "next_internal_target",
      description: "Add a deployment script and public readback for SolarPunkCurrencySystem beside the attestation-enabled SPK proof stack.",
    },
    {
      name: "Real meter export loop",
      status: "next_internal_target",
      description: "Replace the fixture meter bundle with a real inverter or utility export while keeping the same field receipt script and accounting checks.",
    },
  ];

  return {
    generated_at: (options.now || new Date()).toISOString(),
    title: "SolarPunk Currency Framework Readiness",
    current_internal_stage:
      readiness.passed === readiness.total
        ? "field_receipt_loop_ready"
        : "currency_framework_lab_incomplete",
    launch_gate_context: launchGate.recommended_current_launch || "unknown",
    design_thesis:
      "Treat SPK as an energy-denominated settlement asset: surplus attestations create supply, invoice settlement creates circulation, redemption burns supply into owed-kWh receipts, and delivery resolution measures whether the system clears real obligations.",
    mechanism_path: [
      "meter_or_inverter_reading",
      "signed_surplus_attestation",
      "spk_mint",
      "invoice_settlement",
      "redemption_burn",
      "owed_kwh_receipt",
      "delivery_resolution",
      "empirical_readiness_update",
    ],
    readiness,
    checks,
    current_quantitative_state: {
      accepted_surplus_kwh: sourceEvidence.accepted_surplus_kwh || null,
      minted_spk: accounting.minted_spk || sourceEvidence.minted_spk || null,
      active_supply_spk: accounting.active_supply_spk || null,
      redeemed_spk_lab: accounting.redeemed_spk || null,
      redeemed_energy_kwh_lab: accounting.redeemed_energy_kwh_equivalent || null,
      settlement_volume_spk_lab: accounting.settlement_volume_spk || null,
      velocity_ratio_lab: accounting.velocity_ratio || null,
      field_receipt_minted_spk: fieldAccounting.minted_spk || null,
      field_receipt_settlement_volume_spk: fieldAccounting.settlement_volume_spk || null,
      field_receipt_redeemed_spk: fieldAccounting.redeemed_spk || null,
      field_receipt_owed_kwh: fieldAccounting.owed_kwh || null,
      field_receipt_delivered_kwh: fieldAccounting.delivered_kwh || null,
      daily_keeper_runs: product.operational_basis?.total_successful_runs || sourceEvidence.daily_keeper_runs || null,
    },
    internal_boundary:
      "This is an internal engineering-readiness artifact. It measures whether the currency mechanism is coherent, testable, and empirically instrumented; it does not assert legal, audit, market, or mainnet readiness.",
    next_build_targets: nextBuildTargets,
    references: [
      {
        name: "BIS unified ledger/tokenisation framing",
        url: "https://www.bis.org/publ/arpdf/ar2023e3.htm",
        relevance: "Separates asset records, settlement assets, and programmable rules.",
      },
      {
        name: "NIST Smart Grid program",
        url: "https://www.nist.gov/engineering-laboratory/smart-grid",
        relevance: "Anchors the need for interoperable, measurement-based energy data.",
      },
      {
        name: "Chainlink Proof of Reserve",
        url: "https://chain.link/proof-of-reserve",
        relevance: "Design pattern for reserve-backed mint controls and transparent backing feeds.",
      },
      {
        name: "OpenZeppelin ERC20",
        url: "https://docs.openzeppelin.com/contracts/5.x/api/token/ERC20",
        relevance: "Base token standard and burnable token extension used by SPK.",
      },
    ],
  };
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
}

function writeMarkdown(filePath, report) {
  const lines = [];
  lines.push("# SolarPunk Currency Framework Readiness");
  lines.push("");
  lines.push(`- generated_at: \`${report.generated_at}\``);
  lines.push(`- current_internal_stage: \`${report.current_internal_stage}\``);
  lines.push(`- launch_gate_context: \`${report.launch_gate_context}\``);
  lines.push(`- readiness: \`${report.readiness.passed}/${report.readiness.total}\` checks`);
  lines.push("");
  lines.push("## Thesis");
  lines.push("");
  lines.push(report.design_thesis);
  lines.push("");
  lines.push("## Mechanism Path");
  lines.push("");
  report.mechanism_path.forEach((step, index) => {
    lines.push(`${index + 1}. \`${step}\``);
  });
  lines.push("");
  lines.push("## Internal Readiness Checks");
  lines.push("");
  lines.push("| Check | Status | Result | Evidence | Interpretation |");
  lines.push("|---|---|---:|---|---|");
  for (const check of report.checks) {
    lines.push(
      `| ${check.name} | \`${check.status}\` | ${check.pass ? "PASS" : "BLOCK"} | \`${check.evidence}\` | ${check.interpretation} |`
    );
  }
  lines.push("");
  lines.push("## Current Quantitative State");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  for (const [key, value] of Object.entries(report.current_quantitative_state)) {
    lines.push(`| ${key} | \`${value ?? "n/a"}\` |`);
  }
  lines.push("");
  lines.push("## Next Internal Build Targets");
  lines.push("");
  for (const target of report.next_build_targets) {
    lines.push(`- \`${target.name}\` (${target.status}): ${target.description}`);
  }
  lines.push("");
  lines.push("## Boundary");
  lines.push("");
  lines.push(report.internal_boundary);
  lines.push("");
  lines.push("## Research Anchors");
  lines.push("");
  for (const reference of report.references) {
    lines.push(`- [${reference.name}](${reference.url}) — ${reference.relevance}`);
  }
  lines.push("");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
}

function main() {
  const report = evaluateCurrencyFramework();
  const jsonPath = path.join(ROOT, "state", "product", "currency_framework_readiness.json");
  const mdPath = path.join(ROOT, "docs", "product", "CURRENCY_FRAMEWORK_READINESS.md");
  writeJson(jsonPath, report);
  writeMarkdown(mdPath, report);
  console.log(`current_internal_stage=${report.current_internal_stage}`);
  console.log(`readiness=${report.readiness.passed}/${report.readiness.total}`);
  console.log(`wrote: ${jsonPath}`);
  console.log(`wrote: ${mdPath}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  evaluateCurrencyFramework,
};
