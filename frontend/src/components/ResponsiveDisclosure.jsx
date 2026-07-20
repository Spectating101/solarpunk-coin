import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function ResponsiveDisclosure({
  id,
  label,
  title,
  meta = null,
  defaultOpen = false,
  className = '',
  children,
}) {
  const classes = ['responsive-disclosure', className].filter(Boolean).join(' ');
  return (
    <details id={id} className={classes} open={defaultOpen}>
      <summary>
        <span>
          {label ? <small>{label}</small> : null}
          <strong>{title}</strong>
        </span>
        <span className="responsive-disclosure-meta">
          {meta ? <small>{meta}</small> : null}
          <ChevronDown size={17} aria-hidden />
        </span>
      </summary>
      <div className="responsive-disclosure-body">{children}</div>
    </details>
  );
}
