import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Beaker,
  BookOpen,
  Database,
  Download,
  FlaskConical,
  GitCompareArrows,
  Hash,
  LineChart,
  LockKeyhole,
  RotateCcw,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';

const STUDY_FILES = {
  summary: 'market-capacity-summary.json',
  frontier: 'policy-frontier.json',
  yearly: 'yearly-policy-results.json',
  stress_runs: 'stress-reference-runs.json',
  methods: 'methods-manifest.json',
};
const STUDY_ROOT = `${import.meta.env.BASE_URL}empirical/market-capacity-v1`;
const VIEWS = [
  { id: 'study', label: 'Study', icon: Beaker },
  { id: 'frontier', label: 'Policy frontier', icon: LineChart },
  { id: 'stress', label: 'Stress replays', icon: Activity },
  { id: 'methods', label: 'Methods', icon: BookOpen },
];

const POLICY_SHORT = {
  'COLLATERAL-FIXED-20': 'Fixed 20%',
  'COLLATERAL-VOL-002': 'Volatility',
  'COLLATERAL-VOL-LIQ-003': 'Vol + liquidity',
};

function pct(value, digits = 1) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return `${(Number(value) * 100).toFixed(digits)}%`;
}

function fmt(value, digits = 0) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: digits });
}

function shortHash(value, chars = 16) {
  if (!value) return '—';
  return `${String(value).slice(0, chars)}…`;
}

function downloadJson(name, value) {
  const blob = new Blob([`${JSON.stringify(value, null, 2)}\n`], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function MetricCard({ label, value, detail, tone = 'neutral' }) {
  return (
    <div className={`empirical-metric ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function FrontierChart({ rows }) {
  const width = 640;
  const height = 260;
  const pad = { left: 52, right: 18, top: 22, bottom: 42 };
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  const points = rows.map((row) => ({
    x: pad.left + (row.haircut_pct / 60) * plotWidth,
    y: pad.top + (1 - row.coverage_rate) * plotHeight,
    row,
  }));
  const polyline = points.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <div className="empirical-chart-card">
      <svg className="empirical-frontier-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Coverage rate by fixed haircut">
        {[0, 0.5, 1].map((tick) => {
          const y = pad.top + (1 - tick) * plotHeight;
          return (
            <g key={tick}>
              <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} className="chart-grid" />
              <text x={pad.left - 10} y={y + 4} textAnchor="end" className="chart-label">{Math.round(tick * 100)}%</text>
            </g>
          );
        })}
        {[0, 20, 40, 60].map((tick) => {
          const x = pad.left + (tick / 60) * plotWidth;
          return (
            <g key={tick}>
              <line x1={x} x2={x} y1={pad.top} y2={height - pad.bottom} className="chart-grid vertical" />
              <text x={x} y={height - 16} textAnchor="middle" className="chart-label">{tick}%</text>
            </g>
          );
        })}
        <polyline points={polyline} className="chart-line" />
        {points.map(({ x, y, row }) => (
          <circle key={row.haircut_pct} cx={x} cy={y} r="4" className="chart-point">
            <title>{`${row.haircut_pct}% haircut · ${pct(row.coverage_rate, 2)} coverage`}</title>
          </circle>
        ))}
        <text x={width / 2} y={height - 2} textAnchor="middle" className="chart-axis-title">Fixed policy haircut</text>
        <text transform={`translate(14 ${height / 2}) rotate(-90)`} textAnchor="middle" className="chart-axis-title">Historical coverage</text>
      </svg>
    </div>
  );
}

function StudyView({ study, horizon, setHorizon }) {
  const { summary, yearly } = study;
  const metrics = summary.policy_metrics.filter((row) => row.horizon_sessions === horizon);
  const fixed = metrics.find((row) => row.policy_id === 'COLLATERAL-FIXED-20');
  const guarded = metrics.find((row) => row.policy_id === 'COLLATERAL-VOL-LIQ-003');
  const annual = yearly.rows.filter((row) => row.horizon_sessions === horizon);
  const years = [...new Set(annual.map((row) => row.year))];

  return (
    <div className="empirical-view-stack">
      <div className="empirical-view-heading">
        <div>
          <p className="empirical-kicker">Published empirical run · historical panel</p>
          <h2>How much capacity can policy permit before shortfalls appear?</h2>
          <p>Hold the historical market panel fixed. Change the claim rule. Measure coverage and permitted capacity on the same observation sample.</p>
        </div>
        <div className="empirical-horizon-toggle" aria-label="Evaluation horizon">
          {[20, 60].map((value) => (
            <button key={value} type="button" className={horizon === value ? 'active' : ''} onClick={() => setHorizon(value)}>
              {value} sessions
            </button>
          ))}
        </div>
      </div>

      <div className="empirical-metric-grid">
        <MetricCard label="Common observations" value={fmt(metrics[0]?.observation_count)} detail="same sample across policies" />
        <MetricCard label="Fixed 20% coverage" value={pct(fixed?.coverage_rate, 2)} detail={`${pct(fixed?.shortfall_event_rate, 2)} shortfall events`} tone="warning" />
        <MetricCard label="Guarded coverage" value={pct(guarded?.coverage_rate, 2)} detail={`${pct(guarded?.shortfall_event_rate, 2)} shortfall events`} tone="good" />
        <MetricCard label="Guarded capacity" value={pct(guarded?.mean_permitted_capacity_ratio, 2)} detail="mean of time-t market value" />
      </div>

      <section className="empirical-panel empirical-policy-result-panel">
        <div className="empirical-panel-head">
          <div>
            <p className="empirical-kicker">Policy comparison</p>
            <h3>Same evidence. Different rule. Different historical coverage.</h3>
          </div>
          <GitCompareArrows size={19} aria-hidden />
        </div>
        <div className="empirical-table-scroll">
          <table className="empirical-table">
            <thead>
              <tr><th>Policy</th><th>Coverage</th><th>Shortfall events</th><th>Mean permitted</th><th>Conditional shortfall</th></tr>
            </thead>
            <tbody>
              {metrics.map((row) => (
                <tr key={row.policy_id}>
                  <td><code>{row.policy_id}</code><span>{POLICY_SHORT[row.policy_id]}</span></td>
                  <td className="number good-text">{pct(row.coverage_rate, 2)}</td>
                  <td className="number warning-text">{pct(row.shortfall_event_rate, 2)}</td>
                  <td className="number">{pct(row.mean_permitted_capacity_ratio, 2)}</td>
                  <td className="number">{pct(row.mean_shortfall_ratio_conditional, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="empirical-attribution-strip">
          <div>
            <span>Coverage change</span>
            <strong>+{((guarded.coverage_rate - fixed.coverage_rate) * 100).toFixed(2)} pp</strong>
            <small>guarded vs fixed baseline</small>
          </div>
          <ArrowRight size={18} aria-hidden />
          <div>
            <span>Capacity cost</span>
            <strong>{((guarded.mean_permitted_capacity_ratio - fixed.mean_permitted_capacity_ratio) * 100).toFixed(2)} pp</strong>
            <small>mean permitted ratio</small>
          </div>
        </div>
      </section>

      <section className="empirical-panel">
        <div className="empirical-panel-head">
          <div>
            <p className="empirical-kicker">Binding constraint attribution</p>
            <h3>Which guard actually determined the decision?</h3>
          </div>
          <SlidersHorizontal size={19} aria-hidden />
        </div>
        <div className="binding-grid">
          <div className="binding-card">
            <span>Volatility capacity</span>
            <strong>{pct(summary.binding_constraint_attribution.volatility_capacity_binding_rate, 1)}</strong>
            <div className="binding-bar"><i style={{ width: pct(summary.binding_constraint_attribution.volatility_capacity_binding_rate, 2) }} /></div>
            <small>lower volatility-derived capacity was binding</small>
          </div>
          <div className="binding-card">
            <span>Liquidity capacity</span>
            <strong>{pct(summary.binding_constraint_attribution.liquidity_capacity_binding_rate, 1)}</strong>
            <div className="binding-bar liquidity"><i style={{ width: pct(summary.binding_constraint_attribution.liquidity_capacity_binding_rate, 2) }} /></div>
            <small>lower turnover-derived capacity was binding</small>
          </div>
        </div>
      </section>

      <section className="empirical-panel">
        <div className="empirical-panel-head">
          <div>
            <p className="empirical-kicker">Temporal robustness surface</p>
            <h3>Annual coverage, evaluated without changing policy formulas.</h3>
          </div>
          <Activity size={19} aria-hidden />
        </div>
        <div className="empirical-table-scroll">
          <table className="empirical-table annual-table">
            <thead>
              <tr><th>Year</th>{metrics.map((row) => <th key={row.policy_id}>{POLICY_SHORT[row.policy_id]}</th>)}</tr>
            </thead>
            <tbody>
              {years.map((year) => (
                <tr key={year}>
                  <td><strong>{year}</strong></td>
                  {metrics.map((policy) => {
                    const row = annual.find((item) => item.year === year && item.policy_id === policy.policy_id);
                    return <td key={policy.policy_id} className="number">{pct(row?.coverage_rate, 1)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function FrontierView({ study, horizon, setHorizon }) {
  const rows = study.frontier.rows.filter((row) => row.horizon_sessions === horizon);
  return (
    <div className="empirical-view-stack">
      <div className="empirical-view-heading">
        <div>
          <p className="empirical-kicker">Counterfactual policy surface</p>
          <h2>Capacity versus coverage is a measurable trade-off.</h2>
          <p>Replay the same historical outcomes under fixed haircuts from 0% to 60%. No slider magic: each point is an aggregate of the common evaluation sample.</p>
        </div>
        <div className="empirical-horizon-toggle">
          {[20, 60].map((value) => (
            <button key={value} type="button" className={horizon === value ? 'active' : ''} onClick={() => setHorizon(value)}>{value} sessions</button>
          ))}
        </div>
      </div>
      <FrontierChart rows={rows} />
      <section className="empirical-panel">
        <div className="empirical-panel-head">
          <div><p className="empirical-kicker">Frontier observations</p><h3>Every 5 percentage points of haircut changes both exposure and failure frequency.</h3></div>
          <LineChart size={19} aria-hidden />
        </div>
        <div className="frontier-grid">
          {rows.map((row) => (
            <div className="frontier-row" key={row.haircut_pct}>
              <span>{row.haircut_pct}% haircut</span>
              <div className="frontier-meter"><i style={{ width: pct(row.coverage_rate, 2) }} /></div>
              <strong>{pct(row.coverage_rate, 2)}</strong>
              <small>{pct(row.shortfall_event_rate, 2)} shortfall</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StressView({ study, selectedRunId, setSelectedRunId }) {
  const runs = study.stress_runs.runs;
  const run = runs.find((item) => item.run_id === selectedRunId) || runs[0];
  const fixed = run.policy_results.find((item) => item.policy_id === 'COLLATERAL-FIXED-20');
  const guarded = run.policy_results.find((item) => item.policy_id === 'COLLATERAL-VOL-LIQ-003');
  return (
    <div className="empirical-view-stack">
      <div className="empirical-view-heading">
        <div>
          <p className="empirical-kicker">Historical stress replay</p>
          <h2>Replay fixed policy against the dates where it broke hardest.</h2>
          <p>Dates are selected from the highest 20-session baseline shortfall rates with at least 300 observations and a 30-day separation rule.</p>
        </div>
      </div>
      <div className="stress-layout">
        <div className="stress-run-list" role="list" aria-label="Reference stress runs">
          {runs.map((item) => {
            const baseline = item.policy_results.find((row) => row.policy_id === 'COLLATERAL-FIXED-20');
            return (
              <button key={item.run_id} type="button" className={item.run_id === run.run_id ? 'stress-run active' : 'stress-run'} onClick={() => setSelectedRunId(item.run_id)}>
                <span>{item.run_id}</span>
                <strong>{item.date}</strong>
                <small>{pct(baseline.shortfall_event_rate, 1)} baseline shortfall events</small>
              </button>
            );
          })}
        </div>
        <section className="stress-replay-card">
          <div className="stress-run-header">
            <div><p className="empirical-kicker">{run.run_id}</p><h3>{run.date} · {run.horizon_sessions}-session forward capacity</h3></div>
            <span className="empirical-state warning">STRESS REPLAY</span>
          </div>
          <div className="stress-hold-fixed">
            <strong>Held fixed</strong>
            <span>date · historical market panel · downside-floor definition</span>
            <strong>Changed</strong>
            <span>policy only</span>
          </div>
          <div className="stress-policy-results">
            {run.policy_results.map((row) => (
              <div key={row.policy_id} className="stress-policy-row">
                <div><code>{row.policy_id}</code><span>{POLICY_SHORT[row.policy_id]}</span></div>
                <div className="stress-rate"><span>coverage</span><strong>{pct(row.coverage_rate, 1)}</strong><i style={{ width: pct(row.coverage_rate, 2) }} /></div>
                <div className="stress-rate danger"><span>shortfall events</span><strong>{pct(row.shortfall_event_rate, 1)}</strong><i style={{ width: pct(row.shortfall_event_rate, 2) }} /></div>
                <div className="stress-number"><span>mean permitted</span><strong>{pct(row.mean_permitted_capacity_ratio, 1)}</strong></div>
              </div>
            ))}
          </div>
          <div className="stress-interpretation">
            <ShieldAlert size={20} aria-hidden />
            <div>
              <strong>The guarded rule reduced stress-date shortfall incidence by {((fixed.shortfall_event_rate - guarded.shortfall_event_rate) * 100).toFixed(1)} percentage points.</strong>
              <p>It also permitted less capacity. The lab exposes that cost instead of calling the more conservative policy “better” by default.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MethodsView({ study }) {
  return (
    <div className="empirical-view-stack">
      <div className="empirical-view-heading">
        <div>
          <p className="empirical-kicker">Methods dossier</p>
          <h2>Inputs, cleaning rules, formulas, and boundaries are first-class output.</h2>
          <p>The public site does not redistribute licensed CRSP or Refinitiv rows. It publishes aggregate policy results, exact study identity, formulas, sample rules, and source-package hash.</p>
        </div>
      </div>
      <section className="empirical-panel methods-source-panel">
        <div className="methods-key"><span>Study</span><code>{study.summary.study_id}</code></div>
        <div className="methods-key"><span>Source package</span><code>{study.summary.source_dataset_id}</code></div>
        <div className="methods-key full"><span>SHA-256</span><code>{study.summary.source_dataset_sha256}</code></div>
        <div className="methods-key"><span>Period</span><strong>{study.summary.period.start} → {study.summary.period.end}</strong></div>
        <div className="methods-key"><span>Source licence</span><strong>{study.summary.source_license}</strong></div>
      </section>
      <section className="empirical-panel">
        <div className="empirical-panel-head"><div><p className="empirical-kicker">Evaluation cleaning</p><h3>Conservative rules applied before policy comparison.</h3></div><Database size={19} aria-hidden /></div>
        <ol className="methods-step-list">
          {study.methods.cleaning.map((item) => (
            <li key={item.step}><span>{String(item.step).padStart(2, '0')}</span><p>{item.rule}</p></li>
          ))}
        </ol>
      </section>
      <section className="empirical-panel">
        <div className="empirical-panel-head"><div><p className="empirical-kicker">Reference policies</p><h3>Declared research rules, not optimized market standards.</h3></div><FlaskConical size={19} aria-hidden /></div>
        <div className="method-policy-list">
          {study.methods.policy_definitions.map((policy) => (
            <article key={policy.policy_id}>
              <code>{policy.policy_id}</code>
              <strong>{policy.name}</strong>
              <pre>{policy.formula}</pre>
              <p>{policy.claim}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="empirical-boundary-panel">
        <LockKeyhole size={21} aria-hidden />
        <div><strong>Public reproduction boundary</strong><p>{study.methods.reproduction_boundary}</p></div>
      </section>
    </div>
  );
}

export default function EmpiricalRunsLab({ onOpenProtocol }) {
  const [study, setStudy] = useState(null);
  const [error, setError] = useState(null);
  const [view, setView] = useState('study');
  const [horizon, setHorizon] = useState(20);
  const [selectedRunId, setSelectedRunId] = useState(null);

  useEffect(() => {
    let alive = true;
    Promise.all(Object.entries(STUDY_FILES).map(async ([key, file]) => {
      const response = await fetch(`${STUDY_ROOT}/${file}`);
      if (!response.ok) throw new Error(`Empirical study unavailable: ${file} (${response.status})`);
      return [key, await response.json()];
    }))
      .then((entries) => {
        if (!alive) return;
        const value = Object.fromEntries(entries);
        setStudy(value);
        setSelectedRunId(value.summary.peak_stress_run_id || value.stress_runs.runs[0]?.run_id || null);
      })
      .catch((reason) => { if (alive) setError(reason.message || String(reason)); });
    return () => { alive = false; };
  }, []);

  const selectedRun = useMemo(() => {
    if (!study) return null;
    return study.stress_runs.runs.find((item) => item.run_id === selectedRunId) || study.stress_runs.runs[0] || null;
  }, [study, selectedRunId]);

  if (error) return <section className="empirical-load-state error"><ShieldAlert size={22} /><strong>Empirical study failed to load.</strong><span>{error}</span></section>;
  if (!study) return <section className="empirical-load-state"><RotateCcw size={22} className="spin" /><strong>Loading committed empirical run bundle…</strong></section>;

  const summary = study.summary;
  const activeView = view === 'study'
    ? <StudyView study={study} horizon={horizon} setHorizon={setHorizon} />
    : view === 'frontier'
      ? <FrontierView study={study} horizon={horizon} setHorizon={setHorizon} />
      : view === 'stress'
        ? <StressView study={study} selectedRunId={selectedRunId} setSelectedRunId={setSelectedRunId} />
        : <MethodsView study={study} />;

  return (
    <section className="empirical-lab" aria-labelledby="empirical-heading">
      <header className="empirical-hero">
        <div>
          <p className="empirical-kicker">Constraint · empirical runs</p>
          <h1 id="empirical-heading">Policy decisions should survive contact with historical outcomes.</h1>
          <p>Evaluate bounded claim policies against an identity-cleaned 2018–2024 market panel. Compare coverage, capacity cost, binding constraints, and stress-date failures without exposing licensed source rows.</p>
        </div>
        <div className="empirical-hero-stats">
          <div><span>Delivered evidence</span><strong>{fmt(summary.delivered_panel.rows)}</strong><small>licensed security-days</small></div>
          <div><span>Evaluation view</span><strong>{fmt(summary.conservative_evaluation_view.rows)}</strong><small>after identity fail-closed</small></div>
          <div><span>Public surface</span><strong>AGGREGATES</strong><small>no licensed rows redistributed</small></div>
        </div>
      </header>

      <div className="empirical-shell">
        <aside className="empirical-sidebar" aria-label="Empirical run navigation">
          <div className="empirical-side-title"><FlaskConical size={18} /><span>Run pipeline</span></div>
          <nav>
            {VIEWS.map(({ id, label, icon: Icon }, index) => (
              <button key={id} type="button" className={view === id ? 'active' : ''} onClick={() => setView(id)} aria-current={view === id ? 'page' : undefined}>
                <span>{String(index + 1).padStart(2, '0')}</span><Icon size={16} aria-hidden /><strong>{label}</strong>
              </button>
            ))}
          </nav>
          <div className="empirical-side-state">
            <span>Study state</span>
            <div><i /> <strong>PUBLISHED AGGREGATE</strong></div>
            <small>Committed public bundle. Raw licensed panel remains private.</small>
          </div>
          <button type="button" className="empirical-protocol-link" onClick={onOpenProtocol}>Open protocol lab <ArrowRight size={15} /></button>
        </aside>

        <main className="empirical-workspace">{activeView}</main>

        <aside className="empirical-dossier" aria-label="Run dossier">
          <p className="empirical-kicker">Run dossier</p>
          <h2>{view === 'stress' && selectedRun ? selectedRun.run_id : 'CP-MKT-PANEL-0001'}</h2>
          <div className="dossier-state"><i /> <span>{view === 'stress' ? 'HISTORICAL REPLAY' : 'PUBLISHED STUDY'}</span></div>
          <dl>
            <div><dt>Evidence</dt><dd><code>{shortHash(summary.source_dataset_sha256)}</code></dd></div>
            <div><dt>Period</dt><dd>{summary.period.start}<br />→ {summary.period.end}</dd></div>
            <div><dt>Identity rule</dt><dd>{summary.conservative_evaluation_view.ambiguous_rics_excluded_count} ambiguous RICs excluded</dd></div>
            <div><dt>20-session sample</dt><dd>{fmt(summary.comparison_sample['20_session_observations'])}</dd></div>
            {view === 'stress' && selectedRun ? <div><dt>Replay date</dt><dd>{selectedRun.date}</dd></div> : null}
            <div><dt>Data location</dt><dd>licensed source private<br />aggregates public</dd></div>
          </dl>
          <div className="dossier-lineage">
            <span>SOURCE HASH</span>
            <ArrowRight size={13} />
            <span>CLEAN VIEW</span>
            <ArrowRight size={13} />
            <span>POLICY</span>
            <ArrowRight size={13} />
            <span>OUTCOME</span>
          </div>
          <button type="button" className="ghost-button empirical-download" onClick={() => downloadJson('constraint-market-capacity-study.json', study)}>
            <Download size={15} /> Download study bundle
          </button>
          <div className="dossier-boundary">
            <Hash size={15} />
            <p><strong>Observed</strong> market evidence stays licensed. <strong>Derived</strong> aggregate policy results are exposed here. <strong>Declared</strong> policy formulas are visible in Methods.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
