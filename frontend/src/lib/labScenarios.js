import {
  attemptDuplicateEvidence,
  attemptGovernanceOverride,
  createObligation,
  createSimulation,
  issueSpk,
  paySpk,
  stressSettlementCapacity,
} from './currencyLab';

function withEvent(sim, event) {
  const next = structuredClone(sim);
  next.events.push({
    t: next.events.length,
    severity: event.ok === false ? 'error' : 'success',
    ...event,
  });
  return next;
}

function rejectScenario(sim, detail, error) {
  const next = withEvent(sim, {
    type: 'SCENARIO_REJECTED',
    constraint: 'settlement',
    ok: false,
    severity: 'error',
    detail,
  });
  return { ok: false, severity: 'error', sim: next, error };
}

/**
 * Product-facing scenario runner.
 * Settlement stress is fail-closed: it requires issued capacity and can only reduce it.
 */
export function runSafeScenario(sim, name) {
  switch (name) {
    case 'shortfall': {
      const capacity = Number(sim.balances.settlement_capacity_spk || 0);
      if (capacity <= 0) {
        return rejectScenario(
          sim,
          'Issue simulated SPK before running a settlement-capacity stress.',
          'No settlement capacity',
        );
      }
      const stressedCapacity = Number((capacity * 0.4).toFixed(6));
      if (stressedCapacity > capacity) {
        return rejectScenario(sim, 'A stress scenario cannot increase settlement capacity.', 'Invalid stress');
      }
      const stressed = stressSettlementCapacity(sim, stressedCapacity);
      if (!stressed.ok) return stressed;
      return createObligation(stressed.sim, capacity);
    }
    case 'duplicate':
      return attemptDuplicateEvidence(sim);
    case 'governance':
      return attemptGovernanceOverride(sim, { allow: false });
    case 'normal': {
      const capacity = Number(sim.balances.settlement_capacity_spk || 0);
      if (capacity <= 0) {
        return rejectScenario(
          sim,
          'No settlement capacity is available. Issue simulated SPK first.',
          'No settlement capacity',
        );
      }
      return createObligation(sim, Math.min(1, capacity));
    }
    default:
      return rejectScenario(sim, `Unknown scenario: ${name}`, `Unknown scenario: ${name}`);
  }
}

/**
 * Deterministic one-click walkthrough for the public workbench.
 * Starts from a fresh receipt-bound simulation so prior clicks cannot make the demo non-reproducible.
 */
export function runGuidedDemo(evidence) {
  let sim = createSimulation(evidence);
  const cap = Number(evidence.issuanceCapSpk || 0);
  if (!evidence.issuanceEligible || cap <= 0) {
    sim = withEvent(sim, {
      type: 'GUIDED_WALKTHROUGH_REJECTED',
      constraint: 'issuance',
      ok: false,
      severity: 'error',
      detail: 'Guided walkthrough requires an admissible surplus basis and a positive illustrative cap.',
    });
    return { ok: false, severity: 'error', sim, error: 'Issuance not eligible' };
  }

  const issuanceAmount = Number(Math.min(20, cap).toFixed(6));
  const issued = issueSpk(sim, issuanceAmount);
  if (!issued.ok) return issued;
  sim = issued.sim;

  const paymentAmount = Number(Math.min(5, issuanceAmount / 4).toFixed(6));
  if (paymentAmount > 0) {
    const paid = paySpk(sim, { type: 'SERVICE', amount: paymentAmount, note: 'guided_walkthrough' });
    if (!paid.ok) return paid;
    sim = paid.sim;
  }

  const shortfall = runSafeScenario(sim, 'shortfall');
  if (!shortfall.obligation || shortfall.obligation.shortfall_spk <= 0) return shortfall;

  const completed = withEvent(shortfall.sim, {
    type: 'GUIDED_WALKTHROUGH_COMPLETE',
    constraint: 'settlement',
    ok: true,
    severity: 'warning',
    detail: `Walkthrough complete: issued ${issuanceAmount} SPK, paid ${paymentAmount} SPK as SERVICE, then surfaced a ${shortfall.obligation.shortfall_spk} SPK settlement shortfall under explicit capacity stress.`,
  });

  return {
    ok: true,
    severity: 'warning',
    sim: completed,
    obligation: shortfall.obligation,
    walkthrough_complete: true,
  };
}
