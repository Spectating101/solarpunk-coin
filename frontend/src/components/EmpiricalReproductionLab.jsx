import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Download,
  FileCheck2,
  Fingerprint,
  Hash,
  LockKeyhole,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';

const STUDY_ROOT = `${import.meta.env.BASE_URL}empirical/market-capacity-v1`;
const INTEGRITY_FILE = 'bundle-integrity.json';

function shortHash(value, chars = 18) {
  if (!value) return '—';
  return `${String(value).slice(0, chars)}…`;
}

function fmtBytes(value) {
  if (value < 1024) return `${value} B`;
  return `${(value / 1024).toFixed(1)} KiB`;
}

async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function downloadReceipt(receipt) {
  const blob = new Blob([`${JSON.stringify(receipt, null, 2)}\n`], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'policy-lab-public-reproduction-receipt.json';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function EmpiricalReproductionLab({ onOpenRuns }) {
  const [state, setState] = useState({ status: 'loading', manifest: null, files: [], error: null });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;

    async function verify() {
      try {
        const manifestResponse = await fetch(`${STUDY_ROOT}/${INTEGRITY_FILE}`, { cache: 'no-store' });
        if (!manifestResponse.ok) throw new Error(`Integrity manifest unavailable (${manifestResponse.status})`);
        const manifest = await manifestResponse.json();

        const files = await Promise.all(Object.entries(manifest.files).map(async ([name, expected]) => {
          const response = await fetch(`${STUDY_ROOT}/${name}`, { cache: 'no-store' });
          if (!response.ok) throw new Error(`${name} unavailable (${response.status})`);
          const text = await response.text();
          const actual = await sha256(text);
          return {
            name,
            expected,
            actual,
            bytes: new TextEncoder().encode(text).byteLength,
            match: actual === expected,
          };
        }));

        if (alive) setState({ status: files.every((file) => file.match) ? 'exact' : 'mismatch', manifest, files, error: null });
      } catch (error) {
        if (alive) setState({ status: 'error', manifest: null, files: [], error: error.message || String(error) });
      }
    }

    verify();
    return () => { alive = false; };
  }, []);

  const receipt = useMemo(() => {
    if (!state.manifest) return null;
    return {
      schema: 'constraint.empirical.public_reproduction_receipt.v1',
      study_id: state.manifest.study_id,
      verification_status: state.status === 'exact' ? 'EXACT_PUBLIC_BUNDLE' : 'MISMATCH',
      hash_algorithm: state.manifest.hash_algorithm,
      source_dataset_sha256: state.manifest.source_dataset_sha256,
      verified_files: state.files.map(({ name, expected, actual, bytes, match }) => ({ name, expected, actual, bytes, match })),
      boundary: state.manifest.boundary,
    };
  }, [state]);

  const copyReceipt = async () => {
    if (!receipt) return;
    await navigator.clipboard.writeText(JSON.stringify(receipt, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  if (state.status === 'loading') {
    return <section className="reproduction-load"><RotateCcw size={22} className="spin" /><strong>Hashing committed empirical bundle in this browser…</strong></section>;
  }

  if (state.status === 'error') {
    return <section className="reproduction-load error"><ShieldAlert size={22} /><strong>Public reproduction check failed to run.</strong><span>{state.error}</span></section>;
  }

  const exact = state.status === 'exact';

  return (
    <section className="reproduction-lab" aria-labelledby="reproduction-heading">
      <header className="reproduction-hero">
        <div>
          <p className="empirical-kicker">Policy Lab · reproduce public run</p>
          <h1 id="reproduction-heading">Do the published study bytes match the committed receipt?</h1>
          <p>The browser independently fetches each public aggregate artifact, computes SHA-256 over the exact UTF-8 bytes, and compares the result with the committed integrity manifest.</p>
        </div>
        <div className={`reproduction-verdict ${exact ? 'exact' : 'mismatch'}`}>
          {exact ? <CheckCircle2 size={28} /> : <ShieldAlert size={28} />}
          <span>REPRODUCTION STATUS</span>
          <strong>{exact ? 'EXACT' : 'MISMATCH'}</strong>
          <small>{state.files.filter((file) => file.match).length} / {state.files.length} artifact hashes match</small>
        </div>
      </header>

      <div className="reproduction-flow" aria-label="Public reproduction flow">
        <span>COMMITTED MANIFEST</span><ArrowRight size={15} /><span>FETCH PUBLIC BYTES</span><ArrowRight size={15} /><span>SHA-256</span><ArrowRight size={15} /><span>COMPARE</span><ArrowRight size={15} /><strong>{exact ? 'EXACT' : 'FAIL'}</strong>
      </div>

      <div className="reproduction-grid">
        <main className="reproduction-workspace">
          <section className="empirical-panel">
            <div className="empirical-panel-head">
              <div><p className="empirical-kicker">Artifact verification</p><h3>Exact byte identity, file by file.</h3></div>
              <FileCheck2 size={19} aria-hidden />
            </div>
            <div className="reproduction-file-list">
              {state.files.map((file, index) => (
                <article key={file.name} className={file.match ? 'match' : 'mismatch'}>
                  <span className="reproduction-index">{String(index + 1).padStart(2, '0')}</span>
                  <div className="reproduction-file-name"><strong>{file.name}</strong><small>{fmtBytes(file.bytes)}</small></div>
                  <div><span>expected</span><code>{file.expected}</code></div>
                  <div><span>browser</span><code>{file.actual}</code></div>
                  <strong className="reproduction-file-state">{file.match ? 'MATCH' : 'MISMATCH'}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="empirical-panel reproduction-identity-panel">
            <div className="empirical-panel-head">
              <div><p className="empirical-kicker">Identity chain</p><h3>What this check establishes — and what it does not.</h3></div>
              <Fingerprint size={19} aria-hidden />
            </div>
            <div className="reproduction-identity-chain">
              <div><span>Licensed source package</span><code>{shortHash(state.manifest.source_dataset_sha256, 24)}</code><small>identity disclosed; raw bytes private</small></div>
              <ArrowRight size={18} />
              <div><span>Public aggregate bundle</span><strong>{state.files.length} artifacts</strong><small>exact browser hashes verified</small></div>
              <ArrowRight size={18} />
              <div><span>Receipt</span><strong>{exact ? 'EXACT_PUBLIC_BUNDLE' : 'MISMATCH'}</strong><small>downloadable machine-readable result</small></div>
            </div>
          </section>

          <section className="empirical-boundary-panel">
            <LockKeyhole size={21} aria-hidden />
            <div><strong>Verification boundary</strong><p>{state.manifest.boundary}</p></div>
          </section>
        </main>

        <aside className="reproduction-receipt">
          <p className="empirical-kicker">Reproduction receipt</p>
          <h2>CP-REPRO-PUBLIC-0001</h2>
          <div className={`dossier-state ${exact ? '' : 'warning'}`}><i /><span>{exact ? 'EXACT PUBLIC BUNDLE' : 'HASH MISMATCH'}</span></div>
          <dl>
            <div><dt>Study</dt><dd>{state.manifest.study_id}</dd></div>
            <div><dt>Algorithm</dt><dd>{state.manifest.hash_algorithm}</dd></div>
            <div><dt>Hash scope</dt><dd>{state.manifest.hash_scope}</dd></div>
            <div><dt>Verified files</dt><dd>{state.files.filter((file) => file.match).length} / {state.files.length}</dd></div>
            <div><dt>Source identity</dt><dd><code>{shortHash(state.manifest.source_dataset_sha256)}</code></dd></div>
          </dl>
          <button type="button" className="ghost-button empirical-download" onClick={() => downloadReceipt(receipt)}><Download size={15} /> Download receipt</button>
          <button type="button" className="ghost-button empirical-download" onClick={copyReceipt}><Copy size={15} /> {copied ? 'Copied' : 'Copy receipt JSON'}</button>
          <button type="button" className="reproduction-return" onClick={onOpenRuns}>Return to full study <ArrowRight size={15} /></button>
          <div className="dossier-boundary"><Hash size={15} /><p>This check runs locally in the browser. It does not upload licensed source data or require a wallet.</p></div>
        </aside>
      </div>
    </section>
  );
}
