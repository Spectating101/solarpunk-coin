import React, { useMemo, useState } from 'react';
import {
  Archive,
  BadgeCheck,
  BookOpenCheck,
  Boxes,
  Braces,
  ExternalLink,
  FileCheck2,
  FlaskConical,
  Github,
  History,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react';
import { useCaseWorkbench } from '../../app/CaseWorkbenchProvider';
import { GITHUB_REPO } from '../../constants/contracts';
import {
  LinkButton,
  PlatformPageIntro,
  StatusBadge,
} from './PlatformSurface';

const PROGRAMME_CLAIMS = [
  {
    id: 'deterministic',
    label: 'Deterministic',
    explanation: 'Equivalent declared case, evidence, context, policy, calculator versions, and rule results produce the same decision identity.',
    evidence: ['DecisionResult identity', 'Canonical decision body', 'Case-pack conformance tests'],
    verification: 'Re-evaluate the same declared state and compare the decision ID.',
  },
  {
    id: 'tested',
    label: 'Tested',
    explanation: 'The core, schemas, case pack, comparison surfaces, receipt path, and frontend states are covered by automated tests and review workflows.',
    evidence: ['60 deterministic core tests', '64 frontend tests', '15 desktop/mobile review states'],
    verification: 'Open the repository CI and test commands for the current revision.',
  },
  {
    id: 'reproducible',
    label: 'Reproducible',
    explanation: 'Decision receipts and research capsules retain the identities needed to inspect, share, and replay a result without publishing raw evidence rows.',
    evidence: ['Decision receipt', 'Closed-world capsule manifest', 'File hashes and byte lengths'],
    verification: 'Build the active capsule and inspect cross-object agreement.',
  },
  {
    id: 'field',
    label: 'Field-ready alpha',
    explanation: 'The complete software path accepts operator-format evidence, but the first owner-supplied source and authenticated custody gates remain open.',
    evidence: ['OPS-001 Gate 1A', 'Custody-first intake', 'Explicit Gate 1B–1D roadmap'],
    verification: 'Run OPS-001 and inspect the field-use boundary.',
  },
  {
    id: 'institutional',
    label: 'Institutionally grounded',
    explanation: 'The programme maps observed institutional processes into bounded inferences rather than presenting institutional analogies as external validation.',
    evidence: ['Norway source register', 'Claim register', 'CL–ECI mapping'],
    verification: 'Follow the institutional source-to-claim trace in Full Research.',
  },
];

const VALIDATION_ROWS = [
  ['DecisionResult', 'YES', 'YES', 'YES', 'internal', 'core tests / schemas'],
  ['Quantity ceilings', 'YES', 'YES', 'YES', 'controlled cases', 'case receipts'],
  ['Settlement replay', 'YES', 'YES', 'YES', 'modeled stress', 'stress artifacts'],
  ['Comparison workspace', 'YES', 'YES', 'YES', 'controlled', '12-decision matrix'],
  ['Market-capacity study', 'YES', 'YES', 'YES', 'licensed-source boundary', 'aggregate study files'],
  ['Norway mapping', 'YES', 'REVIEWED', 'SOURCE-LINKED', 'institutional grounding', 'dossier / registers'],
  ['Operator-format pipeline', 'YES', 'YES', 'YES', 'synthetic Gate 1A', 'OPS-001 capsule'],
  ['Owner-supplied source', 'NO', 'NO', 'NO', 'open field gate', 'pending'],
];

const OUTPUT_ROWS = [
  ['Public workbench', 'field-ready alpha', 'run · inspect · review'],
  ['Constraint core', 'versioned package', 'install · test · inspect schemas'],
  ['Controlled case pack', '4 cases / 3 policies', 'execute · compare · export'],
  ['Market-capacity study', 'aggregate package', 'inspect · reproduce'],
  ['Norway evidence dossier', 'source-linked package', 'inspect sources · claim map'],
  ['Decision receipts', 'deterministic identities', 'JSON · memo · capsule'],
  ['Programme paper', 'in preparation', 'inspect claim map'],
  ['Software archive / DOI', 'in preparation', 'release · archive · cite'],
];

export default function ProgrammeSurface({ viewMode, onNavigate, onOpenFullAnalysis }) {
  const { pack, receiptsById } = useCaseWorkbench();
  const [activeId, setActiveId] = useState(PROGRAMME_CLAIMS[0].id);
  const active = useMemo(() => PROGRAMME_CLAIMS.find((item) => item.id === activeId) || PROGRAMME_CLAIMS[0], [activeId]);
  const receiptCount = Object.keys(receiptsById || {}).length;

  if (viewMode === 'full') {
    return (
      <main className="platform-page programme-surface full" aria-labelledby="full-programme-title">
        <PlatformPageIntro
          kicker="Programme · validation, outputs, releases, and reference"
          title="Inspect exactly what exists, what is tested, what is reusable, and what remains open."
          description="Full Programme is the due-diligence surface: validation ledger, release identities, output status, citation and archival paths, external-use readiness, technical reference, and historical implementation context."
          viewMode="full"
        >
          <LinkButton onClick={() => onNavigate({ section: 'verify', tool: 'receipt' })}>Verify active artifacts</LinkButton>
        </PlatformPageIntro>

        <section className="platform-panel programme-ledger">
          <header><span>Validation ledger</span><h2>Component-by-component status</h2></header>
          <div className="platform-table-scroll">
            <table>
              <thead><tr><th>Component</th><th>Implemented</th><th>Tested</th><th>Reproduced</th><th>External status</th><th>Artifact</th></tr></thead>
              <tbody>
                {VALIDATION_ROWS.map((row) => (
                  <tr key={row[0]}>
                    <th>{row[0]}</th>
                    {row.slice(1, 4).map((value, index) => <td key={`${row[0]}-${index}`}><StatusBadge tone={value === 'NO' ? 'warn' : 'pass'}>{value}</StatusBadge></td>)}
                    <td>{row[4]}</td><td>{row[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="platform-two-column programme-full-grid">
          <article className="platform-panel">
            <header><span>Outputs and releases</span><h2>What can be used now?</h2></header>
            <div className="programme-output-list">
              {OUTPUT_ROWS.map(([name, status, action]) => (
                <div key={name}><strong>{name}</strong><span>{status}</span><small>{action}</small></div>
              ))}
            </div>
          </article>
          <article className="platform-panel">
            <header><span>External-use readiness</span><h2>Where the current evidence supports use</h2></header>
            <div className="programme-readiness-list">
              <div><strong>Academic review</strong><StatusBadge tone="pass">STRONG</StatusBadge><span>Next: archived release / external review</span></div>
              <div><strong>Research-software release</strong><StatusBadge tone="pass">STRONG</StatusBadge><span>Next: DOI / sustained public history</span></div>
              <div><strong>Technical competition</strong><StatusBadge tone="pass">STRONG</StatusBadge><span>Next: event-specific packaging</span></div>
              <div><strong>Commercialization grant</strong><StatusBadge tone="warn">PACKAGEABLE</StatusBadge><span>Next: interviews / real-source case</span></div>
              <div><strong>Operator pilot</strong><StatusBadge tone="warn">FIELD ALPHA</StatusBadge><span>Next: owner-supplied source</span></div>
              <div><strong>Venture</strong><StatusBadge tone="warn">TECHNICAL ASSET</StatusBadge><span>Next: buyer / paid pilot / repeat use</span></div>
            </div>
          </article>
        </section>

        <section className="platform-two-column programme-full-grid">
          <article className="platform-panel">
            <header><span>Technical reference</span><h2>Inspect and reproduce the software</h2></header>
            <div className="programme-reference-grid">
              <a href={`${GITHUB_REPO}/tree/main/protocol/schema`} target="_blank" rel="noreferrer"><Braces size={18} /><strong>Public schemas</strong><span>Case, evidence, policy, decision, receipt, and intake objects</span><ExternalLink size={14} /></a>
              <a href={`${GITHUB_REPO}/tree/main/packages/constraint-core`} target="_blank" rel="noreferrer"><Boxes size={18} /><strong>Constraint core</strong><span>Deterministic workbench package and tests</span><ExternalLink size={14} /></a>
              <a href={`${GITHUB_REPO}/blob/main/README.md#quick-start`} target="_blank" rel="noreferrer"><PackageCheck size={18} /><strong>Reproduction commands</strong><span>Core, frontend, EVM, and review workflows</span><ExternalLink size={14} /></a>
              <a href={`${GITHUB_REPO}/blob/main/CITATION.cff`} target="_blank" rel="noreferrer"><BookOpenCheck size={18} /><strong>Citation</strong><span>Repository citation metadata and archival path</span><ExternalLink size={14} /></a>
            </div>
          </article>
          <article className="platform-panel">
            <header><span>History</span><h2>Keep SPK visible without making it the centre</h2></header>
            <div className="platform-emphasis-copy">
              SolarPunk / SPK / Sepolia remain available as implementation history and a reference application. They are not presented as legal money, a token sale, a stablecoin, or validation of the current evidence architecture.
            </div>
            <div className="platform-action-stack">
              <LinkButton onClick={() => onNavigate({ section: 'reference', id: 'solarpunk' })}>Open historical SolarPunk reference</LinkButton>
              <LinkButton onClick={() => onNavigate({ section: 'reference', id: 'sepolia' })}>Open Sepolia proof</LinkButton>
            </div>
          </article>
        </section>

        <section className="programme-roadmap">
          {[
            ['G0', 'Deterministic core', 'COMPLETE'],
            ['G1A', 'Operator-format sample', 'COMPLETE'],
            ['G1B', 'Owner-supplied export', 'OPEN'],
            ['G1C', 'Authenticated custody', 'OPEN'],
            ['G1D', 'Real signed gateway L2', 'OPEN'],
            ['G2', 'External review', 'OPEN'],
            ['G3', 'Pilot / repeated use', 'OPEN'],
          ].map(([gate, label, status]) => (
            <div key={gate}><span>{gate}</span><strong>{label}</strong><StatusBadge tone={status === 'COMPLETE' ? 'pass' : 'warn'}>{status}</StatusBadge></div>
          ))}
        </section>
      </main>
    );
  }

  return (
    <main className="platform-page programme-surface" aria-labelledby="programme-title">
      <PlatformPageIntro
        kicker="Programme · verify the project"
        title="Do not take the project claims on trust—open the evidence behind each one."
        description="Select a programme claim to see what supports it, what the visitor can verify, what is already available, and which external gate remains unresolved."
        viewMode="overview"
      >
        <LinkButton primary onClick={onOpenFullAnalysis}>Open full programme</LinkButton>
      </PlatformPageIntro>

      <section className="programme-claim-selector" aria-label="Select a programme claim">
        {PROGRAMME_CLAIMS.map((claim) => (
          <button key={claim.id} type="button" className={claim.id === activeId ? 'active' : ''} onClick={() => setActiveId(claim.id)}>{claim.label}</button>
        ))}
      </section>

      <section className="platform-three-column programme-proof-grid">
        <article className="platform-panel">
          <header><span>Selected claim</span><h2>{active.label}</h2></header>
          <p className="platform-emphasis-copy">{active.explanation}</p>
        </article>
        <article className="platform-panel">
          <header><span>Supporting evidence</span><h2>What exists</h2></header>
          <div className="programme-evidence-list">
            {active.evidence.map((item) => <div key={item}><FileCheck2 size={16} /><span>{item}</span></div>)}
          </div>
        </article>
        <article className="platform-panel">
          <header><span>Verification</span><h2>How to challenge it</h2></header>
          <p className="platform-emphasis-copy">{active.verification}</p>
          <LinkButton onClick={() => onNavigate({ section: 'verify', tool: active.id === 'institutional' ? 'lineage' : 'receipt' })}>Open verification hub</LinkButton>
        </article>
      </section>

      <section className="programme-use-grid">
        <article><FlaskConical size={20} /><strong>Run</strong><span>Public workbench · guided investigation · policy comparison</span></article>
        <article><BookOpenCheck size={20} /><strong>Read</strong><span>Programme research · empirical study · methods and limitations</span></article>
        <article><ShieldCheck size={20} /><strong>Inspect</strong><span>Four-case pack · Norway dossier · {receiptCount} browser-session receipts</span></article>
        <article><Archive size={20} /><strong>Reuse</strong><span>Constraint core · public schemas · reproduction commands</span></article>
      </section>

      <section className="platform-mission-strip programme-gate">
        <div><BadgeCheck size={17} /><strong>Current external gate</strong></div>
        <span>One attributable owner/operator evidence source</span>
        <button type="button" onClick={() => onNavigate({ section: 'field' })}>Open field-use workflow</button>
        <a href={GITHUB_REPO} target="_blank" rel="noreferrer"><Github size={15} /> Repository</a>
      </section>
    </main>
  );
}
