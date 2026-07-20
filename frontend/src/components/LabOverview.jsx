import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Ban,
  Check,
  FileCheck2,
  FlaskConical,
  Gauge,
  GitCompareArrows,
  Play,
  RotateCcw,
  ShieldCheck,
  Waypoints,
} from 'lucide-react';
import { evaluateCaseSet } from '../lib/caseWorkbenchRuntime';
import { ENERGY_CASE_PACK } from '../lib/energyCasePack';
import '../styles/flagshipHardening.css';

const CASE_ID = 'TYN-001';
const POLICY_ID = 'ENERGY-CASE-PILOT-005';
const L0_SCENARIO_ID = 'PROVENANCE-L0-BASE';
const L2_SCENARIO_ID = 'PROVENANCE-L2-COUNTERFACTUAL';

const INVESTIGATION_PATHS = [
  {
    id: 'case',
    icon: Waypoints,
    label: 'Investigate the decision',
    description: 'Open the complete constraint, evidence, stress, lineage, and receipt sequence for this exact case.',
    action: 'Open full case',
  },
  {
    id: 'compare',
    icon: GitCompareArrows,
    label: 'Compare declared policies',
    description: 'Hold the controlled evidence and assurance state fixed while the policy rules change side by side.',
    action: 'Compare policies',
  },
  {
    id: 'receipts',
    icon: FileCheck2,
    label: 'Verify the decision trail',
    description: 'Inspect the portable receipt, lineage, reproduction manifest, and research capsule behind the verdict.',
    action: 'Open receipts',
  },
  {
    id: 'studies',
    icon: FlaskConical,
    label: 'Test the policy historically',
    description: 'See the separate empirical study of coverage purchased, capacity surrendered, and residual failure.',
    action: 'Open study',
  },
];

function label(value) {
  return String(value || '—').replaceAll('_', ' ').toLowerCase();
}

function shortHash(value) {
  if (!value) return 'pending';
  return `${value.slice(0, 10)}…${value.slice(-8)}`;
}

function formatQuantity(value) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: 5 });
}

export default function LabOverview({ onNavigate }) {
  const [scenarioId, setScenarioId] = useState(L0_SCENARIO_ID);
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const caseManifest = ENERGY_CASE_PACK.casesById[CASE_ID];
  const evidence = ENERGY_CASE_PACK.evidenceByHash[caseManifest.evidence_refs[0]];
  const policy = ENERGY_CASE_PACK.policiesById[POLICY_ID];
  const scenario = ENERGY_CASE_PACK.scenariosById[scenarioId];
  const requestedQuantity = evidence.summary.total_eligible_surplus_kwh;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    evaluateCaseSet({
      caseIds: [CASE_ID],
      policyId: POLICY_ID,
      scenarioId,
    }).then((runs) => {
      if (!active) return;
      setRun(runs[0] || null);
      setLoading(false);
    }).catch((evaluationError) => {
      if (!active) return;
      setRun(null);
      setError(evaluationError?.message || String(evaluationError));
      setLoading(false);
    });

    return () => { active = false; };
  }, [scenarioId]);

  const decision = run?.decision || null;
  const blocked = decision?.decision === 'BLOCKED';
  const primaryRule = decision
    ? (blocked
      ? decision.admission.blocking_rules[0]
      : decision.capacity.binding_constraints[0])
    : null;
  const admittedMaximum = blocked ? null : decision?.capacity?.admitted_maximum;
  const assuranceLabel = scenarioId === L0_SCENARIO_ID ? 'L0 baseline' : 'L2 counterfactual';
  const verdict = loading ? 'EVALUATING' : blocked ? 'BLOCKED' : 'ADMIT WITH LIMIT';

  const admissionChecks = useMemo(() => (
    decision?.admission?.evaluations?.slice(0, 5) || []
  ), [decision]);

  const openInvestigation = (lens = 'constraints') => onNavigate({
    section: 'case',
    id: CASE_ID,
    policyId: POLICY_ID,
    scenarioId,
    lens,
  });

  const openPath = (id) => {
    if (id === 'case') {
      openInvestigation('constraints');
      return;
    }
    if (id === 'compare') {
      onNavigate({
        section: 'compare',
        scenarioId: L2_SCENARIO_ID,
        baselinePolicyId: 'LAB-CASE-OPEN-004',
        comparisonPolicyId: POLICY_ID,
      });
      return;
    }
    if (id === 'receipts') {
      if (decision) {
        onNavigate({
          section: 'receipt',
          id: decision.decision_id,
          caseId: CASE_ID,
          policyId: POLICY_ID,
          scenarioId,
        });
      } else {
        onNavigate({ section: 'receipts' });
      }
      return;
    }
    onNavigate({ section: 'studies' });
  };

  return (
    <main className="lab-overview flagship-overview" aria-labelledby="lab-overview-title">
      <section className="flagship-intro">
        <div className="flagship-intro-copy">
          <span className="wb-kicker"><ShieldCheck size={13} /> Controlled decision demonstration · TYN-001</span>
          <h1 id="lab-overview-title">A solar claim enters. The policy decides whether it deserves to exist.</h1>
          <p>
            Submit 180 eligible kWh under one declared policy. Change only the assurance state and
            watch admission, permitted quantity, the controlling rule, and decision identity update.
          </p>
        </div>
        <aside className="flagship-question" aria-label="Flagship research question">
          <span>Research question</span>
          <strong>What gets blocked, what quantity survives, and can the answer be replayed?</strong>
          <small>Controlled fixture · no real operator identity · no mint authority</small>
        </aside>
      </section>

      <section className={`flagship-decision-stage ${blocked ? 'blocked' : 'admitted'}`} aria-label="Live canonical decision">
        <header className="flagship-stage-bar">
          <div>
            <span>CASE {CASE_ID}</span>
            <strong>{caseManifest.subject}</strong>
          </div>
          <div className="flagship-stage-controls" aria-label="Assurance preview">
            <button
              type="button"
              className={scenarioId === L0_SCENARIO_ID ? 'active' : ''}
              onClick={() => setScenarioId(L0_SCENARIO_ID)}
              aria-pressed={scenarioId === L0_SCENARIO_ID}
            >
              L0 baseline
            </button>
            <button
              type="button"
              className={scenarioId === L2_SCENARIO_ID ? 'active' : ''}
              onClick={() => setScenarioId(L2_SCENARIO_ID)}
              aria-pressed={scenarioId === L2_SCENARIO_ID}
            >
              L2 counterfactual
            </button>
          </div>
        </header>

        <div className="flagship-stage-grid">
          <section className="flagship-claim-dossier" aria-labelledby="flagship-claim-title">
            <div className="flagship-panel-heading">
              <span>01 · Claim submitted</span>
              <h2 id="flagship-claim-title">{requestedQuantity} eligible kWh</h2>
            </div>

            <dl className="flagship-claim-facts">
              <div><dt>Source</dt><dd>Controlled signed-capability fixture</dd></div>
              <div><dt>Window</dt><dd>May 1–8, 2026</dd></div>
              <div><dt>Policy</dt><dd>{policy.name}</dd></div>
              <div><dt>Assurance</dt><dd>{assuranceLabel}</dd></div>
            </dl>

            <div className="flagship-identity-lock">
              <ShieldCheck size={16} />
              <div>
                <span>Evidence remains unchanged</span>
                <code>{shortHash(evidence.evidence_hash)}</code>
              </div>
            </div>

            <p className="flagship-boundary-note">
              This is a controlled mechanics demonstration. The source is not a trusted operator record,
              and the L2 state is a declared counterfactual rather than new solar evidence.
            </p>
          </section>

          <section className="flagship-rule-console" aria-labelledby="flagship-rules-title">
            <div className="flagship-panel-heading">
              <span>02 · Admission checks</span>
              <h2 id="flagship-rules-title">Run the policy gates</h2>
            </div>

            {error ? <div className="flagship-error" role="alert">{error}</div> : null}

            <div className="flagship-check-list" aria-live="polite">
              {loading ? (
                <div className="flagship-check pending"><span>…</span><strong>Evaluating declared rules</strong></div>
              ) : admissionChecks.map((evaluation) => {
                const failed = evaluation.status === 'BLOCK';
                return (
                  <div key={evaluation.evaluation_id} className={`flagship-check ${failed ? 'failed' : 'passed'}`}>
                    <span>{failed ? <Ban size={15} /> : <Check size={15} />}</span>
                    <strong>{label(evaluation.calculator_id)}</strong>
                    <small>{evaluation.status}</small>
                  </div>
                );
              })}
            </div>

            <div className="flagship-change-note">
              <RotateCcw size={15} />
              <span>Nothing about the solar intervals changes. Only the declared assurance context changes.</span>
            </div>
          </section>

          <section className="flagship-verdict-panel" aria-labelledby="flagship-verdict-title" aria-live="polite">
            <div className="flagship-panel-heading">
              <span>03 · Decision</span>
              <h2 id="flagship-verdict-title">Policy verdict</h2>
            </div>

            <div className="flagship-verdict-mark">
              {blocked ? <Ban size={30} /> : <Gauge size={30} />}
              <strong>{verdict}</strong>
            </div>

            <div className="flagship-verdict-quantity">
              <span>{blocked ? 'Permitted quantity' : 'Maximum permitted'}</span>
              <strong>{blocked ? 'NOT CALCULATED' : formatQuantity(admittedMaximum)}</strong>
              <small>{blocked ? 'admission failed before quantity evaluation' : decision?.capacity?.unit}</small>
            </div>

            <div className="flagship-primary-rule">
              <span>{blocked ? 'Blocking rule' : 'Binding ceiling'}</span>
              <strong>{loading ? 'Evaluating…' : label(primaryRule)}</strong>
              <code>{primaryRule || '—'}</code>
            </div>

            <div className="flagship-decision-id">
              <span>Decision identity</span>
              <code>{shortHash(decision?.decision_id)}</code>
            </div>

            <div className="flagship-verdict-actions">
              {scenarioId === L0_SCENARIO_ID ? (
                <button type="button" className="flagship-primary-action" onClick={() => setScenarioId(L2_SCENARIO_ID)}>
                  Preview L2 assurance <ArrowRight size={16} />
                </button>
              ) : (
                <button type="button" className="flagship-primary-action" onClick={() => openInvestigation('stress')}>
                  Stress this admitted decision <ArrowRight size={16} />
                </button>
              )}
              <button type="button" className="flagship-secondary-action" onClick={() => openInvestigation('constraints')}>
                <Play size={15} /> Open full investigation
              </button>
            </div>
          </section>
        </div>
      </section>

      <section className="flagship-path-section" aria-labelledby="flagship-path-title">
        <header className="lab-section-heading">
          <div>
            <span className="wb-section-label">Continue from the verdict</span>
            <h2 id="flagship-path-title">The rest of the platform answers the questions this decision creates.</h2>
          </div>
          <ArrowRight size={24} aria-hidden />
        </header>

        <div className="flagship-path-grid">
          {INVESTIGATION_PATHS.map((item, index) => {
            const Icon = item.icon;
            return (
              <article key={item.id}>
                <div><span>0{index + 1}</span><Icon size={18} /></div>
                <h3>{item.label}</h3>
                <p>{item.description}</p>
                <button type="button" onClick={() => openPath(item.id)}>
                  {item.action} <ArrowRight size={15} />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="flagship-proof-boundary" aria-labelledby="flagship-proof-title">
        <div>
          <span className="wb-section-label">Trust boundary</span>
          <h2 id="flagship-proof-title">The interface shows what the system knows—and what it does not.</h2>
        </div>
        <p>
          Controlled energy cases demonstrate deterministic decision mechanics. The separate market study
          evaluates historical policy trade-offs. Neither is presented as proof of a live operator deployment.
        </p>
        <button type="button" onClick={() => onNavigate({ section: 'studies' })}>
          Inspect the empirical proof layer <ArrowRight size={15} />
        </button>
      </section>
    </main>
  );
}
