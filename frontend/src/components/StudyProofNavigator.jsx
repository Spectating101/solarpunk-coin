import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  Beaker,
  CheckCircle2,
  FlaskConical,
  GitCompareArrows,
  ShieldAlert,
  Waypoints,
} from 'lucide-react';
import ResponsiveDisclosure from './ResponsiveDisclosure';
import '../styles/studyProofLayer.css';

const LINKS = Object.freeze([
  { id: 'brief', label: 'Decision brief', href: '#runs', icon: Beaker },
  { id: 'detail', label: 'Full study', href: '#study', icon: FlaskConical },
  { id: 'reproduce', label: 'Verify bundle', href: '#reproduce', icon: CheckCircle2 },
  {
    id: 'mechanics',
    label: 'Controlled mechanics',
    href: '#case/TYN-001?policy=ENERGY-CASE-PILOT-005&scenario=PROVENANCE-L2-COUNTERFACTUAL&lens=stress',
    icon: Waypoints,
  },
  {
    id: 'compare',
    label: 'Compare cases',
    href: '#compare?scenario=PROVENANCE-L2-COUNTERFACTUAL&baseline=LAB-CASE-OPEN-004&comparison=ENERGY-CASE-PILOT-005',
    icon: GitCompareArrows,
  },
]);

const MODE_COPY = Object.freeze({
  brief: {
    title: 'Start with the empirical decision.',
    detail: 'The historical panel quantifies coverage purchased, capacity surrendered, and the residual failure that remains.',
    stage: 1,
  },
  detail: {
    title: 'Interrogate the aggregate evidence.',
    detail: 'Inspect policy tables, binding attribution, temporal robustness, stress replays, and declared methods without redistributing licensed rows.',
    stage: 2,
  },
  reproduce: {
    title: 'Verify the released research object.',
    detail: 'Browser hashing establishes exact public-bundle identity. It does not certify licensed source truth, causal validity, or future adequacy.',
    stage: 4,
  },
});

function studyMode(hash = '') {
  const value = String(hash).toLowerCase();
  if (value.startsWith('#reproduce')) return 'reproduce';
  if (value.startsWith('#study')) return 'detail';
  if (value.startsWith('#runs') || value.startsWith('#studies')) return 'brief';
  return null;
}

function ProofStage({ number, title, detail, active }) {
  return (
    <div className={active ? 'study-proof-stage active' : 'study-proof-stage'}>
      <span>{String(number).padStart(2, '0')}</span>
      <div>
        <strong>{title}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

export default function StudyProofNavigator() {
  const [mode, setMode] = useState(() => (
    typeof window === 'undefined' ? null : studyMode(window.location.hash)
  ));
  const [mountNode, setMountNode] = useState(null);

  useEffect(() => {
    const sync = () => setMode(studyMode(window.location.hash));
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('study-proof-active', Boolean(mode));
    return () => document.body.classList.remove('study-proof-active');
  }, [mode]);

  useEffect(() => {
    const header = document.querySelector('.app-minimal-top');
    if (!header) return undefined;

    const node = document.createElement('div');
    node.className = 'study-proof-host';
    node.dataset.studyProofHost = 'true';
    header.insertAdjacentElement('afterend', node);
    setMountNode(node);

    return () => {
      setMountNode(null);
      node.remove();
    };
  }, []);

  const copy = useMemo(() => (mode ? MODE_COPY[mode] : null), [mode]);
  if (!mode || !copy || !mountNode) return null;

  return createPortal(
    <section className={`study-proof-layer ${mode}`} aria-label="Studies empirical proof layer">
      <ResponsiveDisclosure
        id="study-proof-navigation"
        className="study-proof-disclosure"
        label="Studies · empirical proof layer"
        title={copy.title}
        meta={mode === 'brief' ? 'decision' : mode === 'detail' ? 'evidence' : 'identity'}
      >
        <div className="study-proof-layout">
          <div className="study-proof-copy">
            <p>{copy.detail}</p>
            <div className="study-proof-boundary">
              <ShieldAlert size={17} aria-hidden />
              <span>
                The market study provides empirical policy evidence. The energy cases provide controlled decision mechanics.
                They are connected by the analytical method—not presented as one dataset.
              </span>
            </div>
          </div>

          <nav className="study-proof-nav" aria-label="Study proof layer navigation">
            {LINKS.map(({ id, label, href, icon: Icon }) => {
              const current = id === mode;
              return (
                <a key={id} href={href} className={current ? 'active' : ''} aria-current={current ? 'page' : undefined}>
                  <Icon size={16} aria-hidden />
                  <span>{label}</span>
                  <ArrowRight size={14} aria-hidden />
                </a>
              );
            })}
          </nav>

          <div className="study-proof-chain" aria-label="Empirical proof sequence">
            <ProofStage number={1} title="Decision" detail="Coverage, capacity cost, residual failure" active={copy.stage === 1} />
            <ProofStage number={2} title="Historical evidence" detail="Common sample, frontier, stress, methods" active={copy.stage === 2} />
            <ProofStage number={3} title="Controlled mechanics" detail="Admission, binding rule, settlement, lineage" active={false} />
            <ProofStage number={4} title="Release identity" detail="Exact public bytes and verification boundary" active={copy.stage === 4} />
          </div>
        </div>
      </ResponsiveDisclosure>
    </section>,
    mountNode,
  );
}
