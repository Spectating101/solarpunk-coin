import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Database,
  FileSearch,
  FlaskConical,
  GitBranch,
  Landmark,
  Scale,
} from 'lucide-react';
import ResearchPanel from '../ResearchPanel';
import {
  LinkButton,
  PlatformPageIntro,
  StatusBadge,
} from './PlatformSurface';

const DISTINCTIONS = [
  {
    id: 'signal-evidence',
    label: 'Signal ≠ evidence',
    example: 'A modeled solar estimate suggests that production could occur. It does not prove that a meter observed it.',
    mechanism: 'EvidenceEnvelope · source identity · measurement window · diagnostics',
    failure: 'Modeled context is silently treated as observed proof.',
    caseRoute: { section: 'case', id: 'TYN-001', policyId: 'ENERGY-CASE-PILOT-005', scenarioId: 'PROVENANCE-L0-BASE', lens: 'evidence' },
  },
  {
    id: 'evidence-authority',
    label: 'Evidence ≠ authority',
    example: 'A valid evidence object can exist while the selected policy still refuses to authorize quantity evaluation.',
    mechanism: 'PolicyManifest · admission gates · explicit blocking attribution',
    failure: 'Existence of data is mistaken for permission to issue a financial claim.',
    caseRoute: { section: 'case', id: 'TYN-001', policyId: 'ENERGY-CASE-PILOT-005', scenarioId: 'PROVENANCE-L0-BASE', lens: 'constraints' },
  },
  {
    id: 'authority-quantity',
    label: 'Authority ≠ quantity',
    example: 'Passing admission permits evaluation. It does not make the entire requested quantity legitimate.',
    mechanism: 'Comparable quantity ceilings · minimum applicable ceiling · binding attribution',
    failure: 'A binary pass is misread as unlimited authority.',
    caseRoute: { section: 'case', id: 'TYN-001', policyId: 'ENERGY-CASE-PILOT-005', scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL', lens: 'constraints' },
  },
  {
    id: 'quantity-settlement',
    label: 'Quantity ≠ settlement',
    example: 'A bounded 126-unit claim can be valid while only 50.4 units are covered under a declared stress condition.',
    mechanism: 'ClaimManifest · SettlementResult · settlement constraint evaluation',
    failure: 'Valid issuance is incorrectly presented as guaranteed coverage.',
    caseRoute: { section: 'case', id: 'TYN-001', policyId: 'ENERGY-CASE-PILOT-005', scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL', lens: 'stress' },
  },
  {
    id: 'claim-money',
    label: 'Financial claim ≠ money',
    example: 'A research claim object is not legal tender, a deposit, a reserve-backed stablecoin, or a redemption right.',
    mechanism: 'Explicit object boundaries · non-claims · historical SPK kept as reference',
    failure: 'A computational claim is confused with legal or institutional money.',
    caseRoute: { section: 'programme' },
  },
];

const CLAIM_ROWS = [
  {
    label: 'Central thesis',
    claim: 'Evidence can constrain a financial claim only through explicit purpose, policy, quantity, identity, and settlement rules.',
    status: 'STABLE',
    focusId: 'authority-quantity',
  },
  {
    label: 'Institutional inference',
    claim: 'Norway demonstrates separable measurement, admission, registry, cancellation, and settlement processes.',
    status: 'SOURCE-LINKED',
    focusId: 'evidence-authority',
  },
  {
    label: 'Executable mechanism',
    claim: 'The Policy Lab evaluates blocked, quantity-limited, and settlement-constrained decisions.',
    status: 'TESTED',
    focusId: 'quantity-settlement',
  },
  {
    label: 'Empirical extension',
    claim: 'The market-capacity study evaluates capacity-versus-failure trade-offs in a separate financial domain.',
    status: 'TESTED',
    focusId: 'quantity-settlement',
  },
  {
    label: 'External validation',
    claim: 'One attributable real energy source is still required.',
    status: 'OPEN',
    focusId: 'signal-evidence',
  },
];

export default function ResearchSurface({ viewMode, onNavigate, onOpenFullAnalysis }) {
  const [activeId, setActiveId] = useState(DISTINCTIONS[0].id);
  const active = useMemo(() => DISTINCTIONS.find((item) => item.id === activeId) || DISTINCTIONS[0], [activeId]);

  if (viewMode === 'full') {
    return (
      <main className="platform-page research-surface full" aria-labelledby="full-research-title">
        <PlatformPageIntro
          kicker="Research · complete scholarly architecture"
          title="Inspect every claim, evidence class, method, limitation, and executable research object."
          description="Full Research connects ECI, the Constrained Ledger, the Policy Lab, institutional source mapping, empirical studies, and public outputs without collapsing one evidence class into another."
          viewMode="full"
        >
          <LinkButton onClick={() => onNavigate({ section: 'studies' })}>Open empirical studies</LinkButton>
        </PlatformPageIntro>

        <section className="platform-three-column research-full-grid">
          <article className="platform-panel">
            <header><span>Claim hierarchy</span><h2>What is being claimed?</h2></header>
            <div className="platform-claim-list">
              {CLAIM_ROWS.map(({ label, claim, status, focusId }) => (
                <button key={label} type="button" onClick={() => setActiveId(focusId)}>
                  <div><strong>{label}</strong><p>{claim}</p></div>
                  <StatusBadge tone={status === 'OPEN' ? 'warn' : 'pass'}>{status}</StatusBadge>
                </button>
              ))}
            </div>
          </article>

          <article className="platform-panel">
            <header><span>Research architecture</span><h2>How the programme composes</h2></header>
            <div className="research-architecture-map">
              <div><FileSearch size={18} /><strong>ECI</strong><span>Purpose-indexed evidence fitness and assurance</span></div>
              <GitBranch size={18} />
              <div><Scale size={18} /><strong>Constrained Ledger</strong><span>Authority, quantity, identity, settlement, governance</span></div>
              <GitBranch size={18} />
              <div><FlaskConical size={18} /><strong>Policy Lab</strong><span>Executable cases, comparison, stress, and receipts</span></div>
              <GitBranch size={18} />
              <div><Landmark size={18} /><strong>Institutional evidence</strong><span>Observed process → inference → analogy → simulation</span></div>
              <GitBranch size={18} />
              <div><Database size={18} /><strong>Empirical studies</strong><span>Historical policy-performance and failure trade-offs</span></div>
            </div>
          </article>

          <article className="platform-panel">
            <header><span>Claim–evidence matrix</span><h2>Which support exists?</h2></header>
            <div className="research-evidence-matrix">
              <div><span>Conceptual reasoning</span><StatusBadge tone="pass">AVAILABLE</StatusBadge></div>
              <div><span>Literature and methods</span><StatusBadge tone="pass">AVAILABLE</StatusBadge></div>
              <div><span>Norway source mapping</span><StatusBadge tone="pass">SOURCE-LINKED</StatusBadge></div>
              <div><span>Controlled energy mechanism</span><StatusBadge tone="pass">TESTED</StatusBadge></div>
              <div><span>Historical market study</span><StatusBadge tone="pass">TESTED</StatusBadge></div>
              <div><span>Real energy source</span><StatusBadge tone="warn">OPEN</StatusBadge></div>
              <div><span>External replication</span><StatusBadge tone="warn">OPEN</StatusBadge></div>
            </div>
          </article>
        </section>

        <section className="platform-panel research-source-trace">
          <header>
            <span>Active source trace</span>
            <h2>{active.label}: follow the statement from research claim to executable result.</h2>
          </header>
          <div className="research-trace-flow">
            <button type="button">Source register</button><GitBranch size={16} />
            <button type="button">Institutional claim</button><GitBranch size={16} />
            <button type="button">CL–ECI inference</button><GitBranch size={16} />
            <button type="button" onClick={() => onNavigate(active.caseRoute)}>Case mechanism</button><GitBranch size={16} />
            <button type="button" onClick={() => onNavigate({ section: 'verify', tool: 'lineage' })}>Decision object</button>
          </div>
          <div className="platform-inline-proof"><BookOpen size={18} /><span>{active.example}</span></div>
        </section>

        <ResearchPanel />
      </main>
    );
  }

  return (
    <main className="platform-page research-surface" aria-labelledby="research-title">
      <PlatformPageIntro
        kicker="Research · interactive argument"
        title="Where does the claim stop being justified?"
        description="Select a distinction to see the concrete failure it prevents, the implemented mechanism that addresses it, and the research path supporting that mechanism."
        viewMode="overview"
      >
        <LinkButton primary onClick={onOpenFullAnalysis}>Open full research</LinkButton>
      </PlatformPageIntro>

      <section className="research-chain" aria-label="Research distinction chain">
        {DISTINCTIONS.map((item, index) => (
          <React.Fragment key={item.id}>
            <button
              type="button"
              className={item.id === activeId ? 'active' : ''}
              onClick={() => setActiveId(item.id)}
              aria-pressed={item.id === activeId}
            >
              {item.label}
            </button>
            {index < DISTINCTIONS.length - 1 ? <GitBranch size={16} /> : null}
          </React.Fragment>
        ))}
      </section>

      <section className="platform-three-column research-teaching-grid">
        <article className="platform-panel">
          <header><span>Distinction</span><h2>{active.label}</h2></header>
          <p className="platform-emphasis-copy">{active.example}</p>
          <LinkButton onClick={() => onNavigate(active.caseRoute)}>Run the associated case</LinkButton>
        </article>
        <article className="platform-panel">
          <header><span>Implemented response</span><h2>How the platform handles it</h2></header>
          <p className="platform-emphasis-copy">{active.mechanism}</p>
          <div className="platform-inline-proof"><BookOpen size={18} /><span>Concept → mechanism → decision → receipt</span></div>
        </article>
        <article className="platform-panel">
          <header><span>Failure prevented</span><h2>What breaks when ignored?</h2></header>
          <p className="platform-emphasis-copy">{active.failure}</p>
          <LinkButton onClick={() => onNavigate({ section: 'verify', tool: 'lineage' })}>Inspect supporting lineage</LinkButton>
        </article>
      </section>
    </main>
  );
}
