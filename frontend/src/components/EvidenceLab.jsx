import React, { useCallback, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Download,
  FileUp,
  FlaskConical,
  Hash,
} from 'lucide-react';
import {
  MAX_FILE_BYTES,
  autoMapColumns,
  buildEvidenceReceipt,
  downloadJson,
  parseCsv,
  validateMeterRows,
} from '../lib/evidenceLab';
import { CONSTRAINTS } from '../lib/currencyLab';

const SAMPLE_URL = `${import.meta.env.BASE_URL}samples/public_lab_sample_meter.csv`;

export default function EvidenceLab({
  activeReceipt,
  onContinue,
  onReceiptReady,
  onReceiptInvalidated,
}) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [filename, setFilename] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [result, setResult] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [previewLimit] = useState(8);

  const dataConstraint = CONSTRAINTS.find((c) => c.id === 'data');

  const invalidate = useCallback(() => {
    setReceipt(null);
    onReceiptInvalidated?.();
  }, [onReceiptInvalidated]);

  const runValidation = useCallback(async (rows, map, name, source) => {
    setStatus('validating');
    setError(null);
    setReceipt(null);
    onReceiptInvalidated?.();

    const validation = validateMeterRows(rows, map);
    setResult(validation);
    if (!validation.ok) {
      setStatus('error');
      setError(validation.error || 'Validation failed');
      return;
    }

    const built = await buildEvidenceReceipt(validation.accepted, validation.totals, {
      filename: name,
      source,
      rejected: validation.rejected,
      gap_warnings: validation.gap_warnings,
    });
    setReceipt(built);
    setStatus('success');
    onReceiptReady?.(built, validation);
  }, [onReceiptReady, onReceiptInvalidated]);

  const ingestText = useCallback(async (text, name, source) => {
    try {
      invalidate();
      setStatus('loading');
      setError(null);
      setResult(null);
      const { headers: hdrs, rows } = parseCsv(text);
      const map = autoMapColumns(hdrs);
      setHeaders(hdrs);
      setRawRows(rows);
      setMapping(map);
      setFilename(name);
      await runValidation(rows, map, name, source);
    } catch (err) {
      invalidate();
      setStatus('error');
      setError(err.message || String(err));
      setResult(null);
      setReceipt(null);
    }
  }, [invalidate, runValidation]);

  const loadSample = async () => {
    invalidate();
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch(SAMPLE_URL);
      if (!res.ok) throw new Error(`Could not load sample CSV (${res.status})`);
      const text = await res.text();
      await ingestText(text, 'public_lab_sample_meter.csv', 'bundled_sample');
    } catch (err) {
      invalidate();
      setStatus('error');
      setError(err.message || String(err));
    }
  };

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    invalidate();
    if (file.size > MAX_FILE_BYTES) {
      setStatus('error');
      setError(`File too large (${file.size} bytes). Limit is ${MAX_FILE_BYTES} bytes.`);
      setResult(null);
      setReceipt(null);
      return;
    }
    const text = await file.text();
    await ingestText(text, file.name, 'local_upload');
  };

  const remap = async (canonical, header) => {
    invalidate();
    const next = { ...mapping, [canonical]: header || undefined };
    if (!header) delete next[canonical];
    setMapping(next);
    if (rawRows.length) await runValidation(rawRows, next, filename, 'remapped');
  };

  const previewRows = useMemo(() => rawRows.slice(0, previewLimit), [rawRows, previewLimit]);
  const fmt = (value) => (value == null ? '—' : String(value));
  const sessionReceipt = receipt || activeReceipt;

  return (
    <section className="workbench-panel evidence-lab" aria-labelledby="evidence-lab-heading">
      <header className="workbench-panel-header">
        <p className="eyebrow">Browser-local · unsigned · no upload server</p>
        <h1 id="evidence-lab-heading">
          <FlaskConical size={22} aria-hidden /> Evidence Lab
        </h1>
        <p className="workbench-lead">
          Validate a meter CSV in your browser and download a SHA-256 evidence receipt.
          Generation alone is not surplus. Nothing is minted on-chain from this step.
        </p>
        <p className="constraint-chip" title={dataConstraint?.tip}>
          Constraint: {dataConstraint?.label}
        </p>
      </header>

      <div className="workbench-actions">
        <button type="button" className="wallet-button" onClick={loadSample}>
          Load sample CSV
        </button>
        <label className="ghost-button file-button">
          <FileUp size={16} aria-hidden />
          Upload local CSV
          <input type="file" accept=".csv,text/csv" onChange={onFile} hidden />
        </label>
      </div>

      {activeReceipt && !receipt && status === 'idle' ? (
        <div className="workbench-session-note" role="status">
          A browser-session receipt is already active: <code>{activeReceipt.evidence_hash.slice(0, 12)}…</code>.
          Load new evidence to replace it, or continue with the existing receipt.
          <div className="workbench-card-actions">
            <button type="button" className="inline-link-button" onClick={onContinue}>
              Continue to Currency Lab <ArrowRight size={15} aria-hidden />
            </button>
          </div>
        </div>
      ) : null}

      <aside className="workbench-callout" role="note">
        <AlertTriangle size={16} aria-hidden />
        <div>
          <strong>Boundaries:</strong> validated locally · unsigned receipt ·{' '}
          <em>not</em> accepted for live minting · <em>not</em> physical truth / revenue-grade.
          Timestamps must include <code>Z</code> or a UTC offset. Files stay in your browser.
        </div>
      </aside>

      {status === 'loading' || status === 'validating' ? (
        <p className="muted spk-loading" role="status">
          {status === 'loading' ? 'Loading CSV…' : 'Validating rows…'}
        </p>
      ) : null}

      {error ? (
        <div className="spk-error-banner" role="alert">
          <AlertTriangle size={16} /> {error}
        </div>
      ) : null}

      {headers.length > 0 ? (
        <div className="workbench-card">
          <h2>Column mapping</h2>
          <p className="muted">
            Surplus basis requires <strong>export</strong> or <strong>generation + consumption</strong>.
            Generation-only data can be inspected but cannot create an issuance cap.
          </p>
          <div className="mapping-grid">
            {['timestamp', 'generation_kwh', 'consumption_kwh', 'export_kwh', 'meter_id', 'cumulative_kwh'].map((field) => (
              <label key={field} className="mapping-field">
                <span>{field}</span>
                <select
                  value={mapping[field] || ''}
                  onChange={(e) => remap(field, e.target.value)}
                >
                  <option value="">—</option>
                  {headers.map((header) => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {previewRows.length > 0 ? (
        <div className="workbench-card">
          <h2>Row preview</h2>
          <div className="table-scroll">
            <table className="workbench-table">
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, index) => (
                  <tr key={index}>
                    {headers.map((header) => (
                      <td key={header}>{row[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rawRows.length > previewLimit ? (
            <p className="muted">Showing {previewLimit} of {rawRows.length} rows.</p>
          ) : null}
        </div>
      ) : null}

      {result?.totals ? (
        <div className="workbench-card workbench-stats">
          <h2>
            <CheckCircle2 size={18} aria-hidden /> Validation summary
          </h2>
          <ul className="stat-grid">
            <li><span>Accepted rows</span><strong>{result.totals.accepted_rows}</strong></li>
            <li><span>Rejected rows</span><strong>{result.totals.rejected_rows}</strong></li>
            <li><span>Gap warnings</span><strong>{result.totals.gap_warning_count}</strong></li>
            <li><span>Generation</span><strong>{fmt(result.totals.generation_kwh)} kWh</strong></li>
            <li><span>Consumption</span><strong>{fmt(result.totals.consumption_kwh)} kWh</strong></li>
            <li><span>Export</span><strong>{fmt(result.totals.export_kwh)} kWh</strong></li>
            <li><span>Eligible surplus</span><strong>{result.totals.eligible_surplus_kwh} kWh</strong></li>
            <li>
              <span>Issuance eligible</span>
              <strong>{result.totals.issuance_eligible ? 'yes' : 'no'}</strong>
            </li>
          </ul>
          <p className="muted">
            {result.totals.illustrative_cap_label}:{' '}
            <strong>{result.totals.issuance_cap_spk} SPK</strong>
            {!result.totals.issuance_eligible ? (
              <> · reason: <code>{result.totals.issuance_reason}</code></>
            ) : null}
          </p>
          {result.gap_warnings?.length > 0 ? (
            <details>
              <summary>Interval gap warnings ({result.gap_warnings.length}) — heuristic</summary>
              <p className="muted">
                Heuristic only (median cadence per meter, ≥3 rows). Not comprehensive missing-data detection.
              </p>
              <ul className="reject-list">
                {result.gap_warnings.slice(0, 20).map((gap, index) => (
                  <li key={index}>
                    {gap.meter_id || 'default'}: {gap.start} → {gap.end}
                    {' '}(Δ {Math.round(gap.observed_delta_ms / 60000)} min; expected ~
                    {Math.round(gap.expected_cadence_ms / 60000)} min)
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
          {result.rejected.length > 0 ? (
            <details>
              <summary>Rejected row details ({result.rejected.length})</summary>
              <ul className="reject-list">
                {result.rejected.slice(0, 20).map((rejected) => (
                  <li key={rejected.row_index}>
                    Row {rejected.row_index}: {rejected.issues.join(', ')}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      ) : null}

      {receipt ? (
        <div className="workbench-card receipt-card">
          <h2>
            <Hash size={18} aria-hidden /> Evidence receipt
          </h2>
          <p className="mono-hash">{receipt.evidence_hash}</p>
          <p className="muted">{receipt.disclaimer}</p>
          <p className="muted">
            Status: local validation · unsigned ·{' '}
            <strong>not accepted for live minting</strong>
          </p>
          <div className="workbench-card-actions">
            <button
              type="button"
              className="wallet-button"
              onClick={() => downloadJson(`spk-evidence-receipt-${receipt.evidence_hash.slice(0, 8)}.json`, receipt)}
            >
              <Download size={16} /> Download JSON receipt
            </button>
            <button type="button" className="ghost-button" onClick={onContinue}>
              Continue to Currency Lab <ArrowRight size={15} aria-hidden />
            </button>
          </div>
        </div>
      ) : null}

      {!receipt && sessionReceipt && status !== 'idle' ? (
        <p className="muted" role="status">
          A replacement validation is in progress. The prior session receipt has been invalidated until validation succeeds.
        </p>
      ) : null}
    </section>
  );
}
