import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Download,
  FileArchive,
  FileCheck2,
  Fingerprint,
} from 'lucide-react';
import { useCaseWorkbench } from '../app/CaseWorkbenchProvider';
import {
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
        <button type="button" onClick={() => downloadJson(`decision-receipt-${run.caseManifest.case_id.toLowerCase()}.json`, receipt)}>
          <Download size={15} /> Receipt JSON
        </button>
        <button type="button" onClick={() => downloadText(`decision-memo-${run.caseManifest.case_id.toLowerCase()}.md`, decisionMemo(run))}>
          <Download size={15} /> Decision memo
        </button>
        <button type="button" disabled={!capsule} onClick={() => capsule && downloadCapsuleBundle(capsule)}>
          <FileArchive size={15} /> Capsule bundle
        </button>
        <button
          type="button"
          disabled={!capsule}
          onClick={() => capsule && downloadCapsuleFile('capsule.json', capsule.files['capsule.json'], 'application/json')}
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

export default function ReceiptsWorkspace({ receiptId = null, onOpenReceipt }) {
  const {
    runsByKey,
    receiptsById,
  } = useCaseWorkbench();

  const runByDecisionId = useMemo(() => Object.fromEntries(
    Object.values(runsByKey).map((run) => [run.decision.decision_id, run]),
  ), [runsByKey]);
  const receipts = useMemo(() => Object.values(receiptsById)
    .sort((a, b) => b.evaluated_at.localeCompare(a.evaluated_at)), [receiptsById]);
  const selectedId = receiptId && receiptsById[receiptId]
    ? receiptId
    : receipts[0]?.decision_id || null;

  if (receiptId || selectedId) {
    return (
      <main className="receipts-workspace" aria-labelledby="receipts-title">
        <section className="receipt-index-header">
          <div>
            <span className="wb-kicker"><FileCheck2 size={13} /> Receipts · browser evaluation history</span>
            <h1 id="receipts-title">Share the decision identity, not a screenshot.</h1>
            <p>Receipts summarize the deterministic decision and runtime audit context. Capsule exports preserve portable research objects while excluding raw evidence rows by default.</p>
          </div>
        </section>
        <div className="receipts-layout">
          <aside className="receipt-index-list">
            <span className="wb-section-label">Evaluated decisions</span>
            {receipts.map((receipt) => {
              const run = runByDecisionId[receipt.decision_id];
              return (
                <button
                  type="button"
                  key={receipt.decision_id}
                  className={selectedId === receipt.decision_id ? 'active' : ''}
                  onClick={() => onOpenReceipt(receipt.decision_id)}
                >
                  <span><strong>{receipt.case_id}</strong><small>{receipt.policy.id}</small></span>
                  <code>{receipt.result}</code>
                  <small>{run?.decision.decision === 'BLOCKED'
                    ? label(run.decision.admission.blocking_rules[0])
                    : label(run?.decision.capacity.binding_constraints[0])}</small>
                  <ArrowRight size={14} />
                </button>
              );
            })}
          </aside>
          <ReceiptDetail run={runByDecisionId[selectedId]} receipt={receiptsById[selectedId]} />
        </div>
      </main>
    );
  }

  return <main className="receipts-workspace"><div className="wb-lens-loading">Evaluating canonical cases before receipts are available…</div></main>;
}
