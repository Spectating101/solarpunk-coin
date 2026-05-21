import energyStandard from '../../../state/product/energy_standard_economics.json';
import economicLaunchReadiness from '../../../state/product/economic_launch_readiness.json';

const NET_SPK_PER_KWH = Number(energyStandard.issuance_equation?.net_spk_per_kwh_after_mint_fee || 0.04995);
const DEFAULT_REQUIRED_DSCR = 1.2;
const DEFAULT_DEBT_SERVICE_YEARS = 12;

export function round(value, digits = 6) {
  const scale = 10 ** digits;
  return Math.round(Number(value) * scale) / scale;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value)));
}

function annualDebtService(capexUsd, years = DEFAULT_DEBT_SERVICE_YEARS) {
  return capexUsd / years;
}

function statusFromScenario({ hasMeterProof, dscr, supportGapUsd }) {
  if (!hasMeterProof) return 'model_only';
  if (supportGapUsd > 0 || dscr < DEFAULT_REQUIRED_DSCR) return 'pilot_needs_terms';
  return 'pilot_candidate';
}

export function defaultSiteControls(site) {
  return {
    siteId: site.id,
    capacityKw: Number(site.system_capacity_kw || 10),
    exportPct: 45,
    energyPriceUsdPerKwh: 0.05,
    capexUsdPerWdc: 3.15,
    supportUsd: 0,
    hasMeterProof: false,
  };
}

export function calculateSitePilotScenario(site, controls) {
  const capacityKw = clamp(controls.capacityKw, 1, 20_000);
  const exportFraction = clamp(controls.exportPct / 100, 0, 1);
  const energyPriceUsdPerKwh = clamp(controls.energyPriceUsdPerKwh, 0, 5);
  const capexUsdPerWdc = clamp(controls.capexUsdPerWdc, 0, 20);
  const supportUsd = Math.max(0, Number(controls.supportUsd || 0));
  const baseCapacityKw = Number(site.system_capacity_kw || 10);
  const annualGenerationKwh = Number(site.annual_ac_kwh) * (capacityKw / baseCapacityKw);
  const eligibleSurplusKwh = annualGenerationKwh * exportFraction;
  const netSpkPreview = eligibleSurplusKwh * NET_SPK_PER_KWH;
  const annualEnergyValueUsd = eligibleSurplusKwh * energyPriceUsdPerKwh;
  const grossValueWithSupportUsd = annualEnergyValueUsd + supportUsd;
  const capexUsd = capacityKw * 1000 * capexUsdPerWdc;
  const annualDebtServiceUsd = annualDebtService(capexUsd);
  const dscr = annualDebtServiceUsd > 0 ? grossValueWithSupportUsd / annualDebtServiceUsd : Infinity;
  const requiredAnnualValueUsd = annualDebtServiceUsd * DEFAULT_REQUIRED_DSCR;
  const supportGapUsd = Math.max(0, requiredAnnualValueUsd - grossValueWithSupportUsd);
  const simplePaybackYears = grossValueWithSupportUsd > 0 ? capexUsd / grossValueWithSupportUsd : Infinity;
  const requiredEnergyPriceUsdPerKwh = eligibleSurplusKwh > 0
    ? Math.max(0, (requiredAnnualValueUsd - supportUsd) / eligibleSurplusKwh)
    : Infinity;
  const economicsCleared = dscr >= DEFAULT_REQUIRED_DSCR && supportGapUsd === 0;
  const hasMeterProof = Boolean(controls.hasMeterProof);

  return {
    site_id: site.id,
    label: site.label,
    region: site.region,
    production_tier: site.production_tier,
    weather_data_source: site.weather_data_source,
    capacity_kw: round(capacityKw, 4),
    export_pct: round(exportFraction * 100, 4),
    annual_generation_kwh: round(annualGenerationKwh, 4),
    eligible_surplus_kwh: round(eligibleSurplusKwh, 4),
    net_spk_preview: round(netSpkPreview, 6),
    annual_energy_value_usd: round(annualEnergyValueUsd, 2),
    support_usd: round(supportUsd, 2),
    gross_value_with_support_usd: round(grossValueWithSupportUsd, 2),
    capex_usd: round(capexUsd, 2),
    annual_debt_service_usd: round(annualDebtServiceUsd, 2),
    dscr: round(dscr, 6),
    required_dscr: DEFAULT_REQUIRED_DSCR,
    support_gap_usd: round(supportGapUsd, 2),
    simple_payback_years: Number.isFinite(simplePaybackYears) ? round(simplePaybackYears, 4) : null,
    required_energy_price_usd_per_kwh: Number.isFinite(requiredEnergyPriceUsdPerKwh)
      ? round(requiredEnergyPriceUsdPerKwh, 6)
      : null,
    economics_cleared: economicsCleared,
    status: statusFromScenario({ hasMeterProof, dscr, supportGapUsd }),
    readiness: [
      {
        id: 'modeled_resource',
        label: 'Modeled solar resource',
        pass: true,
        detail: `${site.label} has a PVWatts baseline of ${round(Number(site.annual_ac_kwh), 2)} kWh/year per 10 kW.`,
      },
      {
        id: 'signed_meter_data',
        label: 'Signed meter/inverter export',
        pass: hasMeterProof,
        detail: hasMeterProof
          ? 'Real operator data can enter the attestation pipeline.'
          : 'Still model-only: upload/export signed meter or inverter rows before real SPK minting.',
      },
      {
        id: 'economics',
        label: 'Pilot economics',
        pass: economicsCleared,
        detail: economicsCleared
          ? `Scenario clears ${DEFAULT_REQUIRED_DSCR}x DSCR under the selected terms.`
          : `Needs ${round(supportGapUsd, 2)} USD/year support or about ${round(requiredEnergyPriceUsdPerKwh, 4)} USD/kWh realized value.`,
      },
    ],
    intake_files: [
      'meter_id, timestamp, cumulative_generation_kwh, cumulative_export_kwh',
      'inverter or revenue-meter serial/source identifier',
      'site capacity, location, tariff/PPA/support terms',
      'operator signature key or gateway signing process',
    ],
    benchmark_context: {
      current_lowest_support_gap_usd: economicLaunchReadiness.minimum_support_needed?.minimum_annual_support_required_usd ?? null,
      public_lab_status: economicLaunchReadiness.launch_decision?.public_lab ?? 'unknown',
      closed_pilot_status: economicLaunchReadiness.launch_decision?.closed_pilot ?? 'unknown',
    },
  };
}
