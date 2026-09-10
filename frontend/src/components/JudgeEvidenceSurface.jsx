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
    <td data-state={value.primary === 'BLOCKED' ? 'blocked' : 'bounded'}>
      <strong>{value.primary}</strong>
      {value.secondary ? <span>{value.secondary}</span> : null}
    </td>
  );
}

function MetaRow({ label, children }) {
  return <div className="pl-meta-row"><dt>{label}</dt><dd>{children}</dd></div>;
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
      <header className="pl-context-bar">
        <div className="pl-context-title">
          <span>Public checkpoint</span>
          <h2 id="judge-evidence-title">{checkpoint.case_id}</h2>
        </div>
        <dl className="pl-context-meta">
          <MetaRow label="source">{checkpoint.source.publisher}</MetaRow>
          <MetaRow label="window">{checkpoint.source.selected_window.join(' → ')}</MetaRow>
          <MetaRow label="assurance">{checkpoint.evidence.assurance}</MetaRow>
          <MetaRow label="replay">{checkpoint.verification.decision_reproduction}</MetaRow>
          <MetaRow label="revision"><code>{shortHash(checkpoint.provenance.evaluated_revision, 10, 7)}</code></MetaRow>
        </dl>
      </header>

      <div className="pl-workspace-grid">
        <aside className="pl-pane pl-source-pane" aria-labelledby="pl-source-title">
          <header className="pl-pane-header">
            <span>01</span>
            <h3 id="pl-source-title">Evidence</h3>
          </header>
          <dl className="pl-kv-list">
            <MetaRow label="dataset">{checkpoint.source.dataset}</MetaRow>
            <MetaRow label="intervals">{checkpoint.source.interval_count} × 30 min</MetaRow>
            <MetaRow label="eligible surplus"><strong>{formatQuantity(checkpoint.evidence.total_eligible_surplus_kwh)} kWh</strong></MetaRow>
            <MetaRow label="evidence id"><code>{shortHash(checkpoint.evidence.evidence_hash, 13, 9)}</code></MetaRow>
            <MetaRow label="archive sha"><code>{shortHash(checkpoint.source.archive_sha256, 13, 9)}</code></MetaRow>
          </dl>
          <div className="pl-boundary-note">
            <strong>Scope</strong>
            <p>Public-data operability and deterministic reproduction only. This does not establish physical meter truth, source-holder custody, legal issuance authority, enforceable redemption or monetary performance.</p>
          </div>
        </aside>

        <section className="pl-pane pl-compare-pane" aria-labelledby="pl-compare-title">
          <header className="pl-pane-header pl-compare-header">
            <div><span>02</span><h3 id="pl-compare-title">Policy comparison</h3></div>
            <div className="pl-evidence-lock">
              <code>{shortHash(evidenceHash, 10, 7)}</code>
              <strong>{evidenceLocked ? 'UNCHANGED' : 'VERIFYING'}</strong>
            </div>
          </header>
          <p className="pl-compare-deck">{REFERENCE_CASE} · same evidence envelope; only policy and declared assurance change.</p>
          <p className="pl-lock-explanation">{evidenceLocked ? 'Evidence identity is unchanged across all four decisions.' : 'Checking evidence identity across all four decisions.'}</p>

          {experimentError ? <p className="record-error" role="alert">Experiment error: {experimentError}</p> : null}

          <div className="pl-table-wrap">
            <table className="pl-compare-table" aria-label="Same evidence policy and assurance comparison">
              <thead>
                <tr>
                  <th>Assurance</th>
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
          </div>
          <p className="pl-footnote">* L2 is a declared research counterfactual; it does not upgrade the source evidence.</p>

          <div className="pl-sensitivity-block">
            <div>
              <span>Assumption test</span>
              <p>L2 provenance multiplier · illustrative research-policy assumption, not an empirical estimate.</p>
            </div>
            <table aria-label="L2 multiplier sensitivity">
              <thead><tr>{sensitivity.map((item) => <th key={item.multiplier}>{item.multiplier.toFixed(1)}×{item.multiplier === l2Assumption.expected_current_value ? ' (current)' : ''}</th>)}</tr></thead>
              <tbody><tr>{sensitivity.map((item) => <td key={item.multiplier}>{formatQuantity(item.quantity)}</td>)}</tr></tbody>
            </table>
          </div>

          <button type="button" className="pl-text-link" onClick={openComparison}>Open full policy comparison →</button>
        </section>

        <aside className="pl-pane pl-result-pane" aria-labelledby="pl-result-title">
          <header className="pl-pane-header">
            <span>03</span>
            <h3 id="pl-result-title">Observed outcome</h3>
          </header>
          <div className="pl-outcome-list">
            <div>
              <span>Open policy</span>
              <strong>ADMIT WITH LIMIT</strong>
              <small>{formatQuantity(checkpoint.decisions.open.admitted_maximum)} kWh · {humanize(checkpoint.decisions.open.binding_constraints[0])}</small>
            </div>
            <div>
              <span>Pilot policy</span>
              <strong>BLOCKED</strong>
              <small>{checkpoint.decisions.pilot.blocking_rules.map(humanize).join(' + ')}</small>
            </div>
            <div>
              <span>40% settlement</span>
              <strong>{checkpoint.settlement.result}</strong>
              <small>{formatQuantity(checkpoint.settlement.covered_quantity)} covered · {formatQuantity(checkpoint.settlement.shortfall_quantity)} shortfall</small>
            </div>
          </div>

          <div className="pl-trace-block">
            <span className="pl-subhead">Trace</span>
            <dl className="pl-kv-list compact">
              <MetaRow label="assessment"><code>{shortHash(checkpoint.verification.assessment_id, 12, 8)}</code></MetaRow>
              <MetaRow label="runtime"><code>{shortHash(WORKBENCH_RUNTIME.source_revision, 12, 8)}</code></MetaRow>
              <MetaRow label="R1 / R2 / R3 / R4"><code>{Object.values(checkpoint.boundaries).join(' / ')}</code></MetaRow>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  );
}
