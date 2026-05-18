const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const SOURCES = [
  {
    name: "Fronius Solar API JSON",
    url: "https://www.fronius.com/en/help-center/solar-energy/products/monitoring-control/solutions/open-interfaces/fronius-solar-api-json-",
    relevance: "Local inverter/Datamanager JSON API for inverter, meter, and component data.",
  },
  {
    name: "SunSpec specifications",
    url: "https://sunspec.org/specifications/",
    relevance: "Open DER interoperability specifications and information models for inverters, meters, batteries, and smart-grid applications.",
  },
  {
    name: "IEC 62053-22:2020",
    url: "https://webstore.iec.ch/en/publication/29987",
    relevance: "Static AC active-energy meter requirements for classes 0.1S, 0.2S, and 0.5S.",
  },
  {
    name: "ANSI C12.1/C12.20 metering accuracy classes",
    url: "https://blog.ansi.org/ansi/ansi-c12-20-2015-electric-meters-accuracy-classes/",
    relevance: "US electric-meter code and 0.1, 0.2, and 0.5 accuracy class framing.",
  },
  {
    name: "NIST Green Button Initiative",
    url: "https://www.nist.gov/el/smart-grid-menu/hot-topics/green-button-initiative",
    relevance: "Utility customer energy-usage data access through the ESPI/Green Button standard.",
  },
];

const LEVELS = [
  {
    id: "L0",
    label: "Adapter sample or fixture",
    stage: "public_lab_only",
    evidence_score: 32,
    measurement_uncertainty_pct: 5,
    custody_risk_pct: 100,
    real_value_haircut_pct: 100,
    max_real_value_kwh_per_day: 0,
    closed_pilot_acceptable: false,
    paid_launch_acceptable: false,
    what_it_proves: "Software normalization, signing, replay protection, and verifier compatibility.",
    missing: [
      "No real operator source",
      "No hardware serial or model identity",
      "No tamper-evident physical chain",
      "No utility or revenue-grade corroboration",
    ],
  },
  {
    id: "L1",
    label: "Operator-signed export",
    stage: "shadow_pilot_or_review",
    evidence_score: 52,
    measurement_uncertainty_pct: 3,
    custody_risk_pct: 35,
    real_value_haircut_pct: 60,
    max_real_value_kwh_per_day: 250,
    closed_pilot_acceptable: false,
    paid_launch_acceptable: false,
    what_it_proves: "A named operator can export and sign production/load/export data.",
    missing: [
      "Manual export can be curated before signing",
      "Device key may be operator custody rather than hardware custody",
      "Meter accuracy class may be unknown",
      "Audit trail may not prove uninterrupted measurement",
    ],
  },
  {
    id: "L2",
    label: "Live inverter or gateway signed counter",
    stage: "closed_pilot_candidate",
    evidence_score: 70,
    measurement_uncertainty_pct: 1.5,
    custody_risk_pct: 15,
    real_value_haircut_pct: 30,
    max_real_value_kwh_per_day: 2500,
    closed_pilot_acceptable: true,
    paid_launch_acceptable: false,
    what_it_proves: "Automated inverter/gateway polling with signed interval records and duplicate-window controls.",
    missing: [
      "Inverter telemetry is not always revenue-grade billing data",
      "LAN/API sign convention must be validated",
      "Gateway key custody and firmware update process need controls",
      "Utility settlement data is still external corroboration",
    ],
  },
  {
    id: "L3",
    label: "Revenue-grade meter with gateway custody",
    stage: "risk_boxed_pilot",
    evidence_score: 84,
    measurement_uncertainty_pct: 0.5,
    custody_risk_pct: 6,
    real_value_haircut_pct: 12,
    max_real_value_kwh_per_day: 10000,
    closed_pilot_acceptable: true,
    paid_launch_acceptable: false,
    what_it_proves: "A meter with known accuracy class signs or feeds a controlled gateway with auditable logs.",
    missing: [
      "Still needs third-party audit of the adapter and custody process",
      "Still needs legal terms for energy/redemption claims",
      "Still needs dispute and rollback procedure",
    ],
  },
  {
    id: "L4",
    label: "Utility or settlement-corroborated meter",
    stage: "production_candidate_after_audit",
    evidence_score: 93,
    measurement_uncertainty_pct: 0.2,
    custody_risk_pct: 2,
    real_value_haircut_pct: 5,
    max_real_value_kwh_per_day: 50000,
    closed_pilot_acceptable: true,
    paid_launch_acceptable: true,
    what_it_proves: "On-site measurement is corroborated by utility/settlement-grade records or equivalent external attestations.",
    missing: [
      "Paid launch still requires audit, legal scope, reserve policy, and production governance",
      "Environmental claims still need REC/T-REC/EAC ownership and retirement handling",
    ],
  },
];

function getArg(name, fallback = null) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) {
    if (fallback !== null) return fallback;
    throw new Error(`Missing JSON file: ${filePath}`);
  }
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

function inferCurrentLevel(adapterReceipt) {
  if (!adapterReceipt || !adapterReceipt.source) return "L0";
  if (!adapterReceipt.hardware_provenance?.real_operator_source) return "L0";

  const provider = String(adapterReceipt.source.provider || "");
  const intervalMethod = String(adapterReceipt.source.interval_method || "");
  if (provider.includes("fronius") || intervalMethod.includes("cumulative")) return "L2";
  return "L1";
}

function evaluateLevel(level, acceptedSurplusKwh) {
  const rawKwh = Number(acceptedSurplusKwh || 0);
  const reserveKwh = rawKwh * (level.real_value_haircut_pct / 100);
  const postHaircutKwh = Math.max(0, rawKwh - reserveKwh);
  const cappedKwh = Math.min(postHaircutKwh, level.max_real_value_kwh_per_day);
  const estimatedMeasurementBandKwh = rawKwh * (level.measurement_uncertainty_pct / 100);

  return {
    ...level,
    simulation: {
      accepted_surplus_kwh: fixed(rawKwh),
      measurement_uncertainty_band_kwh: fixed(estimatedMeasurementBandKwh),
      risk_reserve_kwh: fixed(reserveKwh),
      risk_adjusted_real_value_kwh: fixed(cappedKwh),
      capped_out_kwh: fixed(Math.max(0, postHaircutKwh - cappedKwh)),
      testnet_or_lab_kwh: fixed(rawKwh),
    },
  };
}

function buildChecklist() {
  return [
    {
      item: "Device identity",
      required_for: "L2+",
      evidence: "meter/inverter model, serial, site ID, rated capacity, commissioning date, operator identity",
    },
    {
      item: "Counter integrity",
      required_for: "L2+",
      evidence: "cumulative generation/load/export counters, monotonicity checks, duplicate-window rejection, reset detection",
    },
    {
      item: "Key custody",
      required_for: "L2+",
      evidence: "device or gateway private key not stored in repo, signer address registered, rotation/revocation process",
    },
    {
      item: "Accuracy basis",
      required_for: "L3+",
      evidence: "revenue-grade meter certificate or stated ANSI/IEC accuracy class; calibration date where available",
    },
    {
      item: "External corroboration",
      required_for: "L4",
      evidence: "utility bill, Green Button/ESPI export, REC/T-REC/EAC certificate, or settlement statement for the same site/window",
    },
    {
      item: "Dispute process",
      required_for: "closed pilot",
      evidence: "operator contact, source archive retention, correction workflow, and mint reversal or reserve-offset policy",
    },
  ];
}

function buildHardwareProvenanceModel(options = {}) {
  const adapterPath = path.resolve(ROOT, options.adapterPath || "state/product/inverter_meter_adapter_receipt.json");
  const adapterReceipt = readJson(adapterPath, {});
  const acceptedSurplusKwh = Number(
    options.acceptedSurplusKwh ?? adapterReceipt.mint_readiness?.accepted_surplus_kwh ?? 0
  );
  const currentLevelId = options.currentLevel || inferCurrentLevel(adapterReceipt);
  const levels = LEVELS.map((level) => evaluateLevel(level, acceptedSurplusKwh));
  const currentLevel = levels.find((level) => level.id === currentLevelId) || levels[0];

  return {
    generated_at: (options.generatedAt || new Date()).toISOString(),
    title: "SolarPunk Hardware Provenance Model",
    purpose:
      "Make physical hardware risk explicit before treating meter or inverter data as real-value SPK mint input.",
    source_artifact: path.relative(ROOT, adapterPath),
    current_hardware_level: currentLevel.id,
    current_hardware_label: currentLevel.label,
    current_source: {
      provider: adapterReceipt.source?.provider || "unknown",
      mode: adapterReceipt.source?.mode || "unknown",
      evidence_grade: adapterReceipt.source?.evidence_grade || "unknown",
      real_operator_source: Boolean(adapterReceipt.hardware_provenance?.real_operator_source),
      accepted_surplus_kwh: fixed(acceptedSurplusKwh),
    },
    launch_decision: {
      public_lab: "acceptable_for_testnet_and_demo",
      closed_pilot: currentLevel.closed_pilot_acceptable
        ? "hardware_level_can_support_closed_pilot_if_economics_and_governance_clear"
        : "blocked_until_real_operator_L2_or_better_evidence",
      paid_launch: currentLevel.paid_launch_acceptable
        ? "hardware_level_can_support_paid_launch_after_audit_legal_and_reserve_gates"
        : "blocked_until_L4_or_equivalent_plus_non_hardware_gates",
    },
    thresholds: {
      minimum_closed_pilot_level: "L2",
      minimum_revenue_grade_pilot_level: "L3",
      minimum_paid_launch_hardware_level: "L4_or_equivalent",
      current_real_value_kwh_cap: currentLevel.simulation.risk_adjusted_real_value_kwh,
    },
    levels,
    checklist: buildChecklist(),
    risk_register: [
      {
        risk: "Telemetry overstatement",
        mitigation: "Prefer cumulative counters; reject non-monotonic counters; cap minting per device per day; hold risk reserve.",
      },
      {
        risk: "Wrong import/export sign convention",
        mitigation: "Require a one-day shadow comparison against inverter dashboard, meter screen, or utility net-meter record.",
      },
      {
        risk: "Gateway key compromise",
        mitigation: "Register signer address, rotate keys, revoke stale devices, and require operator archive logs for disputed windows.",
      },
      {
        risk: "Physical bypass or meter tampering",
        mitigation: "Move from L2 inverter telemetry to L3 revenue-grade meter or L4 utility corroboration before real value scale.",
      },
      {
        risk: "Environmental claim double counting",
        mitigation: "Treat SPK minting as metered settlement proof; handle REC/T-REC/EAC ownership and retirement separately.",
      },
    ],
    sources: SOURCES,
  };
}

function toCsv(report) {
  const rows = [
    [
      "level",
      "label",
      "stage",
      "evidence_score",
      "measurement_uncertainty_pct",
      "custody_risk_pct",
      "real_value_haircut_pct",
      "max_real_value_kwh_per_day",
      "risk_adjusted_real_value_kwh",
      "closed_pilot_acceptable",
      "paid_launch_acceptable",
    ],
  ];
  for (const level of report.levels) {
    rows.push([
      level.id,
      level.label,
      level.stage,
      level.evidence_score,
      level.measurement_uncertainty_pct,
      level.custody_risk_pct,
      level.real_value_haircut_pct,
      level.max_real_value_kwh_per_day,
      level.simulation.risk_adjusted_real_value_kwh,
      level.closed_pilot_acceptable,
      level.paid_launch_acceptable,
    ]);
  }
  return `${rows.map((row) => row.map((cell) => JSON.stringify(String(cell))).join(",")).join("\n")}\n`;
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# SolarPunk Hardware Provenance Model");
  lines.push("");
  lines.push(`- generated_at: \`${report.generated_at}\``);
  lines.push(`- source_artifact: \`${report.source_artifact}\``);
  lines.push(`- current_hardware_level: \`${report.current_hardware_level}\``);
  lines.push(`- current_hardware_label: \`${report.current_hardware_label}\``);
  lines.push(`- current_real_operator_source: \`${report.current_source.real_operator_source}\``);
  lines.push(`- accepted_surplus_basis: \`${report.current_source.accepted_surplus_kwh} kWh\``);
  lines.push("");
  lines.push("## Purpose");
  lines.push("");
  lines.push(report.purpose);
  lines.push("");
  lines.push("This document exists because a real paid product cannot simply say that inverter data is true. The protocol can verify signatures and replay resistance, but physical measurement truth is an off-chain assurance problem. The right engineering answer is not to ignore that gap; it is to tier it, cap it, haircut it, and define the evidence needed to upgrade it.");
  lines.push("");
  lines.push("## Current Decision");
  lines.push("");
  lines.push(`- public_lab: \`${report.launch_decision.public_lab}\``);
  lines.push(`- closed_pilot: \`${report.launch_decision.closed_pilot}\``);
  lines.push(`- paid_launch: \`${report.launch_decision.paid_launch}\``);
  lines.push("");
  lines.push("## Hardware Evidence Tiers");
  lines.push("");
  lines.push("| Level | Label | Score | Haircut | Cap kWh/day | Risk-adjusted kWh | Closed pilot | Paid launch |");
  lines.push("|---|---|---:|---:|---:|---:|---|---|");
  for (const level of report.levels) {
    lines.push(
      `| ${level.id} | ${level.label} | ${level.evidence_score} | ${level.real_value_haircut_pct}% | ` +
        `${level.max_real_value_kwh_per_day} | ${level.simulation.risk_adjusted_real_value_kwh} | ` +
        `${level.closed_pilot_acceptable} | ${level.paid_launch_acceptable} |`
    );
  }
  lines.push("");
  lines.push("## Tier Meaning");
  lines.push("");
  for (const level of report.levels) {
    lines.push(`### ${level.id}: ${level.label}`);
    lines.push("");
    lines.push(`- stage: \`${level.stage}\``);
    lines.push(`- what_it_proves: ${level.what_it_proves}`);
    lines.push(`- measurement_uncertainty_pct: \`${level.measurement_uncertainty_pct}\``);
    lines.push(`- custody_risk_pct: \`${level.custody_risk_pct}\``);
    lines.push(`- real_value_haircut_pct: \`${level.real_value_haircut_pct}\``);
    lines.push(`- simulated_risk_reserve_kwh: \`${level.simulation.risk_reserve_kwh}\``);
    lines.push("");
    lines.push("Missing:");
    for (const item of level.missing) lines.push(`- ${item}`);
    lines.push("");
  }
  lines.push("## Upgrade Checklist");
  lines.push("");
  lines.push("| Item | Required for | Evidence |");
  lines.push("|---|---|---|");
  for (const item of report.checklist) {
    lines.push(`| ${item.item} | ${item.required_for} | ${item.evidence} |`);
  }
  lines.push("");
  lines.push("## Hardware Risk Register");
  lines.push("");
  for (const item of report.risk_register) {
    lines.push(`- ${item.risk}: ${item.mitigation}`);
  }
  lines.push("");
  lines.push("## Practical Product Rule");
  lines.push("");
  lines.push("For public lab and grant review, L0 is acceptable because it proves the adapter path without claiming physical finality. For a closed pilot, target L2 minimum: a named operator, live inverter or gateway polling, signed cumulative counter intervals, duplicate-window rejection, and archived raw source files. For real-value scale, target L3/L4: revenue-grade or utility-corroborated metering, custody controls, audit, legal scope, and reserve policy.");
  lines.push("");
  lines.push("## Standards And Anchors");
  lines.push("");
  for (const source of report.sources) {
    lines.push(`- [${source.name}](${source.url}) - ${source.relevance}`);
  }
  lines.push("");
  return lines.join("\n");
}

function main() {
  const report = buildHardwareProvenanceModel({
    adapterPath: getArg("adapter", "state/product/inverter_meter_adapter_receipt.json"),
    currentLevel: getArg("level"),
  });
  const outJson = path.resolve(ROOT, getArg("out-json", "state/product/hardware_provenance_model.json"));
  const outCsv = path.resolve(ROOT, getArg("out-csv", "state/product/hardware_provenance_tiers.csv"));
  const outMd = path.resolve(ROOT, getArg("out-md", "docs/product/HARDWARE_PROVENANCE_MODEL.md"));
  writeJson(outJson, report);
  writeText(outCsv, toCsv(report));
  writeText(outMd, toMarkdown(report));

  console.log(`current_hardware_level=${report.current_hardware_level}`);
  console.log(`closed_pilot=${report.launch_decision.closed_pilot}`);
  console.log(`paid_launch=${report.launch_decision.paid_launch}`);
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
  LEVELS,
  buildHardwareProvenanceModel,
  evaluateLevel,
  inferCurrentLevel,
  toCsv,
  toMarkdown,
};
