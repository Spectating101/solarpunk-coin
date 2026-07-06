import { describe, expect, it } from 'vitest';
import energyMoneySimulation from '../../../state/product/energy_money_simulation.json';
import { calculateEnergyMoneyScenario } from '../models/energyMoneyModel';

const home = energyMoneySimulation.archetypes.find((archetype) => archetype.id === 'rooftop_home_10kw');

describe('calculateEnergyMoneyScenario', () => {
  it('conserves redeemed energy into delivered energy plus shortfall', () => {
    const scenario = calculateEnergyMoneyScenario(home, {
      capacityKw: 10,
      selfConsumptionPct: 55,
      redemptionPct: 35,
      velocity: 1.5,
      shortfallPct: 1,
      reserveUsd: 5,
    });

    expect(scenario.annualized.netMintedSpk).toBeGreaterThan(0);
    expect(scenario.annualized.conservationPass).toBe(true);
    expect(scenario.annualized.reserveGapUsd).toBe(0);
  });

  it('increases reserve gap when redemption and delivery shortfall are stressed', () => {
    const scenario = calculateEnergyMoneyScenario(home, {
      capacityKw: 1000,
      selfConsumptionPct: 20,
      redemptionPct: 100,
      velocity: 3,
      shortfallPct: 30,
      reserveUsd: 0,
    });

    expect(scenario.annualized.reserveGapUsd).toBeGreaterThan(0);
    expect(scenario.annualized.shortfallLiabilityUsd).toBeGreaterThan(scenario.annualized.feeBufferUsd);
  });
});
