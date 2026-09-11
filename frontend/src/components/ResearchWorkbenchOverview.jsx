import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Database,
  FileText,
  FlaskConical,
  GitCompareArrows,
  History,
  ShieldCheck,
} from 'lucide-react';
import { useCaseWorkbench } from '../app/CaseWorkbenchProvider';
import { PUBLIC_EVIDENCE_CHECKPOINT } from '../data/publicEvidenceCheckpoint';
import {
  formatQuantity,
  humanize,
  shortHash,
} from './platform/PlatformSurface';
import '../styles/researchWorkbenchOverview.css';

const DOCUMENTS = [
  ['analysis', 'Analysis', BookOpen],
  ['runs', 'Runs', FileText],
  ['methods', 'Methods', FlaskConical],
  ['data', 'Data', Database],
];

function decisionText(run) {
  if (!run?.decision) return { primary: '—', quantity: null, rule: '—', blocked: false };
  const blocked = run.decision.decision === 'BLOCKED';
  return {
    primary: run.decision.decision.replaceAll('_', ' '),
    quantity: blocked ? null : run.decision.capacity?.admitted_maximum,
    rule: blocked
      ? run.decision.admission?.blocking_rules?.[0]
      : run.decision.capacity?.binding_constraints?.[0],
    blocked,
  };
}

function WorkspaceSection({ title, children }) {
  return (
    <section className="rwb-browser-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function InspectorField({ label, children }) {
  return (
    <div className="rwb-inspector-field">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function ResearchWorkbenchOverview({ onNavigate, onOpenFullAnalysis }) {
  const [document, setDocument] = useState('analysis');
  const [inspector, setInspector] = useState('run');
  const {
    pack,
    activeCaseId,
    activePolicyId,
    activeScenarioId,
    activeRun,
    activeStress,
    visibleRunsByCaseId = {},
    settlementMultiplier,
    selectCase,
    selectPolicy,
    selectScenario,
    setSettlementMultiplier,
    loading,
    error,
  } = useCaseWorkbench();

  const activeCase = useMemo(
    () => pack.cases.find((item) => item.case_id === activeCaseId) || pack.cases[0],
    [pack.cases, activeCaseId],
  );
  const activePolicy = useMemo(
    () => pack.policies.find((item) => item.id === activePolicyId) || pack.policies[0],
    [pack.policies, activePolicyId],
  );
  const activeScenario = useMemo(
    () => pack.scenarios.find((item) => item.scenario_id === activeScenarioId) || pack.scenarios[0],
    [pack.scenarios, activeScenarioId],
  );

  const decision = activeRun?.decision || null;
  const evidence = activeRun?.evidence || null;
  const blocked = decision?.decision === 'BLOCKED';
  const requested = evidence?.summary?.total_eligible_surplus_kwh ?? null;
  const justified = blocked ? null : decision?.capacity?.admitted_maximum ?? null;
  const settlement = activeStress?.available ? activeStress.settlement : null;
  const covered = settlement?.covered_quantity ?? null;
  const shortfall = settlement?.shortfall_quantity ?? null;
  const mainRule = blocked
    ? decision?.admission?.blocking_rules?.[0]
    : decision?.capacity?.binding_constraints?.[0];

  const runRows = pack.cases.map((item) => {
    const run = visibleRunsByCaseId[item.case_id] || (item.case_id === activeCaseId ? activeRun : null);
    const summary = decisionText(run);
    return { caseManifest: item, run, ...summary };
  });

  const measurementWindow = activeCase?.measurement_window;
  const contextRefs = activeCase?.context_refs || [];
  const boundaries = activeCase?.boundaries || [];
  const admissionRules = activePolicy?.admission_rules || [];
  const quantityRules = activePolicy?.quantity_rules || [];

  const openInvestigation = () => onNavigate?.({
    section: 'case',
    id: activeCaseId,
    policyId: activePolicyId,
    scenarioId: activeScenarioId,
    lens: blocked ? 'constraints' : 'stress',
  });

  const openCompare = () => onNavigate?.({
    section: 'compare',
    scenarioId: activeScenarioId,
    baselinePolicyId: 'LAB-CASE-OPEN-004',
    comparisonPolicyId: activePolicyId === 'LAB-CASE-OPEN-004' ? 'ENERGY-CASE-PILOT-005' : activePolicyId,
  });

  const renderAnalysis = () => (
    <div className="rwb-notebook" aria-label="Active analysis notebook">
      <header className="rwb-document-head">
        <div>
          <span>ACTIVE ANALYSIS</span>
          <h1>{activeCaseId} · {activeCase?.subject || 'Controlled case'}</h1>
          <p>{measurementWindow ? `${measurementWindow.start} — ${measurementWindow.end}` : 'Declared measurement window'} · {activePolicy?.name}</p>
        </div>
        <div className="rwb-run-state" data-state={loading ? 'running' : error ? 'error' : 'ready'}>
          <i />{loading ? 'EVALUATING' : error ? 'ERROR' : 'READY'}
        </div>
      </header>

      <div className="rwb-parameter-bar" aria-label="Active research parameters">
        <label>
          <span>Case</span>
          <select aria-label="Case" value={activeCaseId} onChange={(event) => selectCase(event.target.value)}>
            {pack.cases.map((item) => <option key={item.case_id} value={item.case_id}>{item.case_id}</option>)}
          </select>
        </label>
        <label>
          <span>Policy</span>
          <select aria-label="Policy" value={activePolicyId} onChange={(event) => selectPolicy(event.target.value)}>
            {pack.policies.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label>
          <span>Assurance</span>
          <select aria-label="Proof / assurance" value={activeScenarioId} onChange={(event) => selectScenario(event.target.value)}>
            {pack.scenarios.map((item) => <option key={item.scenario_id} value={item.scenario_id}>{item.name}</option>)}
          </select>
        </label>
        <label className="rwb-stress-control">
          <span>Settlement stress · {Math.round(settlementMultiplier * 100)}%</span>
          <input
            aria-label="Settlement capacity"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settlementMultiplier}
            disabled={blocked}
            onChange={(event) => setSettlementMultiplier(event.target.value)}
          />
        </label>
      </div>

      {error ? <div className="rwb-error" role="alert">{error}</div> : null}

      <section className="rwb-cell rwb-question-cell">
        <div className="rwb-cell-gutter"><span>Q1</span></div>
        <div className="rwb-cell-body">
          <span className="rwb-cell-type">Research question</span>
          <h2>Given the declared evidence and assurance state, what quantity can this policy justify, and how much remains covered under settlement stress?</h2>
          <p>The case, policy manifest, assurance scenario, and settlement condition are explicit inputs. Evidence identity is preserved while policy and assurance assumptions are changed.</p>
        </div>
      </section>

      <section className="rwb-cell">
        <div className="rwb-cell-gutter"><span>01</span></div>
        <div className="rwb-cell-body">
          <div className="rwb-cell-title-row">
            <div><span className="rwb-cell-type">Inputs</span><h2>Declared research state</h2></div>
            <button type="button" onClick={() => setDocument('data')}>inspect data</button>
          </div>
          <table className="rwb-input-table">
            <tbody>
              <tr><th>Evidence quantity</th><td>{formatQuantity(requested)}</td><th>Assurance</th><td>{activeRun?.provenance?.level || activeScenario?.scenario_id || '—'}</td></tr>
              <tr><th>Policy</th><td>{activePolicy?.id}</td><th>Version</th><td>{activePolicy?.version || '—'}</td></tr>
              <tr><th>Context refs</th><td colSpan="3">{contextRefs.length ? contextRefs.join(', ') : 'none declared'}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rwb-cell">
        <div className="rwb-cell-gutter"><span>02</span></div>
        <div className="rwb-cell-body">
          <div className="rwb-cell-title-row">
            <div><span className="rwb-cell-type">Method</span><h2>Admission → quantity ceiling → settlement</h2></div>
            <button type="button" onClick={() => setDocument('methods')}>open method</button>
          </div>
          <div className="rwb-method-chain" aria-label="Policy evaluation method">
            <div><span>Admission</span><strong>{admissionRules.length} rules</strong><small>{blocked ? `stops at ${humanize(mainRule)}` : 'passed'}</small></div>
            <i>→</i>
            <div><span>Quantity</span><strong>{blocked ? 'not executed' : `${quantityRules.length} ceilings`}</strong><small>{blocked ? 'fail-closed' : humanize(mainRule)}</small></div>
            <i>→</i>
            <div><span>Settlement</span><strong>{blocked ? 'not executed' : `${Math.round(settlementMultiplier * 100)}% capacity`}</strong><small>{blocked ? '—' : settlement?.result || 'pending'}</small></div>
          </div>
        </div>
      </section>

      <section className="rwb-cell rwb-result-cell">
        <div className="rwb-cell-gutter"><span>03</span></div>
        <div className="rwb-cell-body">
          <div className="rwb-cell-title-row">
            <div><span className="rwb-cell-type">Result</span><h2>Deterministic decision output</h2></div>
            <button type="button" onClick={openInvestigation}>open investigation</button>
          </div>
          <div className="rwb-result-head" data-state={blocked ? 'blocked' : 'admitted'}>
            <strong>{decision ? decision.decision.replaceAll('_', ' ') : 'PENDING'}</strong>
            <span>{decision ? humanize(mainRule) : 'waiting for evaluation'}</span>
          </div>
          <div className="rwb-result-grid" aria-label="Requested, justified, covered and shortfall quantities">
            <div><span>Requested</span><strong>{formatQuantity(requested)}</strong></div>
            <div><span>Justified maximum</span><strong>{blocked ? '—' : formatQuantity(justified)}</strong></div>
            <div><span>Covered</span><strong>{blocked ? '—' : formatQuantity(covered)}</strong></div>
            <div><span>Shortfall</span><strong>{blocked ? '—' : formatQuantity(shortfall)}</strong></div>
          </div>
          {!blocked && justified != null ? (
            <div className="rwb-quantity-track" aria-label="Covered share of admitted maximum">
              <div className="rwb-quantity-fill" style={{ width: `${justified > 0 ? Math.min(100, (covered / justified) * 100) : 0}%` }} />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );

  const renderRuns = () => (
    <div className="rwb-table-document">
      <header className="rwb-document-head">
        <div><span>EXPERIMENT TABLE</span><h1>Case runs under the active policy and assurance scenario</h1><p>One comparable run per controlled case; select a row to make it active.</p></div>
      </header>
      <div className="rwb-run-table-wrap">
        <table className="rwb-run-table" aria-label="Controlled case runs">
          <thead><tr><th>Case</th><th>Decision</th><th>Requested</th><th>Admitted max</th><th>Binding / blocking rule</th><th>Decision ID</th></tr></thead>
          <tbody>
            {runRows.map((row) => (
              <tr key={row.caseManifest.case_id} className={row.caseManifest.case_id === activeCaseId ? 'active' : ''} onClick={() => selectCase(row.caseManifest.case_id)}>
                <td><strong>{row.caseManifest.case_id}</strong><small>{row.caseManifest.subject}</small></td>
                <td data-state={row.blocked ? 'blocked' : 'admitted'}>{row.primary}</td>
                <td>{formatQuantity(row.run?.evidence?.summary?.total_eligible_surplus_kwh)}</td>
                <td>{row.quantity == null ? '—' : formatQuantity(row.quantity)}</td>
                <td>{humanize(row.rule)}</td>
                <td><code>{shortHash(row.run?.decision?.decision_id, 8, 5)}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMethods = () => (
    <div className="rwb-table-document">
      <header className="rwb-document-head">
        <div><span>METHOD MANIFEST</span><h1>{activePolicy?.name}</h1><p>{activePolicy?.description}</p></div>
      </header>
      <section className="rwb-method-section">
        <h2>Admission rules</h2>
        <table className="rwb-method-table"><thead><tr><th>Rule ID</th><th>Calculator</th><th>Parameters</th></tr></thead><tbody>{admissionRules.map((rule) => <tr key={rule.rule_id}><td><code>{rule.rule_id}</code></td><td>{rule.calculator_id}</td><td><code>{JSON.stringify(rule.parameters || {})}</code></td></tr>)}</tbody></table>
      </section>
      <section className="rwb-method-section">
        <h2>Quantity ceilings</h2>
        <table className="rwb-method-table"><thead><tr><th>Rule ID</th><th>Calculator</th><th>Parameters</th></tr></thead><tbody>{quantityRules.map((rule) => <tr key={rule.rule_id}><td><code>{rule.rule_id}</code></td><td>{rule.calculator_id}</td><td><code>{JSON.stringify(rule.parameters || {})}</code></td></tr>)}</tbody></table>
      </section>
    </div>
  );

  const renderData = () => (
    <div className="rwb-table-document">
      <header className="rwb-document-head">
        <div><span>DATA / EVIDENCE</span><h1>{activeCaseId} declared evidence state</h1><p>Inspect identity and scope before interpreting the decision.</p></div>
      </header>
      <section className="rwb-data-grid">
        <article><span>Evidence hash</span><code>{evidence?.evidence_hash || 'pending'}</code></article>
        <article><span>Measurement window</span><strong>{measurementWindow ? `${measurementWindow.start} → ${measurementWindow.end}` : '—'}</strong></article>
        <article><span>Case type</span><strong>{activeCase?.case_type || '—'}</strong></article>
        <article><span>Context</span><strong>{contextRefs.length ? contextRefs.join(', ') : 'none'}</strong></article>
      </section>
      <section className="rwb-method-section">
        <h2>Interpretation boundaries</h2>
        <ol className="rwb-boundary-list">{boundaries.map((boundary) => <li key={boundary}>{boundary}</li>)}</ol>
      </section>
      <section className="rwb-method-section rwb-public-checkpoint-note">
        <h2>Outside-data checkpoint</h2>
        <p><strong>{PUBLIC_EVIDENCE_CHECKPOINT.case_id}</strong> · {PUBLIC_EVIDENCE_CHECKPOINT.source.publisher} · {PUBLIC_EVIDENCE_CHECKPOINT.evidence.assurance}</p>
        <p>{PUBLIC_EVIDENCE_CHECKPOINT.evidence.total_eligible_surplus_kwh} kWh derived eligible surplus across {PUBLIC_EVIDENCE_CHECKPOINT.source.interval_count} intervals. This remains a public-data operability checkpoint, not operator validation.</p>
      </section>
    </div>
  );

  return (
    <main className="rwb-page" aria-labelledby="research-workbench-title">
      <header className="rwb-page-head">
        <div>
          <span>POLICY LAB / RESEARCH WORKSPACE</span>
          <h1 id="research-workbench-title">Evidence-constrained policy analysis</h1>
        </div>
        <div className="rwb-page-meta">
          <span>case pack <strong>{pack.manifest?.id || pack.manifest?.pack_id || 'energy-v1'}</strong></span>
          <span>{pack.cases.length} cases · {pack.policies.length} policies · {pack.scenarios.length} assurance scenarios</span>
        </div>
      </header>

      <section className="rwb-shell">
        <aside className="rwb-browser" aria-label="Research workspace browser">
          <div className="rwb-browser-title"><FileText size={15} /><strong>Workspace</strong></div>
          <WorkspaceSection title="Cases">
            {pack.cases.map((item) => (
              <button key={item.case_id} type="button" className={item.case_id === activeCaseId ? 'active' : ''} onClick={() => selectCase(item.case_id)}>
                <FileText size={14} /><span><strong>{item.case_id}</strong><small>{item.subject}</small></span>
              </button>
            ))}
          </WorkspaceSection>
          <WorkspaceSection title="Policies">
            {pack.policies.map((item) => (
              <button key={item.id} type="button" className={item.id === activePolicyId ? 'active' : ''} onClick={() => selectPolicy(item.id)}>
                <ShieldCheck size={14} /><span><strong>{item.name}</strong><small>{item.id}</small></span>
              </button>
            ))}
          </WorkspaceSection>
          <WorkspaceSection title="Assurance">
            {pack.scenarios.map((item) => (
              <button key={item.scenario_id} type="button" className={item.scenario_id === activeScenarioId ? 'active' : ''} onClick={() => selectScenario(item.scenario_id)}>
                <FlaskConical size={14} /><span><strong>{item.name}</strong><small>{item.scenario_id}</small></span>
              </button>
            ))}
          </WorkspaceSection>
          <WorkspaceSection title="External evidence">
            <button type="button" onClick={() => setDocument('data')}>
              <Database size={14} /><span><strong>{PUBLIC_EVIDENCE_CHECKPOINT.case_id}</strong><small>Ausgrid · public L0 checkpoint</small></span>
            </button>
          </WorkspaceSection>
        </aside>

        <section className="rwb-center">
          <nav className="rwb-tabs" aria-label="Research documents">
            {DOCUMENTS.map(([id, label, Icon]) => (
              <button key={id} type="button" className={document === id ? 'active' : ''} onClick={() => setDocument(id)} aria-current={document === id ? 'page' : undefined}>
                <Icon size={14} />{label}
              </button>
            ))}
          </nav>
          <div className="rwb-document-area">
            {document === 'analysis' ? renderAnalysis() : null}
            {document === 'runs' ? renderRuns() : null}
            {document === 'methods' ? renderMethods() : null}
            {document === 'data' ? renderData() : null}
          </div>
        </section>

        <aside className="rwb-inspector" aria-label="Research object inspector">
          <nav aria-label="Inspector tabs">
            {['run', 'provenance', 'boundary'].map((id) => <button key={id} type="button" className={inspector === id ? 'active' : ''} onClick={() => setInspector(id)}>{id}</button>)}
          </nav>
          {inspector === 'run' ? (
            <dl>
              <InspectorField label="Decision">{decision?.decision?.replaceAll('_', ' ') || 'pending'}</InspectorField>
              <InspectorField label="Binding / blocking">{humanize(mainRule)}</InspectorField>
              <InspectorField label="Decision ID"><code>{decision?.decision_id || 'pending'}</code></InspectorField>
              <InspectorField label="Policy"><code>{activePolicyId}</code></InspectorField>
              <InspectorField label="Settlement">{blocked ? 'not executed' : `${settlement?.result || 'pending'} · ${Math.round(settlementMultiplier * 100)}%`}</InspectorField>
            </dl>
          ) : null}
          {inspector === 'provenance' ? (
            <dl>
              <InspectorField label="Evidence hash"><code>{evidence?.evidence_hash || 'pending'}</code></InspectorField>
              <InspectorField label="Assurance scenario"><code>{activeScenarioId}</code></InspectorField>
              <InspectorField label="Provenance level">{activeRun?.provenance?.level || '—'}</InspectorField>
              <InspectorField label="Case manifest"><code>{activeCaseId}</code></InspectorField>
              <InspectorField label="Policy version">{activePolicy?.version || '—'}</InspectorField>
            </dl>
          ) : null}
          {inspector === 'boundary' ? (
            <div className="rwb-inspector-boundaries">
              <h2>Interpretation boundary</h2>
              {boundaries.map((item) => <p key={item}>{item}</p>)}
            </div>
          ) : null}
        </aside>

        <footer className="rwb-output-bar" aria-label="Reproducibility and output actions">
          <div><History size={14} /><span>active run</span><code>{shortHash(decision?.decision_id, 10, 6)}</code></div>
          <div><span>evidence</span><code>{shortHash(evidence?.evidence_hash, 10, 6)}</code></div>
          <div className="rwb-output-actions">
            <button type="button" onClick={openCompare}><GitCompareArrows size={14} />Compare</button>
            <button type="button" onClick={() => onNavigate?.({ section: 'verify', tool: 'lineage' })}>Verify lineage</button>
            <button type="button" onClick={openInvestigation}>Investigate</button>
            <button type="button" onClick={onOpenFullAnalysis}>Full analysis</button>
          </div>
        </footer>
      </section>
    </main>
  );
}
