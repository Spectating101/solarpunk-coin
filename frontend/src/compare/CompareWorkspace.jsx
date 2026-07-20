import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  GitCompareArrows,
  ShieldAlert,
} from 'lucide-react';
import { useCaseWorkbench } from '../app/CaseWorkbenchProvider';
import ResponsiveDisclosure from '../components/ResponsiveDisclosure';
import SectionNavigator from '../components/SectionNavigator';
import PolicyDiffPanel from './PolicyDiffPanel';

const DEFAULT_BASELINE_POLICY_ID = 'LAB-CASE-OPEN-004';
const DEFAULT_COMPARISON_POLICY_ID = 'ENERGY-CASE-PILOT-005';

function label(value) {
  const normalized = String(value || '—').replaceAll('_', ' ').toLowerCase();
  return normalized === 'min provenance' ? 'minimum provenance' : normalized;
}

function cellSummary(run) {
  if (run.decision.decision === 'BLOCKED') {
    return {
      result: 'BLOCKED',
      rule: run.decision.admission.blocking_rules[0],
      capacity: null,
      tone: 'blocked',
    };
  }
  return {
    result: 'ADMIT WITH LIMIT',
    rule: run.decision.capacity.binding_constraints[0],
    capacity: run.decision.capacity.admitted_maximum,
    tone: run.decision.capacity.binding_constraints[0] === 'RESOURCE_CONTEXT_CAPACITY'
      ? 'modeled'
      : run.decision.capacity.binding_constraints[0] === 'PROVENANCE_POLICY_CAPACITY'
        ? 'policy'
        : 'derived',
  };
}

function transitionSummary(matrix) {
  if (!matrix.length) return [];
  const baselineIndex = 0;
  const counts = {
    unchanged: 0,
    blockToAdmit: 0,
    admitToBlock: 0,
    lowerCapacity: 0,
    higherCapacity: 0,
    bindingChanged: 0,
  };

  for (const row of matrix) {
    const baseline = row.runs[baselineIndex].decision;
    for (const run of row.runs.slice(1)) {
      const decision = run.decision;
      if (baseline.decision === decision.decision) counts.unchanged += 1;
      if (baseline.decision === 'BLOCKED' && decision.decision === 'ADMIT_WITH_LIMIT') counts.blockToAdmit += 1;
      if (baseline.decision === 'ADMIT_WITH_LIMIT' && decision.decision === 'BLOCKED') counts.admitToBlock += 1;
      if (baseline.capacity.evaluated && decision.capacity.evaluated) {
        if (decision.capacity.admitted_maximum < baseline.capacity.admitted_maximum) counts.lowerCapacity += 1;
        if (decision.capacity.admitted_maximum > baseline.capacity.admitted_maximum) counts.higherCapacity += 1;
        if (decision.capacity.binding_constraints.join('|') !== baseline.capacity.binding_constraints.join('|')) {
          counts.bindingChanged += 1;
        }
      }
    }
  }
  return [
    ['unchanged state', counts.unchanged],
    ['block → admit', counts.blockToAdmit],
    ['admit → block', counts.admitToBlock],
    ['lower admitted capacity', counts.lowerCapacity],
    ['higher admitted capacity', counts.higherCapacity],
    ['binding rule changed', counts.bindingChanged],
  ];
}

export default function CompareWorkspace({
  scenarioId = null,
  baselinePolicyId = null,
  comparisonPolicyId = null,
  onNavigate = null,
  onOpenDecision = null,
}) {
  const {
    pack,
    activeScenarioId,
    selectCase,
    selectPolicy,
    selectScenario,
    compare,
  } = useCaseWorkbench();
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resolvedBaselinePolicyId = pack.policiesById[baselinePolicyId]
    ? baselinePolicyId
    : DEFAULT_BASELINE_POLICY_ID;
  const resolvedComparisonPolicyId = pack.policiesById[comparisonPolicyId]
    ? comparisonPolicyId
    : DEFAULT_COMPARISON_POLICY_ID;
  const caseCount = pack.manifest.case_ids.length;
  const policyCount = pack.manifest.policy_ids.length;
  const decisionCount = caseCount * policyCount;

  useEffect(() => {
    if (scenarioId && scenarioId !== activeScenarioId) selectScenario(scenarioId);
  }, [scenarioId, activeScenarioId, selectScenario]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    compare({
      caseIds: pack.manifest.case_ids,
      policyIds: pack.manifest.policy_ids,
      scenarioId: activeScenarioId,
    }).then((rows) => {
      if (!active) return;
      setMatrix(rows);
      setLoading(false);
    }).catch((reason) => {
      if (!active) return;
      setError(reason?.message || String(reason));
      setLoading(false);
    });
    return () => { active = false; };
  }, [activeScenarioId, compare, pack.manifest.case_ids, pack.manifest.policy_ids]);

  const transitions = useMemo(() => transitionSummary(matrix), [matrix]);

  const navigateCompare = ({
    nextScenarioId = activeScenarioId,
    nextBaselinePolicyId = resolvedBaselinePolicyId,
    nextComparisonPolicyId = resolvedComparisonPolicyId,
  } = {}) => {
    if (typeof onNavigate !== 'function') return;
    onNavigate({
      section: 'compare',
      scenarioId: nextScenarioId,
      baselinePolicyId: nextBaselinePolicyId,
      comparisonPolicyId: nextComparisonPolicyId,
    });
  };

  const changeScenario = (nextScenarioId) => {
    if (!selectScenario(nextScenarioId)) return;
    navigateCompare({ nextScenarioId });
  };

  const changePolicyDiff = ({
    baselinePolicyId: nextBaselinePolicyId,
    comparisonPolicyId: nextComparisonPolicyId,
  }) => {
    navigateCompare({ nextBaselinePolicyId, nextComparisonPolicyId });
  };

  const openRun = (run) => {
    selectCase(run.caseManifest.case_id);
    selectPolicy(run.policy.id);
    selectScenario(run.scenario.scenario_id);
    if (typeof onNavigate === 'function') {
      onNavigate({
        section: 'case',
        id: run.caseManifest.case_id,
        policyId: run.policy.id,
        scenarioId: run.scenario.scenario_id,
        lens: 'constraints',
      });
      return;
    }
    if (typeof onOpenDecision === 'function') onOpenDecision(run.caseManifest.case_id);
  };

  return (
    <main className="compare-workspace" aria-labelledby="compare-title">
      <section className="case-explorer-hero compare-hero">
        <div>
          <span className="wb-kicker"><GitCompareArrows size={13} /> Compare · same declared assurance scenario</span>
          <h1 id="compare-title">Where do policies disagree—and what actually binds?</h1>
          <p>
            {decisionCount} deterministic decisions are evaluated from {caseCount} committed cases and {policyCount} V2 policies.
            The selected assurance scenario stays fixed so policy and case differences remain inspectable.
          </p>
        </div>
        <div className="wb-identity-card compare-scenario-card">
          <label className="wb-select-field">
            <span>Assurance scenario</span>
            <select value={activeScenarioId} onChange={(event) => changeScenario(event.target.value)}>
              {pack.scenarios.map((scenario) => (
                <option key={scenario.scenario_id} value={scenario.scenario_id}>{scenario.name}</option>
              ))}
            </select>
          </label>
          <strong>{activeScenarioId}</strong>
          <code>{caseCount} cases × {policyCount} policies</code>
          <small>Scenario and policy-diff state are encoded in the URL. Admission state is not called coverage.</small>
        </div>
      </section>

      <SectionNavigator
        label="Compare reading map"
        items={[
          { id: 'compare-policy-diff', label: 'Policy diff', meta: 'declared rules' },
          { id: 'compare-decision-matrix', label: 'Decision matrix', meta: `${decisionCount} decisions` },
          { id: 'compare-attribution', label: 'Attribution', meta: 'rules + transitions' },
          { id: 'compare-capacity', label: 'Capacity', meta: 'admitted only' },
        ]}
      />

      <PolicyDiffPanel
        policies={pack.policies}
        baselinePolicyId={resolvedBaselinePolicyId}
        comparisonPolicyId={resolvedComparisonPolicyId}
        onChange={changePolicyDiff}
      />

      {error ? <div className="workbench-error" role="alert"><ShieldAlert size={18} /> {error}</div> : null}
      {loading ? <div className="compare-loading" aria-live="polite">Evaluating comparison matrix…</div> : (
        <>
          <ResponsiveDisclosure
            id="compare-decision-matrix"
            label="Decision matrix"
            title="Case × policy decisions"
            meta={`${decisionCount} deterministic states`}
            defaultOpen
          >
            <section className="compare-panel">
              <div className="constraint-section-heading">
                <div><span className="wb-section-label">Decision matrix</span><h3>Case × policy</h3></div>
                <span className="case-map-boundary">click any cell to inspect its exact state</span>
              </div>
              <div className="wb-table-scroll">
                <table className="comparison-matrix" aria-label="Case policy decision matrix">
                  <thead>
                    <tr>
                      <th scope="col">Case</th>
                      {pack.policies.map((policy) => <th scope="col" key={policy.id}>{policy.id}<small>{policy.name}</small></th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.map((row) => (
                      <tr key={row.caseId}>
                        <th scope="row">{row.caseId}<small>{pack.casesById[row.caseId].subject.replace(' controlled energy case', '')}</small></th>
                        {row.runs.map((run) => {
                          const summary = cellSummary(run);
                          return (
                            <td key={run.key}>
                              <button type="button" className={`matrix-cell ${summary.tone}`} onClick={() => openRun(run)}>
                                <strong>{summary.result}</strong>
                                <span>{label(summary.rule)}</span>
                                <code>{summary.capacity == null ? 'quantity not evaluated' : `${summary.capacity} ${run.decision.capacity.unit}`}</code>
                                <ArrowRight size={14} />
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </ResponsiveDisclosure>

          <ResponsiveDisclosure
            id="compare-attribution"
            label="Blocking and binding"
            title="Primary attribution and policy transitions"
            meta="why the result moved"
          >
            <section className="compare-two-column">
              <article className="compare-panel">
                <div className="constraint-section-heading">
                  <div><span className="wb-section-label">Blocking / binding matrix</span><h3>Primary rule attribution</h3></div>
                </div>
                <div className="binding-matrix-grid">
                  <div className="binding-matrix-spacer" />
                  {pack.policies.map((policy) => <strong key={policy.id}>{policy.id.replace('ENERGY-CASE-', '').replace('LAB-CASE-', '')}</strong>)}
                  {matrix.flatMap((row) => [
                    <strong key={`${row.caseId}-label`}>{row.caseId}</strong>,
                    ...row.runs.map((run) => {
                      const summary = cellSummary(run);
                      return <span key={run.key} className={summary.tone}>{label(summary.rule)}</span>;
                    }),
                  ])}
                </div>
              </article>

              <article className="compare-panel">
                <div className="constraint-section-heading">
                  <div><span className="wb-section-label">Difference summary</span><h3>Compared with open policy</h3></div>
                </div>
                <div className="difference-summary-grid">
                  {transitions.map(([name, count]) => (
                    <div key={name}><strong>{count}</strong><span>{name}</span></div>
                  ))}
                </div>
                <p className="compare-method-note">
                  State transitions compare each pilot/strict decision with `LAB-CASE-OPEN-004` for the
                  same case and assurance scenario. Capacity and binding-rule differences are reported only
                  where both decisions reached quantity evaluation.
                </p>
              </article>
            </section>
          </ResponsiveDisclosure>

          <ResponsiveDisclosure
            id="compare-capacity"
            label="Capacity table"
            title="Admitted decisions only"
            meta="quantity-evaluated states"
          >
            <section className="compare-panel">
              <div className="constraint-section-heading">
                <div><span className="wb-section-label">Capacity table</span><h3>Admitted decisions only</h3></div>
              </div>
              <div className="wb-table-scroll">
                <table className="wb-data-table" aria-label="Admitted decision capacity table">
                  <thead><tr><th scope="col">Case</th><th scope="col">Policy</th><th scope="col">Decision ID</th><th scope="col">Admitted max</th><th scope="col">Binding ceiling</th></tr></thead>
                  <tbody>
                    {matrix.flatMap((row) => row.runs.filter((run) => run.decision.capacity.evaluated).map((run) => (
                      <tr key={run.key}>
                        <td><strong>{run.caseManifest.case_id}</strong></td>
                        <td>{run.policy.id}</td>
                        <td><code>{run.decision.decision_id.slice(0, 16)}…</code></td>
                        <td>{run.decision.capacity.admitted_maximum} {run.decision.capacity.unit}</td>
                        <td>{label(run.decision.capacity.binding_constraints.join(', '))}</td>
                      </tr>
                    ))) }
                  </tbody>
                </table>
              </div>
            </section>
          </ResponsiveDisclosure>
        </>
      )}
    </main>
  );
}
