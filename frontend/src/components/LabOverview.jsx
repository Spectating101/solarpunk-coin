import React, { useMemo, useState } from 'react';
import {
  Ban,
  Boxes,
  Database,
  FileCheck2,
  Gauge,
  GitBranch,
  Landmark,
  ShieldCheck,
} from 'lucide-react';
import { useCaseWorkbench } from '../app/CaseWorkbenchProvider';
import PublicEvidenceCheckpoint from './PublicEvidenceCheckpoint';
import {
  EmptyState,
  LinkButton,
  PlatformPageIntro,
  StatusBadge,
  ValueFlow,
  formatQuantity,
  humanize,
  shortHash,
} from './platform/PlatformSurface';
import '../styles/flagshipHardening.css';
import '../styles/pairedPlatform.css';

const PIPELINE = [
  ['evidence', 'Evidence', 'Source identity, measurement window, capabilities, diagnostics, and evidence hash remain explicit.'],
  ['assurance', 'Assurance', 'Evidence capability and source truth are not collapsed into one confidence score.'],
  ['policy', 'Policy', 'Versioned admission requirements and quantity ceilings decide what evidence may authorize.'],
  ['admission', 'Admission', 'A blocked case never reaches quantity evaluation.'],
  ['quantity', 'Quantity', 'Passing admission still produces a bounded maximum with binding attribution.'],
  ['settlement', 'Settlement', 'A bounded claim can remain partially or completely uncovered.'],
  ['receipt', 'Receipt', 'The durable output links case, evidence, context, policy, rules, decision, and runtime identity.'],
];

const OBJECTS = [
  'CaseManifest',
  'EvidenceEnvelope',
  'ContextManifest',
  'PolicyManifest',
  'ConstraintEvaluation',
  'DecisionResult',
  'SettlementResult',
  'DecisionReceipt',
  'ResearchCapsule',
];

export default function LabOverview({ viewMode = 'overview', onViewModeChange, onNavigate }) {
  const [activeStage, setActiveStage] = useState('evidence');
  const {
    pack,
    activeCaseId,
    activePolicyId,
    activeScenarioId,
    activeRun,
    activeStress,
    settlementMultiplier,
    selectCase,
    selectPolicy,
    selectScenario,
    setSettlementMultiplier,
    loading,
    error,
  } = useCaseWorkbench();

  const decision = activeRun?.decision || null;
  const evidence = activeRun?.evidence || null;
  const blocked = decision?.decision === 'BLOCKED';
  const requested = evidence?.summary?.total_eligible_surplus_kwh ?? null;
  const justified = blocked ? null : decision?.capacity?.admitted_maximum;
  const settlement = activeStress?.available ? activeStress.settlement : null;
  const covered = settlement?.covered_quantity ?? null;
  const shortfall = settlement?.shortfall_quantity ?? null;
  const mainRule = blocked
    ? decision?.admission?.blocking_rules?.[0]
    : decision?.capacity?.binding_constraints?.[0];
  const activePipeline = useMemo(() => PIPELINE.find(([id]) => id === activeStage) || PIPELINE[0], [activeStage]);

  const openInvestigation = (lens = 'constraints') => onNavigate({
    section: 'case',
    id: activeCaseId,
    policyId: activePolicyId,
    scenarioId: activeScenarioId,
    lens,
  });

  if (viewMode === 'full') {
    return (
      <main className="platform-page overview-surface full" aria-labelledby="full-overview-title">
        <PlatformPageIntro
          kicker="Overview · complete platform analysis"
          title="See the whole programme behind the active decision."
          description="The same case state now exposes the object model, source-to-receipt pipeline, platform inventory, live result, validation boundary, research layers, and external value gate."
          viewMode="full"
        >
          <LinkButton onClick={() => onViewModeChange('overview')}>Return to interpreted overview</LinkButton>
        </PlatformPageIntro>

        <PublicEvidenceCheckpoint />

        <section className="platform-active-state">
          <div>
            <span>Interactive controlled-case state</span>
            <strong>{activeCaseId} · {activeScenarioId} · {activePolicyId}</strong>
            <code>settlement {Math.round(settlementMultiplier * 100)}% · evidence {shortHash(evidence?.evidence_hash)}</code>
          </div>
          <div className="platform-state-controls">
            <select aria-label="Active case" value={activeCaseId} onChange={(event) => selectCase(event.target.value)}>
              {pack.cases.map((item) => <option key={item.case_id} value={item.case_id}>{item.case_id}</option>)}
            </select>
            <select aria-label="Active policy" value={activePolicyId} onChange={(event) => selectPolicy(event.target.value)}>
              {pack.policies.map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}
            </select>
            <select aria-label="Active assurance scenario" value={activeScenarioId} onChange={(event) => selectScenario(event.target.value)}>
              {pack.scenarios.map((item) => <option key={item.scenario_id} value={item.scenario_id}>{item.name}</option>)}
            </select>
          </div>
        </section>

        <section className="platform-three-column overview-full-grid">
          <article className="platform-panel">
            <header><span>Research objects</span><h2>What constitutes the platform?</h2></header>
            <div className="overview-object-list">
              {OBJECTS.map((object) => <button key={object} type="button" onClick={() => onNavigate({ section: 'verify', tool: 'objects' })}>{object}</button>)}
            </div>
          </article>

          <article className="platform-panel">
            <header><span>Decision pipeline</span><h2>Follow the claim from source to replay.</h2></header>
            <div className="overview-pipeline-list">
              {PIPELINE.map(([id, label], index) => (
                <button key={id} type="button" className={activeStage === id ? 'active' : ''} onClick={() => setActiveStage(id)}>
                  <span>{String(index + 1).padStart(2, '0')}</span><strong>{label}</strong>
                </button>
              ))}
            </div>
            <div className="platform-inline-proof">
              <GitBranch size={18} />
              <span><strong>{activePipeline[1]}</strong> · {activePipeline[2]}</span>
            </div>
          </article>

          <article className="platform-panel">
            <header><span>Interactive result</span><h2>Same engine, complete context.</h2></header>
            {loading ? <EmptyState>Evaluating the active programme state…</EmptyState> : null}
            {error ? <div className="workbench-error" role="alert">{error}</div> : null}
            {decision ? (
              <>
                <div className={`platform-decision-mark ${blocked ? 'blocked' : 'admitted'}`}>
                  {blocked ? <Ban size={25} /> : <Gauge size={25} />}
                  <strong>{decision.decision.replaceAll('_', ' ')}</strong>
                </div>
                <ValueFlow requested={requested} justified={justified} covered={covered} blocked={blocked} />
                <dl className="platform-fact-list">
                  <div><dt>Main rule</dt><dd>{humanize(mainRule)}</dd></div>
                  <div><dt>Shortfall</dt><dd>{blocked ? '—' : formatQuantity(shortfall)}</dd></div>
                  <div><dt>Decision ID</dt><dd><code>{shortHash(decision.decision_id, 14, 10)}</code></dd></div>
                </dl>
                <div className="platform-action-stack">
                  <LinkButton primary onClick={() => openInvestigation('constraints')}>Open complete investigation</LinkButton>
                  <LinkButton onClick={() => onNavigate({ section: 'analysis', tool: 'compare' })}>Open Analysis Lab</LinkButton>
                  <LinkButton onClick={() => onNavigate({ section: 'verify', tool: 'lineage' })}>Verify active result</LinkButton>
                </div>
              </>
            ) : null}
          </article>
        </section>

        <section className="overview-inventory-strip">
          <div><strong>{pack.cases.length}</strong><span>Interactive cases</span></div>
          <div><strong>1</strong><span>Outside-data checkpoint</span></div>
          <div><strong>{pack.policies.length}</strong><span>Policies</span></div>
          <div><strong>{pack.cases.length * pack.policies.length}</strong><span>Interactive case-policy decisions</span></div>
          <div><strong>{pack.scenarios.length}</strong><span>Assurance scenarios</span></div>
          <div><strong>1</strong><span>Historical study</span></div>
          <div><strong>1</strong><span>Owner-source gate open</span></div>
        </section>

        <section className="platform-three-column overview-programme-grid">
          <article className="platform-panel">
            <header><span>Validation state</span><h2>What is already testable?</h2></header>
            <div className="research-evidence-matrix">
              <div><span>Decision core</span><StatusBadge tone="pass">TESTED</StatusBadge></div>
              <div><span>Controlled case-pack comparison</span><StatusBadge tone="pass">TESTED</StatusBadge></div>
              <div><span>Outside public-data case</span><StatusBadge tone="pass">REPRODUCED</StatusBadge></div>
              <div><span>Receipt generation</span><StatusBadge tone="pass">TESTED</StatusBadge></div>
              <div><span>Capsule generation</span><StatusBadge tone="pass">TESTED</StatusBadge></div>
              <div><span>Operator-format path</span><StatusBadge tone="pass">TESTED</StatusBadge></div>
              <div><span>Owner-supplied source</span><StatusBadge tone="warn">OPEN</StatusBadge></div>
            </div>
          </article>

          <article className="platform-panel">
            <header><span>Programme layers</span><h2>One question, several research instruments.</h2></header>
            <div className="overview-layer-list">
              <button type="button" onClick={() => onNavigate({ section: 'research' })}><Database size={17} /><span><strong>ECI</strong>Evidence fitness and assurance</span></button>
              <button type="button" onClick={() => onNavigate({ section: 'research' })}><Boxes size={17} /><span><strong>Constrained Ledger</strong>Authority, quantity, identity, settlement</span></button>
              <button type="button" onClick={() => onNavigate({ section: 'investigate' })}><ShieldCheck size={17} /><span><strong>Policy Lab</strong>Executable cases and comparisons</span></button>
              <button type="button" onClick={() => onNavigate({ section: 'research' })}><Landmark size={17} /><span><strong>Institutional evidence</strong>Source-linked process mapping</span></button>
              <button type="button" onClick={() => onNavigate({ section: 'studies' })}><FileCheck2 size={17} /><span><strong>Empirical studies</strong>Policy-performance evaluation</span></button>
            </div>
          </article>

          <article className="platform-panel">
            <header><span>Research boundary</span><h2>What is not claimed.</h2></header>
            <div className="research-evidence-matrix">
              <div><span>Real operator validation</span><StatusBadge tone="warn">NOT YET</StatusBadge></div>
              <div><span>Physical meter truth</span><StatusBadge tone="warn">NOT CLAIMED</StatusBadge></div>
              <div><span>Legal issuance authority</span><StatusBadge tone="warn">NOT CLAIMED</StatusBadge></div>
              <div><span>Reserve custody</span><StatusBadge tone="warn">NOT CLAIMED</StatusBadge></div>
              <div><span>Production governance</span><StatusBadge tone="warn">NOT CLAIMED</StatusBadge></div>
            </div>
          </article>
        </section>

        <section className="platform-mission-strip overview-next-gate">
          <div><ShieldCheck size={17} /><strong>Next external value gate</strong></div>
          <span>One attributable owner/operator evidence source</span>
          <button type="button" onClick={() => onNavigate({ section: 'field' })}>Open field-use workflow</button>
        </section>
      </main>
    );
  }

  return (
    <main className="platform-page overview-surface" aria-labelledby="overview-title">
      <PlatformPageIntro
        kicker="Overview · executable programme synopsis"
        title="Can real-world evidence justify a financial claim?"
        description="The outside-data checkpoint shows what happened with a pinned public Ausgrid source. The interactive controlled cases below let you change assurance, policy, and settlement conditions through the same deterministic decision machinery."
        viewMode="overview"
      >
        <LinkButton primary onClick={() => onViewModeChange('full')}>Open full analysis</LinkButton>
      </PlatformPageIntro>

      <PublicEvidenceCheckpoint compact />

      <section className="platform-three-column overview-console">
        <article className="platform-panel">
          <header><span>Interactive controlled cases</span><h2>Change one condition</h2></header>
          <label>
            Case
            <select value={activeCaseId} onChange={(event) => selectCase(event.target.value)}>
              {pack.cases.map((item) => <option key={item.case_id} value={item.case_id}>{item.case_id} · {item.subject}</option>)}
            </select>
          </label>
          <label>
            Proof / assurance
            <select value={activeScenarioId} onChange={(event) => selectScenario(event.target.value)}>
              {pack.scenarios.map((item) => <option key={item.scenario_id} value={item.scenario_id}>{item.name}</option>)}
            </select>
          </label>
          <label>
            Policy
            <select value={activePolicyId} onChange={(event) => selectPolicy(event.target.value)}>
              {pack.policies.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label>
            Settlement · {Math.round(settlementMultiplier * 100)}%
            <input type="range" min="0" max="1" step="0.1" value={settlementMultiplier} disabled={blocked} onChange={(event) => setSettlementMultiplier(event.target.value)} />
          </label>
        </article>

        <article className="platform-panel">
          <header><span>Consequence</span><h2>Live claim journey</h2></header>
          {loading ? <EmptyState>Evaluating the active state…</EmptyState> : null}
          {decision ? (
            <>
              <ValueFlow requested={requested} justified={justified} covered={covered} blocked={blocked} />
              <div className="overview-stage-summary">
                <div><span>01</span><strong>Evidence</strong><StatusBadge tone="pass">AVAILABLE</StatusBadge></div>
                <div><span>02</span><strong>Qualification</strong><StatusBadge tone={blocked ? 'fail' : 'pass'}>{blocked ? 'BLOCKED' : 'PASS'}</StatusBadge></div>
                <div><span>03</span><strong>Quantity</strong><StatusBadge tone={blocked ? 'neutral' : 'pass'}>{blocked ? 'NOT RUN' : 'BOUNDED'}</StatusBadge></div>
                <div><span>04</span><strong>Settlement</strong><StatusBadge tone={settlement?.result === 'SETTLED' ? 'pass' : settlement ? 'warn' : 'neutral'}>{blocked ? 'UNAVAILABLE' : settlement?.result || 'RUNNING'}</StatusBadge></div>
              </div>
            </>
          ) : null}
        </article>

        <article className="platform-panel">
          <header><span>Why / proof</span><h2>Current explanation</h2></header>
          {decision ? (
            <>
              <div className={`platform-decision-mark ${blocked ? 'blocked' : 'admitted'}`}>
                {blocked ? <Ban size={25} /> : <Gauge size={25} />}
                <strong>{decision.decision.replaceAll('_', ' ')}</strong>
              </div>
              <dl className="platform-fact-list">
                <div><dt>Main reason</dt><dd>{humanize(mainRule)}</dd></div>
                <div><dt>Evidence identity</dt><dd><code>{shortHash(evidence.evidence_hash)}</code></dd></div>
                <div><dt>Decision identity</dt><dd><code>{shortHash(decision.decision_id)}</code></dd></div>
                <div><dt>Boundary</dt><dd>{decision.boundary}</dd></div>
              </dl>
              <div className="platform-action-stack">
                <LinkButton primary onClick={() => openInvestigation(blocked ? 'constraints' : 'stress')}>Continue the investigation</LinkButton>
                <LinkButton onClick={() => onNavigate({ section: 'verify', tool: 'lineage' })}>Inspect the proof trail</LinkButton>
              </div>
            </>
          ) : <EmptyState>No result has resolved yet.</EmptyState>}
        </article>
      </section>

      <section className="overview-inventory-strip compact">
        <div><strong>{pack.cases.length}</strong><span>Interactive cases</span></div>
        <div><strong>1</strong><span>Outside-data checkpoint</span></div>
        <div><strong>{pack.policies.length}</strong><span>Policies</span></div>
        <div><strong>{pack.cases.length * pack.policies.length}</strong><span>Interactive case-policy decisions</span></div>
        <div><strong>1</strong><span>Historical study</span></div>
        <div><strong>1</strong><span>Owner-source gate open</span></div>
      </section>
    </main>
  );
}
