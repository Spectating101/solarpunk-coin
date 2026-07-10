/**
 * Off-chain Currency Lab simulation. Deterministic. No chain calls.
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
    tip: 'Issuance cannot exceed the evidence-derived cap. Duplicate evidence hashes are blocked.',
  },
  {
    id: 'pricing',
    label: 'Explicit risk treatment',
    tip: 'USD/kWh is expression only. Peg stays off. Simulation does not invent a market price.',
  },
  {
    id: 'settlement',
    label: 'Settlement accounting',
    tip: 'Redemption obligations and shortfalls are recorded explicitly — not hidden.',
  },
  {
    id: 'governance',
    label: 'Constrained governance',
    tip: 'Overrides that bypass evidence or caps are blocked unless explicitly gated as research demos.',
  },
];

/**
 * @param {{ evidenceHash: string, issuanceCapSpk: number, surplusKwh: number }} evidence
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
      consumed_for_mint: false,
    },
    balances: {
      issued_spk: 0,
      circulating_spk: 0,
      paid_spk: 0,
      redeemed_spk: 0,
      remaining_spk: 0,
    },
    payments: [],
    obligations: [],
    events: [
      {
        t: 0,
        type: 'SIMULATION_STARTED',
        constraint: 'data',
        ok: true,
        detail: 'Simulation bound to local evidence receipt (not on-chain).',
      },
    ],
    seen_evidence_hashes: [],
    governance_override_allowed: false,
  };
}

function pushEvent(sim, event) {
  sim.events.push({ t: sim.events.length, ...event });
}

export function issueSpk(sim, amount) {
  const next = structuredClone(sim);
  const cap = next.evidence.issuance_cap_spk;
  const qty = Number(amount);

  if (!Number.isFinite(qty) || qty <= 0) {
    pushEvent(next, {
      type: 'ISSUE_REJECTED',
      constraint: 'issuance',
      ok: false,
      detail: 'Issuance amount must be a positive number.',
    });
    return { ok: false, sim: next, error: 'Invalid issuance amount' };
  }

  if (qty > cap + 1e-9) {
    pushEvent(next, {
      type: 'ISSUE_REJECTED',
      constraint: 'issuance',
      ok: false,
      detail: `Requested ${qty} SPK exceeds cap ${cap} SPK.`,
    });
    return { ok: false, sim: next, error: 'Issuance exceeds evidence cap' };
  }

  if (next.evidence.consumed_for_mint) {
    pushEvent(next, {
      type: 'ISSUE_REJECTED',
      constraint: 'issuance',
      ok: false,
      detail: 'This evidence hash was already used for simulated issuance (replay blocked).',
    });
    return { ok: false, sim: next, error: 'Duplicate evidence blocked' };
  }

  if (next.seen_evidence_hashes.includes(next.evidence.evidence_hash)) {
    pushEvent(next, {
      type: 'ISSUE_REJECTED',
      constraint: 'issuance',
      ok: false,
      detail: 'Replay: evidence hash already consumed in this simulation.',
    });
    return { ok: false, sim: next, error: 'Duplicate evidence blocked' };
  }

  next.balances.issued_spk = Number(qty.toFixed(6));
  next.balances.circulating_spk = Number(qty.toFixed(6));
  next.balances.remaining_spk = Number(qty.toFixed(6));
  next.evidence.consumed_for_mint = true;
  next.seen_evidence_hashes.push(next.evidence.evidence_hash);

  pushEvent(next, {
    type: 'ISSUED',
    constraint: 'issuance',
    ok: true,
    detail: `Issued ${qty} simulated SPK against evidence hash ${next.evidence.evidence_hash.slice(0, 12)}…`,
    amount: qty,
  });

  return { ok: true, sim: next };
}

export function paySpk(sim, { type, amount, note }) {
  const next = structuredClone(sim);
  const qty = Number(amount);
  const paymentType = String(type || '').toUpperCase();

  if (!PAYMENT_TYPES.includes(paymentType)) {
    pushEvent(next, {
      type: 'PAYMENT_REJECTED',
      constraint: 'settlement',
      ok: false,
      detail: `Unknown payment type ${type}. Use SERVICE, LABOR, GOODS, or NETWORK.`,
    });
    return { ok: false, sim: next, error: 'Invalid payment type' };
  }

  if (!Number.isFinite(qty) || qty <= 0) {
    pushEvent(next, {
      type: 'PAYMENT_REJECTED',
      constraint: 'settlement',
      ok: false,
      detail: 'Payment amount must be positive.',
    });
    return { ok: false, sim: next, error: 'Invalid payment amount' };
  }

  if (qty > next.balances.remaining_spk + 1e-9) {
    pushEvent(next, {
      type: 'PAYMENT_REJECTED',
      constraint: 'settlement',
      ok: false,
      detail: `Insufficient remaining balance (${next.balances.remaining_spk} SPK).`,
    });
    return { ok: false, sim: next, error: 'Insufficient balance' };
  }

  next.balances.remaining_spk = Number((next.balances.remaining_spk - qty).toFixed(6));
  next.balances.paid_spk = Number((next.balances.paid_spk + qty).toFixed(6));
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
    detail: `Paid ${qty} SPK as ${paymentType}.`,
    payment,
  });

  return { ok: true, sim: next };
}

/**
 * Create a redemption obligation. If amount > remaining + reserves metaphor,
 * surface shortfall explicitly.
 */
export function createObligation(sim, amountSpk) {
  const next = structuredClone(sim);
  const qty = Number(amountSpk);
  if (!Number.isFinite(qty) || qty <= 0) {
    return { ok: false, sim: next, error: 'Invalid obligation amount' };
  }

  const available = next.balances.remaining_spk;
  const shortfall = Math.max(0, Number((qty - available).toFixed(6)));
  const covered = Number(Math.min(qty, available).toFixed(6));

  const obligation = {
    id: next.obligations.length + 1,
    requested_spk: qty,
    covered_spk: covered,
    shortfall_spk: shortfall,
    status: shortfall > 0 ? 'SHORTFALL' : 'COVERED',
  };
  next.obligations.push(obligation);

  if (covered > 0) {
    next.balances.remaining_spk = Number((next.balances.remaining_spk - covered).toFixed(6));
    next.balances.redeemed_spk = Number((next.balances.redeemed_spk + covered).toFixed(6));
    next.balances.circulating_spk = Number(
      (next.balances.issued_spk - next.balances.redeemed_spk).toFixed(6),
    );
  }

  pushEvent(next, {
    type: shortfall > 0 ? 'SETTLEMENT_SHORTFALL' : 'SETTLEMENT_OK',
    constraint: 'settlement',
    ok: shortfall === 0,
    detail:
      shortfall > 0
        ? `Settlement shortfall of ${shortfall} SPK recorded explicitly.`
        : `Settlement obligation of ${qty} SPK covered.`,
    obligation,
  });

  return { ok: true, sim: next, obligation };
}

export function attemptDuplicateEvidence(sim) {
  const next = structuredClone(sim);
  pushEvent(next, {
    type: 'DUPLICATE_EVIDENCE_BLOCKED',
    constraint: 'issuance',
    ok: false,
    detail: 'Replay of the same evidence hash is blocked by the issuance constraint.',
  });
  return { ok: false, sim: next, error: 'Duplicate evidence blocked' };
}

export function attemptGovernanceOverride(sim, { allow = false } = {}) {
  const next = structuredClone(sim);
  if (!allow && !next.governance_override_allowed) {
    pushEvent(next, {
      type: 'GOVERNANCE_OVERRIDE_BLOCKED',
      constraint: 'governance',
      ok: false,
      detail: 'Governance override that bypasses evidence caps is blocked in the public lab simulation.',
    });
    return { ok: false, sim: next, error: 'Governance override blocked' };
  }

  next.governance_override_allowed = true;
  pushEvent(next, {
    type: 'GOVERNANCE_OVERRIDE_GATED',
    constraint: 'governance',
    ok: true,
    detail: 'Override flagged as explicitly gated research demo — not production authority.',
  });
  return { ok: true, sim: next };
}

export function runScenario(sim, name) {
  switch (name) {
    case 'shortfall':
      return createObligation(sim, (sim.balances.remaining_spk || 0) + 5);
    case 'duplicate':
      return attemptDuplicateEvidence(sim);
    case 'governance':
      return attemptGovernanceOverride(sim, { allow: false });
    case 'normal':
      return createObligation(sim, Math.min(1, sim.balances.remaining_spk || 0) || 0);
    default:
      return { ok: false, sim, error: `Unknown scenario: ${name}` };
  }
}
