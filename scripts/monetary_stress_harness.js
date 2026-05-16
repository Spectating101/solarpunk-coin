const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const DEFAULT_CONFIG = {
  mintFeeBps: 10,
  redemptionFeeBps: 10,
  settlementFeeBps: 0,
  operatorReserveUsd: 0,
  maxShortfallPctForPilot: 0.05,
  scenarioConfigs: [
    {
      id: "current_field_receipt_loop",
      label: "Current local field receipt loop",
      source: "state/product/field_receipt_loop.json",
      supplySource: "field_receipt",
      velocity: 0.6376,
      redemptionFraction: 20 / 130.1697,
      deliveryShortfallFraction: 0,
      interpretation: "Existing deterministic local loop: mint, settlement, redemption, and full delivery resolution.",
    },
    {
      id: "pilot_csv_full_redemption",
      label: "Pilot CSV full redemption",
      source: "state/product/pilot_csv_receipt.json",
      supplySource: "pilot_csv",
      velocity: 1,
      redemptionFraction: 1,
      deliveryShortfallFraction: 0,
      interpretation: "Sample meter/inverter CSV path redeemed entirely with no delivery shortfall.",
    },
    {
      id: "pilot_csv_75pct_redeem_5pct_shortfall",
      label: "Pilot CSV redemption wave",
      source: "state/product/pilot_csv_receipt.json",
      supplySource: "pilot_csv",
      velocity: 3,
      redemptionFraction: 0.75,
      deliveryShortfallFraction: 0.05,
      interpretation: "A stress case where most pilot CSV SPK is redeemed and 5% of owed kWh is not physically delivered.",
    },
    {
      id: "single_rooftop_annual_100pct_redeem_15pct_shortfall",
      label: "10 kW annual rooftop stress",
      source: "state/product/energy_standard_economics.json",
      supplySource: "capacity:single_rooftop_10kw",
      velocity: 1,
      redemptionFraction: 1,
      deliveryShortfallFraction: 0.15,
      interpretation: "Annual 10 kW issuance fully redeemed during a 15% physical-delivery shortfall.",
    },
    {
      id: "commercial_1mw_40pct_redeem_20pct_shortfall",
      label: "1 MW commercial portfolio stress",
      source: "state/product/energy_standard_economics.json",
      supplySource: "capacity:commercial_1mw",
      velocity: 3,
      redemptionFraction: 0.4,
      deliveryShortfallFraction: 0.2,
      interpretation: "Portfolio-scale circulation with a partial redemption wave and severe shortfall.",
    },
  ],
};

function readJson(relativePath, fallback = {}) {
  const filePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
}

function fixed(value, digits = 6) {
  if (!Number.isFinite(Number(value))) return null;
  return Number(Number(value).toFixed(digits));
}

function format(value, digits = 4) {
  if (!Number.isFinite(Number(value))) return "n/a";
  return Number(value).toLocaleString("en-US", { maximumFractionDigits: digits });
}

function formatUsd(value, digits = 2) {
  if (!Number.isFinite(Number(value))) return "n/a";
  return `$${Number(value).toLocaleString("en-US", { maximumFractionDigits: digits })}`;
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
    return `"${text.replaceAll("\"", "\"\"")}"`;
  }
  return text;
}

function writeScenarioCsv(filePath, scenarios) {
  const headers = [
    "id",
    "label",
    "issued_spk",
    "active_after_redemption_spk",
    "settlement_volume_spk",
    "redeemed_spk",
    "owed_kwh",
    "delivered_kwh",
    "shortfall_kwh",
    "shortfall_liability_usd",
    "fee_buffer_usd",
    "additional_buffer_required_usd",
    "status",
  ];
  const rows = [
    headers.join(","),
    ...scenarios.map((scenario) => headers.map((header) => csvEscape(scenario[header])).join(",")),
  ];
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rows.join("\n") + "\n", "utf-8");
}

function capacityScenario(energyStandard, id) {
  const found = (energyStandard.capacity_scenarios || []).find((scenario) => scenario.id === id);
  if (!found) throw new Error(`missing capacity scenario: ${id}`);
  return found;
}

function resolveSupply(config, sources) {
  if (config.supplySpk !== undefined) return Number(config.supplySpk);
  if (config.supplySource === "field_receipt") {
    return Number(sources.fieldReceipt.accounting?.minted_spk || 0);
  }
  if (config.supplySource === "currency_active") {
    return Number(sources.currencyLab.ledger?.accounting?.active_supply_spk || 0);
  }
  if (config.supplySource === "pilot_csv") {
    return Number(sources.pilotCsv.mint_preview?.net_spk || 0);
  }
  if (String(config.supplySource || "").startsWith("capacity:")) {
    const id = config.supplySource.slice("capacity:".length);
    return Number(capacityScenario(sources.energyStandard, id).net_issuance_spk || 0);
  }
  throw new Error(`unsupported supply source: ${config.supplySource}`);
}

function inferEnergyPrice(sources, override) {
  return Number(
    override ??
      sources.energyStandard.current_monetary_state?.energy_price_usd_per_kwh ??
      sources.currencyLab.source_evidence?.energy_price_usd_per_kwh ??
      sources.fieldReceipt.accounting?.energy_price_usd_per_kwh ??
      0.05
  );
}

function calculateScenario(config, sources, globalConfig = {}) {
  const energyPriceUsdPerKwh = inferEnergyPrice(sources, config.energyPriceUsdPerKwh);
  const mintFeeBps = Number(config.mintFeeBps ?? globalConfig.mintFeeBps ?? DEFAULT_CONFIG.mintFeeBps);
  const redemptionFeeBps = Number(
    config.redemptionFeeBps ?? globalConfig.redemptionFeeBps ?? DEFAULT_CONFIG.redemptionFeeBps
  );
  const settlementFeeBps = Number(
    config.settlementFeeBps ?? globalConfig.settlementFeeBps ?? DEFAULT_CONFIG.settlementFeeBps
  );
  const operatorReserveUsd = Number(
    config.operatorReserveUsd ?? globalConfig.operatorReserveUsd ?? DEFAULT_CONFIG.operatorReserveUsd
  );
  const issuedSpk = resolveSupply(config, sources);
  const velocity = Number(config.velocity ?? 1);
  const redemptionFraction = Math.min(Math.max(Number(config.redemptionFraction ?? 0), 0), 1);
  const shortfallFraction = Math.min(Math.max(Number(config.deliveryShortfallFraction ?? 0), 0), 1);
  const redeemedSpk = issuedSpk * redemptionFraction;
  const activeAfterRedemptionSpk = issuedSpk - redeemedSpk;
  const settlementVolumeSpk = issuedSpk * velocity;
  const owedKwh = redeemedSpk / energyPriceUsdPerKwh;
  const deliveredKwh = owedKwh * (1 - shortfallFraction);
  const shortfallKwh = owedKwh - deliveredKwh;
  const shortfallLiabilityUsd = shortfallKwh * energyPriceUsdPerKwh;
  const grossBeforeMintFeeSpk = issuedSpk / (1 - mintFeeBps / 10_000);
  const mintFeeSpk = Math.max(grossBeforeMintFeeSpk - issuedSpk, 0);
  const redemptionFeeSpk = redeemedSpk * (redemptionFeeBps / 10_000);
  const settlementFeeSpk = settlementVolumeSpk * (settlementFeeBps / 10_000);
  const feeBufferSpk = mintFeeSpk + redemptionFeeSpk + settlementFeeSpk;
  const feeBufferUsd = feeBufferSpk;
  const totalBufferUsd = feeBufferUsd + operatorReserveUsd;
  const additionalBufferRequiredUsd = Math.max(shortfallLiabilityUsd - totalBufferUsd, 0);
  const conservationPass = fixed(issuedSpk, 6) === fixed(activeAfterRedemptionSpk + redeemedSpk, 6);
  const maxPilotShortfall = Number(globalConfig.maxShortfallPctForPilot ?? DEFAULT_CONFIG.maxShortfallPctForPilot);
  const status =
    shortfallKwh === 0
      ? "passes_full_delivery"
      : additionalBufferRequiredUsd === 0
        ? "buffered_shortfall"
        : shortfallFraction <= maxPilotShortfall
          ? "pilot_requires_named_reserve"
          : "unsafe_without_external_reserve";

  return {
    id: config.id,
    label: config.label,
    source: config.source,
    supply_source: config.supplySource,
    interpretation: config.interpretation,
    energy_price_usd_per_kwh: fixed(energyPriceUsdPerKwh, 6),
    kwh_per_spk: fixed(1 / energyPriceUsdPerKwh, 6),
    velocity,
    redemption_fraction: fixed(redemptionFraction, 6),
    delivery_shortfall_fraction: fixed(shortfallFraction, 6),
    issued_spk: fixed(issuedSpk, 6),
    active_after_redemption_spk: fixed(activeAfterRedemptionSpk, 6),
    settlement_volume_spk: fixed(settlementVolumeSpk, 6),
    redeemed_spk: fixed(redeemedSpk, 6),
    owed_kwh: fixed(owedKwh, 6),
    delivered_kwh: fixed(deliveredKwh, 6),
    shortfall_kwh: fixed(shortfallKwh, 6),
    shortfall_liability_usd: fixed(shortfallLiabilityUsd, 6),
    mint_fee_spk: fixed(mintFeeSpk, 6),
    redemption_fee_spk: fixed(redemptionFeeSpk, 6),
    settlement_fee_spk: fixed(settlementFeeSpk, 6),
    fee_buffer_usd: fixed(feeBufferUsd, 6),
    operator_reserve_usd: fixed(operatorReserveUsd, 6),
    total_buffer_usd: fixed(totalBufferUsd, 6),
    additional_buffer_required_usd: fixed(additionalBufferRequiredUsd, 6),
    reserve_coverage_ratio: shortfallLiabilityUsd === 0 ? null : fixed(totalBufferUsd / shortfallLiabilityUsd, 6),
    conservation_pass: conservationPass,
    status,
  };
}

function buildMonetaryStressHarness(options = {}) {
  const sources = {
    energyStandard: options.energyStandard || readJson("state/product/energy_standard_economics.json"),
    currencyLab: options.currencyLab || readJson("state/product/currency_system_lab.json"),
    fieldReceipt: options.fieldReceipt || readJson("state/product/field_receipt_loop.json"),
    pilotCsv: options.pilotCsv || readJson("state/product/pilot_csv_receipt.json"),
  };
  const config = {
    ...DEFAULT_CONFIG,
    ...(options.config || {}),
    scenarioConfigs: options.config?.scenarioConfigs || DEFAULT_CONFIG.scenarioConfigs,
  };
  const scenarios = config.scenarioConfigs.map((scenario) => calculateScenario(scenario, sources, config));
  const shortfallScenarios = scenarios.filter((scenario) => scenario.shortfall_kwh > 0);
  const worstAdditionalBuffer = scenarios.reduce(
    (max, scenario) => Math.max(max, Number(scenario.additional_buffer_required_usd || 0)),
    0
  );
  const worstShortfallLiability = scenarios.reduce(
    (max, scenario) => Math.max(max, Number(scenario.shortfall_liability_usd || 0)),
    0
  );
  const statuses = scenarios.reduce((acc, scenario) => {
    acc[scenario.status] = (acc[scenario.status] || 0) + 1;
    return acc;
  }, {});

  return {
    generated_at: (options.now || new Date()).toISOString(),
    title: "SolarPunk Monetary Stress Harness",
    thesis:
      "SPK is not abstract money printing: every issued unit creates an energy-denominated redemption claim, so stress testing must expose redemption waves, physical delivery shortfalls, and the reserve buffer required to clear them.",
    base_monetary_state: {
      energy_price_usd_per_kwh: inferEnergyPrice(sources),
      kwh_per_1_spk: fixed(1 / inferEnergyPrice(sources), 6),
      current_lab_minted_spk: Number(sources.currencyLab.ledger?.accounting?.minted_spk || 0),
      current_lab_active_supply_spk: Number(sources.currencyLab.ledger?.accounting?.active_supply_spk || 0),
      current_lab_redeemed_spk: Number(sources.currencyLab.ledger?.accounting?.redeemed_spk || 0),
      pilot_csv_net_spk_preview: Number(sources.pilotCsv.mint_preview?.net_spk || 0),
      pilot_csv_surplus_kwh: Number(sources.pilotCsv.attestation_bundle?.summary?.total_surplus_kwh || 0),
    },
    equations: {
      owed_kwh: "redeemed_spk / energy_price_usd_per_kwh",
      delivered_kwh: "owed_kwh * (1 - delivery_shortfall_fraction)",
      shortfall_liability_usd: "shortfall_kwh * energy_price_usd_per_kwh",
      fee_buffer_usd: "mint_fee_spk + redemption_fee_spk + settlement_fee_spk, assuming 1 SPK = 1 USD unit of account for reserve accounting",
      conservation: "issued_spk = active_after_redemption_spk + redeemed_spk",
    },
    scenarios,
    summary: {
      scenario_count: scenarios.length,
      shortfall_scenario_count: shortfallScenarios.length,
      status_counts: statuses,
      worst_shortfall_liability_usd: fixed(worstShortfallLiability, 6),
      worst_additional_buffer_required_usd: fixed(worstAdditionalBuffer, 6),
      all_conservation_checks_pass: scenarios.every((scenario) => scenario.conservation_pass),
      highest_redemption_kwh: scenarios.reduce((max, scenario) => Math.max(max, Number(scenario.owed_kwh || 0)), 0),
    },
    required_controls_before_real_value: [
      "Cap real redemptions to deliverable metered generation or contracted energy volume.",
      "Maintain a named insurance/reserve buffer sized to the stress table, not just protocol fee assumptions.",
      "Separate CSV import evidence from hardware-certified meter finality until device custody is independently proven.",
      "Publish every pilot receipt with source hash, accepted records, rejected records, mint preview, and delivery resolution.",
      "Keep mainnet or paid use blocked until audit, legal redemption terms, and dispute/shortfall procedures exist.",
    ],
    hard_boundaries: [
      "This harness is an internal monetary stress model, not a solvency guarantee.",
      "Fee buffers are modeled accounting capacity; they are not customer funds or legal collateral unless separately reserved.",
      "Shortfall scenarios intentionally show where the protocol needs reserve capital instead of pretending SPK can print through physical delivery gaps.",
      "Capacity scenarios are based on benchmark production estimates; actual SPK issuance still requires signed surplus attestations.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# SolarPunk Monetary Stress Harness");
  lines.push("");
  lines.push(`- generated_at: \`${report.generated_at}\``);
  lines.push(`- thesis: ${report.thesis}`);
  lines.push("");
  lines.push("## Base Monetary State");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  lines.push(`| Energy price basis | \`${formatUsd(report.base_monetary_state.energy_price_usd_per_kwh, 4)}/kWh\` |`);
  lines.push(`| kWh per 1 SPK | \`${format(report.base_monetary_state.kwh_per_1_spk, 4)}\` |`);
  lines.push(`| Current lab minted SPK | \`${format(report.base_monetary_state.current_lab_minted_spk, 6)}\` |`);
  lines.push(`| Current lab active supply | \`${format(report.base_monetary_state.current_lab_active_supply_spk, 6)}\` |`);
  lines.push(`| Pilot CSV net SPK preview | \`${format(report.base_monetary_state.pilot_csv_net_spk_preview, 6)}\` |`);
  lines.push(`| Pilot CSV surplus | \`${format(report.base_monetary_state.pilot_csv_surplus_kwh, 2)} kWh\` |`);
  lines.push("");
  lines.push("## Equations");
  lines.push("");
  for (const [name, equation] of Object.entries(report.equations)) {
    lines.push(`- ${name}: \`${equation}\``);
  }
  lines.push("");
  lines.push("## Stress Scenarios");
  lines.push("");
  lines.push("| Scenario | Issued SPK | Redeemed SPK | Owed kWh | Delivered kWh | Shortfall kWh | Shortfall liability | Additional buffer needed | Status |");
  lines.push("|---|---:|---:|---:|---:|---:|---:|---:|---|");
  for (const scenario of report.scenarios) {
    lines.push(
      `| ${scenario.label} | ${format(scenario.issued_spk, 4)} | ${format(scenario.redeemed_spk, 4)} | ${format(scenario.owed_kwh, 2)} | ${format(scenario.delivered_kwh, 2)} | ${format(scenario.shortfall_kwh, 2)} | ${formatUsd(scenario.shortfall_liability_usd, 2)} | ${formatUsd(scenario.additional_buffer_required_usd, 2)} | \`${scenario.status}\` |`
    );
  }
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  lines.push(`| Scenarios | \`${report.summary.scenario_count}\` |`);
  lines.push(`| Shortfall scenarios | \`${report.summary.shortfall_scenario_count}\` |`);
  lines.push(`| Worst shortfall liability | \`${formatUsd(report.summary.worst_shortfall_liability_usd, 2)}\` |`);
  lines.push(`| Worst additional buffer required | \`${formatUsd(report.summary.worst_additional_buffer_required_usd, 2)}\` |`);
  lines.push(`| All conservation checks pass | \`${report.summary.all_conservation_checks_pass}\` |`);
  lines.push("");
  lines.push("## Required Controls Before Real Value");
  lines.push("");
  for (const control of report.required_controls_before_real_value) {
    lines.push(`- ${control}`);
  }
  lines.push("");
  lines.push("## Hard Boundaries");
  lines.push("");
  for (const boundary of report.hard_boundaries) {
    lines.push(`- ${boundary}`);
  }
  lines.push("");
  return lines.join("\n");
}

function main() {
  const report = buildMonetaryStressHarness();
  const jsonPath = path.join(ROOT, "state", "product", "monetary_stress_harness.json");
  const csvPath = path.join(ROOT, "state", "product", "monetary_stress_scenarios.csv");
  const mdPath = path.join(ROOT, "docs", "product", "MONETARY_STRESS_HARNESS.md");
  writeJson(jsonPath, report);
  writeScenarioCsv(csvPath, report.scenarios);
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, toMarkdown(report), "utf-8");
  console.log(`scenarios=${report.summary.scenario_count}`);
  console.log(`worst_shortfall_liability_usd=${report.summary.worst_shortfall_liability_usd}`);
  console.log(`worst_additional_buffer_required_usd=${report.summary.worst_additional_buffer_required_usd}`);
  console.log(`all_conservation_checks_pass=${report.summary.all_conservation_checks_pass}`);
  console.log(`wrote: ${jsonPath}`);
  console.log(`wrote: ${csvPath}`);
  console.log(`wrote: ${mdPath}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  buildMonetaryStressHarness,
  calculateScenario,
  DEFAULT_CONFIG,
};
