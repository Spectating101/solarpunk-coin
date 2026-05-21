import { describe, expect, it } from 'vitest';
import nrelMapScenarios from '../../../state/product/nrel_solar_map_scenarios.json';
import {
  calculateSitePilotScenario,
  defaultSiteControls,
} from './sitePilotModel';

const phoenix = nrelMapScenarios.map_points.find((site) => site.id === 'phoenix_10kw');

describe('calculateSitePilotScenario', () => {
  it('turns a modeled NREL site into an SPK pilot preview', () => {
    const scenario = calculateSitePilotScenario(phoenix, {
      ...defaultSiteControls(phoenix),
      capacityKw: 100,
      exportPct: 50,
      energyPriceUsdPerKwh: 0.05,
      capexUsdPerWdc: 3,
      supportUsd: 0,
      hasMeterProof: false,
    });

    expect(scenario.annual_generation_kwh).toBeGreaterThan(170_000);
    expect(scenario.eligible_surplus_kwh).toBeGreaterThan(80_000);
    expect(scenario.net_spk_preview).toBeGreaterThan(4_000);
    expect(scenario.status).toBe('model_only');
    expect(scenario.readiness.find((item) => item.id === 'signed_meter_data').pass).toBe(false);
  });

  it('can become a pilot candidate only when evidence and economics clear', () => {
    const scenario = calculateSitePilotScenario(phoenix, {
      ...defaultSiteControls(phoenix),
      capacityKw: 100,
      exportPct: 80,
      energyPriceUsdPerKwh: 0.35,
      capexUsdPerWdc: 1,
      supportUsd: 5000,
      hasMeterProof: true,
    });

    expect(scenario.economics_cleared).toBe(true);
    expect(scenario.status).toBe('pilot_candidate');
    expect(scenario.support_gap_usd).toBe(0);
    expect(scenario.readiness.every((item) => item.pass)).toBe(true);
  });
});
