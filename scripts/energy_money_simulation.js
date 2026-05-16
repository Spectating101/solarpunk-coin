const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const DEFAULT_CONFIG = {
  mintFeeBps: 10,
  redemptionFeeBps: 10,
  settlementFeeBps: 0,
  daysPerYear: 365,
  archetypes: [
    {
      id: "rooftop_home_10kw",
      label: "10 kW solar home",
      capacity_kw: 10,
      self_consumption_fraction: 0.55,
      redemption_fraction: 0.35,
      settlement_velocity: 1.5,
      delivery_shortfall_fraction: 0.01,
      operator_reserve_usd: 5,
      interpretation: "Home-scale generator using most production locally and exporting the remaining surplus.",
    },
    {
      id: "neighborhood_cluster_250kw",
      label: "250 kW neighborhood cluster",
      capacity_kw: 250,
      self_consumption_fraction: 0.65,
      redemption_fraction: 0.5,
      settlement_velocity: 2.5,
      delivery_shortfall_fraction: 0.03,
      operator_reserve_usd: 500,
      interpretation: "Bundled homes, shops, or campus roofs with higher internal daytime load.",
    },
    {
      id: "commercial_portfolio_1mw",
      label: "1 MW commercial portfolio",
      capacity_kw: 1000,
      self_consumption_fraction: 0.75,
      redemption_fraction: 0.45,
      settlement_velocity: 3,
      delivery_shortfall_fraction: 0.05,
      operator_reserve_usd: 5000,
      interpretation: "Warehouse, school, factory, or small operator portfolio with material onsite load.",
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

function writeDailyCsv(filePath, rows) {
  const headers = [
    "site_id",
    "date",
    "normalised_resource_index",
    "generation_kwh",
    "eligible_surplus_kwh",
    "net_minted_spk",
    "settlement_volume_spk",
    "redeemed_spk",
    "owed_kwh",
    "shortfall_kwh",
  ];
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ];
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, lines.join("\n") + "\n", "utf-8");
}

function observedResourceSeries(keeperSummary, resourceBenchmark) {
  const recentRuns = keeperSummary.recent_runs || [];
  if (recentRuns.length) {
    return recentRuns.map((run) => ({
      date: run.date,
      normalised_resource_index: Number(run.normalised_index),
      source: "state/keeper_logs/summary.json:recent_runs",
    }));
  }

  return [
    {
      date: resourceBenchmark.solar?.nasa_window?.latest_date || "2026-05-11",
      normalised_resource_index: 1,
      source: "state/product/resource_benchmark_lab.json:latest_day_fallback",
    },
  ];
}

function sum(rows, field) {
  return rows.reduce((total, row) => total + Number(row[field] || 0), 0);
}

function simulateDay({ archetype, point, baseDailyKwh10kw, baseCapacityKw, energyPrice, mintFeeBps, redemptionFeeBps, settlementFeeBps }) {
  const scale = Number(archetype.capacity_kw) / baseCapacityKw;
  const resourceIndex = Math.max(Number(point.normalised_resource_index), 0);
  const generationKwh = baseDailyKwh10kw * scale * resourceIndex;
  const selfConsumedKwh = generationKwh * archetype.self_consumption_fraction;
  const eligibleSurplusKwh = Math.max(generationKwh - selfConsumedKwh, 0);
  const grossSpk = eligibleSurplusKwh * energyPrice;
  const mintFeeSpk = grossSpk * (mintFeeBps / 10_000);
  const netMintedSpk = grossSpk - mintFeeSpk;
  const settlementVolumeSpk = netMintedSpk * archetype.settlement_velocity;
  const redeemedSpk = netMintedSpk * archetype.redemption_fraction;
  const redemptionFeeSpk = redeemedSpk * (redemptionFeeBps / 10_000);
  const settlementFeeSpk = settlementVolumeSpk * (settlementFeeBps / 10_000);
  const owedKwh = redeemedSpk / energyPrice;
  const shortfallKwh = owedKwh * archetype.delivery_shortfall_fraction;
  const deliveredKwh = owedKwh - shortfallKwh;
  const shortfallLiabilityUsd = shortfallKwh * energyPrice;
  const feeBufferUsd = mintFeeSpk + redemptionFeeSpk + settlementFeeSpk;
  const additionalReserveRequiredUsd = Math.max(shortfallLiabilityUsd - feeBufferUsd - archetype.operator_reserve_usd, 0);

  return {
    site_id: archetype.id,
    date: point.date,
    normalised_resource_index: fixed(resourceIndex, 6),
    generation_kwh: fixed(generationKwh, 6),
    self_consumed_kwh: fixed(selfConsumedKwh, 6),
    eligible_surplus_kwh: fixed(eligibleSurplusKwh, 6),
    gross_spk: fixed(grossSpk, 6),
    mint_fee_spk: fixed(mintFeeSpk, 6),
    net_minted_spk: fixed(netMintedSpk, 6),
    settlement_volume_spk: fixed(settlementVolumeSpk, 6),
    redeemed_spk: fixed(redeemedSpk, 6),
    redemption_fee_spk: fixed(redemptionFeeSpk, 6),
    settlement_fee_spk: fixed(settlementFeeSpk, 6),
    owed_kwh: fixed(owedKwh, 6),
    delivered_kwh: fixed(deliveredKwh, 6),
    shortfall_kwh: fixed(shortfallKwh, 6),
    shortfall_liability_usd: fixed(shortfallLiabilityUsd, 6),
    fee_buffer_usd: fixed(feeBufferUsd, 6),
    additional_reserve_required_usd: fixed(additionalReserveRequiredUsd, 6),
  };
}

function aggregateArchetype(archetype, dailyRows, annualizationFactor) {
  const issuedSpk = sum(dailyRows, "net_minted_spk");
  const redeemedSpk = sum(dailyRows, "redeemed_spk");
  const activeSupplySpk = issuedSpk - redeemedSpk;
  const shortfallLiabilityUsd = sum(dailyRows, "shortfall_liability_usd");
  const feeBufferUsd = sum(dailyRows, "fee_buffer_usd");
  const additionalReserveRequiredUsd = Math.max(shortfallLiabilityUsd - feeBufferUsd - archetype.operator_reserve_usd, 0);

  return {
    id: archetype.id,
    label: archetype.label,
    capacity_kw: archetype.capacity_kw,
    interpretation: archetype.interpretation,
    assumptions: {
      self_consumption_fraction: archetype.self_consumption_fraction,
      redemption_fraction: archetype.redemption_fraction,
      settlement_velocity: archetype.settlement_velocity,
      delivery_shortfall_fraction: archetype.delivery_shortfall_fraction,
      operator_reserve_usd: archetype.operator_reserve_usd,
    },
    observed_window: {
      days: dailyRows.length,
      generation_kwh: fixed(sum(dailyRows, "generation_kwh"), 4),
      eligible_surplus_kwh: fixed(sum(dailyRows, "eligible_surplus_kwh"), 4),
      issued_spk: fixed(issuedSpk, 6),
      settlement_volume_spk: fixed(sum(dailyRows, "settlement_volume_spk"), 6),
      redeemed_spk: fixed(redeemedSpk, 6),
      active_supply_spk: fixed(activeSupplySpk, 6),
      owed_kwh: fixed(sum(dailyRows, "owed_kwh"), 4),
      delivered_kwh: fixed(sum(dailyRows, "delivered_kwh"), 4),
      shortfall_kwh: fixed(sum(dailyRows, "shortfall_kwh"), 4),
      shortfall_liability_usd: fixed(shortfallLiabilityUsd, 6),
      fee_buffer_usd: fixed(feeBufferUsd, 6),
      additional_reserve_required_usd: fixed(additionalReserveRequiredUsd, 6),
      conservation_pass: fixed(issuedSpk, 6) === fixed(activeSupplySpk + redeemedSpk, 6),
    },
    annualized_projection: {
      generation_kwh: fixed(sum(dailyRows, "generation_kwh") * annualizationFactor, 2),
      eligible_surplus_kwh: fixed(sum(dailyRows, "eligible_surplus_kwh") * annualizationFactor, 2),
      issued_spk: fixed(issuedSpk * annualizationFactor, 6),
      settlement_volume_spk: fixed(sum(dailyRows, "settlement_volume_spk") * annualizationFactor, 6),
      redeemed_spk: fixed(redeemedSpk * annualizationFactor, 6),
      shortfall_liability_usd: fixed(shortfallLiabilityUsd * annualizationFactor, 6),
      additional_reserve_required_usd: fixed(additionalReserveRequiredUsd * annualizationFactor, 6),
    },
  };
}

function buildEnergyMoneySimulation(options = {}) {
  const resourceBenchmark = options.resourceBenchmark || readJson("state/product/resource_benchmark_lab.json");
  const energyStandard = options.energyStandard || readJson("state/product/energy_standard_economics.json");
  const keeperSummary = options.keeperSummary || readJson("state/keeper_logs/summary.json");
  const config = {
    ...DEFAULT_CONFIG,
    ...(options.config || {}),
    archetypes: options.config?.archetypes || DEFAULT_CONFIG.archetypes,
  };
  const resourceSeries = options.resourceSeries || observedResourceSeries(keeperSummary, resourceBenchmark);
  const baseDailyKwh10kw = Number(resourceBenchmark.solar?.production_estimate?.average_window_day_ac_kwh || 0);
  const baseCapacityKw = Number(resourceBenchmark.solar?.standard_system?.system_kw_dc || 10);
  const energyPrice = Number(
    options.energyPriceUsdPerKwh ||
      energyStandard.current_monetary_state?.energy_price_usd_per_kwh ||
      DEFAULT_CONFIG.energyPriceUsdPerKwh ||
      0.05
  );
  const annualizationFactor = config.daysPerYear / resourceSeries.length;
  const dailyRows = [];
  const archetypes = config.archetypes.map((archetype) => {
    const rows = resourceSeries.map((point) =>
      simulateDay({
        archetype,
        point,
        baseDailyKwh10kw,
        baseCapacityKw,
        energyPrice,
        mintFeeBps: config.mintFeeBps,
        redemptionFeeBps: config.redemptionFeeBps,
        settlementFeeBps: config.settlementFeeBps,
      })
    );
    dailyRows.push(...rows);
    return aggregateArchetype(archetype, rows, annualizationFactor);
  });
  const totals = {
    observed_window_days: resourceSeries.length,
    generation_kwh: fixed(sum(dailyRows, "generation_kwh"), 4),
    eligible_surplus_kwh: fixed(sum(dailyRows, "eligible_surplus_kwh"), 4),
    issued_spk: fixed(sum(dailyRows, "net_minted_spk"), 6),
    settlement_volume_spk: fixed(sum(dailyRows, "settlement_volume_spk"), 6),
    redeemed_spk: fixed(sum(dailyRows, "redeemed_spk"), 6),
    owed_kwh: fixed(sum(dailyRows, "owed_kwh"), 4),
    delivered_kwh: fixed(sum(dailyRows, "delivered_kwh"), 4),
    shortfall_kwh: fixed(sum(dailyRows, "shortfall_kwh"), 4),
    additional_reserve_required_usd: fixed(
      archetypes.reduce((total, item) => total + Number(item.observed_window.additional_reserve_required_usd || 0), 0),
      6
    ),
  };
  totals.active_supply_spk = fixed(totals.issued_spk - totals.redeemed_spk, 6);
  totals.conservation_pass = fixed(totals.issued_spk, 6) === fixed(totals.active_supply_spk + totals.redeemed_spk, 6);

  const annualizedTotals = {
    generation_kwh: fixed(totals.generation_kwh * annualizationFactor, 2),
    eligible_surplus_kwh: fixed(totals.eligible_surplus_kwh * annualizationFactor, 2),
    issued_spk: fixed(totals.issued_spk * annualizationFactor, 6),
    settlement_volume_spk: fixed(totals.settlement_volume_spk * annualizationFactor, 6),
    redeemed_spk: fixed(totals.redeemed_spk * annualizationFactor, 6),
    active_supply_spk: fixed(totals.active_supply_spk * annualizationFactor, 6),
    additional_reserve_required_usd: fixed(totals.additional_reserve_required_usd * annualizationFactor, 6),
  };

  return {
    generated_at: (options.now || new Date()).toISOString(),
    title: "SolarPunk Energy-Money Simulation",
    framing:
      "This is the currency-system model: measured renewable resource -> explicit surplus assumptions -> SPK issuance -> settlement velocity -> redemption claims -> delivery shortfall reserves.",
    value_proposition:
      "SolarPunk is not merely a pilot proof machine. The product claim is an energy-standard monetary framework whose supply expansion is tied to measured productive energy and whose redemption risk is visible before launch.",
    input_basis: {
      resource_signal: "state/keeper_logs/summary.json recent Sepolia keeper runs",
      resource_signal_type: "real NASA POWER-derived daily solar index already written through the public lab keeper",
      base_production_model: "state/product/resource_benchmark_lab.json 10 kWdc PV conversion",
      energy_price_usd_per_kwh: energyPrice,
      mint_fee_bps: config.mintFeeBps,
      redemption_fee_bps: config.redemptionFeeBps,
      settlement_fee_bps: config.settlementFeeBps,
      observed_days: resourceSeries.length,
      first_observed_date: resourceSeries[0]?.date || null,
      last_observed_date: resourceSeries[resourceSeries.length - 1]?.date || null,
      annualization_factor: fixed(annualizationFactor, 6),
    },
    archetypes,
    totals,
    annualized_totals: annualizedTotals,
    daily_rows: dailyRows,
    hard_boundaries: [
      "This is a transparent simulation, not a claim of current real users or revenue.",
      "NASA/keeper resource signals are real; self-consumption, redemption, velocity, and shortfall values are explicit assumptions.",
      "Model-estimated surplus cannot mint SPK unless replaced by accepted signed meter or inverter attestations.",
      "The simulation strengthens the currency-framework argument; it does not remove the need for a real pilot, audit, or legal redemption terms.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# SolarPunk Energy-Money Simulation");
  lines.push("");
  lines.push(`- generated_at: \`${report.generated_at}\``);
  lines.push(`- framing: ${report.framing}`);
  lines.push(`- value_proposition: ${report.value_proposition}`);
  lines.push("");
  lines.push("## Input Basis");
  lines.push("");
  lines.push("| Item | Value |");
  lines.push("|---|---|");
  for (const [name, value] of Object.entries(report.input_basis)) {
    lines.push(`| ${name} | \`${value}\` |`);
  }
  lines.push("");
  lines.push("## Archetype Results");
  lines.push("");
  lines.push("| Archetype | Capacity | Self-use | Redeem | Shortfall | Reserve | Window SPK | Annualized SPK | Annualized shortfall liability | Annualized reserve gap |");
  lines.push("|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
  for (const item of report.archetypes) {
    lines.push(
      `| ${item.label} | ${format(item.capacity_kw, 0)} kW | ${format(item.assumptions.self_consumption_fraction * 100, 0)}% | ${format(item.assumptions.redemption_fraction * 100, 0)}% | ${format(item.assumptions.delivery_shortfall_fraction * 100, 0)}% | ${formatUsd(item.assumptions.operator_reserve_usd, 0)} | ${format(item.observed_window.issued_spk, 4)} | ${format(item.annualized_projection.issued_spk, 2)} | ${formatUsd(item.annualized_projection.shortfall_liability_usd, 2)} | ${formatUsd(item.annualized_projection.additional_reserve_required_usd, 2)} |`
    );
  }
  lines.push("");
  lines.push("## Network Totals");
  lines.push("");
  lines.push("| Metric | Observed Window | Annualized Projection |");
  lines.push("|---|---:|---:|");
  lines.push(`| Eligible surplus | ${format(report.totals.eligible_surplus_kwh, 2)} kWh | ${format(report.annualized_totals.eligible_surplus_kwh, 2)} kWh |`);
  lines.push(`| SPK issued | ${format(report.totals.issued_spk, 4)} | ${format(report.annualized_totals.issued_spk, 2)} |`);
  lines.push(`| Settlement volume | ${format(report.totals.settlement_volume_spk, 4)} | ${format(report.annualized_totals.settlement_volume_spk, 2)} |`);
  lines.push(`| Redeemed SPK | ${format(report.totals.redeemed_spk, 4)} | ${format(report.annualized_totals.redeemed_spk, 2)} |`);
  lines.push(`| Active supply | ${format(report.totals.active_supply_spk, 4)} | ${format(report.annualized_totals.active_supply_spk, 2)} |`);
  lines.push(`| Additional reserve gap | ${formatUsd(report.totals.additional_reserve_required_usd, 2)} | ${formatUsd(report.annualized_totals.additional_reserve_required_usd, 2)} |`);
  lines.push(`| Conservation check | \`${report.totals.conservation_pass}\` | \`${report.totals.conservation_pass}\` |`);
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
  const report = buildEnergyMoneySimulation();
  const jsonPath = path.join(ROOT, "state", "product", "energy_money_simulation.json");
  const csvPath = path.join(ROOT, "state", "product", "energy_money_simulation_daily.csv");
  const mdPath = path.join(ROOT, "docs", "product", "ENERGY_MONEY_SIMULATION.md");
  writeJson(jsonPath, report);
  writeDailyCsv(csvPath, report.daily_rows);
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, toMarkdown(report), "utf-8");
  console.log(`observed_days=${report.totals.observed_window_days}`);
  console.log(`issued_spk=${report.totals.issued_spk}`);
  console.log(`annualized_issued_spk=${report.annualized_totals.issued_spk}`);
  console.log(`conservation_pass=${report.totals.conservation_pass}`);
  console.log(`wrote: ${jsonPath}`);
  console.log(`wrote: ${csvPath}`);
  console.log(`wrote: ${mdPath}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  buildEnergyMoneySimulation,
  observedResourceSeries,
  simulateDay,
};
