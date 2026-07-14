import React from 'react';
import { AlertTriangle, CheckCircle2, FileDigit, ShieldCheck } from 'lucide-react';
import { useCaseWorkbench } from '../../app/CaseWorkbenchProvider';

function semanticLabel(kind) {
  if (kind === 'MODELED') return 'MODELED CONTEXT';
  if (kind === 'DECLARED') return 'DECLARED POLICY';
  if (kind === 'DERIVED') return 'DERIVED RESULT';
  return 'CONTROLLED EVIDENCE FIXTURE';
}

export default function EvidenceLens() {
  const { activeRun } = useCaseWorkbench();
  if (!activeRun) return <div className="wb-lens-loading">Loading evidence identity…</div>;
  const { evidence, contexts, provenance, scenario } = activeRun;

  return (
    <div className="evidence-lens">
      <section className="evidence-summary-grid">
        <article className="semantic-card observed">
          <span>{semanticLabel('EVIDENCE')}</span>
          <FileDigit size={22} />
          <strong>{evidence.summary.total_eligible_surplus_kwh} kWh</strong>
          <p>{evidence.summary.interval_count} controlled intervals · {evidence.adapter.id}@{evidence.adapter.version}</p>
        </article>
        <article className="semantic-card modeled">
          <span>{semanticLabel('MODELED')}</span>
          <ShieldCheck size={22} />
          <strong>{contexts[0]?.values?.annual_ac_kwh} kWh/year</strong>
          <p>{contexts[0]?.temporal_semantics?.kind} · observed case window: no</p>
        </article>
        <article className="semantic-card declared">
          <span>ASSURANCE SCENARIO</span>
          <CheckCircle2 size={22} />
          <strong>{provenance.level}</strong>
          <p>{scenario.name}</p>
        </article>
      </section>

      <section className="evidence-table-section">
        <div className="constraint-section-heading">
          <div>
            <span className="wb-section-label">Accepted evidence intervals</span>
            <h3>{evidence.summary.interval_count} rows · {evidence.summary.rejected_input_records || 0} rejected</h3>
          </div>
          <span className="wb-status-pill pass"><CheckCircle2 size={14} /> hash verified before decision</span>
        </div>
        <div className="wb-table-scroll">
          <table className="wb-data-table">
            <thead>
              <tr>
                <th>Window</th>
                <th>Generation</th>
                <th>Load</th>
                <th>Export</th>
                <th>Eligible surplus</th>
                <th>Quality</th>
              </tr>
            </thead>
            <tbody>
              {evidence.intervals.map((row) => (
                <tr key={`${row.site_id}-${row.window_start}`}>
                  <td><code>{row.window_start.slice(0, 10)}</code></td>
                  <td>{row.generation_kwh} kWh</td>
                  <td>{row.site_load_kwh} kWh</td>
                  <td>{row.export_kwh} kWh</td>
                  <td><strong>{row.eligible_surplus_kwh} kWh</strong></td>
                  <td>{row.quality_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="evidence-provenance-grid">
        <article>
          <span className="wb-section-label">Evidence identity</span>
          <dl className="dossier-list wide">
            <div><dt>Source kind</dt><dd>{evidence.source.kind}</dd></div>
            <div><dt>Signed capability</dt><dd>{String(evidence.capabilities.signed)}</dd></div>
            <div><dt>Cryptographically verified</dt><dd>{String(evidence.capabilities.cryptographically_verified)}</dd></div>
            <div><dt>External corroboration</dt><dd>{String(evidence.capabilities.external_corroboration)}</dd></div>
            <div><dt>Evidence hash</dt><dd><code>{evidence.evidence_hash}</code></dd></div>
          </dl>
        </article>
        <article>
          <span className="wb-section-label">Assurance classification</span>
          <div className="assurance-level">{provenance.level}<small>{provenance.label}</small></div>
          <div className="assurance-reasons">
            {provenance.reasons.map((item) => <p key={item}><CheckCircle2 size={14} /> {item}</p>)}
          </div>
          <div className="assurance-next">
            <strong>Missing for next level</strong>
            {provenance.missing_for_next_level.map((item) => <span key={item}>{item}</span>)}
          </div>
        </article>
      </section>

      <section className="evidence-boundary-warning">
        <AlertTriangle size={18} />
        <div>
          <strong>Fixture and counterfactual boundary</strong>
          <p>{scenario.boundary}</p>
          <p>{provenance.explicit_boundary}</p>
        </div>
      </section>
    </div>
  );
}
