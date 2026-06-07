const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

function getArg(name, fallback = null) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

function readJson(relativePath, fallback = {}) {
  const filePath = path.resolve(ROOT, relativePath);
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
}

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf-8");
}

function fixed(value, digits = 6) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Number(parsed.toFixed(digits));
}

function money(value, digits = 2) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "n/a";
  return `$${parsed.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits })}`;
}

function findTier(hardware, id) {
  return (hardware.levels || []).find((level) => level.id === id) || null;
}

function buildOperatorIntake(economic) {
  const lowest = economic.lowest_absolute_support_archetype || {};
  return [
    {
      category: "site_identity",
      required: true,
      fields: ["operator_name", "site_id", "location_country_region", "generation_resource", "capacity_kw"],
      why: "Binds the pilot proof to a named physical generator without publishing private customer data.",
    },
    {
      category: "device_identity",
      required: true,
      fields: ["meter_or_inverter_model", "serial_or_anonymized_serial_hash", "commissioning_date", "rated_capacity_kw"],
      why: "Moves hardware provenance from sample L0 toward live-source L2.",
    },
    {
      category: "interval_counters",
      required: true,
      fields: ["window_start", "window_end", "generation_kwh_total_start/end", "site_load_kwh_total_start/end", "export_kwh_total_start/end", "curtailed_kwh_total_start/end_or_zero"],
      why: "Cumulative counters let the adapter reject non-monotonic data and derive deterministic surplus.",
    },
    {
      category: "signing_and_custody",
      required: true,
      fields: ["registered_device_address", "who_controls_gateway_key", "key_rotation_contact", "revocation_contact"],
      why: "The protocol can verify signatures only if signer custody and revocation are defined.",
    },
    {
      category: "economics",
      required: true,
      fields: ["current_export_credit_or_tariff_usd_per_kwh", "retail_offset_usd_per_kwh", "ppa_or_fit_terms_if_any", "capex_usd_or_usd_per_wdc", "support_subsidy_or_grant_terms_if_any"],
      why: `The current lowest-support archetype still needs about ${money(lowest.required_realized_value_usd_per_kwh, 4)}/kWh or equivalent capex/support terms.`,
    },
    {
      category: "corroboration",
      required: false,
      fields: ["utility_bill_or_green_button_export", "REC_TREC_EAC_record_if_any", "inverter_dashboard_screenshot_hash", "meter_screen_photo_hash"],
      why: "Optional at L2, but needed to move toward L3/L4 real-value credibility.",
    },
  ];
}

function buildExecutionModes(launchGate, hardware, economic) {
  const l2 = findTier(hardware, "L2") || {};
  const l3 = findTier(hardware, "L3") || {};
  const currentHardware = hardware.current_hardware_level || "unknown";
  const closedPilotStatus = launchGate.modes?.closed_testnet_pilot?.status || "unknown";
  const publicStatus = launchGate.modes?.public_testnet_product?.status || "unknown";
  const economicsReady = economic.launch_decision?.closed_pilot !== "requires_anchor_tariff_ppa_capex_reduction_or_support_capital";
  const hardwareReady = hardware.launch_decision?.closed_pilot !== "blocked_until_real_operator_L2_or_better_evidence";

  return [
    {
      id: "public_lab",
      status: publicStatus === "launchable" ? "ready_now" : "not_ready",
      value_claim: "External demo, grant/reviewer proof, reproducible testnet lab.",
      can_accept_real_value: false,
      execution_command: "Open frontend demo and run npm run product:launch-gate",
      success_definition: "Reviewer can inspect Sepolia proof, adapter sample, hardware model, economics model, and frontend without trusting private claims.",
    },
    {
      id: "operator_shadow_pilot",
      status: "ready_when_operator_file_arrives",
      value_claim: "Use a real operator export or LAN inverter source for evidence, but no paid mint/redeem obligation.",
      can_accept_real_value: false,
      execution_command:
        "METER_PRIVATE_KEY=0x... npm run meter:inverter-adapter -- --provider=cumulative-json --start=data/inverter/operator_start.json --end=data/inverter/operator_end.json --meter-id=OPERATOR-METER-001 --site-id=operator-site-a --real-operator-source",
      success_definition: "Hardware model upgrades from L0 to at least L2 and the verifier accepts signed, monotonic, closed-window readings.",
    },
    {
      id: "closed_testnet_pilot",
      status: closedPilotStatus === "launchable" ? "ready_now" : "execution_package_ready_external_inputs_needed",
      value_claim: "Named operator, capped testnet SPK flow, governed deployment, no public real-money exposure.",
      can_accept_real_value: false,
      execution_command: "Run governed redeploy/readback, operator adapter output, hardware provenance model, economics refresh, then product launch gate.",
      success_definition: "Governed attested-SPK deployment, L2+ hardware source, and signed economics/support terms clear launch gate.",
      current_hardware_level: currentHardware,
      target_hardware_level: "L2",
      target_hardware_risk_adjusted_kwh: l2.simulation?.risk_adjusted_real_value_kwh || null,
      economics_ready: economicsReady,
      hardware_ready: hardwareReady,
    },
    {
      id: "risk_boxed_revenue_grade_pilot",
      status: "designed_not_ready",
      value_claim: "L3 revenue-grade or L4 utility-corroborated source with audit/legal/reserve guardrails.",
      can_accept_real_value: false,
      execution_command: "Upgrade operator evidence to L3/L4, complete audit/legal/reserve policy, then reassess paid launch gate.",
      success_definition: "Revenue-grade/utility corroboration plus non-hardware launch gates; until then, no paid/mainnet claims.",
      target_hardware_level: "L3_or_L4",
      target_hardware_risk_adjusted_kwh: l3.simulation?.risk_adjusted_real_value_kwh || null,
    },
  ];
}

function buildActionQueue(launchGate, hardware, economic) {
  const lowest = economic.lowest_absolute_support_archetype || {};
  const actions = [
    {
      id: "maintain_research_demo",
      owner: "SolarPunk",
      status: "ready_now",
      command_or_artifact: "npx hardhat test && npm run proof:spk-attested-mint",
      acceptance_criteria:
        "Contract tests pass and the local attestation mint reproduces without Sepolia. Historical Sepolia proof JSON remains in state/proofs/.",
    },
    {
      id: "collect_l2_operator_source",
      owner: "Operator or site owner",
      status: "external_input_needed",
      command_or_artifact: "docs/product/CLOSED_PILOT_EXECUTION_PACKAGE.md#operator-intake",
      acceptance_criteria: "Cumulative counters, device identity, signer custody, and operator identity are provided for one closed interval.",
    },
    {
      id: "run_operator_adapter",
      owner: "SolarPunk",
      status: "ready_after_operator_source",
      command_or_artifact: "npm run meter:inverter-adapter -- --provider=cumulative-json --real-operator-source",
      acceptance_criteria: "Accepted records > 0, rejected records = 0 or explained, hardware provenance upgrades to L2+.",
    },
    {
      id: "governed_attested_spk_redeploy",
      owner: "SolarPunk",
      status: "internal_execution_needed",
      command_or_artifact: "npm run deploy:pilot-stack:sepolia && npm run pilot-stack:readback",
      acceptance_criteria: "Deployment scope is governed-attested-spk-pilot with source verification and role readback.",
    },
    {
      id: "anchor_economics_terms",
      owner: "Operator/SolarPunk",
      status: "external_terms_needed",
      command_or_artifact: "state/product/economic_launch_readiness.json",
      acceptance_criteria: `At minimum, the 10 kW path needs about ${money(lowest.required_realized_value_usd_per_kwh, 4)}/kWh realized value or ${money(lowest.annual_support_required_usd, 2)}/year support equivalent under current assumptions.`,
    },
    {
      id: "refresh_research_artifacts",
      owner: "SolarPunk",
      status: "ready_on_demand",
      command_or_artifact: "npm run product:hardware-provenance && npm run product:economic-launch && npm run product:empirics",
      acceptance_criteria: "state/product/*.json reports regenerate from current inputs without manual edits.",
    },
  ];
  return actions;
}

function buildPilotPackage(options = {}) {
  const launchGate = readJson(options.launchGate || "state/product/launch_gate.json");
  const hardware = readJson(options.hardware || "state/product/hardware_provenance_model.json");
  const economic = readJson(options.economic || "state/product/economic_launch_readiness.json");
  const inverter = readJson(options.inverter || "state/product/inverter_meter_adapter_receipt.json");
  const keeper = readJson(options.keeper || "state/keeper_logs/summary.json");
  const lowest = economic.lowest_absolute_support_archetype || {};
  const currentHardwareTier = findTier(hardware, hardware.current_hardware_level) || {};
  const l2 = findTier(hardware, "L2") || {};

  const executionModes = buildExecutionModes(launchGate, hardware, economic);
  const actionQueue = buildActionQueue(launchGate, hardware, economic);
  const internalReady = actionQueue.filter((item) => item.status === "needs_repair").length === 0;
  const externalInputs = actionQueue.filter((item) => item.status.includes("external"));

  return {
    generated_at: (options.generatedAt || new Date()).toISOString(),
    title: "SolarPunk Closed Pilot Execution Package",
    purpose:
      "Remove vague blockers by converting the path from public lab to closed pilot into concrete inputs, commands, caps, and acceptance criteria.",
    current_decision: {
      public_lab: launchGate.modes?.public_testnet_product?.status || "unknown",
      closed_testnet_pilot: launchGate.modes?.closed_testnet_pilot?.status || "unknown",
      paid_mainnet_product: launchGate.modes?.paid_mainnet_product?.status || "unknown",
      internal_execution_package_ready: internalReady,
      external_inputs_remaining: externalInputs.length,
    },
    current_evidence: {
      latest_keeper_run: keeper.last_successful_run || null,
      inverter_adapter_accepted_surplus_kwh: inverter.mint_readiness?.accepted_surplus_kwh || null,
      hardware_level: hardware.current_hardware_level || null,
      hardware_label: hardware.current_hardware_label || null,
      current_real_value_kwh_cap: hardware.thresholds?.current_real_value_kwh_cap ?? null,
      current_risk_adjusted_kwh: currentHardwareTier.simulation?.risk_adjusted_real_value_kwh ?? null,
      l2_target_risk_adjusted_kwh: l2.simulation?.risk_adjusted_real_value_kwh ?? null,
    },
    economics_target: {
      archetype: lowest.label || null,
      required_realized_value_usd_per_kwh: lowest.required_realized_value_usd_per_kwh || null,
      current_p50_realized_value_usd_per_kwh: lowest.current_p50_realized_value_usd_per_kwh || null,
      required_value_multiplier: lowest.required_value_multiplier || null,
      annual_support_required_usd: lowest.annual_support_required_usd || null,
      capital_support_required_usd: lowest.capital_support_required_usd || null,
      max_launch_capex_usd_per_wdc: lowest.max_launch_capex_usd_per_wdc || null,
    },
    execution_modes: executionModes,
    operator_intake: buildOperatorIntake(economic),
    action_queue: actionQueue,
    no_excuse_boundary:
      "There are no undefined blockers left in this package. Anything not launchable is mapped to a named input, command, acceptance criterion, and owner. The package still refuses to mislabel sample data as real hardware proof.",
  };
}

function toCsv(report) {
  const rows = [["id", "owner", "status", "command_or_artifact", "acceptance_criteria"]];
  for (const item of report.action_queue) {
    rows.push([item.id, item.owner, item.status, item.command_or_artifact, item.acceptance_criteria]);
  }
  return `${rows.map((row) => row.map((cell) => JSON.stringify(String(cell))).join(",")).join("\n")}\n`;
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# SolarPunk Closed Pilot Execution Package");
  lines.push("");
  lines.push(`- generated_at: \`${report.generated_at}\``);
  lines.push(`- public_lab: \`${report.current_decision.public_lab}\``);
  lines.push(`- closed_testnet_pilot: \`${report.current_decision.closed_testnet_pilot}\``);
  lines.push(`- paid_mainnet_product: \`${report.current_decision.paid_mainnet_product}\``);
  lines.push(`- internal_execution_package_ready: \`${report.current_decision.internal_execution_package_ready}\``);
  lines.push(`- external_inputs_remaining: \`${report.current_decision.external_inputs_remaining}\``);
  lines.push("");
  lines.push("## Purpose");
  lines.push("");
  lines.push(report.purpose);
  lines.push("");
  lines.push(report.no_excuse_boundary);
  lines.push("");
  lines.push("## Current Evidence");
  lines.push("");
  lines.push(`- latest_keeper_run: \`${report.current_evidence.latest_keeper_run}\``);
  lines.push(`- inverter_adapter_accepted_surplus_kwh: \`${report.current_evidence.inverter_adapter_accepted_surplus_kwh}\``);
  lines.push(`- current_hardware_level: \`${report.current_evidence.hardware_level}\``);
  lines.push(`- current_hardware_label: \`${report.current_evidence.hardware_label}\``);
  lines.push(`- current_real_value_kwh_cap: \`${report.current_evidence.current_real_value_kwh_cap}\``);
  lines.push(`- L2_target_risk_adjusted_kwh_for_same_sample_basis: \`${report.current_evidence.l2_target_risk_adjusted_kwh}\``);
  lines.push("");
  lines.push("## Economics Target");
  lines.push("");
  lines.push(`- archetype: \`${report.economics_target.archetype}\``);
  lines.push(`- required_realized_value_usd_per_kwh: \`${report.economics_target.required_realized_value_usd_per_kwh}\``);
  lines.push(`- current_p50_realized_value_usd_per_kwh: \`${report.economics_target.current_p50_realized_value_usd_per_kwh}\``);
  lines.push(`- required_value_multiplier: \`${report.economics_target.required_value_multiplier}\``);
  lines.push(`- annual_support_required_usd: \`${report.economics_target.annual_support_required_usd}\``);
  lines.push(`- capital_support_required_usd: \`${report.economics_target.capital_support_required_usd}\``);
  lines.push(`- max_launch_capex_usd_per_wdc: \`${report.economics_target.max_launch_capex_usd_per_wdc}\``);
  lines.push("");
  lines.push("## Execution Modes");
  lines.push("");
  lines.push("| Mode | Status | Real value? | Success definition |");
  lines.push("|---|---|---:|---|");
  for (const mode of report.execution_modes) {
    lines.push(`| ${mode.id} | \`${mode.status}\` | ${mode.can_accept_real_value} | ${mode.success_definition} |`);
  }
  lines.push("");
  lines.push("## Operator Intake");
  lines.push("");
  lines.push("| Category | Required | Fields | Why |");
  lines.push("|---|---:|---|---|");
  for (const item of report.operator_intake) {
    lines.push(`| ${item.category} | ${item.required} | ${item.fields.join(", ")} | ${item.why} |`);
  }
  lines.push("");
  lines.push("## Action Queue");
  lines.push("");
  lines.push("| Action | Owner | Status | Command / Artifact | Acceptance Criteria |");
  lines.push("|---|---|---|---|---|");
  for (const item of report.action_queue) {
    lines.push(`| ${item.id} | ${item.owner} | \`${item.status}\` | \`${item.command_or_artifact}\` | ${item.acceptance_criteria} |`);
  }
  lines.push("");
  lines.push("## Minimal Operator Command");
  lines.push("");
  lines.push("```bash");
  lines.push("METER_PRIVATE_KEY=0x... npm run meter:inverter-adapter -- \\");
  lines.push("  --provider=cumulative-json \\");
  lines.push("  --start=data/inverter/operator_start.json \\");
  lines.push("  --end=data/inverter/operator_end.json \\");
  lines.push("  --meter-id=OPERATOR-METER-001 \\");
  lines.push("  --site-id=operator-site-a \\");
  lines.push("  --real-operator-source");
  lines.push("");
  lines.push("npm run product:hardware-provenance");
  lines.push("npm run product:launch-gate");
  lines.push("```");
  lines.push("");
  return lines.join("\n");
}

function main() {
  const report = buildPilotPackage({
    launchGate: getArg("launch-gate", "state/product/launch_gate.json"),
    hardware: getArg("hardware", "state/product/hardware_provenance_model.json"),
    economic: getArg("economic", "state/product/economic_launch_readiness.json"),
    inverter: getArg("inverter", "state/product/inverter_meter_adapter_receipt.json"),
    keeper: getArg("keeper", "state/keeper_logs/summary.json"),
  });
  const outJson = path.resolve(ROOT, getArg("out-json", "state/product/closed_pilot_execution_package.json"));
  const outCsv = path.resolve(ROOT, getArg("out-csv", "state/product/closed_pilot_action_queue.csv"));
  const outMd = path.resolve(ROOT, getArg("out-md", "docs/product/CLOSED_PILOT_EXECUTION_PACKAGE.md"));
  writeJson(outJson, report);
  writeText(outCsv, toCsv(report));
  writeText(outMd, toMarkdown(report));

  console.log(`public_lab=${report.current_decision.public_lab}`);
  console.log(`closed_testnet_pilot=${report.current_decision.closed_testnet_pilot}`);
  console.log(`external_inputs_remaining=${report.current_decision.external_inputs_remaining}`);
  console.log(`wrote: ${outJson}`);
  console.log(`wrote: ${outMd}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

module.exports = {
  buildActionQueue,
  buildExecutionModes,
  buildOperatorIntake,
  buildPilotPackage,
  toCsv,
  toMarkdown,
};
