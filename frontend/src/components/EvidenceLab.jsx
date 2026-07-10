import React, { useCallback, useMemo, useState } from 'react';
import { AlertTriangle, Download, FileUp, FlaskConical, Hash, CheckCircle2 } from 'lucide-react';
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

export default function EvidenceLab({ onReceiptReady }) {
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

  const runValidation = useCallback(async (rows, map, name, source) => {
    setStatus('validating');
    setError(null);
    setReceipt(null);
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
    });
    setReceipt(built);
    setStatus('success');
    onReceiptReady?.(built, validation);
  }, [onReceiptReady]);

  const ingestText = useCallback(async (text, name, source) => {
    try {
      setStatus('loading');
      setError(null);
      setResult(null);
      setReceipt(null);
      const { headers: hdrs, rows } = parseCsv(text);
      const map = autoMapColumns(hdrs);
      setHeaders(hdrs);
      setRawRows(rows);
      setMapping(map);
      setFilename(name);
      await runValidation(rows, map, name, source);
    } catch (err) {
      setStatus('error');
      setError(err.message || String(err));
    }
  }, [runValidation]);

  const loadSample = async () => {
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch(SAMPLE_URL);
      if (!res.ok) throw new Error(`Could not load sample CSV (${res.status})`);
      const text = await res.text();
      await ingestText(text, 'public_lab_sample_meter.csv', 'bundled_sample');
    } catch (err) {
      setStatus('error');
      setError(err.message || String(err));
    }
  };

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setStatus('error');
      setError(`File too large (${file.size} bytes). Limit is ${MAX_FILE_BYTES} bytes.`);
      return;
    }
    const text = await file.text();
    await ingestText(text, file.name, 'local_upload');
  };

  const remap = async (canonical, header) => {
    const next = { ...mapping, [canonical]: header || undefined };
    if (!header) delete next[canonical];
    setMapping(next);
    if (rawRows.length) await runValidation(rawRows, next, filename, 'remapped');
  };

  const previewRows = useMemo(() => rawRows.slice(0, previewLimit), [rawRows, previewLimit]);

  return (
    <section className="workbench-panel evidence-lab" aria-labelledby="evidence-lab-heading">
      <header className="workbench-panel-header">
        <p className="eyebrow">Browser-local · no upload server</p>
        <h1 id="evidence-lab-heading">
          <FlaskConical size={22} aria-hidden /> Evidence Lab
        </h1>
        <p className="workbench-lead">
          Validate a meter CSV in your browser, compute eligible surplus, and download a SHA-256
          evidence receipt. Nothing is minted on-chain from this step.
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

      <aside className="workbench-callout" role="note">
        <AlertTriangle size={16} aria-hidden />
        <div>
          <strong>Boundaries:</strong> validated locally · evidence receipt generated ·{' '}
          <em>not</em> accepted for live minting · <em>not</em> proof of physical truth or
          revenue-grade meter finality. Files stay in your browser.
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
          <p className="muted">Required: timestamp, generation_kwh. Optional: consumption, export, meter_id, cumulative.</p>
          <div className="mapping-grid">
            {['timestamp', 'generation_kwh', 'consumption_kwh', 'export_kwh', 'meter_id', 'cumulative_kwh'].map((field) => (
              <label key={field} className="mapping-field">
                <span>{field}</span>
                <select
                  value={mapping[field] || ''}
                  onChange={(e) => remap(field, e.target.value)}
                >
                  <option value="">—</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>{h}</option>
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
                  {headers.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, i) => (
                  <tr key={i}>
                    {headers.map((h) => (
                      <td key={h}>{row[h]}</td>
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
            <li><span>Generation</span><strong>{result.totals.generation_kwh} kWh</strong></li>
            <li><span>Consumption</span><strong>{result.totals.consumption_kwh} kWh</strong></li>
            <li><span>Export</span><strong>{result.totals.export_kwh} kWh</strong></li>
            <li><span>Eligible surplus</span><strong>{result.totals.eligible_surplus_kwh} kWh</strong></li>
            <li><span>Issuance cap</span><strong>{result.totals.issuance_cap_spk} SPK</strong></li>
          </ul>
          {result.rejected.length > 0 ? (
            <details>
              <summary>Rejected row details ({result.rejected.length})</summary>
              <ul className="reject-list">
                {result.rejected.slice(0, 20).map((r) => (
                  <li key={r.row_index}>
                    Row {r.row_index}: {r.issues.join(', ')}
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
          <button
            type="button"
            className="wallet-button"
            onClick={() => downloadJson(`spk-evidence-receipt-${receipt.evidence_hash.slice(0, 8)}.json`, receipt)}
          >
            <Download size={16} /> Download JSON receipt
          </button>
        </div>
      ) : null}
    </section>
  );
}
