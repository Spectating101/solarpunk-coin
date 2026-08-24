import React from 'react';
import { ExternalLink, FileCheck2, ShieldCheck } from 'lucide-react';
import { GITHUB_REPO } from '../constants/contracts';
import { PUBLIC_EVIDENCE_CHECKPOINT as checkpoint } from '../data/publicEvidenceCheckpoint';
import { StatusBadge, shortHash } from './platform/PlatformSurface';

const WORKFLOW_URL = `${GITHUB_REPO}/actions/runs/${checkpoint.provenance.workflow_run_id}`;
const ARTIFACT_URL = `${WORKFLOW_URL}/artifacts/${checkpoint.provenance.artifact_id}`;
const EVALUATOR_BRIEF_URL = `${GITHUB_REPO}/blob/main/docs/research/POLICY_LAB_G4_EVALUATOR_BRIEF.md`;

export default function PublicEvidenceCheckpoint({ compact = false }) {
  return (
    <section className={compact ? 'platform-panel public-evidence-checkpoint compact' : 'platform-panel public-evidence-checkpoint'} aria-labelledby="public-evidence-checkpoint-title">
      <header>
        <span>Outside-data checkpoint · machine-observed</span>
        <h2 id="public-evidence-checkpoint-title">{checkpoint.case_id} · Ausgrid public evidence</h2>
      </header>

      <p className="platform-emphasis-copy">
        A successful CI run executed 336 half-hour intervals from a pinned outside public archive at actual L0 assurance. The same evidence is admitted with a 33.066 kWh ceiling under the open research policy and blocked under the stricter pilot policy.
      </p>

      <div className="research-evidence-matrix">
        <div><span>Actual assurance</span><StatusBadge tone="warn">{checkpoint.evidence.assurance}</StatusBadge></div>
        <div><span>Open policy</span><StatusBadge tone="pass">{checkpoint.decisions.open.result.replaceAll('_', ' ')}</StatusBadge></div>
        <div><span>Open ceiling</span><strong>{checkpoint.decisions.open.admitted_maximum} kWh</strong></div>
        <div><span>Pilot policy</span><StatusBadge tone="fail">{checkpoint.decisions.pilot.result}</StatusBadge></div>
        <div><span>40% settlement</span><StatusBadge tone="warn">{checkpoint.settlement.result}</StatusBadge></div>
        <div><span>Replay</span><StatusBadge tone="pass">{checkpoint.verification.decision_reproduction}</StatusBadge></div>
      </div>

      {!compact ? (
        <>
          <dl className="platform-fact-list">
            <div><dt>Evidence hash</dt><dd><code>{shortHash(checkpoint.evidence.evidence_hash, 14, 10)}</code></dd></div>
            <div><dt>Assessment ID</dt><dd><code>{shortHash(checkpoint.verification.assessment_id, 14, 10)}</code></dd></div>
            <div><dt>R1 / R2 / R3 / R4</dt><dd>{checkpoint.boundaries.R1} · {checkpoint.boundaries.R2} · {checkpoint.boundaries.R3} · {checkpoint.boundaries.R4}</dd></div>
            <div><dt>Source archive</dt><dd><code>{shortHash(checkpoint.source.archive_sha256, 14, 10)}</code></dd></div>
          </dl>
          <div className="platform-inline-proof">
            <ShieldCheck size={18} />
            <span>Capsule integrity, schema validation, and deterministic decision reproduction all passed. This does not promote source truth, operator custody, legal authority, or monetary performance.</span>
          </div>
        </>
      ) : null}

      <div className="platform-action-stack">
        <a href={WORKFLOW_URL} target="_blank" rel="noreferrer" className="ghost-link"><FileCheck2 size={15} /> CI evidence run <ExternalLink size={13} /></a>
        <a href={ARTIFACT_URL} target="_blank" rel="noreferrer" className="ghost-link">Evidence artifact <ExternalLink size={13} /></a>
        <a href={EVALUATOR_BRIEF_URL} target="_blank" rel="noreferrer" className="ghost-link">Evaluator brief <ExternalLink size={13} /></a>
      </div>
    </section>
  );
}
