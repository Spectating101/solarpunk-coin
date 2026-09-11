import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Database,
  GitBranch,
  History,
  Landmark,
  ShieldCheck,
} from 'lucide-react';
import { useCaseWorkbench } from '../app/CaseWorkbenchProvider';
import { PUBLIC_EVIDENCE_CHECKPOINT } from '../data/publicEvidenceCheckpoint';
import { formatQuantity, humanize, shortHash } from './platform/PlatformSurface';
import '../styles/researchAtlas.css';
import '../styles/researchExplorer.css';

const NORWAY_REFERENCE = Object.freeze({
  id: 'NORWAY-INSTITUTIONAL',
  title: 'Norway institutional evidence',
  subtitle: 'Elhub · Guarantees of Origin · flexibility / reserve admission',
  kind: 'institutional',
  assurance: 'comparative institutional evidence',
  status: 'REFERENCE',
  demonstrates: 'Evidence quality, actor authority, quantity mapping, registry identity, anti-reuse, settlement and correction are distinct institutional layers.',
  boundary: 'Comparative institutional evidence only. It does not validate Policy Lab at Norwegian national scale or establish an energy-backed monetary system.',
});

const AUSGRID_REFERENCE = Object.freeze({
  id: PUBLIC_EVIDENCE_CHECKPOINT.case_id,
  title: 'Ausgrid public-data checkpoint',
  subtitle: 'Solar Home Electricity Data',
  kind: 'public',
  assurance: PUBLIC_EVIDENCE_CHECKPOINT.evidence.assurance,
  status: 'REPRODUCED',
  demonstrates: 'A real outside dataset can pass evidence normalization and deterministic decision reproduction without being promoted into operator-certified truth.',
  boundary: 'Public-data operability checkpoint. No source-holder confirmation, physical meter certification, legal issuance authority, or monetary-performance claim.',
});

const OWNER_OPERATOR_FRONTIER = Object.freeze({
  id: 'OWNER-OPERATOR-SOURCE',
  title: 'Owner / operator evidence',
  subtitle: 'Attributable higher-assurance source',
  kind: 'frontier',
  assurance: 'OPEN',
  status: 'OPEN',
  demonstrates: 'Would test whether the same machinery survives attributable source-holder evidence and higher-assurance provenance.',
  boundary: 'This evidence gate is not closed. No operator relationship, source-holder validation, or L2+ external case is implied.',
});

const FINDINGS = Object.freeze([
  {
    id: 'F-01',
    status: 'SUPPORTED',
    title: 'Policy changes can alter financial authority without changing the evidence identity.',
    support: 'Controlled case pack · same-evidence counterfactuals',
  },
  {
    id: 'F-02',
    status: 'SUPPORTED',
    title: 'An admitted quantity can bind for different reasons: evidence, provenance-policy, or modeled resource context.',
    support: 'PHX-001 · TYN-001 · AUS-001',
  },
  {
    id: 'F-03',
    status: 'SUPPORTED',
    title: 'Admission and settlement are separate research questions.',
    support: 'PUB-AUSGRID-001P · settlement stress harness',
  },
  {
    id: 'F-04',
    status: 'COMPARATIVE',
    title: 'Mature electricity institutions separate evidence quality, authority, quantity, identity, settlement, and correction.',
    support: 'Norway institutional evidence dossier',
  },
  {
    id: 'F-05',
    status: 'OPEN',
    title: 'Owner/operator source validation remains the next material external-evidence gate.',
    support: 'External Case programme',
  },
]);

const EVIDENCE_LAYERS = Object.freeze([
  ['Controlled fixtures', 'Executable', 'Mechanism isolation across cases, policies and assurance counterfactuals.', 'Not operator evidence.'],
  ['Operator-format synthetic intake', 'Executable', 'Intake, normalization, fail-closed provenance behavior.', 'Not a named operator archive.'],
  ['Ausgrid public checkpoint', 'L0 · reproduced', 'Outside-data operability and bounded decision reproduction.', 'Not source-holder or physical-meter certification.'],
  ['Norway institutional evidence', 'Comparative', 'Real-world institutional separation of evidence, authority, quantity and settlement.', 'Reference evidence, not system validation.'],
  ['Owner/operator evidence', 'OPEN', 'Would test source-holder and higher-assurance external validation.', 'Not yet closed.'],
]);

const TIMELINE = Object.freeze([
  ['2026-08-04', 'Norway institutional dossier', 'Comparative evidence links Policy Lab boundaries to mature electricity-market institutions.'],
  ['2026-08-15', 'Ausgrid public-data checkpoint', 'Outside data reproduces the open-policy limit, pilot-policy block, and partial settlement stress.'],
  ['2026-09-11', 'Specialized Gauntlet + research workspace', 'Non-promotion attacks, policy sensitivity, release provenance and an inspectable research interface converge.'],
]);

const RESEARCH_FRONTIER = Object.freeze([
  ['Mechanism cases', 'EXECUTABLE', 'pass'],
  ['Outside data', 'REPRODUCED', 'pass'],
  ['Institutional comparison', 'REFERENCE', 'neutral'],
  ['Owner / operator source', 'OPEN', 'open'],
  ['Independent reproduction', 'OPEN', 'open'],
  ['Monetary performance', 'UNTESTED', 'open'],
]);

function AtlasStatus({ children, tone = 'neutral' }) {
  return <span className={`atlas-status ${tone}`}>{children}</span>;
}

function scenarioLabel(scenario) {
  const match = String(scenario?.scenario_id || '').match(/L[0-4]/i);
  return match?.[0]?.toUpperCase() || scenario?.name || humanize(scenario?.scenario_id);
}

function policyLabel(policy) {
  if (/OPEN/i.test(policy?.id || '')) return 'Open';
  if (/PILOT/i.test(policy?.id || '')) return 'Pilot';
  if (/STRICT/i.test(policy?.id || '')) return 'Strict';
  return policy?.name || humanize(policy?.id);
}

function ResearchDetail({ node, run, activePolicy, activeScenario, onOpenWorkbench, onNavigate }) {
  if (!node) return null;

  if (node.kind === 'controlled') {
    const decision = run?.decision;
    const blocked = decision?.decision === 'BLOCKED';
    const mainRule = blocked
      ? decision?.admission?.blocking_rules?.[0]
      : decision?.capacity?.binding_constraints?.[0];
    return (
      <aside className="atlas-detail explorer-detail" aria-label="Selected research object">
        <header>
          <span>CONTROLLED CASE</span>
          <h2>{node.id}</h2>
          <p>{node.title}</p>
        </header>
        <dl>
          <div><dt>Evidence</dt><dd><code>{shortHash(run?.evidence?.evidence_hash, 9, 6)}</code></dd></div>
          <div><dt>Assurance</dt><dd>{scenarioLabel(activeScenario)}</dd></div>
          <div><dt>Policy</dt><dd>{policyLabel(activePolicy)}</dd></div>
          <div><dt>Decision</dt><dd>{decision?.decision?.replaceAll('_', ' ') || 'evaluating'}</dd></div>
          <div><dt>Binding / blocking</dt><dd>{humanize(mainRule)}</dd></div>
        </dl>
        <p className="atlas-boundary">Controlled mechanism evidence. Executable does not mean realized operator evidence.</p>
        <div className="atlas-detail-actions">
          <button type="button" onClick={onOpenWorkbench}>Open in workbench <ArrowRight size={14} /></button>
          <button type="button" onClick={() => onNavigate?.({ section: 'case', id: node.id, lens: 'constraints' })}>Inspect case</button>
        </div>
      </aside>
    );
  }

  if (node.id === AUSGRID_REFERENCE.id) {
    return (
      <aside className="atlas-detail explorer-detail" aria-label="Selected research object">
        <header>
          <span>OUTSIDE-DATA CHECKPOINT</span>
          <h2>{node.id}</h2>
          <p>{node.subtitle}</p>
        </header>
        <dl>
          <div><dt>Evidence state</dt><dd>{PUBLIC_EVIDENCE_CHECKPOINT.evidence.assurance}</dd></div>
          <div><dt>Source window</dt><dd>{PUBLIC_EVIDENCE_CHECKPOINT.source.interval_count} intervals</dd></div>
          <div><dt>Derived surplus</dt><dd>{PUBLIC_EVIDENCE_CHECKPOINT.evidence.total_eligible_surplus_kwh} kWh</dd></div>
          <div><dt>Open policy</dt><dd>{PUBLIC_EVIDENCE_CHECKPOINT.decisions.open.result.replaceAll('_', ' ')}</dd></div>
          <div><dt>Pilot policy</dt><dd>{PUBLIC_EVIDENCE_CHECKPOINT.decisions.pilot.result}</dd></div>
          <div><dt>Settlement</dt><dd>{Math.round(PUBLIC_EVIDENCE_CHECKPOINT.settlement.declared_capacity_fraction * 100)}% · {PUBLIC_EVIDENCE_CHECKPOINT.settlement.result}</dd></div>
        </dl>
        <p className="atlas-boundary">{node.boundary}</p>
        <div className="atlas-detail-actions">
          <button type="button" onClick={() => onNavigate?.({ section: 'research' })}>Open research layer <ArrowRight size={14} /></button>
        </div>
      </aside>
    );
  }

  if (node.id === OWNER_OPERATOR_FRONTIER.id) {
    return (
      <aside className="atlas-detail explorer-detail" aria-label="Selected research object">
        <header>
          <span>OPEN EXTERNAL GATE</span>
          <h2>{node.title}</h2>
          <p>{node.subtitle}</p>
        </header>
        <dl>
          <div><dt>Status</dt><dd>OPEN</dd></div>
          <div><dt>Would test</dt><dd>source-holder attribution · higher assurance · external workflow</dd></div>
          <div><dt>Current authority</dt><dd>none</dd></div>
        </dl>
        <p className="atlas-boundary">{node.boundary}</p>
      </aside>
    );
  }

  return (
    <aside className="atlas-detail explorer-detail" aria-label="Selected research object">
      <header>
        <span>INSTITUTIONAL REFERENCE</span>
        <h2>Norway</h2>
        <p>{node.subtitle}</p>
      </header>
      <dl>
        <div><dt>Status</dt><dd>{node.status}</dd></div>
        <div><dt>Research role</dt><dd>{node.assurance}</dd></div>
        <div><dt>Observation</dt><dd>evidence, authority, quantity, identity, settlement and correction remain separate layers</dd></div>
      </dl>
      <p className="atlas-boundary">{node.boundary}</p>
      <div className="atlas-detail-actions">
        <button type="button" onClick={() => onNavigate?.({ section: 'research' })}>Open research layer <ArrowRight size={14} /></button>
      </div>
    </aside>
  );
}

export default function ResearchAtlas({ onOpenWorkbench, onNavigate }) {
  const [view, setView] = useState('landscape');
  const [selectedId, setSelectedId] = useState(AUSGRID_REFERENCE.id);
  const {
    pack,
    visibleRunsByCaseId = {},
    activePolicyId,
    activeScenarioId,
    selectCase,
    selectPolicy,
    selectScenario,
  } = useCaseWorkbench();

  const controlledNodes = useMemo(() => pack.cases.map((item) => ({
    id: item.case_id,
    title: item.subject,
    kind: 'controlled',
    status: 'EXECUTABLE',
    assurance: 'scenario-dependent',
    caseType: item.case_type,
  })), [pack.cases]);

  const researchObjects = useMemo(() => [
    ...controlledNodes,
    AUSGRID_REFERENCE,
    NORWAY_REFERENCE,
    OWNER_OPERATOR_FRONTIER,
  ], [controlledNodes]);

  const selectedNode = researchObjects.find((node) => node.id === selectedId) || researchObjects[0];
  const selectedRun = selectedNode?.kind === 'controlled' ? visibleRunsByCaseId[selectedNode.id] : null;
  const activePolicy = pack.policies.find((policy) => policy.id === activePolicyId) || pack.policies[0];
  const activeScenario = pack.scenarios.find((scenario) => scenario.scenario_id === activeScenarioId) || pack.scenarios[0];
  const activeDecision = selectedRun?.decision;
  const activeBlocked = activeDecision?.decision === 'BLOCKED';
  const activeRule = activeBlocked
    ? activeDecision?.admission?.blocking_rules?.[0]
    : activeDecision?.capacity?.binding_constraints?.[0];

  const chooseObject = (node) => {
    setSelectedId(node.id);
    if (node.kind === 'controlled') selectCase(node.id);
  };

  return (
    <section className="research-atlas" aria-labelledby="research-atlas-title">
      <header className="atlas-head">
        <div>
          <span>POLICY LAB / RESEARCH EXPLORER</span>
          <h1 id="research-atlas-title">Explore how evidence becomes — or fails to become — financial authority.</h1>
        </div>
        <div className="atlas-head-summary">
          <strong>{researchObjects.length}</strong><span>research objects</span>
          <strong>{FINDINGS.length}</strong><span>findings / open propositions</span>
        </div>
      </header>

      <nav className="atlas-view-tabs" aria-label="Research atlas views">
        {[
          ['landscape', 'Landscape', Landmark],
          ['findings', 'Findings', BookOpen],
          ['evidence', 'Evidence', Database],
          ['timeline', 'Timeline', History],
        ].map(([id, label, Icon]) => (
          <button key={id} type="button" className={view === id ? 'active' : ''} onClick={() => setView(id)} aria-current={view === id ? 'page' : undefined}>
            <Icon size={14} />{label}
          </button>
        ))}
        <button type="button" className="atlas-workbench-link" onClick={onOpenWorkbench}><GitBranch size={14} />Workbench</button>
      </nav>

      {view === 'landscape' ? (
        <div className="explorer-layout">
          <div className="research-landscape" role="region" aria-label="Research landscape explorer">
            <div className="explorer-stage evidence-stage">
              <header><span>01</span><strong>Evidence objects</strong><small>select what is being investigated</small></header>
              <div className="explorer-object-list">
                {researchObjects.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    className={`explorer-object ${node.kind} ${selectedId === node.id ? 'selected' : ''}`}
                    onClick={() => chooseObject(node)}
                    aria-label={`${node.title}. ${node.kind} research object.`}
                  >
                    <span className="explorer-object-mark" aria-hidden="true" />
                    <span><strong>{node.id}</strong><small>{node.title}</small></span>
                    <em>{node.status}</em>
                  </button>
                ))}
              </div>
            </div>

            <div className="explorer-stage assurance-stage">
              <header><span>02</span><strong>Assurance</strong><small>change the declared evidence context</small></header>
              <div className="explorer-choice-stack" role="group" aria-label="Research assurance states">
                {pack.scenarios.map((scenario) => (
                  <button
                    key={scenario.scenario_id}
                    type="button"
                    className={activeScenarioId === scenario.scenario_id ? 'active' : ''}
                    onClick={() => selectScenario(scenario.scenario_id)}
                    aria-pressed={activeScenarioId === scenario.scenario_id}
                  >
                    <strong>{scenarioLabel(scenario)}</strong>
                    <small>{scenario.name || humanize(scenario.scenario_id)}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="explorer-stage policy-stage">
              <header><span>03</span><strong>Policy</strong><small>change the rule set, not the evidence</small></header>
              <div className="explorer-choice-stack" role="group" aria-label="Research policy states">
                {pack.policies.map((policy) => (
                  <button
                    key={policy.id}
                    type="button"
                    className={activePolicyId === policy.id ? 'active' : ''}
                    onClick={() => selectPolicy(policy.id)}
                    aria-pressed={activePolicyId === policy.id}
                  >
                    <strong>{policyLabel(policy)}</strong>
                    <small>{policy.id}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="explorer-stage outcome-stage">
              <header><span>04</span><strong>Interpretation</strong><small>see what survives the chain</small></header>
              {selectedNode.kind === 'controlled' ? (
                <div className="explorer-outcome">
                  <div className={`explorer-decision ${activeBlocked ? 'blocked' : 'admitted'}`}>
                    <span>{activeBlocked ? 'BLOCKED' : 'ADMITTED / LIMITED'}</span>
                    <strong>{activeBlocked ? '×' : formatQuantity(activeDecision?.capacity?.admitted_maximum)}</strong>
                  </div>
                  <dl>
                    <div><dt>Case</dt><dd>{selectedNode.id}</dd></div>
                    <div><dt>Assurance</dt><dd>{scenarioLabel(activeScenario)}</dd></div>
                    <div><dt>Rule</dt><dd>{humanize(activeRule)}</dd></div>
                  </dl>
                </div>
              ) : (
                <div className={`explorer-research-state ${selectedNode.kind}`}>
                  <span>{selectedNode.status}</span>
                  <strong>{selectedNode.kind === 'public' ? 'outside data' : selectedNode.kind === 'institutional' ? 'institutional reference' : 'open evidence gate'}</strong>
                  <p>{selectedNode.demonstrates}</p>
                </div>
              )}
            </div>

            <div className="explorer-frontier" aria-label="Research frontier">
              <span>RESEARCH FRONTIER</span>
              <div>
                {RESEARCH_FRONTIER.map(([label, status, tone]) => (
                  <div key={label} className={`frontier-step ${tone}`}><i aria-hidden="true" /><span><strong>{label}</strong><small>{status}</small></span></div>
                ))}
              </div>
            </div>
          </div>

          <ResearchDetail
            node={selectedNode}
            run={selectedRun}
            activePolicy={activePolicy}
            activeScenario={activeScenario}
            onOpenWorkbench={onOpenWorkbench}
            onNavigate={onNavigate}
          />
        </div>
      ) : null}

      {view === 'findings' ? (
        <div className="atlas-table-view">
          <header><span>RESEARCH PROPOSITIONS</span><h2>What the current programme supports, compares, or still leaves open.</h2></header>
          <table>
            <thead><tr><th>ID</th><th>Status</th><th>Finding / proposition</th><th>Supporting research</th></tr></thead>
            <tbody>{FINDINGS.map((item) => <tr key={item.id}><td><code>{item.id}</code></td><td><AtlasStatus tone={item.status === 'OPEN' ? 'open' : item.status === 'SUPPORTED' ? 'pass' : 'neutral'}>{item.status}</AtlasStatus></td><td>{item.title}</td><td>{item.support}</td></tr>)}</tbody>
          </table>
        </div>
      ) : null}

      {view === 'evidence' ? (
        <div className="atlas-table-view">
          <header><span>EVIDENCE LANDSCAPE</span><h2>What evidence exists, what it can support, and what remains outside its scope.</h2></header>
          <table>
            <thead><tr><th>Layer</th><th>Current state</th><th>Useful for</th><th>Boundary</th></tr></thead>
            <tbody>{EVIDENCE_LAYERS.map(([layer, state, useful, boundary]) => <tr key={layer}><td>{layer}</td><td><AtlasStatus tone={state === 'OPEN' ? 'open' : 'neutral'}>{state}</AtlasStatus></td><td>{useful}</td><td>{boundary}</td></tr>)}</tbody>
          </table>
        </div>
      ) : null}

      {view === 'timeline' ? (
        <div className="atlas-timeline">
          <header><span>RESEARCH DEVELOPMENT</span><h2>Selected evidence-bearing milestones, not a marketing roadmap.</h2></header>
          <ol>{TIMELINE.map(([date, title, note]) => <li key={date}><time>{date}</time><div><strong>{title}</strong><p>{note}</p></div></li>)}</ol>
        </div>
      ) : null}

      <footer className="atlas-footer">
        <div><ShieldCheck size={14} /><span>Research boundary</span><strong>Mechanism evidence ≠ operator validation ≠ legal authority ≠ monetary performance.</strong></div>
        <button type="button" onClick={onOpenWorkbench}>Open controlled workbench <ArrowRight size={14} /></button>
      </footer>
    </section>
  );
}
