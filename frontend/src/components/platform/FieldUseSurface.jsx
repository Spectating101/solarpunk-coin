import React, { useEffect, useMemo, useState } from 'react';
import {
  Database,
  FileCheck2,
  FileInput,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { useCaseWorkbench } from '../../app/CaseWorkbenchProvider';
import {
  EmptyState,
  LinkButton,
  PlatformPageIntro,
  StatusBadge,
  formatQuantity,
  humanize,
  shortHash,
} from './PlatformSurface';

const OPS_CASE_ID = 'OPS-001';
const OPEN_POLICY_ID = 'LAB-CASE-OPEN-004';
const PILOT_POLICY_ID = 'ENERGY-CASE-PILOT-005';
const SCENARIO_OPTIONS = [
  ['PROVENANCE-L0-BASE', 'Operator-shaped sample'],
  ['PROVENANCE-L2-COUNTERFACTUAL', 'Declared signed-source scenario'],
  ['PROVENANCE-L4-COUNTERFACTUAL', 'Declared corroborated scenario'],
];

const PIPELINE = [
  ['Source identified', 'PASS'],
  ['Custody declaration', 'SAMPLE'],
  ['Permission scope', 'PUBLIC METADATA'],
  ['Normalize rows', 'PASS'],
  ['Run diagnostics', 'WARNING'],
  ['Hash evidence', 'PASS'],
  ['Classify assurance', 'L0'],
  ['Evaluate policies', 'LIVE'],
  ['Build receipt', 'PASS'],
  ['Build capsule', 'PASS'],
];

export default function FieldUseSurface({ viewMode, onNavigate, onOpenFullAnalysis }) {
  const { pack, compare } = useCaseWorkbench();
  const [scenarioId, setScenarioId] = useState('PROVENANCE-L0-BASE');
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const caseManifest = pack.casesById[OPS_CASE_ID];
  const evidence = pack.evidenceByHash[caseManifest.evidence_refs[0]];

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    compare({
      caseIds: [OPS_CASE_ID],
      policyIds: [PILOT_POLICY_ID, OPEN_POLICY_ID],
      scenarioId,
    }).then((matrix) => {
      if (!active) return;
      setRuns(matrix[0]?.runs || []);
      setLoading(false);
    }).catch((evaluationError) => {
      if (!active) return;
      setRuns([]);
      setError(evaluationError?.message || String(evaluationError));
      setLoading(false);
    });
    return () => { active = false; };
  }, [compare, scenarioId]);

  const runByPolicy = useMemo(() => Object.fromEntries(runs.map((run) => [run.policy.id, run])), [runs]);
  const pilotRun = runByPolicy[PILOT_POLICY_ID] || null;
  const openRun = runByPolicy[OPEN_POLICY_ID] || null;
  const pilotDecision = pilotRun?.decision || null;
  const openDecision = openRun?.decision || null;

  if (viewMode === 'full') {
    return (
      <main className="platform-page field-surface full" aria-labelledby="full-field-title">
        <PlatformPageIntro
          kicker="Field use · complete source and custody chain"
          title="Audit the source before any policy is allowed to trust it."
          description="Full Field Use exposes the source receipt, permission manifest, adapter, diagnostics, assurance boundary, policy decisions, privacy boundary, and remaining promotion requirements for OPS-001."
          viewMode="full"
        >
          <LinkButton onClick={() => onNavigate({ section: 'verify', tool: 'capsule' })}>Verify active capsule</LinkButton>
        </PlatformPageIntro>

        <section className="platform-three-column field-full-grid">
          <article className="platform-panel">
            <header><span>Source and custody</span><h2>What entered the lab?</h2></header>
            <dl className="platform-fact-list">
              <div><dt>Case</dt><dd>{caseManifest.case_id}</dd></div>
              <div><dt>Source kind</dt><dd>{humanize(evidence.source.kind)}</dd></div>
              <div><dt>Custody</dt><dd>{humanize(evidence.source.custody)}</dd></div>
              <div><dt>Permission</dt><dd>public metadata only</dd></div>
              <div><dt>Measurement window</dt><dd>May 1–7, 2026</dd></div>
              <div><dt>Evidence hash</dt><dd><code>{shortHash(evidence.evidence_hash, 14, 10)}</code></dd></div>
              <div><dt>Raw publication</dt><dd>excluded by default</dd></div>
            </dl>
          </article>

          <article className="platform-panel field-transformation-trace">
            <header><span>Transformation trace</span><h2>Follow the file into a decision.</h2></header>
            {[
              ['Source file', 'filename · SHA-256 · byte length'],
              ['Source manifest', 'custody · permission · semantics'],
              ['Intake receipt', 'immutable source identity'],
              ['Generic interval adapter', `${evidence.summary.interval_count} normalized intervals`],
              ['Evidence diagnostics', `${evidence.summary.warning_count} warning · ${evidence.summary.blocker_count} blocker`],
              ['EvidenceEnvelope', shortHash(evidence.evidence_hash)],
              ['Policy decisions', 'pilot + open'],
              ['Receipt and capsule', 'privacy-safe portable artifacts'],
            ].map(([label, detail], index) => (
              <div key={label}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{label}</strong>
                <small>{detail}</small>
              </div>
            ))}
          </article>

          <article className="platform-panel">
            <header><span>Current output</span><h2>What do the policies decide?</h2></header>
            {loading ? <EmptyState>Evaluating OPS-001 across declared policies…</EmptyState> : null}
            {error ? <div className="workbench-error" role="alert">{error}</div> : null}
            {!loading ? (
              <div className="field-decision-stack">
                <div>
                  <span>Pilot policy</span>
                  <strong>{pilotDecision?.decision?.replaceAll('_', ' ') || '—'}</strong>
                  <small>{humanize(pilotDecision?.admission?.blocking_rules?.[0])}</small>
                </div>
                <div>
                  <span>Open policy</span>
                  <strong>{openDecision?.decision?.replaceAll('_', ' ') || '—'}</strong>
                  <small>{openDecision?.decision === 'BLOCKED'
                    ? humanize(openDecision?.admission?.blocking_rules?.[0])
                    : `${formatQuantity(openDecision?.capacity?.admitted_maximum)} admitted`}</small>
                </div>
              </div>
            ) : null}
            <div className="platform-action-stack">
              <LinkButton primary onClick={() => onNavigate({
                section: 'case',
                id: OPS_CASE_ID,
                policyId: PILOT_POLICY_ID,
                scenarioId,
                lens: 'evidence',
              })}>Open complete OPS investigation</LinkButton>
              <LinkButton onClick={() => onNavigate({ section: 'analysis', tool: 'compare' })}>Compare all source policies</LinkButton>
            </div>
          </article>
        </section>

        <section className="platform-two-column">
          <article className="platform-panel">
            <header><span>Permission model</span><h2>Publication is separate from provenance.</h2></header>
            <div className="field-permission-grid">
              <div><LockKeyhole size={17} /><strong>Private validation</strong><span>No public receipt, aggregates, or raw data</span></div>
              <div><FileCheck2 size={17} /><strong>Public metadata</strong><span>Receipt identity allowed; raw rows excluded</span></div>
              <div><Database size={17} /><strong>Anonymized aggregates</strong><span>Aggregates allowed; raw rows excluded</span></div>
              <div><FileInput size={17} /><strong>Public raw</strong><span>Only when explicitly granted by the manifest</span></div>
            </div>
          </article>
          <article className="platform-panel">
            <header><span>Assurance promotion</span><h2>What remains externally unresolved?</h2></header>
            <div className="research-evidence-matrix">
              <div><span>Named source custody</span><StatusBadge tone="warn">OPEN</StatusBadge></div>
              <div><span>Signature / key custody</span><StatusBadge tone="warn">OPEN</StatusBadge></div>
              <div><span>Registry or API identity</span><StatusBadge tone="warn">OPEN</StatusBadge></div>
              <div><span>External corroboration</span><StatusBadge tone="warn">OPEN</StatusBadge></div>
              <div><span>Automatic assurance promotion</span><StatusBadge tone="fail">DISABLED</StatusBadge></div>
            </div>
          </article>
        </section>

        <section className="platform-mission-strip field-gates">
          <div><ShieldCheck size={17} /><strong>Real-source gate</strong></div>
          <span>1B owner-supplied export</span><span>→</span>
          <span>1C authenticated custody</span><span>→</span>
          <span>1D signed live gateway L2</span>
        </section>
      </main>
    );
  }

  return (
    <main className="platform-page field-surface" aria-labelledby="field-title">
      <PlatformPageIntro
        kicker="Field use · executable intake walkthrough"
        title="Process an operator-format source without pretending the format proves the source."
        description="Run the synthetic OPS-001 fixture through normalization, diagnostics, evidence hashing, assurance classification, policy evaluation, receipt generation, and capsule packaging."
        viewMode="overview"
      >
        <LinkButton primary onClick={onOpenFullAnalysis}>Open full field analysis</LinkButton>
      </PlatformPageIntro>

      <section className="platform-three-column field-overview-grid">
        <article className="platform-panel">
          <header><span>Input</span><h2>Sample source</h2></header>
          <div className="field-source-summary">
            <FileInput size={28} />
            <strong>Operator-format CSV</strong>
            <span>{evidence.summary.interval_count} interval rows</span>
            <span>{formatQuantity(evidence.summary.total_eligible_surplus_kwh)} eligible kWh</span>
            <code>{shortHash(evidence.evidence_hash)}</code>
          </div>
          <label>
            Source condition
            <select value={scenarioId} onChange={(event) => setScenarioId(event.target.value)}>
              {SCENARIO_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <p className="platform-control-note">Scenario changes are explicit analytical declarations. They do not rewrite the fixture or certify source truth.</p>
        </article>

        <article className="platform-panel">
          <header><span>Action</span><h2>Run the intake pipeline</h2></header>
          <div className="field-pipeline-list">
            {PIPELINE.map(([label, status], index) => (
              <div key={label}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{label}</strong>
                <StatusBadge tone={status === 'WARNING' || status === 'SAMPLE' ? 'warn' : 'pass'}>{status}</StatusBadge>
              </div>
            ))}
          </div>
        </article>

        <article className="platform-panel">
          <header><span>Consequence</span><h2>Policy output</h2></header>
          {loading ? <EmptyState>Running the declared source condition…</EmptyState> : null}
          {!loading ? (
            <div className="field-decision-stack">
              <div>
                <ScanSearch size={19} />
                <span>Pilot policy</span>
                <strong>{pilotDecision?.decision?.replaceAll('_', ' ') || '—'}</strong>
                <small>{pilotDecision?.decision === 'BLOCKED'
                  ? humanize(pilotDecision?.admission?.blocking_rules?.join(', '))
                  : `${formatQuantity(pilotDecision?.capacity?.admitted_maximum)} admitted`}</small>
              </div>
              <div>
                <Workflow size={19} />
                <span>Open policy</span>
                <strong>{openDecision?.decision?.replaceAll('_', ' ') || '—'}</strong>
                <small>{openDecision?.decision === 'BLOCKED'
                  ? humanize(openDecision?.admission?.blocking_rules?.join(', '))
                  : `${formatQuantity(openDecision?.capacity?.admitted_maximum)} admitted`}</small>
              </div>
            </div>
          ) : null}
          <div className="platform-inline-proof">
            <ShieldCheck size={18} />
            <span>Raw interval rows remain outside the public receipt and capsule.</span>
          </div>
          <LinkButton onClick={() => onNavigate({ section: 'verify', tool: 'capsule' })}>Inspect privacy-safe artifacts</LinkButton>
        </article>
      </section>
    </main>
  );
}
