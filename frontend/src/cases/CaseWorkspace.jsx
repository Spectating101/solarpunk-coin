import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  FileDigit,
  FileText,
  Gauge,
  GitCompareArrows,
  Network,
  ShieldAlert,
  Waves,
  X,
} from 'lucide-react';
import { useCaseWorkbench } from '../app/CaseWorkbenchProvider';
import ResponsiveDisclosure from '../components/ResponsiveDisclosure';
import {
  decisionArtifactStem,
  decisionMemo,
  downloadJson,
  downloadText,
} from '../lib/caseWorkbenchRuntime';
import ConstraintsLens from './lenses/ConstraintsLens';
import EvidenceLens from './lenses/EvidenceLens';
import StressLens from './lenses/StressLens';
import LineageLens from './lenses/LineageLens';

const LENSES = [
  { id: 'constraints', label: 'Constraints', question: 'Why this result?', icon: Gauge },
  { id: 'evidence', label: 'Evidence', question: 'What supports it?', icon: FileDigit },
  { id: 'stress', label: 'Stress', question: 'What can fail?', icon: Waves },
  { id: 'lineage', label: 'Lineage', question: 'How was it produced?', icon: Network },
];
const LENS_IDS = new Set(LENSES.map((item) => item.id));

function label(value) {
  return String(value || '—').replaceAll('_', ' ').toLowerCase();
}

function primaryRule(run) {
  if (!run) return null;
  return run.decision.decision === 'BLOCKED'
    ? run.decision.admission.blocking_rules[0] || null
    : run.decision.capacity.binding_constraints[0] || null;
}

function admittedCapacity(run) {
  if (!run || run.decision.decision === 'BLOCKED') return null;
  return run.decision.capacity.admitted_maximum;
}

function DecisionDossier({ run }) {
  if (!run) return <aside className="decision-dossier"><div className="wb-lens-loading">Building dossier…</div></aside>;
  const { decision, policy, evidence, contexts, scenario } = run;
  return (
    <aside className="decision-dossier" aria-label="Decision dossier">
      <ResponsiveDisclosure
        id="case-decision-dossier"
        label="Decision dossier"
        title="Identity and data boundary"
        meta={decision.decision_id.slice(0, 12)}
        className="case-dossier-disclosure"
      >
        <div className={`dossier-result ${decision.decision === 'BLOCKED' ? 'blocked' : 'admitted'}`}>
          <small>Current result</small>
          <strong>{decision.decision.replaceAll('_', ' ')}</strong>
          <span>{decision.decision === 'BLOCKED'
            ? label(decision.admission.blocking_rules[0])
            : `${decision.capacity.admitted_maximum} ${decision.capacity.unit}`}</span>
        </div>
        <dl className="dossier-list">
          <div><dt>Decision ID</dt><dd><code>{decision.decision_id}</code></dd></div>
          <div><dt>Case</dt><dd>{decision.case_id}</dd></div>
          <div><dt>Policy</dt><dd>{policy.id}@{policy.version}</dd></div>
          <div><dt>Policy hash</dt><dd><code>{decision.policy_manifest_hash}</code></dd></div>
          <div><dt>Evidence hash</dt><dd><code>{evidence.evidence_hash}</code></dd></div>
          <div><dt>Assurance scenario</dt><dd>{scenario.scenario_id}</dd></div>
          {contexts.map((context) => (
            <div key={context.context_id}>
              <dt>Modeled context</dt>
              <dd><code>{context.context_id}</code><small>{context.temporal_semantics.kind} · {context.context_hash}</small></dd>
            </div>
          ))}
        </dl>
        <div className="dossier-boundary">
          <strong>Data boundary</strong>
          <span>{evidence.source?.sample_fixture ? 'Controlled or synthetic fixture evidence' : 'Externally supplied evidence'}</span>
          <span>Resource values · declared or modeled context</span>
          <span>Decision · deterministic derived result</span>
        </div>
      </ResponsiveDisclosure>
    </aside>
  );
}

function DecisionTransition({ transition, onDismiss }) {
  if (!transition) return null;
  return (
    <section className="case-decision-transition" role="status" aria-label="Investigation update">
      <div>
        <span className="wb-section-label">Investigation updated</span>
        <strong>{transition.title}</strong>
        <p>{transition.summary}</p>
      </div>
      <div className="case-transition-changes">
        {transition.changes.map((change) => (
          <span key={change.label}>
            <small>{change.label}</small>
            <code>{change.before}</code>
            <ArrowRight size={13} aria-hidden />
            <code>{change.after}</code>
          </span>
        ))}
      </div>
      <button type="button" aria-label="Dismiss investigation update" onClick={onDismiss}><X size={15} /></button>
    </section>
  );
}

export default function CaseWorkspace({
  caseId,
  policyId = null,
  scenarioId = null,
  initialLens = null,
  onNavigate,
}) {
  const {
    pack,
    activeCaseId,
    activePolicyId,
    activeScenarioId,
    activeRun,
    activeReceipt,
    selectCase,
    selectPolicy,
    selectScenario,
    loading,
    error,
  } = useCaseWorkbench();
  const [lens, setLens] = useState(LENS_IDS.has(initialLens) ? initialLens : 'constraints');
  const [transition, setTransition] = useState(null);
  const previousRunRef = useRef(null);
  const pendingChangeRef = useRef(null);

  useEffect(() => {
    if (caseId && caseId !== activeCaseId) selectCase(caseId);
  }, [caseId, activeCaseId, selectCase]);

  useEffect(() => {
    if (policyId && policyId !== activePolicyId) selectPolicy(policyId);
  }, [policyId, activePolicyId, selectPolicy]);

  useEffect(() => {
    if (scenarioId && scenarioId !== activeScenarioId) selectScenario(scenarioId);
  }, [scenarioId, activeScenarioId, selectScenario]);

  useEffect(() => {
    if (initialLens && LENS_IDS.has(initialLens) && initialLens !== lens) setLens(initialLens);
  }, [initialLens, lens]);

  useEffect(() => {
    if (!activeRun) return;
    const previous = previousRunRef.current;
    const pending = pendingChangeRef.current;
    if (
      previous
      && pending
      && previous.decision.case_id === activeRun.decision.case_id
      && previous.decision.decision_id !== activeRun.decision.decision_id
    ) {
      const changes = [];
      if (previous.policy.id !== activeRun.policy.id) {
        changes.push({ label: 'Policy', before: previous.policy.id, after: activeRun.policy.id });
      }
      if (previous.scenario.scenario_id !== activeRun.scenario.scenario_id) {
        changes.push({ label: 'Assurance', before: previous.scenario.scenario_id, after: activeRun.scenario.scenario_id });
      }
      const previousResult = previous.decision.decision.replaceAll('_', ' ');
      const nextResult = activeRun.decision.decision.replaceAll('_', ' ');
      if (previousResult !== nextResult) {
        changes.push({ label: 'Decision', before: previousResult, after: nextResult });
      }
      const previousRule = primaryRule(previous) || 'none';
      const nextRule = primaryRule(activeRun) || 'none';
      if (previousRule !== nextRule) {
        changes.push({ label: 'Primary rule', before: previousRule, after: nextRule });
      }
      const previousCapacity = admittedCapacity(previous);
      const nextCapacity = admittedCapacity(activeRun);
      if (previousCapacity !== nextCapacity) {
        changes.push({
          label: 'Capacity',
          before: previousCapacity == null ? 'not evaluated' : String(previousCapacity),
          after: nextCapacity == null ? 'not evaluated' : String(nextCapacity),
        });
      }
      setTransition({
        title: pending === 'policy' ? 'The declared policy changed.' : 'The assurance context changed.',
        summary: changes.length
          ? 'The interface is showing the exact decision consequences of that declared change; the underlying evidence hash remains separately identifiable.'
          : 'The declared selection changed without changing the resulting decision.',
        changes,
      });
    } else if (!previous || previous.decision.case_id !== activeRun.decision.case_id) {
      setTransition(null);
    }
    previousRunRef.current = activeRun;
    pendingChangeRef.current = null;
  }, [activeRun]);

  const activeCase = pack.casesById[activeCaseId];
  const activeLens = LENSES.find((item) => item.id === lens) || LENSES[0];
  const blocked = activeRun?.decision?.decision === 'BLOCKED';
  const activePrimaryRule = primaryRule(activeRun);
  const spatialLabel = activeCase?.spatial_identity
    ? `${activeCase.spatial_identity.latitude.toFixed(4)}, ${activeCase.spatial_identity.longitude.toFixed(4)}`
    : 'No asserted physical location';

  const navigateState = (overrides = {}) => onNavigate({
    section: 'case',
    id: overrides.caseId || caseId || activeCaseId,
    policyId: overrides.policyId || activePolicyId,
    scenarioId: overrides.scenarioId || activeScenarioId,
    lens: overrides.lens || lens,
  });

  const changePolicy = (nextPolicyId) => {
    pendingChangeRef.current = 'policy';
    if (selectPolicy(nextPolicyId)) navigateState({ policyId: nextPolicyId });
    else pendingChangeRef.current = null;
  };

  const changeScenario = (nextScenarioId) => {
    pendingChangeRef.current = 'scenario';
    if (selectScenario(nextScenarioId)) navigateState({ scenarioId: nextScenarioId });
    else pendingChangeRef.current = null;
  };

  const changeLens = (nextLens) => {
    setLens(nextLens);
    navigateState({ lens: nextLens });
  };

  const openCompare = () => {
    const comparison = pack.policies.find((policy) => policy.id !== activePolicyId) || pack.policies[0];
    onNavigate({
      section: 'compare',
      scenarioId: activeScenarioId,
      baselinePolicyId: activePolicyId,
      comparisonPolicyId: comparison.id,
    });
  };

  const openReceipt = () => {
    if (!activeRun) return;
    onNavigate({
      section: 'receipt',
      id: activeRun.decision.decision_id,
      caseId: activeRun.decision.case_id,
      policyId: activeRun.policy.id,
      scenarioId: activeRun.scenario.scenario_id,
    });
  };

  let lensView = <ConstraintsLens onSelectScenario={changeScenario} />;
  if (lens === 'evidence') lensView = <EvidenceLens />;
  if (lens === 'stress') lensView = <StressLens />;
  if (lens === 'lineage') lensView = <LineageLens />;

  const downloadReceipt = () => {
    if (!activeReceipt || !activeRun) return;
    downloadJson(`decision-receipt-${decisionArtifactStem(activeRun)}.json`, activeReceipt);
  };
  const downloadMemo = () => {
    if (!activeRun) return;
    downloadText(`decision-memo-${decisionArtifactStem(activeRun)}.md`, decisionMemo(activeRun));
  };

  return (
    <main className="case-workspace" aria-labelledby="case-workspace-title">
      <header className="case-workspace-toolbar">
        <nav className="case-breadcrumb" aria-label="Case investigation breadcrumb">
          <button type="button" className="wb-back-action" onClick={() => onNavigate({ section: 'cases' })}>
            <ArrowLeft size={16} /> Cases
          </button>
          <ArrowRight size={13} aria-hidden />
          <span>{activeCaseId}</span>
          <ArrowRight size={13} aria-hidden />
          <strong>{activeLens.label}</strong>
        </nav>
        <div className="case-workspace-identity">
          <span>POLICY <code>{activePolicyId}@{pack.policiesById[activePolicyId].version}</code></span>
          <span>SCENARIO <code>{activeScenarioId}</code></span>
          <span>DECISION <code>{activeRun?.decision?.decision_id?.slice(0, 12) || 'evaluating…'}</code></span>
          <span className="local-mode">URL-BOUND STATE</span>
        </div>
        <div className="case-workspace-actions">
          <button type="button" onClick={openCompare}><GitCompareArrows size={15} /> Compare</button>
          <button type="button" onClick={openReceipt} disabled={!activeRun}><FileText size={15} /> Open receipt</button>
          <button type="button" onClick={downloadReceipt} disabled={!activeReceipt}><Download size={15} /> Receipt JSON</button>
          <button type="button" onClick={downloadMemo} disabled={!activeRun}><Download size={15} /> Memo</button>
        </div>
      </header>

      {error ? <div className="workbench-error" role="alert"><ShieldAlert size={18} /> {error}</div> : null}

      <section className={`case-investigation-bar ${blocked ? 'blocked' : 'admitted'}`} aria-label="Current investigation state">
        <div className="case-investigation-result">
          <small>Current decision</small>
          <strong>{loading ? 'EVALUATING…' : activeRun?.decision?.decision?.replaceAll('_', ' ') || '—'}</strong>
          <span>{blocked
            ? `${label(activePrimaryRule)} blocks admission`
            : `${activeRun?.decision?.capacity?.admitted_maximum ?? '—'} ${activeRun?.decision?.capacity?.unit || ''} · ${label(activePrimaryRule)} binds`}</span>
        </div>
        <nav className="case-investigation-lenses" aria-label="Investigation sequence">
          {LENSES.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                className={lens === item.id ? 'active' : ''}
                onClick={() => changeLens(item.id)}
                aria-current={lens === item.id ? 'page' : undefined}
                aria-label={item.label}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <Icon size={16} />
                <strong>{item.label}</strong>
                <small>{item.question}</small>
              </button>
            );
          })}
        </nav>
      </section>

      <DecisionTransition transition={transition} onDismiss={() => setTransition(null)} />

      <section className="case-workspace-grid">
        <aside className="case-identity-pane">
          <div className="case-pane-title">
            <span>{activeCase.case_id}</span>
            <h1 id="case-workspace-title">{activeCase.subject.replace(' controlled energy case', '')}</h1>
            <code>{spatialLabel}</code>
          </div>

          <label className="wb-select-field">
            <span>Declared policy</span>
            <select value={activePolicyId} onChange={(event) => changePolicy(event.target.value)}>
              {pack.policies.map((policy) => <option key={policy.id} value={policy.id}>{policy.name}</option>)}
            </select>
          </label>

          <label className="wb-select-field">
            <span>Assurance context</span>
            <select value={activeScenarioId} onChange={(event) => changeScenario(event.target.value)}>
              {pack.scenarios.map((scenario) => <option key={scenario.scenario_id} value={scenario.scenario_id}>{scenario.name}</option>)}
            </select>
          </label>

          <ResponsiveDisclosure
            id="case-input-boundaries"
            label="Declared investigation"
            title="Inputs and boundaries"
            meta={`${activeCase.boundaries.length} boundaries`}
            className="case-input-disclosure"
          >
            <div className="case-source-summary">
              <span className="wb-section-label">Case inputs</span>
              <dl>
                <div><dt>Window</dt><dd>{activeCase.measurement_window.start.slice(0, 10)} → {activeCase.measurement_window.end.slice(0, 10)}</dd></div>
                <div><dt>Evidence</dt><dd>{activeRun?.evidence.summary.total_eligible_surplus_kwh ?? '…'} kWh {activeRun?.evidence.source?.sample_fixture ? 'fixture' : 'source'}</dd></div>
                <div><dt>Resource</dt><dd>{activeRun?.contexts[0]?.values?.annual_ac_kwh ?? '…'} modeled annual kWh</dd></div>
                <div><dt>Assurance</dt><dd>{activeRun?.provenance.level ?? '…'}</dd></div>
              </dl>
            </div>
            <div className="case-boundary-stack">
              {activeCase.boundaries.map((boundary) => <p key={boundary}>{boundary}</p>)}
            </div>
          </ResponsiveDisclosure>
        </aside>

        <section className="decision-workspace-pane" aria-busy={loading}>
          {lensView}
          <section className="case-next-actions" aria-label="Next investigation actions">
            <div>
              <span className="wb-section-label">Continue the investigation</span>
              <strong>{blocked ? 'Inspect the evidence boundary or compare a different declaration.' : 'Stress the admitted quantity or inspect how the result was produced.'}</strong>
            </div>
            <div>
              {blocked ? (
                <button type="button" onClick={() => changeLens('evidence')}><FileDigit size={15} /> Evidence</button>
              ) : (
                <button type="button" onClick={() => changeLens('stress')}><Waves size={15} /> Stress settlement</button>
              )}
              <button type="button" onClick={() => changeLens('lineage')}><Network size={15} /> Lineage</button>
              <button type="button" onClick={openCompare}><GitCompareArrows size={15} /> Compare policies</button>
              <button type="button" onClick={openReceipt} disabled={!activeRun}><FileText size={15} /> Open decision receipt</button>
            </div>
          </section>
        </section>

        <DecisionDossier run={activeRun} />
      </section>
    </main>
  );
}
