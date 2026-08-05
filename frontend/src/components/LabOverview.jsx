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
import '../styles/pairedPlatform.css';

const CASE_ID = 'TYN-001';
const POLICY_ID = 'ENERGY-CASE-PILOT-005';
const L0_SCENARIO_ID = 'PROVENANCE-L0-BASE';
const L2_SCENARIO_ID = 'PROVENANCE-L2-COUNTERFACTUAL';
const SETTLEMENT_RATE = 0.4;

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

const PIPELINE_STAGES = [
  {
    id: 'evidence',
    label: 'Controlled evidence',
    title: 'Evidence is identified before it is interpreted.',
    detail: 'The source fixture, measurement window, capabilities, diagnostics, and evidence hash remain explicit.',
  },
  {
    id: 'assurance',
    label: 'Assurance classification',
    title: 'Evidence capability and source truth are not collapsed.',
    detail: 'The L0 and L2 states are declared assurance contexts. Switching them does not rewrite the underlying interval evidence.',
  },
  {
    id: 'policy',
    label: 'Versioned policy',
    title: 'A declared rule set decides what the evidence may authorize.',
    detail: 'Policy identity, version, admission requirements, quantity ceilings, and settlement assumptions remain inspectable.',
  },
  {
    id: 'admission',
    label: 'Admission gates',
    title: 'A blocked case never reaches quantity evaluation.',
    detail: 'Boolean and categorical gates expose the exact reason a claim is admitted or stopped.',
  },
  {
    id: 'quantity',
    label: 'Quantity ceilings',
    title: 'Passing evidence does not authorize unlimited quantity.',
    detail: 'Comparable ceilings are evaluated together and the minimum applicable ceiling is attributed as binding.',
  },
  {
    id: 'settlement',
    label: 'Settlement',
    title: 'A valid bounded claim can still fail after admission.',
    detail: 'Outstanding quantity is compared with declared settlement capacity in a separate lifecycle stage.',
  },
  {
    id: 'receipt',
    label: 'Receipt and replay',
    title: 'The durable output is a reproducible decision object.',
    detail: 'Case, evidence, context, policy, calculators, decision identity, and settlement result remain linked for verification.',
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

function initialViewMode() {
  if (typeof window === 'undefined') return 'overview';
  return new URLSearchParams(window.location.search).get('view') === 'full'
    ? 'full'
    : 'overview';
}

function ViewModeBar({ viewMode, onChange }) {
  return (
    <section className="paired-view-bar" aria-label="Overview depth">
      <div className="paired-view-bar-copy">
        <strong>{viewMode === 'full' ? 'Complete platform analysis' : 'Complete interpreted overview'}</strong>
        <span>
          {viewMode === 'full'
            ? 'Inspect the objects, pipeline, validation state, boundaries, and linked research surfaces.'
            : 'Run the flagship decision and see the material conclusion without losing the research boundary.'}
        </span>
      </div>
      <div className="paired-view-toggle" role="group" aria-label="Select platform view">
        <button
          type="button"
          className={viewMode === 'overview' ? 'active' : ''}
          aria-pressed={viewMode === 'overview'}
          onClick={() => onChange('overview')}
        >
          Overview
        </button>
        <button
          type="button"
          className={viewMode === 'full' ? 'active' : ''}
          aria-pressed={viewMode === 'full'}
          onClick={() => onChange('full')}
        >
          Full analysis
        </button>
      </div>
    </section>
  );
}

function FullOverview({
  scenarioId,
  setScenarioId,
  caseManifest,
  evidence,
  policy,
  decision,
  loading,
  blocked,
  admittedMaximum,
  primaryRule,
  onNavigate,
  openInvestigation,
}) {
  const [activeStageId, setActiveStageId] = useState('evidence');
  const activeStage = PIPELINE_STAGES.find((stage) => stage.id === activeStageId) || PIPELINE_STAGES[0];
  const caseCount = Object.keys(ENERGY_CASE_PACK.casesById || {}).length;
  const policyCount = Object.keys(ENERGY_CASE_PACK.policiesById || {}).length;
  const scenarioCount = Object.keys(ENERGY_CASE_PACK.scenariosById || {}).length;
  const covered = blocked || admittedMaximum == null ? null : admittedMaximum * SETTLEMENT_RATE;
  const shortfall = blocked || admittedMaximum == null ? null : admittedMaximum - covered;
  const verdict = loading ? 'EVALUATING' : blocked ? 'BLOCKED' : 'ADMIT WITH LIMIT';

  return (
    <div className="full-overview" aria-label="Full platform overview">
      <section className="full-overview-state">
        <div className="full-overview-state-copy">
          <span>Active programme state</span>
          <strong>{CASE_ID} · {scenarioId === L0_SCENARIO_ID ? 'L0 baseline' : 'L2 counterfactual'} · {policy.id}</strong>
          <code>evidence {shortHash(evidence.evidence_hash)} · declared settlement stress 40%</code>
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
      </section>

      <section className="full-overview-grid">
        <article className="full-overview-panel">
          <header>
            <span>Research objects</span>
            <h1>What constitutes the platform?</h1>
          </header>
          <div className="full-object-list">
            {[
              'CaseManifest',
              'EvidenceEnvelope',
              'ContextManifest',
              'PolicyManifest',
              'ConstraintEvaluation',
              'DecisionResult',
              'SettlementResult',
              'DecisionReceipt',
              'ResearchCapsule',
            ].map((objectName) => (
              <button key={objectName} type="button" onClick={() => onNavigate({ section: 'reference' })}>
                <span>{objectName}</span><ArrowRight size={14} />
              </button>
            ))}
          </div>
        </article>

        <article className="full-overview-panel">
          <header>
            <span>Complete decision pipeline</span>
            <h2>Follow the claim from source to replay.</h2>
          </header>
          <div className="full-pipeline-list">
            {PIPELINE_STAGES.map((stage, index) => (
              <button
                key={stage.id}
                type="button"
                className={stage.id === activeStageId ? 'active' : ''}
                onClick={() => setActiveStageId(stage.id)}
              >
                <span>0{index + 1} · {stage.label}</span><ArrowRight size={13} />
              </button>
            ))}
          </div>
          <div className="full-overview-stage-detail" aria-live="polite">
            <span>{activeStage.label}</span>
            <strong>{activeStage.title}</strong>
            <p>{activeStage.detail}</p>
          </div>
        </article>

        <article className="full-overview-panel">
          <header>
            <span>Live result</span>
            <h2>Same engine, complete context.</h2>
          </header>
          <div className="full-result-card">
            <div className={`full-result-status ${blocked ? 'blocked' : ''}`}>
              {blocked ? <Ban size={26} /> : <Gauge size={26} />}
              <strong>{verdict}</strong>
            </div>
            <div className="full-result-flow">
              <div className="full-overview-metric">
                <span>Requested</span>
                <strong>{formatQuantity(evidence.summary.total_eligible_surplus_kwh)}</strong>
              </div>
              <div className="full-overview-metric">
                <span>Justified</span>
                <strong>{blocked ? '—' : formatQuantity(admittedMaximum)}</strong>
              </div>
              <div className="full-overview-metric">
                <span>Covered at 40%</span>
                <strong>{covered == null ? '—' : formatQuantity(covered)}</strong>
              </div>
            </div>
            <div className="full-overview-stage-detail">
              <span>{blocked ? 'Blocking rule' : 'Binding ceiling'}</span>
              <strong>{loading ? 'Evaluating…' : label(primaryRule)}</strong>
              <p>
                {blocked
                  ? 'Quantity evaluation is not executed because admission failed.'
                  : `${formatQuantity(shortfall)} units remain uncovered under the declared 40% settlement stress preview.`}
              </p>
            </div>
            <div className="full-overview-actions">
              <button type="button" onClick={() => openInvestigation('constraints')}>
                Open complete investigation <ArrowRight size={14} />
              </button>
              <button type="button" onClick={() => onNavigate({
                section: 'compare',
                scenarioId: L2_SCENARIO_ID,
                baselinePolicyId: 'LAB-CASE-OPEN-004',
                comparisonPolicyId: POLICY_ID,
              })}>
                Open case matrix <ArrowRight size={14} />
              </button>
              <button type="button" onClick={() => decision && onNavigate({
                section: 'receipt',
                id: decision.decision_id,
                caseId: CASE_ID,
                policyId: POLICY_ID,
                scenarioId,
              })}>
                Verify active result <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </article>
      </section>

      <section className="full-overview-inventory" aria-label="Platform inventory">
        <div><strong>{caseCount}</strong><span>Cases in active pack</span></div>
        <div><strong>{policyCount}</strong><span>Versioned policies</span></div>
        <div><strong>{caseCount * policyCount}</strong><span>Case-policy decisions</span></div>
        <div><strong>{scenarioCount}</strong><span>Assurance scenarios</span></div>
        <div><strong>1</strong><span>Historical market study</span></div>
        <div><strong>1</strong><span>Open real-source gate</span></div>
      </section>

      <section className="full-overview-grid">
        <article className="full-overview-panel">
          <header><span>Validation state</span><h2>What is already testable?</h2></header>
          <div className="full-validation-list">
            <div><span>Decision core</span><strong>TESTED</strong></div>
            <div><span>Case-pack comparison</span><strong>TESTED</strong></div>
            <div><span>Receipt generation</span><strong>TESTED</strong></div>
            <div><span>Capsule verification</span><strong>TESTED</strong></div>
            <div><span>Operator-format path</span><strong>TESTED</strong></div>
            <div><span>Owner-supplied source</span><strong className="open">OPEN</strong></div>
          </div>
        </article>

        <article className="full-overview-panel">
          <header><span>Programme layers</span><h2>One question, several research instruments.</h2></header>
          <div className="full-object-list">
            <button type="button" onClick={() => onNavigate({ section: 'research' })}><span>ECI · evidence fitness</span><ArrowRight size={14} /></button>
            <button type="button" onClick={() => onNavigate({ section: 'research' })}><span>Constrained Ledger · authority and quantity</span><ArrowRight size={14} /></button>
            <button type="button" onClick={() => openInvestigation('constraints')}><span>Policy Lab · executable cases</span><ArrowRight size={14} /></button>
            <button type="button" onClick={() => onNavigate({ section: 'research' })}><span>Institutional evidence · Norway mapping</span><ArrowRight size={14} /></button>
            <button type="button" onClick={() => onNavigate({ section: 'studies' })}><span>Empirical studies · policy trade-offs</span><ArrowRight size={14} /></button>
          </div>
        </article>

        <article className="full-overview-panel">
          <header><span>Research boundary</span><h2>What the current platform does not claim.</h2></header>
          <div className="full-validation-list">
            <div><span>Real operator validation</span><strong className="open">NOT YET</strong></div>
            <div><span>Physical meter truth</span><strong className="open">NOT CLAIMED</strong></div>
            <div><span>Legal issuance authority</span><strong className="open">NOT CLAIMED</strong></div>
            <div><span>Reserve custody</span><strong className="open">NOT CLAIMED</strong></div>
            <div><span>Production governance</span><strong className="open">NOT CLAIMED</strong></div>
          </div>
        </article>
      </section>

      <section className="full-overview-boundary">
        <div>
          <span>Next external value gate</span>
          <h2>One attributable owner/operator evidence source.</h2>
        </div>
        <p>
          The controlled cases already exercise the software architecture. The next meaningful validation step is to preserve
          the same intake, evidence, policy, decision, and receipt chain against one owner-supplied inverter or gateway export.
        </p>
      </section>
    </div>
  );
}

export default function LabOverview({ onNavigate }) {
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [scenarioId, setScenarioId] = useState(L0_SCENARIO_ID);
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const caseManifest = ENERGY_CASE_PACK.casesById[CASE_ID];
  const evidence = ENERGY_CASE_PACK.evidenceByHash[caseManifest.evidence_refs[0]];
  const policy = ENERGY_CASE_PACK.policiesById[POLICY_ID];
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

  const changeViewMode = (nextMode) => {
    setViewMode(nextMode);
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (nextMode === 'full') url.searchParams.set('view', 'full');
    else url.searchParams.delete('view');
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  };

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
    <main className="lab-overview flagship-overview paired-overview-shell" aria-labelledby="lab-overview-title">
      <ViewModeBar viewMode={viewMode} onChange={changeViewMode} />

      {viewMode === 'full' ? (
        <FullOverview
          scenarioId={scenarioId}
          setScenarioId={setScenarioId}
          caseManifest={caseManifest}
          evidence={evidence}
          policy={policy}
          decision={decision}
          loading={loading}
          blocked={blocked}
          admittedMaximum={admittedMaximum}
          primaryRule={primaryRule}
          onNavigate={onNavigate}
          openInvestigation={openInvestigation}
        />
      ) : (
        <>
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
        </>
      )}
    </main>
  );
}
