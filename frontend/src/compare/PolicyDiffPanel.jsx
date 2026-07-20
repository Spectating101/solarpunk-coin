import React, { useMemo } from 'react';
import {
  ArrowRight,
  Braces,
  Check,
  GitCompareArrows,
  MinusCircle,
  PlusCircle,
  SlidersHorizontal,
} from 'lucide-react';

function stable(value) {
  return JSON.stringify(value ?? null);
}

function indexRules(rules = []) {
  return Object.fromEntries(rules.map((rule) => [rule.calculator_id, rule]));
}

function parameterChanges(before = {}, after = {}) {
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
  return keys
    .filter((key) => stable(before[key]) !== stable(after[key]))
    .map((key) => ({ key, before: before[key], after: after[key] }));
}

function diffRules(beforeRules, afterRules) {
  const before = indexRules(beforeRules);
  const after = indexRules(afterRules);
  const calculators = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
  return calculators.map((calculatorId) => {
    const beforeRule = before[calculatorId] || null;
    const afterRule = after[calculatorId] || null;
    if (!beforeRule) {
      return { calculatorId, status: 'ADDED', before: null, after: afterRule, parameterChanges: [] };
    }
    if (!afterRule) {
      return { calculatorId, status: 'REMOVED', before: beforeRule, after: null, parameterChanges: [] };
    }
    const changes = parameterChanges(beforeRule.parameters, afterRule.parameters);
    return {
      calculatorId,
      status: changes.length ? 'CHANGED' : 'UNCHANGED',
      before: beforeRule,
      after: afterRule,
      parameterChanges: changes,
    };
  });
}

export function diffPolicyManifests(baseline, comparison) {
  const admission = diffRules(baseline.admission_rules, comparison.admission_rules);
  const quantity = diffRules(baseline.quantity_rules, comparison.quantity_rules);
  const settlementChanges = parameterChanges(baseline.settlement, comparison.settlement);
  const governanceChanges = parameterChanges(baseline.governance, comparison.governance);
  const executable = [...admission, ...quantity];
  return {
    admission,
    quantity,
    settlementChanges,
    governanceChanges,
    summary: {
      added: executable.filter((row) => row.status === 'ADDED').length,
      removed: executable.filter((row) => row.status === 'REMOVED').length,
      changed: executable.filter((row) => row.status === 'CHANGED').length,
      unchanged: executable.filter((row) => row.status === 'UNCHANGED').length,
      metadataChanged: settlementChanges.length + governanceChanges.length,
    },
  };
}

function value(value) {
  if (value === undefined) return 'not declared';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

function StatusIcon({ status }) {
  if (status === 'ADDED') return <PlusCircle size={15} />;
  if (status === 'REMOVED') return <MinusCircle size={15} />;
  if (status === 'UNCHANGED') return <Check size={15} />;
  return <SlidersHorizontal size={15} />;
}

function RuleDiffRow({ row }) {
  return (
    <article className={`policy-diff-row ${row.status.toLowerCase()}`}>
      <div className="policy-diff-row-head">
        <span className="policy-diff-status"><StatusIcon status={row.status} /> {row.status}</span>
        <strong>{row.calculatorId.replaceAll('_', ' ').toLowerCase()}</strong>
        <code>{row.calculatorId}</code>
      </div>
      {row.status === 'ADDED' ? (
        <div className="policy-diff-single after">
          <small>Declared by comparison policy</small>
          <code>{row.after.rule_id}</code>
          <span>{value(row.after.parameters)}</span>
        </div>
      ) : null}
      {row.status === 'REMOVED' ? (
        <div className="policy-diff-single before">
          <small>Present only in baseline policy</small>
          <code>{row.before.rule_id}</code>
          <span>{value(row.before.parameters)}</span>
        </div>
      ) : null}
      {row.status === 'CHANGED' ? (
        <div className="policy-parameter-diff">
          {row.parameterChanges.map((change) => (
            <div key={change.key}>
              <strong>{change.key.replaceAll('_', ' ')}</strong>
              <span><small>Baseline</small><code>{value(change.before)}</code></span>
              <ArrowRight size={14} />
              <span><small>Comparison</small><code>{value(change.after)}</code></span>
            </div>
          ))}
        </div>
      ) : null}
      {row.status === 'UNCHANGED' ? (
        <div className="policy-diff-unchanged">
          Same calculator and parameters. Rule declarations: <code>{row.before.rule_id}</code> → <code>{row.after.rule_id}</code>.
        </div>
      ) : null}
    </article>
  );
}

function RuleSection({ title, rows }) {
  const changedRows = rows.filter((row) => row.status !== 'UNCHANGED');
  const unchangedRows = rows.filter((row) => row.status === 'UNCHANGED');
  return (
    <details className="policy-diff-rule-section">
      <summary>
        <div><span className="wb-section-label">Executable policy</span><h3>{title}</h3></div>
        <span>{changedRows.length} changed · {unchangedRows.length} shared</span>
      </summary>
      <div className="policy-diff-rule-list">
        {changedRows.map((row) => <RuleDiffRow key={row.calculatorId} row={row} />)}
        {unchangedRows.length ? (
          <details className="policy-diff-shared">
            <summary>{unchangedRows.length} unchanged calculator{unchangedRows.length === 1 ? '' : 's'}</summary>
            {unchangedRows.map((row) => <RuleDiffRow key={row.calculatorId} row={row} />)}
          </details>
        ) : null}
      </div>
    </details>
  );
}

function MetadataDiff({ label, changes }) {
  return (
    <article className="policy-metadata-diff">
      <span className="wb-section-label">{label}</span>
      {changes.length ? changes.map((change) => (
        <div key={change.key}>
          <strong>{change.key.replaceAll('_', ' ')}</strong>
          <span>{value(change.before)}</span>
          <ArrowRight size={13} />
          <span>{value(change.after)}</span>
        </div>
      )) : <p>No declared difference.</p>}
    </article>
  );
}

export default function PolicyDiffPanel({
  policies,
  baselinePolicyId,
  comparisonPolicyId,
  onChange,
}) {
  const policiesById = useMemo(() => Object.fromEntries(policies.map((policy) => [policy.id, policy])), [policies]);
  const baseline = policiesById[baselinePolicyId] || policies[0];
  const comparison = policiesById[comparisonPolicyId] || policies[1] || policies[0];
  const diff = useMemo(() => diffPolicyManifests(baseline, comparison), [baseline, comparison]);

  const change = (next) => {
    if (typeof onChange !== 'function') return;
    onChange({
      baselinePolicyId: next.baselinePolicyId || baseline.id,
      comparisonPolicyId: next.comparisonPolicyId || comparison.id,
    });
  };

  return (
    <section id="compare-policy-diff" className="policy-diff-panel" aria-labelledby="policy-diff-title">
      <header className="policy-diff-heading">
        <div>
          <span className="wb-kicker"><GitCompareArrows size={13} /> Policy manifest diff · versioned rule declarations</span>
          <h2 id="policy-diff-title">What changed in the policy before the outcomes changed?</h2>
          <p>Compare executable rule presence and parameters independently from any case result. Rule identity remains inspectable even when two policies happen to produce the same decision.</p>
        </div>
        <Braces size={24} aria-hidden />
      </header>

      <div className="policy-diff-controls">
        <label>
          <span>Baseline policy</span>
          <select value={baseline.id} onChange={(event) => change({ baselinePolicyId: event.target.value })}>
            {policies.map((policy) => <option key={policy.id} value={policy.id}>{policy.name}</option>)}
          </select>
          <code>{baseline.id}@{baseline.version}</code>
        </label>
        <ArrowRight size={19} aria-hidden />
        <label>
          <span>Comparison policy</span>
          <select value={comparison.id} onChange={(event) => change({ comparisonPolicyId: event.target.value })}>
            {policies.map((policy) => <option key={policy.id} value={policy.id}>{policy.name}</option>)}
          </select>
          <code>{comparison.id}@{comparison.version}</code>
        </label>
      </div>

      <div className="policy-diff-summary">
        <div className="added"><strong>{diff.summary.added}</strong><span>calculators added</span></div>
        <div className="removed"><strong>{diff.summary.removed}</strong><span>calculators removed</span></div>
        <div className="changed"><strong>{diff.summary.changed}</strong><span>parameter changes</span></div>
        <div className="unchanged"><strong>{diff.summary.unchanged}</strong><span>shared unchanged</span></div>
        <div className="metadata"><strong>{diff.summary.metadataChanged}</strong><span>governance/settlement changes</span></div>
      </div>

      <div className="policy-diff-description-grid">
        <article><span>Baseline intent</span><p>{baseline.description}</p></article>
        <article><span>Comparison intent</span><p>{comparison.description}</p></article>
      </div>

      <RuleSection title="Admission gates" rows={diff.admission} />
      <RuleSection title="Quantity ceilings" rows={diff.quantity} />

      <details className="policy-metadata-disclosure">
        <summary>
          <div><span className="wb-section-label">Declared metadata</span><h3>Settlement and governance declarations</h3></div>
          <span>{diff.summary.metadataChanged} changed field{diff.summary.metadataChanged === 1 ? '' : 's'}</span>
        </summary>
        <div className="policy-metadata-grid">
          <MetadataDiff label="Settlement declaration" changes={diff.settlementChanges} />
          <MetadataDiff label="Governance declaration" changes={diff.governanceChanges} />
        </div>
      </details>
    </section>
  );
}
