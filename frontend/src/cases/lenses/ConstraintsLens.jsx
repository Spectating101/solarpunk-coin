import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Ban,
  Check,
  ChevronDown,
  Gauge,
  GitCompareArrows,
} from 'lucide-react';
import { useCaseWorkbench } from '../../app/CaseWorkbenchProvider';

function label(value) {
  return String(value || '—').replaceAll('_', ' ').toLowerCase();
}

function ConstraintDetail({ evaluation }) {
  if (!evaluation) return null;
  return (
    <div className="constraint-detail" role="region" aria-label={`${evaluation.calculator_id} rule detail`}>
      <div className="constraint-detail-head">
        <span>{evaluation.calculator_id}</span>
        <code>v{evaluation.calculator_version}</code>
      </div>
      <p>{evaluation.explanation}</p>
      <dl>
        <div><dt>Rule</dt><dd>{evaluation.policy_rule_id || '—'}</dd></div>
        <div><dt>Class</dt><dd>{label(evaluation.constraint_class)}</dd></div>
        <div><dt>Evaluation ID</dt><dd><code>{evaluation.evaluation_id}</code></dd></div>
        <div><dt>Parameters</dt><dd><code>{JSON.stringify(evaluation.parameters)}</code></dd></div>
        <div><dt>Observed inputs</dt><dd><code>{JSON.stringify(evaluation.observed_inputs)}</code></dd></div>
      </dl>
      {evaluation.assumptions?.length ? (
        <div className="constraint-detail-note"><strong>Assumptions</strong>{evaluation.assumptions.map((item) => <span key={item}>{item}</span>)}</div>
      ) : null}
      {evaluation.warnings?.length ? (
        <div className="constraint-detail-note warn"><strong>Warnings</strong>{evaluation.warnings.map((item) => <span key={item}>{item}</span>)}</div>
      ) : null}
      <small>{evaluation.boundary}</small>
    </div>
  );
}

export default function ConstraintsLens({ onSelectScenario = null }) {
  const {
    activeRun,
    activeScenarioId,
    pack,
    selectScenario,
  } = useCaseWorkbench();
  const [selectedEvaluationId, setSelectedEvaluationId] = useState(null);

  const selectedEvaluation = useMemo(() => {
    if (!activeRun || !selectedEvaluationId) return null;
    return [
      ...activeRun.decision.admission.evaluations,
      ...activeRun.decision.capacity.evaluations,
    ].find((item) => item.evaluation_id === selectedEvaluationId) || null;
  }, [activeRun, selectedEvaluationId]);

  if (!activeRun) return <div className="wb-lens-loading">Evaluating committed case…</div>;

  const { decision } = activeRun;
  const blocked = decision.decision === 'BLOCKED';
  const primaryRule = blocked
    ? decision.admission.blocking_rules[0]
    : decision.capacity.binding_constraints[0];
  const l2Scenario = pack.scenariosById['PROVENANCE-L2-COUNTERFACTUAL'];
  const previewL2 = () => {
    if (typeof onSelectScenario === 'function') {
      onSelectScenario(l2Scenario.scenario_id);
      return;
    }
    selectScenario(l2Scenario.scenario_id);
  };

  return (
    <div className="constraints-lens">
      <section className={`decision-explanation ${blocked ? 'blocked' : 'admitted'}`}>
        <span className="wb-kicker">Decision explanation</span>
        <h2>{blocked ? 'Why is this case blocked?' : `Why is this case limited to ${decision.capacity.admitted_maximum}?`}</h2>
        <p>
          {blocked
            ? `${activeRun.policy.name} evaluates admission before quantity. ${label(primaryRule)} blocked the case, so no quantity ceiling was calculated.`
            : `${activeRun.policy.name} admitted the case. The engine compared every applicable ceiling in ${decision.capacity.unit}; ${label(primaryRule)} was the lowest declared maximum.`}
        </p>
      </section>

      <section className="constraint-section">
        <div className="constraint-section-heading">
          <div>
            <span className="wb-section-label">Admission gates</span>
            <h3>{decision.admission.result}</h3>
          </div>
          <span className={`wb-status-pill ${blocked ? 'blocked' : 'pass'}`}>
            {blocked ? <Ban size={14} /> : <Check size={14} />}
            {blocked ? `${decision.admission.blocking_rules.length} blocking rule` : 'all gates passed'}
          </span>
        </div>

        <div className="constraint-rule-table">
          {decision.admission.evaluations.map((evaluation) => (
            <button
              type="button"
              key={evaluation.evaluation_id}
              className={`constraint-rule-row ${evaluation.status === 'BLOCK' ? 'blocking' : 'passing'}`}
              onClick={() => setSelectedEvaluationId(
                selectedEvaluationId === evaluation.evaluation_id ? null : evaluation.evaluation_id,
              )}
              aria-expanded={selectedEvaluationId === evaluation.evaluation_id}
            >
              <span className="constraint-rule-status">
                {evaluation.status === 'BLOCK' ? <Ban size={15} /> : <Check size={15} />}
                {evaluation.status}
              </span>
              <strong>{label(evaluation.calculator_id)} <code>{evaluation.calculator_id}</code></strong>
              <span>{evaluation.explanation}</span>
              <ChevronDown size={14} />
            </button>
          ))}
        </div>

        {selectedEvaluation?.constraint_class === 'ADMISSION_GATE' ? (
          <ConstraintDetail evaluation={selectedEvaluation} />
        ) : null}
      </section>

      {blocked ? (
        <section className="blocked-capacity-boundary">
          <div className="capacity-not-run">
            <Gauge size={19} />
            <span>
              <small>Quantity evaluation</small>
              <strong>NOT EXECUTED</strong>
            </span>
          </div>
          <p>
            A blocked admission cannot carry an admitted maximum or binding quantity ceiling. That
            distinction is enforced by the portable `DecisionResult` object rather than by UI convention.
          </p>
          {activeScenarioId !== l2Scenario.scenario_id ? (
            <button
              type="button"
              className="counterfactual-action"
              onClick={previewL2}
            >
              <GitCompareArrows size={17} />
              <span>
                <small>Counterfactual assurance scenario</small>
                <strong>Preview L2 without changing the evidence hash</strong>
              </span>
              <ArrowRight size={16} />
            </button>
          ) : null}
        </section>
      ) : (
        <section className="constraint-section quantity-section">
          <div className="constraint-section-heading">
            <div>
              <span className="wb-section-label">Quantity ceilings</span>
              <h3>{decision.capacity.admitted_maximum} <small>{decision.capacity.unit}</small></h3>
            </div>
            <span className="wb-status-pill binding"><Gauge size={14} /> {label(primaryRule)} binds</span>
          </div>

          <div className="quantity-ceiling-list">
            {decision.capacity.evaluations.map((evaluation) => {
              const isBinding = decision.capacity.binding_constraints.includes(evaluation.calculator_id);
              return (
                <button
                  type="button"
                  key={evaluation.evaluation_id}
                  className={`quantity-ceiling-row ${isBinding ? 'binding' : ''}`}
                  onClick={() => setSelectedEvaluationId(
                    selectedEvaluationId === evaluation.evaluation_id ? null : evaluation.evaluation_id,
                  )}
                  aria-expanded={selectedEvaluationId === evaluation.evaluation_id}
                >
                  <span>
                    <strong>{label(evaluation.calculator_id)}</strong>
                    <small>{isBinding ? 'binding ceiling' : 'non-binding ceiling'}</small>
                  </span>
                  <b>{evaluation.capacity}</b>
                  <code>{evaluation.unit}</code>
                  <ChevronDown size={14} />
                </button>
              );
            })}
          </div>

          {selectedEvaluation?.constraint_class === 'QUANTITY_CEILING' ? (
            <ConstraintDetail evaluation={selectedEvaluation} />
          ) : null}
        </section>
      )}

      <section className="decision-boundary-strip">
        <strong>Derived result</strong>
        <span>{decision.boundary}</span>
        <code>{decision.decision_id}</code>
      </section>
    </div>
  );
}
