import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Database,
  FlaskConical,
  GitCompareArrows,
  ShieldAlert,
  SlidersHorizontal,
  Waypoints,
} from 'lucide-react';

const STUDY_ROOT = `${import.meta.env.BASE_URL}empirical/market-capacity-v1`;
const FIXED_POLICY_ID = 'COLLATERAL-FIXED-20';
const GUARDED_POLICY_ID = 'COLLATERAL-VOL-LIQ-003';

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

function BriefMetric({ label, value, detail, tone = 'neutral' }) {
  return (
    <article className={`decision-metric ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
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

  useEffect(() => {
    let alive = true;

    Promise.all([
      fetch(`${STUDY_ROOT}/market-capacity-summary.json`).then((response) => {
        if (!response.ok) throw new Error(`Summary unavailable (${response.status})`);
        return response.json();
      }),
      fetch(`${STUDY_ROOT}/stress-reference-runs.json`).then((response) => {
        if (!response.ok) throw new Error(`Stress runs unavailable (${response.status})`);
        return response.json();
      }),
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
  }, []);

  const decision = useMemo(() => {
    if (!summary || !stressRuns) return null;

    const rows = summary.policy_metrics.filter((row) => row.horizon_sessions === horizon);
    const fixed = rows.find((row) => row.policy_id === FIXED_POLICY_ID);
    const guarded = rows.find((row) => row.policy_id === GUARDED_POLICY_ID);
    const peakStress = stressRuns.runs.find((run) => run.run_id === summary.peak_stress_run_id)
      || stressRuns.runs[0];
    const fixedStress = peakStress?.policy_results.find((row) => row.policy_id === FIXED_POLICY_ID);
    const guardedStress = peakStress?.policy_results.find((row) => row.policy_id === GUARDED_POLICY_ID);

    if (!fixed || !guarded) return null;

    return {
      fixed,
      guarded,
      peakStress,
      fixedStress,
      guardedStress,
      coverageGain: guarded.coverage_rate - fixed.coverage_rate,
      capacityCost: fixed.mean_permitted_capacity_ratio - guarded.mean_permitted_capacity_ratio,
      shortfallReduction: fixed.shortfall_event_rate - guarded.shortfall_event_rate,
    };
  }, [summary, stressRuns, horizon]);

  if (error) {
    return (
      <section className="decision-load-state error" role="alert">
        <ShieldAlert size={22} />
        <strong>Decision brief failed to load.</strong>
        <span>{error}</span>
      </section>
    );
  }

  if (!summary || !decision) {
    return (
      <section className="decision-load-state">
        <FlaskConical size={22} />
        <strong>Loading published policy results…</strong>
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

  return (
    <section className="decision-brief" aria-labelledby="decision-brief-heading">
      <header className="decision-hero">
        <div className="decision-hero-copy">
          <p className="decision-kicker">Public research lab · decision brief</p>
          <h1 id="decision-brief-heading">What did the stricter rule buy—and where did it still fail?</h1>
          <p className="decision-lede">
            This page translates the published empirical run into a decision. The full study, exact
            aggregate bundle, and evidence-to-claim laboratory remain available for inspection.
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

        <aside className="decision-scope" aria-label="Study scope">
          <div>
            <span>Historical panel</span>
            <strong>{summary.period.start} → {summary.period.end}</strong>
          </div>
          <div>
            <span>Delivered evidence</span>
            <strong>{fmt(summary.delivered_panel.rows)} security-days</strong>
          </div>
          <div>
            <span>Public boundary</span>
            <strong>Aggregates only</strong>
          </div>
        </aside>
      </header>

      <div className="decision-control-row">
        <div>
          <p className="decision-kicker">Evaluation horizon</p>
          <strong>Compare all policies on one common observation sample.</strong>
        </div>
        <div className="decision-horizon-toggle" aria-label="Evaluation horizon">
          {[20, 60].map((value) => (
            <button
              key={value}
              type="button"
              className={horizon === value ? 'active' : ''}
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
          label="Common observations"
          value={fmt(guarded.observation_count)}
          detail={`${horizon}-session complete-case comparison`}
        />
      </div>

      <section className="decision-conclusion">
        <div className="decision-conclusion-copy">
          <p className="decision-kicker">Decision statement</p>
          <h2>
            The guarded rule improved historical coverage, but the improvement was purchased by
            permitting less financial capacity.
          </h2>
          <p>
            At the {horizon}-session horizon, the volatility-plus-liquidity rule added
            {' '}{pp(coverageGain)} of coverage relative to the fixed 20% haircut while reducing
            mean permitted capacity by {pp(capacityCost)}. That is the observable policy trade-off;
            it is not proof that either rule is economically optimal.
          </p>
        </div>

        <div className="decision-receipt" aria-label="Trade-off receipt">
          <div>
            <span>Fixed baseline</span>
            <strong>{pct(fixed.mean_permitted_capacity_ratio)} permitted</strong>
            <small>{pct(fixed.shortfall_event_rate)} shortfall events</small>
          </div>
          <ArrowRight size={18} />
          <div>
            <span>Guarded rule</span>
            <strong>{pct(guarded.mean_permitted_capacity_ratio)} permitted</strong>
            <small>{pct(guarded.shortfall_event_rate)} shortfall events</small>
          </div>
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
            <span>Residual failure</span>
            <strong>{pct(guardedStress?.shortfall_event_rate)}</strong>
            <small>the stricter rule remained inadequate</small>
          </div>
        </div>

        <p className="decision-stress-note">
          The lab does not hide this result. A rule can dominate a baseline historically and still be
          unacceptable under severe realized stress.
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
            <GitCompareArrows size={20} />
            <span>01 · Policy comparison</span>
            <h3>What exposure did each declared rule permit?</h3>
            <p>Hold evidence and outcome definitions fixed; change the policy and measure capacity, coverage, and shortfall.</p>
          </article>
          <article>
            <SlidersHorizontal size={20} />
            <span>02 · Constraint attribution</span>
            <h3>Which guard actually capped the decision?</h3>
            <p>
              In the 20-session guarded sample, volatility bound
              {' '}{pct(summary.binding_constraint_attribution.volatility_capacity_binding_rate, 1)}
              {' '}and liquidity bound
              {' '}{pct(summary.binding_constraint_attribution.liquidity_capacity_binding_rate, 1)}.
            </p>
          </article>
          <article>
            <Waypoints size={20} />
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
            <Database size={18} />
            <strong>Interrogate the full study</strong>
            <small>Policy table, frontier, annual surface, stress dates, and methods.</small>
            <ArrowRight size={15} />
          </button>
          <button type="button" onClick={onOpenReproduce}>
            <span>02</span>
            <Activity size={18} />
            <strong>Verify the aggregate release</strong>
            <small>Recompute hashes over the exact committed public study files.</small>
            <ArrowRight size={15} />
          </button>
          <button type="button" onClick={onOpenProtocol}>
            <span>03</span>
            <Waypoints size={18} />
            <strong>Run evidence through a claim policy</strong>
            <small>Use sample or local evidence and make settlement failure visible.</small>
            <ArrowRight size={15} />
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
