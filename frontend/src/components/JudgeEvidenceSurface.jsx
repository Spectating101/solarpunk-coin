import React, { useEffect, useMemo, useState } from 'react';
import assumptions from '../../../benchmark/gauntlet/policy-assumptions.v1.json';
import { PUBLIC_EVIDENCE_CHECKPOINT as checkpoint } from '../data/publicEvidenceCheckpoint';
import { evaluateCaseRun, WORKBENCH_RUNTIME } from '../lib/caseWorkbenchRuntime';
import { formatQuantity, humanize, shortHash } from './platform/PlatformSurface';
import '../styles/policyCausalCanvas.css';
import '../styles/policyCausalCanvasAccuracy.css';

const REFERENCE_CASE = 'TYN-001';
const OPEN_POLICY = 'LAB-CASE-OPEN-004';
const PILOT_POLICY = 'ENERGY-CASE-PILOT-005';
const L0 = 'PROVENANCE-L0-BASE';
const L2 = 'PROVENANCE-L2-COUNTERFACTUAL';

const EXPERIMENT = Object.freeze([
  ['l0Open', OPEN_POLICY, L0],
  ['l0Pilot', PILOT_POLICY, L0],
  ['l2Open', OPEN_POLICY, L2],
  ['l2Pilot', PILOT_POLICY, L2],
]);

function decisionText(run) {
  if (!run?.decision) return { primary: '…', secondary: 'evaluating', state: 'pending', quantity: 0 };
  if (run.decision.decision === 'BLOCKED') {
    return {
      primary: 'BLOCKED',
      secondary: humanize(run.decision.admission.blocking_rules[0]),
      state: 'blocked',
      quantity: 0,
    };
  }
  return {
    primary: formatQuantity(run.decision.capacity.admitted_maximum),
    secondary: humanize(run.decision.capacity.binding_constraints[0]),
    state: 'bounded',
    quantity: run.decision.capacity.admitted_maximum,
  };
}

function UnitMass({ empty = false, className = '' }) {
  return (
    <div className={`pl5-claim-mass${empty ? ' empty' : ''}${className ? ` ${className}` : ''}`} aria-hidden="true">
      {Array.from({ length: 10 }, (_, index) => <i key={index} />)}
    </div>
  );
}

function MiniDecision({ run, referenceMaximum }) {
  const value = decisionText(run);
  const ratio = value.state === 'bounded' && referenceMaximum > 0
    ? Math.max(0, Math.min(1, value.quantity / referenceMaximum))
    : 0;
  const filled = Math.round(ratio * 10);

  return (
    <div className="pl5-mini-cell" data-state={value.state}>
      <div className="pl5-mini-flow" aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <i key={index} className={index < filled ? '' : 'off'} />
        ))}
      </div>
      <div className="pl5-mini-value">
        <strong>{value.primary}</strong>
        <small>{value.secondary}</small>
      </div>
    </div>
  );
}

export default function JudgeEvidenceSurface({ onNavigate }) {
  const [runs, setRuns] = useState(null);
  const [experimentError, setExperimentError] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.all(EXPERIMENT.map(async ([key, policyId, scenarioId]) => [
      key,
      await evaluateCaseRun({ caseId: REFERENCE_CASE, policyId, scenarioId }),
    ])).then((entries) => {
      if (!active) return;
      setRuns(Object.fromEntries(entries));
      setExperimentError(null);
    }).catch((error) => {
      if (!active) return;
      setExperimentError(error?.message || String(error));
    });
    return () => { active = false; };
  }, []);

  const evidenceHashes = useMemo(() => (
    runs ? EXPERIMENT.map(([key]) => runs[key]?.evidence?.evidence_hash).filter(Boolean) : []
  ), [runs]);
  const evidenceLocked = evidenceHashes.length === EXPERIMENT.length && new Set(evidenceHashes).size === 1;
  const evidenceHash = evidenceHashes[0] || null;

  const l2Assumption = assumptions.assumptions.find((item) => item.id === 'pilot.provenance_multiplier.L2');
  const sensitivityValues = l2Assumption?.sensitivity_values || [];
  const openL2Maximum = runs?.l2Open?.decision?.capacity?.admitted_maximum ?? null;
  const referenceMaximum = runs?.l0Open?.decision?.capacity?.admitted_maximum ?? openL2Maximum ?? 180;
  const sensitivity = openL2Maximum == null
    ? []
    : sensitivityValues.map((multiplier) => ({
      multiplier,
      quantity: Number((openL2Maximum * multiplier).toFixed(6)),
    }));

  const openComparison = () => onNavigate?.({
    section: 'compare',
    scenarioId: L0,
    baselinePolicyId: OPEN_POLICY,
    comparisonPolicyId: PILOT_POLICY,
  });

  return (
    <section className="pl5-surface" aria-labelledby="judge-evidence-title">
      <header className="pl5-topline">
        <div className="pl5-id">
          <span>PUBLIC CHECKPOINT</span>
          <h2 id="judge-evidence-title">{checkpoint.case_id}</h2>
        </div>
        <div className="pl5-meta" aria-label="Checkpoint metadata">
          <span>{checkpoint.source.publisher}</span>
          <span>{checkpoint.evidence.assurance}</span>
          <span>replay {checkpoint.verification.decision_reproduction}</span>
          <span>{checkpoint.source.selected_window.join(' → ')}</span>
        </div>
      </header>

      <div className="pl5-apparatus" aria-label="Public evidence through policy gates">
        <div className="pl5-source">
          <span className="pl5-label">EVIDENCE</span>
          <div className="pl5-mass" aria-hidden="true">
            {Array.from({ length: 10 }, (_, index) => <i key={index} />)}
          </div>
          <strong>{formatQuantity(checkpoint.evidence.total_eligible_surplus_kwh)} kWh</strong>
          <small>{checkpoint.source.interval_count} intervals · {checkpoint.evidence.assurance}</small>
          <code>{shortHash(checkpoint.evidence.evidence_hash, 10, 6)}</code>
        </div>

        <div className="pl5-paths">
          <div className="pl5-path" data-state="pass">
            <div className="pl5-path-name"><strong>OPEN</strong><small>policy</small></div>
            <div className="pl5-gate" data-state="open" aria-label="Open policy gate">
              <i className="pl5-gate-leaf" />
              <small>open</small>
            </div>
            <div className="pl5-conduit pass" aria-hidden="true" />
            <UnitMass />
            <div className="pl5-outcome">
              <strong>ADMITTED</strong>
              <small>{formatQuantity(checkpoint.decisions.open.admitted_maximum)} kWh</small>
            </div>
          </div>

          <div className="pl5-path" data-state="stop">
            <div className="pl5-path-name"><strong>PILOT</strong><small>policy</small></div>
            <div className="pl5-gate" data-state="closed" aria-label="Pilot policy gate blocked at provenance">
              <i className="pl5-gate-leaf" />
              <small>provenance</small>
            </div>
            <div className="pl5-conduit stop" aria-hidden="true" />
            <UnitMass empty />
            <div className="pl5-outcome">
              <strong>BLOCKED</strong>
              <small>no quantity exits</small>
            </div>
          </div>
        </div>
      </div>

      <div className="pl5-settlement" aria-label="Settlement coverage and shortfall">
        <div className="pl5-settlement-source">
          <span className="pl5-label">SETTLEMENT</span>
          <strong>admitted claim</strong>
        </div>
        <div className="pl5-settlement-arrow" aria-hidden="true">→</div>
        <div className="pl5-settlement-cells" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => <i key={index} className={index >= 4 ? 'short' : ''} />)}
        </div>
        <div className="pl5-settlement-result">
          <strong>{checkpoint.settlement.result}</strong>
          <small>{formatQuantity(checkpoint.settlement.covered_quantity)} covered · {formatQuantity(checkpoint.settlement.shortfall_quantity)} short</small>
        </div>
      </div>

      <div className="pl5-experiment">
        <section className="pl5-experiment-main" aria-labelledby="pl-causal-title">
          <header className="pl5-experiment-head">
            <strong id="pl-causal-title">Same evidence · different gates</strong>
            <div className="pl5-lock" data-locked={evidenceLocked ? 'true' : 'false'}>
              <span>evidence identity</span><code>{shortHash(evidenceHash, 8, 5)}</code><b>{evidenceLocked ? '✓' : '…'}</b>
            </div>
          </header>
          {experimentError ? <p className="record-error" role="alert">{experimentError}</p> : null}
          <div className="pl5-mini-table" role="table" aria-label="Same evidence policy and assurance comparison">
            <div className="pl5-mini-head" />
            <div className="pl5-mini-head">OPEN</div>
            <div className="pl5-mini-head">PILOT</div>
            <div className="pl5-mini-row"><strong>L0</strong><small>actual</small></div>
            <MiniDecision run={runs?.l0Open} referenceMaximum={referenceMaximum} />
            <MiniDecision run={runs?.l0Pilot} referenceMaximum={referenceMaximum} />
            <div className="pl5-mini-row"><strong>L2*</strong><small>declared</small></div>
            <MiniDecision run={runs?.l2Open} referenceMaximum={referenceMaximum} />
            <MiniDecision run={runs?.l2Pilot} referenceMaximum={referenceMaximum} />
          </div>
          <footer className="pl5-experiment-foot">
            <span>* assurance counterfactual; observed evidence unchanged</span>
            <button type="button" onClick={openComparison}>compare policies →</button>
          </footer>
        </section>

        <section className="pl5-sensitivity" aria-labelledby="pl-sensitivity-title">
          <header className="pl5-experiment-head">
            <strong id="pl-sensitivity-title">Policy sensitivity</strong>
            <span className="pl5-mini-label">L2 multiplier</span>
          </header>
          <div className="pl5-sensitivity-bars" aria-label="L2 multiplier sensitivity">
            {sensitivity.map((item) => {
              const pct = openL2Maximum ? (item.quantity / openL2Maximum) * 100 : 0;
              const current = item.multiplier === l2Assumption.expected_current_value;
              return (
                <div key={item.multiplier} className={current ? 'current' : ''}>
                  <div className="pl5-sensitivity-bar"><i style={{ height: `${pct}%` }} /></div>
                  <div className="pl5-sensitivity-caption">
                    <small>{item.multiplier.toFixed(1)}×{current ? ' · current' : ''}</small>
                    <b>{formatQuantity(item.quantity)}</b>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="pl5-bottom">
        <span className="pl5-scope">public source · L0 · derived surplus · no meter-truth or legal-authority promotion</span>
        <details className="pl5-trace">
          <summary>trace / scope +</summary>
          <div className="pl5-trace-grid">
            <div><span>assessment</span><code>{shortHash(checkpoint.verification.assessment_id, 11, 7)}</code></div>
            <div><span>runtime</span><code>{shortHash(WORKBENCH_RUNTIME.source_revision, 11, 7)}</code></div>
            <div><span>R1/R2/R3/R4</span><code>{Object.values(checkpoint.boundaries).join(' · ')}</code></div>
          </div>
          <div className="pl5-scope">public-data operability only · not meter truth, legal authority, or monetary performance</div>
        </details>
      </div>
    </section>
  );
}
