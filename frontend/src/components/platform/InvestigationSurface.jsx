import React from 'react';
import {
  AlertOctagon,
  Ban,
  CheckCircle2,
  Gauge,
  Search,
  ShieldAlert,
} from 'lucide-react';
import { useCaseWorkbench } from '../../app/CaseWorkbenchProvider';
import {
  EmptyState,
  LinkButton,
  PlatformPageIntro,
  StatusBadge,
  ValueFlow,
  formatQuantity,
  humanize,
} from './PlatformSurface';

const MISSIONS = [
  {
    id: 'blocked',
    label: 'Find a blocked result',
    caseId: 'TYN-001',
    policyId: 'ENERGY-CASE-PILOT-005',
    scenarioId: 'PROVENANCE-L0-BASE',
    multiplier: 1,
  },
  {
    id: 'binding',
    label: 'Make resource context bind',
    caseId: 'AUS-001',
    policyId: 'ENERGY-CASE-PILOT-005',
    scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
    multiplier: 1,
  },
  {
    id: 'stress',
    label: 'Cause a settlement shortfall',
    caseId: 'TYN-001',
    policyId: 'ENERGY-CASE-PILOT-005',
    scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
    multiplier: 0.4,
  },
];

function settlementIcon(result) {
  if (result === 'SETTLED') return <CheckCircle2 size={18} />;
  if (result === 'PARTIAL') return <ShieldAlert size={18} />;
  return <AlertOctagon size={18} />;
}

export default function InvestigationSurface({ onNavigate, onOpenFullAnalysis }) {
  const {
    pack,
    activeCaseId,
    activePolicyId,
    activeScenarioId,
    activeRun,
    activeStress,
    settlementMultiplier,
    selectCase,
    selectPolicy,
    selectScenario,
    setSettlementMultiplier,
    loading,
    error,
  } = useCaseWorkbench();

  const decision = activeRun?.decision || null;
  const blocked = decision?.decision === 'BLOCKED';
  const evidence = activeRun?.evidence || null;
  const requested = evidence?.summary?.total_eligible_surplus_kwh ?? null;
  const justified = blocked ? null : decision?.capacity?.admitted_maximum;
  const settlement = activeStress?.available ? activeStress.settlement : null;
  const covered = settlement?.covered_quantity ?? null;
  const shortfall = settlement?.shortfall_quantity ?? null;
  const mainRule = blocked
    ? decision?.admission?.blocking_rules?.[0]
    : decision?.capacity?.binding_constraints?.[0];

  const runMission = (mission) => {
    selectCase(mission.caseId);
    selectPolicy(mission.policyId);
    selectScenario(mission.scenarioId);
    setSettlementMultiplier(mission.multiplier);
  };

  return (
    <main className="platform-page investigation-surface" aria-labelledby="investigation-title">
      <PlatformPageIntro
        kicker="Investigate · guided decision inquiry"
        title="Find what blocks the claim, what bounds it, and what fails afterward."
        description="Set a case, assurance condition, policy, and settlement stress. The workbench runs the same deterministic decision objects used by the complete investigation workspace."
        viewMode="overview"
      >
        <LinkButton primary onClick={onOpenFullAnalysis}>Open full investigation</LinkButton>
      </PlatformPageIntro>

      <section className="platform-three-column investigation-console">
        <article className="platform-panel investigation-controls">
          <header><span>Action</span><h2>Set the investigation</h2></header>
          <label>
            Case
            <select value={activeCaseId} onChange={(event) => selectCase(event.target.value)}>
              {pack.cases.map((item) => <option key={item.case_id} value={item.case_id}>{item.case_id} · {item.subject}</option>)}
            </select>
          </label>
          <label>
            Assurance
            <select value={activeScenarioId} onChange={(event) => selectScenario(event.target.value)}>
              {pack.scenarios.map((item) => <option key={item.scenario_id} value={item.scenario_id}>{item.name}</option>)}
            </select>
          </label>
          <label>
            Policy
            <select value={activePolicyId} onChange={(event) => selectPolicy(event.target.value)}>
              {pack.policies.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label>
            Settlement capacity · {Math.round(settlementMultiplier * 100)}%
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settlementMultiplier}
              onChange={(event) => setSettlementMultiplier(event.target.value)}
              disabled={blocked}
            />
          </label>
          <div className="platform-control-note">
            Evidence, modeled context, policy, and derived result remain labeled separately throughout the run.
          </div>
        </article>

        <article className="platform-panel investigation-journey" aria-live="polite">
          <header><span>Consequence</span><h2>Live decision journey</h2></header>
          {loading ? <EmptyState>Evaluating the selected case and policy…</EmptyState> : null}
          {error ? <div className="workbench-error" role="alert">{error}</div> : null}
          {!loading && decision ? (
            <div className="investigation-stage-list">
              <div>
                <span>01</span>
                <strong>Evidence</strong>
                <small>{evidence?.summary?.interval_count ?? 0} intervals · {evidence?.summary?.warning_count ?? 0} warning</small>
                <StatusBadge tone="pass">AVAILABLE</StatusBadge>
              </div>
              <div>
                <span>02</span>
                <strong>Qualification</strong>
                <small>{blocked ? humanize(mainRule) : 'all required gates passed'}</small>
                <StatusBadge tone={blocked ? 'fail' : 'pass'}>{blocked ? 'BLOCKED' : 'PASS'}</StatusBadge>
              </div>
              <div>
                <span>03</span>
                <strong>Quantity</strong>
                <small>{blocked ? 'not executed after admission failure' : `${formatQuantity(justified)} admitted`}</small>
                <StatusBadge tone={blocked ? 'neutral' : 'pass'}>{blocked ? 'NOT RUN' : 'BOUNDED'}</StatusBadge>
              </div>
              <div>
                <span>04</span>
                <strong>Settlement</strong>
                <small>{blocked ? 'no claim exists to settle' : `${formatQuantity(covered)} covered · ${formatQuantity(shortfall)} shortfall`}</small>
                <StatusBadge tone={settlement?.result === 'SETTLED' ? 'pass' : settlement ? 'warn' : 'neutral'}>
                  {blocked ? 'UNAVAILABLE' : settlement?.result || 'RUNNING'}
                </StatusBadge>
              </div>
            </div>
          ) : null}
          <ValueFlow requested={requested} justified={justified} covered={covered} blocked={blocked} />
        </article>

        <article className="platform-panel investigation-answer">
          <header><span>Why / proof</span><h2>Current answer</h2></header>
          {!decision ? <EmptyState>No decision has resolved yet.</EmptyState> : (
            <>
              <div className={`platform-decision-mark ${blocked ? 'blocked' : 'admitted'}`}>
                {blocked ? <Ban size={25} /> : <Gauge size={25} />}
                <strong>{decision.decision.replaceAll('_', ' ')}</strong>
              </div>
              <dl className="platform-fact-list">
                <div><dt>Main rule</dt><dd>{humanize(mainRule)}</dd></div>
                <div><dt>Decision ID</dt><dd><code>{decision.decision_id}</code></dd></div>
                <div><dt>Evidence status</dt><dd>{activeRun.provenance.level}</dd></div>
                <div><dt>Boundary</dt><dd>{decision.boundary}</dd></div>
              </dl>
              {!blocked && settlement ? (
                <div className={`platform-settlement-callout ${settlement.result.toLowerCase()}`}>
                  {settlementIcon(settlement.result)}
                  <div><span>Settlement result</span><strong>{settlement.result}</strong></div>
                </div>
              ) : null}
              <div className="platform-action-stack">
                <LinkButton primary onClick={onOpenFullAnalysis}>Inspect every rule and ceiling</LinkButton>
                <LinkButton onClick={() => onNavigate({
                  section: 'verify',
                  tool: 'lineage',
                })}>Trace this result to its source</LinkButton>
              </div>
            </>
          )}
        </article>
      </section>

      <section className="platform-mission-strip" aria-label="Guided investigation missions">
        <div><Search size={17} /><strong>Try a research task</strong></div>
        {MISSIONS.map((mission) => (
          <button key={mission.id} type="button" onClick={() => runMission(mission)}>{mission.label}</button>
        ))}
      </section>
    </main>
  );
}
