#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const DEFAULT_CONFIG = {
  targetP50Dscr: 1.2,
  targetP10Dscr: 1.0,
  targetMaxSimplePaybackYears: 15,
  minEmpiricalDays: 365,
  valueMultipliers: [1, 1.5, 2, 2.5, 3, 3.5, 4, 5],
  capexReductionFractions: [0, 0.15, 0.3, 0.45, 0.6],
  debtShares: [0.7, 0.5, 0.3],
  debtInterestRates: [0.08, 0.06, 0.04],
  debtTenorYears: 10,
};

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
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

function quantile(values, q) {
  const sorted = values.map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const position = (sorted.length - 1) * q;
  const base = Math.floor(position);
  const rest = position - base;
  if (sorted[base + 1] === undefined) return sorted[base];
  return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
}

function annuityFactor(annualRate, years) {
  if (!annualRate) return 1 / years;
  return annualRate / (1 - (1 + annualRate) ** -years);
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

function writeCsv(filePath, rows, headers) {
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ];
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, csv.join("\n") + "\n", "utf-8");
}

function annualRowsFor(empiricalBacktest, siteId) {
  return empiricalBacktest.annual_rows.filter((row) => row.site_id === siteId);
}

function monthlyRowsFor(empiricalBacktest, siteId) {
  return empiricalBacktest.monthly_rows.filter((row) => row.site_id === siteId);
}

function annualDistribution(rows, field) {
  const values = rows.map((row) => Number(row[field])).filter(Number.isFinite);
  return {
    p10: quantile(values, 0.1),
    p50: quantile(values, 0.5),
    p90: quantile(values, 0.9),
  };
}

function buildThresholdRow({ archetype, annualRows, monthlyRows, empiricalBacktest, config }) {
  const finance = empiricalBacktest.input_basis.finance_assumptions;
  const debtShare = Number(finance.debt_share);
  const debtInterestRate = Number(finance.debt_interest_rate);
  const debtTenorYears = Number(finance.debt_tenor_years);
  const capexUsdPerWdc = Number(empiricalBacktest.input_basis.capex_assumption_usd_per_wdc);
  const capacityWdc = Number(archetype.capacity_kw) * 1000;
  const annualDebtServiceUsd = Number(archetype.capital_model.annual_debt_service_usd);
  const p50EnergyValueUsd = Number(archetype.annual_distribution.p50_energy_value_usd);
  const p10EnergyValueUsd = Number(archetype.annual_distribution.p10_energy_value_usd);
  const generation = annualDistribution(annualRows, "annualized_generation_kwh");
  const surplus = annualDistribution(annualRows, "surplus_kwh");
  const monthlyValueP05 = quantile(monthlyRows.map((row) => row.energy_value_usd), 0.05);
  const monthlyValueP50 = quantile(monthlyRows.map((row) => row.energy_value_usd), 0.5);
  const debtServicePerCapexUsd = debtShare * annuityFactor(debtInterestRate, debtTenorYears);

  const requiredP50AnnualValueUsd = annualDebtServiceUsd * Number(config.targetP50Dscr);
  const requiredP10AnnualValueUsd = annualDebtServiceUsd * Number(config.targetP10Dscr);
  const requiredAnnualValueUsd = Math.max(requiredP50AnnualValueUsd, requiredP10AnnualValueUsd);
  const requiredP50ValueMultiplier = requiredP50AnnualValueUsd / p50EnergyValueUsd;
  const requiredP10ValueMultiplier = requiredP10AnnualValueUsd / p10EnergyValueUsd;
  const requiredValueMultiplier = Math.max(requiredP50ValueMultiplier, requiredP10ValueMultiplier);
  const currentP50RealizedValueUsdPerKwh = p50EnergyValueUsd / generation.p50;
  const currentP10RealizedValueUsdPerKwh = p10EnergyValueUsd / generation.p10;
  const requiredP50RealizedValueUsdPerKwh = requiredP50AnnualValueUsd / generation.p50;
  const requiredP10RealizedValueUsdPerKwh = requiredP10AnnualValueUsd / generation.p10;
  const requiredRealizedValueUsdPerKwh = Math.max(
    requiredP50RealizedValueUsdPerKwh,
    requiredP10RealizedValueUsdPerKwh
  );
  const maxCapexP50DscrUsdPerWdc =
    p50EnergyValueUsd / (Number(config.targetP50Dscr) * debtServicePerCapexUsd * capacityWdc);
  const maxCapexP10DscrUsdPerWdc =
    p10EnergyValueUsd / (Number(config.targetP10Dscr) * debtServicePerCapexUsd * capacityWdc);
  const maxCapexPaybackUsdPerWdc =
    (p50EnergyValueUsd * Number(config.targetMaxSimplePaybackYears)) / capacityWdc;
  const maxLaunchCapexUsdPerWdc = Math.min(
    maxCapexP50DscrUsdPerWdc,
    maxCapexP10DscrUsdPerWdc,
    maxCapexPaybackUsdPerWdc
  );
  const currentCapexUsd = Number(archetype.capital_model.capex_usd);
  const maxLaunchCapexUsd = maxLaunchCapexUsdPerWdc * capacityWdc;
  const capitalSupportRequiredUsd = Math.max(0, currentCapexUsd - maxLaunchCapexUsd);
  const annualSupportRequiredUsd = Math.max(
    0,
    requiredP50AnnualValueUsd - p50EnergyValueUsd,
    requiredP10AnnualValueUsd - p10EnergyValueUsd
  );
  const p50Dscr = Number(archetype.capital_model.p50_dscr);
  const p10Dscr = Number(archetype.capital_model.p10_dscr);
  const p50PaybackYears = Number(archetype.capital_model.p50_simple_payback_years);
  const currentLaunchPass =
    p50Dscr >= Number(config.targetP50Dscr) &&
    p10Dscr >= Number(config.targetP10Dscr) &&
    p50PaybackYears <= Number(config.targetMaxSimplePaybackYears);

  return {
    id: archetype.id,
    label: archetype.label,
    capacity_kw: archetype.capacity_kw,
    observed_days: archetype.observed_days,
    current_capex_usd_per_wdc: fixed(capexUsdPerWdc, 4),
    p50_annual_generation_kwh: fixed(generation.p50, 4),
    p10_annual_generation_kwh: fixed(generation.p10, 4),
    p50_annual_surplus_kwh: fixed(surplus.p50, 4),
    p50_annual_energy_value_usd: fixed(p50EnergyValueUsd, 4),
    p10_annual_energy_value_usd: fixed(p10EnergyValueUsd, 4),
    monthly_p05_energy_value_usd: fixed(monthlyValueP05, 4),
    monthly_p50_energy_value_usd: fixed(monthlyValueP50, 4),
    monthly_revenue_at_risk_usd: fixed(Math.max(0, monthlyValueP50 - monthlyValueP05), 4),
    annual_debt_service_usd: fixed(annualDebtServiceUsd, 2),
    current_p50_dscr: fixed(p50Dscr, 4),
    current_p10_dscr: fixed(p10Dscr, 4),
    current_p50_payback_years: fixed(p50PaybackYears, 2),
    target_p50_dscr: Number(config.targetP50Dscr),
    target_p10_dscr: Number(config.targetP10Dscr),
    target_max_payback_years: Number(config.targetMaxSimplePaybackYears),
    required_p50_annual_value_usd: fixed(requiredP50AnnualValueUsd, 2),
    required_p10_annual_value_usd: fixed(requiredP10AnnualValueUsd, 2),
    required_annual_value_usd: fixed(requiredAnnualValueUsd, 2),
    annual_support_required_usd: fixed(annualSupportRequiredUsd, 2),
    annual_support_required_usd_per_kw: fixed(annualSupportRequiredUsd / Number(archetype.capacity_kw), 2),
    current_p50_realized_value_usd_per_kwh: fixed(currentP50RealizedValueUsdPerKwh, 6),
    current_p10_realized_value_usd_per_kwh: fixed(currentP10RealizedValueUsdPerKwh, 6),
    required_realized_value_usd_per_kwh: fixed(requiredRealizedValueUsdPerKwh, 6),
    required_value_multiplier: fixed(requiredValueMultiplier, 4),
    max_launch_capex_usd_per_wdc: fixed(maxLaunchCapexUsdPerWdc, 4),
    capex_reduction_required_pct: fixed(Math.max(0, 1 - maxLaunchCapexUsdPerWdc / capexUsdPerWdc) * 100, 2),
    capital_support_required_usd: fixed(capitalSupportRequiredUsd, 2),
    capital_support_required_usd_per_kw: fixed(capitalSupportRequiredUsd / Number(archetype.capacity_kw), 2),
    current_launch_pass: currentLaunchPass,
    finance_gap_status: currentLaunchPass
      ? "passes_launch_economics_targets"
      : "needs_anchor_tariff_ppa_capex_reduction_or_support_capital",
  };
}

function buildSensitivityRows({ thresholdRows, config }) {
  const rows = [];
  for (const base of thresholdRows) {
    for (const valueMultiplier of config.valueMultipliers) {
      for (const capexReductionFraction of config.capexReductionFractions) {
        for (const debtShare of config.debtShares) {
          for (const debtInterestRate of config.debtInterestRates) {
            const debtServicePerCapexUsd = debtShare * annuityFactor(debtInterestRate, config.debtTenorYears);
            const currentCapexUsd =
              Number(base.capacity_kw) * 1000 * Number(base.current_capex_usd_per_wdc);
            const adjustedCapexUsd = currentCapexUsd * (1 - capexReductionFraction);
            const adjustedDebtServiceUsd = adjustedCapexUsd * debtServicePerCapexUsd;
            const adjustedP50ValueUsd = Number(base.p50_annual_energy_value_usd) * valueMultiplier;
            const adjustedP10ValueUsd = Number(base.p10_annual_energy_value_usd) * valueMultiplier;
            const p50Dscr = adjustedDebtServiceUsd === 0 ? null : adjustedP50ValueUsd / adjustedDebtServiceUsd;
            const p10Dscr = adjustedDebtServiceUsd === 0 ? null : adjustedP10ValueUsd / adjustedDebtServiceUsd;
            const paybackYears = adjustedP50ValueUsd === 0 ? null : adjustedCapexUsd / adjustedP50ValueUsd;
            const launchReady =
              Number(p50Dscr) >= Number(config.targetP50Dscr) &&
              Number(p10Dscr) >= Number(config.targetP10Dscr) &&
              Number(paybackYears) <= Number(config.targetMaxSimplePaybackYears);
            const interventionScore =
              (valueMultiplier - 1) +
              capexReductionFraction * 2 +
              (0.7 - debtShare) * 0.75 +
              (0.08 - debtInterestRate) * 5;

            rows.push({
              site_id: base.id,
              label: base.label,
              value_multiplier: valueMultiplier,
              capex_reduction_pct: fixed(capexReductionFraction * 100, 2),
              debt_share: debtShare,
              debt_interest_rate: debtInterestRate,
              debt_tenor_years: config.debtTenorYears,
              adjusted_capex_usd: fixed(adjustedCapexUsd, 2),
              adjusted_annual_debt_service_usd: fixed(adjustedDebtServiceUsd, 2),
              adjusted_p50_value_usd: fixed(adjustedP50ValueUsd, 2),
              adjusted_p10_value_usd: fixed(adjustedP10ValueUsd, 2),
              p50_dscr: fixed(p50Dscr, 4),
              p10_dscr: fixed(p10Dscr, 4),
              p50_payback_years: fixed(paybackYears, 2),
              launch_ready: launchReady,
              intervention_score: fixed(interventionScore, 4),
            });
          }
        }
      }
    }
  }
  return rows;
}

function minimumViableScenarios(rows) {
  return rows
    .filter((row) => row.launch_ready)
    .sort((a, b) => {
      if (a.intervention_score !== b.intervention_score) {
        return Number(a.intervention_score) - Number(b.intervention_score);
      }
      if (a.value_multiplier !== b.value_multiplier) return Number(a.value_multiplier) - Number(b.value_multiplier);
      return Number(a.capex_reduction_pct) - Number(b.capex_reduction_pct);
    })
    .slice(0, 12);
}

function buildEconomicLaunchReadiness(options = {}) {
  const config = { ...DEFAULT_CONFIG, ...(options.config || {}) };
  const empiricalBacktest = options.empiricalBacktest || readJson("state/product/empirical_finance_backtest.json");
  const financeDossier = options.financeDossier || readJson("state/product/spk_finance_dossier.json");
  const launchGate = options.launchGate || readJson("state/product/launch_gate.json");
  const thresholdRows = empiricalBacktest.archetypes.map((archetype) =>
    buildThresholdRow({
      archetype,
      annualRows: annualRowsFor(empiricalBacktest, archetype.id),
      monthlyRows: monthlyRowsFor(empiricalBacktest, archetype.id),
      empiricalBacktest,
      config,
    })
  );
  const sensitivityRows = buildSensitivityRows({ thresholdRows, config });
  const viableScenarios = minimumViableScenarios(sensitivityRows);
  const bestCurrentArchetype = [...thresholdRows].sort(
    (a, b) => Number(b.current_p50_dscr) - Number(a.current_p50_dscr)
  )[0];
  const bestScaledArchetype = [...thresholdRows].sort(
    (a, b) => Number(a.annual_support_required_usd_per_kw) - Number(b.annual_support_required_usd_per_kw)
  )[0];
  const lowestAbsoluteSupportArchetype = [...thresholdRows].sort(
    (a, b) => Number(a.annual_support_required_usd) - Number(b.annual_support_required_usd)
  )[0];
  const allCurrentPass = thresholdRows.every((row) => row.current_launch_pass);
  const anyCurrentPass = thresholdRows.some((row) => row.current_launch_pass);
  const empiricalDays = Number(empiricalBacktest.finance_claims.empirical_days || 0);
  const protocolFeeRevenueUsd = Number(financeDossier.annualized_income_statement.total_protocol_fee_revenue_usd || 0);
  const annualOpexUsd = Number(financeDossier.annualized_income_statement.annual_operating_expense_assumption_usd || 0);
  const opexCoverageRatio = annualOpexUsd === 0 ? 0 : protocolFeeRevenueUsd / annualOpexUsd;
  const minimumFinanceStackUsd = Number(financeDossier.stress_capital_stack.minimum_finance_stack_usd || 0);
  const minimumAnnualSupportUsd = Math.min(...thresholdRows.map((row) => Number(row.annual_support_required_usd)));
  const minimumCapitalSupportUsd = Math.min(...thresholdRows.map((row) => Number(row.capital_support_required_usd)));

  const readinessChecks = [
    {
      id: "empirical_resource_window",
      pass: empiricalDays >= Number(config.minEmpiricalDays),
      finding: `${empiricalDays} observed NASA POWER days are available for launch economics.`,
    },
    {
      id: "project_finance_targets",
      pass: allCurrentPass,
      finding: allCurrentPass
        ? "All current archetypes clear p50 DSCR, p10 DSCR, and payback launch targets."
        : `Best current p50 DSCR is ${bestCurrentArchetype.current_p50_dscr}x; target is ${config.targetP50Dscr}x.`,
    },
    {
      id: "protocol_fee_self_funding",
      pass: opexCoverageRatio >= 1,
      finding: `Protocol fee revenue covers ${(opexCoverageRatio * 100).toFixed(4)}% of the current operating-budget assumption.`,
    },
    {
      id: "minimum_viable_scenario_exists",
      pass: viableScenarios.length > 0,
      finding: viableScenarios.length
        ? "Sensitivity grid contains launch-economics-positive scenarios once tariff/value, capex, and capital terms improve."
        : "Sensitivity grid has no launch-economics-positive scenario under the tested ranges.",
    },
    {
      id: "paid_launch_gate_still_blocks",
      pass: launchGate.modes?.paid_mainnet_product?.status !== "launchable",
      finding: "Paid/mainnet remains blocked until non-economic controls are also complete.",
    },
  ];

  return {
    generated_at: (options.now || new Date()).toISOString(),
    title: "SolarPunk Economic Launch Readiness",
    thesis:
      "This artifact converts the empirical resource backtest into launch economics: DSCR targets, required realized $/kWh, capex ceiling, support capital, sensitivity paths, and explicit launch decisions.",
    input_basis: {
      empirical_finance_backtest: "state/product/empirical_finance_backtest.json",
      spk_finance_dossier: "state/product/spk_finance_dossier.json",
      launch_gate: "state/product/launch_gate.json",
      empirical_days: empiricalDays,
      empirical_window: `${empiricalBacktest.finance_claims.first_date} -> ${empiricalBacktest.finance_claims.last_date}`,
      targets: {
        p50_dscr: config.targetP50Dscr,
        p10_dscr: config.targetP10Dscr,
        max_simple_payback_years: config.targetMaxSimplePaybackYears,
      },
    },
    explicit_economic_assumptions: config,
    launch_decision: {
      public_lab: "economic_evidence_ready",
      closed_pilot: anyCurrentPass
        ? "economically_launchable_for_at_least_one_archetype_before_non_economic_gates"
        : "requires_anchor_tariff_ppa_capex_reduction_or_support_capital",
      paid_mainnet: allCurrentPass && opexCoverageRatio >= 1
        ? "economics_ready_but_non_economic_gates_still_apply"
        : "blocked_by_unit_economics_and_protocol_revenue",
      plain_english:
        "The empirical economics are now measurable and externally inspectable, but current assumptions do not justify an unsupported paid launch.",
    },
    best_current_archetype: bestCurrentArchetype,
    best_scaled_archetype: bestScaledArchetype,
    lowest_absolute_support_archetype: lowestAbsoluteSupportArchetype,
    protocol_revenue_gap: {
      annual_protocol_fee_revenue_usd: fixed(protocolFeeRevenueUsd, 6),
      annual_operating_expense_assumption_usd: fixed(annualOpexUsd, 2),
      opex_coverage_ratio: fixed(opexCoverageRatio, 8),
      fee_base_gap_multiple: financeDossier.break_even_analysis.fee_base_gap_multiple,
      minimum_closed_pilot_finance_stack_usd: fixed(minimumFinanceStackUsd, 2),
    },
    minimum_support_needed: {
      minimum_annual_support_required_usd: fixed(minimumAnnualSupportUsd, 2),
      minimum_capital_support_required_usd: fixed(minimumCapitalSupportUsd, 2),
      interpretation:
        "These are threshold economics from modeled archetypes, not fundraising asks. A real launch still needs signed terms, real meter production, legal scope, and audit.",
    },
    threshold_rows: thresholdRows,
    sensitivity_summary: {
      tested_rows: sensitivityRows.length,
      launch_ready_rows: sensitivityRows.filter((row) => row.launch_ready).length,
      minimum_viable_scenarios: viableScenarios,
    },
    readiness_checks: readinessChecks,
    readiness: {
      passed: readinessChecks.filter((check) => check.pass).length,
      total: readinessChecks.length,
      blockers: readinessChecks.filter((check) => !check.pass).map((check) => check.id),
      stage: readinessChecks.every((check) => check.pass)
        ? "economic_launch_ready"
        : "economic_evidence_ready_but_launch_terms_blocked",
    },
    launch_terms_required: [
      "A signed tariff, PPA, or internal value-of-energy term high enough to clear the required blended realized $/kWh threshold.",
      "A capex quote or subsidy/incentive package that moves installed cost below the max launch capex threshold.",
      "A debt/equity structure that clears p50 and p10 DSCR simultaneously instead of relying on average-year production.",
      "A named reserve and shortfall policy matching the finance dossier and monetary stress harness.",
      "Separate business revenue terms for the operator/service layer, because protocol fees alone do not self-fund operations at the current scale.",
    ],
    hard_boundaries: [
      "This is launch economics evidence, not investment advice, not a securities offering, and not a revenue promise.",
      "NASA POWER data is empirical resource data, not signed meter production.",
      "Sensitivity rows are mechanical thresholds; they are not market forecasts or guaranteed terms.",
      "Paid launch remains blocked until real meter data, governed deployment, audit, legal terms, reserve policy, and customer/counterparty terms exist.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# SolarPunk Economic Launch Readiness");
  lines.push("");
  lines.push(`- generated_at: \`${report.generated_at}\``);
  lines.push(`- thesis: ${report.thesis}`);
  lines.push("");
  lines.push("## Decision");
  lines.push("");
  lines.push("| Mode | Economic status |");
  lines.push("|---|---|");
  lines.push(`| Public lab | \`${report.launch_decision.public_lab}\` |`);
  lines.push(`| Closed pilot | \`${report.launch_decision.closed_pilot}\` |`);
  lines.push(`| Paid/mainnet | \`${report.launch_decision.paid_mainnet}\` |`);
  lines.push("");
  lines.push(report.launch_decision.plain_english);
  lines.push("");
  lines.push("## Input Basis");
  lines.push("");
  lines.push("| Item | Value |");
  lines.push("|---|---:|");
  lines.push(`| Empirical window | ${report.input_basis.empirical_window} |`);
  lines.push(`| Empirical days | ${format(report.input_basis.empirical_days, 0)} |`);
  lines.push(`| Target p50 DSCR | ${format(report.input_basis.targets.p50_dscr, 2)}x |`);
  lines.push(`| Target p10 DSCR | ${format(report.input_basis.targets.p10_dscr, 2)}x |`);
  lines.push(`| Target max simple payback | ${format(report.input_basis.targets.max_simple_payback_years, 0)} years |`);
  lines.push("");
  lines.push("## Current Unit Economics");
  lines.push("");
  lines.push("| Archetype | Current p50 DSCR | Current p10 DSCR | Current payback | Required realized value | Required value multiplier | Max launch capex | Annual support gap | Capital support gap | Status |");
  lines.push("|---|---:|---:|---:|---:|---:|---:|---:|---:|---|");
  for (const row of report.threshold_rows) {
    lines.push(
      `| ${row.label} | ${format(row.current_p50_dscr, 4)}x | ${format(row.current_p10_dscr, 4)}x | ${format(row.current_p50_payback_years, 2)}y | ${formatUsd(row.required_realized_value_usd_per_kwh, 4)}/kWh | ${format(row.required_value_multiplier, 2)}x | ${formatUsd(row.max_launch_capex_usd_per_wdc, 4)}/Wdc | ${formatUsd(row.annual_support_required_usd, 0)} | ${formatUsd(row.capital_support_required_usd, 0)} | \`${row.finance_gap_status}\` |`
    );
  }
  lines.push("");
  lines.push("## Best Near-Term Economic Paths");
  lines.push("");
  lines.push(`The lowest absolute support path is **${report.lowest_absolute_support_archetype.label}**. The best scaled economics path is **${report.best_scaled_archetype.label}**.`);
  lines.push("");
  lines.push("| Path | Required value | Value multiplier | Max launch capex | Annual support gap | Capital support gap |");
  lines.push("|---|---:|---:|---:|---:|---:|");
  for (const row of [report.lowest_absolute_support_archetype, report.best_scaled_archetype]) {
    lines.push(
      `| ${row.label} | ${formatUsd(row.required_realized_value_usd_per_kwh, 4)}/kWh | ${format(row.required_value_multiplier, 2)}x | ${formatUsd(row.max_launch_capex_usd_per_wdc, 4)}/Wdc | ${formatUsd(row.annual_support_required_usd, 0)} | ${formatUsd(row.capital_support_required_usd, 0)} |`
    );
  }
  lines.push("");
  lines.push("## Protocol Revenue Gap");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  lines.push(`| Annual protocol fee revenue | ${formatUsd(report.protocol_revenue_gap.annual_protocol_fee_revenue_usd, 2)} |`);
  lines.push(`| Annual opex assumption | ${formatUsd(report.protocol_revenue_gap.annual_operating_expense_assumption_usd, 0)} |`);
  lines.push(`| Opex coverage | ${format(report.protocol_revenue_gap.opex_coverage_ratio * 100, 4)}% |`);
  lines.push(`| Fee base gap | ${format(report.protocol_revenue_gap.fee_base_gap_multiple, 2)}x |`);
  lines.push(`| Minimum closed-pilot finance stack | ${formatUsd(report.protocol_revenue_gap.minimum_closed_pilot_finance_stack_usd, 0)} |`);
  lines.push("");
  lines.push("## Minimum Viable Sensitivity Rows");
  lines.push("");
  lines.push(`Tested ${format(report.sensitivity_summary.tested_rows, 0)} combinations; ${format(report.sensitivity_summary.launch_ready_rows, 0)} clear the launch economics thresholds.`);
  lines.push("");
  lines.push("| Archetype | Value multiplier | Capex reduction | Debt share | Debt rate | P50 DSCR | P10 DSCR | Payback |");
  lines.push("|---|---:|---:|---:|---:|---:|---:|---:|");
  for (const row of report.sensitivity_summary.minimum_viable_scenarios.slice(0, 8)) {
    lines.push(
      `| ${row.label} | ${format(row.value_multiplier, 2)}x | ${format(row.capex_reduction_pct, 0)}% | ${format(row.debt_share * 100, 0)}% | ${format(row.debt_interest_rate * 100, 0)}% | ${format(row.p50_dscr, 2)}x | ${format(row.p10_dscr, 2)}x | ${format(row.p50_payback_years, 2)}y |`
    );
  }
  lines.push("");
  lines.push("## Readiness Checks");
  lines.push("");
  for (const check of report.readiness_checks) {
    lines.push(`- ${check.pass ? "PASS" : "BLOCKED"} ${check.id}: ${check.finding}`);
  }
  lines.push("");
  lines.push("## Launch Terms Required");
  lines.push("");
  for (const item of report.launch_terms_required) {
    lines.push(`- ${item}`);
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
  lines.push("npm run product:economic-launch");
  lines.push("npm run product:economic-launch:test");
  lines.push("```");
  lines.push("");
  return lines.join("\n");
}

function main() {
  const report = buildEconomicLaunchReadiness();
  const sensitivityRows = buildSensitivityRows({
    thresholdRows: report.threshold_rows,
    config: report.explicit_economic_assumptions,
  });
  const jsonPath = path.join(ROOT, "state", "product", "economic_launch_readiness.json");
  const thresholdsPath = path.join(ROOT, "state", "product", "economic_launch_thresholds.csv");
  const sensitivityPath = path.join(ROOT, "state", "product", "economic_launch_sensitivity.csv");
  const mdPath = path.join(ROOT, "docs", "product", "ECONOMIC_LAUNCH_READINESS.md");
  writeJson(jsonPath, report);
  writeCsv(thresholdsPath, report.threshold_rows, [
    "id",
    "label",
    "capacity_kw",
    "current_p50_dscr",
    "current_p10_dscr",
    "current_p50_payback_years",
    "required_realized_value_usd_per_kwh",
    "required_value_multiplier",
    "max_launch_capex_usd_per_wdc",
    "annual_support_required_usd",
    "capital_support_required_usd",
    "finance_gap_status",
  ]);
  writeCsv(sensitivityPath, sensitivityRows, [
    "site_id",
    "label",
    "value_multiplier",
    "capex_reduction_pct",
    "debt_share",
    "debt_interest_rate",
    "debt_tenor_years",
    "adjusted_capex_usd",
    "adjusted_annual_debt_service_usd",
    "adjusted_p50_value_usd",
    "adjusted_p10_value_usd",
    "p50_dscr",
    "p10_dscr",
    "p50_payback_years",
    "launch_ready",
    "intervention_score",
  ]);
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, toMarkdown(report), "utf-8");
  console.log(`economic_stage=${report.readiness.stage}`);
  console.log(`closed_pilot=${report.launch_decision.closed_pilot}`);
  console.log(`best_current_p50_dscr=${report.best_current_archetype.current_p50_dscr}`);
  console.log(`lowest_absolute_support_required_value=${report.lowest_absolute_support_archetype.required_realized_value_usd_per_kwh}`);
  console.log(`best_scaled_required_value=${report.best_scaled_archetype.required_realized_value_usd_per_kwh}`);
  console.log(`sensitivity_launch_ready_rows=${report.sensitivity_summary.launch_ready_rows}`);
  console.log(`wrote: ${jsonPath}`);
  console.log(`wrote: ${thresholdsPath}`);
  console.log(`wrote: ${sensitivityPath}`);
  console.log(`wrote: ${mdPath}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  buildEconomicLaunchReadiness,
  buildSensitivityRows,
  buildThresholdRow,
};
