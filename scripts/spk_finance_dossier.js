#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const DEFAULT_CONFIG = {
  annualOperatingExpenseUsd: 120000,
  runwayMonths: 6,
  auditReserveUsd: 25000,
  legalScopingReserveUsd: 15000,
  oracleOpsReserveUsd: 20000,
  pilotWorkingCapitalUsd: 50000,
  stressCapitalMultiplier: 1.25,
  targetLiquidityPctOfActiveSupply: 0.1,
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

function writeScenarioCsv(filePath, rows) {
  const headers = [
    "id",
    "label",
    "annual_issued_spk",
    "annual_settlement_volume_spk",
    "annual_redeemed_spk",
    "annual_protocol_fee_revenue_usd",
    "annual_shortfall_liability_usd",
    "operator_reserve_usd",
    "reserve_coverage_ratio",
    "finance_status",
  ];
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ];
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, csv.join("\n") + "\n", "utf-8");
}

function feeRevenue({ issuedSpk, redeemedSpk, settlementVolumeSpk, mintFeeBps, redemptionFeeBps, settlementFeeBps }) {
  const mintFeeRevenueUsd = issuedSpk * (mintFeeBps / 10000);
  const redemptionFeeRevenueUsd = redeemedSpk * (redemptionFeeBps / 10000);
  const settlementFeeRevenueUsd = settlementVolumeSpk * (settlementFeeBps / 10000);
  return {
    mint_fee_revenue_usd: fixed(mintFeeRevenueUsd),
    redemption_fee_revenue_usd: fixed(redemptionFeeRevenueUsd),
    settlement_fee_revenue_usd: fixed(settlementFeeRevenueUsd),
    total_fee_revenue_usd: fixed(mintFeeRevenueUsd + redemptionFeeRevenueUsd + settlementFeeRevenueUsd),
  };
}

function financeStatus({ shortfallLiabilityUsd, reserveGapUsd, feeRevenueUsd, annualOperatingExpenseUsd }) {
  if (reserveGapUsd > 0) return "needs_named_reserve";
  if (feeRevenueUsd < annualOperatingExpenseUsd * 0.1) return "solvent_mechanics_but_not_self_funding";
  if (feeRevenueUsd < annualOperatingExpenseUsd) return "partially_self_funding";
  if (shortfallLiabilityUsd > 0) return "self_funding_with_delivery_risk";
  return "self_funding";
}

function buildArchetypeFinanceRows({ energyMoney, config }) {
  const { mintFeeBps, redemptionFeeBps, settlementFeeBps } = {
    mintFeeBps: Number(energyMoney.input_basis.mint_fee_bps),
    redemptionFeeBps: Number(energyMoney.input_basis.redemption_fee_bps),
    settlementFeeBps: Number(energyMoney.input_basis.settlement_fee_bps),
  };

  return energyMoney.archetypes.map((archetype) => {
    const annual = archetype.annualized_projection;
    const fees = feeRevenue({
      issuedSpk: Number(annual.issued_spk),
      redeemedSpk: Number(annual.redeemed_spk),
      settlementVolumeSpk: Number(annual.settlement_volume_spk),
      mintFeeBps,
      redemptionFeeBps,
      settlementFeeBps,
    });
    const shortfallLiabilityUsd = Number(annual.shortfall_liability_usd || 0);
    const operatorReserveUsd = Number(archetype.assumptions.operator_reserve_usd || 0);
    const reserveGapUsd = Math.max(
      0,
      shortfallLiabilityUsd - operatorReserveUsd - Number(fees.total_fee_revenue_usd)
    );

    return {
      id: archetype.id,
      label: archetype.label,
      capacity_kw: archetype.capacity_kw,
      annual_issued_spk: fixed(annual.issued_spk),
      annual_settlement_volume_spk: fixed(annual.settlement_volume_spk),
      annual_redeemed_spk: fixed(annual.redeemed_spk),
      annual_protocol_fee_revenue_usd: fees.total_fee_revenue_usd,
      annual_shortfall_liability_usd: fixed(shortfallLiabilityUsd),
      operator_reserve_usd: fixed(operatorReserveUsd),
      reserve_gap_usd: fixed(reserveGapUsd),
      reserve_coverage_ratio: shortfallLiabilityUsd === 0
        ? null
        : fixed((operatorReserveUsd + Number(fees.total_fee_revenue_usd)) / shortfallLiabilityUsd),
      finance_status: financeStatus({
        shortfallLiabilityUsd,
        reserveGapUsd,
        feeRevenueUsd: Number(fees.total_fee_revenue_usd),
        annualOperatingExpenseUsd: config.annualOperatingExpenseUsd,
      }),
    };
  });
}

function buildSpkFinanceDossier(options = {}) {
  const config = { ...DEFAULT_CONFIG, ...(options.config || {}) };
  const energyMoney = options.energyMoney || readJson("state/product/energy_money_simulation.json");
  const energyStandard = options.energyStandard || readJson("state/product/energy_standard_economics.json");
  const monetaryStress = options.monetaryStress || readJson("state/product/monetary_stress_harness.json");
  const currencyLab = options.currencyLab || readJson("state/product/currency_system_lab.json");
  const launchGate = options.launchGate || readJson("state/product/launch_gate.json");

  const energyPriceUsdPerKwh = Number(energyMoney.input_basis.energy_price_usd_per_kwh);
  const kwhPerSpk = Number(energyStandard.current_monetary_state.kwh_per_1_spk_at_current_basis);
  const mintFeeBps = Number(energyMoney.input_basis.mint_fee_bps);
  const redemptionFeeBps = Number(energyMoney.input_basis.redemption_fee_bps);
  const settlementFeeBps = Number(energyMoney.input_basis.settlement_fee_bps);
  const annual = energyMoney.annualized_totals;
  const currentFees = feeRevenue({
    issuedSpk: Number(annual.issued_spk),
    redeemedSpk: Number(annual.redeemed_spk),
    settlementVolumeSpk: Number(annual.settlement_volume_spk),
    mintFeeBps,
    redemptionFeeBps,
    settlementFeeBps,
  });
  const feeBaseUsd = Number(annual.issued_spk) + Number(annual.redeemed_spk) + Number(annual.settlement_volume_spk);
  const effectiveFeeRate = feeBaseUsd === 0 ? 0 : Number(currentFees.total_fee_revenue_usd) / feeBaseUsd;
  const annualOperatingExpenseUsd = Number(config.annualOperatingExpenseUsd);
  const requiredFeeBaseUsdAtCurrentPolicy = effectiveFeeRate === 0 ? null : annualOperatingExpenseUsd / effectiveFeeRate;
  const breakEvenMintOnlySpk = mintFeeBps === 0 ? null : annualOperatingExpenseUsd / (mintFeeBps / 10000);
  const breakEvenRedeemOnlySpk = redemptionFeeBps === 0 ? null : annualOperatingExpenseUsd / (redemptionFeeBps / 10000);
  const activeSupplySpk = Number(annual.active_supply_spk);
  const outstandingEnergyClaimKwh = activeSupplySpk * kwhPerSpk;
  const outstandingEnergyLiabilityUsd = outstandingEnergyClaimKwh * energyPriceUsdPerKwh;
  const settlementVelocityRatio = activeSupplySpk === 0 ? 0 : Number(annual.settlement_volume_spk) / activeSupplySpk;
  const namedOperatorReserveUsd = energyMoney.archetypes.reduce(
    (total, archetype) => total + Number(archetype.assumptions.operator_reserve_usd || 0),
    0
  );
  const annualShortfallLiabilityUsd = energyMoney.archetypes.reduce(
    (total, archetype) => total + Number(archetype.annualized_projection.shortfall_liability_usd || 0),
    0
  );
  const worstStressBufferUsd = Number(monetaryStress.summary.worst_additional_buffer_required_usd || 0);
  const stressCapitalReserveUsd = worstStressBufferUsd * Number(config.stressCapitalMultiplier);
  const runwayReserveUsd = annualOperatingExpenseUsd * (Number(config.runwayMonths) / 12);
  const activeSupplyLiquidityReserveUsd = outstandingEnergyLiabilityUsd * Number(config.targetLiquidityPctOfActiveSupply);
  const minimumFinanceStackUsd =
    runwayReserveUsd +
    Number(config.auditReserveUsd) +
    Number(config.legalScopingReserveUsd) +
    Number(config.oracleOpsReserveUsd) +
    Number(config.pilotWorkingCapitalUsd) +
    stressCapitalReserveUsd +
    activeSupplyLiquidityReserveUsd;
  const archetypeFinance = buildArchetypeFinanceRows({ energyMoney, config });

  const readinessChecks = [
    {
      id: "asset_liability_mapping",
      pass: true,
      finding: "Active SPK supply is mapped to an energy-denominated redemption liability.",
    },
    {
      id: "conservation_checked",
      pass: Boolean(energyMoney.totals.conservation_pass && monetaryStress.summary.all_conservation_checks_pass),
      finding: "Minted SPK, redeemed SPK, active supply, owed kWh, delivered kWh, and shortfall kWh reconcile in the current artifacts.",
    },
    {
      id: "stress_capital_named",
      pass: worstStressBufferUsd === 0,
      finding: worstStressBufferUsd === 0
        ? "No modeled stress capital gap remains."
        : `Worst stress still needs ${formatUsd(worstStressBufferUsd, 2)} of named buffer before it can be treated as finance-ready.`,
    },
    {
      id: "fee_model_self_funding",
      pass: Number(currentFees.total_fee_revenue_usd) >= annualOperatingExpenseUsd,
      finding: `Current annualized fee revenue is ${formatUsd(currentFees.total_fee_revenue_usd, 2)} against an explicit ${formatUsd(annualOperatingExpenseUsd, 0)} annual operating-budget assumption.`,
    },
    {
      id: "launch_gate_blocks_real_money",
      pass: launchGate.modes?.paid_mainnet_product?.status !== "launchable",
      finding: "The launch gate still blocks paid/mainnet use until audit, legal, redemption, and production deployment requirements are met.",
    },
  ];

  return {
    generated_at: (options.now || new Date()).toISOString(),
    title: "SolarPunk SPK Finance Dossier",
    finance_thesis:
      "The finance-heavy SolarPunk claim is not that code prints money. It is that verified energy surplus can be converted into an inspectable monetary balance sheet with explicit issuance, redemption liabilities, fee income, reserve capital, and stress gaps.",
    input_basis: {
      energy_money_simulation: "state/product/energy_money_simulation.json",
      monetary_stress_harness: "state/product/monetary_stress_harness.json",
      energy_standard_economics: "state/product/energy_standard_economics.json",
      currency_system_lab: "state/product/currency_system_lab.json",
      launch_gate: "state/product/launch_gate.json",
    },
    explicit_finance_assumptions: config,
    monetary_unit_economics: {
      energy_price_usd_per_kwh: energyPriceUsdPerKwh,
      kwh_per_spk: kwhPerSpk,
      implied_spk_unit_usd: fixed(kwhPerSpk * energyPriceUsdPerKwh),
      mint_fee_bps: mintFeeBps,
      redemption_fee_bps: redemptionFeeBps,
      settlement_fee_bps: settlementFeeBps,
      gross_spk_per_kwh: fixed(energyPriceUsdPerKwh),
      net_spk_per_kwh_after_mint_fee: fixed(energyPriceUsdPerKwh * (1 - mintFeeBps / 10000)),
      fee_revenue_usd_per_kwh_minted: fixed(energyPriceUsdPerKwh * (mintFeeBps / 10000), 8),
    },
    annualized_income_statement: {
      annual_issued_spk: fixed(annual.issued_spk),
      annual_redeemed_spk: fixed(annual.redeemed_spk),
      annual_settlement_volume_spk: fixed(annual.settlement_volume_spk),
      mint_fee_revenue_usd: currentFees.mint_fee_revenue_usd,
      redemption_fee_revenue_usd: currentFees.redemption_fee_revenue_usd,
      settlement_fee_revenue_usd: currentFees.settlement_fee_revenue_usd,
      total_protocol_fee_revenue_usd: currentFees.total_fee_revenue_usd,
      annual_operating_expense_assumption_usd: annualOperatingExpenseUsd,
      annual_net_operating_result_usd: fixed(Number(currentFees.total_fee_revenue_usd) - annualOperatingExpenseUsd),
      opex_coverage_ratio: fixed(Number(currentFees.total_fee_revenue_usd) / annualOperatingExpenseUsd),
    },
    break_even_analysis: {
      current_effective_fee_base_usd: fixed(feeBaseUsd),
      current_effective_fee_rate: fixed(effectiveFeeRate, 8),
      required_fee_base_usd_at_current_policy: fixed(requiredFeeBaseUsdAtCurrentPolicy, 2),
      fee_base_gap_multiple: requiredFeeBaseUsdAtCurrentPolicy
        ? fixed(requiredFeeBaseUsdAtCurrentPolicy / feeBaseUsd, 2)
        : null,
      break_even_annual_mint_only_spk: fixed(breakEvenMintOnlySpk, 2),
      break_even_annual_redeem_only_spk: fixed(breakEvenRedeemOnlySpk, 2),
      interpretation:
        "At the current 10 bps mint/redemption fee policy, SPK protocol fees are not a near-term operating revenue engine. The finance case must therefore emphasize balance-sheet discipline, risk pricing, pilot/service revenue, partner capital, and structured energy contracts.",
    },
    balance_sheet_view: {
      active_supply_spk: fixed(activeSupplySpk),
      outstanding_energy_claim_kwh: fixed(outstandingEnergyClaimKwh, 4),
      outstanding_energy_liability_usd_at_basis: fixed(outstandingEnergyLiabilityUsd),
      annual_redeemed_spk: fixed(annual.redeemed_spk),
      annual_redeemed_energy_kwh: fixed(Number(annual.redeemed_spk) * kwhPerSpk, 4),
      annual_shortfall_liability_usd_in_base_simulation: fixed(annualShortfallLiabilityUsd),
      named_operator_reserve_usd_in_base_simulation: fixed(namedOperatorReserveUsd),
      base_simulation_reserve_coverage_ratio: annualShortfallLiabilityUsd === 0
        ? null
        : fixed(namedOperatorReserveUsd / annualShortfallLiabilityUsd),
      settlement_velocity_ratio: fixed(settlementVelocityRatio, 4),
    },
    stress_capital_stack: {
      worst_stress_additional_buffer_required_usd: fixed(worstStressBufferUsd),
      stress_capital_multiplier: Number(config.stressCapitalMultiplier),
      stress_capital_reserve_usd: fixed(stressCapitalReserveUsd),
      active_supply_liquidity_reserve_usd: fixed(activeSupplyLiquidityReserveUsd),
      runway_reserve_usd: fixed(runwayReserveUsd),
      audit_reserve_usd: Number(config.auditReserveUsd),
      legal_scoping_reserve_usd: Number(config.legalScopingReserveUsd),
      oracle_ops_reserve_usd: Number(config.oracleOpsReserveUsd),
      pilot_working_capital_usd: Number(config.pilotWorkingCapitalUsd),
      minimum_finance_stack_usd: fixed(minimumFinanceStackUsd),
      interpretation:
        "This is an internal finance stack for a closed pilot, not a token-sale target and not customer collateral unless legally segregated.",
    },
    archetype_finance: archetypeFinance,
    readiness_checks: readinessChecks,
    finance_readiness: {
      passed: readinessChecks.filter((check) => check.pass).length,
      total: readinessChecks.length,
      blockers: readinessChecks.filter((check) => !check.pass).map((check) => check.id),
      stage:
        readinessChecks.every((check) => check.pass)
          ? "finance_ready"
          : "finance_model_ready_but_capital_and_revenue_blocked",
    },
    finance_next_steps: [
      "Replace generic operating-budget assumptions with a real pilot budget and signed operator cost sheet.",
      "Add a tariff/PPA module: contracted energy price, market price, curtailment value, and basis risk.",
      "Separate protocol fees from actual business revenue: pilot setup fees, monitoring SaaS, oracle service fees, and structured energy receipts.",
      "Define legal reserve segregation: what is protocol-owned, operator-owned, customer collateral, insurance, or grant-funded infrastructure.",
      "Add scenario probability weights only after real production, tariff, and redemption data exist.",
    ],
    hard_boundaries: [
      "This dossier is a finance model, not investment advice, not a securities offering, and not a solvency guarantee.",
      "Protocol fee revenue is modeled from current fee policy and simulated volume; it is not current realized revenue.",
      "Operating expense, legal, oracle, pilot working-capital, and runway assumptions are explicit internal planning inputs.",
      "Reserve capital for redemptions or shortfalls must be legally and operationally segregated before any paid product.",
      "SPK should not be marketed as yield-bearing, risk-free, or fully redeemable until legal terms, counterparties, reserves, and audit are complete.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# SolarPunk SPK Finance Dossier");
  lines.push("");
  lines.push(`- generated_at: \`${report.generated_at}\``);
  lines.push(`- thesis: ${report.finance_thesis}`);
  lines.push("");
  lines.push("## Finance Summary");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  lines.push(`| Annualized protocol fee revenue | ${formatUsd(report.annualized_income_statement.total_protocol_fee_revenue_usd, 2)} |`);
  lines.push(`| Annual operating expense assumption | ${formatUsd(report.annualized_income_statement.annual_operating_expense_assumption_usd, 0)} |`);
  lines.push(`| Opex coverage ratio | ${format(report.annualized_income_statement.opex_coverage_ratio * 100, 4)}% |`);
  lines.push(`| Required fee base at current policy | ${formatUsd(report.break_even_analysis.required_fee_base_usd_at_current_policy, 0)} |`);
  lines.push(`| Fee base gap multiple | ${format(report.break_even_analysis.fee_base_gap_multiple, 2)}x |`);
  lines.push(`| Active supply liability at basis | ${formatUsd(report.balance_sheet_view.outstanding_energy_liability_usd_at_basis, 2)} |`);
  lines.push(`| Base simulation reserve coverage | ${format(report.balance_sheet_view.base_simulation_reserve_coverage_ratio, 2)}x |`);
  lines.push(`| Worst stress buffer required | ${formatUsd(report.stress_capital_stack.worst_stress_additional_buffer_required_usd, 2)} |`);
  lines.push(`| Minimum closed-pilot finance stack | ${formatUsd(report.stress_capital_stack.minimum_finance_stack_usd, 0)} |`);
  lines.push(`| Finance readiness | \`${report.finance_readiness.passed}/${report.finance_readiness.total} ${report.finance_readiness.stage}\` |`);
  lines.push("");
  lines.push("## Monetary Unit Economics");
  lines.push("");
  lines.push("| Item | Value |");
  lines.push("|---|---:|");
  lines.push(`| Energy price basis | ${formatUsd(report.monetary_unit_economics.energy_price_usd_per_kwh, 4)} / kWh |`);
  lines.push(`| kWh per SPK | ${format(report.monetary_unit_economics.kwh_per_spk, 4)} |`);
  lines.push(`| Implied SPK unit | ${formatUsd(report.monetary_unit_economics.implied_spk_unit_usd, 2)} |`);
  lines.push(`| Net SPK per kWh after mint fee | ${format(report.monetary_unit_economics.net_spk_per_kwh_after_mint_fee, 6)} |`);
  lines.push(`| Fee revenue per minted kWh | ${formatUsd(report.monetary_unit_economics.fee_revenue_usd_per_kwh_minted, 8)} |`);
  lines.push("");
  lines.push("## Annualized Income Statement");
  lines.push("");
  lines.push("| Line item | Amount |");
  lines.push("|---|---:|");
  lines.push(`| Mint fee revenue | ${formatUsd(report.annualized_income_statement.mint_fee_revenue_usd, 2)} |`);
  lines.push(`| Redemption fee revenue | ${formatUsd(report.annualized_income_statement.redemption_fee_revenue_usd, 2)} |`);
  lines.push(`| Settlement fee revenue | ${formatUsd(report.annualized_income_statement.settlement_fee_revenue_usd, 2)} |`);
  lines.push(`| Total protocol fee revenue | ${formatUsd(report.annualized_income_statement.total_protocol_fee_revenue_usd, 2)} |`);
  lines.push(`| Operating expense assumption | ${formatUsd(report.annualized_income_statement.annual_operating_expense_assumption_usd, 0)} |`);
  lines.push(`| Net operating result | ${formatUsd(report.annualized_income_statement.annual_net_operating_result_usd, 2)} |`);
  lines.push("");
  lines.push("## Archetype Finance");
  lines.push("");
  lines.push("| Archetype | Issued SPK | Settlement SPK | Redeemed SPK | Fee revenue | Shortfall liability | Operator reserve | Reserve coverage | Status |");
  lines.push("|---|---:|---:|---:|---:|---:|---:|---:|---|");
  for (const row of report.archetype_finance) {
    lines.push(
      `| ${row.label} | ${format(row.annual_issued_spk, 2)} | ${format(row.annual_settlement_volume_spk, 2)} | ${format(row.annual_redeemed_spk, 2)} | ${formatUsd(row.annual_protocol_fee_revenue_usd, 2)} | ${formatUsd(row.annual_shortfall_liability_usd, 2)} | ${formatUsd(row.operator_reserve_usd, 0)} | ${row.reserve_coverage_ratio === null ? "n/a" : `${format(row.reserve_coverage_ratio, 2)}x`} | \`${row.finance_status}\` |`
    );
  }
  lines.push("");
  lines.push("## Stress Capital Stack");
  lines.push("");
  lines.push("| Component | Amount |");
  lines.push("|---|---:|");
  lines.push(`| Runway reserve | ${formatUsd(report.stress_capital_stack.runway_reserve_usd, 0)} |`);
  lines.push(`| Audit reserve | ${formatUsd(report.stress_capital_stack.audit_reserve_usd, 0)} |`);
  lines.push(`| Legal scoping reserve | ${formatUsd(report.stress_capital_stack.legal_scoping_reserve_usd, 0)} |`);
  lines.push(`| Oracle ops reserve | ${formatUsd(report.stress_capital_stack.oracle_ops_reserve_usd, 0)} |`);
  lines.push(`| Pilot working capital | ${formatUsd(report.stress_capital_stack.pilot_working_capital_usd, 0)} |`);
  lines.push(`| Stress capital reserve | ${formatUsd(report.stress_capital_stack.stress_capital_reserve_usd, 0)} |`);
  lines.push(`| Active-supply liquidity reserve | ${formatUsd(report.stress_capital_stack.active_supply_liquidity_reserve_usd, 0)} |`);
  lines.push(`| Minimum finance stack | ${formatUsd(report.stress_capital_stack.minimum_finance_stack_usd, 0)} |`);
  lines.push("");
  lines.push(report.stress_capital_stack.interpretation);
  lines.push("");
  lines.push("## Readiness Checks");
  lines.push("");
  for (const check of report.readiness_checks) {
    lines.push(`- ${check.pass ? "PASS" : "BLOCKED"} ${check.id}: ${check.finding}`);
  }
  lines.push("");
  lines.push("## Finance Next Steps");
  lines.push("");
  for (const item of report.finance_next_steps) {
    lines.push(`- ${item}`);
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
  const report = buildSpkFinanceDossier();
  const jsonPath = path.join(ROOT, "state", "product", "spk_finance_dossier.json");
  const csvPath = path.join(ROOT, "state", "product", "spk_finance_scenarios.csv");
  const mdPath = path.join(ROOT, "docs", "product", "SPK_FINANCE_DOSSIER.md");
  writeJson(jsonPath, report);
  writeScenarioCsv(csvPath, report.archetype_finance);
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, toMarkdown(report), "utf-8");
  console.log(`annual_fee_revenue_usd=${report.annualized_income_statement.total_protocol_fee_revenue_usd}`);
  console.log(`opex_coverage_ratio=${report.annualized_income_statement.opex_coverage_ratio}`);
  console.log(`minimum_finance_stack_usd=${report.stress_capital_stack.minimum_finance_stack_usd}`);
  console.log(`finance_readiness=${report.finance_readiness.passed}/${report.finance_readiness.total}`);
  console.log(`wrote: ${jsonPath}`);
  console.log(`wrote: ${csvPath}`);
  console.log(`wrote: ${mdPath}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  buildSpkFinanceDossier,
  feeRevenue,
};
