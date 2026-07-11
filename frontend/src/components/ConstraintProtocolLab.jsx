import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  CheckCircle2,
  Database,
  Download,
  FileJson,
  FileSpreadsheet,
  Gauge,
  GitCompareArrows,
  Layers3,
  Play,
  ShieldCheck,
  Waypoints,
  XCircle,
} from 'lucide-react';
import {
  BUILTIN_POLICIES,
  applySettlementResult,
  attestationInspectionAsEvidence,
  buildEvidenceEnvelope,
  classifyProvenance,
  comparePolicies,
  createClaimManifest,
  evaluateSettlement,
  inspectSignedEvidence,
  makeIssuedClaim,
  normalizeCumulativePair,
  normalizeFroniusPair,
  normalizeGenericCsv,
  normalizeGreenButtonCsv,
} from '@solarpunk/constraint-core';
import { downloadJson } from '../lib/evidenceLab';

const SAMPLE_ROOT = `${import.meta.env.BASE_URL}samples/protocol`;

const SOURCES = [
  {
    id: 'cumulative',
    title: 'Meter / inverter counters',
    subtitle: 'Start + end cumulative JSON snapshots',
    icon: Gauge,
    files: 2,
    accept: '.json,application/json',
    sample: ['cumulative-start.json', 'cumulative-end.json'],
  },
  {
    id: 'utility',
    title: 'Utility / Green Button',
    subtitle: 'Interval usage and flow-direction CSV',
    icon: FileSpreadsheet,
    files: 1,
    accept: '.csv,text/csv',
    sample: ['green-button-sample.csv'],
  },
  {
    id: 'fronius',
    title: 'Fronius PowerFlow',
    subtitle: 'Two local API JSON responses',
    icon: Waypoints,
    files: 2,
    accept: '.json,application/json',
    sample: ['fronius-start.json', 'fronius-end.json'],
  },
  {
    id: 'signed',
    title: 'Signed meter evidence',
    subtitle: 'Raw readings + meter registry',
    icon: ShieldCheck,
    files: 2,
    accept: '.json,application/json',
    sample: ['signed-readings.json', 'meter-registry.json'],
  },
  {
    id: 'generic',
    title: 'Generic interval CSV',
    subtitle: 'Auto-map common generation / load / export fields',
    icon: FileSpreadsheet,
    files: 1,
    accept: '.csv,text/csv',
    sample: ['generic-meter-sample.csv'],
  },
];

function statusIcon(status) {
  if (status === 'PASS') return <CheckCircle2 size={15} aria-hidden />;
  if (status === 'WARNING') return <AlertTriangle size={15} aria-hidden />;
  return <XCircle size={15} aria-hidden />;
}

function fmt(value, digits = 3) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: digits });
}

async function fetchText(name) {
  const response = await fetch(`${SAMPLE_ROOT}/${name}`);
  if (!response.ok) throw new Error(`Could not load ${name} (${response.status})`);
  return response.text();
}

async function fetchJson(name) {
  return JSON.parse(await fetchText(name));
}

async function normalizeSource(sourceId, payloads, { sample = false } = {}) {
  let normalized;
  let evidence;
  let inspection = null;

  if (sourceId === 'cumulative') {
    normalized = normalizeCumulativePair(payloads[0], payloads[1]);
  } else if (sourceId === 'utility') {
    normalized = normalizeGreenButtonCsv(payloads[0]);
  } else if (sourceId === 'fronius') {
    normalized = normalizeFroniusPair(payloads[0], payloads[1]);
  } else if (sourceId === 'signed') {
    inspection = await inspectSignedEvidence(payloads[0], payloads[1]);
    evidence = attestationInspectionAsEvidence(inspection);
  } else if (sourceId === 'generic') {
    normalized = normalizeGenericCsv(payloads[0]);
  } else {
    throw new Error(`Unsupported source ${sourceId}`);
  }

  if (!evidence) evidence = await buildEvidenceEnvelope(normalized, { source_label: sourceId });

  const provenance = classifyProvenance(evidence, sourceId === 'signed' && !sample
    ? { operator_signed: true }
    : { sample_fixture: sample });
  const decisions = comparePolicies({ evidence, provenance });
  return { normalized, evidence, provenance, decisions, inspection, sample };
}

export default function ConstraintProtocolLab({ onOpenSepolia }) {
  const [sourceId, setSourceId] = useState('cumulative');
  const [files, setFiles] = useState([]);
  const [run, setRun] = useState(null);
  const [selectedPolicyId, setSelectedPolicyId] = useState('LAB-OPEN-001');
  const [claim, setClaim] = useState(null);
  const [settlement, setSettlement] = useState(null);
  const [issueAmount, setIssueAmount] = useState('20');
  const [capacity, setCapacity] = useState('8');
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const source = SOURCES.find((item) => item.id === sourceId);
  const selectedDecision = run?.decisions?.find((item) => item.policy_id === selectedPolicyId) || null;
  const diagnostics = useMemo(() => {
    if (!run) return [];
    if (run.inspection) {
      return run.inspection.row_checks.flatMap((row) => row.checks.map((item) => ({
        ...item,
        row_index: row.index,
        meter_id: row.meter_id,
      })));
    }
    return run.normalized?.diagnostics || [];
  }, [run]);

  const clearResult = () => {
    setRun(null);
    setClaim(null);
    setSettlement(null);
    setStatus(null);
  };

  const chooseSource = (next) => {
    setSourceId(next);
    setFiles([]);
    clearResult();
  };

  const acceptRun = (result) => {
    setRun(result);
    const firstAdmitted = result.decisions.find((item) => item.admitted);
    setSelectedPolicyId(firstAdmitted?.policy_id || result.decisions[0]?.policy_id || 'LAB-OPEN-001');
    setClaim(null);
    setSettlement(null);
    setIssueAmount('20');
    setCapacity('8');
    setStatus({ tone: 'ok', text: `Evidence normalized. ${result.evidence.summary.interval_count} interval(s), ${fmt(result.evidence.summary.total_eligible_surplus_kwh)} kWh eligible surplus, provenance ${result.provenance.level}.` });
  };

  const loadSample = async () => {
    setBusy(true);
    clearResult();
    try {
      const payloads = [];
      for (const name of source.sample) {
        payloads.push(name.endsWith('.json') ? await fetchJson(name) : await fetchText(name));
      }
      acceptRun(await normalizeSource(sourceId, payloads, { sample: true }));
    } catch (error) {
      setStatus({ tone: 'err', text: error.message || String(error) });
    } finally {
      setBusy(false);
    }
  };

  const processLocal = async () => {
    if (files.length !== source.files) {
      setStatus({ tone: 'err', text: `This adapter requires ${source.files} local file${source.files === 1 ? '' : 's'}.` });
      return;
    }
    setBusy(true);
    clearResult();
    try {
      const payloads = [];
      for (const file of files) {
        const text = await file.text();
        payloads.push(file.name.toLowerCase().endsWith('.json') ? JSON.parse(text) : text);
      }
      acceptRun(await normalizeSource(sourceId, payloads, { sample: false }));
    } catch (error) {
      setStatus({ tone: 'err', text: error.message || String(error) });
    } finally {
      setBusy(false);
    }
  };

  const buildClaim = async () => {
    if (!run || !selectedDecision) return;
    try {
      const next = await createClaimManifest({
        evidence: run.evidence,
        provenance: run.provenance,
        policyDecision: selectedDecision,
        subject: 'browser-local-protocol-subject',
      });
      setClaim(next);
      setSettlement(null);
      setIssueAmount(String(Math.min(20, Number(next.quantity || 0)) || ''));
      setStatus({
        tone: next.state === 'BLOCKED' ? 'warning' : 'ok',
        text: next.state === 'BLOCKED'
          ? `Policy ${next.policy_id} blocked the claim: ${next.blockers.join('; ')}`
          : `Claim admitted under ${next.policy_id}. Maximum ${fmt(next.quantity)} ${next.unit}.`,
      });
    } catch (error) {
      setStatus({ tone: 'err', text: error.message || String(error) });
    }
  };

  const runSettlement = () => {
    if (!claim || claim.state !== 'ADMITTED') {
      setStatus({ tone: 'err', text: 'Build an admitted claim before running settlement.' });
      return;
    }
    try {
      const active = makeIssuedClaim(claim, Number(issueAmount));
      const result = evaluateSettlement({ claim: active, settlement_capacity: Number(capacity) });
      const finalClaim = applySettlementResult(active, result);
      setClaim(finalClaim);
      setSettlement(result);
      setStatus({
        tone: result.shortfall_quantity > 0 ? 'warning' : 'ok',
        text: result.shortfall_quantity > 0
          ? `Settlement constraint failed: ${fmt(result.shortfall_quantity)} ${claim.unit} remains uncovered.`
          : `Settlement covered the full ${fmt(result.covered_quantity)} ${claim.unit} obligation.`,
      });
    } catch (error) {
      setStatus({ tone: 'err', text: error.message || String(error) });
    }
  };

  const artifact = run ? {
    schema: 'solarpunk.constraint.browser_alpha_run.v1',
    source_id: sourceId,
    evidence: run.evidence,
    provenance: run.provenance,
    policy_decisions: run.decisions,
    selected_policy_id: selectedPolicyId,
    claim,
    settlement,
    boundary: 'Browser-local protocol run. No private keys, no live mint authority, no legal redemption claim.',
  } : null;

  return (
    <section className="protocol-alpha" aria-labelledby="protocol-alpha-heading">
      <header className="protocol-alpha-hero">
        <p className="eyebrow">SolarPunk Constraint Protocol · Public Alpha</p>
        <h1 id="protocol-alpha-heading">Turn evidence into an explicit claim decision.</h1>
        <p>
          The protocol primitive is not SPK. It is the relationship between <strong>evidence</strong>, a
          versioned <strong>policy</strong>, a bounded <strong>claim</strong>, and an explicit
          <strong> settlement result</strong>. SPK remains one reference application.
        </p>
        <div className="protocol-alpha-boundary">
          Browser-local evaluation only · no private keys · no automatic mint authority · no legal redemption rights implied
        </div>
      </header>

      <div className="protocol-flow" aria-label="Constraint Protocol flow">
        {['Source evidence', 'Normalize', 'Diagnose', 'Provenance', 'Policy', 'Claim', 'Settlement'].map((label, index) => (
          <React.Fragment key={label}>
            <div className="protocol-flow-step">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{label}</strong>
            </div>
            {index < 6 ? <ArrowDown size={15} aria-hidden className="protocol-flow-arrow" /> : null}
          </React.Fragment>
        ))}
      </div>

      <section className="protocol-stage" aria-labelledby="source-stage-heading">
        <div className="protocol-stage-heading">
          <div>
            <p className="protocol-stage-index">01 · DATA CONSTRAINT</p>
            <h2 id="source-stage-heading">What evidence do you have?</h2>
          </div>
          <Database size={22} aria-hidden />
        </div>
        <div className="protocol-source-grid">
          {SOURCES.map(({ id, title, subtitle, icon: Icon }) => (
            <button
              type="button"
              key={id}
              className={sourceId === id ? 'protocol-source-card active' : 'protocol-source-card'}
              onClick={() => chooseSource(id)}
            >
              <Icon size={19} aria-hidden />
              <strong>{title}</strong>
              <span>{subtitle}</span>
            </button>
          ))}
        </div>

        <div className="protocol-intake-card">
          <div>
            <p className="protocol-intake-title">{source.title}</p>
            <p>{source.subtitle}</p>
            <p className="protocol-muted">
              {source.files === 2 ? 'File order matters: select the start/raw file first, then the end/registry file.' : 'Files are processed locally in this browser.'}
            </p>
          </div>
          <div className="protocol-intake-actions">
            <button type="button" className="wallet-button" onClick={loadSample} disabled={busy}>
              <Play size={15} aria-hidden /> {busy ? 'Running…' : 'Run bundled example'}
            </button>
            <label className="ghost-button file-button">
              <FileJson size={15} aria-hidden /> Select {source.files === 1 ? 'file' : `${source.files} files`}
              <input
                type="file"
                multiple={source.files > 1}
                accept={source.accept}
                hidden
                onChange={(event) => setFiles([...event.target.files].slice(0, source.files))}
              />
            </label>
            <button type="button" className="ghost-button" onClick={processLocal} disabled={busy || files.length !== source.files}>
              Process local evidence
            </button>
          </div>
          {files.length ? <p className="protocol-file-list">Selected: {files.map((file) => file.name).join(' → ')}</p> : null}
        </div>
      </section>

      {status ? (
        <div className={status.tone === 'err' ? 'spk-error-banner' : status.tone === 'warning' ? 'workbench-warning' : 'workbench-ok'} role={status.tone === 'err' ? 'alert' : 'status'}>
          {status.text}
        </div>
      ) : null}

      {run ? (
        <>
          <section className="protocol-stage" aria-labelledby="evidence-inspector-heading">
            <div className="protocol-stage-heading">
              <div>
                <p className="protocol-stage-index">02 · NORMALIZATION + DIAGNOSTICS</p>
                <h2 id="evidence-inspector-heading">Evidence Inspector</h2>
              </div>
              <Layers3 size={22} aria-hidden />
            </div>

            <div className="protocol-evidence-summary">
              <div><span>Adapter</span><strong>{run.evidence.adapter.id}</strong></div>
              <div><span>Evidence hash</span><code>{run.evidence.evidence_hash.slice(0, 16)}…</code></div>
              <div><span>Intervals accepted</span><strong>{run.evidence.summary.interval_count}</strong></div>
              <div><span>Eligible surplus</span><strong>{fmt(run.evidence.summary.total_eligible_surplus_kwh)} kWh</strong></div>
              <div><span>Blocking diagnostics</span><strong>{run.evidence.summary.blocker_count}</strong></div>
              <div><span>Warnings</span><strong>{run.evidence.summary.warning_count}</strong></div>
            </div>

            <div className="protocol-transform-grid">
              <div className="protocol-transform-card">
                <p className="protocol-card-kicker">Normalized intervals</p>
                <div className="protocol-table-scroll">
                  <table className="protocol-table">
                    <thead><tr><th>Window</th><th>Generation</th><th>Load</th><th>Export</th><th>Surplus</th><th>Basis</th></tr></thead>
                    <tbody>
                      {run.evidence.intervals.slice(0, 12).map((row, index) => (
                        <tr key={`${row.window_start}-${index}`}>
                          <td>{row.window_start.slice(0, 10)}</td>
                          <td>{fmt(row.generation_kwh)}</td>
                          <td>{fmt(row.site_load_kwh)}</td>
                          <td>{fmt(row.export_kwh)}</td>
                          <td>{fmt(row.eligible_surplus_kwh)}</td>
                          <td><code>{row.surplus_basis}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="protocol-transform-card">
                <p className="protocol-card-kicker">Constraint checks</p>
                <ul className="protocol-check-list">
                  {diagnostics.length ? diagnostics.slice(0, 24).map((item, index) => (
                    <li key={`${item.code}-${index}`} className={`protocol-check ${String(item.status).toLowerCase()}`}>
                      {statusIcon(item.status)}
                      <div><strong>{item.code}</strong><span>{item.detail}</span></div>
                    </li>
                  )) : (
                    <li className="protocol-check pass"><CheckCircle2 size={15} /><div><strong>normalization</strong><span>No adapter warnings or blockers.</span></div></li>
                  )}
                </ul>
              </div>
            </div>
          </section>

          <section className="protocol-stage" aria-labelledby="provenance-heading">
            <div className="protocol-stage-heading">
              <div>
                <p className="protocol-stage-index">03 · PROVENANCE</p>
                <h2 id="provenance-heading">Evidence assurance, not a fake trust score</h2>
              </div>
              <ShieldCheck size={22} aria-hidden />
            </div>
            <div className="provenance-ladder" aria-label="L0 to L4 provenance ladder">
              {['L0', 'L1', 'L2', 'L3', 'L4'].map((level) => (
                <div key={level} className={run.provenance.level === level ? 'provenance-level active' : 'provenance-level'}>
                  <strong>{level}</strong>
                  <span>{level === 'L0' ? 'sample' : level === 'L1' ? 'signed export' : level === 'L2' ? 'live gateway' : level === 'L3' ? 'revenue-grade' : 'corroborated'}</span>
                  {run.provenance.level === level ? <em>YOU ARE HERE</em> : null}
                </div>
              ))}
            </div>
            <div className="protocol-provenance-decision">
              <div><span>Classification</span><strong>{run.provenance.level} · {run.provenance.label}</strong></div>
              <div><span>Stage</span><strong>{run.provenance.stage}</strong></div>
              <p>{run.provenance.reasons.join(' ')}</p>
              <p><strong>Missing for next level:</strong> {run.provenance.missing_for_next_level.join(' · ')}</p>
              <p className="protocol-muted">{run.provenance.explicit_boundary}</p>
            </div>
          </section>

          <section className="protocol-stage" aria-labelledby="policy-heading">
            <div className="protocol-stage-heading">
              <div>
                <p className="protocol-stage-index">04 · POLICY + ISSUANCE CONSTRAINT</p>
                <h2 id="policy-heading">Same evidence. Different rules. Different claim.</h2>
              </div>
              <GitCompareArrows size={22} aria-hidden />
            </div>
            <div className="protocol-policy-grid">
              {run.decisions.map((decision) => (
                <button
                  type="button"
                  key={decision.policy_id}
                  className={selectedPolicyId === decision.policy_id ? 'protocol-policy-card active' : 'protocol-policy-card'}
                  onClick={() => { setSelectedPolicyId(decision.policy_id); setClaim(null); setSettlement(null); }}
                >
                  <div className="protocol-policy-card-top">
                    <code>{decision.policy_id}</code>
                    <span className={decision.admitted ? 'protocol-decision admit' : 'protocol-decision block'}>{decision.decision}</span>
                  </div>
                  <strong>{decision.policy_name}</strong>
                  <span>Min provenance {BUILTIN_POLICIES.find((item) => item.id === decision.policy_id)?.min_provenance_level}</span>
                  <span>Haircut {decision.haircut_pct}%</span>
                  <span>Maximum {fmt(decision.maximum_claim_quantity)} {decision.issuance_unit}</span>
                  {decision.blockers.length ? <small>{decision.blockers.join(' · ')}</small> : null}
                </button>
              ))}
            </div>
            <button type="button" className="wallet-button protocol-build-claim" onClick={buildClaim} disabled={!selectedDecision}>
              Build claim under {selectedPolicyId}
            </button>
          </section>

          {claim ? (
            <section className="protocol-stage" aria-labelledby="claim-heading">
              <div className="protocol-stage-heading">
                <div>
                  <p className="protocol-stage-index">05 · CLAIM + SETTLEMENT</p>
                  <h2 id="claim-heading">Bounded Claim Laboratory</h2>
                </div>
                <Waypoints size={22} aria-hidden />
              </div>
              <div className="protocol-claim-card">
                <div><span>Claim ID</span><code>{claim.claim_id.slice(0, 20)}…</code></div>
                <div><span>Evidence</span><code>{claim.evidence_hash.slice(0, 20)}…</code></div>
                <div><span>Policy</span><strong>{claim.policy_id} v{claim.policy_version}</strong></div>
                <div><span>State</span><strong>{claim.state}</strong></div>
                <div><span>Admitted maximum</span><strong>{fmt(claim.quantity)} {claim.unit}</strong></div>
                <div><span>Provenance</span><strong>{claim.provenance_level}</strong></div>
              </div>

              {claim.state === 'ADMITTED' ? (
                <div className="protocol-settlement-controls">
                  <label>Issue quantity<input type="number" min="0" step="0.1" value={issueAmount} onChange={(event) => setIssueAmount(event.target.value)} /></label>
                  <label>Declared settlement capacity<input type="number" min="0" step="0.1" value={capacity} onChange={(event) => setCapacity(event.target.value)} /></label>
                  <button type="button" className="wallet-button" onClick={runSettlement}>Evaluate settlement</button>
                </div>
              ) : null}

              {settlement ? (
                <div className="protocol-settlement-result">
                  <div><span>Outstanding claim</span><strong>{fmt(settlement.outstanding_claim_quantity)}</strong></div>
                  <div><span>Settlement capacity</span><strong>{fmt(settlement.settlement_capacity)}</strong></div>
                  <div><span>Covered</span><strong>{fmt(settlement.covered_quantity)}</strong></div>
                  <div className={settlement.shortfall_quantity > 0 ? 'shortfall' : ''}><span>Shortfall</span><strong>{fmt(settlement.shortfall_quantity)}</strong></div>
                  <div className="protocol-constraint-matrix">
                    {Object.entries(settlement.constraint_status).map(([constraint, value]) => (
                      <span key={constraint} className={String(value).toLowerCase()}>{constraint.toUpperCase()} · {value}</span>
                    ))}
                  </div>
                  <p>{settlement.boundary}</p>
                </div>
              ) : null}

              <div className="protocol-stage-actions">
                <button type="button" className="ghost-button" onClick={() => downloadJson(`constraint-protocol-${run.evidence.evidence_hash.slice(0, 8)}.json`, artifact)}>
                  <Download size={15} aria-hidden /> Download protocol run JSON
                </button>
                <button type="button" className="ghost-button" onClick={onOpenSepolia}>
                  Inspect SPK reference proof →
                </button>
              </div>
            </section>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
