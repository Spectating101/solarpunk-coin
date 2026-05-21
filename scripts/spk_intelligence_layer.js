const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

function readJson(relativePath, fallback = null) {
  const filePath = path.join(ROOT, relativePath);
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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function average(values) {
  const valid = values.map(Number).filter(Number.isFinite);
  if (!valid.length) return null;
  return fixed(valid.reduce((sum, value) => sum + value, 0) / valid.length, 6);
}

function riskLabel(score) {
  if (score >= 0.55) return "suspicious";
  if (score >= 0.25) return "review";
  return "normal";
}

function riskStatus(score) {
  if (score >= 0.75) return "blocked";
  if (score >= 0.55) return "suspicious";
  if (score >= 0.25) return "review";
  return "normal";
}

function rowDate(row) {
  return String(row.window_start || "").slice(0, 10) || "unknown";
}

function expectedDailyKwh(resourceBenchmark, capacityKw) {
  const solar = resourceBenchmark.solar || {};
  const standardKw = Number(solar.standard_system?.system_kw_dc || 10);
  const baseline = Number(solar.production_estimate?.average_window_day_ac_kwh || 0);
  if (!Number.isFinite(baseline) || baseline <= 0 || !Number.isFinite(capacityKw) || capacityKw <= 0) {
    throw new Error("Cannot derive expected solar output from resource benchmark and capacity.");
  }
  return baseline * (capacityKw / standardKw);
}

function scoreReading(row, context) {
  const generation = Number(row.generation_kwh || 0);
  const exportKwh = Number(row.export_kwh || 0);
  const eligibleSurplus = Number(row.eligible_surplus_kwh || 0);
  const quality = Number(row.quality_score ?? 1);
  const expected = context.expected_daily_kwh;
  const expectedLow = expected * context.expected_low_multiplier;
  const expectedHigh = expected * context.expected_high_multiplier;
  const physicalDailyMax = context.capacity_kw * 24 * context.max_capacity_factor;
  const deviationPct = expected > 0 ? ((generation - expected) / expected) * 100 : 0;
  const outsideRangePct =
    generation < expectedLow
      ? ((expectedLow - generation) / expectedLow) * 100
      : generation > expectedHigh
        ? ((generation - expectedHigh) / expectedHigh) * 100
        : 0;

  const impossible =
    generation > physicalDailyMax ||
    exportKwh > generation + 0.000001 ||
    eligibleSurplus > exportKwh + Number(row.curtailed_kwh || 0) + 0.000001;

  const rangeScore = clamp(outsideRangePct / 80, 0, 1) * 0.5;
  const deviationScore = clamp((Math.abs(deviationPct) - 55) / 95, 0, 1) * 0.2;
  const qualityScore = clamp((0.95 - quality) / 0.25, 0, 1) * 0.3;
  const surplusRatio = generation > 0 ? exportKwh / generation : 0;
  const surplusScore = clamp((surplusRatio - 0.85) / 0.15, 0, 1) * 0.1;
  const score = impossible ? 1 : clamp(rangeScore + deviationScore + qualityScore + surplusScore, 0, 1);

  const flags = [];
  if (impossible) flags.push("physical_or_energy_balance_violation");
  if (generation < expectedLow) flags.push("below_expected_solar_range");
  if (generation > expectedHigh) flags.push("above_expected_solar_range");
  if (quality < 0.9) flags.push("low_quality_score");
  if (surplusRatio > 0.85) flags.push("very_high_export_ratio");
  if (!flags.length) flags.push("within_expected_range");

  return {
    date: rowDate(row),
    meter_id: row.meter_id,
    site_id: row.site_id,
    reported_generation_kwh: fixed(generation, 4),
    reported_export_kwh: fixed(exportKwh, 4),
    eligible_surplus_kwh: fixed(eligibleSurplus, 4),
    expected_generation_kwh: fixed(expected, 4),
    expected_low_kwh: fixed(expectedLow, 4),
    expected_high_kwh: fixed(expectedHigh, 4),
    deviation_pct: fixed(deviationPct, 4),
    quality_score: fixed(quality, 4),
    anomaly_score: fixed(score, 4),
    risk_label: riskLabel(score),
    flags,
  };
}

function riskCounts(rows) {
  return rows.reduce((counts, row) => {
    counts[row.risk_label] = (counts[row.risk_label] || 0) + 1;
    return counts;
  }, { normal: 0, review: 0, suspicious: 0 });
}

function overallRisk(rows, provenance) {
  if (rows.some((row) => row.risk_label === "suspicious")) return "suspicious";
  if (rows.some((row) => row.risk_label === "review")) return "review";
  if (provenance?.level === "L0") return "normal_public_lab_fixture";
  return "normal";
}

function buildAuditDossier(report) {
  const summary = report.summary;
  const expectedRange = `${summary.expected_daily_low_kwh}-${summary.expected_daily_high_kwh} kWh/day`;
  return {
    title: "SPK Intelligence Audit Dossier",
    operator_submitted: `${summary.total_reported_generation_kwh} kWh generation, ${summary.total_eligible_surplus_kwh} kWh eligible surplus`,
    expected_range: expectedRange,
    deviation: `${summary.average_deviation_pct}% average daily deviation from NASA/PV benchmark`,
    risk: summary.overall_risk,
    contract_action_boundary: "AI advises; contracts decide. SPK minting still depends on signed attestations, replay protection, oracle roles, source-hash uniqueness, reserve checks, and contract rules.",
    review_note: summary.review_note,
    supporting_data: [
      "operator CSV/profile intake",
      "signed reading bundle",
      "NASA POWER solar benchmark",
      "SPK mint preview",
      "hardware provenance label",
      "finance readiness and monetary stress artifacts",
    ],
  };
}

function spkPerKwh(financeDossier) {
  return Number(financeDossier?.monetary_unit_economics?.net_spk_per_kwh_after_mint_fee || 0.04995);
}

function buildForecast(operatorData, context, financeDossier) {
  const generation = Number(operatorData.validation_summary?.total_generation_kwh || 0);
  const eligibleSurplus = Number(operatorData.validation_summary?.total_eligible_surplus_kwh || 0);
  const observedSurplusRatio = generation > 0 ? eligibleSurplus / generation : 0;
  const horizonDays = 7;
  const lowGeneration = context.expected_daily_kwh * context.expected_low_multiplier * horizonDays;
  const baseGeneration = context.expected_daily_kwh * horizonDays;
  const highGeneration = context.expected_daily_kwh * context.expected_high_multiplier * horizonDays;
  const mintRate = spkPerKwh(financeDossier);

  const toScenario = (label, generationKwh) => {
    const surplusKwh = generationKwh * observedSurplusRatio;
    return {
      label,
      generation_kwh: fixed(generationKwh, 4),
      eligible_surplus_kwh: fixed(surplusKwh, 4),
      net_spk_preview: fixed(surplusKwh * mintRate, 6),
    };
  };

  return {
    horizon_days: horizonDays,
    method: "capacity_scaled_nasa_pvwatts_with_observed_surplus_ratio",
    observed_surplus_ratio: fixed(observedSurplusRatio, 6),
    confidence: "wide_public_lab_band",
    scenarios: [
      toScenario("low", lowGeneration),
      toScenario("base", baseGeneration),
      toScenario("high", highGeneration),
    ],
    limitation: "Forecast uses current sample surplus ratio and resource baseline; it is not a production forecast until real site telemetry exists.",
  };
}

function provenanceRisk(provenance, hardwareProvenance) {
  const level = provenance?.level || hardwareProvenance?.current_hardware_level || "unknown";
  const currentLevel = hardwareProvenance?.levels?.find((item) => item.id === level);
  const levelScores = { L0: 0.95, L1: 0.65, L2: 0.35, L3: 0.18, L4: 0.05 };
  const score = levelScores[level] ?? 0.8;
  return {
    id: "hardware_provenance",
    label: "Hardware/data provenance",
    score: fixed(score, 4),
    status: riskStatus(score),
    evidence: level,
    interpretation: currentLevel
      ? `${currentLevel.label}; ${currentLevel.what_it_proves}`
      : "Unknown hardware provenance; cannot support real-value SPK issuance.",
  };
}

function buildRiskProfile({
  scoredRows,
  operatorData,
  hardwareProvenance,
  economicLaunch,
  financeDossier,
  monetaryStress,
}) {
  const validation = operatorData.validation_summary || {};
  const provenance = operatorData.provenance_assessment || {};
  const averageQuality = Number(validation.average_quality_score || 0);
  const acceptedRecords = Number(validation.accepted_records || 0);
  const verifiedSignatures = Number(validation.verified_signatures || 0);
  const maxAnomalyScore = Math.max(...scoredRows.map((row) => Number(row.anomaly_score || 0)), 0);
  const signatureGap = acceptedRecords > 0 ? Math.max(0, acceptedRecords - verifiedSignatures) / acceptedRecords : 1;
  const dataQualityScore = clamp(((0.98 - averageQuality) / 0.08) + signatureGap, 0, 1);
  const bestDscr = Number(economicLaunch.best_current_archetype?.current_p50_dscr || 0);
  const economicBlocked = String(economicLaunch.launch_decision?.closed_pilot || "").includes("requires")
    || String(economicLaunch.launch_decision?.paid_mainnet || "").includes("blocked");
  const economicScore = economicBlocked ? clamp(1 - (bestDscr / 1.2), 0.35, 0.9) : 0.1;
  const worstBuffer = Number(monetaryStress.summary?.worst_additional_buffer_required_usd
    || financeDossier.stress_capital_stack?.worst_stress_additional_buffer_required_usd
    || 0);
  const shortfallScore = worstBuffer > 0 ? clamp(worstBuffer / 10_000, 0.3, 0.7) : 0.05;
  const realValueMintAllowed = Boolean(operatorData.launch_controls?.current_sample_allowed_real_value_kwh > 0);
  const pilotScore = realValueMintAllowed && !economicBlocked ? 0.2 : 0.9;

  const categories = [
    {
      id: "physical_plausibility",
      label: "Physical plausibility",
      score: fixed(maxAnomalyScore, 4),
      status: riskStatus(maxAnomalyScore),
      evidence: `${scoredRows.length} rows scored; ${scoredRows.filter((row) => row.risk_label !== "normal").length} rows flagged`,
      interpretation: maxAnomalyScore > 0
        ? "At least one reading is outside normal physical/resource expectations."
        : "Current readings sit inside the NASA/PV benchmark band.",
    },
    {
      id: "data_quality",
      label: "Data quality/signatures",
      score: fixed(dataQualityScore, 4),
      status: riskStatus(dataQualityScore),
      evidence: `${verifiedSignatures}/${acceptedRecords} signatures verified; average quality ${fixed(averageQuality, 4)}`,
      interpretation: "Checks whether accepted rows are signed and meet quality thresholds.",
    },
    provenanceRisk(provenance, hardwareProvenance),
    {
      id: "economic_viability",
      label: "Economic viability",
      score: fixed(economicScore, 4),
      status: riskStatus(economicScore),
      evidence: `best current p50 DSCR ${bestDscr || "unknown"}x`,
      interpretation: economicLaunch.launch_decision?.plain_english || "Economic launch evidence is unavailable.",
    },
    {
      id: "redemption_shortfall",
      label: "Redemption/shortfall reserve",
      score: fixed(shortfallScore, 4),
      status: riskStatus(shortfallScore),
      evidence: `$${fixed(worstBuffer, 2)} worst additional buffer required`,
      interpretation: worstBuffer > 0
        ? "Stress scenarios need a named reserve before real-value redemption can be promised."
        : "No additional stress buffer is required in current scenarios.",
    },
    {
      id: "pilot_readiness",
      label: "Overall pilot readiness",
      score: fixed(pilotScore, 4),
      status: riskStatus(pilotScore),
      evidence: `real_value_mint_allowed=${realValueMintAllowed}; provenance=${provenance.level || "unknown"}`,
      interpretation: realValueMintAllowed
        ? "Current sample can support more than public-lab analysis."
        : "Current sample remains public-lab only; closed pilot needs real operator hardware evidence and economics.",
    },
  ];

  const strongest = categories.reduce((best, item) => (item.score < best.score ? item : best), categories[0]);
  const weakest = categories.reduce((worst, item) => (item.score > worst.score ? item : worst), categories[0]);

  return {
    version: "risk_stack_v1",
    summary: {
      categories: categories.length,
      normal: categories.filter((item) => item.status === "normal").length,
      review_or_worse: categories.filter((item) => item.status !== "normal").length,
      strongest_signal: strongest.id,
      weakest_signal: weakest.id,
      readiness: categories.some((item) => item.status === "blocked") ? "public_lab_only" : "pilot_candidate",
    },
    categories,
  };
}

function adversarialRows(context) {
  const base = {
    window_start: "2026-05-01T00:00:00Z",
    meter_id: "adversarial-meter",
    site_id: "adversarial-site",
    quality_score: 0.99,
    curtailed_kwh: 0,
  };
  return [
    {
      id: "impossible_generation",
      expected_flag: "physical_or_energy_balance_violation",
      row: {
        ...base,
        generation_kwh: context.capacity_kw * 24 * 1.05,
        export_kwh: context.capacity_kw * 20,
        eligible_surplus_kwh: context.capacity_kw * 20,
      },
    },
    {
      id: "export_exceeds_generation",
      expected_flag: "physical_or_energy_balance_violation",
      row: {
        ...base,
        generation_kwh: context.expected_daily_kwh,
        export_kwh: context.expected_daily_kwh + 5,
        eligible_surplus_kwh: context.expected_daily_kwh + 5,
      },
    },
    {
      id: "surplus_overclaim",
      expected_flag: "physical_or_energy_balance_violation",
      row: {
        ...base,
        generation_kwh: context.expected_daily_kwh,
        export_kwh: context.expected_daily_kwh * 0.3,
        eligible_surplus_kwh: context.expected_daily_kwh * 0.8,
      },
    },
    {
      id: "low_quality_claim",
      expected_flag: "low_quality_score",
      row: {
        ...base,
        generation_kwh: context.expected_daily_kwh,
        export_kwh: context.expected_daily_kwh * 0.4,
        eligible_surplus_kwh: context.expected_daily_kwh * 0.4,
        quality_score: 0.55,
      },
    },
  ];
}

function buildAdversarialChecks(context) {
  const checks = adversarialRows(context).map((scenario) => {
    const scored = scoreReading(scenario.row, context);
    const caught = scored.risk_label !== "normal" && scored.flags.includes(scenario.expected_flag);
    return {
      id: scenario.id,
      expected_flag: scenario.expected_flag,
      caught,
      risk_label: scored.risk_label,
      anomaly_score: scored.anomaly_score,
      flags: scored.flags,
    };
  });
  return {
    checks,
    passed: checks.filter((item) => item.caught).length,
    total: checks.length,
    all_caught: checks.every((item) => item.caught),
  };
}

function buildFinanceReadiness(economicLaunch, financeDossier, monetaryStress) {
  const lowestSupport = economicLaunch.minimum_support_needed || {};
  const protocolGap = economicLaunch.protocol_revenue_gap || {};
  const finance = financeDossier.finance_readiness || {};
  const worstBuffer = Number(monetaryStress.summary?.worst_additional_buffer_required_usd
    || financeDossier.stress_capital_stack?.worst_stress_additional_buffer_required_usd
    || 0);
  return {
    stage: finance.stage || "unknown",
    finance_checks_passed: finance.passed || 0,
    finance_checks_total: finance.total || 0,
    closed_pilot_economic_status: economicLaunch.launch_decision?.closed_pilot || "unknown",
    paid_mainnet_economic_status: economicLaunch.launch_decision?.paid_mainnet || "unknown",
    minimum_annual_support_required_usd: fixed(lowestSupport.minimum_annual_support_required_usd, 2),
    minimum_capital_support_required_usd: fixed(lowestSupport.minimum_capital_support_required_usd, 2),
    opex_coverage_ratio: fixed(protocolGap.opex_coverage_ratio, 6),
    worst_additional_buffer_required_usd: fixed(worstBuffer, 2),
    interpretation: "Finance intelligence is advisory: it sizes support, revenue, and reserve gaps; it does not authorize paid launch.",
  };
}

function buildIntelligenceLayer(options = {}) {
  const operatorData = options.operatorData || readJson("state/product/operator_data_intake.json");
  const resourceBenchmark = options.resourceBenchmark || readJson("state/product/resource_benchmark_lab.json");
  const hardwareProvenance = options.hardwareProvenance || readJson("state/product/hardware_provenance_model.json", {});
  const economicLaunch = options.economicLaunch || readJson("state/product/economic_launch_readiness.json", {});
  const financeDossier = options.financeDossier || readJson("state/product/spk_finance_dossier.json", {});
  const monetaryStress = options.monetaryStress || readJson("state/product/monetary_stress_harness.json", {});
  const capacityKw = Number(operatorData.input?.capacity_kw || operatorData.operator_profile?.capacity_kw || 0);
  const expected = expectedDailyKwh(resourceBenchmark, capacityKw);
  const context = {
    capacity_kw: capacityKw,
    expected_daily_kwh: expected,
    expected_low_multiplier: Number(options.expectedLowMultiplier || 0.65),
    expected_high_multiplier: Number(options.expectedHighMultiplier || 1.55),
    max_capacity_factor: Number(options.maxCapacityFactor || 0.9),
  };

  const scoredRows = (operatorData.daily_rows || []).map((row) => scoreReading(row, context));
  const counts = riskCounts(scoredRows);
  const provenance = operatorData.provenance_assessment || {};
  const totalGeneration = Number(operatorData.validation_summary?.total_generation_kwh || 0);
  const totalEligibleSurplus = Number(operatorData.validation_summary?.total_eligible_surplus_kwh || 0);
  const deviations = scoredRows.map((row) => row.deviation_pct);
  const absDeviations = deviations.map((value) => Math.abs(Number(value || 0)));
  const maxScore = Math.max(...scoredRows.map((row) => Number(row.anomaly_score || 0)), 0);
  const maxRiskRow = scoredRows.reduce((worst, row) => (
    Number(row.anomaly_score || 0) > Number(worst.anomaly_score || 0) ? row : worst
  ), scoredRows[0] || {});
  const risk = overallRisk(scoredRows, provenance);
  const reviewNote =
    risk === "suspicious"
      ? "One or more rows exceed physical plausibility or expected-output limits. A human/operator review is required before oracle approval."
      : risk === "review"
        ? "Reported output is not impossible, but at least one row is outside the expected range or quality threshold."
        : provenance.level === "L0"
          ? "Energy values are statistically plausible for a public-lab sample, but L0 provenance means the data cannot support real-value SPK issuance."
          : "Reported output is within expected range for the declared site capacity and benchmark window.";

  const summary = {
    operator_name: operatorData.operator_profile?.operator_name || "unknown",
    site_id: operatorData.input?.site_id || operatorData.operator_profile?.site_id || "unknown",
    meter_id: operatorData.input?.meter_id || operatorData.operator_profile?.meter_id || "unknown",
    capacity_kw: capacityKw,
    rows_scored: scoredRows.length,
    expected_daily_kwh: fixed(expected, 4),
    expected_daily_low_kwh: fixed(expected * context.expected_low_multiplier, 4),
    expected_daily_high_kwh: fixed(expected * context.expected_high_multiplier, 4),
    total_reported_generation_kwh: fixed(totalGeneration, 4),
    total_eligible_surplus_kwh: fixed(totalEligibleSurplus, 4),
    average_reported_generation_kwh: fixed(totalGeneration / Math.max(scoredRows.length, 1), 4),
    average_deviation_pct: fixed(average(deviations), 4),
    average_absolute_deviation_pct: fixed(average(absDeviations), 4),
    max_anomaly_score: fixed(maxScore, 4),
    highest_risk_day: maxRiskRow.date || null,
    risk_counts: counts,
    overall_risk: risk,
    provenance_level: provenance.level || "unknown",
    real_value_mint_allowed: Boolean(operatorData.launch_controls?.current_sample_allowed_real_value_kwh > 0),
    review_note: reviewNote,
  };

  const forecast = buildForecast(operatorData, context, financeDossier);
  const riskProfile = buildRiskProfile({
    scoredRows,
    operatorData,
    hardwareProvenance,
    economicLaunch,
    financeDossier,
    monetaryStress,
  });
  const adversarialChecks = buildAdversarialChecks(context);
  const financeReadiness = buildFinanceReadiness(economicLaunch, financeDossier, monetaryStress);

  const report = {
    generated_at: (options.now || new Date()).toISOString(),
    title: "SolarPunk Intelligence Layer v1",
    framing: "Off-chain AI/statistical intelligence for renewable-energy mint claims, pilot risk, and finance readiness. AI advises; contracts decide.",
    implementation_stage: "deterministic_risk_stack_v1_no_llm_required",
    advisory_only: true,
    contract_authority: [
      "registered signatures",
      "oracle role",
      "source-hash replay protection",
      "attestation validity windows",
      "reserve and grid-stress controls",
      "supply cap and fee logic",
    ],
    data_sources: {
      operator_intake: "state/product/operator_data_intake.json",
      resource_benchmark: "state/product/resource_benchmark_lab.json",
      hardware_provenance: "state/product/hardware_provenance_model.json",
      economic_launch_readiness: "state/product/economic_launch_readiness.json",
      finance_dossier: "state/product/spk_finance_dossier.json",
      monetary_stress_harness: "state/product/monetary_stress_harness.json",
      nasa_parameter: resourceBenchmark.solar?.source_parameter || "unknown",
      benchmark_model: resourceBenchmark.solar?.conversion_model || "unknown",
    },
    model: {
      type: "capacity_scaled_nasa_pvwatts_risk_stack",
      expected_low_multiplier: context.expected_low_multiplier,
      expected_high_multiplier: context.expected_high_multiplier,
      max_capacity_factor: context.max_capacity_factor,
      risk_labels: ["normal", "review", "suspicious"],
      future_upgrade: "Optional LLM can summarize this deterministic report, but should not approve minting or launch readiness.",
    },
    summary,
    risk_profile: riskProfile,
    forecast,
    finance_readiness: financeReadiness,
    adversarial_checks: adversarialChecks,
    scored_rows: scoredRows,
    audit_dossier: null,
    boundaries: [
      "This layer does not mint SPK and does not approve SPK minting.",
      "It does not prove physical truth; it flags whether reported values look plausible against a resource baseline.",
      "Current sample is L0 public-lab data, so real-value issuance remains blocked even when risk is normal.",
      "Production use would need real operator data, stronger hardware provenance, audit scope, and legal redemption terms.",
    ],
  };
  report.audit_dossier = buildAuditDossier(report);
  return report;
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# SolarPunk Intelligence Layer v1");
  lines.push("");
  lines.push(report.framing);
  lines.push("");
  lines.push("## Current Result");
  lines.push("");
  lines.push(`- generated_at: \`${report.generated_at}\``);
  lines.push(`- implementation_stage: \`${report.implementation_stage}\``);
  lines.push(`- advisory_only: \`${report.advisory_only}\``);
  lines.push(`- overall_risk: \`${report.summary.overall_risk}\``);
  lines.push(`- risk_stack_readiness: \`${report.risk_profile.summary.readiness}\``);
  lines.push(`- rows_scored: \`${report.summary.rows_scored}\``);
  lines.push(`- max_anomaly_score: \`${report.summary.max_anomaly_score}\``);
  lines.push(`- provenance_level: \`${report.summary.provenance_level}\``);
  lines.push(`- adversarial_checks: \`${report.adversarial_checks.passed}/${report.adversarial_checks.total}\``);
  lines.push("");
  lines.push("## Audit Dossier");
  lines.push("");
  lines.push(`- operator_submitted: ${report.audit_dossier.operator_submitted}`);
  lines.push(`- expected_range: ${report.audit_dossier.expected_range}`);
  lines.push(`- deviation: ${report.audit_dossier.deviation}`);
  lines.push(`- risk: \`${report.audit_dossier.risk}\``);
  lines.push(`- review_note: ${report.audit_dossier.review_note}`);
  lines.push(`- contract_boundary: ${report.audit_dossier.contract_action_boundary}`);
  lines.push("");
  lines.push("## Risk Stack");
  lines.push("");
  lines.push("| Risk type | Score | Status | Evidence | Interpretation |");
  lines.push("|---|---:|---|---|---|");
  for (const item of report.risk_profile.categories) {
    lines.push(`| ${item.label} | ${item.score} | \`${item.status}\` | ${item.evidence} | ${item.interpretation} |`);
  }
  lines.push("");
  lines.push("## Seven-Day Forecast");
  lines.push("");
  lines.push(`- method: \`${report.forecast.method}\``);
  lines.push(`- confidence: \`${report.forecast.confidence}\``);
  lines.push(`- observed_surplus_ratio: \`${report.forecast.observed_surplus_ratio}\``);
  lines.push("");
  lines.push("| Scenario | Generation kWh | Eligible surplus kWh | Net SPK preview |");
  lines.push("|---|---:|---:|---:|");
  for (const scenario of report.forecast.scenarios) {
    lines.push(`| ${scenario.label} | ${scenario.generation_kwh} | ${scenario.eligible_surplus_kwh} | ${scenario.net_spk_preview} |`);
  }
  lines.push("");
  lines.push(report.forecast.limitation);
  lines.push("");
  lines.push("## Finance Readiness");
  lines.push("");
  lines.push(`- stage: \`${report.finance_readiness.stage}\``);
  lines.push(`- closed_pilot_economic_status: \`${report.finance_readiness.closed_pilot_economic_status}\``);
  lines.push(`- paid_mainnet_economic_status: \`${report.finance_readiness.paid_mainnet_economic_status}\``);
  lines.push(`- minimum_annual_support_required_usd: \`$${report.finance_readiness.minimum_annual_support_required_usd}\``);
  lines.push(`- minimum_capital_support_required_usd: \`$${report.finance_readiness.minimum_capital_support_required_usd}\``);
  lines.push(`- opex_coverage_ratio: \`${report.finance_readiness.opex_coverage_ratio}\``);
  lines.push(`- worst_additional_buffer_required_usd: \`$${report.finance_readiness.worst_additional_buffer_required_usd}\``);
  lines.push("");
  lines.push(report.finance_readiness.interpretation);
  lines.push("");
  lines.push("## Adversarial Checks");
  lines.push("");
  lines.push("| Scenario | Caught | Risk | Score | Flags |");
  lines.push("|---|---|---|---:|---|");
  for (const check of report.adversarial_checks.checks) {
    lines.push(`| ${check.id} | \`${check.caught}\` | \`${check.risk_label}\` | ${check.anomaly_score} | ${check.flags.join(", ")} |`);
  }
  lines.push("");
  lines.push("## Scored Rows");
  lines.push("");
  lines.push("| Date | Generation kWh | Expected kWh | Range kWh | Deviation | Score | Risk | Flags |");
  lines.push("|---|---:|---:|---:|---:|---:|---|---|");
  for (const row of report.scored_rows) {
    lines.push(
      `| ${row.date} | ${row.reported_generation_kwh} | ${row.expected_generation_kwh} | ${row.expected_low_kwh}-${row.expected_high_kwh} | ${row.deviation_pct}% | ${row.anomaly_score} | \`${row.risk_label}\` | ${row.flags.join(", ")} |`
    );
  }
  lines.push("");
  lines.push("## AI Boundary");
  lines.push("");
  lines.push("> AI advises; contracts decide.");
  lines.push("");
  for (const boundary of report.boundaries) {
    lines.push(`- ${boundary}`);
  }
  lines.push("");
  lines.push("## Contract Authority Remains Deterministic");
  lines.push("");
  for (const authority of report.contract_authority) {
    lines.push(`- ${authority}`);
  }
  lines.push("");
  return lines.join("\n");
}

function main() {
  const report = buildIntelligenceLayer();
  const jsonPath = path.join(ROOT, "state", "product", "spk_intelligence_layer.json");
  const mdPath = path.join(ROOT, "docs", "product", "SPK_INTELLIGENCE_LAYER.md");
  writeJson(jsonPath, report);
  writeText(mdPath, toMarkdown(report));
  console.log(`intelligence_layer=${report.summary.overall_risk}`);
  console.log(`rows_scored=${report.summary.rows_scored}`);
  console.log(`max_anomaly_score=${report.summary.max_anomaly_score}`);
  console.log(`wrote: ${jsonPath}`);
  console.log(`wrote: ${mdPath}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  buildIntelligenceLayer,
  expectedDailyKwh,
  riskLabel,
  riskStatus,
  scoreReading,
};
