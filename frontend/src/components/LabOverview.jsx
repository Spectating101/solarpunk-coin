import React from 'react';
import {
  ArrowRight,
  BookOpenCheck,
  Boxes,
  FileCheck2,
  FlaskConical,
  GitCompareArrows,
  Network,
  Play,
  ShieldCheck,
  Waypoints,
} from 'lucide-react';
import '../styles/flagshipHardening.css';

const SURFACES = [
  {
    id: 'cases',
    icon: Waypoints,
    index: '01',
    label: 'Case workbench',
    title: 'Trace why a case is blocked, bounded, or exposed to settlement failure.',
    description: 'Four committed research cases move through controlled or synthetic evidence, modeled context, declared assurance, versioned policy, typed constraints, and deterministic receipts.',
    boundary: 'Controlled + synthetic case pack · mechanism demonstration · no empirical geography claim',
    action: 'Open canonical cases',
  },
  {
    id: 'studies',
    icon: FlaskConical,
    index: '02',
    label: 'Empirical study',
    title: 'Measure what a stricter financial rule bought—and where it still failed.',
    description: 'A separate aggregate market-capacity study compares common-sample policy trade-offs, binding constraints, and failure-visible historical stress replays.',
    boundary: 'Licensed historical source · aggregate public release · separate empirical domain',
    action: 'Open policy study',
  },
  {
    id: 'reference',
    icon: Boxes,
    index: '03',
    label: 'SolarPunk reference lab',
    title: 'Inspect the original evidence, currency, and Sepolia reference implementation.',
    description: 'The reference area preserves browser-local evidence workflows, currency experiments, deployed testnet proof, and supporting research material without crowding the primary case investigation.',
    boundary: 'Reference implementation · browser-local experiments · Sepolia research proof',
    action: 'Open reference lab',
  },
];

const WALKTHROUGH = [
  ['01', 'Blocked admission', 'Open TYN-001 at L0 and identify the minimum-provenance gate. Quantity evaluation must remain unexecuted.'],
  ['02', 'Declared counterfactual', 'Change only the assurance scenario to L2. The evidence hash stays fixed while the decision identity changes.'],
  ['03', 'Binding attribution', 'Inspect the admitted maximum and the exact quantity ceiling that determines it.'],
  ['04', 'Settlement stress', 'Reduce declared settlement capacity to 40% and expose the resulting covered quantity and shortfall.'],
  ['05', 'Portable receipt', 'Export the decision receipt, memo, lineage, reproduction manifest, and research capsule.'],
];

export default function LabOverview({ onNavigate }) {
  const startInvestigation = () => onNavigate({
    section: 'case',
    id: 'TYN-001',
    policyId: 'ENERGY-CASE-PILOT-005',
    scenarioId: 'PROVENANCE-L0-BASE',
    lens: 'constraints',
  });

  return (
    <main className="lab-overview" aria-labelledby="lab-overview-title">
      <section className="lab-overview-hero">
        <div className="lab-overview-copy">
          <span className="wb-kicker"><Network size={13} /> Public research lab · deterministic constraint analysis</span>
          <h1 id="lab-overview-title">Investigate how evidence becomes a bounded financial decision.</h1>
          <p>
            Policy Lab separates evidence identity, modeled context, assurance, policy, admission,
            quantity, and settlement so each conclusion can be inspected instead of inferred from a dashboard.
          </p>
          <div className="lab-overview-actions">
            <button type="button" className="lab-overview-primary" onClick={startInvestigation}>
              <Play size={16} /> Start the five-minute investigation <ArrowRight size={16} />
            </button>
            <button type="button" className="lab-overview-secondary" onClick={() => onNavigate({ section: 'compare', scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL' })}>
              <GitCompareArrows size={16} /> Compare policies at L2
            </button>
          </div>
        </div>

        <aside className="lab-overview-thesis" aria-label="Research method summary">
          <span>One method</span>
          <strong>Evidence → policy → bounded decision → stress → receipt</strong>
          <p>Three public surfaces use that method differently. Their data boundaries remain explicit rather than being merged into one unsupported claim.</p>
          <div>
            <small>Case pack</small><code>controlled + synthetic</code>
            <small>Market study</small><code>aggregate empirical</code>
            <small>Reference lab</small><code>experimental</code>
          </div>
        </aside>
      </section>

      <section className="lab-surface-section" aria-labelledby="lab-surfaces-title">
        <header className="lab-section-heading">
          <div>
            <span className="wb-section-label">Research suite architecture</span>
            <h2 id="lab-surfaces-title">Three surfaces, connected by method—not by hidden data assumptions.</h2>
          </div>
          <ShieldCheck size={24} aria-hidden />
        </header>
        <p className="lab-overview-scroll-hint">Swipe horizontally to inspect all three research surfaces.</p>

        <div className="lab-surface-grid">
          {SURFACES.map((surface) => {
            const Icon = surface.icon;
            return (
              <article key={surface.id} className="lab-surface-card">
                <div className="lab-surface-card-head">
                  <span>{surface.index}</span>
                  <Icon size={20} aria-hidden />
                </div>
                <small>{surface.label}</small>
                <h3>{surface.title}</h3>
                <p>{surface.description}</p>
                <div className="lab-surface-boundary"><ShieldCheck size={14} /> {surface.boundary}</div>
                <button type="button" onClick={() => onNavigate({ section: surface.id })}>
                  {surface.action} <ArrowRight size={15} />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="lab-walkthrough-section" aria-labelledby="lab-walkthrough-title">
        <header className="lab-section-heading">
          <div>
            <span className="wb-section-label">Canonical investigation</span>
            <h2 id="lab-walkthrough-title">Follow one reasoning chain from rejection to reproducible receipt.</h2>
          </div>
          <BookOpenCheck size={24} aria-hidden />
        </header>

        <div className="lab-walkthrough-grid">
          {WALKTHROUGH.map(([index, title, description]) => (
            <article key={index}>
              <span>{index}</span>
              <div><strong>{title}</strong><p>{description}</p></div>
            </article>
          ))}
        </div>
        <button type="button" className="lab-walkthrough-start" onClick={startInvestigation}>
          Begin with TYN-001 · L0 · pilot policy <ArrowRight size={16} />
        </button>
      </section>

      <section className="lab-trust-section" aria-labelledby="lab-trust-title">
        <header className="lab-section-heading">
          <div>
            <span className="wb-section-label">Trust architecture</span>
            <h2 id="lab-trust-title">Every visible result declares what kind of object produced it.</h2>
          </div>
          <FileCheck2 size={24} aria-hidden />
        </header>
        <p className="lab-overview-scroll-hint">Swipe horizontally to inspect each trust boundary.</p>
        <div className="lab-trust-grid">
          <article className="observed"><span>Evidence</span><strong>Observed or controlled source records</strong><p>Identity, adapter, capabilities, diagnostics, and hash remain inspectable.</p></article>
          <article className="modeled"><span>Context</span><strong>Modeled environmental or market context</strong><p>Context supports a calculation but is never relabeled as observed evidence.</p></article>
          <article className="declared"><span>Policy</span><strong>Declared rules and assurance assumptions</strong><p>Versioned policy and explicit counterfactuals determine which evaluations may run.</p></article>
          <article className="derived"><span>Decision</span><strong>Deterministic derived result</strong><p>Blocking and binding attribution, settlement outcome, lineage, and receipt are generated from identified inputs.</p></article>
        </div>
      </section>
    </main>
  );
}
