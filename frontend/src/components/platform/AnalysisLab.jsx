import React, { useEffect, useState } from 'react';
import {
  BookmarkCheck,
  Gauge,
  GitCompareArrows,
  MapPinned,
} from 'lucide-react';
import CaseExplorer from '../../cases/CaseExplorer';
import CompareWorkspace from '../../compare/CompareWorkspace';
import { useCaseWorkbench } from '../../app/CaseWorkbenchProvider';
import {
  EmptyState,
  LinkButton,
  PlatformPageIntro,
  StatusBadge,
  formatQuantity,
  humanize,
} from './PlatformSurface';

const TABS = [
  ['cases', 'Cases', MapPinned],
  ['compare', 'Compare', GitCompareArrows],
  ['stress', 'Stress', Gauge],
  ['saved', 'Saved investigations', BookmarkCheck],
];

const SAVED = [
  ['TYN L0 blocked', 'TYN-001', 'ENERGY-CASE-PILOT-005', 'PROVENANCE-L0-BASE', 'constraints'],
  ['TYN L2 pilot admitted', 'TYN-001', 'ENERGY-CASE-PILOT-005', 'PROVENANCE-L2-COUNTERFACTUAL', 'constraints'],
  ['TYN partial settlement', 'TYN-001', 'ENERGY-CASE-PILOT-005', 'PROVENANCE-L2-COUNTERFACTUAL', 'stress'],
  ['AUS resource-constrained', 'AUS-001', 'ENERGY-CASE-PILOT-005', 'PROVENANCE-L2-COUNTERFACTUAL', 'constraints'],
  ['OPS unsigned-source block', 'OPS-001', 'ENERGY-CASE-PILOT-005', 'PROVENANCE-L0-BASE', 'evidence'],
];

export default function AnalysisLab({ initialTool = 'cases', onNavigate }) {
  const [tool, setTool] = useState(initialTool || 'cases');
  const {
    activeRun,
    activeStress,
    settlementMultiplier,
    setSettlementMultiplier,
  } = useCaseWorkbench();

  useEffect(() => setTool(initialTool || 'cases'), [initialTool]);

  const decision = activeRun?.decision || null;
  const blocked = decision?.decision === 'BLOCKED';
  const settlement = activeStress?.available ? activeStress.settlement : null;

  return (
    <div className="analysis-lab-shell">
      <section className="platform-page analysis-lab-intro" aria-label="Analysis Lab introduction">
        <PlatformPageIntro
          kicker="Shared workspace · cases, comparison, and stress"
          title="Analyse a decision without fragmenting the inquiry across separate pages."
          description="Find a case, hold one dimension constant, compare policies, replay settlement stress, and preserve useful investigation states from one consolidated workspace."
          viewMode="full"
        >
          <LinkButton onClick={() => onNavigate({ section: 'verify', tool: 'lineage' })}>Verify selected result</LinkButton>
        </PlatformPageIntro>

        <nav className="platform-tool-tabs" aria-label="Analysis Lab tools">
          {TABS.map(([id, label, Icon]) => (
            <button key={id} type="button" className={tool === id ? 'active' : ''} onClick={() => setTool(id)}>
              <Icon size={16} /><span>{label}</span>
            </button>
          ))}
        </nav>
      </section>

      {tool === 'cases' ? (
        <CaseExplorer onOpenCase={(caseId) => onNavigate({ section: 'case', id: caseId })} />
      ) : null}

      {tool === 'compare' ? (
        <CompareWorkspace
          scenarioId="PROVENANCE-L2-COUNTERFACTUAL"
          baselinePolicyId="LAB-CASE-OPEN-004"
          comparisonPolicyId="ENERGY-CASE-PILOT-005"
          onNavigate={onNavigate}
        />
      ) : null}

      {tool === 'stress' ? (
        <main className="platform-page analysis-stress-workspace">
          <section className="platform-three-column">
            <article className="platform-panel">
              <header><span>Selected decision</span><h2>{activeRun?.caseManifest?.case_id || 'Resolving case'}</h2></header>
              {!decision ? <EmptyState>Resolving the active case decision…</EmptyState> : (
                <dl className="platform-fact-list">
                  <div><dt>Result</dt><dd>{decision.decision.replaceAll('_', ' ')}</dd></div>
                  <div><dt>Main rule</dt><dd>{humanize(blocked ? decision.admission.blocking_rules[0] : decision.capacity.binding_constraints[0])}</dd></div>
                  <div><dt>Admitted maximum</dt><dd>{blocked ? 'not evaluated' : formatQuantity(decision.capacity.admitted_maximum)}</dd></div>
                  <div><dt>Decision ID</dt><dd><code>{decision.decision_id}</code></dd></div>
                </dl>
              )}
            </article>

            <article className="platform-panel">
              <header><span>Change one condition</span><h2>Settlement capacity</h2></header>
              <label className="analysis-stress-slider">
                <strong>{Math.round(settlementMultiplier * 100)}%</strong>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settlementMultiplier}
                  disabled={blocked}
                  onChange={(event) => setSettlementMultiplier(event.target.value)}
                />
              </label>
              <p className="platform-control-note">The decision ID, policy, evidence, and admitted quantity remain unchanged. Only declared settlement capacity moves.</p>
            </article>

            <article className="platform-panel">
              <header><span>Stress result</span><h2>{blocked ? 'Unavailable after block' : settlement?.result || 'Running'}</h2></header>
              {blocked ? (
                <EmptyState>No bounded claim exists, so the lab will not fabricate a settlement result.</EmptyState>
              ) : settlement ? (
                <>
                  <div className="analysis-stress-metrics">
                    <div><span>Outstanding</span><strong>{formatQuantity(settlement.outstanding_claim_quantity)}</strong></div>
                    <div><span>Capacity</span><strong>{formatQuantity(settlement.settlement_capacity)}</strong></div>
                    <div><span>Covered</span><strong>{formatQuantity(settlement.covered_quantity)}</strong></div>
                    <div><span>Shortfall</span><strong>{formatQuantity(settlement.shortfall_quantity)}</strong></div>
                  </div>
                  <StatusBadge tone={settlement.result === 'SETTLED' ? 'pass' : 'warn'}>{settlement.result}</StatusBadge>
                </>
              ) : <EmptyState>Running the declared stress scenario…</EmptyState>}
            </article>
          </section>
        </main>
      ) : null}

      {tool === 'saved' ? (
        <main className="platform-page saved-investigations">
          <section className="platform-panel">
            <header><span>Saved investigations</span><h2>Open a meaningful state, not an empty workspace.</h2></header>
            <div className="saved-investigation-grid">
              {SAVED.map(([label, caseId, policyId, scenarioId, lens]) => (
                <button key={label} type="button" onClick={() => onNavigate({ section: 'case', id: caseId, policyId, scenarioId, lens })}>
                  <strong>{label}</strong>
                  <span>{caseId}</span>
                  <small>{policyId} · {scenarioId}</small>
                </button>
              ))}
            </div>
          </section>
        </main>
      ) : null}
    </div>
  );
}
