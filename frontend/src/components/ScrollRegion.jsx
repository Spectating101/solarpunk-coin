import React from 'react';

/**
 * A container that scrolls. Browsers do not make a scrollable box keyboard-reachable unless it
 * is focusable, so keyboard users could not read clipped content; a named, focusable region
 * lets them scroll it with the arrow keys.
 */
export default function ScrollRegion({ label, as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag className={className || undefined} role="region" aria-label={label} tabIndex={0} {...rest}>
      {children}
    </Tag>
  );
}
