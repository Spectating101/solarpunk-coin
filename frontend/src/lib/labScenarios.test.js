import { describe, expect, it } from 'vitest';
import { createSimulation, issueSpk, paySpk } from './currencyLab';
import { runGuidedDemo, runSafeScenario } from './labScenarios';

const EVIDENCE = {
  evidenceHash: 'a'.repeat(64),
  issuanceCapSpk: 33.8,
  surplusKwh: 33.8,
  issuanceEligible: true,
};

describe('public workbench scenarios', () => {
  it('rejects shortfall stress before issuance instead of creating capacity', () => {
    const sim = createSimulation(EVIDENCE);
    const result = runSafeScenario(sim, 'shortfall');

    expect(result.ok).toBe(false);
    expect(result.sim.balances.settlement_capacity_spk).toBe(0);
    expect(result.sim.events.at(-1).type).toBe('SCENARIO_REJECTED');
  });

  it('shortfall stress only reduces existing capacity', () => {
    let sim = createSimulation(EVIDENCE);
    sim = issueSpk(sim, 20).sim;
    sim = paySpk(sim, { type: 'SERVICE', amount: 5 }).sim;
    const walletBefore = sim.balances.remaining_spk;

    const result = runSafeScenario(sim, 'shortfall');

    expect(result.severity).toBe('warning');
    expect(result.obligation.settlement_capacity_spk).toBe(8);
    expect(result.obligation.outstanding_claim_spk).toBe(20);
    expect(result.obligation.shortfall_spk).toBe(12);
    expect(walletBefore).toBe(15);
  });

  it('runs a deterministic guided walkthrough from a fresh evidence state', () => {
    const first = runGuidedDemo(EVIDENCE);
    const second = runGuidedDemo(EVIDENCE);

    expect(first.ok).toBe(true);
    expect(first.severity).toBe('warning');
    expect(first.walkthrough_complete).toBe(true);
    expect(first.sim.balances.issued_spk).toBe(20);
    expect(first.sim.payments[0].type).toBe('SERVICE');
    expect(first.obligation.shortfall_spk).toBe(12);
    expect(first.sim.events.map((event) => event.type)).toEqual(
      second.sim.events.map((event) => event.type),
    );
    expect(first.sim.events.at(-1).type).toBe('GUIDED_WALKTHROUGH_COMPLETE');
  });

  it('fails closed when evidence has no admissible issuance basis', () => {
    const result = runGuidedDemo({
      ...EVIDENCE,
      issuanceCapSpk: 0,
      issuanceEligible: false,
    });

    expect(result.ok).toBe(false);
    expect(result.sim.events.at(-1).type).toBe('GUIDED_WALKTHROUGH_REJECTED');
  });
});
