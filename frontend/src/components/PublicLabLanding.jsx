import React, { useCallback, useEffect, useState } from 'react';
import {
  BookOpen,
  Cpu,
  Database,
  ExternalLink,
  FileText,
  FlaskConical,
  Leaf,
  ShieldAlert,
  Users,
} from 'lucide-react';
import {
  GITHUB_REPO,
  HARDWARE_QUICKSTART_URL,
  OPEN_LAB_WORKFLOWS_URL,
  DOCS_MAP_URL,
  PUBLIC_LAB_DEPLOYMENT_URL,
  PUBLIC_LAB_INQUIRY_URL,
  SEPOLIA_EXPLORER,
  SPK_V1,
} from '../constants/contracts';
import { loadSpkV1Runtime } from '../lib/runtime';
import useSpkV1Live from '../hooks/useSpkV1Live';

const EVIDENCE_URL = `${GITHUB_REPO}/blob/main/thesis_package/SPK_V1_EVIDENCE.md`;
const PUBLIC_LAB_DOC = `${GITHUB_REPO}/blob/main/docs/product/PUBLIC_LAB_V1.md`;
const PILOT_ASK_DOC = `${GITHUB_REPO}/blob/main/docs/product/PILOT_DATA_ASK.md`;
const CEIR_DIAGNOSIS_URL = `${GITHUB_REPO}/blob/main/thesis_package/CEIR_FINAL_DIAGNOSIS.md`;
const THESIS_PDF_URL = `${GITHUB_REPO}/blob/main/energy_constraint_thesis_final_submission_v10.pdf`;

const COMPARISON_ROWS = [
  { foundation: 'Fiat', mechanism: 'Authority', problem: 'Discretionary expansion' },
  { foundation: 'Gold', mechanism: 'Inert scarcity', problem: 'Scarce but unproductive' },
  { foundation: 'Bitcoin', mechanism: 'Proof-of-work expenditure', problem: 'Passive cost ratios fail clean identification' },
  {
    foundation: 'SolarPunk lab',
    mechanism: 'Explicit evidence + constraints',
    problem: 'Architecture demonstrated — market/legal backing not claimed',
    highlight: true,
  },
];

const AUDIENCE_CARDS = [
  {
    icon: FlaskConical,
    title: 'Researchers',
    body: 'A reproducible lab for energy-constrained digital finance — thesis evidence, CEIR diagnosis, and testnet settlement.',
  },
  {
    icon: Database,
    title: 'Energy operators',
    body: 'Validate meter or inverter exports in the browser Evidence Lab — live minting stays gated and separate.',
  },
  {
    icon: Cpu,
    title: 'Ethereum / public goods',
    body: 'Open-source infrastructure for real-world attested issuance experiments on Sepolia.',
  },
  {
    icon: Leaf,
    title: 'Green finance / policy',
    body: 'A concrete prototype linking renewable production evidence to settlement accounting and launch gates.',
  },
];

function formatSyncedAt(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function addrUrl(address) {
  return `${SEPOLIA_EXPLORER}/address/${address}`;
}

function PipelineStep({ label, status }) {
  return (
    <div className="pipeline-step">
      <span className="pipeline-step-label">{label}</span>
      <span className="pipeline-step-status">{status}</span>
    </div>
  );
}

export default function PublicLabLanding({
  onOpenEvidence,
  onOpenCurrency,
  onOpenSepolia,
  onOpenResearch,
}) {
  const [runtime, setRuntime] = useState(null);
  const [error, setError] = useState(null);
  const live = useSpkV1Live(runtime);

  const reload = useCallback(() => {
    setError(null);
    return loadSpkV1Runtime()
      .then(setRuntime)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const liveData = live.status === 'ok' ? live.data : null;
  const supply = liveData?.totalSupply ?? runtime?.on_chain?.total_supply_spk;
  const settled = liveData?.metrics?.totalSettled ?? runtime?.genesis?.metrics?.total_settled_spk;
  const paymentCount = liveData?.metrics?.networkPaymentCount ?? runtime?.genesis?.metrics?.network_payment_count;
  const circulation = liveData?.metrics?.circulationShare ?? runtime?.genesis?.metrics?.circulation_share_percent;
  const pegEnabled = Boolean(runtime?.monetary_policy?.peg_enabled);
  const syncedAt = runtime?.synced_at || runtime?.updated_at;
  const spkAddress = runtime?.contracts?.solar_punk_coin || SPK_V1.solarPunkCoin;
  const currencyAddress = runtime?.contracts?.currency_system || SPK_V1.currencySystem;
  const dataSource = live.status === 'ok' ? 'Live Sepolia reads' : 'Cached runtime JSON';

  const pipelineSteps = [
    { label: 'Meter / inverter data', status: 'Self-serve validate (L0–L2)' },
    { label: 'Attestation', status: 'Signed + replay-safe' },
    { label: 'SPK mint', status: 'Bounded issuance' },
    {
      label: 'Network payment',
      status: paymentCount != null ? `${paymentCount} indexed payments` : 'Indexed payments',
    },
    { label: 'Launch gate', status: 'Public Lab shipped · pilot blocked' },
  ];

  const proofRows = [
    { proof: 'Sepolia contracts', status: 'Live', ready: true },
    {
      proof: 'SPK supply',
      status: supply != null ? `~${Number(supply).toLocaleString()} SPK` : '…',
      ready: true,
    },
    {
      proof: 'Settled',
      status: settled != null ? `${Number(settled).toLocaleString()} SPK` : '…',
      ready: true,
    },
    { proof: 'Payments', status: paymentCount != null ? String(paymentCount) : '…', ready: true },
    {
      proof: 'Circulation',
      status: circulation != null ? `~${Number(circulation).toFixed(1)}%` : '…',
      ready: true,
    },
    { proof: 'Contract tests', status: '109 passing', ready: true },
    { proof: 'Peg', status: pegEnabled ? 'On' : 'Off', ready: !pegEnabled },
    { proof: 'Current endpoint', status: 'Public Lab shipped', ready: true },
  ];

  if (error) {
    return (
      <section className="public-lab">
        <div className="spk-demo-error">
          <h1>Could not load Public Lab data</h1>
          <p>{error}</p>
          <button type="button" className="wallet-button" onClick={reload}>Retry</button>
        </div>
      </section>
    );
  }

  if (!runtime) {
    return (
      <section className="public-lab">
        <p className="muted spk-loading">Loading Public Lab v1.0…</p>
      </section>
    );
  }

  return (
    <section className="public-lab">
      {/* §1 Hero */}
      <header className="public-lab-hero public-lab-hook">
        <div className="public-lab-hero-main">
          <p className="eyebrow">SolarPunk Public Lab v1.0 · Sepolia testnet</p>
          <h1>
            <span className="public-lab-hook-accent">Explicit constraints</span>
            {' '}
            for energy-linked settlement — not a passive cost narrative.
          </h1>
          <p className="public-lab-subhead">
            Passive mining-cost ratios do not identify a unique energy-value anchor. Public Lab
            therefore tests an explicit alternative: admissible evidence, rule-bound issuance,
            explicit risk treatment, settlement accounting, and constrained governance.
          </p>
          <p className="public-lab-proofline">
            Do not read renewable surplus as automatic monetary value. The lab demonstrates
            architecture: energy evidence → bounded issuance → circulation → settlement / shortfall
            → launch gates.
          </p>
          <div className="public-lab-cta public-lab-cta-hero">
            <button type="button" className="wallet-button" onClick={onOpenEvidence}>
              <FlaskConical size={17} /> Open Evidence Lab
            </button>
            <button type="button" className="ghost-button ghost-button-green" onClick={onOpenCurrency}>
              <FileText size={17} /> Open Currency Lab
            </button>
          </div>
          <div className="public-lab-secondary-links">
            <button type="button" className="public-lab-console-link" onClick={onOpenSepolia}>
              Advanced — Sepolia Proof →
            </button>
            <button type="button" className="public-lab-console-link" onClick={onOpenResearch}>
              Research links →
            </button>
          </div>
        </div>
        <aside className="public-lab-hero-proof-card" aria-label="Live lab snapshot">
          <p className="public-lab-hero-proof-eyebrow">Live on Sepolia</p>
          <ul className="public-lab-hero-proof-list">
            <li>
              <span>SPK supply</span>
              <strong>{supply != null ? `~${Number(supply).toLocaleString()}` : '…'}</strong>
            </li>
            <li>
              <span>Payments</span>
              <strong>{paymentCount != null ? paymentCount : '…'}</strong>
            </li>
            <li>
              <span>Contract tests</span>
              <strong>109 passing</strong>
            </li>
            <li>
              <span>Peg</span>
              <strong>{pegEnabled ? 'On' : 'Off'}</strong>
            </li>
          </ul>
        </aside>
      </header>

      {/* §1b Get started */}
      <section className="public-lab-section public-lab-get-started" aria-labelledby="get-started-heading">
        <h2 id="get-started-heading">Use the lab in the browser</h2>
        <p className="public-lab-section-lead">
          No clone required for the default experience. Validate sample energy evidence, simulate
          issuance and settlement, then inspect Sepolia separately if you want the advanced path.
        </p>
        <div className="audience-cta-grid">
          <button type="button" className="audience-cta-card" onClick={onOpenEvidence}>
            <span className="audience-cta-role">1 · Evidence Lab</span>
            <span className="audience-cta-action">Load sample CSV → validate → receipt</span>
          </button>
          <button type="button" className="audience-cta-card" onClick={onOpenCurrency}>
            <span className="audience-cta-role">2 · Currency Lab</span>
            <span className="audience-cta-action">Simulate issuance, payments, shortfall</span>
          </button>
          <button type="button" className="audience-cta-card" onClick={onOpenSepolia}>
            <span className="audience-cta-role">3 · Sepolia Proof</span>
            <span className="audience-cta-action">Read-only metrics · optional MetaMask</span>
          </button>
          <a className="audience-cta-card" href={HARDWARE_QUICKSTART_URL} target="_blank" rel="noreferrer">
            <span className="audience-cta-role">Optional · CLI / hardware</span>
            <span className="audience-cta-action">Operator commands for forks →</span>
          </a>
        </div>
      </section>

      {/* §2 Proof pipeline */}
      <section className="public-lab-section" aria-labelledby="pipeline-heading">
        <h2 id="pipeline-heading">The proof pipeline</h2>
        <p className="public-lab-section-lead">
          One screen: how renewable evidence becomes a bounded settlement object on testnet.
        </p>
        <div className="public-lab-pipeline">
          {pipelineSteps.map((step) => (
            <PipelineStep
              key={step.label}
              label={step.label}
              status={step.status}
            />
          ))}
        </div>
      </section>

      {/* §3 What is real today */}
      <section className="public-lab-section public-lab-proof-strip" aria-labelledby="proof-heading">
        <p className="public-lab-proof-eyebrow">Proof at a glance</p>
        <h2 id="proof-heading">What is real today</h2>
        <p className="public-lab-sync-note">
          <span className="public-lab-sync-primary">
            {dataSource}
            {syncedAt ? ` · ${formatSyncedAt(syncedAt)}` : null}
          </span>
          <span
            className="public-lab-sync-footnote"
            title="Run npm run foundation:sync locally before citing live Sepolia state."
          >
            How to refresh
          </span>
        </p>
        <table className="proof-strip-table">
          <thead>
            <tr>
              <th>Proof</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {proofRows.map((row) => (
              <tr key={row.proof}>
                <td>{row.proof}</td>
                <td>
                  <span className={row.ready ? 'gate-ready proof-strip-status' : 'gate-blocked proof-strip-status'}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="public-lab-addresses font-mono">
          <a href={addrUrl(spkAddress)} target="_blank" rel="noreferrer">
            SPK {spkAddress.slice(0, 10)}…
          </a>
          <a href={addrUrl(currencyAddress)} target="_blank" rel="noreferrer">
            Payments {currencyAddress.slice(0, 10)}…
          </a>
        </div>
      </section>

      {/* §4 Why this matters */}
      <section className="public-lab-section" aria-labelledby="why-heading">
        <h2 id="why-heading">Why this matters</h2>
        <p className="public-lab-section-lead">
          SolarPunk is useful because it turns renewable-energy evidence into a testable settlement object —
          not because it claims to be legal money today.
        </p>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Foundation</th>
                <th>Mechanism</th>
                <th>Limit</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.foundation} className={row.highlight ? 'comparison-highlight' : undefined}>
                  <td data-label="Foundation">{row.foundation}</td>
                  <td data-label="Mechanism">{row.mechanism}</td>
                  <td data-label="Limit">{row.problem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* §5 Who should care */}
      <section className="public-lab-section" aria-labelledby="audience-heading">
        <h2 id="audience-heading"><Users size={18} /> Who should care</h2>
        <div className="audience-grid">
          {AUDIENCE_CARDS.map(({ icon: Icon, title, body }) => (
            <article key={title} className="public-lab-card audience-card">
              <Icon size={22} className="text-primary" />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* §6 Launch gates */}
      <section className="public-lab-section public-lab-gates" aria-labelledby="gates-heading">
        <h2 id="gates-heading">Launch gates</h2>
        <p className="public-lab-section-lead">
          Blocked paths are intentional — they are why the lab is credible.
        </p>
        <table className="public-lab-gate-table">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Public Lab v1.0</td>
              <td><span className="gate-ready">Shipped</span></td>
            </tr>
            <tr>
              <td>Closed pilot</td>
              <td><span className="gate-blocked">Blocked</span> — real operator meter/inverter data</td>
            </tr>
            <tr>
              <td>Paid / mainnet</td>
              <td><span className="gate-blocked">Blocked</span> — audit, legal, reserves, governance</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* §7 External ask */}
      <section className="public-lab-section public-lab-external-ask" aria-labelledby="external-heading">
        <h2 id="external-heading">What would make this external?</h2>
        <p className="public-lab-external-lead">
          <strong>Next external gate: one real meter or inverter export.</strong>
        </p>
        <p className="public-lab-section-lead">
          Public Lab v1.0 is complete. The next validation step is not mainnet. It is one real or
          semi-real renewable-energy dataset passed through the same attestation and testnet settlement pipeline.
        </p>
        <div className="public-lab-cta">
          <a className="wallet-button" href={HARDWARE_QUICKSTART_URL} target="_blank" rel="noreferrer">
            <Database size={17} /> Run hardware validation
          </a>
          <a className="ghost-button" href={PUBLIC_LAB_INQUIRY_URL} target="_blank" rel="noreferrer">
            <ExternalLink size={17} /> Propose closed pilot data
          </a>
          <a className="ghost-button" href={PILOT_ASK_DOC} target="_blank" rel="noreferrer">
            <BookOpen size={17} /> Read the data ask
          </a>
        </div>
      </section>

      {/* Audience-specific entry points */}
      <section className="public-lab-section" aria-labelledby="entry-heading">
        <h2 id="entry-heading">Find your entry point</h2>
        <div className="audience-cta-grid">
          <button type="button" className="audience-cta-card audience-cta-button" onClick={onOpenResearch}>
            <span className="audience-cta-role">I&apos;m a researcher</span>
            <span className="audience-cta-action">Thesis, CEIR diagnosis, evidence →</span>
          </button>
          <button type="button" className="audience-cta-card audience-cta-button" onClick={onOpenEvidence}>
            <span className="audience-cta-role">I have energy data</span>
            <span className="audience-cta-action">Evidence Lab (browser) →</span>
          </button>
          <button type="button" className="audience-cta-card audience-cta-button" onClick={onOpenSepolia}>
            <span className="audience-cta-role">I&apos;m technical</span>
            <span className="audience-cta-action">Advanced — Sepolia Proof →</span>
          </button>
          <a className="audience-cta-card" href={PUBLIC_LAB_DOC} target="_blank" rel="noreferrer">
            <span className="audience-cta-role">I&apos;m an advisor / reviewer</span>
            <span className="audience-cta-action">Public Lab v1 doc →</span>
          </a>
        </div>
        <p className="muted" style={{ marginTop: '0.75rem' }}>
          <a href={THESIS_PDF_URL} target="_blank" rel="noreferrer">Thesis PDF (v10)</a>
          {' · '}
          <a href={CEIR_DIAGNOSIS_URL} target="_blank" rel="noreferrer">CEIR final diagnosis</a>
        </p>
      </section>

      {/* Non-claims */}
      <div className="public-lab-disclaimer">
        <h2><ShieldAlert size={18} /> What this is not</h2>
        <ul>
          <li>Not a token sale, mainnet launch, or legal tender</li>
          <li>Not a stablecoin or live dollar peg</li>
          <li>Not a legal claim on delivered physical energy</li>
          <li>Not audited production governance or investment advice</li>
        </ul>
      </div>

      <footer className="public-lab-footer">
        <a href={PUBLIC_LAB_DOC} target="_blank" rel="noreferrer">PUBLIC_LAB_V1.md</a>
        <a href={EVIDENCE_URL} target="_blank" rel="noreferrer">Evidence pack</a>
        <a href={PILOT_ASK_DOC} target="_blank" rel="noreferrer">Pilot data ask</a>
        <a href={GITHUB_REPO} target="_blank" rel="noreferrer">GitHub</a>
      </footer>
    </section>
  );
}
