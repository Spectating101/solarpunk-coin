import React from 'react';

/**
 * A short note placed directly under a result: what the evidence is, and what
 * the result does not establish. Content is supplied by the caller so it can be
 * driven by the same data as the result it qualifies.
 */
export default function SourceAndLimits({ title = 'Source and limits', children }) {
  return (
    <div className="source-limits" role="note">
      <strong>{title}</strong>
      <p>{children}</p>
    </div>
  );
}

const LIST = new Intl.ListFormat('en', { style: 'long', type: 'disjunction' });

export function joinOr(items) {
  return LIST.format(items);
}
