import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  Lock,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import launchGate from '../../../state/product/launch_gate.json';
import { GITHUB_REPO } from '../constants/contracts';

const modeCopy = {
  public_testnet_product: {
    title: 'Public Lab',
    subtitle: 'Launch now',
    body: 'Open demo, Sepolia proof, signed-meter fixture, CSV onboarding path, daily keeper evidence, and public docs.',
  },
  closed_testnet_pilot: {
    title: 'Closed Testnet Pilot',
    subtitle: 'Next build target',
    body: 'Needs governed attested-SPK redeploy plus one real meter or inverter adapter before a named pilot.',
  },
  paid_mainnet_product: {
    title: 'Paid/Mainnet Product',
    subtitle: 'Hard blocked',
    body: 'Needs audit, legal/commercial scope, redemption policy, and production deployment before accepting value.',
  },
};

function statusIcon(status) {
  return status === 'launchable' ? <CheckCircle2 size={18} /> : <Lock size={18} />;
}

function statusClass(status) {
  return status === 'launchable' ? 'launchable' : 'blocked';
}

function firstBlockingCheck(mode) {
  return mode.checks.find((check) => check.blocking && !check.pass);
}

export default function LaunchConsole() {
  const modes = Object.entries(launchGate.modes);
  const publicMode = launchGate.modes.public_testnet_product;
  const nextMode = launchGate.modes[launchGate.next_build_target];

  return (
    <section className="launch-shell">
      <div className="proof-hero launch-hero">
        <div>
          <div className="eyebrow"><FlaskConical size={14} /> SolarPunk Public Lab</div>
          <h1>Open the lab. Keep real-money launch gated.</h1>
          <p>
            The public lab is the launchable product surface before paid production:
            reviewers, builders, and pilot prospects can inspect the signed-meter path,
            reproduce the mint, test CSV onboarding, and watch the daily real-data keeper.
          </p>
        </div>
        <div className={`system-tile ${publicMode.status === 'launchable' ? 'good' : 'warn'}`}>
          <div className="system-title">
            {publicMode.status === 'launchable' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            Current Launch
          </div>
          <div className="system-grid">
            <span>Recommended</span><strong>{launchGate.recommended_current_launch}</strong>
            <span>Next target</span><strong>{launchGate.next_build_target}</strong>
            <span>Generated</span><strong>{new Date(launchGate.generated_at).toISOString().slice(0, 10)}</strong>
          </div>
        </div>
      </div>

      <div className="launch-mode-grid">
        {modes.map(([key, mode]) => {
          const copy = modeCopy[key] || { title: mode.label, subtitle: mode.status, body: '' };
          const blocker = firstBlockingCheck(mode);
          return (
            <div key={key} className={`launch-mode-card ${statusClass(mode.status)}`}>
              <div className="launch-mode-title">
                {statusIcon(mode.status)}
                <div>
                  <strong>{copy.title}</strong>
                  <span>{copy.subtitle}</span>
                </div>
              </div>
              <p>{copy.body}</p>
              <div className="readiness-row">
                <span>Status</span>
                <strong className={mode.status === 'launchable' ? 'ready' : 'not-ready'}>{mode.status}</strong>
              </div>
              <div className="readiness-row">
                <span>Passed</span>
                <strong>{mode.passed_checks}</strong>
              </div>
              <div className="readiness-row">
                <span>Blocking</span>
                <strong>{mode.blocking_checks}</strong>
              </div>
              {blocker && (
                <div className="launch-blocker">
                  <span>First blocker</span>
                  <strong>{blocker.name}</strong>
                  <p>{blocker.message}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="proof-main-grid bottom">
        <div className="panel">
          <div className="panel-heading compact">
            <div>
              <div className="panel-kicker"><Wrench size={14} /> Build Target</div>
              <h2>What to build next</h2>
            </div>
          </div>
          <div className="scope-list">
            {launchGate.next_actions.map((action) => (
              <div key={action}>{action}</div>
            ))}
          </div>
          {nextMode && (
            <div className="scope-note">
              Next gate is `{launchGate.next_build_target}` with {nextMode.blocking_checks} blocking checks.
              Do not move to real-money launch until this gate and the paid/mainnet gate pass.
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-heading compact">
            <div>
              <div className="panel-kicker"><ShieldCheck size={14} /> Launch Receipts</div>
              <h2>Product evidence to show</h2>
            </div>
          </div>
          <div className="proof-links">
            <a href={`${GITHUB_REPO}/blob/main/docs/product/PRODUCT_LAUNCH_GATE.md`} target="_blank" rel="noreferrer">
              Launch gate <ExternalLink size={12} />
            </a>
            <a href={`${GITHUB_REPO}/blob/main/docs/product/PUBLIC_LAB.md`} target="_blank" rel="noreferrer">
              Public lab model <ExternalLink size={12} />
            </a>
            <a href={`${GITHUB_REPO}/blob/main/docs/product/SPK_PRODUCT_EMPIRICS.md`} target="_blank" rel="noreferrer">
              Product empirics <ExternalLink size={12} />
            </a>
            <a href={`${GITHUB_REPO}/blob/main/docs/product/SPK_PUBLIC_READBACK.md`} target="_blank" rel="noreferrer">
              Public readback <ExternalLink size={12} />
            </a>
            <a href={`${GITHUB_REPO}/blob/main/PRODUCT_LAUNCH_READINESS.md`} target="_blank" rel="noreferrer">
              Launch readiness <ExternalLink size={12} />
            </a>
          </div>
          <div className="scope-note">
            This is the product answer after grant submissions: operate SolarPunk as a public lab,
            collect external proof, then build toward a closed pilot with one real meter source and governed deployment.
          </div>
        </div>
      </div>
    </section>
  );
}
