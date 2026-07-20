import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function initiallyOpen(defaultOpen) {
  if (defaultOpen) return true;
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(min-width: 681px)').matches;
}

export default function ResponsiveDisclosure({
  id,
  label,
  title,
  meta = null,
  defaultOpen = false,
  className = '',
  children,
}) {
  const [open, setOpen] = useState(() => initiallyOpen(defaultOpen));
  const classes = ['responsive-disclosure', className].filter(Boolean).join(' ');
  return (
    <details
      id={id}
      className={classes}
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
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
