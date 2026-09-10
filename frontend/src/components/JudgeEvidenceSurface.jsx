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
  if (!run?.decision) return { primary: 'evaluating', secondary: '' };
  if (run.decision.decision === 'BLOCKED') {
    return {
      primary: 'BLOCKED',
      secondary: humanize(run.decision.admission.blocking_rules[0]),
    };
  }
  return {
    primary: formatQuantity(run.decision.capacity.admitted_maximum),
    secondary: humanize(run.decision.capacity.binding_constraints[0]),
  };
}

function DecisionCell({ run }) {
  const value = decisionText(run);
  return (
    <td>
      <strong>{value.primary}</strong>
      {value.secondary ? <span>{value.secondary}</span> : null}
    </td>
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

  return (
    <section className="judge-evidence-surface" aria-labelledby="judge-evidence-title">
      <header className="record-header">
        <div className="record-classification">Policy Lab / claim assessment record</div>
        <div className="record-heading-row">
          <div>
            <h2 id="judge-evidence-title">{checkpoint.case_id}</h2>
            <p>Ausgrid public evidence checkpoint</p>
          </div>
          <dl className="record-header-meta">
            <div><dt>Assurance</dt><dd>{checkpoint.evidence.assurance}</dd></div>
            <div><dt>Evaluated revision</dt><dd><code>{shortHash(checkpoint.provenance.evaluated_revision, 12, 8)}</code></dd></div>
          </dl>
        </div>
        <p className="record-deck">
          A bounded test of how one evidence record behaves under explicit admission, quantity and settlement rules. The public checkpoint is machine-reproduced; it is not operator validation.
        </p>
      </header>

      <section className="record-section" aria-labelledby="record-observed-title">
        <div className="record-section-number">01</div>
        <div className="record-section-body">
          <h3 id="record-observed-title">Observed checkpoint</h3>
          <table className="record-table observed-table">
            <tbody>
              <tr><th>Publisher / dataset</th><td>{checkpoint.source.publisher} / {checkpoint.source.dataset}</td></tr>
              <tr><th>Selected window</th><td>{checkpoint.source.selected_window.join(' to ')} · {checkpoint.source.interval_count} half-hour intervals</td></tr>
              <tr><th>Evidence identity</th><td><code>{shortHash(checkpoint.evidence.evidence_hash, 16, 10)}</code></td></tr>
              <tr><th>Open policy</th><td><strong>ADMIT WITH LIMIT</strong> · ceiling {formatQuantity(checkpoint.decisions.open.admitted_maximum)} kWh</td></tr>
              <tr><th>Pilot policy</th><td><strong>BLOCKED</strong> · {checkpoint.decisions.pilot.blocking_rules.map(humanize).join(', ')}</td></tr>
              <tr><th>40% settlement</th><td><strong>{checkpoint.settlement.result}</strong> · {formatQuantity(checkpoint.settlement.covered_quantity)} covered / {formatQuantity(checkpoint.settlement.shortfall_quantity)} shortfall</td></tr>
              <tr><th>Decision replay</th><td>{checkpoint.verification.decision_reproduction}</td></tr>
            </tbody>
          </table>
          <p className="record-boundary">
            <strong>Boundary.</strong> This establishes public-data operability and deterministic reproduction only. It does not establish physical meter truth, source-holder custody, legal issuance authority, enforceable redemption or monetary performance.
          </p>
        </div>
      </section>

      <section className="record-section" aria-labelledby="record-comparison-title">
        <div className="record-section-number">02</div>
        <div className="record-section-body">
          <div className="record-section-heading">
            <div>
              <h3 id="record-comparison-title">Controlled comparison</h3>
              <p>{REFERENCE_CASE}. Same evidence envelope; policy and declared assurance are the manipulated variables.</p>
            </div>
            <div className="record-hash-check">
              <span>Evidence identity</span>
              <code>{shortHash(evidenceHash, 14, 10)}</code>
              <strong>{evidenceLocked ? 'UNCHANGED' : 'VERIFYING'}</strong>
            </div>
          </div>

          {experimentError ? <p className="record-error" role="alert">Experiment error: {experimentError}</p> : null}

          <table className="record-table comparison-table" aria-label="Same evidence policy and assurance comparison">
            <thead>
              <tr>
                <th>Assurance context</th>
                <th>Open policy</th>
                <th>Pilot policy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Actual L0 <span>observed</span></th>
                <DecisionCell run={runs?.l0Open} />
                <DecisionCell run={runs?.l0Pilot} />
              </tr>
              <tr>
                <th>Declared L2* <span>counterfactual</span></th>
                <DecisionCell run={runs?.l2Open} />
                <DecisionCell run={runs?.l2Pilot} />
              </tr>
            </tbody>
          </table>
          <p className="record-footnote">* Declared L2 is a research counterfactual. It does not upgrade the underlying source evidence.</p>
          <button type="button" className="record-text-link" onClick={openComparison}>Open full policy comparison →</button>
        </div>
      </section>

      <section className="record-section" aria-labelledby="record-assumption-title">
        <div className="record-section-number">03</div>
        <div className="record-section-body">
          <h3 id="record-assumption-title">Assumption sensitivity</h3>
          <p className="record-intro">The L2 provenance multiplier is an illustrative research-policy assumption, not an empirical estimate.</p>
          <table className="record-table sensitivity-table" aria-label="L2 multiplier sensitivity">
            <thead>
              <tr><th>Multiplier</th>{sensitivity.map((item) => <th key={item.multiplier}>{item.multiplier.toFixed(1)}×{item.multiplier === l2Assumption.expected_current_value ? ' (current)' : ''}</th>)}</tr>
            </thead>
            <tbody>
              <tr><th>Admitted quantity</th>{sensitivity.map((item) => <td key={item.multiplier}>{formatQuantity(item.quantity)}</td>)}</tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="record-section record-section-last" aria-labelledby="record-trace-title">
        <div className="record-section-number">04</div>
        <div className="record-section-body">
          <h3 id="record-trace-title">Trace</h3>
          <div className="record-trace-grid">
            <div><span>Source archive SHA-256</span><code>{shortHash(checkpoint.source.archive_sha256, 18, 12)}</code></div>
            <div><span>Assessment ID</span><code>{shortHash(checkpoint.verification.assessment_id, 18, 12)}</code></div>
            <div><span>Runtime revision</span><code>{shortHash(WORKBENCH_RUNTIME.source_revision, 18, 12)}</code></div>
            <div><span>Research boundaries R1 / R2 / R3 / R4</span><code>{Object.values(checkpoint.boundaries).join(' / ')}</code></div>
          </div>
        </div>
      </section>
    </section>
  );
}
