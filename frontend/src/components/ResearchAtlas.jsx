import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Database,
  FileText,
  GitBranch,
  History,
  Landmark,
  MapPinned,
  ShieldCheck,
} from 'lucide-react';
import { useCaseWorkbench } from '../app/CaseWorkbenchProvider';
import { PUBLIC_EVIDENCE_CHECKPOINT } from '../data/publicEvidenceCheckpoint';
import { formatQuantity, humanize, shortHash } from './platform/PlatformSurface';
import '../styles/researchAtlas.css';

const MAP_BASE_URL = 'https://upload.wikimedia.org/wikipedia/commons/9/9f/BlankMap-World-Equirectangular.svg';

const NORWAY_REFERENCE = Object.freeze({
  id: 'NORWAY-INSTITUTIONAL',
  title: 'Norway institutional evidence',
  subtitle: 'Elhub · Guarantees of Origin · flexibility / reserve admission',
  kind: 'institutional',
  assurance: 'comparative institutional evidence',
  status: 'REFERENCE',
  display_anchor: { latitude: 62, longitude: 10 },
  anchor_note: 'Country-level display anchor; not a measured site.',
  demonstrates: 'Evidence quality, actor authority, quantity mapping, registry identity, anti-reuse, settlement and correction are distinct institutional layers.',
  boundary: 'Comparative institutional evidence only. It does not validate Policy Lab at Norwegian national scale or establish an energy-backed monetary system.',
});

const AUSGRID_REFERENCE = Object.freeze({
  id: PUBLIC_EVIDENCE_CHECKPOINT.case_id,
  title: 'Australia public-data checkpoint',
  subtitle: 'Ausgrid · Solar Home Electricity Data',
  kind: 'public',
  assurance: PUBLIC_EVIDENCE_CHECKPOINT.evidence.assurance,
  status: 'REPRODUCED',
  display_anchor: { latitude: -25, longitude: 134 },
  anchor_note: 'Country-level display anchor; not a household or meter location.',
  demonstrates: 'A real outside dataset can pass the evidence-normalization and deterministic decision path without being promoted into operator-certified truth.',
  boundary: 'Public-data operability checkpoint. No source-holder confirmation, physical meter certification, legal issuance authority, or monetary-performance claim.',
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

function atlasPosition(latitude, longitude) {
  return {
    left: `${((Number(longitude) + 180) / 360) * 100}%`,
    top: `${((90 - Number(latitude)) / 180) * 100}%`,
  };
}

function AtlasStatus({ children, tone = 'neutral' }) {
  return <span className={`atlas-status ${tone}`}>{children}</span>;
}

function AtlasDetail({ node, run, onOpenWorkbench, onNavigate }) {
  if (!node) return null;

  if (node.kind === 'controlled') {
    const decision = run?.decision;
    const blocked = decision?.decision === 'BLOCKED';
    const mainRule = blocked
      ? decision?.admission?.blocking_rules?.[0]
      : decision?.capacity?.binding_constraints?.[0];
    return (
      <aside className="atlas-detail" aria-label="Selected research object">
        <header>
          <span>CONTROLLED CASE</span>
          <h2>{node.id}</h2>
          <p>{node.title}</p>
        </header>
        <dl>
          <div><dt>Research role</dt><dd>Controlled mechanism case</dd></div>
          <div><dt>Spatial identity</dt><dd>{node.latitude.toFixed(2)}, {node.longitude.toFixed(2)} · WGS84</dd></div>
          <div><dt>Active decision</dt><dd>{decision?.decision?.replaceAll('_', ' ') || 'evaluating'}</dd></div>
          <div><dt>Binding / blocking</dt><dd>{humanize(mainRule)}</dd></div>
          <div><dt>Evidence</dt><dd><code>{shortHash(run?.evidence?.evidence_hash, 9, 6)}</code></dd></div>
        </dl>
        <p className="atlas-boundary">Controlled scenario demonstration. The spatial identity locates the modeled case; it does not convert the bundled fixture into realized site evidence.</p>
        <div className="atlas-detail-actions">
          <button type="button" onClick={onOpenWorkbench}>Open in workbench <ArrowRight size={14} /></button>
          <button type="button" onClick={() => onNavigate?.({ section: 'case', id: node.id, lens: 'constraints' })}>Inspect case</button>
        </div>
      </aside>
    );
  }

  if (node.id === AUSGRID_REFERENCE.id) {
    return (
      <aside className="atlas-detail" aria-label="Selected research object">
        <header>
          <span>OUTSIDE-DATA CHECKPOINT</span>
          <h2>{node.id}</h2>
          <p>{node.subtitle}</p>
        </header>
        <dl>
          <div><dt>Evidence state</dt><dd>{PUBLIC_EVIDENCE_CHECKPOINT.evidence.assurance}</dd></div>
          <div><dt>Intervals</dt><dd>{PUBLIC_EVIDENCE_CHECKPOINT.source.interval_count}</dd></div>
          <div><dt>Derived eligible surplus</dt><dd>{PUBLIC_EVIDENCE_CHECKPOINT.evidence.total_eligible_surplus_kwh} kWh</dd></div>
          <div><dt>Open policy</dt><dd>{PUBLIC_EVIDENCE_CHECKPOINT.decisions.open.result.replaceAll('_', ' ')}</dd></div>
          <div><dt>Pilot policy</dt><dd>{PUBLIC_EVIDENCE_CHECKPOINT.decisions.pilot.result}</dd></div>
          <div><dt>Settlement stress</dt><dd>{Math.round(PUBLIC_EVIDENCE_CHECKPOINT.settlement.declared_capacity_fraction * 100)}% · {PUBLIC_EVIDENCE_CHECKPOINT.settlement.result}</dd></div>
        </dl>
        <p className="atlas-anchor-note">{node.anchor_note}</p>
        <p className="atlas-boundary">{node.boundary}</p>
        <div className="atlas-detail-actions">
          <button type="button" onClick={() => onNavigate?.({ section: 'research' })}>Open research layer <ArrowRight size={14} /></button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="atlas-detail" aria-label="Selected research object">
      <header>
        <span>INSTITUTIONAL EVIDENCE</span>
        <h2>Norway</h2>
        <p>{node.subtitle}</p>
      </header>
      <dl>
        <div><dt>Status</dt><dd>{node.status}</dd></div>
        <div><dt>Research role</dt><dd>{node.assurance}</dd></div>
        <div><dt>Core observation</dt><dd>Institutional layers remain distinct before downstream financial or market action.</dd></div>
      </dl>
      <p className="atlas-anchor-note">{node.anchor_note}</p>
      <p className="atlas-boundary">{node.boundary}</p>
      <div className="atlas-detail-actions">
        <button type="button" onClick={() => onNavigate?.({ section: 'research' })}>Open research layer <ArrowRight size={14} /></button>
      </div>
    </aside>
  );
}

export default function ResearchAtlas({ onOpenWorkbench, onNavigate }) {
  const [view, setView] = useState('map');
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(AUSGRID_REFERENCE.id);
  const {
    pack,
    visibleRunsByCaseId = {},
    selectCase,
  } = useCaseWorkbench();

  const controlledNodes = useMemo(() => pack.cases
    .filter((item) => item.spatial_identity)
    .map((item) => ({
      id: item.case_id,
      title: item.subject,
      kind: 'controlled',
      status: 'EXECUTABLE',
      assurance: 'scenario-dependent',
      latitude: item.spatial_identity.latitude,
      longitude: item.spatial_identity.longitude,
    })), [pack.cases]);

  const mapNodes = useMemo(() => [
    ...controlledNodes,
    {
      ...AUSGRID_REFERENCE,
      latitude: AUSGRID_REFERENCE.display_anchor.latitude,
      longitude: AUSGRID_REFERENCE.display_anchor.longitude,
    },
    {
      ...NORWAY_REFERENCE,
      latitude: NORWAY_REFERENCE.display_anchor.latitude,
      longitude: NORWAY_REFERENCE.display_anchor.longitude,
    },
  ], [controlledNodes]);

  const visibleNodes = mapNodes.filter((node) => filter === 'all' || node.kind === filter);
  const selectedNode = mapNodes.find((node) => node.id === selectedId) || mapNodes[0];
  const selectedRun = selectedNode?.kind === 'controlled' ? visibleRunsByCaseId[selectedNode.id] : null;
  const nonSpatialCase = pack.cases.find((item) => !item.spatial_identity);

  const chooseNode = (node) => {
    setSelectedId(node.id);
    if (node.kind === 'controlled') selectCase(node.id);
  };

  return (
    <section className="research-atlas" aria-labelledby="research-atlas-title">
      <header className="atlas-head">
        <div>
          <span>POLICY LAB / RESEARCH ATLAS</span>
          <h1 id="research-atlas-title">Explore the evidence, cases, findings, and unresolved boundaries.</h1>
        </div>
        <div className="atlas-head-summary">
          <strong>{pack.cases.length + 2}</strong><span>indexed research objects</span>
          <strong>{FINDINGS.length}</strong><span>current findings / open propositions</span>
        </div>
      </header>

      <nav className="atlas-view-tabs" aria-label="Research atlas views">
        {[
          ['map', 'Map', MapPinned],
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

      {view === 'map' ? (
        <div className="atlas-map-layout">
          <div className="atlas-map-column">
            <div className="atlas-filter-row" role="group" aria-label="Research layer filter">
              {[
                ['all', 'All'],
                ['controlled', 'Controlled'],
                ['public', 'Public evidence'],
                ['institutional', 'Institutional'],
              ].map(([id, label]) => <button key={id} type="button" className={filter === id ? 'active' : ''} onClick={() => setFilter(id)}>{label}</button>)}
            </div>
            <div className="atlas-map" role="img" aria-label="World research atlas with controlled cases, public evidence, and institutional references" style={{ '--atlas-map-base': `url("${MAP_BASE_URL}")` }}>
              <div className="atlas-graticule" />
              {visibleNodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  className={`atlas-point ${node.kind} ${selectedId === node.id ? 'selected' : ''}`}
                  style={atlasPosition(node.latitude, node.longitude)}
                  onClick={() => chooseNode(node)}
                  aria-label={`${node.title}. ${node.kind} research object.`}
                >
                  <span />
                  <small>{node.id === AUSGRID_REFERENCE.id ? 'AUSGRID' : node.id === NORWAY_REFERENCE.id ? 'NORWAY' : node.id}</small>
                </button>
              ))}
            </div>
            <div className="atlas-map-foot">
              <span>Spatial case points use committed WGS84 case identities. Public/institutional markers use labeled country-level display anchors.</span>
              <span>Map base: Wikimedia Commons equirectangular blank map · CC0/public domain.</span>
            </div>
            {nonSpatialCase ? (
              <button type="button" className="atlas-nonspatial" onClick={() => { setSelectedId(nonSpatialCase.case_id); selectCase(nonSpatialCase.case_id); onOpenWorkbench?.(); }}>
                <FileText size={14} /><span><strong>{nonSpatialCase.case_id}</strong><small>Non-spatial operator-format synthetic intake · open in workbench</small></span><ArrowRight size={14} />
              </button>
            ) : null}
          </div>
          <AtlasDetail node={selectedNode} run={selectedRun} onOpenWorkbench={onOpenWorkbench} onNavigate={onNavigate} />
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
          <header><span>EVIDENCE LANDSCAPE</span><h2>What kind of evidence exists, what it can support, and what remains outside its scope.</h2></header>
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
        <button type="button" onClick={onOpenWorkbench}>Interrogate the controlled cases <ArrowRight size={14} /></button>
      </footer>
    </section>
  );
}
