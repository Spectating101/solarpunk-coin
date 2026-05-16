import energyMoneySimulation from '../../../state/product/energy_money_simulation.json';
import energyStandard from '../../../state/product/energy_standard_economics.json';

export const SPK_KWH_BASIS = Number(energyStandard.current_monetary_state.kwh_per_1_spk_at_current_basis);

const ENERGY_PRICE_USD = Number(energyMoneySimulation.input_basis.energy_price_usd_per_kwh);
const SPK_USD_BASIS = SPK_KWH_BASIS * ENERGY_PRICE_USD;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value)));
}

export function round(value, digits = 6) {
  const scale = 10 ** digits;
  return Math.round(Number(value) * scale) / scale;
}

export function controlsFromArchetype(archetype) {
  const assumptions = archetype.assumptions;
  return {
    capacityKw: archetype.capacity_kw,
    selfConsumptionPct: Math.round(assumptions.self_consumption_fraction * 100),
    redemptionPct: Math.round(assumptions.redemption_fraction * 100),
    velocity: assumptions.settlement_velocity,
    shortfallPct: Number((assumptions.delivery_shortfall_fraction * 100).toFixed(1)),
    reserveUsd: assumptions.operator_reserve_usd,
  };
}

function calculateRow(row, archetype, controls, inputBasis = energyMoneySimulation.input_basis) {
  const capacityScale = Number(controls.capacityKw) / Number(archetype.capacity_kw);
  const selfConsumption = clamp(controls.selfConsumptionPct / 100, 0, 0.95);
  const redemption = clamp(controls.redemptionPct / 100, 0, 1);
  const velocity = clamp(controls.velocity, 0, 10);
  const shortfall = clamp(controls.shortfallPct / 100, 0, 0.8);
  const mintFee = Number(inputBasis.mint_fee_bps) / 10_000;
  const redemptionFee = Number(inputBasis.redemption_fee_bps) / 10_000;
  const settlementFee = Number(inputBasis.settlement_fee_bps) / 10_000;

  const generationKwh = Number(row.generation_kwh) * capacityScale;
  const eligibleSurplusKwh = generationKwh * (1 - selfConsumption);
  const grossSpk = eligibleSurplusKwh / SPK_KWH_BASIS;
  const mintFeeSpk = grossSpk * mintFee;
  const netMintedSpk = grossSpk - mintFeeSpk;
  const settlementVolumeSpk = netMintedSpk * velocity;
  const redeemedSpk = netMintedSpk * redemption;
  const redemptionFeeSpk = redeemedSpk * redemptionFee;
  const settlementFeeSpk = settlementVolumeSpk * settlementFee;
  const owedKwh = redeemedSpk * SPK_KWH_BASIS;
  const deliveredKwh = owedKwh * (1 - shortfall);
  const shortfallKwh = owedKwh - deliveredKwh;
  const shortfallLiabilityUsd = shortfallKwh * ENERGY_PRICE_USD;
  const feeBufferUsd = (mintFeeSpk + redemptionFeeSpk + settlementFeeSpk) * SPK_USD_BASIS;

  return {
    date: row.date,
    resourceIndex: Number(row.normalised_resource_index),
    generationKwh,
    eligibleSurplusKwh,
    grossSpk,
    mintFeeSpk,
    netMintedSpk,
    settlementVolumeSpk,
    redeemedSpk,
    redemptionFeeSpk,
    owedKwh,
    deliveredKwh,
    shortfallKwh,
    shortfallLiabilityUsd,
    feeBufferUsd,
  };
}

function sumRows(rows) {
  return rows.reduce((totals, row) => ({
    generationKwh: totals.generationKwh + row.generationKwh,
    eligibleSurplusKwh: totals.eligibleSurplusKwh + row.eligibleSurplusKwh,
    grossSpk: totals.grossSpk + row.grossSpk,
    netMintedSpk: totals.netMintedSpk + row.netMintedSpk,
    settlementVolumeSpk: totals.settlementVolumeSpk + row.settlementVolumeSpk,
    redeemedSpk: totals.redeemedSpk + row.redeemedSpk,
    owedKwh: totals.owedKwh + row.owedKwh,
    deliveredKwh: totals.deliveredKwh + row.deliveredKwh,
    shortfallKwh: totals.shortfallKwh + row.shortfallKwh,
    shortfallLiabilityUsd: totals.shortfallLiabilityUsd + row.shortfallLiabilityUsd,
    feeBufferUsd: totals.feeBufferUsd + row.feeBufferUsd,
  }), {
    generationKwh: 0,
    eligibleSurplusKwh: 0,
    grossSpk: 0,
    netMintedSpk: 0,
    settlementVolumeSpk: 0,
    redeemedSpk: 0,
    owedKwh: 0,
    deliveredKwh: 0,
    shortfallKwh: 0,
    shortfallLiabilityUsd: 0,
    feeBufferUsd: 0,
  });
}

export function calculateEnergyMoneyScenario(archetype, controls, simulation = energyMoneySimulation) {
  const rows = simulation.daily_rows
    .filter((row) => row.site_id === archetype.id)
    .map((row) => calculateRow(row, archetype, controls, simulation.input_basis));
  const observed = sumRows(rows);
  const annualization = Number(simulation.input_basis.annualization_factor);
  const annualized = Object.fromEntries(
    Object.entries(observed).map(([key, value]) => [key, round(value * annualization, 6)])
  );
  const reserveUsd = Number(controls.reserveUsd);
  const observedReserveGapUsd = Math.max(0, observed.shortfallLiabilityUsd - observed.feeBufferUsd - reserveUsd);
  const annualReserveGapUsd = Math.max(0, annualized.shortfallLiabilityUsd - annualized.feeBufferUsd - reserveUsd);
  const activeSupplySpk = annualized.netMintedSpk - annualized.redeemedSpk;
  const conservationPass = activeSupplySpk >= -0.000001 &&
    Math.abs((annualized.deliveredKwh + annualized.shortfallKwh) - annualized.owedKwh) < 0.0001;

  return {
    rows,
    observed: {
      ...observed,
      reserveGapUsd: round(observedReserveGapUsd, 6),
    },
    annualized: {
      ...annualized,
      reserveGapUsd: round(annualReserveGapUsd, 6),
      activeSupplySpk: round(activeSupplySpk, 6),
      conservationPass,
    },
  };
}
