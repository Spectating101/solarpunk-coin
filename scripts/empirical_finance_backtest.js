#!/usr/bin/env node

const fs = require("fs");
const https = require("https");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const DEFAULT_CONFIG = {
  location: {
    name: "Taoyuan, Taiwan",
    latitude: 24.99,
    longitude: 121.30,
  },
  nasa: {
    start: "20240101",
    end: null,
    parameters: ["ALLSKY_SFC_SW_DWN"],
    community: "RE",
  },
  solar: {
    system_kw_dc: 10,
    pvwatts_loss_pct: 14,
    installed_cost_usd_per_wdc: 3.15,
  },
  finance: {
    energy_price_usd_per_kwh: 0.05,
    retail_offset_usd_per_kwh: 0.12,
    export_credit_usd_per_kwh: 0.05,
    mint_fee_bps: 10,
    debt_share: 0.7,
    debt_interest_rate: 0.08,
    debt_tenor_years: 10,
  },
  archetypes: [
    {
      id: "rooftop_home_10kw",
      label: "10 kW solar home",
      capacity_kw: 10,
      self_consumption_fraction: 0.55,
      interpretation: "Home-scale system using most output onsite and exporting surplus.",
    },
    {
      id: "neighborhood_cluster_250kw",
      label: "250 kW neighborhood cluster",
      capacity_kw: 250,
      self_consumption_fraction: 0.65,
      interpretation: "Aggregated rooftops or campus-scale load with higher daytime self-use.",
    },
    {
      id: "commercial_portfolio_1mw",
      label: "1 MW commercial portfolio",
      capacity_kw: 1000,
      self_consumption_fraction: 0.75,
      interpretation: "Commercial operator portfolio with substantial onsite load.",
    },
  ],
};

function mergeConfig(overrides = {}) {
  return {
    ...DEFAULT_CONFIG,
    ...overrides,
    location: { ...DEFAULT_CONFIG.location, ...(overrides.location || {}) },
    nasa: { ...DEFAULT_CONFIG.nasa, ...(overrides.nasa || {}) },
    solar: { ...DEFAULT_CONFIG.solar, ...(overrides.solar || {}) },
    finance: { ...DEFAULT_CONFIG.finance, ...(overrides.finance || {}) },
    archetypes: overrides.archetypes || DEFAULT_CONFIG.archetypes,
  };
}

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

function sum(values) {
  return values.reduce((total, value) => total + Number(value || 0), 0);
}

function mean(values) {
  const valid = values.map(Number).filter(Number.isFinite);
  if (!valid.length) return null;
  return sum(valid) / valid.length;
}

function standardDeviation(values) {
  const avg = mean(values);
  if (!Number.isFinite(avg)) return null;
  const variance = mean(values.map((value) => (Number(value) - avg) ** 2));
  return Math.sqrt(variance);
}

function quantile(values, q) {
  const sorted = values.map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const position = (sorted.length - 1) * q;
  const base = Math.floor(position);
  const rest = position - base;
  if (sorted[base + 1] === undefined) return sorted[base];
  return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
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

function latestKeeperDate() {
  const keeper = readJson("state/keeper_logs/summary.json", {});
  const latest = keeper.last_successful_run || keeper.latest_run?.date;
  if (latest && /^\d{4}-\d{2}-\d{2}$/.test(latest)) return latest.replaceAll("-", "");
  const now = new Date();
  const yesterday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
  return yesterday.toISOString().slice(0, 10).replaceAll("-", "");
}

function buildNasaUrl(config) {
  const end = config.nasa.end || latestKeeperDate();
  return `https://power.larc.nasa.gov/api/temporal/daily/point` +
    `?parameters=${encodeURIComponent(config.nasa.parameters.join(","))}` +
    `&community=${config.nasa.community}` +
    `&longitude=${config.location.longitude}` +
    `&latitude=${config.location.latitude}` +
    `&start=${config.nasa.start}` +
    `&end=${end}` +
    `&format=JSON`;
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchJson(res.headers.location).then(resolve, reject);
        return;
      }
      let raw = "";
      res.on("data", (chunk) => {
        raw += chunk;
      });
      res.on("end", () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`HTTP ${res.statusCode}: ${raw.slice(0, 200)}`));
          return;
        }
        try {
          resolve(JSON.parse(raw));
        } catch (error) {
          reject(new Error(`JSON parse failed: ${error.message}`));
        }
      });
    });
    req.setTimeout(30_000, () => {
      req.destroy(new Error("NASA POWER request timed out"));
    });
    req.on("error", reject);
  });
}

function isValidPowerValue(value) {
  return Number.isFinite(Number(value)) && Number(value) > -900;
}

function isoDateFromNasaKey(key) {
  return `${key.slice(0, 4)}-${key.slice(4, 6)}-${key.slice(6, 8)}`;
}

function seriesFromNasa(nasaData, parameter = "ALLSKY_SFC_SW_DWN") {
  const raw = nasaData?.properties?.parameter?.[parameter] || {};
  return Object.entries(raw)
    .filter(([, value]) => isValidPowerValue(value))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date: isoDateFromNasaKey(date), ghi_kwh_m2_day: Number(value) }));
}

function monthKey(date) {
  return date.slice(0, 7);
}

function yearKey(date) {
  return date.slice(0, 4);
}

function daysInYear(year) {
  return Number(year) % 4 === 0 ? 366 : 365;
}

function annuityPayment(principal, annualRate, years) {
  if (!principal) return 0;
  if (!annualRate) return principal / years;
  return principal * (annualRate / (1 - (1 + annualRate) ** -years));
}

function rowForDay({ point, archetype, config }) {
  const performanceRatio = 1 - config.solar.pvwatts_loss_pct / 100;
  const generationKwh = point.ghi_kwh_m2_day * archetype.capacity_kw * performanceRatio;
  const selfConsumedKwh = generationKwh * archetype.self_consumption_fraction;
  const surplusKwh = Math.max(0, generationKwh - selfConsumedKwh);
  const grossSpk = surplusKwh * config.finance.energy_price_usd_per_kwh;
  const mintFeeSpk = grossSpk * (config.finance.mint_fee_bps / 10000);
  const netSpk = grossSpk - mintFeeSpk;
  const selfUseValueUsd = selfConsumedKwh * config.finance.retail_offset_usd_per_kwh;
  const exportValueUsd = surplusKwh * config.finance.export_credit_usd_per_kwh;

  return {
    site_id: archetype.id,
    date: point.date,
    ghi_kwh_m2_day: fixed(point.ghi_kwh_m2_day, 4),
    generation_kwh: fixed(generationKwh, 6),
    self_consumed_kwh: fixed(selfConsumedKwh, 6),
    surplus_kwh: fixed(surplusKwh, 6),
    net_spk_issued: fixed(netSpk, 6),
    energy_value_usd: fixed(selfUseValueUsd + exportValueUsd, 6),
    self_use_value_usd: fixed(selfUseValueUsd, 6),
    export_value_usd: fixed(exportValueUsd, 6),
  };
}

function aggregateRows(rows, keyFn) {
  const groups = new Map();
  for (const row of rows) {
    const key = keyFn(row.date);
    const current = groups.get(key) || [];
    current.push(row);
    groups.set(key, current);
  }
  return [...groups.entries()].map(([period, items]) => ({
    period,
    days: items.length,
    generation_kwh: fixed(sum(items.map((item) => item.generation_kwh)), 4),
    surplus_kwh: fixed(sum(items.map((item) => item.surplus_kwh)), 4),
    net_spk_issued: fixed(sum(items.map((item) => item.net_spk_issued)), 6),
    energy_value_usd: fixed(sum(items.map((item) => item.energy_value_usd)), 6),
  }));
}

function longestLowGenerationRun(rows, thresholdKwh) {
  let current = 0;
  let longest = 0;
  for (const row of rows) {
    if (Number(row.generation_kwh) < thresholdKwh) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
}

function buildArchetypeBacktest({ archetype, series, config }) {
  const dailyRows = series.map((point) => rowForDay({ point, archetype, config }));
  const monthlyRows = aggregateRows(dailyRows, monthKey);
  const annualRows = aggregateRows(dailyRows, yearKey).map((row) => ({
    ...row,
    annualized_generation_kwh: fixed((row.generation_kwh / row.days) * daysInYear(row.period), 4),
    annualized_energy_value_usd: fixed((row.energy_value_usd / row.days) * daysInYear(row.period), 6),
    annualized_net_spk_issued: fixed((row.net_spk_issued / row.days) * daysInYear(row.period), 6),
  }));
  const generationValues = dailyRows.map((row) => Number(row.generation_kwh));
  const monthlyValueUsd = monthlyRows.map((row) => Number(row.energy_value_usd));
  const monthlySpk = monthlyRows.map((row) => Number(row.net_spk_issued));
  const annualValueUsd = annualRows.map((row) => Number(row.annualized_energy_value_usd));
  const capexUsd = archetype.capacity_kw * 1000 * config.solar.installed_cost_usd_per_wdc;
  const debtPrincipalUsd = capexUsd * config.finance.debt_share;
  const annualDebtServiceUsd = annuityPayment(
    debtPrincipalUsd,
    config.finance.debt_interest_rate,
    config.finance.debt_tenor_years
  );
  const p50AnnualValueUsd = quantile(annualValueUsd, 0.5);
  const p10AnnualValueUsd = quantile(annualValueUsd, 0.1);
  const p50MonthlyValueUsd = quantile(monthlyValueUsd, 0.5);
  const p05MonthlyValueUsd = quantile(monthlyValueUsd, 0.05);
  const monthlyRevenueAtRiskUsd = Math.max(0, p50MonthlyValueUsd - p05MonthlyValueUsd);
  const p25DailyGeneration = quantile(generationValues, 0.25);

  return {
    id: archetype.id,
    label: archetype.label,
    interpretation: archetype.interpretation,
    capacity_kw: archetype.capacity_kw,
    self_consumption_fraction: archetype.self_consumption_fraction,
    observed_days: dailyRows.length,
    first_date: dailyRows[0]?.date || null,
    last_date: dailyRows[dailyRows.length - 1]?.date || null,
    daily_generation_distribution: {
      mean_kwh: fixed(mean(generationValues), 4),
      stddev_kwh: fixed(standardDeviation(generationValues), 4),
      coefficient_of_variation: fixed(standardDeviation(generationValues) / mean(generationValues), 6),
      p05_kwh: fixed(quantile(generationValues, 0.05), 4),
      p25_kwh: fixed(p25DailyGeneration, 4),
      p50_kwh: fixed(quantile(generationValues, 0.5), 4),
      p75_kwh: fixed(quantile(generationValues, 0.75), 4),
      p95_kwh: fixed(quantile(generationValues, 0.95), 4),
      longest_below_p25_run_days: longestLowGenerationRun(dailyRows, p25DailyGeneration),
    },
    monthly_distribution: {
      months: monthlyRows.length,
      p05_energy_value_usd: fixed(p05MonthlyValueUsd, 4),
      p50_energy_value_usd: fixed(p50MonthlyValueUsd, 4),
      p95_energy_value_usd: fixed(quantile(monthlyValueUsd, 0.95), 4),
      p05_net_spk_issued: fixed(quantile(monthlySpk, 0.05), 4),
      p50_net_spk_issued: fixed(quantile(monthlySpk, 0.5), 4),
      monthly_revenue_at_risk_usd_vs_p50: fixed(monthlyRevenueAtRiskUsd, 4),
    },
    annual_distribution: {
      years: annualRows.length,
      p10_energy_value_usd: fixed(p10AnnualValueUsd, 4),
      p50_energy_value_usd: fixed(p50AnnualValueUsd, 4),
      p90_energy_value_usd: fixed(quantile(annualValueUsd, 0.9), 4),
      p50_net_spk_issued: fixed(quantile(annualRows.map((row) => row.annualized_net_spk_issued), 0.5), 6),
    },
    capital_model: {
      capex_usd: fixed(capexUsd, 2),
      debt_principal_usd: fixed(debtPrincipalUsd, 2),
      annual_debt_service_usd: fixed(annualDebtServiceUsd, 2),
      p50_simple_payback_years: fixed(capexUsd / p50AnnualValueUsd, 2),
      p10_simple_payback_years: fixed(capexUsd / p10AnnualValueUsd, 2),
      p50_dscr: fixed(p50AnnualValueUsd / annualDebtServiceUsd, 4),
      p10_dscr: fixed(p10AnnualValueUsd / annualDebtServiceUsd, 4),
      monthly_reserve_target_usd: fixed(monthlyRevenueAtRiskUsd, 2),
    },
    monthly_rows: monthlyRows,
    annual_rows: annualRows,
    daily_rows: dailyRows,
  };
}

function buildEmpiricalFinanceBacktest(options = {}) {
  const config = mergeConfig(options.config || {});
  const nasaData = options.nasaData;
  const series = options.series || seriesFromNasa(nasaData, "ALLSKY_SFC_SW_DWN");
  if (!series.length) {
    throw new Error("No NASA POWER daily irradiance series available for empirical backtest");
  }
  const archetypes = config.archetypes.map((archetype) =>
    buildArchetypeBacktest({ archetype, series, config })
  );
  const primary = archetypes[0];
  const financeClaims = {
    empirical_days: series.length,
    first_date: series[0].date,
    last_date: series[series.length - 1].date,
    p50_rooftop_annual_value_usd: primary.annual_distribution.p50_energy_value_usd,
    p50_rooftop_dscr: primary.capital_model.p50_dscr,
    p10_rooftop_dscr: primary.capital_model.p10_dscr,
    rooftop_monthly_revenue_at_risk_usd: primary.monthly_distribution.monthly_revenue_at_risk_usd_vs_p50,
    empirical_status:
      primary.capital_model.p50_dscr >= 1
        ? "resource_finance_positive_under_assumptions"
        : "resource_real_but_finance_requires_better_tariff_capex_or_capital_structure",
  };

  return {
    generated_at: (options.now || new Date()).toISOString(),
    title: "SolarPunk Empirical Finance Backtest",
    thesis:
      "This backtest asks whether the energy-standard monetary mechanics survive contact with historical resource data and conventional project-finance ratios.",
    input_basis: {
      resource_source: "NASA POWER Daily API",
      resource_query_url: buildNasaUrl(config),
      resource_parameter: "ALLSKY_SFC_SW_DWN",
      location: config.location,
      start: config.nasa.start,
      end: config.nasa.end || latestKeeperDate(),
      observed_days: series.length,
      first_date: series[0].date,
      last_date: series[series.length - 1].date,
      solar_model: "daily_ac_kwh = GHI_kWh_m2_day * kWdc * (1 - PVWatts_loss_pct)",
      finance_assumptions: config.finance,
      capex_assumption_usd_per_wdc: config.solar.installed_cost_usd_per_wdc,
    },
    finance_claims: financeClaims,
    archetypes: archetypes.map(({ daily_rows, monthly_rows, annual_rows, ...summary }) => summary),
    monthly_rows: archetypes.flatMap((item) =>
      item.monthly_rows.map((row) => ({ site_id: item.id, ...row }))
    ),
    annual_rows: archetypes.flatMap((item) =>
      item.annual_rows.map((row) => ({ site_id: item.id, ...row }))
    ),
    hard_boundaries: [
      "NASA irradiance is real public resource data, not signed meter production.",
      "PV conversion, tariffs, export credit, debt terms, capex, and self-consumption are explicit assumptions.",
      "This improves empirical finance evidence but does not prove customer demand, legal redemption, or real revenue.",
      "SPK minting still requires accepted signed meter or inverter surplus attestations.",
    ],
  };
}

function writeMonthlyCsv(filePath, rows) {
  const headers = ["site_id", "period", "days", "generation_kwh", "surplus_kwh", "net_spk_issued", "energy_value_usd"];
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ];
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, csv.join("\n") + "\n", "utf-8");
}

function writeMarkdown(report) {
  const lines = [];
  lines.push("# SolarPunk Empirical Finance Backtest");
  lines.push("");
  lines.push(`- generated_at: \`${report.generated_at}\``);
  lines.push(`- thesis: ${report.thesis}`);
  lines.push("");
  lines.push("## Input Basis");
  lines.push("");
  lines.push("| Item | Value |");
  lines.push("|---|---|");
  lines.push(`| Resource source | ${report.input_basis.resource_source} |`);
  lines.push(`| Resource query | ${report.input_basis.resource_query_url} |`);
  lines.push(`| Location | ${report.input_basis.location.name} (${report.input_basis.location.latitude}, ${report.input_basis.location.longitude}) |`);
  lines.push(`| Window | ${report.input_basis.first_date} -> ${report.input_basis.last_date} |`);
  lines.push(`| Observed days | ${report.input_basis.observed_days} |`);
  lines.push(`| Solar model | \`${report.input_basis.solar_model}\` |`);
  lines.push(`| Energy basis | ${formatUsd(report.input_basis.finance_assumptions.energy_price_usd_per_kwh, 4)}/kWh |`);
  lines.push(`| Retail offset | ${formatUsd(report.input_basis.finance_assumptions.retail_offset_usd_per_kwh, 4)}/kWh |`);
  lines.push(`| Export credit | ${formatUsd(report.input_basis.finance_assumptions.export_credit_usd_per_kwh, 4)}/kWh |`);
  lines.push(`| Capex assumption | ${formatUsd(report.input_basis.capex_assumption_usd_per_wdc, 2)}/Wdc |`);
  lines.push("");
  lines.push("## Finance Claims");
  lines.push("");
  lines.push("| Claim | Value |");
  lines.push("|---|---:|");
  lines.push(`| Empirical days | ${format(report.finance_claims.empirical_days, 0)} |`);
  lines.push(`| Rooftop p50 annual energy value | ${formatUsd(report.finance_claims.p50_rooftop_annual_value_usd, 2)} |`);
  lines.push(`| Rooftop p50 DSCR | ${format(report.finance_claims.p50_rooftop_dscr, 4)}x |`);
  lines.push(`| Rooftop p10 DSCR | ${format(report.finance_claims.p10_rooftop_dscr, 4)}x |`);
  lines.push(`| Rooftop monthly revenue-at-risk vs p50 | ${formatUsd(report.finance_claims.rooftop_monthly_revenue_at_risk_usd, 2)} |`);
  lines.push(`| Empirical status | \`${report.finance_claims.empirical_status}\` |`);
  lines.push("");
  lines.push("## Result Meaning");
  lines.push("");
  if (report.finance_claims.empirical_status === "resource_finance_positive_under_assumptions") {
    lines.push("The historical resource series clears the current project-finance hurdle under the stated tariff, capex, debt, and self-consumption assumptions.");
  } else {
    lines.push("The historical resource series supports the physical energy model, but the stated tariff, capex, debt, and self-consumption assumptions do not yet clear conventional project-finance thresholds.");
    lines.push("The product implication is direct: paid launch needs at least one of better tariff/PPA economics, lower installed cost, subsidy/incentive capture, more favorable capital structure, or a non-energy-value revenue layer.");
  }
  lines.push("");
  lines.push("## Archetype Backtest");
  lines.push("");
  lines.push("| Archetype | P50 annual value | P10 annual value | P50 DSCR | P10 DSCR | P50 payback | Monthly reserve target | Daily CV | Longest below-P25 run |");
  lines.push("|---|---:|---:|---:|---:|---:|---:|---:|---:|");
  for (const item of report.archetypes) {
    lines.push(
      `| ${item.label} | ${formatUsd(item.annual_distribution.p50_energy_value_usd, 2)} | ${formatUsd(item.annual_distribution.p10_energy_value_usd, 2)} | ${format(item.capital_model.p50_dscr, 4)}x | ${format(item.capital_model.p10_dscr, 4)}x | ${format(item.capital_model.p50_simple_payback_years, 2)}y | ${formatUsd(item.capital_model.monthly_reserve_target_usd, 2)} | ${format(item.daily_generation_distribution.coefficient_of_variation, 4)} | ${format(item.daily_generation_distribution.longest_below_p25_run_days, 0)}d |`
    );
  }
  lines.push("");
  lines.push("## Hard Boundaries");
  lines.push("");
  for (const boundary of report.hard_boundaries) {
    lines.push(`- ${boundary}`);
  }
  lines.push("");
  lines.push("## Reproduce");
  lines.push("");
  lines.push("```bash");
  lines.push("npm run product:empirical-backtest");
  lines.push("npm run product:empirical-backtest:test");
  lines.push("```");
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const config = mergeConfig({
    nasa: {
      end: process.env.EMPIRICAL_BACKTEST_END || null,
      start: process.env.EMPIRICAL_BACKTEST_START || DEFAULT_CONFIG.nasa.start,
    },
  });
  const url = buildNasaUrl(config);
  const nasaData = await fetchJson(url);
  const report = buildEmpiricalFinanceBacktest({ config, nasaData });
  const jsonPath = path.join(ROOT, "state", "product", "empirical_finance_backtest.json");
  const csvPath = path.join(ROOT, "state", "product", "empirical_finance_backtest_monthly.csv");
  const mdPath = path.join(ROOT, "docs", "product", "EMPIRICAL_FINANCE_BACKTEST.md");
  writeJson(jsonPath, report);
  writeMonthlyCsv(csvPath, report.monthly_rows);
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, writeMarkdown(report), "utf-8");
  console.log(`observed_days=${report.finance_claims.empirical_days}`);
  console.log(`window=${report.finance_claims.first_date}..${report.finance_claims.last_date}`);
  console.log(`p50_rooftop_dscr=${report.finance_claims.p50_rooftop_dscr}`);
  console.log(`empirical_status=${report.finance_claims.empirical_status}`);
  console.log(`wrote: ${jsonPath}`);
  console.log(`wrote: ${csvPath}`);
  console.log(`wrote: ${mdPath}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  buildEmpiricalFinanceBacktest,
  buildArchetypeBacktest,
  seriesFromNasa,
};
