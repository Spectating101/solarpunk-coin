import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CircleDot,
  Database,
  MapPinned,
  ShieldAlert,
} from 'lucide-react';
import { useCaseWorkbench } from '../app/CaseWorkbenchProvider';

const LAYERS = [
  { id: 'decision', label: 'Decision' },
  { id: 'binding', label: 'Blocking / binding rule' },
  { id: 'capacity', label: 'Admitted maximum' },
  { id: 'assurance', label: 'Evidence assurance' },
];

function formatRule(value) {
  return String(value || '—').replaceAll('_', ' ').toLowerCase();
}

function pointPosition(caseManifest) {
  const latitude = Number(caseManifest.spatial_identity?.latitude || 0);
  const longitude = Number(caseManifest.spatial_identity?.longitude || 0);
  return {
    left: `${((longitude + 180) / 360) * 100}%`,
    top: `${((90 - latitude) / 180) * 100}%`,
  };
}

function pointValue(run, layer) {
  if (!run) return 'pending';
  if (layer === 'decision') return run.decision.decision;
  if (layer === 'capacity') {
    return run.decision.capacity.evaluated
      ? `${run.decision.capacity.admitted_maximum}`
      : 'blocked';
  }
  if (layer === 'assurance') return run.provenance.level;
  return run.decision.decision === 'BLOCKED'
    ? run.decision.admission.blocking_rules[0]
    : run.decision.capacity.binding_constraints[0];
}

function pointTone(run) {
  if (!run) return 'pending';
  if (run.decision.decision === 'BLOCKED') return 'blocked';
  const binding = run.decision.capacity.binding_constraints[0];
  if (binding === 'RESOURCE_CONTEXT_CAPACITY') return 'modeled';
  if (binding === 'PROVENANCE_POLICY_CAPACITY') return 'policy';
  return 'derived';
}

export default function CaseExplorer({ onOpenCase }) {
  const {
    pack,
    activeCaseId,
    activePolicyId,
    activeScenarioId,
    visibleRunsByCaseId,
    selectCase,
    loading,
  } = useCaseWorkbench();
  const [layer, setLayer] = useState('binding');
  const [statusFilter, setStatusFilter] = useState('all');

  const activeCase = pack.casesById[activeCaseId];
  const activeRun = visibleRunsByCaseId[activeCaseId];
  const counts = useMemo(() => {
    const runs = Object.values(visibleRunsByCaseId).filter(Boolean);
    return {
      all: pack.manifest.case_ids.length,
      blocked: runs.filter((run) => run.decision.decision === 'BLOCKED').length,
      admitted: runs.filter((run) => run.decision.decision === 'ADMIT_WITH_LIMIT').length,
    };
  }, [pack.manifest.case_ids.length, visibleRunsByCaseId]);

  const visibleCases = pack.cases.filter((caseManifest) => {
    if (statusFilter === 'all') return true;
    const run = visibleRunsByCaseId[caseManifest.case_id];
    if (!run) return false;
    if (statusFilter === 'blocked') return run.decision.decision === 'BLOCKED';
    return run.decision.decision === 'ADMIT_WITH_LIMIT';
  });

  return (
    <main className="case-explorer" aria-labelledby="case-explorer-title">
      <section className="case-explorer-hero">
        <div>
          <span className="wb-kicker"><CircleDot size={13} /> Case workbench · controlled energy pack</span>
          <h1 id="case-explorer-title">Investigate the rule that blocks or bounds the case.</h1>
          <p>
            The same committed case pack is evaluated through explicit policy rules. Modeled resource
            context remains separate from controlled evidence; higher-assurance scenarios are declared
            counterfactuals, not silent evidence upgrades.
          </p>
        </div>
        <div className="wb-identity-card" aria-label="Current evaluation identity">
          <span>Current evaluation</span>
          <strong>{activePolicyId}</strong>
          <code>{activeScenarioId}</code>
          <small>{pack.manifest.case_ids.length} canonical cases · empirical claim: no</small>
        </div>
      </section>

      <section className="case-explorer-grid">
        <aside className="case-filter-panel" aria-label="Case filters and accessible case list">
          <div className="wb-section-label">Investigation</div>
          <div className="case-status-filters" role="group" aria-label="Case status filter">
            {[
              ['all', 'All', counts.all],
              ['blocked', 'Blocked', counts.blocked],
              ['admitted', 'Admitted', counts.admitted],
            ].map(([id, label, count]) => (
              <button
                type="button"
                key={id}
                className={statusFilter === id ? 'case-filter active' : 'case-filter'}
                onClick={() => setStatusFilter(id)}
                aria-pressed={statusFilter === id}
              >
                <span>{label}</span><strong>{loading ? '…' : count}</strong>
              </button>
            ))}
          </div>

          <div className="wb-section-label">Map layer</div>
          <label className="case-layer-select">
            <span>Decision surface</span>
            <select value={layer} onChange={(event) => setLayer(event.target.value)}>
              {LAYERS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>

          <div className="wb-section-label">Cases</div>
          <div className="case-accessible-list">
            {visibleCases.map((caseManifest) => {
              const run = visibleRunsByCaseId[caseManifest.case_id];
              return (
                <button
                  type="button"
                  key={caseManifest.case_id}
                  className={activeCaseId === caseManifest.case_id ? 'case-list-item active' : 'case-list-item'}
                  onClick={() => selectCase(caseManifest.case_id)}
                >
                  <span>
                    <strong>{caseManifest.case_id}</strong>
                    <small>{caseManifest.subject.replace(' controlled energy case', '')}</small>
                  </span>
                  <code>{pointValue(run, layer)}</code>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="case-map-panel" aria-label="Linked spatial case surface">
          <div className="case-map-header">
            <div>
              <span className="wb-section-label"><MapPinned size={13} /> Linked case surface</span>
              <strong>{LAYERS.find((item) => item.id === layer)?.label}</strong>
            </div>
            <span className="case-map-boundary">modeled location · analytical link</span>
          </div>
          <div className="case-map-world" aria-hidden="true">
            <div className="case-map-grid-lines" />
            {visibleCases.map((caseManifest) => {
              const run = visibleRunsByCaseId[caseManifest.case_id];
              const position = pointPosition(caseManifest);
              return (
                <button
                  type="button"
                  tabIndex={-1}
                  key={caseManifest.case_id}
                  className={`case-map-point ${pointTone(run)} ${activeCaseId === caseManifest.case_id ? 'active' : ''}`}
                  style={position}
                  onClick={() => selectCase(caseManifest.case_id)}
                >
                  <i />
                  <span>{caseManifest.case_id}</span>
                  <code>{pointValue(run, layer)}</code>
                </button>
              );
            })}
          </div>
          <div className="case-map-legend">
            <span><i className="blocked" /> blocked</span>
            <span><i className="policy" /> policy-bound</span>
            <span><i className="modeled" /> modeled-context-bound</span>
            <span><i className="derived" /> evidence/derived-bound</span>
          </div>
        </section>

        <aside className="active-case-preview" aria-live="polite">
          <div className="wb-section-label">Active case</div>
          <div className="active-case-title">
            <span>{activeCase.case_id}</span>
            <h2>{activeCase.subject.replace(' controlled energy case', '')}</h2>
            <code>
              {activeCase.spatial_identity.latitude.toFixed(4)}, {activeCase.spatial_identity.longitude.toFixed(4)}
            </code>
          </div>

          {activeRun ? (
            <>
              <div className={`active-decision-state ${activeRun.decision.decision === 'BLOCKED' ? 'blocked' : 'admitted'}`}>
                {activeRun.decision.decision === 'BLOCKED' ? <ShieldAlert size={18} /> : <Database size={18} />}
                <span>
                  <small>Decision</small>
                  <strong>{activeRun.decision.decision.replaceAll('_', ' ')}</strong>
                </span>
              </div>
              <dl className="active-case-facts">
                <div><dt>Assurance</dt><dd>{activeRun.provenance.level}</dd></div>
                <div><dt>Eligible surplus</dt><dd>{activeRun.evidence.summary.total_eligible_surplus_kwh} kWh</dd></div>
                <div>
                  <dt>{activeRun.decision.decision === 'BLOCKED' ? 'Blocking rule' : 'Binding ceiling'}</dt>
                  <dd>{formatRule(
                    activeRun.decision.decision === 'BLOCKED'
                      ? activeRun.decision.admission.blocking_rules[0]
                      : activeRun.decision.capacity.binding_constraints[0],
                  )}</dd>
                </div>
                <div><dt>Admitted max</dt><dd>{activeRun.decision.capacity.evaluated ? activeRun.decision.capacity.admitted_maximum : 'not evaluated'}</dd></div>
              </dl>
            </>
          ) : <div className="case-preview-loading">Evaluating committed case…</div>}

          <div className="case-semantic-boundary">
            <span>Observed / fixture evidence</span>
            <span>Modeled TMY context</span>
            <span>Declared policy</span>
            <span>Derived decision</span>
          </div>

          <button type="button" className="wb-primary-action" onClick={() => onOpenCase(activeCase.case_id)}>
            Open case <ArrowRight size={16} />
          </button>
        </aside>
      </section>
    </main>
  );
}
