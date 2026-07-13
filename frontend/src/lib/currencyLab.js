/**
 * Off-chain Currency Lab simulation. Deterministic. No chain calls.
 * Payer wallet balance ≠ settlement/reserve capacity.
 */

export const PAYMENT_TYPES = ['SERVICE', 'LABOR', 'GOODS', 'NETWORK'];

export const CONSTRAINTS = [
  {
    id: 'data',
    label: 'Admissible energy evidence',
    tip: 'Only locally validated surplus may bound illustrative issuance. Live minting is separate and gated.',
  },
  {
    id: 'issuance',
    label: 'Rule-bound issuance',
    tip: 'Issuance cannot exceed the evidence-derived illustrative cap. Duplicate evidence hashes are blocked.',
  },
  {
    id: 'pricing',
    label: 'Explicit risk treatment',
    tip: 'USD/kWh is expression only. Peg stays off. Simulation does not invent a market price.',
  },
  {
    id: 'settlement',
    label: 'Settlement accounting',
    tip: 'Obligations are compared to explicit settlement capacity — not the payer’s spendable wallet.',
  },
  {
    id: 'governance',
    label: 'Constrained governance',
    tip: 'Overrides that bypass evidence or caps are blocked unless explicitly gated as research demos.',
  },
];

/**
 * @param {{ evidenceHash: string, issuanceCapSpk: number, surplusKwh: number, issuanceEligible?: boolean }} evidence
 */
export function createSimulation(evidence) {
  return {
    schema: 'solarpunk.public_lab.currency_simulation.v1',
    lab: 'SolarPunk Public Lab v1.0',
    status: {
      off_chain_simulation: true,
      live_mint: false,
      wallet_required: false,
    },
    evidence: {
      evidence_hash: evidence.evidenceHash,
      issuance_cap_spk: evidence.issuanceCapSpk,
      surplus_kwh: evidence.surplusKwh,
      issuance_eligible: evidence.issuanceEligible !== false,
      consumed_for_mint: false,
    },
    balances: {
      issued_spk: 0,
      circulating_spk: 0,
      paid_spk: 0,
      redeemed_spk: 0,
      remaining_spk: 0,
      settlement_capacity_spk: 0,
    },
    payments: [],
    obligations: [],
    events: [
      {
        t: 0,
        type: 'SIMULATION_STARTED',
        constraint: 'data',
        ok: true,
        severity: 'success',
        detail: 'Simulation bound to local evidence receipt (not on-chain).',
      },
    ],
    seen_evidence_hashes: [],
    governance_override_allowed: false,
  };
}

function pushEvent(sim, event) {
  sim.events.push({
    t: sim.events.length,
    severity: event.ok === false ? 'error' : 'success',
    ...event,
  });
}

export function issueSpk(sim, amount) {
  const next = structuredClone(sim);
  const cap = next.evidence.issuance_cap_spk;
  const qty = Number(amount);

  if (!next.evidence.issuance_eligible || cap <= 0) {
    pushEvent(next, {
      type: 'ISSUE_REJECTED',
      constraint: 'issuance',
      ok: false,
      severity: 'error',
      detail: 'No illustrative issuance cap: evidence lacks an admissible surplus basis.',
    });
    return { ok: false, severity: 'error', sim: next, error: 'Issuance not eligible' };
  }

  if (!Number.isFinite(qty) || qty <= 0) {
    pushEvent(next, {
      type: 'ISSUE_REJECTED',
      constraint: 'issuance',
      ok: false,
      severity: 'error',
      detail: 'Issuance amount must be a positive number.',
    });
    return { ok: false, severity: 'error', sim: next, error: 'Invalid issuance amount' };
  }

  if (qty > cap + 1e-9) {
    pushEvent(next, {
      type: 'ISSUE_REJECTED',
      constraint: 'issuance',
      ok: false,
      severity: 'error',
      detail: `Requested ${qty} SPK exceeds illustrative cap ${cap} SPK.`,
    });
    return { ok: false, severity: 'error', sim: next, error: 'Issuance exceeds evidence cap' };
  }

  if (next.evidence.consumed_for_mint || next.seen_evidence_hashes.includes(next.evidence.evidence_hash)) {
    pushEvent(next, {
      type: 'ISSUE_REJECTED',
      constraint: 'issuance',
      ok: false,
      severity: 'error',
      detail: 'Replay: evidence hash already consumed in this simulation.',
    });
    return { ok: false, severity: 'error', sim: next, error: 'Duplicate evidence blocked' };
  }

  next.balances.issued_spk = Number(qty.toFixed(6));
  next.balances.circulating_spk = Number(qty.toFixed(6));
  next.balances.remaining_spk = Number(qty.toFixed(6));
  // Illustrative baseline: settlement capacity initialized equal to issued SPK (full-cover assumption).
  // Issuance does not economically fund settlement capacity.
  next.balances.settlement_capacity_spk = Number(qty.toFixed(6));
  next.evidence.consumed_for_mint = true;
  next.seen_evidence_hashes.push(next.evidence.evidence_hash);

  pushEvent(next, {
    type: 'ISSUED',
    constraint: 'issuance',
    ok: true,
    severity: 'success',
    detail: `Issued ${qty} simulated SPK. Illustrative baseline: settlement capacity initialized equal to issued SPK (full-cover assumption).`,
    amount: qty,
  });

  return { ok: true, severity: 'success', sim: next };
}

export function paySpk(sim, { type, amount, note }) {
  const next = structuredClone(sim);
  const qty = Number(amount);
  const paymentType = String(type || '').toUpperCase();
  const capacityBefore = next.balances.settlement_capacity_spk;

  if (!PAYMENT_TYPES.includes(paymentType)) {
    pushEvent(next, {
      type: 'PAYMENT_REJECTED',
      constraint: 'settlement',
      ok: false,
      severity: 'error',
      detail: `Unknown payment type ${type}. Use SERVICE, LABOR, GOODS, or NETWORK.`,
    });
    return { ok: false, severity: 'error', sim: next, error: 'Invalid payment type' };
  }

  if (!Number.isFinite(qty) || qty <= 0) {
    pushEvent(next, {
      type: 'PAYMENT_REJECTED',
      constraint: 'settlement',
      ok: false,
      severity: 'error',
      detail: 'Payment amount must be positive.',
    });
    return { ok: false, severity: 'error', sim: next, error: 'Invalid payment amount' };
  }

  if (qty > next.balances.remaining_spk + 1e-9) {
    pushEvent(next, {
      type: 'PAYMENT_REJECTED',
      constraint: 'settlement',
      ok: false,
      severity: 'error',
      detail: `Insufficient payer wallet balance (${next.balances.remaining_spk} SPK).`,
    });
    return { ok: false, severity: 'error', sim: next, error: 'Insufficient balance' };
  }

  next.balances.remaining_spk = Number((next.balances.remaining_spk - qty).toFixed(6));
  next.balances.paid_spk = Number((next.balances.paid_spk + qty).toFixed(6));
  // Circulating = issued − redeemed (payments move SPK among holders; do not burn).
  next.balances.circulating_spk = Number(
    (next.balances.issued_spk - next.balances.redeemed_spk).toFixed(6),
  );

  const payment = {
    id: next.payments.length + 1,
    type: paymentType,
    amount_spk: qty,
    note: note || null,
  };
  next.payments.push(payment);

  pushEvent(next, {
    type: 'PAYMENT',
    constraint: 'settlement',
    ok: true,
    severity: 'success',
    detail: `Paid ${qty} SPK as ${paymentType}. Settlement capacity unchanged (${capacityBefore} SPK).`,
    payment,
  });

  if (next.balances.settlement_capacity_spk !== capacityBefore) {
    throw new Error('invariant: payments must not change settlement capacity');
  }

  return { ok: true, severity: 'success', sim: next };
}

/**
 * Settlement obligation vs explicit settlement_capacity_spk (not payer wallet).
 */
export function createObligation(sim, amountSpk) {
  const next = structuredClone(sim);
  const qty = Number(amountSpk);
  if (!Number.isFinite(qty) || qty <= 0) {
    pushEvent(next, {
      type: 'SETTLEMENT_REJECTED',
      constraint: 'settlement',
      ok: false,
      severity: 'error',
      detail: 'Invalid obligation amount.',
    });
    return { ok: false, severity: 'error', sim: next, error: 'Invalid obligation amount' };
  }

  const capacity = next.balances.settlement_capacity_spk;
  const shortfall = Math.max(0, Number((qty - capacity).toFixed(6)));
  const covered = Number(Math.min(qty, capacity).toFixed(6));

  const obligation = {
    id: next.obligations.length + 1,
    outstanding_claim_spk: qty,
    settlement_capacity_spk: capacity,
    covered_spk: covered,
    shortfall_spk: shortfall,
    status: shortfall > 0 ? 'SHORTFALL' : 'COVERED',
  };
  next.obligations.push(obligation);

  if (covered > 0) {
    next.balances.settlement_capacity_spk = Number((capacity - covered).toFixed(6));
    next.balances.redeemed_spk = Number((next.balances.redeemed_spk + covered).toFixed(6));
    next.balances.circulating_spk = Number(
      (next.balances.issued_spk - next.balances.redeemed_spk).toFixed(6),
    );
    // Redeeming also removes SPK from the payer wallet if still held there.
    const walletRedeem = Math.min(next.balances.remaining_spk, covered);
    next.balances.remaining_spk = Number((next.balances.remaining_spk - walletRedeem).toFixed(6));
  }

  const isShortfall = shortfall > 0;
  pushEvent(next, {
    type: isShortfall ? 'SETTLEMENT_SHORTFALL' : 'SETTLEMENT_OK',
    constraint: 'settlement',
    ok: !isShortfall,
    severity: isShortfall ? 'warning' : 'success',
    detail: isShortfall
      ? `Shortfall: claim ${qty} SPK, capacity was ${capacity} SPK, covered ${covered} SPK, shortfall ${shortfall} SPK.`
      : `Settlement claim ${qty} SPK covered from settlement capacity.`,
    obligation,
  });

  return {
    ok: !isShortfall,
    severity: isShortfall ? 'warning' : 'success',
    sim: next,
    obligation,
  };
}

/** Explicit capacity stress for the shortfall demo — independent of payer spend. */
export function stressSettlementCapacity(sim, newCapacity) {
  const next = structuredClone(sim);
  const before = next.balances.settlement_capacity_spk;
  const qty = Number(newCapacity);
  if (!Number.isFinite(qty) || qty < 0) {
    return { ok: false, severity: 'error', sim: next, error: 'Invalid capacity' };
  }
  next.balances.settlement_capacity_spk = Number(qty.toFixed(6));
  pushEvent(next, {
    type: 'SETTLEMENT_CAPACITY_STRESS',
    constraint: 'settlement',
    ok: true,
    severity: 'warning',
    detail: `Settlement capacity stressed from ${before} → ${qty} SPK (payer wallet unchanged at ${next.balances.remaining_spk} SPK).`,
  });
  return { ok: true, severity: 'warning', sim: next };
}

export function attemptDuplicateEvidence(sim) {
  const next = structuredClone(sim);
  pushEvent(next, {
    type: 'DUPLICATE_EVIDENCE_BLOCKED',
    constraint: 'issuance',
    ok: false,
    severity: 'error',
    detail: 'Replay of the same evidence hash is blocked by the issuance constraint.',
  });
  return { ok: false, severity: 'error', sim: next, error: 'Duplicate evidence blocked' };
}

export function attemptGovernanceOverride(sim, { allow = false } = {}) {
  const next = structuredClone(sim);
  if (!allow && !next.governance_override_allowed) {
    pushEvent(next, {
      type: 'GOVERNANCE_OVERRIDE_BLOCKED',
      constraint: 'governance',
      ok: false,
      severity: 'error',
      detail: 'Governance override that bypasses evidence caps is blocked in the public lab simulation.',
    });
    return { ok: false, severity: 'error', sim: next, error: 'Governance override blocked' };
  }

  next.governance_override_allowed = true;
  pushEvent(next, {
    type: 'GOVERNANCE_OVERRIDE_GATED',
    constraint: 'governance',
    ok: true,
    severity: 'warning',
    detail: 'Override flagged as explicitly gated research demo — not production authority.',
  });
  return { ok: true, severity: 'warning', sim: next };
}

export function runScenario(sim, name) {
  switch (name) {
    case 'shortfall': {
      const claim = Math.max(10, Number((sim.balances.settlement_capacity_spk || 0).toFixed(6)));
      const stressed = stressSettlementCapacity(sim, Number((claim * 0.4).toFixed(6)));
      return createObligation(stressed.sim, claim);
    }
    case 'duplicate':
      return attemptDuplicateEvidence(sim);
    case 'governance':
      return attemptGovernanceOverride(sim, { allow: false });
    case 'normal': {
      const claim = Math.min(1, sim.balances.settlement_capacity_spk || 0);
      if (claim <= 0) {
        const next = structuredClone(sim);
        pushEvent(next, {
          type: 'SETTLEMENT_REJECTED',
          constraint: 'settlement',
          ok: false,
          severity: 'error',
          detail: 'No settlement capacity available for a normal settlement demo. Issue SPK first.',
        });
        return { ok: false, severity: 'error', sim: next, error: 'No settlement capacity' };
      }
      return createObligation(sim, claim);
    }
    default:
      return { ok: false, severity: 'error', sim, error: `Unknown scenario: ${name}` };
  }
}
