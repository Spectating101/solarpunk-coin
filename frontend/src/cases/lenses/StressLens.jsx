import React from 'react';
import { AlertOctagon, CheckCircle2, Gauge, ShieldAlert } from 'lucide-react';
import { useCaseWorkbench } from '../../app/CaseWorkbenchProvider';

const STRESS_OPTIONS = [
  { multiplier: 1, label: '100% capacity', note: 'base declared settlement capacity' },
  { multiplier: 0.4, label: '40% capacity', note: 'partial-coverage stress' },
  { multiplier: 0, label: '0% capacity', note: 'full shortfall stress' },
];

function resultIcon(result) {
  if (result === 'SETTLED') return <CheckCircle2 size={20} />;
  if (result === 'PARTIAL') return <ShieldAlert size={20} />;
  return <AlertOctagon size={20} />;
}

export default function StressLens() {
  const {
    activeRun,
    activeStress,
    settlementMultiplier,
    setSettlementMultiplier,
  } = useCaseWorkbench();

  if (!activeRun) return <div className="wb-lens-loading">Resolving decision…</div>;
  if (activeRun.decision.decision === 'BLOCKED') {
    return (
      <div className="stress-unavailable">
        <Gauge size={28} />
        <h2>Settlement stress is downstream of admission.</h2>
        <p>
          This case is blocked. No bounded claim exists, so the workbench will not fabricate an
          outstanding obligation or settlement shortfall. Preview an admitted counterfactual first.
        </p>
      </div>
    );
  }

  const settlement = activeStress?.settlement;
  return (
    <div className="stress-lens">
      <section className="decision-explanation admitted">
        <span className="wb-kicker">Separate settlement stage</span>
        <h2>What happens when declared settlement capacity falls?</h2>
        <p>
          The bounded decision and evidence identities stay unchanged. This lens creates a deterministic
          research claim, issues only the admitted maximum, then changes one declared settlement-capacity input.
        </p>
      </section>

      <section className="stress-control-grid">
        {STRESS_OPTIONS.map((option) => (
          <button
            type="button"
            key={option.multiplier}
            className={settlementMultiplier === option.multiplier ? 'stress-option active' : 'stress-option'}
            onClick={() => setSettlementMultiplier(option.multiplier)}
            aria-pressed={settlementMultiplier === option.multiplier}
          >
            <strong>{option.label}</strong>
            <span>{option.note}</span>
          </button>
        ))}
      </section>

      {activeStress?.available && settlement ? (
        <>
          <section className={`stress-result ${settlement.result.toLowerCase()}`}>
            <div className="stress-result-state">
              {resultIcon(settlement.result)}
              <span><small>Settlement result</small><strong>{settlement.result}</strong></span>
            </div>
            <div className="stress-metrics">
              <div><span>Outstanding</span><strong>{settlement.outstanding_claim_quantity}</strong><small>{settlement.unit}</small></div>
              <div><span>Declared capacity</span><strong>{settlement.settlement_capacity}</strong><small>{settlement.unit}</small></div>
              <div><span>Covered</span><strong>{settlement.covered_quantity}</strong><small>{settlement.unit}</small></div>
              <div><span>Shortfall</span><strong>{settlement.shortfall_quantity}</strong><small>{settlement.unit}</small></div>
            </div>
          </section>

          <section className="stress-diff-grid">
            <article>
              <span className="wb-section-label">Changed</span>
              <dl className="dossier-list wide">
                <div><dt>Settlement capacity</dt><dd>{activeStress.changed.settlement_capacity}</dd></div>
                <div><dt>Stress multiplier</dt><dd>{activeStress.multiplier}</dd></div>
                <div><dt>Constraint status</dt><dd>{activeStress.constraint.status}</dd></div>
              </dl>
            </article>
            <article>
              <span className="wb-section-label">Unchanged</span>
              <dl className="dossier-list wide">
                <div><dt>Decision ID</dt><dd><code>{activeStress.unchanged.decision_id}</code></dd></div>
                <div><dt>Policy</dt><dd>{activeStress.unchanged.policy_id}@{activeStress.unchanged.policy_version}</dd></div>
                <div><dt>Evidence hashes</dt><dd><code>{activeStress.unchanged.evidence_hashes.join(', ')}</code></dd></div>
              </dl>
            </article>
          </section>

          <section className="constraint-detail">
            <div className="constraint-detail-head">
              <span>{activeStress.constraint.calculator_id}</span>
              <code>{activeStress.constraint.status}</code>
            </div>
            <p>{activeStress.constraint.explanation}</p>
            <small>{activeStress.constraint.boundary}</small>
          </section>
        </>
      ) : <div className="wb-lens-loading">Running declared settlement scenario…</div>}
    </div>
  );
}
