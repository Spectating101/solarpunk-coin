import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Database,
  Download,
  FlaskConical,
  GitCompareArrows,
  Hash,
  RotateCcw,
  ShieldAlert,
  SlidersHorizontal,
  Waypoints,
} from 'lucide-react';

const STUDY_ROOT = `${import.meta.env.BASE_URL}empirical/market-capacity-v1`;
const FIXED_POLICY_ID = 'COLLATERAL-FIXED-20';
const GUARDED_POLICY_ID = 'COLLATERAL-VOL-LIQ-003';
const HORIZONS = [20, 60];

function pct(value, digits = 2) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return `${(Number(value) * 100).toFixed(digits)}%`;
}

function pp(value, digits = 2) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return `${(Number(value) * 100).toFixed(digits)} pp`;
}

function fmt(value) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return Number(value).toLocaleString();
}

function shortHash(value, chars = 14) {
  if (!value) return '—';
  return `${String(value).slice(0, chars)}…`;
}

async function fetchJson(file) {
  const response = await fetch(`${STUDY_ROOT}/${file}`);
  if (!response.ok) throw new Error(`${file} unavailable (${response.status})`);
  return response.json();
}

function downloadText(filename, value) {
  const blob = new Blob([value], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function BriefMetric({ label, value, detail, tone = 'neutral' }) {
  return (
    <article className={`decision-metric ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function decisionForHorizon(summary, horizon) {
  const rows = summary.policy_metrics.filter((row) => row.horizon_sessions === horizon);
  const fixed = rows.find((row) => row.policy_id === FIXED_POLICY_ID);
  const guarded = rows.find((row) => row.policy_id === GUARDED_POLICY_ID);
  if (!fixed || !guarded) return null;

  return {
    horizon,
    fixed,
    guarded,
    coverageGain: guarded.coverage_rate - fixed.coverage_rate,
    capacityCost: fixed.mean_permitted_capacity_ratio - guarded.mean_permitted_capacity_ratio,
    shortfallReduction: fixed.shortfall_event_rate - guarded.shortfall_event_rate,
  };
}

function buildDecisionMemo({ summary, decision, peakStress, fixedStress, guardedStress }) {
  const generatedAt = new Date().toISOString();
  return `# Policy Decision Brief\n\n` +
    `**Study:** ${summary.study_name}\n\n` +
    `**Study ID:** \`${summary.study_id}\`\n\n` +
    `**Generated:** ${generatedAt}\n\n` +
    `## Decision statement\n\n` +
    `At the ${decision.horizon}-session horizon, the volatility-plus-liquidity guard improved historical coverage by ${pp(decision.coverageGain)} relative to the fixed 20% haircut while reducing mean permitted capacity by ${pp(decision.capacityCost)}. Shortfall-event incidence fell by ${pp(decision.shortfallReduction)}. This is a historical policy trade-off, not evidence that either rule is optimal or production-ready.\n\n` +
    `## Common-sample comparison\n\n` +
    `| Policy | Coverage | Shortfall events | Mean permitted capacity |\n` +
    `|---|---:|---:|---:|\n` +
    `| Fixed 20% haircut | ${pct(decision.fixed.coverage_rate)} | ${pct(decision.fixed.shortfall_event_rate)} | ${pct(decision.fixed.mean_permitted_capacity_ratio)} |\n` +
    `| Volatility + liquidity guard | ${pct(decision.guarded.coverage_rate)} | ${pct(decision.guarded.shortfall_event_rate)} | ${pct(decision.guarded.mean_permitted_capacity_ratio)} |\n\n` +
    `Common observations: ${fmt(decision.guarded.observation_count)}.\n\n` +
    `## Failure-visible stress replay\n\n` +
    `Peak published replay: ${peakStress?.date || '—'} (${peakStress?.horizon_sessions || 20} sessions). Fixed-policy shortfall events were ${pct(fixedStress?.shortfall_event_rate)}; guarded-policy shortfall events were ${pct(guardedStress?.shortfall_event_rate)}. The guarded rule remained materially inadequate under this realized stress.\n\n` +
    `## Evidence receipt\n\n` +
    `- Source package: \`${summary.source_dataset_id}\`\n` +
    `- Source SHA-256: \`${summary.source_dataset_sha256}\`\n` +
    `- Historical period: ${summary.period.start} to ${summary.period.end}\n` +
    `- Public boundary: ${summary.public_data_boundary}\n\n` +
    `## Interpretation boundary\n\n${summary.interpretation_boundary}\n`;
}

export default function DecisionBrief({
  onOpenStudy,
  onOpenReproduce,
  onOpenProtocol,
}) {
  const [summary, setSummary] = useState(null);
  const [stressRuns, setStressRuns] = useState(null);
  const [horizon, setHorizon] = useState(20);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setError(null);

    Promise.all([
      fetchJson('market-capacity-summary.json'),
      fetchJson('stress-reference-runs.json'),
    ])
      .then(([summaryValue, stressValue]) => {
        if (!alive) return;
        setSummary(summaryValue);
        setStressRuns(stressValue);
      })
      .catch((reason) => {
        if (alive) setError(reason.message || String(reason));
      });

    return () => {
      alive = false;
    };
  }, [attempt]);

  const decision = useMemo(() => {
    if (!summary || !stressRuns) return null;
    const selected = decisionForHorizon(summary, horizon);
    if (!selected) return null;

    const peakStress = stressRuns.runs.find((run) => run.run_id === summary.peak_stress_run_id)
      || stressRuns.runs[0];
    const fixedStress = peakStress?.policy_results.find((row) => row.policy_id === FIXED_POLICY_ID);
    const guardedStress = peakStress?.policy_results.find((row) => row.policy_id === GUARDED_POLICY_ID);

    return { ...selected, peakStress, fixedStress, guardedStress };
  }, [summary, stressRuns, horizon]);

  const horizonDecisions = useMemo(() => {
    if (!summary) return [];
    return HORIZONS.map((value) => decisionForHorizon(summary, value)).filter(Boolean);
  }, [summary]);

  if (error) {
    return (
      <section className="decision-load-state error" role="alert">
        <ShieldAlert size={24} />
        <strong>Decision brief failed to load.</strong>
        <span>{error}</span>
        <button type="button" className="ghost-button" onClick={() => setAttempt((value) => value + 1)}>
          <RotateCcw size={15} /> Retry published bundle
        </button>
      </section>
    );
  }

  if (!summary || !decision) {
    return (
      <section className="decision-load-state" aria-live="polite" aria-busy="true">
        <div className="decision-loader" aria-hidden><FlaskConical size={22} /></div>
        <strong>Loading published policy results…</strong>
        <span>Reading the committed aggregate receipt and stress replays.</span>
      </section>
    );
  }

  const {
    fixed,
    guarded,
    peakStress,
    fixedStress,
    guardedStress,
    coverageGain,
    capacityCost,
    shortfallReduction,
  } = decision;

  const memo = buildDecisionMemo({ summary, decision, peakStress, fixedStress, guardedStress });
  const residualLabel = guarded.shortfall_event_rate < 0.02
    ? 'Lower failure incidence; no adequacy proof'
    : 'Improved, but residual failure remains material';

  return (
    <section className="decision-brief" aria-labelledby="decision-brief-heading">
      <header className="decision-hero">
        <div className="decision-hero-copy">
          <div className="decision-status-line">
            <span className="decision-live-dot" aria-hidden />
            <span>Published aggregate</span>
            <span aria-hidden>·</span>
            <span>{horizon}-session decision view</span>
          </div>
          <p className="decision-kicker">Public research lab · decision brief</p>
          <h1 id="decision-brief-heading">What did the stricter rule buy—and where did it still fail?</h1>
          <p className="decision-lede">
            Start with the decision, not the machinery. Compare the historical benefit, the capacity
            surrendered to obtain it, and the stress case that neither rule solved.
          </p>
          <div className="decision-actions">
            <button type="button" className="wallet-button" onClick={onOpenStudy}>
              Open full study <ArrowRight size={15} />
            </button>
            <button type="button" className="ghost-button" onClick={onOpenReproduce}>
              Verify published bytes
            </button>
            <button type="button" className="ghost-button" onClick={onOpenProtocol}>
              Inspect claim flow
            </button>
          </div>
        </div>

        <aside className="decision-research-receipt" aria-label="Published study receipt">
          <div className="decision-receipt-head">
            <div>
              <span>Research receipt</span>
              <strong>{summary.study_id}</strong>
            </div>
            <Hash size={18} aria-hidden />
          </div>
          <dl>
            <div><dt>Historical panel</dt><dd>{summary.period.start} → {summary.period.end}</dd></div>
            <div><dt>Common sample</dt><dd>{fmt(guarded.observation_count)} observations</dd></div>
            <div><dt>Identity control</dt><dd>{summary.conservative_evaluation_view.ambiguous_rics_excluded_count} ambiguous RICs excluded</dd></div>
            <div><dt>Source SHA-256</dt><dd><code title={summary.source_dataset_sha256}>{shortHash(summary.source_dataset_sha256, 18)}</code></dd></div>
            <div><dt>Public boundary</dt><dd>Aggregate results only</dd></div>
          </dl>
          <button
            type="button"
            className="decision-memo-button"
            onClick={() => downloadText(`policy-decision-brief-${horizon}-session.md`, memo)}
          >
            <Download size={15} /> Download decision memo
          </button>
        </aside>
      </header>

      <div className="decision-control-row">
        <div>
          <p className="decision-kicker">Evaluation horizon</p>
          <strong>Every comparison uses one common complete-case sample.</strong>
        </div>
        <div className="decision-horizon-toggle" role="group" aria-label="Evaluation horizon">
          {HORIZONS.map((value) => (
            <button
              key={value}
              type="button"
              className={horizon === value ? 'active' : ''}
              aria-pressed={horizon === value}
              aria-label={`Use ${value}-session horizon`}
              onClick={() => setHorizon(value)}
            >
              {value} sessions
            </button>
          ))}
        </div>
      </div>

      <div className="decision-metric-grid">
        <BriefMetric
          label="Coverage purchased"
          value={`+${pp(coverageGain)}`}
          detail={`guarded ${pct(guarded.coverage_rate)} vs fixed ${pct(fixed.coverage_rate)}`}
          tone="good"
        />
        <BriefMetric
          label="Capacity surrendered"
          value={pp(capacityCost)}
          detail={`guarded permits ${pct(guarded.mean_permitted_capacity_ratio)} on average`}
          tone="warning"
        />
        <BriefMetric
          label="Shortfall incidence reduced"
          value={pp(shortfallReduction)}
          detail={`${pct(fixed.shortfall_event_rate)} → ${pct(guarded.shortfall_event_rate)}`}
          tone="good"
        />
        <BriefMetric
          label="Residual guarded shortfall"
          value={pct(guarded.shortfall_event_rate)}
          detail={residualLabel}
          tone={guarded.shortfall_event_rate > 0.03 ? 'danger' : 'neutral'}
        />
      </div>

      <section className="decision-conclusion">
        <div className="decision-conclusion-copy">
          <p className="decision-kicker">Decision statement</p>
          <h2>The guarded rule reduced historical failure by admitting less exposure.</h2>
          <p>
            At the {horizon}-session horizon, the volatility-plus-liquidity rule added {pp(coverageGain)}
            {' '}of coverage relative to the fixed 20% haircut while reducing mean permitted capacity by
            {' '}{pp(capacityCost)}. The result supports a measurable trade-off—not an automatic recommendation.
          </p>
          <div className="decision-interpretation-tags" aria-label="Decision interpretation">
            <span>same evidence</span><span>same outcome definition</span><span>policy changed</span>
          </div>
        </div>

        <div className="decision-receipt" aria-label="Policy trade-off receipt">
          <article>
            <span>Fixed baseline</span>
            <strong>{pct(fixed.mean_permitted_capacity_ratio)} permitted</strong>
            <small>{pct(fixed.shortfall_event_rate)} shortfall events</small>
          </article>
          <div className="decision-receipt-delta">
            <ArrowRight size={18} aria-hidden />
            <span>−{pp(capacityCost)} capacity</span>
          </div>
          <article className="guarded">
            <span>Guarded rule</span>
            <strong>{pct(guarded.mean_permitted_capacity_ratio)} permitted</strong>
            <small>{pct(guarded.shortfall_event_rate)} shortfall events</small>
          </article>
        </div>
      </section>

      <section className="decision-sensitivity">
        <div className="decision-section-heading">
          <div>
            <p className="decision-kicker">Horizon sensitivity</p>
            <h2>The conclusion strengthens over 60 sessions, but the remaining failure rate also becomes material.</h2>
          </div>
          <Activity size={22} aria-hidden />
        </div>
        <div className="decision-sensitivity-grid">
          {horizonDecisions.map((row) => (
            <button
              key={row.horizon}
              type="button"
              className={horizon === row.horizon ? 'active' : ''}
              aria-pressed={horizon === row.horizon}
              onClick={() => setHorizon(row.horizon)}
            >
              <div className="decision-sensitivity-title">
                <span>{row.horizon} sessions</span>
                <strong>{fmt(row.guarded.observation_count)} common observations</strong>
              </div>
              <dl>
                <div><dt>Coverage gain</dt><dd>+{pp(row.coverageGain)}</dd></div>
                <div><dt>Capacity cost</dt><dd>{pp(row.capacityCost)}</dd></div>
                <div><dt>Guarded shortfall</dt><dd>{pct(row.guarded.shortfall_event_rate)}</dd></div>
              </dl>
              <small>{horizon === row.horizon ? 'ACTIVE DECISION VIEW' : 'SELECT HORIZON'}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="decision-stress">
        <div className="decision-stress-heading">
          <div>
            <p className="decision-kicker">Failure-visible stress replay</p>
            <h2>A more conservative rule still failed badly in the worst published replay.</h2>
          </div>
          <ShieldAlert size={23} aria-hidden />
        </div>

        <div className="decision-stress-grid">
          <div>
            <span>Replay date</span>
            <strong>{peakStress?.date || '—'}</strong>
            <small>{peakStress?.horizon_sessions || 20}-session historical replay</small>
          </div>
          <div>
            <span>Fixed shortfall events</span>
            <strong>{pct(fixedStress?.shortfall_event_rate)}</strong>
            <small>{pct(fixedStress?.coverage_rate)} coverage</small>
          </div>
          <div>
            <span>Guarded shortfall events</span>
            <strong>{pct(guardedStress?.shortfall_event_rate)}</strong>
            <small>{pct(guardedStress?.coverage_rate)} coverage</small>
          </div>
          <div className="danger">
            <span>Residual stress failure</span>
            <strong>{pct(guardedStress?.shortfall_event_rate)}</strong>
            <small>the stricter rule remained inadequate</small>
          </div>
        </div>

        <p className="decision-stress-note">
          The stress replay is held at its published 20-session horizon. It is deliberately shown beside
          either summary horizon because it is the clearest counterexample to overclaiming policy adequacy.
        </p>
      </section>

      <section className="decision-value">
        <div className="decision-section-heading">
          <div>
            <p className="decision-kicker">Value delivered</p>
            <h2>Three questions the lab can answer now.</h2>
          </div>
          <CheckCircle2 size={22} aria-hidden />
        </div>

        <div className="decision-value-grid">
          <article>
            <GitCompareArrows size={20} aria-hidden />
            <span>01 · Policy comparison</span>
            <h3>What exposure did each declared rule permit?</h3>
            <p>Hold evidence and outcome definitions fixed; change policy and measure capacity, coverage, and shortfall.</p>
          </article>
          <article>
            <SlidersHorizontal size={20} aria-hidden />
            <span>02 · Constraint attribution</span>
            <h3>Which guard actually capped the decision?</h3>
            <p>
              In the 20-session guarded sample, volatility bound
              {' '}{pct(summary.binding_constraint_attribution.volatility_capacity_binding_rate, 1)} and liquidity bound
              {' '}{pct(summary.binding_constraint_attribution.liquidity_capacity_binding_rate, 1)}.
            </p>
          </article>
          <article>
            <Waypoints size={20} aria-hidden />
            <span>03 · Claim explanation</span>
            <h3>Why was a bounded quantity allowed to exist?</h3>
            <p>Trace local evidence through normalization, provenance, policy admission, claim quantity, and settlement outcome.</p>
          </article>
        </div>
      </section>

      <section className="decision-path">
        <div className="decision-section-heading">
          <div>
            <p className="decision-kicker">Inspection path</p>
            <h2>Move from conclusion to evidence without losing the reasoning chain.</h2>
          </div>
          <BookOpen size={22} aria-hidden />
        </div>

        <div className="decision-path-grid">
          <button type="button" onClick={onOpenStudy}>
            <span>01</span>
            <Database size={18} aria-hidden />
            <strong>Interrogate the full study</strong>
            <small>Policy table, frontier, annual surface, stress dates, and methods.</small>
            <ArrowRight size={15} aria-hidden />
          </button>
          <button type="button" onClick={onOpenReproduce}>
            <span>02</span>
            <Activity size={18} aria-hidden />
            <strong>Verify the aggregate release</strong>
            <small>Recompute hashes over the exact committed public study files.</small>
            <ArrowRight size={15} aria-hidden />
          </button>
          <button type="button" onClick={onOpenProtocol}>
            <span>03</span>
            <Waypoints size={18} aria-hidden />
            <strong>Run evidence through a claim policy</strong>
            <small>Use sample or local evidence and make settlement failure visible.</small>
            <ArrowRight size={15} aria-hidden />
          </button>
        </div>
      </section>

      <section className="decision-boundary">
        <ShieldAlert size={21} aria-hidden />
        <div>
          <strong>Interpretation boundary</strong>
          <p>{summary.interpretation_boundary}</p>
          <small>{summary.public_data_boundary}</small>
        </div>
      </section>
    </section>
  );
}
