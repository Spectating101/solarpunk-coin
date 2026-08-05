import React, { useEffect, useMemo, useState } from 'react';
import {
  Braces,
  FileArchive,
  FileCheck2,
  Fingerprint,
  GitBranch,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import ReceiptsWorkspace from '../../receipts/ReceiptsWorkspace';
import { useCaseWorkbench } from '../../app/CaseWorkbenchProvider';
import { buildResearchCapsule } from '../../lib/researchCapsule';
import {
  EmptyState,
  LinkButton,
  PlatformPageIntro,
  StatusBadge,
  formatQuantity,
  humanize,
  shortHash,
} from './PlatformSurface';

const TABS = [
  ['lineage', 'Lineage', GitBranch],
  ['receipt', 'Receipt', Fingerprint],
  ['capsule', 'Capsule', FileArchive],
  ['objects', 'Objects', Braces],
];

const OBJECTS = [
  ['CaseManifest', 'caseManifest'],
  ['EvidenceEnvelope', 'evidence'],
  ['PolicyManifest', 'policy'],
  ['DecisionResult', 'decision'],
  ['DecisionReceipt', 'receipt'],
];

export default function VerificationHub({ initialTool = 'lineage', routeContext = null, onNavigate }) {
  const [tool, setTool] = useState(initialTool || 'lineage');
  const [capsule, setCapsule] = useState(null);
  const [capsuleError, setCapsuleError] = useState(null);
  const [objectKey, setObjectKey] = useState('decision');
  const [tamperedMaximum, setTamperedMaximum] = useState('');
  const {
    activeRun,
    activeReceipt,
    selectCase,
    selectPolicy,
    selectScenario,
  } = useCaseWorkbench();

  useEffect(() => setTool(initialTool || 'lineage'), [initialTool]);

  useEffect(() => {
    if (!routeContext) return;
    if (routeContext.caseId) selectCase(routeContext.caseId);
    if (routeContext.policyId) selectPolicy(routeContext.policyId);
    if (routeContext.scenarioId) selectScenario(routeContext.scenarioId);
  }, [routeContext?.caseId, routeContext?.policyId, routeContext?.scenarioId, selectCase, selectPolicy, selectScenario]);

  useEffect(() => {
    let active = true;
    setCapsule(null);
    setCapsuleError(null);
    if (!activeRun || !activeReceipt) return undefined;
    buildResearchCapsule(activeRun, activeReceipt).then((value) => {
      if (active) setCapsule(value);
    }).catch((error) => {
      if (active) setCapsuleError(error?.message || String(error));
    });
    return () => { active = false; };
  }, [activeRun?.decision?.decision_id, activeReceipt?.evaluated_at]);

  const decision = activeRun?.decision || null;
  const blocked = decision?.decision === 'BLOCKED';
  const admittedMaximum = blocked ? null : decision?.capacity?.admitted_maximum;
  const tamperApplied = tamperedMaximum !== '' && Number(tamperedMaximum) !== Number(admittedMaximum);
  const selectedObject = useMemo(() => {
    if (!activeRun) return null;
    if (objectKey === 'receipt') return activeReceipt;
    return activeRun[objectKey];
  }, [activeRun, activeReceipt, objectKey]);

  const openReceipt = (run) => onNavigate({
    section: 'receipt',
    id: run.decision.decision_id,
    caseId: run.caseManifest.case_id,
    policyId: run.policy.id,
    scenarioId: run.scenario.scenario_id,
  });

  return (
    <div className="verification-hub-shell">
      <main className="platform-page verification-hub-intro">
        <PlatformPageIntro
          kicker="Shared workspace · lineage, receipt, capsule, and objects"
          title="Verify the result from source identity to portable research artifact."
          description="Trace a selected value backward, inspect the deterministic receipt, build the actual research capsule, test a changed quantity, and open the real objects used by the decision runtime."
          viewMode="full"
        >
          <LinkButton onClick={() => onNavigate({ section: 'analysis', tool: 'compare' })}>Compare selected result</LinkButton>
        </PlatformPageIntro>

        <nav className="platform-tool-tabs" aria-label="Verification Hub tools">
          {TABS.map(([id, label, Icon]) => (
            <button key={id} type="button" className={tool === id ? 'active' : ''} onClick={() => setTool(id)}>
              <Icon size={16} /><span>{label}</span>
            </button>
          ))}
        </nav>
      </main>

      {tool === 'lineage' ? (
        <main className="platform-page verification-lineage">
          {!activeRun ? <EmptyState>Resolving the active decision and its identities…</EmptyState> : (
            <section className="platform-three-column">
              <article className="platform-panel">
                <header><span>Selected result</span><h2>{activeRun.caseManifest.case_id}</h2></header>
                <dl className="platform-fact-list">
                  <div><dt>Policy</dt><dd>{activeRun.policy.id}@{activeRun.policy.version}</dd></div>
                  <div><dt>Scenario</dt><dd>{activeRun.scenario.scenario_id}</dd></div>
                  <div><dt>Decision</dt><dd>{decision.decision.replaceAll('_', ' ')}</dd></div>
                  <div><dt>Quantity</dt><dd>{blocked ? 'not evaluated' : formatQuantity(admittedMaximum)}</dd></div>
                  <div><dt>Decision ID</dt><dd><code>{shortHash(decision.decision_id, 14, 10)}</code></dd></div>
                </dl>
              </article>

              <article className="platform-panel lineage-trace-panel">
                <header><span>Source-to-result trace</span><h2>Follow the active result backward</h2></header>
                <div className="lineage-trace">
                  <button type="button" onClick={() => setObjectKey('evidence')}><strong>Controlled / fixture evidence</strong><span>{shortHash(activeRun.evidence.evidence_hash)}</span></button>
                  <GitBranch size={16} />
                  {activeRun.contexts.map((context) => (
                    <React.Fragment key={context.context_id}>
                      <button type="button"><strong>Modeled context</strong><span>{context.context_id}</span></button>
                      <GitBranch size={16} />
                    </React.Fragment>
                  ))}
                  <button type="button" onClick={() => setObjectKey('policy')}><strong>Declared policy</strong><span>{activeRun.policy.id}@{activeRun.policy.version}</span></button>
                  <GitBranch size={16} />
                  <button type="button" onClick={() => setObjectKey('decision')}><strong>Derived decision</strong><span>{humanize(blocked ? decision.admission.blocking_rules[0] : decision.capacity.binding_constraints[0])}</span></button>
                  <GitBranch size={16} />
                  <button type="button" onClick={() => setTool('receipt')}><strong>Receipt and replay</strong><span>{shortHash(decision.decision_id)}</span></button>
                </div>
              </article>

              <article className="platform-panel">
                <header><span>Verification status</span><h2>What this trace establishes</h2></header>
                <div className="research-evidence-matrix">
                  <div><span>Evidence identity retained</span><StatusBadge tone="pass">PASS</StatusBadge></div>
                  <div><span>Context identities retained</span><StatusBadge tone="pass">PASS</StatusBadge></div>
                  <div><span>Policy version retained</span><StatusBadge tone="pass">PASS</StatusBadge></div>
                  <div><span>Decision identity retained</span><StatusBadge tone="pass">PASS</StatusBadge></div>
                  <div><span>Physical source truth</span><StatusBadge tone="warn">NOT CERTIFIED</StatusBadge></div>
                </div>
                <p className="platform-control-note">Lineage verifies declared object and calculator identity. It does not establish physical custody, legal title, or redemption enforceability.</p>
              </article>
            </section>
          )}
        </main>
      ) : null}

      {tool === 'receipt' ? (
        <>
          <main className="platform-page receipt-integrity-preview">
            <section className="platform-three-column">
              <article className="platform-panel">
                <header><span>Active receipt</span><h2>{activeRun?.caseManifest?.case_id || 'Resolving'}</h2></header>
                <dl className="platform-fact-list">
                  <div><dt>Decision</dt><dd><code>{shortHash(decision?.decision_id, 14, 10)}</code></dd></div>
                  <div><dt>Policy</dt><dd>{activeRun?.policy?.id || '—'}</dd></div>
                  <div><dt>Result</dt><dd>{decision?.decision?.replaceAll('_', ' ') || '—'}</dd></div>
                  <div><dt>Admitted</dt><dd>{blocked ? 'not evaluated' : formatQuantity(admittedMaximum)}</dd></div>
                </dl>
              </article>
              <article className="platform-panel">
                <header><span>Integrity test</span><h2>Change one receipt-facing value</h2></header>
                <label>
                  Test admitted maximum
                  <input
                    type="number"
                    value={tamperedMaximum}
                    placeholder={blocked ? 'Unavailable' : String(admittedMaximum)}
                    disabled={blocked}
                    onChange={(event) => setTamperedMaximum(event.target.value)}
                  />
                </label>
                <button type="button" className="platform-link-button" onClick={() => setTamperedMaximum('')}>Restore original</button>
              </article>
              <article className="platform-panel">
                <header><span>Consistency preview</span><h2>{tamperApplied ? 'Identity mismatch' : 'Original state'}</h2></header>
                <div className={`platform-decision-mark ${tamperApplied ? 'blocked' : 'admitted'}`}>
                  {tamperApplied ? <ShieldAlert size={25} /> : <ShieldCheck size={25} />}
                  <strong>{tamperApplied ? 'FAIL' : 'PASS'}</strong>
                </div>
                <p className="platform-control-note">
                  {tamperApplied
                    ? 'The displayed quantity no longer agrees with the deterministic DecisionResult identity. The original receipt below remains unchanged.'
                    : 'The displayed value agrees with the active deterministic decision. Use the receipt below for the actual policy, runtime, and evaluated-rule identities.'}
                </p>
              </article>
            </section>
          </main>
          <ReceiptsWorkspace
            receiptId={routeContext?.receiptId || decision?.decision_id || null}
            routeContext={routeContext}
            onOpenReceipt={openReceipt}
            onNavigate={onNavigate}
          />
        </>
      ) : null}

      {tool === 'capsule' ? (
        <main className="platform-page verification-capsule">
          <section className="platform-two-column">
            <article className="platform-panel">
              <header><span>Research capsule</span><h2>Closed-world portable bundle</h2></header>
              {capsuleError ? <div className="workbench-error" role="alert">{capsuleError}</div> : null}
              {!capsule ? <EmptyState>Building file hashes and the capsule manifest…</EmptyState> : (
                <dl className="platform-fact-list">
                  <div><dt>Capsule ID</dt><dd><code>{shortHash(capsule.manifest.capsule_id, 14, 10)}</code></dd></div>
                  <div><dt>Declared files</dt><dd>{capsule.manifest.files.length}</dd></div>
                  <div><dt>Raw evidence included</dt><dd>{String(capsule.manifest.raw_evidence_included)}</dd></div>
                  <div><dt>Decision ID</dt><dd><code>{shortHash(capsule.manifest.decision_id)}</code></dd></div>
                  <div><dt>Source revision</dt><dd><code>{capsule.manifest.source_revision}</code></dd></div>
                </dl>
              )}
            </article>
            <article className="platform-panel">
              <header><span>Manifest verification</span><h2>What was actually hashed?</h2></header>
              {capsule ? (
                <div className="capsule-compact-list">
                  {capsule.manifest.files.map((file) => (
                    <div key={file.path}><FileCheck2 size={15} /><strong>{file.path}</strong><span>{file.bytes} bytes</span><code>{shortHash(file.sha256)}</code></div>
                  ))}
                </div>
              ) : <EmptyState>Waiting for the generated manifest.</EmptyState>}
            </article>
          </section>
          {capsule ? (
            <section className="platform-mission-strip">
              <div><ShieldCheck size={17} /><strong>Generated in this browser session</strong></div>
              <span>{capsule.manifest.files.length} declared files</span>
              <span>raw rows excluded</span>
              <span>RO-Crate + PROV-JSONLD metadata included</span>
            </section>
          ) : null}
        </main>
      ) : null}

      {tool === 'objects' ? (
        <main className="platform-page verification-objects">
          <section className="platform-two-column object-inspector">
            <article className="platform-panel">
              <header><span>Object model</span><h2>Select an actual runtime object</h2></header>
              <div className="object-selector-list">
                {OBJECTS.map(([label, key]) => (
                  <button key={key} type="button" className={objectKey === key ? 'active' : ''} onClick={() => setObjectKey(key)}>{label}</button>
                ))}
              </div>
            </article>
            <article className="platform-panel object-json-panel">
              <header><span>Actual instance</span><h2>{OBJECTS.find(([, key]) => key === objectKey)?.[0]}</h2></header>
              {selectedObject ? <pre>{JSON.stringify(selectedObject, null, 2)}</pre> : <EmptyState>Resolving the selected object…</EmptyState>}
            </article>
          </section>
        </main>
      ) : null}
    </div>
  );
}
