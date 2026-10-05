import React from 'react';
import { GITHUB_REPO } from '../constants/contracts';

const DOCS = Object.freeze([
  ['Public-interest statement', 'PUBLIC_INTEREST.md'],
  ['Governance', 'GOVERNANCE.md'],
  ['Privacy', 'PRIVACY.md'],
  ['Security', 'SECURITY.md'],
  ['Code of conduct', 'CODE_OF_CONDUCT.md'],
  ['Licence (MIT)', 'LICENSE'],
]);

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        Policy Lab is open research software. It is not a token, a financial product, or legal or investment advice,
        and it does not hold funds.
      </p>
      <nav aria-label="Project documents">
        {DOCS.map(([label, file]) => (
          <a key={file} href={`${GITHUB_REPO}/blob/main/${file}`} target="_blank" rel="noreferrer">{label}</a>
        ))}
        <a href={GITHUB_REPO} target="_blank" rel="noreferrer">Source code</a>
      </nav>
    </footer>
  );
}
