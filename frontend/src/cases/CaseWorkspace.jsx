import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Download,
  FileDigit,
  Gauge,
  GitCompareArrows,
  Network,
  ShieldAlert,
  Waves,
} from 'lucide-react';
import { useCaseWorkbench } from '../app/CaseWorkbenchProvider';
import {
  decisionMemo,
  downloadJson,
  downloadText,
} from '../lib/caseWorkbenchRuntime';
import ConstraintsLens from './lenses/ConstraintsLens';
import EvidenceLens from './lenses/EvidenceLens';
import StressLens from './lenses/StressLens';
import LineageLens from './lenses/LineageLens';

const LENSES = [
  { id: 'constraints', label: 'Constraints', icon: Gauge },
  { id: 'evidence', label: 'Evidence', icon: FileDigit },
  { id: 'stress', label: 'Stress', icon: Waves },
  { id: 'lineage', label: 'Lineage', icon: Network },
];

function label(value) {
  return String(value || '—').replaceAll('_', ' ').toLowerCase();
}

function DecisionDossier({ run }) {
  if (!run) return <aside className="decision-dossier"><div className="wb-lens-loading">Building dossier…</div></aside>;
  const { decision, policy, evidence, contexts, scenario } = run;
  return (
    <aside className="decision-dossier" aria-label="Decision dossier">
      <div className="wb-section-label">Decision dossier</div>
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
        <span>Controlled fixture evidence · public case pack</span>
        <span>PVWatts resource values · modeled TMY context</span>
        <span>Decision · deterministic derived result</span>
      </div>
    </aside>
  );
}

export default function CaseWorkspace({ caseId, onNavigate }) {
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
  const [lens, setLens] = useState('constraints');

  useEffect(() => {
    if (caseId && caseId !== activeCaseId) selectCase(caseId);
  }, [caseId, activeCaseId, selectCase]);

  const activeCase = pack.casesById[activeCaseId];
  const lensView = useMemo(() => {
    if (lens === 'evidence') return <EvidenceLens />;
    if (lens === 'stress') return <StressLens />;
    if (lens === 'lineage') return <LineageLens />;
    return <ConstraintsLens />;
  }, [lens, activeRun?.decision?.decision_id]);

  const downloadReceipt = () => {
    if (!activeReceipt) return;
    downloadJson(`decision-receipt-${activeCaseId.toLowerCase()}.json`, activeReceipt);
  };
  const downloadMemo = () => {
    if (!activeRun) return;
    downloadText(`decision-memo-${activeCaseId.toLowerCase()}.md`, decisionMemo(activeRun));
  };

  return (
    <main className="case-workspace" aria-labelledby="case-workspace-title">
      <header className="case-workspace-toolbar">
        <button type="button" className="wb-back-action" onClick={() => onNavigate({ section: 'cases' })}>
          <ArrowLeft size={16} /> Cases
        </button>
        <div className="case-workspace-identity">
          <span>CASE <code>{activeCaseId}</code></span>
          <span>POLICY <code>{activePolicyId}@{pack.policiesById[activePolicyId].version}</code></span>
          <span>DECISION <code>{activeRun?.decision?.decision_id?.slice(0, 12) || 'evaluating…'}</code></span>
          <span className="local-mode">PUBLIC CASE PACK</span>
        </div>
        <div className="case-workspace-actions">
          <button type="button" onClick={() => onNavigate({ section: 'compare' })}><GitCompareArrows size={15} /> Compare</button>
          <button type="button" onClick={downloadReceipt} disabled={!activeReceipt}><Download size={15} /> Receipt</button>
          <button type="button" onClick={downloadMemo} disabled={!activeRun}><Download size={15} /> Memo</button>
        </div>
      </header>

      {error ? <div className="workbench-error" role="alert"><ShieldAlert size={18} /> {error}</div> : null}

      <section className="case-workspace-grid">
        <aside className="case-identity-pane">
          <div className="case-pane-title">
            <span>{activeCase.case_id}</span>
            <h1 id="case-workspace-title">{activeCase.subject.replace(' controlled energy case', '')}</h1>
            <code>{activeCase.spatial_identity.latitude.toFixed(4)}, {activeCase.spatial_identity.longitude.toFixed(4)}</code>
          </div>

          <label className="wb-select-field">
            <span>Declared policy</span>
            <select value={activePolicyId} onChange={(event) => selectPolicy(event.target.value)}>
              {pack.policies.map((policy) => <option key={policy.id} value={policy.id}>{policy.name}</option>)}
            </select>
          </label>

          <label className="wb-select-field">
            <span>Assurance context</span>
            <select value={activeScenarioId} onChange={(event) => selectScenario(event.target.value)}>
              {pack.scenarios.map((scenario) => <option key={scenario.scenario_id} value={scenario.scenario_id}>{scenario.name}</option>)}
            </select>
          </label>

          <div className="case-source-summary">
            <span className="wb-section-label">Case inputs</span>
            <dl>
              <div><dt>Window</dt><dd>{activeCase.measurement_window.start.slice(0, 10)} → {activeCase.measurement_window.end.slice(0, 10)}</dd></div>
              <div><dt>Evidence</dt><dd>{activeRun?.evidence.summary.total_eligible_surplus_kwh ?? '…'} kWh fixture</dd></div>
              <div><dt>Resource</dt><dd>{activeRun?.contexts[0]?.values?.annual_ac_kwh ?? '…'} modeled annual kWh</dd></div>
              <div><dt>Assurance</dt><dd>{activeRun?.provenance.level ?? '…'}</dd></div>
            </dl>
          </div>

          <nav className="case-lens-nav" aria-label="Case workspace lenses">
            {LENSES.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.id}
                  className={lens === item.id ? 'active' : ''}
                  onClick={() => setLens(item.id)}
                  aria-current={lens === item.id ? 'page' : undefined}
                >
                  <Icon size={16} /> {item.label}
                </button>
              );
            })}
          </nav>

          <div className="case-boundary-stack">
            {activeCase.boundaries.map((boundary) => <p key={boundary}>{boundary}</p>)}
          </div>
        </aside>

        <section className="decision-workspace-pane" aria-busy={loading}>
          {lensView}
        </section>

        <DecisionDossier run={activeRun} />
      </section>
    </main>
  );
}
