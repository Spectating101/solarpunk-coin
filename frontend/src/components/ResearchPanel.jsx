import React from 'react';
import { BookOpen, ExternalLink, FileText } from 'lucide-react';
import { GITHUB_REPO, DOCS_MAP_URL, PUBLIC_LAB_DEMO_URL } from '../constants/contracts';

const LINKS = [
  {
    title: 'Thesis (v10 submission PDF)',
    href: `${GITHUB_REPO}/blob/main/energy_constraint_thesis_final_submission_v10.pdf`,
    note: 'Canonical rendered manuscript. Corrected CEIR-boundary revision may replace this when committed.',
  },
  {
    title: 'CEIR final diagnosis',
    href: `${GITHUB_REPO}/blob/main/thesis_package/CEIR_FINAL_DIAGNOSIS.md`,
    note: 'Boundary / negative-identification audit — not a validation of SPK.',
  },
  {
    title: 'Negative-control results',
    href: `${GITHUB_REPO}/blob/main/thesis_package/empirical_results/ceir_final_negative_controls.csv`,
    note: 'CEIR vs MCap/cum TWh vs MCap/cum days.',
  },
  {
    title: 'SPK v1 evidence pack',
    href: `${GITHUB_REPO}/blob/main/thesis_package/SPK_V1_EVIDENCE.md`,
    note: 'Sepolia contracts, payments, and reproduction notes.',
  },
  {
    title: 'Public Lab v1.0 limitations',
    href: `${GITHUB_REPO}/blob/main/docs/product/PUBLIC_LAB_V1.md`,
    note: 'What the lab is and is not; launch gates.',
  },
  {
    title: 'Source code',
    href: GITHUB_REPO,
    note: 'Full repository on GitHub.',
  },
  {
    title: 'Reproduction / docs map',
    href: DOCS_MAP_URL,
    note: 'Commands and canonical files.',
  },
  {
    title: 'Citation / demo URL',
    href: PUBLIC_LAB_DEMO_URL,
    note: 'Public demo mirror (when published).',
  },
];

export default function ResearchPanel() {
  return (
    <section className="workbench-panel research-panel" aria-labelledby="research-heading">
      <header className="workbench-panel-header">
        <p className="eyebrow">Research surface</p>
        <h1 id="research-heading">
          <BookOpen size={22} aria-hidden /> Research
        </h1>
        <p className="workbench-lead">
          Thesis, CEIR diagnosis, evidence pack, and limitations. The retired Markdown grounded
          manuscript is not the primary thesis link.
        </p>
      </header>

      <ul className="research-link-list">
        {LINKS.map((item) => (
          <li key={item.href}>
            <a href={item.href} target="_blank" rel="noreferrer" className="research-link-card">
              <FileText size={18} aria-hidden />
              <div>
                <strong>{item.title}</strong>
                <span>{item.note}</span>
              </div>
              <ExternalLink size={16} aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
