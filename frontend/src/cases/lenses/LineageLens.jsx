import React from 'react';
import {
  ArrowDown,
  Braces,
  Calculator,
  FileCheck2,
  GitBranch,
  ScrollText,
} from 'lucide-react';
import { useCaseWorkbench } from '../../app/CaseWorkbenchProvider';

function LineageNode({ icon, kind, title, id, detail, semantic }) {
  return (
    <article className={`lineage-node ${semantic || ''}`}>
      <div className="lineage-node-icon">{icon}</div>
      <div>
        <span>{kind}</span>
        <strong>{title}</strong>
        <code>{id}</code>
        <p>{detail}</p>
      </div>
    </article>
  );
}

function Connector({ label = 'used by' }) {
  return <div className="lineage-connector"><ArrowDown size={15} /><span>{label}</span></div>;
}

export default function LineageLens() {
  const { activeRun, activeStress } = useCaseWorkbench();
  if (!activeRun) return <div className="wb-lens-loading">Resolving lineage…</div>;
  const { evidence, contexts, policy, provenance, decision } = activeRun;
  const evaluations = [
    ...decision.admission.evaluations,
    ...decision.capacity.evaluations,
  ];

  return (
    <div className="lineage-lens">
      <section className="decision-explanation admitted">
        <span className="wb-kicker">Decision lineage</span>
        <h2>Which declared objects and activities produced this result?</h2>
        <p>
          The graph is an inspection surface, not a blockchain claim. Hashes bind portable object
          identity; they do not prove the physical truth of a meter or the legal authority of an issuer.
        </p>
      </section>

      <div className="lineage-flow">
        <LineageNode
          icon={<FileCheck2 size={18} />}
          kind="CONTROLLED EVIDENCE FIXTURE"
          title={`${evidence.summary.interval_count} accepted intervals · ${evidence.summary.total_eligible_surplus_kwh} kWh`}
          id={evidence.evidence_hash}
          detail={`${evidence.adapter.id}@${evidence.adapter.version} · source ${evidence.source.kind}`}
          semantic="observed"
        />
        <Connector label="classified with declared assurance context" />
        <LineageNode
          icon={<GitBranch size={18} />}
          kind="ASSURANCE CLASSIFICATION"
          title={`${provenance.level} · ${provenance.label}`}
          id={activeRun.scenario.scenario_id}
          detail={activeRun.scenario.boundary}
          semantic="declared"
        />
        <Connector label="combined with" />
        {contexts.map((context) => (
          <React.Fragment key={context.context_id}>
            <LineageNode
              icon={<Braces size={18} />}
              kind="MODELED CONTEXT"
              title={context.label}
              id={context.context_hash}
              detail={`${context.source.provider} · ${context.temporal_semantics.kind} · ${context.values.annual_ac_kwh} annual modeled kWh`}
              semantic="modeled"
            />
            <Connector label="evaluated under declared policy" />
          </React.Fragment>
        ))}
        <LineageNode
          icon={<ScrollText size={18} />}
          kind="DECLARED POLICY"
          title={`${policy.id}@${policy.version}`}
          id={decision.policy_manifest_hash}
          detail={`${policy.admission_rules.length} admission rules · ${policy.quantity_rules.length} quantity rules`}
          semantic="declared"
        />
        <Connector label="executed deterministic calculators" />
        <section className="lineage-calculator-grid" aria-label="Constraint evaluations">
          {evaluations.map((evaluation) => (
            <LineageNode
              key={evaluation.evaluation_id}
              icon={<Calculator size={17} />}
              kind={evaluation.constraint_class}
              title={`${evaluation.calculator_id} · ${evaluation.status}`}
              id={evaluation.evaluation_id}
              detail={evaluation.explanation}
              semantic={evaluation.status === 'BLOCK' ? 'blocked' : 'derived'}
            />
          ))}
        </section>
        <Connector label="generated" />
        <LineageNode
          icon={<FileCheck2 size={18} />}
          kind="DERIVED RESULT"
          title={`${decision.decision}${decision.capacity.evaluated ? ` · ${decision.capacity.admitted_maximum} ${decision.capacity.unit}` : ''}`}
          id={decision.decision_id}
          detail={decision.boundary}
          semantic={decision.decision === 'BLOCKED' ? 'blocked' : 'derived'}
        />
        {activeStress?.available ? (
          <>
            <Connector label="bounded claim entered separate settlement evaluation" />
            <LineageNode
              icon={<Calculator size={18} />}
              kind="SETTLEMENT CONSTRAINT"
              title={`${activeStress.settlement.result} · ${activeStress.settlement.shortfall_quantity} ${activeStress.settlement.unit} shortfall`}
              id={activeStress.constraint.evaluation_id}
              detail={activeStress.constraint.explanation}
              semantic={activeStress.settlement.result === 'SETTLED' ? 'derived' : 'blocked'}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
