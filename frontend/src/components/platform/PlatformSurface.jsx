import React from 'react';
import { ArrowRight, Layers3 } from 'lucide-react';

export function humanize(value) {
  return String(value || '—').replaceAll('_', ' ').toLowerCase();
}

export function shortHash(value, start = 10, end = 8) {
  if (!value) return 'pending';
  if (value.length <= start + end + 1) return value;
  return `${value.slice(0, start)}…${value.slice(-end)}`;
}

export function formatQuantity(value, maximumFractionDigits = 5) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return Number(value).toLocaleString(undefined, { maximumFractionDigits });
}

export function PlatformPageIntro({
  kicker,
  title,
  description,
  viewMode,
  children,
}) {
  return (
    <header className="platform-page-intro">
      <div>
        <span className="wb-kicker"><Layers3 size={13} /> {kicker}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <aside className="platform-mode-note">
        <span>{viewMode === 'full' ? 'Full analysis' : 'Overview'}</span>
        <strong>{viewMode === 'full' ? 'Complete inspection depth' : 'Complete interpreted result'}</strong>
        <p>
          {viewMode === 'full'
            ? 'All supported variables, identities, rules, boundaries, and reproducible artifacts remain available.'
            : 'The material result, reason, limitation, and path to proof remain visible without requiring specialist navigation.'}
        </p>
        {children}
      </aside>
    </header>
  );
}

export function ValueFlow({ requested, justified, covered, blocked = false }) {
  return (
    <div className="platform-value-flow" aria-label="Requested, justified, and covered quantity">
      <div><span>Requested</span><strong>{formatQuantity(requested)}</strong></div>
      <ArrowRight size={18} aria-hidden />
      <div><span>Justified</span><strong>{blocked ? '—' : formatQuantity(justified)}</strong></div>
      <ArrowRight size={18} aria-hidden />
      <div><span>Covered</span><strong>{blocked ? '—' : formatQuantity(covered)}</strong></div>
    </div>
  );
}

export function StatusBadge({ children, tone = 'neutral' }) {
  return <span className={`platform-status-badge ${tone}`}>{children}</span>;
}

export function LinkButton({ children, onClick, primary = false, disabled = false }) {
  return (
    <button
      type="button"
      className={primary ? 'platform-link-button primary' : 'platform-link-button'}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{children}</span><ArrowRight size={14} />
    </button>
  );
}

export function EmptyState({ children }) {
  return <div className="platform-empty-state" aria-live="polite">{children}</div>;
}
