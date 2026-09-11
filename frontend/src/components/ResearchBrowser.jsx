import React, { useMemo, useState } from 'react';
import { ArrowRight, GitBranch } from 'lucide-react';
import { useCaseWorkbench } from '../app/CaseWorkbenchProvider';
import { PUBLIC_EVIDENCE_CHECKPOINT } from '../data/publicEvidenceCheckpoint';
import { formatQuantity, humanize, shortHash } from './platform/PlatformSurface';
import '../styles/researchBrowser.css';

const NORWAY_REFERENCE = Object.freeze({
  id: 'NORWAY-INSTITUTIONAL',
  title: 'Norway institutional evidence',
  kind: 'institutional',
  status: 'REFERENCE',
  subtitle: 'Elhub · Guarantees of Origin · flexibility / reserve admission',
  role: 'Comparative institutional evidence',
  observation: 'Evidence quality, actor authority, quantity mapping, registry identity, anti-reuse, settlement and correction remain distinct institutional layers.',
  boundary: 'Comparative institutional evidence only. It does not validate Policy Lab at Norwegian national scale or establish an energy-backed monetary system.',
});

const AUSGRID_REFERENCE = Object.freeze({
  id: PUBLIC_EVIDENCE_CHECKPOINT.case_id,
  title: 'Ausgrid public checkpoint',
  kind: 'public',
  status: 'REPRODUCED',
  subtitle: 'Solar Home Electricity Data',
  role: 'Outside-data operability checkpoint',
  boundary: 'No source-holder confirmation, physical meter certification, legal issuance authority, or monetary-performance claim.',
});

const OPEN_GAPS = Object.freeze([
  {
    id: 'OWNER-OPERATOR-SOURCE',
    title: 'Owner / operator evidence',
    kind: 'gap',
    status: 'OPEN',
    question: 'Can the same machinery survive attributable source-holder evidence and higher-assurance provenance?',
    needed: 'Named source holder · custody declaration · attributable measurement archive · higher-assurance provenance',
    boundary: 'No operator relationship, source-holder validation, or L2+ external case is currently implied.',
  },
  {
    id: 'INDEPENDENT-REPRODUCTION',
    title: 'Independent clean-room reproduction',
    kind: 'gap',
    status: 'OPEN',
    question: 'Can an outsider reproduce the frozen result without project-specific intervention?',
    needed: 'Frozen release · clean environment · one-command replay · intervention log · exact-result comparison',
    boundary: 'Internal CI and AI review do not close this gate.',
  },
  {
    id: 'MONETARY-PERFORMANCE',
    title: 'Monetary performance / R4',
    kind: 'gap',
    status: 'UNTESTED',
    question: 'Does the mechanism perform as a monetary or financial system under dedicated empirical evaluation?',
    needed: 'Dedicated monetary-evidence validator · performance design · external data · falsifiable evaluation criteria',
    boundary: 'R4 remains untested and is not inferred from mechanism correctness.',
  },
]);

const FINDINGS = Object.freeze([
  {
    id: 'F-01',
    status: 'SUPPORTED',
    title: 'Policy can change financial authority without changing the evidence identity.',
    question: 'What changes when the same evidence is evaluated under a different declared policy?',
    support: ['TYN-001', 'AUS-001', 'PHX-001'],
    interpretation: 'The policy layer is an independent source of authority. Evidence identity alone does not determine the financial outcome.',
    boundary: 'Supported as a controlled mechanism result. This does not establish legal authority or market adoption.',
  },
  {
    id: 'F-02',
    status: 'SUPPORTED',
    title: 'Admitted quantity can bind for different reasons.',
    question: 'Which constraint actually determines the maximum defensible quantity?',
    support: ['PHX-001', 'TYN-001', 'AUS-001'],
    interpretation: 'Evidence capacity, provenance-policy capacity, and modeled resource context can each become the binding ceiling.',
    boundary: 'Binding attribution is a deterministic policy result, not proof of physical production or ownership.',
  },
  {
    id: 'F-03',
    status: 'SUPPORTED',
    title: 'Admission and settlement are separate research questions.',
    question: 'Can a claim be validly admitted and still fail downstream settlement?',
    support: [AUSGRID_REFERENCE.id],
    interpretation: 'A bounded claim may be defensible at admission while remaining partially or completely uncovered at settlement.',
    boundary: 'Settlement stress is a declared scenario, not a production reserve or custody certification.',
  },
  {
    id: 'F-04',
    status: 'COMPARATIVE',
    title: 'Mature electricity institutions separate evidence, authority, quantity, identity, settlement, and correction.',
    question: 'Do real institutional systems collapse these functions into one proof object?',
    support: [NORWAY_REFERENCE.id],
    interpretation: 'The institutional comparison supports separation of functions rather than a single all-purpose evidence score.',
    boundary: 'Reference evidence only. It does not validate Policy Lab at national scale.',
  },
  {
    id: 'F-05',
    status: 'OPEN',
    title: 'Owner/operator validation is the next material external-evidence gate.',
    question: 'What remains missing before public/synthetic evidence can be promoted to an attributable external case?',
    support: ['OWNER-OPERATOR-SOURCE'],
    interpretation: 'The current research frontier is source attribution and higher-assurance external evidence, not more internal mechanism complexity.',
    boundary: 'This is an open research proposition, not a completed validation result.',
  },
]);

const EVIDENCE_LAYERS = Object.freeze([
  ['Controlled fixtures', 'EXECUTABLE', 'Mechanism isolation across cases, policies and assurance counterfactuals.', 'Not operator evidence.'],
  ['Operator-format synthetic intake', 'EXECUTABLE', 'Intake, normalization, fail-closed provenance behavior.', 'Not a named operator archive.'],
  ['Ausgrid public checkpoint', 'L0 · REPRODUCED', 'Outside-data operability and bounded decision reproduction.', 'Not source-holder or physical-meter certification.'],
  ['Norway institutional evidence', 'REFERENCE', 'Real institutional separation of evidence, authority, quantity and settlement.', 'Comparative evidence, not system validation.'],
  ['Owner/operator evidence', 'OPEN', 'Would test source-holder attribution and higher-assurance external validation.', 'Not yet closed.'],
]);

const TIMELINE = Object.freeze([
  ['2026-08-04', 'Norway institutional dossier', 'Comparative evidence connects Policy Lab boundaries to mature electricity-market institutions.'],
  ['2026-08-15', 'Ausgrid public-data checkpoint', 'Outside data reproduces the open-policy limit, pilot-policy block and partial settlement stress.'],
  ['2026-09-11', 'Specialized Gauntlet', 'Non-promotion, sensitivity, release provenance and external validation gates become explicit.'],
  ['2026-09-12', 'Research Browser', 'The public surface becomes a linked research corpus rather than a dashboard or geographic showcase.'],
]);

const FRONTIER = Object.freeze([
  ['Mechanism cases', 'EXECUTABLE'],
  ['Outside data', 'REPRODUCED'],
  ['Institutional comparison', 'REFERENCE'],
  ['Owner / operator source', 'OPEN'],
  ['Independent reproduction', 'OPEN'],
  ['Monetary performance', 'UNTESTED'],
]);

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

function decisionSummary(run) {
  const decision = run?.decision;
  if (!decision) return { result: '—', rule: '—', quantity: '—' };
  const blocked = decision.decision === 'BLOCKED';
  return {
    result: blocked ? 'BLOCKED' : decision.decision.replaceAll('_', ' '),
    rule: humanize(blocked ? decision.admission?.blocking_rules?.[0] : decision.capacity?.binding_constraints?.[0]),
    quantity: blocked ? '—' : formatQuantity(decision.capacity?.admitted_maximum),
  };
}

function IndexRow({ active, eyebrow, title, meta, onClick, ariaLabel }) {
  return (
    <button type="button" className={`rb-index-row ${active ? 'active' : ''}`} onClick={onClick} aria-label={ariaLabel || `${title}. ${meta || ''}`}>
      <span>{eyebrow}</span>
      <strong>{title}</strong>
      <small>{meta}</small>
    </button>
  );
}

function ParameterRail({ pack, activePolicyId, activeScenarioId, selectPolicy, selectScenario }) {
  return (
    <div className="rb-parameters" aria-label="Research parameters">
      <div className="rb-parameter-line">
        <span>ASSURANCE</span>
        <div>
          {pack.scenarios.map((scenario) => (
            <button
              key={scenario.scenario_id}
              type="button"
              className={activeScenarioId === scenario.scenario_id ? 'active' : ''}
              onClick={() => selectScenario(scenario.scenario_id)}
              aria-pressed={activeScenarioId === scenario.scenario_id}
              aria-label={scenario.name || scenario.scenario_id}
            >
              {scenarioLabel(scenario)} <small>{scenario.name || humanize(scenario.scenario_id)}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="rb-parameter-line">
        <span>POLICY</span>
        <div>
          {pack.policies.map((policy) => (
            <button
              key={policy.id}
              type="button"
              className={activePolicyId === policy.id ? 'active' : ''}
              onClick={() => selectPolicy(policy.id)}
              aria-pressed={activePolicyId === policy.id}
              aria-label={`${policyLabel(policy)} ${policy.id}`}
            >
              {policyLabel(policy)} <small>{policy.id}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SupportLedger({ ids, objectsById, visibleRunsByCaseId, onSelect }) {
  return (
    <table className="rb-table" aria-label="Supporting research ledger">
      <thead><tr><th>Object</th><th>Class</th><th>Current state</th><th>Binding / role</th></tr></thead>
      <tbody>
        {ids.map((id) => {
          const object = objectsById.get(id);
          if (!object) return null;
          if (object.kind === 'controlled') {
            const summary = decisionSummary(visibleRunsByCaseId[id]);
            return (
              <tr key={id} onClick={() => onSelect(object)} className="clickable">
                <td><strong>{id}</strong><small>{object.title}</small></td>
                <td>controlled case</td>
                <td>{summary.result}{summary.quantity !== '—' ? ` · ${summary.quantity}` : ''}</td>
                <td>{summary.rule}</td>
              </tr>
            );
          }
          if (object.id === AUSGRID_REFERENCE.id) {
            return (
              <tr key={id} onClick={() => onSelect(object)} className="clickable">
                <td><strong>{id}</strong><small>{object.title}</small></td>
                <td>outside data</td>
                <td>L0 · reproduced</td>
                <td>open admits / pilot blocks</td>
              </tr>
            );
          }
          return (
            <tr key={id} onClick={() => onSelect(object)} className="clickable">
              <td><strong>{id}</strong><small>{object.title}</small></td>
              <td>{object.kind === 'institutional' ? 'institutional reference' : 'open research gate'}</td>
              <td>{object.status}</td>
              <td>{object.kind === 'institutional' ? 'comparative process evidence' : 'unresolved external evidence'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function FindingView({ finding, objectsById, visibleRunsByCaseId, onSelect }) {
  return (
    <div className="rb-document">
      <header className="rb-document-head">
        <span>{finding.id} · {finding.status}</span>
        <h2>{finding.title}</h2>
        <p>{finding.question}</p>
      </header>
      <section className="rb-section">
        <div className="rb-section-title"><span>SUPPORT</span><strong>Which research objects carry this proposition?</strong></div>
        <SupportLedger ids={finding.support} objectsById={objectsById} visibleRunsByCaseId={visibleRunsByCaseId} onSelect={onSelect} />
      </section>
      <section className="rb-reading-row">
        <span>INTERPRETATION</span><p>{finding.interpretation}</p>
      </section>
      <section className="rb-reading-row boundary">
        <span>BOUNDARY</span><p>{finding.boundary}</p>
      </section>
    </div>
  );
}

function ControlledCaseView({ object, run, activePolicy, activeScenario }) {
  const summary = decisionSummary(run);
  const evidence = run?.evidence;
  return (
    <div className="rb-document">
      <header className="rb-document-head">
        <span>CONTROLLED CASE · {object.id}</span>
        <h2>{object.title}</h2>
        <p>Inspect how the same declared case responds to changes in assurance and policy.</p>
      </header>
      <div className="rb-result-line">
        <span>CURRENT INTERPRETATION</span>
        <strong>{summary.result}</strong>
        <em>{summary.quantity !== '—' ? `${summary.quantity} maximum` : 'quantity not evaluated'}</em>
      </div>
      <table className="rb-table rb-fact-table">
        <tbody>
          <tr><th>Evidence identity</th><td><code>{shortHash(evidence?.evidence_hash, 14, 10)}</code></td></tr>
          <tr><th>Eligible quantity</th><td>{formatQuantity(evidence?.summary?.total_eligible_surplus_kwh)}</td></tr>
          <tr><th>Assurance</th><td>{scenarioLabel(activeScenario)}</td></tr>
          <tr><th>Policy</th><td>{activePolicy?.id}</td></tr>
          <tr><th>Binding / blocking rule</th><td>{summary.rule}</td></tr>
          <tr><th>Decision identity</th><td><code>{shortHash(run?.decision?.decision_id, 14, 10)}</code></td></tr>
        </tbody>
      </table>
      <section className="rb-reading-row boundary"><span>BOUNDARY</span><p>Controlled mechanism evidence. Executable behavior does not establish realized operator evidence, custody, legal authority, or market performance.</p></section>
    </div>
  );
}

function AusgridView() {
  const checkpoint = PUBLIC_EVIDENCE_CHECKPOINT;
  return (
    <div className="rb-document">
      <header className="rb-document-head">
        <span>OUTSIDE DATA · REPRODUCED</span>
        <h2>{AUSGRID_REFERENCE.id}</h2>
        <p>Outside-data checkpoint using {AUSGRID_REFERENCE.subtitle}.</p>
      </header>
      <section className="rb-section">
        <div className="rb-section-title"><span>DECISION TRACE</span><strong>One evidence object, multiple policy consequences.</strong></div>
        <table className="rb-table">
          <thead><tr><th>Evidence</th><th>Policy</th><th>Outcome</th><th>Quantity / reason</th></tr></thead>
          <tbody>
            <tr><td>L0 · {checkpoint.source.interval_count} intervals</td><td>Open</td><td>{checkpoint.decisions.open.result.replaceAll('_', ' ')}</td><td>{checkpoint.evidence.total_eligible_surplus_kwh} kWh</td></tr>
            <tr><td>same evidence</td><td>Pilot</td><td>{checkpoint.decisions.pilot.result}</td><td>signed evidence + minimum provenance</td></tr>
            <tr><td>admitted claim</td><td>Settlement stress</td><td>{checkpoint.settlement.result}</td><td>{Math.round(checkpoint.settlement.declared_capacity_fraction * 100)}% declared capacity</td></tr>
          </tbody>
        </table>
      </section>
      <section className="rb-reading-row"><span>RESEARCH ROLE</span><p>Demonstrates outside-data operability and deterministic bounded decision reproduction without promoting the source into operator-certified truth.</p></section>
      <section className="rb-reading-row boundary"><span>BOUNDARY</span><p>{AUSGRID_REFERENCE.boundary}</p></section>
    </div>
  );
}

function InstitutionalView() {
  return (
    <div className="rb-document">
      <header className="rb-document-head">
        <span>INSTITUTIONAL REFERENCE</span>
        <h2>{NORWAY_REFERENCE.title}</h2>
        <p>{NORWAY_REFERENCE.subtitle}</p>
      </header>
      <table className="rb-table">
        <thead><tr><th>Institutional layer</th><th>Research observation</th></tr></thead>
        <tbody>
          <tr><td>Evidence</td><td>Measurement and source quality remain distinct from downstream authority.</td></tr>
          <tr><td>Authority</td><td>Actor permissions and institutional roles are not inferred from raw evidence alone.</td></tr>
          <tr><td>Quantity</td><td>Eligibility and capacity rules constrain what can be acted upon.</td></tr>
          <tr><td>Identity / registry</td><td>Claims and instruments need durable identity, anti-reuse and correction paths.</td></tr>
          <tr><td>Settlement</td><td>Final delivery/settlement remains a separate institutional stage.</td></tr>
        </tbody>
      </table>
      <section className="rb-reading-row boundary"><span>BOUNDARY</span><p>{NORWAY_REFERENCE.boundary}</p></section>
    </div>
  );
}

function GapView({ object }) {
  return (
    <div className="rb-document">
      <header className="rb-document-head">
        <span>OPEN RESEARCH GATE · {object.status}</span>
        <h2>{object.title}</h2>
        <p>{object.question}</p>
      </header>
      <section className="rb-section">
        <div className="rb-section-title"><span>TO CLOSE THIS GATE</span><strong>Required evidence or validation</strong></div>
        <div className="rb-requirements">{object.needed.split(' · ').map((item) => <div key={item}><span>○</span><strong>{item}</strong></div>)}</div>
      </section>
      <section className="rb-reading-row boundary"><span>BOUNDARY</span><p>{object.boundary}</p></section>
    </div>
  );
}

function Inspector({ selection, selectedObject, selectedFinding, selectedRun, activePolicy, activeScenario, onOpenWorkbench, onNavigate }) {
  const summary = decisionSummary(selectedRun);
  return (
    <aside className="rb-inspector" aria-label="Selected research object">
      <header><span>INSPECTOR</span><strong>{selectedFinding?.id || selectedObject?.id}</strong></header>
      <dl>
        <div><dt>Class</dt><dd>{selection.kind}</dd></div>
        <div><dt>Status</dt><dd>{selectedFinding?.status || selectedObject?.status || summary.result}</dd></div>
        {selectedObject?.kind === 'controlled' ? <>
          <div><dt>Assurance</dt><dd>{scenarioLabel(activeScenario)}</dd></div>
          <div><dt>Policy</dt><dd>{policyLabel(activePolicy)}</dd></div>
          <div><dt>Decision</dt><dd>{summary.result}</dd></div>
          <div><dt>Rule</dt><dd>{summary.rule}</dd></div>
        </> : null}
      </dl>
      <div className="rb-inspector-section">
        <span>RESEARCH BOUNDARY</span>
        <p>{selectedFinding?.boundary || selectedObject?.boundary || 'Mechanism evidence does not itself establish operator validation, legal authority, or monetary performance.'}</p>
      </div>
      <div className="rb-inspector-actions">
        {selectedObject?.kind === 'controlled' ? <button type="button" onClick={onOpenWorkbench}>Open in workbench <ArrowRight size={13} /></button> : null}
        {selectedObject?.kind === 'controlled' ? <button type="button" onClick={() => onNavigate?.({ section: 'case', id: selectedObject.id, lens: 'constraints' })}>Inspect case</button> : null}
        {selectedFinding ? <button type="button" onClick={() => onNavigate?.({ section: 'analysis', tool: 'compare' })}>Compare policies</button> : null}
        {selectedObject && selectedObject.kind !== 'controlled' ? <button type="button" onClick={() => onNavigate?.({ section: 'research' })}>Open research layer</button> : null}
      </div>
    </aside>
  );
}

export default function ResearchBrowser({ onOpenWorkbench, onNavigate }) {
  const [view, setView] = useState('browser');
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState({ kind: 'object', id: AUSGRID_REFERENCE.id });
  const {
    pack,
    visibleRunsByCaseId = {},
    activePolicyId,
    activeScenarioId,
    selectCase,
    selectPolicy,
    selectScenario,
  } = useCaseWorkbench();

  const controlledObjects = useMemo(() => pack.cases.map((item) => ({
    id: item.case_id,
    title: item.subject,
    kind: 'controlled',
    status: 'EXECUTABLE',
    boundary: item.boundaries?.[0] || 'Controlled mechanism evidence.',
  })), [pack.cases]);

  const researchObjects = useMemo(() => [
    ...controlledObjects,
    AUSGRID_REFERENCE,
    NORWAY_REFERENCE,
    ...OPEN_GAPS,
  ], [controlledObjects]);

  const objectsById = useMemo(() => new Map(researchObjects.map((item) => [item.id, item])), [researchObjects]);
  const selectedFinding = selection.kind === 'finding' ? FINDINGS.find((item) => item.id === selection.id) : null;
  const selectedObject = selection.kind === 'object' ? objectsById.get(selection.id) : null;
  const selectedRun = selectedObject?.kind === 'controlled' ? visibleRunsByCaseId[selectedObject.id] : null;
  const activePolicy = pack.policies.find((item) => item.id === activePolicyId) || pack.policies[0];
  const activeScenario = pack.scenarios.find((item) => item.scenario_id === activeScenarioId) || pack.scenarios[0];

  const chooseObject = (object) => {
    setSelection({ kind: 'object', id: object.id });
    setView('browser');
    if (object.kind === 'controlled') selectCase(object.id);
  };

  const chooseFinding = (finding) => {
    setSelection({ kind: 'finding', id: finding.id });
    setView('browser');
  };

  const needle = query.trim().toLowerCase();
  const visibleFindings = FINDINGS.filter((item) => !needle || `${item.id} ${item.title} ${item.question}`.toLowerCase().includes(needle));
  const visibleObjects = researchObjects.filter((item) => !needle || `${item.id} ${item.title} ${item.kind} ${item.status}`.toLowerCase().includes(needle));

  const showParameters = selectedObject?.kind === 'controlled' || ['F-01', 'F-02'].includes(selectedFinding?.id);

  return (
    <section className="research-browser" aria-labelledby="research-atlas-title">
      <header className="rb-topline">
        <div>
          <span>POLICY LAB / RESEARCH BROWSER</span>
          <h1 id="research-atlas-title">Explore how evidence becomes — or fails to become — financial authority.</h1>
        </div>
        <div className="rb-top-actions">
          <button type="button" onClick={() => onNavigate?.({ section: 'analysis', tool: 'compare' })}>Compare</button>
          <button type="button" onClick={onOpenWorkbench}><GitBranch size={13} /> Workbench</button>
        </div>
      </header>

      <nav className="rb-view-tabs" aria-label="Research atlas views">
        {['browser', 'findings', 'evidence', 'timeline'].map((id) => (
          <button key={id} type="button" className={view === id ? 'active' : ''} onClick={() => setView(id)} aria-current={view === id ? 'page' : undefined}>
            {id === 'browser' ? 'Browser' : id[0].toUpperCase() + id.slice(1)}
          </button>
        ))}
        <span>linked research corpus · deterministic workbench beneath</span>
      </nav>

      <div className="rb-shell" role="region" aria-label="Research landscape explorer">
        <aside className="rb-index" aria-label="Research corpus index">
          <div className="rb-search"><label htmlFor="rb-search">SEARCH</label><input id="rb-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="finding, case, evidence…" /></div>
          <section>
            <header>FINDINGS <span>{visibleFindings.length}</span></header>
            {visibleFindings.map((finding) => <IndexRow key={finding.id} active={selection.kind === 'finding' && selection.id === finding.id} eyebrow={finding.id} title={finding.title} meta={finding.status} onClick={() => chooseFinding(finding)} />)}
          </section>
          <section>
            <header>EVIDENCE / CASES <span>{visibleObjects.filter((item) => item.kind !== 'gap').length}</span></header>
            {visibleObjects.filter((item) => item.kind !== 'gap').map((object) => <IndexRow key={object.id} active={selection.kind === 'object' && selection.id === object.id} eyebrow={object.kind === 'controlled' ? 'CASE' : object.kind.toUpperCase()} title={object.title} meta={`${object.id} · ${object.status}`} ariaLabel={`${object.title}. ${object.kind} research object.`} onClick={() => chooseObject(object)} />)}
          </section>
          <section>
            <header>OPEN QUESTIONS <span>{visibleObjects.filter((item) => item.kind === 'gap').length}</span></header>
            {visibleObjects.filter((item) => item.kind === 'gap').map((object) => <IndexRow key={object.id} active={selection.kind === 'object' && selection.id === object.id} eyebrow={object.status} title={object.title} meta={object.id} onClick={() => chooseObject(object)} />)}
          </section>
        </aside>

        <main className="rb-canvas">
          {view === 'browser' ? <>
            {showParameters ? <ParameterRail pack={pack} activePolicyId={activePolicyId} activeScenarioId={activeScenarioId} selectPolicy={selectPolicy} selectScenario={selectScenario} /> : null}
            {selectedFinding ? <FindingView finding={selectedFinding} objectsById={objectsById} visibleRunsByCaseId={visibleRunsByCaseId} onSelect={chooseObject} /> : null}
            {selectedObject?.kind === 'controlled' ? <ControlledCaseView object={selectedObject} run={selectedRun} activePolicy={activePolicy} activeScenario={activeScenario} /> : null}
            {selectedObject?.id === AUSGRID_REFERENCE.id ? <AusgridView /> : null}
            {selectedObject?.id === NORWAY_REFERENCE.id ? <InstitutionalView /> : null}
            {selectedObject?.kind === 'gap' ? <GapView object={selectedObject} /> : null}
          </> : null}

          {view === 'findings' ? <div className="rb-projection"><header><span>FINDINGS</span><h2>Supported, comparative and open propositions.</h2></header><table className="rb-table"><thead><tr><th>ID</th><th>Status</th><th>Proposition</th><th>Support</th></tr></thead><tbody>{FINDINGS.map((item) => <tr key={item.id} className="clickable" onClick={() => chooseFinding(item)}><td>{item.id}</td><td>{item.status}</td><td>{item.title}</td><td>{item.support.join(' · ')}</td></tr>)}</tbody></table></div> : null}

          {view === 'evidence' ? <div className="rb-projection"><header><span>EVIDENCE REGISTER</span><h2>What exists, what it can support, and where it stops.</h2></header><table className="rb-table"><thead><tr><th>Layer</th><th>State</th><th>Useful for</th><th>Boundary</th></tr></thead><tbody>{EVIDENCE_LAYERS.map(([layer, state, use, boundary]) => <tr key={layer}><td>{layer}</td><td>{state}</td><td>{use}</td><td>{boundary}</td></tr>)}</tbody></table></div> : null}

          {view === 'timeline' ? <div className="rb-projection"><header><span>RESEARCH DEVELOPMENT</span><h2>Evidence-bearing milestones, not a marketing roadmap.</h2></header><table className="rb-table"><thead><tr><th>Date</th><th>Milestone</th><th>Research consequence</th></tr></thead><tbody>{TIMELINE.map(([date, title, note]) => <tr key={date}><td>{date}</td><td>{title}</td><td>{note}</td></tr>)}</tbody></table></div> : null}
        </main>

        <Inspector selection={selection} selectedObject={selectedObject} selectedFinding={selectedFinding} selectedRun={selectedRun} activePolicy={activePolicy} activeScenario={activeScenario} onOpenWorkbench={onOpenWorkbench} onNavigate={onNavigate} />

        <footer className="rb-frontier" aria-label="Research frontier">
          <span>RESEARCH FRONTIER</span>
          {FRONTIER.map(([label, status]) => <div key={label}><strong>{label}</strong><small>{status}</small></div>)}
        </footer>
      </div>
    </section>
  );
}
