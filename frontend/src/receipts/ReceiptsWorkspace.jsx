import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Download,
  FileArchive,
  FileCheck2,
  Fingerprint,
  ShieldAlert,
} from 'lucide-react';
import { useCaseWorkbench } from '../app/CaseWorkbenchProvider';
import {
  decisionArtifactStem,
  decisionMemo,
  downloadJson,
  downloadText,
} from '../lib/caseWorkbenchRuntime';
import {
  buildResearchCapsule,
  downloadCapsuleBundle,
  downloadCapsuleFile,
} from '../lib/researchCapsule';

function label(value) {
  return String(value || '—').replaceAll('_', ' ').toLowerCase();
}

function ReceiptDetail({ run, receipt }) {
  const [capsule, setCapsule] = useState(null);
  const [capsuleError, setCapsuleError] = useState(null);

  useEffect(() => {
    let active = true;
    setCapsule(null);
    setCapsuleError(null);
    if (!run || !receipt) return undefined;
    buildResearchCapsule(run, receipt).then((value) => {
      if (active) setCapsule(value);
    }).catch((error) => {
      if (active) setCapsuleError(error?.message || String(error));
    });
    return () => { active = false; };
  }, [run?.decision?.decision_id, receipt?.evaluated_at]);

  if (!run || !receipt) return <div className="wb-lens-loading">Select a decision receipt.</div>;
  const artifactStem = decisionArtifactStem(run);

  return (
    <section className="receipt-detail">
      <div className="receipt-detail-header">
        <div>
          <span className="wb-kicker"><Fingerprint size={13} /> Decision receipt</span>
          <h2>{run.caseManifest.case_id} · {receipt.result.replaceAll('_', ' ')}</h2>
          <p>{run.decision.boundary}</p>
        </div>
        <code>{receipt.decision_id}</code>
      </div>

      <div className="receipt-action-row">
        <button type="button" onClick={() => downloadJson(`decision-receipt-${artifactStem}.json`, receipt)}>
          <Download size={15} /> Receipt JSON
        </button>
        <button type="button" onClick={() => downloadText(`decision-memo-${artifactStem}.md`, decisionMemo(run))}>
          <Download size={15} /> Decision memo
        </button>
        <button type="button" disabled={!capsule} onClick={() => capsule && downloadCapsuleBundle(capsule, run)}>
          <FileArchive size={15} /> Capsule bundle
        </button>
        <button
          type="button"
          disabled={!capsule}
          onClick={() => capsule && downloadCapsuleFile(`capsule-manifest-${artifactStem}.json`, capsule.files['capsule.json'], 'application/json')}
        >
          <Download size={15} /> Capsule manifest
        </button>
      </div>
      {capsuleError ? <div className="workbench-error" role="alert">{capsuleError}</div> : null}

      <div className="receipt-grid">
        <article>
          <span className="wb-section-label">Policy identity</span>
          <dl className="dossier-list wide">
            <div><dt>ID</dt><dd>{receipt.policy.id}</dd></div>
            <div><dt>Version</dt><dd>{receipt.policy.version}</dd></div>
            <div><dt>Assurance scenario</dt><dd>{run.scenario.scenario_id}</dd></div>
            <div><dt>Manifest hash</dt><dd><code>{receipt.policy.manifest_hash}</code></dd></div>
          </dl>
        </article>
        <article>
          <span className="wb-section-label">Runtime receipt</span>
          <dl className="dossier-list wide">
            <div><dt>Package</dt><dd>{receipt.runtime.package}</dd></div>
            <div><dt>Package version</dt><dd>{receipt.runtime.package_version}</dd></div>
            <div><dt>Source revision</dt><dd><code>{receipt.runtime.source_revision}</code></dd></div>
            <div><dt>Evaluated at</dt><dd>{receipt.evaluated_at}</dd></div>
          </dl>
        </article>
      </div>

      <section className="receipt-rule-section">
        <div className="constraint-section-heading">
          <div><span className="wb-section-label">Evaluated rules</span><h3>{receipt.evaluated_rules.length} deterministic evaluations</h3></div>
        </div>
        <div className="receipt-rule-list">
          {receipt.evaluated_rules.map((rule) => (
            <div key={rule.evaluation_id} className={`receipt-rule ${rule.status.toLowerCase()}`}>
              <span>{rule.status}</span>
              <strong>{rule.calculator_id}</strong>
              <code>{rule.calculator_version}</code>
              <small>{label(rule.constraint_class)}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="receipt-grid">
        <article>
          <span className="wb-section-label">Evidence receipt</span>
          {receipt.evidence.map((item) => (
            <div className="receipt-hash-block" key={item.hash}>
              <code>{item.hash}</code>
              <span>raw included: {String(item.raw_included)}</span>
            </div>
          ))}
        </article>
        <article>
          <span className="wb-section-label">Context receipt</span>
          {receipt.contexts.map((item) => (
            <div className="receipt-hash-block" key={item.hash}>
              <strong>{item.id}</strong>
              <code>{item.hash}</code>
            </div>
          ))}
        </article>
      </section>

      {capsule ? (
        <section className="capsule-manifest-panel">
          <div className="constraint-section-heading">
            <div><span className="wb-section-label">Research capsule</span><h3>{capsule.manifest.files.length} portable files</h3></div>
            <code>{capsule.manifest.capsule_id}</code>
          </div>
          <div className="capsule-file-list">
            {capsule.manifest.files.map((file) => (
              <div key={file.path}>
                <FileCheck2 size={15} />
                <strong>{file.path}</strong>
                <span>{file.bytes} bytes</span>
                <code>{file.sha256}</code>
              </div>
            ))}
          </div>
          <p>{capsule.manifest.data_boundary}</p>
        </section>
      ) : <div className="wb-lens-loading">Building capsule manifest and file hashes…</div>}
    </section>
  );
}

function RequestedReceiptState({ receiptId, routeContext, activeRun, reconstructing, onNavigate }) {
  if (reconstructing) {
    return (
      <section className="receipt-request-state" aria-live="polite" aria-busy="true">
        <Fingerprint size={24} />
        <h2>Reconstructing the requested decision.</h2>
        <p>The encoded case, policy, and assurance scenario are being evaluated before the receipt is displayed.</p>
        <code>{receiptId}</code>
      </section>
    );
  }

  const actualDecisionId = activeRun?.decision?.decision_id || null;
  return (
    <section className="receipt-request-state error" role="alert">
      <ShieldAlert size={24} />
      <h2>The requested receipt is not available.</h2>
      <p>
        Policy Lab will not silently substitute a different browser-session receipt. The encoded inputs
        either do not reconstruct this decision under the current runtime or the link lacks valid context.
      </p>
      <dl className="dossier-list wide">
        <div><dt>Requested decision</dt><dd><code>{receiptId}</code></dd></div>
        {actualDecisionId ? <div><dt>Reconstructed decision</dt><dd><code>{actualDecisionId}</code></dd></div> : null}
        {routeContext?.caseId ? <div><dt>Case</dt><dd>{routeContext.caseId}</dd></div> : null}
        {routeContext?.policyId ? <div><dt>Policy</dt><dd>{routeContext.policyId}</dd></div> : null}
        {routeContext?.scenarioId ? <div><dt>Scenario</dt><dd>{routeContext.scenarioId}</dd></div> : null}
      </dl>
      {routeContext?.caseId && typeof onNavigate === 'function' ? (
        <button type="button" className="wb-primary-action" onClick={() => onNavigate({
          section: 'case',
          id: routeContext.caseId,
          policyId: routeContext.policyId,
          scenarioId: routeContext.scenarioId,
          lens: 'constraints',
        })}>
          Inspect encoded decision inputs <ArrowRight size={15} />
        </button>
      ) : null}
    </section>
  );
}

export default function ReceiptsWorkspace({
  receiptId = null,
  routeContext = null,
  onOpenReceipt,
  onNavigate,
}) {
  const {
    pack,
    runsByKey,
    receiptsById,
    activeRun,
    activeCaseId,
    activePolicyId,
    activeScenarioId,
    selectCase,
    selectPolicy,
    selectScenario,
    loading,
  } = useCaseWorkbench();

  const contextValid = !routeContext || (
    (!routeContext.caseId || Boolean(pack.casesById[routeContext.caseId]))
    && (!routeContext.policyId || Boolean(pack.policiesById[routeContext.policyId]))
    && (!routeContext.scenarioId || Boolean(pack.scenariosById[routeContext.scenarioId]))
  );

  useEffect(() => {
    if (!routeContext || !contextValid) return;
    if (routeContext.caseId) selectCase(routeContext.caseId);
    if (routeContext.policyId) selectPolicy(routeContext.policyId);
    if (routeContext.scenarioId) selectScenario(routeContext.scenarioId);
  }, [routeContext?.caseId, routeContext?.policyId, routeContext?.scenarioId, contextValid, selectCase, selectPolicy, selectScenario]);

  const runByDecisionId = useMemo(() => Object.fromEntries(
    Object.values(runsByKey).map((run) => [run.decision.decision_id, run]),
  ), [runsByKey]);
  const receipts = useMemo(() => Object.values(receiptsById)
    .sort((a, b) => b.evaluated_at.localeCompare(a.evaluated_at)), [receiptsById]);
  const selectedId = receiptId || receipts[0]?.decision_id || null;
  const selectedRun = selectedId ? runByDecisionId[selectedId] : null;
  const selectedReceipt = selectedId ? receiptsById[selectedId] : null;
  const contextMatched = !routeContext || (
    (!routeContext.caseId || routeContext.caseId === activeCaseId)
    && (!routeContext.policyId || routeContext.policyId === activePolicyId)
    && (!routeContext.scenarioId || routeContext.scenarioId === activeScenarioId)
  );
  const reconstructing = Boolean(
    receiptId
    && routeContext
    && contextValid
    && (!contextMatched || loading || !activeRun),
  );

  if (receiptId || selectedId) {
    return (
      <main className="receipts-workspace" aria-labelledby="receipts-title">
        <section className="receipt-index-header">
          <div>
            <span className="wb-kicker"><FileCheck2 size={13} /> Receipts · decisions evaluated in this browser session</span>
            <h1 id="receipts-title">Share the decision identity, not a screenshot.</h1>
            <p>Receipts summarize deterministic decisions and runtime audit context. Durable links encode the case, policy, and assurance scenario; capsule exports exclude raw evidence rows by default.</p>
          </div>
        </section>
        <div className="receipts-layout">
          <aside className="receipt-index-list">
            <span className="wb-section-label">Session decision receipts</span>
            {receipts.map((receipt) => {
              const run = runByDecisionId[receipt.decision_id];
              return (
                <button
                  type="button"
                  key={receipt.decision_id}
                  className={selectedId === receipt.decision_id ? 'active' : ''}
                  onClick={() => run && typeof onOpenReceipt === 'function' && onOpenReceipt(run)}
                >
                  <span>
                    <strong>{receipt.case_id}</strong>
                    <small>{receipt.policy.id}</small>
                    <small>{run?.scenario?.scenario_id || 'scenario unavailable'}</small>
                  </span>
                  <code>{receipt.result}</code>
                  <small>{run?.decision.decision === 'BLOCKED'
                    ? label(run.decision.admission.blocking_rules[0])
                    : label(run?.decision.capacity.binding_constraints[0])}</small>
                  <ArrowRight size={14} />
                </button>
              );
            })}
          </aside>
          {selectedRun && selectedReceipt ? (
            <ReceiptDetail run={selectedRun} receipt={selectedReceipt} />
          ) : (
            <RequestedReceiptState
              receiptId={receiptId}
              routeContext={routeContext}
              activeRun={activeRun}
              reconstructing={reconstructing}
              onNavigate={onNavigate}
            />
          )}
        </div>
      </main>
    );
  }

  return <main className="receipts-workspace"><div className="wb-lens-loading">Evaluating canonical cases before receipts are available…</div></main>;
}
