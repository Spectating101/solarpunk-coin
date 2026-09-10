import React, { useEffect, useMemo, useState } from 'react';
import assumptions from '../../../benchmark/gauntlet/policy-assumptions.v1.json';
import { PUBLIC_EVIDENCE_CHECKPOINT as checkpoint } from '../data/publicEvidenceCheckpoint';
import { evaluateCaseRun, WORKBENCH_RUNTIME } from '../lib/caseWorkbenchRuntime';
import { formatQuantity, humanize, shortHash } from './platform/PlatformSurface';

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
  if (!run?.decision) return { primary: '…', secondary: 'evaluating', state: 'pending' };
  if (run.decision.decision === 'BLOCKED') {
    return {
      primary: 'BLOCKED',
      secondary: humanize(run.decision.admission.blocking_rules[0]),
      state: 'blocked',
    };
  }
  return {
    primary: formatQuantity(run.decision.capacity.admitted_maximum),
    secondary: humanize(run.decision.capacity.binding_constraints[0]),
    state: 'bounded',
  };
}

function MatrixCell({ run }) {
  const value = decisionText(run);
  return (
    <div className="pl-matrix-cell" data-state={value.state}>
      <strong>{value.primary}</strong>
      <span>{value.secondary}</span>
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

  const total = checkpoint.decisions.open.admitted_maximum;
  const coveredPct = total > 0 ? (checkpoint.settlement.covered_quantity / total) * 100 : 0;
  const shortfallPct = 100 - coveredPct;

  return (
    <section className="judge-evidence-surface" aria-labelledby="judge-evidence-title">
      <header className="pl-context-bar">
        <div className="pl-context-title">
          <span>PUBLIC CHECKPOINT</span>
          <h2 id="judge-evidence-title">{checkpoint.case_id}</h2>
        </div>
        <div className="pl-context-meta" aria-label="Checkpoint metadata">
          <span>{checkpoint.source.publisher}</span>
          <span>{checkpoint.source.selected_window.join(' → ')}</span>
          <span>{checkpoint.evidence.assurance}</span>
          <span>replay {checkpoint.verification.decision_reproduction}</span>
          <code>{shortHash(checkpoint.provenance.evaluated_revision, 10, 7)}</code>
        </div>
      </header>

      <div className="pl-mechanic-stage">
        <div className="pl-evidence-source">
          <span className="pl-stage-label">EVIDENCE</span>
          <strong>{formatQuantity(checkpoint.evidence.total_eligible_surplus_kwh)}</strong>
          <b>kWh</b>
          <small>{checkpoint.source.interval_count} × 30 min · {checkpoint.evidence.assurance}</small>
          <code>{shortHash(checkpoint.evidence.evidence_hash, 11, 7)}</code>
        </div>

        <div className="pl-policy-lanes" aria-label="Observed public policy outcomes">
          <div className="pl-policy-lane admitted">
            <div className="pl-lane-name"><span>OPEN</span><code>LAB-CASE-OPEN-004</code></div>
            <div className="pl-lane-line"><i /></div>
            <div className="pl-lane-result"><strong>{formatQuantity(checkpoint.decisions.open.admitted_maximum)}</strong><span>kWh</span><small>ADMIT WITH LIMIT</small></div>
          </div>
          <div className="pl-policy-lane blocked">
            <div className="pl-lane-name"><span>PILOT</span><code>ENERGY-CASE-PILOT-005</code></div>
            <div className="pl-lane-line"><i /><em>×</em><small>provenance</small></div>
            <div className="pl-lane-result"><strong>BLOCKED</strong></div>
          </div>
        </div>
      </div>

      <div className="pl-settlement-strip">
        <div className="pl-strip-label"><span>SETTLEMENT</span><strong>40%</strong></div>
        <div className="pl-settlement-bar" aria-label="Settlement coverage and shortfall">
          <div className="covered" style={{ width: `${coveredPct}%` }}><span>{formatQuantity(checkpoint.settlement.covered_quantity)}</span></div>
          <div className="shortfall" style={{ width: `${shortfallPct}%` }}><span>{formatQuantity(checkpoint.settlement.shortfall_quantity)} short</span></div>
        </div>
        <div className="pl-strip-result">{checkpoint.settlement.result}</div>
      </div>

      <div className="pl-lower-grid">
        <section className="pl-causal-block" aria-labelledby="pl-causal-title">
          <header>
            <div><span>TYN-001</span><h3 id="pl-causal-title">Controlled comparison</h3></div>
            <div className="pl-same-evidence" data-locked={evidenceLocked ? 'true' : 'false'}>
              <span>same evidence</span><code>{shortHash(evidenceHash, 9, 6)}</code><strong>{evidenceLocked ? '✓' : '…'}</strong>
            </div>
          </header>
          {experimentError ? <p className="record-error" role="alert">{experimentError}</p> : null}
          <div className="pl-causal-matrix" role="table" aria-label="Same evidence policy and assurance comparison">
            <div className="pl-matrix-corner" />
            <div className="pl-matrix-head">OPEN</div>
            <div className="pl-matrix-head">PILOT</div>
            <div className="pl-matrix-rowhead"><strong>L0</strong><span>actual</span></div>
            <MatrixCell run={runs?.l0Open} />
            <MatrixCell run={runs?.l0Pilot} />
            <div className="pl-matrix-rowhead"><strong>L2*</strong><span>declared</span></div>
            <MatrixCell run={runs?.l2Open} />
            <MatrixCell run={runs?.l2Pilot} />
          </div>
          <footer><span>* counterfactual assurance only</span><button type="button" onClick={openComparison}>compare policies →</button></footer>
        </section>

        <section className="pl-sensitivity-block" aria-labelledby="pl-sensitivity-title">
          <header><span>L2 MULTIPLIER</span><h3 id="pl-sensitivity-title">Sensitivity</h3></header>
          <div className="pl-sensitivity-chart" aria-label="L2 multiplier sensitivity">
            {sensitivity.map((item) => {
              const pct = openL2Maximum ? (item.quantity / openL2Maximum) * 100 : 0;
              const current = item.multiplier === l2Assumption.expected_current_value;
              return (
                <div key={item.multiplier} className={current ? 'current' : ''}>
                  <div className="pl-sensitivity-bar"><i style={{ height: `${pct}%` }} /></div>
                  <strong>{formatQuantity(item.quantity)}</strong>
                  <span>{item.multiplier.toFixed(1)}×{current ? ' · current' : ''}</span>
                </div>
              );
            })}
          </div>
          <small>research-policy assumption · not empirically calibrated</small>
        </section>

        <aside className="pl-trace-block" aria-label="Trace">
          <span className="pl-stage-label">TRACE</span>
          <div><span>assessment</span><code>{shortHash(checkpoint.verification.assessment_id, 11, 7)}</code></div>
          <div><span>runtime</span><code>{shortHash(WORKBENCH_RUNTIME.source_revision, 11, 7)}</code></div>
          <div><span>R1/R2/R3/R4</span><code>{Object.values(checkpoint.boundaries).join(' · ')}</code></div>
          <div className="pl-scope-line">public-data operability only · not meter truth, legal authority, or monetary performance</div>
        </aside>
      </div>
    </section>
  );
}
