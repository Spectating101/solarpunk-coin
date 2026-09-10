import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  GitCompareArrows,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';
import gauntlet from '../../../benchmark/gauntlet/policy-lab-specialized.v1.json';
import c3c4 from '../../../benchmark/gauntlet/policy-lab-c3-c4-map.v1.json';
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

function decisionCell(run) {
  if (!run?.decision) return { state: 'PENDING', detail: 'evaluating', tone: 'neutral', quantity: null };
  if (run.decision.decision === 'BLOCKED') {
    return {
      state: 'BLOCKED',
      detail: humanize(run.decision.admission.blocking_rules[0]),
      tone: 'blocked',
      quantity: null,
    };
  }
  return {
    state: 'ADMIT WITH LIMIT',
    detail: humanize(run.decision.capacity.binding_constraints[0]),
    tone: 'admitted',
    quantity: run.decision.capacity.admitted_maximum,
  };
}

function MatrixCell({ run }) {
  const cell = decisionCell(run);
  return (
    <div className={`judge-matrix-cell ${cell.tone}`}>
      <strong>{cell.quantity == null ? cell.state : formatQuantity(cell.quantity)}</strong>
      <span>{cell.quantity == null ? cell.detail : 'maximum claim units'}</span>
      {cell.quantity != null ? <small>{cell.detail}</small> : null}
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

  const machineChallenges = gauntlet.challenges.filter((item) => item.state === 'MACHINE_REQUIRED').length;
  const externalGates = gauntlet.challenges.filter((item) => item.state === 'OPEN_EXTERNAL').length;

  const openComparison = () => onNavigate?.({
    section: 'compare',
    scenarioId: L0,
    baselinePolicyId: OPEN_POLICY,
    comparisonPolicyId: PILOT_POLICY,
  });

  return (
    <section className="judge-evidence-surface" aria-labelledby="judge-evidence-title">
      <header className="judge-evidence-header">
        <div>
          <span className="judge-eyebrow">Evidence → authority</span>
          <h2 id="judge-evidence-title">Same evidence. Different policy. Different authority.</h2>
          <p>
            Policy Lab keeps observed evidence, assurance context, admission rules, quantity ceilings, and settlement separate so the reason a financial claim changes remains inspectable.
          </p>
        </div>
        <div className={`judge-evidence-lock ${evidenceLocked ? 'locked' : ''}`}>
          <LockKeyhole size={18} />
          <div>
            <span>Controlled experiment evidence identity</span>
            <code>{shortHash(evidenceHash, 14, 10)}</code>
            <strong>{evidenceLocked ? 'unchanged across all four decisions' : 'checking identity…'}</strong>
          </div>
        </div>
      </header>

      <div className="judge-evidence-grid">
        <article className="judge-public-proof">
          <div className="judge-section-label">Outside data · observed checkpoint</div>
          <div className="judge-public-proof-heading">
            <div>
              <strong>{checkpoint.case_id}</strong>
              <span>Ausgrid public archive · {checkpoint.source.interval_count} half-hour intervals · actual {checkpoint.evidence.assurance}</span>
            </div>
            <div className="judge-public-quantity">
              <strong>{formatQuantity(checkpoint.decisions.open.admitted_maximum)}</strong>
              <span>kWh ceiling</span>
            </div>
          </div>
          <dl className="judge-proof-facts">
            <div><dt>Open policy</dt><dd className="pass">ADMIT WITH LIMIT</dd></div>
            <div><dt>Pilot policy</dt><dd className="fail">BLOCKED</dd></div>
            <div><dt>40% settlement</dt><dd className="warn">{checkpoint.settlement.result} · {formatQuantity(checkpoint.settlement.shortfall_quantity)} shortfall</dd></div>
            <div><dt>Decision replay</dt><dd className="pass">{checkpoint.verification.decision_reproduction}</dd></div>
          </dl>
          <div className="judge-proof-boundary">
            <ShieldCheck size={17} />
            <span>
              Public-data operability, not operator validation. The checkpoint does not establish physical meter truth, legal issuance authority, reserve custody, or monetary performance.
            </span>
          </div>
          <div className="judge-proof-meta">
            <span>evaluated revision</span><code>{shortHash(checkpoint.provenance.evaluated_revision, 12, 8)}</code>
          </div>
        </article>

        <article className="judge-causal-proof">
          <div className="judge-section-label">Controlled mechanism check · {REFERENCE_CASE}</div>
          {experimentError ? (
            <div className="judge-experiment-error" role="alert"><AlertTriangle size={16} /> {experimentError}</div>
          ) : null}
          <div className="judge-causal-table" role="table" aria-label="Same evidence policy and assurance comparison">
            <div className="judge-causal-row header" role="row">
              <span role="columnheader">Assurance context</span>
              <span role="columnheader">Open policy</span>
              <span role="columnheader">Pilot policy</span>
            </div>
            <div className="judge-causal-row" role="row">
              <div role="rowheader"><strong>Actual L0</strong><span>observed evidence</span></div>
              <MatrixCell run={runs?.l0Open} />
              <MatrixCell run={runs?.l0Pilot} />
            </div>
            <div className="judge-causal-row counterfactual" role="row">
              <div role="rowheader"><strong>Declared L2</strong><span>counterfactual only</span></div>
              <MatrixCell run={runs?.l2Open} />
              <MatrixCell run={runs?.l2Pilot} />
            </div>
          </div>
          <div className="judge-causal-logic">
            <div><CheckCircle2 size={16} /><span><strong>Evidence stays fixed.</strong> Policy and declared assurance are the manipulated variables.</span></div>
            <div><ArrowRight size={16} /><span>At L0 the pilot blocks on minimum provenance; at declared L2 it admits but caps quantity through provenance policy capacity.</span></div>
          </div>
          <button type="button" className="judge-text-action" onClick={openComparison}>
            <GitCompareArrows size={16} /> Inspect the full policy comparison <ArrowRight size={14} />
          </button>
        </article>
      </div>

      <div className="judge-assumption-row">
        <div className="judge-assumption-copy">
          <span className="judge-section-label">Assumption sensitivity</span>
          <strong>L2 provenance multiplier</strong>
          <p>The multiplier is an illustrative research-policy assumption, not an empirical estimate. The interface shows its consequence instead of hiding it inside the rule.</p>
        </div>
        <div className="judge-sensitivity-scale" aria-label="L2 multiplier sensitivity">
          {sensitivity.length ? sensitivity.map((item) => (
            <div key={item.multiplier} className={item.multiplier === l2Assumption.expected_current_value ? 'current' : ''}>
              <span>{item.multiplier.toFixed(1)}×</span>
              <strong>{formatQuantity(item.quantity)}</strong>
              <small>{item.multiplier === l2Assumption.expected_current_value ? 'current research policy' : 'sensitivity case'}</small>
            </div>
          )) : <span className="judge-sensitivity-loading">evaluating sensitivity…</span>}
        </div>
      </div>

      <footer className="judge-proof-ledger">
        <div>
          <span>Machine challenges</span>
          <strong>{machineChallenges}</strong>
          <small>CI-gated invariants</small>
        </div>
        <div>
          <span>C3 lifecycle</span>
          <strong className="partial">{c3c4.levels.C3.state}</strong>
          <small>open lifecycle work remains</small>
        </div>
        <div>
          <span>C4 hardening</span>
          <strong className="partial">{c3c4.levels.C4.state}</strong>
          <small>not certified</small>
        </div>
        <div>
          <span>External gates</span>
          <strong className="open">{externalGates} OPEN</strong>
          <small>cannot be closed by internal CI</small>
        </div>
        <div className="judge-proof-revision">
          <span>Runtime revision</span>
          <code>{shortHash(WORKBENCH_RUNTIME.source_revision, 12, 8)}</code>
          <small>build identity, not source truth</small>
        </div>
      </footer>
    </section>
  );
}
