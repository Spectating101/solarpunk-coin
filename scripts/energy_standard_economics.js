const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const DEFAULTS = {
  energyPriceUsdPerKwh: 0.05,
  mintFeeBps: 10,
  redemptionFeeBps: 10,
  settlementFeeBps: 0,
  velocityMultipliers: [0.5, 1, 3, 10],
  redemptionFractions: [0.25, 0.5, 1],
  capacityScenariosKw: [
    {
      id: "single_rooftop_10kw",
      label: "Single rooftop",
      capacity_kw: 10,
      interpretation: "One normal home-scale solar system.",
    },
    {
      id: "neighborhood_250kw",
      label: "Neighborhood cluster",
      capacity_kw: 250,
      interpretation: "A small bundle of homes, shops, or campus roofs.",
    },
    {
      id: "commercial_1mw",
      label: "Commercial portfolio",
      capacity_kw: 1_000,
      interpretation: "Warehouse, school, factory, or small operator portfolio.",
    },
    {
      id: "microgrid_5mw",
      label: "Community microgrid",
      capacity_kw: 5_000,
      interpretation: "A serious local energy economy, still below utility scale.",
    },
    {
      id: "utility_100mw",
      label: "Utility-scale reference",
      capacity_kw: 100_000,
      interpretation: "Large reference case for monetary scale, not a launch claim.",
    },
  ],
};

function readJson(relativePath, fallback = {}) {
  const filePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function readCsvFirstRow(relativePath) {
  const filePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(filePath)) return {};
  const rows = fs.readFileSync(filePath, "utf-8").trim().split(/\r?\n/);
  if (rows.length < 2) return {};
  const headers = rows[0].split(",");
  const values = rows[1].split(",");
  return Object.fromEntries(headers.map((header, index) => [header, values[index]]));
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
}

function fixed(value, digits = 4) {
  if (!Number.isFinite(Number(value))) return null;
  return Number(Number(value).toFixed(digits));
}

function format(value, digits = 2) {
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
    "capacity_kw",
    "annual_kwh",
    "gross_issuance_spk",
    "net_issuance_spk",
    "mint_fee_spk",
    "same_cost_capex_usd",
    "simple_payback_years",
  ];
  const rows = [
    headers.join(","),
    ...scenarios.map((scenario) =>
      headers.map((header) => csvEscape(scenario[header])).join(",")
    ),
  ];
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rows.join("\n") + "\n", "utf-8");
}

function calculateIssuance({
  surplusKwh,
  energyPriceUsdPerKwh,
  mintFeeBps,
}) {
  const grossSpk = surplusKwh * energyPriceUsdPerKwh;
  const mintFeeSpk = grossSpk * (mintFeeBps / 10_000);
  const netSpk = grossSpk - mintFeeSpk;
  return {
    surplus_kwh: fixed(surplusKwh, 4),
    energy_price_usd_per_kwh: energyPriceUsdPerKwh,
    gross_issuance_spk: fixed(grossSpk, 6),
    mint_fee_bps: mintFeeBps,
    mint_fee_spk: fixed(mintFeeSpk, 6),
    net_issuance_spk: fixed(netSpk, 6),
    implied_kwh_per_net_spk: fixed(surplusKwh / netSpk, 6),
  };
}

function buildScenario({
  scenario,
  resourceBenchmark,
  energyPriceUsdPerKwh,
  mintFeeBps,
  redemptionFeeBps,
  velocityMultipliers,
  redemptionFractions,
}) {
  const solar = resourceBenchmark.solar;
  const baseCapacityKw = solar.standard_system.system_kw_dc;
  const scale = scenario.capacity_kw / baseCapacityKw;
  const annualKwh = solar.production_estimate.annualized_ac_kwh_from_window_average * scale;
  const averageDailyKwh = solar.production_estimate.average_window_day_ac_kwh * scale;
  const latestDailyKwh = solar.production_estimate.latest_day_ac_kwh * scale;
  const sameCostCapexUsd =
    resourceBenchmark.solar.cost_model.residential_installed_cost_usd_per_wdc_assumption *
    scenario.capacity_kw *
    1000;
  const issuance = calculateIssuance({
    surplusKwh: annualKwh,
    energyPriceUsdPerKwh,
    mintFeeBps,
  });
  const annualGrossValueUsd = annualKwh * energyPriceUsdPerKwh;
  const settlementCapacity = Object.fromEntries(
    velocityMultipliers.map((velocity) => [
      `${velocity}x`,
      fixed(issuance.net_issuance_spk * velocity, 2),
    ])
  );
  const redemptionFeeSensitivity = Object.fromEntries(
    redemptionFractions.map((fraction) => [
      `${Math.round(fraction * 100)}pct_redeemed`,
      fixed(issuance.net_issuance_spk * fraction * (redemptionFeeBps / 10_000), 4),
    ])
  );

  return {
    id: scenario.id,
    label: scenario.label,
    interpretation: scenario.interpretation,
    capacity_kw: scenario.capacity_kw,
    scale_vs_10kw_system: fixed(scale, 4),
    average_daily_kwh: fixed(averageDailyKwh, 2),
    latest_daily_kwh: fixed(latestDailyKwh, 2),
    annual_kwh: fixed(annualKwh, 2),
    gross_issuance_spk: issuance.gross_issuance_spk,
    net_issuance_spk: issuance.net_issuance_spk,
    mint_fee_spk: issuance.mint_fee_spk,
    same_cost_capex_usd: fixed(sameCostCapexUsd, 2),
    simple_payback_years: fixed(sameCostCapexUsd / annualGrossValueUsd, 2),
    settlement_capacity_spk_by_velocity: settlementCapacity,
    redemption_fee_spk_by_redemption_fraction: redemptionFeeSensitivity,
    boundary:
      "This is a solar production and issuance sensitivity. Actual SPK minting requires accepted signed meter or inverter surplus attestations.",
  };
}

function buildEnergyStandardEconomics(options = {}) {
  const resourceBenchmark =
    options.resourceBenchmark || readJson("state/product/resource_benchmark_lab.json");
  const fieldReceipt = options.fieldReceipt || readJson("state/product/field_receipt_loop.json");
  const currencyLab = options.currencyLab || readJson("state/product/currency_system_lab.json");
  const productEmpirics = options.productEmpirics || readJson("state/proofs/spk_product_empirics.json");
  const ceir = options.ceir || readCsvFirstRow("thesis_package/empirical_results/ceir_analysis_summary.csv");
  const config = { ...DEFAULTS, ...(options.config || {}) };
  const energyPriceUsdPerKwh =
    Number(currencyLab.source_evidence?.energy_price_usd_per_kwh) ||
    Number(fieldReceipt.accounting?.energy_price_usd_per_kwh) ||
    config.energyPriceUsdPerKwh;
  const mintFeeBps =
    Number(resourceBenchmark.solar?.spk_value_model?.mint_fee_bps) || config.mintFeeBps;
  const acceptedSurplusKwh =
    Number(currencyLab.source_evidence?.accepted_surplus_kwh) ||
    Number(fieldReceipt.source?.total_surplus_kwh) ||
    Number(productEmpirics.meter_to_mint?.total_surplus_kwh) ||
    0;
  const mintedSpk =
    Number(currencyLab.source_evidence?.minted_spk) ||
    Number(fieldReceipt.accounting?.minted_spk) ||
    Number(productEmpirics.meter_to_mint?.minted_spk) ||
    0;
  const issuanceProof = calculateIssuance({
    surplusKwh: Number(fieldReceipt.source?.onchain_surplus_kwh || Math.floor(acceptedSurplusKwh)),
    energyPriceUsdPerKwh,
    mintFeeBps,
  });
  const proofDeltaSpk = Math.abs(mintedSpk - issuanceProof.net_issuance_spk);
  const kwhPerSpk = 1 / energyPriceUsdPerKwh;
  const activeSupplySpk = Number(currencyLab.ledger?.accounting?.active_supply_spk || 0);
  const redeemedSpk = Number(currencyLab.ledger?.accounting?.redeemed_spk || 0);
  const settlementVolumeSpk = Number(currencyLab.ledger?.accounting?.settlement_volume_spk || 0);
  const scenarios = config.capacityScenariosKw.map((scenario) =>
    buildScenario({
      scenario,
      resourceBenchmark,
      energyPriceUsdPerKwh,
      mintFeeBps,
      redemptionFeeBps: config.redemptionFeeBps,
      velocityMultipliers: config.velocityMultipliers,
      redemptionFractions: config.redemptionFractions,
    })
  );
  const baseAnnualKwh = resourceBenchmark.solar.production_estimate.annualized_ac_kwh_from_window_average;
  const baseCapexUsd = resourceBenchmark.solar.cost_model.installed_cost_usd_before_incentives;
  const priceBasisSensitivity = [0.05, 0.10, 0.20, 0.35].map((price) => {
    const issuance = calculateIssuance({
      surplusKwh: baseAnnualKwh,
      energyPriceUsdPerKwh: price,
      mintFeeBps,
    });
    const annualGrossValueUsd = baseAnnualKwh * price;
    return {
      energy_price_usd_per_kwh: price,
      kwh_per_spk: fixed(1 / price, 4),
      annual_gross_issuance_spk_10kw: issuance.gross_issuance_spk,
      annual_net_issuance_spk_10kw: issuance.net_issuance_spk,
      mint_fee_spk_10kw: issuance.mint_fee_spk,
      simple_payback_years_10kw_before_incentives: fixed(baseCapexUsd / annualGrossValueUsd, 2),
    };
  });

  return {
    generated_at: (options.now || new Date()).toISOString(),
    title: "SolarPunk Energy Standard Economics",
    one_line:
      "SolarPunk is an energy-standard cryptocurrency: a modern gold-standard system where verified renewable-energy surplus replaces gold as the backing base.",
    thesis:
      "SPK supply should expand only when productive energy surplus is measured, admitted, signed, and converted through a transparent issuance rule.",
    monetary_equations: {
      issuance: "gross_spk = accepted_surplus_kwh * energy_price_usd_per_kwh",
      net_issuance: "net_spk = gross_spk * (1 - mint_fee_bps / 10000)",
      convertibility: "owed_kwh = redeemed_spk / energy_price_usd_per_kwh",
      settlement_velocity: "effective_settlement_volume = circulating_spk * velocity",
      fee_capture:
        "protocol_currency_fee = mint_fee_spk + redemption_fee_spk; settlement transfers currently have no protocol fee in SolarPunkCurrencySystem",
    },
    current_monetary_state: {
      energy_price_usd_per_kwh: energyPriceUsdPerKwh,
      kwh_per_1_spk_at_current_basis: fixed(kwhPerSpk, 4),
      accepted_surplus_kwh_fixture: fixed(acceptedSurplusKwh, 4),
      public_or_local_minted_spk: fixed(mintedSpk, 6),
      issuance_formula_net_spk: issuanceProof.net_issuance_spk,
      issuance_formula_delta_spk: fixed(proofDeltaSpk, 8),
      active_supply_spk_lab: fixed(activeSupplySpk, 6),
      active_supply_energy_equivalent_kwh_lab: fixed(activeSupplySpk * kwhPerSpk, 4),
      redeemed_spk_lab: fixed(redeemedSpk, 6),
      redeemed_energy_equivalent_kwh_lab: fixed(redeemedSpk * kwhPerSpk, 4),
      settlement_volume_spk_lab: fixed(settlementVolumeSpk, 6),
      settlement_velocity_ratio_lab: currencyLab.ledger?.accounting?.velocity_ratio || null,
    },
    proof_issuance_math: {
      source: "state/product/field_receipt_loop.json + state/product/currency_system_lab.json",
      ...issuanceProof,
      observed_minted_spk: fixed(mintedSpk, 6),
      observed_matches_formula: proofDeltaSpk < 0.000001,
    },
    empirical_foundation: {
      ceir_pre_ban_coefficient: ceir.Pre_ban_CEIR_coef ? fixed(Number(ceir.Pre_ban_CEIR_coef), 6) : null,
      ceir_post_ban_coefficient: ceir.Post_ban_CEIR_coef ? fixed(Number(ceir.Post_ban_CEIR_coef), 6) : null,
      chow_pvalue: ceir.Chow_pvalue ? Number(ceir.Chow_pvalue) : null,
      interpretation:
        "The thesis evidence motivates energy as an economically meaningful crypto variable; it does not by itself prove SPK demand or legal currency status.",
    },
    solar_resource_basis: {
      source: "state/product/resource_benchmark_lab.json",
      location: resourceBenchmark.location,
      standard_system_kw_dc: resourceBenchmark.solar.standard_system.system_kw_dc,
      panel_area_m2: resourceBenchmark.solar.standard_system.panel_area_m2,
      latest_day_kwh: resourceBenchmark.solar.production_estimate.latest_day_ac_kwh,
      annualized_kwh: resourceBenchmark.solar.production_estimate.annualized_ac_kwh_from_window_average,
      installed_cost_usd_before_incentives:
        resourceBenchmark.solar.cost_model.installed_cost_usd_before_incentives,
      cost_basis_boundary:
        "This is a sizing assumption from the resource benchmark, not a vendor quote or investment-return promise.",
    },
    price_basis_sensitivity: priceBasisSensitivity,
    capacity_scenarios: scenarios,
    gold_standard_mapping: [
      {
        gold_standard: "Gold reserve base",
        energy_standard: "Verified renewable surplus base",
        implementation: "signed meter/inverter data, source hashes, oracle attestation, replay protection",
        remaining_risk: "meter custody, data quality, basis mismatch, and operator honesty",
      },
      {
        gold_standard: "Assay and vault custody",
        energy_standard: "Measurement, signature, and registry custody",
        implementation: "meter registry, accepted bundle, consumed source hash, accepted kWh",
        remaining_risk: "hardware certification and no-double-counting registry discipline",
      },
      {
        gold_standard: "Convertibility promise",
        energy_standard: "Redemption into owed-kWh claim",
        implementation: "redeemForEnergy, burn accounting, fulfillment/shortfall/dispute states",
        remaining_risk: "legal redemption terms and real delivery counterparty",
      },
      {
        gold_standard: "Scarce mine output constrains issuance",
        energy_standard: "Measured productive surplus constrains issuance",
        implementation: "mintFromSurplusAttestation accepts only admissible surplus evidence",
        remaining_risk: "governance must not weaken admissibility rules",
      },
    ],
    monetary_function_readiness: [
      {
        function: "Issuance discipline",
        status: "implemented_in_proof_stack",
        evidence: "SPK mints from signed surplus attestation with source-hash replay protection.",
      },
      {
        function: "Unit of account",
        status: "partial",
        evidence: "Prototype uses a USD/kWh basis; the deeper energy standard is kWh-per-SPK convertibility.",
      },
      {
        function: "Medium of exchange",
        status: "local_lab",
        evidence: "SolarPunkCurrencySystem settles hashed invoices in SPK locally.",
      },
      {
        function: "Store of value",
        status: "not_proven",
        evidence: "Needs real redemption terms, liquidity, governance, audit, and user demand.",
      },
      {
        function: "Standard of deferred payment",
        status: "partial",
        evidence: "SPK redemption records can track owed kWh with fulfillment, shortfall, and dispute states.",
      },
      {
        function: "Reserve/backing transparency",
        status: "partial",
        evidence: "Energy evidence and public readback exist; production-grade registry, audit, and operator controls are still open.",
      },
    ],
    finance_risk_register: [
      {
        risk: "Basis risk",
        meaning: "A generic kWh estimate is not always deliverable where and when the holder needs energy.",
        control: "Move toward time/location/source-tagged SPK claims.",
      },
      {
        risk: "Oracle and meter risk",
        meaning: "Bad hardware, bad signatures, duplicate claims, or compromised operators can corrupt issuance.",
        control: "Hardware-backed meters, no-double-counting registry, multi-oracle checks, and slashing.",
      },
      {
        risk: "Redemption mismatch",
        meaning: "Issued SPK may circulate faster or farther than the operator's real delivery ability.",
        control: "Caps, redemption queues, insurance fund, shortfall rules, and local delivery domains.",
      },
      {
        risk: "Price-basis governance",
        meaning: "Changing USD/kWh basis changes issuance volume and kWh-per-SPK convertibility.",
        control: "Transparent governance delay, public parameter history, and basis-policy disclosure.",
      },
      {
        risk: "Regulatory classification",
        meaning: "SPK could be treated as a cryptocurrency, prepaid energy credit, commodity-linked token, stablecoin-like token, security, or another instrument.",
        control: "Legal scope before paid/mainnet launch.",
      },
    ],
    hard_boundaries: [
      "This is an economic framework and sensitivity model, not a claim of legal money status.",
      "The protocol does not create energy; it creates an issuance rule over verified productive energy surplus.",
      "NASA/resource estimates can size the backing base, but cannot mint SPK.",
      "The current redemption loop is local/lab evidence unless a real operator accepts the obligation.",
      "The same-cost capex sensitivity is not a vendor quote, project-finance model, or expected return promise.",
    ],
    next_finance_build_targets: [
      "Add time/location/vintage tags to SPK issuance and redemption claims.",
      "Build a monetary stress harness for redemption waves, velocity spikes, oracle errors, and shortfalls.",
      "Define an explicit reserve/insurance fund policy tied to outstanding owed-kWh exposure.",
      "Write a legally cautious redemption policy for pilot operators.",
      "Replace the resource benchmark with one real generator export and rerun the same issuance model.",
    ],
    references: [
      {
        name: "BIS unified ledger/tokenisation framing",
        url: "https://www.bis.org/publ/arpdf/ar2023e3.htm",
        relevance: "Programmable settlement and tokenised claims framing.",
      },
      {
        name: "FSB global stablecoin recommendations",
        url: "https://www.fsb.org/2023/07/high-level-recommendations-for-the-regulation-supervision-and-oversight-of-global-stablecoin-arrangements-final-report/",
        relevance: "Governance, redemption, risk management, and disclosure requirements for stable-value systems.",
      },
      {
        name: "US EPA renewable energy certificates",
        url: "https://www.epa.gov/green-power-markets/renewable-energy-certificates-recs",
        relevance: "Renewable generation attributes, certificate tracking, ownership, and retirement discipline.",
      },
      {
        name: "NASA POWER Daily API",
        url: "https://power.larc.nasa.gov/docs/services/api/temporal/daily/",
        relevance: "Empirical resource basis for solar and wind benchmark sizing.",
      },
    ],
  };
}

function writeMarkdown(filePath, report) {
  const lines = [];
  lines.push("# SolarPunk Energy Standard Economics");
  lines.push("");
  lines.push(`- generated_at: \`${report.generated_at}\``);
  lines.push(`- one_line: ${report.one_line}`);
  lines.push("");
  lines.push("## Core Thesis");
  lines.push("");
  lines.push(report.thesis);
  lines.push("");
  lines.push("This is the economic/finance spine of the project. The technical system exists to enforce this rule:");
  lines.push("");
  lines.push("> verified productive energy surplus -> admissible proof -> SPK issuance -> circulation -> redemption accounting");
  lines.push("");
  lines.push("## Monetary Equations");
  lines.push("");
  lines.push("| Function | Equation |");
  lines.push("|---|---|");
  for (const [name, equation] of Object.entries(report.monetary_equations)) {
    lines.push(`| ${name} | \`${equation}\` |`);
  }
  lines.push("");
  lines.push("## Current Monetary State");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  for (const [key, value] of Object.entries(report.current_monetary_state)) {
    lines.push(`| ${key} | \`${value ?? "n/a"}\` |`);
  }
  lines.push("");
  lines.push("## Proof Issuance Math");
  lines.push("");
  lines.push("| Item | Value |");
  lines.push("|---|---:|");
  lines.push(`| Accepted on-chain surplus | \`${report.proof_issuance_math.surplus_kwh} kWh\` |`);
  lines.push(`| Energy basis | \`$${report.proof_issuance_math.energy_price_usd_per_kwh}/kWh\` |`);
  lines.push(`| Gross issuance | \`${report.proof_issuance_math.gross_issuance_spk} SPK\` |`);
  lines.push(`| Mint fee | \`${report.proof_issuance_math.mint_fee_bps} bps\` |`);
  lines.push(`| Net issuance by formula | \`${report.proof_issuance_math.net_issuance_spk} SPK\` |`);
  lines.push(`| Observed minted SPK | \`${report.proof_issuance_math.observed_minted_spk} SPK\` |`);
  lines.push(`| Formula match | \`${report.proof_issuance_math.observed_matches_formula}\` |`);
  lines.push("");
  lines.push("## Gold Standard Mapping");
  lines.push("");
  lines.push("| Gold standard | SolarPunk energy standard | Implementation | Remaining risk |");
  lines.push("|---|---|---|---|");
  for (const row of report.gold_standard_mapping) {
    lines.push(`| ${row.gold_standard} | ${row.energy_standard} | ${row.implementation} | ${row.remaining_risk} |`);
  }
  lines.push("");
  lines.push("## Capacity And Issuance Scenarios");
  lines.push("");
  lines.push("| Scenario | Capacity | Annual kWh | Net annual SPK | Mint fee SPK | Same-cost capex sensitivity | Simple payback |");
  lines.push("|---|---:|---:|---:|---:|---:|---:|");
  for (const scenario of report.capacity_scenarios) {
    lines.push(
      `| ${scenario.label} | ${format(scenario.capacity_kw, 0)} kW | ${format(scenario.annual_kwh, 2)} | ${format(scenario.net_issuance_spk, 2)} | ${format(scenario.mint_fee_spk, 2)} | ${formatUsd(scenario.same_cost_capex_usd, 0)} | ${format(scenario.simple_payback_years, 2)} years |`
    );
  }
  lines.push("");
  lines.push("The capex column deliberately uses the same cost assumption from the resource benchmark for sensitivity only. It is not a utility-scale quote.");
  lines.push("");
  lines.push("## Price Basis Sensitivity");
  lines.push("");
  lines.push("| Energy price basis | kWh per SPK | 10 kW annual net SPK | 10 kW mint fee SPK | Simple payback |");
  lines.push("|---:|---:|---:|---:|---:|");
  for (const row of report.price_basis_sensitivity) {
    lines.push(
      `| $${row.energy_price_usd_per_kwh}/kWh | ${format(row.kwh_per_spk, 2)} | ${format(row.annual_net_issuance_spk_10kw, 2)} | ${format(row.mint_fee_spk_10kw, 4)} | ${format(row.simple_payback_years_10kw_before_incentives, 2)} years |`
    );
  }
  lines.push("");
  lines.push("## Settlement Velocity");
  lines.push("");
  lines.push("| Scenario | 0.5x velocity | 1x velocity | 3x velocity | 10x velocity |");
  lines.push("|---|---:|---:|---:|---:|");
  for (const scenario of report.capacity_scenarios) {
    lines.push(
      `| ${scenario.label} | ${format(scenario.settlement_capacity_spk_by_velocity["0.5x"], 2)} | ${format(scenario.settlement_capacity_spk_by_velocity["1x"], 2)} | ${format(scenario.settlement_capacity_spk_by_velocity["3x"], 2)} | ${format(scenario.settlement_capacity_spk_by_velocity["10x"], 2)} |`
    );
  }
  lines.push("");
  lines.push("## Monetary Function Readiness");
  lines.push("");
  lines.push("| Function | Status | Evidence |");
  lines.push("|---|---|---|");
  for (const item of report.monetary_function_readiness) {
    lines.push(`| ${item.function} | \`${item.status}\` | ${item.evidence} |`);
  }
  lines.push("");
  lines.push("## Finance Risk Register");
  lines.push("");
  lines.push("| Risk | Meaning | Control |");
  lines.push("|---|---|---|");
  for (const item of report.finance_risk_register) {
    lines.push(`| ${item.risk} | ${item.meaning} | ${item.control} |`);
  }
  lines.push("");
  lines.push("## Hard Boundaries");
  lines.push("");
  for (const boundary of report.hard_boundaries) {
    lines.push(`- ${boundary}`);
  }
  lines.push("");
  lines.push("## Next Finance Build Targets");
  lines.push("");
  for (const target of report.next_finance_build_targets) {
    lines.push(`- ${target}`);
  }
  lines.push("");
  lines.push("## References");
  lines.push("");
  for (const reference of report.references) {
    lines.push(`- [${reference.name}](${reference.url}) - ${reference.relevance}`);
  }
  lines.push("");

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
}

function main() {
  const report = buildEnergyStandardEconomics();
  const jsonPath = path.join(ROOT, "state", "product", "energy_standard_economics.json");
  const csvPath = path.join(ROOT, "state", "product", "energy_standard_scenarios.csv");
  const mdPath = path.join(ROOT, "docs", "product", "ENERGY_STANDARD_ECONOMICS.md");
  writeJson(jsonPath, report);
  writeScenarioCsv(csvPath, report.capacity_scenarios);
  writeMarkdown(mdPath, report);
  console.log(`energy_price_usd_per_kwh=${report.current_monetary_state.energy_price_usd_per_kwh}`);
  console.log(`kwh_per_spk=${report.current_monetary_state.kwh_per_1_spk_at_current_basis}`);
  console.log(`proof_formula_match=${report.proof_issuance_math.observed_matches_formula}`);
  console.log(`scenarios=${report.capacity_scenarios.length}`);
  console.log(`wrote: ${jsonPath}`);
  console.log(`wrote: ${csvPath}`);
  console.log(`wrote: ${mdPath}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  buildEnergyStandardEconomics,
  buildScenario,
  calculateIssuance,
};
